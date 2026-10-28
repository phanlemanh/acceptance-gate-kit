### S4 round 1 — wf_e0535a00-500 (28 agent, 93,783 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 19 | 16,927 | 38 | 1,371,593 | 200 |
| review:measurement | claude-opus-5-5 | 6 | 12,148 | 12 | 300,492 | 141 |
| synthesize:report | claude-sonnet-5-5 | 3 | 10,914 | 6 | 123,743 | 61 |
| review:conventions | claude-opus-5-5 | 10 | 8,239 | 20 | 600,362 | 100 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 7,051 | 4 | 41,136 | 38 |
| triage | claude-sonnet-5-5 | 2 | 6,109 | 4 | 40,863 | 43 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 5,373 | 14 | 201,893 | 984 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,757 | 4 | 3,034 | 511 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,352 | 4 | 3,034 | 417 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,309 | 4 | 36,973 | 93 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,040 | 4 | 36,973 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,420 | 4 | 33,948 | 170 |
| machine:bash tests/design-floor/eval.sh df5-s4-b | claude-haiku-5-5 | 2 | 1,350 | 4 | 36,986 | 16 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 1,340 | 6 | 40,641 | 620 |
| machine:bash tests/design-floor/eval.sh df5-vong | claude-haiku-5-5 | 2 | 1,282 | 4 | 36,984 | 14 |
| machine:bash tests/design-floor/eval.sh df5-s3-c | claude-haiku-5-5 | 2 | 1,265 | 4 | 36,989 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,229 | 4 | 37,029 | 126 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,117 | 4 | 37,029 | 89 |
| machine:bash tests/design-floor/eval.sh df5-s3-a | claude-haiku-5-5 | 2 | 1,054 | 4 | 36,987 | 10 |
| machine:bash tests/design-floor/eval.sh df5-noi- | claude-haiku-5-5 | 2 | 1,045 | 4 | 36,984 | 11 |
| machine:bash tests/design-floor/eval.sh df5-s4-t | claude-haiku-5-5 | 2 | 1,032 | 4 | 36,989 | 12 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 989 | 4 | 36,974 | 9 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 915 | 4 | 36,999 | 8 |
| machine:bash tests/design-floor/eval.sh df5-s4-h | claude-haiku-5-5 | 2 | 816 | 4 | 36,986 | 8 |
| machine:bash tests/design-floor/eval.sh df5-s4-c | claude-haiku-5-5 | 2 | 769 | 4 | 36,989 | 10 |
| machine:bash tests/design-floor/eval.sh df5-s3-s | claude-haiku-5-5 | 2 | 764 | 4 | 36,990 | 11 |
| machine:bash tests/design-floor/eval.sh df5-gate | claude-haiku-5-5 | 2 | 739 | 4 | 36,984 | 10 |
| capture:provenance | claude-sonnet-5-5 | 2 | 438 | 4 | 32,726 | 6 |


wall: 3179s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,051 | 41,136 | 38 | 03:17:42 | 03:18:20 |
| machine | 21 | 31,957 | 874,395 | 3062 | 03:17:42 | 04:08:44 |
| review | 3 | 37,314 | 2,272,447 | 201 | 03:17:54 | 03:21:15 |
| triage | 1 | 6,109 | 40,863 | 43 | 04:08:46 | 04:09:29 |
| capture | 1 | 438 | 32,726 | 6 | 04:09:31 | 04:09:38 |
| synthesize | 1 | 10,914 | 123,743 | 61 | 04:09:40 | 04:10:41 |

- **claude-opus-5-5**: 3 agent · 35 calls · out 37,314 · in 70 · cache_read 2,272,447 · cache_create 275,438
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 24,512 · in 18 · cache_read 238,468 · cache_create 203,027
- **claude-haiku-5-5**: 21 agent · 48 calls · out 31,957 · in 96 · cache_read 874,395 · cache_create 873,142

