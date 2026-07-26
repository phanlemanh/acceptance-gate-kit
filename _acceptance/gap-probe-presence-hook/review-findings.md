# Review Findings: gap-probe-presence-hook (round 2)

Informational — nằm NGOÀI phạm vi acceptance-evidence-gate hook (hook chỉ đọc
`evidence-report.md`/`contract.md`). File này liệt kê các finding đã qua
**adversarial-verify** (refuter đã chạy và xác nhận, không chỉ heuristic một
lượt) trên diff của feature `gap-probe-presence-hook` tính tới
`verified_commit: 8431a94a59ef35570db2f92c8a127ee70338aee8`, dùng để nạp cho
`evidence-page.js` (bảng "Review findings") và cho human đọc tại Gate 2. File
này GHI ĐÈ nội dung findings của round trước; lịch sử round nằm ở
`evidence-report.md` § Iterations.

Phạm vi round này: vẫn tập trung vào lớp merge-boundary
(`scripts/pre-merge-check.sh`, mirror
`plugins/acceptance-gate/scripts/pre-merge-check.sh`) cùng tài liệu/test đi
kèm (`_acceptance/config.yaml`, `GUIDE.md`, `tests/scripts/run-tests.sh`). Hai
finding dưới đây (#5, #6) là CÙNG root-cause đã ghi ở round 1 (§4 "DIFF_READY"
và §8 "descope regex lệch gate-card.js") — round này XÁC NHẬN LẠI bằng
adversarial-verify độc lập rằng cả hai VẪN CHƯA ĐƯỢC SỬA trong HEAD tại commit
đã pin. 8/8 finding dưới đây đều đã adversarial-verify thành công (không có
finding nào gắn `unverified: true`). Sắp xếp severity giảm dần.

## High severity (2)

### 1. `git diff` failure bị nuốt lặng lẽ — `DIFF_READY=1` biến cả gap-probe lẫn T1-escape thành no-op câm (exit 0, "clean")

- title: git diff failure is swallowed — DIFF_READY=1 turns both gap-probe and T1-escape into silent no-ops (exit 0, "clean")
  file: scripts/pre-merge-check.sh
  line: 216
  severity: high
  source: bugs
  detail: |
    Trong khối hoist diff-scope:

        DIFF_FILES="$(git -C "$ROOT" diff --name-only "$BASE_SHA...HEAD" -- 2>/dev/null)"
        DIFF_READY=1

    exit status của `git diff` bị bỏ qua và stderr bị nuốt, rồi `DIFF_READY` được set vô điều kiện. `git rev-parse --verify` thành công ở dòng 211-212 chỉ chứng minh base *object* tồn tại; `git diff A...HEAD` vẫn có thể fail với rc=128 và stdout rỗng khi không có merge base — shallow/grafted CI clone, unrelated histories, force-pushed base.

    Khi đó script tin rằng PR scope là KNOWN và EMPTY:
    - `slug_in_diff` (dòng 226) trả về false cho MỌI slug, nên toàn bộ luật gap-probe ở dòng 315 không bao giờ chạy — kể cả với `gap_probe: required` và một T3 slug thiếu cả gap-probe.md lẫn descope ledger.
    - T1-escape backstop (dòng 496-508) đọc `changed="$DIFF_FILES"` = rỗng, nên `gate_touched=0` không có hit và không báo gì — một PR đổi `src/**` (t3_path) với 0 artifact `_acceptance/` vẫn pass.
    - Visibility escape valve ở dòng 231 chỉ chạy khi `[ "$DIFF_READY" -eq 0 ]`, nên NOTE "gap-probe check skipped" KHÔNG in ra.
    - `.github/workflows/gate.yml:53` fail-closed guard grep stdout tìm `*"backstop skipped"*` — chuỗi đó vắng mặt, nên chính meta-guard của CI cũng bị bypass.

    Tái hiện: repo với `gap_probe: required`, T3 slug `feat-b` status=implemented không có gap-probe.md, đổi `src/app.js`, base = commit unrelated-history → output đúng là `pre-merge-check: clean`, exit 0. `git diff --name-only "$BASE...HEAD"` trên cùng cặp trả `fatal: ...: no merge base`, st=128.

    Code cũ đã có lỗ hổng này riêng cho T1-escape; bản hoist biến DIFF_READY thành thẩm quyền duy nhất cho "scope known" và mở rộng no-op câm sang luật thứ hai. Fix: rẽ nhánh theo status của lệnh — `if DIFF_FILES="$(git -C "$ROOT" diff --name-only "$BASE_SHA...HEAD" -- 2>/dev/null)"; then DIFF_READY=1; else DIFF_SKIP_NOTE="no merge base between \"$BASE\" and HEAD in this clone"; fi`. Cần fix giống hệt ở `plugins/acceptance-gate/scripts/pre-merge-check.sh:216` (file byte-identical).

    Đã ghi ở `review-findings.md` round 1 §4 nhưng CHƯA ĐƯỢC SỬA trong HEAD.

