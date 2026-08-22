---
schema_version: 2
feature_slug: release-2-3-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent (đường VERIFY độc lập, 6 lệnh chạy tuần tự — d-4407)
enforcement_mode: strict
bypass_used: false
verified_commit: 73eee3d1a3041383d6e7269b7af87ced70d2a9b1
human_signoff: Manh Phan 2026-08-22 — ký mốc phát hành với known-limits đã khai; ba điều nói thật nằm trong changelog v2.3.0 để người cài đọc được
---

# Evidence Report: release-2-3-0

Round 1. Mốc phát hành không đổi mã cổng; bằng chứng là bốn suite + phép kiểm bản đồ chạy
tuần tự bởi một phiên tươi trên cây `73eee3d1` (working tree sạch). Ca vĩnh viễn P200 in bảy
vế có tên, đủ 5/5 đột biến chạy thật và đối chứng dương bản sao nguyên vẹn; ba chốt cuối của
ba bộ ca PD/VC/DD hiện diện trong cùng lượt suite plugins.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E6 | AC-6 | test | PASS |

## Bằng chứng gốc — năm lệnh, một lượt

    bash tests/plugins/run-tests.sh                →  Results: all plugin tests passed (0 dòng FAIL; P200 7 vế; PD11 · VC8 · DD7 có mặt)
    bash tests/scripts/run-tests.sh                →  Results: 750 passed, 0 failed
    bash tests/hooks/run-tests.sh                  →  Results: 60 passed, 0 failed
    bash tests/workflows/run-tests.sh              →  Results: all workflow tests passed
    node scripts/product-map.mjs --root . --check  →  PRODUCT-MAP.md khớp hồ sơ xưởng.

Diff của nhánh phát hành so với `main b446d8ca` (người đọc trong diff, không răng máy):
`.claude-plugin/plugin.json` · `feature-loop/.claude-plugin/plugin.json` (số + mục `v2.3.0`) ·
`GUIDE.md` (một dòng «Khớp phiên bản») · `PRODUCT-MAP.md` · `_acceptance/release-2-3-0/**`.

## Evidence

- eval: E1
  run_id: release-2-3-0-E1-r1-20260822T023220Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T02:32:20Z
  output: |
    P200 VE: hai plugin cung so: 2.3.0
    P200 VE: acceptance-gate hop semver: 2.3.0
    P200 VE: feature-loop hop semver: 2.3.0
    P200 VE: diagram-design hop semver: 2.5.0
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E2
  run_id: release-2-3-0-E2-r1-20260822T023220Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T02:32:20Z
  output: |
    P200 VE: GUIDE khop so DOC TU manifest
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

- eval: E3
  run_id: release-2-3-0-E3-r1-20260822T023455Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-08-22T02:34:55Z
  output: |
    Results: 750 passed, 0 failed

- eval: E3b
  run_id: release-2-3-0-E3b-r1-20260822T023620Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-08-22T02:36:20Z
  output: |
    Results: 60 passed, 0 failed

- eval: E3c
  run_id: release-2-3-0-E3c-r1-20260822T023220Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T02:32:20Z
  output: |
    Results: all plugin tests passed
    PASS: [PD11] init bước 1: repo đã có config vẫn chạy 5b + câu người-đọc; gỡ câu → đỏ
    PASS: [VC8] mọi hạt giống có ô (ba chân, vũ trụ ≥ 13); 7 stub sống; trạng thái sống một chỗ
    PASS: [DD7] CONTEXT.md có term Đường đo (thước/ngưỡng/số đo, _Avoid_ tracking+metric); gỡ → đỏ
    FAIL count: 0

- eval: E3d
  run_id: release-2-3-0-E3d-r1-20260822T023629Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-22T02:36:29Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: release-2-3-0-E3e-r1-20260822T023635Z
  exit_code: 0
  baseline: n-a
  verifier: node scripts/product-map.mjs --check
  verified_at: 2026-08-22T02:36:35Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E6
  run_id: release-2-3-0-E6-r1-20260822T023220Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T02:32:20Z
  output: |
    P200 VE: mo ta acceptance-gate co muc v2.3.0
    P200 VE: muc v2.3.0 cua feature-loop TU khai cap
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

## Analyst

n-a — không chạy baseline (mốc không đổi mã). Chiều đỏ của P200 sống trong chính ca
(5 đột biến + đối chứng dương). Ngoài ra trước khi mở hồ sơ, tác giả phá thử tay trên cây
thật: đặt `feature-loop` 9.9.9 → «P200 LOI: cay that: hai plugin lech so: acceptance-gate
2.3.0 vs feature-loop 9.9.9» + «GUIDE khong chua cau dan xuat», suite đỏ; khôi phục → xanh.
Lần chạy tay đó KHÔNG phải bằng chứng của eval nào (E1 đã bỏ câu chạy tay sau gap-probe).

## Variance

none — mọi eval tất định.

## Known limits

- **Không có hội đồng / baseline; không làn review** — mốc không đổi mã cổng, bằng chứng là
  bốn suite + P200 (d-4407).
- **«Số ĐÃ đổi so với base» không có răng máy — cố ý** (kế thừa 2.2.0, D17): người đọc diff
  3 dòng. Tái lập: `git diff origin/main...HEAD -- .claude-plugin/plugin.json feature-loop/.claude-plugin/plugin.json GUIDE.md`.
- **Nội dung mục `v2.3.0` (bảy hồ sơ + ba điều nói thật) không có răng máy** — P200 chỉ canh
  mục CÓ mặt và tự khai cặp; chữ bên trong là văn cho người, đọc trong diff manifest.
- **`diagram-design` giữ 2.5.0 không răng riêng** — không đổi kể từ 2.2.0 (`git diff aa130478..HEAD -- diagram-design/` rỗng).
- **53/56 hồ sơ đã ký đang hoá cũ so với nhánh chính — KHÔNG ghim lại trong mốc này** (§7.1,
  d-4405). Hồ sơ bị chặn thật giữa hai mốc thì ghim riêng làn đó.
- **Ba điều nói thật trong changelog chưa có quan sát thực địa**: «máy sau chỉ cần marketplace
  add» (nợ E10 chip A, kiểm tay máy thứ hai sau khi cài bản này); tuổi ý = tuổi ô; đường đo
  chỉ cờ.
- **Cổng Giá trị đang treo cho `duong-do-trong-dinh-nghia-xong`** trên thẻ `/start` của kit —
  lỗ luật «vòng kit tự-dùng không có chặng bàn giao», ngoài mốc.

## Ngoài hợp đồng

Không có làn review ở mốc này. Ba mục TRỪ đã nêu ở rà soát 22/08 (cờ đỏ «n-a baseline» cho
lựa chọn chủ ý · cờ «ngưỡng/biên» dò bằng dấu ≥ · chín điểm ngoài hợp đồng của B + C) cố ý
không vào mốc (d-4403) — chip D sau mốc.

## Iterations

Round 1: đường verify độc lập — 6 lệnh tuần tự trên `73eee3d1`, tất cả exit 0; 8/8 eval PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
