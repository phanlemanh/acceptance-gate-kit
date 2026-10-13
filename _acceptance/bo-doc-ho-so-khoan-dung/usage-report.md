### S4 round 1 — wf_87160fb1-509 (26 agent, 36,159 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 8,699 | 10 | 522,078 | 77 |
| triage | claude-sonnet-5-5 | 2 | 4,613 | 4 | 103,995 | 38 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,656 | 4 | 34,982 | 525 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,539 | 4 | 135,856 | 246 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,248 | 4 | 34,982 | 454 |
| review:conventions | claude-opus-5-5 | 10 | 2,238 | 20 | 1,212,817 | 113 |
| review:bugs | claude-opus-5-5 | 18 | 2,081 | 36 | 2,477,183 | 239 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,661 | 4 | 135,842 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,483 | 4 | 135,842 | 85 |
| review:measurement | claude-opus-5-5 | 14 | 1,267 | 28 | 2,050,251 | 208 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 989 | 4 | 100,869 | 157 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 5 | 940 | 10 | 477,825 | 35 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 4 | 892 | 8 | 324,080 | 20 |
| machine:node _acceptance/bo-doc-ho-so-khoan-dung | claude-haiku-5-5 | 2 | 853 | 4 | 135,871 | 21 |
| machine:node tests/scripts/yaml-chuan.test.mjs | claude-haiku-5-5 | 2 | 576 | 4 | 135,852 | 9 |
| machine:node tests/scripts/ngay-ky.test.mjs | claude-haiku-5-5 | 2 | 495 | 4 | 135,850 | 8 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 469 | 4 | 135,850 | 155 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 432 | 4 | 135,898 | 89 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 284 | 4 | 105,057 | 175 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 166 | 4 | 135,843 | 6 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 153 | 4 | 135,868 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 145 | 4 | 99,648 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 135,898 | 77 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 34,982 | 398 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 3 | 22 | 6 | 243,636 | 17 |
| machine:node _acceptance/bo-doc-ho-so-khoan-dung | claude-haiku-5-5 | 2 | 12 | 4 | 135,871 | 11 |


wall: 2220s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 284 | 105,057 | 175 | 13:59:06 | 14:02:01 |
| machine | 16 | 14,978 | 1,836,156 | 2087 | 13:59:06 | 14:33:53 |
| judge | 3 | 1,854 | 1,045,541 | 39 | 13:59:06 | 13:59:45 |
| review | 3 | 5,586 | 5,740,251 | 241 | 13:59:06 | 14:03:07 |
| triage | 1 | 4,613 | 103,995 | 38 | 14:33:58 | 14:34:36 |
| capture | 1 | 145 | 99,648 | 9 | 14:34:39 | 14:34:47 |
| synthesize | 1 | 8,699 | 522,078 | 77 | 14:34:49 | 14:36:06 |

- **claude-sonnet-5-5**: 7 agent · 23 calls · out 15,595 · in 46 · cache_read 1,876,319 · cache_create 761,625
- **claude-haiku-5-5**: 16 agent · 32 calls · out 14,978 · in 64 · cache_read 1,836,156 · cache_create 1,510,513
- **claude-opus-5-5**: 3 agent · 42 calls · out 5,586 · in 84 · cache_read 5,740,251 · cache_create 455,242

