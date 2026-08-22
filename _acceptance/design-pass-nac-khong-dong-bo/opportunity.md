---
schema_version: 1
slug: design-pass-nac-khong-dong-bo
feature: design-pass nấc không đồng bộ — người chọn hướng trên vật nhìn được, không phải hẹn giờ ngồi xem; bước phân kỳ có điều kiện + thang phản ứng 4 nấc
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Nghi thức S1-D (`design-pass`, không đổi từ 2.2.0 tới 2.3.0) đòi owner ngồi xem đồng bộ 30–60 phút mỗi vòng — đắt tới mức hồ sơ b1 của artifact-platform **bỏ luôn nghi thức** bằng entry descope có tên (18/08, `d-20260818T144534Z-14963`); một nghi thức bị bỏ khi người ta thành thật là mặc định sai. Đồng thời vòng lặp **không có bước phân kỳ rẻ**: với bề mặt mới, hướng do máy quyết bằng chữ trong design-doc trong khi chỉ owner biết «đúng». Người trả giá: owner (giờ ngồi xem, hoặc duyệt UI bằng chữ) và máy (làm lại khi hướng lệch lộ muộn). Bằng chứng thực địa: b1 18–19/08 (descope → ván thử lệch có tên → owner quyết trên ảnh bề mặt thật chứ không trên canvas); teardown huashu-design 20/08; đọc toàn văn skill `/design` 20/08. Đề bài đầy đủ: `docs/plans/2026-08-19-hat-giong-design-pass-nac-khong-dong-bo.md` (mục 3 nghi thức sau khi đổi · 3b sáu điều vay · 4.3 kết quả ván thử b1).

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Owner phản ứng thẩm mỹ được trên ảnh / canvas / vật bấm được mở lúc rảnh, không cần ngồi cạnh máy | nghi thức async chỉ đẩy phiên đồng bộ sang chỗ khác — số lần gọi người không giảm | một ván thử ở repo tiêu thụ, đếm số lần phải mời sync | Thử dở ở b1: không cần sync (số 3); chấm chọn-hướng chưa được trả lời |
| 2 | Ảnh / canvas đủ nét để chọn hướng; độ lệch canvas ↔ ruột tạm nhỏ và đo được | owner chọn trên bản chép, tới Cổng 1 mới thấy sản phẩm khác | số đo 2 (một dòng liệt kê điểm khác) mỗi ván | b1: lệch nhỏ (thứ tự ba ô so sánh; ảnh thẻ giữ chỗ) |
| 3 | Rule đáng-log («≥2 hướng mà máy không tự chắc») không bị máy tự kê «chỉ 1 hướng» để né bước | cửa miễn bị lạm dụng đúng như huashu phải đóng 07/18 | vết một dòng bắt buộc khi bỏ; đếm số lần bỏ-phân-kỳ bị owner veto | Chưa thử |
| 4 | Bước phân kỳ hỏi đúng tầng — b1 cho thấy owner quyết «plugin có đáng tồn tại» trên ảnh bề mặt thật, trong khi canvas hỏi «phiếu khuyên đứng đâu» | canvas tiêu giờ máy cho một câu hỏi đã chết | mở phân kỳ bằng ảnh bề mặt thật hiện có TRƯỚC khi bày hướng mới | Chưa thử (bài học b1) |
| 5 | `/design` preview đủ ổn để là vật dựng có tên trong thang, không phải phụ thuộc | thiếu `/design` rơi về nấc file-local hoặc khuyên-một-hướng vẫn chạy được | chạy một ván ở nấc thấp | Chưa thử |
| 6 | Có một ván thử kế (feature chạm UI ở repo tiêu thụ) trong timebox để Cổng Giá trị có số — ô này là vòng kit tự-dùng, người dùng cuối là owner/PM repo tiêu thụ | Cổng Giá trị treo vô hạn như `duong-do-trong-dinh-nghia-xong` (lỗ «vòng kit tự-dùng không có chặng bàn giao», chưa có ô) | khai thẳng trong Ngưỡng: phiên nghiệm thu = ván thử kế; timebox = hết ván mà không có số thì `park` | Chưa thử — 22/08 chưa có ứng viên |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: Trên MỘT feature chạm UI ở repo tiêu thụ, owner chọn được hướng mà không phải ngồi xem đồng bộ — đo bằng số lần gọi người từ mở bước phân kỳ tới tin mời Cổng 1, hình thức từng lần (sync/async), và đường lệch canvas ↔ bản thật khi tới Cổng 1.
- Kết quả nào là SỐNG: ≤ 2 lần gọi người, cả hai không đồng bộ (sync chỉ khi owner opt-in có tên); chấm chọn-hướng được trả lời thật trên vật nhìn được; Cổng 1 không trả lại vì «sản phẩm khác canvas»; bề mặt phải giữ đồng bộ với code vẫn = 1; số thứ S4 đo trên DOM thật không giảm so với vòng gần nhất cùng repo.
- Kết quả nào là CHẾT: phải mời sync ≥ 1 lần không do owner chọn, HOẶC owner chọn hướng trên canvas rồi Cổng 1 trả lại vì bản thật lệch, HOẶC máy kê «chỉ 1 hướng» để né bước phân kỳ và bị owner veto ≥ 1 lần trong ván — bất kỳ một cái nào là chết.
- Timebox: hết ván thử kế đầu tiên (feature UI kế tiếp ở repo tiêu thụ), muộn nhất 2026-09-30; tới hạn chưa có ván nào chạy trọn → `decision: park`, không để Cổng Giá trị treo.

## Kết quả prototype

