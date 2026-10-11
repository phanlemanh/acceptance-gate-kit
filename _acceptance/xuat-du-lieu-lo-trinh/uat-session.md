---
schema_version: 1
slug: xuat-du-lieu-lo-trinh
feature: Trang lộ trình mang sẵn một khối dữ liệu máy đọc vẽ cùng lượt — bản chiếu ngoài kho hiện đúng trạng thái từng hàng chỉ bằng cách đọc khối, không tự tính trạng thái
owner: phanlemanh@gmail.com
stage: held
verdict: release
decided_by: Manh Phan
decided_at: 2026-10-11T01:03:24Z   # chủ kho gõ «release» một chạm trong phiên X1, máy ghi hộ
---

## Ngưỡng đã khai tại Cổng Đáng (CHÉP NGUYÊN VĂN — cấm sửa sau khi thấy số)

- Câu hỏi phép đo trả lời: đã đạt «Một bản chiếu ngoài kho (trang trong CRM hoặc trang chia sẻ) hiện đúng trạng thái từng hàng chỉ bằng cách đọc tệp kit xuất, so khớp 100 % với LO-TRINH.html cùng lượt vẽ» chưa?
- Kết quả nào là SỐNG: Một bản chiếu ngoài kho (trang trong CRM hoặc trang chia sẻ) hiện đúng trạng thái từng hàng chỉ bằng cách đọc tệp kit xuất, so khớp 100 % với LO-TRINH.html cùng lượt vẽ; bản chiếu không chứa luật suy trạng thái nào ngoài phép so ngày của mốc
- Kết quả nào là CHẾT: chưa đạt «Một bản chiếu ngoài kho (trang trong CRM hoặc trang chia sẻ) hiện đúng trạng thái từng hàng chỉ bằng cách đọc tệp kit xuất, so khớp 100 % với LO-TRINH.html cùng lượt vẽ» khi hết timebox; hoặc 21 ngày sau khi mốc mang X1 phát hành mà không bản chiếu nào đọc dữ liệu xuất (khi đó gỡ lối xuất); hoặc một kho không khai lộ trình thấy bất kỳ tệp nào đổi
- Timebox: 2026-10-23 (mốc Phát hành 2.27.0 — ca chập chờn, eval model thật, cắt lượt, xuất dữ liệu lộ trình (dự kiến từ nhịp đo được, không phải hạn — sai số vài ngày)); ngưỡng SỐNG/CHẾT đọc 21 ngày sau ngày phát hành thật của mốc mang X1

