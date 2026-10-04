### S4 round 1 — wf_d30287f1-ce1 (23 agent, 29,081 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 5,937 | 6 | 286,342 | 63 |
| triage | claude-sonnet-5-5 | 2 | 3,087 | 4 | 123,064 | 27 |
| review:measurement | claude-opus-5-5 | 18 | 2,507 | 36 | 2,864,025 | 274 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,909 | 18 | 122,491 | 246 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,881 | 18 | 122,491 | 294 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,606 | 18 | 122,491 | 152 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,503 | 18 | 122,478 | 35 |
| review:conventions | claude-opus-5-5 | 28 | 1,447 | 56 | 4,343,068 | 232 |
| review:bugs | claude-opus-5-5 | 21 | 1,168 | 42 | 3,414,350 | 213 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 1,076 | 18 | 93,433 | 263 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 3 | 1,040 | 28 | 225,362 | 21 |
| machine:bash -c 'NLVH_CASES=NL-AC3-im,NL-dot-bie | claude-haiku-4-5-20251001 | 2 | 800 | 18 | 122,537 | 79 |
| machine:bash -c 'NLVH_CASES=NL-AC5-luat,NL-dot-b | claude-haiku-4-5-20251001 | 2 | 712 | 18 | 122,576 | 41 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 677 | 8 | 377,911 | 40 |
| refute:config.yaml | claude-sonnet-5-5 | 5 | 603 | 10 | 550,281 | 41 |
| refute:config.yaml | claude-sonnet-5-5 | 4 | 581 | 8 | 416,863 | 24 |
| refute:config.yaml | claude-sonnet-5-5 | 4 | 573 | 8 | 378,185 | 18 |
| machine:bash -c 'NLVH_CASES=NL-AC1-sach,NL-AC2-c | claude-haiku-4-5-20251001 | 2 | 565 | 18 | 122,582 | 39 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 399 | 18 | 122,527 | 110 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 310 | 18 | 122,527 | 298 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 300 | 18 | 122,485 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 255 | 18 | 122,527 | 91 |
| capture:provenance | claude-sonnet-5-5 | 2 | 145 | 4 | 118,187 | 9 |


wall: 1692s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 677 | 377,911 | 40 | 13:12:16 | 13:12:56 |
| machine | 13 | 12,356 | 1,666,507 | 1540 | 13:12:16 | 13:37:55 |
| review | 3 | 5,122 | 10,621,443 | 276 | 13:12:16 | 13:16:52 |
| triage | 1 | 3,087 | 123,064 | 27 | 13:37:58 | 13:38:24 |
| refute | 3 | 1,757 | 1,345,329 | 45 | 13:38:26 | 13:39:11 |
| capture | 1 | 145 | 118,187 | 9 | 13:39:14 | 13:39:22 |
| synthesize | 1 | 5,937 | 286,342 | 63 | 13:39:24 | 13:40:27 |

- **claude-sonnet-5-5**: 7 agent · 24 calls · out 11,603 · in 48 · cache_read 2,250,833 · cache_create 877,830
- **claude-opus-5-5**: 3 agent · 67 calls · out 5,122 · in 134 · cache_read 10,621,443 · cache_create 511,224
- **claude-haiku-4-5-20251001**: 13 agent · 27 calls · out 12,356 · in 244 · cache_read 1,666,507 · cache_create 981,794

