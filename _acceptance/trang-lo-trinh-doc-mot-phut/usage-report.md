### S4 round 1 — wf_898dd6e8-9d9 (28 agent, 54,105 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 10,403 | 6 | 213,625 | 79 |
| triage | claude-sonnet-5-5 | 2 | 4,604 | 4 | 85,996 | 37 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 2 | 3,850 | 4 | 115,995 | 32 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 2 | 3,728 | 4 | 115,993 | 31 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 2 | 3,644 | 4 | 81,070 | 31 |
| review:measurement | claude-opus-5-5 | 19 | 3,556 | 38 | 2,769,823 | 274 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-4-5-20251001 | 2 | 2,837 | 18 | 90,289 | 68 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 4 | 2,182 | 8 | 306,529 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,941 | 18 | 90,294 | 142 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,761 | 18 | 90,294 | 112 |
| review:bugs | claude-opus-5-5 | 16 | 1,536 | 32 | 2,128,643 | 174 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,523 | 18 | 90,294 | 245 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 3 | 1,466 | 6 | 202,009 | 24 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,379 | 18 | 90,281 | 27 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,337 | 18 | 90,281 | 24 |
| machine:node tests/scripts/xem-trang-lo-trinh.te | claude-haiku-4-5-20251001 | 2 | 1,220 | 18 | 90,298 | 26 |
| triage | claude-sonnet-5-5 | 2 | 1,135 | 4 | 117,534 | 11 |
| review:conventions | claude-opus-5-5 | 31 | 972 | 62 | 4,825,766 | 223 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 935 | 18 | 61,260 | 121 |
| refute:lo-trinh.mjs | claude-sonnet-5-5 | 6 | 933 | 12 | 449,851 | 25 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 4 | 849 | 8 | 295,572 | 20 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 5 | 671 | 10 | 380,862 | 18 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 391 | 18 | 90,330 | 77 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 327 | 8 | 252,337 | 33 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 292 | 18 | 90,288 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 282 | 18 | 90,330 | 60 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 209 | 18 | 90,330 | 227 |
| capture:provenance | claude-sonnet-5-5 | 2 | 142 | 4 | 80,122 | 6 |


wall: 1239s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 327 | 252,337 | 33 | 15:51:03 | 15:51:36 |
| machine | 12 | 14,107 | 1,054,569 | 1063 | 15:51:03 | 16:08:46 |
| judge | 3 | 11,222 | 313,058 | 35 | 15:51:03 | 15:51:38 |
| review | 3 | 6,064 | 9,724,232 | 275 | 15:51:03 | 15:55:38 |
| triage | 2 | 5,739 | 203,530 | 50 | 16:08:48 | 16:09:38 |
| refute | 5 | 6,101 | 1,634,823 | 33 | 16:09:40 | 16:10:13 |
| capture | 1 | 142 | 80,122 | 6 | 16:10:15 | 16:10:20 |
| synthesize | 1 | 10,403 | 213,625 | 79 | 16:10:23 | 16:11:42 |

- **claude-sonnet-5-5**: 13 agent · 41 calls · out 33,934 · in 82 · cache_read 2,697,495 · cache_create 1,019,543
- **claude-opus-5-5**: 3 agent · 66 calls · out 6,064 · in 132 · cache_read 9,724,232 · cache_create 504,325
- **claude-haiku-4-5-20251001**: 12 agent · 24 calls · out 14,107 · in 216 · cache_read 1,054,569 · cache_create 462,473

### S4 round 2 — wf_70fe3654-f65 (26 agent, 54,470 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 14,059 | 10 | 465,398 | 107 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 2 | 4,861 | 4 | 81,147 | 40 |
| triage | claude-sonnet-5-5 | 2 | 4,409 | 4 | 86,161 | 34 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 2 | 3,518 | 4 | 116,072 | 30 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 2 | 2,993 | 4 | 116,070 | 27 |
| review:conventions | claude-opus-5-5 | 30 | 2,944 | 60 | 4,797,753 | 297 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-4-5-20251001 | 2 | 2,942 | 18 | 90,363 | 70 |
| review:measurement | claude-opus-5-5 | 13 | 2,829 | 26 | 1,587,710 | 178 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 8 | 2,474 | 66 | 496,441 | 302 |
| review:bugs | claude-opus-5-5 | 19 | 1,763 | 38 | 2,459,347 | 190 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,371 | 18 | 90,355 | 27 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,304 | 18 | 90,355 | 24 |
| machine:node tests/scripts/xem-trang-lo-trinh.te | claude-haiku-4-5-20251001 | 2 | 1,213 | 18 | 90,372 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,192 | 18 | 90,368 | 240 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 1,016 | 18 | 61,334 | 119 |
| refute:evals.yaml | claude-sonnet-5-5 | 3 | 980 | 6 | 167,734 | 21 |
| refute:evals.yaml | claude-sonnet-5-5 | 4 | 887 | 8 | 290,714 | 24 |
| refute:lo-trinh.mjs | claude-sonnet-5-5 | 6 | 847 | 12 | 476,773 | 28 |
| refute:evals.yaml | claude-sonnet-5-5 | 4 | 750 | 8 | 288,207 | 17 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 439 | 18 | 90,404 | 76 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 397 | 18 | 90,368 | 124 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 335 | 18 | 90,404 | 234 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 304 | 8 | 252,658 | 32 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 254 | 18 | 90,404 | 62 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 240 | 18 | 90,362 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 149 | 4 | 80,199 | 6 |


