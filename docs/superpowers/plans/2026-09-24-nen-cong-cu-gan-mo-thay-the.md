# Kế hoạch — nen-cong-cu-gan-mo-thay-the (T2, làn V)

Vật và ca đo đã làm trước khi mở hồ sơ (PR #215, owner đặc tả trong lời báo lỗi); kế hoạch
ghi lại thứ tự đã đi để sổ đọc được, không có task mới.

| Task | Files | Verify | Phục vụ | independent |
|---|---|---|---|---|
| T1 — ca đỏ trước: GM1 (IM, chuỗi crm) đỏ «THIEU merge-base» trên mã cũ; GM2 (ĐỎ) | `tests/scripts/duong-nen.test.mjs` | `node tests/scripts/duong-nen.test.mjs` — GM1 FAIL trước vá | E1 E2 E3 | false |
| T2 — vá `tuDau`: phép gán mở không bị bỏ; vị từ `moThayThe` trong khối `CONG-CU-GAN-MO` | `feature-loop/scripts/duong-nen.mjs` | cùng lệnh — GM1 GM2 PASS | E1 E2 E3 | false |
| T3 — đột biến + ca sau gap-probe: GM3 GM4 GM5 GM6, sha256 chuỗi crm | `tests/scripts/duong-nen.test.mjs` | lệnh `executors.script.ngm_gan_mo` exit 0; `rang-hoi-quy.sh` 19/19 | E4 E5 E6 E7 E8 | false |
