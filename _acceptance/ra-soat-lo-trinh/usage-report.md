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

