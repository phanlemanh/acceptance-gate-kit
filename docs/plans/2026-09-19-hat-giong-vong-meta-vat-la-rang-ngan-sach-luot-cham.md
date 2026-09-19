# Hạt giống — vòng meta có vật là RĂNG phải chốt ngân sách lượt chấm trước (cửa sổ 2.16 → 2.17)

**Ngày:** 2026-09-19 · **Ổ:** chưa có ô — đây là SỔ, đúng luật ô-chỉ-mở-khi-có-neo.
**Gốc:** `acceptance-gate-kit/_acceptance/o-chi-mo-khi-co-neo-ngoai/` (park; hồ sơ đầy đủ ở nhánh
`cong-dang/o-chi-mo-khi-co-neo-ngoai`) — chính vòng ấy là ca mẫu, số ở bàn giao
`docs/handoff/2026-09-19-park-o-chi-mo-khi-co-neo-ngoai.md`.

> Chữ trong tệp này là NGUỒN. Đừng đo lại trừ khi nghi số đã cũ.

## Vật và lỗi

Vòng `o-chi-mo-khi-co-neo-ngoai` giao hai thứ: một LUẬT (dòng `Gốc:` ở hàng chờ Cổng Đáng) và
một RĂNG (VC8 mới). Luật và hàng chờ đã rà đúng từ giờ thứ hai và không đổi qua sáu lượt chấm.
Răng ăn phần còn lại:

| | |
|---|---|
| Lượt chấm | 7 (trần 3) |
| Token máy | ≈ 14,4 M |
| Phút máy | ≈ 150 |
| Lượt gọi người | 7 (trần T2 là 3) |
| Lượt mà mọi phát hiện đều về THƯỚC, không về luật | từ lượt 3 trở đi |

Máy xin «một lượt nữa» ba lần (sau lượt 2, 4, 5), lần nào cũng có lý do nghe khác; bảng ba kết
cục (đạt → ký · chỉ thước hỏng → khai giới hạn rồi ký · vật hỏng → park) chỉ được chốt TRƯỚC
lượt 6 — tức sau khi năm lượt đã đốt.

Luật (a) cấm MỞ vòng đo-thước-của-thước, nhưng không nói vòng meta đang chạy phải DỪNG khi nó
biến thành vòng đo-thước. Verdict REJECT thì không ký được, nên lối «một lượt nữa» luôn là lối
duy nhất máy nhìn thấy.

**Người trả giá:** owner — 4 lượt gọi người ngoài thiết kế; kho tiêu thụ — cửa sổ 2.16 → 2.17
không có giá trị nào chạm tới.

## Đề xuất (chưa phải ô)

- Hợp đồng của vòng meta có vật là răng khai NGÂN SÁCH lượt chấm ngay ở Cổng Phạm vi (mặc định
  = trần 3 hiện có) và viết bảng ba kết cục TRƯỚC lượt 1.
- Mặc định khi hai lượt liên tiếp chỉ ra lỗi thước: giữ vật, ship luật kèm giới hạn khai, park
  răng — máy đề xuất chính lối này, không đề xuất «một lượt nữa».

## Vì sao CHƯA mở ô

Neo có (hồ sơ trên) nhưng mới MỘT ca. Ngưỡng đang đếm: một vòng meta nữa vượt trần 3 với ≥2
lượt liên tiếp toàn lỗi thước. Nổ lần hai thì mở ô, neo là cả hai hồ sơ; ghi ở đây để lần hai có
số so.
