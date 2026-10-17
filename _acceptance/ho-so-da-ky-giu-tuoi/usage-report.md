### S4 round 1 — wf_9bf38b4a-13b (22 agent, 49,808 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 13,508 | 6 | 134,300 | 79 |
| triage | claude-sonnet-5-5 | 2 | 5,894 | 4 | 41,719 | 41 |
| review:bugs | claude-opus-5-5 | 32 | 4,643 | 64 | 3,256,866 | 314 |
| review:measurement | claude-opus-5-5 | 17 | 4,361 | 34 | 1,606,855 | 276 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 3,611 | 14 | 210,210 | 630 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 2,993 | 16 | 266,229 | 969 |
| review:conventions | claude-opus-5-5 | 16 | 2,855 | 32 | 1,342,336 | 162 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,492 | 4 | 5,738 | 498 |
| machine:bash -c 'set -e; for f in tests/scripts/ | claude-haiku-5-5 | 2 | 2,194 | 4 | 5,738 | 409 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,513 | 4 | 38,042 | 86 |
| machine:node tests/scripts/ho-so-da-ky-giu-tuoi- | claude-haiku-5-5 | 38 | 1,498 | 76 | 2,251,677 | 3741 |
| refute:do-san-tren-nen.cjs | claude-sonnet-5-5 | 5 | 1,139 | 10 | 180,466 | 24 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 581 | 4 | 35,182 | 246 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 435 | 4 | 38,068 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 434 | 8 | 86,114 | 658 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 372 | 4 | 38,098 | 103 |
| machine:node tests/scripts/ho-so-da-ky-giu-tuoi. | claude-haiku-5-5 | 2 | 266 | 4 | 38,067 | 76 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 263 | 4 | 38,098 | 125 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 215 | 4 | 38,379 | 202 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 215 | 4 | 38,043 | 5 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 173 | 4 | 38,042 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 153 | 4 | 33,959 | 6 |


wall: 3899s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 215 | 38,379 | 202 | 20:27:12 | 20:30:33 |
| machine | 14 | 17,040 | 3,127,346 | 3743 | 20:27:12 | 21:29:35 |
| review | 3 | 11,859 | 6,206,057 | 315 | 20:27:12 | 20:32:26 |
| triage | 1 | 5,894 | 41,719 | 41 | 21:29:36 | 21:30:17 |
| refute | 1 | 1,139 | 180,466 | 24 | 21:30:19 | 21:30:43 |
| capture | 1 | 153 | 33,959 | 6 | 21:30:44 | 21:30:50 |
| synthesize | 1 | 13,508 | 134,300 | 79 | 21:30:51 | 21:32:10 |

- **claude-sonnet-5-5**: 5 agent · 14 calls · out 20,909 · in 28 · cache_read 428,823 · cache_create 262,826
- **claude-opus-5-5**: 3 agent · 65 calls · out 11,859 · in 130 · cache_read 6,206,057 · cache_create 391,592
- **claude-haiku-5-5**: 14 agent · 77 calls · out 17,040 · in 154 · cache_read 3,127,346 · cache_create 741,872

