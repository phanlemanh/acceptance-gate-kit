# Khối "👉 VIỆC CỦA ANH" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Khối "👉 VIỆC CỦA ANH" thành thành phần cứng máy-sinh ở cả 3 mode thẻ
của `gate-card.js` + khuôn lời-mời-cổng single-source 2 marker trong bản luật,
4 bên chép nguyên văn (contract `_acceptance/khoi-viec-cua-anh/`, 7 AC).

**Architecture:** (a) `scripts/gate-card.js` render khối cứng từ dữ liệu thẻ đã
parse — không key overlay mới; (b) `human-facing-language.md` giữ 2 khối marker
`YOUR-MOVE-BLOCK-TEMPLATE` + `GATE-INVITE-CLAUSE`; 4 writer chép câu điều khoản
nguyên văn, test round-trip canh từng ký tự (pattern LOOP-PICTURE-CLAUSE/P85).

**Tech Stack:** Node (no deps), bash test harness `tests/plugins/run-tests.sh`
(hàm `run`/`pass`/`fail`, fixture mktemp code-sinh).

## Global Constraints

- KHÔNG đụng 6 lệnh cổng người (`commands/approve|signoff|acceptance-init|acceptance-status|acceptance-report|start.md`) — ADR 0002.
- KHÔNG mở card mode mới; KHÔNG key mới trong `card-plain.json` (P147 canh 2 chiều `pl.<key>` — khối dùng biến thường, không đọc `pl.`).
- Mọi case mới: chiều đỏ chạy thật qua CHÍNH `gate-card.js` (bản sao bị phá trong scratch, chép TRỌN `scripts/` + `lib/`, không lọc đuôi) + in `MUTANT:` xác nhận + đối chứng dương cùng fixture.
- Sửa nguồn xong PHẢI `bash scripts/sync-plugin-packages.sh` và commit mirror cùng lượt (P30).
- Chuỗi ghim của khối (đổi là đổi test): nhãn `👉 VIỆC CỦA ANH` · ba vế `làm gì:` / `ở đâu:` / `trả lời dạng:` · dòng `Trả lời mẫu` · chỉ-báo `không cần làm gì`.

---

### Task 1: Khuôn 2 marker trong bản luật + case P189

**Files:**
- Modify: `skills/acceptance/references/human-facing-language.md` (thêm section trước mục "Từ mới feature này đưa vào từ điển")
- Test: `tests/plugins/run-tests.sh` (case P189, thêm cuối file trước tổng kết)

**Interfaces:**
- Produces: khối marker `<!-- <<<YOUR-MOVE-BLOCK-TEMPLATE -->…<!-- YOUR-MOVE-BLOCK-TEMPLATE>>> -->` và `<!-- <<<GATE-INVITE-CLAUSE -->\n<một câu>\n<!-- GATE-INVITE-CLAUSE>>> -->` — Task 2 chép câu này NGUYÊN VĂN, Task 3 render đúng các chuỗi ghim.

- [ ] **Step 1: Viết case P189 (đỏ trước)** — thêm vào `tests/plugins/run-tests.sh` (theo khuôn `run … python3`):

```bash
# ── P189: khuon YOUR-MOVE-BLOCK-TEMPLATE khai du 4 chuan (chip (2) kit 2.1) ──
run "P189 khuon VIEC-CUA-ANH: du 3 ve + mau gop 1 dong + chi-bao + cam-dau-hoi (E6)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
law = (Path(sys.argv[1]) / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8")
RX = re.compile(r"<!-- <<<YOUR-MOVE-BLOCK-TEMPLATE -->\n([\s\S]*?)<!-- YOUR-MOVE-BLOCK-TEMPLATE>>> -->")
m = RX.search(law)
assert m, "KHONG rut duoc khoi YOUR-MOVE-BLOCK-TEMPLATE qua marker"
tpl = m.group(1)
assert "👉 VIỆC CỦA ANH" in tpl, "khuon thieu nhan khoi"
for ve in ("làm gì", "ở đâu", "trả lời dạng"):
    assert ve in tpl, f"khuon thieu ve: {ve}"
mau = [l for l in tpl.splitlines() if "Trả lời mẫu" in l]
assert len(mau) == 1, "khuon phai co dung 1 dong 'Trả lời mẫu' (mot dong, gop)"
assert "một dòng" in mau[0], "dong mau phai tuyen bo 'một dòng'"
# 2 luat di kem khuon nam NGAY sau khoi (van ban section nay)
sec = law[m.start():m.start() + 2600]
assert "không cần làm gì" in sec, "thieu luat chi-bao 'không cần làm gì'"
assert "câu tu từ" in sec and "dấu hỏi" in sec, "thieu luat cam cau tu tu mang dau hoi"
# doi chung am: dot bien bo nho go dong chi-bao -> phep do phai do
mut = sec.replace("không cần làm gì", "", 1)
assert mut != sec, "dot bien khong tac dung"
print("MUTANT: da go chuoi chi-bao trong ban sao bo nho")
assert "không cần làm gì" not in mut.split("CẤM")[0] or True
assert ("không cần làm gì" in sec) and ("không cần làm gì" not in mut[:mut.find("câu tu từ")] ), "phep do khong phan biet duoc mutant"
print("P189 OK (khuon du 4 chuan; mutant bi bat)")
PY
```

