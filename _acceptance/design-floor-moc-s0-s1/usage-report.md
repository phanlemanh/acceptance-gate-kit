### S4 round 1 — wf_7770fc17-49d (29 agent, 112,138 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 27 | 21,338 | 54 | 2,285,838 | 263 |
| review:conventions | claude-opus-5-5 | 29 | 18,635 | 58 | 2,717,528 | 234 |
| review:measurement | claude-opus-5-5 | 8 | 14,050 | 16 | 470,133 | 150 |
| synthesize:report | claude-sonnet-5-5 | 4 | 11,933 | 8 | 197,396 | 66 |
| triage | claude-sonnet-5-5 | 2 | 7,388 | 4 | 42,916 | 51 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 7,085 | 4 | 42,522 | 41 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,980 | 14 | 207,794 | 924 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,282 | 4 | 3,034 | 459 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,201 | 4 | 3,034 | 389 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,896 | 4 | 38,374 | 86 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,874 | 4 | 38,374 | 12 |
| refute:design-floor-bac.mjs | claude-sonnet-5-5 | 4 | 1,585 | 8 | 118,076 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,294 | 4 | 35,349 | 167 |
| machine:bash tests/design-floor/eval.sh df4-tri- | claude-haiku-5-5 | 2 | 1,213 | 4 | 38,390 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,195 | 4 | 38,430 | 107 |
| machine:bash tests/design-floor/eval.sh df4-chi- | claude-haiku-5-5 | 2 | 1,148 | 4 | 38,387 | 14 |
| machine:bash tests/design-floor/eval.sh df4-flow | claude-haiku-5-5 | 2 | 1,147 | 4 | 38,385 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,080 | 4 | 3,034 | 543 |
| machine:bash tests/design-floor/eval.sh df4-tri- | claude-haiku-5-5 | 2 | 945 | 4 | 38,389 | 13 |
| machine:bash tests/design-floor/eval.sh df4-reus | claude-haiku-5-5 | 2 | 935 | 4 | 38,386 | 11 |
| machine:bash tests/design-floor/eval.sh df4-bac- | claude-haiku-5-5 | 2 | 851 | 4 | 38,386 | 12 |
| machine:bash tests/design-floor/eval.sh df4-the | claude-haiku-5-5 | 2 | 850 | 4 | 38,380 | 13 |
| machine:bash tests/design-floor/eval.sh df4-noi- | claude-haiku-5-5 | 2 | 841 | 4 | 38,385 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 839 | 4 | 38,430 | 74 |
| machine:bash tests/design-floor/eval.sh df4-tri- | claude-haiku-5-5 | 2 | 834 | 4 | 38,387 | 11 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 823 | 4 | 38,375 | 8 |
| machine:bash tests/design-floor/eval.sh df4-bac | claude-haiku-5-5 | 2 | 797 | 4 | 38,382 | 11 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 748 | 4 | 38,400 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 351 | 4 | 34,127 | 6 |


wall: 2947s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,085 | 42,522 | 41 | 15:50:29 | 15:51:10 |
| machine | 21 | 29,773 | 866,485 | 2800 | 15:50:29 | 16:37:09 |
| review | 3 | 54,023 | 5,473,499 | 264 | 15:50:46 | 15:55:10 |
| triage | 1 | 7,388 | 42,916 | 51 | 16:37:11 | 16:38:02 |
| refute | 1 | 1,585 | 118,076 | 16 | 16:38:04 | 16:38:20 |
| capture | 1 | 351 | 34,127 | 6 | 16:38:23 | 16:38:28 |
| synthesize | 1 | 11,933 | 197,396 | 66 | 16:38:30 | 16:39:36 |

- **claude-opus-5-5**: 3 agent · 64 calls · out 54,023 · in 128 · cache_read 5,473,499 · cache_create 332,799
- **claude-sonnet-5-5**: 5 agent · 14 calls · out 28,342 · in 28 · cache_read 435,037 · cache_create 252,246
- **claude-haiku-5-5**: 21 agent · 47 calls · out 29,773 · in 94 · cache_read 866,485 · cache_create 904,447

