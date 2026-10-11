### S4 round 1 — wf_c805c312-c9e (24 agent, 151,852 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| triage | claude-sonnet-5-5 | 2 | 34,691 | 4 | 94,803 | 210 |
| synthesize:report | claude-sonnet-5-5 | 13 | 23,977 | 26 | 1,788,280 | 242 |
| judge:E14d:operational-feasibility | claude-sonnet-5-5 | 2 | 20,284 | 4 | 116,267 | 137 |
| judge:E14d:spec-alignment | claude-sonnet-5-5 | 2 | 15,889 | 4 | 116,265 | 100 |
| judge:E14d:domain-correctness | claude-sonnet-5-5 | 2 | 13,467 | 4 | 81,373 | 84 |
| review:measurement | claude-opus-5-5 | 33 | 12,677 | 66 | 6,598,634 | 515 |
| review:conventions | claude-opus-5-5 | 48 | 5,017 | 96 | 10,573,172 | 446 |
| review:bugs | claude-opus-5-5 | 55 | 4,683 | 110 | 12,015,688 | 670 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 3,939 | 4 | 116,531 | 81 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,713 | 4 | 116,435 | 223 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 2,489 | 8 | 246,327 | 659 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,208 | 4 | 69,964 | 431 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,897 | 4 | 116,421 | 88 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,819 | 4 | 116,421 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,348 | 4 | 81,448 | 191 |
| machine:node tests/dieu-phoi/kiem-mod.mjs | claude-haiku-5-5 | 2 | 1,152 | 4 | 116,433 | 14 |
| machine:node tests/dieu-phoi/kiem-validate.mjs | claude-haiku-5-5 | 2 | 793 | 4 | 116,433 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 691 | 4 | 116,477 | 129 |
| machine:bash -c 'LB_CASES=LB1,LB2 node tests/plu | claude-haiku-5-5 | 2 | 634 | 4 | 116,462 | 7 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 540 | 4 | 116,422 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 509 | 4 | 116,477 | 297 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 167 | 4 | 85,046 | 48 |
| capture:provenance | claude-sonnet-5-5 | 2 | 145 | 4 | 80,227 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 116,477 | 76 |


wall: 2601s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 167 | 85,046 | 48 | 05:27:18 | 05:28:07 |
| machine | 14 | 20,855 | 1,678,728 | 2135 | 05:27:18 | 06:02:53 |
| judge | 3 | 49,640 | 313,905 | 139 | 05:27:18 | 05:29:38 |
| review | 3 | 22,377 | 29,187,494 | 671 | 05:27:18 | 05:38:29 |
| triage | 1 | 34,691 | 94,803 | 210 | 06:02:55 | 06:06:25 |
| capture | 1 | 145 | 80,227 | 7 | 06:06:27 | 06:06:34 |
| synthesize | 1 | 23,977 | 1,788,280 | 242 | 06:06:37 | 06:10:39 |

- **claude-sonnet-5-5**: 7 agent · 25 calls · out 108,620 · in 50 · cache_read 2,362,261 · cache_create 832,851
- **claude-opus-5-5**: 3 agent · 136 calls · out 22,377 · in 272 · cache_read 29,187,494 · cache_create 887,077
- **claude-haiku-5-5**: 14 agent · 30 calls · out 20,855 · in 60 · cache_read 1,678,728 · cache_create 867,338

