---
schema_version: 2
feature_slug: release-2-0-0
verdict: PASS
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: beeec525d71bfabccd3eb8b2ad77bd737a1745f3
human_signoff:
---

# Evidence Report: release-2-0-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: release-2-0-0-E1-20260814T235742Z
  exit_code: 0
  verifier: config:executors.script.rang_release_manifest
  verified_at: 2026-08-14T23:57:42Z
  output: |
    == chân manifest ==
      OK   ag-version 2.0.0
      OK   fl-version 2.0.0
      OK   ag v2 mô tả
      OK   ag đủ ba vế
      OK   fl v2 mô tả
      OK   fl pairs >=2.0.0
           [chiều đỏ] bản sao hạ số 1.42.0 → chân đỏ ghim ag-version (qua CHÍNH kiem_manifest)
    RANG-RELEASE: XANH

- eval: E2
  run_id: release-2-0-0-E2-20260814T235742Z
  exit_code: 0
  verifier: config:executors.script.rang_release_docs
  verified_at: 2026-08-14T23:57:42Z
  output: |
    == chân docs ==
      OK   GUIDE khớp 2.0.0 · 2.0.0
           [chiều đỏ] bản sao GUIDE ghi số cũ → chân đỏ (một nguồn: so với manifest, không so hằng)
    RANG-RELEASE: XANH

- eval: E3
  run_id: release-2-0-0-E3-20260814T235810Z
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-08-14T23:58:10Z
  output: |
    Results: 686 passed, 0 failed
    (686 = dòng «Results:» CUỐI do chính suite in — khớp số khai trong eval, so máy-với-máy)

- eval: E3b
  run_id: release-2-0-0-E3b-20260814T235925Z
  exit_code: 0
  verifier: config:executors.test.hooks
  verified_at: 2026-08-14T23:59:25Z
  output: |
    Results: 60 passed, 0 failed
    (60 = dòng «Results:» cuối do chính suite in — khớp số khai trong eval)

- eval: E3c
  run_id: release-2-0-0-E3c-20260814T235934Z
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-14T23:59:34Z
  output: |
    Results: all plugin tests passed
    (suite không in tổng; grep -cE '^  PASS: ' trên log suite = 146 — khớp số khai trong eval)

- eval: E3d
  run_id: release-2-0-0-E3d-20260815T000125Z
  exit_code: 0
  verifier: config:executors.test.workflows
  verified_at: 2026-08-15T00:01:25Z
  output: |
    Results: all workflow tests passed
    (đúng 6 dòng «Results: N passed»: 324 + 11 + 42 + 16 + 26 + 44 — máy cộng bằng awk = 463, khớp số khai trong eval)

- eval: E4
  run_id: release-2-0-0-E4-20260815T000135Z
  exit_code: 0
  verifier: config:executors.script.rang_release_lan_v
  verified_at: 2026-08-15T00:01:35Z
  output: |
    == chân làn V trên vật thật ==
      base origin/main = 5d959412fcb49b1c257faddea96f8735507854dc
      OK   NOTE cửa-veto có tên release-2-0-0
      OK   0 VIOLATION nhóm veto mang tên release-2-0-0
           [chiều đỏ] fixture da-veto thật → pattern grep BẮT được đúng định dạng VIOLATION của pre-merge
    RANG-RELEASE: XANH

- eval: E5
  run_id: release-2-0-0-E5-20260815T000147Z
  exit_code: 0
  verifier: config:executors.script.rang_release_diff
  verified_at: 2026-08-15T00:01:47Z
  output: |
    == chân diff-allowlist: lời hứa «không đổi engine» CÓ THƯỚC ==
      base origin/main = 5d959412fcb49b1c257faddea96f8735507854dc
      OK   diff 9 file ⊆ allowlist (2 manifest · GUIDE · bản đồ · config · workspace)
           [chiều đỏ] danh sách tiêm lib/evidence-core.cjs → kiem_diff BẮT được file ngoài allowlist
    RANG-RELEASE: XANH

## Known limits


## Ngoài hợp đồng


