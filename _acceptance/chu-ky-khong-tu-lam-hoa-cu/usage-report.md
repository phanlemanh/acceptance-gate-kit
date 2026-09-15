# usage-report — chu-ky-khong-tu-lam-hoa-cu

Sinh 15/09/2026 bằng `feature-loop/scripts/wf-usage.mjs <transcriptDir> --md`, cùng
nền với hồ sơ mốc 2.13.0 (out + in + cache_read + cache_create của mọi agent).
Hai lượt dispatch chết ở cổng args (0 agent, 0 token) không có transcript workflow
nên không có mục ở đây — chúng là vấp của phiên gọi, không phải lượt chấm.

### Lượt chấm 1 (round 1) — REJECT — wf_c45e9609-fc7 (20 agent, 195,514 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| triage | claude-sonnet-5 | 3 | 41,110 | 6 | 168,397 | 401 |
| synthesize:report | claude-sonnet-5 | 2 | 32,366 | 4 | 93,215 | 308 |
| review:bugs | claude-opus-5 | 36 | 31,363 | 72 | 4,380,609 | 466 |
| review:conventions | claude-opus-5 | 27 | 29,283 | 54 | 3,273,947 | 665 |
| review:measurement | claude-opus-5 | 20 | 23,527 | 40 | 2,061,246 | 350 |
| refute:repin-lane.mjs | claude-sonnet-5 | 17 | 11,444 | 34 | 1,498,291 | 118 |
| refute:signoff.md | claude-sonnet-5 | 19 | 7,325 | 38 | 1,469,273 | 292 |
| baseline:diffBase | claude-sonnet-5 | 10 | 4,199 | 20 | 585,659 | 571 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 5 | 2,016 | 42 | 195,214 | 1126 |
| capture:provenance | claude-sonnet-5 | 4 | 1,699 | 8 | 208,356 | 15 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 1,473 | 18 | 79,660 | 28 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 1,323 | 18 | 79,658 | 24 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,291 | 42 | 134,778 | 1027 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 1,221 | 18 | 79,653 | 21 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 1,198 | 18 | 47,728 | 26 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,182 | 34 | 182,923 | 21 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 978 | 18 | 79,577 | 16 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 956 | 18 | 79,584 | 12 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 944 | 18 | 82,753 | 29 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 616 | 18 | 79,654 | 28 |


wall: 2144s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 4,199 | 585,659 | 571 | 01:18:09 | 01:27:40 |
| machine | 11 | 13,198 | 1,121,182 | 1127 | 01:18:09 | 01:36:57 |
| review | 3 | 84,173 | 9,715,802 | 665 | 01:18:09 | 01:29:14 |
| triage | 1 | 41,110 | 168,397 | 401 | 01:36:57 | 01:43:38 |
| refute | 2 | 18,769 | 2,967,564 | 292 | 01:43:38 | 01:48:30 |
| capture | 1 | 1,699 | 208,356 | 15 | 01:48:30 | 01:48:45 |
| synthesize | 1 | 32,366 | 93,215 | 308 | 01:48:45 | 01:53:53 |

- **claude-sonnet-5**: 6 agent · 55 calls · out 98,143 · in 110 · cache_read 4,023,191 · cache_create 610,553
- **claude-opus-5**: 3 agent · 83 calls · out 84,173 · in 166 · cache_read 9,715,802 · cache_create 378,517
- **claude-haiku-4-5-20251001**: 11 agent · 30 calls · out 13,198 · in 262 · cache_read 1,121,182 · cache_create 379,905

