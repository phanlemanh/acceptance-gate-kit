# Evidence Report: lan-v-khong-phai-cho-ky

---
schema_version: 2
feature_slug: lan-v-khong-phai-cho-ky
verdict: REJECT
failed_evals: [E9]
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: cb7bb3e7795102602d5209c752bef4ad1856d1dc
human_signoff:
---

⚠ REJECT — E9 (`bash tests/plugins/run-tests.sh`) FAIL thật (`Results: 1 failed`). Các suite khác đều xanh: `tests/hooks/run-tests.sh` hết bị rate-limit (60/60, khác round 3 — round đó BLOCKED vì suite này không chạy được), `tests/scripts/run-tests.sh` (750/750), `tests/workflows/run-tests.sh` (44/44), `node scripts/product-map.mjs --check` xanh.

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
  run_id: minted-lan-v-khong-phai-cho-ky-E1-r4
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T10:15:00Z
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E2
  run_id: minted-lan-v-khong-phai-cho-ky-E2-r4
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T10:15:00Z
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E3
  run_id: minted-lan-v-khong-phai-cho-ky-E3-r4
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T10:15:00Z
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E4
  run_id: minted-lan-v-khong-phai-cho-ky-E4-r4
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T10:15:00Z
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E5
  run_id: minted-lan-v-khong-phai-cho-ky-E5-r4
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases
  verified_at: 2026-08-21T10:15:00Z
  output: |
    CASES OK: 6 ca LV xanh tren cay that

- eval: E6
  run_id: minted-lan-v-khong-phai-cho-ky-E6-r4
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan san-dem
  verified_at: 2026-08-21T10:15:00Z
  output: |
    SAN-DEM OK: ten sai -> exit 1 co thong diep; ten dung -> 1 dong ca; ban sao go san dem -> xanh gia (chieu do chay that)

- eval: E7
  run_id: minted-lan-v-khong-phai-cho-ky-E7-r4
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan mutant
  verified_at: 2026-08-21T10:15:00Z
  output: |
    MUTANT OK: 3 dot bien chay that, moi cai ghim MOT cau rieng; bang su-that do duoi ca ba; doi chung duong ban A xanh

- eval: E8
  run_id: minted-lan-v-khong-phai-cho-ky-E8-r4
  exit_code: 0
  baseline: red
  verifier: _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cay-that
  verified_at: 2026-08-21T10:15:00Z
  output: |
    CAY-THAT OK: 2 ho so verified-chua-ky, may quet == luoi o ca 2; /start neu hai trang thai (chieu do chay that)

- eval: E9
  run_id: minted-lan-v-khong-phai-cho-ky-E9-r4
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-21T10:15:00Z
  output: |
    PASS: LV5 dang thuc voi luoi: 21 fixture, may quet == pre-merge o ca 21
      PASS: ca lan V — LV5 (ho so lan-v-khong-phai-cho-ky)
    ca lan V — LV6 (ho so lan-v-khong-phai-cho-ky)
    PASS: LV6 san dem bo loc: ten sai -> exit 1 co thong diep; ten dung -> dung mot dong ca
      PASS: ca lan V — LV6 (ho so lan-v-khong-phai-cho-ky)

    Results: 1 failed

    [exited with code 1]

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: 3 lỗ thước-không-gắn-vào-vật trong hợp đồng (start-scan/gate1_skipped) — sửa, chuyển tiếp round 2.
Round 2: PASS (bằng chứng máy + bản đồ vẽ lại) nhưng owner TRẢ LẠI ở Cổng Bằng chứng — hạ về phạm vi, nâng T3 — quay lại round 3.
Round 3: E9 (`bash tests/plugins/run-tests.sh`) FAIL thật (P122, P126) + `tests/hooks/run-tests.sh` không chạy được (rate limit Bash tool) → verdict BLOCKED, chưa xác nhận được suite hooks.
Round 4: `tests/hooks/run-tests.sh` chạy lại được (60/60 xanh, hết rate-limit từ round 3); E9 (`bash tests/plugins/run-tests.sh`) vẫn FAIL — `Results: 1 failed` (đuôi log thu được không lộ rõ dòng FAIL cụ thể, chỉ thấy hai case LV5/LV6 PASS quanh nó) → verdict REJECT.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
