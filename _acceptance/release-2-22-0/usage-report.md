### S4 round 1 — wf_879e5615-763 (19 agent, 17,145 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 7 | 2,295 | 14 | 576,730 | 216 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,222 | 18 | 90,432 | 155 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,767 | 18 | 90,432 | 139 |
| triage | claude-sonnet-5-5 | 2 | 1,757 | 4 | 83,705 | 16 |
| baseline:diffBase | claude-sonnet-5-5 | 9 | 1,421 | 18 | 530,116 | 1054 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,411 | 18 | 90,432 | 296 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,362 | 18 | 90,419 | 27 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,296 | 18 | 90,419 | 24 |
| review:bugs | claude-opus-5-5 | 10 | 1,003 | 20 | 860,260 | 132 |
| machine:bash scripts/rel-cua-so.sh 8d1f5162 tran | claude-haiku-4-5-20251001 | 2 | 474 | 18 | 90,453 | 12 |
| machine:bash -c 'c=$(git show 8d1f5162:diagram-d | claude-haiku-4-5-20251001 | 2 | 423 | 18 | 90,519 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 35 | 372 | 282 | 2,532,044 | 779 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 351 | 18 | 90,427 | 130 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 258 | 18 | 90,426 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 255 | 18 | 90,468 | 69 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 187 | 18 | 90,468 | 254 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 80,286 | 6 |
| review:conventions | claude-opus-5-5 | 8 | 126 | 16 | 638,838 | 116 |
| synthesize:report | claude-sonnet-5-5 | 3 | 18 | 6 | 195,275 | 36 |


wall: 1961s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,421 | 530,116 | 1054 | 23:53:01 | 00:10:35 |
| machine | 12 | 10,378 | 3,526,939 | 1898 | 23:53:01 | 00:24:39 |
| review | 3 | 3,424 | 2,075,828 | 218 | 23:53:01 | 23:56:39 |
| triage | 1 | 1,757 | 83,705 | 16 | 00:24:41 | 00:24:57 |
| capture | 1 | 147 | 80,286 | 6 | 00:24:58 | 00:25:04 |
| synthesize | 1 | 18 | 195,275 | 36 | 00:25:06 | 00:25:43 |

- **claude-opus-5-5**: 3 agent · 25 calls · out 3,424 · in 50 · cache_read 2,075,828 · cache_create 227,652
- **claude-haiku-4-5-20251001**: 12 agent · 57 calls · out 10,378 · in 480 · cache_read 3,526,939 · cache_create 566,889
- **claude-sonnet-5-5**: 4 agent · 16 calls · out 3,343 · in 32 · cache_read 889,382 · cache_create 553,999

