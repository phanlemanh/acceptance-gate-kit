#!/usr/bin/env bash
# E7 (AC-5) của hồ sơ rang-phep-do-viec-cua-anh: vật thật KHÔNG trôi so với
# base tường minh. Vật thật = scripts/gate-card.js + khuôn
# YOUR-MOVE-BLOCK-TEMPLATE + câu GATE-INVITE-CLAUSE + chỗ đặt clause trong
# các site nguồn. Chỉ manifest GATE-INVITE-SITES được phép đổi (thêm số đếm).
# Base truyền tường minh (mặc định origin/main) — `git diff` không base bị
# loại vì sau commit thi công nó luôn rỗng (gap-probe P1, xanh chân không).
set -euo pipefail
BASE="${1:-origin/main}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

if git diff --name-only "$BASE"...HEAD -- | grep -qx "scripts/gate-card.js"; then
  echo "VI PHAM: scripts/gate-card.js co trong diff so voi $BASE" >&2
  exit 1
fi
echo "scripts/gate-card.js: vang trong diff name-only so voi $BASE"

python3 - "$BASE" <<'PY'
import re, subprocess, sys
base = sys.argv[1]
LAW = "skills/acceptance/references/human-facing-language.md"

def block(text, name, path):
    m = re.search(r"<!-- <<<" + name + r" -->\n([\s\S]*?)<!-- " + name + r">>> -->", text)
    assert m, path + ": KHONG rut duoc khoi " + name + " qua marker"
    return m.group(1)

def at_base(path):
    r = subprocess.run(["git", "show", base + ":" + path],
                       capture_output=True, text=True)
    assert r.returncode == 0, "git show " + base + ":" + path + " loi: " + r.stderr.strip()
    return r.stdout

def at_head(path):
    return open(path, encoding="utf-8").read()

old_law, new_law = at_base(LAW), at_head(LAW)
for name in ("YOUR-MOVE-BLOCK-TEMPLATE", "GATE-INVITE-CLAUSE"):
    assert block(old_law, name, LAW) == block(new_law, name, LAW), \
        name + " DOI BYTE so voi " + base + " — vi pham dieu-kien-dung cua de bai"
    print(name + ": byte-equal voi " + base)

clause = block(new_law, "GATE-INVITE-CLAUSE", LAW).strip()
assert clause and "\n" not in clause, "clause phai la MOT dong khong rong"
sites = []
for line in block(new_law, "GATE-INVITE-SITES", LAW).splitlines():
    toks = line.split()
    if toks and toks[0].endswith(".md"):
        sites.append(toks[0])
assert len(sites) >= 4, "manifest qua it site: " + repr(sites)
for s in sites:
    old_lines = [i for i, l in enumerate(at_base(s).splitlines()) if clause in l]
    new_lines = [i for i, l in enumerate(at_head(s).splitlines()) if clause in l]
    assert new_lines, s + ": khong con ban chep nao"
    assert old_lines == new_lines, \
        s + ": cho dat clause DOI so voi " + base + " (" + str(old_lines) + " -> " + str(new_lines) + ")"
    print(s + ": cho dat clause giu nguyen (" + str(len(new_lines)) + " ban, dong " + str(new_lines) + ")")
print("NO-DRIFT OK: gate-card.js + khuon + clause + cho dat khong doi so voi " + base)
PY
