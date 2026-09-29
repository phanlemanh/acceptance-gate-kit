# Hình tại điểm quyết định — Cổng 1, mot-so-ba-ve (T3)

Kê từ artifact cuối S1: 5 dòng sổ chờ seal · 1 chỗ design lệch bản neo (ô nói «cầu nối cuối S3», design chọn hook) · 1 dòng [GIẢ ĐỊNH] ở Coverage · finding gap-probe xử lý human-gate1 (đọc sau probe).

| Điểm | Đếm | Hình |
|---|---|---|
| d-1 bỏ đặc-tả-UX | 1 nhánh (làm/bỏ) | dưới ngưỡng: 1 nhánh |
| d-2 bỏ design-pass | 1 nhánh | dưới ngưỡng: 1 nhánh |
| d-3 cầu nối là hook (T3) thay lời dặn cuối S3 — lệch bản neo ô | 3 nhánh (hook · lời dặn cuối S3 · đọc transcript) + 5 bước luồng | CẦN HÌNH → `cau-noi-ba-duong` |
| d-4 ruling thiếu giá → nhãn, không bác | 2 nhánh (nhãn · bác) | CẦN HÌNH → gộp vào `dong-so-ba-ve` |
| d-5 KHÔNG đọc transcript | 1 nhánh | dưới ngưỡng (đã nằm trong hình d-3) |
| Coverage [GIẢ ĐỊNH] executing-plans cùng thư mục | 1 nhánh | dưới ngưỡng: 1 |
| Luồng dữ liệu §4.6: superpowers ghi → rm → hook → cầu nối → sổ → thẻ Treo → người phê | 7 bước nối tiếp | CẦN HÌNH → gộp vào `cau-noi-ba-duong` |

## Đề bài hình 1 — `cau-noi-ba-duong` (loại: flowchart có ba nhánh so sánh)

- Nút: superpowers ghi `Ruling:` vào `.superpowers/sdd/<plan>/progress.md` → Finish `rm -rf workspace` → **hook PreToolUse (Bash)** chặn → `cau-noi-ruling.mjs --write` gặt → `decisions.jsonl` (provisional, stage S3) → thẻ Cổng 2 khối Treo in ba vế → người phê / veto → seal.
- Ba nhánh song song ở bước «làm sao ruling tới sổ»: (A) hook chặn xoá — CHỌN, vật máy giữ, T3; (B) lời dặn «chạy cầu nối cuối S3» — bị loại vì workspace đã xoá trước bước ấy và luật lời đo 36 %; (C) đọc transcript — bị loại vì khuôn chat không có hợp đồng. Nhãn giá: A = «hook chạy trên mọi lệnh Bash, lọc rẻ», B = «thường gặt thư mục rỗng», C = «vỡ khi khuôn chat đổi».
- Nhãn bằng chữ tiếng Việt, cỡ đọc được; AC liên quan: AC-5, AC-6, AC-7.

## Đề bài hình 2 — `dong-so-ba-ve` (loại: so sánh ba hình dạng dòng → một dòng thẻ)

- Ba dòng vào: (1) dòng cũ `decision + impact` (+ overlay dịch) · (2) dòng mới `decision · why · cost_if_wrong` · (3) dòng gặt từ ruling hai vế (thiếu `cost_if_wrong`).
- Một bộ dựng `decBaVe` → ba dòng thẻ: (1) câu dịch hoặc `decision — impact` (đường đọc-cũ, cả ba khối) · (2) `decision — why — sai thì tốn: cost` · (3) `decision — why ⚠ chưa khai giá nếu sai`.
- Ghi rõ: overlay chỉ áp cho dòng (1); `--extract` chỉ xin dịch dòng (1). AC liên quan: AC-2, AC-3, AC-4, AC-9.
