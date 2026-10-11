### S4 round 1 — wf_64244220-98b (31 agent, 81,990 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| triage | claude-sonnet-5-5 | 2 | 20,932 | 4 | 91,312 | 136 |
| synthesize:report | claude-sonnet-5-5 | 11 | 13,160 | 22 | 1,379,538 | 179 |
| review:conventions | claude-opus-5-5 | 35 | 7,770 | 70 | 6,643,779 | 456 |
| review:measurement | claude-opus-5-5 | 17 | 4,226 | 34 | 2,586,115 | 406 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 5 | 4,009 | 10 | 364,508 | 80 |
| review:bugs | claude-opus-5-5 | 31 | 3,430 | 62 | 5,835,435 | 604 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,755 | 4 | 34,982 | 609 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,461 | 4 | 69,964 | 452 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,255 | 4 | 34,982 | 414 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,039 | 4 | 117,093 | 89 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 8 | 1,789 | 16 | 736,957 | 86 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 1,723 | 4 | 117,117 | 34 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,628 | 4 | 117,093 | 13 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 1,564 | 4 | 117,117 | 32 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,450 | 4 | 117,149 | 128 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,450 | 4 | 117,102 | 193 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 6 | 1,055 | 12 | 513,959 | 76 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 980 | 4 | 117,117 | 20 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 931 | 4 | 117,117 | 22 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 905 | 4 | 117,117 | 17 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 837 | 4 | 117,117 | 13 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 659 | 4 | 117,117 | 19 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 629 | 4 | 117,149 | 77 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 624 | 4 | 117,117 | 13 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 576 | 4 | 89,720 | 42 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 478 | 4 | 117,117 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 472 | 4 | 117,094 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 384 | 4 | 117,149 | 303 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 360 | 4 | 117,117 | 10 |
| machine:node _acceptance/eval-goi-model-that-kho | claude-haiku-5-5 | 2 | 323 | 4 | 117,117 | 13 |
| capture:provenance | claude-sonnet-5-5 | 2 | 136 | 4 | 80,896 | 8 |


wall: 2630s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 576 | 89,720 | 42 | 10:19:15 | 10:19:57 |
| machine | 21 | 24,907 | 2,248,044 | 2300 | 10:19:15 | 10:57:35 |
| judge | 3 | 6,853 | 1,615,424 | 89 | 10:19:15 | 10:20:44 |
| review | 3 | 15,426 | 15,065,329 | 606 | 10:19:29 | 10:29:35 |
| triage | 1 | 20,932 | 91,312 | 136 | 10:57:37 | 10:59:53 |
| capture | 1 | 136 | 80,896 | 8 | 10:59:55 | 11:00:03 |
| synthesize | 1 | 13,160 | 1,379,538 | 179 | 11:00:06 | 11:03:05 |

- **claude-sonnet-5-5**: 7 agent · 36 calls · out 41,657 · in 72 · cache_read 3,256,890 · cache_create 730,683
- **claude-opus-5-5**: 3 agent · 83 calls · out 15,426 · in 166 · cache_read 15,065,329 · cache_create 675,682
- **claude-haiku-5-5**: 21 agent · 42 calls · out 24,907 · in 84 · cache_read 2,248,044 · cache_create 1,327,959

