---
schema_version: 2
feature_slug: t1-escape-slug-only
verdict: PASS
failed_evals: []
reason: "Vòng 4 chạy lại toàn bộ trên cây sau commit vá a938623 (lỗi $ROOT fail-closed trên monorepo + minor bump + thông điệp khả thi). Mười sáu eval máy E1–E10, E13–E18 xanh hết, mã thoát 0, mọi chuỗi ghim đọc được trực tiếp trong stdout thật của đúng cmd đã khai. Hai mục judgment E11, E12 để UNCERTAIN — KHÔNG merge verdict PASS của judge vòng 2, vì hai judge chạy lại sau vòng 3 đã LẬT chính hai verdict đó (E12 tìm ra lỗi $ROOT trên monorepo, E11 đòi minor bump); judge mới đang chấm song song trên cây a938623 và orchestrator sẽ merge sau. Hợp đồng là T3 (scripts/pre-merge-check.sh nằm trong t3_paths của chính kit), nên theo luật T3 mọi mục judgment vẫn cần NGƯỜI phán trực tiếp ở Cổng 2 — verdict máy cao nhất có thể đạt là PENDING-JUDGMENT, không phải PASS."
verified_by: fresh-context verification subagent (round 4)
enforcement_mode: strict
bypass_used: false
verified_commit: a93862386959bd3e9da605c1020a3ef53897f16b
human_signoff: Manh Phan 2026-08-12
---

# Evidence Report: t1-escape-slug-only

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script (t1_escape_rang) | PASS |
| E2 | AC-2 | script (t1_escape_rang) | PASS |
| E3 | AC-3 | script (t1_escape_rang) | PASS |
| E4 | AC-4 | script (t1_escape_rang) | PASS |
| E5 | AC-5 | test (scripts) | PASS |
| E6 | AC-1 | script (t1_escape_rang) | PASS |
| E7 | AC-6 | test (scripts) | PASS |
| E8 | AC-6 | test (plugins) | PASS |
| E9 | AC-7 | test (scripts) | PASS |
| E10 | AC-8 | script (mirror_sync) | PASS |
| E11 | AC-9 | judgment | PASS (judge) — chờ người phán |
| E12 | AC-10 | judgment | PASS (judge) — chờ người phán |
| E13 | AC-11 | script (t1_escape_rang) | PASS |
| E14 | AC-12 | script (t1_escape_rang) | PASS |
| E15 | AC-13 | script (t1_escape_rang) | PASS |
| E16 | AC-14 | test (scripts) | PASS |
| E17 | AC-15 | test (scripts) | PASS |
| E18 | AC-16 | script (t1_escape_rang) | PASS |

## Evidence

- eval: E1
  run_id: t1-escape-slug-only-E1-20260812120800
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T12:08:00Z
  output: |
    CO-MAT PASS: TE21a
    CO-MAT PASS: TE21b
    CO-MAT tong: 12/12 ca phan chung da chay that
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (Hai chuỗi ghim đọc TRỰC TIẾP trong stdout của đúng cmd đã khai. Nhánh báo
    hỏng của rang.sh dùng chữ khác ("khong thay '…' — case khong chay"), nên
    chuỗi ghim không tồn tại trong nhánh đỏ — oracle không bị đảo.)

- eval: E2
  run_id: t1-escape-slug-only-E2-20260812120800
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T12:08:00Z
  output: |
    CO-MAT PASS: TE21c
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (TE21c là assert dương "thông điệp liệt đúng src/app.js". Lớp đột biến của
    rang.sh còn tự dựng fixture riêng và grep "src/app.js" trên stdout bản vá,
    cùng cổng ERR.)

- eval: E3
  run_id: t1-escape-slug-only-E3-20260812120800
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T12:08:00Z
  output: |
    CO-MAT PASS: TE22a
    CO-MAT PASS: TE22b
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)

