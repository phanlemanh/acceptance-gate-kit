### S4 round 1 — wf_5c09f7a7-2e5 (23 agent, 68,749 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 21 | 9,040 | 42 | 1,329,776 | 275 |
| synthesize:report | claude-sonnet-5-5 | 4 | 8,457 | 8 | 186,843 | 50 |
| review:measurement | claude-opus-5-5 | 9 | 7,846 | 18 | 446,632 | 122 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 11 | 6,738 | 22 | 389,222 | 974 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 6,493 | 6 | 97,340 | 44 |
| review:bugs | claude-opus-5-5 | 9 | 6,020 | 18 | 454,683 | 194 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,373 | 4 | 6,280 | 565 |
| triage | claude-sonnet-5-5 | 2 | 2,511 | 4 | 43,146 | 19 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,355 | 4 | 6,280 | 321 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,174 | 4 | 39,072 | 93 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,844 | 4 | 39,072 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,785 | 4 | 39,081 | 221 |
| machine:bash -c 'out=$(node tests/scripts/pre-me | claude-haiku-5-5 | 2 | 1,296 | 4 | 39,282 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 1,284 | 6 | 42,976 | 615 |
| machine:bash -c 'out=$(node tests/scripts/pre-me | claude-haiku-5-5 | 2 | 1,197 | 4 | 39,271 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,067 | 4 | 39,128 | 75 |
| machine:bash -c 'out=$(node tests/scripts/pre-me | claude-haiku-5-5 | 2 | 970 | 4 | 39,257 | 11 |
| machine:bash -c 'out=$(node tests/scripts/pre-me | claude-haiku-5-5 | 2 | 960 | 4 | 39,263 | 11 |
| machine:bash -c 'out=$(node tests/scripts/pre-me | claude-haiku-5-5 | 2 | 942 | 4 | 39,256 | 12 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 753 | 4 | 39,098 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 681 | 4 | 39,128 | 104 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 583 | 4 | 39,073 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 380 | 4 | 37,727 | 5 |


wall: 3098s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 6,493 | 97,340 | 44 | 11:25:14 | 11:25:58 |
| machine | 16 | 28,002 | 914,739 | 3016 | 11:25:14 | 12:15:30 |
| review | 3 | 22,906 | 2,231,091 | 275 | 11:25:14 | 11:29:50 |
| triage | 1 | 2,511 | 43,146 | 19 | 12:15:32 | 12:15:52 |
| capture | 1 | 380 | 37,727 | 5 | 12:15:54 | 12:15:59 |
| synthesize | 1 | 8,457 | 186,843 | 50 | 12:16:02 | 12:16:52 |

- **claude-opus-5-5**: 3 agent · 39 calls · out 22,906 · in 78 · cache_read 2,231,091 · cache_create 219,626
- **claude-sonnet-5-5**: 4 agent · 11 calls · out 17,841 · in 22 · cache_read 365,056 · cache_create 187,810
- **claude-haiku-5-5**: 16 agent · 42 calls · out 28,002 · in 84 · cache_read 914,739 · cache_create 736,311

