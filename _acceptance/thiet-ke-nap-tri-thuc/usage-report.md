### S4 round 1 — wf_1a9d2b18-570 (21 agent, 79,505 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 18 | 14,285 | 36 | 1,316,886 | 196 |
| review:conventions | claude-opus-5-5 | 20 | 13,138 | 40 | 1,543,478 | 165 |
| review:measurement | claude-opus-5-5 | 9 | 12,250 | 18 | 613,395 | 141 |
| synthesize:report | claude-sonnet-5-5 | 2 | 10,637 | 4 | 53,139 | 60 |
| triage | claude-sonnet-5-5 | 2 | 4,002 | 4 | 40,610 | 30 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 3,651 | 4 | 38,724 | 22 |
| machine:bash -c 'set -e; node tests/scripts/luat | claude-haiku-5-5 | 2 | 3,386 | 4 | 38,152 | 64 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,101 | 4 | 3,057 | 475 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,610 | 4 | 3,057 | 593 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,250 | 4 | 3,057 | 517 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,955 | 4 | 38,051 | 88 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,884 | 4 | 38,051 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,088 | 4 | 38,107 | 104 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 896 | 4 | 38,077 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 893 | 4 | 35,003 | 151 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 859 | 4 | 38,107 | 72 |
| machine:node tests/scripts/can-cu-s1.ca.mjs | claude-haiku-5-5 | 2 | 668 | 4 | 38,063 | 27 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 583 | 4 | 3,057 | 497 |
| machine:node tests/scripts/thiet-ke-nap-tri-thuc | claude-haiku-5-5 | 2 | 528 | 4 | 38,073 | 27 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 487 | 4 | 38,052 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 354 | 4 | 33,782 | 7 |


wall: 2641s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,651 | 38,724 | 22 | 20:13:59 | 20:14:21 |
| machine | 14 | 21,188 | 389,964 | 2540 | 20:13:59 | 20:56:19 |
| review | 3 | 39,673 | 3,473,759 | 199 | 20:13:59 | 20:17:19 |
| triage | 1 | 4,002 | 40,610 | 30 | 20:56:21 | 20:56:50 |
| capture | 1 | 354 | 33,782 | 7 | 20:56:52 | 20:56:59 |
| synthesize | 1 | 10,637 | 53,139 | 60 | 20:57:01 | 20:58:00 |

- **claude-opus-5-5**: 3 agent · 47 calls · out 39,673 · in 94 · cache_read 3,473,759 · cache_create 318,653
- **claude-sonnet-5-5**: 4 agent · 8 calls · out 18,644 · in 16 · cache_read 166,255 · cache_create 194,826
- **claude-haiku-5-5**: 14 agent · 28 calls · out 21,188 · in 56 · cache_read 389,964 · cache_create 649,506

