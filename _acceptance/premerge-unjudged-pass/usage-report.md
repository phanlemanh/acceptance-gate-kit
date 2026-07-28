### S4 round 1 — wf_cd76ce70-a4b (22 agent, 123,803 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5 | 27 | 24,341 | 54 | 3,111,887 | 577 |
| review:bugs | claude-opus-5 | 31 | 22,295 | 62 | 3,187,082 | 888 |
| refute:SKILL.md | claude-sonnet-5 | 21 | 15,471 | 42 | 1,859,871 | 286 |
| refute:plugin.json | claude-sonnet-5 | 13 | 11,796 | 26 | 1,022,288 | 204 |
| triage | claude-sonnet-5 | 2 | 9,524 | 4 | 72,302 | 113 |
| refute:CLAUDE.md | claude-sonnet-5 | 7 | 7,296 | 2,891 | 485,810 | 156 |
| refute:run-tests.sh | claude-sonnet-5 | 9 | 6,089 | 18 | 688,112 | 157 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 12 | 4,748 | 24 | 945,401 | 92 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 14 | 4,711 | 28 | 1,038,396 | 115 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 10 | 4,372 | 20 | 708,175 | 106 |
| refute:GUIDE.md | claude-sonnet-5 | 9 | 3,056 | 18 | 651,118 | 89 |
| baseline:diffBase | claude-sonnet-5 | 6 | 2,187 | 12 | 369,061 | 101 |
| judge:E15:operational-feasibility | claude-sonnet-5 | 2 | 2,080 | 4 | 68,252 | 27 |
| judge:E15:domain-correctness | claude-sonnet-5 | 2 | 1,388 | 4 | 68,250 | 28 |
| capture:provenance | claude-sonnet-5 | 2 | 977 | 4 | 68,211 | 15 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 944 | 42 | 201,820 | 129 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 831 | 18 | 47,702 | 17 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 551 | 18 | 47,702 | 12 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 545 | 18 | 47,702 | 43 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 473 | 18 | 65,071 | 13 |
| synthesize:report | claude-sonnet-5 | 2 | 118 | 4 | 81,854 | 130 |
| judge:E15:spec-alignment | claude-sonnet-5 | 2 | 10 | 4 | 68,250 | 32 |

- **claude-opus-5**: 2 agent · 58 calls · out 46,636 · in 116 · cache_read 6,298,969 · cache_create 297,942
- **claude-sonnet-5**: 15 agent · 113 calls · out 73,823 · in 3,103 · cache_read 8,195,351 · cache_create 1,239,460
- **claude-haiku-4-5-20251001**: 5 agent · 13 calls · out 3,344 · in 114 · cache_read 409,997 · cache_create 243,930

### S4 round 2 — wf_ee377526-2f5 (21 agent, 153,731 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5 | 25 | 28,260 | 50 | 2,793,350 | 577 |
| review:conventions | claude-opus-5 | 38 | 19,705 | 76 | 4,210,183 | 580 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 25 | 16,062 | 50 | 2,088,942 | 308 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 23 | 14,480 | 46 | 1,960,373 | 265 |
| synthesize:report | claude-sonnet-5 | 2 | 14,413 | 4 | 82,260 | 153 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 11,617 | 20 | 708,596 | 186 |
| refute:plugin.json | claude-sonnet-5 | 14 | 11,340 | 28 | 1,174,601 | 175 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 12 | 9,376 | 3,503 | 877,584 | 187 |
| triage | claude-sonnet-5 | 2 | 6,996 | 4 | 73,201 | 85 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 9 | 5,429 | 18 | 701,422 | 141 |
| refute:GUIDE.md | claude-sonnet-5 | 13 | 5,126 | 26 | 998,252 | 125 |
| refute:acceptance-init.md | claude-sonnet-5 | 11 | 4,344 | 22 | 837,729 | 102 |
| judge:E15:spec-alignment | claude-sonnet-5 | 2 | 1,693 | 4 | 68,250 | 25 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,077 | 42 | 202,178 | 80 |
| judge:E15:operational-feasibility | claude-sonnet-5 | 2 | 1,018 | 4 | 68,252 | 18 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 821 | 18 | 47,702 | 16 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 638 | 18 | 47,702 | 41 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 580 | 18 | 47,706 | 10 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 387 | 18 | 47,702 | 15 |
| capture:provenance | claude-sonnet-5 | 2 | 360 | 4 | 68,211 | 12 |
| judge:E15:domain-correctness | claude-sonnet-5 | 2 | 9 | 4 | 68,250 | 42 |

- **claude-opus-5**: 2 agent · 63 calls · out 47,965 · in 126 · cache_read 7,003,533 · cache_create 299,834
- **claude-sonnet-5**: 14 agent · 129 calls · out 102,263 · in 3,737 · cache_read 9,775,923 · cache_create 1,182,737
- **claude-haiku-4-5-20251001**: 5 agent · 13 calls · out 3,503 · in 114 · cache_read 392,990 · cache_create 263,091

