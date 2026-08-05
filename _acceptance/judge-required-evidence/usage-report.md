### S4 round 1 — wf_2b9104c4-476 (38 agent, 143,306 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 27,068 | 4 | 67,187 | 263 |
| review:bugs | claude-fable-5 | 16 | 17,635 | 30 | 1,265,427 | 424 |
| review:measurement | claude-fable-5 | 7 | 15,558 | 14 | 376,383 | 255 |
| refute:core-untouched.test.mjs | claude-sonnet-5 | 20 | 10,080 | 40 | 1,210,031 | 206 |
| review:conventions | claude-fable-5 | 8 | 8,612 | 15 | 429,594 | 241 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 19 | 6,912 | 38 | 1,096,402 | 220 |
| refute:run-tests.sh | claude-sonnet-5 | 7 | 6,102 | 14 | 337,208 | 173 |
| refute:acceptance-gold.mjs | claude-sonnet-5 | 14 | 5,389 | 28 | 903,978 | 340 |
| judge:J12:domain-correctness | claude-sonnet-5 | 2 | 5,015 | 4 | 67,948 | 111 |
| refute:run-tests.sh | claude-sonnet-5 | 8 | 3,819 | 16 | 410,490 | 197 |
| judge:J13:domain-correctness | claude-sonnet-5 | 3 | 3,671 | 6 | 98,093 | 70 |
| refute:acceptance-verify.js | claude-sonnet-5 | 10 | 3,450 | 20 | 509,640 | 143 |
| refute:acceptance-gold.mjs | claude-sonnet-5 | 9 | 3,370 | 18 | 459,778 | 85 |
| refute:run-tests.sh | claude-sonnet-5 | 14 | 3,256 | 28 | 824,887 | 140 |
| refute:run-tests.sh | claude-sonnet-5 | 2 | 3,000 | 4 | 67,485 | 255 |
| refute:SKILL.md | claude-sonnet-5 | 15 | 2,934 | 30 | 747,661 | 104 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 13 | 2,451 | 110 | 451,202 | 174 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 14 | 2,228 | 28 | 822,695 | 127 |
| refute:run-tests.sh | claude-sonnet-5 | 12 | 2,083 | 24 | 704,463 | 144 |
| refute:run-tests.sh | claude-sonnet-5 | 6 | 2,050 | 12 | 271,578 | 64 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,757 | 58 | 225,256 | 104 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,282 | 50 | 156,906 | 28 |
| baseline:diffBase | claude-sonnet-5 | 12 | 1,231 | 24 | 601,802 | 207 |
| refute:run-tests.sh | claude-sonnet-5 | 14 | 1,069 | 28 | 746,645 | 139 |
| refute:run-tests.sh | claude-sonnet-5 | 11 | 865 | 22 | 592,905 | 111 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 627 | 18 | 28,055 | 11 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 553 | 18 | 28,059 | 8 |
| capture:provenance | claude-sonnet-5 | 2 | 514 | 4 | 43,969 | 13 |
| refute:acceptance-gold.mjs | claude-sonnet-5 | 7 | 368 | 14 | 353,779 | 255 |
| judge:J14:spec-alignment | claude-sonnet-5 | 2 | 300 | 4 | 67,988 | 30 |
| judge:J14:domain-correctness | claude-sonnet-5 | 2 | 10 | 4 | 67,988 | 29 |
| judge:J13:spec-alignment | claude-sonnet-5 | 2 | 9 | 4 | 67,985 | 43 |
| judge:J13:operational-feasibility | claude-sonnet-5 | 2 | 8 | 4 | 44,624 | 69 |
| judge:J14:operational-feasibility | claude-sonnet-5 | 2 | 7 | 4 | 67,990 | 26 |
| judge:J12:operational-feasibility | claude-sonnet-5 | 2 | 7 | 4 | 44,587 | 42 |
| judge:J12:spec-alignment | claude-sonnet-5 | 2 | 7 | 4 | 44,585 | 66 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 3 | 5 | 26 | 58,196 | 15 |
| triage | claude-sonnet-5 | 2 | 4 | 4 | 52,291 | 254 |

- **claude-sonnet-5**: 29 agent · 219 calls · out 94,826 · in 438 · cache_read 11,396,662 · cache_create 1,367,592
- **claude-fable-5**: 3 agent · 31 calls · out 41,805 · in 59 · cache_read 2,071,404 · cache_create 240,084
- **claude-haiku-4-5-20251001**: 6 agent · 33 calls · out 6,675 · in 280 · cache_read 947,674 · cache_create 220,427

