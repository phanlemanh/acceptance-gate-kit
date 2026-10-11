# Review findings: ngoai-n-tu-dinh-tuyen (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Lệnh đếm ngưỡng của giới hạn đã khai không đếm được: --check trên hồ sơ machine-cleared luôn thoát 0**
  Người dùng thấy gì: Kit khai một giới hạn đã biết kèm con số để biết khi nào phải sửa, nhưng cách đếm con số đó luôn ra 0. Vì vậy dấu hiệu cần sửa sẽ không bao giờ hiện, và chủ kho sẽ tin là chưa có ca nào lệch trong khi thật ra không ai đo được.
  file: `GUIDE.md`
  severity: high
  Đề xuất: new-contract

- **Ca đỏ chỉ dựa mã thoát, không ghim thông điệp; chữ «ca nêu …» được in cứng**
  Người dùng thấy gì: Hai phép thử kiểm tra rằng lỗi cố ý bị bắt chỉ bằng việc chương trình dừng, không kiểm xem nó dừng đúng lý do. Nếu phép thử tự hỏng vì lý do khác, màn hình vẫn báo xanh nên người đọc có thể tin nhầm là hệ thống bắt được lỗi.
  file: `tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Khối DINH-TUYEN-MAY không nói phải làm gì khi lệnh thoát khác 0/2 (resolver 1, script 3)**
  Người dùng thấy gì: Khi bản công cụ cài trên máy thiếu tệp cần thiết hoặc lệnh bị gọi sai, hướng dẫn không nói máy phải làm gì tiếp. Phiên làm việc có thể dừng chờ người dù đây không phải một quyết định thật, làm mất thời gian của chủ kho.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: new-contract

- **tieu_de comparison treats a carried item's '(rN)' label as a changed item, so any later S4 round blocks routing**
  Người dùng thấy gì: Sau một vòng chấm lại, cùng một mục có thể bị coi là mục đã đổi chỉ vì tiêu đề thêm hậu tố vòng. Khi đó máy bỏ định tuyến, hồ sơ quay về chờ người ký và thẻ báo sai rằng mục đã thay đổi, làm mất đúng phần thời gian mà tính năng này định tiết kiệm.
  file: `scripts/dinh-tuyen-may.cjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 3 — chỉ assert «chuỗi có mặt» trong khi lời hứa là quan hệ mục↔lệnh đảo của chính mục (NT7 html)**
  Người dùng thấy gì: Phép thử trang thẻ chỉ kiểm lệnh đảo có xuất hiện đâu đó trên trang, không kiểm nó nằm đúng cạnh mục của nó. Nếu một mục in nhầm lệnh đảo của mục khác thì phép thử vẫn báo xanh.
  file: `tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — chiều đỏ NT3-do chuoi-con chỉ đọc «thoát khác 0», không ghim thông điệp**
  Người dùng thấy gì: Phép thử giả lỗi so nhãn mục kiểu sai chỉ kiểm chương trình có dừng hay không, không kiểm nó dừng vì đúng lý do. Một lỗi khác trong phép thử cũng cho kết quả xanh như bắt được lỗi thật.
  file: `tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **gate-card chép cứng dấu máy thay vì rút từ bên ghi (marker không một nguồn)**
  Người dùng thấy gì: Nhãn đánh dấu việc do máy tự định tuyến được chép ở hai nơi. Hôm nay hai nơi khớp nhau nên người dùng không thấy gì, nhưng nếu sau này đổi một nơi mà quên nơi kia thì nhãn và lệnh đảo trên thẻ sẽ lặng lẽ biến mất.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Pasting the prefilled one-shot adds a duplicate Known-limits bullet to Notes for machine-routed items**
  Người dùng thấy gì: Khi chủ kho dán nguyên dòng lệnh có sẵn trên thẻ để ký, ghi chú của hợp đồng có thể có hai dòng giống nhau cho cùng một giới hạn. Chỉ gây rối mắt, không làm mất hay sai quyết định.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **gate-card silently drops machine routing when dinh-tuyen-may.cjs fails to load, so the card disagrees with lane V**
  Người dùng thấy gì: Nếu bản cài thiếu một tệp, thẻ Cổng 2 sẽ hiện mọi mục máy đã định tuyến như câu hỏi còn mở cho người mà không cảnh báo gì. Chủ kho sẽ thấy thẻ mâu thuẫn với kết quả làn nhanh mà không biết vì sao.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — chiều đỏ NT5-do thieu-nhan kết luận từ mã thoát khác 0 của khong-can-nguoi, không ghim lý do**
  Người dùng thấy gì: Phép thử giả lỗi thiếu nhãn mục chỉ thấy làn nhanh từ chối mà không kiểm từ chối vì lý do gì. Nếu làn nhanh từ chối do một nguyên nhân khác, phép thử vẫn báo là đã bắt được lỗi.
  file: `tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs`
  severity: low
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