- [ ] **Step 2: Chạy — phải ĐỎ** với "KHONG rut duoc khoi YOUR-MOVE-BLOCK-TEMPLATE":
  `ONLY_BLOCK=P189 bash tests/plugins/run-tests.sh`

- [ ] **Step 3: Thêm section vào `human-facing-language.md`** — chèn TRƯỚC heading `## Từ mới feature này đưa vào từ điển`:

```markdown
## Khối "👉 VIỆC CỦA ANH" — lời-gọi-hành-động chuẩn

Đề bài gốc: sổ vấp 2026-08-10 (hành vi owner #8) — việc-cần-làm rải giữa thân
bài, câu tu từ lẫn câu hỏi thật, không nói trả-lời-dạng-gì. Chuẩn dưới đây áp
cho MỌI tin trình cho người tại điểm quyết định: thẻ cổng render khối bằng máy
(`scripts/gate-card.js`, cả ba mode), tin nhắn do phiên viết theo khuôn:

<!-- <<<YOUR-MOVE-BLOCK-TEMPLATE -->
👉 VIỆC CỦA ANH
1. <làm gì — một hành động, chủ ngữ là người> — ở đâu: <phiên/thẻ/file cần mở> — trả lời dạng: «<khuôn câu trả lời>»
2. <mục kế, cùng ba vế; mỗi việc một dòng, đúng thứ tự cần trả lời>
Trả lời mẫu (một dòng, gộp đủ mọi mục): «<câu chép được một phát>»
<!-- YOUR-MOVE-BLOCK-TEMPLATE>>> -->

Luật đi kèm khuôn:

- Ba vế là bắt buộc từng mục: làm gì · ở đâu · trả lời dạng gì. Câu mẫu
  trả-lời-gộp nằm trên MỘT dòng.
- Tin CHỈ-BÁO — không có việc cho người — vẫn kết bằng khối, đúng một dòng:
  `👉 VIỆC CỦA ANH: không cần làm gì — <máy đang làm gì tiếp>`.
- CẤM câu tu từ mang dấu hỏi: mọi dấu hỏi trong tin phải thuộc một mục việc
  có "trả lời dạng" khai sẵn.

Câu dưới đây là bản gốc DUY NHẤT của điều khoản mời-cổng. Bốn bên dùng (vòng
lặp tính năng hai harness, skill acceptance, lệnh thẻ) chép nguyên văn, không
tự diễn đạt.

<!-- <<<GATE-INVITE-CLAUSE -->
Mọi tin mời cổng (duyệt hay ký) kết bằng đúng MỘT khối 👉 VIỆC CỦA ANH theo khuôn `YOUR-MOVE-BLOCK-TEMPLATE` trong bản luật ngôn ngữ mặt người: mỗi mục đủ 3 vế làm-gì / ở-đâu / trả-lời-dạng-gì, kèm câu mẫu trả-lời-gộp MỘT dòng; tin chỉ-báo ghi rõ "không cần làm gì"; cấm câu tu từ mang dấu hỏi.
<!-- GATE-INVITE-CLAUSE>>> -->
```

- [ ] **Step 4: Chạy — XANH:** `ONLY_BLOCK=P189 bash tests/plugins/run-tests.sh` → `PASS: P189`.
- [ ] **Step 5: Commit** `git add skills/acceptance/references/human-facing-language.md tests/plugins/run-tests.sh && git commit -m "feat(hfl): khuôn khối 👉 VIỆC CỦA ANH 2 marker + case P189"`

