### S4 round 1 — wf_94d763dd-d09 (28 agent, 93,627 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 10 | 14,606 | 20 | 641,286 | 156 |
| review:conventions | claude-opus-5-5 | 17 | 13,272 | 34 | 1,157,109 | 150 |
| synthesize:report | claude-sonnet-5-5 | 5 | 11,880 | 10 | 256,014 | 93 |
| review:measurement | claude-opus-5-5 | 10 | 11,644 | 20 | 645,718 | 126 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 7,046 | 4 | 42,367 | 38 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 5,024 | 14 | 205,198 | 966 |
| triage | claude-sonnet-5-5 | 2 | 4,108 | 4 | 39,775 | 31 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,232 | 4 | 3,034 | 489 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,368 | 4 | 38,194 | 90 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,169 | 4 | 3,034 | 421 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,903 | 4 | 38,194 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,707 | 4 | 35,169 | 186 |
| machine:node tests/design-eval/vi-phan-kho.mjs | claude-haiku-5-5 | 2 | 1,205 | 4 | 38,204 | 49 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,179 | 4 | 3,034 | 565 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,151 | 4 | 38,250 | 119 |
| machine:bash tests/design-eval/kdd.sh KD1 | claude-haiku-5-5 | 2 | 1,083 | 4 | 38,200 | 9 |
| machine:bash tests/design-eval/kdd.sh KD7 | claude-haiku-5-5 | 2 | 1,078 | 4 | 38,200 | 42 |
| machine:bash tests/design-eval/kdd.sh --hoi-quy | claude-haiku-5-5 | 2 | 1,042 | 4 | 38,208 | 55 |
| machine:bash tests/design-eval/kdd.sh KD3 | claude-haiku-5-5 | 2 | 992 | 4 | 38,200 | 12 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 920 | 4 | 38,195 | 6 |
| machine:bash tests/design-eval/kdd.sh KD4 | claude-haiku-5-5 | 2 | 876 | 4 | 38,200 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 849 | 4 | 38,250 | 77 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 835 | 4 | 38,220 | 6 |
| machine:bash tests/design-eval/kdd.sh KD8-ci | claude-haiku-5-5 | 2 | 816 | 4 | 38,206 | 10 |
| machine:bash tests/design-eval/kdd.sh KD6 | claude-haiku-5-5 | 2 | 786 | 4 | 38,200 | 11 |
| machine:bash tests/design-eval/kdd.sh KD2 | claude-haiku-5-5 | 2 | 766 | 4 | 38,200 | 12 |
| machine:bash tests/design-eval/kdd.sh KD5 | claude-haiku-5-5 | 2 | 736 | 4 | 38,200 | 11 |
| capture:provenance | claude-sonnet-5-5 | 2 | 354 | 4 | 33,948 | 6 |


wall: 3098s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,046 | 42,367 | 38 | 07:28:42 | 07:29:20 |
| machine | 21 | 30,717 | 860,790 | 2961 | 07:28:42 | 08:18:03 |
| review | 3 | 39,522 | 2,444,113 | 157 | 07:28:56 | 07:31:32 |
| triage | 1 | 4,108 | 39,775 | 31 | 08:18:06 | 08:18:36 |
| capture | 1 | 354 | 33,948 | 6 | 08:18:39 | 08:18:45 |
| synthesize | 1 | 11,880 | 256,014 | 93 | 08:18:47 | 08:20:20 |

- **claude-opus-5-5**: 3 agent · 37 calls · out 39,522 · in 74 · cache_read 2,444,113 · cache_create 276,989
- **claude-sonnet-5-5**: 4 agent · 11 calls · out 23,388 · in 22 · cache_read 372,104 · cache_create 204,701
- **claude-haiku-5-5**: 21 agent · 47 calls · out 30,717 · in 94 · cache_read 860,790 · cache_create 900,353

