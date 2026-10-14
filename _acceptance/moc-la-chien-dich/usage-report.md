### S4 round 1 — wf_5790954a-91e (23 agent, 41,402 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 12,739 | 8 | 190,937 | 85 |
| triage | claude-sonnet-5-5 | 2 | 4,937 | 4 | 38,223 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,831 | 4 | 2,869 | 450 |
| machine:node tests/scripts/moc-chien-dich.test.m | claude-haiku-5-5 | 2 | 2,819 | 4 | 35,395 | 22 |
| review:conventions | claude-opus-5-5 | 35 | 2,721 | 70 | 3,728,796 | 884 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,589 | 4 | 2,869 | 401 |
| review:bugs | claude-opus-5-5 | 27 | 2,552 | 54 | 2,469,605 | 207 |
| review:measurement | claude-opus-5-5 | 9 | 1,717 | 18 | 614,407 | 120 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,598 | 4 | 2,869 | 371 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,515 | 4 | 35,385 | 84 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 873 | 4 | 35,441 | 84 |
| machine:LT_CASES=LT-97,LT-97-do,LT-97-do2 node t | claude-haiku-5-5 | 2 | 872 | 4 | 35,429 | 16 |
| machine:node tests/scripts/moc-chien-dich-crm.mj | claude-haiku-5-5 | 2 | 627 | 4 | 35,398 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 585 | 4 | 35,394 | 139 |
| refute:evals.yaml | claude-sonnet-5-5 | 3 | 515 | 6 | 71,421 | 12 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 419 | 4 | 35,411 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 378 | 4 | 35,441 | 73 |
| refute:evals.yaml | claude-sonnet-5-5 | 3 | 367 | 6 | 67,413 | 13 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 203 | 4 | 36,134 | 29 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 184 | 4 | 35,385 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 2,869 | 390 |
| capture:provenance | claude-sonnet-5-5 | 2 | 156 | 4 | 31,305 | 10 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 32 | 4 | 32,517 | 5 |


wall: 2187s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 203 | 36,134 | 29 | 09:27:40 | 09:28:08 |
| machine | 14 | 15,495 | 362,672 | 2036 | 09:27:40 | 10:01:36 |
| review | 3 | 6,990 | 6,812,808 | 884 | 09:27:40 | 09:42:24 |
| triage | 1 | 4,937 | 38,223 | 36 | 10:01:38 | 10:02:13 |
| refute | 2 | 882 | 138,834 | 15 | 10:02:15 | 10:02:30 |
| capture | 1 | 156 | 31,305 | 10 | 10:02:31 | 10:02:41 |
| synthesize | 1 | 12,739 | 190,937 | 85 | 10:02:42 | 10:04:07 |

- **claude-sonnet-5-5**: 6 agent · 16 calls · out 18,917 · in 32 · cache_read 435,433 · cache_create 269,095
- **claude-haiku-5-5**: 14 agent · 28 calls · out 15,495 · in 56 · cache_read 362,672 · cache_create 613,147
- **claude-opus-5-5**: 3 agent · 71 calls · out 6,990 · in 142 · cache_read 6,812,808 · cache_create 521,468

### S4 round 2 — wf_07d6d6d6-f17 (20 agent, 36,415 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 11,635 | 10 | 243,262 | 79 |
| review:measurement | claude-opus-5-5 | 12 | 3,304 | 24 | 807,455 | 131 |
| triage | claude-sonnet-5-5 | 2 | 3,256 | 4 | 36,889 | 25 |
| machine:node tests/scripts/moc-chien-dich.test.m | claude-haiku-5-5 | 2 | 2,972 | 4 | 35,402 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,781 | 4 | 2,869 | 392 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,320 | 4 | 2,869 | 373 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,267 | 4 | 2,869 | 443 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,855 | 4 | 35,392 | 85 |
| review:conventions | claude-opus-5-5 | 12 | 1,554 | 24 | 583,719 | 93 |
| refute:moc-chien-dich.test.mjs | claude-sonnet-5-5 | 5 | 915 | 10 | 161,432 | 26 |
| review:bugs | claude-opus-5-5 | 14 | 898 | 28 | 777,643 | 189 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 514 | 4 | 32,532 | 143 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 484 | 4 | 35,448 | 83 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 451 | 4 | 35,418 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 326 | 4 | 2,869 | 390 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 217 | 4 | 35,393 | 5 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 191 | 4 | 35,392 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 35,448 | 70 |
| capture:provenance | claude-sonnet-5-5 | 2 | 154 | 4 | 31,312 | 7 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 146 | 4 | 34,532 | 16 |


