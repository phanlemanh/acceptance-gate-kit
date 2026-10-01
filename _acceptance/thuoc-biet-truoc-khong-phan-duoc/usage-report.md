### S4 round 1 — wf_ed1add2b-8fb (29 agent, 39,644 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 7,130 | 8 | 354,722 | 62 |
| triage | claude-sonnet-5-5 | 2 | 3,001 | 4 | 95,714 | 25 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 2,978 | 18 | 96,879 | 44 |
| review:measurement | claude-opus-5-5 | 8 | 2,112 | 16 | 939,238 | 131 |
| judge:E7:spec-alignment | claude-sonnet-5-5 | 3 | 2,025 | 6 | 233,269 | 19 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,999 | 18 | 96,892 | 129 |
| review:conventions | claude-opus-5-5 | 20 | 1,977 | 40 | 3,005,126 | 140 |
| judge:E7:operational-feasibility | claude-sonnet-5-5 | 3 | 1,975 | 6 | 240,454 | 22 |
| judge:E7:domain-correctness | claude-sonnet-5-5 | 3 | 1,633 | 6 | 203,130 | 17 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,577 | 18 | 96,892 | 170 |
| review:bugs | claude-opus-5-5 | 13 | 1,429 | 26 | 1,653,647 | 143 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 3 | 1,365 | 6 | 243,459 | 15 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,320 | 18 | 96,879 | 29 |
| machine:bash _acceptance/thuoc-biet-truoc-khong- | claude-haiku-4-5-20251001 | 2 | 1,082 | 18 | 96,883 | 28 |
| machine:bash _acceptance/thuoc-biet-truoc-khong- | claude-haiku-4-5-20251001 | 2 | 991 | 18 | 96,888 | 24 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 4 | 954 | 8 | 365,426 | 16 |
| machine:bash _acceptance/thuoc-biet-truoc-khong- | claude-haiku-4-5-20251001 | 2 | 829 | 18 | 96,886 | 25 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 820 | 8 | 291,454 | 16 |
| machine:bash _acceptance/thuoc-biet-truoc-khong- | claude-haiku-4-5-20251001 | 2 | 715 | 18 | 96,888 | 19 |
| machine:bash _acceptance/thuoc-biet-truoc-khong- | claude-haiku-4-5-20251001 | 2 | 610 | 18 | 96,883 | 23 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 575 | 18 | 96,928 | 97 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 3 | 555 | 6 | 243,460 | 14 |
| machine:bash _acceptance/thuoc-biet-truoc-khong- | claude-haiku-4-5-20251001 | 2 | 500 | 18 | 96,884 | 19 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 420 | 18 | 96,892 | 187 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 377 | 18 | 96,886 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 323 | 18 | 96,928 | 255 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 220 | 18 | 96,928 | 78 |
| capture:provenance | claude-sonnet-5-5 | 2 | 149 | 4 | 91,502 | 5 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 3 | 18 | 71,547 | 140 |


wall: 1256s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 820 | 291,454 | 16 | 02:27:04 | 02:27:21 |
| machine | 16 | 14,519 | 1,524,963 | 1160 | 02:27:04 | 02:46:24 |
| judge | 6 | 8,507 | 1,529,198 | 34 | 02:27:04 | 02:27:38 |
| review | 3 | 5,518 | 5,598,011 | 145 | 02:27:25 | 02:29:50 |
| triage | 1 | 3,001 | 95,714 | 25 | 02:46:26 | 02:46:51 |
| capture | 1 | 149 | 91,502 | 5 | 02:46:52 | 02:46:57 |
| synthesize | 1 | 7,130 | 354,722 | 62 | 02:46:59 | 02:48:00 |

