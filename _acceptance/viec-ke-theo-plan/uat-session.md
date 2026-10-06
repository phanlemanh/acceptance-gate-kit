---
schema_version: 1
slug: viec-ke-theo-plan
feature: Lộ trình vào kit, lát 1 — ổ cắm đọc file ý định của kho (khuôn sáu trường), máy suy trạng thái từ hồ sơ bằng bảng nhãn bản đồ sản phẩm, in ba dòng lên thẻ start và vẽ trang lộ trình cạnh PRODUCT-MAP.md; kit KHÔNG ghi vào file ý định
owner: phanlemanh@gmail.com
stage: held
verdict: iterate
decided_by: Manh Phan
decided_at: 2026-10-06T13:43:45Z
---

## Ngưỡng đã khai tại Cổng Đáng (CHÉP NGUYÊN VĂN — cấm sửa sau khi thấy số)

- Câu hỏi phép đo trả lời: *trang vẽ + ba dòng thẻ start có thay được việc hỏi tiến độ và gõ tay trạng thái không?*
- Kết quả nào là SỐNG: trên hai lộ trình crm dùng ổ cắm, tin hỏi tiến độ/lượt ≤ nửa nền (nền 23/48, lượt 4 OKR) · 0 commit «bản chụp» chỉ đổi trạng thái sau khi ổ cắm chạy · 0 hàng tự khai lệch hồ sơ mà thẻ im.
- Kết quả nào là CHẾT: owner vẫn gõ trạng thái tay sau hai lộ trình, hoặc ổ cắm làm kho không khai đổi thẻ/đỏ.
- Timebox: một vòng, trần ba lượt chấm; ngưỡng đọc sau hai lộ trình crm kế tiếp (≤ 30 ngày sau phát hành).

Điều kiện «sản phẩm thật chạy sau flag»: ⚠ chưa lái-thử — hồ sơ không có `stranger-drive.md`; điều
kiện là lời khai. Sản phẩm ở đây là thẻ start và trang lộ trình của kit 2.23.0 (`main` `730d000c`)
chạy trên crm `origin/onehub` `ccbaf7068` (06/10 19:25 +07), nơi hai lộ trình đã sống bằng ổ cắm từ
crm `592cae648` (03/10 20:00 +07, nhận kit 2.21.0). Phiên đọc ngưỡng ở ngày thứ ba sau phát hành, sau
MỘT lượt cắt (làn R1 «cả CRM trước 14/10», 04→06/10), chưa phải hai — xem khối số đo.

## Người dự

| Tên | Vai | Đại diện cho ai |
|---|---|---|
| Phan Le Manh | chủ kho crm, ngồi phiên điều phối | người đọc thẻ start và trang lộ trình mỗi lượt — người dùng cuối của tính năng |

## Chấm kín (thu TRƯỚC mọi thảo luận chung)

| Người | Điểm/nhận xét kín | Sẽ gửi cho khách nào, khi nào |
|---|---|---|
| Phan Le Manh | không chấm tay — mọi vế của ngưỡng kiểm được bằng git + hồ sơ, máy kiểm và ghi ở khối dưới (tiền lệ `lo-trinh-tren-du-lieu-that` 03/10, sổ quyết định d-…-25 của hồ sơ đó) | — |

### Kiểm bằng máy

Nguồn: kit `main` `730d000c` (`scripts/start-scan.mjs`, `scripts/lo-trinh.mjs`) chạy trên cây tạm
tách từ crm `origin/onehub` `ccbaf7068`; lịch sử hai tệp `docs/plan/lo-trinh-okr.json` và
`docs/plan/lo-trinh-kho-tai-lieu.json` đọc bằng `git show <c>^` / `<c>` và so TỪNG TRƯỜNG của từng hàng
(khoá hàng = `khoa`, lùi về `ma`). Chạy 06/10.

