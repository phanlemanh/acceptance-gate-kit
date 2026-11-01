### S4 round 1 — wf_eb25585e-68f (26 agent, 64,174 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 10 | 8,457 | 20 | 505,503 | 113 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,892 | 4 | 53,626 | 41 |
| review:bugs | claude-opus-5-5 | 9 | 7,665 | 18 | 453,795 | 129 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 7,118 | 6 | 96,071 | 48 |
| review:measurement | claude-opus-5-5 | 5 | 4,185 | 10 | 203,557 | 78 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,178 | 16 | 252,157 | 872 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,926 | 4 | 3,140 | 533 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,780 | 4 | 3,140 | 441 |
| triage | claude-sonnet-5-5 | 2 | 2,351 | 4 | 39,153 | 18 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,026 | 4 | 39,085 | 92 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,767 | 4 | 39,085 | 11 |
| refute:evidence-core.cjs | claude-sonnet-5-5 | 4 | 1,534 | 8 | 123,908 | 17 |
| refute:chi-tep-vat-keo-xet-lai.test.mjs | claude-sonnet-5-5 | 2 | 1,194 | 4 | 38,188 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,032 | 4 | 39,141 | 112 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 943 | 4 | 39,292 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 937 | 4 | 39,141 | 78 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 901 | 4 | 39,271 | 13 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 887 | 4 | 39,292 | 14 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 833 | 4 | 39,275 | 8 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 810 | 4 | 39,274 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 710 | 4 | 3,140 | 445 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 701 | 4 | 39,274 | 9 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 693 | 4 | 39,111 | 5 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 650 | 4 | 39,094 | 155 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 639 | 4 | 39,086 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 365 | 4 | 34,738 | 5 |


wall: 2860s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,118 | 96,071 | 48 | 18:47:39 | 18:48:28 |
| machine | 17 | 23,413 | 770,998 | 2771 | 18:47:39 | 19:33:50 |
| review | 3 | 20,307 | 1,162,855 | 132 | 18:47:39 | 18:49:52 |
| triage | 1 | 2,351 | 39,153 | 18 | 19:33:52 | 19:34:10 |
| refute | 2 | 2,728 | 162,096 | 17 | 19:34:12 | 19:34:29 |
| capture | 1 | 365 | 34,738 | 5 | 19:34:31 | 19:34:36 |
| synthesize | 1 | 7,892 | 53,626 | 41 | 19:34:38 | 19:35:19 |

- **claude-opus-5-5**: 3 agent · 24 calls · out 20,307 · in 48 · cache_read 1,162,855 · cache_create 207,306
- **claude-sonnet-5-5**: 6 agent · 15 calls · out 20,454 · in 30 · cache_read 385,684 · cache_create 287,401
- **claude-haiku-5-5**: 17 agent · 40 calls · out 23,413 · in 80 · cache_read 770,998 · cache_create 776,847

### S4 round 2 — wf_02472945-5b5 (24 agent, 58,311 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 8 | 7,635 | 16 | 347,063 | 100 |
| review:conventions | claude-opus-5-5 | 9 | 7,280 | 18 | 468,879 | 103 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,232 | 4 | 51,525 | 41 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 7,189 | 6 | 96,440 | 49 |
| review:measurement | claude-opus-5-5 | 6 | 4,476 | 12 | 262,637 | 77 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 4,135 | 18 | 301,417 | 997 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,399 | 12 | 166,993 | 640 |
| triage | claude-sonnet-5-5 | 2 | 2,082 | 4 | 38,849 | 18 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,997 | 4 | 39,260 | 282 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,966 | 4 | 39,246 | 93 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,841 | 4 | 39,246 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,001 | 4 | 3,140 | 461 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 950 | 4 | 39,453 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 942 | 4 | 39,302 | 114 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 884 | 4 | 39,453 | 14 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 878 | 4 | 39,435 | 9 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 812 | 4 | 39,432 | 13 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 773 | 4 | 39,272 | 6 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 770 | 4 | 39,436 | 7 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 755 | 4 | 39,435 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 691 | 4 | 36,115 | 164 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 649 | 4 | 39,302 | 80 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 613 | 4 | 39,247 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 361 | 4 | 34,899 | 7 |


wall: 2947s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,189 | 96,440 | 49 | 20:43:14 | 20:44:03 |
| machine | 17 | 22,056 | 1,019,184 | 2875 | 20:43:14 | 21:31:09 |
| review | 3 | 19,391 | 1,078,579 | 103 | 20:43:14 | 20:44:58 |
| triage | 1 | 2,082 | 38,849 | 18 | 21:31:11 | 21:31:28 |
| capture | 1 | 361 | 34,899 | 7 | 21:31:31 | 21:31:38 |
| synthesize | 1 | 7,232 | 51,525 | 41 | 21:31:40 | 21:32:21 |

- **claude-opus-5-5**: 3 agent · 23 calls · out 19,391 · in 46 · cache_read 1,078,579 · cache_create 204,806
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 16,864 · in 18 · cache_read 221,713 · cache_create 200,728
- **claude-haiku-5-5**: 17 agent · 45 calls · out 22,056 · in 90 · cache_read 1,019,184 · cache_create 750,820

