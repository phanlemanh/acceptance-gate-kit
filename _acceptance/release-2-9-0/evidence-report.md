---
schema_version: 2
feature_slug: release-2-9-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e61649b53fd30dff65f01f8d888042fa9ba78c1f
human_signoff: Manh Phan 2026-09-07 — ký phát hành 2.9.0 với 8 known-limits đã khai; Ngoài-1 mở hợp đồng mới (ô cửa sổ kế), Ngoài-2 ghi Known limits; đồng ý phạm vi đã cắt; phê hết quyết định ghi sau Cổng Phạm vi
---

# Evidence Report: release-2-9-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E6 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-9-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-07T10:00:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E2
  run_id: minted-release-2-9-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-07T10:00:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E3
  run_id: minted-release-2-9-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-07T10:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 797 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-9-0-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-07T10:00:00Z
  output: |
      PASS: V06

    Results: 60 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-9-0-E3c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-07T10:00:00Z
  output: |
      PASS: P86 GATE-MODEL: nguon tsv · 2 ban VI byte-equal · ban EN khop cot en · ngan sach doc-tu-dong va so QUAN HE · 14 dot bien (co ca chi-EN, ca 3 ve deu co chieu do) goi ten dung ban, moi mui tiem deu kiem trung

    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-9-0-E3d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-07T10:00:00Z
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-9-0-E3e-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-07T10:00:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E6
  run_id: minted-release-2-9-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.p200_cat_so
  verified_at: 2026-09-07T10:00:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

## Known limits

1. **AC-1 ghim literal `2.9.0`** — cố ý, số của một mốc là hằng của mốc đó; P200 vẫn đọc
   từ manifest (nếp từ 2.6.0).
