### S4 round 1 — wf_3051a4ed-bba (21 agent, 28,810 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 9,086 | 6 | 108,991 | 48 |
| review:bugs | claude-opus-5-5 | 12 | 3,633 | 24 | 737,721 | 130 |
| triage | claude-sonnet-5-5 | 2 | 3,379 | 4 | 35,420 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,326 | 4 | 34,218 | 177 |
| review:conventions | claude-opus-5-5 | 15 | 1,527 | 30 | 966,400 | 123 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,272 | 4 | 34,325 | 91 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,181 | 4 | 31,344 | 230 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,098 | 4 | 34,204 | 85 |
| machine:node tests/dieu-phoi/kiem-khung.mjs | claude-haiku-5-5 | 2 | 1,048 | 4 | 34,216 | 30 |
| refute:khung.test.ts | claude-sonnet-5-5 | 6 | 853 | 12 | 195,171 | 23 |
| machine:node tests/dieu-phoi/kiem-mod.mjs | claude-haiku-5-5 | 2 | 647 | 4 | 34,216 | 10 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 560 | 6 | 38,331 | 625 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 497 | 4 | 34,260 | 121 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 360 | 4 | 34,260 | 71 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 350 | 4 | 2,869 | 322 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 280 | 4 | 34,205 | 4 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 187 | 12 | 150,807 | 826 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 168 | 4 | 34,396 | 104 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 162 | 4 | 34,204 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 30,121 | 5 |
| review:measurement | claude-opus-5-5 | 5 | 46 | 10 | 213,529 | 79 |


wall: 2594s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 168 | 34,396 | 104 | 19:24:51 | 19:26:35 |
| machine | 13 | 9,968 | 531,459 | 2486 | 19:24:51 | 20:06:18 |
| review | 3 | 5,206 | 1,917,650 | 131 | 19:24:51 | 19:27:03 |
| triage | 1 | 3,379 | 35,420 | 23 | 20:06:21 | 20:06:44 |
| refute | 1 | 853 | 195,171 | 23 | 20:06:46 | 20:07:09 |
| capture | 1 | 150 | 30,121 | 5 | 20:07:11 | 20:07:16 |
| synthesize | 1 | 9,086 | 108,991 | 48 | 20:07:18 | 20:08:06 |

- **claude-sonnet-5-5**: 5 agent · 15 calls · out 13,636 · in 30 · cache_read 404,099 · cache_create 232,325
- **claude-opus-5-5**: 3 agent · 32 calls · out 5,206 · in 64 · cache_read 1,917,650 · cache_create 280,227
- **claude-haiku-5-5**: 13 agent · 31 calls · out 9,968 · in 62 · cache_read 531,459 · cache_create 531,156

