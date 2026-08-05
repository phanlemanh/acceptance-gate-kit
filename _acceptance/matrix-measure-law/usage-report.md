### S4 round 1 (script nguồn) — wf_40c37711-eaa (32 agent, 171,352 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 21,573 | 4 | 58,839 | 222 |
| judge:M9:spec-alignment | claude-sonnet-5 | 4 | 14,695 | 8 | 175,774 | 154 |
| review:conventions | claude-fable-5 | 11 | 14,128 | 21 | 705,427 | 232 |
| review:bugs | claude-fable-5 | 16 | 12,383 | 31 | 1,057,803 | 236 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 5 | 11,623 | 10 | 223,508 | 138 |
| triage | claude-sonnet-5 | 6 | 9,895 | 12 | 262,656 | 121 |
| review:measurement | claude-fable-5 | 6 | 9,457 | 12 | 279,333 | 151 |
| refute:red-probe-artifact.md | claude-sonnet-5 | 8 | 8,711 | 16 | 441,185 | 185 |
| judge:M8:operational-feasibility | claude-sonnet-5 | 3 | 8,665 | 6 | 113,683 | 110 |
| judge:M9:domain-correctness | claude-sonnet-5 | 2 | 8,378 | 4 | 44,463 | 90 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 6 | 6,304 | 12 | 252,738 | 79 |
| judge:M8:domain-correctness | claude-sonnet-5 | 5 | 6,236 | 10 | 202,414 | 86 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 15 | 5,962 | 30 | 791,560 | 135 |
| judge:M11:spec-alignment | claude-sonnet-5 | 2 | 5,562 | 4 | 67,742 | 71 |
| judge:M11:operational-feasibility | claude-sonnet-5 | 2 | 5,223 | 4 | 67,744 | 65 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 4 | 4,402 | 8 | 170,470 | 59 |
| judge:M8:spec-alignment | claude-sonnet-5 | 3 | 3,151 | 6 | 136,933 | 96 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 6 | 3,050 | 12 | 277,129 | 55 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 9 | 1,877 | 74 | 292,748 | 162 |
| judge:M10:domain-correctness | claude-sonnet-5 | 5 | 1,604 | 10 | 222,505 | 31 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,190 | 58 | 242,780 | 101 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,183 | 18 | 28,055 | 17 |
| judge:M10:operational-feasibility | claude-sonnet-5 | 2 | 1,116 | 4 | 67,604 | 17 |
| baseline:diffBase | claude-sonnet-5 | 6 | 896 | 12 | 237,791 | 40 |
| judge:M10:spec-alignment | claude-sonnet-5 | 2 | 853 | 4 | 67,602 | 16 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 668 | 18 | 28,062 | 10 |
| capture:provenance | claude-sonnet-5 | 2 | 564 | 4 | 43,969 | 10 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 507 | 18 | 28,055 | 12 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 502 | 18 | 28,059 | 9 |
| judge:M9:operational-feasibility | claude-sonnet-5 | 2 | 410 | 4 | 67,719 | 157 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 5 | 334 | 10 | 221,618 | 58 |
| judge:M11:domain-correctness | claude-sonnet-5 | 2 | 250 | 4 | 67,742 | 44 |

- **claude-sonnet-5**: 23 agent · 99 calls · out 129,457 · in 198 · cache_read 4,283,388 · cache_create 1,172,522
- **claude-fable-5**: 3 agent · 33 calls · out 35,968 · in 64 · cache_read 2,042,563 · cache_create 212,777
- **claude-haiku-4-5-20251001**: 6 agent · 24 calls · out 5,927 · in 204 · cache_read 647,759 · cache_create 178,646

### S4 round 2 — wf_f056c1f6-296 (28 agent, 171,695 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 2 | 22,225 | 4 | 58,741 | 229 |
| refute:red-probe-artifact.md | claude-sonnet-5 | 11 | 21,348 | 22 | 619,227 | 333 |
| judge:M9:spec-alignment | claude-sonnet-5 | 3 | 20,619 | 6 | 133,935 | 228 |
| review:conventions | claude-fable-5 | 15 | 14,555 | 29 | 997,509 | 221 |
| review:bugs | claude-fable-5 | 12 | 13,014 | 23 | 763,655 | 226 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 4 | 9,770 | 8 | 169,744 | 124 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 14 | 9,662 | 28 | 773,218 | 141 |
| judge:M9:operational-feasibility | claude-sonnet-5 | 4 | 7,475 | 8 | 150,632 | 93 |
| refute:plugin.json | claude-sonnet-5 | 15 | 7,412 | 30 | 885,834 | 132 |
| refute:evals.yaml | claude-sonnet-5 | 13 | 6,805 | 26 | 777,929 | 163 |
| review:measurement | claude-fable-5 | 6 | 6,647 | 11 | 346,900 | 175 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 6 | 5,861 | 12 | 254,523 | 88 |
| judge:M11:domain-correctness | claude-sonnet-5 | 2 | 4,133 | 4 | 44,488 | 54 |
| judge:M11:spec-alignment | claude-sonnet-5 | 2 | 3,650 | 4 | 44,488 | 50 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 9 | 3,444 | 18 | 463,773 | 83 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 10 | 3,330 | 82 | 281,695 | 768 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 12 | 3,067 | 24 | 605,234 | 72 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 5 | 2,539 | 10 | 220,216 | 46 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,669 | 58 | 216,522 | 70 |
| refute:evals.yaml | claude-sonnet-5 | 10 | 1,377 | 20 | 503,000 | 101 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 552 | 18 | 45,529 | 14 |
| capture:provenance | claude-sonnet-5 | 2 | 536 | 4 | 43,969 | 9 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 530 | 18 | 45,525 | 14 |
| judge:M9:domain-correctness | claude-sonnet-5 | 6 | 499 | 12 | 294,982 | 145 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 420 | 18 | 28,055 | 11 |
| judge:M11:operational-feasibility | claude-sonnet-5 | 2 | 310 | 4 | 44,490 | 75 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 239 | 18 | 45,532 | 9 |
| triage | claude-sonnet-5 | 2 | 7 | 4 | 49,302 | 204 |

