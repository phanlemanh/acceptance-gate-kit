### S4 round 1 — wf_8aab05dd-bda (25 agent, 52,700 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 10,738 | 4 | 52,090 | 62 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 8 | 7,414 | 16 | 402,423 | 56 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 8 | 7,368 | 16 | 432,790 | 52 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 8 | 5,854 | 16 | 439,399 | 49 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 2,476 | 8 | 82,229 | 649 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 8 | 2,083 | 16 | 208,495 | 2435 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,920 | 4 | 2,869 | 2019 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,857 | 4 | 2,869 | 512 |
| triage | claude-sonnet-5-5 | 2 | 1,723 | 4 | 36,848 | 15 |
| review:measurement | claude-opus-5-5 | 8 | 1,709 | 16 | 332,670 | 72 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,555 | 4 | 2,869 | 501 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,527 | 4 | 37,635 | 12 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 1,308 | 4 | 37,661 | 23 |
| machine:bash -c 'd=$(git diff --name-only f06344 | claude-haiku-5-5 | 2 | 1,096 | 4 | 37,917 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 858 | 4 | 37,691 | 104 |
| review:bugs | claude-opus-5-5 | 12 | 552 | 24 | 593,040 | 176 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 516 | 4 | 37,644 | 187 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 452 | 4 | 37,804 | 7 |
| machine:bash _acceptance/release-2-29-0/lop-chep | claude-haiku-5-5 | 2 | 393 | 4 | 37,661 | 8 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 312 | 4 | 0 | 531 |
| review:conventions | claude-opus-5-5 | 13 | 308 | 26 | 604,135 | 80 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 213 | 4 | 37,636 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 37,691 | 87 |
| capture:provenance | claude-sonnet-5-5 | 2 | 149 | 4 | 33,554 | 6 |
| machine:bash -c 'c=$(git show f0634454:diagram-d | claude-haiku-5-5 | 2 | 146 | 4 | 37,761 | 7 |


wall: 6647s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 312 | 0 | 531 | 04:00:39 | 04:09:30 |
| machine | 15 | 16,573 | 676,432 | 6557 | 04:00:39 | 05:49:56 |
| judge | 3 | 20,636 | 1,274,612 | 57 | 04:00:39 | 04:01:37 |
| review | 3 | 2,569 | 1,529,845 | 179 | 04:00:39 | 04:03:38 |
| triage | 1 | 1,723 | 36,848 | 15 | 05:49:58 | 05:50:14 |
| capture | 1 | 149 | 33,554 | 6 | 05:50:16 | 05:50:22 |
| synthesize | 1 | 10,738 | 52,090 | 62 | 05:50:24 | 05:51:26 |

- **claude-sonnet-5-5**: 7 agent · 32 calls · out 33,558 · in 64 · cache_read 1,397,104 · cache_create 523,015
- **claude-haiku-5-5**: 15 agent · 38 calls · out 16,573 · in 76 · cache_read 676,432 · cache_create 772,090
- **claude-opus-5-5**: 3 agent · 33 calls · out 2,569 · in 66 · cache_read 1,529,845 · cache_create 190,305

### S4 round 2 — wf_0c6b0fcd-ffb (24 agent, 41,020 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 11,349 | 12 | 294,109 | 73 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 8 | 6,476 | 16 | 416,261 | 52 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 7 | 6,328 | 14 | 405,455 | 49 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 8 | 5,900 | 16 | 403,301 | 46 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,305 | 4 | 2,869 | 613 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,541 | 4 | 2,869 | 515 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,130 | 4 | 2,869 | 498 |
| machine:bash -c 'd=$(git diff --name-only f06344 | claude-haiku-5-5 | 2 | 998 | 4 | 37,995 | 10 |
| review:bugs | claude-opus-5-5 | 8 | 993 | 16 | 345,796 | 49 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 566 | 4 | 37,882 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 467 | 4 | 37,714 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 456 | 4 | 34,900 | 103 |
| machine:bash _acceptance/release-2-29-0/lop-chep | claude-haiku-5-5 | 2 | 391 | 4 | 37,739 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 7 | 343 | 14 | 257,405 | 509 |
| review:measurement | claude-opus-5-5 | 7 | 308 | 14 | 280,076 | 47 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 308 | 4 | 0 | 532 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 264 | 4 | 37,722 | 179 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 245 | 4 | 37,713 | 81 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 171 | 4 | 37,769 | 87 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 33,632 | 6 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 140 | 4 | 37,713 | 9 |
| review:conventions | claude-opus-5-5 | 9 | 136 | 18 | 370,982 | 58 |
| machine:bash -c 'c=$(git show f0634454:diagram-d | claude-haiku-5-5 | 2 | 30 | 4 | 37,839 | 6 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 27 | 4 | 37,739 | 21 |


wall: 2727s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 308 | 0 | 532 | 06:10:17 | 06:19:09 |
| machine | 15 | 9,074 | 678,737 | 2644 | 06:10:17 | 06:54:21 |
| judge | 3 | 18,704 | 1,225,017 | 52 | 06:10:17 | 06:11:09 |
| review | 3 | 1,437 | 996,854 | 58 | 06:10:17 | 06:11:15 |
| capture | 1 | 148 | 33,632 | 6 | 06:54:23 | 06:54:29 |
| synthesize | 1 | 11,349 | 294,109 | 73 | 06:54:31 | 06:55:44 |

- **claude-sonnet-5-5**: 6 agent · 33 calls · out 30,509 · in 66 · cache_read 1,552,758 · cache_create 489,877
- **claude-haiku-5-5**: 15 agent · 35 calls · out 9,074 · in 70 · cache_read 678,737 · cache_create 667,879
- **claude-opus-5-5**: 3 agent · 24 calls · out 1,437 · in 48 · cache_read 996,854 · cache_create 173,078

