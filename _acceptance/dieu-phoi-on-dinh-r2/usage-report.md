### S4 round 1 — wf_6cb13261-055 (23 agent, 88,837 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 21 | 35,712 | 42 | 1,861,630 | 233 |
| triage | claude-sonnet-5-5 | 2 | 14,317 | 4 | 40,956 | 91 |
| review:measurement | claude-opus-5-5 | 20 | 5,108 | 40 | 2,238,473 | 462 |
| review:conventions | claude-opus-5-5 | 47 | 4,446 | 94 | 5,925,152 | 422 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 3,680 | 12 | 150,568 | 627 |
| review:bugs | claude-opus-5-5 | 50 | 3,635 | 100 | 6,098,596 | 504 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 3,610 | 12 | 152,299 | 833 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,583 | 4 | 34,641 | 178 |
| machine:node tests/dieu-phoi/dp8-crm-that.mjs | claude-haiku-5-5 | 2 | 2,498 | 4 | 34,643 | 56 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,986 | 4 | 34,745 | 90 |
| refute:dp8-crm-that.mjs | claude-sonnet-5-5 | 9 | 1,965 | 18 | 350,479 | 122 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,745 | 4 | 34,627 | 12 |
| refute:on-dinh-r2.test.mjs | claude-sonnet-5-5 | 7 | 1,629 | 14 | 257,113 | 59 |
| machine:node tests/dieu-phoi/kiem-validate.mjs | claude-haiku-5-5 | 2 | 1,425 | 4 | 34,639 | 11 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,343 | 4 | 34,627 | 86 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 855 | 4 | 34,683 | 123 |
| machine:bash -c 'LB_CASES=LB1,LB2 node tests/plu | claude-haiku-5-5 | 2 | 675 | 4 | 34,668 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 567 | 4 | 2,869 | 317 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 516 | 4 | 34,683 | 72 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 213 | 4 | 34,628 | 5 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 169 | 4 | 35,388 | 100 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 30,544 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 13 | 4 | 31,767 | 201 |


wall: 2935s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 169 | 35,388 | 100 | 11:49:41 | 11:51:21 |
| machine | 14 | 21,709 | 684,087 | 2475 | 11:49:41 | 12:30:55 |
| review | 3 | 13,189 | 14,262,221 | 505 | 11:49:41 | 11:58:06 |
| triage | 1 | 14,317 | 40,956 | 91 | 12:30:57 | 12:32:28 |
| refute | 2 | 3,594 | 607,592 | 122 | 12:32:30 | 12:34:32 |
| capture | 1 | 147 | 30,544 | 6 | 12:34:34 | 12:34:40 |
| synthesize | 1 | 35,712 | 1,861,630 | 233 | 12:34:42 | 12:38:35 |

- **claude-sonnet-5-5**: 6 agent · 43 calls · out 53,939 · in 86 · cache_read 2,576,110 · cache_create 356,429
- **claude-opus-5-5**: 3 agent · 117 calls · out 13,189 · in 234 · cache_read 14,262,221 · cache_create 522,431
- **claude-haiku-5-5**: 14 agent · 36 calls · out 21,709 · in 72 · cache_read 684,087 · cache_create 576,519

