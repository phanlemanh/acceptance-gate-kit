### S4 round 1 — wf_96a48ee2-547 (23 agent, 45,281 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| baseline:diffBase | claude-sonnet-5-5 | 3 | 6,962 | 6 | 95,646 | 49 |
| synthesize:report | claude-sonnet-5-5 | 2 | 6,014 | 4 | 50,275 | 36 |
| review:conventions | claude-opus-5-5 | 13 | 5,054 | 26 | 671,243 | 100 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,922 | 16 | 256,929 | 1016 |
| review:bugs | claude-opus-5-5 | 5 | 2,862 | 10 | 185,003 | 35 |
| review:measurement | claude-opus-5-5 | 4 | 2,287 | 8 | 141,498 | 29 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,985 | 4 | 39,118 | 91 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,879 | 4 | 3,140 | 524 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,834 | 4 | 39,118 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,276 | 4 | 39,100 | 155 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 1,038 | 6 | 42,912 | 647 |
| machine:bash -c 'out=$(node tests/scripts/run-id | claude-haiku-5-5 | 2 | 990 | 4 | 39,267 | 8 |
| machine:bash -c 'out=$(node tests/scripts/run-id | claude-haiku-5-5 | 2 | 981 | 4 | 39,284 | 8 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 961 | 4 | 3,140 | 360 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 875 | 4 | 39,174 | 112 |
| machine:bash -c 'out=$(node tests/scripts/run-id | claude-haiku-5-5 | 2 | 851 | 4 | 39,265 | 7 |
| machine:bash -c 'out=$(node tests/scripts/run-id | claude-haiku-5-5 | 2 | 826 | 4 | 39,266 | 8 |
| machine:bash -c 'out=$(node tests/scripts/run-id | claude-haiku-5-5 | 2 | 810 | 4 | 39,264 | 7 |
| machine:bash -c 'out=$(node tests/scripts/run-id | claude-haiku-5-5 | 2 | 760 | 4 | 39,265 | 7 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 624 | 4 | 39,144 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 592 | 4 | 39,174 | 83 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 537 | 4 | 39,119 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 361 | 4 | 34,769 | 6 |


wall: 3077s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 6,962 | 95,646 | 49 | 19:37:58 | 19:38:47 |
| machine | 17 | 21,741 | 815,679 | 3032 | 19:37:58 | 20:28:29 |
| review | 3 | 10,203 | 997,744 | 100 | 19:37:58 | 19:39:38 |
| capture | 1 | 361 | 34,769 | 6 | 20:28:31 | 20:28:37 |
| synthesize | 1 | 6,014 | 50,275 | 36 | 20:28:39 | 20:29:15 |

- **claude-sonnet-5-5**: 3 agent · 7 calls · out 13,337 · in 14 · cache_read 180,690 · cache_create 152,650
- **claude-opus-5-5**: 3 agent · 22 calls · out 10,203 · in 44 · cache_read 997,744 · cache_create 186,453
- **claude-haiku-5-5**: 17 agent · 41 calls · out 21,741 · in 82 · cache_read 815,679 · cache_create 779,854

