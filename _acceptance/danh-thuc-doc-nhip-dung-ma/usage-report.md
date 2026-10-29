### S4 round 1 — wf_bad52424-9ef (21 agent, 76,171 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 11,431 | 8 | 186,410 | 69 |
| review:conventions | claude-opus-5-5 | 14 | 10,854 | 28 | 917,078 | 130 |
| review:measurement | claude-opus-5-5 | 7 | 9,661 | 14 | 331,515 | 108 |
| review:bugs | claude-opus-5-5 | 8 | 7,910 | 16 | 383,332 | 91 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 11 | 6,695 | 22 | 350,954 | 1352 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,737 | 16 | 235,602 | 1083 |
| triage | claude-sonnet-5-5 | 2 | 4,198 | 4 | 38,917 | 31 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 3,427 | 10 | 115,137 | 773 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 2,908 | 4 | 39,583 | 18 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,026 | 4 | 36,485 | 100 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,964 | 4 | 6,114 | 327 |
| refute:danh-thuc-ma-phien.test.mjs | claude-sonnet-5-5 | 5 | 1,553 | 10 | 150,709 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,139 | 4 | 36,541 | 166 |
| machine:node tests/dieu-phoi/hai-moi-truong.mjs | claude-haiku-5-5 | 2 | 1,115 | 4 | 6,114 | 587 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,022 | 4 | 6,114 | 429 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 905 | 4 | 3,057 | 551 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 896 | 4 | 36,541 | 91 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 871 | 4 | 36,511 | 7 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 754 | 4 | 36,485 | 10 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 681 | 4 | 36,486 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 424 | 4 | 32,211 | 5 |


wall: 4687s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,908 | 39,583 | 18 | 02:41:49 | 02:42:07 |
| machine | 13 | 27,232 | 942,141 | 4567 | 02:41:49 | 03:57:56 |
| review | 3 | 28,425 | 1,631,925 | 130 | 02:41:49 | 02:43:59 |
| triage | 1 | 4,198 | 38,917 | 31 | 03:57:56 | 03:58:27 |
| refute | 1 | 1,553 | 150,709 | 15 | 03:58:27 | 03:58:42 |
| capture | 1 | 424 | 32,211 | 5 | 03:58:42 | 03:58:47 |
| synthesize | 1 | 11,431 | 186,410 | 69 | 03:58:47 | 03:59:56 |

- **claude-sonnet-5-5**: 5 agent · 15 calls · out 20,514 · in 30 · cache_read 447,830 · cache_create 227,252
- **claude-opus-5-5**: 3 agent · 29 calls · out 28,425 · in 58 · cache_read 1,631,925 · cache_create 237,284
- **claude-haiku-5-5**: 13 agent · 44 calls · out 27,232 · in 88 · cache_read 942,141 · cache_create 676,712

### S4 round 2 — wf_62f4c1fb-696 (20 agent, 69,072 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 12,668 | 6 | 117,034 | 77 |
| review:bugs | claude-opus-5-5 | 8 | 9,349 | 16 | 375,182 | 114 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 11 | 7,015 | 22 | 356,599 | 1119 |
| review:conventions | claude-opus-5-5 | 5 | 6,857 | 10 | 180,854 | 77 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 11 | 6,693 | 22 | 351,734 | 1349 |
| review:measurement | claude-opus-5-5 | 5 | 5,383 | 10 | 177,921 | 65 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,248 | 12 | 156,379 | 808 |
| triage | claude-sonnet-5-5 | 2 | 3,230 | 4 | 37,334 | 25 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 2,963 | 4 | 36,466 | 18 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,698 | 4 | 36,558 | 122 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,477 | 4 | 3,057 | 401 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,382 | 4 | 36,614 | 211 |
| machine:node tests/dieu-phoi/hai-moi-truong.mjs | claude-haiku-5-5 | 3 | 1,310 | 6 | 42,401 | 674 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,057 | 4 | 36,614 | 85 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 907 | 4 | 3,057 | 524 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 753 | 4 | 3,057 | 560 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 668 | 4 | 36,584 | 5 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 513 | 4 | 36,558 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 479 | 4 | 36,559 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 422 | 4 | 32,284 | 5 |


