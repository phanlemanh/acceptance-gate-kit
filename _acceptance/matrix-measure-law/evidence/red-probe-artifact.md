# RED-probe artifact — fixture cho eval M11 (matrix-measure-law)

*Nguồn khuôn: khối A sinh từ HÌNH DẠNG 4 trong danh sách "Sáu hình dạng"
của design doc (`2026-08-05-matrix-measure-law-design.md`) — "Assertion
âm-tính-một-mình: không đối chứng dương, không ghim thông điệp". Khối B là
bản tương đương đã chữa đúng hình dạng đó. Mọi khác biệt giữa A và B chỉ
nằm ở đúng một hình dạng — critic bắt được A mà không báo oan B mới tính
là ý (4) đủ răng.*

## Khối A — bộ artifact S1 thu nhỏ (CÓ gài một vi phạm)

```yaml
# evals.yaml (trích) — feature giả định: guard chặn config thiếu trường bắt buộc
evals:
  - id: X1
    criterion: AC-1
    executor: test
    expected: "dựng bản sao config thiếu trường `owner` rồi chạy validator — exit khác 0 là đạt"
    cmd: config:executors.test.scripts
```

## Khối B — bản tương đương SẠCH

```yaml
# evals.yaml (trích) — cùng feature, cùng AC
evals:
  - id: X1
    criterion: AC-1
    executor: test
    expected: "hai nhánh cùng harness: (1) bản sao config NGUYÊN VẸN chạy validator → exit 0 (đối chứng dương — chứng minh validator có chạy thật); (2) bản sao thiếu trường `owner` → exit khác 0 VÀ stderr chứa đúng thông điệp 'missing required field: owner' (ghim thông điệp, không chỉ mã thoát)"
    cmd: config:executors.test.scripts
```
