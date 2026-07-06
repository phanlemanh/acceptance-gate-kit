# Đợt 4 — Decision Ledger (Đợt A) + Design Lane Switches — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `decisions.jsonl` (sổ rationale Pareto trong slug, card render 2 gate, resume-read) + cổng design 2-công-tắc (static luôn-bật khi chạm UI; ceremony đắt human bật cuối-S1; 0 field mới) theo 2 spec đã chốt.

**Architecture:** Mọi thứ additive quanh 4 điểm chạm: `gate-card.js` (parse + render ledger — deterministic layer), 2 SKILL.md (feature-loop = write-path/resume/bảng-tra-guard; design-subtrack = per-stage theo 2 công tắc), 2 script design-loop (flag `--require-html`; key `design.surface_globs`). Trạng thái lane derive từ artifact (provenance ∨ executor fidelity trong evals) — không lưu field. Mirror acceptance-gate bằng `scripts/sync-plugin-packages.sh`, KHÔNG sửa tay `plugins/`.

**Tech Stack:** Node ≥18 CommonJS (`gate-card.js`) / ESM (`.mjs`), bash test suites (`tests/scripts/run-tests.sh`, `tests/plugins/run-tests.sh`), SKILL.md prose VN.

**Specs (nguồn yêu cầu — đọc trước khi làm task):**
- `docs/specs/2026-07-06-decision-ledger-design.md` (ledger)
- `docs/specs/2026-07-06-design-lane-switches-design.md` (lane)

## Global Constraints

- Ledger KHÔNG BAO GIỜ override contract/evals — chỉ rationale (ledger-spec §3).
- KHÔNG human gate mới; KHÔNG đổi state machine `contract.status`; KHÔNG field mới trong contract frontmatter (lane-spec header).
- `decisions.jsonl` vắng → resume/grader no-op; card in đúng 1 dòng info trung tính "(chưa ghi quyết định nào)" (enforcement-via-card).
- Guard 🎨 = bảng tra + câu nhị phân; KHÔNG viết 3 nhánh per-guard (lane-spec C5).
- Parse ledger per-line khoan dung: dòng hỏng → skip + đếm + hiện card; KHÔNG YAML/JSON5 lib mới.
- Chỉ sửa bản ROOT (`commands/`, `skills/`, `scripts/`, `feature-loop/`, `design-loop/`); `plugins/acceptance-gate/` sinh bằng `bash scripts/sync-plugin-packages.sh`.
- `plugins/feature-loop-codex/` KHÔNG ĐỤNG đợt này (WIP wave riêng) — port ledger/lane sang codex là follow-up sau khi wave đó ship.
- Commit style repo: `<type>(<scope>): <mô tả tiếng Việt>`, không Co-Authored-By.
- Grader/`decisionsPath` (ledger-spec §7 Đợt B) NGOÀI phạm vi plan này.

---

### Task 0: Đóng băng working tree (GATE — cần user, không giao subagent)

Working tree đang có wave WIP chưa commit (~29 file, +569 dòng: port Codex design-loop — `design-loop/.codex-plugin/` untracked, marketplace +12 dòng, feature-loop-codex SKILL +89 dòng, docs). Plan này sửa TRÙNG nhiều file đó (`commands/acceptance-card.md`, `design-loop/skills/design-subtrack/SKILL.md`, `design-loop/scripts/design-config-patch.mjs`, `tests/plugins/run-tests.sh`, GUIDE/QUICKSTART).

- [ ] **Step 1:** Trình user `git status` + `git diff --stat`, hỏi: commit wave WIP thành commit riêng (khuyến nghị — có vẻ là wave hoàn chỉnh), hay stash?
- [ ] **Step 2:** User quyết xong, xác nhận `git status` sạch (chỉ còn untracked ngoài phạm vi nếu user chọn giữ). KHÔNG tự commit thay user — wave đó không phải của plan này.
- [ ] **Step 3:** Chạy baseline: `bash tests/scripts/run-tests.sh && bash tests/plugins/run-tests.sh` — ghi số PASS/FAIL làm mốc (suite phải xanh trước khi bắt đầu; đỏ → dừng, báo user).

---

### Task 1: gate-card.js — đọc & render decisions.jsonl (ledger-spec §6b/§6c)

**Files:**
- Modify: `scripts/gate-card.js` (239 dòng)
- Modify: `docs/specs/2026-07-06-decision-ledger-design.md` (1 dòng §10 — sửa mâu thuẫn spec)
- Test: `tests/scripts/run-tests.sh` (thêm section sau block gate-card hiện có, ~dòng 330)

**Interfaces:**
- Consumes: format ledger (ledger-spec §4): mỗi dòng `{"id","type","stage","at","decision","impact",["serves"],["revisit"],["supersedes"]}`; seal = `{"id","type":"seal","gate":1,"at"}`.
- Produces (Task 2 và test dùng):
  - Hàm `readLedger(dir)` → `{ entries: Array<object>, broken: number, sealIdx: number|null }` (entries GIỮ thứ tự file; sealIdx = index entry seal gate 1 đầu tiên trong `entries`, null nếu chưa seal; entry seal vẫn nằm trong `entries`).
  - EXTRACT gate 1 thêm key `decisions: [{id,type,stage,decision,impact}]` (mọi entry ≠ seal) + `decisions_broken: N`.
  - EXTRACT gate 2 thêm `decisions_approved` (trước seal), `decisions_provisional` (sau seal), `decisions_broken`.
  - Render nhận overlay `pl.decisions_plain[] → {id, p}` từ card-plain.json.

- [ ] **Step 0: Sửa mâu thuẫn spec (1 dòng).** `docs/specs/2026-07-06-decision-ledger-design.md` §10 hiện viết "decisions.jsonl vắng → resume/card/grader hành xử y hệt hiện tại (no-op)" — mâu thuẫn §6b (card phải in ô-trống-hiện-hình). Sửa thành: "decisions.jsonl vắng → resume/grader no-op; card in 1 dòng info trung tính '(chưa ghi quyết định nào)' — chính là enforcement §6b." Commit: `docs(specs): decision-ledger — sửa mâu thuẫn §10 vs §6b (card ô-trống-hiện-hình)`.

