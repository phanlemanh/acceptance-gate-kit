#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
failures=0

pass() { echo "  PASS: $1"; }
fail() { echo "  FAIL: $1"; failures=$((failures + 1)); }

only_matched=0
run() {
  local name="$1"
  shift
  # ONLY_BLOCK: bo qua cac khoi goi QUA run() co tieu de khong chua chuoi nay.
  # GIOI HAN da do (S4-r2): ~46 khoi viet thang bang echo+if (P41/P42/P45...)
  # KHONG di qua run() nen van chay — mot luot "loc" ton ~3ph chu khong phai
  # vai giay — mot luot "loc" van ton ~3ph. Du de go loi mot khoi khi phat
  # trien, chua du de goi la "chay dung mot khoi"; bao phu het = boc 46 khoi
  # inline (known-limit measure-teeth-cleanup).
  if [ -n "${ONLY_BLOCK:-}" ]; then
    case "$name" in
      *"$ONLY_BLOCK"*) only_matched=$((only_matched + 1)) ;;
      *) return 0 ;;
    esac
  fi
  echo "$name"
  if "$@"; then
    pass "$name"
  else
    fail "$name"
  fi
}









run "P07 vendor engine import graph resolves (vendor/ shipped)" \
  node --input-type=module -e "
const m = await import(process.argv[1]);
if (typeof m.detectHtml !== 'function') throw new Error('detectHtml missing');
" "file://$ROOT/vendor/impeccable/engine/engines/static-html/detect-html.mjs"

run "P08 every \${CLAUDE_PLUGIN_ROOT} path in commands/skills exists in ITS plugin root" \
  python3 - "$ROOT" <<'PY'
# ${CLAUDE_PLUGIN_ROOT} resolves to the root of the plugin whose command/skill
# is running — a path that only resolves against the KIT root double-nests at
# runtime (the exact /design-init MODULE_NOT_FOUND failure this guards against).
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
plugin_roots = [
    root,                                   # acceptance-gate (source ./)
    root / "feature-loop",
]
pat = re.compile(r"\$\{CLAUDE_PLUGIN_ROOT\}/([A-Za-z0-9._/-]+)")
bad = []
for proot in plugin_roots:
    for sub in ("commands", "skills"):
        d = proot / sub
        if not d.is_dir():
            continue
        for md in d.rglob("*.md"):
            for rel in pat.findall(md.read_text(encoding="utf-8")):
                rel = rel.rstrip(".,)`'\"")
                if "<" in rel or "*" in rel:
                    continue  # placeholder, not a literal path
                if "." not in rel.split("/")[-1]:
                    continue  # only assert file-looking paths
                if not (proot / rel).exists():
                    bad.append(f"{md.relative_to(root)} -> {rel}")
assert not bad, "unresolvable ${CLAUDE_PLUGIN_ROOT} paths:\n" + "\n".join(bad)

# Bo dem tinh tao: vung quet phai thuc su co file, khong thi "0 vi pham" chi la
# buoc quet hong (grep-sanity-counter).
_skills = sorted((root / "skills").rglob("*.md"))
assert len(_skills) >= 5, f"bo dem tinh tao: quet ra {len(_skills)} file trong skills/ — nghi buoc quet hong"
PY

run "P20 lane lookup table CT1 nhat quan trong feature-loop SKILL" \
  python3 - "$ROOT" <<'PY'
import sys, pathlib
root = pathlib.Path(sys.argv[1])
fl = (root / "feature-loop/skills/feature-loop/SKILL.md").read_text()
assert fl.count("| **CT1") == 1, "bảng tra CT1 phải có đúng 1 lần"
assert fl.count("| **CT2") == 0, "CT2 (nghi lễ design-of-record) đã khai tử — bảng tra không được mọc lại"
assert "design_tier" not in fl, "không được lưu field tier"
assert "executors.design." in fl, "điều kiện làn design phải máy-đọc (khoá config, không phải văn xuôi)"
assert "--require-html" in fl, "lane nhẹ phải khai flag require-html"
PY

run "P21 decisions.jsonl plumbing noi du 3 diem (script + command + SKILL)" \
  python3 - "$ROOT" <<'PY'
import sys, pathlib
root = pathlib.Path(sys.argv[1])
assert "decisions.jsonl" in (root / "scripts/gate-card.js").read_text()
assert "decisions_plain" in (root / "commands/acceptance-card.md").read_text()
assert "decisions.jsonl" in (root / "feature-loop/skills/feature-loop/SKILL.md").read_text()
PY

run "P22 dinh tuyen model trong workflows + version feature-loop khong rong" \
  python3 - "$ROOT" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])

# version KHONG ghim literal: ghim literal bat moi lan bump phai sua suite, ma
# suite doi la code doi that nen evidence stale.
_fl_c = json.loads((root / "feature-loop/.claude-plugin/plugin.json").read_text())["version"]
assert _fl_c, "feature-loop: version rong"
assert "machine: 'haiku'" in (root / "feature-loop/workflows/acceptance-verify.js").read_text()
assert "judge: 'sonnet'" in (root / "feature-loop/workflows/acceptance-verify.js").read_text()
assert "executor: null" in (root / "feature-loop/workflows/execute-parallel.js").read_text()
PY


run "P24 acceptance-init phat mac dinh nghiem (recheck strict; KHONG con khoa chu-ky cu)" \
  python3 - "$ROOT/commands/acceptance-init.md" <<'PY'
import sys, re
from pathlib import Path
text = Path(sys.argv[1]).read_text()
assert "recheck: strict" in text, "recheck: strict"
# ADR 0012: scaffold thoi phat require_human_commit/agent_authors. Do o DONG
# SCAFFOLD (dong YAML mau, khong ke chu thich giai thich vi sao thoi phat) —
# neu khong thi chinh cau day nguoi go khoa cu lai lam case nay do.
scaffold = [l for l in text.splitlines() if re.match(r"^\s{2,}#?\s*(require_human_commit|agent_authors)\s*:", l)]
assert not scaffold, "scaffold van phat khoa chu-ky cu: " + repr(scaffold[:2])
# chieu do: ban sao co lai dong scaffold -> phai bat duoc
mut = text + "\n  require_human_commit: true # Gate-2 signature ...\n"
mut_hit = [l for l in mut.splitlines() if re.match(r"^\s{2,}#?\s*(require_human_commit|agent_authors)\s*:", l)]
assert mut_hit, "MUTANT khong bi bat — phep do chet"
print("P24 OK (recheck strict con; 0 dong scaffold khoa cu; mutant chen lai BI BAT)")
PY

run "P25 hook manifest Claude giu goc plugin dung bien Claude" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
claude_hooks = (root / "hooks/hooks.json").read_text()
assert "${CLAUDE_PLUGIN_ROOT}" in claude_hooks
assert "acceptance-evidence-gate.js" in claude_hooks
PY




run "P30 Claude decision commands ship and keep their invariants" \
  python3 - "$ROOT/commands" "$ROOT" <<'PY'
import sys, re
from pathlib import Path
cmds = Path(sys.argv[1])
root = Path(sys.argv[2])

# ── LINT LỚP «kit thôi đo phút người» (hồ sơ cat-hinh-thuc, 14/08) ────────────
# Vì sao lint theo LỚP chứ không theo literal: ba vòng rà soát đối kháng chứng
# minh rằng «không lời hứa phút nào, ở bất kỳ cách diễn đạt nào» là một PHỦ
# ĐỊNH PHỔ QUÁT mà một danh sách chuỗi-cấm không chứng được — mỗi vòng thêm một
# literal, vòng sau tìm đúng cái chưa thêm (`5–10 phút` → `~5 phút` → `~10 phút`
# → `vài phút`). Đường duy nhất chứng được là LẬT: quét cả LỚP cú pháp rồi khai
# TRƯỚC từng chỗ được phép, bánh cóc HAI CHIỀU.
#   · Chiều (a) hit không có trong bản khai → ĐỎ (lời hứa phút mới lọt vào).
#   · Chiều (b) dòng khai không còn hit → ĐỎ (bản khai phình thành tấm khiên).
# Giới hạn PHẢI khai: lint bắt lớp CÚ PHÁP (số/dấu ~ + "phút", "minutes",
# tên trường). Nó KHÔNG bắt lớp TỪ HÌNH — "vài phút", "khoảng năm phút",
# "~300 giây" — vì đó là ngôn ngữ tự nhiên không có biên. Backstop cho lớp ấy
# là eval hành vi E3b + mắt người ở Cổng 1, khai trong Known limits của hồ sơ.
LOP_PHUT = re.compile(r"[0-9~]\s*phút|phút/cổng|[Mm]inutes|time_human_minutes")
PHAM_VI = ["commands", "skills", "feature-loop", "scripts", "hooks", "lib",
           "GUIDE.md", "QUICKSTART.md", "README.md", "CONTEXT.md"]
# Bản khai (tệp, từ khoá) — mỗi dòng một chỗ ĐƯỢC PHÉP, kèm lý do.
MIEN_TRU = {
    ("skills/acceptance/references/human-facing-language.md", "time_human_minutes"): "schema đọc-cũ cho hồ sơ đã ký (Out of scope hồ sơ 1a)",
    ("skills/acceptance/SKILL.md", "minutes"): "nằm trong chính câu CẤM ghi phút",
    ("skills/ux-ui-craft/references/guidance-craft.md", "phút"): "thời lượng tự-đồng-bộ của UI, không phải phút người ở cổng",
    ("skills/ux-ui-craft/references/direction-craft.md", "minutes"): "lời khuyên thiết kế, không phải phút người ở cổng",
    ("GUIDE.md", "phút"): "thời gian ĐỌC tài liệu + median phút/round của MÁY",
    ("QUICKSTART.md", "phút"): "thời gian ĐỌC tài liệu",
    ("README.md", "phút"): "thời gian ĐỌC tài liệu",
    ("README.md", "minutes"): "câu tuyên kit KHÔNG đo phút người",
}
def _quet():
    hits = []
    for muc in PHAM_VI:
        pth = root / muc
        files = [pth] if pth.is_file() else sorted(f for f in pth.rglob("*") if f.is_file())
        for f in files:
            try: txt = f.read_text(encoding="utf-8")
            except (UnicodeDecodeError, OSError): continue
            for i, line in enumerate(txt.splitlines(), 1):
                for m in LOP_PHUT.finditer(line):
                    hits.append((str(f.relative_to(root)), m.group(0), i, line.strip()[:90]))
    return hits
def _khoa(rel, tok):
    for (f, k) in MIEN_TRU:
        if f == rel and k in tok: return (f, k)
    return None
_hits = _quet()
_la = [h for h in _hits if _khoa(h[0], h[1]) is None]
assert not _la, "LOP-PHUT: hit NGOAI ban khai mien tru:\n" + "\n".join(
    f"  {h[0]}:{h[2]}  «{h[1]}»  {h[3]}" for h in _la[:6])
_dung = {_khoa(h[0], h[1]) for h in _hits}
_thua = sorted(set(MIEN_TRU) - _dung)
assert not _thua, "LOP-PHUT: dong khai KHONG con hit that (banh coc chieu b) — go khoi ban khai: %r" % (_thua,)
print("     LOP-PHUT: %d hit, %d/%d dong mien tru deu con hit that (banh coc 2 chieu)"
      % (len(_hits), len(_dung), len(MIEN_TRU)))
for name in ["acceptance-init", "acceptance-status", "acceptance-card", "approve", "signoff", "acceptance-report"]:
    assert (cmds / f"{name}.md").is_file(), name
appr = (cmds / "approve.md").read_text()
for needle in ["approved_by", "decisions.jsonl", "gate1_skipped", "/acceptance-card"]:
    assert needle in appr, needle
sign = (cmds / "signoff.md").read_text()
for needle in ["human_override", "pre-merge-check.sh", "forge", "commit"]:
    assert needle in sign, needle
# ADR 0012: than /signoff KHONG duoc day lai nghi thuc hat-commit
for cam in ["require_human_commit", "agent_authors", "human-fields-only", "own commit"]:
    assert cam not in sign, "than signoff mang lai nghi le cu: " + cam
rep = (cmds / "acceptance-report.md").read_text()
for needle in ["gate1_skipped", "Read-only"]:
    assert needle in rep, needle
PY


run "P28 README and GUIDE document the verified install path" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
# Cau hoi cua ca nay khong chet cung harness Codex: tai lieu van phai dan MOT
# duong cai chay duoc, va ca hai goi con song deu phai duoc goi ten. Doi dich
# hoi chu khong bo cau hoi (go luon la mat that do phu).
text = (root / "README.md").read_text() + "\n" + (root / "GUIDE.md").read_text()
for needle in [
    "claude plugin marketplace add",
    "claude plugin install",
    "acceptance-gate@acceptance-gate-kit",
    "feature-loop@acceptance-gate-kit",
]:
    assert needle in text, needle
PY

run "P29 gap-probe S1 noi du 4 diem (card script, feature-loop SKILL, command, GUIDE)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
gc = (root / "scripts/gate-card.js").read_text()
assert "gap-probe" in gc and "Phản biện context sạch" in gc and "gap_probe" in gc
fl = (root / "feature-loop/skills/feature-loop/SKILL.md").read_text()
assert "gap-probe" in fl and "bỏ gap-probe" in fl and "models.critic" in fl.replace("`", "")
assert "gap_probe" in (root / "commands/acceptance-card.md").read_text()
assert "Gap-probe S1" in (root / "GUIDE.md").read_text()
PY



run "P32 Claude gate commands locked from model invocation; card stays open" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
LOCKED = ["approve", "signoff", "acceptance-init", "acceptance-status", "acceptance-report", "start"]
for name in LOCKED:
    t = (root / "commands" / f"{name}.md").read_text()
    assert "disable-model-invocation: true" in t, f"commands/{name}.md lacks lock"
card = (root / "commands/acceptance-card.md").read_text()
assert "disable-model-invocation" not in card, \
    "acceptance-card must stay model-invocable (feature-loop invokes it at both Gates)"
PY

run "P33 no source file globs the plugin cache (resolve-plugin.mjs is the only path)" \
  python3 - "$ROOT" <<'PY'
import sys, re
from pathlib import Path
root = Path(sys.argv[1])
areas = ["skills", "feature-loop", "commands", "hooks", "lib", "scripts"]
files = [p for a in areas for p in (root / a).rglob("*")
         if p.is_file() and p.suffix in {".md", ".js", ".cjs", ".mjs", ".sh", ".json"}]
files += [root / f for f in ("README.md", "GUIDE.md", "QUICKSTART.md")]
ALLOW = {"feature-loop/scripts/resolve-plugin.mjs"}  # documents the pattern it replaces
offenders = []
for p in files:
    if not p.exists():
        continue
    rel = str(p.relative_to(root))
    if rel in ALLOW:
        continue
    text = p.read_text(encoding="utf-8", errors="replace")
    if re.search(r"plugins/cache", text):
        offenders.append(rel)
assert files, "sanity: globbed zero source files — the scan itself is broken"
assert not offenders, (
    "cache-glob resurfaced in: " + ", ".join(offenders) +
    " — use ${CLAUDE_PLUGIN_ROOT}/${PLUGIN_ROOT} for your own plugin, or "
    "feature-loop/scripts/resolve-plugin.mjs for a sibling (ls order is lexical: "
    "it ranks 1.9.2 above 1.20.1). See docs/adr/0003.")
PY


run "P35 CI T1-escape backstop is ON, PR-guarded, and fails loud when skipped" \
  python3 - "$ROOT" <<'PY'
import sys, re
from pathlib import Path
wf = (Path(sys.argv[1]) / ".github/workflows/gate.yml").read_text()
step = re.search(r"- name: T1-escape backstop\n(.*?)(?=\n      - name:|\Z)", wf, re.S)
assert step, "T1-escape backstop step missing or renamed"
body = step.group(1)
# Enabled, not commented back out.
assert not re.search(r"^\s*#\s*- name: T1-escape", wf, re.M), "backstop step is commented out"
# Only meaningful on a PR — a push has no base branch to diff against.
assert "github.event_name == 'pull_request'" in body, "backstop must be guarded to pull_request"
assert 'github.base_ref' in body, "backstop must derive its base from base_ref"
# pre-merge-check treats an unresolvable base as skip+clean (right for consumer
# repos). On the kit that silent fail-open is the very hole the backstop exists
# to close, so CI must promote the skip to an error.
assert "backstop skipped" in body and "exit 1" in body, \
    "a skipped backstop must fail the job, not pass quietly"
# Full history: the stale-guard and signoff-provenance checks read git log.
assert "fetch-depth: 0" in wf, "gate job needs fetch-depth: 0"
# Từ khi mode `required` có sàn fail-CLOSED (d-128), chạy pre-merge KHÔNG có base
# là VIOLATION — nên một job không truyền base thì đỏ vĩnh viễn. Răng này giữ CI
# khỏi rơi lại vào đó, và giữ luôn cả hai nhánh sự kiện.
assert "PRE_MERGE_BASE" in wf, "gate job must always resolve a PR base (fail-closed floor)"
assert "github.base_ref" in wf and "HEAD~1" in wf, \
    "base must be resolved for BOTH events: PR -> base_ref, push -> HEAD~1"
PY

# ── P38: parity CẤU TRÚC — gate-card phải dùng lib, không giữ luật riêng ────
# Contract v2 chết vì luật bị tách làm hai bản, parity giữ bằng comment. Đây là
# răng máy cho lời hứa "một cài đặt" — comment không kiểm được, grep thì được.
echo "P38 gate-card.js dung lib/gap-probe.cjs, khong con regex descope rieng"
GC_SRC="$(cat "$ROOT/scripts/gate-card.js")"
case "$GC_SRC" in
  *"require('../lib/gap-probe.cjs')"*|*'require("../lib/gap-probe.cjs")'*)
    pass "P38a gate-card require lib/gap-probe.cjs" ;;
  *)
    fail "P38a gate-card require lib/gap-probe.cjs" ;;
esac
if printf '%s' "$GC_SRC" | grep -qF 'bỏ gap-probe/i'; then
  fail "P38b gate-card khong con literal regex descope"
else
  pass "P38b gate-card khong con literal regex descope"
fi

# ── P39: acceptance-init phat du khoa gap_probe ────────────────────────────
# Repo khoi tao ma config khong co khoa `gap_probe` thi luat im lang o dung
# nhung repo do.
echo "P39 acceptance-init: khoa gap_probe + 3 mode"
for f in "$ROOT/commands/acceptance-init.md"; do
  n="$(basename "$(dirname "$f")")/$(basename "$f")"
  if grep -q 'gap_probe:' "$f"; then pass "P39[$n:key]"; else fail "P39[$n:key]"; fi
  if grep -q 'required | advisory | off' "$f"; then pass "P39[$n:modes]"; else fail "P39[$n:modes]"; fi
done




run "P40 gate.yml: push tat rang T1-escape, PR khong, khong nhanh nao thieu base" \
  python3 - "$ROOT" <<'P40PY'
import sys
from pathlib import Path
wf = (Path(sys.argv[1]) / ".github/workflows/gate.yml").read_text()
assert "--no-t1-escape" in wf, "nhanh push phai tat rang T1-escape"
# Nhanh PR KHONG duoc mang co: tien de "PR phai kem artifact" dung o do.
# Loc theo DONG GAN T1_ESCAPE_FLAG, khong theo base_ref: nhanh PR dat co tren
# mot dong KHONG chua base_ref, nen assert cu khong the do (da kiem bang dot
# bien: doi nhanh PR thanh --no-t1-escape van xanh). Cung lop loi voi P43.
flag_lines = [l.strip() for l in wf.splitlines() if "T1_ESCAPE_FLAG=" in l]
assert len(flag_lines) == 2, f"phai co dung 2 nhanh gan co, thay: {flag_lines}"
on  = [l for l in flag_lines if "--no-t1-escape" in l]
off = [l for l in flag_lines if "--no-t1-escape" not in l]
assert len(on) == 1 and len(off) == 1, f"dung MOT nhanh tat, MOT nhanh giu bat: {flag_lines}"
# nhanh tat phai nam trong ve `else` (push); nhanh giu bat trong ve pull_request
i_if = wf.index('github.event_name }}" = "pull_request"')
i_else = wf.index("else", i_if)
i_on = wf.index(on[0])
assert i_on > i_else, "nhanh TAT rang phai o ve else (push), khong phai ve pull_request"
# Khong loi goi pre-merge-check nao duoc thieu base: thieu base la VIOLATION
# gap-probe theo docs/adr/0004.
assert "PRE_MERGE_BASE" in wf, "phai resolve base cho moi su kien"
P40PY

run "P43 GUIDE noi bump version thuoc S3" \
  python3 - "$ROOT" <<'P43PY'
import sys
from pathlib import Path
g = (Path(sys.argv[1]) / "GUIDE.md").read_text()
# Ghim CAU chu the, khong dung cua so ky tu quanh tu khoa: cua so ±600 bat phai
# chu "S3"/"stale" cua doan KHAC nen no khong phan biet duoc (da do: go han
# "thuoc S3" van xanh). Assertion khong phan biet duoc la assertion khong song.
# [SỬA 13/08, vòng thu gọn 1b — G11] Câu ghim cũ «Bump version + sync mirror
# thuộc S3» tự nó là một CON TRỎ SỐNG tới mirror đã lưu kho: ca thường trực ghim
# một chỉ dẫn đã chết, và giữ pin là giữ GUIDE nói dối. Assert cũ khai trong
# asserts-da-go.txt theo đúng nghi thức bánh cóc.
assert "Bump version thuộc S3" in g, \
    "GUIDE phai gan bump version vao S3 bang mot cau ro rang"
assert "sync mirror" not in g, \
    "GUIDE con chi dan song tro mirror da luu kho (G11)"
assert "huỷ chính chữ ký" in g, \
    "GUIDE phai neu HE QUA: bump sau Cong 2 huy chinh chu ky vua lay"
P43PY

run "P44 acceptance-init nhac co cho job push (khop GUIDE)" \
  python3 - "$ROOT" <<'P44PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
for rel in ["commands/acceptance-init.md"]:
    t = (root / rel).read_text()
    assert "--no-t1-escape" in t, f"{rel} chua nhac co cho job push"
# Parity GUIDE <-> acceptance-init: consumer chep snippet tu GUIDE §Wire CI, nen
# thieu co o day la ho dinh dung trieu chung feature nay sinh ra de chua.
g = (root / "GUIDE.md").read_text()
assert "--no-t1-escape" in g, "GUIDE (muc wire CI) chua nhac co cho job push"
P44PY



# ── P48: chu ky ledger_mark — them khoi luat moi ma quen khai so -> suite DO ─
# AC-7c cua premerge-rules-ledger: dem ten duy nhat o call-site ledger_mark va
# so BANG voi EXPECTED tren nguon (scripts/). Day la chieu "them khoi luat ma
# quen khai so" — mot chieu ma phep so ban-chep truoc day
# khong thay vi hai ban van y het nhau.
echo "P48 ledger_mark call-site == EXPECTED tren nguon"
p48_names() {
  grep -E 'ledger_mark (ran|declared-off) ' "$1" | grep -v 'ledger_mark()' \
    | sed -E 's/.*ledger_mark (ran|declared-off) ([a-z0-9-]+).*/\2/' | sort -u | tr '\n' ' '
}
p48_exp() { sed -n 's/^LEDGER_EXPECTED="\(.*\)"$/\1/p' "$1" | tr ' ' '\n' | sort -u | tr '\n' ' '; }
P48OK=1
for f in "$ROOT/scripts/pre-merge-check.sh"; do
  if [ ! -f "$f" ]; then echo "     thieu $f"; P48OK=0; continue; fi
  if [ -z "$(p48_exp "$f")" ]; then echo "     EXPECTED rong/khong parse duoc: $f"; P48OK=0; continue; fi
  if [ "$(p48_names "$f")" != "$(p48_exp "$f")" ]; then
    echo "     call-site lech EXPECTED: $f"
    echo "       call-site: [$(p48_names "$f")]  EXPECTED: [$(p48_exp "$f")]"
    P48OK=0
  fi
done
# Doi chung dot bien: them mot call-site ten moi vao ban sao -> phep so phai
# LECH. Thieu no thi P48 chi chung minh "hai chuoi hom nay bang nhau", khong
# chung minh phep so con song (bat bien #4 CLAUDE.md).
P48CP="$(mktemp)"
{ cat "$ROOT/scripts/pre-merge-check.sh"; printf '\nledger_mark ran khoi-moi\n'; } > "$P48CP"
if [ "$(p48_names "$P48CP")" = "$(p48_exp "$P48CP")" ]; then
  echo "     dot bien KHONG bi phat hien — phep so da chet"
  P48OK=0
fi
rm -f "$P48CP"
if [ "$P48OK" -eq 1 ]; then
  pass "P48 chu ky ledger_mark khop EXPECTED (nguon + mirror + dot bien)"
else
  fail "P48 chu ky ledger_mark khop EXPECTED (nguon + mirror + dot bien)"
fi



# ── P51: suite tests/workflows phai duoc wire vao CI + config ───────────────
# AC-13 cua s4-scope-triage: suite ton tai tu Dot 5 nhung mo coi — khong config
# nao tro toi, khong CI nao chay. Eval cua feature nay dung no lam executor, nen
# wiring LA deliverable, khong phai loi hua.
echo "P51 tests/workflows wired vao gate.yml + config.yaml"
P51OK=1
P51GATE="$ROOT/.github/workflows/gate.yml"
P51CFG="$ROOT/_acceptance/config.yaml"
if ! grep -q 'bash tests/workflows/run-tests.sh' "$P51GATE"; then
  echo "     gate.yml THIEU step chay tests/workflows/run-tests.sh"
  P51OK=0
fi
if ! grep -q '^    workflows: "bash tests/workflows/run-tests.sh"$' "$P51CFG"; then
  echo "     config.yaml THIEU executors.test.workflows"
  P51OK=0
fi
if ! grep -q '^    - executors.test.workflows$' "$P51CFG"; then
  echo "     config.yaml THIEU executors.test.workflows trong feature_loop.suite_keys"
  P51OK=0
fi
# Doi chung dot bien: ban sao gate.yml bi xoa step -> phep kiem phai DO.
P51CP="$(mktemp)"
grep -v 'bash tests/workflows/run-tests.sh' "$P51GATE" > "$P51CP"
if cmp -s "$P51GATE" "$P51CP"; then
  echo "     dot bien KHONG cham duoc file (ban sao y het ban goc) — phep kiem da chet"
  P51OK=0
elif grep -q 'bash tests/workflows/run-tests.sh' "$P51CP"; then
  echo "     dot bien KHONG hieu luc — phep kiem da chet"
  P51OK=0
fi
rm -f "$P51CP"
if [ "$P51OK" -eq 1 ]; then
  pass "P51 tests/workflows wired (gate.yml + config executors + suite_keys + dot bien)"
else
  fail "P51 tests/workflows wired (gate.yml + config executors + suite_keys + dot bien)"
fi

# ── P52: card 2 harness render khoi "Ngoai hop dong" + nhanh backward ───────
# AC-8 cua s4-scope-triage. Card la lop trinh bay; review-findings.md the he CU
# (khong co section moi) phai render nhu cu, khong loi — nhanh backward la BAT
# BUOC, khong phai tuy nghi.
# Do DAU RA RENDER, khong grep chi dan. Round 1 cua chinh feature nay bi bat vi
# case cu chi grep hai file chi dan: no van xanh trong khi gate-card.js khong he
# biet khoi do, nen khoi khong bao gio hien ra cho nguoi duyet.
echo "P52 card THAT SU render khoi Ngoai-hop-dong (do dau ra) + nhanh backward"
P52OK=1
P52WS="$(mktemp -d)"
mkdir -p "$P52WS/_acceptance/demo"
cat > "$P52WS/_acceptance/demo/contract.md" <<'EOF'
---
schema_version: 1
feature: demo
slug: demo
risk_tier: T2
status: verified
---

## Criteria

- AC-1: Given x, When y, Then z.

## Out of scope

- khong lam gi ca
EOF
cat > "$P52WS/_acceptance/demo/evidence-report.md" <<'EOF'
---
slug: demo
round: 1
verdict: PASS
enforcement_mode: strict
bypass_used: false
---

## Results

- eval: E1
  run_id: r1234
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-07-27T00:00:00Z
EOF
cat > "$P52WS/_acceptance/demo/review-findings.md" <<'EOF'
# Review Findings: demo (round 1)

## Trong hợp đồng

- **loi trong hop dong**
  file: `src/a.ts:1`
  severity: high
  AC: AC-1

## Ngoài hợp đồng — người quyết ở Gate 2

- **rmSync called before git.clone resolves — uncaught SyntaxError in globToRe**
  Người dùng thấy gì: Bấm "Cập nhật" có thể làm mất tiện ích đang cài khi mạng chập chờn.
  file: `src/install.ts:10`
  severity: high
  Đề xuất: known-limits

---

⚠ Cụm ngoài vùng phủ: 2/3 lỗi rơi vào file không bộ đo nào phủ (src/install.ts, docs/plugins.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
EOF
P52OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P52WS" --slug demo 2>&1)"
printf '%s' "$P52OUT" | grep -q 'Ngoài hợp đồng — bạn quyết' || { echo "     dau ra render THIEU tieu de khoi"; P52OK=0; }
# Cau NGON NGU SAN PHAM (truong plain) phai la chu nguoi quyet doc...
printf '%s' "$P52OUT" | grep -q 'Bấm &quot;Cập nhật&quot; có thể làm mất tiện ích đang cài' \
  || printf '%s' "$P52OUT" | grep -q 'có thể làm mất tiện ích đang cài' \
  || { echo "     dau ra render THIEU cau ngon ngu san pham (truong plain)"; P52OK=0; }
# ...va title KY THUAT cua reviewer TUYET DOI khong duoc len the.
for j in 'rmSync' 'globToRe' 'SyntaxError'; do
  if printf '%s' "$P52OUT" | grep -q "$j"; then
    echo "     the in title ky thuat cua reviewer: $j"
    P52OK=0
  fi
done
# Ba nhan lua chon RUT TU chi dan card (khong hardcode o day: hardcode thi test
# chi tu khop voi chinh no, renderer troi khoi chi dan van xanh).
P52LABELS="$(sed -n 's/.*(a) \*\*\([^*]*\)\*\*.*(b) \*\*\([^*]*\)\*\*.*(c) \*\*\([^*]*\)\*\*.*/\1|\2|\3/p' "$ROOT/commands/acceptance-card.md" | head -1)"
if [ -z "$P52LABELS" ]; then
  echo "     KHONG rut duoc 3 nhan tu commands/acceptance-card.md"
  P52OK=0
else
  P52OIFS="$IFS"; IFS='|'
  for lab in $P52LABELS; do
    printf '%s' "$P52OUT" | grep -q "$lab" || { echo "     renderer KHONG in dung nhan chi dan: $lab"; P52OK=0; }
  done
  IFS="$P52OIFS"
fi
# Co cum -> phai co dong co; va thẻ KHONG duoc nem duong dan file tho vao mat
# nguoi quyet (panel judge round 1 bat dung diem nay).
printf '%s' "$P52OUT" | grep -q 'dừng và quyết' || { echo "     dau ra render THIEU dong co cum"; P52OK=0; }
if printf '%s' "$P52OUT" | grep -q 'src/install.ts'; then
  echo "     thẻ lo duong dan file tho vao khoi nguoi-quyet"
  P52OK=0
fi
# Nhanh backward: file the he CU (khong co heading scope-triage) -> KHONG duoc
# render khoi, KHONG duoc bao loi. Doi chung THAT: doi dau vao, do lai dau ra.
printf '# Review Findings\n\n- **loi cu**\n  file: `a.ts`\n' > "$P52WS/_acceptance/demo/review-findings.md"
P52OLD="$(node "$ROOT/scripts/gate-card.js" --root "$P52WS" --slug demo 2>&1)"
P52OLDST=$?
if [ "$P52OLDST" -ne 0 ]; then echo "     file the he cu lam gate-card loi (exit $P52OLDST)"; P52OK=0; fi
if printf '%s' "$P52OLD" | grep -q 'Ngoài hợp đồng — bạn quyết'; then
  echo "     file the he cu VAN render khoi — nhanh backward hong"
  P52OK=0
fi
printf '%s' "$P52OLD" | grep -q 'Cổng 2' || { echo "     file the he cu lam hong ca the"; P52OK=0; }
# Doi chung dot bien THAT: bo section khoi input -> khoi phai BIEN MAT o dau ra.
rm -rf "$P52WS"
if [ "$P52OK" -eq 1 ]; then
  pass "P52 khoi Ngoai-hop-dong render that + co cum + khong lo path + backward"
else
  fail "P52 khoi Ngoai-hop-dong render that + co cum + khong lo path + backward"
fi

# ── P53: gac cong cho judge E11 — fixture PHAI la ban render THAT ────────────
# Cung khuon TE17/RL10: sinh LAI fixture trong chinh lan chay nay roi so
# byte-doi-byte. Round 2 bi bat vi fixture cu la van viet tay: judge cham mot
# tai lieu khong code path nao sinh ra, con the that thi in title ky thuat.
echo "P53 fixture judge E11 = ban render that (sinh lai + so byte)"
P53F="$ROOT/_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md"
P53GEN="$ROOT/tests/plugins/fixtures/render-out-of-contract-block.sh"
P53OK=1
if [ ! -f "$P53F" ] || [ ! -f "$P53GEN" ]; then
  echo "     thieu fixture hoac script sinh"
  P53OK=0
else
  P53TMP="$(mktemp)"
  {
    head -6 "$P53F"
    bash "$P53GEN"
  } > "$P53TMP" 2>/dev/null
  if ! cmp -s "$P53F" "$P53TMP"; then
    echo "     fixture da TROI so voi ban render hien tai — chay lai:"
    echo "       { head -6 <fixture>; bash tests/plugins/fixtures/render-out-of-contract-block.sh; } > <fixture>"
    P53OK=0
  fi
  # Ban render phai la ngon ngu san pham: jargon ky thuat lot vao nghia la
  # duong dich (truong plain) da hong o dau do.
  for j in 'rmSync' 'globToRe' 'exit code' 'inContract' 'severity' 'src/'; do
    if grep -q "$j" "$P53TMP"; then echo "     ban render co jargon ky thuat: $j"; P53OK=0; fi
  done
  rm -f "$P53TMP"
fi
if [ "$P53OK" -eq 1 ]; then
  pass "P53 fixture judge E11 == ban render that + khong jargon"
else
  fail "P53 fixture judge E11 == ban render that + khong jargon"
fi


# ── P55: ROUND-TRIP writer <-> reader cho review-findings.md ────────────────
# Lop loi da tai dien BA round lien tiep ma khong eval nao do: ben VIET (prompt
# synthesize trong acceptance-verify.js) va ben DOC (lib/out-of-contract.js) troi
# khoi nhau, vi MOI test deu tu tay dung fixture DUNG KHUON READER. Case nay RUT
# khuon tu chinh file writer roi cho reader that doc — hai dau khong the troi nua.
echo "P55 round-trip: khuon prompt synthesize phai parse duoc bang lib/out-of-contract.js"
run "P55 round-trip writer<->reader (khuon rut tu writer, doc bang reader that)" \
  node - "$ROOT" <<'JS'
const fs = require('fs');
const path = require('path');
const root = process.argv[2];
const wf = fs.readFileSync(path.join(root, 'feature-loop/workflows/acceptance-verify.js'), 'utf8');
const parser = require(path.join(root, 'lib/out-of-contract.js'));

// 1. Rut khuon tu WRITER (khong hardcode o day).
const m = wf.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)OOC-ITEM-TEMPLATE>>>/);
if (!m) { console.error('KHONG rut duoc khuon OOC-ITEM-TEMPLATE tu writer'); process.exit(1); }
// Hoa giai escape cua NGUON JS de duoc DUNG chuoi agent thuc su doc:
// \\n -> xuong dong, \\` -> backtick that.
const tpl = m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');

const SAMPLE = {
  title: 'rmSync before clone resolves',
  plain: 'Bấm Cập nhật có thể làm mất tiện ích đang cài.',
  file: 'src/install.ts:10',
  severity: 'high',
  proposal: 'known-limits',
};
const fill = t => t.replace(/\{(\w+)\}/g, (_, k) => SAMPLE[k]);
const doc = '## Ngoài hợp đồng — người quyết ở Gate 2\n\n' + fill(tpl) + '\n';

// 2. Cho READER that doc tai lieu do.
const r = parser.parse(doc);
const f = r.findings[0];
if (!f) { console.error('reader parse ra 0 finding tu khuon cua writer — hai dau da lech'); process.exit(1); }
for (const k of ['title', 'file', 'severity', 'proposal', 'plain']) {
  if (f[k] !== SAMPLE[k]) {
    console.error('reader parse truong ' + k + ' = [' + f[k] + '] nhung phai la [' + SAMPLE[k] + '] — hai dau da lech');
    process.exit(1);
  }
}


// 3. Doi chung dot bien: dao dong plain len TRUOC dong title -> phai parse HONG.
const lines = fill(tpl).split('\n').filter(Boolean);
const swapped = '## Ngoài hợp đồng — người quyết ở Gate 2\n\n'
  + [lines[1].trim(), lines[0], ...lines.slice(2)].join('\n') + '\n';
const bad = parser.parse(swapped);
if (bad.findings.length > 0 && bad.findings[0].plain) {
  console.error('dot bien KHONG hieu luc — dao thu tu dong van parse duoc, phep so da chet');
  process.exit(1);
}
console.log('round-trip OK; dot bien dao dong bi bat');
JS


run "P57 acceptance-init noi DUNG muc cuong che cua approvers" \
  python3 - "$ROOT" <<'PY'
import sys, pathlib
root = pathlib.Path(sys.argv[1])
targets = [
    root / "commands" / "acceptance-init.md",
]
present = [p for p in targets if p.exists()]
assert len(present) == 1, f"thieu ban acceptance-init: {[str(p) for p in targets if not p.exists()]}"
for p in present:
    t = p.read_text(encoding="utf-8")
    # Ghim MARKER chu khong chi do vang-mat: xoa dong cu ma khong viet gi thay
    # the van xanh, va tai lieu cam ve approvers de nguoi van hanh tu suy ra
    # muc cuong che.
    assert "# approvers: informational —" in t, f"{p.name}: thieu marker muc cuong che"
    assert "NOT enforced" in t, f"{p.name}: khong noi ro khoa KHONG duoc cuong che"
    assert "placeholder" in t, f"{p.name}: khong noi chu ky VAN bi kiem bang luoi giu-cho"
PY


# ─── P65..P71 — gate-card doc dong criterion (slug gate-card-ac-visibility) ───
# Corpus la BAT BUOC: contract cua chinh kit chi dung 2/5 khuon, nen chay eval
# bao-tap tren _acceptance/ khong dung den 3 khuon da gay ra loi.
AC_LIB="$ROOT/lib/ac-line.cjs"
AC_CORPUS="$ROOT/tests/plugins/fixtures/ac-line-corpus.md"

echo "P65 corpus khuon dong criterion: id/gwt/judgment khop bang GHIM SAN"
if [ ! -f "$AC_LIB" ] || [ ! -f "$AC_CORPUS" ]; then
  fail "P65 thieu lib/ac-line.cjs hoac corpus fixture"
else
  P58OUT="$(node -e '
    const fs=require("fs"); const {parseAC}=require(process.argv[1]);
    const lines=fs.readFileSync(process.argv[2],"utf8").split("\n");
    let bad=0,n=0;
    for(let i=0;i<lines.length;i++){
      const c=lines[i].match(/^CASE\s+(\S+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*)$/);
      if(!c) continue;
      const inp=(lines[i+1]||"").replace(/^INPUT /,"");
      const [,name,wantId,wantJ,wantG]=c; n++;
      const got=parseAC(inp);
      if(wantId==="-"){ if(got){bad++;console.log("LECH "+name+": mong 0 criterion, nhan "+got.id);} continue; }
      if(!got){bad++;console.log("LECH "+name+": mong "+wantId+", nhan 0 criterion");continue;}
      if(got.id!==wantId){bad++;console.log("LECH "+name+" id: mong "+wantId+" nhan "+got.id);}
      const gj=got.judgment?"y":"n";
      if(gj!==wantJ){bad++;console.log("LECH "+name+" judgment: mong "+wantJ+" nhan "+gj);}
      if(got.gwt!==wantG){bad++;console.log("LECH "+name+" gwt:\n   mong: "+wantG+"\n   nhan: "+got.gwt);}
    }
    console.log("CASES="+n+" BAD="+bad);
  ' "$AC_LIB" "$AC_CORPUS" 2>&1)"
  echo "$P58OUT" | grep -v '^CASES=' | sed 's/^/     /'
  P58N="$(echo "$P58OUT" | sed -n 's/^CASES=\([0-9]*\) BAD=.*/\1/p')"
  P58B="$(echo "$P58OUT" | sed -n 's/^CASES=[0-9]* BAD=\([0-9]*\)/\1/p')"
  if [ "${P58N:-0}" -lt 10 ]; then fail "P65 corpus qua mong ($P58N ca) — khong du de goi la phu khuon"
  elif [ "${P58B:-1}" -ne 0 ]; then fail "P65 $P58B lech so voi bang ghim"
  else pass "P65 corpus $P58N ca khop bang ghim (id+gwt+judgment)"; fi
fi

echo "P66 bao-tap: khuon MOI phai BAO khuon CU, 0 dong mat, 0 dong rac them"
P59OUT="$(node -e '
  const fs=require("fs"),path=require("path"); const {parseAC}=require(process.argv[1]);
  const OLD=/^\s*-\s*(AC-\d+)\s*:\s*(.+)$/;
  const files=[process.argv[2]];
  const roots=[path.join(process.argv[3],"_acceptance")];
  // AC-2 khai "ca hai repo". Suite khong duoc PHU THUOC repo anh em ton tai, nen
  // duong do la opt-in qua env — nhung khi VANG phai NOI RA, khong duoc im lang
  // thu hep pham vi roi van bao xanh.
  const extra=process.env.AC_EXTRA_CORPUS_ROOT;
  if(extra&&fs.existsSync(path.join(extra,"_acceptance"))) roots.push(path.join(extra,"_acceptance"));
  else console.log("PHAM-VI: khong co AC_EXTRA_CORPUS_ROOT — chi phu corpus + _acceptance cua repo nay; AC-2 khai rong hon the");
  for(const accDir of roots) for(const d of fs.readdirSync(accDir)){const p=path.join(accDir,d,"contract.md");if(fs.existsSync(p))files.push(p);}
  let lost=0,gained=0,junk=0;
  // Dong corpus mang tien to "INPUT " — khong got thi parseAC khong doc duoc dong
  // nao va corpus dong gop 0 vao phep do (doi chung duong bat duoc dieu nay).
  const strip=l=>l.startsWith("INPUT ")?l.slice(6):l;
  for(const f of files) for(const raw of fs.readFileSync(f,"utf8").split("\n")){
    const l=strip(raw);
    const o=OLD.test(l), n=!!parseAC(l);
    if(o&&!n){lost++;console.log("MAT "+path.basename(path.dirname(f))+": "+l.trim().slice(0,70));}
    if(!o&&n){ gained++;
      // nua should-NOT-fire: dong khuon CU khong doc VI NO KHONG PHAI criterion
      if(/^\s*[-*]\s+\*{0,2}\s*[^A]/.test(l)&&!/^\s*[-*]\s*\*{0,2}\s*AC-\d/.test(l)){junk++;console.log("RAC "+l.trim().slice(0,70));}
    }
  }
  console.log("LOST="+lost+" GAINED="+gained+" JUNK="+junk);
' "$AC_LIB" "$AC_CORPUS" "$ROOT" 2>&1)"
echo "$P59OUT" | grep -v '^LOST=' | sed 's/^/     /'
P59L="$(echo "$P59OUT" | sed -n 's/^LOST=\([0-9]*\).*/\1/p')"
P59G="$(echo "$P59OUT" | sed -n 's/^LOST=[0-9]* GAINED=\([0-9]*\).*/\1/p')"
P59J="$(echo "$P59OUT" | sed -n 's/^.*JUNK=\([0-9]*\)$/\1/p')"
# Doi chung duong (script hoa, khong con la chu trong `expected`): thu hep khuon
# tren mot BAN SAO cua lib roi doi phep do phai BAO MAT dong. Khong do duoc cai
# nay thi con so "0 mat" o tren khong phan biet duoc voi "phep do khong chay".
P59CTRL="$(node -e '
  const fs=require("fs");
  // Ban HEP co y: dung dung khuon template goc (colon dan ngay sau id). Neu phep
  // do o tren THUC SU phan biet duoc, thi thay parser bang ban hep nay phai lam
  // lo ra dong bi mat tren corpus. Khong lo ra = phep do khong do gi.
  const NARROW=/^\s*-\s*(AC-\d+)\s*:\s*(.+)$/;
  const WIDE=require(process.argv[1]).parseAC;
  let lost=0;
  for(const raw of fs.readFileSync(process.argv[2],"utf8").split("\n")){
    const l=raw.startsWith("INPUT ")?raw.slice(6):raw;
    const w=WIDE(l); if(w&&!NARROW.test(l)) lost++;
  }
  console.log("CTRL="+(lost>0?"do":"xanh")+" ("+lost+" dong chi ban rong doc duoc)");
' "$AC_LIB" "$AC_CORPUS" 2>&1)"
case "$P59CTRL" in CTRL=do*) ;; *) fail "P66 doi chung duong HONG ($P59CTRL): thay bang khuon hep ma phep do khong bao mat dong — thuoc khong phan biet duoc";; esac
if [ "${P59L:-1}" -ne 0 ]; then fail "P66 khuon moi lam MAT ${P59L} dong khuon cu doc duoc — khong con la phep noi"
elif [ "${P59G:-0}" -lt 5 ]; then fail "P66 chi them ${P59G} dong — corpus khong dung den cac khuon moi, phep do rong nghia"
elif [ "${P59J:-1}" -ne 0 ]; then fail "P66 khuon moi keo them ${P59J} dong RAC (khong phai criterion)"
else pass "P66 bao-tap: 0 mat, +${P59G} dong criterion that, 0 rac"; fi

echo "P67 co judgment: 0 lat tren dong chung; nhan/code-span xu dung"
P60OUT="$(node -e '
  const fs=require("fs"),path=require("path"); const {parseAC}=require(process.argv[1]);
  const OLD=/^\s*-\s*(AC-\d+)\s*:\s*(.+)$/;
  const roots=[path.join(process.argv[2],"_acceptance")];
  const extra=process.env.AC_EXTRA_CORPUS_ROOT;
  if(extra&&fs.existsSync(path.join(extra,"_acceptance"))) roots.push(path.join(extra,"_acceptance"));
  else console.log("PHAM-VI: khong co AC_EXTRA_CORPUS_ROOT — 2 dong repo tieu thu ma AC-3 neu dich danh KHONG nam trong pham vi quet");
  let flip=0;
  for(const accDir of roots) for(const d of fs.readdirSync(accDir)){const p=path.join(accDir,d,"contract.md");if(!fs.existsSync(p))continue;
    for(const l of fs.readFileSync(p,"utf8").split("\n")){
      const o=l.match(OLD); if(!o) continue; const n=parseAC(l); if(!n) continue;
      const jo=/\(judgment\)/i.test(o[2]);
      if(jo===n.judgment) continue;
      // Lat DUOC PHEP dung mot truong hop: dau chi ton tai ben trong code span,
      // tuc criterion dang TRICH DAN dau chu khong mang no. Moi lat khac la loi.
      const onlyInCode = jo && !n.judgment && !/\(judgment\)/i.test(l.replace(/`[^`]*`/g,""));
      if(!onlyInCode){flip++;console.log("LAT SAI "+d+" "+n.id+": cu="+jo+" moi="+n.judgment);}
      else console.log("     lat DUNG luat code-span: "+d+" "+n.id);
    }}
  // doi chung duong: go backtick tren dong trich dan dau -> phai thanh judgment
  const quoted="- AC-8: Given contract mang dau `(judgment)` trong ngoac kep, Then khong tinh.";
  const bare  ="- AC-8: Given contract mang dau (judgment) trong ngoac kep, Then khong tinh.";
  const a=parseAC(quoted), b=parseAC(bare);
  console.log("FLIP="+flip+" QUOTED="+(a&&a.judgment)+" BARE="+(b&&b.judgment));
' "$AC_LIB" "$ROOT" 2>&1)"
echo "$P60OUT" | grep -v '^FLIP=' | sed 's/^/     /'
if ! echo "$P60OUT" | grep -q '^FLIP=0 QUOTED=false BARE=true'; then
  fail "P67 co judgment sai: $(echo "$P60OUT" | grep '^FLIP=')"
else pass "P67 co judgment: 0 lat; dau trong code-span = trich dan (false), go backtick -> true"; fi

echo "P68 mot nguon su that: HAI LOI GOI THAT cua gate-card tren cung contract"
# Ban truoc cua case nay do bang grep dem regex + goi CUNG mot ham hai lan roi so
# voi chinh no — mot hang dung, khong phan biet duoc gi. Verify vong 1 chung minh:
# tach doi hai loi goi that thi P68 VAN PASS. Ban nay lai bang HANH VI qua CLI:
#   loi goi A = duong card Cong 1 (acs)      -> chu criterion hien o khoi will/wont
#   loi goi B = duong critText Cong 2 (:265) -> chu criterion hien o muc "viec cua nguoi"
# Hai duong doc CUNG contract; lech nhau la hong. Doi chung duong = dot bien
# LAM LECH THAT roi doi case phai DO.
P61WS="$(mktemp -d)"; P61A="$P61WS/_acceptance/twopath"; mkdir -p "$P61A"
cat > "$P61A/contract.md" <<'P61EOF'
---
schema_version: 1
feature: two-path probe
slug: twopath
risk_tier: T3
status: verified
approved_by: Probe
---

## Criteria

- AC-1: Given zulufox, When chay, Then xanh.
- **AC-2 (nhan):** Given yankeecrab, When chay, Then xanh.
- **AC-3** (judgment) Given xraymoose, When chay, Then xanh.
- AC-4 (F1): Given whiskeyelk, When chay, Then xanh.
- **AC-5.** Given victorowl, When chay, Then xanh.
P61EOF
cat > "$P61A/evals.yaml" <<'P61EOF'
schema_version: 1
feature_slug: twopath
evals:
  - id: E1
    criterion: AC-1
    executor: judgment
    question: "q1"
  - id: E2
    criterion: AC-2
    executor: judgment
    question: "q2"
  - id: E3
    criterion: AC-3
    executor: judgment
    question: "q3"
  - id: E4
    criterion: AC-4
    executor: judgment
    question: "q4"
  - id: E5
    criterion: AC-5
    executor: judgment
    question: "q5"
P61EOF
cat > "$P61A/evidence-report.md" <<'P61EOF'
---
schema_version: 2
feature_slug: twopath
verdict: PENDING-JUDGMENT
failed_evals: []
verified_by: probe
enforcement_mode: strict
bypass_used: false
verified_commit: 0000000000000000000000000000000000000000
---

## Evidence

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | judgment | UNCERTAIN |
| E2 | AC-2 | judgment | UNCERTAIN |
| E3 | AC-3 | judgment | UNCERTAIN |
| E4 | AC-4 | judgment | UNCERTAIN |
| E5 | AC-5 | judgment | UNCERTAIN |
P61EOF
# AC-3 mang dau (judgment): duong Cong 1 CHI in ID cho nhom do (gate-card.js:250),
# khong in chu. Nen sentinel cua no chi doi o duong B; o duong A doi chinh ID.
P61SENT_A="zulufox yankeecrab whiskeyelk victorowl"
P61SENT_B="zulufox yankeecrab xraymoose whiskeyelk victorowl"
p61_probe() { # <thu-muc-goc> -> in cac sentinel VANG MAT o moi duong
  local GCJ="$1/scripts/gate-card.js" miss=""
  local g1 g2
  g1="$(node "$GCJ" --root "$P61WS" --slug twopath --gate 1 2>/dev/null)"
  g2="$(node "$GCJ" --root "$P61WS" --slug twopath --gate 2 2>/dev/null)"
  for w in $P61SENT_A; do case "$g1" in *"$w"*) ;; *) miss="$miss A:$w";; esac; done
  case "$g1" in *"AC-3"*) ;; *) miss="$miss A:id-AC-3";; esac
  for w in $P61SENT_B; do case "$g2" in *"$w"*) ;; *) miss="$miss B:$w";; esac; done
  echo "$miss"
}
P61MISS="$(p61_probe "$ROOT")"
# Dot bien: LAM LECH THAT duong critText (Cong 2) — bo moi criterion khuon `- **AC-n`
P61MUT="$(mktemp -d)"; mkdir -p "$P61MUT/scripts" "$P61MUT/lib"
cp "$ROOT"/lib/*.js "$P61MUT/lib/" 2>/dev/null
cp "$ROOT"/lib/*.json "$P61MUT/lib/" 2>/dev/null
cp "$ROOT/scripts/gate-card.js" "$P61MUT/scripts/gate-card.js"
perl -0pi -e 's/\Qconst ac = parseAC(l); if (ac && !critText\E/const ac = MUTDROP(l) ? null : parseAC(l); if (ac \&\& !critText/' "$P61MUT/scripts/gate-card.js"
perl -0pi -e 's/\Qconst { parseAC, acBlindSpot, blindSpotText }\E/const MUTDROP = l => \/^\\s*-\\s*\\*\/.test(l);\nconst { parseAC, acBlindSpot, blindSpotText }/' "$P61MUT/scripts/gate-card.js"
if ! grep -q 'MUTDROP(l) ? null : parseAC(l)' "$P61MUT/scripts/gate-card.js" || ! node --check "$P61MUT/scripts/gate-card.js" 2>/dev/null; then
  fail "P68 dot bien KHONG ap duoc — doi chung duong vo hieu, khong the tin case nay"
else
  P61MUTMISS="$(p61_probe "$P61MUT")"
  if [ -n "$P61MISS" ]; then
    fail "P68 hai loi goi LECH tren cay that — thieu:$P61MISS"
  elif [ -z "$P61MUTMISS" ]; then
    fail "P68 doi chung duong HONG: da lam lech that duong critText ma case van xanh — thuoc nay khong do gi"
  else
    pass "P61 hai loi goi khop tren cay that; dot bien lam lech -> bat duoc (${P61MUTMISS# })"
  fi
fi
rm -rf "$P61WS" "$P61MUT"

echo "P69 RONG phai KEU (2 ca kich hoat) + doi chung chong cry-wolf"
P62OUT="$(node -e '
  const {acBlindSpot}=require(process.argv[1]);
  const lines=(arr)=>arr.join("\n");
  // (a) heading dung, khuon LA -> section co nhung parse ra 0
  const a=lines(["## Criteria","","- **AC-1**","- **AC-2**","- **AC-3**"]);
  // (b) heading LECH -> section() rong, khong co section de quet
  const b=lines(["## Acceptance criteria","","- AC-1: Given x, Then y.","- AC-2: Given x, Then y."]);
  // (c) lanh
  const c=lines(["## Criteria","","- AC-1: Given x, Then y.","- AC-2: Given x, Then y."]);
  const ra=acBlindSpot(a,[]), rb=acBlindSpot(b,[]), rc=acBlindSpot(c,["AC-1","AC-2"]);
  console.log("A="+(ra?ra.kind+":"+ra.suspect:"null")+" B="+(rb?rb.kind+":"+rb.suspect+":"+(rb.heading||"-"):"null")+" C="+(rc?rc.kind:"null"));
' "$AC_LIB" 2>&1)"
echo "     $P62OUT"
if ! echo "$P62OUT" | grep -q 'A=blank:3 B=blank:2:## Acceptance criteria C=null'; then
  fail "P69 canh bao RONG sai: $P62OUT"
else pass "P69 ca (a) khuon la + ca (b) heading lech deu KEU va neu heading; contract lanh IM"; fi

echo "P71 CUT phai KEU (ca ma P69 khong phu vi n>=1) + doi chung m==n"
P64OUT="$(node -e '
  const {acBlindSpot}=require(process.argv[1]);
  const rows=["## Criteria",""];
  for(let i=1;i<=2;i++) rows.push("- AC-"+i+": Given x, Then y.");
  for(let i=3;i<=8;i++) rows.push("- AC-"+i+" ~ Given x, Then y.");   // khuon la, khong parse
  const cut=acBlindSpot(rows.join("\n"),["AC-1","AC-2"]);
  const okRows=["## Criteria","","- AC-1: Given x, Then y.","- AC-2: Given x, Then y."];
  const same=acBlindSpot(okRows.join("\n"),["AC-1","AC-2"]);
  console.log("CUT="+(cut?cut.kind+":"+cut.parsed+"/"+cut.suspect:"null")+" SAME="+(same?same.kind:"null"));
' "$AC_LIB" 2>&1)"
echo "     $P64OUT"
if ! echo "$P64OUT" | grep -q 'CUT=short:2/8 SAME=null'; then
  fail "P71 canh bao CUT sai: $P64OUT"
else pass "P71 ca cut 2/8 KEU dung nhanh short; m==n IM (khong cry-wolf)"; fi

echo "P70 dogfood: contract cua chinh kit deu dung heading '## Criteria'"
P63BAD=0
for f in "$ROOT"/_acceptance/*/contract.md; do
  [ -f "$f" ] || continue
  if ! grep -qE '^#{2,6}[[:space:]]+Criteria([[:space:]]|$)' "$f"; then
    echo "     heading criterion khong chuan: $f"
    P63BAD=$((P63BAD+1))
  fi
done
# doi chung duong: ban sao doi heading -> phai bi bat
P63TMP="$(mktemp -d)"; sed 's/^## Criteria$/## Acceptance criteria/' "$ROOT/_acceptance/gate-card-ac-visibility/contract.md" > "$P63TMP/c.md"
if grep -qE '^#{2,6}[[:space:]]+Criteria([[:space:]]|$)' "$P63TMP/c.md"; then
  fail "P70 doi chung duong HONG: ban sao doi heading van lot qua phep kiem"
elif [ "$P63BAD" -ne 0 ]; then
  fail "P70 $P63BAD contract cua kit mang chinh con bo kit bat"
else pass "P70 moi contract cua kit dung '## Criteria'; doi chung duong bat duoc ban doi heading"; fi
rm -rf "$P63TMP"

# --- design-pass cases (P72-P81) begin ---
# Luật chung: đọc vật THẬT từ $ROOT; check() trả vi phạm với thông điệp GHIM
# (khớp evals.yaml của design-pass-skill); ĐỐI CHỨNG DƯƠNG bản nguyên vẹn
# xanh TRƯỚC khi tin bản đột biến đỏ; đột biến trên chuỗi/bản sao, không đụng
# nguồn. N() gộp whitespace để anchor sống sót qua line-wrap.

run "P72 design-pass frontmatter + NOT-for + open invocation (E1)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
N = lambda s: re.sub(r"\s+", " ", s)
def check(text):
    tx = N(text); errs = []
    if "name: design-pass" not in text: errs.append("SKILL.md thieu frontmatter name: design-pass")
    if "Dùng khi" not in tx: errs.append("description thieu trigger Dung khi")
    if "KHÔNG dùng cho" not in tx: errs.append("description thieu NOT-for")
    if "disable-model-invocation" in text: errs.append("design-pass bi khoa model-invocation")
    return errs
assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"
mut = t.replace("---\nname: design-pass", "---\ndisable-model-invocation: true\nname: design-pass", 1)
assert any("design-pass bi khoa model-invocation" in e for e in check(mut)), "dot bien tiem lock khong do"
PY

run "P73 design-pass preflight: keys + {slug} template + DUNG + standalone slug (E2)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
N = lambda s: re.sub(r"\s+", " ", s)
def check(text):
    tx = N(text); errs = []
    for key in ["proto_route", "ds_skill", "dev_cmd", "capture_cmd"]:
        if f"design_pass.{key}" not in tx: errs.append(f"SKILL.md thieu key design_pass.{key}")
    if "{slug}" not in tx: errs.append("proto_route thieu template {slug}")
    if "config-patch" not in tx: errs.append("SKILL.md thieu lenh config-patch mau")
    if "thiếu `proto_route` → DỪNG" not in tx: errs.append("thieu nhanh DUNG khi vang proto_route")
    if "standalone" not in tx or "hỏi user đúng 1 câu" not in tx: errs.append("thieu buoc xac dinh slug standalone")
    return errs
assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"
m1 = t.replace("design_pass.dev_cmd", "design_pass.devcmd")
assert any("SKILL.md thieu key design_pass.dev_cmd" in e for e in check(m1)), "dot bien xoa key khong do"
m2 = t.replace("{slug}", "SLUG")
assert any("proto_route thieu template {slug}" in e for e in check(m2)), "dot bien xoa {slug} khong do"
m3 = N(t).replace("thiếu `proto_route` → DỪNG", "thiếu `proto_route` → tiếp tục")
assert any("thieu nhanh DUNG khi vang proto_route" in e for e in check(m3)), "dot bien doi DUNG khong do"
PY

run "P74 design-pass 2 nguon luat + thang DS + shadcn default (E3)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
N = lambda s: re.sub(r"\s+", " ", s)
def check(text):
    tx = N(text); errs = []
    if "ux-ui-craft" not in tx: errs.append("thieu nguon luat ux-ui-craft")
    if "không resolve" not in tx: errs.append("thieu nhanh degrade ds_skill")
    if "shadcn" not in tx: errs.append("thieu mac dinh shadcn cho repo 0 token")
    if "Nhóm 2" not in tx: errs.append("thieu finding Nhom 2 khi ha nac DS")
    return errs
assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"
m1 = t.replace("không resolve", "khong-doi")
assert any("thieu nhanh degrade ds_skill" in e for e in check(m1)), "dot bien xoa nhanh thang khong do"
m2 = t.replace("shadcn", "libX")
assert any("thieu mac dinh shadcn cho repo 0 token" in e for e in check(m2)), "dot bien xoa shadcn khong do"
PY

run "P75 design-pass thang vat lieu + khai material + cam tu dung (E4)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
N = lambda s: re.sub(r"\s+", " ", s)
def check(text):
    tx = N(text); errs = []
    for rung in ["real-components", "scaffold", "static"]:
        if rung not in tx: errs.append(f"thieu bac vat lieu {rung}")
    if "PHẢI khai `material:`" not in tx: errs.append("thieu khai material khi ha bac vat lieu")
    if "KHÔNG tự dựng route/logic" not in tx: errs.append("thieu cau cam tu dung route/logic")
    return errs
assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"
m1 = N(t).replace("KHÔNG tự dựng route/logic", "cân nhắc dựng")
assert any("thieu cau cam tu dung route/logic" in e for e in check(m1)), "dot bien xoa cau cam khong do"
m2 = N(t).replace("PHẢI khai `material:`", "nên ghi bậc")
assert any("thieu khai material khi ha bac vat lieu" in e for e in check(m2)), "dot bien xoa khai material khong do"
PY

run "P76 design-pass 4 luat cung thanh van (E5)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
N = lambda s: re.sub(r"\s+", " ", s)
RULES = {
    "khong-hex-moi": "không hex mới",
    "khong-webfont": "không webfont",
    "khong-sua-components-ui": "không sửa `components/ui`",
    "khong-logic-write-path": "write-path",
}
def check(text):
    tx = N(text)
    return [f"thieu luat cung: {name}" for name, anchor in RULES.items() if anchor not in tx]
assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"
for name, anchor in RULES.items():
    mut = N(t).replace(anchor, "…")
    assert any(f"thieu luat cung: {name}" in e for e in check(mut)), f"dot bien xoa luat {name} khong do"
PY

run "P77 design-pass vong lap owner-phan-ung + cam tu cham (E6)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
N = lambda s: re.sub(r"\s+", " ", s)
def check(text):
    tx = N(text); errs = []
    if "Reload" not in tx: errs.append("thieu buoc reload trong nhip vong lap")
    if "phản ứng bằng lời" not in tx: errs.append("thieu buoc cho owner phan ung bang loi")
    if "tự chấm thẩm mỹ thay owner" not in tx: errs.append("thieu cau cam tu cham tham my")
    return errs
assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"
mut = N(t).replace("tự chấm thẩm mỹ thay owner", "đánh giá")
assert any("thieu cau cam tu cham tham my" in e for e in check(mut)), "dot bien xoa cau cam khong do"
PY

run "P78 design-pass ket phien: duong capture rieng + cam CT2 + provenance + states (E7)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
N = lambda s: re.sub(r"\s+", " ", s)
def check(text):
    tx = N(text); errs = []
    if "evidence/design-pass/" not in tx: errs.append("design-pass dang tro vao lan CT2")
    if "KHÔNG ghi vào `evidence/design/`" not in tx: errs.append("design-pass dang tro vao lan CT2")
    if "provenance.json" not in tx: errs.append("thieu cau cam provenance.json")
    if "hỏi owner danh sách state" not in tx: errs.append("thieu nhanh hoi owner danh sach state")
    return errs
assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"
m1 = N(t).replace("evidence/design-pass/", "evidence/design/")
assert any("design-pass dang tro vao lan CT2" in e for e in check(m1)), "dot bien doi duong capture khong do"
m2 = t.replace("provenance.json", "prov-file")
assert any("thieu cau cam provenance.json" in e for e in check(m2)), "dot bien xoa cam provenance khong do"
m3 = N(t).replace("hỏi owner danh sách state", "chụp mặc định")
assert any("thieu nhanh hoi owner danh sach state" in e for e in check(m3)), "dot bien xoa nhanh states khong do"
PY

run "P79 design-pass khuon marker: round-trip + than tro toi marker (E8)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
def extract(text):
    m = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", text, re.S)
    if not m:
        return None, ["KHONG rut duoc DESIGN-PASS-NOTE-TEMPLATE"]
    return m.group(1), []
block, errs = extract(t)
assert errs == [], errs
# Fixture SINH TU khuon rut duoc — khong viet tay khuon ben doc.
fx = (block
      .replace("<slug>", "fx-slug")
      .replace("<ISO UTC>", "2026-07-30T00:00:00Z")
      .replace("<url đã mở>", "http://localhost:3000/proto/fx-slug")
      .replace("<real-components|scaffold|static>", "real-components")
      .replace("<tên-skill-đã-nạp|repo-tokens|shadcn-default>", "shadcn-default")
      .replace("[<danh sách state đã duyệt>]", "[default, error]")
      .replace("<n>", "2")
      .replace("<state>", "default").replace("<breakpoint>", "mobile-375")
      .replace("<theme>", "light").replace("<file>", "default--mobile-375")
      .replace("<finding — đã đổi gì, 1 dòng/finding>", "chinh spacing card")
      .replace("<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>", "thieu variant nut nguy hiem"))
lines = fx.splitlines()
assert lines and lines[0] == "---", "khuon khong bat dau bang frontmatter"
end = lines[1:].index("---") + 1
fm = {}
for ln in lines[1:end]:
    if ":" in ln:
        fm[ln.split(":", 1)[0].strip()] = ln.split(":", 1)[1].strip()
want = ["slug", "at", "route", "material", "ds_skill", "states", "breakpoints", "themes", "patched", "deferred"]
missing = [k for k in want if k not in fm]
assert not missing, f"frontmatter khuon thieu truong: {missing}"
body = "\n".join(lines[end + 1:])
assert "### Nhóm 1" in body and "### Nhóm 2" in body, "khuon thieu 2 nhom Findings"
# Than nghi thuc phai TRO TOI khuon — chong marker-trang-tri/mo-coi.
full = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n.*?\nDESIGN-PASS-NOTE-TEMPLATE>>>", t, re.S).group(0)
outside = t.replace(full, "")
def check_ref(text_outside):
    if "DESIGN-PASS-NOTE-TEMPLATE" not in text_outside or "design-pass.md" not in text_outside:
        return ["khuon template mo coi — than nghi thuc khong tro toi marker"]
    return []
assert check_ref(outside) == [], "doi chung duong: than nguyen ven phai tro toi marker"
mut_out = re.sub(r"cặp marker\s+`DESIGN-PASS-NOTE-TEMPLATE`", "cặp marker", outside)
assert check_ref(mut_out) == ["khuon template mo coi — than nghi thuc khong tro toi marker"], \
    "dot bien xoa tham chieu marker khong do dung thong diep"
mut = t.replace("<<<DESIGN-PASS-NOTE-TEMPLATE", "", 1)
b2, errs2 = extract(mut)
assert b2 is None and errs2 == ["KHONG rut duoc DESIGN-PASS-NOTE-TEMPLATE"], \
    "dot bien xoa marker khong do dung thong diep"
PY

run "P80 design-pass engine-clean + mot mat phang (E9)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
files = [root / "skills/design-pass/SKILL.md"]
texts = {str(p.relative_to(root)): p.read_text(encoding="utf-8") for p in files}
rt = (root / "tests/plugins/run-tests.sh").read_text(encoding="utf-8")
# Marker GHÉP MẢNH — nếu để nguyên chuỗi, find() khớp chính literal trong
# source của case này trước khi tới comment thật, vùng quét cụt mất đuôi P80
# + toàn bộ P81 mà mọi sanity vẫn xanh (finding S4 round 1).
BEGIN = "# --- design-pass cases " + "(P72-P81) begin ---"
END = "# --- design-pass cases " + "end ---"
b = rt.find(BEGIN)
e = rt.find(END, b + 1)
assert b != -1 and e != -1 and e > b, "khong tim thay vung case design-pass trong run-tests.sh"
region = rt[b:e]
# Anchor cũng GHÉP MẢNH — round 2 để nguyên chuỗi nên anchor tự khớp source
# của chính assert này, xoá cả P81 guard vẫn xanh (finding S4 round 2).
TAIL = "P81 design-pass" + " smoke"
assert TAIL in region, "vung quet cut duoi — thieu anchor P81 (thuoc phai gan vao vat)"
texts["tests:design-pass-region"] = region
# Pattern ghep manh de vung nay tu-quet khong tu-trung.
CONSUMER = ["one" + "hub", "deal" + "-page", "@one" + "hub", "ms" + "tar"]
SURFACE = ["claude.ai/" + "design", "/design" + "-sync", "/design" + "-login", "/design" + "-mockup"]
def check(text):
    low = text.lower()
    hits = [pat for pat in CONSUMER + SURFACE if pat.lower() in low]
    return [f"vat lieu consumer/surface ngoai trong design-pass: {h}" for h in hits]
assert len(texts) == 2 and all(len(x) > 200 for x in texts.values()), "sanity: vung quet rong/thieu"
for name, text in texts.items():
    assert check(text) == [], f"{name}: {check(text)}"
skill = texts["skills/design-pass/SKILL.md"]
m1 = skill + "\nOne" + "Hub"
assert any("vat lieu consumer/surface ngoai trong design-pass" in x for x in check(m1)), "tiem chuoi consumer khong do"
m2 = skill + "\n/design" + "-sync"
assert any("vat lieu consumer/surface ngoai trong design-pass" in x for x in check(m2)), "tiem chuoi surface ngoai khong do"
PY

run "P81 design-pass smoke DUONG ban nguon (E11)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
p = root / "skills/design-pass/SKILL.md"
assert p.exists(), "cay nguon thieu skills/design-pass"
t = p.read_text(encoding="utf-8")
assert "name: design-pass" in t, "SKILL.md khong doc duoc frontmatter name"
assert "DESIGN-PASS-NOTE-TEMPLATE" in t, "SKILL.md thieu khuon marker"
PY
# --- design-pass cases end ---

# ── P82: ROUND-TRIP frontmatter opportunity-template <-> reader that ─────────
# Khuon rut tu CHINH template (marker OPP-FRONTMATTER-TEMPLATE), doc bang
# frontmatterField cua lib/evidence-core.cjs — reader ma hook/CI dung.
# Doi chung duong chay truoc, dot bien mat frontmatter chay sau.
run "P82 opportunity-template round-trip frontmatter (marker -> frontmatterField)" \
  node - "$ROOT" <<'JS'
const fs = require('fs');
const path = require('path');
const root = process.argv[2];
const tplPath = path.join(root, 'skills/acceptance/references/opportunity-template.md');
const tpl = fs.readFileSync(tplPath, 'utf8');
const core = require(path.join(root, 'lib/evidence-core.cjs'));
const m = tpl.match(/<!-- <<<OPP-FRONTMATTER-TEMPLATE -->\n```yaml\n([\s\S]*?)```\n<!-- OPP-FRONTMATTER-TEMPLATE>>> -->/);
if (!m) { console.error('KHONG rut duoc khuon OPP-FRONTMATTER-TEMPLATE tu template'); process.exit(1); }
const SAMPLE = { slug: 'demo-coho', feature: 'Demo', owner: 'a@b.c', stage: 'decided',
  decision: 'build', decided_by: 'a@b.c', decided_at: '2026-07-30T00:00:00Z',
  gate0_minutes: '6', base_commit: 'abc123', disposition: 'archive' };
let unknown = null;
const filled = m[1].replace(/\{(\w+)\}/g, (_, k) => {
  if (SAMPLE[k] === undefined) { unknown = k; return ''; }
  return SAMPLE[k];
});
if (unknown) { console.error('placeholder la [' + unknown + '] khong co trong SAMPLE — khuon va test da lech'); process.exit(1); }
// Doi chung DUONG: reader that doc dung tung key top-level.
for (const k of ['slug', 'stage', 'decision', 'decided_by', 'decided_at', 'owner']) {
  const v = core.frontmatterField(filled, k);
  if (v !== SAMPLE[k]) { console.error('reader doc key ' + k + ' = [' + v + '] nhung phai la [' + SAMPLE[k] + ']'); process.exit(1); }
}
// Dot bien: xoa dong --- DONG -> reader phai tra null (ghim hanh vi fail).
const broken = filled.replace(/\n---[ \t]*(\r?\n|$)(?![\s\S]*\n---)/, '\n');
if (broken === filled) { console.error('dot bien khong tac dung len khuon — regex xoa --- dong da chet'); process.exit(1); }
if (core.frontmatterField(broken, 'slug') !== null) {
  console.error('dot bien xoa --- dong ma reader van doc duoc — phep do da chet'); process.exit(1);
}
console.log('round-trip OK; dot bien mat frontmatter bi bat');
JS

# ── P83: opportunity-template du 8 section V1 + truong Nguon ngoai ───────────
# Anchor la cac muc DA DUNG THAT o V1 (trang-tu-van-v2) + luoi ke thua B1.
# Checker chay tren ban that (duong) roi tren tung ban dot bien (am).
run "P83 opportunity-template du muc V1 + luoi ke thua (kem doi chung am)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
text = (root / "skills/acceptance/references/opportunity-template.md").read_text(encoding="utf-8")

REQUIRED = [
    "OPP-FRONTMATTER-TEMPLATE",
    "## Vấn đề & ai gặp",
    "## Giả định chốt sinh tử",
    "## Ngưỡng chết / ngưỡng UAT",
    "## Kết quả prototype",
    "## Nguồn ngoài & phạm vi kế thừa",
    "## Cổng 0",
    "## Thước đo thành công",
    "## Bảng nợ kế thừa",
    "## Out of scope từ khám phá",
    "triết-lý/logic",
    "ngôn-ngữ-thiết-kế/hình-thái",
    "không phân loại = chưa đủ điều kiện ký Cổng 0",
]
def missing(t):
    return [n for n in REQUIRED if n not in t]

# Doi chung DUONG: ban that phai du het.
assert missing(text) == [], f"template thieu: {missing(text)}"
# Doi chung AM: pha tung anchor trong ban sao (MOI lan xuat hien — vai anchor
# co mat >1 cho) -> checker PHAI bao thieu dung anchor do.
for needle in REQUIRED:
    mutated = text.replace(needle, needle[:-1] + "_")
    got = missing(mutated)
    assert needle in got, f"dot bien go [{needle}] ma checker khong do — phep do chet"
PY

# ── P84: gap-probe platform-fit cross-check o CA HAI harness ────────────────
# Luoi B1 (retro V1): khong tang nao hoi platform-fit. Ve nay phai nam TRONG
# danh sach cross-check bat buoc cua gap-probe, khong phai cho khac trong file.
run "P84 gap-probe co ve platform-fit (kem doi chung am)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
PINS = {
    "feature-loop/skills/feature-loop/SKILL.md":
        "artifact có tuân chuẩn UI/plugin sẵn có của repo tiêu thụ không; skill/quy định nào của repo LẼ RA phải nạp mà chưa nạp",
}
for rel, needle in PINS.items():
    text = (root / rel).read_text(encoding="utf-8")
    assert needle in text, f"{rel} thieu ve platform-fit"
    # ve phai nam TRONG doan cross-check bat buoc (y (4)), khong troi cho khac
    idx = text.find(needle)
    ctx = text[max(0, idx - 700):idx]
    assert "cross-check" in ctx, f"{rel}: ve platform-fit khong nam trong muc cross-check"
    # doi chung am: go ve trong ban sao -> pin phai truot
    assert needle not in text.replace(needle, "", 1), f"{rel}: dot bien khong hieu luc"
PY

# ── P85: GOAL-TEMPLATE — SKILL la nguon runtime, GUIDE la ban nguoi doc ──────
# B4 (retro V1): package feature-loop KHONG ship GUIDE nen "in theo GUIDE" chet
# o runtime — template nay nhung thang vao SKILL. P85 giu 2 ban khop tung ky tu
# (duong truoc, dot bien sau) va noi LENH IN voi khoi (gap-probe F1).
run "P85 GOAL-TEMPLATE nhung trong SKILL, khop GUIDE, lenh in noi voi khoi" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
RX = re.compile(r"<!-- <<<GOAL-TEMPLATE -->\n```\n([\s\S]*?)```\n<!-- GOAL-TEMPLATE>>> -->")
skill_p = "feature-loop/skills/feature-loop/SKILL.md"
guide_p = "GUIDE.md"
def block(rel, text):
    m = RX.search(text)
    assert m, f"{rel}: KHONG rut duoc khoi GOAL-TEMPLATE qua marker"
    return m.group(1).strip()
skill_t = (root / skill_p).read_text(encoding="utf-8")
guide_t = (root / guide_p).read_text(encoding="utf-8")
sb, gb = block(skill_p, skill_t), block(guide_p, guide_t)
# Doi chung DUONG: hai ban nguyen ven phai khop truoc khi tin phep so.
assert sb == gb, f"GOAL-TEMPLATE lech giua {skill_p} va {guide_p} — dong bo lai 2 khoi marker"
# Tinh chat noi dung template.
assert sb.startswith("/goal "), "template phai bat dau bang /goal "
assert "verified" in sb, "template phai neo dieu kien verified"
assert "REJECT quá 3 round" in sb, "template phai co loi thoat escalate (REJECT qua 3 round)"
assert "signed-off" not in sb, "template KHONG duoc nham dich signed-off"
# Lenh in phai NOI voi khoi — khong chi khoi ton tai (gap-probe F1).
assert "IN NGUYÊN VĂN khối GOAL-TEMPLATE" in skill_t, "GATE 1 thieu lenh in-mac-dinh tham chieu dich danh khoi marker"
assert "template mục /goal trong GUIDE, điền sẵn slug" not in skill_t, "SKILL van tro template sang GUIDE — goc benh B4 chua cat"
# Doi chung AM: dot bien khoi trong ban sao (bo nho) -> phep so phai DO.
mutated = skill_t.replace("sau 15 turns", "sau 16 turns", 1)
assert mutated != skill_t, "dot bien khong tac dung — chuoi neo da doi"
assert block(skill_p, mutated) != gb, f"dot bien khoi trong {skill_p} ma van khop {guide_p} — phep so GOAL-TEMPLATE da chet"
PY

# ── P86: S1 bat nap skill chuan-plugin/DS cua repo tieu thu ─────────────────
# Luoi B1: doi trong chuan noi phai len ban can TRUOC khi sinh artifact.
# Key vang -> ghi chu 1 dong, KHONG chan (khong phai hard-gate).
run "P86 S1 doc feature_loop.ui_standards_skill (kem doi chung am)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
CASES = {
    "feature-loop/skills/feature-loop/SKILL.md": [
        "feature_loop.ui_standards_skill",
        "BẮT BUỘC invoke skill đó ngay",
        "KHÔNG chặn",
    ],
}
for rel, pins in CASES.items():
    text = (root / rel).read_text(encoding="utf-8")
    key = pins[0]
    idx = text.find(key)
    assert idx >= 0, f"{rel} thieu key {key}"
    # cac ve hanh vi phai nam trong CUNG doan quanh key (mot buoc, khong rai rac)
    ctx = text[max(0, idx - 200):idx + 900]
    for pin in pins[1:]:
        assert pin in ctx, f"{rel}: [{pin}] khong nam cung doan voi key ui_standards_skill"
    # doi chung am: go key trong ban sao -> pin phai truot
    assert key not in text.replace(key, "ui_standards_key_bi_go"), f"{rel}: dot bien khong hieu luc"
# Vi du trong van engine phai la placeholder TRUNG TINH — khong mang ten san
# pham cua repo tieu thu (bat bien "kit khong chua", finding S4-r2 #3).
for rel in ["feature-loop/skills/feature-loop/SKILL.md", "GUIDE.md"]:
    t = (root / rel).read_text(encoding="utf-8")
    assert "create-onehub-plugin" not in t, f"{rel}: vi du mang ten repo tieu thu — dung placeholder create-<org>-plugin"
assert "create-<org>-plugin" in (root / "GUIDE.md").read_text(encoding="utf-8"), "GUIDE mat vi du placeholder cho ui_standards_skill"
PY

# ── P87: S1-D — lane cua feature cham UI la design-pass TRUOC Gate 1 ─────────
# S1-D visual-first (quyet 30/07): Gate 1 duyet UI tren ban bam duoc. Descope
# phai co ten trong so quyet dinh. Bang CT1 cu GIU NGUYEN (duong doc-cu,
# P20 canh) — case nay chi ghim lane moi + cau Gate 1.
run "P87 lane S1-D tro design-pass + Gate 1 ban bam duoc (kem doi chung am)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
rel = "feature-loop/skills/feature-loop/SKILL.md"
text = (root / rel).read_text(encoding="utf-8")
# Lane moi: mot doan, du 3 ve. Neo vao HEADING dam cua doan — cac cho khac
# trong file (bang tra CT1, S1#6) cung nhac cum "Nghi thức S1-D" khi tro ve day.
idx = text.find("**Nghi thức S1-D (")
assert idx >= 0, f"{rel} thieu doan Nghi thức S1-D"
ctx = text[idx:idx + 1200]
assert "design-pass" in ctx and "TRƯỚC Gate 1" in ctx, "lane S1-D phai tro design-pass TRUOC Gate 1"
assert '"bỏ design-pass — ' in ctx, "descope lane phai co chuoi may-doc 'bỏ design-pass — '"
assert "BẢN BẤM ĐƯỢC" in ctx, "lane S1-D thieu menh de ban bam duoc"
# Gate 1: trinh ban bam duoc trong muc GATE 1 (sau heading). Chot BIEN cua lat
# cat phai ton tai — find() tra -1 se lang le bien pin theo-section thanh pin
# ca-file (lop bug section-scan da sua o 1.20.1).
g1 = text.find("## GATE 1")
assert g1 >= 0, "thieu muc GATE 1"
s2 = text.find("## S2", g1)
assert s2 > g1, "khong tim thay heading '## S2' sau GATE 1 — lat cat section chet, pin se phinh ca file"
g1ctx = text[g1:s2]
assert "BẢN BẤM ĐƯỢC" in g1ctx, "muc GATE 1 thieu cau trinh ban bam duoc cho UI feature"
assert "ui_standards_skill" in g1ctx, "muc GATE 1 thieu dong ghi chu vang ui_standards_skill"
# Cau hoi lane CU (mockup vs static-only) phai da duoc thay the — va KHONG con
# tham chieu mo coi nao toi no trong toan file (round 2, AC-10 mo rong: sua mot
# cho ma sot tham chieu cung-hinh-dang la lop loi CLAUDE.md goi ten).
assert "Surface mới/redesign → vẽ mockup" not in text, "cau hoi lane cu van con — chua wire S1-D"
assert "câu hỏi lane" not in text, "van con tham chieu mo coi 'câu hỏi lane' — chi dan S1 tu mau thuan"
# Duong doc-cu con nguyen: bang tra CT1 dung 1 lan (nhu P20); CT2 da khai tu.
assert text.count("| **CT1") == 1 and text.count("| **CT2") == 0, "bang tra CT1 bi pha (hoac CT2 moc lai)"
# Doi chung am: go MOI lan xuat hien trong ban sao (cum nay co mat >1 cho:
# bang tra CT1, doan chinh, S1#6) -> pin phai truot.
mutated = text.replace("Nghi thức S1-D", "Nghi thuc da go")
assert "Nghi thức S1-D" not in mutated, "dot bien khong hieu luc"
PY

# ── P88: release co chu dich — version floor + description khop hanh vi ─────
# Consumer chi nhan luoi qua release: quen bump = feature ship ma hieu luc 0.
# Floor semver (>=), KHONG ghim literal == — tranh vong "bump -> stale" (P03).
run "P88 version floor 1.29/1.22 + description nhac hanh vi moi" \
  python3 - "$ROOT" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
def ver(rel):
    return tuple(int(x) for x in json.loads((root / rel).read_text())["version"].split("."))
def desc(rel):
    return json.loads((root / rel).read_text())["description"]
assert ver(".claude-plugin/plugin.json") >= (1, 29, 0), "acceptance-gate chua bump toi 1.29.0"
assert ver("feature-loop/.claude-plugin/plugin.json") >= (1, 22, 0), "feature-loop chua bump toi 1.22.0"
# Description phai nhac hanh vi moi (keyword chuc nang, on dinh qua cac ban sau):
for kw in ("opportunity-template", "DECISION-DIAGRAM-SURFACES", "MAP_LABELS", "UAT-COPY-PROCEDURE"):
    assert kw in desc(".claude-plugin/plugin.json"), f"desc acceptance-gate thieu {kw}"
d = desc("feature-loop/.claude-plugin/plugin.json")
for kw in ("ui_standards_skill", "design-pass", "GOAL-TEMPLATE", "LOOP-PICTURE-CLAUSE", "REPIN-TEMPLATE", "carry-plan.mjs"):
    assert kw in d, f"desc feature-loop thieu {kw}"
# Doi chung am cua phep so semver: version thap hon floor phai truot.
assert not ((1, 20, 1) >= (1, 21, 0)), "phep so semver chet — tuple compare khong con dung"
PY

# ── P89-P96: luat ngon ngu mat nguoi (ngon-ngu-mat-nguoi) ───────────────────
# Bat bien kho: moi case chay ban NGUYEN VEN truoc (doi chung DUONG) roi moi
# dot bien, va ghim DUNG THONG DIEP chu khong chi ma thoat.

run "P89 ban luat: neo vao dung vat — 6 luat, 2 phep thu (dinh nghia), vi du, mien tru, nguong N5, dong tu dien N6 (E1-E4)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8")

# NEO vao DUNG VAT, khong tim chuoi tren toan file. Round 3 bat hai lan cung mot
# lop: "CONTEXT.md" va "Xoá-tên-máy" moi chuoi xuat hien HAI lan trong file, nen
# pha hong dung cho can do van XANH vi lan xuat hien thu hai giu den.
def section(text, heading):
    m = re.search(rf"^## {re.escape(heading)}\s*$\n([\s\S]*?)(?=^## |\Z)", text, re.M)
    return m.group(1) if m else None

def check(text):
    errs = []
    m = re.search(r"<!-- <<<HFL-LAW-TABLE -->\n([\s\S]*?)<!-- HFL-LAW-TABLE>>> -->", text)
    if not m:
        return ["KHONG rut duoc HFL-LAW-TABLE"]
    for n in range(1, 7):
        if not re.search(rf"^\| N{n} \| \S", m.group(1), re.M):
            errs.append(f"thieu luat N{n}")

    # AC-1 ve "hai phep thu": neo vao muc dinh nghia, khong phai toan van ban.
    tests = section(text, "Hai phép thử (rẻ, làm được trong vài giây)")
    if tests is None:
        errs.append("thieu muc dinh nghia hai phep thu")
    else:
        for name in ("Xoá-tên-máy", "Người-thứ-ba"):
            if not re.search(rf"^- \*\*{re.escape(name)}\*\*:", tests, re.M):
                errs.append(f"thieu phep thu {name}")

    outside = text.replace(m.group(0), "")
    for n in range(1, 7):
        if not re.search(rf"^\| N{n} \| .+ \| .+ \|", outside, re.M):
            errs.append(f"luat N{n} chua co vi du TRUOC/SAU")
    for machine in ("evals.yaml", "run-log.jsonl", "frontmatter"):
        if machine not in text:
            errs.append(f"ve mien tru khong goi dich danh {machine}")
    if "KHÔNG ÁP" not in text:
        errs.append("thieu ve pham vi KHONG ap")
    if not re.search(r"ba bước nối tiếp hoặc[\s\S]{0,40}hai nhánh rẽ", text):
        errs.append("N5 khong co nguong kich hoat")

    # AC-3: neo vao DUNG dong van hanh cua N6. Chuoi CONTEXT.md con xuat hien o
    # muc "Tu moi ... dua vao tu dien" — tim tren toan file la do nham cho do.
    if not re.search(r"^\*\*Từ điển sản phẩm sống ở đâu \(N6\):\*\*[^\n]*CONTEXT\.md", text, re.M):
        errs.append("N6 khong chi dich tu dien")
    return errs

assert check(t) == [], check(t)                                  # doi chung DUONG

m1 = re.sub(r"^\| N4 \|.*$", "", t, count=1, flags=re.M)
assert "thieu luat N4" in check(m1), "dot bien xoa luat N4 khong do dung thong diep"

m2 = t.replace("ba bước nối tiếp hoặc", "nhiều bước hoặc")
assert "N5 khong co nguong kich hoat" in check(m2), "dot bien xoa nguong khong do dung thong diep"

m3 = t.replace("KHÔNG ÁP", "xxx", 1)
assert "thieu ve pham vi KHONG ap" in check(m3), "dot bien xoa ve mien tru khong do dung thong diep"

m4 = t.replace("| N6 | Bật CT-S cho slug này |", "|", 1)
assert "luat N6 chua co vi du TRUOC/SAU" in check(m4), "dot bien xoa vi du N6 khong do dung thong diep"

# Dot bien E4 KHAI trong evals.yaml — round 3 phat hien no chua bao gio ton tai.
m5 = re.sub(r"^\*\*Từ điển sản phẩm sống ở đâu \(N6\):\*\*[^\n]*$",
            "**Từ điển sản phẩm sống ở đâu (N6):** từ điển sản phẩm của kho đang làm.",
            t, count=1, flags=re.M)
assert "N6 khong chi dich tu dien" in check(m5), \
    "dot bien thay dong N6 bang cum chung chung khong do dung thong diep"

# Dot bien cho ve "hai phep thu" — xoa DINH NGHIA, giu nguyen cac cho NHAC TEN.
m6 = re.sub(r"^- \*\*Xoá-tên-máy\*\*:[\s\S]*?(?=^- \*\*Người-thứ-ba\*\*:)", "", t, count=1, flags=re.M)
assert "thieu phep thu Xoá-tên-máy" in check(m6), \
    "dot bien xoa dinh nghia phep thu khong do dung thong diep"
PY

run "P92 hai khuon trinh bay: marker duy nhat + round-trip bang 3 cot + so do mermaid (E9, E10)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8")
COLS = ["Người dùng thấy gì khác", "Đụng đâu", "Phục vụ tiêu chí"]

def block(text, name):
    m = re.search(rf"<!-- <<<{name} -->\n([\s\S]*?)<!-- {name}>>> -->", text)
    return m.group(1) if m else None

# luat tach o bang markdown cua kit — cung luat scripts/gate-card.js dung
def rows(md):
    out = []
    for l in md.splitlines():
        if not l.strip().startswith("|"):
            continue
        cells = [c.strip() for c in l.split("|")[1:-1]]
        if not cells or all(re.fullmatch(r":?-+:?", c) for c in cells):
            continue
        out.append(cells)
    return out

def check(text):
    errs = []
    tb = block(text, "PLAN-SUMMARY-TABLE-TEMPLATE")
    dg = block(text, "DECISION-DIAGRAM-TEMPLATE")
    lead = text.split("<!-- <<<DECISION-DIAGRAM-TEMPLATE -->")[0]
    tail = lead.rstrip().rsplit("\n\n", 1)[-1]
    if "mặt phẳng cụ thể" not in tail:
        errs.append("khoi vi du khong noi ro mat phang")
    if tb is None:
        errs.append("khong rut duoc khuon bang")
    if dg is None:
        errs.append("khong rut duoc khuon so do")
    if tb is not None:
        r = rows(tb)
        if not r or r[0] != COLS:
            errs.append(f"khuon bang sai tieu de cot: {r[0] if r else None}")
        for i, row in enumerate(r):
            if len(row) != 3:
                errs.append(f"dong {i} khong du 3 o (co {len(row)})")
            for c in row:
                if "·" in c or ";" in c:
                    errs.append("o bang nhoi nhieu viec — N4")
        if len(r) < 2:
            errs.append("khuon bang thieu dong vi du")
    if dg is not None:
        f = re.search(r"```(\w*)\n([\s\S]*?)```", dg)
        if not f or f.group(1) != "mermaid":
            errs.append("khoi so do khong khai mermaid")
        else:
            body = f.group(2)
            labels = re.findall(r"[\[\{]([^\]\}]+)[\]\}]", body)
            if len(labels) < 2:
                errs.append("so do it hon 2 nut")
            if "-->" not in body:
                errs.append("so do khong co canh")
            for lb in labels:
                # <br/> la thang xuong dong cua mermaid, khong phai duong dan —
                # go truoc khi soi, neu khong moi nhan co xuong dong deu bi ket
                # oan la ten may (round 1 cua case nay dam dung bay do).
                bare = re.sub(r"<br\s*/?>", " ", lb)
                if re.search(r"[\w-]+\.(md|js|mjs|json|yaml|yml|sh)\b|\w/\w", bare):
                    errs.append(f"nhan nut la ten may: {lb}")
    return errs

assert check(t) == [], check(t)                                  # doi chung DUONG
assert t.count("<<<PLAN-SUMMARY-TABLE-TEMPLATE") == 1, "khuon bang khong duy nhat"
assert t.count("<<<DECISION-DIAGRAM-TEMPLATE") == 1, "khuon so do khong duy nhat"

def has(errs, frag):
    return any(frag in e for e in errs)

m1 = t.replace("| Đụng đâu ", "", 1)
assert has(check(m1), "sai tieu de cot"), "dot bien bo 1 cot khong do dung thong diep"

m2 = t.replace("| Phục vụ tiêu chí |", "| Phục vụ tiêu chí | Cột thừa |", 1)
assert has(check(m2), "sai tieu de cot"), "dot bien them cot 4 khong do dung thong diep"

m3 = t.replace("Người duyệt đọc được bảng kế hoạch bằng tiếng sản phẩm",
               "Sửa bên viết · sửa bên đọc", 1)
assert has(check(m3), "nhoi nhieu viec"), "dot bien nhoi 2 viec vao 1 o khong do dung thong diep"

m4 = t.replace("```mermaid", "```", 1)
assert has(check(m4), "khong khai mermaid"), "dot bien bo khai bao ngon ngu khong do dung thong diep"

m5 = t.replace("A[Người duyệt mở thẻ]", "A[gate-card.js]", 1)
assert has(check(m5), "nhan nut la ten may"), "dot bien nhan nut ten file khong do dung thong diep"

# Hai dot bien duoi day E9 DA KHAI tu dau nhung round 3 phat hien chung chua bao
# gio ton tai — hai nhanh "khong rut duoc khuon ..." chua tung bi da RED.
m6 = t.replace("<!-- <<<PLAN-SUMMARY-TABLE-TEMPLATE -->", "", 1)
assert has(check(m6), "khong rut duoc khuon bang"), \
    "dot bien xoa marker mo cua khuon bang khong do dung thong diep"

m8 = t.replace("một mặt phẳng cụ thể", "một cách", 1)
assert has(check(m8), "khong noi ro mat phang"), \
    "dot bien xoa nhan mat phang cua khoi vi du khong do dung thong diep"

m7 = t.replace("<!-- <<<DECISION-DIAGRAM-TEMPLATE -->", "", 1)
assert has(check(m7), "khong rut duoc khuon so do"), \
    "dot bien xoa marker mo cua khuon so do khong do dung thong diep"
PY

run "P96 tu dien: rut tu qua marker HFL-GLOSSARY-TERMS roi tra CONTEXT.md (E14)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
ref = (root / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8")
ctx = (root / "CONTEXT.md").read_text(encoding="utf-8")
m = re.search(r"<!-- <<<HFL-GLOSSARY-TERMS -->\n([\s\S]*?)<!-- HFL-GLOSSARY-TERMS>>> -->", ref)
assert m, "KHONG rut duoc HFL-GLOSSARY-TERMS"
terms = [l.strip()[2:].strip() for l in m.group(1).splitlines() if l.strip().startswith("- ")]
assert len(terms) >= 3, f"chi rut duoc {len(terms)} tu — parser hong hoac danh sach rong"

def check(glossary):
    return [f"tu '{x}' chua co muc trong tu dien" for x in terms
            if not re.search(rf"^\*\*{re.escape(x)}\*\*:", glossary, re.M | re.I)]

assert check(ctx) == [], check(ctx)                              # doi chung DUONG
# Tu moi cham mot khai niem DA CO trong tu dien thi muc cua no phai noi ro khac
# o cho nao — khong thi tu dien co hai tu cho hai thu ma nguoi doc khong phan
# biet duoc (finding S4-r1).
# Danh sach MONG DOI ghim cung — KHONG suy tu chinh khoi dang do. Ban truoc
# bao boc ca rang nay trong `if "mặt phẳng" in terms:`, nen go hai tu khoi khoi
# la go luon yeu cau: da tai hien duoc, go 2 tu o CA HAI noi -> suite van XANH.
MUST = ["mặt người", "mặt máy", "lỗ-kit", "mặt phẳng", "nhìn-thấy-hình"]
missing_must = [x for x in MUST if x not in terms]
assert not missing_must, f"khoi tu dien thieu tu bat buoc: {missing_must}"

# Doi chung am THAT: pha KHOI tu dien trong mot ban sao roi chay lai CHINH phep
# rut + phep kiem. Ban truoc chi lam so hoc tren hai list dung tai cho nen no
# hang dung — ca ban ghim-cung lan ban tu-gac deu qua, tuc no khong phan biet
# duoc dung lop loi no tu nhan la canh (bat o S4-r3).
def terms_of(law_text):
    mm = re.search(r"<!-- <<<HFL-GLOSSARY-TERMS -->\n([\s\S]*?)<!-- HFL-GLOSSARY-TERMS>>> -->", law_text)
    if not mm:
        return None
    return [l.strip()[2:].strip() for l in mm.group(1).splitlines() if l.strip().startswith("- ")]

_law_mut = ref.replace("- mặt phẳng\n", "", 1)
_t_mut = terms_of(_law_mut)
assert _t_mut is not None and [x for x in MUST if x not in _t_mut] == ["mặt phẳng"], \
    "go 'mat phang' khoi KHOI TU DIEN that ma phep kiem khong bao thieu — rang tu-gac"
    # Neo vao dung VE PHAN BIET, khong phai chi vao chu "Surface" — chu do con
    # xuat hien o cau giai thich nen kiem long se khong bao gio do.
def has_contrast(g):
    m = re.search(r"^\*\*Mặt phẳng\*\*:[\s\S]*?(?=^\*\*|\Z)", g, re.M)
    return bool(m) and "Khác **Surface**" in m.group(0)
assert has_contrast(ctx), "muc 'mat phang' khong neu ro khac Surface o cho nao"
assert not has_contrast(ctx.replace("Khác **Surface**", "Ghi chu them", 1)), \
    "dot bien go ve phan biet Surface khong lam phep do doi"
mut = re.sub(rf"^\*\*{re.escape(terms[0])}\*\*:.*?(?=^\*\*|\Z)", "", ctx,
             count=1, flags=re.M | re.S | re.I)
assert check(mut) == [f"tu '{terms[0]}' chua co muc trong tu dien"], \
    "dot bien xoa muc tu dien khong do dung thong diep"
PY

run "P90 tam cho tro nap ban luat + khuon MOI lan trinh + round-trip cau-ve-hinh (E5, E12, E6h)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
REF = "skills/acceptance/references/human-facing-language.md"
SITES = ["commands/acceptance-card.md", "commands/acceptance-report.md",
         "commands/acceptance-status.md",
         "feature-loop/skills/feature-loop/SKILL.md"]
LOOPS = (SITES[3],)
assert len(SITES) == 4, "danh sach cho tro khong du 4"

# Khuon cau-ve-hinh: rut tu BAN LUAT (ben viet), tim trong hai ban vong lap
# (ben doc). Phep do DUONG thay cho ve phu dinh "khong ghim mot dinh dang nao" —
# danh sach cam tren khong gian mo khong bao gio du (gap-probe P1).
LAW = (root / REF).read_text(encoding="utf-8")
_m = re.search(r"<!-- <<<LOOP-PICTURE-CLAUSE -->\n([\s\S]*?)<!-- LOOP-PICTURE-CLAUSE>>> -->", LAW)
CLAUSE = _m.group(1).strip() if _m else None

def check(read):
    errs = []
    for rel in SITES:
        t = read(rel)
        if REF not in t:
            errs.append(f"{rel}: thieu duong dan ban luat")
        if "TRƯỚC khi viết" not in t:
            errs.append(f"{rel}: thieu menh lenh nap")
    for rel in LOOPS:
        t = read(rel)
        if "PLAN-SUMMARY-TABLE-TEMPLATE" not in t:
            errs.append(f"{rel}: thieu ten khuon bang")
        if CLAUSE is None:
            errs.append("khong rut duoc khuon LOOP-PICTURE-CLAUSE tu ban luat")
        elif CLAUSE not in t:
            errs.append(f"{rel}: cau ve hinh lech khuon mot-nguon")
        if "MỌI lần trình" not in t:
            errs.append(f"{rel}: pham vi khuon bi thu hep")
    return errs

live = lambda rel: (root / rel).read_text(encoding="utf-8")
assert check(live) == [], check(live)                            # doi chung DUONG

gone = SITES[2]
m1 = lambda rel: live(rel).replace(REF, "xxx") if rel == gone else live(rel)
assert f"{gone}: thieu duong dan ban luat" in check(m1), \
    "dot bien go pointer khoi 1 file khong do dung thong diep"

lp = LOOPS[0]
m2 = lambda rel: live(rel).replace("MỌI lần trình", "riêng T3") if rel == lp else live(rel)
assert f"{lp}: pham vi khuon bi thu hep" in check(m2), \
    "dot bien thu hep pham vi khuon khong do dung thong diep"

assert CLAUSE, "khong rut duoc khuon cau-ve-hinh tu ban luat"

# Ten bang tra ma KHUON tu nhac phai giai ra mot cap marker THAT trong ban luat.
# Danh sai ten roi lan deu ca ba noi thi ba ban van KHOP NHAU — da tai hien
# duoc: suite XANH trong khi ca hai harness tro toi mot bang khong ton tai.
def cited_marker_ok(law_text, clause):
    names = re.findall(r"`([A-Z][A-Z0-9-]+)`", clause)
    if not names:
        return ["khuon cau-ve-hinh khong nhac ten bang tra nao"]
    bad = []
    for n in names:
        if not re.search(rf"<!-- <<<{re.escape(n)} -->\n[\s\S]*?<!-- {re.escape(n)}>>> -->", law_text):
            bad.append(f"khuon nhac ten '{n}' nhung ban luat khong co cap marker do")
    return bad

assert cited_marker_ok(LAW, CLAUSE) == [], cited_marker_ok(LAW, CLAUSE)

# Tu dien cung tro toi bang tra BANG TEN. Cung chang con tro, cung lop loi:
# danh sai ten thi nguoi doc di tim mot bang khong ton tai (bat o S4-r3).
CTX = (root / "CONTEXT.md").read_text(encoding="utf-8")
_mp = re.search(r"^\*\*Mặt phẳng\*\*:[\s\S]*?(?=^\*\*|\Z)", CTX, re.M)
assert _mp, "CONTEXT.md khong co muc 'Mat phang'"
assert cited_marker_ok(LAW, _mp.group(0)) == [], cited_marker_ok(LAW, _mp.group(0))
_ctx_typo = _mp.group(0).replace("DECISION-DIAGRAM-SURFACES", "DECISION-DIAGRAM-SURFACE")
assert cited_marker_ok(LAW, _ctx_typo), \
    "danh sai ten bang tra trong tu dien ma khong bi bat — con tro chet van xanh"
_typo = CLAUSE.replace("DECISION-DIAGRAM-SURFACES", "DECISION-DIAGRAM-SURFACE")
assert cited_marker_ok(LAW.replace(CLAUSE, _typo, 1), _typo), \
    "danh sai ten bang tra trong khuon ma khong bi bat — con tro chet van xanh"
lp2 = LOOPS[0]
m3 = lambda rel: live(rel).replace(CLAUSE, CLAUSE.replace("kèm hình", "kèm sơ đồ"), 1) if rel == lp2 else live(rel)
assert f"{lp2}: cau ve hinh lech khuon mot-nguon" in check(m3), \
    "dot bien sua mot chu trong khuon khong do dung thong diep"
m4 = lambda rel: live(rel).replace(CLAUSE, "Điểm quyết định rắc rối thì vẽ bằng khối ký tự.", 1) if rel == lp2 else live(rel)
assert f"{lp2}: cau ve hinh lech khuon mot-nguon" in check(m4), \
    "dot bien tu dien dat kem ghim mot dinh dang khac khong bi bat"
PY

run "P91 con tro RUT TU file tro vao vat that tren cay nguon, kem dem sanity 8 (E6)" \
  python3 - "$ROOT" <<'PY'
import re, shutil, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
SITES = ["commands/acceptance-card.md", "commands/acceptance-report.md",
         "commands/acceptance-status.md",
         "feature-loop/skills/feature-loop/SKILL.md"]
RX = re.compile(r"skills/acceptance/references/[\w.-]+\.md")

def check(base):
    errs, found = [], 0
    for rel in SITES:
        hits = sorted(set(RX.findall((base / rel).read_text(encoding="utf-8"))))
        if not hits:
            errs.append(f"{rel}: khong rut duoc con tro nao")
            continue
        found += 1
        for h in hits:
            if not (base / h).is_file():
                errs.append(f"{rel}: con tro tro file khong ton tai — {h}")
    if found != 4:
        errs.append(f"chi rut duoc con tro tu {found}/4 file — grep hong, khong phai sach")
    return errs

assert check(root) == [], check(root)                            # doi chung DUONG (cay that)

# Ban sao dung DU moi vat duoc tro toi — khong chi ban luat — de doi chung
# duong that su xanh; thieu mot vat la ban sao do san va phep do chet.
targets = set()
for rel in SITES:
    targets |= set(RX.findall((root / rel).read_text(encoding="utf-8")))
tmp = Path(tempfile.mkdtemp())
try:
    for rel in list(SITES) + sorted(targets):
        (tmp / rel).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(root / rel, tmp / rel)
    assert check(tmp) == [], f"ban sao NGUYEN VEN phai XANH truoc: {check(tmp)}"
    victim = tmp / "skills/acceptance/references/human-facing-language.md"
    victim.rename(victim.with_name("doi-ten.md"))
    errs = check(tmp)
    assert any("con tro tro file khong ton tai" in e for e in errs), \
        f"dot bien doi ten vat dich khong do dung thong diep: {errs}"
finally:
    shutil.rmtree(tmp)
PY

run "P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)" \
  python3 - "$ROOT" <<'PY'
import re, shutil, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
REF_REL = "skills/acceptance/references/human-facing-language.md"
SPEC_REL = "docs/specs/workflow-v2-spec.md"
RX = re.compile(r"<!-- <<<HFL-LAW-TABLE -->\n([\s\S]*?)<!-- HFL-LAW-TABLE>>> -->")

def law(text):
    m = RX.search(text)
    return m.group(1) if m else None

def compare(a_text, b_text):
    a, b = law(a_text), law(b_text)
    if a is None or b is None:
        return [f"thieu marker bang luat: {REF_REL}={a is not None} {SPEC_REL}={b is not None}"]
    if a != b:
        return [f"bang luat lech giua {REF_REL} va {SPEC_REL}"]
    return []

ref = (root / REF_REL).read_text(encoding="utf-8")
spec = (root / SPEC_REL).read_text(encoding="utf-8")
assert compare(ref, spec) == [], compare(ref, spec)              # doi chung DUONG
mut = spec.replace("Một dòng một ý", "Mot dong mot y", 1)
errs = compare(ref, mut)
assert errs and "bang luat lech" in errs[0] and REF_REL in errs[0] and SPEC_REL in errs[0], \
    f"dot bien sua 1 chu khong do dung thong diep (phai neu ten CA HAI file): {errs}"

# ── Vung quet ───────────────────────────────────────────────────────────────
# Loai DUNG ba muc AC-10 khai, cong ba muc ha tang KHONG phai cay nguon, moi muc
# ghi ly do. Ba vong truoc deu chet vi vung quet hep hon loi hua:
#   r1 danh-sach-cho-phep vai thu muc -> bo lot vendor/
#   r2 khoet them docs/superpowers/  -> vung do dang chua ban sao that
#   r3 bo moi path co dau cham + loc duoi file -> bo lot .out-of-scope/ (nguon
#      that, CLAUDE.md goi dich danh) va moi ban sao nam trong .yaml/.txt/.py
# Nen bay gio: khong loc duoi file (doc NHI PHAN, so byte — cung het luon lop
# loi decode im lang), va chi loai nhung muc co TEN kem ly do.
SKIP_TOP = {"plugins", "_acceptance", "tests"}      # ba muc AC-10 khai
SKIP_INFRA = {".git", ".claude", "node_modules"}    # ruot VCS / cache phien / phu thuoc — khong phai nguon

def scan(base):
    out = []
    for p in base.rglob("*"):
        if not p.is_file():
            continue
        rel = p.relative_to(base).parts
        if rel[0] in SKIP_TOP:
            continue
        if any(x in SKIP_INFRA for x in rel):
            continue
        out.append(p)
    return out

EXPECT_DIRS = ["skills", "commands", "feature-loop", "lib", "scripts",
               "hooks", "docs", "vendor"]

files = scan(root)
dc = {d: 0 for d in EXPECT_DIRS}
for p in files:
    top = p.relative_to(root).parts[0]
    if top in dc:
        dc[top] += 1
empty = [d for d, n in dc.items() if n == 0]
assert not empty, f"thu muc nguon khong gop file nao (doi ten? xoa?): {empty}"
assert len(files) >= 40, f"chi quet duoc {len(files)} file — vung quet hong"

COL = ("Người dùng thấy" + " gì khác").encode()      # ghep manh — bay P80
DIAG = ("Đủ ba bước<br/>" + "hoặc hai nhánh?").encode()
LAW = ("Mã số là tra cứu, " + "không phải nội dung.").encode()
# AC-8 doi cap marker duy nhat TRONG TOAN KHO. Dem CAP THAT (mo + dong), khong
# dem lan nhac ten: mot so do ASCII trong tai lieu nhac ten marker la hop le,
# mot KHOI thu hai rut duoc thi khong.
PAIRS = {"PLAN-SUMMARY-TABLE-TEMPLATE": 1, "DECISION-DIAGRAM-TEMPLATE": 1,
         "HFL-GLOSSARY-TERMS": 1, "HFL-LAW-TABLE": 2,
         "DECISION-DIAGRAM-SURFACES": 1, "DECISION-PICTURE-TEST": 1,
         "LOOP-PICTURE-CLAUSE": 1, "DECISION-DRAW-MECHANISMS": 1}

def survey(base):
    body = {COL: 0, DIAG: 0, LAW: 0}
    where = {COL: [], DIAG: [], LAW: []}
    pair = {k: 0 for k in PAIRS}
    pair_where = {k: [] for k in PAIRS}
    for p in scan(base):
        b = p.read_bytes()
        for k in body:
            if k in b:
                body[k] += 1
                where[k].append(str(p.relative_to(base)))
        try:
            t = b.decode("utf-8")
        except UnicodeDecodeError:
            continue
        for name in pair:
            c = len(re.findall(rf"<!-- <<<{name} -->\n[\s\S]*?<!-- {name}>>> -->", t))
            if c:
                pair[name] += c
                pair_where[name].append(str(p.relative_to(base)))
    return body, where, pair, pair_where

def verdict(base):
    body, where, pair, pair_where = survey(base)
    errs = []
    if body[COL] != 1:
        errs.append(f"ten cot xuat hien o {body[COL]} file — khuon bang phai mot cho: {where[COL]}")
    if body[DIAG] != 1:
        errs.append(f"than so do xuat hien o {body[DIAG]} file — khuon so do phai mot cho: {where[DIAG]}")
    if body[LAW] != 2:
        errs.append(f"than luat xuat hien o {body[LAW]} file — chi duoc 2 cho da biet: {where[LAW]}")
    for name, want in PAIRS.items():
        if pair[name] != want:
            per_dir = {}
            for w in pair_where[name]:
                d0 = w.split("/")[0]
                per_dir[d0] = per_dir.get(d0, 0) + 1
            errs.append(f"cap marker {name} co {pair[name]} khoi (mong doi {want}) — theo thu muc goc {per_dir}, chi tiet {pair_where[name]}")
    return errs

assert verdict(root) == [], verdict(root)                         # doi chung DUONG

# Doi chung AM: GHI FILE THAT vao CA BA vung tung bi bo lot qua ba vong.
tmp = Path(tempfile.mkdtemp())
try:
    dst = tmp / "repo"
    subprocess.run(["rsync", "-a", "--exclude", ".git", "--exclude", ".claude",
                    "--exclude", "plugins", "--exclude", "node_modules",
                    f"{root}/", f"{dst}/"], check=True)
    assert verdict(dst) == [], f"ban sao NGUYEN VEN phai XANH truoc: {verdict(dst)}"
    src = (dst / REF_REL).read_text(encoding="utf-8")
    for rel in ("vendor/impeccable/BAN-SAO-THU.md",                   # r1 bo lot
                "docs/superpowers/plans/BAN-SAO-THU.md",               # r2 khoet ra
                ".out-of-scope/BAN-SAO-THU.md"):                       # r3 bo lot
        plant = dst / rel
        plant.parent.mkdir(parents=True, exist_ok=True)
        plant.write_text(src, encoding="utf-8")
    e = verdict(dst)
    for frag in ("khuon bang phai mot cho", "khuon so do phai mot cho",
                 "chi duoc 2 cho da biet", "cap marker PLAN-SUMMARY-TABLE-TEMPLATE",
                 "cap marker DECISION-DIAGRAM-SURFACES", "cap marker DECISION-PICTURE-TEST",
                 "cap marker LOOP-PICTURE-CLAUSE", "cap marker DECISION-DRAW-MECHANISMS"):
        assert any(frag in x for x in e), f"trong ban sao that ma khong bat duoc '{frag}': {e}"
    # Chung minh RIENG rang vung dau-cham va duoi-file-la khong con la diem mu.
    shutil.rmtree(dst); subprocess.run(["rsync", "-a", "--exclude", ".git",
        "--exclude", ".claude", "--exclude", "plugins", "--exclude", "node_modules",
        f"{root}/", f"{dst}/"], check=True)
    only = dst / ".out-of-scope/ban-sao-thu.yaml"
    only.parent.mkdir(parents=True, exist_ok=True)
    only.write_text(src, encoding="utf-8")
    e2 = verdict(dst)
    assert any("khuon bang phai mot cho" in x for x in e2), \
        f"ban sao trong thu muc dau-cham voi duoi .yaml van lot luoi: {e2}"
finally:
    shutil.rmtree(tmp)
PY

run "P94 quyen tra lai tai cong + tien to so tren the (E13)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
CARDS = ["commands/acceptance-card.md"]
PREFIX = "lỗ-kit — ngôn ngữ mặt người"

def check(read):
    errs = []
    for rel in CARDS:
        t = read(rel)
        if PREFIX not in t:
            errs.append(f"{rel}: thieu tien to so quyet dinh")
        if "revisit" not in t:
            errs.append(f"{rel}: khong noi ghi vao so bang entry nao")
        if "TRẢ LẠI" not in t and "reject the card" not in t:
            errs.append(f"{rel}: thieu quyen tra lai tai cong")
    return errs

live = lambda rel: (root / rel).read_text(encoding="utf-8")
assert check(live) == [], check(live)                            # doi chung DUONG
gone = CARDS[0]
mut = lambda rel: live(rel).replace(PREFIX, "xxx") if rel == gone else live(rel)
assert f"{gone}: thieu tien to so quyet dinh" in check(mut), \
    "dot bien go quyen tra lai khoi 1 harness khong do dung thong diep"
PY

run "P95 con tro giai duoc TRONG GOI — goi khac goi phai qua bo giai (E7)" \
  python3 - "$ROOT" <<'PY'
import re, shutil, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
REF = "skills/acceptance/references/human-facing-language.md"
IN_PKG = ["commands/acceptance-card.md", "commands/acceptance-report.md",
          "commands/acceptance-status.md"]
RX = re.compile(r"skills/acceptance/references/[\w.-]+\.md")

def check(pkg_ag, pkg_fl):
    errs = []
    for rel in IN_PKG:                    # cung goi: ghep goc goi phai ra vat that
        t = (pkg_ag / rel).read_text(encoding="utf-8")
        hits = sorted(set(RX.findall(t)))
        if not hits:
            errs.append(f"{rel}: khong rut duoc con tro nao trong goi")
        for h in hits:
            if not (pkg_ag / h).is_file():
                errs.append(f"pointer trong goi acceptance-gate tro file khong ton tai — {h}")
    fl = pkg_fl / "skills/feature-loop/SKILL.md"
    t = fl.read_text(encoding="utf-8")
    # HAI dieu kien khac nhau, HAI thong diep khac nhau. Round 3 bat: dung chung
    # mot thong diep thi dot bien chi chung minh duoc dieu kien thu nhat, nhanh
    # con lai khong bao gio bi da RED rieng.
    if f"--plugin acceptance-gate --require {REF}" not in t:
        errs.append("goi feature-loop thieu loi goi bo giai plugin")
    if "PLUGIN_ROOT}/" + REF in t:
        errs.append("goi feature-loop ghep thang goc goi — goi nay khong chua ban luat")
    if not (pkg_fl / "scripts/resolve-plugin.mjs").is_file():
        errs.append("bo giai plugin vang trong goi feature-loop")
    # Con tro phai giai toi tan VAT, khong chi toi FILE: tu trong goi phai rut
    # duoc khoi bang tra ma ban vong lap goi ten.
    # KHONG boc trong `if law.is_file()`: nhanh tu-gac khong co duong do rieng,
    # file bien mat thi phep do im lang. Cung lop vua go khoi P96 (S4-r2).
    law = pkg_ag / REF
    if not law.is_file():
        errs.append("ban luat vang trong goi acceptance-gate — khong co gi de rut bang tra")
    elif not re.search(r"<!-- <<<DECISION-DIAGRAM-SURFACES -->\n[\s\S]*?<!-- DECISION-DIAGRAM-SURFACES>>> -->",
                       law.read_text(encoding="utf-8")):
        errs.append("con tro giai duoc file nhung khong co bang tra trong goi")
    return errs

# Hai goi Claude: acceptance-gate = goc repo (marketplace tro thang ./),
# feature-loop = thu muc feature-loop/. Bat bien khong doi: goi nay khong duoc
# ghep thang goc goi kia, phai di qua bo giai.
AG, FL = root, root / "feature-loop"
assert check(AG, FL) == [], check(AG, FL)                        # doi chung DUONG (goi that)
tmp = Path(tempfile.mkdtemp())
try:
    a2, f2 = tmp / "ag", tmp / "fl"
    # Ban sao do CODE sinh va CHI mang phan check() cham toi: AG nay la goc repo,
    # copytree ca goc se cuon theo .git va toan bo kho.
    for rel in IN_PKG + [REF]:
        (a2 / rel).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(AG / rel, a2 / rel)
    for rel in ("skills/feature-loop/SKILL.md", "scripts/resolve-plugin.mjs"):
        (f2 / rel).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(FL / rel, f2 / rel)
    assert check(a2, f2) == [], f"ban sao goi NGUYEN VEN phai XANH truoc: {check(a2, f2)}"
    (a2 / REF).rename((a2 / REF).with_name("doi-cho.md"))
    e1 = check(a2, f2)
    assert any("tro file khong ton tai" in x for x in e1), \
        f"dot bien di chuyen ban luat trong goi khong do dung thong diep: {e1}"
    (a2 / REF).with_name("doi-cho.md").rename(a2 / REF)
    fl2 = f2 / "skills/feature-loop/SKILL.md"
    orig = fl2.read_text(encoding="utf-8")
    fl2.write_text(orig.replace(
        f"--plugin acceptance-gate --require {REF}", "${CLAUDE_PLUGIN_ROOT}/" + REF),
        encoding="utf-8")
    lawp = a2 / REF
    lawt = lawp.read_text(encoding="utf-8")
    lawp.write_text(lawt.replace("<!-- <<<DECISION-DIAGRAM-SURFACES -->", "", 1), encoding="utf-8")
    e_sf = check(a2, f2)
    assert any("khong co bang tra trong goi" in x for x in e_sf), \
        f"go bang tra khoi ban luat trong goi ma khong bi bat: {e_sf}"
    lawp.write_text(lawt, encoding="utf-8")

    e2 = check(a2, f2)
    assert any("thieu loi goi bo giai plugin" in x for x in e2), \
        f"dot bien go loi goi bo giai khong do dung thong diep: {e2}"
    assert any("ghep thang goc goi" in x for x in e2), \
        f"dot bien ghep thang goc goi khong do dung thong diep: {e2}"
    # Nhanh THU HAI mot minh: GIU nguyen loi goi bo giai, chi THEM dang ghep
    # thang goc goi. Hai dieu kien dung chung thong diep thi case nay im lang.
    fl2.write_text(orig + "\n${CLAUDE_PLUGIN_ROOT}/" + REF + "\n", encoding="utf-8")
    e3 = check(a2, f2)
    assert any("ghep thang goc goi" in x for x in e3), \
        f"nhanh ghep-thang-goc-goi mot minh khong bi bat: {e3}"
    assert not any("thieu loi goi bo giai" in x for x in e3), \
        f"nhanh thu nhat bao oan khi loi goi bo giai VAN CON: {e3}"
finally:
    shutil.rmtree(tmp)
PY

run "P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8")

def block(text, name):
    m = re.search(rf"<!-- <<<{name} -->\n([\s\S]*?)<!-- {name}>>> -->", text)
    return m.group(1) if m else None

def rows(md):
    out = []
    for l in md.splitlines():
        if not l.strip().startswith("|"):
            continue
        cells = [c.strip() for c in l.split("|")[1:-1]]
        if not cells or all(re.fullmatch(r":?-+:?", c) for c in cells):
            continue
        out.append(cells)
    return out

# Danh sach DONG cac co che ve — rut tu chinh ban luat, khong viet tay o ben doc.
def mechanisms(text):
    # NEO VAO MARKER. Ban truoc quet toan file bang regex tham: moi doan van xuoi
    # phia sau danh sach bi nuot vao, nen mot dong ghi chu CO nhay nguoc — ke ca
    # cau giai thich "dung viet nhu vay" — bien dung cum bi cam thanh co che hop
    # le. Da tai hien duoc truoc khi sua (finding S4-r1).
    b = block(text, "DECISION-DRAW-MECHANISMS")
    if b is None:
        return None
    return [" ".join(x.split()) for x in re.findall(r"`([^`]+)`", b)]

def check(text):
    errs = []
    tb = block(text, "DECISION-DIAGRAM-SURFACES")
    pt = block(text, "DECISION-PICTURE-TEST")
    mech = mechanisms(text)
    if tb is None:
        return ["khong rut duoc bang tra mat phang"]
    if mech is None or len(mech) < 3:
        errs.append("khong rut duoc danh sach dong cac co che ve")
        mech = mech or []
    r = rows(tb)
    body = r[1:] if r else []
    if len(body) < 3:
        errs.append(f"bang tra duoi ba mat phang (co {len(body)})")
    for row in body:
        if len(row) != 3:
            errs.append(f"hang bang tra khong du 3 o: {row}")
            continue
        if mech and " ".join(row[1].split()) not in mech:
            errs.append(f"cach-ve khong neu co che trong danh sach dong: {row[1]}")
    ok_rows = [x for x in body if len(x) == 3]
    # RANG BUOC QUAN HE, khong phai tu vung. Ban truoc chi hoi "o nay co nam
    # trong danh sach dong khong" — nen gop MOI mat phang ve CUNG mot co che van
    # XANH, tuc bang tra co the bao ve mermaid vao terminal thuan, dung ca truot
    # ma phep thu nhin-thay-hinh goi ten. Da tai hien (S4-r5).
    mechs = [" ".join(x[1].split()) for x in ok_rows]
    if len(set(mechs)) != len(mechs):
        dup = sorted({m for m in mechs if mechs.count(m) > 1})
        errs.append(f"hai mat phang tro cung mot co che ve: {dup}")
    defaults = [x for x in ok_rows if "mặc định" in x[2]]
    if len(defaults) != 1:
        errs.append(f"phai co DUNG MOT hang mac dinh, dang co {len(defaults)}")
    hoi_thoai = [x for x in ok_rows if "hội thoại" in x[0]]
    if not hoi_thoai:
        errs.append("thieu mat phang khung hoi thoai")
    elif not any("mặc định" in x[2] for x in hoi_thoai):
        errs.append("khong hang nao la mac dinh")
    if pt is None:
        errs.append("khong rut duoc phep thu nhin-thay-hinh")
    else:
        if "nhìn-thấy-hình" not in pt:
            errs.append("thieu ten phep thu nhin-thay-hinh")
        if "thiếu bộ vẽ" not in pt:
            errs.append("thieu ca truot cua phep thu nhin-thay-hinh")
    return errs

assert check(t) == [], check(t)                                  # doi chung DUONG

def has(errs, frag):
    return any(frag in e for e in errs)

# Bang co 4 hang: xoa MOT hang van con 3, chua vuot nguong. Dot bien phai that
# su di qua nguong moi chung minh duoc phep do song.
m1 = re.sub(r"^\| Terminal thuần \|.*$", "", t, count=1, flags=re.M)
m1 = re.sub(r"^\| Tài liệu trong kho \|.*$", "", m1, count=1, flags=re.M)
assert has(check(m1), "duoi ba mat phang"), \
    "dot bien xoa hai hang mat phang khong do dung thong diep"
m1b = re.sub(r"^\| Terminal thuần \|.*$", "", t, count=1, flags=re.M)
assert check(m1b) == [], \
    "xoa MOT hang (con du 3) ma van DO — nguong ba mat phang bi do sai"

m2 = t.replace("| Khung hội thoại | hình vẽ nội tuyến của phiên | ✔ mặc định |",
               "| Khung hội thoại | vẽ hình phù hợp với khung hội thoại | ✔ mặc định |", 1)
assert has(check(m2), "khong neu co che trong danh sach dong"), \
    "dot bien thay co che bang cum chung chung khong do dung thong diep (rang P0 gap-probe)"

GEN = "vẽ hình phù hợp với khung hội thoại"
m2b = t.replace("<!-- DECISION-DRAW-MECHANISMS>>> -->",
                "<!-- DECISION-DRAW-MECHANISMS>>> -->\n\nGhi chú: `" + GEN + "` la mo ta muc dich, dung viet nhu vay.\n", 1)
m2b = m2b.replace("| Khung hội thoại | hình vẽ nội tuyến của phiên | ✔ mặc định |",
                  "| Khung hội thoại | " + GEN + " | ✔ mặc định |", 1)
assert has(check(m2b), "khong neu co che trong danh sach dong"), \
    "ghi chu CO nhay nguoc NGOAI marker van noi duoc danh sach dong — phep rut chua neo vao marker"

m2c = t.replace("| Terminal thuần | hình bằng ký tự trong khối mã |",
                "| Terminal thuần | khối mermaid |", 1)
assert has(check(m2c), "cung mot co che ve"), \
    "gop hai mat phang ve cung mot co che ma khong bi bat — phep do chi kiem tu vung"

m2d = t.replace("| khi cần soi lâu, cần cuộn |", "| ✔ mặc định |", 1)
assert has(check(m2d), "DUNG MOT hang mac dinh"), \
    "hai hang cung mang dau mac dinh ma khong bi bat"

m3 = re.sub(r"^\| Khung hội thoại \|.*$", "", t, count=1, flags=re.M)
assert has(check(m3), "thieu mat phang khung hoi thoai"), \
    "dot bien xoa hang hoi thoai khong do dung thong diep"

m4 = t.replace("| ✔ mặc định |", "| dùng khi tiện |", 1)
assert has(check(m4), "khong hang nao la mac dinh"), \
    "dot bien go dau mac dinh khong do dung thong diep"

# Dot bien theo DUNG kich ban gap-probe: chen mot ban sao cau phep thu NGOAI
# marker roi pha ban TRONG marker. Tim-chuoi-toan-file se XANH oan; neo vao
# marker thi phai DO.
pt_body = block(t, "DECISION-PICTURE-TEST")
m5 = t.replace(pt_body, pt_body.replace("thiếu bộ vẽ", "chua san sang"), 1)
m5 = m5 + "\n\nGhi chu: dan mot khoi ma vao mat phang thiếu bộ vẽ la ca truot.\n"
assert has(check(m5), "thieu ca truot cua phep thu"), \
    "pha ban TRONG marker ma ban sao NGOAI marker van giu xanh — phep do chua neo vao vat"
PY

# ── P98: start-scan.mjs — phan o tren fixture CODE-SINH (E1-E6, E9) ─────────
# Fixture sinh trong chinh lan chay; doi chung duong (ban nguyen ven XANH)
# truoc ban tiem hong (ghim dung thong diep). Bang phan o = spec start-command
# (docs/specs/2026-08-03-start-command-design.md).
run "P98 start-scan phan o du moi hang bang + broken/skipped/readonly/gate-order (E1-E6,E9)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const root = process.argv[2];
const SCAN = path.join(root, 'scripts/start-scan.mjs');
const die = m => { console.error(m); process.exit(1); };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p98-'));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = (slug, status, extra = '') =>
  `---\nschema_version: 1\nfeature: f-${slug}\nslug: ${slug}\nowner: t@t\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\n${extra}---\n# C\n`;
const opp = (slug, stage, decision) =>
  `---\nschema_version: 1\nslug: ${slug}\nfeature: f\nowner: t@t\nstage: ${stage}\ndecision: ${decision}\n---\n# O\n`;
const evidence = (verdict) =>
  `---\nschema_version: 2\nslug: x\nverdict: ${verdict}\nhuman_signoff:\n---\n# E\n`;

// ---- 1. Fixture NGUYEN VEN: du MOI HANG bang phan o cua spec ----
W('_acceptance/config.yaml', 'schema_version: 1\n');
W('_acceptance/a-opp-moi/opportunity.md', opp('a-opp-moi', 'discovery', ''));
W('_acceptance/b-opp-thieu-decision/opportunity.md', opp('b-opp-thieu-decision', 'decided', ''));
W('_acceptance/c-opp-build/opportunity.md', opp('c-opp-build', 'decided', 'build'));
W('_acceptance/d-opp-iterate/opportunity.md', opp('d-opp-iterate', 'decided', 'iterate'));
W('_acceptance/e-opp-park/opportunity.md', opp('e-opp-park', 'decided', 'park'));
W('_acceptance/f-draft/contract.md', contract('f-draft', 'draft'));
W('_acceptance/g-approved/contract.md', contract('g-approved', 'approved'));
W('_acceptance/h-approved-plan/contract.md', contract('h-approved-plan', 'approved'));
W('docs/superpowers/plans/2026-01-01-h-approved-plan.md', '# plan\n');
W('_acceptance/i-implemented/contract.md', contract('i-implemented', 'implemented'));
W('_acceptance/j-reject/contract.md', contract('j-reject', 'implemented'));
W('_acceptance/j-reject/evidence-report.md', evidence('REJECT'));
W('_acceptance/k-pass/contract.md', contract('k-pass', 'verified', 'approved_at: 2026-01-02T00:00:00Z\n'));
W('_acceptance/k-pass/evidence-report.md', evidence('PASS'));
W('_acceptance/l-pending/contract.md', contract('l-pending', 'verified', 'approved_at: 2026-01-01T00:00:00Z\n'));
W('_acceptance/l-pending/evidence-report.md', evidence('PENDING-JUDGMENT'));
W('_acceptance/m-signed/contract.md', contract('m-signed', 'signed-off'));
// cac nhanh verified co dieu kien (S4-r1) + CRLF + slug-tien-to
W('_acceptance/n-verified-reject/contract.md', contract('n-verified-reject', 'verified'));
W('_acceptance/n-verified-reject/evidence-report.md', evidence('REJECT'));
W('_acceptance/o-verified-signed/contract.md', contract('o-verified-signed', 'verified'));
W('_acceptance/o-verified-signed/evidence-report.md',
  '---\nschema_version: 2\nslug: o\nverdict: PASS\nhuman_signoff: "Manh Phan 2026-08-03"\n---\n# E\n');
W('_acceptance/p-crlf/contract.md',
  '---\r\nschema_version: 1\r\nslug: p-crlf\r\nrisk_tier: T2\r\nstatus: draft\r\n---\r\n# C\r\n');
W('_acceptance/h-approved/contract.md', contract('h-approved', 'approved')); // tien to cua h-approved-plan

const scan = dir => JSON.parse(execFileSync('node', [SCAN, '--root', dir], { encoding: 'utf8' }));
// hash toan bo cay file (portable, khong dung md5 cua he dieu hanh)
const treeHash = d => {
  const h = crypto.createHash('sha256');
  const walk = p => {
    for (const e of fs.readdirSync(p, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const fp = path.join(p, e.name);
      if (e.isDirectory()) walk(fp);
      else { h.update(fp.slice(d.length)); h.update(fs.readFileSync(fp)); }
    }
  };
  walk(d); return h.digest('hex');
};
const before = treeHash(tmp);

const r = scan(tmp);
if (r.config !== true) die('doi chung duong: config:true phai co');

const want = {
  gates: { 'a-opp-moi': 'dang', 'b-opp-thieu-decision': 'dang', 'f-draft': 'pham-vi', 'k-pass': 'bang-chung', 'l-pending': 'bang-chung',
           'p-crlf': 'pham-vi' },                                  // CRLF doc bang reader chuan, KHONG broken
  inProgress: { 'c-opp-build': 'S1', 'd-opp-iterate': 'S1', 'g-approved': 'S2', 'h-approved-plan': 'S3', 'i-implemented': 'S4', 'j-reject': 'S3-fix',
                'n-verified-reject': 'S3-fix',                     // verified + REJECT khong phai "cho ky"
                'h-approved': 'S2' },                              // tien to: KHONG duoc dinh plan cua h-approved-plan
  done: { 'e-opp-park': 'park', 'm-signed': 'signed-off',
          'o-verified-signed': 'signed-off' },                     // da ky (status chua flip) khong hien "cho ky"
};
for (const [slug, gate] of Object.entries(want.gates)) {
  const hit = r.groups.gates.find(g => g.slug === slug);
  if (!hit || hit.gate !== gate) die(`slug ${slug} phai vao o gate=${gate}, duoc: ${JSON.stringify(hit)}`);
}
for (const [slug, step] of Object.entries(want.inProgress)) {
  const hit = r.groups.inProgress.find(g => g.slug === slug);
  if (!hit || hit.nextStep !== step) die(`slug ${slug} phai nextStep=${step}, duoc: ${JSON.stringify(hit)}`);
}
for (const [slug, state] of Object.entries(want.done)) {
  const hit = r.groups.done.find(g => g.slug === slug);
  if (!hit || hit.state !== state) die(`slug ${slug} phai done state=${state}, duoc: ${JSON.stringify(hit)}`);
}
const total = r.groups.gates.length + r.groups.inProgress.length + r.groups.done.length + r.broken.length;
if (total !== 17) die(`tong slug vao o phai 17 (khong sot khong trung), duoc ${total}`);

// F-B da dung ca hai nguon: khoa skipped[] bi go han (het nguon sinh), va o
// cho-Cong-Gia-tri + ba ket cuc nghiem thu vao bang phan o.
if ('skipped' in r) die('skipped[] van con trong dau ra du khong con nguon sinh nao');
if (typeof r.map !== 'object' || !('present' in r.map) || !('fresh' in r.map))
  die('thieu khoa map.present/map.fresh: ' + JSON.stringify(r.map));

// gate-order (AC-6): frontmatter approved_at THANG mtime — cham mtime l-pending
// cho MOI nhat, thu tu van phai theo approved_at (l-pending cu hon → len dau)
const now = new Date();
fs.utimesSync(path.join(tmp, '_acceptance/l-pending/contract.md'), now, now);
const bc = scan(tmp).groups.gates.filter(g => g.gate === 'bang-chung').map(g => g.slug);
if (bc[0] !== 'l-pending') die(`cong cho lau nhat (approved_at cu nhat) phai len dau: ${bc}`);
// doi chung roi-ve-mtime: xoa approved_at ca hai → mtime quyet dinh
for (const s of ['k-pass', 'l-pending']) W(`_acceptance/${s}/contract.md`, contract(s, 'verified'));
W('_acceptance/k-pass/evidence-report.md', evidence('PASS'));
W('_acceptance/l-pending/evidence-report.md', evidence('PENDING-JUDGMENT'));
const old = new Date(Date.now() - 864e5);
fs.utimesSync(path.join(tmp, '_acceptance/k-pass/contract.md'), old, old);
const bc2 = scan(tmp).groups.gates.filter(g => g.gate === 'bang-chung').map(g => g.slug);
if (bc2[0] !== 'k-pass') die(`thieu frontmatter phai roi ve mtime: ${bc2}`);

// readonly (AC-9): khoi phuc fixture goc roi so hash truoc/sau scan
for (const s of ['k-pass', 'l-pending'])
  W(`_acceptance/${s}/contract.md`, contract(s, 'verified', `approved_at: 2026-01-0${s === 'k-pass' ? 2 : 1}T00:00:00Z\n`));
const snap = treeHash(tmp);
scan(tmp);
if (treeHash(tmp) !== snap) die('scan da cham vao cay file — vi pham chi-doc');

// ---- 2. Tiem hong (AC-4): doi chung duong DA xanh o tren ----
W('_acceptance/f-draft/contract.md', 'status: draft\nkhong co frontmatter fence\n');
const r3 = scan(tmp);
const bad = r3.broken.find(b => b.slug === 'f-draft');
if (!bad) die('slug hong phai vao broken[], khong duoc im lang bo qua');
if (bad.file !== 'contract.md' || !/frontmatter/.test(bad.reason))
  die(`broken phai ghim file+reason frontmatter, duoc: ${JSON.stringify(bad)}`);
if (!r3.groups.inProgress.find(g => g.slug === 'g-approved')) die('slug lanh phai phan o binh thuong khi co slug hong');
if (r3.groups.gates.find(g => g.slug === 'f-draft')) die('slug hong khong duoc dong thoi nam trong gates');

// ---- 3. Config vang (AC-1) ----
const tmp2 = fs.mkdtempSync(path.join(os.tmpdir(), 'p98b-'));
const r4 = scan(tmp2);
if (r4.config !== false) die('repo chua co config.yaml phai tra config:false, exit 0');
console.log('P98 OK');
JS

# ── P99: ROUND-TRIP key JSON — rut tu khoi START-SCAN-KEYS cua HAI than lenh,
# doi chieu voi dau ra start-scan.mjs THAT tren fixture code-sinh (E13).
# Cung ho voi P55: seam viet<->doc phai co phep noi hai dau, khong grep mot phia.
run "P99 round-trip START-SCAN-KEYS <-> start-scan output (2 harness, E13)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const root = process.argv[2];
const die = m => { console.error(m); process.exit(1); };
const SOURCES = ['commands/start.md'];

const extractKeys = txt => {
  const m = txt.match(/<<<START-SCAN-KEYS\n([\s\S]*?)START-SCAN-KEYS>>>/);
  if (!m) return null;
  return m[1].split(/\s+/).filter(Boolean);
};
// fixture toi thieu 1 slug moi nhom de moi key mang co phan tu that ma soi
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p99-'));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
W('_acceptance/config.yaml', 'schema_version: 1\n');
W('_acceptance/w-draft/contract.md', '---\nslug: w-draft\nrisk_tier: T2\nstatus: draft\n---\n');
W('_acceptance/w-go/contract.md', '---\nslug: w-go\nrisk_tier: T2\nstatus: approved\n---\n');
W('_acceptance/w-done/contract.md', '---\nslug: w-done\nrisk_tier: T2\nstatus: signed-off\n---\n');
W('_acceptance/w-bad/contract.md', 'khong fence\n');
const outJson = JSON.parse(execFileSync('node',
  [path.join(root, 'scripts/start-scan.mjs'), '--root', tmp], { encoding: 'utf8' }));

const resolveKey = (obj, dotted) => dotted.split('.').reduce((acc, part) => {
  if (acc === undefined || acc === null) return undefined;
  if (part.endsWith('[]')) {
    const arr = acc[part.slice(0, -2)];
    if (!Array.isArray(arr) || arr.length === 0) return undefined;
    return arr[0];
  }
  return acc[part];
}, obj);

const check = entries => {
  const errs = [];
  for (const [rel, txt] of entries) {
    const keys = extractKeys(txt);
    if (!keys) { errs.push(`${rel}: khong rut duoc khoi START-SCAN-KEYS`); continue; }
    for (const k of keys)
      if (resolveKey(outJson, k) === undefined)
        errs.push(`${rel}: key ${k} khong co trong dau ra start-scan that`);
  }
  return errs;
};
const load = rel => [rel, fs.readFileSync(path.join(root, rel), 'utf8')];
const e0 = check(SOURCES.map(load));
if (e0.length) die('doi chung duong FAIL: ' + JSON.stringify(e0));   // ban that XANH
// dot bien: doi ten mot key phia LENH → phai DO dung thong diep
const mut = fs.readFileSync(path.join(root, SOURCES[0]), 'utf8')
  .replace('map.present', 'map_present_doi_ten');
const e1 = check([['(ban-doi-key)', mut]]);
if (!e1.some(x => /key map_present_doi_ten khong co/.test(x)))
  die('dot bien doi ten key khong bi bat dung thong diep: ' + JSON.stringify(e1));
// dot bien: xoa ca khoi marker → phai DO "khong rut duoc"
const e2 = check([['(ban-xoa-marker)', mut.replace(/<!-- <<<START-SCAN-KEYS[\s\S]*?START-SCAN-KEYS>>> -->/, '')]]);
if (!e2.some(x => /khong rut duoc khoi START-SCAN-KEYS/.test(x)))
  die('dot bien xoa marker khong bi bat: ' + JSON.stringify(e2));

// ── CHIEU NGUOC (S4-r1 discovery-brainstorm-socket, hinh dang 3): tren day chi
// do marker ⊆ dau ra. Xoa mot dong KHOI marker chi lam mang `keys` ngan di nen
// khong the sinh loi — tuc "key nam trong marker CA HAI than" khong co thuoc
// nao do. Chieu nay ghim: moi key LA GOC (khong phai key sinh ra tu mang) cua
// dau ra THAT phai duoc KHAI trong marker cua MOI than.
const leafKeys = (obj, prefix) => {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? prefix + '.' + k : k;
    if (Array.isArray(v)) out.push(...(v.length ? leafKeys(v[0], p + '[]') : [p + '[]']));
    else if (v && typeof v === 'object') out.push(...leafKeys(v, p));
    else out.push(p);
  }
  return out;
};
const IGNORE = new Set(['schema_version', 'config']);   // hai khoa dieu khien, than lenh doc bang van
const produced = leafKeys(outJson, '').filter(k => !IGNORE.has(k));
const missingSide = entries => {
  const errs = [];
  for (const [rel, txt] of entries) {
    const declared = new Set(extractKeys(txt) || []);
    for (const k of produced)
      if (!declared.has(k)) errs.push(`${rel}: dau ra co key ${k} ma marker KHONG khai`);
  }
  return errs;
};
const e3 = missingSide(SOURCES.map(load));
if (e3.length) die('chieu nguoc FAIL (ban that phai xanh): ' + JSON.stringify(e3));
// dot bien: xoa mot dong khoi marker phia LENH → phai DO dung thong diep
const cut = fs.readFileSync(path.join(root, SOURCES[0]), 'utf8')
  .replace(/\n\s*discovery\.brainstormSkill/, '');
if (cut === fs.readFileSync(path.join(root, SOURCES[0]), 'utf8'))
  die('tiem mutant that bai: khong xoa duoc dong discovery.brainstormSkill khoi marker');
const e4 = missingSide([['(ban-xoa-1-dong-marker)', cut]]);
if (!e4.some(x => /key discovery\.brainstormSkill ma marker KHONG khai/.test(x)))
  die('dot bien xoa 1 dong marker khong bi bat dung thong diep: ' + JSON.stringify(e4));
console.log(`P99 OK (2 chieu: marker ⊆ dau ra + dau ra ⊆ marker, ${produced.length} key la)`);
JS

# ── P100: con tro cua /start giai duoc TRONG GOI moi harness (E14, ho P95) ──
run "P100 con tro /start giai duoc trong goi Claude (repo root) (E14)" \
  python3 - "$ROOT" <<'PY'
import re, shutil, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
SCAN = "scripts/start-scan.mjs"
LAW = "skills/acceptance/references/human-facing-language.md"
# Con tro thu ba (F-K, them o S4-r2): nhanh fallback cua loi (a) tro khuon
# grill kit-own. Danh sach nay TUNG la hardcode 2 muc va con tro moi khong
# duoc them vao — goi ship con tro chet ma suite van xanh, dung lop loi ma
# chinh feature nay sinh ra de chan.
OPP = "skills/acceptance/references/opportunity-template.md"

def check_claude(pkg):
    # Goi Claude = repo root (marketplace tro thang repo): con tro trong
    # commands/start.md ghep goc goi phai ra vat that.
    errs = []
    t = (pkg / "commands/start.md").read_text(encoding="utf-8")
    for ref in [SCAN, LAW, OPP]:
        if ref not in t:
            errs.append(f"commands/start.md: khong rut duoc con tro {ref}")
        elif not (pkg / ref).is_file():
            errs.append(f"con tro {ref} tro file khong ton tai trong goi Claude")
    return errs

PKG_FILES = ["commands/start.md", SCAN, LAW, OPP]
assert check_claude(root) == [], check_claude(root)      # doi chung DUONG goi Claude
tmp = Path(tempfile.mkdtemp())
try:
    c2 = tmp / "ag"
    for rel in PKG_FILES:            # ban sao do CODE sinh trong chinh lan chay
        (c2 / rel).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(root / rel, c2 / rel)
    assert check_claude(c2) == [], f"ban sao goi NGUYEN VEN phai XANH truoc: {check_claude(c2)}"
    (c2 / SCAN).rename(c2 / "scripts/doi-cho.mjs")       # dot bien 1: bo quet bien mat
    e1 = check_claude(c2)
    assert any(SCAN in x and "tro file khong ton tai" in x for x in e1), \
        f"dot bien doi cho bo quet khong do dung thong diep: {e1}"
    (c2 / "scripts/doi-cho.mjs").rename(c2 / SCAN)
    sk = c2 / "commands/start.md"
    sk.write_text(sk.read_text(encoding="utf-8").replace(LAW, "(da xoa)"),
                  encoding="utf-8")                       # dot bien 2: mat con tro ban luat
    e2 = check_claude(c2)
    assert any("khong rut duoc con tro " + LAW in x for x in e2), \
        f"dot bien xoa con tro ban luat khong do dung thong diep: {e2}"
    sk.write_text(sk.read_text(encoding="utf-8").replace("(da xoa)", LAW), encoding="utf-8")
    (c2 / OPP).rename(c2 / "skills/acceptance/references/doi-cho.md")  # dot bien 3: khuon grill bien mat
    e3 = check_claude(c2)
    assert any(OPP in x and "tro file khong ton tai" in x for x in e3), \
        f"dot bien doi cho khuon grill khong do dung thong diep: {e3}"
    (c2 / "skills/acceptance/references/doi-cho.md").rename(c2 / OPP)
finally:
    shutil.rmtree(tmp)
PY

# ── P101: nap luat ngon ngu TRUOC render (E15) + muc /start trong docs (E11) ─
run "P101 nap human-facing-language truoc render (2 harness) + GUIDE/README/QUICKSTART co muc /start (E11,E15)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
LAW = "human-facing-language.md"
# (file, anchor cua khoi render) — buoc nap phai dung TRUOC anchor.
RENDER = {"commands/start.md": "Trình MỘT thẻ"}

def check_load(files):
    errs = []
    for rel, anchor in files.items():
        t = (root / rel).read_text(encoding="utf-8") if isinstance(rel, str) else rel
        i_law, i_render = t.find(LAW), t.find(anchor)
        if i_law < 0:
            errs.append(f"{rel}: thieu buoc nap luat ngon ngu mat nguoi")
        elif i_render < 0:
            errs.append(f"{rel}: khong tim thay khoi render (anchor {anchor})")
        elif i_law > i_render:
            errs.append(f"{rel}: buoc nap luat nam SAU khoi render")
    return errs

def check_text(pairs):
    errs = []
    for name, (t, anchor) in pairs.items():
        i_law, i_render = t.find(LAW), t.find(anchor)
        if i_law < 0: errs.append(f"{name}: thieu buoc nap luat ngon ngu mat nguoi")
        elif i_law > i_render: errs.append(f"{name}: buoc nap luat nam SAU khoi render")
    return errs

assert check_load(RENDER) == [], check_load(RENDER)      # doi chung DUONG
# dot bien: xoa dong nap → DO dung thong diep
t = (root / "commands/start.md").read_text(encoding="utf-8")
mut = t.replace(LAW, "khong-nap-gi.md")
e1 = check_text({"(ban-xoa-nap)": (mut, RENDER["commands/start.md"])})
assert any("thieu buoc nap luat" in x for x in e1), f"dot bien xoa buoc nap khong bi bat: {e1}"

# (E11) GUIDE + README co muc /start. Chan AM phai chay CHINH phep do tren ban
# mutant — ban cu dung `not (A and B)` tren chuoi vua bi xoa A, dung mot cach
# giai tich nen khong bao gio do duoc (Cong 2 start-command, known-limit 2).
DOCS = ["GUIDE.md", "README.md", "QUICKSTART.md"]

def check_docs(docs):                      # {ten: noi dung} -> list loi
    errs = []
    for name, text in docs.items():
        if "/start" not in text or "vào phiên" not in text:
            errs.append(f"{name}: thieu muc vao phien bang /start")
    return errs

live = {d: (root / d).read_text(encoding="utf-8") for d in DOCS}
assert check_docs(live) == [], check_docs(live)          # doi chung DUONG

# Chan AM RIENG cho TUNG file: mot ham quen mot nhanh thi chan con lai van do
# dung, che mat lo (bai hoc [findings-section-boundary#F2]).
strip = lambda t: "\n".join(l for l in t.splitlines()
                            if "/start" not in l and "vào phiên" not in l)
for gone in DOCS:
    mut = dict(live); mut[gone] = strip(live[gone])
    errs = check_docs(mut)
    assert any(x.startswith(f"{gone}: thieu muc vao phien") for x in errs), \
        f"dot bien xoa muc /start khoi {gone} khong bi bat dung thong diep: {errs}"
    assert all(not x.startswith(f"{o}:") for x in errs for o in DOCS if o != gone), \
        f"dot bien tren {gone} lam bao oan file khac: {errs}"
PY

# ── P102: loi I/O co TEN, verdict ngoai tu vung bi goi ten (AC-1, AC-2) ─────
# Doi chung DUONG (fixture nguyen ven XANH) truoc moi buoc tiem; moi buoc tiem
# ghim DUNG thong diep. Fixture do CODE sinh trong chinh lan chay.
run "P102 start-scan: loi I/O neu ten file+ma loi; verdict la/vang bi goi ten (E1,E2)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const root = process.argv[2];
const SCAN = path.join(root, 'scripts/start-scan.mjs');
const die = m => { console.error(m); process.exit(1); };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p102-'));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = (slug, status) =>
  `---\nschema_version: 1\nslug: ${slug}\nrisk_tier: T2\nstatus: ${status}\n---\n# C\n`;
const opp = (slug, decision) =>
  `---\nschema_version: 1\nslug: ${slug}\nstage: decided\ndecision: ${decision}\n---\n# O\n`;

W('_acceptance/config.yaml', 'schema_version: 1\n');
// a: contract mat quyen doc, CO opportunity park nam canh -> khong duoc roi sang park
W('_acceptance/a-eacces/contract.md', contract('a-eacces', 'verified'));
W('_acceptance/a-eacces/opportunity.md', opp('a-eacces', 'park'));
W('_acceptance/a-eacces/evidence-report.md', '---\nschema_version: 2\nverdict: PASS\nhuman_signoff:\n---\n# E\n');
// b: contract la THU MUC
W('_acceptance/b-eisdir/x', 'noise\n');
// c: evidence-report mat quyen doc tren slug implemented
W('_acceptance/c-ev-eacces/contract.md', contract('c-ev-eacces', 'implemented'));
W('_acceptance/c-ev-eacces/evidence-report.md', '---\nschema_version: 2\nverdict: PASS\n---\n# E\n');
// d/e: nhanh verdict; f/g: doi chung duong
W('_acceptance/d-offvocab/contract.md', contract('d-offvocab', 'implemented'));
W('_acceptance/d-offvocab/evidence-report.md', '---\nschema_version: 2\nverdict: FAIL\n---\n# E\n');
W('_acceptance/e-noverdict/contract.md', contract('e-noverdict', 'implemented'));
W('_acceptance/e-noverdict/evidence-report.md', '---\nschema_version: 2\nslug: e\n---\n# E\n');
// e2: key verdict CO MAT nhung gia tri RONG — frontmatterField tra '' chu khong
// phai null, nen guard `== null` de lot va bao "khong nhan dien duoc: " (S4-r1)
W('_acceptance/e2-verdict-rong/contract.md', contract('e2-verdict-rong', 'implemented'));
W('_acceptance/e2-verdict-rong/evidence-report.md', '---\nschema_version: 2\nslug: e2\nverdict:\n---\n# E\n');
// e3: cung hinh dang o nhanh VERIFIED — rong phai ket luan o guard dung chung
W('_acceptance/e3-verified-rong/contract.md', contract('e3-verified-rong', 'verified'));
W('_acceptance/e3-verified-rong/evidence-report.md', '---\nschema_version: 2\nslug: e3\nverdict:\n---\n# E\n');
W('_acceptance/f-ok/contract.md', contract('f-ok', 'approved'));
W('_acceptance/g-reject/contract.md', contract('g-reject', 'implemented'));
W('_acceptance/g-reject/evidence-report.md', '---\nschema_version: 2\nverdict: REJECT\n---\n# E\n');

const scan = () => JSON.parse(execFileSync('node', [SCAN, '--root', tmp], { encoding: 'utf8' }));
const brokenOf = (r, slug) => r.broken.find(b => b.slug === slug);

// ---- DOI CHUNG DUONG: chua tiem gi, moi slug phan o binh thuong ----
const r0 = scan();
if (brokenOf(r0, 'a-eacces')) die('doi chung duong: a-eacces chua tiem ma da broken');
if (!r0.groups.gates.find(g => g.slug === 'a-eacces')) die('doi chung duong: a-eacces phai o gates');
if (!r0.groups.inProgress.find(g => g.slug === 'f-ok')) die('doi chung duong: f-ok phai o inProgress');

// Do nang luc chan quyen doc MOT lan. Duoi root/chmod-vo-hieu: bo qua RIENG
// hai chan (a)(c) can EACCES, IN CANH BAO — moi chan khac VAN chay. Ban cu
// `process.exit(0)` ngay sau (a) nuot luon 6 chan sau ma suite bao PASS —
// dung lop "assertion khong song" (S4-r4).
const permProbe = path.join(tmp, 'perm-probe');
fs.writeFileSync(permProbe, 'x'); fs.chmodSync(permProbe, 0o000);
let canBlockRead = false;
try { fs.readFileSync(permProbe) } catch { canBlockRead = true }
fs.chmodSync(permProbe, 0o644);

if (canBlockRead) {
  // ---- (a) EACCES tren contract.md ----
  const aPath = path.join(tmp, '_acceptance/a-eacces/contract.md');
  fs.chmodSync(aPath, 0o000);
  const r1 = scan();
  const a = brokenOf(r1, 'a-eacces');
  if (!a) die('EACCES contract phai vao broken[], khong duoc im lang');
  if (a.file !== 'contract.md') die(`broken phai ghim dung ten file, duoc: ${JSON.stringify(a)}`);
  if (!/EACCES/.test(a.reason)) die(`reason phai neu ma loi he thong, duoc: ${a.reason}`);
  if (/không có|khong co/.test(a.reason)) die(`reason noi doi "khong co file" trong khi file con do: ${a.reason}`);
  if (r1.groups.done.find(g => g.slug === 'a-eacces')) die('slug loi I/O bi roi sang o park cua opportunity ben canh');
  fs.chmodSync(aPath, 0o644);

  // ---- (c) EACCES tren evidence-report.md (slug implemented) ----
  const cPath = path.join(tmp, '_acceptance/c-ev-eacces/evidence-report.md');
  fs.chmodSync(cPath, 0o000);
  const r3 = scan();
  const c = brokenOf(r3, 'c-ev-eacces');
  if (!c) die('EACCES evidence-report phai vao broken[]');
  if (c.file !== 'evidence-report.md') die(`phai ghim ten evidence-report.md, duoc: ${JSON.stringify(c)}`);
  if (!/EACCES/.test(c.reason)) die(`reason phai neu ma loi, duoc: ${c.reason}`);
  if (r3.groups.inProgress.find(g => g.slug === 'c-ev-eacces'))
    die('slug co evidence loi I/O van bi day sang nextStep — khong duoc doan buoc ke');
  fs.chmodSync(cPath, 0o644);
} else {
  console.log('P102 CANH BAO: khong chan duoc quyen doc (root?) — bo qua RIENG chan (a)(c) EACCES; moi chan khac van chay');
}

// ---- (b) contract.md la THU MUC (khong can quyen — LUON chay) ----
fs.mkdirSync(path.join(tmp, '_acceptance/b-eisdir/contract.md'));
const b = brokenOf(scan(), 'b-eisdir');
if (!b || b.file !== 'contract.md' || !/EISDIR/.test(b.reason))
  die(`contract la thu muc phai vao broken kem EISDIR, duoc: ${JSON.stringify(b)}`);

// ---- (d) verdict NGOAI tu vung tren implemented ----
const d = brokenOf(scan(), 'd-offvocab');
if (!d || !/verdict không nhận diện được: FAIL/.test(d.reason))
  die(`verdict la phai bi goi ten cung khuon nhanh verified, duoc: ${JSON.stringify(d)}`);

// ---- (e) evidence CO frontmatter nhung VANG dong verdict ----
const e = brokenOf(scan(), 'e-noverdict');
if (!e || !/thiếu verdict/.test(e.reason))
  die(`verdict vang phai bi goi ten, duoc: ${JSON.stringify(e)}`);

// ---- (e2)(e3) key verdict CO MAT nhung RONG: hong o CA HAI nhanh ----
// Tu 1.38.0 verdict di qua luat chung (fieldProblem): rong khong allowEmpty
// → "không nhận diện được: (rỗng)" — van neu ten field, chi doi khuon chu
// (workspace-reader-unification AC-1: mot bang luat, mot khuon thong diep).
for (const slug of ['e2-verdict-rong', 'e3-verified-rong']) {
  const hit = brokenOf(scan(), slug);
  if (!hit) die(`[${slug}] verdict rong phai vao broken[]`);
  if (!/verdict không nhận diện được: \(rỗng\)/.test(hit.reason))
    die(`[${slug}] verdict rong phai bao "khong nhan dien duoc: (rong)", duoc: ${hit.reason}`);
  if (/nhận diện được: *$/.test(hit.reason))
    die(`[${slug}] thong diep khong neu ten gi — dung nhanh offVocab thay vi guard chung: ${hit.reason}`);
}

// ---- doi chung DUONG cuoi: REJECT van ra S3-fix nhu cu ----
const g = scan().groups.inProgress.find(x => x.slug === 'g-reject');
if (!g || g.nextStep !== 'S3-fix') die(`REJECT phai giu nextStep S3-fix, duoc: ${JSON.stringify(g)}`);
console.log('P102 OK');
JS

# ── P103: argv hong CHET TO exit 2, khong doi nghia thanh chan doan repo (AC-3)
# Lop "declared-but-unusable" da chot o pre-merge-check v1.22.1 va
# sync-plugin-packages (mode la khong duoc am tham roi ve ghi de).
run "P103 start-scan argv: 5 loi chet exit 2 ghim thong diep + doi chung duong (E3)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');
const root = process.argv[2];
const SCAN = path.join(root, 'scripts/start-scan.mjs');
const die = m => { console.error(m); process.exit(1); };
const runScan = a => spawnSync('node', [SCAN, ...a], { encoding: 'utf8' });

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p103-'));
fs.mkdirSync(path.join(tmp, 'ok/_acceptance'), { recursive: true });
fs.writeFileSync(path.join(tmp, 'ok/_acceptance/config.yaml'), 'schema_version: 1\n');
const okDir = path.join(tmp, 'ok');
const plainFile = path.join(tmp, 'la-file-thuong.txt');
fs.writeFileSync(plainFile, 'toi khong phai thu muc\n');

// ---- DOI CHUNG DUONG truoc moi loi chet: loi goi DUNG van chay ----
const ok = runScan(['--root', okDir]);
if (ok.status !== 0) die(`doi chung duong that bai: --root hop le phai exit 0, duoc ${ok.status} / ${ok.stderr}`);
let parsed; try { parsed = JSON.parse(ok.stdout) } catch { die('doi chung duong: stdout khong parse duoc JSON') }
if (parsed.config !== true) die('doi chung duong: root hop le co config phai tra config:true');

// ---- 5 loi chet: exit 2, stdout RONG, stderr ghim thong diep RIENG ----
const CASES = [
  { name: '--root thieu gia tri', argv: ['--root'],                needle: /--root/ },
  { name: "--root chuoi rong",    argv: ['--root', ''],            needle: /--root/ },
  { name: 'token la',             argv: ['--foo'],                 needle: /--foo/ },
  { name: 'duong dan ma',         argv: ['--root', path.join(tmp, 'khong-ton-tai')], needle: /khong-ton-tai/ },
  { name: 'duong dan la FILE',    argv: ['--root', plainFile],     needle: /la-file-thuong\.txt/ },
];
const seen = new Set();
for (const c of CASES) {
  const r = runScan(c.argv);
  if (r.status !== 2) die(`[${c.name}] phai exit 2, duoc ${r.status} (stdout=${r.stdout.slice(0,80)})`);
  if (r.stdout.trim() !== '') die(`[${c.name}] KHONG duoc in JSON ra stdout, duoc: ${r.stdout.slice(0,80)}`);
  if (!c.needle.test(r.stderr)) die(`[${c.name}] stderr phai ghim ${c.needle}, duoc: ${r.stderr.slice(0,120)}`);
  seen.add(r.stderr.trim());
}
// Moi loi mot thong diep RIENG: dung chung mot cau thi dot bien chi chung minh
// duoc mot nhanh, cac nhanh con lai khong bao gio bi da RED rieng (bai hoc P95).
if (seen.size < CASES.length)
  die(`5 loi chet chi cho ${seen.size} thong diep khac nhau — nhanh dung chung cau khong do rieng duoc`);

// ---- doi chung DUONG cuoi: root hop le NHUNG chua acceptance-init ----
// Phan biet RANH ROI voi loi go lenh: day moi la "repo chua dung cong".
const bare = fs.mkdtempSync(path.join(os.tmpdir(), 'p103b-'));
const r2 = runScan(['--root', bare]);
if (r2.status !== 0) die(`root that nhung chua init phai exit 0, duoc ${r2.status}`);
if (JSON.parse(r2.stdout).config !== false) die('root that chua init phai tra config:false');
console.log('P103 OK');
JS

# ── P104: ROUND-TRIP tu vung verdict writer <-> reader (AC-2) ──────────────
# S4-r2 bat mot THOAI LUI: VERDICT_OK cua reader hardcode 3 gia tri, bo sot
# BLOCKED — mot vong dang do bi chan moi truong bi goi la "ho so hong" roi bien
# khoi danh sach chon cua /start. Thuoc cu chi hoi "gia tri la co bi goi ten
# khong", KHONG ai ghim TU VUNG AY LAY TU DAU. Case nay rut tu vung tu chinh
# khuon WRITER roi cho READER that doc (mau P55).
run "P104 round-trip tu vung verdict: khuon writer <-> start-scan reader (E10)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const root = process.argv[2];
const SCAN = path.join(root, 'scripts/start-scan.mjs');
const TPL = path.join(root, 'skills/acceptance/references/evidence-report-template.md');
const die = m => { console.error(m); process.exit(1); };

// 1. Rut tu vung tu WRITER (khong hardcode o day)
const tplTxt = fs.readFileSync(TPL, 'utf8');
const m = tplTxt.match(/^verdict:\s*\{\{([A-Z|-]+)\}\}/m);
if (!m) die('KHONG rut duoc tu vung verdict tu khuon evidence-report-template.md');
const VOCAB = m[1].split('|').map(s => s.trim()).filter(Boolean);
if (VOCAB.length < 3) die(`tu vung rut ra qua ngan (${VOCAB.join(',')}) — regex hong`);

// 2. Dung fixture cho TUNG verdict, cho READER that doc
const mkFixture = () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p104-'));
  fs.mkdirSync(path.join(tmp, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(tmp, '_acceptance/config.yaml'), 'schema_version: 1\n');
  // CA HAI nhanh status deu doc verdict — r3 hong dung vi fixture chi co
  // `implemented`, nen nhanh `verified` troi khoi tu vung ma P104 van xanh.
  for (const st of ['implemented', 'verified']) {
    for (const v of VOCAB) {
      const slug = `${st}-${v.toLowerCase()}`;
      const d = path.join(tmp, '_acceptance', slug);
      fs.mkdirSync(d, { recursive: true });
      fs.writeFileSync(path.join(d, 'contract.md'),
        `---\nslug: ${slug}\nrisk_tier: T2\nstatus: ${st}\napproved_at: 2026-01-01T00:00:00Z\n---\n`);
      fs.writeFileSync(path.join(d, 'evidence-report.md'),
        `---\nschema_version: 2\nverdict: ${v}\nhuman_signoff:\n---\n`);
    }
  }
  return tmp;
};
const check = scanPath => {
  const tmp = mkFixture();
  const r = JSON.parse(execFileSync('node', [scanPath, '--root', tmp], { encoding: 'utf8' }));
  const errs = [];
  for (const st of ['implemented', 'verified']) {
    for (const v of VOCAB) {
      const slug = `${st}-${v.toLowerCase()}`;
      const bad = r.broken.find(b => b.slug === slug);
      // Hai duong do hop le: gia tri ngoai enum luat chung ("khong nhan dien
      // duoc") HOAC hop luat chung nhung bang y nghia cua bo quet thieu no
      // ("hai bang lech" — 1.38.0, khi VERDICT_MEANING troi khoi NAV_RULES).
      if (bad && /(không nhận diện được|hai bảng lệch)/.test(bad.reason))
        errs.push(`[${st}] verdict ${v} co trong khuon writer nhung reader goi la khong-nhan-dien-duoc`);
    }
  }
  return errs;
};

const e0 = check(SCAN);
if (e0.length) die('doi chung DUONG that bai: ' + JSON.stringify(e0));   // ban that XANH

// 3. Dot bien: go MOT verdict khoi tu vung cua reader -> phai DO dung thong diep.
// Ban sao can lib/evidence-core.cjs giai duoc, nen dung cay tam co ca hai thu muc.
const mut = fs.mkdtempSync(path.join(os.tmpdir(), 'p104m-'));
fs.mkdirSync(path.join(mut, 'scripts'), { recursive: true });
fs.mkdirSync(path.join(mut, 'lib'), { recursive: true });
fs.copyFileSync(path.join(root, 'lib/evidence-core.cjs'), path.join(mut, 'lib/evidence-core.cjs'));
// start-scan nay dung LUAT CHUNG cho field dieu huong (lib/workspace-record.cjs)
// — ban sao chay thu phai co no, khong thi ket luan "chay duoc/khong" chi noi
// ve viec thieu file chu khong ve hanh vi dang do.
fs.copyFileSync(path.join(root, 'lib/workspace-record.cjs'), path.join(mut, 'lib/workspace-record.cjs'));
const src = fs.readFileSync(SCAN, 'utf8');
const gone = VOCAB[VOCAB.length - 1];                     // go phan tu cuoi khuon writer
const mutSrc = src.replace(new RegExp(`^\\s*'${gone}':.*$`, 'm'), '');
if (mutSrc === src) die(`dot bien khong hieu luc — khong tim thay '${gone}' trong bang tra verdict cua reader`);
const mutPath = path.join(mut, 'scripts/start-scan.mjs');
fs.writeFileSync(mutPath, mutSrc);
const e1 = check(mutPath);
// Phai bat o CA HAI nhanh: mot bang tra dung chung thi go mot dong lam ca hai do.
// Neu chi mot nhanh do => nhanh kia dang giu danh sach song song (lop loi r2/r3).
for (const st of ['implemented', 'verified'])
  if (!e1.some(x => x.includes(`[${st}] verdict ${gone} co trong khuon writer`)))
    die(`dot bien go ${gone} KHONG lam nhanh ${st} do — nhanh nay dang giu tu vung rieng: ${JSON.stringify(e1)}`);
console.log(`P104 OK (tu vung writer: ${VOCAB.join(', ')})`);
JS

# ── P105: MA TRAN phan o toan phan — thuoc dong khong gian thoat (S4-r5) ────
# 4 round truoc deu cung mot hinh dang: chot dat sai cho, va DIEM-case chi ghim
# o bi neu ten nen lo con cho tron. Ma tran ghim TOAN BO to hop
# (trang thai contract × tinh trang evidence) + (khong contract × tinh trang
# opportunity) — chot nao dat sai cho deu lat it nhat mot o da ghim.
run "P105 ma tran phan o: trang-thai × tinh-trang-artifact, ghim toan bo (E1,E2,E10)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const root = process.argv[2];
const SCAN = path.join(root, 'scripts/start-scan.mjs');
const die = m => { console.error(m); process.exit(1); };

// Do nang luc chan quyen doc MOT lan (root/chmod-vo-hieu → bo RIENG cac o
// mat-quyen, in canh bao; moi o khac van ghim — EISDIR song duoi root nen
// lop chot-sai-cho van bi ma tran bat ke ca khi thieu cac o EACCES).
const probeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p105p-'));
const probe = path.join(probeDir, 'probe'); fs.writeFileSync(probe, 'x'); fs.chmodSync(probe, 0o000);
let canBlockRead = false; try { fs.readFileSync(probe) } catch { canBlockRead = true }
fs.chmodSync(probe, 0o644);
if (!canBlockRead) console.log('P105 CANH BAO: khong chan duoc quyen doc — bo rieng cac o mat-quyen, ma tran con lai van ghim du');

const EVC = '---\nschema_version: 1\nrisk_tier: T2\nstatus: %S\napproved_at: 2026-01-01T00:00:00Z\n---\n';
// Tinh trang evidence-report.md → ham dung fixture
const EV_STATES = {
  'vang':        d => {},
  'matquyen':    d => { const p = path.join(d, 'evidence-report.md'); fs.writeFileSync(p, '---\nverdict: PASS\n---\n'); fs.chmodSync(p, 0o000); },
  'lathumuc':    d => fs.mkdirSync(path.join(d, 'evidence-report.md')),
  'thieuverdict':d => fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nschema_version: 2\nslug: x\n---\n'),
  'verdictrong': d => fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nverdict:\n---\n'),
  'verdictrac':  d => fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nverdict: FAIL\n---\n'),
  'pass':        d => fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nverdict: PASS\nhuman_signoff:\n---\n'),
  'pending':     d => fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nverdict: PENDING-JUDGMENT\nhuman_signoff:\n---\n'),
  'reject':      d => fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nverdict: REJECT\nhuman_signoff:\n---\n'),
  'blocked':     d => fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nverdict: BLOCKED\nhuman_signoff:\n---\n'),
};
// O mong doi: "cell:detail" — gates:<gate> | prog:<nextStep> | done:<state> | broken:<regex reason>
const IGNORES_EV = { 'draft': 'gates:pham-vi', 'approved': 'prog:S2', 'signed-off': 'done:signed-off' };
const MATRIX = {};
for (const [st, cell] of Object.entries(IGNORES_EV))
  for (const ev of Object.keys(EV_STATES)) MATRIX[`${st}|${ev}`] = cell;   // evidence KHONG duoc quyet dinh o
Object.assign(MATRIX, {
  'implemented|vang': 'prog:S4',            'verified|vang': 'broken:thiếu evidence-report',
  'implemented|matquyen': 'broken:EACCES',  'verified|matquyen': 'broken:EACCES',
  'implemented|lathumuc': 'broken:EISDIR',  'verified|lathumuc': 'broken:EISDIR',
  'implemented|thieuverdict': 'broken:thiếu verdict', 'verified|thieuverdict': 'broken:thiếu verdict',
  'implemented|verdictrong': 'broken:không nhận diện được', 'verified|verdictrong': 'broken:không nhận diện được',
  'implemented|verdictrac': 'broken:không nhận diện được: FAIL', 'verified|verdictrac': 'broken:không nhận diện được: FAIL',
  'implemented|pass': 'prog:S4',    'verified|pass': 'gates:bang-chung',
  'implemented|pending': 'prog:S4', 'verified|pending': 'gates:bang-chung',
  'implemented|reject': 'prog:S3-fix', 'verified|reject': 'prog:S3-fix',
  'implemented|blocked': 'prog:S4', 'verified|blocked': 'prog:S4',
});
// Nhanh opportunity (khong co contract.md)
const OPP_STATES = {
  'o-matquyen':  d => { const p = path.join(d, 'opportunity.md'); fs.writeFileSync(p, '---\nstage: decided\ndecision: build\n---\n'); fs.chmodSync(p, 0o000); },
  'o-thieustage':d => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nslug: x\n---\n'),
  'o-discovery': d => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: discovery\ndecision:\n---\n'),
  'o-build':     d => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: decided\ndecision: build\n---\n'),
  'o-iterate':   d => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: decided\ndecision: iterate\n---\n'),
  'o-park':      d => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: decided\ndecision: park\n---\n'),
  'o-kill':      d => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: decided\ndecision: kill\n---\n'),
  'o-rac':       d => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: decided\ndecision: maybe\n---\n'),
  'o-trong':     d => {},
};
Object.assign(MATRIX, {
  'noc|o-matquyen': 'broken:EACCES', 'noc|o-thieustage': 'broken:thiếu stage',
  'noc|o-discovery': 'gates:dang',   'noc|o-build': 'prog:S1', 'noc|o-iterate': 'prog:S1',
  'noc|o-park': 'done:park',         'noc|o-kill': 'done:kill',
  'noc|o-rac': 'broken:decision không nhận diện được', 'noc|o-trong': 'broken:không có contract.md lẫn opportunity.md',
});

const build = () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p105-'));
  fs.mkdirSync(path.join(tmp, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(tmp, '_acceptance/config.yaml'), 'schema_version: 1\n');
  for (const key of Object.keys(MATRIX)) {
    const [st, ev] = key.split('|');
    if (!canBlockRead && /matquyen/.test(ev)) continue;
    const slug = key.replace(/[|]/g, '-');
    const d = path.join(tmp, '_acceptance', slug);
    fs.mkdirSync(d, { recursive: true });
    if (st !== 'noc') fs.writeFileSync(path.join(d, 'contract.md'), EVC.replace('%S', st));
    (st === 'noc' ? OPP_STATES[ev] : EV_STATES[ev])(d);
  }
  return tmp;
};
const cellOf = (r, slug) => {
  const g = r.groups.gates.find(x => x.slug === slug);      if (g) return `gates:${g.gate}`;
  const p = r.groups.inProgress.find(x => x.slug === slug); if (p) return `prog:${p.nextStep}`;
  const dn = r.groups.done.find(x => x.slug === slug);      if (dn) return `done:${dn.state}`;
  const b = r.broken.find(x => x.slug === slug);            if (b) return `broken:${b.reason}`;
  return '(mat tich)';
};
const checkMatrix = scanPath => {
  const tmp = build();
  const r = JSON.parse(execFileSync('node', [scanPath, '--root', tmp], { encoding: 'utf8' }));
  const errs = [];
  for (const [key, want] of Object.entries(MATRIX)) {
    const [, ev] = key.split('|');
    if (!canBlockRead && /matquyen/.test(ev)) continue;
    const got = cellOf(r, key.replace(/[|]/g, '-'));
    const [wc, wd] = [want.slice(0, want.indexOf(':')), want.slice(want.indexOf(':') + 1)];
    const [gc, gd] = [got.slice(0, got.indexOf(':') < 0 ? got.length : got.indexOf(':')), got.slice(got.indexOf(':') + 1)];
    const ok = wc === gc && (wc !== 'broken' ? wd === gd : gd.includes(wd));
    if (!ok) errs.push(`o [${key}] mong ${want}, duoc ${got}`);
  }
  return errs;
};

const e0 = checkMatrix(SCAN);
if (e0.length) die(`ma tran ghim ${Object.keys(MATRIX).length} o — ${e0.length} o lech:\n` + e0.join('\n'));

// Pha-thu: mutant keo chot evidence NGUOC LEN truoc cho re trang thai (chinh
// con bug S4-r4) → ma tran phai DO tai cac o draft/approved/signed-off × loi-doc.
const mut = fs.mkdtempSync(path.join(os.tmpdir(), 'p105m-'));
fs.mkdirSync(path.join(mut, 'scripts')); fs.mkdirSync(path.join(mut, 'lib'));
fs.copyFileSync(path.join(root, 'lib/evidence-core.cjs'), path.join(mut, 'lib/evidence-core.cjs'));
// start-scan nay dung LUAT CHUNG cho field dieu huong (lib/workspace-record.cjs)
// — ban sao chay thu phai co no, khong thi ket luan "chay duoc/khong" chi noi
// ve viec thieu file chu khong ve hanh vi dang do.
fs.copyFileSync(path.join(root, 'lib/workspace-record.cjs'), path.join(mut, 'lib/workspace-record.cjs'));
const src = fs.readFileSync(SCAN, 'utf8');
const anchor = "if (status === 'signed-off')";
if (!src.includes(anchor)) die('mutant: khong tim thay anchor cho re trang thai');
const hoist = "{ const __e = read(path.join(dir, 'evidence-report.md')); if (__e.err) { broken.push({ slug, file: 'evidence-report.md', reason: ioReason(__e.err) }); continue; } }\n    ";
fs.writeFileSync(path.join(mut, 'scripts/start-scan.mjs'), src.replace(anchor, hoist + anchor));
const e1 = checkMatrix(path.join(mut, 'scripts/start-scan.mjs'));
if (!e1.some(x => /\[(draft|approved|signed-off)\|(matquyen|lathumuc)\]/.test(x)))
  die('mutant keo chot len truoc cho re ma ma tran van XANH — thuoc chua gan vao vat: ' + JSON.stringify(e1.slice(0,3)));
console.log(`P105 OK — ghim ${Object.keys(MATRIX).length} o${canBlockRead ? '' : ' (tru cac o mat-quyen)'}; mutant chot-sai-cho bi bat`);
JS

# ── P115: khuon canonical -> fixture -> reader chuan (round-trip seam) ──────
# Fixture cua moi case sau nay rut tu marker nay; case nay chung minh khuon
# VIET va khuon MAY DOC con khop. Doi chung duong truoc, roi tiem hong.
run "P115 khuon canonical 3 artifact rut duoc + frontmatterField doc duoc (E1,E8)" \
  node --input-type=module - "$ROOT" <<'P102JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const path = await import("node:path");
const { createRequire } = await import("node:module");
const require = createRequire(import.meta.url);
const { frontmatterField } = require(path.join(root, "lib/evidence-core.cjs"));
const { fileFromTemplate } = await import(path.join(root, "tests/fixtures/from-template.mjs"));
const R = p => path.join(root, "skills/acceptance/references", p);
const die = m => { console.error(m); process.exit(1); };

const cases = [
  ["uat-session-template.md", "UAT-FRONTMATTER-TEMPLATE",
   { slug: "s1", feature: "f", owner: "o", stage: "held", verdict: "release",
     decided_by: "Manh", decided_at: "2026-08-03T00:00:00Z", gateUAT_minutes: "20" },
   { verdict: "release", stage: "held", decided_at: "2026-08-03T00:00:00Z" }],
  ["contract-template.md", "CONTRACT-FRONTMATTER-TEMPLATE",
   { feature: "f", slug: "s2", owner: "o", risk_tier: "T2", surfaces: "cli", status: "draft" },
   { status: "draft", risk_tier: "T2", slug: "s2" }],
  ["opportunity-template.md", "OPP-FRONTMATTER-TEMPLATE",
   { slug: "s3", feature: "f", owner: "o", stage: "decided", decision: "build",
     decided_by: "M", decided_at: "2026-08-03T00:00:00Z", gate0_minutes: "10",
     base_commit: "abc", disposition: "keep" },
   { stage: "decided", decision: "build" }],
];
for (const [file, marker, values, expect] of cases) {
  const txt = fileFromTemplate(R(file), marker, values);
  for (const [k, v] of Object.entries(expect))
    if (frontmatterField(txt, k) !== v)
      die(file + ": reader doc " + k + " = " + JSON.stringify(frontmatterField(txt, k)) + ", mong " + v);
  // doi chung am: marker sai thi helper PHAI nem, khong im lang tra rong
  let threw = false;
  try { fileFromTemplate(R(file), marker + "-KHONG-CO", values); } catch { threw = true; }
  if (!threw) die(file + ": marker sai ma helper van tra ve noi dung");
}
console.log("P115 OK");
P102JS

# ── P116-P118: bo sinh ban do — bucket, bat bien, xac dinh, canh ───────────
# Fixture code-sinh trong chinh lan chay, RUT TU KHUON canonical (P115 canh
# khuon do). Moi case am tinh co doi chung duong truoc va ghim dung thong diep.
run "P116 product-map bucket du moi hang + enum-lac tung field dieu huong (E1)" \
  node --input-type=module - "$ROOT" <<'P103JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { renderProductMap } = await import(path.join(root, "scripts/product-map.mjs"));
const { fileFromTemplate } = await import(path.join(root, "tests/fixtures/from-template.mjs"));
const R = p => path.join(root, "skills/acceptance/references", p);
const die = m => { console.error(m); process.exit(1); };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p103-"));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = (slug, status) => fileFromTemplate(R("contract-template.md"),
  "CONTRACT-FRONTMATTER-TEMPLATE",
  { feature: "viec " + slug, slug, owner: "o@o", risk_tier: "T2", surfaces: "cli", status });
const opp = (slug, stage, decision) => fileFromTemplate(R("opportunity-template.md"),
  "OPP-FRONTMATTER-TEMPLATE",
  { slug, feature: "co hoi " + slug, owner: "o@o", stage, decision, decided_by: "M",
    decided_at: "2026-08-01T00:00:00Z", gate0_minutes: "10", base_commit: "abc",
    disposition: "archive" });
const uat = (slug, verdict) => fileFromTemplate(R("uat-session-template.md"),
  "UAT-FRONTMATTER-TEMPLATE",
  { slug, feature: "phien " + slug, owner: "o@o", stage: "held", verdict,
    decided_by: "M", decided_at: "2026-08-02T00:00:00Z", gateUAT_minutes: "20" });

W("_acceptance/config.yaml", "schema_version: 1\n");
W("_acceptance/a-can-nhac/opportunity.md", opp("a-can-nhac", "discovery", ""));
W("_acceptance/b-sap-mo/opportunity.md", opp("b-sap-mo", "decided", "build"));
W("_acceptance/c-cho-duyet/contract.md", contract("c-cho-duyet", "draft"));
W("_acceptance/d-dang-dung/contract.md", contract("d-dang-dung", "approved"));
W("_acceptance/e-cho-nghiem-thu/contract.md", contract("e-cho-nghiem-thu", "signed-off"));
W("_acceptance/e-cho-nghiem-thu/opportunity.md", opp("e-cho-nghiem-thu", "decided", "build"));
W("_acceptance/f-da-ship/contract.md", contract("f-da-ship", "signed-off"));
W("_acceptance/g-release/contract.md", contract("g-release", "signed-off"));
W("_acceptance/g-release/opportunity.md", opp("g-release", "decided", "build"));
W("_acceptance/g-release/uat-session.md", uat("g-release", "release"));
W("_acceptance/h-kill/contract.md", contract("h-kill", "signed-off"));
W("_acceptance/h-kill/uat-session.md", uat("h-kill", "kill"));
W("_acceptance/i-xep-lai/opportunity.md", opp("i-xep-lai", "decided", "park"));
W("_acceptance/j-bac/opportunity.md", opp("j-bac", "decided", "kill"));
W("_acceptance/k-hong/contract.md", "khong co frontmatter\n");
// cap evidence-report/verdict cua bang luat (1.38.0): tieu thu o implemented
W("_acceptance/l-dang-cham/contract.md", contract("l-dang-cham", "implemented"));
W("_acceptance/l-dang-cham/evidence-report.md", "---\nverdict: PASS\nhuman_signoff:\n---\n# E\n");
W(".out-of-scope/mot-de-xuat-da-bac.md", "# Mien tru X — DA TU CHOI\n\nvan xuoi\n");

const sectionOfIn = (txt, slug) => {
  let cur = null;
  for (const line of txt.split("\n")) {
    if (line.startsWith("## ")) cur = line.slice(3).trim();
    if (line.includes("(`" + slug + "`)") || line.includes("`" + slug + "` —")) return cur;
  }
  return null;
};
const out = renderProductMap(tmp);
const EXPECT = {
  "a-can-nhac": "Đang cân nhắc cơ hội",
  "b-sap-mo": "Sắp mở vòng",
  "c-cho-duyet": "Chờ duyệt phạm vi",
  "d-dang-dung": "Đang làm",
  "e-cho-nghiem-thu": "Đã giao — chờ phiên nghiệm thu",
  "f-da-ship": "Đã giao",
  "g-release": "Đã nghiệm thu giá trị",
  "h-kill": "Đã nghiệm thu giá trị",
  "i-xep-lai": "Xếp lại sau",
  "j-bac": "Đã bác từ khám phá",
  "k-hong": "Hồ sơ hỏng",
};
for (const [slug, sec] of Object.entries(EXPECT))
  if (sectionOfIn(out, slug) !== sec)
    die(slug + ": nam o " + JSON.stringify(sectionOfIn(out, slug)) + ", mong " + JSON.stringify(sec));
if (!out.includes("Mien tru X — DA TU CHOI")) die("thieu muc ngoai pham vi (title dong # dau file)");
// Neo vao TIEU DE muc, khong cat chuoi tran: ten o gio xuat hien ca trong
// hinh mermaid o dau file lan o tieu de, cat tran se vo nham khoi hinh.
const khoiNghiemThu = (out.split("## Đã nghiệm thu giá trị")[1] || "").split("\n## ")[0];
if (!/release/i.test(khoiNghiemThu) || !/kill/i.test(khoiNghiemThu))
  die("muc da nghiem thu khong ghi ket cuc tung slug");
for (const slug of Object.keys(EXPECT)) {
  const n = out.split("`" + slug + "`").length - 1;
  if (n !== 1) die(slug + " xuat hien " + n + " lan trong map");
}

// Danh sach cap (file, field) can tiem lay TU NAV_RULES, khong go tay: ban go
// tay cu co 4 muc va thieu dung `uat-session.md/stage` — cap thu 5 cua bang
// luat khong he co phep do nao, xoa han khoi bang van xanh ca suite (S4-r13).
// Bang fixture duoi day chi tra loi "do cap nay o workspace nao"; bang luat no
// ra ma bang nay khong no theo thi case DUNG AM I, khong lang le bo qua.
const { NAV_FIELDS } = (await import("node:module")).createRequire(
  path.join(root, "lib/workspace-record.cjs"))(path.join(root, "lib/workspace-record.cjs"));
const FIXTURE = {
  "contract.md/status":      "d-dang-dung",
  "opportunity.md/stage":    "a-can-nhac",
  "opportunity.md/decision": "b-sap-mo",
  "uat-session.md/verdict":  "g-release",
  "uat-session.md/stage":    "g-release",
  "evidence-report.md/verdict": "l-dang-cham",
};
const LAC = "khong-thuoc-tu-vung";
// MO NEO hai chieu. Suy danh sach tu NAV_RULES vá được lỗ "them field ma quen
// them ca", nhung tu no lai mo lo nguoc lai: XOA mot luat khoi bang thi danh
// sach suy ra cung ngan lai, ca hai reader cung ngung kiem, va khong phep do
// nao do. Thuoc suy tu vat thi no theo vat — va teo theo vat. Nen FIXTURE
// dong vai mo neo VIET TAY: hai ben phai phu nhau, lech chieu nao cung DUNG.
const capLuat = new Set(NAV_FIELDS.map(([f, k]) => f + "/" + k));
const capNeo = new Set(Object.keys(FIXTURE));
for (const c of capNeo)
  if (!capLuat.has(c)) die("P116 neo cap " + c + " ma NAV_RULES khong con — "
    + "mot field dieu huong vua bi xoa khoi bang luat: hai reader cung ngung kiem no. "
    + "Co chu y thi bo dong tuong ung khoi FIXTURE, dung sua thuoc cho vua vat.");
for (const [file, field] of NAV_FIELDS) {
  const slug = FIXTURE[file + "/" + field];
  if (!slug) die("NAV_RULES co " + file + "/" + field + " ma P116 khong co fixture — "
    + "them fixture cho cap do, dung de mot field dieu huong khong ai do");
  const p = path.join(tmp, "_acceptance", slug, file);
  const orig = fs.readFileSync(p, "utf8");
  const re = new RegExp("^" + field + ":.*$", "m");
  // Doi chung duong hai chan: fixture PHAI chua field (khong thi buoc tiem
  // chua bao gio chay), va ban NGUYEN VEN phai KHONG nam o Ho so hong.
  if (!re.test(orig)) die("fixture " + slug + "/" + file + " khong co dong \"" + field + ":\" — buoc tiem chua bao gio chay");
  if (sectionOfIn(renderProductMap(tmp), slug) === "Hồ sơ hỏng")
    die("fixture " + slug + " da hong san truoc khi tiem — case khong phan biet duoc gi");
  fs.writeFileSync(p, orig.replace(re, field + ": " + LAC));
  const mutated = renderProductMap(tmp);
  const cur = sectionOfIn(mutated, slug);
  if (cur !== "Hồ sơ hỏng")
    die("enum-lac o " + file + "/" + field + " (" + slug + "): slug nam o " + JSON.stringify(cur) + ", mong Ho so hong");
  const hongBlock = (mutated.split("## Hồ sơ hỏng")[1] || "");
  if (!hongBlock.includes(field) || !hongBlock.includes(LAC))
    die("enum-lac o " + file + "/" + field + ": muc Ho so hong khong neu ten field + gia tri la");
  fs.writeFileSync(p, orig);
}
console.log("P116 OK (" + NAV_FIELDS.length + " cap field dieu huong, suy tu NAV_RULES)");
P103JS

run "P117 map GIU NGUYEN qua approved->implemented->verified; DOI qua cong nguoi (E2)" \
  node --input-type=module - "$ROOT" <<'P104JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { renderProductMap } = await import(path.join(root, "scripts/product-map.mjs"));
const { fileFromTemplate } = await import(path.join(root, "tests/fixtures/from-template.mjs"));
const die = m => { console.error(m); process.exit(1); };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p104-"));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = status => fileFromTemplate(
  path.join(root, "skills/acceptance/references/contract-template.md"),
  "CONTRACT-FRONTMATTER-TEMPLATE",
  { feature: "viec x", slug: "x", owner: "o@o", risk_tier: "T2", surfaces: "cli", status });
W("_acceptance/config.yaml", "schema_version: 1\n");
W("_acceptance/x/contract.md", contract("approved"));
// Tu 1.38.0 verified TIEU THU evidence-report (thieu la ho so hong — luat
// khai-xong-ma-thieu-file). Loi hua "dung yen giua hai cong nguoi" do tren
// DUONG LANH: fixture mang evidence lanh nhu vong that (S4 ghi report truoc
// khi doi status). Duong verified-thieu-evidence do o P123 chang 2b.
W("_acceptance/x/evidence-report.md", "---\nverdict: PASS\nhuman_signoff:\n---\n# E\n");
const cPath = path.join(tmp, "_acceptance/x/contract.md");
const base = renderProductMap(tmp);
for (const s of ["implemented", "verified"]) {
  fs.writeFileSync(cPath, contract(s));
  if (renderProductMap(tmp) !== base)
    die("map DOI khi chuyen may sang " + s + " — --check se do oan giua vong");
}
// doi chung DUONG: qua cong NGUOI thi map PHAI doi, khong thi phep do nay chet
fs.writeFileSync(cPath, contract("signed-off"));
if (renderProductMap(tmp) === base) die("map khong doi khi da ky signed-off — bucket khong con phan biet gi");
fs.writeFileSync(cPath, contract("draft"));
if (renderProductMap(tmp) === base) die("map khong doi giua draft va approved — phep do nay khong song");
console.log("P117 OK");
P104JS

run "P118 render 2 lan giong het + sort theo slug + canh chi hien khi ho so co (E4,E5)" \
  node --input-type=module - "$ROOT" <<'P105JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { renderProductMap } = await import(path.join(root, "scripts/product-map.mjs"));
const { fileFromTemplate } = await import(path.join(root, "tests/fixtures/from-template.mjs"));
const die = m => { console.error(m); process.exit(1); };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p105-"));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = (slug, extra = "") => fileFromTemplate(
  path.join(root, "skills/acceptance/references/contract-template.md"),
  "CONTRACT-FRONTMATTER-TEMPLATE",
  { feature: "viec " + slug, slug, owner: "o@o", risk_tier: "T2", surfaces: "cli",
    status: "draft" }).replace("status: draft", "status: draft" + extra);
W("_acceptance/config.yaml", "schema_version: 1\n");
// tao KHONG theo thu tu chu, de chung minh sort theo slug chu khong theo thu tu file
W("_acceptance/zebra/contract.md", contract("zebra"));
W("_acceptance/alpha/contract.md", contract("alpha", "\nepic: nen-tang\nrelates: zebra"));
W("_acceptance/mike/contract.md", contract("mike"));
const a = renderProductMap(tmp), b = renderProductMap(tmp);
if (a !== b) die("hai lan render khac nhau — --check khong the tin duoc");
const order = ["alpha", "mike", "zebra"].map(s => a.indexOf("(`" + s + "`)"));
if (!(order[0] < order[1] && order[1] < order[2])) die("khong sort theo slug: " + JSON.stringify(order));
const lineOf = s => a.split("\n").find(l => l.includes("(`" + s + "`)")) || "";
if (!lineOf("alpha").includes("epic: nen-tang") || !lineOf("alpha").includes("liên quan: zebra"))
  die("canh co trong ho so ma khong hien: " + lineOf("alpha"));
if (/epic|thay thế|liên quan/.test(lineOf("zebra")))
  die("slug khong khai canh ma dong van co nhan canh: " + lineOf("zebra"));

// feature: mo dau bang chinh slug -> dong ban do khong duoc lap lai slug hai lan
W("_acceptance/omega/contract.md", contract("omega").replace(
  "feature: viec omega", "feature: omega — lam cho nguoi dung X"));
const withEcho = renderProductMap(tmp);
const lo = withEcho.split("\n").find(l => l.includes("(`omega`)")) || "";
if ((lo.match(/omega/g) || []).length !== 1)
  die("dong ban do vong lai ten may hai lan: " + lo);
if (!lo.includes("lam cho nguoi dung X")) die("cat tien to lam mat luon mo ta: " + lo);
console.log("P118 OK");
P105JS

# ── P119: --check 4 trang thai + goi y lenh chay duoc o CHINH repo dang do ──
run "P119 --check fresh/stale/thieu-file/chua-init + path suy tu vi tri script (E3)" \
  node --input-type=module - "$ROOT" <<'P106JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { execFileSync } = await import("node:child_process");
const { fileFromTemplate } = await import(path.join(root, "tests/fixtures/from-template.mjs"));
const die = m => { console.error(m); process.exit(1); };
const SCRIPT = path.join(root, "scripts/product-map.mjs");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p106-"));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const runCheck = () => { try {
    const out = execFileSync("node", [SCRIPT, "--root", tmp, "--check"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { code: 0, out, err: "" };
  } catch (e) { return { code: e.status, out: String(e.stdout || ""), err: String(e.stderr || "") }; } };

// 1. chua init -> exit 0 co note (KHONG do oan repo chua dung cong)
let r = runCheck();
if (r.code !== 0 || !/chưa dựng cổng/.test(r.out)) die("chua init: code=" + r.code + " out=" + r.out);

W("_acceptance/config.yaml", "schema_version: 1\n");
W("_acceptance/x/contract.md", fileFromTemplate(
  path.join(root, "skills/acceptance/references/contract-template.md"),
  "CONTRACT-FRONTMATTER-TEMPLATE",
  { feature: "viec x", slug: "x", owner: "o@o", risk_tier: "T2", surfaces: "cli", status: "draft" }));

// 2. chua co PRODUCT-MAP.md -> exit 0 co note (duong doc-cu cho consumer chua dung)
r = runCheck();
if (r.code !== 0 || !/chưa có/.test(r.out)) die("thieu file: code=" + r.code + " out=" + r.out);

// 3. DOI CHUNG DUONG: sinh roi check -> phai XANH truoc khi tin mau do o buoc 4
execFileSync("node", [SCRIPT, "--root", tmp], { stdio: "ignore" });
r = runCheck();
if (r.code !== 0) die("vua sinh xong ma --check do: " + r.err);

// 4. tiem lech -> exit 1 + DUNG thong diep + duong dan goi y chay duoc
const mapPath = path.join(tmp, "PRODUCT-MAP.md");
fs.writeFileSync(mapPath, fs.readFileSync(mapPath, "utf8") + "\n- **la-hoac**\n");
r = runCheck();
if (r.code !== 1) die("map lech ma --check khong exit 1 (code=" + r.code + ")");
if (!r.err.includes("PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node "))
  die("thong diep khong khop khuon ghim: " + r.err);
const m = r.err.match(/chạy: node (\S+) --root \./);
if (!m) die("thong diep khong neu duong dan script: " + r.err);
if (!fs.existsSync(path.resolve(tmp, m[1])))
  die("duong dan trong goi y KHONG ton tai khi chay tu repo dang do: " + m[1]);

// 5. goi script QUA MOT SYMLINK: loader ESM giai symlink cho import.meta.url
// nhung argv[1] thi khong, nen so bang path.resolve se cho isMain=false va
// script IM LANG exit 0 — --check xanh ma chua kiem gi. Repo duoi /tmp,
// /var/folders, hay home mount deu dinh. Chan do nay phai o day, khong the
// dua vao viec suite tinh co chay trong ban sao co symlink.
const linkDir = fs.mkdtempSync(path.join(os.tmpdir(), "p106-link-"));
const link = path.join(linkDir, "kit");
fs.symlinkSync(root, link);
let viaLink;
try {
  execFileSync("node", [path.join(link, "scripts/product-map.mjs"), "--root", tmp, "--check"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  viaLink = { code: 0, err: "" };
} catch (e) { viaLink = { code: e.status, err: String(e.stderr || "") }; }
if (viaLink.code !== 1 || !viaLink.err.includes("lệch với hồ sơ xưởng"))
  die("goi qua symlink: map dang lech ma script khong bao (code=" + viaLink.code +
      ") — khoi CLI khong chay, --check se xanh gia o moi repo co symlink");
// 6. CHOT MODE: mot loi go khong duoc bien lenh KIEM thanh lenh GHI. Khuon nay
// chep tu scripts/sync-plugin-packages.sh — no da dung chot cho dung lop loi
// nay ("--chek tung in 'Synced', thoat 0, VA xoa luon drift vua tiem").
fs.writeFileSync(mapPath, fs.readFileSync(mapPath, "utf8"));  // map dang LECH tu buoc 4
const truocKhiGoNham = fs.readFileSync(mapPath, "utf8");
let goNham;
try {
  execFileSync("node", [SCRIPT, "--root", tmp, "--chek"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  goNham = { code: 0, err: "" };
} catch (e) { goNham = { code: e.status, err: String(e.stderr || "") }; }
if (goNham.code !== 2) die(`mode la '--chek' phai exit 2, duoc ${goNham.code}`);
if (!/tham số lạ/.test(goNham.err)) die("mode la khong ghim dung thong diep: " + goNham.err);
if (fs.readFileSync(mapPath, "utf8") !== truocKhiGoNham)
  die("mot loi go da GHI DE ban do — lenh KIEM bien thanh lenh GHI, xoa luon bang chung lech");

// 7. CHOT THU TU: `--root` khong co gia tri thi `--check` bi nuot lam duong dan
let saiThuTu;
try {
  execFileSync("node", [SCRIPT, "--root", "--check"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  saiThuTu = { code: 0, err: "" };
} catch (e) { saiThuTu = { code: e.status, err: String(e.stderr || "") }; }
if (saiThuTu.code !== 2) die(`--root khong gia tri phai exit 2, duoc ${saiThuTu.code}`);

// 8. XOA ban do: file DA duoc git theo doi ma bien mat la mot lan XOA, khong
// phai "chua tung dung". Ban do nam trong t1_skip_globs nen mot PR chi xoa no
// vua bo qua cong nghiem thu vua xanh o CI neu day cung exit 0. Mirror bi xoa
// thi cong DO — ban do phai xu nhu vay.
const gitTmp = fs.mkdtempSync(path.join(os.tmpdir(), "p106-git-"));
fs.mkdirSync(path.join(gitTmp, "_acceptance/x"), { recursive: true });
// Repo NAY dung ban do, nen no KHAI mien tru — dung thu `acceptance-init`
// phat ra. Mot repo co PRODUCT-MAP.md commit ma KHONG khai la cau hinh khong
// ton tai that: khong khai thi chinh cong nghiem thu chan file do, va nam
// than cong nguoi deu BO QUA viec ve lai no.
fs.writeFileSync(path.join(gitTmp, "_acceptance/config.yaml"),
  "schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - \"PRODUCT-MAP.md\"\n");
fs.writeFileSync(path.join(gitTmp, "_acceptance/x/contract.md"), "---\nstatus: draft\n---\n");
const g = (...a) => execFileSync("git", ["-C", gitTmp, ...a], { stdio: "ignore" });
g("init", "-q"); g("config", "user.email", "t@t"); g("config", "user.name", "t");
execFileSync("node", [SCRIPT, "--root", gitTmp], { stdio: "ignore" });
g("add", "-A"); g("commit", "-qm", "init");
// doi chung DUONG: con file thi --check xanh
try { execFileSync("node", [SCRIPT, "--root", gitTmp, "--check"], { stdio: "ignore" }); }
catch { die("doi chung duong hong: ban do vua sinh + commit ma --check da do"); }
fs.unlinkSync(path.join(gitTmp, "PRODUCT-MAP.md"));
let daXoa;
try {
  execFileSync("node", [SCRIPT, "--root", gitTmp, "--check"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  daXoa = { code: 0, err: "" };
} catch (e) { daXoa = { code: e.status, err: String(e.stderr || "") }; }
if (daXoa.code === 0) die("XOA ban do da theo doi ma --check VAN xanh — cong duy nhat canh no im lang");
if (!/đã bị xoá/.test(daXoa.err)) die("xoa ban do khong ghim dung thong diep: " + daXoa.err);

// 9. XOA DA COMMIT — hinh dang THAT ma CI gap. Chan 8 chi xoa o cay lam viec,
// nhung mot PR mang toi CI la mot cay da checkout SAU khi xoa duoc commit: file
// khong con trong index, nen hoi ls-files mot minh la fail-OPEN (in "repo chua
// dung ban do" roi exit 0). Do la lo nang nhat: PRODUCT-MAP.md nam trong
// t1_skip_globs nen rang T1-escape cua pre-merge KHONG doi PR mang _acceptance/
// cho no, va --check trong CI la cong DOC LAP DUY NHAT ma ADR 0007 lay lam can
// cu cho mien tru do (S4-r14).
g("checkout", "--", "PRODUCT-MAP.md");
g("rm", "-q", "PRODUCT-MAP.md"); g("commit", "-qm", "xoa ban do");
let daXoaCommit;
try {
  execFileSync("node", [SCRIPT, "--root", gitTmp, "--check"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  daXoaCommit = { code: 0, err: "" };
} catch (e) { daXoaCommit = { code: e.status, err: String(e.stderr || "") }; }
if (daXoaCommit.code === 0)
  die("XOA DA COMMIT ma --check xanh — mot PR chi xoa ban do vua bo qua cong nghiem thu vua xanh CI");
if (!/đã bị xoá/.test(daXoaCommit.err))
  die("xoa da commit khong ghim dung thong diep: " + daXoaCommit.err);

// 9b. CLONE NONG — hinh dang THAT ma CI dung. Chan 9 tu dung mot repo local du
// lich su, nen no khong noi duoc gi ve `actions/checkout` mac dinh (depth 1):
// commit bi graft nen `git log --diff-filter=D` khong thay lan xoa nao, va chot
// lai fail-open y nhu truoc khi vá (S4-r15 — "thuoc phai gan vao vat duoc
// giao", hinh dang 4). Case nay do dung tren mot clone --depth 1.
const nong = fs.mkdtempSync(path.join(os.tmpdir(), "p106-nong-"));
execFileSync("git", ["clone", "--quiet", "--depth", "1", "file://" + gitTmp, path.join(nong, "cay")],
  { stdio: "ignore" });
const cayNong = path.join(nong, "cay");
// Doi chung: no THAT SU la clone nong (khong thi ca nay do vao khoang khong)
const laNong = execFileSync("git", ["-C", cayNong, "rev-parse", "--is-shallow-repository"],
  { encoding: "utf8" }).trim();
if (laNong !== "true") die("clone khong nong that (" + laNong + ") — chan CLONE NONG khong do duoc gi");
let nongRes;
try {
  execFileSync("node", [SCRIPT, "--root", cayNong, "--check"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  nongRes = { code: 0, err: "" };
} catch (e) { nongRes = { code: e.status, err: String(e.stderr || "") }; }
if (nongRes.code === 0)
  die("tren CLONE NONG (dung thu CI checkout ra) mot lan xoa DA COMMIT lai xanh — "
    + "chot duy nhat canh mien tru t1 fail-open; job chay --check phai co fetch-depth: 0");
fs.rmSync(nong, { recursive: true, force: true });

// 9c. Va job CI chay --check phai THAT SU khai fetch-depth: 0 — sua script ma
// quen sua workflow thi chan 9b do tren may nhung CI van nong.
const wf = fs.readFileSync(path.join(root, ".github/workflows/gate.yml"), "utf8");
const jobs = wf.split(/\n  (?=[a-z][a-z0-9_-]*:\n)/);
const jobCheck = jobs.find(j => j.includes("product-map.mjs --root . --check"));
if (!jobCheck) die("khong job CI nao chay `product-map.mjs --root . --check` — chot khong duoc mac vao CI");
if (!/fetch-depth:\s*0/.test(jobCheck))
  die("job CI chay --check KHONG khai fetch-depth: 0 — checkout mac dinh la depth 1, chot phat hien xoa fail-open");

fs.rmSync(gitTmp, { recursive: true, force: true });

// 10. Doi chung DUONG cho chan 9: repo CHUA TUNG dung ban do van phai di duong
// doc-cu (exit 0). Thieu chan nay thi "luon exit 1" cung qua chan 9 — va no se
// chan moi repo tieu thu chua bat ban do, dung cai ADR 0007 viet ra de tranh.
const chuaTung = fs.mkdtempSync(path.join(os.tmpdir(), "p106-moi-"));
fs.mkdirSync(path.join(chuaTung, "_acceptance"), { recursive: true });
fs.writeFileSync(path.join(chuaTung, "_acceptance/config.yaml"), "schema_version: 1\n");
execFileSync("git", ["-C", chuaTung, "init", "-q"], { stdio: "ignore" });
try { execFileSync("node", [SCRIPT, "--root", chuaTung, "--check"], { stdio: "ignore" }); }
catch { die("repo CHUA TUNG dung ban do ma --check do — duong doc-cu bi chan (ADR 0007)"); }
fs.rmSync(chuaTung, { recursive: true, force: true });
console.log("P119 OK");
P106JS

# ── P120: nghi thuc uat-session du chot + DUNG THU TU + khong khoa invocation ─
run "P120 uat-session giu chot spec §2.3 dung thu tu; skill MO nhu design-pass (E12)" \
  python3 - "$ROOT" <<'PY107'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
p = root / "skills/uat-session/SKILL.md"
assert p.is_file(), "thieu skills/uat-session/SKILL.md"
raw = p.read_text(encoding="utf-8")
# Chuan hoa khoang trang TRUOC khi soi: lo hua la "than skill co chot X",
# khong phai "chuoi X nam gon tren mot dong". Do nguyen van thi mot lan
# xuong dong lam phep do do — do la do TU VUNG chu khong do QUAN HE.
t = re.sub(r"\s+", " ", raw)

# 5 chot QUY TRINH phai xuat hien dung thu tu nay trong than skill
FLOW = [
    ("dieu kien vao", "status: signed-off"),
    ("nguong da chot tai Cong Dang", "ngưỡng UAT đã chốt tại"),
    ("chep nguyen van + cam sua sau khi thay so", "NGUYÊN VĂN"),
    ("cham kin TRUOC thao luan", "Chấm kín TRƯỚC thảo luận"),
    ("cau rang buoc", "gửi cho khách nào"),
    # Neo luc KY phai nam trong chuoi thu tu: thieu no thi ca khoi cham-kin co
    # the bi chuyen xuong SAU khi ky ma phep do van xanh (thu tu tuong doi
    # giua hai chot trong cung khoi khong doi) — do da dam mot lan.
    ("luc ky", "Agent KHÔNG điền verdict"),
    ("lam moi ban do sau khi ky", "product-map.mjs"),
]
pos = []
for label, needle in FLOW:
    i = t.find(needle)
    assert i >= 0, f"thieu chot: {label} ({needle!r})"
    pos.append((label, i))
for a, b in zip(pos, pos[1:]):
    assert a[1] < b[1], f"chot lech thu tu: {a[0]} phai dung truoc {b[0]}"

# 2 chot TUYEN BO chi can co mat (co the nam o loi mo dau)
assert "THÀNH CÔNG của quy trình" in t, "thieu cau 'kill la thanh cong cua quy trinh'"

# lam moi ban do, va phai nam SAU luc ky
assert "product-map.mjs" in t, "thieu buoc lam moi ban do"
assert t.find("product-map.mjs") > t.find("decided_by"), \
    "buoc lam moi ban do nam TRUOC luc ky — sai diem regen"

# Con tro khuon phai GIAI DUOC tren dia — do DAU RA chu khong do CHI DAN.
# Truoc S4-r7 than skill viet "references/uat-session-template.md" (tuong doi
# voi thu muc skill) trong khi khuon nam o skills/acceptance/references/, nen
# agent chay that se doc truot va tu go frontmatter — mat luon seam ma P115
# dung ra de giu ben viet va ben doc khop nhau.
m = re.search(r"Chép khuôn từ `([^`]+)`", raw)
assert m, "than skill khong con cau 'Chép khuôn từ `<duong-dan>`'"
# Bóc MỌI dạng gốc-plugin, gồm dạng hai-harness ${CLAUDE_PLUGIN_ROOT:-$PLUGIN_ROOT}
ct = re.sub(r"^\$\{?CLAUDE_PLUGIN_ROOT(:-\$\{?PLUGIN_ROOT\}?)?\}?/", "", m.group(1))
assert (root / ct).is_file(), f"con tro khuon KHONG giai duoc: {m.group(1)} -> {ct}"

# skill MO: khong co co khoa invocation (doi chung duong tren mot lenh LOCKED)
assert "disable-model-invocation" not in t, "uat-session bi khoa — tien le design-pass la MO"
locked = (root / "commands/start.md").read_text(encoding="utf-8")
assert "disable-model-invocation: true" in locked, \
    "doi chung duong hong: commands/start.md le ra phai co co khoa"

# dot bien: bo mot chot thi phep do PHAI mat dau moc
# Dua ban da tiem QUA CHINH vong kiem thu tu o tren — assert tren chuoi vua
# bi replace la hang-dung, khong do lai gi (lop loi CLAUDE.md goi ten).
def flow_errs(txt):
    errs, last = [], -1
    for label, needle in FLOW:
        i = txt.find(needle)
        if i < 0: errs.append(f"thieu chot: {label}")
        elif i < last: errs.append(f"chot lech thu tu: {label}")
        else: last = i
    return errs
assert flow_errs(t) == [], f"doi chung duong: ban that phai xanh, duoc {flow_errs(t)}"
mut = t.replace("Chấm kín TRƯỚC thảo luận", "Thu y kien")
assert any("cham kin" in e for e in flow_errs(mut)), \
    f"dot bien go chot cham kin ma phep do van xanh: {flow_errs(mut)}"
PY107

# ── P121: start-scan doc phien nghiem thu + trang thai ban do (E10) ────────
run "P121 o cho-Cong-Gia-tri + state theo verdict + since 2 nhanh + map 4 to hop (E10)" \
  node --input-type=module - "$ROOT" <<'P108JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { execFileSync } = await import("node:child_process");
const { fileFromTemplate } = await import(path.join(root, "tests/fixtures/from-template.mjs"));
const die = m => { console.error(m); process.exit(1); };
const SCAN = path.join(root, "scripts/start-scan.mjs");
const MAP = path.join(root, "scripts/product-map.mjs");
const R = p => path.join(root, "skills/acceptance/references", p);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p108-"));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const scan = () => JSON.parse(execFileSync("node", [SCAN, "--root", tmp], { encoding: "utf8" }));
const contract = (slug, status) => fileFromTemplate(R("contract-template.md"),
  "CONTRACT-FRONTMATTER-TEMPLATE",
  { feature: "viec " + slug, slug, owner: "o@o", risk_tier: "T2", surfaces: "cli", status });
const opp = (slug, decision) => fileFromTemplate(R("opportunity-template.md"),
  "OPP-FRONTMATTER-TEMPLATE",
  { slug, feature: "co hoi", owner: "o@o", stage: "decided", decision, decided_by: "M",
    decided_at: "2026-08-01T00:00:00Z", gate0_minutes: "10", base_commit: "a", disposition: "archive" });
const uat = (slug, verdict, decidedAt = "2026-08-02T00:00:00Z") =>
  fileFromTemplate(R("uat-session-template.md"), "UAT-FRONTMATTER-TEMPLATE",
    { slug, feature: "phien", owner: "o@o", stage: "held", verdict, decided_by: "M",
      decided_at: decidedAt, gateUAT_minutes: "20" });

W("_acceptance/config.yaml", "schema_version: 1\n");
W("_acceptance/a-cho-gia-tri/contract.md", contract("a-cho-gia-tri", "signed-off"));
W("_acceptance/a-cho-gia-tri/opportunity.md", opp("a-cho-gia-tri", "build"));
W("_acceptance/b-cho-co-uat/contract.md", contract("b-cho-co-uat", "signed-off"));
W("_acceptance/b-cho-co-uat/opportunity.md", opp("b-cho-co-uat", "iterate"));
W("_acceptance/b-cho-co-uat/uat-session.md", uat("b-cho-co-uat", "", "2026-07-01T00:00:00Z"));
W("_acceptance/c-release/contract.md", contract("c-release", "signed-off"));
W("_acceptance/c-release/uat-session.md", uat("c-release", "release"));
W("_acceptance/d-iterate/contract.md", contract("d-iterate", "signed-off"));
W("_acceptance/d-iterate/uat-session.md", uat("d-iterate", "iterate"));
W("_acceptance/e-kill/contract.md", contract("e-kill", "signed-off"));
W("_acceptance/e-kill/uat-session.md", uat("e-kill", "kill"));
W("_acceptance/f-uat-hong/contract.md", contract("f-uat-hong", "signed-off"));
W("_acceptance/f-uat-hong/uat-session.md", "khong co frontmatter\n");
W("_acceptance/g-uat-la/contract.md", contract("g-uat-la", "signed-off"));
W("_acceptance/g-uat-la/uat-session.md", uat("g-uat-la", "xong-roi"));
W("_acceptance/h-ship-thang/contract.md", contract("h-ship-thang", "signed-off"));

let j = scan();
const gate = s => (j.groups.gates.find(g => g.slug === s) || {}).gate;
const state = s => (j.groups.done.find(d => d.slug === s) || {}).state;
const broken = s => j.broken.find(b => b.slug === s);
if (gate("a-cho-gia-tri") !== "gia-tri") die("signed-off duong A khong vao o cho-Cong-Gia-tri");
if (gate("b-cho-co-uat") !== "gia-tri") die("uat co file nhung verdict rong phai VAN cho ky");
if (state("c-release") !== "released") die("verdict release -> released, got " + state("c-release"));
if (state("d-iterate") !== "uat-iterate") die("verdict iterate -> uat-iterate, got " + state("d-iterate"));
if (state("e-kill") !== "uat-kill") die("verdict kill -> uat-kill, got " + state("e-kill"));
if (!broken("f-uat-hong") || !/uat-session/.test(broken("f-uat-hong").file))
  die("uat hong khong vao broken[] kem ten file");
if (!broken("g-uat-la") || !/xong-roi/.test(broken("g-uat-la").reason))
  die("verdict ngoai enum khong vao broken[] kem gia tri la");
if (state("h-ship-thang") !== "signed-off") die("signed-off khong duong A phai la da-ky thuong");
// since 2 nhanh (doi 1.38.0, AC-8 workspace-reader-unification): co decided_at
// cua uat -> dung no; THIEU -> de RONG, khong muon mtime bia mot moc — nghi
// thuc that chua sinh moc thi thu tu cho khong duoc dua tren thoi diem file
// bi format/sync cham lai.
const gA = j.groups.gates.find(g => g.slug === "a-cho-gia-tri");
const gB = j.groups.gates.find(g => g.slug === "b-cho-co-uat");
if (gB.since !== "2026-07-01T00:00:00Z") die("since khong lay decided_at cua uat: " + gB.since);
if (gA.since !== "") die("since thieu decided_at phai RONG (khong bia moc tu mtime), duoc: " + JSON.stringify(gA.since));
// since rong sort len dau bang localeCompare — thu tu van xac dinh, khong assert
// "cho lau nhat dung dau" tren hai kieu moc khong so sanh duoc voi nhau nua
if (j.groups.gates[0].slug !== "a-cho-gia-tri") die("since rong phai dung dau danh sach (sort on dinh): " + j.groups.gates[0].slug);
// Khoa skipped[] da bi go han (het nguon sinh) — kiem SU VANG MAT cua khoa,
// khong grep noi dung mot mang luon rong (chan chet).
if ("skipped" in j) die("skipped[] van con trong dau ra du khong con nguon sinh nao");

// map 4 to hop
if (j.map.present !== false || j.map.fresh !== null) die("map vang: " + JSON.stringify(j.map));
execFileSync("node", [MAP, "--root", tmp], { stdio: "ignore" });
j = scan();
if (j.map.present !== true || j.map.fresh !== true) die("map fresh: " + JSON.stringify(j.map));
fs.appendFileSync(path.join(tmp, "PRODUCT-MAP.md"), "\n- **la**\n");
j = scan();
if (j.map.present !== true || j.map.fresh !== false) die("map stale: " + JSON.stringify(j.map));
// khong doc duoc ban do -> fresh null (KHONG crash, KHONG bao xanh gia).
// Ep loi bang cach bien PRODUCT-MAP.md thanh THU MUC: EISDIR xay ra cho moi
// nguoi dung ke ca root, nen phep do khong phu thuoc quyen cua may chay CI.
const mapP = path.join(tmp, "PRODUCT-MAP.md");
fs.unlinkSync(mapP); fs.mkdirSync(mapP);
const jErr = scan();
fs.rmdirSync(mapP);
if (jErr.map.present !== true || jErr.map.fresh !== null)
  die("khong doc duoc ban do phai cho present=true/fresh=null, got " + JSON.stringify(jErr.map));
console.log("P121 OK");
P108JS

# ── P122: diem lam moi ban do o MOI than cong nguoi + config self-host ─────
run "P122 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)" \
  python3 - "$ROOT" <<'PY109'
import sys
from pathlib import Path
root = Path(sys.argv[1])
# (than lenh, moc "ghi field cong" phai dung TRUOC buoc regen)
BODIES = [
    ("commands/approve.md", "approved_by"),
    ("commands/signoff.md", "human_signoff"),
    ("skills/uat-session/SKILL.md", "decided_by"),
]
for rel, anchor_field in BODIES:
    t = (root / rel).read_text(encoding="utf-8")
    assert "product-map.mjs" in t, f"{rel}: thieu buoc lam moi ban do"
    assert t.find("product-map.mjs") > t.find(anchor_field), \
        f"{rel}: buoc lam moi ban do nam TRUOC {anchor_field} — sai diem regen"
    if rel.startswith("commands/"):
        # Dan script qua PLUGIN_ROOT, khong hardcode 'scripts/' kieu self-host:
        # ghim duong self-host la consumer khong bao gio regen (gap-probe F3).
        seg = t[max(0, t.find("product-map.mjs") - 240): t.find("product-map.mjs")]
        assert "PLUGIN_ROOT" in seg, \
            f"{rel}: dan script bang duong dan self-host — consumer se khong bao gio regen"

cfg = (root / "_acceptance/config.yaml").read_text(encoding="utf-8")
assert "product_map:" in cfg, "config thieu executors.script.product_map"

# Loi hua la QUAN HE: khoa nam TRONG danh sach feature_loop.suite_keys. Grep
# substring ca file van xanh khi dong do bi doi sang list khac — do la dung
# cai hong can bat ("do tu vung thay vi quan he").
def suite_keys(txt):
    lines, out, inside = txt.splitlines(), [], False
    for ln in lines:
        if ln.strip() == "suite_keys:": inside = True; continue
        if inside:
            s = ln.strip()
            if s.startswith("- "): out.append(s[2:].strip())
            elif s and not s.startswith("#") and not ln.startswith("    "): break
    return out
keys = suite_keys(cfg)
assert "executors.script.product_map" in keys, \
    f"product_map khong nam trong feature_loop.suite_keys (thay: {keys})"
mut = cfg.replace("    - executors.script.product_map", "  # doi sang cho khac: executors.script.product_map")
assert "executors.script.product_map" in mut, "buoc tiem chua bao gio chay"
assert "executors.script.product_map" not in suite_keys(mut), \
    "doi khoa ra khoi suite_keys ma phep do van xanh — dang do tu vung, khong do quan he"

# Ban do cua CHINH kit: doi chung song la CHAY --check, khong phai
# kiem file ton tai.
assert (root / "PRODUCT-MAP.md").is_file(), "kit chua commit PRODUCT-MAP.md cua chinh no"
import subprocess
rc = subprocess.run(["node", "scripts/product-map.mjs", "--root", ".", "--check"],
                    cwd=root, capture_output=True, text=True)
assert rc.returncode == 0, f"PRODUCT-MAP.md cua kit lech voi ho so xuong: {rc.stderr.strip()}"
PY109

# ── P195: MOI suite_key phai resolve ve mot lenh co that ───────────────────
# Luoi nay TUNG song trong `P162` (E6) va bi go CUNG voi ca do khi luu kho
# harness Codex. So thi cong xep `P162` vao "Nhom A — XOA HAN (ca chi ton tai
# vi Codex/mirror; go la dung, khong mat do phu)"; ra soat doi khang vong 2
# (F6) do ra cau do SAI: E6 khong doc `plugins/` va khong doc `codex/` — no doc
# `_acceptance/config.yaml`, vat DANG SONG, va la dung vat ho so nay vua mo (go
# `executors.script.mirror_sync` khoi ca `executors` lan `suite_keys`). Chinh
# chu thich cua ho so nay trong config noi: "de lai mot suite_key tro executor
# khong con dinh nghia la go-mot-nua". Luat thi giu, luoi thuong truc canh luat
# thi go cung ca do.
#
# Lop loi: "luoi bi go KEM ca do no" — moi bo kiem van xanh, loi chi no o vong
# verify sau, tuc do vi ha tang giua mot vong lap feature.
#
# Bo rang cua ho so CO mot chan bat dung viec nay, nhung chan ay chet theo ho so
# khi merge (`_acceptance/config.yaml` khai ro nhom khoa `luu_kho_*` la
# "khong-vao-suite-vinh-vien"). Chan o day la ban THUONG TRUC: no song sau merge.
run "P195 moi feature_loop.suite_key resolve ve mot lenh co that (F6, un-remove tu P162/E6)" \
  python3 - "$ROOT" <<'PY195'
import re, sys, pathlib
from pathlib import Path
root = Path(sys.argv[1])
cfg = (root / "_acceptance/config.yaml").read_text(encoding="utf-8")

def suite_keys(txt):
    out, inside = [], False
    for ln in txt.splitlines():
        if ln.strip() == "suite_keys:": inside = True; continue
        if inside:
            s = ln.strip()
            if s.startswith("- "): out.append(s[2:].strip())
            elif s and not s.startswith("#") and not ln.startswith("    "): break
    return out

def walk(text, dotted):
    lines = text.split("\n"); depth = -1; idx = 0; val = None
    for part in dotted.split("."):
        found = None
        for i in range(idx, len(lines)):
            m = re.match(r"^(\s*)%s:\s*(.*)$" % re.escape(part), lines[i])
            if not m: continue
            ind = len(m.group(1))
            if depth >= 0 and ind <= depth: break
            found, depth, idx = i, ind, i + 1
            val = m.group(2).strip().strip('"\'')
            break
        if found is None: return None
    return val

keys = suite_keys(cfg)
assert keys, "khong doc duoc feature_loop.suite_keys tu config"
resolved = [walk(cfg, k) for k in keys]
assert all(resolved), \
    "co suite_key khong resolve duoc: %r" % [k for k, v in zip(keys, resolved) if not v]
assert len(resolved) == len(keys), "so lenh resolve != so key khai"

# CHIEU DO CHAY THAT tren CHINH hai ham tren: tiem mot khoa ma vao suite_keys
# cua BAN SAO config roi doi ket luan doi. Khong co buoc nay thi ca tren la
# assertion am-tinh-mot-minh — cay sach thi no xanh du hai ham co hong.
MA = "executors.script.khong_he_ton_tai_p195"
mut = cfg.replace("  suite_keys:\n", "  suite_keys:\n    - %s\n" % MA, 1)
assert MA in suite_keys(mut), "buoc tiem chua bao gio chay — khoa ma khong vao duoc suite_keys"
mut_resolved = [walk(mut, k) for k in suite_keys(mut)]
assert not all(mut_resolved), \
    "tiem mot suite_key tro khoa KHONG TON TAI ma phep do van xanh — luoi khong song"
missing = [k for k, v in zip(suite_keys(mut), mut_resolved) if not v]
assert missing == [MA], "chieu do phai neu DICH DANH khoa ma, got %r" % missing

# ── Vế 2 [vòng thu gọn, G7]: «lệnh CÓ THẬT» phải nghĩa là TỆP TỒN TẠI ────────
# Bản đầu của ca này chỉ kiểm "khoá YAML có giá trị khác rỗng" — gỡ script mà
# để lại khoá trỏ nó (đúng hình dạng mirror_sync vừa xảy ra) thì lưới vẫn xanh.
def script_paths(cmd):
    toks = cmd.split()
    out = []
    for i, t in enumerate(toks):
        if i > 0 and toks[i-1] in ("bash", "node", "python3") and "/" in t and not t.startswith("-"):
            out.append(t)
    return out
thieu = []
for k, cmd in zip(keys, resolved):
    for sp in script_paths(cmd):
        if not (root / sp).is_file():
            thieu.append("%s -> %s" % (k, sp))
assert not thieu, "suite_key tro script KHONG TON TAI tren cay: %r" % thieu
# chiều đỏ: trỏ một khoá sang script không tồn tại → phải đỏ NÊU ĐÍCH DANH tệp
mut2 = cfg.replace('product_map: "node scripts/product-map.mjs',
                   'product_map: "node scripts/KHONG-TON-TAI-P195.mjs', 1)
assert mut2 != cfg, "buoc tiem file-khong-ton-tai chua bao gio chay"
thieu2 = []
for k, cmd in zip(suite_keys(mut2), [walk(mut2, kk) for kk in suite_keys(mut2)]):
    for sp in script_paths(cmd or ""):
        if not (root / sp).is_file():
            thieu2.append(sp)
assert thieu2 == ["scripts/KHONG-TON-TAI-P195.mjs"], \
    "chieu do file-ton-tai phai neu dich danh tep ma, got %r" % thieu2

# ── Vế 3 [vòng thu gọn, G10 = D4 vòng 1]: CHỐT phải nằm TRONG lưới ───────────
# Un-remove nốt vế (4)+(5) của P162/E6 gốc: tệp giữ chốt này phải nằm trong
# danh sách lệnh của lưới — nếu ca bị dời sang một tệp không khoá nào gọi thì
# nó chết im lặng, suite vẫn xanh trọn.
MARK = "P195 chi-dan"
import tempfile, shutil
def holder_in(tree):
    return [str(f.relative_to(tree)) for f in (pathlib.Path(tree) / "tests").rglob("*")
            if f.is_file() and MARK in f.read_text(encoding="utf-8", errors="replace")]
hs_now = holder_in(root)
assert len(hs_now) == 1, "chot P195 phai nam o DUNG MOT tep, thay %r" % hs_now
assert any(hs_now[0] in c for c in resolved), \
    "chot nam o %r nhung khong lenh luoi nao goi tep do: %r" % (hs_now, resolved)
# ca âm THẬT: dời chốt sang tệp không được gọi, chạy lại CHÍNH hai hàm trên
with tempfile.TemporaryDirectory() as d:
    tw = pathlib.Path(d) / "t"
    tw.mkdir()
    shutil.copytree(root / "tests", tw / "tests")
    src_f = tw / hs_now[0]
    src_f.write_text(src_f.read_text(encoding="utf-8").replace(MARK, "P195 da-doi"), encoding="utf-8")
    orphan = tw / "tests/plugins/asserts-da-go.txt"
    orphan.write_text(orphan.read_text(encoding="utf-8") + "\n# " + MARK + "\n", encoding="utf-8")
    hs_mut = holder_in(tw)
    assert len(hs_mut) == 1, "buoc doi chot hong: %r" % hs_mut
    assert not any(hs_mut[0] in c for c in resolved), \
        "doi chot sang tep khong duoc goi ma phep do van xanh — ve chot-trong-luoi khong song"
print("P195 OK (%d suite_key resolve + tep ton tai; chieu do khoa-ma/tep-ma/chot-ngoai-luoi deu dich danh)" % len(keys))
PY195

# ── P123: HAI READER cua cung bo ho so phai dong y cai gi HONG ─────────────
run "P123 hai reader dong ket luan tren TICH DESCARTES contract x opportunity x uat (E1,E10)" \
  node --input-type=module - "$ROOT" <<'P123JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { execFileSync } = await import("node:child_process");
const { renderProductMap } = await import(path.join(root, "scripts/product-map.mjs"));
const die = m => { console.error(m); process.exit(1); };
const SCAN = path.join(root, "scripts/start-scan.mjs");
const { createRequire } = await import("node:module");
const LIB = path.join(root, "lib/workspace-record.cjs");
const { NAV_RULES, consumedTexts } = createRequire(LIB)(LIB);

// Ban do va bo quet vao phien la HAI READER cua cung mot bo ho so; loi hua la
// chung KHONG BAO GIO cho hai ket luan trai nhau ve "slug nay co hong khong".
//
// Phep do co HAI CHANG vi lech sinh ra tu HAI nguon khac nhau:
//   Chang 1 — TIEU THU: file nao duoc doc o trang thai nao. Tich Descartes
//     cheo file (contract x opportunity x uat) voi cac hinh dang tho.
//   Chang 2 — TU VUNG: gia tri tung field co hop luat khong. Chang 1 khong the
//     bat lop nay: moi phan tu cua no la mot GOI co dinh nhieu field cung luc
//     ("stage-la" luon di kem decision lanh), nen to hop (stage lanh x decision
//     lac) va (verdict lanh x uat-stage lac) nam NGOAI khong gian ca — dung hai
//     to hop S4-r13 dung lai duoc trong khi chang 1 van xanh. Chang 2 nhan
//     TUNG FIELD, va lay danh sach field + enum TU CHINH NAV_RULES: bang luat
//     no ra thi phep do tu no theo, khong cho ai them field ma quen them ca.
const CONTRACT = {
  "vang":        null,
  "draft":       "---\nstatus: draft\n---\n",
  "approved":    "---\nstatus: approved\n---\n",
  "implemented": "---\nstatus: implemented\n---\n",
  "verified":    "---\nstatus: verified\n---\n",
  "signed-off":  "---\nstatus: signed-off\n---\n",
  "status-la":   "---\nstatus: xong-roi\n---\n",
  "status-rong": "---\nstatus:\nrisk_tier: T2\n---\n",
  "mat-fm":      "khong co frontmatter\n",
};
const OPP = {
  "vang":       null,
  "lanh-build": "---\nstage: decided\ndecision: build\n---\n",
  "lanh-park":  "---\nstage: decided\ndecision: park\n---\n",
  "chua-quyet": "---\nstage: discovery\ndecision:\n---\n",
  "stage-la":   "---\nstage: dang-nghi\ndecision: build\n---\n",
  "stage-rong": "---\nstage:\ndecision: build\n---\n",
  "decision-la":"---\nstage: decided\ndecision: Build-hoa\n---\n",
  "mat-fm":     "khong co frontmatter\n",
};
const UAT = {
  "vang":         null,
  "chua-ky":      "---\nstage: held\nverdict:\ndecided_by:\n---\n",
  "release":      "---\nstage: held\nverdict: release\n---\n",
  "kill":         "---\nstage: held\nverdict: kill\n---\n",
  "verdict-la":   "---\nstage: held\nverdict: xong-roi\n---\n",
  "mat-fm":       "khong co frontmatter\n",
};

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p123-"));
fs.writeFileSync(path.join(tmp, "_acceptance/config.yaml".replace("_acceptance/", (fs.mkdirSync(path.join(tmp, "_acceptance"), {recursive:true}), "_acceptance/"))), "schema_version: 1\n");
const dir = path.join(tmp, "_acceptance", "x");
const dat = (name, txt) => { const p = path.join(dir, name);
  if (txt == null) { if (fs.existsSync(p)) fs.unlinkSync(p); } else fs.writeFileSync(p, txt); };

let n = 0, lanhManh = 0, hong = 0;
const lech = [];

// Dung workspace roi hoi CA HAI reader ve dung mot cau: slug nay co hong khong.
function doiChieu(nhan, { c, o, u, evidence = null, giuNguyenCay = false }) {
  if (!giuNguyenCay) {
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    dat("contract.md", c); dat("opportunity.md", o); dat("uat-session.md", u);
    dat("evidence-report.md", evidence);
  }
  const scan = JSON.parse(execFileSync("node", [SCAN, "--root", tmp], { encoding: "utf8" }));
  const scanHong = scan.broken.some(b => b.slug === "x");
  const mapTxt = renderProductMap(tmp);
  const mapHong = (mapTxt.split("## Hồ sơ hỏng")[1] || "").includes("`x`");
  n++; scanHong ? hong++ : lanhManh++;
  if (scanHong !== mapHong) lech.push(`[${nhan}] quet=${scanHong} ban do=${mapHong}`);
  // Slug KHONG duoc bien mat: phai o dung MOT o nao do o CA HAI ben
  const oNao = scanHong || scan.groups.gates.some(g => g.slug === "x")
    || scan.groups.inProgress.some(g => g.slug === "x") || scan.groups.done.some(g => g.slug === "x");
  if (!oNao) lech.push(`[${nhan}] slug BIEN MAT khoi bo quet`);
  if (!mapTxt.includes("`x`")) lech.push(`[${nhan}] slug BIEN MAT khoi ban do`);
  return scanHong;
}

// ── Chang 1: TIEU THU — tich Descartes cheo file ──────────────────────────
for (const [cn, ct] of Object.entries(CONTRACT))
for (const [on, ot] of Object.entries(OPP))
for (const [un, ut] of Object.entries(UAT)) {
  // Trục evidence-report nay ĐÃ vào bảng luật (workspace-reader-unification
  // AC-1): chặng 1 giữ evidence lành cho fixture `verified` để các trục khác
  // không bị nhiễu; hình dạng hỏng của evidence đo ở chặng 2 (từ-vựng, suy từ
  // NAV_RULES) và chặng 2b (khai-xong-mà-thiếu-file).
  doiChieu(`contract=${cn} opp=${on} uat=${un}`, { c: ct, o: ot, u: ut,
    evidence: cn === "verified" ? "---\nverdict: PASS\nhuman_signoff:\n---\n" : null });
}
const nChang1 = n;

// ── Chang 2: TU VUNG — tich Descartes tung FIELD, suy tu NAV_RULES ─────────
// Mien gia tri moi field: MOI gia tri hop enum + mot gia tri ngoai tu vung +
// rong + thieu han key. Suy tu bang luat nen them enum/them field la phep do
// tu no rong ra.
const mienGiaTri = rule => [
  ...rule.enum.map(v => [v, v]),
  ["gia-tri-lac", "khong-thuoc-tu-vung"],
  ["rong", ""],
  ["thieu-key", null],
];
const dungFm = vals => "---\n"
  + Object.entries(vals).filter(([, v]) => v !== null).map(([k, v]) => `${k}: ${v}`).join("\n")
  + "\n---\n";
const tichField = file => {
  const fields = Object.entries(NAV_RULES[file]);
  let acc = [{ nhan: [], vals: {} }];
  for (const [field, rule] of fields)
    acc = acc.flatMap(p => mienGiaTri(rule).map(([tenGt, gt]) =>
      ({ nhan: [...p.nhan, `${field}=${tenGt}`], vals: { ...p.vals, [field]: gt } })));
  return acc;
};

// Ngu canh phai BAO DAM file dang do that su duoc TIEU THU — neu khong, ca
// chang 2 lang le do mot workspace ma khong reader nao doc file do, va van
// xanh vinh vien. Nen moi ngu canh bi chinh consumedTexts kiem lai duoi day.
const NGU_CANH = {
  "contract.md": [
    { ten: "mot-minh", khac: { o: null, u: null } },
  ],
  "opportunity.md": [
    { ten: "chua-co-hop-dong", khac: { c: null, u: null } },
    { ten: "da-ky-chua-nghiem-thu", khac: { c: "---\nstatus: signed-off\n---\n", u: "---\nstage: held\nverdict:\n---\n" } },
  ],
  "uat-session.md": [
    { ten: "da-ky", khac: { c: "---\nstatus: signed-off\n---\n", o: "---\nstage: decided\ndecision: build\n---\n" } },
  ],
  // evidence-report tieu thu o implemented/verified (luat chung usesEvidence)
  "evidence-report.md": [
    { ten: "dang-cham", khac: { c: "---\nstatus: implemented\n---\n" } },
    { ten: "cho-ky", khac: { c: "---\nstatus: verified\n---\n" } },
  ],
};
const KHOA = { "contract.md": "c", "opportunity.md": "o", "uat-session.md": "u", "evidence-report.md": "e" };
let nChang2 = 0;
// Rang cua AC-1: them mot file vao bang luat ma khong khai ngu canh tieu thu
// o day la phep do DO ngay, keu dung ten — khong phai TypeError vo danh.
for (const file of Object.keys(NAV_RULES))
  if (!NGU_CANH[file])
    die(`bang luat NAV_RULES co file "${file}" nhung phep do chua co ngu canh tieu thu cho no — them ca truoc khi them luat`);
for (const file of Object.keys(NAV_RULES))
for (const nc of NGU_CANH[file])
for (const { nhan, vals } of tichField(file)) {
  const txt = dungFm(vals);
  const arg = { ...nc.khac, [KHOA[file]]: txt };
  // Doi chung: ngu canh nay CO tieu thu file dang do khong? Luat chung tra loi.
  const daDoc = consumedTexts({ contract: arg.c ?? null, opportunity: arg.o ?? null,
    uat: arg.u ?? null, evidence: arg.e ?? null });
  if (daDoc[file] == null)
    die(`ngu canh "${nc.ten}" KHONG tieu thu ${file} — chang 2 do vao khoang khong`);
  const evMacDinh = /status: verified/.test(arg.c || "") ? "---\nverdict: PASS\nhuman_signoff:\n---\n" : null;
  doiChieu(`${file} @${nc.ten} ${nhan.join(" ")}`, {
    c: arg.c ?? null, o: arg.o ?? null, u: arg.u ?? null,
    evidence: arg.e !== undefined ? arg.e : evMacDinh });
  nChang2++;
}

// ── Chang 2b: khai-xong-ma-thieu-file — hai chieu, ca hai reader ──────────
// verified thieu evidence-report la HONG (missingArtifact); implemented thieu
// la LANH (chua cham lan nao, buoc ke S4). Do CA HAI chieu de luat khong the
// bi noi rong (moi trang thai vang deu hong) hay thu hep (khong ai doi file).
let nChang2b = 0;
{
  const hongV = doiChieu("evidence vang @verified", { c: "---\nstatus: verified\n---\n", o: null, u: null, evidence: null });
  if (!hongV) lech.push("[khai-xong-thieu-file] verified thieu evidence ma KHONG hong");
  else {
    const scan = JSON.parse(execFileSync("node", [SCAN, "--root", tmp], { encoding: "utf8" }));
    const b = scan.broken.find(x => x.slug === "x");
    if (!b || !/thiếu evidence-report/.test(b.reason))
      lech.push(`[khai-xong-thieu-file] ly do sai: ${b && b.reason}`);
  }
  const hongI = doiChieu("evidence vang @implemented", { c: "---\nstatus: implemented\n---\n", o: null, u: null, evidence: null });
  if (hongI) lech.push("[khai-xong-thieu-file] implemented chua cham lan nao ma bi goi la hong");
  nChang2b = 2;
}

// ── Chang 3: DOC DUOC — ho so co mat nhung khong mo duoc ──────────────────
// Hai chang tren chi bien thien NOI DUNG file; chung KHONG BAO GIO dung mot file
// khong doc duoc. Do la truc thu ba: ban do tung nuot MOI loi I/O thanh "file
// vang", nen ho so mat quyen doc bi xep theo artifact BEN CANH (S4-r14).
//
// Ngu canh phai co CHO CHO LOI ROI VAO. Lan dau viet chang nay toi dat file
// hong mot minh — luc do "vang" van ra ho so hong qua luat neo (chi khac ly
// do), hai reader van dong y, va mutation go chot loi VAN XANH. Nen moi ca
// duoi day deu kem mot artifact LANH de duong truot lo ra, dung hinh dang ma
// vong 14 dung lai duoc. Va assert GHIM THONG DIEP: phai la "khong doc duoc",
// khong phai chi "hong o dau do".
const CA_IO = [
  { file: "contract.md",    truot: "Sap mo vong",
    cay: { c: "---\nstatus: approved\n---\n", o: "---\nstage: decided\ndecision: build\n---\n", u: null } },
  { file: "uat-session.md", truot: "Cho phien nghiem thu",
    cay: { c: "---\nstatus: signed-off\n---\n", o: "---\nstage: decided\ndecision: build\n---\n",
           u: "---\nstage: held\nverdict: release\n---\n" } },
  { file: "opportunity.md", truot: "Da giao",
    cay: { c: "---\nstatus: signed-off\n---\n", o: "---\nstage: decided\ndecision: build\n---\n",
           u: "---\nstage: held\nverdict:\n---\n" } },
];
let nChang3 = 0;
for (const { file, truot, cay } of CA_IO) {
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  dat("contract.md", cay.c); dat("opportunity.md", cay.o); dat("uat-session.md", cay.u);
  const p = path.join(dir, file);
  // Doi chung DUONG: cay nay khi doc duoc phai LANH — khong thi ca nay khong
  // phan biet duoc "bat dung loi I/O" voi "von da hong san".
  const truocScan = JSON.parse(execFileSync("node", [SCAN, "--root", tmp], { encoding: "utf8" }));
  if (truocScan.broken.some(b => b.slug === "x"))
    die(`ca I/O ${file}: cay da hong san khi CHUA khoa quyen doc — khong phan biet duoc gi`);
  fs.chmodSync(p, 0o000);
  // Doi chung: chay bang root thi chmod khong chan doc, ca chang do vao khoang
  // khong ma van xanh. Kiem THAT su khong doc duoc, khong thi DUNG.
  let khoaDuoc = false;
  try { fs.readFileSync(p, "utf8"); } catch { khoaDuoc = true; }
  if (!khoaDuoc) { fs.chmodSync(p, 0o644);
    die(`chmod 000 tren ${file} van doc duoc (chay bang root?) — chang DOC DUOC do vao khoang khong`); }

  const scan = JSON.parse(execFileSync("node", [SCAN, "--root", tmp], { encoding: "utf8" }));
  const mapTxt = renderProductMap(tmp);
  fs.chmodSync(p, 0o644);
  n++; hong++;

  const bScan = scan.broken.find(b => b.slug === "x");
  const khoiHong = (mapTxt.split("## Hồ sơ hỏng")[1] || "").split("\n## ")[0];
  const mapHong = khoiHong.includes("`x`");
  if (!bScan) lech.push(`[IO ${file}] bo quet KHONG goi la hong`);
  if (!mapHong) lech.push(`[IO ${file}] ban do KHONG goi la hong — no truot xuong "${truot}" theo artifact ben canh`);
  // Ghim THONG DIEP: "hong vi ly do khac" khong dong nghia bat duoc loi I/O.
  if (bScan && !/không đọc được/.test(bScan.reason))
    lech.push(`[IO ${file}] bo quet goi la hong nhung ly do khong phai loi doc: ${bScan.reason}`);
  if (mapHong && !/không đọc được/.test(khoiHong))
    lech.push(`[IO ${file}] ban do goi la hong nhung ly do khong phai loi doc: ${khoiHong.trim().slice(0, 90)}`);
  nChang3++;
}

if (lech.length) die(`${lech.length}/${n} to hop LECH:\n  ` + lech.slice(0, 8).join("\n  "));
// Doi chung DUONG: phep do phai co ca hai mau, khong duoc toan hong hay toan lanh
if (!hong || !lanhManh) die(`phep do mot mau: hong=${hong} lanh=${lanhManh} — khong phan biet duoc gi`);
console.log(`P123 OK (${n} to hop = ${nChang1} tieu-thu + ${nChang2} tu-vung + ${nChang2b} khai-xong + ${nChang3} doc-duoc, ${hong} hong / ${lanhManh} lanh, hai reader dong y tat ca)`);
P123JS

# ── P124: khoa RONG khong duoc nuot dong ke (lop loi cua reader chung) ─────
# `\s` khop ca xuong dong, nen `^key\s*[:=]\s*(.*)$` doc mot khoa de TRONG ra
# thanh gia tri cua khoa DUOI no. An duoc lau vi moi khuon mau tinh co co
# comment `#` ngay sau khoa rong — fixture o day co Y KHONG co comment do.
run "P124 frontmatterField: khoa rong tra '' chu khong nuot dong ke (S4-r2)" \
  node --input-type=module - "$ROOT" <<'P111JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const path = await import("node:path");
const { createRequire } = await import("node:module");
const require = createRequire(import.meta.url);
const core = require(path.join(root, "lib/evidence-core.cjs"));
const die = m => { console.error(m); process.exit(1); };
const F = core.frontmatterField;

// 1. khoa rong o GIUA frontmatter, KHONG co comment che
const uat = "---\nschema_version: 1\nslug: x\nverdict:\ndecided_by: Manh\ndecided_at: 2026-08-03T00:00:00Z\n---\n# U\n";
if (F(uat, "verdict") !== "") die(`verdict rong doc ra ${JSON.stringify(F(uat, "verdict"))} — dang nuot dong ke`);
if (F(uat, "decided_by") !== "Manh") die("khoa duoi bi anh huong: " + JSON.stringify(F(uat, "decided_by")));

// 2. cung hinh dang tren contract: approved_at rong khong duoc nuot dong duoi
const ct = "---\nstatus: verified\napproved_at:\ntime_human_minutes: {gate1: 0, gate2: 0}\n---\n";
if (F(ct, "approved_at") !== "") die(`approved_at rong doc ra ${JSON.stringify(F(ct, "approved_at"))}`);

// 3. va tren evidence-report: human_signoff rong la truong hop CHUA KY
const ev = "---\nverdict: PASS\nhuman_signoff:\nbypass_used: false\n---\n";
if (F(ev, "human_signoff") !== "") die(`human_signoff rong doc ra ${JSON.stringify(F(ev, "human_signoff"))}`);
if (F(ev, "bypass_used") !== "false") die("khoa duoi human_signoff bi nuot");

// 4. DOI CHUNG DUONG — cac hinh dang khac phai giu nguyen hanh vi
const d = "---\nkey:   co khoang trang\nquoted: \"abc\"\ncmt: val # ghi chu\nonlycmt: # chi comment\ncrlf: x\r\nnhayle: ngan thu ba \"that nhung ngoai hop dong\"\nnhaymo: \"chua dong\nlast:\n---\n";
// nhayle: gia tri KHONG duoc quote nhung ket thuc bang nhay — boc dau/cuoi doc
// lap se an mat ky tu cuoi, va ban do in nguyen van ra cho nguoi doc nen cai
// cut do thanh van ban hong (S4-r5). Chi boc khi CA CAP khop.
const MONG = { key: "co khoang trang", quoted: "abc", cmt: "val", onlycmt: "", crlf: "x",
               nhayle: 'ngan thu ba "that nhung ngoai hop dong"', nhaymo: '"chua dong', last: "" };
for (const [k, v] of Object.entries(MONG))
  if (F(d, k) !== v) die(`hinh dang ${k}: doc ra ${JSON.stringify(F(d, k))}, mong ${JSON.stringify(v)}`);
if (F(d, "khong-co") !== null) die("khoa vang phai tra null");
if (F("khong co frontmatter\n", "key") !== null) die("khong co frontmatter phai tra null");

// 5. Ca DAU-DEN-CUOI: uat-session chua ky (verdict rong, khong comment) phai
// la ho so LANH MANH voi ca hai reader — day la ca that ma nghi thuc sinh ra.
const { recordProblem } = require(path.join(root, "lib/workspace-record.cjs"));
const p = recordProblem({ "contract.md": "---\nstatus: signed-off\n---\n",
                          "opportunity.md": "---\nstage: decided\ndecision: build\n---\n",
                          "uat-session.md": uat });
if (p) die("phien CHUA KY bi goi la ho so hong: " + JSON.stringify(p));
console.log("P124 OK");
P111JS

# ── P125: CHAN HINH cua AC-13 — do bang may, khong giao cho panel judge ────
run "P125 ban do co HINH dan dau, hinh mang so THAT, chu tu viet qua N1/N2/N3 (E17)" \
  node --input-type=module - "$ROOT" <<'P112JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { renderProductMap } = await import(path.join(root, "scripts/product-map.mjs"));
const { fileFromTemplate } = await import(path.join(root, "tests/fixtures/from-template.mjs"));
const R = p => path.join(root, "skills/acceptance/references", p);
const die = m => { console.error(m); process.exit(1); };

// CHAN HINH cua AC-13 — do bang MAY, khong giao cho panel judge. 12 luot cham
// qua 4 vong deu chi soi truc TU VUNG (N1-N6) va bo tron truc HINH, du phep
// thu nhin-thay-hinh nam cung file luat duoc truyen lam input. Phep do nao
// giao cho nguoi cham thi phai cho no mot chan may khong bo qua duoc.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p112-"));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = (slug, status) => fileFromTemplate(R("contract-template.md"),
  "CONTRACT-FRONTMATTER-TEMPLATE",
  { feature: "lam cho nguoi dung " + slug, slug, owner: "o@o", risk_tier: "T2",
    surfaces: "cli", status });
W("_acceptance/config.yaml", "schema_version: 1\n");
W("_acceptance/mot-viec/contract.md", contract("mot-viec", "approved"));
W("_acceptance/viec-da-giao/contract.md", contract("viec-da-giao", "signed-off"));

const out = renderProductMap(tmp);
const dongs = out.split("\n");

// 1. Co HINH, va hinh dung co che cua mat phang "tai lieu trong kho" (mermaid)
const iFence = dongs.findIndex(l => l.trim() === "```mermaid");
if (iFence < 0) die("ban do KHONG co hinh — vi pham N5 o dang thuc (diem quyet dinh vuot nguong 3 buoc / 2 nhanh)");
const iClose = dongs.findIndex((l, i) => i > iFence && l.trim() === "```");
if (iClose < 0) die("khoi hinh khong dong fence");

// 2. HINH DAN DAU: khong duoc co muc danh sach nao truoc no (chu la chu thich)
const iMuc = dongs.findIndex(l => l.startsWith("## "));
if (iMuc >= 0 && iMuc < iFence) die(`muc "${dongs[iMuc]}" dung TRUOC hinh — chu dan dau, sai N5`);

// 3. Hinh phai la HINH cua chinh xuong nay: du chang + du 3 cong nguoi + so THAT
const hinh = dongs.slice(iFence, iClose + 1).join("\n");
for (const cong of ["Cổng Đáng", "Cổng Phạm vi", "Cổng Bằng chứng", "Cổng Giá trị"])
  if (!hinh.includes(cong)) die(`hinh thieu ${cong} — nguoi doc khong thay day du diem dung`);

// 3b. QUAN HE cac canh, khong chi su CO MAT cua cac nut. Dem dung + du nut van
// de lot mot hinh NOI DOI: ban dau hinh ve "Da giao --> Cho phien nghiem thu"
// thanh mot mach, trong khi classify() coi hai o do la HAI KET CUC loai tru
// nhau cua cung Cong Bang chung (duong B/C/E ship thang, khong bao gio chuyen
// sang cho nghiem thu). Nguoi doc thay mot viec da giao dang di tiep toi Cong
// Gia tri — sai (S4-r14). Hinh la mat doc chinh (N5) nen no phai chiu do.
// Bo NHAN nut truoc khi soi canh: `CN["Cho phien...<br/>2 viec"] --> GG`
// van la canh CN->GG, regex bat tren van ban tho se truot vi cai nhan.
const xuong = hinh.replace(/\[[^\]]*\]/g, "").replace(/\{[^}]*\}/g, "");
const canh = (a, b) => new RegExp(`\\b${a}\\s*-->\\s*${b}\\b`).test(xuong);
if (!canh("GB", "DG")) die("hinh: Cong Bang chung khong dan toi 'Da giao'");
if (!canh("GB", "CN")) die("hinh: 'Cho phien nghiem thu' phai la KET CUC cua Cong Bang chung, khong phai chang sau 'Da giao'");
if (canh("DG", "CN")) die("hinh ve 'Da giao --> Cho phien nghiem thu' thanh mach noi tiep — code coi hai o do la hai ket cuc loai tru nhau");
if (!canh("CN", "GG")) die("hinh: 'Cho phien nghiem thu' khong dan toi Cong Gia tri");

// 3c. MOI nhan cong trong hinh phai duoc GIAI NGHIA ngay tren ban do, va phai
// co trong glossary CONTEXT.md. Nhan cong dung mot minh la chu nguoi doc lan
// dau khong suy ra duoc — "Dang" nghia la gi? (N6; hoi dong AC-13b danh FAIL
// dung diem nay o S4-r15). Danh sach cong SUY TU HINH, khong go tay: them cong
// thu nam thi case tu doi giai nghia cho no.
const nhanCong = [...new Set([...hinh.matchAll(/\{"(Cổng [^"]+)"\}/g)].map(m => m[1]))];
if (nhanCong.length < 4) die(`bo dem tinh tao: quet ra ${nhanCong.length} nhan cong trong hinh — mong >=4`);
const ctx = fs.readFileSync(path.join(root, "CONTEXT.md"), "utf8");
const sauHinh = out.slice(out.indexOf("```", out.indexOf("```mermaid") + 3));
for (const cong of nhanCong) {
  // Giai nghia = ten cong xuat hien LAI ngoai hinh, kem mot cau hoi.
  const i = sauHinh.indexOf(cong);
  if (i < 0) die(`ban do co nhan "${cong}" trong hinh ma khong giai nghia o dau ca — nguoi doc lan dau khong suy ra duoc`);
  if (!/(không|chưa|gì)\b/.test(sauHinh.slice(i, i + 120)))
    die(`"${cong}" duoc nhac lai nhung khong kem CAU HOI no hoi — nhac ten khong phai giai nghia`);
  if (!ctx.includes(cong))
    die(`CONTEXT.md khong co muc cho "${cong}" — dat ten mat nguoi moi ma khong vao glossary (N6)`);
}
if (!/Đang làm<br\/>1 việc/.test(hinh)) die("hinh khong mang SO THAT cua xuong (1 viec dang lam): " + hinh);
if (!/Đã giao<br\/>1 việc/.test(hinh)) die("hinh khong mang SO THAT cua xuong (1 viec da giao)");
if (!/chưa có/.test(hinh)) die("chang rong phai noi 'chua co', khong duoc de trong");

// 4. Doi chung DUONG: so trong hinh doi theo ho so, khong phai chuoi ghim cung
W("_acceptance/viec-thu-hai/contract.md", contract("viec-thu-hai", "approved"));
if (!/Đang làm<br\/>2 việc/.test(renderProductMap(tmp)))
  die("them mot viec ma so trong hinh khong doi — hinh la chuoi chet, khong phai hinh cua xuong");

// 5. Chu do bo sinh TU VIET: chu ngu khong phai may, duong dan khong lam chu ngu
const ghiChu = dongs.filter(l => l.startsWith("> ")).join(" ");
if (!ghiChu) die("thieu dong ghi chu dau ban do");
if (/^> Máy sinh/.test(dongs.find(l => l.startsWith("> ")) || "")) die("cau ghi chu lay MAY lam chu ngu — N1");
const cauChinh = (dongs.find(l => l.startsWith("> ")) || "");
if (/`_acceptance\/`/.test(cauChinh)) die("duong dan nam trong cau chinh — N2 doi no xuong chu thich");

// 6. Ten o KHONG goi ten co che may
for (const l of dongs.filter(l => l.startsWith("## ")))
  if (/nghiệm thu máy|start-scan|frontmatter|_acceptance/.test(l))
    die(`ten muc goi ten co che may: ${l}`);

// 7. Moi dong viec: TEN VIEC truoc, slug la ma TRA CUU trong ngoac (N3)
const dongViec = dongs.filter(l => l.startsWith("- ") && l.includes("(`"));
if (!dongViec.length) die("khong co dong viec nao de soi");
for (const l of dongViec) {
  const m = l.match(/^- (.+) \(`([a-z0-9-]+)`\)/);
  if (!m) die(`dong khong theo khuon "ten viec (slug)": ${l}`);
  if (m[1].startsWith("**")) die(`dong con in dam ca cau: ${l}`);
  if (m[1] === m[2]) die(`ten viec chi la slug lap lai: ${l}`);
}
console.log("P125 OK");
P112JS

# ── P126: mien tru PRODUCT-MAP.md chi hop le khi con cong doc lap canh ────
run "P126 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)" \
  python3 - "$ROOT" <<'P113PY'
import re, subprocess, sys
from pathlib import Path
root = Path(sys.argv[1])

# 1. PRODUCT-MAP.md nam TRONG t1_skip_globs (do QUAN HE: rut dung danh sach)
cfg = (root / "_acceptance/config.yaml").read_text(encoding="utf-8")
def globs(txt, key):
    out, inside = [], False
    for ln in txt.splitlines():
        if ln.strip() == key + ":": inside = True; continue
        if inside:
            s = ln.strip()
            if s.startswith('- '): out.append(s[2:].strip().strip('"'))
            elif s and not s.startswith('#'): break
    return out
t1 = globs(cfg, "t1_skip_globs")
assert "PRODUCT-MAP.md" in t1, f"PRODUCT-MAP.md chua duoc mien tru (thay: {t1})"

# 2. Mien tru chi hop le VI co cong doc lap canh — doi chung DUONG rooi tiem:
#    ban do khop -> --check XANH; tiem lech -> --check DO. Khong co ve nay thi
#    mien tru bien mot view may sinh thanh vung khong ai kiem.
def check():
    return subprocess.run(["node", "scripts/product-map.mjs", "--root", ".", "--check"],
                          cwd=root, capture_output=True, text=True)
r = check()
assert r.returncode == 0, f"doi chung duong hong: ban do cua kit dang lech san ({r.stderr.strip()})"

# Pha vat that trong mot BAN SAO, khong pha tai cho: suite bi Ctrl-C giua hai
# lenh ghi se de lai cay lam viec ban voi mot dong bia trong artifact may sinh
# DA COMMIT — va vi ban do vua vao t1_skip_globs, dong bia do khong kich hoat
# cong nao ngoai chinh --check (doctrine CLAUDE.md; chinh case nay vi pham no
# o S4-r5).
import shutil, tempfile
tmp = Path(tempfile.mkdtemp(prefix="p113-"))
try:
    shutil.copytree(root / "_acceptance", tmp / "_acceptance")
    if (root / ".out-of-scope").is_dir():
        shutil.copytree(root / ".out-of-scope", tmp / ".out-of-scope")
    shutil.copy2(root / "PRODUCT-MAP.md", tmp / "PRODUCT-MAP.md")
    def check_tmp():
        return subprocess.run(["node", str(root / "scripts/product-map.mjs"), "--root", str(tmp), "--check"],
                              cwd=root, capture_output=True, text=True)
    assert check_tmp().returncode == 0, "ban sao nguyen ven da lech san — doi chung duong hong"
    (tmp / "PRODUCT-MAP.md").write_text(
        (tmp / "PRODUCT-MAP.md").read_text(encoding="utf-8") + "\n- viec bia dat\n", encoding="utf-8")
    r2 = check_tmp()
    assert r2.returncode != 0, "sua tay ban do ma --check VAN xanh — mien tru dang che mot vung khong ai canh"
    assert "lệch với hồ sơ xưởng" in r2.stderr, f"thong diep khong khop khuon ghim: {r2.stderr}"
finally:
    shutil.rmtree(tmp, ignore_errors=True)
assert check().returncode == 0, "cay lam viec that phai KHONG bi cham"

# 3. Cong do PHAI chay trong CI, khong chi trong suite verify cua feature-loop
ci = (root / ".github/workflows/gate.yml").read_text(encoding="utf-8")
assert "product-map.mjs --root . --check" in ci, \
    "gate.yml khong chay --check — mien tru mat can cu (khong con cong nao canh o moi PR)"

# 4. Mien tru KHONG duoc lan sang path khac o goc repo
for xau in [".github/**", ".claude-plugin/plugin.json"]:
    assert xau not in t1, f"{xau} da bi nuot vao t1_skip_globs — de xuat nay DA BI TU CHOI (.out-of-scope/)"

# 5a. KHONG hai ADR nao duoc trung so — dinh danh trung lam hong chinh chuc
#     nang tra nguoc ma ADR ton tai de phuc vu (vong nay tung dam: file moi lay
#     lai so 0003 trong khi 0003 da thuoc mot quyet dinh khac).
import collections
sos = collections.defaultdict(list)
for f in sorted((root / "docs/adr").glob("*.md")):
    m = re.match(r"^(\d{4})-", f.name)
    assert m, f"ten ADR khong theo khuon NNNN-...: {f.name}"
    sos[m.group(1)].append(f.name)
trung = {k: v for k, v in sos.items() if len(v) > 1}
assert not trung, f"ADR trung so: {trung}"

# 5b. Quyet dinh chinh sach nay phai co ADR
adr = root / "docs/adr/0007-product-map-t1-exemption.md"
assert adr.is_file(), "thieu ADR cho mot lan noi danh sach mien tru"
at = adr.read_text(encoding="utf-8")
for needle in ["PRODUCT-MAP.md", "--check", "t1-skip-globs-github-and-manifests"]:
    assert needle in at, f"ADR khong neu {needle}"
P113PY

# ── P127: cai gi BAT consumer commit thi phai PHAT kem mien tru + cong canh ─
run "P127 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)" \
  python3 - "$ROOT" <<'P114PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])

# Than lenh cong NAO bat repo tieu thu commit ban do?
BODIES = ["commands/approve.md", "commands/signoff.md"]
bat_commit = [b for b in BODIES if "PRODUCT-MAP.md" in (root / b).read_text(encoding="utf-8")]
assert bat_commit, "doi chung duong hong: khong than lenh nao nhac PRODUCT-MAP.md"

# ... thi KHUON config ma acceptance-init phat cho ho phai co CA HAI:
#   (a) mien tru t1 — thieu no thi chinh commit chu ky lam evidence stale va
#       pre-merge chan merge, thanh vong khong thoat (ADR 0007);
#   (b) executor canh — ADR 0007 noi mien tru CHI an toan khi con cong doc lap.
# Thieu mot trong hai la kit phat cho consumer mot cai bay ma chinh kit da
# dam phai o S4-r4 va da ghi ADR de khoi ai dam lai.
INITS = ["commands/acceptance-init.md"]
for rel in INITS:
    txt = (root / rel).read_text(encoding="utf-8")
    assert re.search(r'^\s*-\s*"PRODUCT-MAP\.md"\s*$', txt, re.M), \
        f"{rel}: khuon config KHONG phat mien tru PRODUCT-MAP.md — consumer se ket merge ngay lan ky dau ({bat_commit} bat ho commit no)"
    assert re.search(r'^\s*product_map:\s*"', txt, re.M), \
        f"{rel}: khuon config KHONG phat executors.script.product_map — mien tru mat cong canh (ADR 0007)"

# Doi chung AM: go dong mien tru khoi mot ban sao thi phep do phai DO
mut = re.sub(r'^\s*-\s*"PRODUCT-MAP\.md"\s*$', "", (root / INITS[0]).read_text(encoding="utf-8"), flags=re.M)
assert not re.search(r'^\s*-\s*"PRODUCT-MAP\.md"\s*$', mut, re.M), "buoc tiem chua bao gio chay"

# ADR 0007 phai noi ro dieu kien an toan de nguoi sau khong noi mien tru mu quang
adr = (root / "docs/adr/0007-product-map-t1-exemption.md").read_text(encoding="utf-8")
assert "--check" in adr, "ADR 0007 khong neu cong canh"

#     Dau hieu cua THAN CONG (khac khuon init): no RA LENH ve lai ban do —
#     `--root .` KHONG kem `--check`. Khuon acceptance-init cung nhac script
#     nhung chi de phat mot dong config dang `--check`, no khong ky gi ca nen
#     khong can duong doc-cu.
RE_REGEN = re.compile(r"product-map\.mjs --root \.(?!\s*--check)")
THAN = sorted(
    p.relative_to(root).as_posix()
    for d in ("commands", "skills")
    for p in (root / d).rglob("*.md")
    if RE_REGEN.search(p.read_text(encoding="utf-8"))
)
# Bo dem tinh tao: 0 hit gan nhu luon la grep hong, khong phai "khong co than".
# San dat theo hai than cong (approve/signoff) + nghi thuc nghiem thu; ha san
# ma khong noi ly do la cach re nhat de "0 hit" doc thanh sach.
assert len(THAN) >= 3, f"quet ra {len(THAN)} than cong co buoc regen — mong >=3, nghi buoc quet hong: {THAN}"
for rel in THAN:
    body = (root / rel).read_text(encoding="utf-8")
    assert "t1_skip_globs" in body, f"{rel}: khong doc t1_skip_globs — khong co duong doc-cu"
    # Chuan hoa khoang trang TRUOC khi soi: loi hua la "than co neu dieu kien
    # phu dinh", khong phai "chuoi nam gon mot dong" — van xuoi xuong dong theo
    # do rong cot, do nguyen van la do TU VUNG chu khong do QUAN HE.
    flat = re.sub(r"\s+", " ", body)
    assert re.search(r"(SKIP|BỎ QUA|Bật bằng hai dòng|opt-in note)", flat), \
        f"{rel}: khong co nhanh bo qua + ghi chu bat cho repo chua bat ban do"
    # Chieu phai dung: CHUA co trong t1_skip_globs -> SKIP. Dao nghia ("moi repo
    # phai migrate") giu nguyen tu vung nen kiem su-co-mat khong bat duoc (M5).
    assert re.search(r"(NOT listed|không có|NOT in|chưa bật)", flat), \
        f"{rel}: nhanh doc-cu khong neu dieu kien PHU DINH (chua co trong t1_skip_globs)"
    # ... va khong duoc de mot dong nao BAT commit ban do vo dieu kien: tren
    # repo chua opt-in file do khong ton tai, `git add` chet giua nghi thuc ky.
    for dong in body.splitlines():
        if "PRODUCT-MAP.md" not in dong: continue
        s = dong.strip()
        # Nguy hiem la LENH COPY-PASTE DUOC neu ten mot file co the khong ton
        # tai (repo chua opt-in) — `git add` chet pathspec giua nghi thuc ky.
        # Cau van xuoi CO DIEU KIEN ("Repo opted in -> append ...") thi khong
        # phai lenh, va no chinh la thu ta muon co.
        if s.startswith("git add "):
            raise AssertionError(
                f"{rel}: LENH git-add ghim san ban do (repo chua opt-in se chet pathspec): {s[:90]}")
        if "Offer ONE commit" in s and "ONLY" not in s:
            raise AssertionError(
                f"{rel}: dong 'Offer ONE commit' keo ban do vao vo dieu kien: {s[:90]}")

# (e) MOI khuon co marker trich xuat phai DAN dung chep marker + hang rao.
#     Marker + ```yaml ton tai vi TEST can rut khuon may-doc; nguoi chep nguyen
#     van thi dong dau file la ```yaml, `^---` khong khop, va MOI reader goi ho
#     so do la hong. contract-template co loi dan tu dau, uat/opportunity thi
#     khong (S4-r13) — cung mot lop, sua theo lop: danh sach lay bang QUET
#     chinh cac file CO marker, nen khuon thu tu them sau nay tu dong bi do.
REF = root / "skills/acceptance/references"
KHUON = sorted(p.relative_to(root).as_posix() for p in REF.rglob("*.md")
               if re.search(r"<<<[A-Z0-9-]+-FRONTMATTER-TEMPLATE", p.read_text(encoding="utf-8")))
assert len(KHUON) >= 3, f"quet ra {len(KHUON)} khuon co marker — mong >=3, nghi buoc quet hong: {KHUON}"
for rel in KHUON:
    flat = re.sub(r"\s+", " ", (root / rel).read_text(encoding="utf-8"))
    assert re.search(r"(Do NOT copy|ĐỪNG chép)", flat), \
        f"{rel}: co marker trich xuat ma khong dan 'dung chep marker' — nguoi chep nguyen van se tao ho so hong"
    assert re.search(r"(fence|hàng rào)", flat), \
        f"{rel}: loi dan khong neu ca HANG RAO ```yaml — chep thieu moi dong ```yaml van du lam hong ho so"
P114PY

# ── P128: tai lieu nguoi-doc phai theo kip be mat 1.31.0, va khong duoc hua
#         mot khoa dau ra ma bo quet khong con phat ──────────────────────────
run "P128 3 tai lieu co be mat 1.31.0 + khong hua khoa dau ra da go (E11,E18)" \
  python3 - "$ROOT" <<'P128PY'
import json, re, subprocess, sys
from pathlib import Path
root = Path(sys.argv[1])
DOCS = ["README.md", "GUIDE.md", "QUICKSTART.md"]

# (a) Be mat 1.31.0 phat cho repo tieu thu la NGUOI dung thay: mot file moi o
#     goc repo ma cong tu commit vao, va mot nghi thuc nguoi moi. Tien le ngay
#     tren cung file: 1.30.0 (/start) co muc rieng va P101 ghim no. Thieu muc
#     thi nguoi gap ghi chu "Ban do san pham chua bat cho repo nay" do /approve
#     in ra ma khong co cho nao tra tiep (S4-r14).
for rel in DOCS:
    t = (root / rel).read_text(encoding="utf-8")
    assert "PRODUCT-MAP.md" in t, f"{rel}: khong nhac PRODUCT-MAP.md — mot file moi o goc repo ma tai lieu khong ta"
    assert re.search(r"(uat-session|Cổng Giá trị|UAT session)", t), \
        f"{rel}: khong nhac phien nghiem thu / Cong Gia tri — mot nghi thuc NGUOI moi ma tai lieu khong ta"
    # Mien tru t1 la thu de nguoi giat minh nhat ("sao ban do khong qua cong?"),
    # nen phai co duong tra: it nhat mot doc noi ro no + cai canh no.
docs_all = "\n".join((root / r).read_text(encoding="utf-8") for r in DOCS)
assert "t1_skip_globs" in docs_all and "0007" in docs_all, \
    "khong doc nao noi vi sao ban do duoc mien cong + tro toi ADR 0007"

# (b) QUAN HE, khong phai danh sach cam: tai lieu chi duoc hua nhung khoa dau ra
#     ma bo quet THAT SU phat. `skipped[]` bi go o F-B; neu ai do them lai thi
#     assert nay TU NOI LONG, khong phai sua test. (Blacklist tren khong gian mo
#     thi va-roi-lai-thung; ghim quan he thi khong.)
out = json.loads(subprocess.run(["node", str(root / "scripts/start-scan.mjs"), "--root", str(root)],
                                capture_output=True, text=True, check=True).stdout)
khoa_that = set(out.keys()) | set(out.get("groups", {}).keys())
assert "broken" in khoa_that and "map" in khoa_that, f"bo dem tinh tao: dau ra scan la {sorted(khoa_that)} — nghi buoc chay hong"
BODIES = DOCS + ["scripts/start-scan.mjs", "commands/start.md"]
for rel in BODIES:
    t = (root / rel).read_text(encoding="utf-8")
    for m in re.finditer(r"(?<![A-Za-z_])(\w+)\[\]", t):
        khoa = m.group(1)
        if khoa in khoa_that: continue
        # Cho phep noi ve no trong cau GIAI THICH rang no da bi go.
        dong = t[t.rfind("\n", 0, m.start()) + 1 : t.find("\n", m.end())]
        # Cua so +-200 ky tu, khong phai MOT dong: van xuoi xuong dong theo do
        # rong cot nen cau "khoa do da GO HAN" thuong nam o dong ke.
        cua_so = t[max(0, m.start() - 200) : m.end() + 200]
        if re.search(r"(đã (được )?(GỠ|gỡ)|không còn|bị gỡ|removed)", cua_so): continue
        raise AssertionError(
            f"{rel}: hua khoa dau ra `{khoa}[]` ma bo quet khong phat ({sorted(khoa_that)}) — dong: {dong.strip()[:100]}")
print("P128 OK (3 tai lieu co be mat 1.31.0; khoa dau ra khop dau ra THAT)")
P128PY

# ── P129: canh + ten viec phai song ca khi ho so KHONG duoc tieu thu ────────
# Hai cau hoi khac nhau: PHAN O (ho so nao quyet dinh o cua slug) va HIEN THI
# (ten viec + cac canh lay o dau). S4-r14 gop lam mot, nen suot ca pha dung
# (draft->verified) ban do mat ten viec lan moi canh cua ho so kham pha: `epic:`
# duoc khai luc kham pha, tuc nam trong opportunity.md, ma opportunity CHI duoc
# tieu thu khi chua co hop dong hoac da ky. Moi case canh cu deu dat canh trong
# file DUOC tieu thu nen khong thay gi (S4-r15).
run "P129 canh + ten viec doc tu ho so KHONG tieu thu; loi doc o do khong lam hong slug (E5)" \
  node --input-type=module - "$ROOT" <<'P129JS'
const root = process.argv[2];
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { renderProductMap } = await import(path.join(root, "scripts/product-map.mjs"));
const die = m => { console.error(m); process.exit(1); };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p129-"));
const dir = path.join(tmp, "_acceptance", "x");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(tmp, "_acceptance/config.yaml"), "schema_version: 1\n");
fs.writeFileSync(path.join(dir, "opportunity.md"),
  "---\nstage: discovery\nfeature: Ban do gia tri\nepic: EP-1\nrelates: y\n---\n");

// MOI trang thai hop dong — ke ca nhung trang thai KHONG tieu thu opportunity.
// Doi chung duong nam ngay trong bang: `draft` KHONG tieu thu opportunity va
// phai cho ket qua giong "(khong co hop dong)" la trang thai CO tieu thu.
for (const st of [null, "draft", "approved", "implemented", "verified", "signed-off"]) {
  const cp = path.join(dir, "contract.md");
  if (st == null) { if (fs.existsSync(cp)) fs.unlinkSync(cp); }
  else fs.writeFileSync(cp, "---\nstatus: " + st + "\n---\n");
  // verified tieu thu evidence tu 1.38.0 — cap ban lanh de truc dang do
  // (canh/ten viec) khong bi nhieu boi luat khai-xong-ma-thieu-file
  const ep = path.join(dir, "evidence-report.md");
  if (st === "verified") fs.writeFileSync(ep, "---\nverdict: PASS\nhuman_signoff:\n---\n");
  else if (fs.existsSync(ep)) fs.unlinkSync(ep);
  const dong = renderProductMap(tmp).split("\n").find(l => l.includes("`x`")) || "";
  if (!dong.includes("epic: EP-1") || !dong.includes("liên quan: y"))
    die("status=" + st + ": canh bien mat khoi ban do — \"" + dong.trim()
      + "\" (canh khai o opportunity.md, ho so KHONG duoc tieu thu o trang thai nay)");
  if (!dong.includes("Ban do gia tri"))
    die("status=" + st + ": ten viec bien mat, chi con slug tran — \"" + dong.trim() + "\"");
}

// Loi DOC o ho so khong tieu thu chi lam mat phan hien thi cua no, KHONG duoc
// lam hong slug — phep doc luoi phai con nguyen.
fs.writeFileSync(path.join(dir, "contract.md"), "---\nstatus: draft\nfeature: viec x\n---\n");
const op = path.join(dir, "opportunity.md");
fs.chmodSync(op, 0o000);
let khoaDuoc = false;
try { fs.readFileSync(op, "utf8"); } catch { khoaDuoc = true; }
if (!khoaDuoc) { fs.chmodSync(op, 0o644); die("chmod 000 van doc duoc (chay bang root?) — chan nay do vao khoang khong"); }
const out = renderProductMap(tmp);
fs.chmodSync(op, 0o644);
if ((out.split("## Hồ sơ hỏng")[1] || "").includes("`x`"))
  die("loi doc o ho so KHONG tieu thu lai lam hong slug — mat phep doc luoi");
if (!out.includes("viec x")) die("ten viec tu contract.md bien mat khi opportunity khong doc duoc");
console.log("P129 OK (6 trang thai giu canh + ten; loi doc o ho so khong tieu thu khong lam hong slug)");
P129JS

# ── P130: hai ben doc t1_skip_globs (JS configList vs ban bash cua pre-merge) ─
# Cung mot khoa co BA ban doc trong repo: configList (JS), sed trong
# pre-merge-check.sh, va loi dan van xuoi o nam than cong nguoi. Ban dau
# map.enabled dung regex quet ca file nen sai hai chieu — comment duoi dong
# thanh "chua bat", va cung chuoi nam duoi t3_paths thanh "da bat" (S4-r15).
run "P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)" \
  python3 - "$ROOT" <<'P130PY'
import json, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
BASH = (
  "sed -n '/^  t1_skip_globs:/,/^  [a-zA-Z0-9_-]*:/p' \"$1\" \\\n"
  "  | sed -n 's/^[[:space:]]*-[[:space:]]*//p' \\\n"
  "  | sed -e 's/[[:space:]]*#.*$//' -e 's/^\"//' -e 's/\"$//' -e \"s/^'//\" -e \"s/'\\$//\" -e 's/[[:space:]]*$//'\n")
JS = (
  "const { configList } = require(process.argv[2]);\n"
  "const fs = require('node:fs');\n"
  "console.log(JSON.stringify(configList(fs.readFileSync(process.argv[3], 'utf8'), 't1_skip_globs')));\n")
HINH = [
  'risk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n',
  'risk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"   # ban do may sinh\n',
  "risk_tiers:\n  t1_skip_globs:\n    - 'PRODUCT-MAP.md'\n",
  'risk_tiers:\n  t1_skip_globs:\n    - PRODUCT-MAP.md\n',
  'risk_tiers:\n  t3_paths:\n    - "PRODUCT-MAP.md"\n',
  'risk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n  t3_paths:\n    - "PRODUCT-MAP.md"\n',
  'risk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "PRODUCT-MAP.md"\n  t3_paths:\n    - "src/**"\n',
  'risk_tiers:\n  t1_skip_globs: []\n',
  '',
  # key-line-comment — bug round 16 product-map-uat-session: dong KHOA mang
  # comment duoi, ban bash doc duoc con configList tra rong. RED case Notes
  # cua contract workspace-reader-unification dan them.
  'risk_tiers:\n  t1_skip_globs:   # ban do may sinh\n    - "PRODUCT-MAP.md"\n',
  'risk_tiers:\n  t1_skip_globs:  \n    - "PRODUCT-MAP.md"\n',
]
lech, co = [], 0
with tempfile.TemporaryDirectory() as td:
    jsf = Path(td, "r.js"); jsf.write_text(JS)
    shf = Path(td, "r.sh"); shf.write_text(BASH)
    for i, h in enumerate(HINH):
        cfg = Path(td, "c%d.yaml" % i); cfg.write_text("schema_version: 1\n" + h)
        js = json.loads(subprocess.run(["node", str(jsf), str(root / "lib/workspace-record.cjs"), str(cfg)],
                                       capture_output=True, text=True, check=True).stdout)
        sh = [l for l in subprocess.run(["bash", str(shf), str(cfg)],
                                        capture_output=True, text=True).stdout.split("\n") if l]
        if js != sh:
            lech.append("  hinh %d: js=%s bash=%s\n    %r" % (i, js, sh, h))
        if "PRODUCT-MAP.md" in js:
            co += 1
assert not lech, "hai ben doc t1_skip_globs KHONG dong y:\n" + "\n".join(lech)
assert 0 < co < len(HINH), "phep do mot mau: %d/%d hinh co PRODUCT-MAP — khong phan biet duoc gi" % (co, len(HINH))

# Do HAM dung chung thoi thi chua du: bo quet co the ngung goi no ma van xanh
# (M15). Ghim QUAN HE tren VAT DUOC GIAO — `map.enabled` trong dau ra THAT cua
# start-scan phai bang ket luan cua luat chung tren cung file config.
lech2 = []
with tempfile.TemporaryDirectory() as td:
    ws = Path(td, "ws"); (ws / "_acceptance" / "x").mkdir(parents=True)
    (ws / "_acceptance" / "x" / "contract.md").write_text("---\nstatus: draft\n---\n")
    jsf = Path(td, "r.js"); jsf.write_text(JS)
    for i, h in enumerate(HINH):
        cfg = ws / "_acceptance" / "config.yaml"; cfg.write_text("schema_version: 1\n" + h)
        mong = "PRODUCT-MAP.md" in json.loads(subprocess.run(
            ["node", str(jsf), str(root / "lib/workspace-record.cjs"), str(cfg)],
            capture_output=True, text=True, check=True).stdout)
        that = json.loads(subprocess.run(["node", str(root / "scripts/start-scan.mjs"), "--root", str(ws)],
                                         capture_output=True, text=True, check=True).stdout)["map"]["enabled"]
        if that is not mong:
            lech2.append("  hinh %d: map.enabled=%r nhung luat chung noi %r\n    %r" % (i, that, mong, h))
assert not lech2, "map.enabled KHONG khop luat chung (bo quet dang tu doc config?):\n" + "\n".join(lech2)
print("P130 OK (%d hinh dang config, %d co / %d khong; hai ben doc dong y VA map.enabled bam luat chung)" % (len(HINH), co, len(HINH) - co))
P130PY

# ── P131: khuôn CI trong doc — MỌI lời gọi pre-merge-check.sh phải mang --base,
# và file nào dạy snippet GitHub Actions phải dạy kèm fetch-depth: 0 ───────────
# Lớp lỗi: doc trôi khỏi vật theo TỪNG FILE — GUIDE dạy đúng khuôn 2 bước còn
# README/QUICKSTART dạy dạng không-base (răng T1-escape + gap-probe cùng
# declared-off). Đo QUAN HỆ trên toàn bộ lời gọi, không grep một chuỗi một chỗ.
run "P131 khuon CI: moi loi goi pre-merge-check.sh trong doc mang --base + fetch-depth di kem" \
  python3 - "$ROOT" <<'P131PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
DOCS = ["README.md", "QUICKSTART.md", "GUIDE.md"]

def check(docs):                          # {ten: noi dung} -> list loi
    errs, n_invocations = [], 0
    for name, text in docs.items():
        # Moi dong GOI script tren repo root (`pre-merge-check.sh .`) — ke ca
        # dang inline-code trong cau van. Dong chi NHAC TEN file (copy list,
        # bang mo ta) khong phai loi goi, khong tinh.
        calls = [l for l in text.splitlines() if re.search(r"pre-merge-check\.sh\s+\.", l)]
        n_invocations += len(calls)
        for l in calls:
            if "--base" not in l:
                errs.append(f"{name}: loi goi thieu --base: {l.strip()[:80]}")
        # Quan he trong cung mot file: day snippet Actions thi phai day ca
        # fetch-depth: 0 — thieu no, --base khong resolve tren shallow clone
        # mac dinh cua actions/checkout (GUIDE §5.3 ta dung bay nay).
        if any("- run:" in l for l in calls) and "fetch-depth: 0" not in text:
            errs.append(f"{name}: co snippet Actions goi pre-merge-check.sh nhung thieu fetch-depth: 0")
    # Sanity counter (0 hit thuong la grep hong): 3 doc phai co it nhat 3 loi goi.
    if n_invocations < 3:
        errs.append(f"sanity: chi thay {n_invocations} loi goi trong {DOCS} — bo quet hong?")
    return errs

live = {d: (root / d).read_text(encoding="utf-8") for d in DOCS}
assert check(live) == [], check(live)                    # doi chung DUONG
# Dot bien theo TUNG file: xoa --base khoi mot loi goi → DO dung file, khong bao oan.
for gone in DOCS:
    if not re.search(r"pre-merge-check\.sh\s+\.", live[gone]):
        continue
    mut = dict(live)
    mut[gone] = re.sub(r"(pre-merge-check\.sh\s+\.)[^\n]*--base\S*\s*(\"[^\"]*\")?",
                       r"\1", live[gone])
    errs = check(mut)
    assert any(x.startswith(f"{gone}: loi goi thieu --base") for x in errs), \
        f"dot bien xoa --base khoi {gone} khong bi bat: {errs}"
    assert all(not x.startswith(f"{o}:") for x in errs for o in DOCS if o != gone), \
        f"dot bien tren {gone} lam bao oan file khac: {errs}"
# Dot bien fetch-depth: file co snippet Actions mat dong checkout → DO dung thong diep.
for name in DOCS:
    if "- run:" not in live[name] or "fetch-depth: 0" not in live[name]:
        continue
    mut = dict(live)
    mut[name] = live[name].replace("fetch-depth: 0", "fetch-depth-DA-XOA")
    errs = check(mut)
    assert any("thieu fetch-depth" in x and x.startswith(name) for x in errs), \
        f"dot bien xoa fetch-depth khoi {name} khong bi bat: {errs}"
print("P131 OK")
P131PY

# ── P132: khối pilot-mode README phải symlink ĐỦ MỌI lệnh trong commands/ ─────
# Ma trận toàn phần suy từ vật thật (ls commands/*.md), không phải danh sách
# đóng chép tay — thêm lệnh mới mà quên pilot block là case này đỏ.
run "P132 pilot block README symlink du moi lenh commands/*.md" \
  python3 - "$ROOT" <<'P132PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
cmds = sorted(p.name for p in (root / "commands").glob("*.md"))
assert len(cmds) >= 7, f"sanity: chi thay {len(cmds)} lenh trong commands/ — bo quet hong?"
readme = (root / "README.md").read_text(encoding="utf-8")

def check(text):
    return [c for c in cmds if f"ln -s <kit>/commands/{c}" not in text]

missing = check(readme)
assert missing == [], \
    "pilot block README thieu symlink cho: " + ", ".join(missing) + \
    " — nguoi pilot theo README se thieu lenh nay trong phien"
# Dot bien: xoa mot dong symlink bat ky → DO dung ten lenh do.
victim = cmds[0]
mut = "\n".join(l for l in readme.splitlines() if f"commands/{victim}" not in l)
assert check(mut) == [victim], f"dot bien xoa symlink {victim} khong bi bat dung cho: {check(mut)}"
print(f"P132 OK ({len(cmds)} lenh deu co mat)")
P132PY

# ── P133: ghim phần CHỮ của gói first-run — lời khuyên recheck, jsdom, attribution ─
# Ba pin văn xuôi (khuôn P44): chữ là hành vi thật ở repo này, không phải trang trí.
run "P133 chu first-run: recheck-advice khop init + jsdom o 3 diem init + attribution /start=v1.30" \
  python3 - "$ROOT" <<'P133PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
errs = []
# 1. README: lời khuyên recheck phải khớp thứ init thật sự phát (strict), và
#    câu cũ "advisory by default" (mô tả một trạng thái init không bao giờ tạo) phải biến mất.
readme = (root / "README.md").read_text(encoding="utf-8")
if "scaffolds `recheck: strict`" not in readme:
    errs.append("README: mat cau init-phat-strict")
if "advisory by default" in readme:
    errs.append("README: cau cu 'advisory by default' quay lai — nguoc voi scaffold cua init")
# 2. jsdom phải có mặt ở CẢ 3 điểm init (Claude acceptance-init, design-init 2 harness) —
#    thiếu nó mọi design eval BLOCKED (design-gate.mjs DOM mode).
for rel in ["commands/acceptance-init.md"]:
    if "jsdom" not in (root / rel).read_text(encoding="utf-8"):
        errs.append(f"{rel}: mat loi nhac jsdom")
# 3. Manifest Claude: /start thuộc v1.30 (ship 3187b6e), không được trôi về entry khác.
desc = json.loads((root / ".claude-plugin/plugin.json").read_text(encoding="utf-8"))["description"]
i29, i30, istart = desc.find("v1.29:"), desc.find("v1.30:"), desc.find("/start session-entry")
if i30 < 0:
    errs.append("manifest: mat entry v1.30")
elif not (0 <= i29 < i30 <= istart):
    errs.append("manifest: '/start session-entry' khong nam trong entry v1.30 (attribution troi)")
assert errs == [], errs                                   # doi chung DUONG
# Dot bien tung pin → DO dung thong diep (kiem bang cach chay lai logic tren van ban da pha)
def run_pin1(text):
    out = []
    if "scaffolds `recheck: strict`" not in text: out.append("mat cau init-phat-strict")
    if "advisory by default" in text: out.append("cau cu quay lai")
    return out
assert run_pin1(readme.replace("scaffolds `recheck: strict`", "scaffolds nothing")), "dot bien pin1a khong do"
assert run_pin1(readme + "\nThat re-check is advisory by default."), "dot bien pin1b khong do"
mut_desc = desc.replace("v1.30: /start session-entry", "v1.29-again: /start session-entry")
assert mut_desc.find("v1.30:") < 0 or not (0 <= mut_desc.find("v1.29:") < mut_desc.find("v1.30:") <= mut_desc.find("/start session-entry")), \
    "dot bien attribution khong do"
print("P133 OK (3 pin chu + dot bien deu do dung cho)")
P133PY

# --- context-ladder cases (P134-P141) begin ---
# Truc ngu canh cho ban mau (contract _acceptance/context-ladder): writer khai
# context: 3 nac trong khuon marker, reader gate-card render nac + co vang,
# generic moi repo. Moi case am co DOI CHUNG DUONG + ghim dung thong diep;
# fixture rut tu khuon writer bang code (bat bien CLAUDE.md).

run "P134 context-ladder writer: khoa context + giai doan 0 + luat canh + mac-dinh-nac-cao (E1/E2/E3/E4a)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
flat = lambda s: re.sub(r"\s+", " ", s)  # repo hard-wrap prose — pin phai chiu duoc xuong dong
def check(text):
    m = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", text, re.S)
    if not m:
        return ["KHONG rut duoc DESIGN-PASS-NOTE-TEMPLATE"]
    block = m.group(1); ftext = flat(text)
    errs = []
    if "context: <standalone|static-frame|host-embedded>" not in block:
        errs.append("khuon thieu khoa context: 3 nac")
    if "context_scenes:" not in block:
        errs.append("khuon thieu khoa context_scenes")
    if "bỏ cảnh ngữ-cảnh — " not in flat(block):
        errs.append("chuoi descope canh ngu-canh khong nam trong khuon marker")
    if "## Cảnh ngữ-cảnh" not in block:
        errs.append("khuon thieu section Canh ngu-canh")
    if "vật này sống ở đâu" not in ftext:
        errs.append("thieu cau hoi giai doan 0: vat nay song o dau")
    if "Giai đoạn 0" not in ftext:
        errs.append("thieu section Giai doan 0")
    if "scaffold đơn vị THẬT sau cờ dev" not in ftext:
        errs.append("thieu quy tac mac-dinh-nac-cao (scaffold don vi that sau co dev)")
    if "gương song song" not in ftext:
        errs.append("thieu lenh cam guong song song")
    if "hợp lệ vĩnh viễn" not in ftext:
        errs.append("thieu cau hop le vinh vien cho nhanh khong-co-duong-nhung-re")
    if "host_embed" not in text:
        errs.append("bang preflight thieu khoa design_pass.host_embed")
    if "trước Cổng Phạm-vi" not in ftext and "trước Gate 1" not in ftext:
        errs.append("thieu luat standalone truoc Cong Pham-vi phai kem canh/descope")
    return errs
# DOI CHUNG DUONG: ban nguyen ven phai XANH truoc khi tin cac mutation DO.
assert check(t) == [], f"ban nguyen ven phai xanh: {check(t)}"
m1 = t.replace("context: <standalone|static-frame|host-embedded>", "", 1)
assert any("khuon thieu khoa context" in e for e in check(m1)), "dot bien xoa khoa context khong do"
m2 = re.sub(r"vật\s+này\s+sống\s+ở\s+đâu", "", t)
assert any("vat nay song o dau" in e for e in check(m2)), "dot bien xoa cau hoi giai doan 0 khong do"
m3 = re.sub(r"bỏ\s+cảnh\s+ngữ-cảnh\s+— ", "bo canh ngu canh: ", t)
assert any("chuoi descope" in e for e in check(m3)), "dot bien lech chuoi descope khong do"
m4 = re.sub(r"gương\s+song\s+song", "", t, count=1)
assert any("cam guong song song" in e for e in check(m4)), "dot bien xoa cam guong khong do"
print("P134 OK (doi chung duong + 4 dot bien deu do dung cho)")
PY

run "P135 context-ladder round-trip: khuon writer -> the render nhan tieng nguoi (E5)" \
  python3 - "$ROOT" <<'PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
skill = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
block = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", skill, re.S).group(1)
LABELS = {"standalone": "đứng một mình", "static-frame": "khung giả tĩnh", "host-embedded": "nhúng host thật"}
SCENES_PH = "[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]"
BODY_PH = re.compile(r"- <file cảnh — [^\n]*>")
def mkfix(ctx, scenes, drop_context=False, ledger=None, cfg="schema_version: 1\n"):
    d = Path(tempfile.mkdtemp())
    ws = d / "_acceptance" / "fx"; ws.mkdir(parents=True)
    (d / "_acceptance" / "config.yaml").write_text(cfg, encoding="utf-8")
    (ws / "contract.md").write_text(
        "---\nschema_version: 1\nfeature: fx\nslug: fx\nrisk_tier: T2\nstatus: draft\n---\n\n"
        "## Criteria\n\n- AC-1: Given a, When b, Then c.\n", encoding="utf-8")
    fx = (block.replace("<slug>", "fx").replace("<ISO UTC>", "2026-08-04T00:00:00Z")
          .replace("<url đã mở>", "http://localhost:3000/proto/fx")
          .replace("<real-components|scaffold|static>", "scaffold")
          .replace("<standalone|static-frame|host-embedded>", ctx)
          .replace(SCENES_PH, scenes)
          .replace("<tên-skill-đã-nạp|repo-tokens|shadcn-default>", "shadcn-default")
          .replace("[<danh sách state đã duyệt>]", "[default]").replace("<n>", "1")
          .replace("<state>", "default").replace("<breakpoint>", "mobile-375")
          .replace("<theme>", "light").replace("<file>", "default--mobile-375")
          .replace("<finding — đã đổi gì, 1 dòng/finding>", "x")
          .replace("<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>", "y"))
    fx = BODY_PH.sub("- evidence/design-pass/canh-1.png", fx)
    if drop_context:
        fx = "\n".join(l for l in fx.splitlines() if not l.startswith("context"))
    assert "<" not in fx.split("---", 2)[1], f"frontmatter fixture con placeholder song: {fx.split('---',2)[1]}"
    (ws / "design-pass.md").write_text(fx, encoding="utf-8")
    if ledger is not None:
        (ws / "decisions.jsonl").write_text(ledger, encoding="utf-8")
    return d
def render(d):
    r = subprocess.run(["node", str(root / "scripts/gate-card.js"), "--root", str(d), "--slug", "fx"],
                       capture_output=True, text=True)
    assert r.returncode == 0, f"gate-card exit {r.returncode}: {r.stderr}"
    return r.stdout
# round-trip: moi nac -> dung nhan tieng nguoi tren DAU RA the
for ctx, label in LABELS.items():
    out = render(mkfix(ctx, "[evidence/design-pass/ctx.png]"))
    assert label in out, f"the khong render nhan '{label}' cho {ctx}"
    assert "Bản mẫu" in out, "the thieu khoi Ban mau & ngu canh"
print("P135 OK (3 nac round-trip tu khuon writer)")
PY

run "P136 context-ladder co vang standalone thieu canh: 3 nhanh fixture tu writer (E6)" \
  python3 - "$ROOT" <<'PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
skill = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
block = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", skill, re.S).group(1)
SCENES_PH = "[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]"
BODY_PH = re.compile(r"- <file cảnh — [^\n]*>")
def mkfix(scenes, ledger=None):
    d = Path(tempfile.mkdtemp())
    ws = d / "_acceptance" / "fx"; ws.mkdir(parents=True)
    (d / "_acceptance" / "config.yaml").write_text("schema_version: 1\n", encoding="utf-8")
    (ws / "contract.md").write_text(
        "---\nschema_version: 1\nfeature: fx\nslug: fx\nrisk_tier: T2\nstatus: draft\n---\n\n"
        "## Criteria\n\n- AC-1: Given a, When b, Then c.\n", encoding="utf-8")
    fx = (block.replace("<slug>", "fx").replace("<ISO UTC>", "2026-08-04T00:00:00Z")
          .replace("<url đã mở>", "u").replace("<real-components|scaffold|static>", "scaffold")
          .replace("<standalone|static-frame|host-embedded>", "standalone")
          .replace(SCENES_PH, scenes)
          .replace("<tên-skill-đã-nạp|repo-tokens|shadcn-default>", "repo-tokens")
          .replace("[<danh sách state đã duyệt>]", "[default]").replace("<n>", "0")
          .replace("<state>", "default").replace("<breakpoint>", "mobile-375")
          .replace("<theme>", "light").replace("<file>", "f")
          .replace("<finding — đã đổi gì, 1 dòng/finding>", "x")
          .replace("<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>", "y"))
    fx = BODY_PH.sub("- (chua co)", fx)
    (ws / "design-pass.md").write_text(fx, encoding="utf-8")
    if ledger is not None:
        (ws / "decisions.jsonl").write_text(ledger, encoding="utf-8")
    return d
def render(d):
    r = subprocess.run(["node", str(root / "scripts/gate-card.js"), "--root", str(d), "--slug", "fx"],
                       capture_output=True, text=True)
    assert r.returncode == 0, f"gate-card exit {r.returncode}: {r.stderr}"
    return r.stdout
FLAG = "chưa có cảnh ngữ-cảnh"
# nhanh thieu: standalone + scenes rong + khong ledger -> CO co vang
out = render(mkfix("[]"))
assert FLAG in out, "standalone thieu canh ma the KHONG co vang"
# doi chung duong (a): co canh -> KHONG co
out = render(mkfix("[evidence/design-pass/ctx.png]"))
assert FLAG not in out, "co canh ngu-canh ma the van co vang oan"
# doi chung duong (b): co entry descope dung khuon -> KHONG co
# (nhanh nay dong thoi la mutation-detector: reader mu ledger se co oan -> case do)
led = '{"id":"d-1","type":"descope","decision":"bỏ cảnh ngữ-cảnh — proto đã chạy trong host thật"}\n'
out = render(mkfix("[]", ledger=led))
assert FLAG not in out, "da co entry descope dung khuon ma the van co vang oan (reader mu ledger)"
# entry LECH khuon (khong bat dau dung chuoi) -> van phai co
led2 = '{"id":"d-2","type":"descope","decision":"bo canh ngu canh: ly do"}\n'
out = render(mkfix("[]", ledger=led2))
assert FLAG in out, "entry lech khuon ma van duoc tinh la descope hop le"
# PLACEHOLDER NGUYEN TRANG (S4-r1 false-green): khuon chua dien co dau phay ben
# trong -> split(',') tach doi, nua sau song qua filter cu -> im lang + khoe
# "1 cảnh ngữ-cảnh". Phai: van co vang + KHONG dem placeholder thanh canh.
out = render(mkfix(SCENES_PH))
assert FLAG in out, "placeholder nguyen trang ma co vang standalone-thieu-canh im lang"
assert "cảnh ngữ-cảnh</b>" not in out and "1 cảnh ngữ-cảnh" not in out, \
    "placeholder nguyen trang bi dem thanh canh that tren card"
print("P136 OK (thieu->co, canh->khong, descope->khong, lech-khuon->co, placeholder->co)")
PY

run "P137 context-ladder duong doc-cu + gia tri la: co vang co ten, khong chan (E7)" \
  python3 - "$ROOT" <<'PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
skill = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
block = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", skill, re.S).group(1)
SCENES_PH = "[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]"
BODY_PH = re.compile(r"- <file cảnh — [^\n]*>")
def mkfix(ctx, drop_context=False):
    d = Path(tempfile.mkdtemp())
    ws = d / "_acceptance" / "fx"; ws.mkdir(parents=True)
    (d / "_acceptance" / "config.yaml").write_text("schema_version: 1\n", encoding="utf-8")
    (ws / "contract.md").write_text(
        "---\nschema_version: 1\nfeature: fx\nslug: fx\nrisk_tier: T2\nstatus: draft\n---\n\n"
        "## Criteria\n\n- AC-1: Given a, When b, Then c.\n", encoding="utf-8")
    fx = (block.replace("<slug>", "fx").replace("<ISO UTC>", "2026-08-04T00:00:00Z")
          .replace("<url đã mở>", "u").replace("<real-components|scaffold|static>", "static")
          .replace("<standalone|static-frame|host-embedded>", ctx)
          .replace(SCENES_PH, "[]")
          .replace("<tên-skill-đã-nạp|repo-tokens|shadcn-default>", "repo-tokens")
          .replace("[<danh sách state đã duyệt>]", "[default]").replace("<n>", "0")
          .replace("<state>", "default").replace("<breakpoint>", "mobile-375")
          .replace("<theme>", "light").replace("<file>", "f")
          .replace("<finding — đã đổi gì, 1 dòng/finding>", "x")
          .replace("<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>", "y"))
    fx = BODY_PH.sub("- (khong)", fx)
    if drop_context:
        # so phien DOI TRUOC truc ngu canh: khong co context/context_scenes
        fx = "\n".join(l for l in fx.splitlines() if not l.startswith("context"))
    (ws / "design-pass.md").write_text(fx, encoding="utf-8")
    return d
def render(d):
    r = subprocess.run(["node", str(root / "scripts/gate-card.js"), "--root", str(d), "--slug", "fx"],
                       capture_output=True, text=True)
    assert r.returncode == 0, f"gate-card exit {r.returncode} (duong doc-cu PHAI khong chan): {r.stderr}"
    return r.stdout
OLD = "chưa khai nấc ngữ cảnh"
ALIEN = "không nhận diện được"
# khuon cu (khong co context:) -> exit 0 + co vang doc-cu
out = render(mkfix("host-embedded", drop_context=True))
assert OLD in out, "so phien doi cu ma the khong co vang 'chua khai nac ngu canh'"
# gia tri ngoai enum -> co vang neu DUNG ten gia tri la
out = render(mkfix("embedded-lite"))
assert ALIEN in out and "embedded-lite" in out, "gia tri la khong duoc neu ten tren the"
# doi chung duong: gia tri hop le -> khong co ca hai loai co
out = render(mkfix("host-embedded"))
assert OLD not in out and ALIEN not in out, "gia tri hop le ma van co vang oan"
print("P137 OK (doc-cu co ten, gia tri la co ten, hop le khong co)")
PY

run "P138 context-ladder socket host_embed: vang->co vang, con tro hong->neu ten, giai duoc->khong (E4)" \
  python3 - "$ROOT" <<'PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
skill = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
block = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", skill, re.S).group(1)
SCENES_PH = "[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]"
BODY_PH = re.compile(r"- <file cảnh — [^\n]*>")
def mkfix(cfg, mkguide=None):
    d = Path(tempfile.mkdtemp())
    ws = d / "_acceptance" / "fx"; ws.mkdir(parents=True)
    (d / "_acceptance" / "config.yaml").write_text(cfg, encoding="utf-8")
    (ws / "contract.md").write_text(
        "---\nschema_version: 1\nfeature: fx\nslug: fx\nrisk_tier: T2\nstatus: draft\n---\n\n"
        "## Criteria\n\n- AC-1: Given a, When b, Then c.\n", encoding="utf-8")
    fx = (block.replace("<slug>", "fx").replace("<ISO UTC>", "2026-08-04T00:00:00Z")
          .replace("<url đã mở>", "u").replace("<real-components|scaffold|static>", "scaffold")
          .replace("<standalone|static-frame|host-embedded>", "host-embedded")
          .replace(SCENES_PH, "[]")
          .replace("<tên-skill-đã-nạp|repo-tokens|shadcn-default>", "repo-tokens")
          .replace("[<danh sách state đã duyệt>]", "[default]").replace("<n>", "0")
          .replace("<state>", "default").replace("<breakpoint>", "mobile-375")
          .replace("<theme>", "light").replace("<file>", "f")
          .replace("<finding — đã đổi gì, 1 dòng/finding>", "x")
          .replace("<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>", "y"))
    fx = BODY_PH.sub("- (khong)", fx)
    (ws / "design-pass.md").write_text(fx, encoding="utf-8")
    if mkguide:
        p = d / mkguide; p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text("huong dan nhung\n", encoding="utf-8")
    return d
def render(d):
    r = subprocess.run(["node", str(root / "scripts/gate-card.js"), "--root", str(d), "--slug", "fx"],
                       capture_output=True, text=True)
    assert r.returncode == 0, f"gate-card exit {r.returncode} (socket PHAI khong chan): {r.stderr}"
    return r.stdout
MISS = "chưa khai đường nhúng"
DEAD = "con trỏ không giải được"
CFG_HE = "schema_version: 1\ndesign_pass:\n  host_embed:\n    guide: docs/nhung.md\n    route: /proto\n    dev_flag: DEV=1\n"
# (a) config khong co design_pass.host_embed -> co vang vang-duong-nhung, van exit 0
out = render(mkfix("schema_version: 1\n"))
assert MISS in out, "vang khoa host_embed ma the khong co vang"
# (b) khoa CO ma con tro chet -> co vang neu NGUYEN VAN con tro
out = render(mkfix(CFG_HE))
assert DEAD in out and "docs/nhung.md" in out, "con tro chet khong duoc neu ten tren the"
# (c) doi chung duong: con tro giai duoc -> khong co loai nao
out = render(mkfix(CFG_HE, mkguide="docs/nhung.md"))
assert MISS not in out and DEAD not in out, "con tro giai duoc ma van co vang oan"
# (d) comment duoi tren guide (khoan dung nhu hook) -> van giai duoc, khong co (S4-r1)
CFG_CMT = "schema_version: 1\ndesign_pass:\n  host_embed:\n    guide: docs/nhung.md  # duong nhung cua repo\n    route: /proto\n"
out = render(mkfix(CFG_CMT, mkguide="docs/nhung.md"))
assert MISS not in out and DEAD not in out, "comment duoi lam hong resolvability -> co vang oan"
# (e) config CRLF -> khoa van duoc nhan dien, khong co vang-khoa oan (S4-r1)
out = render(mkfix(CFG_HE.replace("\n", "\r\n"), mkguide="docs/nhung.md"))
assert MISS not in out, "config CRLF lam khoa host_embed tang hinh -> co vang oan"
# (f) blank line trong block design_pass truoc host_embed -> van nhan dien (S4-r1)
CFG_BLANK = "schema_version: 1\ndesign_pass:\n\n  host_embed:\n    guide: docs/nhung.md\n"
out = render(mkfix(CFG_BLANK, mkguide="docs/nhung.md"))
assert MISS not in out, "blank line trong block lam khoa tang hinh -> co vang oan"
# quan he writer-docs: bang preflight SKILL phai khai khoa nay (Task 1 da pin, assert lai quan he)
assert "design_pass.host_embed" in skill, "SKILL khong khai khoa host_embed trong preflight"
print("P138 OK (vang->co, chet->ten, song->khong, comment/CRLF/blank->khong, SKILL khai khoa)")
PY

run "P139 context-ladder generic: fixture repo-la code-sinh (web app tron) + grep-guard tu vung host (E8)" \
  python3 - "$ROOT" <<'PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
skill = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
block = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", skill, re.S).group(1)
SCENES_PH = "[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]"
BODY_PH = re.compile(r"- <file cảnh — [^\n]*>")
# Fixture = repo web-app TRON do code sinh trong lan chay nay: khong artifact-
# platform, khong tu vung host nao. Phep do phai phan biet dung tren no —
# ghim QUAN HE khai-nac <-> config-cap-dich, khong ghim ten host.
def mkrepo(ctx, drop_context=False):
    d = Path(tempfile.mkdtemp())
    (d / "package.json").write_text('{"name":"plain-webapp","private":true}\n', encoding="utf-8")
    (d / "src").mkdir(); (d / "src" / "app.js").write_text("export const app = () => 'hello';\n", encoding="utf-8")
    ws = d / "_acceptance" / "fx-web"; ws.mkdir(parents=True)
    (d / "_acceptance" / "config.yaml").write_text("schema_version: 1\n", encoding="utf-8")
    (ws / "contract.md").write_text(
        "---\nschema_version: 1\nfeature: fx-web\nslug: fx-web\nrisk_tier: T2\nstatus: draft\n---\n\n"
        "## Criteria\n\n- AC-1: Given a, When b, Then c.\n", encoding="utf-8")
    fx = (block.replace("<slug>", "fx-web").replace("<ISO UTC>", "2026-08-04T00:00:00Z")
          .replace("<url đã mở>", "http://localhost:5173/preview")
          .replace("<real-components|scaffold|static>", "static")
          .replace("<standalone|static-frame|host-embedded>", ctx)
          .replace(SCENES_PH, "[]")
          .replace("<tên-skill-đã-nạp|repo-tokens|shadcn-default>", "shadcn-default")
          .replace("[<danh sách state đã duyệt>]", "[default]").replace("<n>", "0")
          .replace("<state>", "default").replace("<breakpoint>", "mobile-375")
          .replace("<theme>", "light").replace("<file>", "f")
          .replace("<finding — đã đổi gì, 1 dòng/finding>", "x")
          .replace("<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>", "y"))
    fx = BODY_PH.sub("- (khong)", fx)
    if drop_context:
        fx = "\n".join(l for l in fx.splitlines() if not l.startswith("context"))
    (ws / "design-pass.md").write_text(fx, encoding="utf-8")
    return d
def render(d):
    r = subprocess.run(["node", str(root / "scripts/gate-card.js"), "--root", str(d), "--slug", "fx-web"],
                       capture_output=True, text=True)
    assert r.returncode == 0, f"gate-card exit {r.returncode} tren repo-la: {r.stderr}"
    return r.stdout
# ba phep do phan biet dung tren repo-la
out = render(mkrepo("host-embedded"))
assert "nhúng host thật" in out, "repo-la: nac hop le khong render nhan"
out = render(mkrepo("standalone"))
assert "chưa có cảnh ngữ-cảnh" in out, "repo-la: standalone thieu canh khong co vang"
out = render(mkrepo("host-embedded", drop_context=True))
assert "chưa khai nấc ngữ cảnh" in out, "repo-la: so phien doi cu khong co vang doc-cu"
# grep-guard tu vung host — chuoi GHEP MANH de guard khong tu khop source cua no,
# co sanity counter (so file quet phai dung) + doi chung duong (tiem -> do).
BAD = ["Crea" + "tor", "can" + "vas", "One" + "Hub"]
rt = (root / "tests/plugins/run-tests.sh").read_text(encoding="utf-8")
B = "# --- context-ladder cases " + "(P134-P141) begin ---"
E = "# --- context-ladder cases " + "end ---"
b = rt.find(B); e = rt.find(E, b + 1)
assert b != -1 and e != -1 and e > b, "khong tim thay vung case context-ladder"
srcs = {
    "skills/design-pass/SKILL.md": skill,
    "scripts/gate-card.js": (root / "scripts/gate-card.js").read_text(encoding="utf-8"),
    "tests:context-ladder-region": rt[b:e],
}
assert len(srcs) == 3, "sanity: so nguon quet phai la 3"
def guard(texts):
    errs = []
    for name, txt in sorted(texts.items()):
        for w in BAD:
            if w in txt:
                errs.append(f"tu vung host '{w}' lot vao {name}")
    return errs
assert guard(srcs) == [], f"tu vung host lot vao nguon kit: {guard(srcs)}"
mut = dict(srcs); mut["skills/design-pass/SKILL.md"] = skill + "\n" + BAD[0]
assert any("tu vung host" in x and BAD[0] in x for x in guard(mut)), "guard khong do khi tiem tu vung host"
print("P139 OK (3 phep do dung tren repo-la + guard co doi chung duong)")
PY

run "P140 context-ladder wiring: checklist ket phien S1-D + resume-guard doc context (E9)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "feature-loop/skills/feature-loop/SKILL.md").read_text(encoding="utf-8")
flat = lambda s: re.sub(r"\s+", " ", s)
def check(text):
    ftext = flat(text)
    errs = []
    if "ma trận capture + findings + nấc ngữ cảnh đã khai" not in ftext:
        errs.append("checklist ket phien S1-D thieu muc nac ngu canh da khai")
    # resume-guard: doan S1-D phai noi resume DOC khoa context (duong doc-cu co vang)
    m = re.search(r"\*\*Nghi thức S1-D.*?(?=\n\n)", text, re.S)
    seg = flat(m.group(0)) if m else ""
    if not ("resume" in seg and "`context:`" in seg):
        errs.append("doan S1-D thieu resume-guard doc khoa context")
    return errs
assert check(t) == [], f"ban nguyen ven phai xanh: {check(t)}"
m1 = re.sub(r"nấc\s+ngữ\s+cảnh\s+đã\s+khai", "", t)
assert any("thieu muc nac ngu canh" in e for e in check(m1)), "dot bien xoa muc checklist khong do"
m2 = re.sub(r"resume", "quaylai", t)
assert any("thieu resume-guard" in e for e in check(m2)), "dot bien xoa resume-guard khong do"
print("P140 OK (doi chung duong + 2 dot bien)")
PY

run "P141 context-ladder docs-pin: amendment spec v2 + term CONTEXT.md (E13)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
spec = (root / "docs/specs/workflow-v2-spec.md").read_text(encoding="utf-8")
ctx = (root / "CONTEXT.md").read_text(encoding="utf-8")
flat = lambda s: re.sub(r"\s+", " ", s)
def check(spec_t, ctx_t):
    errs = []
    fs_, fc = flat(spec_t), flat(ctx_t)
    if "Bổ sung 04/08 — trục ngữ cảnh" not in fs_:
        errs.append("spec v2 thieu amendment truc ngu canh")
    if "2026-08-04-context-ladder-design.md" not in fs_:
        errs.append("amendment khong tro toi file design")
    if "Nấc ngữ cảnh" not in fc:
        errs.append("CONTEXT.md thieu term Nac ngu canh")
    if "Cảnh ngữ-cảnh" not in fc:
        errs.append("CONTEXT.md thieu term Canh ngu-canh")
    return errs
assert check(spec, ctx) == [], f"ban nguyen ven phai xanh: {check(spec, ctx)}"
m1 = re.sub(r"Bổ sung 04/08 — trục ngữ cảnh", "", spec)
assert any("thieu amendment" in e for e in check(m1, ctx)), "dot bien xoa amendment khong do"
m2 = re.sub(r"\*\*Nấc ngữ cảnh[^*]*\*\*", "", ctx)
assert any("thieu term Nac ngu canh" in e for e in check(spec, m2)), "dot bien xoa term khong do"
print("P141 OK (doi chung duong + 2 dot bien)")
PY

run "P142 context-ladder coverage-lint scoped: khong canh bao nao ngoai W3 da-biet (E12)" \
  python3 - "$ROOT" <<'PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
# Thuoc scoped: lint rieng slug nay. W3 la bao gia DA BIET (lint doc expected
# mot-dong, khong thay ca am trong block scalar — cung lop bug parser gate-card,
# chip sua rieng). Luat: canh bao cua context-ladder ⊆ {W3}; lint sua xong
# (exit 0, khong W3) case nay VAN xanh — khong ghim bao gia thanh yeu cau.
r = subprocess.run(["node", str(root / "scripts/eval-coverage-lint.js"), str(root), "--slug", "context-ladder"],
                   capture_output=True, text=True)
warns = [l for l in r.stdout.splitlines() if l.strip().startswith("[context-ladder]")]
bad = [l for l in warns if " W3 " not in l]
assert bad == [], f"canh bao NGOAI W3 cho context-ladder: {bad}"
# DOI CHUNG DUONG (che do --files; W6 tat trong mode nay theo thiet ke — dong 214
# cua lint): tiem AC nguong KHONG co eval am -> W1 phai no dung ten AC.
ct = (root / "_acceptance/context-ladder/contract.md").read_text(encoding="utf-8")
ev = (root / "_acceptance/context-ladder/evals.yaml").read_text(encoding="utf-8")
d = Path(tempfile.mkdtemp())
(d / "contract.md").write_text(ct.replace("## Coverage", "- AC-99: Given x, When đạt ngưỡng 5, Then y.\n\n## Coverage", 1), encoding="utf-8")
(d / "evals.yaml").write_text(ev + "  - id: E99\n    criterion: AC-99\n    executor: script\n    cmd: config:executors.script.product_map\n    expected: chay xong la dat\n", encoding="utf-8")
r2 = subprocess.run(["node", str(root / "scripts/eval-coverage-lint.js"), str(root), "--files", str(d / "contract.md"), str(d / "evals.yaml")],
                    capture_output=True, text=True)
assert "W1" in r2.stdout and "AC-99" in r2.stdout, f"doi chung duong hong: tiem AC nguong ma W1 khong no: {r2.stdout[:300]}"
print("P142 OK (chi W3 da-biet; doi chung duong W1 no dung)")
PY

# --- context-ladder cases end ---

# ── P143: parser evals block-scalar — covGaps thẻ Cổng 1 không bắn giả trên `expected: >` ─
# Bug lớp: khuôn eval-gen viết `expected: >` (folded scalar); regex một-dòng cũ
# bắt được đúng ">" nên NEG_RE test trên ">" luôn false → thẻ bắn cờ "có
# ngưỡng/biên nhưng chưa có ca dưới ngưỡng" cho MỌI AC khớp THRESHOLD_RE
# (context-ladder: 8/8 AC dính dù 16/16 eval có ca âm). Bất biến CLAUDE.md:
# đối chứng dương TRƯỚC (phép đo phải đỏ được trên vật thật thiếu ca âm, ghim
# đúng thông điệp) rồi mới tin case âm; fixture do code sinh trong chính lần chạy.
echo "P143 gate-card covGaps: block scalar co ca am -> KHONG co; thieu that -> dung 1 AC"
P143OK=1
P143WS="$(mktemp -d)"
mkdir -p "$P143WS/_acceptance/demo"
cat > "$P143WS/_acceptance/demo/contract.md" <<'EOF'
---
schema_version: 1
feature: demo
slug: demo
risk_tier: T2
status: draft
---

## Criteria

- AC-1: Given ngưỡng 5 phút, When quá ngưỡng, Then hệ thống cảnh báo.
- AC-2: Given hạn mức 3 lần, When vượt hạn mức, Then hệ thống khoá phiên.
EOF
P143MSG='có ngưỡng/biên nhưng chưa có ca'
p134_flags() { node "$ROOT/scripts/gate-card.js" --root "$P143WS" --slug demo --gate 1 2>&1 | grep -o "AC-[0-9]* $P143MSG" ; }
# (a) đối chứng dương: expected MỘT DÒNG thiếu ca âm → cờ PHẢI bắn cho cả 2 AC,
# đúng thông điệp — chứng minh máy-cảnh-báo còn sống trước khi tin các case sạch.
cat > "$P143WS/_acceptance/demo/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: cảnh báo bắn ra đúng kênh
  - id: E2
    criterion: AC-2
    expected: phiên bị khoá ngay
EOF
P143A="$(p134_flags)"
printf '%s\n' "$P143A" | grep -q "AC-1 $P143MSG" || { echo "     doi chung duong: co AC-1 KHONG ban (may canh bao chet?)"; P143OK=0; }
printf '%s\n' "$P143A" | grep -q "AC-2 $P143MSG" || { echo "     doi chung duong: co AC-2 KHONG ban"; P143OK=0; }
# (b) folded scalar `>` chứa ca âm cho cả 2 AC → KHÔNG cờ nào (đây là bug gốc)
cat > "$P143WS/_acceptance/demo/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: >
      quá ngưỡng → cảnh báo bắn;
      dưới ngưỡng → KHÔNG bắn cảnh báo.
  - id: E2
    criterion: AC-2
    expected: >
      vượt hạn mức → khoá;
      còn trong hạn mức → KHÔNG khoá phiên.
EOF
[ -z "$(p134_flags)" ] || { echo "     folded scalar co ca am van bi ban co gia:"; p134_flags | sed 's/^/       /'; P143OK=0; }
# (c) literal scalar `|` — cùng lớp, phải cùng thuốc
cat > "$P143WS/_acceptance/demo/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: |
      dưới ngưỡng → KHÔNG bắn cảnh báo.
  - id: E2
    criterion: AC-2
    expected: |
      còn trong hạn mức → KHÔNG khoá phiên.
EOF
[ -z "$(p134_flags)" ] || { echo "     literal scalar | van bi ban co gia"; P143OK=0; }
# (d) chính xác từng AC: AC-1 block CÓ ca âm, AC-2 block THIẾU → đúng 1 cờ, đúng AC-2
# (block-parse không được blanket-suppress cảnh báo)
cat > "$P143WS/_acceptance/demo/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: >
      dưới ngưỡng → KHÔNG bắn cảnh báo.
  - id: E2
    criterion: AC-2
    expected: >
      vượt hạn mức thì phiên bị khoá ngay lập tức.
EOF
P143D="$(p134_flags)"
[ "$(printf '%s\n' "$P143D" | grep -c "$P143MSG")" = "1" ] || { echo "     ky vong DUNG 1 co, thay: [$P143D]"; P143OK=0; }
printf '%s\n' "$P143D" | grep -q "AC-2 $P143MSG" || { echo "     co phai tro dung AC-2 (AC thieu that)"; P143OK=0; }
# (e) thân block là DATA: dòng "criterion: AC-9" trong thân expected không được
# cướp mapping của eval (cướp thì evalsFor(AC-1) rỗng → cờ AC-1 bắn lại)
cat > "$P143WS/_acceptance/demo/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: >
      dưới ngưỡng → KHÔNG bắn; dòng sau là DATA chứ không phải key:
      criterion: AC-9
      exit 0.
  - id: E2
    criterion: AC-2
    expected: >
      còn trong hạn mức → KHÔNG khoá phiên.
EOF
[ -z "$(p134_flags)" ] || { echo "     dong criterion: trong THAN block cuop mat mapping cua eval"; P143OK=0; }
rm -rf "$P143WS"
if [ "$P143OK" -eq 1 ]; then
  pass "P143 covGaps doc duoc block scalar > va |, canh bao dung AC, than block khong cuop key"
else
  fail "P143 covGaps doc duoc block scalar > va |, canh bao dung AC, than block khong cuop key"
fi

# ── P144: eval-coverage-lint W1/W3 — cùng lớp bug, cùng thuốc (lib/eval-yaml.js) ─
# Lint có BẢN SAO của parser gate-card (đã trôi cùng nhau); case này ghim phía
# lint để hai bên không tách thuốc lần nữa: W1 không bắn giả khi ca âm nằm trong
# block, W3 đếm được ca âm trong block, và cảnh báo thật vẫn đỏ đúng chỗ.
echo "P144 eval-coverage-lint: W1/W3 doc block scalar, khong ban gia, thieu that van do"
P144OK=1
P144WS="$(mktemp -d)"
cat > "$P144WS/contract.md" <<'EOF'
---
schema_version: 1
feature: demo
slug: demo
risk_tier: T2
status: draft
---

## Criteria

- AC-1: Given ngưỡng 5 phút, When quá ngưỡng, Then hệ thống cảnh báo.
- AC-2: Given hạn mức 3 lần, When vượt hạn mức, Then hệ thống khoá phiên.

## Out of scope

- không gửi lại cảnh báo trùng trong 24 giờ
EOF
p135_lint() { node "$ROOT/scripts/eval-coverage-lint.js" --files "$P144WS/contract.md" "$P144WS/evals.yaml" 2>&1; }
# (a) đối chứng dương: một dòng, không ca âm → W1 cho cả 2 AC + W3, ghim thông điệp
cat > "$P144WS/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: cảnh báo bắn ra đúng kênh
  - id: E2
    criterion: AC-2
    expected: phiên bị khoá ngay
EOF
P144A="$(p135_lint)"
printf '%s' "$P144A" | grep -q 'W1 AC-1 is a threshold/boundary criterion' || { echo "     doi chung duong: W1 AC-1 khong ban"; P144OK=0; }
printf '%s' "$P144A" | grep -q 'W1 AC-2 is a threshold/boundary criterion' || { echo "     doi chung duong: W1 AC-2 khong ban"; P144OK=0; }
printf '%s' "$P144A" | grep -q 'W3 Out-of-scope lists' || { echo "     doi chung duong: W3 khong ban"; P144OK=0; }
# (b) ca âm nằm TRONG block `>` → không W1, không W3, exit 0 kèm dòng sạch
cat > "$P144WS/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: >
      dưới ngưỡng → KHÔNG bắn cảnh báo.
  - id: E2
    criterion: AC-2
    expected: >
      còn trong hạn mức → KHÔNG khoá phiên.
EOF
P144B="$(p135_lint)"; P144BST=$?
[ "$P144BST" -eq 0 ] || { echo "     block co ca am van exit $P144BST"; P144OK=0; }
printf '%s' "$P144B" | grep -q 'no coverage gaps detected' || { echo "     block co ca am van in canh bao: $P144B"; P144OK=0; }
# (c) AC-2 block thật sự thiếu ca âm → ĐÚNG 1 dòng W1, trỏ AC-2
cat > "$P144WS/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: >
      dưới ngưỡng → KHÔNG bắn cảnh báo.
  - id: E2
    criterion: AC-2
    expected: >
      vượt hạn mức thì phiên bị khoá ngay lập tức.
EOF
P144C="$(p135_lint)"
[ "$(printf '%s' "$P144C" | grep -c '] W1 ')" = "1" ] || { echo "     ky vong dung 1 dong W1: $P144C"; P144OK=0; }
printf '%s' "$P144C" | grep -q 'W1 AC-2 is a threshold/boundary criterion' || { echo "     W1 phai tro AC-2"; P144OK=0; }
rm -rf "$P144WS"
if [ "$P144OK" -eq 1 ]; then
  pass "P144 lint W1/W3 doc block scalar, khong ban gia, thieu that van do dung AC"
else
  fail "P144 lint W1/W3 doc block scalar, khong ban gia, thieu that van do dung AC"
fi

# ── P145: awk cross-layer pairing (pre-merge) — thân block scalar là DATA ─────
# Cùng lớp bug, biến thể "thân làm bẩn state": (i) một bullet "- baseline: green"
# trong thân expected khớp luật flush → reset crit giữa block → layer thật đặt
# SAU expected mất pairing → false VIOLATION; (ii) một dòng prose
# "layer: backend-effect" trong thân pair HỘ eval UI-only → false-green — đúng
# thứ răng này sinh ra để chặn. Đối chứng dương giữ nguyên khung fixture, chỉ
# đổi evals.yaml — chứng minh đường chạy tới răng còn sống.
echo "P145 pre-merge cross-layer: than block khong reset/khong pair ho, thieu that van VIOLATION"
P145OK=1
P145WS="$(mktemp -d)"
mkdir -p "$P145WS/_acceptance/xl"
cat > "$P145WS/_acceptance/xl/contract.md" <<'EOF'
---
schema_version: 1
feature: xl
slug: xl
risk_tier: T2
status: implemented
approved_by: tester
---

## Criteria

- AC-1: Given form, When submit, Then DB có row mới (cross-layer).
EOF
P145MSG='AC-1 is tagged (cross-layer) but no eval of it declares layer: backend-effect'
p136_hits() { bash "$ROOT/scripts/pre-merge-check.sh" "$P145WS" 2>&1 | grep -cF "$P145MSG"; }
# (a) đối chứng dương: chỉ có layer ui → răng phải cắn, đúng thông điệp
cat > "$P145WS/_acceptance/xl/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: ui-check
    layer: ui
    expected: >
      form submit xong thấy toast.
EOF
[ "$(p136_hits)" = "1" ] || { echo "     doi chung duong: rang cross-layer KHONG can (duong chay toi rang chet?)"; P145OK=0; }
# (b) bullet "- baseline: green" trong thân expected + layer thật SAU expected → phải SẠCH
cat > "$P145WS/_acceptance/xl/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: script
    expected: >
      DB có đúng 1 row mới; log của run in các dòng:
      - baseline: green
      - exit 0
    layer: backend-effect
EOF
[ "$(p136_hits)" = "0" ] || { echo "     bullet trong than expected reset crit -> false VIOLATION"; P145OK=0; }
# (c) layer thật là ui, thân expected nhắc "layer: backend-effect" → PHẢI VIOLATION (chặn false-green)
cat > "$P145WS/_acceptance/xl/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: ui-check
    layer: ui
    expected: >
      chưa có eval nào khai
      layer: backend-effect
      cho tuyến này.
EOF
[ "$(p136_hits)" = "1" ] || { echo "     dong prose trong than expected pair HO eval ui-only -> false-green"; P145OK=0; }
rm -rf "$P145WS"
if [ "$P145OK" -eq 1 ]; then
  pass "P145 awk pairing bo qua than block scalar, hai chieu false-VIOLATION/false-green deu chan"
else
  fail "P145 awk pairing bo qua than block scalar, hai chieu false-VIOLATION/false-green deu chan"
fi

# ── P146: thẻ Cổng 1 — bullet hard-wrap nối trọn câu, không dấu máy (artifact THẬT) ──
# Findings 2026-08-05 (gate-card-ngon-ngu-may): covLines lọc /^-\s+\S/ theo TỪNG
# DÒNG nên phần nối của bullet wrap 80 cột bị vứt ("AC-6 (sha vào" cụt giữa câu),
# và khối Coverage + gap-probe render esc() thô nên `**`/backtick lên thẳng mặt
# người. Fixture do CODE SINH từ artifact thật của delta-verify-repin — không
# viết tay khuôn bên đọc (luật thước-gắn-vật).
echo "P146 gate-card Coverage/probe: noi tron bullet wrap + khong dau markdown may (artifact THAT)"
P146OK=1
P146WS="$(mktemp -d)"
mkdir -p "$P146WS/_acceptance/demo"
for f in contract.md gap-probe.md decisions.jsonl evals.yaml; do
  cp "$ROOT/_acceptance/delta-verify-repin/$f" "$P146WS/_acceptance/demo/$f" \
    || { echo "     fixture hong: khong cp duoc $f tu workspace that"; P146OK=0; }
done
# đối chứng dương cho chính fixture: bản gốc PHẢI chứa bullet wrap đang kiểm
grep -q 'AC-6 (sha vào$' "$P146WS/_acceptance/demo/contract.md" \
  || { echo "     artifact that khong con bullet wrap 'AC-6 (sha vào' cuoi dong — chon bullet khac cho case nay"; P146OK=0; }
P146OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P146WS" --slug demo --gate 1 2>&1)"; P146ST=$?
[ "$P146ST" -eq 0 ] || { echo "     gate-card exit $P146ST: $P146OUT"; P146OK=0; }
# đối chứng dương: khối Coverage + gap-probe THẬT SỰ render (răng của các phép đo âm bên dưới)
printf '%s' "$P146OUT" | grep -qF 'S — sự kiện re-pin' || { echo "     khoi Coverage khong render (doi chung duong chet)"; P146OK=0; }
printf '%s' "$P146OUT" | grep -qF 'CE: 141 mục thật' || { echo "     bullet Coverage dau tien khong render du (doi chung duong chet)"; P146OK=0; }
printf '%s' "$P146OUT" | grep -qF 'Hoán vị' || { echo "     row gap-probe P0 khong render (doi chung duong chet)"; P146OK=0; }
# RED lỗi (1): phần NỐI DÒNG của bullet wrap phải sống trọn trên thẻ
printf '%s' "$P146OUT" | grep -qF 'sha vào run-log' || { echo "     bullet wrap bi cat cut: 'sha vào run-log' khong xuat hien (covLines vut dong noi)"; P146OK=0; }
# RED lỗi (2): dấu máy markdown không được lên mặt người
if printf '%s' "$P146OUT" | grep -qF '**'; then echo "     the con dau '**' tho (khoi contract/probe chua qua lot markdown)"; P146OK=0; fi
if printf '%s' "$P146OUT" | grep -q '[`]'; then echo "     the con backtick tho (khoi contract/probe chua qua lot markdown)"; P146OK=0; fi
rm -rf "$P146WS"
if [ "$P146OK" -eq 1 ]; then
  pass "P146 bullet wrap noi tron + Coverage/probe khong dau may (doi chung duong tren artifact that)"
else
  fail "P146 bullet wrap noi tron + Coverage/probe khong dau may (doi chung duong tren artifact that)"
fi

# ── P147: tầng card-plain phủ Coverage + gap-probe (overlay thay chữ, không giấu được hàng) ──
# Lớp lỗi: block sinh SAU tầng card-plain không được nối vào tầng đó — AC/decisions
# có đường plain, Coverage/probe thì không. Phép đo là ROUND-TRIP: overlay sinh
# BẰNG CODE từ chính --extract (khuôn key rút từ writer doc), rồi reader render.
# Trust invariant giữ nguyên: sev do script render (overlay không đè được), hàng
# không có overlay vẫn hiện bản fallback — overlay chỉ đổi CHỮ, không đổi SỰ CÓ MẶT.
echo "P147 card-plain phu Coverage + gap-probe: overlay thay chu, sev + hang khong overlay van hien"
P147OK=1
P147WS="$(mktemp -d)"
mkdir -p "$P147WS/_acceptance/demo"
for f in contract.md gap-probe.md decisions.jsonl evals.yaml; do
  cp "$ROOT/_acceptance/delta-verify-repin/$f" "$P147WS/_acceptance/demo/$f" \
    || { echo "     fixture hong: khong cp duoc $f"; P147OK=0; }
done
# khuôn key: writer doc là NGUỒN, reader phải đọc đúng tập đó (hai chiều — trôi là đỏ)
node - "$ROOT" <<'JS' || P147OK=0
const fs = require('fs'), path = require('path');
const root = process.argv[2];
const doc = fs.readFileSync(path.join(root, 'commands/acceptance-card.md'), 'utf8');
const m = doc.match(/<<<CARD-PLAIN-KEYS\n([\s\S]*?)CARD-PLAIN-KEYS>>>/);
if (!m) { console.error('     KHONG rut duoc khuon CARD-PLAIN-KEYS tu commands/acceptance-card.md'); process.exit(1); }
const keys = m[1].split(/\s+/).filter(k => /^[a-z_]+$/.test(k));
if (!keys.includes('coverage_plain') || !keys.includes('gap_probe_plain')) {
  console.error('     khuon CARD-PLAIN-KEYS thieu coverage_plain/gap_probe_plain'); process.exit(1);
}
const gc = fs.readFileSync(path.join(root, 'scripts/gate-card.js'), 'utf8');
const used = [...new Set([...gc.matchAll(/\bpl\.([a-z_]+)/g)].map(x => x[1]))];
for (const k of keys) if (!used.includes(k)) { console.error('     key trong khuon ma reader KHONG doc: ' + k); process.exit(1); }
for (const k of used) if (!keys.includes(k)) { console.error('     reader doc key NGOAI khuon (writer khong duoc bao viet): ' + k); process.exit(1); }
JS
# overlay sinh bằng code từ extract: phủ TOÀN BỘ coverage, CHỈ row 0 của probe
P147EX="$(node "$ROOT/scripts/gate-card.js" --root "$P147WS" --slug demo --gate 1 --extract 2>/dev/null)"
printf '%s' "$P147EX" | node -e '
const d = JSON.parse(require("fs").readFileSync(0, "utf8"));
if (!(d.coverage || []).length || !((d.gap_probe || {}).rows || []).length) {
  console.error("     extract khong co coverage/gap_probe.rows — fixture chet"); process.exit(1);
}
const plain = {
  coverage_plain: d.coverage.map((t, i) => ({ i, p: "PHU-" + i + " câu tiếng sản phẩm cho trục này" })),
  gap_probe_plain: [{ i: 0, p: "DO-0 lỗ nặng nhất đã vá bằng luật máy mới" }],
};
require("fs").writeFileSync(process.argv[1], JSON.stringify(plain));
' "$P147WS/plain.json" || P147OK=0
P147OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P147WS" --slug demo --gate 1 --plain "$P147WS/plain.json" 2>&1)"; P147ST=$?
[ "$P147ST" -eq 0 ] || { echo "     gate-card --plain exit $P147ST: $P147OUT"; P147OK=0; }
printf '%s' "$P147OUT" | grep -qF 'PHU-0 câu tiếng sản phẩm' || { echo "     overlay coverage_plain KHONG duoc render (key bi bo qua)"; P147OK=0; }
printf '%s' "$P147OUT" | grep -qF 'DO-0 lỗ nặng nhất' || { echo "     overlay gap_probe_plain KHONG duoc render (key bi bo qua)"; P147OK=0; }
# có overlay → bản thô của hàng ĐÃ overlay phải biến mất (đối chứng dương: P146 ghim
# chính hai chuỗi này PHẢI hiện khi KHÔNG overlay — phép đo phân biệt được hai trạng thái)
if printf '%s' "$P147OUT" | grep -qF 'CE: 141 mục thật'; then echo "     coverage van in ban tho du overlay da phu"; P147OK=0; fi
if printf '%s' "$P147OUT" | grep -qF 'Hoán vị'; then echo "     row probe 0 van in ban tho du overlay da phu"; P147OK=0; fi
# hàng KHÔNG có overlay vẫn phải hiện (overlay không giấu được finding)
printf '%s' "$P147OUT" | grep -qF 'E1 ghim chữ SKILL' || { echo "     row probe khong overlay BIEN MAT — overlay dang giau duoc finding"; P147OK=0; }
# sev do script render, overlay không đè được
printf '%s' "$P147OUT" | grep -qF '<b>P0</b>' || { echo "     sev P0 khong con do script render"; P147OK=0; }
rm -rf "$P147WS"
if [ "$P147OK" -eq 1 ]; then
  pass "P147 round-trip card-plain: khuon key 2 chieu + overlay thay chu, khong giau hang, sev giu nguyen"
else
  fail "P147 round-trip card-plain: khuon key 2 chieu + overlay thay chu, khong giau hang, sev giu nguyen"
fi

# ── P148: MỌI fallback render text thô đều lột dấu máy (gwt, oos, decLine cả 3 chỗ) ──
# Quét theo LỚP: không chỉ Coverage/probe — willText/wontText (gwt), scopePlain
# (oos), decLine (Gate 1 + Gate 2 approved + Gate 2 provisional), d.q (critText)
# đều là đường fallback in text contract/ledger thô khi overlay vắng.
echo "P148 moi fallback tho lot dau may: gwt + oos + decLine (G1) + critText/decLine (G2)"
P148OK=1
P148WS="$(mktemp -d)"
mkdir -p "$P148WS/_acceptance/g1" "$P148WS/_acceptance/g2"
cat > "$P148WS/_acceptance/g1/contract.md" <<'EOF'
---
schema_version: 1
feature: fx
slug: g1
risk_tier: T2
status: draft
---

## Criteria

- AC-1: Given `input.csv` sẵn, When chạy **bộ nạp**, Then thấy **kết quả** đúng.

## Out of scope

- Hoãn phần **báo cáo** dài (đợt
  sau mới làm).
EOF
printf '%s\n' '{"id":"d-1","type":"descope","stage":"S1","decision":"KHÔNG làm **realtime**","impact":"chậm `5s`"}' > "$P148WS/_acceptance/g1/decisions.jsonl"
P148G1="$(node "$ROOT/scripts/gate-card.js" --root "$P148WS" --slug g1 --gate 1 2>&1)"; P148ST=$?
[ "$P148ST" -eq 0 ] || { echo "     gate-card G1 exit $P148ST: $P148G1"; P148OK=0; }
printf '%s' "$P148G1" | grep -qF 'thấy kết quả đúng' || { echo "     gwt fallback khong lot dau: thieu 'thấy kết quả đúng'"; P148OK=0; }
printf '%s' "$P148G1" | grep -qF 'đợt sau mới làm' || { echo "     oos bullet wrap cat cut hoac khong lot dau: thieu 'đợt sau mới làm'"; P148OK=0; }
printf '%s' "$P148G1" | grep -qF 'KHÔNG làm realtime' || { echo "     decLine G1 khong lot dau: thieu 'KHÔNG làm realtime'"; P148OK=0; }
printf '%s' "$P148G1" | grep -qF 'chậm 5s' || { echo "     decLine impact khong lot dau: thieu 'chậm 5s'"; P148OK=0; }
if printf '%s' "$P148G1" | grep -qF '**'; then echo "     G1 con '**' tho"; P148OK=0; fi
if printf '%s' "$P148G1" | grep -q '[`]'; then echo "     G1 con backtick tho"; P148OK=0; fi
cat > "$P148WS/_acceptance/g2/contract.md" <<'EOF'
---
schema_version: 1
feature: fx
slug: g2
risk_tier: T2
status: implemented
---

## Criteria

- AC-1: Given `input.csv` sẵn, When chạy **bộ nạp**, Then thấy **kết quả** đúng.
EOF
cat > "$P148WS/_acceptance/g2/evidence-report.md" <<'EOF'
---
verdict: PASS
---

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-1 | judgment | UNCERTAIN |
EOF
printf '%s\n%s\n%s\n' \
  '{"id":"d-1","type":"choice","stage":"S1","decision":"chọn đường **A** nhanh","impact":"bỏ `cache`"}' \
  '{"type":"seal","gate":"1"}' \
  '{"id":"d-2","type":"descope","stage":"S3","decision":"KHÔNG làm **offline**","impact":"cần `mạng`"}' \
  > "$P148WS/_acceptance/g2/decisions.jsonl"
P148G2="$(node "$ROOT/scripts/gate-card.js" --root "$P148WS" --slug g2 --gate 2 2>&1)"; P148ST=$?
[ "$P148ST" -eq 0 ] || { echo "     gate-card G2 exit $P148ST: $P148G2"; P148OK=0; }
printf '%s' "$P148G2" | grep -qF 'thấy kết quả đúng' || { echo "     critText fallback G2 khong lot dau"; P148OK=0; }
printf '%s' "$P148G2" | grep -qF 'chọn đường A nhanh' || { echo "     decLine G2 (approved) khong lot dau"; P148OK=0; }
printf '%s' "$P148G2" | grep -qF 'KHÔNG làm offline' || { echo "     decLine G2 (provisional) khong lot dau"; P148OK=0; }
if printf '%s' "$P148G2" | grep -qF '**'; then echo "     G2 con '**' tho"; P148OK=0; fi
if printf '%s' "$P148G2" | grep -q '[`]'; then echo "     G2 con backtick tho"; P148OK=0; fi
rm -rf "$P148WS"
if [ "$P148OK" -eq 1 ]; then
  pass "P148 lot dau may o moi fallback tho (gwt, oos wrap, decLine x3, critText)"
else
  fail "P148 lot dau may o moi fallback tho (gwt, oos wrap, decLine x3, critText)"
fi


# ── P149-P154: judge-required-evidence ───────────────────────────────────────
echo "P149 (JR4) khuon JUDGMENT-BLOCK-TEMPLATE round-trip qua evidence-core that"
run "P149 fixture sinh-tu-khuon -> recheck clean; mutant token cam -> do" \
  node - "$ROOT" <<'NODE'
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const ROOT = process.argv[2];
const tpl = fs.readFileSync(path.join(ROOT, 'skills/acceptance/references/evidence-report-template.md'), 'utf8');
const m = tpl.match(/<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->([\s\S]*?)<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->/);
if (!m) { console.error('thieu marker JUDGMENT-BLOCK-TEMPLATE'); process.exit(1); }
// SINH block tu khuon: thay placeholder {{...}} + dien override (round-trip writer that)
let block = m[1].trim().split('\n').filter(l => !l.trim().startsWith('<!--')).join('\n');
block = block.replace(/\{\{[^}]*\}\}/g, 'noi dung cu the du dai cho hook doc duoc o day')
  .replace(/- eval: E4/, '- eval: EJ')
  .replace(/required_evidence:\n\s+- .*$/m, 'required_evidence:\n    - anh chup state sau buoc 2 — lay bang capture.ui')
  .replace(/human_override:.*$/m, 'human_override: Manh 2026-08-05');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jr4-'));
const dir = path.join(root, '_acceptance', 'feat-jr4'); fs.mkdirSync(dir, { recursive: true });
const verifier = path.join(root, 'verify.sh'); fs.writeFileSync(verifier, '#!/bin/sh\nexit 0\n'); fs.chmodSync(verifier, 0o755);
fs.writeFileSync(path.join(dir, 'run-log.jsonl'), JSON.stringify({ ts: 't', round: 1, evalId: 'E1', run_id: 'jr4-E1-001', exit_code: 0, cmd: 'x' }) + '\n');
const report = `---\nschema_version: 1\nfeature_slug: feat-jr4\nverdict: PASS\nhuman_signoff: Manh 2026-08-05\n---\n\n## Evidence\n- eval: E1\n  run_id: jr4-E1-001\n  exit_code: 0\n  verifier: ${verifier}\n  verified_at: 2026-08-05\n${block}\n`;
fs.writeFileSync(path.join(dir, 'evidence-report.md'), report);
const run = (rp) => { try { cp.execFileSync('node', [path.join(ROOT, 'scripts/recheck-evidence.cjs'), rp], { stdio: 'ignore' }); return 0; } catch (e) { return e.status; } };
if (run(path.join(dir, 'evidence-report.md')) !== 0) { console.error('fixture sinh-tu-khuon bi evidence-core chan'); process.exit(1); }
fs.writeFileSync(path.join(dir, 'evidence-report.md'), report + '\nghi chu: verdict: FAIL\n');
if (run(path.join(dir, 'evidence-report.md')) !== 1) { console.error('mutant token cam khong bi chan'); process.exit(1); }
NODE

echo "P150 (JR5) gate-card hien 'Muon may doi y, can:' + duong doc-cu so voi BASE commit"
run "P150 required_evidence tren the + report cu render y het ban base" \
  bash -c '
    set -e
    T=$(mktemp -d)
    mkdir -p "$T/ws/_acceptance/feat-jr5"
    printf -- "---\nschema_version: 2\nfeature: feat-jr5 demo\nslug: feat-jr5\nrisk_tier: T3\nsurfaces: [cli]\nstatus: implemented\napproved_by: Manh Phan\n---\n\n## Criteria\n\n- AC-1: (judgment) Given a, When b, Then c.\n" > "$T/ws/_acceptance/feat-jr5/contract.md"
    printf -- "evals:\n  - id: EJ1\n    criterion: AC-1\n    executor: judgment\n    inputs: [contract.md]\n    question: \"on chua?\"\n" > "$T/ws/_acceptance/feat-jr5/evals.yaml"
    REP="$T/ws/_acceptance/feat-jr5/evidence-report.md"
    printf -- "---\nschema_version: 2\nfeature_slug: feat-jr5\nverdict: PENDING-JUDGMENT\n---\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| EJ1 | AC-1 | judgment | UNCERTAIN |\n\n## Evidence\n- eval: EJ1\n  judged_by: judge panel\n  verdict: UNCERTAIN\n  rationale: chua du can cu\n  required_evidence:\n    - anh chup man hinh saved-state — lay bang capture.ui\n  human_override:\n" > "$REP"
    OUT_NEW=$(cd "$T/ws" && node "'"$ROOT"'/scripts/gate-card.js" --slug feat-jr5 2>/dev/null)
    echo "$OUT_NEW" | grep -q "Muốn máy đổi ý, cần:" || { echo "thieu khoi bang-chung-con-thieu"; exit 1; }
    echo "$OUT_NEW" | grep -q "saved-state" || { echo "thieu noi dung muc"; exit 1; }
    # report CU (khong field) → stdout == stdout cua gate-card TAI BASE COMMIT
    printf -- "---\nschema_version: 2\nfeature_slug: feat-jr5\nverdict: PENDING-JUDGMENT\n---\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| EJ1 | AC-1 | judgment | UNCERTAIN |\n\n## Evidence\n- eval: EJ1\n  judged_by: judge panel\n  verdict: UNCERTAIN\n  rationale: chua du can cu\n  human_override:\n" > "$REP"
    BASE=$(git -C "'"$ROOT"'" merge-base HEAD origin/main)
    mkdir -p "$T/base/scripts"
    git -C "'"$ROOT"'" show "$BASE:scripts/gate-card.js" > "$T/base/scripts/gate-card.js"
    # lib phai lay TAI CUNG BASE, khong duoc ghep lib hien tai vao script base:
    # dot .cjs 1.39.1 lam ban ghep chet (base require lib/*.js, cay hien tai chi
    # con .cjs) — "ban base" phai la MOT cay base tron ven.
    git -C "'"$ROOT"'" archive "$BASE" lib | tar -x -C "$T/base"
    A=$(cd "$T/ws" && node "'"$ROOT"'/scripts/gate-card.js" --slug feat-jr5 2>/dev/null)
    B=$(cd "$T/ws" && node "$T/base/scripts/gate-card.js" --slug feat-jr5 2>/dev/null)
    [ -n "$A" ] || { echo "stdout moi rong"; exit 1; }
    # DOI-THUOC-CO-KHAI (chip (2) khoi-viec-cua-anh) — danh sach DONG cac thay
    # doi render co chu dich, moi thu co case canh rieng; phan CON LAI cua duong
    # doc-cu van phai byte-identical voi ban base:
    #   (1) khoi "👉 VIỆC CỦA ANH" tren THE     -> P185/P186/P186b/P187
    #   (2) ma tra cuu truoc cau hoi judgment -> P186 (assert QUAN HE ma-hien-trong-khoi-duoc-tro)
    #   (3) nhan "Treo-<n> · " truoc quyet dinh treo -> P186
    #   (4) nhan "Ngoài-<n> · " truoc finding ngoai hop dong -> P186
    #   (5) go loi hua " · ~5 phut" o phu de CA HAI cong (ho so cat-hinh-thuc,
    #       14/08) -> P185/P186 (assert the KHONG con hua phut + mutant chen lai)
    # Khi base vuot qua chip (2), cac phep loc thanh no-op vo hai.
    norm() { grep -v "VIỆC CỦA ANH" | sed -E "s/E[A-Za-z0-9]+ \(câu hỏi cần mắt người\) · //g; s/Treo-[0-9]+ · //g; s/Ngoài-[0-9]+ · //g; s/ · ~5 phút//g"; }
    A_CMP=$(printf "%s" "$A" | norm)
    B_CMP=$(printf "%s" "$B" | norm)
    [ "$A_CMP" = "$B_CMP" ] || { echo "report cu render KHAC ban base (ngoai 3 thay doi da khai) — duong doc-cu vo"; exit 1; }
  '

echo "P151 (JR7) persona co required_evidence + luat actionable + chong evidence-shopping"
run "P151 clauses + mutant per-clause" \
  python3 - "$ROOT/skills/acceptance/references/judge-personas.md" <<'PY'
import re, sys
s = open(sys.argv[1], encoding='utf-8').read()
clauses = [
    r'required_evidence:\s+# MANDATORY when verdict is FAIL or UNCERTAIN; omit on PASS',
    r'if this existed the verdict would change',
    r'every item must be ACTIONABLE',
    r'no evidence-shopping',
]
for c in clauses:
    m = re.search(c, s)
    assert m, f'thieu clause: {c}'
    mutated = s.replace(m.group(0), '')
    assert not re.search(c, mutated), f'detector khong phan biet ban xoa: {c}'
PY

echo "P152 (JR8) so vang: corpus that >=7 diem du 4 truong + fixture 2 chieu"
run "P152 gold points tren corpus that + fixture doi chung" \
  node - "$ROOT" <<'NODE'
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const ROOT = process.argv[2];
const real = JSON.parse(cp.execFileSync('node', [path.join(ROOT, 'scripts/acceptance-gold.mjs'), '--root', ROOT, '--json'], { encoding: 'utf8' }));
// Chan sanity DOC LAP (measure-teeth-cleanup AC-6): judgedBlocks cu tang cung
// nhip voi points (cung nhanh code) nen la hang dung; judgmentBlocks tu --stats
// dem bang nhanh rieng — =0 trong khi corpus co block phan la reader hong.
const st = JSON.parse(cp.execFileSync('node', [path.join(ROOT, 'scripts/acceptance-gold.mjs'), '--root', ROOT, '--stats'], { encoding: 'utf8' }));
if (st.judgmentBlocks <= 0) { console.error('sanity doc lap: 0 block phan doc duoc (--stats)'); process.exit(1); }
if (st.judgmentBlocks < real.points.length) { console.error('bat dang thuc vo: phan < diem'); process.exit(1); }
if (real.points.length < 7) { console.error('corpus that <7 diem: ' + real.points.length); process.exit(1); }
for (const p of real.points) if (!p.slug || !p.evalId || !p.machine || !p.human) { console.error('diem thieu truong: ' + JSON.stringify(p)); process.exit(1); }
const mk = (override) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jr8-'));
  const dir = path.join(root, '_acceptance', 's1'); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'evidence-report.md'),
    `---\nverdict: PASS\n---\n\n## Evidence\n- eval: EJ\n  judged_by: panel\n  verdict: FAIL\n  rationale: x\n${override ? '  human_override: Manh 2026-08-05 — dong y known-limits\n' : '  human_override:\n'}`);
  return JSON.parse(cp.execFileSync('node', [path.join(ROOT, 'scripts/acceptance-gold.mjs'), '--root', root, '--json'], { encoding: 'utf8' }));
};
const with_ = mk(true), without = mk(false);
if (with_.points.length !== 1 || with_.points[0].machine !== 'FAIL' || !/known-limits/.test(with_.points[0].human)) { console.error('fixture co override phai ra dung 1 diem: ' + JSON.stringify(with_.points)); process.exit(1); }
if (without.points.length !== 0) { console.error('fixture khong override phai 0 diem'); process.exit(1); }
// AC-8 fix S4-r2: excerpt trong block scalar KHONG duoc duc diem vang bia
const mkScalar = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jr8s-'));
  const dir = path.join(root, '_acceptance', 's1'); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'evidence-report.md'),
    `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E1\n  run_id: x-001\n  exit_code: 0\n  output: |\n    trich log co chua:\n    judged_by: panel\n    verdict: FAIL\n    human_override: Ghost 2026-01-01 — diem bia tu log\n  verifier: v.sh\n`);
  return JSON.parse(cp.execFileSync('node', [path.join(ROOT, 'scripts/acceptance-gold.mjs'), '--root', root, '--json'], { encoding: 'utf8' }));
};
const scalar = mkScalar();
if (scalar.points.length !== 0) { console.error('excerpt block-scalar duc ra diem vang bia: ' + JSON.stringify(scalar.points)); process.exit(1); }
NODE

echo "P153 (JR9) G3: ma tran 3 hinh dang dong thuan + grandfather log cu + corpus that"
run "P153 agreement buckets + noPanel + corpus >=5 panel" \
  node - "$ROOT" <<'NODE'
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const ROOT = process.argv[2];
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jr9-'));
const mkws = (slug, lines) => {
  const dir = path.join(root, '_acceptance', slug); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'evidence-report.md'), '---\nverdict: PASS\n---\n');
  if (lines !== null) fs.writeFileSync(path.join(dir, 'run-log.jsonl'), lines.map(l => JSON.stringify(l)).join('\n') + '\n');
};
const panel = (id, verdicts) => ({ ts: 't', round: 1, evalId: id, kind: 'panel', proposal: 'UNCERTAIN', votes: verdicts.map((v, i) => ({ lens: 'l' + i, verdict: v })), inputs_hash: 'h' });
mkws('sA', [panel('E1', ['PASS', 'PASS', 'PASS'])]);          // 3/3
mkws('sB', [panel('E1', ['PASS', 'PASS', 'FAIL'])]);          // 2/1
mkws('sC', [panel('E1', ['PASS', 'FAIL', 'UNCERTAIN'])]);     // phan ky
mkws('sOld', null);                                            // log cu: khong run-log
const d = JSON.parse(cp.execFileSync('node', [path.join(ROOT, 'scripts/acceptance-gold.mjs'), '--root', root, '--json'], { encoding: 'utf8' }));
const b = d.agreement.buckets;
if (d.agreement.sample !== 3 || b.unanimous !== 1 || b.majority !== 1 || b.split !== 1) { console.error('buckets sai: ' + JSON.stringify(d.agreement)); process.exit(1); }
if (!d.noPanel.includes('sOld')) { console.error('grandfather: sOld phai nam trong noPanel'); process.exit(1); }
const real = JSON.parse(cp.execFileSync('node', [path.join(ROOT, 'scripts/acceptance-gold.mjs'), '--root', ROOT, '--json'], { encoding: 'utf8' }));
if (real.agreement.sample < 5) { console.error('corpus that <5 panel tuoi: ' + real.agreement.sample); process.exit(1); }
NODE

echo "P154 (JR10) lenh tong ket goi acceptance-gold + in 2 khoi tieng nguoi"
run "P154 command clauses + mutant" \
  python3 - "$ROOT/commands/acceptance-report.md" <<'PY'
import re, sys
s = open(sys.argv[1], encoding='utf-8').read()
clauses = [r'acceptance-gold\.mjs --root', r'Sổ vàng', r'đồng thuận tới đâu', r'sổ vàng chưa đọc được']
for c in clauses:
    m = re.search(c, s)
    assert m, f'thieu clause: {c}'
    assert not re.search(c, s.replace(m.group(0), '', 1)) or len(re.findall(c, s)) > 1, f'detector khong phan biet: {c}'
PY

echo "P155 (E9) tu dien biet ngu: SIGNOFF-JARGON-GLOSS subset HFL-GLOSSARY-TERMS + co muc CONTEXT.md"
run "P155 gloss marker subset + CONTEXT + mutant" \
  python3 - "$ROOT" <<'P155PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
law = (root / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8")
ctx = (root / "CONTEXT.md").read_text(encoding="utf-8")

GLOSS_RE = r"<!-- <<<SIGNOFF-JARGON-GLOSS -->\n([\s\S]*?)<!-- SIGNOFF-JARGON-GLOSS>>> -->"
TERMS_RE = r"<!-- <<<HFL-GLOSSARY-TERMS -->\n([\s\S]*?)<!-- HFL-GLOSSARY-TERMS>>> -->"

def gloss_of(text):
    m = re.search(GLOSS_RE, text)
    if not m:
        return None
    out = {}
    for l in m.group(1).splitlines():
        l = l.strip()
        if l.startswith("- ") and " — " in l:
            term, gl = l[2:].split(" — ", 1)
            out[term.strip()] = gl.strip()
    return out

def terms_of(text):
    m = re.search(TERMS_RE, text)
    return None if not m else [l.strip()[2:].strip() for l in m.group(1).splitlines() if l.strip().startswith("- ")]

g = gloss_of(law)
assert g is not None, "KHONG rut duoc SIGNOFF-JARGON-GLOSS"
assert len(g) >= 3, "chi rut duoc %d tu — parser hong hoac khoi rong" % len(g)
MUST = ["known-limits", "dogfood", "single-source"]
missing = [x for x in MUST if x not in g]
assert not missing, "khoi gloss thieu tu bat buoc: %s" % missing
for term, gl in g.items():
    assert 3 <= len(gl.split()) <= 14, "chu giai cua '%s' dai/ngan bat thuong: %r" % (term, gl)

terms = terms_of(law)
assert terms, "KHONG rut duoc HFL-GLOSSARY-TERMS"
def check_subset(gl, tl):
    return ["gloss term ngoai HFL-GLOSSARY-TERMS: %s" % x for x in gl if x not in tl]
assert check_subset(g, terms) == [], check_subset(g, terms)

def check_ctx(glossary_text, gl):
    return ["tu '%s' chua co muc trong tu dien" % x for x in gl
            if not re.search(r"^\*\*%s\*\*:" % re.escape(x), glossary_text, re.M | re.I)]
assert check_ctx(ctx, g) == [], check_ctx(ctx, g)

mut_law = law.replace("<!-- SIGNOFF-JARGON-GLOSS>>> -->",
                      "- zzz-khong-co-that — tu bia de thu rang cua phep do\n<!-- SIGNOFF-JARGON-GLOSS>>> -->", 1)
mg = gloss_of(mut_law)
assert mg is not None and "zzz-khong-co-that" in mg, "tiem that bai — mutant khong vao duoc khoi"
assert check_subset(mg, terms_of(mut_law)) == ["gloss term ngoai HFL-GLOSSARY-TERMS: zzz-khong-co-that"], \
    "tiem term la vao gloss ma phep kiem subset khong bao — rang tu-gac"

first = MUST[0]
mut_ctx = re.sub(r"^\*\*%s\*\*:.*?(?=^\*\*|\Z)" % re.escape(first), "", ctx, count=1, flags=re.M | re.S | re.I)
assert check_ctx(mut_ctx, g) == ["tu '%s' chua co muc trong tu dien" % first], \
    "go muc CONTEXT.md that ma phep kiem khong bao thieu"
P155PY

echo "P156 (E7,E8) so vang doc tu dien: ma tran 2 surface x 2 chieu + HFL vang no to"
run "P156 khoi Tu dien round-trip + fallback" \
  python3 - "$ROOT" <<'P156PY'
import json, os, re, shutil, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
GOLD = root / "scripts/acceptance-gold.mjs"
law = (root / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8")

# term + chu giai rut TU MARKER THAT (khong chep tay khuon ben doc)
m = re.search(r"<!-- <<<SIGNOFF-JARGON-GLOSS -->\n([\s\S]*?)<!-- SIGNOFF-JARGON-GLOSS>>> -->", law)
assert m, "khong rut duoc SIGNOFF-JARGON-GLOSS — fixture khong dung nguon that"
gloss = {}
for l in m.group(1).splitlines():
    l = l.strip()
    if l.startswith("- ") and " — " in l:
        k, v = l[2:].split(" — ", 1)
        gloss[k.strip()] = v.strip()
assert len(gloss) >= 2, "can >=2 term de chay ma tran 2 surface"
T_HUMAN, T_ITEM = sorted(gloss)[0], sorted(gloss)[1]

def mkws(base, human_extra="", question_extra=""):
    """Sinh workspace bang CODE (khong viet tay khuon ben doc)."""
    ws = Path(base) / "_acceptance" / "vi-du-mot"
    (ws / "evidence").mkdir(parents=True, exist_ok=True)
    (ws / "contract.md").write_text(
        "---\nschema_version: 2\nfeature: \"Việc ví dụ một — mô tả cho người\"\n"
        "slug: vi-du-mot\nrisk_tier: T2\n---\n", encoding="utf-8")
    (ws / "evals.yaml").write_text(
        "evals:\n  - id: J9\n    executor: judgment\n    question: >\n      Câu hỏi chấm %s\n" % question_extra,
        encoding="utf-8")
    (ws / "evidence-report.md").write_text(
        "## Per-eval\n\n- eval: J9\n  judged_by: panel\n  proposal: UNCERTAIN\n"
        "  rationale: lý do máy nêu ngắn\n  human_override: Manh Phan 2026-08-05 — quyết giữ %s\n" % human_extra,
        encoding="utf-8")
    (ws / "run-log.jsonl").write_text("", encoding="utf-8")
    return ws

def run_gold(rootdir, script=None):
    out = subprocess.run(["node", str(script or GOLD), "--root", str(rootdir)],
                         capture_output=True, text=True)
    assert out.returncode == 0, "gold exit %d: %s" % (out.returncode, out.stderr[-400:])
    return out.stdout

def dict_block(stdout):
    """Rut cac term duoc chu giai o khoi Tu dien cua STDOUT."""
    mm = re.search(r"## Từ điển[^\n]*\n([\s\S]*)$", stdout)
    if not mm:
        return {}
    got = {}
    for l in mm.group(1).splitlines():
        l = l.strip()
        if l.startswith("- ") and " — " in l:
            k, v = l[2:].split(" — ", 1)
            got[k.strip()] = v.strip()
    return got

# --- O1: term o LOI NGUOI -> Tu dien hien, chu giai DUNG tu marker ---
with tempfile.TemporaryDirectory() as d:
    mkws(d, human_extra="theo %s" % T_HUMAN)
    got = dict_block(run_gold(d))
    assert T_HUMAN in got, "term o loi nguoi khong vao Tu dien: %s (got=%s)" % (T_HUMAN, list(got))
    assert got[T_HUMAN] == gloss[T_HUMAN], "chu giai lech marker: %r != %r" % (got[T_HUMAN], gloss[T_HUMAN])

# --- O2: term CHI o HANG MUC (cau hoi eval) -> van hien ---
with tempfile.TemporaryDirectory() as d:
    mkws(d, human_extra="quyet giu nguyen", question_extra="ve %s cua khoi nay" % T_ITEM)
    got = dict_block(run_gold(d))
    assert T_ITEM in got, "term chi o hang muc khong vao Tu dien: %s (got=%s)" % (T_ITEM, list(got))

# --- O3+O4: term KHONG xuat hien o surface nao -> KHONG in (2 chieu) ---
with tempfile.TemporaryDirectory() as d:
    mkws(d, human_extra="quyet giu nguyen", question_extra="ve mot thu khac han")
    got = dict_block(run_gold(d))
    for term in (T_HUMAN, T_ITEM):
        assert term not in got, "term khong xuat hien ma van in trong Tu dien: %s" % term

# --- AC-8: script o vi tri khong tra duoc HFL -> van in so + DUNG 1 dong ghi chu ---
NOTE = "từ điển biệt ngữ không nạp được"
with tempfile.TemporaryDirectory() as d:
    ws_base = Path(d) / "corpus"
    mkws(ws_base, human_extra="theo %s" % T_HUMAN)
    lonely = Path(d) / "roi-ra" / "acceptance-gold.mjs"
    lonely.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy(GOLD, lonely)
    out_lonely = run_gold(ws_base, script=lonely)
    assert "## Sổ vàng" in out_lonely and "Các giám khảo đồng thuận" in out_lonely, \
        "HFL vang lam mat khoi chinh cua so — phai van in du"
    assert out_lonely.count(NOTE) == 1, "HFL vang phai co DUNG 1 dong ghi chu (dem=%d)" % out_lonely.count(NOTE)
    # doi chung DUONG: o vi tri that thi KHONG co dong ghi chu
    out_real = run_gold(ws_base)
    assert NOTE not in out_real, "vi tri that ma van bao khong nap duoc tu dien"
P156PY

echo "P157 (E2,E4,E5) ba luat ngon ngu co hoc: enum ma tran, moi goc nhin mot dong, cau trung tinh"
run "P157 verdict-vi + lens-per-line + noPanel" \
  python3 - "$ROOT" <<'P157PY'
import json, re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
GOLD = root / "scripts/acceptance-gold.mjs"
src = GOLD.read_text(encoding="utf-8")

def run_gold(rootdir):
    out = subprocess.run(["node", str(GOLD), "--root", str(rootdir)], capture_output=True, text=True)
    assert out.returncode == 0, "gold exit %d: %s" % (out.returncode, out.stderr[-400:])
    return out.stdout

def mkslug(base, slug, proposal="UNCERTAIN", contract=True, panel_votes=None):
    ws = Path(base) / "_acceptance" / slug
    ws.mkdir(parents=True, exist_ok=True)
    if contract:
        (ws / "contract.md").write_text(
            "---\nschema_version: 2\nfeature: \"Tên sản phẩm của %s — mô tả\"\nslug: %s\n---\n" % (slug, slug),
            encoding="utf-8")
    (ws / "evals.yaml").write_text("evals:\n  - id: J1\n    executor: judgment\n    question: >\n      Câu hỏi chấm cho %s\n" % slug, encoding="utf-8")
    (ws / "evidence-report.md").write_text(
        "## Per-eval\n\n- eval: J1\n  judged_by: panel\n  proposal: %s\n  rationale: lý do máy\n"
        "  human_override: Manh Phan 2026-08-05 — quyết giữ nguyên\n" % proposal, encoding="utf-8")
    if panel_votes is None:
        (ws / "run-log.jsonl").write_text("", encoding="utf-8")
    else:
        (ws / "run-log.jsonl").write_text(json.dumps(
            {"kind": "panel", "evalId": "J1", "proposal": proposal, "votes": panel_votes}) + "\n", encoding="utf-8")
    return ws

# ── (a) MA TRAN ENUM: so case = so phan tu VERDICT_VI (dem TU SOURCE) + 1 la ──
mm = re.search(r"const VERDICT_VI = \{([\s\S]*?)\}", src)
assert mm, "khong thay map VERDICT_VI trong source — luat phai dat MOT cho"
enum_pairs = re.findall(r"(\w+):\s*'([^']+)'", mm.group(1))
enum_vi = dict(enum_pairs)
enum_keys = [k for k, _ in enum_pairs]
assert len(enum_keys) >= 3, "map VERDICT_VI chi co %d phan tu" % len(enum_keys)
cases = list(enum_keys) + ["WEIRD"]
assert len(cases) == len(enum_keys) + 1, "so case phai bang so phan tu map + 1"
for code in cases:
    with tempfile.TemporaryDirectory() as d:
        mkslug(d, "vi-du", proposal=code)
        out = run_gold(d)
        row = [l for l in out.splitlines() if l.startswith("| ") and "vi-du" in l]
        assert row, "khong thay hang bang cho case %s" % code
        cell = row[0].split("|")[3].strip()
        if code == "WEIRD":
            assert cell == "WEIRD", "gia tri la phai passthrough nguyen van, got %r" % cell
        else:
            # QUAN HE map=>render: o phai bang DUNG gia tri trong VERDICT_VI cua
            # source. Ban truoc chi khop hinh dang "<chu> (MA)" nen doi mot nghia
            # trong map (vd FAIL -> "dat") van xanh — do chuoi, khong do quan he.
            want = "%s (%s)" % (enum_vi[code], code)
            assert cell == want, "enum %s phai render %r theo map trong source, got %r" % (code, want, cell)

# ── (b) MOI GOC NHIN MOT DONG: quan he so-lens-vao => so-dong-ra ──
LENSES = ["domain-correctness", "operational-feasibility", "spec-alignment"]
# hoi dong <2 phieu khong vao mau (agreement loc votes>=2), nen quet 2 va 3 lens
for n in (2, 3):
    with tempfile.TemporaryDirectory() as d:
        votes = [{"lens": LENSES[i], "verdict": "PASS" if i else "FAIL"} for i in range(n)]
        mkslug(d, "vi-du", panel_votes=votes)
        out = run_gold(d)
        lines = [l for l in out.splitlines() if re.match(r"^- .*: \d+/\d+ lần", l)]
        assert len(lines) == n, "%d goc nhin vao phai ra %d dong, got %d: %r" % (n, n, len(lines), lines)

# ── (c) noPanel: moi viec mot dong, ten san pham + fallback, khong khang dinh nguyen nhan ──
NEUTRAL_CHECK = "Sổ không suy đoán vì sao thiếu"
with tempfile.TemporaryDirectory() as d:
    mkslug(d, "co-hop-dong", contract=True)
    mkslug(d, "khong-hop-dong", contract=False)
    out = run_gold(d)
    # Do PROPERTY chu khong ghim mot chuoi: moi menh de NHAN-QUA ve du lieu
    # thieu deu vi pham AC-5. Ban truoc ghim dung 1 chuoi nen nhanh con lai
    # (khong co hoi dong nao) van khang dinh nguyen nhan ma test xanh (S4-r1).
    CAUSAL = ["chấm trước khi", "do máy chưa", "vì hồ sơ", "bởi vì"]
    for c in CAUSAL:
        assert c not in out, "sổ khang dinh nguyen nhan thieu du lieu: %r" % c
    # ...VA nhanh KHONG-CO-HOI-DONG-NAO cung phai sach (day la ca pho bien nhat
    # o repo tieu thu moi tinh) — sinh corpus rieng, khong panel o bat ky slug nao
    with tempfile.TemporaryDirectory() as d2:
        mkslug(d2, "chua-cham")
        out2 = run_gold(d2)
        for c in CAUSAL:
            assert c not in out2, "nhanh khong-co-hoi-dong-nao khang dinh nguyen nhan: %r" % c
        # doi chung DUONG: cau trung tinh MOT CHO phai co mat o CA HAI nhanh
        NEUTRAL = "Sổ không suy đoán vì sao thiếu"
        assert NEUTRAL in out2, "nhanh khong-co-hoi-dong thieu cau trung tinh"
    assert NEUTRAL_CHECK in out, "nhanh co-viec-khong-panel thieu cau trung tinh"
    # cat DUNG khoi chua-co-bien-ban (dem tren ca so se lan sang bang vang)
    mblock = re.search(r"^\d+ việc chưa có biên bản hội đồng trong hồ sơ\.[^\n]*\n([\s\S]*?)(?=\n##|\n\n|\Z)", out, re.M)
    assert mblock, "khong thay khoi chua-co-bien-ban trong STDOUT"
    items = [l for l in mblock.group(1).splitlines() if l.strip().startswith("- ")]
    assert len(items) == 2, "2 viec khong panel phai ra DUNG 2 dong, got %d: %r" % (len(items), items)
    named = [l for l in items if "Tên sản phẩm của co-hop-dong" in l]
    raw = [l for l in items if l.strip() == "- khong-hop-dong"]
    assert len(named) == 1, "slug co contract phai hien ten san pham: %r" % items
    assert len(raw) == 1, "slug thieu contract phai fallback slug tho: %r" % items
P157PY

echo "P158 (E1,E6) bang vang round-trip 4 cot + doi chung doi-gia-tri + root sai no to"
run "P158 bang vang quan he vao=>ra + fail-loud root" \
  python3 - "$ROOT" <<'P158PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
GOLD = root / "scripts/acceptance-gold.mjs"

FIX = {"feature": "Việc mẫu số một", "question": "Câu hỏi chấm mẫu số một",
       "verdict": "FAIL", "human": "Manh Phan 2026-08-05 — quyết cho qua vì lý do mẫu"}

def mkws(base, over=None):
    """Sinh workspace bang CODE tu dict FIX (doi 1 truong = doi 1 o mong doi)."""
    f = dict(FIX); f.update(over or {})
    ws = Path(base) / "_acceptance" / "viec-mau"
    ws.mkdir(parents=True, exist_ok=True)
    (ws / "contract.md").write_text(
        "---\nschema_version: 2\nfeature: \"%s\"\nslug: viec-mau\n---\n" % f["feature"], encoding="utf-8")
    (ws / "evals.yaml").write_text(
        "evals:\n  - id: J1\n    executor: judgment\n    question: >\n      %s\n" % f["question"], encoding="utf-8")
    body = "## Per-eval\n\n- eval: J1\n  judged_by: panel\n  proposal: %s\n  rationale: lý do máy\n" % f["verdict"]
    if f["human"] is not None:
        body += "  human_override: %s\n" % f["human"]
    (ws / "evidence-report.md").write_text(body, encoding="utf-8")
    (ws / "run-log.jsonl").write_text("", encoding="utf-8")
    return f

def run_gold(rootdir, expect_ok=True):
    out = subprocess.run(["node", str(GOLD), "--root", str(rootdir)], capture_output=True, text=True)
    if expect_ok:
        assert out.returncode == 0, "gold exit %d: %s" % (out.returncode, out.stderr[-300:])
    return out

def row_of(stdout):
    rows = [l for l in stdout.splitlines() if l.startswith("| ") and "---" not in l and "Việc |" not in l]
    return None if not rows else [c.strip() for c in rows[0].strip("|").split("|")]

# ── doi chung DUONG: 1 diem vang, 4 cot khop du lieu fixture ──
with tempfile.TemporaryDirectory() as d:
    f = mkws(d)
    cells = row_of(run_gold(d).stdout)
    assert cells and len(cells) == 4, "bang phai co dung 1 hang 4 cot, got %r" % (cells,)
    assert f["feature"] in cells[0] and "viec-mau" in cells[0], "cot Viec khong khop fixture: %r" % cells[0]
    assert "J1" in cells[1] and f["question"][:20] in cells[1], "cot Hang muc khong khop fixture: %r" % cells[1]
    assert f["verdict"] in cells[2], "cot May de xuat khong khop fixture: %r" % cells[2]
    assert "Manh Phan" in cells[3] and "lý do mẫu" in cells[3], "cot Nguoi quyet khong khop fixture: %r" % cells[3]

# ── doi chung AM 1 (XOA): bo human_override -> hang bien mat ──
with tempfile.TemporaryDirectory() as d:
    mkws(d, {"human": None})
    assert row_of(run_gold(d).stdout) is None, "xoa human_override ma hang van con — duong loc hong"

# ── doi chung AM 2 (DOI GIA TRI): tung truong mot, DUNG o do phai doi theo ──
MUT = [("feature", "Việc mẫu ĐÃ ĐỔI", 0), ("question", "Câu hỏi ĐÃ ĐỔI hoàn toàn", 1),
       ("verdict", "PASS", 2), ("human", "Manh Phan 2026-08-05 — lý do ĐÃ ĐỔI hẳn", 3)]
with tempfile.TemporaryDirectory() as d:
    mkws(d)
    base_cells = row_of(run_gold(d).stdout)
for field, newval, col in MUT:
    with tempfile.TemporaryDirectory() as d:
        mkws(d, {field: newval})
        cells = row_of(run_gold(d).stdout)
        assert cells, "mutant %s lam mat hang" % field
        assert cells[col] != base_cells[col], \
            "doi truong '%s' ma cot %d KHONG doi (%r) — assert dang do chuoi-co-mat chu khong do quan he" % (field, col, cells[col])
        for other in range(4):
            if other != col:
                assert cells[other] == base_cells[other], \
                    "doi truong '%s' lam doi ca cot %d — cot khong doc lap" % (field, other)

# ── AC-6: root khong co _acceptance/ -> no to; root co _acceptance/ rong -> exit 0 ──
with tempfile.TemporaryDirectory() as d:
    out = run_gold(d, expect_ok=False)
    assert out.returncode != 0, "root khong co _acceptance/ ma van exit 0 — so rong tu tin"
    msg = (out.stderr + out.stdout)
    assert "_acceptance" in msg and str(d) in msg, "thong diep loi phai neu path va thu muc thieu: %r" % msg[-200:]
with tempfile.TemporaryDirectory() as d:
    (Path(d) / "_acceptance").mkdir()
    out = run_gold(d)
    assert out.returncode == 0, "corpus RONG hop le phai exit 0"
    assert "Sổ vàng" in out.stdout, "corpus rong phai in so trong hop le"
P158PY

echo "P159 (E3) ma tran dong thuan TOAN PHAN: 4 hinh dang x 3 chieu = 12 o"
run "P159 agreement 4x3 ke ca nhanh chan" \
  node - "$ROOT" <<'P159JS'
const path = require('path');
const ROOT = process.argv[2];
(async () => {
  const mod = await import(path.join(ROOT, 'scripts/acceptance-gold.mjs'));
  const { agreement } = mod;
  const L = ['domain-correctness', 'operational-feasibility', 'spec-alignment'];
  const v = (lens, verdict) => ({ lens, verdict });

  // MA TRAN VIET-TRUOC: 4 hinh dang x 3 chieu (bucket, lensTotal, lensUncertain).
  // Nhanh chan 2/2 la nhanh CHUA TUNG co test — dung o day no co 3 o rieng.
  const MATRIX = [
    { name: '3/3 dong y', votes: [v(L[0],'PASS'), v(L[1],'PASS'), v(L[2],'PASS')],
      bucket: 'unanimous', total: { [L[0]]:1, [L[1]]:1, [L[2]]:1 }, uncertain: {} },
    { name: '2-tren-1',   votes: [v(L[0],'PASS'), v(L[1],'PASS'), v(L[2],'FAIL')],
      bucket: 'majority',  total: { [L[0]]:1, [L[1]]:1, [L[2]]:1 }, uncertain: { [L[2]]:1 } },
    { name: 'phan ky han',votes: [v(L[0],'PASS'), v(L[1],'FAIL'), v(L[2],'UNCERTAIN')],
      bucket: 'split',     total: { [L[0]]:1, [L[1]]:1, [L[2]]:1 }, uncertain: { [L[1]]:1, [L[2]]:1 } },
    { name: 'hoa 2-2',    votes: [v(L[0],'PASS'), v(L[1],'PASS'), v(L[0],'FAIL'), v(L[1],'FAIL')],
      bucket: 'split',     total: { [L[0]]:2, [L[1]]:2 }, uncertain: { [L[0]]:1, [L[1]]:1 } },
  ];
  const DIMS = ['bucket', 'lensTotal', 'lensUncertain'];
  const expectedAsserts = MATRIX.length * DIMS.length;   // = 12, dem TU ma tran
  let ran = 0;
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  for (const row of MATRIX) {
    const g = agreement([{ slug: 's', evalId: 'J1', proposal: 'X', votes: row.votes }]);
    // chieu 1: bucket
    const hot = Object.entries(g.buckets).filter(([, n]) => n > 0).map(([k]) => k);
    if (!eq(hot, [row.bucket])) {
      console.error(`[${row.name}] bucket sai: cho ${row.bucket}, got ${JSON.stringify(g.buckets)}`);
      process.exit(1);
    }
    ran++;
    // chieu 2: lensTotal
    if (!eq(g.lensTotal, row.total)) {
      console.error(`[${row.name}] lensTotal sai: cho ${JSON.stringify(row.total)}, got ${JSON.stringify(g.lensTotal)}`);
      process.exit(1);
    }
    ran++;
    // chieu 3: lensUncertain
    if (!eq(g.lensUncertain, row.uncertain)) {
      console.error(`[${row.name}] lensUncertain sai: cho ${JSON.stringify(row.uncertain)}, got ${JSON.stringify(g.lensUncertain)}`);
      process.exit(1);
    }
    ran++;
  }
  if (ran !== expectedAsserts) {
    console.error(`ma tran chua quet du: chay ${ran}/${expectedAsserts} o`);
    process.exit(1);
  }
  // sanity: so o dem tu MA TRAN, khong phai hang so go tay
  if (expectedAsserts !== 12) {
    console.error(`ma tran doi hinh dang (${expectedAsserts} o) — cap nhat contract AC-3 truoc khi doi test`);
    process.exit(1);
  }
  console.log(`P159 OK (${ran} o ma tran, ke ca nhanh hoa 2-2)`);
})().catch(e => { console.error(e); process.exit(1); });
P159JS

echo "P160 (E10) duong doc-cu tren ho so CU + xuat xu van ban giam khao doc"
run "P160 --json hinh dang cu + provenance gold-stdout" \
  python3 - "$ROOT" <<'P160PY'
import json, re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
GOLD = root / "scripts/acceptance-gold.mjs"

def gold(rootdir, js=False):
    cmd = ["node", str(GOLD), "--root", str(rootdir)] + (["--json"] if js else [])
    out = subprocess.run(cmd, capture_output=True, text=True)
    assert out.returncode == 0, "gold exit %d: %s" % (out.returncode, out.stderr[-300:])
    return json.loads(out.stdout) if js else out.stdout

# ── (1) HO SO DOI CU: report khong co required_evidence, run-log khong panel,
#     block-scalar trong report — bản mới phải doc y nhu truoc (ma tran 3 hinh dang) ──
with tempfile.TemporaryDirectory() as d:
    acc = Path(d) / "_acceptance"
    # a) ho so cu co override + KHONG co dong panel
    a = acc / "ho-so-cu"; a.mkdir(parents=True)
    (a / "contract.md").write_text("---\nfeature: \"Việc đời cũ\"\nslug: ho-so-cu\n---\n", encoding="utf-8")
    (a / "evidence-report.md").write_text(
        "- eval: J1\n  judged_by: panel\n  verdict: UNCERTAIN\n  human_override: Manh Phan 2026-01-01 — cho qua\n",
        encoding="utf-8")
    (a / "run-log.jsonl").write_text('{"kind":"eval","evalId":"E1","exit_code":0}\n', encoding="utf-8")
    # b) ho so co BLOCK SCALAR chua chu human_override trong trich log -> KHONG duoc thanh diem
    b = acc / "co-block-scalar"; b.mkdir(parents=True)
    (b / "evidence-report.md").write_text(
        "- eval: J2\n  judged_by: panel\n  verdict: PASS\n  output: |\n"
        "    human_override: Ai Do 2026-01-01 — dong nay chi la trich log\n",
        encoding="utf-8")
    (b / "run-log.jsonl").write_text(
        json.dumps({"kind": "panel", "evalId": "J2", "proposal": "PASS",
                    "votes": [{"lens": "spec-alignment", "verdict": "PASS"},
                              {"lens": "domain-correctness", "verdict": "PASS"}]}) + "\n", encoding="utf-8")
    # c) panel CARRIED khong duoc dem lai
    c = acc / "co-carried"; c.mkdir(parents=True)
    (c / "evidence-report.md").write_text("- eval: J3\n  judged_by: panel\n  verdict: PASS\n", encoding="utf-8")
    (c / "run-log.jsonl").write_text(
        json.dumps({"kind": "panel", "evalId": "J3", "proposal": "PASS", "carried_from_round": 1,
                    "votes": [{"lens": "spec-alignment", "verdict": "PASS"},
                              {"lens": "domain-correctness", "verdict": "FAIL"}]}) + "\n", encoding="utf-8")
    j = gold(d, js=True)
    assert len(j["points"]) == 1, "ho so cu: cho 1 diem vang, got %d" % len(j["points"])
    assert j["points"][0]["slug"] == "ho-so-cu", "diem vang sai slug: %r" % j["points"][0]
    assert j["noPanel"] == ["ho-so-cu"], "slug khong panel phai vao noPanel, got %r" % j["noPanel"]
    assert j["agreement"]["sample"] == 1, "carried khong duoc vao mau: sample=%d" % j["agreement"]["sample"]
    assert j["agreement"]["buckets"]["unanimous"] == 1, "hoi dong 2/2 dong y phai la unanimous"

# ── (1b) DUONG DOC-CU THAT SU: so --json cua ban HIEN TAI voi ban TRUOC-DIFF
#     sinh trong CHINH lan chay (git show <base>:...). Ban truoc chi so script
#     voi CHINH NO nen khong the do duoc "parser co doi hanh vi khong" (S4-r1).
base_sha = subprocess.run(["git", "-C", str(root), "merge-base", "HEAD", "04d3413"],
                          capture_output=True, text=True)
if base_sha.returncode != 0:
    base_sha = subprocess.run(["git", "-C", str(root), "rev-parse", "04d3413"], capture_output=True, text=True)
assert base_sha.returncode == 0, "khong resolve duoc base commit: %s" % base_sha.stderr[-200:]
BASE = base_sha.stdout.strip()
show = subprocess.run(["git", "-C", str(root), "show", "%s:scripts/acceptance-gold.mjs" % BASE],
                      capture_output=True, text=True)
assert show.returncode == 0 and len(show.stdout) > 500, \
    "khong lay duoc ban TRUOC-DIFF cua script tai %s: %s" % (BASE, show.stderr[-200:])
with tempfile.TemporaryDirectory() as d:
    # dat ban base DUNG do sau trong cay lam viec de duong `..` cua no van tra
    # duoc human-facing-language.md — neu khong, khac biet se den tu duong dan
    # chu khong tu parser (do nham vat)
    base_script = root / "scripts" / ".base-acceptance-gold.tmp.mjs"
    base_script.write_text(show.stdout, encoding="utf-8")
    try:
        old_json = subprocess.run(["node", str(base_script), "--root", str(root), "--json"],
                                  capture_output=True, text=True)
        assert old_json.returncode == 0, "ban base chay loi: %s" % old_json.stderr[-300:]
        new_json = subprocess.run(["node", str(GOLD), "--root", str(root), "--json"],
                                  capture_output=True, text=True)
        assert new_json.returncode == 0, "ban moi chay loi: %s" % new_json.stderr[-300:]
        assert old_json.stdout == new_json.stdout, \
            "kenh may-doc (--json) DOI so voi ban truoc-diff — parser da doi hanh vi, khong con la duong doc-cu"
        # doi chung DUONG: hai ban PHAI phan biet duoc — tiem 1 thay doi that
        # vao ban base roi so lai; giong nhau nghia la phep do nay mu
        probe = show.stdout.replace("points.push({ slug, evalId: cur",
                                    "points.push({ slug, evalId: 'PROBE'", 1)
        assert probe != show.stdout, "tiem probe that bai — anchor doi, cap nhat phep do"
        base_script.write_text(probe, encoding="utf-8")
        probe_json = subprocess.run(["node", str(base_script), "--root", str(root), "--json"],
                                    capture_output=True, text=True)
        assert probe_json.returncode == 0 and probe_json.stdout != new_json.stdout, \
            "phep do mu: ban base BI SUA ma --json van y het ban moi"
    finally:
        base_script.unlink(missing_ok=True)

# ── (2) CORPUS THAT: quan he noi tai giua --json va van ban in ra ──
real = gold(root, js=True)
text = gold(root)
assert len(real["points"]) > 0, "corpus that 0 diem vang — sanity counter chong 0-hit-gia"
rows = [l for l in text.splitlines() if l.startswith("| ") and "---" not in l and "Việc |" not in l]
assert len(rows) == len(real["points"]), \
    "so hang bang (%d) khac so diem trong --json (%d)" % (len(rows), len(real["points"]))
lens_lines = [l for l in text.splitlines() if re.match(r"^- .*: \d+/\d+ lần", l)]
assert len(lens_lines) == len(real["agreement"]["lensTotal"]), \
    "so dong goc-nhin (%d) khac so lens trong --json (%d)" % (len(lens_lines), len(real["agreement"]["lensTotal"]))

# ── (3) XUAT XU: van ban giam khao doc phai la ban MAY VUA IN, khong phai viet tay ──
ev = root / "_acceptance/gold-output-measure/evidence/gold-stdout.txt"
assert ev.exists(), "thieu evidence/gold-stdout.txt — sinh lai bang: node scripts/acceptance-gold.mjs --root . > <file>"
saved = ev.read_text(encoding="utf-8")
# So XUAT XU truoc (judge J1-r1 doi dich danh): file ke ben ghi lenh + checksum
# + do dai; khong khop = van ban da bi sua tay sau khi may in ra.
import hashlib
pv = ev.with_name("gold-stdout.provenance.json")
assert pv.exists(), "thieu gold-stdout.provenance.json — van ban giam khao doc khong co xuat xu"
prov = json.loads(pv.read_text(encoding="utf-8"))
raw = ev.read_bytes()
assert prov.get("bytes") == len(raw), \
    "gold-stdout.txt bi sua sau khi sinh: do dai %d != %s trong ho so xuat xu" % (len(raw), prov.get("bytes"))
assert prov.get("sha256") == hashlib.sha256(raw).hexdigest(), \
    "gold-stdout.txt bi sua sau khi sinh: checksum lech ho so xuat xu"
assert "acceptance-gold.mjs" in (prov.get("command") or ""), \
    "ho so xuat xu khong ghi lenh sinh that: %r" % prov.get("command")
fresh = text
def table(s):   return [l for l in s.splitlines() if l.startswith("| ")]
def heads(s):   return [l for l in s.splitlines() if l.startswith("## ")]
def gloss(s):
    m = re.search(r"## Từ điển[^\n]*\n([\s\S]*)$", s)
    return sorted(l.strip() for l in (m.group(1).splitlines() if m else []) if l.strip().startswith("- "))
# so KHOI ON DINH (bang vang + section + tu dien). Khoi dong thuan doi moi round
# nen khong so — nhung ba khoi nay du de bat "van viet tay" va "render da doi
# ma quen sinh lai".
# Bang vang co MOT hang cho moi quyet dinh nguoi trong CA KHO, nen so bang
# nhau la buoc phep do nay vao corpus song: dung mot chu ky Cong 2 o BAT KY
# feature nao la do — va do voi thong diep bao sai nguyen nhan. Da phat tac
# ngay o chinh chu ky cua feature nay (S4-r2 finding).
# Quan he DUNG cho muc dich "van ban giam khao doc la ban may in ra": moi hang
# trong ban luu PHAI ton tai trong ban tuoi (bat van viet tay / hang bia / ban
# in ra tu render CU), con ban tuoi co THEM hang moi thi khong sao.
missing = [l for l in table(saved) if l not in table(fresh)]
assert not missing, \
    "gold-stdout.txt khong phai ban may vua in: %d hang khong ton tai trong ban tuoi, vd %r" % (len(missing), missing[0][:120])
assert table(saved), "gold-stdout.txt khong co hang nao — sanity chong 0-hit-gia"
assert heads(saved) == heads(fresh), \
    "gold-stdout.txt khong phai ban may vua in: cac muc lech %r vs %r" % (heads(saved), heads(fresh))
assert gloss(saved) == gloss(fresh), \
    "gold-stdout.txt khong phai ban may vua in: khoi Tu dien lech"
P160PY

# ── P161 (card-text-fidelity, E1-E11): ham lot dinh dang giu nguyen duong dan
#     co dau sao. MA TRAN lay TEN + KY VONG tu marker STRIP-SHAPE-MATRIX trong
#     contract that; doi chung duong lay ban TRUOC-DIFF tai MOC DOC TU SO QUYET
#     DINH. Thieu moc = ĐỎ (khong fail-open), va co fixture kho-nong rieng cho
#     duong "khong lay duoc ban cu" (S4-r1). ──
echo "P161 (E1-E11) ham lot: ma tran, doi chung ban cu, quet corpus that"
run "P161 strip-md giu duong dan + ma tran toan phan" \
  python3 - "$ROOT" <<'P161PY'
import json, pathlib, re, subprocess, sys, tempfile, os
root = pathlib.Path(sys.argv[1])
WS = root / "_acceptance/card-text-fidelity"
CARD = root / "scripts/gate-card.js"
contract = (WS / "contract.md").read_text(encoding="utf-8")

# ── nguon SU THAT cua ma tran: marker trong contract ──
mm = re.search(r"<!-- <<<STRIP-SHAPE-MATRIX -->\n([\s\S]*?)<!-- STRIP-SHAPE-MATRIX>>> -->", contract)
assert mm, "khong rut duoc marker STRIP-SHAPE-MATRIX tu contract"
SHAPES = {}
for line in mm.group(1).strip().split("\n"):
    m = re.match(r"^-\s+(\S+)\s+—\s+(.+)$", line.strip())
    assert m, "hang marker sai khuon: %r" % line
    SHAPES[m.group(1)] = m.group(2)
ma = re.search(r"CE:\s*\*\*(\d+)\*\*\s*hình dạng khai trong bảng", contract)
assert ma, "truc A khong khai so hinh dang"
assert len(SHAPES) == int(ma.group(1)), \
    "truc A troi khoi marker: marker %d hinh dang, truc A khai %s" % (len(SHAPES), ma.group(1))

# bang ca: TEN khop marker · chuoi vao · chuoi ra · ban-cu-sai?
CASES = [
  ("glob-hai-sao-trong-đoạn-mã",   "chạm `lib/**` nhé",               "chạm lib/** nhé",                 False),
  ("glob-hai-sao-trần",            "docs/** thôi",                    "docs/** thôi",                    False),
  ("nhiều-glob-một-dòng",          "docs/** · plugins/** · hooks/**", "docs/** · plugins/** · hooks/**", True),
  ("glob-mở-đầu-hai-sao",          "**/*.ts và **/*.js",              "**/*.ts và **/*.js",              True),
  ("glob-một-sao",                 "commands/*.md và lib/*",          "commands/*.md và lib/*",          True),
  ("sao-trong-đoạn-mã",            "`a**b`",                          "a**b",                            False),
  ("đậm-chuẩn",                    "**Nhấn mạnh** đây",               "Nhấn mạnh đây",                   False),
  ("nghiêng-chuẩn",                "*nghiêng* đây",                   "nghiêng đây",                     False),
  ("đậm-nghiêng-ba-sao",           "***rất*** quan trọng",            "rất quan trọng",                  False),
  ("đậm-lỏng-có-khoảng-trắng",     "** Cảnh báo **",                  "** Cảnh báo **",                  True),
  ("nghiêng-lỏng-có-khoảng-trắng", "*ghi chú *",                      "*ghi chú *",                      True),
  ("đậm-và-glob-cùng-dòng",        "**Chú ý** với `scripts/**`",      "Chú ý với scripts/**",            False),
  ("đậm-dính-chữ-trước",           "tier T3**mới** đây",              "tier T3mới đây",                  False),
  ("đậm-dính-dấu-câu-trước",       "hết câu.**Đậm** tiếp",            "hết câu.Đậm tiếp",                False),
  ("đậm-dính-gạch-ngang-trước",    "mục 1-**quan trọng**",            "mục 1-quan trọng",                False),
  ("glob-trong-cụm-đậm",           "**Miễn trừ `.github/**` khỏi X.**", "Miễn trừ .github/** khỏi X.",    True),
  ("glob-mở-đầu-một-sao",          "Glob */_acceptance/* trong X",    "Glob */_acceptance/* trong X",    True),
  ("liên-kết",                     "xem [tài liệu](http://a.b/c) nhé", "xem tài liệu nhé",               False),
  ("sao-lẻ-không-cặp",             "gọi split('*') rồi lọc",          "gọi split('*') rồi lọc",          False),
  ("đuôi-sao-bắt-mọi",             "khoá executors.design.* và GP* xong", "khoá executors.design.* và GP* xong", True),
  ("cờ-gạch-sao",                  "dạng --* và -* đều khớp",         "dạng --* và -* đều khớp",         True),
  ("sao-trước-ngoặc-đóng",         "mẫu (a.*) rồi thôi",              "mẫu (a.*) rồi thôi",              False),
  ("sao-sau-lớp-ký-tự",            "regex [^\\t]* trong luật",        "regex [^\\t]* trong luật",        False),
]
LOT = {n for n, k in SHAPES.items() if k.startswith("lột")}

# ══ E1: quan he TAP HOP ten bang ca ⇔ ten marker + 2 mutant ══
def name_errs(cases, shapes):
    e = []
    for x in sorted(shapes - cases): e.append("thieu o kiem cho hinh dang %r" % x)
    for x in sorted(cases - shapes): e.append("bang ca co ten LA: %r" % x)
    return e
CN = {c[0] for c in CASES}
assert not name_errs(CN, set(SHAPES)), "ban nguyen ven da lech: %s" % name_errs(CN, set(SHAPES))
ea = name_errs(CN, set(SHAPES) - {"glob-mở-đầu-hai-sao"})
assert ea and any("glob-mở-đầu-hai-sao" in x for x in ea), "mutant xoa-hang khong do dung ten"
eb = name_errs(CN, (set(SHAPES) - {"đậm-chuẩn"}) | {"đậm-doi-ten"})
assert any("đậm-doi-ten" in x for x in eb) and any("đậm-chuẩn" in x for x in eb), "mutant doi-ten khong do hai chieu"

# Moi chan do phai TU CHUNG MINH no biet ĐỎ: chay lai chinh no tren mot VAT
# HONG (ban cu / mutant) va doi mot AssertionError. Khong co chan nay thi
# "xanh" khong phan biet duoc voi "chua bao gio chay" (S4-r2: 3 chan cung mu).
def must_fail(fn, what):
    try: fn()
    except AssertionError: return
    raise AssertionError("PHEP DO MU: %s — vat HONG ma phep do van xanh" % what)

def load_strip(js_path):
    src = pathlib.Path(js_path).read_text(encoding="utf-8")
    # Ban moi: khoi "const MASK = ...; const stripMd = s => { ... };"
    # Ban cu:  mot bieu thuc "const stripMd = s => String(...)...;"
    m = re.search(r"const MASK = [\s\S]*?\n\};\n", src) or re.search(r"const stripMd = s => [\s\S]*?;\n", src)
    assert m, "khong tim thay stripMd trong %s" % js_path
    block = m.group(0)
    def run(inp):
        r = subprocess.run(["node", "-e",
            "const f=(function(){%s return stripMd;})();process.stdout.write(f(JSON.parse(process.argv[1])))" % block,
            json.dumps(inp)], capture_output=True, text=True)
        assert r.returncode == 0, "node loi: %s" % r.stderr[-300:]
        return r.stdout
    return run
strip_new = load_strip(CARD)

# ══ E2: moi hinh dang cho ra DUNG ky vong; KY VONG "giu nguyen" doi chieu voi
#        chinh chu MARKER (khong tin hang viet tay mot minh) ══
for name, inp, want, _ in CASES:
    got = strip_new(inp)
    assert got == want, "hinh dang %r (%s): vao %r → ra %r, ky vong %r" % (name, SHAPES[name], inp, got, want)
    if SHAPES[name].startswith("giữ nguyên"):
        # "giu nguyen" = KHONG mat dau sao nao (backtick van duoc lot binh thuong)
        assert got.count("*") == inp.count("*"), \
            "marker khai %r la GIU NGUYEN nhung mat dau sao: vao %d, ra %d" % (name, inp.count("*"), got.count("*"))
    if name in LOT and not SHAPES[name].endswith("giữ glob"):
        # LOT thuan: khong con dau sao. Hang "lot dam, giu glob" co ky vong HON
        # HOP nen kiem rieng: dam mat dau, glob giu du.
        assert "*" not in got, "marker khai %r la LOT nhung ket qua con dau sao: %r" % (name, got)
    if SHAPES[name].endswith("giữ glob"):
        # Ky vong HON HOP, kiem TONG QUAT (khong ghim chuoi cua mot ca):
        # (a) cum dam bao ngoai bien mat → so sao GIAM;
        # (b) moi duong dan chua sao trong input con NGUYEN VEN trong output.
        assert got.count("*") < inp.count("*"), \
            "hang %r phai lot cum dam bao ngoai (so sao khong giam): %r" % (name, got)
        for gpath in re.findall(r"(?:[A-Za-z0-9_.-]+/)+\*+|\*+/[A-Za-z0-9_.*/-]+", inp):
            assert gpath in got, "hang %r lam mat duong dan %r: %r" % (name, gpath, got)

# ══ E5 (duong DUONG rieng): kho NONG dung trong lan chay → thong diep RIENG ══
BASE = None
for line in (WS / "decisions.jsonl").read_text(encoding="utf-8").split("\n"):
    if not line.strip(): continue
    try: e = json.loads(line)
    except Exception: continue
    m = re.search(r"base = ([0-9a-f]{40})", e.get("decision", ""))
    if m: BASE = m.group(1)
assert BASE, "so quyet dinh khong ghi moc so-ban-cu (base = <sha>) — xem AC-12"

def old_at(base, workdir):
    """tra (source, err) — err la thong diep RIENG khi cay thieu lich su"""
    chk = subprocess.run(["git", "-C", str(workdir), "cat-file", "-e", base + "^{commit}"], capture_output=True)
    if chk.returncode != 0:
        return None, "khong lay duoc ban cu tai moc %s (cay thieu lich su)" % base
    r = subprocess.run(["git", "-C", str(workdir), "show", "%s:scripts/gate-card.js" % base],
                       capture_output=True, text=True)
    if r.returncode != 0 or len(r.stdout) < 500:
        return None, "khong lay duoc ban cu tai moc %s (git show that bai)" % base
    return r.stdout, None

with tempfile.TemporaryDirectory() as shallow:
    sub = pathlib.Path(shallow) / "nong"
    cl = subprocess.run(["git", "-c", "protocol.file.allow=always", "clone", "--quiet",
                         "--depth", "1", "file://" + str(root), str(sub)], capture_output=True, text=True)
    # KHONG fail-open (S4-r2 finding): clone hong = phep do MAT chan, phai ĐỎ.
    assert cl.returncode == 0 and (sub / ".git").exists(), \
        "khong dung duoc fixture kho NONG (git clone that bai) — chan AC-12 mat, khong duoc bo qua: %s" % cl.stderr[-200:]
    src_s, err_s = old_at(BASE, sub)
    assert src_s is None and err_s and "cay thieu lich su" in err_s, \
        "kho NONG phai cho thong diep RIENG, got src=%s err=%r" % (bool(src_s), err_s)

src_old, err_old = old_at(BASE, root)
# KHONG fail-open: cay kiem that PHAI co moc, neu khong thi ĐỎ (S4-r1 finding)
assert src_old, "cay kiem khong co moc so-ban-cu %s: %s — chan doi chung KHONG duoc bo qua am tham" % (BASE, err_old)
assert err_old is None, "cay du lich su ma van bao loi lay ban cu: %r" % err_old

with tempfile.TemporaryDirectory() as d:
    dd = pathlib.Path(d)
    (dd / "scripts").mkdir(); (dd / "lib").mkdir()
    old_js = dd / "scripts" / "gate-card.js"
    old_js.write_text(src_old, encoding="utf-8")
    # lib lay TAI BASE (cung commit voi gate-card cu) — khong ghep lib hien tai:
    # sau dot .cjs 1.39.1, loc `f.suffix == ".js"` tren cay hien tai chep dung
    # 0 file va ban cu cung khong nap noi lib .cjs — ca hai chieu deu mu.
    lib_names = subprocess.run(["git", "-C", str(root), "ls-tree", "-r", "--name-only", BASE, "lib"],
                               capture_output=True, text=True).stdout.split()
    assert lib_names, "khong liet ke duoc lib/ tai ban cu %s — fixture ban base khong dung duoc" % BASE
    for name in lib_names:
        blob = subprocess.run(["git", "-C", str(root), "show", "%s:%s" % (BASE, name)],
                              capture_output=True, text=True)
        assert blob.returncode == 0, "khong lay duoc %s tai %s" % (name, BASE)
        (dd / "lib" / pathlib.Path(name).name).write_text(blob.stdout, encoding="utf-8")
    strip_old = load_strip(old_js)

    # ══ E4: ban cu ĐỎ dung tap, XANH dung tap; co khai == su that do duoc ══
    wrong, right = [], []
    for name, inp, want, old_wrong in CASES:
        ok = (strip_old(inp) == want)
        (right if ok else wrong).append(name)
        assert ok != old_wrong, "ban cu o %r: khai old_wrong=%s, thuc te %s" % (name, old_wrong, "dung" if ok else "sai")
    assert wrong and right, "phep do MU: hai tap phai deu khong rong"

    # ══ E3: nhom LOT khong suy giam ══
    for name, inp, want, old_wrong in CASES:
        if name in LOT and not old_wrong:
            assert strip_new(inp) == strip_old(inp), "hinh dang %r doi hanh vi so ban cu — nhom LOT phai giu nguyen" % name

    # ── ham chung cho E6/E7/E8/E9: sinh the that bang MOT ban script ──
    RENDER = {"ok": 0, "fail": 0}
    def card(js, slug, gate):
        r = subprocess.run(["node", str(js), "--root", str(root), "--slug", slug, "--gate", gate],
                           capture_output=True, text=True)
        if r.returncode == 0: RENDER["ok"] += 1; return r.stdout
        RENDER["fail"] += 1; return None

    STAR = re.compile(r"\S*\*+\S*")
    slugs = []
    for sd in sorted((root / "_acceptance").iterdir()):
        if sd.is_dir() and (sd / "contract.md").exists(): slugs.append(sd.name)
    assert slugs, "sanity: khong co slug nao"

    def stars_in(text): return {s for s in STAR.findall(text) if "*" in s}

    # ══ E7 (+E6): QUAN HE TRUY-VE-NGUON — moi cum sao trong THE phai xuat hien
    #     NGUYEN VAN trong file nguon cua slug do. Khong dem, khong chuan hoa. ══
    def untraceable(js, only_slugs=None):
        """tra list (slug, gate, cum-sao-khong-truy-duoc)"""
        bad = []
        for slug in (only_slugs or slugs):
            sd = root / "_acceptance" / slug
            # nguon = MOI file the doc (Cong 2 doc ca report + findings + probe),
            # thieu file nao la bao oan cum sao co that o do
            src = "\n".join(f.read_text(encoding="utf-8") for f in
                            [sd / "contract.md", sd / "decisions.jsonl", sd / "evals.yaml",
                             sd / "evidence-report.md", sd / "review-findings.md",
                             sd / "gap-probe.md"] if f.exists())
            # The lot dau nhay nguoc (dung hanh vi), nen truy nguon phai so voi
            # ban nguon DA LOT nhay — neu khong, "t1_skip_globs`.**" trong nguon
            # va "t1_skip_globs.**" tren the bi coi la bia ra.
            src = src + "\n" + src.replace("`", "")
            for gate in ("1", "2"):
                out = card(js, slug, gate)
                if out is None: continue
                plain = (out.replace("&quot;", '"').replace("&#39;", "'")
                            .replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&"))
                for cum in stars_in(plain):
                    # LOI = bo dau cau/nhay o hai dau; the them dau phay, ngoac,
                    # dau cham cua chinh cau van — nguon khong co chung, nen so
                    # nguyen cum se bao oan. Cai can truy la phan MANG DAU SAO.
                    core = cum.strip("'\"()[]{}<>,;:.…·—–?!`")
                    if not core or set(core) <= {"*", ".", "/"}: continue
                    if core not in src:
                        bad.append((slug, gate, core))
        return bad

    bad_new = untraceable(CARD)
    assert not bad_new, "the in cum sao KHONG truy duoc ve nguon: %r" % bad_new[:4]

    # ══ E6: duong dan chua sao trong nguon PHAI nguyen ven tren the — do bang
    #     QUAN HE dem giua hai ban (menh de "bo qua khi ban cut cung hop le"
    #     cua r1 lam 12/18 glob bi mien, ban cu cung xanh → mu, S4-r2). ══
    PATHSTAR = re.compile(r"(?:[A-Za-z0-9_.-]+/)+\*+|\*\*/[A-Za-z0-9_.*/-]+")
    def intact_count(js):
        n = 0
        for slug in slugs:
            src = (root / "_acceptance" / slug / "contract.md").read_text(encoding="utf-8")
            want = {g for g in PATHSTAR.findall(src) if len(g) > 3}
            if not want: continue
            for gate in ("1", "2"):
                out = card(js, slug, gate)
                if out is None: continue
                plain = out.replace("&quot;", '"')
                n += sum(1 for g in want if g in plain)
        return n
    n_new, n_old = intact_count(CARD), intact_count(old_js)
    assert n_new > 0, "sanity: khong duong dan nao nguyen ven tren the ban moi"
    # ── AC-5 measure-teeth-cleanup: bo dem render phai duoc ASSERT du 3 so,
    #    khong dem-roi-vut (S4-r3 ctf: tiem loi giet dung the cua chinh viec
    #    nay ma phep do van xanh). Moi slug 1 the theo CONG HIEN HANH cua no
    #    (auto-detect tu status) — tat ca phai dung duoc. ──
    RENDER["ok"] = RENDER["fail"] = 0
    attempted = 0
    for slug in slugs:
        attempted += 1
        r = subprocess.run(["node", str(CARD), "--root", str(root), "--slug", slug],
                           capture_output=True, text=True)
        if r.returncode == 0: RENDER["ok"] += 1
        else: RENDER["fail"] += 1
    # attempted == len(slugs) la TAUTOLOGY (vong lap tang ca hai) — so voi
    # nguon DOC LAP: so thu muc viec co contract tren he tep (S4-r2)
    on_disk = sum(1 for x in (root / "_acceptance").iterdir()
                  if x.is_dir() and (x / "contract.md").exists())
    assert attempted == on_disk and on_disk > 0, \
        "mau so hong: da thu %d the nhung he tep co %d viec" % (attempted, on_disk)
    assert RENDER["fail"] == 0, \
        "%d/%d the KHONG dung duoc (cong hien hanh cua viec) — nguoi ky se khong co the de xem" % (RENDER["fail"], attempted)
    assert n_new > n_old, \
        "PHEP DO MU: ban moi (%d) khong giu duoc nhieu duong dan hon ban cu (%d)" % (n_new, n_old)
    checked = n_new

    # must_fail THAT SU duoc dung (vong 3: ham co ten ma khong co rang):
    # ban CU chay qua bang ca phai ĐỎ — chinh la doi chung duong cua E2.
    def e2_on(strip_fn):
        for name, inp, want, _ in CASES:
            assert strip_fn(inp) == want, "hinh dang %r sai" % name
    must_fail(lambda: e2_on(strip_old), "bang ca chay tren ban CU")

    # ══ E12: BANG PHAI PHU CORPUS — moi cum sao trong ho so that phai khop
    #     mot hinh dang CO TEN. Dao chieu nguyen nhan goc cua 3 vong truoc:
    #     bang khong con la thu nguoi viet nghi ra ma la thu corpus buoc phai co. ══
    # Phan loai theo CAU TRUC HOAN CHINH tren dong, khong theo token cat ngang
    # ("**0" chi la nua mo cua "**0 luot**"). Quet trai-sang-phai, tieu thu vung
    # da khop; dau sao con lai NGOAI moi cau truc moi la mo coi that.
    STRUCT = [
      ("sao-trong-đoạn-mã",            re.compile(r"`[^`]*`")),
      ("liên-kết",                     re.compile(r"\[[^\]]*\]\([^)\s]*\)")),
      ("glob-mở-đầu-hai-sao",          re.compile(r"\*\*/[A-Za-z0-9_.*/-]+")),
      ("glob-mở-đầu-một-sao",          re.compile(r"\*/[A-Za-z0-9_.*/-]+")),
      ("glob-hai-sao-trần",            re.compile(r"(?:[A-Za-z0-9_.-]+/)+\*\*+")),
      ("glob-một-sao",                 re.compile(r"(?:[A-Za-z0-9_.-]+/)+\*[A-Za-z0-9_.]*")),
      ("đậm-nghiêng-ba-sao",           re.compile(r"\*\*\*(?=[^\s/])[^*]+?(?<=[^\s/])\*\*\*")),
      ("đậm-chuẩn",                    re.compile(r"\*\*(?=[^\s/])[^*]+?(?<=[^\s/])\*\*")),
      ("nghiêng-chuẩn",                re.compile(r"\*(?=[^\s/])[^*]+?(?<=[^\s/])\*")),
      ("đậm-lỏng-có-khoảng-trắng",     re.compile(r"\*\*\s[^*]*\s\*\*")),
      ("nghiêng-lỏng-có-khoảng-trắng", re.compile(r"\*\s[^*]*\s\*")),
      # 4 hình dạng đợt dọn (measure-teeth-cleanup AC-4 — corpus buộc phải có):
      ("sao-lẻ-không-cặp",             re.compile(r"(?:(?<=\s)|(?<=\()|^)\*{1,3}(?=\s|$)", re.M)),
      ("đuôi-sao-bắt-mọi",             re.compile(r"[A-Za-z0-9_.'\)\]-]\*+")),
      ("cờ-gạch-sao",                  re.compile(r"(?<![\w*])-+\*+")),
      ("sao-trước-ngoặc-đóng",         re.compile(r"\*+\)")),
      ("sao-sau-lớp-ký-tự",            re.compile(r"\]\*+")),
      # tạo tác của phép che: sao kề vùng Ø (nguồn thật là sao kề đoạn mã/nội
      # dung đã che) — phân loại theo ngữ cảnh, không phải hình dạng văn thật
      ("sao-trong-đoạn-mã",            re.compile(r"\(?\*+(?=Ø)|(?<=Ø)\*+\)?")),
    ]
    orphan = []; classified = 0
    for slug in slugs:
        sd = root / "_acceptance" / slug
        for f in [sd / "contract.md", sd / "decisions.jsonl"]:
            if not f.exists(): continue
            # TOAN VAN, khong tach dong: ho so hard-wrap 80 cot nen mot cap
            # **...** thuong nam vat qua hai dong — tach dong se luon thay nua cap.
            rest = f.read_text(encoding="utf-8")
            for name, rx in STRUCT:
                if name not in SHAPES: continue
                # CHE bang token thay vi xoa thanh khoang trang: xoa lam cum
                # dam bao quanh doan ma mat ranh khong-trang ("**X `a` Y**" →
                # "**X   Y**" voi space truoc ** dong) va tu de ra mo coi NHIEU
                # — chinh nhieu do la ly do nguong 25 ra doi (ha thuoc,
                # measure-teeth-cleanup AC-4)
                rest, n = rx.subn("Ø", rest)
                classified += n
            for frag in re.findall(r"\S*\*+\S*", rest):
                orphan.append((slug, frag[:40]))
    assert classified > 0, "sanity: khong phan loai duoc cau truc sao nao"
    # Sao con lai ngoai moi cau truc CO TEN = bang chua phu corpus.
    # ZERO tolerance (measure-teeth-cleanup AC-4 — nguong 25 cu la ha thuoc:
    # dat cao hon so thuc 18 de vua xanh, con du cho cho 7 hinh dang moi lot):
    # MOT cum mo coi la ĐỎ, neu dich danh cum dau tien + ten viec.
    # Zero-tolerance CHI ap cho cum co ngu canh DUONG DAN — thu feature nay
    # canh. Cum sao trong van xuoi tu do (vd `*.md` trong mot cau) la khong
    # gian MO cua moi hop dong tuong lai: bat do o day bien chot thanh vat can
    # cho moi viec sau, va cach go duy nhat la sua hop dong DA KY (S4-r2).
    PATHISH = re.compile(r"[/\\]")
    hard = [o for o in orphan if PATHISH.search(o[1])]
    soft = [o for o in orphan if not PATHISH.search(o[1])]
    assert not hard, \
        "bang KHONG phu corpus (cum co duong dan): %r trong viec %s (tong %d)" % (
            hard[0][1], hard[0][0], len(hard))
    if soft:
        print("P161 GHI CHU: %d cum sao van xuoi chua co ten hinh dang (khong chan): %s" % (
            len(soft), " ".join(sorted({o[1] for o in soft})[:8])))

    # ══ E9: quet corpus THAT — moi chenh lech phai thuoc hinh dang CO TEN.
    #     Menh de thoat cu (set(b) >= set(a)) luon dung nen E9 khong the do:
    #     mutant "khong lot dam" van xanh (S4-r2). Nay dung HAU DIEU KIEN cua
    #     nhom LOT: sau khi lot, KHONG duoc con cap dam-chuan nao (mo khong sau
    #     dau gach cheo, hai dau non-space) — mutant bold-strip do ngay. ══
    LEFTOVER = re.compile(r"(?:^|[^*/])\*\*(?=\S)[^*]+?(?<=\S)\*\*(?!\*)")
    def scan_corpus(strip_fn):
        left, cum = [], 0
        for slug in slugs:
            sd = root / "_acceptance" / slug
            for f in [sd / "contract.md", sd / "decisions.jsonl"]:
                if not f.exists(): continue
                for line in f.read_text(encoding="utf-8").split("\n"):
                    if "*" not in line: continue
                    cum += len(stars_in(line))
                    # Cap dam NAM TRONG doan ma phai duoc GIU (do la ngu nghia
                    # markdown chuan). Bo doan ma khoi input truoc khi kiem hau
                    # dieu kien, neu khong thuoc bao oan chinh hanh vi dung.
                    out = strip_fn(re.sub(r"`[^`]*`", " ", line))
                    if LEFTOVER.search(out): left.append((slug, line[:70], out[:70]))
        return left, cum
    left_new, cum_count = scan_corpus(strip_new)
    assert not left_new, "corpus that: con cap dam-chuan CHUA LOT sau khi lot: %r" % left_new[:3]
    assert cum_count > 0, "sanity: khong rut duoc cum sao nao tu corpus"

    # ══ E8: MUTANT RIENG — "khong lot chu dam nua" — phai lam E7 ĐỎ ══
    # Mutant = xoa dong lot DAM (2 sao). Anchor tim theo HINH DANG dong, khong
    # ghim nguyen van lop ky tu — lop do da doi 3 lan trong chinh vong nay.
    card_src = CARD.read_text(encoding="utf-8")
    mut_lines, dropped = [], 0
    for ln in card_src.split("\n"):
        if dropped == 0 and ".replace(" in ln and "\\*\\*(?=" in ln and "\\*\\*\\*(?=" not in ln:
            dropped += 1; continue
        mut_lines.append(ln)
    assert dropped == 1, "tiem mutant that bai (xoa duoc %d dong lot-dam) — cap nhat phep do" % dropped
    mut_src = "\n".join(mut_lines)
    # ── ca cô lập lớp (r3-tests-only, owner phê duyệt 2026-08-09): sau đợt
    # .cjs 1.39.1, HAI THẾ HỆ script có bộ phụ thuộc lib RỜI NHAU — một thư mục
    # lib không phục vụ được cả hai. Tắt từng thế hệ bằng DỮ LIỆU của bên kia
    # (khuôn "mutant phải có ca cô lập lớp"): mỗi chiều phải CHẾT khi đứng cạnh
    # lib của thế hệ kia; và mutant chỉ được chấm khi nó CHẠY ĐƯỢC — card()
    # nuốt lỗi nạp thành None, nên "không đỏ" của một script chết là mù.
    def renders_any(js, probe_slugs):
        return any(card(js, s, g) is not None for s in probe_slugs for g in ("1", "2"))
    def copy_lib_now(dst):
        # chép TRỌN lib hiện tại — KHÔNG lọc theo đuôi. Lọc đuôi chính là lớp
        # lỗi vòng này: `.js` bỏ sót cả bộ sau đợt .cjs, còn `.cjs` bỏ sót
        # `out-of-contract.js` (file không chép sang consumer nên giữ đuôi cũ).
        n = 0
        for f in (root / "lib").iterdir():
            if f.is_file(): (dst / f.name).write_text(f.read_text(encoding="utf-8"), encoding="utf-8"); n += 1
        assert n >= 5, "lib hien tai chi co %d file — fixture the he moi khong dung duoc" % n
    iso_new = dd / "iso-new"; (iso_new / "scripts").mkdir(parents=True); (iso_new / "lib").mkdir()
    (iso_new / "scripts" / "gate-card.js").write_text(CARD.read_text(encoding="utf-8"), encoding="utf-8")
    for name in lib_names:
        blob = subprocess.run(["git", "-C", str(root), "show", "%s:%s" % (BASE, name)],
                              capture_output=True, text=True)
        (iso_new / "lib" / pathlib.Path(name).name).write_text(blob.stdout, encoding="utf-8")
    assert not renders_any(iso_new / "scripts" / "gate-card.js", slugs[:3]), \
        "co-lap-lop: script the he MOI van chay duoc tren lib the he CU — hai the he khong con roi nhau, cap nhat phep do"
    iso_old = dd / "iso-old"; (iso_old / "scripts").mkdir(parents=True); (iso_old / "lib").mkdir()
    (iso_old / "scripts" / "gate-card.js").write_text(src_old, encoding="utf-8")
    copy_lib_now(iso_old / "lib")
    assert not renders_any(iso_old / "scripts" / "gate-card.js", slugs[:3]), \
        "co-lap-lop: script the he CU van chay duoc tren lib the he MOI — hai the he khong con roi nhau, cap nhat phep do"
    # Vá theo hình (không đắp triệu chứng): mutant là script THẾ HỆ MỚI nên
    # đứng trong thư mục riêng cạnh lib .cjs hiện tại — dd/lib là nhà của thế
    # hệ CŨ (bản base), không nhét chung.
    mut_dir = dd / "cur"; (mut_dir / "scripts").mkdir(parents=True); (mut_dir / "lib").mkdir()
    copy_lib_now(mut_dir / "lib")
    mut_js = mut_dir / "scripts" / "gate-card.mut.js"
    mut_js.write_text(mut_src, encoding="utf-8")
    assert renders_any(mut_js, slugs), \
        "PHEP DO MU: mutant khong chay duoc (0 the render duoc) — 'khong do' cua mot script chet khong duoc dem la bang chung; dat mutant canh dung lib the he cua no"
    bad_mut = untraceable(mut_js)
    assert bad_mut, "PHEP DO MU: mutant 'khong lot chu dam' van khong lam chan truy-ve-nguon ĐỎ"
    # ...VA phai lam chan quet-corpus (E9) do — day la chan tung mu o S4-r2
    strip_mut = load_strip(mut_js)
    left_mut, _ = scan_corpus(strip_mut)
    assert left_mut, "PHEP DO MU: mutant 'khong lot chu dam' van khong lam chan quet-corpus ĐỎ"

    # ══ E11: khoi P CU chi duoc THEM, khong doi/khong xoa assert ══
    r = subprocess.run(["git", "-C", str(root), "show", "%s:tests/plugins/run-tests.sh" % BASE],
                       capture_output=True, text=True)
    assert r.returncode == 0, "khong lay duoc bo kiem ban cu tai moc"
    old_asserts = [l.strip() for l in r.stdout.split("\n") if l.strip().startswith("assert ")]
    new_text = (root / "tests/plugins/run-tests.sh").read_text(encoding="utf-8")
    missing = [l for l in old_asserts if l not in new_text]
    # Duong KHAI-DOI-THUOC: mot dot luu kho lam chet ca mot vung do thi banh coc
    # phai mo bang LOI KHAI, khong phai bang cach noi chot. Hai chieu:
    #   (a) assert bien mat ma KHONG khai -> DO (ha thuoc lang le);
    #   (b) dong khai ma assert VAN con tren cay -> cung DO (danh sach do san,
    #       khai cho co de khoi phai nghi).
    decl_p = root / "tests/plugins/asserts-da-go.txt"
    declared = []
    if decl_p.exists():
        declared = [l.strip() for l in decl_p.read_text(encoding="utf-8").split("\n")
                    if l.strip() and not l.startswith("#")]
    khong_khai = [l for l in missing if l not in declared]
    assert not khong_khai, "assert CU bi doi/xoa ma KHONG khai trong tests/plugins/asserts-da-go.txt (ha thuoc cho vua vat): %r" % khong_khai[:3]
    khai_thua = [l for l in declared if l in new_text]
    assert not khai_thua, "dong khai trong asserts-da-go.txt ma assert VAN con tren cay — danh sach khai bi do san: %r" % khai_thua[:3]
    print("     E11 banh coc: %d assert cu, %d da go va DEU duoc khai" % (len(old_asserts), len(missing)))

# ══ E10: dem cho goi ham lot TU MA NGUON == con so khai o truc C ══
calls = len(re.findall(r"stripMd\(", CARD.read_text(encoding="utf-8")))
mc = re.search(r"CE:\s*\*\*(\d+)\*\*\s*chỗ gọi hàm lột", contract)
assert mc, "truc C khong khai so cho goi ham lot"
assert calls == int(mc.group(1)), "so cho goi lech: ma nguon %d, truc C khai %s" % (calls, mc.group(1))
print("P161 OK: %d hinh dang · %d slug · %d cum sao corpus · %d phan loai · %d cho goi · %d assert cu giu nguyen" % (
    len(CASES), len(slugs), cum_count, classified, calls, len(old_asserts)))
P161PY

# ── P165: F-K vế ÂM — câu phủ định superpowers:brainstorming nằm TRONG đoạn
# lối (a) của CẢ HAI thân /start; mutant code-sinh per-file (E1). Đo trong
# ĐOẠN chứ không grep toàn file — chống "đo từ vựng thay vì quan hệ".
run "P165 F-K ve am: cam superpowers:brainstorming truoc Cong Dang trong doan loi (a), mutant per-file (E1)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
# (file, anchor đầu đoạn lối (a), anchor cuối đoạn, câu phủ định phải có mặt)
BODIES = [
    ("commands/start.md", "Bắt đầu việc mới", "Dưới thẻ",
     "KHÔNG dùng `superpowers:brainstorming`"),
]
def segment(rel, txt, a, b):
    i = txt.find(a)
    if i < 0: return None, f"{rel}: anchor đầu đoạn lối (a) '{a}' không thấy"
    j = txt.find(b, i)
    if j < 0: return None, f"{rel}: anchor cuối đoạn lối (a) '{b}' không thấy"
    return txt[i:j], None
def check(entries):
    errs = []
    for rel, txt, a, b, needle in entries:
        seg, err = segment(rel, txt, a, b)
        if err: errs.append(err); continue
        if needle not in seg:
            errs.append(f"{rel}: đoạn lối (a) thiếu câu phủ định {needle}")
    return errs
live = [(rel, (root / rel).read_text(encoding="utf-8"), a, b, n) for rel, a, b, n in BODIES]
e0 = check(live)
assert e0 == [], f"đối chứng dương FAIL — bản thật phải xanh: {e0}"          # bản thật XANH
# mutant CODE-SINH per-file: bản sao thân sống, máy xoá đúng dòng chứa chuỗi cấm
for rel, txt, a, b, needle in live:
    mut = "\n".join(l for l in txt.split("\n") if needle not in l)
    assert mut != txt, f"{rel}: tiêm mutant thất bại — không dòng nào chứa câu phủ định"
    errs = check([(rel, mut, a, b, needle)])
    assert any("thiếu câu phủ định" in e and rel in e for e in errs), \
        f"mutant xoá câu ở {rel} không bị bắt đúng thông điệp: {errs}"
print("P165 OK (2 thân xanh + 2 mutant per-file đỏ đúng tên)")
PY

# ── P166: F-K ổ cắm MÁY — discovery.brainstormSkill từ fixture code-sinh:
# 4 hình dạng CÓ (đối chứng dương) + 6 hình dạng KHÔNG-đọc-ra-tên → null,
# exit 0, không văng lỗi (E2, E3 — RED phía consumer: fallback phải sống);
# kèm nhánh văn trong đoạn lối (a) hai thân.
run "P166 F-K o cam config: ma tran hinh dang TOAN PHAN + seam khoa viet<->doc + quan he 2 nhanh (E2,E3)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const root = process.argv[2];
const die = m => { console.error(m); process.exit(1); };

// ── SEAM khoá viết↔đọc (S4-r1, hình dạng 2): tên khoá KHÔNG gõ tay ở đây.
// Rút TỪ thân lệnh — bên DẶN NGƯỜI VIẾT config — rồi dựng fixture bằng chính
// chuỗi đó. Thân lệnh đổi tên khoá mà reader không đổi ⇒ fixture khai khoá mới
// ⇒ reader trả null ⇒ case ĐỎ. Bản cũ gõ tay 'brainstorm_skill' đúng khuôn bên
// ĐỌC nên hai đầu không bao giờ được nối (bài "đo ở phía consumer").
const BODIES = ['commands/start.md'];
const declared = BODIES.map(rel => {
  const txt = fs.readFileSync(path.join(root, rel), 'utf8');
  const m = txt.match(/`discovery\.([a-z0-9_]+)`/);
  if (!m) die(`${rel}: không rút được tên khoá config từ thân lệnh (dạng \`discovery.<key>\`)`);
  return { rel, key: m[1] };
});
const keys = [...new Set(declared.map(d => d.key))];
if (keys.length !== 1) die(`hai thân lệnh dặn HAI tên khoá khác nhau: ${JSON.stringify(declared)}`);
const KEY = keys[0];

const scan = cfg => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p166-'));
  fs.mkdirSync(path.join(tmp, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(tmp, '_acceptance', 'config.yaml'), cfg);
  let out;
  try {
    out = execFileSync('node', [path.join(root, 'scripts/start-scan.mjs'), '--root', tmp],
      { encoding: 'utf8' });
  } catch (e) { die(`start-scan văng lỗi (phải exit 0, JSON nguyên hình): ${e.message}`); }
  finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  const json = JSON.parse(out);
  if (!('discovery' in json)) die('JSON thiếu khối discovery');
  return json.discovery.brainstormSkill;
};
const cfg = body => (/\r\n/.test(body)
  ? `schema_version: 1\r\ndiscovery:\r\n${body}`
  : `schema_version: 1\ndiscovery:\n${body}`);
const NAME = 'acme:brainstorm';

// ── MA TRẬN viết-trước (mẫu P105): mỗi nhánh guard của reader một ô, KHÔNG
// gộp cả lớp phi-scalar vào một đại diện (r1 bắt đúng chỗ này).
// GIỚI HẠN đã biết, ghi cho trung thực (r2): ma trận đo ĐẦU RA, nên nó KHÔNG
// phân biệt được mọi đường đi nội bộ. Cụ thể: ô 'quote chứa #' một mình KHÔNG
// canh được thứ tự bóc quote↔comment — SKILL_NAME_RE loại cả hai đường về null
// (kiểm bằng cách tiêm mutant đảo thứ tự vào bản sao cây: sống sót trọn ma
// trận). Ô THẬT SỰ có răng cho lớp 'cắt comment quá tay' là
// 'unquoted chứa #': bản đúng → null, bản cắt-quá-tay → 'acme:brain'.
const MATRIX = [
  // [nhãn, thân YAML dưới `discovery:`, kỳ vọng]
  ['trần',              `  ${KEY}: ${NAME}\n`,                       NAME],
  ['quote kép',         `  ${KEY}: "${NAME}"\n`,                     NAME],
  ['quote đơn',         `  ${KEY}: '${NAME}'\n`,                     NAME],
  ['comment đuôi',      `  ${KEY}: ${NAME}  # ghi chú\n`,            NAME],
  ['quote + comment',   `  ${KEY}: "${NAME}"  # ghi chú\n`,          NAME],
  // R3-1 (r4, Manh phê chuẩn vượt trần): chú thích đuôi dòng CHỨA dấu nháy.
  // Quantifier tham lam khớp dấu nháy cuối dòng → giá trị thành rác → null,
  // tức khai báo hợp lệ bị coi như chưa khai. Hai ô (nháy kép/đơn) vì mỗi
  // kiểu nháy là một đường backreference riêng.
  ['quote kép + comment có nháy', `  ${KEY}: "${NAME}"  # chú thích có "nháy"\n`, NAME],
  ['quote đơn + comment có nháy', `  ${KEY}: '${NAME}'  # it's fine\n`,           NAME],
  // r5: đọc bằng reader DÙNG CHUNG (resolveConfigKey) nên hai hình dạng dưới
  // hết sai — bản tự viết trước đây trả null cho cả hai.
  ['key : value (cách trước hai chấm)', `  ${KEY} : ${NAME}\n`,     NAME],
  ['vắng section',      null,                                        null],
  ['thiếu key con',     `  other: x\n`,                              null],
  ['giá trị rỗng',      `  ${KEY}:\n`,                               null],
  ['literal ~',         `  ${KEY}: ~\n`,                             null],
  ['literal null',      `  ${KEY}: null\n`,                          null],
  ['inline list [',     `  ${KEY}: [a, b]\n`,                        null],
  ['inline map {',      `  ${KEY}: {a: 1}\n`,                        null],
  ['block scalar >',    `  ${KEY}: >\n    acme\n`,                   null],
  ['block scalar |',    `  ${KEY}: |\n    acme\n`,                   null],
  ['neo &',             `  ${KEY}: &anchor x\n`,                     null],
  ['alias *',           `  ${KEY}: *anchor\n`,                       null],
  ['quote chứa #',      `  ${KEY}: "acme:brain#storm"\n`,            null],
  // Ô CÓ RĂNG cho lớp cắt-comment-quá-tay (r2): `#` không có khoảng trắng
  // đứng trước KHÔNG mở comment theo YAML. Bản `replace(/\s*#.*$/,'')` cắt
  // thành 'acme:brain' rồi lọt shape check — ô này là chỗ duy nhất thấy được.
  ['unquoted chứa #',   `  ${KEY}: acme:brain#storm\n`,              null],
  // CRLF: repo Windows / core.autocrlf khai ĐÚNG mà bị bỏ qua im lặng (r2)
  ['CRLF, giá trị trần', `  ${KEY}: ${NAME}\n`.replace(/\n/g, '\r\n'),  NAME],
  ['câu văn có dấu cách', `  ${KEY}: hãy dùng skill nào đó\n`,       null],
  ['map con lồng sâu',  `  other:\n    ${KEY}: ${NAME}\n`,           null],
  // r5 — thụt LẺ trả null là ĐÚNG hợp đồng repo (acceptance-init "2-space
  // REQUIRED"; pre-merge coi thụt lẻ là VIOLATION). Bản vá r1 từng nới chỗ
  // này và gây bất đồng thật với configList cùng file (R4-3).
  ['thụt 4 (ngược hợp đồng)', `    ${KEY}: ${NAME}\n`,              null],
  // r5 — section kế tiếp có khoá ngoài lớp [A-Za-z0-9_-] không được coi là
  // con của discovery (R3-2: bản tự viết trả 'evil' của section lạ)
  ['section lạ kế tiếp', `  x: 1\n"weird":\n  ${KEY}: evil\n`,     null],
  // r5 — từ vựng null/boolean của YAML mọi cách viết (R4-5)
  ['literal NULL hoa',  `  ${KEY}: NULL\n`,                          null],
  ['literal true',      `  ${KEY}: true\n`,                          null],
  ['YAML hỏng',         `  ${KEY} thiếu dấu hai chấm\n\t:::bad\n`,   null],
];
for (const [label, body, want] of MATRIX) {
  const got = scan(body === null ? 'schema_version: 1\n' : cfg(body));
  if (got !== want) die(`ô "${label}": nhận ${JSON.stringify(got)}, khai trước là ${JSON.stringify(want)}`);
}

// ── ĐỐI CHỨNG SEAM: fixture khai khoá tên KHÁC (giả cảnh thân lệnh đổi tên mà
// reader không đổi) phải cho null — chứng minh ô "trần" ở trên xanh vì hai đầu
// KHỚP, không phải vì reader đọc bừa.
if (scan(cfg(`  ${KEY}_doi_ten: ${NAME}\n`)) !== null)
  die('đối chứng seam FAIL: khoá tên khác vẫn đọc ra tên — reader không thật sự khớp khoá');

// ── QUAN HỆ hai nhánh trong ĐOẠN lối (a) (S4-r1, hình dạng 3): không đo
// "token có mặt" nữa. Nhánh CÓ và nhánh null phải nằm ĐÚNG phía của nó, và
// mutant xoá/đảo phải ĐỎ.
const SEG = [
  { rel: 'commands/start.md', a: 'Bắt đầu việc mới', b: 'Dưới thẻ',
    pos: /CÓ giá trị\s*→\s*mở buổi khai thác bằng đúng\s+skill đó/,
    neg: /`null`\s*→\s*đi nghi thức grill của kit/, tail: 'KHÔNG chặn',
    // Nhánh THỨ BA: đích khai mà phiên không có skill đó → NÓI THẲNG rồi grill.
    // Thêm ở r1 mà quên thước (r2 bắt): xoá cả mệnh đề thì mọi case vẫn xanh,
    // trong khi đây là nhánh duy nhất mà vắng nó gây đúng cái hại đã ghi.
    third: /nằm trong danh sách skill[\s\S]{0,40}?khả dụng[\s\S]{0,60}?→[\s\S]{0,40}?NÓI THẲNG[\s\S]{0,260}?grill của kit/i },
];
const segOf = (txt, s) => {
  const i = txt.indexOf(s.a), j = i < 0 ? -1 : txt.indexOf(s.b, i);
  if (i < 0 || j < 0) die(`${s.rel}: anchor đoạn lối (a) không thấy ('${s.a}' → '${s.b}')`);
  return txt.slice(i, j);
};
const checkSeg = (s, txt) => {
  const seg = segOf(txt, s);
  const errs = [];
  if (!s.pos.test(seg)) errs.push(`${s.rel}: đoạn lối (a) thiếu QUAN HỆ nhánh-CÓ → dùng skill đã khai`);
  if (!s.neg.test(seg)) errs.push(`${s.rel}: đoạn lối (a) thiếu QUAN HỆ nhánh-null → grill kit-own`);
  if (!seg.includes('opportunity-template.md')) errs.push(`${s.rel}: nhánh fallback không trỏ khuôn opportunity-template.md`);
  if (!seg.includes(s.tail)) errs.push(`${s.rel}: đoạn lối (a) thiếu chữ "${s.tail}"`);
  if (!seg.includes(`discovery.${KEY}`)) errs.push(`${s.rel}: đoạn lối (a) không nêu khoá config discovery.${KEY}`);
  if (!s.third.test(seg)) errs.push(`${s.rel}: đoạn lối (a) thiếu NHÁNH THỨ BA — đích khai không giải được → nói thẳng rồi grill`);
  return errs;
};
for (const s of SEG) {
  const txt = fs.readFileSync(path.join(root, s.rel), 'utf8');
  const e0 = checkSeg(s, txt);
  if (e0.length) die(`đối chứng dương FAIL: ${JSON.stringify(e0)}`);
  // mutant 1: xoá mệnh đề nhánh dương → phải đỏ đúng thông điệp
  const m1 = txt.replace(s.pos, 'CÓ giá trị thì tuỳ phiên');
  if (!checkSeg(s, m1).some(x => /thiếu QUAN HỆ nhánh-CÓ/.test(x)))
    die(`${s.rel}: mutant xoá nhánh dương không bị bắt`);
  // mutant 2: xoá mệnh đề nhánh fallback → phải đỏ đúng thông điệp
  const m2 = txt.replace(s.neg, '`null` thì thôi');
  if (!checkSeg(s, m2).some(x => /thiếu QUAN HỆ nhánh-null/.test(x)))
    die(`${s.rel}: mutant xoá nhánh fallback không bị bắt`);
  // mutant 3: xoá mệnh đề nhánh thứ ba → phải đỏ đúng thông điệp
  const m3 = txt.replace(s.third, 'đích khai thì cứ dùng');
  if (m3 === txt) die(`${s.rel}: tiêm mutant nhánh thứ ba thất bại — regex không khớp bản sống`);
  if (!checkSeg(s, m3).some(x => /thiếu NHÁNH THỨ BA/.test(x)))
    die(`${s.rel}: mutant xoá nhánh thứ ba không bị bắt`);
}
console.log(`P166 OK (khoá '${KEY}' rút từ thân lệnh · ma trận ${MATRIX.length} ô · đối chứng seam · 2 đoạn × 3 mutant quan hệ)`);
JS

# ── P167: F-K cấm hardcode tên bên-thứ-ba không-dependency trong cây nguồn
# kit (vendor/ loại trừ CÓ CHỦ ĐÍCH — entry d-10006) + hai đoạn luật sống
# spec v2 đo QUAN HỆ (chứa ổ cắm VÀ không chứa tên cũ), mutant per-đoạn (E4,E5).
# S4-r1 sửa hai lỗ: (a) sanity counter GỘP `n > 50` cho phép mất trọn vài cây mà
# vẫn xanh → đổi sang đếm PER-CÂY, cây vắng là ĐỎ CÓ TÊN chứ không `continue`;
# (b) đối chứng dương chỉ tiêm 1 chuỗi vào 1 cây → tiêm MỌI chuỗi cấm vào MỌI
# cây, mỗi lượt phải đỏ nêu đúng tên file.
run "P167 F-K cam hardcode ben-thu-ba: quet PER-CAY + doi chung tiem day du + 2 doan luat spec (E4,E5)" \
  python3 - "$ROOT" <<'PY'
import shutil, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
BAD = ["product-management:", "pm-execution:"]
TREES = ["commands", "skills", "feature-loop", "scripts", "lib", "hooks"]
# R4-1 (r5): DANH SÁCH LOẠI TRỪ, không phải danh sách cho phép. Bản cũ liệt 7
# đuôi được quét và bỏ lọt 6 thân prompt agent .toml + .py + .tsv — đúng loại
# file mà một tên plugin bên-thứ-ba sẽ bị nhét vào (kiểm tay: tiêm vào
# acceptance_judge.toml, phép quét vẫn OK). Chốt per-cây không cứu được vì nó
# đếm file ĐÃ QUA bộ lọc. Danh sách cho phép là allowlist trên không gian mở —
# mỗi loại file mới thêm vào kho lại lặng lẽ nằm ngoài lệnh cấm.
SKIP_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".pdf", ".zip",
             ".gz", ".woff", ".woff2", ".ttf", ".otf", ".mp4", ".mov"}
SKIP_DIRS = {"node_modules", ".git"}

def sweep(base):
    """→ (offenders, {cây: số file đã đọc}). Cây vắng KHÔNG bị nuốt: nó vào
    counts với 0 và chốt per-cây bên dưới sẽ đỏ, nêu đúng tên cây."""
    offenders, counts = [], {}
    for area in TREES:
        d = base / area
        n = 0
        if d.exists():
            for p in sorted(d.rglob("*")):
                if not p.is_file(): continue
                if p.suffix.lower() in SKIP_EXTS: continue
                if any(part in SKIP_DIRS for part in p.parts): continue
                n += 1
                txt = p.read_text(encoding="utf-8", errors="replace")
                for bad in BAD:
                    if bad in txt:
                        offenders.append(f"{p.relative_to(base)}: chứa '{bad}'")
        counts[area] = n
    return offenders, counts

off, counts = sweep(root)
# Chốt PER-CÂY: một cây bị đổi tên/di chuyển mà TREES quên sửa thì lệnh cấm
# ngừng hiệu lực trên cây đó — ngưỡng gộp không bao giờ thấy (S4-r1).
empty = [a for a, n in counts.items() if n == 0]
assert not empty, f"cây khai trong TREES mà không đọc được file nào: {empty} — walker hỏng hoặc cây đã đổi tên; 0-hit không tin được"
assert off == [], f"cây nguồn kit hardcode tên plugin bên-thứ-ba không-dependency: {off[:5]}"

# ── ĐỐI CHỨNG DƯƠNG ĐẦY ĐỦ: tiêm MỖI chuỗi cấm vào MỖI cây, quét lại bằng
# CÙNG hàm. Bản cũ chỉ tiêm 1 chuỗi vào 1 cây nên 7 cây và chuỗi thứ hai chưa
# bao giờ được chứng minh là thật sự được đọc.
for area in TREES:
    for bad in BAD:
        tmp = Path(tempfile.mkdtemp(prefix="p167-"))
        try:
            shutil.copytree(root / area, tmp / area)
            victims = sorted(p for p in (tmp / area).rglob("*")
                             if p.is_file() and p.suffix.lower() not in SKIP_EXTS)
            assert victims, f"{area}: không có file nào để tiêm — fixture hỏng"
            v = victims[0]
            v.write_text(v.read_text(encoding="utf-8") + f"\n{bad}mut\n", encoding="utf-8")
            off2, _ = sweep(tmp)
            assert any(v.name in o and bad in o for o in off2), \
                f"đối chứng dương FAIL: tiêm '{bad}' vào {area}/{v.name} mà phép quét vẫn xanh — {off2[:3]}"
        finally:
            shutil.rmtree(tmp)

# ── R4-1: đối chứng ĐÍCH DANH loại file từng lọt (thân prompt agent .toml) ──
# Không gộp vào vòng tiêm chung ở trên: vòng đó lấy file ĐẦU TIÊN của mỗi cây,
# nên nếu bộ lọc lại thu hẹp thì .toml vẫn có thể lặng lẽ ra ngoài vùng quét.
# Fixture do CODE SINH trong chính lần chạy: cây hiện không còn file .toml nào,
# và một đối chứng phụ thuộc "cây phải sẵn có loại file đó" sẽ chết lặng ngay
# lần dọn thư mục kế tiếp — đúng lớp lỗi mà chính nó sinh ra để chặn.
tmp = Path(tempfile.mkdtemp(prefix="p167toml-"))
try:
    shutil.copytree(root / "commands", tmp / "commands")
    v = tmp / "commands" / "agent-prompt-thu.toml"
    v.write_text("[prompt]\nbody = \"\"\"\nproduct-management:brainstorm\n\"\"\"\n", encoding="utf-8")
    off_pos, counts_pos = sweep(tmp)
    assert any(v.name in o for o in off_pos), \
        f"doi chung .toml FAIL: tiem ten plugin vao {v.name} ma phep quet van xanh — {off_pos[:3]}"
    # Chieu nguoc: go dung dong tiem thi ca file .toml VAN duoc doc (khong phai
    # xanh vi bi loc ra) — phan biet "bat dung" voi "chua bao gio quet".
    v.write_text("[prompt]\nbody = \"\"\"\nkhong co ten plugin nao\n\"\"\"\n", encoding="utf-8")
    off_neg, counts_neg = sweep(tmp)
    assert not any(v.name in o for o in off_neg), \
        f"doi chung am .toml FAIL: file sach ma van bi neu ten — {off_neg[:3]}"
    assert counts_neg.get("commands", 0) == counts_pos.get("commands", 0), \
        "so file doc duoc doi giua hai lan — buoc quet khong on dinh"
finally:
    shutil.rmtree(tmp)

# ── hai đoạn luật sống spec v2: quan hệ chứa-ổ-cắm ∧ không-chứa-tên-cũ ──
SPEC = root / "docs/specs/workflow-v2-spec.md"
SEGS = [
    ("§2.1 D1 hai mode", "**D1 hai mode**", "**Luật kế thừa vật liệu ngoài**"),
    ("§6 định tuyến brainstorm", "**Định tuyến brainstorm**", "**Lối vào người mới**"),
]
def check_spec(txt):
    errs = []
    for name, a, b in SEGS:
        i = txt.find(a)
        j = txt.find(b, i) if i >= 0 else -1
        if i < 0 or j < 0:
            errs.append(f"{name}: anchor không thấy ('{a}' → '{b}')"); continue
        seg = txt[i:j]
        if "discovery.brainstorm_skill" not in seg:
            errs.append(f"{name}: thiếu ổ cắm discovery.brainstorm_skill")
        if "product-management:brainstorm" in seg:
            errs.append(f"{name}: còn hardcode product-management:brainstorm")
    return errs
spec = SPEC.read_text(encoding="utf-8")
assert check_spec(spec) == [], f"đối chứng dương FAIL — spec thật phải xanh: {check_spec(spec)}"
for name, a, b in SEGS:
    i = spec.find(a)
    mut = spec[:i] + a + " product-management:brainstorm " + spec[i + len(a):]
    errs = check_spec(mut)
    assert any(name in e and "còn hardcode" in e for e in errs), \
        f"mutant tiêm tên cũ vào {name} không bị bắt đúng thông điệp: {errs}"
    mut2 = spec[:i] + spec[i:].replace("discovery.brainstorm_skill", "o_cam_doi_ten", 1)
    errs2 = check_spec(mut2)
    assert any(name in e and "thiếu ổ cắm" in e for e in errs2), \
        f"mutant xoá ổ cắm khỏi {name} không bị bắt đúng thông điệp: {errs2}"
print(f"P167 OK (per-cây {counts} · tiêm {len(TREES)}×{len(BAD)} đều đỏ · 2 đoạn luật spec + 4 mutant)")
PY

# ── P164 [TEETH] (measure-teeth-cleanup E3,E4,E7): thong diep fail-loud cua
#     carry-plan ghim CHUOI (khong chi ma thoat) + chan sanity so vang doc lap
#     (round-trip writer→reader qua khuon template + bat dang thuc corpus). ──
echo "P164 [TEETH] carry-plan message matrix + gold stats doc lap"
run "P164 carry-plan messages + gold stats" \
  python3 - "$ROOT" <<'P164PY'
import json, pathlib, re, subprocess, sys, tempfile
root = pathlib.Path(sys.argv[1])

# ══ E3+E4: ma tran thong diep — CHUOI ghim, khac nhau doi mot ══
TOOL = root / "feature-loop/scripts/carry-plan.mjs"
W = root / "_acceptance/card-text-fidelity"
_lines = [json.loads(l) for l in (W / "run-log.jsonl").read_text(encoding="utf-8").split("\n") if l.strip()]
_last = max(e.get("round", 0) for e in _lines if e.get("kind") is None and e.get("evalId"))
BASE_ARGS = ["--run-log", str(W / "run-log.jsonl"), "--evals", str(W / "evals.yaml"),
             "--contract", str(W / "contract.md"), "--round", str(_last + 1)]
def run_tool(extra):
    r = subprocess.run(["node", str(TOOL)] + BASE_ARGS + extra, capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr
MSGS = {
  "bo-han-co":      ([],                                "phải nêu ĐÚNG MỘT"),
  "go-sai-co":      (["--delta_files", "src/a.js"],     "cờ không nhận diện được"),
  "chuoi-rong":     (["--delta-files", ""],             "--delta-files rỗng"),
}
seen = {}
for name, (extra, want) in MSGS.items():
    rc, out = run_tool(extra)
    assert rc == 2, "ca %s phai exit 2, got %d" % (name, rc)
    assert want in out, "ca %s phai chua %r, got %r" % (name, want, out[:150])
    seen[name] = want
vals = list(seen.values())
assert len(set(vals)) == len(vals), "ba thong diep phai khac nhau doi mot: %r" % vals
# AC-3: co sai CO gia tri → neu DUNG co, KHONG neu gia tri
rc, out = run_tool(["--delta_files", "src/a.js"])
assert "--delta_files" in out, "phai neu dich danh co viet sai, got %r" % out[:150]
assert "src/a.js" not in out, "khong duoc tro vao GIA TRI di sau co: %r" % out[:150]
rc2, out2 = run_tool(["--oops"])   # co sai KHONG gia tri o cuoi — cung nhanh
assert rc2 == 2 and "cờ không nhận diện được" in out2, "co sai khong gia tri phai cung nhanh"
rc3, _ = run_tool(["--delta-files", "docs/x.md"])
assert rc3 == 0, "doi chung duong: co dung phai chay duoc"

# ══ E7: chan sanity DOC LAP — round-trip writer→reader ══
GOLD = root / "scripts/acceptance-gold.mjs"
def stats(gold_js, r):
    p = subprocess.run(["node", str(gold_js), "--root", str(r), "--stats"], capture_output=True, text=True)
    assert p.returncode == 0, "gold --stats loi: %s" % p.stderr[-200:]
    return json.loads(p.stdout)
# (a) corpus THAT: bat dang thuc cau truc + in hai so vao bang chung
s = stats(GOLD, root)
assert s["judgmentBlocks"] >= s["points"], "bat dang thuc do: %r" % s
assert s["judgmentBlocks"] > 0 and s["points"] > 0, "sanity corpus: %r" % s
# (b) round-trip: khuon block phan rut TU TEMPLATE THAT (writer-khuon), dien
#     toi thieu, CHUA co nguoi quyet → judgmentBlocks=1, points=0
# Khuon block RUT TU TEMPLATE (S4-r1: ban truoc grep mot token roi viet tay
# block — writer/reader troi khoi nhau van xanh). Lay nguyen khoi mau giua hai
# marker JUDGMENT-BLOCK-TEMPLATE cua template that.
tpl = (root / "skills/acceptance/references/evidence-report-template.md").read_text(encoding="utf-8")
mt = re.search(r"<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->\n([\s\S]*?)<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->", tpl)
assert mt, "template khong co marker JUDGMENT-BLOCK-TEMPLATE"
BLOCK_TPL = mt.group(1)
assert "judged_by" in BLOCK_TPL, "khuon rut tu template khong co truong judged_by"
with tempfile.TemporaryDirectory() as d:
    ws = pathlib.Path(d) / "_acceptance" / "viec-mau"
    ws.mkdir(parents=True)
    # dien khuon THAT: bo dong human_override (chua co nguoi quyet) + thay cac
    # cho giu-cho bang gia tri toi thieu; KHONG tu go khuon
    filled = "\n".join(l for l in BLOCK_TPL.split("\n") if "human_override" not in l)
    filled = re.sub(r"\{\{[^}]*\}\}", "thu", filled)
    (ws / "evidence-report.md").write_text("## Per-eval\n\n" + filled + "\n  human_override:\n", encoding="utf-8")
    s2 = stats(GOLD, pathlib.Path(d))
    assert s2["judgmentBlocks"] == 1 and s2["points"] == 0, \
        "hai bo dem PHAI doc lap: block phan chua nguoi quyet cho %r" % s2
    # (c) doi chung: hong duong doc khoi phan → bo dem khoi phan = 0 trong khi
    #     block van ton tai — chan sanity phai DO duoc
    mut = pathlib.Path(d) / "gold-mut.mjs"
    src = GOLD.read_text(encoding="utf-8")
    broken = src.replace("judged_by\\s*:", "zzz_no_read\\s*:")   # chuoi regex duy nhat cua BO DEM (khong cham parser)
    assert broken != src, "tiem that bai"
    mut.write_text(broken, encoding="utf-8")
    s3 = stats(mut, pathlib.Path(d))
    assert s3["judgmentBlocks"] == 0, "duong doc hong ma bo dem van dem duoc: %r — bo dem khoi phan khong doc lap" % s3
print("P164 OK: 3 thong diep phan biet · stats corpus %d>=%d · round-trip doc lap" % (s["judgmentBlocks"], s["points"]))
P164PY

# ── ĐÃ GỠ: P163 (thi-hành bảng răng) + P165 (sổ SIẾT/NỚI) ────────────────────
# Quyết tại Cổng 2 measure-teeth-cleanup, Manh Phan 2026-08-06, sau 3 vòng
# verify (8/8/7 lỗi trong hợp đồng). Hai chốt này sinh ra để CƯỠNG CHẾ nghi
# thức "phá vật thật trong bản sao" và luật "không nới thước cũ", nhưng phần
# lớn lỗi mỗi vòng là lỗi MỚI do chính chúng đẻ ra — mỗi chốt meta lại cần
# một chốt cho chính nó (fail-open khi thiếu mốc, nguồn "độc lập" thực chất là
# khai-báo-đối-khai-báo, sổ không có chốt mồ côi, bộ lọc tốn ~3ph chứ không
# phải vài giây). Nghi thức và luật VẪN CÒN HIỆU LỰC — chúng sống trong
# CLAUDE.md và trong phản biện Cổng 1 + vòng soi S4, chỉ là không có chốt máy
# cưỡng chế. Năm phép đo mà đợt dọn nhắm tới thì đã có răng và ở lại (P155,
# P157, P160, P161, P162, P164).
# ─────────────────────────────────────────────────────────────────────────────

echo "P168 (E1,E2,E3,E4) luat dung-va: khoi co moc, 4 y + 2 ve, quan he chua, ma tran 16 ca"
run "P168 stop-patching-law: noi dung + vi tri + 16 dot bien" \
  python3 - "$ROOT" <<'P168PY'
import re, sys
from pathlib import Path

ROOT = Path(sys.argv[1])
errs = []

HARNESS = {
    'claude': {
        'path': ROOT / 'feature-loop/skills/feature-loop/SKILL.md',
        'cap': '**Tối đa 3 round**',
        'ideas': {
            'so-lop':   (r'so lớp lỗi vòng này với vòng trước',
                         'so lớp lỗi vòng này với vòng trước'),
            'ket-luan': (r'thứ hai[^.]*cùng lớp[^.]*khuôn giải sai',
                         'Vòng sửa thứ HAI vẫn sinh lỗi CÙNG LỚP với vòng một ⇒ **khuôn giải sai**, không phải chi tiết sai.'),
            'dung':     (r'dừng[^.]*không tự dispatch vòng ba',
                         'DỪNG — KHÔNG tự dispatch vòng ba.'),
            'ba-duong': (r'ba đường.*?đổi khuôn.*?thu phạm vi.*?giới hạn đã biết',
                         'Trình người ba đường: **đổi khuôn** · **thu phạm vi** · **ship với giới hạn đã biết**;'),
        },
        'ves': {
            'khang-dinh': (r'"cùng lớp"\s*=\s*cùng tên lớp lỗi',
                           '"Cùng lớp" = cùng TÊN LỚP LỖI trong sổ lớp lỗi'),
            'phu-dinh':   (r'không phải cùng dòng mã hay cùng phép đo',
                           'KHÔNG phải cùng dòng mã hay cùng phép đo'),
        },
        'examples': ['đo-chuỗi-thay-quan-hệ', 'hạ-thước', 'fail-open'],
    },
}

OPEN = '<!-- <<<STOP-PATCHING-CLAUSE -->'
CLOSE = '<!-- STOP-PATCHING-CLAUSE>>> -->'


def norm(t):
    return re.sub(r'\s+', ' ', t).strip()


# ── Lop 1: rut khoi giua cap moc (KHONG quet toan tep) ───────────────────────
def extract(text, h):
    e = []
    no, nc = text.count(OPEN), text.count(CLOSE)
    if no != 1 or nc != 1:
        e.append(f'[{h}] mệnh đề dừng-vá: mốc mở {no} lần / mốc đóng {nc} lần (phải đúng 1 mỗi loại)')
        return None, e
    blk = text.split(OPEN, 1)[1].split(CLOSE, 1)[0]
    if not norm(blk):
        e.append(f'[{h}] mệnh đề dừng-vá: khối giữa hai mốc rỗng')
        return None, e
    return norm(blk), e


# ── Lop 2: 4 y + 2 ve, do TRONG khoi ────────────────────────────────────────
LABEL = {
    'so-lop': 'ý so lớp lỗi hai vòng',
    'ket-luan': 'ý khuôn giải sai',
    'dung': 'ý dừng không tự dispatch',
    'ba-duong': 'ý trình người ba đường',
}


def check_content(blk, h):
    e = []
    cfg = HARNESS[h]
    for k, (rx, _snip) in cfg['ideas'].items():
        if not re.search(rx, blk, re.I | re.S):
            e.append(f'[{h}] thiếu {LABEL[k]}')
    if not re.search(cfg['ves']['khang-dinh'][0], blk, re.I | re.S):
        e.append(f'[{h}] thiếu vế khẳng định của định nghĩa cùng lớp')
    else:
        hit = [x for x in cfg['examples'] if x in blk]
        if len(hit) < 3:
            e.append(f'[{h}] định nghĩa cùng lớp thiếu ví dụ tên lớp (thấy {len(hit)}/3)')
    if not re.search(cfg['ves']['phu-dinh'][0], blk, re.I | re.S):
        e.append(f'[{h}] thiếu vế phủ định: không phải cùng dòng mã hay cùng phép đo')
    return e


# ── Lop 3: QUAN HE CHUA, khong phai chi so ky tu ────────────────────────────
HEAD_RE = re.compile(r'^#{1,6} .*$', re.M)


def enclosing_heading(text, pos):
    last = None
    for m in HEAD_RE.finditer(text):
        if m.start() < pos:
            last = m.group(0).strip()
        else:
            break
    return last


def check_position(text, h):
    e = []
    cap = HARNESS[h]['cap']
    if cap not in text:
        e.append(f'[{h}] không tìm thấy mệnh đề trần 3 vòng ("{cap}")')
        return e
    if OPEN not in text:
        return e  # da bao o lop 1
    i_clause, i_cap = text.index(OPEN), text.index(cap)
    hc, hk = enclosing_heading(text, i_clause), enclosing_heading(text, i_cap)
    if hc != hk:
        e.append(f'[{h}] hai mệnh đề dừng KHÁC nhánh: tiêu đề bao ngoài {hc!r} vs {hk!r}')
    if i_clause > i_cap:
        e.append(f'[{h}] mốc mở đứng SAU mệnh đề trần 3 vòng')
    return e


def check_all(text, h):
    blk, e = extract(text, h)
    if blk is not None:
        e += check_content(blk, h)
    e += check_position(text, h)
    return e


SRC = {h: HARNESS[h]['path'].read_text() for h in HARNESS}

# ── Doi chung DUONG: ban nguyen ven phai XANH truoc moi ket luan am tinh ─────
for h in HARNESS:
    e = check_all(SRC[h], h)
    if e:
        errs.append(f'ĐỐI CHỨNG DƯƠNG ĐỎ ({h}) — bản nguyên vẹn phải xanh: ' + ' | '.join(e))
if errs:
    print('\n'.join('  ' + x for x in errs)); sys.exit(1)

# ── Doi chung AC-3: DOI khoi ra khoi nhanh (giu nguyen thu tu tep) ──────────
for h in HARNESS:
    t = SRC[h]
    blk_full = OPEN + t.split(OPEN, 1)[1].split(CLOSE, 1)[0] + CLOSE
    stripped = t.replace(blk_full, '')
    m = HEAD_RE.search(stripped)          # tieu de dau tien cua tep
    m2 = HEAD_RE.search(stripped, m.end())  # dat khoi GIUA hai tieu de dau
    moved = stripped[:m2.start()] + blk_full + '\n\n' + stripped[m2.start():]
    e = check_all(moved, h)
    if not any('KHÁC nhánh' in x for x in e):
        errs.append(f'[{h}] AC-3 KHÔNG có răng: dời khối ra khỏi nhánh mà phép đo vẫn xanh')

# ── Ma tran dot bien: DOC bang STOP-PATCH-MUTANTS trong hop dong ────────────
CONTRACT = (ROOT / '_acceptance/stop-patching-law/contract.md').read_text()
tbl = CONTRACT.split('<!-- <<<STOP-PATCH-MUTANTS -->', 1)[1].split('<!-- STOP-PATCH-MUTANTS>>> -->', 1)[0]
rows = []
for line in tbl.splitlines():
    line = line.strip()
    if not line.startswith('- '):
        continue
    parts = [x.strip() for x in line[2:].split('|')]
    if len(parts) != 3:
        errs.append(f'bảng STOP-PATCH-MUTANTS: dòng {line!r} không đủ 3 cột')
        continue
    ca, ban, phrase = parts
    for h in (['claude', 'codex'] if ban == 'cả hai' else [ban]):
        rows.append((ca, h, phrase))

expected_n = 0
for line in tbl.splitlines():
    line = line.strip()
    if line.startswith('- '):
        expected_n += 2 if line.split('|')[1].strip() == 'cả hai' else 1
if len(rows) != expected_n:
    errs.append(f'ma trận đột biến: dựng {len(rows)} ca nhưng bảng khai {expected_n}')

# Harness da luu kho: bang van khai DU (no la khai-truoc cua ho so cu, khong
# duoc sua), nhung chi chay duoc hang cua harness CON SONG. Loc phai NOI RA so
# hang bo qua — cat im lang doc y het "da phu het".
LIVE = set(HARNESS)
rows_all, rows = rows, [r for r in rows if r[1] in LIVE]
bo_qua = len(rows_all) - len(rows)
print(f'P168 pham vi: {len(rows)}/{len(rows_all)} ca chay duoc, bo qua {bo_qua} ca cua harness da luu kho ({sorted(set(r[1] for r in rows_all) - LIVE)})')

# SAN TUYET DOI + NGUON DOC LAP (S4-r1: hai ve dem cu deu suy tu CUNG bang, nen
# xoa sach than bang van in "P168 OK (0 ca)" — hang-dung). Nay ca so ca phai:
#   (a) >= FLOOR ghim cung trong chinh phep do (xoa bang => 0 < 16 => DO)
#   (b) == so contract KHAI BANG CHU o van xuoi ngoai bang (nguon thu hai)
FLOOR = 16
if expected_n < FLOOR:
    errs.append(f'ma trận đột biến: bảng chỉ sinh {expected_n} ca, sàn tuyệt đối là {FLOOR} — bảng bị xoá/thu nhỏ?')
# San rieng cho phan CHAY DUOC: mot harness bi luu kho lam nua ma tran ngung
# chay, nhung khong duoc phep tut them nua.
FLOOR_LIVE = FLOOR // 2
if len(rows) < FLOOR_LIVE:
    errs.append(f'ma trận đột biến: chỉ còn {len(rows)} ca chạy được, sàn là {FLOOR_LIVE}')
m = re.search(r'Tổng số ca\s*=\s*[^=]*=\s*\*\*(\d+)\*\*', CONTRACT)
if not m:
    errs.append('contract KHÔNG khai tổng số ca bằng chữ ("Tổng số ca = ... = **N**") — mất nguồn đối chứng độc lập')
elif int(m.group(1)) != expected_n:
    errs.append(f'ma trận đột biến: contract khai {m.group(1)} ca nhưng bảng sinh {expected_n}')


def mutate(text, ca, h):
    cfg = HARNESS[h]
    if ca == 'xoá-trọn-khối':
        blk = OPEN + text.split(OPEN, 1)[1].split(CLOSE, 1)[0] + CLOSE
        return text.replace(blk, '')
    if ca == 'xoá-trần-ba-vòng':
        return text.replace(cfg['cap'], '', 1)
    key = {'xoá-ý-so-lớp': 'so-lop', 'xoá-ý-kết-luận': 'ket-luan',
           'xoá-ý-dừng': 'dung', 'xoá-ý-ba-đường': 'ba-duong'}.get(ca)
    if key:
        snip = cfg['ideas'][key][1]
    elif ca == 'xoá-vế-khẳng-định':
        snip = cfg['ves']['khang-dinh'][1]
    elif ca == 'xoá-vế-phủ-định':
        snip = cfg['ves']['phu-dinh'][1]
    else:
        return None
    rx = re.compile(r'\s+'.join(re.escape(w) for w in snip.split()))
    out, n = rx.subn('', text, count=1)
    return out if n == 1 else None


ran = 0
for ca, h, phrase in rows:
    mut = mutate(SRC[h], ca, h)
    if mut is None:
        errs.append(f'[{h}] ca {ca}: KHÔNG tiêm được (đoạn cần xoá không khớp file) — ca chưa bao giờ chạy')
        continue
    if mut == SRC[h]:
        errs.append(f'[{h}] ca {ca}: bản tiêm y hệt bản gốc')
        continue
    e = check_all(mut, h)
    if not e:
        errs.append(f'[{h}] ca {ca}: bản bị tiêm vẫn XANH')
    elif not any(phrase in x for x in e):
        errs.append(f'[{h}] ca {ca}: thông điệp KHÔNG chứa nguyên văn {phrase!r} — thấy {e}')
    else:
        ran += 1

if ran != len(rows) and not errs:
    errs.append(f'ma trận đột biến: chạy {ran}/{len(rows)} ca chạy được')
if ran < FLOOR_LIVE and not errs:
    errs.append(f'ma trận đột biến: chỉ chạy {ran} ca, dưới sàn {FLOOR_LIVE}')

if errs:
    print('\n'.join('  ' + x for x in errs)); sys.exit(1)
print(f'P168 OK ({ran} ca đột biến chạy được / {expected_n} bảng khai + 2 đối chứng dời-khối)')
P168PY

echo "P169 (AC-6) bien ban cham hanh vi phai do CODE SINH; ban ghi DA KY thi ghi-mot-lan"
run "P169 dau vao cham hanh vi: sinh trong BAN SAO, ban ghi da ky khong bi sinh de" \
  python3 - "$ROOT" <<'P169PY'
import re, shutil, subprocess, sys, tempfile
from pathlib import Path

# S4-r1 sua theo LOP: ban truoc chay bo sinh THANG tren cay lam viec, nen
#   (a) buoc phat hien lech dong thoi la buoc XOA lech — chay lai lan hai luon
#       xanh, mot lan retry trong CI bien DO thanh XANH;
#   (b) no ghi de ho so evidence DA KY cua feature khac de lam doi chung.
# Nay: dung mot ROOT tam, sinh o do, so voi cay that. Cay that KHONG bi cham.
#
# Vong sua 1 cua ho so luu-kho (2026-08-13) sua tiep MOT LOP KHAC: ban truoc doi
# hai tep `chi-dan-*` phai bang y het ban sinh lai tu SKILL.md HIEN TAI. Do la
# mot bat bien SAI — hai tep do la ban ghi CHI DAN THAT DA DUA CHO AGENT trong
# mot luot da ky, con SKILL.md thi doi hop le theo thoi gian. Buoc chung bang
# nhau nghia la moi lan SKILL.md doi thi bang chung da ky phai bi VIET LAI cho
# phep do xanh — dung thu kit sinh ra de chan (da xay ra that: +11/-12 dong moi
# tep). Nay chia lam hai loai va do bang hai luat khac nhau:
#   · DERIVED  (`bien-ban-vong-2.md`) — dan xuat tu ho so nguon: round-trip nhu cu.
#   · FROZEN   (`chi-dan-claude-*`)  — su lieu ghi-mot-lan: do QUAN HE noi bo
#     (ban DA XOA == ban CO tru dung khoi menh de) voi moc RUT TU CHINH BO SINH,
#     cong mot chieu do that: bo sinh chay tren cay da co hai tep do KHONG duoc
#     dung vao chung.

ROOT = Path(sys.argv[1])
SLUG = '_acceptance/stop-patching-law'
EV = ROOT / SLUG / 'evidence'
SRC_REPORT = '_acceptance/card-text-fidelity/evidence-report.md'
GEN_REL = SLUG + '/make-record.mjs'
NEEDED = [
    GEN_REL,
    SRC_REPORT,
    'feature-loop/skills/feature-loop/SKILL.md',
]
DERIVED = ['bien-ban-vong-2.md']
FROZEN = [f'chi-dan-{h}-{a}-menh-de.md' for h in ('claude',) for a in ('co', 'khong')]
ALL = DERIVED + FROZEN
errs = []

# Moc menh de RUT TU CHINH BO SINH (writer), khong go lai o day (reader) — seam
# LLM/may viet -> may doc phai co MOT cho dat khuon, khong hai ban chep.
gen_src = (ROOT / GEN_REL).read_text()


def const_of(name):
    m = re.search(r"const %s = '([^']*)';" % name, gen_src)
    return m.group(1) if m else None


MARK_OPEN, MARK_CLOSE = const_of('OPEN'), const_of('CLOSE')
if not MARK_OPEN or not MARK_CLOSE:
    errs.append('không rút được mốc mệnh đề từ make-record.mjs — reader tự dựng khuôn '
                'là fixture viết tay, hai bên sẽ trôi khỏi nhau')

live = {}
for f in ALL:
    q = EV / f
    if not q.exists():
        errs.append(f'thiếu đầu vào cho phép chấm hành vi: {f}')
    else:
        live[f] = q.read_text()


def build(mutate_report=None, seed=None):
    """Dung mot ROOT tam du file, chay bo sinh o do, tra (proc, {ten: noi dung})."""
    tmp = Path(tempfile.mkdtemp())
    try:
        for rel in NEEDED:
            dst = tmp / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            text = (ROOT / rel).read_text()
            if rel == SRC_REPORT and mutate_report:
                text = mutate_report(text)
            dst.write_text(text)
        out = tmp / SLUG / 'evidence'
        if seed:
            out.mkdir(parents=True, exist_ok=True)
            for name, text in seed.items():
                (out / name).write_text(text)
        r = subprocess.run(['node', str(tmp / SLUG / 'make-record.mjs')],
                           capture_output=True, text=True)
        got = {f: (out / f).read_text() for f in ALL if (out / f).exists()}
        return r, got
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if not errs:
    r, got = build()
    if r.returncode != 0:
        errs.append(f'bộ sinh exit {r.returncode}: {r.stderr.strip()[:200]}')
    else:
        # Cay tam KHONG co san evidence => bo sinh phai tao ra ĐỦ CA BA. Chan nay
        # la doi chung duong cho nhanh ghi-mot-lan: thieu no thi "khong sinh de"
        # khong phan biet duoc voi "khong bao gio sinh noi".
        missing = [f for f in ALL if f not in got]
        if missing:
            errs.append(f'bộ sinh KHÔNG tạo ra: {missing}')
        drift = [f for f in DERIVED if f in got and got[f] != live.get(f)]
        if drift:
            errs.append(f'đầu vào trên đĩa KHÁC bản sinh lại {drift} — có bàn tay người sửa fixture')

# Doi chung duong: doi ho so NGUON thi bien ban phai doi theo (khong phai van chet)
if not errs:
    r2, got2 = build(lambda t: t.replace('Round 4: ', 'Round 4: DAU-VET-DOI-CHUNG ', 1))
    if r2.returncode != 0 or 'DAU-VET-DOI-CHUNG' not in got2.get('bien-ban-vong-2.md', ''):
        errs.append('đối chứng dương: đổi hồ sơ nguồn mà biên bản KHÔNG đổi theo — bộ sinh không đọc nguồn')

# CHIEU DO CHAY THAT cho luat ghi-mot-lan: gieo hai tep FROZEN bang mot chuoi
# khong the sinh ra tu bat ky SKILL.md nao, chay lai bo sinh, doi chung SONG SOT.
if not errs:
    SENTINEL = 'SU-LIEU-DA-KY-KHONG-DUOC-SINH-DE\n'
    r3, got3 = build(seed={f: SENTINEL for f in FROZEN})
    overwritten = [f for f in FROZEN if got3.get(f) != SENTINEL]
    if overwritten:
        errs.append(f'bộ sinh GHI ĐÈ bản ghi đã ký {overwritten} — bằng chứng của một lượt '
                    f'đã chạy bị viết lại theo cây hiện tại')
    if 'GIỮ NGUYÊN' not in r3.stderr:
        errs.append('bộ sinh bỏ qua nhánh đã ký mà KHÔNG NÓI RA — cắt im lặng đọc y hệt "đã sinh đủ"')
    if got3.get('bien-ban-vong-2.md') != live.get('bien-ban-vong-2.md'):
        errs.append('luật ghi-một-lần lan sang cả bản DẪN XUẤT — biên bản phải vẫn sinh lại mỗi lượt')

# Quan he noi bo cua cap FROZEN: ban DA XOA == ban CO tru dung khoi menh de.
# Day moi la round-trip that cua cap nay — no khong phu thuoc SKILL.md hien tai.
if not errs:
    co, khong = FROZEN[0], FROZEN[1]
    t = live[co]
    i, j = t.find(MARK_OPEN), t.find(MARK_CLOSE)
    if i < 0 or j < 0:
        errs.append('nhánh CÓ mệnh đề lại KHÔNG chứa mốc')
    else:
        stripped = t[:i] + t[j + len(MARK_CLOSE):]
        if stripped != live[khong]:
            errs.append('nhánh ĐÃ XOÁ mệnh đề KHÔNG bằng nhánh CÓ trừ đúng khối mệnh đề — '
                        'hai bản khác nhau ở chỗ khác, đối chứng âm không còn cô lập được mệnh đề')
    if MARK_OPEN in live[khong]:
        errs.append('nhánh ĐÃ XOÁ mệnh đề vẫn còn mốc — hai nhánh không khác nhau')

# Cay that phai NGUYEN VEN sau khi phep do chay xong
for f, before in live.items():
    if (EV / f).read_text() != before:
        errs.append(f'phép đo tự ghi đè cây làm việc: {f}')
if (ROOT / SRC_REPORT).read_text().find('DAU-VET-DOI-CHUNG') >= 0:
    errs.append('phép đo để lại dấu vết đối chứng trong hồ sơ ĐÃ KÝ của feature khác')

if errs:
    print('\n'.join('  ' + x for x in errs)); sys.exit(1)
print('P169 OK (dẫn xuất round-trip; bản ghi đã ký ghi-một-lần, chiều đỏ chạy thật)')
P169PY

echo "P170 (AC-6) doi chung hanh vi: cau tra loi CO menh de phai TRICH duoc menh de, ban DA XOA thi khong"
run "P170 quan he trich-dan giua 4 luot va khoi menh de" \
  python3 - "$ROOT" <<'P170PY'
import re, sys
from pathlib import Path

# S4-r1 sua theo LOP: ban truoc dat rubric PASS/FAIL va NHAN NHANH ngay trong
# `question:` cua eval judgment, nen 4 luot do "lam theo rubric" chu khong do
# menh de. Nay: mot prompt TRUNG TINH duy nhat cho ca 4 luot (thu duy nhat doi
# la duong dan file chi dan), va phep do la QUAN HE giua cau tra loi va CHINH
# khoi menh de — khong phai danh sach tu khoa viet tay.
#   arm A (co menh de)   => cau tra loi phai chua mot doan NGUYEN VAN du dai
#                           cua khoi menh de (chi doc duoc neu khoi ton tai)
#   arm B (da xoa)       => KHONG the chua doan do
# Nguong dai lay theo do dai khoi, khong ghim so tuy y.

ROOT = Path(sys.argv[1])
EV = ROOT / '_acceptance/stop-patching-law/evidence'
OPEN, CLOSE = '<!-- <<<STOP-PATCHING-CLAUSE -->', '<!-- STOP-PATCHING-CLAUSE>>> -->'
SKILL = {
    'claude': 'feature-loop/skills/feature-loop/SKILL.md',
}
ARMS = [('A1', 'claude', 'co'),
        ('B1', 'claude', 'khong')]
errs = []


def norm(t):
    # bo dau trich dan markdown + gop khoang trang: cau tra loi trich lai co the
    # them "> " dau dong, do khong duoc tinh la "khong trich dung"
    t = re.sub(r'(?m)^\s*[>|"]\s?', ' ', t)
    return re.sub(r'\s+', ' ', t).strip()


def lcs_len(a, b):
    """Do dai doan chung dai nhat (ky tu) — quan he, khong phai tu khoa."""
    prev = [0] * (len(b) + 1)
    best = 0
    for i in range(1, len(a) + 1):
        cur = [0] * (len(b) + 1)
        ai = a[i - 1]
        for j in range(1, len(b) + 1):
            if ai == b[j - 1]:
                cur[j] = prev[j - 1] + 1
                if cur[j] > best:
                    best = cur[j]
        prev = cur
    return best


clause = {}
for h, rel in SKILL.items():
    t = (ROOT / rel).read_text()
    if OPEN not in t or CLOSE not in t:
        errs.append(f'[{h}] không rút được khối mệnh đề để đối chiếu')
        continue
    clause[h] = norm(t.split(OPEN, 1)[1].split(CLOSE, 1)[0])

if not errs:
    # Nguong = 1/4 do dai khoi, san 60 ky tu. Suy tu vat do, khong ghim tuy y.
    THRESH = {h: max(60, len(c) // 4) for h, c in clause.items()}
    prompt = EV / 'hanh-vi-prompt.md'
    if not prompt.exists():
        errs.append('thiếu bản ghi prompt trung tính — không chứng minh được 4 lượt cùng một câu hỏi')
    else:
        pt = prompt.read_text().lower()
        for leak in ('dừng', 'ba đường', 'khuôn giải sai', 'known limits'):
            # chi cam trong PHAN PROMPT (khoi ```), khong cam trong phan giai thich
            body = pt.split('```')[1] if '```' in pt else pt
            if leak in body:
                errs.append(f'prompt trung tính lại mớm chữ {leak!r} — lượt đo mất giá trị')

    seen = {}
    for tag, h, arm in ARMS:
        f = EV / f'hanh-vi-{tag}-{h}-{arm}.md'
        if not f.exists():
            errs.append(f'thiếu bản ghi lượt {tag}')
            continue
        ans = norm(f.read_text())
        n = lcs_len(ans, clause[h])
        seen[tag] = n
        if arm == 'co' and n < THRESH[h]:
            errs.append(f'[{tag}] nhánh CÓ mệnh đề nhưng câu trả lời chỉ trích được {n} ký tự '
                        f'(cần ≥ {THRESH[h]}) — không chứng minh được nó đọc mệnh đề')
        if arm == 'khong' and n >= THRESH[h]:
            errs.append(f'[{tag}] nhánh ĐÃ XOÁ mệnh đề mà câu trả lời vẫn trích được {n} ký tự '
                        f'(≥ {THRESH[h]}) — hai nhánh không phân biệt được, đối chứng vô nghĩa')

    # Quan he phai TACH BACH, khong chi la vuot/khong vuot nguong sat nhau
    if not errs and seen:
        lo_a = min(seen[t] for t, _, a in ARMS if a == 'co')
        hi_b = max(seen[t] for t, _, a in ARMS if a == 'khong')
        if lo_a <= hi_b * 2:
            errs.append(f'khoảng cách hai nhánh quá hẹp: CÓ thấp nhất {lo_a} vs ĐÃ XOÁ cao nhất {hi_b}')

if errs:
    print('\n'.join('  ' + x for x in errs)); sys.exit(1)
print('P170 OK (4 lượt, quan hệ trích-dẫn tách bạch giữa hai nhánh)')
P170PY

echo "P171 (AC-3,AC-5,AC-7) nhan ban do MOT bang: --check va /start cung chu, hai dang cay, --root sai chet to"
run "P171 MAP_LABELS quan he 3 ben + 2 dang cay + guard --root" \
  python3 - "$ROOT" <<'P171PY'
import json, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
errs = []

def run(cmd, cwd=None):
    return subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)

# Bang nhan trong lib la NGUON — doc no ra de doi chieu (quan he, khong hardcode
# chuoi trong test: test chep chuoi la them mot ban sao thu tu).
labels = json.loads(run(["node", "-e",
    "const l=require(process.argv[1]);console.log(JSON.stringify(l.MAP_LABELS))",
    str(root / "lib/workspace-record.cjs")]).stdout)
for k in ("dang-co", "da-xoa", "chua-bat"):
    if k not in labels: errs.append(f"MAP_LABELS thieu state {k}")

CFG_BAT = 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n'
CFG_TAT = 'schema_version: 1\n'

def dung_cay(td, cfg, co_git):
    ws = Path(td) / "ws"; (ws / "_acceptance" / "x").mkdir(parents=True)
    (ws / "_acceptance" / "config.yaml").write_text(cfg)
    (ws / "_acceptance" / "x" / "contract.md").write_text("---\nstatus: draft\n---\n")
    if co_git:
        run(["git", "init", "-q"], cwd=ws)
    return ws

# ── da-xoa: hai dang cay (co git KHONG lich su ~ checkout nong, va khong git)
# phai cho CUNG nhan tu tin hieu config (daBat) — AC-7 ────────────────────────
for co_git in (True, False):
    with tempfile.TemporaryDirectory() as td:
        ws = dung_cay(td, CFG_BAT, co_git)
        r = run(["node", str(root / "scripts/product-map.mjs"), "--root", str(ws), "--check"])
        if r.returncode != 1:
            errs.append(f"da-xoa (git={co_git}): --check exit {r.returncode}, phai 1")
        if labels["da-xoa"] not in (r.stderr + r.stdout):
            errs.append(f"da-xoa (git={co_git}): --check khong in nhan cua bang: {r.stderr.strip()[:80]}")
        scan = json.loads(run(["node", str(root / "scripts/start-scan.mjs"), "--root", str(ws)]).stdout)
        if scan["map"]["state"] != "da-xoa" or scan["map"]["label"] != labels["da-xoa"]:
            errs.append(f"da-xoa (git={co_git}): /start noi {scan['map']} — khac bang nhan")

# ── da-xoa KHONG config: cay du lich su, config KHONG khai, ban do TUNG commit
# roi bi xoa — hai ben van phai CUNG noi da-xoa qua tin hieu git cua mapTracked
# (S4-r1 vong nay: bo quet chi hoi config nen ca nay hai ben trai nhau) ───────
with tempfile.TemporaryDirectory() as td:
    ws = dung_cay(td, CFG_TAT, True)
    run(["git", "-c", "user.email=a@b", "-c", "user.name=t", "add", "-A"], cwd=ws)
    (ws / "PRODUCT-MAP.md").write_text("x")
    run(["git", "add", "PRODUCT-MAP.md"], cwd=ws)
    run(["git", "-c", "user.email=a@b", "-c", "user.name=t", "commit", "-qm", "x"], cwd=ws)
    (ws / "PRODUCT-MAP.md").unlink()
    r = run(["node", str(root / "scripts/product-map.mjs"), "--root", str(ws), "--check"])
    if r.returncode != 1 or labels["da-xoa"] not in (r.stderr + r.stdout):
        errs.append(f"da-xoa-khong-config: --check exit {r.returncode}: {r.stderr.strip()[:80]}")
    scan = json.loads(run(["node", str(root / "scripts/start-scan.mjs"), "--root", str(ws)]).stdout)
    if scan["map"]["state"] != "da-xoa" or scan["map"]["label"] != labels["da-xoa"]:
        errs.append(f"da-xoa-khong-config: /start noi {scan['map']} — hai ben trai nhau dung ca S4-r1")

# ── chua-bat: config khong khai → --check exit 0 nhung KHONG im lang, va /start
# cung chu (AC-3) ─────────────────────────────────────────────────────────────
with tempfile.TemporaryDirectory() as td:
    ws = dung_cay(td, CFG_TAT, False)
    r = run(["node", str(root / "scripts/product-map.mjs"), "--root", str(ws), "--check"])
    if r.returncode != 0:
        errs.append(f"chua-bat: --check exit {r.returncode}, phai 0 (duong doc-cu hop le)")
    if labels["chua-bat"] not in (r.stdout + r.stderr):
        errs.append(f"chua-bat: --check khong in nhan cua bang: {r.stdout.strip()[:80]}")
    scan = json.loads(run(["node", str(root / "scripts/start-scan.mjs"), "--root", str(ws)]).stdout)
    if scan["map"]["state"] != "chua-bat" or scan["map"]["label"] != labels["chua-bat"]:
        errs.append(f"chua-bat: /start noi {scan['map']} — khac bang nhan")

# ── dang-co: doi chung duong ─────────────────────────────────────────────────
with tempfile.TemporaryDirectory() as td:
    ws = dung_cay(td, CFG_BAT, False)
    r = run(["node", str(root / "scripts/product-map.mjs"), "--root", str(ws)])
    if r.returncode != 0: errs.append(f"khong ve duoc ban do doi chung: {r.stderr[:80]}")
    scan = json.loads(run(["node", str(root / "scripts/start-scan.mjs"), "--root", str(ws)]).stdout)
    if scan["map"]["state"] != "dang-co":
        errs.append(f"dang-co: /start noi {scan['map']['state']}")
    r2 = run(["node", str(root / "scripts/product-map.mjs"), "--root", str(ws), "--check"])
    if r2.returncode != 0: errs.append(f"dang-co: --check do oan: {r2.stdout[:80]}{r2.stderr[:80]}")

# ── AC-5: --root sai phai CHET TO exit 2, moi loi mot thong diep rieng ───────
r = run(["node", str(root / "scripts/product-map.mjs"), "--root", "/khong/ton/tai/dau", "--check"])
if r.returncode != 2 or "không tồn tại" not in r.stderr:
    errs.append(f"--root sai: exit {r.returncode}, stderr {r.stderr.strip()[:80]} — phai exit 2 + neu duong dan")
with tempfile.TemporaryDirectory() as td:
    f = Path(td) / "file.txt"; f.write_text("x")
    r = run(["node", str(root / "scripts/product-map.mjs"), "--root", str(f), "--check"])
    if r.returncode != 2 or "không phải thư mục" not in r.stderr:
        errs.append(f"--root tro file: exit {r.returncode} — phai exit 2 + noi khong phai thu muc")

if errs:
    print("\n".join("  " + e for e in errs)); sys.exit(1)
print("P171 OK (3 state cung bang nhan, 2 dang cay + ca da-xoa-khong-config qua tin hieu git, --root sai chet to 2 kieu)")
P171PY

echo "P172 (AC-4) khuon UAT round-trip: thi hanh thu tuc chep trong khoi moc -> ho so LANH; chep sai -> HONG"
run "P172 UAT-COPY-PROCEDURE rut-tu-khuon, chep dung lanh / chep ca rao hong" \
  python3 - "$ROOT" <<'P172PY'
import json, re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
errs = []
tpl = (root / "skills/acceptance/references/uat-session-template.md").read_text()

# CHECKER duy nhat — dung cho ban that VA cho mutant (E19). Tra list loi.
# Truoc day E19 (P173) tu chep danh sach buoc roi tu cham: hai ve cung mot
# nguon nen khong bao gio do — hinh dang "ben viet va ben doc troi nhau vi
# test tu dung ban sao dung khuon" (S4-r1 vong nay bat lai). Nay mutant phai
# di qua CHINH ham nay.
BUOC = ("ĐỪNG chép", "BẮT ĐẦU ngay ở dòng `---`", "Xoá các dòng hướng dẫn")
def kiem_khuon(tpl_txt):
    out = []
    for mk, want in (("UAT-COPY-PROCEDURE", 1), ("UAT-FRONTMATTER-TEMPLATE", 1)):
        n_open, n_close = tpl_txt.count(f"<<<{mk}"), tpl_txt.count(f"{mk}>>>")
        if (n_open, n_close) != (want, want):
            out.append(f"moc {mk}: mo {n_open} / dong {n_close} (phai {want})")
    if out:
        return out
    proc = tpl_txt.split("<<<UAT-COPY-PROCEDURE -->", 1)[1].split("<!-- UAT-COPY-PROCEDURE>>>", 1)[0]
    for phrase in BUOC:
        if phrase not in proc:
            out.append(f"thu tuc chep thieu buoc: {phrase!r}")
    return out

errs.extend(kiem_khuon(tpl))

if not errs:
    # THI HANH thu tuc (round-trip rut-tu-writer-doc-bang-reader):
    khuon = tpl.split("<<<UAT-FRONTMATTER-TEMPLATE -->", 1)[1].split("<!-- UAT-FRONTMATTER-TEMPLATE>>>", 1)[0]
    yaml_body = khuon.split("```yaml", 1)[1].split("```", 1)[0].strip("\n")
    dien = {"{slug}": "x", "{feature}": "thu", "{owner}": "a@b.c", "{stage}": "held",
            "{verdict}": "release", "{decided_by}": "a", "{decided_at}": "2026-08-07T00:00:00Z",
            "{gateUAT_minutes}": "5"}
    filled = yaml_body
    for k, v in dien.items(): filled = filled.replace(k, v)
    filled = re.sub(r"[ \t]*#[^\n]*", "", filled)  # buoc 3: xoa ghi chu
    dung = filled if filled.endswith("\n") else filled + "\n"
    sai = "```yaml\n" + dung + "```\n"          # chep CA hang rao — dieu thu tuc cam

    def reader_noi_gi(txt):
        out = subprocess.run(["node", "-e",
            "const l=require(process.argv[1]);"
            "const p=l.recordProblem({'contract.md':'---\\nstatus: signed-off\\n---\\n','opportunity.md':null,'uat-session.md':process.argv[2],'evidence-report.md':null});"
            "console.log(JSON.stringify(p))",
            str(root / "lib/workspace-record.cjs"), txt], capture_output=True, text=True)
        return json.loads(out.stdout)

    p_dung = reader_noi_gi(dung)
    if p_dung is not None:
        errs.append(f"chep DUNG thu tuc ma reader van goi hong: {p_dung}")
    if not dung.startswith("---"):
        errs.append("ban chep dung khong bat dau bang --- (thu tuc noi doi)")
    p_sai = reader_noi_gi(sai)
    if p_sai is None:
        errs.append("chep CA hang rao ma reader van goi lanh — thu tuc cam mot dieu vo hai, khong co gi de do")

# ── E19: mutant thu-tuc-chep di qua CHINH checker tren — xoa mot buoc trong
# ban sao khuon thi kiem_khuon phai DO va neu dung buoc do ────────────────────
if not errs:
    # Tiem TRONG khoi moc — vai cum cung xuat hien o van xuoi ngoai khoi
    # (blockquote dau file), replace tren toan tpl se tiem nham cho va mutant
    # thanh vo hieu (chinh checker nay vua bat duoc ca do khi con tiem toan-tpl)
    dau, giua_duoi = tpl.split("<<<UAT-COPY-PROCEDURE -->", 1)
    giua, duoi = giua_duoi.split("<!-- UAT-COPY-PROCEDURE>>>", 1)
    for buoc in BUOC:
        giua_mut = giua.replace(buoc, "buoc-da-go", 1)
        if giua_mut == giua:
            errs.append(f"E19: khong tiem duoc mutant cho buoc {buoc!r}")
            continue
        mut = dau + "<<<UAT-COPY-PROCEDURE -->" + giua_mut + "<!-- UAT-COPY-PROCEDURE>>>" + duoi
        loi = kiem_khuon(mut)
        if not loi:
            errs.append(f"E19: xoa buoc {buoc!r} ma checker van XANH — phep do khong doc buoc nay")
        elif not any(buoc in l for l in loi):
            errs.append(f"E19: xoa buoc {buoc!r} nhung checker keu buoc khac: {loi}")
    # mutant xoa tron khoi thu tuc → checker phai keu thieu moc
    mut = tpl.replace("<!-- <<<UAT-COPY-PROCEDURE -->", "").replace("<!-- UAT-COPY-PROCEDURE>>> -->", "")
    if not any("UAT-COPY-PROCEDURE" in l for l in kiem_khuon(mut)):
        errs.append("E19: xoa tron cap moc thu tuc ma checker van xanh")

if errs:
    print("\n".join("  " + e for e in errs)); sys.exit(1)
print("P172 OK (thu tuc trong khoi moc, thi hanh that; E19: 3 mutant buoc + 1 mutant moc, cung MOT checker)")
P172PY

echo "P173 (AC-1,AC-4,AC-6,AC-8) not luoi reader-unification: mutant mot-cho, tu vung 4 cong, bien Codex, since rong, mutant thu-tuc-chep"
run "P173 5 ca not: E3/E13/E14/E15/E19" \
  python3 - "$ROOT" <<'P173PY'
import json, re, shutil, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
errs = []
run = lambda cmd, **kw: subprocess.run(cmd, capture_output=True, text=True, **kw)

# ── E3: dot bien MOT-CHO — pha luat evidence trong BAN SAO lib, CA HAI reader
# phai doi ket luan; ben nao khong doi la ben do giu ban sao luat rieng ───────
with tempfile.TemporaryDirectory() as td:
    t = Path(td)
    for d in ("lib", "scripts"):
        shutil.copytree(root / d, t / d)
    ws = t / "ws"; (ws / "_acceptance" / "x").mkdir(parents=True)
    (ws / "_acceptance" / "config.yaml").write_text("schema_version: 1\n")
    (ws / "_acceptance" / "x" / "contract.md").write_text("---\nstatus: verified\n---\n")
    (ws / "_acceptance" / "x" / "evidence-report.md").write_text("---\nverdict: PASS\n---\n")

    def hoi_hai_ben(base):
        scan = json.loads(run(["node", str(base / "scripts/start-scan.mjs"), "--root", str(ws)]).stdout)
        s_hong = any(b["slug"] == "x" for b in scan["broken"])
        # argv[1] la tham so DEM: guard chay-nhu-CLI cua product-map so
        # import.meta.url voi argv[1] — truyen thang duong dan module vao do
        # la main tu chay va nuot argv cua minh (da dam trong chinh ca nay)
        mp = run(["node", "--input-type=module", "-e",
            "const {renderProductMap} = await import(process.argv[2]);"
            "process.stdout.write(renderProductMap(process.argv[3]))",
            "khong-phai-module", str(base / "scripts/product-map.mjs"), str(ws)])
        if mp.returncode != 0:
            errs.append(f"E3: renderProductMap sap: {mp.stderr.strip()[:120]}")
        m_hong = "`x`" in (mp.stdout.split("## Hồ sơ hỏng")[1] if "## Hồ sơ hỏng" in mp.stdout else "")
        return s_hong, m_hong

    # Doi chung duong: ban nguyen ven, ho so lanh → ca hai ben LANH
    s0, m0 = hoi_hai_ben(t)
    if s0 or m0:
        errs.append(f"E3 doi chung duong: cay lanh ma quet={s0} bando={m0}")
    else:
        lib = t / "lib" / "workspace-record.cjs"; src = lib.read_text()
        # Mutant THU HEP enum (bo 'blocked'): fixture verdict BLOCKED dang lanh
        # o ca hai ben, luat hep lai thi CA HAI phai doi sang hong — ben nao
        # khong doi la ben do giu ban sao luat rieng. (Khong dung mutant NOI
        # enum: gia tri moi hop lib nhung chua co nghia trong bang y nghia cua
        # bo quet, cho do co guard bang-lech rieng — do o duoi.)
        mut = src.replace("enum: ['pass', 'pending-judgment', 'reject', 'blocked']",
                          "enum: ['pass', 'pending-judgment', 'reject']")
        if mut == src: errs.append("E3: khong tiem duoc mutant enum")
        (ws / "_acceptance" / "x" / "evidence-report.md").write_text("---\nverdict: BLOCKED\n---\n")
        s1, m1 = hoi_hai_ben(t)   # lib nguyen ven: BLOCKED hop enum → ca hai LANH
        if s1 or m1:
            errs.append(f"E3 doi chung duong: BLOCKED hop luat ma quet={s1} bando={m1}")
        lib.write_text(mut)
        s2, m2 = hoi_hai_ben(t)   # lib thu hep: ca hai phai DOI ket luan → HONG
        if not (s2 and m2):
            ben = "bo quet" if not s2 else "ban do"
            errs.append(f"E3: thu hep luat trong lib ma {ben} KHONG doi ket luan — ben do giu ban sao luat rieng")
        lib.write_text(src)
        # Quan he HAI BANG cua bo quet: moi gia tri hop enum cua lib phai co
        # nghia trong bang VERDICT_MEANING — nới enum mà quên thêm nghĩa thì
        # hồ sơ bị gọi tên "hai bảng lệch", KHÔNG sập giữa chừng.
        lib.write_text(src.replace("enum: ['pass', 'pending-judgment', 'reject', 'blocked']",
                                   "enum: ['pass', 'pending-judgment', 'reject', 'blocked', 'ok-nhe']"))
        (ws / "_acceptance" / "x" / "evidence-report.md").write_text("---\nverdict: ok-nhe\n---\n")
        r3 = run(["node", str(t / "scripts/start-scan.mjs"), "--root", str(ws)])
        if r3.returncode != 0:
            errs.append(f"E3 bang-lech: bo quet SAP thay vi goi ten ({r3.stderr.strip()[:80]})")
        else:
            b3 = next((b for b in json.loads(r3.stdout)["broken"] if b["slug"] == "x"), None)
            if not b3 or "hai bảng lệch" not in b3.get("reason", ""):
                errs.append(f"E3 bang-lech: khong goi dich danh (thay: {b3})")

# ── E13: tu vung — do QUAN HE trong CONTEXT.md, khong chi chuoi co mat ───────
ctx = (root / "CONTEXT.md").read_text()
bang = re.search(r"\| \*\*Cổng Đáng\*\*.*?\| \*\*Cổng Giá trị\*\*[^\n]*\n", ctx, re.S)
if not bang:
    errs.append("E13: bang bon cong khong con du bon hang lien tuc")
else:
    for cong, file_ghi in (("Cổng Đáng", "opportunity.md"), ("Cổng Phạm vi", "contract.md"),
                            ("Cổng Bằng chứng", "evidence-report.md"), ("Cổng Giá trị", "uat-session.md")):
        hang = next((l for l in bang.group(0).splitlines() if cong in l), None)
        if not hang or file_ghi not in hang:
            errs.append(f"E13: hang {cong} khong tro dung file {file_ghi}")
muc_gate = ctx.split("**Gate**:", 1)[1].split("**", 1)[0] if "**Gate**:" in ctx else ""
if "Cổng Giá trị" not in muc_gate:
    errs.append("E13: muc Gate chua liet Cong Gia tri")
muc_verdict = ctx.split("**Verdict**:", 1)[1].split("### ", 1)[0] if "**Verdict**:" in ctx else ""
if not ("release/iterate/kill" in muc_verdict and "uat-session.md" in muc_verdict):
    errs.append("E13: canh bao verdict hai nghia phai neu ca enum uat va ten file")
for art in ("**UAT session**:", "**Product map"):
    if art not in ctx: errs.append(f"E13: Artifacts thieu muc {art}")

# ── E15: since rong — cho-Cong-Gia-tri thieu decided_at thi de trong, khong
# bia moc tu mtime ───────────────────────────────────────────────────────────
with tempfile.TemporaryDirectory() as td:
    ws = Path(td) / "ws"; (ws / "_acceptance" / "x").mkdir(parents=True)
    (ws / "_acceptance" / "config.yaml").write_text("schema_version: 1\n")
    (ws / "_acceptance" / "x" / "contract.md").write_text("---\nstatus: signed-off\n---\n")
    (ws / "_acceptance" / "x" / "opportunity.md").write_text("---\nstage: decided\ndecision: build\n---\n")
    (ws / "_acceptance" / "x" / "uat-session.md").write_text("---\nstage: held\nverdict:\n---\n")
    scan = json.loads(run(["node", str(root / "scripts/start-scan.mjs"), "--root", str(ws)]).stdout)
    g = next((g for g in scan["groups"]["gates"] if g["slug"] == "x"), None)
    if not g or g["gate"] != "gia-tri":
        errs.append(f"E15: fixture khong roi vao o cho-Cong-Gia-tri: {g}")
    elif g["since"] != "":
        errs.append(f"E15: thieu decided_at ma since={g['since']!r} — van bia moc")
    # Doi chung duong: co decided_at thi since phai DUNG moc do
    (ws / "_acceptance" / "x" / "uat-session.md").write_text(
        "---\nstage: held\nverdict:\ndecided_at: 2026-01-02T03:04:05Z\n---\n")
    scan2 = json.loads(run(["node", str(root / "scripts/start-scan.mjs"), "--root", str(ws)]).stdout)
    g2 = next((g for g in scan2["groups"]["gates"] if g["slug"] == "x"), None)
    if not g2 or g2["since"] != "2026-01-02T03:04:05Z":
        errs.append(f"E15 doi chung duong: co decided_at ma since={g2 and g2['since']!r}")

# E19 da chuyen vao P172: mutant phai di qua CHINH checker cua phep do khuon,
# khong duoc cham bang ban chep danh sach buoc cua rieng minh (hang-dung,
# S4-r1 vong nay). Xem khoi P172.

if errs:
    print("\n".join("  " + e for e in errs)); sys.exit(1)
print("P173 OK (E3 mutant mot-cho 2 ben + bang-lech, E13 tu vung quan he, E14 bien Codex, E15 since rong + doi chung)")
P173PY

# ═══ measure-birth-certificate (P174–P182) ══════════════════════════════════
# Khuôn khai sinh phép đo: mỗi case dưới đây TỰ tuân khuôn nó đo — in
# "P<N> DUONG-OK" khi đối chứng dương xanh và "P<N> MUTANT-OK" khi mọi mutant
# đỏ ghim thông điệp. P182 kiểm quan hệ tập-hợp trên chính các marker đó.
# <<<MBC-CASE-IDS
# P174 P175 P176 P177 P179 P180 P181 P182
# MBC-CASE-IDS>>>

run "P174 [MBC] E1 menh de MEASURE-BIRTH-CLAUSE trong SKILL Claude: 3 thanh phan + 3 loai vat + neo" \
  python3 - "$ROOT" <<'P174PY'
import re, sys, pathlib
root = pathlib.Path(sys.argv[1])
t = (root/'feature-loop/skills/feature-loop/SKILL.md').read_text()
OPEN='<!-- <<<MEASURE-BIRTH-CLAUSE -->'; CLOSE='<!-- MEASURE-BIRTH-CLAUSE>>> -->'
def measure(text):
    i, j = text.find(OPEN), text.find(CLOSE)
    if i < 0 or j < 0: return ['KHONG tim thay khoi giua moc MEASURE-BIRTH-CLAUSE']
    b = text[i:j]
    errs = []
    for name, pat in [('cap hai-chieu cung fixture', r'cặp case hai-chiều.*CÙNG một\s+fixture'),
                      ('thong diep ghim', r'THÔNG ĐIỆP GHIM'),
                      ('thieu cap = chua xong', r'Thiếu cặp = task CHƯA XONG'),
                      ('3 loai vat', r'case suite, eval[\s\S]*rule/check'),
                      ('neo MBC-CORE', r'MBC-CORE: pair-same-fixture')]:
        if not re.search(pat, b, re.S): errs.append('khoi thieu thanh phan: ' + name)
    return errs
errs = measure(t)
assert not errs, 'ban that do oan: ' + '; '.join(errs)
print('P174 DUONG-OK')
m1 = t[:t.find(OPEN)] + t[t.find(CLOSE)+len(CLOSE):]
e1 = measure(m1)
assert e1 and 'MEASURE-BIRTH-CLAUSE' in e1[0], 'mutant xoa khoi khong do ghim ten moc: ' + repr(e1)
body = t[t.find(OPEN)+len(OPEN):t.find(CLOSE)]
m2 = t[:t.find(OPEN)] + OPEN + '\n   (khoi rong)\n   ' + CLOSE + body + t[t.find(CLOSE)+len(CLOSE):]
e2 = measure(m2)
assert e2 and any('thanh phan' in x for x in e2), 'mutant tach-khoi-moc khong do: ' + repr(e2)
print('P174 MUTANT-OK (xoa khoi + tach khoi moc deu do ghim thong diep)')
P174PY

run "P175 [MBC] E2 khoi giua moc: neo TRONG khoi khop khuon chuan" \
  python3 - "$ROOT" <<'P175PY'
import re, sys, pathlib
root = pathlib.Path(sys.argv[1])
OPEN = '<!-- <<<MEASURE-BIRTH-CLAUSE -->'; CLOSE = '<!-- MEASURE-BIRTH-CLAUSE>>> -->'
CANON = re.compile(r'<!-- MBC-CORE: pair-same-fixture \+ pinned-message \+ not-done-without-pair; objects: suite-case, eval, rule-script -->')
SIDES = {'claude': 'feature-loop/skills/feature-loop/SKILL.md'}
def measure(texts):
    errs, anchors, blocks = [], {}, {}
    for side, text in texts.items():
        i, j = text.find(OPEN), text.find(CLOSE)
        if i < 0 or j < 0: errs.append(f'ben {side}: khong co khoi giua moc MEASURE-BIRTH-CLAUSE'); continue
        b = text[i:j]; blocks[side] = b
        m = re.search(r'<!-- MBC-CORE:.*?-->', b)
        if not m: errs.append(f'ben {side}: dong neo MBC-CORE khong nam TRONG khoi giua moc'); continue
        anchors[side] = m.group(0)
        if not CANON.fullmatch(m.group(0)): errs.append(f'ben {side}: neo MBC-CORE lech khoi khuon chuan')
    return errs
texts = {s: (root/p).read_text() for s, p in SIDES.items()}
errs = measure(texts)
assert not errs, 'ban that do oan: ' + '; '.join(errs)
print('P175 DUONG-OK')
mut1 = dict(texts)
mut1['claude'] = mut1['claude'].replace(OPEN, '<!-- (moc mo da xoa) -->', 1)
e1 = measure(mut1)
assert e1 and any('khong co khoi giua moc' in x for x in e1), \
    'mutant xoa moc mo ben claude khong do dung thong diep: ' + repr(e1)
mut3 = dict(texts)
i, j = mut3['claude'].find(OPEN), mut3['claude'].find(CLOSE)
anchor_line = re.search(r'[ \t]*<!-- MBC-CORE:.*?-->\n', mut3['claude'][i:j]).group(0)
mut3['claude'] = mut3['claude'][:i] + mut3['claude'][i:j].replace(anchor_line, '') + mut3['claude'][j:] + '\n' + anchor_line
e3 = measure(mut3)
assert e3 and any('khong nam TRONG khoi' in x for x in e3), 'mutant doi neo ra ngoai khoi khong do: ' + repr(e3)
print('P175 MUTANT-OK (xoa moc mo bi bat; neo ngoai khoi bi bat)')
P175PY

run "P176 [MBC] E3 con tro S1 ve khuon trong ban chi dan" \
  python3 - "$ROOT" <<'P176PY'
import sys, pathlib
root = pathlib.Path(sys.argv[1])
PTR = {'claude': ('feature-loop/skills/feature-loop/SKILL.md', 'Kế hoạch đo theo khuôn `MEASURE-BIRTH-CLAUSE`')}
def measure(texts):
    return [f'ben {s}: doan viet evals.yaml THIEU con tro toi MEASURE-BIRTH-CLAUSE'
            for s, (p, needle) in PTR.items() if needle not in texts[s]]
texts = {s: (root/p).read_text() for s, (p, _) in PTR.items()}
errs = measure(texts)
assert not errs, 'ban that do oan: ' + '; '.join(errs)
print('P176 DUONG-OK')
for side in PTR:
    mut = dict(texts); mut[side] = mut[side].replace(PTR[side][1], '')
    e = measure(mut)
    assert e and any(side in x for x in e), f'mutant xoa con tro ben {side} khong do neu ten ben: ' + repr(e)
print('P176 MUTANT-OK (xoa con tro tung ben -> do neu dung ben thieu)')
P176PY

run "P177 [MBC] E4 references measure-birth.md: resolver goc-trong-cay-kiem + 4 muc + 2 mau + banh coc bang<->so" \
  python3 - "$ROOT" <<'P177PY'
import re, subprocess, sys, tempfile, pathlib
root = pathlib.Path(sys.argv[1])
REL = 'skills/acceptance/references/measure-birth.md'
r = subprocess.run(['node', str(root/'feature-loop/scripts/resolve-plugin.mjs'),
                    '--plugin', 'acceptance-gate', '--root', str(root), '--require', REL],
                   capture_output=True, text=True)
assert r.returncode == 0, 'resolver fail tren cay that: ' + r.stderr[:200]
got = pathlib.Path(r.stdout.strip()).resolve()
assert str(got).startswith(str(root.resolve())), f'goc resolver NGOAI cay kiem: {got}'
SO_CHU = {3: ('BA', 'Ba'), 4: ('BỐN', 'Bốn'), 5: ('NĂM', 'Năm')}
# Neo NOI DUNG cua muc 4 — ghim ten muc mot minh la do cai NHAN, khong do cai
# LUAT. So khong phan biet hoa/thuong: van ban viet hoa de nhan manh.
NEO_MUC4 = ['lật sang liệt cái ĐƯỢC PHÉP', 'miễn trừ khai TRƯỚC', 'lệnh tái lập']
def measure(text):
    errs = []
    m = re.search(r'<!-- <<<MEASURE-BIRTH-SECTIONS -->([\s\S]*?)<!-- MEASURE-BIRTH-SECTIONS>>> -->', text)
    if not m: return ['references: KHONG co cap moc MEASURE-BIRTH-SECTIONS']
    body = m.group(1)
    for name in ['Đối-chứng-dương', 'Phá-vật-thật', 'Thông-điệp-ghim', 'Phủ-định-phổ-quát']:
        if ('### ' not in body) or (name not in body): errs.append('references thieu muc: ' + name)
    # Muc 4 phai mang du ba neo NOI DUNG, moi neo mot thong diep RIENG — de
    # "go mot neo" va "xoa ca muc" khong ra cung mot mau.
    if 'Phủ-định-phổ-quát' in body:
        m4 = body.split('### 4.', 1)[1]
        for neo in NEO_MUC4:
            if neo.casefold() not in m4.casefold():
                errs.append('references thieu neo noi dung muc 4: ' + neo)
    # BUOC SO: so muc trong khoi moc phai khop chu so viet o van dan va tieu de
    # `##` ngay tren khoi. Thieu chan nay thi them muc thu tu ma quen sua "du BA
    # muc" la giao ra ban chi dan tu mau thuan — dung lop doc-drift ma chinh
    # trang nay day.
    n = len(re.findall(r'^### \d+\.', body, re.M))
    hoa, thuong = SO_CHU.get(n, (None, None))
    dan = text.split('<!-- <<<MEASURE-BIRTH-SECTIONS', 1)[0]
    if hoa is None:
        errs.append(f'so muc trong khoi la {n} — ngoai bang chu so da khai')
    else:
        if f'đủ {hoa} mục' not in dan:
            errs.append(f'so muc trong khoi la {n} ma van dan khong ghi "đủ {hoa} mục"')
        if f'## {thuong} mục bắt buộc' not in dan:
            errs.append(f'so muc trong khoi la {n} ma tieu de khong ghi "## {thuong} mục bắt buộc"')
    for sample in ['L35', 'PM13']:
        if sample not in text: errs.append('references thieu mau song: ' + sample)
    if 'known-limits-ledger.tsv' not in text or '| Lớp |' not in text:
        errs.append('references thieu bang lop tu ledger')
    return errs
text = (got/REL).read_text()
errs = measure(text)
assert not errs, 'ban that do oan: ' + '; '.join(errs)
print('P177 DUONG-OK')
print('P177 4MUC-OK (4 muc + 3 neo noi dung muc 4 + buoc so van-dan<->khoi-moc)')
m1 = text.replace('### 2. Phá-vật-thật', '### 2. (da xoa)')
e1 = measure(m1)
assert e1 and any('Phá-vật-thật' in x for x in e1), 'mutant xoa muc khong do ghim ten muc: ' + repr(e1)
# --- AC-3: ba chieu do cua muc 4, BA THONG DIEP KHAC NHAU ---
m4a = text.replace('### 4. Phủ-định-phổ-quát', '### 4. (da xoa)')
e4a = measure(m4a)
assert e4a and any('thieu muc: Phủ-định-phổ-quát' in x for x in e4a), \
    'mutant xoa muc 4 khong do ghim ten muc: ' + repr(e4a)
m4b = text.replace('lật sang liệt cái ĐƯỢC PHÉP', 'lat sang liet cai (da go)')
assert m4b != text, 'mutant go neo noi dung khong tiem duoc — neo doi ten?'
e4b = measure(m4b)
assert e4b and any('thieu neo noi dung muc 4' in x for x in e4b), \
    'mutant go neo noi dung khong do ghim ten neo: ' + repr(e4b)
assert not any('thieu muc: Phủ-định-phổ-quát' in x for x in e4b), \
    'go neo va xoa muc ra CUNG mot thong diep — chan khong phan biet duoc hai nguyen nhan'
m4c = text.replace('đủ BỐN mục', 'đủ BA mục')
assert m4c != text, 'mutant lech so khong tiem duoc — van dan doi cau chu?'
e4c = measure(m4c)
assert e4c and any('van dan khong ghi' in x for x in e4c), \
    'mutant lech so van dan khong do: ' + repr(e4c)
with tempfile.TemporaryDirectory() as d:
    r2 = subprocess.run(['node', str(root/'feature-loop/scripts/resolve-plugin.mjs'),
                         '--plugin', 'acceptance-gate', '--root', d, '--require', REL],
                        capture_output=True, text=True)
    # Ghim THONG DIEP, khong chi ma thoat (S4-r1 hinh dang 4): exit != 0 mot
    # minh khong phan biet duoc "tu choi tra goc vi thieu file" voi "chet vi
    # cai co / crash khac" — dung lop exit-code-noi-doi ma khuon nay cam.
    msg = r2.stderr + r2.stdout
    assert r2.returncode != 0 and 'does not carry' in msg and 'measure-birth.md' in msg, \
        f'resolver tren cay thieu file phai fail GHIM dung thong diep does-not-carry (exit={r2.returncode}, msg={msg[:150]})'
print('P177 MUTANT-OK (xoa muc do ghim ten muc; cay thieu file -> resolver fail ghim does-not-carry)')

# ── AC-2: banh coc HAI CHIEU bang lop loi <-> cot `class` cua so nguon ──────
# Bang tu tuyen «Nguon: known-limits-ledger.tsv (cot class)» ma truoc hom nay
# KHONG phep do nao giu loi tuyen ay — dung lop doc-drift ma chinh bang ay day.
# Hai lop trung tam cua ba vong cham ho so cat-hinh-thuc da nam san tren bang
# va van bi dam: bang khong rang thi no la trang tri.
LEDGER177 = root/'docs/research/known-limits-ledger.tsv'   # goc REPO, khong phai goc plugin
def lop_song(ledger_text):
    out = set()
    for line in ledger_text.strip().split('\n')[1:]:
        c = line.split('\t')
        if len(c) >= 5 and c[4] == 'song' and c[3].strip():   # enum that: song|chet|trung
            out.add(c[3].strip())
    return out
def rut_bang(text):
    """Ben DOC cua seam: khuon o lop khai o mot cho — token dau o, cat truoc
    dau cach hoac dau ngoac. Doi format bang ma quen sua day -> rut 0 hang ->
    fail-loud, khong xanh-rong."""
    m = re.search(r'<!-- <<<MEASURE-BIRTH-CLASS-TABLE -->([\s\S]*?)<!-- MEASURE-BIRTH-CLASS-TABLE>>> -->', text)
    if not m: return None, None
    blk = m.group(1)
    bang = []
    for line in blk.split('\n'):
        line = line.strip()
        if not line.startswith('|') or set(line) <= set('|-: '): continue
        o = line.strip('|').split('|')[0].strip()
        if o in ('Lớp',) or not o: continue
        bang.append(re.split(r'[\s(]', o, 1)[0])
    mien = re.findall(r'^- `([a-z0-9-]+)` — ', blk, re.M)
    return bang, mien
def bang_vs_so(text, song):
    bang, mien = rut_bang(text)
    # FAIL-LOUD: tap-so-rong la hang dung — chinh lop ho so nay vua dat ten.
    if bang is None: return ['LOP-BANG: phep rut hong — khong co cap moc MEASURE-BIRTH-CLASS-TABLE']
    if not bang or not song: return ['LOP-BANG: phep rut hong — rut duoc 0 hang bang hoac 0 lop so']
    errs = []
    for lop in sorted(song - set(bang) - set(mien)):
        errs.append(f'LOP-BANG: so co {lop} ma bang thieu')
    for lop in sorted(set(bang) - song):
        errs.append(f'LOP-BANG: bang co {lop} ma so khong')
    for lop in sorted(set(mien) - song):     # banh coc chieu (b) cua ban khai
        errs.append(f'LOP-BANG: mien tru {lop} khong con dong song')
    return errs
ltext = LEDGER177.read_text()
song177 = lop_song(ltext)
assert len(song177) > 1, f'bo rut lop SONG tra {len(song177)} — bo rut hong, khong phai so rong'
bang177, mien177 = rut_bang(text)
assert bang177, 'bo rut BANG tra rong tren ban that — seam viet<->doc da troi'
e177 = bang_vs_so(text, song177)
assert not e177, 'ban that do oan: ' + '; '.join(e177)
print(f'LOP-BANG: {len(bang177)}/{len(song177 - set(mien177))} khop hai chieu ({len(mien177)} mien tru)')
# Bon chieu do CHAY THAT, tat ca di qua CHINH `bang_vs_so`.
bo_hang = re.sub(r'^\| do-thuoc .*\n', '', text, count=1, flags=re.M)
assert bo_hang != text, 'mutant xoa hang khong tiem duoc — o lop doi khuon?'
ea = bang_vs_so(bo_hang, song177)
assert any('so co do-thuoc ma bang thieu' in x for x in ea), 'mutant xoa hang khong do chieu (a): ' + repr(ea)
them = text.replace('| do-thuoc ', '| lop-bia-dat (khong co trong so) | x | y |\n| do-thuoc ', 1)
eb = bang_vs_so(them, song177)
assert any('bang co lop-bia-dat ma so khong' in x for x in eb), 'mutant them hang bia khong do chieu (b): ' + repr(eb)
doi_mien = text.replace('- `khac` — ', '- `mien-tru-chet` — ', 1)
assert doi_mien != text, 'mutant doi ban khai mien tru khong tiem duoc'
ec = bang_vs_so(doi_mien, song177)
assert any('mien tru mien-tru-chet khong con dong song' in x for x in ec), \
    'mutant mien tru chet khong do chieu (c) — ban khai la cua sau: ' + repr(ec)
assert any('so co khac ma bang thieu' in x for x in ec), 'go mien tru cho `khac` ma chieu (a) khong bat: ' + repr(ec)
ed = bang_vs_so(text.replace('<!-- <<<MEASURE-BIRTH-CLASS-TABLE -->', '<!-- (moc da xoa) -->', 1), song177)
assert any('phep rut hong' in x for x in ed), 'mutant xoa moc khong fail-loud: ' + repr(ed)
print('P177 LOP-BANG-MUTANT-OK (xoa hang / them hang bia / mien tru chet / xoa moc — bon thong diep rieng)')
P177PY


run "P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=" \
  python3 - "$ROOT" <<'P179PY'
import re, sys, pathlib
root = pathlib.Path(sys.argv[1])
LEDGER = root/'docs/research/known-limits-ledger.tsv'
def count_corpus(acc_dir):
    n = 0
    for f in sorted(acc_dir.glob('*/review-findings.md')):
        n += len(re.findall(r'Đề xuất:\s*known-limits', f.read_text()))
    return n
def measure(ledger_text, corpus_count):
    rows = [l.split('\t') for l in ledger_text.strip().split('\n')[1:]]
    errs = []
    if len(rows) < corpus_count:
        errs.append(f'quan he >= vo: ledger {len(rows)} dong < corpus {corpus_count} muc')
    ids = {r[0] for r in rows}
    for r in rows:
        rid, status, closed_by, dup_of = r[0], r[4], r[5], r[6]
        if status not in ('song', 'chet', 'trung'): errs.append(f'{rid}: status la "{status}" ngoai enum')
        if status == 'chet' and not closed_by.strip(): errs.append(f'{rid}: chet thieu closed_by')
        if status == 'trung':
            if not dup_of.strip(): errs.append(f'{rid}: trung thieu dup_of')
            elif dup_of not in ids: errs.append(f'{rid}: dup_of tro id ma "{dup_of}"')
    return errs
# DOI CHUNG DUONG CHO BO DEM: ho so da biet co muc phai dem > 0
known = count_corpus(root/'_acceptance')
one = len(re.findall(r'Đề xuất:\s*known-limits', (root/'_acceptance/stop-patching-law/review-findings.md').read_text()))
assert one > 0, 'bo dem tra 0 tren ho so DA BIET co muc — bo dem hong, khong phai corpus rong'
assert known >= one, 'tong corpus be hon mot ho so — bo dem hong'
text = LEDGER.read_text()
errs = measure(text, known)
assert not errs, 'ban that do oan: ' + '; '.join(errs)
print('P179 DUONG-OK')
lines = text.strip().split('\n')
def mut(transform):
    return measure(transform(text), known)
chet_i = next(i for i, l in enumerate(lines) if l.split('\t')[4:5] == ['chet'])
cols = lines[chet_i].split('\t'); cols[5] = ''
e1 = measure('\n'.join(lines[:chet_i] + ['\t'.join(cols)] + lines[chet_i+1:]), known)
assert any('chet thieu closed_by' in x for x in e1), 'mutant xoa closed_by khong do ghim bat bien: ' + repr(e1)
trung_i = next(i for i, l in enumerate(lines) if l.split('\t')[4:5] == ['trung'])
cols = lines[trung_i].split('\t'); cols[6] = 'id-ma#999'
e2 = measure('\n'.join(lines[:trung_i] + ['\t'.join(cols)] + lines[trung_i+1:]), known)
assert any('id ma' in x for x in e2), 'mutant dup_of id ma khong do: ' + repr(e2)
cols = lines[1].split('\t'); cols[4] = 'zombie'
e3 = measure('\n'.join([lines[0], '\t'.join(cols)] + lines[2:]), known)
assert any('ngoai enum' in x for x in e3), 'mutant status la khong do: ' + repr(e3)
# Xoa XUONG DUOI so dem (S4-r1: xoa dung 1 dong chi vo khi rows == known chinh
# xac hom nay — ledger duoc phep la sieu tap that su theo quan he >=, luc do
# mutant het trip va case do oan voi thong diep sai vat).
e4 = measure('\n'.join(lines[:known]), known)
assert any('quan he >=' in x for x in e4), 'mutant xoa xuong duoi so dem khong do quan he >=: ' + repr(e4)
print('P179 MUTANT-OK (closed_by, dup_of ma, enum, quan he >= deu do ghim ten bat bien)')

# ── AC-1: bon lop loi moi phai co dong SONG trong so + NEO truy duoc ────────
# Chan nay khong tu dung: no la ve NGUON de banh coc LOP-BANG (P177) co cai ma
# so. Doc roi P177 thi no chi la mot danh sach bon ten cung.
LOP_MOI = ['tap-so-rong', 'doi-chung-tu-sinh', 'mut-khong-qua-chan-that', 'pinned-khong-dem-duoc']
FIND179 = root/'_acceptance/cat-hinh-thuc/review-findings.md'
def neo_truy(ledger_text, find_text):
    """Neo dang `[neo: <chuoi>]` trong cot note; <chuoi> phai tim thay NGUYEN
    VAN trong review-findings.md, va bon neo doi mot khac nhau."""
    errs, thay = [], {}
    rows = [l.split('\t') for l in ledger_text.strip().split('\n')[1:]]
    for lop in LOP_MOI:
        hit = [r for r in rows if len(r) >= 8 and r[3] == lop and r[4] == 'song' and r[1] == 'cat-hinh-thuc']
        if not hit:
            errs.append(f'LOP-MOI: {lop} khong co dong SONG slug=cat-hinh-thuc trong so'); continue
        neo = None
        for r in hit:
            m = re.search(r'\[neo: (.+?)\]', r[7])
            if m: neo = m.group(1); break
        if neo is None:
            errs.append(f'LOP-MOI: {lop} thieu neo dang [neo: ...] trong note'); continue
        if neo not in find_text:
            errs.append(f'LOP-MOI: neo cua {lop} KHONG tim thay trong review-findings: {neo!r}')
        elif neo in thay:
            errs.append(f'LOP-MOI: neo trung — {lop} va {thay[neo]} cung tro {neo!r}')
        else:
            thay[neo] = lop
    return errs
# DOI CHUNG DUONG cho ca hai ben doc: rong / duong dan hong phai DO to, khong
# xanh-rong (tap-so-rong — chinh lop dang duoc ghi vao so o ngay day).
assert len(text.strip().split('\n')) > 1, 'LOP-MOI: khong doc duoc so nguon'
find_text = FIND179.read_text()
assert 'REJECT' in find_text and len(find_text) > 2000, 'LOP-MOI: khong doc duoc findings (ban rong/cut?)'
e179 = neo_truy(text, find_text)
assert not e179, 'ban that do oan: ' + '; '.join(e179)
print(f'LOP-MOI: {len(LOP_MOI)}/{len(LOP_MOI)} lop co dong SONG trong so + neo truy duoc')
# Hai chieu do CHAY THAT, ca hai di qua CHINH `neo_truy`.
mA = text.replace('[neo: RA3-01]', '[neo: MA-KHONG-CO-THAT-RA9-99]', 1)
assert mA != text, 'mutant doi neo khong tiem duoc'
eA = neo_truy(mA, find_text)
assert any('neo cua pinned-khong-dem-duoc KHONG tim thay' in x for x in eA), \
    'mutant neo ma khong do dich danh lop: ' + repr(eA)
mB = text.replace('[neo: RA3-01]', '[neo: chiều đỏ không qua chân canh]', 1)
eB = neo_truy(mB, find_text)
assert any('neo trung' in x for x in eB), 'hai lop dung chung mot neo ma khong do: ' + repr(eB)
print('P179 LOP-MOI-MUTANT-OK (neo ma / neo trung deu do ghim dich danh lop)')
P179PY

run "P180 [MBC] E7 baseline 4/6 trong Notes + entry revisit dieu kien dung" \
  python3 - "$ROOT" <<'P180PY'
import json, sys, pathlib
root = pathlib.Path(sys.argv[1])
WS = root/'_acceptance/measure-birth-certificate'
def measure(contract_text, ledger_lines):
    errs = []
    if 'Baseline 2026-08-07: 4/6' not in contract_text:
        errs.append('Notes thieu baseline 4/6 (2026-08-07)')
    revisits = [json.loads(l) for l in ledger_lines if l.strip() and json.loads(l).get('type') == 'revisit']
    ok = [e for e in revisits if 'AC-7' in (e.get('serves') or []) and 'dừng' in e.get('impact', '')]
    if not ok: errs.append('decisions.jsonl thieu entry revisit AC-7 co dieu kien dung')
    return errs
c = (WS/'contract.md').read_text()
d = (WS/'decisions.jsonl').read_text().split('\n')
errs = measure(c, d)
assert not errs, 'ban that do oan: ' + '; '.join(errs)
print('P180 DUONG-OK')
e1 = measure(c.replace('Baseline 2026-08-07: 4/6', 'Baseline (da xoa)'), d)
assert any('baseline 4/6' in x for x in e1), 'mutant xoa baseline khong do: ' + repr(e1)
e2 = measure(c, [l for l in d if '"revisit"' not in l])
assert any('revisit' in x for x in e2), 'mutant xoa entry revisit khong do: ' + repr(e2)
print('P180 MUTANT-OK (xoa baseline / xoa revisit deu do ghim thong diep)')
P180PY

run "P181 [MBC] E9 kenh giao: menh de ton tai -> version goi >= moc" \
  python3 - "$ROOT" <<'P181PY'
import json, sys, pathlib
root = pathlib.Path(sys.argv[1])
ver = lambda s: tuple(int(x) for x in s.split('.'))
GATES = [
    ('feature-loop (Claude)', 'feature-loop/.claude-plugin/plugin.json', '1.27.0'),
    ('acceptance-gate (Claude)', '.claude-plugin/plugin.json', '1.39.0'),
]
clause = 'MEASURE-BIRTH-CLAUSE' in (root/'feature-loop/skills/feature-loop/SKILL.md').read_text()
refs = (root/'skills/acceptance/references/measure-birth.md').exists()
assert clause and refs, 'tien de: khoi/references phai ton tai trong cay nay'
def measure(versions):
    return [f'goi {name}: version {versions[name]} < moc {floor}'
            for name, _, floor in GATES if ver(versions[name]) < ver(floor)]
versions = {name: json.loads((root/p).read_text())['version'] for name, p, _ in GATES}
errs = measure(versions)
assert not errs, 'ban that do oan: ' + '; '.join(errs)
print('P181 DUONG-OK')
mut = dict(versions); mut['feature-loop (Claude)'] = '1.26.0'
e1 = measure(mut)
assert e1 and any('feature-loop (Claude)' in x for x in e1), 'mutant ha version feature-loop khong do ghim ten goi: ' + repr(e1)
mut2 = dict(versions); mut2['acceptance-gate (Claude)'] = '1.38.0'
e2 = measure(mut2)
assert e2 and any('acceptance-gate (Claude)' in x for x in e2), 'mutant ha acceptance-gate khong do: ' + repr(e2)
print('P181 MUTANT-OK (ha version tung goi -> do ghim dung ten goi)')
P181PY

run "P182 [MBC] E8 tu-ap: khoi khai dich danh <-> tap tim duoc + moi case du hai chieu" \
  python3 - "$ROOT" <<'P182PY'
import re, sys, pathlib
root = pathlib.Path(sys.argv[1])
SRC = pathlib.Path(__file__ if '__file__' in dir() else '.')
suite = (root/'tests/plugins/run-tests.sh').read_text()
def measure(text):
    errs = []
    m = re.search(r'# <<<MBC-CASE-IDS\n# ([P0-9 ]+)\n# MBC-CASE-IDS>>>', text)
    if not m: return ['KHONG tim thay khoi khai MBC-CASE-IDS']
    declared = set(m.group(1).split())
    found = set('P' + x for x in re.findall(r'^run "P(\d+) \[MBC\]', text, re.M))
    for missing in sorted(found - declared): errs.append(f'case {missing} co tag [MBC] nhung KHONG khai trong khoi')
    for ghost in sorted(declared - found): errs.append(f'id {ghost} khai trong khoi nhung KHONG tim thay case')
    for pid in sorted(declared & found):
        mm = re.search(r'^run "' + pid + r' \[MBC\][\s\S]*?(?=^run "|\Z)', text, re.M)
        body = mm.group(0) if mm else ''
        if f"{pid} DUONG-OK" not in body: errs.append(f'case {pid} thieu nhanh doi-chung-duong (DUONG-OK)')
        if f"{pid} MUTANT-OK" not in body: errs.append(f'case {pid} thieu nhanh pha-vat (MUTANT-OK)')
    return errs
errs = measure(suite)
assert not errs, 'ban that do oan: ' + '; '.join(errs)
print('P182 DUONG-OK')
m1 = suite.replace('# P174 P175 P176 P177 P179 P180 P181 P182', '# P174 P175 P176 P177 P180 P181 P182')
e1 = measure(m1)
assert e1 and any('P179' in x for x in e1), 'mutant go id khoi khoi khai khong do ghim id: ' + repr(e1)
m2 = suite.replace("print('P174 MUTANT-OK", "print('P174 XONG", 1)
e2 = measure(m2)
assert e2 and any('P174' in x and 'MUTANT-OK' in x for x in e2), 'mutant go nhanh pha-vat khong do neu ten case: ' + repr(e2)
print('P182 MUTANT-OK (tap lech ghim id; case mot-chieu ghim ten case)')
P182PY

# ═══ P183–P184: hai lỗi consumer đi trước kit (upstream 2026-08-07) ═════════
# Cả hai đo sống trên artifact-platform trong đợt rollout 1.38.0. Chúng KHÔNG bị
# suite này bắt trước đây vì mọi fixture cross-layer có sẵn (P145) đều viết
# `criterion: AC-1` TRẦN — đúng hình dạng mà bug không chạm tới. Bài học phép đo:
# fixture phải mang hình dạng mà repo THẬT dùng, không phải hình dạng dễ viết.

# ── P183: ghép đôi cross-layer khi dòng criterion MANG CHỮ MÔ TẢ ─────────────
# `grep -qx` so mã "AC-1" với TOÀN BỘ chuỗi criterion. Repo nào viết
# `criterion: AC-1 (mô tả cho người đọc)` thì không bao giờ khớp → bắn
# dương-tính-giả cho MỌI tiêu chí có nhãn (cross-layer). 1.38.0 upstream nửa
# PHÂN TÍCH (lib/ac-line.cjs) nhưng nửa SO KHỚP vẫn nguyên lỗi.
# Nhánh (c) canh biên: neo `^AC-1` mà THIẾU biên không-phải-số thì AC-1 khớp
# nhầm mục "AC-16 (...)" và tự tạo xanh-giả — đúng thứ răng này sinh ra để chặn.
echo "P183 cross-layer pairing: dong criterion co chu mo ta van ghep doi dung"
P183OK=1
P183WS="$(mktemp -d)"
mkdir -p "$P183WS/_acceptance/xld"
cat > "$P183WS/_acceptance/xld/contract.md" <<'EOF'
---
schema_version: 1
feature: xld
slug: xld
risk_tier: T2
status: implemented
approved_by: tester
---

## Criteria

- AC-1: **(ghi sổ phía sau)** (cross-layer) Given form, When submit, Then DB có row mới.
- AC-16: **(đường ảnh)** (cross-layer) Given upload, When commit, Then bucket có bytes.
EOF
p183_hits() { bash "$ROOT/scripts/pre-merge-check.sh" "$P183WS" 2>&1 | grep -cF "$1 is tagged (cross-layer) but no eval of it declares layer: backend-effect"; }
# (a) đối chứng dương: criterion TRẦN + chỉ layer ui → răng phải cắn cả hai mã
cat > "$P183WS/_acceptance/xld/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: ui-check
    layer: ui
    expected: thấy toast
  - id: E2
    criterion: AC-16
    executor: ui-check
    layer: ui
    expected: thấy ảnh
EOF
[ "$(p183_hits AC-1)" = "1" ] || { echo "     doi chung duong: rang cross-layer KHONG can voi criterion tran"; P183OK=0; }
# (b) LỖI CHÍNH: criterion mang chữ mô tả + layer backend-effect thật → phải SẠCH
cat > "$P183WS/_acceptance/xld/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1 (ghi sổ phía sau) (cross-layer)
    executor: script
    layer: backend-effect
    expected: DB có đúng 1 row mới
  - id: E2
    criterion: AC-16 (đường ảnh) (cross-layer)
    executor: script
    layer: backend-effect
    expected: bucket có bytes
EOF
[ "$(p183_hits AC-1)" = "0" ] || { echo "     criterion co chu mo ta -> false VIOLATION (grep -qx so ma voi ca chuoi)"; P183OK=0; }
[ "$(p183_hits AC-16)" = "0" ] || { echo "     criterion co chu mo ta -> false VIOLATION (AC-16)"; P183OK=0; }
# (c) canh BIÊN: chỉ AC-16 được ghép đôi; AC-1 chỉ có eval ui → AC-1 PHẢI violation.
#     Thiếu biên không-phải-số thì "AC-1" khớp nhầm "AC-16 (...)" → xanh-giả.
cat > "$P183WS/_acceptance/xld/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1 (ghi sổ phía sau) (cross-layer)
    executor: ui-check
    layer: ui
    expected: thấy toast
  - id: E2
    criterion: AC-16 (đường ảnh) (cross-layer)
    executor: script
    layer: backend-effect
    expected: bucket có bytes
EOF
[ "$(p183_hits AC-1)" = "1" ] || { echo "     thieu bien: AC-1 khop nham muc AC-16 -> xanh-gia"; P183OK=0; }
[ "$(p183_hits AC-16)" = "0" ] || { echo "     AC-16 da ghep doi that ma van violation"; P183OK=0; }
rm -rf "$P183WS"
if [ "$P183OK" -eq 1 ]; then
  pass "P183 cross-layer pairing dung ca khi criterion mang chu mo ta, co canh bien"
else
  fail "P183 cross-layer pairing dung ca khi criterion mang chu mo ta, co canh bien"
fi

# ── P184: pin phantom — verified_commit không tồn tại trong clone ĐẦY ĐỦ ─────
# Kit chỉ NOTE khi pin không giải được, gộp hai nguyên nhân rất khác nhau:
# (a) clone nông → thật sự không kiểm được, NOTE là đúng; (b) clone đầy đủ mà
# commit KHÔNG tồn tại → pin là ma, staleness KHÔNG được kiểm chút nào trong khi
# cổng vẫn in "clean". Đo trên artifact-platform: 136/136 hồ sơ ghim vào một
# commit không clone nào có, 135 NOTE, không đỏ dòng nào — cả thanh chắn tắt câm.
echo "P184 pin phantom trong clone day du -> VIOLATION, khong phai NOTE"
P184OK=1
P184WS="$(mktemp -d)"
mkdir -p "$P184WS/_acceptance/ph"
cat > "$P184WS/_acceptance/ph/contract.md" <<'EOF'
---
schema_version: 1
feature: ph
slug: ph
risk_tier: T2
status: signed-off
approved_by: tester
---

## Criteria

- AC-1: Given x, When y, Then z.
EOF
cat > "$P184WS/_acceptance/ph/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: test
    cmd: "true"
    expected: exit 0
EOF
p184_write() {
  cat > "$P184WS/_acceptance/ph/evidence-report.md" <<EOF
---
schema_version: 2
feature_slug: ph
verdict: PASS
failed_evals: []
verified_by: probe
enforcement_mode: strict
bypass_used: false
verified_commit: $1
human_signoff: tester 2026-08-07
---

## Evidence

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
EOF
}
p184_phantom_hits() { bash "$ROOT/scripts/pre-merge-check.sh" "$P184WS" 2>&1 | grep -ci "the pin is a phantom"; }
p184_setup_repo() {
  git -C "$P184WS" init -q 2>/dev/null &&
  git -C "$P184WS" config user.email t@t.t &&
  git -C "$P184WS" config user.name t &&
  git -C "$P184WS" add -A &&
  git -C "$P184WS" commit -q -m seed
}
if ! p184_setup_repo >/dev/null 2>&1; then
  fail "P184 fixture hong (khong dung duoc git repo)"
else
  P184SHA="$(git -C "$P184WS" rev-parse HEAD)"
  [ -n "$P184SHA" ] || { echo "     fixture hong: khong lay duoc HEAD"; P184OK=0; }
  # đối chứng DƯƠNG: pin trỏ commit CÓ THẬT → không được có phantom
  p184_write "$P184SHA"
  git -C "$P184WS" add -A >/dev/null 2>&1 && git -C "$P184WS" commit -q -m realpin >/dev/null 2>&1
  [ "$(p184_phantom_hits)" = "0" ] || { echo "     doi chung duong that bai: pin CO THAT ma bi goi la phantom"; P184OK=0; }
  # lỗi chính: pin hợp lệ về hình dạng nhưng KHÔNG tồn tại, repo KHÔNG nông
  [ "$(git -C "$P184WS" rev-parse --is-shallow-repository)" = "false" ] || { echo "     fixture hong: repo lai la clone nong"; P184OK=0; }
  p184_write 0123456789abcdef0123456789abcdef01234567
  git -C "$P184WS" add -A >/dev/null 2>&1 && git -C "$P184WS" commit -q -m phantompin >/dev/null 2>&1
  [ "$(p184_phantom_hits)" = "1" ] || { echo "     pin ma trong clone day du van chi NOTE -> thanh chan staleness tat cam"; P184OK=0; }
fi
rm -rf "$P184WS"
if [ "$P184OK" -eq 1 ]; then
  pass "P184 pin phantom bi chan trong clone day du, pin that van sach"
else
  fail "P184 pin phantom bi chan trong clone day du, pin that van sach"
fi

# ── P185: khoi VIEC-CUA-ANH tren the Cong 1 (2 nhanh status: draft + approved) ──
# Chuan khoi (chip (2) kit 2.1): 3 ve lam-gi/o-dau/tra-loi-dang-gi + mau gop
# MOT dong; vi tri la QUAN HE (sau than the, truoc hang nut) chu khong phai
# chuoi-co-mat (gap-probe F4); mau la MOT dong text tron sau strip tag (F5).
echo "P185 khoi VIEC-CUA-ANH the Cong 1: 3 ve + mau 1 dong + vi tri truoc foot (E1)"
P185OK=1
P185WS="$(mktemp -d)"
# Kich ban fixture doc CHUNG voi bo sinh the bang chung (S4-r2: hai ban heredoc
# chep tay tung troi khoi nhau ma ca hai phep do van xanh).
. "$ROOT/tests/plugins/fixtures/viec-cua-anh-scenarios.sh"
for P185ST_CASE in draft approved; do
  vca_scenario "gate1-$P185ST_CASE" "$P185WS" || { echo "     dung fixture that bai ($P185ST_CASE)"; P185OK=0; }
  # doi chung: buoc dung fixture co HIEU LUC (status dung nhanh dang do), khong
  # thi ca hai vong lap chi do lai mot trang thai ma khong ai biet.
  grep -q "^status: $P185ST_CASE\$" "$P185WS/_acceptance/fx/contract.md" \
    || { echo "     fixture KHONG mang status=$P185ST_CASE — nhanh nay chua bao gio duoc do"; P185OK=0; }
  P185OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P185WS" --slug fx 2>&1)" || { echo "     exit khac 0 (status=$P185ST_CASE)"; P185OK=0; }
  printf '%s' "$P185OUT" | node -e '
const html = require("fs").readFileSync(0, "utf8");
const st = process.argv[1];
const die = m => { console.error("     [" + st + "] " + m); process.exit(1); };
const iYm = html.indexOf("👉 VIỆC CỦA ANH");
if (iYm < 0) die("thieu nhan khoi");
const iBody = html.indexOf("Cổng 1");
const iFoot = html.indexOf("class=\"foot\"");
if (!(iBody >= 0 && iBody < iYm && iYm < iFoot)) die("khoi sai vi tri (phai sau than the, truoc foot)");
const seg = html.slice(iYm, iFoot);
// MA TRAN muc x ve (S4-r2): dem tren TUNG muc, khong phai "3 chuoi co mat o dau
// do trong khoi" — mot muc du 3 ve va mot muc rong van thoa phep dem cu.
const items = [...seg.matchAll(/<p class="li">([\s\S]*?)<\/p>/g)].map(m => m[1])
  .filter(x => !x.includes("Trả lời mẫu"));
if (items.length !== 1) die("Cong 1 phai co dung MOT muc quyet, thay " + items.length);
items.forEach((it, k) => {
  for (const ve of ["làm gì:", "ở đâu:", "trả lời dạng:"]) if (!it.includes(ve)) die("muc " + (k + 1) + " thieu ve: " + ve);
});
const mau = seg.match(/<p class="li">Trả lời mẫu[^<]*<\/p>/);
if (!mau) die("dong Tra loi mau khong phai MOT dong text tron (tag chen giua hoac thieu)");
if (!/___/.test(mau[0])) die("mau KHONG phai khuon dang co cho trong (thieu ___)");
if (/«Duyệt»|Đạt|«Ký»|đồng ý/.test(mau[0])) die("mau DIEN SAN lua chon thay nguoi — vi pham bat bien YOUR-MOVE-BLOCK-TEMPLATE");
// Kit THOI do phut nguoi (ho so cat-hinh-thuc, 14/08): the la vat NGUOI doc o
// moi cong, nen loi hua phut o day song lau nhat va im nhat — no tung song sot
// tron ba vong vi moi needle deu quet MA NGUON bang literal. Do tren DAU RA.
const HUA_PHUT = /[0-9~]\s*phút|phút\/cổng|minutes/;
if (HUA_PHUT.test(html)) die("the con HUA PHUT: " + JSON.stringify((html.match(HUA_PHUT) || [])[0]));
console.error("     [" + st + "] khoi OK, 0 loi hua phut");
' "$P185ST_CASE" || P185OK=0
done
# chieu do: mutant go khoi trong BAN SAO tron scripts/ + lib/ (khong loc duoi)
P185MUT="$(mktemp -d)"
cp -R "$ROOT/scripts" "$P185MUT/scripts"; cp -R "$ROOT/lib" "$P185MUT/lib"
python3 - "$P185MUT/scripts/gate-card.js" <<'PYX' || P185OK=0
import sys
p = sys.argv[1]
src = open(p, encoding="utf-8").read()
n = sum(1 for l in src.splitlines() if "VIỆC CỦA ANH" in l)
mut = "\n".join(l for l in src.splitlines() if "VIỆC CỦA ANH" not in l)
assert mut != src, "mutant khong tac dung — script chua co khoi?"
open(p, "w", encoding="utf-8").write(mut)
print(f"MUTANT: da go {n} dong mang khoi khoi ban sao gate-card.js")
PYX
P185MOUT="$(node "$P185MUT/scripts/gate-card.js" --root "$P185WS" --slug fx 2>&1)"; P185MST=$?
# MUTANT-PHAI-CHAY-DUOC (doctrine card-text-fidelity, S4-r1): "khong do" cua mot
# script CHET la mu — crash/exit≠0/output khong phai the deu cho cung mau xanh.
[ "$P185MST" -eq 0 ] || { echo "     PHEP DO MU: mutant khong chay duoc (exit $P185MST)"; P185OK=0; }
printf '%s' "$P185MOUT" | grep -qF 'class="foot"' || { echo "     PHEP DO MU: mutant khong render duoc the (thieu hang nut)"; P185OK=0; }
if printf '%s' "$P185MOUT" | grep -qF '👉 VIỆC CỦA ANH'; then echo "     mutant van in khoi — phep do chet"; P185OK=0; fi
rm -rf "$P185WS" "$P185MUT"
if [ "$P185OK" -eq 1 ]; then pass "P185 khoi VIEC-CUA-ANH Cong 1 (2 nhanh status + mutant)"; else fail "P185 khoi VIEC-CUA-ANH Cong 1 (2 nhanh status + mutant)"; fi

# ── P186/P186b: khoi VIEC-CUA-ANH the Cong 2 ky duoc ─────────────────────────
# P186: du 4 loai viec-nguoi (ngoai-hop-dong, judgment UNCERTAIN, oos, quyet
# dinh treo) -> khoi liet du tung ma + mau gop 1 dong. P186b: PASS-thuan-may
# 0 viec-nguoi -> khoi VAN hien voi dung 1 muc ky (pin RIENG — gap-probe F1).
echo "P186 khoi VIEC-CUA-ANH Cong 2: du 4 loai viec + mau gop 1 dong (E2)"
P186OK=1; P186BOK=1
P186WS="$(mktemp -d)"
. "$ROOT/tests/plugins/fixtures/viec-cua-anh-scenarios.sh"
vca_scenario gate2-4loai "$P186WS" || { echo "     dung fixture that bai"; P186OK=0; }
grep -q "PENDING-JUDGMENT" "$P186WS/_acceptance/fx/evidence-report.md" \
  || { echo "     fixture 4-loai hong (thieu verdict PENDING-JUDGMENT)"; P186OK=0; }
P186OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P186WS" --slug fx 2>&1)" || { echo "     exit khac 0"; P186OK=0; }
printf '%s' "$P186OUT" | node -e '
const html = require("fs").readFileSync(0, "utf8");
const die = m => { console.error("     " + m); process.exit(1); };
const iYm = html.indexOf("👉 VIỆC CỦA ANH");
const iFoot = html.indexOf("class=\"foot\"");
if (iYm < 0 || iFoot < iYm) die("khoi thieu hoac sai vi tri");
const seg = html.slice(iYm, iFoot);
// MA TRAN muc x ve + ma phai nam o phan MUC (S4-r2): assert cu duoc thoa boi
// CHINH dong Tra-loi-mau, nen mot khoi chi co dong mau van xanh.
const items = [...seg.matchAll(/<p class="li">([\s\S]*?)<\/p>/g)].map(m => m[1])
  .filter(x => !x.includes("Trả lời mẫu"));
if (items.length < 5) die("khoi thieu muc: chi co " + items.length + " muc (can >=5: Ngoai-1, E9, cat, Treo, ky)");
const mucText = items.join("\n");
for (const need of ["E9", "Ngoài-1", "Treo-1", "cắt/hoãn", "Ký hay trả"])
  if (!mucText.includes(need)) die("phan MUC thieu: " + need + " (chi hien o dong mau la khong du)");
items.forEach((it, k) => {
  for (const ve of ["làm gì:", "ở đâu:", "trả lời dạng:"]) if (!it.includes(ve)) die("muc " + (k + 1) + " thieu ve: " + ve);
});
const mau = seg.match(/<p class="li">Trả lời mẫu[^<]*<\/p>/);
if (!mau) die("mau khong phai MOT dong text tron");
for (const need of ["E9", "Ngoài-1", "Treo", "ký hay trả"]) if (!mau[0].includes(need)) die("mau gop thieu muc: " + need);
// BAT BIEN (S4-r2): mau la KHUON DANG. May KHONG dien san verdict/dong-y thay
// nguoi — ban round-2 tung in «Ngoài-1 ghi Known limits; E9 Đạt; …; Ký», tuc
// viet san cau TRA LOI cua nguoi tai cong, vong qua chinh khoa ADR 0002.
const slots = (mau[0].match(/___/g) || []).length;
if (slots < 5) die("mau thieu cho trong: chi co " + slots + " (moi muc phai co mot ___)");
for (const banned of ["Đạt", "ghi Known limits", "mở hợp đồng mới", "đồng ý cắt", "phê hết", "; Ký»"])
  if (mau[0].includes(banned)) die("mau DIEN SAN lua chon thay nguoi: \"" + banned + "\" — vi pham bat bien cam-dien-san");
// QUAN HE (S4-r1): moi ma khoi 👉 tro toi phai HIEN trong chinh khoi duoc tro —
// khong thi loi chi duong chi dung bang loai tru (do tu vung thay vi quan he).
const body = html.slice(0, iYm);
const blk = (label, nextLabels) => {
  const i = body.indexOf(label); if (i < 0) return null;
  let end = body.length;
  for (const n of nextLabels) { const j = body.indexOf(n, i + label.length); if (j >= 0 && j < end) end = j; }
  return body.slice(i, end);
};
const bJudg = blk("Việc chỉ mình bạn quyết được", ["Quyết định CHƯA duyệt", "Đã duyệt từ Gate 1", "Lưu ý trước khi ký"]);
if (!bJudg) die("khong tim thay khoi Viec-chi-minh-ban-quyet trong than the");
if (!bJudg.includes("E9")) die("khoi 👉 tro toi ma E9 nhung khoi Viec-chi-minh-ban-quyet KHONG in E9");
const bProv = blk("Quyết định CHƯA duyệt", ["Đã duyệt từ Gate 1", "Lưu ý trước khi ký"]);
if (!bProv) die("khong tim thay khoi Quyet-dinh-CHUA-duyet trong than the");
if (!bProv.includes("Treo-1")) die("khoi 👉 tro toi Treo-so nhung khoi Quyet-dinh-CHUA-duyet KHONG in Treo-1");
// Cong 2 cung phai het hua phut — xem chu thich cung luat o P185.
const HUA_PHUT2 = /[0-9~]\s*phút|phút\/cổng|minutes/;
if (HUA_PHUT2.test(html)) die("the Cong 2 con HUA PHUT: " + JSON.stringify((html.match(HUA_PHUT2) || [])[0]));
const bOoc = blk("Ngoài hợp đồng", ["Việc chỉ mình bạn quyết được", "Quyết định CHƯA duyệt"]);
if (!bOoc || !bOoc.includes("Ngoài-1")) die("khoi 👉 tro toi Ngoai-1 nhung khoi Ngoai-hop-dong KHONG in nhan do");
' || P186OK=0
# mutant: go nhanh liet ke judgment -> khoi phai thieu E9 (di qua chinh script that)
P186MUT="$(mktemp -d)"
cp -R "$ROOT/scripts" "$P186MUT/scripts"; cp -R "$ROOT/lib" "$P186MUT/lib"
python3 - "$P186MUT/scripts/gate-card.js" <<'PYX' || P186OK=0
import sys
p = sys.argv[1]
src = open(p, encoding="utf-8").read()
mut = "\n".join(l for l in src.splitlines() if not ("Chấm" in l and "làm gì" in l))
assert mut != src, "mutant khong tac dung — script chua co nhanh liet ke judgment?"
open(p, "w", encoding="utf-8").write(mut)
print("MUTANT: da go nhanh liet ke judgment khoi ban sao gate-card.js")
PYX
P186MOUT="$(node "$P186MUT/scripts/gate-card.js" --root "$P186WS" --slug fx 2>&1)"; P186MST=$?
[ "$P186MST" -eq 0 ] || { echo "     PHEP DO MU: mutant khong chay duoc (exit $P186MST)"; P186OK=0; }
printf '%s' "$P186MOUT" | grep -qF 'class="foot"' || { echo "     PHEP DO MU: mutant khong render duoc the (thieu hang nut)"; P186OK=0; }
if printf '%s' "$P186MOUT" | node -e '
const html = require("fs").readFileSync(0, "utf8");
const iYm = html.indexOf("👉 VIỆC CỦA ANH");
if (iYm < 0) process.exit(1);
const seg = html.slice(iYm, html.indexOf("class=\"foot\""));
process.exit(/Chấm E9/.test(seg) ? 0 : 1);'; then echo "     mutant van liet muc Cham E9 — phep do chet"; P186OK=0; fi
# MUTANT-PHUT (ho so cat-hinh-thuc, 14/08): chen lai loi hua phut vao phu de ->
# chan khong-hua-phut o P185/P186 phai BAT duoc. Ban sao la CAY TRON (scripts +
# lib): mot gate-card.js dung le khong resolve noi ../lib/... nen no chet luc
# nap, va khi ay "het hua phut" voi "crash" cho CUNG mot mau.
P186MUTP="$(mktemp -d)"
cp -R "$ROOT/scripts" "$P186MUTP/scripts"; cp -R "$ROOT/lib" "$P186MUTP/lib"
python3 - "$P186MUTP/scripts/gate-card.js" <<'PYX' || P186OK=0
import sys
p = sys.argv[1]
src = open(p, encoding="utf-8").read()
old = "Cổng 2 · ký duyệt$"
assert old in src, "neo mutant-phut khong con — doi phu de the Cong 2?"
open(p, "w", encoding="utf-8").write(src.replace(old, "Cổng 2 · ký duyệt · ~5 phút$", 1))
print("MUTANT-PHUT: da chen lai ' · ~5 phut' vao phu de the Cong 2")
PYX
P186MPOUT="$(node "$P186MUTP/scripts/gate-card.js" --root "$P186WS" --slug fx 2>&1)"; P186MPST=$?
[ "$P186MPST" -eq 0 ] || { echo "     PHEP DO MU: mutant-phut khong chay duoc (exit $P186MPST)"; P186OK=0; }
printf '%s' "$P186MPOUT" | grep -qF 'class="foot"' || { echo "     PHEP DO MU: mutant-phut khong render duoc the"; P186OK=0; }
# [SỬA 14/08 — rà soát vòng 3 RB3-03] Bản trước tự `grep` đầu ra bằng BẢN CHÉP
# của regex, nên xoá hẳn hai dòng chân canh ở P185/P186 mà suite vẫn xanh và
# mutant vẫn in «bi bat dung». Nay mutant chạy lại CHÍNH đoạn chấm — cùng mã
# nguồn, trích thẳng từ run-tests.sh bằng marker — nên chân canh bị gỡ thì
# mutant hết đỏ và ca ĐỎ đúng chỗ.
_chan_phut() {   # đọc HTML trên stdin → exit 1 nếu thẻ còn hứa phút
  node -e '
const html = require("fs").readFileSync(0, "utf8");
/* CHAN-KHONG-HUA-PHUT: cùng biểu thức với P185:HUA_PHUT và P186:HUA_PHUT2 */
const HUA = /[0-9~]\s*phút|phút\/cổng|minutes/;
process.exit(HUA.test(html) ? 1 : 0);'
}
if printf '%s' "$P186MPOUT" | _chan_phut; then
  echo "     PHEP DO MU: chen lai loi hua phut ma CHAN CANH khong do — chan khong-hua-phut chua bao gio song"; P186OK=0
else
  echo "     MUTANT-PHUT bi bat dung — chan khong-hua-phut (chinh doan cham cua P185/P186) DO"
fi
# Đối chứng dương của chính chân ấy: thẻ NGUYÊN VẸN phải qua được nó.
if printf '%s' "$P186OUT" | _chan_phut; then
  echo "     doi chung duong: the nguyen ven qua duoc chan khong-hua-phut OK"
else
  echo "     PHEP DO MU: the NGUYEN VEN da truot chan khong-hua-phut — chan do oan"; P186OK=0
fi
rm -rf "$P186MUTP"
# MUTANT 2 (QUAN HE, S4-r1): go ma E9 khoi item than the -> phep do quan he
# phai DO du khoi 👉 van tro toi E9.
P186MUT2="$(mktemp -d)"
cp -R "$ROOT/scripts" "$P186MUT2/scripts"; cp -R "$ROOT/lib" "$P186MUT2/lib"
python3 - "$P186MUT2/scripts/gate-card.js" <<'PYX' || P186OK=0
import sys
p = sys.argv[1]
src = open(p, encoding="utf-8").read()
old = '<p class="q">${esc(d.id)} (câu hỏi cần mắt người) · ${esc(plainDec(d.id) || stripMd(d.q))}</p>'
assert old in src, "neo mutant-2 khong con — doi khuon item judgment?"
mut = src.replace(old, '<p class="q">${esc(plainDec(d.id) || stripMd(d.q))}</p>', 1)
open(p, "w", encoding="utf-8").write(mut)
print("MUTANT-2: da go ma eval khoi item 'Viec chi minh ban quyet duoc'")
PYX
P186M2OUT="$(node "$P186MUT2/scripts/gate-card.js" --root "$P186WS" --slug fx 2>&1)"; P186M2ST=$?
[ "$P186M2ST" -eq 0 ] || { echo "     PHEP DO MU: mutant-2 khong chay duoc (exit $P186M2ST)"; P186OK=0; }
printf '%s' "$P186M2OUT" | grep -qF 'class="foot"' || { echo "     PHEP DO MU: mutant-2 khong render duoc the"; P186OK=0; }
if printf '%s' "$P186M2OUT" | node -e '
const html = require("fs").readFileSync(0, "utf8");
const iYm = html.indexOf("👉 VIỆC CỦA ANH");
if (iYm < 0) process.exit(1);
const body = html.slice(0, iYm);
const i = body.indexOf("Việc chỉ mình bạn quyết được");
if (i < 0) process.exit(1);
let end = body.length;
for (const n of ["Quyết định CHƯA duyệt", "Đã duyệt từ Gate 1", "Lưu ý trước khi ký"]) { const j = body.indexOf(n, i); if (j >= 0 && j < end) end = j; }
process.exit(body.slice(i, end).includes("E9") ? 0 : 1);'; then echo "     mutant-2 van in E9 trong khoi duoc tro — phep do quan he chet"; P186OK=0; fi
rm -rf "$P186MUT2"
if [ "$P186OK" -eq 1 ]; then pass "P186 khoi Cong 2 du 4 loai + mau gop (mutant bi bat)"; else fail "P186 khoi Cong 2 du 4 loai + mau gop (mutant bi bat)"; fi

echo "P186b khoi Cong 2 PASS-thuan-may: khoi van hien, dung 1 muc ky (E4)"
vca_scenario gate2-pass-thuan-may "$P186WS" || { echo "     dung fixture that bai"; P186BOK=0; }
grep -q "^verdict: PASS" "$P186WS/_acceptance/fx/evidence-report.md" \
  || { echo "     fixture PASS-thuan-may hong"; P186BOK=0; }
[ ! -f "$P186WS/_acceptance/fx/review-findings.md" ] && [ ! -f "$P186WS/_acceptance/fx/decisions.jsonl" ] \
  || { echo "     fixture PASS-thuan-may van con viec-nguoi — kich ban sai"; P186BOK=0; }
P186BOUT="$(node "$ROOT/scripts/gate-card.js" --root "$P186WS" --slug fx 2>&1)" || { echo "     exit khac 0"; P186BOK=0; }
printf '%s' "$P186BOUT" | node -e '
const html = require("fs").readFileSync(0, "utf8");
const die = m => { console.error("     " + m); process.exit(1); };
const iYm = html.indexOf("👉 VIỆC CỦA ANH");
if (iYm < 0) die("khoi BIEN MAT tren the 0 viec-nguoi");
const seg = html.slice(iYm, html.indexOf("class=\"foot\""));
const items = [...seg.matchAll(/<p class="li">([\s\S]*?)<\/p>/g)].map(m => m[1])
  .filter(x => !x.includes("Trả lời mẫu"));
if (items.length !== 1) die("phai co dung MOT muc ky-hay-tra, thay " + items.length);
for (const ve of ["làm gì:", "ở đâu:", "trả lời dạng:"]) if (!items[0].includes(ve)) die("muc ky thieu ve: " + ve);
if (!items[0].includes("Ký hay trả")) die("muc ky thieu");
' || P186BOK=0
# mutant rieng cua nhanh rong: go muc Ky-hay-tra tren chinh fixture nay
P186BMUT="$(mktemp -d)"
cp -R "$ROOT/scripts" "$P186BMUT/scripts"; cp -R "$ROOT/lib" "$P186BMUT/lib"
python3 - "$P186BMUT/scripts/gate-card.js" <<'PYX' || P186BOK=0
import sys
p = sys.argv[1]
src = open(p, encoding="utf-8").read()
mut = "\n".join(l for l in src.splitlines() if "Ký hay trả" not in l)
assert mut != src, "mutant khong tac dung — script chua co muc Ky-hay-tra?"
open(p, "w", encoding="utf-8").write(mut)
print("MUTANT: da go muc Ky-hay-tra khoi ban sao gate-card.js")
PYX
P186BMOUT="$(node "$P186BMUT/scripts/gate-card.js" --root "$P186WS" --slug fx 2>&1)"; P186BMST=$?
[ "$P186BMST" -eq 0 ] || { echo "     PHEP DO MU: mutant khong chay duoc (exit $P186BMST)"; P186BOK=0; }
printf '%s' "$P186BMOUT" | grep -qF 'class="foot"' || { echo "     PHEP DO MU: mutant khong render duoc the (thieu hang nut)"; P186BOK=0; }
if printf '%s' "$P186BMOUT" | grep -qF 'Ký hay trả'; then echo "     mutant van in muc ky — phep do chet"; P186BOK=0; fi
rm -rf "$P186WS" "$P186MUT" "$P186BMUT"
if [ "$P186BOK" -eq 1 ]; then pass "P186b khoi khong bien mat khi 0 viec-nguoi (mutant bi bat)"; else fail "P186b khoi khong bien mat khi 0 viec-nguoi (mutant bi bat)"; fi

# ── P187: khoi VIEC-CUA-ANH the Cong 2 khong ky duoc = tin chi-bao ───────────
# 3 nhanh verdict (REJECT / BLOCKED / la) deu ghi "không cần làm gì" + cau
# may-dang-lam-gi-tiep, KHONG doi tra loi; doi chung duong doi-gia-tri: CUNG
# fixture nang PASS -> khoi doi sang muc Ky, chuoi chi-bao bien mat.
echo "P187 khoi Cong 2 khong-ky-duoc: 'khong can lam gi' + 3 nhanh verdict (E3)"
P187OK=1
P187WS="$(mktemp -d)"
. "$ROOT/tests/plugins/fixtures/viec-cua-anh-scenarios.sh"
p187_rep() { # $1 = verdict; dung kich ban CHUNG, khong heredoc rieng
  case "$1" in
    REJECT)  vca_scenario gate2-reject "$P187WS" ;;
    BLOCKED) vca_scenario gate2-blocked "$P187WS" ;;
    PASS)    vca_scenario gate2-pass-thuan-may "$P187WS" ;;
    *)       vca_scenario gate2-weird "$P187WS" ;;
  esac
  grep -q "^verdict: $1\$" "$P187WS/_acceptance/fx/evidence-report.md" \
    || { echo "     fixture KHONG mang verdict=$1 — nhanh nay chua bao gio duoc do"; P187OK=0; }
}
# QUAN HE verdict -> cau may-dang-lam-gi-tiep (S4-r1): moi nhanh ghim cau RIENG
# cua no VA doi hai cau kia VANG — vong 3 nhanh assert y het nhau thi gop
# ternary thanh mot cau van xanh (do tu vung thay vi quan he).
p187_expect() { case "$1" in
  REJECT)  echo "máy đang quay lại sửa code rồi tự chấm vòng mới" ;;
  BLOCKED) echo "máy đang khắc phục nguyên nhân kẹt rồi chạy lại vòng chấm" ;;
  *)       echo "máy phải chạy lại vòng chấm để có kết luận đọc được" ;;
esac; }
for P187V in REJECT BLOCKED WEIRD; do
  p187_rep "$P187V"
  P187OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P187WS" --slug fx 2>&1)" || { echo "     exit khac 0 ($P187V)"; P187OK=0; }
  printf '%s' "$P187OUT" | P187_MINE="$(p187_expect "$P187V")" \
    P187_OTHER1="$(p187_expect REJECT)" P187_OTHER2="$(p187_expect BLOCKED)" P187_OTHER3="$(p187_expect WEIRD)" node -e '
const html = require("fs").readFileSync(0, "utf8");
const v = process.argv[1];
const die = m => { console.error("     [" + v + "] " + m); process.exit(1); };
const iYm = html.indexOf("👉 VIỆC CỦA ANH");
if (iYm < 0) die("thieu khoi tren the chi-bao");
const seg = html.slice(iYm, html.indexOf("class=\"foot\""));
if (!seg.includes("không cần làm gì")) die("thieu chuoi chi-bao");
if (seg.includes("trả lời dạng:") || seg.includes("Trả lời mẫu")) die("the chi-bao lai doi tra loi");
const mine = process.env.P187_MINE;
if (!seg.includes(mine)) die("thieu cau may-dang-lam-gi-tiep DUNG cua verdict nay: " + mine);
for (const other of [process.env.P187_OTHER1, process.env.P187_OTHER2, process.env.P187_OTHER3]) {
  if (other !== mine && seg.includes(other)) die("khoi in CA cau cua verdict khac — quan he verdict→cau khong phan biet: " + other);
}
' "$P187V" || P187OK=0
done
# mutant QUAN HE: gop ba cau thanh MOT (moi verdict cung mot cau) -> vong 3
# nhanh phai DO o it nhat mot nhanh; mutant phai chay duoc moi duoc cham.
P187MUT="$(mktemp -d)"
cp -R "$ROOT/scripts" "$P187MUT/scripts"; cp -R "$ROOT/lib" "$P187MUT/lib"
python3 - "$P187MUT/scripts/gate-card.js" <<'PYX' || P187OK=0
import sys
p = sys.argv[1]
src = open(p, encoding="utf-8").read()
a = "máy đang khắc phục nguyên nhân kẹt rồi chạy lại vòng chấm"
b = "máy phải chạy lại vòng chấm để có kết luận đọc được"
assert a in src and b in src, "neo mutant P187 khong con"
mut = src.replace(a, "máy đang quay lại sửa code rồi tự chấm vòng mới").replace(b, "máy đang quay lại sửa code rồi tự chấm vòng mới")
open(p, "w", encoding="utf-8").write(mut)
print("MUTANT: da gop ba cau may-dang-lam-gi-tiep thanh MOT")
PYX
p187_rep BLOCKED
P187MOUT="$(node "$P187MUT/scripts/gate-card.js" --root "$P187WS" --slug fx 2>&1)"; P187MST=$?
[ "$P187MST" -eq 0 ] || { echo "     PHEP DO MU: mutant khong chay duoc (exit $P187MST)"; P187OK=0; }
printf '%s' "$P187MOUT" | grep -qF 'class="foot"' || { echo "     PHEP DO MU: mutant khong render duoc the"; P187OK=0; }
if printf '%s' "$P187MOUT" | grep -qF 'máy đang khắc phục nguyên nhân kẹt'; then echo "     mutant khong hieu luc"; P187OK=0; fi
printf '%s' "$P187MOUT" | grep -qF 'máy đang quay lại sửa code' || { echo "     mutant khong in cau gop — dot bien hong"; P187OK=0; }
rm -rf "$P187MUT"
# doi chung duong doi-gia-tri tren CUNG fixture — scope vao KHOI (nhan
# "Máy đã lo (liếc qua, không cần làm gì)" co san tren the ky-duoc, grep toan
# trang se trung oan)
p187_rep PASS
P187OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P187WS" --slug fx 2>&1)"
printf '%s' "$P187OUT" | node -e '
const html = require("fs").readFileSync(0, "utf8");
const die = m => { console.error("     " + m); process.exit(1); };
const iYm = html.indexOf("👉 VIỆC CỦA ANH");
if (iYm < 0) die("PASS thieu khoi");
const seg = html.slice(iYm, html.indexOf("class=\"foot\""));
if (seg.includes("không cần làm gì")) die("PASS van in chi-bao trong KHOI — khong phan biet trang thai");
if (!seg.includes("Ký hay trả")) die("PASS thieu muc Ky trong khoi");
' || P187OK=0
rm -rf "$P187WS"
if [ "$P187OK" -eq 1 ]; then pass "P187 chi-bao khong-can-lam-gi (3 nhanh + doi chung PASS)"; else fail "P187 chi-bao khong-can-lam-gi (3 nhanh + doi chung PASS)"; fi

# ── P188: GATE-INVITE-CLAUSE round-trip nguon -> 4 ban chep, khop tung ky tu ──
# Pattern LOOP-PICTURE-CLAUSE/P85: "chep nguyen van" la cho troi kinh dien
# (bai hoc s4-scope-triage) — phep do phai rut tu NGUON qua marker roi so voi
# TUNG ban chep; do dot bien phai DICH DANH ban lech.
run "P188 round-trip dieu khoan moi-cong: MOI site nguon khop tung ky tu (E5)" \
  python3 - "$ROOT" <<'P188PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
law_p = "skills/acceptance/references/human-facing-language.md"
law = (root / law_p).read_text(encoding="utf-8")
RX = re.compile(r"<!-- <<<GATE-INVITE-CLAUSE -->\n([\s\S]*?)\n<!-- GATE-INVITE-CLAUSE>>> -->")
m = RX.search(law)
assert m, law_p + ": KHONG rut duoc GATE-INVITE-CLAUSE qua marker"
clause = m.group(1).strip()
assert clause and "\n" not in clause, "clause phai la MOT dong khong rong"  # doi chung duong
# PHAM VI SUY TU MAT PHANG (S4-r2) thay cho danh sach go tay: manifest chi khai
# cac site NGUON (pham vi la quyet dinh nguoi); moi BAN DUNG duoi plugins/ va
# moi ban cung duoi-duong-dan deu duoc SUY ra roi bi doi y het.
# Lo da dam: 4 ban Claude duoc sua, 2 overlay Codex thi khong — ma overlay GHI
# DE ban Claude trong goi Codex, nen goi phat hanh moi cong khong chiu luat,
# con phep do danh-sach-tay thi mu vinh vien voi cho do.
# Manifest khai `<path> <so-ban-phai-co>` (chip (2)b): so la mot phan cua
# pham-vi-do-nguoi-quyet. Parser FAIL-LOUD — dong thieu so phai DO dich danh,
# khong default lang le ve 1/0 (bai allowlist-bien-fail-loud-thanh-fail-silent).
def doc_manifest(law_text):
    msx = re.search(r"<!-- <<<GATE-INVITE-SITES -->\n([\s\S]*?)<!-- GATE-INVITE-SITES>>> -->", law_text)
    assert msx, law_p + ": KHONG rut duoc manifest GATE-INVITE-SITES qua marker"
    decl = {}
    for line in msx.group(1).splitlines():
        toks = line.split()
        if not toks:
            continue
        assert toks[0].endswith(".md"), "dong manifest la (khong phai `<path.md> <so>`): " + repr(line)
        assert len(toks) == 2 and toks[1].isdigit(), "site thieu so ban: " + toks[0]
        decl[toks[0]] = int(toks[1])
    return decl
DECL = doc_manifest(law)
SITES = list(DECL)
# San ha tu 4 xuong 3 vi harness Codex da luu kho (12/08): ba mat moi-cong con
# lai deu la ban Claude. San van la san — 0 hit gan nhu luon la grep hong.
assert len(SITES) >= 3, "manifest qua it site (grep hong?): " + repr(SITES)
# Ban dung/overlay da luu kho: khong con ban suy ra nao, nen phep so chi con
# tren cac site NGUON. Rang that cua ca nay la LUAT DEM NGUON ben duoi (so
# voi so khai trong manifest, dung hai huong) — no khong phu thuoc ban chep.
ALL = list(SITES)
texts = {rel: (root / rel).read_text(encoding="utf-8") for rel in ALL}
ANCHOR = " ".join(clause.split(" ")[:3])   # "Moi tin moi"
def occurrences(t):
    out, i = [], t.find(ANCHOR)
    while i >= 0:
        out.append(i)
        i = t.find(ANCHOR, i + 1)
    return out
def lech(mapping):
    bad = []
    for rel, t in mapping.items():
        occ = occurrences(t)
        if not occ:
            bad.append(rel + " (khong co lan xuat hien nao)")
            continue
        for i in occ:
            if t[i:i + len(clause)] != clause:
                bad.append(rel + " @" + str(i))
                break
    return bad
assert lech(texts) == [], "ban that do oan: " + repr(lech(texts))   # doi chung DUONG
def count_of(mapping, rel):
    return len(occurrences(mapping[rel]))
# LUAT DEM NGUON (chip (2)b, review-findings r3 hinh dang 5): so nguon voi SO
# KHAI trong manifest, DUNG hai huong (dieu kien B mac 1: ban lac troi VAO cung
# phai keu, khong chi ban bi go). Day la rang CHINH cua ca nay tu khi ban
# dung/overlay duoc luu kho — no khong phu thuoc ban chep nao.
def dem_nguon(mapping, decl):
    bad = []
    for s2, want in decl.items():
        n = count_of(mapping, s2)
        if n < want:
            bad.append(s2 + ": it-hon-so-khai (" + str(n) + " < " + str(want) + ")")
        elif n > want:
            bad.append(s2 + ": nhieu-hon-so-khai (" + str(n) + " > " + str(want) + ")")
    return bad
assert dem_nguon(texts, DECL) == [], "ban that do oan: " + repr(dem_nguon(texts, DECL))   # doi chung DUONG
# LUAT RANH-GIOI-CAU (chip (2)b, review-findings r3 — vu that 3caee05): clause
# phai duoc THA vao ranh gioi cau, khong duoc cat doi cau chu. TRUOC moi lan
# xuat hien (bo khoang trang duoi): ky tu chot thuoc bo ket-cau .:!?… HOAC
# dau-khoi = dau file / dong lien truoc la dong TRANG (clause dong-rieng sau
# mot dong van do KHONG tinh dau-khoi — neu tinh, hinh dang 3caee05 xanh vinh
# vien). SAU moi lan: phan con lai tren CUNG dong khong duoc mo dau chu thuong.
KET_CAU = ".:!?…"
def ranh_gioi(mapping):
    bad = []
    for rel, t in mapping.items():
        for i in occurrences(t):
            if t[i:i + len(clause)] != clause:
                continue   # ban chep lech da co lech() canh; ranh gioi chi do ban khop
            truoc = t[:i].rstrip(" \t")
            dau_khoi = (truoc == "") or truoc.endswith("\n\n") or truoc.endswith("\n")
            # truoc.endswith("\n") don le = dong lien truoc co van ban -> phai xet
            # dong do; chi dong TRANG (\n\n) hoac dau file moi la dau-khoi that.
            if truoc.endswith("\n") and not truoc.endswith("\n\n"):
                dau_khoi = False
                truoc = truoc.rstrip("\n").rstrip(" \t")
            if not dau_khoi and (truoc == "" or truoc[-1] not in KET_CAU):
                bad.append(rel + " @" + str(i) + " (truoc khong ket cau: ..." + repr(truoc[-30:]) + ")")
                continue
            sau = t[i + len(clause):]
            dong_sau = sau.split("\n", 1)[0].lstrip(" \t")
            if dong_sau and dong_sau[0].islower():
                bad.append(rel + " @" + str(i) + " (sau cung dong mo dau chu thuong: " + repr(dong_sau[:30]) + ")")
    return bad
assert ranh_gioi(texts) == [], "ban that do oan: " + repr(ranh_gioi(texts))   # doi chung DUONG
TONG_LUOT = sum(len(occurrences(t)) for t in texts.values())
print("P188 DUONG-OK (" + str(len(SITES)) + " site nguon, " + str(TONG_LUOT) + " luot clause)")
# chieu do 1: lam lech DUNG ban chep thu 2 trong mot file (ban thu 1 con nguyen)
victim = next(r for r in ALL if len(occurrences(texts[r])) >= 2)
occ_v = occurrences(texts[victim])
i2 = occ_v[1]
mut = dict(texts)
mut[victim] = texts[victim][:i2] + clause.replace("MOT khoi", "M0T khoi") + texts[victim][i2 + len(clause):]
if mut[victim] == texts[victim]:
    mut[victim] = texts[victim][:i2] + clause[:-1] + "!" + texts[victim][i2 + len(clause):]
assert mut[victim] != texts[victim], "dot bien khong tac dung"
print("MUTANT-1: lam lech ban chep thu 2 trong " + victim + " (offset " + str(i2) + "), ban thu 1 giu nguyen")
assert clause in mut[victim], "sanity: ban thu 1 phai con nguyen"
b1 = lech(mut)
assert len(b1) == 1 and b1[0].startswith(victim), "phep so phai do DICH DANH " + victim + ", thay: " + repr(b1)
# chieu do 2: go SACH clause khoi MOT site khac -> phai do dich danh file do
# (khac chieu 1: chieu 1 lam LECH mot ban, chieu nay lam MAT ca file).
vic2 = next(r for r in SITES if r != victim)
mut2 = dict(texts)
mut2[vic2] = texts[vic2].replace(clause, "")          # go SACH moi ban trong file do
assert mut2[vic2] != texts[vic2], "dot bien overlay khong tac dung"
print("MUTANT-2: go SACH clause khoi site " + vic2)
b2 = lech(mut2)
assert any(x.startswith(vic2) for x in b2), "phep do MU voi site mat sach clause: " + repr(b2)
# chieu do 4 (chip (2)b — lo r3 hinh dang 5): go 1 trong 2 ban o site NGUON.
# Truoc day chieu nay mo phong go-o-nguon-roi-sync (ban dung mat theo nen hai ve
# cung giam); sau khi luu kho ban dung, no do thang quan he nguon-vs-manifest.
vic4 = "feature-loop/skills/feature-loop/SKILL.md"
assert vic4 in DECL and DECL[vic4] >= 2, "nan nhan chieu do 4 phai la site nguon khai >=2 ban: " + repr(DECL.get(vic4))
mut4 = dict(texts)
mut4[vic4] = texts[vic4].replace(clause, "", 1)
assert mut4[vic4] != texts[vic4], "dot bien nguon-it-hon khong tac dung"
print("MUTANT-4: go 1 trong " + str(DECL[vic4]) + " ban o site NGUON " + vic4 + " (khong co ban dung de mat theo — mo phong sau-sync tron ven)")
assert lech(mut4) == [], \
    "sanity: luat khop-tung-ky-tu phai IM tren dot bien nay (lo r3 la that): lech=" + repr(lech(mut4))
print("SANITY-LUAT-CU-IM: lech() im tren dot bien nguon-it-hon — lo r3 la that, luat dem nguon khong thua")
b4 = dem_nguon(mut4, DECL)
assert any(x.startswith(vic4) and "it-hon-so-khai" in x for x in b4), \
    "luat dem nguon MU voi go-o-nguon-roi-sync: " + repr(b4)
print("MUTANT-4 bi bat: dem_nguon do dich danh " + [x for x in b4 if x.startswith(vic4)][0])
# chieu do 5 (dieu kien B, ack moc 1): ban LAC troi VAO nguon ma manifest chua
# duoc nguoi cap nhat — them mot ban chep hop ranh gioi (doan van rieng sau
# dong trang) vao CUNG nan nhan, de sanity luat-cu-im giu nguyen ca hai huong.
mut5 = dict(texts)
mut5[vic4] = texts[vic4].rstrip("\n") + "\n\n" + clause + "\n"
assert mut5[vic4] != texts[vic4], "dot bien nguon-nhieu-hon khong tac dung"
print("MUTANT-5: them 1 ban clause lac (dung ranh gioi cau) vao site NGUON " + vic4 + ", manifest giu nguyen")
assert lech(mut5) == [] and ranh_gioi(mut5) == [], \
    "sanity: hai luat kia phai IM tren dot bien nay: " + repr((lech(mut5), ranh_gioi(mut5)))
b5 = dem_nguon(mut5, DECL)
assert any(x.startswith(vic4) and "nhieu-hon-so-khai" in x for x in b5), \
    "luat dem nguon MU voi ban-lac-troi-vao: " + repr(b5)
print("MUTANT-5 bi bat: dem_nguon do dich danh " + [x for x in b5 if x.startswith(vic4)][0])
# chieu do 6 (dieu kien B): dong manifest THIEU SO — parser that phai FAIL-LOUD
# dich danh, khong default lang le ve 1/0.
mut_law6 = law.replace(vic4 + " " + str(DECL[vic4]), vic4, 1)
assert mut_law6 != law, "dot bien manifest-thieu-so khong tac dung"
print("MUTANT-6: dong manifest cua " + vic4 + " bi go mat so ban")
try:
    doc_manifest(mut_law6)
    assert False, "parser manifest NUOT dong thieu so — fail-silent (bai allowlist)"
except AssertionError as ex:
    assert "site thieu so ban: " + vic4 in str(ex), \
        "parser do nhung KHONG ghim dich danh 'site thieu so ban': " + str(ex)
print("MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: " + vic4 + "'")
# chieu do 7 (chip (2)b — lo r3 hinh dang chen-giua-cau, vu that 3caee05): tai
# tao DICH DANH layout pre-3caee05 — clause DONG RIENG chen giua hai nua cau
# "...the verdict + hook" / "are unchanged." trong ban chep acceptance SKILL.
vic7 = next(r for r in ALL if "the verdict + hook" in texts[r] and r.endswith("acceptance/SKILL.md"))
lines7 = texts[vic7].splitlines(keepends=True)
i_hook = next(k for k, l in enumerate(lines7) if l.rstrip().endswith("the verdict + hook"))
assert lines7[i_hook + 1].strip() == "are unchanged.", \
    "layout hien tai da doi (dong sau hook khong phai 'are unchanged.') — khong tai tao duoc 3caee05"
assert clause in lines7[i_hook + 2], "layout hien tai da doi (dong thu 3 khong mang clause)"
indent7 = lines7[i_hook + 1][:len(lines7[i_hook + 1]) - len(lines7[i_hook + 1].lstrip())]
# pre-3caee05: hook\n <clause dong rieng>\n "are unchanged. The `signoff`..."
mut7 = dict(texts)
mut7[vic7] = "".join(
    lines7[:i_hook + 1]
    + [lines7[i_hook + 2]]
    + [indent7 + "are unchanged. " + lines7[i_hook + 3].lstrip()]
    + lines7[i_hook + 4:]
)
assert mut7[vic7] != texts[vic7], "dot bien chen-giua-cau khong tac dung"
print("MUTANT-7: tai tao layout pre-3caee05 trong " + vic7 + " (clause dong rieng chen giua 'the verdict + hook' / 'are unchanged.')")
assert lech(mut7) == [] and dem_nguon(mut7, DECL) == [], \
    "sanity: cac luat khop/dem phai IM (clause chi DI CHO, khong doi byte/so ban): " + repr((lech(mut7), dem_nguon(mut7, DECL)))
print("SANITY-LUAT-KHOP-IM: lech/dem_nguon deu im tren dot bien chen-giua-cau — chi ranh_gioi do duoc lo nay")
b7 = ranh_gioi(mut7)
assert any(x.startswith(vic7) and "truoc khong ket cau" in x for x in b7), \
    "luat ranh gioi MU voi hinh dang 3caee05: " + repr(b7)
print("MUTANT-7 bi bat: ranh_gioi do dich danh " + [x for x in b7 if x.startswith(vic7)][0])
print("P188 OK (" + str(TONG_LUOT) + " luot khop + ranh gioi + dem nguon " + str(sum(DECL.values())) + " ban; 7 chieu do: lech-1-trong-2, go-overlay, go-1-ban-dung, nguon-it-hon, nguon-nhieu-hon (dieu kien B), manifest-thieu-so fail-loud (dieu kien B), chen-giua-cau 3caee05 — tat ca in xac-nhan-dot-bien va di qua luat that)")
P188PY

# ── P190: 3 the bang chung cua E7 phai la VAT SONG, khong phai anh chup ─────
# Cung khuon P53/TE17: sinh LAI trong chinh lan chay nay bang gate-card.js that
# roi so byte-doi-byte. Khong co chot nay thi renderer doi ma judge E7 van cham
# ban HTML cu — "snapshot khong ghim vao corpus song" (S4-r1, do-luong).
echo "P190 the bang chung E7 = ban render that cua cay hien tai (sinh lai + so byte)"
P190OK=1
P190EV="$ROOT/_acceptance/khoi-viec-cua-anh/evidence"
P190GEN="$ROOT/tests/plugins/fixtures/render-viec-cua-anh-cards.sh"
P190FILES="p185-card-gate1.html p186-card-gate2.html p187-card-gate2-reject.html"
if [ ! -f "$P190GEN" ]; then
  echo "     thieu script sinh: $P190GEN"; P190OK=0
else
  P190TMP="$(mktemp -d)"
  if ! bash "$P190GEN" "$P190TMP" >/dev/null 2>&1; then
    echo "     bo sinh the that bai — phep do khong the ket luan"; P190OK=0
  else
    for f in $P190FILES; do
      if [ ! -f "$P190EV/$f" ]; then echo "     thieu the check-in: $f"; P190OK=0; continue; fi
      if [ ! -s "$P190TMP/$f" ]; then echo "     ban sinh lai RONG: $f (bo sinh hong)"; P190OK=0; continue; fi
      grep -qF '👉 VIỆC CỦA ANH' "$P190TMP/$f" || { echo "     ban sinh lai thieu khoi: $f"; P190OK=0; }
      if ! cmp -s "$P190EV/$f" "$P190TMP/$f"; then
        echo "     $f da TROI so voi ban render hien tai — chay lai:"
        echo "       bash tests/plugins/fixtures/render-viec-cua-anh-cards.sh _acceptance/khoi-viec-cua-anh/evidence"
        P190OK=0
      fi
    done
    # chieu do: doi MOT byte trong ban check-in (ban sao tam) -> phep so phai DO
    P190CP="$(mktemp -d)"; cp "$P190EV/p185-card-gate1.html" "$P190CP/x.html"
    printf 'x' >> "$P190CP/x.html"
    if cmp -s "$P190CP/x.html" "$P190TMP/p185-card-gate1.html"; then
      echo "     PHEP DO CHET: ban da doi byte van 'khop' — cmp khong phan biet"; P190OK=0
    else
      echo "     MUTANT: them 1 byte vao ban sao the Cong 1 -> phep so byte DO dung nhu mong doi"
    fi
    rm -rf "$P190CP"
  fi
  rm -rf "$P190TMP"
fi
if [ "$P190OK" -eq 1 ]; then pass "P190 the bang chung E7 == ban render that (sinh lai + so byte + mutant)"; else fail "P190 the bang chung E7 == ban render that (sinh lai + so byte + mutant)"; fi

# ── P191/P192/P193: mot-luot-go + --repo cho 6 lenh cong nguoi (chip 3 kit 2.1)
# Vat: khoi ngu phap GATE-ONESHOT-* trong ban luat ngon ngu mat nguoi + 12 than
# lenh chep dieu khoan. Ba lop do: P191 cau truc khoi luat; P192 round-trip
# the->SLOTS hai huong (fixture code-sinh, gate-card.js THAT); P193 manifest
# site + ban chep nguyen van + quan he per-site (--repo, con tro grammar,
# SLOTS->than-lenh). Moi mutant di qua chinh checker that + in xac-nhan.
echo "P191 khoi ngu phap cau gop GATE-ONESHOT: cau truc + 8 neo luat (E1 mot-luot-go)"
P191OK=1
ONESHOT_LAW="$ROOT/skills/acceptance/references/human-facing-language.md"
P191TMP="$(mktemp -d)"
cat > "$P191TMP/check-law.js" <<'P191JS'
// checker P191: rut GRAMMAR + SLOTS qua marker tu file luat, assert cau truc.
const fs = require("fs");
const p = process.argv[2];
const die = m => { console.error("P191 LOI: " + m); process.exit(1); };
const src = fs.readFileSync(p, "utf8");
const block = name => {
  const rx = new RegExp("<!-- <<<" + name + " -->\\n([\\s\\S]*?)\\n<!-- " + name + ">>> -->");
  const m = src.match(rx);
  if (!m) die("thieu khoi marker: " + name);
  return m[1];
};
const grammar = block("GATE-ONESHOT-GRAMMAR");
const slotsRaw = block("GATE-ONESHOT-SLOTS");
const anchors = [
  // 2 neo đổi bởi chip ③b (đổi-thước-có-hợp-đồng, AC-1g may-ganh-nguoi-quyet):
  // hoi-lai-phan-la («hỏi lại đúng phần đó») → khuyen-nghi-truoc;
  // ten-phut-ngoai-the («follow-up DUY NHẤT») → enter-xac-nhan.
  ["khong-dien-san", "không bao giờ điền sẵn"],
  ["vang-gop-nhu-cu", "hỏi từng bước như cũ"],
  ["giu-nguyen-van", "GIỮ NGUYÊN VĂN"],
  ["khuyen-nghi-truoc", "cách hiểu khả dĩ nhất"],
  ["enter-xac-nhan", "Enter xác nhận"],
  ["start-slug", "không thấy slug trong nhóm nào"],
  ["khuon-ma-eval", "E\\w+"],
  ["cu-phap-go", "TOÀN BỘ phần còn lại của dòng"],
];
for (const [tag, s] of anchors) if (!grammar.includes(s)) die("GRAMMAR thieu luat " + tag + " (neo: " + s + ")");
const rows = slotsRaw.split("\n").map(l => l.trim()).filter(l => /^(g1|g2|extra) /.test(l));
if (!rows.length) die("SLOTS rong hoac sai khuon dong");
const gates = new Set(rows.map(r => r.split(" ")[0]));
if (!gates.has("g1") || !gates.has("g2")) die("SLOTS thieu cong g1 hoac g2");
if (!rows.some(r => r !== null && r.startsWith("g2 ") && r.includes("Ngoài-<số>"))) die("SLOTS thieu khuon nhan bien thien Ngoài-<số>");
if (!rows.some(r => r.startsWith("g2 ") && r.includes("<mã eval>"))) die("SLOTS thieu khuon nhan bien thien <mã eval>");
if (!rows.some(r => r.startsWith("extra "))) die("SLOTS thieu nhan extra (ten/phut ngoai-the)");
// So neo SUY tu chinh mang anchors — ghim literal thi them luat moi ma dong
// tong ket van in so cu (lop tong-ket-khong-kem-so-ca).
console.log("P191-CHECK OK: " + rows.length + " dong SLOTS, " + anchors.length + " neo luat du");
P191JS
if node "$P191TMP/check-law.js" "$ONESHOT_LAW"; then :; else P191OK=0; fi
# chieu do CHAY THAT: go MOT neo luat khoi ban sao -> checker do dich danh
sed 's/GIỮ NGUYÊN VĂN/GIU-NGUYEN-VAN-DA-GO/' "$ONESHOT_LAW" > "$P191TMP/law-mut.md"
if grep -q "GIU-NGUYEN-VAN-DA-GO" "$P191TMP/law-mut.md"; then
  echo "     MUTANT-P191: da go neo GIU NGUYEN VAN khoi ban sao ban luat"
else
  echo "     mutant P191 khong tac dung (neo chua ton tai trong ban luat?)"; P191OK=0
fi
P191MERR="$(node "$P191TMP/check-law.js" "$P191TMP/law-mut.md" 2>&1)"; P191MST=$?
if [ "$P191MST" -ne 0 ] && printf '%s' "$P191MERR" | grep -q "thieu luat giu-nguyen-van"; then
  echo "     mutant P191 DO dung thong diep (thieu luat giu-nguyen-van)"
else
  echo "     PHEP DO MU: mutant P191 khong do hoac sai thong diep: $P191MERR"; P191OK=0
fi
rm -rf "$P191TMP"
if [ "$P191OK" -eq 1 ]; then pass "P191 ngu phap cau gop GATE-ONESHOT (8 neo, 1 chieu do chay that)"; else fail "P191 ngu phap cau gop GATE-ONESHOT (8 neo, 1 chieu do chay that)"; fi

echo "P192 round-trip the->ngu phap: nhan Tra-loi-mau khop SLOTS hai huong (E2 mot-luot-go)"
P192OK=1
P192TMP="$(mktemp -d)"
. "$ROOT/tests/plugins/fixtures/viec-cua-anh-scenarios.sh"
cat > "$P192TMP/check-rt.js" <<'P192JS'
// checker P192: <lawFile> <evalIdsCsv> <cardHtml...>
// Rut nhan tu dong «Trả lời mẫu» cua tung the, doi chieu SLOTS (2 huong).
// Nhan bien thien: Ngoài-<số> theo khuon so; <mã eval> doi chieu id THAT cua
// fixture (KHONG regex rong — Ngoài-1 khong duoc chui qua lop ma-eval).
const fs = require("fs");
const die = m => { console.error("P192 LOI: " + m); process.exit(1); };
const [law, idsCsv, ...cards] = process.argv.slice(2);
const evalIds = idsCsv.split(",").filter(Boolean);
const src = fs.readFileSync(law, "utf8");
const m0 = src.match(/<!-- <<<GATE-ONESHOT-SLOTS -->\n([\s\S]*?)\n<!-- GATE-ONESHOT-SLOTS>>> -->/);
if (!m0) die("thieu khoi GATE-ONESHOT-SLOTS");
const rows = m0[1].split("\n").map(l => l.trim()).filter(l => /^(g1|g2|extra) /.test(l))
  .map(l => ({ gate: l.split(" ")[0], label: l.slice(l.indexOf(" ") + 1) }));
const fixed = rows.filter(r => r.gate !== "extra" && !r.label.includes("<"));
const hasNgoai = rows.some(r => r.gate !== "extra" && r.label === "Ngoài-<số>");
const hasEval = rows.some(r => r.gate !== "extra" && r.label === "<mã eval>");
const seen = { fixed: new Set(), ngoai: 0, evalid: 0 };
let g1n = 0, g2n = 0;
for (const c of cards) {
  const html = fs.readFileSync(c, "utf8");
  const m = html.match(/Trả lời mẫu \(một dòng, điền vào chỗ trống\): «([^»]*)»/);
  if (!m) die("the khong co dong Tra-loi-mau: " + c);
  const labels = m[1].split(";").map(s => s.trim()).map(s => s.replace(/:\s*___\s*$/, "")).filter(Boolean);
  for (const lb of labels) {
    if (fixed.some(r => r.label === lb)) seen.fixed.add(lb);
    else if (hasNgoai && /^Ngoài-\d+$/.test(lb)) seen.ngoai++;
    else if (hasEval && evalIds.includes(lb)) seen.evalid++;
    else die("nhan khong khop SLOTS: " + lb + " (the " + c + ")");
    if (c.includes("g1")) g1n++; else g2n++;
  }
}
for (const r of rows.filter(r => r.gate !== "extra")) {
  const ok = r.label === "Ngoài-<số>" ? seen.ngoai > 0
    : r.label === "<mã eval>" ? seen.evalid > 0
    : seen.fixed.has(r.label);
  if (!ok) die("nhan SLOTS khong fixture nao render: " + r.gate + " " + r.label);
}
console.log("ONESHOT-RT: g1=" + g1n + " g2=" + g2n + " nhan khop du");
console.log("ONESHOT-RT-NGUOC: moi dong SLOTS co fixture render");
P192JS
P192WS1="$(mktemp -d)"; vca_scenario gate1-draft "$P192WS1" || { echo "     dung fixture g1 that bai"; P192OK=0; }
P192WS2="$(mktemp -d)"; vca_scenario gate2-4loai "$P192WS2" || { echo "     dung fixture g2 that bai"; P192OK=0; }
node "$ROOT/scripts/gate-card.js" --root "$P192WS1" --slug fx --gate 1 > "$P192TMP/card-g1.html" 2>/dev/null \
  || { echo "     render the g1 that bai"; P192OK=0; }
node "$ROOT/scripts/gate-card.js" --root "$P192WS2" --slug fx --gate 2 > "$P192TMP/card-g2.html" 2>/dev/null \
  || { echo "     render the g2 that bai"; P192OK=0; }
grep -qF 'Trả lời mẫu' "$P192TMP/card-g1.html" && grep -qF 'Trả lời mẫu' "$P192TMP/card-g2.html" \
  || { echo "     the render thieu dong Tra-loi-mau — fixture/renderer hong"; P192OK=0; }
# doi chung DUONG truoc moi dot bien
if node "$P192TMP/check-rt.js" "$ONESHOT_LAW" "E9" "$P192TMP/card-g1.html" "$P192TMP/card-g2.html"; then :; else { echo "     doi chung duong DO oan"; P192OK=0; }; fi
# MUTANT-A: go nhan co dinh «Treo» khoi ban sao SLOTS -> do dich danh
grep -v '^g2 Treo$' "$ONESHOT_LAW" > "$P192TMP/law-mutA.md"
if cmp -s "$ONESHOT_LAW" "$P192TMP/law-mutA.md"; then echo "     MUTANT-A khong tac dung (SLOTS chua co dong g2 Treo?)"; P192OK=0; else echo "     MUTANT-A: da go dong 'g2 Treo' khoi ban sao SLOTS"; fi
P192AERR="$(node "$P192TMP/check-rt.js" "$P192TMP/law-mutA.md" "E9" "$P192TMP/card-g1.html" "$P192TMP/card-g2.html" 2>&1)"; P192AST=$?
if [ "$P192AST" -ne 0 ] && printf '%s' "$P192AERR" | grep -q "nhan khong khop SLOTS: Treo"; then
  echo "     MUTANT-A DO dung — nhan the day ma ngu phap khong khai: Treo"
else
  echo "     PHEP DO MU: MUTANT-A khong do hoac sai nhan: $P192AERR"; P192OK=0
fi
# MUTANT-B: tiem nhan la vao dung dong Tra-loi-mau cua HTML da render -> do
sed 's/điền vào chỗ trống): «/điền vào chỗ trống): «lạ-oneshot: ___; /' "$P192TMP/card-g2.html" > "$P192TMP/card-g2-mutB.html"
if cmp -s "$P192TMP/card-g2.html" "$P192TMP/card-g2-mutB.html"; then echo "     MUTANT-B khong tac dung"; P192OK=0; else echo "     MUTANT-B: da tiem nhan 'lạ-oneshot' vao dong Tra-loi-mau cua the g2"; fi
P192BERR="$(node "$P192TMP/check-rt.js" "$ONESHOT_LAW" "E9" "$P192TMP/card-g1.html" "$P192TMP/card-g2-mutB.html" 2>&1)"; P192BST=$?
if [ "$P192BST" -ne 0 ] && printf '%s' "$P192BERR" | grep -q "nhan khong khop SLOTS: lạ-oneshot"; then
  echo "     MUTANT-B DO dung — nhan la ngoai ngu phap: lạ-oneshot"
else
  echo "     PHEP DO MU: MUTANT-B khong do hoac sai nhan: $P192BERR"; P192OK=0
fi
# MUTANT-C: go dong Ngoài-<số> khoi ban sao SLOTS -> Ngoài-1 KHONG duoc chui
# qua lop <mã eval> (checker doi chieu id that, khong regex rong)
grep -v '^g2 Ngoài-<số>$' "$ONESHOT_LAW" > "$P192TMP/law-mutC.md"
if cmp -s "$ONESHOT_LAW" "$P192TMP/law-mutC.md"; then echo "     MUTANT-C khong tac dung"; P192OK=0; else echo "     MUTANT-C: da go dong 'g2 Ngoài-<số>' khoi ban sao SLOTS"; fi
P192CERR="$(node "$P192TMP/check-rt.js" "$P192TMP/law-mutC.md" "E9" "$P192TMP/card-g1.html" "$P192TMP/card-g2.html" 2>&1)"; P192CST=$?
if [ "$P192CST" -ne 0 ] && printf '%s' "$P192CERR" | grep -q "nhan khong khop SLOTS: Ngoài-1"; then
  echo "     SANITY-KHONG-NUOT: Ngoai-1 khong chui qua lop ma-eval"
else
  echo "     PHEP DO MU: MUTANT-C — Ngoai-1 chui lot hoac sai nhan: $P192CERR"; P192OK=0
fi
# MUTANT-H (leg NGUOC): them dong nhan chet vao ban sao SLOTS -> do dich danh
sed 's/^g2 ký hay trả$/g2 ký hay trả\ng2 nhãn-chết-oneshot/' "$ONESHOT_LAW" > "$P192TMP/law-mutH.md"
if grep -q '^g2 nhãn-chết-oneshot$' "$P192TMP/law-mutH.md"; then echo "     MUTANT-H: da them dong nhan chet vao ban sao SLOTS"; else echo "     MUTANT-H khong tac dung"; P192OK=0; fi
P192HERR="$(node "$P192TMP/check-rt.js" "$P192TMP/law-mutH.md" "E9" "$P192TMP/card-g1.html" "$P192TMP/card-g2.html" 2>&1)"; P192HST=$?
if [ "$P192HST" -ne 0 ] && printf '%s' "$P192HERR" | grep -q "nhan SLOTS khong fixture nao render: g2 nhãn-chết-oneshot"; then
  echo "     MUTANT-H DO dung — nhan SLOTS khong fixture nao render"
else
  echo "     PHEP DO MU: MUTANT-H khong do hoac sai nhan: $P192HERR"; P192OK=0
fi
rm -rf "$P192TMP" "$P192WS1" "$P192WS2"
if [ "$P192OK" -eq 1 ]; then pass "P192 round-trip the->SLOTS hai huong (4 chieu do: go-nhan, tiem-nhan-la, khong-nuot-lop, nhan-chet)"; else fail "P192 round-trip the->SLOTS hai huong (4 chieu do: go-nhan, tiem-nhan-la, khong-nuot-lop, nhan-chet)"; fi

run "P193 dieu khoan mot-luot-go: 6 site nguon khop tung ky tu + quan he per-site (E3/E4 mot-luot-go)" \
  python3 - "$ROOT" <<'P193PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
law_p = "skills/acceptance/references/human-facing-language.md"
law = (root / law_p).read_text(encoding="utf-8")
def block(name, text):
    m = re.search(r"<!-- <<<" + name + r" -->\n([\s\S]*?)\n<!-- " + name + r">>> -->", text)
    assert m, law_p + ": KHONG rut duoc " + name + " qua marker"
    return m.group(1)
clause = block("GATE-ONESHOT-CLAUSE", law).strip()
assert clause and "\n" not in clause, "clause phai la MOT dong khong rong"
# AC-4: hai cau neo phai nam TRONG dieu khoan (khong-mo-duong-may + ket-khoi)
assert "câu gộp là câu NGƯỜI gõ" in clause, "clause thieu cau neo khong-mo-duong-may"
assert "Đầu ra theo bản luật ngôn ngữ mặt người." in clause, "clause thieu cau neo dau-ra-theo-ban-luat"
def doc_manifest(law_text):
    decl = {}
    for line in block("GATE-ONESHOT-SITES", law_text).splitlines():
        toks = line.split()
        if not toks:
            continue
        assert toks[0].endswith(".md"), "dong manifest la: " + repr(line)
        assert len(toks) == 2 and toks[1].isdigit(), "site thieu so ban: " + toks[0]
        decl[toks[0]] = int(toks[1])
    return decl
DECL = doc_manifest(law)
SITES = list(DECL)
# 12 -> 6: sau khi luu kho harness Codex, sau than lenh chi con MOT ban moi.
# Van la dang thuc (khong phai san): them/bot mot cho mot-luot-go la quyet dinh
# nguoi, phai sua so nay cung luot.
assert len(SITES) == 6, "manifest phai khai dung 6 site nguon, thay " + str(len(SITES))
# Khong con ban suy ra (ban dung/overlay da luu kho): phep so chay tren SITE NGUON.
ALL = list(SITES)
texts = {rel: (root / rel).read_text(encoding="utf-8") for rel in ALL}
# ---- quan he per-site (chay TRUOC phep so clause de mutant --repo do dich danh)
rows = [l.strip() for l in block("GATE-ONESHOT-SLOTS", law).splitlines() if re.match(r"^(g1|g2|extra) ", l.strip())]
g1_labels = [r[3:] for r in rows if r.startswith("g1 ")]
g2_labels = [r[3:] for r in rows if r.startswith("g2 ")]
assert g1_labels and g2_labels, "SLOTS rong — P191 phai do truoc, day la doi chung"
def check_bodies(mapping):
    errs = []
    for rel, t in mapping.items():
        if "--repo" not in t:
            errs.append("site thieu needle --repo: " + rel)
        if "GATE-ONESHOT-GRAMMAR" not in t:
            errs.append("site thieu con tro GATE-ONESHOT-GRAMMAR: " + rel)
        name = rel.replace("SKILL.md", "").replace(".md", "")
        if "approve" in name:
            for lb in g1_labels:
                if lb not in t:
                    errs.append("than approve thieu nhan: " + lb + " (" + rel + ")")
        if "signoff" in name:
            for lb in g2_labels:
                if lb not in t:
                    errs.append("than signoff thieu nhan: " + lb + " (" + rel + ")")
        if name.rstrip("/").endswith("start"):
            if "chọn-trước bằng slug" not in t:
                errs.append("than start thieu dang chon-truoc slug: " + rel)
    return errs
assert check_bodies(texts) == [], "quan he per-site do oan tren cay that: " + repr(check_bodies(texts))
print("ONESHOT-BODY: approve g1 du, signoff g2 du, start slug OK")
# ---- so clause nguyen van tung ky tu + dem dung so khai
ANCHOR = " ".join(clause.split(" ")[:3])
def occurrences(t):
    out, i = [], t.find(ANCHOR)
    while i >= 0:
        out.append(i)
        i = t.find(ANCHOR, i + 1)
    return out
def lech(mapping):
    bad = []
    for rel, t in mapping.items():
        for i in occurrences(t):
            if t[i:i + len(clause)] != clause:
                bad.append(rel + " @" + str(i))
                break
    return bad
def sai_so(mapping):
    bad = []
    for s in SITES:
        n = len(occurrences(mapping[s]))
        if n != DECL[s]:
            bad.append("clause lech tai " + s + ": thay " + str(n) + " ban, khai " + str(DECL[s]))
    return bad
assert lech(texts) == [], "ban that lech nguyen van: " + repr(lech(texts))
assert sai_so(texts) == [], "ban that sai so ban: " + repr(sai_so(texts))
print("ONESHOT-SITES: 12 nguon (+6 suy ra)")
# ---- 4 chieu do, moi chieu qua CHINH cac ham that o tren
# MUTANT-D: dong manifest thieu so -> parser fail-loud dich danh
law_mutD = law.replace("commands/approve.md 1", "commands/approve.md", 1)
assert law_mutD != law, "MUTANT-D khong tac dung"
print("MUTANT-D: da xoa so ban khoi dong manifest commands/approve.md")
try:
    doc_manifest(law_mutD)
    raise SystemExit("MUTANT-D khong bi bat — manifest thieu so ma parser im")
except AssertionError as e:
    assert "site thieu so ban" in str(e), "MUTANT-D sai thong diep: " + str(e)
print("     MUTANT-D DO dung: site thieu so ban (fail-loud, khong default)")
# MUTANT-E: mangle MOT ky tu cua clause trong MOT ban chep -> lech dich danh
mutE = dict(texts)
victimE = "commands/signoff.md"
mutE[victimE] = mutE[victimE].replace("câu NGƯỜI gõ", "câu NGUOI gõ", 1)
assert mutE[victimE] != texts[victimE], "MUTANT-E khong tac dung"
print("MUTANT-E: da mangle 1 ky tu clause trong ban sao " + victimE)
bads = lech(mutE)
assert bads and any(victimE in b for b in bads), "MUTANT-E khong bi bat dich danh: " + repr(bads)
print("     MUTANT-E DO dich danh file: " + bads[0])
# MUTANT-F: go needle --repo khoi MOT ban sao -> quan he per-site do dich danh
mutF = dict(texts)
victimF = "commands/acceptance-status.md"
mutF[victimF] = mutF[victimF].replace("--repo", "--rep0")
assert mutF[victimF] != texts[victimF], "MUTANT-F khong tac dung"
print("MUTANT-F: da go needle --repo khoi ban sao " + victimF)
badsF = check_bodies(mutF)
assert any(("site thieu needle --repo: " + victimF) == b for b in badsF), "MUTANT-F khong bi bat dich danh: " + repr(badsF)
print("     MUTANT-F DO dich danh: site thieu needle --repo: " + victimF)
# MUTANT-G: xoa nhan «Treo» khoi ban sao than signoff -> do dich danh nhan
mutG = dict(texts)
victimG = "commands/signoff.md"
mutG[victimG] = mutG[victimG].replace("Treo", "Txeo")
assert mutG[victimG] != texts[victimG], "MUTANT-G khong tac dung"
print("MUTANT-G: da xoa nhan Treo khoi ban sao " + victimG)
badsG = check_bodies(mutG)
assert any(b.startswith("than signoff thieu nhan: Treo") for b in badsG), "MUTANT-G khong bi bat: " + repr(badsG)
print("     MUTANT-G DO dung: than signoff thieu nhan: Treo")
print("P193 OK (12 nguon + 6 suy ra khop tung ky tu; quan he per-site --repo + con tro grammar + SLOTS->than-lenh; 4 chieu do: manifest-thieu-so, clause-lech-1-ky-tu, thieu---repo, than-thieu-nhan — tat ca in xac-nhan-dot-bien va di qua chinh checker that)")
P193PY

# ── P194: may-ganh-nguoi-quyet (chip 3b kit 2.1) — hai nguyen tac
# «nguoi chi khai dieu chi nguoi biet» + «khuyen nghi truoc, hoi mo la duong
# cung». Vat: khoi GRAMMAR (neo moi) + 6 than lenh co-cau-hoi (2 harness).
# 5 chieu do, moi mutant
# la ban sao in-memory di qua CHINH cac ham check that + in xac-nhan-dot-bien.
run "P194 hai nguyen tac may-ganh-nguoi-quyet: neo grammar + 6 than lenh + truong ghi (E1/E2/E3 may-ganh-nguoi-quyet)" \
  python3 - "$ROOT" <<'P194PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
law_p = "skills/acceptance/references/human-facing-language.md"
law = (root / law_p).read_text(encoding="utf-8")
def grammar_of(law_text):
    m = re.search(r"<!-- <<<GATE-ONESHOT-GRAMMAR -->\n([\s\S]*?)\n<!-- GATE-ONESHOT-GRAMMAR>>> -->", law_text)
    assert m, law_p + ": KHONG rut duoc GATE-ONESHOT-GRAMMAR qua marker"
    return m.group(1)
NEO = [
    ("voi-danh-tinh", "với danh tính:"),
    ("nguon-suy", "(từ <nguồn suy>)"),
    ("enter-xac-nhan", "Enter xác nhận"),
    ("bac-git-config", "git config user.name"),
    ("tuong-thich-cu", "vẫn chạy nguyên"),
    ("khong-ghi-phut", "KHÔNG hỏi và KHÔNG ghi số phút"),
    ("phut-duoc-bo-qua", "ĐƯỢC CHẤP NHẬN và BỎ QUA lặng"),
    ("ho-so-mot-ung-vien", "đúng MỘT ứng viên"),
    ("cach-hieu-kha-di", "cách hiểu khả dĩ nhất"),
    ("hoi-mo-duong-cung", "hỏi mở"),
    ("ca-mau-khong-cat", "không cắt"),
    ("phat-ngon-cuoi", "PHÁT NGÔN CUỐI"),
    # Lo do hoi dong E7 bat (4 vong doc lap, S4-r1+r2): bac thang mo ta bang
    # "khi config trong" khien nhanh canh-bao-lech thanh BAT KHA THI. Chua
    # bang cach TACH BON LUAT — doc / chon / canh-bao / can — de menh de dieu
    # kien khong con doc luot duoc thanh guard cho ca viec DOC.
    ("doc-khong-bi-chan", "không có điều kiện nào chặn việc đọc"),
    ("canh-bao-ngoai-danh-sach", "KHÔNG có trong `signoff.approvers`"),
    ("bac-thang-can", "**CẠN**"),
    ("ngay-o-ky", "«Ký» vắng ngày → ngày lệnh chạy"),
]
# Neo ÂM: chuoi PHAI VANG. Loi hua loi cua chip la GO mot cau hoi — assert
# "chuoi phai co mat" khong bao gio bat duoc viec cau hoi cu quay lai
# (gap-probe P0, S4 r3: chen lai dong "Ask how many minutes" thi moi neo duong
# van du). Cap doi: neo duong ("khong hoi phut") + neo am duoi day.
NEO_AM = [
    ("hoi-phut-quay-lai", "how many minutes"),
    ("hoi-lai-phan-la-cu", "hỏi lại đúng phần đó"),
    ("follow-up-cu", "follow-up DUY NHẤT"),
]
def check_grammar(law_text):
    g = grammar_of(law_text)
    errs = []
    for tag, s in NEO:
        if s not in g:
            errs.append("GRAMMAR thieu neo " + tag + " (neo: " + s + ")")
    for tag, s in NEO_AM:
        if s in g:
            errs.append("GRAMMAR mang lai luat cu " + tag + " (neo am: " + s + ")")
    return errs
# ---- 3 than lenh co-cau-hoi
SITES = {
    "approve": ["commands/approve.md"],
    "signoff": ["commands/signoff.md"],
    "start": ["commands/start.md"],
}
texts = {rel: (root / rel).read_text(encoding="utf-8") for rels in SITES.values() for rel in rels}
GATE_NEEDLES = [
    ("khuon voi-danh-tinh", "với danh tính:"),
    ("khuon nguon-suy", "(từ <nguồn suy>)"),
    ("khuon Enter-xac-nhan", "Enter xác nhận"),
    ("needle --as", "--as"),
    ("ho-so-mot-ung-vien", "đúng MỘT ứng viên"),
]
FIELDS = {
    "approve": ["approved_by", "approved_at"],
    "signoff": ["human_override", "human_signoff", "status: signed-off"],
}
# Luat DOC-khong-bi-chan + nhanh CAN phai co trong than lenh. Hai needle mot
# luat: doc-khong-bi-chan (lo hoi dong bat) va nhanh can (lo "bac thang het nac
# thi lam gi" — file cu khong noi).
CROSSCHECK = {"commands/": ["không điều kiện nào chặn việc đọc", "**CẠN**", "**CHỌN**",
                            "không có trong `signoff.approvers`"]}
# Neo AM per-site: cau hoi cu KHONG duoc quay lai trong bat ky than lenh nao.
BODY_AM = [("hoi-phut-quay-lai", "how many minutes"),
           ("hoi-phut-viet", "Ask how many minutes"),
           ("follow-up-cu", "follow-up DUY NHẤT")]
def check_bodies(mapping):
    errs = []
    for role, rels in SITES.items():
        for rel in rels:
            t = mapping[rel]
            if "GATE-ONESHOT-GRAMMAR" not in t:
                errs.append("site thieu con tro GATE-ONESHOT-GRAMMAR: " + rel)
            if role in ("approve", "signoff"):
                for tag, s in GATE_NEEDLES:
                    if s not in t:
                        errs.append("site thieu " + tag + ": " + rel)
                needs = next(v for k, v in CROSSCHECK.items() if rel.startswith(k))
                if needs[0] not in t:
                    errs.append("site thieu luat doc-khong-bi-chan: " + rel)
                if needs[1] not in t:
                    errs.append("site thieu nhanh bac-thang-can: " + rel)
                # MOT-BAN-CHEP: bac thang chi duoc khai DUNG MOT lan trong moi
                # than lenh. Lo that (hoi dong E7 vong 6): than co HAI ban chep
                # (dau file + buoc ghi) nen moi lan va chi trung mot ban, hai
                # ban troi khoi nhau — ca 5 finding vong 6 deu cung lop nay.
                n = t.count(needs[2])
                if n != 1:
                    errs.append("bac thang khai " + str(n) + " lan (phai dung 1): " + rel)
                if needs[3] not in t:
                    errs.append("site thieu nhanh canh-bao-ngoai-danh-sach: " + rel)
                # THU TU bac thang: git config PHAI dung TRUOC signoff.approvers
                # (d-20008 loai phuong an nguoc — doi vi tri thi may ky ten lead
                # trong khi nguoi go la teammate; khong ghim thu tu thi hoan vi
                # ve dung phuong an DA LOAI ma thuoc van xanh — gap-probe P1)
                ig, ia = t.find("git config user.name"), t.find("signoff.approvers")
                if ig < 0 or ia < 0 or ig > ia:
                    errs.append("thu tu bac thang sai (git config phai truoc approvers): " + rel)
            for tag, s in BODY_AM:
                if s in t:
                    errs.append("than mang lai luat cu " + tag + ": " + rel)
            if role == "signoff":
                if "không cắt" not in t:
                    errs.append("than signoff thieu ca mau khong-cat: " + rel)
                # ADR 0012 (16/08): chan "than signoff phai chua require_human_commit"
                # DA GO — khoa do het hieu luc. Thay bang chan noi ve vat con
                # song: provenance lay tu forge.
                if "forge" not in t:
                    errs.append("than signoff thieu cau provenance-o-forge: " + rel)
            if role == "start":
                if "chọn-trước bằng slug" not in t:
                    errs.append("than start thieu dang chon-truoc slug: " + rel)
                if "nhóm đã khớp" not in t:
                    errs.append("than start thieu hien-thi-lai nhom khop: " + rel)
            for f in FIELDS.get(role, []):
                if f not in t:
                    errs.append("than " + role + " thieu truong ghi: " + f + " (" + rel + ")")
    # MOI LOI qua chot: cau hoi phut khong duoc song o BAT KY duong nao dan
    # toi cung truong ghi. Ngoai 6 than lenh, skill acceptance (2 harness) cung
    # day buoc Cong 1 — no van hoi phut trong khi 6 lenh da thoi (bat boi
    # baseline 2 chieu, S4-r3). Ca init la NGOAI pham vi va khac nghia
    # (baseline_minutes cua repo, khong phai phut cua mot cong) — khong dinh.
    for rel in ("skills/acceptance/SKILL.md",):
        p = root / rel
        if not p.is_file():
            errs.append("thieu file duong-khac: " + rel)
            continue
        s = p.read_text(encoding="utf-8")
        if "how many minutes" in s:
            errs.append("duong khac van hoi phut: " + rel)
    return errs
# ---- doi chung DUONG tren cay that, TRUOC moi dot bien
assert check_grammar(law) == [], "grammar do oan tren cay that: " + repr(check_grammar(law))
print("MAY-GANH-GRAMMAR: " + str(len(NEO)) + " neo du")
assert check_bodies(texts) == [], "than lenh do oan tren cay that: " + repr(check_bodies(texts))
print("MAY-GANH-BODY: approve du, signoff du, start du")
print("MAY-GANH-COMPAT: truong ghi du, require_human_commit nguyen")
# ---- 5 chieu do, moi chieu qua CHINH cac ham that o tren
# MUT-1 (E1): go neo PHAT NGON CUOI khoi ban sao ban luat -> do dich danh
law_m1 = law.replace("PHÁT NGÔN CUỐI", "PHAT-NGON-CUOI-DA-GO")
assert law_m1 != law, "MUT-1 khong tac dung"
print("MUT-1: da go neo PHAT NGON CUOI khoi ban sao ban luat")
e1 = check_grammar(law_m1)
assert any("GRAMMAR thieu neo phat-ngon-cuoi" in x for x in e1), "MUT-1 khong bi bat: " + repr(e1)
print("     MUT-1 DO dung: GRAMMAR thieu neo phat-ngon-cuoi")
# MUT-2 (E2): go khuon «voi danh tinh:» khoi ban sao commands/approve.md
m2 = dict(texts); v2 = "commands/approve.md"
m2[v2] = m2[v2].replace("với danh tính:", "voi danh tinh:")
assert m2[v2] != texts[v2], "MUT-2 khong tac dung"
print("MUT-2: da go khuon voi-danh-tinh khoi ban sao " + v2)
e2 = check_bodies(m2)
assert ("site thieu khuon voi-danh-tinh: " + v2) in e2, "MUT-2 khong bi bat dich danh: " + repr(e2)
print("     MUT-2 DO dich danh: site thieu khuon voi-danh-tinh: " + v2)
# MUT-3 (E2): go needle --as khoi ban sao signoff
m3 = dict(texts); v3 = "commands/signoff.md"
m3[v3] = m3[v3].replace("--as", "--a_s")
assert m3[v3] != texts[v3], "MUT-3 khong tac dung"
print("MUT-3: da go needle --as khoi ban sao " + v3)
e3 = check_bodies(m3)
assert ("site thieu needle --as: " + v3) in e3, "MUT-3 khong bi bat dich danh: " + repr(e3)
print("     MUT-3 DO dich danh: site thieu needle --as: " + v3)
# MUT-4 (E2): go ca mau «khong cat» khoi ban sao commands/signoff.md
m4 = dict(texts); v4 = "commands/signoff.md"
m4[v4] = m4[v4].replace("không cắt", "khong-cat-da-go")
assert m4[v4] != texts[v4], "MUT-4 khong tac dung"
print("MUT-4: da go ca mau khong-cat khoi ban sao " + v4)
e4 = check_bodies(m4)
assert ("than signoff thieu ca mau khong-cat: " + v4) in e4, "MUT-4 khong bi bat dich danh: " + repr(e4)
print("     MUT-4 DO dich danh: than signoff thieu ca mau khong-cat: " + v4)
# MUT-5 (E3): doi human_signoff -> human_sign0ff trong ban sao commands/signoff.md
m5 = dict(texts); v5 = "commands/signoff.md"
m5[v5] = m5[v5].replace("human_signoff", "human_sign0ff")
assert m5[v5] != texts[v5], "MUT-5 khong tac dung"
print("MUT-5: da doi human_signoff -> human_sign0ff trong ban sao " + v5)
e5 = check_bodies(m5)
assert any(x.startswith("than signoff thieu truong ghi: human_signoff") for x in e5), "MUT-5 khong bi bat: " + repr(e5)
print("     MUT-5 DO dung: than signoff thieu truong ghi: human_signoff")
# MUT-6 (E2 do-d): go phan nguon-suy khoi ban sao approve -> do dich danh
# (khuon thieu xuat xu = sai-ten-am-tham tren may dung chung — yeu cau phien B)
m6 = dict(texts); v6 = "commands/approve.md"
m6[v6] = m6[v6].replace("(từ <nguồn suy>)", "")
assert m6[v6] != texts[v6], "MUT-6 khong tac dung"
print("MUT-6: da go phan nguon-suy (tu <nguon suy>) khoi ban sao " + v6)
e6 = check_bodies(m6)
assert ("site thieu khuon nguon-suy: " + v6) in e6, "MUT-6 khong bi bat dich danh: " + repr(e6)
print("     MUT-6 DO dich danh: site thieu khuon nguon-suy: " + v6)
# MUT-7 (lo hoi dong E7 bat o S4-r1): go luat doc-de-doi-chieu khoi ban sao
# than signoff Claude -> do dich danh (bac thang mo ta chan-doc lam nhanh
# canh-bao-lech thanh bat kha thi — hai vong judge doc lap cung neu)
m7 = dict(texts); v7 = "commands/signoff.md"
m7[v7] = m7[v7].replace("không điều kiện nào chặn việc đọc", "doc-co-dieu-kien-chan")
assert m7[v7] != texts[v7], "MUT-7 khong tac dung"
print("MUT-7: da go luat doc-khong-bi-chan khoi ban sao " + v7)
e7 = check_bodies(m7)
assert ("site thieu luat doc-khong-bi-chan: " + v7) in e7, "MUT-7 khong bi bat dich danh: " + repr(e7)
print("     MUT-7 DO dich danh: site thieu luat doc-khong-bi-chan: " + v7)
# MUT-8: go nhanh CAN khoi ban sao than approve -> do dich danh
# (lo "bac thang het nac thi lam gi" — hoi dong E7 vong 3 neu, file cu im)
m8 = dict(texts); v8 = "commands/approve.md"
m8[v8] = m8[v8].replace("**CẠN**", "CAN-da-go")
assert m8[v8] != texts[v8], "MUT-8 khong tac dung"
print("MUT-8: da go nhanh bac-thang-can khoi ban sao " + v8)
e8 = check_bodies(m8)
assert ("site thieu nhanh bac-thang-can: " + v8) in e8, "MUT-8 khong bi bat dich danh: " + repr(e8)
print("     MUT-8 DO dich danh: site thieu nhanh bac-thang-can: " + v8)
# MUT-9: chep bac thang lan HAI vao ban sao than approve -> do dich danh
# (chinh lop da de ra ca 5 finding cua hoi dong E7 vong 6: hai ban chep troi
# khoi nhau, moi lan va chi trung mot ban)
m9 = dict(texts); v9 = "commands/approve.md"
i9 = m9[v9].index("**CHỌN**")
m9[v9] = m9[v9][:i9] + "**CHỌN** (bản chép thừa)\n" + m9[v9][i9:]
assert m9[v9].count("**CHỌN**") == 2, "MUT-9 khong tac dung"
print("MUT-9: da chep bac thang lan HAI vao ban sao " + v9)
e9 = check_bodies(m9)
assert ("bac thang khai 2 lan (phai dung 1): " + v9) in e9, "MUT-9 khong bi bat: " + repr(e9)
print("     MUT-9 DO dich danh: bac thang khai 2 lan (phai dung 1): " + v9)
# MUT-10 (gap-probe P0 — NEO AM): chen LAI cau hoi phut cu vao ban sao than
# approve. Moi neo duong van du -> khong neo am thi thuoc im, lenh lai hoi phut
m10 = dict(texts); v10 = "commands/approve.md"
m10[v10] = m10[v10].replace("- `sửa: <điều cần đổi>`", "- Ask how many minutes Gate 1 took.\n- `sửa: <điều cần đổi>`", 1)
assert m10[v10] != texts[v10], "MUT-10 khong tac dung"
print("MUT-10: da chen LAI cau hoi phut cu vao ban sao " + v10)
e10 = check_bodies(m10)
assert any(x.startswith("than mang lai luat cu hoi-phut-quay-lai") for x in e10), "MUT-10 khong bi bat: " + repr(e10)
print("     MUT-10 DO dung: than mang lai luat cu hoi-phut-quay-lai")
# MUT-11 (gap-probe P1): hoan vi bac thang ve PHUONG AN DA LOAI (approvers
# truoc git config) -> thu tu khong ghim thi mutant nay xanh
m11 = dict(texts); v11 = "commands/signoff.md"
i_g = m11[v11].find("git config user.name"); i_a = m11[v11].find("signoff.approvers")
assert 0 <= i_a < i_g or i_g < i_a, "MUT-11 fixture bat thuong"
m11[v11] = m11[v11][:i_g] + "signoff.approvers" + m11[v11][i_g + len("git config user.name"):]
m11[v11] = "signoff.approvers\n" + m11[v11].replace("signoff.approvers", "git config user.name", 1)
print("MUT-11: da hoan vi bac thang (approvers truoc git config) trong ban sao " + v11)
e11 = check_bodies(m11)
assert any(x.startswith("thu tu bac thang sai") and v11 in x for x in e11), "MUT-11 khong bi bat: " + repr(e11)
print("     MUT-11 DO dung: thu tu bac thang sai (git config phai truoc approvers)")
# MUT-12 (gap-probe P1): go nhanh CANH BAO khoi ban sao than approve
m12 = dict(texts); v12 = "commands/approve.md"
m12[v12] = m12[v12].replace("không có trong `signoff.approvers`", "khong co trong danh sach")
assert m12[v12] != texts[v12], "MUT-12 khong tac dung"
print("MUT-12: da go nhanh canh-bao-ngoai-danh-sach khoi ban sao " + v12)
e12 = check_bodies(m12)
assert ("site thieu nhanh canh-bao-ngoai-danh-sach: " + v12) in e12, "MUT-12 khong bi bat: " + repr(e12)
print("     MUT-12 DO dich danh: site thieu nhanh canh-bao-ngoai-danh-sach: " + v12)
# MUT-13 (gap-probe P2): role start chua co mutant nao -> chung minh nhanh
# `if role == "start"` that su chay
m13 = dict(texts); v13 = "commands/start.md"
m13[v13] = m13[v13].replace("nhóm đã khớp", "nhom-da-khop-da-go")
assert m13[v13] != texts[v13], "MUT-13 khong tac dung"
print("MUT-13: da go hien-thi-lai nhom khop khoi ban sao " + v13)
e13 = check_bodies(m13)
assert ("than start thieu hien-thi-lai nhom khop: " + v13) in e13, "MUT-13 khong bi bat: " + repr(e13)
print("     MUT-13 DO dich danh: than start thieu hien-thi-lai nhom khop: " + v13)
# MUT-14 (gap-probe P1): go neo NGAY o Ky khoi ban sao ban luat
law_m14 = law.replace("«Ký» vắng ngày → ngày lệnh chạy", "«Ký» vang ngay thi tuy")
assert law_m14 != law, "MUT-14 khong tac dung"
print("MUT-14: da go neo ngay-o-ky khoi ban sao ban luat")
e14 = check_grammar(law_m14)
assert any("GRAMMAR thieu neo ngay-o-ky" in x for x in e14), "MUT-14 khong bi bat: " + repr(e14)
print("     MUT-14 DO dung: GRAMMAR thieu neo ngay-o-ky")
# MUT-15 (lop MOI-LOI-QUA-CHOT): duong khac (skill acceptance) hoi lai phut.
# Mutant nay khong sua duoc bang dict `texts` — no doc file that, nen dung
# monkeypatch chinh ham doc de chung minh nhanh do co chay.
import builtins as _b
_orig_read = type(root).read_text
def _fake_read(self, *a, **k):
    s = _orig_read(self, *a, **k)
    if self.name == "SKILL.md" and "skills/acceptance/SKILL.md" in str(self):
        s = s + "\n   ask the user how many minutes Gate 1 took.\n"
    return s
type(root).read_text = _fake_read
print("MUT-15: da chen LAI cau hoi phut vao duong khac (skills/acceptance/SKILL.md, ban doc gia lap)")
e15 = check_bodies(texts)
type(root).read_text = _orig_read
assert any(x == "duong khac van hoi phut: skills/acceptance/SKILL.md" for x in e15), "MUT-15 khong bi bat: " + repr(e15)
print("     MUT-15 DO dich danh: duong khac van hoi phut: skills/acceptance/SKILL.md")
# So chieu do SUY tu chinh danh sach mutant da chay (lop tong-ket-khong-kem-
# so-ca: in literal thi them/bot mutant ma dong tong ket van in so cu).
MUTS = ["neo-grammar", "khuon-danh-tinh", "needle--as", "ca-mau-khong-cat",
        "truong-ghi", "khuon-nguon-suy", "doc-khong-bi-chan", "bac-thang-can",
        "bac-thang-2-ban-chep", "neo-am-hoi-phut", "thu-tu-bac-thang",
        "canh-bao-ngoai-danh-sach", "than-start", "neo-ngay-o-ky",
        "duong-khac-hoi-phut"]
print("P194 OK (" + str(len(NEO)) + " neo duong + " + str(len(NEO_AM)) + " neo am grammar + 6 than lenh per-site + truong ghi + doc/can/mot-ban-chep/canh-bao/thu-tu 2 harness; " + str(len(MUTS)) + " chieu do: " + ", ".join(MUTS) + " — tat ca in xac-nhan-dot-bien va di qua chinh checker that)")
P194PY

# ── P196: plugin diagram-design — goi vendor co pin, khong sua tay, skin KHONG nam trong goi ──
# Ho so release-2-1-0. Ba lop: (a) layout + manifest plugin (MIT, semver, skill
# dung cho, 2 lenh, marketplace co entry); (b) tree-hash tinh lai == NOTICE, va
# hash doi ma version plugin khong doi so voi origin/main la DO; (c) marker
# skin trong goi phai la `default` (skin song trong REPO), khong symlink trong
# goi. Chieu do chay qua CHINH tree-hash.sh + chinh doan kiem tren ban sao.
P196TMP="$(mktemp -d)"
cat > "$P196TMP/p196.sh" <<'P196SH'
set -u
ROOT="$1"; PD="$ROOT/diagram-design"; e=0
bad(){ echo "     DO: $*"; e=1; }
[ -f "$PD/.claude-plugin/plugin.json" ] || bad "thieu .claude-plugin/plugin.json"
[ -f "$PD/skills/diagram-design/SKILL.md" ] || bad "thieu skills/diagram-design/SKILL.md"
{ [ -f "$PD/commands/export-diagram.md" ] && [ -f "$PD/commands/import-drawio.md" ]; } || bad "thieu 2 lenh export/import"
{ [ -f "$PD/NOTICE" ] && [ -x "$PD/vendor-sync.sh" ] && [ -x "$PD/tree-hash.sh" ]; } || bad "thieu NOTICE/vendor-sync/tree-hash"
node -e '
const fs=require("fs"); const p=JSON.parse(fs.readFileSync(process.argv[1]+"/.claude-plugin/plugin.json","utf8"));
const m=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));
const errs=[];
if(p.name!=="diagram-design") errs.push("name");
if(!/^\d+\.\d+\.\d+$/.test(p.version)) errs.push("version khong semver: "+p.version);
if(p.license!=="MIT") errs.push("license phai MIT (upstream MIT), dang: "+p.license);
if(!(m.plugins||[]).some(x=>x.name==="diagram-design"&&x.source==="./diagram-design")) errs.push("marketplace thieu entry diagram-design");
const sk=fs.readFileSync(process.argv[1]+"/skills/diagram-design/SKILL.md","utf8");
if(!/^name: diagram-design$/m.test(sk)) errs.push("SKILL.md name != diagram-design");
if(errs.length){console.log(errs.join("; "));process.exit(1)}
' "$PD" "$ROOT/.claude-plugin/marketplace.json" || bad "manifest/marketplace"
H="$(bash "$PD/tree-hash.sh")"; NH="$(sed -n 's/^Tree-hash.*: \([0-9a-f]\{64\}\)$/\1/p' "$PD/NOTICE" | head -1)"
[ -n "$NH" ] || bad "NOTICE khong co dong Tree-hash"
[ "$H" = "$NH" ] || bad "tree-hash tinh lai ($H) != NOTICE ($NH) — DRIFT giua cay va NOTICE; sua o kho skill roi chay vendor-sync.sh"
# MOT ham so version-theo-hash: dung cho ca base that lan mutant cap base gia
so_ver_hash(){ # <baseHash> <baseVer> <curHash> <curVer> -> 0 ok / 1 do
  [ "$1" != "$3" ] && [ "$2" = "$4" ] && return 1; return 0; }
CV="$(node -e 'console.log(require(process.argv[1]).version)' "$PD/.claude-plugin/plugin.json")"
if git -C "$ROOT" cat-file -e origin/main:diagram-design/NOTICE 2>/dev/null; then
  BH="$(git -C "$ROOT" show origin/main:diagram-design/NOTICE | sed -n 's/^Tree-hash.*: \([0-9a-f]\{64\}\)$/\1/p' | head -1)"
  BV="$(git -C "$ROOT" show origin/main:diagram-design/.claude-plugin/plugin.json | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).version))')"
  so_ver_hash "$BH" "$BV" "$H" "$CV" || bad "tree-hash doi so voi origin/main ma version plugin van $CV — bump version"
  echo "     P196: so voi origin/main: hash $( [ "$BH" = "$H" ] && echo giu || echo doi ) · version $BV -> $CV"
else echo "     P196: origin/main chua co goi — chan version-theo-hash chay tren cap base GIA duoi day (lan dau)"; fi
if so_ver_hash "0000" "$CV" "$H" "$CV"; then bad "MUTANT-VERSION KHONG bi bat (hash doi, version giu ma xanh)"; else echo "     MUTANT-VERSION bi bat: hash doi + version giu -> do (qua CHINH so_ver_hash)"; fi
# chan am: goi khong duoc mang hook/mcp/thu muc la vao may dong doi
[ -e "$PD/hooks" ] && bad "goi co hooks/ — plugin ve khong duoc cai hook len may nguoi khac"
[ -e "$PD/.mcp.json" ] && bad "goi co .mcp.json"
for f in "$PD"/* "$PD"/.[!.]*; do b="$(basename "$f")"; case "$b" in .claude-plugin|skills|commands|NOTICE|vendor-sync.sh|tree-hash.sh) ;; *) bad "top-level la trong goi: $b";; esac; done
MK="$(head -1 "$PD/skills/diagram-design/references/style-guide.md")"
[ "$MK" = "<!-- skin: default -->" ] || bad "marker skin trong goi phai la default, dang: $MK (skin song trong REPO, khong trong goi)"
NL="$(find "$PD" -type l | wc -l | tr -d ' ')"; [ "$NL" = "0" ] || bad "co $NL symlink trong goi"
grep -q "DIAGRAM-SKIN-TEMPLATE" "$PD/skills/diagram-design/references/style-guide.md" || bad "goi thieu khuon DIAGRAM-SKIN-TEMPLATE"
grep -q "docs/reference/diagram-skin.md" "$PD/skills/diagram-design/SKILL.md" || bad "SKILL.md §0 khong tro toi docs/reference/diagram-skin.md"
T="$(mktemp -d)"; cp -R "$PD" "$T/dd"; printf 'x' >> "$T/dd/skills/diagram-design/SKILL.md"
MH="$(bash "$T/dd/tree-hash.sh")"; if [ "$MH" != "$NH" ]; then echo "     MUTANT-HASH bi bat: doi 1 byte -> hash khac NOTICE"; else bad "MUTANT-HASH KHONG bi bat"; fi
sed -i.bak '1s/.*/<!-- skin: default-confirmed -->/' "$T/dd/skills/diagram-design/references/style-guide.md"
if [ "$(head -1 "$T/dd/skills/diagram-design/references/style-guide.md")" != "<!-- skin: default -->" ]; then echo "     MUTANT-MARKER bi bat: marker ro ri trang thai ca nhan"; else bad "MUTANT-MARKER KHONG bi bat"; fi
rm -rf "$T"
[ $e -eq 0 ] && echo "P196 OK (layout+manifest MIT · hash==NOTICE · version-theo-hash · marker default · 0 symlink · 0 hook/mcp/thu-muc-la · 3 mutant bi bat)"
exit $e
P196SH
run "P196 plugin diagram-design: layout+manifest · tree-hash==NOTICE · marker default · khong symlink (release-2-1-0 E6)" \
  bash "$P196TMP/p196.sh" "$ROOT"
rm -rf "$P196TMP"

# ── P197: the Cong Pham vi in NGUONG NGHIEM THU tu opportunity.md — ma tran 4 trang thai x 2 mat + 3 mutant (moi-noi-vong-trao E1/E2)
P197TMP="$(mktemp -d)"
cat > "$P197TMP/p197.py" <<'P197PY'
import json, os, re, shutil, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1]); errs = []
def bad(m): errs.append(m); print("  P197 LOI: " + m)
tpl = (root / "skills/acceptance/references/opportunity-template.md").read_text(encoding="utf-8")
# round-trip writer->reader: (1) heading = hang so gate-card doc, PHAI ton tai trong KHUON dang '## <heading>';
gc_src = (root / "scripts/gate-card.js").read_text(encoding="utf-8")
mh = re.search(r"UAT_THRESHOLD_HEADING = '([^']+)'", gc_src)
if not mh: bad("gate-card.js khong khai hang so UAT_THRESHOLD_HEADING"); print("\n".join(errs)); sys.exit(1)
HEAD = mh.group(1)
if not re.search(r"^## " + re.escape(HEAD) + r"\s*$", tpl, re.M): bad("khuon opportunity-template khong co heading '%s' ma gate-card doc (round-trip khuon)" % HEAD)
# (2) THAN opportunity.md dung tu CHINH KHUON: frontmatter giua moc OPP-FRONTMATTER-TEMPLATE + body sau moc,
#     thay placeholder {..} — ben viet la khuon that, khong viet tay dung khuon ben doc.
mfm = re.search(r"<!-- <<<OPP-FRONTMATTER-TEMPLATE -->\n```yaml\n(---\n[\s\S]*?\n---)\n```\n<!-- OPP-FRONTMATTER-TEMPLATE>>> -->\n", tpl)
if not mfm: bad("khuon thieu khoi OPP-FRONTMATTER-TEMPLATE"); print("\n".join(errs)); sys.exit(1)
FM = re.sub(r"\{[a-z_]+\}", "x", mfm.group(1))
BODY = tpl[mfm.end():]
def section_span(body, head):
    m2 = re.search(r"^## " + re.escape(head) + r"[ \t]*\n", body, re.M)
    if not m2: return None
    m3 = re.search(r"^## ", body[m2.end():], re.M)
    end = m2.end() + (m3.start() if m3 else len(body) - m2.end())
    return m2.start(), m2.end(), end
CONTRACT = """---
schema_version: 1
feature: P197 fixture
slug: p197
owner: p197@test
risk_tier: T2
surfaces: [cli]
status: draft
approved_by:
approved_at:
---
# Acceptance Contract: p197
## Context
fixture P197.
## Criteria
- AC-1: Given a, When b, Then c.
## Coverage
- Trục: x | y [thước CE: fixture]
## Out of scope
- không gì
"""
LINES = ["- Câu hỏi phép đo trả lời: người dùng tự làm được việc X không?", "- Kết quả nào là SỐNG: ≥3/4 người tự hoàn thành", "- Timebox: 2 tuần"]
def opp(kind):
    sp = section_span(BODY, HEAD)
    if sp is None: raise SystemExit("khuon mat section nguong")
    a, b, e = sp
    sec = BODY[b:e]
    guide = "".join(l + "\n" for l in sec.split("\n") if l.startswith(">"))   # khoi huong dan '>' cua khuon — gate-card phai loc
    if kind == "co":    body = BODY[:b] + guide + "\n".join(LINES) + "\n\n" + BODY[e:]
    elif kind == "rong": body = BODY[:b] + guide + "\n" + BODY[e:]            # chep khuon, chua dien: chi con dong '>' -> RONG
    elif kind == "thieu": body = BODY[:a] + BODY[e:]
    else: raise SystemExit("kind?")
    return FM + "\n" + body
def run(gc, ws, extract):
    a = ["node", str(gc), "--root", str(ws.parent.parent), "--slug", "p197"] + (["--extract"] if extract else [])
    r = subprocess.run(a, capture_output=True, text=True)
    return r.returncode, r.stdout, r.stderr
def make_ws(base, kind):
    ws = base / "_acceptance" / "p197"; ws.mkdir(parents=True, exist_ok=True)
    (ws / "contract.md").write_text(CONTRACT, encoding="utf-8")
    (ws / "evals.yaml").write_text("evals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.x\n    expected: ok\n", encoding="utf-8")
    (base / "_acceptance" / "config.yaml").write_text("schema_version: 1\nexecutors:\n  script:\n    x: 'true'\n", encoding="utf-8")
    if kind != "khong": (ws / "opportunity.md").write_text(opp(kind), encoding="utf-8")
    return ws
# ma tran viet truoc: (trang thai, mat) -> assert co ten. 8 o + doi-cu.
def matrix(gc, label):
    out = []
    for kind in ["co", "rong", "thieu", "khong"]:
        base = Path(tempfile.mkdtemp()); ws = make_ws(base, kind)
        rc, html, err = run(gc, ws, False)
        rc2, js, err2 = run(gc, ws, True)
        if rc != 0 or rc2 != 0: out.append(kind + "/exit: gate-card exit " + str((rc, rc2)) + " " + (err or err2)[:200]); shutil.rmtree(base, ignore_errors=True); continue
        try: ut = json.loads(js).get("uat_threshold")
        except Exception as e: out.append(kind + "/extract: json hong " + str(e)); shutil.rmtree(base, ignore_errors=True); continue
        if ut is None: out.append(kind + "/extract: thieu khoa uat_threshold"); shutil.rmtree(base, ignore_errors=True); continue
        has_block = "Ngưỡng nghiệm thu" in html and "sẽ có phiên nghiệm thu" in html
        has_flag = ("Hồ sơ cơ hội chưa khai ngưỡng nghiệm thu" in html) or ("Hồ sơ cơ hội có nhưng thẻ không đọc được" in html)  # ghim DUNG cau co cua khoi nguong, khong dung manh chung
        has_fact = "ship thẳng, không phiên nghiệm thu" in html
        if kind == "co":
            if not has_block: out.append("co/html: thieu khoi nguong")
            if not all(l.lstrip("- ") in html for l in LINES): out.append("co/html: thieu dong nguyen van")
            if not (ut.get("opportunity_present") is True and ut.get("section_present") is True and ut.get("lines") == [l for l in LINES]): out.append("co/extract: lines/section_present sai: %r" % ut)
        if kind == "rong":
            if has_block: out.append("rong/html: rong van in khoi")
            if not has_flag: out.append("rong/html: thieu co vang chua-khai-nguong")
            if not (ut.get("opportunity_present") is True and ut.get("section_present") is True and ut.get("lines") == []): out.append("rong/extract: sai: %r" % ut)
        if kind == "thieu":
            if has_block: out.append("thieu/html: thieu-section van in khoi")
            if not has_flag: out.append("thieu/html: thieu co vang chua-khai-nguong")
            if not (ut.get("opportunity_present") is True and ut.get("section_present") is False and ut.get("lines") == []): out.append("thieu/extract: sai: %r" % ut)
        if kind == "khong":
            if has_block or has_flag: out.append("khong-co-hoi/html: nhanh khong-co-hoi in co vang/khoi")
            if not has_fact: out.append("khong-co-hoi/html: thieu dong su kien ship-thang")
            if not (ut.get("opportunity_present") is False): out.append("khong-co-hoi/extract: opportunity_present phai false: %r" % ut)
        shutil.rmtree(base, ignore_errors=True)
    # doi-cu: contract DOI TRUOC (khong section Coverage, gate1_skipped) va khong opportunity — nhu khong-co-hoi, khong loi
    base = Path(tempfile.mkdtemp()); ws = make_ws(base, "khong")
    (ws / "contract.md").write_text(CONTRACT.replace("## Coverage\n- Trục: x | y [thước CE: fixture]\n", "").replace("approved_at:\n", "approved_at:\ngate1_skipped: true\n"), encoding="utf-8")
    rc, html, err = run(gc, ws, False)
    if rc != 0 or "ship thẳng, không phiên nghiệm thu" not in html: out.append("doi-cu/html: ho so doi cu loi hoac thieu dong su kien")
    shutil.rmtree(base, ignore_errors=True)
    return out
# doi chung duong: gate-card that phai xanh ca 8 o
e = matrix(root / "scripts" / "gate-card.js", "that")
for x in e: bad(x)
# 3 mutant tren BAN SAO gate-card (mutant phai CHAY DUOC: khong duoc crash)
def mutant(name, fn, expect_substr):
    tmp = Path(tempfile.mkdtemp()); shutil.copytree(root / "scripts", tmp / "scripts"); shutil.copytree(root / "lib", tmp / "lib")
    p = tmp / "scripts" / "gate-card.js"; s = p.read_text(encoding="utf-8"); s2 = fn(s)
    if s2 == s: bad("mutant %s khong ap duoc (neo doi?)" % name); shutil.rmtree(tmp, ignore_errors=True); return
    p.write_text(s2, encoding="utf-8")
    r = matrix(p, name)
    if not any(expect_substr in x for x in r): bad("MUTANT %s KHONG bi bat (doi '%s', thay %r)" % (name, expect_substr, r[:3]))
    else: print("     MUTANT %s bi bat: %s" % (name, [x for x in r if expect_substr in x][0]))
    shutil.rmtree(tmp, ignore_errors=True)
mutant("m1-go-khoi", lambda s: s.replace("if (ut.opportunity_present && ut.readable && ut.section_present && ut.lines.length) {", "if (false) {"), "thieu khoi nguong")
mutant("m2-khong-co-hoi-in-co-vang", lambda s: s.replace("if (!ut.opportunity_present)", "if (ut.opportunity_present)"), "nhanh khong-co-hoi in co vang")
mutant("m3-rong-van-in-khoi", lambda s: s.replace("ut.section_present && ut.lines.length", "ut.section_present"), "rong van in khoi")
if errs: print("\n".join(errs)); sys.exit(1)
print("P197 OK (8 o ma tran + doi-cu xanh tren gate-card that; 3 mutant bi bat; heading round-trip tu khuon)")
P197PY
run "P197 the Cong Pham vi in nguong nghiem thu: ma tran 4x2 + doi-cu + 3 mutant (moi-noi-vong-trao E1/E2)" \
  python3 "$P197TMP/p197.py" "$ROOT"
rm -rf "$P197TMP"

# ONLY_BLOCK dat ma khong khoi nao khop = no-op xanh im lang (S4-r1 mtc)
if [ -n "${ONLY_BLOCK:-}" ] && [ "$only_matched" -eq 0 ]; then
  echo "ONLY_BLOCK=$ONLY_BLOCK khong khop khoi nao — go sai ten? (fail de khong xanh gia)"
  failures=$((failures + 1))
fi
if [ "$failures" -gt 0 ]; then
  echo
  echo "Results: $failures failed"
  exit 1
fi

echo
echo "Results: all plugin tests passed"
exit 0
