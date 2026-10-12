# Kế hoạch — dai-tom-tat-doc-dung

Hồ sơ `_acceptance/dai-tom-tat-doc-dung/` · thiết kế `docs/superpowers/specs/2026-10-12-dai-tom-tat-doc-dung-design.md`.
T2, mọi task tuần tự (cùng một mô-đun và một tệp test) — không fan-out.

| # | Task | Tệp | Kiểm từng task | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Ô production đổi lời khi chưa có quan sát; vế đầu ô chưa làm «để ngoài phạm vi»; bộ đọc gạch giới hạn ở `## Notes` (gạch có con / gạch trơn, lọc none/không có) + luật nguồn nhiều hơn; `chiTiet.known` = danh sách nguồn đã chọn | `scripts/ho-so-tom-tat.cjs` | `node tests/scripts/dai-tom-tat.test.mjs` (DT-1..DT-5) | E1–E5 | false |
| 2 | Ô vì sao: câu dẫn «:» (xét sau khi bỏ dấu nhấn) + danh sách rút gọn nối « · »; trần 400 theo đơn vị câu/mục, câu đơn cắt ở khoảng trắng | `scripts/ho-so-tom-tat.cjs` | DT-6, DT-7 | E6, E7 | false |
| 3 | Khối marker `KNOWN-LIMITS-NOTE` cho lối «ghi Known limits» | `commands/signoff.md` | DT-8 | E8 | false |
| 4 | Tệp ca DT-1..DT-8 kèm ca đỏ (bản sao cây bị tiêm, đối chứng dương trước); khoá executor `dai_tom_tat`; đổi câu mong đợi của LT-162 (`BANG_150.chua_lam`) và LT-154 vang (production) kèm chú thích trỏ hồ sơ này | `tests/scripts/dai-tom-tat.test.mjs`, `tests/scripts/lo-trinh.test.mjs`, `_acceptance/config.yaml` | `node tests/scripts/dai-tom-tat.test.mjs` · `LT_CASES` của LT-162/LT-154 | E1–E8 | false |
| 5 | DT-9 trên bản sao crm 27d47de04: cây đang kiểm vs bản base 7f65e5a0 (`git archive` trọn thư mục), khuôn khối bằng nhau; khoá executor `dai_tom_tat_crm` | `tests/scripts/dai-tom-tat-crm.mjs`, `_acceptance/config.yaml` | `node tests/scripts/dai-tom-tat-crm.mjs` | E9 | false |
| 6 | Tài liệu khối: mô tả ba ô | `skills/acceptance/references/lo-trinh-du-lieu.md` | đọc lại đối chiếu mã | E10 | false |
| 7 | Vẽ lại `PRODUCT-MAP.md` / `LO-TRINH.html` của kit; chạy suite khoá `lo_trinh` | — | `node scripts/product-map.mjs --check` | — | false |
