### S4 round 1 — wf_89ca5398-d35 (26 agent, 86,722 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 23,481 | 12 | 595,584 | 181 |
| triage | claude-sonnet-5-5 | 2 | 14,530 | 4 | 89,707 | 91 |
| review:measurement | claude-opus-5-5 | 19 | 8,045 | 38 | 2,935,866 | 368 |
| review:conventions | claude-opus-5-5 | 46 | 6,046 | 92 | 7,882,362 | 355 |
| review:bugs | claude-opus-5-5 | 33 | 4,434 | 66 | 5,666,819 | 491 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 6 | 4,192 | 12 | 569,604 | 97 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,627 | 4 | 116,255 | 214 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 2,398 | 4 | 116,352 | 52 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 2,377 | 8 | 210,191 | 654 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,298 | 4 | 34,982 | 422 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 2,266 | 4 | 81,268 | 196 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 3 | 1,805 | 6 | 225,556 | 120 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 5 | 1,772 | 10 | 471,491 | 94 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,644 | 4 | 116,241 | 12 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,508 | 4 | 116,241 | 87 |
| refute:lop-mod.test.mjs | claude-sonnet-5-5 | 12 | 1,418 | 24 | 1,243,173 | 72 |
| refute:phan-loai-s4.mjs | claude-sonnet-5-5 | 9 | 1,299 | 18 | 761,517 | 38 |
| refute:lop-mod.test.mjs | claude-sonnet-5-5 | 14 | 1,123 | 28 | 1,381,007 | 99 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 833 | 4 | 116,297 | 133 |
| refute:README.md | claude-sonnet-5-5 | 3 | 696 | 6 | 200,264 | 15 |
| refute:README.md | claude-sonnet-5-5 | 3 | 606 | 6 | 165,678 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 455 | 4 | 116,242 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 447 | 4 | 116,297 | 299 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 170 | 4 | 116,297 | 75 |
| capture:provenance | claude-sonnet-5-5 | 2 | 138 | 4 | 80,047 | 6 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 114 | 4 | 83,234 | 63 |


wall: 2504s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 114 | 83,234 | 63 | 04:45:04 | 04:46:07 |
| machine | 11 | 17,023 | 1,256,663 | 2117 | 04:45:04 | 05:20:20 |
| judge | 3 | 7,769 | 1,266,651 | 120 | 04:45:04 | 04:47:03 |
| review | 3 | 18,525 | 16,485,047 | 492 | 04:45:04 | 04:53:16 |
| triage | 1 | 14,530 | 89,707 | 91 | 05:20:22 | 05:21:53 |
| refute | 5 | 5,142 | 3,751,639 | 101 | 05:21:55 | 05:23:37 |
| capture | 1 | 138 | 80,047 | 6 | 05:23:39 | 05:23:45 |
| synthesize | 1 | 23,481 | 595,584 | 181 | 05:23:47 | 05:26:48 |

- **claude-sonnet-5-5**: 12 agent · 67 calls · out 51,174 · in 134 · cache_read 5,866,862 · cache_create 1,148,105
- **claude-opus-5-5**: 3 agent · 98 calls · out 18,525 · in 196 · cache_read 16,485,047 · cache_create 592,063
- **claude-haiku-5-5**: 11 agent · 24 calls · out 17,023 · in 48 · cache_read 1,256,663 · cache_create 776,534

### S4 round 2 — wf_dba5a4c5-26b (22 agent, 94,605 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 20,978 | 12 | 637,912 | 143 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 4 | 12,932 | 8 | 311,981 | 85 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 5 | 11,878 | 10 | 473,540 | 80 |
| triage | claude-sonnet-5-5 | 2 | 11,209 | 4 | 87,109 | 71 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 5 | 9,297 | 10 | 463,332 | 116 |
| review:conventions | claude-opus-5-5 | 13 | 4,348 | 26 | 1,386,757 | 132 |
| review:bugs | claude-opus-5-5 | 16 | 3,661 | 32 | 1,979,468 | 246 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,882 | 4 | 116,751 | 223 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 2,773 | 4 | 116,848 | 56 |
| review:measurement | claude-opus-5-5 | 13 | 2,754 | 26 | 1,472,054 | 159 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,520 | 4 | 69,964 | 424 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,897 | 4 | 116,737 | 13 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,856 | 4 | 116,737 | 88 |
| refute:phan-loai-s4.mjs | claude-sonnet-5-5 | 8 | 1,395 | 16 | 651,156 | 37 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 1,393 | 6 | 157,487 | 643 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 897 | 4 | 116,793 | 127 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 497 | 4 | 116,793 | 77 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 465 | 4 | 116,738 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 460 | 4 | 116,793 | 296 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 269 | 4 | 116,746 | 192 |
| capture:provenance | claude-sonnet-5-5 | 2 | 134 | 4 | 115,382 | 7 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 110 | 4 | 83,738 | 55 |


