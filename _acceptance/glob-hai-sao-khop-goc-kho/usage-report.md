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

### S4 round 2 — wf_d5f199c5-fd0 (17 agent, 46,769 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 11,333 | 4 | 82,656 | 114 |
| review:measurement | claude-fable-5-1 | 10 | 7,168 | 290 | 865,051 | 246 |
| triage | claude-sonnet-5 | 2 | 7,123 | 4 | 74,669 | 88 |
| review:conventions | claude-fable-5-1 | 10 | 4,876 | 290 | 792,198 | 503 |
| refute:acceptance-verify.js | claude-sonnet-5 | 16 | 3,013 | 32 | 1,302,207 | 125 |
| refute:evidence-report.md | claude-sonnet-5 | 23 | 2,765 | 46 | 2,157,652 | 353 |
| refute:evidence-report.md | claude-sonnet-5 | 9 | 2,260 | 18 | 693,567 | 167 |
| refute:GUIDE.md | claude-sonnet-5 | 6 | 2,147 | 12 | 429,954 | 67 |
| review:bugs | claude-fable-5-1 | 8 | 1,494 | 226 | 599,051 | 564 |
| refute:evals.yaml | claude-sonnet-5 | 10 | 1,027 | 20 | 803,040 | 119 |
| capture:provenance | claude-sonnet-5 | 2 | 952 | 4 | 70,898 | 12 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 916 | 18 | 80,169 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 643 | 50 | 304,689 | 27 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 591 | 58 | 332,692 | 425 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 284 | 34 | 140,654 | 720 |
| refute:run-tests.sh | claude-sonnet-5 | 4 | 172 | 8 | 228,484 | 62 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 5 | 18 | 80,176 | 10 |

- **claude-sonnet-5**: 9 agent · 74 calls · out 30,792 · in 148 · cache_read 5,843,127 · cache_create 662,987
- **claude-fable-5-1**: 3 agent · 28 calls · out 13,538 · in 806 · cache_read 2,256,300 · cache_create 249,493
- **claude-haiku-4-5-20251001**: 5 agent · 21 calls · out 2,439 · in 178 · cache_read 938,380 · cache_create 219,274

### S4 round 3 — wf_47be1da5-c0a (15 agent, 38,803 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| triage | claude-sonnet-5 | 2 | 10,151 | 4 | 74,506 | 126 |
| refute:evidence-report.md | claude-sonnet-5 | 16 | 6,982 | 32 | 1,454,226 | 528 |
| synthesize:report | claude-sonnet-5 | 3 | 4,695 | 6 | 174,337 | 145 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 14 | 3,097 | 28 | 1,172,120 | 220 |
| review:bugs | claude-fable-5-1 | 15 | 3,062 | 450 | 1,314,609 | 428 |
| refute:run-tests.sh | claude-sonnet-5 | 14 | 3,056 | 28 | 1,134,743 | 136 |
| review:conventions | claude-fable-5-1 | 13 | 2,055 | 386 | 1,126,817 | 436 |
| refute:evidence-report.md | claude-sonnet-5 | 14 | 1,879 | 28 | 1,153,248 | 150 |
| review:measurement | claude-fable-5-1 | 8 | 1,301 | 226 | 607,454 | 173 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 901 | 18 | 80,169 | 16 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 557 | 34 | 190,790 | 418 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 377 | 18 | 80,176 | 15 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 368 | 26 | 83,465 | 368 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 315 | 26 | 135,156 | 19 |
| capture:provenance | claude-sonnet-5 | 2 | 7 | 4 | 70,898 | 10 |

- **claude-sonnet-5**: 7 agent · 65 calls · out 29,867 · in 130 · cache_read 5,234,078 · cache_create 570,221
- **claude-fable-5-1**: 3 agent · 36 calls · out 6,418 · in 1,062 · cache_read 3,048,880 · cache_create 254,404
- **claude-haiku-4-5-20251001**: 5 agent · 14 calls · out 2,518 · in 122 · cache_read 569,756 · cache_create 205,494