### S4 round 2 — wf_e995242b-b88 (29 agent, 84,592 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 12 | 13,328 | 24 | 716,908 | 169 |
| synthesize:report | claude-sonnet-5-5 | 4 | 10,841 | 8 | 212,163 | 65 |
| review:measurement | claude-opus-5-5 | 12 | 8,911 | 24 | 736,765 | 157 |
| review:conventions | claude-opus-5-5 | 12 | 8,679 | 24 | 696,382 | 124 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 7,627 | 4 | 43,161 | 46 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,983 | 12 | 162,302 | 886 |
| triage | claude-sonnet-5-5 | 2 | 3,715 | 4 | 39,716 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,158 | 4 | 3,034 | 442 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,135 | 4 | 3,034 | 370 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,108 | 4 | 38,457 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,928 | 4 | 38,457 | 86 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,575 | 4 | 35,432 | 175 |
| machine:bash tests/design-eval/kdd.sh KD7 | claude-haiku-5-5 | 2 | 1,204 | 4 | 38,463 | 46 |
| machine:bash tests/design-eval/kdd.sh KD5 | claude-haiku-5-5 | 2 | 1,049 | 4 | 38,463 | 12 |
| machine:node tests/design-eval/vi-phan-kho.mjs | claude-haiku-5-5 | 2 | 1,041 | 4 | 38,467 | 42 |
| machine:bash tests/design-eval/kdd.sh KD4 | claude-haiku-5-5 | 2 | 1,006 | 4 | 38,463 | 10 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 1,002 | 4 | 38,458 | 6 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 992 | 4 | 38,483 | 5 |
| machine:bash tests/design-eval/kdd.sh KD1 | claude-haiku-5-5 | 2 | 954 | 4 | 38,463 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 951 | 4 | 38,513 | 120 |
| machine:bash tests/design-eval/kdd.sh --hoi-quy | claude-haiku-5-5 | 2 | 943 | 4 | 38,471 | 59 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 921 | 4 | 3,034 | 590 |
| machine:bash tests/design-eval/kdd.sh KD6 | claude-haiku-5-5 | 2 | 920 | 4 | 38,463 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 920 | 4 | 38,513 | 79 |
| machine:bash tests/design-eval/kdd.sh KD2 | claude-haiku-5-5 | 2 | 885 | 4 | 38,463 | 13 |
| machine:bash tests/design-eval/kdd.sh KD9 | claude-haiku-5-5 | 2 | 846 | 4 | 38,463 | 12 |
| machine:bash tests/design-eval/kdd.sh KD3 | claude-haiku-5-5 | 2 | 808 | 4 | 38,463 | 9 |
| machine:bash tests/design-eval/kdd.sh KD8-ci | claude-haiku-5-5 | 2 | 798 | 4 | 38,469 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 364 | 4 | 34,211 | 6 |


wall: 2900s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,627 | 43,161 | 46 | 10:06:09 | 10:06:54 |
| machine | 22 | 31,127 | 860,828 | 2793 | 10:06:09 | 10:52:41 |
| review | 3 | 30,918 | 2,150,055 | 174 | 10:06:21 | 10:09:16 |
| triage | 1 | 3,715 | 39,716 | 30 | 10:52:44 | 10:53:14 |
| capture | 1 | 364 | 34,211 | 6 | 10:53:16 | 10:53:22 |
| synthesize | 1 | 10,841 | 212,163 | 65 | 10:53:24 | 10:54:29 |

- **claude-opus-5-5**: 3 agent · 36 calls · out 30,918 · in 72 · cache_read 2,150,055 · cache_create 246,961
- **claude-sonnet-5-5**: 4 agent · 10 calls · out 22,547 · in 20 · cache_read 329,251 · cache_create 227,676
- **claude-haiku-5-5**: 22 agent · 48 calls · out 31,127 · in 96 · cache_read 860,828 · cache_create 940,962

