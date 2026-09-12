### S4 round 1 — wf_8a54e799-b17 (31 agent, 188,223 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5 | 37 | 26,421 | 74 | 5,947,674 | 554 |
| review:bugs | claude-opus-5 | 28 | 24,514 | 56 | 4,275,237 | 476 |
| review:measurement | claude-opus-5 | 18 | 19,482 | 36 | 2,423,538 | 343 |
| refute:chan-giu-cho.mjs | claude-sonnet-5 | 10 | 17,963 | 20 | 1,233,900 | 234 |
| triage | claude-sonnet-5 | 2 | 17,346 | 4 | 107,783 | 203 |
| synthesize:report | claude-sonnet-5 | 2 | 14,567 | 4 | 122,582 | 153 |
| refute:pre-merge-check.sh | claude-sonnet-5 | 19 | 14,070 | 38 | 2,347,146 | 214 |
| refute:start-scan.mjs | claude-sonnet-5 | 21 | 10,467 | 42 | 2,499,984 | 180 |
| refute:start-scan.mjs | claude-sonnet-5 | 9 | 5,758 | 18 | 1,049,271 | 85 |
| baseline:diffBase | claude-sonnet-5 | 11 | 5,254 | 22 | 1,086,790 | 88 |
| refute:start-scan.mjs | claude-sonnet-5 | 7 | 4,938 | 14 | 715,708 | 75 |
| refute:chan-van-ban.mjs | claude-sonnet-5 | 3 | 4,892 | 6 | 206,094 | 65 |
| refute:config.yaml | claude-sonnet-5 | 5 | 4,246 | 10 | 481,208 | 66 |
| machine:bash _acceptance/cua-veto-sau-chu-ky/ran | claude-haiku-4-5-20251001 | 2 | 1,424 | 18 | 105,742 | 37 |
| machine:bash _acceptance/cua-veto-sau-chu-ky/ran | claude-haiku-4-5-20251001 | 2 | 1,386 | 18 | 105,742 | 71 |
| machine:bash _acceptance/cua-veto-sau-chu-ky/ran | claude-haiku-4-5-20251001 | 2 | 1,363 | 18 | 105,741 | 61 |
| machine:bash _acceptance/cua-veto-sau-chu-ky/ran | claude-haiku-4-5-20251001 | 2 | 1,283 | 18 | 105,744 | 20 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 4 | 1,207 | 34 | 265,528 | 265 |
| machine:bash -c 'set -o pipefail; node tests/scr | claude-haiku-4-5-20251001 | 2 | 1,202 | 18 | 105,786 | 261 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 5 | 1,193 | 42 | 347,138 | 38 |
| machine:bash _acceptance/cua-veto-sau-chu-ky/ran | claude-haiku-4-5-20251001 | 2 | 1,116 | 18 | 105,743 | 18 |
| machine:bash _acceptance/cua-veto-sau-chu-ky/ran | claude-haiku-4-5-20251001 | 2 | 1,059 | 18 | 75,080 | 20 |
| machine:bash _acceptance/cua-veto-sau-chu-ky/ran | claude-haiku-4-5-20251001 | 2 | 1,040 | 18 | 105,740 | 24 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 912 | 18 | 105,717 | 19 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 903 | 18 | 61,326 | 402 |
| machine:node tests/scripts/additive-only.test.mj | claude-haiku-4-5-20251001 | 2 | 862 | 18 | 105,725 | 15 |
| machine:bash _acceptance/cua-veto-sau-chu-ky/ran | claude-haiku-4-5-20251001 | 2 | 774 | 18 | 105,741 | 25 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 742 | 18 | 105,724 | 13 |
| machine:bash _acceptance/cua-veto-sau-chu-ky/ran | claude-haiku-4-5-20251001 | 2 | 692 | 18 | 105,741 | 21 |
| capture:provenance | claude-sonnet-5 | 2 | 640 | 4 | 100,083 | 15 |
| machine:bash _acceptance/cua-veto-sau-chu-ky/ran | claude-haiku-4-5-20251001 | 2 | 507 | 18 | 105,742 | 18 |

- **claude-opus-5**: 3 agent · 83 calls · out 70,417 · in 166 · cache_read 12,646,449 · cache_create 512,989
- **claude-sonnet-5**: 11 agent · 91 calls · out 100,141 · in 182 · cache_read 9,950,549 · cache_create 1,213,868
- **claude-haiku-4-5-20251001**: 17 agent · 39 calls · out 17,665 · in 346 · cache_read 2,123,700 · cache_create 905,856

