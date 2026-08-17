### S4 round 1 — wf_71726efc-f9a (16 agent, 85,321 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:run-tests.sh | claude-sonnet-5 | 9 | 13,538 | 69 | 446,017 | 162 |
| refute:run-tests.sh | claude-sonnet-5 | 16 | 11,243 | 32 | 880,478 | 277 |
| review:measurement | claude-fable-5 | 6 | 8,904 | 12 | 276,450 | 129 |
| triage | claude-sonnet-5 | 2 | 8,334 | 4 | 44,485 | 100 |
| review:bugs | claude-fable-5 | 6 | 8,161 | 12 | 275,125 | 226 |
| synthesize:report | claude-sonnet-5 | 2 | 7,974 | 4 | 51,032 | 87 |
| refute:run-tests.sh | claude-sonnet-5 | 7 | 7,890 | 14 | 357,227 | 108 |
| review:conventions | claude-fable-5 | 15 | 6,628 | 30 | 918,501 | 117 |
| refute:run-tests.sh | claude-sonnet-5 | 7 | 4,873 | 14 | 294,338 | 64 |
| baseline:diffBase | claude-sonnet-5 | 7 | 1,724 | 14 | 279,331 | 137 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,528 | 42 | 130,816 | 228 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,378 | 58 | 204,805 | 24 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,001 | 18 | 45,480 | 14 |
| capture:provenance | claude-sonnet-5 | 2 | 825 | 4 | 41,887 | 12 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 748 | 34 | 123,855 | 136 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 572 | 18 | 45,487 | 8 |

- **claude-sonnet-5**: 8 agent · 52 calls · out 56,401 · in 155 · cache_read 2,394,795 · cache_create 389,155
- **claude-fable-5**: 3 agent · 27 calls · out 23,693 · in 54 · cache_read 1,470,076 · cache_create 168,283
- **claude-haiku-4-5-20251001**: 5 agent · 20 calls · out 5,227 · in 170 · cache_read 550,443 · cache_create 117,952

### S4 round 2 — wf_b1097ab2-5ea (19 agent, 123,798 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:evidence-report.md | claude-sonnet-5 | 31 | 23,102 | 62 | 2,155,030 | 355 |
| refute:run-tests.sh | claude-sonnet-5 | 13 | 13,251 | 26 | 697,520 | 193 |
| triage | claude-sonnet-5 | 2 | 12,973 | 4 | 45,250 | 155 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 12,297 | 113 | 500,400 | 170 |
| synthesize:report | claude-sonnet-5 | 4 | 11,261 | 8 | 179,167 | 129 |
| review:conventions | claude-fable-5 | 12 | 9,462 | 24 | 698,815 | 151 |
| refute:run-tests.sh | claude-sonnet-5 | 12 | 8,179 | 24 | 567,544 | 108 |
| refute:evidence-report.md | claude-sonnet-5 | 6 | 6,239 | 1,419 | 292,181 | 81 |
| review:measurement | claude-fable-5 | 7 | 5,845 | 14 | 333,439 | 90 |
| refute:run-tests.sh | claude-sonnet-5 | 8 | 5,536 | 16 | 383,791 | 85 |
| review:bugs | claude-fable-5 | 8 | 5,524 | 16 | 385,108 | 96 |
| baseline:diffBase | claude-sonnet-5 | 7 | 2,366 | 14 | 277,949 | 140 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 2,122 | 42 | 165,703 | 30 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,539 | 26 | 74,909 | 122 |
| capture:provenance | claude-sonnet-5 | 2 | 1,134 | 4 | 41,887 | 12 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 943 | 18 | 45,480 | 15 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 844 | 34 | 123,899 | 136 |
| machine:bash _acceptance/hinh-tai-cong-1/rang.sh | claude-haiku-4-5-20251001 | 2 | 650 | 18 | 26,600 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 531 | 18 | 45,487 | 8 |

- **claude-sonnet-5**: 10 agent · 95 calls · out 96,338 · in 1,690 · cache_read 5,140,719 · cache_create 533,095
- **claude-fable-5**: 3 agent · 27 calls · out 20,831 · in 54 · cache_read 1,417,362 · cache_create 163,665
- **claude-haiku-4-5-20251001**: 6 agent · 18 calls · out 6,629 · in 156 · cache_read 482,078 · cache_create 141,238

### S4 round 3 — wf_f6338141-7c5 (18 agent, 92,875 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:run-tests.sh | claude-sonnet-5 | 13 | 12,234 | 26 | 678,683 | 172 |
| refute:run-tests.sh | claude-sonnet-5 | 14 | 12,089 | 28 | 800,261 | 168 |
| synthesize:report | claude-sonnet-5 | 6 | 11,485 | 12 | 319,492 | 147 |
| triage | claude-sonnet-5 | 2 | 9,395 | 4 | 45,726 | 113 |
| review:measurement | claude-fable-5 | 6 | 8,008 | 12 | 281,345 | 124 |
| review:bugs | claude-fable-5 | 11 | 7,582 | 22 | 616,807 | 136 |
| review:conventions | claude-fable-5 | 11 | 7,453 | 22 | 625,642 | 140 |
| refute:run-tests.sh | claude-sonnet-5 | 12 | 6,044 | 24 | 625,272 | 128 |
| refute:rang.sh | claude-sonnet-5 | 6 | 4,788 | 12 | 254,444 | 64 |
| refute:SKILL.md | claude-sonnet-5 | 7 | 4,524 | 14 | 333,148 | 73 |
| baseline:diffBase | claude-sonnet-5 | 8 | 2,389 | 16 | 330,249 | 147 |
| capture:provenance | claude-sonnet-5 | 4 | 1,879 | 8 | 145,759 | 25 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,671 | 42 | 175,315 | 140 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,075 | 50 | 172,616 | 21 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 856 | 42 | 168,334 | 319 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 548 | 18 | 45,487 | 7 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 527 | 18 | 45,480 | 10 |
| machine:bash _acceptance/hinh-tai-cong-1/rang.sh | claude-haiku-4-5-20251001 | 2 | 328 | 18 | 26,600 | 13 |