### 2. `slug_in_diff` neo `_acceptance/` vào git-root — luật gap-probe âm thầm tắt khi `_acceptance/` không nằm ở root

- title: slug_in_diff anchor silently disables the whole gap-probe rule when _acceptance/ is not at the git root
  file: scripts/pre-merge-check.sh
  line: 224
  severity: high
  source: conventions
  detail: |
    `slug_in_diff` match `grep -q "^_acceptance/$1/"` trên `DIFF_FILES`, nhưng `DIFF_FILES` đến từ `git -C "$ROOT" diff --name-only`, mà path của nó LUÔN tương đối với GIT TOP-LEVEL, không phải với `$ROOT`. Mọi consumer khác của cùng danh sách path này trong file cố ý chấp nhận cả hai dạng — `stale_files()` (dòng ~176) và khối T1-escape (dòng ~500) đều dùng `case "$f" in _acceptance/*|*/_acceptance/*)`. Helper mới là nơi DUY NHẤT giả định ROOT == git root.

    Hệ quả, đã tái hiện: với `gap_probe: required`, một T3 contract ở `status: implemented`, không có `gap-probe.md`, không có descope entry, và slug rõ ràng nằm trong PR diff — chạy `pre-merge-check.sh <repo>/pkg --base <sha>` khi `_acceptance/` nằm ở `pkg/_acceptance/` in ra KHÔNG GÌ về gap-probe và exit sạch. Fixture giống hệt với `_acceptance/` ở git root thì in đúng `VIOLATION [feat-x]: chưa qua phản biện context sạch (gap-probe)`.

    Điều này phá vỡ chính pattern mà khối này thiết lập hai dòng phía trên: `DIFF_READY == 0` in một NOTE thấy được vì "bỏ qua phải THẤY ĐƯỢC" (AC-12). Ở đây `DIFF_READY` là 1, nên NOTE bỏ qua cũng không được phát — luật tắt với zero tín hiệu. Đó chính là lớp false-green câm mà kit này sinh ra để chặn, nằm trong một file `t3_paths`.

    Lưu ý lý do biện minh cho anchor (fixture dưới `tests/.../_acceptance/<slug>/`) vẫn thoả mãn được mà không phá layout lồng nhau, vd match `_acceptance/$1/` hoặc `*/_acceptance/$1/` với cùng idiom `case` đã dùng ở chỗ khác trong file. Cùng dòng ở build mirror `plugins/acceptance-gate/scripts/pre-merge-check.sh`.

## Medium severity (2)

### 3. Descope matcher KHÔNG cùng luật với `gate-card.js` dù comment khẳng định song song

