# Thước sức khoẻ máy đo chỗ trống và tốc độ — design (SK1)

Ngày 21/10/2026 · hồ sơ `_acceptance/suc-khoe-cho-trong-va-toc-do/` · hàng lộ trình SK1 · T2.

## Ý định và vì sao

Bộ phát lịch của gói điều phối quyết có cấp lượt nặng (s4, ghim lại, đường nền) hay không. Hôm nay nó giảm
tải khi swap đã dùng vượt một ngưỡng cố định, và gọi người khi có một tiến trình bất kỳ giữ nhiều RAM. Điều tra
21/10 (`docs/findings/2026-10-21-suc-khoe-may-do-sai.md`) chứng: swap đã dùng là dấu vết của áp lực đã qua — nó
giảm vài chục MB mỗi giờ khi máy rảnh — nên một máy từng nghẹt đứng ở giảm tải nhiều giờ sau khi hết nghẹt; cả
hai máy đã phải nâng tay ngưỡng. Câu thước phải trả lời (lời M5, chủ kho chuyển nguyên): *cấp làn này lúc này thì
nó có đủ chỗ chạy sạch không, và máy có đang nghẹt không.*

Người hưởng: chủ kho (giờ từ làm-xong tới quyết-được không kéo dài vì một báo động giả; không bị gọi vì một model
chạy cục bộ hợp lệ) và phiên thợ (lượt chấm đỏ vì máy chật được gọi đúng tên, không bị tính là lỗi vật). Trace về
nguyên tố 2 — bằng chứng không tự dối: một lượt đỏ vì hạ tầng mà tính là đỏ vì vật là máy tin nhầm chính nó.

## Mục tiêu · không làm · phản mục tiêu

Mục tiêu — ba vế của chủ kho giao:
1. **Cấp làn theo chỗ trống.** Giảm tải toàn đợt chỉ khi áp lực bộ nhớ của hệ điều hành ở mức cảnh báo trở lên.
   Riêng từng lượt nặng: cấp khi chỗ trống ≥ nhu cầu của loại làn × hệ số (mặc định 1,5); thiếu chỗ thì đơn chờ
   kèm lý do có số, các loại khác vẫn được xét.
2. **Trong lúc chạy đo tốc độ, không đo tổng.** Khi một khoá nặng đang được giữ, áp lực ở mức cảnh báo kéo dài,
   hoặc tốc độ swapin vượt ngưỡng (khi kho đặt) kéo dài, thì lượt đó mang nhãn «chạy dưới tải». Lượt mang nhãn
   được thử lại một lần. Swap đã dùng và RSS lớn nhất chỉ được ghi vào trạng thái, không chặn, không gọi người.
3. **Hiệu chuẩn bằng sự thật.** Mỗi lượt khép ghi một dòng sổ đo cấp máy: chỗ trống lúc cấp, chỗ trống thấp nhất
   trong lượt, áp lực và tốc độ swapin cao nhất, nhãn dưới tải, cách khép (nhả hay thu hồi), mã thoát người thợ
   báo. Đủ mẫu thì nhu cầu của loại làn = p95 của «chỗ trống bị dùng» trong sổ, thắng số trong cấu hình.

Không làm:
- Hai khoá S4 mỗi máy (CỘNG) — hạt giống `docs/plans/2026-10-21-hat-giong-hai-khoa-s4.md`.
- Không đổi cách engine đếm lượt chấm (`s4-args`): lượt thử lại vì nhãn vẫn đếm vào trần của vòng.
- Không gây áp lực thật trên máy dùng chung trong bộ kiểm (`memory_pressure -l warn`) — chiều đỏ là số tiêm.
- Không đổi hành vi giảm tải theo áp lực (vẫn lật nhanh khi áp lực lật — quan sát §3 của finding).

Phản mục tiêu (đạt kỹ thuật mà vẫn hỏng):
- Thay báo động giả này bằng báo động giả khác: mặc định nhu cầu 16 GB của M5 chặn máy 36 GB gần như mọi lúc
  (36 × 46 % = 16,6 < 24). Mọi mặc định phải IM trên cả hai máy đã đo.