**Thẻ start hôm nay** (`start-scan --root <cây tạm>` → `loTrinh`): OKR 62 hàng, hàng kế `7n`, hàng
trễ không, tin theo lời 5/62, `tuKhaiNgoai` 0, cờ 0 · Kho tài liệu 13 hàng, hàng kế `l3b`, tin theo
lời 3/13, `tuKhaiNgoai` 0, cờ 1 («hàng l4: hạng tệp T2, hồ sơ T3» — lệch hạng, không phải lệch trạng
thái). Sống qua Cổng Đáng: OKR 26/26, Kho 5/5 hàng có ô.

**Năm commit chạm hai tệp sau khi ổ cắm chạy** (phân loại theo trường đổi; «trạng thái» =
`trang_thai` · `pr` · `buoc_ke`):

| Commit (giờ +07) | Hàng sửa · thêm | Trường đổi | Loại |
|---|---|---|---|
| `841717c70` 03/10 20:51 | 25 sửa (22 OKR + 3 Kho) · 0 thêm | `trang_thai` GỠ ở 25 hàng (0 hàng đổi chữ), 1 `slug` sửa (hàng 1 → `cau-truc-to-chuc`) | chỉ trạng thái, chiều GỠ lời khai để máy suy — «tệp JSON là nguồn duy nhất» |
| `3e80edc29` 04/10 09:33 | 1 sửa · 9 thêm (dãy Kara) | hàng cũ: `pr` · `buoc_ke` · `ngay` · `cho_ai` · `chay_khi` | lượt cắt |
| `729a1ab80` 04/10 11:11 | 17 sửa · 19 thêm (17 OKR + 2 Kho) | ý định 8 hàng (`cau_giao` 4 · `dung_tren` 4 · `ma` 1), `buoc_ke` 8, `trang_thai` 2, khối `moc` | lượt cắt |
| `074b275ce` 04/10 11:39 | 3 sửa · 0 thêm | `ZT` `trang_thai` đang dựng → xong (việc chủ kho làm trên production, hàng không hồ sơ) + `dung_tren` + `han`; `ghi_chu` 1 hàng Kho; khối `moc` | chỉ trạng thái, hàng tin theo lời |
| `1dc8ffe0c` 06/10 10:19 | 12 sửa · 4 thêm (F9–F12) | 12 hàng (R1a–R1h, K1, l4, l4a, l4b): GỠ `trang_thai` + gõ `pr` + gõ lại `buoc_ke` («Lái thử và phiên nghiệm thu (chủ kho)»); khối `moc` | chủ yếu trạng thái, gõ tay điều máy đã suy |

Đối chiếu `1dc8ffe0c`: trên `1dc8ffe0c^` máy đã suy cả 12 hàng là «Đã giao — chờ phiên nghiệm thu» và
in 12 cờ «tệp khai khác hồ sơ» (khai «chưa mở»/«đang dựng»). Owner gỡ lời khai cũ (đúng hướng ổ cắm
muốn), nhưng cùng lượt gõ tay `pr` và `buoc_ke` — hai trường ổ cắm không suy, nên phải gõ.

**Chiều đỏ** (bản sao cây tạm, sửa tệp OKR rồi `git checkout` trả về; đối chứng chạy trước và sau):

| Ca | Thẻ |
|---|---|
| Đối chứng — tệp nguyên vẹn | OKR 0 cờ, hàng kế `7n` |
| Tiêm 1 — `F9` (hồ sơ `kiem-cheo-sau-gop` đang cân nhắc) khai «đã lên onehub» | 1 cờ: «hàng F9: tệp khai khác hồ sơ: khai đã lên onehub (Đã giao), hồ sơ Đang cân nhắc cơ hội» |
| Tiêm 2 — `7n` (slug `no-sau-luot-7-okr`, không hồ sơ) khai «đã lên onehub» | 1 cờ: «hàng 7n: tự khai đã lên onehub mà không có hồ sơ no-sau-luot-7-okr»; hàng kế lùi sang `N1` |
| Sau khi trả tệp | OKR 0 cờ, hàng kế `7n` |

Đối chiếu độc lập trên `onehub`: 4 hàng vừa có lời khai vừa có hồ sơ (F9–F12, khai «chưa mở», hồ sơ
«đang cân nhắc» — cùng nhóm chưa làm) → 0 hàng lệch nhóm.

