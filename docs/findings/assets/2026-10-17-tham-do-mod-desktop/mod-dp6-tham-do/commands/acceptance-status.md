---
description: Show acceptance gate status for all features in this repo
disable-model-invocation: true
---

BẢN SAO THĂM DÒ (câu 5, 17/10) — frontmatter chép nguyên từ `commands/acceptance-status.md` của kit, thân thay bằng
dấu chiều đỏ: nếu đoạn này tới được model thì hook `command.run` của mod KHÔNG trả lời thay được lệnh markdown.
Model: chỉ đáp đúng một dòng «dp6-cau5: lệnh markdown đã tới model», không chạy gì.
