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

