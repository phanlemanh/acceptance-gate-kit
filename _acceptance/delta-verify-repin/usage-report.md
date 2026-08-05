### S4 round 1 — wf_8d708e94-2d1 (27 agent, 118,478 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-fable-5 | 10 | 19,635 | 19 | 695,952 | 294 |
| judge:E13:domain-correctness | claude-sonnet-5 | 7 | 15,351 | 14 | 448,557 | 186 |
| review:bugs | claude-fable-5 | 12 | 11,484 | 23 | 822,696 | 235 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 13 | 10,710 | 1,587 | 731,524 | 159 |
| judge:E12:domain-correctness | claude-sonnet-5 | 3 | 9,255 | 6 | 119,995 | 110 |
| triage | claude-sonnet-5 | 2 | 8,206 | 4 | 48,724 | 93 |
| refute:carry-plan.mjs | claude-sonnet-5 | 11 | 7,034 | 22 | 584,621 | 104 |
| refute:carry-plan.mjs | claude-sonnet-5 | 12 | 6,669 | 24 | 663,358 | 134 |
| refute:recheck-evidence.js | claude-sonnet-5 | 9 | 5,878 | 18 | 422,707 | 84 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 13 | 5,649 | 1,455 | 726,763 | 116 |
| judge:E12:operational-feasibility | claude-sonnet-5 | 3 | 5,309 | 6 | 120,954 | 67 |
| refute:recheck-evidence.js | claude-sonnet-5 | 8 | 2,317 | 16 | 378,172 | 61 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 10 | 2,021 | 82 | 319,183 | 159 |
| judge:E12:spec-alignment | claude-sonnet-5 | 3 | 1,535 | 6 | 120,947 | 111 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,176 | 58 | 186,099 | 105 |
| judge:E16:operational-feasibility | claude-sonnet-5 | 2 | 1,148 | 4 | 67,627 | 18 |
| judge:E16:domain-correctness | claude-sonnet-5 | 2 | 997 | 4 | 67,625 | 16 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 925 | 18 | 45,525 | 14 |
| baseline:diffBase | claude-sonnet-5 | 8 | 859 | 16 | 350,161 | 82 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 732 | 18 | 28,055 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 639 | 18 | 28,062 | 10 |
| capture:provenance | claude-sonnet-5 | 2 | 334 | 4 | 43,969 | 11 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 269 | 18 | 28,059 | 9 |
| judge:E16:spec-alignment | claude-sonnet-5 | 2 | 200 | 4 | 67,625 | 17 |
| synthesize:report | claude-sonnet-5 | 2 | 131 | 4 | 59,724 | 255 |
| judge:E13:spec-alignment | claude-sonnet-5 | 2 | 8 | 4 | 67,609 | 89 |
| judge:E13:operational-feasibility | claude-sonnet-5 | 2 | 7 | 4 | 67,611 | 112 |

- **claude-fable-5**: 2 agent · 22 calls · out 31,119 · in 42 · cache_read 1,518,648 · cache_create 180,066
- **claude-sonnet-5**: 19 agent · 106 calls · out 81,597 · in 3,202 · cache_read 5,158,273 · cache_create 1,031,687
- **claude-haiku-4-5-20251001**: 6 agent · 25 calls · out 5,762 · in 212 · cache_read 634,983 · cache_create 167,872

