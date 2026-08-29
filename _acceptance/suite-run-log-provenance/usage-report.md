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

### S4 round 3 — wf_96353082-089 (29 agent, 184,262 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5 | 23 | 28,939 | 46 | 2,435,399 | 458 |
| review:conventions | claude-opus-5 | 37 | 25,933 | 74 | 5,122,713 | 680 |
| review:bugs | claude-opus-5 | 34 | 24,195 | 68 | 3,993,390 | 395 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 9 | 10,967 | 18 | 632,847 | 161 |
| triage | claude-sonnet-5 | 2 | 10,434 | 4 | 67,365 | 108 |
| refute:gate-card.js | claude-sonnet-5 | 20 | 10,205 | 40 | 1,663,049 | 185 |
| refute:run-tests.sh | claude-sonnet-5 | 12 | 10,178 | 24 | 853,725 | 129 |
| refute:rang.sh | claude-sonnet-5 | 18 | 10,076 | 36 | 1,274,485 | 143 |
| refute:run-tests.sh | claude-sonnet-5 | 11 | 8,576 | 22 | 729,771 | 115 |
| refute:gate-card.js | claude-sonnet-5 | 19 | 8,079 | 38 | 1,405,599 | 131 |
| refute:rang.sh | claude-sonnet-5 | 7 | 7,906 | 14 | 456,444 | 114 |
| refute:evidence-page.js | claude-sonnet-5 | 17 | 5,402 | 34 | 1,189,155 | 545 |
| refute:rang.sh | claude-sonnet-5 | 8 | 3,584 | 16 | 502,527 | 66 |
| refute:rang.sh | claude-sonnet-5 | 7 | 3,258 | 14 | 441,533 | 48 |
| baseline:diffBase | claude-sonnet-5 | 6 | 2,735 | 12 | 332,912 | 52 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,707 | 50 | 241,445 | 216 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,374 | 42 | 230,433 | 330 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,361 | 18 | 65,989 | 20 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 1,199 | 18 | 66,005 | 20 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 3 | 1,104 | 26 | 111,578 | 23 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 1,086 | 18 | 66,004 | 17 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 961 | 18 | 66,007 | 20 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 943 | 26 | 112,209 | 19 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 857 | 18 | 66,009 | 16 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 836 | 18 | 66,009 | 16 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 809 | 18 | 66,005 | 17 |
| capture:provenance | claude-sonnet-5 | 2 | 740 | 4 | 60,776 | 11 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 676 | 18 | 65,996 | 10 |
| synthesize:report | claude-sonnet-5 | 2 | 142 | 4 | 77,472 | 181 |

- **claude-opus-5**: 3 agent · 94 calls · out 79,067 · in 188 · cache_read 11,551,502 · cache_create 440,130
- **claude-sonnet-5**: 14 agent · 140 calls · out 92,282 · in 280 · cache_read 9,687,660 · cache_create 869,471
- **claude-haiku-4-5-20251001**: 12 agent · 33 calls · out 12,913 · in 288 · cache_read 1,223,689 · cache_create 341,032

### S4 round 4 — wf_b952a6ec-19c (34 agent, 261,104 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5 | 59 | 35,015 | 118 | 7,803,637 | 1129 |
| review:conventions | claude-opus-5 | 35 | 31,202 | 70 | 4,272,238 | 568 |
| review:measurement | claude-opus-5 | 36 | 30,881 | 72 | 3,808,354 | 1132 |
| triage | claude-sonnet-5 | 2 | 23,775 | 4 | 70,456 | 262 |
| synthesize:report | claude-sonnet-5 | 3 | 21,728 | 6 | 173,742 | 232 |
| refute:acceptance-gold.mjs | claude-sonnet-5 | 16 | 11,070 | 32 | 1,187,542 | 155 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 19 | 10,842 | 38 | 1,500,924 | 155 |
| refute:evidence-report.md | claude-sonnet-5 | 26 | 10,073 | 52 | 2,082,453 | 169 |
| refute:evidence-report.md | claude-sonnet-5 | 14 | 8,373 | 28 | 1,079,755 | 124 |
| refute:rang.sh | claude-sonnet-5 | 17 | 8,212 | 34 | 1,194,141 | 128 |
| refute:evidence-report-template.md | claude-sonnet-5 | 9 | 6,249 | 18 | 549,509 | 87 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 14 | 6,100 | 28 | 1,009,260 | 98 |
| refute:run-tests.sh | claude-sonnet-5 | 13 | 6,009 | 26 | 887,682 | 382 |
| refute:rang.sh | claude-sonnet-5 | 8 | 5,941 | 16 | 522,289 | 78 |
| refute:evidence-report.md | claude-sonnet-5 | 9 | 5,797 | 18 | 628,413 | 109 |
| refute:rang.sh | claude-sonnet-5 | 7 | 5,688 | 14 | 444,912 | 84 |
| refute:rang.sh | claude-sonnet-5 | 13 | 5,647 | 26 | 1,021,867 | 86 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 12 | 5,520 | 24 | 812,783 | 97 |
| baseline:diffBase | claude-sonnet-5 | 6 | 3,349 | 12 | 340,794 | 50 |
| refute:rang.sh | claude-sonnet-5 | 3 | 2,966 | 6 | 166,109 | 87 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 2,808 | 18 | 42,865 | 35 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,568 | 42 | 247,677 | 225 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 1,539 | 18 | 66,004 | 25 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,487 | 50 | 186,960 | 684 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,396 | 42 | 209,867 | 25 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 1,309 | 18 | 66,004 | 20 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 3 | 1,136 | 26 | 111,363 | 18 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 1,117 | 18 | 66,005 | 18 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 968 | 18 | 66,009 | 19 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 815 | 18 | 66,009 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 735 | 18 | 65,989 | 14 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 728 | 18 | 66,005 | 17 |
| capture:provenance | claude-sonnet-5 | 2 | 649 | 4 | 60,776 | 12 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 412 | 18 | 66,007 | 20 |

