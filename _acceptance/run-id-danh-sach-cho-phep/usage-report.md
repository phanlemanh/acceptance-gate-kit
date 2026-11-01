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

### S4 round 2 — wf_2046e9e2-3c1 (17 agent, 37,613 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 13 | 7,166 | 26 | 490,201 | 1447 |
| synthesize:report | claude-sonnet-5-5 | 2 | 6,193 | 4 | 50,760 | 36 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 8 | 3,348 | 18 | 253,871 | 627 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,660 | 4 | 3,140 | 385 |
| review:measurement | claude-opus-5-5 | 5 | 2,627 | 10 | 167,692 | 28 |
| review:bugs | claude-opus-5-5 | 4 | 2,244 | 8 | 130,072 | 26 |
| review:conventions | claude-opus-5-5 | 4 | 1,921 | 8 | 126,253 | 21 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,911 | 4 | 39,293 | 95 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,792 | 4 | 3,140 | 550 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,755 | 4 | 39,293 | 12 |
| triage | claude-sonnet-5-5 | 2 | 1,462 | 4 | 38,984 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,442 | 4 | 36,162 | 274 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 841 | 4 | 39,349 | 123 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 679 | 4 | 39,349 | 93 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 629 | 4 | 39,319 | 5 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 586 | 4 | 39,294 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 357 | 4 | 34,944 | 6 |


wall: 3700s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 11 | 22,809 | 1,022,411 | 3638 | 23:15:06 | 00:15:44 |
| review | 3 | 6,792 | 424,017 | 29 | 23:15:06 | 23:15:35 |
| triage | 1 | 1,462 | 38,984 | 14 | 00:15:46 | 00:16:00 |
| capture | 1 | 357 | 34,944 | 6 | 00:16:02 | 00:16:08 |
| synthesize | 1 | 6,193 | 50,760 | 36 | 00:16:10 | 00:16:46 |

- **claude-haiku-5-5**: 11 agent · 39 calls · out 22,809 · in 80 · cache_read 1,022,411 · cache_create 566,674
- **claude-sonnet-5-5**: 3 agent · 6 calls · out 8,012 · in 12 · cache_read 124,688 · cache_create 147,488
- **claude-opus-5-5**: 3 agent · 13 calls · out 6,792 · in 26 · cache_read 424,017 · cache_create 139,884

