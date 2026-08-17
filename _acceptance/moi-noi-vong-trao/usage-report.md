### S4 round 1 — wf_8927ff95-24d (36 agent, 209,777 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 22,839 | 4 | 94,841 | 232 |
| refute:rang-mnvt.sh | claude-sonnet-5 | 8 | 17,522 | 16 | 474,877 | 203 |
| review:conventions | claude-fable-5 | 20 | 13,797 | 39 | 1,642,518 | 234 |
| triage | claude-sonnet-5 | 2 | 12,977 | 4 | 82,225 | 138 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 10,860 | 2,396 | 589,856 | 141 |
| judge:E5:operational-feasibility | claude-sonnet-5 | 3 | 10,302 | 6 | 157,288 | 121 |
| review:measurement | claude-fable-5 | 8 | 9,589 | 16 | 503,487 | 151 |
| refute:rang-mnvt.sh | claude-sonnet-5 | 4 | 9,379 | 8 | 202,333 | 118 |
| refute:rang-mnvt.sh | claude-sonnet-5 | 7 | 9,123 | 14 | 385,967 | 118 |
| review:bugs | claude-fable-5 | 21 | 8,971 | 40 | 1,567,239 | 181 |
| refute:run-tests.sh | claude-sonnet-5 | 8 | 8,659 | 16 | 460,521 | 120 |
| baseline:diffBase | claude-sonnet-5 | 26 | 8,177 | 52 | 1,718,043 | 287 |
| judge:E4:spec-alignment | claude-sonnet-5 | 2 | 7,608 | 4 | 78,349 | 89 |
| refute:config.yaml | claude-sonnet-5 | 11 | 7,513 | 22 | 669,200 | 117 |
| judge:E5:domain-correctness | claude-sonnet-5 | 3 | 6,339 | 6 | 157,284 | 75 |
| refute:gate-card.js | claude-sonnet-5 | 8 | 5,983 | 16 | 459,073 | 96 |
| refute:SKILL.md | claude-sonnet-5 | 11 | 5,274 | 22 | 634,747 | 91 |
| refute:gate-card.js | claude-sonnet-5 | 7 | 4,714 | 14 | 384,237 | 74 |
| refute:rang-mnvt.sh | claude-sonnet-5 | 5 | 4,239 | 10 | 261,363 | 112 |
| judge:E5:spec-alignment | claude-sonnet-5 | 3 | 3,711 | 6 | 157,289 | 46 |
| capture:provenance | claude-sonnet-5 | 7 | 3,469 | 14 | 397,802 | 58 |
| judge:E4:operational-feasibility | claude-sonnet-5 | 2 | 2,776 | 4 | 78,351 | 36 |
| judge:E4:domain-correctness | claude-sonnet-5 | 2 | 2,034 | 4 | 52,943 | 25 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,595 | 50 | 203,393 | 244 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,486 | 26 | 96,403 | 35 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 8 | 1,462 | 66 | 302,856 | 197 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,284 | 34 | 136,919 | 35 |
| refute:rang-mnvt.sh | claude-sonnet-5 | 3 | 1,259 | 6 | 136,878 | 24 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 4 | 1,101 | 34 | 136,246 | 34 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 6 | 1,089 | 50 | 217,116 | 42 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 4 | 1,052 | 34 | 136,297 | 31 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 4 | 1,017 | 34 | 136,285 | 31 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 4 | 887 | 34 | 135,943 | 16 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 2 | 775 | 18 | 56,594 | 17 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 3 | 532 | 26 | 96,326 | 35 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 2 | 383 | 18 | 56,590 | 15 |

- **claude-sonnet-5**: 21 agent · 134 calls · out 164,757 · in 2,644 · cache_read 7,633,467 · cache_create 1,029,890
- **claude-fable-5**: 3 agent · 49 calls · out 32,357 · in 95 · cache_read 3,713,244 · cache_create 238,051
- **claude-haiku-4-5-20251001**: 12 agent · 50 calls · out 12,663 · in 424 · cache_read 1,710,968 · cache_create 294,663

