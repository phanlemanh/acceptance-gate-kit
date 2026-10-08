---
schema_version: 1
slug: xuat-du-lieu-lo-trinh
feature: «Trang nào cũng vẽ được lộ trình của kho từ một tệp dữ liệu kit xuất sẵn — không trang nào phải tự tính trạng thái»
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-08T08:22:48Z   # owner gõ «làm» một chạm trong phiên 08/10, máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: X1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

> Mở 08/10 từ hàng X1 của `docs/plans/lo-trinh-kit.json` (gộp #282 `7e965b54`). Ổ cắm `lo_trinh`
> của chính kit chưa bật (dời vào chiến dịch ghim lại của mốc 2.25.0), nên lệnh mở-từ-hàng của
> feature-loop thoát 1 «kho chưa khai lo_trinh.tep»; khung frontmatter, bốn dòng ngưỡng và đoạn
> «Vì sao» dưới đây do chính bộ ghi của kit (`dungCoHoi` trong `scripts/lo-trinh.mjs`) sinh từ hàng,
> rồi máy điền phần khám phá. Hàng là CỘNG — owner phê ở Cổng Đáng (ADR 0018).

## Vấn đề & ai gặp

Gốc: crm/_acceptance/cap-nhat-tuan-okr — lượt 4 OKR: 23/48 tin chủ kho ở phiên điều phối 23–26/09 là hỏi tiến độ (đếm ở `docs/findings/2026-09-26-loi-kit-tu-luot-4-okr.md` §4); X1 là lớp dữ liệu để người không dùng git tự xem câu trả lời.

Mở từ hàng X1 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).

«Trang nào cũng vẽ được lộ trình của kho từ một tệp dữ liệu kit xuất sẵn — không trang nào phải tự tính trạng thái»

Vì sao: Owner chốt 08/10: đội sản phẩm và trưởng phòng ban không dùng git được XEM lộ trình (crm: ngay trong CRM — nấc đã hẹn 02/10), mỗi kho một trang, nguồn vẫn là git. Hôm nay trạng thái chỉ có trong trang tĩnh LO-TRINH.html; bản chiếu nào muốn hiện phải tự tính lại → nguồn sự thật thứ hai.

Người gặp, theo thứ tự trả giá:

- **Trưởng phòng ban và đội sản phẩm crm** — không dùng git, nên hôm nay chỉ biết tiến độ bằng cách
  hỏi chủ kho. Trang «Lộ trình» trong CRM (hàng `LT1` của crm, slug `trang-lo-trinh-trong-crm`) là
  chỗ họ sẽ xem; hàng ấy ghi thẳng «đọc tệp dữ liệu lộ trình do bộ kit xuất, không tự tính trạng thái».
- **Chủ kho** — người trả lời các câu hỏi đó (nền 23/48).
- **Bất kỳ bản chiếu nào khác** — bản chiếu ReUI đã có bản mẫu và hướng đồng ý ở hạt giống
  `docs/plans/2026-10-04-hat-giong-ban-chieu-reui-trang-lo-trinh.md` («kit thêm MỘT lối xuất mô hình
  xem JSON từ lớp phân tích»). X1 là đúng lối xuất đó; không có nó, mỗi bản chiếu phải chép lại luật
  suy trạng thái của kit — nguồn sự thật thứ hai, thứ ba.

Hai người tiêu thụ đã gọi tên, cả hai ở ngoài kit: X1 không có người hưởng nếu không bản chiếu nào đọc
nó — đó là ngưỡng chết bên dưới.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Mọi trạng thái trên `LO-TRINH.html` đã có sẵn trong kết quả phân tích của kit (một danh sách hàng mang trạng thái, hồ sơ nhận, cờ, hàng kế) — xuất tệp chỉ là ghi lại thứ đã tính, không phải viết bộ suy thứ hai | X1 thành một bộ suy song song, chính lớp lỗi «hai nguồn» nó sinh ra để đóng | chạy lớp phân tích của kit `main` trên bản chụp crm, vẽ lại trang, so từng byte với trang crm đã commit | Thử 08/10 — **ĐỨNG** (dưới) |
| 2 | Bản chiếu không phải tính gì ngoài một phép so ngày | trang trong CRM phải chép luật của kit → tệp xuất không đủ | đọc mã vẽ trang: chỗ nào phụ thuộc thời gian | Thử 08/10 — **ĐỨNG CÓ ĐIỀU KIỆN** (dưới) |
| 3 | Thêm tệp xuất không bắt kho tiêu thụ sửa cấu hình | mỗi kho đã khai lộ trình phải sửa `_acceptance/config.yaml` → làm cũ hàng loạt hồ sơ (đúng lý do ổ cắm của chính kit đang hoãn) | đọc miễn trừ hạng T1 của crm: tệp mới ở đâu thì được phủ | Thử 08/10 — **ĐỔ cho một tệp riêng ở gốc kho**; có lối không tốn (dưới) |
| 4 | Trang «Lộ trình» của crm sẽ được dựng và đọc tệp này sau 14/10 | X1 là CỘNG không người hưởng | hàng `LT1` có trên lộ trình crm; đếm sau mốc 2.27 | Một nửa: `LT1` có ở nhánh crm `docs/lo-trinh-cua-xem-cua-gop` (`66862babd`, 08/10), **chưa gộp vào `onehub`**; phần còn lại đo ở ngưỡng |