- title: Descope matcher is NOT the same rule as gate-card.js despite the comment asserting parity
  file: scripts/pre-merge-check.sh
  line: 147
  severity: medium
  source: conventions
  detail: |
    Comment ở dòng 139 nói awk matcher là "CÙNG luật /^\s*bỏ gap-probe/i mà scripts/gate-card.js dùng. Lệch nhau = thẻ Cổng 1 và pre-merge mâu thuẫn trên cùng một artifact." GUIDE.md:700 lặp lại lời hứa này ("thẻ Cổng 1 cũng nhận cùng luật"). Hai luật KHÔNG tương đương:

    - `gate-card.js:203` dùng flag `i` của JS, Unicode-aware và case-fold toàn bộ pattern.
    - Pattern awk `/"decision"[[:space:]]*:[[:space:]]*"[[:space:]]*[Bb]ỏ[[:space:]]+gap-probe/` chỉ case-fold CHỮ CÁI ĐẦU (`[Bb]`), và case-sensitive hoàn toàn trên `ỏ` và trên literal `gap-probe`.

    Tái hiện: `{"decision":"BỎ GAP-PROBE — hoa het"}` và `{"decision":"bỏ Gap-Probe — hoa mot phan"}` đều trả true trong regex gate-card nhưng đều KHÔNG match trong awk. Dưới `gap_probe: required`, điều đó nghĩa là Gate 1 card render feature là đã descope (`descoped: true`, không fwarn) trong khi pre-merge phát `VIOLATION [...]: chưa qua phản biện context sạch` và chặn merge — đúng mâu thuẫn mà comment nói không được xảy ra. Test GPM7b chỉ cover `"  Bỏ gap-probe"`, nên độ lệch này chưa được test.

    (Chiều ngược lại: awk cho phép `[[:space:]]+` giữa `bỏ` và `gap-probe`, JS regex yêu cầu đúng một khoảng trắng, nên `"bỏ  gap-probe"` được descope cho pre-merge nhưng không cho card.) Cùng dòng ở build mirror.

### 4. Regex descope-escape lệch `gate-card.js` ở CẢ HAI chiều, mâu thuẫn với song song mà comment khẳng định

- title: descope-escape regex diverges from gate-card.js in both directions, contradicting the parity the comment asserts
  file: scripts/pre-merge-check.sh
  line: 147
  severity: medium
  source: bugs
  detail: |
    `gap_probe_descope_id()` match bằng awk:

        /"decision"[[:space:]]*:[[:space:]]*"[[:space:]]*[Bb]ỏ[[:space:]]+gap-probe/

    Comment phía trên (dòng 138-142) khẳng định đây là "CÙNG luật /^\s*bỏ gap-probe/i mà scripts/gate-card.js dùng" và lệch nhau sẽ khiến thẻ Gate-1 và pre-merge mâu thuẫn trên cùng artifact. Nó lệch ở CẢ HAI chiều — đã kiểm chứng bằng cách chạy cả hai engine trên cùng chuỗi:

    - `"decision":"BỎ GAP-PROBE — hoa toàn bộ"` → `gate-card.js:203` MATCH (JS `/i` case-fold `ỏ`→`Ỏ` và `gap-probe`), awk KHÔNG match (`[Bb]ỏ` chỉ cover chữ đầu; `ỏ` và `gap-probe` là literal lowercase). Kết quả: thẻ Gate-1 render "Đã bỏ phản biện context sạch theo d-NN — quyết định chủ động, có dấu vết" (finfo, xanh) trong khi pre-merge ở mode `required` phát `VIOLATION [slug]: ... ledger không có entry descope` và chặn merge. False red, và hai gate mâu thuẫn thẳng thừng.
    - `"decision":"bỏ  gap-probe — x"` (hai khoảng trắng) → awk MATCH (`[[:space:]]+`), `gate-card.js` KHÔNG match (literal một khoảng trắng). Kết quả: pre-merge cho merge qua với NOTE trấn an trong khi thẻ vẫn flag "Chưa có phản biện context sạch". Chiều này là false green ở merge boundary.

    Test GPM7b chỉ cover `  Bỏ gap-probe` (leading-space + chữ B hoa), thứ mà cả hai engine tình cờ đồng ý, nên suite xanh trên chính độ lệch này. Cùng code ở `plugins/acceptance-gate/scripts/pre-merge-check.sh:147`.

    Đã ghi ở `review-findings.md` round 1 §8 nhưng CHƯA ĐƯỢC SỬA trong HEAD.

