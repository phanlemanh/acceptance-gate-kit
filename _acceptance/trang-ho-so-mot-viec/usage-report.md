### S4 round 1 — wf_de5e7f0e-bc1 (20 agent, 35,245 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 9 | 8,135 | 18 | 1,114,357 | 83 |
| triage | claude-sonnet-5-5 | 2 | 4,370 | 4 | 106,298 | 34 |
| ui:E12 | claude-sonnet-5-5 | 30 | 3,975 | 60 | 3,667,627 | 253 |
| review:measurement | claude-opus-5-5 | 21 | 2,776 | 42 | 3,376,138 | 211 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,554 | 4 | 137,571 | 220 |
| review:conventions | claude-opus-5-5 | 21 | 2,197 | 42 | 2,994,596 | 189 |
| review:bugs | claude-opus-5-5 | 22 | 1,885 | 44 | 3,205,510 | 171 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,608 | 4 | 137,545 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,525 | 4 | 34,982 | 419 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,485 | 4 | 137,545 | 83 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,390 | 4 | 137,559 | 169 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 4 | 1,055 | 8 | 327,467 | 18 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 591 | 4 | 137,601 | 78 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 409 | 4 | 137,531 | 84 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 361 | 4 | 137,601 | 65 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 285 | 4 | 137,601 | 280 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 187 | 4 | 137,546 | 4 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 184 | 4 | 102,550 | 119 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 101,349 | 5 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 125 | 4 | 104,534 | 72 |


wall: 1620s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 125 | 104,534 | 72 | 01:26:03 | 01:27:15 |
| machine | 11 | 10,579 | 1,375,632 | 1469 | 01:26:03 | 01:50:32 |
| ui | 1 | 3,975 | 3,667,627 | 253 | 01:26:03 | 01:30:16 |
| review | 3 | 6,858 | 9,576,244 | 212 | 01:26:03 | 01:29:34 |
| triage | 1 | 4,370 | 106,298 | 34 | 01:50:34 | 01:51:08 |
| refute | 1 | 1,055 | 327,467 | 18 | 01:51:12 | 01:51:30 |
| capture | 1 | 148 | 101,349 | 5 | 01:51:32 | 01:51:37 |
| synthesize | 1 | 8,135 | 1,114,357 | 83 | 01:51:39 | 01:53:02 |

- **claude-sonnet-5-5**: 6 agent · 49 calls · out 17,808 · in 98 · cache_read 5,421,632 · cache_create 742,538
- **claude-opus-5-5**: 3 agent · 64 calls · out 6,858 · in 128 · cache_read 9,576,244 · cache_create 486,949
- **claude-haiku-5-5**: 11 agent · 22 calls · out 10,579 · in 44 · cache_read 1,375,632 · cache_create 960,842

### S4 round 2 — wf_5ec2fa4e-0d6 (18 agent, 22,554 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 5,785 | 8 | 380,087 | 51 |
| ui:E12 | claude-sonnet-5-5 | 25 | 3,569 | 50 | 3,079,157 | 124 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,470 | 4 | 137,574 | 209 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,117 | 4 | 137,574 | 169 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,843 | 4 | 34,982 | 407 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 137,560 | 82 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,345 | 4 | 137,560 | 11 |
| review:measurement | claude-opus-5-5 | 9 | 1,219 | 18 | 1,004,379 | 46 |
| review:bugs | claude-opus-5-5 | 8 | 650 | 16 | 902,883 | 37 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 533 | 4 | 137,616 | 76 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 341 | 4 | 137,540 | 79 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 318 | 4 | 137,561 | 5 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 173 | 4 | 137,541 | 117 |
| review:conventions | claude-opus-5-5 | 11 | 162 | 22 | 1,197,333 | 44 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 101,364 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 144 | 4 | 137,616 | 64 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 125 | 4 | 104,543 | 67 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 124 | 4 | 137,616 | 274 |


wall: 1494s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 125 | 104,543 | 67 | 02:21:07 | 02:22:14 |
| machine | 11 | 10,892 | 1,410,740 | 1433 | 02:21:07 | 02:44:59 |
| ui | 1 | 3,569 | 3,079,157 | 124 | 02:21:07 | 02:23:11 |
| review | 3 | 2,031 | 3,104,595 | 47 | 02:21:07 | 02:21:54 |
| capture | 1 | 152 | 101,364 | 6 | 02:45:02 | 02:45:08 |
| synthesize | 1 | 5,785 | 380,087 | 51 | 02:45:10 | 02:46:00 |

- **claude-sonnet-5-5**: 4 agent · 33 calls · out 9,631 · in 66 · cache_read 3,665,151 · cache_create 496,666
- **claude-haiku-5-5**: 11 agent · 22 calls · out 10,892 · in 44 · cache_read 1,410,740 · cache_create 926,344
- **claude-opus-5-5**: 3 agent · 28 calls · out 2,031 · in 56 · cache_read 3,104,595 · cache_create 327,570

### S4 round 3 — wf_6d90ba93-cc3 (18 agent, 20,284 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 5,473 | 8 | 384,230 | 43 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,659 | 4 | 137,712 | 230 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,227 | 4 | 137,712 | 181 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,651 | 4 | 34,982 | 435 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,483 | 4 | 137,698 | 83 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,322 | 4 | 137,698 | 11 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,124 | 4 | 102,725 | 129 |
| review:measurement | claude-opus-5-5 | 12 | 1,080 | 24 | 1,382,081 | 73 |
| triage | claude-sonnet-5-5 | 2 | 1,003 | 4 | 103,702 | 11 |
| review:conventions | claude-opus-5-5 | 13 | 590 | 26 | 1,516,898 | 151 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 394 | 4 | 137,754 | 85 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 343 | 4 | 137,706 | 86 |
| capture:provenance | claude-sonnet-5-5 | 2 | 202 | 4 | 101,502 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 188 | 4 | 137,699 | 5 |
| review:bugs | claude-opus-5-5 | 10 | 151 | 20 | 1,110,072 | 46 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 146 | 4 | 137,754 | 310 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 125 | 4 | 104,715 | 72 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 137,754 | 70 |


wall: 1626s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 125 | 104,715 | 72 | 03:48:30 | 03:49:43 |
| machine | 11 | 11,660 | 1,377,194 | 1560 | 03:48:30 | 04:14:30 |
| review | 3 | 1,821 | 4,009,051 | 151 | 03:48:30 | 03:51:01 |
| triage | 1 | 1,003 | 103,702 | 11 | 04:14:32 | 04:14:43 |
| capture | 1 | 202 | 101,502 | 6 | 04:14:45 | 04:14:51 |
| synthesize | 1 | 5,473 | 384,230 | 43 | 04:14:53 | 04:15:36 |

- **claude-sonnet-5-5**: 4 agent · 10 calls · out 6,803 · in 20 · cache_read 694,149 · cache_create 475,245
- **claude-haiku-5-5**: 11 agent · 22 calls · out 11,660 · in 44 · cache_read 1,377,194 · cache_create 964,815
- **claude-opus-5-5**: 3 agent · 35 calls · out 1,821 · in 70 · cache_read 4,009,051 · cache_create 333,076

