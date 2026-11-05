### S4 round 1 — wf_9f01d46b-943 (24 agent, 76,142 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,180 | 6 | 116,535 | 556 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 12 | 6,998 | 24 | 1,459,812 | 87 |
| synthesize:report | claude-sonnet-5-5 | 2 | 6,825 | 4 | 116,838 | 44 |
| review:bugs | claude-opus-5-5 | 14 | 6,413 | 28 | 1,749,637 | 118 |
| review:measurement | claude-opus-5-5 | 9 | 5,634 | 18 | 1,064,739 | 87 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 10 | 5,058 | 20 | 954,128 | 1118 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 6 | 4,716 | 12 | 674,751 | 56 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 8 | 4,537 | 16 | 876,327 | 61 |
| review:conventions | claude-opus-5-5 | 8 | 3,571 | 16 | 856,577 | 66 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,401 | 6 | 255,213 | 37 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 3,130 | 8 | 372,430 | 166 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,366 | 4 | 32,212 | 520 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,917 | 4 | 137,429 | 98 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,915 | 4 | 32,212 | 418 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,797 | 4 | 137,429 | 23 |
| machine:bash -c 'd=$(git diff --name-only 39fa45 | claude-haiku-5-5 | 2 | 987 | 4 | 137,560 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 870 | 4 | 105,273 | 134 |
| machine:bash _acceptance/release-2-38-0/lop-chep | claude-haiku-5-5 | 2 | 836 | 4 | 137,458 | 13 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 824 | 4 | 137,499 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 824 | 4 | 137,438 | 180 |
| machine:bash -c 'c=$(git show 39fa45cc:diagram-d | claude-haiku-5-5 | 2 | 800 | 4 | 137,563 | 10 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 600 | 4 | 137,430 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 583 | 4 | 137,485 | 94 |
| capture:provenance | claude-sonnet-5-5 | 2 | 360 | 4 | 104,007 | 10 |


wall: 2874s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 11,180 | 116,535 | 556 | 05:11:42 | 05:20:57 |
| machine | 15 | 25,908 | 2,988,759 | 2817 | 05:11:42 | 05:58:38 |
| judge | 3 | 16,251 | 3,010,890 | 92 | 05:11:42 | 05:13:14 |
| review | 3 | 15,618 | 3,670,953 | 122 | 05:11:42 | 05:13:44 |
| capture | 1 | 360 | 104,007 | 10 | 05:58:40 | 05:58:50 |
| synthesize | 1 | 6,825 | 116,838 | 44 | 05:58:52 | 05:59:36 |

- **claude-sonnet-5-5**: 6 agent · 33 calls · out 34,616 · in 66 · cache_read 3,348,270 · cache_create 967,864
- **claude-opus-5-5**: 3 agent · 31 calls · out 15,618 · in 62 · cache_read 3,670,953 · cache_create 360,619
- **claude-haiku-5-5**: 15 agent · 41 calls · out 25,908 · in 82 · cache_read 2,988,759 · cache_create 1,589,144

### S4 round 2 — wf_2dc7b480-af1 (24 agent, 65,796 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,178 | 6 | 116,555 | 559 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 8 | 6,949 | 16 | 850,241 | 585 |
| synthesize:report | claude-sonnet-5-5 | 2 | 6,412 | 4 | 116,468 | 45 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 8 | 5,711 | 16 | 930,619 | 66 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 5,086 | 18 | 841,847 | 1129 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 8 | 4,620 | 16 | 941,188 | 62 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,847 | 6 | 255,668 | 35 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 6 | 3,332 | 12 | 653,830 | 44 |
| review:bugs | claude-opus-5-5 | 6 | 2,450 | 12 | 634,291 | 44 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,076 | 4 | 137,450 | 102 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,069 | 4 | 32,212 | 418 |
| review:conventions | claude-opus-5-5 | 4 | 1,655 | 8 | 337,767 | 31 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,619 | 4 | 137,459 | 182 |
| review:measurement | claude-opus-5-5 | 4 | 1,509 | 8 | 371,484 | 30 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 1,157 | 4 | 137,520 | 15 |
| machine:bash -c 'c=$(git show 39fa45cc:diagram-d | claude-haiku-5-5 | 2 | 890 | 4 | 137,584 | 14 |
| machine:bash -c 'd=$(git diff --name-only 39fa45 | claude-haiku-5-5 | 2 | 867 | 4 | 137,581 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 866 | 4 | 32,212 | 510 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 717 | 4 | 105,294 | 129 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 704 | 4 | 137,450 | 15 |
| machine:bash _acceptance/release-2-38-0/lop-chep | claude-haiku-5-5 | 2 | 627 | 4 | 137,479 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 615 | 4 | 137,506 | 95 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 486 | 4 | 137,451 | 10 |
| capture:provenance | claude-sonnet-5-5 | 2 | 354 | 4 | 104,028 | 11 |


wall: 3292s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 11,178 | 116,555 | 559 | 06:14:48 | 06:24:07 |
| machine | 15 | 28,575 | 3,354,954 | 3233 | 06:14:48 | 07:08:41 |
| judge | 3 | 13,663 | 2,525,637 | 70 | 06:14:48 | 06:15:59 |
| review | 3 | 5,614 | 1,343,542 | 49 | 06:14:48 | 06:15:37 |
| capture | 1 | 354 | 104,028 | 11 | 07:08:43 | 07:08:54 |
| synthesize | 1 | 6,412 | 116,468 | 45 | 07:08:56 | 07:09:40 |

- **claude-sonnet-5-5**: 6 agent · 29 calls · out 31,607 · in 58 · cache_read 2,862,688 · cache_create 903,988
- **claude-haiku-5-5**: 15 agent · 44 calls · out 28,575 · in 88 · cache_read 3,354,954 · cache_create 1,595,329
- **claude-opus-5-5**: 3 agent · 14 calls · out 5,614 · in 28 · cache_read 1,343,542 · cache_create 325,703

