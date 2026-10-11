### S4 round 1 — wf_eeef1634-b1f (22 agent, 46,430 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 10,131 | 6 | 219,442 | 78 |
| judge:E8b:spec-alignment | claude-sonnet-5-5 | 5 | 4,949 | 10 | 461,759 | 49 |
| judge:E8b:domain-correctness | claude-sonnet-5-5 | 4 | 4,627 | 8 | 287,108 | 41 |
| triage | claude-sonnet-5-5 | 2 | 4,320 | 4 | 86,261 | 33 |
| judge:E8b:operational-feasibility | claude-sonnet-5-5 | 5 | 4,313 | 10 | 423,990 | 51 |
| review:conventions | claude-opus-5-5 | 17 | 2,652 | 34 | 1,956,745 | 138 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,516 | 4 | 116,203 | 306 |
| review:measurement | claude-opus-5-5 | 11 | 2,166 | 22 | 1,300,729 | 176 |
| review:bugs | claude-opus-5-5 | 20 | 2,161 | 40 | 2,388,249 | 148 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,796 | 4 | 34,982 | 537 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,589 | 4 | 116,298 | 42 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,509 | 4 | 116,189 | 86 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,495 | 4 | 116,189 | 11 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 677 | 4 | 34,982 | 349 |
| machine:node tests/dieu-phoi/dp7-chieu-im.mjs | claude-haiku-5-5 | 2 | 311 | 4 | 116,207 | 4 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 257 | 4 | 116,245 | 116 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 194 | 4 | 116,198 | 177 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 186 | 4 | 116,190 | 4 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 161 | 4 | 83,725 | 36 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 79,995 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 145 | 4 | 116,245 | 67 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 116,245 | 269 |


wall: 2066s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 161 | 83,725 | 36 | 00:53:06 | 00:53:41 |
| machine | 12 | 10,798 | 1,232,173 | 1942 | 00:53:06 | 01:25:27 |
| judge | 3 | 13,889 | 1,172,857 | 54 | 00:53:06 | 00:54:00 |
| review | 3 | 6,979 | 5,645,723 | 178 | 00:53:06 | 00:56:03 |
| triage | 1 | 4,320 | 86,261 | 33 | 01:25:30 | 01:26:03 |
| capture | 1 | 152 | 79,995 | 6 | 01:26:05 | 01:26:11 |
| synthesize | 1 | 10,131 | 219,442 | 78 | 01:26:13 | 01:27:32 |

- **claude-sonnet-5-5**: 7 agent · 23 calls · out 28,653 · in 46 · cache_read 1,642,280 · cache_create 736,870
- **claude-opus-5-5**: 3 agent · 48 calls · out 6,979 · in 96 · cache_read 5,645,723 · cache_create 415,703
- **claude-haiku-5-5**: 12 agent · 24 calls · out 10,798 · in 48 · cache_read 1,232,173 · cache_create 789,087

