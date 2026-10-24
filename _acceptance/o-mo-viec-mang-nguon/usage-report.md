### S4 round 1 — wf_ba7aa5f6-e32 (23 agent, 83,608 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 16 | 13,632 | 32 | 1,241,661 | 176 |
| synthesize:report | claude-sonnet-5-5 | 4 | 11,709 | 8 | 200,799 | 71 |
| review:bugs | claude-opus-5-5 | 14 | 10,891 | 28 | 941,729 | 145 |
| review:measurement | claude-opus-5-5 | 9 | 10,843 | 18 | 543,935 | 137 |
| triage | claude-sonnet-5-5 | 2 | 4,598 | 4 | 44,189 | 35 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 4,588 | 4 | 39,534 | 26 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 4,179 | 8 | 80,871 | 713 |
| machine:node tests/scripts/road-map-de-dung.test | claude-haiku-5-5 | 2 | 4,095 | 4 | 37,981 | 43 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,987 | 4 | 3,057 | 575 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 2,906 | 4 | 37,981 | 166 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,501 | 4 | 6,114 | 498 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,936 | 4 | 37,973 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,767 | 4 | 34,925 | 172 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 1,031 | 4 | 37,999 | 7 |
| machine:node tests/scripts/kho-tri-thuc-va-lint. | claude-haiku-5-5 | 2 | 880 | 4 | 37,992 | 23 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 744 | 4 | 6,114 | 537 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 744 | 4 | 38,029 | 84 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 707 | 4 | 37,974 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 702 | 4 | 38,029 | 108 |
| machine:node tests/scripts/o-mo-viec-mang-nguon. | claude-haiku-5-5 | 2 | 631 | 4 | 37,992 | 17 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 587 | 4 | 37,973 | 87 |
| machine:node tests/scripts/can-cu-s1.ca.mjs | claude-haiku-5-5 | 2 | 523 | 4 | 37,985 | 31 |
| capture:provenance | claude-sonnet-5-5 | 2 | 427 | 4 | 36,617 | 6 |


wall: 2941s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 4,588 | 39,534 | 26 | 10:09:45 | 10:10:11 |
| machine | 16 | 26,920 | 548,989 | 2823 | 10:09:45 | 10:56:47 |
| review | 3 | 35,366 | 2,727,325 | 176 | 10:09:45 | 10:12:40 |
| triage | 1 | 4,598 | 44,189 | 35 | 10:56:49 | 10:57:25 |
| capture | 1 | 427 | 36,617 | 6 | 10:57:27 | 10:57:33 |
| synthesize | 1 | 11,709 | 200,799 | 71 | 10:57:35 | 10:58:46 |

- **claude-opus-5-5**: 3 agent · 39 calls · out 35,366 · in 78 · cache_read 2,727,325 · cache_create 296,229
- **claude-sonnet-5-5**: 4 agent · 10 calls · out 21,322 · in 20 · cache_read 321,139 · cache_create 191,398
- **claude-haiku-5-5**: 16 agent · 34 calls · out 26,920 · in 68 · cache_read 548,989 · cache_create 718,649

