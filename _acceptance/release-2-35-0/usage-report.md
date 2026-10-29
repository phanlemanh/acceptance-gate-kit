### S4 round 1 (dừng giữa chừng — bản đồ lệch) — wf_f96d9b71-17d (19 agent, 118,436 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E9:spec-alignment | claude-sonnet-5-5 | 10 | 23,623 | 20 | 837,765 | 180 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 11 | 23,224 | 22 | 873,564 | 183 |
| judge:E9:domain-correctness | claude-sonnet-5-5 | 14 | 19,300 | 28 | 1,130,355 | 155 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 10,823 | 4 | 46,019 | 57 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 6,295 | 18 | 292,759 | 1011 |
| review:conventions | claude-opus-5-5 | 11 | 4,837 | 22 | 487,727 | 59 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 4 | 4,336 | 8 | 124,055 | 219 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 5 | 4,320 | 10 | 199,336 | 36 |
| review:bugs | claude-opus-5-5 | 11 | 4,177 | 22 | 476,727 | 172 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 4 | 3,915 | 8 | 146,298 | 36 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 5 | 3,886 | 10 | 195,606 | 34 |
| review:measurement | claude-opus-5-5 | 7 | 2,872 | 14 | 282,501 | 34 |
| machine:bash -c 'd=$(git diff --name-only 0e0956 | claude-haiku-5-5 | 2 | 1,305 | 4 | 38,296 | 7 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 1,263 | 4 | 38,358 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,179 | 4 | 35,110 | 144 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,016 | 4 | 38,203 | 162 |
| machine:bash -c 'c=$(git show 0e095648:diagram-d | claude-haiku-5-5 | 2 | 920 | 4 | 38,323 | 6 |
| machine:bash _acceptance/release-2-29-0/lop-chep | claude-haiku-5-5 | 2 | 800 | 4 | 38,221 | 5 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 1 | 345 | 2 | 3,140 | 133 |


wall: 1457s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 10,823 | 46,019 | 57 | 21:01:28 | 21:02:25 |
| machine | 9 | 17,459 | 646,465 | 1457 | 21:01:28 | 21:25:44 |
| judge | 6 | 78,268 | 3,382,924 | 185 | 21:01:28 | 21:04:33 |
| review | 3 | 11,886 | 1,246,955 | 173 | 21:01:37 | 21:04:30 |

- **claude-sonnet-5-5**: 7 agent · 51 calls · out 89,091 · in 102 · cache_read 3,428,943 · cache_create 653,149
- **claude-haiku-5-5**: 9 agent · 26 calls · out 17,459 · in 52 · cache_read 646,465 · cache_create 370,055
- **claude-opus-5-5**: 3 agent · 29 calls · out 11,886 · in 58 · cache_read 1,246,955 · cache_create 172,136

### S4 round 2 — wf_3c019560-fcf (28 agent, 142,625 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E9:domain-correctness | claude-sonnet-5-5 | 13 | 21,155 | 26 | 999,673 | 153 |
| judge:E9:operational-feasibility | claude-sonnet-5-5 | 11 | 20,810 | 22 | 922,787 | 154 |
| judge:E9:spec-alignment | claude-sonnet-5-5 | 9 | 18,110 | 18 | 690,708 | 118 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 10,963 | 4 | 45,626 | 58 |
| synthesize:report | claude-sonnet-5-5 | 3 | 10,326 | 6 | 113,103 | 59 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 8 | 7,744 | 16 | 302,149 | 562 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,898 | 14 | 204,086 | 933 |
| review:conventions | claude-opus-5-5 | 12 | 4,869 | 24 | 538,959 | 186 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 5 | 4,788 | 10 | 166,112 | 226 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 6 | 3,890 | 12 | 251,335 | 32 |
| review:bugs | claude-opus-5-5 | 12 | 3,727 | 24 | 530,596 | 179 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 6 | 3,671 | 12 | 251,529 | 29 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 5 | 3,593 | 10 | 196,681 | 28 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,572 | 6 | 80,507 | 33 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,230 | 4 | 3,140 | 415 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 2,099 | 4 | 37,801 | 12 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,047 | 4 | 37,801 | 89 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,973 | 4 | 3,140 | 390 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,592 | 4 | 37,810 | 164 |
| review:measurement | claude-opus-5-5 | 4 | 1,352 | 8 | 126,469 | 19 |
| machine:GIT_GLOB_PATHSPECS=1 bash scripts/rel-cu | claude-haiku-5-5 | 2 | 1,265 | 4 | 37,965 | 7 |
| machine:bash -c 'c=$(git show 0e095648:diagram-d | claude-haiku-5-5 | 2 | 1,218 | 4 | 37,930 | 8 |
| machine:bash -c 'd=$(git diff --name-only 0e0956 | claude-haiku-5-5 | 2 | 1,209 | 4 | 37,903 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,183 | 4 | 37,857 | 156 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,122 | 4 | 37,857 | 76 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 940 | 4 | 37,802 | 6 |
| machine:bash _acceptance/release-2-29-0/lop-chep | claude-haiku-5-5 | 2 | 915 | 4 | 37,828 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 364 | 4 | 33,455 | 8 |


wall: 2929s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 10,963 | 45,626 | 58 | 21:26:45 | 21:27:42 |
| machine | 16 | 39,795 | 1,137,688 | 2858 | 21:26:45 | 22:14:22 |
| judge | 6 | 71,229 | 3,312,713 | 155 | 21:26:45 | 21:29:20 |
| review | 3 | 9,948 | 1,196,024 | 186 | 21:26:54 | 21:29:59 |
| capture | 1 | 364 | 33,455 | 8 | 22:14:24 | 22:14:32 |
| synthesize | 1 | 10,326 | 113,103 | 59 | 22:14:35 | 22:15:33 |

- **claude-sonnet-5-5**: 9 agent · 57 calls · out 92,882 · in 114 · cache_read 3,504,897 · cache_create 729,749
- **claude-haiku-5-5**: 16 agent · 47 calls · out 39,795 · in 94 · cache_read 1,137,688 · cache_create 703,724
- **claude-opus-5-5**: 3 agent · 28 calls · out 9,948 · in 56 · cache_read 1,196,024 · cache_create 158,748

