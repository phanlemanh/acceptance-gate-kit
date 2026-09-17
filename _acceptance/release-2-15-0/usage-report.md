### S4 round 1 — wf_551bc36c-e97 (39 agent, 211,201 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 23,666 | 4 | 90,071 | 263 |
| judge:E11:domain-correctness | claude-sonnet-5 | 2 | 20,368 | 4 | 99,423 | 216 |
| review:conventions | claude-opus-5 | 30 | 18,473 | 60 | 3,398,888 | 244 |
| judge:E11:operational-feasibility | claude-sonnet-5 | 2 | 17,523 | 4 | 99,425 | 193 |
| review:bugs | claude-opus-5 | 26 | 15,786 | 52 | 2,977,564 | 223 |
| review:measurement | claude-opus-5 | 17 | 15,686 | 34 | 1,870,746 | 170 |
| judge:E11:spec-alignment | claude-sonnet-5 | 2 | 13,124 | 4 | 99,423 | 144 |
| baseline:diffBase | claude-sonnet-5 | 25 | 8,932 | 50 | 1,665,244 | 957 |
| judge:E6:operational-feasibility | claude-sonnet-5 | 4 | 7,612 | 8 | 251,791 | 91 |
| triage | claude-sonnet-5 | 2 | 6,806 | 4 | 66,799 | 86 |
| judge:E6:domain-correctness | claude-sonnet-5 | 2 | 6,198 | 4 | 62,976 | 67 |
| judge:E13c:operational-feasibility | claude-sonnet-5 | 2 | 5,198 | 4 | 99,045 | 56 |
| judge:E13c:domain-correctness | claude-sonnet-5 | 2 | 5,151 | 4 | 99,043 | 53 |
| judge:E13c:spec-alignment | claude-sonnet-5 | 2 | 5,042 | 4 | 99,043 | 52 |
| judge:E9b:domain-correctness | claude-sonnet-5 | 2 | 4,688 | 4 | 98,403 | 54 |
| judge:E6:spec-alignment | claude-sonnet-5 | 5 | 4,344 | 10 | 341,929 | 54 |
| judge:E9b:spec-alignment | claude-sonnet-5 | 2 | 4,146 | 4 | 98,403 | 48 |
| judge:E9b:operational-feasibility | claude-sonnet-5 | 2 | 3,424 | 4 | 98,405 | 40 |
| triage | claude-sonnet-5 | 2 | 2,920 | 4 | 100,225 | 39 |
| machine:bash -c 'out=$(node tests/scripts/vong-m | claude-haiku-4-5-20251001 | 2 | 1,558 | 18 | 70,296 | 25 |
| machine:bash -c 'out=$(node tests/scripts/vat-da | claude-haiku-4-5-20251001 | 2 | 1,542 | 18 | 70,401 | 19 |
| machine:bash -c 'out=$(node tests/scripts/chup-h | claude-haiku-4-5-20251001 | 2 | 1,430 | 18 | 70,301 | 20 |
| machine:bash -c 'out=$(node tests/scripts/vat-da | claude-haiku-4-5-20251001 | 2 | 1,380 | 18 | 70,334 | 18 |
| machine:bash -c 'out=$(node tests/scripts/gate-c | claude-haiku-4-5-20251001 | 2 | 1,359 | 18 | 70,303 | 17 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,291 | 42 | 212,432 | 22 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,228 | 34 | 135,565 | 471 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 1,219 | 18 | 53,400 | 514 |
| machine:bash _acceptance/release-2-15-0/rang-p20 | claude-haiku-4-5-20251001 | 2 | 1,187 | 18 | 43,506 | 22 |
| machine:bash -c 'out=$(node tests/scripts/vat-da | claude-haiku-4-5-20251001 | 2 | 1,157 | 18 | 70,356 | 15 |
| machine:node _acceptance/release-2-15-0/rang-goa | claude-haiku-4-5-20251001 | 2 | 1,068 | 18 | 70,213 | 12 |
| machine:node _acceptance/release-2-15-0/rang-chu | claude-haiku-4-5-20251001 | 2 | 1,036 | 18 | 70,217 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 995 | 18 | 70,199 | 13 |
| machine:bash _acceptance/release-2-15-0/rang-moc | claude-haiku-4-5-20251001 | 2 | 976 | 18 | 70,209 | 13 |
| machine:node _acceptance/release-2-15-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 933 | 18 | 70,213 | 12 |
| machine:node _acceptance/release-2-15-0/rang-mot | claude-haiku-4-5-20251001 | 2 | 904 | 18 | 70,219 | 25 |
| machine:bash _acceptance/release-2-15-0/rang-so- | claude-haiku-4-5-20251001 | 2 | 825 | 18 | 70,207 | 11 |
| machine:node _acceptance/release-2-15-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 786 | 18 | 70,215 | 12 |
| capture:provenance | claude-sonnet-5 | 2 | 748 | 4 | 62,235 | 10 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 492 | 18 | 70,192 | 14 |