### Kết quả ba phép thử (08/10, crm `origin/onehub` `c803963ef`, kit `main` `7e965b54`)

1. **Trạng thái đã có sẵn.** Lớp phân tích của kit trên bản chụp crm: 3 lộ trình · 85 hàng (62 · 13 ·
   10) · 3 cờ · hàng kế `7n` / `l3b` / `V0a`. Trạng thái phân bố: Đã giao 16 · Đã giao — chờ phiên
   nghiệm thu 33 · Chưa mở 29 · Sắp mở vòng 3 · Đang làm 1 · Xếp lại sau 3. Vẽ lại trang từ chính kết
   quả ấy **khớp từng byte** với `LO-TRINH.html` crm đã commit (59 545 byte). Mỗi hàng trong bộ nhớ đã
   mang trạng thái chữ, hồ sơ nhận, lời tự khai, cờ — X1 là ghi lại, không suy lại.
2. **Một phép so ngày.** Trang tĩnh tất định; phần duy nhất phụ thuộc thời gian là đoạn script nội
   tuyến tính «còn N ngày / đã qua» của mốc và «mốc đã qua còn việc chưa giao», theo ngày của người
   xem. Điều kiện: tệp xuất phải mang sẵn ngày mốc, danh sách hàng của mốc và cờ «hàng đã giao» —
   khi đó bản chiếu chỉ còn so một ngày với hôm nay; luật trạng thái không rời kit.
3. **Cấu hình kho.** Miễn trừ T1 của crm phủ `LO-TRINH.html` đích danh và `docs/**`; một tệp riêng ở
   gốc kho (vd `LO-TRINH.json`) KHÔNG được phủ → bộ vẽ hiện đỏ «không glob nào phủ» và mọi commit
   đóng cổng làm cũ bằng chứng, trừ khi crm sửa `config.yaml`. Lối không tốn: **nhúng dữ liệu vào chính
   `LO-TRINH.html`** (một khối dữ liệu máy đọc có tên trong trang) — không tệp mới, không đổi cấu hình
   ở kho nào, phép kiểm trang-khớp-hồ-sơ sẵn có canh luôn dữ liệu, và «dữ liệu lệch trang cùng lượt
   vẽ» không xảy ra được vì là một tệp. Chọn dáng là việc của bước thiết kế; Cổng Đáng chỉ cần biết
   có một lối không bắt kho nào trả giá cấu hình.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: đã đạt «Một bản chiếu ngoài kho (trang trong CRM hoặc trang chia sẻ) hiện đúng trạng thái từng hàng chỉ bằng cách đọc tệp kit xuất, so khớp 100 % với LO-TRINH.html cùng lượt vẽ» chưa?
- Kết quả nào là SỐNG: Một bản chiếu ngoài kho (trang trong CRM hoặc trang chia sẻ) hiện đúng trạng thái từng hàng chỉ bằng cách đọc tệp kit xuất, so khớp 100 % với LO-TRINH.html cùng lượt vẽ; bản chiếu không chứa luật suy trạng thái nào ngoài phép so ngày của mốc
- Kết quả nào là CHẾT: chưa đạt «Một bản chiếu ngoài kho (trang trong CRM hoặc trang chia sẻ) hiện đúng trạng thái từng hàng chỉ bằng cách đọc tệp kit xuất, so khớp 100 % với LO-TRINH.html cùng lượt vẽ» khi hết timebox; hoặc 21 ngày sau khi mốc mang X1 phát hành mà không bản chiếu nào đọc dữ liệu xuất (khi đó gỡ lối xuất); hoặc một kho không khai lộ trình thấy bất kỳ tệp nào đổi
- Timebox: 2026-10-23 (mốc Phát hành 2.27.0 — ca chập chờn, eval model thật, cắt lượt, xuất dữ liệu lộ trình (dự kiến từ nhịp đo được, không phải hạn — sai số vài ngày)); ngưỡng SỐNG/CHẾT đọc 21 ngày sau ngày phát hành thật của mốc mang X1

## Kết quả prototype

