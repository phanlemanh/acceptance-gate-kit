### S4 round 1 — wf_4111f7a8-8e4 (18 agent, 47,551 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 9,167 | 4 | 107,332 | 84 |
| review:bugs | claude-opus-5-5 | 6 | 4,877 | 12 | 558,076 | 104 |
| review:conventions | claude-opus-5-5 | 10 | 4,768 | 20 | 1,027,687 | 113 |
| review:measurement | claude-opus-5-5 | 6 | 4,367 | 12 | 572,401 | 95 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 4 | 3,987 | 34 | 246,917 | 215 |
| baseline:diffBase | claude-sonnet-5 | 5 | 3,562 | 10 | 412,957 | 73 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 4 | 2,530 | 34 | 262,275 | 241 |
| triage | claude-sonnet-5 | 2 | 2,427 | 4 | 99,345 | 32 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 6 | 2,148 | 50 | 371,881 | 322 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,547 | 58 | 474,060 | 45 |
| capture:provenance | claude-sonnet-5 | 4 | 1,360 | 8 | 322,834 | 29 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,284 | 18 | 97,009 | 223 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,157 | 18 | 96,996 | 20 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 1,060 | 18 | 97,045 | 118 |
| machine:bash -c 'out=$(node tests/scripts/duong- | claude-haiku-4-5-20251001 | 2 | 906 | 18 | 97,202 | 65 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 843 | 18 | 97,045 | 290 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 787 | 18 | 97,045 | 103 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 774 | 18 | 97,003 | 12 |


wall: 1751s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,562 | 412,957 | 73 | 10:11:57 | 10:13:09 |
| machine | 11 | 17,023 | 2,034,478 | 1602 | 10:11:57 | 10:38:38 |
| review | 3 | 14,012 | 2,158,164 | 113 | 10:11:57 | 10:13:49 |
| triage | 1 | 2,427 | 99,345 | 32 | 10:38:40 | 10:39:11 |
| capture | 1 | 1,360 | 322,834 | 29 | 10:39:13 | 10:39:42 |
| synthesize | 1 | 9,167 | 107,332 | 84 | 10:39:43 | 10:41:07 |

- **claude-sonnet-5**: 4 agent · 13 calls · out 16,516 · in 26 · cache_read 942,468 · cache_create 459,671
- **claude-opus-5-5**: 3 agent · 22 calls · out 14,012 · in 44 · cache_read 2,158,164 · cache_create 308,069
- **claude-haiku-4-5-20251001**: 11 agent · 35 calls · out 17,023 · in 302 · cache_read 2,034,478 · cache_create 573,157