## Low severity (4)

### 5. Luật mới ship mà chính kit chưa dogfood, và README xoá bỏ giới hạn mà mode mặc định chưa thật sự đóng

- title: New enforcement ships without the kit dogfooding it, and README deletes the limitation the default mode does not actually close
  file: _acceptance/config.yaml
  line: 15
  severity: low
  source: conventions
  detail: |
    `_acceptance/config.yaml` của chính kit được viết quanh lập trường đã nêu "kit tự bắt mình theo mức chặt nhất" (comment inline trên `recheck: strict`, ngay cạnh ghi chú rằng consumer có thể dùng `warn`). Khoá `gap_probe` mới không được thêm vào đó, nên kit chạy luật t3_paths mới của chính mình ở `advisory` — cùng mode lỏng hơn mà nó bảo consumer là dành cho repo "chưa quen". `.github/workflows/gate.yml` làm nặng thêm vấn đề: job `gate` chạy `pre-merge-check.sh .` không có `--base`, nên luật bị bỏ qua hẳn ở đó, và job duy nhất truyền `--base` (`T1-escape backstop`) sẽ chỉ thấy NOTE, không bao giờ thấy VIOLATION.

    Liên quan: README.md bỏ hẳn bullet "The gap-probe rule has no merge-boundary backstop" khỏi `## Known limitations (v1)`, nhưng out of the box (khoá vắng → `advisory`) một PR thiếu gap-probe vẫn merge được, chỉ kèm NOTE. Giới hạn bị THU HẸP, không phải GỠ BỎ, và README không còn nói vậy — GUIDE.md:684 giờ là nơi duy nhất ghi lại giới hạn này.

### 6. Trôi thuật ngữ: "Cổng" (Gate viết hoa) dùng để gọi máy móc pre-merge trong GUIDE và template config đóng gói

- title: Glossary drift: "Cổng" (capitalized Gate) used to name pre-merge machinery in GUIDE and the shipped config template
  file: GUIDE.md
  line: 522
  severity: low
  source: conventions
  detail: |
    CLAUDE.md đặt việc tuân thủ CONTEXT.md là invariant cho docs và script messages. CONTEXT.md > "Gate" dành từ viết hoa CHỈ cho các điểm dừng human (Gate 1 / Gate 1.5 / Gate 2) và gọi tên máy móc rõ ràng: "CI gọi là **pre-merge check**"; `_Avoid_: evidence gate, merge gate, quality gate (khi chỉ hook/CI)`. Carve-out cố ý duy nhất là `P0 design gate`, và nó bị giới hạn trong đúng danh từ riêng đó.

    Đoạn text mới gọi một luật CI là Cổng ở hai nơi consumer-visible:
    - GUIDE.md:522 — `| gap_probe | Cổng phản biện context sạch ở pre-merge: ... |`
    - commands/acceptance-init.md:38 — `gap_probe: advisory  # Cổng phản biện context sạch ở pre-merge: ...` (khoá này được scaffold vào config.yaml của MỌI repo consumer, và mirror sang plugins/)

    Mọi chữ `Cổng` khác trong GUIDE.md (dòng 61, 69, 109-110, 199-203, 575, 588, 622-624, ...) đều là gate human, nên đây là ngoại lệ duy nhất. Lint W6 chỉ check contract prose so với chuỗi `_Avoid_` tiếng Anh, nên không có gì tự bắt lỗi này. Cách gọi đúng chuẩn ví dụ: "Luật phản biện context sạch ở pre-merge check".

