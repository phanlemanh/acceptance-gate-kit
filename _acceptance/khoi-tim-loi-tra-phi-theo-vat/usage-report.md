# usage-report — khoi-tim-loi-tra-phi-theo-vat

Nguồn: `wf-usage` đọc transcript các lượt chấm (máy đo, không đếm tay).

## Lượt chấm 5 — lượt PASS (run `wf_211fd30c-0ec`)

Dòng 4 của luật (c) — token máy/vòng, tách ba khối:

| khối | token | phần |
|---|--:|--:|
| tìm-lỗi (review·refute) | 13,347,514 | 79.9 % |
| tổng hợp (triage·capture·synthesize) | 767,464 | 4.6 % |
| chứng-minh-vật (machine·ui·judge·baseline) | 2,600,237 | 15.6 % |
| **tổng** | **16,715,215** | 100 % |

Dòng 5 — phút máy/lượt chấm: **20.4 phút** · 20 tác tử.

| vai trò | tác tử | phút | bắt đầu | kết thúc |
|---|--:|--:|---|---|
| baseline | 1 | 8.0 | 10:57:36 | 11:05:35 |
| machine | 13 | 12.9 | 10:57:36 | 11:10:32 |
| review | 3 | 7.9 | 10:57:36 | 11:05:31 |
| triage | 1 | 3.5 | 11:10:32 | 11:14:04 |
| capture | 1 | 0.2 | 11:14:04 | 11:14:14 |
| synthesize | 1 | 3.8 | 11:14:14 | 11:17:59 |

## Ba lượt cuối, cùng một vật

| | lượt 3 | lượt 4 | lượt 5 (PASS) |
|---|--:|--:|--:|
| verdict | REJECT | REJECT | **PASS** |
| tác tử | 24 | 28 | 20 |
| token | 16.887.264 | 32.073.064 | 16,715,215 |
| phút | 23,7 | 25,4 | 20.4 |
| tác tử refute | 5 | 10 | 0 |
| triage lành | có | KHÔNG | có |

## Đọc số

- **Nhát cắt T1 đo được:** lượt chấm của release-2-12-0 chạy **20 tác tử refute**;
  hai lượt có triage lành ở đây chạy **5** rồi **0**. Lượt 4 vọt lên 10 vì triage
  trả thiếu một mục nên luật fail-toward-human bắt refute chạy trên TOÀN BỘ
  finding — đó là giá của đường an toàn, không phải nhát cắt hỏng.
- **Khối tìm-lỗi vẫn là khoản lớn nhất (79.9 %).** Thành phần đã đổi: phần refute
  đã cắt; phần còn lại là ba làn `review` đọc diff. Đó là chỗ cắt kế tiếp.
- **Tiền và thời gian KHÔNG cùng chỗ.** Khối chứng-minh-vật chỉ 15.6 % token
  nhưng `machine` vẫn là đường găng. Cắt token nhìn `review`; cắt phút nhìn
  `machine`. T7 đã đưa `baseline` rời đường găng (0,9 phút ở lượt 4).
- **Ba lượt bị hạ tầng đốt** trong vòng này (lượt 1 SIGPIPE · lượt 2 E4 · lượt 4
  P93 chập chờn) — số cho dòng 3 của luật (c). Cả ba đều xanh khi chạy tay.
