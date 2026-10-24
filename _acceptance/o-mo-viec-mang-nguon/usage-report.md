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

### S4 round 2 — wf_286e00a7-c00 (20 agent, 53,615 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 22 | 10,896 | 44 | 1,327,807 | 245 |
| synthesize:report | claude-sonnet-5-5 | 5 | 9,361 | 10 | 241,763 | 59 |
| review:bugs | claude-opus-5-5 | 19 | 7,232 | 38 | 1,053,817 | 350 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 3,379 | 6 | 41,583 | 635 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 3,059 | 4 | 37,952 | 19 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 2,710 | 4 | 38,022 | 151 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,544 | 4 | 3,057 | 430 |
| review:measurement | claude-opus-5-5 | 7 | 2,514 | 14 | 279,284 | 49 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,048 | 4 | 38,014 | 90 |
| machine:node tests/scripts/can-cu-s1.ca.mjs | claude-haiku-5-5 | 2 | 1,900 | 4 | 38,026 | 29 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,129 | 4 | 34,966 | 157 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,048 | 4 | 38,070 | 76 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 986 | 4 | 38,070 | 114 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 956 | 4 | 3,057 | 511 |
| triage | claude-sonnet-5-5 | 2 | 835 | 4 | 36,472 | 8 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 811 | 4 | 38,040 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 727 | 4 | 3,057 | 523 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 624 | 4 | 38,014 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 503 | 4 | 38,015 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 353 | 4 | 33,744 | 5 |


wall: 2654s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,059 | 37,952 | 19 | 11:27:58 | 11:28:17 |
| machine | 13 | 19,365 | 389,991 | 2576 | 11:27:58 | 12:10:54 |
| review | 3 | 20,642 | 2,660,908 | 353 | 11:27:58 | 11:33:51 |
| triage | 1 | 835 | 36,472 | 8 | 12:10:56 | 12:11:04 |
| capture | 1 | 353 | 33,744 | 5 | 12:11:06 | 12:11:11 |
| synthesize | 1 | 9,361 | 241,763 | 59 | 12:11:13 | 12:12:12 |

- **claude-opus-5-5**: 3 agent · 48 calls · out 20,642 · in 96 · cache_read 2,660,908 · cache_create 199,634
- **claude-sonnet-5-5**: 4 agent · 11 calls · out 13,608 · in 22 · cache_read 349,931 · cache_create 193,960
- **claude-haiku-5-5**: 13 agent · 27 calls · out 19,365 · in 54 · cache_read 389,991 · cache_create 612,276

