### S4 round 1 — wf_9a76e789-dce (28 agent, 69,862 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 14,357 | 6 | 126,219 | 77 |
| judge:E4:spec-alignment | claude-sonnet-5-5 | 2 | 9,870 | 4 | 34,647 | 71 |
| triage | claude-sonnet-5-5 | 2 | 7,993 | 4 | 38,467 | 55 |
| judge:E4:domain-correctness | claude-sonnet-5-5 | 2 | 7,528 | 4 | 31,285 | 57 |
| review:measurement | claude-opus-5-5 | 11 | 7,527 | 22 | 807,945 | 189 |
| judge:E4:operational-feasibility | claude-sonnet-5-5 | 3 | 5,702 | 6 | 86,754 | 49 |
| review:conventions | claude-opus-5-5 | 21 | 2,722 | 42 | 2,178,355 | 202 |
| review:bugs | claude-opus-5-5 | 19 | 2,236 | 38 | 1,479,302 | 196 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,101 | 4 | 2,869 | 595 |
| refute:road-map-de-dung.test.mjs | claude-sonnet-5-5 | 6 | 1,424 | 12 | 204,427 | 21 |
| judge:E7:operational-feasibility | claude-sonnet-5-5 | 3 | 1,173 | 6 | 76,473 | 12 |
| judge:E7:domain-correctness | claude-sonnet-5-5 | 3 | 1,165 | 6 | 76,469 | 14 |
| judge:E7:spec-alignment | claude-sonnet-5-5 | 3 | 1,085 | 6 | 76,469 | 11 |
| refute:gio-may.mjs | claude-sonnet-5-5 | 3 | 1,034 | 6 | 69,223 | 17 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 552 | 4 | 33,969 | 102 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 520 | 4 | 33,922 | 174 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 472 | 4 | 33,914 | 7 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 397 | 4 | 33,939 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 301 | 4 | 2,869 | 506 |
| machine:node tests/scripts/xem-trang-lo-trinh.te | claude-haiku-5-5 | 2 | 281 | 4 | 33,929 | 21 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 241 | 4 | 33,913 | 82 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 221 | 4 | 2,869 | 529 |
| machine:node tests/scripts/road-map-de-dung.test | claude-haiku-5-5 | 2 | 179 | 4 | 33,921 | 27 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 174 | 4 | 2,869 | 518 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 33,969 | 86 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 157 | 4 | 33,591 | 32 |
| capture:provenance | claude-sonnet-5-5 | 2 | 146 | 4 | 29,829 | 6 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 131 | 4 | 33,913 | 8 |


wall: 2804s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 157 | 33,591 | 32 | 19:35:17 | 19:35:49 |
| machine | 13 | 5,743 | 316,865 | 2635 | 19:35:17 | 20:19:12 |
| judge | 6 | 26,523 | 382,097 | 73 | 19:35:17 | 19:36:29 |
| review | 3 | 12,485 | 4,465,602 | 205 | 19:35:17 | 19:38:42 |
| triage | 1 | 7,993 | 38,467 | 55 | 20:19:14 | 20:20:09 |
| refute | 2 | 2,458 | 273,650 | 22 | 20:20:11 | 20:20:34 |
| capture | 1 | 146 | 29,829 | 6 | 20:20:36 | 20:20:42 |
| synthesize | 1 | 14,357 | 126,219 | 77 | 20:20:44 | 20:22:01 |

- **claude-sonnet-5-5**: 12 agent · 34 calls · out 51,634 · in 68 · cache_read 883,853 · cache_create 563,845
- **claude-opus-5-5**: 3 agent · 51 calls · out 12,485 · in 102 · cache_read 4,465,602 · cache_create 397,058
- **claude-haiku-5-5**: 13 agent · 26 calls · out 5,743 · in 52 · cache_read 316,865 · cache_create 554,811

