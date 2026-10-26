### S4 round 1 — wf_bad52424-9ef (21 agent, 76,171 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 11,431 | 8 | 186,410 | 69 |
| review:conventions | claude-opus-5-5 | 14 | 10,854 | 28 | 917,078 | 130 |
| review:measurement | claude-opus-5-5 | 7 | 9,661 | 14 | 331,515 | 108 |
| review:bugs | claude-opus-5-5 | 8 | 7,910 | 16 | 383,332 | 91 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 11 | 6,695 | 22 | 350,954 | 1352 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,737 | 16 | 235,602 | 1083 |
| triage | claude-sonnet-5-5 | 2 | 4,198 | 4 | 38,917 | 31 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 3,427 | 10 | 115,137 | 773 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 2,908 | 4 | 39,583 | 18 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,026 | 4 | 36,485 | 100 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,964 | 4 | 6,114 | 327 |
| refute:danh-thuc-ma-phien.test.mjs | claude-sonnet-5-5 | 5 | 1,553 | 10 | 150,709 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,139 | 4 | 36,541 | 166 |
| machine:node tests/dieu-phoi/hai-moi-truong.mjs | claude-haiku-5-5 | 2 | 1,115 | 4 | 6,114 | 587 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,022 | 4 | 6,114 | 429 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 905 | 4 | 3,057 | 551 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 896 | 4 | 36,541 | 91 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 871 | 4 | 36,511 | 7 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 754 | 4 | 36,485 | 10 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 681 | 4 | 36,486 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 424 | 4 | 32,211 | 5 |


wall: 4687s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,908 | 39,583 | 18 | 02:41:49 | 02:42:07 |
| machine | 13 | 27,232 | 942,141 | 4567 | 02:41:49 | 03:57:56 |
| review | 3 | 28,425 | 1,631,925 | 130 | 02:41:49 | 02:43:59 |
| triage | 1 | 4,198 | 38,917 | 31 | 03:57:56 | 03:58:27 |
| refute | 1 | 1,553 | 150,709 | 15 | 03:58:27 | 03:58:42 |
| capture | 1 | 424 | 32,211 | 5 | 03:58:42 | 03:58:47 |
| synthesize | 1 | 11,431 | 186,410 | 69 | 03:58:47 | 03:59:56 |

- **claude-sonnet-5-5**: 5 agent · 15 calls · out 20,514 · in 30 · cache_read 447,830 · cache_create 227,252
- **claude-opus-5-5**: 3 agent · 29 calls · out 28,425 · in 58 · cache_read 1,631,925 · cache_create 237,284
- **claude-haiku-5-5**: 13 agent · 44 calls · out 27,232 · in 88 · cache_read 942,141 · cache_create 676,712

