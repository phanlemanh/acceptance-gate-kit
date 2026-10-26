---
schema_version: 1
slug: thuoc-giao-dien-chay-thu-truoc-cham
feature: Thước giao diện tự chứng hai chiều trước lượt chấm — kịch bản đo của eval giao diện được máy chạy thử (đối chứng xanh + chiều đỏ) ở ranh giới làm-xong→chấm; ảnh trùng byte hoặc cao đúng bằng khung nhìn ra cờ vàng; kịch bản dùng chung chỉ tính khẳng định của eval mình
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: park               # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-26T04:22:13Z   # owner gõ «park» một chạm trong phiên 26/10, máy ghi hộ
prototype:
  base_commit:
  disposition:
---

Gốc: crm/_acceptance/o-soan-va-ly-do-loi — E8 đỏ hai lượt liền vì kịch bản đo (lượt 1 kịch bản tự ẩn con trỏ, lượt 2 đọc màu `rgb` trong khi app trả `lab()`); bản vá giữa lượt chấm chỉ chạy chiều đỏ, không chạy chiều xanh; dừng-vá gọi chủ kho một lần
Gốc: crm/_acceptance/duong-ly-do-muc-tieu — E10 đo trên phần tử `display:contents` nên luôn đạt; lượt 1 REJECT riêng vì tìm-lỗi bắt
Gốc: crm/_acceptance/luu-tru-truong-khong-hoi — E10 đo vật thay thế, chiều đỏ in thẳng thông điệp đã ghim mà không qua bộ dò; lượt 1 REJECT riêng
Gốc: crm/_acceptance/the-gop-y-okr — một kịch bản phục vụ E1/E11/E13; tác tử E1 tính khẳng định của E13 vào E1; lượt 1 REJECT riêng
Gốc: crm/_acceptance/ly-do-tu-choi-nop-theo-locale — E9 xanh trên hai ảnh «trước/sau tải lại» trùng từng byte; chỉ làn tìm-lỗi bắt
Số đo: `docs/findings/2026-10-26-bo-cham-giao-dien-dem-lai.md` (đếm lại 32 ca nhóm E tại nguồn, crm `6adaf11e0`).
Hạt giống sinh sau khi xếp lại: `docs/plans/2026-10-26-hat-giong-chay-suite-truoc-luot-cham.md` (nhóm suite đỏ, 22 lượt đốt riêng gỡ được).
Đề nghị mở: phiên phân tích Design OS 26/10, theo câu chủ kho «sửa bộ chấm trước, ghép Design OS để sau».

## Vấn đề & ai gặp

**Người gặp:** phiên thợ ở kho tiêu thụ chạy vòng giao diện (lượt chấm đỏ vì thước của chính vòng, ~66 k
out-tok và ~18 phút mỗi lượt) · chủ kho (lượt gọi ngoài thiết kế khi dừng-vá hoặc vượt trần) · người ký Cổng
Bằng chứng (ký trên ảnh không chứng điều nó nói).

**Cơn đau, đếm lại 26/10** (finding ở trên): 179 vòng giao diện ở crm, 04/09–22/10, trung bình 2,5 lượt chấm;
259 lượt phụ. Bảng triệu chứng ghi «67 % lần eval giao diện đỏ là bộ chấm/hạ tầng». Triage tại nguồn cho thấy:

- Chỉ **11 lượt** bị đốt RIÊNG vì nhóm ấy. Phần kit sửa được là **≈ 5 lượt + 1 lượt gọi chủ kho** trong 7 tuần
  (~2 % số lượt phụ). Phần còn lại thuộc bàn đo của kho (3), khung Workflow (2), hoặc là lỗi thật (1).
- **Thử lại cùng lượt vì hạ tầng cứu 0/12 ca «hạ tầng».** 2 ca «chập chờn» là lỗi hydration có thật. Nới nhãn
  hạ tầng sẽ giấu lỗi sản phẩm.
- **Lỗ về độ tin:** kịch bản đo giao diện không bao giờ vào lượt đối chứng (`baseline:diffBase` chỉ chạy lệnh
  làn máy; kịch bản `rang/` mới không có ở merge-base). Chiều đỏ của chúng chỉ là lời khai của tác giả. Một
  eval xanh trên hai ảnh trùng byte, và 4 kịch bản xanh mà sai, đều chỉ bị làn tìm-lỗi bắt.
