## Trong hợp đồng

### Assertion âm-tính-một-mình: mutant m2 của DP13 kết luận từ exit≠0, không ghim thông điệp
- file: `tests/plugins/design-pass-nac.test.mjs:431`
- severity: low
- AC: AC-14
- detail: `const m2 = render(mkWs(null), s => s.replace("const dpText = read(...)", "const dpText = null.x;"))` rồi `if (m2.status === 0) errs.push('m2: bo dung the nem loi ma van exit 0 …')` — vế duy nhất được khẳng định là MÃ THOÁT khác 0, không ghim một mảnh thông điệp nào của lỗi mong đợi. Bất biến của kho nói rõ mọi case dựng bản sao rồi kết luận từ «exit khác 0» phải có cả (a) đối chứng dương LẪN (b) ghim đúng thông điệp; ở đây chỉ có (a). Hệ quả cụ thể: mọi nguyên nhân chết khác của bản sao (lệnh tiêm trúng dòng khác sau khi gate-card đổi, bản sao thiếu phụ thuộc, lỗi cú pháp do phép thay chuỗi) đều cho cùng mã thoát khác 0 và m2 vẫn in xanh trong khi nó chưa hề chạy được nhánh nó định đo. (Rủi ro thực tế thấp vì `render()` ném lỗi khi lệnh tiêm no-op, và m1/m3 cùng chạy trên bản sao nên hạ tầng bản sao có đối chứng — nhưng vế (b) vẫn thiếu.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **PRODUCT-MAP.md không được dựng lại cùng commit chữ ký — cổng tự-host của kit ĐỎ**
  Người dùng thấy gì: Bản đồ tổng quan các tính năng của kit chưa được cập nhật khớp với hồ sơ vừa được ký duyệt, khiến hệ thống kiểm tra tự động của kit báo lỗi và có thể cản trở việc gộp nhánh này.
  file: `PRODUCT-MAP.md`
  severity: high
  Đề xuất: known-limits

- **Chỗ trống chưa điền của khoá `options:` bị nuốt thành «không có bộ phương án», không cờ**
  Người dùng thấy gì: Nếu người thực hiện quên điền đường dẫn bộ phương án vào đúng chỗ theo mẫu, thẻ duyệt sẽ hiển thị y như trường hợp hoàn toàn không có bộ phương án nào — không có cảnh báo nhắc nhở, nên người duyệt dễ nhầm lẫn hai tình huống khác nhau này.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: new-contract

- **evidence-report verdict=REJECT — lưới trước-khi-gộp của chính kit sẽ chặn nhánh này**
  Người dùng thấy gì: Hồ sơ đã có chữ ký người duyệt nhưng một kết quả đo tự động khác vẫn đang ở trạng thái chưa đạt, nên hệ thống có thể ngăn không cho gộp nhánh này cho tới khi có quyết định xử lý thêm.
  file: `_acceptance/design-pass-nac-khong-dong-bo/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **CONTEXT.md không được cập nhật cho trục `reaction:` / `divergence:` và ổ cắm `design_pass.ds_skill`**
  Người dùng thấy gì: Hai khái niệm mới của tính năng này chưa được đưa vào tài liệu giải thích thuật ngữ chung của kit, nên người đọc tài liệu sau này có thể không biết tới chúng hoặc dùng sai từ ngữ.
  file: `CONTEXT.md`
  severity: low
  Đề xuất: known-limits

- **Executor mới chèn vào giữa khối chú thích của hồ sơ khác trong config.yaml**
  Người dùng thấy gì: Một ghi chú giải thích trong tệp cấu hình bị đặt lệch sang đúng nhóm nội dung khác, dễ khiến người bảo trì sau này xoá nhầm phần không liên quan khi dọn dẹp.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **Câu S1-D của feature-loop lạc ngoặc và lặp mệnh đề sau khi chèn nấc phản ứng**
  Người dùng thấy gì: Một đoạn hướng dẫn trong quy trình làm việc bị viết lộn xộn và lặp ý sau khi chỉnh sửa, khiến người đọc dễ hiểu sai bước cần thực hiện.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **PRODUCT-MAP.md chưa dựng lại sau khi contract sang signed-off — CI + suite plugin ĐỎ trên HEAD**
  Người dùng thấy gì: Bản đồ tổng quan các tính năng của kit chưa khớp với hồ sơ vừa ký duyệt, khiến các phép kiểm tra tự động trên nhánh này báo lỗi và có thể cản trở việc gộp.
  file: `PRODUCT-MAP.md`
  severity: high
  Đề xuất: known-limits

- **options: còn nguyên chỗ trống bị nuốt thành «không có bộ phương án» — không cờ, không phân biệt được với vắng khoá**
  Người dùng thấy gì: Nếu người thực hiện quên điền đường dẫn bộ phương án vào đúng chỗ theo mẫu, thẻ duyệt hiển thị y như trường hợp không hề có bộ phương án nào — người duyệt không có cách nào phân biệt hai tình huống khác nhau này qua thẻ.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: new-contract

- **Tuyên quét LỚP nhưng chỉ có điểm-case: thước mật-độ-cửa-sổ của DP1 không phủ lớp «bản khai lại» mà E1 tuyên**
  Người dùng thấy gì: Phép kiểm tra tự động chỉ phát hiện được kiểu lặp lại nội dung khi các chỗ lặp nằm gần nhau trong tài liệu; nếu chúng bị dàn trải ra xa nhau, việc lặp đó có thể lọt qua mà không bị bắt lỗi.
  file: `tests/plugins/design-pass-nac.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Ma trận mutant khai «MỖI khoá ở CẢ HAI trục» nhưng trục ngữ cảnh chỉ có một điểm-case**
  Người dùng thấy gì: Tài liệu mô tả phép kiểm tự động tuyên bố đã thử đủ mọi tổ hợp ở một nhóm điều kiện, nhưng thực tế chỉ mới thử một trường hợp đại diện, nên một phần trong nhóm đó chưa thực sự được kiểm chứng.
  file: `tests/plugins/design-pass-nac.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 5/11 lỗi rơi vào file không bộ đo nào phủ (PRODUCT-MAP.md, _acceptance/design-pass-nac-khong-dong-bo/evidence-report.md, CONTEXT.md, _acceptance/config.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
