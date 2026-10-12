### S4 round 1 — wf_9eb872c7-3ca (21 agent, 46,948 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 14,437 | 4 | 123,267 | 89 |
| ui:E11 | claude-sonnet-5-5 | 8 | 5,166 | 16 | 774,105 | 80 |
| review:measurement | claude-opus-5-5 | 11 | 3,915 | 22 | 1,442,071 | 198 |
| review:conventions | claude-opus-5-5 | 27 | 3,377 | 54 | 4,547,098 | 295 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,650 | 4 | 34,982 | 528 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,459 | 4 | 34,982 | 353 |
| review:bugs | claude-opus-5-5 | 24 | 2,348 | 48 | 3,250,302 | 267 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,231 | 4 | 133,391 | 145 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 4 | 1,909 | 8 | 357,179 | 22 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 4 | 1,737 | 8 | 355,332 | 21 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,509 | 4 | 133,377 | 84 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 3 | 1,454 | 6 | 210,492 | 21 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,344 | 4 | 133,377 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 801 | 4 | 97,979 | 179 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 488 | 4 | 133,433 | 79 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 418 | 4 | 133,433 | 68 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 186 | 4 | 133,378 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 97,183 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 126 | 4 | 34,982 | 332 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 125 | 4 | 99,966 | 149 |
| triage | claude-sonnet-5-5 | 2 | 120 | 4 | 104,927 | 51 |


wall: 1955s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 125 | 99,966 | 149 | 21:37:44 | 21:40:13 |
| machine | 10 | 12,212 | 1,003,314 | 1803 | 21:37:44 | 22:07:47 |
| ui | 1 | 5,166 | 774,105 | 80 | 21:37:44 | 21:39:04 |
| judge | 3 | 5,100 | 923,003 | 25 | 21:37:44 | 21:38:09 |
| review | 3 | 9,640 | 9,239,471 | 295 | 21:37:44 | 21:42:39 |
| triage | 1 | 120 | 104,927 | 51 | 22:07:49 | 22:08:40 |
| capture | 1 | 148 | 97,183 | 6 | 22:08:42 | 22:08:48 |
| synthesize | 1 | 14,437 | 123,267 | 89 | 22:08:50 | 22:10:20 |

- **claude-sonnet-5-5**: 8 agent · 27 calls · out 25,096 · in 54 · cache_read 2,122,451 · cache_create 889,991
- **claude-opus-5-5**: 3 agent · 62 calls · out 9,640 · in 124 · cache_read 9,239,471 · cache_create 500,205
- **claude-haiku-5-5**: 10 agent · 20 calls · out 12,212 · in 40 · cache_read 1,003,314 · cache_create 1,039,501

### S4 round 2 — wf_a3429b82-60a (21 agent, 33,780 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 7 | 8,076 | 14 | 835,239 | 100 |
| ui:E11 | claude-sonnet-5-5 | 15 | 2,940 | 30 | 1,568,652 | 71 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,792 | 4 | 34,982 | 552 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,394 | 4 | 133,225 | 152 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,288 | 4 | 34,982 | 399 |
| review:conventions | claude-opus-5-5 | 19 | 1,921 | 38 | 2,216,762 | 124 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 4 | 1,882 | 8 | 356,472 | 21 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 5 | 1,739 | 10 | 472,993 | 24 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,718 | 4 | 133,211 | 84 |
| triage | claude-sonnet-5-5 | 2 | 1,634 | 4 | 99,403 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,547 | 4 | 133,211 | 12 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 3 | 1,438 | 6 | 212,571 | 20 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,037 | 4 | 98,071 | 210 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 614 | 4 | 133,267 | 88 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 373 | 4 | 133,212 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 367 | 4 | 34,982 | 368 |
| capture:provenance | claude-sonnet-5-5 | 2 | 322 | 4 | 97,017 | 8 |
| review:measurement | claude-opus-5-5 | 6 | 219 | 12 | 586,965 | 35 |
| review:bugs | claude-opus-5-5 | 6 | 177 | 12 | 586,950 | 80 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 153 | 4 | 100,058 | 203 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 149 | 4 | 133,267 | 76 |


wall: 2097s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 153 | 100,058 | 203 | 22:56:26 | 22:59:48 |
| machine | 10 | 13,279 | 1,002,410 | 1968 | 22:56:26 | 23:29:14 |
| ui | 1 | 2,940 | 1,568,652 | 71 | 22:56:26 | 22:57:37 |
| judge | 3 | 5,059 | 1,042,036 | 26 | 22:56:26 | 22:56:52 |
| review | 3 | 2,317 | 3,390,677 | 124 | 22:56:26 | 22:58:29 |
| triage | 1 | 1,634 | 99,403 | 15 | 23:29:16 | 23:29:31 |
| capture | 1 | 322 | 97,017 | 8 | 23:29:33 | 23:29:41 |
| synthesize | 1 | 8,076 | 835,239 | 100 | 23:29:43 | 23:31:23 |

- **claude-sonnet-5-5**: 8 agent · 40 calls · out 18,184 · in 80 · cache_read 3,742,405 · cache_create 910,531
- **claude-haiku-5-5**: 10 agent · 20 calls · out 13,279 · in 40 · cache_read 1,002,410 · cache_create 1,048,859
- **claude-opus-5-5**: 3 agent · 31 calls · out 2,317 · in 62 · cache_read 3,390,677 · cache_create 303,369

