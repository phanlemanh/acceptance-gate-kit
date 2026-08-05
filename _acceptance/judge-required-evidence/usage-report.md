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

### S4 round 2 (carry 9 eval) — wf_0bb0c0c1-19a (26 agent, 144,882 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 26,630 | 4 | 64,642 | 264 |
| review:bugs | claude-fable-5 | 15 | 20,236 | 29 | 991,959 | 317 |
| review:conventions | claude-fable-5 | 13 | 15,570 | 25 | 821,435 | 297 |
| review:measurement | claude-fable-5 | 8 | 11,209 | 16 | 425,281 | 200 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 14 | 9,173 | 28 | 774,002 | 157 |
| refute:run-tests.sh | claude-sonnet-5 | 15 | 8,064 | 30 | 851,314 | 201 |
| refute:run-tests.sh | claude-sonnet-5 | 14 | 7,884 | 28 | 766,933 | 211 |
| refute:acceptance-gold.mjs | claude-sonnet-5 | 16 | 7,831 | 32 | 946,146 | 146 |
| judge:J13:domain-correctness | claude-sonnet-5 | 4 | 6,744 | 8 | 155,411 | 88 |
| refute:run-tests.sh | claude-sonnet-5 | 14 | 6,147 | 28 | 736,521 | 142 |
| judge:J13:operational-feasibility | claude-sonnet-5 | 2 | 4,852 | 4 | 44,624 | 62 |
| refute:run-tests.sh | claude-sonnet-5 | 6 | 3,400 | 12 | 251,028 | 86 |
| refute:run-tests.sh | claude-sonnet-5 | 6 | 2,793 | 12 | 268,412 | 76 |
| refute:SKILL.md | claude-sonnet-5 | 14 | 1,982 | 28 | 813,218 | 114 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 9 | 1,928 | 74 | 260,997 | 277 |
| refute:run-tests.sh | claude-sonnet-5 | 8 | 1,908 | 899 | 405,607 | 97 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,621 | 58 | 194,307 | 37 |
| refute:core-untouched.test.mjs | claude-sonnet-5 | 9 | 1,417 | 18 | 514,586 | 130 |
| refute:acceptance-gold.mjs | claude-sonnet-5 | 8 | 1,304 | 16 | 385,034 | 64 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,287 | 26 | 76,413 | 65 |
| capture:provenance | claude-sonnet-5 | 3 | 1,140 | 6 | 93,463 | 18 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 765 | 18 | 28,055 | 12 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 541 | 18 | 28,059 | 10 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 344 | 18 | 28,062 | 9 |
| triage | claude-sonnet-5 | 2 | 103 | 4 | 49,842 | 150 |
| judge:J13:spec-alignment | claude-sonnet-5 | 2 | 9 | 4 | 44,622 | 54 |

- **claude-sonnet-5**: 17 agent · 139 calls · out 91,381 · in 1,161 · cache_read 7,165,405 · cache_create 925,022
- **claude-fable-5**: 3 agent · 36 calls · out 47,015 · in 70 · cache_read 2,238,675 · cache_create 273,906
- **claude-haiku-4-5-20251001**: 6 agent · 25 calls · out 6,486 · in 212 · cache_read 615,893 · cache_create 195,766

