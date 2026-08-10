# Review Findings: khoi-viec-cua-anh (round 3)

## Trong hợp đồng

(rỗng — không finding nào round này map vào một AC đã ký.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Điều khoản mời-cổng chèn GIỮA câu, cắt đôi chỉ dẫn trong overlay Codex (và bản mirror)**
  Người dùng thấy gì: Trong bản Codex, một câu chỉ dẫn cho AI bị cắt làm đôi bởi đoạn nhắc-mời-cổng chèn vào giữa, có thể khiến máy đọc nhầm bước kế tiếp khi chạy vòng duyệt Cổng 2 — nhưng khối lời-mời và thẻ cổng mà người dùng thấy vẫn đúng nội dung.
  file: `codex/acceptance-gate/skills/acceptance/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (đột biến không cô lập lớp): 2/5 chuẩn của P189 thực ra được thoả bởi GATE-INVITE-CLAUSE nằm trong cùng vùng đo — xoá đúng hai gạch đầu dòng luật vẫn XANH**
  Người dùng thấy gì: Phép kiểm tự động cho khuôn trả lời có thể vẫn báo đạt dù sau này ai đó lỡ xoá mất hai trong năm quy tắc của khuôn, vì phép kiểm đang lẫn nội dung của một đoạn văn bản khác nằm ngay cạnh — nghĩa là một lỗi thật có thể lọt qua trong tương lai mà không ai nhận ra.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP nhưng luật đếm chỉ phủ nửa lớp): P188 không có sàn số-bản-chép cho các site NGUỒN — xoá 1 trong 2 bản ở nguồn + mirror vẫn XANH**
  Người dùng thấy gì: Nếu lời mời-cổng bị xoá nhầm khỏi một trong các file nguồn (ví dụ ở bước duyệt đầu của vòng lặp tính năng) trong khi bản build đi kèm cũng bị xoá theo, phép kiểm tự động hiện tại có thể không phát hiện ra, vì nó chỉ so khớp những bản còn sót lại chứ chưa đếm đủ số bản phải có ở từng file nguồn.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim đúng thông điệp): sáu khối bằng chứng E1–E6 đều dán CÙNG một dòng PASS của P190 — không case nào mà eval gọi tên được ghim**
  Người dùng thấy gì: Sáu mục bằng chứng trong báo cáo nghiệm thu đều dán trùng một dòng kết quả của một ca không liên quan, thay vì dòng kết quả của chính ca mà mỗi mục nói tới — nên nếu một trong các ca kiểm bị đổi tên, bị bỏ qua, hay chạy nhầm, báo cáo vẫn hiện y như đang đạt, khiến người ký khó phát hiện vấn đề chỉ bằng cách đọc báo cáo.
  file: `_acceptance/khoi-viec-cua-anh/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).