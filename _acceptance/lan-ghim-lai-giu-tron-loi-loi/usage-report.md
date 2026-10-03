### S4 round 1 — wf_bf454330-cd4 (29 agent, 47,167 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| synthesize:report | claude-sonnet-5-5 | 2 | 10,671 | 4 | 100,165 | 64 |
| triage | claude-sonnet-5-5 | 2 | 6,140 | 4 | 87,933 | 45 |
| review:conventions | claude-opus-5-5 | 16 | 3,323 | 32 | 1,765,993 | 157 |
| review:measurement | claude-opus-5-5 | 10 | 3,224 | 20 | 1,099,286 | 152 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 2,574 | 18 | 89,723 | 42 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 2,035 | 18 | 89,705 | 123 |
| review:bugs | claude-opus-5-5 | 26 | 1,805 | 52 | 3,642,540 | 357 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 1,774 | 18 | 89,722 | 27 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,543 | 18 | 89,705 | 158 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,450 | 18 | 89,692 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-4-5-20251001 | 2 | 1,405 | 18 | 89,705 | 226 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-4-5-20251001 | 2 | 1,298 | 18 | 89,692 | 29 |
| refute:chan-tai-may.mjs | claude-sonnet-5-5 | 4 | 1,124 | 8 | 297,604 | 27 |
| refute:chan-tai-may.mjs | claude-sonnet-5-5 | 4 | 1,076 | 8 | 295,090 | 24 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-4-5-20251001 | 2 | 1,000 | 18 | 60,671 | 134 |
| baseline:diffBase | claude-sonnet-5-5 | 4 | 898 | 8 | 250,505 | 16 |
| refute:ban-base.mjs | claude-sonnet-5-5 | 4 | 816 | 8 | 252,008 | 18 |
| refute:chan-tai-may.mjs | claude-sonnet-5-5 | 5 | 794 | 10 | 382,795 | 22 |
| refute:ban-base.mjs | claude-sonnet-5-5 | 3 | 738 | 6 | 198,452 | 18 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 701 | 18 | 89,723 | 46 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 695 | 18 | 89,725 | 19 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 604 | 18 | 89,741 | 90 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 479 | 18 | 89,723 | 15 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-4-5-20251001 | 2 | 337 | 18 | 89,699 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 265 | 18 | 89,741 | 70 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-4-5-20251001 | 2 | 240 | 18 | 89,741 | 242 |
| capture:provenance | claude-sonnet-5-5 | 2 | 149 | 4 | 79,431 | 6 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 6 | 18 | 89,721 | 17 |
| machine:bash _acceptance/lan-ghim-lai-giu-tron-l | claude-haiku-4-5-20251001 | 2 | 3 | 18 | 89,726 | 23 |


wall: 1285s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 898 | 250,505 | 16 | 23:52:03 | 23:52:19 |
| machine | 17 | 16,409 | 1,496,155 | 1132 | 23:52:03 | 00:10:56 |
| review | 3 | 8,352 | 6,507,819 | 359 | 23:52:03 | 23:58:02 |
| triage | 1 | 6,140 | 87,933 | 45 | 00:10:57 | 00:11:42 |
| refute | 5 | 4,548 | 1,425,949 | 30 | 00:11:44 | 00:12:14 |
| capture | 1 | 149 | 79,431 | 6 | 00:12:16 | 00:12:22 |
| synthesize | 1 | 10,671 | 100,165 | 64 | 00:12:25 | 00:13:28 |

- **claude-sonnet-5-5**: 9 agent · 30 calls · out 22,406 · in 60 · cache_read 1,943,983 · cache_create 704,943
- **claude-opus-5-5**: 3 agent · 52 calls · out 8,352 · in 104 · cache_read 6,507,819 · cache_create 412,739
- **claude-haiku-4-5-20251001**: 17 agent · 34 calls · out 16,409 · in 306 · cache_read 1,496,155 · cache_create 631,163

