### S4 round 1 — wf_c0dad5d1-a22 (21 agent, 139,514 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:hfl_clause.py | claude-sonnet-5 | 18 | 16,012 | 36 | 1,159,864 | 253 |
| triage | claude-sonnet-5 | 2 | 15,990 | 4 | 46,382 | 180 |
| review:bugs | claude-fable-5 | 12 | 11,917 | 24 | 696,850 | 211 |
| refute:rang.sh | claude-sonnet-5 | 7 | 11,834 | 14 | 323,136 | 160 |
| refute:rang.sh | claude-sonnet-5 | 8 | 11,804 | 16 | 388,136 | 157 |
| synthesize:report | claude-sonnet-5 | 2 | 9,975 | 4 | 53,372 | 105 |
| refute:rang.sh | claude-sonnet-5 | 11 | 9,556 | 22 | 543,537 | 149 |
| refute:rang.sh | claude-sonnet-5 | 7 | 9,351 | 14 | 308,827 | 119 |
| refute:run-tests.sh | claude-sonnet-5 | 21 | 8,349 | 42 | 1,178,664 | 173 |
| review:measurement | claude-fable-5 | 7 | 8,327 | 14 | 340,145 | 126 |
| review:conventions | claude-fable-5 | 6 | 6,743 | 12 | 259,302 | 107 |
| refute:run-tests.sh | claude-sonnet-5 | 14 | 6,564 | 89 | 730,034 | 114 |
| refute:rang.sh | claude-sonnet-5 | 9 | 3,469 | 18 | 425,315 | 71 |
| baseline:diffBase | claude-sonnet-5 | 7 | 2,461 | 14 | 283,129 | 139 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,515 | 42 | 139,958 | 22 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,371 | 58 | 209,256 | 247 |
| machine:bash _acceptance/siet-rang-cau-ve-hinh/r | claude-haiku-4-5-20251001 | 3 | 1,252 | 26 | 55,415 | 35 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,143 | 34 | 105,136 | 114 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 906 | 18 | 45,480 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 570 | 18 | 45,487 | 9 |
| capture:provenance | claude-sonnet-5 | 2 | 405 | 4 | 41,887 | 8 |

- **claude-sonnet-5**: 12 agent · 108 calls · out 105,770 · in 277 · cache_read 5,482,283 · cache_create 580,492
- **claude-fable-5**: 3 agent · 25 calls · out 26,987 · in 50 · cache_read 1,296,297 · cache_create 165,291
- **claude-haiku-4-5-20251001**: 6 agent · 23 calls · out 6,757 · in 196 · cache_read 600,732 · cache_create 92,314

### S4 round 2 — wf_237f087f-131 (19 agent, 110,595 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 18 | 14,581 | 36 | 1,153,552 | 298 |
| synthesize:report | claude-sonnet-5 | 2 | 13,814 | 4 | 52,070 | 149 |
| refute:run-tests.sh | claude-sonnet-5 | 9 | 11,631 | 18 | 433,773 | 162 |
| refute:evidence-report.md | claude-sonnet-5 | 18 | 10,557 | 78 | 1,041,733 | 190 |
| review:conventions | claude-fable-5 | 16 | 9,526 | 32 | 1,077,243 | 205 |
| refute:rang.sh | claude-sonnet-5 | 9 | 8,854 | 82 | 437,803 | 131 |
| refute:rang.sh | claude-sonnet-5 | 13 | 7,677 | 1,047 | 657,652 | 110 |
| review:measurement | claude-fable-5 | 7 | 7,177 | 14 | 345,349 | 117 |
| triage | claude-sonnet-5 | 2 | 6,145 | 4 | 45,492 | 76 |
| refute:hfl_clause.py | claude-sonnet-5 | 10 | 5,856 | 20 | 467,254 | 86 |
| refute:evals.yaml | claude-sonnet-5 | 9 | 5,364 | 18 | 453,848 | 85 |
| refute:run-tests.sh | claude-sonnet-5 | 6 | 2,332 | 12 | 264,737 | 36 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,525 | 42 | 136,535 | 126 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,233 | 42 | 179,745 | 255 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,002 | 50 | 172,055 | 25 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 4 | 964 | 34 | 103,288 | 14 |
| capture:provenance | claude-sonnet-5 | 2 | 859 | 4 | 41,887 | 14 |
| machine:bash _acceptance/siet-rang-cau-ve-hinh/r | claude-haiku-4-5-20251001 | 2 | 783 | 18 | 26,604 | 30 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 715 | 18 | 45,480 | 11 |

- **claude-fable-5**: 3 agent · 41 calls · out 31,284 · in 82 · cache_read 2,576,144 · cache_create 206,816
- **claude-sonnet-5**: 10 agent · 80 calls · out 73,089 · in 1,287 · cache_read 3,896,249 · cache_create 453,299
- **claude-haiku-4-5-20251001**: 6 agent · 24 calls · out 6,222 · in 204 · cache_read 663,707 · cache_create 116,202

