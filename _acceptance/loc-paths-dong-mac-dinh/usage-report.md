### S4 round 1 — wf_25537850-5b0 (26 agent, 34,554 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 6,585 | 8 | 318,657 | 53 |
| triage | claude-sonnet-5-5 | 2 | 4,058 | 4 | 85,160 | 33 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,303 | 18 | 29,029 | 402 |
| review:conventions | claude-opus-5-5 | 12 | 1,997 | 24 | 1,257,384 | 120 |
| review:measurement | claude-opus-5-5 | 11 | 1,749 | 22 | 1,221,552 | 168 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 1,661 | 18 | 90,689 | 39 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 8 | 1,562 | 66 | 458,834 | 1680 |
| review:bugs | claude-opus-5-5 | 17 | 1,481 | 34 | 2,203,179 | 217 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,375 | 18 | 90,668 | 28 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,301 | 18 | 90,668 | 28 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 1,224 | 18 | 90,686 | 33 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 1,174 | 8 | 254,367 | 15 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 1,165 | 18 | 90,685 | 26 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 918 | 18 | 90,684 | 23 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 7 | 912 | 58 | 395,140 | 159 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 879 | 18 | 90,686 | 78 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 862 | 18 | 90,686 | 16 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 737 | 18 | 90,689 | 17 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 690 | 18 | 90,685 | 15 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 557 | 18 | 90,687 | 17 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 7 | 405 | 58 | 430,907 | 385 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 301 | 18 | 90,675 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 273 | 18 | 90,717 | 263 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 229 | 18 | 90,717 | 71 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 80,684 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 6 | 18 | 90,717 | 85 |


wall: 3237s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 1,174 | 254,367 | 15 | 11:16:52 | 11:17:08 |
| machine | 19 | 17,360 | 2,674,249 | 3136 | 11:16:52 | 12:09:08 |
| review | 3 | 5,227 | 4,682,115 | 235 | 11:16:52 | 11:20:47 |
| triage | 1 | 4,058 | 85,160 | 33 | 12:09:11 | 12:09:43 |
| capture | 1 | 150 | 80,684 | 5 | 12:09:48 | 12:09:53 |
| synthesize | 1 | 6,585 | 318,657 | 53 | 12:09:56 | 12:10:49 |

- **claude-sonnet-5-5**: 4 agent · 12 calls · out 11,967 · in 24 · cache_read 738,868 · cache_create 377,619
- **claude-haiku-4-5-20251001**: 19 agent · 54 calls · out 17,360 · in 470 · cache_read 2,674,249 · cache_create 836,904
- **claude-opus-5-5**: 3 agent · 40 calls · out 5,227 · in 80 · cache_read 4,682,115 · cache_create 393,147

### S4 round 2 — wf_e9812d9d-d18 (24 agent, 26,377 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 5,147 | 8 | 316,336 | 44 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 6 | 2,112 | 50 | 361,500 | 397 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 3 | 1,816 | 26 | 123,705 | 391 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 1,761 | 18 | 90,714 | 137 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 1,706 | 18 | 90,727 | 41 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,583 | 18 | 90,719 | 124 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 1,357 | 18 | 90,723 | 30 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 1,308 | 58 | 424,182 | 46 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,261 | 18 | 90,706 | 25 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 1,259 | 18 | 90,724 | 34 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 1,066 | 18 | 90,722 | 23 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 926 | 18 | 90,724 | 18 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 895 | 18 | 90,727 | 18 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 730 | 18 | 90,725 | 17 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 636 | 18 | 90,723 | 16 |
| machine:bash _acceptance/loc-paths-dong-mac-dinh | claude-haiku-4-5-20251001 | 2 | 577 | 18 | 90,724 | 69 |
| review:measurement | claude-opus-5-5 | 4 | 486 | 8 | 295,203 | 22 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 483 | 18 | 90,755 | 85 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 346 | 18 | 90,755 | 267 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 319 | 18 | 90,755 | 69 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 246 | 18 | 90,713 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 156 | 4 | 80,704 | 7 |
| review:bugs | claude-opus-5-5 | 6 | 101 | 12 | 483,071 | 22 |
| review:conventions | claude-opus-5-5 | 5 | 100 | 10 | 351,335 | 16 |


wall: 1633s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 19 | 20,387 | 2,361,023 | 1576 | 12:12:31 | 12:38:48 |
| review | 3 | 687 | 1,129,609 | 40 | 12:12:31 | 12:13:11 |
| capture | 1 | 156 | 80,704 | 7 | 12:38:52 | 12:38:59 |
| synthesize | 1 | 5,147 | 316,336 | 44 | 12:39:01 | 12:39:45 |

- **claude-sonnet-5-5**: 2 agent · 6 calls · out 5,303 · in 12 · cache_read 397,040 · cache_create 199,141
- **claude-haiku-4-5-20251001**: 19 agent · 48 calls · out 20,387 · in 422 · cache_read 2,361,023 · cache_create 748,678
- **claude-opus-5-5**: 3 agent · 15 calls · out 687 · in 30 · cache_read 1,129,609 · cache_create 214,182

