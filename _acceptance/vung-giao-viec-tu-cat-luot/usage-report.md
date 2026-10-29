### S4 round 1 — wf_275ec383-29f (24 agent, 93,525 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 20 | 17,223 | 40 | 1,519,261 | 184 |
| synthesize:report | claude-sonnet-5-5 | 5 | 14,388 | 10 | 283,515 | 87 |
| review:measurement | claude-opus-5-5 | 13 | 13,621 | 26 | 914,638 | 150 |
| review:bugs | claude-opus-5-5 | 13 | 8,414 | 26 | 775,530 | 298 |
| triage | claude-sonnet-5-5 | 2 | 5,311 | 4 | 41,284 | 37 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,933 | 14 | 198,908 | 955 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 3,760 | 4 | 37,939 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,424 | 4 | 3,034 | 447 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 2,443 | 4 | 37,310 | 15 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,329 | 4 | 3,034 | 427 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,238 | 4 | 37,199 | 90 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,194 | 4 | 37,199 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,803 | 4 | 34,174 | 192 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,694 | 4 | 37,255 | 110 |
| machine:node tests/scripts/cat-luot-vung.test.mj | claude-haiku-5-5 | 2 | 1,596 | 4 | 37,210 | 10 |
| judge:E3:domain-correctness | claude-sonnet-5-5 | 2 | 1,136 | 4 | 34,050 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,062 | 4 | 37,255 | 79 |
| judge:E3:operational-feasibility | claude-sonnet-5-5 | 3 | 1,039 | 6 | 76,707 | 11 |
| judge:E3:spec-alignment | claude-sonnet-5-5 | 2 | 998 | 4 | 37,555 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 903 | 4 | 3,034 | 556 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 891 | 4 | 37,225 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 889 | 4 | 37,200 | 6 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 800 | 4 | 37,317 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 436 | 4 | 32,955 | 5 |


wall: 3045s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,760 | 37,939 | 23 | 23:37:27 | 23:37:50 |
| machine | 14 | 27,199 | 577,354 | 2909 | 23:37:27 | 00:25:56 |
| judge | 3 | 3,173 | 148,312 | 12 | 23:37:27 | 23:37:39 |
| review | 3 | 39,258 | 3,209,429 | 299 | 23:37:27 | 23:42:26 |
| triage | 1 | 5,311 | 41,284 | 37 | 00:25:58 | 00:26:35 |
| capture | 1 | 436 | 32,955 | 5 | 00:26:38 | 00:26:43 |
| synthesize | 1 | 14,388 | 283,515 | 87 | 00:26:46 | 00:28:13 |

- **claude-opus-5-5**: 3 agent · 46 calls · out 39,258 · in 92 · cache_read 3,209,429 · cache_create 286,266
- **claude-sonnet-5-5**: 7 agent · 18 calls · out 27,068 · in 36 · cache_read 544,005 · cache_create 343,719
- **claude-haiku-5-5**: 14 agent · 33 calls · out 27,199 · in 66 · cache_read 577,354 · cache_create 635,586

### S4 round 2 — wf_45a5bbb3-951 (23 agent, 56,381 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 8 | 12,770 | 16 | 466,145 | 86 |
| review:measurement | claude-opus-5-5 | 10 | 6,731 | 20 | 556,306 | 77 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,237 | 16 | 242,691 | 991 |
| review:bugs | claude-opus-5-5 | 12 | 4,319 | 24 | 564,641 | 575 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 3,147 | 4 | 37,074 | 20 |
| review:conventions | claude-opus-5-5 | 7 | 2,565 | 14 | 273,571 | 31 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,136 | 4 | 3,034 | 442 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,061 | 4 | 37,003 | 91 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,941 | 4 | 37,114 | 12 |
| machine:node tests/scripts/cat-luot-vung.test.mj | claude-haiku-5-5 | 2 | 1,807 | 4 | 37,014 | 9 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,482 | 4 | 33,978 | 166 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,460 | 4 | 3,034 | 467 |
| judge:E3:spec-alignment | claude-sonnet-5-5 | 3 | 1,414 | 8 | 90,240 | 13 |
| triage | claude-sonnet-5-5 | 2 | 1,384 | 4 | 35,838 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,297 | 4 | 37,059 | 118 |
| judge:E3:domain-correctness | claude-sonnet-5-5 | 2 | 1,042 | 4 | 33,854 | 10 |
| judge:E3:operational-feasibility | claude-sonnet-5-5 | 2 | 977 | 4 | 37,361 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 955 | 4 | 37,059 | 78 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 916 | 4 | 3,034 | 572 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 908 | 4 | 37,004 | 7 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 760 | 4 | 37,003 | 9 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 701 | 4 | 37,029 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 371 | 4 | 32,759 | 5 |


wall: 3088s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,147 | 37,074 | 20 | 00:58:00 | 00:58:19 |
| machine | 13 | 21,661 | 582,056 | 2975 | 00:58:00 | 01:47:35 |
| judge | 3 | 3,433 | 161,455 | 15 | 00:58:00 | 00:58:14 |
| review | 3 | 13,615 | 1,394,518 | 576 | 00:58:00 | 01:07:36 |
| triage | 1 | 1,384 | 35,838 | 12 | 01:47:38 | 01:47:51 |
| capture | 1 | 371 | 32,759 | 5 | 01:47:54 | 01:47:59 |
| synthesize | 1 | 12,770 | 466,145 | 86 | 01:48:02 | 01:49:28 |

- **claude-sonnet-5-5**: 7 agent · 21 calls · out 21,105 · in 44 · cache_read 733,271 · cache_create 359,303
- **claude-opus-5-5**: 3 agent · 29 calls · out 13,615 · in 58 · cache_read 1,394,518 · cache_create 261,515
- **claude-haiku-5-5**: 13 agent · 32 calls · out 21,661 · in 64 · cache_read 582,056 · cache_create 598,178

