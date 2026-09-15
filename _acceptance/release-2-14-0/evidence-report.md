---
schema_version: 2
feature_slug: release-2-14-0
verdict: REJECT
failed_evals: ["E3c"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: fa5d7301000d29b5ddfabfc4d7e2855f3e88545f
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
| E3c | AC-3 | test | FAIL |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | judgment | PASS |
| E5 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-14-0-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so_2_14
  verified_at: 2026-09-15T16:00:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    PASS: P200 xanh (dung 1 dong PASS cua chinh no; phan quyet KHONG lay tu ma thoat tron suite; rang ban 094ab14c)

- eval: E1b
  run_id: minted-release-2-14-0-E1b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.so_tang_2_14
  verified_at: 2026-09-15T16:01:00Z
  output: |
    [neo] so tai commit dua ho so moc vao kho (4c4d58f9) = 2.13.0 · so trong cay lam viec = 2.14.0
    PASS: so trong cay (2.14.0) TANG theo semver so voi so tai commit dua ho so moc vao kho (4c4d58f9) = 2.13.0 — neo suy TU KHO, khong ghim sha

- eval: E2
  run_id: minted-release-2-14-0-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_2_14
  verified_at: 2026-09-15T16:02:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), so doc duoc tai HEAD la 2.7.0 (doi chung duong: cua so moc..HEAD KHONG rong; bo loc diagram-design/ con khop vat; rang ban 0bb56634)

- eval: E3a
  run_id: minted-release-2-14-0-E3a-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-15T16:03:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 873 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-14-0-E3b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-09-15T16:04:00Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-14-0-E3c-r4
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-15T16:05:00Z
  output: |
    FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 1 failed

