---
schema_version: 2
feature_slug: t1-escape-slug-only
verdict: PENDING-JUDGMENT
failed_evals: []
reason: "Vòng 3 chạy lại toàn bộ trên cây sau hai commit vá a3a68a8 + 535f400. Mười bốn eval máy E1–E10, E13–E16 xanh hết, mã thoát 0, mọi chuỗi ghim đọc được trực tiếp trong stdout thật (rang.sh nay TỰ IN 12 dòng `CO-MAT PASS:` + dòng đếm `CO-MAT tong: 12/12`, nên oracle-bị-đảo của P0-1 đã đóng). Hai mục judgment E11, E12 giữ nguyên verdict PASS của judge-subagent vòng 2, merge nguyên văn, KHÔNG chấm lại. Hợp đồng là T3 (scripts/pre-merge-check.sh nằm trong t3_paths của chính kit), nên theo luật T3 mọi mục judgment vẫn cần NGƯỜI phán trực tiếp ở Cổng 2 — verdict máy cao nhất có thể đạt là PENDING-JUDGMENT, không phải PASS."
verified_by: fresh-context verification subagent (round 3)
enforcement_mode: strict
bypass_used: false
verified_commit: 535f400df162f01a494f2657473e3ce138f9e476
human_signoff:
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

## Evidence

- eval: E1
  run_id: t1-escape-slug-only-E1-20260812102458
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T10:24:58Z
  output: |
    CO-MAT PASS: TE21a
    CO-MAT PASS: TE21b
    CO-MAT tong: 12/12 ca phan chung da chay that
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (Khác vòng 2 ở chỗ then chốt: hai chuỗi ghim nay đọc được TRỰC TIẾP trong
    stdout của đúng cmd đã khai, không phải trỏ chéo sang stdout của E5 kèm ghi
    chú tay. rang.sh in một dòng CO-MAT cho mỗi ca tìm thấy, và nhánh báo hỏng
    dùng chữ khác ("khong thay '…' — case khong chay"), nên chuỗi ghim không
    còn tồn tại trong nhánh đỏ.)

- eval: E2
  run_id: t1-escape-slug-only-E2-20260812102458
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T10:24:58Z
  output: |
    CO-MAT PASS: TE21c
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (TE21c là assert dương "thông điệp liệt đúng src/app.js". Lớp đột biến của
    rang.sh còn tự dựng fixture riêng và grep "src/app.js" trên stdout bản vá,
    cùng cổng ERR.)

- eval: E3
  run_id: t1-escape-slug-only-E3-20260812102458
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T10:24:58Z
  output: |
    CO-MAT PASS: TE22a
    CO-MAT PASS: TE22b
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)

