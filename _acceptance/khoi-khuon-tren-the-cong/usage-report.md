### S4 round 1 — wf_9e616624-17f (20 agent, 77,690 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 26 | 15,826 | 52 | 2,485,148 | 240 |
| review:bugs | claude-opus-5-5 | 22 | 13,663 | 44 | 2,050,002 | 231 |
| synthesize:report | claude-sonnet-5-5 | 3 | 10,089 | 6 | 142,564 | 62 |
| review:measurement | claude-opus-5-5 | 8 | 7,881 | 16 | 514,076 | 107 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 11 | 6,601 | 22 | 514,416 | 1176 |
| triage | claude-sonnet-5-5 | 2 | 6,461 | 4 | 51,289 | 50 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 2,784 | 6 | 103,976 | 40 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,845 | 4 | 47,610 | 96 |
| refute:khoi-khuon-tren-the-cong.test.mjs | claude-sonnet-5-5 | 4 | 1,800 | 8 | 153,667 | 29 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,559 | 4 | 44,479 | 189 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 1,494 | 8 | 107,288 | 617 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,266 | 4 | 3,140 | 411 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,214 | 4 | 47,666 | 126 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 965 | 4 | 3,140 | 509 |
| machine:node tests/scripts/khoi-khuon-tren-the-c | claude-haiku-5-5 | 2 | 894 | 4 | 47,629 | 24 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 865 | 4 | 47,611 | 8 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 814 | 4 | 47,610 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 721 | 4 | 47,666 | 96 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 556 | 4 | 47,636 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 392 | 4 | 43,236 | 13 |


wall: 3432s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,784 | 103,976 | 40 | 15:32:38 | 15:33:18 |
| machine | 12 | 18,794 | 1,005,891 | 3271 | 15:32:38 | 16:27:08 |
| review | 3 | 37,370 | 5,049,226 | 240 | 15:32:38 | 15:36:38 |
| triage | 1 | 6,461 | 51,289 | 50 | 16:27:11 | 16:28:01 |
| refute | 1 | 1,800 | 153,667 | 29 | 16:28:03 | 16:28:32 |
| capture | 1 | 392 | 43,236 | 13 | 16:28:34 | 16:28:47 |
| synthesize | 1 | 10,089 | 142,564 | 62 | 16:28:49 | 16:29:50 |

- **claude-opus-5-5**: 3 agent · 56 calls · out 37,370 · in 112 · cache_read 5,049,226 · cache_create 344,855
- **claude-sonnet-5-5**: 5 agent · 14 calls · out 21,526 · in 28 · cache_read 494,732 · cache_create 310,141
- **claude-haiku-5-5**: 12 agent · 35 calls · out 18,794 · in 70 · cache_read 1,005,891 · cache_create 780,386

### S4 round 2 — wf_9c757236-1f6 (18 agent, 41,762 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 6,808 | 18 | 389,689 | 1187 |
| synthesize:report | claude-sonnet-5-5 | 4 | 6,718 | 8 | 199,966 | 46 |
| review:measurement | claude-opus-5-5 | 7 | 4,604 | 14 | 351,180 | 63 |
| review:conventions | claude-opus-5-5 | 11 | 4,482 | 22 | 589,753 | 88 |
| review:bugs | claude-opus-5-5 | 8 | 2,857 | 16 | 391,485 | 52 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,634 | 4 | 3,140 | 412 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,058 | 4 | 47,619 | 97 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,855 | 4 | 47,619 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,735 | 4 | 3,140 | 490 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,276 | 4 | 47,675 | 125 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,251 | 4 | 47,628 | 175 |
| triage | claude-sonnet-5-5 | 2 | 1,120 | 4 | 46,095 | 19 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 992 | 4 | 47,675 | 95 |
| machine:node tests/scripts/khoi-khuon-tren-the-c | claude-haiku-5-5 | 2 | 829 | 4 | 47,638 | 22 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 759 | 4 | 47,645 | 8 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 700 | 4 | 47,620 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 692 | 4 | 3,140 | 610 |
| capture:provenance | claude-sonnet-5-5 | 2 | 392 | 4 | 43,245 | 16 |


wall: 3335s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 12 | 21,589 | 780,228 | 3249 | 16:32:15 | 17:26:24 |
| review | 3 | 11,943 | 1,332,418 | 88 | 16:32:15 | 16:33:43 |
| triage | 1 | 1,120 | 46,095 | 19 | 17:26:26 | 17:26:44 |
| capture | 1 | 392 | 43,245 | 16 | 17:26:46 | 17:27:02 |
| synthesize | 1 | 6,718 | 199,966 | 46 | 17:27:04 | 17:27:50 |

- **claude-haiku-5-5**: 12 agent · 31 calls · out 21,589 · in 62 · cache_read 780,228 · cache_create 771,965
- **claude-sonnet-5-5**: 3 agent · 8 calls · out 8,230 · in 16 · cache_read 289,306 · cache_create 180,893
- **claude-opus-5-5**: 3 agent · 26 calls · out 11,943 · in 52 · cache_read 1,332,418 · cache_create 194,897

