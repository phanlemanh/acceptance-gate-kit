### S4 round 1 — wf_cb4bf090-ebf (27 agent, 115,620 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E9:domain-correctness | claude-sonnet-5-5 | 7 | 13,990 | 14 | 508,777 | 95 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 10 | 13,150 | 20 | 756,748 | 96 |
| synthesize:report | claude-sonnet-5-5 | 3 | 12,285 | 6 | 112,345 | 75 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 11 | 11,948 | 22 | 763,515 | 98 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,773 | 6 | 47,474 | 539 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 9 | 9,565 | 18 | 362,114 | 649 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 5 | 5,309 | 10 | 170,022 | 246 |
| review:conventions | claude-opus-5-5 | 12 | 4,322 | 24 | 561,105 | 47 |
| review:bugs | claude-opus-5-5 | 11 | 4,135 | 22 | 494,720 | 204 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 4,124 | 6 | 83,070 | 31 |
| review:measurement | claude-opus-5-5 | 7 | 4,092 | 14 | 288,912 | 45 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 3,608 | 14 | 211,237 | 853 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,416 | 4 | 3,140 | 601 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,097 | 4 | 38,842 | 94 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,079 | 4 | 35,702 | 2869 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,632 | 4 | 38,851 | 168 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 1,090 | 4 | 38,981 | 7 |
| machine:bash -c 'd=$(git diff --name-only 979620 | claude-haiku-5-5 | 2 | 1,087 | 4 | 38,941 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,069 | 4 | 38,898 | 83 |
| machine:bash _acceptance/release-2-29-0/lop-chep | claude-haiku-5-5 | 2 | 1,060 | 4 | 38,869 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,035 | 4 | 35,758 | 159 |
| machine:bash -c 'c=$(git show 979620ae:diagram-d | claude-haiku-5-5 | 2 | 1,025 | 4 | 38,970 | 7 |
| triage | claude-sonnet-5-5 | 2 | 961 | 4 | 37,033 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 946 | 4 | 38,843 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 436 | 4 | 34,490 | 9 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 1 | 386 | 2 | 3,140 | 2334 |
| machine:bash tests/scripts/run-tests.sh --manh m | <synthetic> | 1 | 0 | 0 | 0 | 2334 |


wall: 7946s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 11,773 | 47,474 | 539 | 08:12:20 | 08:21:19 |
| machine | 16 | 38,528 | 1,215,378 | 7848 | 08:12:20 | 10:23:08 |
| judge | 3 | 39,088 | 2,029,040 | 100 | 08:12:20 | 08:14:00 |
| review | 3 | 12,549 | 1,344,737 | 205 | 08:12:20 | 08:15:45 |
| triage | 1 | 961 | 37,033 | 14 | 10:23:08 | 10:23:22 |
| capture | 1 | 436 | 34,490 | 9 | 10:23:22 | 10:23:31 |
| synthesize | 1 | 12,285 | 112,345 | 75 | 10:23:31 | 10:24:46 |

- **claude-sonnet-5-5**: 7 agent · 38 calls · out 64,543 · in 76 · cache_read 2,260,382 · cache_create 607,690
- **claude-haiku-5-5**: 16 agent · 47 calls · out 38,528 · in 94 · cache_read 1,215,378 · cache_create 690,399
- **claude-opus-5-5**: 3 agent · 30 calls · out 12,549 · in 60 · cache_read 1,344,737 · cache_create 179,508
- **<synthetic>**: 1 agent · 1 calls · out 0 · in 0 · cache_read 0 · cache_create 0

### S4 round 1 (thử lại) — wf_83b29162-6bc (25 agent, 85,190 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,590 | 6 | 47,380 | 556 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 11 | 9,944 | 22 | 671,205 | 106 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 6 | 8,763 | 12 | 316,677 | 76 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 9 | 8,425 | 18 | 355,309 | 647 |
| synthesize:report | claude-sonnet-5-5 | 2 | 8,048 | 4 | 50,419 | 46 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 5 | 5,544 | 10 | 288,266 | 51 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 5 | 4,875 | 10 | 169,617 | 239 |
| review:bugs | claude-opus-5-5 | 11 | 3,650 | 22 | 446,939 | 47 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 3,580 | 12 | 163,541 | 880 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,385 | 6 | 82,273 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,000 | 4 | 3,140 | 437 |
| review:conventions | claude-opus-5-5 | 10 | 2,882 | 20 | 413,168 | 40 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,882 | 4 | 38,754 | 93 |
| review:measurement | claude-opus-5-5 | 5 | 1,500 | 10 | 170,430 | 20 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 1,334 | 6 | 42,479 | 617 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 865 | 4 | 38,893 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 813 | 4 | 38,810 | 155 |
| machine:bash -c 'd=$(git diff --name-only 979620 | claude-haiku-5-5 | 2 | 781 | 4 | 38,853 | 8 |
| machine:bash _acceptance/release-2-29-0/lop-chep | claude-haiku-5-5 | 2 | 759 | 4 | 38,781 | 11 |
| machine:bash -c 'c=$(git show 979620ae:diagram-d | claude-haiku-5-5 | 2 | 758 | 4 | 38,882 | 9 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 657 | 4 | 38,754 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 644 | 4 | 38,810 | 85 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 633 | 4 | 38,763 | 170 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 518 | 4 | 38,755 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 360 | 4 | 34,402 | 9 |


