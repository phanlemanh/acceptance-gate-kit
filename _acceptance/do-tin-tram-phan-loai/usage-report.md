### S4 round 1 — wf_e323870b-022 (37 agent, 213,756 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-fable-5-1 | 13 | 20,137 | 386 | 1,252,912 | 293 |
| synthesize:report | claude-sonnet-5 | 2 | 20,060 | 4 | 88,509 | 198 |
| triage | claude-sonnet-5 | 2 | 19,005 | 4 | 74,360 | 188 |
| review:measurement | claude-fable-5-1 | 12 | 15,332 | 354 | 979,874 | 247 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 15 | 14,239 | 30 | 1,297,615 | 160 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 15 | 13,707 | 30 | 1,222,053 | 163 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 7 | 13,096 | 14 | 565,785 | 147 |
| review:bugs | claude-fable-5-1 | 11 | 12,249 | 322 | 940,114 | 185 |
| refute:acceptance-verify.js | claude-sonnet-5 | 8 | 10,702 | 16 | 610,320 | 111 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 7 | 10,045 | 14 | 495,815 | 122 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 9 | 9,052 | 18 | 706,407 | 98 |
| refute:acceptance-verify.js | claude-sonnet-5 | 8 | 7,478 | 16 | 630,410 | 76 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 9 | 6,945 | 18 | 650,726 | 86 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 7 | 6,548 | 14 | 506,161 | 78 |
| baseline:diffBase | claude-sonnet-5 | 10 | 5,358 | 20 | 585,673 | 519 |
| refute:acceptance-verify.js | claude-sonnet-5 | 6 | 4,218 | 12 | 423,682 | 47 |
| refute:acceptance-verify.js | claude-sonnet-5 | 4 | 3,974 | 8 | 261,016 | 45 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,978 | 58 | 288,382 | 433 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,509 | 18 | 79,411 | 19 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,404 | 18 | 79,407 | 17 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,231 | 34 | 181,486 | 20 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,173 | 18 | 79,408 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 1,111 | 18 | 63,856 | 475 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,095 | 18 | 79,409 | 14 |
| capture:provenance | claude-sonnet-5 | 2 | 1,093 | 4 | 66,628 | 11 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,088 | 18 | 79,411 | 14 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,084 | 18 | 79,411 | 14 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,069 | 18 | 79,411 | 13 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,034 | 18 | 79,408 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 1,028 | 18 | 79,388 | 12 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 980 | 18 | 79,405 | 13 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 905 | 18 | 79,415 | 12 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 896 | 18 | 79,407 | 12 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 837 | 18 | 79,408 | 11 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 748 | 18 | 79,408 | 14 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 719 | 18 | 79,381 | 12 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 629 | 18 | 79,412 | 13 |


wall: 917s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 5,358 | 585,673 | 519 | 02:34:28 | 02:43:07 |
| machine | 19 | 20,518 | 1,804,224 | 487 | 02:34:28 | 02:42:36 |
| review | 3 | 47,718 | 3,172,900 | 293 | 02:34:42 | 02:39:35 |
| refute | 11 | 100,004 | 7,369,990 | 265 | 02:37:49 | 02:42:15 |
| triage | 1 | 19,005 | 74,360 | 188 | 02:43:07 | 02:46:16 |
| capture | 1 | 1,093 | 66,628 | 11 | 02:46:16 | 02:46:27 |
| synthesize | 1 | 20,060 | 88,509 | 198 | 02:46:27 | 02:49:45 |

- **claude-fable-5-1**: 3 agent · 36 calls · out 47,718 · in 1,062 · cache_read 3,172,900 · cache_create 292,830
- **claude-sonnet-5**: 15 agent · 111 calls · out 145,520 · in 222 · cache_read 8,185,160 · cache_create 989,323
- **claude-haiku-4-5-20251001**: 19 agent · 45 calls · out 20,518 · in 398 · cache_read 1,804,224 · cache_create 415,988

### S4 round 2 — wf_3899cc20-351 (37 agent, 234,672 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 13 | 34,886 | 26 | 1,320,004 | 304 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 11 | 22,026 | 22 | 958,671 | 249 |
| review:measurement | claude-fable-5-1 | 8 | 15,788 | 226 | 653,359 | 236 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 17 | 12,519 | 34 | 1,552,688 | 139 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 13 | 12,486 | 26 | 1,078,421 | 145 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 13 | 12,377 | 26 | 1,037,574 | 145 |
| triage | claude-sonnet-5 | 2 | 12,333 | 4 | 73,710 | 124 |
| review:conventions | claude-fable-5-1 | 8 | 11,544 | 226 | 607,482 | 182 |
| review:bugs | claude-fable-5-1 | 12 | 11,430 | 354 | 1,096,859 | 170 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 14 | 11,350 | 28 | 1,150,718 | 125 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 19 | 10,678 | 38 | 1,521,639 | 123 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 8 | 9,179 | 16 | 680,219 | 109 |
| refute:acceptance-verify.js | claude-sonnet-5 | 11 | 8,456 | 22 | 814,410 | 101 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 11 | 8,410 | 22 | 863,894 | 95 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 11 | 7,953 | 22 | 837,983 | 86 |
| refute:acceptance-verify.js | claude-sonnet-5 | 10 | 7,506 | 20 | 714,466 | 89 |
| baseline:diffBase | claude-sonnet-5 | 10 | 5,331 | 20 | 592,976 | 551 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,919 | 58 | 339,895 | 28 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,720 | 58 | 168,480 | 1770 |
| capture:provenance | claude-sonnet-5 | 2 | 1,284 | 4 | 66,702 | 13 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,217 | 18 | 79,483 | 16 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,145 | 18 | 79,482 | 14 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,111 | 18 | 47,552 | 14 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,082 | 18 | 79,482 | 14 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,080 | 18 | 79,479 | 14 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,009 | 18 | 79,479 | 14 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 958 | 18 | 79,482 | 13 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 931 | 18 | 79,479 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 903 | 18 | 63,856 | 507 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 857 | 18 | 79,482 | 11 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 857 | 18 | 79,452 | 13 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 845 | 18 | 79,486 | 11 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 842 | 18 | 79,476 | 11 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 792 | 18 | 79,459 | 10 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 650 | 18 | 79,479 | 13 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 618 | 18 | 79,478 | 16 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 600 | 18 | 79,478 | 14 |


