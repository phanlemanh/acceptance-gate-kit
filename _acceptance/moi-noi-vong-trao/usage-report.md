### S4 round 1 — wf_8927ff95-24d (36 agent, 209,777 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 22,839 | 4 | 94,841 | 232 |
| refute:rang-mnvt.sh | claude-sonnet-5 | 8 | 17,522 | 16 | 474,877 | 203 |
| review:conventions | claude-fable-5 | 20 | 13,797 | 39 | 1,642,518 | 234 |
| triage | claude-sonnet-5 | 2 | 12,977 | 4 | 82,225 | 138 |
| refute:run-tests.sh | claude-sonnet-5 | 10 | 10,860 | 2,396 | 589,856 | 141 |
| judge:E5:operational-feasibility | claude-sonnet-5 | 3 | 10,302 | 6 | 157,288 | 121 |
| review:measurement | claude-fable-5 | 8 | 9,589 | 16 | 503,487 | 151 |
| refute:rang-mnvt.sh | claude-sonnet-5 | 4 | 9,379 | 8 | 202,333 | 118 |
| refute:rang-mnvt.sh | claude-sonnet-5 | 7 | 9,123 | 14 | 385,967 | 118 |
| review:bugs | claude-fable-5 | 21 | 8,971 | 40 | 1,567,239 | 181 |
| refute:run-tests.sh | claude-sonnet-5 | 8 | 8,659 | 16 | 460,521 | 120 |
| baseline:diffBase | claude-sonnet-5 | 26 | 8,177 | 52 | 1,718,043 | 287 |
| judge:E4:spec-alignment | claude-sonnet-5 | 2 | 7,608 | 4 | 78,349 | 89 |
| refute:config.yaml | claude-sonnet-5 | 11 | 7,513 | 22 | 669,200 | 117 |
| judge:E5:domain-correctness | claude-sonnet-5 | 3 | 6,339 | 6 | 157,284 | 75 |
| refute:gate-card.js | claude-sonnet-5 | 8 | 5,983 | 16 | 459,073 | 96 |
| refute:SKILL.md | claude-sonnet-5 | 11 | 5,274 | 22 | 634,747 | 91 |
| refute:gate-card.js | claude-sonnet-5 | 7 | 4,714 | 14 | 384,237 | 74 |
| refute:rang-mnvt.sh | claude-sonnet-5 | 5 | 4,239 | 10 | 261,363 | 112 |
| judge:E5:spec-alignment | claude-sonnet-5 | 3 | 3,711 | 6 | 157,289 | 46 |
| capture:provenance | claude-sonnet-5 | 7 | 3,469 | 14 | 397,802 | 58 |
| judge:E4:operational-feasibility | claude-sonnet-5 | 2 | 2,776 | 4 | 78,351 | 36 |
| judge:E4:domain-correctness | claude-sonnet-5 | 2 | 2,034 | 4 | 52,943 | 25 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,595 | 50 | 203,393 | 244 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,486 | 26 | 96,403 | 35 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 8 | 1,462 | 66 | 302,856 | 197 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,284 | 34 | 136,919 | 35 |
| refute:rang-mnvt.sh | claude-sonnet-5 | 3 | 1,259 | 6 | 136,878 | 24 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 4 | 1,101 | 34 | 136,246 | 34 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 6 | 1,089 | 50 | 217,116 | 42 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 4 | 1,052 | 34 | 136,297 | 31 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 4 | 1,017 | 34 | 136,285 | 31 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 4 | 887 | 34 | 135,943 | 16 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 2 | 775 | 18 | 56,594 | 17 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 3 | 532 | 26 | 96,326 | 35 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 2 | 383 | 18 | 56,590 | 15 |

