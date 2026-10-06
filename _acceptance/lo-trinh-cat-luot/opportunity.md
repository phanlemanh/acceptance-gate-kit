---
schema_version: 1
slug: lo-trinh-cat-luot
feature: Lộ trình vào kit, lát 2 — skill cắt lượt biến một bản phạm vi (mã, mốc ngoài, đợt) thành hàng theo khuôn của lát 1 cùng bảng phủ, theo sáu luật rút từ ba lộ trình owner đã viết; răng duy nhất «mỗi mã nằm ở đúng một hàng hoặc chân trời»; kit KHÔNG ghi file ý định của kho
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-06T14:27:12Z   # owner gõ «làm, mở vòng sau khi cắt 2.24» một chạm trong phiên 06/10, máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

> Mở 06/10 theo thứ tự bốn bước owner gật 06/10 (nâng plugin 2.23.0 · phiên nghiệm thu lát 1 · mở ô
> lát 2 · ký Cổng Đáng lát 2). Lát 1 (`viec-ke-theo-plan`) nhận verdict **iterate** cùng ngày, và
> owner chọn đưa phần sửa của nó vào ô này thay vì mở vòng riêng — xem giả định 2. Hạt giống:
> `docs/plans/2026-09-06-hat-giong-viec-ke-theo-plan.md` §«Cập nhật 02/10» mục 4 (lát 2) và mục 8.

## Vấn đề & ai gặp

Gốc: crm/_acceptance/khung-okr-truoc-r1 — hồ sơ hàng R1a, `decided_by` ghi «chốt lộ trình "lên trước 14/10" ngày 04/10»: một trong 19 hàng owner cắt TAY trong lượt cắt 04/10 (crm `729a1ab80`)

Lộ trình crm lớn nhanh hơn tốc độ một người cắt tay. Số đo trên crm `origin/onehub` `ccbaf7068`
(06/10), đọc từ git của hai tệp ý định:

- **OKR 32 → 62 hàng trong ba ngày** (`lo-trinh-okr.json` lúc nhận kit 2.21.0, `592cae648` 03/10
  20:00 +07, tới `1dc8ffe0c` 06/10 10:19). Kho tài liệu 11 → 13.
- **Hai lượt cắt tay trong một buổi sáng 04/10:** `3e80edc29` 09:33 thêm 9 hàng (dãy Kara MK/KN/KG/K0,
  K1–K5); `729a1ab80` 11:11 thêm 17 hàng OKR + 2 hàng Kho («cả CRM cho mọi phòng ban trước 14/10»,
  làn R1 tám hàng), cùng lượt sửa ý định 8 hàng cũ (`cau_giao` 4 · `dung_tren` 4 · `ma` 1). 06/10 thêm 4
  hàng F9–F12.
- **Bảng phủ vẫn chép tay và đã cũ:** mục 8 `docs/plan/lo-trinh-okr.md` phủ 78 mã của mười lượt đầu,
  tệp sửa lần cuối 03/10 (`841717c70`); 30 hàng thêm từ 04/10 không qua bảng phủ nào. Bản phạm vi
  của lượt cắt 04/10 (`de-xuat-lo-trinh.md`, ô `khung-okr-truoc-r1` trích mục A1) không có trong git
  crm — đầu vào của lượt cắt không được giữ.

