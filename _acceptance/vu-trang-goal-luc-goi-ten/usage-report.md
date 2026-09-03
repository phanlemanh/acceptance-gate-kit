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

