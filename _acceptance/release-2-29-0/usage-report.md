### S4 round 1 — wf_8450d2f6-fc1 (27 agent, 37,764 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 10,137 | 8 | 378,473 | 74 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 12 | 3,666 | 24 | 1,316,300 | 74 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 7 | 3,065 | 14 | 770,762 | 55 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 7 | 2,662 | 14 | 812,016 | 111 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,489 | 4 | 34,982 | 374 |
| triage | claude-sonnet-5-5 | 2 | 1,934 | 4 | 101,543 | 20 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,723 | 4 | 134,540 | 182 |
| review:bugs | claude-opus-5-5 | 15 | 1,693 | 30 | 1,822,756 | 108 |
| review:measurement | claude-opus-5-5 | 9 | 1,526 | 18 | 1,052,677 | 109 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,316 | 4 | 134,629 | 67 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,024 | 4 | 134,526 | 83 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 947 | 4 | 134,535 | 150 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 859 | 4 | 134,552 | 21 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 589 | 4 | 134,671 | 10 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 505 | 6 | 141,427 | 623 |
| machine:bash -c 'c=$(git show 72eb55f3:diagram-d | claude-haiku-5-5 | 2 | 486 | 4 | 134,661 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 472 | 4 | 99,600 | 97 |
| machine:bash _acceptance/release-2-29-0/so-ban-v | claude-haiku-5-5 | 2 | 424 | 4 | 134,545 | 8 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 394 | 4 | 0 | 541 |
| review:conventions | claude-opus-5-5 | 11 | 393 | 22 | 1,230,613 | 79 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 393 | 4 | 134,527 | 8 |
| machine:bash _acceptance/release-2-29-0/lop-chep | claude-haiku-5-5 | 2 | 390 | 4 | 134,555 | 7 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 236 | 4 | 134,526 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 98,333 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 146 | 4 | 34,982 | 371 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 134,582 | 71 |
| machine:LS_CASES=LS-13 node tests/scripts/luat-s | claude-haiku-5-5 | 2 | 25 | 4 | 134,552 | 8 |


wall: 2118s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 394 | 0 | 541 | 09:50:44 | 09:59:44 |
| machine | 17 | 12,147 | 2,060,392 | 2009 | 09:50:44 | 10:24:13 |
| judge | 3 | 9,393 | 2,899,078 | 114 | 09:50:44 | 09:52:38 |
| review | 3 | 3,612 | 4,106,046 | 121 | 09:50:44 | 09:52:45 |
| triage | 1 | 1,934 | 101,543 | 20 | 10:24:15 | 10:24:35 |
| capture | 1 | 147 | 98,333 | 8 | 10:24:37 | 10:24:45 |
| synthesize | 1 | 10,137 | 378,473 | 74 | 10:24:48 | 10:26:02 |

- **claude-sonnet-5-5**: 7 agent · 36 calls · out 22,005 · in 72 · cache_read 3,477,427 · cache_create 963,201
- **claude-haiku-5-5**: 17 agent · 35 calls · out 12,147 · in 70 · cache_read 2,060,392 · cache_create 1,555,410
- **claude-opus-5-5**: 3 agent · 35 calls · out 3,612 · in 70 · cache_read 4,106,046 · cache_create 367,437

