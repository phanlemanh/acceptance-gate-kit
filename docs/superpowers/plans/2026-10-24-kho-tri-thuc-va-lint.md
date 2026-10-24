# Kế hoạch — kho-tri-thuc-va-lint (TT1)

Tuần tự, một phiên (mọi task cùng phục vụ một lệnh, không task nào độc lập đủ để tách).

| # | Task | Tệp | Phục vụ | Kiểm task |
|---|---|---|---|---|
| 1 | Khuôn một nguồn | `skills/acceptance/references/tri-thuc-template.md` | E3, E7 | KT-3 |
| 2 | Bộ đọc khối `tri_thuc` | `scripts/tri-thuc-khoa.cjs` | E1, E2 | KT-1, KT-2 |
| 3 | Lint 11 vế + đường trỏ băm | `scripts/tri-thuc.mjs` | E3–E8 | KT-3…KT-8 |
| 4 | Gói `tri-thuc`, marketplace, P200 | `tri-thuc/**`, `.claude-plugin/marketplace.json`, `tests/plugins/run-tests.sh` | E9, E9b, E10b | P200 + KT-9 |
| 5 | Ca đo + khoá executor | `tests/scripts/kho-tri-thuc-va-lint.test.mjs`, `_acceptance/config.yaml` | mọi E | ca KT |

Đổi hướng giữa S3: P161 đỏ vì một câu trích có `**` trong sổ S1 → dòng sổ thay bằng căn cứ một-lối (commit 308218d9).
