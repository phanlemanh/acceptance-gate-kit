### S4 round 1 — wf_36366b6e-b2c (25 agent, 94,011 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| triage | claude-sonnet-5-5 | 2 | 19,525 | 4 | 105,694 | 144 |
| synthesize:report | claude-sonnet-5-5 | 11 | 14,084 | 22 | 1,509,479 | 195 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 10 | 10,842 | 20 | 1,383,074 | 283 |
| review:measurement | claude-opus-5-5 | 26 | 7,373 | 52 | 4,665,377 | 525 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 10 | 5,293 | 20 | 1,459,616 | 334 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,660 | 4 | 133,583 | 268 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,516 | 4 | 34,982 | 463 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,128 | 4 | 34,982 | 342 |
| review:conventions | claude-opus-5-5 | 32 | 3,034 | 64 | 6,570,103 | 444 |
| machine:node tests/scripts/dai-tom-tat.test.mjs | claude-haiku-5-5 | 2 | 2,926 | 4 | 133,581 | 37 |
| machine:node tests/scripts/dai-tom-tat-dem-dung. | claude-haiku-5-5 | 2 | 2,910 | 4 | 133,588 | 48 |
| refute:lo-trinh-du-lieu.md | claude-sonnet-5-5 | 11 | 2,865 | 22 | 1,187,211 | 99 |
| review:bugs | claude-opus-5-5 | 27 | 2,858 | 54 | 4,845,472 | 477 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 9 | 2,606 | 18 | 1,272,990 | 248 |
| refute:dai-tom-tat-dem-dung.test.mjs | claude-sonnet-5-5 | 10 | 2,089 | 20 | 1,164,167 | 89 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,783 | 4 | 133,569 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,771 | 4 | 133,569 | 85 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,317 | 4 | 98,596 | 125 |
| machine:node tests/scripts/dai-tom-tat-sau-kho.m | claude-haiku-5-5 | 2 | 931 | 4 | 133,587 | 49 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 528 | 4 | 133,625 | 83 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 335 | 4 | 133,625 | 74 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 186 | 4 | 101,693 | 48 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 166 | 4 | 133,570 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 144 | 4 | 34,982 | 337 |
| capture:provenance | claude-sonnet-5-5 | 2 | 141 | 4 | 97,371 | 8 |


wall: 2271s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 186 | 101,693 | 48 | 10:05:55 | 10:06:43 |
| machine | 13 | 23,115 | 1,405,839 | 1815 | 10:05:55 | 10:36:10 |
| judge | 3 | 18,741 | 4,115,680 | 338 | 10:05:55 | 10:11:33 |
| review | 3 | 13,265 | 16,080,952 | 527 | 10:05:55 | 10:14:42 |
| triage | 1 | 19,525 | 105,694 | 144 | 10:36:13 | 10:38:37 |
| refute | 2 | 4,954 | 2,351,378 | 99 | 10:38:39 | 10:40:18 |
| capture | 1 | 141 | 97,371 | 8 | 10:40:20 | 10:40:29 |
| synthesize | 1 | 14,084 | 1,509,479 | 195 | 10:40:31 | 10:43:46 |

- **claude-sonnet-5-5**: 9 agent · 67 calls · out 57,631 · in 134 · cache_read 8,281,295 · cache_create 1,283,956
- **claude-opus-5-5**: 3 agent · 85 calls · out 13,265 · in 170 · cache_read 16,080,952 · cache_create 671,522
- **claude-haiku-5-5**: 13 agent · 26 calls · out 23,115 · in 52 · cache_read 1,405,839 · cache_create 1,259,710

### S4 round 2 — wf_68c08703-857 (23 agent, 64,316 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 10 | 13,124 | 20 | 1,381,519 | 267 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 12 | 12,230 | 24 | 1,860,676 | 348 |
| triage | claude-sonnet-5-5 | 2 | 4,493 | 4 | 102,377 | 54 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,647 | 4 | 133,602 | 256 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 9 | 3,376 | 18 | 1,325,297 | 379 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 3,249 | 4 | 34,982 | 343 |
| machine:node tests/scripts/dai-tom-tat-dem-dung. | claude-haiku-5-5 | 2 | 3,052 | 4 | 133,607 | 60 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,949 | 4 | 133,588 | 90 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,396 | 4 | 34,982 | 458 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 13 | 1,906 | 26 | 2,094,270 | 402 |
| review:measurement | claude-opus-5-5 | 18 | 1,876 | 36 | 2,686,964 | 288 |
| refute:lo-trinh-du-lieu.md | claude-sonnet-5-5 | 10 | 1,679 | 20 | 1,060,349 | 108 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,619 | 4 | 133,588 | 13 |
| refute:lo-trinh-du-lieu.md | claude-sonnet-5-5 | 9 | 1,524 | 18 | 939,794 | 81 |
| review:bugs | claude-opus-5-5 | 24 | 1,503 | 48 | 3,624,359 | 261 |
| review:conventions | claude-opus-5-5 | 18 | 1,438 | 36 | 2,430,984 | 194 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,351 | 4 | 98,615 | 122 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,124 | 4 | 133,644 | 81 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 600 | 4 | 133,589 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 483 | 4 | 34,982 | 328 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 410 | 4 | 133,644 | 71 |
| capture:provenance | claude-sonnet-5-5 | 2 | 146 | 4 | 97,390 | 9 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 141 | 4 | 100,638 | 20 |