- [ ] **Step 1: Viết test FAIL.** Thêm vào `tests/scripts/run-tests.sh` ngay SAU block Gate-2 gate-card hiện có (sau dòng `hasout G10 ...`; đặt trước phần suite kế tiếp):

```bash
echo "D01-08 decisions.jsonl on gate-card"
# Gate 1 khi CHƯA có ledger → 1 dòng info trung tính
sed -i.bak 's/^status: verified/status: approved/' "$GC/contract.md" && rm -f "$GC/contract.md.bak"
rm -f "$GC/evidence-report.md"
G1D="$(node "$GCARD" --root "$T/gcard" --slug gfeat 2>/dev/null)"
hasout D01 "chưa ghi quyết định nào" "$G1D"
# Ledger: 2 entry thật (descope sau approach — card phải đảo descope lên đầu) + seal + 1 dòng hỏng + 1 provisional
cat > "$GC/decisions.jsonl" <<'EOF'
{"id":"d-20260706T010000Z-1","type":"approach","stage":"S1","at":"2026-07-06T01:00:00Z","decision":"Dùng polling thay webhook","impact":"đơn giản hơn · trễ tối đa 60s"}
{"id":"d-20260706T010100Z-2","type":"descope","stage":"S1","at":"2026-07-06T01:01:00Z","decision":"KHÔNG làm realtime broadcast","impact":"tiết kiệm 1 sprint · user chờ refresh"}
not-json-line
{"id":"d-20260706T020000Z-3","type":"seal","gate":1,"at":"2026-07-06T02:00:00Z"}
{"id":"d-20260706T030000Z-4","type":"fix","stage":"S4-r1","at":"2026-07-06T03:00:00Z","decision":"Fix bằng debounce 300ms","impact":"tránh double-fire · thêm 300ms trễ"}
EOF
G1L="$(node "$GCARD" --root "$T/gcard" --slug gfeat 2>/dev/null)"
hasout D02 "Quyết định &amp; trade-off" "$G1L"
hasout D03 "KHÔNG làm realtime broadcast" "$G1L"
hasout D04 "1 dòng ledger hỏng" "$G1L"
# descope đứng TRƯỚC approach trong HTML
case "$G1L" in *"KHÔNG làm realtime broadcast"*"Dùng polling thay webhook"*) echo "  PASS: D05";  PASS_COUNT=$((PASS_COUNT+1));; *) echo "  FAIL: D05 (descope not first)"; FAIL_COUNT=$((FAIL_COUNT+1));; esac
hasout D06 '"decisions"' "$(node "$GCARD" --root "$T/gcard" --slug gfeat --extract 2>/dev/null)"
# Gate 2: provisional (sau seal) tách khối "CHƯA duyệt"
sed -i.bak 's/^status: approved/status: verified/' "$GC/contract.md" && rm -f "$GC/contract.md.bak"
cat > "$GC/evidence-report.md" <<'EOF'
---
schema_version: 1
feature_slug: gfeat
verdict: PASS
---
| Eval | Crit | Exec | Verdict |
|------|------|------|---------|
| E1 | AC-1 | script | PASS |
## Evidence
- eval: E1
  run_id: abcd1234
  exit_code: 0
  verifier: config:executors.test.api
EOF
G2L="$(node "$GCARD" --root "$T/gcard" --slug gfeat 2>/dev/null)"
hasout D07 "CHƯA duyệt" "$G2L"
hasout D08 "Fix bằng debounce 300ms" "$G2L"
```

- [ ] **Step 2: Chạy để thấy FAIL.** `bash tests/scripts/run-tests.sh 2>&1 | grep -E "D0[1-8]"` — Expected: D01 PASS "ngẫu nhiên" là KHÔNG được có (card hiện tại không in chuỗi đó) → D01..D08 FAIL.

- [ ] **Step 3: Implement — parse ledger.** Trong `scripts/gate-card.js`, chèn SAU dòng 76 (`const oos = ...`):

```js
// ---- decisions.jsonl (ledger — rationale only, tolerant per-line parse) ----
// Returns entries in FILE ORDER; sealIdx = index of the first gate-1 seal entry
// (everything after it is provisional until a human ratifies at Gate 2).
function readLedger(d) {
  const t = read(path.join(d, 'decisions.jsonl'));
  const entries = []; let broken = 0; let sealIdx = null;
  if (!t.trim()) return { entries, broken, sealIdx };
  for (const line of t.split('\n')) {
    if (!line.trim()) continue;
    try {
      const e = JSON.parse(line);
      if (e && typeof e === 'object') {
        if (sealIdx === null && e.type === 'seal' && String(e.gate) === '1') sealIdx = entries.length;
        entries.push(e);
      } else broken++;
    } catch (_) { broken++; }
  }
  return { entries, broken, sealIdx };
}
const ledger = readLedger(dir);
const decsAll = ledger.entries.filter(e => e.type !== 'seal');
// display order: descope first (Pareto — "không làm" là quyết định đắt nhất khi bị lật)
const decSort = arr => [...arr.filter(e => e.type === 'descope'), ...arr.filter(e => e.type !== 'descope')];
const decsApproved = ledger.sealIdx === null ? decsAll : ledger.entries.slice(0, ledger.sealIdx).filter(e => e.type !== 'seal');
const decsProvisional = ledger.sealIdx === null ? [] : ledger.entries.slice(ledger.sealIdx + 1).filter(e => e.type !== 'seal');
const decLine = e => esc(e.decision || '') + (e.impact ? ' — ' + esc(e.impact) : '');
```

