### S4 round 1 — wf_5790954a-91e (23 agent, 41,402 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 12,739 | 8 | 190,937 | 85 |
| triage | claude-sonnet-5-5 | 2 | 4,937 | 4 | 38,223 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,831 | 4 | 2,869 | 450 |
| machine:node tests/scripts/moc-chien-dich.test.m | claude-haiku-5-5 | 2 | 2,819 | 4 | 35,395 | 22 |
| review:conventions | claude-opus-5-5 | 35 | 2,721 | 70 | 3,728,796 | 884 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,589 | 4 | 2,869 | 401 |
| review:bugs | claude-opus-5-5 | 27 | 2,552 | 54 | 2,469,605 | 207 |
| review:measurement | claude-opus-5-5 | 9 | 1,717 | 18 | 614,407 | 120 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,598 | 4 | 2,869 | 371 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,515 | 4 | 35,385 | 84 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 873 | 4 | 35,441 | 84 |
| machine:LT_CASES=LT-97,LT-97-do,LT-97-do2 node t | claude-haiku-5-5 | 2 | 872 | 4 | 35,429 | 16 |
| machine:node tests/scripts/moc-chien-dich-crm.mj | claude-haiku-5-5 | 2 | 627 | 4 | 35,398 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 585 | 4 | 35,394 | 139 |
| refute:evals.yaml | claude-sonnet-5-5 | 3 | 515 | 6 | 71,421 | 12 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 419 | 4 | 35,411 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 378 | 4 | 35,441 | 73 |
| refute:evals.yaml | claude-sonnet-5-5 | 3 | 367 | 6 | 67,413 | 13 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 203 | 4 | 36,134 | 29 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 184 | 4 | 35,385 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 2,869 | 390 |
| capture:provenance | claude-sonnet-5-5 | 2 | 156 | 4 | 31,305 | 10 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 32 | 4 | 32,517 | 5 |


wall: 2187s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 203 | 36,134 | 29 | 09:27:40 | 09:28:08 |
| machine | 14 | 15,495 | 362,672 | 2036 | 09:27:40 | 10:01:36 |
| review | 3 | 6,990 | 6,812,808 | 884 | 09:27:40 | 09:42:24 |
| triage | 1 | 4,937 | 38,223 | 36 | 10:01:38 | 10:02:13 |
| refute | 2 | 882 | 138,834 | 15 | 10:02:15 | 10:02:30 |
| capture | 1 | 156 | 31,305 | 10 | 10:02:31 | 10:02:41 |
| synthesize | 1 | 12,739 | 190,937 | 85 | 10:02:42 | 10:04:07 |

- **claude-sonnet-5-5**: 6 agent · 16 calls · out 18,917 · in 32 · cache_read 435,433 · cache_create 269,095
- **claude-haiku-5-5**: 14 agent · 28 calls · out 15,495 · in 56 · cache_read 362,672 · cache_create 613,147
- **claude-opus-5-5**: 3 agent · 71 calls · out 6,990 · in 142 · cache_read 6,812,808 · cache_create 521,468

