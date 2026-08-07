### S4 round 4 — wf_f3b75073-d16 (30 agent, 141,540 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-fable-5 | 22 | 30,025 | 42 | 2,401,382 | 917 |
| review:bugs | claude-fable-5 | 55 | 19,454 | 104 | 7,826,050 | 640 |
| review:conventions | claude-fable-5 | 36 | 19,426 | 69 | 4,287,326 | 776 |
| refute:run-tests.sh | claude-sonnet-5 | 8 | 14,120 | 16 | 618,735 | 183 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 17 | 12,410 | 34 | 1,469,020 | 203 |
| review:measurement | claude-fable-5 | 10 | 10,321 | 20 | 799,629 | 192 |
| review:bugs | claude-fable-5 | 12 | 8,155 | 23 | 1,032,929 | 177 |
| refute:run-tests.sh | claude-sonnet-5 | 9 | 6,917 | 18 | 646,772 | 101 |
| review:conventions | claude-fable-5 | 12 | 5,862 | 23 | 1,081,512 | 159 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 13 | 2,650 | 106 | 594,049 | 854 |
| synthesize:report | claude-sonnet-5 | 6 | 2,509 | 12 | 441,456 | 170 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,692 | 50 | 262,569 | 213 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,284 | 58 | 322,974 | 159 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,195 | 34 | 154,873 | 27 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,075 | 42 | 211,129 | 37 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 981 | 18 | 49,160 | 18 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 874 | 26 | 119,572 | 202 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 642 | 18 | 48,859 | 16 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 526 | 18 | 48,863 | 12 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 491 | 18 | 49,167 | 10 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 313 | 18 | 66,938 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 300 | 18 | 48,866 | 13 |
| capture:provenance | claude-sonnet-5 | 2 | 200 | 4 | 69,412 | 11 |
| triage | claude-sonnet-5 | 2 | 118 | 4 | 71,853 | 40 |
| machine:bash tests/plugins/run-tests.sh | <synthetic> | 1 | 0 | 0 | 0 | 159 |
| capture:provenance | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| review:conventions | <synthetic> | 1 | 0 | 0 | 0 | 159 |
| machine:bash tests/scripts/run-tests.sh | <synthetic> | 1 | 0 | 0 | 0 | 202 |
| review:bugs | <synthetic> | 1 | 0 | 0 | 0 | 177 |
| review:measurement | <synthetic> | 1 | 0 | 0 | 0 | 192 |

- **claude-fable-5**: 6 agent · 147 calls · out 93,243 · in 281 · cache_read 17,428,828 · cache_create 932,481
- **claude-sonnet-5**: 6 agent · 44 calls · out 36,274 · in 88 · cache_read 3,317,248 · cache_create 516,643
- **claude-haiku-4-5-20251001**: 12 agent · 50 calls · out 12,023 · in 424 · cache_read 1,977,019 · cache_create 712,652
- **<synthetic>**: 6 agent · 6 calls · out 0 · in 0 · cache_read 0 · cache_create 0

