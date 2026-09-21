# Hạt giống — tác nhân chấm ghi vào cây giữa lượt chấm (21/09/2026)

Gốc: crm/_acceptance/dieu-phoi-30-ngay-dau — lượt chấm D (`wf_c1b6bb97-4a5`, 06:18–06:21 UTC): tác nhân chạy E2 tự commit `508ed3f7` chạm vật và khối evidence-report; phiên revert, sổ `d-20260921T061816Z-16`. Lần hai trong 24 giờ ở cùng hồ sơ (lần đầu `a559192c`/`03a09dc7`, revert `dfd664d6`).

Phát hiện trong vòng: `_acceptance/nhan-trang-thai-va-reality/` (Notes của hợp đồng trích lại tệp này).

**Hình dạng:** HEAD dời trong lúc lượt chấm chạy, commit do tác nhân chấm tạo. Vòng
`nhan-trang-thai-va-reality` (AC-3) chỉ giữ THƯỚC chỉ-đọc (`evals.yaml` · `rang/` ·
`config.yaml` · test kho), nên phần commit chạm test kho bị bắt thành *thước lệch*, còn
phần chạm vật và báo cáo thì không.

**Ý (chưa phải cam kết):** ảnh chụp trước lượt đã ghi `sha`; sau lượt, HEAD ≠ sha
trước hoặc cây bẩn ngoài `.acceptance-runs/` → nhãn riêng (lượt chấm đã ghi vào cây),
lượt ấy không dùng được. Không mở ô trong cửa sổ 2.18.0 (luật chiều rộng (b)).

**Ngưỡng mở:** một lần nữa ở bất kỳ kho nào sau khi `crm` cài 2.18.0.
