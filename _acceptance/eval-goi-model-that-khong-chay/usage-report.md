### S4 round 1 — wf_64244220-98b (31 agent, 81,990 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| triage | claude-sonnet-5-5 | 2 | 20,932 | 4 | 91,312 | 136 |
| synthesize:report | claude-sonnet-5-5 | 11 | 13,160 | 22 | 1,379,538 | 179 |
| review:conventions | claude-opus-5-5 | 35 | 7,770 | 70 | 6,643,779 | 456 |
| review:measurement | claude-opus-5-5 | 17 | 4,226 | 34 | 2,586,115 | 406 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 5 | 4,009 | 10 | 364,508 | 80 |
| review:bugs | claude-opus-5-5 | 31 | 3,430 | 62 | 5,835,435 | 604 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,755 | 4 | 34,982 | 609 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,461 | 4 | 69,964 | 452 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,255 | 4 | 34,982 | 414 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,039 | 4 | 117,093 | 89 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 8 | 1,789 | 16 | 736,957 | 86 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 1,723 | 4 | 117,117 | 34 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,628 | 4 | 117,093 | 13 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 1,564 | 4 | 117,117 | 32 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,450 | 4 | 117,149 | 128 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,450 | 4 | 117,102 | 193 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 6 | 1,055 | 12 | 513,959 | 76 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 980 | 4 | 117,117 | 20 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 931 | 4 | 117,117 | 22 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 905 | 4 | 117,117 | 17 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 837 | 4 | 117,117 | 13 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 659 | 4 | 117,117 | 19 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 629 | 4 | 117,149 | 77 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 624 | 4 | 117,117 | 13 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 576 | 4 | 89,720 | 42 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 478 | 4 | 117,117 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 472 | 4 | 117,094 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 384 | 4 | 117,149 | 303 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 360 | 4 | 117,117 | 10 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 323 | 4 | 117,117 | 13 |
| capture:provenance | claude-sonnet-5-5 | 2 | 136 | 4 | 80,896 | 8 |


wall: 2630s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 576 | 89,720 | 42 | 10:19:15 | 10:19:57 |
| machine | 21 | 24,907 | 2,248,044 | 2300 | 10:19:15 | 10:57:35 |
| judge | 3 | 6,853 | 1,615,424 | 89 | 10:19:15 | 10:20:44 |
| review | 3 | 15,426 | 15,065,329 | 606 | 10:19:29 | 10:29:35 |
| triage | 1 | 20,932 | 91,312 | 136 | 10:57:37 | 10:59:53 |
| capture | 1 | 136 | 80,896 | 8 | 10:59:55 | 11:00:03 |
| synthesize | 1 | 13,160 | 1,379,538 | 179 | 11:00:06 | 11:03:05 |

- **claude-sonnet-5-5**: 7 agent · 36 calls · out 41,657 · in 72 · cache_read 3,256,890 · cache_create 730,683
- **claude-opus-5-5**: 3 agent · 83 calls · out 15,426 · in 166 · cache_read 15,065,329 · cache_create 675,682
- **claude-haiku-5-5**: 21 agent · 42 calls · out 24,907 · in 84 · cache_read 2,248,044 · cache_create 1,327,959

### S4 round 2 — wf_4df9a100-330 (30 agent, 88,991 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E11:domain-correctness | claude-sonnet-5-5 | 6 | 28,052 | 12 | 537,885 | 240 |
| synthesize:report | claude-sonnet-5-5 | 11 | 16,981 | 22 | 1,371,955 | 162 |
| triage | claude-sonnet-5-5 | 2 | 7,480 | 4 | 87,641 | 52 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 7 | 4,189 | 14 | 659,751 | 114 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,830 | 4 | 69,964 | 609 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 2,510 | 4 | 117,112 | 35 |
| review:measurement | claude-opus-5-5 | 20 | 2,476 | 40 | 2,448,857 | 211 |
| review:conventions | claude-opus-5-5 | 28 | 2,384 | 56 | 3,441,431 | 238 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,198 | 4 | 69,964 | 408 |
| review:bugs | claude-opus-5-5 | 18 | 1,884 | 36 | 2,036,378 | 120 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,852 | 4 | 69,964 | 434 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,804 | 4 | 117,088 | 88 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,731 | 4 | 117,088 | 13 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 6 | 1,727 | 12 | 528,495 | 145 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 1,648 | 4 | 117,112 | 32 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,356 | 4 | 117,144 | 130 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,282 | 4 | 117,097 | 186 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 975 | 4 | 117,112 | 14 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 939 | 4 | 117,112 | 20 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 924 | 4 | 117,112 | 18 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 837 | 4 | 117,112 | 11 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 580 | 4 | 117,112 | 19 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 554 | 4 | 117,112 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 427 | 4 | 117,144 | 78 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 409 | 4 | 117,089 | 6 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 373 | 4 | 117,112 | 10 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 323 | 4 | 117,112 | 13 |
| capture:provenance | claude-sonnet-5-5 | 2 | 137 | 4 | 80,891 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 117,144 | 309 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 6 | 4 | 117,112 | 18 |


