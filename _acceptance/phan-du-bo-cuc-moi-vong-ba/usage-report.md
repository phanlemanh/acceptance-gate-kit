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


### S4 round 2 — wf_dc8cc039-587 (32 agent, 168,296 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 22 | 22,867 | 44 | 1,418,668 | 2064 |
| review:bugs | claude-opus-5-5 | 17 | 21,236 | 34 | 1,875,878 | 270 |
| review:measurement | claude-opus-5-5 | 17 | 19,127 | 34 | 1,814,191 | 261 |
| review:conventions | claude-opus-5-5 | 28 | 14,409 | 56 | 3,494,866 | 259 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 13 | 14,087 | 26 | 746,323 | 1141 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 8 | 9,730 | 16 | 411,537 | 647 |
| synthesize:report | claude-sonnet-5-5 | 2 | 9,297 | 4 | 66,546 | 54 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 8,709 | 6 | 124,777 | 55 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 6 | 6,311 | 12 | 285,632 | 378 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 4,773 | 18 | 395,844 | 1127 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,691 | 14 | 287,916 | 766 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,289 | 16 | 342,349 | 823 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 3 | 4,225 | 6 | 108,015 | 92 |
| triage | claude-sonnet-5-5 | 2 | 3,348 | 4 | 51,820 | 23 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 3 | 2,809 | 6 | 107,903 | 61 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,989 | 4 | 49,378 | 98 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,735 | 4 | 49,378 | 15 |
| refute:giu-khoa-3.mjs | claude-sonnet-5-5 | 2 | 1,695 | 4 | 48,450 | 15 |
| refute:giu-khoa-3.mjs | claude-sonnet-5-5 | 2 | 1,626 | 4 | 45,528 | 14 |
| refute:giu-khoa-3.mjs | claude-sonnet-5-5 | 3 | 1,403 | 6 | 108,098 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,331 | 4 | 3,300 | 318 |
| refute:giu-khoa-3.mjs | claude-sonnet-5-5 | 3 | 1,204 | 6 | 103,825 | 13 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 2 | 1,138 | 4 | 49,424 | 26 |
| machine:node tests/scripts/hai-bo-cuc.test.mjs | claude-haiku-5-5 | 2 | 941 | 4 | 49,392 | 22 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 842 | 4 | 49,434 | 97 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 839 | 4 | 49,434 | 163 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 2 | 825 | 4 | 49,417 | 10 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 660 | 4 | 49,404 | 7 |
| machine:node tests/scripts/bang-ten-lo-trinh.tes | claude-haiku-5-5 | 2 | 654 | 4 | 49,395 | 18 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 627 | 4 | 49,379 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 526 | 4 | 49,434 | 110 |
| capture:provenance | claude-sonnet-5-5 | 2 | 353 | 4 | 44,866 | 6 |


wall: 3632s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 21 | 85,889 | 4,650,956 | 3531 | 14:41:06 | 15:39:56 |
| baseline | 1 | 8,709 | 124,777 | 55 | 14:41:06 | 14:42:00 |
| review | 3 | 54,772 | 7,184,935 | 278 | 14:41:17 | 14:45:56 |
| triage | 1 | 3,348 | 51,820 | 23 | 15:39:56 | 15:40:19 |
| refute | 4 | 5,928 | 305,901 | 18 | 15:40:19 | 15:40:37 |
| capture | 1 | 353 | 44,866 | 6 | 15:40:38 | 15:40:44 |
| synthesize | 1 | 9,297 | 66,546 | 54 | 15:40:44 | 15:41:38 |

- **claude-haiku-5-5**: 21 agent · 103 calls · out 85,889 · in 206 · cache_read 4,650,956 · cache_create 1,352,625
- **claude-opus-5-5**: 3 agent · 62 calls · out 54,772 · in 124 · cache_read 7,184,935 · cache_create 484,924
- **claude-sonnet-5-5**: 8 agent · 19 calls · out 27,635 · in 38 · cache_read 593,910 · cache_create 492,672


### S4 round 3 — wf_b7c2c890-dfc (30 agent, 165,943 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 22 | 25,735 | 44 | 2,974,230 | 333 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 22 | 22,843 | 44 | 1,418,220 | 2041 |
| review:measurement | claude-opus-5-5 | 21 | 18,905 | 42 | 2,607,926 | 268 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 13 | 15,148 | 26 | 748,107 | 1118 |
| review:conventions | claude-opus-5-5 | 26 | 14,791 | 52 | 3,050,216 | 251 |
| synthesize:report | claude-sonnet-5-5 | 2 | 9,080 | 4 | 66,158 | 53 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 8 | 8,695 | 16 | 409,178 | 622 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 8,680 | 6 | 124,842 | 54 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 6 | 7,027 | 12 | 285,689 | 365 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 3 | 4,081 | 6 | 107,954 | 89 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 3,952 | 12 | 224,813 | 821 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 11 | 3,842 | 22 | 509,637 | 1111 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 3 | 3,261 | 6 | 108,622 | 56 |
| triage | claude-sonnet-5-5 | 2 | 3,175 | 4 | 51,258 | 22 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,966 | 4 | 49,412 | 98 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,775 | 4 | 49,412 | 16 |
| machine:node tests/scripts/bang-ten-lo-trinh.tes | claude-haiku-5-5 | 2 | 1,616 | 4 | 49,429 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 1,597 | 8 | 115,849 | 758 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,546 | 4 | 46,121 | 299 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 2 | 1,111 | 4 | 49,458 | 28 |
| refute:giu-khoa-3.mjs | claude-sonnet-5-5 | 3 | 1,051 | 6 | 104,900 | 15 |
| machine:node tests/scripts/hai-bo-cuc.test.mjs | claude-haiku-5-5 | 2 | 954 | 4 | 49,426 | 27 |
| machine:node _acceptance/phan-du-bo-cuc-moi-vong | claude-haiku-5-5 | 2 | 936 | 4 | 49,451 | 13 |
| refute:giu-khoa-3.mjs | claude-sonnet-5-5 | 3 | 866 | 6 | 101,151 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 683 | 4 | 49,468 | 97 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 665 | 4 | 49,468 | 111 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 590 | 4 | 49,468 | 163 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 526 | 4 | 49,438 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 491 | 4 | 49,413 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 355 | 4 | 44,900 | 7 |


wall: 3586s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 8,680 | 124,842 | 54 | 16:18:02 | 16:18:55 |
| machine | 21 | 83,305 | 4,518,033 | 3487 | 16:18:02 | 17:16:09 |
| review | 3 | 59,431 | 8,632,372 | 343 | 16:18:16 | 16:23:59 |
| triage | 1 | 3,175 | 51,258 | 22 | 17:16:09 | 17:16:31 |
| refute | 2 | 1,917 | 206,051 | 16 | 17:16:31 | 17:16:47 |
| capture | 1 | 355 | 44,900 | 7 | 17:16:48 | 17:16:55 |
| synthesize | 1 | 9,080 | 66,158 | 53 | 17:16:55 | 17:17:48 |

- **claude-opus-5-5**: 3 agent · 69 calls · out 59,431 · in 138 · cache_read 8,632,372 · cache_create 586,569
- **claude-haiku-5-5**: 21 agent · 100 calls · out 83,305 · in 200 · cache_read 4,518,033 · cache_create 1,303,093
- **claude-sonnet-5-5**: 6 agent · 15 calls · out 23,207 · in 30 · cache_read 493,209 · cache_create 382,185

