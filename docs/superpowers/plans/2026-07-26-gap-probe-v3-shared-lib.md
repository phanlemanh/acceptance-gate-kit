# gap-probe-presence-hook v3-r2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pre-merge chặn (mode `required`) hoặc nhắc (`advisory`) khi một feature T2/T3 đã `implemented+` chưa qua phản biện context sạch — với **một** cài đặt luật dùng chung cho cả hai lối vào, và một **sàn fail-closed** ở mode `required`.

**Architecture:** Luật gap-probe chuyển từ bash/awk sang **`lib/gap-probe.js`** — module Node thuần, hàm thuần, không chạm filesystem trong lõi. `scripts/gate-card.js` `require` trực tiếp. `scripts/pre-merge-check.sh` gọi qua CLI subcommand ở cuối cùng file lib đó. Bash giữ lại **đúng ba việc**: đọc config, xác định phạm vi diff, in ấn + đếm violation. Mọi đường mà luật KHÔNG chạy được (vắng `node`, thiếu lib, thiếu `--base`, `git diff` lỗi) đều đi qua **một hàm marker duy nhất** phát `GAP-PROBE: NOT ENFORCED reason=<lý do>` rồi VIOLATION ở `required` / NOTE ở `advisory`.

**Tech Stack:** bash (POSIX-ish, `set -euo pipefail`), Node ≥18 CommonJS không dependency, test harness sẵn có của repo (`tests/scripts/run-tests.sh`, `tests/plugins/run-tests.sh`).

## Global Constraints

Copy nguyên văn từ contract v3-r2 + CLAUDE.md của repo. Mọi task ngầm hiểu là phải thoả hết mục này.

- **MỌI assertion mới phải CHỨNG MINH BIẾT ĐỎ.** Tiêm vi phạm → thấy fail đúng thông điệp → gỡ ra → thấy xanh lại. Feature v1/v2 đã có **6 lần test xanh RỖNG**. Một case chỉ assert exit code không phân biệt được "đúng" với "không chạy".
- **Cấm dùng `$(...)` để nối nội dung file có frontmatter** — `$(...)` nuốt newline đuôi, biến `---` thành `---## Notes`. Dùng `printf '%s\n'` hoặc heredoc.
- **Cấm chép regex/luật sang test.** Test phải GỌI chính hàm trong mã sản phẩm. GPM16 của v2 xanh giả vì chép regex.
- **Cấm parser thứ N.** Repo đã trả giá vì copy-paste parser 4 nơi. Đọc frontmatter trong bash = hàm `front_field` (dòng ~105); trong Node = hàm trong `lib/gap-probe.js`. Không hand-roll thêm.
- **`scripts/pre-merge-check.sh`, `lib/**` là `t3_paths`** → mọi thay đổi phải kèm test.
- **`plugins/` là build mirror.** Sửa nguồn xong PHẢI chạy `bash scripts/sync-plugin-packages.sh --check` (và `--write` nếu lệch) — test P30 chặn drift.
- **Prefix case test là `GPM*`.** `GP1`–`GP12` đã bị test gate-card dùng hết.
- **Verify per-task:** `bash tests/scripts/run-tests.sh`. **Verify cuối:** 3 suite + `bash scripts/sync-plugin-packages.sh --check`.
- **Marker viết ĐÚNG chuỗi** `GAP-PROBE: NOT ENFORCED reason=` — CI grep chuỗi này, đổi một ký tự là tắt cổng.
- Vocab: dùng đúng term trong `CONTEXT.md` (`Gate` viết hoa = điểm dừng người; hook → "the hook"; CI → "pre-merge check"). Lint W6 chặn.

## File Structure

| File | Trách nhiệm |
|---|---|
| `lib/gap-probe.js` **(mới)** | Luật gap-probe — nguồn sự thật DUY NHẤT. Hàm thuần `frontVerdict` / `descopeId` / `classify` + một CLI subcommand `classify <dir>` cho bash. Không `require` gì ngoài `fs`/`path`. |
| `scripts/gate-card.js` **(sửa)** | Bỏ regex descope inline, `require('../lib/gap-probe.js')`. Chỉ trình bày. |
| `scripts/pre-merge-check.sh` **(sửa)** | Đọc config · xác định phạm vi diff · gọi lib · in ấn + đếm. Bỏ hàm `gap_probe_descope_id` awk. Thêm `gap_probe_not_enforced()`. |
| `tests/scripts/run-tests.sh` **(sửa)** | Case `GPM*` cho pre-merge + parity theo bảng. |
| `tests/plugins/run-tests.sh` **(sửa)** | Case `P38` cho ràng buộc cấu trúc (gate-card require lib, không còn regex riêng). |
| `codex/acceptance-gate/skills/acceptance-init/SKILL.md` **(sửa)** | Khoá `gap_probe` + chú thích 3 mode, parity với `commands/acceptance-init.md`. |
| `_acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt` **(sinh lại)** | Bằng chứng cho judge E9 — sinh từ fixture trong cùng lần chạy, không chép tay. |

---

### Task 1: `lib/gap-probe.js` — luật, hàm thuần

**Files:**
- Create: `lib/gap-probe.js`
- Test: `tests/scripts/run-tests.sh` (case `GPM20a`–`GPM20h`, chạy lib trực tiếp bằng `node -e`)

**Interfaces:**
- Consumes: (không gì — task đầu)
- Produces:
  - `frontVerdict(text: string) -> 'clean'|'findings'|'probe-failed'|null`
  - `descopeId(ledgerText: string) -> string|null`
  - `classify({probeText, ledgerText}) -> {outcome: 'ok'|'probe-failed'|'descoped'|'missing', verdict, id}`
  - `DESCOPE_RE: RegExp`
  - CLI: `node lib/gap-probe.js classify <dir>` → in một dòng `<outcome>\t<id|>` ra stdout, exit 0.

**Evals phục vụ:** E5 (AC-5), E6 (AC-6), E7 (AC-7), E8 (AC-8), E14 (AC-13)
**independent:** `false` (mọi task sau phụ thuộc)

- [ ] **Step 1: Viết case ĐỎ trước — bảng 8 đầu vào chạy thẳng vào lib**

Chèn vào cuối `tests/scripts/run-tests.sh`, TRƯỚC dòng in tổng kết:

