### S4 round 1 — wf_ebe2817a-8c5 (24 agent, 57,741 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| baseline:diffBase | claude-sonnet-5-5 | 3 | 7,455 | 6 | 100,618 | 238 |
| synthesize:report | claude-sonnet-5-5 | 2 | 6,648 | 4 | 50,747 | 39 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 11 | 5,567 | 22 | 387,480 | 1294 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 15 | 5,501 | 30 | 594,874 | 1219 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 13 | 5,026 | 26 | 490,702 | 1578 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 14 | 4,698 | 28 | 524,045 | 1388 |
| review:measurement | claude-opus-5-5 | 6 | 3,427 | 12 | 261,305 | 41 |
| review:bugs | claude-opus-5-5 | 9 | 2,934 | 18 | 420,340 | 357 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,877 | 4 | 39,184 | 126 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,792 | 4 | 39,184 | 23 |
| review:conventions | claude-opus-5-5 | 6 | 1,760 | 12 | 229,009 | 42 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,305 | 4 | 39,144 | 315 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 1,238 | 4 | 39,386 | 12 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 964 | 4 | 39,365 | 306 |
| triage | claude-sonnet-5-5 | 2 | 963 | 4 | 37,431 | 11 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 940 | 4 | 39,422 | 13 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 913 | 4 | 39,387 | 10 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 864 | 4 | 39,398 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 829 | 4 | 39,240 | 301 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 754 | 4 | 39,398 | 16 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 704 | 4 | 39,240 | 279 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 623 | 4 | 39,210 | 7 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 590 | 4 | 39,185 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 369 | 4 | 34,840 | 7 |


wall: 6625s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,455 | 100,618 | 238 | 15:50:18 | 15:54:16 |
| machine | 17 | 34,185 | 2,507,844 | 6560 | 15:50:18 | 17:39:39 |
| review | 3 | 8,121 | 910,654 | 359 | 15:50:19 | 15:56:17 |
| triage | 1 | 963 | 37,431 | 11 | 17:39:42 | 17:39:53 |
| capture | 1 | 369 | 34,840 | 7 | 17:39:55 | 17:40:02 |
| synthesize | 1 | 6,648 | 50,747 | 39 | 17:40:04 | 17:40:43 |

- **claude-sonnet-5-5**: 4 agent · 9 calls · out 15,435 · in 18 · cache_read 223,636 · cache_create 195,317
- **claude-haiku-5-5**: 17 agent · 79 calls · out 34,185 · in 158 · cache_read 2,507,844 · cache_create 800,723
- **claude-opus-5-5**: 3 agent · 21 calls · out 8,121 · in 42 · cache_read 910,654 · cache_create 168,675

### S4 round 2 — wf_75eaa330-f10 (24 agent, 46,989 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| baseline:diffBase | claude-sonnet-5-5 | 3 | 7,453 | 6 | 97,415 | 232 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,243 | 4 | 52,583 | 43 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 5,116 | 18 | 290,375 | 1102 |
| review:bugs | claude-opus-5-5 | 9 | 3,522 | 18 | 423,370 | 244 |
| review:conventions | claude-opus-5-5 | 6 | 2,245 | 12 | 233,923 | 27 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,927 | 4 | 39,194 | 100 |
| review:measurement | claude-opus-5-5 | 4 | 1,926 | 8 | 131,611 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,892 | 4 | 3,140 | 375 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 1,869 | 6 | 42,983 | 678 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,820 | 4 | 39,194 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 1,766 | 8 | 86,894 | 764 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 1,011 | 4 | 39,459 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 983 | 4 | 39,250 | 188 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 959 | 4 | 39,250 | 155 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 942 | 4 | 39,435 | 12 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 873 | 4 | 39,423 | 9 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 791 | 4 | 39,435 | 7 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 769 | 4 | 39,424 | 7 |
| triage | claude-sonnet-5-5 | 2 | 725 | 4 | 41,224 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 723 | 4 | 39,195 | 6 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 719 | 4 | 39,402 | 195 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 686 | 4 | 39,220 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 658 | 4 | 36,041 | 168 |
| capture:provenance | claude-sonnet-5-5 | 2 | 371 | 4 | 34,850 | 6 |


wall: 3638s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,453 | 97,415 | 232 | 21:52:07 | 21:55:59 |
| machine | 17 | 23,504 | 931,314 | 3575 | 21:52:07 | 22:51:42 |
| review | 3 | 7,693 | 788,904 | 245 | 21:52:07 | 21:56:12 |
| triage | 1 | 725 | 41,224 | 8 | 22:51:44 | 22:51:52 |
| capture | 1 | 371 | 34,850 | 6 | 22:51:54 | 22:52:01 |
| synthesize | 1 | 7,243 | 52,583 | 43 | 22:52:02 | 22:52:46 |

- **claude-sonnet-5-5**: 4 agent · 9 calls · out 15,792 · in 18 · cache_read 226,072 · cache_create 195,853
- **claude-haiku-5-5**: 17 agent · 44 calls · out 23,504 · in 88 · cache_read 931,314 · cache_create 780,360
- **claude-opus-5-5**: 3 agent · 19 calls · out 7,693 · in 38 · cache_read 788,904 · cache_create 175,269

### S4 round 3 — wf_a929d3cc-62b (23 agent, 40,962 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| baseline:diffBase | claude-sonnet-5-5 | 3 | 7,477 | 6 | 100,682 | 236 |
| synthesize:report | claude-sonnet-5-5 | 2 | 6,215 | 4 | 49,178 | 35 |
| review:conventions | claude-opus-5-5 | 9 | 3,149 | 18 | 412,615 | 48 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,950 | 4 | 3,140 | 561 |
| review:measurement | claude-opus-5-5 | 3 | 2,215 | 6 | 87,828 | 25 |
| review:bugs | claude-opus-5-5 | 7 | 2,198 | 14 | 271,504 | 39 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 2,126 | 10 | 83,321 | 1037 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,995 | 4 | 39,157 | 92 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,790 | 4 | 39,171 | 305 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,199 | 4 | 39,166 | 197 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 1,005 | 4 | 39,420 | 9 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 870 | 4 | 39,408 | 9 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 860 | 4 | 39,444 | 11 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 833 | 4 | 39,420 | 12 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 827 | 4 | 39,387 | 226 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 799 | 4 | 39,157 | 9 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 738 | 4 | 39,183 | 6 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 729 | 4 | 39,409 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 726 | 4 | 39,213 | 106 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 694 | 4 | 39,213 | 75 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 634 | 4 | 3,140 | 607 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 3 | 564 | 8 | 78,613 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 369 | 4 | 34,813 | 5 |


wall: 3064s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,477 | 100,682 | 236 | 01:15:09 | 01:19:05 |
| machine | 17 | 19,339 | 678,962 | 3020 | 01:15:09 | 02:05:29 |
| review | 3 | 7,562 | 771,947 | 48 | 01:15:09 | 01:15:58 |
| capture | 1 | 369 | 34,813 | 5 | 02:05:31 | 02:05:36 |
| synthesize | 1 | 6,215 | 49,178 | 35 | 02:05:38 | 02:06:13 |

- **claude-sonnet-5-5**: 3 agent · 7 calls · out 14,061 · in 14 · cache_read 184,673 · cache_create 149,459
- **claude-opus-5-5**: 3 agent · 19 calls · out 7,562 · in 38 · cache_read 771,947 · cache_create 172,538
- **claude-haiku-5-5**: 17 agent · 38 calls · out 19,339 · in 78 · cache_read 678,962 · cache_create 781,009

