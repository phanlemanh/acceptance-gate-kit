### S4 round 5 (delta premerge-rules-ledger) — wf_60bbdc4f-42d (16 agent, 78,451 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 23 | 16,124 | 44 | 3,049,442 | 429 |
| synthesize:report | claude-sonnet-5 | 8 | 15,861 | 16 | 808,204 | 184 |
| review:conventions | claude-fable-5 | 14 | 13,364 | 27 | 1,464,344 | 295 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 16 | 9,402 | 32 | 1,425,088 | 151 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 5 | 3,859 | 10 | 325,062 | 61 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 6 | 3,642 | 12 | 419,940 | 62 |
| refute:run-tests.sh | claude-sonnet-5 | 8 | 2,664 | 16 | 587,047 | 58 |
| judge:E9:operational-feasibility | claude-sonnet-5 | 3 | 2,577 | 6 | 154,689 | 44 |
| judge:E9:spec-alignment | claude-sonnet-5 | 3 | 2,417 | 6 | 154,687 | 43 |
| scribe:run-log | claude-haiku-4-5-20251001 | 5 | 2,273 | 42 | 239,690 | 31 |
| judge:E9:domain-correctness | claude-sonnet-5 | 2 | 2,088 | 4 | 75,277 | 30 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 8 | 1,774 | 66 | 431,554 | 113 |
| capture:provenance | claude-sonnet-5 | 2 | 1,177 | 4 | 75,324 | 16 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 780 | 18 | 55,765 | 16 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 257 | 18 | 55,765 | 36 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 192 | 18 | 55,769 | 10 |

- **claude-fable-5**: 2 agent · 37 calls · out 29,488 · in 71 · cache_read 4,513,786 · cache_create 308,800
- **claude-sonnet-5**: 9 agent · 53 calls · out 43,687 · in 106 · cache_read 4,025,318 · cache_create 772,118
- **claude-haiku-4-5-20251001**: 5 agent · 19 calls · out 5,276 · in 162 · cache_read 838,543 · cache_create 305,396

### S4 round 6 (delta fix leftover) — wf_ec7d883f-6be (16 agent, 79,505 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 25 | 22,187 | 48 | 3,453,146 | 508 |
| review:conventions | claude-fable-5 | 11 | 17,700 | 21 | 1,046,481 | 283 |
| synthesize:report | claude-sonnet-5 | 8 | 13,646 | 16 | 840,167 | 167 |
| refute:gate.yml | claude-sonnet-5 | 13 | 5,753 | 26 | 1,050,846 | 109 |
| refute:gate.yml | claude-sonnet-5 | 12 | 5,015 | 61 | 1,013,776 | 98 |
| refute:acceptance-init.md | claude-sonnet-5 | 8 | 3,326 | 16 | 646,610 | 89 |
| scribe:run-log | claude-haiku-4-5-20251001 | 4 | 2,772 | 34 | 178,693 | 41 |
| refute:acceptance-init.md | claude-sonnet-5 | 6 | 2,646 | 12 | 430,633 | 58 |
| judge:E9:spec-alignment | claude-sonnet-5 | 2 | 1,305 | 4 | 75,277 | 20 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,249 | 34 | 176,085 | 68 |
| judge:E9:operational-feasibility | claude-sonnet-5 | 2 | 1,065 | 4 | 98,363 | 31 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 831 | 18 | 55,765 | 16 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 752 | 18 | 55,769 | 13 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 639 | 18 | 73,127 | 38 |
| capture:provenance | claude-sonnet-5 | 2 | 412 | 4 | 75,324 | 12 |
| judge:E9:domain-correctness | claude-sonnet-5 | 2 | 207 | 4 | 75,277 | 36 |

- **claude-fable-5**: 2 agent · 36 calls · out 39,887 · in 69 · cache_read 4,499,627 · cache_create 278,922
- **claude-sonnet-5**: 9 agent · 55 calls · out 33,375 · in 147 · cache_read 4,306,273 · cache_create 753,297
- **claude-haiku-4-5-20251001**: 5 agent · 14 calls · out 6,243 · in 122 · cache_read 539,439 · cache_create 296,650

### S4 round 7 (re-pin, carry 19+panel) — wf_b08fc060-f8b (13 agent, 92,630 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 25 | 29,122 | 48 | 3,256,282 | 552 |
| review:conventions | claude-fable-5 | 23 | 16,974 | 44 | 2,940,275 | 460 |
| refute:SKILL.md | claude-sonnet-5 | 14 | 12,376 | 28 | 1,227,293 | 198 |
| synthesize:report | claude-sonnet-5 | 12 | 11,833 | 24 | 1,219,855 | 241 |
| refute:GUIDE.md | claude-sonnet-5 | 12 | 9,896 | 2,752 | 1,015,764 | 169 |
| refute:README.md | claude-sonnet-5 | 7 | 3,277 | 14 | 553,763 | 77 |
| scribe:run-log | claude-haiku-4-5-20251001 | 6 | 2,891 | 50 | 304,068 | 40 |
| refute:acceptance-init.md | claude-sonnet-5 | 6 | 1,948 | 12 | 400,653 | 60 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,207 | 42 | 241,244 | 106 |
| capture:provenance | claude-sonnet-5 | 3 | 1,001 | 6 | 156,365 | 19 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 863 | 18 | 55,765 | 41 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 778 | 18 | 55,765 | 16 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 464 | 18 | 55,769 | 10 |

