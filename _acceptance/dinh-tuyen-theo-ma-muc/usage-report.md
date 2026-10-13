### S4 round 1 — wf_9c84cc7a-440 (23 agent, 47,502 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 11,758 | 6 | 114,777 | 62 |
| review:measurement | claude-opus-5-5 | 14 | 6,779 | 28 | 982,791 | 227 |
| triage | claude-sonnet-5-5 | 2 | 5,126 | 4 | 38,929 | 37 |
| review:conventions | claude-opus-5-5 | 13 | 2,900 | 26 | 751,412 | 105 |
| review:bugs | claude-opus-5-5 | 14 | 2,875 | 28 | 871,119 | 121 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 2,830 | 10 | 114,637 | 760 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 2,726 | 16 | 232,473 | 958 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,060 | 4 | 2,869 | 342 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,582 | 4 | 35,170 | 11 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,512 | 4 | 35,170 | 87 |
| refute:pre-merge-check.sh | claude-sonnet-5-5 | 9 | 1,173 | 18 | 378,072 | 49 |
| refute:pre-merge-check.sh | claude-sonnet-5-5 | 9 | 1,115 | 18 | 366,734 | 43 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,020 | 4 | 32,310 | 237 |
| refute:evals.yaml | claude-sonnet-5-5 | 3 | 948 | 6 | 71,269 | 17 |
| machine:bash -c 'set -o pipefail; node tests/scr | claude-haiku-5-5 | 2 | 736 | 4 | 35,250 | 75 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 530 | 4 | 35,226 | 125 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 418 | 4 | 35,196 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 340 | 4 | 35,226 | 74 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 324 | 4 | 2,869 | 364 |
| machine:bash -c 'LMCMS_ONLY=LM20 node tests/scri | claude-haiku-5-5 | 2 | 229 | 4 | 35,210 | 81 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 211 | 4 | 35,171 | 5 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 166 | 4 | 34,969 | 91 |
| capture:provenance | claude-sonnet-5-5 | 2 | 144 | 4 | 31,089 | 7 |


wall: 3155s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 166 | 34,969 | 91 | 13:50:16 | 13:51:47 |
| machine | 13 | 14,518 | 666,777 | 2990 | 13:50:16 | 14:40:06 |
| review | 3 | 12,554 | 2,605,322 | 228 | 13:50:16 | 13:54:05 |
| triage | 1 | 5,126 | 38,929 | 37 | 14:40:08 | 14:40:45 |
| refute | 3 | 3,236 | 816,075 | 51 | 14:40:48 | 14:41:39 |
| capture | 1 | 144 | 31,089 | 7 | 14:41:41 | 14:41:48 |
| synthesize | 1 | 11,758 | 114,777 | 62 | 14:41:50 | 14:42:51 |

- **claude-sonnet-5-5**: 7 agent · 30 calls · out 20,430 · in 60 · cache_read 1,035,839 · cache_create 335,465
- **claude-opus-5-5**: 3 agent · 41 calls · out 12,554 · in 82 · cache_read 2,605,322 · cache_create 278,366
- **claude-haiku-5-5**: 13 agent · 35 calls · out 14,518 · in 70 · cache_read 666,777 · cache_create 581,632

### S4 round 2 — wf_93dd8e39-f5f (18 agent, 23,852 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 7,373 | 8 | 158,413 | 47 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 2,956 | 10 | 114,494 | 765 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 2,832 | 14 | 194,223 | 943 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,306 | 4 | 2,869 | 342 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,579 | 4 | 35,176 | 11 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,514 | 4 | 35,176 | 86 |
| review:measurement | claude-opus-5-5 | 11 | 1,159 | 22 | 678,620 | 77 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,156 | 4 | 32,316 | 236 |
| machine:bash -c 'set -o pipefail; node tests/scr | claude-haiku-5-5 | 2 | 511 | 4 | 35,256 | 80 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 480 | 4 | 35,202 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 433 | 4 | 35,232 | 125 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 402 | 4 | 35,177 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 358 | 4 | 35,232 | 74 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 2,869 | 367 |
| review:conventions | claude-opus-5-5 | 10 | 162 | 20 | 416,660 | 115 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 155 | 4 | 34,402 | 17 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 31,095 | 6 |
| review:bugs | claude-opus-5-5 | 13 | 151 | 26 | 606,769 | 102 |


wall: 3037s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 155 | 34,402 | 17 | 14:47:23 | 14:47:40 |
| machine | 12 | 14,700 | 593,222 | 2981 | 14:47:23 | 15:37:03 |
| review | 3 | 1,472 | 1,702,049 | 115 | 14:47:23 | 14:49:17 |
| capture | 1 | 152 | 31,095 | 6 | 15:37:05 | 15:37:11 |
| synthesize | 1 | 7,373 | 158,413 | 47 | 15:37:13 | 15:38:00 |

- **claude-sonnet-5-5**: 3 agent · 8 calls · out 7,680 · in 16 · cache_read 223,910 · cache_create 138,471
- **claude-haiku-5-5**: 12 agent · 32 calls · out 14,700 · in 64 · cache_read 593,222 · cache_create 547,293
- **claude-opus-5-5**: 3 agent · 34 calls · out 1,472 · in 68 · cache_read 1,702,049 · cache_create 199,455

