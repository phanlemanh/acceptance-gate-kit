### S4 round 1 — wf_9cdb6439-eba (18 agent, 68,631 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 9 | 15,519 | 18 | 554,786 | 171 |
| review:bugs | claude-fable-5 | 15 | 14,753 | 30 | 1,051,754 | 247 |
| review:conventions | claude-fable-5 | 16 | 13,469 | 32 | 1,105,767 | 226 |
| refute:run-tests.sh | claude-sonnet-5 | 6 | 4,561 | 12 | 262,871 | 63 |
| judge:E15:domain-correctness | claude-sonnet-5 | 2 | 3,256 | 4 | 43,757 | 48 |
| judge:E15:spec-alignment | claude-sonnet-5 | 2 | 3,002 | 4 | 43,757 | 43 |
| refute:run-tests.sh | claude-sonnet-5 | 4 | 2,698 | 8 | 139,803 | 38 |
| baseline:diffBase | claude-sonnet-5 | 11 | 2,576 | 22 | 490,702 | 109 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,634 | 50 | 165,390 | 100 |
| refute:SKILL.md | claude-sonnet-5 | 6 | 1,485 | 12 | 262,169 | 29 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,218 | 18 | 28,280 | 29 |
| refute:SKILL.md | claude-sonnet-5 | 5 | 1,183 | 10 | 192,239 | 23 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 984 | 18 | 45,840 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 889 | 18 | 28,280 | 14 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 535 | 18 | 28,284 | 9 |
| capture:provenance | claude-sonnet-5 | 2 | 435 | 4 | 43,370 | 7 |
| judge:E15:operational-feasibility | claude-sonnet-5 | 2 | 427 | 4 | 43,759 | 42 |
| triage | claude-sonnet-5 | 2 | 7 | 4 | 45,984 | 36 |

- **claude-sonnet-5**: 11 agent · 51 calls · out 35,149 · in 102 · cache_read 2,123,197 · cache_create 582,148
- **claude-fable-5**: 2 agent · 31 calls · out 28,222 · in 62 · cache_read 2,157,521 · cache_create 178,332
- **claude-haiku-4-5-20251001**: 5 agent · 14 calls · out 5,260 · in 122 · cache_read 296,074 · cache_create 150,516