wall: 2167s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 146 | 34,532 | 16 | 10:16:54 | 10:17:10 |
| machine | 12 | 14,553 | 291,901 | 2021 | 10:16:54 | 10:50:35 |
| review | 3 | 5,756 | 2,168,817 | 190 | 10:16:54 | 10:20:04 |
| triage | 1 | 3,256 | 36,889 | 25 | 10:50:37 | 10:51:03 |
| refute | 1 | 915 | 161,432 | 26 | 10:51:05 | 10:51:30 |
| capture | 1 | 154 | 31,312 | 7 | 10:51:33 | 10:51:40 |
| synthesize | 1 | 11,635 | 243,262 | 79 | 10:51:42 | 10:53:01 |

- **claude-sonnet-5-5**: 5 agent · 16 calls · out 16,106 · in 32 · cache_read 507,427 · cache_create 243,801
- **claude-opus-5-5**: 3 agent · 38 calls · out 5,756 · in 76 · cache_read 2,168,817 · cache_create 230,946
- **claude-haiku-5-5**: 12 agent · 24 calls · out 14,553 · in 48 · cache_read 291,901 · cache_create 544,955

### S4 round 3 — wf_149f00ce-104 (20 agent, 25,918 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 6 | 7,328 | 12 | 291,918 | 51 |
| machine:node tests/scripts/moc-chien-dich.test.m | claude-haiku-5-5 | 2 | 3,024 | 4 | 35,662 | 25 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,890 | 4 | 2,869 | 396 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,460 | 4 | 2,869 | 455 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,337 | 4 | 2,869 | 381 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,645 | 4 | 35,652 | 86 |
| triage | claude-sonnet-5-5 | 2 | 1,460 | 4 | 34,687 | 13 |
| review:conventions | claude-opus-5-5 | 11 | 1,063 | 22 | 524,114 | 56 |
| review:bugs | claude-opus-5-5 | 12 | 863 | 24 | 554,251 | 63 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 457 | 4 | 35,708 | 86 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 410 | 4 | 35,678 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 370 | 4 | 35,708 | 76 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 338 | 4 | 35,661 | 146 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 294 | 4 | 32,784 | 6 |
| review:measurement | claude-opus-5-5 | 5 | 283 | 10 | 166,936 | 32 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 188 | 4 | 35,652 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 173 | 4 | 2,869 | 406 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 168 | 4 | 35,862 | 21 |
| capture:provenance | claude-sonnet-5-5 | 2 | 146 | 4 | 31,572 | 6 |
| machine:node --test --test-name-pattern=DP2-11 t | claude-haiku-5-5 | 2 | 21 | 4 | 35,679 | 8 |


wall: 2154s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 168 | 35,862 | 21 | 12:27:26 | 12:27:48 |
| machine | 13 | 14,607 | 329,660 | 2077 | 12:27:26 | 13:02:03 |
| review | 3 | 2,209 | 1,245,301 | 64 | 12:27:26 | 12:28:30 |
| triage | 1 | 1,460 | 34,687 | 13 | 13:02:06 | 13:02:19 |
| capture | 1 | 146 | 31,572 | 6 | 13:02:21 | 13:02:27 |
| synthesize | 1 | 7,328 | 291,918 | 51 | 13:02:29 | 13:03:20 |

- **claude-sonnet-5-5**: 4 agent · 12 calls · out 9,102 · in 24 · cache_read 394,039 · cache_create 183,015
- **claude-haiku-5-5**: 13 agent · 26 calls · out 14,607 · in 52 · cache_read 329,660 · cache_create 573,459
- **claude-opus-5-5**: 3 agent · 28 calls · out 2,209 · in 56 · cache_read 1,245,301 · cache_create 170,134

