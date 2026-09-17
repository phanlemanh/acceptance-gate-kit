## Trong hợp đồng

- **thuoc-vat: the floor commit is found by searching the whole contract text for 'status: implemented', so a mention in the prose puts the floor at S1**
  file: `feature-loop/scripts/thuoc-vat.mjs:50`
  severity: high
  source: bugs
  AC: AC-11
  detail: `timMocSan` finds the floor commit with `git log --reverse -S 'status: implemented' -- contract.md` and takes the first match. `-S` searches the whole file, not only the `status:` field in the frontmatter. Contracts in this kit often write `status: implemented` in their prose; _acceptance/status-chua-arm-cong/contract.md line 36 does. For such a contract the first match is the S1 draft commit (confirmed there: 3c753927 'hồ sơ S1 … draft', not f8de7798 'contract implemented'). Every test-only S2/S3 commit then counts as a measure-fix commit, which breaks AC-11: commits before the floor must not be counted. Reproduced with a scratch repo: draft contract with an AC line containing `status: implemented`, then 3 TDD commits touching only tests/, 1 code commit, 1 commit flipping the frontmatter to implemented. `thuoc-vat.mjs` reports 'san <S1 commit> · nhat 3'. s4-args.mjs calls demThuocVat and exits 4 when the count reaches 3, so it refuses to generate args for the very first S4 round and prints the three options, though no measure fix happened after implemented. Fix: match only the frontmatter `status:` line, e.g. `-G '^status:[[:space:]]*implemented'`, or check each commit's frontmatter field.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bộ đếm nhát sửa thước không giới hạn theo slug: commit thước của vòng khác cũng tính vào trần 3 của hồ sơ này**
  Người dùng thấy gì: Nếu có phiên làm việc khác đang song song sửa hồ sơ khác trong cùng kho, bộ đếm có thể tính nhầm những thay đổi đó vào giới hạn sửa-thước của hồ sơ bạn đang làm, khiến máy dừng lại hỏi bạn dù bạn chưa hề sửa thước của chính mình.
  file: `feature-loop/scripts/thuoc-vat.mjs`
  severity: medium
  Đề xuất: known-limits

- **gitTry của thuoc-vat để lọt dòng «fatal:» của git ra stderr ở mọi lượt sinh args**
  Người dùng thấy gì: Khi vừa tạo hồ sơ mới, bạn có thể thấy một dòng thông báo lỗi kỹ thuật lẫn vào kết quả dù mọi thứ vẫn chạy đúng, dễ gây hiểu lầm là có sự cố hạ tầng.
  file: `feature-loop/scripts/thuoc-vat.mjs`
  severity: low
  Đề xuất: known-limits

- **duong-nen: dirty-tree and suite checks run while S1 writes files in parallel, so the loop's own files are reported as infrastructure red**
  Người dùng thấy gì: Khi bước đầu tiên của vòng chạy nền trong lúc người vẫn đang soạn hồ sơ thiết kế và hợp đồng, hệ thống có thể báo nhầm là có lỗi hạ tầng chỉ vì các tệp đang được soạn dở, khiến người bị hỏi thêm những câu không cần thiết.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: medium
  Đề xuất: known-limits

- **duong-nen: the kit repo is never detected as self-hosted with SKILL's command, so the engine check compares the worktree with the plugin cache**
  Người dùng thấy gì: Khi dùng đúng theo cách gọi mặc định trong tài liệu hướng dẫn, việc kiểm tra hạ tầng ngay trong kho của kit có thể báo nhầm là engine không khớp phiên bản dù thực tế không có gì sai, khiến người bị hỏi thêm một câu không cần thiết.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình 5 (tuyên quét ma trận mà các ô không độc lập): chiều đỏ của DN3-IM ở ô 2 và ô 3 là đỏ do dư của ô trước**
  Người dùng thấy gì: Bài kiểm để đảm bảo máy không bỏ sót thay đổi định nghĩa phép đo có lỗ hổng khiến một phần phép thử không thực sự chứng minh điều nó tuyên bố — khó biết chắc hành vi bỏ-qua có đúng ở mọi trường hợp hay chỉ đúng nhờ trùng hợp.
  file: `tests/scripts/bo-qua-dinh-nghia-phep-do.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình 3 (lời hứa là quan hệ từng ô, nhưng fixture cho các giá trị trùng nhau): GT1 không phân biệt được dòng đếm bị đặt nhầm ô**
  Người dùng thấy gì: Bài kiểm cho thẻ hiển thị số liệu vật/thước có thể vẫn báo xanh ngay cả khi các con số bị hiển thị nhầm cột, vì các giá trị mẫu dùng để kiểm trùng nhau.
  file: `tests/scripts/gate-card-thuoc-vat.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình 3 (round-trip với giá trị trùng): GN4/GN1 không phát hiện được thẻ đọc nhầm chân nền**
  Người dùng thấy gì: Bài kiểm cho thẻ hiển thị trạng thái hạ tầng có thể vẫn báo xanh ngay cả khi thẻ đọc nhầm giá trị giữa các mục, vì mẫu kiểm dùng giá trị trùng nhau và không kiểm đủ phần hiển thị.
  file: `tests/scripts/gate-card-duong-nen.test.mjs`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
