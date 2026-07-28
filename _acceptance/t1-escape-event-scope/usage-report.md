### S4 round 7 (delta premerge-rules-ledger) — wf_8cea9339-6ea (16 agent, 76,300 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 6 | 18,112 | 12 | 520,785 | 183 |
| review:bugs | claude-fable-5 | 8 | 16,223 | 15 | 742,228 | 243 |
| review:conventions | claude-fable-5 | 9 | 9,175 | 17 | 769,388 | 159 |
| refute:0006-rules-ledger-fail-closed-at-output.md | claude-sonnet-5 | 10 | 7,363 | 20 | 779,729 | 118 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 8 | 7,257 | 16 | 626,165 | 109 |
| judge:E13:spec-alignment | claude-sonnet-5 | 2 | 4,092 | 4 | 75,302 | 50 |
| scribe:run-log | claude-haiku-4-5-20251001 | 5 | 3,286 | 42 | 242,037 | 41 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 8 | 3,199 | 16 | 580,788 | 76 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 2,885 | 20 | 754,055 | 82 |
| judge:E13:domain-correctness | claude-sonnet-5 | 2 | 1,183 | 4 | 75,302 | 20 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,037 | 42 | 234,470 | 103 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 718 | 18 | 55,765 | 15 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 613 | 18 | 73,127 | 38 |
| capture:provenance | claude-sonnet-5 | 2 | 609 | 4 | 75,324 | 12 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 540 | 18 | 55,769 | 10 |
| judge:E13:operational-feasibility | claude-sonnet-5 | 2 | 8 | 4 | 75,304 | 40 |

- **claude-sonnet-5**: 9 agent · 50 calls · out 44,708 · in 100 · cache_read 3,562,754 · cache_create 799,267
- **claude-fable-5**: 2 agent · 17 calls · out 25,398 · in 32 · cache_read 1,511,616 · cache_create 257,025
- **claude-haiku-4-5-20251001**: 5 agent · 16 calls · out 6,194 · in 138 · cache_read 661,168 · cache_create 284,800

### S4 round 8 (delta fix leftover) — wf_2d38f6e0-704 (15 agent, 80,573 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 14 | 21,318 | 27 | 1,618,924 | 404 |
| synthesize:report | claude-sonnet-5 | 9 | 15,717 | 18 | 870,256 | 173 |
| review:conventions | claude-fable-5 | 16 | 13,682 | 30 | 1,689,885 | 354 |
| refute:evidence-report.md | claude-sonnet-5 | 6 | 6,229 | 12 | 413,600 | 97 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 14 | 5,452 | 28 | 1,191,517 | 111 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 3,256 | 20 | 760,844 | 78 |
| judge:E13:operational-feasibility | claude-sonnet-5 | 2 | 3,177 | 4 | 75,304 | 40 |
| judge:E13:spec-alignment | claude-sonnet-5 | 3 | 3,167 | 6 | 154,644 | 41 |
| judge:E13:domain-correctness | claude-sonnet-5 | 2 | 2,903 | 4 | 75,302 | 37 |
| scribe:run-log | claude-haiku-4-5-20251001 | 5 | 2,665 | 42 | 265,420 | 37 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,505 | 42 | 234,964 | 150 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 569 | 18 | 55,765 | 38 |
| capture:provenance | claude-sonnet-5 | 2 | 418 | 4 | 75,324 | 12 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 295 | 18 | 73,127 | 17 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 220 | 18 | 55,769 | 11 |

- **claude-fable-5**: 2 agent · 30 calls · out 35,000 · in 57 · cache_read 3,308,809 · cache_create 300,900
- **claude-sonnet-5**: 8 agent · 48 calls · out 40,319 · in 96 · cache_read 3,616,791 · cache_create 699,818
- **claude-haiku-4-5-20251001**: 5 agent · 16 calls · out 5,254 · in 138 · cache_read 685,045 · cache_create 293,066

### S4 round 10 (re-pin cuối) — wf_2077e13c-d8b (9 agent, 45,856 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 16 | 18,000 | 31 | 1,901,779 | 318 |
| review:conventions | claude-fable-5 | 14 | 14,140 | 27 | 1,482,243 | 303 |
| synthesize:report | claude-sonnet-5 | 9 | 7,317 | 18 | 882,326 | 220 |
| scribe:run-log | claude-haiku-4-5-20251001 | 5 | 2,316 | 42 | 240,763 | 38 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,806 | 50 | 301,261 | 75 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 758 | 18 | 56,063 | 16 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 743 | 18 | 56,063 | 38 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 445 | 18 | 56,067 | 9 |
| capture:provenance | claude-sonnet-5 | 2 | 331 | 4 | 75,845 | 12 |

