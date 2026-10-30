# Thiết kế — lenh-dot-ghi-dung-hang (hàng TC2)

Ô: `_acceptance/lenh-dot-ghi-dung-hang/opportunity.md` (Cổng Đáng `build` 25/10). Hàng TC2 của
`docs/plans/lo-trinh-kit.json`. Hạt giống `docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md`
mục 3, 5, 6. Đầu vào thêm: M5 báo ở kit #308 mục c5 (29/10).

## 1. Một kết quả

Lệnh của đợt ghi đúng hàng: đơn xin lượt mang hàng đang chấm, lệnh thêm hàng mang đúng slug và mã của lộ trình, dãy đã
nghỉ chạy lại bằng lệnh, và (Hỏi-1) lịch thôi chỉ dãy vào một hồ sơ T1 đã gộp. Giám sát không còn sửa tay
`hang-viec.json` trong khoá; thợ không còn bị gửi vào hàng đã xong.

## 2. Bốn lỗ, bốn chỗ sửa

### 2.1 Đơn xin lượt mang hàng đang chấm (`ghi.mjs` · `ghiDon`)

Hôm nay `slug ?? slugKeCua(...)`: không cờ thì đơn mang hàng KẾ mà bộ phát lịch muốn dãy làm (`tiep/<dãy>.json`). Hồ sơ
vừa sang đã thông trong worktree thì lịch đã chuyển `tiep` sang hàng sau, nên mọi lượt chấm lại hay ghim lại của chính
hàng ấy xin khoá dưới tên hàng sau.

Thứ tự nguồn slug mới, cho ba loại lượt chạm hồ sơ đã có hợp đồng — `s4`, `ghim-lai`, `merge`:

1. `--slug` (như cũ, luôn thắng);
2. hồ sơ của dãy trong worktree — hàng của dãy (theo `hang-viec.json`, không quét mọi thư mục `_acceptance/`) có
   `_acceptance/<slug>/contract.md` trong worktree mà CHƯA gộp (bản trên `origin/<nhanh_chinh>` vắng hoặc chưa «đã gộp»,
   §2.4) — xét theo BẬC của loại lượt:
   - `s4`: bậc một = đang chấm (`implemented`, `verified`), bậc hai = đã thông (`signed-off`, `machine-cleared`,
     `da-cham-boi-thuc-te`) — chấm lại sau ký;
   - `ghim-lai`, `merge`: chỉ bậc đã thông.
   Bậc đầu có đúng một hồ sơ → đơn mang nó; có từ hai → từ chối, thoát 1, in tên các hồ sơ và lời dặn `--slug`, không
   ghi byte nào; bậc rỗng → xét bậc sau;
3. `tiep/` rồi hàng ưu tiên đầu (như cũ).

Ca thường nhất của khoảng ký→gộp — A đã ký chờ gộp, B đang chấm trên cùng nhánh, `tiep` trỏ B — vì thế ra `s4` → B,
`ghim-lai`/`merge` → A, không từ chối (phản biện F1: một luật «từ hai ứng viên thì từ chối» phẳng sẽ chặn đúng ca này).

`duong-nen` giữ lối cũ: đường nền chạy ở S1 của hàng KẾ, trước khi hợp đồng của nó tồn tại — bước 2 sẽ trả hàng trước
đã ký mà chưa gộp, sai hàng.

Bước «chưa gộp» dùng chung một hàm với bộ phát lịch (`daGopTrenNhanhChinh`, §2.4) để hai bên không lệch nghĩa «xong».

### 2.2 `hang them` nhận mã hay slug của lộ trình (`hang.mjs` · `themHangTrongKhoa`, `nguon-hang.mjs` · `timHangLoTrinh`)

Hôm nay: không thấy trong `hang-viec.json` thì `suySlug(khoa)` — luật suy slug từ CÂU GIAO (chữ thường, sáu từ). `F12`
thành `f12`; slug bảy từ bị cắt còn sáu; hàng mới không mang `ma`.

Thứ tự mới: `hang-viec.json` (như cũ) → tệp lộ trình mà nguồn hàng của đợt trỏ tới, khớp `ma` rồi khớp `slug` (đúng
một tệp) → lấy `slug`, `ma`, `vung` của hàng → đối số đã có dạng slug (`^[a-z0-9]+(-[a-z0-9]+)*$`) thì giữ nguyên →
còn lại mới `suySlug`. Hàng thêm từ lộ trình mang `ma`. Vùng tệp đi theo luật cũ (`--ranh-gioi` thắng, rồi `vung`).

