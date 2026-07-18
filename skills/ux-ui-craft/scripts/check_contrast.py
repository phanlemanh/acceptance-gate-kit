#!/usr/bin/env python3
"""WCAG 2.x contrast gate for token palettes.

Usage:
  python check_contrast.py '#FG1' '#BG1' ['#FG2' '#BG2' ...] [--large]

Pass pairs of foreground/background hex colors (3- or 6-digit, # optional).
Prints the contrast ratio and AA pass/fail for each pair.

  --large   grade all pairs against the large-text threshold (3.0:1)
            instead of body text (4.5:1)

Exit code is non-zero if any pair fails, so the script can be used as a
hard gate in a verification loop.
"""
import sys


def _channel(c: float) -> float:
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(hex_color: str) -> float:
    h = hex_color.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(ch * 2 for ch in h)
    if len(h) != 6:
        raise ValueError(f"Bad hex color: {hex_color!r}")
    r, g, b = (int(h[i : i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * _channel(r) + 0.7152 * _channel(g) + 0.0722 * _channel(b)


def ratio(fg: str, bg: str) -> float:
    l1, l2 = sorted((luminance(fg), luminance(bg)), reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)


def main(argv: list[str]) -> int:
    args = [a for a in argv if a != "--large"]
    large = "--large" in argv
    threshold = 3.0 if large else 4.5

    if len(args) < 2 or len(args) % 2 != 0:
        print(__doc__)
        return 2

    pairs = list(zip(args[0::2], args[1::2]))
    width = max(len(f"{fg} on {bg}") for fg, bg in pairs)
    label = "large text" if large else "body text"
    print(f"AA threshold: {threshold}:1 ({label})\n")

    failed = 0
    for fg, bg in pairs:
        try:
            r = ratio(fg, bg)
        except ValueError as e:
            print(f"  {e}")
            failed += 1
            continue
        ok = r >= threshold
        failed += 0 if ok else 1
        mark = "PASS" if ok else "FAIL"
        print(f"  {f'{fg} on {bg}':<{width}}   {r:5.2f}:1   {mark}")

    print(f"\n{len(pairs) - failed}/{len(pairs)} pairs pass.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
