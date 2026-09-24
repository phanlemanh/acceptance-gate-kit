# Hạ tầng thôi đốt lượt — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (tuần tự trong phiên chính — hạng T2, mọi task chung `tests/scripts/htkd.test.mjs` và `_acceptance/config.yaml`). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Suite scripts chạy dưới trần công cụ bằng ba mảnh; `s4-args.mjs` thử lại CÙNG round cho lượt BLOCKED vì hạ tầng; khuôn `/goal` thôi coi BLOCKED là xong; thẻ Cổng 1 của hồ sơ đã khép thôi hỏi.

**Architecture:** Bốn vá độc lập về vật nhưng chung một tệp ca (`htkd.test.mjs`, tên ca = tên AC) và một config. Mỗi vá đọc nguồn một-chỗ đã có (`lib/nhan-canh-gay.cjs`, bộ quét `start-scan.mjs`, khối marker `GOAL-TEMPLATE`) — không chép luật.

**Tech Stack:** bash (tệp chạy suite), Node ESM/CJS, python3 (P85 trong suite plugins).

**Spec:** `docs/superpowers/specs/2026-09-24-ha-tang-khong-dot-luot-design.md` · hợp đồng `_acceptance/ha-tang-khong-dot-luot/contract.md` · evals `_acceptance/ha-tang-khong-dot-luot/evals.yaml`.

## Global Constraints

- TDD: commit ca đỏ TRƯỚC commit vật, mỗi task (chiều đỏ nằm trong lịch sử).
- Mỗi phép đo mới có cặp hai chiều cùng fixture + thông điệp ghim; mỗi kim đột biến khẳng định khớp ĐÚNG MỘT lần trong nguồn thật.
- Fixture do code sinh trong lượt; đường dẫn suy từ vị trí tệp ca; «bản đời trước» neo bằng tag `v2.18.2`, không merge-base, không origin.
- Chạy suite scripts (trọn hoặc mảnh) LUÔN ở chế độ nền có chờ — không lời gọi công cụ nào ôm trọn nó.
- Không sửa byte nào trong `_acceptance/<slug>/` của hồ sơ đã ký; không sửa `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` (giữ T2).
- Từ vựng theo `CONTEXT.md` (không «runner» — dùng «tệp chạy suite»).
- Không `--no-verify`, không push `main`.

---

### Task 1: Suite scripts tách ba mảnh (AC-1, AC-2, AC-3 · E1–E3) — independent: false

**Files:**
- Modify: `tests/scripts/run-tests.sh` (khối chọn mảnh sau dòng `mkdir -p "$T"` ~dòng 41; vòng mjs ~2763–2785 thành khối `MJS-GOI`; hai dòng kết cuối tệp thành `ket_suite`)
- Modify: `_acceptance/config.yaml` (`executors.test.scripts_bash|scripts_mjs_1|scripts_mjs_2`, `executors.script.htkd`, `feature_loop.suite_keys`)
- Create: `tests/scripts/htkd.test.mjs`
- Có thể chạm: ca đang ghim `suite_keys` (tìm bằng `grep -rn "executors.test.scripts" tests/`)

**Interfaces:**
- Produces: biến môi trường `SCRIPTS_SHARD` ∈ {`all` (mặc định), `bash`, `mjs:<i>/<n>`}; `SCRIPTS_SHARD_LIST=1` in tên tệp (basename) mỗi dòng rồi thoát 0; hàm bash `mjs_tat_ca`, `mjs_cua_manh`, `chay_mjs`, `ket_suite`; marker `# <<<CA-BASH-DAU`, `# <<<MJS-GOI` … `# MJS-GOI>>>`, `# <<<KET-SUITE`.
- Produces (tệp ca): khung `htkd.test.mjs` với `ok/bad/want`, chọn ca bằng đối số hoặc `HTKD_CASES`.

