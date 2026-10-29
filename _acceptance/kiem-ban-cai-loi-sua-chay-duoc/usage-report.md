### S4 round 1 — wf_1c6de649-35c (27 agent, 131,795 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 13 | 18,179 | 26 | 968,002 | 228 |
| review:measurement | claude-opus-5-5 | 12 | 17,419 | 24 | 831,274 | 231 |
| review:bugs | claude-opus-5-5 | 13 | 16,756 | 26 | 927,113 | 221 |
| review:measurement | claude-opus-5-5 | 7 | 12,046 | 14 | 376,676 | 141 |
| review:conventions | claude-opus-5-5 | 9 | 11,099 | 18 | 523,270 | 133 |
| synthesize:report | claude-sonnet-5-5 | 2 | 10,987 | 4 | 54,805 | 62 |
| review:conventions | claude-opus-5-5 | 6 | 6,759 | 12 | 285,177 | 96 |
| triage | claude-sonnet-5-5 | 2 | 6,441 | 4 | 40,781 | 46 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,566 | 16 | 247,741 | 972 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,175 | 4 | 0 | 557 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 3,085 | 4 | 38,050 | 21 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,266 | 4 | 3,140 | 361 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,179 | 4 | 38,393 | 90 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs | claude-haiku-5-5 | 2 | 1,912 | 4 | 38,152 | 241 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs | claude-haiku-5-5 | 2 | 1,813 | 4 | 38,409 | 197 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,759 | 4 | 38,393 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,565 | 4 | 35,005 | 189 |
| triage | claude-sonnet-5-5 | 2 | 1,321 | 4 | 40,614 | 11 |
| machine:node tests/scripts/kiem-ban-cai-loi-sua. | claude-haiku-5-5 | 2 | 1,096 | 4 | 38,157 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,005 | 4 | 38,449 | 110 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 990 | 4 | 38,419 | 9 |
| machine:node tests/scripts/kiem-ban-cai-loi-sua. | claude-haiku-5-5 | 2 | 953 | 4 | 38,414 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 914 | 4 | 3,140 | 572 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 823 | 4 | 38,449 | 79 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 751 | 4 | 38,394 | 10 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 1 | 489 | 2 | 3,140 | 38 |
| capture:provenance | claude-sonnet-5-5 | 2 | 447 | 4 | 34,046 | 6 |


wall: 4106s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,085 | 38,050 | 21 | 03:08:50 | 03:09:11 |
| machine | 16 | 27,256 | 675,795 | 3972 | 03:08:50 | 04:15:02 |
| review | 6 | 82,258 | 3,911,512 | 2389 | 03:08:50 | 03:48:39 |
| triage | 2 | 7,762 | 81,395 | 59 | 04:15:04 | 04:16:03 |
| capture | 1 | 447 | 34,046 | 6 | 04:16:05 | 04:16:11 |
| synthesize | 1 | 10,987 | 54,805 | 62 | 04:16:13 | 04:17:16 |

- **claude-opus-5-5**: 6 agent · 60 calls · out 82,258 · in 120 · cache_read 3,911,512 · cache_create 535,418
- **claude-sonnet-5-5**: 5 agent · 10 calls · out 22,281 · in 20 · cache_read 208,296 · cache_create 239,636
- **claude-haiku-5-5**: 16 agent · 37 calls · out 27,256 · in 74 · cache_read 675,795 · cache_create 728,783

