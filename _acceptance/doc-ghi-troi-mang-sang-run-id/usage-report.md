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

### S4 round 2 — wf_15799f9e-e1f (23 agent, 29,715 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 5,034 | 6 | 235,539 | 77 |
| triage | claude-sonnet-5-5 | 2 | 2,496 | 4 | 100,548 | 24 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,303 | 4 | 132,717 | 299 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,230 | 4 | 132,717 | 259 |
| review:conventions | claude-opus-5-5 | 7 | 2,186 | 14 | 719,738 | 79 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,975 | 4 | 35,010 | 389 |
| review:measurement | claude-opus-5-5 | 5 | 1,773 | 10 | 476,810 | 76 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,508 | 4 | 132,703 | 59 |
| review:bugs | claude-opus-5-5 | 21 | 1,293 | 42 | 2,865,432 | 174 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 1,176 | 4 | 132,825 | 10 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 1,176 | 4 | 132,821 | 9 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 1,176 | 4 | 132,813 | 10 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 1,151 | 4 | 132,834 | 8 |
| baseline:diffBase | claude-sonnet-5-5 | 6 | 1,099 | 12 | 522,161 | 166 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 891 | 4 | 132,822 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 557 | 4 | 132,759 | 118 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 460 | 4 | 132,703 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 389 | 4 | 132,759 | 100 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 198 | 4 | 132,818 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 186 | 4 | 132,712 | 137 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 159 | 4 | 132,704 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 154 | 4 | 96,482 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 145 | 4 | 70,020 | 356 |


wall: 1977s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,099 | 522,161 | 166 | 17:04:07 | 17:06:53 |
| machine | 16 | 15,680 | 1,963,737 | 1808 | 17:04:07 | 17:34:15 |
| review | 3 | 5,252 | 4,061,980 | 175 | 17:04:07 | 17:07:02 |
| triage | 1 | 2,496 | 100,548 | 24 | 17:34:18 | 17:34:41 |
| capture | 1 | 154 | 96,482 | 11 | 17:34:45 | 17:34:56 |
| synthesize | 1 | 5,034 | 235,539 | 77 | 17:35:47 | 17:37:04 |

- **claude-sonnet-5-5**: 4 agent · 13 calls · out 8,783 · in 26 · cache_read 954,730 · cache_create 444,350
- **claude-haiku-5-5**: 16 agent · 32 calls · out 15,680 · in 64 · cache_read 1,963,737 · cache_create 1,261,278
- **claude-opus-5-5**: 3 agent · 33 calls · out 5,252 · in 66 · cache_read 4,061,980 · cache_create 374,801

### S4 round 3 — wf_6c2a5b8e-167 (22 agent, 34,205 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 5,726 | 10 | 497,782 | 51 |
| triage | claude-sonnet-5-5 | 2 | 3,704 | 4 | 102,048 | 31 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,367 | 4 | 132,919 | 254 |
| review:bugs | claude-opus-5-5 | 23 | 2,302 | 46 | 3,065,863 | 181 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,076 | 4 | 132,919 | 264 |
| review:conventions | claude-opus-5-5 | 10 | 2,001 | 20 | 1,143,547 | 108 |
| review:measurement | claude-opus-5-5 | 11 | 1,943 | 22 | 1,336,126 | 158 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,745 | 4 | 70,020 | 364 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,732 | 4 | 132,905 | 60 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,526 | 4 | 132,905 | 13 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 1,421 | 4 | 133,015 | 11 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,301 | 4 | 132,914 | 150 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 1,177 | 4 | 133,024 | 10 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 1,176 | 4 | 133,027 | 10 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 1,176 | 4 | 133,020 | 10 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 1,176 | 4 | 133,036 | 9 |
| machine:bash -c 'out=$(node tests/workflows/doc- | claude-haiku-5-5 | 2 | 577 | 4 | 133,023 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 467 | 4 | 132,961 | 109 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 169 | 4 | 70,020 | 339 |
| capture:provenance | claude-sonnet-5-5 | 2 | 161 | 4 | 96,684 | 9 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 159 | 4 | 132,906 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 132,961 | 101 |


wall: 1781s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 16 | 18,368 | 2,001,575 | 1681 | 17:53:43 | 18:21:44 |
| review | 3 | 6,246 | 5,545,536 | 183 | 17:53:43 | 17:56:46 |
| triage | 1 | 3,704 | 102,048 | 31 | 18:21:48 | 18:22:18 |
| capture | 1 | 161 | 96,684 | 9 | 18:22:22 | 18:22:31 |
| synthesize | 1 | 5,726 | 497,782 | 51 | 18:22:33 | 18:23:24 |

- **claude-sonnet-5-5**: 3 agent · 9 calls · out 9,591 · in 18 · cache_read 696,514 · cache_create 343,206
- **claude-haiku-5-5**: 16 agent · 32 calls · out 18,368 · in 64 · cache_read 2,001,575 · cache_create 1,229,590
- **claude-opus-5-5**: 3 agent · 44 calls · out 6,246 · in 88 · cache_read 5,545,536 · cache_create 348,362