### Task 2: Chép GATE-INVITE-CLAUSE vào 4 bên + case P188

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (mục GATE 1 + GATE 2), `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` (mục Gate 1 + Gate 2 presentation), `skills/acceptance/SKILL.md` (STOP Gate 1 part B + Gate 2), `commands/acceptance-card.md` (step 4 present)
- Test: `tests/plugins/run-tests.sh` (case P188)

**Interfaces:**
- Consumes: câu giữa marker `GATE-INVITE-CLAUSE` của Task 1 — chép NGUYÊN VĂN một dòng, không xuống dòng lại, không sửa dấu.

- [ ] **Step 1: Viết case P188 (đỏ trước):**

```bash
# ── P188: GATE-INVITE-CLAUSE round-trip nguon -> 4 ban chep, khop tung ky tu ──
run "P188 round-trip dieu khoan moi-cong: nguon + 4 ban chep khop tung ky tu (E5)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
law_p = "skills/acceptance/references/human-facing-language.md"
RX = re.compile(r"<!-- <<<GATE-INVITE-CLAUSE -->\n([\s\S]*?)\n<!-- GATE-INVITE-CLAUSE>>> -->")
m = RX.search((root / law_p).read_text(encoding="utf-8"))
assert m, f"{law_p}: KHONG rut duoc GATE-INVITE-CLAUSE qua marker"
clause = m.group(1).strip()
assert clause, "clause rong"  # doi chung duong: rut duoc va khong rong
COPIES = [
    "feature-loop/skills/feature-loop/SKILL.md",
    "codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md",
    "skills/acceptance/SKILL.md",
    "commands/acceptance-card.md",
]
texts = {rel: (root / rel).read_text(encoding="utf-8") for rel in COPIES}
for rel, t in texts.items():
    assert clause in t, f"{rel}: LECH nguon — khong chua GATE-INVITE-CLAUSE khop tung ky tu"
# chieu do: dot bien bo nho 1 ky tu tren 1 ban chep -> phep so phai do DICH DANH ban do
victim = COPIES[0]
mut = texts[victim].replace(clause, clause.replace("MỘT khối", "MOT khoi"), 1)
assert mut != texts[victim], "dot bien khong tac dung"
print(f"MUTANT: da lam lech 1 ky tu ban chep {victim} (bo nho)")
bad = [rel for rel, t in {**texts, victim: mut}.items() if clause not in t]
assert bad == [victim], f"phep so phai do DICH DANH {victim}, thay: {bad}"
print("P188 OK (nguon + 4 ban khop; mutant do dich danh " + victim + ")")
PY
```

- [ ] **Step 2: Chạy — ĐỎ** (`LECH nguon` ở cả 4). `ONLY_BLOCK=P188 bash tests/plugins/run-tests.sh`
- [ ] **Step 3: Chép clause vào 4 file** — mỗi chỗ một đoạn văn mới, câu clause giữ nguyên MỘT dòng:
  - `feature-loop/.../SKILL.md` mục `## GATE 1`: sau câu "RỒI hỏi đúng 1 câu: duyệt / sửa gì." thêm câu clause. Mục `## GATE 2`: sau đoạn "BƯỚC MẶC ĐỊNH — render thẻ…" thêm câu clause.
  - `codex/.../SKILL.md`: hai chỗ trình Gate 1 / Gate 2 card (quanh "Gate 1 default presentation invokes the `acceptance-card` skill"), thêm câu clause tiếng Việt nguyên văn (tiền lệ LOOP-PICTURE-CLAUSE dòng ~393).
  - `skills/acceptance/SKILL.md`: STOP Gate 1 part B (bước 5 phase 2) + đoạn Gate 2 (~dòng 258), mỗi chỗ thêm câu clause.
  - `commands/acceptance-card.md`: bước 4 "Render + present" thêm câu clause.
- [ ] **Step 4: Chạy — XANH** `PASS: P188`.
- [ ] **Step 5: Commit** 4 file + test.

### Task 3: gate-card.js render khối 3 mode + case P185/P186/P186b/P187

**Files:**
- Modify: `scripts/gate-card.js`
- Test: `tests/plugins/run-tests.sh`

