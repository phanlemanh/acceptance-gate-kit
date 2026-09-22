# Hạt giống — ca đo neo vào ref TƯƠNG ĐỐI thì chết khi gộp: `main` đỏ hậu-gộp 2/2 mốc

**Ngày:** 2026-09-22 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: _acceptance/ho-so-khep-thoi-hoi — CI `main` đỏ ngay sau #202 (run 35698390482): HK-AC5-note lấy «bản trước vòng» bằng `merge-base HEAD origin/main`; sau gộp merge-base là chính bản đã vá → đối chứng dương đỏ, hai ca đi kèm xanh suông. Vá #203 (`5ebe8401`) neo vào `ba62e0bb^` rút bằng lệnh.
Gốc: _acceptance/release-2-18-0 — CI `main` đỏ sau #196 lượt đầu: 15 dòng nghỉ đổi định tuyến mà `routing-baseline.txt` chưa sinh lại (LM20, bẫy ADR 0019).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Lớp

Hai mốc liên tiếp, hai lần `main` đỏ NGAY SAU khi gộp PR đã xanh trên nhánh. Cùng hình: một ca
đo đúng trên NHÁNH vì nó neo vào thứ chỉ tồn tại tương đối với nhánh (merge-base, `origin/main`,
`HEAD^`, tệp sinh chưa cập nhật), và mệnh đề ấy hết đúng đúng lúc gộp. Đây là lớp «bất biến không
được nằm trong hồ sơ đã ký» (memory 12/09) hiện thân ở bộ ca. Phát hiện hôm nay chỉ có ở CI của
`main` — sau khi đã gộp, tức sau khi đã trả giá.

## Dạng nghiệm đúng tầng

1. **Neo là sha rút bằng lệnh từ lịch sử hồ sơ**, không phải ref: «cha của commit đầu đưa hợp đồng
   sang implemented» (khuôn NS-AC9-cu, `git archive` trọn thư mục) — áp cho mọi ca so «trước vòng».
2. **Lint một tầng** (không phải thước của thước): ca thường trực quét `tests/**` tìm `merge-base`,
   `origin/main`, `HEAD^`/`HEAD~` dùng làm nền đối chứng → đỏ có tên. Chiều im: neo bằng sha 40 hex
   hoặc rút từ `git log -- <contract>` → im.
3. **Mô phỏng hậu-gộp trên PR:** job CI chạy suite trên `git merge origin/main` của nhánh (cây sẽ
   thành `main`), để lớp này đỏ TRƯỚC khi gộp. Giá: một lượt suite nữa mỗi PR — chỉ bật cho PR chạm
   `tests/`.

Ngưỡng mở ô: đã chạm 2 lần trong 2 mốc (2.18.0, 2.18.1). Hai vế đầu là TRỪ; vế 3 là CỘNG, cần owner
phê đích danh (ADR 0018).
