---
schema_version: 2
feature_slug: ra-co-ten-lam-va-trao
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3010d484c081023ea3c5c8140743a9127cd4128d
human_signoff:
---

<!-- Sáu điều kiện xanh-sạch — NGUỒN DUY NHẤT. scripts/khong-can-nguoi.mjs (xanhSach) và
     scripts/pre-merge-check.sh (xanh_sach_check) kiểm ĐÚNG thứ tự này; ca RT1 so round-trip
     ba đầu. Hai mục cuối phải HIỆN DIỆN-và-rỗng trong báo cáo: vắng ≠ rỗng. -->
<!-- <<<EVIDENCE-XANH-SACH-BLOCK -->
verdict-pass   verdict: PASS (chỉ PASS mới xanh-sạch)
bypass         bypass_used không true
enforcement    enforcement_mode không off
tier           risk_tier của hợp đồng là T2
uncertain      không có mục UNCERTAIN trong báo cáo
sections       hai mục «Known limits» và «Ngoài hợp đồng» hiện diện và rỗng
<!-- EVIDENCE-XANH-SACH-BLOCK>>> -->

# Evidence Report: ra-co-ten-lam-va-trao

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-12 | test | PASS |
| E13 | AC-13 | test | PASS |
| E14 | AC-14 | test | PASS |
| E15 | AC-15 | test | PASS |
| E16 | AC-16 | test | PASS |
| E17 | AC-17 | test | PASS |

⚠ Bảng trên là kết quả MÁY (mọi lệnh exit 0, `failed_evals` rỗng). Verdict tổng vòng này vẫn là **REJECT** — lý do nằm ở review (adversarial-verify), không ở exit code. Xem đoạn ngay dưới và `review-findings.md` mục «## Trong hợp đồng».

## Evidence

Cả 17 eval của hợp đồng đều thuộc executor `test`, cùng nằm dưới một lệnh `bash tests/plugins/run-tests.sh`, và lệnh này chạy xanh — exit 0, không còn bị rate-limit như ba lượt đầu của vòng này. Không có eval judgment/UI nào trong hợp đồng vòng này nên không có judge panel hay block `screenshot:`/`network_observed:` nào cần trình.

Tuy vậy: review vòng này xác nhận 5 finding TRONG hợp đồng, ánh xạ vào AC-8, AC-13 (×3) và AC-17 — mỗi finding kèm bằng chứng chạy thật trên bản sao cây (đổi một dòng thật, quan sát máy đổi màu, rồi hoàn nguyên). Cả ba finding chạm AC-13 chứng minh chính oracle của RT13(iii) chép tay lại luật của `lib/nguong-o-co-hoi.cjs` thay vì gọi hàm dùng chung, và bản chép lệch một ngày + lệch định nghĩa `chốt` + áp sai phạm vi (`inProgress`) — nghĩa là RT13 xanh không phải vì hợp đồng đúng mà vì chính phép đo có lỗ hổng, và ca đo sẽ tự đỏ vào 2026-08-30 dù không ai đụng code. Finding chạm AC-8 chỉ ra bước 1 và bước 2 của thân lệnh `commands/approve.md` tự mâu thuẫn nhau trên ô ngưỡng còn `[đề xuất]`, và không case nào của RT8 phủ đúng mâu thuẫn đó. Finding chạm AC-17 chỉ ra RT17 khai «rút từ thân lệnh» nhưng thực chất là bốn regex chép tay không có ràng buộc số ca = số vế, nên thêm/bớt một vế thật trong `approve.md` sẽ không làm RT17 đỏ. `failed_evals` để rỗng đúng nghĩa đen (không lệnh máy nào thoát khác 0); REJECT ở đây là do máy-tự-tin-nhầm-chính-nó bị vạch ra ở lớp đo, không phải do một lệnh chạy thất bại.

- eval: E1
  run_id: minted-ra-co-ten-lam-va-trao-E1-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-ra-co-ten-lam-va-trao-E2-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-ra-co-ten-lam-va-trao-E3-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-ra-co-ten-lam-va-trao-E4-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-ra-co-ten-lam-va-trao-E5-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-ra-co-ten-lam-va-trao-E6-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed

- eval: E7
  run_id: minted-ra-co-ten-lam-va-trao-E7-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed

- eval: E8
  run_id: minted-ra-co-ten-lam-va-trao-E8-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed
  note: |
    Máy PASS nhưng review xác nhận finding TRONG hợp đồng trên chính AC-8 —
    xem review-findings.md «Răng chiều đỏ của /approve chặn đúng lối mà chính
    bước 2 dựng ra». RT8 chưa phủ đúng mâu thuẫn bước 1/bước 2 trên ô `[đề xuất]`.

- eval: E9
  run_id: minted-ra-co-ten-lam-va-trao-E9-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed

- eval: E10
  run_id: minted-ra-co-ten-lam-va-trao-E10-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed

- eval: E11
  run_id: minted-ra-co-ten-lam-va-trao-E11-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed

- eval: E12
  run_id: minted-ra-co-ten-lam-va-trao-E12-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed

- eval: E13
  run_id: minted-ra-co-ten-lam-va-trao-E13-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed
  note: |
    Máy PASS nhưng review xác nhận BA finding TRONG hợp đồng trên chính AC-13
    (oracle timebox/ngưỡng của RT13(iii) chép tay lệch luật lib một ngày, lệch
    định nghĩa `chốt`, và áp sai phạm vi lên nhóm inProgress) — cả ba đã chứng
    bằng chạy thật trên bản sao cây, xem review-findings.md.

- eval: E14
  run_id: minted-ra-co-ten-lam-va-trao-E14-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed

- eval: E15
  run_id: minted-ra-co-ten-lam-va-trao-E15-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed

- eval: E16
  run_id: minted-ra-co-ten-lam-va-trao-E16-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed

- eval: E17
  run_id: minted-ra-co-ten-lam-va-trao-E17-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.test.plugins
  verified_at: 2026-08-24T01:13:19Z
  output: |
    bash tests/plugins/run-tests.sh (một lượt chạy chung, phủ E1-E17)
    PASS: ca ra co ten — RT17 (ho so ra-co-ten-lam-va-trao)

    Results: all plugin tests passed
  note: |
    Máy PASS nhưng review xác nhận finding TRONG hợp đồng trên chính AC-17 —
    RT17 khai "bốn vế rút từ thân lệnh" nhưng là bốn regex chép tay, không ràng
    buộc số ca = số vế. Xem review-findings.md.

Ngoài E1–E17, bốn lệnh suite/kiểm tra khác cũng chạy xanh trong cùng vòng — không gán riêng eval/AC nào (baseline: n-a), không có run_id minted, chỉ ghi lại làm bối cảnh regression-guard:
- `bash tests/scripts/run-tests.sh` — exit 0, tail: "PASS: ARM13-mut / Results: 750 passed, 0 failed"
- `bash tests/hooks/run-tests.sh` — exit 0, tail: "PASS: V06 / Results: 60 passed, 0 failed"
- `bash tests/workflows/run-tests.sh` — exit 0, tail: "Results: 44 passed, 0 failed / Results: all workflow tests passed"
- `node scripts/product-map.mjs --root . --check` — exit 0, tail: "PRODUCT-MAP.md khớp hồ sơ xưởng."

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt).

## Variance

none — every multi-run eval is uniform (không có eval nào khai `runs` > 1 trong hợp đồng vòng này).

## Iterations

Round 1: cả 5 lệnh máy (bash tests/plugins/run-tests.sh phủ E1-E15, bash tests/scripts/run-tests.sh, bash tests/hooks/run-tests.sh, bash tests/workflows/run-tests.sh, node scripts/product-map.mjs --root . --check) đều BLOCKED — Bash classifier (claude-sonnet-5[1m]) bị rate-limit toàn nền tảng nên tool từ chối xác định an toàn lệnh và không thực thi được; đây là giới hạn hạ tầng, không phải lỗi implementation. Không có vòng implementation nào chạy trong lượt đó.
Round 2: hạ tầng hết rate-limit — cả 15 eval (bash tests/plugins/run-tests.sh) và 4 lệnh suite/kiểm tra bổ sung chạy xanh, exit 0; verdict PASS.
Round 3: review sau PASS round 2 phát hiện finding trong hợp đồng (AC-15/AC-8/AC-13/AC-17); code sửa tại commit 47299d3c thêm E16 (AC-16) + E17 (AC-17) và cập nhật 5 giới hạn đã biết vào sổ, nhưng cùng 5 lệnh máy lại BLOCKED — Bash classifier (claude-sonnet-5) rate-limit trở lại, không xác định được an toàn lệnh nên không thực thi được; hạ tầng, không phải lỗi implementation.
Round 4: ba lượt đầu của vòng này tiếp tục BLOCKED do hạ tầng (rate-limit classifier + máy ngủ giữa chừng — cùng lớp Round 1/Round 3, không phải lỗi implementation); lượt cuối hạ tầng thông, cả 17 eval (bash tests/plugins/run-tests.sh) + 4 lệnh suite/kiểm tra bổ sung chạy xanh, exit 0. Nhưng review (adversarial-verify) vòng này xác nhận 5 finding TRONG hợp đồng, ánh xạ AC-8, AC-13 (×3), AC-17 — xem review-findings.md — mỗi finding có bằng chứng chạy thật trên bản sao cây chứng minh chính E8/E13/E17 có lỗ hổng đo lường (approve.md bước 1 mâu thuẫn bước 2 trên ô `[đề xuất]`; oracle timebox/ngưỡng của RT13 chép tay lệch luật lib một ngày + lệch định nghĩa `chốt` + áp sai phạm vi inProgress; RT17 chưa thật sự rút vế từ thân lệnh approve.md, không ràng buộc số ca = số vế). Verdict REJECT — trả lại implementation để (a) sửa approve.md bỏ vế `[đề xuất]` khỏi điều kiện chặn ở bước 1, (b) sửa RT13 gọi thẳng `lib/nguong-o-co-hoi.cjs` thay vì chép luật và mở phạm vi quét sang `considering`, (c) sửa RT17 rút vế từ khối marker trong `approve.md` kèm ràng buộc số ca biên = số vế rút được.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
