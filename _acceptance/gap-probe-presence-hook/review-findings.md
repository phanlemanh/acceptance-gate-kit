# Review Findings: gap-probe-presence-hook (round 1)

Informational — nằm NGOÀI phạm vi acceptance-evidence-gate hook (hook chỉ đọc
`evidence-report.md`/`contract.md`). File này liệt kê các finding đã qua
**adversarial-verify** (refuter đã chạy và xác nhận, không chỉ heuristic một
lượt) trên diff của feature `gap-probe-presence-hook`, dùng để nạp cho
`evidence-page.js` (bảng "Review findings") và cho human đọc tại Gate 2.

Phạm vi round này: lớp merge-boundary mới (`scripts/pre-merge-check.sh`, mirror
`plugins/acceptance-gate/scripts/pre-merge-check.sh`) và các tài liệu/test đi
kèm — khác vùng với các finding hook-level (`hooks/acceptance-evidence-gate.js`,
`lib/evidence-core.js`) đã ghi trong lịch sử round trước của cùng slug này.
8/8 finding dưới đây đều đã adversarial-verify thành công (không có finding
nào gắn `unverified: true`). Sắp xếp severity giảm dần.

## High severity (3)

### 1. Typo trong `gap_probe:` giết TOÀN BỘ pre-merge check và exit 0 (false-green đúng thứ luật này sinh ra để chặn)

- title: Typo trong `gap_probe:` giết TOÀN BỘ pre-merge check và exit 0 (false-green đúng thứ luật này sinh ra để chặn)
  file: scripts/pre-merge-check.sh
  line: 92
  severity: high
  source: conventions
  detail: |
    Khối parse `gap_probe` mới đặt ở dòng 79-95 gọi `violations=$((violations+1))` (dòng 92), nhưng `violations=0` chỉ được khởi tạo ở dòng 171. Script chạy `set -u` (dòng 34) → arithmetic expansion trên biến chưa khai báo làm bash ABORT ngay tại dòng đó.

    Đã tái hiện trên repo fixture thật (config có `gap_probe: requird`, feature T3 `status: implemented` KHÔNG có evidence-report.md — tức phải VIOLATION chắc chắn):

        VIOLATION [config]: gap_probe: "requird" không phải mode hợp lệ — ...
        pre-merge-check.sh: line 92: violations: unbound variable
        EXIT=0

    Cùng repo đó, sửa thành `gap_probe: advisory` → `VIOLATION [feat-q]: status=implemented but no evidence-report.md` + `EXIT=1`.

    Hệ quả: một lỗi chính tả 1 ký tự trong `_acceptance/config.yaml` vô hiệu hoá TẤT CẢ luật pre-merge (signoff, verdict, staleness, bypass, T1-escape...) và CI xanh. Đúng trường hợp comment ngay trên đó tuyên bố chặn: "KHÔNG âm thầm rơi về mặc định: một cổng tự tắt vì sai chính tả đúng là false-green mà luật này sinh ra để chặn".

    Invariant repo bị vi phạm: `scripts/pre-merge-check.sh` nằm trong `t3_paths` (README.md:247) — lõi cưỡng chế. Lỗi tồn tại y hệt ở build mirror `plugins/acceptance-gate/scripts/pre-merge-check.sh:92` (hai file identical, sync OK).

    Fix theo pattern sẵn có: hoist `violations=0` lên trước khối parse config (hoặc dời việc đếm xuống sau dòng 171), đúng như block diff-scope đã được hoist trong chính commit 8c593df.

### 2. `violations` incremented before it is initialized → invalid `gap_probe` value aborts the entire pre-merge gate (exit 0 on bash 3.2)

