### S4 round 1 — wf_ec658c5f-0c9 (33 agent, 257,709 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 18 | 42,465 | 36 | 1,936,589 | 410 |
| review:bugs | claude-opus-5 | 34 | 22,336 | 68 | 3,747,146 | 1032 |
| review:measurement | claude-opus-5 | 17 | 21,908 | 34 | 1,669,200 | 339 |
| review:conventions | claude-opus-5 | 23 | 17,865 | 46 | 2,457,524 | 278 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 13 | 15,945 | 26 | 1,092,295 | 168 |
| judge:E7:operational-feasibility | claude-sonnet-5 | 2 | 14,867 | 4 | 99,908 | 132 |
| judge:E7:spec-alignment | claude-sonnet-5 | 3 | 13,472 | 6 | 245,675 | 125 |
| refute:rang-ghim-lai.mjs | claude-sonnet-5 | 15 | 12,398 | 30 | 1,320,734 | 146 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 10 | 11,100 | 20 | 732,429 | 122 |
| triage | claude-sonnet-5 | 2 | 11,085 | 4 | 73,182 | 109 |
| judge:E7:domain-correctness | claude-sonnet-5 | 4 | 10,950 | 8 | 361,588 | 105 |
| refute:contract.md | claude-sonnet-5 | 9 | 8,090 | 18 | 645,369 | 81 |
| baseline:diffBase | claude-sonnet-5 | 20 | 7,483 | 40 | 1,257,307 | 1003 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 8 | 7,224 | 16 | 558,225 | 82 |
| refute:contract.md | claude-sonnet-5 | 6 | 6,305 | 12 | 383,038 | 66 |
| refute:rang-ghim-lai.mjs | claude-sonnet-5 | 9 | 6,304 | 18 | 656,458 | 76 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 6 | 4,156 | 12 | 399,764 | 40 |
| refute:rang-so-tang.sh | claude-sonnet-5 | 10 | 3,665 | 20 | 633,709 | 44 |
| refute:rang-so-tang.sh | claude-sonnet-5 | 7 | 3,388 | 14 | 456,671 | 42 |
| refute:rang-so-tang.sh | claude-sonnet-5 | 5 | 3,014 | 10 | 311,325 | 37 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,712 | 50 | 197,511 | 497 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,612 | 42 | 215,946 | 24 |
| machine:bash _acceptance/release-2-16-0/rang-p20 | claude-haiku-4-5-20251001 | 2 | 1,555 | 18 | 70,498 | 23 |
| machine:node _acceptance/release-2-16-0/rang-ghi | claude-haiku-4-5-20251001 | 2 | 1,143 | 18 | 70,508 | 13 |
| machine:node _acceptance/release-2-16-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 1,061 | 18 | 70,505 | 13 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,002 | 18 | 70,484 | 14 |
| machine:node _acceptance/release-2-16-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 940 | 18 | 70,507 | 12 |
| machine:node _acceptance/release-2-16-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 924 | 18 | 70,507 | 13 |
| machine:bash _acceptance/release-2-16-0/rang-moc | claude-haiku-4-5-20251001 | 2 | 905 | 18 | 70,501 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 826 | 18 | 26,700 | 456 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 786 | 18 | 70,491 | 10 |
| capture:provenance | claude-sonnet-5 | 2 | 722 | 4 | 62,573 | 7 |
| machine:bash _acceptance/release-2-16-0/rang-so- | claude-haiku-4-5-20251001 | 2 | 501 | 18 | 70,499 | 12 |


wall: 1730s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,483 | 1,257,307 | 1003 | 03:11:11 | 03:27:54 |
| machine | 12 | 12,967 | 1,074,657 | 1002 | 03:11:11 | 03:27:53 |
| judge | 3 | 39,289 | 707,171 | 133 | 03:11:11 | 03:13:25 |
| review | 3 | 62,109 | 7,873,870 | 1034 | 03:11:11 | 03:28:25 |
| triage | 1 | 11,085 | 73,182 | 109 | 03:28:25 | 03:30:14 |
| refute | 11 | 81,589 | 7,190,017 | 169 | 03:30:14 | 03:33:04 |
| capture | 1 | 722 | 62,573 | 7 | 03:33:04 | 03:33:11 |
| synthesize | 1 | 42,465 | 1,936,589 | 410 | 03:33:11 | 03:40:01 |

