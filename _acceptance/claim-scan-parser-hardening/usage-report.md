### S4 round 1 — wf_bc1cdec0-60e (18 agent, 104,214 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 17,696 | 4 | 52,034 | 178 |
| review:conventions | claude-fable-5 | 11 | 13,892 | 21 | 592,836 | 283 |
| judge:E7:domain-correctness | claude-sonnet-5 | 2 | 11,238 | 4 | 43,273 | 131 |
| review:bugs | claude-fable-5 | 13 | 10,104 | 25 | 701,875 | 224 |
| judge:E7:spec-alignment | claude-sonnet-5 | 3 | 8,259 | 6 | 91,644 | 100 |
| refute:claim-scan.mjs | claude-sonnet-5 | 11 | 7,676 | 22 | 583,710 | 104 |
| refute:claim-scan.mjs | claude-sonnet-5 | 15 | 7,276 | 30 | 811,136 | 118 |
| triage | claude-sonnet-5 | 2 | 7,270 | 4 | 45,936 | 83 |
| judge:E7:operational-feasibility | claude-sonnet-5 | 5 | 5,279 | 10 | 199,998 | 78 |
| refute:claim-scan.mjs | claude-sonnet-5 | 13 | 5,121 | 291 | 736,452 | 136 |
| refute:claim-scan.mjs | claude-sonnet-5 | 12 | 4,804 | 24 | 639,502 | 116 |
| baseline:diffBase | claude-sonnet-5 | 6 | 1,367 | 12 | 251,858 | 32 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,269 | 34 | 107,112 | 90 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,254 | 18 | 28,106 | 19 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 3 | 700 | 26 | 58,409 | 13 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 402 | 18 | 28,106 | 13 |
| capture:provenance | claude-sonnet-5 | 2 | 377 | 4 | 43,168 | 11 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 230 | 18 | 45,544 | 58 |

- **claude-sonnet-5**: 11 agent · 73 calls · out 76,363 · in 411 · cache_read 3,498,711 · cache_create 613,268
- **claude-fable-5**: 2 agent · 24 calls · out 23,996 · in 46 · cache_read 1,294,711 · cache_create 164,883
- **claude-haiku-4-5-20251001**: 5 agent · 13 calls · out 3,855 · in 114 · cache_read 267,277 · cache_create 161,753

### S4 round 2 — wf_7f41abdc-be3 (16 agent, 99,695 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-fable-5 | 20 | 17,444 | 38 | 1,397,191 | 326 |
| refute:claim-scan.mjs | claude-sonnet-5 | 13 | 14,953 | 26 | 844,312 | 241 |
| review:bugs | claude-fable-5 | 10 | 12,937 | 19 | 511,664 | 239 |
| synthesize:report | claude-sonnet-5 | 9 | 11,412 | 18 | 553,194 | 208 |
| judge:E7:domain-correctness | claude-sonnet-5 | 2 | 10,466 | 4 | 43,273 | 121 |
| refute:gate-card.js | claude-sonnet-5 | 19 | 9,533 | 38 | 1,216,998 | 152 |
| judge:E7:operational-feasibility | claude-sonnet-5 | 2 | 7,709 | 4 | 43,275 | 96 |
| judge:E7:spec-alignment | claude-sonnet-5 | 2 | 5,832 | 4 | 43,273 | 79 |
| triage | claude-sonnet-5 | 2 | 2,443 | 4 | 45,261 | 33 |
| refute:claim-scan.test.mjs | claude-sonnet-5 | 4 | 2,176 | 8 | 148,580 | 33 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,250 | 42 | 142,321 | 88 |
| capture:provenance | claude-sonnet-5 | 2 | 1,021 | 4 | 43,168 | 15 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,008 | 18 | 28,106 | 55 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 866 | 26 | 64,673 | 28 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 329 | 18 | 45,544 | 11 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 316 | 18 | 28,110 | 8 |

- **claude-fable-5**: 2 agent · 30 calls · out 30,381 · in 57 · cache_read 1,908,855 · cache_create 181,310
- **claude-sonnet-5**: 9 agent · 55 calls · out 65,545 · in 110 · cache_read 2,981,334 · cache_create 528,054
- **claude-haiku-4-5-20251001**: 5 agent · 14 calls · out 3,769 · in 122 · cache_read 308,754 · cache_create 156,552

