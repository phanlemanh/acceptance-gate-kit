### S4 round 1 — wf_b0ab341f-608 (15 agent, 88,380 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 21,365 | 4 | 113,743 | 196 |
| triage | claude-sonnet-5 | 2 | 21,038 | 4 | 101,453 | 209 |
| review:measurement | claude-opus-5 | 7 | 9,694 | 14 | 755,344 | 140 |
| baseline:diffBase | claude-sonnet-5 | 11 | 8,735 | 22 | 1,089,224 | 168 |
| review:bugs | claude-opus-5 | 14 | 8,477 | 28 | 1,563,929 | 305 |
| review:conventions | claude-opus-5 | 15 | 5,811 | 30 | 1,791,572 | 136 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 2,316 | 34 | 174,851 | 636 |
| machine:bash -c 'out=$({ node tests/scripts/ntr- | claude-haiku-4-5-20251001 | 2 | 2,304 | 18 | 95,235 | 59 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,862 | 42 | 314,025 | 39 |
| machine:bash -c 'out=$(node tests/scripts/hskt.t | claude-haiku-4-5-20251001 | 2 | 1,787 | 18 | 95,267 | 87 |
| machine:bash -c 'out=$(node tests/scripts/consum | claude-haiku-4-5-20251001 | 2 | 1,467 | 18 | 95,163 | 23 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 907 | 18 | 27,323 | 503 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 905 | 18 | 95,048 | 17 |
| capture:provenance | claude-sonnet-5 | 2 | 863 | 4 | 95,043 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 849 | 18 | 95,055 | 14 |


wall: 1638s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 8,735 | 1,089,224 | 168 | 02:48:14 | 02:51:02 |
| machine | 8 | 12,397 | 991,967 | 1214 | 02:48:14 | 03:08:28 |
| review | 3 | 23,982 | 4,110,845 | 310 | 02:48:14 | 02:53:24 |
| triage | 1 | 21,038 | 101,453 | 209 | 03:08:29 | 03:11:59 |
| capture | 1 | 863 | 95,043 | 14 | 03:12:00 | 03:12:14 |
| synthesize | 1 | 21,365 | 113,743 | 196 | 03:12:16 | 03:15:32 |

- **claude-sonnet-5**: 4 agent · 17 calls · out 52,001 · in 34 · cache_read 1,399,463 · cache_create 417,190
- **claude-opus-5**: 3 agent · 36 calls · out 23,982 · in 72 · cache_read 4,110,845 · cache_create 331,445
- **claude-haiku-4-5-20251001**: 8 agent · 21 calls · out 12,397 · in 184 · cache_read 991,967 · cache_create 502,973

