### S4 round 1 — wf_c6ab635b-690 (34 agent, 122,886 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 18 | 19,573 | 36 | 2,493,550 | 252 |
| review:conventions | claude-opus-5-5 | 17 | 16,218 | 34 | 2,456,646 | 195 |
| review:measurement | claude-opus-5-5 | 13 | 15,751 | 26 | 1,907,354 | 177 |
| synthesize:report | claude-sonnet-5-5 | 4 | 15,126 | 8 | 395,660 | 98 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 9,043 | 4 | 110,726 | 49 |
| triage | claude-sonnet-5-5 | 2 | 2,990 | 4 | 105,762 | 25 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,632 | 4 | 137,297 | 155 |
| machine:bash -c 'out=$(node tests/scripts/evals- | claude-haiku-5-5 | 2 | 2,505 | 4 | 137,378 | 19 |
| machine:node tests/scripts/evals-sat-le-vi-phan. | claude-haiku-5-5 | 2 | 2,464 | 4 | 137,324 | 16 |
| machine:bash -c 'out=$(node tests/scripts/evals- | claude-haiku-5-5 | 2 | 2,338 | 4 | 137,381 | 17 |
| machine:bash -c 'out=$(node tests/scripts/evals- | claude-haiku-5-5 | 2 | 2,267 | 4 | 137,382 | 17 |
| machine:bash -c 'out=$(node tests/scripts/evals- | claude-haiku-5-5 | 2 | 2,127 | 4 | 137,374 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,111 | 4 | 34,982 | 461 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,997 | 4 | 137,283 | 82 |
| refute:evals-sat-le.test.mjs | claude-sonnet-5-5 | 4 | 1,949 | 8 | 360,204 | 20 |
| machine:bash -c 'out=$(node tests/scripts/evals- | claude-haiku-5-5 | 2 | 1,930 | 4 | 137,378 | 17 |
| machine:bash -c 'out=$(node tests/scripts/evals- | claude-haiku-5-5 | 2 | 1,868 | 4 | 137,374 | 13 |
| machine:bash -c 'out=$(node tests/scripts/evals- | claude-haiku-5-5 | 2 | 1,856 | 4 | 137,370 | 16 |
| machine:bash -c 'out=$(node tests/scripts/evals- | claude-haiku-5-5 | 2 | 1,828 | 4 | 137,395 | 24 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,763 | 4 | 137,297 | 243 |
| refute:evals-sat-le.test.mjs | claude-sonnet-5-5 | 4 | 1,704 | 8 | 367,446 | 19 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,546 | 4 | 102,289 | 129 |
| machine:bash -c 'out=$(node tests/scripts/evals- | claude-haiku-5-5 | 2 | 1,479 | 4 | 137,370 | 19 |
| judge:J1:domain-correctness | claude-sonnet-5-5 | 3 | 1,448 | 6 | 211,237 | 27 |
| judge:J1:spec-alignment | claude-sonnet-5-5 | 3 | 1,395 | 6 | 246,136 | 20 |
| refute:evals-sat-le.test.mjs | claude-sonnet-5-5 | 4 | 1,232 | 8 | 327,879 | 15 |
| judge:J1:operational-feasibility | claude-sonnet-5-5 | 3 | 1,172 | 6 | 246,158 | 17 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,067 | 4 | 137,339 | 76 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 798 | 4 | 137,339 | 76 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 736 | 4 | 137,283 | 9 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 683 | 4 | 137,284 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 586 | 4 | 137,339 | 296 |
| capture:provenance | claude-sonnet-5-5 | 2 | 359 | 4 | 101,090 | 7 |
| machine:bash -c 'out=$(node tests/scripts/evals- | claude-haiku-5-5 | 2 | 345 | 4 | 137,374 | 14 |


wall: 1686s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 9,043 | 110,726 | 49 | 13:25:48 | 13:26:37 |
| machine | 21 | 34,926 | 2,746,832 | 1532 | 13:25:48 | 13:51:20 |
| judge | 3 | 4,015 | 703,531 | 27 | 13:26:05 | 13:26:32 |
| review | 3 | 51,542 | 6,857,550 | 259 | 13:26:07 | 13:30:25 |
| triage | 1 | 2,990 | 105,762 | 25 | 13:51:20 | 13:51:46 |
| refute | 3 | 4,885 | 1,055,529 | 23 | 13:51:46 | 13:52:09 |
| capture | 1 | 359 | 101,090 | 7 | 13:52:09 | 13:52:16 |
| synthesize | 1 | 15,126 | 395,660 | 98 | 13:52:16 | 13:53:54 |

- **claude-opus-5-5**: 3 agent · 48 calls · out 51,542 · in 96 · cache_read 6,857,550 · cache_create 470,438
- **claude-sonnet-5-5**: 10 agent · 31 calls · out 36,418 · in 62 · cache_read 2,472,298 · cache_create 1,042,764
- **claude-haiku-5-5**: 21 agent · 42 calls · out 34,926 · in 84 · cache_read 2,746,832 · cache_create 1,706,095

