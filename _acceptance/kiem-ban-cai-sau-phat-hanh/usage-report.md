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

### S4 round 2 — wf_382de6e4-df2 (22 agent, 34,675 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 7,031 | 10 | 536,975 | 56 |
| triage | claude-sonnet-5-5 | 2 | 2,756 | 4 | 102,473 | 24 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,653 | 4 | 34,982 | 557 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,525 | 4 | 34,982 | 391 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 3 | 2,420 | 6 | 207,442 | 23 |
| review:measurement | claude-opus-5-5 | 6 | 2,162 | 12 | 655,612 | 73 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 3 | 1,817 | 6 | 242,367 | 21 |
| review:conventions | claude-opus-5-5 | 9 | 1,701 | 18 | 1,050,550 | 93 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,680 | 4 | 134,635 | 149 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 3 | 1,644 | 6 | 242,363 | 18 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 134,621 | 84 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,320 | 4 | 134,621 | 11 |
| review:bugs | claude-opus-5-5 | 11 | 1,304 | 22 | 1,385,137 | 139 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,278 | 4 | 134,630 | 140 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs | claude-haiku-5-5 | 2 | 693 | 4 | 134,637 | 140 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 551 | 4 | 134,677 | 80 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 511 | 4 | 134,647 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 370 | 4 | 134,677 | 73 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 313 | 4 | 34,982 | 362 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 166 | 4 | 134,622 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 98,426 | 7 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 148 | 4 | 101,656 | 16 |


wall: 1974s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 148 | 101,656 | 16 | 03:24:16 | 03:24:31 |
| machine | 12 | 13,544 | 1,316,713 | 1880 | 03:24:16 | 03:55:35 |
| judge | 3 | 5,881 | 692,172 | 24 | 03:24:16 | 03:24:40 |
| review | 3 | 5,167 | 3,091,299 | 140 | 03:24:16 | 03:26:35 |
| triage | 1 | 2,756 | 102,473 | 24 | 03:55:38 | 03:56:02 |
| capture | 1 | 148 | 98,426 | 7 | 03:56:04 | 03:56:10 |
| synthesize | 1 | 7,031 | 536,975 | 56 | 03:56:13 | 03:57:10 |

- **claude-sonnet-5-5**: 7 agent · 20 calls · out 15,964 · in 40 · cache_read 1,531,702 · cache_create 758,514
- **claude-haiku-5-5**: 12 agent · 24 calls · out 13,544 · in 48 · cache_read 1,316,713 · cache_create 1,164,448
- **claude-opus-5-5**: 3 agent · 26 calls · out 5,167 · in 52 · cache_read 3,091,299 · cache_create 408,288

