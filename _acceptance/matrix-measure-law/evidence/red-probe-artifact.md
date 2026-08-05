# RED-probe artifact — fixture cho eval M11 (matrix-measure-law)

*File này do `tests/workflows/gen-red-probe.mjs` SINH từ writer thật — hình
dạng thứ 4 trong `MEASUREMENT_SHAPES` của
`feature-loop/workflows/acceptance-verify.js` (round-trip rút-từ-writer-thật;
sửa tay file này sẽ làm case MM12 đỏ vì file phải bằng đúng đầu ra generator).
Hình dạng được gài vào khối A, nguyên văn từ writer:*

> Assertion âm-tính-một-mình: không đối chứng dương, không ghim thông điệp.

*Khối B là bản tương đương đã chữa đúng hình dạng đó — khác biệt giữa A và B
chỉ nằm ở đúng một hình dạng; critic bắt được A mà không báo oan B mới tính
là ý (4) đủ răng.*

## Khối A — bộ artifact S1 thu nhỏ (CÓ gài vi phạm theo hình dạng trên)

```yaml
# evals.yaml (trích) — feature giả định: guard chặn config thiếu trường bắt buộc
evals:
  - id: X1
    criterion: AC-1
    executor: test
    expected: "dựng bản sao config thiếu trường `owner` rồi chạy validator — exit khác 0 là đạt"
    cmd: config:executors.test.scripts
```

## Khối B — bản tương đương SẠCH (đã có đối chứng dương + ghim thông điệp)

```yaml
# evals.yaml (trích) — cùng feature, cùng AC
evals:
  - id: X1
    criterion: AC-1
    executor: test
    expected: "hai nhánh cùng harness: (1) bản sao config NGUYÊN VẸN chạy validator → exit 0 (đối chứng dương — chứng minh validator có chạy thật); (2) bản sao thiếu trường `owner` → exit khác 0 VÀ stderr chứa đúng thông điệp 'missing required field: owner' (ghim thông điệp, không chỉ mã thoát)"
    cmd: config:executors.test.scripts
```
