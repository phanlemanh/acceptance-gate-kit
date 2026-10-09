### S4 round 1 — wf_a2ae16ef-0af (25 agent, 43,134 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 7 | 8,845 | 14 | 647,488 | 411 |
| triage | claude-sonnet-5-5 | 2 | 4,168 | 4 | 103,200 | 38 |
| review:bugs | claude-opus-5-5 | 28 | 2,860 | 56 | 4,457,945 | 354 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 2 | 2,483 | 4 | 134,026 | 39 |
| review:measurement | claude-opus-5-5 | 20 | 2,375 | 40 | 3,053,782 | 242 |
| review:conventions | claude-opus-5-5 | 26 | 2,324 | 52 | 3,687,849 | 235 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,301 | 4 | 69,964 | 366 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,287 | 4 | 134,384 | 258 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 2 | 2,208 | 4 | 134,028 | 20 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 2 | 2,021 | 4 | 99,134 | 21 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,856 | 4 | 134,384 | 236 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,704 | 4 | 134,370 | 65 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,344 | 4 | 134,370 | 15 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 4 | 1,036 | 8 | 349,083 | 25 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,005 | 4 | 99,397 | 138 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 4 | 935 | 8 | 348,912 | 30 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 6 | 749 | 12 | 551,489 | 34 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 495 | 4 | 134,378 | 68 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 479 | 4 | 134,426 | 86 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 402 | 4 | 134,371 | 9 |
| machine:node tests/scripts/xem-trang-lo-trinh.te | claude-haiku-5-5 | 2 | 370 | 4 | 134,386 | 22 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 301 | 4 | 134,426 | 282 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 290 | 8 | 313,181 | 74 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 98,174 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 144 | 4 | 134,426 | 79 |


wall: 2060s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 290 | 313,181 | 74 | 17:22:45 | 17:23:59 |
| machine | 12 | 12,688 | 1,513,282 | 1557 | 17:22:45 | 17:48:42 |
| judge | 3 | 6,712 | 367,188 | 44 | 17:22:45 | 17:23:29 |
| review | 3 | 7,559 | 11,199,576 | 356 | 17:22:45 | 17:28:41 |
| triage | 1 | 4,168 | 103,200 | 38 | 17:48:44 | 17:49:21 |
| refute | 3 | 2,720 | 1,249,484 | 34 | 17:49:23 | 17:49:57 |
| capture | 1 | 152 | 98,174 | 11 | 17:49:59 | 17:50:10 |
| synthesize | 1 | 8,845 | 647,488 | 411 | 17:50:14 | 17:57:05 |

- **claude-sonnet-5-5**: 10 agent · 35 calls · out 22,887 · in 70 · cache_read 2,778,715 · cache_create 1,132,310
- **claude-opus-5-5**: 3 agent · 74 calls · out 7,559 · in 148 · cache_read 11,199,576 · cache_create 512,096
- **claude-haiku-5-5**: 12 agent · 24 calls · out 12,688 · in 48 · cache_read 1,513,282 · cache_create 962,313

### S4 round 2 — wf_2b591468-9f3 (22 agent, 34,063 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 8,190 | 10 | 549,540 | 76 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 2 | 2,890 | 4 | 99,024 | 27 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,544 | 4 | 134,274 | 218 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 2 | 2,501 | 4 | 99,026 | 24 |
| triage | claude-sonnet-5-5 | 2 | 2,314 | 4 | 136,653 | 28 |
| review:measurement | claude-opus-5-5 | 8 | 2,244 | 16 | 857,374 | 86 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 2 | 2,060 | 4 | 99,024 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,834 | 4 | 134,274 | 202 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,501 | 4 | 69,964 | 322 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 134,260 | 58 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,320 | 4 | 134,260 | 11 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,232 | 4 | 99,287 | 132 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 5 | 976 | 10 | 443,209 | 38 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 3 | 872 | 6 | 206,906 | 18 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 606 | 4 | 134,316 | 78 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 386 | 4 | 134,261 | 7 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 276 | 4 | 134,268 | 64 |
| review:conventions | claude-opus-5-5 | 4 | 222 | 8 | 316,245 | 30 |
| review:bugs | claude-opus-5-5 | 13 | 192 | 26 | 1,437,170 | 230 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 132,903 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 144 | 4 | 134,316 | 261 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 134,316 | 63 |


wall: 1540s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 11 | 11,450 | 1,377,796 | 1373 | 18:07:51 | 18:30:44 |
| judge | 3 | 7,451 | 297,074 | 32 | 18:07:51 | 18:08:23 |
| review | 3 | 2,658 | 2,610,789 | 235 | 18:07:51 | 18:11:45 |
| triage | 1 | 2,314 | 136,653 | 28 | 18:30:46 | 18:31:13 |
| refute | 2 | 1,848 | 650,115 | 38 | 18:31:16 | 18:31:53 |
| capture | 1 | 152 | 132,903 | 15 | 18:31:56 | 18:32:11 |
| synthesize | 1 | 8,190 | 549,540 | 76 | 18:32:14 | 18:33:31 |