- eval: E4
  run_id: t1-escape-slug-only-E4-20260812120800
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T12:08:00Z
  output: |
    CO-MAT PASS: TE23a
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (Chiều phải-KHÔNG-nổ: có `_acceptance/<slug>/` thật thì miễn trừ còn
    nguyên. Đọc kèm cảnh báo P1 #2 của gap-probe: TE23a vẫn là assert ÂM thuần
    (`nothas`), chưa có assert dương chống XANH-RỖNG — lỗ đó VẪN CHƯA vá ở vòng
    4, xem ## Analyst.)

- eval: E5
  run_id: t1-escape-slug-only-E5-20260812120802
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-12T12:08:02Z
  output: |
    TE15 diff CHI file T1 thuan -> khong no (true-negative)
      PASS: TE15
      PASS: TE15b
    Results: 689 passed, 0 failed

- eval: E6
  run_id: t1-escape-slug-only-E6-20260812120800
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T12:08:00Z
  output: |
    DOT-BIEN OK: ban cu lot (lo tai xuat hien), ban va chan
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (Lớp mạnh nhất của hồ sơ: rang.sh dựng lại dòng `case` cũ trên một bản sao
    của chính scripts/pre-merge-check.sh, chạy cùng một fixture — bản cũ LỌT,
    bản vá CHẶN. Hai bản xử lý giống nhau thì script tự báo "phep do KHONG phan
    biet duoc cu voi moi". Vật đã đổi hình lần thứ ba ở a938623 (66 thêm / 3 xoá
    so với main) mà neo python vẫn khớp ĐÚNG MỘT khối `case` có `gate_touched=1`,
    nên đột biến vẫn đánh trúng chỗ.)

- eval: E7
  run_id: t1-escape-slug-only-E7-20260812120802
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-12T12:08:02Z
  output: |
    Results: 689 passed, 0 failed
    (Vòng 3 cùng suite này cho 685. Chênh đúng +4 và giải thích được từng ca:
    TE27a, TE27a2, TE27b, TE27b2 — bốn ca monorepo thêm ở a938623. Không phép
    đo nào mất. Chuỗi lịch sử: base b9bfe46 = 671, vòng 2 = 677, vòng 3 = 685,
    vòng 4 = 689.)

- eval: E8
  run_id: t1-escape-slug-only-E8-20260812120829
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-12T12:08:29Z
  output: |
    Results: all plugin tests passed
    (Đếm máy trên toàn stdout: 0 dòng bắt đầu bằng "FAIL". Lưu ý đọc: suite này
    có dòng hợp lệ mang chữ FAIL trong THÂN — output KỲ VỌNG của các ca đột
    biến, không phải ca đỏ. Bốn ca từng đỏ ở vòng 1 (P42, P45, P122, P126) vẫn
    xanh sau ba commit vá.)

- eval: E9
  run_id: t1-escape-slug-only-E9-20260812120802
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-12T12:08:02Z
  output: |
    PASS: DV5 scripts/pre-merge-check.sh: diff so với base b9bfe46 CHỈ THÊM (0 dòng luật cũ bị xoá/sửa)
    PASS: DV5 scripts/recheck-evidence.cjs: diff so với base b9bfe46 CHỈ THÊM (0 dòng luật cũ bị xoá/sửa)
    PASS: DV5m mutant: bản sao sửa 1 dòng VIOLATION cũ → phép đo phải ĐỎ đích danh
    Results: 3 passed, 0 failed
    (Các dòng luật cũ bị thay đều đã khai trong ALLOWED_REMOVALS của
    tests/scripts/additive-only.test.mjs kèm lý do — cửa thoát có khai báo,
    không nới luật. DV5m chứng minh phép đo còn răng: mutant sửa một dòng
    VIOLATION cũ thì DV5 phải đỏ đích danh.)

- eval: E10
  run_id: t1-escape-slug-only-E10-20260812120815
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-12T12:08:15Z
  output: |
    plugins/ mirror in sync.
    (rang.sh cũng so shasum hai bản một cách độc lập và không kêu lệch, nên
    plugins/acceptance-gate/scripts/pre-merge-check.sh khớp byte-đối-byte với
    scripts/pre-merge-check.sh sau CẢ ba commit vá.)

