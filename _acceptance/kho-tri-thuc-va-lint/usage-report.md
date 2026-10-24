### S4 round 2 — wf_9600113c-588 (20 agent, 64,075 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 7 | 12,714 | 14 | 350,344 | 80 |
| review:measurement | claude-opus-5-5 | 8 | 8,676 | 16 | 333,008 | 119 |
| review:bugs | claude-opus-5-5 | 9 | 7,870 | 18 | 366,160 | 121 |
| review:conventions | claude-opus-5-5 | 8 | 6,956 | 16 | 340,619 | 107 |
| triage | claude-sonnet-5-5 | 2 | 4,464 | 4 | 30,347 | 33 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 3,747 | 10 | 90,406 | 742 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 3,102 | 4 | 29,012 | 20 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,349 | 4 | 6,114 | 534 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 5 | 2,162 | 10 | 93,972 | 723 |
| machine:node tests/scripts/kho-tri-thuc-va-lint. | claude-haiku-5-5 | 2 | 1,924 | 4 | 29,033 | 22 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,796 | 4 | 28,020 | 88 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,754 | 4 | 25,966 | 157 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,247 | 4 | 28,076 | 107 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 989 | 4 | 28,046 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 938 | 4 | 28,076 | 75 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 858 | 4 | 28,021 | 7 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 730 | 4 | 28,020 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 729 | 4 | 3,057 | 510 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 716 | 4 | 3,057 | 422 |
| capture:provenance | claude-sonnet-5-5 | 2 | 354 | 4 | 23,751 | 5 |


wall: 2802s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,102 | 29,012 | 20 | 05:46:27 | 05:46:47 |
| machine | 13 | 19,939 | 419,864 | 2678 | 05:46:27 | 06:31:06 |
| review | 3 | 23,502 | 1,039,787 | 124 | 05:46:27 | 05:48:31 |
| triage | 1 | 4,464 | 30,347 | 33 | 06:31:08 | 06:31:40 |
| capture | 1 | 354 | 23,751 | 5 | 06:31:42 | 06:31:47 |
| synthesize | 1 | 12,714 | 350,344 | 80 | 06:31:49 | 06:33:09 |

- **claude-sonnet-5-5**: 4 agent · 13 calls · out 20,634 · in 26 · cache_read 433,454 · cache_create 164,578
- **claude-opus-5-5**: 3 agent · 25 calls · out 23,502 · in 50 · cache_read 1,039,787 · cache_create 200,393
- **claude-haiku-5-5**: 13 agent · 32 calls · out 19,939 · in 64 · cache_read 419,864 · cache_create 471,319

