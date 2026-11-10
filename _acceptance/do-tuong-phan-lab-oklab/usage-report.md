### S4 round 1 — wf_3981d718-4a1 (31 agent, 114,306 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 7 | 22,516 | 14 | 279,087 | 222 |
| review:conventions | claude-opus-5-5 | 10 | 20,762 | 20 | 727,594 | 201 |
| review:measurement | claude-opus-5-5 | 7 | 20,008 | 14 | 281,798 | 192 |
| synthesize:report | claude-sonnet-5-5 | 2 | 9,940 | 4 | 29,214 | 62 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 5,861 | 6 | 41,757 | 104 |
| triage | claude-sonnet-5-5 | 2 | 4,468 | 4 | 17,224 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 11 | 4,225 | 22 | 162,071 | 1182 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 3,166 | 8 | 21,569 | 465 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,906 | 4 | 6,610 | 539 |
| refute:mau-lab-do.test.mjs | claude-sonnet-5-5 | 5 | 1,962 | 10 | 68,716 | 43 |
| refute:mau-lab.test.mjs | claude-sonnet-5-5 | 3 | 1,739 | 6 | 27,565 | 24 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,731 | 4 | 14,140 | 237 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 1,624 | 8 | 41,658 | 707 |
| refute:mau-lab-do.test.mjs | claude-sonnet-5-5 | 2 | 1,356 | 4 | 12,922 | 21 |
| refute:design-bundle.mjs | claude-sonnet-5-5 | 4 | 1,182 | 8 | 45,440 | 32 |
| machine:node tests/design-eval/mau-lab.test.mjs | claude-haiku-5-5 | 2 | 1,112 | 4 | 14,183 | 26 |
| machine:node tests/design-floor/moc-s3-s4.mjs -- | claude-haiku-5-5 | 2 | 908 | 4 | 14,182 | 11 |
| refute:design-floor-s4.mjs | claude-sonnet-5-5 | 3 | 832 | 6 | 26,800 | 28 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 808 | 4 | 14,196 | 121 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 705 | 4 | 14,141 | 7 |
| machine:node scripts/build-design-scan.mjs --che | claude-haiku-5-5 | 2 | 696 | 4 | 14,153 | 7 |
| refute:design-floor-s4.mjs | claude-sonnet-5-5 | 2 | 689 | 4 | 9,970 | 9 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 679 | 4 | 14,166 | 7 |
| machine:bash tests/design-eval/kdd.sh KD9 | claude-haiku-5-5 | 2 | 662 | 4 | 14,157 | 11 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 644 | 4 | 14,138 | 10 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 581 | 4 | 14,160 | 177 |
| refute:design-floor-s4.mjs | claude-sonnet-5-5 | 2 | 577 | 4 | 12,914 | 7 |
| machine:node tests/design-eval/mau-lab-chromium. | claude-haiku-5-5 | 2 | 548 | 4 | 14,160 | 9 |
| machine:bash tests/design-eval/kdd.sh --hoi-quy | claude-haiku-5-5 | 2 | 545 | 4 | 14,165 | 64 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 523 | 4 | 14,194 | 88 |
| capture:provenance | claude-sonnet-5-5 | 2 | 351 | 4 | 9,634 | 8 |


wall: 3723s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 5,861 | 41,757 | 104 | 01:00:23 | 01:02:07 |
| machine | 17 | 22,063 | 416,043 | 3564 | 01:00:23 | 01:59:47 |
| review | 3 | 63,286 | 1,288,479 | 223 | 01:00:23 | 01:04:06 |
| triage | 1 | 4,468 | 17,224 | 36 | 01:59:49 | 02:00:25 |
| refute | 7 | 8,337 | 204,327 | 44 | 02:00:27 | 02:01:12 |
| capture | 1 | 351 | 9,634 | 8 | 02:01:14 | 02:01:22 |
| synthesize | 1 | 9,940 | 29,214 | 63 | 02:01:24 | 02:02:26 |

- **claude-opus-5-5**: 3 agent · 24 calls · out 63,286 · in 48 · cache_read 1,288,479 · cache_create 299,892
- **claude-sonnet-5-5**: 11 agent · 30 calls · out 28,957 · in 60 · cache_read 302,156 · cache_create 201,814
- **claude-haiku-5-5**: 17 agent · 46 calls · out 22,063 · in 94 · cache_read 416,043 · cache_create 240,005

### S4 round 2 — wf_1f1668df-e63 (24 agent, 100,935 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 7 | 27,107 | 14 | 296,026 | 301 |
| review:conventions | claude-opus-5-5 | 11 | 18,812 | 22 | 762,905 | 189 |
| review:measurement | claude-opus-5-5 | 6 | 18,440 | 12 | 212,319 | 177 |
| synthesize:report | claude-sonnet-5-5 | 2 | 8,139 | 4 | 27,525 | 49 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,392 | 16 | 97,936 | 1177 |
| triage | claude-sonnet-5-5 | 2 | 3,547 | 4 | 15,154 | 27 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 3,198 | 8 | 21,510 | 400 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,905 | 4 | 6,610 | 532 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,691 | 4 | 14,109 | 93 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 1,531 | 8 | 35,291 | 727 |
| machine:node tests/design-floor/moc-s3-s4.mjs -- | claude-haiku-5-5 | 2 | 1,355 | 4 | 14,125 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,244 | 4 | 14,103 | 184 |
| machine:node tests/design-eval/mau-lab.test.mjs | claude-haiku-5-5 | 2 | 1,012 | 4 | 14,126 | 29 |
| refute:design-floor-s4.mjs | claude-sonnet-5-5 | 3 | 785 | 6 | 24,232 | 23 |
| machine:bash tests/design-eval/kdd.sh KD9 | claude-haiku-5-5 | 2 | 694 | 4 | 14,100 | 12 |
| machine:node tests/design-eval/mau-lab-chromium. | claude-haiku-5-5 | 2 | 632 | 4 | 14,103 | 8 |
| machine:bash tests/design-eval/kdd.sh --hoi-quy | claude-haiku-5-5 | 2 | 619 | 4 | 14,108 | 65 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 607 | 4 | 14,135 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 584 | 4 | 14,150 | 118 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 573 | 4 | 14,110 | 6 |
| machine:node scripts/build-design-scan.mjs --che | claude-haiku-5-5 | 2 | 555 | 4 | 14,096 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 547 | 4 | 14,150 | 84 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 517 | 4 | 14,094 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 449 | 4 | 9,593 | 9 |


wall: 3475s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 17 | 23,656 | 344,856 | 3357 | 02:10:17 | 03:06:14 |
| review | 3 | 64,359 | 1,271,250 | 302 | 02:10:17 | 02:15:19 |
| triage | 1 | 3,547 | 15,154 | 27 | 03:06:16 | 03:06:43 |
| refute | 1 | 785 | 24,232 | 23 | 03:06:45 | 03:07:09 |
| capture | 1 | 449 | 9,593 | 9 | 03:07:11 | 03:07:20 |
| synthesize | 1 | 8,139 | 27,525 | 49 | 03:07:23 | 03:08:12 |

- **claude-opus-5-5**: 3 agent · 24 calls · out 64,359 · in 48 · cache_read 1,271,250 · cache_create 287,234
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 12,920 · in 18 · cache_read 76,504 · cache_create 87,178
- **claude-haiku-5-5**: 17 agent · 43 calls · out 23,656 · in 88 · cache_read 344,856 · cache_create 222,730