- [ ] **Step 1: Viết ca đỏ** HT-AC1, HT-AC1-dot-bien, HT-AC2, HT-AC2-do-mjs, HT-AC2-do-bash, HT-AC3, HT-AC3-dot-bien trong `htkd.test.mjs`:
  - HT-AC1: đọc `feature_loop.suite_keys` + lệnh các khoá `executors.test.scripts_*` từ config thật (regex dòng), rút các giá trị `SCRIPTS_SHARD=…`; với mỗi giá trị `mjs:i/n` chạy `SCRIPTS_SHARD=<v> SCRIPTS_SHARD_LIST=1 bash tests/scripts/run-tests.sh`; kỳ vọng = `readdirSync(HERE).filter(f => f.endsWith('.test.mjs') && f !== 'wf-usage.test.mjs')`; so rời nhau, ≥1, hợp bằng nhau; `bash` → rỗng; không đặt → đủ tập.
  - HT-AC1-dot-bien: bản sao tệp chạy suite (ghi vào `tests/scripts/.htkd-ban-sao-<pid>.sh` để `$HERE` giữ nguyên, xoá trong `finally`) thay kim `[ $((k % n)) -eq $((i - 1)) ]` (khớp đúng một lần) bằng phép bỏ chỉ số cuối → hợp thiếu, thông điệp «tep bi sot: <tên>».
  - HT-AC2*: fixture ghép theo marker (đầu tới `CA-BASH-DAU`, khối `MJS-GOI`, kết từ `KET-SUITE`), chèn hai ca bash `echo "HTX1 …"; check HTX1 0 0`, bốn tệp `a.test.mjs`…`d.test.mjs` = `process.exit(0)`; chạy bốn lượt, đọc «Results: N passed, M failed»; quan hệ cộng; tiêm `e.test.mjs` = `process.exit(1)` và ca bash `check HTX9 0 1`.
  - HT-AC3: suite_keys chứa `executors.test.scripts_bash`, `scripts_mjs_1..n` đủ, không chứa `executors.test.scripts`; lệnh `executors.test.scripts` không có `SCRIPTS_SHARD`; `.github/workflows/gate.yml` có `run: bash tests/scripts/run-tests.sh`. HT-AC3-dot-bien: chuỗi config bỏ dòng `- executors.test.scripts_mjs_2` → «manh thieu: mjs:2/2».
- [ ] **Step 2: Chạy và thấy đỏ:** `node tests/scripts/htkd.test.mjs HT-AC1 HT-AC2 HT-AC3` → FAIL (chưa có mảnh). Commit `test(htkd): ca đỏ AC-1..3 — mảnh suite scripts`.
- [ ] **Step 3: Vật — khối chọn mảnh** (sau `mkdir -p "$T"`):

```bash
# <<<SCRIPTS-SHARD — hồ sơ ha-tang-khong-dot-luot AC-1..3: suite qua trần 600 s của công cụ chạy lệnh
SHARD="${SCRIPTS_SHARD:-all}"
mjs_tat_ca() { local f; for f in "$HERE"/*.test.mjs; do [ -e "$f" ] || continue; case "$f" in */wf-usage.test.mjs) continue;; esac; printf '%s\n' "$f"; done; }
mjs_cua_manh() {
  case "$SHARD" in
    all) mjs_tat_ca ;;
    bash) : ;;
    mjs:*/*)
      local spec="${SHARD#mjs:}" i n k=0 f; i="${spec%/*}"; n="${spec#*/}"
      case "$i$n" in *[!0-9]*|'') echo "run-tests: SCRIPTS_SHARD sai: $SHARD" >&2; exit 2;; esac
      [ "$n" -ge 1 ] && [ "$i" -ge 1 ] && [ "$i" -le "$n" ] || { echo "run-tests: SCRIPTS_SHARD sai: $SHARD" >&2; exit 2; }
      while IFS= read -r f; do [ $((k % n)) -eq $((i - 1)) ] && printf '%s\n' "$f"; k=$((k + 1)); done < <(mjs_tat_ca) ;;
    *) echo "run-tests: SCRIPTS_SHARD sai: $SHARD (all | bash | mjs:<i>/<n>)" >&2; exit 2 ;;
  esac
}
chay_mjs() { … vòng lặp cũ nguyên văn, lặp trên `mjs_cua_manh` thay glob; kết bằng check «co it nhat mot *.test.mjs duoc chay» … }
ket_suite() { echo ""; echo "Results: $PASS_COUNT passed, $FAIL_COUNT failed"; [ "$FAIL_COUNT" -eq 0 ] || exit 1; exit 0; }
if [ -n "${SCRIPTS_SHARD_LIST:-}" ]; then mjs_cua_manh | while IFS= read -r f; do basename "$f"; done; exit 0; fi
case "$SHARD" in mjs:*) chay_mjs; ket_suite ;; esac
# SCRIPTS-SHARD>>>
# <<<CA-BASH-DAU
```

  Vòng mjs cũ ~2763 thay bằng `# <<<MJS-GOI` / `[ "$SHARD" = all ] && chay_mjs` / `# MJS-GOI>>>`; hai dòng cuối thay bằng `# <<<KET-SUITE` / `ket_suite`.