- **claude-sonnet-5-5**: 10 agent · 31 calls · out 19,607 · in 62 · cache_read 2,362,590 · cache_create 1,047,547
- **claude-haiku-4-5-20251001**: 16 agent · 32 calls · out 14,519 · in 288 · cache_read 1,524,963 · cache_create 862,534
- **claude-opus-5-5**: 3 agent · 41 calls · out 5,518 · in 82 · cache_read 5,598,011 · cache_create 427,004

### S4 round 2 — wf_1b596e52-6ec (27 agent, 31,882 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 8,145 | 8 | 356,672 | 58 |
| judge:E7:operational-feasibility | claude-sonnet-5-5 | 3 | 2,057 | 6 | 239,036 | 19 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,015 | 18 | 96,882 | 133 |
| judge:E7:domain-correctness | claude-sonnet-5-5 | 4 | 1,751 | 8 | 326,698 | 21 |
| judge:E7:spec-alignment | claude-sonnet-5-5 | 4 | 1,738 | 8 | 357,189 | 21 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,533 | 18 | 96,882 | 167 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,510 | 18 | 96,882 | 220 |
| review:measurement | claude-opus-5-5 | 19 | 1,320 | 38 | 2,343,087 | 116 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,320 | 18 | 96,869 | 29 |
| machine:bash _acceptance/thuoc-biet-truoc-khong- | claude-haiku-4-5-20251001 | 2 | 1,124 | 18 | 96,896 | 24 |
| triage | claude-sonnet-5-5 | 2 | 1,056 | 4 | 93,679 | 10 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 986 | 18 | 96,877 | 151 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 4 | 972 | 8 | 367,178 | 14 |
| machine:bash _acceptance/thuoc-biet-truoc-khong- | claude-haiku-4-5-20251001 | 2 | 927 | 18 | 96,896 | 24 |
| machine:bash _acceptance/thuoc-biet-truoc-khong- | claude-haiku-4-5-20251001 | 2 | 712 | 18 | 96,901 | 21 |
| review:bugs | claude-opus-5-5 | 13 | 687 | 26 | 1,486,387 | 94 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 618 | 18 | 96,869 | 17 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 3 | 601 | 6 | 243,869 | 13 |
| machine:bash _acceptance/thuoc-biet-truoc-khong- | claude-haiku-4-5-20251001 | 2 | 579 | 18 | 96,897 | 17 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 4 | 547 | 8 | 366,451 | 17 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 398 | 18 | 96,918 | 94 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 317 | 18 | 96,918 | 85 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 314 | 18 | 96,876 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 285 | 18 | 96,918 | 264 |
| capture:provenance | claude-sonnet-5-5 | 2 | 232 | 4 | 91,479 | 6 |
| review:conventions | claude-opus-5-5 | 11 | 136 | 22 | 1,134,443 | 48 |
| machine:bash _acceptance/thuoc-biet-truoc-khong- | claude-haiku-4-5-20251001 | 2 | 2 | 18 | 96,899 | 25 |


wall: 1269s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 15 | 12,640 | 1,453,380 | 1183 | 03:50:18 | 04:10:01 |
| judge | 6 | 7,666 | 1,900,421 | 23 | 03:50:18 | 03:50:41 |
| review | 3 | 2,143 | 4,963,917 | 118 | 03:50:35 | 03:52:33 |
| triage | 1 | 1,056 | 93,679 | 10 | 04:10:02 | 04:10:12 |
| capture | 1 | 232 | 91,479 | 6 | 04:10:20 | 04:10:26 |
| synthesize | 1 | 8,145 | 356,672 | 58 | 04:10:29 | 04:11:27 |

- **claude-sonnet-5-5**: 9 agent · 30 calls · out 17,099 · in 60 · cache_read 2,442,251 · cache_create 945,041
- **claude-haiku-4-5-20251001**: 15 agent · 30 calls · out 12,640 · in 270 · cache_read 1,453,380 · cache_create 774,163
- **claude-opus-5-5**: 3 agent · 43 calls · out 2,143 · in 86 · cache_read 4,963,917 · cache_create 366,843

