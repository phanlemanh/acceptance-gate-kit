### S4 round 1 — wf_32fe0f8a-35e (23 agent, 92,781 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 10 | 13,806 | 20 | 704,251 | 148 |
| review:conventions | claude-opus-5-5 | 24 | 13,711 | 48 | 1,828,457 | 180 |
| review:bugs | claude-opus-5-5 | 19 | 13,709 | 38 | 1,329,153 | 194 |
| synthesize:report | claude-sonnet-5-5 | 4 | 12,228 | 8 | 191,752 | 86 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 10 | 6,082 | 20 | 351,621 | 986 |
| triage | claude-sonnet-5-5 | 2 | 3,843 | 4 | 38,424 | 29 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 3,185 | 4 | 37,418 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,153 | 4 | 3,034 | 443 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 2,333 | 4 | 37,475 | 39 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,192 | 4 | 37,363 | 15 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,172 | 4 | 37,363 | 91 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,139 | 4 | 3,034 | 426 |
| machine:node tests/dieu-phoi/kiem-khung.mjs | claude-haiku-5-5 | 2 | 2,046 | 4 | 37,375 | 42 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,853 | 4 | 37,419 | 113 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,840 | 4 | 34,338 | 170 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 2 | 1,414 | 4 | 37,861 | 17 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 2 | 1,389 | 4 | 34,354 | 13 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 2 | 1,276 | 4 | 37,859 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,107 | 4 | 3,034 | 580 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,072 | 4 | 37,419 | 79 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 1,022 | 4 | 37,364 | 8 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 849 | 4 | 37,389 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 360 | 4 | 33,116 | 8 |


wall: 3072s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,185 | 37,418 | 23 | 08:10:09 | 08:10:33 |
| machine | 13 | 27,860 | 694,228 | 2942 | 08:10:09 | 08:59:11 |
| judge | 3 | 4,079 | 110,074 | 20 | 08:10:09 | 08:10:30 |
| review | 3 | 41,226 | 3,861,861 | 196 | 08:10:09 | 08:13:26 |
| triage | 1 | 3,843 | 38,424 | 29 | 08:59:14 | 08:59:42 |
| capture | 1 | 360 | 33,116 | 8 | 08:59:45 | 08:59:53 |
| synthesize | 1 | 12,228 | 191,752 | 86 | 08:59:55 | 09:01:21 |

- **claude-opus-5-5**: 3 agent · 53 calls · out 41,226 · in 106 · cache_read 3,861,861 · cache_create 295,912
- **claude-sonnet-5-5**: 7 agent · 16 calls · out 23,695 · in 32 · cache_read 410,784 · cache_create 376,979
- **claude-haiku-5-5**: 13 agent · 34 calls · out 27,860 · in 68 · cache_read 694,228 · cache_create 610,584

