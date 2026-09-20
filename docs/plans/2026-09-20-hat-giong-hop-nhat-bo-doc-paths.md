# Hạt giống — Hợp nhất ba bộ đọc `paths` của `evals.yaml`

**Ngày:** 2026-09-20 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T3
(chạm `lib/eval-yaml.cjs` — định nghĩa dùng chung).
**Sinh từ:** hồ sơ `_acceptance/ghim-lai-noi-ra-o-khong-do/` — owner định đoạt «mở hợp
đồng mới» cho mục Ngoài-29 tại Cổng Bằng chứng round 2 (20/09). Hạt giống này cũng là
cái mà chú thích trên `pathsCuaEval` đã khai giới hạn nhưng CHƯA hề tồn tại (mục
Ngoài-4, owner định đoạt «ghi Known limits» — lời hứa treo nay có chỗ trỏ).

## Lỗ

Kit có **ba** bộ đọc `evals.yaml` viết tay, mỗi cái biết một phần:

| Bộ đọc | Biết | Không biết |
|---|---|---|
| `lib/eval-yaml.cjs parseEvals` | bỏ qua thân `key: >` / `key: \|` (chốt block-scalar) | không đọc `paths` |
| `feature-loop/scripts/carry-plan.mjs` | `paths` dạng flow `[...]` | block-seq (crm khai **393** block-seq / 49 flow) |
| `feature-loop/scripts/repin-lane.mjs pathsCuaEval` | cả hai dạng `paths` | không có chốt block-scalar; không biết thụt dòng |

Bốn hình dạng YAML **hợp lệ** làm `pathsCuaEval` sai lặng (finder chạy thật trên thân
hàm, round 2):

```yaml
expected: |
  kiem tra
  paths: khong phai khoa      # → trả ["khong phai khoa"], không bao giờ tới paths thật
ui:
  paths: ["wrong.ts"]         # → khoá lồng thắng paths của chính eval
paths:
  # ghi chu                   # → trả []
  - "src/a.ts"
paths:
                              # → dòng trắng giữa seq: trả []
  - "src/a.ts"
```

Hệ quả hai chiều: glob sai làm `evals_not_machine_touched` vừa sót (hồi quy không được
nói ra) vừa báo oan; ca trả `[]` làm section Re-pin in câu SAI «E6 (E6 không khai
paths)» cho một eval có khai.

**Latent, không phải live:** finder dò 283 `evals.yaml` thật ở 6 kho
(acceptance-gate-kit, crm, oneflow, map, artifact-platform, media-library) → **0 lệch
hôm nay**. Nhưng nó cách một dòng gấp khúc trong bất kỳ khối `expected: >-` nào có nhắc
chữ `paths`.

## Việc

Mở rộng `parseEvals` (bộ đọc dùng chung, ĐÃ có chốt block-scalar) để trả cả `paths` ở
hai dạng, rồi bỏ hai bản viết tay kia. Một nguồn, ba nơi gọi.

Răng bắt buộc: ma trận bốn hình dạng trên, mỗi hình dạng một chiều đỏ ghim thông điệp;
cộng phép vi phân «bản gốc xanh trước, bản tiêm đỏ sau» trên cùng fixture.

## Ngưỡng mở ô

- ≥1 kho khai `paths` trong một khối `expected:` nhiều dòng (đếm bằng chính ma trận
  trên); hoặc ≥1 lượt ghim in câu «không khai paths» cho một eval có khai; hoặc mở kèm
  khi có vòng T3 khác đã chạm `lib/eval-yaml.cjs`.
