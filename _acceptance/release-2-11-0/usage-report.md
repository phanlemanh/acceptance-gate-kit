### S4 round 5 — wf_b3a7c6e6-795 (23 agent, 114,114 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 7 | 22,561 | 14 | 856,649 | 222 |
| refute:bo-giai-nhay.test.mjs | claude-sonnet-5 | 29 | 15,149 | 58 | 3,998,924 | 243 |
| refute:bo-giai-nhay.test.mjs | claude-sonnet-5 | 21 | 12,632 | 42 | 2,439,004 | 186 |
| refute:bo-giai-nhay.test.mjs | claude-sonnet-5 | 18 | 12,368 | 36 | 2,205,488 | 182 |
| triage | claude-sonnet-5 | 3 | 10,906 | 6 | 234,001 | 117 |
| refute:rang-moc.sh | claude-sonnet-5 | 10 | 10,126 | 20 | 1,088,632 | 139 |
| refute:plugin.json | claude-sonnet-5 | 10 | 6,694 | 20 | 989,214 | 87 |
| baseline:diffBase | claude-sonnet-5 | 18 | 6,295 | 36 | 1,804,909 | 794 |
| refute:bo-giai-nhay.test.mjs | claude-sonnet-5 | 11 | 5,081 | 22 | 1,296,052 | 82 |
| review:bugs | claude-opus-5 | 8 | 4,601 | 226 | 870,299 | 156 |
| judge:E9:spec-alignment | claude-sonnet-5 | 2 | 3,254 | 4 | 138,164 | 38 |
| capture:provenance | claude-sonnet-5 | 2 | 1,110 | 4 | 97,731 | 19 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 771 | 26 | 181,853 | 21 |
| review:conventions | claude-opus-5 | 11 | 654 | 322 | 1,303,307 | 169 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 641 | 18 | 60,460 | 485 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 517 | 50 | 429,399 | 326 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 320 | 18 | 103,357 | 16 |
| judge:E9:operational-feasibility | claude-sonnet-5 | 2 | 253 | 4 | 98,493 | 38 |
| judge:E9:domain-correctness | claude-sonnet-5 | 2 | 128 | 4 | 138,164 | 42 |
| review:measurement | claude-opus-5 | 6 | 39 | 162 | 705,299 | 204 |
| machine:bash -c 'set -o pipefail; ONLY_BLOCK=P20 | claude-haiku-4-5-20251001 | 2 | 6 | 18 | 103,395 | 21 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 5 | 18 | 103,364 | 11 |
| machine:node tests/scripts/bo-giai-nhay.test.mjs | claude-haiku-4-5-20251001 | 2 | 3 | 18 | 73,141 | 22 |

- **claude-sonnet-5**: 13 agent · 135 calls · out 106,557 · in 270 · cache_read 15,385,425 · cache_create 1,641,375
- **claude-opus-5**: 3 agent · 25 calls · out 5,294 · in 710 · cache_read 2,878,905 · cache_create 393,327
- **claude-haiku-4-5-20251001**: 7 agent · 19 calls · out 2,263 · in 166 · cache_read 1,054,969 · cache_create 440,458

### S4 round 6 — wf_b8bfb7a2-242 (20 agent, 82,336 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 10 | 19,345 | 20 | 1,321,280 | 226 |
| refute:bo-giai-nhay.test.mjs | claude-sonnet-5 | 14 | 12,910 | 28 | 1,586,781 | 181 |
| refute:bo-giai-nhay.test.mjs | claude-sonnet-5 | 16 | 11,734 | 32 | 1,945,996 | 168 |
| refute:bo-giai-nhay.test.mjs | claude-sonnet-5 | 18 | 7,432 | 36 | 2,061,162 | 129 |
| triage | claude-sonnet-5 | 2 | 6,500 | 4 | 100,706 | 75 |
| refute:carry-plan.mjs | claude-sonnet-5 | 9 | 4,406 | 18 | 948,083 | 74 |
| judge:E9:spec-alignment | claude-sonnet-5 | 2 | 3,864 | 4 | 138,164 | 48 |
| baseline:diffBase | claude-sonnet-5 | 12 | 3,467 | 24 | 1,095,096 | 756 |
| judge:E9:operational-feasibility | claude-sonnet-5 | 2 | 2,745 | 4 | 138,166 | 33 |
| judge:E9:domain-correctness | claude-sonnet-5 | 2 | 1,697 | 4 | 98,491 | 24 |
| review:conventions | claude-opus-5 | 7 | 1,506 | 194 | 646,299 | 109 |
| review:measurement | claude-opus-5 | 7 | 1,070 | 194 | 864,010 | 159 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,059 | 18 | 103,357 | 19 |
| machine:bash -c 'set -o pipefail; ONLY_BLOCK=P20 | claude-haiku-4-5-20251001 | 2 | 941 | 18 | 73,165 | 27 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 907 | 42 | 363,416 | 324 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 903 | 18 | 103,364 | 15 |
| review:bugs | claude-opus-5 | 9 | 871 | 258 | 1,049,817 | 242 |
| capture:provenance | claude-sonnet-5 | 2 | 753 | 4 | 97,731 | 14 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 223 | 50 | 420,903 | 37 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 3 | 18 | 60,460 | 478 |

- **claude-sonnet-5**: 11 agent · 89 calls · out 74,853 · in 178 · cache_read 9,531,656 · cache_create 1,383,539
- **claude-opus-5**: 3 agent · 23 calls · out 3,447 · in 646 · cache_read 2,560,126 · cache_create 370,215
- **claude-haiku-4-5-20251001**: 6 agent · 19 calls · out 4,036 · in 164 · cache_read 1,124,665 · cache_create 379,203

