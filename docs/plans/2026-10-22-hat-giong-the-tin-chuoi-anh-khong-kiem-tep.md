# Hạt giống — thẻ Cổng Bằng chứng báo «có ảnh» mà không kiểm tệp ảnh có thật

Gốc: `acceptance-gate-kit/_acceptance/lop-bang-chung-nhin-thay/` — luật đọc lớp nhìn-thấy ở Cổng Bằng chứng dựng ở hồ sơ
ấy (AC-4), và ca LNT4(b) của nó ghim đúng chỗ hở. Quan sát thật: một kho tiêu thụ riêng tư, đo 22/10 (số ở mục dưới, đã
ẩn danh — tên kho, tên hồ sơ và đường máy không chép vào kho công khai). Ô ghi hạt giống này:
`_acceptance/phat-hien-den-duoc-nguoi-ky/` (cùng lớp: người ký tin rằng đã nhìn hết; ô ấy trích lại tên tệp, luật VC8).

## Người dùng gặp gì

Người ký Cổng Bằng chứng đọc trên thẻ dòng «Bằng chứng lớp nhìn-thấy: n eval ui-check đạt — xem frame ở trang bằng
chứng», rồi mở trang bằng chứng và không thấy ảnh nào, hoặc không có trang. Thẻ nói đã có mắt nhìn màn thật; người ký ký
trên lời khai đó, trong khi thứ duy nhất máy đã kiểm là một dòng chữ trong báo cáo.

## Đọc mã (kit, `main` 144cfd0f)

- `scripts/gate-card.js:1073` — một eval ui-check «đạt» khi block của nó có `exit_code: 0` và trường `screenshot:` khác
  rỗng. Không bước nào kiểm tệp ở đường đó có tồn tại trong hồ sơ.
- `scripts/gate-card.js:1432` — từ đó thẻ in «xem frame ở trang bằng chứng».
- `tests/plugins/lop-nhin-thay.test.mjs` ca LNT4(b) — đối chứng dương dựng báo cáo với `screenshot: evidence/E10-step1.png`
  mà không ghi tệp ảnh nào, và chờ thẻ in «1 eval ui-check đạt». Bộ kiểm của kit đang ghim chỗ hở thành hành vi đúng.

## Số đo (một kho tiêu thụ, 22/10, 199 hồ sơ có giao diện)

- 293 trường `screenshot:` trên các hồ sơ đã ký; 258 trỏ tới tệp có trong hồ sơ. 26 trỏ ra thư mục tạm của lượt chấm hoặc
  đường tuyệt đối trên một máy khác; 9 mang tên không khớp tệp nào.
- 2 hồ sơ đã ký được thẻ tính «có bằng chứng nhìn-thấy» mà hồ sơ không chứa tệp ảnh nào.
- Ở các vòng chạy qua điều phối: 42 hồ sơ thẻ tính «có ảnh», 33 có trang bằng chứng hiện ảnh, 5 không có trang, 4 có trang
  mà không ảnh.

Chưa đo: kho tiêu thụ thứ hai; bên viết đường tạm (bộ chấm ui-check ghi vào thư mục lượt chấm rồi không chép về hồ sơ, hay
phiên viết lại báo cáo).

## Ngưỡng mở ô

≥ 1 lần nữa người ký báo đã ký trên thẻ «có ảnh» mà trang bằng chứng không hiện ảnh nào, ở bất kỳ kho nào.

## Trạng thái

22/10: ngưỡng đạt (chủ kho báo lỗi gặp thêm ở máy M5, qua phiên giám sát đợt) → vòng `_acceptance/anh-co-that-trong-ho-so/`
sửa bên đọc (thẻ + trang), ký Cổng Bằng chứng 22/10. Phần còn lại: bên viết (mục «Chưa đo») và hai chỗ lệch ở
`docs/plans/2026-10-22-hat-giong-anh-co-that-con-lai.md`.
