### S4 round 1 — wf_8acfa4f7-15f (22 agent, 43,909 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 8,766 | 4 | 113,053 | 86 |
| triage | claude-sonnet-5 | 2 | 8,697 | 4 | 102,323 | 96 |
| refute:repin-lane.mjs | claude-sonnet-5 | 9 | 7,543 | 18 | 1,048,987 | 115 |
| baseline:diffBase | claude-sonnet-5 | 17 | 4,465 | 34 | 1,666,315 | 658 |
| review:conventions | claude-opus-5 | 9 | 2,824 | 258 | 945,595 | 706 |
| review:bugs | claude-opus-5 | 7 | 2,723 | 194 | 736,671 | 170 |
| refute:repin-lane-lop-cu.test.mjs | claude-sonnet-5 | 4 | 2,131 | 8 | 373,082 | 51 |
| review:measurement | claude-opus-5 | 7 | 1,452 | 194 | 798,345 | 189 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 911 | 18 | 61,374 | 373 |
| capture:provenance | claude-sonnet-5 | 2 | 685 | 4 | 99,539 | 14 |
| machine:GLLC_CASES=GL03 node tests/scripts/repin | claude-haiku-4-5-20251001 | 2 | 525 | 18 | 105,255 | 22 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 506 | 18 | 105,227 | 17 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 501 | 58 | 505,250 | 254 |
| machine:GLLC_CASES=GL01 node tests/scripts/repin | claude-haiku-4-5-20251001 | 2 | 480 | 18 | 105,255 | 15 |
| machine:GLLC_CASES=GL05 node tests/scripts/repin | claude-haiku-4-5-20251001 | 2 | 440 | 18 | 105,255 | 14 |
| machine:GLLC_CASES=GL07 node tests/scripts/repin | claude-haiku-4-5-20251001 | 2 | 440 | 18 | 105,255 | 16 |
| machine:GLLC_CASES=GL02 node tests/scripts/repin | claude-haiku-4-5-20251001 | 2 | 428 | 18 | 105,255 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 371 | 18 | 105,234 | 12 |
| machine:GLLC_CASES=GL08 node tests/scripts/repin | claude-haiku-4-5-20251001 | 2 | 8 | 18 | 105,255 | 16 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 5 | 34 | 265,396 | 26 |
| machine:GLLC_CASES=GL04 node tests/scripts/repin | claude-haiku-4-5-20251001 | 2 | 5 | 18 | 105,255 | 15 |
| machine:GLLC_CASES=GL06 node tests/scripts/repin | claude-haiku-4-5-20251001 | 2 | 3 | 18 | 74,568 | 15 |

- **claude-sonnet-5**: 6 agent · 36 calls · out 32,287 · in 72 · cache_read 3,403,299 · cache_create 841,970
- **claude-opus-5**: 3 agent · 23 calls · out 6,999 · in 646 · cache_read 2,480,611 · cache_create 546,346
- **claude-haiku-4-5-20251001**: 13 agent · 33 calls · out 4,623 · in 290 · cache_read 1,853,834 · cache_create 704,539

