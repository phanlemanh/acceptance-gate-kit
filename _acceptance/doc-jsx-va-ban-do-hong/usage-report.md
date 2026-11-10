### S4 round 1 — wf_8fc00cac-636 (25 agent, 111,598 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 8 | 26,020 | 16 | 450,117 | 277 |
| review:measurement | claude-opus-5-5 | 8 | 22,041 | 16 | 340,908 | 210 |
| review:conventions | claude-opus-5-5 | 8 | 20,167 | 16 | 505,256 | 246 |
| synthesize:report | claude-sonnet-5-5 | 2 | 9,560 | 4 | 31,100 | 50 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 5,636 | 18 | 114,163 | 1139 |
| triage | claude-sonnet-5-5 | 2 | 4,197 | 4 | 17,486 | 29 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 3,061 | 6 | 33,700 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,903 | 4 | 3,305 | 527 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,843 | 4 | 14,140 | 94 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,765 | 4 | 14,140 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,750 | 4 | 3,305 | 429 |
| refute:doc-jsx-va-ban-do-hong.test.mjs | claude-sonnet-5-5 | 4 | 1,410 | 8 | 41,388 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,222 | 4 | 10,844 | 188 |
| refute:doc-jsx-va-ban-do-hong.test.mjs | claude-sonnet-5-5 | 2 | 1,088 | 4 | 12,983 | 9 |
| refute:doc-jsx-va-ban-do-hong.test.mjs | claude-sonnet-5-5 | 3 | 1,071 | 6 | 27,071 | 10 |
| refute:doc-jsx-va-ban-do-hong.test.mjs | claude-sonnet-5-5 | 4 | 1,023 | 8 | 43,611 | 12 |
| machine:node tests/scripts/doc-jsx-va-ban-do-hon | claude-haiku-5-5 | 2 | 1,010 | 4 | 14,162 | 29 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 974 | 6 | 17,368 | 679 |
| refute:doc-jsx-va-ban-do-hong.test.mjs | claude-sonnet-5-5 | 3 | 950 | 6 | 25,079 | 9 |
| refute:doc-jsx-va-ban-do-hong.test.mjs | claude-sonnet-5-5 | 3 | 774 | 6 | 31,523 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 763 | 4 | 14,196 | 82 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 667 | 4 | 14,141 | 8 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 659 | 4 | 14,166 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 616 | 4 | 14,196 | 113 |
| capture:provenance | claude-sonnet-5-5 | 2 | 428 | 4 | 9,625 | 4 |


wall: 3405s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,061 | 33,700 | 30 | 07:11:47 | 07:12:18 |
| machine | 12 | 19,808 | 248,126 | 3298 | 07:11:47 | 08:06:45 |
| review | 3 | 68,228 | 1,296,281 | 278 | 07:11:47 | 07:16:25 |
| triage | 1 | 4,197 | 17,486 | 29 | 08:06:47 | 08:07:16 |
| refute | 6 | 6,316 | 181,655 | 15 | 08:07:18 | 08:07:33 |
| capture | 1 | 428 | 9,625 | 4 | 08:07:36 | 08:07:40 |
| synthesize | 1 | 9,560 | 31,100 | 51 | 08:07:42 | 08:08:33 |

- **claude-opus-5-5**: 3 agent · 24 calls · out 68,228 · in 48 · cache_read 1,296,281 · cache_create 296,638
- **claude-sonnet-5-5**: 10 agent · 28 calls · out 23,562 · in 56 · cache_read 273,566 · cache_create 187,088
- **claude-haiku-5-5**: 12 agent · 32 calls · out 19,808 · in 64 · cache_read 248,126 · cache_create 186,624

### S4 round 2 — wf_07f6786f-c9d (20 agent, 98,209 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 7 | 22,377 | 14 | 334,512 | 251 |
| review:conventions | claude-opus-5-5 | 7 | 19,373 | 14 | 361,825 | 236 |
| review:bugs | claude-opus-5-5 | 7 | 16,540 | 14 | 284,278 | 207 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 14 | 7,549 | 28 | 227,089 | 1342 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,108 | 4 | 26,385 | 48 |
| refute:doc-jsx-va-ban-do-hong.test.mjs | claude-sonnet-5-5 | 6 | 3,392 | 12 | 86,873 | 65 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 3,145 | 8 | 18,256 | 469 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 3,063 | 6 | 33,704 | 50 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,872 | 4 | 6,610 | 582 |
| triage | claude-sonnet-5-5 | 2 | 2,353 | 4 | 14,708 | 21 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,947 | 4 | 14,140 | 102 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,632 | 4 | 14,140 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 1,511 | 8 | 31,903 | 724 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,295 | 4 | 14,149 | 220 |
| machine:node tests/scripts/doc-jsx-va-ban-do-hon | claude-haiku-5-5 | 2 | 1,175 | 4 | 14,162 | 50 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 702 | 4 | 14,196 | 242 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 614 | 4 | 14,141 | 6 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 605 | 4 | 14,166 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 499 | 4 | 14,196 | 91 |
| capture:provenance | claude-sonnet-5-5 | 2 | 457 | 4 | 9,625 | 14 |


wall: 3963s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,063 | 33,704 | 50 | 08:32:54 | 08:33:44 |
| machine | 12 | 23,546 | 397,148 | 3814 | 08:32:54 | 09:36:28 |
| review | 3 | 58,290 | 980,615 | 252 | 08:32:54 | 08:37:06 |
| triage | 1 | 2,353 | 14,708 | 21 | 09:36:28 | 09:36:49 |
| refute | 1 | 3,392 | 86,873 | 66 | 09:36:49 | 09:37:55 |
| capture | 1 | 457 | 9,625 | 14 | 09:37:55 | 09:38:09 |
| synthesize | 1 | 7,108 | 26,385 | 49 | 09:38:09 | 09:38:57 |

- **claude-opus-5-5**: 3 agent · 21 calls · out 58,290 · in 42 · cache_read 980,615 · cache_create 274,839
- **claude-haiku-5-5**: 12 agent · 39 calls · out 23,546 · in 80 · cache_read 397,148 · cache_create 182,788
- **claude-sonnet-5-5**: 5 agent · 15 calls · out 16,373 · in 30 · cache_read 171,295 · cache_create 111,841

