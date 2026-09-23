# Hạt giống — lượt máy hỏi ngoài thiết kế sống ở S1 (lên thiết kế), và 28/28 câu trả lời là «theo khuyến nghị»

**Ngày:** 2026-09-22 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Nguồn:** phiên tổng kết cửa sổ 2.18 (`docs/findings/2026-09-22-tong-ket-cach-moi-cua-so-2-18.md` §3, câu 2)
Gốc: crm/_acceptance/ke-hoach-la-mot-ban-ghi — 22/09 03:47–03:55Z, bảy câu máy hỏi trong tám phút ở bước lên thiết kế (ba «chọn như đề xuất», bốn «duyệt phần N, trình phần N+1»); vòng T3 có ba cổng trong thiết kế.
Gốc: crm/_acceptance/sua-luu-tru-dieu-phoi — 21/09 22:27–22:42Z và 22/09 00:10Z, tám câu trả lời (năm «A, …» liên tiếp cho năm câu hỏi hành vi, ba «đồng ý … chạy luôn»).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Ca thật

Đếm trên transcript bằng `luot_goi.py` (chép cạnh bản tổng kết): trong các vòng crm cách mới,
lượt gọi người trong thiết kế đã về đúng trần (1–3 lượt/vòng), nhưng **lượt máy hỏi ngoài thiết
kế dồn về S1**:

| Vòng | Hạng | Cổng trong thiết kế (lượt) | Máy hỏi ngoài thiết kế (chạm) |
|---|---|---|---|
| `sua-luu-tru-dieu-phoi` | T3 | 2 (+1 ký lại do lưới đòi E29) | 8 |
| `ke-hoach-la-mot-ban-ghi` | T3 | 3 | 7 |
| `moi-phia-deu-thay-ke-hoach` (đang chạy) | T2 | 1 | 6 |
| bảy vòng crm còn lại | T2/T3 | 0–3 | 0–2 |

28 câu trả lời trong cửa sổ: **0 câu chọn khác khuyến nghị**, 1 câu đòi máy rà thêm («Review cả
3 phần trước khi duyệt»), 1 câu nhờ máy điền hộ («Điền sẵn một câu cho tôi»). Theo phép thử của
luật lời mời cổng (01/09) — «người trả lời khác khuyến nghị thì dựa vào điều gì máy không có?» —
đây là trạm thu phí, cùng hình với Treo «phê hết» 4/4 (hạt giống `audit-s4-bon-diem-nguoc-north-star` điểm 1).

## Dạng nghiệm đúng tầng

Nguồn câu hỏi là nghi thức lên thiết kế của phiên (trình từng phần, hỏi từng lựa chọn), không phải
cổng của kit. Áp luật lời mời cho S1 như cho cổng: mục có căn cứ là mục tiêu + quy tắc đã khai
→ máy đi tiếp, ghi dòng `approach` vào sổ quyết định, và **trình gộp ở Cổng Phạm vi** (khối
«CHƯA duyệt» đã có). Chỉ mục khó-đảo hoặc đánh-đổi giá trị mới là câu hỏi giữa S1. Không thêm
cổng, không thêm răng: đây là TRỪ ở lời mời.

Ngưỡng mở ô: **đã đủ** (28 chạm / 3 vòng / 0 lệch khuyến nghị). Chiều đỏ của việc sửa: vòng T3 kế
tiếp có ≤ 1 câu máy hỏi giữa S1 và Cổng Phạm vi vẫn trình đủ các lựa chọn máy đã tự quyết; chiều
im: câu hỏi khó-đảo vẫn hỏi.

## Owner quyết 23/09 (phiên điều phối «Cập nhật kit mới nhất từ github»)

Sáng 23/09 owner xếp hạt giống này là vòng meta đầu; cùng ngày, sau khi PR #210 nộp hạt giống
`2026-09-23-hat-giong-tac-tu-tong-hop-ghi-truong-cua-nguoi.md` (chữ ký máy lọt lưới — nguyên tố 2),
owner **đổi**: chốt máy chữ ký đi trước (2.18.2), **hạt giống này lùi về mốc kế (2.19)**. Ngưỡng vẫn đã đủ;
không gộp vào vòng 2.18.2 (khác lớp).
