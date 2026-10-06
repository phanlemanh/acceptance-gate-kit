### S4 round 1 — wf_70ee6831-026 (27 agent, 45,163 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 8,666 | 4 | 137,472 | 52 |
| triage | claude-sonnet-5-5 | 2 | 4,749 | 4 | 124,699 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 9 | 4,254 | 76 | 862,553 | 293 |
| review:conventions | claude-opus-5-5 | 23 | 2,912 | 46 | 4,074,791 | 271 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 3 | 2,298 | 28 | 224,535 | 257 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,166 | 18 | 122,863 | 253 |
| review:measurement | claude-opus-5-5 | 16 | 1,900 | 32 | 2,649,802 | 211 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,728 | 18 | 29,053 | 421 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 1,552 | 18 | 122,871 | 42 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 1,406 | 18 | 122,871 | 27 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,317 | 18 | 122,850 | 27 |
| review:bugs | claude-opus-5-5 | 15 | 1,273 | 30 | 2,522,667 | 225 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 1,258 | 18 | 122,871 | 33 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,047 | 18 | 122,850 | 26 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 3 | 985 | 26 | 194,943 | 271 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 968 | 18 | 122,871 | 31 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 953 | 18 | 122,871 | 27 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 946 | 8 | 380,096 | 20 |
| refute:repin-lane-chay-lai.test.mjs | claude-sonnet-5-5 | 6 | 906 | 12 | 680,253 | 26 |
| refute:repin-lane.mjs | claude-sonnet-5-5 | 5 | 850 | 10 | 517,745 | 22 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 735 | 18 | 122,871 | 36 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 623 | 18 | 122,871 | 19 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 560 | 18 | 122,899 | 107 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 434 | 18 | 122,899 | 282 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 290 | 18 | 122,857 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 237 | 18 | 122,899 | 89 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 118,611 | 6 |


wall: 1945s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 946 | 380,096 | 20 | 05:04:10 | 05:04:29 |
| machine | 18 | 22,811 | 3,031,298 | 1808 | 05:04:10 | 05:34:18 |
| review | 3 | 6,085 | 9,247,260 | 271 | 05:04:10 | 05:08:41 |
| triage | 1 | 4,749 | 124,699 | 36 | 05:34:23 | 05:34:59 |
| refute | 2 | 1,756 | 1,197,998 | 27 | 05:35:04 | 05:35:31 |
| capture | 1 | 150 | 118,611 | 6 | 05:35:34 | 05:35:40 |
| synthesize | 1 | 8,666 | 137,472 | 52 | 05:35:43 | 05:36:35 |

- **claude-sonnet-5-5**: 6 agent · 21 calls · out 16,267 · in 42 · cache_read 1,958,876 · cache_create 793,712
- **claude-haiku-4-5-20251001**: 18 agent · 45 calls · out 22,811 · in 400 · cache_read 3,031,298 · cache_create 1,441,010
- **claude-opus-5-5**: 3 agent · 54 calls · out 6,085 · in 108 · cache_read 9,247,260 · cache_create 592,388


### S4 round 2 — wf_29c1dc92-914 — wf_29c1dc92-914 (26 agent, 37,698 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 8,318 | 10 | 598,812 | 69 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 2,317 | 18 | 122,894 | 48 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 2,291 | 18 | 122,873 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,146 | 18 | 122,886 | 292 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 3 | 2,133 | 28 | 224,331 | 32 |
| triage | claude-sonnet-5-5 | 2 | 1,724 | 4 | 122,312 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,554 | 18 | 122,886 | 155 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,435 | 18 | 122,873 | 32 |
| review:bugs | claude-opus-5-5 | 8 | 1,408 | 16 | 1,045,529 | 63 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 1,292 | 18 | 122,894 | 250 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 7 | 1,262 | 58 | 342,607 | 1322 |
| review:measurement | claude-opus-5-5 | 12 | 1,228 | 24 | 1,656,137 | 93 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 1,161 | 18 | 122,894 | 31 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 1,113 | 18 | 122,894 | 42 |
| refute:repin-lane.mjs | claude-sonnet-5-5 | 4 | 1,109 | 8 | 416,223 | 21 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 1,066 | 18 | 122,894 | 27 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 1,039 | 18 | 122,881 | 151 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 926 | 18 | 122,894 | 32 |
| review:conventions | claude-opus-5-5 | 5 | 920 | 10 | 546,405 | 39 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 870 | 18 | 122,894 | 22 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 643 | 18 | 122,922 | 126 |
| refute:repin-lane.mjs | claude-sonnet-5-5 | 4 | 585 | 8 | 381,786 | 17 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 313 | 18 | 122,880 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 309 | 18 | 122,922 | 103 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 299 | 18 | 29,053 | 343 |
| capture:provenance | claude-sonnet-5-5 | 2 | 237 | 4 | 118,633 | 7 |