### 2.3 `hang chay-lai <dãy>` (`hang.mjs` · `choChayLai`, `dieu-phoi.mjs`)

Ngược của `hang nghi`, cùng khuôn: trong khoá `hang-viec.khoa`, gỡ khoá `nghi` của dãy, một dòng Nhật ký «cho <dãy>
chạy lại», một sự kiện `doi-ke-hoach` `kieu: chay-lai`; dãy chưa nghỉ thì «không đổi gì», không ghi gì. Gỡ hẳn khoá
(không để `nghi: false`) để tệp sau `chay-lai` giống từng byte tệp trước `nghi`. Nhịp kế của bộ phát lịch trả hàng kế cho
dãy như chưa từng nghỉ.

### 2.4 (Hỏi-1) Hồ sơ T1 đã gộp không còn là «đang làm» (`phat-lich.mjs` · `tienDoCua`)

M5 (#308 c5): hồ sơ T1 không qua cổng nên giữ `status: draft` mãi; `tienDoCua` chỉ tính «gộp» khi bản trên nhánh chính
đã thông, nên hồ sơ T1 đã gộp vẫn là `dang` — `chonHangKe` trả nó làm hàng đang làm, `tiep/` trỏ nó, lời ghi danh của
`tiep-tuc`/`ban-giao` bảo thợ chạy feature-loop trên hồ sơ đã xong. Đo ở kho tiêu thụ 29/10: hai hồ sơ trên nhánh chính
mang `risk_tier: T1` + `status: draft`.

Sửa: hàm dùng chung `daGopTrenNhanhChinh(vănBảnHợpĐồngTrênNhánhChính)` = đã thông, HOẶC `risk_tier: T1` (chú thích sau
dấu `#` bỏ qua). Hồ sơ T1 chưa lên nhánh chính vẫn là `dang` như cũ; T2/T3 không đổi. Kho không có hồ sơ T1: không đổi
gì.

Lối khác: «nhánh của dãy mang hồ sơ khác» (gợi ý thứ hai của M5) — bỏ, vì một dãy làm nhiều hồ sơ trên cùng nhánh là ca
thường (hồ sơ phụ, hàng nối tiếp), suy «xong» từ việc có hồ sơ khác là đoán.

## 3. Không làm

- `hang uu-tien <mã> <số>` (TC-C1) — CỘNG, chỉ mở khi chủ kho gọi tên.
- Lệnh rút đơn `xin/` chưa cấp, `ban-giao-xong --wip` dùng `git add -A` (#308 c3, c4) — hạt giống cửa sổ sau.
- Sửa thư mục đợt đang chạy ở kho tiêu thụ — kho nhận theo bản phát hành.
- Đổi `suySlug` (luật suy từ câu giao) — giữ nguyên, bản chép của `scripts/lo-trinh.mjs`.

## 4. Độ phủ (quét hình thái, preset test-matrix)

Trục: A lệnh (xin · hang them · hang chay-lai · lịch) × B nguồn đúng (cờ · hồ sơ worktree · lộ trình · khuôn slug ·
câu tự do · trạng thái dãy · T1 trên nhánh chính) × C số ứng viên (0 · 1 · ≥2) × D lần chạy (một · hai).

- xin × hồ sơ worktree × {0,1,≥2} → AC-1, AC-2. xin × loại lượt (s4 · ghim-lai · merge · duong-nen) → AC-2.
- hang them × {lộ trình theo mã, theo slug} → AC-3. × {khuôn slug, câu tự do, mã ngoài lộ trình} × D → AC-4.
- chay-lai × {nghỉ, chưa nghỉ, dãy vắng} × D → AC-5, AC-6.
- lịch × T1 {trên nhánh chính, chỉ worktree} × T2 draft → AC-7.
- Đường đọc-cũ (kho luôn truyền `--slug`, không T1, không nghỉ) → AC-8. Lời dặn → AC-9. Bộ cũ không vỡ → AC-10.
- [NGÀNH: kubectl `cordon`/`uncordon` — lệnh ngược đối xứng, chạy lại không đổi gì] · [NGÀNH: Git refspec — tên đầy
  đủ thắng tên ngắn, nhập nhằng thì từ chối thay vì đoán].
- Later: `hang uu-tien` (TC-C1). Never: đoán hàng từ tên nhánh git của worktree.
