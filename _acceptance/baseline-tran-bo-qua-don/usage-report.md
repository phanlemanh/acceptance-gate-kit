### S4 round 1 — wf_739a3221-a4c (23 agent, 38,858 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 7,670 | 8 | 408,347 | 67 |
| triage | claude-sonnet-5-5 | 2 | 4,279 | 4 | 137,405 | 37 |
| review:conventions | claude-opus-5-5 | 23 | 3,937 | 46 | 3,093,957 | 417 |
| review:measurement | claude-opus-5-5 | 13 | 2,866 | 26 | 1,738,159 | 285 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,321 | 4 | 132,713 | 246 |
| review:bugs | claude-opus-5-5 | 10 | 2,182 | 20 | 1,220,963 | 243 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,099 | 4 | 132,713 | 263 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,880 | 4 | 97,689 | 110 |
| machine:bash -c 'out=$(node tests/workflows/base | claude-haiku-5-5 | 2 | 1,634 | 4 | 132,848 | 40 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,525 | 4 | 70,020 | 371 |
| machine:bash -c 'out=$(node tests/workflows/base | claude-haiku-5-5 | 2 | 1,434 | 4 | 132,840 | 37 |
| machine:bash -c 'out=$(node tests/workflows/base | claude-haiku-5-5 | 2 | 1,244 | 4 | 132,840 | 38 |
| machine:bash -c 'out=$(node tests/workflows/base | claude-haiku-5-5 | 2 | 1,105 | 4 | 132,845 | 37 |
| machine:bash -c 'out=$(node tests/workflows/base | claude-haiku-5-5 | 2 | 1,105 | 4 | 132,844 | 38 |
| machine:bash -c 'out=$(node tests/workflows/base | claude-haiku-5-5 | 2 | 1,084 | 4 | 132,852 | 37 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 607 | 4 | 103,740 | 363 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 470 | 4 | 132,755 | 89 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 393 | 4 | 132,708 | 143 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 359 | 4 | 132,755 | 81 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 236 | 4 | 132,699 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 146 | 4 | 131,345 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 144 | 4 | 132,755 | 285 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 138 | 4 | 132,700 | 5 |


wall: 1807s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 607 | 103,740 | 363 | 12:10:23 | 12:16:26 |
| machine | 16 | 17,171 | 2,026,576 | 1677 | 12:10:23 | 12:38:20 |
| review | 3 | 8,985 | 6,053,079 | 417 | 12:10:23 | 12:17:20 |
| triage | 1 | 4,279 | 137,405 | 37 | 12:38:22 | 12:38:58 |
| capture | 1 | 146 | 131,345 | 9 | 12:39:01 | 12:39:10 |
| synthesize | 1 | 7,670 | 408,347 | 67 | 12:39:22 | 12:40:29 |

- **claude-sonnet-5-5**: 4 agent · 10 calls · out 12,702 · in 20 · cache_read 780,837 · cache_create 353,816
- **claude-opus-5-5**: 3 agent · 46 calls · out 8,985 · in 92 · cache_read 6,053,079 · cache_create 436,274
- **claude-haiku-5-5**: 16 agent · 32 calls · out 17,171 · in 64 · cache_read 2,026,576 · cache_create 1,199,750

