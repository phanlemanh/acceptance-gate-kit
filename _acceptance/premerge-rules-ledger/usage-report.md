### S4 round 1 — wf_7fd33c0f-5a7 (21 agent, 131,314 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5 | 22 | 24,684 | 42 | 2,468,894 | 477 |
| review:bugs | claude-opus-5 | 27 | 23,879 | 52 | 2,798,664 | 481 |
| synthesize:report | claude-sonnet-5 | 6 | 13,480 | 12 | 488,830 | 188 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 31 | 11,497 | 62 | 3,191,003 | 362 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 17 | 10,666 | 34 | 1,506,363 | 224 |
| refute:0006-rules-ledger-fail-closed-at-output.md | claude-sonnet-5 | 12 | 8,052 | 24 | 987,807 | 172 |
| refute:plugin.json | claude-sonnet-5 | 13 | 6,765 | 26 | 1,090,060 | 117 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 10 | 6,718 | 20 | 824,492 | 130 |
| refute:GUIDE.md | claude-sonnet-5 | 14 | 6,130 | 28 | 1,163,389 | 156 |
| refute:plugin.json | claude-sonnet-5 | 6 | 4,432 | 12 | 416,784 | 72 |
| refute:GUIDE.md | claude-sonnet-5 | 8 | 3,819 | 16 | 605,946 | 80 |
| baseline:diffBase | claude-sonnet-5 | 8 | 3,065 | 16 | 583,884 | 95 |
| scribe:run-log | claude-haiku-4-5-20251001 | 3 | 2,036 | 26 | 117,142 | 26 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 8 | 1,858 | 66 | 438,527 | 114 |
| judge:E10:operational-feasibility | claude-sonnet-5 | 2 | 1,606 | 4 | 75,314 | 24 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 667 | 18 | 55,770 | 40 |
| judge:E10:spec-alignment | claude-sonnet-5 | 2 | 659 | 4 | 75,312 | 16 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 638 | 18 | 55,770 | 15 |
| capture:provenance | claude-sonnet-5 | 2 | 337 | 4 | 75,328 | 13 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 317 | 18 | 55,774 | 14 |
| judge:E10:domain-correctness | claude-sonnet-5 | 2 | 9 | 4 | 75,312 | 17 |

- **claude-opus-5**: 2 agent · 49 calls · out 48,563 · in 94 · cache_read 5,267,558 · cache_create 297,207
- **claude-sonnet-5**: 14 agent · 133 calls · out 77,235 · in 266 · cache_read 11,159,824 · cache_create 1,263,547
- **claude-haiku-4-5-20251001**: 5 agent · 17 calls · out 5,516 · in 146 · cache_read 722,983 · cache_create 305,837

### S4 round 2 — wf_5dca2007-a6b (17 agent, 106,391 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5 | 34 | 28,295 | 65 | 4,081,908 | 543 |
| review:conventions | claude-opus-5 | 20 | 22,913 | 37 | 2,352,621 | 407 |
| synthesize:report | claude-sonnet-5 | 6 | 13,170 | 12 | 503,295 | 136 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 15 | 10,767 | 30 | 1,369,887 | 153 |
| refute:GUIDE.md | claude-sonnet-5 | 12 | 7,203 | 24 | 926,130 | 122 |
| refute:GUIDE.md | claude-sonnet-5 | 16 | 6,116 | 32 | 1,400,023 | 133 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 21 | 5,589 | 3,230 | 2,041,083 | 158 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 8 | 4,457 | 16 | 636,241 | 69 |
| scribe:run-log | claude-haiku-4-5-20251001 | 4 | 2,864 | 34 | 179,035 | 32 |
| judge:E10:spec-alignment | claude-sonnet-5 | 2 | 1,245 | 4 | 75,312 | 19 |
| capture:provenance | claude-sonnet-5 | 2 | 1,009 | 4 | 75,328 | 15 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 926 | 34 | 192,741 | 56 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 597 | 18 | 55,774 | 12 |
| judge:E10:domain-correctness | claude-sonnet-5 | 2 | 509 | 4 | 75,312 | 14 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 375 | 18 | 55,770 | 14 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 348 | 18 | 55,770 | 35 |
| judge:E10:operational-feasibility | claude-sonnet-5 | 2 | 8 | 4 | 75,314 | 16 |

- **claude-opus-5**: 2 agent · 54 calls · out 51,208 · in 102 · cache_read 6,434,529 · cache_create 324,756
- **claude-sonnet-5**: 10 agent · 86 calls · out 50,073 · in 3,360 · cache_read 7,177,925 · cache_create 920,476
- **claude-haiku-4-5-20251001**: 5 agent · 14 calls · out 5,110 · in 122 · cache_read 539,090 · cache_create 284,420

### S4 round 3 — wf_2812cd0e-0f3 (17 agent, 62,088 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 12 | 11,490 | 23 | 1,205,758 | 340 |
| synthesize:report | claude-sonnet-5 | 7 | 10,625 | 14 | 594,951 | 137 |
| review:conventions | claude-fable-5 | 15 | 10,287 | 29 | 1,485,647 | 295 |
| review:conventions | claude-opus-5 | 9 | 6,170 | 17 | 705,350 | 127 |
| review:bugs | claude-opus-5 | 8 | 5,821 | 16 | 606,696 | 127 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 8 | 4,531 | 16 | 608,602 | 71 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 6 | 3,550 | 12 | 411,741 | 60 |
| refute:run-tests.sh | claude-sonnet-5 | 4 | 1,753 | 8 | 236,411 | 34 |
| scribe:run-log | claude-haiku-4-5-20251001 | 5 | 1,570 | 42 | 236,621 | 29 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,201 | 50 | 309,710 | 73 |
| judge:E10:operational-feasibility | claude-sonnet-5 | 2 | 1,047 | 4 | 75,314 | 19 |
| capture:provenance | claude-sonnet-5 | 2 | 972 | 4 | 75,324 | 19 |
| judge:E10:spec-alignment | claude-sonnet-5 | 2 | 908 | 4 | 75,312 | 18 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 816 | 18 | 55,770 | 41 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 592 | 18 | 55,770 | 14 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 541 | 18 | 55,774 | 11 |
| judge:E10:domain-correctness | claude-sonnet-5 | 2 | 214 | 4 | 75,312 | 18 |

