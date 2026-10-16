### S4 round 1 — wf_09a3ee67-7af (20 agent, 20,333 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 7,707 | 4 | 51,486 | 41 |
| triage | claude-sonnet-5-5 | 2 | 4,155 | 4 | 38,051 | 33 |
| review:bugs | claude-opus-5-5 | 24 | 2,051 | 48 | 2,181,721 | 261 |
| review:conventions | claude-opus-5-5 | 25 | 1,887 | 50 | 2,176,323 | 189 |
| refute:SKILL.md | claude-sonnet-5-5 | 4 | 1,022 | 8 | 112,944 | 19 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 831 | 4 | 32,934 | 139 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 457 | 4 | 35,820 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 355 | 4 | 35,795 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 258 | 4 | 35,850 | 82 |
| machine:node tests/scripts/lo-trinh-gio-may.test | claude-haiku-5-5 | 2 | 231 | 4 | 35,808 | 14 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 218 | 4 | 35,794 | 8 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 217 | 4 | 35,794 | 81 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 196 | 4 | 2,869 | 445 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 2,869 | 410 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 172 | 4 | 35,850 | 71 |
| capture:provenance | claude-sonnet-5-5 | 2 | 151 | 4 | 31,710 | 7 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 149 | 4 | 34,940 | 15 |
| review:measurement | claude-opus-5-5 | 9 | 66 | 18 | 519,602 | 126 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 28 | 4 | 2,869 | 398 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 7 | 4 | 2,869 | 475 |


wall: 2259s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 149 | 34,940 | 15 | 14:22:21 | 14:22:35 |
| machine | 12 | 3,145 | 295,121 | 2149 | 14:22:21 | 14:58:09 |
| review | 3 | 4,004 | 4,877,646 | 262 | 14:22:21 | 14:26:43 |
| triage | 1 | 4,155 | 38,051 | 33 | 14:58:12 | 14:58:45 |
| refute | 1 | 1,022 | 112,944 | 19 | 14:58:47 | 14:59:06 |
| capture | 1 | 151 | 31,710 | 7 | 14:59:09 | 14:59:16 |
| synthesize | 1 | 7,707 | 51,486 | 41 | 14:59:18 | 15:00:00 |

- **claude-sonnet-5-5**: 5 agent · 12 calls · out 13,184 · in 24 · cache_read 269,131 · cache_create 231,056
- **claude-opus-5-5**: 3 agent · 58 calls · out 4,004 · in 116 · cache_read 4,877,646 · cache_create 341,816
- **claude-haiku-5-5**: 12 agent · 24 calls · out 3,145 · in 48 · cache_read 295,121 · cache_create 550,638

### S4 round 2 — wf_77b361d8-171 (19 agent, 22,970 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 6,803 | 4 | 47,771 | 42 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,591 | 4 | 2,869 | 452 |
| machine:node tests/scripts/lo-trinh-gio-may.test | claude-haiku-5-5 | 2 | 2,589 | 4 | 35,885 | 20 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,498 | 4 | 2,869 | 379 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,061 | 4 | 2,869 | 438 |
| triage | claude-sonnet-5-5 | 2 | 1,423 | 4 | 35,083 | 13 |
| review:conventions | claude-opus-5-5 | 6 | 1,196 | 12 | 256,068 | 47 |
| review:bugs | claude-opus-5-5 | 13 | 912 | 26 | 731,670 | 94 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 485 | 4 | 35,872 | 6 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 444 | 4 | 35,897 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 410 | 4 | 35,927 | 78 |
| review:measurement | claude-opus-5-5 | 7 | 243 | 14 | 289,278 | 60 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 242 | 4 | 35,880 | 140 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 217 | 4 | 35,871 | 8 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 216 | 4 | 35,871 | 79 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 35,927 | 67 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 171 | 4 | 2,869 | 393 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 149 | 4 | 35,017 | 15 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 31,787 | 6 |


wall: 2148s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 149 | 35,017 | 15 | 15:02:57 | 15:03:12 |
| machine | 12 | 12,097 | 298,606 | 2080 | 15:02:57 | 15:37:37 |
| review | 3 | 2,351 | 1,277,016 | 96 | 15:02:57 | 15:04:33 |
| triage | 1 | 1,423 | 35,083 | 13 | 15:37:40 | 15:37:52 |
| capture | 1 | 147 | 31,787 | 6 | 15:37:55 | 15:38:01 |
| synthesize | 1 | 6,803 | 47,771 | 42 | 15:38:03 | 15:38:45 |

- **claude-sonnet-5-5**: 4 agent · 8 calls · out 8,522 · in 16 · cache_read 149,658 · cache_create 181,320
- **claude-haiku-5-5**: 12 agent · 24 calls · out 12,097 · in 48 · cache_read 298,606 · cache_create 549,344
- **claude-opus-5-5**: 3 agent · 26 calls · out 2,351 · in 52 · cache_read 1,277,016 · cache_create 195,703

