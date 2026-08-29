---
schema_version: 2
feature_slug: nhanh-chinh-khong-ten-main
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 41e12d53401f5539cce68e0621f6b8df42d76857
human_signoff:
---

# Evidence Report: nhanh-chinh-khong-ten-main

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E10 | AC-7 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-nhanh-chinh-khong-ten-main-E1-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_master_khong_remote
  verified_at: 2026-08-30T14:00:00Z
  output: |
    PASS: bản sao chưa tiêm chạy XANH (đối chứng dương của bản sao)
    PASS: chiều đỏ: cắt danh sách → nhánh master rơi đúng câu có hướng dẫn (ghim đủ, loại lỗi dùng sai cờ)
    Results: chan master-khong-remote passed

- eval: E2
  run_id: minted-nhanh-chinh-khong-ten-main-E2-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_nhanh_la_cau_huong_dan
  verified_at: 2026-08-30T14:00:00Z
  output: |
    PASS: nhánh lạ → câu có hướng dẫn, không thông điệp sai, không vết đổ
    PASS: đối chứng dương: đổi tên về master → sinh args
    Results: chan nhanh-la-cau-huong-dan passed

- eval: E3
  run_id: minted-nhanh-chinh-khong-ten-main-E3-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_doc_bat_buoc_van_dong
  verified_at: 2026-08-30T14:00:00Z
  output: |
    PASS: ref hỏng → exit 2, nêu tên phần hỏng, không sinh tệp
    PASS: đối chứng dương: --diff-base master → sinh tệp
    Results: chan doc-bat-buoc-van-dong passed

- eval: E6
  run_id: minted-nhanh-chinh-khong-ten-main-E6-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_remote_tra_loi
  verified_at: 2026-08-30T14:00:00Z
  output: |
    PASS: bản sao chưa tiêm chạy XANH (đối chứng dương của bản sao)
    PASS: chiều đỏ: phá bước đọc remote → rơi đúng câu đòi --diff-base (ghim thông điệp)
    Results: chan remote-tra-loi passed

- eval: E7
  run_id: minted-nhanh-chinh-khong-ten-main-E7-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_ci_single_branch
  verified_at: 2026-08-30T14:00:00Z
  output: |
    PASS: bản sao chưa tiêm chạy XANH (đối chứng dương của bản sao)
    PASS: chiều đỏ: bỏ kiểm-tồn-tại → chết đúng thông điệp sai-loại mà AC-2 cấm
    Results: chan ci-single-branch passed

- eval: E8
  run_id: minted-nhanh-chinh-khong-ten-main-E8-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_khong_doan_sang_ten_khac
  verified_at: 2026-08-30T14:00:00Z
  output: |
    PASS: chiều đỏ: bản cho vòng dò chạy vô điều kiện ĐOÁN BỪA sang «master» (ca phân biệt được)
    Results: chan khong-doan-sang-ten-khac passed

- eval: E10
  run_id: minted-nhanh-chinh-khong-ten-main-E10-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-30T14:00:00Z
  output: |
    PASS: ARM13-mut

    Results: 778 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_hooks_run_tests_sh-r6
  exit_code: 0
  verified_at: 2026-08-30T14:00:00Z

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_plugins_run_tests_sh-r6
  exit_code: 0
  verified_at: 2026-08-30T14:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_workflows_run_tests_sh-r6
  exit_code: 0
  verified_at: 2026-08-30T14:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-node_scripts_product_map_mjs_root_check-r6
  exit_code: 0
  verified_at: 2026-08-30T14:00:00Z

## Known limits

- Khi kho CÓ khai máy chủ từ xa mà KHÔNG hỏi được nó (mạng chặn, xác thực hỏng,
  hết trần thời gian), máy vẫn dò bốn tên nhánh quen và có thể nhận một tên
  KHÔNG phải nhánh chính thật → mốc so sánh sai, không cảnh báo. Lối đi vòng:
  truyền `--diff-base <ref>` tường minh (lối này có ca canh trong bộ kiểm thường
  trực). Vòng đã thử đóng ở lượt 5 nhưng bản vá bịt mất chính lối thoát đó;
  owner quyết thu phạm vi, lớp chuyển sang ô `khuon-rang-dung-chung`.
- Phép bóc tên nhánh đọc chữ tiếng Anh trong đầu ra của git, nên máy đặt ngôn
  ngữ khác có thể trượt và rơi về dò tên quen — cùng lớp với mục trên, cùng ô.
- Bản hướng dẫn của vòng lặp còn mô tả cách dò cũ («dò remote → dự phòng bốn
  tên»); sau lượt 4, remote đã khai tên mà cây không giải được thì máy kêu to
  chứ không rơi về danh sách. Người đọc hướng dẫn có thể chờ một hành vi không
  còn.
- Khi người dùng tự truyền `--diff-base`, dòng khai nguồn vẫn in «nhánh chính
  «null» giải bằng none» và ghi cùng giá trị đó vào tệp tham số, dù mốc so sánh
  đến từ cờ chứ không từ phép dò. Không sai kết quả, nhưng lời khai gây hiểu lầm.

## Ngoài hợp đồng

## Analyst

E10 (`bash tests/scripts/run-tests.sh`) — pass trên CẢ HEAD lẫn diffBase (baseline: green). Bộ `run-tests.sh` tự quét mọi `*.test.mjs` nên chạy đúng như nhau trên cả hai cây; ca mới cho AC-7 (SA4, canh lối thoát `--diff-base` khi remote không hỏi được) nằm trong cùng file, đã tự chạy trên diffBase và không phân biệt được bằng phép so A/B thô này. Đây là regression-guard có chủ ý (lưới thường trực ADR 0011), không phải dấu hiệu eval vô nghĩa — không cần viết lại.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 2: rang.sh (bộ răng) mang hai lỗi nặng làm phạm vi đo sai — thu phạm vi + sửa lại rang.sh trước khi chạy tiếp.
Round 3: toàn bộ eval XANH nhưng hồi quy AC-8 (đoán bừa sang nhánh khác khi remote đã khai tên) bị chính bản vá tự tái lập — vượt cấp trần, escalate owner quyết hướng theo cấp 3 vòng.
Round 4: sửa s4-args.mjs cấm đoán sang tên khác khi remote đã khai nhánh chính (đóng AC-8) — toàn bộ eval và bốn bộ suite hồi quy xanh, verdict PASS.
Round 5: thêm AC-9 (remote-hỏi-không-được) + chân đo + cửa chặn gfix + lưới thường trực E10 — tám eval và ba suite xanh, nhưng `bash tests/hooks/run-tests.sh` không trả kết quả (agent chết giữa chừng) → verdict BLOCKED.
Round 6: thu phạm vi rút AC-9/E9 (remote-hỏi-không-được) khỏi hợp đồng, chuyển sang ô khuon-rang-dung-chung; chạy lại bảy eval còn lại (E1-E3, E6-E8, E10) và bốn bộ suite hồi quy (scripts, hooks, plugins, workflows) cùng product-map — `tests/hooks/run-tests.sh` (nghẽn ở round 5) nay trả đủ 60/60, mọi thứ khác vẫn xanh. Verdict PASS.
