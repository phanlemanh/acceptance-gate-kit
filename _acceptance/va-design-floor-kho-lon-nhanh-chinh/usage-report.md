### S4 round 1 — wf_619fde58-666 (26 agent, 77,311 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 22 | 14,725 | 44 | 1,823,445 | 324 |
| review:measurement | claude-opus-5-5 | 9 | 10,214 | 18 | 509,873 | 121 |
| synthesize:report | claude-sonnet-5-5 | 3 | 7,055 | 6 | 111,326 | 39 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 5,905 | 6 | 93,037 | 45 |
| review:conventions | claude-opus-5-5 | 9 | 5,523 | 18 | 562,732 | 73 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,796 | 14 | 215,955 | 944 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 3,615 | 8 | 84,090 | 630 |
| triage | claude-sonnet-5-5 | 2 | 3,106 | 4 | 39,965 | 24 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,946 | 4 | 3,140 | 441 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,107 | 4 | 39,185 | 95 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,852 | 4 | 39,185 | 13 |
| refute:kho-lon-nhanh-chinh.mjs | claude-sonnet-5-5 | 5 | 1,849 | 10 | 167,378 | 23 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 1,592 | 6 | 43,501 | 661 |
| machine:bash tests/design-floor/eval.sh va460-cu | claude-haiku-5-5 | 2 | 1,479 | 4 | 39,196 | 11 |
| machine:bash tests/design-floor/eval.sh va460-kh | claude-haiku-5-5 | 2 | 1,166 | 4 | 39,196 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,107 | 4 | 39,241 | 119 |
| refute:kho-lon-nhanh-chinh.mjs | claude-sonnet-5-5 | 3 | 1,044 | 6 | 76,290 | 17 |
| machine:bash tests/design-floor/eval.sh va460-nh | claude-haiku-5-5 | 2 | 1,005 | 4 | 39,198 | 10 |
| machine:bash tests/design-floor/eval.sh va460-gi | claude-haiku-5-5 | 2 | 943 | 4 | 39,195 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 924 | 4 | 39,241 | 89 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 884 | 4 | 39,211 | 7 |
| machine:bash tests/design-floor/eval.sh va460-kh | claude-haiku-5-5 | 2 | 813 | 4 | 39,196 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 791 | 4 | 36,054 | 174 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 709 | 4 | 39,186 | 7 |
| machine:bash tests/design-floor/eval.sh va460-kh | claude-haiku-5-5 | 2 | 704 | 4 | 39,196 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 457 | 4 | 34,846 | 7 |


wall: 3304s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 5,905 | 93,037 | 45 | 09:50:02 | 09:50:47 |
| machine | 17 | 27,433 | 853,166 | 3199 | 09:50:02 | 10:43:21 |
| review | 3 | 30,462 | 2,896,050 | 325 | 09:50:02 | 09:55:27 |
| triage | 1 | 3,106 | 39,965 | 24 | 10:43:24 | 10:43:48 |
| refute | 2 | 2,893 | 243,668 | 26 | 10:43:50 | 10:44:16 |
| capture | 1 | 457 | 34,846 | 7 | 10:44:18 | 10:44:24 |
| synthesize | 1 | 7,055 | 111,326 | 39 | 10:44:26 | 10:45:06 |

- **claude-opus-5-5**: 3 agent · 40 calls · out 30,462 · in 80 · cache_read 2,896,050 · cache_create 268,803
- **claude-sonnet-5-5**: 6 agent · 18 calls · out 19,416 · in 36 · cache_read 522,842 · cache_create 282,463
- **claude-haiku-5-5**: 17 agent · 42 calls · out 27,433 · in 84 · cache_read 853,166 · cache_create 789,708

### S4 round 2 — wf_1976031c-16f (23 agent, 53,013 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| baseline:diffBase | claude-sonnet-5-5 | 3 | 5,898 | 6 | 93,127 | 43 |
| synthesize:report | claude-sonnet-5-5 | 5 | 5,891 | 10 | 219,222 | 40 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,863 | 14 | 208,996 | 642 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,577 | 14 | 214,593 | 900 |
| review:measurement | claude-opus-5-5 | 6 | 4,049 | 12 | 249,308 | 46 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,101 | 4 | 6,280 | 467 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 8 | 2,861 | 16 | 253,065 | 728 |
| review:conventions | claude-opus-5-5 | 6 | 2,691 | 12 | 230,167 | 35 |
| review:bugs | claude-opus-5-5 | 7 | 2,674 | 14 | 276,258 | 53 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,072 | 4 | 39,235 | 93 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,810 | 4 | 39,235 | 12 |
| machine:bash tests/design-floor/eval.sh va460-cu | claude-haiku-5-5 | 2 | 1,475 | 4 | 39,246 | 11 |
| machine:bash tests/design-floor/eval.sh va460-kh | claude-haiku-5-5 | 2 | 1,392 | 4 | 39,246 | 13 |
| machine:bash tests/design-floor/eval.sh va460-gi | claude-haiku-5-5 | 2 | 1,276 | 4 | 39,245 | 10 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,270 | 4 | 39,244 | 172 |
| machine:bash tests/design-floor/eval.sh va460-kh | claude-haiku-5-5 | 2 | 1,221 | 4 | 39,246 | 14 |
| machine:bash tests/design-floor/eval.sh va460-nh | claude-haiku-5-5 | 2 | 1,059 | 4 | 39,248 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,031 | 4 | 39,291 | 118 |
| machine:bash tests/design-floor/eval.sh va460-kh | claude-haiku-5-5 | 2 | 979 | 4 | 39,246 | 9 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 893 | 4 | 39,261 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 804 | 4 | 39,291 | 123 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 668 | 4 | 39,236 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 458 | 4 | 34,896 | 6 |


wall: 3338s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 5,898 | 93,127 | 44 | 10:46:53 | 10:47:37 |
| machine | 17 | 31,352 | 1,193,204 | 3288 | 10:46:53 | 11:41:42 |
| review | 3 | 9,414 | 755,733 | 54 | 10:46:53 | 10:47:48 |
| capture | 1 | 458 | 34,896 | 6 | 11:41:44 | 11:41:50 |
| synthesize | 1 | 5,891 | 219,222 | 40 | 11:41:52 | 11:42:31 |

- **claude-sonnet-5-5**: 3 agent · 10 calls · out 12,247 · in 20 · cache_read 347,245 · cache_create 158,455
- **claude-haiku-5-5**: 17 agent · 50 calls · out 31,352 · in 100 · cache_read 1,193,204 · cache_create 782,151
- **claude-opus-5-5**: 3 agent · 19 calls · out 9,414 · in 38 · cache_read 755,733 · cache_create 173,526

