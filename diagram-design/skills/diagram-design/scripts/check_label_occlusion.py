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

WHAT THIS CANNOT SEE. Free text without a mask rect has no bbox here and
passes vacuously — radar axis names, venn set names, italic callouts. Subtrees
under scale/rotate/matrix/skew are skipped with a WARN, never silently. It
does not measure a mask covering a stroke it should clear (that is the 6-10px
gap rule), text overflowing its own box (check_overflow.py's job), collisions
between two labels, or anything in raster output. Render the figure and look
at it; this checker is the floor, not the ceiling.
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


def _opaque(attrs):
    fill = _style_get(attrs, "fill") or attrs.get("fill", "#000")
    if fill.strip().lower() in ("none", "transparent"):
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
    parsed_any, total = False, 0
    for path in args:
        ok, n = check_file(path, list_mode, sys.stdout)
        parsed_any = parsed_any or ok
        total += n
    if not parsed_any:
        return 2
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
