### S4 round 1 — wf_664d78ca-b43 (22 agent, 36,391 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 7,745 | 6 | 250,246 | 61 |
| review:measurement | claude-opus-5-5 | 5 | 4,069 | 10 | 541,339 | 161 |
| triage | claude-sonnet-5-5 | 2 | 4,054 | 4 | 103,463 | 32 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,720 | 4 | 34,982 | 560 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,425 | 4 | 34,982 | 392 |
| review:bugs | claude-opus-5-5 | 10 | 2,242 | 20 | 1,307,873 | 146 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,212 | 4 | 134,614 | 154 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 3 | 2,188 | 6 | 251,779 | 20 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 3 | 1,743 | 6 | 242,344 | 20 |
| review:conventions | claude-opus-5-5 | 7 | 1,518 | 14 | 815,381 | 99 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 134,600 | 85 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 3 | 1,160 | 6 | 210,880 | 17 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 943 | 4 | 99,627 | 141 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 431 | 4 | 134,656 | 84 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 365 | 4 | 134,626 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 321 | 4 | 34,982 | 364 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 187 | 4 | 134,601 | 5 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 149 | 4 | 101,635 | 16 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 98,405 | 8 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 137 | 4 | 134,600 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 124 | 4 | 134,656 | 70 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs | claude-haiku-5-5 | 2 | 26 | 4 | 134,616 | 126 |


wall: 1994s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 149 | 101,635 | 16 | 01:07:55 | 01:08:11 |
| machine | 12 | 11,375 | 1,281,542 | 1886 | 01:07:55 | 01:39:21 |
| judge | 3 | 5,091 | 705,003 | 23 | 01:07:55 | 01:08:18 |
| review | 3 | 7,829 | 2,664,593 | 162 | 01:07:55 | 01:10:37 |
| triage | 1 | 4,054 | 103,463 | 32 | 01:39:24 | 01:39:56 |
| capture | 1 | 148 | 98,405 | 8 | 01:39:58 | 01:40:06 |
| synthesize | 1 | 7,745 | 250,246 | 61 | 01:40:08 | 01:41:09 |

- **claude-sonnet-5-5**: 7 agent · 18 calls · out 17,187 · in 36 · cache_read 1,258,752 · cache_create 753,284
- **claude-opus-5-5**: 3 agent · 22 calls · out 7,829 · in 44 · cache_read 2,664,593 · cache_create 432,407
- **claude-haiku-5-5**: 12 agent · 24 calls · out 11,375 · in 48 · cache_read 1,281,542 · cache_create 1,198,986

