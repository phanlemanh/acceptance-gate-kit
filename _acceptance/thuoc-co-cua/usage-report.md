### S3 execute-parallel lượt 1 (chết vì hạn mức phiên) — wf_e4c0d7d1-37a (8 agent, 8,193 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| exec:Làn A | claude-fable-5-1 | 5 | 2,949 | 100 | 205,094 | 38 |
| exec:Làn B | claude-fable-5-1 | 5 | 2,009 | 70 | 222,960 | 27 |
| exec:Làn D | claude-fable-5-1 | 7 | 1,980 | 134 | 400,351 | 30 |
| exec:Làn C | claude-fable-5-1 | 5 | 1,255 | 70 | 223,409 | 20 |
| exec:Làn A | <synthetic> | 1 | 0 | 0 | 0 | 38 |
| exec:Làn B | <synthetic> | 1 | 0 | 0 | 0 | 27 |
| exec:Làn D | <synthetic> | 1 | 0 | 0 | 0 | 30 |
| exec:Làn C | <synthetic> | 1 | 0 | 0 | 0 | 20 |


wall: 38s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| exec | 4 | 8,193 | 1,051,814 | 38 | 09:13:31 | 09:14:08 |

- **claude-fable-5-1**: 4 agent · 22 calls · out 8,193 · in 374 · cache_read 1,051,814 · cache_create 474,007
- **<synthetic>**: 4 agent · 4 calls · out 0 · in 0 · cache_read 0 · cache_create 0

