### S4 round 1 — wf_94d763dd-d09 (28 agent, 93,627 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 10 | 14,606 | 20 | 641,286 | 156 |
| review:conventions | claude-opus-5-5 | 17 | 13,272 | 34 | 1,157,109 | 150 |
| synthesize:report | claude-sonnet-5-5 | 5 | 11,880 | 10 | 256,014 | 93 |
| review:measurement | claude-opus-5-5 | 10 | 11,644 | 20 | 645,718 | 126 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 7,046 | 4 | 42,367 | 38 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 5,024 | 14 | 205,198 | 966 |
| triage | claude-sonnet-5-5 | 2 | 4,108 | 4 | 39,775 | 31 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,232 | 4 | 3,034 | 489 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,368 | 4 | 38,194 | 90 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,169 | 4 | 3,034 | 421 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,903 | 4 | 38,194 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,707 | 4 | 35,169 | 186 |
| machine:node tests/design-eval/vi-phan-kho.mjs | claude-haiku-5-5 | 2 | 1,205 | 4 | 38,204 | 49 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,179 | 4 | 3,034 | 565 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,151 | 4 | 38,250 | 119 |
| machine:bash tests/design-eval/kdd.sh KD1 | claude-haiku-5-5 | 2 | 1,083 | 4 | 38,200 | 9 |
| machine:bash tests/design-eval/kdd.sh KD7 | claude-haiku-5-5 | 2 | 1,078 | 4 | 38,200 | 42 |
| machine:bash tests/design-eval/kdd.sh --hoi-quy | claude-haiku-5-5 | 2 | 1,042 | 4 | 38,208 | 55 |
| machine:bash tests/design-eval/kdd.sh KD3 | claude-haiku-5-5 | 2 | 992 | 4 | 38,200 | 12 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 920 | 4 | 38,195 | 6 |
| machine:bash tests/design-eval/kdd.sh KD4 | claude-haiku-5-5 | 2 | 876 | 4 | 38,200 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 849 | 4 | 38,250 | 77 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 835 | 4 | 38,220 | 6 |
| machine:bash tests/design-eval/kdd.sh KD8-ci | claude-haiku-5-5 | 2 | 816 | 4 | 38,206 | 10 |
| machine:bash tests/design-eval/kdd.sh KD6 | claude-haiku-5-5 | 2 | 786 | 4 | 38,200 | 11 |
| machine:bash tests/design-eval/kdd.sh KD2 | claude-haiku-5-5 | 2 | 766 | 4 | 38,200 | 12 |
| machine:bash tests/design-eval/kdd.sh KD5 | claude-haiku-5-5 | 2 | 736 | 4 | 38,200 | 11 |
| capture:provenance | claude-sonnet-5-5 | 2 | 354 | 4 | 33,948 | 6 |


wall: 3098s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,046 | 42,367 | 38 | 07:28:42 | 07:29:20 |
| machine | 21 | 30,717 | 860,790 | 2961 | 07:28:42 | 08:18:03 |
| review | 3 | 39,522 | 2,444,113 | 157 | 07:28:56 | 07:31:32 |
| triage | 1 | 4,108 | 39,775 | 31 | 08:18:06 | 08:18:36 |
| capture | 1 | 354 | 33,948 | 6 | 08:18:39 | 08:18:45 |
| synthesize | 1 | 11,880 | 256,014 | 93 | 08:18:47 | 08:20:20 |

- **claude-opus-5-5**: 3 agent · 37 calls · out 39,522 · in 74 · cache_read 2,444,113 · cache_create 276,989
- **claude-sonnet-5-5**: 4 agent · 11 calls · out 23,388 · in 22 · cache_read 372,104 · cache_create 204,701
- **claude-haiku-5-5**: 21 agent · 47 calls · out 30,717 · in 94 · cache_read 860,790 · cache_create 900,353

