### S4 round 1 — wf_c6937cb0-209 (22 agent, 47,375 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 13,330 | 12 | 663,001 | 114 |
| review:bugs | claude-opus-5-5 | 12 | 4,585 | 24 | 1,595,326 | 201 |
| triage | claude-sonnet-5-5 | 2 | 4,011 | 4 | 102,574 | 32 |
| ui:E9 | claude-sonnet-5-5 | 13 | 2,939 | 26 | 1,374,530 | 73 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,700 | 4 | 34,982 | 495 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,664 | 4 | 34,982 | 401 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,380 | 4 | 133,406 | 122 |
| review:measurement | claude-opus-5-5 | 15 | 2,306 | 30 | 2,014,971 | 209 |
| review:conventions | claude-opus-5-5 | 14 | 2,054 | 28 | 1,973,002 | 253 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,728 | 4 | 133,392 | 85 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,633 | 4 | 133,392 | 13 |
| judge:E3:operational-feasibility | claude-sonnet-5-5 | 3 | 1,548 | 6 | 245,882 | 23 |
| refute:can-cu-s1.ca.mjs | claude-sonnet-5-5 | 4 | 1,157 | 8 | 321,323 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,155 | 4 | 98,382 | 141 |
| judge:E3:domain-correctness | claude-sonnet-5-5 | 6 | 868 | 12 | 575,331 | 35 |
| judge:E3:spec-alignment | claude-sonnet-5-5 | 4 | 600 | 8 | 365,389 | 29 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 598 | 4 | 133,448 | 83 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 394 | 4 | 133,393 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 330 | 4 | 133,448 | 70 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 97,200 | 7 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 124 | 4 | 100,375 | 143 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 124 | 4 | 34,982 | 329 |


wall: 1949s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 124 | 100,375 | 143 | 10:46:31 | 10:48:54 |
| machine | 10 | 13,706 | 1,003,807 | 1764 | 10:46:31 | 11:15:55 |
| ui | 1 | 2,939 | 1,374,530 | 73 | 10:46:31 | 10:47:44 |
| judge | 3 | 3,016 | 1,186,602 | 35 | 10:46:31 | 10:47:06 |
| review | 3 | 8,945 | 5,583,299 | 253 | 10:46:31 | 10:50:44 |
| triage | 1 | 4,011 | 102,574 | 32 | 11:15:57 | 11:16:30 |
| refute | 1 | 1,157 | 321,323 | 23 | 11:16:32 | 11:16:56 |
| capture | 1 | 147 | 97,200 | 7 | 11:16:57 | 11:17:04 |
| synthesize | 1 | 13,330 | 663,001 | 114 | 11:17:06 | 11:19:00 |

- **claude-sonnet-5-5**: 9 agent · 42 calls · out 24,724 · in 84 · cache_read 3,845,605 · cache_create 1,009,275
- **claude-opus-5-5**: 3 agent · 41 calls · out 8,945 · in 82 · cache_read 5,583,299 · cache_create 507,163
- **claude-haiku-5-5**: 10 agent · 20 calls · out 13,706 · in 40 · cache_read 1,003,807 · cache_create 1,039,953

### S4 round 2 — wf_c6eb6068-3cb (20 agent, 27,106 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 7 | 6,090 | 14 | 781,291 | 66 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,689 | 4 | 34,982 | 495 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,511 | 4 | 34,982 | 403 |
| triage | claude-sonnet-5-5 | 2 | 1,882 | 4 | 100,225 | 19 |
| judge:E3:spec-alignment | claude-sonnet-5-5 | 4 | 1,713 | 8 | 361,887 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,680 | 4 | 133,447 | 119 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,526 | 4 | 133,433 | 15 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,508 | 4 | 133,433 | 83 |
| review:bugs | claude-opus-5-5 | 16 | 1,454 | 32 | 1,926,936 | 162 |
| judge:E3:operational-feasibility | claude-sonnet-5-5 | 6 | 1,135 | 12 | 609,181 | 39 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,116 | 4 | 98,460 | 140 |
| review:conventions | claude-opus-5-5 | 7 | 985 | 14 | 668,467 | 85 |
| review:measurement | claude-opus-5-5 | 5 | 878 | 10 | 446,421 | 75 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 641 | 4 | 133,489 | 92 |
| judge:E3:domain-correctness | claude-sonnet-5-5 | 7 | 565 | 14 | 670,536 | 40 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 211 | 4 | 133,434 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 97,241 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 124 | 4 | 34,982 | 366 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 124 | 4 | 100,453 | 148 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 133,489 | 76 |


wall: 1917s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 124 | 100,453 | 148 | 12:27:41 | 12:30:08 |
| machine | 10 | 12,129 | 1,004,131 | 1816 | 12:27:41 | 12:57:57 |
| judge | 3 | 3,413 | 1,641,604 | 43 | 12:27:41 | 12:28:24 |
| review | 3 | 3,317 | 3,041,824 | 167 | 12:27:41 | 12:30:28 |
| triage | 1 | 1,882 | 100,225 | 19 | 12:57:59 | 12:58:17 |
| capture | 1 | 151 | 97,241 | 10 | 12:58:20 | 12:58:29 |
| synthesize | 1 | 6,090 | 781,291 | 67 | 12:58:31 | 12:59:38 |

- **claude-sonnet-5-5**: 7 agent · 30 calls · out 11,660 · in 60 · cache_read 2,720,814 · cache_create 764,257
- **claude-haiku-5-5**: 10 agent · 20 calls · out 12,129 · in 40 · cache_read 1,004,131 · cache_create 1,040,762
- **claude-opus-5-5**: 3 agent · 28 calls · out 3,317 · in 56 · cache_read 3,041,824 · cache_create 395,703