- **claude-fable-5**: 2 agent · 30 calls · out 32,140 · in 58 · cache_read 3,384,022 · cache_create 302,906
- **claude-sonnet-5**: 2 agent · 11 calls · out 7,648 · in 22 · cache_read 958,171 · cache_create 211,963
- **claude-haiku-4-5-20251001**: 5 agent · 17 calls · out 6,068 · in 146 · cache_read 710,217 · cache_create 305,622

### S4 round 12 (staleness re-verify; attempt 1 BLOCKED, resumed) — wf_5dcf3227-e2c (38 agent, 215,782 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5 | 42 | 30,742 | 79 | 6,097,950 | 661 |
| review:bugs | claude-opus-5 | 32 | 29,276 | 61 | 4,172,217 | 589 |
| review:conventions | claude-opus-5 | 34 | 23,692 | 65 | 4,446,297 | 526 |
| review:bugs | claude-opus-5 | 38 | 23,689 | 72 | 5,522,040 | 596 |
| refute:acceptance-verify.js | claude-sonnet-5 | 25 | 12,111 | 50 | 2,397,006 | 262 |
| refute:acceptance-verify.js | claude-sonnet-5 | 16 | 10,631 | 32 | 1,456,352 | 258 |
| refute:acceptance-verify.js | claude-sonnet-5 | 22 | 10,041 | 180 | 2,127,219 | 298 |
| refute:SKILL.md | claude-sonnet-5 | 14 | 9,515 | 28 | 1,203,969 | 178 |
| refute:gate-card.js | claude-sonnet-5 | 22 | 8,690 | 44 | 1,991,626 | 237 |
| refute:SKILL.md | claude-sonnet-5 | 16 | 7,478 | 1,468 | 1,323,784 | 189 |
| refute:out-of-contract.js | claude-sonnet-5 | 15 | 6,985 | 30 | 1,203,173 | 181 |
| refute:acceptance-verify.js | claude-sonnet-5 | 20 | 6,270 | 77 | 1,862,438 | 209 |
| refute:CONTEXT.md | claude-sonnet-5 | 11 | 5,877 | 3,968 | 863,681 | 143 |
| refute:acceptance-verify.js | claude-sonnet-5 | 15 | 3,915 | 30 | 1,373,780 | 139 |
| refute:render-out-of-contract-block.sh | claude-sonnet-5 | 10 | 3,204 | 20 | 691,275 | 164 |
| refute:gate-card.js | claude-sonnet-5 | 12 | 2,467 | 24 | 902,650 | 113 |
| refute:SKILL.md | claude-sonnet-5 | 12 | 2,330 | 114 | 986,212 | 156 |
| refute:SKILL.md | claude-sonnet-5 | 7 | 2,086 | 14 | 479,072 | 67 |
| refute:SKILL.md | claude-sonnet-5 | 10 | 1,998 | 288 | 883,577 | 96 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 8 | 1,788 | 68 | 375,268 | 192 |
| refute:gate-card.js | claude-sonnet-5 | 5 | 1,776 | 10 | 313,274 | 39 |
| refute:SKILL.md | claude-sonnet-5 | 9 | 1,678 | 18 | 695,082 | 204 |
| baseline:diffBase | claude-sonnet-5 | 7 | 1,623 | 14 | 435,320 | 68 |
| refute:SKILL.md | claude-sonnet-5 | 7 | 1,456 | 14 | 493,030 | 48 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,190 | 50 | 262,466 | 104 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 917 | 18 | 47,428 | 14 |
| refute:plugin.json | claude-sonnet-5 | 7 | 813 | 14 | 473,380 | 75 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 771 | 18 | 64,807 | 14 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 636 | 18 | 64,807 | 46 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 583 | 18 | 47,428 | 13 |
| capture:provenance | claude-sonnet-5 | 2 | 337 | 4 | 89,678 | 14 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 325 | 18 | 63,777 | 18 |
| capture:provenance | claude-sonnet-5 | 2 | 281 | 4 | 67,884 | 12 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 256 | 18 | 63,781 | 10 |
| synthesize:report | claude-sonnet-5 | 7 | 231 | 14 | 628,567 | 295 |
| synthesize:report | claude-sonnet-5 | 2 | 117 | 4 | 81,195 | 244 |
| refute:SKILL.md | claude-sonnet-5 | 1 | 5 | 2 | 23,110 | 196 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 2 | 18 | 47,432 | 12 |

- **claude-opus-5**: 4 agent · 146 calls · out 107,399 · in 277 · cache_read 20,238,504 · cache_create 748,895
- **claude-sonnet-5**: 25 agent · 276 calls · out 101,915 · in 6,465 · cache_read 23,046,334 · cache_create 2,020,415
- **claude-haiku-4-5-20251001**: 9 agent · 28 calls · out 6,468 · in 244 · cache_read 1,037,194 · cache_create 389,291

