### S4 round 1 — wf_36366b6e-b2c (25 agent, 94,011 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| triage | claude-sonnet-5-5 | 2 | 19,525 | 4 | 105,694 | 144 |
| synthesize:report | claude-sonnet-5-5 | 11 | 14,084 | 22 | 1,509,479 | 195 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 10 | 10,842 | 20 | 1,383,074 | 283 |
| review:measurement | claude-opus-5-5 | 26 | 7,373 | 52 | 4,665,377 | 525 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 10 | 5,293 | 20 | 1,459,616 | 334 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,660 | 4 | 133,583 | 268 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,516 | 4 | 34,982 | 463 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,128 | 4 | 34,982 | 342 |
| review:conventions | claude-opus-5-5 | 32 | 3,034 | 64 | 6,570,103 | 444 |
| machine:node tests/scripts/dai-tom-tat.test.mjs | claude-haiku-5-5 | 2 | 2,926 | 4 | 133,581 | 37 |
| machine:node tests/scripts/dai-tom-tat-dem-dung. | claude-haiku-5-5 | 2 | 2,910 | 4 | 133,588 | 48 |
| refute:lo-trinh-du-lieu.md | claude-sonnet-5-5 | 11 | 2,865 | 22 | 1,187,211 | 99 |
| review:bugs | claude-opus-5-5 | 27 | 2,858 | 54 | 4,845,472 | 477 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 9 | 2,606 | 18 | 1,272,990 | 248 |
| refute:dai-tom-tat-dem-dung.test.mjs | claude-sonnet-5-5 | 10 | 2,089 | 20 | 1,164,167 | 89 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,783 | 4 | 133,569 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,771 | 4 | 133,569 | 85 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,317 | 4 | 98,596 | 125 |
| machine:node tests/scripts/dai-tom-tat-sau-kho.m | claude-haiku-5-5 | 2 | 931 | 4 | 133,587 | 49 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 528 | 4 | 133,625 | 83 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 335 | 4 | 133,625 | 74 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 186 | 4 | 101,693 | 48 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 166 | 4 | 133,570 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 144 | 4 | 34,982 | 337 |
| capture:provenance | claude-sonnet-5-5 | 2 | 141 | 4 | 97,371 | 8 |


wall: 2271s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 186 | 101,693 | 48 | 10:05:55 | 10:06:43 |
| machine | 13 | 23,115 | 1,405,839 | 1815 | 10:05:55 | 10:36:10 |
| judge | 3 | 18,741 | 4,115,680 | 338 | 10:05:55 | 10:11:33 |
| review | 3 | 13,265 | 16,080,952 | 527 | 10:05:55 | 10:14:42 |
| triage | 1 | 19,525 | 105,694 | 144 | 10:36:13 | 10:38:37 |
| refute | 2 | 4,954 | 2,351,378 | 99 | 10:38:39 | 10:40:18 |
| capture | 1 | 141 | 97,371 | 8 | 10:40:20 | 10:40:29 |
| synthesize | 1 | 14,084 | 1,509,479 | 195 | 10:40:31 | 10:43:46 |

- **claude-sonnet-5-5**: 9 agent · 67 calls · out 57,631 · in 134 · cache_read 8,281,295 · cache_create 1,283,956
- **claude-opus-5-5**: 3 agent · 85 calls · out 13,265 · in 170 · cache_read 16,080,952 · cache_create 671,522
- **claude-haiku-5-5**: 13 agent · 26 calls · out 23,115 · in 52 · cache_read 1,405,839 · cache_create 1,259,710

