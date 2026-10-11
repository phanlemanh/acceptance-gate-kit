### S4 round 1 — wf_2590ac76-412 (22 agent, 33,597 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 7,544 | 8 | 331,239 | 55 |
| triage | claude-sonnet-5-5 | 2 | 4,206 | 4 | 87,673 | 30 |
| review:bugs | claude-opus-5-5 | 25 | 2,728 | 50 | 3,309,951 | 242 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,578 | 4 | 117,364 | 226 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 2,428 | 10 | 307,320 | 791 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,178 | 4 | 69,964 | 441 |
| review:measurement | claude-opus-5-5 | 10 | 1,868 | 20 | 1,121,645 | 139 |
| review:conventions | claude-opus-5-5 | 30 | 1,817 | 60 | 4,447,897 | 288 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,483 | 4 | 117,350 | 86 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,344 | 4 | 117,350 | 10 |
| refute:evals.yaml | claude-sonnet-5-5 | 4 | 1,162 | 8 | 268,038 | 19 |
| refute:evals.yaml | claude-sonnet-5-5 | 4 | 1,094 | 8 | 302,029 | 18 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,088 | 4 | 117,468 | 89 |
| machine:node tests/dieu-phoi/kiem-validate.mjs | claude-haiku-5-5 | 2 | 408 | 4 | 117,362 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 380 | 4 | 117,406 | 127 |
| machine:bash -c 'LB_CASES=LB1,LB2 node tests/plu | claude-haiku-5-5 | 2 | 333 | 4 | 117,391 | 5 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 194 | 4 | 82,377 | 209 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 186 | 4 | 117,351 | 4 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 169 | 4 | 117,406 | 76 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 81,154 | 6 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 133 | 4 | 85,457 | 101 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 124 | 4 | 117,406 | 311 |


wall: 2421s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 133 | 85,457 | 101 | 12:46:17 | 12:47:58 |
| machine | 13 | 12,893 | 1,633,515 | 2300 | 12:46:17 | 13:24:37 |
| review | 3 | 6,413 | 8,879,493 | 288 | 12:46:17 | 12:51:05 |
| triage | 1 | 4,206 | 87,673 | 30 | 13:24:39 | 13:25:09 |
| refute | 2 | 2,256 | 570,067 | 21 | 13:25:12 | 13:25:33 |
| capture | 1 | 152 | 81,154 | 6 | 13:25:35 | 13:25:41 |
| synthesize | 1 | 7,544 | 331,239 | 55 | 13:25:43 | 13:26:38 |

- **claude-sonnet-5-5**: 6 agent · 18 calls · out 14,291 · in 36 · cache_read 1,155,590 · cache_create 559,453
- **claude-opus-5-5**: 3 agent · 65 calls · out 6,413 · in 130 · cache_read 8,879,493 · cache_create 470,423
- **claude-haiku-5-5**: 13 agent · 29 calls · out 12,893 · in 58 · cache_read 1,633,515 · cache_create 866,687

