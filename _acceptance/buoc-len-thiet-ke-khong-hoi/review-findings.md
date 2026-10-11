# Review findings: buoc-len-thiet-ke-khong-hoi (round 1)

## Trong hợp đồng

- **Shape 4 (negative assertion with no positive control): CC-06 bo-doc compares readers that never read the ledger**
  AC: AC-6
  file: `tests/scripts/can-cu-s1.ca.mjs:428`
  severity: high
  source: measurement
  detail: `eq(chay(true), chay(false), ...)` coi «đầu ra có can_cu == đầu ra không can_cu» là bằng chứng ba bộ đọc hiện có bỏ qua khoá mới. Chạy fixture của chính ca đo (mkHoSoThe) và in ra thứ `chay` trả về: `[null, "", <JSON loop-health mà các hàng chỉ có trường tier/round>]`. (a) `tom && tom.chu_kho` luôn undefined vì tomTatHoSo trả `{dai:{chu_kho:...}, nguon:...}`, trường đúng là `tom.dai.chu_kho`, nên cả hai vế đều null. (b) claim-scan in chuỗi rỗng vì mọi id của fixture (q1, q2, m1, m2, c1, s2) đều không khớp `ID_RE = /^(d-[0-9TZ]+-[0-9]+|[a-z0-9-]+#F[0-9]+)$/` nên bị bỏ, và cảnh báo của nó đi ra stderr mà ca đo không bắt. (c) hàng loop-health không mang trường nào suy từ sổ. Cả hai vế của phép so bằng đều là hằng số, nên ca vẫn xanh kể cả khi một bộ đọc sập hoặc đọc sai can_cu. Không có đối chứng dương cho thấy đầu ra bộ đọc đổi khi sổ đổi (ví dụ tom.dai.chu_kho.quyet_dinh_may > 0, hoặc claim-scan trả ≥1 claim dưới id dạng d-…). Lời hứa của E6 «tomTatHoSo, claim-scan và loop-health ra kết quả bằng nhau có/không khoá can_cu» thực tế chưa được đo.
  rationale: AC-6 đòi các bộ đọc khác ra cùng kết quả có/không khoá can_cu; ca đo so hai vế đều là hằng số nên mệnh đề này không được chứng minh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The feature-loop skill runs can-cu-s1.cjs by a path that only exists inside the kit, so the Gate 1 stop check breaks in consumer repos**
  Người dùng thấy gì: Ở kho khách (như crm), bước kiểm sổ trước Cổng Phạm vi sẽ báo lỗi chứ không chạy được. Vòng nào cũng bị dừng hỏi người một cách vô cớ, hoặc phiên bỏ qua bước kiểm nên lưới chặn không hoạt động, và số đo 0 lần dừng hỏi ở crm bị sai.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: high
  Đề xuất: new-contract

- **The Gate 1 card drops the reason and cost-if-wrong for every design-step decision (S1 row) that carries can_cu, which breaks ADR 0021 (DEC-BA-VE) and ADR 0022's own claim**
  Người dùng thấy gì: Trên thẻ Cổng Phạm vi, những lựa chọn máy đã quyết hoặc đang hỏi anh không còn hiện vì sao chọn và sai thì tốn gì. Anh đứng ở đúng chỗ được mời lật quyết định mà thiếu thông tin về cái giá của việc chọn sai.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: new-contract

- **feature-loop SKILL calls the classifier at a path that only exists inside the kit repo, so consumer repos read every Gate 1 check as 'red'**
  Người dùng thấy gì: Ở kho khách, lệnh kiểm sổ trước Cổng Phạm vi không tìm thấy công cụ nên luôn báo lỗi, bị đọc thành sổ đỏ. Mọi vòng đều dừng hỏi người, và số đo lật quyết định ở crm không chạy được.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: high
  Đề xuất: new-contract

- **s1_hoi.py never applies the 'nghi' close across a month boundary, which falls inside the measured window**
  Người dùng thấy gì: Công cụ đếm số lần máy dừng hỏi trong thiết kế đếm sai khi khoảng nghỉ vắt qua cuối tháng, nên số liệu 22/09 đến 11/10 có thể lẫn tin nhắn tháng 10 vào lượt thiết kế cũ. Ảnh hưởng là số đo hơi lệch, không phải sản phẩm hhỏng.
  file: `_acceptance/buoc-len-thiet-ke-khong-hoi/do-11-10/s1_hoi.py`
  severity: low
  Đề xuất: known-limits

- **Shape 4 (negative assertion only): CC-05 khong-goc checks for no red flag on a fixture that has no red candidate**
  Người dùng thấy gì: Bộ kiểm chưa chứng minh được rằng khi không biết gốc nhánh thì máy bỏ qua việc soi câu trích mới sinh. Sản phẩm có thể đúng, chỉ là chưa có phép thử cho thấy nó đúng.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative assertion only): CC-06 the-cu question-block check runs on records that cannot have questions**
  Người dùng thấy gì: Chưa có phép thử cho trường hợp hồ sơ đã ký mà vẫn còn câu hỏi chỉ người biết. Nếu thẻ in nhãn sai ở trường hợp đó thì bộ kiểm vẫn xanh.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (class claimed, point cases only): CC-04-do claims 'every red rule code' but never compares its list with LY_DO**
  Người dùng thấy gì: Nếu sau này thêm một luật đỏ mới, bộ kiểm sẽ không tự đòi ca thử cho luật đó. Hôm nay mọi luật đang có đều đã có ca.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 (presence checked instead of the relation): CC-07 text output checks only 2 of 8 numbers**
  Người dùng thấy gì: Bản in dạng chữ của bộ đếm chỉ được kiểm hai con số chính. Sáu con số phụ in sai thì bộ kiểm không bắt được.
  file: `tests/scripts/can-cu-s1.ca.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