**Cửa sổ đọc.** X1 đi ở mốc **2.26.0, phát hành 09/10** (tag `v2.26.0`, PR #290) — sớm hơn mốc 2.27
mà ô dự kiến. crm nhận 2.26.0 ngày 10/10 (crm-onehub#350), trang «Lộ trình» (LT1) gộp vào `onehub`
cùng ngày (crm-onehub#329). Ngày đọc chính thức = 09/10 + 21 = **30/10/2026**. Lần đo này là **đọc
sớm** (11/10, ngày 2/21), trước cả timebox 23/10.

Điều kiện «sản phẩm thật chạy sau flag»: ⚠ **chưa lái-thử** — hồ sơ không có `stranger-drive.md`;
điều kiện là lời khai. Sản phẩm ở đây là khối dữ liệu trong `LO-TRINH.html` của crm (vẽ bằng kit
2.26.0) và trang đọc nó là trang «Lộ trình» của crm trên nhánh chính `onehub`.

## Người dự

| Tên | Vai | Đại diện cho ai |
|---|---|---|
| Phan Le Manh | chủ kho kit và crm | người trả lời câu hỏi tiến độ hôm nay (nền 23/48 tin), thay mặt trưởng phòng ban và đội sản phẩm crm — người xem trang «Lộ trình» |

## Chấm kín (thu TRƯỚC mọi thảo luận chung)

Câu gợi cho người dự (máy dọn bàn, người chấm): mọi vế của ngưỡng đều kiểm bằng máy (khối dưới);
không có vế nào cần mắt người. Câu ràng buộc dành cho người ký: X1 sẽ đến kho nào tiếp, khi nào?

| Người | Điểm/nhận xét kín | Sẽ gửi cho khách nào, khi nào |
|---|---|---|
| Phan Le Manh | không chấm tay — mọi vế ngưỡng kiểm được bằng máy (nếp owner đặt 03/10) | không trả lời riêng — chủ kho gõ một chữ «release»; sự kiện: X1 đã ở crm từ 10/10 qua 2.26.0 |

### Kiểm bằng máy (mọi vế đều có căn cứ trong hồ sơ)

Nguồn: crm `onehub` **`e7afcb8b7`** (fetch 11/10); kit `main` `68951cef` cho thước; bản phát hành
`v2.26.0` cho ca kho-không-khai. Chạy lại trọn bằng một lệnh:
`bash _acceptance/xuat-du-lieu-lo-trinh/uat/chay.sh ~/dev/crm <sha> <thư mục nháp>`. crm chỉ bị đọc
(`git archive`, `fetch`). Số từng mục nằm ở `evidence/uat/`.

| Vế | Phép đo | Kết quả |
|---|---|---|
| Trang kit và khối cùng một lượt vẽ | bộ vẽ crm đang dùng (giống từng byte kit 2.26.0) `--check` trên bản sao hồ sơ + kế hoạch crm ở `e7afcb8b7` | «LO-TRINH.html khớp tệp ý định và hồ sơ» — trang ở đầu nhánh chính crm đúng là lượt vẽ của dữ liệu hiện tại |
| Khối đọc được bằng hàm đọc của kit | `docDuLieu` của kit trên chính tệp | 3 lộ trình · 117 hàng · 0 cảnh báo; 117/117 hàng của khối khớp phần người xem thấy trên trang kit |
| Trang CRM hiện đúng trạng thái từng hàng | dựng trang «Lộ trình» bằng đúng đường đọc của trang (`docTepLoTrinh` → `docTrangLoTrinh` → `NoiDungLoTrinh`) trên bộ kiểm DOM của LT1; lật 5 trang bảng ở vòng đời «tất cả», mở khung chi tiết từng việc; so với bộ đọc HTML độc lập của trang kit | **117/117 hàng khớp** (OKR 94 · Kho tài liệu 13 · Việc và Dự án 10); khung chi tiết 117/117; dấu «theo ghi chép» 13/13; cờ lệch 5/5; đếm nhóm từng lộ trình và bốn số đếm vòng đời (28 · 86 · 3 · 117) khớp thanh tiến độ trang kit |
| Chiều đỏ của phép so | tiêm trạng thái sai vào bản sao khối (phần người xem thấy giữ nguyên), dựng lại trang CRM, so lại | đỏ đúng hàng ở cả ba ca: OKR#7n (Chưa mở → Đã giao) · Kho tài liệu#l2 (chỉ đổi nhóm) · Việc và Dự án#V6 (Xếp lại sau → Đang làm); không ca nào đỏ sang hàng khác |
| Trang CRM không có luật suy trạng thái | quét 21 tệp mã trang Lộ trình theo năm dấu hiệu (gán trạng thái · dùng chữ trạng thái của kit · đọc nguồn khác · đọc chữ trạng thái · dùng ngày); dòng lạ là đỏ | 60 dòng chạm dấu hiệu, 60 có lý do, **0 đỏ**; hàm đọc của trang giống từng ký tự `docDuLieu` của kit |
| Chiều đỏ của phép quét | ba bản sao: suy nhóm từ chữ trạng thái · đọc tệp kế hoạch · hàm đọc chép lệch kit | cả ba bị bắt đúng dòng |
| Luật duy nhất là so ngày của mốc | hàm so ngày của trang chạy cạnh khối luật trong tài liệu kit (`lo-trinh-du-lieu.md`), mọi ngày ±2 quanh mọi mốc | **219/219 ca giống nhau** (73 ngày từ 29/09/2026 tới 11/02/2027 × 3 lộ trình; 79 ca có mốc đã qua còn việc) |
| Kho không khai lộ trình không đổi tệp nào | ca LT-113 của kit (+ chiều đỏ) trên bản phát hành 2.26.0; phép vi phân 2.25.0 → 2.26.0 trên hai kho thật không khai | LT-113 và LT-113-do xanh; radar `0d355f3` và oneflow `93b0129`: 0 tệp đổi, cây giống từng byte bản 2.25.0, không sinh `LO-TRINH.html` |

**Một lỗi của chính thước, đã sửa trước lần chạy trọn:** lượt thử đầu đỏ 24 hàng ở khung chi tiết vì
bộ đọc gom cả chấm trạng thái của việc liên quan («Cần xong trước», «Đang chờ») nằm trong khung. Đã thu
phạm vi về chấm của chính việc; chiều đỏ ở trên chạy SAU lần sửa đó.

**Giới hạn đo lường (khai, không phải lỗi):**
- Trang dựng trên bộ kiểm DOM, không qua máy chủ Next, đăng nhập và bộ đệm của trang. Phần hiện trạng
  thái là cùng thành phần, cùng đường đọc tệp; lớp vỏ thì không đo.
- Trang CRM hiện «Chưa mở» bằng nhãn nhóm «Chưa bắt đầu», và «Đã giao» / «Đang làm» bằng chính nhãn
  nhóm, không in chữ phụ. Thước coi ba cặp đồng nghĩa này là khớp (bảng viết sẵn trong
  `uat/so-ban-chieu.mjs`); mọi chữ khác phải hiện nguyên văn. Hôm nay có 66 hàng «Đã giao — chờ phiên
  nghiệm thu» và 3 hàng «Xếp lại sau» hiện nguyên văn.
- Màu trên trang kit chỉ tách «đã giao» và «chưa mở»; các nhóm còn lại khớp qua chữ và qua thanh tiến
  độ của từng lộ trình.
- Prod: **CHƯA ĐO** — ngưỡng không đòi prod. Người hưởng thật (trưởng phòng ban) chỉ thấy trang khi
  `onehub` lên môi trường người dùng.

**Quan sát ngoài ngưỡng (cho crm, không thành việc):** tab vòng đời của nhóm «khác» mang nhãn «Xếp
lại sau». Hôm nay đúng (cả 3 hàng nhóm khác đều «Xếp lại sau»). Nếu một kế hoạch crm có hàng «Đã bác
từ khám phá», «Hồ sơ hỏng» hoặc «Không suy được», nhãn tab sẽ hẹp hơn nghĩa.

## Thảo luận sau khi đã chấm

Không có thảo luận — chủ kho đọc gói một phút và quyết bằng một chữ.

## Số đo thật đặt cạnh ngưỡng

| Thước | Ngưỡng đã khai | Số đo được (đọc sớm 11/10) | SỐNG/CHẾT |
|---|---|---|---|
| Bản chiếu ngoài kho hiện đúng trạng thái từng hàng, khớp 100 % trang cùng lượt vẽ | 100 % | 117/117 hàng × 3 lộ trình, cả bảng lẫn khung chi tiết; chiều đỏ 3/3 | SỐNG |
| Bản chiếu chỉ đọc tệp kit xuất, không luật suy trạng thái ngoài so ngày của mốc | 0 luật | 0 dòng đỏ / 60; luật ngày trùng tài liệu kit 219/219; chiều đỏ 3/3 | SỐNG |
| Chưa đạt SỐNG khi hết timebox (23/10) | CHẾT nếu chưa đạt | đạt từ 10/10 | không chạm |
| 21 ngày sau phát hành (30/10) mà không bản chiếu nào đọc | CHẾT nếu 0 bản chiếu | 1 bản chiếu (trang Lộ trình crm) đọc từ 10/10, ngày 1/21 | không chạm |
| Kho không khai lộ trình thấy tệp đổi | CHẾT nếu ≥ 1 tệp | 0 tệp (ca kit + radar + oneflow) | không chạm |

## Quyết định Cổng Giá trị

> `release` = giữ lối xuất, giao rộng · `iterate` = giữ giả định, sửa rồi đo lại · `kill` = gỡ lối
> xuất. **Giết ở đây là THÀNH CÔNG của quy trình** — câu trả lời mua bằng giá một vòng dựng, không
> phải thất bại của người làm.

- **verdict = release** (Manh Phan, 11/10: «release» — một chạm, trên gói đọc sớm).
- Khuyến nghị của máy: **release**. Căn cứ: hai vế SỐNG đều đạt trên crm thật; ba điều kiện CHẾT đều
  không chạm. Lần đọc chính thức 30/10 chỉ cần chạy lại `uat/chay.sh` một lần, và chỉ trình lại người
  ký nếu đổi màu.
- Bước kế theo verdict: `release` → không việc mới. X1 đã ở crm từ 2.26.0; kho tiêu thụ kế nhận theo
  mốc phát hành của nó. `iterate` → mở vòng kế bằng `/feature-loop:feature-loop <mô tả>`. `kill` → gỡ
  khối dữ liệu ở mốc kế, ghi `stage: archived` vào `opportunity.md` cùng lượt; trang Lộ trình crm sẽ
  hiện trạng thái «trang chưa mang dữ liệu».
