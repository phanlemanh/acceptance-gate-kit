### S4 round 1 — wf_c9515d84-758 (16 agent, 4,245 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-fable-5-1 | 12 | 1,042 | 354 | 1,205,994 | 237 |
| baseline:diffBase | claude-sonnet-5 | 10 | 780 | 20 | 628,283 | 887 |
| review:bugs | claude-fable-5-1 | 13 | 746 | 386 | 1,249,433 | 222 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 733 | 34 | 182,116 | 548 |
| refute:contract.md | claude-sonnet-5 | 6 | 361 | 12 | 471,768 | 51 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 323 | 18 | 85,792 | 11 |
| synthesize:report | claude-sonnet-5 | 2 | 115 | 4 | 89,329 | 125 |
| review:measurement | claude-fable-5-1 | 10 | 53 | 290 | 971,506 | 197 |
| refute:contract.md | claude-sonnet-5 | 5 | 25 | 10 | 393,777 | 83 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 8 | 20 | 66 | 466,500 | 46 |
| refute:contract.md | claude-sonnet-5 | 7 | 20 | 14 | 524,514 | 93 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 8 | 18 | 85,785 | 16 |
| triage | claude-sonnet-5 | 2 | 7 | 4 | 83,588 | 52 |
| machine:bash -c 'set -o pipefail; ONLY_BLOCK=P20 | claude-haiku-4-5-20251001 | 2 | 5 | 18 | 85,823 | 21 |
| capture:provenance | claude-sonnet-5 | 2 | 4 | 4 | 80,732 | 16 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 3 | 26 | 89,765 | 326 |

- **claude-fable-5-1**: 3 agent · 35 calls · out 1,841 · in 1,030 · cache_read 3,426,933 · cache_create 331,266
- **claude-sonnet-5**: 7 agent · 34 calls · out 1,312 · in 68 · cache_read 2,271,991 · cache_create 783,851
- **claude-haiku-4-5-20251001**: 6 agent · 21 calls · out 1,092 · in 180 · cache_read 995,781 · cache_create 291,201

