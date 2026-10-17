### cua-tin-hieu-goc-moi-worktree — S4 lượt 1 — wf_dfd13d88-830 (23 agent, 39,118 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 10,173 | 8 | 173,933 | 62 |
| triage | claude-sonnet-5-5 | 2 | 3,633 | 4 | 38,902 | 28 |
| review:bugs | claude-opus-5-5 | 18 | 3,038 | 36 | 1,169,567 | 184 |
| review:measurement | claude-opus-5-5 | 12 | 2,840 | 24 | 680,122 | 161 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,764 | 4 | 2,869 | 467 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 2,753 | 14 | 194,307 | 723 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,277 | 4 | 35,857 | 244 |
| review:conventions | claude-opus-5-5 | 13 | 1,901 | 26 | 672,004 | 104 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,512 | 4 | 35,843 | 82 |
| refute:cua-tin-hieu-goc-moi-worktree.test.mjs | claude-sonnet-5-5 | 3 | 1,253 | 6 | 74,787 | 23 |
| refute:cua-tin-hieu-goc-moi-worktree.test.mjs | claude-sonnet-5-5 | 3 | 1,210 | 6 | 72,949 | 22 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 11 | 1,187 | 22 | 283,243 | 2679 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,063 | 4 | 32,983 | 152 |
| refute:cua-tin-hieu-goc-moi-worktree.test.mjs | claude-sonnet-5-5 | 3 | 779 | 6 | 71,686 | 17 |
| machine:node tests/scripts/cua-tin-hieu-goc-moi- | claude-haiku-5-5 | 2 | 539 | 4 | 35,868 | 15 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 485 | 4 | 35,899 | 90 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 470 | 4 | 35,869 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 403 | 4 | 35,844 | 6 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 187 | 4 | 35,843 | 8 |
| refute:cua-tin-hieu-goc-moi-worktree.test.mjs | claude-sonnet-5-5 | 3 | 173 | 6 | 73,685 | 18 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 169 | 4 | 35,899 | 75 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 157 | 4 | 35,009 | 15 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 31,758 | 6 |


wall: 4703s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 157 | 35,009 | 15 | 10:58:23 | 10:58:38 |
| machine | 12 | 13,809 | 800,324 | 4557 | 10:58:23 | 12:14:19 |
| review | 3 | 7,779 | 2,521,693 | 186 | 10:58:23 | 11:01:29 |
| triage | 1 | 3,633 | 38,902 | 28 | 12:14:22 | 12:14:49 |
| refute | 4 | 3,415 | 293,107 | 28 | 12:14:52 | 12:15:20 |
| capture | 1 | 152 | 31,758 | 6 | 12:15:23 | 12:15:29 |
| synthesize | 1 | 10,173 | 173,933 | 62 | 12:15:44 | 12:16:46 |

- **claude-sonnet-5-5**: 8 agent · 22 calls · out 17,530 · in 44 · cache_read 572,709 · cache_create 354,863
- **claude-opus-5-5**: 3 agent · 43 calls · out 7,779 · in 86 · cache_read 2,521,693 · cache_create 250,819
- **claude-haiku-5-5**: 12 agent · 38 calls · out 13,809 · in 76 · cache_read 800,324 · cache_create 609,441

### cua-tin-hieu-goc-moi-worktree — S4 lượt 2 — wf_70183e6f-710 (20 agent, 28,574 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 8,211 | 6 | 109,792 | 54 |
| triage | claude-sonnet-5-5 | 2 | 3,519 | 4 | 38,740 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,687 | 4 | 2,869 | 450 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,628 | 4 | 2,869 | 443 |
| review:bugs | claude-opus-5-5 | 19 | 2,403 | 38 | 1,066,246 | 164 |
| review:conventions | claude-opus-5-5 | 10 | 1,992 | 20 | 470,881 | 94 |
| review:measurement | claude-opus-5-5 | 5 | 1,784 | 10 | 208,490 | 82 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,681 | 4 | 37,088 | 85 |
| refute:cua-tin-hieu-goc-moi-worktree.test.mjs | claude-sonnet-5-5 | 5 | 1,034 | 10 | 167,758 | 26 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 533 | 4 | 34,228 | 158 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 401 | 4 | 37,114 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 363 | 4 | 37,089 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 263 | 4 | 37,144 | 84 |
| machine:node tests/scripts/cua-tin-hieu-goc-moi- | claude-haiku-5-5 | 2 | 219 | 4 | 37,113 | 16 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 187 | 4 | 37,088 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 2,869 | 436 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 37,144 | 73 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 157 | 4 | 36,256 | 18 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 33,003 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 12 | 4 | 2,869 | 551 |


wall: 2457s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 157 | 36,256 | 18 | 15:25:17 | 15:25:35 |
| machine | 12 | 9,324 | 305,484 | 2325 | 15:25:17 | 16:04:02 |
| review | 3 | 6,179 | 1,745,617 | 166 | 15:25:17 | 15:28:03 |
| triage | 1 | 3,519 | 38,740 | 28 | 16:04:04 | 16:04:32 |
| refute | 1 | 1,034 | 167,758 | 26 | 16:04:35 | 16:05:01 |
| capture | 1 | 150 | 33,003 | 13 | 16:05:04 | 16:05:17 |
| synthesize | 1 | 8,211 | 109,792 | 54 | 16:05:20 | 16:06:14 |

- **claude-sonnet-5-5**: 5 agent · 14 calls · out 13,071 · in 28 · cache_read 385,549 · cache_create 244,279
- **claude-haiku-5-5**: 12 agent · 24 calls · out 9,324 · in 48 · cache_read 305,484 · cache_create 573,068
- **claude-opus-5-5**: 3 agent · 34 calls · out 6,179 · in 68 · cache_read 1,745,617 · cache_create 217,947