- Một hằng số chưa hiệu chuẩn mới đứng vào chỗ hằng 8 GB cũ.
- Đợt đang chạy với cấu hình cũ (`swap_gb`, `rss_gb`) vỡ khi nhận gói mới.

## Ràng buộc

- Gói điều phối là của mọi kho: luật «sửa kit vì sự cố của MỘT kho phải cân trên MỌI kho» (CLAUDE.md). Kho không
  gặp sự cố này mất gì: dòng «cần anh» vì RSS (đã bắt được một rò thật 10,2 GB trên MacBook Pro). Đổi lại, rò ấy
  làm hụt chỗ trống và hiện ở vế 1 khi nhu cầu đã biết.
- Đọc-cũ cấu hình: `swap_gb` và `rss_gb` vẫn được nhận (không còn bắt buộc, không còn chặn); khoá mới đều tuỳ chọn.
- Bộ phát lịch chạy mỗi 5 giây; mọi lệnh đọc số đo phải rẻ (`sysctl`, `vm_stat`, `ps` — không `lsof`).
- Không chú thích trong `dieu-phoi/scripts/` trừ dòng đầu mô-đun theo nếp sẵn; không chữ riêng của kho tiêu thụ
  (ca DP1-07); hằng thời gian sống trong `cau-hinh.mjs`.

## Phần cách làm đã chốt

**Số đo mới mỗi nhịp** (thêm vào bốn lệnh hiện có): `sysctl -n kern.memorystatus_level` (phần trăm bộ nhớ khả
dụng hệ điều hành báo), `sysctl -n hw.memsize` (RAM), `vm_stat` (bộ đếm Swapins và cỡ trang). Chỗ trống =
`memorystatus_level / 100 × RAM`. Tốc độ swapin = Δ Swapins × cỡ trang / Δ thời gian, so với mẫu của nhịp trước
lưu trong `trang-thai.json`. Đọc hỏng một số (lệnh lỗi, định dạng lạ) → số đó `null`, và quyết định dựa trên số
đó đi về phía hiện trạng trước SK1 (không chặn thêm, không im thêm): chỗ trống `null` thì không xét chỗ.

**Hàm đánh giá** `danhGiaSucKhoe` trả: `giamTai` (chỉ theo áp lực), `lyDo`, `choTrongGb`, `tocDoSwapinMbPhut`, và
khối `ghi` (swap đã dùng/tổng, tiến trình RSS lớn nhất) — `canNguoi` luôn `null` để bảng và `xem` đọc cũ không vỡ.
Hàm thuần mới `vuaLan(loai, sucKhoe, nhuCau, cfg)` → `{duoc, ly_do}`; `merge` luôn vừa; nhu cầu `null` → vừa.

**Nhu cầu của loại làn** — một hàm, ba nguồn theo thứ tự: (1) sổ đo cấp máy có ≥ `mau_hieu_chuan` (mặc định 5)
dòng SẠCH cùng kho và loại (không nhãn dưới tải, không
`ha_tang`, không `chong`) → p95 của `nhu_cau_gb` các dòng ấy — mẫu bẩn bị loại vì việc khác cùng lúc thổi phồng phần
hụt; (2) `suc_khoe.dinh_lan_gb.<loại>` trong cấu hình; (3) không có →
`null`, trạng thái ghi `chua_hieu_chuan: [<loại>]`. Không có mặc định số — đó là chỗ M5 đề xuất 16 GB. Đây là
**câu hỏi cho chủ kho ở Cổng Phạm vi (Hỏi-1)** vì nó là khẩu vị rủi ro: không số thì trước khi sổ đủ 5 lượt sạch, một
lượt cần nhiều RAM có thể bị hệ điều hành giết; mặc định theo tỉ lệ RAM che được lượt đầu nhưng là hằng chưa đo; 16 GB
chặn máy 36 GB. Bản nháp theo khuyến nghị: không số.

**Thiếu chỗ** là trạng thái chờ của một đơn, không phải giảm tải: đơn ở lại `xin/`, hàng chờ trong trạng thái mang
`cho: "thiếu chỗ: cần <a> GB, trống <b> GB"` — chuỗi ấy hiện cạnh đơn ở bảng đợt và `xem` — và một sự kiện `thieu-cho` không gọi người (`can_phan: false`) khi đơn
bước vào trạng thái đó (một lần, không lặp mỗi nhịp).