- **claude-sonnet-5-5**: 8 agent · 23 calls · out 19,955 · in 46 · cache_read 1,766,285 · cache_create 816,912
- **claude-haiku-5-5**: 11 agent · 22 calls · out 11,450 · in 44 · cache_read 1,377,796 · cache_create 886,358
- **claude-opus-5-5**: 3 agent · 25 calls · out 2,658 · in 50 · cache_read 2,610,789 · cache_create 381,923


### S4 round 3 — wf_941e14a6-3db (16 agent, 27,090 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 9,844 | 6 | 278,794 | 251 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,833 | 4 | 134,777 | 244 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,099 | 4 | 134,777 | 232 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,790 | 4 | 34,982 | 337 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,779 | 4 | 134,763 | 61 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,592 | 4 | 134,763 | 13 |
| triage | claude-sonnet-5-5 | 2 | 1,467 | 4 | 101,458 | 15 |
| review:measurement | claude-opus-5-5 | 5 | 1,293 | 10 | 509,790 | 58 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,256 | 4 | 99,790 | 138 |
| review:bugs | claude-opus-5-5 | 13 | 988 | 26 | 1,592,070 | 101 |
| review:conventions | claude-opus-5-5 | 10 | 704 | 20 | 1,137,968 | 76 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 544 | 4 | 134,819 | 89 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 418 | 4 | 134,819 | 289 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 171 | 4 | 134,819 | 72 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 160 | 4 | 134,764 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 98,567 | 7 |


wall: 1780s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 10 | 12,642 | 1,213,073 | 1500 | 02:16:00 | 02:41:00 |
| review | 3 | 2,985 | 3,239,828 | 106 | 02:16:00 | 02:17:45 |
| triage | 1 | 1,467 | 101,458 | 15 | 02:41:02 | 02:41:17 |
| capture | 1 | 152 | 98,567 | 7 | 02:41:20 | 02:41:27 |
| synthesize | 1 | 9,844 | 278,794 | 251 | 02:41:29 | 02:45:39 |

- **claude-sonnet-5-5**: 3 agent · 7 calls · out 11,463 · in 14 · cache_read 478,819 · cache_create 347,736
- **claude-haiku-5-5**: 10 agent · 20 calls · out 12,642 · in 40 · cache_read 1,213,073 · cache_create 866,346
- **claude-opus-5-5**: 3 agent · 28 calls · out 2,985 · in 56 · cache_read 3,239,828 · cache_create 343,847


### S4 round 4 — wf_0a0773c1-014 (17 agent, 35,653 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 14 | 8,153 | 28 | 1,976,646 | 286 |
| synthesize:report | claude-sonnet-5-5 | 5 | 7,571 | 10 | 549,960 | 67 |
| triage | claude-sonnet-5-5 | 2 | 4,065 | 4 | 103,688 | 33 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,483 | 4 | 134,845 | 237 |
| review:conventions | claude-opus-5-5 | 31 | 2,137 | 62 | 4,635,762 | 321 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,106 | 4 | 134,845 | 233 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,689 | 4 | 34,982 | 346 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 134,831 | 61 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,344 | 4 | 134,831 | 14 |
| review:bugs | claude-opus-5-5 | 17 | 1,330 | 34 | 2,127,940 | 229 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,302 | 4 | 99,858 | 127 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 716 | 4 | 134,887 | 81 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 4 | 699 | 8 | 315,801 | 19 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 159 | 4 | 134,832 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 98,635 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 144 | 4 | 134,887 | 71 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 124 | 4 | 134,887 | 272 |


wall: 1617s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 10 | 11,551 | 1,213,685 | 1481 | 03:19:46 | 03:44:27 |
| review | 3 | 11,620 | 8,740,348 | 321 | 03:19:46 | 03:25:07 |
| triage | 1 | 4,065 | 103,688 | 33 | 03:44:29 | 03:45:02 |
| refute | 1 | 699 | 315,801 | 19 | 03:45:06 | 03:45:25 |
| capture | 1 | 147 | 98,635 | 7 | 03:45:27 | 03:45:34 |
| synthesize | 1 | 7,571 | 549,960 | 67 | 03:45:36 | 03:46:43 |

- **claude-opus-5-5**: 3 agent · 62 calls · out 11,620 · in 124 · cache_read 8,740,348 · cache_create 468,736
- **claude-sonnet-5-5**: 4 agent · 13 calls · out 12,482 · in 26 · cache_read 1,068,084 · cache_create 480,844
- **claude-haiku-5-5**: 10 agent · 20 calls · out 11,551 · in 40 · cache_read 1,213,685 · cache_create 855,012