- eval: E4
  run_id: t1-escape-slug-only-E4-20260812102458
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T10:24:58Z
  output: |
    CO-MAT PASS: TE23a
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (Chiều phải-KHÔNG-nổ: có `_acceptance/<slug>/` thật thì miễn trừ còn
    nguyên. Đọc kèm cảnh báo P1 #2 của gap-probe: TE23a vẫn là assert ÂM thuần
    (`nothas`), chưa có assert dương chống XANH-RỖNG — lỗ đó CHƯA vá, xem
    ## Analyst.)

- eval: E5
  run_id: t1-escape-slug-only-E5-20260812102639
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-12T10:26:39Z
  output: |
    TE15 diff CHI file T1 thuan -> khong no (true-negative)
      PASS: TE15
      PASS: TE15b
    Results: 685 passed, 0 failed

- eval: E6
  run_id: t1-escape-slug-only-E6-20260812102458
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T10:24:58Z
  output: |
    DOT-BIEN OK: ban cu lot (lo tai xuat hien), ban va chan
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (Lớp mạnh nhất của hồ sơ: rang.sh dựng lại dòng `case` cũ trên một bản sao
    của chính scripts/pre-merge-check.sh, chạy cùng một fixture — bản cũ LỌT,
    bản vá CHẶN. Hai bản xử lý giống nhau thì script tự báo "phep do KHONG phan
    biet duoc cu voi moi". Khối python neo vào khối `case` DUY NHẤT có
    `gate_touched=1`; vật đã đổi hình ở a3a68a8 mà neo vẫn khớp đúng một khối,
    nên đột biến vẫn đánh trúng chỗ.)

- eval: E7
  run_id: t1-escape-slug-only-E7-20260812102639
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-12T10:26:39Z
  output: |
    Results: 685 passed, 0 failed
    (Vòng 2 cùng suite này cho 677 passed / 0 failed. Chênh đúng +8 và giải
    thích được từng ca: TE24a/b/c, TE25a/b/c (a3a68a8) và TE26a/b (535f400).
    Không phép đo nào mất. Base b9bfe46 cho 671.)

- eval: E8
  run_id: t1-escape-slug-only-E8-20260812102819
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-12T10:28:19Z
  output: |
    Results: all plugin tests passed
    (Bốn ca từng đỏ ở vòng 1 vẫn xanh sau hai commit vá, đọc đích danh trong
    stdout: P42, P45, P122, P126. Đếm máy trên toàn stdout: 0 dòng bắt đầu
    bằng "FAIL". Lưu ý đọc: suite này có một dòng hợp lệ mang chữ FAIL trong
    thân — output KỲ VỌNG của một ca đột biến, không phải ca đỏ.)

- eval: E9
  run_id: t1-escape-slug-only-E9-20260812102639
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-12T10:26:39Z
  output: |
    PASS: DV5 scripts/pre-merge-check.sh: diff so với base b9bfe46 CHỈ THÊM (0 dòng luật cũ bị xoá/sửa)
    PASS: DV5 scripts/recheck-evidence.cjs: diff so với base b9bfe46 CHỈ THÊM (0 dòng luật cũ bị xoá/sửa)
    PASS: DV5m mutant: bản sao sửa 1 dòng VIOLATION cũ → phép đo phải ĐỎ đích danh
    Results: 685 passed, 0 failed
    (Ba dòng luật cũ bị thay đều đã khai trong ALLOWED_REMOVALS của
    tests/scripts/additive-only.test.mjs kèm lý do — cửa thoát có khai báo,
    không nới luật.)

- eval: E10
  run_id: t1-escape-slug-only-E10-20260812103742
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-12T10:37:42Z
  output: |
    plugins/ mirror in sync.
    (rang.sh cũng so shasum hai bản một cách độc lập và không kêu lệch, nên
    plugins/acceptance-gate/scripts/pre-merge-check.sh khớp byte-đối-byte với
    scripts/pre-merge-check.sh sau CẢ hai commit vá.)

- eval: E11
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Lệ thành văn của kit (GUIDE.md §10, "Bump version khi ship (minor cho luật gate mới)") dành minor cho LUẬT GATE MỚI; bản vá này không thêm luật, nó sửa phạm vi miễn trừ của một luật đã có — đúng ô patch. Tiền lệ trên main xác nhận: c1638e2 (1.20.1), 2ef1285 (1.22.1), 5479ad0 (1.39.2) đều là patch cho lớp "CI xanh có thể chuyển đỏ". 1.40.1 khác 1.40.0 ở cả 4 manifest và sàn version trong kit luôn so semver 3 số, không ghim ==.
  required_evidence:
    - (judge PASS — ghi chú cho người ký: main chưa có CHANGELOG.md, kênh báo hiệu ngoài con số chỉ còn commit message release)
  human_override:

- eval: E12
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Diff trên scripts/pre-merge-check.sh đúng 2 hunk (21 thêm / 3 xoá), chỉ một hunk là chức năng: dòng case đơn trong khối T1-escape thay bằng 4 dòng case hai nhánh; phần còn lại là comment. Các nhánh T1_ESCAPE/DIFF_READY/ledger_mark, thông điệp violation, stale_files(), pr_touches_slug(), và mọi khối gap-probe/per-slug/T3/re-pin/bypass/enforcement_mode byte-identical với main. Không siết quá tay: file nằm ngay trong _acceptance/ vẫn continue nên không bao giờ vào nont1_hits/t3_hits. Mirror plugin cùng blob. Lưu ý phạm vi: verdict chấm trên cây vòng 2; hai commit vá sau đó (a3a68a8, 535f400) chưa qua judge này — người ký cần soi lại phạm vi ở Cổng 2.
  required_evidence:
    - n/a
  human_override:

- eval: E13
  run_id: t1-escape-slug-only-E13-20260812102458
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T10:24:58Z
  output: |
    CO-MAT PASS: TE24a
    CO-MAT PASS: TE24b
    CO-MAT PASS: TE24c
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (P0-2 của gap-probe: `mkdir _acceptance/tmpjunk && touch note.txt` từng đủ
    miễn trừ một PR sửa src/app.js. Nay thư mục con phải có contract.md thì
    mới tính là hồ sơ; ba assert gồm cả mã thoát 1 và liệt đích danh
    src/app.js, nên không phải xanh-rỗng.)

- eval: E14
  run_id: t1-escape-slug-only-E14-20260812102458
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T10:24:58Z
  output: |
    CO-MAT PASS: TE25a
    CO-MAT PASS: TE25b
    CO-MAT PASS: TE25c
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (P0-3 của gap-probe: nới `t1_skip_globs` thành `- "**"` cùng lúc sửa mã
    từng không sinh violation nào. Nay `_acceptance/config.yaml` TỰ NÓ vào
    nont1_hits, và TE25c ghim rằng thông điệp liệt đích danh chính nó.)

- eval: E15
  run_id: t1-escape-slug-only-E15-20260812102458
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T10:24:58Z
  output: |
    CO-MAT tong: 12/12 ca phan chung da chay that
    RANG OK (12 dong case + DV5 + dot bien + mirror + 4 manifest)
    (Đây là eval canh CHÍNH THƯỚC ĐO — P0-1. Dòng đếm do rang.sh in ra từ biến
    $CO tăng mỗi lần TÌM THẤY một ca, và `[ "$CO" -eq 12 ]` bật ERR nếu thiếu.
    Xoá TE21–TE25 khỏi suite thì dòng này thành "0/12" và E15 đỏ đích danh,
    thay vì cả nhóm E1–E4 im lặng xanh như hình dạng cũ.)

- eval: E16
  run_id: t1-escape-slug-only-E16-20260812102639
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-12T10:26:39Z
  output: |
    TE26 rang.sh cua ho so t1-escape-slug-only phai khop hash ghim
      PASS: TE26a
      PASS: TE26b
    Results: 685 passed, 0 failed
    (P0-4: sức phân biệt của hồ sơ nằm trong rang.sh — file do chính người vá
    viết, đặt dưới `_acceptance/<slug>/` nên tự được răng T1-escape miễn trừ.
    Ghim sha256 đặt ở tests/scripts/run-tests.sh, NGOÀI slug: sửa rang.sh mà
    không sửa ghim thì suite đỏ; sửa cả hai thì chạm một file non-T1 của kit,
    tức chính nó đòi hồ sơ nghiệm thu. Đã đối chiếu tay:
    `shasum -a 256 _acceptance/t1-escape-slug-only/rang.sh` cho
    22300442f472ef522c1b5fffab15d45322c4230a988dd5f58ae87b3070ab25cd, khớp
    hằng TE26_PIN. TE26b canh chiều "ghim thật sự đọc file" bằng cách assert
    độ dài 64.)

## Analyst

Vòng 3 chạy lại toàn bộ trên cây hiện tại (HEAD 535f400, nhánh
`fix/t1-escape-slug-only`). Bốn lệnh executor, mỗi lệnh chạy ĐÚNG MỘT lần,
stdout tái dùng cho các eval ghim dòng khác nhau: rang.sh → E1,E2,E3,E4,E6,
E13,E14,E15; tests/scripts → E5,E7,E9,E16; tests/plugins → E8; mirror_sync →
E10. Cả mười bốn eval máy xanh, mã thoát 0. `bypass_used: false` đọc từ
`printf '%s' "$ACCEPTANCE_GATE_BYPASS"` (rỗng); `verified_commit` từ
`git rev-parse HEAD`.

**Đọc baseline cho đúng — quan trọng nhất trong báo cáo này.** E1, E2, E3, E4,
E6, E13, E14, E15 ghi `baseline: red` vì rang.sh in dòng
"DOT-BIEN OK: ban cu lot (lo tai xuat hien), ban va chan": nó dựng lại dòng
`case` cũ trên một bản sao của chính `scripts/pre-merge-check.sh` và chứng minh
cây cũ LỌT còn cây mới CHẶN, tức lớp đo phân biệt được hai cây. Ngược lại E5,
E7, E8, E9, E10, E16 ghi `baseline: green`, và đó là kỳ vọng ĐÚNG chứ không
phải điểm yếu: chúng là guard hồi quy, việc của chúng là chứng minh bản vá
không làm hỏng thứ khác. **Cảnh báo cho người ký: KHÔNG được đọc màu xanh của
nhóm sau như bằng chứng cho AC-1..AC-4 hay AC-11..AC-13.** Xoá sạch
TE21/TE22/TE23/TE24/TE25 khỏi suite thì E5, E7, E9 vẫn xanh y nguyên (chỉ đổi
con số tổng), và E8, E10 không liên quan. Sức phân biệt của hồ sơ nằm ở
E1–E4, E6, E13–E15. E16 tuy `baseline: green` nhưng có vai trò riêng: nó là
thứ duy nhất canh tính toàn vẹn của chính rang.sh.

Ba lỗ P0 mà phản biện context sạch bắt được, đo lại trên cây này thì đã đóng,
và đóng theo đúng cách gap-probe chỉ ra chứ không phải bằng cách sửa câu chữ:

- **P0-1 (oracle bị đảo)** — vòng 2, sáu chuỗi `PASS: TE2x` chỉ xuất hiện
  trong stdout của rang.sh ở nhánh BÁO HỎNG, nên grep thấy chuỗi tức là hồ sơ
  đang hỏng. Vòng này rang.sh in một dòng `CO-MAT PASS: …` cho mỗi ca TÌM
  THẤY, nhánh hỏng đổi sang chữ khác, và có thêm dòng đếm `CO-MAT tong: 12/12`
  do E15 canh riêng. Bằng chứng cụ thể của việc đã đóng: khối `output` của
  E1–E4 lần này chứa chính chuỗi ghim, đọc từ stdout của đúng cmd đã khai —
  vòng 2 phải trỏ chéo sang stdout của E5 kèm ghi chú tay.
- **P0-2 (thư mục rác)** — nay `gate_touched=1` chỉ bật khi thư mục con có
  `contract.md`; TE24 canh, E13 ghim.
- **P0-3 (config cầm luật)** — `_acceptance/config.yaml` nay TỰ NÓ là thay đổi
  cần cổng; TE25 canh, E14 ghim.
- **P0-4 (rang.sh tự miễn trừ)** — ghim sha256 đặt ngoài slug; TE26 canh, E16
  ghim.

**Điều người ký phải tự soi ở Cổng 2, verification agent không chấm hộ.** E11
và E12 là hai mục judgment, verdict PASS trong báo cáo này là của
judge-subagent chạy ngữ cảnh sạch ở VÒNG 2, merge nguyên văn, agent này không
chấm lại. Với E12 điều đó có hệ quả cụ thể và đo được: judge vòng 2 mô tả diff
là "đúng 2 hunk (21 thêm / 3 xoá)", nhưng `git diff --stat main...HEAD --
scripts/pre-merge-check.sh` trên cây hôm nay cho **42 thêm / 3 xoá**, vì
a3a68a8 thêm 31 dòng nữa vào đúng file đó (khối `case` ba hạng + comment).
Nói cách khác, phần vật mà E12 khẳng định "không đụng luật nào khác" đã lớn
lên gấp đôi SAU khi lời khẳng định đó được đưa ra. Đây là lý do câu lưu ý phạm
vi được ghi thẳng vào rationale của E12. E11 cũng còn một ghi chú judge đáng
đọc trước khi quyết: main chưa có CHANGELOG.md, nên ngoài con số version, kênh
báo hiệu duy nhất còn lại cho repo tiêu thụ là commit message của bản release.

**Residual đã biết, chưa vá, người ký đang chấp nhận nếu ký.** gap-probe.md
liệt 4 P1 + 4 P2 và tất cả vẫn `open`; hai cái đáng nêu tên vì chúng chạm
thẳng vào độ tin của chính báo cáo này:

- P1 #2 — TE23 (chiều chống-siết-quá-tay, thứ duy nhất chặn một bản vá biến
  MỌI PR có gate thành đỏ vĩnh viễn trên MỌI repo tiêu thụ) vẫn là một assert
  ÂM thuần `nothas`, không kiểm mã thoát, không có assert dương. `nothas` PASS
  trên chuỗi rỗng, nên nếu pre-merge-check.sh chết sớm thì TE23a vẫn xanh và
  E4 vẫn xanh theo. So sánh trực tiếp: TE24/TE25 vừa thêm ở vòng này đều có
  assert mã thoát + assert dương, còn TE23 thì không.