2. **E1/E2/E6 giữ hai dòng cuối của ca P200** («P200 OK … 5/5 dot bien …» + «PASS: P200 …»)
   qua khoá `p200_cat_so` — hồ sơ phân biệt được «P200 xanh, 5/5 đột biến chạy» với «suite
   xanh» (đóng Ngoài-6 của 2.8.0) nhưng KHÔNG chứa bảy dòng vế `P200 VE:`; từng vế do P200
   canh trong nhà. Cỗ máy chấm chỉ giữ vài dòng cuối mỗi lệnh (giới hạn có tên của #151).
3. **`verified_at: 2026-09-07T10:00:00Z` là số tròn đứng TRƯỚC run-log (`10:55:58Z`) và
   commit `687f7150`** — lớp «verified_at bịa số tròn» tái phát lần 5 (Ngoài-1 của 2.8.0,
   lần 4). Không sửa tay bằng chứng máy viết; mốc thật của lượt chấm là `ts` trong
   `run-log.jsonl`. Ứng viên phép đo cho cửa sổ kế: so `verified_at` với `ts` run-log.
4. **Không lệnh nào phân biệt được HEAD với base** (Analyst: 6/6 lệnh xanh cả hai phía) —
   đúng bản chất mốc phát hành: không vật hành vi mới, chiều đỏ sống trong P200 (5 đột biến
   + đối chứng dương), không phải dấu hiệu eval hỏng.
5. **Chữ ký mốc này kéo một dòng bản ghi mốc định tuyến** (`tests/scripts/fixtures/`, LM20
   chỉ ghim hồ sơ đã chốt) → bằng chứng hoá cũ ngay tại commit chữ ký → ghim lại MỘT lượt
   lane máy TRƯỚC khi push. #146/#151 push trước khi ghim → 3 CI đỏ hậu-chữ-ký; mốc này đặt
   mục tiêu 0.
6. **Gap-probe phiên tươi được phép đối chiếu cây thật** (git, manifest, ba hồ sơ nguồn) —
   khác luật «critic phán artifact, không audit code» của vòng tính năng, vì hồ sơ mốc là
   hồ sơ VỀ một diff đã tồn tại; khai ở `gap-probe.md`.
7. **Ba dòng số đếm tay từ vết** (commit + sổ + `gh run list`); lượt hạ tầng phiên không
   đếm được từ repo này; số «dán /goal thành một chạm» trượt lần thứ hai vì không vòng nào
   có lượt Cổng 1.
8. **Hai mục ngoài hợp đồng dưới đây đã đóng bằng chữ của chính hồ sơ TRƯỚC khi trình thẻ**
   (sổ 8009) — cây được pin (`verified_commit`) không đổi: chỉ `_acceptance/` và file T1
   (`CLAUDE.md`, `docs/`, `PRODUCT-MAP.md`) đổi sau lượt chấm.

## Ngoài hợp đồng

Hai mục, chi tiết + lời cho người đọc ở `review-findings.md`; thẻ Cổng 2 in hai ô
Ngoài-1..Ngoài-2:

1. Dòng `feature:` của hợp đồng chứa ` #149`/` #151` — reader duy nhất của kit cắt phần sau
   ` #` làm YAML comment, tên hồ sơ hiện cụt trên bản đồ và thẻ (medium). **Đã đóng trước
   khi trình:** viết lại thành «PR 146 · 149 · 151», bản đồ vẽ lại. Lớp: bên VIẾT và bên
   ĐỌC trôi khỏi nhau — ứng viên răng cho cửa sổ kế (lint frontmatter có ` #`), ghi sổ.
2. Cửa sổ đếm của hợp đồng thiếu #154 (luật nới vào `CLAUDE.md`, lên main sau khi mở hồ sơ)
   và Out of scope vẫn liệt việc đó là «không đi cùng mốc» (low). **Đã đóng trước khi
   trình:** gộp `origin/main` (chỉ hai file T1), cửa sổ neo lại `cd94d004 → 0226edde` (13 PR,
   10 không phải vòng, 19 file), bullet Out of scope gỡ vì owner đã tự quyết.

## Analyst

E1, E2, E6 — cmd `bash -c 'set -o pipefail; ONLY_BLOCK=P200 bash tests/plugins/run-tests.sh | grep -F P200'`: xanh trên cả HEAD lẫn baseline (diffBase). Chiều đỏ của ba eval này sống bên TRONG chính P200 (5 đột biến + đối chứng dương bản sao nguyên vẹn, không có bước chạy tay ở vòng này) nên baseline green không phải dấu hiệu thiếu phân biệt của bản thân eval — nhưng vì lệnh cat-so tổng quát pass trên cả hai cây, vẫn liệt kê đúng theo tiêu chí đối chiếu A/B.

E3 — cmd `bash tests/scripts/run-tests.sh`: suite hồi quy xanh trên cả hai phía (guard, không phân biệt tính năng này riêng).

E3b — cmd `bash tests/hooks/run-tests.sh`: suite hồi quy xanh trên cả hai phía.

E3c — cmd `bash tests/plugins/run-tests.sh`: suite hồi quy xanh trên cả hai phía.

E3d — cmd `bash tests/workflows/run-tests.sh`: suite hồi quy xanh trên cả hai phía.

E3e — cmd `node scripts/product-map.mjs --root . --check`: suite hồi quy xanh trên cả hai phía.

## Variance

none — không có eval nào trong vòng này chạy nhiều lần (runs>1), nên không có pass_rate hỗn hợp cần người quyết.

## Iterations

Round 1: E1, E2, E3, E3b, E3c, E3d, E3e, E6 tất cả PASS ngay từ vòng đầu — không có vòng nào bị trả về implementation.

### Re-pin lần 1 — 2026-09-07, thuế một-dòng-mỗi-chữ-ký: dòng định tuyến của chính hồ sơ này (trong `tests/scripts/fixtures/`) ghim cùng commit chữ ký nên hồ sơ tự hoá cũ
run_id: repin-20260907-rel290-1
sha: e61649b53fd30dff65f01f8d888042fa9ba78c1f · suites: 5 lệnh exit 0 chạy bởi một agent tươi trên đúng nội dung cây này (14:45→14:58Z: scripts 797/0 · hooks 60/0 · plugins all-pass · workflows 44/0 · product-map --check khớp) · pin cũ: a36ee245 · chữ ký người giữ nguyên.
Khác #146/#151: ghim lại TRƯỚC khi push, nên commit chữ ký không bao giờ chạy CI ở trạng thái hoá cũ — mục tiêu 0 CI đỏ hậu-chữ-ký của mốc này. Vòng khép kín vẫn còn (cùng họ `release-2-8-0#7`), thuộc ô «Đường lùi phải sống» đã gọi tên.
