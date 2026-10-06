# Review findings: gia-lan-ghim-lai (round 3)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Comment in the mutation matrix says each mutation is caught only by its own axis's cell, which is false**
  Người dùng thấy gì: Một dòng chú thích trong bộ kiểm tra nội bộ nói hơi quá về cách các phép thử tách biệt nhau. Người dùng làn ghim lại không bị ảnh hưởng gì, chỉ có thể làm người đọc mã hiểu nhầm đôi chút.
  file: `_acceptance/gia-lan-ghim-lai/rang/ma-tran.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 5/4: ô thứ tư của ma trận 2×2 (song song × CI) chỉ có chiều xanh, không có phép phá nào chứng chiều đỏ**
  Người dùng thấy gì: Khi làn chạy lại một lệnh đỏ vừa ở chế độ chạy song song vừa ở môi trường giống CI, bộ kiểm tra hiện chưa có phép thử nào chứng minh được nó sẽ báo đỏ nếu hành vi này hỏng. Tổ hợp này vẫn chạy được nhưng chưa có bằng chứng bảo vệ riêng.
  file: `_acceptance/gia-lan-ghim-lai/rang/ma-tran.mjs`
  severity: low
  Đề xuất: known-limits

- **GUIDE §7.1 ships a «Gợi ý cho crm» column carrying one consumer repo's product config (eval IDs, env var names, AI Gateway cost command) (r1)**
  Người dùng thấy gì: Tài liệu hướng dẫn gửi cho mọi kho đang kèm một cột gợi ý riêng cho một kho cụ thể (tên eval, tên khoá bí mật). Kho khác đọc sẽ thấy cấu hình không phải của mình; không làm hỏng chức năng, chỉ làm tài liệu kém trung lập.
  file: `GUIDE.md`
  severity: medium
  Đề xuất: known-limits

- **model_evals entries are checked for shape only; a typo silently re-runs a real-model eval, the exact case the round forbids (r1)**
  Người dùng thấy gì: Nếu kho gõ sai tên một eval gọi model thật khi khai báo, hệ thống không báo lỗi mà vẫn chạy lại eval đó và lấy lượt tốt hơn, tức tự làm đẹp kết quả mà không ai hay. Chỉ xảy ra khi người cấu hình gõ nhầm.
  file: `feature-loop/scripts/lib/lan-khoa.mjs`
  severity: medium
  Đề xuất: known-limits

- **Every lane command now runs under setsid (detached:true), so a group SIGKILL from the calling tool no longer reaches suites; this limit is undeclared (r1)**
  Người dùng thấy gì: Nếu công cụ bên ngoài ngắt cứng lượt ghim lại, các tiến trình con có thể chạy sót sau khi lượt đã chết và lượt sau có thể đỏ giả. Giới hạn này cần được ghi rõ cho mọi kho vì nó áp dụng mặc định.
  file: `feature-loop/scripts/lib/chay-lenh.mjs`
  severity: medium
  Đề xuất: known-limits

- **The repin-do sample in the SKILL template shows `"chap_chon":[]`, contradicting the presence rule stated just below it (r1)**
  Người dùng thấy gì: Dòng mẫu trong hướng dẫn cho thấy một mục luôn có mặt dù quy tắc ngay bên dưới nói nó vắng hẳn khi không dùng. Người đọc có thể hiểu sai hình dạng bản ghi, nhưng hệ thống chạy đúng.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **doChiPhi misreads a cost that has a thousands separator, giving a wrong cost delta (r1)**
  Người dùng thấy gì: Nếu công cụ đo chi phí in số có dấu phẩy ngăn cách hàng nghìn, con số chênh chi phí trong tổng kết sẽ sai lệch rất lớn mà không báo lỗi. Chỉ ảnh hưởng dòng chi phí đo, không ảnh hưởng đỏ hay xanh của lượt.
  file: `feature-loop/scripts/lib/lan-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — AC2-B7 chỉ ghim mã thoát 3, không ghim thông điệp; ca vẫn xanh trên BASE-GIA (nơi chưa có cờ) (r1)**
  Người dùng thấy gì: Phép thử kiểm tra cờ giới hạn thời gian sai chỉ nhìn kết quả thất bại chung chung, nên không phân biệt được 'giá trị sai bị bắt đúng' với 'cờ chưa tồn tại'. Tính năng chạy đúng, chỉ là bằng chứng kiểm thử yếu hơn mức mong muốn.
  file: `tests/scripts/repin-lane-tran.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — lời hứa «không ghi pin, verified_commit/báo cáo giữ nguyên» được đo trên làn KHÔNG --write, nơi làn vốn không bao giờ ghi (r1)**
  Người dùng thấy gì: Phép thử lời hứa 'vượt trần thì không ghi kết quả ghim' chạy ở chế độ vốn không ghi gì, nên một lỗi thật khi chế độ ghi bật có thể lọt mà không phép thử nào bắt. Chưa có bằng chứng lỗi đang xảy ra.
  file: `tests/scripts/repin-lane-tran.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