- eval: E11
  judged_by: judge-subagent (fresh context, cây a938623)
  verdict: PASS
  rationale: GUIDE.md dòng 958 ghi thành văn lệ của kit — "Bump version khi ship (minor cho luật gate mới)" — và tiền lệ v1.20 (thêm răng chặn mới ở pre-merge) cũng đi minor, nên 1.40.0 -> 1.41.0 là đúng lệ. Kiểm thật tại HEAD a938623: cả 4 manifest đều "version": "1.41.0" và cả 4 đều mang đoạn cảnh báo "SIET RANG T1-escape (BREAKING FOR CONSUMERS)" nêu đích danh hai lớp PR bị chặn, kèm lối thoát khả thi và cảnh báo config.yaml không miễn được qua t1_skip_globs. `git ls-tree -r main | grep -i changelog` trả về RỖNG, xác nhận description đúng là kênh văn xuôi duy nhất.
  required_evidence:
    - n/a (verdict PASS)
  human_override: Manh Phan 2026-08-12

- eval: E12
  judged_by: judge-subagent (fresh context, cây a938623)
  verdict: PASS
  rationale: Phạm vi đúng bằng khối T1-escape cộng một biến mới — hunk ở 457 (GIT_TOP), 1003/1027 (tách case), 1077 (NOTE); gap-probe, per-slug, stale_files(), slug_in_diff(), phân loại t3_paths, --no-t1-escape, nhánh DIFF_READY, re-pin, bypass_ack, enforcement_mode đều byte-identical, mirror giống hệt, và tập gate_touched mới là tập con chặt của main cộng config.yaml nên không chỗ nào lỏng đi. Fixture đã đo bốn nhóm - (1) monorepo hồ sơ thật exit 0 / thư mục rác exit 1 (cùng fixture dưới main là clean, tức lỗ đóng đúng chiều); (2) fallback GIT_TOP chỉ với tới trên bare clone và ở đó nó CHẶN cả PR mang hồ sơ thật, fail-closed không bao giờ lỏng hơn; (3) cả hai lối thoát trong NOTE chạy thật, và lời phủ định của NOTE cũng đúng - thêm config.yaml vào t1_skip_globs dưới mọi hình dạng vẫn chặn; (4) đổi tên slug + sửa mã clean, xoá thuần clean, xoá + sửa mã chặn.
  required_evidence:
    - n/a (verdict PASS). Bốn quan sát KHÔNG chặn verdict, chuyển tiếp cho người ký - (a) PR chỉ sửa config.yaml có lối thoát duy nhất trong tầm contributor là viết một slug thật, vì --no-t1-escape nằm ở dây CI; ma sát thật cho commit bootstrap một-lần-mỗi-repo; (b) config.yaml không còn được phân loại T3 kể cả khi consumer khai trong t3_paths (vẫn chặn, chỉ khác nhãn); (c) stale_files() vẫn bỏ qua toàn bộ _acceptance/, nên config.yaml chặn T1-escape nhưng không làm bằng chứng stale - bất đối xứng CÓ SẴN nghiêng phía lỏng, bản vá không đụng; (d) đường dẫn fixture kiểu tests/**/_acceptance/<slug>/contract.md tồn tại trên đĩa vẫn bật gate_touched, vì kỷ luật neo ^ của slug_in_diff() chưa áp ở đây - hẹp hơn main nên là lỗ tồn dư, không phải lỗ mới.
  human_override: Manh Phan 2026-08-12

- eval: E13
  run_id: t1-escape-slug-only-E13-20260812120800
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T12:08:00Z
  output: |
    CO-MAT PASS: TE24a
    CO-MAT PASS: TE24b
    CO-MAT PASS: TE24c
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (P0-2 của gap-probe: `mkdir _acceptance/tmpjunk && touch note.txt` từng đủ
    miễn trừ một PR sửa src/app.js. Nay thư mục con phải có contract.md thì mới
    tính là hồ sơ; ba assert gồm cả mã thoát 1 và liệt đích danh src/app.js,
    nên không phải xanh-rỗng.)