Ván thử b1 (artifact-platform, `trang-tu-van-v2-r4-b1`, 19/08, lệch có tên so với skill 2.2.0): máy mất **17 phút** từ lúc mở bước phân kỳ tới khi có ruột tạm bằng component thật + 30 ảnh ma trận 14 state × 2 khổ; canvas 6 artboard / 2 trang, mỗi hướng có động cơ + đánh đổi, câu hỏi đóng ghim trên vật; **không cần phiên đồng bộ**; độ lệch canvas ↔ ruột tạm nhỏ. **Chấm chọn-hướng không được trả lời**: owner bỏ nhánh b1 và plugin Trang tư vấn sau audit «Bảy bề mặt» (descope gate1 `d-20260819T075116Z-20700`) — ván dừng ngoài ý muốn, không phải do timebox. Số đo 1 (số lần gọi + phút owner) chưa có.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Luật «chọn khi chưa thấy vật là chọn vô hiệu» · cổng vật-hoá thành file có ngưỡng + cửa thoát khai báo · thang hạ cấp khai bất biến · «tiếp cho phép sang bước sau, không cho phép bỏ cổng trong bước» | huashu-design (alchaincyf, MIT; teardown 20/08, sổ nhớ `huashu-design-teardown`) | triết-lý/logic | có | — |
| Thư viện 60 phong cách · ba subagent song song · hook chặn render · watermark · pipeline deck/video | huashu-design | ngôn-ngữ-thiết-kế/hình-thái + cơ chế riêng | không | — |
| Kỷ luật phương án (trục có tên · động cơ + đánh đổi mỗi hướng · tên ổn định · độ nét đủ quyết) · ba kênh phản ứng (note ghim · comment thread · owner sửa-rồi-Save → máy extract-diff) · thang 4 nấc | skill `/design` (Claude Design preview trong Claude Code, nạp toàn văn 20/08; sổ nhớ `design-canvas-cho-buoc-phan-ky`) | triết-lý/logic | có | — |
| Định dạng `.dc.html` / `canvas.json` / payload editor / bước 0 «match pixel-perfect» | skill `/design` | hình-thái + cơ chế riêng | không — kit chỉ gọi tên nấc, không phụ thuộc | — |
| Canvas «Phiếu khuyên b1 — cổng phân kỳ» + `design-pass.md` của b1 | artifact-platform, nhánh `claude/dreamy-burnell-b3b8fb` (e5268ef6f) | bằng chứng ván thử (số đo), không phải vật liệu kế thừa | chỉ số đo | — |

## Cổng 0

> 2026-08-22 — owner xem thẻ Cổng Đáng, chọn **khám thêm trước khi ký** (không
> điền `decision`; ô đứng chờ Cổng Đáng). Vật liệu khám thêm gom ở
> `discovery/phien-huashu-2026-08-22.md` (toàn bộ phân tích + hình của phiên
> «Phân tích skill Huashu Design»). Lưu ý luật kit: `decision: iterate` ở cổng
> này được máy quét xếp vào S1 như `build` — «khám thêm» = chưa ký, không phải
> ký `iterate`.

- **decision = …** Căn cứ: …
- **disposition = …** Căn cứ: ô này không có prototype code trong kit (ván thử sống ở repo tiêu thụ) — …
- **Phiên nghiệm thu ở đâu:** ván thử kế ở repo tiêu thụ (lệch có tên trên engine đã đổi) — số đo là năm thước dưới; không có ván trong timebox thì Cổng Giá trị không có gì để đọc.
- **Ngưỡng UAT chốt cùng lúc ký:** …

## Thước đo thành công → ứng viên criterion

Năm thước của đề bài (mục 1 hạt giống), mỗi thước phải thành một dòng trong ô «Đường đo» của contract ở S1:

- Số lần gọi người từ S1-D đến Cổng 1 và **hình thức** từng lần (đích: hai chấm, cả hai không đồng bộ; sync chỉ khi opt-in có tên).
- Số bề mặt phải giữ đồng bộ với code (đích: 1 — canvas là nhánh cụt, không phải bề mặt thứ hai).
- Số skill thiết kế phải nuôi: kit giữ 1 nghi thức + 1 sàn; repo tiêu thụ −1 (`interactive-prototype` xếp kho sau).
- Thứ S4 đo được trên DOM thật **không giảm**.
- Thời gian lịch từ mở bước phân kỳ đến tin mời Cổng 1 (đổi giờ-người lấy thời-gian-lịch là đánh đổi phải nhìn thấy số).

## Out of scope từ khám phá

- Không tạo skill mới, không «nghi thức canvas» riêng — bác vì «chỉ TRỪ không CỘNG» và luật một mặt phẳng làm việc.
- Không để kit phụ thuộc `/design` (preview, cần quyền tổ chức) — bác: thang 4 nấc thay cho phụ thuộc.
- Không đưa canvas / ảnh / cảm giác bấm vào chuỗi bằng chứng — bác: S4 đo DOM thật, canvas đọc ngược là dữ liệu không tin.
- Không gộp chấm chọn-hướng và Cổng 1 vào một tin — bác (owner 11–12/08: khuôn nhiều chỗ trống vẫn là nhiều quyết định).
- Không hard-gate 100% «ba phương án» kiểu huashu — bác: thành trạm thu phí với bề mặt theo khuôn; vết một dòng + veto-default thay thế.
- Xếp kho `interactive-prototype` ở repo tiêu thụ là việc của repo sau khi kit phát hành — không thuộc ô này.
- Không đổi lưới trước-merge, phép đo, workflow S4 — ô này là đổi LỜI một skill + thẻ Cổng 1 đọc thêm một khoá (đường đọc-cũ: thiếu khoá → cờ vàng).
