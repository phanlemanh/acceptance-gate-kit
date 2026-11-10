### S4 round 1 — wf_0ba34a47-6b3 (19 agent, 81,173 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 10 | 17,535 | 20 | 450,721 | 260 |
| review:measurement | claude-opus-5-5 | 4 | 14,316 | 8 | 69,565 | 170 |
| review:conventions | claude-opus-5-5 | 6 | 13,933 | 12 | 228,478 | 164 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 12 | 7,127 | 24 | 167,783 | 1440 |
| synthesize:report | claude-sonnet-5-5 | 2 | 6,432 | 4 | 24,312 | 36 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 3,332 | 6 | 34,451 | 35 |
| triage | claude-sonnet-5-5 | 2 | 3,133 | 4 | 14,873 | 25 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,859 | 4 | 3,305 | 570 |
| machine:bash -c 'out=$(node --test --test-report | claude-haiku-5-5 | 2 | 2,187 | 4 | 14,318 | 44 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,152 | 4 | 3,305 | 409 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,861 | 4 | 14,146 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 1,548 | 8 | 35,387 | 740 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,029 | 4 | 14,155 | 193 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 739 | 4 | 14,202 | 125 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 734 | 4 | 14,147 | 4 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 685 | 4 | 14,146 | 91 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 667 | 4 | 14,202 | 91 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 533 | 4 | 14,172 | 4 |
| capture:provenance | claude-sonnet-5-5 | 2 | 371 | 4 | 9,635 | 7 |


wall: 3783s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,332 | 34,451 | 35 | 08:11:10 | 08:11:45 |
| machine | 12 | 22,121 | 323,268 | 3708 | 08:11:10 | 09:12:57 |
| review | 3 | 45,784 | 748,764 | 261 | 08:11:10 | 08:15:30 |
| triage | 1 | 3,133 | 14,873 | 25 | 09:12:59 | 09:13:24 |
| capture | 1 | 371 | 9,635 | 7 | 09:13:28 | 09:13:35 |
| synthesize | 1 | 6,432 | 24,312 | 36 | 09:13:37 | 09:14:13 |

- **claude-opus-5-5**: 3 agent · 20 calls · out 45,784 · in 40 · cache_read 748,764 · cache_create 200,101
- **claude-haiku-5-5**: 12 agent · 36 calls · out 22,121 · in 72 · cache_read 323,268 · cache_create 179,366
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 13,268 · in 18 · cache_read 83,271 · cache_create 87,402

