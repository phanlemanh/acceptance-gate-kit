### S4 round 1 — wf_3bca2c75-093 (20 agent, 49,516 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 19 | 9,095 | 38 | 2,176,736 | 354 |
| triage | claude-sonnet-5-5 | 2 | 7,957 | 4 | 83,707 | 52 |
| review:measurement | claude-opus-5-5 | 23 | 4,777 | 46 | 2,548,125 | 218 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 4,399 | 4 | 114,153 | 83 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 4,256 | 8 | 206,865 | 627 |
| review:conventions | claude-opus-5-5 | 56 | 3,307 | 112 | 8,060,671 | 381 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 2,763 | 16 | 562,625 | 855 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,407 | 4 | 114,064 | 178 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,049 | 4 | 114,050 | 90 |
| review:bugs | claude-opus-5-5 | 57 | 1,817 | 114 | 7,477,034 | 361 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,659 | 4 | 114,050 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,473 | 4 | 114,059 | 187 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 1,251 | 4 | 114,397 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,101 | 4 | 79,124 | 136 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 321 | 4 | 34,982 | 317 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 280 | 4 | 0 | 530 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 165 | 4 | 114,051 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 77,854 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 145 | 4 | 114,106 | 72 |
| machine:bash -c 'c=$(git show 200ce7bb:diagram-d | claude-haiku-5-5 | 2 | 143 | 4 | 114,184 | 7 |


wall: 2920s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 280 | 0 | 530 | 03:25:44 | 03:34:34 |
| machine | 13 | 22,132 | 1,910,710 | 2500 | 03:25:44 | 04:07:24 |
| review | 3 | 9,901 | 18,085,830 | 381 | 03:25:44 | 03:32:05 |
| triage | 1 | 7,957 | 83,707 | 52 | 04:07:26 | 04:08:18 |
| capture | 1 | 151 | 77,854 | 7 | 04:08:20 | 04:08:27 |
| synthesize | 1 | 9,095 | 2,176,736 | 354 | 04:08:30 | 04:14:24 |

- **claude-sonnet-5-5**: 4 agent · 25 calls · out 17,483 · in 50 · cache_read 2,338,297 · cache_create 504,929
- **claude-opus-5-5**: 3 agent · 136 calls · out 9,901 · in 272 · cache_read 18,085,830 · cache_create 456,853
- **claude-haiku-5-5**: 13 agent · 34 calls · out 22,132 · in 68 · cache_read 1,910,710 · cache_create 940,948