- title: `violations` incremented before it is initialized → invalid `gap_probe` value aborts the entire pre-merge gate (exit 0 on bash 3.2)
  file: scripts/pre-merge-check.sh
  line: 92
  severity: high
  source: bugs
  detail: |
    The new config-validation branch does `violations=$((violations+1))` at line 92, but `violations=0` is not executed until line 171. The script runs under `set -u` (line 34), so the arithmetic expansion on an unset variable is a fatal shell error: the script terminates right there, before any per-slug check, before the T1-escape backstop, before the final `if [ "$violations" -gt 0 ]` block.

    Reproduced (macOS /bin/bash 3.2, the shell the docs tell consumers to use):

        $ mkdir -p R/_acceptance && printf 'gates:\n  gap_probe: reqired\n' > R/_acceptance/config.yaml
        $ bash scripts/pre-merge-check.sh R; echo rc=$?
        VIOLATION [config]: gap_probe: "reqired" không phải mode hợp lệ — ...
        scripts/pre-merge-check.sh: line 92: violations: unbound variable
        rc=0

    With a genuinely violating feature added to the same fixture (T2, status=implemented, no evidence-report.md), the run with a *valid* mode prints `VIOLATION [foo]: status=implemented but no evidence-report.md` and exits 1; the identical run with the *typo'd* mode exits 0 and prints nothing about the feature. A single typo in config.yaml therefore turns the whole merge gate green — the precise false-green the comment at lines 89-90 says this branch exists to prevent. On bash 5.x (GitHub Actions ubuntu) the exit status is non-zero, but every other check is still skipped and the only diagnostic is a bash internal error.

    Second layer of the same root cause: even if the abort is fixed (e.g. by pre-seeding the variable), `violations=0` at line 171 unconditionally resets the counter, so the config VIOLATION would still never reach the exit-code test. Fix: move `violations=0` above the `if [ -f "$ACC/config.yaml" ]` block at line 79.

    Not caught by tests: GPM11c (tests/scripts/run-tests.sh:1690-1693) asserts only that the strings `gap_probe` and `requird` appear in combined stdout+stderr; it never asserts the exit code, so all 273 tests pass. Identical defect in the mirrored copy plugins/acceptance-gate/scripts/pre-merge-check.sh:92 (the two files are byte-identical).

### 3. Test GPM11c không assert exit code — eval AC-11/E11 pass giả trong khi gate đã chết