- [ ] **Step 4: Implement — EXTRACT + render Gate 1.** (a) Dòng 121, mở rộng object EXTRACT gate 1: thêm `decisions: decsAll.map(e => ({ id: e.id, type: e.type, stage: e.stage, decision: e.decision, impact: e.impact })), decisions_broken: ledger.broken` trước `}, null, 2)`. (b) SAU block `notItems` (dòng 132), chèn:

```js
  const plDec = id => (((pl.decisions_plain || []).find(x => x.id === id)) || {}).p;
  P.push(`<div class="lab">Quyết định &amp; trade-off</div>`);
  if (!decsAll.length) P.push(`<div class="flag finfo">Sổ quyết định: (chưa ghi quyết định nào)</div>`);
  else P.push(`<div class="grp gnot">${decSort(decsAll).map(e => `<p class="li">${e.type === 'descope' ? '<b>KHÔNG làm:</b> ' : ''}${plDec(e.id) || decLine(e)}</p>`).join('')}</div>`);
  if (ledger.broken) P.push(`<div class="flag fwarn">⚠ ${ledger.broken} dòng ledger hỏng, đã bỏ qua.</div>`);
```

Lưu ý: nội dung entry descope tự nhiên chứa "KHÔNG làm..." — thẻ `<b>KHÔNG làm:</b>` chỉ là prefix hiển thị; test D03 khớp chuỗi decision gốc nên không phụ thuộc prefix.

- [ ] **Step 5: Implement — EXTRACT + render Gate 2.** (a) Dòng 190, mở rộng EXTRACT gate 2: thêm `decisions_approved: decsApproved.map(e => ({ id: e.id, type: e.type, decision: e.decision, impact: e.impact })), decisions_provisional: decsProvisional.map(e => ({ id: e.id, type: e.type, stage: e.stage, decision: e.decision, impact: e.impact })), decisions_broken: ledger.broken`. (b) Trong nhánh approvable, SAU vòng `for (const d of decisions)` + block `oos` (sau dòng 223), chèn:

```js
const plDec2 = id => (((pl.decisions_plain || []).find(x => x.id === id)) || {}).p;
if (decsProvisional.length) {
  P.push(`<div class="lab">Quyết định CHƯA duyệt — cần phê (ghi sau Gate 1)</div>`);
  for (const e of decSort(decsProvisional)) P.push(`<div class="item"><p class="q">${plDec2(e.id) || decLine(e)}</p><p class="ai">${esc(e.stage || '')} · ${e.type === 'descope' ? 'đề nghị KHÔNG làm' : esc(e.type)}${e.revisit ? ' · xem lại khi: ' + esc(e.revisit) : ''}</p><div class="btns"><button class="b bn">Phê</button><button class="b no">Không phê</button></div></div>`);
}
if (decsApproved.length) P.push(`<div class="lab">Đã duyệt từ Gate 1</div><div class="grp gnot">${decSort(decsApproved).map(e => `<p class="li">${decLine(e)}</p>`).join('')}</div>`);
if (ledger.broken) P.push(`<div class="flag fwarn">⚠ ${ledger.broken} dòng ledger hỏng, đã bỏ qua.</div>`);
```

Đặt khối này TRƯỚC `const flags = []` (dòng 225) để "CHƯA duyệt" đứng trên các flag — tách khỏi evidence xanh (chống sunk-cost, ledger-spec §6c).

- [ ] **Step 6: Chạy test PASS.** `bash tests/scripts/run-tests.sh 2>&1 | tail -5` — Expected: D01..D08 PASS, tổng FAIL = 0 (kể cả G01-G11 cũ không vỡ).

- [ ] **Step 7: Commit.** `git add scripts/gate-card.js tests/scripts/run-tests.sh && git commit -m "feat(card): gate-card đọc decisions.jsonl — descope-first, provisional tách khối, dòng hỏng hiện warn"`

---

### Task 2: acceptance-card.md — bước dịch decisions sang ngôn ngữ sản phẩm

**Files:**
- Modify: `commands/acceptance-card.md` (56 dòng)

**Interfaces:**
- Consumes: EXTRACT keys `decisions` / `decisions_approved` / `decisions_provisional` (Task 1).
- Produces: field `decisions_plain[] → {id, p}` trong `card-plain.json` (Task 1 render đọc).

- [ ] **Step 1:** Trong Step 3 của command (block "**Translate** the extract..."), thêm bullet sau bullet `scope_plain`:

```markdown
   - `decisions_plain[] → {id,p}` cho MỌI entry trong `decisions` (Gate 1) /
     `decisions_approved` + `decisions_provisional` (Gate 2): mỗi `p` = 1 câu sản
     phẩm "đã chọn gì — đổi lại gì" (descope: bắt đầu "KHÔNG làm ..."). Ledger là
     rationale, KHÔNG phải scope-truth — không dịch thành cam kết mới.
```

- [ ] **Step 2:** Verify: `grep -c "decisions_plain" commands/acceptance-card.md` → Expected: `1`.
- [ ] **Step 3: Commit.** `git add commands/acceptance-card.md && git commit -m "feat(card): bước dịch decisions_plain trong /acceptance-card"`

---

### Task 3: feature-loop SKILL.md — write-path ledger + seal + resume-read

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md`
- Modify: `skills/acceptance/references/contract-template.md` (1 câu)

**Interfaces:**
- Consumes: format ledger + seal (ledger-spec §4-§5); id = `d-$(date -u +%Y%m%dT%H%M%SZ)-$RANDOM`.
- Produces: quy ước write-path mà Task 6 (câu hỏi lane auto-draft entry) tham chiếu: mục `## Sổ quyết định` tồn tại trong SKILL.md.

- [ ] **Step 1:** Chèn section mới vào `feature-loop/skills/feature-loop/SKILL.md` NGAY SAU section "## State machine & resume" (sau dòng "Resume: ... trước khi làm."):

