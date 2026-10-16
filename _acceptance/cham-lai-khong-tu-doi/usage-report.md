### S4 round 1 — wf_8138dea4-1bf (20 agent, 36,714 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 8,565 | 6 | 112,617 | 51 |
| triage | claude-sonnet-5-5 | 2 | 4,193 | 4 | 39,132 | 34 |
| review:bugs | claude-opus-5-5 | 20 | 4,142 | 40 | 1,413,792 | 190 |
| review:measurement | claude-opus-5-5 | 9 | 3,915 | 18 | 558,007 | 179 |
| review:conventions | claude-opus-5-5 | 18 | 2,430 | 36 | 1,430,312 | 178 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,427 | 4 | 2,869 | 537 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,774 | 4 | 2,869 | 442 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,766 | 4 | 37,071 | 85 |
| machine:node tests/scripts/cay-doi-trong-luot.te | claude-haiku-5-5 | 2 | 1,683 | 4 | 37,138 | 39 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,574 | 4 | 2,869 | 400 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 820 | 4 | 34,211 | 148 |
| machine:node tests/scripts/cham-lai-khong-tu-doi | claude-haiku-5-5 | 2 | 745 | 4 | 37,089 | 32 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 664 | 4 | 37,127 | 86 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 566 | 4 | 37,127 | 65 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 554 | 4 | 37,097 | 7 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 217 | 4 | 37,072 | 6 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 188 | 4 | 37,071 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 2,869 | 430 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 163 | 4 | 36,872 | 64 |
| capture:provenance | claude-sonnet-5-5 | 2 | 155 | 4 | 32,987 | 11 |


wall: 2329s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 163 | 36,872 | 64 | 16:41:37 | 16:42:41 |
| machine | 13 | 13,151 | 342,479 | 2228 | 16:41:38 | 17:18:45 |
| review | 3 | 10,487 | 3,402,111 | 191 | 16:41:38 | 16:44:49 |
| triage | 1 | 4,193 | 39,132 | 34 | 17:18:46 | 17:19:20 |
| capture | 1 | 155 | 32,987 | 11 | 17:19:21 | 17:19:32 |
| synthesize | 1 | 8,565 | 112,617 | 51 | 17:19:35 | 17:20:27 |

- **claude-sonnet-5-5**: 4 agent · 9 calls · out 13,076 · in 18 · cache_read 221,608 · cache_create 190,040
- **claude-opus-5-5**: 3 agent · 47 calls · out 10,487 · in 94 · cache_read 3,402,111 · cache_create 315,552
- **claude-haiku-5-5**: 13 agent · 26 calls · out 13,151 · in 52 · cache_read 342,479 · cache_create 609,945

### S4 round 2 — wf_1ed3ea6b-39c (18 agent, 33,218 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 9,458 | 8 | 186,661 | 65 |
| triage | claude-sonnet-5-5 | 2 | 3,939 | 4 | 39,439 | 31 |
| review:conventions | claude-opus-5-5 | 26 | 2,890 | 52 | 2,398,197 | 217 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,585 | 4 | 2,869 | 447 |
| review:measurement | claude-opus-5-5 | 7 | 2,305 | 14 | 353,252 | 139 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,235 | 4 | 2,869 | 512 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,576 | 4 | 2,869 | 381 |
| review:bugs | claude-opus-5-5 | 27 | 1,514 | 54 | 2,129,888 | 232 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,358 | 4 | 37,093 | 11 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,316 | 4 | 37,093 | 83 |
| refute:cham-lai-khong-tu-doi.test.mjs | claude-sonnet-5-5 | 8 | 1,115 | 16 | 302,782 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 818 | 4 | 37,102 | 148 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 602 | 4 | 37,149 | 81 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 466 | 4 | 37,119 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 369 | 4 | 2,869 | 414 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 357 | 4 | 37,149 | 69 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 167 | 4 | 37,094 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 33,009 | 6 |


wall: 2315s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 11 | 11,849 | 271,275 | 2172 | 17:22:24 | 17:58:35 |
| review | 3 | 6,709 | 4,881,337 | 233 | 17:22:24 | 17:26:16 |
| triage | 1 | 3,939 | 39,439 | 31 | 17:58:37 | 17:59:08 |
| refute | 1 | 1,115 | 302,782 | 36 | 17:59:09 | 17:59:45 |
| capture | 1 | 148 | 33,009 | 6 | 17:59:46 | 17:59:52 |
| synthesize | 1 | 9,458 | 186,661 | 65 | 17:59:53 | 18:00:58 |

- **claude-sonnet-5-5**: 4 agent · 16 calls · out 14,660 · in 32 · cache_read 561,891 · cache_create 206,519
- **claude-opus-5-5**: 3 agent · 60 calls · out 6,709 · in 120 · cache_read 4,881,337 · cache_create 338,553
- **claude-haiku-5-5**: 11 agent · 22 calls · out 11,849 · in 44 · cache_read 271,275 · cache_create 534,928

