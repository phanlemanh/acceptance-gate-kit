### S4 round 1 — wf_68e342cb-e5e (20 agent, 104,459 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:claim-scan.test.mjs | claude-sonnet-5 | 28 | 19,170 | 56 | 1,888,090 | 336 |
| review:conventions | claude-opus-5 | 31 | 17,124 | 59 | 2,337,232 | 384 |
| refute:md-section.js | claude-sonnet-5 | 19 | 14,356 | 669 | 1,193,052 | 220 |
| review:bugs | claude-opus-5 | 22 | 13,807 | 42 | 1,403,121 | 255 |
| refute:md-section.js | claude-sonnet-5 | 12 | 7,849 | 24 | 619,796 | 148 |
| judge:E10:spec-alignment | claude-sonnet-5 | 12 | 6,040 | 24 | 807,184 | 109 |
| refute:md-section.js | claude-sonnet-5 | 9 | 5,128 | 18 | 423,228 | 84 |
| judge:E10:operational-feasibility | claude-sonnet-5 | 4 | 4,833 | 8 | 204,653 | 65 |
| judge:E10:domain-correctness | claude-sonnet-5 | 5 | 4,496 | 2,857 | 220,104 | 58 |
| refute:contract.md | claude-sonnet-5 | 9 | 3,635 | 18 | 541,827 | 65 |
| refute:run-tests.sh | claude-sonnet-5 | 5 | 2,682 | 344 | 212,830 | 70 |
| baseline:diffBase | claude-sonnet-5 | 12 | 2,367 | 24 | 556,694 | 110 |
| capture:provenance | claude-sonnet-5 | 3 | 702 | 6 | 91,704 | 16 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 676 | 26 | 75,452 | 60 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 475 | 18 | 44,480 | 11 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 473 | 18 | 44,484 | 10 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 402 | 18 | 44,480 | 13 |
| synthesize:report | claude-sonnet-5 | 2 | 135 | 4 | 55,182 | 127 |
| triage | claude-sonnet-5 | 2 | 103 | 4 | 47,860 | 110 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 6 | 18 | 44,480 | 60 |

- **claude-sonnet-5**: 13 agent · 122 calls · out 71,496 · in 4,056 · cache_read 6,862,204 · cache_create 680,279
- **claude-opus-5**: 2 agent · 53 calls · out 30,931 · in 101 · cache_read 3,740,353 · cache_create 185,322
- **claude-haiku-4-5-20251001**: 5 agent · 11 calls · out 2,032 · in 98 · cache_read 253,376 · cache_create 97,158

### S4 round 3 — wf_69887eab-a0f (21 agent, 135,421 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 18 | 19,572 | 36 | 1,683,349 | 351 |
| review:bugs | claude-opus-5 | 27 | 19,199 | 52 | 1,779,809 | 464 |
| review:conventions | claude-opus-5 | 18 | 17,185 | 34 | 1,147,920 | 282 |
| refute:claim-scan.test.mjs | claude-sonnet-5 | 9 | 12,592 | 18 | 451,192 | 169 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 13 | 12,139 | 63 | 752,619 | 162 |
| triage | claude-sonnet-5 | 2 | 10,508 | 4 | 48,662 | 120 |
| refute:eval-coverage-lint.js | claude-sonnet-5 | 14 | 9,940 | 28 | 777,862 | 136 |
| judge:E10:spec-alignment | claude-sonnet-5 | 2 | 6,485 | 4 | 43,391 | 75 |
| refute:run-tests.sh | claude-sonnet-5 | 8 | 5,182 | 16 | 379,507 | 87 |
| refute:md-section.js | claude-sonnet-5 | 10 | 4,728 | 20 | 480,924 | 79 |
| refute:md-section.js | claude-sonnet-5 | 7 | 4,582 | 14 | 317,255 | 72 |
| refute:claim-scan.test.mjs | claude-sonnet-5 | 4 | 2,856 | 8 | 166,711 | 62 |
| judge:E10:operational-feasibility | claude-sonnet-5 | 8 | 2,668 | 136 | 379,792 | 50 |
| refute:md-section.js | claude-sonnet-5 | 10 | 1,898 | 20 | 477,479 | 85 |
| judge:E10:domain-correctness | claude-sonnet-5 | 5 | 1,857 | 10 | 267,884 | 71 |
| capture:provenance | claude-sonnet-5 | 2 | 862 | 4 | 43,194 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 798 | 18 | 28,131 | 12 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 765 | 34 | 107,899 | 105 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 628 | 18 | 28,131 | 57 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 505 | 18 | 28,135 | 11 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 472 | 18 | 28,131 | 12 |

- **claude-sonnet-5**: 14 agent · 112 calls · out 95,869 · in 381 · cache_read 6,269,821 · cache_create 832,313
- **claude-opus-5**: 2 agent · 45 calls · out 36,384 · in 86 · cache_read 2,927,729 · cache_create 178,681
- **claude-haiku-4-5-20251001**: 5 agent · 12 calls · out 3,168 · in 106 · cache_read 220,427 · cache_create 180,125

