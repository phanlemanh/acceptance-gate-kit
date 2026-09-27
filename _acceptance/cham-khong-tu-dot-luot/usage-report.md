### S3 — wf_6fbecf75-923 (3 agent, 12,348 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| exec:Lan B | claude-opus-5-5 | 81 | 5,856 | 162 | 13,308,778 | 1580 |
| exec:Lan A | claude-opus-5-5 | 81 | 4,116 | 162 | 13,368,764 | 872 |
| exec:Lan C | claude-opus-5-5 | 32 | 2,376 | 64 | 3,959,114 | 431 |


wall: 1580s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| exec | 3 | 12,348 | 30,636,656 | 1580 | 08:05:04 | 08:31:24 |

- **claude-opus-5-5**: 3 agent · 194 calls · out 12,348 · in 388 · cache_read 30,636,656 · cache_create 572,481

### S4 round 1 — wf_7f37a0d5-d80 (21 agent, 49,955 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 18,842 | 4 | 118,323 | 191 |
| triage | claude-sonnet-5 | 2 | 8,256 | 4 | 102,714 | 111 |
| review:measurement | claude-opus-5-5 | 19 | 2,362 | 38 | 2,728,290 | 212 |
| judge:E10:spec-alignment | claude-sonnet-5 | 2 | 2,197 | 4 | 134,595 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,017 | 18 | 97,378 | 131 |
| judge:E10:operational-feasibility | claude-sonnet-5 | 2 | 1,800 | 4 | 134,597 | 25 |
| judge:E10:domain-correctness | claude-sonnet-5 | 2 | 1,780 | 4 | 98,456 | 25 |
| review:bugs | claude-opus-5-5 | 37 | 1,708 | 74 | 5,606,396 | 333 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,507 | 18 | 97,378 | 162 |
| review:conventions | claude-opus-5-5 | 24 | 1,480 | 48 | 3,136,566 | 184 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,322 | 18 | 97,378 | 193 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,271 | 18 | 97,365 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 9 | 1,172 | 74 | 610,437 | 172 |
| baseline:diffBase | claude-sonnet-5 | 7 | 1,072 | 14 | 633,540 | 64 |
| machine:bash -c 'out=$(for f in ckdl-cham ckdl-t | claude-haiku-4-5-20251001 | 2 | 744 | 18 | 70,547 | 23 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 642 | 18 | 97,365 | 19 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 562 | 18 | 97,414 | 96 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 400 | 18 | 97,372 | 13 |
| capture:provenance | claude-sonnet-5 | 2 | 329 | 4 | 97,528 | 16 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 279 | 18 | 97,414 | 81 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 213 | 18 | 97,414 | 225 |


wall: 1457s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,072 | 633,540 | 64 | 09:00:20 | 09:01:23 |
| machine | 11 | 10,129 | 1,557,462 | 1135 | 09:00:20 | 09:19:14 |
| judge | 3 | 5,777 | 367,648 | 31 | 09:00:20 | 09:00:51 |
| review | 3 | 5,550 | 11,471,252 | 335 | 09:00:20 | 09:05:54 |
| triage | 1 | 8,256 | 102,714 | 111 | 09:19:16 | 09:21:07 |
| capture | 1 | 329 | 97,528 | 16 | 09:21:08 | 09:21:24 |
| synthesize | 1 | 18,842 | 118,323 | 191 | 09:21:25 | 09:24:36 |

- **claude-sonnet-5**: 7 agent · 19 calls · out 34,276 · in 38 · cache_read 1,319,753 · cache_create 827,277
- **claude-opus-5-5**: 3 agent · 80 calls · out 5,550 · in 160 · cache_read 11,471,252 · cache_create 472,642
- **claude-haiku-4-5-20251001**: 11 agent · 29 calls · out 10,129 · in 254 · cache_read 1,557,462 · cache_create 592,130

### S4 round 2 — wf_a7ba759f-761 (23 agent, 62,479 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 3 | 19,058 | 6 | 248,503 | 276 |
| triage | claude-sonnet-5 | 2 | 14,438 | 4 | 103,478 | 174 |
| review:conventions | claude-opus-5-5 | 25 | 3,546 | 50 | 3,663,747 | 259 |
| review:bugs | claude-opus-5-5 | 32 | 2,143 | 64 | 5,180,865 | 292 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,092 | 18 | 97,505 | 130 |
| judge:E10:spec-alignment | claude-sonnet-5 | 2 | 2,074 | 4 | 134,643 | 28 |
| review:measurement | claude-opus-5-5 | 13 | 2,055 | 26 | 1,735,619 | 157 |
| judge:E10:operational-feasibility | claude-sonnet-5 | 2 | 1,982 | 4 | 134,645 | 26 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,850 | 18 | 97,505 | 198 |
| refute:gate-card.js | claude-sonnet-5 | 14 | 1,587 | 28 | 1,593,428 | 158 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,451 | 18 | 97,492 | 31 |
| baseline:diffBase | claude-sonnet-5 | 6 | 1,442 | 12 | 526,788 | 59 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,396 | 18 | 97,505 | 164 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,328 | 18 | 97,492 | 26 |
| machine:bash -c 'out=$(for f in ckdl-cham ckdl-t | claude-haiku-4-5-20251001 | 2 | 1,266 | 18 | 97,836 | 27 |
| refute:gate-card.js | claude-sonnet-5 | 9 | 1,015 | 18 | 992,006 | 68 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 927 | 18 | 70,307 | 136 |
| capture:provenance | claude-sonnet-5 | 2 | 877 | 4 | 97,576 | 20 |
| judge:E10:domain-correctness | claude-sonnet-5 | 2 | 461 | 4 | 98,504 | 20 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 457 | 18 | 97,541 | 96 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 369 | 18 | 97,541 | 86 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 365 | 18 | 97,499 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 300 | 18 | 97,541 | 245 |


wall: 1773s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,442 | 526,788 | 59 | 09:37:36 | 09:38:35 |
| machine | 11 | 11,801 | 1,045,764 | 1140 | 09:37:36 | 09:56:36 |
| judge | 3 | 4,517 | 367,792 | 31 | 09:37:36 | 09:38:07 |
| review | 3 | 7,744 | 10,580,231 | 294 | 09:37:36 | 09:42:30 |
| triage | 1 | 14,438 | 103,478 | 174 | 09:56:37 | 09:59:31 |
| refute | 2 | 2,602 | 2,585,434 | 158 | 09:59:33 | 10:02:11 |
| capture | 1 | 877 | 97,576 | 20 | 10:02:12 | 10:02:32 |
| synthesize | 1 | 19,058 | 248,503 | 276 | 10:02:34 | 10:07:09 |

- **claude-sonnet-5**: 9 agent · 42 calls · out 42,934 · in 84 · cache_read 3,929,571 · cache_create 1,072,265
- **claude-opus-5-5**: 3 agent · 70 calls · out 7,744 · in 140 · cache_read 10,580,231 · cache_create 509,307
- **claude-haiku-4-5-20251001**: 11 agent · 22 calls · out 11,801 · in 198 · cache_read 1,045,764 · cache_create 567,677

