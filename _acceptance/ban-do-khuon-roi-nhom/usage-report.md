### S4 round 1 — wf_2cdaaaa2-3f8 (20 agent, 88,355 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 80 | 29,022 | 160 | 5,943,755 | 957 |
| review:measurement | claude-opus-5-5 | 6 | 8,514 | 12 | 339,223 | 103 |
| review:bugs | claude-opus-5-5 | 13 | 8,278 | 26 | 934,197 | 103 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,844 | 4 | 60,716 | 48 |
| review:conventions | claude-opus-5-5 | 12 | 7,780 | 24 | 801,936 | 97 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 3,693 | 6 | 106,351 | 45 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 3,259 | 10 | 160,837 | 814 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,136 | 4 | 3,140 | 445 |
| triage | claude-sonnet-5-5 | 2 | 2,826 | 4 | 48,123 | 23 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,113 | 4 | 47,912 | 100 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 1,930 | 8 | 106,973 | 657 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,860 | 4 | 47,912 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,672 | 4 | 44,781 | 188 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,236 | 4 | 47,968 | 133 |
| machine:node tests/scripts/ban-do-khuon-roi-nhom | claude-haiku-5-5 | 2 | 1,027 | 4 | 47,936 | 21 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,006 | 4 | 47,968 | 102 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 945 | 4 | 47,913 | 6 |
| machine:node tests/scripts/ban-do-khuon-roi-nhom | claude-haiku-5-5 | 2 | 895 | 4 | 47,932 | 22 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 789 | 4 | 47,938 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 530 | 4 | 43,562 | 10 |


wall: 3535s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,693 | 106,351 | 45 | 09:49:38 | 09:50:23 |
| machine | 13 | 48,890 | 6,642,965 | 3447 | 09:49:38 | 10:47:05 |
| review | 3 | 24,572 | 2,075,356 | 104 | 09:49:38 | 09:51:22 |
| triage | 1 | 2,826 | 48,123 | 23 | 10:47:07 | 10:47:30 |
| capture | 1 | 530 | 43,562 | 10 | 10:47:32 | 10:47:43 |
| synthesize | 1 | 7,844 | 60,716 | 49 | 10:47:44 | 10:48:33 |

- **claude-haiku-5-5**: 13 agent · 109 calls · out 48,890 · in 218 · cache_read 6,642,965 · cache_create 864,090
- **claude-opus-5-5**: 3 agent · 31 calls · out 24,572 · in 62 · cache_read 2,075,356 · cache_create 294,397
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 14,893 · in 18 · cache_read 258,752 · cache_create 240,163

