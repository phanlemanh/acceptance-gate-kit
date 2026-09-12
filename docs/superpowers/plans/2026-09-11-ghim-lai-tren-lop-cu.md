# Kế hoạch — ghim-lai-tren-lop-cu (T2)

Ngày 2026-09-11 · hợp đồng `_acceptance/ghim-lai-tren-lop-cu/contract.md` (approved, làn V) ·
thiết kế `docs/superpowers/specs/2026-09-11-ghim-lai-tren-lop-cu-design.md`.

**Mục tiêu:** `feature-loop/scripts/repin-lane.mjs` kiểm MỘT bảng điểm chạm bộ máy trước mọi việc
khác. Thiếu mục nào thì dừng exit 2 có tên, kèm lối đi tiếp chạy được. Một tệp ca vĩnh viễn
chứng điều đó trên lớp cũ THẬT.

**Kiến trúc:** khối marker `AG-ENGINE-TABLE` trong `repin-lane.mjs` là nguồn duy nhất. Bộ nạp bọc
`require()`, lọc hàng thiếu, và in thông điệp dừng (tệp: export (cần ≥ bản) · nguồn · lối đi tiếp ·
`lệnh dò:` đường tuyệt đối). Tệp ca `tests/scripts/repin-lane-lop-cu.test.mjs` rút hàng từ chính khối
đó. Mỗi ca chạy vật thật rồi chạy CÙNG phép phán lên bản sao bị phá (chiều đỏ ghim thông điệp)
trong cùng lượt.

T2 → không có Cổng 1.5; đi thẳng S3. Mọi task tuần tự (cùng hai tệp) nên `independent: false`.

Suite scripts đã tự chạy mọi `tests/scripts/*.test.mjs` qua glob. Không cần sửa
`tests/scripts/run-tests.sh`: chính glob là cơ chế đăng ký của các tệp anh em.

| # | Task | Files | Verify | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Cổng bộ máy trong làn: khối `AG-ENGINE-TABLE` (eval-yaml: parseEvals, expectedExits · evidence-core: resolveConfigKey, resolveConfigList, REPIN_MACHINE_EXECUTORS, determineEnforce, evaluateEvidence, checkRepinEvals, findAcceptanceConfig, readSignedReportFor). Bộ nạp bọc `require`. Lọc TRỌN hàng thiếu. Thông điệp dừng một khuôn cho cả tệp vắng. Chạy trước kiểm cây sạch. | `feature-loop/scripts/repin-lane.mjs` | `node --check feature-loop/scripts/repin-lane.mjs && node tests/scripts/repin-lane.test.mjs` (ca LN/RL-EE xanh) + tay: làn trên lớp `git archive 0b5c5b37` → exit 2, không TypeError | E1, E2, E4, E5, E6, E7 | false |
| 2 | Khung tệp ca: đường suy từ vị trí tệp, lớp cũ bằng `git archive` (mốc vắng → ĐỎ có tên), kho tạm hai hồ sơ (exit 0 · khai `expected_exit: 2`), bộ chọn `GLLC_CASES` (khớp 0 → exit 1 «GLLC_CASES khop 0 ca»), đúng một dòng kết quả mỗi ca, một exit cuối. Ca GL08. | `tests/scripts/repin-lane-lop-cu.test.mjs` | `GLLC_CASES=GL08 node tests/scripts/repin-lane-lop-cu.test.mjs` | E13 | false |
| 3 | GL01 (lớp cũ thật, hai chế độ, ô cây bẩn, mutant TypeError) + GL02 (đẳng thức tập tính lúc chạy, ô hai-thiếu-cùng-tệp, mutant dừng-mục-đầu-mỗi-tệp) | tệp ca | `GLLC_CASES=GL01 …` · `GLLC_CASES=GL02 …` | E1, E2 | false |
| 4 | GL03: ma trận xoá-export × hai hồ sơ, ô (G) so byte sau chuẩn hoá, phép quan hệ ⊆ bảng; mutant gỡ hàng checkRepinEvals, mutant recheck thêm `core.fakeX` | tệp ca | `GLLC_CASES=GL03 …` | E3 | false |
| 5 | GL04 (lớp lai 04069351, mutant gỡ hàng readSignedReportFor) · GL05 (nạp lỗi, mutant bỏ lớp bọc) · GL06 (nguồn plugin cache qua HOME, mutant bỏ nhánh nguồn) | tệp ca | `GLLC_CASES=GL04 …` · `GL05` · `GL06` | E4, E5, E6 | false |
| 6 | GL07: round-trip lệnh dò rút từ stderr → `--ag-root` in ra → bên đọc cũ 0b5c5b37; mutant đường tương đối, mutant bỏ `evals_exit` | tệp ca | `GLLC_CASES=GL07 …` | E7 | false |
| 7 | Kiểm trọn: mọi lệnh eval của `evals.yaml` (giải `config:`) + bốn suite + bản đồ sản phẩm; rồi contract `status: implemented` | `_acceptance/ghim-lai-tren-lop-cu/contract.md`, `PRODUCT-MAP.md` nếu phải vẽ lại | từng khoá `gllc_*` · `executors.test.{scripts,hooks,plugins,workflows}` · `executors.script.product_map` | E8–E13 | false |

**Chiều đỏ (MEASURE-BIRTH-CLAUSE):** chạy TRONG ca, mỗi lượt suite. Mỗi phép phán `judge(laneScript)`
được gọi trên `repin-lane.mjs` thật (phải rỗng lỗi) rồi trên bản sao đã tiêm (phải chứa thông điệp
ghim). Mũi tiêm phải khớp đúng một lần, bản sao phải khác bản gốc và qua `node --check`. Nhờ vậy
chiều đỏ là vật máy giữ, không phải một lượt tay chỉ chạy một lần.
