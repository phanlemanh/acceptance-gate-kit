### S4 round 1 — wf_4e41326d-10f (18 agent, 17,767 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 3,078 | 6 | 212,473 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 1,698 | 18 | 71,687 | 141 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,635 | 18 | 97,009 | 164 |
| machine:node tests/scripts/ho-so-nghi.test.mjs | claude-haiku-4-5-20251001 | 2 | 1,542 | 18 | 97,008 | 39 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,437 | 18 | 96,996 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 4 | 1,361 | 34 | 251,955 | 120 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,327 | 18 | 97,009 | 211 |
| machine:bash -c 'RT_CASES=RT13 node tests/plugin | claude-haiku-4-5-20251001 | 2 | 1,178 | 18 | 97,022 | 19 |
| review:measurement | claude-opus-5-5 | 9 | 1,134 | 18 | 927,623 | 68 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,021 | 18 | 96,996 | 26 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 450 | 18 | 97,045 | 93 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 393 | 18 | 97,045 | 247 |
| baseline:diffBase | claude-sonnet-5-5 | 5 | 391 | 10 | 393,129 | 36 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 365 | 18 | 97,003 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 248 | 18 | 97,045 | 83 |
| review:bugs | claude-opus-5-5 | 7 | 221 | 14 | 679,796 | 49 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 91,688 | 6 |
| review:conventions | claude-opus-5-5 | 10 | 136 | 20 | 1,005,692 | 64 |


wall: 1176s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 391 | 393,129 | 36 | 03:13:05 | 03:13:41 |
| machine | 12 | 12,655 | 1,293,820 | 1138 | 03:13:05 | 03:32:02 |
| review | 3 | 1,491 | 2,613,111 | 70 | 03:13:05 | 03:14:15 |
| capture | 1 | 152 | 91,688 | 6 | 03:32:04 | 03:32:10 |
| synthesize | 1 | 3,078 | 212,473 | 30 | 03:32:11 | 03:32:41 |

- **claude-sonnet-5-5**: 3 agent · 10 calls · out 3,621 · in 20 · cache_read 697,290 · cache_create 313,317
- **claude-haiku-4-5-20251001**: 12 agent · 26 calls · out 12,655 · in 232 · cache_read 1,293,820 · cache_create 664,092
- **claude-opus-5-5**: 3 agent · 26 calls · out 1,491 · in 52 · cache_read 2,613,111 · cache_create 311,008

