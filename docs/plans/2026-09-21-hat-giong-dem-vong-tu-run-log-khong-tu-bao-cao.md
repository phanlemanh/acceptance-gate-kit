# Hạt giống — Đếm vòng từ `run-log.jsonl`, không từ `evidence-report.md`: sổ chỉ ghi khi thắng là sổ ghi mỗi ngày đẹp trời

**Ngày:** 2026-09-21 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2
(`feature-loop/scripts/s4-args.mjs` — bộ đếm vòng).
Gốc: crm/_acceptance/thuoc-khai-dung-tieng — K2 + §4.3 của
`crm:docs/findings/2026-09-20-retro-hang-muc-khai-dung-tieng.md`.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Lỗ

Bộ đếm vòng của `s4-args` đọc mục `## Iterations` trong `evidence-report.md`. Tệp ấy **chỉ sinh
ra khi một vòng chấm thành công**. Vòng BLOCKED hoặc REJECT không để lại dấu, nên:

| Đo được ở hạng mục «khai đúng tiếng» | Số |
|---|---|
| Lượt chấm S4 thật | **12** |
| Dòng `round-tally` trong `run-log.jsonl` | **6** |
| Lượt `thuoc-` đi dưới nhãn `round: 1` dù là lượt thứ n | **6** |
| Số lần carry-forward (đối chiếu phát hiện vòng trước) đã chạy | **0** |

Hệ quả đúng lớp «bằng chứng tự dối»: câu «không phát hiện nào tái phát qua các vòng» là **người
đếm tay**, máy không đếm được — và một bộ đếm chỉ đếm lần thắng thì con số nó in ra luôn đẹp.

## Việc

`s4-args` đếm vòng bằng số dòng `round-tally` trong `run-log.jsonl`, và bộ tổng hợp S4 nối
`runLog` **trước** khi ghi báo cáo ở MỌI verdict (nghi thức này đã có trong handoff crm, nhưng
là lời dặn, chưa là răng). Carry-forward đọc cùng nguồn đó.

Răng bắt buộc: fixture có 3 dòng `round-tally` và **không có** `evidence-report.md` → `s4-args`
phải in `round: 4`, không phải `round: 1`.

## Ngưỡng mở ô

Đã đạt ngưỡng đo ở kho tiêu thụ (6/12 lượt mất dấu, một hạng mục). Mở khi owner gọi tên, hoặc
khi ≥1 vòng của chính kit in sai số vòng theo cùng hình dạng.
