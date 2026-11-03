# Kế hoạch: ban-do-khuon-roi-nhom (V0)

Hồ sơ: `_acceptance/ban-do-khuon-roi-nhom/` · hạng T2 · thiết kế `_acceptance/ban-do-khuon-roi-nhom/design.md`.
Ca đo đã commit trước bản vá (`dd3ccbac`): RN-1, RN-2, RN-4, RN-6 đỏ trên cây chưa vá.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Bộ đọc: mục `ngoai_le` vắng khoá `khoi` → `{khoi: null}`; `nhomCuaTep` bỏ nhóm có mục rời nhóm trỏ đúng tệp, có `ly_do`; câu báo thiếu `ly_do` ghi «rời nhóm» | `scripts/ban-do-khuon.cjs`, chú thích ở `scripts/design-floor-khuon.mjs` | `RN_CASES=RN-1,RN-1-do,RN-2,RN-3,RN-3-do,RN-4,RN-4-do node tests/scripts/ban-do-khuon-roi-nhom.test.mjs` | E1–E4 | false |
| 2 | Khuôn tệp nói hai nghĩa của `ngoai_le` + khối ví dụ `BAN-DO-KHUON-NGOAI-LE-VI-DU`; GUIDE §5.2 thêm câu | `skills/acceptance/references/ban-do-khuon-template.md`, `GUIDE.md` | `RN_CASES=RN-6 node tests/scripts/ban-do-khuon-roi-nhom.test.mjs` | E6 | false |
| 3 | Đo hai kho, chép số vào design §5 | `_acceptance/ban-do-khuon-roi-nhom/design.md` | `node tests/scripts/ban-do-khuon-roi-nhom-hai-kho.mjs` | E5 | false |
| 4 | Hồi quy hai bộ khuôn cũ | — | `node tests/scripts/khuon-loi.test.mjs` · `node tests/scripts/khuon-doc-ban-do-that.test.mjs` | — | false |

Thứ tự 1 → 2 → 3 → 4, tuần tự trong phiên chính (không việc nào độc lập đủ để chạy song song).
