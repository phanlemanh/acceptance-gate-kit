### S4 round 1 — wf_cb4bf090-ebf (27 agent, 115,620 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E9:domain-correctness | claude-sonnet-5-5 | 7 | 13,990 | 14 | 508,777 | 95 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 10 | 13,150 | 20 | 756,748 | 96 |
| synthesize:report | claude-sonnet-5-5 | 3 | 12,285 | 6 | 112,345 | 75 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 11 | 11,948 | 22 | 763,515 | 98 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,773 | 6 | 47,474 | 539 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 9 | 9,565 | 18 | 362,114 | 649 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 5 | 5,309 | 10 | 170,022 | 246 |
| review:conventions | claude-opus-5-5 | 12 | 4,322 | 24 | 561,105 | 47 |
| review:bugs | claude-opus-5-5 | 11 | 4,135 | 22 | 494,720 | 204 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 4,124 | 6 | 83,070 | 31 |
| review:measurement | claude-opus-5-5 | 7 | 4,092 | 14 | 288,912 | 45 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 3,608 | 14 | 211,237 | 853 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,416 | 4 | 3,140 | 601 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,097 | 4 | 38,842 | 94 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,079 | 4 | 35,702 | 2869 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,632 | 4 | 38,851 | 168 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 1,090 | 4 | 38,981 | 7 |
| machine:bash -c 'd=$(git diff --name-only 979620 | claude-haiku-5-5 | 2 | 1,087 | 4 | 38,941 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,069 | 4 | 38,898 | 83 |
| machine:bash _acceptance/release-2-29-0/lop-chep | claude-haiku-5-5 | 2 | 1,060 | 4 | 38,869 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,035 | 4 | 35,758 | 159 |
| machine:bash -c 'c=$(git show 979620ae:diagram-d | claude-haiku-5-5 | 2 | 1,025 | 4 | 38,970 | 7 |
| triage | claude-sonnet-5-5 | 2 | 961 | 4 | 37,033 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 946 | 4 | 38,843 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 436 | 4 | 34,490 | 9 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 1 | 386 | 2 | 3,140 | 2334 |
| machine:bash tests/scripts/run-tests.sh --manh m | <synthetic> | 1 | 0 | 0 | 0 | 2334 |


wall: 7946s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 11,773 | 47,474 | 539 | 08:12:20 | 08:21:19 |
| machine | 16 | 38,528 | 1,215,378 | 7848 | 08:12:20 | 10:23:08 |
| judge | 3 | 39,088 | 2,029,040 | 100 | 08:12:20 | 08:14:00 |
| review | 3 | 12,549 | 1,344,737 | 205 | 08:12:20 | 08:15:45 |
| triage | 1 | 961 | 37,033 | 14 | 10:23:08 | 10:23:22 |
| capture | 1 | 436 | 34,490 | 9 | 10:23:22 | 10:23:31 |
| synthesize | 1 | 12,285 | 112,345 | 75 | 10:23:31 | 10:24:46 |

- **claude-sonnet-5-5**: 7 agent · 38 calls · out 64,543 · in 76 · cache_read 2,260,382 · cache_create 607,690
- **claude-haiku-5-5**: 16 agent · 47 calls · out 38,528 · in 94 · cache_read 1,215,378 · cache_create 690,399
- **claude-opus-5-5**: 3 agent · 30 calls · out 12,549 · in 60 · cache_read 1,344,737 · cache_create 179,508
- **<synthetic>**: 1 agent · 1 calls · out 0 · in 0 · cache_read 0 · cache_create 0

