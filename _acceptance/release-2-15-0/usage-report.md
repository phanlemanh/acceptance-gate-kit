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

