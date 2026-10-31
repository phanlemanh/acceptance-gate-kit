### S4 round 1 — wf_5f82ef1a-cb7 (20 agent, 43,366 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 12 | 7,348 | 24 | 446,804 | 1342 |
| synthesize:report | claude-sonnet-5-5 | 2 | 5,155 | 4 | 48,517 | 30 |
| review:conventions | claude-opus-5-5 | 7 | 4,114 | 14 | 339,498 | 47 |
| review:measurement | claude-opus-5-5 | 4 | 4,014 | 8 | 154,025 | 43 |
| review:bugs | claude-opus-5-5 | 7 | 3,676 | 14 | 311,265 | 60 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 3,567 | 6 | 86,190 | 43 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,840 | 4 | 6,280 | 592 |
| triage | claude-sonnet-5-5 | 2 | 2,016 | 4 | 39,046 | 16 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,916 | 4 | 39,158 | 91 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,858 | 4 | 39,158 | 13 |
| machine:node tests/scripts/quet-het-han-khong-mo | claude-haiku-5-5 | 2 | 1,215 | 4 | 39,175 | 21 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 907 | 4 | 3,140 | 606 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 898 | 4 | 39,214 | 110 |
| machine:RT_CASES=RT5 node tests/plugins/ra-co-te | claude-haiku-5-5 | 2 | 638 | 4 | 39,183 | 11 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 615 | 4 | 3,140 | 435 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 604 | 4 | 39,184 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 577 | 4 | 6,280 | 345 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 559 | 4 | 39,159 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 499 | 4 | 39,214 | 82 |
| capture:provenance | claude-sonnet-5-5 | 2 | 350 | 4 | 34,805 | 6 |


wall: 3705s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,567 | 86,190 | 43 | 17:42:29 | 17:43:11 |
| machine | 13 | 20,474 | 779,089 | 3648 | 17:42:29 | 18:43:16 |
| review | 3 | 11,804 | 804,788 | 61 | 17:42:29 | 17:43:30 |
| triage | 1 | 2,016 | 39,046 | 16 | 18:43:18 | 18:43:34 |
| capture | 1 | 350 | 34,805 | 6 | 18:43:36 | 18:43:42 |
| synthesize | 1 | 5,155 | 48,517 | 30 | 18:43:44 | 18:44:14 |

- **claude-haiku-5-5**: 13 agent · 36 calls · out 20,474 · in 72 · cache_read 779,089 · cache_create 665,417
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 11,088 · in 18 · cache_read 208,558 · cache_create 189,986
- **claude-opus-5-5**: 3 agent · 18 calls · out 11,804 · in 36 · cache_read 804,788 · cache_create 197,149

