### S4 round 1 — wf_0152c3c1-02b (24 agent, 104,318 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 20 | 26,760 | 40 | 2,965,100 | 333 |
| triage | claude-sonnet-5-5 | 2 | 22,206 | 4 | 106,211 | 153 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 2 | 7,820 | 4 | 133,186 | 56 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 2 | 5,303 | 4 | 133,184 | 38 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 5,102 | 4 | 34,982 | 562 |
| machine:node _acceptance/cau-tin-hieu-nguoi-gui/ | claude-haiku-5-5 | 2 | 3,813 | 4 | 133,704 | 23 |
| review:conventions | claude-opus-5-5 | 42 | 3,739 | 84 | 8,110,744 | 540 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,673 | 4 | 133,631 | 156 |
| review:measurement | claude-opus-5-5 | 22 | 3,382 | 44 | 3,750,913 | 459 |
| machine:TH_CASES=CN-1,CN-1-do,CN-1-do2,CN-2,CN-2 | claude-haiku-5-5 | 2 | 3,154 | 4 | 133,793 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,794 | 4 | 34,982 | 355 |
| review:bugs | claude-opus-5-5 | 39 | 2,450 | 78 | 7,268,667 | 554 |
| refute:tin-hieu.test.mjs | claude-sonnet-5-5 | 11 | 2,398 | 22 | 1,216,373 | 107 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,162 | 4 | 133,617 | 17 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,043 | 4 | 133,617 | 97 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,550 | 4 | 133,673 | 83 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 3 | 1,512 | 6 | 207,251 | 113 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,443 | 4 | 133,626 | 137 |
| refute:tin-hieu.test.mjs | claude-sonnet-5-5 | 11 | 1,125 | 22 | 1,272,285 | 73 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 650 | 4 | 34,982 | 337 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 586 | 4 | 133,618 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 342 | 4 | 133,673 | 70 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 171 | 4 | 101,414 | 20 |
| capture:provenance | claude-sonnet-5-5 | 2 | 140 | 4 | 97,425 | 8 |


wall: 2454s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 171 | 101,414 | 20 | 22:12:15 | 22:12:35 |
| machine | 12 | 27,312 | 1,307,898 | 1844 | 22:12:15 | 22:42:59 |
| judge | 3 | 14,635 | 473,621 | 113 | 22:12:15 | 22:14:07 |
| review | 3 | 9,571 | 19,130,324 | 559 | 22:12:15 | 22:21:34 |
| triage | 1 | 22,206 | 106,211 | 153 | 22:43:01 | 22:45:34 |
| refute | 2 | 3,523 | 2,488,658 | 107 | 22:45:36 | 22:47:23 |
| capture | 1 | 140 | 97,425 | 8 | 22:47:25 | 22:47:33 |
| synthesize | 1 | 26,760 | 2,965,100 | 333 | 22:47:35 | 22:53:08 |

- **claude-sonnet-5-5**: 9 agent · 55 calls · out 67,435 · in 110 · cache_read 6,232,429 · cache_create 1,022,206
- **claude-haiku-5-5**: 12 agent · 24 calls · out 27,312 · in 48 · cache_read 1,307,898 · cache_create 1,155,118
- **claude-opus-5-5**: 3 agent · 103 calls · out 9,571 · in 206 · cache_read 19,130,324 · cache_create 723,931

