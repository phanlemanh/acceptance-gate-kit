### S4 round 1 — wf_6728b6d0-8f7 (21 agent, 35,286 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 7,631 | 8 | 426,800 | 61 |
| review:measurement | claude-opus-5-5 | 9 | 4,135 | 18 | 1,250,558 | 147 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 3,493 | 18 | 122,802 | 52 |
| review:conventions | claude-opus-5-5 | 44 | 2,705 | 88 | 7,725,760 | 304 |
| triage | claude-sonnet-5-5 | 2 | 2,670 | 4 | 122,852 | 26 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 2,522 | 18 | 122,802 | 40 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,039 | 18 | 122,815 | 230 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,615 | 18 | 122,815 | 214 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,327 | 18 | 122,815 | 124 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 1,089 | 18 | 93,827 | 158 |
| machine:bash -c 'LMTL_CASES=LT-AC1-lap,LT-AC1-tu | claude-haiku-4-5-20251001 | 2 | 961 | 18 | 122,940 | 27 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 893 | 8 | 374,210 | 24 |
| review:bugs | claude-opus-5-5 | 29 | 768 | 58 | 4,641,539 | 203 |
| machine:bash -c 'LMTL_CASES=LT-AC3-khong-ky,LT-A | claude-haiku-4-5-20251001 | 2 | 738 | 18 | 122,917 | 27 |
| refute:lmtl-the.test.mjs | claude-sonnet-5-5 | 5 | 723 | 10 | 520,832 | 32 |
| machine:bash -c 'LMTL_CASES=LT-AC5-phut,LT-AC5-c | claude-haiku-4-5-20251001 | 2 | 477 | 18 | 122,885 | 15 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 455 | 18 | 122,809 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 423 | 18 | 122,851 | 107 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 243 | 18 | 122,851 | 87 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 230 | 18 | 122,851 | 267 |
| capture:provenance | claude-sonnet-5-5 | 2 | 149 | 4 | 118,693 | 9 |


wall: 1437s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 893 | 374,210 | 24 | 23:31:43 | 23:32:08 |
| machine | 13 | 15,612 | 1,567,980 | 1304 | 23:31:43 | 23:53:27 |
| review | 3 | 7,608 | 13,617,857 | 304 | 23:31:44 | 23:36:47 |
| triage | 1 | 2,670 | 122,852 | 26 | 23:53:28 | 23:53:55 |
| refute | 1 | 723 | 520,832 | 32 | 23:53:56 | 23:54:28 |
| capture | 1 | 149 | 118,693 | 9 | 23:54:29 | 23:54:38 |
| synthesize | 1 | 7,631 | 426,800 | 61 | 23:54:39 | 23:55:40 |

- **claude-sonnet-5-5**: 5 agent · 17 calls · out 12,066 · in 34 · cache_read 1,563,387 · cache_create 673,691
- **claude-opus-5-5**: 3 agent · 82 calls · out 7,608 · in 164 · cache_read 13,617,857 · cache_create 523,252
- **claude-haiku-4-5-20251001**: 13 agent · 26 calls · out 15,612 · in 234 · cache_read 1,567,980 · cache_create 947,456

