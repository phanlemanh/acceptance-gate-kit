### S4 round 1 — wf_9b2149e0-165 (35 agent, 128,698 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 29 | 24,421 | 58 | 3,572,201 | 376 |
| review:conventions | claude-opus-5-5 | 24 | 19,291 | 48 | 2,667,088 | 258 |
| review:measurement | claude-opus-5-5 | 18 | 18,250 | 36 | 1,800,528 | 265 |
| synthesize:report | claude-sonnet-5-5 | 2 | 12,117 | 4 | 67,514 | 68 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 8,510 | 6 | 54,542 | 529 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,721 | 16 | 346,509 | 1092 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 3,811 | 18 | 394,797 | 1103 |
| triage | claude-sonnet-5-5 | 2 | 3,692 | 4 | 52,596 | 26 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,287 | 4 | 3,416 | 548 |
| refute:bo-cuc-moi.mjs | claude-sonnet-5-5 | 6 | 2,126 | 12 | 281,790 | 30 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,942 | 4 | 49,525 | 101 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,921 | 4 | 49,525 | 15 |
| refute:vi-phan-cu.mjs | claude-sonnet-5-5 | 3 | 1,668 | 6 | 105,120 | 32 |
| refute:bo-cuc-moi.mjs | claude-sonnet-5-5 | 2 | 1,589 | 4 | 48,327 | 18 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 1,570 | 6 | 61,392 | 672 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,570 | 4 | 6,832 | 491 |
| refute:vi-phan-cu.mjs | claude-sonnet-5-5 | 3 | 1,532 | 6 | 104,093 | 17 |
| refute:evals.yaml | claude-sonnet-5-5 | 5 | 1,484 | 10 | 214,478 | 21 |
| machine:node _acceptance/goi-cheo-loi-dieu-phoi/ | claude-haiku-5-5 | 2 | 1,476 | 4 | 49,558 | 124 |
| machine:node _acceptance/goi-cheo-loi-dieu-phoi/ | claude-haiku-5-5 | 2 | 1,434 | 4 | 49,565 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,399 | 4 | 0 | 479 |
| machine:node _acceptance/goi-cheo-loi-dieu-phoi/ | claude-haiku-5-5 | 2 | 1,297 | 4 | 49,559 | 20 |
| machine:node tests/scripts/cua-tin-hieu-goc-moi- | claude-haiku-5-5 | 2 | 1,044 | 4 | 49,550 | 57 |
| refute:bo-cuc-moi.mjs | claude-sonnet-5-5 | 3 | 1,016 | 6 | 105,750 | 17 |
| machine:node tests/scripts/mot-nguon-ten-va-hop- | claude-haiku-5-5 | 2 | 946 | 4 | 49,547 | 8 |
| machine:node tests/scripts/tin-hieu.test.mjs | claude-haiku-5-5 | 2 | 819 | 4 | 49,533 | 159 |
| refute:vi-phan-cu.mjs | claude-sonnet-5-5 | 2 | 748 | 4 | 48,266 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 740 | 4 | 49,581 | 174 |
| machine:RT_CASES=RT13 node tests/plugins/ra-co-t | claude-haiku-5-5 | 2 | 740 | 4 | 49,550 | 23 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 699 | 4 | 49,581 | 97 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 665 | 4 | 49,551 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 649 | 4 | 49,581 | 121 |
| machine:node tests/scripts/cua-tin-hieu-giua-chi | claude-haiku-5-5 | 2 | 609 | 4 | 49,548 | 41 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 541 | 4 | 49,526 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 374 | 4 | 44,907 | 6 |


wall: 3878s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 8,510 | 54,542 | 529 | 14:17:52 | 14:26:40 |
| machine | 21 | 31,880 | 1,556,226 | 3743 | 14:17:52 | 15:20:15 |
| review | 3 | 61,962 | 8,039,817 | 389 | 14:18:01 | 14:24:30 |
| triage | 1 | 3,692 | 52,596 | 26 | 15:20:15 | 15:20:41 |
| refute | 7 | 10,163 | 907,824 | 34 | 15:20:41 | 15:21:15 |
| capture | 1 | 374 | 44,907 | 6 | 15:21:15 | 15:21:21 |
| synthesize | 1 | 12,117 | 67,514 | 68 | 15:21:21 | 15:22:29 |

- **claude-opus-5-5**: 3 agent · 71 calls · out 61,962 · in 142 · cache_read 8,039,817 · cache_create 471,986
- **claude-sonnet-5-5**: 11 agent · 33 calls · out 34,856 · in 66 · cache_read 1,127,383 · cache_create 728,279
- **claude-haiku-5-5**: 21 agent · 56 calls · out 31,880 · in 112 · cache_read 1,556,226 · cache_create 1,362,370