### S4 round 3 — wf_b82dd001-f4b (24 agent, 63,238 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 11 | 8,540 | 22 | 594,985 | 134 |
| synthesize:report | claude-sonnet-5-5 | 2 | 8,234 | 4 | 53,069 | 46 |
| review:conventions | claude-opus-5-5 | 14 | 7,707 | 28 | 844,952 | 103 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 7,262 | 6 | 100,078 | 50 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,271 | 12 | 169,511 | 825 |
| triage | claude-sonnet-5-5 | 3 | 4,024 | 6 | 85,835 | 29 |
| review:measurement | claude-opus-5-5 | 4 | 3,438 | 8 | 138,659 | 42 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 5 | 2,032 | 10 | 124,791 | 798 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,914 | 4 | 39,213 | 94 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,887 | 4 | 39,227 | 314 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 1,883 | 8 | 83,539 | 614 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,815 | 4 | 39,213 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,325 | 4 | 39,222 | 183 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 1,147 | 4 | 39,440 | 16 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 1,062 | 4 | 39,432 | 15 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 1,003 | 4 | 39,402 | 9 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 984 | 4 | 39,405 | 14 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 927 | 4 | 39,409 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 816 | 4 | 39,269 | 126 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 683 | 4 | 39,408 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 666 | 4 | 39,269 | 90 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 637 | 4 | 39,239 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 618 | 4 | 39,214 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 363 | 4 | 34,866 | 5 |


wall: 3175s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,262 | 100,078 | 50 | 00:20:02 | 00:20:51 |
| machine | 17 | 23,670 | 928,203 | 3089 | 00:20:02 | 01:11:30 |
| review | 3 | 19,685 | 1,578,596 | 137 | 00:20:02 | 00:22:18 |
| triage | 1 | 4,024 | 85,835 | 29 | 01:11:32 | 01:12:01 |
| capture | 1 | 363 | 34,866 | 5 | 01:12:03 | 01:12:08 |
| synthesize | 1 | 8,234 | 53,069 | 46 | 01:12:11 | 01:12:57 |

- **claude-opus-5-5**: 3 agent · 29 calls · out 19,685 · in 58 · cache_read 1,578,596 · cache_create 208,497
- **claude-sonnet-5-5**: 4 agent · 10 calls · out 19,883 · in 20 · cache_read 273,848 · cache_create 204,410
- **claude-haiku-5-5**: 17 agent · 43 calls · out 23,670 · in 86 · cache_read 928,203 · cache_create 740,645

### S4 round 3 (chấm lại vì hạ tầng) — wf_056a8f2c-f24 (24 agent, 48,514 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 8 | 8,440 | 16 | 383,272 | 150 |
| synthesize:report | claude-sonnet-5-5 | 2 | 5,349 | 4 | 48,324 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,997 | 16 | 252,066 | 1047 |
| review:measurement | claude-opus-5-5 | 6 | 4,556 | 12 | 263,684 | 65 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 3,699 | 8 | 83,788 | 698 |
| review:conventions | claude-opus-5-5 | 8 | 3,247 | 16 | 350,670 | 45 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,936 | 4 | 39,169 | 92 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,780 | 4 | 39,183 | 288 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,766 | 4 | 39,169 | 11 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,320 | 4 | 39,178 | 169 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 1,225 | 6 | 43,092 | 679 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 972 | 4 | 39,388 | 14 |
| refute:chi-tep-vat-keo-xet-lai.test.mjs | claude-sonnet-5-5 | 4 | 940 | 8 | 119,428 | 12 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 931 | 4 | 39,361 | 13 |
| triage | claude-sonnet-5-5 | 2 | 920 | 4 | 38,143 | 8 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 866 | 4 | 39,365 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 861 | 4 | 39,225 | 113 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 853 | 4 | 39,364 | 9 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 829 | 4 | 39,396 | 15 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 734 | 4 | 39,195 | 6 |
| machine:bash -c 'out=$(node tests/scripts/chi-te | claude-haiku-5-5 | 2 | 706 | 4 | 39,358 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 689 | 4 | 39,225 | 88 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 535 | 4 | 39,170 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 363 | 4 | 34,822 | 5 |


wall: 3281s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 17 | 24,699 | 928,692 | 3217 | 03:03:26 | 03:57:03 |
| review | 3 | 16,243 | 997,626 | 152 | 03:03:26 | 03:05:58 |
| triage | 1 | 920 | 38,143 | 8 | 03:57:05 | 03:57:13 |
| refute | 1 | 940 | 119,428 | 12 | 03:57:16 | 03:57:28 |
| capture | 1 | 363 | 34,822 | 5 | 03:57:30 | 03:57:35 |
| synthesize | 1 | 5,349 | 48,324 | 30 | 03:57:37 | 03:58:07 |

- **claude-opus-5-5**: 3 agent · 22 calls · out 16,243 · in 44 · cache_read 997,626 · cache_create 193,210
- **claude-sonnet-5-5**: 4 agent · 10 calls · out 7,572 · in 20 · cache_read 240,717 · cache_create 185,698
- **claude-haiku-5-5**: 17 agent · 43 calls · out 24,699 · in 86 · cache_read 928,692 · cache_create 745,409

