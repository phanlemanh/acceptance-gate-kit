### S4 round 1 — wf_08a85474-642 (23 agent, 28,131 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 4,204 | 6 | 230,918 | 45 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,262 | 4 | 133,020 | 219 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,077 | 4 | 70,020 | 331 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,886 | 4 | 70,020 | 460 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,483 | 4 | 133,006 | 60 |
| review:bugs | claude-opus-5-5 | 10 | 1,330 | 20 | 1,108,139 | 85 |
| machine:bash -c 'out=$(node tests/scripts/glob-t | claude-haiku-5-5 | 2 | 1,302 | 4 | 133,132 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,262 | 4 | 133,015 | 161 |
| triage | claude-sonnet-5-5 | 2 | 1,255 | 4 | 99,829 | 15 |
| review:measurement | claude-opus-5-5 | 6 | 1,247 | 12 | 586,112 | 71 |
| machine:bash -c 'out=$(node tests/scripts/glob-t | claude-haiku-5-5 | 2 | 1,229 | 4 | 133,128 | 14 |
| machine:bash -c 'out=$(node tests/scripts/glob-t | claude-haiku-5-5 | 2 | 1,228 | 4 | 133,124 | 15 |
| machine:bash -c 'out=$(node tests/scripts/glob-t | claude-haiku-5-5 | 2 | 1,209 | 4 | 133,136 | 14 |
| review:conventions | claude-opus-5-5 | 15 | 1,123 | 30 | 1,738,757 | 97 |
| machine:bash -c 'out=$(node tests/scripts/glob-t | claude-haiku-5-5 | 2 | 1,040 | 4 | 133,124 | 13 |
| machine:bash -c 'out=$(node tests/scripts/glob-t | claude-haiku-5-5 | 2 | 1,014 | 4 | 133,124 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 918 | 4 | 133,062 | 113 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 868 | 8 | 311,982 | 74 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 496 | 4 | 133,062 | 99 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 236 | 4 | 133,006 | 10 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 186 | 4 | 133,007 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 148 | 4 | 96,785 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 128 | 4 | 70,020 | 347 |


wall: 1902s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 868 | 311,982 | 74 | 11:18:26 | 11:19:41 |
| machine | 16 | 17,956 | 1,940,006 | 1823 | 11:18:26 | 11:48:50 |
| review | 3 | 3,700 | 3,433,008 | 97 | 11:18:26 | 11:20:03 |
| triage | 1 | 1,255 | 99,829 | 15 | 11:48:52 | 11:49:07 |
| capture | 1 | 148 | 96,785 | 11 | 11:49:09 | 11:49:20 |
| synthesize | 1 | 4,204 | 230,918 | 45 | 11:49:22 | 11:50:08 |

- **claude-sonnet-5-5**: 4 agent · 11 calls · out 6,475 · in 22 · cache_read 739,514 · cache_create 442,828
- **claude-haiku-5-5**: 16 agent · 32 calls · out 17,956 · in 64 · cache_read 1,940,006 · cache_create 1,294,585
- **claude-opus-5-5**: 3 agent · 31 calls · out 3,700 · in 62 · cache_read 3,433,008 · cache_create 338,542

### S4 round 2 — wf_b120e4cc-d9b (23 agent, 30,179 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 4,705 | 6 | 233,307 | 58 |
| review:measurement | claude-opus-5-5 | 9 | 3,311 | 18 | 989,184 | 117 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,479 | 4 | 132,933 | 212 |
| triage | claude-sonnet-5-5 | 2 | 2,359 | 4 | 100,934 | 21 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,846 | 4 | 70,020 | 437 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 3 | 1,511 | 6 | 167,978 | 107 |
| review:bugs | claude-opus-5-5 | 18 | 1,419 | 36 | 2,279,115 | 141 |
| machine:bash -c 'out=$(node tests/scripts/glob-t | claude-haiku-5-5 | 2 | 1,388 | 4 | 133,037 | 14 |
| machine:bash -c 'out=$(node tests/scripts/glob-t | claude-haiku-5-5 | 2 | 1,335 | 4 | 133,037 | 16 |
| machine:bash -c 'out=$(node tests/scripts/glob-t | claude-haiku-5-5 | 2 | 1,305 | 4 | 133,037 | 46 |
| machine:bash -c 'out=$(node tests/scripts/glob-t | claude-haiku-5-5 | 2 | 1,295 | 4 | 133,049 | 15 |
| machine:bash -c 'out=$(node tests/scripts/glob-t | claude-haiku-5-5 | 2 | 1,259 | 4 | 133,041 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,143 | 4 | 132,928 | 152 |
| review:conventions | claude-opus-5-5 | 14 | 1,131 | 28 | 1,682,829 | 105 |
| machine:bash -c 'out=$(node tests/scripts/glob-t | claude-haiku-5-5 | 2 | 1,014 | 4 | 133,045 | 12 |
| refute:glob-thoat-ngoac.test.mjs | claude-sonnet-5-5 | 5 | 978 | 10 | 429,419 | 27 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 416 | 4 | 132,975 | 107 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 303 | 4 | 132,919 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 299 | 4 | 70,020 | 328 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 220 | 4 | 132,933 | 282 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 190 | 4 | 132,920 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 150 | 4 | 96,698 | 13 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 123 | 4 | 132,975 | 92 |


wall: 1884s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 16 | 16,126 | 2,036,847 | 1756 | 11:51:41 | 12:20:57 |
| review | 3 | 5,861 | 4,951,128 | 143 | 11:51:41 | 11:54:03 |
| triage | 1 | 2,359 | 100,934 | 21 | 12:20:59 | 12:21:21 |
| refute | 1 | 978 | 429,419 | 27 | 12:21:23 | 12:21:50 |
| capture | 1 | 150 | 96,698 | 13 | 12:21:52 | 12:22:05 |
| synthesize | 1 | 4,705 | 233,307 | 58 | 12:22:07 | 12:23:05 |

- **claude-sonnet-5-5**: 4 agent · 12 calls · out 8,192 · in 24 · cache_read 860,358 · cache_create 452,647
- **claude-opus-5-5**: 3 agent · 41 calls · out 5,861 · in 82 · cache_read 4,951,128 · cache_create 345,545
- **claude-haiku-5-5**: 16 agent · 33 calls · out 16,126 · in 66 · cache_read 2,036,847 · cache_create 1,291,743

