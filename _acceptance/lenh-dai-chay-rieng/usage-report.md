### S4 round 1 — wf_09358bc0-1f4 (29 agent, 51,718 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 9,578 | 6 | 218,260 | 69 |
| review:bugs | claude-opus-5-5 | 11 | 5,424 | 22 | 1,335,564 | 206 |
| triage | claude-sonnet-5-5 | 2 | 4,506 | 4 | 86,509 | 34 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 4,013 | 18 | 90,947 | 191 |
| review:measurement | claude-opus-5-5 | 14 | 2,146 | 28 | 1,710,613 | 230 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 6 | 1,817 | 50 | 365,260 | 467 |
| judge:E4:domain-correctness | claude-sonnet-5-5 | 2 | 1,702 | 4 | 81,190 | 16 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 2 | 1,597 | 4 | 116,097 | 18 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,525 | 18 | 57,866 | 391 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 3 | 1,514 | 6 | 204,228 | 18 |
| judge:E4:operational-feasibility | claude-sonnet-5-5 | 2 | 1,495 | 4 | 116,020 | 14 |
| review:conventions | claude-opus-5-5 | 18 | 1,484 | 36 | 2,245,242 | 157 |
| machine:bash -c 'out=$(node tests/workflows/lenh | claude-haiku-4-5-20251001 | 2 | 1,289 | 18 | 91,038 | 42 |
| machine:bash -c 'out=$(node tests/workflows/lenh | claude-haiku-4-5-20251001 | 2 | 1,266 | 18 | 91,037 | 39 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 3 | 1,248 | 6 | 204,228 | 16 |
| judge:E4:spec-alignment | claude-sonnet-5-5 | 2 | 1,235 | 4 | 116,018 | 14 |
| machine:bash -c 'out=$(node tests/workflows/lenh | claude-haiku-4-5-20251001 | 2 | 1,212 | 18 | 91,038 | 42 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,171 | 18 | 90,934 | 24 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,157 | 18 | 90,934 | 47 |
| machine:bash -c 'out=$(node tests/workflows/lenh | claude-haiku-4-5-20251001 | 3 | 1,042 | 26 | 156,686 | 39 |
| machine:bash -c 'out=$(node tests/scripts/s4-arg | claude-haiku-4-5-20251001 | 2 | 929 | 18 | 91,045 | 22 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 923 | 18 | 62,009 | 133 |
| machine:bash -c 'out=$(node tests/scripts/s4-arg | claude-haiku-4-5-20251001 | 2 | 891 | 18 | 91,041 | 23 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 826 | 8 | 261,169 | 21 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 598 | 18 | 90,941 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 461 | 18 | 90,983 | 90 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 297 | 18 | 90,983 | 283 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 222 | 18 | 90,983 | 70 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 80,384 | 6 |


wall: 1844s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 826 | 261,169 | 21 | 02:24:25 | 02:24:46 |
| machine | 16 | 18,813 | 1,733,725 | 1728 | 02:24:25 | 02:53:13 |
| judge | 6 | 8,791 | 837,781 | 37 | 02:24:25 | 02:25:02 |
| review | 3 | 9,054 | 5,291,419 | 234 | 02:24:44 | 02:28:38 |
| triage | 1 | 4,506 | 86,509 | 34 | 02:53:15 | 02:53:49 |
| capture | 1 | 150 | 80,384 | 6 | 02:53:52 | 02:53:58 |
| synthesize | 1 | 9,578 | 218,260 | 69 | 02:54:00 | 02:55:09 |

- **claude-sonnet-5-5**: 10 agent · 25 calls · out 23,851 · in 50 · cache_read 1,484,103 · cache_create 769,014
- **claude-opus-5-5**: 3 agent · 43 calls · out 9,054 · in 86 · cache_read 5,291,419 · cache_create 406,764
- **claude-haiku-4-5-20251001**: 16 agent · 37 calls · out 18,813 · in 328 · cache_read 1,733,725 · cache_create 667,403

