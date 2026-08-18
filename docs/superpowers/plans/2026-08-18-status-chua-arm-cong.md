# Kế hoạch: status-chua-arm-cong

Thiết kế: `docs/superpowers/specs/2026-08-18-status-chua-arm-cong-design.md` ·
Hồ sơ: `_acceptance/status-chua-arm-cong/`. Bốn task tuần tự (mỗi task một
commit); task 1+2 phụ thuộc nhau (răng gắn vào luật) — không fan-out.

| Thay đổi thấy được | Chỗ đụng | Tiêu chí phục vụ |
|---|---|---|
| Hồ sơ đã có kết quả chấm mà status còn draft/approved không còn tàng hình ở biên merge — cổng nêu tên nó và hai lối ra | `scripts/pre-merge-check.sh` (vòng per-slug, hoist phân loại diff) | AC-1 · AC-2 · AC-3 (luật + đường đọc-cũ) |
| Răng T1-escape in y như cũ dù phân loại diff được tính sớm hơn | `scripts/pre-merge-check.sh` (khối T1-escape) | AC-4 (hoist không đổi hành vi) |
| Suite scripts có 13 ca `ARM*` code-sinh git, ma trận đỏ/xanh cùng fixture | `tests/scripts/run-tests.sh` | AC-1…AC-4 |
| Người đọc GUIDE thấy hàng VIOLATION mới và một gạch nếp phát hành «không dựng răng» | `GUIDE.md` §7 + §7.1; răng `_acceptance/status-chua-arm-cong/rang.sh` + khoá `executors.script.rang_arm_guide` | AC-5 |

## Task 1 — Luật trong pre-merge (independent: false)

- Files: `scripts/pre-merge-check.sh`
- Hoist khối phân loại `t3_hits`/`nont1_hits` từ T1-escape lên trước vòng
  per-slug (`DIFF_GATED_T3`, `DIFF_GATED_NONT1`, `DIFF_GATED_FIRST`); T1-escape
  dùng lại biến, không đổi một chữ thông điệp.
- Thay `case "$status" in implemented|verified|signed-off) ;; *) continue`
  bằng nhánh chưa-arm: (a) evidence-report.md tồn tại ∧ (slug_in_diff ∨
  DIFF_READY=0) → VIOLATION; (b) DIFF_READY=1 ∧ slug_in_diff ∧ có gated hit →
  VIOLATION; còn lại `continue`. Đặt SAU `case REQUIRED_FOR`.
- Verify per-task: chạy tay pre-merge trên fixture git 2 commit dựng trong
  scratch: implemented+REJECT (thấy `verdict=REJECT (must be PASS to merge)`),
  approved+REJECT (thấy dòng mới), draft+docs (clean, `expected=4`).
- Phục vụ: E1–E4.

## Task 2 — Răng ARM01–ARM12 (+08b) (independent: false)

- Files: `tests/scripts/run-tests.sh` (mục mới sau khối stale-theo-diff-pr,
  helper `mk_arm_repo <root> <status> <evidence yes/no> <pr: code|docs|t3|none>
  [<extra armed slug>]`, mọi lượt `env -u PRE_MERGE_BASE`).
- Ma trận đúng bảng thiết kế; mỗi ca xanh ghim `expected=4`; ARM01 ghim dòng
  verdict nguyên văn; ARM08/08b ghim thông điệp T1-escape nguyên văn.
- Verify per-task: suite scripts exit 0 + `grep -c "PASS: ARM"` = số ca; lượt
  phá-thử: đảo tạm nhánh (a) trong bản sao script → ARM02/06/10 đỏ ghim đúng
  tên (rồi bỏ bản sao).
- Phục vụ: E1–E4, E5a.

## Task 3 — GUIDE + răng GUIDE (independent: false)

- Files: `GUIDE.md` (§7 hàng bảng + §7.1 gạch), `_acceptance/status-chua-arm-cong/rang.sh`,
  `_acceptance/config.yaml` (khoá `executors.script.rang_arm_guide` — dùng
  `scripts/config-patch.mjs`).
- Verify per-task: `bash rang.sh` exit 0; hai chiều đỏ tự chạy trong răng.
- Phục vụ: E5e.

## Task 4 — Bốn suite + bản đồ (independent: false)

- Chạy `suite_keys` (4 suite + product_map --check); vẽ lại PRODUCT-MAP nếu
  --check đỏ; set contract `status: implemented`; dispatch S4.
- Phục vụ: E5a–d.
