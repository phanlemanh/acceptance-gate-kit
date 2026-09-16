---
schema_version: 2
feature_slug: guide-chep-ci-buoc-vao-writer
verdict: PASS
failed_evals: []
reason:
verified_by: phiên chính (vòng T2 làn V, không có phiên VERIFY riêng — khai thẳng); phản biện context sạch do MỘT phiên tươi chạy, ghi ở gap-probe.md
enforcement_mode: strict
bypass_used: false
verified_commit: 4434f51cd2fc3055c15dd9e6b87248ad59dec6c6
human_signoff:
---

# Evidence Report: guide-chep-ci-buoc-vao-writer

Lượt 1 (sau khi vá trọn 3 P1 + 5 P2 của phản biện context sạch). Hai lệnh suite chạy
tuần tự trên cây `4434f51cd2fc3055c15dd9e6b87248ad59dec6c6` — làm việc duy nhất ngoài commit là chính tệp báo cáo này
và `run-log.jsonl` (bằng chứng không thể nằm trong cây nó đo). Mỗi eval đối chiếu
với dòng ghim `PASS: CExx` hoặc dòng tổng kết của chính lệnh.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-4 | test | PASS |

## Evidence

- eval: E1
  run_id: guide-chep-ci-buoc-vao-writer-E1-r1-20260916T013208Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-16T02:05:10Z
  output: |
    PASS: CE2g GUIDE §5.3: cùng writer, cùng tập với INIT-CI-COPY-LIST, con số «đủ N file» neo trong §5.3 và khớp độ dài

- eval: E2
  run_id: guide-chep-ci-buoc-vao-writer-E2-r1-20260916T013208Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-16T02:05:10Z
  output: |
    PASS: CE2gm sáu mutant SINH TRONG LẦN CHẠY trên chính văn bản GUIDE — ba chiều nhạy ghim đúng thông điệp, ba chiều đặc hiệu phải IM

- eval: E3
  run_id: guide-chep-ci-buoc-vao-writer-E3-r1-20260916T013208Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-16T02:05:10Z
  output: |
    PASS: CE2w chân writer: tên lib có chữ số/đuôi .mjs vẫn vào tập DÙNG, và mắt xích bắc cầu sống khi gỡ hết lời nhắc trực tiếp

- eval: E4
  run_id: guide-chep-ci-buoc-vao-writer-E4-r1-20260916T013208Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-16T02:05:10Z
  output: |
    Results: 873 passed, 0 failed

- eval: E5
  run_id: guide-chep-ci-buoc-vao-writer-E5-r1-20260916T013208Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-16T02:05:10Z
  output: |
    Results: all plugin tests passed

## Known limits

- Phần §5.3 NGOÀI danh sách tệp (`fetch-depth: 0`, `--base`, `--no-t1-escape`, layout
  đích) không buộc vào vật nào — chỉ danh sách tệp có răng. Phản biện context sạch tự
  xếp mục này là giới-hạn-phạm-vi, không phải finding.
- Nhận diện `lib/` cố ý RỘNG (một tệp `lib/` chỉ được nhắc trong chú thích của cổng
  cũng bị đòi khai) và `scripts/` cố ý HẸP (chỉ nhận theo vị trí `$HERE/`): một script
  mới mà cổng nạp bằng đường khác `$HERE` sẽ lọt.
- Vòng không có phiên VERIFY context sạch riêng — phiên chính chạy hai lệnh suite và
  ghi lại. Phản biện context sạch thì CÓ (một phiên tươi, hồ sơ ở `gap-probe.md`).

## Out of contract

- Không có. Mọi mục phản biện context sạch nêu (3 P1 + 5 P2) đều vá TRONG vòng; bảng
  xử lý từng mục ở `gap-probe.md`.