wall: 2222s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 5,331 | 592,976 | 551 | 03:10:26 | 03:19:37 |
| machine | 19 | 19,136 | 1,811,939 | 1782 | 03:10:26 | 03:40:08 |
| review | 3 | 38,762 | 2,357,700 | 238 | 03:10:40 | 03:14:38 |
| refute | 11 | 122,940 | 11,210,683 | 315 | 03:13:32 | 03:18:47 |
| triage | 1 | 12,333 | 73,710 | 124 | 03:40:08 | 03:42:12 |
| capture | 1 | 1,284 | 66,702 | 13 | 03:42:12 | 03:42:25 |
| synthesize | 1 | 34,886 | 1,320,004 | 304 | 03:42:25 | 03:47:28 |

- **claude-sonnet-5**: 15 agent · 165 calls · out 176,774 · in 330 · cache_read 13,264,075 · cache_create 1,150,698
- **claude-fable-5-1**: 3 agent · 28 calls · out 38,762 · in 806 · cache_read 2,357,700 · cache_create 277,730
- **claude-haiku-4-5-20251001**: 19 agent · 48 calls · out 19,136 · in 422 · cache_read 1,811,939 · cache_create 576,704

### S4 round 3 — wf_c81a431a-252 (34 agent, 193,186 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5 | 27 | 26,922 | 54 | 3,015,543 | 399 |
| synthesize:report | claude-sonnet-5 | 10 | 23,638 | 20 | 968,336 | 210 |
| review:conventions | claude-opus-5 | 19 | 23,033 | 38 | 2,017,913 | 342 |
| review:measurement | claude-opus-5 | 18 | 18,174 | 36 | 1,760,626 | 280 |
| refute:acceptance-verify.js | claude-sonnet-5 | 10 | 13,709 | 20 | 799,267 | 151 |
| triage | claude-sonnet-5 | 2 | 11,367 | 4 | 73,446 | 120 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 10 | 9,017 | 20 | 745,371 | 109 |
| refute:acceptance-verify.js | claude-sonnet-5 | 7 | 7,471 | 14 | 508,499 | 82 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 16 | 7,122 | 32 | 1,335,609 | 85 |
| baseline:diffBase | claude-sonnet-5 | 21 | 6,699 | 42 | 1,416,708 | 578 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 10 | 6,282 | 20 | 809,686 | 77 |
| refute:triage-do-tin.test.mjs | claude-sonnet-5 | 11 | 5,582 | 22 | 774,661 | 64 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 5 | 5,474 | 10 | 360,944 | 64 |
| refute:acceptance-verify.js | claude-sonnet-5 | 9 | 4,771 | 18 | 690,990 | 59 |
| refute:acceptance-verify.js | claude-sonnet-5 | 4 | 2,719 | 8 | 261,596 | 33 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,701 | 42 | 239,380 | 25 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,608 | 42 | 185,938 | 477 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,498 | 18 | 79,463 | 20 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,305 | 18 | 79,494 | 16 |
| capture:provenance | claude-sonnet-5 | 3 | 1,189 | 6 | 136,755 | 12 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,188 | 18 | 79,493 | 14 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,180 | 18 | 79,493 | 15 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,087 | 18 | 79,493 | 13 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,079 | 18 | 79,489 | 13 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,060 | 18 | 79,490 | 13 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,012 | 18 | 79,490 | 12 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 1,000 | 18 | 47,563 | 13 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 976 | 18 | 79,493 | 13 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 960 | 18 | 79,490 | 13 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 925 | 18 | 79,487 | 12 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 921 | 18 | 79,497 | 12 |
| machine:bash _acceptance/do-tin-tram-phan-loai/r | claude-haiku-4-5-20251001 | 2 | 888 | 18 | 79,490 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 887 | 18 | 63,856 | 520 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 742 | 18 | 79,470 | 9 |


wall: 920s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 6,699 | 1,416,708 | 578 | 04:04:12 | 04:13:50 |
| machine | 18 | 20,017 | 1,649,569 | 522 | 04:04:12 | 04:12:54 |
| review | 3 | 68,129 | 6,794,082 | 400 | 04:04:25 | 04:11:06 |
| refute | 9 | 62,147 | 6,286,623 | 270 | 04:09:07 | 04:13:37 |
| triage | 1 | 11,367 | 73,446 | 120 | 04:13:50 | 04:15:50 |
| capture | 1 | 1,189 | 136,755 | 12 | 04:15:50 | 04:16:02 |
| synthesize | 1 | 23,638 | 968,336 | 210 | 04:16:02 | 04:19:32 |

- **claude-opus-5**: 3 agent · 64 calls · out 68,129 · in 128 · cache_read 6,794,082 · cache_create 349,771
- **claude-sonnet-5**: 13 agent · 118 calls · out 105,040 · in 236 · cache_read 8,881,868 · cache_create 920,008
- **claude-haiku-4-5-20251001**: 18 agent · 42 calls · out 20,017 · in 372 · cache_read 1,649,569 · cache_create 434,608

