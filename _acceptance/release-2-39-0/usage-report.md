### S4 round 1 — wf_2ae2bf11-a62 (28 agent, 120,273 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 8 | 15,148 | 16 | 668,692 | 107 |
| review:bugs | claude-opus-5-5 | 37 | 15,017 | 74 | 3,968,937 | 294 |
| review:conventions | claude-opus-5-5 | 23 | 12,678 | 46 | 2,023,860 | 175 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 8 | 12,277 | 16 | 653,800 | 97 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 12,226 | 6 | 134,307 | 75 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 9 | 10,349 | 18 | 738,469 | 89 |
| review:measurement | claude-opus-5-5 | 14 | 10,085 | 28 | 1,144,934 | 132 |
| synthesize:report | claude-sonnet-5-5 | 2 | 8,905 | 4 | 62,881 | 68 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,385 | 6 | 106,233 | 31 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 2,698 | 8 | 163,733 | 15 |
| refute:eval-yaml.js | claude-sonnet-5-5 | 3 | 1,410 | 6 | 98,222 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,389 | 4 | 48,778 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 1,358 | 6 | 102,038 | 10 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,184 | 4 | 48,764 | 8 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,136 | 4 | 48,764 | 7 |
| machine:bash _acceptance/release-2-39-0/ba-viec- | claude-haiku-5-5 | 2 | 1,134 | 4 | 48,781 | 8 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,042 | 4 | 48,773 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 998 | 4 | 48,778 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 994 | 4 | 48,778 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 993 | 4 | 45,520 | 7 |
| machine:GIT_GLOB_PATHSPECS=1 bash _acceptance/re | claude-haiku-5-5 | 2 | 945 | 4 | 48,902 | 7 |
| machine:bash _acceptance/release-2-38-0/lop-chep | claude-haiku-5-5 | 2 | 908 | 4 | 48,792 | 7 |
| triage | claude-sonnet-5-5 | 2 | 850 | 4 | 46,871 | 13 |
| machine:bash -c 'c=$(git show 88d31b63:diagram-d | claude-haiku-5-5 | 2 | 770 | 4 | 48,896 | 7 |
| machine:bash _acceptance/release-2-39-0/goi-chi- | claude-haiku-5-5 | 2 | 723 | 4 | 48,789 | 6 |
| machine:node _acceptance/release-2-39-0/su-mo-ta | claude-haiku-5-5 | 2 | 691 | 4 | 48,780 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 624 | 4 | 48,765 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 356 | 4 | 44,252 | 9 |


wall: 407s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| judge | 3 | 37,774 | 2,060,961 | 112 | 14:24:26 | 14:26:18 |
| review | 3 | 37,780 | 7,137,731 | 300 | 14:24:26 | 14:29:26 |
| baseline | 1 | 12,226 | 134,307 | 75 | 14:24:26 | 14:25:40 |
| machine | 17 | 20,972 | 1,051,864 | 114 | 14:24:26 | 14:26:19 |
| triage | 1 | 850 | 46,871 | 13 | 14:29:26 | 14:29:39 |
| refute | 1 | 1,410 | 98,222 | 16 | 14:29:39 | 14:29:55 |
| capture | 1 | 356 | 44,252 | 9 | 14:29:55 | 14:30:04 |
| synthesize | 1 | 8,905 | 62,881 | 68 | 14:30:04 | 14:31:12 |

- **claude-sonnet-5-5**: 8 agent · 37 calls · out 61,521 · in 74 · cache_read 2,447,494 · cache_create 733,674
- **claude-opus-5-5**: 3 agent · 74 calls · out 37,780 · in 148 · cache_read 7,137,731 · cache_create 371,843
- **claude-haiku-5-5**: 17 agent · 38 calls · out 20,972 · in 76 · cache_read 1,051,864 · cache_create 863,884

### S4 round 2 — wf_fbc4008d-f2b (26 agent, 139,493 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E9:spec-alignment | claude-sonnet-5-5 | 10 | 19,708 | 20 | 871,490 | 132 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 6 | 18,478 | 12 | 387,717 | 127 |
| review:conventions | claude-opus-5-5 | 34 | 16,440 | 68 | 3,640,404 | 284 |
| review:bugs | claude-opus-5-5 | 25 | 15,089 | 50 | 2,343,338 | 232 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 10 | 12,874 | 20 | 820,838 | 93 |
| review:measurement | claude-opus-5-5 | 16 | 11,913 | 32 | 1,361,889 | 175 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,750 | 4 | 60,562 | 44 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,625 | 16 | 341,739 | 964 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 5,472 | 18 | 393,671 | 1092 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,428 | 16 | 366,418 | 905 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,634 | 6 | 106,939 | 30 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 2,130 | 6 | 106,955 | 92 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,016 | 4 | 48,904 | 99 |
| triage | claude-sonnet-5-5 | 2 | 1,736 | 4 | 48,109 | 14 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,693 | 4 | 48,904 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,388 | 4 | 48,913 | 279 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,166 | 4 | 45,660 | 204 |
| machine:bash _acceptance/release-2-39-0/ba-viec- | claude-haiku-5-5 | 2 | 1,090 | 4 | 48,921 | 8 |
| machine:GIT_GLOB_PATHSPECS=1 bash _acceptance/re | claude-haiku-5-5 | 3 | 1,086 | 8 | 102,941 | 8 |
| machine:bash _acceptance/release-2-38-0/lop-chep | claude-haiku-5-5 | 2 | 912 | 4 | 48,932 | 7 |
| machine:bash -c 'c=$(git show 88d31b63:diagram-d | claude-haiku-5-5 | 2 | 823 | 4 | 49,036 | 7 |
| machine:node _acceptance/release-2-39-0/su-mo-ta | claude-haiku-5-5 | 2 | 808 | 4 | 48,920 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 653 | 4 | 48,960 | 121 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 630 | 4 | 48,905 | 5 |
| machine:bash _acceptance/release-2-39-0/goi-chi- | claude-haiku-5-5 | 2 | 602 | 4 | 48,929 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 349 | 4 | 44,392 | 5 |


wall: 3871s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| judge | 3 | 51,060 | 2,080,045 | 133 | 22:50:29 | 22:52:43 |
| review | 3 | 43,442 | 7,345,631 | 284 | 22:50:29 | 22:55:14 |
| machine | 17 | 35,156 | 1,953,647 | 3808 | 22:50:29 | 23:53:57 |
| triage | 1 | 1,736 | 48,109 | 14 | 23:53:57 | 23:54:11 |
| capture | 1 | 349 | 44,392 | 5 | 23:54:11 | 23:54:16 |
| synthesize | 1 | 7,750 | 60,562 | 44 | 23:54:16 | 23:55:00 |

- **claude-sonnet-5-5**: 6 agent · 32 calls · out 60,895 · in 64 · cache_read 2,233,108 · cache_create 609,799
- **claude-opus-5-5**: 3 agent · 75 calls · out 43,442 · in 150 · cache_read 7,345,631 · cache_create 388,112
- **claude-haiku-5-5**: 17 agent · 56 calls · out 35,156 · in 114 · cache_read 1,953,647 · cache_create 1,039,727

