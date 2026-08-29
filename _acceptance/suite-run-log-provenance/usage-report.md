### S4 round 1 — wf_667e5a24-bef (31 agent, 238,358 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5 | 36 | 30,592 | 72 | 4,539,496 | 495 |
| review:measurement | claude-opus-5 | 25 | 23,431 | 50 | 2,435,262 | 395 |
| review:conventions | claude-opus-5 | 30 | 21,049 | 60 | 3,150,142 | 358 |
| synthesize:report | claude-sonnet-5 | 2 | 20,217 | 4 | 78,802 | 214 |
| refute:acceptance-verify.js | claude-sonnet-5 | 19 | 19,900 | 38 | 1,649,413 | 281 |
| triage | claude-sonnet-5 | 3 | 15,810 | 6 | 146,711 | 185 |
| refute:acceptance-verify.js | claude-sonnet-5 | 14 | 14,249 | 28 | 1,062,725 | 172 |
| refute:rang.sh | claude-sonnet-5 | 14 | 13,916 | 28 | 1,106,282 | 203 |
| refute:acceptance-verify.js | claude-sonnet-5 | 22 | 12,566 | 44 | 1,752,631 | 198 |
| refute:evals.yaml | claude-sonnet-5 | 11 | 10,378 | 22 | 821,483 | 132 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 13 | 9,749 | 26 | 1,023,350 | 135 |
| refute:rang.sh | claude-sonnet-5 | 14 | 7,668 | 28 | 996,444 | 108 |
| refute:rang.sh | claude-sonnet-5 | 10 | 6,675 | 20 | 704,037 | 94 |
| refute:evals.yaml | claude-sonnet-5 | 8 | 4,336 | 16 | 538,259 | 65 |
| refute:rang.sh | claude-sonnet-5 | 8 | 4,038 | 16 | 530,743 | 62 |
| refute:acceptance-verify.js | claude-sonnet-5 | 6 | 3,973 | 12 | 365,776 | 56 |
| refute:acceptance-verify.js | claude-sonnet-5 | 6 | 3,952 | 12 | 389,679 | 55 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 2,493 | 50 | 326,904 | 216 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,882 | 42 | 213,938 | 318 |
| baseline:diffBase | claude-sonnet-5 | 6 | 1,788 | 12 | 329,701 | 39 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 1,429 | 18 | 66,004 | 19 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 1,315 | 18 | 66,004 | 17 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,210 | 26 | 112,326 | 18 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 1,065 | 18 | 66,007 | 15 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 942 | 18 | 42,866 | 15 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 898 | 18 | 66,009 | 13 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 753 | 18 | 66,005 | 15 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 3 | 614 | 26 | 111,389 | 14 |
| capture:provenance | claude-sonnet-5 | 3 | 595 | 6 | 134,080 | 11 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 465 | 18 | 66,009 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 410 | 18 | 65,989 | 12 |

- **claude-opus-5**: 3 agent · 91 calls · out 75,072 · in 182 · cache_read 10,124,900 · cache_create 404,019
- **claude-sonnet-5**: 16 agent · 159 calls · out 149,810 · in 318 · cache_read 11,630,116 · cache_create 1,095,965
- **claude-haiku-4-5-20251001**: 12 agent · 33 calls · out 13,476 · in 288 · cache_read 1,269,450 · cache_create 346,799

### S4 round 2 — wf_4d319bc9-63c (26 agent, 214,794 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5 | 42 | 33,316 | 84 | 5,363,300 | 529 |
| review:conventions | claude-opus-5 | 28 | 28,200 | 56 | 3,329,289 | 457 |
| synthesize:report | claude-sonnet-5 | 4 | 24,404 | 8 | 261,220 | 276 |
| refute:acceptance-verify.js | claude-sonnet-5 | 14 | 23,258 | 28 | 1,068,857 | 300 |
| refute:run-log.jsonl | claude-sonnet-5 | 21 | 19,355 | 42 | 2,046,584 | 253 |
| review:measurement | claude-opus-5 | 13 | 19,321 | 26 | 1,096,806 | 312 |
| refute:evals.yaml | claude-sonnet-5 | 9 | 12,092 | 18 | 645,104 | 157 |
| refute:contract.md | claude-sonnet-5 | 16 | 9,494 | 32 | 1,184,872 | 141 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 12 | 8,541 | 24 | 895,603 | 113 |
| refute:evidence-report-template.md | claude-sonnet-5 | 12 | 7,364 | 24 | 820,228 | 129 |
| triage | claude-sonnet-5 | 2 | 6,751 | 4 | 67,512 | 84 |
| refute:evidence-page.js | claude-sonnet-5 | 8 | 5,389 | 16 | 536,514 | 69 |
| refute:rang.sh | claude-sonnet-5 | 7 | 3,350 | 14 | 415,088 | 49 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,817 | 34 | 175,681 | 310 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,561 | 50 | 260,834 | 29 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 5 | 1,265 | 42 | 204,291 | 24 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,245 | 18 | 65,989 | 17 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,184 | 42 | 206,730 | 208 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 1,096 | 18 | 66,005 | 18 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 1,088 | 18 | 66,007 | 18 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 1,023 | 18 | 66,009 | 17 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 925 | 18 | 66,004 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 812 | 18 | 65,996 | 12 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 768 | 18 | 42,866 | 15 |
| capture:provenance | claude-sonnet-5 | 2 | 648 | 4 | 60,776 | 10 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 527 | 18 | 66,004 | 18 |

- **claude-opus-5**: 3 agent · 83 calls · out 80,837 · in 166 · cache_read 9,789,395 · cache_create 404,789
- **claude-sonnet-5**: 11 agent · 107 calls · out 120,646 · in 214 · cache_read 8,002,358 · cache_create 787,408
- **claude-haiku-4-5-20251001**: 12 agent · 36 calls · out 13,311 · in 312 · cache_read 1,352,416 · cache_create 323,988

