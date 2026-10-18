# Hạt giống — lệnh viết thẳng trong `evals.yaml` không được bóc nháy

**Ngày:** 2026-10-18 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** TRỪ (bớt một lối eval BLOCKED oan).
Gốc: `_acceptance/nhay-don-nhan-doi/` — rà các bộ đọc khi vá `unquoteScalar` (Ngoài phạm vi OOS-1, sổ d-2).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/nhay-don-nhan-doi/contract.md` trích lại tệp này.

## Số đo

- `parseEvals` (`lib/eval-yaml.cjs`) mặc định chỉ `trim` giá trị một dòng — không bóc vỏ nháy. `s4-args.mjs` (dòng
  137) và `repin-lane.mjs` (dòng 249) đọc `cmd` qua nó, nên `cmd: "npm test"` tới shell là `"npm test"` → thoát 127,
  và `cmd: "config:executors.…"` không khớp `startsWith('config:')` → cũng chạy nguyên văn, 127.
- Hai bên không đồng ý với nhau: `carry-plan.mjs` đọc cùng trường `cmd` qua `parseFlowValue` (CÓ bóc nháy).
- Bán kính đo 18/10 trên 16 kho: 20 dòng `cmd:` bọc nháy, tất cả ở 18 hồ sơ cũ của artifact-platform (có 2 ca
  `cmd: "config:…"`). Lệnh đo:
  `grep -lE "^[[:space:]]+cmd:[[:space:]]*['\"]" ~/dev/*/_acceptance/*/evals.yaml`.
- Hỏng HIỆN (127 → BLOCKED hạ tầng), không xanh giả — vì thế không gộp vào vòng nhay-don-nhan-doi.

## Đề xuất (chưa làm)

1. **Đúng tầng:** `parseEvals` dùng `parseFlowValue(...).value` cho giá trị một dòng khi bên gọi không truyền
   `normalize` — cùng cổng mọi bộ đọc khác đã đi qua.
2. Cân trên mọi kho: một `cmd` bọc nháy hôm nay luôn BLOCKED, nên bóc nháy chỉ đổi BLOCKED → chạy thật; không bên
   nào dựa vào hành vi cũ được (lệnh có nháy chạy nguyên văn chưa bao giờ chạy đúng).

## Ngưỡng mở ô

≥1 kho đang cài kit hiện hành gặp BLOCKED 127 vì một `cmd:` bọc nháy trong `evals.yaml`.
