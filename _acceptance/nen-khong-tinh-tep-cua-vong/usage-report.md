### S4 round 1 — wf_ec72d770-7c5 (24 agent, 47,411 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 12,222 | 8 | 186,577 | 68 |
| triage | claude-sonnet-5-5 | 2 | 4,270 | 4 | 37,673 | 31 |
| review:measurement | claude-opus-5-5 | 10 | 3,660 | 20 | 590,960 | 172 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 3,134 | 18 | 281,743 | 1046 |
| review:conventions | claude-opus-5-5 | 27 | 2,989 | 54 | 2,221,976 | 249 |
| machine:bash -c 'out=$(node tests/scripts/duong- | claude-haiku-5-5 | 2 | 2,184 | 4 | 35,832 | 247 |
| machine:bash -c 'out=$(node tests/scripts/duong- | claude-haiku-5-5 | 2 | 2,164 | 4 | 35,840 | 244 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,035 | 4 | 2,869 | 591 |
| machine:bash -c 'out=$(node tests/scripts/duong- | claude-haiku-5-5 | 2 | 1,999 | 4 | 35,786 | 245 |
| review:bugs | claude-opus-5-5 | 16 | 1,924 | 32 | 1,033,560 | 374 |
| machine:bash -c 'out=$(node tests/scripts/duong- | claude-haiku-5-5 | 2 | 1,916 | 4 | 35,821 | 243 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,572 | 4 | 2,869 | 492 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,513 | 4 | 35,581 | 90 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,346 | 4 | 35,581 | 11 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 822 | 4 | 32,721 | 295 |
| machine:bash -c 'out=$(node tests/scripts/gate-c | claude-haiku-5-5 | 2 | 644 | 4 | 35,819 | 38 |
| machine:bash -c 'out=$(node tests/scripts/gate-c | claude-haiku-5-5 | 2 | 556 | 4 | 35,709 | 28 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 536 | 4 | 38,655 | 38 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 424 | 4 | 35,607 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 418 | 4 | 35,637 | 146 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 383 | 4 | 35,637 | 79 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 334 | 4 | 2,869 | 371 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 215 | 4 | 35,582 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 31,499 | 8 |


wall: 3271s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 536 | 38,655 | 38 | 09:56:07 | 09:56:46 |
| machine | 17 | 21,659 | 751,503 | 3158 | 09:56:07 | 10:48:45 |
| review | 3 | 8,573 | 3,846,496 | 378 | 09:56:07 | 10:02:25 |
| triage | 1 | 4,270 | 37,673 | 31 | 10:48:48 | 10:49:18 |
| capture | 1 | 151 | 31,499 | 8 | 10:49:21 | 10:49:28 |
| synthesize | 1 | 12,222 | 186,577 | 68 | 10:49:31 | 10:50:38 |

- **claude-sonnet-5-5**: 4 agent · 10 calls · out 17,179 · in 20 · cache_read 294,404 · cache_create 195,940
- **claude-opus-5-5**: 3 agent · 53 calls · out 8,573 · in 106 · cache_read 3,846,496 · cache_create 292,105
- **claude-haiku-5-5**: 17 agent · 41 calls · out 21,659 · in 82 · cache_read 751,503 · cache_create 729,774

