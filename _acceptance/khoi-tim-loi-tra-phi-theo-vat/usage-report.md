# usage-report — khoi-tim-loi-tra-phi-theo-vat, lượt chấm 3

Nguồn: `wf-usage` đọc transcript của run `wf_eb667845-541` (máy đo, không đếm tay).

## Dòng 4 — token máy/vòng, tách ba khối

| khối | token | phần |
|---|--:|--:|
| tìm-lỗi (review·refute) | 14,042,286 | 83.2 % |
| tổng hợp (triage·capture·synthesize) | 1,006,242 | 6.0 % |
| chứng-minh-vật (machine·ui·judge·baseline) | 1,838,736 | 10.9 % |
| **tổng** | **16,887,264** | 100 % |

## Dòng 5 — phút máy/lượt chấm

Tổng phút S4 của lượt: **23.7 phút** · 24 agent.

| vai trò | agent | phút | bắt đầu | kết thúc |
|---|--:|--:|---|---|
| machine | 13 | 13.4 | 08:50:25 | 09:03:51 |
| review | 3 | 7.9 | 08:50:25 | 08:58:16 |
| triage | 1 | 3.3 | 09:03:51 | 09:07:07 |
| refute | 5 | 2.9 | 09:07:07 | 09:09:58 |
| capture | 1 | 0.1 | 09:09:59 | 09:10:06 |
| synthesize | 1 | 4.1 | 09:10:06 | 09:14:09 |

Đường găng: `machine` (13,4 phút) — làn tìm-lỗi chạy SONG SONG và xong trước
(7,9 phút), nên nó không còn nằm trên đường găng như trước T7.

## Đọc số

- Khối tìm-lỗi vẫn chiếm **83,2 %** token. Nhưng thành phần đã đổi: `refute`
  chỉ còn **5 tác tử / 2,9 phút** (lượt chấm của vòng release-2-12-0: 20 tác tử),
  vì T1 đặt triage TRƯỚC refute nên chỉ finding trong hợp đồng mới trả phí bác bỏ.
  Phần còn lại của khối là ba làn `review` — 3 tác tử opus đọc diff, 9,7 M
  cache_read. Đó là chỗ cắt tiếp theo, không phải refute.
- Khối chứng-minh-vật **10,9 %** token nhưng **13,4 phút** — nghịch với token.
  Tức tiền và thời gian KHÔNG cùng một chỗ: cắt token phải nhìn `review`,
  cắt phút phải nhìn `machine` (13 tác tử haiku, phần lớn chờ suite chạy).

## Bảng đầy đủ theo tác tử

### S4 luot cham 3 — wf_eb667845-541 (24 agent, 176,486 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5 | 35 | 30,322 | 70 | 4,624,481 | 470 |
| synthesize:report | claude-sonnet-5 | 6 | 24,827 | 12 | 538,404 | 244 |
| review:measurement | claude-opus-5 | 27 | 24,641 | 54 | 3,471,716 | 431 |
| review:conventions | claude-opus-5 | 15 | 19,354 | 30 | 1,640,329 | 294 |
| triage | claude-sonnet-5 | 2 | 19,072 | 4 | 76,916 | 196 |
| refute:vung-vat-mutants.test.mjs | claude-sonnet-5 | 10 | 15,278 | 20 | 734,516 | 170 |
| refute:vung-vat-mutants.test.mjs | claude-sonnet-5 | 6 | 10,352 | 12 | 416,939 | 115 |
| refute:acceptance-verify.js | claude-sonnet-5 | 12 | 7,299 | 24 | 922,211 | 81 |
| refute:acceptance-verify.js | claude-sonnet-5 | 14 | 6,307 | 28 | 1,009,025 | 74 |
| refute:evals.yaml | claude-sonnet-5 | 6 | 3,029 | 12 | 405,646 | 34 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 8 | 1,906 | 66 | 302,768 | 805 |
| machine:bash -c 'out=$(node tests/workflows/acce | claude-haiku-4-5-20251001 | 2 | 1,677 | 18 | 47,486 | 20 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,576 | 50 | 290,316 | 28 |
| machine:bash -c 'out=$(node tests/workflows/acce | claude-haiku-4-5-20251001 | 2 | 1,393 | 18 | 79,419 | 20 |
| machine:bash -c 'out=$(node tests/workflows/acce | claude-haiku-4-5-20251001 | 2 | 1,376 | 18 | 79,419 | 19 |
| machine:node tests/scripts/s4-args-vung-vat.test | claude-haiku-4-5-20251001 | 2 | 1,322 | 18 | 79,354 | 33 |
| machine:bash -c 'out=$(node tests/workflows/acce | claude-haiku-4-5-20251001 | 2 | 1,278 | 18 | 79,418 | 16 |
| machine:bash -c 'out=$(node tests/scripts/wf-usa | claude-haiku-4-5-20251001 | 2 | 1,261 | 18 | 79,415 | 17 |
| machine:node tests/workflows/vung-vat-mutants.te | claude-haiku-4-5-20251001 | 2 | 904 | 18 | 79,350 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 842 | 18 | 63,856 | 458 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 731 | 18 | 79,337 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 721 | 18 | 79,344 | 9 |
| capture:provenance | claude-sonnet-5 | 2 | 581 | 4 | 66,582 | 7 |
| machine:bash -c 'out=$(node tests/workflows/carr | claude-haiku-4-5-20251001 | 2 | 437 | 18 | 79,407 | 18 |


wall: 1424s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 13 | 15,424 | 1,418,889 | 806 | 08:50:25 | 09:03:51 |
| review | 3 | 74,317 | 9,736,526 | 472 | 08:50:25 | 08:58:16 |
| triage | 1 | 19,072 | 76,916 | 196 | 09:03:51 | 09:07:07 |
| refute | 5 | 42,265 | 3,488,337 | 172 | 09:07:07 | 09:09:58 |
| capture | 1 | 581 | 66,582 | 7 | 09:09:59 | 09:10:06 |
| synthesize | 1 | 24,827 | 538,404 | 244 | 09:10:06 | 09:14:09 |

- **claude-opus-5**: 3 agent · 77 calls · out 74,317 · in 154 · cache_read 9,736,526 · cache_create 442,492
- **claude-sonnet-5**: 8 agent · 58 calls · out 86,745 · in 116 · cache_read 4,170,239 · cache_create 537,939
- **claude-haiku-4-5-20251001**: 13 agent · 36 calls · out 15,424 · in 314 · cache_read 1,418,889 · cache_create 404,109


