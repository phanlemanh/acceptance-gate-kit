### S4 round 1 — wf_a730088c-5bd (19 agent, 85,274 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 7 | 14,888 | 14 | 396,984 | 226 |
| review:bugs | claude-opus-5-5 | 19 | 14,152 | 38 | 1,275,682 | 305 |
| review:conventions | claude-opus-5-5 | 19 | 13,512 | 38 | 1,446,753 | 678 |
| synthesize:report | claude-sonnet-5-5 | 3 | 11,535 | 6 | 119,660 | 71 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 6,680 | 18 | 330,178 | 980 |
| triage | claude-sonnet-5-5 | 2 | 4,131 | 4 | 39,889 | 41 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,144 | 4 | 3,140 | 419 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 2,253 | 4 | 37,711 | 22 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 2,039 | 4 | 38,525 | 291 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,010 | 4 | 38,409 | 88 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,871 | 4 | 3,140 | 391 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,835 | 4 | 38,409 | 15 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,786 | 4 | 35,278 | 262 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,257 | 4 | 38,465 | 107 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,193 | 4 | 38,465 | 165 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 981 | 4 | 38,410 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 826 | 4 | 38,465 | 76 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 749 | 4 | 38,435 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 432 | 4 | 34,056 | 7 |


wall: 2660s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,253 | 37,711 | 22 | 12:12:29 | 12:12:51 |
| machine | 12 | 24,371 | 679,319 | 2535 | 12:12:29 | 12:54:45 |
| review | 3 | 42,552 | 3,119,419 | 678 | 12:12:29 | 12:23:48 |
| triage | 1 | 4,131 | 39,889 | 41 | 12:54:47 | 12:55:27 |
| capture | 1 | 432 | 34,056 | 7 | 12:55:30 | 12:55:36 |
| synthesize | 1 | 11,535 | 119,660 | 71 | 12:55:38 | 12:56:49 |

- **claude-opus-5-5**: 3 agent · 45 calls · out 42,552 · in 90 · cache_read 3,119,419 · cache_create 292,865
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 18,351 · in 18 · cache_read 231,316 · cache_create 196,344
- **claude-haiku-5-5**: 12 agent · 31 calls · out 24,371 · in 62 · cache_read 679,319 · cache_create 559,748

### S4 round 2 — wf_549b3142-358 (19 agent, 77,417 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 8 | 14,770 | 16 | 454,845 | 119 |
| review:measurement | claude-opus-5-5 | 9 | 13,659 | 18 | 565,369 | 158 |
| review:bugs | claude-opus-5-5 | 18 | 11,631 | 36 | 1,241,537 | 197 |
| review:conventions | claude-opus-5-5 | 14 | 10,822 | 28 | 1,024,761 | 141 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 11 | 6,227 | 22 | 371,670 | 932 |
| triage | claude-sonnet-5-5 | 2 | 3,004 | 4 | 38,921 | 24 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 2,626 | 4 | 38,558 | 230 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 2,443 | 4 | 37,744 | 21 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,402 | 4 | 38,442 | 88 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,901 | 4 | 38,442 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,123 | 4 | 38,498 | 73 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,099 | 4 | 35,311 | 187 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,056 | 4 | 3,140 | 393 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,035 | 4 | 38,498 | 111 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 946 | 4 | 3,140 | 558 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 732 | 4 | 38,468 | 5 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 718 | 4 | 38,443 | 5 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 708 | 4 | 3,140 | 374 |
| capture:provenance | claude-sonnet-5-5 | 2 | 515 | 4 | 34,089 | 10 |


wall: 2918s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,443 | 37,744 | 21 | 14:37:04 | 14:37:25 |
| machine | 12 | 20,573 | 685,750 | 2759 | 14:37:04 | 15:23:03 |
| review | 3 | 36,112 | 2,831,667 | 199 | 14:37:04 | 14:40:23 |
| triage | 1 | 3,004 | 38,921 | 24 | 15:23:05 | 15:23:29 |
| capture | 1 | 515 | 34,089 | 10 | 15:23:31 | 15:23:42 |
| synthesize | 1 | 14,770 | 454,845 | 119 | 15:23:43 | 15:25:42 |

- **claude-sonnet-5-5**: 4 agent · 14 calls · out 20,732 · in 28 · cache_read 565,599 · cache_create 205,191
- **claude-opus-5-5**: 3 agent · 41 calls · out 36,112 · in 82 · cache_read 2,831,667 · cache_create 285,557
- **claude-haiku-5-5**: 12 agent · 33 calls · out 20,573 · in 66 · cache_read 685,750 · cache_create 587,976

### S4 round 3 — wf_47b435d9-491 (19 agent, 72,798 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 23 | 16,851 | 46 | 1,926,948 | 285 |
| review:bugs | claude-opus-5-5 | 22 | 14,110 | 44 | 1,586,022 | 271 |
| synthesize:report | claude-sonnet-5-5 | 4 | 9,516 | 8 | 173,341 | 60 |
| review:measurement | claude-opus-5-5 | 7 | 6,956 | 14 | 359,826 | 142 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 2,842 | 10 | 123,802 | 796 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,732 | 4 | 3,140 | 503 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 2,662 | 4 | 38,563 | 219 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 2,425 | 4 | 37,739 | 19 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,154 | 4 | 38,447 | 88 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,134 | 4 | 3,140 | 336 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,919 | 4 | 38,447 | 11 |
| triage | claude-sonnet-5-5 | 2 | 1,738 | 4 | 37,510 | 21 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,285 | 4 | 35,316 | 176 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,240 | 4 | 38,503 | 109 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,154 | 4 | 38,503 | 72 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 920 | 4 | 38,448 | 11 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 891 | 4 | 38,473 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 749 | 4 | 3,140 | 543 |
| capture:provenance | claude-sonnet-5-5 | 2 | 520 | 4 | 34,094 | 7 |


wall: 2757s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 2,425 | 37,739 | 19 | 16:49:03 | 16:49:22 |
| machine | 12 | 20,682 | 437,922 | 2666 | 16:49:03 | 17:33:30 |
| review | 3 | 37,917 | 3,872,796 | 285 | 16:49:03 | 16:53:49 |
| triage | 1 | 1,738 | 37,510 | 21 | 17:33:31 | 17:33:51 |
| capture | 1 | 520 | 34,094 | 7 | 17:33:52 | 17:33:59 |
| synthesize | 1 | 9,516 | 173,341 | 60 | 17:34:00 | 17:35:00 |

- **claude-opus-5-5**: 3 agent · 52 calls · out 37,917 · in 104 · cache_read 3,872,796 · cache_create 297,608
- **claude-sonnet-5-5**: 4 agent · 10 calls · out 14,199 · in 20 · cache_read 282,684 · cache_create 195,582
- **claude-haiku-5-5**: 12 agent · 27 calls · out 20,682 · in 54 · cache_read 437,922 · cache_create 585,492