Người trả giá: owner, mỗi lần một đợt phạm vi mới tới (từ đội sản phẩm, từ một vòng khảo sát) phải
tự viết câu giao, hạng, thứ tự đứng-trên cho hàng chục hàng rồi tự soát phủ mã bằng mắt; và mọi phiên
mở vòng từ hàng ấy, vì hàng cắt sai thì vòng mở trên câu giao sai.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Giá trị của lát 2 là **tốc độ + độ phủ** của lượt cắt, không phải cứu vòng hỏng. Thước riêng của lát 2 (hạt giống §8 điểm 2b) «số hàng sửa ý định sau khi vòng mở»: đo 06/10 = **1 / 9** lần sửa trường ý định từ 03/10 — `l4` bỏ đứng-trên `cb` ngày 04/10 khi hồ sơ `tro-ly-doc-kho` đã duyệt Cổng Phạm vi 01/10; 2 lần điền câu giao còn trống cho hàng đã giao (`4n`, `4c`); 6 lần trước khi vòng mở hoặc ở hàng không hồ sơ (`N0`, `N1`, `K4`, `ZT` ×2, `l3b`). (Số trình owner trước phiên là 0/7, tính trên câu giao/hạng/đứng-trên và không tách ca `l4`.) | nếu cắt tay đã đủ nhanh và đủ phủ thì skill là CỘNG không người hưởng | (a) đo thời gian hai lượt cắt 04/10 — từ lúc bản phạm vi tới tay tới commit — trong bản chép phiên điều phối (không nằm trên máy kit); (b) viết tay bảng phủ cho 19 hàng của `729a1ab80` từ bản phạm vi 04/10, đếm mã lọt hoặc ở hai hàng | Chưa thử |
| 2 | Tệp ý định KHÔNG cần trường trạng thái tự khai — mọi trạng thái suy được từ hồ sơ. Phiên nghiệm thu lát 1 (06/10, verdict iterate) cho thấy owner đã gỡ `trang_thai` ở 37 hàng nhưng vẫn gõ tay `pr` + `buoc_ke` cho 12 hàng máy đã suy «đã giao» và đã cờ (`1dc8ffe0c`) | skill cắt lượt phải sinh cột trạng thái → đụng quyết owner 02/10 «kit không ghi file ý định»; hoặc lát 1 phải suy thêm hai trường | thử suy `pr` (từ hồ sơ/sổ quyết định/forge) và `buoc_ke` (từ ngăn bản đồ) cho 12 hàng của `1dc8ffe0c`, đếm khớp; đo lại ở lượt cắt thứ hai: commit nào gõ hai trường cho hàng có hồ sơ | Chưa thử |
| 3 | Chỉ tệp khai ở `lo_trinh.tep` là ý định; lộ trình viết tay ngoài ổ cắm phải bị bỏ qua. Ba tệp `lo-trinh-zalo.md` (sửa cuối 27/09), `lo-trinh-tro-ly-okr.md` (29/09), `lo-trinh-dieu-phoi-30-ngay.md` (29/09) đứng yên trong khi hàng Zalo đã sống trong `lo-trinh-okr.json` (3 hàng nhóm `zalo`, 23 hàng `tro-ly`) — hai nguồn cho cùng ý định | skill đọc nhầm nguồn cũ, sinh hàng trùng hoặc lệch | so mã/câu giao của ba tệp `.md` với hàng cùng nhóm trong JSON, đếm hàng chỉ có ở một bên; hỏi kho: ba tệp còn là nguồn hay đã là sử liệu | Chưa thử |
| 4 | Sáu luật cắt (hạt giống §4: một câu người dùng nói được · đứng trên dữ liệu thật của hàng trước · không chạm hai lớp khó đảo một hàng · cỡ theo nhịp thật đo từ hồ sơ · ngày rơi ra từ thứ tự + nhịp · mã không cắt được → chân trời kèm lý do) tái hiện được lượt cắt owner làm tay | skill sinh hàng owner phải viết lại, chậm hơn cắt tay | áp tay sáu luật lên 19 hàng của `729a1ab80`, đếm hàng vi phạm từng luật và hàng owner sẽ phải sửa | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: *skill cắt lượt có biến một bản phạm vi thành hàng theo khuôn nhanh hơn cắt tay mà không lọt mã không?*
- Kết quả nào là SỐNG: lượt cắt kế của crm chạy bằng skill · răng phủ xanh (mỗi mã của bản phạm vi ở đúng một hàng hoặc chân trời, 0 mã lọt) · thời gian từ bản phạm vi tới commit hàng ≤ nửa lượt cắt tay 04/10 · bảng phủ không còn chép tay · 0 hàng sửa ý định sau khi vòng mở trong 30 ngày.
- Kết quả nào là CHẾT: owner viết lại ≥ 1/3 số hàng skill sinh trước khi mở vòng, hoặc kit ghi vào tệp ý định của kho, hoặc kho không khai lộ trình thấy thẻ/trang đổi.
- Timebox: một vòng T2, trần ba lượt chấm; ngưỡng đọc sau lượt cắt kế của crm (≤ 30 ngày sau phát hành mốc mang lát 2).

