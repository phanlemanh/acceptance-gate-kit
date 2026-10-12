# Review findings: can-cu-s1-chay-moi-kho (round 1)

## Trong hợp đồng

- **Hình 3 (lời hứa là QUAN HỆ sổ↔thẻ nhưng hai vế cùng rút từ một hàm): KK-6 so-that lấy số mong đợi từ chính bộ xếp mà thẻ gọi**
  file: `tests/scripts/can-cu-s1.ca.mjs:645`
  severity: medium
  AC: AC-6
  source: measurement
  detail: KK-6 so-that tính n = kq.cau_hoi.length + kq.da_quyet.length với kq = require(MOD).phanLoaiSo(...), rồi eq(số data-cau-hoi + số data-may-quyet trên thẻ, n). Nhưng scripts/gate-card.js:551-553 dựng hai khối đó từ CHÍNH canCu.phanLoaiSo(ledger.entries, …) (ccCauHoi = cc.cau_hoi, ccMayQuyet = cc.da_quyet). Vậy phép so chỉ là phanLoaiSo == phanLoaiSo. Nếu bộ xếp bỏ sót một dòng S1 mang can_cu, hoặc xếp nhầm một dòng lành vào đỏ, thì hai vế cùng giảm và ca vẫn xanh. Vòng lặp kiểm từng dòng sau đó (for … of kq.cau_hoi/kq.da_quyet) cũng duyệt theo danh sách của bộ xếp, nên dòng bị bỏ sót không bao giờ được hỏi tới. AC-6 hứa «đúng một dòng cho mỗi dòng S1 mang căn cứ chưa bị thay»; vế mong đợi độc lập phải đếm thẳng từ decisions.jsonl (stage S1, có can_cu, không bị supersedes trỏ tới; sổ thật hôm nay là 9 − 1 = 8) hoặc ghim số viết sẵn như CC-10. Thêm một chỗ hở ở dòng 652: t.includes(chuanChu(d.e.why)) không đòi why khác rỗng. Dòng thiếu why cho chuanChu(undefined) = '' nên includes('') luôn đúng, vế «vì sao» qua mà không đo gì. Hôm nay mọi dòng của sổ thật đều có why, nên chỗ hở này chưa nổ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **KK-8: đường «lịch sử» (sau khi gộp) vẫn lấy gốc = merge-base hai cha, tức đúng luật mà commit 3f86664c vừa thay ở đường chưa gộp; gộp PR này trước A2 thì KK-8 đỏ mãi trên main**
  Người dùng thấy gì: Nếu bản sửa này được đưa vào nhánh chính trước bản sửa nền mà nó xếp chồng lên, một phép kiểm thẻ trên hồ sơ cũ sẽ báo đỏ mãi dù thẻ không hỏng thật. Người duyệt cần biết thứ tự gộp quan trọng, hoặc ghi rõ đây là hạn chế đã biết.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **E9 (ui-check) khai paths chỉ gate-card.js, trong khi bước dựng thẻ chạy bộ sinh hồ sơ trong can-cu-s1.ca.mjs**
  Người dùng thấy gì: Ở lượt chấm sau, nếu chỉ chữ trong dữ liệu mẫu của thẻ bị đổi, hệ thống có thể dùng lại ảnh chụp cũ thay vì chụp lại, nên người duyệt có thể xem một ảnh không còn khớp với nội dung thẻ.
  file: `_acceptance/can-cu-s1-chay-moi-kho/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **KK-8 picks the wrong starting commit (and can pass falsely) when the latest merge on the branch is not a merge from upstream**
  Người dùng thấy gì: Khi làm việc trên hai máy, phép kiểm xem thẻ của hồ sơ cũ có bị đổi không có thể so nhầm với chính bản mới và báo xanh mà không đo gì. Người duyệt sẽ tin nhầm rằng hồ sơ cũ không đổi.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình 5 (tuyên MỌI lệnh nhưng chiều đỏ chỉ có một điểm): mũi tiêm KK-1-do chỉ đổi lệnh thứ nhất trong hai lệnh**
  Người dùng thấy gì: Phép kiểm chỉ chứng minh được rằng lời dặn kiểu cũ ở một trong hai lệnh sẽ bị bắt. Nếu lệnh thứ hai quay lại dùng đường cũ thì chưa chắc có phép kiểm nào báo đỏ.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình 5 (tuyên quét LỚP, ma trận không phủ phần tử của lớp): KK-4-do không có ca nào cho `sh` hay dạng có dấu nháy**
  Người dùng thấy gì: Bộ quét lời gọi đường tương đối có thể không bắt được lời gọi viết theo cách khác (dùng sh hoặc có dấu nháy), nên một lời dặn sai kiểu đó vẫn lọt qua mà không báo đỏ.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