- **claude-sonnet-5**: 19 agent · 124 calls · out 130,739 · in 248 · cache_read 6,137,725 · cache_create 1,128,552
- **claude-fable-5**: 3 agent · 33 calls · out 34,216 · in 63 · cache_read 2,108,064 · cache_create 262,435
- **claude-haiku-4-5-20251001**: 6 agent · 25 calls · out 6,740 · in 212 · cache_read 662,858 · cache_create 154,255

### S4 round 3 — wf_7dbadc80-818 (28 agent, 91,030 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:M9:spec-alignment | claude-sonnet-5 | 2 | 13,966 | 4 | 44,463 | 155 |
| review:bugs | claude-fable-5 | 8 | 10,564 | 16 | 450,111 | 170 |
| review:conventions | claude-fable-5 | 9 | 8,263 | 17 | 504,128 | 143 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 10 | 8,231 | 20 | 572,117 | 160 |
| judge:M9:operational-feasibility | claude-sonnet-5 | 3 | 7,529 | 6 | 134,285 | 144 |
| synthesize:report | claude-sonnet-5 | 8 | 6,097 | 16 | 573,415 | 359 |
| review:measurement | claude-fable-5 | 6 | 5,404 | 12 | 276,810 | 146 |
| refute:measure-pins.mjs | claude-sonnet-5 | 9 | 5,199 | 18 | 449,869 | 98 |
| refute:gen-red-probe.mjs | claude-sonnet-5 | 7 | 3,965 | 14 | 325,484 | 66 |
| judge:M11:domain-correctness | claude-sonnet-5 | 2 | 3,595 | 4 | 67,776 | 50 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 6 | 2,884 | 12 | 260,875 | 79 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 7 | 2,781 | 14 | 354,113 | 76 |
| refute:measure-law-mutants.test.mjs | claude-sonnet-5 | 5 | 2,680 | 10 | 228,212 | 69 |
| machine:bash tests/plugins/run-tests.sh | claude-haiku-4-5-20251001 | 11 | 2,591 | 94 | 355,392 | 175 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,475 | 58 | 185,503 | 100 |
| baseline:diffBase | claude-sonnet-5 | 7 | 1,224 | 14 | 287,567 | 35 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,205 | 34 | 103,506 | 21 |
| judge:M10:domain-correctness | claude-sonnet-5 | 2 | 1,111 | 4 | 44,348 | 19 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 3 | 717 | 26 | 58,310 | 11 |
| capture:provenance | claude-sonnet-5 | 3 | 580 | 6 | 91,819 | 13 |
| judge:M10:spec-alignment | claude-sonnet-5 | 2 | 306 | 4 | 67,602 | 20 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 276 | 18 | 28,055 | 12 |
| machine:bash scripts/sync-plugin-packages.sh --c | claude-haiku-4-5-20251001 | 2 | 246 | 18 | 28,059 | 8 |
| triage | claude-sonnet-5 | 2 | 108 | 4 | 48,209 | 143 |
| judge:M9:domain-correctness | claude-sonnet-5 | 2 | 12 | 4 | 44,463 | 148 |
| judge:M11:spec-alignment | claude-sonnet-5 | 2 | 8 | 4 | 67,776 | 40 |
| judge:M10:operational-feasibility | claude-sonnet-5 | 2 | 7 | 4 | 44,350 | 20 |
| judge:M11:operational-feasibility | claude-sonnet-5 | 2 | 6 | 4 | 67,778 | 43 |

- **claude-sonnet-5**: 19 agent · 83 calls · out 60,289 · in 166 · cache_read 3,774,521 · cache_create 1,070,526
- **claude-fable-5**: 3 agent · 23 calls · out 24,231 · in 45 · cache_read 1,231,049 · cache_create 188,416
- **claude-haiku-4-5-20251001**: 6 agent · 29 calls · out 6,510 · in 248 · cache_read 758,825 · cache_create 213,443


## Re-pin dogfood #2 — 2026-08-05T07:28:12Z

Sự kiện re-pin 21 slug bằng nghi thức 1-lane: **1 agent-lane** (id a90fde79942d79f62, ~47k token, 6 suite exit 0 tại `5ec937c`), 21 dòng `kind:repin` cùng `run_id: repin-20260805-matrix-measure-law-lane2`. Sự kiện còn kiểm SỐNG hotfix 1.32.1: các report giờ mang 2 section Re-pin khuôn mới — luật quan-hệ mới sạch (bản per-section cũ từng báo oan 20 VIOLATION).
