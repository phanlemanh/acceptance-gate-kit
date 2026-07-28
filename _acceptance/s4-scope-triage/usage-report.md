### S4 round 6 — wf_0d21aae0-bb5 (21 agent, 145,444 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5 | 27 | 24,561 | 50 | 3,644,812 | 469 |
| review:bugs | claude-opus-5 | 29 | 20,290 | 55 | 4,183,162 | 496 |
| synthesize:report | claude-sonnet-5 | 2 | 17,785 | 4 | 92,081 | 173 |
| triage | claude-sonnet-5 | 2 | 14,645 | 4 | 81,830 | 159 |
| refute:acceptance-verify.js | claude-sonnet-5 | 23 | 13,362 | 46 | 2,471,474 | 227 |
| refute:SKILL.md | claude-sonnet-5 | 13 | 10,505 | 26 | 1,240,940 | 162 |
| refute:SKILL.md | claude-sonnet-5 | 7 | 9,268 | 102 | 536,472 | 132 |
| refute:out-of-contract.js | claude-sonnet-5 | 10 | 6,352 | 20 | 872,875 | 104 |
| refute:acceptance-init.md | claude-sonnet-5 | 12 | 6,327 | 24 | 1,048,827 | 124 |
| refute:SKILL.md | claude-sonnet-5 | 16 | 6,049 | 32 | 1,514,803 | 142 |
| refute:gate-card.js | claude-sonnet-5 | 12 | 3,621 | 24 | 1,020,754 | 84 |
| refute:GUIDE.md | claude-sonnet-5 | 9 | 2,807 | 18 | 697,225 | 83 |
| judge:E11:domain-correctness | claude-sonnet-5 | 2 | 2,766 | 4 | 76,491 | 40 |
| judge:E11:operational-feasibility | claude-sonnet-5 | 2 | 2,086 | 4 | 76,493 | 30 |
| judge:E11:spec-alignment | claude-sonnet-5 | 2 | 1,658 | 4 | 76,491 | 27 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 976 | 26 | 117,419 | 60 |
| capture:provenance | claude-sonnet-5 | 2 | 764 | 4 | 76,446 | 15 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 697 | 18 | 56,623 | 46 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 414 | 18 | 56,623 | 17 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 306 | 18 | 56,623 | 15 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 205 | 18 | 73,986 | 11 |

- **claude-opus-5**: 2 agent · 56 calls · out 44,851 · in 105 · cache_read 7,827,974 · cache_create 398,493
- **claude-sonnet-5**: 14 agent · 114 calls · out 97,995 · in 316 · cache_read 9,883,202 · cache_create 1,263,089
- **claude-haiku-4-5-20251001**: 5 agent · 11 calls · out 2,598 · in 98 · cache_read 361,274 · cache_create 307,116

