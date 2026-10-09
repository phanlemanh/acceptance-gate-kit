### S4 round 1 — wf_3e26001b-908 (28 agent, 41,692 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 6,898 | 8 | 381,055 | 62 |
| review:measurement | claude-opus-5-5 | 10 | 5,939 | 20 | 1,307,443 | 150 |
| triage | claude-sonnet-5-5 | 2 | 5,342 | 4 | 106,393 | 51 |
| review:conventions | claude-opus-5-5 | 28 | 2,799 | 56 | 4,595,112 | 254 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,683 | 4 | 136,974 | 181 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,112 | 4 | 136,974 | 260 |
| review:bugs | claude-opus-5-5 | 7 | 1,937 | 14 | 766,465 | 100 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,915 | 4 | 34,982 | 405 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,657 | 4 | 136,960 | 13 |
| triage | claude-sonnet-5-5 | 2 | 1,398 | 4 | 138,300 | 18 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,244 | 4 | 101,987 | 131 |
| judge:E7:operational-feasibility | claude-sonnet-5-5 | 3 | 986 | 6 | 262,391 | 25 |
| baseline:diffBase | claude-sonnet-5-5 | 5 | 885 | 10 | 431,302 | 30 |
| machine:bash _acceptance/tac-tu-cham-chi-cham-kh | claude-haiku-5-5 | 2 | 772 | 4 | 136,992 | 27 |
| machine:bash _acceptance/tac-tu-cham-chi-cham-kh | claude-haiku-5-5 | 2 | 724 | 4 | 136,994 | 13 |
| refute:acceptance-verify.js | claude-sonnet-5-5 | 5 | 637 | 10 | 435,031 | 28 |
| machine:bash _acceptance/tac-tu-cham-chi-cham-kh | claude-haiku-5-5 | 2 | 599 | 4 | 136,992 | 9 |
| machine:bash _acceptance/tac-tu-cham-chi-cham-kh | claude-haiku-5-5 | 2 | 530 | 4 | 136,993 | 28 |
| judge:E7:spec-alignment | claude-sonnet-5-5 | 4 | 492 | 8 | 379,912 | 30 |
| machine:bash _acceptance/tac-tu-cham-chi-cham-kh | claude-haiku-5-5 | 2 | 397 | 4 | 136,992 | 12 |
| machine:bash _acceptance/tac-tu-cham-chi-cham-kh | claude-haiku-5-5 | 2 | 384 | 4 | 136,992 | 11 |
| judge:E7:domain-correctness | claude-sonnet-5-5 | 4 | 368 | 8 | 338,625 | 20 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 269 | 4 | 137,016 | 69 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 257 | 4 | 137,016 | 86 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 165 | 4 | 136,961 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 152 | 4 | 100,766 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 125 | 4 | 137,016 | 291 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 26 | 4 | 136,960 | 57 |


wall: 1704s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 885 | 431,302 | 30 | 15:39:03 | 15:39:33 |
| machine | 16 | 13,859 | 2,054,801 | 1522 | 15:39:03 | 16:04:25 |
| judge | 3 | 1,846 | 980,928 | 43 | 15:39:03 | 15:39:46 |
| review | 3 | 10,675 | 6,669,020 | 256 | 15:39:03 | 15:43:19 |
| triage | 2 | 6,740 | 244,693 | 71 | 16:04:27 | 16:05:38 |
| refute | 1 | 637 | 435,031 | 28 | 16:05:42 | 16:06:10 |
| capture | 1 | 152 | 100,766 | 11 | 16:06:12 | 16:06:23 |
| synthesize | 1 | 6,898 | 381,055 | 62 | 16:06:26 | 16:07:27 |

- **claude-sonnet-5-5**: 9 agent · 31 calls · out 17,158 · in 62 · cache_read 2,573,775 · cache_create 972,864
- **claude-opus-5-5**: 3 agent · 45 calls · out 10,675 · in 90 · cache_read 6,669,020 · cache_create 466,851
- **claude-haiku-5-5**: 16 agent · 32 calls · out 13,859 · in 64 · cache_read 2,054,801 · cache_create 1,320,222

