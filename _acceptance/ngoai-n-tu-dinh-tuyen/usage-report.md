### S4 round 1 — wf_504c44c3-eac (23 agent, 45,795 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 4 | 11,857 | 8 | 330,313 | 79 |
| triage | claude-sonnet-5-5 | 2 | 6,103 | 4 | 84,254 | 44 |
| review:conventions | claude-opus-5-5 | 27 | 5,119 | 54 | 3,398,131 | 220 |
| review:measurement | claude-opus-5-5 | 8 | 3,056 | 16 | 850,071 | 131 |
| review:bugs | claude-opus-5-5 | 18 | 2,949 | 36 | 2,093,923 | 180 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,550 | 4 | 34,982 | 429 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,444 | 4 | 34,982 | 399 |
| judge:E9b:domain-correctness | claude-sonnet-5-5 | 4 | 1,845 | 8 | 252,031 | 21 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,813 | 4 | 34,982 | 592 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,483 | 4 | 113,890 | 90 |
| judge:E9b:operational-feasibility | claude-sonnet-5-5 | 3 | 1,365 | 6 | 199,925 | 16 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,213 | 4 | 78,917 | 186 |
| judge:E9b:spec-alignment | claude-sonnet-5-5 | 3 | 1,193 | 6 | 200,225 | 16 |
| machine:bash -c 'set -o pipefail; node tests/scr | claude-haiku-5-5 | 2 | 539 | 4 | 113,971 | 16 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 441 | 4 | 113,946 | 138 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 365 | 4 | 113,891 | 5 |
| machine:node tests/scripts/ngoai-n-khoi-khac.mjs | claude-haiku-5-5 | 2 | 327 | 4 | 113,908 | 5 |
| machine:bash -c 'LMCMS_ONLY=LM20 node tests/scri | claude-haiku-5-5 | 2 | 227 | 4 | 113,930 | 60 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 211 | 4 | 113,890 | 8 |
| baseline:diffBase | claude-sonnet-5-5 | 2 | 203 | 4 | 82,121 | 73 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 170 | 4 | 113,946 | 74 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 169 | 4 | 113,946 | 307 |
| capture:provenance | claude-sonnet-5-5 | 2 | 153 | 4 | 77,694 | 7 |


wall: 2384s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 203 | 82,121 | 73 | 15:22:21 | 15:23:34 |
| machine | 13 | 11,952 | 1,209,181 | 2248 | 15:22:21 | 15:59:48 |
| judge | 3 | 4,403 | 652,181 | 21 | 15:22:21 | 15:22:42 |
| review | 3 | 11,124 | 6,342,125 | 220 | 15:22:21 | 15:26:01 |
| triage | 1 | 6,103 | 84,254 | 44 | 15:59:50 | 16:00:34 |
| capture | 1 | 153 | 77,694 | 7 | 16:00:37 | 16:00:44 |
| synthesize | 1 | 11,857 | 330,313 | 79 | 16:00:46 | 16:02:05 |

- **claude-sonnet-5-5**: 7 agent · 20 calls · out 22,719 · in 40 · cache_read 1,226,563 · cache_create 595,699
- **claude-opus-5-5**: 3 agent · 53 calls · out 11,124 · in 106 · cache_read 6,342,125 · cache_create 407,937
- **claude-haiku-5-5**: 13 agent · 26 calls · out 11,952 · in 52 · cache_read 1,209,181 · cache_create 920,401

