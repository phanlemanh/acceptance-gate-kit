### S4 round 1 — wf_b3578f7a-fc3 (20 agent, 21,034 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 4,122 | 8 | 362,008 | 45 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,435 | 4 | 136,023 | 224 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,925 | 4 | 69,964 | 319 |
| review:conventions | claude-opus-5-5 | 19 | 1,636 | 38 | 2,274,778 | 184 |
| baseline:diffBase | claude-sonnet-5-5 | 10 | 1,465 | 20 | 655,205 | 1535 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,344 | 4 | 136,009 | 11 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,317 | 4 | 136,009 | 56 |
| review:measurement | claude-opus-5-5 | 7 | 1,300 | 14 | 720,014 | 185 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,230 | 4 | 136,018 | 144 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,010 | 4 | 136,077 | 93 |
| triage | claude-sonnet-5-5 | 2 | 903 | 4 | 102,238 | 11 |
| review:bugs | claude-opus-5-5 | 13 | 523 | 26 | 1,455,337 | 242 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 425 | 4 | 136,065 | 82 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 303 | 4 | 136,065 | 69 |
| machine:bash scripts/rel-cua-so.sh 9d1ae527 lenh | claude-haiku-5-5 | 2 | 246 | 4 | 136,057 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 220 | 4 | 136,023 | 221 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 172 | 4 | 136,065 | 269 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 159 | 4 | 136,010 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 156 | 4 | 100,285 | 8 |
| machine:bash -c 'c=$(git show 9d1ae527:diagram-d | claude-haiku-5-5 | 2 | 143 | 4 | 136,144 | 6 |


wall: 1590s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,465 | 655,205 | 1535 | 17:37:53 | 18:03:28 |
| machine | 13 | 10,929 | 1,702,529 | 1416 | 17:37:53 | 18:01:29 |
| review | 3 | 3,459 | 4,450,129 | 245 | 17:37:53 | 17:41:58 |
| triage | 1 | 903 | 102,238 | 11 | 18:01:30 | 18:01:41 |
| capture | 1 | 156 | 100,285 | 8 | 18:03:29 | 18:03:37 |
| synthesize | 1 | 4,122 | 362,008 | 45 | 18:03:38 | 18:04:23 |

- **claude-sonnet-5-5**: 4 agent · 18 calls · out 6,646 · in 36 · cache_read 1,219,736 · cache_create 794,245
- **claude-haiku-5-5**: 13 agent · 26 calls · out 10,929 · in 52 · cache_read 1,702,529 · cache_create 1,017,980
- **claude-opus-5-5**: 3 agent · 39 calls · out 3,459 · in 78 · cache_read 4,450,129 · cache_create 333,289

