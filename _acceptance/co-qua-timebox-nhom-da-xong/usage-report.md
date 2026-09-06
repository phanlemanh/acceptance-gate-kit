### S4 round 1 — wf_41e9e454-6ca (19 agent, 10,646 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:ra-co-ten.test.mjs | claude-sonnet-5 | 10 | 2,034 | 20 | 965,080 | 110 |
| refute:start-scan.mjs | claude-sonnet-5 | 21 | 1,922 | 42 | 2,269,243 | 279 |
| baseline:diffBase | claude-sonnet-5 | 26 | 1,668 | 52 | 2,722,797 | 457 |
| review:conventions | claude-fable-5-1 | 10 | 1,630 | 290 | 1,070,613 | 237 |
| machine:RT_CASES=RT13 node tests/plugins/ra-co-t | claude-haiku-4-5-20251001 | 2 | 769 | 18 | 93,381 | 24 |
| review:bugs | claude-fable-5-1 | 12 | 731 | 354 | 1,180,194 | 195 |
| refute:ra-co-ten.test.mjs | claude-sonnet-5 | 15 | 657 | 30 | 1,417,649 | 133 |
| refute:contract.md | claude-sonnet-5 | 19 | 515 | 38 | 2,061,905 | 182 |
| refute:config.yaml | claude-sonnet-5 | 8 | 465 | 16 | 709,710 | 90 |
| triage | claude-sonnet-5 | 2 | 110 | 4 | 93,617 | 172 |
| review:measurement | claude-fable-5-1 | 9 | 81 | 258 | 894,934 | 185 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 15 | 42 | 307,603 | 29 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 12 | 58 | 447,153 | 421 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 12 | 42 | 231,063 | 698 |
| synthesize:report | claude-sonnet-5 | 2 | 7 | 4 | 101,147 | 156 |
| capture:provenance | claude-sonnet-5 | 2 | 6 | 4 | 89,136 | 23 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 6 | 18 | 93,333 | 14 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 4 | 18 | 93,326 | 16 |
| machine:RT_CASES=RT13 node tests/plugins/ra-co-t | claude-haiku-4-5-20251001 | 2 | 2 | 18 | 64,852 | 24 |

- **claude-sonnet-5**: 9 agent · 105 calls · out 7,384 · in 210 · cache_read 10,430,284 · cache_create 881,025
- **claude-fable-5-1**: 3 agent · 31 calls · out 2,442 · in 902 · cache_read 3,145,741 · cache_create 334,490
- **claude-haiku-4-5-20251001**: 7 agent · 25 calls · out 820 · in 214 · cache_read 1,330,711 · cache_create 418,058

