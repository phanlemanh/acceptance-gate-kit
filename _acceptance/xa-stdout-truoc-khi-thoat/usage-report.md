### S4 round 1 — wf_1d0d2343-241 (18 agent, 34,104 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 15 | 6,470 | 30 | 1,699,761 | 143 |
| triage | claude-sonnet-5-5 | 2 | 4,303 | 4 | 84,636 | 30 |
| review:conventions | claude-opus-5-5 | 46 | 3,942 | 92 | 6,890,315 | 531 |
| review:measurement | claude-opus-5-5 | 12 | 3,703 | 24 | 1,442,966 | 276 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 3,365 | 10 | 337,762 | 812 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,744 | 4 | 117,115 | 246 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,445 | 4 | 69,964 | 477 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,868 | 4 | 117,101 | 90 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,835 | 4 | 117,101 | 13 |
| machine:node tests/scripts/xuat-du-qua-pipe.test | claude-haiku-5-5 | 2 | 1,597 | 4 | 117,117 | 28 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 773 | 4 | 117,157 | 131 |
| review:bugs | claude-opus-5-5 | 29 | 340 | 58 | 4,279,397 | 393 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 187 | 4 | 117,102 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 141 | 4 | 80,907 | 8 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 137 | 4 | 84,144 | 18 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 126 | 4 | 117,157 | 81 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 124 | 4 | 117,157 | 311 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 4 | 4 | 117,110 | 219 |


wall: 2591s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 137 | 84,144 | 18 | 09:46:11 | 09:46:29 |
| machine | 11 | 15,068 | 1,461,843 | 2405 | 09:46:11 | 10:26:16 |
| review | 3 | 7,985 | 12,612,678 | 531 | 09:46:11 | 09:55:02 |
| triage | 1 | 4,303 | 84,636 | 30 | 10:26:18 | 10:26:48 |
| capture | 1 | 141 | 80,907 | 8 | 10:26:50 | 10:26:57 |
| synthesize | 1 | 6,470 | 1,699,761 | 143 | 10:27:00 | 10:29:22 |

- **claude-sonnet-5-5**: 4 agent · 21 calls · out 11,051 · in 42 · cache_read 1,949,448 · cache_create 415,511
- **claude-opus-5-5**: 3 agent · 87 calls · out 7,985 · in 174 · cache_read 12,612,678 · cache_create 445,872
- **claude-haiku-5-5**: 11 agent · 25 calls · out 15,068 · in 50 · cache_read 1,461,843 · cache_create 686,501

