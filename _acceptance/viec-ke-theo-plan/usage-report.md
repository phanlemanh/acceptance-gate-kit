### S4 round 1 — wf_cebb4c35-9c5 (23 agent, 41,401 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 8,230 | 6 | 211,171 | 57 |
| triage | claude-sonnet-5-5 | 2 | 5,537 | 4 | 85,918 | 42 |
| review:measurement | claude-opus-5-5 | 15 | 3,182 | 30 | 1,817,287 | 279 |
| review:bugs | claude-opus-5-5 | 19 | 2,971 | 38 | 2,334,896 | 249 |
| judge:E14:spec-alignment | claude-sonnet-5-5 | 2 | 2,745 | 4 | 115,096 | 21 |
| judge:E14:domain-correctness | claude-sonnet-5-5 | 3 | 2,546 | 8 | 172,213 | 22 |
| judge:E14:operational-feasibility | claude-sonnet-5-5 | 2 | 2,143 | 4 | 115,098 | 18 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-4-5-20251001 | 3 | 2,000 | 28 | 155,076 | 134 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 7 | 1,764 | 58 | 489,376 | 356 |
| review:conventions | claude-opus-5-5 | 16 | 1,711 | 32 | 1,771,646 | 204 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 9 | 1,635 | 74 | 565,199 | 319 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,370 | 18 | 89,663 | 29 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,292 | 18 | 89,676 | 105 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,257 | 18 | 89,663 | 25 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 3 | 833 | 6 | 200,322 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 455 | 18 | 89,712 | 76 |
| refute:lo-trinh.mjs | claude-sonnet-5-5 | 4 | 445 | 8 | 253,568 | 13 |
| baseline:diffBase | claude-sonnet-5-5 | 5 | 379 | 10 | 334,702 | 15 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 277 | 18 | 60,641 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 247 | 18 | 89,712 | 218 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 3 | 229 | 26 | 153,291 | 119 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 79,405 | 5 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 2 | 18 | 89,671 | 122 |


wall: 1541s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 379 | 334,702 | 15 | 15:21:19 | 15:21:34 |
| machine | 11 | 10,528 | 1,961,680 | 1414 | 15:21:19 | 15:44:53 |
| judge | 3 | 7,434 | 402,407 | 23 | 15:21:19 | 15:21:42 |
| review | 3 | 7,864 | 5,923,829 | 281 | 15:21:19 | 15:26:00 |
| triage | 1 | 5,537 | 85,918 | 42 | 15:44:55 | 15:45:37 |
| refute | 2 | 1,278 | 453,890 | 15 | 15:45:40 | 15:45:54 |
| capture | 1 | 151 | 79,405 | 5 | 15:45:57 | 15:46:01 |
| synthesize | 1 | 8,230 | 211,171 | 57 | 15:46:03 | 15:47:00 |

- **claude-sonnet-5-5**: 9 agent · 26 calls · out 23,009 · in 54 · cache_read 1,567,493 · cache_create 728,592
- **claude-opus-5-5**: 3 agent · 50 calls · out 7,864 · in 100 · cache_read 5,923,829 · cache_create 379,252
- **claude-haiku-4-5-20251001**: 11 agent · 36 calls · out 10,528 · in 312 · cache_read 1,961,680 · cache_create 446,948

### S4 round 2 — wf_f86e914f-a3d (20 agent, 29,700 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 7,063 | 10 | 425,141 | 65 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 6 | 3,016 | 50 | 358,359 | 141 |
| judge:E14:domain-correctness | claude-sonnet-5-5 | 2 | 2,559 | 4 | 80,180 | 22 |
| judge:E14:spec-alignment | claude-sonnet-5-5 | 2 | 2,500 | 4 | 115,103 | 21 |
| judge:E14:operational-feasibility | claude-sonnet-5-5 | 2 | 2,483 | 4 | 115,105 | 20 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-4-5-20251001 | 2 | 2,052 | 18 | 89,668 | 39 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,017 | 18 | 89,673 | 195 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 6 | 1,819 | 50 | 360,221 | 306 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,404 | 18 | 89,660 | 30 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,369 | 18 | 89,660 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 987 | 18 | 89,668 | 120 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 504 | 18 | 89,709 | 76 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 345 | 18 | 89,667 | 11 |
| baseline:diffBase | claude-sonnet-5-5 | 5 | 305 | 10 | 334,862 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 296 | 18 | 89,709 | 216 |
| review:bugs | claude-opus-5-5 | 6 | 292 | 12 | 484,592 | 34 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 281 | 18 | 89,709 | 59 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 79,412 | 5 |
| review:conventions | claude-opus-5-5 | 5 | 137 | 10 | 353,758 | 27 |
| review:measurement | claude-opus-5-5 | 8 | 119 | 16 | 695,287 | 51 |


wall: 1277s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 305 | 334,862 | 15 | 15:49:12 | 15:49:27 |
| machine | 11 | 14,090 | 1,525,703 | 1202 | 15:49:12 | 16:09:14 |
| judge | 3 | 7,542 | 310,388 | 23 | 15:49:12 | 15:49:35 |
| review | 3 | 548 | 1,533,637 | 52 | 15:49:12 | 15:50:04 |
| capture | 1 | 152 | 79,412 | 5 | 16:09:17 | 16:09:22 |
| synthesize | 1 | 7,063 | 425,141 | 65 | 16:09:24 | 16:10:29 |

- **claude-sonnet-5-5**: 6 agent · 18 calls · out 15,062 · in 36 · cache_read 1,149,803 · cache_create 488,109
- **claude-haiku-4-5-20251001**: 11 agent · 30 calls · out 14,090 · in 262 · cache_read 1,525,703 · cache_create 402,916
- **claude-opus-5-5**: 3 agent · 19 calls · out 548 · in 38 · cache_read 1,533,637 · cache_create 227,386

