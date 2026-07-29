### S4 round 1 (void — thiếu contractPath) — wf_c688138b-31d (23 agent, 64,238 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-fable-5 | 21 | 10,442 | 42 | 1,226,862 | 226 |
| review:bugs | claude-fable-5 | 9 | 8,824 | 18 | 463,010 | 153 |
| refute:claim-scan.mjs | claude-sonnet-5 | 13 | 6,827 | 26 | 634,629 | 127 |
| judge:E11:domain-correctness | claude-sonnet-5 | 3 | 5,706 | 6 | 92,002 | 81 |
| refute:claim-scan.mjs | claude-sonnet-5 | 12 | 4,540 | 24 | 673,164 | 129 |
| refute:claim-scan.mjs | claude-sonnet-5 | 17 | 4,055 | 34 | 938,784 | 154 |
| judge:E10:operational-feasibility | claude-sonnet-5 | 2 | 4,003 | 4 | 42,511 | 49 |
| refute:claim-scan.mjs | claude-sonnet-5 | 12 | 3,955 | 24 | 715,248 | 143 |
| refute:claim-scan.mjs | claude-sonnet-5 | 7 | 2,794 | 14 | 304,740 | 51 |
| refute:claim-scan.mjs | claude-sonnet-5 | 5 | 2,755 | 10 | 208,370 | 42 |
| judge:E10:spec-alignment | claude-sonnet-5 | 2 | 2,658 | 4 | 42,509 | 33 |
| baseline:diffBase | claude-sonnet-5 | 9 | 1,945 | 18 | 375,847 | 38 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,270 | 42 | 120,199 | 90 |
| capture:provenance | claude-sonnet-5 | 2 | 854 | 4 | 42,463 | 12 |
| judge:E11:spec-alignment | claude-sonnet-5 | 8 | 847 | 16 | 373,401 | 239 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 790 | 18 | 27,496 | 13 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 606 | 18 | 27,500 | 9 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 605 | 18 | 44,927 | 54 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 319 | 18 | 27,496 | 12 |
| refute:SKILL.md | claude-sonnet-5 | 5 | 292 | 10 | 225,254 | 34 |
| synthesize:report | claude-sonnet-5 | 2 | 138 | 4 | 53,717 | 243 |
| judge:E10:domain-correctness | claude-sonnet-5 | 2 | 7 | 4 | 42,509 | 29 |
| judge:E11:operational-feasibility | claude-sonnet-5 | 2 | 6 | 4 | 65,683 | 53 |

- **claude-fable-5**: 2 agent · 30 calls · out 19,266 · in 60 · cache_read 1,689,872 · cache_create 129,002
- **claude-sonnet-5**: 16 agent · 103 calls · out 41,382 · in 206 · cache_read 4,830,831 · cache_create 829,045
- **claude-haiku-4-5-20251001**: 5 agent · 13 calls · out 3,590 · in 114 · cache_read 247,618 · cache_create 142,404

### S4 round 1 (resume có contractPath) — wf_c688138b-31d (33 agent, 95,580 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-fable-5 | 21 | 10,442 | 42 | 1,226,862 | 226 |
| review:bugs | claude-fable-5 | 9 | 8,824 | 18 | 463,010 | 153 |
| refute:claim-scan.mjs | claude-sonnet-5 | 15 | 7,900 | 30 | 814,377 | 176 |
| refute:claim-scan.mjs | claude-sonnet-5 | 13 | 6,827 | 26 | 634,629 | 127 |
| refute:claim-scan.mjs | claude-sonnet-5 | 14 | 6,566 | 28 | 773,452 | 152 |
| refute:claim-scan.mjs | claude-sonnet-5 | 15 | 6,305 | 30 | 750,539 | 123 |
| judge:E11:domain-correctness | claude-sonnet-5 | 3 | 5,706 | 6 | 92,002 | 81 |
| refute:claim-scan.mjs | claude-sonnet-5 | 12 | 4,540 | 24 | 673,164 | 129 |
| refute:claim-scan.mjs | claude-sonnet-5 | 17 | 4,055 | 34 | 938,784 | 154 |
| judge:E10:operational-feasibility | claude-sonnet-5 | 2 | 4,003 | 4 | 42,511 | 49 |
| refute:claim-scan.mjs | claude-sonnet-5 | 6 | 3,983 | 12 | 239,743 | 54 |
| refute:claim-scan.mjs | claude-sonnet-5 | 12 | 3,955 | 24 | 715,248 | 143 |
| refute:claim-scan.mjs | claude-sonnet-5 | 10 | 2,843 | 20 | 504,558 | 113 |
| refute:claim-scan.mjs | claude-sonnet-5 | 7 | 2,794 | 14 | 304,740 | 51 |
| refute:claim-scan.mjs | claude-sonnet-5 | 5 | 2,755 | 10 | 208,370 | 42 |
| judge:E10:spec-alignment | claude-sonnet-5 | 2 | 2,658 | 4 | 42,509 | 33 |
| refute:claim-scan.mjs | claude-sonnet-5 | 4 | 2,096 | 8 | 163,773 | 38 |
| baseline:diffBase | claude-sonnet-5 | 9 | 1,945 | 18 | 375,847 | 38 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,270 | 42 | 120,199 | 90 |
| capture:provenance | claude-sonnet-5 | 2 | 854 | 4 | 42,463 | 12 |
| judge:E11:spec-alignment | claude-sonnet-5 | 8 | 847 | 16 | 373,401 | 239 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 790 | 18 | 27,496 | 13 |
| capture:provenance | claude-sonnet-5 | 2 | 783 | 4 | 42,463 | 14 |
| refute:SKILL.md | claude-sonnet-5 | 3 | 622 | 6 | 96,068 | 30 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 606 | 18 | 27,500 | 9 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 605 | 18 | 44,927 | 54 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 319 | 18 | 27,496 | 12 |
| refute:SKILL.md | claude-sonnet-5 | 5 | 292 | 10 | 225,254 | 34 |
| synthesize:report | claude-sonnet-5 | 3 | 139 | 6 | 117,385 | 171 |
| synthesize:report | claude-sonnet-5 | 2 | 138 | 4 | 53,717 | 243 |
| triage | claude-sonnet-5 | 2 | 105 | 4 | 52,230 | 222 |
| judge:E10:domain-correctness | claude-sonnet-5 | 2 | 7 | 4 | 42,509 | 29 |
| judge:E11:operational-feasibility | claude-sonnet-5 | 2 | 6 | 4 | 65,683 | 53 |

