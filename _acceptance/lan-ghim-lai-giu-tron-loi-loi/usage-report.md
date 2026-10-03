### S4 round 1 — wf_bf454330-cd4 (29 agent, 47,167 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 10,671 | 4 | 100,165 | 64 |
| triage | claude-sonnet-5-5 | 2 | 6,140 | 4 | 87,933 | 45 |
| review:conventions | claude-opus-5-5 | 16 | 3,323 | 32 | 1,765,993 | 157 |
| review:measurement | claude-opus-5-5 | 10 | 3,224 | 20 | 1,099,286 | 152 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 2,574 | 18 | 89,723 | 42 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,035 | 18 | 89,705 | 123 |
| review:bugs | claude-opus-5-5 | 26 | 1,805 | 52 | 3,642,540 | 357 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 1,774 | 18 | 89,722 | 27 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,543 | 18 | 89,705 | 158 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,450 | 18 | 89,692 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,405 | 18 | 89,705 | 226 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,298 | 18 | 89,692 | 29 |
| refute:chan-tai-may.mjs | claude-sonnet-5-5 | 4 | 1,124 | 8 | 297,604 | 27 |
| refute:chan-tai-may.mjs | claude-sonnet-5-5 | 4 | 1,076 | 8 | 295,090 | 24 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 1,000 | 18 | 60,671 | 134 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 898 | 8 | 250,505 | 16 |
| refute:ban-base.mjs | claude-sonnet-5-5 | 4 | 816 | 8 | 252,008 | 18 |
| refute:chan-tai-may.mjs | claude-sonnet-5-5 | 5 | 794 | 10 | 382,795 | 22 |
| refute:ban-base.mjs | claude-sonnet-5-5 | 3 | 738 | 6 | 198,452 | 18 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 701 | 18 | 89,723 | 46 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 695 | 18 | 89,725 | 19 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 604 | 18 | 89,741 | 90 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 479 | 18 | 89,723 | 15 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 337 | 18 | 89,699 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 265 | 18 | 89,741 | 70 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 240 | 18 | 89,741 | 242 |
| capture:provenance | claude-sonnet-5-5 | 2 | 149 | 4 | 79,431 | 6 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 6 | 18 | 89,721 | 17 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 3 | 18 | 89,726 | 23 |


wall: 1285s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 898 | 250,505 | 16 | 23:52:03 | 23:52:19 |
| machine | 17 | 16,409 | 1,496,155 | 1132 | 23:52:03 | 00:10:56 |
| review | 3 | 8,352 | 6,507,819 | 359 | 23:52:03 | 23:58:02 |
| triage | 1 | 6,140 | 87,933 | 45 | 00:10:57 | 00:11:42 |
| refute | 5 | 4,548 | 1,425,949 | 30 | 00:11:44 | 00:12:14 |
| capture | 1 | 149 | 79,431 | 6 | 00:12:16 | 00:12:22 |
| synthesize | 1 | 10,671 | 100,165 | 64 | 00:12:25 | 00:13:28 |

- **claude-sonnet-5-5**: 9 agent · 30 calls · out 22,406 · in 60 · cache_read 1,943,983 · cache_create 704,943
- **claude-opus-5-5**: 3 agent · 52 calls · out 8,352 · in 104 · cache_read 6,507,819 · cache_create 412,739
- **claude-haiku-4-5-20251001**: 17 agent · 34 calls · out 16,409 · in 306 · cache_read 1,496,155 · cache_create 631,163

### S4 round 2 — wf_6305130b-43c (29 agent, 44,897 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 7,689 | 8 | 309,176 | 489 |
| review:measurement | claude-opus-5-5 | 12 | 5,207 | 24 | 1,289,837 | 193 |
| triage | claude-sonnet-5-5 | 2 | 4,312 | 4 | 84,649 | 32 |
| review:bugs | claude-opus-5-5 | 11 | 3,998 | 22 | 1,324,063 | 147 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 2,346 | 18 | 89,740 | 38 |
| review:conventions | claude-opus-5-5 | 18 | 1,883 | 36 | 2,178,752 | 183 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 1,661 | 18 | 89,739 | 26 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,492 | 18 | 89,722 | 158 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,440 | 18 | 89,709 | 28 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,376 | 18 | 89,709 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,323 | 18 | 89,722 | 223 |
| refute:kho-mau.mjs | claude-sonnet-5-5 | 4 | 1,128 | 8 | 261,958 | 18 |
| refute:chan-dau-do.mjs | claude-sonnet-5-5 | 3 | 1,048 | 6 | 202,392 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,031 | 18 | 89,722 | 108 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 971 | 18 | 89,717 | 133 |
| refute:chan-bo-doc.mjs | claude-sonnet-5-5 | 4 | 971 | 8 | 292,833 | 102 |
| refute:chan-dau-do.mjs | claude-sonnet-5-5 | 6 | 881 | 12 | 471,169 | 23 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 875 | 18 | 89,743 | 20 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 875 | 18 | 89,738 | 19 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 866 | 18 | 89,740 | 46 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 701 | 18 | 89,740 | 17 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 699 | 18 | 89,742 | 20 |
| refute:chan-nhat-ky.mjs | claude-sonnet-5-5 | 4 | 565 | 8 | 287,321 | 21 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 515 | 18 | 89,758 | 83 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 337 | 18 | 89,716 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 294 | 18 | 89,758 | 67 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 252 | 18 | 89,758 | 233 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 79,450 | 6 |
| synthesize:report | claude-sonnet-5-5 | 2 | 13 | 4 | 95,712 | 1053 |


