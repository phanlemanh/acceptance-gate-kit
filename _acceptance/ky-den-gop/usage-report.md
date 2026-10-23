### S4 round 1 — wf_6c3b31e8-1cb (20 agent, 43,215 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 11,969 | 8 | 183,578 | 71 |
| triage | claude-sonnet-5-5 | 2 | 6,598 | 4 | 40,753 | 48 |
| review:bugs | claude-opus-5-5 | 12 | 4,398 | 24 | 806,232 | 276 |
| review:conventions | claude-opus-5-5 | 35 | 3,484 | 70 | 3,414,496 | 514 |
| review:measurement | claude-opus-5-5 | 22 | 3,160 | 44 | 1,902,285 | 853 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,667 | 4 | 6,114 | 532 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 2,468 | 16 | 245,221 | 997 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,035 | 4 | 36,987 | 313 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,322 | 4 | 36,973 | 87 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,174 | 4 | 37,198 | 79 |
| refute:phat-lich.mjs | claude-sonnet-5-5 | 4 | 837 | 8 | 112,982 | 18 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 628 | 4 | 37,029 | 119 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 585 | 4 | 33,925 | 168 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 424 | 4 | 36,999 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 391 | 4 | 37,029 | 80 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 317 | 4 | 3,057 | 539 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 241 | 4 | 36,973 | 9 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 216 | 4 | 36,974 | 6 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 151 | 4 | 36,246 | 17 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 32,703 | 7 |


wall: 3018s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 151 | 36,246 | 17 | 14:45:57 | 14:46:15 |
| machine | 12 | 12,468 | 584,479 | 2869 | 14:45:58 | 15:33:46 |
| review | 3 | 11,042 | 6,123,013 | 855 | 14:45:58 | 15:00:12 |
| triage | 1 | 6,598 | 40,753 | 48 | 15:33:48 | 15:34:35 |
| refute | 1 | 837 | 112,982 | 18 | 15:34:37 | 15:34:54 |
| capture | 1 | 150 | 32,703 | 7 | 15:34:56 | 15:35:02 |
| synthesize | 1 | 11,969 | 183,578 | 71 | 15:35:04 | 15:36:15 |

- **claude-sonnet-5-5**: 5 agent · 14 calls · out 19,705 · in 28 · cache_read 406,262 · cache_create 237,268
- **claude-opus-5-5**: 3 agent · 69 calls · out 11,042 · in 138 · cache_read 6,123,013 · cache_create 486,609
- **claude-haiku-5-5**: 12 agent · 30 calls · out 12,468 · in 60 · cache_read 584,479 · cache_create 524,466

### S4 round 2 — wf_9d51225e-9d8 (18 agent, 26,782 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 9,735 | 10 | 264,010 | 64 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,686 | 4 | 6,114 | 590 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,498 | 12 | 155,906 | 843 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,803 | 4 | 6,114 | 341 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,664 | 4 | 36,616 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,508 | 4 | 36,616 | 90 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,370 | 4 | 36,841 | 99 |
| review:bugs | claude-opus-5-5 | 9 | 1,090 | 18 | 446,843 | 279 |
| review:measurement | claude-opus-5-5 | 9 | 881 | 18 | 394,083 | 70 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 745 | 4 | 33,568 | 201 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 625 | 4 | 36,672 | 121 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 501 | 4 | 6,114 | 544 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 470 | 4 | 36,642 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 449 | 4 | 36,617 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 306 | 4 | 36,672 | 89 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 185 | 4 | 36,322 | 19 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 32,346 | 6 |
| review:conventions | claude-opus-5-5 | 8 | 115 | 16 | 321,465 | 54 |


wall: 2932s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 185 | 36,322 | 19 | 15:47:44 | 15:48:03 |
| machine | 12 | 14,625 | 464,492 | 2859 | 15:47:44 | 16:35:22 |
| review | 3 | 2,086 | 1,162,391 | 283 | 15:47:44 | 15:52:26 |
| capture | 1 | 151 | 32,346 | 6 | 16:35:23 | 16:35:30 |
| synthesize | 1 | 9,735 | 264,010 | 64 | 16:35:32 | 16:36:36 |

- **claude-sonnet-5-5**: 3 agent · 9 calls · out 10,071 · in 18 · cache_read 332,678 · cache_create 161,017
- **claude-haiku-5-5**: 12 agent · 28 calls · out 14,625 · in 56 · cache_read 464,492 · cache_create 546,513
- **claude-opus-5-5**: 3 agent · 26 calls · out 2,086 · in 52 · cache_read 1,162,391 · cache_create 177,277

