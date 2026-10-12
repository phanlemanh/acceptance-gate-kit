### S4 round 1 — wf_21f5a654-417 (28 agent, 32,283 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 8,831 | 8 | 320,026 | 60 |
| triage | claude-sonnet-5-5 | 2 | 3,662 | 4 | 83,532 | 26 |
| review:measurement | claude-opus-5-5 | 8 | 3,044 | 16 | 792,867 | 141 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,287 | 4 | 34,982 | 354 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,190 | 4 | 34,982 | 557 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 1,696 | 8 | 205,390 | 667 |
| review:bugs | claude-opus-5-5 | 8 | 1,680 | 16 | 725,659 | 75 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,592 | 4 | 113,829 | 11 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,462 | 4 | 113,829 | 86 |
| review:conventions | claude-opus-5-5 | 15 | 1,191 | 30 | 1,693,120 | 115 |
| machine:HP_CASES=AC-8,AC-8-do,AC-8-lich-su,AC-8- | claude-haiku-5-5 | 2 | 498 | 4 | 113,890 | 21 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 454 | 4 | 86,854 | 118 |
| machine:HP_CASES=AC-3,AC-3-im,AC-3-do node tests | claude-haiku-5-5 | 2 | 405 | 4 | 113,869 | 9 |
| machine:HP_CASES=AC-10,AC-10-do node tests/scrip | claude-haiku-5-5 | 2 | 384 | 4 | 113,859 | 6 |
| machine:HP_CASES=AC-6,AC-6-do node tests/scripts | claude-haiku-5-5 | 2 | 327 | 4 | 113,859 | 8 |
| machine:HP_CASES=AC-2,AC-2-do node tests/scripts | claude-haiku-5-5 | 2 | 300 | 4 | 113,859 | 11 |
| machine:HP_CASES=AC-9,AC-9-do node tests/scripts | claude-haiku-5-5 | 2 | 263 | 4 | 113,859 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 258 | 4 | 113,885 | 117 |
| machine:HP_CASES=AC-5 node tests/scripts/hang-pr | claude-haiku-5-5 | 2 | 245 | 4 | 113,853 | 8 |
| machine:HP_CASES=AC-1 node tests/scripts/hang-pr | claude-haiku-5-5 | 2 | 231 | 4 | 113,853 | 14 |
| machine:HP_CASES=AC-8-kho-that node tests/script | claude-haiku-5-5 | 2 | 221 | 4 | 113,853 | 229 |
| machine:HP_CASES=AC-7 node tests/scripts/hang-pr | claude-haiku-5-5 | 2 | 215 | 4 | 113,853 | 9 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 194 | 4 | 113,838 | 182 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 169 | 4 | 113,885 | 296 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 166 | 4 | 113,830 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 77,632 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 144 | 4 | 113,885 | 67 |
| machine:HP_CASES=AC-4,AC-4-do node tests/scripts | claude-haiku-5-5 | 2 | 24 | 4 | 113,859 | 11 |


wall: 2471s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 454 | 86,854 | 118 | 21:30:23 | 21:32:21 |
| machine | 21 | 13,271 | 2,324,801 | 2370 | 21:30:23 | 22:09:53 |
| review | 3 | 5,915 | 3,211,646 | 142 | 21:30:23 | 21:32:45 |
| triage | 1 | 3,662 | 83,532 | 26 | 22:09:56 | 22:10:22 |
| capture | 1 | 150 | 77,632 | 6 | 22:10:25 | 22:10:31 |
| synthesize | 1 | 8,831 | 320,026 | 60 | 22:10:34 | 22:11:34 |

- **claude-sonnet-5-5**: 4 agent · 10 calls · out 13,097 · in 20 · cache_read 568,044 · cache_create 389,494
- **claude-opus-5-5**: 3 agent · 31 calls · out 5,915 · in 62 · cache_read 3,211,646 · cache_create 322,000
- **claude-haiku-5-5**: 21 agent · 44 calls · out 13,271 · in 88 · cache_read 2,324,801 · cache_create 1,280,562