Chưa dựng. Phép thử 1 chạy trên lớp phân tích sẵn có — không phải prototype của ô này. Bản mẫu
`scripts/xuat-du-lieu.mjs` mà hạt giống ReUI nhắc nằm ở thư mục nháp ngoài git; không dùng.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Lớp phân tích lộ trình (hàng · trạng thái · hồ sơ nhận · cờ · mốc) | kit `scripts/lo-trinh.mjs` (`phanTichKho`) | triết-lý/logic | có — nguồn duy nhất của dữ liệu xuất | — |
| Hướng «một lối xuất mô hình xem JSON, trang tĩnh là bản gốc» | `docs/plans/2026-10-04-hat-giong-ban-chieu-reui-trang-lo-trinh.md` | triết-lý/logic | có | — |
| Nhu cầu của trang trong CRM | crm hàng `LT1` (`66862babd`, nhánh `docs/lo-trinh-cua-xem-cua-gop`) | triết-lý/logic | có — làm người tiêu thụ thứ nhất của ngưỡng | — |
| Sơ đồ «Lộ trình trên hai mặt» (chặng 5 Vẽ lại, chặng 6 Xem) | artifact của owner 08/10 | triết-lý/logic | có — chỉ phần phân vai | — |
| Giao diện trang trong CRM / bản chiếu ReUI | crm · block ReUI Pro | ngôn-ngữ-thiết-kế/hình-thái | không — sống ở kho tiêu thụ | — |

## Cổng 0

- **decision = build** (Manh Phan, 08/10 — «làm» một chạm) hạng T2: một lối xuất dữ liệu từ lớp phân
  tích sẵn có, cùng lượt vẽ với `LO-TRINH.html`, không lệnh mới, không đổi cấu hình kho, kho không
  khai lộ trình không đổi byte nào. Nhịp: vòng dựng trên kit trước, nhưng **PR chỉ gộp sau khi cắt
  2.26.0** để X1 đi đúng mốc 2.27 — không đưa engine mới tới crm trước hạn cứng 14/10.
- **disposition = …** Không có prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** bốn dòng ở section Ngưỡng, giữ nguyên chữ, đã gỡ tiền tố.
- **CỘNG (ADR 0018):** trace về nguyên tố 2 (bằng chứng không tự dối — một nguồn trạng thái thay vì
  mỗi bản chiếu tự tính) và khối ĐỊNH VỊ (bảng đồng hồ cho người không dùng git); người hưởng: trưởng
  phòng ban + đội sản phẩm crm qua `LT1`, chủ kho bớt câu hỏi tiến độ.
- **Luật chiều rộng (b):** X1 là việc sản phẩm có kho chờ nhận (crm qua `LT1`), không phải vòng meta.

## Thước đo thành công → ứng viên criterion

- Dữ liệu xuất và `LO-TRINH.html` sinh trong CÙNG lượt vẽ, từ CÙNG kết quả phân tích; một bản chiếu
  tham chiếu dựng lại trạng thái từng hàng chỉ từ dữ liệu xuất và khớp trang 100 % trên hồ sơ thật.
  Chiều đỏ trong bộ kiểm: mutant làm dữ liệu lệch trang (bỏ một hàng · đổi một trạng thái) → đỏ, ghim
  tên hàng.
- Phép kiểm trang-khớp-hồ-sơ sẵn có đỏ khi dữ liệu xuất cũ so với hồ sơ — không thêm cổng CI mới.
- Kho không khai lộ trình: không sinh dữ liệu, mọi tệp giống từng byte trước/sau (im).
- Dữ liệu mang số phiên bản khuôn; bộ đọc mẫu gặp phiên bản lạ hoặc thiếu khoá thì cờ vàng, không vỡ
  (đường đọc-cũ).
- Bản chiếu không phải tính gì ngoài so ngày: dữ liệu mang sẵn trạng thái chữ, cờ đã giao, hồ sơ nhận,
  hàng kế, cờ, ngày mốc + hàng của mốc.

- Bản xuất không làm phạm vi soi của lượt chấm nở ra và không làm cũ bằng chứng khi đóng cổng: trên
  cấu hình hiện có của kho (crm phủ `LO-TRINH.html` đích danh), tệp đổi khi vẽ lại đều thuộc vùng
  ngoài-vật — owner hỏi 08/10 «có tăng thời gian và token sau mỗi vòng không»; đo 08/10: bản xuất crm
  ≈ 19 KB, phân tích 85 hàng ≈ 0,1 giây, 0 token.

## Out of scope từ khám phá

- Trang «Lộ trình» trong CRM — hàng `LT1` của crm, không phải việc kit.
- Gộp nhiều kho vào một trang hay một tệp — owner chốt 08/10: mỗi kho một trang.
- Kit ghi tệp ý định, giữ kho tín hiệu, hay nhận tín hiệu ngược về — tín hiệu là hàng L3.
- Bản chiếu ReUI — vẫn là hạt giống riêng, bật theo từng kho; X1 chỉ cấp dữ liệu cho nó.
- API hay máy chủ phục vụ dữ liệu — nguồn vẫn là git; bản chiếu đọc tệp từ nhánh chính.
