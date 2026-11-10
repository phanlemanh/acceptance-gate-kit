### S4 round 1 — wf_ad8bafb2-925 (26 agent, 105,480 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 11 | 14,790 | 22 | 456,798 | 143 |
| review:measurement | claude-opus-5-5 | 7 | 11,447 | 14 | 187,199 | 111 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,272 | 6 | 25,474 | 551 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 10 | 9,474 | 20 | 174,699 | 824 |
| review:conventions | claude-opus-5-5 | 6 | 8,851 | 12 | 204,187 | 87 |
| synthesize:report | claude-sonnet-5-5 | 2 | 8,500 | 4 | 24,304 | 49 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 14 | 7,530 | 28 | 215,449 | 1419 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 4 | 5,318 | 8 | 81,410 | 45 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 5 | 4,391 | 10 | 121,889 | 38 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 4 | 4,170 | 8 | 72,426 | 44 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,438 | 6 | 31,928 | 30 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 3 | 3,115 | 8 | 28,897 | 102 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,642 | 4 | 6,610 | 554 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,724 | 4 | 6,610 | 537 |
| triage | claude-sonnet-5-5 | 2 | 1,468 | 4 | 12,559 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 911 | 4 | 14,080 | 291 |
| refute:config.yaml | claude-sonnet-5-5 | 3 | 826 | 6 | 26,714 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 797 | 4 | 14,127 | 167 |
| machine:bash -c 'c=$(git show c8fa5a65:diagram-d | claude-haiku-5-5 | 2 | 754 | 4 | 14,206 | 8 |
| machine:bash -c 'd=$(git diff --name-only c8fa5a | claude-haiku-5-5 | 2 | 694 | 4 | 14,228 | 7 |
| machine:bash _acceptance/release-2-38-0/lop-chep | claude-haiku-5-5 | 2 | 694 | 4 | 14,100 | 10 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 640 | 4 | 14,071 | 8 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 625 | 4 | 14,124 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 522 | 4 | 14,127 | 103 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 449 | 4 | 14,072 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 438 | 4 | 9,548 | 13 |


wall: 4127s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 11,272 | 25,474 | 551 | 09:34:43 | 09:43:54 |
| machine | 15 | 34,009 | 591,328 | 4040 | 09:34:43 | 10:42:03 |
| judge | 3 | 13,879 | 275,725 | 47 | 09:34:43 | 09:35:30 |
| review | 3 | 35,088 | 848,184 | 144 | 09:34:43 | 09:37:07 |
| triage | 1 | 1,468 | 12,559 | 14 | 10:42:03 | 10:42:18 |
| refute | 1 | 826 | 26,714 | 11 | 10:42:18 | 10:42:29 |
| capture | 1 | 438 | 9,548 | 13 | 10:42:29 | 10:42:42 |
| synthesize | 1 | 8,500 | 24,304 | 49 | 10:42:42 | 10:43:30 |

- **claude-opus-5-5**: 3 agent · 24 calls · out 35,088 · in 48 · cache_read 848,184 · cache_create 204,681
- **claude-sonnet-5-5**: 8 agent · 25 calls · out 36,383 · in 50 · cache_read 374,324 · cache_create 289,431
- **claude-haiku-5-5**: 15 agent · 52 calls · out 34,009 · in 106 · cache_read 591,328 · cache_create 212,550

