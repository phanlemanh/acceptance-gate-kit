### S4 round 1 — wf_c0dad5d1-a22 (21 agent, 139,514 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:hfl_clause.py | claude-sonnet-5 | 18 | 16,012 | 36 | 1,159,864 | 253 |
| triage | claude-sonnet-5 | 2 | 15,990 | 4 | 46,382 | 180 |
| review:bugs | claude-fable-5 | 12 | 11,917 | 24 | 696,850 | 211 |
| refute:rang.sh | claude-sonnet-5 | 7 | 11,834 | 14 | 323,136 | 160 |
| refute:rang.sh | claude-sonnet-5 | 8 | 11,804 | 16 | 388,136 | 157 |
| synthesize:report | claude-sonnet-5 | 2 | 9,975 | 4 | 53,372 | 105 |
| refute:rang.sh | claude-sonnet-5 | 11 | 9,556 | 22 | 543,537 | 149 |
| refute:rang.sh | claude-sonnet-5 | 7 | 9,351 | 14 | 308,827 | 119 |
| refute:run-tests.sh | claude-sonnet-5 | 21 | 8,349 | 42 | 1,178,664 | 173 |
| review:measurement | claude-fable-5 | 7 | 8,327 | 14 | 340,145 | 126 |
| review:conventions | claude-fable-5 | 6 | 6,743 | 12 | 259,302 | 107 |
| refute:run-tests.sh | claude-sonnet-5 | 14 | 6,564 | 89 | 730,034 | 114 |
| refute:rang.sh | claude-sonnet-5 | 9 | 3,469 | 18 | 425,315 | 71 |
| baseline:diffBase | claude-sonnet-5 | 7 | 2,461 | 14 | 283,129 | 139 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,515 | 42 | 139,958 | 22 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,371 | 58 | 209,256 | 247 |
| machine:bash _acceptance/siet-rang-cau-ve-hinh/r | claude-haiku-4-5-20251001 | 3 | 1,252 | 26 | 55,415 | 35 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,143 | 34 | 105,136 | 114 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 906 | 18 | 45,480 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 570 | 18 | 45,487 | 9 |
| capture:provenance | claude-sonnet-5 | 2 | 405 | 4 | 41,887 | 8 |

- **claude-sonnet-5**: 12 agent · 108 calls · out 105,770 · in 277 · cache_read 5,482,283 · cache_create 580,492
- **claude-fable-5**: 3 agent · 25 calls · out 26,987 · in 50 · cache_read 1,296,297 · cache_create 165,291
- **claude-haiku-4-5-20251001**: 6 agent · 23 calls · out 6,757 · in 196 · cache_read 600,732 · cache_create 92,314