### Lượt chấm 2 (round 2) — REJECT — wf_09407c76-520 (20 agent, 171,541 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5 | 24 | 30,842 | 48 | 3,078,631 | 448 |
| triage | claude-sonnet-5 | 2 | 26,859 | 4 | 78,828 | 265 |
| review:conventions | claude-opus-5 | 19 | 25,812 | 38 | 2,081,756 | 377 |
| review:measurement | claude-opus-5 | 20 | 21,984 | 40 | 1,903,631 | 335 |
| synthesize:report | claude-sonnet-5 | 2 | 21,202 | 4 | 91,171 | 201 |
| refute:signoff.md | claude-sonnet-5 | 16 | 16,851 | 32 | 1,340,214 | 206 |
| baseline:diffBase | claude-sonnet-5 | 26 | 10,278 | 52 | 1,910,246 | 487 |
| refute:repin-lane-skip-unchanged.test.mjs | claude-sonnet-5 | 7 | 3,893 | 14 | 507,077 | 43 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,786 | 42 | 235,675 | 27 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 1,543 | 18 | 47,752 | 24 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 3 | 1,539 | 26 | 111,571 | 494 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,445 | 42 | 135,945 | 842 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 1,421 | 18 | 79,678 | 23 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 1,264 | 18 | 79,684 | 21 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 1,156 | 18 | 79,677 | 17 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 1,060 | 18 | 79,682 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 957 | 18 | 79,601 | 14 |
| capture:provenance | claude-sonnet-5 | 2 | 585 | 4 | 66,960 | 7 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 577 | 18 | 79,686 | 18 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 487 | 18 | 79,608 | 10 |


wall: 1523s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 10,278 | 1,910,246 | 487 | 02:15:36 | 02:23:43 |
| machine | 11 | 13,235 | 1,088,559 | 843 | 02:15:36 | 02:29:40 |
| review | 3 | 78,638 | 7,064,018 | 450 | 02:15:36 | 02:23:06 |
| triage | 1 | 26,859 | 78,828 | 265 | 02:29:40 | 02:34:05 |
| refute | 2 | 20,744 | 1,847,291 | 206 | 02:34:05 | 02:37:31 |
| capture | 1 | 585 | 66,960 | 7 | 02:37:31 | 02:37:38 |
| synthesize | 1 | 21,202 | 91,171 | 201 | 02:37:38 | 02:40:59 |

- **claude-opus-5**: 3 agent · 63 calls · out 78,638 · in 126 · cache_read 7,064,018 · cache_create 373,985
- **claude-sonnet-5**: 6 agent · 55 calls · out 79,668 · in 110 · cache_read 3,994,496 · cache_create 613,446
- **claude-haiku-4-5-20251001**: 11 agent · 29 calls · out 13,235 · in 254 · cache_read 1,088,559 · cache_create 365,855

