### S4 round 1 — wf_f3522b2f-159 (20 agent, 97,629 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:acceptance-verify.js | claude-sonnet-5 | 29 | 15,594 | 58 | 1,964,601 | 397 |
| review:conventions | claude-opus-5 | 16 | 13,954 | 32 | 1,084,804 | 317 |
| review:bugs | claude-opus-5 | 30 | 13,905 | 60 | 2,380,922 | 390 |
| triage | claude-sonnet-5 | 2 | 9,848 | 4 | 48,824 | 114 |
| judge:E10:operational-feasibility | claude-sonnet-5 | 10 | 9,202 | 20 | 556,745 | 241 |
| refute:acceptance-verify.js | claude-sonnet-5 | 18 | 8,568 | 36 | 1,072,323 | 305 |
| refute:acceptance-verify.js | claude-sonnet-5 | 7 | 5,217 | 14 | 381,323 | 285 |
| refute:gate-card.js | claude-sonnet-5 | 9 | 5,072 | 18 | 432,579 | 105 |
| refute:gate-card.js | claude-sonnet-5 | 7 | 3,161 | 14 | 328,014 | 172 |
| judge:E10:domain-correctness | claude-sonnet-5 | 6 | 2,820 | 12 | 310,465 | 57 |
| baseline:diffBase | claude-sonnet-5 | 10 | 2,544 | 20 | 442,870 | 151 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,623 | 34 | 123,235 | 132 |
| capture:provenance | claude-sonnet-5 | 2 | 1,623 | 4 | 43,224 | 45 |
| judge:E10:spec-alignment | claude-sonnet-5 | 5 | 1,449 | 10 | 212,810 | 48 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 820 | 18 | 44,706 | 128 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 669 | 18 | 44,706 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 667 | 18 | 44,713 | 11 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 478 | 18 | 27,303 | 15 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 278 | 18 | 44,710 | 12 |
| synthesize:report | claude-sonnet-5 | 2 | 137 | 4 | 56,312 | 169 |

- **claude-sonnet-5**: 12 agent · 107 calls · out 65,235 · in 214 · cache_read 5,850,090 · cache_create 668,771
- **claude-opus-5**: 2 agent · 46 calls · out 27,859 · in 92 · cache_read 3,465,726 · cache_create 190,221
- **claude-haiku-4-5-20251001**: 6 agent · 14 calls · out 4,535 · in 124 · cache_read 329,373 · cache_create 125,654