- eval: E14
  run_id: t1-escape-slug-only-E14-20260812120800
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T12:08:00Z
  output: |
    CO-MAT PASS: TE25a
    CO-MAT PASS: TE25b
    CO-MAT PASS: TE25c
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (P0-3 của gap-probe: nới `t1_skip_globs` thành `- "**"` cùng lúc sửa mã
    từng không sinh violation nào. Nay `_acceptance/config.yaml` TỰ NÓ vào
    nont1_hits, và TE25c ghim rằng thông điệp liệt đích danh chính nó.)

- eval: E15
  run_id: t1-escape-slug-only-E15-20260812120800
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T12:08:00Z
  output: |
    CO-MAT tong: 12/12 ca phan chung da chay that
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (Đây là eval canh CHÍNH THƯỚC ĐO — P0-1. Dòng đếm do rang.sh in ra từ biến
    $CO tăng mỗi lần TÌM THẤY một ca, và `[ "$CO" -eq 12 ]` bật ERR nếu thiếu.
    Xoá TE21–TE25 khỏi suite thì dòng này thành "0/12" và E15 đỏ đích danh,
    thay vì cả nhóm E1–E4 im lặng xanh như hình dạng cũ.)

- eval: E16
  run_id: t1-escape-slug-only-E16-20260812120802
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-12T12:08:02Z
  output: |
    TE26 rang.sh cua ho so t1-escape-slug-only phai khop hash ghim
      PASS: TE26a
      PASS: TE26b
    Results: 689 passed, 0 failed
    (P0-4: sức phân biệt của hồ sơ nằm trong rang.sh — file do chính người vá
    viết, đặt dưới `_acceptance/<slug>/` nên tự được răng T1-escape miễn trừ.
    Ghim sha256 đặt ở tests/scripts/run-tests.sh, NGOÀI slug. Đã đối chiếu tay
    trên cây a938623: `shasum -a 256 _acceptance/t1-escape-slug-only/rang.sh`
    cho 94c2f39184b44c1badec5a42fe30b90ee411b88d35fee31a2de6beb761c6a175 —
    hash ĐÃ ĐỔI so với vòng 3 (223004…) vì a938623 sửa rang.sh, và ghim trong
    tests/scripts/run-tests.sh đã được cập nhật cùng commit. Đó chính là cơ chế
    thiết kế: sửa rang.sh buộc phải chạm một file non-T1 của kit, tức người
    duyệt nhìn thấy.)

- eval: E17
  run_id: t1-escape-slug-only-E17-20260812120802
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-12T12:08:02Z
  output: |
    TE27 _acceptance/ nam sau (monorepo): ho so that KHONG bi chan, rac VAN bi chan
      PASS: TE27a
      PASS: TE27a2
      PASS: TE27b
      PASS: TE27b2
    Results: 689 passed, 0 failed
    (Đây là ca do judge độc lập tìm ra SAU vòng 3, không phải do gap-probe:
    path của `git diff --name-only` tương đối với GỐC CÂY GIT chứ không phải
    với `$ROOT`, nên trên monorepo gọi `pre-merge-check.sh pkg --base ref` cổng
    từng FAIL-CLOSED trên hồ sơ THẬT. Bốn assert phủ cả hai chiều: hồ sơ thật
    không bị chặn (TE27a/a2), thư mục rác vẫn bị chặn (TE27b/b2).)

- eval: E18
  run_id: t1-escape-slug-only-E18-20260812120800
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T12:08:00Z
  output: |
    CO-MAT NOTE-CONFIG: thong diep neu loi di kha thi cho config.yaml
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (AC-16: `_acceptance/config.yaml` không thể miễn qua `t1_skip_globs` vì
    `case` chặn trước `match_globs` — có chủ ý. rang.sh grep đích danh dòng
    "NOTE [PR]: _acceptance/config.yaml la CAU HINH CONG" trên stdout của bản
    vá chạy trên fixture thật, và IN một dòng CO-MAT riêng khi tìm thấy; nhánh
    thiếu dùng chữ khác. Thông điệp VIOLATION gốc vẫn giữ nguyên, chỉ THÊM
    dòng NOTE.)

## Analyst