### Lượt chấm 3 (round 3) — PENDING-JUDGMENT, triage hỏng — wf_65dd34d3-1a7 (37 agent, 331,725 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5 | 18 | 26,799 | 36 | 2,092,648 | 401 |
| review:bugs | claude-opus-5 | 26 | 24,419 | 52 | 3,020,950 | 483 |
| review:measurement | claude-opus-5 | 15 | 22,567 | 30 | 1,475,095 | 331 |
| refute:routing-baseline-t1.test.mjs | claude-sonnet-5 | 10 | 21,430 | 20 | 809,563 | 244 |
| refute:repin-lane.mjs | claude-sonnet-5 | 11 | 21,081 | 22 | 997,533 | 237 |
| refute:evals.yaml | claude-sonnet-5 | 18 | 20,845 | 36 | 1,696,943 | 246 |
| triage | claude-sonnet-5 | 2 | 20,615 | 4 | 80,487 | 190 |
| baseline:diffBase | claude-sonnet-5 | 56 | 19,814 | 112 | 5,664,447 | 935 |
| synthesize:report | claude-sonnet-5 | 2 | 19,485 | 4 | 92,224 | 183 |
| refute:signoff.md | claude-sonnet-5 | 16 | 16,887 | 32 | 1,457,194 | 188 |
| refute:CHANGELOG.md | claude-sonnet-5 | 14 | 14,403 | 28 | 1,166,131 | 152 |
| refute:repin-lane.mjs | claude-sonnet-5 | 17 | 11,620 | 34 | 1,579,319 | 138 |
| refute:evals.yaml | claude-sonnet-5 | 15 | 10,979 | 30 | 1,250,255 | 138 |
| refute:routing-baseline-t1.test.mjs | claude-sonnet-5 | 8 | 8,622 | 16 | 630,014 | 122 |
| refute:routing-baseline-t1.test.mjs | claude-sonnet-5 | 6 | 7,339 | 12 | 414,974 | 82 |
| refute:routing-baseline.mjs | claude-sonnet-5 | 12 | 6,981 | 24 | 959,878 | 92 |
| refute:repin-lane.mjs | claude-sonnet-5 | 17 | 6,951 | 34 | 1,424,051 | 95 |
| refute:signoff.md | claude-sonnet-5 | 5 | 6,534 | 10 | 366,843 | 77 |
| refute:routing-baseline-t1.test.mjs | claude-sonnet-5 | 5 | 5,837 | 10 | 352,679 | 62 |
| refute:routing-baseline-t1.test.mjs | claude-sonnet-5 | 6 | 5,104 | 12 | 432,582 | 55 |
| refute:gate-card-lmcms.test.mjs | claude-sonnet-5 | 7 | 5,044 | 14 | 548,911 | 58 |
| refute:signoff.md | claude-sonnet-5 | 13 | 4,186 | 26 | 961,873 | 67 |
| refute:repin-lane-skip-unchanged.test.mjs | claude-sonnet-5 | 5 | 3,909 | 10 | 327,773 | 46 |
| refute:signoff.md | claude-sonnet-5 | 8 | 3,453 | 16 | 600,610 | 43 |
| refute:gate-card-lmcms.test.mjs | claude-sonnet-5 | 6 | 2,647 | 12 | 408,224 | 36 |
| capture:provenance | claude-sonnet-5 | 2 | 1,804 | 4 | 66,938 | 17 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,734 | 42 | 186,067 | 502 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 1,544 | 18 | 79,670 | 23 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 3 | 1,476 | 26 | 111,555 | 543 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 1,461 | 18 | 79,668 | 26 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 1,174 | 18 | 79,662 | 22 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 1,155 | 18 | 79,666 | 18 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,007 | 18 | 79,585 | 15 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 994 | 34 | 182,385 | 21 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 711 | 18 | 79,592 | 9 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 578 | 18 | 47,736 | 21 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 536 | 18 | 79,661 | 19 |


wall: 1223s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 19,814 | 5,664,447 | 935 | 03:38:33 | 03:54:08 |
| machine | 11 | 12,370 | 1,085,247 | 544 | 03:38:33 | 03:47:37 |
| review | 3 | 73,785 | 6,588,693 | 484 | 03:38:33 | 03:46:37 |
| triage | 1 | 20,615 | 80,487 | 190 | 03:47:37 | 03:50:48 |
| refute | 19 | 183,852 | 16,385,350 | 288 | 03:50:48 | 03:55:36 |
| capture | 1 | 1,804 | 66,938 | 17 | 03:55:36 | 03:55:53 |
| synthesize | 1 | 19,485 | 92,224 | 183 | 03:55:53 | 03:58:56 |

- **claude-opus-5**: 3 agent · 59 calls · out 73,785 · in 118 · cache_read 6,588,693 · cache_create 361,292
- **claude-sonnet-5**: 23 agent · 261 calls · out 245,570 · in 522 · cache_read 22,289,446 · cache_create 1,702,526
- **claude-haiku-4-5-20251001**: 11 agent · 28 calls · out 12,370 · in 246 · cache_read 1,085,247 · cache_create 311,261