```markdown
## Sổ quyết định (decisions.jsonl — rationale, KHÔNG phải scope-truth)

`_acceptance/<slug>/decisions.jsonl` — append-only, 1 dòng JSON/quyết định; ledger KHÔNG BAO GIỜ override contract/evals (descope một AC = sửa contract + re-approve; ledger chỉ ghi *vì sao*; mâu thuẫn ledger↔contract = lỗi phải báo user). Schema: `{"id":"d-<UTC>-<rand>","type":"descope|approach|fix|revisit","stage":"S1|S2|S3|S4-r<N>|gate1|gate2","at":"<ISO>","decision":"1 câu","impact":"tiết kiệm gì · rủi ro gì"}` + optional `serves:["AC-2"]`, `revisit`, `supersedes:"<id>"`. Append (không script mới): `printf '%s\n' '<json 1 dòng>' >> _acceptance/<slug>/decisions.jsonl` với id `d-$(date -u +%Y%m%dT%H%M%SZ)-$RANDOM`.

**Rule đáng-log (chống nhiễu):** CHỈ khi (a) loại một phương án khả dĩ ∨ (b) cố tình nhận downside ∨ (c) có điều kiện revisit. Không có phương án thay thế → KHÔNG log; feature đơn giản 0 entry là hợp lệ. `descope` = ưu tiên 1 — quyết định "không làm" vô hình trong code, đắt nhất khi bị lật lại.

**Điểm ghi (friction ≈ 0, cuối stage):** cuối S1 (approach/descope chưng cất từ brainstorm — design-doc giữ văn xuôi) · cuối S2 (lựa chọn load-bearing của plan) · giữa S3 khi buộc đổi hướng so với plan · mỗi S4 REJECT→fix: `stage:"S4-r<N>"`, ghi cách-sửa-đã-chọn + vì sao · Gate 2 nếu human để lại revisit/override. **Seal:** khi Gate 1 duyệt, append `{"id":"d-...","type":"seal","gate":1,"at":"<ISO>"}` CÙNG LÚC set `approved_by` — mọi dòng SAU seal là provisional bất kể `stage` tự khai, card Gate 2 trình riêng khối "CHƯA duyệt" cho human phê. **Lật quyết định:** entry mới `supersedes:"<id>"` + human phê ở gate kế — không sửa/xóa dòng cũ.
```

- [ ] **Step 2:** Trong section "## State machine & resume", thêm vào CUỐI đoạn "Resume: ..." câu:

```markdown
Có `decisions.jsonl` → đọc (parse từng dòng, dòng hỏng bỏ qua + báo số lượng), tóm tắt "đã chốt: <id — decision>" cho user và KHÔNG lật lại các quyết định đó trừ khi đi nghi thức `supersedes` + human phê ở gate kế; file vắng → bỏ qua, không nhắc gì.
```

- [ ] **Step 3:** Trong "## GATE 1", câu "Khi duyệt: set contract `status: approved`..." — thêm ngay sau "`approved_at` (ISO);": `append seal entry vào decisions.jsonl (xem "Sổ quyết định");`

- [ ] **Step 4:** Trong "## GATE 2 (human — điểm dừng 2)", thêm câu cuối đoạn "User: điền...": `Human để lại ghi chú revisit/đảo-ngược → append 1 entry `stage:"gate2"`; signoff đồng thời là phê chuẩn khối provisional mà card đã trình riêng.`

- [ ] **Step 5:** Trong "## S1 — DESIGN" bước 3 (sinh 3 artifact), thêm bullet thứ 4: `- Cuối S1: append entry ledger cho approach/descope thỏa rule đáng-log (xem "Sổ quyết định").` Trong "## S2 — PLAN" thêm mục 4: `4. Cuối S2: append entry ledger cho lựa chọn load-bearing (nếu có).` Trong "## S4 — VERIFY" mục 3 nhánh REJECT, thêm sau "rồi S4 round mới (round + 1).": `Trước khi rời S3-fix: append entry `fix` (`stage:"S4-r<N>"`).`

- [ ] **Step 6:** `skills/acceptance/references/contract-template.md` — sau block `## Out of scope` (dòng 53-56), thêm dòng:

