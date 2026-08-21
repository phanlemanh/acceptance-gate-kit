---
schema_version: 2
feature_slug: lan-v-khong-phai-cho-ky
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 29261b95cb1b6e775f4435dfe83da318dc9040a4
human_signoff:
---

# Evidence Report: lan-v-khong-phai-cho-ky

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-1 | test | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-5 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-lan-v-khong-phai-cho-ky-E1-r6
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T23:35:22+07:00
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E2
  run_id: minted-lan-v-khong-phai-cho-ky-E2-r6
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T23:35:22+07:00
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E3
  run_id: minted-lan-v-khong-phai-cho-ky-E3-r6
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T23:35:22+07:00
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E4
  run_id: minted-lan-v-khong-phai-cho-ky-E4-r6
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T23:35:22+07:00
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E5
  run_id: minted-lan-v-khong-phai-cho-ky-E5-r6
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T23:35:22+07:00
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E6
  run_id: minted-lan-v-khong-phai-cho-ky-E6-r6
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan san-dem
  verified_at: 2026-08-21T23:35:22+07:00
  output: |
    SAN-DEM OK: ten sai -> exit 1 co thong diep; ten dung -> 1 dong ca; ban sao go san dem -> xanh gia (chieu do chay that)

- eval: E7
  run_id: minted-lan-v-khong-phai-cho-ky-E7-r6
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan mutant
  verified_at: 2026-08-21T23:35:22+07:00
  output: |
    MUTANT OK: 3 dot bien chay that, moi cai ghim MOT cau rieng; bang su-that do duoi ca ba; doi chung duong ban A xanh

- eval: E8
  run_id: minted-lan-v-khong-phai-cho-ky-E8-r6
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cay-that
  verified_at: 2026-08-21T23:35:22+07:00
  output: |
    CAY-THAT OK: 2 ho so verified-chua-ky, may quet == luoi o ca 2; /start neu hai trang thai (chieu do chay that)

- eval: E9
  run_id: b67cepxx0
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T23:35:22+07:00
  output: |
    Results: all plugin tests passed

    [exited with code 0]

## Analyst

E9 (`bash tests/plugins/run-tests.sh`) — xanh trên cả HEAD và baseline (diffBase): chứng minh harness suite plugin còn chạy được, không phải bằng chứng riêng biệt cho hành vi LV — sáu hành vi LV1–LV6 đã có E1–E8 làm bằng chứng discriminating (đỏ trên baseline) riêng cho từng cái. Coi E9 là regression-guard có chủ ý (gói lại cả 6 dòng PASS LV1..LV6 thành lưới hồi quy của suite), không cần viết lại.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 3: PASS trên tree cũ — owner TRẢ LẠI ở Cổng Bằng chứng (48800593), hạ về phạm vi + nâng T3.
Round 4: evidence-report.md ghi sai khuôn (H1 trước frontmatter, commit 6a8638fc) — hồ sơ bị máy đọc thành "hỏng" (start-scan/product-map); sửa khuôn chưa kịp chạy lại toàn bộ suite.
Round 5: E9 (`bash tests/plugins/run-tests.sh`) đỏ thật — exit 1, "Results: 2 failed", nhưng đuôi log không lộ dòng "FAIL:" cụ thể (chỉ thấy các dòng PASS LV3-LV6 rồi tới tổng kết); ngoài ra `node scripts/product-map.mjs --root . --check` cũng đỏ (không gắn eval nào, xem review-findings mục Ngoài hợp đồng) → verdict REJECT, failed_evals: [E9].
Round 6: 9/9 eval xanh trên cây hiện tại (E1–E8 qua rang.sh trên cây thật, E9 `bash tests/plugins/run-tests.sh` exit 0 "Results: all plugin tests passed") + 4 suite hồi quy (plugins/scripts/hooks/workflows) xanh + `product-map --check` khớp hồ sơ xưởng → verdict PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
