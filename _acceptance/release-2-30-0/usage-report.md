### S4 round 1 — wf_25dbc502-b91 (24 agent, 37,507 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 8,572 | 6 | 100,779 | 45 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 7 | 4,965 | 14 | 299,134 | 38 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 6 | 4,926 | 12 | 245,392 | 35 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 6 | 3,695 | 12 | 239,973 | 32 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 2,998 | 18 | 285,204 | 1025 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,605 | 4 | 2,869 | 492 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 2,096 | 4 | 35,583 | 101 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 1,629 | 4 | 35,506 | 21 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,345 | 4 | 35,480 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 820 | 4 | 35,489 | 235 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 565 | 4 | 35,480 | 85 |
| machine:bash _acceptance/release-2-29-0/lop-chep | claude-haiku-5-5 | 2 | 439 | 4 | 35,511 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 375 | 4 | 2,869 | 355 |
| review:measurement | claude-opus-5-5 | 7 | 350 | 14 | 262,015 | 30 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 336 | 4 | 35,593 | 7 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 312 | 4 | 0 | 528 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 257 | 4 | 32,667 | 143 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 214 | 4 | 35,481 | 7 |
| review:conventions | claude-opus-5-5 | 13 | 195 | 26 | 581,559 | 44 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 178 | 4 | 2,869 | 511 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 35,536 | 76 |
| review:bugs | claude-opus-5-5 | 10 | 163 | 20 | 381,613 | 35 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 31,399 | 6 |
| machine:bash -c 'c=$(git show 6a9c0f9a:diagram-d | claude-haiku-5-5 | 2 | 145 | 4 | 35,620 | 6 |


wall: 3030s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 312 | 0 | 528 | 02:21:29 | 02:30:16 |
| machine | 15 | 14,177 | 681,757 | 2977 | 02:21:29 | 03:11:05 |
| judge | 3 | 13,586 | 784,499 | 40 | 02:21:29 | 02:22:08 |
| review | 3 | 708 | 1,225,187 | 44 | 02:21:29 | 02:22:13 |
| capture | 1 | 152 | 31,399 | 6 | 03:11:07 | 03:11:13 |
| synthesize | 1 | 8,572 | 100,779 | 45 | 03:11:14 | 03:11:59 |

- **claude-sonnet-5-5**: 6 agent · 26 calls · out 22,622 · in 52 · cache_read 916,677 · cache_create 393,467
- **claude-haiku-5-5**: 15 agent · 37 calls · out 14,177 · in 74 · cache_read 681,757 · cache_create 651,576
- **claude-opus-5-5**: 3 agent · 30 calls · out 708 · in 60 · cache_read 1,225,187 · cache_create 165,827

