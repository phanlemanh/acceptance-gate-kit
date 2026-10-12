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

