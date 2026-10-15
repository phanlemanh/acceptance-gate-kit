### S4 round 1 — wf_9f857dc7-d45 (20 agent, 38,764 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 9,139 | 4 | 53,361 | 51 |
| triage | claude-sonnet-5-5 | 2 | 5,504 | 4 | 39,532 | 40 |
| review:measurement | claude-opus-5-5 | 9 | 3,056 | 18 | 591,950 | 130 |
| review:bugs | claude-opus-5-5 | 22 | 2,752 | 44 | 1,861,931 | 180 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,648 | 4 | 2,869 | 602 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,491 | 4 | 2,869 | 467 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,405 | 4 | 35,562 | 214 |
| review:conventions | claude-opus-5-5 | 28 | 2,173 | 56 | 2,549,413 | 173 |
| machine:node tests/scripts/ra-soat-lo-trinh.test | claude-haiku-5-5 | 2 | 1,907 | 4 | 35,564 | 17 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,499 | 4 | 35,548 | 12 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,145 | 4 | 35,548 | 82 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 955 | 4 | 35,557 | 147 |
| machine:node tests/scripts/ra-soat-lo-trinh-crm. | claude-haiku-5-5 | 2 | 631 | 4 | 35,567 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 529 | 4 | 32,735 | 89 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 512 | 4 | 35,574 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 439 | 4 | 35,604 | 77 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 415 | 4 | 2,869 | 428 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 215 | 4 | 35,549 | 6 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 199 | 4 | 35,812 | 106 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 31,462 | 5 |


wall: 2247s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 199 | 35,812 | 106 | 15:23:05 | 15:24:51 |
| machine | 13 | 15,791 | 361,415 | 2147 | 15:23:05 | 15:58:52 |
| review | 3 | 7,981 | 5,003,294 | 182 | 15:23:05 | 15:26:07 |
| triage | 1 | 5,504 | 39,532 | 40 | 15:58:53 | 15:59:33 |
| capture | 1 | 150 | 31,462 | 5 | 15:59:35 | 15:59:40 |
| synthesize | 1 | 9,139 | 53,361 | 51 | 15:59:41 | 16:00:32 |

- **claude-sonnet-5-5**: 4 agent · 8 calls · out 14,992 · in 16 · cache_read 160,167 · cache_create 189,622
- **claude-opus-5-5**: 3 agent · 59 calls · out 7,981 · in 118 · cache_read 5,003,294 · cache_create 343,502
- **claude-haiku-5-5**: 13 agent · 26 calls · out 15,791 · in 52 · cache_read 361,415 · cache_create 537,986

### S4 round 2 — wf_d87160c0-694 (18 agent, 35,002 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 7 | 10,649 | 14 | 381,322 | 77 |
| review:conventions | claude-opus-5-5 | 7 | 3,319 | 14 | 275,872 | 93 |
| review:bugs | claude-opus-5-5 | 18 | 2,813 | 36 | 1,083,361 | 162 |
| triage | claude-sonnet-5-5 | 2 | 2,709 | 4 | 36,794 | 21 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,680 | 4 | 2,869 | 425 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,527 | 4 | 35,517 | 202 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,526 | 4 | 2,869 | 604 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,764 | 4 | 35,503 | 85 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,627 | 4 | 35,503 | 12 |
| review:measurement | claude-opus-5-5 | 8 | 1,245 | 16 | 325,578 | 89 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,041 | 4 | 32,643 | 140 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 632 | 4 | 35,559 | 80 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 448 | 4 | 35,529 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 434 | 4 | 35,559 | 67 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 215 | 4 | 35,504 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 194 | 4 | 2,869 | 378 |
| capture:provenance | claude-sonnet-5-5 | 2 | 153 | 4 | 31,417 | 7 |
| machine:node tests/scripts/ra-soat-lo-trinh.test | claude-haiku-5-5 | 2 | 26 | 4 | 35,519 | 17 |


wall: 2130s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 12 | 14,114 | 325,443 | 2020 | 17:28:55 | 18:02:35 |
| review | 3 | 7,377 | 1,684,811 | 163 | 17:28:55 | 17:31:38 |
| triage | 1 | 2,709 | 36,794 | 21 | 18:02:36 | 18:02:57 |
| capture | 1 | 153 | 31,417 | 7 | 18:02:59 | 18:03:06 |
| synthesize | 1 | 10,649 | 381,322 | 77 | 18:03:07 | 18:04:25 |

- **claude-sonnet-5-5**: 3 agent · 11 calls · out 13,511 · in 22 · cache_read 449,533 · cache_create 150,870
- **claude-opus-5-5**: 3 agent · 33 calls · out 7,377 · in 66 · cache_read 1,684,811 · cache_create 196,652
- **claude-haiku-5-5**: 12 agent · 24 calls · out 14,114 · in 48 · cache_read 325,443 · cache_create 504,043

### S4 round 3 — wf_ab620468-c23 (20 agent, 35,338 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 10,405 | 12 | 313,681 | 71 |
| review:measurement | claude-opus-5-5 | 9 | 4,457 | 18 | 504,094 | 132 |
| review:conventions | claude-opus-5-5 | 9 | 3,184 | 18 | 425,776 | 78 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,751 | 4 | 2,869 | 605 |
| triage | claude-sonnet-5-5 | 2 | 2,484 | 4 | 36,174 | 20 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,419 | 4 | 35,718 | 201 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,291 | 4 | 2,869 | 429 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,624 | 4 | 35,704 | 85 |
| review:bugs | claude-opus-5-5 | 16 | 1,620 | 32 | 904,072 | 272 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,098 | 4 | 32,844 | 144 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 718 | 4 | 35,760 | 91 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 398 | 4 | 35,760 | 72 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 391 | 4 | 35,730 | 6 |
| machine:node tests/scripts/ra-soat-lo-trinh-crm. | claude-haiku-5-5 | 2 | 330 | 4 | 35,723 | 10 |
| machine:node tests/scripts/ra-soat-lo-trinh.test | claude-haiku-5-5 | 2 | 256 | 4 | 35,720 | 16 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 215 | 4 | 35,705 | 5 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 188 | 4 | 35,704 | 8 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 188 | 4 | 35,389 | 19 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 174 | 4 | 2,869 | 431 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 31,618 | 6 |


wall: 2191s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 188 | 35,389 | 19 | 23:36:59 | 23:37:17 |
| machine | 13 | 12,853 | 362,975 | 2091 | 23:36:59 | 00:11:49 |
| review | 3 | 9,261 | 1,833,942 | 273 | 23:36:59 | 23:41:32 |
| triage | 1 | 2,484 | 36,174 | 20 | 00:11:51 | 00:12:11 |
| capture | 1 | 147 | 31,618 | 6 | 00:12:12 | 00:12:18 |
| synthesize | 1 | 10,405 | 313,681 | 71 | 00:12:19 | 00:13:30 |

- **claude-sonnet-5-5**: 4 agent · 12 calls · out 13,224 · in 24 · cache_read 416,862 · cache_create 194,191
- **claude-opus-5-5**: 3 agent · 34 calls · out 9,261 · in 68 · cache_read 1,833,942 · cache_create 249,597
- **claude-haiku-5-5**: 13 agent · 26 calls · out 12,853 · in 52 · cache_read 362,975 · cache_create 541,910