- **claude-sonnet-5**: 21 agent · 134 calls · out 164,757 · in 2,644 · cache_read 7,633,467 · cache_create 1,029,890
- **claude-fable-5**: 3 agent · 49 calls · out 32,357 · in 95 · cache_read 3,713,244 · cache_create 238,051
- **claude-haiku-4-5-20251001**: 12 agent · 50 calls · out 12,663 · in 424 · cache_read 1,710,968 · cache_create 294,663

### S4 round 2 (lần chạy lại sau BLOCKED) — wf_efb2bfc5-539 (31 agent, 178,916 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| refute:evals.yaml | claude-sonnet-5 | 31 | 35,223 | 62 | 3,401,495 | 488 |
| synthesize:report | claude-sonnet-5 | 4 | 16,971 | 8 | 222,613 | 175 |
| review:measurement | claude-fable-5 | 14 | 15,451 | 27 | 1,117,816 | 245 |
| review:bugs | claude-fable-5 | 21 | 13,447 | 40 | 1,687,269 | 229 |
| refute:run-tests.sh | claude-sonnet-5 | 5 | 12,635 | 10 | 266,639 | 152 |
| review:conventions | claude-fable-5 | 16 | 10,638 | 31 | 1,296,567 | 172 |
| refute:gate-card.js | claude-sonnet-5 | 7 | 9,997 | 14 | 416,233 | 144 |
| refute:SKILL.md | claude-sonnet-5 | 8 | 9,215 | 16 | 498,788 | 127 |
| refute:rang-mnvt.sh | claude-sonnet-5 | 7 | 5,885 | 14 | 391,884 | 84 |
| triage | claude-sonnet-5 | 2 | 5,880 | 4 | 56,686 | 75 |
| refute:gate-card.js | claude-sonnet-5 | 16 | 5,482 | 32 | 1,057,239 | 120 |
| refute:SKILL.md | claude-sonnet-5 | 9 | 4,037 | 18 | 493,515 | 73 |
| judge:E5:spec-alignment | claude-sonnet-5 | 3 | 3,766 | 6 | 160,367 | 41 |
| judge:E5:operational-feasibility | claude-sonnet-5 | 3 | 3,499 | 6 | 160,306 | 38 |
| baseline:diffBase | claude-sonnet-5 | 14 | 3,417 | 28 | 770,971 | 189 |
| judge:E4:operational-feasibility | claude-sonnet-5 | 2 | 3,072 | 4 | 78,594 | 36 |
| judge:E4:domain-correctness | claude-sonnet-5 | 2 | 3,036 | 4 | 53,186 | 34 |
| judge:E4:spec-alignment | claude-sonnet-5 | 2 | 2,895 | 4 | 78,592 | 32 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,947 | 58 | 276,230 | 102 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 6 | 1,676 | 50 | 229,332 | 362 |
| judge:E5:domain-correctness | claude-sonnet-5 | 3 | 1,488 | 6 | 160,298 | 28 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 4 | 1,207 | 34 | 136,440 | 21 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 3 | 1,196 | 26 | 96,323 | 21 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,101 | 26 | 96,911 | 19 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 2 | 941 | 18 | 56,592 | 14 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 2 | 906 | 18 | 56,591 | 13 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 3 | 886 | 26 | 96,271 | 18 |
| capture:provenance | claude-sonnet-5 | 2 | 868 | 4 | 52,212 | 16 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 814 | 18 | 37,506 | 15 |
| machine:bash _acceptance/moi-noi-vong-trao/rang- | claude-haiku-4-5-20251001 | 2 | 772 | 18 | 56,592 | 17 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 4 | 568 | 34 | 135,962 | 17 |

- **claude-sonnet-5**: 17 agent · 120 calls · out 127,366 · in 240 · cache_read 8,319,618 · cache_create 1,060,680
- **claude-fable-5**: 3 agent · 51 calls · out 39,536 · in 98 · cache_read 4,101,652 · cache_create 269,735
- **claude-haiku-4-5-20251001**: 11 agent · 38 calls · out 12,014 · in 326 · cache_read 1,274,750 · cache_create 277,347

