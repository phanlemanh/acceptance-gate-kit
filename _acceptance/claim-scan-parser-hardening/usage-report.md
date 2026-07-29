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