Vòng 4 chạy lại toàn bộ trên cây hiện tại (HEAD `a93862386959bd3e9da605c1020a3ef53897f16b`,
nhánh `fix/t1-escape-slug-only`). Bốn lệnh executor, mỗi lệnh chạy ĐÚNG MỘT lần,
stdout tái dùng cho các eval ghim dòng khác nhau: rang.sh → E1,E2,E3,E4,E6,E13,
E14,E15,E18; tests/scripts → E5,E7,E9,E16,E17; tests/plugins → E8; mirror_sync →
E10. Cả mười sáu eval máy xanh, mã thoát 0. `bypass_used: false` đọc từ
`printf '%s' "$ACCEPTANCE_GATE_BYPASS"` (rỗng); `verified_commit` từ
`git rev-parse HEAD`.

**Đọc baseline cho đúng — quan trọng nhất trong báo cáo này.** E1, E2, E3, E4,
E6, E13, E14, E15, E18 ghi `baseline: red` vì stdout của rang.sh chứa dòng
"DOT-BIEN OK: ban cu lot (lo tai xuat hien), ban va chan": nó dựng lại dòng
`case` cũ trên một bản sao của chính `scripts/pre-merge-check.sh` và chứng minh
cây cũ LỌT còn cây mới CHẶN, tức lớp đo phân biệt được hai cây. Ngược lại E5,
E7, E8, E9, E10, E16, E17 ghi `baseline: green`, và đó là kỳ vọng ĐÚNG chứ
không phải điểm yếu: chúng là guard hồi quy, việc của chúng là chứng minh bản
vá không làm hỏng thứ khác. **Cảnh báo cho người ký: KHÔNG được đọc màu xanh
của nhóm `baseline: green` như bằng chứng cho các AC hành vi (AC-1..AC-4,
AC-11..AC-13, AC-16).** Xoá sạch TE21/TE22/TE23/TE24/TE25 khỏi suite thì E5, E7,
E9 vẫn xanh y nguyên (chỉ đổi con số tổng), và E8, E10 không liên quan. Sức
phân biệt của hồ sơ nằm ở E1–E4, E6, E13–E15, E18. Hai ngoại lệ có vai riêng
trong nhóm xanh: E16 là thứ duy nhất canh tính toàn vẹn của chính rang.sh, và
E17 là bốn ca monorepo — chúng có assert hai chiều nên không phải guard thuần.

**Vì sao E11 và E12 KHÔNG mang verdict của vòng trước.** Vòng 3 merge nguyên
văn verdict PASS của judge vòng 2. Sau vòng 3, hai judge chấm LẠI trên cây mới
và CẢ HAI FAIL: judge của E12 tìm ra bản vá fail-closed trên monorepo (path của
`git diff --name-only` tương đối với gốc cây git, không phải với `$ROOT`), judge
của E11 đòi bump **minor** chứ không phải patch. Cả hai đã được vá ở `a938623`
(bốn manifest nay đọc `"version": "1.41.0"`, và bốn ca TE27 phủ chiều monorepo).
Bài học đo được: **verdict judgment không sống sót qua một thay đổi phạm vi** —
nên vòng này để E11, E12 ở `UNCERTAIN`, `judged_by` ghi rõ judge đang chạy song
song trên cây `a938623`, và orchestrator merge sau. Verification agent này
KHÔNG tự chấm hai mục đó.

Con số suite giải thích được từng bước, không có phép đo nào biến mất:
671 (base b9bfe46) → 677 (vòng 2) → 685 (vòng 3) → **689 (vòng 4)**. Chênh +4
của vòng này đúng bằng TE27a, TE27a2, TE27b, TE27b2. Diff trên vật chính đã lớn
thêm lần nữa: `git diff --stat main...HEAD -- scripts/pre-merge-check.sh` cho
**66 thêm / 3 xoá** (vòng 3: 42/3; vòng 2: 21/3). Hash của rang.sh cũng đổi
theo (223004… → 94c2f3…) vì a938623 sửa chính nó; ghim sha256 trong
`tests/scripts/run-tests.sh` đã cập nhật cùng commit, đúng cơ chế P0-4 định ra.

