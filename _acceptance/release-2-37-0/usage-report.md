### S4 round 1 — wf_e65f8a0d-c15 (26 agent, 164,323 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E9:domain-correctness | claude-sonnet-5-5 | 11 | 28,282 | 22 | 1,087,026 | 188 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 9 | 21,948 | 18 | 760,094 | 151 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 8 | 21,444 | 16 | 677,199 | 148 |
| review:bugs | claude-opus-5-5 | 21 | 13,383 | 42 | 1,672,895 | 196 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,451 | 6 | 55,826 | 549 |
| synthesize:report | claude-sonnet-5-5 | 3 | 11,346 | 6 | 136,052 | 69 |
| review:conventions | claude-opus-5-5 | 21 | 9,142 | 42 | 1,690,114 | 157 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 8 | 6,690 | 16 | 383,490 | 580 |
| review:measurement | claude-opus-5-5 | 10 | 4,974 | 20 | 694,832 | 88 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 5 | 4,716 | 10 | 212,695 | 271 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 4,618 | 10 | 159,282 | 745 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,426 | 14 | 268,610 | 892 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,817 | 4 | 3,140 | 413 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,720 | 6 | 102,524 | 31 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,002 | 4 | 47,405 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,967 | 4 | 47,405 | 96 |
| triage | claude-sonnet-5-5 | 2 | 1,383 | 4 | 45,995 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,335 | 4 | 47,414 | 184 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 1,327 | 4 | 47,566 | 11 |
| machine:bash -c 'c=$(git show 4f891b07:diagram-d | claude-haiku-5-5 | 2 | 1,248 | 4 | 47,537 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,127 | 4 | 44,321 | 183 |
| machine:bash -c 'd=$(git diff --name-only 4f891b | claude-haiku-5-5 | 2 | 1,102 | 4 | 47,508 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 988 | 4 | 47,461 | 94 |
| machine:bash _acceptance/release-2-29-0/lop-chep | claude-haiku-5-5 | 2 | 720 | 4 | 47,433 | 9 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 682 | 4 | 47,406 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 485 | 4 | 43,031 | 10 |


wall: 3359s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 11,451 | 55,826 | 549 | 05:54:27 | 06:03:35 |
| machine | 16 | 40,485 | 1,601,197 | 3260 | 05:54:27 | 06:48:47 |
| judge | 3 | 71,674 | 2,524,319 | 188 | 05:54:27 | 05:57:35 |
| review | 3 | 27,499 | 4,057,841 | 199 | 05:54:27 | 05:57:45 |
| triage | 1 | 1,383 | 45,995 | 13 | 06:48:49 | 06:49:02 |
| capture | 1 | 485 | 43,031 | 10 | 06:49:04 | 06:49:14 |
| synthesize | 1 | 11,346 | 136,052 | 69 | 06:49:16 | 06:50:25 |

- **claude-sonnet-5-5**: 7 agent · 38 calls · out 96,339 · in 76 · cache_read 2,805,223 · cache_create 790,306
- **claude-opus-5-5**: 3 agent · 52 calls · out 27,499 · in 104 · cache_read 4,057,841 · cache_create 301,680
- **claude-haiku-5-5**: 16 agent · 50 calls · out 40,485 · in 100 · cache_read 1,601,197 · cache_create 940,705

### S4 round 2 — wf_53019d54-0c0 (26 agent, 149,638 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E9:domain-correctness | claude-sonnet-5-5 | 11 | 26,039 | 22 | 1,189,022 | 177 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 11 | 23,925 | 22 | 1,174,975 | 165 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 16 | 23,188 | 32 | 1,726,185 | 166 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,539 | 6 | 55,880 | 551 |
| synthesize:report | claude-sonnet-5-5 | 5 | 11,016 | 10 | 298,678 | 70 |
| review:bugs | claude-opus-5-5 | 18 | 8,399 | 36 | 1,199,513 | 139 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 8 | 7,981 | 16 | 389,144 | 591 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 5 | 5,735 | 10 | 215,033 | 268 |
| review:conventions | claude-opus-5-5 | 10 | 4,246 | 20 | 493,295 | 68 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 3,626 | 4 | 49,246 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 3,410 | 10 | 161,886 | 885 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,251 | 4 | 3,140 | 412 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,008 | 4 | 47,460 | 96 |
| review:measurement | claude-opus-5-5 | 5 | 1,964 | 10 | 218,856 | 38 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,949 | 4 | 47,460 | 15 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 1,658 | 10 | 159,094 | 621 |
| machine:bash -c 'd=$(git diff --name-only 4f891b | claude-haiku-5-5 | 2 | 1,428 | 4 | 47,563 | 11 |
| machine:bash -c 'c=$(git show 4f891b07:diagram-d | claude-haiku-5-5 | 2 | 1,185 | 4 | 47,592 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,145 | 4 | 47,516 | 97 |
| triage | claude-sonnet-5-5 | 2 | 1,116 | 4 | 45,696 | 15 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 1,074 | 4 | 47,621 | 9 |
| machine:bash _acceptance/release-2-29-0/lop-chep | claude-haiku-5-5 | 2 | 1,037 | 4 | 47,488 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 889 | 4 | 47,516 | 179 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 726 | 4 | 47,461 | 8 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 715 | 4 | 47,469 | 179 |
| capture:provenance | claude-sonnet-5-5 | 2 | 389 | 4 | 43,086 | 11 |


wall: 3242s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 11,539 | 55,880 | 551 | 06:53:19 | 07:02:30 |
| machine | 16 | 37,817 | 1,452,689 | 3141 | 06:53:19 | 07:45:40 |
| judge | 3 | 73,152 | 4,090,182 | 177 | 06:53:19 | 06:56:16 |
| review | 3 | 14,609 | 1,911,664 | 142 | 06:53:19 | 06:55:41 |
| triage | 1 | 1,116 | 45,696 | 15 | 07:45:42 | 07:45:56 |
| capture | 1 | 389 | 43,086 | 11 | 07:45:59 | 07:46:09 |
| synthesize | 1 | 11,016 | 298,678 | 70 | 07:46:11 | 07:47:21 |

- **claude-sonnet-5-5**: 7 agent · 50 calls · out 97,212 · in 100 · cache_read 4,533,522 · cache_create 852,488
- **claude-opus-5-5**: 3 agent · 33 calls · out 14,609 · in 66 · cache_read 1,911,664 · cache_create 210,996
- **claude-haiku-5-5**: 16 agent · 47 calls · out 37,817 · in 94 · cache_read 1,452,689 · cache_create 937,522

