### S4 round 1 — wf_8859bf53-0a9 (22 agent, 39,348 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 10,637 | 8 | 187,065 | 61 |
| triage | claude-sonnet-5-5 | 2 | 6,113 | 4 | 39,740 | 44 |
| review:measurement | claude-opus-5-5 | 9 | 3,324 | 18 | 590,552 | 118 |
| review:bugs | claude-opus-5-5 | 20 | 2,983 | 40 | 1,531,016 | 187 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 2,951 | 10 | 118,444 | 711 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,580 | 4 | 2,869 | 437 |
| review:conventions | claude-opus-5-5 | 15 | 2,108 | 30 | 935,405 | 133 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,628 | 4 | 36,348 | 13 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,483 | 4 | 36,348 | 83 |
| refute:chan-lo-trinh.cjs | claude-sonnet-5-5 | 5 | 1,271 | 10 | 169,272 | 22 |
| refute:chan-lo-trinh.cjs | claude-sonnet-5-5 | 6 | 966 | 12 | 214,208 | 21 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 537 | 4 | 33,488 | 144 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 443 | 4 | 36,374 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 442 | 4 | 36,404 | 82 |
| machine:node tests/scripts/kho-cam-ket-co-lo-tri | claude-haiku-5-5 | 2 | 397 | 4 | 36,375 | 32 |
| machine:node tests/scripts/kho-cam-ket-co-lo-tri | claude-haiku-5-5 | 2 | 292 | 4 | 36,371 | 24 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 270 | 4 | 36,349 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 223 | 4 | 36,362 | 180 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 201 | 4 | 36,065 | 17 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 36,404 | 70 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 2,869 | 419 |
| capture:provenance | claude-sonnet-5-5 | 2 | 153 | 4 | 32,268 | 6 |


wall: 2315s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 201 | 36,065 | 17 | 05:54:38 | 05:54:55 |
| machine | 13 | 11,592 | 485,005 | 2173 | 05:54:38 | 06:30:51 |
| review | 3 | 8,415 | 3,056,973 | 188 | 05:54:38 | 05:57:46 |
| triage | 1 | 6,113 | 39,740 | 44 | 06:30:53 | 06:31:37 |
| refute | 2 | 2,237 | 383,480 | 23 | 06:31:39 | 06:32:02 |
| capture | 1 | 153 | 32,268 | 6 | 06:32:04 | 06:32:10 |
| synthesize | 1 | 10,637 | 187,065 | 61 | 06:32:12 | 06:33:13 |

- **claude-sonnet-5-5**: 6 agent · 21 calls · out 19,341 · in 42 · cache_read 678,618 · cache_create 292,762
- **claude-opus-5-5**: 3 agent · 44 calls · out 8,415 · in 88 · cache_read 3,056,973 · cache_create 304,321
- **claude-haiku-5-5**: 13 agent · 29 calls · out 11,592 · in 58 · cache_read 485,005 · cache_create 565,710

