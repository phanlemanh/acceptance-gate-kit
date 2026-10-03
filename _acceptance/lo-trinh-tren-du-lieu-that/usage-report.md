### S4 round 1 — wf_acff64df-952 (21 agent, 36,591 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 9,107 | 8 | 330,871 | 61 |
| review:conventions | claude-opus-5-5 | 32 | 3,443 | 64 | 4,243,693 | 372 |
| review:measurement | claude-opus-5-5 | 16 | 2,804 | 32 | 2,104,765 | 233 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 8 | 2,717 | 66 | 494,984 | 53 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,369 | 18 | 89,886 | 214 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-4-5-20251001 | 2 | 2,213 | 18 | 89,881 | 49 |
| judge:E12:domain-correctness | claude-sonnet-5-5 | 3 | 1,870 | 6 | 170,360 | 18 |
| review:bugs | claude-opus-5-5 | 22 | 1,845 | 44 | 2,758,981 | 226 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,771 | 18 | 89,873 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,531 | 18 | 89,886 | 173 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,509 | 18 | 89,886 | 105 |
| judge:E12:spec-alignment | claude-sonnet-5-5 | 3 | 1,144 | 6 | 205,265 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 977 | 18 | 60,852 | 123 |
| judge:E12:operational-feasibility | claude-sonnet-5-5 | 3 | 937 | 6 | 205,269 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 929 | 18 | 89,922 | 97 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 374 | 18 | 89,922 | 260 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 319 | 18 | 89,880 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 239 | 18 | 89,922 | 73 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 216 | 8 | 250,827 | 21 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 79,649 | 4 |
| triage | claude-sonnet-5-5 | 2 | 127 | 4 | 86,991 | 41 |


wall: 1272s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 216 | 250,827 | 21 | 02:46:49 | 02:47:11 |
| machine | 11 | 14,948 | 1,364,894 | 1159 | 02:46:49 | 03:06:09 |
| judge | 3 | 3,951 | 580,894 | 18 | 02:46:50 | 02:47:07 |
| review | 3 | 8,092 | 9,107,439 | 372 | 02:46:50 | 02:53:01 |
| triage | 1 | 127 | 86,991 | 41 | 03:06:11 | 03:06:52 |
| capture | 1 | 150 | 79,649 | 4 | 03:06:54 | 03:06:58 |
| synthesize | 1 | 9,107 | 330,871 | 61 | 03:07:00 | 03:08:01 |

- **claude-sonnet-5-5**: 7 agent · 21 calls · out 13,551 · in 42 · cache_read 1,329,232 · cache_create 610,553
- **claude-opus-5-5**: 3 agent · 70 calls · out 8,092 · in 140 · cache_read 9,107,439 · cache_create 437,412
- **claude-haiku-4-5-20251001**: 11 agent · 28 calls · out 14,948 · in 246 · cache_read 1,364,894 · cache_create 430,187

### S4 round 2 — wf_6019664d-fea (21 agent, 31,308 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 7,912 | 10 | 457,785 | 65 |
| triage | claude-sonnet-5-5 | 2 | 3,197 | 4 | 83,896 | 26 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-4-5-20251001 | 2 | 2,486 | 18 | 89,909 | 55 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 3 | 2,072 | 26 | 153,976 | 215 |
| review:bugs | claude-opus-5-5 | 18 | 1,536 | 36 | 2,015,175 | 162 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,532 | 18 | 89,914 | 176 |
| judge:E12:domain-correctness | claude-sonnet-5-5 | 3 | 1,478 | 6 | 170,422 | 21 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,395 | 18 | 89,901 | 26 |
| judge:E12:spec-alignment | claude-sonnet-5-5 | 3 | 1,383 | 6 | 205,345 | 17 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,346 | 18 | 89,914 | 107 |
| review:measurement | claude-opus-5-5 | 10 | 1,325 | 20 | 1,006,816 | 120 |
| review:conventions | claude-opus-5-5 | 7 | 1,194 | 14 | 581,596 | 55 |
| judge:E12:operational-feasibility | claude-sonnet-5-5 | 3 | 1,157 | 6 | 205,349 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 972 | 18 | 60,880 | 125 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 658 | 18 | 89,901 | 16 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 383 | 18 | 89,950 | 84 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 361 | 18 | 89,950 | 247 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 349 | 18 | 89,908 | 12 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 225 | 8 | 250,970 | 23 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 196 | 18 | 89,950 | 67 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 79,689 | 7 |


wall: 1198s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 225 | 250,970 | 23 | 07:21:18 | 07:21:41 |
| machine | 11 | 11,750 | 1,024,153 | 1093 | 07:21:18 | 07:39:31 |
| judge | 3 | 4,018 | 581,116 | 21 | 07:21:18 | 07:21:39 |
| review | 3 | 4,055 | 3,603,587 | 163 | 07:21:18 | 07:24:01 |
| triage | 1 | 3,197 | 83,896 | 26 | 07:39:34 | 07:40:00 |
| capture | 1 | 151 | 79,689 | 7 | 07:40:02 | 07:40:09 |
| synthesize | 1 | 7,912 | 457,785 | 65 | 07:40:11 | 07:41:16 |

- **claude-sonnet-5-5**: 7 agent · 22 calls · out 15,503 · in 44 · cache_read 1,453,456 · cache_create 618,724
- **claude-haiku-4-5-20251001**: 11 agent · 23 calls · out 11,750 · in 206 · cache_read 1,024,153 · cache_create 423,206
- **claude-opus-5-5**: 3 agent · 35 calls · out 4,055 · in 70 · cache_read 3,603,587 · cache_create 325,260

