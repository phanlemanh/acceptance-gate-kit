### S4 round 1 — wf_89ca5398-d35 (26 agent, 86,722 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 23,481 | 12 | 595,584 | 181 |
| triage | claude-sonnet-5-5 | 2 | 14,530 | 4 | 89,707 | 91 |
| review:measurement | claude-opus-5-5 | 19 | 8,045 | 38 | 2,935,866 | 368 |
| review:conventions | claude-opus-5-5 | 46 | 6,046 | 92 | 7,882,362 | 355 |
| review:bugs | claude-opus-5-5 | 33 | 4,434 | 66 | 5,666,819 | 491 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 6 | 4,192 | 12 | 569,604 | 97 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,627 | 4 | 116,255 | 214 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 2,398 | 4 | 116,352 | 52 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 2,377 | 8 | 210,191 | 654 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,298 | 4 | 34,982 | 422 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 2,266 | 4 | 81,268 | 196 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 3 | 1,805 | 6 | 225,556 | 120 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 5 | 1,772 | 10 | 471,491 | 94 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,644 | 4 | 116,241 | 12 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,508 | 4 | 116,241 | 87 |
| refute:lop-mod.test.mjs | claude-sonnet-5-5 | 12 | 1,418 | 24 | 1,243,173 | 72 |
| refute:phan-loai-s4.mjs | claude-sonnet-5-5 | 9 | 1,299 | 18 | 761,517 | 38 |
| refute:lop-mod.test.mjs | claude-sonnet-5-5 | 14 | 1,123 | 28 | 1,381,007 | 99 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 833 | 4 | 116,297 | 133 |
| refute:README.md | claude-sonnet-5-5 | 3 | 696 | 6 | 200,264 | 15 |
| refute:README.md | claude-sonnet-5-5 | 3 | 606 | 6 | 165,678 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 455 | 4 | 116,242 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 447 | 4 | 116,297 | 299 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 170 | 4 | 116,297 | 75 |
| capture:provenance | claude-sonnet-5-5 | 2 | 138 | 4 | 80,047 | 6 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 114 | 4 | 83,234 | 63 |


wall: 2504s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 114 | 83,234 | 63 | 04:45:04 | 04:46:07 |
| machine | 11 | 17,023 | 1,256,663 | 2117 | 04:45:04 | 05:20:20 |
| judge | 3 | 7,769 | 1,266,651 | 120 | 04:45:04 | 04:47:03 |
| review | 3 | 18,525 | 16,485,047 | 492 | 04:45:04 | 04:53:16 |
| triage | 1 | 14,530 | 89,707 | 91 | 05:20:22 | 05:21:53 |
| refute | 5 | 5,142 | 3,751,639 | 101 | 05:21:55 | 05:23:37 |
| capture | 1 | 138 | 80,047 | 6 | 05:23:39 | 05:23:45 |
| synthesize | 1 | 23,481 | 595,584 | 181 | 05:23:47 | 05:26:48 |

- **claude-sonnet-5-5**: 12 agent · 67 calls · out 51,174 · in 134 · cache_read 5,866,862 · cache_create 1,148,105
- **claude-opus-5-5**: 3 agent · 98 calls · out 18,525 · in 196 · cache_read 16,485,047 · cache_create 592,063
- **claude-haiku-5-5**: 11 agent · 24 calls · out 17,023 · in 48 · cache_read 1,256,663 · cache_create 776,534

