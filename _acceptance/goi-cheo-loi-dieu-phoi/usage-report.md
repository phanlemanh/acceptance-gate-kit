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

