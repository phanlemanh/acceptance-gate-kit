### S3 execute-parallel lượt 1 (chết vì hạn mức phiên) — wf_e4c0d7d1-37a (8 agent, 8,193 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| exec:Làn A | claude-fable-5-1 | 5 | 2,949 | 100 | 205,094 | 38 |
| exec:Làn B | claude-fable-5-1 | 5 | 2,009 | 70 | 222,960 | 27 |
| exec:Làn D | claude-fable-5-1 | 7 | 1,980 | 134 | 400,351 | 30 |
| exec:Làn C | claude-fable-5-1 | 5 | 1,255 | 70 | 223,409 | 20 |
| exec:Làn A | <synthetic> | 1 | 0 | 0 | 0 | 38 |
| exec:Làn B | <synthetic> | 1 | 0 | 0 | 0 | 27 |
| exec:Làn D | <synthetic> | 1 | 0 | 0 | 0 | 30 |
| exec:Làn C | <synthetic> | 1 | 0 | 0 | 0 | 20 |


wall: 38s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| exec | 4 | 8,193 | 1,051,814 | 38 | 09:13:31 | 09:14:08 |

- **claude-fable-5-1**: 4 agent · 22 calls · out 8,193 · in 374 · cache_read 1,051,814 · cache_create 474,007
- **<synthetic>**: 4 agent · 4 calls · out 0 · in 0 · cache_read 0 · cache_create 0

### S3 execute-parallel lượt 2 — wf_2fd9c132-0c5 (4 agent, 190,259 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| exec:Làn A | claude-opus-5 | 50 | 63,731 | 100 | 7,900,092 | 650 |
| exec:Làn C | claude-opus-5 | 40 | 53,318 | 80 | 5,212,605 | 566 |
| exec:Làn D | claude-opus-5 | 41 | 47,545 | 82 | 5,453,842 | 481 |
| exec:Làn B | claude-opus-5 | 34 | 25,665 | 68 | 3,778,525 | 255 |


wall: 650s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| exec | 4 | 190,259 | 22,345,064 | 650 | 12:32:22 | 12:43:12 |

- **claude-opus-5**: 4 agent · 165 calls · out 190,259 · in 330 · cache_read 22,345,064 · cache_create 711,511

