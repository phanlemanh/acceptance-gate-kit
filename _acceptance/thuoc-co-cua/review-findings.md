## Trong hợp đồng

### Mốc sàn dùng bộ đọc frontmatter tự viết, lệch với bộ đọc một-nguồn `frontmatterField`: hợp đồng CRLF hoặc có dòng trống đầu tệp thì trần nhát sửa thước im lặng không bao giờ nổ
- file: `feature-loop/scripts/thuoc-vat.mjs:53`
- severity: medium
- source: conventions
- AC: AC-11

Nhát sửa dc9eb1b7 (S4-r1, AC-11) thêm `truongStatus` ngay trong tệp. Hàm này dùng regex `/^---\n([\s\S]*?)\n---/` và bóc nháy bằng `replace(/^["']|["']$/g, '')`. Trong khi đó kit đã có bộ đọc một-nguồn `frontmatterField` trong lib/evidence-core.cjs (khớp `front_field` của pre-merge-check.sh). Bộ đó chấp nhận dòng trống đầu tệp, `\r\n` và khoảng trắng sau `---`, và cả hợp đồng lẫn cổng đều đọc `status` qua nó. Ngay tại dòng 120 của evidence-core có ghi chú rằng kiểu bóc nháy trên là lớp lỗi đã giải một lần và không được lan sang bộ đọc kế bên. Nhát sửa này lại mở một bộ đọc thứ hai, đúng hình dạng mà ghi chú đó cấm.

Tôi đã chạy thử trên kho do `thuoc-vat-fixture.mjs` sinh ra, kịch bản là lật sang implemented rồi thêm ba commit chỉ chạm thước. Hợp đồng xuống dòng LF cho ra `san = commit lật, nhat 3`, đúng. Hợp đồng CRLF, hoặc có một dòng trống trước `---`, cho ra `san null, nhat 0`, trong khi `frontmatterField(..., 'status')` vẫn đọc được `implemented`. Hệ quả là `demThuocVat` báo «chua co moc san». s4-args.mjs:440 (`dem.nhat >= TRAN_NHAT`) không bao giờ thoát mã 4, nên trần AC-11 hở mà không báo gì. Thẻ vẫn nhận hồ sơ là implemented, vì các nơi khác đọc qua `frontmatterField`. TV8 chỉ dựng hợp đồng LF không có dòng trống đầu, nên không bắt được chiều này. Script đã nạp `lib/evidence-core.cjs` qua `--ag-root` để lấy `resolveConfigList`, vậy có sẵn đường để dùng chung `frontmatterField` thay cho bộ đọc riêng.

### New status reader in timMocSan misses CRLF and leading-blank-line contracts, so the cap on test-fix commits stops working with no error
- file: `feature-loop/scripts/thuoc-vat.mjs:53`
- severity: medium
- source: bugs
- AC: AC-11

Commit dc9eb1b7 swapped `git log -S 'status: implemented'` for a hand-written `truongStatus` reader. Its regex `/^---\n([\s\S]*?)\n---/` only accepts LF line endings and needs `---` at byte 0. The kit's shared reader `frontmatterField` in lib/evidence-core.cjs (line 277) accepts both `\r?\n` and leading blank lines. It is exported, and the CLI already loads evidence-core for `resolveConfigList`.

I reproduced this with the fixture: a contract with CRLF endings, or with one blank line before `---`, then `implemented` followed by two `thuoc` commits. `core.frontmatterField(txt,'status')` returns `implemented`. `thuoc-vat.mjs --json` exits 0 with `{"san":null,"ghiChu":"chua co moc san (hop dong chua tung implemented)","nhat":0,...}`.

The old `-S` version found the baseline commit in both cases, so this is a regression from the fix. It fails silently: no baseline means `nhat` is always 0 and `thuoc` is always [0,0], so the cap on test-fix commits (trần thước) never fires. The exit code stays 0 and the output looks like an old workspace. The kit's gates read the same contract as `implemented`, so the two readers disagree about the same file.

The reader also strips quotes with `replace(/^["']|["']$/g, '')`, which evidence-core.cjs (around line 110) documents as a known-bad pattern.

Fix: use `core.frontmatterField(txt, 'status')` instead of a second reader, and add a CRLF case to TV8.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **duong-nen: dirty-tree and suite checks run while S1 writes files in parallel, so the loop's own files are reported as infrastructure red (r1)**
  Người dùng thấy gì: Khi bước đầu tiên của vòng chạy nền trong lúc người vẫn đang soạn hồ sơ thiết kế và hợp đồng, hệ thống có thể báo nhầm là có lỗi hạ tầng chỉ vì các tệp đang được soạn dở, khiến người bị hỏi thêm những câu không cần thiết.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: medium
  Đề xuất: known-limits

- **duong-nen: the kit repo is never detected as self-hosted with SKILL's command, so the engine check compares the worktree with the plugin cache (r1)**
  Người dùng thấy gì: Khi dùng đúng theo cách gọi mặc định trong tài liệu hướng dẫn, việc kiểm tra hạ tầng ngay trong kho của kit có thể báo nhầm là engine không khớp phiên bản dù thực tế không có gì sai, khiến người bị hỏi thêm một câu không cần thiết.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình 5 (tuyên quét ma trận mà các ô không độc lập): chiều đỏ của DN3-IM ở ô 2 và ô 3 là đỏ do dư của ô trước (r1)**
  Người dùng thấy gì: Bài kiểm để đảm bảo máy không bỏ sót thay đổi định nghĩa phép đo có lỗ hổng khiến một phần phép thử không thực sự chứng minh điều nó tuyên bố — khó biết chắc hành vi bỏ-qua có đúng ở mọi trường hợp hay chỉ đúng nhờ trùng hợp.
  file: `tests/scripts/bo-qua-dinh-nghia-phep-do.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình 3 (lời hứa là quan hệ từng ô, nhưng fixture cho các giá trị trùng nhau): GT1 không phân biệt được dòng đếm bị đặt nhầm ô (r1)**
  Người dùng thấy gì: Bài kiểm cho thẻ hiển thị số liệu vật/thước có thể vẫn báo xanh ngay cả khi các con số bị hiển thị nhầm cột, vì các giá trị mẫu dùng để kiểm trùng nhau.
  file: `tests/scripts/gate-card-thuoc-vat.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình 3 (round-trip với giá trị trùng): GN4/GN1 không phát hiện được thẻ đọc nhầm chân nền (r1)**
  Người dùng thấy gì: Bài kiểm cho thẻ hiển thị trạng thái hạ tầng có thể vẫn báo xanh ngay cả khi thẻ đọc nhầm giá trị giữa các mục, vì mẫu kiểm dùng giá trị trùng nhau và không kiểm đủ phần hiển thị.
  file: `tests/scripts/gate-card-duong-nen.test.mjs`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).