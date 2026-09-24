### S4 round 1 — wf_e079637a-158 (18 agent, 66,080 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 10 | 14,955 | 20 | 1,200,717 | 195 |
| review:measurement | claude-opus-5-5 | 8 | 9,046 | 16 | 897,737 | 169 |
| synthesize:report | claude-sonnet-5 | 2 | 8,312 | 4 | 111,651 | 76 |
| review:conventions | claude-opus-5-5 | 8 | 7,144 | 16 | 833,266 | 117 |
| triage | claude-sonnet-5 | 2 | 6,896 | 4 | 101,730 | 75 |
| baseline:diffBase | claude-sonnet-5 | 5 | 3,497 | 10 | 413,630 | 74 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 4 | 3,131 | 34 | 262,050 | 140 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 2,077 | 50 | 401,148 | 41 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 6 | 2,061 | 50 | 402,077 | 384 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 7 | 1,833 | 58 | 473,505 | 196 |
| machine:bash -c 'out=$(node tests/scripts/duong- | claude-haiku-4-5-20251001 | 2 | 1,229 | 18 | 97,142 | 56 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 1,202 | 18 | 97,045 | 121 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 871 | 18 | 96,996 | 17 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 850 | 18 | 97,009 | 213 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 798 | 18 | 97,045 | 101 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 788 | 18 | 97,045 | 293 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 716 | 18 | 97,003 | 12 |
| capture:provenance | claude-sonnet-5 | 2 | 674 | 4 | 96,757 | 15 |


wall: 1704s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,497 | 413,630 | 74 | 08:54:44 | 08:55:58 |
| machine | 11 | 15,556 | 2,218,065 | 1533 | 08:54:44 | 09:20:17 |
| review | 3 | 31,145 | 2,931,720 | 198 | 08:54:44 | 08:58:02 |
| triage | 1 | 6,896 | 101,730 | 75 | 09:20:19 | 09:21:34 |
| capture | 1 | 674 | 96,757 | 15 | 09:21:36 | 09:21:50 |
| synthesize | 1 | 8,312 | 111,651 | 76 | 09:21:52 | 09:23:08 |

- **claude-opus-5-5**: 3 agent · 26 calls · out 31,145 · in 52 · cache_read 2,931,720 · cache_create 373,713
- **claude-sonnet-5**: 4 agent · 11 calls · out 19,379 · in 22 · cache_read 723,768 · cache_create 476,115
- **claude-haiku-4-5-20251001**: 11 agent · 37 calls · out 15,556 · in 318 · cache_read 2,218,065 · cache_create 586,539

