### S4 round 1 — wf_448dd308-aa6 (14 agent, 72,540 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 16 | 14,820 | 31 | 1,025,436 | 326 |
| review:conventions | claude-fable-5 | 17 | 14,029 | 32 | 1,144,818 | 347 |
| refute:SKILL.md | claude-sonnet-5 | 13 | 12,204 | 26 | 924,850 | 180 |
| synthesize:report | claude-sonnet-5 | 2 | 11,648 | 4 | 50,869 | 126 |
| refute:SKILL.md | claude-sonnet-5 | 8 | 6,765 | 16 | 398,299 | 110 |
| refute:GUIDE.md | claude-sonnet-5 | 12 | 6,449 | 24 | 738,289 | 113 |
| baseline:diffBase | claude-sonnet-5 | 8 | 1,756 | 16 | 326,766 | 71 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,265 | 34 | 87,925 | 55 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,249 | 18 | 26,716 | 17 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 918 | 18 | 26,716 | 27 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 670 | 18 | 26,716 | 11 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 461 | 18 | 26,720 | 7 |
| capture:provenance | claude-sonnet-5 | 2 | 165 | 4 | 42,404 | 8 |
| triage | claude-sonnet-5 | 2 | 141 | 4 | 45,338 | 59 |

- **claude-fable-5**: 2 agent · 33 calls · out 28,849 · in 63 · cache_read 2,170,254 · cache_create 190,648
- **claude-sonnet-5**: 7 agent · 47 calls · out 39,128 · in 94 · cache_read 2,526,815 · cache_create 412,907
- **claude-haiku-4-5-20251001**: 5 agent · 12 calls · out 4,563 · in 106 · cache_read 194,793 · cache_create 158,777

### S4 round 2 — wf_8074a552-c01 (14 agent, 68,346 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-fable-5 | 26 | 16,301 | 50 | 2,002,123 | 761 |
| review:bugs | claude-fable-5 | 18 | 16,104 | 35 | 1,178,848 | 662 |
| synthesize:report | claude-sonnet-5 | 7 | 8,947 | 14 | 382,941 | 120 |
| refute:SKILL.md | claude-sonnet-5 | 17 | 8,634 | 108 | 1,054,455 | 186 |
| refute:run-tests.sh | claude-sonnet-5 | 8 | 4,007 | 16 | 363,853 | 110 |
| triage | claude-sonnet-5 | 2 | 3,825 | 4 | 44,703 | 52 |
| refute:SKILL.md | claude-sonnet-5 | 6 | 3,512 | 12 | 279,080 | 71 |
| baseline:diffBase | claude-sonnet-5 | 9 | 1,833 | 18 | 374,146 | 68 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,340 | 50 | 146,855 | 89 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,154 | 18 | 44,151 | 15 |
| capture:provenance | claude-sonnet-5 | 3 | 902 | 6 | 89,963 | 12 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 806 | 18 | 26,716 | 11 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 621 | 18 | 44,155 | 9 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 360 | 18 | 26,716 | 28 |

- **claude-fable-5**: 2 agent · 44 calls · out 32,405 · in 85 · cache_read 3,180,971 · cache_create 182,225
- **claude-sonnet-5**: 7 agent · 52 calls · out 31,660 · in 178 · cache_read 2,589,141 · cache_create 375,405
- **claude-haiku-4-5-20251001**: 5 agent · 14 calls · out 4,281 · in 122 · cache_read 288,593 · cache_create 122,921