wall: 1229s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 8,932 | 1,665,244 | 957 | 03:24:30 | 03:40:27 |
| machine | 19 | 21,366 | 1,498,778 | 516 | 03:24:30 | 03:33:06 |
| judge | 12 | 96,818 | 1,547,309 | 225 | 03:24:46 | 03:28:31 |
| review | 3 | 49,945 | 8,247,198 | 252 | 03:25:03 | 03:29:14 |
| triage | 2 | 9,726 | 167,024 | 125 | 03:33:06 | 03:35:11 |
| capture | 1 | 748 | 62,235 | 10 | 03:40:27 | 03:40:37 |
| synthesize | 1 | 23,666 | 90,071 | 263 | 03:40:37 | 03:45:00 |

- **claude-sonnet-5**: 17 agent · 62 calls · out 139,890 · in 124 · cache_read 3,531,883 · cache_create 1,386,355
- **claude-opus-5**: 3 agent · 73 calls · out 49,945 · in 146 · cache_read 8,247,198 · cache_create 404,839
- **claude-haiku-4-5-20251001**: 19 agent · 43 calls · out 21,366 · in 382 · cache_read 1,498,778 · cache_create 482,843

### S4 round 2 — wf_d4154b8c-121 (26 agent, 178,300 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 6 | 35,899 | 12 | 509,031 | 379 |
| judge:E11:domain-correctness | claude-sonnet-5 | 2 | 21,216 | 4 | 99,462 | 238 |
| judge:E11:operational-feasibility | claude-sonnet-5 | 3 | 19,237 | 6 | 188,078 | 210 |
| judge:E11:spec-alignment | claude-sonnet-5 | 2 | 14,902 | 4 | 99,462 | 162 |
| judge:E6:operational-feasibility | claude-sonnet-5 | 2 | 11,674 | 4 | 98,534 | 129 |
| judge:E6:domain-correctness | claude-sonnet-5 | 3 | 11,482 | 6 | 139,429 | 124 |
| judge:E9b:domain-correctness | claude-sonnet-5 | 5 | 6,710 | 10 | 369,415 | 78 |
| judge:E13c:operational-feasibility | claude-sonnet-5 | 2 | 5,791 | 4 | 99,084 | 58 |
| judge:E13c:spec-alignment | claude-sonnet-5 | 2 | 5,639 | 4 | 99,082 | 56 |
| judge:E13c:domain-correctness | claude-sonnet-5 | 2 | 5,458 | 4 | 99,082 | 58 |
| judge:E9b:operational-feasibility | claude-sonnet-5 | 2 | 5,278 | 4 | 98,444 | 60 |
| judge:E9b:spec-alignment | claude-sonnet-5 | 2 | 5,201 | 4 | 98,442 | 59 |
| judge:E6:spec-alignment | claude-sonnet-5 | 2 | 4,339 | 4 | 98,532 | 51 |
| triage | claude-sonnet-5 | 3 | 3,733 | 6 | 152,266 | 52 |
| review:measurement | claude-opus-5 | 5 | 3,548 | 10 | 300,918 | 35 |
| review:conventions | claude-opus-5 | 9 | 3,445 | 18 | 579,240 | 38 |
| review:bugs | claude-opus-5 | 7 | 3,227 | 14 | 454,094 | 34 |
| machine:node _acceptance/release-2-15-0/rang-chu | claude-haiku-4-5-20251001 | 10 | 3,208 | 82 | 409,725 | 903 |
| baseline:diffBase | claude-sonnet-5 | 6 | 1,995 | 12 | 334,041 | 25 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,674 | 50 | 218,961 | 459 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,459 | 42 | 216,188 | 22 |
| machine:node _acceptance/release-2-15-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 1,069 | 18 | 70,250 | 15 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 648 | 18 | 70,234 | 9 |
| capture:provenance | claude-sonnet-5 | 2 | 638 | 4 | 62,274 | 8 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 465 | 18 | 70,227 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 365 | 18 | 53,400 | 489 |