- **claude-sonnet-5**: 18 agent · 149 calls · out 182,633 · in 298 · cache_read 11,226,839 · cache_create 1,535,754
- **claude-opus-5**: 3 agent · 74 calls · out 62,109 · in 148 · cache_read 7,873,870 · cache_create 500,437
- **claude-haiku-4-5-20251001**: 12 agent · 31 calls · out 12,967 · in 272 · cache_read 1,074,657 · cache_create 363,421

### S4 round 2 — wf_c9328847-607 (27 agent, 255,849 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 5 | 39,736 | 10 | 403,043 | 386 |
| review:measurement | claude-opus-5 | 20 | 28,538 | 40 | 2,308,615 | 445 |
| review:bugs | claude-opus-5 | 26 | 26,672 | 52 | 3,044,742 | 399 |
| review:conventions | claude-opus-5 | 18 | 25,055 | 36 | 1,909,804 | 378 |
| judge:E7:operational-feasibility | claude-sonnet-5 | 2 | 24,349 | 4 | 99,887 | 231 |
| judge:E7:domain-correctness | claude-sonnet-5 | 2 | 22,020 | 4 | 64,368 | 207 |
| triage | claude-sonnet-5 | 2 | 16,365 | 4 | 72,984 | 161 |
| judge:E7:spec-alignment | claude-sonnet-5 | 3 | 11,329 | 6 | 246,529 | 99 |
| refute:rang-ghim-lai.mjs | claude-sonnet-5 | 14 | 11,266 | 28 | 1,188,665 | 131 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 10 | 8,581 | 20 | 784,282 | 94 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 10 | 7,966 | 20 | 733,207 | 87 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 9 | 6,017 | 18 | 640,067 | 64 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 11 | 5,982 | 22 | 803,977 | 75 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 10 | 4,915 | 20 | 735,316 | 59 |
| refute:rang-ghim-lai.mjs | claude-sonnet-5 | 7 | 4,355 | 14 | 474,294 | 51 |
| baseline:diffBase | claude-sonnet-5 | 10 | 2,655 | 20 | 626,293 | 33 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,746 | 50 | 262,084 | 23 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,719 | 42 | 144,222 | 466 |
| machine:bash _acceptance/release-2-16-0/rang-so- | claude-haiku-4-5-20251001 | 2 | 1,035 | 18 | 70,480 | 13 |
| machine:node _acceptance/release-2-16-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 1,029 | 18 | 70,486 | 13 |
| machine:node _acceptance/release-2-16-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 927 | 18 | 70,488 | 11 |
| machine:node _acceptance/release-2-16-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 841 | 18 | 70,488 | 12 |
| capture:provenance | claude-sonnet-5 | 2 | 697 | 4 | 62,552 | 7 |
| machine:node _acceptance/release-2-16-0/rang-ghi | claude-haiku-4-5-20251001 | 2 | 598 | 18 | 70,489 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 562 | 18 | 70,472 | 7 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 495 | 18 | 70,465 | 17 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 399 | 18 | 26,700 | 427 |


wall: 1628s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,655 | 626,293 | 33 | 03:46:51 | 03:47:24 |
| machine | 10 | 9,351 | 926,374 | 941 | 03:46:51 | 04:02:32 |
| judge | 3 | 57,698 | 410,784 | 233 | 03:46:51 | 03:50:44 |
| review | 3 | 80,265 | 7,263,161 | 446 | 03:46:51 | 03:54:18 |
| triage | 1 | 16,365 | 72,984 | 161 | 04:02:32 | 04:05:14 |
| refute | 7 | 49,082 | 5,359,808 | 133 | 04:05:14 | 04:07:26 |
| capture | 1 | 697 | 62,552 | 7 | 04:07:26 | 04:07:34 |
| synthesize | 1 | 39,736 | 403,043 | 386 | 04:07:34 | 04:13:59 |

