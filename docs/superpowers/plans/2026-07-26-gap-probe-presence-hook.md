> **⛔ SUPERSEDED — KHÔNG THỰC THI PLAN NÀY.**
> Plan này dựng luật gap-probe trong hook write-time. Kiến trúc đó đã bị GỠ khỏi
> `main` sau 3 vòng S4 (19 finding, 2 lỗ HIGH không đóng được: đầu vào của guard
> nằm trong artifact đang bị ghi; kênh NOTE `stderr + exit 0` không giao được).
> Bản thay thế: [2026-07-26-gap-probe-premerge.md](2026-07-26-gap-probe-premerge.md).
> Xem `_acceptance/gap-probe-presence-hook/decisions.jsonl` d-20260726T180000Z-114.
> Giữ lại làm hồ sơ vì sao — đừng xoá.

# Gap-Probe Presence Hook — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hook `acceptance-evidence-gate` chặn (T3) hoặc nhắc (T2) khi một contract chuyển sang `status: approved` mà feature chưa qua phản biện context sạch (gap-probe).

**Architecture:** Toàn bộ luật quyết định nằm trong `lib/evidence-core.js` —
hàm thuần `evaluateContractWrite` được mở rộng nhận `opts.fileDir` (đúng tiền lệ
của `evaluateEvidence`) để đọc hai file anh em `gap-probe.md` và
`decisions.jsonl`. Hook chỉ làm việc in ấn. Nhánh contract của hook hiện **nhị
phân** (cho qua hoặc chặn) — chưa có kênh NOTE, mà 5/9 AC cần NOTE, nên Task 1
mở kênh đó trước.

**Tech Stack:** Node.js (CommonJS, không dependency ngoài), bash test harness
(`tests/hooks/run-tests.sh`, đang có 51 case, đặt tên `T01`…).

## Global Constraints

- **Enforce chỉ khi contract có `gap_probe_expected: true`.** Vắng marker =
  workspace legacy → NOTE tối đa, KHÔNG BAO GIỜ chặn (chuẩn F backward-tolerant).
- **Không hand-roll parser mới.** Dùng `frontmatterField` sẵn có trong
  `evidence-core.js`. Repo vừa phải vá cùng một bug section-scan ở 4 parser vì
  copy-paste — đừng trồng cái thứ 5.
- **Không đụng schema contract (giữ v2). Không thêm human gate mới.**
- **Luật khớp descope phải giống `gate-card.js`**: `type: "descope"` và
  `decision` bắt đầu bằng `bỏ gap-probe`, khớp không phân biệt hoa/thường, bỏ
  qua khoảng trắng đầu. Card và hook không được bất đồng.
- **Fail-open khi đọc file lỗi.** Một lint/hook hỏng không được chặn cổng;
  nhưng file TỒN TẠI mà verdict rác thì KHÔNG phải lỗi đọc — đó là AC-9.
- **`lib/` và `hooks/` là `t3_paths`** → mọi thay đổi phải kèm test.
- **Verify per-task:** `bash tests/hooks/run-tests.sh`.
  **Verify cuối cùng:** 3 suite + `bash scripts/sync-plugin-packages.sh --check`.
- **TDD bắt buộc:** viết test RED trước, chạy cho thấy đỏ, rồi mới implement.

## File Structure

| File | Trách nhiệm | Thay đổi |
|---|---|---|
| `lib/evidence-core.js` | Toàn bộ luật quyết định (thuần, không in ấn) | Thêm 2 helper + mở rộng `evaluateContractWrite` |
| `hooks/acceptance-evidence-gate.js` | In ấn + exit code | Truyền `{ fileDir }`, in `notes` |
| `tests/hooks/run-tests.sh` | Bằng chứng cho cả 9 AC | Thêm helper fixture + 9 case `T60`–`T68` |

Tất cả task đụng cùng 3 file → **không task nào `independent: true`**; chạy tuần tự.

---

### Task 1: Kênh NOTE cho nhánh contract + luật bỏ qua theo tier

