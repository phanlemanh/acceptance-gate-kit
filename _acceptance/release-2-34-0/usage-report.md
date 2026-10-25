### S4 round 1 — wf_aa875363-047 — wf_aa875363-047 (26 agent, 143,626 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E9:spec-alignment | claude-sonnet-5-5 | 8 | 22,214 | 16 | 564,806 | 147 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 6 | 18,874 | 12 | 399,028 | 121 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 6 | 17,898 | 12 | 400,724 | 119 |
| synthesize:report | claude-sonnet-5-5 | 4 | 14,215 | 8 | 188,772 | 83 |
| review:conventions | claude-opus-5-5 | 15 | 11,390 | 30 | 808,872 | 143 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 10,743 | 4 | 46,235 | 52 |
| review:measurement | claude-opus-5-5 | 10 | 7,107 | 20 | 517,187 | 92 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 7 | 6,397 | 14 | 256,642 | 514 |
| review:bugs | claude-opus-5-5 | 12 | 6,320 | 24 | 623,086 | 109 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 5,087 | 14 | 206,809 | 875 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,189 | 4 | 3,057 | 557 |
| triage | claude-sonnet-5-5 | 2 | 3,116 | 4 | 39,485 | 26 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,379 | 4 | 3,057 | 372 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,924 | 4 | 38,442 | 96 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,910 | 4 | 38,545 | 214 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,797 | 4 | 38,451 | 167 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,226 | 4 | 35,441 | 146 |
| machine:bash -c 'd=$(git diff --name-only 279b15 | claude-haiku-5-5 | 2 | 1,207 | 4 | 38,515 | 10 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 1,189 | 4 | 38,468 | 23 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 1,156 | 4 | 38,591 | 9 |
| machine:bash _acceptance/release-2-29-0/lop-chep | claude-haiku-5-5 | 2 | 1,074 | 4 | 38,469 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 776 | 4 | 38,443 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 743 | 4 | 38,498 | 79 |
| machine:bash -c 'c=$(git show 279b1515:diagram-d | claude-haiku-5-5 | 2 | 688 | 4 | 38,571 | 7 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 571 | 4 | 38,442 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 436 | 4 | 34,172 | 6 |


wall: 2988s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 10,743 | 46,235 | 52 | 07:26:50 | 07:27:42 |
| machine | 16 | 31,313 | 928,441 | 2866 | 07:26:50 | 08:14:36 |
| judge | 3 | 58,986 | 1,364,558 | 149 | 07:26:50 | 07:29:19 |
| review | 3 | 24,817 | 1,949,145 | 143 | 07:26:50 | 07:29:13 |
| triage | 1 | 3,116 | 39,485 | 26 | 08:14:38 | 08:15:05 |
| capture | 1 | 436 | 34,172 | 6 | 08:15:07 | 08:15:13 |
| synthesize | 1 | 14,215 | 188,772 | 83 | 08:15:15 | 08:16:38 |

- **claude-sonnet-5-5**: 7 agent · 30 calls · out 87,496 · in 60 · cache_read 1,673,222 · cache_create 627,245
- **claude-opus-5-5**: 3 agent · 37 calls · out 24,817 · in 74 · cache_read 1,949,145 · cache_create 207,540
- **claude-haiku-5-5**: 16 agent · 42 calls · out 31,313 · in 84 · cache_read 928,441 · cache_create 703,635