### S4 round 2 — wf_5b8b0168-8fa (21 agent, 86,508 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 10 | 16,165 | 20 | 1,277,988 | 237 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 2 | 13,800 | 4 | 98,259 | 102 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 2 | 13,352 | 4 | 133,151 | 100 |
| review:measurement | claude-opus-5-5 | 20 | 8,685 | 40 | 3,375,749 | 504 |
| machine:TH_CASES=CN-1,CN-1-do,CN-1-do2,CN-2,CN-2 | claude-haiku-5-5 | 2 | 7,044 | 4 | 133,778 | 51 |
| machine:node _acceptance/cau-tin-hieu-nguoi-gui/ | claude-haiku-5-5 | 2 | 4,577 | 4 | 133,671 | 24 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,551 | 4 | 34,982 | 416 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,031 | 4 | 34,982 | 603 |
| review:bugs | claude-opus-5-5 | 30 | 2,900 | 60 | 6,333,316 | 515 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,674 | 4 | 133,598 | 166 |
| triage | claude-sonnet-5-5 | 2 | 2,374 | 4 | 99,989 | 23 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,034 | 4 | 133,584 | 19 |
| review:conventions | claude-opus-5-5 | 28 | 1,926 | 56 | 4,962,242 | 403 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,462 | 4 | 133,593 | 146 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,433 | 4 | 133,640 | 95 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 471 | 4 | 34,982 | 381 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 422 | 4 | 133,640 | 82 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 2 | 267 | 4 | 133,153 | 44 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 189 | 4 | 133,585 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 141 | 4 | 97,392 | 11 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 10 | 4 | 133,584 | 92 |


wall: 2309s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 12 | 26,898 | 1,307,619 | 2029 | 23:33:10 | 00:06:59 |
| judge | 3 | 27,419 | 364,563 | 105 | 23:33:10 | 23:34:55 |
| review | 3 | 13,511 | 14,671,307 | 520 | 23:33:10 | 23:41:50 |
| triage | 1 | 2,374 | 99,989 | 23 | 00:07:01 | 00:07:24 |
| capture | 1 | 141 | 97,392 | 11 | 00:07:28 | 00:07:40 |
| synthesize | 1 | 16,165 | 1,277,988 | 237 | 00:07:42 | 00:11:38 |

- **claude-sonnet-5-5**: 6 agent · 20 calls · out 46,099 · in 40 · cache_read 1,839,932 · cache_create 645,150
- **claude-opus-5-5**: 3 agent · 78 calls · out 13,511 · in 156 · cache_read 14,671,307 · cache_create 749,575
- **claude-haiku-5-5**: 12 agent · 24 calls · out 26,898 · in 48 · cache_read 1,307,619 · cache_create 1,154,420

### S4 round 3 — wf_5dcf4ced-ad2 (16 agent, 29,485 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 8,554 | 8 | 406,234 | 73 |
| triage | claude-sonnet-5-5 | 2 | 3,042 | 4 | 101,438 | 29 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,724 | 4 | 34,982 | 572 |
| review:conventions | claude-opus-5-5 | 22 | 2,436 | 44 | 3,232,310 | 250 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,287 | 4 | 34,982 | 378 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,284 | 4 | 133,637 | 162 |
| review:measurement | claude-opus-5-5 | 11 | 1,854 | 22 | 1,565,657 | 196 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,553 | 4 | 133,623 | 17 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,483 | 4 | 133,623 | 85 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,171 | 4 | 98,650 | 144 |
| review:bugs | claude-opus-5-5 | 17 | 1,070 | 34 | 2,376,455 | 355 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 468 | 4 | 133,679 | 87 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 165 | 4 | 133,624 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 97,431 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 133,679 | 72 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 34,982 | 361 |


wall: 2027s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 10 | 12,381 | 1,005,461 | 1907 | 02:49:29 | 03:21:15 |
| review | 3 | 5,360 | 7,174,422 | 360 | 02:49:29 | 02:55:29 |
| triage | 1 | 3,042 | 101,438 | 29 | 03:21:17 | 03:21:46 |
| capture | 1 | 148 | 97,431 | 13 | 03:21:48 | 03:22:01 |
| synthesize | 1 | 8,554 | 406,234 | 73 | 03:22:03 | 03:23:16 |

- **claude-sonnet-5-5**: 3 agent · 8 calls · out 11,744 · in 16 · cache_read 605,103 · cache_create 363,125
- **claude-haiku-5-5**: 10 agent · 20 calls · out 12,381 · in 40 · cache_read 1,005,461 · cache_create 1,043,092
- **claude-opus-5-5**: 3 agent · 50 calls · out 5,360 · in 100 · cache_read 7,174,422 · cache_create 490,468

