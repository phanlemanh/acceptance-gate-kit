#!/usr/bin/env python3
"""Verify authored screen ↔ backend facts: manifest ↔ SVG ↔ target file, all three in agreement.

Why this exists: a wireflow that claims "the Login screen talks to the Auth
service" draws that claim as pixels — a badge, a legend line — and nothing
holds the pixels to the architecture diagram next door. Rename the backend
node, split the service, redraw the flow: the badge keeps saying what it said
the day it was drawn. The claim is an authored FACT, so it must live as data
(a JSON manifest embedded in the HTML) and be re-checked against both files
every time — the same doctrine as archify's authored links: no inferred
facts, and no declared fact ships unverified.

Usage:
    python3 scripts/check_backs.py [--list] file.html [more.html ...]

Modes and output (one line per fact, grep-stable prefixes):
    BROKEN <file> <chi tiet>                 (a declared fact fails verification)
    FACT <file> <node> "<label>" -> <target_file>#<target_node>   (only with --list)

Exit codes: 1 if any BROKEN; 2 if any NAMED input could not be used (unreadable,
no <svg>, no manifest, malformed JSON, manifest schema violation); else 0.

What one run checks, given files that each embed
`<script type="application/json" data-diagram-facts>`:

  (a) every manifest node id exists in the SVG as `<g data-node-id="...">`
      whose group contains a <text> exactly equal to the declared label;
      every data-node-id in the SVG is declared back in the manifest;
  (b) every `backs` entry points at a target file that exists, carries its
      own manifest declaring the target node id, and draws that node's group;
  (c) every `BACKS n` badge drawn in a node group matches that node's fact
      count in the manifest — and every fact has its badge. Both directions,
      so neither the drawing nor the data can drift silently.

DIRECTION OF UNCERTAINTY — different from check_label_occlusion.py, and
deliberately so. That checker INFERS geometry, so anything it does not
understand falls toward a declared miss (never accuse on a guess). This
checker verifies AUTHORED claims: the author opted in by writing the
manifest, so a fact whose evidence cannot be opened — target file missing,
unreadable, manifest-less — is a failed fact (BROKEN, exit 1), not a skip.
"Could not verify" and "false" get the same red, because the entire point of
an authored fact is that it never ships unverified. Exit 2 is reserved for a
NAMED input this run cannot even begin on. A manifest that is internally
inconsistent (duplicate ids, a backs entry naming an undeclared node, an
unknown key — likely a typo silently dropping facts) is schema-invalid and
exits 2: nothing verified from a manifest that cannot be trusted.

WHAT THIS CANNOT SEE. **Both the diagram and the manifest come from the same
author — this checker proves the two artifacts agree with each other and
with the target file, never that either one is true of the real system.** A
wrong fact written consistently in all three places passes clean; whether
the Login screen actually calls the Auth service is the human taste gate's
question, stated here plainly rather than papered over. It also does not
read arrows, positions, or any geometry (an edge drawn to the wrong box
passes if the manifest agrees with itself); does not parse the legend's
BACKS prose (only the `BACKS n` badge shape is machine-checked); checks
target files SHALLOWLY (manifest declares the id + the group exists — the
target's own label match is only proven by running this checker on the
target, so run it on every file of the pair); and says nothing about labels
rendering legibly (check_overflow.py / check_label_occlusion.py's jobs).
This checker is the floor, not the ceiling.
"""
import json
import re
import sys
from pathlib import Path

MANIFEST = re.compile(
    r"<script\b[^>]*\bdata-diagram-facts\b[^>]*>(.*?)</script>", re.S | re.I)
SVG_BLOCK = re.compile(r"<svg\b.*?</svg>", re.S)
TAG = re.compile(r"<(/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*?)(/?)>", re.S)
TEXT_EL = re.compile(r"<text\b[^>]*?(/)?>", re.S)
STRIP = re.compile(r"<[^>]+>")
NODE_ID = re.compile(r"^[a-z0-9][a-z0-9-]*$")
BADGE = re.compile(r"^BACKS (\d+)$")

NODE_KEYS = {"id", "label"}
BACK_KEYS = {"node", "target_file", "target_node"}


