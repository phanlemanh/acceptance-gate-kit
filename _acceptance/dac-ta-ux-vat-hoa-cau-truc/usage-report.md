### S4 round 1 — wf_02220f94-0da (27 agent, 215,560 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 3 | 29,607 | 6 | 156,785 | 301 |
| review:measurement | claude-fable-5 | 12 | 21,253 | 24 | 960,217 | 316 |
| triage | claude-sonnet-5 | 2 | 20,940 | 4 | 59,029 | 235 |
| review:conventions | claude-fable-5 | 19 | 19,571 | 38 | 1,720,580 | 455 |
| review:bugs | claude-fable-5 | 16 | 17,558 | 32 | 1,414,732 | 345 |
| judge:E11:spec-alignment | claude-sonnet-5 | 4 | 10,911 | 8 | 260,465 | 133 |
| judge:E11:operational-feasibility | claude-sonnet-5 | 4 | 9,573 | 8 | 260,468 | 124 |
| refute:eval-coverage-lint.js | claude-sonnet-5 | 14 | 9,110 | 28 | 928,053 | 127 |
| refute:eval-coverage-lint.js | claude-sonnet-5 | 14 | 8,874 | 28 | 965,716 | 121 |
| judge:E11:domain-correctness | claude-sonnet-5 | 6 | 7,974 | 12 | 353,439 | 110 |
| judge:E5:domain-correctness | claude-sonnet-5 | 2 | 7,554 | 4 | 53,729 | 88 |
| judge:E5:spec-alignment | claude-sonnet-5 | 3 | 7,075 | 6 | 165,994 | 86 |
| judge:E5:operational-feasibility | claude-sonnet-5 | 3 | 6,725 | 6 | 165,998 | 76 |
| refute:eval-coverage-lint.js | claude-sonnet-5 | 20 | 6,269 | 40 | 1,395,535 | 109 |
| refute:run-tests.sh | claude-sonnet-5 | 12 | 6,167 | 24 | 709,065 | 82 |
| refute:evals.yaml | claude-sonnet-5 | 7 | 4,318 | 14 | 401,676 | 60 |
| refute:ux-spec.test.mjs | claude-sonnet-5 | 8 | 3,724 | 16 | 491,324 | 52 |
| refute:evals.yaml | claude-sonnet-5 | 13 | 3,467 | 26 | 837,297 | 60 |
| refute:evals.yaml | claude-sonnet-5 | 3 | 2,530 | 6 | 143,186 | 33 |
| refute:evals.yaml | claude-sonnet-5 | 6 | 2,528 | 12 | 321,728 | 35 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 2,391 | 42 | 181,749 | 188 |
| baseline:diffBase | claude-sonnet-5 | 8 | 1,656 | 16 | 431,931 | 316 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,587 | 50 | 202,746 | 428 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,315 | 18 | 58,157 | 17 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,276 | 34 | 140,021 | 18 |
| capture:provenance | claude-sonnet-5 | 2 | 822 | 4 | 52,990 | 12 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 785 | 18 | 58,164 | 11 |

- **claude-sonnet-5**: 19 agent · 134 calls · out 149,824 · in 268 · cache_read 8,154,408 · cache_create 1,151,709
- **claude-fable-5**: 3 agent · 47 calls · out 58,382 · in 94 · cache_read 4,095,529 · cache_create 301,882
- **claude-haiku-4-5-20251001**: 5 agent · 19 calls · out 7,354 · in 162 · cache_read 640,837 · cache_create 125,232

### S4 round 2 — wf_8de16a84-b9c (30 agent, 220,263 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 6 | 24,029 | 12 | 459,028 | 246 |
| review:conventions | claude-opus-5 | 25 | 19,012 | 50 | 2,405,403 | 316 |
| review:measurement | claude-opus-5 | 10 | 18,441 | 20 | 796,422 | 342 |
| judge:E11:spec-alignment | claude-sonnet-5 | 5 | 17,341 | 10 | 298,266 | 212 |
| judge:E11:operational-feasibility | claude-sonnet-5 | 6 | 16,318 | 12 | 380,533 | 198 |
| review:bugs | claude-opus-5 | 30 | 16,015 | 60 | 2,862,800 | 389 |
| judge:E11:domain-correctness | claude-sonnet-5 | 8 | 12,441 | 16 | 574,811 | 223 |
| triage | claude-sonnet-5 | 2 | 10,601 | 4 | 60,459 | 120 |
| refute:ux-spec.test.mjs | claude-sonnet-5 | 6 | 8,783 | 12 | 355,462 | 102 |
| refute:SKILL.md | claude-sonnet-5 | 9 | 8,340 | 18 | 598,174 | 118 |
| refute:ux-spec.test.mjs | claude-sonnet-5 | 8 | 8,302 | 16 | 496,064 | 93 |
| judge:E5:operational-feasibility | claude-sonnet-5 | 2 | 8,247 | 4 | 81,274 | 93 |
| judge:E5:domain-correctness | claude-sonnet-5 | 3 | 6,137 | 6 | 138,832 | 72 |
| judge:E5:spec-alignment | claude-sonnet-5 | 3 | 5,831 | 6 | 142,105 | 67 |
| refute:ux-spec.test.mjs | claude-sonnet-5 | 6 | 5,359 | 12 | 356,354 | 69 |
| refute:ux-spec.test.mjs | claude-sonnet-5 | 7 | 5,051 | 14 | 382,101 | 62 |
| refute:eval-coverage-lint.js | claude-sonnet-5 | 11 | 5,005 | 22 | 672,057 | 70 |
| refute:eval-coverage-lint.js | claude-sonnet-5 | 14 | 4,769 | 28 | 879,442 | 69 |
| refute:eval-coverage-lint.js | claude-sonnet-5 | 11 | 3,777 | 22 | 594,112 | 9974 |
| refute:eval-coverage-lint.js | claude-sonnet-5 | 9 | 3,524 | 18 | 570,223 | 48 |
| refute:eval-coverage-lint.js | claude-sonnet-5 | 6 | 3,031 | 12 | 316,314 | 42 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 2,066 | 42 | 181,900 | 29 |
| baseline:diffBase | claude-sonnet-5 | 6 | 1,832 | 12 | 322,998 | 351 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,290 | 42 | 181,007 | 205 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,283 | 50 | 225,314 | 493 |
| refute:evals.yaml | claude-sonnet-5 | 5 | 1,088 | 10 | 268,832 | 40 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 847 | 18 | 58,160 | 12 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 640 | 18 | 58,153 | 12 |
| capture:provenance | claude-sonnet-5 | 2 | 522 | 4 | 52,990 | 9 |
| refute:eval-coverage-lint.js | claude-sonnet-5 | 4 | 341 | 8 | 224,844 | 44 |

- **claude-sonnet-5**: 22 agent · 139 calls · out 160,669 · in 278 · cache_read 8,225,275 · cache_create 1,260,965
- **claude-opus-5**: 3 agent · 65 calls · out 53,468 · in 130 · cache_read 6,064,625 · cache_create 341,133
- **claude-haiku-4-5-20251001**: 5 agent · 20 calls · out 6,126 · in 170 · cache_read 704,534 · cache_create 106,358

