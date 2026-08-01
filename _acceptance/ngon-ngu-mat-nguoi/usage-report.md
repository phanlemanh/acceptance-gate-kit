| baseline:diffBase | claude-sonnet-5 | 8 | 2,872 | 16 | 332,592 | 60 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,811 | 26 | 56,849 | 60 |
| capture:provenance | claude-sonnet-5 | 2 | 1,696 | 4 | 42,563 | 24 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 855 | 18 | 26,862 | 13 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 685 | 18 | 26,862 | 12 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 652 | 18 | 26,862 | 28 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 563 | 18 | 26,866 | 10 |

- **claude-sonnet-5**: 14 agent · 167 calls · out 245,816 · in 334 · cache_read 9,811,473 · cache_create 1,010,237
- **claude-opus-5**: 2 agent · 65 calls · out 58,096 · in 123 · cache_read 6,071,614 · cache_create 278,652
- **claude-haiku-4-5-20251001**: 5 agent · 11 calls · out 4,566 · in 98 · cache_read 164,301 · cache_create 175,555

| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,055 | 26 | 56,528 | 51 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 889 | 18 | 44,283 | 16 |
| judge:E16:operational-feasibility | claude-sonnet-5 | 4 | 740 | 8 | 171,740 | 308 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 655 | 18 | 44,287 | 10 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 382 | 18 | 44,283 | 14 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 306 | 18 | 26,862 | 28 |
| capture:provenance | claude-sonnet-5 | 2 | 262 | 4 | 42,563 | 12 |

- **claude-sonnet-5**: 19 agent · 232 calls · out 304,992 · in 9,983 · cache_read 14,453,304 · cache_create 1,417,116
- **claude-opus-5**: 2 agent · 79 calls · out 76,028 · in 1,530 · cache_read 8,436,014 · cache_create 326,604
- **claude-haiku-4-5-20251001**: 5 agent · 11 calls · out 3,287 · in 98 · cache_read 216,243 · cache_create 123,377

| capture:provenance | claude-sonnet-5 | 3 | 1,808 | 6 | 90,361 | 21 |
| synthesize:report | claude-sonnet-5 | 3 | 1,622 | 6 | 127,513 | 1132 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 880 | 34 | 104,154 | 61 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 756 | 18 | 26,862 | 31 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 579 | 34 | 84,929 | 26 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 531 | 18 | 26,866 | 11 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 314 | 18 | 26,862 | 13 |

- **claude-sonnet-5**: 18 agent · 177 calls · out 339,114 · in 7,277 · cache_read 10,314,489 · cache_create 1,323,511
- **claude-opus-5**: 2 agent · 73 calls · out 73,425 · in 5,234 · cache_read 7,519,307 · cache_create 284,844
- **claude-haiku-4-5-20251001**: 5 agent · 14 calls · out 3,060 · in 122 · cache_read 269,673 · cache_create 176,351

