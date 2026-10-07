# Review findings: luot-sua-giu-du-dem-dung (round 1)

## Trong hợp đồng

- **Thước-vật hỏng hẳn đúng ở ca nó được sửa để xử lý (gộp nhánh nền vào nhánh vòng): git diff không nhận rev âm thêm vào**
  file: feature-loop/scripts/thuoc-vat.mjs:156
  severity: high
  AC: AC-6
  source: conventions
  detail: Khi chaNen trả về một cha nền, demThuocVat chạy `git diff --numstat --no-renames <san>..HEAD ^<nen>`. git diff không nhận rev âm thêm vào: trên git 2.37.1 (máy này, và cũng là phiên bản CHANGELOG nêu tên) lệnh in usage rồi thoát lỗi, gitLines ném ra, và thuoc-vat thoát 2 «lệnh git thất bại: usage: git diff». Đã tái hiện độc lập: dựng kho tạm, gộp main vào nhánh vòng, chạy `git diff --numstat SAN..HEAD ^NEN` thì ra usage. Ca vĩnh viễn của chính vòng này đỏ trên HEAD: `node tests/scripts/luot-sua-giu-du.test.mjs` cho 5 qua, 3 trượt (AC-6, AC-7, AC-8 đều thoát 2); `tests/scripts/thuoc-vat-merge-detailed.test.mjs` cũng trượt vì cùng lỗi, nên suite `scripts` (run-tests.sh nhặt mọi *.test.mjs qua glob) đỏ. Hậu quả với kho tiêu thụ: crm đúng là kho gộp nền, SKILL nói thuoc-vat lỗi thì chỉ «WARN một dòng, không chặn vòng», nên dòng vật · thước · nhát lặng lẽ biến mất khỏi thẻ Cổng Bằng chứng ở đúng kho đẻ ra luật này, trong khi CHANGELOG khai «+1780 → +38» như đã chữa. Ổn với cả hai cách gọi: `--giua-hai-luot` chỉ dùng `git diff --name-only A..B` rồi lọc, còn git log thì nhận `^p`. Hướng sửa: bỏ `...truNen` khỏi lời gọi git diff, vì kết quả đã được lọc qua cuaVong và tệp chung đã lấy số từ congTungCommit.