```bash
# ── GPM20: bảng parity — chạy CHÍNH lib, không chép luật sang test ──────────
GPLIB="$SRC_ROOT/lib/gap-probe.js"
gp_classify() { # <probeText> <ledgerText> -> in "outcome|id"
  node -e '
    const L = require(process.argv[1]);
    const r = L.classify({ probeText: process.argv[2], ledgerText: process.argv[3] });
    process.stdout.write(r.outcome + "|" + (r.id || ""));
  ' "$GPLIB" "$1" "$2" 2>&1
}
echo "GPM20 bang parity 8 dau vao -> lib phai phan loai dung tung ca"
check GPM20a "ok|"        "$(gp_classify '---
verdict: clean
---
' '')"
check GPM20b "ok|"        "$(gp_classify '---
verdict: FINDINGS
---
' '')"
check GPM20c "probe-failed|" "$(gp_classify '---
verdict: probe-failed
---
' '')"
# verdict trong THAN BAI khong duoc tinh (AC-6)
check GPM20d "missing|"   "$(gp_classify '# tieu de

verdict: clean
' '')"
# frontmatter co nhung verdict la (AC-6)
check GPM20e "missing|"   "$(gp_classify '---
verdict: xanh
---
' '')"
# van thoat descope, viet hoa + khoang trang dau (AC-7)
check GPM20f "descoped|d-1" "$(gp_classify '' '{"id":"d-1","type":"descope","decision":"  BỎ gap-probe — khong can"}')"
# dong JSON HONG khong duoc mo van thoat (AC-13, fail-CLOSED)
check GPM20g "missing|"   "$(gp_classify '' '{"id":"d-2","type":"descope","decision":"bỏ gap-probe — hong,,,')"
# entry descope nhung decision KHAC -> khong mo van
check GPM20h "missing|"   "$(gp_classify '' '{"id":"d-3","type":"descope","decision":"bỏ mockup"}')"
```

- [ ] **Step 2: Chạy cho thấy ĐỎ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep GPM20`
Expected: cả 8 case FAIL, thông điệp chứa `Cannot find module` (lib chưa tồn tại). Đây là đỏ ĐÚNG lý do — không phải đỏ vì cú pháp test.

- [ ] **Step 3: Viết `lib/gap-probe.js`**

```js
'use strict';
// Luật gap-probe — MỘT cài đặt, HAI lối vào.
//   · scripts/gate-card.js  → require('../lib/gap-probe.js')
//   · scripts/pre-merge-check.sh → node lib/gap-probe.js classify <dir>
// Contract v2 chết vì hai bản cài đặt hai ngôn ngữ, parity giữ bằng comment:
// 3 round S4 và mỗi round lộ một chỗ hai bên lệch nhau (thứ tự khởi tạo biến,
// neo path, nuốt mã lỗi git diff, dòng JSON hỏng mở được van thoát ở bash
// trong khi thẻ loại nó). Đừng tách lại. AC-19/AC-20 canh việc này bằng máy.
const fs = require('fs');
const path = require('path');

// Luật van thoát DUY NHẤT. Thẻ Cổng 1 và pre-merge cùng đọc hằng này.
const DESCOPE_RE = /^\s*bỏ gap-probe/i;
const VERDICTS = ['clean', 'findings', 'probe-failed'];

