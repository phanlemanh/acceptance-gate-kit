### S4 round 1 — wf_b2aa21fd-553 (26 agent, 57,295 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 11,560 | 6 | 251,083 | 83 |
| triage | claude-sonnet-5-5 | 2 | 5,556 | 4 | 102,689 | 42 |
| judge:E1:operational-feasibility | claude-sonnet-5-5 | 3 | 5,516 | 6 | 281,681 | 46 |
| review:measurement | claude-opus-5-5 | 9 | 4,104 | 18 | 1,123,665 | 147 |
| judge:E1:spec-alignment | claude-sonnet-5-5 | 4 | 3,791 | 8 | 388,147 | 38 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 3 | 3,057 | 6 | 241,676 | 36 |
| ui:E9 | claude-sonnet-5-5 | 14 | 2,992 | 28 | 1,497,036 | 70 |
| review:bugs | claude-opus-5-5 | 13 | 2,683 | 26 | 1,775,707 | 141 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,527 | 4 | 132,959 | 143 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,038 | 4 | 132,959 | 211 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,793 | 4 | 34,982 | 499 |
| review:conventions | claude-opus-5-5 | 24 | 1,631 | 48 | 3,697,935 | 199 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 132,945 | 84 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 3 | 1,307 | 6 | 238,238 | 25 |
| refute:can-cu-s1.ca.mjs | claude-sonnet-5-5 | 4 | 1,263 | 8 | 349,157 | 27 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 3 | 1,254 | 6 | 241,427 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,131 | 4 | 97,944 | 130 |
| judge:E1:domain-correctness | claude-sonnet-5-5 | 8 | 1,007 | 16 | 956,475 | 49 |
| refute:can-cu-s1.ca.mjs | claude-sonnet-5-5 | 4 | 786 | 8 | 311,838 | 20 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 574 | 4 | 133,001 | 85 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 458 | 4 | 132,945 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 314 | 4 | 133,001 | 70 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 186 | 4 | 132,946 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 153 | 4 | 96,749 | 6 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 125 | 4 | 99,933 | 128 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 5 | 4 | 34,982 | 322 |


wall: 1748s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 125 | 99,933 | 128 | 12:57:41 | 12:59:49 |
| machine | 10 | 10,510 | 1,098,664 | 1579 | 12:57:41 | 13:24:00 |
| ui | 1 | 2,992 | 1,497,036 | 70 | 12:57:41 | 12:58:51 |
| judge | 6 | 15,932 | 2,347,644 | 50 | 12:57:41 | 12:58:32 |
| review | 3 | 8,418 | 6,597,307 | 199 | 12:57:41 | 13:01:00 |
| triage | 1 | 5,556 | 102,689 | 42 | 13:24:02 | 13:24:44 |
| refute | 2 | 2,049 | 660,995 | 29 | 13:24:47 | 13:25:16 |
| capture | 1 | 153 | 96,749 | 6 | 13:25:18 | 13:25:24 |
| synthesize | 1 | 11,560 | 251,083 | 83 | 13:25:26 | 13:26:49 |

- **claude-sonnet-5-5**: 13 agent · 55 calls · out 38,367 · in 110 · cache_read 5,056,129 · cache_create 1,425,270
- **claude-opus-5-5**: 3 agent · 46 calls · out 8,418 · in 92 · cache_read 6,597,307 · cache_create 488,928
- **claude-haiku-5-5**: 10 agent · 20 calls · out 10,510 · in 40 · cache_read 1,098,664 · cache_create 934,070

### S4 round 2 — wf_2f8887e9-d4b (21 agent, 27,698 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 7,333 | 8 | 378,428 | 56 |
| judge:E1:operational-feasibility | claude-sonnet-5-5 | 7 | 3,178 | 14 | 836,237 | 77 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,099 | 4 | 132,948 | 228 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 3 | 1,827 | 6 | 241,707 | 22 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,796 | 4 | 34,982 | 511 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 4 | 1,703 | 8 | 354,972 | 28 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,615 | 4 | 132,934 | 85 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,570 | 4 | 132,948 | 148 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,558 | 4 | 132,934 | 13 |
| judge:E1:domain-correctness | claude-sonnet-5-5 | 5 | 1,447 | 10 | 518,536 | 35 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 3 | 1,166 | 6 | 241,153 | 18 |
| judge:E1:spec-alignment | claude-sonnet-5-5 | 4 | 1,101 | 8 | 448,419 | 31 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 367 | 4 | 132,990 | 70 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 212 | 4 | 132,943 | 128 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 186 | 4 | 132,935 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 96,738 | 7 |
| review:measurement | claude-opus-5-5 | 6 | 124 | 12 | 603,691 | 60 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 124 | 4 | 132,990 | 313 |
| review:bugs | claude-opus-5-5 | 5 | 78 | 10 | 468,037 | 48 |
| review:conventions | claude-opus-5-5 | 7 | 56 | 14 | 656,900 | 65 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 11 | 4 | 132,990 | 82 |


wall: 1669s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 10 | 9,538 | 1,231,594 | 1602 | 13:58:53 | 14:25:35 |
| judge | 6 | 10,422 | 2,641,024 | 80 | 13:58:53 | 14:00:13 |
| review | 3 | 258 | 1,728,628 | 65 | 13:58:53 | 13:59:58 |
| capture | 1 | 147 | 96,738 | 7 | 14:25:37 | 14:25:44 |
| synthesize | 1 | 7,333 | 378,428 | 56 | 14:25:46 | 14:26:42 |

- **claude-sonnet-5-5**: 8 agent · 32 calls · out 17,902 · in 64 · cache_read 3,116,190 · cache_create 890,435
- **claude-haiku-5-5**: 10 agent · 20 calls · out 9,538 · in 40 · cache_read 1,231,594 · cache_create 801,836
- **claude-opus-5-5**: 3 agent · 18 calls · out 258 · in 36 · cache_read 1,728,628 · cache_create 288,634

