### S4 round 1 (BLOCKED — suite plugins bị cắt output) — wf_d91561f6-21e (26 agent, 64,139 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-fable-5-1 | 15 | 9,929 | 450 | 1,335,524 | 244 |
| refute:s4-args.mjs | claude-sonnet-5 | 10 | 8,491 | 20 | 764,684 | 178 |
| triage | claude-sonnet-5 | 2 | 8,420 | 4 | 64,234 | 108 |
| judge:E5:operational-feasibility | claude-sonnet-5 | 2 | 7,748 | 4 | 98,236 | 79 |
| review:measurement | claude-fable-5-1 | 4 | 7,291 | 98 | 225,329 | 124 |
| refute:rang.sh | claude-sonnet-5 | 14 | 6,300 | 28 | 1,027,803 | 181 |
| judge:E5:domain-correctness | claude-sonnet-5 | 3 | 3,034 | 6 | 172,346 | 66 |
| review:bugs | claude-fable-5-1 | 15 | 2,261 | 450 | 1,109,150 | 211 |
| refute:rang.sh | claude-sonnet-5 | 5 | 2,247 | 10 | 318,079 | 78 |
| refute:s4-args.mjs | claude-sonnet-5 | 6 | 1,872 | 12 | 401,133 | 86 |
| baseline:diffBase | claude-sonnet-5 | 11 | 1,717 | 22 | 667,546 | 53 |
| refute:rang.sh | claude-sonnet-5 | 7 | 1,118 | 14 | 412,062 | 87 |
| machine:bash _acceptance/inputs-tinh-tu-goc-kho/ | claude-haiku-4-5-20251001 | 3 | 1,053 | 26 | 114,239 | 16 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 785 | 34 | 159,751 | 172 |
| machine:bash _acceptance/inputs-tinh-tu-goc-kho/ | claude-haiku-4-5-20251001 | 2 | 461 | 18 | 70,013 | 11 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 388 | 18 | 69,988 | 11 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 345 | 42 | 209,434 | 24 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 342 | 18 | 69,995 | 8 |
| capture:provenance | claude-sonnet-5 | 2 | 286 | 4 | 59,871 | 11 |
| machine:bash _acceptance/inputs-tinh-tu-goc-kho/ | claude-haiku-4-5-20251001 | 2 | 11 | 18 | 41,481 | 11 |
| judge:E5:spec-alignment | claude-sonnet-5 | 3 | 10 | 6 | 209,640 | 85 |
| machine:bash _acceptance/inputs-tinh-tu-goc-kho/ | claude-haiku-4-5-20251001 | 2 | 9 | 18 | 70,013 | 10 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 8 | 18 | 69,988 | 311 |
| synthesize:report | claude-sonnet-5 | 2 | 7 | 4 | 73,899 | 189 |
| machine:bash _acceptance/inputs-tinh-tu-goc-kho/ | claude-haiku-4-5-20251001 | 2 | 3 | 18 | 70,020 | 9 |
| machine:bash _acceptance/inputs-tinh-tu-goc-kho/ | claude-haiku-4-5-20251001 | 2 | 3 | 18 | 70,015 | 13 |

- **claude-fable-5-1**: 3 agent · 34 calls · out 19,481 · in 998 · cache_read 2,670,003 · cache_create 247,034
- **claude-sonnet-5**: 12 agent · 67 calls · out 41,250 · in 134 · cache_read 4,269,533 · cache_create 855,795
- **claude-haiku-4-5-20251001**: 11 agent · 28 calls · out 3,408 · in 246 · cache_read 1,014,937 · cache_create 212,271

### S4 round 1 (chạy lại — REJECT: suite plugins P93 + finding AC-6) — wf_e6643a15-a02 (28 agent, 66,672 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 13 | 8,392 | 26 | 1,210,790 | 246 |
| review:bugs | claude-fable-5-1 | 8 | 8,282 | 226 | 581,240 | 168 |
| refute:SKILL.md | claude-sonnet-5 | 9 | 6,540 | 18 | 587,962 | 107 |
| refute:rang.sh | claude-sonnet-5 | 6 | 6,505 | 12 | 347,819 | 129 |
| refute:s4-args.mjs | claude-sonnet-5 | 21 | 6,382 | 42 | 1,545,255 | 170 |
| review:conventions | claude-fable-5-1 | 10 | 4,997 | 290 | 899,214 | 222 |
| review:measurement | claude-fable-5-1 | 6 | 4,894 | 162 | 358,099 | 134 |
| refute:rang.sh | claude-sonnet-5 | 5 | 4,183 | 10 | 319,815 | 96 |
| refute:s4-args-judgment-inputs.test.mjs | claude-sonnet-5 | 12 | 2,772 | 24 | 847,364 | 111 |
| refute:s4-args.mjs | claude-sonnet-5 | 15 | 2,718 | 30 | 1,135,928 | 166 |
| judge:E5:operational-feasibility | claude-sonnet-5 | 3 | 2,676 | 6 | 209,334 | 53 |
| refute:rang.sh | claude-sonnet-5 | 10 | 1,776 | 20 | 701,700 | 165 |
| refute:s4-args.mjs | claude-sonnet-5 | 11 | 1,157 | 22 | 751,163 | 117 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,050 | 26 | 114,691 | 18 |
| machine:bash _acceptance/inputs-tinh-tu-goc-kho/ | claude-haiku-4-5-20251001 | 2 | 977 | 18 | 41,469 | 12 |
| capture:provenance | claude-sonnet-5 | 2 | 819 | 4 | 59,858 | 14 |
| judge:E5:spec-alignment | claude-sonnet-5 | 3 | 706 | 6 | 209,584 | 74 |
| machine:bash _acceptance/inputs-tinh-tu-goc-kho/ | claude-haiku-4-5-20251001 | 2 | 691 | 18 | 69,996 | 11 |
| machine:bash _acceptance/inputs-tinh-tu-goc-kho/ | claude-haiku-4-5-20251001 | 2 | 527 | 18 | 69,989 | 14 |
| machine:bash _acceptance/inputs-tinh-tu-goc-kho/ | claude-haiku-4-5-20251001 | 2 | 328 | 18 | 69,991 | 13 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 250 | 34 | 159,713 | 327 |
| triage | claude-sonnet-5 | 3 | 25 | 6 | 131,996 | 80 |
| judge:E5:domain-correctness | claude-sonnet-5 | 3 | 12 | 6 | 171,838 | 67 |
| machine:bash _acceptance/inputs-tinh-tu-goc-kho/ | claude-haiku-4-5-20251001 | 2 | 3 | 18 | 69,989 | 12 |
| machine:bash _acceptance/inputs-tinh-tu-goc-kho/ | claude-haiku-4-5-20251001 | 2 | 3 | 18 | 69,992 | 13 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 3 | 18 | 69,964 | 299 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 2 | 18 | 69,971 | 9 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 2 | 18 | 69,964 | 13 |

- **claude-sonnet-5**: 14 agent · 116 calls · out 44,663 · in 232 · cache_read 8,230,406 · cache_create 935,902
- **claude-fable-5-1**: 3 agent · 24 calls · out 18,173 · in 678 · cache_read 1,838,553 · cache_create 321,461
- **claude-haiku-4-5-20251001**: 11 agent · 25 calls · out 3,836 · in 222 · cache_read 875,729 · cache_create 226,018