wall: 3209s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 11,590 | 47,380 | 556 | 15:40:01 | 15:49:17 |
| machine | 16 | 32,909 | 1,204,414 | 3151 | 15:40:01 | 16:32:32 |
| judge | 3 | 24,251 | 1,276,148 | 106 | 15:40:01 | 15:41:47 |
| review | 3 | 8,032 | 1,030,537 | 48 | 15:40:01 | 15:40:49 |
| capture | 1 | 360 | 34,402 | 9 | 16:32:34 | 16:32:43 |
| synthesize | 1 | 8,048 | 50,419 | 46 | 16:32:45 | 16:33:31 |

- **claude-sonnet-5-5**: 6 agent · 29 calls · out 44,249 · in 58 · cache_read 1,408,349 · cache_create 539,142
- **claude-haiku-5-5**: 16 agent · 48 calls · out 32,909 · in 96 · cache_read 1,204,414 · cache_create 716,516
- **claude-opus-5-5**: 3 agent · 26 calls · out 8,032 · in 52 · cache_read 1,030,537 · cache_create 153,949

### S4 round 2 — wf_5e9539fe-121 (26 agent, 83,793 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,566 | 6 | 47,491 | 559 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 9 | 8,637 | 18 | 546,233 | 87 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 7 | 8,416 | 14 | 403,192 | 74 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,587 | 4 | 49,407 | 47 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 8 | 7,455 | 16 | 308,004 | 610 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 10 | 6,934 | 20 | 645,243 | 90 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 5 | 4,986 | 10 | 169,916 | 229 |
| review:measurement | claude-opus-5-5 | 7 | 3,483 | 14 | 271,120 | 40 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,389 | 6 | 82,501 | 27 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,987 | 4 | 3,140 | 578 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,747 | 4 | 3,140 | 390 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 2,137 | 10 | 123,243 | 810 |
| review:bugs | claude-opus-5-5 | 7 | 2,036 | 14 | 258,244 | 70 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,884 | 4 | 38,865 | 92 |
| review:conventions | claude-opus-5-5 | 5 | 1,874 | 10 | 161,459 | 22 |
| machine:bash -c 'd=$(git diff --name-only 979620 | claude-haiku-5-5 | 2 | 1,063 | 4 | 38,964 | 7 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 888 | 4 | 39,004 | 8 |
| triage | claude-sonnet-5-5 | 2 | 873 | 4 | 37,080 | 10 |
| machine:bash -c 'c=$(git show 979620ae:diagram-d | claude-haiku-5-5 | 2 | 747 | 4 | 38,993 | 7 |
| machine:bash _acceptance/release-2-29-0/lop-chep | claude-haiku-5-5 | 2 | 711 | 4 | 38,892 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 689 | 4 | 38,874 | 160 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 681 | 4 | 38,921 | 78 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 642 | 4 | 38,865 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 592 | 4 | 35,781 | 181 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 438 | 4 | 38,866 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 351 | 4 | 34,513 | 12 |


wall: 3034s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 11,566 | 47,491 | 559 | 17:37:09 | 17:46:28 |
| machine | 16 | 32,036 | 1,075,969 | 2958 | 17:37:09 | 18:26:27 |
| judge | 3 | 23,987 | 1,594,668 | 90 | 17:37:09 | 17:38:39 |
| review | 3 | 7,393 | 690,823 | 71 | 17:37:09 | 17:38:19 |
| triage | 1 | 873 | 37,080 | 10 | 18:26:29 | 18:26:39 |
| capture | 1 | 351 | 34,513 | 12 | 18:26:41 | 18:26:53 |
| synthesize | 1 | 7,587 | 49,407 | 47 | 18:26:55 | 18:27:42 |

- **claude-sonnet-5-5**: 7 agent · 35 calls · out 44,364 · in 70 · cache_read 1,763,159 · cache_create 568,195
- **claude-haiku-5-5**: 16 agent · 45 calls · out 32,036 · in 90 · cache_read 1,075,969 · cache_create 720,211
- **claude-opus-5-5**: 3 agent · 19 calls · out 7,393 · in 38 · cache_read 690,823 · cache_create 141,705

