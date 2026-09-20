# Hạt giống — Làn ghim lại phải phân biệt «bị giết» với «lệnh đỏ»

**Ngày:** 2026-09-20 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2
(`feature-loop/scripts/repin-lane.mjs`).
**Sinh từ:** hồ sơ `_acceptance/ghim-lai-noi-ra-o-khong-do/` — một phiên kit khác nêu
20/09 khi rà cùng tệp, đã xác minh tại chỗ.

## Lỗ

`feature-loop/scripts/repin-lane.mjs:242`:

```js
const exit = r.status === null ? 1 : r.status;
```

`spawnSync` trả `status: null` cho HAI trạng thái khác hẳn nhau — lệnh **bị tín hiệu
giết** (`r.signal` có giá trị) và lệnh **không khởi động được** (`r.error`, ví dụ thiếu
`bash`, thiếu quyền). Cả hai bị gộp thành «eval thoát 1».

Fail-CLOSED nên KHÔNG xanh giả — làn vẫn đỏ và không ghi gì. Cái mất là **thông điệp**:
làn nói «eval đỏ» cho một lượt chưa hề chạy, đúng lớp mà `TOOL-KILL-RULE` dựng ra để
phân biệt ở tầng agent, nhưng chưa có ở tầng script của làn.

Cùng lớp đã vá ở kho `crm` cùng ngày (`chay()` trả null cho cả bị-giết lẫn
không-khởi-động; 13 nơi gọi viết `ma !== 0`).

## Việc

Một dòng phân biệt: `r.signal` → «bị tín hiệu `<SIG>` giết», `r.error` → «không khởi
động được: `<lý do>`», ngoài ra mới là mã thoát thật. Thông điệp của làn nói đúng ba
trạng thái; mã thoát của làn giữ nguyên fail-closed.

## Ngưỡng mở ô

- ≥1 lượt ghim lại mà người chạy phải tự đọc lại log để biết lệnh có chạy hay không;
  hoặc mở kèm khi có vòng khác đã chạm `repin-lane.mjs` (gộp để khỏi một vòng riêng).