wall: 2378s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 110 | 83,738 | 55 | 05:34:01 | 05:34:56 |
| machine | 11 | 15,909 | 1,278,387 | 2109 | 05:34:01 | 06:09:10 |
| judge | 3 | 34,107 | 1,248,853 | 118 | 05:34:01 | 05:36:00 |
| review | 3 | 10,763 | 4,838,279 | 247 | 05:34:01 | 05:38:08 |
| triage | 1 | 11,209 | 87,109 | 71 | 06:09:15 | 06:10:26 |
| refute | 1 | 1,395 | 651,156 | 37 | 06:10:28 | 06:11:05 |
| capture | 1 | 134 | 115,382 | 7 | 06:11:07 | 06:11:14 |
| synthesize | 1 | 20,978 | 637,912 | 143 | 06:11:16 | 06:13:40 |

- **claude-sonnet-5-5**: 8 agent · 34 calls · out 67,933 · in 68 · cache_read 2,824,150 · cache_create 776,211
- **claude-opus-5-5**: 3 agent · 42 calls · out 10,763 · in 84 · cache_read 4,838,279 · cache_create 372,959
- **claude-haiku-5-5**: 11 agent · 23 calls · out 15,909 · in 46 · cache_read 1,278,387 · cache_create 677,977

### S4 round 3 — wf_953f6133-ea9 (25 agent, 104,800 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 20,443 | 12 | 602,012 | 144 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 3 | 15,552 | 6 | 228,201 | 100 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 2 | 14,621 | 4 | 81,921 | 94 |
| triage | claude-sonnet-5-5 | 2 | 13,681 | 4 | 88,458 | 87 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 4 | 8,455 | 8 | 360,657 | 62 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 4,129 | 4 | 117,078 | 65 |
| review:measurement | claude-opus-5-5 | 17 | 3,706 | 34 | 2,473,544 | 317 |
| review:bugs | claude-opus-5-5 | 47 | 2,824 | 94 | 7,778,526 | 450 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,741 | 4 | 34,982 | 427 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,684 | 4 | 116,981 | 220 |
| refute:evals.yaml | claude-sonnet-5-5 | 6 | 2,514 | 12 | 498,533 | 46 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,079 | 12 | 391,398 | 738 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,761 | 4 | 116,967 | 15 |
| review:conventions | claude-opus-5-5 | 16 | 1,755 | 32 | 2,009,998 | 165 |
| refute:evals.yaml | claude-sonnet-5-5 | 7 | 1,509 | 14 | 651,223 | 50 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 116,967 | 87 |
| refute:phan-loai-s4.mjs | claude-sonnet-5-5 | 6 | 1,154 | 12 | 489,588 | 31 |
| refute:evals.yaml | claude-sonnet-5-5 | 6 | 1,114 | 12 | 515,067 | 39 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 869 | 4 | 117,023 | 130 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 472 | 4 | 116,968 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 447 | 4 | 117,023 | 300 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 363 | 4 | 117,023 | 77 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 195 | 4 | 81,994 | 189 |
| capture:provenance | claude-sonnet-5-5 | 2 | 138 | 4 | 80,773 | 6 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 110 | 4 | 83,962 | 56 |


wall: 2518s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 110 | 83,962 | 56 | 06:57:38 | 06:58:34 |
| machine | 11 | 17,224 | 1,444,404 | 2219 | 06:57:38 | 07:34:37 |
| judge | 3 | 38,628 | 670,779 | 103 | 06:57:38 | 06:59:21 |
| review | 3 | 8,285 | 12,262,068 | 451 | 06:57:38 | 07:05:09 |
| triage | 1 | 13,681 | 88,458 | 87 | 07:34:39 | 07:36:06 |
| refute | 4 | 6,291 | 2,154,411 | 53 | 07:36:09 | 07:37:01 |
| capture | 1 | 138 | 80,773 | 6 | 07:37:03 | 07:37:09 |
| synthesize | 1 | 20,443 | 602,012 | 144 | 07:37:12 | 07:39:36 |

- **claude-sonnet-5-5**: 11 agent · 46 calls · out 79,291 · in 92 · cache_read 3,680,395 · cache_create 1,112,583
- **claude-haiku-5-5**: 11 agent · 26 calls · out 17,224 · in 52 · cache_read 1,444,404 · cache_create 784,034
- **claude-opus-5-5**: 3 agent · 80 calls · out 8,285 · in 160 · cache_read 12,262,068 · cache_create 544,547

