# Cửa tín hiệu giữa chiến dịch — thiết kế (hàng RM3)

Hồ sơ `_acceptance/cua-tin-hieu-giua-chien-dich/` · T2 · chủ kho ký Cổng Đáng 15/10 · hướng B′ §10–§11
(`docs/findings/2026-10-14-kien-truc-roadmap-plugin.md`, ADR 0025 bổ sung 14/10) · nhánh dựng cắt từ đỉnh RM2
(`ap-chinh-sach-lo-trinh`, đã ký).

## 1. Một phút

Hôm nay mọi yêu cầu `viec-phu` / `hang-moi` của thợ trong đợt đều trả `can_phan` (`dieu-phoi/scripts/yeu-cau.mjs`)
→ giám sát bị đánh thức, có khi leo lên chủ kho, dù ý đó không chặn việc nào. Người chưa có lệnh để gửi một ý giữa
chừng. Vòng này áp luật phân loại B′ §10:

| Ý nêu giữa chiến dịch | Hôm nay | Sau vòng |
|---|---|---|
| Việc phụ / việc mới **khai chặn** việc đang chạy | `can_phan` | `can_phan` (không đổi) — đường duy nhất phán giữa chừng |
| Việc phụ / việc mới **không chặn**, kho có cửa tín hiệu | `can_phan` | một tệp tín hiệu trong cửa của kho + trả «đã ghi, xử ở mốc khép», không sự kiện `can_phan` |
| Như trên, kho **không khai** cửa (hoặc đợt không có gốc kho) | `can_phan` | `can_phan` (không đổi — kho không có cửa không mất gì) |
| Như trên, ghi vào cửa **lỗi** | — | `can_phan` kèm lý do gọi tên — không mất ý |
| Trùng một yêu cầu trong 24 giờ | `gop` | `gop` (không đổi, không đẻ tệp thứ hai) |
| Ý của **người** | (không có đường) | `/road-map:gui <câu>` → tệp `loai: tin-hieu` trong cửa + cùng câu trả |
| Mốc khép | không ai nhắc cửa | thẻ khởi động in «Cửa tín hiệu: N ý chờ gom …» khi N > 0 |

## 2. Quét độ phủ (morphological-scan, preset entity-feature)

**Ngữ cảnh.** Chân sản phẩm: [SUY-TỪ-REPO: docs/findings/2026-10-14-kien-truc-roadmap-plugin.md] §10–§11,
[SUY-TỪ-REPO: dieu-phoi/scripts/yeu-cau.mjs], [SUY-TỪ-REPO: skills/acceptance/references/tin-hieu-template.md].
Chân ngành: [NGÀNH: Linear Triage] — việc mới từ ngoài vào hộp phân loại, không vào thẳng chu kỳ đang chạy;
[NGÀNH: Scrum Guide 2020] — Sprint Goal giữ cố định trong Sprint, việc mới vào Product Backlog và chỉ được kéo vào
Sprint ở lần lập kế hoạch kế.

**Trục.**
- A · Người nêu: thợ trong đợt | người (chủ kho) | thợ ngoài đợt. [thước CE: B′ §11 «cùng khuôn với thợ»]
- B · Loại ý: `viec-phu` | `hang-moi` | `tin-hieu` (người) | loại vận hành khác (`cham-tep`, `s4-gom`, `gia-han`,
  `can-nguoi`, `chuyen-hang`, `khac`). [thước CE: khối TIN-HIEU-LOAI + danh sách loại ở `dieu-phoi/scripts/mau/LUAT.md`]
- C · Chặn: chặn | không chặn. [thước CE: bảng B′ §10]
- D · Cửa: có cửa ghi được | kho không khai cửa / đợt không có gốc kho | ghi lỗi | trùng 24 giờ.
  [thước CE: `kiemCauHinh` (goc_kho tuỳ chọn) + `xetViecPhu` (nhánh gộp)]

