### S4 round 1 — wf_d1be3ac6-b19 (24 agent, 34,868 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 6,063 | 8 | 366,153 | 62 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 8 | 3,264 | 16 | 790,972 | 54 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 7 | 3,207 | 14 | 729,931 | 44 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,654 | 4 | 34,982 | 535 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,313 | 4 | 134,104 | 152 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,290 | 4 | 34,982 | 353 |
| triage | claude-sonnet-5-5 | 3 | 2,009 | 6 | 211,283 | 18 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,816 | 4 | 134,193 | 64 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,703 | 4 | 134,090 | 85 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,608 | 4 | 134,090 | 13 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 5 | 1,376 | 10 | 506,574 | 44 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,154 | 4 | 134,099 | 134 |
| review:bugs | claude-opus-5-5 | 9 | 1,147 | 18 | 934,588 | 55 |
| review:measurement | claude-opus-5-5 | 8 | 966 | 16 | 876,370 | 72 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 587 | 4 | 99,164 | 86 |
| capture:provenance | claude-sonnet-5-5 | 2 | 536 | 4 | 97,895 | 11 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 522 | 4 | 134,220 | 8 |
| machine:bash -c 'c=$(git show a1e2e0b9:diagram-d | claude-haiku-5-5 | 2 | 453 | 4 | 134,228 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 321 | 4 | 34,982 | 326 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 310 | 4 | 0 | 532 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 186 | 4 | 134,091 | 5 |
| machine:bash _acceptance/release-2-28-0/lop-chep | claude-haiku-5-5 | 2 | 181 | 4 | 134,133 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 124 | 4 | 134,146 | 66 |
| review:conventions | claude-opus-5-5 | 10 | 78 | 20 | 1,034,841 | 50 |


wall: 1874s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 310 | 0 | 532 | 19:02:43 | 19:11:35 |
| machine | 14 | 15,912 | 1,545,504 | 1776 | 19:02:43 | 19:32:19 |
| judge | 3 | 7,847 | 2,027,477 | 54 | 19:02:43 | 19:03:37 |
| review | 3 | 2,191 | 2,845,799 | 73 | 19:02:43 | 19:03:57 |
| triage | 1 | 2,009 | 211,283 | 18 | 19:32:21 | 19:32:39 |
| capture | 1 | 536 | 97,895 | 11 | 19:32:42 | 19:32:53 |
| synthesize | 1 | 6,063 | 366,153 | 62 | 19:32:55 | 19:33:57 |

- **claude-sonnet-5-5**: 7 agent · 31 calls · out 16,765 · in 62 · cache_read 2,702,808 · cache_create 927,485
- **claude-haiku-5-5**: 14 agent · 28 calls · out 15,912 · in 56 · cache_read 1,545,504 · cache_create 1,333,401
- **claude-opus-5-5**: 3 agent · 27 calls · out 2,191 · in 54 · cache_read 2,845,799 · cache_create 322,421

