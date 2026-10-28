### S4 round 1 — wf_81628fb2-b5d (27 agent, 99,169 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 28 | 22,649 | 56 | 3,080,926 | 287 |
| review:measurement | claude-opus-5-5 | 8 | 12,374 | 16 | 543,999 | 134 |
| synthesize:report | claude-sonnet-5-5 | 6 | 10,671 | 12 | 319,797 | 73 |
| review:conventions | claude-opus-5-5 | 18 | 7,762 | 36 | 1,096,597 | 98 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 6,538 | 4 | 41,841 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,828 | 12 | 162,093 | 923 |
| triage | claude-sonnet-5-5 | 2 | 3,941 | 4 | 39,980 | 33 |
| machine:bash tests/design-floor/eval.sh ngoai-tu | claude-haiku-5-5 | 2 | 2,953 | 4 | 38,250 | 48 |
| machine:bash tests/design-floor/eval.sh xfail-co | claude-haiku-5-5 | 2 | 2,489 | 4 | 38,244 | 17 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,357 | 4 | 3,034 | 389 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,355 | 4 | 38,236 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,255 | 4 | 38,236 | 88 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,877 | 4 | 35,211 | 170 |
| machine:bash tests/design-floor/eval.sh ban-va-a | claude-haiku-5-5 | 2 | 1,687 | 4 | 38,246 | 31 |
| machine:bash tests/design-floor/eval.sh vo | claude-haiku-5-5 | 2 | 1,601 | 4 | 38,238 | 29 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,564 | 4 | 3,034 | 456 |
| machine:bash tests/design-floor/eval.sh va01 | claude-haiku-5-5 | 2 | 1,478 | 4 | 38,238 | 24 |
| machine:bash tests/design-floor/eval.sh luat-gio | claude-haiku-5-5 | 2 | 1,348 | 4 | 38,247 | 28 |
| machine:bash tests/design-floor/eval.sh fn01 | claude-haiku-5-5 | 2 | 1,180 | 4 | 38,240 | 30 |
| machine:bash tests/design-floor/eval.sh bg01 | claude-haiku-5-5 | 2 | 1,061 | 4 | 38,240 | 25 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 1,029 | 4 | 38,262 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,016 | 4 | 38,292 | 81 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,009 | 4 | 38,292 | 110 |
| machine:bash tests/design-floor/eval.sh dong-bo | claude-haiku-5-5 | 2 | 1,004 | 4 | 38,244 | 26 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 912 | 4 | 3,034 | 559 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 870 | 4 | 38,237 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 361 | 4 | 33,989 | 12 |


wall: 2953s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 6,538 | 41,841 | 36 | 05:59:25 | 06:00:00 |
| machine | 20 | 34,873 | 780,148 | 2826 | 05:59:25 | 06:46:31 |
| review | 3 | 42,785 | 4,721,522 | 308 | 05:59:25 | 06:04:32 |
| triage | 1 | 3,941 | 39,980 | 33 | 06:46:34 | 06:47:07 |
| capture | 1 | 361 | 33,989 | 12 | 06:47:10 | 06:47:22 |
| synthesize | 1 | 10,671 | 319,797 | 73 | 06:47:24 | 06:48:37 |

- **claude-opus-5-5**: 3 agent · 54 calls · out 42,785 · in 108 · cache_read 4,721,522 · cache_create 326,111
- **claude-sonnet-5-5**: 4 agent · 12 calls · out 21,511 · in 24 · cache_read 435,607 · cache_create 202,117
- **claude-haiku-5-5**: 20 agent · 44 calls · out 34,873 · in 88 · cache_read 780,148 · cache_create 870,314

