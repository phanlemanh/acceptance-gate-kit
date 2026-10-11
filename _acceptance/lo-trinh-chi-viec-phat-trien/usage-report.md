### S4 round 1 — wf_1eb3542b-cf7 (25 agent, 137,731 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E9:spec-alignment | claude-sonnet-5-5 | 2 | 34,535 | 4 | 133,208 | 239 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 2 | 34,161 | 4 | 98,316 | 236 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 2 | 24,407 | 4 | 133,210 | 175 |
| synthesize:report | claude-sonnet-5-5 | 3 | 12,244 | 6 | 256,482 | 89 |
| triage | claude-sonnet-5-5 | 2 | 7,152 | 4 | 103,593 | 58 |
| review:measurement | claude-opus-5-5 | 17 | 3,067 | 34 | 2,701,168 | 370 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,815 | 4 | 133,012 | 156 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 2,697 | 4 | 133,006 | 151 |
| review:conventions | claude-opus-5-5 | 33 | 2,621 | 66 | 5,833,514 | 338 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,390 | 4 | 133,012 | 229 |
| review:bugs | claude-opus-5-5 | 19 | 2,067 | 38 | 2,906,449 | 259 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,735 | 4 | 132,998 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,526 | 4 | 34,982 | 544 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,488 | 4 | 132,998 | 84 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,272 | 4 | 98,025 | 126 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 5 | 1,168 | 10 | 449,409 | 27 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 3 | 861 | 6 | 205,006 | 17 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 5 | 788 | 10 | 467,671 | 23 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 166 | 4 | 132,999 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 96,803 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 146 | 4 | 34,982 | 326 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 125 | 4 | 133,054 | 77 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 111 | 4 | 100,018 | 123 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 4 | 32 | 8 | 352,393 | 27 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 6 | 4 | 133,054 | 82 |


wall: 1863s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 111 | 100,018 | 123 | 10:08:49 | 10:10:52 |
| machine | 11 | 14,366 | 1,232,122 | 1664 | 10:08:49 | 10:36:33 |
| judge | 3 | 93,103 | 364,734 | 242 | 10:08:49 | 10:12:51 |
| review | 3 | 7,755 | 11,441,131 | 372 | 10:08:49 | 10:15:00 |
| triage | 1 | 7,152 | 103,593 | 58 | 10:36:35 | 10:37:33 |
| refute | 4 | 2,849 | 1,474,479 | 31 | 10:37:35 | 10:38:06 |
| capture | 1 | 151 | 96,803 | 9 | 10:38:11 | 10:38:20 |
| synthesize | 1 | 12,244 | 256,482 | 89 | 10:38:22 | 10:39:51 |

- **claude-sonnet-5-5**: 11 agent · 32 calls · out 115,610 · in 64 · cache_read 2,396,109 · cache_create 1,106,687
- **claude-opus-5-5**: 3 agent · 69 calls · out 7,755 · in 138 · cache_read 11,441,131 · cache_create 587,531
- **claude-haiku-5-5**: 11 agent · 22 calls · out 14,366 · in 44 · cache_read 1,232,122 · cache_create 1,008,186

### S4 round 2 — wf_20bd36ac-56a (21 agent, 81,064 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 2 | 18,528 | 4 | 133,211 | 138 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 2 | 17,281 | 4 | 133,209 | 124 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 2 | 16,991 | 4 | 98,317 | 121 |
| synthesize:report | claude-sonnet-5-5 | 3 | 9,519 | 6 | 252,204 | 62 |
| triage | claude-sonnet-5-5 | 2 | 2,937 | 4 | 100,616 | 27 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,544 | 4 | 133,013 | 146 |
| review:bugs | claude-opus-5-5 | 15 | 2,188 | 30 | 1,953,741 | 267 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,738 | 4 | 34,982 | 534 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 132,999 | 83 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,344 | 4 | 132,999 | 12 |
| review:conventions | claude-opus-5-5 | 11 | 1,311 | 22 | 1,239,808 | 227 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,208 | 4 | 133,013 | 221 |
| review:measurement | claude-opus-5-5 | 19 | 1,163 | 38 | 2,774,599 | 173 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 983 | 4 | 98,026 | 125 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 657 | 4 | 133,055 | 79 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 319 | 4 | 133,007 | 147 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 283 | 4 | 133,055 | 68 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 186 | 4 | 133,000 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 96,804 | 7 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 125 | 4 | 100,019 | 123 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 133,055 | 294 |


wall: 1687s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 125 | 100,019 | 123 | 11:33:10 | 11:35:13 |
| machine | 11 | 10,869 | 1,330,204 | 1585 | 11:33:10 | 11:59:36 |
| judge | 3 | 52,800 | 364,737 | 142 | 11:33:10 | 11:35:33 |
| review | 3 | 4,662 | 5,968,148 | 269 | 11:33:10 | 11:37:39 |
| triage | 1 | 2,937 | 100,616 | 27 | 11:59:38 | 12:00:05 |
| capture | 1 | 152 | 96,804 | 7 | 12:00:07 | 12:00:13 |
| synthesize | 1 | 9,519 | 252,204 | 62 | 12:00:16 | 12:01:18 |

- **claude-sonnet-5-5**: 7 agent · 15 calls · out 65,533 · in 30 · cache_read 914,380 · cache_create 762,746
- **claude-haiku-5-5**: 11 agent · 22 calls · out 10,869 · in 44 · cache_read 1,330,204 · cache_create 909,303
- **claude-opus-5-5**: 3 agent · 45 calls · out 4,662 · in 90 · cache_read 5,968,148 · cache_create 431,278

