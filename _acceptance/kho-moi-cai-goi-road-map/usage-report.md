### S4 round 1 — wf_7b1173b7-ff6 (21 agent, 39,941 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 10,724 | 6 | 124,907 | 58 |
| triage | claude-sonnet-5-5 | 2 | 7,828 | 4 | 40,302 | 53 |
| review:measurement | claude-opus-5-5 | 10 | 3,955 | 20 | 653,851 | 202 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,782 | 4 | 2,869 | 434 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,502 | 4 | 2,869 | 434 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,392 | 4 | 2,869 | 454 |
| review:bugs | claude-opus-5-5 | 23 | 1,990 | 46 | 1,647,482 | 179 |
| review:conventions | claude-opus-5-5 | 14 | 1,895 | 28 | 991,259 | 134 |
| refute:kho-moi-cai-goi-road-map.test.mjs | claude-sonnet-5-5 | 7 | 1,193 | 14 | 256,107 | 39 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,028 | 4 | 35,919 | 83 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 585 | 4 | 33,059 | 144 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 476 | 4 | 35,975 | 84 |
| machine:node tests/scripts/kho-moi-cai-goi-road- | claude-haiku-5-5 | 2 | 457 | 4 | 35,942 | 30 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 444 | 4 | 35,945 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 438 | 4 | 2,869 | 425 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 288 | 4 | 35,919 | 9 |
| machine:node tests/scripts/kho-moi-cai-goi-road- | claude-haiku-5-5 | 2 | 233 | 4 | 35,938 | 17 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 217 | 4 | 35,920 | 8 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 197 | 4 | 35,634 | 17 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 169 | 4 | 35,975 | 74 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 31,837 | 6 |


wall: 2348s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 197 | 35,634 | 17 | 09:43:25 | 09:43:42 |
| machine | 13 | 12,011 | 332,068 | 2182 | 09:43:25 | 10:19:47 |
| review | 3 | 7,840 | 3,292,592 | 203 | 09:43:25 | 09:46:48 |
| triage | 1 | 7,828 | 40,302 | 53 | 10:19:50 | 10:20:42 |
| refute | 1 | 1,193 | 256,107 | 39 | 10:20:45 | 10:21:24 |
| capture | 1 | 148 | 31,837 | 6 | 10:21:26 | 10:21:32 |
| synthesize | 1 | 10,724 | 124,907 | 58 | 10:21:35 | 10:22:33 |

- **claude-sonnet-5-5**: 5 agent · 16 calls · out 20,090 · in 32 · cache_read 488,787 · cache_create 245,756
- **claude-opus-5-5**: 3 agent · 47 calls · out 7,840 · in 94 · cache_read 3,292,592 · cache_create 284,466
- **claude-haiku-5-5**: 13 agent · 26 calls · out 12,011 · in 52 · cache_read 332,068 · cache_create 587,461

### S4 round 2 — wf_2bab6b1b-05c (18 agent, 29,127 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 8 | 10,678 | 16 | 446,462 | 77 |
| triage | claude-sonnet-5-5 | 2 | 2,901 | 4 | 36,049 | 22 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,638 | 4 | 2,869 | 414 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,606 | 4 | 2,869 | 392 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,345 | 4 | 2,869 | 427 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,784 | 4 | 35,747 | 85 |
| review:bugs | claude-opus-5-5 | 17 | 1,705 | 34 | 994,602 | 124 |
| review:measurement | claude-opus-5-5 | 9 | 1,690 | 18 | 557,365 | 105 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 693 | 4 | 35,803 | 78 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 348 | 4 | 35,773 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 328 | 4 | 2,869 | 372 |
| machine:node tests/scripts/kho-moi-cai-goi-road- | claude-haiku-5-5 | 2 | 274 | 4 | 35,766 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 263 | 4 | 35,756 | 133 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 216 | 4 | 35,747 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 215 | 4 | 35,748 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 35,803 | 67 |
| capture:provenance | claude-sonnet-5-5 | 2 | 143 | 4 | 31,665 | 6 |
| review:conventions | claude-opus-5-5 | 7 | 127 | 14 | 248,241 | 42 |


wall: 2131s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 12 | 11,883 | 297,619 | 2018 | 18:12:20 | 18:45:57 |
| review | 3 | 3,522 | 1,800,208 | 125 | 18:12:20 | 18:14:25 |
| triage | 1 | 2,901 | 36,049 | 22 | 18:45:59 | 18:46:22 |
| capture | 1 | 143 | 31,665 | 6 | 18:46:24 | 18:46:31 |
| synthesize | 1 | 10,678 | 446,462 | 77 | 18:46:34 | 18:47:51 |

- **claude-sonnet-5-5**: 3 agent · 12 calls · out 13,722 · in 24 · cache_read 514,176 · cache_create 152,570
- **claude-haiku-5-5**: 12 agent · 24 calls · out 11,883 · in 48 · cache_read 297,619 · cache_create 547,274
- **claude-opus-5-5**: 3 agent · 33 calls · out 3,522 · in 66 · cache_read 1,800,208 · cache_create 214,480

