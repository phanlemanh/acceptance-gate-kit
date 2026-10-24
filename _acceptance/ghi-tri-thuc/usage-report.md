### S4 round 1 — wf_f141e923-6ed (20 agent, 79,821 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 13 | 15,499 | 26 | 867,875 | 223 |
| review:bugs | claude-opus-5-5 | 11 | 12,099 | 22 | 511,333 | 142 |
| synthesize:report | claude-sonnet-5-5 | 4 | 11,079 | 8 | 153,640 | 69 |
| review:measurement | claude-opus-5-5 | 6 | 8,714 | 12 | 255,761 | 95 |
| triage | claude-sonnet-5-5 | 2 | 5,540 | 4 | 30,486 | 40 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 5,176 | 12 | 125,303 | 809 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 3,743 | 10 | 90,735 | 706 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 3,129 | 4 | 27,893 | 21 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,477 | 4 | 27,951 | 312 |
| machine:node tests/scripts/ghi-tri-thuc.test.mjs | claude-haiku-5-5 | 2 | 2,250 | 4 | 27,953 | 35 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,880 | 4 | 27,937 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 1,615 | 8 | 60,247 | 767 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,523 | 4 | 27,937 | 87 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 976 | 4 | 27,993 | 117 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 954 | 4 | 27,963 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 747 | 4 | 27,993 | 88 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 714 | 4 | 3,057 | 565 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 657 | 4 | 27,938 | 5 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 617 | 4 | 24,889 | 170 |
| capture:provenance | claude-sonnet-5-5 | 2 | 432 | 4 | 23,664 | 7 |


wall: 3020s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,129 | 27,893 | 21 | 13:31:16 | 13:31:36 |
| machine | 13 | 23,329 | 527,896 | 2899 | 13:31:16 | 14:19:35 |
| review | 3 | 36,312 | 1,634,969 | 223 | 13:31:16 | 13:34:59 |
| triage | 1 | 5,540 | 30,486 | 40 | 14:19:37 | 14:20:17 |
| capture | 1 | 432 | 23,664 | 7 | 14:20:19 | 14:20:26 |
| synthesize | 1 | 11,079 | 153,640 | 69 | 14:20:28 | 14:21:36 |

- **claude-opus-5-5**: 3 agent · 30 calls · out 36,312 · in 60 · cache_read 1,634,969 · cache_create 244,980
- **claude-sonnet-5-5**: 4 agent · 10 calls · out 20,180 · in 20 · cache_read 235,683 · cache_create 154,685
- **claude-haiku-5-5**: 13 agent · 35 calls · out 23,329 · in 70 · cache_read 527,896 · cache_create 443,635

