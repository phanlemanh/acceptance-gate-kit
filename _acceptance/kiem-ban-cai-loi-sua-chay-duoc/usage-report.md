### S4 round 1 — wf_1c6de649-35c (27 agent, 131,795 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 13 | 18,179 | 26 | 968,002 | 228 |
| review:measurement | claude-opus-5-5 | 12 | 17,419 | 24 | 831,274 | 231 |
| review:bugs | claude-opus-5-5 | 13 | 16,756 | 26 | 927,113 | 221 |
| review:measurement | claude-opus-5-5 | 7 | 12,046 | 14 | 376,676 | 141 |
| review:conventions | claude-opus-5-5 | 9 | 11,099 | 18 | 523,270 | 133 |
| synthesize:report | claude-sonnet-5-5 | 2 | 10,987 | 4 | 54,805 | 62 |
| review:conventions | claude-opus-5-5 | 6 | 6,759 | 12 | 285,177 | 96 |
| triage | claude-sonnet-5-5 | 2 | 6,441 | 4 | 40,781 | 46 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,566 | 16 | 247,741 | 972 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,175 | 4 | 0 | 557 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 3,085 | 4 | 38,050 | 21 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,266 | 4 | 3,140 | 361 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,179 | 4 | 38,393 | 90 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs | claude-haiku-5-5 | 2 | 1,912 | 4 | 38,152 | 241 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs | claude-haiku-5-5 | 2 | 1,813 | 4 | 38,409 | 197 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,759 | 4 | 38,393 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,565 | 4 | 35,005 | 189 |
| triage | claude-sonnet-5-5 | 2 | 1,321 | 4 | 40,614 | 11 |
| machine:node tests/scripts/kiem-ban-cai-loi-sua. | claude-haiku-5-5 | 2 | 1,096 | 4 | 38,157 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,005 | 4 | 38,449 | 110 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 990 | 4 | 38,419 | 9 |
| machine:node tests/scripts/kiem-ban-cai-loi-sua. | claude-haiku-5-5 | 2 | 953 | 4 | 38,414 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 914 | 4 | 3,140 | 572 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 823 | 4 | 38,449 | 79 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 751 | 4 | 38,394 | 10 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 1 | 489 | 2 | 3,140 | 38 |
| capture:provenance | claude-sonnet-5-5 | 2 | 447 | 4 | 34,046 | 6 |


wall: 4106s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,085 | 38,050 | 21 | 03:08:50 | 03:09:11 |
| machine | 16 | 27,256 | 675,795 | 3972 | 03:08:50 | 04:15:02 |
| review | 6 | 82,258 | 3,911,512 | 2389 | 03:08:50 | 03:48:39 |
| triage | 2 | 7,762 | 81,395 | 59 | 04:15:04 | 04:16:03 |
| capture | 1 | 447 | 34,046 | 6 | 04:16:05 | 04:16:11 |
| synthesize | 1 | 10,987 | 54,805 | 62 | 04:16:13 | 04:17:16 |

- **claude-opus-5-5**: 6 agent · 60 calls · out 82,258 · in 120 · cache_read 3,911,512 · cache_create 535,418
- **claude-sonnet-5-5**: 5 agent · 10 calls · out 22,281 · in 20 · cache_read 208,296 · cache_create 239,636
- **claude-haiku-5-5**: 16 agent · 37 calls · out 27,256 · in 74 · cache_read 675,795 · cache_create 728,783