```markdown
> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl` (xem skill feature-loop — repo chưa dùng feature-loop thì bỏ qua).
```

- [ ] **Step 7:** Verify: `grep -c "decisions.jsonl" feature-loop/skills/feature-loop/SKILL.md` → Expected: ≥ 5. `grep -c "decisions.jsonl" skills/acceptance/references/contract-template.md` → `1`.
- [ ] **Step 8: Commit.** `git add feature-loop/skills/feature-loop/SKILL.md skills/acceptance/references/contract-template.md && git commit -m "feat(feature-loop): sổ quyết định decisions.jsonl — write-path 5 điểm, seal Gate 1, resume-read"`

---

### Task 4: design-static-check.mjs — flag --require-html (lane-spec FM-c)

**Files:**
- Modify: `design-loop/scripts/design-static-check.mjs`
- Test: `tests/scripts/run-tests.sh`

**Interfaces:**
- Produces: flag CLI `--require-html` — thiếu `--html` khi có flag → verdict BLOCKED, exit 3, evidence hook-legal như các nhánh BLOCKED sẵn có. Task 7 (design-subtrack S1 eval-gen) ghi flag này vào eval cmd của lane nhẹ.

- [ ] **Step 1: Viết test FAIL.** Thêm section vào `tests/scripts/run-tests.sh` (sau block decisions Task 1):

```bash
echo "R01-03 design-static-check --require-html"
DSC="$HERE/../../design-loop/scripts/design-static-check.mjs"
mkdir -p "$T/dsc/src"; printf '.x{color:var(--color-text)}\n' > "$T/dsc/src/a.css"
node "$DSC" "$T/dsc/src" --require-html >/dev/null 2>&1; check R01 3 $?
ROUT="$(node "$DSC" "$T/dsc/src" --require-html 2>&1)"
hasout R02 "require-html" "$ROUT"
node "$DSC" "$T/dsc/src" >/dev/null 2>&1; check R03 0 $?   # không flag → hành vi cũ giữ nguyên
```

(`check` là helper sẵn có của suite — so exit code; nếu tên helper trong file khác (`expect_exit`...), dùng đúng helper của suite, giữ nguyên ngữ nghĩa 3 assertion.)

- [ ] **Step 2: Chạy FAIL.** `bash tests/scripts/run-tests.sh 2>&1 | grep -E "R0[1-3]"` — Expected: R01/R02 FAIL (flag chưa tồn tại, script hiện exit 0 PASS token-only), R03 PASS.

- [ ] **Step 3: Implement.** Trong `design-static-check.mjs`: (a) chỗ parse args (cùng khối đọc `--html`, `--strict-hit`), thêm `const REQUIRE_HTML = argv.includes('--require-html');` theo đúng style parse hiện có; (b) NGAY SAU khi args parse xong và TRƯỚC khi chạy source-mode checks, chèn:

```js
if (REQUIRE_HTML && !htmlPath) {
  // Lane nhẹ HỨA contrast/tap — thiếu capture thì BLOCK chứ không PASS-kèm-note
  // (lane-spec FM-c: "hứa 3 chạy 1"). Mirror đúng format evidence của nhánh BLOCKED sẵn có.
  emitBlocked('rendered capture required (--require-html) but --html missing — pass the ui-capture file');
  process.exit(3);
}
```

trong đó `emitBlocked(reason)` = ĐỌC nhánh BLOCKED/exit-3 sẵn có của script (grep `exit(3)` / `BLOCKED`) và tái dùng đúng helper in evidence (run_id, verifier, verified_at, verdict, exit_code) của nó — nếu script emit inline không có helper, lặp lại đúng shape inline đó với `verdict: 'BLOCKED'` + reason trên. KHÔNG bịa format mới (hook đối chiếu các field này).

- [ ] **Step 4: Chạy PASS.** `bash tests/scripts/run-tests.sh 2>&1 | grep -E "R0[1-3]"` — Expected: 3 PASS, suite tổng FAIL = 0.
- [ ] **Step 5:** Cập nhật comment usage đầu file: thêm `[--require-html]` vào dòng Usage.
- [ ] **Step 6: Commit.** `git add design-loop/scripts/design-static-check.mjs tests/scripts/run-tests.sh && git commit -m "feat(design-loop): --require-html — lane nhẹ thiếu capture là BLOCKED, không PASS token-only"`

---

### Task 5: design-config-patch.mjs — key design.surface_globs + bước /design-init

**Files:**
- Modify: `design-loop/scripts/design-config-patch.mjs`
- Modify: `design-loop/commands/design-init.md`
- Test: `tests/scripts/run-tests.sh`

**Interfaces:**
- Produces: arg CLI `--surface-globs "<g1>,<g2>"` → append block top-level vào config.yaml:
  ```yaml
  design:
    surface_globs: [<g1>, <g2>]
  ```
  idempotent (đã có block `^design:` top-level → skip); không arg → hành vi hiện tại + note. Task 6 (lưới S4) đọc key này qua grep.

- [ ] **Step 1: Viết test FAIL.** Thêm vào `tests/scripts/run-tests.sh`:

```bash
echo "SG1-4 design-config-patch --surface-globs"
DCP="$HERE/../../design-loop/scripts/design-config-patch.mjs"
mkdir -p "$T/sg"; printf 'executors:\n  test:\n    api: "npm test"\n' > "$T/sg/config.yaml"
node "$DCP" --config "$T/sg/config.yaml" --surface-globs "apps/web/**,packages/ui/**" --write >/dev/null 2>&1
grep -q '^design:$' "$T/sg/config.yaml"; check SG1 0 $?
grep -q 'surface_globs: \[apps/web/\*\*, packages/ui/\*\*\]' "$T/sg/config.yaml"; check SG2 0 $?
node "$DCP" --config "$T/sg/config.yaml" --surface-globs "khac/**" --write >/dev/null 2>&1
grep -c '^design:$' "$T/sg/config.yaml" | grep -qx '1'; check SG3 0 $?   # idempotent — không nhân đôi
grep -q 'smoke_sv_design' "$T/sg/config.yaml"; check SG4 1 $?            # không đẻ key lạ
```

- [ ] **Step 2: Chạy FAIL** (`SG1/SG2` fail — arg chưa tồn tại).

- [ ] **Step 3: Implement.** Trong `design-config-patch.mjs`: (a) `parseArgs` thêm `else if (t === '--surface-globs') a.surfaceGlobs = argv[++i];` (default `a.surfaceGlobs = null`). (b) Sau khối "1) executors.design block" trong `main()`, thêm:

```js
  // 2) design.surface_globs (top-level) — dữ liệu cho lưới S4 tier-mismatch của
  // feature-loop (lane-spec FM-a). Chỉ ghi khi được yêu cầu; vắng key = lưới tự skip.
  if (args.surfaceGlobs) {
    const hasTop = out.some((l) => /^design:\s*$/.test(l));
    if (hasTop) {
      changes.push('design.surface_globs: block `design:` đã tồn tại — skipped (idempotent).');
    } else {
      const globs = args.surfaceGlobs.split(',').map((s) => s.trim()).filter(Boolean);
      out.push('design:', `  surface_globs: [${globs.join(', ')}]`);
      changes.push(`ADD design.surface_globs [${globs.join(', ')}]`);
    }
  } else {
    changes.push('design.surface_globs: không truyền --surface-globs — lưới S4 tier-mismatch sẽ tự skip (truyền để bật).');
  }
```

(giữ nguyên safety check smoke_sv_design phía sau — nó chạy trên toàn `out`).

- [ ] **Step 4: Chạy PASS** — SG1-4 PASS, suite FAIL = 0.

- [ ] **Step 5:** `design-loop/commands/design-init.md` — thêm bước sau bước 3 (apply):

```markdown
4. **Surface globs (bật lưới S4 tier-mismatch).** Nhìn cấu trúc repo, đề xuất 1-3
   glob nơi source surface UI sống (vd `apps/web/plugins/**`, `src/components/**`)
   — hỏi user xác nhận/chỉnh, rồi chạy lại script với
   `--surface-globs "<g1>,<g2>" --write`. User từ chối → bỏ qua (lưới tự skip,
   nói rõ điều đó). KHÔNG đoán glob khi cây repo không rõ — hỏi.