## Kết quả prototype

Chưa dựng. Vật để so: hai lượt cắt tay 04/10 (`3e80edc29`, `729a1ab80`) và bảng phủ mục 8 của
`docs/plan/lo-trinh-okr.md` ở crm — không phải prototype của ô này.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Sáu luật chia lượt | crm `docs/plan/lo-trinh-dieu-phoi-30-ngay.md` §2 · `lo-trinh-kho-tai-lieu.md` · `lo-trinh-okr.md` §2 «Nguyên tắc chia lượt» | triết-lý/logic | có — rút thành luật của skill, không chép văn | — |
| Bảng phủ «mọi mã về đúng một chỗ» | crm `docs/plan/lo-trinh-okr.md` §8 | triết-lý/logic | có — thành răng duy nhất | — |
| Khuôn hàng (sáu trường + `vi_sao` + `moc[]`) | kit lát 1 `scripts/lo-trinh.mjs` (`kiemKhuon`) | triết-lý/logic | có — đầu ra của skill phải qua `kiemKhuon` | — |
| Core của quét hình thái | kit skill `morphological-scan` | triết-lý/logic | có — một trong hai dạng đầu vào | — |
| Khuôn trình bày bản phạm vi của đội sản phẩm | (chưa có mẫu trong git crm; `de-xuat-lo-trinh.md` 04/10 không được commit) | ngôn-ngữ-thiết-kế/hình-thái | không | — |

## Cổng 0

- **decision = build** Lát 2, hạng T2: một skill cắt lượt, một răng tất định (mỗi mã ở đúng một hàng
  hoặc chân trời), đầu ra qua `kiemKhuon` của lát 1, không lệnh cổng mới, kit không ghi tệp ý định.
  **Mở vòng SAU khi cắt mốc 2.24.0 và crm nhận** (owner 06/10) — giữ cửa sổ 2.23 → 2.24 ở một vòng
  chạm engine (luật chiều rộng b).
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** bốn bullet ở section Ngưỡng, giữ nguyên chữ, đã gỡ tiền tố.
- **Luật chiều rộng (b) — để owner cân ở Cổng Đáng:** lát 2 là vòng có kho chờ nhận (crm, như lát 1).
  Cửa sổ 2.23 → 2.24 ĐÃ có một vòng chạm engine: `loc-paths-dong-mac-dinh` (T3, ký Cổng Bằng chứng
  06/10, gộp sau tag 2.23.0, PR #271 `730d000c`). Ký `build` ô này = vòng thứ hai chạm engine trong
  cùng cửa sổ; lối khác là ký `build` nhưng mở vòng sau khi cắt 2.24.0 và crm nhận.

## Thước đo thành công → ứng viên criterion

- Răng phủ: bản phạm vi có N mã → đầu ra có N mã, mỗi mã ở đúng một hàng hoặc chân trời; thiếu hay
  trùng một mã thì đỏ và nêu tên mã (chiều đỏ khai ở hạt giống §5).
- Mọi hàng skill sinh qua `kiemKhuon` của lát 1 không cờ; trang lộ trình vẽ được ngay.
- Kho không khai `lo_trinh.tep`: thẻ start và bản đồ giống từng byte trước/sau.
- Skill không ghi tệp ý định: đầu ra là đề xuất hàng + bảng phủ để người commit bằng PR.

## Out of scope từ khám phá

- Kit ghi hay sửa tệp ý định của kho — owner quyết 02/10, kit chỉ đề xuất hàng; người ghi bằng PR.
- Sửa phần còn gõ tay của lát 1 (`pr`, `buoc_ke`) bằng một vòng riêng — owner 06/10 chọn cân nó ở
  đây (giả định 2), không mở vòng lát 1 thứ hai trong cửa sổ.
- RICE/WSJF hay điểm ưu tiên tự động — thứ tự là quyết định người (hạt giống §8).
- Băng/răng chống trôi dùng chung (gói C) — chỉ mở khi ≥ 2 kho cùng đòi.
- Nấc 1–2 trong CRM (trang `/lo-trinh`, nút góp ý sinh hàng nháp) — là hàng của lộ trình OKR, không
  phải việc kit.
