### S4 round 1 — wf_8e1a8cc8-100 (23 agent, 73,857 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E10:spec-alignment | claude-sonnet-5-5 | 2 | 19,831 | 4 | 137,327 | 153 |
| synthesize:report | claude-sonnet-5-5 | 4 | 8,822 | 8 | 392,210 | 67 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 2 | 8,205 | 4 | 102,435 | 66 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 2 | 7,306 | 4 | 137,329 | 61 |
| review:measurement | claude-opus-5-5 | 10 | 4,942 | 20 | 1,189,729 | 114 |
| triage | claude-sonnet-5-5 | 2 | 4,384 | 4 | 106,919 | 35 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 2,743 | 4 | 137,537 | 86 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,555 | 4 | 137,543 | 141 |
| review:conventions | claude-opus-5-5 | 20 | 2,303 | 40 | 3,061,373 | 164 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,161 | 4 | 137,543 | 213 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,699 | 4 | 137,529 | 86 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,605 | 4 | 137,529 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,596 | 4 | 34,982 | 449 |
| review:bugs | claude-opus-5-5 | 20 | 1,284 | 40 | 2,674,916 | 204 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,164 | 4 | 137,538 | 119 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 2 | 1,027 | 4 | 136,433 | 12 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 4 | 807 | 8 | 319,329 | 17 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 563 | 4 | 137,585 | 77 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 250 | 4 | 137,585 | 275 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 186 | 4 | 137,530 | 4 |
| capture:provenance | claude-sonnet-5-5 | 2 | 153 | 4 | 101,334 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 147 | 4 | 137,585 | 63 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 124 | 4 | 104,540 | 69 |


wall: 1592s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 124 | 104,540 | 69 | 01:54:01 | 01:55:09 |
| machine | 11 | 14,669 | 1,410,486 | 1457 | 01:54:01 | 02:18:18 |
| judge | 3 | 35,342 | 377,091 | 157 | 01:54:01 | 01:56:38 |
| review | 3 | 8,529 | 6,926,018 | 205 | 01:54:01 | 01:57:26 |
| triage | 1 | 4,384 | 106,919 | 35 | 02:18:20 | 02:18:55 |
| refute | 2 | 1,834 | 455,762 | 17 | 02:18:57 | 02:19:15 |
| capture | 1 | 153 | 101,334 | 6 | 02:19:17 | 02:19:23 |
| synthesize | 1 | 8,822 | 392,210 | 67 | 02:19:25 | 02:20:32 |

- **claude-sonnet-5-5**: 9 agent · 22 calls · out 50,659 · in 44 · cache_read 1,537,856 · cache_create 951,292
- **claude-opus-5-5**: 3 agent · 50 calls · out 8,529 · in 100 · cache_read 6,926,018 · cache_create 432,603
- **claude-haiku-5-5**: 11 agent · 22 calls · out 14,669 · in 44 · cache_read 1,410,486 · cache_create 927,664

### S4 round 2 — wf_fe8c32ac-b2d (19 agent, 59,745 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E10:domain-correctness | claude-sonnet-5-5 | 2 | 15,685 | 4 | 102,301 | 124 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 2 | 12,255 | 4 | 137,193 | 96 |
| synthesize:report | claude-sonnet-5-5 | 3 | 8,840 | 6 | 251,540 | 58 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 2 | 7,900 | 4 | 137,195 | 65 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 2,681 | 4 | 137,403 | 89 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,242 | 4 | 137,409 | 136 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,107 | 4 | 137,409 | 210 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,772 | 4 | 34,982 | 444 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,510 | 4 | 137,395 | 83 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,321 | 4 | 137,395 | 11 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,214 | 4 | 102,422 | 120 |
| review:measurement | claude-opus-5-5 | 7 | 476 | 14 | 740,556 | 37 |
| review:conventions | claude-opus-5-5 | 8 | 428 | 16 | 817,861 | 126 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 399 | 4 | 137,451 | 80 |
| review:bugs | claude-opus-5-5 | 8 | 330 | 16 | 874,998 | 47 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 166 | 4 | 137,396 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 101,200 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 145 | 4 | 137,451 | 62 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 137,451 | 268 |


wall: 1508s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 11 | 13,680 | 1,374,164 | 1438 | 03:09:05 | 03:33:03 |
| judge | 3 | 35,840 | 376,689 | 124 | 03:09:05 | 03:11:09 |
| review | 3 | 1,234 | 2,433,415 | 126 | 03:09:05 | 03:11:11 |
| capture | 1 | 151 | 101,200 | 8 | 03:33:05 | 03:33:12 |
| synthesize | 1 | 8,840 | 251,540 | 58 | 03:33:15 | 03:34:13 |

- **claude-sonnet-5-5**: 5 agent · 11 calls · out 44,831 · in 22 · cache_read 729,429 · cache_create 530,663
- **claude-haiku-5-5**: 11 agent · 22 calls · out 13,680 · in 44 · cache_read 1,374,164 · cache_create 959,685
- **claude-opus-5-5**: 3 agent · 23 calls · out 1,234 · in 46 · cache_read 2,433,415 · cache_create 316,625

