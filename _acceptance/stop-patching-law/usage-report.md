### S4 round 2 — wf_eace13f2-89d (24 agent, 140,648 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-fable-5 | 28 | 26,844 | 53 | 2,486,385 | 767 |
| review:bugs | claude-fable-5 | 20 | 22,767 | 39 | 1,577,693 | 460 |
| synthesize:report | claude-sonnet-5 | 7 | 16,498 | 14 | 463,890 | 223 |
| review:measurement | claude-fable-5 | 6 | 13,721 | 12 | 308,801 | 220 |
| refute:run-tests.sh | claude-sonnet-5 | 24 | 9,704 | 48 | 1,492,880 | 487 |
| refute:hanh-vi-B1-claude-khong.md | claude-sonnet-5 | 15 | 9,413 | 30 | 884,914 | 180 |
| refute:evals.yaml | claude-sonnet-5 | 12 | 6,879 | 24 | 695,828 | 143 |
| triage | claude-sonnet-5 | 2 | 6,524 | 4 | 50,842 | 85 |
| refute:run-tests.sh | claude-sonnet-5 | 8 | 5,185 | 16 | 393,023 | 96 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 4,777 | 20 | 521,740 | 102 |
| refute:plugin.json | claude-sonnet-5 | 8 | 3,024 | 16 | 421,568 | 72 |
| refute:run-tests.sh | claude-sonnet-5 | 6 | 2,437 | 12 | 291,215 | 66 |
| refute:run-tests.sh | claude-sonnet-5 | 7 | 2,087 | 14 | 356,821 | 65 |
| baseline:diffBase | claude-sonnet-5 | 8 | 1,896 | 16 | 361,992 | 258 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,843 | 58 | 196,906 | 411 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,542 | 58 | 197,973 | 108 |
| judge:J1:operational-feasibility | claude-sonnet-5 | 2 | 1,535 | 4 | 46,444 | 22 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,135 | 50 | 173,276 | 26 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 817 | 18 | 29,293 | 13 |
| capture:provenance | claude-sonnet-5 | 2 | 783 | 4 | 45,445 | 12 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 666 | 18 | 29,300 | 10 |
| judge:J1:spec-alignment | claude-sonnet-5 | 3 | 560 | 6 | 96,153 | 40 |
| judge:J1:domain-correctness | claude-sonnet-5 | 2 | 7 | 4 | 46,442 | 31 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 4 | 18 | 47,221 | 10 |

- **claude-fable-5**: 3 agent · 54 calls · out 63,332 · in 104 · cache_read 4,372,879 · cache_create 351,384
- **claude-sonnet-5**: 15 agent · 116 calls · out 71,309 · in 232 · cache_read 6,169,197 · cache_create 852,932
- **claude-haiku-4-5-20251001**: 6 agent · 26 calls · out 6,007 · in 220 · cache_read 673,969 · cache_create 187,568

### S4 round 1 — wf_c0ded90d-fdd (37 agent, 235,710 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 31,630 | 4 | 63,337 | 343 |
| review:bugs | claude-opus-5 | 39 | 23,230 | 75 | 3,231,519 | 818 |
| review:measurement | claude-opus-5 | 38 | 19,178 | 73 | 3,051,086 | 1169 |
| review:conventions | claude-opus-5 | 15 | 13,804 | 28 | 1,049,501 | 262 |
| refute:run-tests.sh | claude-sonnet-5 | 12 | 9,928 | 24 | 618,000 | 149 |
| refute:evals.yaml | claude-sonnet-5 | 13 | 9,798 | 4,202 | 816,384 | 189 |
| refute:evals.yaml | claude-sonnet-5 | 14 | 9,006 | 28 | 857,027 | 183 |
| refute:make-record.mjs | claude-sonnet-5 | 11 | 8,936 | 22 | 588,586 | 236 |
| refute:SKILL.md | claude-sonnet-5 | 10 | 8,097 | 20 | 560,806 | 199 |
| triage | claude-sonnet-5 | 2 | 8,006 | 4 | 51,956 | 102 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 7,767 | 468 | 498,923 | 123 |
| judge:J2:spec-alignment | claude-sonnet-5 | 4 | 7,405 | 8 | 169,573 | 91 |
| refute:run-tests.sh | claude-sonnet-5 | 33 | 7,317 | 66 | 2,099,064 | 211 |
| judge:J3:domain-correctness | claude-sonnet-5 | 3 | 7,092 | 6 | 118,215 | 89 |
| judge:J4:operational-feasibility | claude-sonnet-5 | 9 | 6,469 | 18 | 527,009 | 104 |
| judge:J1:domain-correctness | claude-sonnet-5 | 4 | 5,762 | 8 | 146,385 | 73 |
| judge:J4:domain-correctness | claude-sonnet-5 | 3 | 5,403 | 1,162 | 118,321 | 67 |
| judge:J2:operational-feasibility | claude-sonnet-5 | 4 | 5,073 | 8 | 143,679 | 61 |
| refute:2026-08-07-stop-patching-law.md | claude-sonnet-5 | 18 | 4,951 | 36 | 1,022,938 | 231 |
| judge:J3:spec-alignment | claude-sonnet-5 | 4 | 4,752 | 1,164 | 167,413 | 62 |
| baseline:diffBase | claude-sonnet-5 | 21 | 4,462 | 42 | 1,114,349 | 246 |
| refute:plugin.json | claude-sonnet-5 | 8 | 4,385 | 16 | 396,590 | 72 |
| refute:run-tests.sh | claude-sonnet-5 | 17 | 4,146 | 34 | 895,088 | 100 |
| refute:run-tests.sh | claude-sonnet-5 | 11 | 4,093 | 22 | 532,710 | 96 |
| refute:2026-08-05-judge-required-evidence.md | claude-sonnet-5 | 8 | 3,647 | 16 | 381,813 | 91 |
| judge:J2:domain-correctness | claude-sonnet-5 | 5 | 1,703 | 10 | 193,046 | 144 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 8 | 1,693 | 66 | 258,499 | 160 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,560 | 58 | 193,045 | 114 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,390 | 26 | 61,014 | 21 |
| judge:J1:spec-alignment | claude-sonnet-5 | 4 | 1,136 | 8 | 146,124 | 26 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 806 | 18 | 29,035 | 16 |
| judge:J3:operational-feasibility | claude-sonnet-5 | 3 | 800 | 6 | 118,345 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 689 | 18 | 29,042 | 11 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 530 | 18 | 29,039 | 9 |
| judge:J4:spec-alignment | claude-sonnet-5 | 4 | 476 | 8 | 167,074 | 47 |
| capture:provenance | claude-sonnet-5 | 2 | 330 | 4 | 45,108 | 12 |
| judge:J1:operational-feasibility | claude-sonnet-5 | 3 | 260 | 6 | 95,820 | 44 |

- **claude-sonnet-5**: 28 agent · 242 calls · out 172,830 · in 7,420 · cache_read 12,653,683 · cache_create 1,687,584
- **claude-opus-5**: 3 agent · 92 calls · out 56,212 · in 176 · cache_read 7,332,106 · cache_create 281,413
- **claude-haiku-4-5-20251001**: 6 agent · 24 calls · out 6,668 · in 204 · cache_read 599,674 · cache_create 217,507

