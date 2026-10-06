### S4 round 1 — wf_cf35c0bf-eee (32 agent, 41,214 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 11 | 7,022 | 22 | 1,260,371 | 387 |
| synthesize:report | claude-sonnet-5-5 | 3 | 6,124 | 6 | 203,146 | 43 |
| review:measurement | claude-opus-5-5 | 6 | 4,439 | 12 | 560,387 | 1378 |
| triage | claude-sonnet-5-5 | 2 | 3,075 | 4 | 84,310 | 25 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,817 | 18 | 58,058 | 384 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,528 | 18 | 90,157 | 127 |
| review:bugs | claude-opus-5-5 | 19 | 1,425 | 38 | 2,152,984 | 384 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 3 | 1,384 | 26 | 122,994 | 1603 |
| review:conventions | claude-opus-5-5 | 15 | 1,275 | 30 | 1,552,750 | 297 |
| machine:ETB_CASES=T08 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 4 | 1,232 | 34 | 160,230 | 1608 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 1,220 | 8 | 253,245 | 17 |
| review:conventions | claude-opus-5-5 | 12 | 974 | 24 | 1,197,161 | 1380 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 885 | 18 | 90,144 | 22 |
| refute:eval-thay-boi.test.mjs | claude-sonnet-5-5 | 3 | 883 | 6 | 173,153 | 15 |
| refute:evals.yaml | claude-sonnet-5-5 | 5 | 746 | 10 | 412,976 | 24 |
| machine:ETB_CASES=T02 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 3 | 668 | 26 | 154,940 | 33 |
| machine:ETB_CASES=T05 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 645 | 18 | 90,167 | 14 |
| machine:ETB_CASES=T07 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 602 | 18 | 90,167 | 13 |
| machine:ETB_CASES=T10 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 546 | 18 | 90,167 | 13 |
| machine:ETB_CASES=T03 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 545 | 18 | 90,167 | 15 |
| machine:ETB_CASES=T06 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 520 | 18 | 90,167 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 8 | 516 | 66 | 499,741 | 37 |
| machine:ETB_CASES=T09 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 511 | 18 | 90,167 | 11 |
| machine:ETB_CASES=T04 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 444 | 18 | 90,167 | 29 |
| review:bugs | claude-opus-5-5 | 11 | 424 | 22 | 1,156,358 | 1379 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 416 | 18 | 90,193 | 83 |
| machine:ETB_CASES=T01 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 414 | 18 | 90,167 | 12 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 304 | 18 | 90,151 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 279 | 18 | 90,193 | 71 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 199 | 18 | 90,193 | 261 |
| capture:provenance | claude-sonnet-5-5 | 2 | 149 | 4 | 79,854 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 3 | 18 | 90,157 | 248 |


wall: 2981s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,220 | 253,245 | 17 | 11:33:55 | 11:34:13 |
| machine | 20 | 13,458 | 2,348,487 | 2870 | 11:33:56 | 12:21:46 |
| review | 6 | 15,559 | 7,880,011 | 1767 | 11:34:11 | 12:03:37 |
| triage | 1 | 3,075 | 84,310 | 25 | 12:21:48 | 12:22:13 |
| refute | 2 | 1,629 | 586,129 | 26 | 12:22:16 | 12:22:42 |
| capture | 1 | 149 | 79,854 | 7 | 12:22:45 | 12:22:52 |
| synthesize | 1 | 6,124 | 203,146 | 43 | 12:22:54 | 12:23:37 |

- **claude-opus-5-5**: 6 agent · 74 calls · out 15,559 · in 148 · cache_read 7,880,011 · cache_create 664,290
- **claude-sonnet-5-5**: 6 agent · 19 calls · out 12,197 · in 38 · cache_read 1,206,684 · cache_create 541,172
- **claude-haiku-4-5-20251001**: 20 agent · 50 calls · out 13,458 · in 440 · cache_read 2,348,487 · cache_create 857,333

