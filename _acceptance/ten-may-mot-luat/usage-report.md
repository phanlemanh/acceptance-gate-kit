### S4 round 1 — wf_ebe2817a-8c5 (24 agent, 57,741 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| baseline:diffBase | claude-sonnet-5-5 | 3 | 7,455 | 6 | 100,618 | 238 |
| synthesize:report | claude-sonnet-5-5 | 2 | 6,648 | 4 | 50,747 | 39 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 11 | 5,567 | 22 | 387,480 | 1294 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 15 | 5,501 | 30 | 594,874 | 1219 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 13 | 5,026 | 26 | 490,702 | 1578 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 14 | 4,698 | 28 | 524,045 | 1388 |
| review:measurement | claude-opus-5-5 | 6 | 3,427 | 12 | 261,305 | 41 |
| review:bugs | claude-opus-5-5 | 9 | 2,934 | 18 | 420,340 | 357 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,877 | 4 | 39,184 | 126 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,792 | 4 | 39,184 | 23 |
| review:conventions | claude-opus-5-5 | 6 | 1,760 | 12 | 229,009 | 42 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,305 | 4 | 39,144 | 315 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 1,238 | 4 | 39,386 | 12 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 964 | 4 | 39,365 | 306 |
| triage | claude-sonnet-5-5 | 2 | 963 | 4 | 37,431 | 11 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 940 | 4 | 39,422 | 13 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 913 | 4 | 39,387 | 10 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 864 | 4 | 39,398 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 829 | 4 | 39,240 | 301 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 754 | 4 | 39,398 | 16 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 704 | 4 | 39,240 | 279 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 623 | 4 | 39,210 | 7 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 590 | 4 | 39,185 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 369 | 4 | 34,840 | 7 |


wall: 6625s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,455 | 100,618 | 238 | 15:50:18 | 15:54:16 |
| machine | 17 | 34,185 | 2,507,844 | 6560 | 15:50:18 | 17:39:39 |
| review | 3 | 8,121 | 910,654 | 359 | 15:50:19 | 15:56:17 |
| triage | 1 | 963 | 37,431 | 11 | 17:39:42 | 17:39:53 |
| capture | 1 | 369 | 34,840 | 7 | 17:39:55 | 17:40:02 |
| synthesize | 1 | 6,648 | 50,747 | 39 | 17:40:04 | 17:40:43 |

- **claude-sonnet-5-5**: 4 agent · 9 calls · out 15,435 · in 18 · cache_read 223,636 · cache_create 195,317
- **claude-haiku-5-5**: 17 agent · 79 calls · out 34,185 · in 158 · cache_read 2,507,844 · cache_create 800,723
- **claude-opus-5-5**: 3 agent · 21 calls · out 8,121 · in 42 · cache_read 910,654 · cache_create 168,675

