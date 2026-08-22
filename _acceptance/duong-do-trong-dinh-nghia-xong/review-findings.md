# Review findings — duong-do-trong-dinh-nghia-xong (S4 round 1, một reviewer tươi trên diff `d126bab4..HEAD`)

## Trong hợp đồng

- **Cờ vàng AC-2 chứa `<lý do>` thô không escape → trình duyệt nuốt mất phần «việc phải làm»**
  file: `scripts/gate-card.js` (cờ đường đo) · severity: medium · AC: AC-2
  → **Đã sửa cùng round:** chuỗi thành «bỏ đường-đo — lý do 1 dòng»; DD2 thêm assert «cờ không chứa `<chữ`».
- **`bullets()` chỉ nhận dấu `-`; `* Thước: …` → cờ vàng oan, trong khi reader ngưỡng cùng thẻ nhận `[-*]`**
  file: `scripts/gate-card.js` (`bullets`, hàm có sẵn dùng cho Coverage/Out of scope) · severity: low · AC: AC-1/AC-2
  → **Không mở rộng `bullets()` trong round này** (hàm dùng chung ba section, ma trận cũ ghim); khuôn ghi
  rõ «Bullet dùng dấu `-`»; khai ở Known limits.

## Ngoài hợp đồng — người quyết ở Gate 2

- **Dòng bỏ lệch chính tả («Bỏ đường đo —», không gạch nối) lọt thành đường đo THẬT → thẻ xanh, khối in câu bỏ**
  Người dùng thấy gì: một dấu gạch làm cửa bỏ mở lại đúng lỗ hồ sơ này đi đóng (thiếu đường đo mà thẻ im).
  file: `scripts/gate-card.js` (`ddIsBoLine`) · severity: medium
  Đề xuất: nhận diện dòng bỏ bằng `/^bỏ\s+đường[-\s]đo\b/i` (entry ledger vẫn phải đúng chuỗi mới thành info) + DD2(d). Ngoài hợp đồng vì AC-1 định nghĩa tiền tố đúng chuỗi.
- **Heading tiền tố: `## Đường đo lường` được coi là section Đường đo** — kế thừa luật `\b` của md-section (UAT heading cũng vậy); tính chất thiết kế, nêu để chốt có chủ ý · severity: low.
- **`_Avoid_: metric` đụng từ đang là chuẩn trong kit** (`uat-session/SKILL.md` «Số lấy từ tracking», `morphological-scan` preset `metrics-tree`) — CLAUDE.md bắt tránh từ trong `_Avoid_` khi viết docs → glossary vừa tự tạo vi phạm trên cây hiện có · `CONTEXT.md` · severity: low (AC-7 đòi hai từ có mặt nên không sửa trong round).
  Đề xuất: bỏ «metric» khỏi `_Avoid_` (giữ chú «metric là *thước*»), đổi câu uat-session thành «số lấy từ đường đo đã khai» — một lượt, sau chữ ký hoặc owner veto ngay.
- **Khuôn nói «dòng bỏ VÀ entry», SKILL nói «chỉ entry»** — kết quả thẻ như nhau (entry là thứ thẻ đọc); khác yêu cầu với người viết · severity: low. Đề xuất: khuôn đổi «VÀ» → «(tuỳ chọn) kèm entry — entry mới là thứ thẻ đọc».

## Đã kiểm mà thấy đúng (reviewer)

- Mutant chạy reader thật: DD1–DD4 spawn `gate-card.js` thật trên fixture sinh từ hai khuôn; hằng rút từ nguồn; DD5/6/7 có đối chứng dương trước mutant.
- Đường đọc-cũ: contract cũ không section + opportunity có ngưỡng → cờ vàng không chặn; workspace không `opportunity.md` → không cờ mới, không đụng Cổng 2.
- SKILL S1#7 «CỘNG thứ 6» theo đúng mẫu câu input 5; CONTEXT.md đúng khuôn term.
