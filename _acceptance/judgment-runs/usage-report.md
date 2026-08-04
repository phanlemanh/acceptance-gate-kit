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

### S4 round 2 — wf_ad244617-46e (24 agent, 106,070 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5 | 28 | 20,496 | 56 | 2,522,079 | 403 |
| review:bugs | claude-opus-5 | 30 | 15,134 | 60 | 2,683,031 | 345 |
| refute:eval-executors.md | claude-sonnet-5 | 20 | 10,638 | 40 | 1,224,164 | 333 |
| refute:mutation-check.mjs | claude-sonnet-5 | 17 | 8,308 | 518 | 1,125,901 | 250 |
| judge:E10:domain-correctness | claude-sonnet-5 | 9 | 8,124 | 951 | 479,517 | 147 |
| refute:evidence-report-template.md | claude-sonnet-5 | 20 | 7,882 | 40 | 1,307,795 | 347 |
| refute:acceptance-verify.js | claude-sonnet-5 | 21 | 6,648 | 42 | 1,318,180 | 213 |
| refute:gate-card.js | claude-sonnet-5 | 22 | 5,088 | 44 | 1,290,368 | 199 |
| refute:gate-card.js | claude-sonnet-5 | 25 | 3,999 | 50 | 1,391,423 | 200 |
| refute:gate-card.js | claude-sonnet-5 | 10 | 3,869 | 20 | 542,111 | 112 |
| judge:E10:operational-feasibility | claude-sonnet-5 | 11 | 3,467 | 955 | 648,760 | 117 |
| baseline:diffBase | claude-sonnet-5 | 9 | 2,825 | 18 | 419,815 | 109 |
| refute:acceptance-verify.js | claude-sonnet-5 | 13 | 2,083 | 26 | 681,943 | 107 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,515 | 26 | 57,688 | 59 |
| machine:node tests/workflows/mutation-check.mjs | claude-haiku-4-5-20251001 | 2 | 1,202 | 18 | 44,708 | 20 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 968 | 26 | 75,628 | 33 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 864 | 18 | 44,706 | 23 |
| judge:E10:spec-alignment | claude-sonnet-5 | 8 | 803 | 458 | 415,426 | 119 |
| synthesize:report | claude-sonnet-5 | 4 | 565 | 8 | 189,578 | 210 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 548 | 18 | 44,706 | 120 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 4 | 362 | 34 | 104,295 | 40 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 4 | 310 | 34 | 104,365 | 39 |
| capture:provenance | claude-sonnet-5 | 2 | 199 | 4 | 43,224 | 20 |
| triage | claude-sonnet-5 | 3 | 173 | 6 | 106,441 | 217 |

- **claude-opus-5**: 2 agent · 58 calls · out 35,630 · in 116 · cache_read 5,205,110 · cache_create 232,512
- **claude-sonnet-5**: 15 agent · 194 calls · out 64,671 · in 3,180 · cache_read 11,184,646 · cache_create 967,650
- **claude-haiku-4-5-20251001**: 7 agent · 20 calls · out 5,769 · in 174 · cache_read 476,096 · cache_create 139,330

