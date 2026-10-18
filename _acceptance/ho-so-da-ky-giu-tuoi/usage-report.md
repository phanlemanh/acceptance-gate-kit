### S4 round 1 — wf_9bf38b4a-13b (22 agent, 49,808 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 13,508 | 6 | 134,300 | 79 |
| triage | claude-sonnet-5-5 | 2 | 5,894 | 4 | 41,719 | 41 |
| review:bugs | claude-opus-5-5 | 32 | 4,643 | 64 | 3,256,866 | 314 |
| review:measurement | claude-opus-5-5 | 17 | 4,361 | 34 | 1,606,855 | 276 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 3,611 | 14 | 210,210 | 630 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 2,993 | 16 | 266,229 | 969 |
| review:conventions | claude-opus-5-5 | 16 | 2,855 | 32 | 1,342,336 | 162 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,492 | 4 | 5,738 | 498 |
| machine:bash -c 'set -e; for f in tests/scripts/ | claude-haiku-5-5 | 2 | 2,194 | 4 | 5,738 | 409 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,513 | 4 | 38,042 | 86 |
| machine:node tests/scripts/ho-so-da-ky-giu-tuoi- | claude-haiku-5-5 | 38 | 1,498 | 76 | 2,251,677 | 3741 |
| refute:do-san-tren-nen.cjs | claude-sonnet-5-5 | 5 | 1,139 | 10 | 180,466 | 24 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 581 | 4 | 35,182 | 246 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 435 | 4 | 38,068 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 434 | 8 | 86,114 | 658 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 372 | 4 | 38,098 | 103 |
| machine:node tests/scripts/ho-so-da-ky-giu-tuoi. | claude-haiku-5-5 | 2 | 266 | 4 | 38,067 | 76 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 263 | 4 | 38,098 | 125 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 215 | 4 | 38,379 | 202 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 215 | 4 | 38,043 | 5 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 173 | 4 | 38,042 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 153 | 4 | 33,959 | 6 |


wall: 3899s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 215 | 38,379 | 202 | 20:27:12 | 20:30:33 |
| machine | 14 | 17,040 | 3,127,346 | 3743 | 20:27:12 | 21:29:35 |
| review | 3 | 11,859 | 6,206,057 | 315 | 20:27:12 | 20:32:26 |
| triage | 1 | 5,894 | 41,719 | 41 | 21:29:36 | 21:30:17 |
| refute | 1 | 1,139 | 180,466 | 24 | 21:30:19 | 21:30:43 |
| capture | 1 | 153 | 33,959 | 6 | 21:30:44 | 21:30:50 |
| synthesize | 1 | 13,508 | 134,300 | 79 | 21:30:51 | 21:32:10 |

- **claude-sonnet-5-5**: 5 agent · 14 calls · out 20,909 · in 28 · cache_read 428,823 · cache_create 262,826
- **claude-opus-5-5**: 3 agent · 65 calls · out 11,859 · in 130 · cache_read 6,206,057 · cache_create 391,592
- **claude-haiku-5-5**: 14 agent · 77 calls · out 17,040 · in 154 · cache_read 3,127,346 · cache_create 741,872

### S4 round 2 — wf_ded21f80-1be (21 agent, 41,977 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 12,623 | 10 | 255,128 | 80 |
| triage | claude-sonnet-5-5 | 2 | 4,117 | 4 | 40,035 | 31 |
| review:conventions | claude-opus-5-5 | 20 | 3,377 | 40 | 1,804,382 | 234 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,860 | 4 | 5,738 | 552 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,516 | 12 | 172,313 | 858 |
| review:measurement | claude-opus-5-5 | 15 | 2,361 | 30 | 1,184,645 | 200 |
| machine:bash -c 'set -e; for f in tests/scripts/ | claude-haiku-5-5 | 2 | 2,160 | 4 | 5,738 | 375 |
| review:bugs | claude-opus-5-5 | 17 | 1,792 | 34 | 1,475,435 | 225 |
| machine:node tests/scripts/ho-so-da-ky-giu-tuoi. | claude-haiku-5-5 | 2 | 1,787 | 4 | 38,190 | 97 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,576 | 4 | 5,738 | 455 |
| machine:node tests/scripts/ho-so-da-ky-giu-tuoi- | claude-haiku-5-5 | 32 | 1,550 | 64 | 1,785,541 | 3127 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,486 | 4 | 38,165 | 12 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,026 | 4 | 38,165 | 84 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 658 | 4 | 38,221 | 99 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 579 | 4 | 38,174 | 212 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 401 | 4 | 38,166 | 6 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 397 | 4 | 38,191 | 6 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 215 | 4 | 38,502 | 200 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 38,221 | 85 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 5,738 | 541 |
| capture:provenance | claude-sonnet-5-5 | 2 | 146 | 4 | 34,082 | 5 |


wall: 3249s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 215 | 38,502 | 200 | 00:27:22 | 00:30:42 |
| machine | 14 | 17,346 | 2,286,299 | 3129 | 00:27:22 | 01:19:31 |
| review | 3 | 7,530 | 4,464,462 | 234 | 00:27:22 | 00:31:15 |
| triage | 1 | 4,117 | 40,035 | 31 | 01:19:32 | 01:20:02 |
| capture | 1 | 146 | 34,082 | 5 | 01:20:03 | 01:20:09 |
| synthesize | 1 | 12,623 | 255,128 | 80 | 01:20:10 | 01:21:30 |

- **claude-sonnet-5-5**: 4 agent · 11 calls · out 17,101 · in 22 · cache_read 367,747 · cache_create 210,702
- **claude-opus-5-5**: 3 agent · 52 calls · out 7,530 · in 104 · cache_read 4,464,462 · cache_create 377,813
- **claude-haiku-5-5**: 14 agent · 62 calls · out 17,346 · in 124 · cache_read 2,286,299 · cache_create 726,354

