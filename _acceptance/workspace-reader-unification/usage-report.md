### S4 round 1 — wf_474635cb-478 (19 agent, 117,367 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 37 | 27,573 | 74 | 4,134,646 | 932 |
| review:measurement | claude-fable-5 | 12 | 18,201 | 24 | 762,551 | 315 |
| synthesize:report | claude-sonnet-5 | 13 | 14,971 | 26 | 917,160 | 223 |
| review:conventions | claude-fable-5 | 16 | 11,882 | 32 | 1,164,145 | 475 |
| triage | claude-sonnet-5 | 2 | 9,022 | 4 | 49,806 | 119 |
| refute:start-scan.mjs | claude-sonnet-5 | 18 | 7,413 | 36 | 1,027,738 | 159 |
| refute:SKILL.md | claude-sonnet-5 | 15 | 5,669 | 30 | 891,504 | 154 |
| refute:run-tests.sh | claude-sonnet-5 | 4 | 5,062 | 8 | 152,434 | 140 |
| refute:SKILL.md | claude-sonnet-5 | 8 | 4,512 | 16 | 407,452 | 73 |
| refute:run-tests.sh | claude-sonnet-5 | 7 | 3,068 | 14 | 303,806 | 64 |
| refute:start-scan.mjs | claude-sonnet-5 | 9 | 2,687 | 18 | 442,655 | 69 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,564 | 58 | 179,406 | 747 |
| baseline:diffBase | claude-sonnet-5 | 5 | 1,461 | 10 | 220,877 | 318 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,283 | 50 | 166,652 | 32 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,125 | 42 | 133,303 | 74 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 657 | 18 | 29,300 | 9 |
| capture:provenance | claude-sonnet-5 | 2 | 524 | 4 | 45,445 | 9 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 437 | 18 | 29,293 | 14 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 256 | 18 | 29,297 | 8 |

- **claude-fable-5**: 3 agent · 65 calls · out 57,656 · in 130 · cache_read 6,061,342 · cache_create 351,241
- **claude-sonnet-5**: 10 agent · 83 calls · out 54,389 · in 166 · cache_read 4,458,877 · cache_create 614,204
- **claude-haiku-4-5-20251001**: 6 agent · 24 calls · out 5,322 · in 204 · cache_read 567,251 · cache_create 230,069

