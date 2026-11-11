### S4 round 1 — wf_861ee6e9-34f (26 agent, 65,086 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 14 | 9,386 | 28 | 749,681 | 95 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 12 | 6,834 | 24 | 372,281 | 1294 |
| review:conventions | claude-opus-5-5 | 12 | 6,762 | 24 | 610,131 | 70 |
| review:measurement | claude-opus-5-5 | 7 | 6,705 | 14 | 303,443 | 68 |
| synthesize:report | claude-sonnet-5-5 | 2 | 6,649 | 4 | 45,080 | 41 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 3,663 | 6 | 77,200 | 78 |
| triage | claude-sonnet-5-5 | 2 | 3,162 | 4 | 35,302 | 25 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,657 | 4 | 3,416 | 538 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,933 | 4 | 3,416 | 513 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 5 | 1,929 | 10 | 110,366 | 722 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,744 | 4 | 35,135 | 100 |
| refute:tier-b-loi-doc.test.mjs | claude-sonnet-5-5 | 4 | 1,486 | 8 | 104,992 | 20 |
| judge:E4:domain-correctness | claude-sonnet-5-5 | 2 | 1,438 | 4 | 31,347 | 14 |
| judge:E4:spec-alignment | claude-sonnet-5-5 | 2 | 1,314 | 4 | 34,963 | 13 |
| judge:E4:operational-feasibility | claude-sonnet-5-5 | 2 | 1,269 | 4 | 34,965 | 18 |
| refute:tier-b-loi-doc.test.mjs | claude-sonnet-5-5 | 4 | 1,190 | 8 | 100,952 | 15 |
| refute:tier-b-loi-doc.test.mjs | claude-sonnet-5-5 | 3 | 1,102 | 6 | 64,755 | 16 |
| machine:node tests/design-eval/tier-b-loi-doc.te | claude-haiku-5-5 | 2 | 1,046 | 4 | 35,149 | 5 |
| machine:DESIGN_EVAL_CAN_DOM=1 bash tests/design- | claude-haiku-5-5 | 2 | 935 | 4 | 35,169 | 59 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 697 | 4 | 35,191 | 159 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 658 | 4 | 35,191 | 86 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 620 | 4 | 35,161 | 4 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 579 | 4 | 31,728 | 165 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 493 | 4 | 35,136 | 4 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 466 | 4 | 35,135 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 369 | 4 | 30,513 | 9 |


wall: 3688s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 22,853 | 1,663,255 | 97 | 07:12:27 | 07:14:04 |
| machine | 13 | 20,591 | 802,474 | 3592 | 07:12:27 | 08:12:19 |
| baseline | 1 | 3,663 | 77,200 | 78 | 07:12:27 | 07:13:45 |
| judge | 3 | 4,021 | 101,275 | 21 | 07:12:27 | 07:12:49 |
| triage | 1 | 3,162 | 35,302 | 25 | 08:12:19 | 08:12:44 |
| refute | 3 | 3,778 | 270,699 | 22 | 08:12:44 | 08:13:06 |
| capture | 1 | 369 | 30,513 | 9 | 08:13:06 | 08:13:15 |
| synthesize | 1 | 6,649 | 45,080 | 41 | 08:13:15 | 08:13:56 |

- **claude-opus-5-5**: 3 agent · 33 calls · out 22,853 · in 66 · cache_read 1,663,255 · cache_create 198,845
- **claude-haiku-5-5**: 13 agent · 39 calls · out 20,591 · in 78 · cache_read 802,474 · cache_create 552,156
- **claude-sonnet-5-5**: 10 agent · 26 calls · out 21,642 · in 52 · cache_read 560,069 · cache_create 390,565