```

(bước cũ 4/5/6 đánh số lại 5/6/7.)

- [ ] **Step 6: Commit.** `git add design-loop/scripts/design-config-patch.mjs design-loop/commands/design-init.md tests/scripts/run-tests.sh && git commit -m "feat(design-loop): design.surface_globs — data cho lưới S4 tier-mismatch, /design-init hỏi 1 lần"`

---

### Task 6: feature-loop SKILL.md — bảng tra 2 công tắc + guards + câu hỏi lane + lưới S4

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (section "## Làn design" + các điểm 🎨)

**Interfaces:**
- Consumes: `--require-html` (Task 4), `design.surface_globs` (Task 5), mục "## Sổ quyết định" (Task 3).
- Produces: định nghĩa CT1/CT2 mà Task 7 (design-subtrack) và Task 8 (test) tham chiếu — chuỗi bảng phải chứa đúng 2 dòng bắt đầu `| **CT1` và `| **CT2`.

- [ ] **Step 1:** THAY TOÀN BỘ section "## Làn design (design-loop guards — có điều kiện, no-op nếu không áp dụng)" (đoạn intro, dòng 29-31 hiện tại) bằng:

```markdown
## Làn design (2 công tắc — bảng tra duy nhất, KHÔNG lưu field tier)

Mọi điểm 🎨 dưới đây tra bảng này — mỗi điểm là MỘT câu hỏi nhị phân, không nhánh phụ:

| Công tắc | Điều kiện (máy-đọc, derive từ artifact) | Khi bật |
|---|---|---|
| **CT1 — chạm UI** (rẻ, tự động) | `node <design-loop>/scripts/design-detect-surface.mjs --slug <slug>` trả `surface:true` **∧** config có `executors.design.*` (đã `/design-init`) | S1: static evals per-surface (cmd `config:executors.design.static` + target + capture `--html` + `--require-html`) + vài dòng "surface & state chạm" trong design-doc + câu hỏi lane cuối S1 · S4: fidelity ADVISORY nếu surface có reference cũ · Gate 2: ghi lane vào gói |
| **CT2 — ceremony design-of-record** (đắt, human bật) | `_acceptance/<slug>/evidence/design/provenance.json` tồn tại **∨** `evals.yaml` có executor `design.fidelity` | S1-D `/design-mockup <slug>` TRƯỚC Gate 1 · hard-gate mockup + state-matrix (S1 kiểm cuối, Gate 1, resume-guard) · S4 WARN to khi fidelity skip · Gate 2 panel `/design-evidence <slug>` cho AC perceptual |

Từ vựng hiển thị: **D0** = ¬CT1 · **D1** = CT1∧¬CT2 · **D2** = CT1∧CT2 — chỉ để nói chuyện với user/card, không lưu đâu cả. CT1 có tín hiệu nhưng repo CHƯA wire design-loop → CẢNH BÁO (không chặn) như trước, và việc static-không-chạy phải hiện trong gói Gate 2. AC perceptual-so-chuẩn xuất hiện trong contract mà CT2 đang OFF → nhắc user nâng lane (cần chuẩn để so = phải có chuẩn), không tự chặn.

**Câu hỏi lane (cuối S1, CHỈ khi CT1 bật ∧ CT2 chưa bật — 1 câu):** "Surface mới/redesign → vẽ mockup (`/design-mockup <slug>`, ceremony đầy đủ)? Hay tweak surface có sẵn → static-only?" Trả lời xong: append ledger entry AUTO-DRAFT (máy điền signals + decision + impact, user chỉ xác nhận — LUÔN ghi cho quyết định lane): chọn ceremony = `type:"approach"`; chọn static-only = `type:"descope"` với impact "bỏ mockup/fidelity/panel — tiết kiệm công vẽ + phê; đổi lại không có chuẩn thị giác để so".

