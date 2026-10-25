### S4 round 1 — wf_2a19691e-209 (20 agent, 81,761 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 16 | 13,520 | 32 | 1,052,011 | 189 |
| review:measurement | claude-opus-5-5 | 13 | 12,564 | 26 | 923,819 | 193 |
| review:conventions | claude-opus-5-5 | 21 | 12,459 | 42 | 1,639,099 | 149 |
| synthesize:report | claude-sonnet-5-5 | 3 | 10,435 | 6 | 100,349 | 62 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,714 | 12 | 126,571 | 901 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,551 | 4 | 3,057 | 527 |
| machine:node tests/scripts/vong-don-le-tra-tri-t | claude-haiku-5-5 | 2 | 3,535 | 4 | 29,378 | 32 |
| triage | claude-sonnet-5-5 | 2 | 3,376 | 4 | 30,528 | 25 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 3,093 | 4 | 29,574 | 18 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,549 | 4 | 3,057 | 406 |
| machine:bash -c 'set -e; node tests/scripts/kho- | claude-haiku-5-5 | 2 | 2,435 | 4 | 29,494 | 97 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,843 | 4 | 29,358 | 94 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 1,779 | 6 | 33,074 | 761 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 1,128 | 4 | 29,384 | 10 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,036 | 4 | 26,310 | 168 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 972 | 4 | 3,057 | 501 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 807 | 4 | 29,414 | 115 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 733 | 4 | 29,358 | 15 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 708 | 4 | 29,359 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 524 | 4 | 25,091 | 8 |


wall: 3634s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,093 | 29,574 | 18 | 01:39:44 | 01:40:03 |
| machine | 13 | 25,790 | 400,871 | 3532 | 01:39:45 | 02:38:37 |
| review | 3 | 38,543 | 3,614,929 | 194 | 01:39:45 | 01:42:59 |
| triage | 1 | 3,376 | 30,528 | 25 | 02:38:39 | 02:39:04 |
| capture | 1 | 524 | 25,091 | 8 | 02:39:06 | 02:39:14 |
| synthesize | 1 | 10,435 | 100,349 | 62 | 02:39:16 | 02:40:19 |

- **claude-opus-5-5**: 3 agent · 50 calls · out 38,543 · in 100 · cache_read 3,614,929 · cache_create 299,743
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 17,428 · in 18 · cache_read 185,542 · cache_create 160,605
- **claude-haiku-5-5**: 13 agent · 31 calls · out 25,790 · in 62 · cache_read 400,871 · cache_create 497,514

