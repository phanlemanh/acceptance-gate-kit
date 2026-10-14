# Mốc là chiến dịch — thiết kế (hàng MC1, hồ sơ `moc-la-chien-dich`)

**Ngày:** 2026-10-14 · **Hạng:** T2 · **Gốc:** `crm/_acceptance/tin-hieu-tu-ve-kho/` · **Hạt giống:**
`docs/plans/2026-10-14-hat-giong-hien-trang-sau-doi-tai-khoan.md` (PR #350) · **Loại:** CỘNG (ADR 0018) — chủ kho
duyệt đích danh ở Cổng Phạm vi.

## Ý định (chủ kho 14/10)

Lộ trình và mốc là kế hoạch tổng; mỗi mốc là một chiến dịch; thanh bên là mỏ neo của chiến dịch đang chạy; kho
nhiều lộ trình thì chia theo lộ trình × mốc. Đích đo được: sau đổi tài khoản, đổi máy hay mất phiên, người không
phải hỏi «hiện trạng thế nào».

## Hai phần, một nguồn

**ADR 0025 (PR #351, chủ kho duyệt 14/10, điều phối chuyển giữa bước thiết kế):** lộ trình thành ràng buộc theo
bậc thang. Nấc 1 (ba cờ vàng) đi trong vòng này. Nấc 3 (tự thêm hàng) ADR xếp vào vòng này — máy khuyên dời sang vòng
plugin `lo-trinh` cùng nấc 2, chủ kho chọn ở Cổng Phạm vi (Hỏi-3). Nấc 2 và nấc 4 ngoài vòng.

Cả hai phần đọc CÙNG lớp phân tích lộ trình (`scripts/lo-trinh.mjs`) — không bộ đọc thứ hai.

### Phần 1 — ba cờ vàng (nấc 1 của ADR 0025)

**Cờ A — việc đang mở mà chưa thuộc mốc nào:**

- **Kho dùng mốc** ⟺ có ít nhất một lộ trình đọc được của kho khai ≥1 mốc. Đúng chữ chủ kho: «kho không dùng mốc
  vẫn chạy như cũ». Hệ quả có chủ ý: crm dùng mốc ở OKR nên lộ trình Việc và Dự án (0 mốc) cũng nhận cờ.
- **Hàng đang mở** ⟺ hàng có hồ sơ (thư mục slug hoặc hồ sơ nhận qua `lo_trinh_ma`) và chữ trạng thái thuộc nhóm
  đang làm (`DANG_LAM_O`) hoặc chưa bắt đầu (`CHUA_LAM_O` — hồ sơ có ô cơ hội chưa mở hợp đồng). Đã giao, xếp lại,
  đã bác, hỏng, không suy được → không cờ. Hàng chưa có hồ sơ → không cờ (chưa có vòng nào để neo).
- **Thuộc mốc** ⟺ mã hàng nằm trong `moc[].hang` của CHÍNH lộ trình chứa hàng.
- Cờ đặt ở `phanTichKho` (cấp kho, vì «kho dùng mốc» là phán đoán cấp kho), đẩy vào `coHang` của hàng và `co` của lộ
  trình — tức đi qua ĐÚNG đường mọi cờ khác đã đi: mục «Cần sửa trong kế hoạch», ô trạng thái của hàng (nền vàng
  `co-o`), khối dữ liệu (`can_sua`, `hang[].co`), thẻ start (dòng đếm cờ có sẵn). Câu thô: `hàng <mã>: đang mở
  vòng mà chưa thuộc mốc nào`; dòng `CO_DICH` mới dịch ra «đang làm mà chưa thuộc mốc nào — gắn việc này vào một
  mốc của kế hoạch».
- Không chặn: `product-map --check` chỉ đỏ khi trang vắng/lệch, không đọc số cờ. Mã thoát `--mo-o` không đổi.
  **Giới hạn khai:** kho dùng mốc có hàng đang mở ngoài mốc sẽ thấy trang đổi khi nâng engine — vẽ lại trang trong
  PR nhận bản (như mọi bản đổi trang), không phải lỗi.

**Cờ B — hồ sơ đang mở không thuộc việc nào:** hồ sơ trong `ngoaiLoTrinh` (đã tính trên cả kho ở `phanTichKho`)
mà ô bản đồ thuộc nhóm đang làm hoặc chưa bắt đầu (`cho-duyet`, `dang-dung`, `can-nhac`, `sap-mo`). Áp cho mọi kho
khai lộ trình (không cần mốc). Đặt vào `co` của lộ trình đọc được ĐẦU (như các cờ cấp kho khác qua `dat(null, …)`), mỗi
hồ sơ một lần. Câu thô `hồ sơ <slug> đang mở mà không thuộc việc nào trong kế hoạch`; `CO_DICH` dịch thêm vế «— thêm
việc cho nó, hoặc ghi mã việc vào hồ sơ». Khối «hồ sơ không thuộc kế hoạch nào» cuối trang giữ nguyên (liệt mọi hồ
sơ ngoài, kể cả đã đóng). Số đo 14/10: crm 10 hồ sơ (9 cân nhắc, 1 đang dựng), kit 15.

**Cờ C — kho chưa khai lộ trình:** chỉ có mặt ở thẻ start (kho không khai thì không có trang). Bộ quét start thêm một
khoá cấp gốc mang đúng một câu khi kho có `_acceptance/config.yaml` mà không khai `lo_trinh.tep`, `null` khi có khai;
`loTrinh` vẫn `null` (bộ đọc cũ không đổi). Thân lệnh start (khối START-LO-TRINH) in nguyên câu đó — thay luật cũ «kho
không dùng lộ trình không thấy gì». Bốn kho trên máy không khai (radar, oneflow, artifact-platform, media-library)
sẽ thấy đúng một dòng vàng, không gì khác đổi.

### Phần 2 — tên phiên và nhóm thanh bên do một hàm sinh

`tenChienDich({ hang, moc, tenLoTrinh, nhieuLoTrinh, kho })` → `{ moc, ten_phien, nhom }` (thuần, không đọc đĩa).

| Ô | Luật |
|---|---|
| tên ngắn hàng | `ten_ngan` → `ten` → câu giao bỏ «» cắt 6 từ (thêm «…» khi cắt) |
| mốc của hàng | các mốc của lộ trình có mã hàng trong `hang`; nhiều mốc → ngày sớm nhất, bằng ngày → mốc đứng trước trong tệp; không có → `null` |
| tên ngắn mốc | `ten_ngan` → `ten` cắt ở dấu tách đầu tiên trong « — », « (», «; », «: » ; thêm « dd/mm» khi `ngay` dạng YYYY-MM-DD |
| tên lộ trình | `ten_ngan` gốc tệp → `ten` → tên tệp bỏ `lo-trinh-` và `.json` |
| kho | tên thư mục của bản checkout chính (cha của `git rev-parse --git-common-dir`); không phải kho git → tên thư mục gốc |
| `ten_phien` | `<mã> · <tên ngắn hàng> (<kho>)` |
| `nhom` | mốc `null` → `null`; kho khai ≥2 tệp lộ trình → `<tên lộ trình> · <tên ngắn mốc>`; còn lại → `<tên ngắn mốc>` |
| `moc` | `{ ten, ngay, ten_ngan }` hoặc `null` |

Số đo 14/10 làm nền cho luật tên: crm ghi `ten_ngan` ở 124/124 hàng OKR, 14/14 Việc và Dự án; tên lộ trình crm đã
ngắn («OKR», «Kho tài liệu», «Việc và Dự án»); tên mốc dài cả hai kho («R2 lên production (tạm — …)» → «R2 lên
production 31/10»; «Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — …» → «Tinh chỉnh sau hai đợt thử 05/11»).

**Lệnh mở việc** (`lo-trinh.mjs --hang <mã> --mo-o`, khối S0-MO-O): JSON in thêm ba khoá `moc`, `ten_phien`,
`nhom` ở CẢ hai nhánh (`moi: true` và `moi: false`); hai khoá cũ giữ nguyên chỗ và nghĩa; mã thoát không đổi. Lối
đọc một hàng (không `--mo-o`) giữ nguyên — nó in dữ liệu tệp nguyên văn.

**Ô cơ hội** (`dungCoHoi`): kho dùng mốc → thêm đúng một dòng ngay sau dòng «Mở từ hàng …»: `Mốc: <tên mốc> —
<dd/mm/yyyy>.` hoặc `Mốc: chưa gắn — việc này chưa thuộc mốc nào của kế hoạch; gắn nó vào một mốc, hoặc ghi vì
sao chưa.` Kho không dùng mốc → ô như cũ từng byte. Đây là «dòng trên thẻ Cổng Đáng sẵn có»: hôm nay Cổng Đáng
của ô chưa có thẻ riêng (giới hạn đã khai ở lệnh thẻ), nên người đọc ô cơ hội — dòng nằm ở đó, không thêm lượt gọi.

**SKILL feature-loop S0** thêm khối máy đọc `S0-TEN-CHIEN-DICH` liệt ba khoá và một đoạn: sau khi chạy khối
S0-MO-O, in `ten_phien` và `nhom` (hoặc dòng «chưa gắn mốc»); phiên chạy trên app desktop có công cụ đặt tên phiên
và xếp nhóm thanh bên thì đặt tên = `ten_phien`, chuyển phiên vào nhóm tên = `nhom` (tạo khi chưa có); `nhom`
null → không xếp. Mặt không có thanh bên chỉ in. Ca đo rút ba khoá từ khối và so với khoá lệnh in (hai chiều).

**Chỗ nối cho M5 (ngoài vòng):** `tenChienDich` và `tenKho` là export của `scripts/lo-trinh.mjs`; chip gói
`dieu-phoi` gọi chúng thay vì đặt tên tay. Vòng này KHÔNG chạm `dieu-phoi/`.

## Phương án bị loại

- **Đặt cờ trong `suyTrangThai` (cấp tệp):** không biết kho có lộ trình khác mang mốc → Việc và Dự án của crm im.
- **Chặn mở vòng khi hàng chưa có mốc:** trái «chỉ cảnh báo» và luật 26/09 (không đổi mặc định).
- **Khoá cấu hình mới cho tên kho:** CỘNG thêm một mặt cấu hình; tên thư mục đủ cho hai kho đang chạy (crm → `crm`).
  Lối ấy để làm câu hỏi ở Cổng Phạm vi (kit hiện ra là `acceptance-gate-kit`, không phải `kit`).
- **Nhà ở gói `dieu-phoi`** (hạt giống gợi ý): MacBook Pro và Mac Studio mở vòng bằng feature-loop chứ không qua chip
  dieu-phoi; hàm ở lớp lộ trình thì cả hai đường gọi được.

## Đo trước (14/10, bộ máy gốc f4e717bf)

| Kho · lộ trình | mốc | hàng | đang mở | đang mở ngoài mốc | cờ hiện có |
|---|---|---|---|---|---|
| crm OKR | 19 | 124 | 13 | 4 (F8, F23, F24, F26) | 12 |
| crm Kho tài liệu | 6 | 12 | 1 | 0 | 2 |
| crm Việc và Dự án | 0 | 14 | 1 | 1 (DA0c) | 4 |
| kit | 11 | 37 → 38 (MC1) | 0 | 0 | 3 |
| radar · oneflow · artifact-platform · media-library | — | không khai lộ trình | | | |

Dự báo sau: crm OKR 12→26 (4 cờ A + 10 cờ B — cờ B ở lộ trình đầu) · Kho tài liệu 2→2 · Việc và Dự án 4→5; kit 3→18
(15 cờ B); bốn kho không khai: thẻ start thêm đúng một dòng cờ C.

## Dự báo năm dòng (luật (c))

| Dòng | Dự báo | Vì sao |
|---|---|---|
| làm-xong → quyết-được | = | Không đổi cổng |
| lượt gọi người / vòng | ↓ (ngoài thiết kế) | Bỏ lượt hỏi «hiện trạng» sau đổi tài khoản; đo ở lần đổi kế |
| vòng bị hạ tầng đốt lượt chấm | = | |
| token máy / vòng | = | Không chạm workflow |
| phút máy / lượt chấm | ≈ (+ ca đo mới, < 30 s) | |

Điều kiện tin cậy: đường verdict không đổi thành phần.
