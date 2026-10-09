### S4 round 1 — wf_235448b9-39f (21 agent, 23,023 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 5,455 | 12 | 625,842 | 130 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,576 | 4 | 136,591 | 237 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,097 | 4 | 136,591 | 213 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,500 | 4 | 34,982 | 333 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 136,577 | 58 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,344 | 4 | 136,577 | 12 |
| baseline:diffBase | claude-sonnet-5-5 | 12 | 1,315 | 24 | 1,300,766 | 714 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,197 | 4 | 136,586 | 126 |
| review:bugs | claude-opus-5-5 | 24 | 1,116 | 48 | 2,857,070 | 200 |
| review:conventions | claude-opus-5-5 | 20 | 1,080 | 40 | 2,270,370 | 111 |
| triage | claude-sonnet-5-5 | 2 | 725 | 4 | 103,173 | 10 |
| refute:evals.yaml | claude-sonnet-5-5 | 3 | 511 | 6 | 208,032 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 489 | 4 | 136,633 | 66 |
| refute:evals.yaml | claude-sonnet-5-5 | 3 | 424 | 6 | 243,309 | 16 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 423 | 4 | 136,633 | 83 |
| review:measurement | claude-opus-5-5 | 5 | 338 | 10 | 475,534 | 22 |
| machine:bash scripts/rel-cua-so.sh c01e5bf2 doc- | claude-haiku-5-5 | 2 | 258 | 4 | 136,643 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 232 | 4 | 136,578 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 170 | 4 | 136,633 | 270 |
| capture:provenance | claude-sonnet-5-5 | 2 | 146 | 4 | 100,381 | 10 |
| machine:bash -c 'c=$(git show c01e5bf2:diagram-d | claude-haiku-5-5 | 2 | 143 | 4 | 136,712 | 8 |


wall: 1595s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,315 | 1,300,766 | 714 | 09:13:31 | 09:25:25 |
| machine | 12 | 11,913 | 1,537,736 | 1419 | 09:13:31 | 09:37:10 |
| review | 3 | 2,534 | 5,602,974 | 202 | 09:13:31 | 09:16:53 |
| triage | 1 | 725 | 103,173 | 10 | 09:37:11 | 09:37:21 |
| refute | 2 | 935 | 451,341 | 20 | 09:37:23 | 09:37:43 |
| capture | 1 | 146 | 100,381 | 10 | 09:37:44 | 09:37:55 |
| synthesize | 1 | 5,455 | 625,842 | 130 | 09:37:56 | 09:40:06 |

- **claude-sonnet-5-5**: 6 agent · 28 calls · out 8,576 · in 56 · cache_read 2,581,503 · cache_create 622,025
- **claude-haiku-5-5**: 12 agent · 24 calls · out 11,913 · in 48 · cache_read 1,537,736 · cache_create 986,857
- **claude-opus-5-5**: 3 agent · 49 calls · out 2,534 · in 98 · cache_read 5,602,974 · cache_create 318,011

### S4 round 2 — wf_3eaafb16-838 (17 agent, 15,491 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 4,451 | 6 | 236,454 | 37 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,262 | 4 | 136,618 | 236 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,123 | 4 | 136,618 | 223 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,697 | 4 | 34,982 | 341 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 136,604 | 57 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,344 | 4 | 136,604 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 527 | 4 | 136,660 | 77 |
| machine:bash scripts/rel-cua-so.sh c01e5bf2 doc- | claude-haiku-5-5 | 2 | 258 | 4 | 136,670 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 195 | 4 | 136,613 | 113 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 186 | 4 | 136,605 | 6 |
| review:bugs | claude-opus-5-5 | 9 | 169 | 18 | 941,917 | 39 |
| review:measurement | claude-opus-5-5 | 13 | 164 | 26 | 1,437,620 | 77 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 100,408 | 9 |
| machine:bash -c 'c=$(git show c01e5bf2:diagram-d | claude-haiku-5-5 | 2 | 143 | 4 | 136,739 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 124 | 4 | 136,660 | 273 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 136,660 | 67 |
| review:conventions | claude-opus-5-5 | 6 | 90 | 12 | 551,285 | 25 |


wall: 1468s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 12 | 10,466 | 1,538,033 | 1419 | 09:41:18 | 10:04:57 |
| review | 3 | 423 | 2,930,822 | 78 | 09:41:18 | 09:42:36 |
| capture | 1 | 151 | 100,408 | 9 | 10:04:59 | 10:05:08 |
| synthesize | 1 | 4,451 | 236,454 | 37 | 10:05:09 | 10:05:46 |

- **claude-sonnet-5-5**: 2 agent · 5 calls · out 4,602 · in 10 · cache_read 336,862 · cache_create 238,965
- **claude-haiku-5-5**: 12 agent · 24 calls · out 10,466 · in 48 · cache_read 1,538,033 · cache_create 986,724
- **claude-opus-5-5**: 3 agent · 28 calls · out 423 · in 56 · cache_read 2,930,822 · cache_create 302,156