**Lưới S4 tier-mismatch (chạy ở bước chuẩn-bị-args S4):** config có `design.surface_globs` → chạy `git diff --name-only <diffBase>`; có file khớp glob mà `evals.yaml` KHÔNG có eval design nào (static/fidelity) → DỪNG, báo user: "diff chạm surface (`<path>` → `<glob>`) nhưng lane hiện tại không có design eval — nâng lane (thêm static evals / chạy `/design-mockup`) hoặc xác nhận + ghi entry `descope`". Key vắng → bỏ qua lưới, ghi chú 1 dòng vào gói Gate 2.
```

- [ ] **Step 2:** Sửa từng điểm 🎨 còn lại thành câu tham chiếu bảng (giữ nội dung nghiệp vụ, đổi điều kiện):
  - **Resume guard (dòng 33 cũ):** "🎨 Resume guard **(CT2)**: khi resume, nếu CT2 bật (tra bảng) và `status` ≥ `approved` mà THIẾU mockup provenance → báo user + route `/design-mockup <slug>`, KHÔNG tiến qua Gate 1."
  - **S0 #5:** thay 2 bullet hiện tại bằng: "🎨 **(CT1 signals)** Feature có vẻ chạm UI mà config CHƯA có `executors.design.*` → CẢNH BÁO (không chặn): đề nghị cài design-loop + `/design-init`, hoặc user xác nhận đi tiếp functional-only (sẽ hiện ở gói Gate 2). Đã wire → làn design theo bảng tra."
  - **S1 #5:** thay bằng: "🎨 **(CT1)** static evals + dòng surface&state + câu hỏi lane (xem bảng). **(CT2)** kiểm trực tiếp cuối S1: design-doc có state-matrix chưa, `evidence/design/reference/` + `provenance.json` có chưa — THIẾU → DỪNG, in nguyên văn: \"surface web-UI ceremony — chạy `/design-mockup <slug>` trước Gate 1\"."
  - **Gate-1 hard-gate (dòng 63 cũ):** "🎨 **(CT2)** KHÔNG render card / vào Gate 1 khi thiếu mockup provenance + state-matrix. User chủ động bỏ ceremony ở câu hỏi lane → entry `descope` trong decisions.jsonl là dấu vết hiện (thay marker `design_subtrack: skipped-by-user` cũ — workspace cũ còn marker thì vẫn đọc được, không lỗi)."
  - **S4 #5 (dòng 101 cũ):** "🎨 **(CT1)** eval fidelity ADVISORY: surface có reference cũ (repo/`provenance.design_repo` trỏ được) → chạy so-drift, kết quả vào gói Gate 2; không có reference → skip-note thường. **(CT2)** fidelity trả \"skipped\" → in WARN RÕ vào gói Gate 2: \"fidelity pixel-diff KHÔNG chạy — thị-giác CHƯA được so\", KHÔNG lẫn vào PASS xanh."
  - **Gate-2 guard (dòng 109 cũ):** "🎨 **(CT2)** trước signoff in \"chạy `/design-evidence <slug>`\" + đính panel; KHÔNG đánh dấu AC perceptual `resolved` khi chưa có panel. **(CT1)** ghi lane hiện tại (D0/D1/D2) + các entry descope lane vào gói Gate 2."

- [ ] **Step 3:** Verify cấu trúc: `grep -c '^| \*\*CT' feature-loop/skills/feature-loop/SKILL.md` → `2`; `grep -c '🎨' feature-loop/skills/feature-loop/SKILL.md` → ≤ 8 (không phình); `grep -c 'design_tier' feature-loop/skills/feature-loop/SKILL.md` → `0`.
- [ ] **Step 4: Commit.** `git add feature-loop/skills/feature-loop/SKILL.md && git commit -m "feat(feature-loop): làn design 2 công tắc — bảng tra, câu hỏi lane cuối S1, lưới S4 tier-mismatch"`

---

### Task 7: design-subtrack SKILL.md — per-stage theo 2 công tắc

**Files:**
- Modify: `design-loop/skills/design-subtrack/SKILL.md` (file này có WIP codex-port từ Task 0 — đọc bản HIỆN TẠI trước, áp thay đổi theo NGHĨA từng bullet, giữ nguyên phần codex-path)

**Interfaces:**
- Consumes: định nghĩa CT1/CT2 (Task 6), `--require-html` (Task 4).

- [ ] **Step 1:** Đọc file hiện tại. Sửa các bullet per-stage (giữ 3 design-reference paths + Honest CANNOT nguyên vẹn):
  - **S0 — detect:** giữ nguyên script; đổi câu kết thành: "trả `surface:true` = CT1 bật; CT2 KHÔNG bật ở đây — nó bật ở câu hỏi lane cuối S1 của feature-loop hoặc khi user chạy `/design-mockup`."
  - **S1 — spec pack (+):** tách 2 dòng: "**(CT1)** thêm static evals per-surface (cmd `config:executors.design.static` + target + `--html <capture>` + `--require-html`) + vài dòng surface&state trong design-doc. **(CT2)** thêm state-matrix đầy đủ + seam + G2 AC split như cũ. Hard-gate state-matrix CHỈ khi CT2."
  - **S1-D — mockup/reference:** mở đầu bằng "**(CT2 only — skip hoàn toàn khi lane static-only)**".
  - **Gate 1:** thêm "(lane static-only: card hiện entry `descope` lane thay mockup)".
  - **S4 — verify:** "🔴 static (mọi lane CT1, `--require-html` bắt buộc ở lane nhẹ) · 🔴 gate P0 + 🟡 fidelity blocking-advisory theo CT2; fidelity ADVISORY chạy thêm ở lane nhẹ khi surface có reference cũ (so drift, không block)."
  - **Gate 2:** "**(CT2)** panel onion-skin như cũ. **(CT1∧¬CT2)** không panel — evidence screenshot/`observed` thường."
- [ ] **Step 2:** Verify: `grep -c 'CT1\|CT2' design-loop/skills/design-subtrack/SKILL.md` → ≥ 6; `grep -c 'design_tier' ...` → `0`.
- [ ] **Step 3: Commit.** `git add design-loop/skills/design-subtrack/SKILL.md && git commit -m "feat(design-loop): design-subtrack per-stage theo 2 công tắc CT1/CT2"`

---

### Task 8: Test nhất quán bảng tra + đóng gói (tests/plugins)

**Files:**
- Modify: `tests/plugins/run-tests.sh` (file có WIP từ Task 0 — append cuối, trước dòng tổng kết failures)

- [ ] **Step 1:** Thêm (theo pattern `run "..." python3 - ... <<'PY'` sẵn có của suite):

```bash
run "P20 lane lookup table consistent across skills" \
  python3 - "$ROOT" <<'PY'
import sys, pathlib
root = pathlib.Path(sys.argv[1])
fl = (root / "feature-loop/skills/feature-loop/SKILL.md").read_text()
ds = (root / "design-loop/skills/design-subtrack/SKILL.md").read_text()
assert fl.count("| **CT1") == 1 and fl.count("| **CT2") == 1, "bảng tra CT1/CT2 phải có đúng 1 lần"
assert "design_tier" not in fl and "design_tier" not in ds, "không được lưu field tier"
assert "provenance.json" in fl and "design.fidelity" in fl, "điều kiện CT2 phải máy-đọc"
assert "CT2" in ds and "CT1" in ds, "design-subtrack phải tham chiếu công tắc"
assert "--require-html" in fl and "--require-html" in ds, "lane nhẹ phải khai flag require-html"
PY

run "P21 decisions.jsonl plumbing shipped in package" \
  python3 - "$ROOT" <<'PY'