### Lượt chấm 4 (round 4) — BLOCKED, một tác tử chết — wf_ebbbd3bf-51f (22 agent, 180,726 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5 | 35 | 36,909 | 70 | 4,405,741 | 524 |
| review:conventions | claude-opus-5 | 24 | 26,745 | 48 | 2,856,506 | 414 |
| review:measurement | claude-opus-5 | 13 | 26,667 | 26 | 1,363,718 | 378 |
| synthesize:report | claude-sonnet-5 | 6 | 19,127 | 12 | 540,243 | 194 |
| triage | claude-sonnet-5 | 2 | 15,694 | 4 | 78,981 | 153 |
| refute:repin-lane.mjs | claude-sonnet-5 | 15 | 12,750 | 30 | 1,446,855 | 143 |
| refute:routing-baseline-t1.test.mjs | claude-sonnet-5 | 17 | 12,336 | 34 | 1,327,369 | 141 |
| refute:routing-baseline-t1.test.mjs | claude-sonnet-5 | 9 | 8,620 | 18 | 713,862 | 157 |
| baseline:diffBase | claude-sonnet-5 | 13 | 5,796 | 26 | 881,310 | 460 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 2,539 | 50 | 241,509 | 448 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 3 | 1,866 | 28 | 130,631 | 31 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,611 | 42 | 234,492 | 23 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 1,421 | 18 | 79,661 | 23 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 6 | 1,333 | 50 | 213,751 | 890 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 1,157 | 18 | 79,663 | 17 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 1,088 | 18 | 79,659 | 17 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 1,009 | 18 | 79,661 | 19 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 977 | 18 | 47,729 | 27 |
| capture:provenance | claude-sonnet-5 | 2 | 855 | 4 | 66,933 | 8 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 837 | 18 | 79,578 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 725 | 18 | 79,585 | 9 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 664 | 18 | 79,654 | 16 |


wall: 1405s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 5,796 | 881,310 | 460 | 04:18:24 | 04:26:04 |
| machine | 12 | 15,227 | 1,425,573 | 891 | 04:18:24 | 04:33:15 |
| review | 3 | 90,321 | 8,625,965 | 525 | 04:18:24 | 04:27:09 |
| triage | 1 | 15,694 | 78,981 | 153 | 04:33:15 | 04:35:48 |
| refute | 3 | 33,706 | 3,488,086 | 158 | 04:35:48 | 04:38:26 |
| capture | 1 | 855 | 66,933 | 8 | 04:38:26 | 04:38:34 |
| synthesize | 1 | 19,127 | 540,243 | 194 | 04:38:34 | 04:41:49 |

- **claude-opus-5**: 3 agent · 72 calls · out 90,321 · in 144 · cache_read 8,625,965 · cache_create 405,830
- **claude-sonnet-5**: 7 agent · 64 calls · out 75,178 · in 128 · cache_read 5,055,553 · cache_create 649,375
- **claude-haiku-4-5-20251001**: 12 agent · 36 calls · out 15,227 · in 314 · cache_read 1,425,573 · cache_create 383,564

### Lượt chấm 4b (round 4 chạy lại) — REJECT — wf_87edd7d2-093 (23 agent, 165,461 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5 | 36 | 33,754 | 72 | 4,523,489 | 486 |
| review:conventions | claude-opus-5 | 28 | 29,073 | 56 | 3,211,113 | 1234 |
| synthesize:report | claude-sonnet-5 | 4 | 25,937 | 8 | 288,663 | 251 |
| review:measurement | claude-opus-5 | 20 | 21,354 | 40 | 2,037,653 | 314 |
| triage | claude-sonnet-5 | 2 | 15,979 | 4 | 75,629 | 154 |
| baseline:diffBase | claude-sonnet-5 | 15 | 6,416 | 30 | 994,123 | 465 |
| refute:config.yaml | claude-sonnet-5 | 9 | 6,253 | 18 | 678,392 | 75 |
| refute:routing-baseline-t1.test.mjs | claude-sonnet-5 | 9 | 5,308 | 18 | 658,857 | 60 |
| refute:config.yaml | claude-sonnet-5 | 6 | 3,951 | 12 | 374,344 | 48 |
| refute:config.yaml | claude-sonnet-5 | 4 | 2,344 | 8 | 256,050 | 33 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 1,653 | 18 | 79,651 | 27 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,609 | 42 | 186,045 | 435 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,544 | 50 | 286,170 | 23 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 1,512 | 18 | 79,641 | 21 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 1,280 | 18 | 79,648 | 22 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 1,252 | 18 | 79,646 | 20 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 3 | 1,161 | 26 | 111,535 | 478 |
| capture:provenance | claude-sonnet-5 | 2 | 1,074 | 4 | 66,915 | 10 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 1,049 | 18 | 47,716 | 25 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 1,038 | 18 | 79,650 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 933 | 18 | 79,565 | 14 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 568 | 18 | 79,642 | 25 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 419 | 18 | 79,572 | 10 |