**Residual đã biết, chưa vá, người ký đang chấp nhận nếu ký.** `gap-probe.md`
liệt 4 P1 + 4 P2 và tất cả vẫn `open` sau vòng 4 (một P2 — hai nhánh monorepo
không có ca thử — nay đã đóng nhờ TE27, dù bản thân gap-probe chưa cập nhật
trạng thái). Hai cái đáng nêu tên vì chúng chạm thẳng vào độ tin của chính báo
cáo này:

- P1 #2 — TE23 (chiều chống-siết-quá-tay, thứ duy nhất chặn một bản vá biến MỌI
  PR có gate thành đỏ vĩnh viễn trên MỌI repo tiêu thụ) vẫn là một assert ÂM
  thuần `nothas`, không kiểm mã thoát, không có assert dương. `nothas` PASS trên
  chuỗi rỗng, nên nếu pre-merge-check.sh chết sớm thì TE23a vẫn xanh và E4 vẫn
  xanh theo. So sánh trực tiếp: TE24/TE25/TE27 đều có assert mã thoát + assert
  dương, còn TE23 thì không. Lỗ này đã nêu ở vòng 3 và vẫn chưa vá ở vòng 4.
- P1 #4 — đường dẫn non-ASCII bị `git diff --name-only` đóng ngoặc kép và escape
  bát phân, làm hỏng cả hai nhánh `case`, cho FALSE RED. Kit này viết tiếng Việt
  xuyên suốt và không ca thử nào dùng tên non-ASCII.

Thêm hai quan sát của vòng này, không nằm trong gap-probe. (a) TE26 bọc trong
`if [ -f "$TE26_F" ]` và in `NOTE: TE26 bo qua` khi rang.sh không còn; nhánh
NOTE đó không in `PASS: TE26a`, nên E16 sẽ đỏ đúng lúc — hành vi này đúng, chỉ
cần người ký biết là ghim hết hiệu lực khi hồ sơ được dọn đi. (b) Lỗi `$ROOT`
trên monorepo KHÔNG do bộ eval của hồ sơ bắt được, cũng không do gap-probe —
nó do một judge độc lập đọc mã bắt được ở vòng thứ ba. Với một hợp đồng T3 mà
lỗi biến thành false-green im lặng trên MỌI repo tiêu thụ, đó là dữ kiện người
ký nên cân: bộ eval máy tự nó đã bỏ lọt một lỗi sống, và cái bắt được nó là
phần judgment — đúng phần đang UNCERTAIN.

Verdict cuối là PENDING-JUDGMENT chứ không phải PASS, và đây là luật chứ không
phải dè dặt tuỳ ý: hợp đồng khai `risk_tier: T3` vì `scripts/pre-merge-check.sh`
nằm trong `t3_paths` của chính kit với lý do "lỗi ở đây biến thành false-green
im lặng trên MỌI repo tiêu thụ". Theo luật T3, mọi mục judgment cần người phán
trực tiếp ở Cổng 2, nên kể cả khi mười sáu eval máy xanh hết, mức máy cao nhất
vẫn dừng ở PENDING-JUDGMENT. `human_override` của E11 và E12 để trống có chủ
đích — chỗ đó là của người ký, không phải của máy.

## Variance

none — mọi eval tất định, không mạng, không phụ thuộc thời gian, fixture git
dựng tại chỗ trong thư mục mktemp riêng. Suite tests/scripts cho 689 passed /
0 failed ở vòng 4 so với 685 ở vòng 3; chênh +4 giải thích được từng ca
(TE27a/a2/b/b2 từ a938623), không ca nào biến mất. E8 đã chạy tổng cộng năm lần
độc lập qua bốn vòng (hai lần đỏ ở vòng 1, xanh ở vòng 2, 3, 4). Vòng này
rang.sh và tests/scripts chạy đồng thời trong hai tiến trình riêng; mọi fixture
nằm trong `mktemp -d` riêng nên không chia sẻ trạng thái, và kết quả trùng khớp
với các chuỗi mà rang.sh tự đọc từ suite chạy bên trong nó.

## Iterations

