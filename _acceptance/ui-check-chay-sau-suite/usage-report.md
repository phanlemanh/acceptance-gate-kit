### S4 round 1 — wf_e91b4ca8-20c (28 agent, 35,959 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 9,019 | 8 | 199,096 | 57 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,906 | 4 | 2,973 | 523 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 5 | 2,836 | 10 | 208,690 | 40 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 2,705 | 10 | 152,547 | 741 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 4 | 2,674 | 8 | 154,220 | 28 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 4 | 2,499 | 8 | 158,339 | 24 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,801 | 4 | 2,973 | 560 |
| review:measurement | claude-opus-5-5 | 6 | 1,136 | 12 | 352,049 | 66 |
| machine:bash -c 'out=$(node tests/workflows/ui-c | claude-haiku-5-5 | 2 | 1,008 | 4 | 45,795 | 13 |
| machine:bash -c 'out=$(node tests/workflows/ui-c | claude-haiku-5-5 | 2 | 1,005 | 4 | 45,795 | 13 |
| machine:bash -c 'out=$(node tests/workflows/ui-c | claude-haiku-5-5 | 2 | 1,004 | 4 | 45,799 | 12 |
| machine:bash -c 'out=$(node tests/workflows/ui-c | claude-haiku-5-5 | 2 | 1,003 | 4 | 45,791 | 12 |
| triage | claude-sonnet-5-5 | 2 | 999 | 4 | 44,106 | 12 |
| machine:bash -c 'out=$(node tests/workflows/ui-c | claude-haiku-5-5 | 2 | 980 | 4 | 45,795 | 13 |
| machine:bash -c 'out=$(node tests/scripts/s4-arg | claude-haiku-5-5 | 2 | 734 | 4 | 45,801 | 13 |
| machine:bash -c 'out=$(node tests/scripts/s4-arg | claude-haiku-5-5 | 2 | 639 | 4 | 45,805 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 432 | 4 | 45,732 | 108 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 390 | 4 | 48,718 | 41 |
| review:conventions | claude-opus-5-5 | 12 | 325 | 24 | 822,635 | 152 |
| review:bugs | claude-opus-5-5 | 9 | 320 | 18 | 499,937 | 64 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 245 | 4 | 42,712 | 185 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 231 | 4 | 45,676 | 86 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 215 | 4 | 45,677 | 5 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 184 | 4 | 45,676 | 9 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 177 | 4 | 45,702 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 171 | 4 | 2,973 | 531 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 171 | 4 | 45,732 | 97 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 41,490 | 14 |


wall: 2963s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 390 | 48,718 | 41 | 15:27:37 | 15:28:18 |
| machine | 18 | 15,611 | 798,954 | 2873 | 15:27:37 | 16:15:30 |
| judge | 3 | 8,009 | 521,249 | 40 | 15:27:37 | 15:28:17 |
| review | 3 | 1,781 | 1,674,621 | 152 | 15:27:54 | 15:30:25 |
| triage | 1 | 999 | 44,106 | 12 | 16:15:32 | 16:15:44 |
| capture | 1 | 150 | 41,490 | 14 | 16:15:46 | 16:16:01 |
| synthesize | 1 | 9,019 | 199,096 | 57 | 16:16:03 | 16:17:00 |

- **claude-sonnet-5-5**: 7 agent · 23 calls · out 18,567 · in 46 · cache_read 854,659 · cache_create 405,351
- **claude-haiku-5-5**: 18 agent · 39 calls · out 15,611 · in 78 · cache_read 798,954 · cache_create 1,014,754
- **claude-opus-5-5**: 3 agent · 27 calls · out 1,781 · in 54 · cache_read 1,674,621 · cache_create 240,486