// verdict CHỈ đọc từ khối frontmatter ĐẦU file. Một dòng `verdict:` trong thân
// bài (vd trích trong bảng finding) KHÔNG được tính — AC-6. `touch` file rỗng
// cho null nên rơi vào nhánh "missing": đó là chốt chống bypass.
function frontVerdict(text) {
  if (typeof text !== 'string') return null;
  const m = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/.exec(text);
  if (!m) return null;
  const line = m[1].split(/\r?\n/).find(l => /^\s*verdict\s*:/.test(l));
  if (!line) return null;
  const v = line
    .replace(/^\s*verdict\s*:\s*/, '')
    .replace(/\s*#.*$/, '')
    .trim()
    .replace(/^["']/, '')
    .replace(/["']$/, '')
    .trim()
    .toLowerCase();
  return VERDICTS.includes(v) ? v : null;
}

// id của entry descope ĐẦU TIÊN mở đầu "bỏ gap-probe". PARSE thật từng dòng —
// dòng JSON hỏng bị BỎ QUA chứ không được khớp bằng regex trên chuỗi thô
// (AC-13: van thoát fail-CLOSED). Một dòng lỗi không làm hỏng cả ledger.
function descopeId(ledgerText) {
  if (typeof ledgerText !== 'string') return null;
  for (const line of ledgerText.split(/\r?\n/)) {
    if (!line.trim()) continue;
    let e;
    try { e = JSON.parse(line); } catch (_) { continue; }
    if (!e || e.type !== 'descope') continue;
    if (DESCOPE_RE.test(String(e.decision || ''))) {
      return String(e.id || '(entry không có id)');
    }
  }
  return null;
}

// outcome: 'ok' (đã có phản biện) | 'probe-failed' | 'descoped' | 'missing'
// Hàm THUẦN — quyết định mode (VIOLATION hay NOTE) là việc của lối vào.
function classify({ probeText, ledgerText }) {
  const verdict = frontVerdict(probeText);
  if (verdict === 'clean' || verdict === 'findings') return { outcome: 'ok', verdict, id: null };
  if (verdict === 'probe-failed') return { outcome: 'probe-failed', verdict, id: null };
  const id = descopeId(ledgerText);
  if (id) return { outcome: 'descoped', verdict, id };
  return { outcome: 'missing', verdict, id: null };
}

// Lối vào filesystem cho CLI. File vắng = chuỗi rỗng, KHÔNG throw.
function classifyDir(dir) {
  const rd = f => { try { return fs.readFileSync(path.join(dir, f), 'utf8'); } catch (_) { return ''; } };
  return classify({ probeText: rd('gap-probe.md'), ledgerText: rd('decisions.jsonl') });
}

module.exports = { DESCOPE_RE, VERDICTS, frontVerdict, descopeId, classify, classifyDir };

if (require.main === module) {
  const [sub, dir] = process.argv.slice(2);
  if (sub !== 'classify' || !dir) {
    process.stderr.write('usage: gap-probe.js classify <slug-dir>\n');
    process.exit(2);
  }
  const r = classifyDir(dir);
  process.stdout.write(r.outcome + '\t' + (r.id || '') + '\n');
}
```

- [ ] **Step 4: Chạy cho thấy XANH**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep GPM20`
Expected: 8/8 PASS.

- [ ] **Step 5: Chứng minh BIẾT ĐỎ (bắt buộc, Global Constraints)**

Tạm đổi `DESCOPE_RE` thành `/^bỏ gap-probe/` (bỏ `\s*`), chạy lại → `GPM20f` PHẢI đỏ. Khôi phục → xanh lại. Ghi một dòng vào transcript task rằng đã làm.

- [ ] **Step 6: Commit**

```bash
git add lib/gap-probe.js tests/scripts/run-tests.sh && git commit -m "feat(gap-probe): lib/gap-probe.js — một cài đặt luật cho cả hai lối vào"
```

---

### Task 2: `gate-card.js` dùng lib — parity đo được bằng máy

**Files:**
- Modify: `scripts/gate-card.js:203` (và dòng `require` đầu file)
- Test: `tests/plugins/run-tests.sh` (case `P38a`, `P38b`)

**Interfaces:**
- Consumes: `descopeId`, `DESCOPE_RE` từ Task 1
- Produces: (không có API mới)

**Evals phục vụ:** E20 (AC-19)
**independent:** `false` (cần Task 1)

- [ ] **Step 1: Viết case ĐỎ**

Chèn vào cuối `tests/plugins/run-tests.sh`, trước dòng tổng kết:

```bash
# ── P38: parity CẤU TRÚC — gate-card phải dùng lib, không giữ luật riêng ────
echo "P38 gate-card.js require lib/gap-probe.js va KHONG con regex descope rieng"
GC_SRC="$(cat "$SRC_ROOT/scripts/gate-card.js")"
case "$GC_SRC" in
  *"require('../lib/gap-probe.js')"*|*'require("../lib/gap-probe.js")'*) pass P38a ;;
  *) fail P38a "gate-card.js khong require lib/gap-probe.js — luat lai bi tach lam hai" ;;
esac
# literal regex descope chi duoc ton tai o DUNG MOT noi: lib/gap-probe.js
if printf '%s' "$GC_SRC" | grep -qF 'bỏ gap-probe/i'; then
  fail P38b "gate-card.js con literal regex descope — parity quay ve giu bang chu"
else
  pass P38b
fi
```

> `pass`/`fail` là hai helper sẵn có của `tests/plugins/run-tests.sh`. Nếu suite đó chỉ có `check`, dùng `check P38a 0 $?` theo đúng khuôn của các case lân cận — đọc 10 dòng quanh case cuối trước khi viết.

- [ ] **Step 2: Chạy cho thấy ĐỎ**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep P38`
Expected: `P38a` FAIL (chưa require), `P38b` FAIL (regex vẫn còn ở dòng 203).

- [ ] **Step 3: Sửa `scripts/gate-card.js`**

Thêm cạnh các `require` đầu file:

```js
const gapProbe = require('../lib/gap-probe.js');
```

Thay dòng 203 (và xoá khối comment 4 dòng ngay trên nó nói về "hai bên phải khớp"):

```js
  // Luật van thoát nằm ở lib/gap-probe.js — CÙNG hàm mà pre-merge gọi. Không
  // viết lại ở đây: contract v2 chết vì đúng chỗ này (xem ledger d-125/d-126).
  const gpDescopeId = gapProbe.descopeId(read(path.join(dir, 'decisions.jsonl')));
  const gpDescope = gpDescopeId ? decsAll.find(e => e.id === gpDescopeId) || { id: gpDescopeId } : null;
```

> Giữ nguyên mọi chỗ dùng `gpDescope` bên dưới (`descoped: !!gpDescope`, flag `finfo`) — chúng chỉ cần truthiness và `.id`.

- [ ] **Step 4: Chạy cho thấy XANH**

Run: `bash tests/plugins/run-tests.sh 2>&1 | tail -3` → toàn bộ suite PASS.
Run: `node scripts/gate-card.js . --slug gap-probe-presence-hook | grep -c "bỏ có chủ đích"` → `0` (slug này có gap-probe.md thật nên không có dòng descope; đây là sanity counter chứng minh script vẫn chạy được, không phải assertion).

- [ ] **Step 5: Chứng minh BIẾT ĐỎ**

Tạm thêm lại `const x = /^\s*bỏ gap-probe/i;` vào gate-card.js → `P38b` PHẢI đỏ. Gỡ ra → xanh.

- [ ] **Step 6: Commit**

```bash
git add scripts/gate-card.js tests/plugins/run-tests.sh && git commit -m "refactor(gate-card): dùng lib/gap-probe.js thay regex inline (AC-19)"
```

---

### Task 3: `pre-merge-check.sh` gọi lib thay awk

**Files:**
- Modify: `scripts/pre-merge-check.sh` — xoá hàm `gap_probe_descope_id` (dòng ~138–162), thay khối luật trong vòng lặp per-slug (dòng ~344–370)
- Test: `tests/scripts/run-tests.sh` — `GPM16` viết lại để gọi lib, các case `GPM1`–`GPM8` giữ nguyên và PHẢI vẫn xanh

**Interfaces:**
- Consumes: CLI `node lib/gap-probe.js classify <dir>` từ Task 1
- Produces: biến shell `GP_LIB` (abs path tới lib), dùng lại ở Task 4

**Evals phục vụ:** E1, E2, E3, E4, E5, E6, E7, E8, E10, E14
**independent:** `false`

- [ ] **Step 1: Viết `GPM16` lại — gọi CHÍNH bash function, không chép regex**

Thay case `GPM16` hiện có bằng:

```bash
# ── GPM16: 5 bien the hoa/thuong cua "bo gap-probe" qua CHINH duong ma
#    pre-merge di (khong chep regex sang test) ────────────────────────────────
echo "GPM16 van thoat descope: 5 bien the hoa/thuong deu phai mo van"
for v in "bỏ gap-probe" "Bỏ gap-probe" "BỎ gap-probe" "  bỏ gap-probe" "bỏ GAP-PROBE"; do
  T16="$(mktemp -d)"; mkdir -p "$T16/_acceptance/s"
  printf '%s\n' "{\"id\":\"d-x\",\"type\":\"descope\",\"decision\":\"$v — ly do\"}" \
    > "$T16/_acceptance/s/decisions.jsonl"
  OUT16="$(node "$SRC_ROOT/lib/gap-probe.js" classify "$T16/_acceptance/s")"
  check "GPM16[$v]" "descoped	d-x" "$OUT16"
  rm -rf "$T16"
done
```

- [ ] **Step 2: Chạy cho thấy ĐỎ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep GPM16`
Expected: 5/5 PASS ngay (lib từ Task 1 đã đúng) — **đây là điểm quan trọng**: case này đo lib, nên nó xanh trước. Cái phải đỏ là bash còn dùng awk. Chứng minh bằng Step 3.

- [ ] **Step 3: Chứng minh bash và lib đang là HAI đường (RED thật của task này)**

Run:

```bash
T="$(mktemp -d)"; mkdir -p "$T/_acceptance/s"
printf '%s\n' '{"id":"d-y","type":"descope","decision":"bỏ  gap-probe — hai space"}' > "$T/_acceptance/s/decisions.jsonl"
node lib/gap-probe.js classify "$T/_acceptance/s"
```

Expected: `missing` (lib đòi MỘT space). Rồi kiểm hàm awk trong bash bằng cách source script và gọi `gap_probe_descope_id "$T/_acceptance/s/decisions.jsonl"` — nếu hai bên khác nhau ở BẤT KỲ ca nào, đó là RED cần chữa. Ghi kết quả vào transcript.

- [ ] **Step 4: Thay khối luật trong bash**

Thêm gần đầu file, cạnh chỗ resolve `ROOT`:

```bash
# lib dùng chung — CÙNG file mà scripts/gate-card.js require. pre-merge chỉ còn
# đọc config, xác định phạm vi diff, in ấn và đếm; luật nằm trong lib.
GP_LIB="$(cd "$(dirname "$0")/.." 2>/dev/null && pwd)/lib/gap-probe.js"
```

Xoá trọn hàm `gap_probe_descope_id` (cả khối comment awk 6 dòng). Thay khối trong vòng lặp:

```bash
  if [ "$GAP_PROBE_MODE" != "off" ] && slug_in_diff "$slug"; then
    gp_fix='Chạy bước S1#7 (phản biện context sạch) để sinh gap-probe.md, HOẶC ghi vào decisions.jsonl một entry {"id":"d-<UTC>-<rand>","type":"descope","stage":"S1","at":"<ISO>","decision":"bỏ gap-probe — <lý do>","impact":"đổi lại không có phản biện context sạch trước duyệt"}'
    gp_line=""
    if [ -f "$GP_LIB" ] && command -v node >/dev/null 2>&1; then
      gp_line="$(node "$GP_LIB" classify "$dir" 2>/dev/null || true)"
    fi
    if [ -z "$gp_line" ]; then
      # Task 4 nối hàm marker vào đây. Tạm thời để trống có chủ đích — Task 4
      # có case riêng chứng minh nhánh này không im lặng.
      :
    else
      gp_outcome="${gp_line%%	*}"
      gp_id="${gp_line#*	}"
      case "$gp_outcome" in
        ok) : ;;
        probe-failed)
          echo "NOTE [$slug]: gap-probe verdict là probe-failed — phản biện KHÔNG chạy được. Merge lúc này nghĩa là merge mà chưa có phản biện context sạch; chạy lại S1#7 nếu muốn có, hoặc chấp nhận rủi ro đó." ;;
        descoped)
          echo "NOTE [$slug]: phản biện context sạch đã được BỎ có chủ đích theo ledger $gp_id — quyết định có dấu vết, không phải sơ suất." ;;
        *)
          if [ "$GAP_PROBE_MODE" = "required" ]; then
            echo "VIOLATION [$slug]: chưa qua phản biện context sạch (gap-probe) — không có gap-probe.md hợp lệ và ledger không có entry descope. $gp_fix"
            violations=$((violations+1))
          else
            echo "NOTE [$slug]: chưa qua phản biện context sạch (gap-probe) — advisory, không chặn merge. $gp_fix"
          fi ;;
      esac
    fi
  fi
```

> Thông điệp giữ **nguyên văn** bản cũ — E12 diff byte-đối-byte với evidence, đổi chữ là phải sinh lại evidence (Task 8).

- [ ] **Step 5: Chạy toàn suite**

Run: `bash tests/scripts/run-tests.sh`
Expected: toàn bộ PASS, gồm `GPM1`–`GPM8`, `GPM10`, `GPM13`, `GPM13b` không đổi hành vi. **Sanity counter:** `bash tests/scripts/run-tests.sh 2>&1 | grep -c '^ok GPM'` phải ≥ 20 — 0 hit nghĩa là grep hỏng, không phải suite trống.

- [ ] **Step 6: Chứng minh BIẾT ĐỎ**

Đổi tạm `ok) : ;;` thành `ok) echo "X" ;;` → một case trong `GPM5c`/`GPM6*` PHẢI đỏ (chúng assert không có output). Gỡ ra → xanh.

- [ ] **Step 7: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh && git commit -m "refactor(pre-merge): luật gap-probe gọi lib/gap-probe.js, gỡ parser awk song song"
```

---

### Task 4: Sàn fail-closed + marker máy-đọc

**Files:**
- Modify: `scripts/pre-merge-check.sh` — thêm `gap_probe_not_enforced()`, nối vào nhánh `-z "$gp_line"` của Task 3, nối vào nhánh `DIFF_READY=0`, và thêm khai báo ở dòng tổng kết cuối
- Test: `tests/scripts/run-tests.sh` — `GPM17`, `GPM18a`, `GPM18b`, `GPM19a`–`GPM19d`

**Interfaces:**
- Consumes: `GP_LIB`, `GAP_PROBE_MODE`, `violations` từ Task 3
- Produces: hàm `gap_probe_not_enforced <reason>`; biến `GP_NOT_ENFORCED` (0|1) đọc ở dòng tổng kết

**Evals phục vụ:** E15 (AC-14), E17 (AC-16), E13 (AC-12 vế sau)
**independent:** `false`

- [ ] **Step 1: Viết case ĐỎ**

```bash
# ── GPM18: SAN fail-CLOSED — khong cuong che duoc thi required phai CHAN ────
gp_norm_repo() { # -> in path repo tam co 1 slug T3 thieu gap-probe, mode $1
  local T; T="$(mktemp -d)"; mkdir -p "$T/_acceptance/s"
  printf '%s\n' 'schema_version: 1' "gap_probe: $1" 'signoff:' '  required_for: [T2, T3]' \
    > "$T/_acceptance/config.yaml"
  printf '%s\n' '---' 'schema_version: 1' 'slug: s' 'risk_tier: T3' 'status: implemented' '---' \
    > "$T/_acceptance/s/contract.md"
  printf '%s\n' '---' 'verdict: PASS' 'verified_commit: deadbeef' '---' \
    > "$T/_acceptance/s/evidence-report.md"
  git -C "$T" init -q 2>/dev/null; git -C "$T" add -A 2>/dev/null
  git -C "$T" -c user.email=t@t -c user.name=t commit -qm base 2>/dev/null
  local B; B="$(git -C "$T" rev-parse HEAD)"
  printf 'x\n' >> "$T/_acceptance/s/contract.md"
  git -C "$T" add -A 2>/dev/null
  git -C "$T" -c user.email=t@t -c user.name=t commit -qm change 2>/dev/null
  printf '%s\n%s\n' "$T" "$B"
}
echo "GPM18 thieu lib/gap-probe.js -> required CHAN, advisory chi NOTE"
# giả lập "thiếu lib": chạy script từ một bản sao KHÔNG có lib/
FAKE="$(mktemp -d)"; mkdir -p "$FAKE/scripts"
cp "$SRC_ROOT/scripts/pre-merge-check.sh" "$FAKE/scripts/"
GP18R="$(gp_norm_repo required)"; GP18T="$(printf '%s' "$GP18R" | head -1)"; GP18B="$(printf '%s' "$GP18R" | tail -1)"
GP18="$(bash "$FAKE/scripts/pre-merge-check.sh" "$GP18T" --base "$GP18B" 2>&1)"; GP18ST=$?
check   GPM18a_exit 1 $GP18ST
hasout  GPM18a "GAP-PROBE: NOT ENFORCED reason=" "$GP18"
hasout  GPM18a2 "VIOLATION" "$GP18"
GP18AR="$(gp_norm_repo advisory)"; GP18AT="$(printf '%s' "$GP18AR" | head -1)"; GP18AB="$(printf '%s' "$GP18AR" | tail -1)"
GP18A="$(bash "$FAKE/scripts/pre-merge-check.sh" "$GP18AT" --base "$GP18AB" 2>&1)"; check GPM18b 0 $?
hasout  GPM18b2 "GAP-PROBE: NOT ENFORCED reason=" "$GP18A"
nothas  GPM18b3 "VIOLATION" "$GP18A"

# ── GPM19: marker phai xuat hien DUNG MOT LAN va dong tong ket phai KHAI ────
echo "GPM19 marker dung mot dong + dong tong ket khai da tat"
GP19N="$(printf '%s' "$GP18" | grep -c 'GAP-PROBE: NOT ENFORCED')"
check  GPM19a 1 "$GP19N"
hasout GPM19b "gap-probe: KHÔNG cưỡng chế" "$GP18"
# khong co --base -> cung mot loi ra, khong phai mot kenh rieng
GP19C="$(bash "$SRC_ROOT/scripts/pre-merge-check.sh" "$GP18T" 2>&1)"
hasout GPM19c "GAP-PROBE: NOT ENFORCED reason=" "$GP19C"
```

- [ ] **Step 2: Chạy cho thấy ĐỎ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep GPM1[89]`
Expected: `GPM18a_exit` FAIL (đang exit 0), `GPM18a` FAIL (không có marker), `GPM19a` FAIL (đếm 0), `GPM19b` FAIL.

- [ ] **Step 3: Thêm hàm marker + nối ba nhánh**

Đặt ngay sau khối đọc config (sau khi `GAP_PROBE_MODE` đã có giá trị):

```bash
# Mọi đường mà luật gap-probe KHÔNG chạy được đều đi qua ĐÂY. Một hàm, một
# marker, một chỗ quyết định mode — vì kênh "NOTE rồi exit 0" đã giết contract
# v1 (ledger d-114) và suýt giết v3 (gap-probe P0-2). Ở `required` không cưỡng
# chế được nghĩa là KHÔNG cho merge: cổng không tự hạ chuẩn khi nó mù.
GP_NOT_ENFORCED=0
gap_probe_not_enforced() { # <lý do>
  [ "$GAP_PROBE_MODE" = "off" ] && return 0
  [ "$GP_NOT_ENFORCED" -eq 1 ] && return 0   # AC-16: ĐÚNG một dòng marker
  GP_NOT_ENFORCED=1
  echo "GAP-PROBE: NOT ENFORCED reason=$1"
  if [ "$GAP_PROBE_MODE" = "required" ]; then
    echo "VIOLATION [gap-probe]: mode required nhưng luật không cưỡng chế được — $1. Sửa nguyên nhân, hoặc hạ gap_probe xuống advisory nếu chấp nhận merge mà không có phản biện."
    violations=$((violations+1))
  else
    echo "NOTE: gap-probe không cưỡng chế được — $1 (advisory, không chặn merge)."
  fi
}
```

Thay nhánh `DIFF_READY=0` (dòng ~260) — bỏ `echo NOTE` cũ:

```bash
if [ "$GAP_PROBE_MODE" != "off" ] && [ "$DIFF_READY" -eq 0 ]; then
  gap_probe_not_enforced "$DIFF_SKIP_NOTE (luật chỉ xét slug có file trong diff PR)"
fi
```

Thay nhánh `-z "$gp_line"` trong vòng lặp (Task 3 để trống):

```bash
    if [ -z "$gp_line" ]; then
      if ! command -v node >/dev/null 2>&1; then
        gap_probe_not_enforced "không có \`node\` trên máy chạy pre-merge"
      elif [ ! -f "$GP_LIB" ]; then
        gap_probe_not_enforced "thiếu $GP_LIB (copy CẢ lib/ khi mang cổng vào repo)"
      else
        gap_probe_not_enforced "node lib/gap-probe.js classify thất bại trên $slug"
      fi
    else
```

Thêm vào dòng tổng kết cuối file, ngay trước khi in kết quả:

```bash
[ "$GP_NOT_ENFORCED" -eq 1 ] && echo "pre-merge-check: gap-probe: KHÔNG cưỡng chế trong lần chạy này (xem dòng GAP-PROBE: NOT ENFORCED ở trên)"
```

- [ ] **Step 4: Chạy cho thấy XANH**

Run: `bash tests/scripts/run-tests.sh`
Expected: toàn bộ PASS. `GPM15` cũ (assert `"skipped"`) SẼ ĐỎ — đó là đúng, Task 5 xử lý nó. Nếu muốn commit ở đây thì sửa `GPM15` trước; **không commit khi test đỏ**.

- [ ] **Step 5: Chứng minh BIẾT ĐỎ**

Đổi tạm marker thành `GAP-PROBE: NOT-ENFORCED` (dấu gạch thay space) → `GPM18a`, `GPM19a`, `GPM19c` PHẢI đỏ cùng lúc. Gỡ → xanh. Đây chính là ca "CI grep hụt một ký tự".

- [ ] **Step 6: Commit** (sau khi Task 5 Step 1 làm `GPM15` xanh, hoặc gộp commit với Task 5)

```bash
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh && git commit -m "feat(pre-merge): sàn fail-closed + marker GAP-PROBE: NOT ENFORCED (AC-14, AC-16)"
```

---

### Task 5: Hạ tầng diff-scope — VIOLATION thay vì "phạm vi rỗng"

**Files:**
- Modify: `scripts/pre-merge-check.sh` (không đổi logic, chỉ xác nhận đã đi qua `gap_probe_not_enforced`)
- Test: `tests/scripts/run-tests.sh` — `GPM15` viết lại, `GPM14` bổ sung nhánh `required`

**Interfaces:**
- Consumes: `gap_probe_not_enforced` từ Task 4
- Produces: (không)

**Evals phục vụ:** E18 (AC-17), E19 (AC-18)
**independent:** `false`

Đây là hai răng dựng riêng cho hạ tầng ở v2 mà bộ eval v3 **đã đánh rơi** (gap-probe P0-1). Task này khai lại chúng đích danh và nâng chuẩn từ "báo bỏ qua" lên "chặn ở required".

- [ ] **Step 1: Viết lại `GPM15` (dòng ~1885)**

```bash
echo "GPM15 git diff FAIL (lich su roi nhau) -> required phai CHAN, khong tin pham vi rong"
# ... giữ nguyên phần dựng repo orphan sẵn có tới dòng $GPM15_ORPH ...
# đổi config sang required trước khi chạy:
printf '%s\n' 'schema_version: 1' 'gap_probe: required' > "$R/_acceptance/config.yaml"
GPM15="$(bash "$CHECK" "$R" --base "$GPM15_ORPH" 2>&1)"; GPM15ST=$?
hasout GPM15a "GAP-PROBE: NOT ENFORCED reason=" "$GPM15"
hasout GPM15b "git diff" "$GPM15"
check  GPM15c 1 $GPM15ST
nothas GPM15d "no violations" "$GPM15"
```

- [ ] **Step 2: Bổ sung nhánh `required` cho `GPM14` (path shape monorepo)**

Tìm case `GPM14` hiện có (fixture `_acceptance/` nằm dưới `pkg/`), thêm ngay sau nó:

```bash
# AC-18: _acceptance/ ngoai git root — luat VAN phai chan, khong tat im lang
GPM14R="$(bash "$CHECK" "$GPM14_PKG" --base "$GPM14_BASE" 2>&1)"; GPM14RST=$?
hasout GPM14e "VIOLATION" "$GPM14R"
hasout GPM14f "chưa qua phản biện context sạch" "$GPM14R"
check  GPM14g 1 $GPM14RST
```

> Đọc case `GPM14` hiện có để lấy đúng tên biến repo/base — đừng đoán.

- [ ] **Step 3: Chạy**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep GPM1[45]`
Expected: toàn bộ PASS. `GPM15c` là ca chứng minh sàn fail-closed thật sự nối vào hạ tầng diff.

- [ ] **Step 4: Chứng minh BIẾT ĐỎ**

Tạm đổi `slug_in_diff` về `case "$f" in _acceptance/"$1"/*) return 0 ;;` (bỏ nhánh `*/`) → `GPM14e/f/g` PHẢI đỏ. Gỡ → xanh. Đây đúng lỗi HIGH của v2.

- [ ] **Step 5: Commit**

```bash
git add tests/scripts/run-tests.sh && git commit -m "test(gap-probe): khai lại GPM14/GPM15 đích danh cho AC-17/AC-18 (P0-1)"
```

---

### Task 6: AC-11 — sai chính tả config là VIOLATION, script chạy tiếp

**Files:**
- Modify: `scripts/pre-merge-check.sh` (khối `case "$cfg_gp"` dòng ~93–101 — kiểm chứ có thể đã đúng)
- Test: `tests/scripts/run-tests.sh` — bổ sung `GPM11c`, `GPM11c6`

**Interfaces:** Consumes: `violations` · Produces: (không)
**Evals phục vụ:** E11 (AC-11)
**independent:** `true` (không đụng luật gap-probe, chỉ đụng khối đọc config — chạy song song với Task 7/9 được)

- [ ] **Step 1: Viết case ĐỎ**

```bash
echo "GPM11c sai chinh ta gap_probe -> VIOLATION cau hinh, exit !=0, script CHAY TIEP"
GP11D="$(mktemp -d)"; mkdir -p "$GP11D/_acceptance/s"
printf '%s\n' 'schema_version: 1' 'gap_probe: requred' > "$GP11D/_acceptance/config.yaml"
GP11C="$(bash "$CHECK" "$GP11D" 2>&1)"; GP11CST=$?
check  GPM11c  1 $GP11CST
hasout GPM11c2 "VIOLATION [config]" "$GP11C"
hasout GPM11c3 "requred" "$GP11C"
hasout GPM11c4 "pre-merge-check:" "$GP11C"
nothas GPM11c5 "unbound variable" "$GP11C"
# KHONG duoc am tham roi ve advisory: mode sai thi khong duoc in NOTE advisory
nothas GPM11c6 "advisory, không chặn merge" "$GP11C"
```

- [ ] **Step 2: Chạy**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep GPM11c`
Expected: nếu tất cả PASS ngay → khối config đã đúng từ v2, ghi nhận và đi tiếp (đây là task **xác nhận**, không phải task sửa). Nếu `GPM11c` hoặc `GPM11c6` đỏ → sửa khối `case` để không rơi về `advisory`:

```bash
      *)
        echo "VIOLATION [config]: gap_probe: \"$cfg_gp\" không phải mode hợp lệ — dùng required | advisory | off (khoá vắng = advisory). KHÔNG rơi về advisory: một cổng tự hạ chuẩn vì sai chính tả đúng là false-green mà luật này sinh ra để chặn."
        violations=$((violations+1))
        GAP_PROBE_MODE="off" ;;   # luật gap-probe im, nhưng đã có VIOLATION nên không ai merge nhầm
```

- [ ] **Step 3: Chứng minh BIẾT ĐỎ**

Tạm đổi `violations=$((violations+1))` thành `:` → `GPM11c` PHẢI đỏ (exit 0). Gỡ → xanh.

- [ ] **Step 4: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh && git commit -m "fix(pre-merge): gap_probe sai chính tả là VIOLATION, không hạ chuẩn thầm (AC-11)"
```

---

### Task 7: AC-20 — bảng parity chạy qua CẢ HAI lối vào

**Files:**
- Modify: `tests/scripts/run-tests.sh` — `GPM21`
- Test: chính nó

**Interfaces:** Consumes: lib (Task 1), pre-merge (Task 3), gate-card (Task 2) · Produces: (không)
**Evals phục vụ:** E21 (AC-20)
**independent:** `false` (cần Task 1–3)

`GPM20` (Task 1) đo lib. `P38` (Task 2) đo cấu trúc. Task này đo cái còn thiếu: **hai lối vào cho cùng kết luận trên cùng bảng**.

- [ ] **Step 1: Viết case ĐỎ**

```bash
# ── GPM21: cung 8 dau vao -> gate-card va pre-merge phai KHOP TUNG CA ───────
echo "GPM21 parity theo bang: decision card vs pre-merge, tung ca mot"
GPM21_FAIL=0
gp_pair() { # <nhan> <ledger-json-hoac-rong> <ky-vong: descoped|missing>
  local T; T="$(mktemp -d)"; mkdir -p "$T/_acceptance/s"
  printf '%s\n' '---' 'schema_version: 1' 'slug: s' 'risk_tier: T3' 'status: implemented' '---' \
    > "$T/_acceptance/s/contract.md"
  [ -n "$2" ] && printf '%s\n' "$2" > "$T/_acceptance/s/decisions.jsonl"
  # lối vào A: lib (chính là đường gate-card đi, sau Task 2)
  local A; A="$(node "$SRC_ROOT/lib/gap-probe.js" classify "$T/_acceptance/s" | cut -f1)"
  # lối vào B: decision card, đọc cờ descoped từ --extract JSON
  local B; B="$(node "$SRC_ROOT/scripts/gate-card.js" "$T" --slug s --extract 2>/dev/null \
    | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write(JSON.parse(s).gap_probe.descoped?"descoped":"missing")}catch(e){process.stdout.write("ERR")}})')"
  if [ "$A" != "$3" ] || [ "$B" != "$3" ]; then
    echo "  LECH [$1]: lib=$A card=$B ky-vong=$3"; GPM21_FAIL=$((GPM21_FAIL+1))
  fi
  rm -rf "$T"
}
gp_pair "thuong"        '{"id":"d-1","type":"descope","decision":"bỏ gap-probe — x"}'  descoped
gp_pair "hoa"           '{"id":"d-2","type":"descope","decision":"BỎ gap-probe — x"}'  descoped
gp_pair "space-dau"     '{"id":"d-3","type":"descope","decision":"   bỏ gap-probe"}'   descoped
gp_pair "gap-probe-hoa" '{"id":"d-4","type":"descope","decision":"bỏ GAP-PROBE"}'      descoped
gp_pair "json-hong"     '{"id":"d-5","type":"descope","decision":"bỏ gap-probe,,,'     missing
gp_pair "type-khac"     '{"id":"d-6","type":"approach","decision":"bỏ gap-probe"}'     missing
gp_pair "decision-khac" '{"id":"d-7","type":"descope","decision":"bỏ mockup"}'         missing
gp_pair "ledger-vang"   ''                                                             missing
check GPM21 0 $GPM21_FAIL
```

- [ ] **Step 2: Chạy cho thấy ĐỎ nếu Task 2 chưa xong**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -A9 GPM21`
Expected sau Task 1–3: PASS, `GPM21_FAIL=0`. Nếu đỏ, dòng `LECH [...]` in ra **đúng ca nào lệch** — đó là giá trị của case này so với một ca đại diện.

- [ ] **Step 3: Chứng minh BIẾT ĐỎ**

Tạm revert Task 2 (đưa regex inline trở lại gate-card, sửa nó thành `/^bỏ gap-probe/` không `\s*`) → `GPM21` PHẢI đỏ và in `LECH [space-dau]`. Gỡ → xanh.

- [ ] **Step 4: Commit**

```bash
git add tests/scripts/run-tests.sh && git commit -m "test(gap-probe): bảng parity 8 ca qua cả hai lối vào (AC-20)"
```

---

### Task 8: E12 — sinh lại `premerge-messages.txt` rồi diff byte-đối-byte

**Files:**
- Modify: `tests/scripts/run-tests.sh` — `GPM12` viết lại
- Modify: `_acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt` (sinh lại)

**Interfaces:** Consumes: pre-merge sau Task 3–6 · Produces: (không)
**Evals phục vụ:** E12 (gác cổng cho E9/AC-9)
**independent:** `false`

Bản cũ chỉ đếm 4 nhãn — đo **đầy đủ**, không đo **xác thực** (gap-probe P1-5). Judge E9 đang chấm trên bằng chứng không ai buộc phải khớp mã.

- [ ] **Step 1: Viết lại `GPM12`**

```bash
# ── GPM12: evidence phai duoc SINH LAI tu 4 fixture trong CUNG lan chay ─────
echo "GPM12 premerge-messages.txt sinh lai roi diff byte-doi-byte"
GP12OUT="$(mktemp)"
{
  echo "# Sinh bởi tests/scripts/run-tests.sh (GPM12) — KHÔNG sửa tay."
  echo "## required + thiếu"
  gp_fixture_run required missing
  echo "## advisory + thiếu"
  gp_fixture_run advisory missing
  echo "## required + descope trong ledger"
  gp_fixture_run required descoped
  echo "## required + verdict probe-failed"
  gp_fixture_run required probe-failed
} > "$GP12OUT" 2>&1
if diff -u "$SRC_ROOT/_acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt" "$GP12OUT" >/dev/null; then
  check GPM12 0 0
else
  echo "  evidence LECH voi thong diep hien tai:"
  diff -u "$SRC_ROOT/_acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt" "$GP12OUT" | head -20
  check GPM12 0 1
fi
```

`gp_fixture_run <mode> <trạng-thái>` là helper mới, dựng repo tạm bằng đúng `gp_norm_repo` của Task 4 rồi chạy `pre-merge-check.sh`, in **chỉ** các dòng chứa `gap-probe` hoặc `GAP-PROBE` (lọc để diff không nhiễu bởi đường dẫn mktemp).

- [ ] **Step 2: Chạy cho thấy ĐỎ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -A20 GPM12`
Expected: FAIL, in diff cụ thể — evidence hiện tại viết cho bản v2 nên chắc chắn lệch.

- [ ] **Step 3: Sinh lại evidence**

Chạy suite một lần với biến môi trường ghi đè:

```bash
GPM12_WRITE=1 bash tests/scripts/run-tests.sh 2>&1 | grep GPM12
```

(thêm nhánh `[ "${GPM12_WRITE:-0}" = "1" ] && cp "$GP12OUT" "$SRC_ROOT/_acceptance/.../premerge-messages.txt"` trước lệnh `diff`).

- [ ] **Step 4: Chạy lại KHÔNG có biến ghi đè → XANH**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep GPM12`
Expected: PASS.

- [ ] **Step 5: Chứng minh BIẾT ĐỎ**

Sửa một chữ trong thông điệp VIOLATION của `pre-merge-check.sh` → `GPM12` PHẢI đỏ và in diff chỉ đúng dòng đó. Gỡ → xanh. **Đây là điểm khác biệt với bản cũ**: bản cũ vẫn xanh vì 4 nhãn còn nguyên.

- [ ] **Step 6: Commit**

```bash
git add tests/scripts/run-tests.sh _acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt && git commit -m "test(gap-probe): E12 sinh lại evidence rồi diff byte-đối-byte (P1-5)"
```

---

### Task 9: AC-15 — parity Codex cho `acceptance-init`

**Files:**
- Modify: `codex/acceptance-gate/skills/acceptance-init/SKILL.md`
- Test: `tests/plugins/run-tests.sh` — `P39`
- Run: `bash scripts/sync-plugin-packages.sh --write`

**Interfaces:** Consumes: (không) · Produces: (không)
**Evals phục vụ:** E16 (AC-15)
**independent:** `true` (không đụng file nào của Task 1–8)

`grep -c gap_probe codex/acceptance-gate/skills/acceptance-init/SKILL.md` hiện là **0** trong khi `commands/acceptance-init.md` đã có — đây là lệch parity hai harness thật, đúng loại mà CLAUDE.md gọi là invariant.

- [ ] **Step 1: Viết case ĐỎ**

```bash
echo "P39 acceptance-init parity 2 harness: khoa gap_probe + 3 mode"
for f in "$SRC_ROOT/commands/acceptance-init.md" \
         "$SRC_ROOT/codex/acceptance-gate/skills/acceptance-init/SKILL.md"; do
  n="$(basename "$(dirname "$f")")/$(basename "$f")"
  grep -q 'gap_probe:' "$f" && pass "P39[$n:key]" || fail "P39[$n:key]" "thieu khoa gap_probe"
  grep -q 'required | advisory | off' "$f" && pass "P39[$n:modes]" || fail "P39[$n:modes]" "thieu 3 mode"
done
```

- [ ] **Step 2: Chạy cho thấy ĐỎ**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep P39`
Expected: 2 case của `commands/` PASS, 2 case của `codex/` FAIL.

- [ ] **Step 3: Thêm khoá vào SKILL.md của Codex**

Chèn vào khối YAML mẫu của `codex/acceptance-gate/skills/acceptance-init/SKILL.md`, ngay dưới `enforcement:` (đúng vị trí như bản Claude):

```yaml
gap_probe: advisory          # Luật phản biện context sạch ở pre-merge check: required | advisory | off.
                             # `advisory` (mặc định khi khoá vắng) in NOTE khi một slug T2/T3 trong
                             # diff PR thiếu gap-probe.md và thiếu entry descope; `required` chặn merge
                             # VÀ chặn cả khi luật không cưỡng chế được (thiếu node/lib/--base).
```

- [ ] **Step 4: Chạy + sync mirror**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep P39` → 4/4 PASS.
Run: `bash scripts/sync-plugin-packages.sh --write && bash scripts/sync-plugin-packages.sh --check` → không drift.

- [ ] **Step 5: Commit**

```bash
git add codex/ plugins/ tests/plugins/run-tests.sh && git commit -m "fix(codex): acceptance-init khai gap_probe, parity 2 harness (AC-15)"
```

---

## Verify cuối (trước khi set `status: implemented`)

```bash
bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh && bash scripts/sync-plugin-packages.sh --check && node scripts/eval-coverage-lint.js .
```

Rồi tự chạy cổng của chính repo (self-host):

```bash
bash scripts/pre-merge-check.sh . --base main
```

**KHÔNG tự chạy evals để chấm điểm** — đó là việc của S4 với agent tươi.

## Self-Review

**Spec coverage — 20 AC:**

| AC | Task | AC | Task |
|---|---|---|---|
| AC-1 | 3 | AC-11 | 6 |
| AC-2 | 3 | AC-12 | 3 (vế trước) + 4 (vế sau) |
| AC-3 | 3 | AC-13 | 1 |
| AC-4 | 3 (theo cấu trúc: sau lọc `REQUIRED_FOR`) | AC-14 | 4 |
| AC-5 | 1 | AC-15 | 9 |
| AC-6 | 1 | AC-16 | 4 |
| AC-7 | 1 | AC-17 | 5 |
| AC-8 | 1 | AC-18 | 5 |
| AC-9 | 8 (gác cổng) + judge S4 | AC-19 | 2 |
| AC-10 | 3 (theo cấu trúc: sau lọc `status`) | AC-20 | 7 |

Không AC nào không có task.

**Placeholder scan:** không có "TBD" / "xử lý lỗi phù hợp" / "tương tự Task N". Ba chỗ nói "đọc case hiện có để lấy đúng tên biến" (Task 2 Step 1, Task 5 Step 2, Task 8 Step 1) là **chỉ dẫn có chủ đích** — chép sai tên biến của một suite 185 case là lớp lỗi đã xảy ra (`GP*` đụng tên), nên bắt đọc trước là rẻ hơn đoán.

**Type consistency:** `classify()` trả `{outcome, verdict, id}` ở Task 1; Task 3 đọc `outcome` + `id` từ dòng CLI `<outcome>\t<id>`; Task 7 đọc `cut -f1` = `outcome`. Tên `descopeId` dùng nhất quán ở Task 1/2/7. `gap_probe_not_enforced` (bash) và `GP_NOT_ENFORCED` khai ở Task 4, dùng ở Task 4/5.

**Thứ tự phụ thuộc:** 1 → 2 → 3 → 4 → 5 → 7 → 8. Task 6 và Task 9 `independent: true`, chạy lúc nào cũng được.