- eval: E3d
  run_id: minted-release-2-14-0-E3d-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-09-15T16:06:00Z
  output: |
    Results: 15 passed, 0 failed (vung-vat-mutants)

    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-14-0-E3e-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-09-15T16:07:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  votes:
    - domain-correctness: PASS — Bốn khối Notes đủ mặt (năm dòng số · vendored · lỗi tái phát · nhát cắt kế), bảng năm dòng có hai cột + nguồn rút cho mọi ô, dòng 2 đếm ba ngăn cho cả hai vòng, và bốn điều bất lợi (token/lượt không giảm · vượt trần cả hai vòng · hai vòng meta so luật (b) một · dòng 4 vòng hai ghi nguồn merge 8c5c01ac) đều được nói thẳng. Tự tính lại cả ba phép đối chiếu bằng cách cộng out+in+cache_read+cache_create theo từng round trong hai usage-report.md: (i) do-tin-tram-phan-loai lượt PASS = 19.223.828 (round 3) và tổng 3 vòng = 53.974.767 — khớp contract từng chữ số; (ii) chu-ky-khong-tu-lam-hoa-cu có đúng 6 lượt chấm (1,2,3,4,4b,5) với 2 lượt hạ-tầng-đốt là round 3 (thiếu diffFiles) và round 4 (agent chết) — khớp `## Iterations` của evidence-report.md; (iii) lượt PASS (round 5) = 50.195.215 và tổng 6 vòng = 145.925.121 — khớp contract, kể cả số lệch 26.837 (50.222.052 − 50.195.215) được ghi đúng.
    - operational-feasibility: PASS — Bốn khối Notes đủ mặt (năm dòng số · lớp vendored · lớp lỗi tái phát · nhát cắt kế), bảng năm dòng đủ hai cột cho hai vòng đã ký, mỗi ô có nguồn rút, dòng 2 đếm bằng ba ngăn cho cả hai vòng, và bốn điều bất lợi (token/lượt không giảm · vượt trần cả hai vòng · hai vòng meta trong khi luật cho một · dòng 4 vòng hai ghi rõ nguồn merge) đều nói thẳng. Tự tính lại đúng ba phép đối chiếu nhãn-với-nguồn cho phép: (i) do-tin-tram-phan-loai — tổng token 3 vòng theo usage-report.md (input 2) = 15.075.863+19.675.076+19.223.828 = 53.974.767 và lượt PASS (vòng 3) = 19.223.828, khớp tuyệt đối con số trong hợp đồng; wall-time 920s≈15,3 và TB 1353s≈22,5 cũng khớp; (ii) chu-ky-khong-tu-lam-hoa-cu — ## Iterations (input 3) xác nhận 6 lượt chấm, 2 lượt hạ-tầng-đốt (round 3 triage_failed thiếu diffFiles, round 4 BLOCKED agent chết), khớp "2 trên 6"; (iii) usage-report.md của vòng đó (input 4) cho lượt PASS (round 5) = 50.195.215 và tổng 6 vòng (16.425.202+13.672.390+32.671.076+16.727.172+16.234.066+50.195.215) = 145.925.121, khớp tuyệt đối cả hai số trong hợp đồng.
    - spec-alignment: PASS — Bốn khối Notes (năm dòng số · vendored · lỗi tái phát · nhát cắt kế) đủ mặt, bảng năm dòng đủ hai cột với nguồn rút cho mọi ô, dòng 2 đếm ba ngăn cho cả hai vòng, và khối năm dòng nói thẳng cả bốn điều bất lợi (token/lượt không giảm, vượt trần cả hai vòng, hai vòng meta so luật (b) một, dòng 4 vòng hai ghi nguồn merge riêng). Ba phép đối chiếu nhãn-với-nguồn đều khớp CHÍNH XÁC từng chữ số khi tôi tự cộng lại từ input: (i) do-tin-tram-phan-loai lượt PASS=round3=19.223.828, tổng 3 vòng=53.974.767 (đúng usage-report.md); (ii) chu-ky-khong-tu-lam-hoa-cu có 6 lượt chấm (1,2,3,4,4b,5), 2 lượt hạ-tầng-đốt (round3 triage hỏng, round4 agent chết) — khớp ## Iterations; (iii) tổng per-model (out+in+cache_read+cache_create) của lượt PASS (round5) = 50.195.215 và tổng cả 6 vòng = 145.925.121, cả hai khớp usage-report.md ở input thứ tư (tôi cộng tay round1..round4b,5 ra đúng 16.425.202/13.672.390/32.671.076/16.727.172/16.234.066/50.195.215, tổng = 145.925.121).
  rationale: Ba lens hội tụ PASS không dissent; mọi phép đối chiếu số học độc lập của từng lens khớp digit-for-digit với usage-report.md và evidence-report.md của hai vòng nguồn. E4 tự nó không phải nguyên nhân REJECT của vòng này — verdict tổng REJECT đến từ E3c (xem ## Iterations).

- eval: E5
  run_id: minted-release-2-14-0-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ton_dong_ghim_lai_2_14
  verified_at: 2026-09-15T16:08:00Z
  output: |
    [khai] so_stale=45 · so_stale_toan_kho=71 · moc_so=7d12ffad · do tren HEAD=fa5d7301 (cay 0 muc chua commit)
           [luoi] soi 120 dong per-slug · 45 ho so DUY NHAT hoa cu tai moc 7d12ffad
    PASS: so ho so hoa cu ghi trong ho so (45 ho so duy nhat tai moc 7d12ffad, do tren HEAD fa5d7301) BANG so luoi dang noi hom nay, va cac dong VAN HOP DONG co chua «ghim lai» hoac «hoa cu» (da go dinh dang markdown) khong mang con so ho so nao ngoai cac nen da khai o marker

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 3 — baseline khong do lai round nay.

E3a, E3b, E3d, E3e — non-discriminating (pass trên cả HEAD lẫn baseline ở lần đo gần nhất, round 3; đây là các suite hồi quy thường trực chạy nền mỗi vòng, không phải phép đo riêng của feature này). E3c KHÔNG nằm trong nhóm này ở vòng này: nó đỏ thật trên HEAD (xem eval E3c và ## Iterations).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy (E1, E1b, E2, E3a–E3e, E5) exit 0 và judgment E4 hội tụ PASS ba lens không dissent, nhưng scope-triage phân loại 7 finding TRONG HỢP ĐỒNG (4 high, 3 medium — ánh xạ AC-3 và AC-5) cho thấy E3c không bao giờ thấy được dòng PASS nó đòi và E5 ghim một câu mà rang-ton-dong.sh không hề in — evals xanh không đo đúng như hợp đồng khai, nên verdict tổng REJECT (chi tiết: review-findings.md).
Round 2: sau vá 7542e03c (gỡ vế P200 khỏi E3c, sửa expected của E5 chép nguyên khuôn echo, thêm nền so_stale_toan_kho), E1, E1b, E2, E3a, E3b, E3d, E3e, E5 exit 0 và E4 judge giữ nguyên PASS ba lens (input không đổi). Nhưng E3c ĐỎ THẬT lần này: `bash tests/plugins/run-tests.sh` → `FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=`, exit 1, `Results: 1 failed` — một hồi quy thật trong suite plugins, không phải lỗi thước. Verdict tổng REJECT, failed_evals: [E3c] (chi tiết + 3 finding TRONG HỢP ĐỒNG mới của vòng này: review-findings.md).
Round 3: sau các vá 58d13027 (hai lỗi AC-3 — tệp PRODUCT-MAP trỏ tới chưa commit, sổ known-limits thiếu 8 mục vòng trước) và e0804f26 (ĐỔI KHUÔN rang-ton-dong.sh sau DỪNG-VÁ — lời khai bằng đúng phép đo), E1, E1b, E2, E3a, E3b, E3d, E3e, E5 exit 0 và E4 judge giữ nguyên PASS ba lens (input không đổi). E3c ĐỎ THẬT tiếp, nhưng ở một điểm khác lượt trước: `bash tests/plugins/run-tests.sh` → `FAIL: P177 [MBC] E4 references measure-birth.md: resolver goc-trong-cay-kiem + 4 muc + 2 mau + banh coc bang<->so`, exit 1, `Results: 1 failed` (P179 của lượt 2 đã hết, P177 là một hồi quy mới). Verdict tổng REJECT, failed_evals: [E3c] (chi tiết + 13 finding NGOÀI HỢP ĐỒNG của vòng này: review-findings.md).
Round 4: sau lượt sổ know-limits (9625c3fb, fa5d7301), E1, E1b, E2, E3a, E3b, E3d, E3e, E5 exit 0 và E4 judge PASS ba lens không dissent (chấm mới, không carried). E3c ĐỎ THẬT tiếp, quay lại đúng test đã từng đỏ ở round 2 (P179) nhưng với chi tiết khác: `bash tests/plugins/run-tests.sh` → `FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=` kèm dòng `MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'`, exit 1, `Results: 1 failed`. Scope-triage vòng này: 0 finding TRONG HỢP ĐỒNG, 11 finding NGOÀI HỢP ĐỒNG mới (0 carried từ round trước — tệp đã đổi). Verdict tổng REJECT, failed_evals: [E3c] (chi tiết: review-findings.md).