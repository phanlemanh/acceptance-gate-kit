### S4 round 1 — wf_b8a11674-b4c (17 agent, 105,718 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 17,307 | 4 | 61,001 | 180 |
| review:bugs | claude-fable-5 | 15 | 13,999 | 29 | 1,164,184 | 261 |
| review:conventions | claude-fable-5 | 11 | 13,436 | 21 | 793,611 | 259 |
| refute:rang.sh | claude-sonnet-5 | 19 | 12,862 | 38 | 1,232,383 | 212 |
| refute:rang.sh | claude-sonnet-5 | 20 | 9,660 | 40 | 1,258,633 | 196 |
| review:measurement | claude-fable-5 | 10 | 9,605 | 1,309 | 632,059 | 176 |
| refute:rang.sh | claude-sonnet-5 | 15 | 9,587 | 30 | 923,727 | 161 |
| refute:rang.sh | claude-sonnet-5 | 15 | 8,213 | 30 | 902,837 | 156 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 3,009 | 50 | 242,535 | 500 |
| baseline:diffBase | claude-sonnet-5 | 8 | 2,245 | 16 | 403,676 | 50 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,587 | 50 | 227,550 | 25 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,585 | 42 | 182,899 | 180 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 1,000 | 18 | 58,133 | 15 |
| capture:provenance | claude-sonnet-5 | 2 | 570 | 4 | 52,462 | 13 |
| machine:bash _acceptance/het-gio-khong-phai-truo | claude-haiku-4-5-20251001 | 2 | 535 | 18 | 38,096 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 390 | 18 | 58,126 | 17 |
| triage | claude-sonnet-5 | 2 | 128 | 4 | 55,549 | 32 |

- **claude-sonnet-5**: 8 agent · 83 calls · out 60,572 · in 166 · cache_read 4,890,268 · cache_create 466,668
- **claude-fable-5**: 3 agent · 36 calls · out 37,040 · in 1,359 · cache_read 2,589,854 · cache_create 237,863
- **claude-haiku-4-5-20251001**: 6 agent · 23 calls · out 8,106 · in 196 · cache_read 807,339 · cache_create 156,973

