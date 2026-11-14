### S4 round 1 — wf_bf1845e8-e65 (21 agent, 52,837 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 6 | 5,319 | 12 | 301,821 | 154 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 5,225 | 14 | 282,753 | 943 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,145 | 16 | 340,077 | 795 |
| review:conventions | claude-opus-5-5 | 9 | 5,111 | 18 | 498,523 | 159 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 5,074 | 14 | 287,814 | 754 |
| synthesize:report | claude-sonnet-5-5 | 2 | 4,564 | 4 | 55,670 | 28 |
| review:measurement | claude-opus-5-5 | 5 | 4,204 | 10 | 240,439 | 125 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 3,618 | 6 | 109,898 | 46 |
| machine:node tests/scripts/moc-chien-dich.test.m | claude-haiku-5-5 | 2 | 3,179 | 4 | 49,012 | 30 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,094 | 4 | 49,002 | 97 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,842 | 4 | 49,002 | 14 |
| machine:bash _acceptance/mc11-ten-kho/rang/chieu | claude-haiku-5-5 | 3 | 1,128 | 8 | 102,850 | 81 |
| refute:chieu-do.sh | claude-sonnet-5-5 | 2 | 949 | 4 | 44,744 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 866 | 4 | 49,058 | 108 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 808 | 4 | 45,711 | 240 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 725 | 4 | 49,058 | 159 |
| triage | claude-sonnet-5-5 | 2 | 670 | 4 | 46,839 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 665 | 4 | 49,058 | 87 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 660 | 4 | 49,003 | 5 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 624 | 4 | 49,028 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 367 | 4 | 44,493 | 8 |


wall: 3263s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 14,634 | 1,040,783 | 159 | 23:13:56 | 23:16:34 |
| machine | 13 | 28,035 | 1,451,426 | 3209 | 23:13:56 | 00:07:25 |
| baseline | 1 | 3,618 | 109,898 | 46 | 23:13:56 | 23:14:42 |
| triage | 1 | 670 | 46,839 | 8 | 00:07:25 | 00:07:33 |
| refute | 1 | 949 | 44,744 | 10 | 00:07:33 | 00:07:43 |
| capture | 1 | 367 | 44,493 | 8 | 00:07:43 | 00:07:50 |
| synthesize | 1 | 4,564 | 55,670 | 28 | 00:07:50 | 00:08:19 |

- **claude-opus-5-5**: 3 agent · 20 calls · out 14,634 · in 40 · cache_read 1,040,783 · cache_create 202,283
- **claude-haiku-5-5**: 13 agent · 43 calls · out 28,035 · in 88 · cache_read 1,451,426 · cache_create 821,805
- **claude-sonnet-5-5**: 5 agent · 11 calls · out 10,168 · in 22 · cache_read 301,644 · cache_create 296,062

