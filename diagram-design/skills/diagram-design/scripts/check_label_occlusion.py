#!/usr/bin/env python3
"""Report labels whose mask rect is painted over by a later opaque box (z-order).

Why this exists: SKILL.md §6 forbids a label from being hidden, but the rule
lived only as prose — a checklist the model reads and nods at. The measurable
consequence: three shipped figures carried labels partially covered by node
boxes drawn AFTER them (`GHI STATUS`, `HÌNH ĐÍNH THẺ`, `S5 GIAO`, found
2026-08-27 by comparing against archify's executable validator). A covered
label reads as a truncated word, and nobody sees it because the eye reads the
remaining letters as complete.

Usage:
    python3 scripts/check_label_occlusion.py [--list] file.svg [file.html ...]

Modes and output (one line per fact, grep-stable prefixes):
    OCCLUDED <file> nhan "<text>" khoi [x,y,w,h] chong <dx>x<dy>px
    LABEL <file> "<text>"              (only with --list: every label detected)
    WARN <file> bo qua cay con transform khong ho tro

Exit codes: 1 if any OCCLUDED, 2 if no input file could be parsed, else 0.

A "label" is the house-style unit from §6: a small mask rect (h <= 18,
w <= 220) immediately followed by a <text> element. An "occluder" is any
opaque rect (w >= 60, h >= 28, fill not none/transparent, fill-opacity and
opacity > 0.5) painted after the mask whose box overlaps it on both axes.
`.html` inputs are split into their inline <svg> blocks and each is checked.
Simple nested `translate(dx,dy)` transforms are accumulated.

WHAT THIS CANNOT SEE. **It recognises exactly one occluder shape: an opaque
`<rect>` at least 60x28.** Everything else is out of range and passes silently,
including all four of these, each verified to slip through:

  * a rect in the dead band 18 < height < 28, or narrower than 60 (a real
    cover that is simply below the size floor);
  * a filled `<path>`, `<circle>`, `<polygon>` or any non-rect shape;
  * a label whose mask is wider than 220 or taller than 18 (eyebrow strips
    and long banner labels are not treated as labels at all);
  * free text with no mask rect — radar axis names, venn set names, italic
    callouts — which has no bbox to compare.

The size and shape floors are deliberate: matching every way SVG can paint a
solid area is an open-ended list, and a checker that pretends to cover it
would be lying in the direction that matters. Prefer this narrow, honest floor
plus a human looking at the render. Transparency detection covers the KNOWN
forms — `none`, `transparent`, `fill-opacity`, `opacity`, alpha inside
`rgba()` and `#RRGGBBAA` — no more than that; round 3 disproved an earlier
"closed and complete" claim here, so treat this list too as a floor. Further
verified blind spots: a length with a unit suffix (`width="120px"`, `em`, `%`)
is dropped silently, so such a rect is neither a label nor an occluder; a
self-closing `<text/>` can make a label borrow the NEXT text's content.
Subtrees under scale/rotate/matrix/skew are skipped with a WARN, never
silently — but a transform on a leaf rect or text is not applied. It also does
not measure a mask covering a stroke it should clear (that is the 6-10px gap
rule), text overflowing its own box (check_overflow.py's job), collisions
between two labels, rects inside `<defs>`/`<pattern>`/`<clipPath>`/`<symbol>`
(counted as painted though they are not), fill inherited from an ancestor
`<g>`, or anything in raster output. A named input that cannot be read makes
the run exit 2 rather than dissolving into green. This checker is the floor,
not the ceiling.
"""
import re
import sys
from pathlib import Path

TAG = re.compile(r"<(/?)(g|rect|text)\b([^>]*?)(/?)>", re.S)
ATTR = re.compile(r'([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*"([^"]*)"')
TRANSLATE = re.compile(r"translate\(\s*(-?[\d.]+)(?:[\s,]+(-?[\d.]+))?\s*\)")
UNSUPPORTED = re.compile(r"\b(scale|rotate|matrix|skewX|skewY)\s*\(")
SVG_BLOCK = re.compile(r"<svg\b.*?</svg>", re.S)
STRIP = re.compile(r"<[^>]+>")

LABEL_MAX_W, LABEL_MAX_H = 220.0, 18.0
BOX_MIN_W, BOX_MIN_H = 60.0, 28.0
OPACITY_FLOOR = 0.5


def _num(attrs, key):
    raw = attrs.get(key, "")
    try:
        return float(raw)
    except ValueError:
        return None


def _style_get(attrs, prop):
    m = re.search(rf"(?:^|;)\s*{prop}\s*:\s*([^;]+)", attrs.get("style", ""))
    return m.group(1).strip() if m else None


def _fill_alpha(fill):
    """Alpha carried INSIDE the colour value, or None if it carries none.

    The house skin paints tint plates as `rgba(45,49,66,0.06)`, so a checker
    that only reads `fill-opacity` calls those plates opaque and accuses a
    label they do not actually hide. The alpha branch requires exactly FOUR
    components: an earlier version matched three-component `rgb()` too and
    read the BLUE channel as alpha, so `rgb(0,0,0)` — solid black — was
    judged transparent and a real cover slipped through (kit gate round 3).
    """
    m = re.match(
        r"rgba?\(\s*[^,)]+,\s*[^,)]+,\s*[^,)]+,\s*([\d.]+)(%?)\s*\)\s*$",
        fill, re.I)
    if m:
        try:
            a = float(m.group(1))
            return a / 100.0 if m.group(2) else a
        except ValueError:
            return None
    m = re.match(r"#([0-9a-f]{8}|[0-9a-f]{4})\s*$", fill, re.I)
    if m:
        h = m.group(1)
        aa = h[6:8] if len(h) == 8 else h[3] * 2
        return int(aa, 16) / 255.0
    return None


