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

