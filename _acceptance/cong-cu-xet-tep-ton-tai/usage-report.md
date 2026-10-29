### S4 round 1 — wf_2ca4b29d-241 (20 agent, 54,101 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 9 | 7,940 | 18 | 436,757 | 187 |
| synthesize:report | claude-sonnet-5-5 | 3 | 7,466 | 6 | 106,828 | 44 |
| review:conventions | claude-opus-5-5 | 9 | 4,950 | 18 | 436,916 | 155 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,798 | 12 | 164,784 | 920 |
| review:measurement | claude-opus-5-5 | 5 | 4,621 | 10 | 200,391 | 147 |
| machine:bash -c 'out=$(node tests/scripts/duong- | claude-haiku-5-5 | 2 | 2,659 | 4 | 38,774 | 110 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 2,502 | 4 | 38,111 | 18 |
| refute:duong-nen.test.mjs | claude-sonnet-5-5 | 6 | 2,457 | 12 | 213,751 | 24 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,329 | 4 | 38,550 | 90 |
| triage | claude-sonnet-5-5 | 2 | 2,327 | 4 | 38,318 | 19 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,078 | 4 | 3,140 | 364 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,906 | 4 | 38,550 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,356 | 4 | 38,559 | 155 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,274 | 4 | 3,140 | 398 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,176 | 4 | 38,606 | 112 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 1,111 | 6 | 42,403 | 687 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,095 | 4 | 38,606 | 80 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 816 | 4 | 38,576 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 794 | 4 | 38,551 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 446 | 4 | 34,203 | 7 |


wall: 2955s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,502 | 38,111 | 18 | 04:19:09 | 04:19:27 |
| machine | 12 | 21,392 | 522,239 | 2852 | 04:19:09 | 05:06:40 |
| review | 3 | 17,511 | 1,074,064 | 188 | 04:19:09 | 04:22:17 |
| triage | 1 | 2,327 | 38,318 | 19 | 05:06:43 | 05:07:02 |
| refute | 1 | 2,457 | 213,751 | 24 | 05:07:04 | 05:07:29 |
| capture | 1 | 446 | 34,203 | 7 | 05:07:31 | 05:07:38 |
| synthesize | 1 | 7,466 | 106,828 | 44 | 05:07:40 | 05:08:24 |

- **claude-opus-5-5**: 3 agent · 23 calls · out 17,511 · in 46 · cache_read 1,074,064 · cache_create 189,290
- **claude-sonnet-5-5**: 5 agent · 15 calls · out 15,198 · in 30 · cache_read 431,211 · cache_create 235,015
- **claude-haiku-5-5**: 12 agent · 29 calls · out 21,392 · in 58 · cache_read 522,239 · cache_create 588,391

### S4 round 2 — wf_adc80d81-1c3 (19 agent, 43,477 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 6,750 | 8 | 161,506 | 49 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 5,276 | 14 | 207,776 | 953 |
| review:measurement | claude-opus-5-5 | 8 | 3,300 | 16 | 336,110 | 138 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,148 | 4 | 3,140 | 436 |
| review:conventions | claude-opus-5-5 | 5 | 3,061 | 10 | 166,256 | 134 |
| machine:bash -c 'out=$(node tests/scripts/duong- | claude-haiku-5-5 | 2 | 2,760 | 4 | 38,673 | 112 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 2,481 | 4 | 38,010 | 18 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,417 | 4 | 3,140 | 404 |
| review:bugs | claude-opus-5-5 | 7 | 2,368 | 14 | 281,788 | 128 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,156 | 4 | 38,449 | 89 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,021 | 4 | 38,449 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,553 | 4 | 38,458 | 158 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,345 | 4 | 38,505 | 109 |
| triage | claude-sonnet-5-5 | 2 | 1,068 | 4 | 36,648 | 18 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 968 | 4 | 38,505 | 78 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 928 | 4 | 38,450 | 7 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 841 | 4 | 38,475 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 664 | 4 | 3,140 | 580 |
| capture:provenance | claude-sonnet-5-5 | 2 | 372 | 4 | 34,102 | 6 |


wall: 2939s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,481 | 38,010 | 18 | 07:46:39 | 07:46:57 |
| machine | 12 | 24,077 | 525,160 | 2858 | 07:46:39 | 08:34:17 |
| review | 3 | 8,729 | 784,154 | 139 | 07:46:39 | 07:48:58 |
| triage | 1 | 1,068 | 36,648 | 18 | 08:34:20 | 08:34:38 |
| capture | 1 | 372 | 34,102 | 6 | 08:34:41 | 08:34:47 |
| synthesize | 1 | 6,750 | 161,506 | 49 | 08:34:49 | 08:35:38 |

- **claude-sonnet-5-5**: 4 agent · 10 calls · out 10,671 · in 20 · cache_read 270,266 · cache_create 182,975
- **claude-haiku-5-5**: 12 agent · 29 calls · out 24,077 · in 58 · cache_read 525,160 · cache_create 586,168
- **claude-opus-5-5**: 3 agent · 20 calls · out 8,729 · in 40 · cache_read 784,154 · cache_create 157,286

