---
schema_version: 2
feature_slug: t1-escape-slug-only
verdict: PENDING-JUDGMENT
failed_evals: []
reason: "Mười eval máy E1–E10 xanh hết ở vòng 2 (E8 — hồi quy PRODUCT-MAP.md của vòng 1 — đã hết đỏ sau commit 5fb5280). Hai mục judgment E11, E12 đã được judge-subagent (fresh context) chấm PASS. Hợp đồng này là T3 (scripts/pre-merge-check.sh nằm trong t3_paths của chính kit), nên theo luật T3 mọi mục judgment vẫn cần NGƯỜI phán trực tiếp ở Cổng 2 — verdict máy cao nhất có thể đạt là PENDING-JUDGMENT, không phải PASS."
verified_by: fresh-context verification subagent (round 2)
enforcement_mode: strict
bypass_used: false
verified_commit: 5fb528056cf67eafcb9d04e18b1ea391b56ebd28
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

## Evidence

- eval: E1
  run_id: t1-escape-slug-only-E1-20260812092345
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T09:23:45Z
  output: |
    DOT-BIEN OK: ban cu lot (lo tai xuat hien), ban va chan
    RANG OK (6 dong case + DV5 + dot bien + mirror + 4 manifest)
    (rang.sh chỉ in dòng tổng kết: nó nuốt stdout của suite vào biến rồi grep.
    Dòng "RANG OK" CHỈ in khi ERR=0, tức cả sáu dòng case TE21a/b/c, TE22a/b,
    TE23a và dòng DV5 đều đã tìm thấy — thiếu một dòng là hàm keu() bật ERR.
    Hai dòng ghim của E1 đọc trực tiếp được ở khối E5 bên dưới:
    "PASS: TE21a" và "PASS: TE21b", dòng 901–902 của stdout suite.)

- eval: E2
  run_id: t1-escape-slug-only-E2-20260812092345
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T09:23:45Z
  output: |
    DOT-BIEN OK: ban cu lot (lo tai xuat hien), ban va chan
    RANG OK (6 dong case + DV5 + dot bien + mirror + 4 manifest)
    (Ngoài dòng ghim "PASS: TE21c" — đọc được ở khối E5, dòng 903 — rang.sh
    còn tự dựng fixture riêng rồi khẳng định bản vá vừa in VIOLATION [PR] vừa
    liệt đúng src/app.js; hai phép grep này nằm ở lớp đột biến, cùng cổng ERR
    với dòng trên.)

- eval: E3
  run_id: t1-escape-slug-only-E3-20260812092345
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T09:23:45Z
  output: |
    DOT-BIEN OK: ban cu lot (lo tai xuat hien), ban va chan
    RANG OK (6 dong case + DV5 + dot bien + mirror + 4 manifest)
    (Hai dòng "PASS: TE22a" và "PASS: TE22b" nằm trong bộ sáu dòng bắt buộc
    của rang.sh; nguyên văn ở khối E5, dòng 905–906.)

- eval: E4
  run_id: t1-escape-slug-only-E4-20260812092345
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T09:23:45Z
  output: |
    DOT-BIEN OK: ban cu lot (lo tai xuat hien), ban va chan
    RANG OK (6 dong case + DV5 + dot bien + mirror + 4 manifest)
    (Chiều phải-KHÔNG-nổ: "PASS: TE23a" — có _acceptance/<slug>/ thật thì
    miễn trừ còn nguyên. Nguyên văn ở khối E5, dòng 908.)

- eval: E5
  run_id: t1-escape-slug-only-E5-20260812093457
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-12T09:34:57Z
  output: |
    TE15 diff CHI file T1 thuan -> khong no (true-negative)
      PASS: TE15
      PASS: TE15b
    TE21 sua _acceptance/config.yaml KHONG duoc mien tru rang T1-escape
      PASS: TE21a
      PASS: TE21b
      PASS: TE21c
    TE22 README.md cua _acceptance cung khong mien tru
      PASS: TE22a
      PASS: TE22b
    TE23 co _acceptance/<slug>/ that -> VAN mien tru (chong va qua tay)
      PASS: TE23a
    Results: 677 passed, 0 failed

