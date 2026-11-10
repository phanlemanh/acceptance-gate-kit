### S4 round 1 — wf_83918914-405 (29 agent, 93,860 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 7 | 16,407 | 14 | 291,896 | 251 |
| review:measurement | claude-opus-5-5 | 6 | 15,592 | 12 | 248,755 | 247 |
| review:conventions | claude-opus-5-5 | 8 | 14,434 | 16 | 432,883 | 141 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,768 | 4 | 27,020 | 46 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 15 | 7,726 | 30 | 266,580 | 1433 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 7,637 | 6 | 51,998 | 287 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,617 | 4 | 3,305 | 589 |
| triage | claude-sonnet-5-5 | 2 | 2,074 | 4 | 15,288 | 17 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,902 | 4 | 14,945 | 95 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,795 | 4 | 3,305 | 540 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,744 | 4 | 14,945 | 12 |
| machine:bash -c 'set -e; bash _acceptance/t3-can | claude-haiku-5-5 | 2 | 1,204 | 4 | 15,353 | 104 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,192 | 4 | 14,954 | 308 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,189 | 4 | 15,001 | 143 |
| refute:config.yaml | claude-sonnet-5-5 | 3 | 1,151 | 8 | 25,381 | 15 |
| refute:config.yaml | claude-sonnet-5-5 | 4 | 945 | 8 | 46,232 | 15 |
| machine:bash _acceptance/t3-can-ho-so-arm/rang/c | claude-haiku-5-5 | 2 | 873 | 4 | 14,996 | 19 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 766 | 4 | 15,001 | 271 |
| machine:bash _acceptance/t3-can-ho-so-arm/rang/c | claude-haiku-5-5 | 2 | 726 | 4 | 14,996 | 22 |
| machine:bash _acceptance/t3-can-ho-so-arm/rang/c | claude-haiku-5-5 | 2 | 716 | 4 | 14,988 | 15 |
| refute:config.yaml | claude-sonnet-5-5 | 3 | 686 | 6 | 29,225 | 11 |
| machine:bash _acceptance/t3-can-ho-so-arm/rang/c | claude-haiku-5-5 | 2 | 683 | 4 | 14,981 | 12 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 655 | 4 | 14,971 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 645 | 4 | 14,946 | 6 |
| machine:bash _acceptance/t3-can-ho-so-arm/rang/c | claude-haiku-5-5 | 2 | 644 | 4 | 14,981 | 13 |
| machine:node _acceptance/t3-can-ho-so-arm/rang/v | claude-haiku-5-5 | 2 | 629 | 4 | 6,610 | 349 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 576 | 4 | 15,001 | 104 |
| machine:bash _acceptance/t3-can-ho-so-arm/rang/c | claude-haiku-5-5 | 2 | 516 | 4 | 14,986 | 12 |
| capture:provenance | claude-sonnet-5-5 | 2 | 368 | 4 | 10,430 | 7 |


wall: 3596s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,637 | 51,998 | 287 | 09:36:23 | 09:41:11 |
| machine | 19 | 26,798 | 504,845 | 3507 | 09:36:23 | 10:34:51 |
| review | 3 | 46,433 | 973,534 | 261 | 09:36:23 | 09:40:45 |
| triage | 1 | 2,074 | 15,288 | 17 | 10:34:51 | 10:35:08 |
| refute | 3 | 2,782 | 100,838 | 18 | 10:35:08 | 10:35:26 |
| capture | 1 | 368 | 10,430 | 7 | 10:35:26 | 10:35:33 |
| synthesize | 1 | 7,768 | 27,020 | 46 | 10:35:33 | 10:36:19 |

- **claude-opus-5-5**: 3 agent · 21 calls · out 46,433 · in 42 · cache_read 973,534 · cache_create 261,872
- **claude-sonnet-5-5**: 7 agent · 19 calls · out 20,629 · in 40 · cache_read 205,574 · cache_create 141,104
- **claude-haiku-5-5**: 19 agent · 51 calls · out 26,798 · in 102 · cache_read 504,845 · cache_create 276,413

### S4 round 2 (BLOCKED) — wf_378517da-c50 (25 agent, 72,757 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 5 | 18,885 | 10 | 149,696 | 234 |
| review:bugs | claude-opus-5-5 | 6 | 11,090 | 12 | 192,124 | 210 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 6,999 | 6 | 45,192 | 76 |
| synthesize:report | claude-sonnet-5-5 | 2 | 6,022 | 4 | 24,386 | 39 |
| review:conventions | claude-opus-5-5 | 7 | 5,325 | 14 | 250,610 | 102 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,630 | 4 | 3,305 | 470 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 2,619 | 8 | 18,117 | 4361 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 5 | 1,881 | 10 | 48,115 | 719 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,867 | 4 | 3,305 | 475 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,827 | 4 | 14,146 | 96 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,725 | 4 | 14,146 | 12 |
| machine:bash -c 'set -e; bash _acceptance/t3-can | claude-haiku-5-5 | 2 | 1,635 | 4 | 14,540 | 56 |
| triage | claude-sonnet-5-5 | 2 | 1,348 | 4 | 12,917 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,221 | 4 | 10,850 | 178 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 990 | 4 | 14,202 | 89 |
| machine:bash _acceptance/t3-can-ho-so-arm/rang/c | claude-haiku-5-5 | 2 | 850 | 4 | 14,182 | 10 |
| machine:bash _acceptance/t3-can-ho-so-arm/rang/c | claude-haiku-5-5 | 2 | 800 | 4 | 14,197 | 14 |
| machine:bash _acceptance/t3-can-ho-so-arm/rang/c | claude-haiku-5-5 | 2 | 753 | 4 | 14,182 | 9 |
| machine:bash _acceptance/t3-can-ho-so-arm/rang/c | claude-haiku-5-5 | 2 | 720 | 4 | 14,187 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 701 | 4 | 14,202 | 123 |
| machine:bash _acceptance/t3-can-ho-so-arm/rang/c | claude-haiku-5-5 | 2 | 677 | 4 | 14,189 | 10 |
| machine:bash _acceptance/t3-can-ho-so-arm/rang/c | claude-haiku-5-5 | 2 | 671 | 4 | 14,197 | 12 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 564 | 4 | 14,147 | 7 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 501 | 4 | 14,172 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 456 | 4 | 9,631 | 8 |


wall: 6599s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 6,999 | 45,192 | 76 | 11:09:25 | 11:10:41 |
| machine | 18 | 22,632 | 268,381 | 6536 | 11:09:25 | 12:58:20 |
| review | 3 | 35,300 | 592,430 | 235 | 11:09:25 | 11:13:20 |
| triage | 1 | 1,348 | 12,917 | 16 | 12:58:20 | 12:58:36 |
| capture | 1 | 456 | 9,631 | 8 | 12:58:36 | 12:58:44 |
| synthesize | 1 | 6,022 | 24,386 | 39 | 12:58:44 | 12:59:24 |

- **claude-opus-5-5**: 3 agent · 18 calls · out 35,300 · in 36 · cache_read 592,430 · cache_create 187,566
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 14,825 · in 18 · cache_read 92,126 · cache_create 94,226
- **claude-haiku-5-5**: 18 agent · 41 calls · out 22,632 · in 82 · cache_read 268,381 · cache_create 260,869