wall: 2731s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 18 | 22,169 | 2,439,372 | 2605 | 05:39:01 | 06:22:26 |
| review | 3 | 3,556 | 3,248,071 | 94 | 05:39:01 | 05:40:35 |
| triage | 1 | 1,724 | 122,312 | 16 | 06:22:28 | 06:22:44 |
| refute | 2 | 1,694 | 798,009 | 23 | 06:22:47 | 06:23:10 |
| capture | 1 | 237 | 118,633 | 7 | 06:23:13 | 06:23:19 |
| synthesize | 1 | 8,318 | 598,812 | 69 | 06:23:22 | 06:24:31 |

- **claude-sonnet-5-5**: 5 agent · 17 calls · out 11,973 · in 34 · cache_read 1,637,766 · cache_create 665,834
- **claude-haiku-4-5-20251001**: 18 agent · 42 calls · out 22,169 · in 374 · cache_read 2,439,372 · cache_create 1,715,181
- **claude-opus-5-5**: 3 agent · 25 calls · out 3,556 · in 50 · cache_read 3,248,071 · cache_create 411,628


### S4 round 3 — wf_b4228613-294 — wf_b4228613-294 (24 agent, 28,841 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 6,060 | 6 | 285,106 | 54 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 9 | 2,096 | 74 | 862,843 | 491 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 4 | 1,971 | 34 | 253,550 | 542 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 1,603 | 18 | 123,135 | 35 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,488 | 18 | 123,127 | 140 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 1,453 | 18 | 123,135 | 39 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 1,321 | 18 | 123,135 | 26 |
| triage | claude-sonnet-5-5 | 2 | 1,254 | 4 | 121,498 | 12 |
| review:conventions | claude-opus-5-5 | 6 | 1,233 | 12 | 684,813 | 59 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 3 | 1,172 | 26 | 224,565 | 371 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,113 | 18 | 123,114 | 27 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 1,013 | 18 | 94,069 | 145 |
| review:measurement | claude-opus-5-5 | 6 | 965 | 12 | 764,065 | 93 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 942 | 18 | 123,135 | 36 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 839 | 18 | 123,135 | 22 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 821 | 18 | 123,135 | 30 |
| machine:node _acceptance/gia-lan-ghim-lai/rang/c | claude-haiku-4-5-20251001 | 2 | 767 | 18 | 123,135 | 26 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 722 | 18 | 123,114 | 19 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 534 | 18 | 123,163 | 102 |
| review:bugs | claude-opus-5-5 | 14 | 367 | 28 | 1,963,400 | 358 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 345 | 18 | 123,163 | 88 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 322 | 18 | 123,121 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 289 | 18 | 123,163 | 286 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 118,889 | 6 |


wall: 1954s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 18 | 18,811 | 3,158,937 | 1872 | 06:51:08 | 07:22:21 |
| review | 3 | 2,565 | 3,412,278 | 359 | 06:51:08 | 06:57:08 |
| triage | 1 | 1,254 | 121,498 | 12 | 07:22:24 | 07:22:36 |
| capture | 1 | 151 | 118,889 | 6 | 07:22:39 | 07:22:46 |
| synthesize | 1 | 6,060 | 285,106 | 54 | 07:22:48 | 07:23:42 |

- **claude-sonnet-5-5**: 3 agent · 7 calls · out 7,465 · in 14 · cache_read 525,493 · cache_create 420,491
- **claude-haiku-4-5-20251001**: 18 agent · 46 calls · out 18,811 · in 404 · cache_read 3,158,937 · cache_create 1,424,193
- **claude-opus-5-5**: 3 agent · 26 calls · out 2,565 · in 52 · cache_read 3,412,278 · cache_create 413,048

