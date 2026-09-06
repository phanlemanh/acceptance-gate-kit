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

### S4 round 3 — wf_9f2276d8-72d (22 agent, 26,227 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:ra-co-ten.test.mjs | claude-sonnet-5 | 14 | 7,891 | 28 | 1,400,470 | 262 |
| refute:s4-args.mjs | claude-sonnet-5 | 9 | 4,561 | 18 | 869,975 | 144 |
| refute:evals.yaml | claude-sonnet-5 | 17 | 2,615 | 34 | 1,775,310 | 215 |
| refute:config.yaml | claude-sonnet-5 | 16 | 2,189 | 32 | 1,728,153 | 263 |
| refute:run-tests.sh | claude-sonnet-5 | 11 | 1,461 | 22 | 977,814 | 126 |
| review:bugs | claude-fable-5-1 | 8 | 1,358 | 226 | 901,356 | 311 |
| refute:start-scan.mjs | claude-sonnet-5 | 12 | 1,148 | 24 | 1,147,274 | 153 |
| refute:rang.sh | claude-sonnet-5 | 9 | 964 | 18 | 953,946 | 300 |
| refute:rang.sh | claude-sonnet-5 | 15 | 947 | 30 | 1,490,017 | 150 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 721 | 18 | 93,333 | 17 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 506 | 50 | 267,945 | 759 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 478 | 50 | 433,067 | 228 |
| review:measurement | claude-fable-5-1 | 7 | 460 | 194 | 694,244 | 224 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 401 | 42 | 303,913 | 31 |
| synthesize:report | claude-sonnet-5 | 6 | 242 | 12 | 581,534 | 222 |
| triage | claude-sonnet-5 | 2 | 125 | 4 | 94,154 | 103 |
| review:conventions | claude-fable-5-1 | 10 | 73 | 290 | 1,180,679 | 269 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 64 | 20 | 899,700 | 146 |
| capture:provenance | claude-sonnet-5 | 3 | 11 | 6 | 196,135 | 22 |
| machine:RT_CASES=RT13 node tests/plugins/ra-co-t | claude-haiku-4-5-20251001 | 2 | 6 | 18 | 64,886 | 26 |
| machine:RT_CASES=RT13 node tests/plugins/ra-co-t | claude-haiku-4-5-20251001 | 2 | 4 | 18 | 93,347 | 23 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 2 | 18 | 93,326 | 15 |

- **claude-sonnet-5**: 12 agent · 124 calls · out 22,218 · in 248 · cache_read 12,114,482 · cache_create 1,217,451
- **claude-fable-5-1**: 3 agent · 25 calls · out 1,891 · in 710 · cache_read 2,776,279 · cache_create 407,986
- **claude-haiku-4-5-20251001**: 7 agent · 25 calls · out 2,118 · in 214 · cache_read 1,349,817 · cache_create 447,740

