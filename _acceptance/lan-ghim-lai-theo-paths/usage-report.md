### S4 round 1 — wf_c88b6ad4-f58 (30 agent, 34,141 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| triage | claude-sonnet-5-5 | 2 | 4,337 | 4 | 82,765 | 42 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 10 | 3,135 | 82 | 639,138 | 143 |
| review:conventions | claude-opus-5-5 | 22 | 3,113 | 44 | 2,788,484 | 162 |
| review:measurement | claude-opus-5-5 | 18 | 2,612 | 36 | 2,320,184 | 168 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,723 | 18 | 86,545 | 139 |
| review:bugs | claude-opus-5-5 | 17 | 1,656 | 34 | 1,922,056 | 154 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 1,384 | 18 | 86,551 | 33 |
| refute:chan-lan.mjs | claude-sonnet-5-5 | 4 | 1,346 | 8 | 292,163 | 72 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,341 | 18 | 86,532 | 32 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 1,297 | 6 | 161,642 | 17 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 1,148 | 18 | 86,550 | 32 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 1,118 | 18 | 86,549 | 35 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 997 | 18 | 59,120 | 128 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 962 | 18 | 86,554 | 20 |
| refute:pre-merge-check.sh | claude-sonnet-5-5 | 3 | 824 | 6 | 162,277 | 18 |
| refute:chan-premerge.mjs | claude-sonnet-5-5 | 3 | 811 | 6 | 198,266 | 16 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 749 | 18 | 86,549 | 18 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 728 | 18 | 86,552 | 26 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 714 | 18 | 86,549 | 58 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 636 | 18 | 86,554 | 19 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 523 | 18 | 86,532 | 12 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 495 | 18 | 86,554 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 494 | 18 | 86,545 | 244 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 483 | 18 | 86,552 | 17 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 433 | 18 | 86,581 | 86 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 346 | 18 | 86,581 | 245 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 316 | 18 | 86,539 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 237 | 18 | 86,581 | 67 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 77,499 | 7 |
| synthesize:report | claude-sonnet-5-5 | 3 | 32 | 6 | 201,343 | 55 |


wall: 1314s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,297 | 161,642 | 17 | 07:42:33 | 07:42:50 |
| machine | 20 | 17,962 | 2,256,208 | 1128 | 07:42:33 | 08:01:21 |
| review | 3 | 7,381 | 7,030,724 | 169 | 07:42:52 | 07:45:41 |
| triage | 1 | 4,337 | 82,765 | 42 | 08:01:23 | 08:02:05 |
| refute | 3 | 2,981 | 652,706 | 74 | 08:02:07 | 08:03:21 |
| capture | 1 | 151 | 77,499 | 7 | 08:03:23 | 08:03:30 |
| synthesize | 1 | 32 | 201,343 | 55 | 08:03:33 | 08:04:28 |

- **claude-sonnet-5-5**: 7 agent · 20 calls · out 8,798 · in 40 · cache_read 1,175,955 · cache_create 569,321
- **claude-haiku-4-5-20251001**: 20 agent · 48 calls · out 17,962 · in 424 · cache_read 2,256,208 · cache_create 747,686
- **claude-opus-5-5**: 3 agent · 57 calls · out 7,381 · in 114 · cache_read 7,030,724 · cache_create 442,674

### S4 round 2 — wf_122ebc69-9bc (29 agent, 44,238 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 9,017 | 10 | 431,185 | 70 |
| triage | claude-sonnet-5-5 | 2 | 5,532 | 4 | 83,879 | 46 |
| refute:chan-premerge.mjs | claude-sonnet-5-5 | 3 | 3,247 | 6 | 199,819 | 36 |
| review:measurement | claude-opus-5-5 | 17 | 2,214 | 34 | 2,283,412 | 199 |
| review:conventions | claude-opus-5-5 | 22 | 2,088 | 44 | 2,948,216 | 190 |
| review:bugs | claude-opus-5-5 | 28 | 2,009 | 56 | 3,877,342 | 274 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,806 | 18 | 86,571 | 100 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,523 | 18 | 86,571 | 132 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,424 | 18 | 86,558 | 27 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 1,374 | 18 | 86,577 | 36 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,307 | 18 | 86,558 | 23 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 1,306 | 18 | 86,576 | 33 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,195 | 18 | 86,571 | 238 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 1,078 | 18 | 86,578 | 29 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 1,041 | 18 | 86,575 | 34 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 1,011 | 18 | 59,146 | 128 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 976 | 18 | 86,580 | 20 |
| refute:chan-premerge.mjs | claude-sonnet-5-5 | 4 | 939 | 8 | 267,919 | 33 |
| refute:evidence-core.cjs | claude-sonnet-5-5 | 4 | 763 | 8 | 278,952 | 20 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 706 | 18 | 86,575 | 17 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 672 | 18 | 86,580 | 19 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 628 | 18 | 86,575 | 60 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 564 | 18 | 86,580 | 19 |
| machine:bash _acceptance/lan-ghim-lai-theo-paths | claude-haiku-4-5-20251001 | 2 | 486 | 18 | 86,578 | 18 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 426 | 18 | 86,607 | 78 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 311 | 18 | 86,565 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 242 | 18 | 86,607 | 60 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 206 | 18 | 86,607 | 225 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 77,528 | 6 |


wall: 1204s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 20 | 18,282 | 1,704,135 | 1036 | 08:25:44 | 08:42:59 |
| review | 3 | 6,311 | 9,108,970 | 293 | 08:25:44 | 08:30:37 |
| triage | 1 | 5,532 | 83,879 | 46 | 08:43:02 | 08:43:47 |
| refute | 3 | 4,949 | 746,690 | 39 | 08:43:50 | 08:44:28 |
| capture | 1 | 147 | 77,528 | 6 | 08:44:31 | 08:44:36 |
| synthesize | 1 | 9,017 | 431,185 | 70 | 08:44:38 | 08:45:48 |

- **claude-sonnet-5-5**: 6 agent · 20 calls · out 19,645 · in 40 · cache_read 1,339,282 · cache_create 511,967
- **claude-opus-5-5**: 3 agent · 67 calls · out 6,311 · in 134 · cache_read 9,108,970 · cache_create 502,770
- **claude-haiku-4-5-20251001**: 20 agent · 40 calls · out 18,282 · in 360 · cache_read 1,704,135 · cache_create 745,119

