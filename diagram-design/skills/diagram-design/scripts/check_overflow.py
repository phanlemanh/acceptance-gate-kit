#!/usr/bin/env python3
"""Report text that overflows the box or mask meant to contain it.

Why this exists: a label can look fine and still be broken. Vietnamese stacks a
circumflex under a grave (Ầ Ề Ồ), which rises well above Latin cap height, so a
tag box sized to Latin clips the accent — and a clipped accent reads as a
*different word*, not as a rendering glitch. Eyeballing misses it; so does
checking only the horizontal axis, which is how a real defect survived review.

Usage:
    python3 scripts/check_overflow.py assets/example-raci.html [more.html ...]
    python3 scripts/check_overflow.py assets/example-*.html

Exit code 1 if any overflow is found, so it can gate a commit.

Requires Google Chrome. Measurement runs in the real layout engine because font
metrics — especially stacked diacritics — cannot be predicted from the markup.

WHAT THIS CANNOT SEE. It only judges labels that sit inside a box, so a clean run
proves less on some types than others. Free-floating text — radar axis labels,
venn set names, sankey ribbon values, timeline event captions, any italic callout
with no mask — has no container to overflow, and passes vacuously. It also says
nothing about a label colliding with a connector, a mask covering a stroke it
should clear, or legend items running into each other. Render the diagram and
look at it; treat the checker as the floor, not the ceiling.
"""
import http.server, json, os, socketserver, subprocess, sys, tempfile, threading
from pathlib import Path

CHROME_CANDIDATES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "google-chrome", "chromium",
]

MEASURE_PAGE = """<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
<pre id="out"></pre><script>
const files = new URLSearchParams(location.search).get('f').split('|');
(async () => {
  const report = [];
  for (const f of files) {
    try {
      const html = await (await fetch(f)).text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      // Styles must be scoped to one file. Appending each file's <style> to a shared
      // head lets rules pile up: a class defined by an earlier file leaks into a later
      // one that declares the same class without the same properties, and the label
      // silently renders under foreign rules. That produced phantom overflows — and
      // could just as easily hide a real one — so every file gets a fresh set.
      document.querySelectorAll('style[data-probe]').forEach(s => s.remove());
      doc.head.querySelectorAll('link[rel=stylesheet]').forEach(l => {
        if (![...document.head.querySelectorAll('link')].some(x => x.href === l.href))
          document.head.append(l.cloneNode());   // fonts only — safe to share and slow to refetch
      });
      doc.head.querySelectorAll('style').forEach(s => {
        const c = s.cloneNode(true); c.setAttribute('data-probe', '1'); document.head.append(c);
      });
      const svg = doc.querySelector('svg');
      if (!svg) { continue; }
      svg.style.cssText = 'position:absolute;left:-9999px;top:0';
      document.body.append(svg);
      await new Promise(r => setTimeout(r, 150));
      // candidate containers: tag boxes, label masks, node boxes — not the page rect
      const boxes = [...svg.querySelectorAll('rect')].map(r => ({
        x: +r.getAttribute('x') || 0, y: +r.getAttribute('y') || 0,
        w: +r.getAttribute('width') || 0, h: +r.getAttribute('height') || 0,
      })).filter(r => r.w > 0 && r.w < 460 && r.h > 0 && r.h < 120);
      for (const t of svg.querySelectorAll('text')) {
        let b; try { b = t.getBBox(); } catch (e) { continue; }
        if (!b.width) continue;
        const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
        // smallest box whose area contains the label's centre
        const host = boxes
          .filter(r => cx >= r.x - 2 && cx <= r.x + r.w + 2 && cy >= r.y - 6 && cy <= r.y + r.h + 6)
          .sort((a, z) => a.w * a.h - z.w * z.h)[0];
        if (!host) continue;
        const over = {
          left:  host.x - b.x,
          right: (b.x + b.width) - (host.x + host.w),
          top:   host.y - b.y,
          bottom:(b.y + b.height) - (host.y + host.h),
        };
        const worst = Object.entries(over).sort((a, z) => z[1] - a[1])[0];
        if (worst[1] > 0.5) {
          report.push({ file: f, text: t.textContent.trim().slice(0, 40),
                        size: t.getAttribute('font-size'), side: worst[0],
                        px: +worst[1].toFixed(1),
                        box: `${host.x},${host.y} ${host.w}x${host.h}` });
        }
      }
      svg.remove();
    } catch (e) { report.push({ file: f, error: String(e) }); }
  }
  document.getElementById('out').textContent = 'JSON:' + JSON.stringify(report);
})();
</script></body></html>"""


