### S4 round 1 — wf_2553547f-f78 (25 agent, 32,276 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 7,571 | 4 | 49,166 | 42 |
| triage | claude-sonnet-5-5 | 2 | 3,773 | 4 | 35,864 | 25 |
| review:conventions | claude-opus-5-5 | 24 | 3,252 | 48 | 1,946,800 | 154 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 2,837 | 10 | 111,737 | 800 |
| review:measurement | claude-opus-5-5 | 12 | 2,215 | 24 | 815,090 | 132 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,688 | 4 | 34,169 | 11 |
| review:bugs | claude-opus-5-5 | 16 | 1,639 | 32 | 1,094,640 | 102 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,488 | 4 | 34,169 | 86 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,200 | 4 | 31,309 | 202 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 1,108 | 6 | 38,340 | 661 |
| machine:CHD_CASES=AC-2,AC-2-vong,AC-2-do node te | claude-haiku-5-5 | 2 | 627 | 4 | 34,214 | 8 |
| machine:CHD_CASES=AC-1,AC-1-do,AC-1-hong node te | claude-haiku-5-5 | 2 | 610 | 4 | 34,214 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 570 | 4 | 34,225 | 121 |
| machine:CHD_CASES=AC-3,AC-3-do node tests/script | claude-haiku-5-5 | 2 | 524 | 4 | 34,201 | 9 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 412 | 4 | 34,170 | 4 |
| machine:CHD_CASES=AC-4,AC-4-kho-that,AC-4-do nod | claude-haiku-5-5 | 2 | 396 | 4 | 34,218 | 10 |
| machine:CHD_CASES=AC-6,AC-6-do-khoi,AC-6-do-lop | claude-haiku-5-5 | 2 | 391 | 4 | 34,225 | 5 |
| machine:CHD_CASES=AC-5,AC-5-do-khoa,AC-5-do-nghi | claude-haiku-5-5 | 2 | 390 | 4 | 34,226 | 5 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 369 | 4 | 37,239 | 32 |
| machine:CHD_CASES=AC-8,AC-8-do node tests/script | claude-haiku-5-5 | 2 | 348 | 4 | 34,201 | 4 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 295 | 4 | 34,225 | 71 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 225 | 4 | 34,183 | 176 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 170 | 4 | 2,869 | 319 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 30,085 | 5 |
| machine:CHD_CASES=AC-7,AC-7-do node tests/script | claude-haiku-5-5 | 2 | 27 | 4 | 34,201 | 5 |


wall: 2552s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 369 | 37,239 | 32 | 17:57:50 | 17:58:22 |
| machine | 18 | 13,306 | 663,096 | 2471 | 17:57:51 | 18:39:02 |
| review | 3 | 7,106 | 3,856,530 | 154 | 17:57:51 | 18:00:24 |
| triage | 1 | 3,773 | 35,864 | 25 | 18:39:04 | 18:39:29 |
| capture | 1 | 151 | 30,085 | 5 | 18:39:32 | 18:39:38 |
| synthesize | 1 | 7,571 | 49,166 | 42 | 18:39:40 | 18:40:22 |

- **claude-sonnet-5-5**: 4 agent · 8 calls · out 11,864 · in 16 · cache_read 152,354 · cache_create 187,711
- **claude-opus-5-5**: 3 agent · 52 calls · out 7,106 · in 104 · cache_read 3,856,530 · cache_create 326,024
- **claude-haiku-5-5**: 18 agent · 40 calls · out 13,306 · in 80 · cache_read 663,096 · cache_create 690,505

### S4 round 2 — wf_f79554e4-44d (25 agent, 26,504 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 7,478 | 8 | 164,265 | 43 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 2,705 | 14 | 186,383 | 799 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 2,390 | 8 | 75,309 | 667 |
| review:measurement | claude-opus-5-5 | 7 | 1,744 | 14 | 303,346 | 59 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,584 | 4 | 34,301 | 85 |
| triage | claude-sonnet-5-5 | 2 | 1,427 | 4 | 33,627 | 11 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,269 | 4 | 34,310 | 204 |
| review:conventions | claude-opus-5-5 | 15 | 1,229 | 30 | 753,821 | 86 |
| review:bugs | claude-opus-5-5 | 10 | 1,049 | 20 | 502,530 | 77 |
| machine:CHD_CASES=AC-5,AC-5-do-khoa,AC-5-do-nghi | claude-haiku-5-5 | 2 | 723 | 4 | 34,358 | 7 |
| machine:CHD_CASES=AC-7,AC-7-do,AC-7-do-ngay-ky n | claude-haiku-5-5 | 2 | 657 | 4 | 34,357 | 6 |
| machine:CHD_CASES=AC-8,AC-8-do node tests/script | claude-haiku-5-5 | 2 | 535 | 4 | 34,333 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 448 | 4 | 34,357 | 121 |
| machine:CHD_CASES=AC-2,AC-2-vong,AC-2-do node te | claude-haiku-5-5 | 2 | 424 | 4 | 34,346 | 8 |
| machine:CHD_CASES=AC-3,AC-3-do,AC-3-do-rut node | claude-haiku-5-5 | 2 | 416 | 4 | 34,350 | 12 |
| machine:CHD_CASES=AC-4,AC-4-kho-that,AC-4-do nod | claude-haiku-5-5 | 2 | 398 | 4 | 34,350 | 10 |
| machine:CHD_CASES=AC-6,AC-6-do-khoi,AC-6-do-lop | claude-haiku-5-5 | 2 | 387 | 4 | 34,357 | 5 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 369 | 4 | 37,395 | 32 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 342 | 4 | 2,869 | 323 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 215 | 4 | 34,302 | 4 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 197 | 4 | 34,315 | 181 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 34,357 | 70 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 172 | 4 | 34,301 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 149 | 4 | 30,217 | 6 |
| machine:CHD_CASES=AC-1,AC-1-do,AC-1-hong node te | claude-haiku-5-5 | 2 | 24 | 4 | 34,346 | 5 |


wall: 2548s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 369 | 37,395 | 32 | 20:07:06 | 20:07:38 |
| machine | 18 | 13,059 | 779,601 | 2480 | 20:07:06 | 20:48:27 |
| review | 3 | 4,022 | 1,559,697 | 86 | 20:07:06 | 20:08:32 |
| triage | 1 | 1,427 | 33,627 | 11 | 20:48:29 | 20:48:40 |
| capture | 1 | 149 | 30,217 | 6 | 20:48:42 | 20:48:49 |
| synthesize | 1 | 7,478 | 164,265 | 43 | 20:48:51 | 20:49:34 |

- **claude-sonnet-5-5**: 4 agent · 10 calls · out 9,423 · in 20 · cache_read 265,504 · cache_create 185,610
- **claude-haiku-5-5**: 18 agent · 43 calls · out 13,059 · in 86 · cache_read 779,601 · cache_create 693,555
- **claude-opus-5-5**: 3 agent · 32 calls · out 4,022 · in 64 · cache_read 1,559,697 · cache_create 210,791