### S4 round 2 — wf_4b431317-d9a (28 agent, 43,033 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 11,643 | 10 | 456,139 | 85 |
| triage | claude-sonnet-5-5 | 2 | 3,596 | 4 | 85,143 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,169 | 18 | 90,957 | 181 |
| review:conventions | claude-opus-5-5 | 20 | 1,753 | 40 | 2,463,001 | 153 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,743 | 18 | 90,957 | 234 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,673 | 28 | 157,516 | 31 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,557 | 18 | 28,933 | 400 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 3 | 1,481 | 6 | 204,138 | 17 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,472 | 18 | 90,944 | 48 |
| review:measurement | claude-opus-5-5 | 8 | 1,453 | 16 | 838,393 | 128 |
| review:bugs | claude-opus-5-5 | 14 | 1,445 | 28 | 1,635,417 | 182 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 3 | 1,413 | 6 | 204,255 | 19 |
| judge:E4:operational-feasibility | claude-sonnet-5-5 | 2 | 1,288 | 4 | 116,029 | 14 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 3 | 1,252 | 6 | 204,133 | 18 |
| judge:E4:domain-correctness | claude-sonnet-5-5 | 2 | 1,197 | 4 | 81,199 | 12 |
| judge:E4:spec-alignment | claude-sonnet-5-5 | 2 | 1,171 | 4 | 116,027 | 11 |
| machine:bash -c 'out=$(node tests/workflows/lenh | claude-haiku-4-5-20251001 | 2 | 1,035 | 18 | 91,048 | 39 |
| machine:bash -c 'out=$(node tests/scripts/s4-arg | claude-haiku-4-5-20251001 | 2 | 1,026 | 18 | 91,051 | 25 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 975 | 18 | 90,952 | 133 |
| machine:bash -c 'out=$(node tests/scripts/s4-arg | claude-haiku-4-5-20251001 | 2 | 968 | 18 | 91,055 | 21 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 508 | 18 | 90,993 | 89 |
| machine:bash -c 'out=$(node tests/workflows/lenh | claude-haiku-4-5-20251001 | 2 | 500 | 18 | 91,047 | 32 |
| machine:bash -c 'out=$(node tests/workflows/lenh | claude-haiku-4-5-20251001 | 2 | 444 | 18 | 91,038 | 28 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 439 | 18 | 90,993 | 282 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 426 | 18 | 90,951 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 253 | 18 | 90,993 | 72 |
| capture:provenance | claude-sonnet-5-5 | 2 | 149 | 4 | 80,393 | 7 |
| machine:bash -c 'out=$(node tests/workflows/lenh | claude-haiku-4-5-20251001 | 2 | 4 | 18 | 91,048 | 44 |


wall: 1624s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 16 | 15,192 | 1,460,476 | 1498 | 03:05:55 | 03:30:53 |
| judge | 6 | 7,802 | 925,781 | 31 | 03:05:55 | 03:06:26 |
| review | 3 | 4,651 | 4,936,811 | 185 | 03:06:10 | 03:09:14 |
| triage | 1 | 3,596 | 85,143 | 28 | 03:30:55 | 03:31:23 |
| capture | 1 | 149 | 80,393 | 7 | 03:31:25 | 03:31:32 |
| synthesize | 1 | 11,643 | 456,139 | 85 | 03:31:34 | 03:32:59 |

- **claude-sonnet-5-5**: 9 agent · 24 calls · out 23,190 · in 48 · cache_read 1,547,456 · cache_create 676,349
- **claude-haiku-4-5-20251001**: 16 agent · 33 calls · out 15,192 · in 298 · cache_read 1,460,476 · cache_create 664,492
- **claude-opus-5-5**: 3 agent · 42 calls · out 4,651 · in 84 · cache_read 4,936,811 · cache_create 387,054

