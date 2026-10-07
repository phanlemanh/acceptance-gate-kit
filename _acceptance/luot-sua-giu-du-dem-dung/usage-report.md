### S4 round 1 (cây đổi trong lượt — không dùng được) — wf_9ead7cc5-1ac (54 agent, 97,542 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 51 | 16,352 | 410 | 5,697,737 | 1757 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 43 | 13,399 | 348 | 4,667,739 | 1279 |
| synthesize:report | claude-sonnet-5-5 | 3 | 8,201 | 6 | 216,154 | 58 |
| synthesize:report | claude-sonnet-5-5 | 4 | 6,220 | 8 | 314,296 | 51 |
| review:measurement | claude-opus-5-5 | 11 | 5,531 | 22 | 1,279,698 | 150 |
| triage | claude-sonnet-5-5 | 2 | 3,425 | 4 | 85,515 | 27 |
| triage | claude-sonnet-5-5 | 2 | 3,380 | 4 | 86,796 | 26 |
| review:conventions | claude-opus-5-5 | 25 | 2,984 | 50 | 3,369,864 | 206 |
| review:conventions | claude-opus-5-5 | 18 | 2,588 | 36 | 2,082,522 | 152 |
| machine:LSGD_CASES=AC-5 node tests/workflows/luo | claude-haiku-4-5-20251001 | 20 | 2,255 | 162 | 1,537,913 | 105 |
| machine:LSGD_CASES=AC-3 node tests/workflows/luo | claude-haiku-4-5-20251001 | 7 | 1,884 | 58 | 435,954 | 62 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,773 | 18 | 90,620 | 178 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 3 | 1,647 | 26 | 157,808 | 158 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,585 | 18 | 91,538 | 32 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 3 | 1,558 | 26 | 57,866 | 661 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 19 | 1,536 | 154 | 1,514,103 | 214 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,437 | 18 | 90,607 | 30 |
| review:bugs | claude-opus-5-5 | 20 | 1,412 | 40 | 2,307,628 | 164 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,326 | 18 | 91,570 | 26 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,282 | 18 | 90,607 | 26 |
| baseline:diffBase | claude-sonnet-5-5 | 5 | 1,277 | 10 | 348,199 | 24 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,120 | 18 | 90,620 | 305 |
| machine:LSGD_CASES=AC-6 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 1,010 | 18 | 90,638 | 21 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 941 | 18 | 91,580 | 132 |
| machine:LSGD_CASES=AC-7 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 813 | 18 | 90,638 | 17 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 13 | 762 | 106 | 925,628 | 276 |
| machine:LSGD_CASES=AC-10 node tests/scripts/luot | claude-haiku-4-5-20251001 | 2 | 727 | 18 | 91,602 | 15 |
| machine:LSGD_CASES=AC-9 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 660 | 18 | 91,603 | 18 |
| machine:LSGD_CASES=AC-7 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 641 | 18 | 91,603 | 15 |
| refute:thuoc-vat.mjs | claude-sonnet-5-5 | 4 | 632 | 8 | 296,890 | 19 |
| machine:LSGD_CASES=AC-8 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 595 | 18 | 91,603 | 16 |
| review:bugs | claude-opus-5-5 | 21 | 573 | 42 | 2,688,609 | 274 |
| refute:thuoc-vat.mjs | claude-sonnet-5-5 | 3 | 561 | 6 | 169,026 | 19 |
| machine:LSGD_CASES=AC-2 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 560 | 18 | 91,603 | 12 |
| machine:LSGD_CASES=AC-3 node tests/workflows/luo | claude-haiku-4-5-20251001 | 2 | 541 | 18 | 90,637 | 14 |
| machine:LSGD_CASES=AC-5 node tests/workflows/luo | claude-haiku-4-5-20251001 | 2 | 517 | 18 | 90,637 | 15 |
| machine:LSGD_CASES=AC-1 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 501 | 18 | 90,638 | 13 |
| machine:LSGD_CASES=AC-6 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 497 | 18 | 91,603 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 491 | 18 | 91,585 | 192 |
| machine:LSGD_CASES=AC-4 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 479 | 18 | 91,603 | 16 |
| machine:LSGD_CASES=AC-10 node tests/scripts/luot | claude-haiku-4-5-20251001 | 2 | 467 | 18 | 90,637 | 12 |
| machine:LSGD_CASES=AC-4 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 435 | 18 | 90,638 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 430 | 18 | 90,656 | 87 |
| machine:LSGD_CASES=AC-2 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 416 | 18 | 90,638 | 13 |
| machine:LSGD_CASES=AC-9 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 398 | 18 | 90,638 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 346 | 18 | 90,656 | 272 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 312 | 18 | 90,656 | 73 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 3 | 273 | 26 | 155,686 | 13 |
| review:measurement | claude-opus-5-5 | 17 | 249 | 34 | 2,102,500 | 153 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 234 | 18 | 91,545 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 80,432 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 81,642 | 5 |
| machine:LSGD_CASES=AC-8 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 5 | 18 | 90,638 | 22 |
| machine:LSGD_CASES=AC-1 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 2 | 18 | 91,603 | 17 |


