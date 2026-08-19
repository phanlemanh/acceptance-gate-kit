# Số đo vận hành N=2 tại repo tiêu thụ — đóng sổ chờ B4 của bài 13/08

*2026-08-19 · Phiên OneFlow ghi lại một ngày chạy hai phiên đồng thời trên
cùng cây. Bài [13/08 §4-B4](../research/2026-08-13-doi-chieu-graph-engineering-mo-nhieu-vong-song-song.md)
ghi «tỉ lệ chưa đo ở repo tiêu thụ; ghi sổ chờ theo phép thử tỉ-lệ-đo-được» —
đây là số đó. Bối cảnh: phiên A chạy S4 vòng 3–4 của `byo-key-onboarding`
(feature-loop thật, T3); phiên B chạy chuỗi docs roadmap (PR #66/#67/#69,
đường `t1_skip_globs`, không qua S4).*

## Số đo

| # | Đại lượng | Số | Ghi chú |
|---|---|---|---|
| 1 | Vòng verify BLOCKED vì **tải CPU** | **3 vòng** (trước khi hai phiên thoả thuận đóng băng CPU) | Phép đo dựng venv timeout 5s trong khi việc mất 10s; a11y chấm trên trang chưa vẽ xong. **Xanh sạch ngay vòng 4 khi máy rảnh** — lỗi tải, không phải hồi quy. Worktree cách ly file, KHÔNG cách ly CPU |
| 2 | Hoá đơn re-sign Gate 1 → Gate 2 | **17 → 21** hồ sơ | 4 merge hạ cánh giữa hai cổng của phiên A; 3 trong đó là docs-only của phiên B. Bill Gate-2 thành hàm của nhịp merge của *phiên khác* |
| 3 | Va chạm file thực tế | **0** | Nhờ phân vùng **khai trước** qua SendMessage (file · cổng mạng · CPU); 2 lần suýt va (`scripts/`, `_acceptance/config.yaml`) đều chặn từ lúc thoả thuận, không phải lúc đụng |
| 4 | PR merge trong ngày | 4 — **nhưng chỉ 1 là loop thật** | 3 PR docs-only không qua S4/gate. Đọc 4-PR/ngày làm bằng chứng throughput song song là **thổi phồng**; số trung thực: 1 loop thật + 1 làn docs chạy nép sau S4 của nó |
| 5 | Điểm nghẽn tuần tự quan sát được | 3: người ký · CPU máy S4 · `main` (re-pin + guard-snapshot + tàu ABI/SDK) | Khớp B1/B2 của bảng 13/08; **CPU là nút chưa có tên trong bảng đó** |

## Đối chiếu bảng §4 bài 13/08

- **B4 (vật chung đụng nhau): nay có số ở consumer = 0 va chạm**, với điều
  kiện đủ là *phân vùng khai trước* — nghi thức tay, chưa thành luật ở đâu.
  Rẻ nhất để giữ: một đoạn nghi thức trong AGENTS.md của repo tiêu thụ; chỉ
  nâng lên kit nếu lặp lại ở repo tiêu thụ thứ hai.
- **Nút mới chưa có trong bảng: CPU máy tại S4** — nhân theo N ngay từ N=2,
  và là nguồn *đỏ-oan* (loại lỗi đắt: mỗi vòng oan trả giá một vòng chạy lại
  trọn vẹn, và làm mờ tín hiệu của evaluator). Hai đường xử đã nhìn thấy,
  đều không cần cơ chế kit: (a) token S4 cưỡng chế bằng `PreToolUse` hook +
  lockfile có hạn; (b) đẩy làn verify lên cloud session (đường Anthropic,
  xem [research cùng ngày](../research/2026-08-19-anthropic-nen-song-song-doi-chieu-phan-quyet.md)).
- **B2 (stale-cascade): thêm một số** — mục 2 ở trên. Củng cố đoạn chính
  sách re-pin-theo-release đã duyệt từ charter 07/08 mà 13/08 xác nhận chưa
  ai viết.

## Hệ quả cho đợt 3

Đợt 2 (`veto-co-dau-vet`) signed-off 14/08 ⇒ điều kiện vào của song song hoá
đã thoả. Số trên đủ để chạy phép đo M1 đúng khuôn đã khai: **N=2 vòng thật ở
repo tiêu thụ, M1 ≤ 2 mới tăng N** — kèm một điều kiện vận hành rút từ mục 1:
trong suốt lần đo, **S4 độc quyền máy** (token, không thoả thuận mồm), để M1
đo đúng chi phí người thay vì nhiễu tải.