def load_manifest(src):
    """Parse and schema-check the embedded manifest. Returns (manifest, error).

    Any violation returns an error string instead of a partial manifest —
    a manifest that cannot be trusted verifies nothing.
    """
    blocks = MANIFEST.findall(src)
    if not blocks:
        return None, "khong co manifest data-diagram-facts"
    if len(blocks) > 1:
        return None, "co nhieu hon mot manifest data-diagram-facts"
    try:
        data = json.loads(blocks[0])
    except ValueError as e:
        return None, f"manifest khong phai JSON hop le: {e}"
    if not isinstance(data, dict):
        return None, "manifest phai la mot object"
    extra = set(data) - {"nodes", "backs"}
    if extra:
        return None, f"khoa la trong manifest: {sorted(extra)}"
    nodes = data.get("nodes")
    if not isinstance(nodes, list) or not nodes:
        return None, "manifest phai co danh sach nodes khac rong"
    seen = set()
    for n in nodes:
        if not isinstance(n, dict) or set(n) != NODE_KEYS:
            return None, f"node phai co dung hai khoa id/label: {n!r}"
        if not isinstance(n["id"], str) or not NODE_ID.match(n["id"]):
            return None, f"id khong hop le (kebab-case a-z0-9): {n['id']!r}"
        if not isinstance(n["label"], str) or not n["label"].strip():
            return None, f"label rong cho id {n['id']!r}"
        if n["id"] in seen:
            return None, f"id trung lap: {n['id']!r}"
        seen.add(n["id"])
    backs = data.get("backs", [])
    if not isinstance(backs, list):
        return None, "backs phai la mot danh sach"
    fact_set = set()
    for b in backs:
        if not isinstance(b, dict) or set(b) != BACK_KEYS:
            return None, f"back phai co dung ba khoa node/target_file/target_node: {b!r}"
        if any(not isinstance(b[k], str) or not b[k].strip() for k in BACK_KEYS):
            return None, f"back mang gia tri rong: {b!r}"
        if b["node"] not in seen:
            return None, f"back tro toi node chua khai: {b['node']!r}"
        if Path(b["target_file"]).is_absolute():
            return None, f"target_file phai la duong dan tuong doi: {b['target_file']!r}"
        if not NODE_ID.match(b["target_node"]):
            return None, f"target_node khong hop le: {b['target_node']!r}"
        key = (b["node"], b["target_file"], b["target_node"])
        if key in fact_set:
            return None, f"fact trung lap: {key}"
        fact_set.add(key)
    return {"nodes": nodes, "backs": backs}, None


def scan_groups(svg_src):
    """Map data-node-id -> (inner source, start, end). Returns (groups, findings).

    Offsets are recorded here, at the only place they are known exactly —
    re-finding the inner text later would mis-map two groups that happen to
    share identical content, and accuse a badge that sits in a real group.

    findings collects structural defects: the attribute on a non-<g> element
    (the binding silently would not bind), a node group nested inside another
    (text scoping turns ambiguous), a duplicate group id.
    """
    groups, findings = {}, []
    stack = []  # (node_id or None) per open <g>
    open_spans = []  # (node_id, start_index, depth)
    for m in TAG.finditer(svg_src):
        closing, name, rawattrs, selfclose = m.groups()
        nid_m = re.search(r'data-node-id\s*=\s*"([^"]*)"', rawattrs)
        if name != "g":
            if nid_m and not closing:
                findings.append(
                    f'data-node-id "{nid_m.group(1)}" phai nam tren <g>, '
                    f"khong phai <{name}>")
            continue
        if closing:
            if stack:
                nid = stack.pop()
                if nid is not None and open_spans and open_spans[-1][0] == nid:
                    _, start, _ = open_spans.pop()
                    groups[nid] = (svg_src[start:m.start()], start, m.start())
            continue
        nid = nid_m.group(1) if nid_m else None
        if nid is not None:
            if any(s is not None for s in stack):
                findings.append(f'nhom node "{nid}" long trong mot nhom node khac')
                nid = None
            elif nid in groups or any(o[0] == nid for o in open_spans):
                findings.append(f'data-node-id trung lap trong SVG: "{nid}"')
                nid = None
        if selfclose:
            continue
        stack.append(nid)
        if nid is not None:
            open_spans.append((nid, m.end(), len(stack)))
    return groups, findings


def texts_in(src, base_offset=0):
    """Yield (absolute_start, collapsed_text) for each <text> element."""
    for m in TEXT_EL.finditer(src):
        if m.group(1):  # self-closing — no content
            continue
        end = src.find("</text>", m.end())
        inner = src[m.end():end] if end != -1 else ""
        yield base_offset + m.start(), " ".join(STRIP.sub("", inner).split())


def read_svg_source(path):
    """Concatenated <svg> blocks of a file, or (None, reason)."""
    try:
        src = Path(path).read_text(encoding="utf-8")
    except (OSError, ValueError) as e:
        return None, None, f"khong doc duoc: {e}"
    blocks = SVG_BLOCK.findall(src)
    if not blocks:
        return src, None, "khong co khoi <svg> nao"
    return src, "\n".join(blocks), None


