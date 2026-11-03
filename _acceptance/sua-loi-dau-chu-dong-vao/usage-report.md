### S4 round 1 — wf_ef222a96-e90 (22 agent, 87,268 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 37 | 19,929 | 76 | 6,426,032 | 271 |
| review:bugs | claude-opus-5-5 | 22 | 15,314 | 44 | 3,375,371 | 198 |
| synthesize:report | claude-sonnet-5-5 | 3 | 10,927 | 6 | 263,350 | 76 |
| review:measurement | claude-opus-5-5 | 6 | 7,537 | 12 | 712,626 | 82 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 5,599 | 6 | 242,157 | 57 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,712 | 16 | 752,848 | 907 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 4,145 | 8 | 274,200 | 655 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,183 | 4 | 38,489 | 471 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,967 | 4 | 148,052 | 96 |
| triage | claude-sonnet-5-5 | 2 | 1,930 | 4 | 111,665 | 20 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,787 | 4 | 148,108 | 124 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 1,508 | 4 | 148,257 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,471 | 4 | 109,572 | 182 |
| machine:bash -c 'out=$(node tests/workflows/ui-c | claude-haiku-5-5 | 2 | 1,468 | 4 | 148,175 | 12 |
| machine:bash -c 'out=$(node tests/scripts/pre-me | claude-haiku-5-5 | 2 | 1,380 | 4 | 148,262 | 20 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 1,023 | 4 | 148,078 | 9 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 871 | 4 | 148,052 | 12 |
| machine:bash -c 'out=$(node tests/scripts/s4-arg | claude-haiku-5-5 | 2 | 826 | 4 | 148,161 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 819 | 4 | 148,108 | 94 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 806 | 4 | 148,053 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 626 | 4 | 38,489 | 571 |
| capture:provenance | claude-sonnet-5-5 | 2 | 440 | 4 | 108,351 | 11 |


wall: 3261s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 5,599 | 242,157 | 57 | 00:16:21 | 00:17:18 |
| machine | 15 | 25,592 | 2,694,904 | 3148 | 00:16:21 | 01:08:49 |
| review | 3 | 42,780 | 10,514,029 | 271 | 00:16:21 | 00:20:52 |
| triage | 1 | 1,930 | 111,665 | 20 | 01:08:51 | 01:09:11 |
| capture | 1 | 440 | 108,351 | 11 | 01:09:13 | 01:09:24 |
| synthesize | 1 | 10,927 | 263,350 | 76 | 01:09:26 | 01:10:42 |

- **claude-opus-5-5**: 3 agent · 65 calls · out 42,780 · in 132 · cache_read 10,514,029 · cache_create 491,290
- **claude-sonnet-5-5**: 4 agent · 10 calls · out 18,896 · in 20 · cache_read 725,523 · cache_create 505,175
- **claude-haiku-5-5**: 15 agent · 38 calls · out 25,592 · in 76 · cache_read 2,694,904 · cache_create 1,668,490