**Files:**
- Modify: `lib/evidence-core.js` (hàm `evaluateContractWrite`, ~dòng 380)
- Modify: `hooks/acceptance-evidence-gate.js:137-139`
- Test: `tests/hooks/run-tests.sh`

**Evals phục vụ:** E8 (AC-8). **independent: false.**

**Interfaces:**
- Produces: `evaluateContractWrite(newPayload, oldPayload, opts)` nay trả
  `{ failures: string[], notes: string[], anyFailure: boolean }`. `opts` là
  object tuỳ chọn `{ fileDir?: string }`. Gọi không có `opts` vẫn chạy (mọi
  caller cũ an toàn).

- [ ] **Step 1: Thêm helper fixture + case RED vào `tests/hooks/run-tests.sh`**

Chèn vào cuối file, TRƯỚC khối tổng kết `if [ "$FAIL_COUNT" ...`:

```bash
# ─── Gap-probe presence guard (T60+) ────────────────────────────────────────
GPD="$HERE/fixtures/gapprobe"
# mk_gp <case> <tier|-> <expected:yes|no> <verdict|-|touch> <descope:yes|no|upper>
# Dựng thư mục workspace rồi ECHO ra nội dung contract.md để nhét vào payload.
mk_gp() {
  local d="$GPD/$1"; rm -rf "$d"; mkdir -p "$d"
  case "$4" in
    -)     : ;;                                            # không có file
    touch) : > "$d/gap-probe.md" ;;                        # file rỗng (AC-9)
    *)     printf -- '---\nslug: x\nverdict: %s\n---\n' "$4" > "$d/gap-probe.md" ;;
  esac
  case "$5" in
    yes)   printf '%s\n' '{"id":"d-1","type":"descope","decision":"bỏ gap-probe — quá nhỏ"}' > "$d/decisions.jsonl" ;;
    upper) printf '%s\n' '{"id":"d-2","type":"descope","decision":"  Bỏ gap-probe — viết hoa"}' > "$d/decisions.jsonl" ;;
  esac
  printf -- '---\nschema_version: 1\nslug: x\n'
  [ "$2" != "-" ] && printf 'risk_tier: %s\n' "$2"
  [ "$3" = "yes" ] && printf 'gap_probe_expected: true\n'
  printf 'status: approved\napproved_by: Tester\napproved_at: 2026-07-26\n---\n'
}
# gp_run <case> -> chạy hook với contract.md của case đó, in stderr, trả exit
gp_run() { payload Write "$GPD/$1/contract.md" "$2" | node "$HOOK" 2>"$GPD/$1.err"; }

echo "T60 T1 tier -> bỏ qua hoàn toàn (exit 0, stderr không nhắc gap-probe)"
C="$(mk_gp t60 T1 yes - no)"; gp_run t60 "$C"; check T60 0 $?
grep -qi "gap-probe" "$GPD/t60.err" && check T60-silent 0 1 || check T60-silent 0 0

echo "T61 contract KHÔNG có risk_tier -> bỏ qua hoàn toàn"
C="$(mk_gp t61 - yes - no)"; gp_run t61 "$C"; check T61 0 $?
grep -qi "gap-probe" "$GPD/t61.err" && check T61-silent 0 1 || check T61-silent 0 0
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `bash tests/hooks/run-tests.sh 2>&1 | grep -E "T60|T61"`
Expected: `T60`/`T61` PASS (exit 0 vì chưa có luật nào) nhưng đây là **pass rỗng** —
ghi nhận và đi tiếp; case thật sự bảo vệ luật này là T62+ ở Task 3. Nếu bất kỳ
case nào FAIL thì dừng, đọc lỗi.

- [ ] **Step 3: Mở kênh `notes` trong `lib/evidence-core.js`**

Sửa chữ ký và thân `evaluateContractWrite`:

```js
function evaluateContractWrite(newPayload, oldPayload, opts) {
  const failures = [];
  const notes = [];
  const status = (frontmatterField(newPayload, 'status') || '').toLowerCase();
  const approvedBy = frontmatterField(newPayload, 'approved_by') || '';
  const gate1Skipped = /^(true|yes|1)$/i.test(frontmatterField(newPayload, 'gate1_skipped') || '');
  const oldStatus = oldPayload == null ? null : (frontmatterField(oldPayload, 'status') || '').toLowerCase();

  if (!approvedBy && !gate1Skipped) {
    if (status === 'approved' || status === 'signed-off') {
      failures.push(`status: ${status} with empty approved_by — Gate 1 approval not recorded. Fill approved_by (+ approved_at); only when the user explicitly skips Gate 1, record gate1_skipped: true (audited, pre-merge NOTEs it).`);
    }
    if ((oldStatus === null || oldStatus === 'draft') && (status === 'implemented' || status === 'verified')) {
      failures.push(`status: ${oldStatus === null ? '(new file)' : 'draft'} -> ${status} skips Gate 1 — approved_by is empty and gate1_skipped is not true. Lifecycle: draft -> approved (Gate 1) -> implemented -> verified -> signed-off (Gate 2).`);
    }
  }

  // Gap-probe guard — chỉ xét đúng khoảnh khắc chuyển sang `approved`, và chỉ
  // với T2/T3. T1 (hoặc contract không khai risk_tier) không có nghi thức
  // gap-probe nào để thiếu, nên im lặng tuyệt đối.
  const tier = (frontmatterField(newPayload, 'risk_tier') || '').toUpperCase();
  if (status === 'approved' && (tier === 'T2' || tier === 'T3')) {
    // Task 2 và Task 3 điền luật vào đây.
  }

  return { failures, notes, anyFailure: failures.length > 0 };
}
```

- [ ] **Step 4: Hook in `notes` và truyền `fileDir`**

Trong `hooks/acceptance-evidence-gate.js`, thay khối bắt đầu ở dòng 137:

```js
    if (isContract) {
      const cr = core.evaluateContractWrite(payload, existing, { fileDir });
      // NOTE là kênh RIÊNG với block: nó luôn in ra stderr rồi cho ghi tiếp.
      // Một cảnh báo không được đổi exit code — nếu không, "nhắc" và "chặn"
      // nhập làm một và AC-3/AC-5/AC-7 không tồn tại được.
      if (cr.notes && cr.notes.length) {
        process.stderr.write(
          '\nNOTE from acceptance-evidence-gate (Gate-1 contract guard)\n'
          + cr.notes.map(n => `  - ${n}`).join('\n') + '\n\n');
      }
      if (!cr.anyFailure) {
        process.stdout.write(data);
        process.exit(0);
      }
```

Phần còn lại của khối (`const cfg = readEnforcement(fileDir);` trở xuống) giữ nguyên.

- [ ] **Step 5: Chạy toàn bộ suite — không được vỡ case cũ**

Run: `bash tests/hooks/run-tests.sh`
Expected: `Results: 55 passed, 0 failed` (51 cũ + 4 mới của T60/T61).

- [ ] **Step 6: Commit**

```bash
git add lib/evidence-core.js hooks/acceptance-evidence-gate.js tests/hooks/run-tests.sh
git commit -m "feat(hook): kênh NOTE cho nhánh contract + khung gap-probe guard (AC-8)"
```

---

### Task 2: Đọc `gap-probe.md` — clean/findings cho qua, probe-failed NOTE

**Files:**
- Modify: `lib/evidence-core.js`
- Test: `tests/hooks/run-tests.sh`

**Evals phục vụ:** E1 (AC-1), E5 (AC-5). **independent: false.**

**Interfaces:**
- Consumes: `evaluateContractWrite(..., { fileDir })` từ Task 1.
- Produces: `readGapProbeState(fileDir) -> 'ok' | 'probe-failed' | 'missing'`
  (nội bộ module, không export).

- [ ] **Step 1: Viết case RED**

Chèn sau case T61:

```bash
echo "T62 T3 + verdict clean -> cho qua, im lặng"
C="$(mk_gp t62 T3 yes clean no)"; gp_run t62 "$C"; check T62 0 $?
grep -qi "gap-probe" "$GPD/t62.err" && check T62-silent 0 1 || check T62-silent 0 0

echo "T63 T3 + verdict findings -> cho qua, im lặng"
C="$(mk_gp t63 T3 yes findings no)"; gp_run t63 "$C"; check T63 0 $?
grep -qi "gap-probe" "$GPD/t63.err" && check T63-silent 0 1 || check T63-silent 0 0

echo "T64 T3 + verdict probe-failed -> NOTE, KHÔNG chặn"
C="$(mk_gp t64 T3 yes probe-failed no)"; gp_run t64 "$C"; check T64 0 $?
grep -qi "probe-failed" "$GPD/t64.err" && check T64-note 0 0 || check T64-note 0 1
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `bash tests/hooks/run-tests.sh 2>&1 | grep -E "T62|T63|T64"`
Expected: `T64-note` **FAIL** (chưa có NOTE nào được in). T62/T63 pass rỗng.

- [ ] **Step 3: Thêm `readGapProbeState` vào `lib/evidence-core.js`**

Đặt ngay TRƯỚC `function evaluateContractWrite`:

```js
// ─── Gap-probe presence (phản biện context sạch ở Gate 1) ──────────────────

// 'ok' | 'probe-failed' | 'missing'.
// Một file TỒN TẠI nhưng không mang verdict nhận diện được thì tính là MISSING:
// nếu không, `touch gap-probe.md` đi thẳng qua chốt fail-stop (AC-9).
function readGapProbeState(fileDir) {
  if (!fileDir) return 'missing';
  let text;
  try { text = fs.readFileSync(path.join(fileDir, 'gap-probe.md'), 'utf8'); }
  catch (_) { return 'missing'; }
  const verdict = (frontmatterField(text, 'verdict') || '').toLowerCase();
  if (verdict === 'clean' || verdict === 'findings') return 'ok';
  if (verdict === 'probe-failed') return 'probe-failed';
  return 'missing';
}
```

- [ ] **Step 4: Nối vào `evaluateContractWrite`**

Thay dòng `// Task 2 và Task 3 điền luật vào đây.` bằng:

```js
    const state = readGapProbeState(opts && opts.fileDir);
    if (state === 'probe-failed') {
      notes.push('gap-probe.md có verdict: probe-failed — phản biện KHÔNG chạy được. Duyệt lúc này nghĩa là duyệt mà chưa có phản biện context sạch.');
    }
```

- [ ] **Step 5: Chạy để thấy XANH**

Run: `bash tests/hooks/run-tests.sh`
Expected: `Results: 60 passed, 0 failed`.

- [ ] **Step 6: Commit**

```bash
git add lib/evidence-core.js tests/hooks/run-tests.sh
git commit -m "feat(hook): đọc verdict gap-probe — clean/findings im lặng, probe-failed NOTE (AC-1, AC-5)"
```

---

### Task 3: Thiếu phản biện — chặn ở T3, nhắc ở T2, và `touch` rỗng không lọt

**Files:**
- Modify: `lib/evidence-core.js`
- Test: `tests/hooks/run-tests.sh`

**Evals phục vụ:** E2 (AC-2), E3 (AC-3), E7 (AC-7), E9 (AC-9). **independent: false.**

**Interfaces:**
- Consumes: `readGapProbeState` từ Task 2.

- [ ] **Step 1: Viết case RED**

```bash
echo "T65 T3 + marker + thiếu cả file lẫn descope -> CHẶN (exit 2)"
C="$(mk_gp t65 T3 yes - no)"; gp_run t65 "$C"; check T65 2 $?
grep -qi "gap-probe" "$GPD/t65.err" && check T65-msg 0 0 || check T65-msg 0 1

echo "T66 T2 + marker + thiếu cả hai -> NOTE, KHÔNG chặn"
C="$(mk_gp t66 T2 yes - no)"; gp_run t66 "$C"; check T66 0 $?
grep -qi "gap-probe" "$GPD/t66.err" && check T66-note 0 0 || check T66-note 0 1

echo "T67 T3 KHÔNG có gap_probe_expected (legacy) -> NOTE, KHÔNG BAO GIỜ chặn"
C="$(mk_gp t67 T3 no - no)"; gp_run t67 "$C"; check T67 0 $?
grep -qi "gap-probe" "$GPD/t67.err" && check T67-note 0 0 || check T67-note 0 1

echo "T68 T3 + marker + gap-probe.md RỖNG (touch) -> vẫn CHẶN (chống bypass)"
C="$(mk_gp t68 T3 yes touch no)"; gp_run t68 "$C"; check T68 2 $?

echo "T69 T2 + marker + gap-probe.md RỖNG -> NOTE (không chặn ở T2)"
C="$(mk_gp t69 T2 yes touch no)"; gp_run t69 "$C"; check T69 0 $?
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `bash tests/hooks/run-tests.sh 2>&1 | grep -E "T65|T66|T67|T68|T69"`
Expected: `T65` FAIL (expected exit 2, got 0), `T68` FAIL (expected 2, got 0),
`T65-msg`/`T66-note`/`T67-note` FAIL (chưa có thông điệp nào).

- [ ] **Step 3: Implement luật định tuyến**

Bổ sung vào khối gap-probe trong `evaluateContractWrite`, ngay sau nhánh
`probe-failed`:

```js
    else if (state === 'missing') {
      // Marker `gap_probe_expected` do feature-loop S1 (≥1.19) ghi. Vắng marker
      // = workspace sinh trước nghi thức này → nhắc thì được, chặn thì không:
      // một luật mới không được hồi tố lên artifact cũ (chuẩn F).
      const expected = /^(true|yes|1)$/i.test(frontmatterField(newPayload, 'gap_probe_expected') || '');
      const how = 'Chạy bước S1#7 (phản biện context sạch) để sinh gap-probe.md, HOẶC ghi vào decisions.jsonl một entry {"type":"descope","decision":"bỏ gap-probe — <lý do>"}.';
      if (tier === 'T3' && expected) {
        failures.push(`gap-probe.md thiếu (hoặc verdict không đọc được) và ledger không có entry descope "bỏ gap-probe" — contract T3 không được duyệt khi chưa qua phản biện context sạch. ${how}`);
      } else {
        notes.push(`Chưa có phản biện context sạch: gap-probe.md thiếu (hoặc verdict không đọc được) và ledger không có entry descope.${expected ? '' : ' (workspace không khai gap_probe_expected — chỉ nhắc, không chặn.)'} ${how}`);
      }
    }
```

- [ ] **Step 4: Chạy để thấy XANH**

Run: `bash tests/hooks/run-tests.sh`
Expected: `Results: 68 passed, 0 failed`.

- [ ] **Step 5: Commit**

```bash
git add lib/evidence-core.js tests/hooks/run-tests.sh
git commit -m "feat(hook): thiếu gap-probe chặn T3 / nhắc T2; file rỗng tính là thiếu (AC-2, AC-3, AC-7, AC-9)"
```

---

### Task 4: Van thoát — entry `descope` trong ledger

**Files:**
- Modify: `lib/evidence-core.js`
- Test: `tests/hooks/run-tests.sh`

**Evals phục vụ:** E4 (AC-4). **independent: false.**

**Interfaces:**
- Produces: `findGapProbeDescope(fileDir) -> string | null` (id của entry, hoặc
  `null`). Nội bộ module.

- [ ] **Step 1: Viết case RED**

```bash
echo "T70 T3 thiếu file NHƯNG ledger có descope 'bỏ gap-probe' -> cho qua + NOTE trỏ id"
C="$(mk_gp t70 T3 yes - yes)"; gp_run t70 "$C"; check T70 0 $?
grep -q "d-1" "$GPD/t70.err" && check T70-id 0 0 || check T70-id 0 1

echo "T71 descope viết HOA + thụt đầu dòng -> vẫn khớp (cùng luật /i với card)"
C="$(mk_gp t71 T3 yes - upper)"; gp_run t71 "$C"; check T71 0 $?
grep -q "d-2" "$GPD/t71.err" && check T71-id 0 0 || check T71-id 0 1

echo "T72 ledger có dòng JSON hỏng + entry descope hợp lệ -> vẫn khớp (parse khoan dung)"
mkdir -p "$GPD/t72"; C="$(mk_gp t72 T3 yes - no)"
printf '%s\n' 'khong-phai-json' '{"id":"d-9","type":"descope","decision":"bỏ gap-probe — ok"}' > "$GPD/t72/decisions.jsonl"
gp_run t72 "$C"; check T72 0 $?
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `bash tests/hooks/run-tests.sh 2>&1 | grep -E "T70|T71|T72"`
Expected: `T70`/`T71`/`T72` FAIL (expected exit 0, got 2) — hiện đang bị chặn vì
chưa có van thoát.

- [ ] **Step 3: Thêm `findGapProbeDescope`**

Đặt ngay sau `readGapProbeState`:

```js
// Van thoát của ledger: một entry `descope` tường minh có `decision` mở đầu
// bằng "bỏ gap-probe". Khớp không phân biệt hoa/thường và bỏ qua khoảng trắng
// đầu — ĐÚNG luật gate-card.js dùng, để thẻ và hook không bao giờ bất đồng.
// Dòng JSON hỏng bị bỏ qua chứ không làm hỏng cả file: ledger là sổ ghi lý do,
// một dòng lỗi không được biến thành chặn cổng.
function findGapProbeDescope(fileDir) {
  if (!fileDir) return null;
  let text;
  try { text = fs.readFileSync(path.join(fileDir, 'decisions.jsonl'), 'utf8'); }
  catch (_) { return null; }
  for (const line of text.split('\n')) {
    const s = line.trim();
    if (!s) continue;
    let e;
    try { e = JSON.parse(s); } catch (_) { continue; }
    if (e && e.type === 'descope' && /^\s*bỏ gap-probe/i.test(String(e.decision || ''))) {
      return String(e.id || '(entry không có id)');
    }
  }
  return null;
}
```

- [ ] **Step 4: Nối vào nhánh `missing`**

Thay phần đầu của nhánh `else if (state === 'missing') {` để kiểm van thoát TRƯỚC:

```js
    else if (state === 'missing') {
      const descope = findGapProbeDescope(opts && opts.fileDir);
      if (descope) {
        notes.push(`Phản biện context sạch đã được BỎ có chủ đích theo ledger ${descope} — duyệt mà không có phản biện là quyết định đã ghi vết, không phải sơ suất.`);
      } else {
        const expected = /^(true|yes|1)$/i.test(frontmatterField(newPayload, 'gap_probe_expected') || '');
        const how = 'Chạy bước S1#7 (phản biện context sạch) để sinh gap-probe.md, HOẶC ghi vào decisions.jsonl một entry {"type":"descope","decision":"bỏ gap-probe — <lý do>"}.';
        if (tier === 'T3' && expected) {
          failures.push(`gap-probe.md thiếu (hoặc verdict không đọc được) và ledger không có entry descope "bỏ gap-probe" — contract T3 không được duyệt khi chưa qua phản biện context sạch. ${how}`);
        } else {
          notes.push(`Chưa có phản biện context sạch: gap-probe.md thiếu (hoặc verdict không đọc được) và ledger không có entry descope.${expected ? '' : ' (workspace không khai gap_probe_expected — chỉ nhắc, không chặn.)'} ${how}`);
        }
      }
    }
```

- [ ] **Step 5: Chạy để thấy XANH**

Run: `bash tests/hooks/run-tests.sh`
Expected: `Results: 73 passed, 0 failed`.

- [ ] **Step 6: Commit**

```bash
git add lib/evidence-core.js tests/hooks/run-tests.sh
git commit -m "feat(hook): van thoát descope 'bỏ gap-probe' trong ledger (AC-4)"
```

---

### Task 5: Thu thập thông điệp cho eval judgment + chốt toàn bộ

**Files:**
- Create: `_acceptance/gap-probe-presence-hook/evidence/hook-messages.txt`
- Test: `tests/hooks/run-tests.sh` (không thêm case; chỉ chạy)

**Evals phục vụ:** E6 (AC-6, judgment). **independent: false.**

**Interfaces:**
- Consumes: mọi thông điệp `failures`/`notes` từ Task 1–4. `evals.yaml` khai
  `inputs: [evidence/hook-messages.txt]` — file này PHẢI tồn tại thì judge mới
  chấm được.

- [ ] **Step 1: Sinh file thông điệp từ chính hook đang chạy**

Không chép tay — trích từ stderr thật để thông điệp được chấm đúng bản đã ship:

```bash
cd "$(git rev-parse --show-toplevel)"
OUT=_acceptance/gap-probe-presence-hook/evidence/hook-messages.txt
mkdir -p "$(dirname "$OUT")"
{
  echo "# Thông điệp hook gap-probe guard — trích từ stderr THẬT, không chép tay."
  echo "# Sinh lại: xem Task 5 trong docs/superpowers/plans/2026-07-26-gap-probe-presence-hook.md"
  for c in t65 t66 t67 t70 t64; do
    echo; echo "── case $c ──"
    cat "tests/hooks/fixtures/gapprobe/$c.err" 2>/dev/null || echo "(chưa chạy suite)"
  done
} > "$OUT"
```

- [ ] **Step 2: Đọc lại bằng mắt — đây chính là thứ AC-6 hỏi**

Mở `_acceptance/gap-probe-presence-hook/evidence/hook-messages.txt`. Với mỗi
thông điệp, tự trả lời: *một người mới đọc xong có biết phải làm gì tiếp
không?* Thông điệp nào không trả lời được thì sửa chuỗi trong
`lib/evidence-core.js`, chạy lại suite, sinh lại file. **Không** đánh dấu AC-6
là xong ở đây — verdict của nó thuộc về Gate 2, do người chấm.

- [ ] **Step 3: Chạy toàn bộ verify**

```bash
bash tests/hooks/run-tests.sh
bash tests/scripts/run-tests.sh
bash tests/plugins/run-tests.sh
bash scripts/sync-plugin-packages.sh --check
```
Expected: cả 4 exit 0. `Results: 73 passed, 0 failed` (hooks) · `237 passed`
(scripts) · `all plugin tests passed` · `plugins/ mirror in sync.`

- [ ] **Step 4: Đồng bộ mirror rồi commit**

`lib/` và `hooks/` được sync sang `plugins/acceptance-gate/` — quên bước này là
test P30 đỏ.

```bash
bash scripts/sync-plugin-packages.sh
git add lib/ hooks/ tests/ plugins/ _acceptance/gap-probe-presence-hook/evidence/
git commit -m "feat(hook): thu thập thông điệp cho eval judgment E6 + sync mirror"
```

- [ ] **Step 5: Đặt contract sang `implemented`**

```bash
# Sửa frontmatter qua công cụ file-edit của agent để hook validate transition.
# status: approved -> implemented
```
Rồi DỪNG. S4 VERIFY là việc của ngữ cảnh khác (doer ≠ grader) — không tự chấm.

---

## Self-Review

**1. Phủ spec:** 9/9 AC có task. E1→T2 · E2→T3 · E3→T3 · E4→T4 · E5→T2 · E6→T5 ·
E7→T3 · E8→T1 · E9→T3. Không AC nào không có task.

**2. Quét chỗ trống:** không có "TBD"/"xử lý lỗi phù hợp"/"tương tự Task N".
Mọi bước sửa code đều có code thật; mọi bước chạy đều có lệnh + kết quả mong đợi.

**3. Nhất quán kiểu:** `readGapProbeState` trả đúng 3 chuỗi `'ok' |
'probe-failed' | 'missing'` ở cả Task 2 và Task 3. `findGapProbeDescope` trả
`string | null` ở Task 4, và Task 4 dùng đúng dạng đó. `evaluateContractWrite`
nhận `opts` object ở Task 1 và mọi task sau đọc `opts && opts.fileDir` nhất quán.

**Rủi ro đã biết:** Task 3 viết một nhánh `else if (state === 'missing')` rồi
Task 4 THAY nó. Chủ ý — Task 3 phải xanh độc lập để có gate riêng; nếu gộp thì
van thoát và luật chặn không tách được cho reviewer. Người thực thi Task 4 phải
thay nguyên khối, không chèn thêm.