- Lớn hơn nhóm này nhiều nhưng **chưa triage**: 87 lượt phụ có suite của kho đỏ, 69 lượt chấm lại sau khi đã PASS.

**Vòng meta:** đây là kit sửa thước của kit (tiền lệ `cham-khong-tu-dot-luot` tự khai là vòng meta). Mốc kho
nhận gần nhất là 2.34.0 (crm nhận ngày 25/10). Trong cửa sổ ấy đã có `design-gate-che-do-chat` mở tới Cổng Phạm
vi (26/10, PR #413 nháp, chuyển MacBook Pro). Luật chiều rộng (b) cho tối đa MỘT vòng meta mỗi cửa sổ, nên
`build` ở đây nghĩa là chủ kho gọi tên vòng này cho cửa sổ, hoặc xếp nó sau mốc kho nhận kế.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Bộ chấm giao diện là chỗ tốn chính của vòng giao diện | Vòng sửa ≈ 2 % lượt phụ, trong khi nhóm lớn hơn nằm yên | Đếm lượt phụ theo nguyên nhân (finding §1, §3) | **Đã thử — sai**: 11/259 lượt riêng, kit sửa được ≈ 5 |
| 2 | Siết nhãn hạ tầng + thử lại cùng lượt cứu được lượt | Vòng làm lại việc 2.18.3/2.18.5 | Gắn nhãn lại 12 ca bằng `lib/nhan-canh-gay.cjs` hiện hành | **Đã thử — sai**: 0/12; 2 ca là lỗi thật |
| 3 | Chạy thử thước hai chiều bằng máy trước lượt chấm bắt được phần lớn ca «kịch bản» | Lỗ độ tin còn nguyên | Triage 13 ca: tự chạy hai chiều có bắt không | **Đã thử — đúng**: 9/13 (2 không, 2 chưa chắc) |
| 4 | Thêm bước chạy thử không đổi phán quyết của kho không có sự cố | Mọi kho trả giá (luật 26/09) | Chưa đo — cả 32 ca chỉ từ crm | Chưa thử |
| 5 | Kho khai được chiều đỏ của kịch bản theo một khuôn kit đọc được | Phải thêm trường schema (CỘNG, cần đường đọc-cũ) | Đếm `evals.yaml` crm: 208/335 eval ui-check có nhắc chiều đỏ, mỗi kịch bản một kiểu cờ | Chưa thử — hình dạng chưa thống nhất |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] Sau khi một kho cài mốc mang vòng này, số lượt chấm REJECT riêng vì kịch bản đo giao diện của chính vòng giảm bao nhiêu, và có eval giao diện nào xanh mà chưa từng đỏ không?
- Kết quả nào là SỐNG: [đề xuất] trên ≥ 15 vòng giao diện kế tiếp ở crm: 0 lượt REJECT riêng vì kịch bản đo (đường nền 7 tuần: 5 lượt / 179 vòng) VÀ mọi eval giao diện có `cmd` mang một dòng chạy-thử hai chiều đỏ-rồi-xanh trên cùng cây; 0 phán quyết đổi ở kho không khai chiều đỏ
- Kết quả nào là CHẾT: [đề xuất] bước chạy thử tự làm REJECT/BLOCKED ≥ 1 lượt mà vật không đổi, hoặc thêm ≥ 1 lượt gọi người mỗi vòng
- Timebox: [đề xuất] 21 ngày sau khi crm nhận mốc

## Kết quả prototype

Không dựng prototype. Phép đo trên lịch sử thật thay cho nó (finding §1–§3).

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Hồ sơ vòng giao diện crm (evidence-report, decisions, run-log, evals, rang/) | crm `_acceptance/*` ở `6adaf11e0` | triết-lý/logic | có (chỉ số đếm và cơ chế; kit công khai, không chép văn bản kho riêng) | — |

## Cổng 0

- **decision = park** Căn cứ: chủ kho gõ «park» 26/10 sau khi đọc số đo ở trên — kit chỉ sửa được ≈ 5 lượt chấm + 1 lượt gọi người trong 7 tuần trên một kho, mở vòng tốn thêm 2 lượt gọi và chiếm suất vòng meta duy nhất của cửa sổ; lỗ độ tin chưa làm sai chữ ký nào.
- **disposition = …** Căn cứ: không có prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** không áp — vòng không mở. Ngưỡng `[đề xuất]` ở trên giữ làm khung cho lần mở lại; mở lại theo khuôn đếm dưới.