**Interfaces:**
- Consumes: dữ liệu thẻ đã parse sẵn trong script: Gate 1 (`flags`, foot); Gate 2 approvable (`decisions[]` id, `ooc.findings[]`, `oos`, `decsProvisional[]`); Gate 2 non-approvable (`verdict`).
- Produces: khối HTML `<div class="lab">👉 VIỆC CỦA ANH</div>` + `<div class="grp …">` ngay TRƯỚC `.foot` ở cả 3 mode; nhãn `Ngoài-<n> · ` prefix cho từng item khối "Ngoài hợp đồng".

- [ ] **Step 1: Viết case P185 (đỏ trước)** — fixture code-sinh + mutant qua bản sao trọn `scripts/`+`lib/`:

```bash
# ── P185: khoi VIEC-CUA-ANH tren the Cong 1 (draft + approved) ───────────────
echo "P185 khoi VIEC-CUA-ANH the Cong 1: 3 ve + mau 1 dong + vi tri truoc foot (E1)"
P185OK=1
P185WS="$(mktemp -d)"
mkdir -p "$P185WS/_acceptance/fx"
cat > "$P185WS/_acceptance/fx/contract.md" <<'EOF'
---
schema_version: 1
feature: fx demo
slug: fx
risk_tier: T2
status: draft
---

## Criteria

- AC-1: Given a, When b, Then c.

## Coverage

- Trục duy nhất: đủ.

## Out of scope

- Hoãn x.
EOF
for st in draft approved; do
  python3 - "$P185WS/_acceptance/fx/contract.md" "$st" <<'PY'
import sys, re
p, st = sys.argv[1], sys.argv[2]
t = open(p, encoding="utf-8").read()
t = re.sub(r"^status: .*$", "status: " + st, t, count=1, flags=re.M)
open(p, "w", encoding="utf-8").write(t)
PY
  OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P185WS" --slug fx 2>&1)" || { echo "     exit khac 0 (status=$st)"; P185OK=0; }
  printf '%s' "$OUT" | node -e '
const html = require("fs").readFileSync(0, "utf8");
const st = process.argv[1];
const die = m => { console.error("     [" + st + "] " + m); process.exit(1); };
const iYm = html.indexOf("👉 VIỆC CỦA ANH");
if (iYm < 0) die("thieu nhan khoi");
const iBody = html.indexOf("Cổng 1");
const iFoot = html.indexOf("class=\"foot\"");
if (!(iBody >= 0 && iBody < iYm && iYm < iFoot)) die("khoi sai vi tri (phai sau than the, truoc foot)");
const seg = html.slice(iYm, iFoot);
for (const ve of ["làm gì:", "ở đâu:", "trả lời dạng:"]) if (!seg.includes(ve)) die("thieu ve: " + ve);
if ((seg.match(/làm gì:/g) || []).length !== 1) die("Cong 1 phai co dung MOT muc quyet");
const mau = seg.match(/<p class="li">Trả lời mẫu[^<]*<\/p>/);
if (!mau) die("dong Tra loi mau khong phai MOT dong text tron (co tag chen giua hoac thieu)");
if (!/«Duyệt»/.test(mau[0])) die("mau thieu dang tra loi «Duyệt»");
console.error("     [" + st + "] khoi OK");
' "$st" || P185OK=0
done
# chieu do: mutant go khoi trong BAN SAO tron scripts/ + lib/ (khong loc duoi)
P185MUT="$(mktemp -d)"
cp -R "$ROOT/scripts" "$P185MUT/scripts"; cp -R "$ROOT/lib" "$P185MUT/lib"
python3 - "$P185MUT/scripts/gate-card.js" <<'PY'
import sys
p = sys.argv[1]
src = open(p, encoding="utf-8").read()
n = src.count("VIỆC CỦA ANH")
mut = "\n".join(l for l in src.splitlines() if "VIỆC CỦA ANHFAKE" in l or "VIỆC CỦA ANH" not in l)
assert mut != src, "mutant khong tac dung — script chua co khoi?"
open(p, "w", encoding="utf-8").write(mut)
print(f"MUTANT: da go {n} dong mang khoi khoi ban sao gate-card.js")
PY
MOUT="$(node "$P185MUT/scripts/gate-card.js" --root "$P185WS" --slug fx 2>&1)"
if printf '%s' "$MOUT" | grep -qF '👉 VIỆC CỦA ANH'; then echo "     mutant van in khoi — phep do chet"; P185OK=0; fi
rm -rf "$P185WS" "$P185MUT"
[ "$P185OK" -eq 1 ] && pass "P185 khoi VIEC-CUA-ANH Cong 1 (2 nhanh status + mutant)" || fail "P185 khoi VIEC-CUA-ANH Cong 1 (2 nhanh status + mutant)"
```

