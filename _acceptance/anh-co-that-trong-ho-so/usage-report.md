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

### S4 round 2 — wf_5f77dca6-9b9 (19 agent, 35,467 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 11,471 | 10 | 242,965 | 76 |
| triage | claude-sonnet-5-5 | 2 | 5,428 | 4 | 38,600 | 44 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 10 | 2,731 | 20 | 316,773 | 870 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,682 | 4 | 3,057 | 496 |
| review:measurement | claude-opus-5-5 | 8 | 2,275 | 16 | 455,329 | 149 |
| review:bugs | claude-opus-5-5 | 11 | 2,045 | 22 | 613,283 | 148 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,804 | 4 | 6,114 | 333 |
| review:conventions | claude-opus-5-5 | 31 | 1,705 | 62 | 2,327,845 | 766 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,512 | 4 | 36,351 | 85 |
| machine:env LNT_CASES=LNT7,LNT8,LNT9,LNT10 node | claude-haiku-5-5 | 2 | 1,151 | 4 | 36,402 | 32 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 546 | 4 | 36,377 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 504 | 4 | 36,352 | 7 |
| machine:node tests/scripts/anh-co-that-kho.mjs | claude-haiku-5-5 | 3 | 407 | 6 | 77,201 | 37 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 261 | 4 | 36,407 | 111 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 241 | 4 | 36,351 | 10 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 215 | 4 | 33,303 | 173 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 36,407 | 83 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 169 | 4 | 6,114 | 540 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 32,074 | 11 |


wall: 2875s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 13 | 12,396 | 697,209 | 2738 | 12:44:10 | 13:29:48 |
| review | 3 | 6,025 | 3,396,457 | 766 | 12:44:10 | 12:56:56 |
| triage | 1 | 5,428 | 38,600 | 44 | 13:29:51 | 13:30:34 |
| capture | 1 | 147 | 32,074 | 11 | 13:30:37 | 13:30:48 |
| synthesize | 1 | 11,471 | 242,965 | 76 | 13:30:50 | 13:32:06 |

- **claude-sonnet-5-5**: 3 agent · 9 calls · out 17,046 · in 18 · cache_read 313,639 · cache_create 160,360
- **claude-haiku-5-5**: 13 agent · 35 calls · out 12,396 · in 70 · cache_read 697,209 · cache_create 587,441
- **claude-opus-5-5**: 3 agent · 50 calls · out 6,025 · in 100 · cache_read 3,396,457 · cache_create 373,229