def _opaque(attrs):
    fill = (_style_get(attrs, "fill") or attrs.get("fill", "#000")).strip()
    if fill.lower() in ("none", "transparent"):
        return False
    a = _fill_alpha(fill)
    if a is not None and a <= OPACITY_FLOOR:
        return False
    for prop in ("fill-opacity", "opacity"):
        raw = _style_get(attrs, prop) or attrs.get(prop)
        if raw is not None:
            try:
                if float(raw) <= OPACITY_FLOOR:
                    return False
            except ValueError:
                pass
    return True


def scan_svg(src, fname, list_mode, out):
    """Scan one <svg> source string. Returns number of occlusions found."""
    labels = []          # [x, y, w, h, text]
    occlusions = 0
    seen = set()         # the node pattern paints mask+box twice at one spot
    warned = False
    stack = [(0.0, 0.0, False)]  # (dx, dy, skip)
    pending_mask = None  # bbox of a label-sized rect awaiting its <text>

    for m in TAG.finditer(src):
        closing, name, rawattrs, _self = m.groups()
        if name == "g":
            if closing:
                if len(stack) > 1:
                    stack.pop()
                pending_mask = None
                continue
            dx, dy, skip = stack[-1]
            attrs = dict(ATTR.findall(rawattrs))
            tr = attrs.get("transform", "")
            if UNSUPPORTED.search(tr):
                skip = True
                if not warned:
                    print(f"WARN {fname} bo qua cay con transform khong ho tro",
                          file=out)
                    warned = True
            for t in TRANSLATE.finditer(tr):
                dx += float(t.group(1))
                dy += float(t.group(2) or 0.0)
            if not _self:
                stack.append((dx, dy, skip))
            pending_mask = None
            continue

        dx, dy, skip = stack[-1]
        if skip:
            pending_mask = None
            continue
        attrs = dict(ATTR.findall(rawattrs))

        if name == "rect" and not closing:
            x, y = _num(attrs, "x") or 0.0, _num(attrs, "y") or 0.0
            w, h = _num(attrs, "width"), _num(attrs, "height")
            pending_mask = None
            if w is None or h is None:  # width="100%" etc.
                continue
            x, y = x + dx, y + dy
            if h <= LABEL_MAX_H and w <= LABEL_MAX_W:
                pending_mask = [x, y, w, h]
            elif w >= BOX_MIN_W and h >= BOX_MIN_H and _opaque(attrs):
                for lab in labels:
                    ox = min(lab[0] + lab[2], x + w) - max(lab[0], x)
                    oy = min(lab[1] + lab[3], y + h) - max(lab[1], y)
                    if ox > 0 and oy > 0:
                        msg = (f'OCCLUDED {fname} nhan "{lab[4]}" khoi '
                               f"[{x:g},{y:g},{w:g},{h:g}] "
                               f"chong {ox:.1f}x{oy:.1f}px")
                        if msg not in seen:
                            seen.add(msg)
                            print(msg, file=out)
                            occlusions += 1
            continue

        if name == "text" and not closing:
            if pending_mask is not None:
                end = src.find("</text>", m.end())
                inner = src[m.end():end] if end != -1 else ""
                text = STRIP.sub("", inner).strip()
                labels.append(pending_mask + [text])
                if list_mode:
                    print(f'LABEL {fname} "{text}"', file=out)
            pending_mask = None

    return occlusions


def check_file(path, list_mode, out):
    """Returns (parsed_ok, occlusion_count)."""
    try:
        src = Path(path).read_text(encoding="utf-8")
    except OSError as e:
        print(f"ERROR {path} khong doc duoc: {e}", file=sys.stderr)
        return False, 0
    if path.lower().endswith((".html", ".htm")):
        blocks = SVG_BLOCK.findall(src)
        if not blocks:
            print(f"WARN {path} khong co khoi <svg> nao", file=out)
            return True, 0
        return True, sum(scan_svg(b, path, list_mode, out) for b in blocks)
    return True, scan_svg(src, path, list_mode, out)


def main(argv):
    args = [a for a in argv if a != "--list"]
    list_mode = "--list" in argv
    if not args:
        print(__doc__.strip().splitlines()[0], file=sys.stderr)
        return 2
    parsed_any, read_fail, total = False, False, 0
    for path in args:
        ok, n = check_file(path, list_mode, sys.stdout)
        parsed_any = parsed_any or ok
        read_fail = read_fail or not ok
        total += n
    # Fail CLOSED: a named input that could not be read must never dissolve
    # into a green run. An earlier version returned 0 as long as one file
    # parsed, so a glob that stopped matching (figures renamed/moved) passed
    # its literal pattern here and the gate printed "clean" having scanned
    # half the corpus (kit gate round 3).
    if total:
        return 1
    if read_fail or not parsed_any:
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
