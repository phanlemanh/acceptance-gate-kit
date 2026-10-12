### S4 round 1 — wf_11304e4f-153 (22 agent, 53,561 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 10,243 | 8 | 389,533 | 86 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 3 | 5,180 | 6 | 240,662 | 44 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 2 | 4,747 | 4 | 133,245 | 38 |
| triage | claude-sonnet-5-5 | 2 | 4,545 | 4 | 103,582 | 34 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 3 | 3,401 | 6 | 205,809 | 32 |
| review:measurement | claude-opus-5-5 | 14 | 3,177 | 28 | 1,793,525 | 195 |
| review:conventions | claude-opus-5-5 | 34 | 3,110 | 68 | 5,238,524 | 339 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,711 | 4 | 34,982 | 360 |
| machine:node tests/scripts/dai-tom-tat.test.mjs | claude-haiku-5-5 | 2 | 2,602 | 4 | 133,680 | 37 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,438 | 4 | 133,682 | 238 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,209 | 4 | 34,982 | 490 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,579 | 4 | 133,668 | 16 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,508 | 4 | 133,668 | 85 |
| review:bugs | claude-opus-5-5 | 26 | 1,415 | 52 | 3,491,444 | 417 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,160 | 4 | 98,695 | 135 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 967 | 4 | 133,724 | 90 |
| machine:node tests/scripts/dai-tom-tat-crm.mjs | claude-haiku-5-5 | 2 | 826 | 4 | 133,682 | 22 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 696 | 4 | 133,669 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 563 | 4 | 133,724 | 83 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 181 | 4 | 101,231 | 19 |
| capture:provenance | claude-sonnet-5-5 | 2 | 153 | 4 | 97,476 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 150 | 4 | 34,982 | 389 |


wall: 2054s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 181 | 101,231 | 19 | 02:19:31 | 02:19:50 |
| machine | 12 | 17,409 | 1,273,138 | 1920 | 02:19:31 | 02:51:31 |
| judge | 3 | 13,328 | 579,716 | 47 | 02:19:31 | 02:20:18 |
| review | 3 | 7,702 | 10,523,493 | 422 | 02:19:31 | 02:26:33 |
| triage | 1 | 4,545 | 103,582 | 34 | 02:51:33 | 02:52:07 |
| capture | 1 | 153 | 97,476 | 8 | 02:52:10 | 02:52:17 |
| synthesize | 1 | 10,243 | 389,533 | 86 | 02:52:20 | 02:53:45 |

- **claude-sonnet-5-5**: 7 agent · 18 calls · out 28,450 · in 36 · cache_read 1,271,538 · cache_create 763,654
- **claude-opus-5-5**: 3 agent · 74 calls · out 7,702 · in 148 · cache_read 10,523,493 · cache_create 525,785
- **claude-haiku-5-5**: 12 agent · 24 calls · out 17,409 · in 48 · cache_read 1,273,138 · cache_create 1,189,541