### S4 round 2 — wf_4fbd10fe-82e (24 agent, 61,172 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 12,181 | 10 | 243,044 | 76 |
| judge:E4:spec-alignment | claude-sonnet-5-5 | 2 | 9,511 | 4 | 34,744 | 69 |
| judge:E4:operational-feasibility | claude-sonnet-5-5 | 3 | 9,081 | 8 | 87,428 | 65 |
| judge:E4:domain-correctness | claude-sonnet-5-5 | 2 | 7,018 | 4 | 31,382 | 50 |
| triage | claude-sonnet-5-5 | 2 | 3,109 | 4 | 34,571 | 24 |
| machine:node tests/scripts/road-map-de-dung.test | claude-haiku-5-5 | 2 | 3,047 | 4 | 34,018 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,803 | 4 | 2,869 | 543 |
| review:conventions | claude-opus-5-5 | 23 | 2,073 | 46 | 1,767,051 | 238 |
| review:measurement | claude-opus-5-5 | 16 | 1,871 | 32 | 1,028,495 | 183 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,805 | 4 | 2,869 | 597 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,483 | 4 | 34,010 | 86 |
| judge:E7:operational-feasibility | claude-sonnet-5-5 | 3 | 1,334 | 6 | 76,667 | 13 |
| judge:E7:spec-alignment | claude-sonnet-5-5 | 3 | 1,218 | 6 | 76,663 | 11 |
| judge:E7:domain-correctness | claude-sonnet-5-5 | 3 | 1,101 | 6 | 76,663 | 12 |
| review:bugs | claude-opus-5-5 | 14 | 813 | 28 | 829,889 | 179 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 690 | 4 | 34,066 | 106 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 543 | 4 | 34,036 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 401 | 4 | 34,011 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 221 | 4 | 2,869 | 512 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 196 | 4 | 34,019 | 168 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 184 | 4 | 34,010 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 2,869 | 523 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 170 | 4 | 34,066 | 88 |
| capture:provenance | claude-sonnet-5-5 | 2 | 144 | 4 | 29,926 | 5 |


wall: 2780s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 12 | 11,718 | 283,712 | 2668 | 21:32:49 | 22:17:17 |
| judge | 6 | 29,263 | 383,547 | 70 | 21:32:49 | 21:33:59 |
| review | 3 | 4,757 | 3,625,435 | 238 | 21:32:49 | 21:36:47 |
| triage | 1 | 3,109 | 34,571 | 24 | 22:17:20 | 22:17:44 |
| capture | 1 | 144 | 29,926 | 5 | 22:17:46 | 22:17:50 |
| synthesize | 1 | 12,181 | 243,044 | 76 | 22:17:53 | 22:19:09 |

- **claude-sonnet-5-5**: 9 agent · 25 calls · out 44,697 · in 52 · cache_read 691,088 · cache_create 434,133
- **claude-haiku-5-5**: 12 agent · 24 calls · out 11,718 · in 48 · cache_read 283,712 · cache_create 523,341
- **claude-opus-5-5**: 3 agent · 53 calls · out 4,757 · in 106 · cache_read 3,625,435 · cache_create 270,339

### S4 round 3 — wf_55b32dd7-a68 (16 agent, 17,363 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 8,536 | 10 | 240,827 | 60 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,725 | 4 | 2,869 | 546 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,755 | 4 | 2,869 | 595 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,512 | 4 | 33,908 | 90 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 509 | 4 | 33,934 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 394 | 4 | 33,909 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 326 | 4 | 2,869 | 511 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 263 | 4 | 31,048 | 170 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 259 | 4 | 33,964 | 102 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 184 | 4 | 33,908 | 9 |
| review:measurement | claude-opus-5-5 | 6 | 180 | 12 | 195,323 | 35 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 2,869 | 525 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 33,964 | 87 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 29,824 | 5 |
| review:conventions | claude-opus-5-5 | 7 | 131 | 14 | 254,603 | 34 |
| review:bugs | claude-opus-5-5 | 13 | 94 | 26 | 540,921 | 263 |


wall: 2739s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 11 | 8,275 | 246,111 | 2670 | 23:39:09 | 00:23:39 |
| review | 3 | 405 | 990,847 | 266 | 23:39:09 | 23:43:34 |
| capture | 1 | 147 | 29,824 | 5 | 00:23:41 | 00:23:46 |
| synthesize | 1 | 8,536 | 240,827 | 60 | 00:23:48 | 00:24:48 |

- **claude-sonnet-5-5**: 2 agent · 7 calls · out 8,683 · in 14 · cache_read 270,651 · cache_create 114,518
- **claude-haiku-5-5**: 11 agent · 22 calls · out 8,275 · in 44 · cache_read 246,111 · cache_create 489,715
- **claude-opus-5-5**: 3 agent · 26 calls · out 405 · in 52 · cache_read 990,847 · cache_create 145,848

