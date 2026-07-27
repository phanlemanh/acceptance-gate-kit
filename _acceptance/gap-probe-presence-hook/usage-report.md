### S4 round 5 (delta premerge-rules-ledger) — wf_60bbdc4f-42d (16 agent, 78,451 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 23 | 16,124 | 44 | 3,049,442 | 429 |
| synthesize:report | claude-sonnet-5 | 8 | 15,861 | 16 | 808,204 | 184 |
| review:conventions | claude-fable-5 | 14 | 13,364 | 27 | 1,464,344 | 295 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 16 | 9,402 | 32 | 1,425,088 | 151 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 5 | 3,859 | 10 | 325,062 | 61 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 6 | 3,642 | 12 | 419,940 | 62 |
| refute:run-tests.sh | claude-sonnet-5 | 8 | 2,664 | 16 | 587,047 | 58 |
| judge:E9:operational-feasibility | claude-sonnet-5 | 3 | 2,577 | 6 | 154,689 | 44 |
| judge:E9:spec-alignment | claude-sonnet-5 | 3 | 2,417 | 6 | 154,687 | 43 |
| scribe:run-log | claude-haiku-4-5-20251001 | 5 | 2,273 | 42 | 239,690 | 31 |
| judge:E9:domain-correctness | claude-sonnet-5 | 2 | 2,088 | 4 | 75,277 | 30 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 8 | 1,774 | 66 | 431,554 | 113 |
| capture:provenance | claude-sonnet-5 | 2 | 1,177 | 4 | 75,324 | 16 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 780 | 18 | 55,765 | 16 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 257 | 18 | 55,765 | 36 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 192 | 18 | 55,769 | 10 |

- **claude-fable-5**: 2 agent · 37 calls · out 29,488 · in 71 · cache_read 4,513,786 · cache_create 308,800
- **claude-sonnet-5**: 9 agent · 53 calls · out 43,687 · in 106 · cache_read 4,025,318 · cache_create 772,118
- **claude-haiku-4-5-20251001**: 5 agent · 19 calls · out 5,276 · in 162 · cache_read 838,543 · cache_create 305,396

### S4 round 6 (delta fix leftover) — wf_ec7d883f-6be (16 agent, 79,505 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 25 | 22,187 | 48 | 3,453,146 | 508 |
| review:conventions | claude-fable-5 | 11 | 17,700 | 21 | 1,046,481 | 283 |
| synthesize:report | claude-sonnet-5 | 8 | 13,646 | 16 | 840,167 | 167 |
| refute:gate.yml | claude-sonnet-5 | 13 | 5,753 | 26 | 1,050,846 | 109 |
| refute:gate.yml | claude-sonnet-5 | 12 | 5,015 | 61 | 1,013,776 | 98 |
| refute:acceptance-init.md | claude-sonnet-5 | 8 | 3,326 | 16 | 646,610 | 89 |
| scribe:run-log | claude-haiku-4-5-20251001 | 4 | 2,772 | 34 | 178,693 | 41 |
| refute:acceptance-init.md | claude-sonnet-5 | 6 | 2,646 | 12 | 430,633 | 58 |
| judge:E9:spec-alignment | claude-sonnet-5 | 2 | 1,305 | 4 | 75,277 | 20 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,249 | 34 | 176,085 | 68 |
| judge:E9:operational-feasibility | claude-sonnet-5 | 2 | 1,065 | 4 | 98,363 | 31 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 831 | 18 | 55,765 | 16 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 752 | 18 | 55,769 | 13 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 639 | 18 | 73,127 | 38 |
| capture:provenance | claude-sonnet-5 | 2 | 412 | 4 | 75,324 | 12 |
| judge:E9:domain-correctness | claude-sonnet-5 | 2 | 207 | 4 | 75,277 | 36 |

- **claude-fable-5**: 2 agent · 36 calls · out 39,887 · in 69 · cache_read 4,499,627 · cache_create 278,922
- **claude-sonnet-5**: 9 agent · 55 calls · out 33,375 · in 147 · cache_read 4,306,273 · cache_create 753,297
- **claude-haiku-4-5-20251001**: 5 agent · 14 calls · out 6,243 · in 122 · cache_read 539,439 · cache_create 296,650