- **claude-sonnet-5**: 9 agent · 72 calls · out 64,827 · in 144 · cache_read 3,533,034 · cache_create 448,761
- **claude-fable-5**: 3 agent · 28 calls · out 23,043 · in 56 · cache_read 1,523,794 · cache_create 175,975
- **claude-haiku-4-5-20251001**: 6 agent · 22 calls · out 5,005 · in 188 · cache_read 633,832 · cache_create 125,533

### S4 round 4 — wf_eccca97d-ff3 (17 agent, 96,914 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:rang.sh | claude-sonnet-5 | 9 | 16,586 | 18 | 411,410 | 190 |
| refute:run-tests.sh | claude-sonnet-5 | 14 | 14,607 | 28 | 800,275 | 225 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 12,721 | 20 | 509,151 | 173 |
| synthesize:report | claude-sonnet-5 | 4 | 10,951 | 8 | 169,674 | 124 |
| review:bugs | claude-fable-5 | 11 | 9,833 | 22 | 626,440 | 169 |
| refute:rang.sh | claude-sonnet-5 | 12 | 9,381 | 24 | 625,901 | 125 |
| review:measurement | claude-fable-5 | 6 | 7,284 | 12 | 265,764 | 113 |
| review:conventions | claude-fable-5 | 8 | 4,001 | 16 | 368,436 | 66 |
| triage | claude-sonnet-5 | 2 | 2,747 | 4 | 43,763 | 37 |
| baseline:diffBase | claude-sonnet-5 | 8 | 2,504 | 16 | 324,532 | 140 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,918 | 58 | 197,590 | 25 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,221 | 18 | 45,480 | 91 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 8 | 962 | 66 | 235,624 | 245 |
| machine:bash _acceptance/hinh-tai-cong-1/rang.sh | claude-haiku-4-5-20251001 | 2 | 742 | 18 | 26,600 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 631 | 18 | 45,487 | 9 |
| capture:provenance | claude-sonnet-5 | 2 | 527 | 4 | 41,887 | 9 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 298 | 18 | 45,480 | 14 |

- **claude-sonnet-5**: 8 agent · 61 calls · out 70,024 · in 122 · cache_read 2,926,593 · cache_create 422,831
- **claude-fable-5**: 3 agent · 25 calls · out 21,118 · in 50 · cache_read 1,260,640 · cache_create 160,008
- **claude-haiku-4-5-20251001**: 6 agent · 23 calls · out 5,772 · in 196 · cache_read 596,261 · cache_create 91,441

### S4 round 5 (carry E1–E8) — wf_2d679c9c-169 (18 agent, 128,658 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:run-tests.sh | claude-sonnet-5 | 14 | 18,118 | 28 | 749,720 | 226 |
| refute:rang.sh | claude-sonnet-5 | 8 | 14,421 | 16 | 355,313 | 176 |
| refute:run-tests.sh | claude-sonnet-5 | 15 | 13,696 | 30 | 880,990 | 198 |
| synthesize:report | claude-sonnet-5 | 4 | 13,318 | 8 | 199,220 | 149 |
| refute:run-tests.sh | claude-sonnet-5 | 7 | 12,513 | 4,387 | 354,890 | 163 |
| triage | claude-sonnet-5 | 2 | 10,660 | 4 | 45,864 | 116 |
| review:measurement | claude-fable-5 | 8 | 9,248 | 16 | 425,308 | 137 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 8,674 | 20 | 475,529 | 104 |
| review:bugs | claude-fable-5 | 8 | 8,221 | 16 | 407,193 | 128 |
| refute:rang.sh | claude-sonnet-5 | 6 | 5,552 | 12 | 274,669 | 110 |
| review:conventions | claude-fable-5 | 8 | 4,695 | 16 | 384,735 | 80 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,927 | 42 | 116,008 | 216 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,679 | 26 | 75,035 | 23 |
| baseline:diffBase | claude-sonnet-5 | 7 | 1,548 | 14 | 277,454 | 127 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,411 | 42 | 180,010 | 244 |
| capture:provenance | claude-sonnet-5 | 2 | 1,398 | 4 | 41,887 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 890 | 18 | 45,480 | 13 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 689 | 18 | 45,487 | 9 |

- **claude-sonnet-5**: 10 agent · 75 calls · out 99,898 · in 4,523 · cache_read 3,655,536 · cache_create 538,015
- **claude-fable-5**: 3 agent · 24 calls · out 22,164 · in 48 · cache_read 1,217,236 · cache_create 172,705
- **claude-haiku-4-5-20251001**: 5 agent · 17 calls · out 6,596 · in 146 · cache_read 462,020 · cache_create 114,898

