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

### S4 round 2 — wf_8ff1f8d0-b6a (28 agent, 35,877 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 6,232 | 8 | 325,177 | 51 |
| review:measurement | claude-opus-5-5 | 8 | 5,691 | 16 | 791,728 | 114 |
| triage | claude-sonnet-5-5 | 2 | 3,471 | 4 | 85,630 | 27 |
| review:conventions | claude-opus-5-5 | 11 | 2,314 | 22 | 1,017,440 | 139 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,662 | 18 | 90,273 | 250 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,661 | 18 | 58,058 | 380 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,383 | 50 | 357,415 | 33 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,323 | 18 | 90,260 | 26 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 1,256 | 8 | 253,590 | 19 |
| review:bugs | claude-opus-5-5 | 8 | 1,061 | 16 | 736,182 | 108 |
| machine:ETB_CASES=T02 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 953 | 18 | 90,283 | 27 |
| refute:eval-thay-boi.test.mjs | claude-sonnet-5-5 | 5 | 933 | 10 | 343,543 | 20 |
| machine:ETB_CASES=T04 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 728 | 18 | 90,283 | 49 |
| machine:ETB_CASES=T10 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 669 | 18 | 90,283 | 15 |
| machine:ETB_CASES=T03 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 634 | 18 | 90,283 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 598 | 18 | 90,273 | 132 |
| machine:ETB_CASES=T09 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 585 | 18 | 90,283 | 17 |
| machine:ETB_CASES=T05 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 583 | 18 | 90,283 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 534 | 18 | 90,309 | 90 |
| machine:ETB_CASES=T08 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 521 | 18 | 90,283 | 153 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 517 | 18 | 90,268 | 129 |
| machine:ETB_CASES=T07 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 499 | 18 | 90,283 | 15 |
| machine:ETB_CASES=T01 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 488 | 18 | 90,283 | 15 |
| machine:ETB_CASES=T06 node tests/scripts/eval-th | claude-haiku-4-5-20251001 | 2 | 482 | 18 | 90,283 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 344 | 18 | 90,267 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 327 | 18 | 90,309 | 271 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 273 | 18 | 90,309 | 72 |
| capture:provenance | claude-sonnet-5-5 | 2 | 155 | 4 | 79,983 | 7 |


wall: 1538s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,256 | 253,590 | 19 | 12:32:48 | 12:33:07 |
| machine | 20 | 14,764 | 2,040,571 | 1421 | 12:32:48 | 12:56:28 |
| review | 3 | 9,066 | 2,545,350 | 139 | 12:33:04 | 12:35:22 |
| triage | 1 | 3,471 | 85,630 | 27 | 12:56:32 | 12:56:59 |
| refute | 1 | 933 | 343,543 | 20 | 12:57:02 | 12:57:22 |
| capture | 1 | 155 | 79,983 | 7 | 12:57:25 | 12:57:32 |
| synthesize | 1 | 6,232 | 325,177 | 51 | 12:57:34 | 12:58:26 |

- **claude-sonnet-5-5**: 5 agent · 17 calls · out 12,047 · in 34 · cache_read 1,087,923 · cache_create 475,389
- **claude-opus-5-5**: 3 agent · 27 calls · out 9,066 · in 54 · cache_read 2,545,350 · cache_create 287,370
- **claude-haiku-4-5-20251001**: 20 agent · 44 calls · out 14,764 · in 392 · cache_read 2,040,571 · cache_create 760,145

