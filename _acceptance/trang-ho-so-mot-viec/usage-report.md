### S4 round 1 — wf_de5e7f0e-bc1 (20 agent, 35,245 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 9 | 8,135 | 18 | 1,114,357 | 83 |
| triage | claude-sonnet-5-5 | 2 | 4,370 | 4 | 106,298 | 34 |
| ui:E12 | claude-sonnet-5-5 | 30 | 3,975 | 60 | 3,667,627 | 253 |
| review:measurement | claude-opus-5-5 | 21 | 2,776 | 42 | 3,376,138 | 211 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,554 | 4 | 137,571 | 220 |
| review:conventions | claude-opus-5-5 | 21 | 2,197 | 42 | 2,994,596 | 189 |
| review:bugs | claude-opus-5-5 | 22 | 1,885 | 44 | 3,205,510 | 171 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,608 | 4 | 137,545 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,525 | 4 | 34,982 | 419 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,485 | 4 | 137,545 | 83 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,390 | 4 | 137,559 | 169 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 4 | 1,055 | 8 | 327,467 | 18 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 591 | 4 | 137,601 | 78 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 409 | 4 | 137,531 | 84 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 361 | 4 | 137,601 | 65 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 285 | 4 | 137,601 | 280 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 187 | 4 | 137,546 | 4 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 184 | 4 | 102,550 | 119 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 101,349 | 5 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 125 | 4 | 104,534 | 72 |


wall: 1620s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 125 | 104,534 | 72 | 01:26:03 | 01:27:15 |
| machine | 11 | 10,579 | 1,375,632 | 1469 | 01:26:03 | 01:50:32 |
| ui | 1 | 3,975 | 3,667,627 | 253 | 01:26:03 | 01:30:16 |
| review | 3 | 6,858 | 9,576,244 | 212 | 01:26:03 | 01:29:34 |
| triage | 1 | 4,370 | 106,298 | 34 | 01:50:34 | 01:51:08 |
| refute | 1 | 1,055 | 327,467 | 18 | 01:51:12 | 01:51:30 |
| capture | 1 | 148 | 101,349 | 5 | 01:51:32 | 01:51:37 |
| synthesize | 1 | 8,135 | 1,114,357 | 83 | 01:51:39 | 01:53:02 |

- **claude-sonnet-5-5**: 6 agent · 49 calls · out 17,808 · in 98 · cache_read 5,421,632 · cache_create 742,538
- **claude-opus-5-5**: 3 agent · 64 calls · out 6,858 · in 128 · cache_read 9,576,244 · cache_create 486,949
- **claude-haiku-5-5**: 11 agent · 22 calls · out 10,579 · in 44 · cache_read 1,375,632 · cache_create 960,842

