### S4 round 1 — wf_b0ab341f-608 (15 agent, 88,380 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 21,365 | 4 | 113,743 | 196 |
| triage | claude-sonnet-5 | 2 | 21,038 | 4 | 101,453 | 209 |
| review:measurement | claude-opus-5 | 7 | 9,694 | 14 | 755,344 | 140 |
| baseline:diffBase | claude-sonnet-5 | 11 | 8,735 | 22 | 1,089,224 | 168 |
| review:bugs | claude-opus-5 | 14 | 8,477 | 28 | 1,563,929 | 305 |
| review:conventions | claude-opus-5 | 15 | 5,811 | 30 | 1,791,572 | 136 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 2,316 | 34 | 174,851 | 636 |
| machine:bash -c 'out=$({ node tests/scripts/ntr- | claude-haiku-4-5-20251001 | 2 | 2,304 | 18 | 95,235 | 59 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,862 | 42 | 314,025 | 39 |
| machine:bash -c 'out=$(node tests/scripts/hskt.t | claude-haiku-4-5-20251001 | 2 | 1,787 | 18 | 95,267 | 87 |
| machine:bash -c 'out=$(node tests/scripts/consum | claude-haiku-4-5-20251001 | 2 | 1,467 | 18 | 95,163 | 23 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 907 | 18 | 27,323 | 503 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 905 | 18 | 95,048 | 17 |
| capture:provenance | claude-sonnet-5 | 2 | 863 | 4 | 95,043 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 849 | 18 | 95,055 | 14 |


wall: 1638s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 8,735 | 1,089,224 | 168 | 02:48:14 | 02:51:02 |
| machine | 8 | 12,397 | 991,967 | 1214 | 02:48:14 | 03:08:28 |
| review | 3 | 23,982 | 4,110,845 | 310 | 02:48:14 | 02:53:24 |
| triage | 1 | 21,038 | 101,453 | 209 | 03:08:29 | 03:11:59 |
| capture | 1 | 863 | 95,043 | 14 | 03:12:00 | 03:12:14 |
| synthesize | 1 | 21,365 | 113,743 | 196 | 03:12:16 | 03:15:32 |

- **claude-sonnet-5**: 4 agent · 17 calls · out 52,001 · in 34 · cache_read 1,399,463 · cache_create 417,190
- **claude-opus-5**: 3 agent · 36 calls · out 23,982 · in 72 · cache_read 4,110,845 · cache_create 331,445
- **claude-haiku-4-5-20251001**: 8 agent · 21 calls · out 12,397 · in 184 · cache_read 991,967 · cache_create 502,973

### S4 round 2 — wf_44842fad-025 (13 agent, 61,971 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 12 | 24,367 | 24 | 1,482,306 | 244 |
| triage | claude-sonnet-5 | 4 | 11,610 | 8 | 325,438 | 126 |
| review:measurement | claude-opus-5 | 9 | 5,742 | 18 | 868,677 | 117 |
| review:conventions | claude-opus-5 | 8 | 4,794 | 16 | 738,804 | 104 |
| machine:bash -c 'out=$({ node tests/scripts/ntr- | claude-haiku-4-5-20251001 | 2 | 3,009 | 18 | 95,241 | 77 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 8 | 2,838 | 66 | 515,254 | 643 |
| review:bugs | claude-opus-5 | 8 | 2,725 | 16 | 780,458 | 105 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,983 | 58 | 462,237 | 40 |
| machine:bash -c 'out=$(node tests/scripts/hskt.t | claude-haiku-4-5-20251001 | 2 | 1,649 | 18 | 95,273 | 75 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 940 | 18 | 27,323 | 489 |
| capture:provenance | claude-sonnet-5 | 2 | 888 | 4 | 95,043 | 14 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 719 | 18 | 95,054 | 15 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 707 | 18 | 95,061 | 11 |


wall: 1591s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 7 | 11,845 | 1,385,443 | 1203 | 03:40:45 | 04:00:48 |
| review | 3 | 13,261 | 2,387,939 | 121 | 03:40:45 | 03:42:46 |
| triage | 1 | 11,610 | 325,438 | 126 | 04:00:49 | 04:02:56 |
| capture | 1 | 888 | 95,043 | 14 | 04:02:57 | 04:03:11 |
| synthesize | 1 | 24,367 | 1,482,306 | 244 | 04:03:12 | 04:07:16 |

- **claude-sonnet-5**: 3 agent · 18 calls · out 36,865 · in 36 · cache_read 1,902,787 · cache_create 379,219
- **claude-opus-5**: 3 agent · 25 calls · out 13,261 · in 50 · cache_read 2,387,939 · cache_create 278,825
- **claude-haiku-4-5-20251001**: 7 agent · 25 calls · out 11,845 · in 214 · cache_read 1,385,443 · cache_create 501,347

### S4 round 3 — wf_22ecac43-538 (14 agent, 44,784 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 4 | 13,184 | 8 | 374,873 | 123 |
| triage | claude-sonnet-5 | 4 | 6,195 | 8 | 319,275 | 69 |
| baseline:diffBase | claude-sonnet-5 | 8 | 5,639 | 16 | 717,324 | 122 |
| review:bugs | claude-opus-5 | 9 | 4,438 | 18 | 882,661 | 65 |
| machine:bash -c 'out=$({ node tests/scripts/ntr- | claude-haiku-4-5-20251001 | 2 | 2,983 | 18 | 95,249 | 66 |
| review:measurement | claude-opus-5 | 4 | 2,453 | 8 | 333,611 | 30 |
| review:conventions | claude-opus-5 | 4 | 2,236 | 8 | 294,249 | 28 |
| machine:bash -c 'out=$(node tests/scripts/hskt.t | claude-haiku-4-5-20251001 | 2 | 1,687 | 18 | 95,306 | 68 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,591 | 42 | 144,796 | 1066 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,282 | 42 | 318,164 | 30 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 1,026 | 18 | 54,646 | 429 |
| capture:provenance | claude-sonnet-5 | 2 | 731 | 4 | 95,047 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 673 | 18 | 95,069 | 11 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 666 | 18 | 95,062 | 14 |


wall: 1768s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 5,639 | 717,324 | 122 | 05:48:47 | 05:50:49 |
| machine | 7 | 9,908 | 898,292 | 1556 | 05:48:47 | 06:14:43 |
| review | 3 | 9,127 | 1,510,521 | 66 | 05:48:47 | 05:49:54 |
| triage | 1 | 6,195 | 319,275 | 69 | 06:14:45 | 06:15:53 |
| capture | 1 | 731 | 95,047 | 14 | 06:15:56 | 06:16:10 |
| synthesize | 1 | 13,184 | 374,873 | 123 | 06:16:12 | 06:18:15 |

- **claude-sonnet-5**: 4 agent · 18 calls · out 25,749 · in 36 · cache_read 1,506,519 · cache_create 481,155
- **claude-opus-5**: 3 agent · 17 calls · out 9,127 · in 34 · cache_read 1,510,521 · cache_create 276,732
- **claude-haiku-4-5-20251001**: 7 agent · 20 calls · out 9,908 · in 174 · cache_read 898,292 · cache_create 530,596

