### S4 round 1 — wf_5ce72478-8b3 (27 agent, 52,178 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 12,540 | 4 | 55,416 | 66 |
| review:measurement | claude-opus-5-5 | 7 | 6,953 | 14 | 377,519 | 119 |
| review:bugs | claude-opus-5-5 | 28 | 5,027 | 56 | 2,339,184 | 268 |
| triage | claude-sonnet-5-5 | 2 | 4,589 | 4 | 38,623 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,947 | 4 | 2,869 | 489 |
| review:conventions | claude-opus-5-5 | 19 | 2,293 | 38 | 1,681,426 | 149 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,063 | 4 | 2,869 | 534 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 4 | 1,634 | 10 | 118,819 | 20 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 10 | 1,624 | 20 | 308,652 | 1032 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 3 | 1,596 | 6 | 73,513 | 13 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 3 | 1,566 | 6 | 73,517 | 15 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,510 | 4 | 35,279 | 87 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,325 | 4 | 35,335 | 132 |
| judge:E7:operational-feasibility | claude-sonnet-5-5 | 3 | 990 | 6 | 72,808 | 11 |
| judge:E7:domain-correctness | claude-sonnet-5-5 | 3 | 941 | 6 | 69,442 | 11 |
| refute:bang-ngoai-n.test.mjs | claude-sonnet-5-5 | 4 | 822 | 8 | 113,653 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 779 | 4 | 35,288 | 232 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 690 | 4 | 35,305 | 7 |
| machine:node tests/scripts/bang-ngoai-n.test.mjs | claude-haiku-5-5 | 2 | 511 | 4 | 35,293 | 13 |
| judge:E7:spec-alignment | claude-sonnet-5-5 | 3 | 448 | 6 | 72,804 | 11 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 238 | 4 | 35,279 | 9 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 213 | 4 | 35,280 | 5 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 191 | 4 | 34,996 | 17 |
| machine:python3 _acceptance/bang-ngoai-n-co-can- | claude-haiku-5-5 | 2 | 187 | 4 | 35,305 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 35,335 | 76 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 2,869 | 370 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 31,200 | 5 |


wall: 3120s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 191 | 34,996 | 17 | 03:37:53 | 03:38:10 |
| machine | 13 | 12,437 | 634,958 | 2996 | 03:37:53 | 04:27:49 |
| judge | 6 | 7,175 | 480,903 | 22 | 03:37:53 | 03:38:15 |
| review | 3 | 14,273 | 4,398,129 | 269 | 03:37:53 | 03:42:22 |
| triage | 1 | 4,589 | 38,623 | 30 | 04:27:51 | 04:28:21 |
| refute | 1 | 822 | 113,653 | 14 | 04:28:23 | 04:28:37 |
| capture | 1 | 151 | 31,200 | 5 | 04:28:40 | 04:28:45 |
| synthesize | 1 | 12,540 | 55,416 | 66 | 04:28:47 | 04:29:53 |

- **claude-sonnet-5-5**: 11 agent · 31 calls · out 25,468 · in 64 · cache_read 754,791 · cache_create 471,862
- **claude-opus-5-5**: 3 agent · 54 calls · out 14,273 · in 108 · cache_read 4,398,129 · cache_create 336,982
- **claude-haiku-5-5**: 13 agent · 34 calls · out 12,437 · in 68 · cache_read 634,958 · cache_create 574,686

### S4 round 2 — wf_5b3500f5-475 (26 agent, 39,121 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 9,008 | 8 | 167,913 | 50 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 6 | 2,886 | 12 | 203,659 | 25 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 5 | 2,726 | 10 | 166,533 | 26 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 2,563 | 16 | 233,229 | 1041 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,551 | 4 | 2,869 | 491 |
| triage | claude-sonnet-5-5 | 2 | 2,341 | 4 | 35,281 | 19 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,278 | 4 | 2,869 | 520 |
| review:measurement | claude-opus-5-5 | 7 | 2,038 | 14 | 300,793 | 55 |
| review:conventions | claude-opus-5-5 | 13 | 1,672 | 26 | 775,512 | 83 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,514 | 4 | 35,258 | 88 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 7 | 1,271 | 14 | 251,307 | 27 |
| judge:E7:domain-correctness | claude-sonnet-5-5 | 3 | 1,016 | 6 | 69,400 | 11 |
| review:bugs | claude-opus-5-5 | 29 | 961 | 58 | 2,727,945 | 190 |
| judge:E7:operational-feasibility | claude-sonnet-5-5 | 3 | 954 | 6 | 72,766 | 13 |
| judge:E7:spec-alignment | claude-sonnet-5-5 | 3 | 918 | 6 | 72,762 | 10 |
| refute:bang-ngoai-n.test.mjs | claude-sonnet-5-5 | 3 | 839 | 6 | 71,003 | 15 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 741 | 4 | 32,398 | 228 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 528 | 4 | 35,314 | 127 |
| machine:node tests/scripts/bang-ngoai-n.test.mjs | claude-haiku-5-5 | 2 | 524 | 4 | 35,272 | 13 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 388 | 4 | 35,284 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 316 | 4 | 2,869 | 370 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 292 | 4 | 35,314 | 76 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 241 | 4 | 35,258 | 9 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 217 | 4 | 35,259 | 5 |
| machine:python3 _acceptance/bang-ngoai-n-co-can- | claude-haiku-5-5 | 2 | 190 | 4 | 35,284 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 31,179 | 6 |


wall: 3083s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 13 | 12,343 | 556,477 | 2984 | 05:03:27 | 05:53:11 |
| judge | 6 | 9,771 | 836,427 | 29 | 05:03:27 | 05:03:56 |
| review | 3 | 4,671 | 3,804,250 | 191 | 05:03:27 | 05:06:38 |
| triage | 1 | 2,341 | 35,281 | 19 | 05:53:13 | 05:53:33 |
| refute | 1 | 839 | 71,003 | 15 | 05:53:35 | 05:53:50 |
| capture | 1 | 148 | 31,179 | 6 | 05:53:52 | 05:53:58 |
| synthesize | 1 | 9,008 | 167,913 | 50 | 05:54:01 | 05:54:50 |

- **claude-sonnet-5-5**: 10 agent · 38 calls · out 22,107 · in 76 · cache_read 1,141,803 · cache_create 437,873
- **claude-haiku-5-5**: 13 agent · 32 calls · out 12,343 · in 64 · cache_read 556,477 · cache_create 577,884
- **claude-opus-5-5**: 3 agent · 49 calls · out 4,671 · in 98 · cache_read 3,804,250 · cache_create 293,469

