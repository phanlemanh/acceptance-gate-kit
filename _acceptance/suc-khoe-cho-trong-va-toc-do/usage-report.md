### S4 round 1 — wf_b6f84f62-ce3 (23 agent, 48,106 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 13,749 | 8 | 201,660 | 81 |
| triage | claude-sonnet-5-5 | 2 | 6,762 | 4 | 40,422 | 48 |
| review:measurement | claude-opus-5-5 | 18 | 4,906 | 36 | 1,319,932 | 236 |
| review:conventions | claude-opus-5-5 | 24 | 3,441 | 48 | 2,135,713 | 207 |
| review:bugs | claude-opus-5-5 | 12 | 2,894 | 24 | 801,664 | 157 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,638 | 4 | 2,973 | 483 |
| judge:E6b:domain-correctness | claude-sonnet-5-5 | 3 | 1,940 | 8 | 76,278 | 18 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,878 | 4 | 36,132 | 17 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,803 | 4 | 36,002 | 291 |
| judge:E6b:operational-feasibility | claude-sonnet-5-5 | 2 | 1,574 | 4 | 36,352 | 15 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,483 | 4 | 35,988 | 84 |
| judge:E6b:spec-alignment | claude-sonnet-5-5 | 2 | 1,252 | 4 | 36,350 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 1,189 | 10 | 116,564 | 819 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 586 | 4 | 33,024 | 150 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 463 | 4 | 36,014 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 259 | 4 | 36,044 | 88 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 244 | 4 | 36,106 | 6 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 237 | 4 | 35,988 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 190 | 4 | 35,989 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 36,044 | 76 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 166 | 4 | 35,870 | 20 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 31,805 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 127 | 4 | 2,973 | 512 |


wall: 2687s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 166 | 35,870 | 20 | 04:42:04 | 04:42:24 |
| machine | 13 | 11,272 | 479,841 | 2544 | 04:42:04 | 05:24:28 |
| judge | 3 | 4,766 | 148,980 | 18 | 04:42:04 | 04:42:22 |
| review | 3 | 11,241 | 4,257,309 | 238 | 04:42:04 | 04:46:02 |
| triage | 1 | 6,762 | 40,422 | 48 | 05:24:32 | 05:25:19 |
| capture | 1 | 150 | 31,805 | 6 | 05:25:22 | 05:25:28 |
| synthesize | 1 | 13,749 | 201,660 | 81 | 05:25:30 | 05:26:51 |

- **claude-sonnet-5-5**: 7 agent · 17 calls · out 25,593 · in 36 · cache_read 458,737 · cache_create 325,610
- **claude-opus-5-5**: 3 agent · 54 calls · out 11,241 · in 108 · cache_read 4,257,309 · cache_create 336,702
- **claude-haiku-5-5**: 13 agent · 29 calls · out 11,272 · in 58 · cache_read 479,841 · cache_create 555,332