**Tin hỏi tiến độ:** phiên điều phối của lượt cắt 04/10 và tám PR làn R1 (crm #250–#276) không có
bản chép trên máy này: 27 thư mục bản chép crm ở `~/.claude/projects/` không có phiên nào sau 03/10
20:00 là phiên điều phối lộ trình (sáu phiên crm sau mốc đó đều là phiên vận hành kit: khoá paths,
sửa thước); công cụ tìm bản chép trả một đoạn mỗi phiên, không đếm tin theo người gõ được. Nền 23/48
đếm từ bản chép phiên «Phiên điều phối OKRs» (`eebb8abe`) — đo được lại ở máy giữ phiên điều phối.

## Thảo luận sau khi đã chấm

## Số đo thật đặt cạnh ngưỡng

| Thước | Ngưỡng đã khai | Số đo được | SỐNG/CHẾT |
|---|---|---|---|
| Tin hỏi tiến độ/lượt | ≤ nửa nền 23/48 | CHƯA ĐO — không đo được ở đây: bản chép phiên điều phối sau 03/10 không nằm trên máy này | CHƯA ĐO |
| Commit «bản chụp» chỉ đổi trạng thái sau khi ổ cắm chạy | 0 | 3/5 commit đổi trường trạng thái: 1 gỡ lời khai (25 hàng), 1 hàng tin theo lời (`ZT`), **1 gõ tay `pr` + `buoc_ke` cho 12 hàng máy đã suy và đã cờ** (`1dc8ffe0c`) | CHƯA ĐẠT |
| Hàng tự khai lệch hồ sơ mà thẻ im | 0 | 0 trên `onehub`; chiều đỏ 2/2 tiêm đỏ đúng hàng, đối chứng 0 cờ; lịch sử: 12 hàng lệch trước `1dc8ffe0c` đều có cờ | SỐNG |
| CHẾT — owner vẫn gõ trạng thái tay sau hai lộ trình | — | sau MỘT lượt cắt: `trang_thai` gõ tay giảm (37 hàng gỡ, chỉ `ZT` gõ mới), `pr` + `buoc_ke` vẫn gõ tay | chưa tới hạn đọc |
| CHẾT — kho không khai đổi thẻ/đỏ | — | 3 kho không khai (kit, radar, oneflow bản trên máy): `loTrinh` = null, không có `LO-TRINH.html` | không chạm |

## Quyết định Cổng Giá trị

> `release` = giao rộng · `iterate` = giữ giả định, sửa rồi đo lại · `kill` = dừng.
> **Giết ở đây là THÀNH CÔNG của quy trình.**

- **verdict = iterate** (Manh Phan, một chạm theo khuyến nghị máy, 2026-10-06T13:43:45Z). Căn cứ: một
  vế SỐNG (0 hàng lệch mà thẻ im, chiều đỏ 2/2), một vế CHƯA ĐẠT (`1dc8ffe0c` gõ tay `pr` + `buoc_ke`
  cho 12 hàng máy đã suy «đã giao» và đã cờ), một vế CHƯA ĐO (bản chép phiên điều phối không ở máy
  này); không vế CHẾT nào chạm; hạn đọc «sau hai lộ trình» mới qua một lượt cắt.
- Bước kế: mở vòng kế bằng `/feature-loop:feature-loop <mô tả>` — hồ sơ mới, ô cơ hội giữ nguyên với
  `decision: iterate`. Owner chọn kèm khuyến nghị: phần sửa (hai trường còn gõ tay) KHÔNG mở vòng riêng
  mà vào ô lát 2 `lo-trinh-cat-luot` làm giả định phải cân ở Cổng Đáng lát 2 — cửa sổ 2.23 → 2.24 đã
  có một vòng chạm engine (`loc-paths-dong-mac-dinh`), luật chiều rộng (b). Đo lại ba vế sau lượt cắt
  thứ hai, ở máy giữ phiên điều phối crm.