def find_chrome():
    for c in CHROME_CANDIDATES:
        if os.path.sep in c:
            if Path(c).exists():
                return c
        else:
            from shutil import which
            if which(c):
                return c
    sys.exit("Không tìm thấy Chrome — bộ đo cần trình duyệt thật để lấy font metrics.")


def main(argv):
    files = [Path(a).resolve() for a in argv]
    missing = [f for f in files if not f.exists()]
    if missing:
        sys.exit(f"Không thấy: {', '.join(str(m) for m in missing)}")
    root = Path(os.path.commonpath([str(f.parent) for f in files]))

    with tempfile.TemporaryDirectory() as td:
        # Unique per process: the probe page has to live inside the served root, and
        # several checkers often run at once over the same assets/ directory. A shared
        # filename means one run deletes the page another is still fetching, which
        # surfaces as "no result" rather than as an error — easy to misread as a defect.
        page = root / f"__overflow_probe_{os.getpid()}.html"
        page.write_text(MEASURE_PAGE, encoding="utf-8")
        handler = lambda *a, **k: http.server.SimpleHTTPRequestHandler(*a, directory=str(root), **k)
        with socketserver.TCPServer(("127.0.0.1", 0), handler) as httpd:
            port = httpd.server_address[1]
            threading.Thread(target=httpd.serve_forever, daemon=True).start()
            rel = "|".join(f.relative_to(root).as_posix() for f in files)
            shot = Path(td) / "out.png"
            dump = Path(td) / "dump.txt"
            try:
                subprocess.run([
                    find_chrome(), "--headless", "--disable-gpu", "--no-sandbox",
                    f"--virtual-time-budget={3000 + 900 * len(files)}",
                    "--dump-dom", f"http://127.0.0.1:{port}/{page.name}?f={rel}",
                ], stdout=dump.open("w"), stderr=subprocess.DEVNULL, timeout=60 + 12 * len(files))
            finally:
                httpd.shutdown()
                page.unlink(missing_ok=True)
            raw = dump.read_text(errors="replace")

    marker = "JSON:"
    if marker not in raw:
        sys.exit("Bộ đo không trả kết quả — thử ít file hơn một lượt.")
    payload = raw.split(marker, 1)[1]
    payload = payload[: payload.index("]") + 1]
    findings = json.loads(payload.replace("&quot;", '"'))

    if not findings:
        print(f"✓ {len(files)} file — không có chữ nào tràn khung.")
        return 0
    by_file = {}
    for f in findings:
        by_file.setdefault(f.get("file", "?"), []).append(f)
    for fname, items in sorted(by_file.items()):
        print(f"\n{fname} — {len(items)} chỗ tràn")
        for it in items[:12]:
            if "error" in it:
                print(f"   LỖI {it['error']}")
                continue
            side = {"left": "trái", "right": "phải", "top": "lên trên", "bottom": "xuống dưới"}[it["side"]]
            print(f"   «{it['text']}» {it['size']}px → tràn {side} {it['px']}px   [khung {it['box']}]")
        if len(items) > 12:
            print(f"   … và {len(items) - 12} chỗ nữa")
    print(f"\nTổng: {len(findings)} chỗ tràn / {len(files)} file")
    return 1


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1:]))
