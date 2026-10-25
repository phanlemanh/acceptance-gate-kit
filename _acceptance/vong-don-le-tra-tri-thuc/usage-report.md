### S4 round 1 — wf_2a19691e-209 (20 agent, 81,761 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 16 | 13,520 | 32 | 1,052,011 | 189 |
| review:measurement | claude-opus-5-5 | 13 | 12,564 | 26 | 923,819 | 193 |
| review:conventions | claude-opus-5-5 | 21 | 12,459 | 42 | 1,639,099 | 149 |
| synthesize:report | claude-sonnet-5-5 | 3 | 10,435 | 6 | 100,349 | 62 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,714 | 12 | 126,571 | 901 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,551 | 4 | 3,057 | 527 |
| machine:node tests/scripts/vong-don-le-tra-tri-t | claude-haiku-5-5 | 2 | 3,535 | 4 | 29,378 | 32 |
| triage | claude-sonnet-5-5 | 2 | 3,376 | 4 | 30,528 | 25 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 3,093 | 4 | 29,574 | 18 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,549 | 4 | 3,057 | 406 |
| machine:bash -c 'set -e; node tests/scripts/kho- | claude-haiku-5-5 | 2 | 2,435 | 4 | 29,494 | 97 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,843 | 4 | 29,358 | 94 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 1,779 | 6 | 33,074 | 761 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 1,128 | 4 | 29,384 | 10 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,036 | 4 | 26,310 | 168 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 972 | 4 | 3,057 | 501 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 807 | 4 | 29,414 | 115 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 733 | 4 | 29,358 | 15 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 708 | 4 | 29,359 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 524 | 4 | 25,091 | 8 |


wall: 3634s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,093 | 29,574 | 18 | 01:39:44 | 01:40:03 |
| machine | 13 | 25,790 | 400,871 | 3532 | 01:39:45 | 02:38:37 |
| review | 3 | 38,543 | 3,614,929 | 194 | 01:39:45 | 01:42:59 |
| triage | 1 | 3,376 | 30,528 | 25 | 02:38:39 | 02:39:04 |
| capture | 1 | 524 | 25,091 | 8 | 02:39:06 | 02:39:14 |
| synthesize | 1 | 10,435 | 100,349 | 62 | 02:39:16 | 02:40:19 |

- **claude-opus-5-5**: 3 agent · 50 calls · out 38,543 · in 100 · cache_read 3,614,929 · cache_create 299,743
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 17,428 · in 18 · cache_read 185,542 · cache_create 160,605
- **claude-haiku-5-5**: 13 agent · 31 calls · out 25,790 · in 62 · cache_read 400,871 · cache_create 497,514

### S4 round 2 — wf_6d467406-6d7 (17 agent, 43,373 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 8 | 11,537 | 16 | 414,330 | 79 |
| review:bugs | claude-opus-5-5 | 10 | 5,895 | 20 | 365,187 | 66 |
| review:measurement | claude-opus-5-5 | 10 | 5,834 | 20 | 372,942 | 72 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,800 | 14 | 159,221 | 904 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,190 | 4 | 3,057 | 538 |
| review:conventions | claude-opus-5-5 | 6 | 2,403 | 12 | 185,117 | 43 |
| triage | claude-sonnet-5-5 | 2 | 1,692 | 4 | 28,956 | 13 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,581 | 4 | 29,248 | 90 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,253 | 4 | 26,200 | 166 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 1,028 | 4 | 29,274 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 709 | 4 | 29,304 | 117 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 692 | 4 | 29,304 | 82 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 633 | 4 | 3,057 | 557 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 588 | 4 | 29,248 | 10 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 567 | 4 | 29,249 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 530 | 4 | 3,057 | 414 |
| capture:provenance | claude-sonnet-5-5 | 2 | 441 | 4 | 24,981 | 6 |


wall: 3015s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 11 | 15,571 | 370,219 | 2911 | 03:38:07 | 04:26:38 |
| review | 3 | 14,132 | 923,246 | 73 | 03:38:07 | 03:39:20 |
| triage | 1 | 1,692 | 28,956 | 13 | 04:26:40 | 04:26:53 |
| capture | 1 | 441 | 24,981 | 6 | 04:26:55 | 04:27:01 |
| synthesize | 1 | 11,537 | 414,330 | 79 | 04:27:03 | 04:28:22 |

- **claude-sonnet-5-5**: 3 agent · 12 calls · out 13,670 · in 24 · cache_read 468,267 · cache_create 135,580
- **claude-opus-5-5**: 3 agent · 26 calls · out 14,132 · in 52 · cache_read 923,246 · cache_create 145,256
- **claude-haiku-5-5**: 11 agent · 27 calls · out 15,571 · in 54 · cache_read 370,219 · cache_create 411,538

### S4 round 3 — wf_23c5f79b-4bf (16 agent, 28,490 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 7 | 8,178 | 14 | 315,817 | 75 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 3,287 | 10 | 93,401 | 854 |
| review:bugs | claude-opus-5-5 | 6 | 2,616 | 12 | 173,908 | 35 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,299 | 4 | 3,057 | 382 |
| review:conventions | claude-opus-5-5 | 5 | 1,962 | 10 | 120,323 | 26 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,774 | 4 | 29,238 | 90 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,425 | 4 | 3,057 | 501 |
| review:measurement | claude-opus-5-5 | 4 | 1,410 | 8 | 95,528 | 21 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 1,091 | 4 | 29,264 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 911 | 4 | 29,294 | 112 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 644 | 4 | 3,057 | 543 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 622 | 4 | 29,247 | 159 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 622 | 4 | 29,239 | 6 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 613 | 4 | 29,238 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 597 | 4 | 29,294 | 81 |
| capture:provenance | claude-sonnet-5-5 | 2 | 439 | 4 | 24,971 | 6 |


wall: 2852s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 11 | 13,885 | 307,386 | 2768 | 04:31:15 | 05:17:23 |
| review | 3 | 5,988 | 389,759 | 36 | 04:31:15 | 04:31:51 |
| capture | 1 | 439 | 24,971 | 6 | 05:17:25 | 05:17:31 |
| synthesize | 1 | 8,178 | 315,817 | 75 | 05:17:33 | 05:18:48 |

- **claude-sonnet-5-5**: 2 agent · 9 calls · out 8,617 · in 18 · cache_read 340,788 · cache_create 85,811
- **claude-haiku-5-5**: 11 agent · 25 calls · out 13,885 · in 50 · cache_read 307,386 · cache_create 404,678
- **claude-opus-5-5**: 3 agent · 15 calls · out 5,988 · in 30 · cache_read 389,759 · cache_create 110,666