- [ ] **Step 2: Viết case P186 + P186b (đỏ trước)** — fixture Cổng 2 đủ 4 loại việc-người; dùng chung builder:

```bash
# ── P186/P186b: khoi VIEC-CUA-ANH the Cong 2 ky duoc ─────────────────────────
echo "P186 khoi VIEC-CUA-ANH Cong 2: du 4 loai viec + mau gop 1 dong (E2)"
P186OK=1; P186BOK=1
P186WS="$(mktemp -d)"
mkdir -p "$P186WS/_acceptance/fx"
cat > "$P186WS/_acceptance/fx/contract.md" <<'EOF'
---
schema_version: 1
feature: fx demo
slug: fx
risk_tier: T2
status: verified
---

## Criteria

- AC-1: Given a, When b, Then c. (judgment)

## Out of scope

- Hoãn x.
EOF
printf '%s\n' '{"id":"d-s","type":"seal","gate":1}' '{"id":"d-p1","type":"fix","stage":"S4-r1","decision":"đổi hướng X","impact":"nhanh hơn"}' > "$P186WS/_acceptance/fx/decisions.jsonl"
cat > "$P186WS/_acceptance/fx/evidence-report.md" <<'EOF'
---
verdict: PENDING-JUDGMENT
---

## Per-eval

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E9 | AC-1 | judgment | UNCERTAIN |

## Evidence

- eval: E9
  judged_by: panel
  rationale: máy chưa chắc
EOF
cat > "$P186WS/_acceptance/fx/review-findings.md" <<'EOF'
## Ngoài hợp đồng

- **globToRe unescaped**
  file: lib/x.js
  severity: P1
  proposal: known-limits
  Người dùng thấy gì: Lỗi hiếm khi tên file có dấu hỏi
EOF
OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P186WS" --slug fx 2>&1)" || { echo "     exit khac 0"; P186OK=0; }
printf '%s' "$OUT" | node -e '
const html = require("fs").readFileSync(0, "utf8");
const die = m => { console.error("     " + m); process.exit(1); };
const iYm = html.indexOf("👉 VIỆC CỦA ANH");
const iFoot = html.indexOf("class=\"foot\"");
if (iYm < 0 || iFoot < iYm) die("khoi thieu hoac sai vi tri");
const seg = html.slice(iYm, iFoot);
for (const need of ["E9", "Ngoài-1", "quyết định", "cắt", "Ký"]) if (!seg.includes(need)) die("khoi thieu muc: " + need);
for (const ve of ["làm gì:", "ở đâu:", "trả lời dạng:"]) if (!seg.includes(ve)) die("thieu ve: " + ve);
const mau = seg.match(/<p class="li">Trả lời mẫu[^<]*<\/p>/);
if (!mau) die("mau khong phai MOT dong text tron");
for (const need of ["E9", "Ngoài-1", "Ký"]) if (!mau[0].includes(need)) die("mau gop thieu ma: " + need);
' || P186OK=0
# mutant: go nhanh liet ke judgment -> khoi thieu E9, mau thieu E9
P186MUT="$(mktemp -d)"
cp -R "$ROOT/scripts" "$P186MUT/scripts"; cp -R "$ROOT/lib" "$P186MUT/lib"
python3 - "$P186MUT/scripts/gate-card.js" <<'PY'
import sys
p = sys.argv[1]
src = open(p, encoding="utf-8").read()
mut = "\n".join(l for l in src.splitlines() if not ("ymParts.push" in l and "Đạt" in l) and not ("Chấm" in l and "làm gì" in l))
assert mut != src, "mutant khong tac dung"
open(p, "w", encoding="utf-8").write(mut)
print("MUTANT: da go nhanh liet ke judgment khoi ban sao")
PY
MOUT="$(node "$P186MUT/scripts/gate-card.js" --root "$P186WS" --slug fx 2>&1)"
if printf '%s' "$MOUT" | node -e '
const html = require("fs").readFileSync(0, "utf8");
const iYm = html.indexOf("👉 VIỆC CỦA ANH");
const seg = iYm >= 0 ? html.slice(iYm, html.indexOf("class=\"foot\"")) : "";
process.exit(seg.includes("E9") ? 0 : 1);'; then echo "     mutant van liet du E9 — phep do chet"; P186OK=0; fi
[ "$P186OK" -eq 1 ] && pass "P186 khoi Cong 2 du 4 loai + mau gop (mutant bi bat)" || fail "P186 khoi Cong 2 du 4 loai + mau gop (mutant bi bat)"

echo "P186b khoi Cong 2 PASS-thuan-may: khoi van hien, dung 1 muc ky (E4)"
cat > "$P186WS/_acceptance/fx/contract.md" <<'EOF'
---
schema_version: 1
feature: fx demo
slug: fx
risk_tier: T2
status: verified
---

## Criteria

- AC-1: Given a, When b, Then c.
EOF
rm -f "$P186WS/_acceptance/fx/review-findings.md" "$P186WS/_acceptance/fx/decisions.jsonl"
cat > "$P186WS/_acceptance/fx/evidence-report.md" <<'EOF'
---
verdict: PASS
---

## Per-eval

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |

## Evidence

- eval: E1
  run_id: abcd1234
  exit_code: 0
  verifier: bash tests/x.sh
EOF
OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P186WS" --slug fx 2>&1)" || { echo "     exit khac 0"; P186BOK=0; }
printf '%s' "$OUT" | node -e '
const html = require("fs").readFileSync(0, "utf8");
const die = m => { console.error("     " + m); process.exit(1); };
const iYm = html.indexOf("👉 VIỆC CỦA ANH");
if (iYm < 0) die("khoi BIEN MAT tren the 0 viec-nguoi");
const seg = html.slice(iYm, html.indexOf("class=\"foot\""));
if ((seg.match(/làm gì:/g) || []).length !== 1) die("phai co dung MOT muc ky-hay-tra");
if (!seg.includes("Ký")) die("muc ky thieu");
' || P186BOK=0
# mutant: go muc ky tren chinh fixture rong
P186BMUT="$(mktemp -d)"
cp -R "$ROOT/scripts" "$P186BMUT/scripts"; cp -R "$ROOT/lib" "$P186BMUT/lib"
python3 - "$P186BMUT/scripts/gate-card.js" <<'PY'
import sys
p = sys.argv[1]
src = open(p, encoding="utf-8").read()
mut = "\n".join(l for l in src.splitlines() if not ("Ký hay trả" in l))
assert mut != src, "mutant khong tac dung"
open(p, "w", encoding="utf-8").write(mut)
print("MUTANT: da go muc Ky-hay-tra khoi ban sao")
PY
MOUT="$(node "$P186BMUT/scripts/gate-card.js" --root "$P186WS" --slug fx 2>&1)"
if printf '%s' "$MOUT" | grep -qF 'Ký hay trả'; then echo "     mutant van in muc ky — phep do chet"; P186BOK=0; fi
rm -rf "$P186WS" "$P186MUT" "$P186BMUT"
[ "$P186BOK" -eq 1 ] && pass "P186b khoi khong bien mat khi 0 viec-nguoi (mutant bi bat)" || fail "P186b khoi khong bien mat khi 0 viec-nguoi (mutant bi bat)"
```

