### S4 round 1 (nối lại sau lượt bị hạ tầng đốt) — wf_04ebfd50-69c (65 agent, 156,025 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 13 | 15,895 | 26 | 910,304 | 179 |
| review:bugs | claude-opus-5-5 | 23 | 15,591 | 46 | 1,949,866 | 228 |
| review:conventions | claude-opus-5-5 | 20 | 15,546 | 40 | 1,469,037 | 183 |
| review:bugs | claude-opus-5-5 | 22 | 14,361 | 44 | 1,863,738 | 220 |
| review:conventions | claude-opus-5-5 | 18 | 14,190 | 36 | 1,290,318 | 167 |
| review:measurement | claude-opus-5-5 | 11 | 12,027 | 22 | 657,773 | 147 |
| synthesize:report | claude-sonnet-5-5 | 4 | 11,899 | 8 | 188,754 | 77 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 6,546 | 4 | 41,901 | 45 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,497 | 16 | 254,342 | 922 |
| triage | claude-sonnet-5-5 | 2 | 5,496 | 4 | 41,481 | 41 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,287 | 4 | 3,034 | 431 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,334 | 4 | 38,300 | 92 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,980 | 4 | 0 | 365 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,979 | 4 | 38,300 | 15 |
| machine:bash tests/design-floor/eval.sh bo-ban-v | claude-haiku-5-5 | 2 | 1,773 | 4 | 38,312 | 40 |
| machine:bash tests/design-floor/eval.sh bo-ban-v | claude-haiku-5-5 | 2 | 1,758 | 4 | 38,312 | 38 |
| machine:bash tests/design-floor/eval.sh chuoi-so | claude-haiku-5-5 | 2 | 1,660 | 4 | 38,312 | 20 |
| machine:bash tests/design-floor/eval.sh chuoi-so | claude-haiku-5-5 | 2 | 1,635 | 4 | 38,312 | 23 |
| machine:bash tests/design-floor/eval.sh luat-gio | claude-haiku-5-5 | 2 | 1,595 | 4 | 38,311 | 20 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,498 | 4 | 38,309 | 160 |
| machine:bash tests/design-floor/eval.sh c | claude-haiku-5-5 | 2 | 1,394 | 4 | 38,300 | 21 |
| machine:bash tests/design-floor/eval.sh c | claude-haiku-5-5 | 2 | 1,324 | 4 | 38,300 | 18 |
| machine:bash tests/design-floor/eval.sh luat-gio | claude-haiku-5-5 | 2 | 1,288 | 4 | 38,311 | 22 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,213 | 4 | 38,356 | 121 |
| machine:bash tests/design-floor/eval.sh d | claude-haiku-5-5 | 2 | 1,185 | 4 | 38,300 | 10 |
| machine:bash tests/design-floor/eval.sh b-df06 | claude-haiku-5-5 | 2 | 1,120 | 4 | 38,306 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,062 | 4 | 3,034 | 596 |
| machine:bash tests/design-floor/eval.sh d | claude-haiku-5-5 | 2 | 1,043 | 4 | 38,300 | 6 |
| machine:bash tests/design-floor/eval.sh b-df06 | claude-haiku-5-5 | 2 | 1,032 | 4 | 38,306 | 6 |
| machine:bash tests/design-floor/eval.sh b-df05 | claude-haiku-5-5 | 2 | 1,019 | 4 | 38,306 | 7 |
| machine:bash tests/design-floor/eval.sh b-df04 | claude-haiku-5-5 | 2 | 991 | 4 | 38,306 | 10 |
| machine:bash tests/design-floor/eval.sh b-df05 | claude-haiku-5-5 | 2 | 989 | 4 | 38,306 | 8 |
| machine:bash tests/design-floor/eval.sh b-df04 | claude-haiku-5-5 | 2 | 905 | 4 | 38,306 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 875 | 4 | 38,301 | 7 |
| machine:bash tests/design-floor/eval.sh b-df01 | claude-haiku-5-5 | 2 | 839 | 4 | 38,306 | 7 |
| machine:bash tests/design-floor/eval.sh b-df01 | claude-haiku-5-5 | 2 | 825 | 4 | 38,306 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 776 | 4 | 38,356 | 86 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 738 | 4 | 38,326 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 1 | 506 | 2 | 3,034 | 2041 |
| capture:provenance | claude-sonnet-5-5 | 2 | 354 | 4 | 34,053 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| refute:evals.yaml | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| triage | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| refute:token-coverage.ts | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| refute:gate.ts | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| refute:output.ts | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| machine:bash tests/workflows/run-tests.sh | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| machine:bash tests/scripts/run-tests.sh --manh m | <synthetic> | 1 | 0 | 0 | 0 | 2041 |
| refute:hop-dong.mjs | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| refute:reuse-plan-check-impl.ts | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| capture:provenance | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| refute:reuse-plan-check-impl.ts | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| machine:bash -c 'set -o pipefail; bash tests/plu | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| triage | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| machine:bash tests/scripts/run-tests.sh --manh m | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| machine:node scripts/product-map.mjs --root . -- | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| machine:bash -c 'set -o pipefail; bash tests/plu | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| machine:bash tests/hooks/run-tests.sh | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| machine:bash -c 'set -o pipefail; bash tests/plu | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| refute:evals.yaml | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| refute:reuse-plan-check-impl.ts | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| refute:eval.sh | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| refute:so-va.mjs | <synthetic> | 1 | 0 | 0 | 0 | 1 |
| refute:token-coverage.ts | <synthetic> | 1 | 0 | 0 | 0 | 1 |


wall: 5400s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 6,546 | 41,901 | 45 | 10:56:51 | 10:57:37 |
| machine | 39 | 44,120 | 1,221,210 | 5271 | 10:56:51 | 12:24:42 |
| review | 6 | 87,610 | 8,141,036 | 2838 | 10:56:51 | 11:44:10 |
| triage | 3 | 5,496 | 41,481 | 3100 | 11:33:44 | 12:25:25 |
| refute | 12 | 0 | 0 | 2 | 11:33:46 | 11:33:49 |
| capture | 2 | 354 | 34,053 | 3103 | 11:33:49 | 12:25:32 |
| synthesize | 1 | 11,899 | 188,754 | 77 | 12:25:34 | 12:26:51 |

- **claude-opus-5-5**: 6 agent · 107 calls · out 87,610 · in 214 · cache_read 8,141,036 · cache_create 662,945
- **claude-sonnet-5-5**: 4 agent · 10 calls · out 24,295 · in 20 · cache_read 306,189 · cache_create 203,266
- **claude-haiku-5-5**: 30 agent · 65 calls · out 44,120 · in 130 · cache_read 1,221,210 · cache_create 1,226,549
- **<synthetic>**: 25 agent · 25 calls · out 0 · in 0 · cache_read 0 · cache_create 0