wall: 6018s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,277 | 348,199 | 24 | 03:24:16 | 03:24:41 |
| machine | 39 | 60,207 | 17,881,874 | 5899 | 03:24:16 | 05:02:36 |
| review | 6 | 13,337 | 13,830,821 | 4396 | 03:24:33 | 04:37:49 |
| triage | 2 | 6,805 | 172,311 | 1833 | 04:32:31 | 05:03:03 |
| capture | 2 | 302 | 162,074 | 1835 | 04:32:59 | 05:03:35 |
| synthesize | 2 | 14,421 | 530,450 | 1888 | 04:33:06 | 05:04:35 |
| refute | 2 | 1,193 | 465,916 | 21 | 05:03:06 | 05:03:27 |

- **claude-haiku-4-5-20251001**: 39 agent · 222 calls · out 60,207 · in 1,856 · cache_read 17,881,874 · cache_create 2,164,789
- **claude-sonnet-5-5**: 9 agent · 27 calls · out 23,998 · in 54 · cache_read 1,678,950 · cache_create 824,708
- **claude-opus-5-5**: 6 agent · 112 calls · out 13,337 · in 224 · cache_read 13,830,821 · cache_create 795,389

### S4 round 2 — wf_2a4cc24b-f8b (30 agent, 36,795 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 5,883 | 8 | 317,229 | 59 |
| triage | claude-sonnet-5-5 | 2 | 3,523 | 4 | 85,049 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 6 | 3,449 | 50 | 356,006 | 473 |
| review:conventions | claude-opus-5-5 | 23 | 2,808 | 46 | 3,123,827 | 158 |
| review:bugs | claude-opus-5-5 | 29 | 2,435 | 58 | 3,860,260 | 319 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,187 | 18 | 90,740 | 217 |
| review:measurement | claude-opus-5-5 | 9 | 2,139 | 18 | 926,956 | 76 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 1,377 | 8 | 256,412 | 20 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,276 | 18 | 90,727 | 25 |
| refute:acceptance-verify.js | claude-sonnet-5-5 | 6 | 969 | 12 | 441,800 | 22 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 961 | 18 | 90,735 | 128 |
| machine:LSGD_CASES=AC-3 node tests/workflows/luo | claude-haiku-4-5-20251001 | 2 | 844 | 18 | 90,757 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 799 | 18 | 90,740 | 181 |
| machine:LSGD_CASES=AC-7 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 717 | 18 | 90,758 | 18 |
| machine:LSGD_CASES=AC-12 node tests/workflows/lu | claude-haiku-4-5-20251001 | 2 | 707 | 18 | 90,756 | 14 |
| machine:LSGD_CASES=AC-1 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 573 | 18 | 90,758 | 14 |
| machine:LSGD_CASES=AC-5 node tests/workflows/luo | claude-haiku-4-5-20251001 | 2 | 568 | 18 | 90,757 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 3 | 552 | 26 | 156,398 | 161 |
| machine:LSGD_CASES=AC-8 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 520 | 18 | 90,758 | 16 |
| machine:LSGD_CASES=AC-10 node tests/scripts/luot | claude-haiku-4-5-20251001 | 2 | 510 | 18 | 90,757 | 15 |
| machine:LSGD_CASES=AC-4 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 505 | 18 | 90,758 | 17 |
| machine:LSGD_CASES=AC-6 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 500 | 18 | 90,758 | 16 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 485 | 34 | 225,370 | 21 |
| machine:LSGD_CASES=AC-9 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 476 | 18 | 90,758 | 14 |
| machine:LSGD_CASES=AC-2 node tests/scripts/luot- | claude-haiku-4-5-20251001 | 2 | 459 | 18 | 90,758 | 14 |
| machine:LSGD_CASES=AC-11 node tests/scripts/luot | claude-haiku-4-5-20251001 | 2 | 452 | 18 | 90,757 | 15 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 352 | 18 | 90,734 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 333 | 18 | 90,776 | 68 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 289 | 18 | 90,776 | 244 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 80,555 | 6 |


wall: 1679s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,377 | 256,412 | 20 | 06:36:00 | 06:36:21 |
| machine | 22 | 17,514 | 2,462,092 | 1553 | 06:36:00 | 07:01:54 |
| review | 3 | 7,382 | 7,911,043 | 320 | 06:36:19 | 06:41:39 |
| triage | 1 | 3,523 | 85,049 | 28 | 07:01:56 | 07:02:24 |
| refute | 1 | 969 | 441,800 | 22 | 07:02:27 | 07:02:49 |
| capture | 1 | 147 | 80,555 | 6 | 07:02:51 | 07:02:58 |
| synthesize | 1 | 5,883 | 317,229 | 59 | 07:03:00 | 07:03:59 |

- **claude-sonnet-5-5**: 5 agent · 18 calls · out 11,899 · in 36 · cache_read 1,181,045 · cache_create 474,393
- **claude-haiku-4-5-20251001**: 22 agent · 51 calls · out 17,514 · in 452 · cache_read 2,462,092 · cache_create 829,993
- **claude-opus-5-5**: 3 agent · 61 calls · out 7,382 · in 122 · cache_read 7,911,043 · cache_create 435,062

