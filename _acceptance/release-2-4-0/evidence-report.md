---
schema_version: 2
feature_slug: release-2-4-0
verdict: PASS
failed_evals: []
reason:
verified_by: verify tuần tự trong worktree riêng (lệnh chạy lần lượt — nếp lan-may-song-qua-bo-phan-loai)
enforcement_mode: strict
bypass_used: false
verified_commit: 71f7c52662c3d678b46011c92327357dcc02cab8
human_signoff: Manh 2026-08-26 — ký mốc phát hành 2.4.0 với bốn known-limits đã khai
---

# Evidence Report: release-2-4-0

Mốc phát hành KHÔNG dựng răng riêng (§7.1). Thứ canh một lần cắt số là ca **vĩnh viễn P200**
— mọi số đọc TỪ manifest, 5 đột biến + đối chứng dương bản-sao-nguyên-vẹn, một lối thoát.

**Đối chứng dương của cả lượt:** bốn bộ kiểm chạy trên `main` chưa sửa (worktree TRỌN CÂY tại
`8ff6c58a`, không chép danh sách file tay — bài học P150) cho **2 đỏ sẵn**: P122 và P126, cả hai
vì bản đồ xưởng lệch sau năm lượt gộp. Sau khi vẽ lại bản đồ và sửa LB9, cả bốn bộ XANH TRỌN.

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

## Evidence

- eval: E1
  run_id: release-2-4-0-E1-r1
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T09:19:11Z
  cmd: bash tests/plugins/run-tests.sh
  baseline: main 8ff6c58a — P200 xanh ở cả hai đầu (ca vĩnh viễn, không ghim mốc)
  output: |
    P200 VE: acceptance-gate hop semver: 2.4.0
    P200 VE: feature-loop hop semver: 2.4.0
    P200 VE: diagram-design hop semver: 2.5.0
    P200 VE: hai plugin cung so: 2.4.0
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
    PASS: P200 mot lan cat so nhat quan

- eval: E2
  run_id: release-2-4-0-E2-r1
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T09:19:11Z
  cmd: bash tests/plugins/run-tests.sh
  output: |
    P200 VE: GUIDE khop so DOC TU manifest

- eval: E3
  run_id: release-2-4-0-E3-r1
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-08-26T09:19:11Z
  cmd: bash tests/scripts/run-tests.sh
  output: |
    Results: 750 passed, 0 failed (và năm bộ con: 3 · 16 · 16 · 13 · 6, đều 0 failed)

- eval: E3b
  run_id: release-2-4-0-E3b-r1
  exit_code: 0
  verifier: config:executors.test.hooks
  verified_at: 2026-08-26T09:19:11Z
  cmd: bash tests/hooks/run-tests.sh
  output: |
    Results: 60 passed, 0 failed

- eval: E3c
  run_id: release-2-4-0-E3c-r1
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T09:19:11Z
  cmd: bash tests/plugins/run-tests.sh
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: release-2-4-0-E3d-r1
  exit_code: 0
  verifier: config:executors.test.workflows
  verified_at: 2026-08-26T09:19:11Z
  cmd: bash tests/workflows/run-tests.sh
  output: |
    Results: 11 · 42 · 16 (execute-parallel) · 26 · 44 passed, 0 failed
    Results: all workflow tests passed

- eval: E3e
  run_id: release-2-4-0-E3e-r1
  exit_code: 0
  verifier: node scripts/product-map.mjs --check
  verified_at: 2026-08-26T09:19:11Z
  cmd: node scripts/product-map.mjs --check
  baseline: trước khi vẽ lại — «PRODUCT-MAP.md lệch với hồ sơ xưởng» (đỏ thật, đối chứng dương của phép đo này)
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E6
  run_id: release-2-4-0-E6-r1
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T09:19:11Z
  cmd: bash tests/plugins/run-tests.sh
  output: |
    P200 VE: mo ta acceptance-gate co muc v2.4.0
    P200 VE: muc v2.4.0 cua feature-loop TU khai cap

## Known limits

- **Nội dung sáu vế «người dùng nhận gì» + hai điều nói thật là VĂN CHO NGƯỜI, máy không kiểm.**
  P200 chỉ canh *mục v2.4.0 có tồn tại* và *feature-loop tự khai cặp* — nó không đọc được lời
  trong mục đó có đúng với thứ đã gộp hay không. Người ký đọc trực tiếp trong diff manifest
  (3 dòng). Cùng giới hạn đã khai ở 2.2.0 và 2.3.0.
- **Hai cơ chế của mốc phát hành khi chi phí/lợi ích CHƯA ĐO** — khuôn đặc tả UX và nghi thức
  thiết kế không đồng bộ. Ván thử sống ở repo tiêu thụ; Cổng Giá trị của cả hai cố ý còn mở,
  hạn 30/09 → `park`. Điều này đã ghi vào mục `v2.4.0` để người cài đọc được, không giấu.
- **Bảy Cổng Giá trị đang treo không được mốc này giải** — chúng chờ đúng ván thử nói trên.
- **Sửa LB9 nằm trong mốc dù mốc tuyên «không dựng răng»:** đây không phải dựng răng mới mà là
  sửa một thước do CHÍNH việc phát hành làm lộ. Không sửa thì không bản phát hành nào xanh
  được. Đã quét trọn lớp; chỉ LB9 mắc.

## Ngoài hợp đồng

- (không có)
