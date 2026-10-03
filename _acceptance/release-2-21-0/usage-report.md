### S4 round 1 — wf_3e4c02f0-926 (19 agent, 19,983 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 4,595 | 6 | 193,510 | 37 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,791 | 18 | 90,068 | 123 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,641 | 18 | 90,068 | 274 |
| baseline:diffBase | claude-sonnet-5-5 | 7 | 1,436 | 14 | 343,439 | 1004 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,408 | 18 | 90,055 | 27 |
| triage | claude-sonnet-5-5 | 2 | 1,404 | 4 | 82,825 | 18 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,297 | 18 | 90,055 | 24 |
| review:bugs | claude-opus-5-5 | 15 | 1,211 | 30 | 1,371,566 | 154 |
| review:measurement | claude-opus-5-5 | 10 | 1,053 | 20 | 890,635 | 217 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 990 | 18 | 90,063 | 134 |
| machine:bash scripts/rel-cua-so.sh 1b98fdb1 lan- | claude-haiku-4-5-20251001 | 2 | 648 | 18 | 90,145 | 12 |
| machine:bash -c 'c=$(git show 1b98fdb1:diagram-d | claude-haiku-4-5-20251001 | 2 | 524 | 18 | 90,156 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 446 | 18 | 61,075 | 85 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 6 | 391 | 50 | 357,857 | 264 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 321 | 18 | 90,062 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 281 | 18 | 90,104 | 254 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 201 | 18 | 90,104 | 72 |
| review:conventions | claude-opus-5-5 | 16 | 198 | 32 | 1,422,684 | 142 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 79,868 | 7 |


wall: 1354s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,436 | 343,439 | 1004 | 11:51:52 | 12:08:35 |
| machine | 12 | 9,939 | 1,319,812 | 1286 | 11:51:52 | 12:13:18 |
| review | 3 | 2,462 | 3,684,885 | 219 | 11:51:52 | 11:55:30 |
| triage | 1 | 1,404 | 82,825 | 18 | 12:13:20 | 12:13:37 |
| capture | 1 | 147 | 79,868 | 7 | 12:13:40 | 12:13:47 |
| synthesize | 1 | 4,595 | 193,510 | 37 | 12:13:49 | 12:14:26 |

- **claude-sonnet-5-5**: 4 agent · 14 calls · out 7,582 · in 28 · cache_read 699,642 · cache_create 540,788
- **claude-haiku-4-5-20251001**: 12 agent · 28 calls · out 9,939 · in 248 · cache_read 1,319,812 · cache_create 461,922
- **claude-opus-5-5**: 3 agent · 41 calls · out 2,462 · in 82 · cache_read 3,684,885 · cache_create 247,477