wall: 1341s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,995 | 334,041 | 25 | 03:46:40 | 03:47:05 |
| machine | 7 | 8,888 | 1,108,985 | 903 | 03:46:40 | 04:01:43 |
| judge | 12 | 116,927 | 1,587,046 | 239 | 03:46:40 | 03:50:39 |
| review | 3 | 10,220 | 1,334,252 | 70 | 03:47:06 | 03:48:16 |
| triage | 1 | 3,733 | 152,266 | 52 | 04:01:43 | 04:02:35 |
| capture | 1 | 638 | 62,274 | 8 | 04:02:35 | 04:02:43 |
| synthesize | 1 | 35,899 | 509,031 | 379 | 04:02:43 | 04:09:01 |

- **claude-sonnet-5**: 16 agent · 46 calls · out 159,192 · in 92 · cache_read 2,644,658 · cache_create 1,216,304
- **claude-opus-5**: 3 agent · 21 calls · out 10,220 · in 42 · cache_read 1,334,252 · cache_create 173,953
- **claude-haiku-4-5-20251001**: 7 agent · 29 calls · out 8,888 · in 246 · cache_read 1,108,985 · cache_create 254,305

### S4 round 3 — wf_63a7e3fe-e1d (14 agent, 81,699 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 5 | 24,167 | 10 | 405,920 | 249 |
| judge:E11:domain-correctness | claude-sonnet-5 | 2 | 17,904 | 4 | 63,998 | 195 |
| judge:E11:spec-alignment | claude-sonnet-5 | 3 | 12,737 | 6 | 189,610 | 138 |
| judge:E11:operational-feasibility | claude-sonnet-5 | 2 | 12,244 | 4 | 99,517 | 134 |
| review:conventions | claude-opus-5 | 7 | 2,911 | 14 | 413,268 | 35 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 2,254 | 50 | 261,230 | 29 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,945 | 42 | 121,626 | 829 |
| review:bugs | claude-opus-5 | 5 | 1,599 | 10 | 308,143 | 20 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,277 | 18 | 70,274 | 18 |
| review:measurement | claude-opus-5 | 4 | 1,276 | 8 | 228,767 | 16 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 979 | 18 | 53,400 | 468 |
| machine:node _acceptance/release-2-15-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 910 | 18 | 43,597 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 893 | 18 | 70,281 | 11 |
| capture:provenance | claude-sonnet-5 | 2 | 603 | 4 | 62,327 | 8 |


wall: 1087s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 6 | 8,258 | 620,408 | 830 | 04:10:06 | 04:23:56 |
| judge | 3 | 42,885 | 353,125 | 195 | 04:10:06 | 04:13:21 |
| review | 3 | 5,786 | 950,178 | 35 | 04:10:06 | 04:10:41 |
| capture | 1 | 603 | 62,327 | 8 | 04:23:56 | 04:24:04 |
| synthesize | 1 | 24,167 | 405,920 | 249 | 04:24:04 | 04:28:13 |

- **claude-sonnet-5**: 5 agent · 14 calls · out 67,655 · in 28 · cache_read 821,372 · cache_create 541,613
- **claude-opus-5**: 3 agent · 16 calls · out 5,786 · in 32 · cache_read 950,178 · cache_create 157,781
- **claude-haiku-4-5-20251001**: 6 agent · 19 calls · out 8,258 · in 164 · cache_read 620,408 · cache_create 258,952