- **claude-fable-5**: 2 agent · 30 calls · out 19,266 · in 60 · cache_read 1,689,872 · cache_create 129,002
- **claude-sonnet-5**: 26 agent · 177 calls · out 72,724 · in 354 · cache_read 8,385,419 · cache_create 1,385,708
- **claude-haiku-4-5-20251001**: 5 agent · 13 calls · out 3,590 · in 114 · cache_read 247,618 · cache_create 142,404

### S4 round 2 — wf_07692097-c1b (21 agent, 59,369 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 15 | 17,363 | 30 | 953,621 | 295 |
| refute:claim-scan.mjs | claude-sonnet-5 | 11 | 6,588 | 22 | 600,600 | 135 |
| refute:claim-scan.mjs | claude-sonnet-5 | 11 | 6,458 | 22 | 576,519 | 97 |
| review:conventions | claude-fable-5 | 10 | 5,785 | 20 | 537,128 | 169 |
| refute:plugin.json | claude-sonnet-5 | 8 | 5,491 | 978 | 374,502 | 91 |
| refute:claim-scan.mjs | claude-sonnet-5 | 9 | 3,632 | 18 | 439,608 | 75 |
| judge:E11:operational-feasibility | claude-sonnet-5 | 3 | 3,172 | 6 | 88,865 | 46 |
| judge:E10:domain-correctness | claude-sonnet-5 | 3 | 3,020 | 6 | 96,102 | 42 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 5 | 1,391 | 42 | 119,726 | 24 |
| refute:SKILL.md | claude-sonnet-5 | 4 | 1,209 | 8 | 143,840 | 68 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,135 | 18 | 27,496 | 18 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,087 | 34 | 122,876 | 95 |
| capture:provenance | claude-sonnet-5 | 3 | 897 | 6 | 90,249 | 19 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 654 | 18 | 44,927 | 13 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 358 | 18 | 44,927 | 51 |
| judge:E10:operational-feasibility | claude-sonnet-5 | 2 | 329 | 4 | 42,511 | 34 |
| judge:E10:spec-alignment | claude-sonnet-5 | 2 | 315 | 4 | 42,509 | 55 |
| judge:E11:spec-alignment | claude-sonnet-5 | 2 | 227 | 4 | 42,510 | 57 |
| synthesize:report | claude-sonnet-5 | 3 | 139 | 6 | 115,582 | 218 |
| triage | claude-sonnet-5 | 2 | 110 | 4 | 46,166 | 99 |
| judge:E11:domain-correctness | claude-sonnet-5 | 2 | 9 | 4 | 65,681 | 37 |

- **claude-fable-5**: 2 agent · 25 calls · out 23,148 · in 50 · cache_read 1,490,749 · cache_create 144,874
- **claude-sonnet-5**: 14 agent · 65 calls · out 31,596 · in 1,092 · cache_read 2,765,244 · cache_create 705,300
- **claude-haiku-4-5-20251001**: 5 agent · 15 calls · out 4,625 · in 130 · cache_read 359,952 · cache_create 126,572

