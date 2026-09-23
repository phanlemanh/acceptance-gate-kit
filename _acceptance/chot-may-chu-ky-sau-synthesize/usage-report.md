### S4 round 1 — wf_d51615c1-580 (23 agent, 125,465 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| [Workflow harness — user request] The harness re | claude-opus-5-5 | 27 | 18,752 | 54 | 3,314,045 | 420 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 7 | 16,602 | 14 | 597,174 | 148 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 18 | 14,054 | 36 | 1,396,037 | 120 |
| [Workflow harness — user request] The harness re | claude-opus-5-5 | 15 | 13,245 | 30 | 1,488,671 | 138 |
| [Workflow harness — user request] The harness re | claude-opus-5-5 | 8 | 11,664 | 16 | 672,303 | 118 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 18 | 10,577 | 36 | 1,653,998 | 113 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 2 | 9,631 | 4 | 74,867 | 103 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 10 | 6,822 | 20 | 734,657 | 69 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 18 | 6,196 | 146 | 1,136,228 | 888 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 6 | 1,849 | 50 | 298,056 | 33 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,712 | 18 | 77,166 | 21 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,669 | 18 | 77,172 | 22 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,572 | 18 | 77,199 | 20 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,411 | 18 | 77,190 | 18 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,278 | 18 | 77,168 | 18 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,272 | 18 | 77,177 | 17 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,230 | 18 | 77,165 | 17 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,104 | 18 | 77,065 | 17 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,047 | 18 | 77,157 | 14 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,006 | 18 | 77,175 | 14 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 951 | 18 | 77,072 | 12 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 3 | 917 | 6 | 142,905 | 9 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 904 | 18 | 27,769 | 495 |


wall: 1819s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| [Workflow harness — user request] The harness re | 23 | 125,465 | 12,385,416 | 1819 | 05:04:47 | 05:35:06 |

- **claude-opus-5-5**: 3 agent · 50 calls · out 43,661 · in 100 · cache_read 5,475,019 · cache_create 342,347
- **claude-sonnet-5**: 6 agent · 58 calls · out 58,603 · in 116 · cache_read 4,599,638 · cache_create 533,881
- **claude-haiku-4-5-20251001**: 14 agent · 48 calls · out 23,201 · in 412 · cache_read 2,310,759 · cache_create 512,421

### S4 round 2 — wf_f5ad2b41-aef (23 agent, 117,827 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5 | 8 | 19,871 | 16 | 732,962 | 185 |
| refute:acceptance-verify.js | claude-sonnet-5 | 15 | 17,228 | 30 | 1,380,729 | 182 |
| review:bugs | claude-opus-5-5 | 20 | 15,855 | 40 | 2,036,670 | 161 |
| refute:chot-truong-nguoi.test.mjs | claude-sonnet-5 | 26 | 12,699 | 52 | 2,476,173 | 178 |
| refute:acceptance-verify.js | claude-sonnet-5 | 16 | 10,008 | 32 | 1,339,523 | 122 |
| triage | claude-sonnet-5 | 2 | 7,555 | 4 | 73,291 | 80 |
| review:measurement | claude-opus-5-5 | 8 | 7,020 | 16 | 622,546 | 77 |
| review:conventions | claude-opus-5-5 | 8 | 6,590 | 16 | 582,265 | 65 |
| machine:bash tests/scripts/run-tests.sh | claude-haiku-4-5-20251001 | 11 | 2,788 | 90 | 523,768 | 777 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 7 | 2,069 | 58 | 352,713 | 32 |
| machine:bash -c 'out=$(node tests/workflows/chot | claude-haiku-4-5-20251001 | 2 | 1,759 | 18 | 77,069 | 23 |
| machine:bash -c 'out=$(node tests/workflows/chot | claude-haiku-4-5-20251001 | 2 | 1,609 | 18 | 77,082 | 21 |
| machine:bash -c 'out=$(node tests/workflows/chot | claude-haiku-4-5-20251001 | 2 | 1,581 | 18 | 77,088 | 21 |
| machine:bash -c 'out=$(node tests/workflows/chot | claude-haiku-4-5-20251001 | 2 | 1,480 | 18 | 77,076 | 20 |
| machine:bash -c 'out=$(node tests/workflows/chot | claude-haiku-4-5-20251001 | 2 | 1,455 | 18 | 77,078 | 18 |
| machine:bash -c 'out=$(node tests/workflows/chot | claude-haiku-4-5-20251001 | 2 | 1,344 | 18 | 77,100 | 18 |
| machine:bash -c 'out=$(node tests/workflows/chot | claude-haiku-4-5-20251001 | 2 | 1,208 | 18 | 77,091 | 16 |
| machine:bash -c 'out=$(node tests/workflows/chot | claude-haiku-4-5-20251001 | 2 | 1,127 | 18 | 77,066 | 15 |
| machine:node tests/workflows/chot-truong-nguoi-c | claude-haiku-4-5-20251001 | 2 | 1,124 | 18 | 77,058 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 955 | 18 | 27,769 | 390 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 944 | 18 | 76,966 | 14 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 880 | 18 | 76,973 | 10 |
| capture:provenance | claude-sonnet-5 | 2 | 678 | 4 | 68,767 | 7 |


