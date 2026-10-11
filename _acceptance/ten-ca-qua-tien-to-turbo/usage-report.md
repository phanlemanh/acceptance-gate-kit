### S4 round 1 — wf_2313e44b-843 (21 agent, 33,000 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 8 | 7,804 | 16 | 815,707 | 107 |
| triage | claude-sonnet-5-5 | 2 | 5,008 | 4 | 84,457 | 35 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 3,208 | 14 | 521,303 | 780 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,494 | 4 | 69,964 | 424 |
| review:conventions | claude-opus-5-5 | 30 | 2,155 | 60 | 3,999,182 | 294 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,836 | 4 | 117,122 | 219 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,826 | 4 | 117,108 | 87 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,696 | 4 | 117,108 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,343 | 4 | 117,117 | 191 |
| review:measurement | claude-opus-5-5 | 12 | 1,083 | 24 | 1,243,094 | 134 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 810 | 4 | 117,164 | 128 |
| machine:GG_CASES=AC-2 node tests/scripts/ten-ca- | claude-haiku-5-5 | 2 | 570 | 4 | 117,141 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 562 | 4 | 117,109 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 515 | 4 | 117,164 | 75 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 457 | 4 | 117,164 | 299 |
| machine:GG_CASES=AC-3 node tests/scripts/ten-ca- | claude-haiku-5-5 | 2 | 343 | 4 | 117,141 | 5 |
| review:bugs | claude-opus-5-5 | 19 | 316 | 38 | 2,114,289 | 194 |
| machine:GG_CASES=AC-4 node tests/scripts/ten-ca- | claude-haiku-5-5 | 2 | 305 | 4 | 117,141 | 6 |
| machine:GG_CASES=AC-1 node tests/scripts/ten-ca- | claude-haiku-5-5 | 2 | 283 | 4 | 117,141 | 5 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 252 | 4 | 85,833 | 25 |
| capture:provenance | claude-sonnet-5-5 | 2 | 134 | 4 | 115,753 | 9 |


wall: 2397s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 252 | 85,833 | 25 | 10:27:05 | 10:27:31 |
| machine | 14 | 16,248 | 1,996,887 | 2240 | 10:27:05 | 11:04:26 |
| review | 3 | 3,554 | 7,356,565 | 294 | 10:27:05 | 10:31:59 |
| triage | 1 | 5,008 | 84,457 | 35 | 11:04:28 | 11:05:02 |
| capture | 1 | 134 | 115,753 | 9 | 11:05:05 | 11:05:13 |
| synthesize | 1 | 7,804 | 815,707 | 107 | 11:05:15 | 11:07:03 |

- **claude-sonnet-5-5**: 4 agent · 14 calls · out 13,198 · in 28 · cache_read 1,101,750 · cache_create 330,657
- **claude-haiku-5-5**: 14 agent · 33 calls · out 16,248 · in 66 · cache_read 1,996,887 · cache_create 845,523
- **claude-opus-5-5**: 3 agent · 61 calls · out 3,554 · in 122 · cache_read 7,356,565 · cache_create 323,672

