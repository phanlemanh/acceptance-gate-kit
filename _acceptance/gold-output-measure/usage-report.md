### S4 round 2 — wf_5e20eee8-f7c (27 agent, 216,771 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 5 | 23,891 | 4,676 | 297,941 | 262 |
| refute:run-tests.sh | claude-sonnet-5 | 18 | 20,321 | 36 | 1,175,046 | 333 |
| refute:run-tests.sh | claude-sonnet-5 | 16 | 18,286 | 2,364 | 1,060,571 | 272 |
| review:bugs | claude-opus-5 | 19 | 15,919 | 37 | 1,338,472 | 366 |
| review:measurement | claude-opus-5 | 19 | 14,339 | 37 | 1,371,412 | 371 |
| judge:J1:spec-alignment | claude-sonnet-5 | 2 | 13,338 | 4 | 69,281 | 144 |
| review:conventions | claude-opus-5 | 15 | 11,962 | 2,457 | 1,039,058 | 304 |
| refute:run-tests.sh | claude-sonnet-5 | 11 | 10,653 | 3,372 | 673,632 | 205 |
| refute:gold-stdout.provenance.json | claude-sonnet-5 | 17 | 10,068 | 34 | 961,438 | 269 |
| triage | claude-sonnet-5 | 2 | 9,888 | 4 | 76,563 | 114 |
| refute:evals.yaml | claude-sonnet-5 | 11 | 9,682 | 22 | 630,062 | 142 |
| refute:run-tests.sh | claude-sonnet-5 | 12 | 9,101 | 24 | 723,078 | 148 |
| refute:run-tests.sh | claude-sonnet-5 | 16 | 8,549 | 32 | 940,784 | 280 |
| judge:J1:operational-feasibility | claude-sonnet-5 | 4 | 7,484 | 8 | 181,470 | 101 |
| refute:run-tests.sh | claude-sonnet-5 | 12 | 7,158 | 24 | 634,036 | 131 |
| refute:acceptance-gold.mjs | claude-sonnet-5 | 11 | 6,185 | 22 | 640,290 | 116 |
| refute:run-tests.sh | claude-sonnet-5 | 13 | 5,368 | 26 | 724,956 | 129 |
| refute:run-tests.sh | claude-sonnet-5 | 13 | 5,145 | 26 | 678,714 | 134 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 12 | 2,491 | 98 | 377,713 | 235 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 2,366 | 20 | 546,457 | 142 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,208 | 50 | 165,655 | 113 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,169 | 50 | 159,787 | 27 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 650 | 18 | 28,612 | 10 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 552 | 18 | 46,324 | 11 |
| judge:J1:domain-correctness | claude-sonnet-5 | 2 | 474 | 4 | 69,281 | 126 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 293 | 18 | 28,605 | 12 |
| capture:provenance | claude-sonnet-5 | 2 | 231 | 4 | 44,638 | 20 |

- **claude-sonnet-5**: 18 agent · 177 calls · out 168,188 · in 10,702 · cache_read 10,128,238 · cache_create 963,915
- **claude-opus-5**: 3 agent · 53 calls · out 42,220 · in 2,531 · cache_read 3,748,942 · cache_create 303,445
- **claude-haiku-4-5-20251001**: 6 agent · 30 calls · out 6,363 · in 252 · cache_read 806,696 · cache_create 192,926