wall: 3699s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 17 | 17,054 | 1,525,473 | 1085 | 00:15:32 | 00:33:37 |
| review | 3 | 11,088 | 4,792,652 | 194 | 00:15:32 | 00:18:46 |
| triage | 1 | 4,312 | 84,649 | 32 | 00:33:38 | 00:34:10 |
| refute | 5 | 4,593 | 1,515,673 | 104 | 00:34:12 | 00:35:56 |
| capture | 1 | 148 | 79,450 | 6 | 00:35:58 | 00:36:04 |
| synthesize | 2 | 7,702 | 404,888 | 2465 | 00:36:06 | 01:17:11 |

- **claude-sonnet-5-5**: 9 agent · 31 calls · out 16,755 · in 62 · cache_read 2,084,660 · cache_create 711,727
- **claude-opus-5-5**: 3 agent · 41 calls · out 11,088 · in 82 · cache_read 4,792,652 · cache_create 417,580
- **claude-haiku-4-5-20251001**: 17 agent · 34 calls · out 17,054 · in 306 · cache_read 1,525,473 · cache_create 602,581

### S4 round 3 — wf_b46557f1-e13 (24 agent, 41,267 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 7,194 | 8 | 327,419 | 62 |
| triage | claude-sonnet-5-5 | 2 | 6,356 | 4 | 86,734 | 47 |
| review:conventions | claude-opus-5-5 | 14 | 5,021 | 28 | 1,632,889 | 161 |
| review:measurement | claude-opus-5-5 | 12 | 3,217 | 24 | 1,383,865 | 160 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 6 | 2,026 | 50 | 355,323 | 217 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,945 | 18 | 89,832 | 210 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 1,742 | 18 | 89,849 | 26 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,620 | 18 | 89,832 | 150 |
| review:bugs | claude-opus-5-5 | 19 | 1,474 | 38 | 2,340,291 | 163 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,421 | 18 | 89,819 | 30 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,292 | 18 | 89,819 | 24 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 984 | 18 | 60,798 | 128 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 961 | 18 | 89,850 | 45 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 874 | 8 | 250,937 | 16 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 866 | 18 | 89,848 | 19 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 807 | 18 | 89,853 | 20 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 693 | 18 | 89,850 | 26 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 631 | 18 | 89,850 | 18 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 578 | 18 | 89,852 | 20 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 473 | 18 | 89,868 | 78 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 356 | 18 | 89,826 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 300 | 18 | 89,868 | 63 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 288 | 18 | 89,868 | 225 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 79,577 | 7 |


wall: 1273s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 874 | 250,937 | 16 | 01:29:59 | 01:30:15 |
| machine | 17 | 16,983 | 1,763,805 | 1153 | 01:29:59 | 01:49:12 |
| review | 3 | 9,712 | 5,357,045 | 165 | 01:29:59 | 01:32:44 |
| triage | 1 | 6,356 | 86,734 | 47 | 01:49:13 | 01:50:00 |
| capture | 1 | 148 | 79,577 | 7 | 01:50:02 | 01:50:08 |
| synthesize | 1 | 7,194 | 327,419 | 62 | 01:50:10 | 01:51:12 |

- **claude-sonnet-5-5**: 4 agent · 12 calls · out 14,572 · in 24 · cache_read 744,667 · cache_create 379,403
- **claude-opus-5-5**: 3 agent · 45 calls · out 9,712 · in 90 · cache_read 5,357,045 · cache_create 418,896
- **claude-haiku-4-5-20251001**: 17 agent · 38 calls · out 16,983 · in 338 · cache_read 1,763,805 · cache_create 646,222

