### S4 round 1 — wf_4efc746c-20e (22 agent, 38,838 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 12,591 | 8 | 197,523 | 74 |
| triage | claude-sonnet-5-5 | 2 | 6,312 | 4 | 40,534 | 46 |
| review:measurement | claude-opus-5-5 | 21 | 4,209 | 42 | 2,360,168 | 224 |
| review:bugs | claude-opus-5-5 | 28 | 3,548 | 56 | 2,752,852 | 284 |
| review:conventions | claude-opus-5-5 | 26 | 3,417 | 52 | 2,771,831 | 215 |
| refute:evals.yaml | claude-sonnet-5-5 | 4 | 1,251 | 8 | 111,460 | 22 |
| refute:lo-trinh.mjs | claude-sonnet-5-5 | 12 | 1,150 | 24 | 599,091 | 60 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,068 | 4 | 2,869 | 457 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 718 | 4 | 35,671 | 142 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 693 | 4 | 35,718 | 83 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 626 | 6 | 39,454 | 613 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 526 | 4 | 32,849 | 72 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 459 | 4 | 35,688 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 420 | 4 | 35,663 | 6 |
| machine:node tests/scripts/ap-chinh-sach-lo-trin | claude-haiku-5-5 | 2 | 316 | 4 | 35,684 | 62 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 287 | 4 | 2,869 | 399 |
| machine:node tests/scripts/ap-chinh-sach-lo-trin | claude-haiku-5-5 | 2 | 252 | 4 | 35,683 | 35 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 220 | 4 | 35,662 | 81 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 220 | 4 | 35,662 | 8 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 207 | 4 | 35,944 | 92 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 202 | 4 | 35,676 | 203 |
| capture:provenance | claude-sonnet-5-5 | 2 | 146 | 4 | 31,583 | 6 |


wall: 2290s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 207 | 35,944 | 92 | 04:55:38 | 04:57:10 |
| machine | 13 | 6,007 | 399,148 | 2094 | 04:55:38 | 05:30:32 |
| review | 3 | 11,174 | 7,884,851 | 286 | 04:55:38 | 05:00:24 |
| triage | 1 | 6,312 | 40,534 | 46 | 05:30:35 | 05:31:20 |
| refute | 2 | 2,401 | 710,551 | 60 | 05:31:23 | 05:32:23 |
| capture | 1 | 146 | 31,583 | 6 | 05:32:25 | 05:32:31 |
| synthesize | 1 | 12,591 | 197,523 | 74 | 05:32:33 | 05:33:48 |

- **claude-sonnet-5-5**: 6 agent · 26 calls · out 21,657 · in 52 · cache_read 1,016,135 · cache_create 308,328
- **claude-opus-5-5**: 3 agent · 75 calls · out 11,174 · in 150 · cache_read 7,884,851 · cache_create 462,228
- **claude-haiku-5-5**: 13 agent · 27 calls · out 6,007 · in 54 · cache_read 399,148 · cache_create 549,117

### S4 round 2 — wf_7227ab26-e6a (19 agent, 30,017 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 7,742 | 6 | 116,034 | 50 |
| review:bugs | claude-opus-5-5 | 9 | 4,142 | 18 | 430,520 | 119 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,817 | 4 | 2,869 | 612 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,587 | 4 | 2,869 | 468 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,478 | 4 | 35,744 | 207 |
| review:measurement | claude-opus-5-5 | 8 | 2,166 | 16 | 339,127 | 89 |
| triage | claude-sonnet-5-5 | 2 | 1,576 | 4 | 35,381 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,486 | 4 | 35,730 | 82 |
| review:conventions | claude-opus-5-5 | 9 | 1,417 | 18 | 416,783 | 112 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 936 | 4 | 35,739 | 138 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 748 | 4 | 35,786 | 83 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 487 | 4 | 35,756 | 6 |
| machine:node tests/scripts/ap-chinh-sach-lo-trin | claude-haiku-5-5 | 2 | 278 | 4 | 35,752 | 61 |
| machine:node tests/scripts/ap-chinh-sach-lo-trin | claude-haiku-5-5 | 2 | 251 | 4 | 35,751 | 36 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 213 | 4 | 35,731 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 192 | 4 | 2,869 | 396 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 182 | 4 | 35,730 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 169 | 4 | 32,917 | 76 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 31,651 | 7 |


wall: 2182s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 13 | 12,824 | 363,243 | 2104 | 06:08:38 | 06:43:42 |
| review | 3 | 7,725 | 1,186,430 | 121 | 06:08:38 | 06:10:39 |
| triage | 1 | 1,576 | 35,381 | 14 | 06:43:44 | 06:43:59 |
| capture | 1 | 150 | 31,651 | 7 | 06:44:02 | 06:44:08 |
| synthesize | 1 | 7,742 | 116,034 | 50 | 06:44:11 | 06:45:00 |

- **claude-sonnet-5-5**: 3 agent · 7 calls · out 9,468 · in 14 · cache_read 183,066 · cache_create 150,181
- **claude-opus-5-5**: 3 agent · 26 calls · out 7,725 · in 52 · cache_read 1,186,430 · cache_create 188,229
- **claude-haiku-5-5**: 13 agent · 26 calls · out 12,824 · in 52 · cache_read 363,243 · cache_create 550,777

### S4 round 3 — wf_c65277b8-930 (17 agent, 25,463 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 7 | 9,896 | 14 | 434,149 | 70 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,706 | 4 | 2,869 | 615 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,299 | 4 | 35,788 | 206 |
| triage | claude-sonnet-5-5 | 2 | 1,721 | 4 | 35,824 | 14 |
| review:bugs | claude-opus-5-5 | 4 | 1,686 | 8 | 113,141 | 39 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,464 | 4 | 35,774 | 83 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,140 | 4 | 2,869 | 459 |
| review:measurement | claude-opus-5-5 | 7 | 1,092 | 14 | 241,884 | 50 |
| review:conventions | claude-opus-5-5 | 5 | 850 | 10 | 151,999 | 49 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 682 | 4 | 35,830 | 86 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 579 | 4 | 32,914 | 138 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 402 | 4 | 35,800 | 6 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 238 | 4 | 35,774 | 9 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 213 | 4 | 35,775 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 2,869 | 400 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 171 | 4 | 35,830 | 71 |
| capture:provenance | claude-sonnet-5-5 | 2 | 149 | 4 | 31,695 | 6 |


wall: 2202s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 11 | 10,069 | 292,092 | 2105 | 06:50:55 | 07:26:00 |
| review | 3 | 3,628 | 507,024 | 51 | 06:50:55 | 06:51:47 |
| triage | 1 | 1,721 | 35,824 | 14 | 07:26:03 | 07:26:17 |
| capture | 1 | 149 | 31,695 | 6 | 07:26:19 | 07:26:26 |
| synthesize | 1 | 9,896 | 434,149 | 70 | 07:26:28 | 07:27:38 |

- **claude-sonnet-5-5**: 3 agent · 11 calls · out 11,766 · in 22 · cache_read 501,668 · cache_create 163,818
- **claude-haiku-5-5**: 11 agent · 22 calls · out 10,069 · in 44 · cache_read 292,092 · cache_create 482,322
- **claude-opus-5-5**: 3 agent · 16 calls · out 3,628 · in 32 · cache_read 507,024 · cache_create 125,474

