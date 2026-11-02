### S4 round 1 — wf_40062976-b19 (19 agent, 54,389 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 6 | 8,867 | 12 | 353,078 | 129 |
| review:conventions | claude-opus-5-5 | 15 | 7,918 | 30 | 1,117,316 | 203 |
| synthesize:report | claude-sonnet-5-5 | 4 | 6,878 | 8 | 201,128 | 54 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 5,290 | 18 | 377,207 | 1044 |
| review:bugs | claude-opus-5-5 | 13 | 4,577 | 26 | 889,544 | 156 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,165 | 4 | 3,140 | 379 |
| triage | claude-sonnet-5-5 | 2 | 2,844 | 4 | 47,324 | 26 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 2,773 | 6 | 103,471 | 38 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 2,770 | 10 | 161,603 | 781 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,602 | 4 | 47,363 | 96 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,548 | 4 | 44,232 | 196 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 1,452 | 6 | 54,443 | 656 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 914 | 4 | 47,419 | 102 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 904 | 4 | 47,419 | 134 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 728 | 4 | 47,389 | 8 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 695 | 4 | 47,363 | 12 |
| machine:node tests/scripts/khuon-doc-ban-do-that | claude-haiku-5-5 | 2 | 611 | 4 | 47,379 | 16 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 539 | 4 | 47,364 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 314 | 4 | 42,989 | 8 |


wall: 3532s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,773 | 103,471 | 38 | 08:28:28 | 08:29:07 |
| machine | 12 | 20,218 | 972,321 | 3437 | 08:28:28 | 09:25:45 |
| review | 3 | 21,362 | 2,359,938 | 203 | 08:28:28 | 08:31:52 |
| triage | 1 | 2,844 | 47,324 | 26 | 09:25:47 | 09:26:14 |
| capture | 1 | 314 | 42,989 | 8 | 09:26:16 | 09:26:23 |
| synthesize | 1 | 6,878 | 201,128 | 55 | 09:26:25 | 09:27:20 |

- **claude-opus-5-5**: 3 agent · 34 calls · out 21,362 · in 68 · cache_read 2,359,938 · cache_create 272,901
- **claude-sonnet-5-5**: 4 agent · 11 calls · out 12,809 · in 22 · cache_read 394,912 · cache_create 235,814
- **claude-haiku-5-5**: 12 agent · 35 calls · out 20,218 · in 70 · cache_read 972,321 · cache_create 763,986

