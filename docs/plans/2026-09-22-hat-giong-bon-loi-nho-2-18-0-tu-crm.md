# Hạt giống — Bốn lỗi nhỏ của 2.18.0 lộ ra trong ngày crm cài: một vòng `2.18.1`, không phải bốn ô

**Ngày:** 2026-09-22 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2
(bốn vá điểm trong `scripts/gate-card.js`, `commands/observed.md`, `scripts/khong-can-nguoi.mjs`,
`GUIDE.md` §5.3 + `tests/`; không đổi luật).
Gốc: crm/_acceptance/loi-vao-dieu-phoi-30-ngay — (1) `observed` không đóng cửa veto; NOTE «cửa veto đang mở» còn in sau khi hồ sơ đã `da-cham-boi-thuc-te` (21/09 14:xx).
Gốc: crm/_acceptance/nhan-ung-dung-noi-tieng-viet — (2) + (3): sáu lệnh `observed` đổi trạng thái mà `PRODUCT-MAP.md` không vẽ lại; CI crm đỏ «bản đồ lệch» vì `scripts/product-map.mjs` vendored là bản 2.17 không đọc trạng thái mới — tệp ấy KHÔNG nằm trong lớp CI 10 tệp của GUIDE §5.3 (crm-rollout tự vá `4289ae2b`, PR crm #70).
Gốc: crm/_acceptance/khai-lang-gioi-thieu — (4) báo cáo để trống «Ngoài hợp đồng» trong khi `review-findings.md` có 2 mục → `khong-can-nguoi.mjs` gọi xanh-sạch → thẻ in «veto hay để yên» trong khi owner đang **ký** (owner tự nhận ra 22/09).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Vì sao MỘT hạt giống, không phải ba chip

Phiên crm-rollout đã mở ba chip sang kit, mỗi chip một lỗi. Bấm cả ba là ba ô trong một cửa
sổ — luật chiều rộng (b) chỉ cho **một** vòng meta giữa hai mốc kho nhận, và 22/35 ô của
08–18/09 sinh đúng từ nghi thức kiểu này. Bốn lỗi cùng một mốc, cùng một ngày, cùng một kho
tiêu thụ, cùng cỡ vá-điểm → **một vòng `2.18.1`** khi owner gọi tên, `Gốc:` là ba dòng trên.
Đây cũng là lần đầu lỗi của kit có neo là kho tiêu thụ *trong ngày cài* — đúng vế 4 luật (b).

## Bốn lỗ, mỗi lỗ một chiều đỏ

| # | Lỗ | Tệp | Chiều đỏ của ca |
|---|---|---|---|
| 1 | Bộ đếm cửa veto không coi `observed` là đã đóng (`scanState` `may-di-tiep-veto-mo` còn đúng sau `da-cham-boi-thuc-te`) | `scripts/gate-card.js` ~969, `scripts/start-scan.mjs` | hồ sơ `da-cham-boi-thuc-te` + `veto_state: mo` → thẻ mở phiên KHÔNG in «cửa veto đang mở» |
| 2 | `observed` không vẽ lại `PRODUCT-MAP.md` (trong khi `signoff` vẽ, ADR 0007/0019) | `commands/observed.md` bước cuối | sau `observed`, `product-map --check` phải khớp; gỡ bước vẽ → đỏ |
| 3 | Lớp CI vendored thiếu `scripts/product-map.mjs` — tệp CI của kho tiêu thụ chạy trực tiếp | `GUIDE.md` §5.3 (9→10→11 tệp), ca canh danh sách (`guide-chep-ci-buoc-vao-writer`) | bản 2.17 của tệp ấy trên fixture có hồ sơ trạng thái mới → `--check` đỏ; bản 2.18 → khớp |
| 4 | `khong-can-nguoi.mjs` đọc «Ngoài hợp đồng» của **báo cáo**, không đối chiếu `review-findings.md` → fail-open làn V (đã ghi 20/09 ở `vong-ghim-lai-noi-ra-o-khong-do`, TÁI PHÁT); mặt thấy được: `MAY_DI_TIEP` sai → thẻ in «veto hay để yên» thay «ký hay trả» | `scripts/khong-can-nguoi.mjs` :66, `scripts/gate-card.js` :976 | báo cáo rỗng mục + findings 2 mục → làn V phải nói «không xanh-sạch», thẻ phải in «ký hay trả» |

Việc 4 là gốc; 1–3 là vá điểm. Không việc nào là CỘNG.

Ngưỡng mở ô: **đã đủ** (bốn ca thật một ngày). Mở khi owner gọi tên `2.18.1`, sau khi crm cài
2.18.0 xong (đang cài — PR crm #70 đã gộp, vòng `khai-lang-gioi-thieu` đã ký trên 2.18.0).
