### S4 round 1 — wf_b3578f7a-fc3 (20 agent, 21,034 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 4,122 | 8 | 362,008 | 45 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,435 | 4 | 136,023 | 224 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,925 | 4 | 69,964 | 319 |
| review:conventions | claude-opus-5-5 | 19 | 1,636 | 38 | 2,274,778 | 184 |
| baseline:diffBase | claude-sonnet-5-5 | 10 | 1,465 | 20 | 655,205 | 1535 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,344 | 4 | 136,009 | 11 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,317 | 4 | 136,009 | 56 |
| review:measurement | claude-opus-5-5 | 7 | 1,300 | 14 | 720,014 | 185 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,230 | 4 | 136,018 | 144 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,010 | 4 | 136,077 | 93 |
| triage | claude-sonnet-5-5 | 2 | 903 | 4 | 102,238 | 11 |
| review:bugs | claude-opus-5-5 | 13 | 523 | 26 | 1,455,337 | 242 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 425 | 4 | 136,065 | 82 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 303 | 4 | 136,065 | 69 |
| machine:bash scripts/rel-cua-so.sh 9d1ae527 lenh | claude-haiku-5-5 | 2 | 246 | 4 | 136,057 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 220 | 4 | 136,023 | 221 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 172 | 4 | 136,065 | 269 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 159 | 4 | 136,010 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 156 | 4 | 100,285 | 8 |
| machine:bash -c 'c=$(git show 9d1ae527:diagram-d | claude-haiku-5-5 | 2 | 143 | 4 | 136,144 | 6 |


wall: 1590s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,465 | 655,205 | 1535 | 17:37:53 | 18:03:28 |
| machine | 13 | 10,929 | 1,702,529 | 1416 | 17:37:53 | 18:01:29 |
| review | 3 | 3,459 | 4,450,129 | 245 | 17:37:53 | 17:41:58 |
| triage | 1 | 903 | 102,238 | 11 | 18:01:30 | 18:01:41 |
| capture | 1 | 156 | 100,285 | 8 | 18:03:29 | 18:03:37 |
| synthesize | 1 | 4,122 | 362,008 | 45 | 18:03:38 | 18:04:23 |

- **claude-sonnet-5-5**: 4 agent · 18 calls · out 6,646 · in 36 · cache_read 1,219,736 · cache_create 794,245
- **claude-haiku-5-5**: 13 agent · 26 calls · out 10,929 · in 52 · cache_read 1,702,529 · cache_create 1,017,980
- **claude-opus-5-5**: 3 agent · 39 calls · out 3,459 · in 78 · cache_read 4,450,129 · cache_create 333,289

### S4 round 2 — wf_3cb83770-8ae (19 agent, 17,636 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 3,471 | 8 | 359,206 | 44 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,033 | 4 | 134,025 | 199 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,836 | 4 | 134,025 | 310 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,660 | 4 | 134,011 | 12 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,508 | 4 | 134,011 | 56 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,321 | 4 | 134,020 | 128 |
| review:conventions | claude-opus-5-5 | 15 | 1,143 | 30 | 1,652,939 | 224 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,036 | 4 | 134,079 | 88 |
| triage | claude-sonnet-5-5 | 2 | 790 | 4 | 100,330 | 11 |
| review:bugs | claude-opus-5-5 | 11 | 716 | 22 | 1,176,029 | 173 |
| machine:bash scripts/rel-cua-so.sh 9d1ae527 lenh | claude-haiku-5-5 | 2 | 483 | 4 | 134,059 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 459 | 4 | 134,067 | 78 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 321 | 4 | 134,025 | 207 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 160 | 4 | 134,012 | 5 |
| review:measurement | claude-opus-5-5 | 9 | 157 | 18 | 960,427 | 106 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 98,287 | 8 |
| machine:bash -c 'c=$(git show 9d1ae527:diagram-d | claude-haiku-5-5 | 2 | 143 | 4 | 134,146 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 125 | 4 | 134,067 | 60 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 134,067 | 259 |


wall: 1392s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 13 | 11,208 | 1,742,614 | 1326 | 18:07:56 | 18:30:03 |
| review | 3 | 2,016 | 3,789,395 | 224 | 18:07:56 | 18:11:40 |
| triage | 1 | 790 | 100,330 | 11 | 18:30:04 | 18:30:15 |
| capture | 1 | 151 | 98,287 | 8 | 18:30:16 | 18:30:23 |
| synthesize | 1 | 3,471 | 359,206 | 44 | 18:30:25 | 18:31:09 |

- **claude-sonnet-5-5**: 3 agent · 8 calls · out 4,412 · in 16 · cache_read 557,823 · cache_create 342,513
- **claude-haiku-5-5**: 13 agent · 26 calls · out 11,208 · in 52 · cache_read 1,742,614 · cache_create 923,003
- **claude-opus-5-5**: 3 agent · 35 calls · out 2,016 · in 70 · cache_read 3,789,395 · cache_create 311,895

### S4 round 3 — wf_e61b44c8-5f0 (19 agent, 22,255 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 4,214 | 8 | 364,288 | 46 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,479 | 4 | 134,038 | 209 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,164 | 4 | 134,038 | 193 |
| review:conventions | claude-opus-5-5 | 16 | 1,892 | 32 | 1,814,559 | 164 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,704 | 4 | 134,038 | 308 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,506 | 4 | 134,111 | 85 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,502 | 4 | 134,024 | 12 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,487 | 4 | 134,024 | 57 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,256 | 4 | 134,033 | 121 |
| triage | claude-sonnet-5-5 | 2 | 1,108 | 4 | 100,335 | 12 |
| review:measurement | claude-opus-5-5 | 6 | 869 | 12 | 600,776 | 165 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 574 | 4 | 134,080 | 74 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 429 | 4 | 134,080 | 243 |
| machine:bash scripts/rel-cua-so.sh 9d1ae527 lenh | claude-haiku-5-5 | 2 | 377 | 4 | 134,072 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 98,300 | 10 |
| machine:bash -c 'c=$(git show 9d1ae527:diagram-d | claude-haiku-5-5 | 2 | 144 | 4 | 134,159 | 7 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 139 | 4 | 134,025 | 5 |
| review:bugs | claude-opus-5-5 | 9 | 135 | 18 | 953,399 | 157 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 124 | 4 | 134,080 | 58 |


wall: 1364s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 13 | 13,885 | 1,742,802 | 1292 | 18:34:28 | 18:56:00 |
| review | 3 | 2,896 | 3,368,734 | 169 | 18:34:28 | 18:37:17 |
| triage | 1 | 1,108 | 100,335 | 12 | 18:56:01 | 18:56:13 |
| capture | 1 | 152 | 98,300 | 10 | 18:56:15 | 18:56:25 |
| synthesize | 1 | 4,214 | 364,288 | 46 | 18:56:26 | 18:57:12 |

- **claude-sonnet-5-5**: 3 agent · 8 calls · out 5,474 · in 16 · cache_read 562,923 · cache_create 344,837
- **claude-haiku-5-5**: 13 agent · 26 calls · out 13,885 · in 52 · cache_read 1,742,802 · cache_create 922,988
- **claude-opus-5-5**: 3 agent · 31 calls · out 2,896 · in 62 · cache_read 3,368,734 · cache_create 312,001