wall: 4904s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,963 | 36,466 | 18 | 04:32:41 | 04:32:59 |
| machine | 13 | 28,200 | 1,135,771 | 4797 | 04:32:41 | 05:52:38 |
| review | 3 | 21,589 | 733,957 | 116 | 04:32:41 | 04:34:37 |
| triage | 1 | 3,230 | 37,334 | 25 | 05:52:38 | 05:53:04 |
| capture | 1 | 422 | 32,284 | 5 | 05:53:04 | 05:53:09 |
| synthesize | 1 | 12,668 | 117,034 | 77 | 05:53:09 | 05:54:25 |

- **claude-sonnet-5-5**: 4 agent · 9 calls · out 19,283 · in 18 · cache_read 223,118 · cache_create 191,035
- **claude-opus-5-5**: 3 agent · 18 calls · out 21,589 · in 36 · cache_read 733,957 · cache_create 167,782
- **claude-haiku-5-5**: 13 agent · 49 calls · out 28,200 · in 98 · cache_read 1,135,771 · cache_create 684,647

### S4 round 3 — wf_7b900a5c-156 (16 agent, 33,406 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 9,152 | 10 | 242,737 | 66 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 11 | 5,725 | 22 | 356,246 | 1174 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 5,724 | 18 | 269,547 | 1113 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 1,916 | 6 | 39,472 | 696 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,691 | 4 | 36,619 | 97 |
| review:conventions | claude-opus-5-5 | 5 | 1,532 | 10 | 152,562 | 17 |
| review:bugs | claude-opus-5-5 | 4 | 1,487 | 8 | 117,553 | 17 |
| review:measurement | claude-opus-5-5 | 4 | 1,229 | 8 | 112,535 | 17 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 859 | 4 | 36,675 | 149 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 729 | 4 | 36,628 | 243 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 659 | 4 | 3,057 | 488 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 656 | 4 | 36,675 | 78 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 631 | 4 | 36,645 | 7 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 512 | 4 | 36,619 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 482 | 4 | 36,620 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 422 | 4 | 32,345 | 5 |


wall: 4129s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 11 | 19,584 | 924,803 | 4058 | 06:02:17 | 07:09:55 |
| review | 3 | 4,248 | 382,650 | 18 | 06:02:17 | 06:02:34 |
| capture | 1 | 422 | 32,345 | 5 | 07:09:55 | 07:09:59 |
| synthesize | 1 | 9,152 | 242,737 | 66 | 07:10:00 | 07:11:06 |

- **claude-sonnet-5-5**: 2 agent · 7 calls · out 9,574 · in 14 · cache_read 275,082 · cache_create 104,574
- **claude-haiku-5-5**: 11 agent · 39 calls · out 19,584 · in 78 · cache_read 924,803 · cache_create 517,414
- **claude-opus-5-5**: 3 agent · 13 calls · out 4,248 · in 26 · cache_read 382,650 · cache_create 120,838

### S4 round 4 — wf_904f6ac9-bf7 (19 agent, 48,026 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 10,772 | 8 | 181,489 | 72 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 6,511 | 16 | 249,446 | 974 |
| review:conventions | claude-opus-5-5 | 9 | 4,813 | 18 | 437,855 | 69 |
| review:measurement | claude-opus-5-5 | 7 | 4,411 | 14 | 313,766 | 59 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,014 | 4 | 3,140 | 429 |
| review:bugs | claude-opus-5-5 | 8 | 2,850 | 16 | 443,013 | 182 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,253 | 4 | 38,433 | 89 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 2,133 | 4 | 38,540 | 310 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,703 | 4 | 38,433 | 11 |
| triage | claude-sonnet-5-5 | 2 | 1,622 | 4 | 37,398 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,356 | 4 | 38,442 | 272 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,192 | 4 | 38,489 | 76 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,017 | 4 | 38,489 | 111 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 883 | 4 | 38,459 | 8 |
| machine:node tests/dieu-phoi/hai-moi-truong.mjs | claude-haiku-5-5 | 2 | 824 | 4 | 6,280 | 507 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 773 | 4 | 38,434 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 714 | 4 | 3,140 | 565 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 679 | 4 | 3,140 | 393 |
| capture:provenance | claude-sonnet-5-5 | 2 | 506 | 4 | 34,081 | 7 |