### S4 round 3 — wf_df5473ce-293 (18 agent, 139,380 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 18 | 21,673 | 36 | 1,385,130 | 340 |
| synthesize:report | claude-sonnet-5 | 4 | 19,307 | 8 | 186,416 | 220 |
| refute:evidence-report.md | claude-sonnet-5 | 22 | 16,975 | 3,081 | 1,337,152 | 295 |
| review:conventions | claude-fable-5 | 26 | 15,530 | 52 | 1,889,635 | 252 |
| review:measurement | claude-fable-5 | 9 | 13,409 | 18 | 507,133 | 201 |
| refute:hfl_clause.py | claude-sonnet-5 | 10 | 11,233 | 20 | 499,980 | 160 |
| refute:rang.sh | claude-sonnet-5 | 20 | 10,037 | 40 | 1,057,742 | 193 |
| refute:rang.sh | claude-sonnet-5 | 14 | 8,922 | 28 | 763,328 | 180 |
| triage | claude-sonnet-5 | 2 | 6,965 | 4 | 46,140 | 87 |
| refute:rang.sh | claude-sonnet-5 | 10 | 6,589 | 4,206 | 549,698 | 110 |
| refute:rang.sh | claude-sonnet-5 | 4 | 2,684 | 8 | 164,880 | 50 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,076 | 26 | 74,904 | 112 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,054 | 26 | 74,951 | 16 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,025 | 42 | 135,149 | 131 |
| capture:provenance | claude-sonnet-5 | 3 | 855 | 6 | 93,212 | 16 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 783 | 18 | 45,480 | 12 |
| machine:bash _acceptance/siet-rang-cau-ve-hinh/r | claude-haiku-4-5-20251001 | 2 | 694 | 18 | 26,604 | 32 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 569 | 18 | 45,487 | 8 |

- **claude-fable-5**: 3 agent · 53 calls · out 50,612 · in 106 · cache_read 3,781,898 · cache_create 238,062
- **claude-sonnet-5**: 9 agent · 89 calls · out 83,567 · in 7,401 · cache_read 4,698,548 · cache_create 481,332
- **claude-haiku-4-5-20251001**: 6 agent · 17 calls · out 5,201 · in 148 · cache_read 402,575 · cache_create 116,619

### S4 round 4 — wf_785c4a3e-adc (16 agent, 121,826 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:rang.sh | claude-sonnet-5 | 30 | 20,242 | 60 | 2,111,760 | 322 |
| refute:run-tests.sh | claude-sonnet-5 | 18 | 18,683 | 36 | 1,104,775 | 283 |
| review:measurement | claude-fable-5 | 10 | 18,602 | 20 | 605,150 | 259 |
| synthesize:report | claude-sonnet-5 | 8 | 16,098 | 16 | 457,837 | 211 |
| refute:rang.sh | claude-sonnet-5 | 13 | 10,411 | 26 | 741,007 | 154 |
| review:bugs | claude-fable-5 | 7 | 10,034 | 14 | 343,323 | 129 |
| refute:run-tests.sh | claude-sonnet-5 | 9 | 9,653 | 18 | 476,127 | 131 |
| review:conventions | claude-fable-5 | 9 | 7,436 | 18 | 467,219 | 131 |
| triage | claude-sonnet-5 | 2 | 3,003 | 4 | 44,058 | 38 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,596 | 50 | 171,183 | 140 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,567 | 50 | 170,480 | 123 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,378 | 26 | 75,299 | 18 |
| capture:provenance | claude-sonnet-5 | 2 | 1,053 | 4 | 41,962 | 17 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 731 | 18 | 45,553 | 10 |
| machine:bash _acceptance/siet-rang-cau-ve-hinh/r | claude-haiku-4-5-20251001 | 2 | 686 | 18 | 26,670 | 37 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 653 | 18 | 45,546 | 15 |

- **claude-sonnet-5**: 7 agent · 82 calls · out 79,143 · in 164 · cache_read 4,977,526 · cache_create 428,779
- **claude-fable-5**: 3 agent · 26 calls · out 36,072 · in 52 · cache_read 1,415,692 · cache_create 193,460
- **claude-haiku-4-5-20251001**: 6 agent · 21 calls · out 6,611 · in 180 · cache_read 534,731 · cache_create 104,229

### S4 round 5 — wf_0f8076f9-445 (17 agent, 126,824 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:run-tests.sh | claude-sonnet-5 | 24 | 24,427 | 48 | 1,617,439 | 362 |
| refute:rang.sh | claude-sonnet-5 | 24 | 17,964 | 48 | 1,585,286 | 283 |
| refute:run-tests.sh | claude-sonnet-5 | 15 | 14,075 | 30 | 843,925 | 219 |
| review:measurement | claude-fable-5 | 10 | 13,571 | 20 | 618,275 | 201 |
| synthesize:report | claude-sonnet-5 | 6 | 12,630 | 12 | 322,024 | 157 |
| review:bugs | claude-fable-5 | 9 | 7,797 | 18 | 486,515 | 141 |
| review:conventions | claude-fable-5 | 10 | 6,502 | 20 | 538,937 | 128 |
| refute:rang.sh | claude-sonnet-5 | 5 | 6,442 | 10 | 203,559 | 81 |
| triage | claude-sonnet-5 | 2 | 6,153 | 4 | 46,020 | 75 |
| refute:evals.yaml | claude-sonnet-5 | 10 | 5,589 | 20 | 537,305 | 89 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 16 | 3,118 | 130 | 527,785 | 249 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 9 | 2,300 | 74 | 295,980 | 264 |
| capture:provenance | claude-sonnet-5 | 3 | 2,192 | 6 | 96,290 | 26 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,887 | 42 | 141,361 | 24 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 838 | 18 | 47,734 | 18 |
| machine:bash _acceptance/siet-rang-cau-ve-hinh/r | claude-haiku-4-5-20251001 | 2 | 719 | 18 | 27,764 | 37 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 620 | 18 | 47,741 | 8 |

- **claude-sonnet-5**: 8 agent · 89 calls · out 89,472 · in 178 · cache_read 5,251,848 · cache_create 462,360
- **claude-fable-5**: 3 agent · 29 calls · out 27,870 · in 58 · cache_read 1,643,727 · cache_create 189,229
- **claude-haiku-4-5-20251001**: 6 agent · 36 calls · out 9,482 · in 300 · cache_read 1,088,365 · cache_create 99,614