- **claude-fable-5**: 2 agent · 27 calls · out 21,777 · in 52 · cache_read 2,691,405 · cache_create 266,532
- **claude-sonnet-5**: 8 agent · 33 calls · out 23,600 · in 66 · cache_read 2,152,967 · cache_create 670,300
- **claude-opus-5**: 2 agent · 17 calls · out 11,991 · in 33 · cache_read 1,312,046 · cache_create 195,002
- **claude-haiku-4-5-20251001**: 5 agent · 17 calls · out 4,720 · in 146 · cache_read 713,645 · cache_create 306,557

### S4 round 4 (delta fix leftover) — wf_636382dd-17d (13 agent, 51,160 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 16 | 17,907 | 31 | 1,836,502 | 373 |
| review:conventions | claude-fable-5 | 16 | 10,453 | 31 | 1,613,047 | 341 |
| synthesize:report | claude-sonnet-5 | 7 | 10,333 | 5,871 | 591,090 | 118 |
| refute:GUIDE.md | claude-sonnet-5 | 10 | 3,197 | 20 | 752,220 | 62 |
| scribe:run-log | claude-haiku-4-5-20251001 | 5 | 1,769 | 42 | 237,320 | 31 |
| judge:E10:spec-alignment | claude-sonnet-5 | 2 | 1,726 | 4 | 75,308 | 26 |
| judge:E10:operational-feasibility | claude-sonnet-5 | 2 | 1,304 | 4 | 75,310 | 22 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,118 | 26 | 114,949 | 64 |
| judge:E10:domain-correctness | claude-sonnet-5 | 2 | 1,008 | 4 | 75,308 | 17 |
| capture:provenance | claude-sonnet-5 | 2 | 785 | 4 | 75,324 | 13 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 611 | 18 | 55,765 | 42 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 542 | 18 | 55,769 | 12 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 407 | 18 | 73,127 | 17 |

- **claude-fable-5**: 2 agent · 32 calls · out 28,360 · in 62 · cache_read 3,449,549 · cache_create 277,381
- **claude-sonnet-5**: 6 agent · 25 calls · out 18,353 · in 5,907 · cache_read 1,644,560 · cache_create 523,521
- **claude-haiku-4-5-20251001**: 5 agent · 14 calls · out 4,447 · in 122 · cache_read 536,930 · cache_create 296,708

### S4 round 5 (re-pin, carry toàn bộ) — wf_50da5b40-acb (9 agent, 49,762 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 14 | 21,284 | 27 | 1,610,888 | 422 |
| review:conventions | claude-fable-5 | 16 | 12,055 | 31 | 1,648,641 | 298 |
| synthesize:report | claude-sonnet-5 | 12 | 9,751 | 24 | 1,154,235 | 190 |
| scribe:run-log | claude-haiku-4-5-20251001 | 5 | 3,140 | 42 | 241,237 | 42 |
| capture:provenance | claude-sonnet-5 | 2 | 1,350 | 4 | 75,324 | 18 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 822 | 42 | 240,113 | 105 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 530 | 18 | 55,769 | 11 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 424 | 18 | 73,127 | 16 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 406 | 18 | 55,765 | 37 |

- **claude-fable-5**: 2 agent · 30 calls · out 33,339 · in 58 · cache_read 3,259,529 · cache_create 293,500
- **claude-sonnet-5**: 2 agent · 14 calls · out 11,101 · in 28 · cache_read 1,229,559 · cache_create 197,829
- **claude-haiku-4-5-20251001**: 5 agent · 16 calls · out 5,322 · in 138 · cache_read 666,011 · cache_create 287,182

### S4 round 6 (delta chip 33ca1add) — wf_26dc2492-a7d (9 agent, 43,487 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 17 | 15,347 | 33 | 2,013,698 | 425 |
| synthesize:report | claude-sonnet-5 | 7 | 12,827 | 14 | 611,650 | 137 |
| review:conventions | claude-fable-5 | 11 | 10,607 | 21 | 1,079,555 | 266 |
| scribe:run-log | claude-haiku-4-5-20251001 | 5 | 1,934 | 42 | 238,616 | 31 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,105 | 58 | 363,091 | 118 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 777 | 18 | 56,063 | 40 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 579 | 18 | 56,063 | 14 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 304 | 18 | 56,067 | 12 |
| capture:provenance | claude-sonnet-5 | 2 | 7 | 4 | 75,845 | 15 |

- **claude-fable-5**: 2 agent · 28 calls · out 25,954 · in 54 · cache_read 3,093,253 · cache_create 296,722
- **claude-sonnet-5**: 2 agent · 9 calls · out 12,834 · in 18 · cache_read 687,495 · cache_create 197,522
- **claude-haiku-4-5-20251001**: 5 agent · 18 calls · out 4,699 · in 154 · cache_read 769,900 · cache_create 304,037

