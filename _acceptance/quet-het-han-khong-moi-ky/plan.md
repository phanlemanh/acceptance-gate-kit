# Kế hoạch — quet-het-han-khong-moi-ky

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Lý do máy đọc hỏng hiện bằng chữ, kho lớn được đợi theo cỡ | `scripts/han-quet.cjs` (mới) | AC-3 (lý do bằng chữ), AC-4 (hạn theo cỡ kho) |
| Thẻ việc máy đã cho qua vẫn hỏi «đi tiếp hay kéo lại» khi máy đọc hỏng, kèm cờ + lệnh chạy lại | `scripts/gate-card.js` (`quetHoSo`, `MAY_DI_TIEP`, hai cờ) | AC-1, AC-2, AC-5 |
| Ca kiểm hai chiều cho cả năm tiêu chí | `tests/scripts/quet-het-han-khong-moi-ky.test.mjs`, khoá `executors.test.quet_het_han*` | AC-1…AC-6 |

Task 1 (independent: false) — `scripts/han-quet.cjs`: `hanQuet`, `lyDoQuet`, `lenhChayLai`. Verify: `QH_CASES=QH-3,QH-3-do,QH-4,QH-4-do node tests/scripts/quet-het-han-khong-moi-ky.test.mjs`. Phục vụ E3, E4.

Task 2 (independent: false, sau Task 1) — `scripts/gate-card.js`: hạn + lý do từ Task 1; vế `MAY_THONG && MU_LOI`; cờ riêng cho hồ sơ máy-thông khi bộ quét lỗi, cờ cũ chỉ cho ca `config:false` / không máy-thông. Verify: `node tests/scripts/quet-het-han-khong-moi-ky.test.mjs` và `RT_CASES=RT5 node tests/plugins/ra-co-ten.test.mjs`. Phục vụ E1, E2, E5, E6.