import sys, pathlib
root = pathlib.Path(sys.argv[1])
assert "decisions.jsonl" in (root / "scripts/gate-card.js").read_text()
assert "decisions.jsonl" in (root / "plugins/acceptance-gate/scripts/gate-card.js").read_text(), "chạy scripts/sync-plugin-packages.sh"
assert "decisions_plain" in (root / "plugins/acceptance-gate/commands/acceptance-card.md").read_text()
assert "decisions.jsonl" in (root / "feature-loop/skills/feature-loop/SKILL.md").read_text()
PY
```

- [ ] **Step 2:** Chạy `bash tests/plugins/run-tests.sh` — Expected: P20 PASS, **P21 FAIL** (package chưa sync — đúng chủ đích, Task 9 sync xong mới xanh).
- [ ] **Step 3: Commit.** `git add tests/plugins/run-tests.sh && git commit -m "test(plugins): P20 bảng tra CT1/CT2 nhất quán + P21 ledger plumbing trong package"`

---

### Task 9: Docs + version + sync + release

**Files:**
- Modify: `GUIDE.md` (thêm 1 mục ngắn), `.claude-plugin/plugin.json` (1.10.2 → 1.11.0), `feature-loop/.claude-plugin/plugin.json` (1.10.0 → 1.11.0), `design-loop/.claude-plugin/plugin.json` (0.1.1 → 0.2.0)
- Generated: `plugins/acceptance-gate/**` (qua sync script — KHÔNG sửa tay)

- [ ] **Step 1:** GUIDE.md — thêm mục (vị trí: sau mục nói về Gate 2 / evidence; đọc mục lục hiện tại chọn chỗ hợp):

```markdown
## Sổ quyết định & 2 công tắc design (1.11.0)

**decisions.jsonl** — mỗi workspace có sổ rationale append-only: quyết định
descope/approach/fix kèm trade-off, seal tại Gate 1 (dòng sau seal = provisional,
card Gate 2 trình riêng "CHƯA duyệt" cho bạn phê). Ledger KHÔNG override contract —
descope một AC vẫn phải sửa contract + re-approve. Card 2 gate tự render mục
"Quyết định & trade-off" (descope lên đầu); chưa ghi gì → in "(chưa ghi quyết định
nào)" để bạn đòi khi cần.

**Làn design 2 công tắc** — CT1 (chạm UI, tự động): static checks (token/contrast/
tap, thiếu capture là BLOCKED) + screenshot như thường. CT2 (ceremony đắt, bạn bật
bằng 1 câu cuối S1 hoặc chạy `/design-mockup`): mockup + state-matrix + fidelity +
panel Gate 2. Không có field tier nào — trạng thái nhận từ artifact (provenance /
eval fidelity); D0/D1/D2 chỉ là cách gọi. Bỏ ceremony = 1 entry `descope` hiện trên
card. `/design-init` hỏi thêm `design.surface_globs` để S4 bắt "diff chạm surface
mà lane không có design eval".
```

- [ ] **Step 2:** Bump 3 version (sửa field `version` trong 3 file plugin.json — root acceptance-gate `1.11.0`, feature-loop `1.11.0`, design-loop `0.2.0`). Kiểm marketplace: `grep -n "version" .claude-plugin/marketplace.json 2>/dev/null` — nếu marketplace pin version thì cập nhật cùng.
- [ ] **Step 3:** `bash scripts/sync-plugin-packages.sh` — Expected: `Synced .../plugins/acceptance-gate (version 1.11.0)`.
- [ ] **Step 4:** Chạy CẢ BA suite: `bash tests/hooks/run-tests.sh && bash tests/scripts/run-tests.sh && bash tests/plugins/run-tests.sh` — Expected: 0 FAIL (P21 giờ xanh). Đỏ → sửa tới xanh, không release.
- [ ] **Step 5: Commit + release.** `git add -A && git commit -m "Release: acceptance-gate 1.11.0 / feature-loop 1.11.0 / design-loop 0.2.0 — decisions.jsonl (sổ quyết định Pareto) + làn design 2 công tắc"` — thân commit liệt kê: ledger Đợt A (write-path/seal/resume/card) · lane switches (bảng tra, --require-html, surface_globs) · Đợt B ledger deferred · codex port follow-up.
- [ ] **Step 6:** Nhắc user: (a) cập nhật plugin trên máy đang dùng (`claude plugin update acceptance-gate` v.v. theo QUICKSTART); (b) follow-up đã ghi nhận: port ledger+lane sang `feature-loop-codex` sau khi wave codex ship; grader `decisionsPath` chờ đủ điều kiện Đợt B (ledger thật ≥ 2-3 feature).

---

## Self-review đã chạy (khi viết plan)

- **Spec coverage:** ledger §4 (schema/id/parse) → T1/T3 · §5 write-path → T3 · §6a resume → T3 · §6b/§6c card → T1+T2 · §10 template → T3; §7 Đợt B = ngoài phạm vi (đúng spec). Lane §3.1 CT1 → T4+T6+T7 · §3.2 CT2 + câu hỏi + auto-draft → T6 · §3.3 derive → T6/T7 · §4 bảng tra + test → T6+T8 · §5 FM-a → T5+T6, FM-c → T4 · §7 chạm file → T4-T9. Mâu thuẫn spec §10↔§6b phát hiện khi viết plan → sửa ở T1 Step 0.
- **Type consistency:** `readLedger` shape (T1) ↔ EXTRACT keys ↔ `decisions_plain` (T2) khớp; chuỗi test D02 dùng `&amp;` vì render esc() tiêu đề "Quyết định & trade-off" — ĐÚNG với code Step 4 (tiêu đề viết thẳng `&amp;` trong template).
- **Placeholder scan:** T4 Step 3 `emitBlocked` chỉ định "mirror nhánh BLOCKED sẵn có" thay vì code chết — chủ đích, vì shape evidence phải lấy từ script thật (executor đọc file); các bước còn lại đều có nội dung đầy đủ.
