### S4 round 1 — wf_e218863e-00e (20 agent, 70,200 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 2 | 20,704 | 4 | 139,702 | 184 |
| [Workflow harness — user request] The harness re | claude-opus-5-5 | 8 | 6,784 | 16 | 784,056 | 118 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 5 | 6,308 | 10 | 414,387 | 74 |
| [Workflow harness — user request] The harness re | claude-opus-5-5 | 9 | 5,688 | 18 | 920,248 | 146 |
| [Workflow harness — user request] The harness re | claude-opus-5-5 | 6 | 5,166 | 12 | 582,279 | 134 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 7 | 3,500 | 14 | 647,933 | 103 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 2 | 2,988 | 4 | 130,861 | 36 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 2,481 | 18 | 92,822 | 69 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 5 | 1,984 | 42 | 312,245 | 132 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 6 | 1,943 | 50 | 388,779 | 215 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,807 | 18 | 92,632 | 234 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 4 | 1,759 | 8 | 366,208 | 31 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 5 | 1,706 | 42 | 310,845 | 329 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 5 | 1,503 | 42 | 311,318 | 29 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,205 | 18 | 92,668 | 106 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,129 | 18 | 92,619 | 20 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,058 | 18 | 92,668 | 117 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 866 | 18 | 92,616 | 55 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 862 | 18 | 92,626 | 13 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 759 | 18 | 92,668 | 295 |


wall: 1836s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| [Workflow harness — user request] The harness re | 20 | 70,200 | 6,050,180 | 1836 | 09:44:56 | 10:15:32 |

- **claude-sonnet-5**: 5 agent · 20 calls · out 35,259 · in 40 · cache_read 1,699,091 · cache_create 426,377
- **claude-opus-5-5**: 3 agent · 23 calls · out 17,638 · in 46 · cache_read 2,286,583 · cache_create 309,867
- **claude-haiku-4-5-20251001**: 12 agent · 37 calls · out 17,303 · in 320 · cache_read 2,064,506 · cache_create 581,552

### S4 round 2 — wf_30dab759-b47 (19 agent, 56,074 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 16,557 | 4 | 105,560 | 148 |
| review:measurement | claude-opus-5-5 | 8 | 6,390 | 16 | 840,141 | 115 |
| baseline:diffBase | claude-sonnet-5 | 8 | 4,786 | 16 | 713,365 | 116 |
| triage | claude-sonnet-5 | 2 | 3,978 | 4 | 96,133 | 45 |
| review:bugs | claude-opus-5-5 | 9 | 3,287 | 18 | 926,204 | 129 |
| review:conventions | claude-opus-5-5 | 9 | 3,023 | 18 | 893,168 | 89 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 2,850 | 58 | 460,172 | 50 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 7 | 2,076 | 58 | 462,876 | 380 |
| machine:bash -c 'out=$(node tests/scripts/duong- | claude-haiku-4-5-20251001 | 2 | 1,701 | 18 | 92,761 | 58 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 7 | 1,674 | 58 | 433,815 | 317 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,415 | 18 | 92,532 | 20 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 3 | 1,286 | 26 | 164,865 | 120 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,267 | 18 | 92,545 | 222 |
| capture:provenance | claude-sonnet-5 | 3 | 1,266 | 6 | 194,509 | 19 |
| machine:bash _acceptance/nen-cong-cu-lenh-shell/ | claude-haiku-4-5-20251001 | 2 | 1,166 | 18 | 92,555 | 54 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 919 | 18 | 92,539 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 873 | 18 | 92,581 | 93 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 820 | 18 | 92,581 | 101 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 740 | 18 | 92,581 | 262 |


wall: 1808s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 4,786 | 713,365 | 116 | 10:20:46 | 10:22:42 |
| machine | 12 | 16,787 | 2,262,403 | 1592 | 10:20:46 | 10:47:19 |
| review | 3 | 12,700 | 2,659,513 | 130 | 10:20:46 | 10:22:57 |
| triage | 1 | 3,978 | 96,133 | 45 | 10:47:20 | 10:48:05 |
| capture | 1 | 1,266 | 194,509 | 19 | 10:48:06 | 10:48:25 |
| synthesize | 1 | 16,557 | 105,560 | 148 | 10:48:27 | 10:50:54 |

- **claude-sonnet-5**: 4 agent · 15 calls · out 26,587 · in 30 · cache_read 1,109,567 · cache_create 432,509
- **claude-opus-5-5**: 3 agent · 26 calls · out 12,700 · in 52 · cache_read 2,659,513 · cache_create 293,478
- **claude-haiku-4-5-20251001**: 12 agent · 40 calls · out 16,787 · in 344 · cache_read 2,262,403 · cache_create 620,033

