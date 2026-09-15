---
schema_version: 2
feature_slug: release-2-14-0
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8b7be956aced221e92a0119d89913b17f77e551f
human_signoff:
---

# Evidence Report: release-2-14-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E1b | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3a | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | judgment | PASS |
| E5 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-14-0-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so_2_14
  verified_at: 2026-09-15T09:00:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    PASS: P200 xanh (dung 1 dong PASS cua chinh no; phan quyet KHONG lay tu ma thoat tron suite; rang ban 094ab14c)

- eval: E1b
  run_id: minted-release-2-14-0-E1b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.so_tang_2_14
  verified_at: 2026-09-15T09:01:00Z
  output: |
    [neo] so tai commit dua ho so moc vao kho (4c4d58f9) = 2.13.0 · so trong cay lam viec = 2.14.0
    PASS: so trong cay (2.14.0) TANG theo semver so voi so tai commit dua ho so moc vao kho (4c4d58f9) = 2.13.0 — neo suy TU KHO, khong ghim sha

- eval: E2
  run_id: minted-release-2-14-0-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_2_14
  verified_at: 2026-09-15T09:02:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), so doc duoc tai HEAD la 2.7.0 (doi chung duong: cua so moc..HEAD KHONG rong; bo loc diagram-design/ con khop vat; rang ban 0bb56634)

- eval: E3a
  run_id: minted-release-2-14-0-E3a-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-15T09:03:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 873 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-14-0-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-15T09:04:00Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-14-0-E3c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-15T09:05:00Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-14-0-E3d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-15T09:06:00Z
  output: |
    Results: 15 passed, 0 failed (vung-vat-mutants)

    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-14-0-E3e-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-15T09:07:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  votes:
    - domain-correctness: PASS — Bốn khối bắt buộc đủ mặt (năm dòng số · vendored · lỗi tái phát · nhát cắt), bảng năm dòng đủ hai cột với nguồn rút gọi tên từng ô, dòng 2 đếm ba ngăn cho cả hai vòng, và bốn điều bất lợi (token/lượt không giảm, vượt trần cả hai vòng, hai vòng meta so luật (b) cho một, nguồn dòng 4 vòng hai ghi rõ merge commit) đều nói thẳng. Đối chiếu số: dòng 4+5 của do-tin-tram-phan-loai khớp usage-report.md input 2 từng chữ số (tổng per-model out+in+cache_read+cache_create round3=19.223.828, ba round=53.974.767, wall 920s=15,3′, TB 1353s=22,5′); lượt chấm/hạ-tầng-đốt của chu-ky-khong-tu-lam-hoa-cu (6 lượt: r1,r2,r3,r4,r4b,r5; đốt ở r3-triage-fail và r4-agent-chết) khớp đúng "## Iterations" trong input 3; hai số token vòng hai khớp usage-report.md input 4 từng chữ số (round5 PASS=50.195.215, tổng 6 round=145.925.121, cũng khớp cả dòng 5: 1369s=22,8′ PASS, TB 156,5′/6≈26,1).
    - operational-feasibility: PASS — Bốn khối đủ mặt, bảng năm dòng đủ hai cột + nguồn rút, dòng 2 đủ ba ngăn cho cả hai vòng. Đối chiếu số: hai dòng máy đo của do-tin-tram-phan-loai (19.223.828 lượt PASS = tổng round 3; 53.974.767 = tổng 3 round) khớp usage-report.md input 2 từng chữ số; hai số của chu-ky-khong-tu-lam-hoa-cu (50.195.215 lượt PASS = tổng round 5; 145.925.121 = tổng 6 round 1/2/3/4/4b/5) khớp usage-report.md input 4 từng chữ số (tự cộng lại out+in+cache_read+cache_create per-model, đúng nền khai); hạng mục hạ-tầng-đốt "lượt 3 thiếu diffFiles · lượt 4 agent chết" khớp nguyên văn "## Iterations" của evidence-report.md input 3 (Round 3 "triage_failed... thiếu diffFiles", Round 4 "agent chết giữa chừng, hạ tầng"), và run_id các eval trong evidence-report đều mang hậu tố "-r5" nên khớp với round 5 (PASS) của usage-report — đủ nối "6" dù Iterations không gọi tên "Round 5" bằng lời. Bốn điều bất lợi (token/lượt không giảm · vượt trần cả hai vòng · hai vòng meta trong khi luật cho một · nguồn dòng 4 vòng 2 ghi merge commit 8c5c01ac) đều nói thẳng.
    - spec-alignment: PASS — Đủ bốn khối bắt buộc (§1-§4), bảng năm dòng đủ hai cột + nguồn rút cho mọi ô, dòng 2 đếm ba ngăn cho cả hai vòng. Đối chiếu số: tổng ba dòng per-model (out+in+cache_read+cache_create) từ usage-report.md do-tin-tram-phan-loai cho lượt PASS (round 3) = 19.223.828 và tổng 3 vòng = 53.974.767 — khớp chính xác từng chữ số với contract; tương tự usage-report.md chu-ky-khong-tu-lam-hoa-cu: lượt PASS (round 5) = 50.195.215 và tổng 6 vòng = 145.925.121 — khớp chính xác, và hiệu 50.222.052−50.195.215=26.837 đúng như contract mô tả lượt chấm 1 bắt lệch. Số lượt chấm/hạ-tầng-đốt (2 trên 6: round3 triage_failed thiếu diffFiles, round4 BLOCKED tác tử chết) khớp đúng "## Iterations" của evidence-report.md. Bốn điều bất lợi (token/lượt không giảm, vượt trần cả hai vòng, hai vòng meta trong cửa sổ, nguồn merge commit của dòng 4 vòng hai) đều được nói thẳng trong Notes.
  rationale: Ba lens hội tụ PASS không dissent; mọi con số đối chiếu (dòng 4+5 của bảng năm dòng, lượt chấm/hạ-tầng-đốt) khớp usage-report.md và evidence-report.md của hai vòng từng chữ số.

- eval: E5
  run_id: minted-release-2-14-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ton_dong_ghim_lai_2_14
  verified_at: 2026-09-15T09:08:00Z
  output: |
    [khai] so_stale=45 · moc_so=7d12ffad · do tren HEAD=8b7be956 (cay 2 muc chua commit)
           [luoi] soi 120 dong per-slug · 45 ho so DUY NHAT hoa cu tai moc 7d12ffad
    PASS: so ho so hoa cu ghi trong ho so (45 ho so duy nhat tai moc 7d12ffad, do tren HEAD 8b7be956) BANG so luoi dang noi hom nay, va moi lan con so ay xuat hien trong hop dong deu tro ve o marker

## Known limits

## Ngoài hợp đồng

## Analyst

E3a, E3b, E3c, E3d, E3e — pass trên cả HEAD và baseline (regression-guard suite thường trực chạy nền mỗi vòng, không phải phép đo riêng của feature này; không phải chỉ dấu yếu — đây là các suite thường trực đã xanh từ trước).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy (E1, E1b, E2, E3a–E3e, E5) exit 0 và judgment E4 hội tụ PASS ba lens không dissent, nhưng scope-triage phân loại 7 finding TRONG HỢP ĐỒNG (4 high, 3 medium — ánh xạ AC-3 và AC-5) cho thấy E3c không bao giờ thấy được dòng PASS nó đòi và E5 ghim một câu mà rang-ton-dong.sh không hề in — evals xanh không đo đúng như hợp đồng khai, nên verdict tổng REJECT (chi tiết: review-findings.md).