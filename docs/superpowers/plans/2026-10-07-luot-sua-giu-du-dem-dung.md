# Kế hoạch — luot-sua-giu-du-dem-dung

Hồ sơ: `_acceptance/luot-sua-giu-du-dem-dung/` · thiết kế: `docs/superpowers/specs/2026-10-07-luot-sua-giu-du-dem-dung-design.md`.
Chạy TUẦN TỰ trong vòng chính (các task chạm chung tệp ca và chung `acceptance-verify.js`). TDD: ca đỏ trước, vật sau.

| # | Task | Files | Verify | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Ca đỏ phía script: dựng kho/sổ code-sinh, bản base `git archive 7b1afe1e`, mutant trên bản sao | `tests/scripts/luot-sua-giu-du.test.mjs` | `node tests/scripts/luot-sua-giu-du.test.mjs` đỏ đúng các AC chưa làm | E1, E2, E4, E6–E10 | false |
| 2 | carry-plan: mọi mục ngoài hợp đồng lượt trước đều mang sang, `tepDoi` theo diff | `feature-loop/scripts/carry-plan.mjs` | `LSGD_CASES=AC-1,AC-2` | E1, E2 | false |
| 3 | s4-args: gắn khung ui-check carry từ báo cáo lượt trước (cùng run_id, ảnh có thật, observed thực chất) | `feature-loop/scripts/s4-args.mjs` | `LSGD_CASES=AC-4` | E4 | false |
| 4 | thuoc-vat: bỏ nội dung nhập từ nền (cha thứ hai không có mốc sàn làm tổ tiên); tệp chung cộng từng commit; `--giua-hai-luot` cùng bộ lọc | `feature-loop/scripts/thuoc-vat.mjs` | `LSGD_CASES=AC-6,AC-7,AC-8,AC-9` | E6–E9 | false |
| 5 | Ca đỏ phía workflow qua `harness.mjs` | `tests/workflows/luot-sua-giu-du.test.mjs` | `node tests/workflows/luot-sua-giu-du.test.mjs` | E3, E5 | false |
| 6 | acceptance-verify: chèn mục carry vào bản findings (khoá title + file); chèn khung vào khối carry; prompt chép khung | `feature-loop/workflows/acceptance-verify.js` | `LSGD_CASES=AC-3,AC-5` + suite workflows | E3, E5, E10 | false |
| 7 | Lời: SKILL đoạn T5, CHANGELOG mục chưa phát hành | `feature-loop/skills/feature-loop/SKILL.md`, `CHANGELOG.md` | `LSGD_CASES=AC-10` | E10 | false |
| 8 | Suite đầy đủ (`scripts`, `workflows`, `plugins`, `hooks`) xanh | — | lệnh `feature_loop.suite_keys` | mọi E | false |