- title: Test GPM11c không assert exit code — eval AC-11/E11 pass giả trong khi gate đã chết
  file: tests/scripts/run-tests.sh
  line: 1713
  severity: high
  source: conventions
  detail: |
    Mọi case khác trong suite đều theo pattern `check <id> <expected_exit> $?` (vd GPM11a/GPM11b dòng 1706/1710, GPM1, GPM6a-c). Riêng nhánh sai-chính-tả chỉ có `hasout GPM11c "gap_probe"` + `hasout GPM11c2 "requird"` — chỉ soi stdout/stderr, không soi exit code, cũng không kiểm script có chạy tiếp hay không.

    Vì thông điệp VIOLATION được in TRƯỚC khi bash abort (finding #1/#2), cả hai `hasout` đều xanh. Kết quả: eval E11 (`_acceptance/gap-probe-presence-hook/evals.yaml:57`, expected "...in cảnh báo cấu hình sai, KHÔNG âm thầm về advisory") báo PASS trong khi hành vi thật là "tắt sạch cổng, exit 0" — nghiêm trọng hơn cả 'âm thầm về advisory' mà AC-11 muốn cấm.

    Đây là chính xác lớp false-green mà contract này sinh ra để đóng; RED-test cho AC-11 chưa từng thật sự đỏ. Cần thêm `check GPM11c <exit> $?` và một assert rằng luật phía sau vẫn chạy (vd fixture kèm violation khác vẫn phải xuất hiện trong output).

## Medium severity (3)

### 4. `DIFF_READY=1` is set even when `git diff` fails → gap-probe and T1-escape rules silently no-op with no NOTE

- title: `DIFF_READY=1` is set even when `git diff` fails → gap-probe and T1-escape rules silently no-op with no NOTE
  file: scripts/pre-merge-check.sh
  line: 210
  severity: medium
  source: bugs
  detail: |
    In the hoisted diff-scope block, `DIFF_FILES="$(git -C "$ROOT" diff --name-only "$BASE_SHA...HEAD" -- 2>/dev/null)"` is followed by an unconditional `DIFF_READY=1` — the git exit status is discarded and stderr is suppressed. `git rev-parse` succeeding only proves the base commit object exists; `git diff A...HEAD` still fails when there is no merge base (shallow fetch, unrelated histories, grafted CI clone), returning rc=128 with empty stdout. Confirmed:

        $ git diff --name-only "$MAIN...HEAD" -- 2>/dev/null; echo rc=$?
        rc=128   (empty output)

    When that happens the script believes the PR scope is known and empty: `slug_in_diff` returns false for every slug, so the gap-probe rule never fires for any feature even in `required` mode, and the T1-escape backstop sees `gate_touched=0` with no hits and reports nothing. Crucially the visibility escape valve at line 225 (`[ "$DIFF_READY" -eq 0 ]` → "gap-probe check skipped") does NOT fire, and the workflow's own fail-closed guard in .github/workflows/gate.yml (which greps stdout for "backstop skipped" and hard-errors) is likewise bypassed — the run looks clean rather than skipped. The old code had the same hole for T1-escape alone; the hoist makes `DIFF_READY` the single authority for scope-known and extends the silent no-op to a second rule. Fix: `if DIFF_FILES="$(git ... )"; then DIFF_READY=1; else DIFF_SKIP_NOTE="no merge base between \"$BASE\" and HEAD in this clone"; fi`. Same in plugins/acceptance-gate/scripts/pre-merge-check.sh:210.

### 5. Khoá config `gap_probe` + luật + lối thoát mới không được ghi vào 3 bảng tham chiếu bắt buộc của GUIDE, cũng không có trong scaffold acceptance-init

- title: Khoá config `gap_probe` + luật + lối thoát mới không được ghi vào 3 bảng tham chiếu bắt buộc của GUIDE, cũng không có trong scaffold acceptance-init
  file: GUIDE.md
  line: 516
  severity: medium
  source: conventions
  detail: |
    Repo có convention rõ: mọi khoá `config.yaml` nằm trong bảng "Tham chiếu đầy đủ config.yaml" (GUIDE.md:516-531, có cả cột "Khi thiếu"), mọi luật pre-merge nằm trong bảng VIOLATION/NOTE (GUIDE.md:676-688), mọi escape hatch nằm trong bảng "Các lối thoát đều CÓ dấu vết" (GUIDE.md:692-698). `recheck` — khoá gần nhất về hình dạng (strict/warn/off) — có mặt ở cả ba.

    Diff thêm khoá consumer-facing `gap_probe: required|advisory|off` (default advisory), một hàng VIOLATION mới (required + thiếu gap-probe), ba hàng NOTE mới (advisory, descope-theo-ledger, probe-failed), và một escape hatch mới (entry `decisions.jsonl` mở đầu "bỏ gap-probe"). `grep -rn gap_probe GUIDE.md README.md QUICKSTART.md commands/ skills/` chỉ trả về 1 hit không liên quan (commands/acceptance-card.md:40).

    Ngoài ra `commands/acceptance-init.md` (bước 3 ghi `_acceptance/config.yaml`) không sinh khoá này, nên repo mới scaffold không hề biết cổng gap-probe tồn tại — trong khi cùng file đã chủ động scaffold `recheck`/`require_human_commit`. Vì `plugins/` là build mirror, sửa xong phải chạy `scripts/sync-plugin-packages.sh`.

### 6. README "Known limitations (v1)" vẫn khẳng định gap-probe KHÔNG có backstop ở merge boundary — chính là thứ diff này vừa làm

- title: README "Known limitations (v1)" vẫn khẳng định gap-probe KHÔNG có backstop ở merge boundary — chính là thứ diff này vừa làm
  file: README.md
  line: 279
  severity: medium
  source: conventions
  detail: |
    README.md:279-285 viết: gap-probe presence guard "lives ONLY in the PreToolUse hook", một contract advance dưới `ACCEPTANCE_GATE_BYPASS=1` hoặc bằng editor/`git` thuần "merges with no signal", và "Adding the second layer means a bash re-implementation of the rule in a `t3_paths` file, so it is queued as its own contract rather than bolted on".

    Diff này CHÍNH LÀ contract đó (`_acceptance/gap-probe-presence-hook/`, đã re-implement bằng bash trong `scripts/pre-merge-check.sh`), nhưng mục limitation không được gỡ/viết lại. Người đọc README (kể cả agent đọc để quyết định có cần tự kiểm) sẽ tin cổng vẫn hở.

    Tồn tại y hệt ở mirror `plugins/acceptance-gate/README.md:279`. Lưu ý bullet kế bên (T1-escape chưa neo glob) VẪN đúng và nên giữ — code mới cố ý neo `^_acceptance/<slug>/` riêng cho gap-probe (`slug_in_diff`), không sửa T1-escape.

## Low severity (2)

### 7. Suite test buộc chặt vào artifact `_acceptance/` của chính repo — trái pattern fixture-in-mktemp mà README viện dẫn

- title: Suite test buộc chặt vào artifact `_acceptance/` của chính repo — trái pattern fixture-in-mktemp mà README viện dẫn
  file: tests/scripts/run-tests.sh
  line: 1837
  severity: medium
  source: conventions
  detail: |
    GPM5c (dòng 1778-1783) đọc `$ROOT_REAL/_acceptance/gap-probe-presence-hook/gap-probe.md`, GPM12 (dòng 1837-1846) đọc `$ROOT_REAL/_acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt` và FAIL cứng (`check GPM12-missing 0 1`) khi file vắng. Mọi case còn lại trong suite dựng fixture trong `mktemp` (`mk_gp_repo`, `gp_feature`).

    Hai hệ quả: (a) suite của kit vĩnh viễn phụ thuộc thư mục acceptance của MỘT feature cụ thể — dọn/archive nó là suite đỏ vì lý do không liên quan; (b) `premerge-messages.txt` là stdout chép tay, sẽ trôi khỏi thông điệp thật ngay khi wording đổi mà không có gì phát hiện — trong khi bốn `hasout` của GPM12 chỉ tìm substring.

    Liên quan: `PREMERGE_FIXTURE_DIR` mới (dòng 28-32) cho phép vật chất hoá fixture `_acceptance/<slug>/` vào bên trong repo, đúng thứ README.md:290-292 nói suite cố tình tránh vì glob `*/_acceptance/*` của răng T1-escape chưa neo. Nên chốt fixture-dir bắt buộc nằm ngoài repo root, hoặc ghi rõ ràng buộc đó vào comment.

### 8. `descope`-escape regex diverges from gate-card.js in both directions, contradicting the parity the comment asserts

- title: `descope`-escape regex diverges from gate-card.js in both directions, contradicting the parity the comment asserts
  file: scripts/pre-merge-check.sh
  line: 140
  severity: low
  source: bugs
  detail: |
    The comment at lines 131-135 states this awk is "CÙNG luật /^\s*bỏ gap-probe/i mà scripts/gate-card.js dùng" and that a divergence means the Gate 1 card and pre-merge contradict each other on the same artifact. The two patterns are not equivalent:

    - awk uses `[Bb]ỏ[[:space:]]+gap-probe` — a bracket class over ASCII B/b only, followed by literal lowercase `ỏ` and lowercase `gap-probe`. The JS `/i` flag case-folds the whole string including the non-ASCII vowel.
    - awk allows one-or-more spaces between `bỏ` and `gap-probe`; the JS pattern requires exactly one.

    Both directions reproduce:

        decision: "BỎ GAP-PROBE — hoa toàn bộ"      → JS matches, awk does NOT
        decision: "bỏ  gap-probe — hai dấu cách"    → awk matches, JS does NOT

    So an all-caps descope reads as an intentional, audited drop on the Gate 1 card but produces `VIOLATION [<slug>]: chưa qua phản biện context sạch` at merge under `gap_probe: required`; a double-space descope does the opposite — pre-merge grants the escape hatch (merge proceeds) while the Gate 1 card still flags the feature as having no clean-context critique. The second direction is fail-open at the merge boundary. Same divergence in plugins/acceptance-gate/scripts/pre-merge-check.sh:140 vs plugins/acceptance-gate/scripts/gate-card.js:203.

## evals.yaml hygiene (không tính severity — theo dõi riêng)

### 9. evals.yaml đổi tên case GP→GPM chỉ một nửa — E2 và E7 vẫn trỏ id không còn tồn tại

- title: evals.yaml đổi tên case GP→GPM chỉ một nửa — E2 và E7 vẫn trỏ id không còn tồn tại
  file: _acceptance/gap-probe-presence-hook/evals.yaml
  line: 15
  severity: low
  source: conventions
  detail: |
    Diff đổi `case GPn` → `case GPMn` trong `expected` của E1-E13, nhưng bỏ sót vế thứ hai của hai eval: dòng 15 (E2) vẫn ghi "case GPM2 + GP2b", dòng 45 (E7) vẫn ghi "case GPM7 + GP7b". Suite thực tế đặt tên `GPM2b` (dòng 1739) và `GPM7b` (dòng 1806) — không có case nào tên `GP2b`/`GP7b`.

    `expected` là thứ verifier/judge S4 dùng để đối chiếu output với case, nên id chết ở đây làm bước VERIFY phải suy đoán — đúng loại mơ hồ mà `expected` sinh ra để loại bỏ.

## Chưa adversarial-verify (refuter chết)

Không có — toàn bộ 9 finding trên đều đã qua adversarial-verify (không có finding nào gắn `unverified: true`).
