### S4 round 1 — wf_c5a4f62a-684 (21 agent, 34,164 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 7,430 | 6 | 109,666 | 45 |
| triage | claude-sonnet-5-5 | 2 | 3,300 | 4 | 39,155 | 26 |
| review:measurement | claude-opus-5-5 | 8 | 3,029 | 16 | 394,110 | 118 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,846 | 4 | 2,869 | 547 |
| review:conventions | claude-opus-5-5 | 17 | 2,675 | 34 | 1,147,585 | 129 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 2,603 | 8 | 82,422 | 648 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,799 | 4 | 2,869 | 510 |
| refute:ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs | claude-sonnet-5-5 | 5 | 1,649 | 10 | 172,259 | 23 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,594 | 4 | 37,901 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,514 | 4 | 37,901 | 84 |
| machine:node tests/scripts/cua-tin-hieu-goc-moi- | claude-haiku-5-5 | 2 | 1,184 | 4 | 37,926 | 20 |
| review:bugs | claude-opus-5-5 | 12 | 837 | 24 | 672,843 | 116 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 741 | 4 | 35,041 | 184 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 672 | 4 | 37,902 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 565 | 4 | 37,957 | 108 |
| machine:node tests/scripts/ve-lo-trinh-doc-tin-h | claude-haiku-5-5 | 2 | 428 | 4 | 37,933 | 14 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 423 | 4 | 37,927 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 375 | 4 | 37,957 | 104 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 2,869 | 550 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 174 | 4 | 37,642 | 31 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 33,818 | 6 |


wall: 2895s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 174 | 37,642 | 31 | 12:19:43 | 12:20:14 |
| machine | 13 | 14,919 | 429,474 | 2785 | 12:19:43 | 13:06:08 |
| review | 3 | 6,541 | 2,214,538 | 129 | 12:19:43 | 12:21:52 |
| triage | 1 | 3,300 | 39,155 | 26 | 13:06:11 | 13:06:36 |
| refute | 1 | 1,649 | 172,259 | 23 | 13:06:39 | 13:07:02 |
| capture | 1 | 151 | 33,818 | 6 | 13:07:04 | 13:07:10 |
| synthesize | 1 | 7,430 | 109,666 | 45 | 13:07:13 | 13:07:58 |

- **claude-sonnet-5-5**: 5 agent · 14 calls · out 12,704 · in 28 · cache_read 392,540 · cache_create 239,628
- **claude-opus-5-5**: 3 agent · 37 calls · out 6,541 · in 74 · cache_read 2,214,538 · cache_create 245,433
- **claude-haiku-5-5**: 13 agent · 28 calls · out 14,919 · in 56 · cache_read 429,474 · cache_create 623,885

### S4 round 2 — wf_d8e7462d-c81 (17 agent, 19,291 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 7,461 | 12 | 285,799 | 54 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 2,822 | 8 | 82,893 | 678 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 2,421 | 8 | 82,615 | 662 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,483 | 4 | 37,896 | 87 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 733 | 6 | 42,162 | 693 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 703 | 4 | 37,952 | 142 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 618 | 4 | 37,922 | 7 |
| review:measurement | claude-opus-5-5 | 8 | 584 | 16 | 368,611 | 44 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 514 | 4 | 35,036 | 183 |
| machine:node tests/scripts/ve-lo-trinh-doc-tin-h | claude-haiku-5-5 | 2 | 476 | 4 | 37,928 | 16 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 5 | 382 | 10 | 122,606 | 615 |
| review:bugs | claude-opus-5-5 | 6 | 359 | 12 | 220,194 | 34 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 214 | 4 | 37,896 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 169 | 4 | 37,952 | 123 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 169 | 4 | 37,897 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 33,813 | 6 |
| review:conventions | claude-opus-5-5 | 5 | 35 | 10 | 161,871 | 33 |


wall: 3293s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 12 | 10,704 | 630,755 | 3227 | 13:30:18 | 14:24:05 |
| review | 3 | 978 | 750,676 | 45 | 13:30:18 | 13:31:03 |
| capture | 1 | 148 | 33,813 | 6 | 14:24:08 | 14:24:13 |
| synthesize | 1 | 7,461 | 285,799 | 54 | 14:24:17 | 14:25:11 |

- **claude-sonnet-5-5**: 2 agent · 8 calls · out 7,609 · in 16 · cache_read 319,612 · cache_create 107,038
- **claude-haiku-5-5**: 12 agent · 32 calls · out 10,704 · in 64 · cache_read 630,755 · cache_create 591,447
- **claude-opus-5-5**: 3 agent · 19 calls · out 978 · in 38 · cache_read 750,676 · cache_create 150,269

### S4 round 2 (thử lại) — wf_47465c39-045 (19 agent, 26,118 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 8,127 | 12 | 306,866 | 72 |
| review:conventions | claude-opus-5-5 | 12 | 3,202 | 24 | 614,571 | 91 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,747 | 4 | 2,869 | 566 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 2,406 | 14 | 210,868 | 710 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,139 | 4 | 2,869 | 507 |
| triage | claude-sonnet-5-5 | 2 | 1,563 | 4 | 37,343 | 17 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,510 | 4 | 37,937 | 85 |
| review:measurement | claude-opus-5-5 | 4 | 1,384 | 8 | 140,145 | 29 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 516 | 4 | 37,946 | 213 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 480 | 4 | 37,963 | 7 |
| machine:node tests/scripts/ve-lo-trinh-doc-tin-h | claude-haiku-5-5 | 2 | 472 | 4 | 37,969 | 21 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 8 | 389 | 16 | 303,696 | 636 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 261 | 4 | 37,993 | 99 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 216 | 4 | 37,938 | 5 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 186 | 4 | 37,937 | 9 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 177 | 4 | 37,694 | 200 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 169 | 4 | 37,993 | 88 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 33,854 | 7 |
| review:bugs | claude-opus-5-5 | 5 | 27 | 10 | 176,560 | 39 |


wall: 3050s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 177 | 37,694 | 200 | 14:37:54 | 14:41:14 |
| machine | 12 | 11,491 | 823,978 | 2947 | 14:37:54 | 15:27:01 |
| review | 3 | 4,613 | 931,276 | 91 | 14:37:54 | 14:39:25 |
| triage | 1 | 1,563 | 37,343 | 17 | 15:27:03 | 15:27:20 |
| capture | 1 | 147 | 33,854 | 7 | 15:27:22 | 15:27:29 |
| synthesize | 1 | 8,127 | 306,866 | 72 | 15:27:32 | 15:28:44 |

- **claude-sonnet-5-5**: 4 agent · 12 calls · out 10,014 · in 24 · cache_read 415,757 · cache_create 198,040
- **claude-opus-5-5**: 3 agent · 21 calls · out 4,613 · in 42 · cache_read 931,276 · cache_create 185,131
- **claude-haiku-5-5**: 12 agent · 35 calls · out 11,491 · in 70 · cache_read 823,978 · cache_create 567,069