**Nhãn dưới tải**: tệp `do-dang-chay/<tài nguyên>.json` trong thư mục đợt, bộ phát lịch giữ cho mỗi khoá nặng đang
giữ, tạo lúc cấp kèm commit của worktree (`git -C <worktree> rev-parse HEAD`; đọc hỏng → `null`) (không ghi vào thư mục khoá — lệnh nhả xoá thư mục ấy bất cứ lúc nào). Mỗi nhịp cập nhật chỗ trống thấp nhất,
áp lực và tốc độ cao nhất, cờ `chong` (có khoá nặng khác cùng giữ), và đồng hồ «dưới tải» (áp lực ≥ `ap_luc_muc`, hoặc tốc độ ≥ `swapin_mb_phut` khi đặt).
Đồng hồ chạy liền ≥ `duoi_tai_phut` (mặc định 2) → ghi `duoi_tai: {tu, ly_do}`; một nhịp sạch đặt lại đồng hồ khi
chưa có nhãn, nhãn đã có thì giữ. Ngưỡng tốc độ không có mặc định (chưa có số lúc nghẹt thật); sổ đo ghi tốc độ cao
nhất của mỗi lượt để kho đặt được ngưỡng từ số.

**Khép lượt**: nhịp thấy khoá đã nhả hoặc vừa thu hồi mà còn tệp `do-dang-chay` → nối một dòng vào
`<thư mục máy>/do-lan.jsonl` (cùng chỗ với khoá s4 cấp máy, sống qua nhiều đợt) rồi xoá tệp. Lượt mang nhãn khép
→ sự kiện `luot-duoi-tai` với `duoc_thu_lai` = `true` lần đầu cho bộ (phiên, slug, loại, commit), `false` từ lần hai
— thử lại một lần cho mỗi commit được chấm, không phải một lần cho cả vòng; bộ đã dùng lấy từ chính sổ đo cấp máy. Lệnh
nhả nhận thêm `--ma <mã thoát>` và `--ha-tang <lý do>`; lệnh ghi chúng vào `do-dang-chay` trước khi xoá khoá.
Một lượt «bị hạ tầng đốt» = thu hồi, mã 137 hay 143, hoặc có `--ha-tang`.

**Lệnh `hieu-chuan`** của CLI đợt: đọc sổ đo cấp máy, in mỗi loại làn của kho đang chạy: số lượt, p95 nhu cầu,
nguồn nhu cầu đang dùng, và các lượt bị hạ tầng đốt kèm chỗ trống và áp lực lúc cấp.

**Luật thợ** (`mau/LUAT.md`): trước khi nhả khoá nặng, đọc `do-dang-chay/<tài nguyên>.json`; lượt mang nhãn mà
đỏ → nhả kèm `--ha-tang "duoi tai"`, chấm lại đúng commit đó một lần khi sự kiện cho `duoc_thu_lai: true`, không
sửa vật trước lần chấm lại; lần chấm lại vẫn đỏ thì đỏ là của vật.

**Cấu hình** (khối `suc_khoe`): `ap_luc_muc` (bắt buộc, như cũ) · `swap_gb`, `rss_gb` (tuỳ chọn, bỏ qua — đọc-cũ) ·
`he_so_cho` (> 1, mặc định 1,5) · `dinh_lan_gb` (object loại → GB dương) · `swapin_mb_phut` (dương) ·
`duoi_tai_phut` (dương, mặc định 2) · `mau_hieu_chuan` (nguyên ≥ 1, mặc định 5). Mẫu `mau/dieu-phoi.config.json`
bỏ `swap_gb`, `rss_gb`, giữ `ap_luc_muc`. Hằng mặc định nằm trong `cau-hinh.mjs`.

## Phần để người dựng

Tên hàm, chỗ tách mô-đun (một mô-đun `do-lan.mjs` cho sổ đo là hợp lý), cách đọc p95 (lấy phần tử thứ ⌈0,95·n⌉
sau khi sắp), chữ chính xác của bảng đợt cho chỗ trống và nhu cầu.
