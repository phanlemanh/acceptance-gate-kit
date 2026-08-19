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

### S4 round 2 — wf_127cf379-608 (21 agent, 106,426 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 7 | 19,990 | 14 | 469,131 | 223 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 9 | 9,732 | 18 | 570,723 | 130 |
| refute:rang.sh | claude-sonnet-5 | 18 | 8,904 | 36 | 1,146,910 | 148 |
| review:measurement | claude-fable-5 | 7 | 8,612 | 14 | 448,052 | 136 |
| refute:tool-kill-rule.md | claude-sonnet-5 | 13 | 7,776 | 26 | 891,951 | 115 |
| refute:acceptance-verify.js | claude-sonnet-5 | 15 | 7,703 | 30 | 1,159,834 | 124 |
| refute:SKILL.md | claude-sonnet-5 | 18 | 7,092 | 36 | 1,265,690 | 122 |
| review:conventions | claude-fable-5 | 17 | 6,350 | 34 | 1,261,431 | 143 |
| triage | claude-sonnet-5 | 2 | 6,191 | 4 | 56,970 | 77 |
| review:bugs | claude-fable-5 | 13 | 6,051 | 26 | 825,124 | 106 |
| refute:rang.sh | claude-sonnet-5 | 8 | 6,048 | 16 | 500,427 | 97 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 2,268 | 42 | 191,157 | 32 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,945 | 58 | 270,743 | 142 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,769 | 26 | 105,929 | 181 |
| machine:bash _acceptance/tool-kill-duong-doc-lap | claude-haiku-4-5-20251001 | 3 | 1,083 | 26 | 102,100 | 17 |
| machine:bash _acceptance/tool-kill-duong-doc-lap | claude-haiku-4-5-20251001 | 2 | 1,025 | 18 | 60,205 | 16 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 3 | 1,025 | 26 | 102,110 | 19 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 935 | 18 | 60,189 | 17 |
| machine:bash _acceptance/tool-kill-duong-doc-lap | claude-haiku-4-5-20251001 | 2 | 744 | 18 | 60,206 | 13 |
| machine:bash _acceptance/tool-kill-duong-doc-lap | claude-haiku-4-5-20251001 | 2 | 629 | 18 | 60,206 | 12 |
| capture:provenance | claude-sonnet-5 | 2 | 554 | 4 | 54,239 | 10 |

- **claude-sonnet-5**: 9 agent · 92 calls · out 73,990 · in 184 · cache_read 6,115,875 · cache_create 609,467
- **claude-fable-5**: 3 agent · 37 calls · out 21,013 · in 74 · cache_read 2,534,607 · cache_create 233,114
- **claude-haiku-4-5-20251001**: 9 agent · 29 calls · out 11,423 · in 250 · cache_read 1,012,845 · cache_create 229,279

### S4 round 3 — wf_e78221a7-e46 (15 agent, 59,642 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:SKILL.md | claude-sonnet-5 | 13 | 9,451 | 26 | 870,442 | 136 |
| review:measurement | claude-fable-5 | 8 | 7,267 | 16 | 536,447 | 162 |
| review:conventions | claude-fable-5 | 15 | 6,778 | 30 | 1,052,400 | 130 |
| refute:acceptance-verify.test.mjs | claude-sonnet-5 | 6 | 6,577 | 12 | 342,824 | 89 |
| refute:evals.yaml | claude-sonnet-5 | 12 | 6,064 | 24 | 805,583 | 91 |
| review:bugs | claude-fable-5 | 14 | 5,807 | 28 | 926,901 | 103 |
| refute:plugin.json | claude-sonnet-5 | 7 | 5,798 | 14 | 407,413 | 81 |
| triage | claude-sonnet-5 | 2 | 5,109 | 4 | 56,501 | 60 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,453 | 42 | 235,234 | 104 |
| capture:provenance | claude-sonnet-5 | 2 | 1,325 | 4 | 54,239 | 17 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,208 | 26 | 82,109 | 129 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,131 | 26 | 102,804 | 20 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 843 | 18 | 60,189 | 15 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 693 | 18 | 60,196 | 12 |
| synthesize:report | claude-sonnet-5 | 2 | 138 | 4 | 64,884 | 123 |

- **claude-sonnet-5**: 7 agent · 44 calls · out 34,462 · in 88 · cache_read 2,601,886 · cache_create 434,910
- **claude-fable-5**: 3 agent · 37 calls · out 19,852 · in 74 · cache_read 2,515,748 · cache_create 235,890
- **claude-haiku-4-5-20251001**: 5 agent · 15 calls · out 5,328 · in 130 · cache_read 540,532 · cache_create 193,307

