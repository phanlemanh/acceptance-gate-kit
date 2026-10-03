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

### S4 round 2 — wf_1bc08c28-d86 (20 agent, 28,166 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 7,628 | 8 | 439,251 | 64 |
| review:bugs | claude-opus-5-5 | 7 | 2,716 | 14 | 884,130 | 65 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,179 | 18 | 122,743 | 300 |
| triage | claude-sonnet-5-5 | 2 | 1,946 | 4 | 121,482 | 23 |
| review:conventions | claude-opus-5-5 | 7 | 1,850 | 14 | 798,846 | 52 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,541 | 18 | 122,743 | 239 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,476 | 18 | 122,743 | 139 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,366 | 18 | 122,730 | 33 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,339 | 18 | 122,730 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 1,063 | 18 | 122,738 | 155 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 1,023 | 6 | 246,527 | 26 |
| review:measurement | claude-opus-5-5 | 6 | 861 | 12 | 751,933 | 46 |
| machine:bash -c 'LMTL_CASES=LT-AC1-lap,LT-AC1-tu | claude-haiku-4-5-20251001 | 2 | 667 | 18 | 122,886 | 22 |
| machine:bash -c 'LMTL_CASES=LT-AC3-khong-ky,LT-A | claude-haiku-4-5-20251001 | 2 | 665 | 18 | 122,845 | 23 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 3 | 420 | 26 | 221,569 | 212 |
| machine:bash -c 'LMTL_CASES=LT-AC5-phut,LT-AC5-c | claude-haiku-4-5-20251001 | 2 | 407 | 18 | 122,813 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 300 | 18 | 122,737 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 299 | 18 | 122,779 | 115 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 274 | 18 | 122,779 | 312 |
| capture:provenance | claude-sonnet-5-5 | 2 | 146 | 4 | 118,600 | 9 |


wall: 1659s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,023 | 246,527 | 26 | 23:57:12 | 23:57:39 |
| machine | 13 | 11,996 | 1,694,835 | 1558 | 23:57:12 | 00:23:11 |
| review | 3 | 5,427 | 2,434,909 | 66 | 23:57:12 | 23:58:19 |
| triage | 1 | 1,946 | 121,482 | 23 | 00:23:12 | 00:23:35 |
| capture | 1 | 146 | 118,600 | 9 | 00:23:37 | 00:23:46 |
| synthesize | 1 | 7,628 | 439,251 | 64 | 00:23:48 | 00:24:51 |

- **claude-sonnet-5-5**: 4 agent · 11 calls · out 10,743 · in 22 · cache_read 925,860 · cache_create 541,220
- **claude-opus-5-5**: 3 agent · 20 calls · out 5,427 · in 40 · cache_read 2,434,909 · cache_create 398,480
- **claude-haiku-4-5-20251001**: 13 agent · 27 calls · out 11,996 · in 242 · cache_read 1,694,835 · cache_create 916,720

