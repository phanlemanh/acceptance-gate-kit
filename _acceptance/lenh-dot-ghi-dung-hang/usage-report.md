### S4 round 1 — wf_a730088c-5bd (19 agent, 85,274 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 7 | 14,888 | 14 | 396,984 | 226 |
| review:bugs | claude-opus-5-5 | 19 | 14,152 | 38 | 1,275,682 | 305 |
| review:conventions | claude-opus-5-5 | 19 | 13,512 | 38 | 1,446,753 | 678 |
| synthesize:report | claude-sonnet-5-5 | 3 | 11,535 | 6 | 119,660 | 71 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 6,680 | 18 | 330,178 | 980 |
| triage | claude-sonnet-5-5 | 2 | 4,131 | 4 | 39,889 | 41 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,144 | 4 | 3,140 | 419 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 2,253 | 4 | 37,711 | 22 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 2,039 | 4 | 38,525 | 291 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,010 | 4 | 38,409 | 88 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,871 | 4 | 3,140 | 391 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,835 | 4 | 38,409 | 15 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,786 | 4 | 35,278 | 262 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,257 | 4 | 38,465 | 107 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,193 | 4 | 38,465 | 165 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 981 | 4 | 38,410 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 826 | 4 | 38,465 | 76 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 749 | 4 | 38,435 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 432 | 4 | 34,056 | 7 |


wall: 2660s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,253 | 37,711 | 22 | 12:12:29 | 12:12:51 |
| machine | 12 | 24,371 | 679,319 | 2535 | 12:12:29 | 12:54:45 |
| review | 3 | 42,552 | 3,119,419 | 678 | 12:12:29 | 12:23:48 |
| triage | 1 | 4,131 | 39,889 | 41 | 12:54:47 | 12:55:27 |
| capture | 1 | 432 | 34,056 | 7 | 12:55:30 | 12:55:36 |
| synthesize | 1 | 11,535 | 119,660 | 71 | 12:55:38 | 12:56:49 |

- **claude-opus-5-5**: 3 agent · 45 calls · out 42,552 · in 90 · cache_read 3,119,419 · cache_create 292,865
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 18,351 · in 18 · cache_read 231,316 · cache_create 196,344
- **claude-haiku-5-5**: 12 agent · 31 calls · out 24,371 · in 62 · cache_read 679,319 · cache_create 559,748