- [ ] **Step 3: Viết case P187 (đỏ trước)** — 3 nhánh verdict + đối chứng dương đổi-giá-trị:

```bash
# ── P187: khoi VIEC-CUA-ANH the Cong 2 khong ky duoc = chi-bao ───────────────
echo "P187 khoi Cong 2 khong-ky-duoc: 'khong can lam gi' + 3 nhanh verdict (E3)"
P187OK=1
P187WS="$(mktemp -d)"
mkdir -p "$P187WS/_acceptance/fx"
cat > "$P187WS/_acceptance/fx/contract.md" <<'EOF'
---
schema_version: 1
feature: fx demo
slug: fx
risk_tier: T2
status: implemented
---

## Criteria

- AC-1: Given a, When b, Then c.
EOF
mkrep() { printf -- '---\nverdict: %s\n---\n\n## Per-eval\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | test | %s |\n' "$1" "$2" > "$P187WS/_acceptance/fx/evidence-report.md"; }
for v in REJECT BLOCKED WEIRD; do
  mkrep "$v" "$([ "$v" = REJECT ] && echo FAIL || echo PASS)"
  OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P187WS" --slug fx 2>&1)" || { echo "     exit khac 0 ($v)"; P187OK=0; }
  printf '%s' "$OUT" | node -e '
const html = require("fs").readFileSync(0, "utf8");
const v = process.argv[1];
const die = m => { console.error("     [" + v + "] " + m); process.exit(1); };
const iYm = html.indexOf("👉 VIỆC CỦA ANH");
if (iYm < 0) die("thieu khoi tren the chi-bao");
const seg = html.slice(iYm, html.indexOf("class=\"foot\""));
if (!seg.includes("không cần làm gì")) die("thieu chuoi chi-bao");
if (seg.includes("trả lời dạng:") || seg.includes("Trả lời mẫu")) die("the chi-bao lai doi tra loi");
' "$v" || P187OK=0
done
# doi chung duong doi-gia-tri: CUNG fixture nang PASS -> khoi doi sang muc Ky
mkrep PASS PASS
OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P187WS" --slug fx 2>&1)"
printf '%s' "$OUT" | grep -qF 'không cần làm gì' && { echo "     PASS van in 'khong can lam gi' — khong phan biet trang thai"; P187OK=0; }
printf '%s' "$OUT" | grep -qF 'Ký' || { echo "     PASS thieu muc Ky"; P187OK=0; }
rm -rf "$P187WS"
[ "$P187OK" -eq 1 ] && pass "P187 chi-bao khong-can-lam-gi (3 nhanh + doi chung PASS)" || fail "P187 chi-bao khong-can-lam-gi (3 nhanh + doi chung PASS)"
```

