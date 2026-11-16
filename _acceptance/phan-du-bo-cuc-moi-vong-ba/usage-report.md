### S4 round 1 — wf_0483440e-252 (36 agent, 167,137 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 21 | 22,329 | 42 | 1,341,546 | 1988 |
| review:bugs | claude-opus-5-5 | 20 | 18,529 | 40 | 2,434,962 | 235 |
| review:conventions | claude-opus-5-5 | 23 | 16,140 | 46 | 2,675,900 | 236 |
| review:measurement | claude-opus-5-5 | 16 | 14,631 | 32 | 1,575,424 | 193 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 13 | 14,188 | 26 | 744,941 | 1124 |
| synthesize:report | claude-sonnet-5-5 | 2 | 10,619 | 4 | 68,837 | 64 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 8,744 | 6 | 124,732 | 59 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 8 | 8,279 | 16 | 408,438 | 630 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 6 | 6,770 | 12 | 288,137 | 361 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,529 | 16 | 338,197 | 829 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,472 | 16 | 341,944 | 1122 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 3 | 3,663 | 6 | 107,862 | 73 |
| triage | claude-sonnet-5-5 | 2 | 3,479 | 4 | 52,653 | 26 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 3 | 2,658 | 6 | 107,868 | 54 |
| refute:hai-bo-cuc.test.mjs | claude-sonnet-5-5 | 8 | 2,396 | 16 | 391,195 | 59 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 2,297 | 8 | 115,774 | 758 |
| refute:hai-bo-cuc.test.mjs | claude-sonnet-5-5 | 6 | 2,197 | 12 | 290,165 | 42 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,966 | 4 | 49,338 | 101 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,712 | 4 | 49,338 | 16 |
| refute:giu-khoa-3.mjs | claude-sonnet-5-5 | 5 | 1,622 | 10 | 221,999 | 40 |
| machine:node tests/scripts/bang-ten-lo-trinh.tes | claude-haiku-5-5 | 2 | 1,616 | 4 | 49,355 | 22 |
| refute:evals.yaml | claude-sonnet-5-5 | 5 | 1,540 | 10 | 212,251 | 41 |
| refute:evals.yaml | claude-sonnet-5-5 | 4 | 1,305 | 8 | 153,666 | 35 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,225 | 4 | 46,047 | 300 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 2 | 1,194 | 4 | 49,384 | 35 |
| refute:evals.yaml | claude-sonnet-5-5 | 5 | 1,141 | 10 | 208,442 | 36 |
| refute:evals.yaml | claude-sonnet-5-5 | 3 | 1,127 | 6 | 101,540 | 30 |
| refute:giu-khoa-3.mjs | claude-sonnet-5-5 | 4 | 1,088 | 8 | 154,053 | 21 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 936 | 4 | 49,394 | 184 |
| machine:node tests/scripts/hai-bo-cuc.test.mjs | claude-haiku-5-5 | 2 | 873 | 4 | 49,352 | 18 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 2 | 861 | 4 | 49,377 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 830 | 4 | 49,394 | 114 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 662 | 4 | 49,364 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 649 | 4 | 49,394 | 98 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 515 | 4 | 49,339 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 355 | 4 | 44,826 | 21 |


wall: 3711s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 8,744 | 124,732 | 59 | 12:50:04 | 12:51:03 |
| machine | 21 | 82,224 | 4,383,783 | 3537 | 12:50:04 | 13:49:01 |
| review | 3 | 49,300 | 6,686,286 | 239 | 12:50:22 | 12:54:21 |
| triage | 1 | 3,479 | 52,653 | 26 | 13:49:01 | 13:49:27 |
| refute | 8 | 12,416 | 1,733,311 | 63 | 13:49:27 | 13:50:30 |
| capture | 1 | 355 | 44,826 | 21 | 13:50:30 | 13:50:51 |
| synthesize | 1 | 10,619 | 68,837 | 64 | 13:50:51 | 13:51:55 |

- **claude-haiku-5-5**: 21 agent · 98 calls · out 82,224 · in 196 · cache_read 4,383,783 · cache_create 1,299,054
- **claude-opus-5-5**: 3 agent · 59 calls · out 49,300 · in 118 · cache_read 6,686,286 · cache_create 524,440
- **claude-sonnet-5-5**: 12 agent · 49 calls · out 35,613 · in 98 · cache_read 2,024,359 · cache_create 717,393

