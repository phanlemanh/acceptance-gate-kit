### S4 round 1 — wf_d2a2fad9-e84 (21 agent, 34,908 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 8,965 | 6 | 113,233 | 53 |
| triage | claude-sonnet-5-5 | 2 | 4,017 | 4 | 37,170 | 30 |
| review:measurement | claude-opus-5-5 | 10 | 3,140 | 20 | 624,681 | 145 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,819 | 4 | 5,946 | 516 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,512 | 12 | 160,286 | 827 |
| review:bugs | claude-opus-5-5 | 23 | 2,465 | 46 | 1,771,818 | 448 |
| machine:node tests/scripts/moi-cong-khong-qua-nu | claude-haiku-5-5 | 2 | 2,441 | 4 | 35,537 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,801 | 4 | 35,533 | 297 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,484 | 4 | 35,519 | 85 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,303 | 4 | 35,640 | 258 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 638 | 4 | 35,575 | 79 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 584 | 4 | 35,528 | 260 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 578 | 4 | 35,545 | 7 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 555 | 4 | 35,520 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 416 | 4 | 35,575 | 112 |
| review:conventions | claude-opus-5-5 | 17 | 372 | 34 | 1,332,714 | 357 |
| machine:bash -c 'set -o pipefail; ONLY_BLOCK=P18 | claude-haiku-5-5 | 2 | 180 | 4 | 35,566 | 17 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 177 | 4 | 35,628 | 212 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 2,973 | 527 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 31,333 | 5 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 138 | 4 | 35,519 | 8 |


wall: 2842s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 177 | 35,628 | 212 | 16:17:43 | 16:21:15 |
| machine | 14 | 15,622 | 560,262 | 2748 | 16:17:43 | 17:03:31 |
| review | 3 | 5,977 | 3,729,213 | 449 | 16:17:43 | 16:25:12 |
| triage | 1 | 4,017 | 37,170 | 30 | 17:03:33 | 17:04:03 |
| capture | 1 | 150 | 31,333 | 5 | 17:04:05 | 17:04:10 |
| synthesize | 1 | 8,965 | 113,233 | 53 | 17:04:12 | 17:05:05 |

- **claude-sonnet-5-5**: 4 agent · 9 calls · out 13,309 · in 18 · cache_read 217,364 · cache_create 187,401
- **claude-opus-5-5**: 3 agent · 50 calls · out 5,977 · in 100 · cache_read 3,729,213 · cache_create 301,746
- **claude-haiku-5-5**: 14 agent · 32 calls · out 15,622 · in 64 · cache_read 560,262 · cache_create 579,318

### S4 round 2 — wf_269f15eb-7f3 (21 agent, 26,079 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 8,502 | 8 | 172,106 | 54 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,734 | 4 | 2,973 | 473 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 2,620 | 18 | 278,636 | 918 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,096 | 4 | 35,593 | 284 |
| review:bugs | claude-opus-5-5 | 9 | 1,558 | 18 | 358,618 | 864 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,508 | 4 | 35,579 | 87 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,444 | 4 | 35,579 | 12 |
| triage | claude-sonnet-5-5 | 2 | 1,191 | 4 | 34,207 | 10 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 774 | 4 | 5,946 | 371 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 602 | 4 | 0 | 359 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 569 | 4 | 35,605 | 7 |
| machine:bash -c 'set -o pipefail; ONLY_BLOCK=P18 | claude-haiku-5-5 | 2 | 435 | 4 | 35,626 | 18 |
| review:measurement | claude-opus-5-5 | 8 | 421 | 16 | 293,212 | 382 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 330 | 4 | 35,635 | 75 |
| review:conventions | claude-opus-5-5 | 7 | 279 | 14 | 260,760 | 816 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 263 | 4 | 35,635 | 88 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 215 | 4 | 35,580 | 7 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 177 | 4 | 35,656 | 280 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 174 | 4 | 2,973 | 499 |
| capture:provenance | claude-sonnet-5-5 | 2 | 157 | 4 | 31,393 | 5 |
| machine:node tests/scripts/moi-cong-khong-qua-nu | claude-haiku-5-5 | 2 | 30 | 4 | 35,597 | 10 |


wall: 2909s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 177 | 35,656 | 280 | 17:25:48 | 17:30:28 |
| machine | 14 | 13,794 | 610,957 | 2833 | 17:25:48 | 18:13:01 |
| review | 3 | 2,258 | 912,590 | 866 | 17:25:48 | 17:40:13 |
| triage | 1 | 1,191 | 34,207 | 10 | 18:13:03 | 18:13:13 |
| capture | 1 | 157 | 31,393 | 5 | 18:13:16 | 18:13:21 |
| synthesize | 1 | 8,502 | 172,106 | 54 | 18:13:23 | 18:14:17 |

- **claude-sonnet-5-5**: 4 agent · 10 calls · out 10,027 · in 20 · cache_read 273,362 · cache_create 191,457
- **claude-haiku-5-5**: 14 agent · 35 calls · out 13,794 · in 70 · cache_read 610,957 · cache_create 651,870
- **claude-opus-5-5**: 3 agent · 24 calls · out 2,258 · in 48 · cache_read 912,590 · cache_create 261,805

### S4 round 3 — wf_36ddef78-b73 (19 agent, 18,874 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 6,943 | 10 | 232,108 | 50 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,434 | 12 | 155,089 | 880 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,799 | 4 | 5,946 | 334 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,489 | 4 | 35,658 | 84 |
| review:measurement | claude-opus-5-5 | 6 | 1,004 | 12 | 203,322 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 816 | 4 | 32,694 | 213 |
| machine:bash -c 'set -o pipefail; ONLY_BLOCK=P18 | claude-haiku-5-5 | 2 | 772 | 4 | 35,705 | 16 |
| review:conventions | claude-opus-5-5 | 9 | 630 | 18 | 360,966 | 49 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 471 | 4 | 35,659 | 7 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 418 | 4 | 35,684 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 401 | 4 | 35,714 | 94 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 320 | 4 | 35,714 | 83 |
| review:bugs | claude-opus-5-5 | 5 | 266 | 10 | 158,858 | 24 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 240 | 4 | 35,658 | 9 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 217 | 4 | 35,776 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 196 | 4 | 5,946 | 520 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 5,946 | 534 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 31,472 | 6 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 135 | 4 | 35,383 | 25 |


wall: 2845s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 135 | 35,383 | 25 | 23:13:54 | 23:14:19 |
| machine | 13 | 9,748 | 491,189 | 2785 | 23:13:54 | 00:00:19 |
| review | 3 | 1,900 | 723,146 | 49 | 23:13:54 | 23:14:43 |
| capture | 1 | 148 | 31,472 | 6 | 00:00:22 | 00:00:28 |
| synthesize | 1 | 6,943 | 232,108 | 50 | 00:00:30 | 00:01:20 |

- **claude-sonnet-5-5**: 3 agent · 9 calls · out 7,226 · in 18 · cache_read 298,963 · cache_create 146,533
- **claude-haiku-5-5**: 13 agent · 30 calls · out 9,748 · in 60 · cache_read 491,189 · cache_create 576,754
- **claude-opus-5-5**: 3 agent · 20 calls · out 1,900 · in 40 · cache_read 723,146 · cache_create 144,548