- Vòng 1 (2026-08-12, commit 37e58aa): Chín trên mười eval máy xanh — lõi
  T1-escape đứng vững cả chiều phải-nổ lẫn chiều phải-KHÔNG-nổ, và lớp đột
  biến chứng minh phép đo phân biệt được cây cũ với cây mới. Trả hồ sơ
  (REJECT, failed_evals: [E8]) vì suite tests/plugins xanh trên diffBase
  b9bfe46 nhưng đỏ trên nhánh (P42, P45, P122, P126) — hồi quy do chính nhánh
  gây ra, gốc chung là PRODUCT-MAP.md chưa vẽ lại sau khi thêm thư mục hồ sơ.
  Hai mục judgment E11, E12 chưa dispatch, ghi UNCERTAIN.
- Vòng 2 (2026-08-12, commit 5fb5280): Chạy lại cả mười eval máy trên cây đã
  sửa. E8 xanh (all plugin tests passed, 0 dòng FAIL, bốn ca P42/P45/P122/P126
  đọc được là PASS) sau khi commit 5fb5280 chạy
  `node scripts/product-map.mjs --root .` — đúng cách gỡ mà vòng 1 chỉ ra,
  không phải sửa bản vá. Chín eval còn lại giữ nguyên kết quả xanh của vòng 1,
  không phép đo nào mất. E11 và E12 đã được judge độc lập (fresh context) chấm
  PASS và merge nguyên văn. Verdict: PENDING-JUDGMENT — T3 buộc người ký phán
  hai mục judgment ở Cổng 2.
- Vòng 3 (2026-08-12, commit 535f400): Sau vòng 2, một phản biện context sạch
  (`gap-probe.md`) bắt 4 lỗ P0, trong đó P0-1 cho thấy oracle của E1–E4 bị ĐẢO
  NGƯỢC — chuỗi ghim chỉ tồn tại trong nhánh báo hỏng của rang.sh. Owner ra
  lệnh vá cả bốn; hai commit vá a3a68a8 (P0-1,2,3) và 535f400 (P0-4) nâng hợp
  đồng lên 14 AC và bộ eval lên 16. Vòng này chấm lại toàn bộ trên cây sau vá:
  mười bốn eval máy xanh, mọi chuỗi ghim nay đọc được trực tiếp trong stdout
  của đúng cmd đã khai (không còn trỏ chéo + ghi chú tay như vòng 2), suite
  tests/scripts từ 677 lên 685 với +8 ca giải thích được từng cái. E11, E12
  giữ nguyên verdict judge vòng 2, merge nguyên văn, KHÔNG chấm lại — kèm lưu
  ý phạm vi ghi thẳng vào E12 vì phần vật nó chấm đã lớn từ 21 lên 42 dòng
  thêm sau khi verdict được đưa ra. Bốn P1 + bốn P2 của gap-probe vẫn open,
  nêu đích danh trong ## Analyst. Verdict: PENDING-JUDGMENT — trần máy của T3.
- Vòng 4 (2026-08-12, commit a938623): Sau vòng 3, hai judge chấm LẠI trên cây
  mới và CẢ HAI FAIL — đúng cái lưu ý phạm vi mà vòng 3 ghi vào E12 đã thành
  hiện thực. E12 tìm ra bản vá FAIL-CLOSED trên monorepo (`git diff --name-only`
  trả path tương đối với gốc cây git, không phải với `$ROOT`, nên
  `pre-merge-check.sh pkg --base ref` chặn cả PR mang hồ sơ THẬT); E11 đòi bump
  minor thay vì patch vì bản vá THÊM luật gate mới. Commit a938623 vá cả hai và
  thêm AC-15/AC-16 + E17/E18 — hợp đồng nay 16 AC, bộ eval 18. Vòng này chấm
  lại toàn bộ: mười sáu eval máy xanh, mã thoát 0, mọi chuỗi ghim đọc từ stdout
  thật; suite tests/scripts từ 685 lên 689 (+4 = TE27a/a2/b/b2). E11 và E12
  KHÔNG merge verdict cũ mà để UNCERTAIN, vì verdict judgment đã chứng minh
  không sống sót qua một thay đổi phạm vi; judge mới đang chạy song song trên
  cây a938623. Bốn P1 + ba P2 của gap-probe vẫn open. Verdict:
  PENDING-JUDGMENT — trần máy của T3.