### S4 round 2 — wf_5c19ab51-8e6 (27 agent, 38,363 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 7,314 | 8 | 384,492 | 56 |
| triage | claude-sonnet-5-5 | 2 | 5,413 | 4 | 106,657 | 41 |
| review:measurement | claude-opus-5-5 | 13 | 3,113 | 26 | 1,860,224 | 152 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,554 | 4 | 137,196 | 175 |
| review:conventions | claude-opus-5-5 | 26 | 2,124 | 52 | 3,949,687 | 202 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,122 | 4 | 137,196 | 246 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,995 | 4 | 34,982 | 390 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,667 | 4 | 137,182 | 58 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,327 | 4 | 102,209 | 124 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,320 | 4 | 137,182 | 11 |
| review:bugs | claude-opus-5-5 | 16 | 884 | 32 | 2,299,696 | 220 |
| machine:bash _acceptance/tac-tu-cham-chi-cham-kh | claude-haiku-5-5 | 2 | 868 | 4 | 137,214 | 38 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 732 | 8 | 321,587 | 20 |
| machine:bash _acceptance/tac-tu-cham-chi-cham-kh | claude-haiku-5-5 | 2 | 724 | 4 | 137,216 | 13 |
| machine:bash _acceptance/tac-tu-cham-chi-cham-kh | claude-haiku-5-5 | 2 | 721 | 4 | 137,214 | 13 |
| refute:ghi-boi.mjs | claude-sonnet-5-5 | 7 | 709 | 14 | 680,788 | 26 |
| judge:E7:operational-feasibility | claude-sonnet-5-5 | 3 | 669 | 6 | 252,223 | 21 |
| machine:bash _acceptance/tac-tu-cham-chi-cham-kh | claude-haiku-5-5 | 2 | 622 | 4 | 137,215 | 36 |
| judge:E7:domain-correctness | claude-sonnet-5-5 | 5 | 545 | 10 | 445,118 | 24 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 539 | 4 | 137,238 | 74 |
| machine:bash _acceptance/tac-tu-cham-chi-cham-kh | claude-haiku-5-5 | 2 | 511 | 4 | 137,214 | 13 |
| judge:E7:spec-alignment | claude-sonnet-5-5 | 3 | 497 | 6 | 252,852 | 19 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 422 | 4 | 137,183 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 359 | 4 | 137,238 | 284 |
| machine:bash _acceptance/tac-tu-cham-chi-cham-kh | claude-haiku-5-5 | 2 | 318 | 4 | 137,214 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 100,988 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 144 | 4 | 137,238 | 65 |


wall: 1591s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 732 | 321,587 | 20 | 16:22:58 | 16:23:18 |
| machine | 16 | 16,213 | 2,058,131 | 1452 | 16:22:58 | 16:47:10 |
| judge | 3 | 1,711 | 950,193 | 25 | 16:22:58 | 16:23:23 |
| review | 3 | 6,121 | 8,109,607 | 233 | 16:22:58 | 16:26:52 |
| triage | 1 | 5,413 | 106,657 | 41 | 16:47:12 | 16:47:53 |
| refute | 1 | 709 | 680,788 | 26 | 16:47:55 | 16:48:21 |
| capture | 1 | 150 | 100,988 | 7 | 16:48:24 | 16:48:31 |
| synthesize | 1 | 7,314 | 384,492 | 56 | 16:48:33 | 16:49:29 |

- **claude-sonnet-5-5**: 8 agent · 30 calls · out 16,029 · in 60 · cache_read 2,544,705 · cache_create 882,493
- **claude-opus-5-5**: 3 agent · 55 calls · out 6,121 · in 110 · cache_read 8,109,607 · cache_create 491,219
- **claude-haiku-5-5**: 16 agent · 32 calls · out 16,213 · in 64 · cache_read 2,058,131 · cache_create 1,324,427

