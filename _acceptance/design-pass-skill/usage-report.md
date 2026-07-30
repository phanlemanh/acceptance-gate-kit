### S4 round 1 — wf_9cdb6439-eba (18 agent, 68,631 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 9 | 15,519 | 18 | 554,786 | 171 |
| review:bugs | claude-fable-5 | 15 | 14,753 | 30 | 1,051,754 | 247 |
| review:conventions | claude-fable-5 | 16 | 13,469 | 32 | 1,105,767 | 226 |
| refute:run-tests.sh | claude-sonnet-5 | 6 | 4,561 | 12 | 262,871 | 63 |
| judge:E15:domain-correctness | claude-sonnet-5 | 2 | 3,256 | 4 | 43,757 | 48 |
| judge:E15:spec-alignment | claude-sonnet-5 | 2 | 3,002 | 4 | 43,757 | 43 |
| refute:run-tests.sh | claude-sonnet-5 | 4 | 2,698 | 8 | 139,803 | 38 |
| baseline:diffBase | claude-sonnet-5 | 11 | 2,576 | 22 | 490,702 | 109 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,634 | 50 | 165,390 | 100 |
| refute:SKILL.md | claude-sonnet-5 | 6 | 1,485 | 12 | 262,169 | 29 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,218 | 18 | 28,280 | 29 |
| refute:SKILL.md | claude-sonnet-5 | 5 | 1,183 | 10 | 192,239 | 23 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 984 | 18 | 45,840 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 889 | 18 | 28,280 | 14 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 535 | 18 | 28,284 | 9 |
| capture:provenance | claude-sonnet-5 | 2 | 435 | 4 | 43,370 | 7 |
| judge:E15:operational-feasibility | claude-sonnet-5 | 2 | 427 | 4 | 43,759 | 42 |
| triage | claude-sonnet-5 | 2 | 7 | 4 | 45,984 | 36 |

- **claude-sonnet-5**: 11 agent · 51 calls · out 35,149 · in 102 · cache_read 2,123,197 · cache_create 582,148
- **claude-fable-5**: 2 agent · 31 calls · out 28,222 · in 62 · cache_read 2,157,521 · cache_create 178,332
- **claude-haiku-4-5-20251001**: 5 agent · 14 calls · out 5,260 · in 122 · cache_read 296,074 · cache_create 150,516

### S4 round 2 — wf_27b510e8-301 (16 agent, 64,941 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-fable-5 | 23 | 15,225 | 46 | 1,845,185 | 345 |
| review:bugs | claude-fable-5 | 8 | 13,382 | 16 | 437,612 | 200 |
| refute:evidence-report.md | claude-sonnet-5 | 13 | 5,965 | 26 | 789,182 | 128 |
| refute:run-tests.sh | claude-sonnet-5 | 6 | 4,718 | 12 | 264,703 | 55 |
| refute:SKILL.md | claude-sonnet-5 | 6 | 4,595 | 12 | 292,485 | 50 |
| synthesize:report | claude-sonnet-5 | 3 | 4,449 | 6 | 115,871 | 191 |
| judge:E15:operational-feasibility | claude-sonnet-5 | 2 | 3,561 | 4 | 67,109 | 47 |
| judge:E15:domain-correctness | claude-sonnet-5 | 2 | 3,067 | 4 | 43,757 | 46 |
| triage | claude-sonnet-5 | 2 | 2,779 | 4 | 45,751 | 37 |
| judge:E15:spec-alignment | claude-sonnet-5 | 2 | 2,236 | 4 | 43,757 | 28 |
| capture:provenance | claude-sonnet-5 | 2 | 1,317 | 4 | 43,370 | 15 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,005 | 26 | 58,909 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 775 | 18 | 28,280 | 12 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 732 | 42 | 121,947 | 86 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 611 | 18 | 28,284 | 9 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 524 | 18 | 45,840 | 22 |

- **claude-fable-5**: 2 agent · 31 calls · out 28,607 · in 62 · cache_read 2,282,797 · cache_create 198,815
- **claude-sonnet-5**: 9 agent · 38 calls · out 32,687 · in 76 · cache_read 1,705,985 · cache_create 489,073
- **claude-haiku-4-5-20251001**: 5 agent · 14 calls · out 3,647 · in 122 · cache_read 283,260 · cache_create 147,082

### S4 round 3 — wf_fa5f8cdd-d46 (15 agent, 59,856 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 8 | 12,760 | 16 | 463,142 | 149 |
| review:conventions | claude-fable-5 | 13 | 10,375 | 26 | 854,576 | 230 |
| review:bugs | claude-fable-5 | 12 | 10,021 | 24 | 750,010 | 261 |
| refute:SKILL.md | claude-sonnet-5 | 17 | 6,754 | 34 | 949,261 | 116 |
| judge:E15:operational-feasibility | claude-sonnet-5 | 3 | 3,981 | 6 | 96,760 | 51 |
| judge:E15:spec-alignment | claude-sonnet-5 | 2 | 3,744 | 4 | 43,757 | 44 |
| triage | claude-sonnet-5 | 2 | 2,481 | 4 | 45,491 | 33 |
| refute:plugin.json | claude-sonnet-5 | 5 | 2,443 | 10 | 196,998 | 37 |
| judge:E15:domain-correctness | claude-sonnet-5 | 2 | 2,412 | 4 | 43,757 | 34 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,276 | 42 | 174,912 | 129 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 996 | 18 | 28,280 | 15 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 858 | 18 | 28,280 | 12 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 712 | 18 | 28,280 | 24 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 3 | 569 | 26 | 58,690 | 9 |
| capture:provenance | claude-sonnet-5 | 2 | 474 | 4 | 43,370 | 11 |

- **claude-sonnet-5**: 8 agent · 41 calls · out 35,049 · in 82 · cache_read 1,882,536 · cache_create 500,035
- **claude-fable-5**: 2 agent · 25 calls · out 20,396 · in 50 · cache_read 1,604,586 · cache_create 183,983
- **claude-haiku-4-5-20251001**: 5 agent · 14 calls · out 4,411 · in 122 · cache_read 318,442 · cache_create 164,278

