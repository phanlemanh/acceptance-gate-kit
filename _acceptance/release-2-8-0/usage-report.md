### S4 round 1 (REJECT — bản đồ sản phẩm lệch tại HEAD, 5 eval đỏ theo) — wf_cb2a98f8-647 (18 agent, 11,304 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5 | 38 | 4,083 | 76 | 4,000,849 | 453 |
| refute:evals.yaml | claude-sonnet-5 | 18 | 1,982 | 36 | 1,435,000 | 77 |
| refute:PRODUCT-MAP.md | claude-sonnet-5 | 6 | 1,400 | 12 | 410,156 | 46 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 854 | 18 | 79,134 | 294 |
| refute:PRODUCT-MAP.md | claude-sonnet-5 | 19 | 829 | 38 | 1,514,377 | 609 |
| baseline:diffBase | claude-sonnet-5 | 13 | 524 | 26 | 982,562 | 489 |
| refute:plugin.json | claude-sonnet-5 | 5 | 419 | 10 | 350,313 | 42 |
| machine:node scripts/product-map.mjs --check | claude-haiku-4-5-20251001 | 2 | 413 | 18 | 79,136 | 11 |
| review:bugs | claude-opus-5 | 22 | 268 | 44 | 1,943,342 | 1120 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 251 | 50 | 298,592 | 174 |
| refute:plugin.json | claude-sonnet-5 | 7 | 202 | 14 | 492,475 | 48 |
| review:measurement | claude-opus-5 | 13 | 46 | 26 | 1,100,559 | 184 |
| triage | claude-sonnet-5 | 2 | 7 | 4 | 74,217 | 33 |
| synthesize:report | claude-sonnet-5 | 2 | 7 | 4 | 79,916 | 156 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 6 | 26 | 132,858 | 18 |
| capture:provenance | claude-sonnet-5 | 3 | 5 | 6 | 142,764 | 14 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 4 | 18 | 79,134 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 4 | 18 | 79,141 | 12 |

- **claude-opus-5**: 3 agent · 73 calls · out 4,397 · in 146 · cache_read 7,044,750 · cache_create 258,338
- **claude-sonnet-5**: 9 agent · 75 calls · out 5,375 · in 150 · cache_read 5,481,780 · cache_create 593,727
- **claude-haiku-4-5-20251001**: 6 agent · 17 calls · out 1,532 · in 148 · cache_read 747,995 · cache_create 177,210

