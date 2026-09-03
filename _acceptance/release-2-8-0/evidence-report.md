---
schema_version: 2
feature_slug: release-2-8-0
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 52556444fd78e53e6dcf17e98949500b01aceb46
human_signoff:
---

# Evidence Report: release-2-8-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-8-0-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-03T21:49:57Z
  output: |
      PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-8-0-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-03T21:49:57Z
  output: |
      PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-8-0-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-03T21:49:57Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 796 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-8-0-E3b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-09-03T21:49:57Z
  output: |
      PASS: V06

    Results: 60 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-8-0-E3c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-03T21:49:57Z
  output: |
      PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-8-0-E3d-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-09-03T21:49:57Z
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-8-0-E3e-r2
  exit_code: 0
  baseline: n-a
  verifier: scripts/product-map.mjs
  verified_at: 2026-09-03T21:49:57Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E6
  run_id: minted-release-2-8-0-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-03T21:49:57Z
  output: |
      PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

### Lệnh suite (hồi quy)

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-release-2-8-0-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-09-03T21:49:57Z

## Known limits

1. **Không có phiên phản biện context sạch độc lập cho hồ sơ mốc** — bộ phân loại
   an toàn của harness quá tải suốt lượt dựng, mọi lượt gọi phiên con bị từ chối;
   người soi là phiên thi công (gap-probe khai thẳng ở `by:`). Bù: S4 chạy qua
   Workflow với agent soi + agent phản bác context riêng — vòng 1 bắt đúng một lỗi
   thật của phiên thi công (bản đồ sản phẩm lệch) mà phiên tự soi đã bỏ sót.
2. **AC-1 ghim literal `2.8.0`** — cố ý, số của một mốc là hằng của mốc đó; P200
   vẫn đọc từ manifest (nếp từ 2.6.0).
3. **Bốn eval E1/E2/E3c/E6 chỉ được chấm bằng mã thoát của TRỌN suite plugins**,
   không ghim từng dòng vế của P200 mà `expected` hứa (Ngoài-6). Vế đó do P200
   canh trong nhà; hồ sơ này không phân biệt được «P200 xanh» với «suite xanh».
4. **Hai vết hồ sơ vòng 1 giữ nguyên trong sử liệu:** `verified_at` số tròn đứng
   sai thứ tự so với run-log và commit (Ngoài-1, tái phát lần 4) và trường
   `output` của bốn eval đỏ chứa lời thuật máy viết thay vì thông điệp đỏ thật
   (Ngoài-2). Vòng 2 không mang hai lỗi này (`verified_at` khớp lượt chạy thật).
5. **Chữ ký mốc này kéo một dòng bản ghi mốc định tuyến** (LM20 chỉ ghim hồ sơ đã
   chốt) — thêm cùng commit chữ ký, để không lặp CI đỏ hậu-chữ-ký của #140.
6. **Hai quan sát Radar** trong mục Ba dòng số đọc từ commit/sổ của kho tiêu thụ,
   không phải phép đo của repo này.

## Ngoài hợp đồng

Sáu mục, chi tiết + lời cho người đọc ở `review-findings.md`; thẻ Cổng 2 in đúng
sáu ô Ngoài-1..Ngoài-6:

1. `verified_at` bịa số tròn ở báo cáo vòng 1 — tái phát lần 4 (high).
2. Trường `output` của bốn eval đỏ vòng 1 chứa lời thuật máy viết (high).
3. Hai mục «Known limits» / «Ngoài hợp đồng» rỗng ⇒ máy tự tuyên xanh-sạch và bỏ
   qua lượt mời ký, trong khi thẻ đọc file khác và vẫn in đủ mục (high) — chính
   là «ứng viên thứ hai» mà hợp đồng gọi tên cho cửa sổ kế; mục này được điền
   TRƯỚC khi trình cổng nên bẫy không nổ ở lượt ký của chính hồ sơ 2.8.0.
4. `review-findings.md` vòng 2 ra chín mục với ba cặp trùng Việt/Anh — đã gộp còn
   sáu trước khi dựng thẻ; gốc ở bước dedupe của workflow, không sửa ở mốc (medium).
5. E3e viết thẳng lệnh thay vì khoá config — tái phát lần 3 (low).
6. Bốn eval chấm bằng mã thoát trọn suite thay vì dòng vế P200 (high).

## Analyst

carried tu round truoc — baseline khong do lai round nay (P2, evals.yaml khong doi tu lan baseline cuoi).

Danh sách carried từ round 1: E3, E3b, E3d — pass trên cả HEAD lẫn baseline (diffBase); ba
eval quy-hồi (`tests/scripts`, `tests/hooks`, `tests/workflows`) không phân biệt được vòng
tính năng này — cân nhắc viết lại để assert hành vi mới của vòng này, hoặc xác nhận đây là
regression-guard có chủ ý và giữ nguyên.

## Variance

none — không có eval nào chạy nhiều lần (runs > 1) trong vòng này.

## Iterations

Round 1: E1, E2, E3c, E6 fail cùng lượt chạy `bash tests/plugins/run-tests.sh` — exit
1; E3e fail ở `node scripts/product-map.mjs --check` — exit 1. Nguyên nhân gốc: commit
0e411b28 lật `contract.md` từ `status: draft` sang `status: implemented` nhưng không
chạy lại `node scripts/product-map.mjs --root .` để vẽ lại PRODUCT-MAP.md, kéo theo hai
ca P122/P126 trong suite plugins đỏ theo. Verdict: REJECT, trả về S3 để sửa.

Round 2: PRODUCT-MAP.md được vẽ lại khớp hồ sơ xưởng tại commit 52556444 — suite plugins
(E1, E2, E3c, E6), suite scripts (E3), suite hooks (E3b), suite workflows (E3d) và
`node scripts/product-map.mjs --check` (E3e) đều exit 0; lệnh hồi quy `--root . --check`
cũng exit 0. Verdict: PASS.
