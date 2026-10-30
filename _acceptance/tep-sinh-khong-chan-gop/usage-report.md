### S4 round 1 — wf_21cad358-262 (19 agent, 54,503 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 7,449 | 6 | 107,746 | 46 |
| review:measurement | claude-opus-5-5 | 7 | 7,054 | 14 | 336,160 | 82 |
| review:bugs | claude-opus-5-5 | 12 | 6,309 | 24 | 637,272 | 65 |
| review:conventions | claude-opus-5-5 | 15 | 5,567 | 30 | 846,230 | 71 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,574 | 16 | 273,659 | 879 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,416 | 4 | 3,140 | 604 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,158 | 4 | 3,140 | 412 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 2,716 | 4 | 38,396 | 16 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,343 | 4 | 38,542 | 91 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,989 | 4 | 38,542 | 13 |
| triage | claude-sonnet-5-5 | 2 | 1,875 | 4 | 37,602 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,357 | 4 | 38,598 | 177 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,261 | 4 | 38,598 | 81 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,242 | 4 | 38,551 | 163 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,175 | 4 | 38,598 | 111 |
| machine:node tests/scripts/tep-sinh-khong-chan-g | claude-haiku-5-5 | 2 | 1,024 | 4 | 38,561 | 16 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 857 | 4 | 38,568 | 7 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 616 | 4 | 35,403 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 521 | 4 | 34,187 | 6 |


wall: 2613s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,716 | 38,396 | 16 | 02:23:30 | 02:23:46 |
| machine | 12 | 23,012 | 623,900 | 2545 | 02:23:30 | 03:05:55 |
| review | 3 | 18,930 | 1,819,662 | 83 | 02:23:30 | 02:24:53 |
| triage | 1 | 1,875 | 37,602 | 15 | 03:05:55 | 03:06:11 |
| capture | 1 | 521 | 34,187 | 6 | 03:06:11 | 03:06:16 |
| synthesize | 1 | 7,449 | 107,746 | 47 | 03:06:17 | 03:07:03 |

- **claude-sonnet-5-5**: 4 agent · 9 calls · out 12,561 · in 18 · cache_read 217,931 · cache_create 187,345
- **claude-opus-5-5**: 3 agent · 34 calls · out 18,930 · in 68 · cache_read 1,819,662 · cache_create 213,378
- **claude-haiku-5-5**: 12 agent · 30 calls · out 23,012 · in 60 · cache_read 623,900 · cache_create 560,028

### S4 round 2 — wf_63a689cc-0a8 (19 agent, 52,072 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 6 | 7,230 | 12 | 280,718 | 75 |
| synthesize:report | claude-sonnet-5-5 | 4 | 6,975 | 8 | 164,205 | 45 |
| review:bugs | claude-opus-5-5 | 14 | 6,683 | 28 | 830,297 | 82 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,587 | 16 | 277,260 | 863 |
| review:conventions | claude-opus-5-5 | 11 | 4,564 | 22 | 569,478 | 51 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 3,588 | 6 | 84,819 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,161 | 4 | 3,140 | 414 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,244 | 4 | 38,536 | 95 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 6 | 2,186 | 12 | 165,189 | 640 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,930 | 4 | 38,536 | 15 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,426 | 4 | 38,545 | 159 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,322 | 4 | 38,592 | 118 |
| triage | claude-sonnet-5-5 | 2 | 1,261 | 4 | 36,754 | 12 |
| machine:node tests/scripts/tep-sinh-khong-chan-g | claude-haiku-5-5 | 2 | 1,116 | 4 | 38,555 | 17 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,101 | 4 | 38,592 | 83 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 875 | 4 | 35,397 | 7 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 738 | 4 | 38,562 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 656 | 4 | 3,140 | 587 |
| capture:provenance | claude-sonnet-5-5 | 2 | 429 | 4 | 34,181 | 6 |


wall: 3052s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,588 | 84,819 | 23 | 03:30:00 | 03:30:23 |
| machine | 12 | 21,342 | 754,044 | 2989 | 03:30:00 | 04:19:49 |
| review | 3 | 18,477 | 1,680,493 | 83 | 03:30:00 | 03:31:23 |
| triage | 1 | 1,261 | 36,754 | 12 | 04:19:49 | 04:20:01 |
| capture | 1 | 429 | 34,181 | 6 | 04:20:01 | 04:20:07 |
| synthesize | 1 | 6,975 | 164,205 | 45 | 04:20:07 | 04:20:52 |

- **claude-opus-5-5**: 3 agent · 31 calls · out 18,477 · in 62 · cache_read 1,680,493 · cache_create 215,862
- **claude-sonnet-5-5**: 4 agent · 11 calls · out 12,253 · in 22 · cache_read 319,959 · cache_create 187,994
- **claude-haiku-5-5**: 12 agent · 34 calls · out 21,342 · in 68 · cache_read 754,044 · cache_create 598,412

### S4 round 3 — wf_dfee48d3-ab8 (16 agent, 36,451 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 6,564 | 10 | 232,160 | 47 |
| review:bugs | claude-opus-5-5 | 14 | 4,342 | 28 | 723,802 | 183 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 4,149 | 18 | 339,964 | 883 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,149 | 4 | 3,140 | 383 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,100 | 4 | 3,140 | 576 |
| review:measurement | claude-opus-5-5 | 5 | 2,220 | 10 | 176,981 | 25 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,164 | 4 | 38,548 | 92 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,040 | 4 | 38,548 | 13 |
| review:conventions | claude-opus-5-5 | 6 | 1,836 | 12 | 216,739 | 20 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,633 | 4 | 38,557 | 165 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,253 | 4 | 38,604 | 77 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,218 | 4 | 38,604 | 108 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 866 | 4 | 3,140 | 587 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 845 | 4 | 38,574 | 7 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 725 | 4 | 35,409 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 347 | 4 | 34,193 | 5 |


wall: 2952s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 11 | 21,142 | 616,228 | 2899 | 04:52:33 | 05:40:52 |
| review | 3 | 8,398 | 1,117,522 | 184 | 04:52:33 | 04:55:37 |
| capture | 1 | 347 | 34,193 | 5 | 05:40:52 | 05:40:58 |
| synthesize | 1 | 6,564 | 232,160 | 48 | 05:40:58 | 05:41:45 |

- **claude-sonnet-5-5**: 2 agent · 7 calls · out 6,911 · in 14 · cache_read 266,353 · cache_create 103,801
- **claude-opus-5-5**: 3 agent · 25 calls · out 8,398 · in 50 · cache_read 1,117,522 · cache_create 168,503
- **claude-haiku-5-5**: 11 agent · 29 calls · out 21,142 · in 58 · cache_read 616,228 · cache_create 565,588

