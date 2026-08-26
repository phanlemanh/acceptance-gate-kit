---
schema_version: 2
feature_slug: release-2-4-0
verdict: PASS
failed_evals: []
reason:
verified_by: verify tuần tự trong worktree riêng (lệnh chạy lần lượt — nếp lan-may-song-qua-bo-phan-loai)
enforcement_mode: strict
bypass_used: false
verified_commit: bf3455b1  # cây sau khi gộp main 5ad8e88d — bốn bộ kiểm chạy trên đúng cây này
human_signoff: Manh 2026-08-26 — ký mốc phát hành 2.4.0 với bốn known-limits đã khai
---

# Evidence Report: release-2-4-0

Mốc phát hành KHÔNG dựng răng riêng (§7.1). Thứ canh một lần cắt số là ca **vĩnh viễn P200**
— mọi số đọc TỪ manifest, 5 đột biến + đối chứng dương bản-sao-nguyên-vẹn, một lối thoát.

**Đối chứng dương của cả lượt — neo `main` 5ad8e88d, bản chụp nằm TRONG hồ sơ**
(`evidence/doi-chung-duong-main-5ad8e88d.txt`, không để ở thư mục tạm): bốn bộ kiểm trên
`main` chưa sửa **XANH TRỌN**, trong đó `P200` PASS và `LB9` PASS với vế cũ. Đó chính là điều
phép đo cần: `LB9` sống trên `main` (số còn 2.3.0, dòng GUIDE khớp mốc `ba539284`) và chỉ
chết khi bump — chứng minh ca đỏ duy nhất của lượt này do **chính việc cắt số** gây ra, không
do hạ tầng.

**ĐÍNH CHÍNH một lời khai của máy (26/08).** Bản báo cáo trước của tôi viết «đối chứng dương
cho 2 đỏ sẵn: P122 và P126». Lời đó ĐÚNG tại mốc `8ff6c58a` — nơi nhánh này cắt ra — nhưng
`main` đã dịch sang `5ad8e88d` giữa lượt (PR #113 vẽ lại bản đồ xưởng), nên trên `main` hiện
tại cả hai ca đó XANH. Bản chụp cũ để ở thư mục tạm và **đã mất**, tức lời khai kia có lúc
không kiểm lại được — đúng lớp lỗi kit đi săn. Nay: chạy lại, neo mốc hiện tại, bản chụp
commit cùng hồ sơ. Bốn bộ kiểm trên cây phát hành (sau khi gộp `main`) cũng XANH TRỌN, bản
chụp ở `evidence/suite-*.txt`.

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
  baseline: main 5ad8e88d — P200 PASS (bản chụp evidence/doi-chung-duong-main-5ad8e88d.txt)
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
- **Đánh số tiêu chí nhảy cóc (AC-1 · AC-2 · AC-3 · AC-6, không có AC-4/AC-5)** — kế thừa
  nguyên khuôn từ release-2-3-0 để hai mốc đối chiếu được theo cùng mã. Giữ nếp, không đánh
  lại; người đọc lần đầu sẽ đi tìm hai mã không tồn tại.
- **Phản biện context sạch do CHÍNH phiên làm, không phải phiên tươi độc lập** — thấy được
  năm điều (ghi ở `gap-probe.md`) nhưng một phiên đã mang sẵn thiên kiến của người viết hồ sơ
  thì không thay được con mắt thứ hai.

## Ngoài hợp đồng

- (không có)
