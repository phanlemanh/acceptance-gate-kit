---
schema_version: 2
feature_slug: lan-v-khong-phai-cho-ky
verdict: REJECT
failed_evals: [E9]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6a8638fcf13b21474c7544f6c7f52e2ebfc90160
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
| E9 | AC-5 | test | FAIL |

## Evidence

- eval: E1
  run_id: minted-lan-v-khong-phai-cho-ky-E1-r5
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T09:45:00+07:00
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E2
  run_id: minted-lan-v-khong-phai-cho-ky-E2-r5
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T09:45:00+07:00
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E3
  run_id: minted-lan-v-khong-phai-cho-ky-E3-r5
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T09:45:00+07:00
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E4
  run_id: minted-lan-v-khong-phai-cho-ky-E4-r5
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T09:45:00+07:00
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E5
  run_id: minted-lan-v-khong-phai-cho-ky-E5-r5
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T09:45:00+07:00
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E6
  run_id: minted-lan-v-khong-phai-cho-ky-E6-r5
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan san-dem
  verified_at: 2026-08-21T09:45:00+07:00
  output: |
    SAN-DEM OK: ten sai -> exit 1 co thong diep; ten dung -> 1 dong ca; ban sao go san dem -> xanh gia (chieu do chay that)

- eval: E7
  run_id: minted-lan-v-khong-phai-cho-ky-E7-r5
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan mutant
  verified_at: 2026-08-21T09:45:00+07:00
  output: |
    MUTANT OK: 3 dot bien chay that, moi cai ghim MOT cau rieng; bang su-that do duoi ca ba; doi chung duong ban A xanh

- eval: E8
  run_id: minted-lan-v-khong-phai-cho-ky-E8-r5
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cay-that
  verified_at: 2026-08-21T09:45:00+07:00
  output: |
    CAY-THAT OK: 2 ho so verified-chua-ky, may quet == luoi o ca 2; /start neu hai trang thai (chieu do chay that)

- eval: E9
  run_id: minted-lan-v-khong-phai-cho-ky-E9-r5
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T09:45:00+07:00
  output: |
    PASS: LV3 da-veto -> KHONG done du bang chung sach
      PASS: ca lan V — LV3 (ho so lan-v-khong-phai-cho-ky)
    ca lan V — LV4 (ho so lan-v-khong-phai-cho-ky)
    PASS: LV4 bang su-that 240 o: 2 o done khop ham ky vong
      PASS: ca lan V — LV4 (ho so lan-v-khong-phai-cho-ky)
    ca lan V — LV5 (ho so lan-v-khong-phai-cho-ky)
    PASS: LV5 dang thuc voi luoi: 21 fixture, may quet == pre-merge o ca 21
      PASS: ca lan V — LV5 (ho so lan-v-khong-phai-cho-ky)
    ca lan V — LV6 (ho so lan-v-khong-phai-cho-ky)
    PASS: LV6 san dem bo loc: ten sai -> exit 1 co thong diep; ten dung -> dung mot dong ca
      PASS: ca lan V — LV6 (ho so lan-v-khong-phai-cho-ky)

    Results: 2 failed

    [exited with code 1]

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 3: PASS trên tree cũ — owner TRẢ LẠI ở Cổng Bằng chứng (48800593), hạ về phạm vi + nâng T3.
Round 4: evidence-report.md ghi sai khuôn (H1 trước frontmatter, commit 6a8638fc) — hồ sơ bị máy đọc thành "hỏng" (start-scan/product-map); sửa khuôn chưa kịp chạy lại toàn bộ suite.
Round 5: E9 (`bash tests/plugins/run-tests.sh`) đỏ thật — exit 1, "Results: 2 failed", nhưng đuôi log không lộ dòng "FAIL:" cụ thể (chỉ thấy các dòng PASS LV3-LV6 rồi tới tổng kết); ngoài ra `node scripts/product-map.mjs --root . --check` cũng đỏ (không gắn eval nào, xem review-findings mục Ngoài hợp đồng) → verdict REJECT, failed_evals: [E9].

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
