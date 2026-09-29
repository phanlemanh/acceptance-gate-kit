### S3 execute-parallel (T1–T3) — wf_a3b48055-d63 (3 agent, 9,529 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| exec:Task 1 | claude-opus-5-5 | 30 | 5,062 | 60 | 4,657,331 | 324 |
| exec:Task 3 | claude-opus-5-5 | 23 | 2,521 | 46 | 3,766,758 | 374 |
| exec:Task 2 | claude-opus-5-5 | 22 | 1,946 | 44 | 3,104,498 | 378 |


wall: 379s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| exec | 3 | 9,529 | 11,528,587 | 379 | 02:02:44 | 02:09:03 |

- **claude-opus-5-5**: 3 agent · 75 calls · out 9,529 · in 150 · cache_read 11,528,587 · cache_create 564,350

### S4 round 1 — wf_102da196-734 (21 agent, 41,840 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 8,687 | 8 | 439,739 | 73 |
| triage | claude-sonnet-5-5 | 2 | 6,691 | 4 | 123,049 | 52 |
| review:measurement | claude-opus-5-5 | 9 | 3,980 | 18 | 1,374,497 | 143 |
| review:conventions | claude-opus-5-5 | 30 | 3,875 | 60 | 5,203,691 | 280 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,737 | 18 | 118,841 | 174 |
| review:bugs | claude-opus-5-5 | 17 | 2,694 | 34 | 2,583,314 | 210 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,939 | 18 | 118,841 | 132 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 2 | 1,750 | 4 | 149,417 | 15 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 2 | 1,701 | 4 | 149,415 | 14 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 2 | 1,655 | 4 | 116,594 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,259 | 18 | 91,390 | 29 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,217 | 18 | 118,828 | 29 |
| machine:bash -c 'out=$(for f in msbv-so msbv-the | claude-haiku-4-5-20251001 | 2 | 997 | 18 | 119,107 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 496 | 18 | 118,836 | 130 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 406 | 8 | 367,234 | 24 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 375 | 18 | 118,877 | 99 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 370 | 18 | 118,841 | 185 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 323 | 18 | 118,877 | 87 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 282 | 18 | 118,877 | 255 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 251 | 18 | 118,835 | 10 |
| capture:provenance | claude-sonnet-5-5 | 2 | 155 | 4 | 115,736 | 6 |


wall: 1276s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 406 | 367,234 | 24 | 02:41:51 | 02:42:15 |
| machine | 11 | 10,246 | 1,280,150 | 1141 | 02:41:51 | 03:00:52 |
| judge | 3 | 5,106 | 415,426 | 17 | 02:41:51 | 02:42:08 |
| review | 3 | 10,549 | 9,161,502 | 280 | 02:41:51 | 02:46:31 |
| triage | 1 | 6,691 | 123,049 | 52 | 03:00:53 | 03:01:45 |
| capture | 1 | 155 | 115,736 | 6 | 03:01:46 | 03:01:53 |
| synthesize | 1 | 8,687 | 439,739 | 73 | 03:01:54 | 03:03:07 |

- **claude-sonnet-5-5**: 7 agent · 18 calls · out 21,045 · in 36 · cache_read 1,461,184 · cache_create 842,865
- **claude-opus-5-5**: 3 agent · 56 calls · out 10,549 · in 112 · cache_read 9,161,502 · cache_create 541,545
- **claude-haiku-4-5-20251001**: 11 agent · 22 calls · out 10,246 · in 198 · cache_read 1,280,150 · cache_create 795,059

