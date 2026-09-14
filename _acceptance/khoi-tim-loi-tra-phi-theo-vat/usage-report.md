# usage-report — khoi-tim-loi-tra-phi-theo-vat

Nguồn: `wf-usage` đọc transcript của các lượt chấm (máy đo, không đếm tay).

## Lượt chấm 4 (run `wf_80d7c7be-57e`) — dòng 4 và 5 của luật (c)

| khối | token | phần |
|---|--:|--:|
| tìm-lỗi (review·refute) | 28,514,479 | 88.9 % |
| tổng hợp (triage·capture·synthesize) | 1,377,935 | 4.3 % |
| chứng-minh-vật (machine·ui·judge·baseline) | 2,180,650 | 6.8 % |
| **tổng** | **32,073,064** | 100 % |

Tổng phút S4 của lượt: **25.4 phút** · 28 tác tử.

| vai trò | tác tử | phút | bắt đầu | kết thúc |
|---|--:|--:|---|---|
| baseline | 1 | 0.9 | 09:41:54 | 09:42:47 |
| machine | 11 | 13.0 | 09:41:54 | 09:54:51 |
| review | 3 | 12.4 | 09:41:54 | 09:54:19 |
| triage | 1 | 2.5 | 09:54:51 | 09:57:24 |
| refute | 10 | 3.9 | 09:57:24 | 10:01:16 |
| capture | 1 | 0.1 | 10:01:16 | 10:01:26 |
| synthesize | 1 | 5.8 | 10:01:26 | 10:07:15 |

## So hai lượt

| | lượt 3 | lượt 4 |
|---|--:|--:|
| tác tử | 24 | 28 |
| token | 16.887.264 | 32,073,064 |
| phút | 23,7 | 25.4 |
| tìm-lỗi | 83,2 % | 88.9 % |
| tác tử refute | 5 | 10 |

## Đọc số — đừng đọc nhầm

- Lượt 4 đắt HƠN lượt 3 vì **làn phân loại phạm vi trả thiếu một mục**. Luật
  fail-toward-human khi đó bắt refute chạy trên TOÀN BỘ finding thay vì chỉ
  finding trong hợp đồng, nên refute đi từ 5 lên 10 tác tử. Đó là cái giá của
  đường an toàn, không phải nhát cắt T1 hỏng — khi triage lành (lượt 3), T1 đúng
  là thứ đưa refute từ 20 tác tử (lượt chấm release-2-12-0) xuống 5.
- Khối tìm-lỗi vẫn là khoản tiền lớn nhất ở cả hai lượt. Thành phần của nó đã
  đổi: phần refute đã cắt được; phần còn lại là ba làn `review` đọc diff. Đó là
  chỗ cắt kế tiếp.
- Tiền và thời gian KHÔNG cùng một chỗ: đường găng vẫn là `machine` (13,0 phút)
  trong khi khối đó chỉ chiếm 6.8 % token. Cắt token nhìn `review`; cắt phút
  nhìn `machine`.