wall: 2257s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 141 | 100,638 | 20 | 11:48:48 | 11:49:08 |
| machine | 11 | 20,880 | 1,138,823 | 1804 | 11:48:48 | 12:18:52 |
| judge | 3 | 17,512 | 5,280,243 | 402 | 11:48:48 | 11:55:30 |
| review | 3 | 4,817 | 8,742,307 | 290 | 11:48:48 | 11:53:38 |
| triage | 1 | 4,493 | 102,377 | 54 | 12:18:54 | 12:19:49 |
| refute | 2 | 3,203 | 2,000,143 | 113 | 12:19:51 | 12:21:44 |
| capture | 1 | 146 | 97,390 | 9 | 12:21:47 | 12:21:56 |
| synthesize | 1 | 13,124 | 1,381,519 | 267 | 12:21:58 | 12:26:25 |

- **claude-sonnet-5-5**: 9 agent · 69 calls · out 38,619 · in 138 · cache_read 8,962,310 · cache_create 1,343,613
- **claude-haiku-5-5**: 11 agent · 22 calls · out 20,880 · in 44 · cache_read 1,138,823 · cache_create 1,116,479
- **claude-opus-5-5**: 3 agent · 60 calls · out 4,817 · in 120 · cache_read 8,742,307 · cache_create 488,510

### S4 round 3 — wf_b51088ca-77c (20 agent, 81,044 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 5 | 45,169 | 10 | 557,702 | 320 |
| synthesize:report | claude-sonnet-5-5 | 4 | 11,055 | 8 | 399,017 | 111 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,971 | 4 | 34,982 | 360 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,678 | 4 | 133,598 | 283 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,440 | 4 | 34,982 | 503 |
| triage | claude-sonnet-5-5 | 2 | 2,205 | 4 | 99,626 | 21 |
| review:conventions | claude-opus-5-5 | 23 | 2,197 | 46 | 3,032,009 | 225 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,823 | 4 | 133,584 | 14 |
| review:measurement | claude-opus-5-5 | 12 | 1,582 | 24 | 1,486,651 | 110 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 14 | 1,522 | 28 | 2,185,663 | 407 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,483 | 4 | 133,584 | 85 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,369 | 4 | 133,593 | 131 |
| refute:lo-trinh-du-lieu.md | claude-sonnet-5-5 | 13 | 1,265 | 26 | 1,425,553 | 88 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 10 | 1,059 | 20 | 1,307,091 | 851 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 757 | 4 | 133,640 | 90 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 444 | 4 | 133,585 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 384 | 4 | 133,640 | 80 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 329 | 4 | 34,982 | 360 |
| review:bugs | claude-opus-5-5 | 22 | 175 | 44 | 3,122,903 | 326 |
| capture:provenance | claude-sonnet-5-5 | 2 | 137 | 4 | 97,386 | 9 |


wall: 2190s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 10 | 14,678 | 1,040,170 | 1946 | 13:00:41 | 13:33:08 |
| judge | 3 | 47,750 | 4,050,456 | 856 | 13:00:41 | 13:14:58 |
| review | 3 | 3,954 | 7,641,563 | 327 | 13:00:41 | 13:06:09 |
| triage | 1 | 2,205 | 99,626 | 21 | 13:33:10 | 13:33:31 |
| refute | 1 | 1,265 | 1,425,553 | 88 | 13:33:33 | 13:35:01 |
| capture | 1 | 137 | 97,386 | 9 | 13:35:09 | 13:35:18 |
| synthesize | 1 | 11,055 | 399,017 | 111 | 13:35:20 | 13:37:11 |

- **claude-sonnet-5-5**: 7 agent · 50 calls · out 62,412 · in 100 · cache_read 6,072,038 · cache_create 1,228,955
- **claude-haiku-5-5**: 10 agent · 20 calls · out 14,678 · in 40 · cache_read 1,040,170 · cache_create 1,008,866
- **claude-opus-5-5**: 3 agent · 57 calls · out 3,954 · in 114 · cache_read 7,641,563 · cache_create 449,261

