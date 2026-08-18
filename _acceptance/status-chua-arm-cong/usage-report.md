### S4 round 1 — wf_b5e00931-87b (21 agent, 129,239 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:pre-merge-check.sh | claude-sonnet-5 | 16 | 16,152 | 32 | 1,172,257 | 245 |
| synthesize:report | claude-sonnet-5 | 2 | 15,545 | 4 | 62,582 | 154 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 21 | 11,965 | 42 | 1,475,428 | 207 |
| refute:run-tests.sh | claude-sonnet-5 | 9 | 11,829 | 18 | 590,739 | 169 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 21 | 11,683 | 42 | 1,590,203 | 228 |
| review:conventions | claude-fable-5 | 16 | 11,141 | 31 | 1,210,324 | 185 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 13 | 9,807 | 26 | 843,920 | 278 |
| review:bugs | claude-fable-5 | 17 | 8,937 | 35 | 1,250,419 | 214 |
| review:measurement | claude-fable-5 | 11 | 8,802 | 21 | 720,804 | 241 |
| triage | claude-sonnet-5 | 2 | 6,114 | 4 | 55,495 | 77 |
| refute:rang.sh | claude-sonnet-5 | 7 | 3,467 | 14 | 375,040 | 70 |
| refute:evals.yaml | claude-sonnet-5 | 5 | 3,220 | 10 | 262,753 | 46 |
| baseline:diffBase | claude-sonnet-5 | 10 | 2,548 | 20 | 533,149 | 261 |
| refute:evals.yaml | claude-sonnet-5 | 5 | 1,645 | 10 | 258,068 | 36 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,357 | 58 | 265,562 | 33 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,330 | 34 | 139,982 | 136 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,274 | 42 | 227,212 | 190 |
| capture:provenance | claude-sonnet-5 | 3 | 854 | 6 | 114,917 | 18 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 675 | 18 | 57,842 | 11 |
| machine:bash _acceptance/status-chua-arm-cong/ra | claude-haiku-4-5-20251001 | 2 | 658 | 18 | 37,858 | 11 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 236 | 18 | 57,835 | 16 |

- **claude-sonnet-5**: 12 agent · 114 calls · out 94,829 · in 228 · cache_read 7,334,551 · cache_create 744,581
- **claude-fable-5**: 3 agent · 44 calls · out 28,880 · in 87 · cache_read 3,181,547 · cache_create 234,551
- **claude-haiku-4-5-20251001**: 6 agent · 22 calls · out 5,530 · in 188 · cache_read 786,291 · cache_create 193,040

