### S4 round 1 — wf_51b77645-bcc (24 agent, 184,249 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-fable-5 | 18 | 16,265 | 35 | 1,581,228 | 663 |
| synthesize:report | claude-sonnet-5 | 2 | 16,146 | 4 | 82,118 | 168 |
| refute:plugin.json | claude-sonnet-5 | 12 | 16,082 | 24 | 971,510 | 192 |
| review:measurement | claude-fable-5 | 6 | 15,023 | 12 | 402,287 | 237 |
| refute:run-tests.sh | claude-sonnet-5 | 9 | 14,428 | 1,763 | 689,897 | 181 |
| refute:run-tests.sh | claude-sonnet-5 | 9 | 14,171 | 18 | 676,013 | 183 |
| review:conventions | claude-fable-5 | 12 | 13,401 | 23 | 998,345 | 599 |
| refute:run-tests.sh | claude-sonnet-5 | 5 | 13,143 | 10 | 321,221 | 168 |
| refute:run-tests.sh | claude-sonnet-5 | 15 | 11,075 | 67 | 1,373,834 | 165 |
| triage | claude-sonnet-5 | 2 | 9,327 | 4 | 74,908 | 115 |
| refute:sign-batch.mjs | claude-sonnet-5 | 11 | 8,848 | 22 | 849,017 | 136 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 28 | 6,775 | 228 | 1,744,161 | 276 |
| baseline:diffBase | claude-sonnet-5 | 17 | 6,686 | 34 | 1,274,796 | 420 |
| refute:sign-batch.mjs | claude-sonnet-5 | 11 | 6,004 | 22 | 855,949 | 93 |
| refute:SKILL.md | claude-sonnet-5 | 6 | 4,029 | 12 | 411,305 | 58 |
| refute:sign-batch.mjs | claude-sonnet-5 | 6 | 3,531 | 12 | 396,123 | 73 |
| refute:run-tests.sh | claude-sonnet-5 | 4 | 2,912 | 8 | 224,268 | 46 |
| refute:SKILL.md | claude-sonnet-5 | 6 | 2,016 | 12 | 395,840 | 40 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,921 | 50 | 269,467 | 38 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,173 | 42 | 211,192 | 192 |
| capture:provenance | claude-sonnet-5 | 2 | 537 | 4 | 69,412 | 10 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 3 | 395 | 26 | 101,035 | 16 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 359 | 18 | 49,160 | 17 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 2 | 18 | 49,164 | 11 |

- **claude-fable-5**: 3 agent · 36 calls · out 44,689 · in 70 · cache_read 2,981,860 · cache_create 505,385
- **claude-sonnet-5**: 15 agent · 117 calls · out 128,935 · in 2,016 · cache_read 8,666,211 · cache_create 1,222,248
- **claude-haiku-4-5-20251001**: 6 agent · 46 calls · out 10,625 · in 382 · cache_read 2,424,179 · cache_create 346,688

