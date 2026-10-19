### S4 round 1 — wf_b70af490-8ab (24 agent, 31,249 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| triage | claude-sonnet-5-5 | 2 | 4,354 | 4 | 36,674 | 32 |
| review:conventions | claude-opus-5-5 | 18 | 3,858 | 36 | 1,283,699 | 130 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 3,148 | 14 | 199,096 | 782 |
| review:measurement | claude-opus-5-5 | 12 | 3,046 | 24 | 872,796 | 192 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 2,601 | 4 | 35,491 | 76 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,050 | 4 | 5,946 | 382 |
| refute:tin-khong-mat-dau.test.mjs | claude-sonnet-5-5 | 6 | 1,775 | 12 | 198,758 | 31 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,513 | 4 | 35,377 | 83 |
| review:bugs | claude-opus-5-5 | 18 | 1,235 | 36 | 1,446,793 | 221 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,227 | 4 | 35,482 | 209 |
| refute:tin-khong-mat-dau.test.mjs | claude-sonnet-5-5 | 7 | 1,195 | 14 | 228,871 | 31 |
| refute:tin-khong-mat-dau.test.mjs | claude-sonnet-5-5 | 5 | 841 | 10 | 159,222 | 23 |
| refute:tin-khong-mat-dau.test.mjs | claude-sonnet-5-5 | 5 | 812 | 10 | 143,887 | 16 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 667 | 4 | 35,378 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 535 | 4 | 35,386 | 187 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 492 | 4 | 35,433 | 76 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 474 | 4 | 35,433 | 98 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 421 | 4 | 35,403 | 5 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 343 | 4 | 5,946 | 514 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 5,946 | 539 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 167 | 4 | 35,153 | 198 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 161 | 4 | 35,377 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 149 | 4 | 31,192 | 4 |
| synthesize:report | claude-sonnet-5-5 | 2 | 10 | 4 | 51,044 | 72 |


wall: 2839s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 167 | 35,153 | 198 | 14:36:10 | 14:39:28 |
| machine | 13 | 13,807 | 535,694 | 2693 | 14:36:10 | 15:21:03 |
| review | 3 | 8,139 | 3,603,288 | 222 | 14:36:10 | 14:39:52 |
| triage | 1 | 4,354 | 36,674 | 32 | 15:21:04 | 15:21:36 |
| refute | 4 | 4,623 | 730,738 | 32 | 15:21:38 | 15:22:10 |
| capture | 1 | 149 | 31,192 | 4 | 15:22:12 | 15:22:16 |
| synthesize | 1 | 10 | 51,044 | 72 | 15:22:17 | 15:23:29 |

- **claude-sonnet-5-5**: 8 agent · 31 calls · out 9,303 · in 62 · cache_read 884,801 · cache_create 348,427
- **claude-opus-5-5**: 3 agent · 48 calls · out 8,139 · in 96 · cache_read 3,603,288 · cache_create 329,960
- **claude-haiku-5-5**: 13 agent · 31 calls · out 13,807 · in 62 · cache_read 535,694 · cache_create 566,939

### S4 round 2 — wf_d27a88b7-7c0 (22 agent, 34,079 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 11,420 | 12 | 299,271 | 83 |
| review:measurement | claude-opus-5-5 | 13 | 3,901 | 26 | 884,749 | 193 |
| triage | claude-sonnet-5-5 | 2 | 2,974 | 4 | 35,590 | 25 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 2,786 | 10 | 117,619 | 779 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,450 | 4 | 5,946 | 520 |
| review:bugs | claude-opus-5-5 | 13 | 2,080 | 26 | 646,952 | 169 |
| review:conventions | claude-opus-5-5 | 10 | 1,614 | 20 | 474,795 | 90 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,248 | 4 | 35,507 | 216 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,028 | 4 | 35,402 | 80 |
| refute:tin-khong-mat-dau.test.mjs | claude-sonnet-5-5 | 2 | 1,021 | 4 | 34,411 | 15 |
| refute:tin-khong-mat-dau.test.mjs | claude-sonnet-5-5 | 3 | 975 | 6 | 72,672 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 583 | 4 | 35,411 | 179 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 441 | 4 | 35,428 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 259 | 4 | 35,458 | 93 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 222 | 4 | 5,946 | 410 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 215 | 4 | 35,403 | 5 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 182 | 4 | 35,402 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 174 | 4 | 2,973 | 520 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 35,458 | 78 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 168 | 4 | 35,178 | 197 |
| capture:provenance | claude-sonnet-5-5 | 2 | 153 | 4 | 31,217 | 10 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 12 | 4 | 35,516 | 79 |


