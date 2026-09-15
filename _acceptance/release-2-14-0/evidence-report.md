---
schema_version: 2
feature_slug: release-2-14-0
verdict: REJECT
failed_evals: ["E3c"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 456cd935942eb610844113353a6d446ba233a2ab
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
  run_id: minted-release-2-14-0-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so_2_14
  verified_at: 2026-09-15T14:00:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    PASS: P200 xanh (dung 1 dong PASS cua chinh no; phan quyet KHONG lay tu ma thoat tron suite; rang ban 094ab14c)

- eval: E1b
  run_id: minted-release-2-14-0-E1b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.so_tang_2_14
  verified_at: 2026-09-15T14:01:00Z
  output: |
    [neo] so tai commit dua ho so moc vao kho (4c4d58f9) = 2.13.0 · so trong cay lam viec = 2.14.0
    PASS: so trong cay (2.14.0) TANG theo semver so voi so tai commit dua ho so moc vao kho (4c4d58f9) = 2.13.0 — neo suy TU KHO, khong ghim sha

- eval: E2
  run_id: minted-release-2-14-0-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_2_14
  verified_at: 2026-09-15T14:02:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), so doc duoc tai HEAD la 2.7.0 (doi chung duong: cua so moc..HEAD KHONG rong; bo loc diagram-design/ con khop vat; rang ban 0bb56634)

- eval: E3a
  run_id: minted-release-2-14-0-E3a-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-15T14:03:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 873 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-14-0-E3b-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-15T14:04:00Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-14-0-E3c-r3
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-15T14:05:00Z
  output: |
    FAIL: P177 [MBC] E4 references measure-birth.md: resolver goc-trong-cay-kiem + 4 muc + 2 mau + banh coc bang<->so
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 1 failed

