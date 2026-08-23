---
schema_version: 2
feature_slug: lenh-tran-tai-lieu-dau-tay
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent (đường VERIFY độc lập, 6 lệnh tuần tự + 1 phép đếm độc lập — d-4608)
enforcement_mode: strict
bypass_used: false
verified_commit: 1c163c71d234b46dc73571a70cf6083cd223e808
human_signoff:
---

# Evidence Report: lenh-tran-tai-lieu-dau-tay

Round 1. Một phiên tươi chạy tuần tự bốn suite + phép kiểm bản đồ trên cây `1c163c71` (working tree
sạch), **cộng một phép đếm độc lập ngoài suite** trên ba tài liệu đầu-tay để đối chiếu lời khai của
tác giả: `QUICKSTART 0 trần / 12 có tiền tố · README 0 / 19 · GUIDE 0 / 21` — đúng bằng 52 token đã đổi.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-4 | test | PASS |
| E6 | AC-4 | test | PASS |
| E7 | AC-4 | test | PASS |
| E8 | AC-4 | script | PASS |

## Bằng chứng gốc — sáu lệnh, một lượt

    bash tests/plugins/run-tests.sh                →  Results: all plugin tests passed (FAIL count 0; LB1–LB9 + P30/P101/P122/P126/P200)
    bash tests/scripts/run-tests.sh                →  Results: 750 passed, 0 failed
    bash tests/hooks/run-tests.sh                  →  Results: 60 passed, 0 failed
    bash tests/workflows/run-tests.sh              →  Results: all workflow tests passed
    node scripts/product-map.mjs --root . --check  →  PRODUCT-MAP.md khớp hồ sơ xưởng.
    (bước 6, ngoài suite)                          →  ba dòng đếm token, cả ba tài liệu 0 trần

## Evidence

- eval: E1
  run_id: lenh-tran-tai-lieu-dau-tay-E1-r1-20260823T004219Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T00:42:19Z
  output: |
    PASS: [LB2] 16 file: 0 trần, 0 uat thiếu tiền tố, 120 lệnh có tiền tố ⊆ bảng; 16 đối chứng dương tiêm; giữ-gân 0; ba chèn → đỏ

- eval: E2
  run_id: lenh-tran-tai-lieu-dau-tay-E2-r1-20260823T004219Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T00:42:19Z
  output: |
    PASS: [LB2] 16 file: 0 trần, 0 uat thiếu tiền tố, 120 lệnh có tiền tố ⊆ bảng; 16 đối chứng dương tiêm; giữ-gân 0; ba chèn → đỏ
    QUICKSTART.md: tran=0 prefixed=12
    README.md: tran=0 prefixed=19
    GUIDE.md: tran=0 prefixed=21
    (bước 6 — phép đếm ĐỘC LẬP ngoài suite, do phiên verify chạy, at=2026-08-23T00:46:48Z exit=0)

- eval: E3
  run_id: lenh-tran-tai-lieu-dau-tay-E3-r1-20260823T004219Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T00:42:19Z
  output: |
    PASS: [LB9] lệnh `claude plugin` giữ nguyên số (7) so với ba539284; dòng «Khớp phiên bản» không đổi; mutant đổi-sang-slash → lệch số

- eval: E4
  run_id: lenh-tran-tai-lieu-dau-tay-E4-r1-20260823T004219Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T00:42:19Z
  output: |
    Results: all plugin tests passed
    PASS: P30 · P101 · P122 · P126 · P200 (FAIL count: 0)

- eval: E5
  run_id: lenh-tran-tai-lieu-dau-tay-E5-r1-20260823T004501Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-08-23T00:45:01Z
  output: |
    Results: 750 passed, 0 failed

- eval: E6
  run_id: lenh-tran-tai-lieu-dau-tay-E6-r1-20260823T004628Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-08-23T00:46:28Z
  output: |
    Results: 60 passed, 0 failed

- eval: E7
  run_id: lenh-tran-tai-lieu-dau-tay-E7-r1-20260823T004635Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-23T00:46:35Z
  output: |
    Results: all workflow tests passed

- eval: E8
  run_id: lenh-tran-tai-lieu-dau-tay-E8-r1-20260823T004642Z
  exit_code: 0
  baseline: n-a
  verifier: node scripts/product-map.mjs --check
  verified_at: 2026-08-23T00:46:42Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

## Analyst

n-a — không chạy baseline trên cây diffBase (đường verify độc lập, d-4608). Điều đọc được từ chính
lượt chạy: LB2 nay có **16 đối chứng dương** dựng bằng vật do CHÍNH bộ kiểm tiêm (mỗi file một lượt
`/start` + `uat-session <slug>`), nên đọc hụt một file là đỏ; ba chiều đỏ per-file cho ba tài liệu
đầu-tay; LB9 có đối chứng dương (bản cũ 7 lệnh `claude plugin`) và mutant đổi-sang-slash.

## Variance

none — mọi eval tất định.

## Known limits

- **Không có làn review / hội đồng / baseline A-B** — phạm vi là mở rộng vũ trụ của ca LB2 đã qua S4
  hôm nay; gap-probe bỏ có dấu vết (d-4604).
- **LB5 và LB9 neo một SHA cố định (`ba539284`)** — chọn thay cho `origin/main` sau khi lớp «mốc di
  động» nổ thật ở round này (d-4606). Nếu clone shallow không có sha đó, hai ca **ĐỎ**, không xanh giả.
  Cái giá: mỗi lần đổi bản-cũ-tham-chiếu phải sửa hằng có chủ đích.
- **Vũ trụ vẫn là danh sách khai tường minh (16 file)** — `docs/**` là sử liệu, không quét. Một tài
  liệu mặt-người mới thêm sau này vẫn phải được khai vào `FILES` bằng tay.
- **Ngưỡng «0 lần gõ lại tay» đo chung với chip D** ở ván lái-thử kế (d-4603) — hồ sơ này không có
  phiên đo riêng.

## Ngoài hợp đồng

Không có làn review ở round này. Một quan sát ghi lại, không sửa: bốn ca cũ (LB2 · LB5 · P101 ·
P30 ở chip D) đều từng ghim dạng trần hoặc mốc di động — lớp «thước ghim vào thứ sẽ đổi» còn có thể
ở chỗ khác trong bộ kiểm; quét trọn lớp này là việc của một hồ sơ riêng, không phải hồ sơ nhỏ này.

## Iterations

Round 1: verify độc lập — 6 lệnh tuần tự trên `1c163c71`, tất cả exit 0; 8/8 eval PASS.
Trong S3: suite đỏ 4 ca — LB2 + LB5 (cùng lớp «đối chứng dương neo mốc git di động», nổ ngay lần
merge đầu của chip D) sửa theo LỚP (d-4606); P101 ghim `/start` trần (d-4607); bản đồ vẽ lại.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