- **claude-sonnet-5**: 14 agent · 97 calls · out 166,233 · in 194 · cache_read 6,935,464 · cache_create 1,160,058
- **claude-opus-5**: 3 agent · 64 calls · out 80,265 · in 128 · cache_read 7,263,161 · cache_create 395,725
- **claude-haiku-4-5-20251001**: 10 agent · 27 calls · out 9,351 · in 236 · cache_read 926,374 · cache_create 318,653

### S4 round 3 — wf_f1b5ab40-41c (25 agent, 200,408 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 7 | 35,252 | 14 | 665,003 | 335 |
| review:bugs | claude-opus-5 | 30 | 29,881 | 60 | 3,657,814 | 450 |
| judge:E7:spec-alignment | claude-sonnet-5 | 2 | 28,693 | 4 | 99,893 | 256 |
| review:conventions | claude-opus-5 | 19 | 21,278 | 38 | 1,865,980 | 316 |
| review:measurement | claude-opus-5 | 13 | 17,863 | 26 | 1,192,122 | 273 |
| judge:E7:operational-feasibility | claude-sonnet-5 | 4 | 17,092 | 8 | 302,620 | 160 |
| judge:E7:domain-correctness | claude-sonnet-5 | 5 | 15,773 | 10 | 456,731 | 150 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 7 | 5,038 | 14 | 471,722 | 53 |
| refute:rang-ghim-lai.mjs | claude-sonnet-5 | 4 | 4,268 | 8 | 243,606 | 42 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 7 | 4,214 | 14 | 476,101 | 49 |
| refute:rang-ghim-lai.mjs | claude-sonnet-5 | 7 | 3,491 | 14 | 457,056 | 40 |
| refute:rang-ghim-lai.mjs | claude-sonnet-5 | 9 | 3,006 | 18 | 607,943 | 34 |
| baseline:diffBase | claude-sonnet-5 | 9 | 2,579 | 18 | 549,767 | 29 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,692 | 50 | 146,399 | 912 |
| refute:rang-ghim-lai.mjs | claude-sonnet-5 | 3 | 1,547 | 6 | 130,973 | 20 |
| machine:node _acceptance/release-2-16-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 1,324 | 18 | 70,498 | 18 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,241 | 34 | 181,689 | 18 |
| machine:node _acceptance/release-2-16-0/rang-ghi | claude-haiku-4-5-20251001 | 2 | 1,213 | 18 | 70,499 | 14 |
| capture:provenance | claude-sonnet-5 | 3 | 993 | 6 | 129,585 | 10 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 975 | 18 | 70,475 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 932 | 18 | 26,700 | 418 |
| machine:node _acceptance/release-2-16-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 828 | 18 | 70,496 | 10 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 673 | 18 | 70,482 | 8 |
| machine:node _acceptance/release-2-16-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 546 | 18 | 70,498 | 12 |
| triage | claude-sonnet-5 | 2 | 16 | 4 | 73,360 | 146 |


wall: 1916s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,579 | 549,767 | 29 | 04:20:52 | 04:21:22 |
| machine | 9 | 9,424 | 777,736 | 1370 | 04:20:52 | 04:43:43 |
| judge | 3 | 61,558 | 859,244 | 258 | 04:20:52 | 04:25:10 |
| review | 3 | 69,022 | 6,715,916 | 452 | 04:20:52 | 04:28:24 |
| triage | 1 | 16 | 73,360 | 146 | 04:43:43 | 04:46:09 |
| refute | 6 | 21,564 | 2,387,401 | 55 | 04:46:09 | 04:47:03 |
| capture | 1 | 993 | 129,585 | 10 | 04:47:03 | 04:47:13 |
| synthesize | 1 | 35,252 | 665,003 | 335 | 04:47:13 | 04:52:48 |

- **claude-sonnet-5**: 13 agent · 69 calls · out 121,962 · in 138 · cache_read 4,664,360 · cache_create 1,036,580
- **claude-opus-5**: 3 agent · 62 calls · out 69,022 · in 124 · cache_read 6,715,916 · cache_create 349,602
- **claude-haiku-4-5-20251001**: 9 agent · 24 calls · out 9,424 · in 210 · cache_read 777,736 · cache_create 368,430

