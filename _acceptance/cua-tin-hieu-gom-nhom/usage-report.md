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

### S4 round 2 — wf_df7cb91c-728 (23 agent, 55,726 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E11:domain-correctness | claude-sonnet-5-5 | 2 | 9,151 | 4 | 98,021 | 68 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 2 | 8,697 | 4 | 132,913 | 64 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 2 | 8,544 | 4 | 132,915 | 62 |
| synthesize:report | claude-sonnet-5-5 | 3 | 7,140 | 6 | 247,997 | 68 |
| machine:node tests/scripts/tin-hieu.test.mjs | claude-haiku-5-5 | 2 | 2,780 | 4 | 132,937 | 25 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,754 | 4 | 132,943 | 152 |
| triage | claude-sonnet-5-5 | 2 | 2,417 | 4 | 100,264 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,303 | 4 | 132,943 | 220 |
| review:conventions | claude-opus-5-5 | 15 | 2,213 | 30 | 1,773,504 | 112 |
| review:measurement | claude-opus-5-5 | 9 | 1,646 | 18 | 1,004,774 | 93 |
| review:bugs | claude-opus-5-5 | 12 | 1,549 | 24 | 1,502,664 | 109 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,485 | 4 | 132,929 | 84 |
| machine:TH_CASES=TH-10,TH-10-ong,TH-10-do,TH-10- | claude-haiku-5-5 | 2 | 1,235 | 4 | 132,984 | 9 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,182 | 4 | 132,938 | 114 |
| refute:gom-bo-vang.md | claude-sonnet-5-5 | 5 | 1,069 | 10 | 421,250 | 27 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 374 | 4 | 132,985 | 82 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 317 | 4 | 132,985 | 68 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 191 | 4 | 132,929 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 186 | 4 | 132,930 | 5 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 176 | 4 | 100,514 | 19 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 96,737 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 144 | 4 | 132,985 | 306 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 26 | 4 | 34,982 | 523 |


wall: 1714s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 176 | 100,514 | 19 | 12:01:55 | 12:02:14 |
| machine | 12 | 12,977 | 1,497,470 | 1581 | 12:01:55 | 12:28:16 |
| judge | 3 | 26,392 | 363,849 | 68 | 12:01:55 | 12:03:04 |
| review | 3 | 5,408 | 4,280,942 | 112 | 12:01:55 | 12:03:48 |
| triage | 1 | 2,417 | 100,264 | 23 | 12:28:18 | 12:28:41 |
| refute | 1 | 1,069 | 421,250 | 27 | 12:28:43 | 12:29:10 |
| capture | 1 | 147 | 96,737 | 7 | 12:29:13 | 12:29:19 |
| synthesize | 1 | 7,140 | 247,997 | 68 | 12:29:22 | 12:30:29 |

- **claude-sonnet-5-5**: 8 agent · 20 calls · out 37,341 · in 40 · cache_read 1,330,611 · cache_create 851,777
- **claude-haiku-5-5**: 12 agent · 24 calls · out 12,977 · in 48 · cache_read 1,497,470 · cache_create 956,633
- **claude-opus-5-5**: 3 agent · 36 calls · out 5,408 · in 72 · cache_read 4,280,942 · cache_create 365,035