- [ ] **Step 4: Config:** thêm `scripts_bash: "SCRIPTS_SHARD=bash bash tests/scripts/run-tests.sh"`, `scripts_mjs_1: "SCRIPTS_SHARD=mjs:1/2 bash tests/scripts/run-tests.sh"`, `scripts_mjs_2` tương tự; suite_keys thay `executors.test.scripts` bằng ba khoá; thêm `executors.script.htkd` theo khuôn `hskt` (ghim danh sách ca PASS).
- [ ] **Step 5: Xanh:** `node tests/scripts/htkd.test.mjs HT-AC1 HT-AC1-dot-bien HT-AC2 HT-AC2-do-mjs HT-AC2-do-bash HT-AC3 HT-AC3-dot-bien`; rồi NỀN: ba mảnh thật, đo giây từng mảnh, và lượt trọn (không mảnh) — số passed khớp quan hệ cộng. Ghi giây vào design doc §5.
- [ ] **Step 6: Commit** `feat(suite): tách suite scripts ba mảnh dưới trần công cụ (AC-1..3)`.

### Task 2: `s4-args.mjs` thử lại cùng round (AC-4 · E4) — independent: false

**Files:**
- Modify: `feature-loop/scripts/s4-args.mjs:404-427` (khối đếm round) + `AG_REQUIRES` thêm `lib/nhan-canh-gay.cjs`
- Test: `tests/scripts/htkd.test.mjs` (HT-AC4*)

**Interfaces:**
- Consumes: `canhGay({ runLogText, verdict, expectedExit, nguon })` và `NGUON` của `lib/nhan-canh-gay.cjs`; `expectedExits` đã có trong s4-args; `runWorkflow(file, args, respond)` của `tests/workflows/harness.mjs`.
- Produces: stderr «s4-args: round <b> đã thử lại một lần vẫn chặn vì hạ tầng — trình thẻ Cổng Bằng chứng (cạnh gãy), không chấm tiếp».

- [ ] **Step 1: Ca đỏ** HT-AC4 (chín kho), HT-AC4-thu-lai-roi, HT-AC4-bao-cao-thieu, HT-AC4-tran, HT-AC4-khu-hoi, HT-AC4-dot-bien. Kho sinh như `s4-args-not-run.test.mjs` (config tối thiểu + contract + evals một eval script + git commit); dòng tally dựng từ danh sách khoá rút khỏi khối `ROUND-TALLY-SCHEMA` của `acceptance-verify.js`; lý do chặn lấy từ `NGUON.deadReason` / `NGUON.toolKillReason`; dòng eval chặn `{ts, round, evalId, run_id, exit_code:null, cmd, cannot_run:true, reason}`. Khu-hồi: `runWorkflow` với tác tử `machine:` trả `null` (chết), tác tử triage trả một finding `inContract:true` (biến thể có/không) → ghi `result.runLog` vào run-log, Iterations «Round 1» → s4-args.
- [ ] **Step 2: Đỏ** (hàng 5, 6 ra 2; khu-hồi chet-không-finding ra 2). Commit `test(htkd): ca đỏ AC-4 — thử lại cùng round`.
- [ ] **Step 3: Vật** trong s4-args sau khi tính `round` từ Iterations:

```js
// <<<THU-LAI-CUNG-ROUND — ha-tang-khong-dot-luot AC-4: lượt BLOCKED vì hạ tầng thử lại CÙNG round
if (!flags.round) {
  const rl = fs.existsSync(runLogPath) ? fs.readFileSync(runLogPath, 'utf8') : '';
  const dong = nhan.docDong(rl);
  const tallies = dong.filter(o => o.kind === 'round-tally' && typeof o.round === 'number');
  const iterMax = fs.existsSync(evPath) ? round - 1 : 0;
  const base = Math.max(iterMax, ...tallies.map(o => o.round), 0);
  round = base + 1;
  const cuoi = tallies[tallies.length - 1];
  if (base >= 1 && cuoi && cuoi.round === base && String(cuoi.verdict).toUpperCase() === 'BLOCKED') {
    const cg = nhan.canhGay({ runLogText: rl, verdict: 'BLOCKED', expectedExit: expectedExitMap, nguon: nhan.NGUON });
    const haTang = cg.trangThai === 'chet-lan-dau' || cg.trangThai === 'mo';
    const coFinding = dong.some(o => o.kind === 'finding' && o.round === base && o.ts === cuoi.ts && o.inContract === true);
    if (haTang && !coFinding && !cg.daThuLai) round = base;
    else if (haTang && !coFinding && cg.daThuLai) console.error(`s4-args: round ${base} đã thử lại một lần vẫn chặn vì hạ tầng — trình thẻ Cổng Bằng chứng (cạnh gãy), không chấm tiếp`);
  }
}
// THU-LAI-CUNG-ROUND>>>
```

  (Dời định nghĩa `runLogPath`/map mã kỳ vọng lên trước khối nếu cần; tên biến theo mã thật.)
- [ ] **Step 4: Xanh:** `node tests/scripts/htkd.test.mjs HT-AC4 HT-AC4-thu-lai-roi HT-AC4-bao-cao-thieu HT-AC4-tran HT-AC4-khu-hoi HT-AC4-dot-bien` + `node tests/scripts/s4-args-not-run.test.mjs` + `s4-args-expected-exit` + `s4-args-main-branch` + `bash tests/workflows/run-tests.sh`.
- [ ] **Step 5: Commit** `feat(s4-args): lượt BLOCKED vì hạ tầng thử lại cùng round (AC-4)`.

