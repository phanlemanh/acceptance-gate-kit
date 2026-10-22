### S4 round 1 — wf_eca48479-49e (20 agent, 36,401 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 10,316 | 8 | 178,862 | 70 |
| triage | claude-sonnet-5-5 | 2 | 4,225 | 4 | 37,848 | 39 |
| review:bugs | claude-opus-5-5 | 9 | 2,836 | 18 | 501,479 | 99 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,738 | 4 | 3,057 | 510 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 2,545 | 16 | 234,546 | 1001 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,046 | 4 | 36,336 | 274 |
| review:conventions | claude-opus-5-5 | 24 | 1,983 | 48 | 1,805,168 | 171 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,779 | 4 | 36,350 | 311 |
| review:measurement | claude-opus-5-5 | 13 | 1,777 | 26 | 887,430 | 147 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,599 | 4 | 36,336 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,193 | 4 | 33,288 | 215 |
| machine:env LNT_CASES=LNT7,LNT8,LNT9,LNT10 node | claude-haiku-5-5 | 2 | 1,126 | 4 | 36,387 | 34 |
| machine:node tests/scripts/anh-co-that-kho.mjs | claude-haiku-5-5 | 12 | 552 | 24 | 478,248 | 1007 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 415 | 4 | 3,057 | 4054 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 405 | 4 | 36,362 | 7 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 213 | 4 | 36,337 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 36,392 | 81 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 3,057 | 544 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 156 | 4 | 35,843 | 20 |
| capture:provenance | claude-sonnet-5-5 | 2 | 149 | 4 | 32,059 | 7 |


wall: 7163s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 156 | 35,843 | 20 | 10:38:02 | 10:38:22 |
| machine | 13 | 14,959 | 1,009,753 | 7039 | 10:38:02 | 12:35:21 |
| review | 3 | 6,596 | 3,194,077 | 171 | 10:38:02 | 10:40:54 |
| triage | 1 | 4,225 | 37,848 | 39 | 12:35:24 | 12:36:03 |
| capture | 1 | 149 | 32,059 | 7 | 12:36:06 | 12:36:13 |
| synthesize | 1 | 10,316 | 178,862 | 70 | 12:36:15 | 12:37:25 |

- **claude-sonnet-5-5**: 4 agent · 10 calls · out 14,846 · in 20 · cache_read 284,612 · cache_create 185,737
- **claude-opus-5-5**: 3 agent · 46 calls · out 6,596 · in 92 · cache_read 3,194,077 · cache_create 275,097
- **claude-haiku-5-5**: 13 agent · 42 calls · out 14,959 · in 84 · cache_read 1,009,753 · cache_create 597,942

