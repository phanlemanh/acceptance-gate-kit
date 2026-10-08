### S4 round 1 — wf_3be30cab-04b (24 agent, 29,137 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 7,201 | 8 | 395,539 | 64 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,646 | 4 | 132,795 | 257 |
| triage | claude-sonnet-5-5 | 2 | 2,299 | 4 | 135,578 | 21 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 132,781 | 58 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 1,453 | 4 | 132,891 | 12 |
| review:conventions | claude-opus-5-5 | 15 | 1,433 | 30 | 1,891,275 | 99 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 1,366 | 4 | 132,900 | 10 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,346 | 4 | 132,781 | 13 |
| review:bugs | claude-opus-5-5 | 10 | 1,303 | 20 | 1,086,947 | 98 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,167 | 4 | 132,790 | 141 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 1,118 | 4 | 132,907 | 10 |
| refute:acceptance-verify.js | claude-sonnet-5-5 | 5 | 1,075 | 10 | 447,801 | 29 |
| review:measurement | claude-opus-5-5 | 9 | 1,006 | 18 | 1,069,791 | 110 |
| baseline:diffBase | claude-sonnet-5-5 | 5 | 867 | 10 | 415,797 | 76 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 678 | 4 | 132,899 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 623 | 4 | 132,837 | 106 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 573 | 4 | 132,899 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 355 | 4 | 70,020 | 340 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 320 | 4 | 132,795 | 245 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 198 | 4 | 132,896 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 195 | 4 | 70,020 | 376 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 159 | 4 | 132,782 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 131,427 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 124 | 4 | 132,837 | 95 |


wall: 1793s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 867 | 415,797 | 76 | 16:26:10 | 16:27:26 |
| machine | 16 | 13,805 | 1,999,830 | 1659 | 16:26:10 | 16:53:49 |
| review | 3 | 3,742 | 4,048,013 | 111 | 16:26:10 | 16:28:01 |
| triage | 1 | 2,299 | 135,578 | 21 | 16:53:51 | 16:54:12 |
| refute | 1 | 1,075 | 447,801 | 29 | 16:54:15 | 16:54:44 |
| capture | 1 | 148 | 131,427 | 9 | 16:54:47 | 16:54:56 |
| synthesize | 1 | 7,201 | 395,539 | 64 | 16:54:59 | 16:56:03 |

- **claude-sonnet-5-5**: 5 agent · 18 calls · out 11,590 · in 36 · cache_read 1,526,142 · cache_create 411,371
- **claude-haiku-5-5**: 16 agent · 32 calls · out 13,805 · in 64 · cache_read 1,999,830 · cache_create 1,227,906
- **claude-opus-5-5**: 3 agent · 34 calls · out 3,742 · in 68 · cache_read 4,048,013 · cache_create 320,214

