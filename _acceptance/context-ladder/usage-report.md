### S4 round 1 — wf_e1f00a9c-1be (18 agent, 46,770 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 15 | 13,214 | 30 | 908,294 | 321 |
| review:conventions | claude-fable-5 | 26 | 12,145 | 52 | 1,875,584 | 295 |
| refute:gate-card.js | claude-sonnet-5 | 13 | 3,866 | 26 | 651,815 | 84 |
| refute:gate-card.js | claude-sonnet-5 | 15 | 2,974 | 30 | 800,949 | 122 |
| refute:gate-card.js | claude-sonnet-5 | 8 | 2,652 | 16 | 397,045 | 84 |
| refute:gate-card.js | claude-sonnet-5 | 7 | 2,548 | 14 | 352,067 | 63 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,881 | 26 | 83,491 | 29 |
| refute:gate-card.js | claude-sonnet-5 | 15 | 1,569 | 30 | 797,942 | 134 |
| baseline:diffBase | claude-sonnet-5 | 11 | 1,494 | 22 | 505,891 | 226 |
| refute:gate-card.js | claude-sonnet-5 | 5 | 853 | 10 | 240,204 | 61 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 770 | 18 | 44,875 | 13 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 716 | 18 | 27,466 | 124 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 511 | 18 | 44,868 | 17 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 509 | 18 | 44,872 | 10 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 465 | 26 | 57,943 | 57 |
| capture:provenance | claude-sonnet-5 | 2 | 330 | 4 | 43,422 | 16 |
| synthesize:report | claude-sonnet-5 | 2 | 137 | 4 | 53,607 | 213 |
| triage | claude-sonnet-5 | 2 | 136 | 4 | 47,252 | 67 |

- **claude-fable-5**: 2 agent · 41 calls · out 25,359 · in 82 · cache_read 2,783,878 · cache_create 150,008
- **claude-sonnet-5**: 10 agent · 80 calls · out 16,559 · in 160 · cache_read 3,890,194 · cache_create 497,726
- **claude-haiku-4-5-20251001**: 6 agent · 14 calls · out 4,852 · in 124 · cache_read 303,515 · cache_create 146,715

### S4 round 2 — wf_300367e9-c85 (13 agent, 40,710 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 20 | 16,786 | 40 | 1,361,362 | 289 |
| refute:run-tests.sh | claude-sonnet-5 | 9 | 6,290 | 18 | 486,600 | 134 |
| review:conventions | claude-fable-5 | 10 | 5,989 | 20 | 547,160 | 141 |
| triage | claude-sonnet-5 | 2 | 3,675 | 4 | 45,687 | 55 |
| refute:gate-card.js | claude-sonnet-5 | 5 | 2,900 | 10 | 217,995 | 56 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,566 | 42 | 139,988 | 103 |
| capture:provenance | claude-sonnet-5 | 2 | 846 | 4 | 43,422 | 15 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 802 | 18 | 27,473 | 13 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 627 | 18 | 44,872 | 12 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 481 | 18 | 27,466 | 15 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 436 | 18 | 44,868 | 126 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 295 | 18 | 44,868 | 15 |
| synthesize:report | claude-sonnet-5 | 5 | 17 | 10 | 249,906 | 154 |

- **claude-fable-5**: 2 agent · 30 calls · out 22,775 · in 60 · cache_read 1,908,522 · cache_create 154,564
- **claude-sonnet-5**: 5 agent · 23 calls · out 13,728 · in 46 · cache_read 1,043,610 · cache_create 277,772
- **claude-haiku-4-5-20251001**: 6 agent · 15 calls · out 4,207 · in 132 · cache_read 329,535 · cache_create 155,983