wall: 1678s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 14 | 20,323 | 1,751,897 | 1223 | 05:37:15 | 05:57:38 |
| review | 3 | 29,465 | 3,241,481 | 162 | 05:37:15 | 05:39:57 |
| triage | 1 | 7,555 | 73,291 | 80 | 05:57:38 | 05:58:58 |
| refute | 3 | 39,935 | 5,196,425 | 184 | 05:58:58 | 06:02:02 |
| capture | 1 | 678 | 68,767 | 7 | 06:02:02 | 06:02:09 |
| synthesize | 1 | 19,871 | 732,962 | 185 | 06:02:09 | 06:05:13 |

- **claude-sonnet-5**: 6 agent · 69 calls · out 68,039 · in 138 · cache_read 6,071,445 · cache_create 544,363
- **claude-opus-5-5**: 3 agent · 36 calls · out 29,465 · in 72 · cache_read 3,241,481 · cache_create 257,510
- **claude-haiku-4-5-20251001**: 14 agent · 42 calls · out 20,323 · in 364 · cache_read 1,751,897 · cache_create 498,375

### S4 round 3 — wf_84ccb7d7-410 (24 agent, 155,050 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 2 | 25,854 | 4 | 86,827 | 233 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 2 | 20,483 | 4 | 75,490 | 212 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 20 | 17,028 | 40 | 2,078,557 | 186 |
| [Workflow harness — user request] The harness re | claude-opus-5-5 | 15 | 16,543 | 30 | 1,442,763 | 160 |
| [Workflow harness — user request] The harness re | claude-opus-5-5 | 19 | 15,224 | 38 | 2,096,879 | 152 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 13 | 12,010 | 26 | 1,065,372 | 126 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 14 | 10,954 | 28 | 1,091,261 | 121 |
| [Workflow harness — user request] The harness re | claude-opus-5-5 | 10 | 8,182 | 20 | 798,344 | 80 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 11 | 8,063 | 22 | 934,266 | 84 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 9 | 2,702 | 74 | 381,783 | 1239 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,976 | 18 | 77,175 | 25 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,853 | 18 | 77,204 | 23 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 8 | 1,765 | 66 | 401,882 | 34 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,609 | 18 | 77,207 | 20 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,412 | 18 | 77,206 | 19 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 2 | 1,262 | 4 | 68,889 | 10 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,259 | 18 | 77,164 | 16 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,225 | 18 | 77,182 | 17 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,142 | 18 | 77,194 | 16 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,134 | 18 | 77,198 | 15 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,009 | 18 | 77,172 | 14 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,000 | 18 | 27,769 | 434 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 761 | 18 | 77,072 | 12 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 600 | 18 | 77,079 | 8 |


wall: 2369s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| [Workflow harness — user request] The harness re | 24 | 155,050 | 11,398,935 | 2369 | 06:13:21 | 06:52:51 |

- **claude-sonnet-5**: 7 agent · 64 calls · out 95,654 · in 128 · cache_read 5,400,662 · cache_create 595,845
- **claude-opus-5-5**: 3 agent · 44 calls · out 39,949 · in 88 · cache_read 4,337,986 · cache_create 296,322
- **claude-haiku-4-5-20251001**: 14 agent · 41 calls · out 19,447 · in 356 · cache_read 1,660,287 · cache_create 574,636

### S4 round 4 — wf_c780527e-74d (20 agent, 102,322 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| [Workflow harness — user request] The harness re | claude-opus-5-5 | 25 | 26,571 | 50 | 2,758,276 | 269 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 13 | 21,720 | 26 | 1,383,802 | 207 |
| [Workflow harness — user request] The harness re | claude-opus-5-5 | 15 | 11,638 | 30 | 1,357,693 | 122 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 2 | 10,335 | 4 | 72,578 | 111 |
| [Workflow harness — user request] The harness re | claude-opus-5-5 | 17 | 9,288 | 34 | 1,477,820 | 100 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 9 | 3,707 | 74 | 397,069 | 921 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 2,669 | 18 | 77,180 | 31 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 6 | 2,027 | 50 | 298,433 | 33 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,838 | 18 | 77,212 | 22 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,475 | 18 | 77,206 | 19 |
| [Workflow harness — user request] The harness re | claude-sonnet-5 | 2 | 1,327 | 4 | 68,894 | 12 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,289 | 18 | 77,190 | 18 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,281 | 18 | 77,172 | 16 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,260 | 18 | 77,214 | 16 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,221 | 18 | 77,215 | 17 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,147 | 18 | 77,202 | 15 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 1,130 | 18 | 77,183 | 16 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 887 | 18 | 27,769 | 506 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 819 | 18 | 77,080 | 13 |
| [Workflow harness — user request] The harness re | claude-haiku-4-5-20251001 | 2 | 693 | 18 | 77,087 | 9 |


wall: 1812s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| [Workflow harness — user request] The harness re | 20 | 102,322 | 8,691,275 | 1812 | 09:24:38 | 09:54:50 |

- **claude-opus-5-5**: 3 agent · 57 calls · out 47,497 · in 114 · cache_read 5,593,789 · cache_create 309,901
- **claude-sonnet-5**: 3 agent · 17 calls · out 33,382 · in 34 · cache_read 1,525,274 · cache_create 311,580
- **claude-haiku-4-5-20251001**: 14 agent · 39 calls · out 21,443 · in 340 · cache_read 1,572,212 · cache_create 496,928

