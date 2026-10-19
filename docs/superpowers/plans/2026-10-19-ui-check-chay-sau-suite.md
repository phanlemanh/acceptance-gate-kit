# Kế hoạch: ui-check-chay-sau-suite

Hồ sơ `_acceptance/ui-check-chay-sau-suite/` · thiết kế `docs/superpowers/specs/2026-10-19-ui-check-chay-sau-suite-design.md` · T2.

Thứ tự commit theo luật «chiều đỏ nằm trong lịch sử»: ca trước (đỏ trên vật cũ), vá sau.

## Task 1 — Ca bên đọc (đỏ trước)

- Files: `tests/workflows/ui-check-chay-sau-suite.test.mjs` (mới)
- Ca: UC1–UC10 (AC-2…AC-6). Tác tử giả ghi cờ start/end với độ trễ; đột biến trên bản sao trong bộ nhớ, kim khớp đúng
  một lần trước khi tin màu đỏ; vi phân với `git show v2.33.0:…`.
- Verify: `node tests/workflows/ui-check-chay-sau-suite.test.mjs` — trên vật cũ UC1, UC3, UC5, UC7 ĐỎ với thông điệp
  của vật (không phải hạ tầng); UC8 xanh (không khai thì không đổi).
- Phục vụ E2–E6 · independent: false (Task 3 làm nó xanh)

## Task 2 — Ca bên viết + round-trip (đỏ trước)

- Files: `tests/scripts/s4-args-ui-check-chay-sau-suite.test.mjs` (mới)
- Ca: UW1–UW5 (AC-1, AC-7). Kho git fixture dựng bằng code; chiều đỏ trên bản sao trọn `feature-loop/`.
- Verify: `node tests/scripts/s4-args-ui-check-chay-sau-suite.test.mjs` — trên vật cũ UW1, UW4 ĐỎ.
- Phục vụ E1, E7 · independent: false

## Task 3 — Vá bên đọc

- Files: `feature-loop/workflows/acceptance-verify.js`
- Tách `uiSongSong`/`uiChayRieng`; rút `agentCuaUi(e)`; promise nhớ của nhánh máy; nhánh ui chờ nó (bắt lỗi) rồi
  chạy ui chạy-riêng tuần tự; dry-run `uiChayRieng`; log.
- Verify: Task 1 xanh trọn; `bash tests/workflows/run-tests.sh` xanh (CR*, VP* của lenh-dai-chay-rieng không đổi).
- Phục vụ E2–E6 · independent: false

## Task 4 — Vá bên viết

- Files: `feature-loop/scripts/s4-args.mjs` (bộ lọc `evalsChayRieng` thêm `ui-check`)
- Verify: Task 2 xanh trọn; `node tests/scripts/s4-args-lenh-dai-chay-rieng.test.mjs` xanh.
- Phục vụ E1, E7 · independent: false

## Task 5 — Tài liệu cho kho nhận

- Files: `CHANGELOG.md` (mục «Chưa phát hành»), `GUIDE.md` (bảng khoá §7.1, dòng `model_evals`),
  `skills/acceptance/references/eval-executors.md` (đoạn «run alone»), dòng `evalsChayRieng` ở đầu
  `acceptance-verify.js`.
- Verify: đọc lại; suite chống trôi từ vựng (`executors.test.scripts_*`) xanh.
- Phục vụ E8 · independent: true

## Task 6 — Bản đồ + suite

- `node scripts/product-map.mjs --write` nếu hồ sơ mới làm bản đồ lệch; chạy các mảnh `feature_loop.suite_keys`
  liên quan (workflows, scripts_mjs_*) trước khi sang S4.
