### S4 round 1 — wf_ec658c5f-0c9 (33 agent, 257,709 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 18 | 42,465 | 36 | 1,936,589 | 410 |
| review:bugs | claude-opus-5 | 34 | 22,336 | 68 | 3,747,146 | 1032 |
| review:measurement | claude-opus-5 | 17 | 21,908 | 34 | 1,669,200 | 339 |
| review:conventions | claude-opus-5 | 23 | 17,865 | 46 | 2,457,524 | 278 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 13 | 15,945 | 26 | 1,092,295 | 168 |
| judge:E7:operational-feasibility | claude-sonnet-5 | 2 | 14,867 | 4 | 99,908 | 132 |
| judge:E7:spec-alignment | claude-sonnet-5 | 3 | 13,472 | 6 | 245,675 | 125 |
| refute:rang-ghim-lai.mjs | claude-sonnet-5 | 15 | 12,398 | 30 | 1,320,734 | 146 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 10 | 11,100 | 20 | 732,429 | 122 |
| triage | claude-sonnet-5 | 2 | 11,085 | 4 | 73,182 | 109 |
| judge:E7:domain-correctness | claude-sonnet-5 | 4 | 10,950 | 8 | 361,588 | 105 |
| refute:contract.md | claude-sonnet-5 | 9 | 8,090 | 18 | 645,369 | 81 |
| baseline:diffBase | claude-sonnet-5 | 20 | 7,483 | 40 | 1,257,307 | 1003 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 8 | 7,224 | 16 | 558,225 | 82 |
| refute:contract.md | claude-sonnet-5 | 6 | 6,305 | 12 | 383,038 | 66 |
| refute:rang-ghim-lai.mjs | claude-sonnet-5 | 9 | 6,304 | 18 | 656,458 | 76 |
| refute:rang-cua-so.mjs | claude-sonnet-5 | 6 | 4,156 | 12 | 399,764 | 40 |
| refute:rang-so-tang.sh | claude-sonnet-5 | 10 | 3,665 | 20 | 633,709 | 44 |
| refute:rang-so-tang.sh | claude-sonnet-5 | 7 | 3,388 | 14 | 456,671 | 42 |
| refute:rang-so-tang.sh | claude-sonnet-5 | 5 | 3,014 | 10 | 311,325 | 37 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,712 | 50 | 197,511 | 497 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,612 | 42 | 215,946 | 24 |
| machine:bash _acceptance/release-2-16-0/rang-p20 | claude-haiku-4-5-20251001 | 2 | 1,555 | 18 | 70,498 | 23 |
| machine:node _acceptance/release-2-16-0/rang-ghi | claude-haiku-4-5-20251001 | 2 | 1,143 | 18 | 70,508 | 13 |
| machine:node _acceptance/release-2-16-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 1,061 | 18 | 70,505 | 13 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,002 | 18 | 70,484 | 14 |
| machine:node _acceptance/release-2-16-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 940 | 18 | 70,507 | 12 |
| machine:node _acceptance/release-2-16-0/rang-cua | claude-haiku-4-5-20251001 | 2 | 924 | 18 | 70,507 | 13 |
| machine:bash _acceptance/release-2-16-0/rang-moc | claude-haiku-4-5-20251001 | 2 | 905 | 18 | 70,501 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 826 | 18 | 26,700 | 456 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 786 | 18 | 70,491 | 10 |
| capture:provenance | claude-sonnet-5 | 2 | 722 | 4 | 62,573 | 7 |
| machine:bash _acceptance/release-2-16-0/rang-so- | claude-haiku-4-5-20251001 | 2 | 501 | 18 | 70,499 | 12 |


wall: 1730s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 7,483 | 1,257,307 | 1003 | 03:11:11 | 03:27:54 |
| machine | 12 | 12,967 | 1,074,657 | 1002 | 03:11:11 | 03:27:53 |
| judge | 3 | 39,289 | 707,171 | 133 | 03:11:11 | 03:13:25 |
| review | 3 | 62,109 | 7,873,870 | 1034 | 03:11:11 | 03:28:25 |
| triage | 1 | 11,085 | 73,182 | 109 | 03:28:25 | 03:30:14 |
| refute | 11 | 81,589 | 7,190,017 | 169 | 03:30:14 | 03:33:04 |
| capture | 1 | 722 | 62,573 | 7 | 03:33:04 | 03:33:11 |
| synthesize | 1 | 42,465 | 1,936,589 | 410 | 03:33:11 | 03:40:01 |

- **claude-sonnet-5**: 18 agent · 149 calls · out 182,633 · in 298 · cache_read 11,226,839 · cache_create 1,535,754
- **claude-opus-5**: 3 agent · 74 calls · out 62,109 · in 148 · cache_read 7,873,870 · cache_create 500,437
- **claude-haiku-4-5-20251001**: 12 agent · 31 calls · out 12,967 · in 272 · cache_read 1,074,657 · cache_create 363,421