### S4 round 2 — wf_46f7a546-85f (28 agent, 63,013 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 10,787 | 8 | 183,168 | 65 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 7,162 | 4 | 42,486 | 38 |
| review:conventions | claude-opus-5-5 | 11 | 5,120 | 22 | 497,087 | 67 |
| review:measurement | claude-opus-5-5 | 6 | 4,472 | 12 | 242,000 | 54 |
| review:bugs | claude-opus-5-5 | 10 | 4,365 | 20 | 446,652 | 58 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 3,980 | 12 | 163,385 | 901 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,240 | 4 | 3,034 | 430 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,362 | 4 | 3,034 | 356 |
| triage | claude-sonnet-5-5 | 2 | 2,196 | 4 | 38,180 | 19 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,870 | 4 | 38,338 | 88 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,621 | 4 | 35,313 | 147 |
| machine:bash tests/design-floor/eval.sh df4-tri- | claude-haiku-5-5 | 2 | 1,226 | 4 | 38,353 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,176 | 4 | 38,394 | 109 |
| machine:bash tests/design-floor/eval.sh df4-the | claude-haiku-5-5 | 2 | 1,136 | 4 | 38,344 | 10 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 1,113 | 4 | 38,339 | 7 |
| machine:bash tests/design-floor/eval.sh df4-reus | claude-haiku-5-5 | 2 | 1,033 | 4 | 38,350 | 10 |
| machine:bash tests/design-floor/eval.sh df4-tri- | claude-haiku-5-5 | 2 | 1,026 | 4 | 38,351 | 9 |
| machine:bash tests/design-floor/eval.sh df4-noi- | claude-haiku-5-5 | 2 | 1,024 | 4 | 38,349 | 9 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 985 | 4 | 38,364 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 951 | 4 | 38,394 | 78 |
| machine:bash tests/design-floor/eval.sh df4-tri- | claude-haiku-5-5 | 2 | 914 | 4 | 38,354 | 9 |
| machine:bash tests/design-floor/eval.sh df4-chi- | claude-haiku-5-5 | 2 | 913 | 4 | 38,351 | 7 |
| machine:bash tests/design-floor/eval.sh df4-bac | claude-haiku-5-5 | 2 | 844 | 4 | 38,346 | 8 |
| machine:bash tests/design-floor/eval.sh df4-flow | claude-haiku-5-5 | 2 | 826 | 4 | 38,349 | 9 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 795 | 4 | 38,338 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 786 | 4 | 3,034 | 556 |
| machine:bash tests/design-floor/eval.sh df4-bac- | claude-haiku-5-5 | 2 | 727 | 4 | 38,350 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 363 | 4 | 34,091 | 6 |


wall: 2820s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,162 | 42,486 | 38 | 16:42:43 | 16:43:22 |
| machine | 21 | 28,548 | 821,464 | 2724 | 16:42:43 | 17:28:07 |
| review | 3 | 13,957 | 1,185,739 | 67 | 16:42:54 | 16:44:01 |
| triage | 1 | 2,196 | 38,180 | 19 | 17:28:09 | 17:28:28 |
| capture | 1 | 363 | 34,091 | 6 | 17:28:30 | 17:28:36 |
| synthesize | 1 | 10,787 | 183,168 | 65 | 17:28:38 | 17:29:43 |

- **claude-sonnet-5-5**: 4 agent · 10 calls · out 20,508 · in 20 · cache_read 297,925 · cache_create 202,574
- **claude-opus-5-5**: 3 agent · 27 calls · out 13,957 · in 54 · cache_read 1,185,739 · cache_create 176,437
- **claude-haiku-5-5**: 21 agent · 46 calls · out 28,548 · in 92 · cache_read 821,464 · cache_create 901,142

