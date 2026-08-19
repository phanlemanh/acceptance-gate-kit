# Plan — tool-kill-duong-doc-lap (T2, làn V)

Design: `docs/superpowers/specs/2026-08-19-tool-kill-duong-doc-lap-design.md` ·
Contract: `_acceptance/tool-kill-duong-doc-lap/contract.md`.
Thi công tuần tự trong main loop (task nối nhau qua file nguồn); mỗi phép đo
mới đi kèm cặp hai-chiều cùng lượt (MEASURE-BIRTH-CLAUSE).

| # | Task | Files | Verify per-task | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Tạo nguồn luật: `tool-kill-rule.md` với marker `TOOL-KILL-RULE` (câu luật chuyển NGUYÊN VĂN từ JS), lời dẫn hai đường tiêu thụ + khuôn hồ sơ lượt bị ngắt | `skills/acceptance/references/tool-kill-rule.md` | file có đúng 1 cặp marker; khối rút ra bằng chuỗi cũ trong JS (diff = 0) | E1, E2, E5, E6 | false |
| 2 | Workflow nhận `args.toolKillRule`, rút khối (tách theo dòng giữa hai marker), xoá hằng cũ; thiếu/không marker → BLOCKED `(args)` reason ghim | `feature-loop/workflows/acceptance-verify.js` | grep 'TRAN THOI GIAN CONG CU' JS = 0; harness chạy dryRun với/không args | E1, E2, E7 | false |
| 3 | Harness cấp `toolKillRule` mặc định từ file nguồn (đường suy từ import.meta.url, thiếu file → THROW); W25 viết lại: RULE tách dòng từ file, 3 lane, mọi agent có schema mã-thoát mang luật, N mutant = N lane, thiếu args/không marker → BLOCKED, JS không còn bản chép | `tests/workflows/harness.mjs`, `tests/workflows/acceptance-verify.test.mjs` | `bash tests/workflows/run-tests.sh` exit 0, có đủ dòng W25 mới; phá thử: xoá 1 nội suy trong bản sao → mutant đỏ đúng lane (đã là ca trong suite) | E2, E3, E7 | false |
| 4 | Skill feature-loop S4 args-prep: resolver `--require …/tool-kill-rule.md`, đọc file → `toolKillRule`, thêm vào dòng Invoke | `feature-loop/skills/feature-loop/SKILL.md` | grep 2 chuỗi; răng E4 (task 6) chạy 2 mutant | E4 | true |
| 5 | Skill acceptance Phase 3: mục 1 nạp khối VERBATIM, mục 2 run-log `exit_code: null` + `killed_by_tool`, mục 4 routing killed → BLOCKED + chạy lại; template BLOCKED nêu ca công cụ giết | `skills/acceptance/SKILL.md`, `skills/acceptance/references/evidence-report-template.md` | răng E5 (task 6) chạy 4 mutant | E5, E6 | true |
| 6 | Răng hồ sơ `rang.sh` (chân nguon · w25 · skill-fl · skill-acc, mỗi chân kèm chiều đỏ trên bản sao code-sinh) + `dung-goi.mjs` (gói hội đồng từ vật thật + sha256) + khoá executors trong config | `_acceptance/tool-kill-duong-doc-lap/rang.sh`, `dung-goi.mjs`, `_acceptance/config.yaml` | chạy từng chân: xanh + in vết chiều đỏ; đổi pin trong bản sao răng → đỏ | E1–E5 | false |
| 7 | Hội đồng: chạy `dung-goi.mjs`, dispatch 3 agent hành động KHÔNG TOOL (inline gói), gom `hoi-dong/transcript-E6.md` với header sha256 | `_acceptance/tool-kill-duong-doc-lap/hoi-dong/*` | transcript có 3 ca + header khớp `goi-E6.sha256` | E6 | false |
| 8 | Vẽ lại bản đồ sản phẩm; set contract `implemented`; dispatch S4 | `PRODUCT-MAP.md`, contract | `node scripts/product-map.mjs --root . --check` exit 0 trên cây sạch (git archive) | suite | false |

Không bump version plugin ở hồ sơ này — mốc phát hành là hồ sơ riêng (nếp
release-2-x); ghi chú «feature-loop mới cần acceptance-gate có
tool-kill-rule.md» vào Known limits để hồ sơ release mang câu pairing.