wall: 1420s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 304 | 252,658 | 32 | 16:29:09 | 16:29:41 |
| machine | 12 | 13,177 | 1,461,530 | 1234 | 16:29:09 | 16:49:43 |
| judge | 3 | 11,372 | 313,289 | 40 | 16:29:09 | 16:29:49 |
| review | 3 | 7,536 | 8,844,810 | 297 | 16:29:09 | 16:34:06 |
| triage | 1 | 4,409 | 86,161 | 34 | 16:49:45 | 16:50:19 |
| refute | 4 | 3,464 | 1,223,428 | 31 | 16:50:21 | 16:50:52 |
| capture | 1 | 149 | 80,199 | 6 | 16:50:54 | 16:51:00 |
| synthesize | 1 | 14,059 | 465,398 | 107 | 16:51:02 | 16:52:49 |

- **claude-sonnet-5-5**: 11 agent · 36 calls · out 33,757 · in 72 · cache_read 2,421,133 · cache_create 915,501
- **claude-opus-5-5**: 3 agent · 62 calls · out 7,536 · in 124 · cache_read 8,844,810 · cache_create 485,237
- **claude-haiku-4-5-20251001**: 12 agent · 30 calls · out 13,177 · in 264 · cache_read 1,461,530 · cache_create 480,890

### S4 round 3 — wf_9fc988ec-96c (23 agent, 45,274 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 9,977 | 12 | 567,719 | 83 |
| triage | claude-sonnet-5-5 | 2 | 4,008 | 4 | 85,542 | 31 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 2 | 3,500 | 4 | 81,162 | 30 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 2 | 3,418 | 4 | 116,085 | 31 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-4-5-20251001 | 2 | 2,992 | 18 | 90,373 | 74 |
| review:measurement | claude-opus-5-5 | 12 | 2,947 | 24 | 1,590,871 | 176 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 2 | 2,612 | 4 | 116,087 | 25 |
| review:conventions | claude-opus-5-5 | 38 | 2,579 | 76 | 6,295,293 | 373 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,252 | 18 | 90,378 | 146 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,697 | 18 | 90,378 | 116 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,588 | 18 | 90,365 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,530 | 18 | 90,378 | 249 |
| review:bugs | claude-opus-5-5 | 21 | 1,440 | 42 | 2,891,432 | 230 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,195 | 18 | 90,365 | 22 |
| refute:lo-trinh.mjs | claude-sonnet-5-5 | 5 | 918 | 10 | 344,367 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 916 | 18 | 61,344 | 119 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 368 | 18 | 90,414 | 75 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 340 | 18 | 90,372 | 10 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 338 | 8 | 252,678 | 33 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 244 | 18 | 90,414 | 233 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 233 | 18 | 90,414 | 61 |
| capture:provenance | claude-sonnet-5-5 | 2 | 180 | 4 | 80,214 | 6 |
| machine:node tests/scripts/xem-trang-lo-trinh.te | claude-haiku-4-5-20251001 | 2 | 2 | 18 | 90,382 | 31 |


wall: 1230s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 338 | 252,678 | 33 | 16:56:09 | 16:56:41 |
| machine | 12 | 13,357 | 1,055,577 | 1077 | 16:56:09 | 17:14:06 |
| judge | 3 | 9,530 | 313,334 | 34 | 16:56:09 | 16:56:43 |
| review | 3 | 6,966 | 10,777,596 | 373 | 16:56:09 | 17:02:22 |
| triage | 1 | 4,008 | 85,542 | 31 | 17:14:09 | 17:14:40 |
| refute | 1 | 918 | 344,367 | 23 | 17:14:42 | 17:15:05 |
| capture | 1 | 180 | 80,214 | 6 | 17:15:07 | 17:15:13 |
| synthesize | 1 | 9,977 | 567,719 | 83 | 17:15:15 | 17:16:39 |

- **claude-sonnet-5-5**: 8 agent · 25 calls · out 24,951 · in 50 · cache_read 1,643,854 · cache_create 715,888
- **claude-haiku-4-5-20251001**: 12 agent · 24 calls · out 13,357 · in 216 · cache_read 1,055,577 · cache_create 463,484
- **claude-opus-5-5**: 3 agent · 71 calls · out 6,966 · in 142 · cache_read 10,777,596 · cache_create 542,313