- eval: E6
  run_id: t1-escape-slug-only-E6-20260812092345
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t1_escape_rang
  verified_at: 2026-08-12T09:23:45Z
  output: |
    DOT-BIEN OK: ban cu lot (lo tai xuat hien), ban va chan
    RANG OK (6 dong case + DV5 + dot bien + mirror + 4 manifest)
    (Đây là lớp mạnh nhất của hồ sơ: rang.sh dựng lại dòng `case` cũ trên một
    bản sao của chính scripts/pre-merge-check.sh, chạy cùng một fixture — bản
    cũ LỌT, bản vá CHẶN. Hai bản xử lý giống nhau thì script tự báo "phep do
    KHONG phan biet duoc cu voi moi"; dòng DOT-BIEN OK là bằng chứng phép đo
    không mù.)

- eval: E7
  run_id: t1-escape-slug-only-E7-20260812093457
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-12T09:34:57Z
  output: |
    Results: 677 passed, 0 failed
    (Vòng 1 cùng suite này trên nhánh cũng cho 677/0; trên diffBase b9bfe46
    cho 671 passed, 0 failed. Nhánh thêm 6 phép đo mới, không mất phép đo nào.
    Số 677 giữ nguyên giữa hai vòng: commit 5fb5280 chỉ vẽ lại PRODUCT-MAP.md,
    không thêm/bớt ca nào của suite này.)

- eval: E8
  run_id: t1-escape-slug-only-E8-20260812092532
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-12T09:25:32Z
  output: |
    Results: all plugin tests passed
    (Bốn ca đỏ của vòng 1 nay xanh, đọc đích danh trong stdout:
      PASS: P42 manifest lech bi bat DUNG boi assertion cua P03
      PASS: P45 bump ba manifest khong cham suite
      PASS: P122 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)
      PASS: P126 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)
    Đếm máy trên toàn stdout: 0 dòng bắt đầu bằng "FAIL". Lưu ý đọc: suite này
    có một dòng hợp lệ mang chữ FAIL trong thân — output KỲ VỌNG của một ca
    đột biến, không phải ca đỏ.)

- eval: E9
  run_id: t1-escape-slug-only-E9-20260812093457
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-12T09:34:57Z
  output: |
    PASS: DV5 scripts/pre-merge-check.sh: diff so với base b9bfe46 CHỈ THÊM (0 dòng luật cũ bị xoá/sửa)
    PASS: DV5 scripts/recheck-evidence.cjs: diff so với base b9bfe46 CHỈ THÊM (0 dòng luật cũ bị xoá/sửa)
    PASS: DV5m mutant: bản sao sửa 1 dòng VIOLATION cũ → phép đo phải ĐỎ đích danh
    Results: 677 passed, 0 failed

- eval: E10
  run_id: t1-escape-slug-only-E10-20260812092524
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-12T09:25:24Z
  output: |
    plugins/ mirror in sync.
    (rang.sh cũng so shasum hai bản một cách độc lập và không kêu lệch, nên
    plugins/acceptance-gate/scripts/pre-merge-check.sh khớp byte-đối-byte với
    scripts/pre-merge-check.sh.)

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
  rationale: Diff trên scripts/pre-merge-check.sh đúng 2 hunk (21 thêm / 3 xoá), chỉ một hunk là chức năng: dòng case đơn trong khối T1-escape thay bằng 4 dòng case hai nhánh; phần còn lại là comment. Các nhánh T1_ESCAPE/DIFF_READY/ledger_mark, thông điệp violation, stale_files(), pr_touches_slug(), và mọi khối gap-probe/per-slug/T3/re-pin/bypass/enforcement_mode byte-identical với main. Không siết quá tay: file nằm ngay trong _acceptance/ vẫn continue nên không bao giờ vào nont1_hits/t3_hits. Mirror plugin cùng blob.
  required_evidence:
    - n/a
  human_override:

## Analyst

