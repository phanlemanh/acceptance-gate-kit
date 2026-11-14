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

### S4 round 2 — wf_e24d8b8e-f73 (18 agent, 36,289 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:measurement | claude-opus-5-5 | 7 | 5,473 | 14 | 384,114 | 154 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 4,608 | 10 | 169,344 | 757 |
| synthesize:report | claude-sonnet-5-5 | 2 | 3,644 | 4 | 53,360 | 26 |
| review:bugs | claude-opus-5-5 | 4 | 3,324 | 8 | 170,392 | 149 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 3,210 | 12 | 222,252 | 957 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 3,027 | 6 | 108,378 | 24 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,995 | 4 | 49,050 | 98 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 1,969 | 8 | 112,437 | 781 |
| review:conventions | claude-opus-5-5 | 5 | 1,768 | 10 | 224,665 | 119 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,385 | 4 | 45,759 | 242 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 973 | 4 | 49,106 | 160 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 961 | 4 | 49,050 | 12 |
| machine:bash _acceptance/mc11-ten-kho/rang/chieu | claude-haiku-5-5 | 2 | 902 | 4 | 49,071 | 98 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 752 | 4 | 49,106 | 88 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 722 | 4 | 49,106 | 110 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 609 | 4 | 49,076 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 609 | 4 | 49,051 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 358 | 4 | 44,541 | 6 |


wall: 3250s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 3,027 | 108,378 | 24 | 00:25:07 | 00:25:31 |
| review | 3 | 10,565 | 779,171 | 157 | 00:25:07 | 00:27:44 |
| machine | 12 | 18,695 | 942,408 | 3217 | 00:25:07 | 01:18:44 |
| capture | 1 | 358 | 44,541 | 6 | 01:18:44 | 01:18:51 |
| synthesize | 1 | 3,644 | 53,360 | 26 | 01:18:51 | 01:19:17 |

- **claude-opus-5-5**: 3 agent · 16 calls · out 10,565 · in 32 · cache_read 779,171 · cache_create 200,778
- **claude-haiku-5-5**: 12 agent · 33 calls · out 18,695 · in 66 · cache_read 942,408 · cache_create 758,832
- **claude-sonnet-5-5**: 3 agent · 7 calls · out 7,029 · in 14 · cache_read 206,279 · cache_create 180,781