wall: 3055s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 13 | 23,052 | 572,865 | 2958 | 05:11:04 | 06:00:22 |
| review | 3 | 12,074 | 1,194,634 | 184 | 05:11:05 | 05:14:08 |
| triage | 1 | 1,622 | 37,398 | 14 | 06:00:24 | 06:00:38 |
| capture | 1 | 506 | 34,081 | 7 | 06:00:40 | 06:00:46 |
| synthesize | 1 | 10,772 | 181,489 | 72 | 06:00:48 | 06:02:00 |

- **claude-sonnet-5-5**: 3 agent · 8 calls · out 12,900 · in 16 · cache_read 252,968 · cache_create 153,140
- **claude-haiku-5-5**: 13 agent · 32 calls · out 23,052 · in 64 · cache_read 572,865 · cache_create 653,792
- **claude-opus-5-5**: 3 agent · 24 calls · out 12,074 · in 48 · cache_read 1,194,634 · cache_create 199,611

### S4 round 5 — wf_8984fa9f-ede (19 agent, 55,973 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 10 | 14,207 | 20 | 674,773 | 162 |
| synthesize:report | claude-sonnet-5-5 | 4 | 8,803 | 8 | 172,811 | 54 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 10 | 6,420 | 20 | 388,325 | 927 |
| review:measurement | claude-opus-5-5 | 8 | 3,644 | 16 | 430,546 | 57 |
| review:conventions | claude-opus-5-5 | 8 | 3,576 | 16 | 373,220 | 51 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,342 | 4 | 3,140 | 418 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 2,186 | 4 | 38,678 | 286 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,940 | 4 | 38,571 | 12 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,707 | 4 | 38,571 | 87 |
| triage | claude-sonnet-5-5 | 2 | 1,653 | 4 | 37,347 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,469 | 4 | 38,580 | 241 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,195 | 4 | 38,627 | 108 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,101 | 4 | 38,627 | 76 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,076 | 4 | 3,140 | 564 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 960 | 4 | 38,572 | 6 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 918 | 4 | 38,597 | 6 |
| machine:node tests/dieu-phoi/hai-moi-truong.mjs | claude-haiku-5-5 | 2 | 888 | 4 | 6,280 | 474 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 535 | 4 | 3,140 | 373 |
| capture:provenance | claude-sonnet-5-5 | 2 | 353 | 4 | 34,219 | 6 |


wall: 2922s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 13 | 23,737 | 712,848 | 2839 | 06:56:35 | 07:43:54 |
| review | 3 | 21,427 | 1,478,539 | 164 | 06:56:35 | 06:59:19 |
| triage | 1 | 1,653 | 37,347 | 14 | 07:43:59 | 07:44:13 |
| capture | 1 | 353 | 34,219 | 6 | 07:44:15 | 07:44:21 |
| synthesize | 1 | 8,803 | 172,811 | 54 | 07:44:23 | 07:45:17 |

- **claude-opus-5-5**: 3 agent · 26 calls · out 21,427 · in 52 · cache_read 1,478,539 · cache_create 231,379
- **claude-sonnet-5-5**: 3 agent · 8 calls · out 10,809 · in 16 · cache_read 244,377 · cache_create 146,668
- **claude-haiku-5-5**: 13 agent · 34 calls · out 23,737 · in 68 · cache_read 712,848 · cache_create 665,663

