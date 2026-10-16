# Kế hoạch — cham-lai-khong-tu-doi (VA1, T2)

Hợp đồng: `_acceptance/cham-lai-khong-tu-doi/contract.md` (duyệt 16/10). Ca đo: `tests/scripts/cham-lai-khong-tu-doi.test.mjs`
(commit trước vật — đỏ trên bản hiện hành, xem commit S1).

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Chấm lại không giữ kết quả cũ của phép đo đã đổi định nghĩa | `feature-loop/scripts/carry-plan.mjs` | AC-1…AC-5 (giữ đúng, im khi không đổi) |
| Lý do chạy lại hiện một dòng khi sinh tham số | `feature-loop/scripts/s4-args.mjs` | AC-1, AC-2, AC-5 (thông điệp ghim) |
| Bộ ghi thước so bằng tham số của chính lượt vừa chấm | `feature-loop/scripts/thuoc-vat.mjs` | AC-6, AC-7, AC-8 (K7 · im · thẻ) |
| Máy tự chạy lại với đúng tệp khi bộ ghi dừng | `feature-loop/skills/feature-loop/SKILL.md` | AC-6 (lối tự gỡ) |

## Task 1 — vân tay định nghĩa trong carry-plan (independent: false)
Files: `carry-plan.mjs`, `s4-args.mjs`. Verify: `node tests/scripts/cham-lai-khong-tu-doi.test.mjs --only CL1,CL2,CL3,CL4,CL5`
+ `node tests/workflows/carry-plan.test.mjs` + `node tests/scripts/evals-sat-le.test.mjs` + `node tests/scripts/bo-giai-nhay.test.mjs`
+ `node tests/scripts/glob-thoat-ngoac.test.mjs` + `node tests/workflows/luot-sua-giu-du.test.mjs`. Phục vụ E1–E5.

## Task 2 — tệp args của lượt cuối trong thuoc-vat (independent: false, sau Task 1)
Files: `thuoc-vat.mjs`, `SKILL.md`, `tests/scripts/cay-doi-trong-luot.test.mjs` (LC4(4) dựng dòng mồ côi bằng hình
dạng thật — tệp args MỚI hơn round-tally). Verify: `--only CL6,CL7,CL8` + `node tests/scripts/cay-doi-trong-luot.test.mjs`
+ `node tests/scripts/ntr-thuoc.test.mjs` + `node tests/scripts/ghi-boi-tac-tu-cham.test.mjs`. Phục vụ E6, E7, E7b, E8.

## Task 3 — gộp origin/main, chạy lại hai lệnh verify trên, sang S4.
