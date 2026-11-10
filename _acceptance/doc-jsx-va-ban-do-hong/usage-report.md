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

