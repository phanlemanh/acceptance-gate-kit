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