wall: 2508s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 21 | 23,681 | 2,317,918 | 2280 | 11:14:03 | 11:52:03 |
| judge | 3 | 33,968 | 1,726,131 | 243 | 11:14:03 | 11:18:06 |
| review | 3 | 6,744 | 7,926,666 | 251 | 11:14:03 | 11:18:14 |
| triage | 1 | 7,480 | 87,641 | 52 | 11:52:05 | 11:52:57 |
| capture | 1 | 137 | 80,891 | 8 | 11:52:59 | 11:53:07 |
| synthesize | 1 | 16,981 | 1,371,955 | 162 | 11:53:09 | 11:55:51 |

- **claude-sonnet-5-5**: 6 agent · 34 calls · out 58,566 · in 68 · cache_read 3,266,618 · cache_create 703,042
- **claude-haiku-5-5**: 21 agent · 42 calls · out 23,681 · in 84 · cache_read 2,317,918 · cache_create 1,257,232
- **claude-opus-5-5**: 3 agent · 66 calls · out 6,744 · in 132 · cache_read 7,926,666 · cache_create 384,193

### S4 round 3 — wf_17c5c3a1-eb7 (35 agent, 41,010 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 7 | 13,342 | 14 | 740,520 | 105 |
| triage | claude-sonnet-5-5 | 3 | 3,595 | 6 | 185,913 | 25 |
| review:measurement | claude-opus-5-5 | 12 | 2,823 | 24 | 1,284,988 | 149 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 3 | 2,442 | 6 | 210,330 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,275 | 4 | 34,982 | 441 |
| review:bugs | claude-opus-5-5 | 10 | 1,559 | 20 | 1,075,774 | 101 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 1,304 | 4 | 117,159 | 37 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 5 | 1,154 | 10 | 422,852 | 34 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 1,139 | 4 | 117,159 | 34 |
| review:conventions | claude-opus-5-5 | 13 | 1,138 | 26 | 1,268,938 | 82 |
| refute:ma-tran.mjs | claude-sonnet-5-5 | 5 | 838 | 10 | 365,641 | 29 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 3 | 763 | 6 | 204,909 | 18 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 737 | 4 | 117,159 | 21 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 701 | 4 | 91,433 | 49 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 681 | 4 | 34,982 | 379 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 619 | 4 | 117,159 | 23 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 583 | 4 | 117,159 | 16 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 573 | 4 | 117,159 | 9 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 497 | 6 | 157,869 | 664 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 6 | 470 | 12 | 499,508 | 37 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 449 | 4 | 117,159 | 20 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 445 | 4 | 117,159 | 47 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 360 | 4 | 117,159 | 11 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 354 | 4 | 117,159 | 13 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 338 | 4 | 117,159 | 16 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 324 | 4 | 117,159 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 258 | 4 | 117,191 | 130 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 236 | 4 | 117,135 | 8 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 194 | 4 | 117,144 | 174 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 193 | 4 | 117,135 | 83 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 165 | 4 | 117,136 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 149 | 4 | 80,938 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 144 | 4 | 117,191 | 80 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 144 | 4 | 34,982 | 322 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 24 | 4 | 117,159 | 18 |


wall: 2481s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 701 | 91,433 | 49 | 12:21:37 | 12:22:26 |
| machine | 24 | 12,799 | 2,693,723 | 2306 | 12:21:37 | 13:00:03 |
| judge | 3 | 4,066 | 1,132,690 | 37 | 12:21:50 | 12:22:27 |
| review | 3 | 5,520 | 3,629,700 | 150 | 12:21:55 | 12:24:25 |
| triage | 1 | 3,595 | 185,913 | 25 | 13:00:05 | 13:00:30 |
| refute | 1 | 838 | 365,641 | 29 | 13:00:33 | 13:01:02 |
| capture | 1 | 149 | 80,938 | 6 | 13:01:06 | 13:01:12 |
| synthesize | 1 | 13,342 | 740,520 | 105 | 13:01:14 | 13:02:58 |

- **claude-sonnet-5-5**: 8 agent · 33 calls · out 22,691 · in 66 · cache_read 2,597,135 · cache_create 785,809
- **claude-opus-5-5**: 3 agent · 35 calls · out 5,520 · in 70 · cache_read 3,629,700 · cache_create 333,873
- **claude-haiku-5-5**: 24 agent · 50 calls · out 12,799 · in 100 · cache_read 2,693,723 · cache_create 1,565,868