- eval: E3d
  run_id: minted-release-2-14-0-E3d-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-15T14:06:00Z
  output: |
    Results: 15 passed, 0 failed (vung-vat-mutants)

    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-14-0-E3e-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-15T14:07:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  votes:
    - domain-correctness: PASS — Đủ 4 khối Notes (năm dòng số · vendored · lỗi tái phát · nhát cắt), bảng năm dòng đủ hai cột với nguồn rút gọi tên, dòng 2 dùng đúng ba ngăn cho cả hai vòng, và khối năm dòng nói thẳng cả bốn điều bất lợi (token/lượt không giảm, vượt trần cả hai vòng, hai vòng meta so luật (b) một, nguồn dòng-4-vòng-2 ghi rõ merge riêng). Đối chiếu chữ số: tổng 3 vòng do-tin-tram-phan-loai từ usage-report.md (input 2) = 53.974.767 khớp contract "vòng 3 lượt 53.974.767" và lượt PASS (round 3) = 19.223.828 khớp contract y hệt. Tổng 6 vòng chu-ky-khong-tu-lam-hoa-cu từ usage-report.md (input 4) = 145.925.121 khớp contract "vòng 6 lượt", và lượt PASS (round 5) = 50.195.215 khớp contract y hệt (đúng con số đã sửa sau khi bắt lệch 26.837, không còn là số cũ 50.222.052). Số lượt chấm/hạ-tầng-đốt của chu-ky (6 vòng, 2 bị đốt — round 3 triage hỏng thiếu diffFiles, round 4 BLOCKED agent chết) khớp đúng "## Iterations" trong evidence-report.md (input 3).
    - operational-feasibility: PASS — Đủ bốn khối Notes (5 dòng số · vendored · lỗi tái phát · nhát cắt kế), bảng 5 dòng có hai cột cho hai vòng, mỗi ô có nguồn rút, dòng 2 đếm ba ngăn cho cả hai vòng, và bốn điều bất lợi (token/lượt không giảm · vượt trần cả hai vòng · hai vòng meta trong khi luật (b) cho một · nguồn dòng 4 vòng hai) đều được nói thẳng. Đối chiếu số độc lập: dòng 4+5 của do-tin-tram-phan-loai (19.223.828 lượt PASS · 53.974.767/3 vòng · 15,3 và 22,5 phút) khớp digit-for-digit với usage-report.md input 2. Hai số token của vòng hai (50.195.215 lượt PASS, 145.925.121 tổng 6 vòng) khớp digit-for-digit với tổng ba dòng per-model của usage-report.md input 4 qua cả 6 lượt — xác nhận số cũ 50.222.052 đã được sửa đúng theo nguồn. Số "2 trên 6" lượt hạ-tầng-đốt của vòng hai khớp mô tả trong "## Iterations" (round3 triage_failed do thiếu diffFiles, round4 BLOCKED agent chết).
    - spec-alignment: PASS — Bốn khối Notes (5 dòng số · vendored · lỗi tái phát · nhát cắt) đều có mặt; bảng 5 dòng đủ 2 cột (do-tin-tram-phan-loai · chu-ky-khong-tu-lam-hoa-cu) + cột Nguồn rút cho mọi ô; dòng 2 đếm bằng 3 ngăn ①②③ cho cả hai vòng. Đối chiếu số học trực tiếp với 3 nguồn: (a) usage-report.md của do-tin-tram-phan-loai — tổng token round 3 = 19.223.828 khớp hệt "lượt PASS", tổng 3 vòng = 53.974.767 khớp hệt, wall round PASS/TB cũng khớp "15,3 · TB 22,5"; (b) usage-report.md của chu-ky-khong-tu-lam-hoa-cu — tổng token round 5 (PASS) = 50.195.215 khớp hệt, tổng 6 vòng = 145.925.121 khớp hệt, và số "50.222.052" bị sửa (lệch 26.837) đúng như hợp đồng khai; (c) evidence-report.md ## Iterations — 6 lượt chấm (1,2,3,4,4b,5) với đúng 2 lượt hạ-tầng-đốt khớp hệt "2 trên 6". Khối 5 dòng cũng nói thẳng bốn điều bất lợi được yêu cầu.
  rationale: Ba lens hội tụ PASS không dissent; mọi phép đối chiếu số học độc lập của từng lens khớp digit-for-digit với usage-report.md và evidence-report.md của hai vòng nguồn. E4 tự nó không phải nguyên nhân REJECT của vòng này — verdict tổng REJECT đến từ E3c (xem ## Iterations).

- eval: E5
  run_id: minted-release-2-14-0-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ton_dong_ghim_lai_2_14
  verified_at: 2026-09-15T14:08:00Z
  output: |
    PASS: so ho so hoa cu ghi trong ho so (45 ho so duy nhat tai moc 7d12ffad, do tren HEAD 456cd935) BANG so luoi dang noi hom nay, va cac dong VAN HOP DONG co chua «ghim lai» hoac «hoa cu» (da go dinh dang markdown) khong mang con so ho so nao ngoai cac nen da khai o marker

## Known limits

## Ngoài hợp đồng

## Analyst

E3a, E3b, E3d, E3e — pass trên cả HEAD và baseline (regression-guard suite thường trực chạy nền mỗi vòng, không phải phép đo riêng của feature này; không phải chỉ dấu yếu — đây là các suite thường trực đã xanh từ trước). E3c KHÔNG nằm trong nhóm này ở vòng này: nó đỏ thật trên HEAD (xem eval E3c và ## Iterations).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy (E1, E1b, E2, E3a–E3e, E5) exit 0 và judgment E4 hội tụ PASS ba lens không dissent, nhưng scope-triage phân loại 7 finding TRONG HỢP ĐỒNG (4 high, 3 medium — ánh xạ AC-3 và AC-5) cho thấy E3c không bao giờ thấy được dòng PASS nó đòi và E5 ghim một câu mà rang-ton-dong.sh không hề in — evals xanh không đo đúng như hợp đồng khai, nên verdict tổng REJECT (chi tiết: review-findings.md).
Round 2: sau vá 7542e03c (gỡ vế P200 khỏi E3c, sửa expected của E5 chép nguyên khuôn echo, thêm nền so_stale_toan_kho), E1, E1b, E2, E3a, E3b, E3d, E3e, E5 exit 0 và E4 judge giữ nguyên PASS ba lens (input không đổi). Nhưng E3c ĐỎ THẬT lần này: `bash tests/plugins/run-tests.sh` → `FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=`, exit 1, `Results: 1 failed` — một hồi quy thật trong suite plugins, không phải lỗi thước. Verdict tổng REJECT, failed_evals: [E3c] (chi tiết + 3 finding TRONG HỢP ĐỒNG mới của vòng này: review-findings.md).
Round 3: sau các vá 58d13027 (hai lỗi AC-3 — tệp PRODUCT-MAP trỏ tới chưa commit, sổ known-limits thiếu 8 mục vòng trước) và e0804f26 (ĐỔI KHUÔN rang-ton-dong.sh sau DỪNG-VÁ — lời khai bằng đúng phép đo), E1, E1b, E2, E3a, E3b, E3d, E3e, E5 exit 0 và E4 judge giữ nguyên PASS ba lens (input không đổi). E3c ĐỎ THẬT tiếp, nhưng ở một điểm khác lượt trước: `bash tests/plugins/run-tests.sh` → `FAIL: P177 [MBC] E4 references measure-birth.md: resolver goc-trong-cay-kiem + 4 muc + 2 mau + banh coc bang<->so`, exit 1, `Results: 1 failed` (P179 của lượt 2 đã hết, P177 là một hồi quy mới). Verdict tổng REJECT, failed_evals: [E3c] (chi tiết + 13 finding NGOÀI HỢP ĐỒNG của vòng này: review-findings.md).