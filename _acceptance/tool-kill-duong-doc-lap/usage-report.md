### S4 round 1 — wf_8d258aee-3cc (25 agent, 117,250 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-fable-5 | 26 | 12,580 | 52 | 2,398,173 | 210 |
| synthesize:report | claude-sonnet-5 | 2 | 12,297 | 4 | 65,827 | 126 |
| refute:tool-kill-rule.md | claude-sonnet-5 | 14 | 11,433 | 28 | 941,986 | 154 |
| refute:SKILL.md | claude-sonnet-5 | 12 | 9,814 | 24 | 823,116 | 139 |
| triage | claude-sonnet-5 | 2 | 9,346 | 4 | 57,988 | 108 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 8 | 8,634 | 16 | 471,144 | 109 |
| review:bugs | claude-fable-5 | 17 | 8,485 | 34 | 1,304,018 | 139 |
| refute:rang.sh | claude-sonnet-5 | 13 | 7,064 | 26 | 801,092 | 145 |
| review:measurement | claude-fable-5 | 6 | 6,899 | 12 | 320,271 | 108 |
| refute:SKILL.md | claude-sonnet-5 | 6 | 5,883 | 12 | 351,686 | 78 |
| baseline:diffBase | claude-sonnet-5 | 10 | 4,489 | 20 | 549,010 | 74 |
| judge:E6:operational-feasibility | claude-sonnet-5 | 3 | 3,448 | 6 | 115,875 | 44 |
| refute:SKILL.md | claude-sonnet-5 | 7 | 2,949 | 14 | 422,544 | 51 |
| judge:E6:domain-correctness | claude-sonnet-5 | 2 | 2,141 | 4 | 82,697 | 24 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,761 | 42 | 190,412 | 253 |
| machine:bash _acceptance/tool-kill-duong-doc-lap | claude-haiku-4-5-20251001 | 3 | 1,747 | 26 | 102,109 | 27 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,513 | 42 | 189,525 | 30 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,423 | 42 | 188,884 | 180 |
| machine:bash _acceptance/tool-kill-duong-doc-lap | claude-haiku-4-5-20251001 | 2 | 920 | 18 | 39,482 | 15 |
| machine:bash _acceptance/tool-kill-duong-doc-lap | claude-haiku-4-5-20251001 | 2 | 871 | 18 | 60,139 | 14 |
| machine:bash _acceptance/tool-kill-duong-doc-lap | claude-haiku-4-5-20251001 | 2 | 758 | 18 | 60,140 | 12 |
| judge:E6:spec-alignment | claude-sonnet-5 | 2 | 753 | 4 | 82,697 | 18 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 711 | 18 | 60,123 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 702 | 18 | 60,130 | 11 |
| capture:provenance | claude-sonnet-5 | 3 | 629 | 6 | 111,419 | 15 |

- **claude-fable-5**: 3 agent · 49 calls · out 27,964 · in 98 · cache_read 4,022,462 · cache_create 270,735
- **claude-sonnet-5**: 13 agent · 84 calls · out 78,880 · in 168 · cache_read 4,877,081 · cache_create 761,928
- **claude-haiku-4-5-20251001**: 9 agent · 28 calls · out 10,406 · in 242 · cache_read 950,944 · cache_create 219,772