### S4 lượt 2 — wf_027303ee-283 (20 agent, 46,801 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 8,517 | 8 | 170,987 | 53 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,988 | 16 | 255,049 | 862 |
| review:bugs | claude-opus-5-5 | 9 | 5,394 | 18 | 371,588 | 80 |
| review:conventions | claude-opus-5-5 | 6 | 3,927 | 12 | 209,711 | 51 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 3,079 | 4 | 38,352 | 21 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,022 | 4 | 3,140 | 530 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,231 | 4 | 3,140 | 341 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,005 | 4 | 38,438 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,697 | 4 | 38,494 | 102 |
| triage | claude-sonnet-5-5 | 2 | 1,563 | 4 | 37,759 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,438 | 4 | 35,307 | 175 |
| review:measurement | claude-opus-5-5 | 5 | 1,399 | 10 | 165,717 | 36 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 1,012 | 4 | 38,464 | 7 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs | claude-haiku-5-5 | 2 | 1,004 | 4 | 38,454 | 218 |
| machine:node tests/scripts/kiem-ban-cai-loi-sua. | claude-haiku-5-5 | 2 | 923 | 4 | 38,459 | 20 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 858 | 4 | 3,140 | 525 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 853 | 4 | 38,439 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 826 | 4 | 38,494 | 71 |
| capture:provenance | claude-sonnet-5-5 | 2 | 533 | 4 | 34,091 | 6 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 532 | 4 | 38,438 | 84 |


wall: 2822s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,079 | 38,352 | 21 | 06:07:44 | 06:08:05 |
| machine | 13 | 22,389 | 607,456 | 2742 | 06:07:44 | 06:53:25 |
| review | 3 | 10,720 | 747,016 | 82 | 06:07:44 | 06:09:06 |
| triage | 1 | 1,563 | 37,759 | 14 | 06:53:29 | 06:53:43 |
| capture | 1 | 533 | 34,091 | 6 | 06:53:45 | 06:53:51 |
| synthesize | 1 | 8,517 | 170,987 | 53 | 06:53:53 | 06:54:46 |

- **claude-sonnet-5-5**: 4 agent · 10 calls · out 13,692 · in 20 · cache_read 281,189 · cache_create 193,541
- **claude-haiku-5-5**: 13 agent · 32 calls · out 22,389 · in 64 · cache_read 607,456 · cache_create 626,566
- **claude-opus-5-5**: 3 agent · 20 calls · out 10,720 · in 40 · cache_read 747,016 · cache_create 148,331

### S4 lượt 3 — wf_0d063b36-df4 (18 agent, 65,045 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 12 | 17,018 | 24 | 823,217 | 220 |
| review:measurement | claude-opus-5-5 | 7 | 13,026 | 14 | 372,814 | 150 |
| synthesize:report | claude-sonnet-5-5 | 4 | 10,235 | 8 | 192,528 | 68 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 5,371 | 14 | 205,512 | 896 |
| triage | claude-sonnet-5-5 | 2 | 3,706 | 4 | 39,065 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,944 | 4 | 3,140 | 548 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,015 | 4 | 38,422 | 90 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,783 | 4 | 38,422 | 15 |
| review:conventions | claude-opus-5-5 | 5 | 1,399 | 10 | 160,626 | 31 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,348 | 4 | 35,291 | 166 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,140 | 4 | 38,478 | 109 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 873 | 4 | 38,478 | 79 |
| refute:kiem-ban-cai-loi-sua.test.mjs | claude-sonnet-5-5 | 2 | 861 | 4 | 34,347 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 839 | 4 | 3,140 | 574 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 687 | 4 | 3,140 | 362 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 645 | 4 | 38,423 | 7 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 638 | 4 | 38,448 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 517 | 4 | 34,075 | 7 |


wall: 3011s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 11 | 18,283 | 480,894 | 2877 | 09:26:05 | 10:14:02 |
| review | 3 | 31,443 | 1,356,657 | 223 | 09:26:05 | 09:29:48 |
| triage | 1 | 3,706 | 39,065 | 30 | 10:14:04 | 10:14:33 |
| refute | 1 | 861 | 34,347 | 13 | 10:14:43 | 10:14:56 |
| capture | 1 | 517 | 34,075 | 7 | 10:14:58 | 10:15:05 |
| synthesize | 1 | 10,235 | 192,528 | 68 | 10:15:07 | 10:16:16 |

- **claude-opus-5-5**: 3 agent · 24 calls · out 31,443 · in 48 · cache_read 1,356,657 · cache_create 227,239
- **claude-sonnet-5-5**: 4 agent · 10 calls · out 15,319 · in 20 · cache_read 300,015 · cache_create 201,160
- **claude-haiku-5-5**: 11 agent · 27 calls · out 18,283 · in 54 · cache_read 480,894 · cache_create 549,743