### 7. `slug_in_diff` neo `^_acceptance/` vào path tương đối git-root — luật âm thầm tắt khi `_acceptance/` không ở git root

- title: slug_in_diff anchors ^_acceptance/ against repo-root-relative git paths — rule silently disabled when _acceptance/ is not at the git root
  file: scripts/pre-merge-check.sh
  line: 226
  severity: low
  source: bugs
  detail: |
    `slug_in_diff` làm `printf '%s\n' "$DIFF_FILES" | grep -q "^_acceptance/$1/"`, nhưng `git -C "$ROOT" diff --name-only` phát path tương đối với GIT REPO ROOT, không phải `$ROOT`. Script chấp nhận argument `repo_root` tuỳ ý, và khối T1-escape 20 dòng phía dưới xử lý tường minh case lồng nhau (`case "$f" in _acceptance/*|*/_acceptance/*)`), nên `_acceptance/` không ở root là layout mà kit đã tính tới.

    Khi `$ROOT` là subdirectory của git repo, mọi diff path đều có prefix (`sub/_acceptance/<slug>/contract.md`), grep có anchor không bao giờ match, và luật gap-probe bị bỏ qua cho mọi slug ở mode `required` — KHÔNG in gì cả, vì NOTE "gap-probe check skipped" ở dòng 231 chỉ chạy khi `DIFF_READY -eq 0` mà DIFF_READY ở đây là 1.

    Tái hiện: git repo tại $W, kit workspace tại $W/sub/_acceptance với `gap_probe: required` và T3 slug feat-b (implemented, không có gap-probe.md), `sub/_acceptance/feat-b/contract.md` và `sub/src/app.js` đều trong diff → `bash scripts/pre-merge-check.sh "$W/sub" --base "$B"` chỉ in `pre-merge-check: clean`.

    Comment dòng 221-223 biện minh anchor là để chặn fixture `tests/.../_acceptance/<slug>/`, điều đó hợp lý — nhưng fix nên so path đã làm tương đối với `$ROOT` (vd qua `git -C "$ROOT" rev-parse --show-prefix`) thay vì giả định ROOT == git root, nếu không guard sẽ âm thầm tắt thay vì thu hẹp phạm vi đúng.

### 8. `PREMERGE_FIXTURE_DIR` có thể vật chất hoá fixture `_acceptance/<slug>/` bên trong repo, vô hiệu hoá T1-escape backstop; chỉ có comment canh giữ

- title: PREMERGE_FIXTURE_DIR can materialize _acceptance/<slug>/ fixtures inside the repo, defeating the T1-escape backstop; only a comment guards it
  file: tests/scripts/run-tests.sh
  line: 31
  severity: low
  source: bugs
  detail: |
    Opt-out mới của cleanup trap:

        T="${PREMERGE_FIXTURE_DIR:-$(mktemp -d)}"
        [ -n "${PREMERGE_FIXTURE_DIR:-}" ] || trap 'rm -rf "$T"' EXIT

    nghĩa là khi env var được set, fixture được tạo VÀ để lại. Fixture dựng cây `_acceptance/<slug>/` (mk_gp_repo / gp_feature). Nếu var trỏ vào bên trong repo, các path còn sót lại đó match glob không-neo `*/_acceptance/*` của T1-escape backstop (dòng 500 của pre-merge-check.sh), nên `gate_touched=1` và backstop kết luận "PR này mang gate artifact" — đúng lỗ hổng README.md:277-283 ghi là giới hạn đã biết, giờ có thể chạm phải do vô ý.

    Bảo vệ duy nhất là comment ở dòng 28-30 dặn operator trỏ var ra ngoài repo; không có gì enforce điều đó. Fix rẻ tiền là reject một `PREMERGE_FIXTURE_DIR` resolve vào dưới repo root, cùng cách comment đã lập luận.

## Chưa adversarial-verify (refuter chết)

Không có — toàn bộ 8 finding trên đều đã qua adversarial-verify (không có finding nào gắn `unverified: true`).