wall: 2832s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 168 | 35,178 | 197 | 15:29:47 | 15:33:05 |
| machine | 13 | 9,773 | 451,469 | 2691 | 15:29:47 | 16:14:38 |
| review | 3 | 7,595 | 2,006,496 | 194 | 15:29:47 | 15:33:01 |
| triage | 1 | 2,974 | 35,590 | 25 | 16:14:40 | 16:15:05 |
| refute | 2 | 1,996 | 107,083 | 18 | 16:15:06 | 16:15:24 |
| capture | 1 | 153 | 31,217 | 10 | 16:15:25 | 16:15:35 |
| synthesize | 1 | 11,420 | 299,271 | 83 | 16:15:36 | 16:16:59 |

- **claude-sonnet-5-5**: 6 agent · 17 calls · out 16,711 · in 34 · cache_read 508,339 · cache_create 273,273
- **claude-opus-5-5**: 3 agent · 36 calls · out 7,595 · in 72 · cache_read 2,006,496 · cache_create 216,138
- **claude-haiku-5-5**: 13 agent · 29 calls · out 9,773 · in 58 · cache_read 451,469 · cache_create 567,073

### S4 round 3 — wf_0acd037e-68c (20 agent, 31,625 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 10,107 | 10 | 235,981 | 64 |
| review:measurement | claude-opus-5-5 | 8 | 5,933 | 16 | 436,870 | 208 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 3,044 | 14 | 194,091 | 815 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,263 | 4 | 2,973 | 502 |
| review:conventions | claude-opus-5-5 | 10 | 1,699 | 20 | 553,864 | 92 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 35,562 | 83 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,479 | 4 | 35,676 | 78 |
| triage | claude-sonnet-5-5 | 2 | 1,357 | 4 | 34,496 | 11 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,134 | 4 | 35,667 | 217 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 601 | 4 | 35,588 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 520 | 4 | 32,598 | 198 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 460 | 4 | 2,973 | 546 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 258 | 4 | 35,618 | 93 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 217 | 4 | 5,946 | 390 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 212 | 4 | 35,563 | 4 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 183 | 4 | 35,562 | 8 |
| review:bugs | claude-opus-5-5 | 14 | 182 | 28 | 803,044 | 189 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 170 | 4 | 35,618 | 76 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 167 | 4 | 35,338 | 199 |
| capture:provenance | claude-sonnet-5-5 | 2 | 155 | 4 | 31,377 | 5 |


wall: 2820s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 167 | 35,338 | 199 | 21:56:01 | 21:59:20 |
| machine | 13 | 12,025 | 523,435 | 2734 | 21:56:01 | 22:41:35 |
| review | 3 | 7,814 | 1,793,778 | 210 | 21:56:01 | 21:59:30 |
| triage | 1 | 1,357 | 34,496 | 11 | 22:41:37 | 22:41:48 |
| capture | 1 | 155 | 31,377 | 5 | 22:41:50 | 22:41:56 |
| synthesize | 1 | 10,107 | 235,981 | 64 | 22:41:57 | 22:43:01 |

- **claude-sonnet-5-5**: 4 agent · 11 calls · out 11,786 · in 22 · cache_read 337,192 · cache_create 186,691
- **claude-opus-5-5**: 3 agent · 32 calls · out 7,814 · in 64 · cache_read 1,793,778 · cache_create 254,087
- **claude-haiku-5-5**: 13 agent · 31 calls · out 12,025 · in 62 · cache_read 523,435 · cache_create 581,556

