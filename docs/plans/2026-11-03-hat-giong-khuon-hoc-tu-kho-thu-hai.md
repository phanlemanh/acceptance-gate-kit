# Hạt giống — bốn cơ chế khuôn học từ kho thử thứ hai

Gốc: acceptance-gate-kit/_acceptance/khuon-loi/ — vòng «Khuôn lõi» (KH1); bốn ý dưới đây rút từ khảo sát kho thử thứ hai
ngày 03/11 ([finding](../findings/2026-11-03-ban-do-khuon-quy-hang-va-ke-hoach-kit.md) §6, §7 vế V3).
Chân sổ: ô park `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tên tệp này. Ghi hạt giống, không mở ô (luật «ô chỉ
mở khi có neo ngoài»; meta-work đóng băng tới mốc).

Mỗi ý là một cơ chế đã CHẠY THẬT ở kho thứ hai bằng mã riêng của kho. Nó chưa vào kit vì mới một kho dùng: phép thử
«kho không có sự cố này được gì, mất gì» chưa có số ở kho nào khác.

## H0 — bộ đọc hiểu `ngoai_le` không `khoi` là «tệp rời nhóm» (vế V0 của finding)

Mục này KHÁC bốn mục dưới: nó đã có neo ngoài và chỉ chờ mốc. Chủ kho quyết 03/11 «Cắt trước»: 2.37.0 cắt như đang có,
vá ở bản kế.

- **Người dùng gặp gì:** kho viết dòng ngoại lệ `{tep, ly_do}` không có `khoi` để đưa tệp ra khỏi một nhóm có glob rộng.
  Bộ chấm kit bỏ qua dòng ấy, nên báo «thuộc hai nhóm màn» hay «thiếu khuôn». Đo trên bản sao kho thứ hai: 10 lệch mới và
  6 nợ cũ, cả 16 đều oan (finding §5.2).
- **Hướng:** trong `nhomCuaTep` (`scripts/ban-do-khuon.cjs`), bỏ nhóm có `ngoai_le` không `khoi` trỏ đúng tệp. Khuôn tệp
  nói rõ hai nghĩa của `ngoai_le`. Ca đỏ và im dựng kho mẫu theo HÌNH DẠNG kho thứ hai, tên giả. Giả lập: 16 → 0; kho thứ
  nhất 0 → 0 (mọi dòng của nó có `khoi`).
- **Neo ngoài:** hồ sơ tạo bản đồ của kho thứ hai, đã ký (sha `e4caaed` của kho ấy), cùng số đo §5.2.
- **Ngưỡng mở:** mốc 2.37.0 đã cắt — mở ngay, không chờ thêm số.

## H1 — ngoại lệ có hạn gắn slug hồ sơ

- **Người dùng gặp gì:** ngoại lệ của bản đồ khuôn sống mãi. Màn «sẽ chuyển sang khuôn ở hàng N» nằm trong danh sách ngoại
  lệ, và không ai nhắc khi hàng N đã xong.
- **Kho thứ hai làm:** dòng `{tep, han: <slug>, ly_do}`. Hồ sơ `<slug>` đã ký mà màn chưa chuyển thì đỏ «hạn đã tới».
  Slug không có trong lộ trình thì đỏ «hạn lạ». Đang dùng 11 dòng ở 5 nhóm.
- **Hướng cho kit:** hết hạn đọc từ trạng thái `_acceptance/<slug>/contract.md`. Cơ chế này thuần kit, không cần lộ trình
  của kho. Lưu ý: kho thứ hai gọi trạng thái ấy là «đã gộp» trong khi nó chỉ là ĐÃ KÝ. Kit dùng chữ «đã ký», hoặc đọc gộp
  thật từ nhánh chính (`dieu-phoi/scripts/do-gop.mjs`).
- **Ngưỡng mở:** một kho khác khai ngoại lệ kiểu «chuyển ở hàng N» bằng lời trong `ly_do` từ 3 lần trở lên, hoặc một
  ngoại lệ quá hạn bị người thấy khi dùng (một dòng sổ lệch lọt).

## H2 — ảnh chuẩn ghim commit

- **Người dùng gặp gì:** ảnh đối chiếu cũ dần mà không ai biết nó chụp từ bản nào.
- **Kho thứ hai làm:** mỗi tấm ảnh chuẩn có một dòng kê gồm địa chỉ, khổ, sáng hay tối, và sha 40 ký tự. Bộ kiểm đòi đủ
  số tấm, đọc bề rộng PNG đúng khổ, và mỗi tấm đúng một dòng kê.
- **Hướng cho kit:** gắn vào khuôn kế hoạch đối chiếu của vòng 2. Thêm một trường `commit` cho mỗi ảnh mẫu, và một phép
  kiểm khổ.
- **Ngưỡng mở:** vòng 2 «Chọn khối ở cổng» mở, và một kho khác có ảnh mẫu dùng lại qua từ 2 vòng trở lên.

## H3 — tìm kit khi thiếu `CLAUDE_PLUGIN_ROOT`

- **Người dùng gặp gì:** lệnh trong `_acceptance/config.yaml` viết `${CLAUDE_PLUGIN_ROOT}/scripts/…`. Tác tử chấm, shell
  thường và CI không có biến ấy, nên eval «không chạy được».
- **Kho thứ hai làm:** một lệnh nhỏ đọc sổ plugin đã cài và chọn bản đúng, không đoán thư mục cache.
- **Hướng cho kit:** một lệnh `kit-root` (hoặc khối trong `lib/`) do kit giữ, và `config.yaml` mẫu gọi qua nó.
- **Ngưỡng mở:** một kho khác tự viết lại lệnh này, hoặc một lượt chấm đỏ vì thiếu biến.

## H4 — `design_pass.proto_route` là mẫu cố định

- **Người dùng gặp gì:** mẫu `/proto/{slug}` không khớp kho đặt trang mẫu sống ở đường khác. Hồ sơ phải tự ghi đường
  thật, và trang bằng chứng có thể trỏ đường chết.
- **Kho thứ hai làm:** ghi Ngoài-N «đường mẫu không có trong ứng dụng»; hồ sơ hệ bố cục dùng đường riêng.
- **Hướng cho kit:** `design-pass` đọc đường từ `mau_dang_chay.duong` của nhóm khi có bản đồ, và chỉ rơi về
  `proto_route` khi không có. Gộp với hạt giống [vòng đời bản mẫu](2026-11-01-hat-giong-vong-doi-ban-mau.md).
- **Ngưỡng mở:** cùng ngưỡng với hạt giống vòng đời bản mẫu.
