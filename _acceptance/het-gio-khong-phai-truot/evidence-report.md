---
schema_version: 2
feature_slug: het-gio-khong-phai-truot
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f2fc5353f98e42ff298b98a1a6b5a2d8b696d04f
human_signoff:
---

# Evidence Report: het-gio-khong-phai-truot

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-7 | test | PASS |

## Lệnh fail không gắn eval (nguyên nhân REJECT)

Cả 8 eval của contract (E1–E8) đều PASS trên harness riêng của chúng — nhưng verdict tổng vẫn REJECT vì hai lệnh sau, không thuộc bất kỳ eval nào trong contract, fail:

- cmd: `bash tests/plugins/run-tests.sh`
  exit_code: 1
  output: |
    Traceback (most recent call last):
      File "<stdin>", line 51, in <module>
    AssertionError: PRODUCT-MAP.md cua kit lech voi ho so xuong: PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node scripts/product-map.mjs --root .
    Traceback (most recent call last):
      File "<stdin>", line 26, in <module>
    AssertionError: doi chung duong hong: ban do cua kit dang lech san (PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node scripts/product-map.mjs --root .)
      PASS: P199 hfl_clause mot nguon: 6 ca fixture code-sinh va hai khoi (P90 va khoi Gate 1) cung import, khong chep tay (siet-rang-cau-ve-hinh E1 E2 E6 E7)

    Results: 2 failed

- cmd: `node scripts/product-map.mjs --root . --check`
  exit_code: 1
  output: |
    PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node scripts/product-map.mjs --root .

Cả hai cùng một nguyên nhân gốc: PRODUCT-MAP.md của kit đang lệch với hồ sơ xưởng thật (drift — chưa chạy `node scripts/product-map.mjs --root .` để cập nhật bản đồ sau khi cây đổi).

Ghi chú: các suite khác không gắn eval đều xanh — `tests/scripts/run-tests.sh` (704 passed, 0 failed), `tests/hooks/run-tests.sh` (60 passed, 0 failed) — không phải nguyên nhân REJECT.

## Evidence

- eval: E1
  run_id: minted-het-gio-khong-phai-truot-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T09:00:00Z
  output: |
    PASS: TON-KHO 273 case cu nguyen van
    RANG-HGKPT OK (16 pin + 273 ton kho)

- eval: E2
  run_id: minted-het-gio-khong-phai-truot-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T09:00:00Z
  output: |
    PASS: TON-KHO 273 case cu nguyen van
    RANG-HGKPT OK (16 pin + 273 ton kho)

- eval: E3
  run_id: minted-het-gio-khong-phai-truot-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T09:00:00Z
  output: |
    PASS: TON-KHO 273 case cu nguyen van
    RANG-HGKPT OK (16 pin + 273 ton kho)

- eval: E4
  run_id: minted-het-gio-khong-phai-truot-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T09:00:00Z
  output: |
    PASS: TON-KHO 273 case cu nguyen van
    RANG-HGKPT OK (16 pin + 273 ton kho)

- eval: E5
  run_id: minted-het-gio-khong-phai-truot-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T09:00:00Z
  output: |
    PASS: TON-KHO 273 case cu nguyen van
    RANG-HGKPT OK (16 pin + 273 ton kho)

- eval: E6
  run_id: minted-het-gio-khong-phai-truot-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T09:00:00Z
  output: |
    PASS: TON-KHO 273 case cu nguyen van
    RANG-HGKPT OK (16 pin + 273 ton kho)

- eval: E7
  run_id: minted-het-gio-khong-phai-truot-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-18T09:00:00Z
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E8
  run_id: minted-het-gio-khong-phai-truot-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_hgkpt
  verified_at: 2026-08-18T09:00:00Z
  output: |
    PASS: TON-KHO 273 case cu nguyen van
    RANG-HGKPT OK (16 pin + 273 ton kho)

## Analyst

- E7 (`bash tests/workflows/run-tests.sh`) — baseline: green, tức xanh trên cả HEAD và diffBase. Đây là regression-guard có chủ ý: AC-7 đòi suite workflows tồn kho (44 case cũ) không được vỡ khi thêm case mới, nên bản chất lời hứa là "không đổi hành vi cũ" — baseline vốn xanh là kỳ vọng đúng, không phải dấu hiệu eval vô dụng. Giữ nguyên, không cần viết lại để assert hành vi mới.

## Variance

none — không có eval nào có `runs` > 1 (không có eval ngẫu nhiên trong vòng này).

## Iterations

Round 1: không eval nào (E1–E8) tự thất bại, nhưng hai lệnh không gắn eval — `bash tests/plugins/run-tests.sh` và `node scripts/product-map.mjs --root . --check` — exit 1 vì PRODUCT-MAP.md của kit lệch với hồ sơ xưởng (chưa chạy `node scripts/product-map.mjs --root .` sau khi cây đổi). Verdict REJECT, trả về implementation để cập nhật bản đồ rồi verify lại.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