- **claude-fable-5**: 2 agent · 48 calls · out 46,096 · in 92 · cache_read 6,196,557 · cache_create 351,569
- **claude-sonnet-5**: 6 agent · 54 calls · out 40,331 · in 2,836 · cache_read 4,573,693 · cache_create 566,642
- **claude-haiku-4-5-20251001**: 5 agent · 17 calls · out 6,203 · in 146 · cache_read 712,611 · cache_create 304,929

### S4 round 9 (re-pin cuối) — wf_91838889-e5c (10 agent, 45,844 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 21 | 22,015 | 40 | 2,621,660 | 444 |
| review:conventions | claude-fable-5 | 20 | 10,397 | 38 | 2,343,324 | 207 |
| scribe:run-log | claude-haiku-4-5-20251001 | 4 | 4,150 | 34 | 182,823 | 44 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 12 | 3,175 | 24 | 1,079,619 | 152 |
| synthesize:report | claude-sonnet-5 | 8 | 2,367 | 12,747 | 839,828 | 199 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,046 | 42 | 235,296 | 101 |
| capture:provenance | claude-sonnet-5 | 2 | 746 | 4 | 75,845 | 15 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 694 | 18 | 56,063 | 41 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 685 | 18 | 56,063 | 15 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 569 | 18 | 73,560 | 11 |

- **claude-fable-5**: 2 agent · 41 calls · out 32,412 · in 78 · cache_read 4,964,984 · cache_create 305,342
- **claude-haiku-4-5-20251001**: 5 agent · 15 calls · out 7,144 · in 130 · cache_read 603,805 · cache_create 287,626
- **claude-sonnet-5**: 3 agent · 22 calls · out 6,288 · in 12,775 · cache_read 1,995,292 · cache_create 340,980

### S4 round 11 (staleness re-verify; 1 refuter chet vi API) — wf_75c7032d-47b (31 agent, 201,578 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5 | 32 | 29,319 | 61 | 4,456,362 | 547 |
| review:bugs | claude-opus-5 | 41 | 22,651 | 78 | 5,834,783 | 671 |
| refute:acceptance-verify.js | claude-sonnet-5 | 28 | 18,615 | 56 | 2,932,380 | 336 |
| refute:SKILL.md | claude-sonnet-5 | 12 | 15,745 | 24 | 1,056,175 | 227 |
| refute:acceptance-verify.js | claude-sonnet-5 | 23 | 10,924 | 46 | 1,751,232 | 222 |
| refute:acceptance-verify.js | claude-sonnet-5 | 13 | 9,917 | 26 | 1,157,576 | 195 |
| refute:acceptance-verify.js | claude-sonnet-5 | 14 | 8,377 | 28 | 1,183,263 | 166 |
| refute:gate-card.js | claude-sonnet-5 | 22 | 8,372 | 44 | 2,008,804 | 199 |
| refute:SKILL.md | claude-sonnet-5 | 12 | 7,273 | 24 | 954,454 | 146 |
| refute:acceptance-verify.js | claude-sonnet-5 | 12 | 7,234 | 24 | 997,195 | 153 |
| refute:acceptance-verify.js | claude-sonnet-5 | 18 | 6,294 | 242 | 1,574,641 | 170 |
| refute:SKILL.md | claude-sonnet-5 | 15 | 6,193 | 121 | 1,336,449 | 141 |
| synthesize:report | claude-sonnet-5 | 8 | 5,883 | 3,160 | 764,596 | 376 |
| refute:acceptance-verify.js | claude-sonnet-5 | 9 | 5,260 | 18 | 777,529 | 99 |
| refute:gate-card.js | claude-sonnet-5 | 11 | 5,252 | 22 | 849,231 | 113 |
| refute:gate-card.js | claude-sonnet-5 | 11 | 4,685 | 22 | 845,376 | 134 |
| refute:out-of-contract.js | claude-sonnet-5 | 11 | 4,582 | 22 | 887,343 | 92 |
| refute:out-of-contract.js | claude-sonnet-5 | 15 | 4,474 | 30 | 1,185,600 | 111 |
| refute:acceptance-verify.js | claude-sonnet-5 | 10 | 3,977 | 20 | 738,539 | 144 |
| refute:SKILL.md | claude-sonnet-5 | 8 | 3,897 | 16 | 580,080 | 82 |
| refute:acceptance-verify.js | claude-sonnet-5 | 12 | 2,769 | 24 | 1,047,977 | 157 |
| refute:gate-card.js | claude-sonnet-5 | 11 | 2,506 | 22 | 823,024 | 92 |
| refute:GUIDE.md | claude-sonnet-5 | 12 | 2,090 | 24 | 930,145 | 80 |
| baseline:diffBase | claude-sonnet-5 | 7 | 1,152 | 14 | 435,848 | 98 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,026 | 58 | 321,932 | 120 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 803 | 18 | 47,428 | 17 |
| capture:provenance | claude-sonnet-5 | 2 | 746 | 4 | 67,884 | 12 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 732 | 18 | 47,428 | 13 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 497 | 18 | 64,811 | 12 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 333 | 18 | 47,428 | 48 |
| refute:acceptance-verify.js | <synthetic> | 1 | 0 | 0 | 0 | 144 |

- **claude-opus-5**: 2 agent · 73 calls · out 51,970 · in 139 · cache_read 10,291,145 · cache_create 403,636
- **claude-sonnet-5**: 23 agent · 296 calls · out 146,217 · in 4,033 · cache_read 24,885,341 · cache_create 2,087,756
- **claude-haiku-4-5-20251001**: 5 agent · 15 calls · out 3,391 · in 130 · cache_read 529,027 · cache_create 225,617
- **<synthetic>**: 1 agent · 1 calls · out 0 · in 0 · cache_read 0 · cache_create 0

