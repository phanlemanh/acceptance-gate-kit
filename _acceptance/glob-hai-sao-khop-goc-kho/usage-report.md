### S4 round 1 — wf_25f3bc68-a4b (18 agent, 23,889 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:run-tests.sh | claude-sonnet-5 | 9 | 6,214 | 18 | 717,528 | 134 |
| synthesize:report | claude-sonnet-5 | 4 | 5,360 | 8 | 278,123 | 125 |
| refute:run-tests.sh | claude-sonnet-5 | 7 | 2,937 | 14 | 512,356 | 50 |
| review:conventions | claude-fable-5-1 | 12 | 1,471 | 354 | 1,013,226 | 490 |
| refute:GUIDE.md | claude-sonnet-5 | 6 | 1,352 | 12 | 421,927 | 42 |
| review:bugs | claude-fable-5-1 | 9 | 1,146 | 258 | 673,920 | 373 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,131 | 26 | 106,694 | 222 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 1,046 | 20 | 797,896 | 189 |
| review:measurement | claude-fable-5-1 | 9 | 956 | 258 | 724,239 | 663 |
| refute:evals.yaml | claude-sonnet-5 | 12 | 691 | 24 | 1,083,284 | 277 |
| baseline:diffBase | claude-sonnet-5 | 6 | 517 | 12 | 382,741 | 232 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 425 | 18 | 80,169 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 333 | 18 | 80,176 | 11 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 228 | 42 | 242,537 | 363 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 58 | 20 | 716,931 | 187 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 10 | 58 | 364,211 | 33 |
| capture:provenance | claude-sonnet-5 | 2 | 7 | 4 | 70,898 | 10 |
| triage | claude-sonnet-5 | 2 | 7 | 4 | 75,753 | 59 |

- **claude-sonnet-5**: 10 agent · 68 calls · out 18,189 · in 136 · cache_read 5,057,437 · cache_create 725,907
- **claude-fable-5-1**: 3 agent · 30 calls · out 3,573 · in 870 · cache_read 2,411,385 · cache_create 320,225
- **claude-haiku-4-5-20251001**: 5 agent · 19 calls · out 2,127 · in 162 · cache_read 873,787 · cache_create 199,909

