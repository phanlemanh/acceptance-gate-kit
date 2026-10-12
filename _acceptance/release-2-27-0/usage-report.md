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

### S4 round 2 — wf_4f762b22-e26 (23 agent, 61,258 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 9 | 10,251 | 18 | 955,066 | 104 |
| synthesize:report | claude-sonnet-5-5 | 21 | 9,029 | 42 | 2,903,436 | 225 |
| triage | claude-sonnet-5-5 | 2 | 6,325 | 4 | 83,901 | 44 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 4,025 | 4 | 114,405 | 85 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 3,658 | 8 | 206,136 | 632 |
| review:bugs | claude-opus-5-5 | 56 | 3,337 | 112 | 7,775,816 | 378 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,962 | 12 | 380,234 | 855 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,574 | 4 | 114,316 | 180 |
| review:conventions | claude-opus-5-5 | 42 | 2,408 | 84 | 5,382,865 | 257 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 8 | 2,374 | 16 | 798,377 | 63 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 7 | 2,214 | 14 | 660,924 | 72 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,090 | 4 | 114,302 | 89 |
| review:measurement | claude-opus-5-5 | 20 | 1,962 | 40 | 2,267,835 | 183 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 1,831 | 4 | 114,649 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,796 | 4 | 114,302 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,323 | 4 | 114,311 | 192 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 945 | 4 | 114,358 | 137 |
| machine:bash -c 'c=$(git show 200ce7bb:diagram-d | claude-haiku-5-5 | 2 | 621 | 4 | 114,436 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 480 | 4 | 114,358 | 74 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 476 | 4 | 114,303 | 6 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 283 | 4 | 35,115 | 526 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 78,106 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 144 | 4 | 34,982 | 317 |


wall: 2799s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 283 | 35,115 | 526 | 04:36:14 | 04:45:00 |
| machine | 13 | 22,925 | 1,765,092 | 2516 | 04:36:14 | 05:18:10 |
| judge | 3 | 14,839 | 2,414,367 | 107 | 04:36:14 | 04:38:01 |
| review | 3 | 7,707 | 15,426,516 | 378 | 04:36:14 | 04:42:32 |
| triage | 1 | 6,325 | 83,901 | 44 | 05:18:12 | 05:18:56 |
| capture | 1 | 150 | 78,106 | 7 | 05:18:58 | 05:19:05 |
| synthesize | 1 | 9,029 | 2,903,436 | 225 | 05:19:07 | 05:22:53 |

- **claude-sonnet-5-5**: 7 agent · 51 calls · out 30,626 · in 102 · cache_read 5,514,925 · cache_create 863,091
- **claude-haiku-5-5**: 13 agent · 32 calls · out 22,925 · in 64 · cache_read 1,765,092 · cache_create 902,398
- **claude-opus-5-5**: 3 agent · 118 calls · out 7,707 · in 236 · cache_read 15,426,516 · cache_create 384,232

