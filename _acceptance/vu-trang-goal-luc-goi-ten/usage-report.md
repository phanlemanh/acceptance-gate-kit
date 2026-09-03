### S4 round 1 (BLOCKED — suite scripts bị công cụ cắt) — wf_cafcaf03-0d8 (25 agent, 672,354 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| triage | claude-sonnet-5 | 4 | 108,821 | 8 | 74,864 | 1960 |
| synthesize:report | claude-sonnet-5 | 29 | 93,583 | 58 | 5,133,845 | 1025 |
| review:conventions | claude-fable-5-1 | 10 | 53,596 | 3,185 | 1,461,120 | 937 |
| refute:run-tests.sh | claude-sonnet-5 | 13 | 38,245 | 26 | 1,254,103 | 490 |
| review:bugs | claude-fable-5-1 | 31 | 36,177 | 4,179 | 4,793,570 | 1089 |
| review:measurement | claude-fable-5-1 | 11 | 34,824 | 3,166 | 1,041,895 | 615 |
| refute:run-log-minted.mjs | claude-sonnet-5 | 20 | 30,748 | 40 | 1,896,956 | 377 |
| refute:run-log-minted.test.mjs | claude-sonnet-5 | 8 | 30,580 | 16 | 626,700 | 374 |
| refute:routing-baseline.txt | claude-sonnet-5 | 29 | 28,612 | 58 | 2,639,990 | 697 |
| refute:gate-card-goal.test.mjs | claude-sonnet-5 | 10 | 27,817 | 20 | 925,126 | 422 |
| refute:routing-baseline.txt | claude-sonnet-5 | 20 | 25,542 | 40 | 1,771,724 | 656 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 24,913 | 20 | 840,299 | 318 |
| refute:gate-card-goal.test.mjs | claude-sonnet-5 | 13 | 24,745 | 26 | 1,167,702 | 310 |
| refute:run-log-minted.mjs | claude-sonnet-5 | 9 | 22,501 | 18 | 750,976 | 291 |
| refute:run-tests.sh | claude-sonnet-5 | 9 | 21,511 | 18 | 776,110 | 301 |
| refute:gate-card-goal.test.mjs | claude-sonnet-5 | 7 | 19,488 | 14 | 523,496 | 258 |
| refute:run-log-minted.mjs | claude-sonnet-5 | 10 | 19,120 | 20 | 759,653 | 250 |
| refute:run-tests.sh | claude-sonnet-5 | 7 | 14,461 | 14 | 483,389 | 178 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 7,089 | 18 | 47,608 | 246 |
| baseline:diffBase | claude-sonnet-5 | 14 | 4,511 | 28 | 1,028,784 | 603 |
| capture:provenance | claude-sonnet-5 | 2 | 2,040 | 4 | 65,724 | 26 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,218 | 34 | 171,762 | 338 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 881 | 18 | 73,888 | 16 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 702 | 42 | 228,484 | 24 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 629 | 18 | 73,895 | 10 |

- **claude-sonnet-5**: 17 agent · 214 calls · out 537,238 · in 428 · cache_read 20,719,441 · cache_create 1,784,744
- **claude-fable-5-1**: 3 agent · 52 calls · out 124,597 · in 10,530 · cache_read 7,296,585 · cache_create 501,678
- **claude-haiku-4-5-20251001**: 5 agent · 15 calls · out 10,519 · in 130 · cache_read 595,637 · cache_create 194,875

### S4 round 2 (PENDING-JUDGMENT; resume sau hạn mức phiên) — wf_cf0d0ef3-046 (34 agent, 635,506 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| triage | claude-sonnet-5 | 3 | 101,618 | 6 | 73,112 | 1117 |
| synthesize:report | claude-sonnet-5 | 23 | 71,504 | 46 | 3,577,696 | 777 |
| refute:evidence-report.md | claude-sonnet-5 | 24 | 52,122 | 48 | 2,709,780 | 979 |
| refute:run-log-minted.mjs | claude-sonnet-5 | 24 | 50,859 | 48 | 2,565,020 | 616 |
| review:measurement | claude-fable-5-1 | 13 | 48,709 | 3,278 | 1,344,578 | 674 |
| review:conventions | claude-fable-5-1 | 11 | 46,029 | 3,112 | 1,521,629 | 704 |
| review:bugs | claude-fable-5-1 | 12 | 40,779 | 3,406 | 1,215,445 | 1033 |
| refute:acceptance-card.md | claude-sonnet-5 | 17 | 36,835 | 34 | 1,995,160 | 438 |
| refute:run-log-minted.test.mjs | claude-sonnet-5 | 8 | 31,833 | 16 | 647,164 | 369 |
| refute:evals.yaml | claude-sonnet-5 | 12 | 29,022 | 24 | 986,372 | 328 |
| refute:run-log-minted.test.mjs | claude-sonnet-5 | 11 | 24,807 | 22 | 910,254 | 289 |
| refute:run-log-minted.mjs | claude-sonnet-5 | 9 | 24,181 | 18 | 750,007 | 293 |
| refute:run-tests.sh | claude-sonnet-5 | 16 | 20,626 | 32 | 1,469,086 | 313 |
| refute:run-log-minted.mjs | claude-sonnet-5 | 11 | 14,382 | 22 | 820,672 | 173 |
| review:measurement | claude-fable-5-1 | 4 | 12,023 | 2,774 | 266,337 | 160 |
| review:bugs | claude-fable-5-1 | 5 | 10,841 | 2,830 | 262,877 | 155 |
| capture:provenance | claude-sonnet-5 | 2 | 6,653 | 4 | 65,860 | 70 |
| review:conventions | claude-fable-5-1 | 4 | 4,855 | 2,774 | 236,319 | 64 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,509 | 42 | 228,727 | 24 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,444 | 34 | 193,391 | 306 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,011 | 34 | 176,474 | 21 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,004 | 34 | 176,015 | 326 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 657 | 18 | 73,902 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 609 | 18 | 73,895 | 10 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 556 | 18 | 47,629 | 10 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 392 | 18 | 73,888 | 13 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 1 | 352 | 10 | 26,280 | 257 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 1 | 294 | 10 | 0 | 148 |
| capture:provenance | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| machine:bash tests/scripts/run-tests.sh | <synthetic> | 1 | 0 | 0 | 0 | 148 |
| review:conventions | <synthetic> | 1 | 0 | 0 | 0 | 64 |
| machine:bash tests/plugins/run-tests.sh | <synthetic> | 1 | 0 | 0 | 0 | 257 |
| review:bugs | <synthetic> | 1 | 0 | 0 | 0 | 155 |
| review:measurement | <synthetic> | 1 | 0 | 0 | 0 | 160 |

- **claude-sonnet-5**: 12 agent · 160 calls · out 464,442 · in 320 · cache_read 16,570,183 · cache_create 1,392,076
- **claude-fable-5-1**: 6 agent · 49 calls · out 163,236 · in 18,174 · cache_read 4,847,185 · cache_create 955,926
- **claude-haiku-4-5-20251001**: 10 agent · 27 calls · out 7,828 · in 236 · cache_read 1,070,201 · cache_create 328,964
- **<synthetic>**: 6 agent · 6 calls · out 0 · in 0 · cache_read 0 · cache_create 0