Vòng 2 chạy lại toàn bộ trên cây hiện tại (HEAD 5fb5280). Bốn lệnh executor,
mỗi lệnh chạy MỘT lần, stdout tái dùng cho các eval ghim dòng khác nhau:
rang.sh → E1,E2,E3,E4,E6; tests/scripts → E5,E7,E9; tests/plugins → E8;
mirror_sync → E10. Toàn bộ mười eval máy xanh, mã thoát 0.

Quy ước baseline giữ nguyên như vòng 1 và cần đọc đúng. E1, E2, E3, E4, E6
ghi `baseline: red` vì rang.sh in dòng "DOT-BIEN OK: ban cu lot (lo tai xuat
hien), ban va chan" — nó dựng lại dòng `case` cũ trên một bản sao của chính
scripts/pre-merge-check.sh và chứng minh cây cũ LỌT còn cây mới CHẶN, tức phép
đo phân biệt được hai cây. Ngược lại E5, E7, E8, E9, E10 ghi `baseline: green`
và đó là kỳ vọng ĐÚNG: chúng là guard hồi quy, việc của chúng là chứng minh
bản vá không làm hỏng thứ khác, không phải chứng minh tính năng mới tồn tại.
Không được đọc màu xanh của nhóm sau như bằng chứng cho AC-1..AC-4: xoá sạch
TE21/TE22/TE23 khỏi suite thì cả nhóm vẫn xanh y nguyên. Sức phân biệt của hồ
sơ nằm ở E1..E4 và E6.

E8 — lý do trả hồ sơ ở vòng 1 — nay xanh. Bốn ca P42, P45, P122, P126 đọc
được đích danh là PASS trong stdout, và toàn bộ stdout không còn dòng nào bắt
đầu bằng "FAIL" (đếm máy: 0). Điều này khớp đúng chẩn đoán vòng 1: gốc chung
là PRODUCT-MAP.md chưa vẽ lại sau khi nhánh thêm thư mục hồ sơ
`_acceptance/t1-escape-slug-only/`, và commit 5fb5280 chạy
`node scripts/product-map.mjs --root .` là đủ gỡ cả bốn. Bản vá T1-escape
không phải sửa một dòng nào — E5, E7, E9 vẫn cho đúng 677 passed / 0 failed
như vòng 1, tức việc gỡ không đánh đổi phép đo nào.

Hai mục judgment E11 và E12 đã có verdict PASS của judge-subagent chạy trong
ngữ cảnh sạch, merge nguyên văn ở trên; verification agent này KHÔNG chấm lại
chúng. Có một ghi chú judge để lại cho người ký ở E11 đáng đọc trước khi
quyết: main chưa có CHANGELOG.md, nên ngoài con số version, kênh báo hiệu duy
nhất còn lại cho repo tiêu thụ là commit message của bản release.

Verdict cuối là PENDING-JUDGMENT chứ không phải PASS, và đây không phải dè
dặt tuỳ ý mà là luật: hợp đồng khai `risk_tier: T3` vì
`scripts/pre-merge-check.sh` nằm trong `t3_paths` của chính kit với lý do
"lỗi ở đây biến thành false-green im lặng trên MỌI repo tiêu thụ". Theo luật
T3, mọi mục judgment cần người phán trực tiếp ở Cổng 2, nên kể cả khi mười
eval máy xanh hết VÀ hai judge đều PASS, mức máy cao nhất vẫn dừng ở
PENDING-JUDGMENT. `human_override` của E11 và E12 để trống có chủ đích — chỗ
đó là của người ký, không phải của máy.

## Variance

none — mọi eval tất định. E8 đã chạy tổng cộng ba lần độc lập qua hai vòng
(hai lần ở vòng 1 cho cùng bốn ca đỏ, một lần ở vòng 2 cho all-passed sau khi
PRODUCT-MAP.md được vẽ lại); các eval còn lại không có nguồn ngẫu nhiên
(không mạng, không phụ thuộc thời gian, fixture git dựng tại chỗ). Suite
tests/scripts cho cùng con số 677 passed / 0 failed ở cả hai vòng.

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