- [ ] **Step 4: Chạy P185/P186/P187 — ĐỎ** (thiếu khối).
- [ ] **Step 5: Implement trong `scripts/gate-card.js`:**

(1) Gate 1 — chèn TRƯỚC dòng `P.push(`<div class="foot">…Duyệt, cho code…`)`:

```js
  // ---- 👉 VIỆC CỦA ANH (khối cứng máy-sinh — chip ② kit 2.1, chuẩn: 3 vế +
  // mẫu gộp MỘT dòng; nguồn khuôn: YOUR-MOVE-BLOCK-TEMPLATE trong
  // human-facing-language.md) ----
  P.push(`<div class="lab">👉 VIỆC CỦA ANH</div><div class="grp gdo"><p class="li"><b>Duyệt hay trả hồ sơ này</b> — làm gì: đọc hai khối SẼ làm / KHÔNG làm và các cờ chú ý ở trên; ở đâu: trả lời ngay trong phiên đang trình thẻ; trả lời dạng: «Duyệt» hoặc «Sửa: &lt;điều cần đổi&gt;».</p><p class="li">Trả lời mẫu (một dòng): «Duyệt» — hoặc «Sửa: nêu điều cần đổi»</p></div>`);
```

(2) Gate 2 non-approvable — chèn TRƯỚC `P.push(`<div class="foot">…Quay về code…`)`:

```js
  const ymNext = verdict === 'REJECT' ? 'máy đang quay lại sửa code rồi tự chấm vòng mới'
    : verdict === 'BLOCKED' ? 'máy đang khắc phục nguyên nhân kẹt rồi chạy lại vòng chấm'
    : 'máy phải chạy lại vòng chấm để có kết luận đọc được';
  P.push(`<div class="lab">👉 VIỆC CỦA ANH</div><div class="grp gnot"><p class="li">không cần làm gì — ${ymNext}; thẻ này chỉ báo trạng thái. Khi máy cần bạn quyết, nó hỏi bằng tin nhắn riêng.</p></div>`);
```

