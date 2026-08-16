---
schema_version: 1
slug: release-2-1-0
round: 1
verdict: PASS
verified_commit: 0a1f8ef84c744ed57dd5fa8c71643579b501038a
verified_at: 2026-08-16T14:42:30Z
human_signoff:
---

# Evidence Report — release-2-1-0 (round 1)

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1|AC-1|script | PASS |
| E2|AC-2|script | PASS |
| E3|AC-3|test | PASS |
| E3b|AC-3|test | PASS |
| E3c|AC-3|test | PASS |
| E3d|AC-3|test | PASS |
| E4|AC-4|script | PASS |
| E5|AC-5|script | PASS |
| E6|AC-6|test | PASS |
| E7|AC-7|judgment | PASS |
| E8|AC-8|script | PASS |

## Evidence

- eval: E1
  run_id: r-20260816T143759Z-25893
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_release21_manifest
  verified_at: 2026-08-16T14:42:30Z
  output: |
    == chân manifest ==
      OK   ag-version 2.1.0
      OK   fl-version 2.1.0
      OK   dd-version 2.5.0
      OK   ag v2.1 mô tả
      OK   ag đủ bốn vế
      OK   fl v2.1 mô tả
      OK   fl pairs >=2.1.0
      OK   dd license MIT
           [chiều đỏ] bản sao hạ số 2.0.0 → chân đỏ ghim ag-version (qua CHÍNH kiem_manifest)
    
    RANG-RELEASE: XANH

- eval: E2
  run_id: r-20260816T143759Z-25893
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_release21_docs
  verified_at: 2026-08-16T14:42:30Z
  output: |
    == chân docs ==
      OK   GUIDE khớp 2.1.0 · 2.1.0
           [chiều đỏ] bản sao GUIDE ghi số cũ → chân đỏ (một nguồn: so với manifest, không so hằng)
      OK   huong dan cai + skin mau
           [chiều đỏ] bản sao README mất dòng cài → chân bắt (qua chính grep)
    
    RANG-RELEASE: XANH

- eval: E4
  run_id: r-20260816T143759Z-25893
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_release21_lan_v
  verified_at: 2026-08-16T14:42:30Z
  output: |
    == chân làn V trên vật thật ==
      base origin/main = 6e93373f2215e71b8cd09a30b74938ee59a8e856
      pre-merge exit=0 (ghi nhận, không tin mã thoát một mình)
      OK   NOTE cửa-veto có tên release-2-1-0
      OK   0 VIOLATION nhóm veto mang tên release-2-1-0
           [chiều đỏ] fixture da-veto thật → pattern grep BẮT được đúng định dạng VIOLATION của pre-merge
    
    RANG-RELEASE: XANH

- eval: E5
  run_id: r-20260816T143759Z-25893
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_release21_diff
  verified_at: 2026-08-16T14:42:30Z
  output: |
    == chân diff-allowlist: lời hứa «không đổi engine» CÓ THƯỚC ==
      base origin/main = 6e93373f2215e71b8cd09a30b74938ee59a8e856
      OK   diff 229 file ⊆ allowlist (3 manifest · marketplace · GUIDE · README · bản đồ · config · workspace · gói diagram-design · DIAGRAM-RULE + skin · P196 · docs)
           [chiều đỏ] danh sách tiêm lib/evidence-core.cjs → kiem_diff BẮT được file ngoài allowlist
      OK   run-tests chi THEM (61 dong +, 0 dong -)
           [chiều đỏ] diff giả có 1 dòng '-' → chi_them đếm được
      OK   config chi them khoa executor
           [chiều đỏ] diff giả chạm t3_paths → bị bắt
    
    RANG-RELEASE: XANH

- eval: E8
  run_id: r-20260816T143759Z-25893
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_release21_docs
  verified_at: 2026-08-16T14:42:30Z
  output: |
    == chân docs ==
      OK   GUIDE khớp 2.1.0 · 2.1.0
           [chiều đỏ] bản sao GUIDE ghi số cũ → chân đỏ (một nguồn: so với manifest, không so hằng)
      OK   huong dan cai + skin mau
           [chiều đỏ] bản sao README mất dòng cài → chân bắt (qua chính grep)
    
    RANG-RELEASE: XANH