### S4 round 2 — wf_5911a2bc-5a5 (21 agent, 65,466 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 8,129 | 4 | 63,550 | 50 |
| review:bugs | claude-opus-5-5 | 12 | 7,542 | 24 | 777,269 | 179 |
| review:conventions | claude-opus-5-5 | 13 | 7,511 | 26 | 852,854 | 185 |
| review:measurement | claude-opus-5-5 | 10 | 7,303 | 20 | 622,718 | 108 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 6,453 | 16 | 343,687 | 1099 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 13 | 6,157 | 26 | 631,086 | 1498 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 4,468 | 6 | 112,978 | 32 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,494 | 4 | 3,416 | 551 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,052 | 4 | 49,501 | 16 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,012 | 4 | 49,501 | 98 |
| triage | claude-sonnet-5-5 | 2 | 1,605 | 4 | 48,934 | 14 |
| machine:node _acceptance/goi-cheo-loi-dieu-phoi/ | claude-haiku-5-5 | 2 | 1,591 | 4 | 49,535 | 21 |
| machine:node _acceptance/goi-cheo-loi-dieu-phoi/ | claude-haiku-5-5 | 2 | 1,581 | 4 | 49,541 | 26 |
| machine:node _acceptance/goi-cheo-loi-dieu-phoi/ | claude-haiku-5-5 | 2 | 1,436 | 4 | 49,534 | 73 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,055 | 4 | 3,416 | 336 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 924 | 4 | 49,557 | 182 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 797 | 4 | 49,557 | 96 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 748 | 4 | 49,527 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 619 | 4 | 49,557 | 120 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 615 | 4 | 49,502 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 374 | 4 | 44,883 | 6 |


wall: 4077s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 22,356 | 2,252,841 | 185 | 15:28:11 | 15:31:16 |
| machine | 14 | 28,534 | 1,476,917 | 4007 | 15:28:11 | 16:34:58 |
| baseline | 1 | 4,468 | 112,978 | 32 | 15:28:11 | 15:28:43 |
| triage | 1 | 1,605 | 48,934 | 14 | 16:34:58 | 16:35:12 |
| capture | 1 | 374 | 44,883 | 6 | 16:35:12 | 16:35:19 |
| synthesize | 1 | 8,129 | 63,550 | 50 | 16:35:19 | 16:36:08 |

- **claude-sonnet-5-5**: 4 agent · 9 calls · out 14,576 · in 18 · cache_read 270,345 · cache_create 256,551
- **claude-opus-5-5**: 3 agent · 35 calls · out 22,356 · in 70 · cache_read 2,252,841 · cache_create 241,986
- **claude-haiku-5-5**: 14 agent · 45 calls · out 28,534 · in 90 · cache_read 1,476,917 · cache_create 915,426

### S4 round 3 — wf_31f93aad-b66 (17 agent, 87,449 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 32 | 20,930 | 64 | 3,995,123 | 316 |
| review:conventions | claude-opus-5-5 | 29 | 19,309 | 58 | 3,535,925 | 275 |
| review:measurement | claude-opus-5-5 | 9 | 12,330 | 18 | 699,797 | 149 |
| synthesize:report | claude-sonnet-5-5 | 4 | 8,932 | 8 | 238,599 | 54 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 6,638 | 18 | 399,916 | 1070 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 10 | 5,088 | 20 | 469,020 | 1100 |
| triage | claude-sonnet-5-5 | 2 | 3,599 | 4 | 51,081 | 27 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,652 | 4 | 3,416 | 521 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,746 | 4 | 49,516 | 97 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,561 | 4 | 46,109 | 238 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 986 | 4 | 49,572 | 171 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 797 | 4 | 49,542 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 671 | 4 | 49,572 | 96 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 664 | 4 | 49,572 | 120 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 595 | 4 | 49,517 | 6 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 576 | 4 | 49,516 | 11 |
| capture:provenance | claude-sonnet-5-5 | 2 | 375 | 4 | 44,898 | 6 |


wall: 3524s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 52,569 | 8,230,845 | 320 | 16:44:04 | 16:49:24 |
| machine | 11 | 21,974 | 1,265,268 | 3436 | 16:44:04 | 17:41:20 |
| triage | 1 | 3,599 | 51,081 | 27 | 17:41:20 | 17:41:48 |
| capture | 1 | 375 | 44,898 | 6 | 17:41:48 | 17:41:54 |
| synthesize | 1 | 8,932 | 238,599 | 54 | 17:41:54 | 17:42:48 |

- **claude-opus-5-5**: 3 agent · 70 calls · out 52,569 · in 140 · cache_read 8,230,845 · cache_create 461,892
- **claude-sonnet-5-5**: 3 agent · 8 calls · out 12,906 · in 16 · cache_read 334,578 · cache_create 204,830
- **claude-haiku-5-5**: 11 agent · 37 calls · out 21,974 · in 74 · cache_read 1,265,268 · cache_create 721,776