wall: 1726s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 6,416 | 994,123 | 465 | 04:56:04 | 05:03:49 |
| machine | 12 | 14,018 | 1,268,481 | 480 | 04:56:04 | 05:04:03 |
| review | 3 | 84,181 | 9,772,255 | 1234 | 04:56:04 | 05:16:38 |
| triage | 1 | 15,979 | 75,629 | 154 | 05:16:38 | 05:19:12 |
| refute | 4 | 17,856 | 1,967,643 | 76 | 05:19:12 | 05:20:28 |
| capture | 1 | 1,074 | 66,915 | 10 | 05:20:28 | 05:20:39 |
| synthesize | 1 | 25,937 | 288,663 | 251 | 05:20:39 | 05:24:50 |

- **claude-opus-5**: 3 agent · 84 calls · out 84,181 · in 168 · cache_read 9,772,255 · cache_create 677,022
- **claude-sonnet-5**: 8 agent · 51 calls · out 67,262 · in 102 · cache_read 3,392,973 · cache_create 628,477
- **claude-haiku-4-5-20251001**: 12 agent · 32 calls · out 14,018 · in 280 · cache_read 1,268,481 · cache_create 328,847

### Lượt chấm 5 (round 5) — PASS — wf_57d4c40c-4cf (20 agent, 179,840 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| baseline:diffBase | claude-sonnet-5 | 266 | 37,427 | 532 | 36,897,476 | 559 |
| review:conventions | claude-opus-5 | 32 | 30,623 | 64 | 4,226,137 | 469 |
| review:bugs | claude-opus-5 | 26 | 27,354 | 52 | 2,966,245 | 436 |
| review:measurement | claude-opus-5 | 15 | 22,952 | 30 | 1,563,168 | 340 |
| synthesize:report | claude-sonnet-5 | 8 | 22,927 | 16 | 753,542 | 221 |
| triage | claude-sonnet-5 | 2 | 13,650 | 4 | 76,495 | 127 |
| refute:routing-baseline-t1.test.mjs | claude-sonnet-5 | 12 | 8,626 | 24 | 864,934 | 102 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 2,447 | 34 | 198,991 | 33 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 2,294 | 50 | 187,783 | 904 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 3 | 2,177 | 26 | 111,537 | 547 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 1,586 | 18 | 79,650 | 25 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 1,573 | 18 | 47,718 | 28 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 1,299 | 18 | 79,643 | 19 |
| capture:provenance | claude-sonnet-5 | 3 | 1,239 | 6 | 137,177 | 14 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 1,011 | 18 | 79,648 | 17 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 956 | 18 | 79,567 | 15 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 836 | 18 | 79,644 | 26 |
| machine:bash -c 'out=$(node tests/scripts/repin- | claude-haiku-4-5-20251001 | 2 | 541 | 18 | 79,652 | 17 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 316 | 18 | 79,574 | 9 |
| machine:bash -c 'out=$(node tests/scripts/routin | claude-haiku-4-5-20251001 | 2 | 6 | 18 | 79,653 | 21 |


wall: 1369s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 37,427 | 36,897,476 | 559 | 06:03:25 | 06:12:44 |
| machine | 12 | 15,042 | 1,183,060 | 904 | 06:03:25 | 06:18:30 |
| review | 3 | 80,929 | 8,755,550 | 469 | 06:03:25 | 06:11:14 |
| triage | 1 | 13,650 | 76,495 | 127 | 06:18:30 | 06:20:37 |
| refute | 1 | 8,626 | 864,934 | 102 | 06:20:37 | 06:22:19 |
| capture | 1 | 1,239 | 137,177 | 14 | 06:22:19 | 06:22:33 |
| synthesize | 1 | 22,927 | 753,542 | 221 | 06:22:33 | 06:26:14 |

- **claude-sonnet-5**: 5 agent · 291 calls · out 83,869 · in 582 · cache_read 38,729,624 · cache_create 544,851
- **claude-opus-5**: 3 agent · 73 calls · out 80,929 · in 146 · cache_read 8,755,550 · cache_create 401,993
- **claude-haiku-4-5-20251001**: 12 agent · 31 calls · out 15,042 · in 272 · cache_read 1,183,060 · cache_create 399,297