### Task 3: Khuôn `/goal` + bước BLOCKED của SKILL (AC-5, AC-6 · E5, E6) — independent: false

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (khối GOAL-TEMPLATE; bước `BLOCKED` ở S4; câu Gate 1.5; câu S1#1 nếu nhắc «chờ input người»)
- Modify: `GUIDE.md` (khối GOAL-TEMPLATE + đoạn «Vì sao template dài vậy» + câu «khuôn goal cố ý coi máy đang chờ người là hoàn thành»)
- Modify: `scripts/gate-card.js` (hằng `GOAL_TEMPLATE`)
- Modify: `tests/plugins/run-tests.sh` P85 (tính chất «verified»/«REJECT quá 3 round» → tính chất mới)
- Test: `htkd.test.mjs` (HT-AC5, HT-AC5-dot-bien, HT-AC6, HT-AC6-do); `tests/scripts/gate-card-goal.test.mjs` vẫn xanh

- [ ] **Step 1: Ca đỏ** HT-AC5 (tính chất trên ba bản rút qua marker; goal_line của `gate-card.js --extract` trên hồ sơ draft = khuôn gộp một dòng), HT-AC5-dot-bien (hai đột biến trên chuỗi khuôn), HT-AC6 (đoạn BLOCKED từ «- `BLOCKED` →» tới `<<<CLASSIFIER-FALLBACK`: «s4-args», «không đếm vào trần», «MỘT lần», «như REJECT», «thẻ Cổng Bằng chứng»; toàn SKILL không khớp `/chờ input người[^\n]*hoàn thành/`), HT-AC6-do (`git show v2.18.2:feature-loop/skills/feature-loop/SKILL.md` → đỏ gọi tên mệnh đề thiếu). Commit ca đỏ.
- [ ] **Step 2: Vật:** khuôn mới đúng design doc §2.C ở ba bản; bước BLOCKED viết lại; Gate 1.5 «goal đã kết ở Cổng 1 (khuôn coi dừng ở cổng có tên là hoàn thành)»; GUIDE đoạn giải thích; P85 đổi assert `"verified"`/`"REJECT quá 3 round"` thành `"Cổng Bằng chứng"`/`"trần 3 round"`.
- [ ] **Step 3: Xanh:** HT-AC5*, HT-AC6*, `node tests/scripts/gate-card-goal.test.mjs`, NỀN `ONLY_BLOCK="P85 " bash tests/plugins/run-tests.sh`.
- [ ] **Step 4: Commit** `feat(goal): khuôn /goal thôi coi BLOCKED là xong; bước BLOCKED nói đường thử lại (AC-5, AC-6)`.

### Task 4: Thẻ Cổng 1 hồ sơ đã khép (AC-7 · E7) — independent: false

**Files:**
- Modify: `scripts/gate-card.js` (rút lượt gọi `start-scan` thành hàm `quetHoSo()` nhớ kết quả; `DA_KHEP` tính trước nhánh cổng; nhánh Cổng 1 khi `DA_KHEP`: `routing.hoi` rỗng, `one_shot` null, `goal_line` null, HTML dòng «hồ sơ đã khép — <đã nghỉ|đã chấm bởi thực tế>: không còn câu hỏi nào cho người»)
- Maybe regenerate: `tests/scripts/fixtures/routing-baseline.txt` (bằng chính lệnh sinh của ca LM20/HK-AC6-baseline)
- Test: `htkd.test.mjs` (HT-AC7, HT-AC7-dot-bien); `hskt.test.mjs` HK-AC6* vẫn xanh

**Interfaces:**
- Consumes: bộ quét `scripts/start-scan.mjs` (khoá `nghi`, `thucTe`, `stateKey`); dòng sổ nghỉ / dòng quan sát theo khuôn fixture của `hskt.test.mjs` (rút vế từ lib).

- [ ] **Step 1: Ca đỏ** HT-AC7 (bốn hồ sơ, bốn assert), HT-AC7-dot-bien (bản sao gate-card gỡ vế khép ở nhánh Cổng 1 — kim khớp đúng một lần). Commit ca đỏ.
- [ ] **Step 2: Vật** như Files.
- [ ] **Step 3: Xanh:** HT-AC7*, `node tests/scripts/hskt.test.mjs HK-AC6-nghi HK-AC6-thuc-te HK-AC6-song HK-AC6-baseline`, `node tests/scripts/gate-card-goal.test.mjs`, `node tests/scripts/gate-card-lmcms.test.mjs` (nền).
- [ ] **Step 4: Commit** `feat(gate-card): hồ sơ đã khép thôi hỏi ở thẻ Cổng 1 (AC-7)`.

### Kết S3

- [ ] Bốn suite ở chế độ nền: `SCRIPTS_SHARD=bash`, `mjs:1/2`, `mjs:2/2`, plugins, hooks, workflows; `node scripts/product-map.mjs --root . --check`; `node scripts/eval-coverage-lint.js .`.
- [ ] Contract `status: implemented`, vẽ lại bản đồ, commit, dispatch S4.
