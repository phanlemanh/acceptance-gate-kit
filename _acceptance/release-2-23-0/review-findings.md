# Review findings: release-2-23-0

## Trong hợp đồng

Không có finding nào map được vào AC của hợp đồng này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **New fixtures and the bộ răng leave temp dirs behind (measured 3,674 gg-* dirs, 1.2 GB)**
  Người dùng thấy gì: Mỗi lần chạy kiểm thử hoặc ghim lại, bộ đo để lại hàng nghìn thư mục tạm, hiện đã chiếm hơn 1 GB đĩa trên máy này. Dùng lâu ngày ổ đĩa của người chạy sẽ đầy dần mà không ai hay.
  file: `_acceptance/gia-lan-ghim-lai/rang/ban-sao.mjs`
  severity: medium
  Đề xuất: new-contract

- **repin-lane.mjs header contract is stale: no exit 4 / 128+n, no --tran-phut, and «env hiện tại» is no longer true**
  Người dùng thấy gì: Lời giải thích ở đầu công cụ ghim lại còn thiếu một mã kết quả mới và một tuỳ chọn mới, nên ai chỉ đọc phần đó sẽ hiểu sai cách dùng. Phần hướng dẫn chính thức đã cập nhật đúng.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **The «lệch kỳ vọng» predicate now has a third hand-written copy**
  Người dùng thấy gì: Cùng một quy tắc phán đoán đang được viết tay ở ba chỗ. Hôm nay chúng khớp nhau, nhưng nếu sau này chỉ sửa một chỗ thì việc chạy lại và việc chốt kết quả có thể kết luận khác nhau.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **Scalar form of model_evals / repin_ci_blank_env is silently dropped: model evals get re-run, CI-like env silently off**
  Người dùng thấy gì: Nếu người dùng khai thiết lập bằng một giá trị đơn thay vì danh sách, công cụ lặng lẽ bỏ qua, không báo lỗi. Hậu quả là kiểm thử dùng mô hình thật bị chạy lại chọn lần đẹp hơn, hoặc lỗi chỉ xuất hiện trên CI vẫn hiện xanh.
  file: `feature-loop/scripts/lib/lan-khoa.mjs`
  severity: medium
  Đề xuất: new-contract

- **doChiPhi takes the first numeric token: thousands separators and leading numbers give a wrong cost delta with no warning**
  Người dùng thấy gì: Nếu lệnh đo chi phí in số có dấu phân cách hàng nghìn hoặc có số khác đứng trước, con số chi phí báo cho người quyết định sẽ sai mà không có cảnh báo. Mức chênh lệch trông hợp lý nên dễ bị tin nhầm.
  file: `feature-loop/scripts/lib/lan-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **A large lane budget overflows setTimeout and triggers vuot-tran (exit 4) right away**
  Người dùng thấy gì: Nếu ai đó đặt trần thời gian cho một lượt ghim lại ở mức rất lớn để ý nói không giới hạn, mọi lượt sẽ bị dừng ngay lập tức và báo vượt trần. Chỉ xảy ra khi đặt con số cực lớn.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — Assertion âm-tính-một-mình: phép vi phân AC-7 chỉ so BASE==SAU, không có đối chứng dương cho kết cục từng kịch bản; recheck bị bỏ im lặng**
  Người dùng thấy gì: Phép so sánh trước-sau của làn ghim lại có thể báo xanh dù kịch bản thực ra chưa chạy đúng, ví dụ khi tín hiệu ngắt chưa từng được gửi. Người ký có thể tin vào một màu xanh rỗng.
  file: `_acceptance/gia-lan-ghim-lai/rang/vi-phan.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 1/2 — AC-6 rút danh sách khoá từ khối LAN-KHOA, mà bộ đọc thật (docKhoa) không dùng khối đó**
  Người dùng thấy gì: Danh sách các khoá cấu hình ghi trong tài liệu và danh sách mà công cụ thật sự đọc là hai bản riêng. Thêm một khoá mới mà quên cập nhật tài liệu thì kiểm thử vẫn xanh.
  file: `feature-loop/scripts/lib/lan-khoa.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 — Chiều đỏ của E1–E6 và chiều xanh của E7 đo bản archive cố định SAU-GIA, không đo cây đang kiểm**
  Người dùng thấy gì: Bộ đo kiểm tra lỗi dùng một bản chốt cố định thay vì cây đang kiểm. Hôm nay hai bản giống nhau nên chưa sai, nhưng sau này nếu bài kiểm bị làm yếu đi mà không đánh dấu thì bộ đo có thể không nhận ra.
  file: `_acceptance/gia-lan-ghim-lai/rang/chan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5+4 — Chiều đỏ AC-7 hứa mỗi khoá một bản sao + ghim «đổi mặc định: <khoá>» / «thêm ngoài danh sách»; ma trận chỉ có 3/5 khoá, ghim là mảnh vi phân hoặc chính chuỗi tiêm**
  Người dùng thấy gì: Tài liệu hứa mỗi khoá cấu hình đều có phép thử gây lỗi riêng, nhưng thực tế chỉ 3 trong 5 khoá có. Người đọc có thể tưởng độ phủ đầy đủ hơn thực tế.
  file: `_acceptance/gia-lan-ghim-lai/rang/ma-tran.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2/3 — Round-trip khuôn REPIN-TEMPLATE chỉ so khoá tầng ngoài; trường lồng không được đo (writer ghi tong_ket.chi_phi_loi ngoài khuôn; chap_chon[].lenh không ca nào ghim)**
  Người dùng thấy gì: Phép kiểm khuôn dòng ghi lại chỉ soi lớp ngoài cùng, nên một số trường bên trong có thể bị thiếu hoặc thừa mà không ai phát hiện. Hậu quả là sổ ghim lại có thể thiếu thông tin mà kiểm thử vẫn xanh.
  file: `tests/scripts/repin-lane-khuon-gia.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — «Bảng chân trị viết trước» của AC-1 nằm trong chính module được đo; ca đọc kỳ vọng từ vật**
  Người dùng thấy gì: Bảng đáp án dùng để kiểm quy tắc chạy lại nằm cùng chỗ với chính quy tắc đó. Nếu ai sửa cả hai cùng lúc theo hướng sai thì kiểm thử vẫn xanh.
  file: `tests/scripts/repin-lane-chay-lai.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — AC-4 hứa hai ô lỗi của lệnh đo chi phí («thoát 1 / không in số»), ca chỉ phủ một ô**
  Người dùng thấy gì: Khi lệnh đo chi phí chạy xong nhưng không in ra con số nào, không có phép kiểm nào xác nhận thông báo lỗi hiện đúng. Trường hợp này chưa được kiểm thử.
  file: `tests/scripts/repin-lane-tran.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