# Shallow target check results are cached: a hub architecture file backed by
# many screens would otherwise be re-read and re-parsed once per fact.
_target_cache = {}


def target_declares(target_path, node_id):
    """Does target_path carry a manifest declaring node_id AND draw its group?

    Returns an error string or None. Shallow by design — the target's own
    label match is proven by running the checker on the target itself.
    """
    key = str(target_path)
    if key not in _target_cache:
        src, svg_src, err = read_svg_source(target_path)
        if err is not None:
            _target_cache[key] = (None, set(), err)
        else:
            manifest, m_err = load_manifest(src)
            if m_err is not None:
                _target_cache[key] = (None, set(), m_err)
            else:
                groups, _ = scan_groups(svg_src)
                _target_cache[key] = (
                    {n["id"] for n in manifest["nodes"]}, set(groups), None)
    declared, drawn, err = _target_cache[key]
    if err is not None:
        return err
    if node_id not in declared:
        return f'manifest dich khong khai node "{node_id}"'
    if node_id not in drawn:
        return f'SVG dich khong ve nhom node "{node_id}"'
    return None


def check_file(path, list_mode, out):
    """Returns (usable, broken_count). usable=False means exit-2 material."""
    src, svg_src, err = read_svg_source(path)
    if err is not None:
        print(f"ERROR {path} {err}", file=sys.stderr)
        return False, 0
    manifest, m_err = load_manifest(src)
    if m_err is not None:
        print(f"ERROR {path} {m_err}", file=sys.stderr)
        return False, 0

    broken = 0

    def report(msg):
        nonlocal broken
        print(f"BROKEN {path} {msg}", file=out)
        broken += 1

    groups, findings = scan_groups(svg_src)
    for f in findings:
        report(f)

    labels = {n["id"]: n["label"] for n in manifest["nodes"]}
    for nid, label in labels.items():
        if nid not in groups:
            report(f'manifest khai node "{nid}" nhung SVG khong co nhom do')
            continue
        texts = [t for _, t in texts_in(groups[nid][0])]
        if not any(t == " ".join(label.split()) for t in texts):
            report(f'nhom "{nid}" khong chua text dung bang label "{label}"')
    for nid in groups:
        if nid not in labels:
            report(f'SVG co nhom "{nid}" nhung manifest khong khai')

    counts = {nid: 0 for nid in labels}
    for b in manifest["backs"]:
        counts[b["node"]] += 1
        target = (Path(path).parent / b["target_file"])
        t_err = (f'file dich khong ton tai: {b["target_file"]}'
                 if not target.is_file()
                 else target_declares(target, b["target_node"]))
        if t_err is not None:
            report(f'fact {b["node"]} -> {b["target_file"]}#{b["target_node"]}: {t_err}')
        elif list_mode:
            print(f'FACT {path} {b["node"]} "{labels[b["node"]]}" -> '
                  f'{b["target_file"]}#{b["target_node"]}', file=out)

    # Badges — both directions. Group spans locate orphans drawn outside.
    spans = [(start, end) for _, start, end in groups.values()]
    for nid, want in counts.items():
        if nid not in groups:
            continue  # already reported as missing group
        badges = [int(m.group(1)) for _, t in texts_in(groups[nid][0])
                  for m in [BADGE.match(t)] if m]
        if want and not badges:
            report(f'node "{nid}" co {want} fact nhung khong ve badge BACKS {want}')
        for got in badges:
            if got != want:
                report(f'node "{nid}" ve badge BACKS {got} nhung manifest co '
                       f"{want} fact")
    for pos, t in texts_in(svg_src):
        if BADGE.match(t) and not any(a <= pos < b for a, b in spans):
            report(f'badge "{t}" nam ngoai moi nhom node — fact ve ra ma '
                   f"khong khai")

    return True, broken


def main(argv):
    args = [a for a in argv if a != "--list"]
    list_mode = "--list" in argv
    if not args:
        print(__doc__.strip().splitlines()[0], file=sys.stderr)
        return 2
    unusable, total = False, 0
    for path in args:
        ok, n = check_file(path, list_mode, sys.stdout)
        unusable = unusable or not ok
        total += n
    # Fail CLOSED, same discipline as the sibling checkers: findings win the
    # exit code, then any named input this run could not begin on. A glob
    # that stopped matching must never print "clean" over half the corpus.
    if total:
        return 1
    if unusable:
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