### S4 round 3 — wf_19d5aa01-baa (30 agent, 100,900 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 12 | 19,416 | 24 | 768,403 | 225 |
| synthesize:report | claude-sonnet-5-5 | 8 | 13,918 | 16 | 609,111 | 99 |
| review:conventions | claude-opus-5-5 | 13 | 10,718 | 26 | 721,826 | 139 |
| review:measurement | claude-opus-5-5 | 10 | 9,172 | 20 | 569,578 | 157 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 7,808 | 4 | 43,165 | 43 |
| triage | claude-sonnet-5-5 | 2 | 5,088 | 4 | 40,854 | 43 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 5,012 | 14 | 203,184 | 943 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,210 | 4 | 3,034 | 450 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,355 | 4 | 38,472 | 92 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,324 | 4 | 3,034 | 399 |
| refute:khong-do-duoc.test.mjs | claude-sonnet-5-5 | 5 | 2,121 | 10 | 171,214 | 28 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,114 | 4 | 38,472 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,925 | 4 | 35,447 | 185 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,265 | 4 | 38,528 | 114 |
| machine:bash tests/design-eval/kdd.sh KD2 | claude-haiku-5-5 | 2 | 1,107 | 4 | 38,478 | 13 |
| machine:bash tests/design-eval/kdd.sh KD5 | claude-haiku-5-5 | 2 | 1,090 | 4 | 38,478 | 12 |
| machine:bash tests/design-eval/kdd.sh KD9 | claude-haiku-5-5 | 2 | 1,013 | 4 | 38,478 | 16 |
| machine:bash tests/design-eval/kdd.sh --hoi-quy | claude-haiku-5-5 | 2 | 1,003 | 4 | 38,486 | 71 |
| machine:node tests/design-eval/vi-phan-kho.mjs | claude-haiku-5-5 | 2 | 994 | 4 | 38,482 | 46 |
| machine:bash tests/design-eval/kdd.sh KD7 | claude-haiku-5-5 | 2 | 981 | 4 | 38,478 | 54 |
| machine:bash tests/design-eval/kdd.sh KD6 | claude-haiku-5-5 | 2 | 960 | 4 | 38,478 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 953 | 4 | 3,034 | 573 |
| machine:bash tests/design-eval/kdd.sh KD3 | claude-haiku-5-5 | 2 | 946 | 4 | 38,478 | 10 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 942 | 4 | 38,498 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 892 | 4 | 38,473 | 7 |
| machine:bash tests/design-eval/kdd.sh KD1 | claude-haiku-5-5 | 2 | 853 | 4 | 38,478 | 9 |
| machine:bash tests/design-eval/kdd.sh KD10 | claude-haiku-5-5 | 2 | 806 | 4 | 38,478 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 778 | 4 | 38,528 | 81 |
| machine:bash tests/design-eval/kdd.sh KD4 | claude-haiku-5-5 | 2 | 775 | 4 | 38,478 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 361 | 4 | 34,226 | 7 |


wall: 3084s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,808 | 43,165 | 43 | 12:53:45 | 12:54:28 |
| machine | 22 | 32,298 | 901,974 | 2896 | 12:53:45 | 13:42:01 |
| review | 3 | 39,306 | 2,059,807 | 228 | 12:53:59 | 12:57:47 |
| triage | 1 | 5,088 | 40,854 | 43 | 13:42:03 | 13:42:47 |
| refute | 1 | 2,121 | 171,214 | 28 | 13:42:49 | 13:43:16 |
| capture | 1 | 361 | 34,226 | 7 | 13:43:19 | 13:43:26 |
| synthesize | 1 | 13,918 | 609,111 | 99 | 13:43:30 | 13:45:09 |

- **claude-opus-5-5**: 3 agent · 35 calls · out 39,306 · in 70 · cache_read 2,059,807 · cache_create 241,300
- **claude-sonnet-5-5**: 5 agent · 19 calls · out 29,296 · in 38 · cache_read 898,570 · cache_create 286,808
- **claude-haiku-5-5**: 22 agent · 49 calls · out 32,298 · in 98 · cache_read 901,974 · cache_create 942,185