- eval: E3
  run_id: r-20260816T143759Z-25893
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-16T14:42:30Z
  output: |
    Results: 704 passed, 0 failed

- eval: E3b
  run_id: r-20260816T143759Z-25893
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-16T14:42:30Z
  output: |
    Results: 60 passed, 0 failed

- eval: E3c
  run_id: r-20260816T143759Z-25893
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-16T14:42:30Z
  output: |
    146 dong PASS ·   PASS: P196 plugin diagram-design: layout+manifest · tree-hash==NOTICE · marker default · khong symlink (release-2-1-0 E6)

- eval: E3d
  run_id: r-20260816T143759Z-25893
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-16T14:42:30Z
  output: |
    Results: all workflow tests passed

- eval: E6
  run_id: r-20260816T143759Z-25893
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-16T14:42:30Z
  output: |
      PASS: P196 plugin diagram-design: layout+manifest · tree-hash==NOTICE · marker default · khong symlink (release-2-1-0 E6) ·      MUTANT-VERSION bi bat: hash doi + version giu -> do (qua CHINH so_ver_hash)      MUTANT-HASH bi bat: doi 1 byte -> hash khac NOTICE      MUTANT-MARKER bi bat: marker ro ri trang thai ca nhan 

- eval: E7
  judged_by: giám khảo phiên sạch (subagent, mù với diff)
  verdict: PASS
  rationale: 3/3 ca đạt, mọi ô có neo trong §0. Ca 1 giải toplevel git đúng (không lấy cwd apps/web), dùng token repo, không hỏi, không chạm skill. Ca 2 tự tìm brand source rồi hỏi một câu có khuyến nghị + đường thoát default, chưa ghi/chưa vẽ. Ca 3 ghi default-confirmed vào file của repo, marker gói giữ default. Giám khảo tự loại một ô không neo (schema chi tiết) — nếp NEO.
  verified_at: 2026-08-16T14:42:30Z

## Iterations

- Round 1: 11/11 eval đạt (10 máy + 1 hội đồng PASS). Một lượt sửa cơ học giữa vòng: W-G8 (parser evals) đọc dòng `inputs:   # chú thích` thành scalar → chuyển chú thích lên dòng riêng, nội dung eval không đổi.

### Re-pin lần 1 — 2026-08-16, do bổ sung dòng cài diagram-design vào QUICKSTART/GUIDE/README sau mốc verify (kiểm tra tự-cài lần đầu)

run_id: r-20260816T153623Z-9340
sha: 0a1f8ef84c744ed57dd5fa8c71643579b501038a · suites: 4 lệnh exit 0 (+ 4 chân răng release chạy lại XANH)

## Analyst

Phản biện sạch bắt 4 P1 + 1 P2 trước Cổng 1, tất cả sửa trong artifact: vế
«CI clean với chữ ký rỗng» rời khỏi Then (thành số đo M1 ở Notes) và khai đường
đi khi hội đồng trả «chưa chắc»; P196 canh DRIFT chứ không canh sửa-tay (known-limit
kho skill riêng tư), thêm chân version-theo-hash với mutant ngay lượt này và
chân âm hooks/.mcp/thư mục lạ; allowlist E5 khai một chỗ + hai ràng buộc âm
cho run-tests (chỉ THÊM) và config (chỉ thêm khoá executor); đề ca hội đồng bỏ
mớm nội dung skill, inputs tách agent/giám khảo.

Ba giới hạn ĐÃ KHAI TRƯỚC trong contract (AC-6 / Out of scope) — nhắc lại ở
đây theo tiền lệ release-2-0-0 (mục Known limits phải RỖNG THẬT, lời giải thích
sống ở Analyst): (1) kho skill nguồn là repo riêng tư, CI không fetch được →
«sửa tay gói rồi chạy lại tree-hash» là ca răng không canh, chốt còn lại là luật
văn NOTICE + review PR; (2) gói `acceptance-gate` (source `./`) chép trọn repo
nên cache có thêm 2,8 MB; (3) đường đọc-cũ symlink cá nhân + plugin → trigger
đôi, §5 dặn gỡ symlink, không phép đo nào canh máy đồng đội.

## Known limits

## Variance

none

## Ngoài hợp đồng