**Core** (11 trên ~48 ô có nghĩa ≈ 23 %, gộp được thành 10 tiêu chí):
1. thợ-đợt × viec-phu × không chặn × có cửa → ghi + trả lời (AC-1, AC-3)
2. thợ-đợt × hang-moi × không chặn × có cửa → ghi + trả lời (AC-1, AC-3)
3. thợ-đợt × viec-phu/hang-moi × chặn → `can_phan` như nay (AC-2)
4. × không cửa → như nay, từng byte (AC-4)
5. × ghi lỗi → `can_phan` có tên (AC-5)
6. × trùng → `gop`, không tệp mới (AC-3)
7. loại vận hành khác × mọi D → không đổi (AC-4, vi phân)
8. người × tin-hieu × có cửa / không cửa (AC-7)
9. bộ đọc khoá cửa trong gói điều phối khớp bộ đọc của kit (AC-6)
10. mốc khép đọc được cửa trên thẻ đã có (AC-8)
11. gói điều phối chép phẳng vào đợt vẫn ghi được (AC-10) · luật cho thợ khai chặn đúng chỗ (AC-9)

**Later.** Thợ ngoài đợt dùng chính `/road-map:gui` (chạy được, không đo riêng) · răng `cat-luot.mjs --co` cho hàng mới
trỏ mốc đang chạy (B′ §10 «cắt lượt dưới đóng băng») · máy tự commit tệp tín hiệu.
**Never.** Ý người vào thư mục yêu cầu của đợt (glossary «Tín hiệu» _Avoid_) · máy tự gom hay tự cắt lượt giữa chiến
dịch (đóng băng B′ §10) · ý không chặn vào thẳng lộ trình.

## 3. Thiết kế

### 3.1 Khai chặn

Trường `noi_dung.chan: true` trên yêu cầu; lệnh `dieu-phoi.mjs yeu-cau <loại> --chan`. Không suy chặn từ loại:
`hang-moi` mang cả hai nghĩa (S0 hàng chưa có ô — thợ đứng chờ; Cổng Bằng chứng «mở hợp đồng mới» — không ai chờ).

### 3.2 Bộ xét (`dieu-phoi/scripts/yeu-cau.mjs`)

`viec-phu` và `hang-moi` đi chung một hàm, thứ tự giữ «kho không cửa = từng byte như cũ» (gap-probe P1):
1. Ngữ cảnh không có cửa (`nguCanh.cua == null`) → đường cũ nguyên vẹn: `viec-phu` qua `xetViecPhu` (gộp 24 giờ hoặc
   «việc phụ mới»), `hang-moi` → «loại hang-moi cần phán».
2. `chan === true` → `{ket_qua:'can_phan', ly_do:'việc phụ chặn việc đang chạy'}` (hay «việc mới …»).
3. Trùng trong 24 giờ (luật của `xetViecPhu`, ở đây mở cho cả `hang-moi`) → `gop`.
4. Còn lại → `{ket_qua:'ghi', boi:'may', ly_do: CAU_DA_GHI + ' — chặn việc đang làm thì gửi lại kèm --chan'}`;
   `CAU_DA_GHI = 'đã ghi, xử ở mốc khép'` là hằng một nguồn ở `dieu-phoi/scripts/cua-tin-hieu.mjs`, lệnh của người in
   đúng hằng ấy. Chiều mặc định (không chặn, opt-in `--chan`) là câu hỏi cho chủ kho ở Cổng Phạm vi (sổ, dòng
   supersedes d-…-3).

### 3.3 Chuyển vào cửa (`phat-lich.mjs` → `chuyenVaoCua`)

`xuLyYeuCau` dựng `nguCanh.cua` một lần mỗi nhịp: `docCua(cfg.goc_kho)` đọc `<goc_kho>/_acceptance/config.yaml`
khối `tin_hieu`, lấy thư mục nguồn ĐẦU. Kết quả `ghi` → `chuyenVaoCua(cua, yc)` ghi `<nguon>/<id>.json` với thân
`{phien, loai, hang, noi_dung, luc}` giữ nguyên thân yêu cầu (khuôn tín hiệu = khuôn yêu cầu, qua `kiemYeuCau`),
tạo độc quyền (tệp tạm rồi `link` — không bao giờ đè), rồi mới ghi `tra-loi/<id>.json`. Tệp đã có cùng thân → không
ghi lại (nhịp xét hai lần không đẻ tệp thứ hai). Tệp đã có KHÁC thân → không đè, hạ về `can_phan` «id trùng một ý khác
trong cửa — <tệp>». Lệnh người gặp số đã có thì tăng `n` và thử lại (gap-probe P1). Ghi lỗi → hạ về `can_phan` với `ly_do: 'không ghi được vào cửa tín hiệu — <mã lỗi>'`.
Sự kiện mang `kieu`, `chan` (true/false) và `ket_qua` — đường đo của ngưỡng đọc chúng.