- **thuoc-vat crashes when the branch has merged from base: `git diff <san>..HEAD ^<nen>` is rejected by git with a usage error**
  file: feature-loop/scripts/thuoc-vat.mjs:194
  severity: high
  AC: AC-6
  source: bugs
  detail: When `chaNen` finds a merge from base, `demThuocVat` runs `git diff --numstat --no-renames <san>..HEAD ^<nen>` (from `...truNen`). `git diff` does not accept an A..B range plus an extra `^C` rev. On this machine's git (2.37.1) it prints the usage text and exits non-zero. Reproduced in a scratch repo built like this: contract marked `status: implemented` on `feat`, a commit on `main`, then `git merge main` into `feat`, then one more commit on `feat`. `demThuocVat` throws `usage: git diff ...`, and `node thuoc-vat.mjs --root . --slug demo --json` exits 2 with «thuoc-vat: lệnh git thất bại: usage: git diff ...». This is exactly the merge-from-base case the round was meant to fix (AC-6..AC-8). Instead of counting correctly, the counter dies. It also blocks S4 entirely: s4-args.mjs runs `demThuocVat` inside a try whose catch calls `die('bộ đếm nhát sửa thước lỗi: ...')`, so any branch that merged base after the floor commit can no longer start an S4 round. The thuoc-vat `--json`/`--write` path that feeds the Gate 2 card fails the same way. The workspace's own tests confirm it: `node tests/scripts/luot-sua-giu-du.test.mjs` gives «5 passed, 3 failed», with AC-6, AC-7 and AC-8 FAIL («thuoc-vat exit 2») and the git usage text on stderr. The `--giua-hai-luot` path (AC-9) is unaffected: it diffs `shaA..shaB` with no `^nen` and filters by `tepCuaVong` afterwards. Fix direction: drop `^nen` from the `git diff` call and rely on the existing `cuaVong` filter plus `congTungCommit` for shared files. Or derive the numstat from `git log --no-merges --numstat <san>..HEAD ^nen` instead of `git diff`.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Ba tệp test ngoài hợp đồng xanh mà chưa từng chạy vào nhánh merge: hợp đồng đặt ở gốc kho, nên luôn ra «chưa có mốc sàn»**
  Người dùng thấy gì: Một số bài kiểm tra phụ báo «đạt» nhưng thực ra chưa hề thử đúng tình huống gộp nhánh, nên chúng không cảnh báo được khi tính năng đếm bị hỏng. Bài kiểm tra chính của vòng vẫn bắt được lỗi, nên rủi ro là một tín hiệu xanh gây hiểu lầm chứ không làm mất độ tin cậy của bằng chứng.
  file: `tests/scripts/luot-sua-giu-du-dem-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Khối chú thích «nền» trong đầu tệp thuoc-vat.mjs bị chép đôi**
  Người dùng thấy gì: Có vài dòng ghi chú trong mã bị lặp hoặc đặt xa chỗ nó mô tả. Người dùng không thấy khác biệt nào, chỉ làm người bảo trì đọc hơi rối.
  file: `feature-loop/scripts/thuoc-vat.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 (assertion không sống): thuoc-vat-merge-detailed in FAIL nhưng luôn thoát 0, nên che một lỗi crash có thật của vật**
  Người dùng thấy gì: Một bài kiểm tra phụ in ra chữ «lỗi» nhưng hệ thống vẫn coi là đạt, nên bộ kiểm tra tổng có thể hiện xanh dù tính năng đếm đang hỏng. Lỗi thật vẫn lộ ra ở bài kiểm tra chính, chỉ là tín hiệu xanh của bộ tổng không đáng tin ở phần này.
  file: `tests/scripts/thuoc-vat-merge-detailed.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình, không đối chứng dương): ca merge của thuoc-vat không bao giờ có mốc sàn, nên ngưỡng `<=10` xanh ở mọi bản**
  Người dùng thấy gì: Một bài kiểm tra phụ về trường hợp gộp nhánh luôn đạt dù tính năng làm đúng hay sai, vì nó chưa từng đặt đúng điều kiện thử. Nó không cho thêm bảo đảm nào so với bài kiểm tra chính, nhưng dễ khiến người đọc tưởng trường hợp này đã được canh hai lớp.
  file: `tests/scripts/thuoc-vat-merge-base.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 1 (đo đầu vào thay vì đầu ra của vật) kèm hình dạng 2 và 3: ca «AC-4» không gọi s4-args mà grep chính fixture viết tay**
  Người dùng thấy gì: Một bài kiểm tra phụ về việc giữ lại ảnh chụp và nội dung quan sát của lượt trước thực ra chỉ kiểm lại chuỗi do chính nó vừa viết, không chạy chức năng thật. Nó đạt cả khi tính năng chưa được làm, nên không nên coi là bằng chứng cho phần này.
  file: `tests/scripts/luot-sua-giu-du-dem-dung.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 3 (assert có mặt thay cho quan hệ): ca «AC-1» chọn delta không chạm tệp nào của finding, nên không đo được lời hứa tệp-đổi-vẫn-mang**
  Người dùng thấy gì: Một bài kiểm tra phụ về việc giữ lại các vấn đề cũ khi tệp đã bị sửa lại thử trên tệp không bị sửa, nên không kiểm được đúng tình huống cần bảo đảm. Bài kiểm tra chính vẫn kiểm đúng tình huống này, nên đây chỉ là một lớp bảo đảm thừa kém chất lượng.
  file: `tests/scripts/luot-sua-giu-du-dem-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 5/8 lỗi rơi vào file không bộ đo nào phủ (tests/scripts/luot-sua-giu-du-dem-dung.test.mjs, tests/scripts/thuoc-vat-merge-detailed.test.mjs, tests/scripts/thuoc-vat-merge-base.test.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