- **claude-opus-5**: 3 agent · 130 calls · out 97,098 · in 260 · cache_read 15,884,229 · cache_create 461,595
- **claude-sonnet-5**: 18 agent · 193 calls · out 147,988 · in 386 · cache_read 13,733,407 · cache_create 1,151,537
- **claude-haiku-4-5-20251001**: 13 agent · 37 calls · out 16,018 · in 322 · cache_read 1,326,764 · cache_create 414,261

### S4 round 5 — wf_b9f71d58-7c4 (26 agent, 161,643 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5 | 38 | 31,622 | 76 | 4,764,660 | 522 |
| review:measurement | claude-opus-5 | 21 | 29,028 | 42 | 2,140,286 | 473 |
| review:conventions | claude-opus-5 | 27 | 28,002 | 54 | 3,098,418 | 435 |
| refute:rang.sh | claude-sonnet-5 | 6 | 11,578 | 12 | 373,546 | 141 |
| refute:run-tests.sh | claude-sonnet-5 | 18 | 8,569 | 36 | 1,420,945 | 132 |
| triage | claude-sonnet-5 | 2 | 7,463 | 4 | 67,575 | 91 |
| refute:evidence-page.js | claude-sonnet-5 | 13 | 6,680 | 26 | 910,505 | 89 |
| synthesize:report | claude-sonnet-5 | 3 | 5,773 | 6 | 165,292 | 108 |
| refute:run-tests.sh | claude-sonnet-5 | 9 | 5,722 | 18 | 661,213 | 101 |
| refute:rang.sh | claude-sonnet-5 | 10 | 5,621 | 20 | 675,127 | 79 |
| baseline:diffBase | claude-sonnet-5 | 6 | 3,580 | 12 | 329,370 | 49 |
| refute:acceptance-verify.js | claude-sonnet-5 | 4 | 2,588 | 8 | 227,010 | 32 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 7 | 2,414 | 58 | 302,152 | 40 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 2,093 | 42 | 139,551 | 645 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,339 | 50 | 253,946 | 27 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,255 | 42 | 228,024 | 215 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 1,179 | 18 | 66,004 | 20 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 1,113 | 18 | 66,007 | 20 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 1,032 | 18 | 66,004 | 16 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,023 | 18 | 42,850 | 15 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 3 | 877 | 26 | 111,378 | 14 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 869 | 18 | 66,005 | 17 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 679 | 18 | 66,005 | 16 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 639 | 18 | 66,004 | 14 |
| capture:provenance | claude-sonnet-5 | 2 | 458 | 4 | 60,776 | 9 |
| machine:bash _acceptance/suite-run-log-provenanc | claude-haiku-4-5-20251001 | 2 | 447 | 18 | 66,009 | 16 |

- **claude-opus-5**: 3 agent · 86 calls · out 88,652 · in 172 · cache_read 10,003,364 · cache_create 426,821
- **claude-sonnet-5**: 10 agent · 73 calls · out 58,032 · in 146 · cache_read 4,891,359 · cache_create 670,587
- **claude-haiku-4-5-20251001**: 13 agent · 42 calls · out 14,959 · in 362 · cache_read 1,539,939 · cache_create 405,699