Bộ đọc khoá: gói điều phối chép phẳng vào `<thư mục đợt>/loi/` nên không import mã kit; `cua-tin-hieu.mjs` mang bản
chép ESM của `khoaTinHieu` (`scripts/tin-hieu-khoa.cjs`), và một ca round-trip so hai bản trên ma trận cấu hình
(tiền lệ `nguon-hang.mjs` + ca DP2-08).

### 3.4 Lệnh người `/road-map:gui`

`road-map/commands/gui.md` (mở model-invocation, B′ §11) giải `$AG` như `/road-map:xem` rồi chạy
`node "$AG/scripts/gui-tin-hieu.mjs" --root . --noi-dung "<câu>"`. Script là vỏ mỏng gọi CÙNG `ghiVaoCua` của
`dieu-phoi/scripts/cua-tin-hieu.mjs` (một bộ ghi cho thợ và người): `phien = nguoi-<suy từ git user.name>`, `id =
<phien>-<n kế tiếp trong thư mục>`, `loai: tin-hieu`, `noi_dung.tieu_de` = câu. In đúng `CAU_DA_GHI` + đường tệp.
Kho không khai cửa → thoát 1, một dòng chỉ chỗ khai `tin_hieu` trong `_acceptance/config.yaml`, không ghi tệp. Câu
rỗng → thoát 2.

### 3.5 Mốc khép đọc cửa

`scripts/start-scan.mjs` (không chạm `lo-trinh.mjs` — RM6 đi sau RM2 trên tệp ấy): kho khai cửa và
`tin-hieu.mjs --chua-gom` (gọi hàm, không gọi tiến trình) có N > 0 tín hiệu → đúng một dòng
`Cửa tín hiệu: N ý chờ gom ở mốc khép — gom bằng skill gom-tin-hieu` trên thẻ đã có. N = 0, kho không khai cửa, hay
đọc lỗi → thẻ giữ từng byte (đọc lỗi in một dòng `!` như rà soát).

### 3.6 Luật cho thợ

- Khối TRONG-DOT của `feature-loop/skills/feature-loop/SKILL.md`, gạch S0 «hàng chưa có ô»: yêu cầu `hang-moi` mang
  `--chan` (thợ đứng chờ trả lời).
- `dieu-phoi/scripts/mau/LUAT.md`: một dòng «việc phụ / việc mới không chặn → được trả "đã ghi", làm tiếp việc đang
  làm; chỉ khai `--chan` khi không đi tiếp được nếu thiếu nó».

## 4. Giới hạn đã khai

- Tệp tín hiệu nằm trên đĩa của máy chạy đợt, chưa theo dõi bởi git, cho tới khi phiên gom commit nó cùng bản gom
  (bước 3 của skill gom-tin-hieu). Lưới cây bẩn của làn ghim lại bỏ qua tệp chưa theo dõi (`--untracked-files=no`).
- Mốc nền chưa đo (nhật ký đợt chỉ ở máy M5) — xin trên issue #308; ngưỡng vẫn đọc được từ sổ sự kiện của đợt kế.
- Ý của thợ NGOÀI đợt (phiên thợ thường) đi `/road-map:gui` như người — không đo riêng.
- Thợ bị chặn mà quên `--chan`: nhận «đã ghi» kèm lối gửi lại; ngưỡng không đếm ca này.

## 5. Đường đo của ngưỡng

Câu `jq` ở mục «Đường đo» của hợp đồng: N = mọi yêu cầu việc-phụ/việc-mới `chan != true`; SỐNG khi N ≥ 1 và 0 trong
số đó `can_phan`, mỗi id `ghi` có tệp; N = 0 là «chưa đọc được». AC-1 chạy nguyên văn câu ấy trên sổ sinh trong lượt.
