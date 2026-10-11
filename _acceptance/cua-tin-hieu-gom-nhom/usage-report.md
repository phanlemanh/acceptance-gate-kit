### S4 round 1 — wf_8f404a1b-bca (24 agent, 58,870 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 12,396 | 8 | 401,909 | 88 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 2 | 6,654 | 4 | 132,745 | 52 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 3 | 6,501 | 6 | 249,205 | 51 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 3 | 5,747 | 6 | 214,309 | 46 |
| triage | claude-sonnet-5-5 | 2 | 5,301 | 4 | 103,244 | 41 |
| review:bugs | claude-opus-5-5 | 31 | 3,134 | 62 | 5,120,953 | 296 |
| review:conventions | claude-opus-5-5 | 38 | 2,911 | 76 | 6,989,689 | 430 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,804 | 4 | 34,982 | 503 |
| review:measurement | claude-opus-5-5 | 14 | 2,490 | 28 | 2,118,963 | 209 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,214 | 4 | 132,917 | 233 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,585 | 4 | 132,903 | 12 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 132,903 | 83 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,409 | 4 | 132,959 | 78 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,312 | 4 | 132,912 | 126 |
| refute:evals.yaml | claude-sonnet-5-5 | 4 | 886 | 8 | 310,129 | 19 |
| refute:cham-bo-vang.mjs | claude-sonnet-5-5 | 5 | 773 | 10 | 474,044 | 23 |
| machine:node tests/scripts/tin-hieu.test.mjs | claude-haiku-5-5 | 2 | 353 | 4 | 132,911 | 22 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 266 | 4 | 132,959 | 293 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 187 | 4 | 132,904 | 5 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 175 | 4 | 100,488 | 18 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 96,711 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 132,959 | 64 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 7 | 4 | 132,917 | 159 |
| machine:TH_CASES=TH-10,TH-10-ong,TH-10-do,TH-10- | claude-haiku-5-5 | 2 | 6 | 4 | 132,958 | 14 |


wall: 1744s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 175 | 100,488 | 18 | 10:40:40 | 10:40:59 |
| machine | 12 | 11,750 | 1,497,184 | 1574 | 10:40:40 | 11:06:55 |
| judge | 3 | 18,902 | 596,259 | 57 | 10:40:40 | 10:41:37 |
| review | 3 | 8,535 | 14,229,605 | 430 | 10:40:40 | 10:47:50 |
| triage | 1 | 5,301 | 103,244 | 41 | 11:06:57 | 11:07:38 |
| refute | 2 | 1,659 | 784,173 | 26 | 11:07:40 | 11:08:06 |
| capture | 1 | 152 | 96,711 | 6 | 11:08:08 | 11:08:14 |
| synthesize | 1 | 12,396 | 401,909 | 88 | 11:08:16 | 11:09:44 |

- **claude-sonnet-5-5**: 9 agent · 27 calls · out 38,585 · in 54 · cache_read 2,082,784 · cache_create 951,311
- **claude-opus-5-5**: 3 agent · 83 calls · out 8,535 · in 166 · cache_read 14,229,605 · cache_create 573,336
- **claude-haiku-5-5**: 12 agent · 24 calls · out 11,750 · in 48 · cache_read 1,497,184 · cache_create 944,426

