### S4 round 1 — wf_b8a11674-b4c (17 agent, 105,718 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 17,307 | 4 | 61,001 | 180 |
| review:bugs | claude-fable-5 | 15 | 13,999 | 29 | 1,164,184 | 261 |
| review:conventions | claude-fable-5 | 11 | 13,436 | 21 | 793,611 | 259 |
| refute:rang.sh | claude-sonnet-5 | 19 | 12,862 | 38 | 1,232,383 | 212 |
| refute:rang.sh | claude-sonnet-5 | 20 | 9,660 | 40 | 1,258,633 | 196 |
| review:measurement | claude-fable-5 | 10 | 9,605 | 1,309 | 632,059 | 176 |
| refute:rang.sh | claude-sonnet-5 | 15 | 9,587 | 30 | 923,727 | 161 |
| refute:rang.sh | claude-sonnet-5 | 15 | 8,213 | 30 | 902,837 | 156 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 3,009 | 50 | 242,535 | 500 |
| baseline:diffBase | claude-sonnet-5 | 8 | 2,245 | 16 | 403,676 | 50 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,587 | 50 | 227,550 | 25 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,585 | 42 | 182,899 | 180 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 1,000 | 18 | 58,133 | 15 |
| capture:provenance | claude-sonnet-5 | 2 | 570 | 4 | 52,462 | 13 |
| machine:bash _acceptance/het-gio-khong-phai-truo | claude-haiku-4-5-20251001 | 2 | 535 | 18 | 38,096 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 390 | 18 | 58,126 | 17 |
| triage | claude-sonnet-5 | 2 | 128 | 4 | 55,549 | 32 |

- **claude-sonnet-5**: 8 agent · 83 calls · out 60,572 · in 166 · cache_read 4,890,268 · cache_create 466,668
- **claude-fable-5**: 3 agent · 36 calls · out 37,040 · in 1,359 · cache_read 2,589,854 · cache_create 237,863
- **claude-haiku-4-5-20251001**: 6 agent · 23 calls · out 8,106 · in 196 · cache_read 807,339 · cache_create 156,973

### S4 round 2 — wf_59c8f63f-1ae (23 agent, 138,406 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 6 | 23,072 | 12 | 400,229 | 265 |
| review:conventions | claude-opus-5 | 21 | 17,940 | 3,398 | 2,079,125 | 361 |
| triage | claude-sonnet-5 | 2 | 17,478 | 4 | 60,102 | 199 |
| review:measurement | claude-opus-5 | 9 | 13,173 | 5,969 | 553,424 | 293 |
| review:bugs | claude-opus-5 | 19 | 9,815 | 37 | 1,378,673 | 219 |
| refute:rang.sh | claude-sonnet-5 | 9 | 7,302 | 3,503 | 529,730 | 125 |
| refute:rang.sh | claude-sonnet-5 | 10 | 6,178 | 20 | 587,292 | 100 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 16 | 5,897 | 2,821 | 1,083,544 | 121 |
| refute:rang.sh | claude-sonnet-5 | 6 | 5,586 | 12 | 320,926 | 83 |
| refute:rang.sh | claude-sonnet-5 | 5 | 4,738 | 1,914 | 224,058 | 70 |
| refute:rang.sh | claude-sonnet-5 | 5 | 4,432 | 10 | 257,007 | 67 |
| refute:rang.sh | claude-sonnet-5 | 8 | 4,223 | 16 | 441,506 | 78 |
| refute:rang.sh | claude-sonnet-5 | 9 | 3,963 | 18 | 510,194 | 82 |
| refute:2026-08-18-het-gio-khong-phai-truot.md | claude-sonnet-5 | 4 | 2,386 | 8 | 192,098 | 38 |
| baseline:diffBase | claude-sonnet-5 | 8 | 2,315 | 16 | 401,147 | 52 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 2,087 | 26 | 99,357 | 141 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,851 | 58 | 272,979 | 35 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 3 | 1,746 | 6 | 138,506 | 27 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,583 | 58 | 281,722 | 189 |
| machine:bash _acceptance/het-gio-khong-phai-truo | claude-haiku-4-5-20251001 | 2 | 995 | 18 | 58,210 | 17 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 708 | 18 | 58,199 | 12 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 472 | 26 | 78,414 | 17 |
| capture:provenance | claude-sonnet-5 | 2 | 466 | 4 | 52,462 | 11 |

- **claude-sonnet-5**: 14 agent · 93 calls · out 89,782 · in 8,364 · cache_read 5,198,801 · cache_create 697,788
- **claude-opus-5**: 3 agent · 49 calls · out 40,928 · in 9,404 · cache_read 4,011,222 · cache_create 266,120
- **claude-haiku-4-5-20251001**: 6 agent · 24 calls · out 7,696 · in 204 · cache_read 848,881 · cache_create 174,270

### S4 round 3 — wf_eb8d0fa5-085 (21 agent, 159,650 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5 | 28 | 25,705 | 9,304 | 2,716,866 | 636 |
| review:measurement | claude-opus-5 | 14 | 17,060 | 27 | 1,068,659 | 317 |
| synthesize:report | claude-sonnet-5 | 6 | 16,842 | 12 | 388,554 | 197 |
| refute:rang.sh | claude-sonnet-5 | 20 | 14,428 | 40 | 1,368,335 | 247 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 11 | 14,344 | 1,970 | 828,161 | 207 |
| review:bugs | claude-opus-5 | 18 | 13,331 | 35 | 1,344,375 | 257 |
| refute:rang.sh | claude-sonnet-5 | 11 | 9,169 | 569 | 699,328 | 144 |
| refute:rang.sh | claude-sonnet-5 | 8 | 7,974 | 16 | 489,099 | 114 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 10 | 7,750 | 20 | 619,589 | 126 |
| triage | claude-sonnet-5 | 2 | 6,926 | 4 | 58,929 | 84 |
| refute:rang.sh | claude-sonnet-5 | 6 | 6,632 | 12 | 326,166 | 97 |
| refute:acceptance-verify.js | claude-sonnet-5 | 6 | 5,225 | 12 | 323,648 | 82 |
| baseline:diffBase | claude-sonnet-5 | 8 | 2,344 | 16 | 404,289 | 54 |
| refute:rang.sh | claude-sonnet-5 | 4 | 2,317 | 8 | 195,473 | 57 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 9 | 2,062 | 74 | 353,341 | 191 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,919 | 42 | 212,559 | 33 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,863 | 26 | 99,214 | 133 |
| machine:bash _acceptance/het-gio-khong-phai-truo | claude-haiku-4-5-20251001 | 2 | 1,495 | 18 | 38,162 | 25 |
| capture:provenance | claude-sonnet-5 | 3 | 1,104 | 6 | 114,992 | 21 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 714 | 28 | 100,066 | 17 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 446 | 18 | 58,199 | 12 |

- **claude-opus-5**: 3 agent · 60 calls · out 56,096 · in 9,366 · cache_read 5,129,900 · cache_create 425,764
- **claude-sonnet-5**: 12 agent · 95 calls · out 95,055 · in 2,685 · cache_read 5,816,563 · cache_create 727,261
- **claude-haiku-4-5-20251001**: 6 agent · 24 calls · out 8,499 · in 206 · cache_read 861,541 · cache_create 184,623

