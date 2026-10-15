### S4 round 1 — wf_ceefe33b-ac2 (20 agent, 37,885 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 3 | 9,157 | 6 | 112,643 | 55 |
| review:measurement | claude-opus-5-5 | 6 | 6,109 | 12 | 303,993 | 143 |
| triage | claude-sonnet-5-5 | 2 | 4,042 | 4 | 37,791 | 32 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 3,077 | 8 | 78,009 | 636 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,510 | 4 | 2,869 | 462 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,356 | 4 | 35,739 | 170 |
| review:conventions | claude-opus-5-5 | 21 | 1,789 | 42 | 1,575,097 | 168 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,779 | 4 | 35,725 | 83 |
| review:bugs | claude-opus-5-5 | 18 | 1,661 | 36 | 1,300,930 | 138 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,547 | 4 | 35,725 | 11 |
| refute:start-scan.mjs | claude-sonnet-5-5 | 7 | 946 | 14 | 254,236 | 31 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 646 | 4 | 35,751 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 527 | 4 | 35,781 | 80 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 418 | 4 | 35,781 | 70 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 394 | 4 | 35,726 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 240 | 4 | 32,865 | 131 |
| machine:node tests/scripts/cua-tin-hieu-giua-chi | claude-haiku-5-5 | 2 | 211 | 4 | 35,748 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 175 | 4 | 2,869 | 381 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 157 | 4 | 34,892 | 15 |
| capture:provenance | claude-sonnet-5-5 | 2 | 144 | 4 | 31,640 | 7 |


wall: 2195s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 157 | 34,892 | 15 | 17:16:55 | 17:17:10 |
| machine | 12 | 13,880 | 402,588 | 2060 | 17:16:55 | 17:51:15 |
| review | 3 | 9,559 | 3,180,020 | 168 | 17:16:55 | 17:19:43 |
| triage | 1 | 4,042 | 37,791 | 32 | 17:51:18 | 17:51:50 |
| refute | 1 | 946 | 254,236 | 31 | 17:51:53 | 17:52:24 |
| capture | 1 | 144 | 31,640 | 7 | 17:52:26 | 17:52:33 |
| synthesize | 1 | 9,157 | 112,643 | 55 | 17:52:35 | 17:53:29 |

- **claude-sonnet-5-5**: 5 agent · 16 calls · out 14,446 · in 32 · cache_read 471,202 · cache_create 237,894
- **claude-opus-5-5**: 3 agent · 45 calls · out 9,559 · in 90 · cache_read 3,180,020 · cache_create 277,030
- **claude-haiku-5-5**: 12 agent · 26 calls · out 13,880 · in 52 · cache_read 402,588 · cache_create 517,494