### S4 round 1 — wf_d83c8805-916 (37 agent, 204,624 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5 | 46 | 45,883 | 92 | 7,320,421 | 554 |
| synthesize:report | claude-sonnet-5 | 2 | 24,904 | 4 | 89,265 | 221 |
| refute:s4-args.mjs | claude-sonnet-5 | 16 | 22,453 | 32 | 1,415,142 | 235 |
| review:conventions | claude-opus-5 | 27 | 18,435 | 54 | 3,484,903 | 210 |
| triage | claude-sonnet-5 | 2 | 14,409 | 4 | 69,180 | 150 |
| baseline:diffBase | claude-sonnet-5 | 30 | 13,655 | 60 | 2,202,327 | 971 |
| review:measurement | claude-opus-5 | 14 | 11,060 | 28 | 1,777,643 | 126 |
| triage | claude-sonnet-5 | 2 | 6,245 | 4 | 101,698 | 67 |
| refute:thuoc-vat.mjs | claude-sonnet-5 | 12 | 5,736 | 24 | 867,540 | 63 |
| judge:E25:domain-correctness | claude-sonnet-5 | 2 | 4,042 | 4 | 63,379 | 41 |
| judge:E25:spec-alignment | claude-sonnet-5 | 2 | 4,000 | 4 | 99,140 | 40 |
| judge:E25:operational-feasibility | claude-sonnet-5 | 2 | 3,364 | 4 | 99,142 | 34 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 2,203 | 50 | 152,340 | 933 |
| machine:bash -c 'out=$(node tests/scripts/bo-qua | claude-haiku-4-5-20251001 | 2 | 1,761 | 18 | 70,678 | 25 |
| machine:bash -c 'out=$(node tests/scripts/gate-c | claude-haiku-4-5-20251001 | 2 | 1,651 | 18 | 70,677 | 27 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,485 | 50 | 269,616 | 30 |
| machine:bash -c 'out=$(node tests/scripts/s4-arg | claude-haiku-4-5-20251001 | 2 | 1,426 | 18 | 70,687 | 23 |
| machine:bash -c 'out=$(node tests/scripts/gate-c | claude-haiku-4-5-20251001 | 2 | 1,405 | 18 | 70,683 | 16 |
| machine:bash -c 'out=$(node tests/scripts/gate-c | claude-haiku-4-5-20251001 | 2 | 1,396 | 18 | 70,685 | 25 |
| machine:bash -c 'out=$(node tests/scripts/thuoc- | claude-haiku-4-5-20251001 | 2 | 1,381 | 18 | 70,676 | 24 |
| machine:bash -c 'out=$(node tests/scripts/gate-c | claude-haiku-4-5-20251001 | 2 | 1,317 | 18 | 70,671 | 17 |
| machine:bash -c 'out=$(node tests/scripts/duong- | claude-haiku-4-5-20251001 | 2 | 1,235 | 18 | 70,689 | 38 |
| machine:bash -c 'out=$(node tests/scripts/bo-qua | claude-haiku-4-5-20251001 | 2 | 1,233 | 18 | 70,682 | 20 |
| machine:bash -c 'out=$(node tests/scripts/s4-arg | claude-haiku-4-5-20251001 | 2 | 1,218 | 18 | 70,681 | 17 |
| machine:bash -c 'out=$(node tests/workflows/not- | claude-haiku-4-5-20251001 | 2 | 1,200 | 18 | 70,679 | 14 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,187 | 18 | 70,577 | 16 |
| machine:bash -c 'out=$(node tests/workflows/suit | claude-haiku-4-5-20251001 | 2 | 1,178 | 18 | 70,678 | 15 |
| machine:node tests/scripts/s4-args-vung-vat.test | claude-haiku-4-5-20251001 | 2 | 1,168 | 18 | 70,594 | 26 |
| machine:bash -c 'out=$(node tests/scripts/phan-l | claude-haiku-4-5-20251001 | 2 | 1,137 | 18 | 70,678 | 14 |
| machine:node tests/workflows/vung-vat-mutants.te | claude-haiku-4-5-20251001 | 2 | 1,068 | 18 | 70,590 | 13 |
| machine:bash -c 'out=$(node tests/scripts/duong- | claude-haiku-4-5-20251001 | 2 | 1,054 | 18 | 70,689 | 36 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 934 | 18 | 26,867 | 417 |
| capture:provenance | claude-sonnet-5 | 2 | 901 | 4 | 62,553 | 9 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 821 | 18 | 70,584 | 10 |
| machine:bash -c 'out=$(node tests/scripts/bo-qua | claude-haiku-4-5-20251001 | 2 | 802 | 18 | 70,678 | 22 |
| machine:bash -c 'out=$(node tests/scripts/bo-qua | claude-haiku-4-5-20251001 | 2 | 662 | 18 | 70,675 | 24 |
| machine:bash -c 'out=$(node tests/scripts/thuoc- | claude-haiku-4-5-20251001 | 2 | 615 | 18 | 70,667 | 23 |


wall: 2089s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 13,655 | 2,202,327 | 971 | 13:31:09 | 13:47:20 |
| machine | 24 | 29,537 | 1,932,721 | 1406 | 13:31:09 | 13:54:35 |
| judge | 3 | 11,406 | 261,661 | 46 | 13:31:28 | 13:32:13 |
| review | 3 | 75,378 | 12,582,967 | 555 | 13:31:35 | 13:40:50 |
| triage | 2 | 20,654 | 170,878 | 218 | 13:54:35 | 13:58:13 |
| refute | 2 | 28,189 | 2,282,682 | 235 | 13:58:13 | 14:02:08 |
| capture | 1 | 901 | 62,553 | 9 | 14:02:08 | 14:02:17 |
| synthesize | 1 | 24,904 | 89,265 | 221 | 14:02:17 | 14:05:58 |

- **claude-opus-5**: 3 agent · 87 calls · out 75,378 · in 174 · cache_read 12,582,967 · cache_create 516,788
- **claude-sonnet-5**: 10 agent · 72 calls · out 99,709 · in 144 · cache_read 5,069,366 · cache_create 997,990
- **claude-haiku-4-5-20251001**: 24 agent · 56 calls · out 29,537 · in 496 · cache_read 1,932,721 · cache_create 655,989

