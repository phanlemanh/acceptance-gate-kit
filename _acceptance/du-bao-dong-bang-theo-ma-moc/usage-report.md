### S4 round 1 — wf_ad743f2f-f1a (19 agent, 21,263 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 5,218 | 4 | 43,774 | 32 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,672 | 4 | 2,869 | 435 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,407 | 4 | 36,510 | 271 |
| review:measurement | claude-opus-5-5 | 10 | 2,315 | 20 | 547,616 | 113 |
| machine:env GM_CASES=DB node tests/scripts/lo-tr | claude-haiku-5-5 | 2 | 1,824 | 4 | 36,522 | 13 |
| review:conventions | claude-opus-5-5 | 14 | 1,673 | 28 | 865,470 | 124 |
| review:bugs | claude-opus-5-5 | 14 | 1,259 | 28 | 792,543 | 130 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 638 | 6 | 40,076 | 681 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 582 | 4 | 33,636 | 147 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 524 | 4 | 36,552 | 87 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 423 | 4 | 36,522 | 5 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 387 | 4 | 36,497 | 5 |
| machine:node tests/scripts/lo-trinh-gio-may.test | claude-haiku-5-5 | 2 | 307 | 4 | 36,510 | 18 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 218 | 4 | 36,496 | 79 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 186 | 4 | 36,496 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 174 | 4 | 36,552 | 73 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 2,869 | 432 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 32,417 | 6 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 136 | 4 | 36,204 | 26 |


wall: 2296s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 136 | 36,204 | 26 | 04:37:27 | 04:37:53 |
| machine | 13 | 10,515 | 408,107 | 2252 | 04:37:27 | 05:14:59 |
| review | 3 | 5,247 | 2,205,629 | 132 | 04:37:27 | 04:39:40 |
| capture | 1 | 147 | 32,417 | 6 | 05:15:03 | 05:15:08 |
| synthesize | 1 | 5,218 | 43,774 | 32 | 05:15:11 | 05:15:43 |

- **claude-sonnet-5-5**: 3 agent · 6 calls · out 5,501 · in 12 · cache_read 112,395 · cache_create 131,644
- **claude-haiku-5-5**: 13 agent · 27 calls · out 10,515 · in 54 · cache_read 408,107 · cache_create 558,446
- **claude-opus-5-5**: 3 agent · 38 calls · out 5,247 · in 76 · cache_read 2,205,629 · cache_create 249,469

