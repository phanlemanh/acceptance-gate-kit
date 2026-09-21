### S4 round 1 — wf_22f827c6-74f (21 agent, 108,249 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 2 | 25,776 | 4 | 109,498 | 273 |
| [Workflow harness — user request] The harness re | claude-opus-5 | 18 | 14,589 | 36 | 2,390,024 | 195 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 2 | 9,490 | 4 | 95,710 | 106 |
| [Workflow harness — user request] The harness re | claude-opus-5 | 8 | 9,304 | 16 | 912,130 | 117 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 13 | 6,324 | 26 | 1,201,498 | 94 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 15 | 6,323 | 30 | 1,393,506 | 117 |
| [Workflow harness — user request] The harness re | claude-opus-5 | 17 | 6,304 | 34 | 2,075,920 | 123 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 10 | 5,146 | 20 | 923,234 | 77 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 13 | 3,133 | 106 | 179,464 | 5784 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 4 | 2,577 | 34 | 232,124 | 36 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 1 | 2,540 | 10 | 27,319 | 27 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 5 | 2,478 | 42 | 310,254 | 36 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 3 | 2,182 | 26 | 159,560 | 37 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 5 | 2,096 | 42 | 297,449 | 39 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 8 | 2,054 | 66 | 505,413 | 40 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 3 | 1,601 | 26 | 159,341 | 33 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 3 | 1,434 | 26 | 159,257 | 37 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 2 | 1,314 | 4 | 89,948 | 21 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 4 | 1,263 | 34 | 135,921 | 570 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,228 | 18 | 90,764 | 20 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,093 | 18 | 27,319 | 492 |


wall: 8123s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| [Workflow harness — user request] The harness re | 21 | 108,249 | 11,475,653 | 8123 | 08:28:46 | 10:44:09 |

- **claude-sonnet-5**: 6 agent · 44 calls · out 54,373 · in 88 · cache_read 3,813,394 · cache_create 626,778
- **claude-opus-5**: 3 agent · 43 calls · out 30,197 · in 86 · cache_read 5,378,074 · cache_create 413,928
- **claude-haiku-4-5-20251001**: 12 agent · 53 calls · out 23,679 · in 448 · cache_read 2,284,185 · cache_create 1,406,678


### S4 round 2 — wf_e1f7fbfe-1fc (15 agent, 65,411 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 12 | 29,329 | 24 | 1,598,998 | 329 |
| triage | claude-sonnet-5 | 2 | 6,496 | 4 | 96,413 | 83 |
| review:bugs | claude-opus-5 | 12 | 6,091 | 24 | 1,200,655 | 82 |
| review:conventions | claude-opus-5 | 8 | 4,378 | 16 | 709,089 | 59 |
| baseline:diffBase | claude-sonnet-5 | 8 | 3,890 | 16 | 682,652 | 61 |
| review:measurement | claude-opus-5 | 3 | 2,704 | 6 | 217,584 | 31 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 9 | 2,678 | 74 | 601,764 | 57 |
| capture:provenance | claude-sonnet-5 | 3 | 1,680 | 6 | 211,043 | 25 |
| machine:bash -c 'out=$(node tests/scripts/ntr-lu | claude-haiku-4-5-20251001 | 2 | 1,525 | 18 | 90,867 | 26 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,426 | 34 | 135,532 | 523 |
| machine:bash -c 'out=$(node tests/plugins/ntr-ob | claude-haiku-4-5-20251001 | 2 | 1,360 | 18 | 90,810 | 19 |
| machine:bash -c 'out=$(node tests/scripts/ntr-tr | claude-haiku-4-5-20251001 | 2 | 1,211 | 18 | 90,804 | 19 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 901 | 18 | 27,319 | 385 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 890 | 18 | 92,900 | 14 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 852 | 18 | 92,893 | 17 |


wall: 1441s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,890 | 682,652 | 61 | 10:49:03 | 10:50:05 |
| machine | 8 | 10,843 | 1,222,889 | 1000 | 10:49:03 | 11:05:43 |
| review | 3 | 13,173 | 2,127,328 | 84 | 10:49:03 | 10:50:28 |
| triage | 1 | 6,496 | 96,413 | 83 | 11:05:45 | 11:07:08 |
| capture | 1 | 1,680 | 211,043 | 25 | 11:07:09 | 11:07:34 |
| synthesize | 1 | 29,329 | 1,598,998 | 329 | 11:07:35 | 11:13:05 |

- **claude-sonnet-5**: 4 agent · 25 calls · out 41,395 · in 50 · cache_read 2,589,106 · cache_create 497,306
- **claude-opus-5**: 3 agent · 23 calls · out 13,173 · in 46 · cache_read 2,127,328 · cache_create 265,492
- **claude-haiku-4-5-20251001**: 8 agent · 25 calls · out 10,843 · in 216 · cache_read 1,222,889 · cache_create 495,462

