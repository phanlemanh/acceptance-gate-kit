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