**Khuyến nghị của máy: `park`.** Căn cứ: giả định 1 đã thử và sai. Phần kit sửa được là ≈ 5 lượt chấm + 1 lượt
gọi chủ kho trong 7 tuần, trên một kho. Mở vòng tốn thêm 2 lượt gọi chủ kho (Phạm vi · Bằng chứng, ngoài lượt
Đáng này) và chiếm suất vòng meta duy nhất của cửa sổ, trong khi `design-gate-che-do-chat` đang giữ suất ấy.
Theo North Star, «token giảm mà lượt gọi người tăng là thất bại»: 2 lượt gọi để bớt 1 lượt trong 7 tuần là lỗ. Lỗ độ tin
(giả định 3) là thật, nhưng nó chưa làm sai chữ ký nào: 5/5 ca xanh-sai đều bị làn tìm-lỗi bắt trước khi ký.

Lối khác còn sống: **`build` thu hẹp, T2** — chủ kho trả giá 2 lượt gọi để bịt lỗ độ tin, với điều kiện chủ
kho gọi tên vòng này cho cửa sổ (luật (b)). Phạm vi thu hẹp: (1) chạy thử máy hai chiều cho eval giao diện có
`cmd` ở ranh giới S3→S4 — kết quả chỉ là cờ, không phán vật; (2) cờ vàng khi các ảnh của một eval trùng byte
hoặc cao đúng bằng khung nhìn trong khi khai toàn trang; (3) một câu prompt: kịch bản dùng chung thì chỉ tính
khẳng định của eval mình. Vế (1) cần khuôn khai chiều đỏ (giả định 5), tức là CỘNG, nên phải phê ở Cổng Phạm vi.

Việc kế nếu `park` — không phải câu hỏi, máy làm tiếp mà không mở vòng:
1. Triage hai nhóm lớn hơn (87 lượt có suite đỏ, 69 lượt chấm lại sau PASS) bằng đúng cách đã đếm ở finding,
   chỉ đọc. Ghi vào một finding, chưa mở ô.
2. Chuyển cho crm ba việc thuộc bàn đo của kho: một hàm chụp chung biết vùng cuộn của khung trang (22 hồ sơ
   còn gọi `fullPage: true`); cô lập DB dev giữa các worktree; cách bộ chờ ổn định chịu được điều hướng.

Khuôn đếm để mở lại (đếm trên run-log của mọi kho tiêu thụ, mỗi mốc phát hành):
- Số lượt REJECT/BLOCKED riêng vì kịch bản đo giao diện của chính vòng. Mở lại khi ≥ 4 lượt trong 14 ngày
  (gấp đôi nhịp hiện tại), hoặc ≥ 1 kho thứ hai có ca.
- Số chữ ký Cổng Bằng chứng trên một eval giao diện xanh mà về sau chứng là thước sai (dòng `revisit` hoặc
  `da-cham-boi-thuc-te` đỏ trỏ về eval ấy). Mở lại khi ≥ 1.

## Thước đo thành công → ứng viên criterion

- (chỉ khi `build`) Lượt REJECT riêng vì kịch bản đo giao diện / vòng giao diện gộp được → AC chạy thử hai chiều ở S3→S4
- (chỉ khi `build`) Eval giao diện xanh mà chưa từng đỏ trên cùng cây = 0 → AC dòng chạy-thử trong sổ chấm
- (chỉ khi `build`) Kho không khai chiều đỏ: phán quyết không đổi → AC chiều im

## Out of scope từ khám phá

- Nới nhãn hạ tầng / thử lại cùng lượt thêm cho eval giao diện — đã bác bằng số: cứu 0/12 ca, và 2 ca «chập chờn» là lỗi thật bị giấu.
- Xếp hàng tác tử ui TRONG một lượt chấm — đã có PR #389 (theo lựa chọn) và lập trường «tài nguyên độc quyền do thước của kho tự xếp hàng» (`eval-executors.md`); chờ #389 ký rồi đo lại.
- Hàm chụp chung, cô lập DB, bộ chờ ổn định — thuộc bàn đo của kho tiêu thụ; kit không chứa product context.
- Câu người gõ lọt vào tác tử chấm qua khung Workflow (2 lượt) — hạ tầng harness, không phải bộ chấm giao diện.
- Ghép Design OS, sàn thiết kế tĩnh — chủ kho đã tách ra «để sau».