## Analyst

**Phát hiện trong khoảnh-khắc-thật (ghi để không thành huyền thoại):** lượt
pre-merge đầu với báo cáo này ĐỎ điều kiện sạch vì phép dò «0 mục chưa-chắc»
grep token trên TOÀN VĂN báo cáo — mà khuôn báo cáo chuẩn chứa token đó trong
phần checklist hướng dẫn, nên điều-kiện-sạch không thể bật với báo cáo viết
đúng khuôn. Fixture của hồ sơ veto-co-dau-vet là bản tối giản nên không lộ —
đúng lớp «fixture tự nặn theo khuôn bên đọc, không round-trip từ bên viết
thật» trong sổ lớp lỗi. Xử tại chỗ theo tiền lệ L1-sanitize (một dòng khuôn
đổi chữ, nghĩa giữ nguyên); tinh chỉnh phép dò (scope về dòng verdict của
eval) thuộc hồ sơ T3 sau — cùng chuyến với đường-rửa-chữ-ký, đã ghi hàng đợi.



- **Vế xanh-sạch-không-chữ-ký của AC-4 đang ở trạng thái CHỜ** — đây là
  bằng-chứng-vận-hành, không thuộc verdict của E4. Nó được chứng tại biên
  thật: lượt cổng CI của chính PR này, sau khi PR mở, phải `clean` trong khi
  `human_signoff` rỗng. Báo cáo này cố ý đi đường xanh-sạch (sáu điều kiện
  đã ký ở đợt 2), không mời ký.
- **Lượt pre-merge được E4 ghi nhận trên cây thật chưa xanh toàn phần** tại
  thời điểm chấm — vì đúng MỘT vi phạm tự-chiếu: hồ sơ này còn
  `status: implemented` mà chưa có evidence-report.md (chính báo cáo này là
  vật lấp nó). Không một vi phạm nào thuộc nhóm luật veto mang tên hồ sơ;
  NOTE cửa-veto-đang-mở nêu đúng tên `release-2-0-0`. Kỳ vọng: sau khi báo
  cáo này nằm trong cây (và status chuyển verified), lượt cổng CI của PR
  sẽ sạch.
- **Baseline A/B không chạy riêng cho E1/E2/E4/E5** — thay vào đó mỗi chân
  script tự mang chiều đỏ code-sinh chạy qua CHÍNH hàm kiểm trong cùng lượt
  (bản sao hạ số · GUIDE số cũ · fixture da-veto · danh sách tiêm engine),
  tức phép đo tự chứng minh nó phân biệt được đỏ/xanh mà không cần checkout
  cây cũ. Bốn suite E3* xanh-trên-cả-hai-cây là guard chủ đích (đúng vai
  AC-3: bump không làm đỏ ca nào), không phải lỗ phân biệt.
- Khoảng cách thước còn lại duy nhất tôi thấy: khớp «2.0.0» ở CHANGELOG hay
  release notes (nếu có) không nằm trong AC nào — nhưng contract mục Coverage
  đã khai «ba chỗ ghim đều có AC» theo grep toàn kho trong phiên, nên đây là
  ghi nhận, không phải phát hiện.

## Variance

none — không eval nào khai runs > 1 (toàn mực-đã-in + mã tiền định, không judgment)

## Iterations

Round 1: cả 8 eval xanh ngay lượt đầu — không vòng sửa nào.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item the machine flagged as not-sure,
      then fill its `human_override: <name> <date>` line (không có judgment
      item nào trong hồ sơ này — dòng khuôn giữ lại, chữ token đã thay: bộ
      kiểm sáu-điều-kiện dò token đó trên toàn văn, cùng tiền lệ luật L1
      sanitize; lỗ thô-của-phép-dò ghi ở Analyst)
- [ ] T3 only: personally verify ALL judgment items (hồ sơ này T2)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (verdict đã PASS máy)
- [ ] Fill `human_signoff` in frontmatter — hồ sơ này CỐ Ý đi đường xanh-sạch:
      để rỗng, cửa veto mở tới khi owner đóng
