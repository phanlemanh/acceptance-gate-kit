### S4 round 1 — wf_3a05cfeb-380 (27 agent, 112,093 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 10 | 19,611 | 20 | 773,173 | 199 |
| review:bugs | claude-opus-5-5 | 18 | 15,140 | 36 | 1,391,323 | 213 |
| review:conventions | claude-opus-5-5 | 23 | 14,640 | 46 | 2,136,269 | 202 |
| synthesize:report | claude-sonnet-5-5 | 4 | 12,818 | 8 | 229,073 | 70 |
| triage | claude-sonnet-5-5 | 2 | 7,263 | 4 | 52,912 | 47 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,285 | 12 | 213,570 | 815 |
| refute:khuon-loi.test.mjs | claude-sonnet-5-5 | 8 | 4,043 | 16 | 413,495 | 50 |
| refute:khuon-loi.test.mjs | claude-sonnet-5-5 | 7 | 3,081 | 14 | 331,631 | 40 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,954 | 4 | 3,140 | 517 |
| refute:design-floor-khuon.mjs | claude-sonnet-5-5 | 6 | 2,738 | 12 | 267,875 | 35 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 2,697 | 6 | 102,777 | 30 |
| refute:khuon-loi.test.mjs | claude-sonnet-5-5 | 6 | 2,456 | 12 | 289,533 | 35 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,264 | 4 | 3,140 | 608 |
| refute:khuon-loi.test.mjs | claude-sonnet-5-5 | 5 | 2,074 | 10 | 221,932 | 26 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,016 | 4 | 47,129 | 94 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,009 | 4 | 47,129 | 13 |
| refute:khuon-loi.test.mjs | claude-sonnet-5-5 | 5 | 1,999 | 10 | 219,094 | 26 |
| refute:design-floor-khuon.mjs | claude-sonnet-5-5 | 4 | 1,572 | 8 | 155,686 | 20 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,385 | 4 | 43,998 | 172 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,220 | 4 | 47,185 | 117 |
| refute:khuon-loi.test.mjs | claude-sonnet-5-5 | 3 | 1,113 | 6 | 97,570 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,107 | 4 | 47,185 | 91 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 980 | 4 | 3,140 | 556 |
| machine:node tests/scripts/khuon-loi.test.mjs | claude-haiku-5-5 | 2 | 909 | 4 | 47,137 | 28 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 670 | 4 | 47,155 | 7 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 659 | 4 | 47,130 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 390 | 4 | 42,755 | 10 |


wall: 3204s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,697 | 102,777 | 30 | 22:25:42 | 22:26:12 |
| machine | 12 | 20,458 | 597,038 | 3017 | 22:25:42 | 23:15:58 |
| review | 3 | 49,391 | 4,300,765 | 216 | 22:25:42 | 22:29:18 |
| triage | 1 | 7,263 | 52,912 | 48 | 23:16:00 | 23:16:48 |
| refute | 8 | 19,076 | 1,996,816 | 52 | 23:16:50 | 23:17:42 |
| capture | 1 | 390 | 42,755 | 10 | 23:17:44 | 23:17:54 |
| synthesize | 1 | 12,818 | 229,073 | 70 | 23:17:56 | 23:19:06 |

- **claude-opus-5-5**: 3 agent · 51 calls · out 49,391 · in 102 · cache_read 4,300,765 · cache_create 329,651
- **claude-sonnet-5-5**: 12 agent · 55 calls · out 42,244 · in 110 · cache_read 2,424,333 · cache_create 730,091
- **claude-haiku-5-5**: 12 agent · 28 calls · out 20,458 · in 56 · cache_read 597,038 · cache_create 764,651

### S4 round 2 — wf_5165b72e-8f2 (20 agent, 55,848 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 8,505 | 12 | 354,823 | 51 |
| review:bugs | claude-opus-5-5 | 10 | 7,990 | 20 | 599,394 | 98 |
| review:measurement | claude-opus-5-5 | 9 | 7,392 | 18 | 561,124 | 97 |
| review:conventions | claude-opus-5-5 | 8 | 5,004 | 16 | 462,408 | 66 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,583 | 12 | 211,017 | 814 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,165 | 4 | 3,140 | 515 |
| refute:design-floor-khuon.mjs | claude-sonnet-5-5 | 5 | 2,933 | 10 | 217,861 | 31 |
| refute:design-floor-khuon.mjs | claude-sonnet-5-5 | 6 | 2,475 | 12 | 278,486 | 32 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,142 | 4 | 3,140 | 609 |
| triage | claude-sonnet-5-5 | 2 | 1,998 | 4 | 46,665 | 17 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,853 | 4 | 47,124 | 91 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,532 | 4 | 43,993 | 168 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,212 | 4 | 47,180 | 117 |
| machine:node tests/scripts/khuon-loi.test.mjs | claude-haiku-5-5 | 2 | 925 | 4 | 47,132 | 33 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 843 | 4 | 47,124 | 10 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 819 | 4 | 47,150 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 794 | 4 | 3,140 | 557 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 784 | 4 | 47,180 | 89 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 511 | 4 | 47,125 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 388 | 4 | 42,750 | 9 |


wall: 3123s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 12 | 19,163 | 594,445 | 3004 | 23:23:48 | 00:13:52 |
| review | 3 | 20,386 | 1,622,926 | 100 | 23:23:48 | 23:25:28 |
| triage | 1 | 1,998 | 46,665 | 17 | 00:13:54 | 00:14:11 |
| refute | 2 | 5,408 | 496,347 | 33 | 00:14:13 | 00:14:46 |
| capture | 1 | 388 | 42,750 | 9 | 00:14:48 | 00:14:57 |
| synthesize | 1 | 8,505 | 354,823 | 51 | 00:14:59 | 00:15:50 |

- **claude-sonnet-5-5**: 5 agent · 21 calls · out 16,299 · in 42 · cache_read 940,585 · cache_create 311,659
- **claude-opus-5-5**: 3 agent · 27 calls · out 20,386 · in 54 · cache_read 1,622,926 · cache_create 237,630
- **claude-haiku-5-5**: 12 agent · 28 calls · out 19,163 · in 56 · cache_read 594,445 · cache_create 762,369

