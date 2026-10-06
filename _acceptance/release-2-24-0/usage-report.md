### S4 round 1 — wf_e509cbf9-62b (19 agent, 19,086 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 3,358 | 8 | 294,693 | 35 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,455 | 18 | 90,116 | 261 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 2,055 | 18 | 90,103 | 35 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,707 | 18 | 29,029 | 377 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,528 | 18 | 90,116 | 145 |
| baseline:diffBase | claude-sonnet-5-5 | 11 | 1,405 | 22 | 702,640 | 1225 |
| review:measurement | claude-opus-5-5 | 12 | 1,351 | 24 | 1,033,228 | 215 |
| triage | claude-sonnet-5-5 | 2 | 1,122 | 4 | 82,005 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 727 | 18 | 90,111 | 129 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 521 | 18 | 61,123 | 87 |
| machine:bash scripts/rel-cua-so.sh 8344fa92 eval | claude-haiku-4-5-20251001 | 2 | 480 | 18 | 90,140 | 11 |
| machine:bash -c 'c=$(git show 8344fa92:diagram-d | claude-haiku-4-5-20251001 | 2 | 452 | 18 | 90,197 | 16 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 437 | 18 | 90,152 | 256 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 422 | 34 | 222,250 | 22 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 378 | 18 | 90,110 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 280 | 18 | 90,152 | 72 |
| review:conventions | claude-opus-5-5 | 11 | 158 | 22 | 914,497 | 51 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 79,813 | 7 |
| review:bugs | claude-opus-5-5 | 7 | 100 | 14 | 560,438 | 101 |


wall: 1547s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,405 | 702,640 | 1225 | 14:55:36 | 15:16:01 |
| machine | 12 | 11,442 | 1,123,599 | 1486 | 14:55:36 | 15:20:22 |
| review | 3 | 1,609 | 2,508,163 | 217 | 14:55:36 | 14:59:13 |
| triage | 1 | 1,122 | 82,005 | 12 | 15:20:25 | 15:20:37 |
| capture | 1 | 150 | 79,813 | 7 | 15:20:39 | 15:20:46 |
| synthesize | 1 | 3,358 | 294,693 | 35 | 15:20:48 | 15:21:23 |

- **claude-sonnet-5-5**: 4 agent · 19 calls · out 6,035 · in 38 · cache_read 1,159,151 · cache_create 545,984
- **claude-haiku-4-5-20251001**: 12 agent · 26 calls · out 11,442 · in 232 · cache_read 1,123,599 · cache_create 528,589
- **claude-opus-5-5**: 3 agent · 30 calls · out 1,609 · in 60 · cache_read 2,508,163 · cache_create 223,569

