# Review findings: nen-khong-tinh-tep-cua-vong (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Phần expected của eval mô tả khác với cái phép đo thực sự kiểm (thước lệch hạng mục)**
  Người dùng thấy gì: Lời mô tả trong bộ kiểm có vài chỗ ghi tên ví dụ khác với ca thật đang chạy. Người đọc hồ sơ có thể hiểu lệch một chút, nhưng hành vi của đường nền với người dùng không đổi.
  Căn cứ: Hậu quả nhẹ: chỉ làm người đọc hồ sơ hiểu nhầm tên ví dụ, không ảnh hưởng nền chạy, không mất dữ liệu, và sửa câu chữ sau này rất rẻ.
  file: `_acceptance/nen-khong-tinh-tep-cua-vong/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **SKILL S1#0 mô tả «Dòng vàng» rộng hơn vị từ thật («đường mang slug»)**
  Người dùng thấy gì: Hướng dẫn cho phiên làm việc nói rằng mọi tệp mang tên vòng đều thành dòng vàng, nhưng thực tế chỉ bốn loại tệp được vàng. Phiên đọc hướng dẫn có thể tưởng nền đỏ trên một tệp như vậy là lỗi hạ tầng.
  Căn cứ: Hậu quả nhẹ: chỉ gây hiểu nhầm khi đọc hướng dẫn, nền vẫn đỏ đúng chiều an toàn, người dùng tra lại khuôn là rõ, sửa một câu rất rẻ.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Dòng đổi tên trong porcelain chỉ xét đường MỚI: một tệp ngoài vòng bị đổi tên vào đường của vòng sẽ bị giấu im**
  Người dùng thấy gì: Nếu bước kiểm thử dời một tệp có sẵn của kho vào thư mục của vòng, nền sẽ chỉ báo vàng thay vì đỏ, nên việc mất tệp gốc đó không bị báo động. Chỉ xảy ra khi bước kiểm thử tự đổi tên tệp, rất hiếm.
  Căn cứ: Hậu quả thấp vì ca hiếm và tệp vẫn còn trong lịch sử nên tự khôi phục được; nhưng là chiều lọt đỏ thành vàng nên nên ghi rõ thành giới hạn đã biết.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: low
  Đề xuất: known-limits

- **Đường bị git đặt trong ngoặc kép (non-ASCII, ký tự đặc biệt) không bao giờ khớp vị từ, nên tệp của chính vòng vẫn bị báo đỏ CAY BAN**
  Người dùng thấy gì: Tệp của vòng có tên tiếng Việt có dấu hoặc ký tự đặc biệt vẫn bị báo đỏ như cũ, nên nền có thể đỏ dù hạ tầng lành. Người dùng chỉ thấy báo động giả như trước, không có đỏ nào bị giấu.
  Căn cứ: Hậu quả nhẹ và an toàn: chỉ là báo động giả như trước vòng này, tên hồ sơ của kit thường không có dấu, người dùng nhận ra và chạy lại được.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp, chỉ có điểm-case): luật «lưới tự giải thích mã thoát» có ba vế mà ca đo chỉ phủ một vế**
  Người dùng thấy gì: Bộ kiểm chỉ chứng minh một trong ba điều kiện để lưới trước-merge được coi là tự giải thích. Nếu hai điều kiện kia bị sửa hỏng, bộ kiểm hiện tại vẫn xanh.
  Căn cứ: Hậu quả vừa nhưng gián tiếp: không ảnh hưởng người dùng hôm nay mà chỉ làm bộ kiểm kém nhạy với sửa đổi sau này; thêm hai ca kiểm là rẻ nhưng thuộc việc nâng thước, nên tách riêng.
  file: `tests/scripts/duong-nen.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (chỉ assert «chuỗi có mặt» trong khi lời hứa là quan hệ): thông điệp đột biến của NEN-TV6 được ghim bằng chuỗi con của bản in cả tệp**
  Người dùng thấy gì: Bộ kiểm các lỗi cố ý chỉ xác nhận tên tệp có xuất hiện đâu đó trong báo cáo, không xác nhận nó nằm đúng mục vàng. Một lỗi thật có thể vẫn bị coi là đã bị bắt.
  Căn cứ: Hậu quả vừa, chỉ ảnh hưởng độ tin của bộ kiểm chứ không ảnh hưởng nền chạy; bốn lỗi cố ý vẫn đỏ đúng chiều, nên chấp nhận và ghi giới hạn rồi siết sau.
  file: `tests/scripts/duong-nen.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): GN-TV3 kiểm «không có TEP CUA VONG trên thẻ Cổng 2» trong khi Cổng 2 không có đường nào in dòng của duong-nen.md**
  Người dùng thấy gì: Phép kiểm nói thẻ Cổng 2 không in dòng tệp của vòng, nhưng thẻ vốn không bao giờ in dòng đó, nên phép kiểm xanh dù có hay không bộ lọc. Người dùng vẫn thấy thẻ đúng như mong đợi.
  Căn cứ: Hậu quả nhẹ: thẻ hiện đúng với người ký hôm nay, chỉ là phép kiểm này chưa chứng minh được bộ lọc có tác dụng; thêm đối chứng sau này là rẻ.
  file: `tests/scripts/ntr-the-canh-gay.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/7 lỗi rơi vào file không bộ đo nào phủ (_acceptance/nen-khong-tinh-tep-cua-vong/evals.yaml, feature-loop/skills/feature-loop/SKILL.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
