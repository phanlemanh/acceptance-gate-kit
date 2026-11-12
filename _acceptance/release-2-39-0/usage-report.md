### S4 round 1 — wf_2ae2bf11-a62 (28 agent, 120,273 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 8 | 15,148 | 16 | 668,692 | 107 |
| review:bugs | claude-opus-5-5 | 37 | 15,017 | 74 | 3,968,937 | 294 |
| review:conventions | claude-opus-5-5 | 23 | 12,678 | 46 | 2,023,860 | 175 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 8 | 12,277 | 16 | 653,800 | 97 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 12,226 | 6 | 134,307 | 75 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 9 | 10,349 | 18 | 738,469 | 89 |
| review:measurement | claude-opus-5-5 | 14 | 10,085 | 28 | 1,144,934 | 132 |
| synthesize:report | claude-sonnet-5-5 | 2 | 8,905 | 4 | 62,881 | 68 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,385 | 6 | 106,233 | 31 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 2,698 | 8 | 163,733 | 15 |
| refute:eval-yaml.js | claude-sonnet-5-5 | 3 | 1,410 | 6 | 98,222 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,389 | 4 | 48,778 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 1,358 | 6 | 102,038 | 10 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,184 | 4 | 48,764 | 8 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,136 | 4 | 48,764 | 7 |
| machine:bash _acceptance/release-2-39-0/ba-viec- | claude-haiku-5-5 | 2 | 1,134 | 4 | 48,781 | 8 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,042 | 4 | 48,773 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 998 | 4 | 48,778 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 994 | 4 | 48,778 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 993 | 4 | 45,520 | 7 |
| machine:GIT_GLOB_PATHSPECS=1 bash _acceptance/re | claude-haiku-5-5 | 2 | 945 | 4 | 48,902 | 7 |
| machine:bash _acceptance/release-2-38-0/lop-chep | claude-haiku-5-5 | 2 | 908 | 4 | 48,792 | 7 |
| triage | claude-sonnet-5-5 | 2 | 850 | 4 | 46,871 | 13 |
| machine:bash -c 'c=$(git show 88d31b63:diagram-d | claude-haiku-5-5 | 2 | 770 | 4 | 48,896 | 7 |
| machine:bash _acceptance/release-2-39-0/goi-chi- | claude-haiku-5-5 | 2 | 723 | 4 | 48,789 | 6 |
| machine:node _acceptance/release-2-39-0/su-mo-ta | claude-haiku-5-5 | 2 | 691 | 4 | 48,780 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 624 | 4 | 48,765 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 356 | 4 | 44,252 | 9 |


wall: 407s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| judge | 3 | 37,774 | 2,060,961 | 112 | 14:24:26 | 14:26:18 |
| review | 3 | 37,780 | 7,137,731 | 300 | 14:24:26 | 14:29:26 |
| baseline | 1 | 12,226 | 134,307 | 75 | 14:24:26 | 14:25:40 |
| machine | 17 | 20,972 | 1,051,864 | 114 | 14:24:26 | 14:26:19 |
| triage | 1 | 850 | 46,871 | 13 | 14:29:26 | 14:29:39 |
| refute | 1 | 1,410 | 98,222 | 16 | 14:29:39 | 14:29:55 |
| capture | 1 | 356 | 44,252 | 9 | 14:29:55 | 14:30:04 |
| synthesize | 1 | 8,905 | 62,881 | 68 | 14:30:04 | 14:31:12 |

- **claude-sonnet-5-5**: 8 agent · 37 calls · out 61,521 · in 74 · cache_read 2,447,494 · cache_create 733,674
- **claude-opus-5-5**: 3 agent · 74 calls · out 37,780 · in 148 · cache_read 7,137,731 · cache_create 371,843
- **claude-haiku-5-5**: 17 agent · 38 calls · out 20,972 · in 76 · cache_read 1,051,864 · cache_create 863,884