### S4 round 2 — wf_d612a5b4-670 (19 agent, 117,170 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 21,633 | 4 | 56,531 | 218 |
| review:bugs | claude-fable-5 | 17 | 17,185 | 33 | 1,300,728 | 309 |
| review:conventions | claude-fable-5 | 15 | 14,094 | 28 | 1,004,110 | 235 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 12 | 13,760 | 61 | 684,848 | 206 |
| refute:evidence-core.js | claude-sonnet-5 | 18 | 9,613 | 36 | 1,166,925 | 200 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 16 | 8,465 | 32 | 967,912 | 130 |
| judge:E12:operational-feasibility | claude-sonnet-5 | 3 | 7,502 | 6 | 121,146 | 99 |
| refute:sync-plugin-packages.sh | claude-sonnet-5 | 15 | 7,341 | 67 | 842,016 | 130 |
| judge:E12:spec-alignment | claude-sonnet-5 | 4 | 6,570 | 8 | 194,407 | 82 |
| refute:carry-plan.mjs | claude-sonnet-5 | 10 | 4,091 | 20 | 536,265 | 90 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 11 | 2,166 | 90 | 340,074 | 316 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,605 | 58 | 216,634 | 112 |
| capture:provenance | claude-sonnet-5 | 2 | 692 | 4 | 43,969 | 10 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 636 | 18 | 28,055 | 10 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 629 | 18 | 28,062 | 10 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 570 | 18 | 45,529 | 9 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 434 | 18 | 28,055 | 12 |
| judge:E12:domain-correctness | claude-sonnet-5 | 3 | 177 | 6 | 120,184 | 165 |
| triage | claude-sonnet-5 | 2 | 7 | 4 | 47,837 | 86 |

- **claude-sonnet-5**: 11 agent · 87 calls · out 79,851 · in 248 · cache_read 4,782,040 · cache_create 710,399
- **claude-fable-5**: 2 agent · 32 calls · out 31,279 · in 61 · cache_read 2,304,838 · cache_create 203,758
- **claude-haiku-4-5-20251001**: 6 agent · 26 calls · out 6,040 · in 220 · cache_read 686,409 · cache_create 180,913

### S4 round 3 — wf_326902eb-06e (21 agent, 175,940 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 5 | 34,050 | 10 | 293,157 | 362 |
| review:bugs | claude-fable-5 | 32 | 28,415 | 61 | 2,843,061 | 515 |
| review:conventions | claude-fable-5 | 17 | 19,791 | 32 | 1,457,605 | 367 |
| judge:E12:spec-alignment | claude-sonnet-5 | 3 | 11,899 | 6 | 121,105 | 141 |
| refute:evidence-core.js | claude-sonnet-5 | 25 | 10,106 | 50 | 1,457,935 | 173 |
| triage | claude-sonnet-5 | 2 | 9,548 | 4 | 49,048 | 114 |
| refute:sync-plugin-packages.sh | claude-sonnet-5 | 12 | 9,230 | 24 | 701,395 | 115 |
| refute:carry-plan.mjs | claude-sonnet-5 | 12 | 7,937 | 24 | 667,915 | 118 |
| refute:run-tests.sh | claude-sonnet-5 | 13 | 7,464 | 26 | 689,982 | 244 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 16 | 7,376 | 32 | 849,637 | 127 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 11 | 6,896 | 1,413 | 611,469 | 98 |
| judge:E12:domain-correctness | claude-sonnet-5 | 3 | 6,250 | 6 | 120,125 | 84 |
| judge:E12:operational-feasibility | claude-sonnet-5 | 3 | 5,721 | 6 | 121,118 | 76 |
| refute:gate-card.js | claude-sonnet-5 | 8 | 4,080 | 16 | 396,067 | 72 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 12 | 2,503 | 98 | 398,598 | 314 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 9 | 1,819 | 74 | 261,972 | 117 |
| capture:provenance | claude-sonnet-5 | 2 | 947 | 4 | 43,969 | 12 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 660 | 18 | 45,532 | 10 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 655 | 18 | 28,055 | 11 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 343 | 18 | 45,525 | 16 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 250 | 18 | 28,059 | 8 |

- **claude-sonnet-5**: 13 agent · 115 calls · out 121,504 · in 1,621 · cache_read 6,122,922 · cache_create 858,229
- **claude-fable-5**: 2 agent · 49 calls · out 48,206 · in 93 · cache_read 4,300,666 · cache_create 257,358
- **claude-haiku-4-5-20251001**: 6 agent · 29 calls · out 6,230 · in 244 · cache_read 807,741 · cache_create 156,547

