### S4 round 1 — wf_b821a0f9-555 (26 agent, 24,807 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 5,805 | 4 | 54,195 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,777 | 4 | 5,946 | 553 |
| review:measurement | claude-opus-5-5 | 8 | 2,540 | 16 | 471,141 | 94 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,212 | 4 | 5,946 | 604 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,001 | 4 | 5,946 | 506 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-5-5 | 19 | 1,875 | 38 | 1,010,874 | 1824 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,509 | 4 | 45,671 | 86 |
| triage | claude-sonnet-5-5 | 2 | 1,105 | 4 | 44,220 | 12 |
| machine:bash -c 'out=$(BG_ONLY=BG10c,BG1,BG2,BG3 | claude-haiku-5-5 | 2 | 731 | 4 | 45,863 | 12 |
| machine:bash -c 'out=$(BG_ONLY=BG8,BG5 node test | claude-haiku-5-5 | 2 | 569 | 4 | 45,808 | 19 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 532 | 4 | 45,697 | 9 |
| review:conventions | claude-opus-5-5 | 24 | 284 | 48 | 1,774,009 | 152 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 264 | 4 | 42,707 | 184 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 258 | 4 | 45,727 | 99 |
| machine:bash -c 'out=$(BG_ONLY=BG10e node tests/ | claude-haiku-5-5 | 2 | 244 | 4 | 45,799 | 10 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 237 | 4 | 49,186 | 221 |
| machine:node _acceptance/nhay-don-nhan-doi/rang/ | claude-haiku-5-5 | 2 | 233 | 4 | 45,695 | 14 |
| machine:bash -c 'out=$(BG_ONLY=BG10d node tests/ | claude-haiku-5-5 | 2 | 226 | 4 | 45,799 | 10 |
| machine:bash -c 'out=$(BG_ONLY=BG10b node tests/ | claude-haiku-5-5 | 2 | 214 | 4 | 45,799 | 9 |
| review:bugs | claude-opus-5-5 | 15 | 197 | 30 | 1,003,134 | 126 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 186 | 4 | 45,672 | 6 |
| machine:bash -c 'out=$(BG_ONLY=BG10a node tests/ | claude-haiku-5-5 | 2 | 185 | 4 | 45,799 | 9 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 183 | 4 | 45,671 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 170 | 4 | 2,973 | 459 |
| capture:provenance | claude-sonnet-5-5 | 2 | 146 | 4 | 41,488 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 124 | 4 | 45,727 | 92 |


wall: 2694s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 237 | 49,186 | 221 | 01:23:43 | 01:27:24 |
| machine | 19 | 14,493 | 1,669,119 | 2630 | 01:23:43 | 02:07:33 |
| review | 3 | 3,021 | 3,248,284 | 152 | 01:23:43 | 01:26:15 |
| triage | 1 | 1,105 | 44,220 | 12 | 02:07:35 | 02:07:46 |
| capture | 1 | 146 | 41,488 | 10 | 02:07:49 | 02:07:59 |
| synthesize | 1 | 5,805 | 54,195 | 36 | 02:08:01 | 02:08:36 |

- **claude-sonnet-5-5**: 4 agent · 8 calls · out 7,293 · in 16 · cache_read 189,089 · cache_create 229,710
- **claude-haiku-5-5**: 19 agent · 55 calls · out 14,493 · in 110 · cache_read 1,669,119 · cache_create 1,106,942
- **claude-opus-5-5**: 3 agent · 47 calls · out 3,021 · in 94 · cache_read 3,248,284 · cache_create 252,885

