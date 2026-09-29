# Review findings — mot-so-ba-ve (round 1)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **MS-AC8-xuat: a permanent-suite test writes a tracked dossier file and then checks it against what it just wrote**
  Người dùng thấy gì: Mỗi lần chạy bộ kiểm tra, hệ thống có thể âm thầm viết đè tệp bằng chứng của hồ sơ này rồi tự báo khớp. Nếu thẻ đổi cách hiển thị sau khi hồ sơ đã ký, tệp bằng chứng sẽ đổi theo mà không ai sửa và không có gì báo đỏ.
  file: `tests/scripts/msbv-the.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Mutant cases conclude from an absence without proving the mutant copy actually ran (standalone negative assertion)**
  Người dùng thấy gì: Một số ca thử kiểu phá thử có thể báo là đã bắt được lỗi trong khi thực ra bản thử bị hỏng và chưa chạy. Người ký có thể tin nhầm rằng chốt chặn xoá và các khối trên thẻ đã được kiểm chứng.
  file: `tests/hooks/ruling-truoc-khi-xoa.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Test fixture copies product content from the consumer repo crm into the kit verbatim**
  Người dùng thấy gì: Dữ liệu thử của bộ công cụ chứa nguyên văn các quyết định nội bộ của sản phẩm khác, gồm cả một hạn chế bảo mật của sản phẩm đó. Người dùng công cụ ở công ty khác sẽ nhận kèm nội dung không liên quan đến họ.
  file: `tests/scripts/fixtures/msbv-progress-superpowers.md`
  severity: low
  Đề xuất: known-limits

- **Another writer template still tells sessions to write `impact` and a `<rand>` id, contrary to the new schema**
  Người dùng thấy gì: Một lời nhắc của công cụ vẫn hướng dẫn ghi quyết định theo khuôn cũ hai vế. Dòng ghi theo lời nhắc đó lên thẻ sẽ hiện thiếu lý do và thiếu giá nếu sai, và bị đưa vào danh sách chờ dịch.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **Hook cho qua KHÔNG khai báo khi lệnh rm dùng glob, brace, dấu ~, sudo hay subshell: ruling bị xoá mà không được gặt**
  Người dùng thấy gì: Nếu thư mục kế hoạch bị xoá bằng lệnh dùng dấu sao, ngoặc nhọn, sudo hay lệnh con, các quyết định ghi trong đó mất mà không được lưu vào sổ và không có cảnh báo nào hiện ra.
  file: `hooks/ruling-truoc-khi-xoa.js`
  severity: medium
  Đề xuất: known-limits

- **Lệnh chạy tay mà hook in ra không gỡ được chặn khi kế hoạch superpowers không thuộc hồ sơ nào: exit 2 lặp mãi**
  Người dùng thấy gì: Khi một kế hoạch không gắn với hồ sơ nào, hệ thống chặn việc xoá thư mục tạm và chỉ đường chạy tay, nhưng làm theo vẫn không được. Người dùng bị kẹt cho tới khi phải né chốt chặn bằng cách khác.
  file: `hooks/ruling-truoc-khi-xoa.js`
  severity: medium
  Đề xuất: new-contract

- **Shape 4 (assertion that cannot go red): MS-AC8-xuat overwrites the evidence file and then checks that the file equals what it just wrote**
  Người dùng thấy gì: Đầu vào để người lạ chấm thẻ Cổng 2 không có phép kiểm nào biết được nó cũ hay viết tay, vì tệp bị viết đè trước khi so. Người ký không có bảo đảm tệp đó là kết quả của lần chạy hiện tại.
  file: `tests/scripts/msbv-the.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Shape 4 (negative-only assertion, no positive control): MS-AC1-lib-im compares two results that are null for every input**
  Người dùng thấy gì: Phép kiểm rằng dòng sổ mới không làm đổi kết quả đọc sổ cũ thực ra so hai kết quả đều rỗng. Nó sẽ vẫn xanh dù đọc sổ có bị hỏng, nên người ký không có bằng chứng thật rằng sổ cũ đọc vẫn đúng.
  file: `tests/scripts/msbv-so.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Shape 5 (claims the class, has only a point case): AC-9 --extract is tested at Gate 1 only; the two Gate 2 extract filters have no case**
  Người dùng thấy gì: Ở Cổng 2, danh sách câu cần dịch có thể bắt đầu chứa cả dòng quyết định đã đủ ba vế mà không bộ kiểm tra nào báo. Người dịch sẽ bị hỏi lại những dòng không cần dịch.
  file: `tests/scripts/msbv-the.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (red direction does not pin the message and does not re-run the assertion): MS-AC7-van-ban only checks that the mutation needle took effect**
  Người dùng thấy gì: Phép thử phá thử cho việc hướng dẫn có nêu đường chạy tay hay không chỉ xác nhận chỗ phá có hiệu lực, không kiểm tra hướng dẫn thật sự bị bắt. Nếu ai đó lỡ xoá câu hướng dẫn, bộ kiểm tra có thể không đỏ.
  file: `tests/scripts/msbv-so.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 1 (measures source text instead of output): the «writer --extract and reader render take keys from ONE function» part of AC-9 is measured by grepping for the function definition**
  Người dùng thấy gì: Việc khoá dịch ở bước trích và ở bước dựng thẻ dùng cùng một cách tính chỉ được kiểm bằng cách đọc chữ trong mã. Nếu hai bên lệch nhau, câu dịch vẫn có thể không hiện ra trên thẻ mà không ai biết.
  file: `tests/scripts/msbv-the.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/11 lỗi rơi vào file không bộ đo nào phủ (tests/hooks/ruling-truoc-khi-xoa.test.mjs, scripts/pre-merge-check.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
