# Review Findings: inputs-tinh-tu-goc-kho (round 3)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **SKILL acceptance tuyên có bước chặn exit 2 cho input vắng, nhưng bước đó chỉ tồn tại trong feature-loop (`s4-args.mjs`), không có trên đường `/acceptance` trần**
  Người dùng thấy gì: Tài liệu hướng dẫn nói rằng khi chạy quy trình chấm độc lập (không qua vòng tính năng đầy đủ), hệ thống sẽ tự dừng và báo lỗi nếu thiếu dữ liệu đầu vào. Trên thực tế đường chạy độc lập đó không có bước kiểm tra này, nên dữ liệu thiếu có thể lọt qua mà không ai hay.
  file: `skills/acceptance/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Chân E7 «tài liệu không còn đường cũ» là bảo đảm dài hạn nhưng chỉ sống trong răng hồ sơ — trái luật phân loại ADR 0011**
  Người dùng thấy gì: Bảo đảm rằng ba tài liệu hướng dẫn không còn dạy cách viết đường dẫn kiểu cũ chỉ được một bài kiểm tra tạm thời canh giữ, không nằm trong bộ kiểm tra thường trực của dự án. Nếu sau này có ví dụ kiểu cũ vô tình quay lại tài liệu, không có gì tự động phát hiện.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **Chú thích khối P3 mô tả nhánh không còn tới được sau bản sửa**
  Người dùng thấy gì: Một dòng giải thích trong mã nguồn mô tả một tình huống không còn xảy ra được sau bản sửa lần này. Việc này không ảnh hưởng đến cách hệ thống hoạt động, chỉ có thể gây hiểu nhầm cho người đọc mã sau này.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **Evidence exception applies only to relative paths; an absolute path into the same dossier's evidence/ is rejected with exit 2**
  Người dùng thấy gì: Khi một tệp bằng chứng của chính vòng chấm đang chạy được ghi bằng đường dẫn đầy đủ (thay vì đường dẫn rút gọn), hệ thống sẽ dừng và báo thiếu tệp dù đây là tình huống bình thường trong lúc chấm. Người viết cần luôn dùng đường dẫn rút gọn cho loại tệp này để tránh bị chặn oan.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — E7 tuyên quét LỚP (3 tiền tố × 2 cú pháp khối/inline) nhưng chiều đỏ chỉ ghim 1 ô: dạng khối + tiền tố `contract.md`**
  Người dùng thấy gì: Bài kiểm tra tự động cho việc dọn sạch ví dụ tài liệu cũ mới chứng minh được cho một cách viết. Cách viết còn lại — cũng là cách phổ biến trong tài liệu thật đang dùng — chưa được kiểm chứng là có thể phát hiện lỗi nếu nó quay lại.
  file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
