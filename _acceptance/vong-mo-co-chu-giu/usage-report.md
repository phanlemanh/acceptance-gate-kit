### S4 round 1 — wf_dda90633-8d8 (26 agent, 64,057 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 16,298 | 8 | 207,540 | 100 |
| review:measurement | claude-opus-5-5 | 18 | 9,678 | 36 | 1,787,715 | 387 |
| triage | claude-sonnet-5-5 | 2 | 9,571 | 4 | 39,651 | 71 |
| review:bugs | claude-opus-5-5 | 15 | 7,384 | 30 | 1,191,306 | 1210 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 3,505 | 12 | 147,985 | 820 |
| review:conventions | claude-opus-5-5 | 15 | 2,228 | 30 | 1,147,816 | 342 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,776 | 4 | 2,869 | 401 |
| judge:E10b:operational-feasibility | claude-sonnet-5-5 | 2 | 1,630 | 4 | 35,109 | 14 |
| judge:E10b:spec-alignment | claude-sonnet-5-5 | 2 | 1,568 | 4 | 35,107 | 79 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,508 | 4 | 34,705 | 86 |
| judge:E10b:domain-correctness | claude-sonnet-5-5 | 2 | 1,485 | 4 | 31,745 | 14 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,234 | 4 | 34,826 | 218 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,207 | 4 | 34,810 | 206 |
| refute:tin.test.mjs | claude-sonnet-5-5 | 4 | 1,161 | 8 | 110,796 | 21 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,075 | 4 | 34,761 | 99 |
| refute:hook-tin.mjs | claude-sonnet-5-5 | 4 | 734 | 8 | 106,140 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 581 | 4 | 31,845 | 207 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 494 | 4 | 34,731 | 9 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 213 | 4 | 34,706 | 7 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 190 | 4 | 69,970 | 235 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 34,761 | 93 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 169 | 4 | 2,869 | 552 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 30,623 | 10 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 26 | 4 | 34,705 | 10 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 12 | 4 | 2,869 | 579 |
| machine:node tests/dieu-phoi/tin-kenh-that.mjs | claude-haiku-5-5 | 2 | 7 | 4 | 34,721 | 9 |


wall: 3105s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 190 | 69,970 | 235 | 14:43:22 | 14:47:17 |
| machine | 14 | 11,980 | 501,163 | 2895 | 14:43:22 | 15:31:38 |
| judge | 3 | 4,683 | 101,961 | 82 | 14:43:22 | 14:44:44 |
| review | 3 | 19,290 | 4,126,837 | 1212 | 14:43:22 | 15:03:34 |
| triage | 1 | 9,571 | 39,651 | 71 | 15:31:39 | 15:32:50 |
| refute | 2 | 1,895 | 216,936 | 23 | 15:32:51 | 15:33:14 |
| capture | 1 | 150 | 30,623 | 10 | 15:33:16 | 15:33:25 |
| synthesize | 1 | 16,298 | 207,540 | 100 | 15:33:27 | 15:35:07 |

- **claude-sonnet-5-5**: 9 agent · 24 calls · out 32,787 · in 48 · cache_read 666,681 · cache_create 365,829
- **claude-opus-5-5**: 3 agent · 48 calls · out 19,290 · in 96 · cache_read 4,126,837 · cache_create 350,954
- **claude-haiku-5-5**: 14 agent · 32 calls · out 11,980 · in 64 · cache_read 501,163 · cache_create 593,654

