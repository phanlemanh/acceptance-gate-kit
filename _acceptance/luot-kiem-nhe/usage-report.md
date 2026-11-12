### S4 round 1 — wf_e1a570cc-ceb (20 agent, 121,076 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| machine:node tests/scripts/luot-kiem-nhe-ca-cham | claude-haiku-5-5 | 24 | 25,430 | 48 | 1,134,405 | 2237 |
| review:bugs | claude-opus-5-5 | 33 | 24,806 | 66 | 3,253,816 | 277 |
| review:measurement | claude-opus-5-5 | 17 | 20,107 | 34 | 1,437,837 | 302 |
| review:conventions | claude-opus-5-5 | 24 | 16,581 | 48 | 1,842,999 | 184 |
| synthesize:report | claude-sonnet-5-5 | 2 | 6,619 | 4 | 52,416 | 40 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,222 | 16 | 227,338 | 800 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,222 | 12 | 152,766 | 717 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 3,668 | 14 | 189,963 | 722 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 3,569 | 6 | 77,388 | 35 |
| triage | claude-sonnet-5-5 | 2 | 3,436 | 4 | 41,018 | 26 |
| machine:node tests/scripts/luot-kiem-nhe.test.mj | claude-haiku-5-5 | 2 | 1,733 | 4 | 35,402 | 137 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 808 | 4 | 31,980 | 194 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 786 | 4 | 35,443 | 119 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 710 | 4 | 35,388 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 677 | 4 | 35,443 | 76 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 626 | 4 | 35,443 | 87 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 618 | 4 | 35,413 | 5 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 568 | 4 | 35,387 | 7 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 536 | 4 | 35,387 | 89 |
| capture:provenance | claude-sonnet-5-5 | 2 | 354 | 4 | 30,761 | 5 |


wall: 2900s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,569 | 77,388 | 35 | 09:09:23 | 09:09:58 |
| machine | 13 | 45,604 | 2,019,758 | 2827 | 09:09:23 | 09:56:30 |
| review | 3 | 61,494 | 6,534,652 | 303 | 09:09:23 | 09:14:26 |
| triage | 1 | 3,436 | 41,018 | 26 | 09:56:31 | 09:56:57 |
| capture | 1 | 354 | 30,761 | 6 | 09:56:57 | 09:57:02 |
| synthesize | 1 | 6,619 | 52,416 | 40 | 09:57:03 | 09:57:43 |

- **claude-haiku-5-5**: 13 agent · 63 calls · out 45,604 · in 126 · cache_read 2,019,758 · cache_create 550,409
- **claude-opus-5-5**: 3 agent · 74 calls · out 61,494 · in 148 · cache_read 6,534,652 · cache_create 367,498
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 13,978 · in 18 · cache_read 201,583 · cache_create 172,949

