### S4 round 1 — wf_b3c63106-ceb (27 agent, 101,011 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 20 | 14,430 | 40 | 1,468,579 | 266 |
| review:conventions | claude-opus-5-5 | 17 | 10,233 | 34 | 1,246,598 | 158 |
| synthesize:report | claude-sonnet-5-5 | 3 | 9,950 | 6 | 117,969 | 60 |
| review:measurement | claude-opus-5-5 | 6 | 9,044 | 12 | 282,490 | 96 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 8,835 | 6 | 99,418 | 65 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,682 | 16 | 247,867 | 955 |
| machine:bash -c 'out=$(node tests/workflows/doi- | claude-haiku-5-5 | 3 | 4,897 | 6 | 79,374 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,293 | 4 | 3,140 | 436 |
| triage | claude-sonnet-5-5 | 2 | 2,950 | 4 | 38,499 | 24 |
| machine:bash -c 'out=$(node tests/workflows/doi- | claude-haiku-5-5 | 2 | 2,909 | 4 | 38,540 | 17 |
| machine:bash -c 'out=$(node tests/workflows/doi- | claude-haiku-5-5 | 2 | 2,665 | 4 | 38,552 | 17 |
| machine:bash -c 'out=$(node tests/workflows/doi- | claude-haiku-5-5 | 2 | 2,603 | 4 | 38,540 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,317 | 4 | 3,140 | 411 |
| machine:bash -c 'out=$(node tests/workflows/doi- | claude-haiku-5-5 | 2 | 2,301 | 4 | 38,548 | 14 |
| machine:bash -c 'out=$(node tests/workflows/doi- | claude-haiku-5-5 | 2 | 2,259 | 4 | 38,540 | 15 |
| machine:bash -c 'out=$(node tests/workflows/doi- | claude-haiku-5-5 | 2 | 2,247 | 4 | 38,548 | 14 |
| machine:bash -c 'out=$(node tests/workflows/doi- | claude-haiku-5-5 | 2 | 2,212 | 4 | 38,548 | 15 |
| machine:bash -c 'out=$(node tests/workflows/doi- | claude-haiku-5-5 | 2 | 2,114 | 4 | 38,544 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,064 | 4 | 38,422 | 91 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,480 | 4 | 38,478 | 116 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,337 | 4 | 38,431 | 151 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,241 | 4 | 38,478 | 175 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 934 | 4 | 38,422 | 9 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 894 | 4 | 38,448 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 836 | 4 | 38,423 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 834 | 4 | 38,478 | 82 |
| capture:provenance | claude-sonnet-5-5 | 2 | 450 | 4 | 34,079 | 9 |


wall: 2559s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 8,835 | 99,418 | 65 | 08:37:22 | 08:38:27 |
| machine | 20 | 45,119 | 949,461 | 2459 | 08:37:22 | 09:18:22 |
| review | 3 | 33,707 | 2,997,667 | 284 | 08:37:22 | 08:42:07 |
| triage | 1 | 2,950 | 38,499 | 24 | 09:18:24 | 09:18:49 |
| capture | 1 | 450 | 34,079 | 9 | 09:18:51 | 09:19:00 |
| synthesize | 1 | 9,950 | 117,969 | 60 | 09:19:02 | 09:20:02 |

- **claude-opus-5-5**: 3 agent · 43 calls · out 33,707 · in 86 · cache_read 2,997,667 · cache_create 281,522
- **claude-sonnet-5-5**: 4 agent · 10 calls · out 22,185 · in 20 · cache_read 289,965 · cache_create 205,673
- **claude-haiku-5-5**: 20 agent · 47 calls · out 45,119 · in 94 · cache_read 949,461 · cache_create 855,184

### S4 round 2 — wf_6aac0858-325 (17 agent, 80,292 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 26 | 19,040 | 52 | 2,202,094 | 337 |
| review:bugs | claude-opus-5-5 | 18 | 15,253 | 36 | 1,367,270 | 269 |
| review:measurement | claude-opus-5-5 | 10 | 12,881 | 20 | 586,970 | 142 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,393 | 4 | 54,063 | 48 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,917 | 14 | 205,938 | 936 |
| triage | claude-sonnet-5-5 | 2 | 3,541 | 4 | 39,288 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 3,391 | 8 | 83,088 | 1309 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,383 | 4 | 3,140 | 418 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,990 | 4 | 38,426 | 92 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,888 | 4 | 38,426 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,398 | 4 | 35,295 | 154 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,217 | 4 | 38,482 | 110 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 960 | 4 | 38,427 | 7 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 927 | 4 | 38,452 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 880 | 4 | 38,482 | 76 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 771 | 4 | 3,140 | 575 |
| capture:provenance | claude-sonnet-5-5 | 2 | 462 | 4 | 34,083 | 10 |


wall: 3812s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 11 | 21,722 | 561,296 | 3718 | 11:05:27 | 12:07:25 |
| review | 3 | 47,174 | 4,156,334 | 337 | 11:05:27 | 11:11:04 |
| triage | 1 | 3,541 | 39,288 | 28 | 12:07:27 | 12:07:55 |
| capture | 1 | 462 | 34,083 | 10 | 12:07:59 | 12:08:08 |
| synthesize | 1 | 7,393 | 54,063 | 48 | 12:08:11 | 12:08:59 |

- **claude-opus-5-5**: 3 agent · 54 calls · out 47,174 · in 108 · cache_read 4,156,334 · cache_create 311,729
- **claude-sonnet-5-5**: 3 agent · 6 calls · out 11,396 · in 12 · cache_read 127,434 · cache_create 150,227
- **claude-haiku-5-5**: 11 agent · 29 calls · out 21,722 · in 58 · cache_read 561,296 · cache_create 552,302

