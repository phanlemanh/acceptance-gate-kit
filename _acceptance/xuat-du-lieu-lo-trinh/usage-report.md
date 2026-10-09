### S4 round 1 — wf_5cc4defa-6ba (24 agent, 39,507 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 8,465 | 6 | 250,304 | 78 |
| triage | claude-sonnet-5-5 | 2 | 4,903 | 4 | 104,043 | 44 |
| review:bugs | claude-opus-5-5 | 14 | 2,909 | 28 | 1,778,467 | 166 |
| review:conventions | claude-opus-5-5 | 14 | 2,526 | 28 | 1,715,544 | 123 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,371 | 4 | 134,335 | 200 |
| review:measurement | claude-opus-5-5 | 14 | 2,214 | 28 | 2,021,861 | 245 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 2 | 1,945 | 4 | 133,942 | 24 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,929 | 4 | 134,335 | 322 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 2 | 1,699 | 4 | 133,944 | 19 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 134,321 | 60 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 2 | 1,434 | 4 | 99,050 | 20 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,345 | 4 | 134,321 | 15 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,308 | 4 | 99,348 | 124 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 3 | 1,136 | 6 | 244,261 | 18 |
| refute:lo-trinh.test.mjs | claude-sonnet-5-5 | 3 | 1,131 | 6 | 242,146 | 17 |
| refute:lo-trinh-du-lieu.md | claude-sonnet-5-5 | 4 | 814 | 8 | 313,105 | 20 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 506 | 4 | 134,377 | 79 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 302 | 4 | 134,329 | 47 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 264 | 4 | 134,377 | 267 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 233 | 8 | 313,216 | 53 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 174 | 4 | 134,335 | 213 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 98,125 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 138 | 4 | 134,322 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 125 | 4 | 134,377 | 64 |


wall: 1565s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 233 | 313,216 | 53 | 09:01:01 | 09:01:54 |
| machine | 11 | 9,946 | 1,442,777 | 1391 | 09:01:01 | 09:24:12 |
| judge | 3 | 5,078 | 366,936 | 29 | 09:01:01 | 09:01:30 |
| review | 3 | 7,649 | 5,515,872 | 250 | 09:01:01 | 09:05:12 |
| triage | 1 | 4,903 | 104,043 | 44 | 09:24:14 | 09:24:58 |
| refute | 3 | 3,081 | 799,512 | 20 | 09:25:00 | 09:25:20 |
| capture | 1 | 152 | 98,125 | 8 | 09:25:32 | 09:25:39 |
| synthesize | 1 | 8,465 | 250,304 | 78 | 09:25:48 | 09:27:06 |

- **claude-sonnet-5-5**: 10 agent · 27 calls · out 21,912 · in 54 · cache_read 1,932,136 · cache_create 992,848
- **claude-opus-5-5**: 3 agent · 42 calls · out 7,649 · in 84 · cache_read 5,515,872 · cache_create 451,941
- **claude-haiku-5-5**: 11 agent · 22 calls · out 9,946 · in 44 · cache_read 1,442,777 · cache_create 823,665

### S4 round 2 — wf_19b3a51a-0b0 (21 agent, 34,068 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 7,009 | 12 | 657,980 | 89 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 3,466 | 8 | 247,798 | 4240 |
| triage | claude-sonnet-5-5 | 2 | 2,769 | 4 | 102,162 | 24 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 2 | 2,514 | 4 | 133,880 | 26 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 3 | 2,250 | 6 | 245,424 | 37 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 2 | 2,134 | 4 | 98,986 | 20 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,021 | 4 | 34,982 | 352 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,568 | 4 | 134,257 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,500 | 4 | 134,271 | 317 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 134,257 | 62 |
| review:conventions | claude-opus-5-5 | 13 | 1,404 | 26 | 1,448,136 | 156 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,222 | 4 | 99,284 | 122 |
| review:measurement | claude-opus-5-5 | 14 | 1,191 | 28 | 1,744,636 | 159 |
| review:bugs | claude-opus-5-5 | 11 | 988 | 22 | 1,270,852 | 100 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 774 | 4 | 134,313 | 251 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 651 | 4 | 134,313 | 79 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 308 | 4 | 134,313 | 63 |
| machine:node tests/scripts/lo-trinh.test.mjs | claude-haiku-5-5 | 2 | 268 | 4 | 134,265 | 47 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 242 | 8 | 312,776 | 47 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 160 | 4 | 134,258 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 145 | 4 | 98,061 | 10 |


wall: 5679s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 242 | 312,776 | 47 | 09:33:08 | 09:33:54 |
| machine | 11 | 13,422 | 1,456,311 | 5547 | 09:33:08 | 11:05:34 |
| judge | 3 | 6,898 | 478,290 | 40 | 09:33:08 | 09:33:48 |
| review | 3 | 3,583 | 4,463,624 | 164 | 09:33:08 | 09:35:52 |
| triage | 1 | 2,769 | 102,162 | 24 | 11:05:38 | 11:06:02 |
| capture | 1 | 145 | 98,061 | 10 | 11:06:05 | 11:06:15 |
| synthesize | 1 | 7,009 | 657,980 | 89 | 11:06:18 | 11:07:47 |

- **claude-sonnet-5-5**: 7 agent · 21 calls · out 17,063 · in 42 · cache_read 1,649,269 · cache_create 734,183
- **claude-haiku-5-5**: 11 agent · 24 calls · out 13,422 · in 48 · cache_read 1,456,311 · cache_create 1,022,387
- **claude-opus-5-5**: 3 agent · 38 calls · out 3,583 · in 76 · cache_read 4,463,624 · cache_create 427,431

