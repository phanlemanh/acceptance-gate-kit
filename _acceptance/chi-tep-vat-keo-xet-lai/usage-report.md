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

