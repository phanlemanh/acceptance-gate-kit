### S4 round 1 — wf_f17ac234-8ea (20 agent, 29,830 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 8,961 | 8 | 157,837 | 51 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 3,064 | 14 | 201,522 | 850 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 2,628 | 14 | 193,052 | 910 |
| review:measurement | claude-opus-5-5 | 5 | 2,432 | 10 | 200,004 | 76 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,347 | 4 | 35,259 | 195 |
| triage | claude-sonnet-5-5 | 2 | 1,958 | 4 | 34,476 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,535 | 4 | 35,245 | 11 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,514 | 4 | 35,245 | 87 |
| refute:on-dinh-r2.test.mjs | claude-sonnet-5-5 | 4 | 1,233 | 8 | 108,931 | 20 |
| review:conventions | claude-opus-5-5 | 20 | 834 | 40 | 1,268,589 | 170 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 601 | 4 | 35,301 | 74 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 574 | 4 | 35,363 | 117 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 462 | 4 | 35,246 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 457 | 4 | 35,301 | 121 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 344 | 4 | 2,869 | 344 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 245 | 4 | 32,385 | 268 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 204 | 4 | 35,271 | 5 |
| review:bugs | claude-opus-5-5 | 13 | 163 | 26 | 745,945 | 110 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 31,164 | 6 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 124 | 4 | 34,366 | 113 |


wall: 2995s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 124 | 34,366 | 113 | 09:32:43 | 09:34:35 |
| machine | 12 | 13,975 | 712,059 | 2892 | 09:32:43 | 10:20:55 |
| review | 3 | 3,429 | 2,214,538 | 170 | 09:32:43 | 09:35:33 |
| triage | 1 | 1,958 | 34,476 | 15 | 10:20:57 | 10:21:13 |
| refute | 1 | 1,233 | 108,931 | 20 | 10:21:16 | 10:21:36 |
| capture | 1 | 150 | 31,164 | 6 | 10:21:38 | 10:21:44 |
| synthesize | 1 | 8,961 | 157,837 | 51 | 10:21:46 | 10:22:38 |

- **claude-sonnet-5-5**: 5 agent · 14 calls · out 12,426 · in 28 · cache_read 366,774 · cache_create 218,695
- **claude-haiku-5-5**: 12 agent · 34 calls · out 13,975 · in 68 · cache_read 712,059 · cache_create 522,769
- **claude-opus-5-5**: 3 agent · 38 calls · out 3,429 · in 76 · cache_read 2,214,538 · cache_create 224,556

### S4 round 2 — wf_82de3c81-87a (18 agent, 23,931 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 5 | 7,361 | 10 | 217,067 | 52 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,824 | 12 | 152,294 | 830 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,469 | 12 | 153,767 | 786 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,825 | 4 | 35,172 | 86 |
| review:conventions | claude-opus-5-5 | 17 | 1,707 | 34 | 893,355 | 84 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,575 | 4 | 35,172 | 10 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,321 | 4 | 35,290 | 95 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,053 | 4 | 35,181 | 235 |
| triage | claude-sonnet-5-5 | 2 | 985 | 4 | 33,565 | 9 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 449 | 4 | 35,228 | 122 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 448 | 4 | 35,198 | 4 |
| review:measurement | claude-opus-5-5 | 7 | 344 | 14 | 322,390 | 70 |
| review:bugs | claude-opus-5-5 | 12 | 343 | 24 | 635,337 | 110 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 342 | 4 | 35,228 | 71 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 323 | 4 | 2,869 | 340 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 212 | 4 | 35,173 | 4 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 203 | 4 | 35,186 | 291 |
| capture:provenance | claude-sonnet-5-5 | 2 | 147 | 4 | 31,091 | 6 |


wall: 2888s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 12 | 13,044 | 625,758 | 2813 | 11:20:08 | 12:07:01 |
| review | 3 | 2,394 | 1,851,082 | 111 | 11:20:08 | 11:21:58 |
| triage | 1 | 985 | 33,565 | 9 | 12:07:03 | 12:07:12 |
| capture | 1 | 147 | 31,091 | 6 | 12:07:15 | 12:07:21 |
| synthesize | 1 | 7,361 | 217,067 | 52 | 12:07:23 | 12:08:15 |

- **claude-sonnet-5-5**: 3 agent · 9 calls · out 8,493 · in 18 · cache_read 281,723 · cache_create 137,226
- **claude-haiku-5-5**: 12 agent · 32 calls · out 13,044 · in 64 · cache_read 625,758 · cache_create 512,623
- **claude-opus-5-5**: 3 agent · 36 calls · out 2,394 · in 72 · cache_read 1,851,082 · cache_create 213,807