(3) Gate 2 approvable — thêm nhãn `Ngoài-<n>` vào item ngoài-hợp-đồng hiện có
(sửa dòng `P.push(`<div class="item"><p class="q">${esc(q)}</p>…` trong vòng
`for (const f of ooc.findings)` thành dùng chỉ số: `ooc.findings.forEach((f, fi) => {` … `<p class="q">Ngoài-${fi + 1} · ${esc(q)}</p>` … `})`), rồi chèn TRƯỚC `P.push(`<div class="foot">…Ký duyệt…`)`:

```js
// ---- 👉 VIỆC CỦA ANH (khối cứng — liệt TỪNG việc máy đã đếm, đúng thứ tự thẻ) ----
const ymItems = []; const ymParts = [];
ooc.findings.forEach((f, fi) => {
  const lbl = 'Ngoài-' + (fi + 1);
  ymItems.push(`<b>Chọn hướng cho ${lbl}</b> — làm gì: đọc mục ${lbl} ở khối "Ngoài hợp đồng"; ở đâu: trả lời trong phiên đang trình thẻ; trả lời dạng: «${lbl}: ghi Known limits» hoặc «${lbl}: mở hợp đồng mới» hoặc «${lbl}: nâng phạm vi sửa ngay».`);
  ymParts.push(lbl + (f.proposal === 'new-contract' ? ' mở hợp đồng mới' : ' ghi Known limits'));
});
for (const d of decisions) {
  ymItems.push(`<b>Chấm ${esc(d.id)}</b> — làm gì: đọc câu hỏi ${esc(d.id)} ở khối "Việc chỉ mình bạn quyết được"; ở đâu: trả lời trong phiên đang trình thẻ; trả lời dạng: «${esc(d.id)} Đạt» hoặc «${esc(d.id)} Chưa đạt vì nêu lý do».`);
  ymParts.push(esc(d.id) + ' Đạt');
}
if (oos.length) { ymItems.push(`<b>Xác nhận phần cắt/hoãn</b> — làm gì: đọc mục xác nhận phạm vi ở trên; ở đâu: trả lời trong phiên đang trình thẻ; trả lời dạng: «đồng ý cắt» hoặc «kéo vào: nêu mục».`); ymParts.push('đồng ý cắt'); }
if (decsProvisional.length) { ymItems.push(`<b>Phê ${decsProvisional.length} quyết định ghi sau Cổng 1</b> — làm gì: đọc khối "Quyết định CHƯA duyệt"; ở đâu: trả lời trong phiên đang trình thẻ; trả lời dạng: «phê hết» hoặc «không phê: nêu mã».`); ymParts.push('phê hết quyết định treo'); }
ymItems.push(`<b>Ký hay trả</b> — làm gì: sau khi trả lời các mục trên, chốt hồ sơ; ở đâu: trả lời trong phiên đang trình thẻ; trả lời dạng: «Ký» hoặc «Trả lại: nêu lý do».`);
ymParts.push('Ký');
P.push(`<div class="lab">👉 VIỆC CỦA ANH</div><div class="grp gdo">${ymItems.map(t => `<p class="li">${t}</p>`).join('')}<p class="li">Trả lời mẫu (một dòng): «${ymParts.join('; ')}»</p></div>`);
```

- [ ] **Step 6: Chạy — XANH:** P185, P186, P186b, P187 đều PASS (mutant confirm in `MUTANT:`).
- [ ] **Step 7: Chạy TRỌN suite plugins + render lại thẻ Cổng 1 của chính slug này** (dogfood — thẻ đang trình có khối): `bash tests/plugins/run-tests.sh` exit 0; regen `_acceptance/khoi-viec-cua-anh/card.html`.
- [ ] **Step 8: Commit** `scripts/gate-card.js` + test.

### Task 4: Sync mirror + suite toàn phần + implemented

**Files:**
- Modify: `plugins/**` (máy sinh), `_acceptance/khoi-viec-cua-anh/contract.md` (status)

- [ ] **Step 1:** `bash scripts/sync-plugin-packages.sh` rồi `bash scripts/sync-plugin-packages.sh --check` (exit 0).
- [ ] **Step 2:** Chạy đủ 6 suite của `feature_loop.suite_keys` — exit 0 từng cái.
- [ ] **Step 3:** Sinh 3 file evidence cho E7 bằng CHÍNH gate-card.js (provenance máy-kiểm — điểm B cài mốc 3): render fixture P185/P186/P187 vào `_acceptance/khoi-viec-cua-anh/evidence/p185-card-gate1.html`, `p186-card-gate2.html`, `p187-card-gate2-reject.html`, mỗi lần chạy in lệnh sinh; ghi kèm file `evidence/PROVENANCE.md` (lệnh + sha + ngày).
- [ ] **Step 4:** Set contract `status: implemented`, vẽ lại product-map, commit mirror + evidence cùng lượt.
- [ ] **Step 5:** Dispatch Workflow S4 NGAY (round 1).

## Self-review

- 7 AC ↔ tasks: AC-1 (T3 step 1+5), AC-2 (T3 step 2+5), AC-3 (T3 step 3+5), AC-4 (T3 step 2 P186b), AC-5 (T2), AC-6 (T1), AC-7 (E7 — vật sinh ở T4 step 3, judge ở S4). Không placeholder; tên biến `ymItems/ymParts` nhất quán T3.
