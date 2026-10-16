### S4 round 1 — wf_20c2b92e-419 (19 agent, 37,116 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 9,686 | 4 | 52,253 | 57 |
| review:measurement | claude-opus-5-5 | 12 | 5,386 | 24 | 1,024,202 | 166 |
| triage | claude-sonnet-5-5 | 2 | 4,124 | 4 | 39,495 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 3,354 | 8 | 79,662 | 674 |
| review:conventions | claude-opus-5-5 | 34 | 2,887 | 68 | 3,290,387 | 237 |
| review:bugs | claude-opus-5-5 | 29 | 2,729 | 58 | 2,726,848 | 230 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,476 | 4 | 2,869 | 421 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,932 | 4 | 36,571 | 200 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,477 | 4 | 36,557 | 85 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 757 | 4 | 36,566 | 138 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 486 | 4 | 36,613 | 62 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 425 | 4 | 36,583 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 259 | 4 | 36,613 | 79 |
| machine:node tests/scripts/lo-trinh-du-lieu-ngay | claude-haiku-5-5 | 2 | 257 | 4 | 36,579 | 9 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 211 | 4 | 36,558 | 7 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 195 | 4 | 36,557 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 171 | 4 | 2,869 | 404 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 154 | 4 | 35,727 | 15 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 32,476 | 6 |


wall: 2213s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 154 | 35,727 | 15 | 06:34:50 | 06:35:05 |
| machine | 12 | 12,000 | 414,597 | 2113 | 06:34:50 | 07:10:03 |
| review | 3 | 11,002 | 7,041,437 | 237 | 06:34:50 | 06:38:47 |
| triage | 1 | 4,124 | 39,495 | 28 | 07:10:07 | 07:10:35 |
| capture | 1 | 150 | 32,476 | 6 | 07:10:38 | 07:10:43 |
| synthesize | 1 | 9,686 | 52,253 | 57 | 07:10:46 | 07:11:43 |

- **claude-sonnet-5-5**: 4 agent · 8 calls · out 14,114 · in 16 · cache_read 159,951 · cache_create 191,600
- **claude-opus-5-5**: 3 agent · 75 calls · out 11,002 · in 150 · cache_read 7,041,437 · cache_create 391,656
- **claude-haiku-5-5**: 12 agent · 26 calls · out 12,000 · in 52 · cache_read 414,597 · cache_create 531,662

### S4 round 2 — wf_02e0d9ac-8b0 (17 agent, 29,381 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 7,210 | 4 | 54,707 | 42 |
| triage | claude-sonnet-5-5 | 2 | 4,287 | 4 | 37,317 | 32 |
| review:measurement | claude-opus-5-5 | 10 | 4,231 | 20 | 689,877 | 125 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,317 | 4 | 36,576 | 224 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 2,275 | 10 | 118,951 | 732 |
| review:conventions | claude-opus-5-5 | 16 | 2,156 | 32 | 1,157,674 | 147 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,576 | 4 | 2,869 | 451 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,488 | 4 | 36,562 | 86 |
| review:bugs | claude-opus-5-5 | 19 | 977 | 38 | 1,559,139 | 322 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 520 | 4 | 36,571 | 140 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 487 | 4 | 36,618 | 87 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 484 | 4 | 36,588 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 421 | 4 | 2,869 | 442 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 416 | 4 | 36,618 | 77 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 215 | 4 | 36,563 | 6 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 168 | 4 | 36,562 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 153 | 4 | 32,481 | 6 |


wall: 2376s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 11 | 10,367 | 417,347 | 2289 | 08:55:07 | 09:33:16 |
| review | 3 | 7,364 | 3,406,690 | 323 | 08:55:07 | 09:00:30 |
| triage | 1 | 4,287 | 37,317 | 32 | 09:33:19 | 09:33:50 |
| capture | 1 | 153 | 32,481 | 6 | 09:33:53 | 09:33:59 |
| synthesize | 1 | 7,210 | 54,707 | 42 | 09:34:02 | 09:34:43 |

- **claude-sonnet-5-5**: 3 agent · 6 calls · out 11,650 · in 12 · cache_read 124,505 · cache_create 150,834
- **claude-opus-5-5**: 3 agent · 45 calls · out 7,364 · in 90 · cache_read 3,406,690 · cache_create 320,246
- **claude-haiku-5-5**: 11 agent · 25 calls · out 10,367 · in 50 · cache_read 417,347 · cache_create 494,924

