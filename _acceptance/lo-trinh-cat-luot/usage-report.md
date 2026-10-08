### S4 round 1 — wf_a2ae16ef-0af (25 agent, 43,134 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 7 | 8,845 | 14 | 647,488 | 411 |
| triage | claude-sonnet-5-5 | 2 | 4,168 | 4 | 103,200 | 38 |
| review:bugs | claude-opus-5-5 | 28 | 2,860 | 56 | 4,457,945 | 354 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 2 | 2,483 | 4 | 134,026 | 39 |
| review:measurement | claude-opus-5-5 | 20 | 2,375 | 40 | 3,053,782 | 242 |
| review:conventions | claude-opus-5-5 | 26 | 2,324 | 52 | 3,687,849 | 235 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,301 | 4 | 69,964 | 366 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,287 | 4 | 134,384 | 258 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 2 | 2,208 | 4 | 134,028 | 20 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 2 | 2,021 | 4 | 99,134 | 21 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,856 | 4 | 134,384 | 236 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,704 | 4 | 134,370 | 65 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,344 | 4 | 134,370 | 15 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 4 | 1,036 | 8 | 349,083 | 25 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,005 | 4 | 99,397 | 138 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 4 | 935 | 8 | 348,912 | 30 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 6 | 749 | 12 | 551,489 | 34 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 495 | 4 | 134,378 | 68 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 479 | 4 | 134,426 | 86 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 402 | 4 | 134,371 | 9 |
| machine:node tests/scripts/xem-trang-lo-trinh.te | claude-haiku-5-5 | 2 | 370 | 4 | 134,386 | 22 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 301 | 4 | 134,426 | 282 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 290 | 8 | 313,181 | 74 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 98,174 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 144 | 4 | 134,426 | 79 |


wall: 2060s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 290 | 313,181 | 74 | 17:22:45 | 17:23:59 |
| machine | 12 | 12,688 | 1,513,282 | 1557 | 17:22:45 | 17:48:42 |
| judge | 3 | 6,712 | 367,188 | 44 | 17:22:45 | 17:23:29 |
| review | 3 | 7,559 | 11,199,576 | 356 | 17:22:45 | 17:28:41 |
| triage | 1 | 4,168 | 103,200 | 38 | 17:48:44 | 17:49:21 |
| refute | 3 | 2,720 | 1,249,484 | 34 | 17:49:23 | 17:49:57 |
| capture | 1 | 152 | 98,174 | 11 | 17:49:59 | 17:50:10 |
| synthesize | 1 | 8,845 | 647,488 | 411 | 17:50:14 | 17:57:05 |

- **claude-sonnet-5-5**: 10 agent · 35 calls · out 22,887 · in 70 · cache_read 2,778,715 · cache_create 1,132,310
- **claude-opus-5-5**: 3 agent · 74 calls · out 7,559 · in 148 · cache_read 11,199,576 · cache_create 512,096
- **claude-haiku-5-5**: 12 agent · 24 calls · out 12,688 · in 48 · cache_read 1,513,282 · cache_create 962,313