- P1 #4 — đường dẫn non-ASCII bị `git diff --name-only` đóng ngoặc kép và
  escape bát phân, làm hỏng cả hai nhánh `case`, cho FALSE RED. Kit này viết
  tiếng Việt xuyên suốt và không ca thử nào dùng tên non-ASCII.

Thêm một quan sát của vòng này, không nằm trong gap-probe: TE26 bọc trong
`if [ -f "$TE26_F" ]` và in `NOTE: TE26 bo qua` khi rang.sh không còn. Nhánh
NOTE đó không in `PASS: TE26a`, nên E16 sẽ đỏ đúng lúc — hành vi này đúng, chỉ
cần người ký biết là ghim hết hiệu lực khi hồ sơ được dọn đi.

Verdict cuối là PENDING-JUDGMENT chứ không phải PASS, và đây là luật chứ không
phải dè dặt tuỳ ý: hợp đồng khai `risk_tier: T3` vì `scripts/pre-merge-check.sh`
nằm trong `t3_paths` của chính kit với lý do "lỗi ở đây biến thành false-green
im lặng trên MỌI repo tiêu thụ". Theo luật T3, mọi mục judgment cần người phán
trực tiếp ở Cổng 2, nên kể cả khi mười bốn eval máy xanh hết VÀ hai judge đều
PASS, mức máy cao nhất vẫn dừng ở PENDING-JUDGMENT. `human_override` của E11
và E12 để trống có chủ đích — chỗ đó là của người ký, không phải của máy.

## Variance

none — mọi eval tất định, không mạng, không phụ thuộc thời gian, fixture git
dựng tại chỗ trong thư mục mktemp riêng. Suite tests/scripts cho 685 passed /
0 failed ở vòng 3 so với 677 ở vòng 2; chênh +8 giải thích được từng ca
(TE24a/b/c, TE25a/b/c từ a3a68a8; TE26a/b từ 535f400), không ca nào biến mất.
E8 đã chạy tổng cộng bốn lần độc lập qua ba vòng (hai lần đỏ ở vòng 1, xanh ở
vòng 2 và vòng 3).

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
