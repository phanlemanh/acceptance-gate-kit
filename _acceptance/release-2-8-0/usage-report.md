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


### S4 round 2 (PASS 8/8 — sau khi vẽ lại bản đồ; 6 mục ngoài hợp đồng) — wf_34b74f30-1a5 (22 agent, 24,787 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| triage | claude-sonnet-5 | 2 | 7,984 | 4 | 77,545 | 92 |
| refute:review-findings.md | claude-sonnet-5 | 12 | 4,464 | 24 | 996,064 | 125 |
| review:measurement | claude-opus-5 | 18 | 2,703 | 36 | 1,607,726 | 252 |
| refute:evidence-report.md | claude-sonnet-5 | 9 | 1,525 | 18 | 662,629 | 90 |
| refute:evidence-report.md | claude-sonnet-5 | 19 | 1,328 | 38 | 1,647,028 | 222 |
| refute:evals.yaml | claude-sonnet-5 | 12 | 1,216 | 24 | 981,597 | 167 |
| refute:evidence-report.md | claude-sonnet-5 | 10 | 1,038 | 20 | 820,129 | 81 |
| refute:evals.yaml | claude-sonnet-5 | 12 | 827 | 24 | 913,449 | 67 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 775 | 42 | 241,628 | 23 |
| capture:provenance | claude-sonnet-5 | 3 | 479 | 6 | 142,708 | 12 |
| review:conventions | claude-opus-5 | 26 | 413 | 52 | 2,546,753 | 591 |
| refute:evidence-report.md | claude-sonnet-5 | 9 | 391 | 18 | 662,338 | 45 |
| refute:evals.yaml | claude-sonnet-5 | 12 | 355 | 24 | 959,466 | 85 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 333 | 18 | 79,141 | 11 |
| machine:node scripts/product-map.mjs --check | claude-haiku-4-5-20251001 | 2 | 303 | 18 | 79,136 | 10 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 235 | 34 | 189,905 | 163 |
| review:bugs | claude-opus-5 | 28 | 212 | 56 | 3,192,472 | 325 |
| refute:review-findings.md | claude-sonnet-5 | 11 | 158 | 22 | 831,836 | 87 |
| synthesize:report | claude-sonnet-5 | 6 | 21 | 12 | 493,810 | 149 |
| refute:evidence-report.md | claude-sonnet-5 | 5 | 13 | 10 | 337,612 | 25 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 9 | 42 | 244,780 | 296 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 5 | 18 | 77,929 | 14 |

- **claude-sonnet-5**: 13 agent · 122 calls · out 19,799 · in 244 · cache_read 9,526,211 · cache_create 860,024
- **claude-opus-5**: 3 agent · 72 calls · out 3,328 · in 144 · cache_read 7,346,951 · cache_create 304,591
- **claude-haiku-4-5-20251001**: 6 agent · 20 calls · out 1,660 · in 172 · cache_read 912,519 · cache_create 158,227

