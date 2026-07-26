# Bàn giao sang máy A — 2026-07-26

**Cho ai:** phiên Claude trên máy A (memory của máy cũ KHÔNG đi theo — file này
là nguồn bàn giao duy nhất, mọi thứ cần biết nằm ở đây hoặc trong repo).
**Việc:** chạy nốt feature `premerge-rules-ledger` và đóng các khoản nợ đã khai.

## Trạng thái ba feature

| Slug | Status | Ghi chú |
|---|---|---|
| `gap-probe-presence-hook` | signed-off | evidence pin `834eae8` — STALE (nợ #2) |
| `t1-escape-event-scope` | signed-off | evidence pin `7fdfad1`, HEAD lệch các sửa round 5-6 (nợ #1) |
| `premerge-rules-ledger` | **approved** — Cổng 1 duyệt `48ea880` | resume từ S2 |

## Việc kế tiếp, theo thứ tự

1. `/feature-loop premerge-rules-ledger` → resume vào **S2 PLAN**.
   Contract: `_acceptance/premerge-rules-ledger/contract.md` (12 AC — đọc KỸ
   bảng biểu diễn ở AC-3 và chữ ký `ledger_mark` ở AC-7; hai cái đó là kết quả
   gap-probe, đừng thiết kế lại). Design:
   `docs/superpowers/specs/2026-07-26-premerge-rules-ledger-design.md`.
2. **T3 ⇒ Cổng 1.5**: trình plan cho người duyệt rồi mới S3.
3. S3 theo TDD; case tiền tố `RL*` / `P48+`. MỌI assertion theo bất biến #4
   CLAUDE.md (đối chứng dương + ghim thông điệp — đã thủng 9 lượt, đọc bất
   biến trước khi viết case đầu tiên).
4. S4: khi verify feature này, **gộp luôn hai vòng delta nợ**:
   - re-verify `gap-probe-presence-hook` (delta: chỉ eval có `paths` chạm
     `scripts/pre-merge-check.sh`, carry phần còn lại theo run-log round 4);
   - re-verify `t1-escape-event-scope` tương tự (round 6 evidence, carry theo
     run-log; panel E13 carry theo inputsHash nếu evidence judge không đổi).
   Cả hai cần **ký lại một dòng** ở Cổng 2 sau khi re-pin.
5. S5: bump version thuộc S3 (KHÔNG phải sau Cổng 2 — GUIDE mục vòng đời, đã
   dẫm một lần). Push/PR khi cổng sạch cả hai chế độ:
   `bash scripts/pre-merge-check.sh . --base <base> [--no-t1-escape cho push]`.

## Nợ đã khai khi ký (user chấp nhận 2026-07-26)

1. Evidence hai feature cũ stale — đóng bằng bước 4 ở trên.
2. `TE4` chưa ghim thông điệp (round 5 finding, chưa vá) — vá tiện tay trong S3.
3. Một chỗ "the gate" trong văn tiếng Anh (`evidence-report.md` t1-escape:357)
   — chỉ sửa khi re-generate report, đừng sửa tay evidence.
4. Dấu thời gian 15 entry đầu ledger t1-escape là 20260727 (tương lai) — ĐÃ
   đính chính bằng entry `d-216`, không sửa dòng cũ (append-only).
5. CI push sẽ ĐỎ cho tới khi bước 4 xong (staleness) — biết trước, không phải
   hồi quy.

## Task chip còn treo ở máy cũ (không đi theo máy)

Sáu việc đã tách, mô tả đầy đủ nằm trong prompt của chip cũ — tái tạo từ đây:
- `_Allow_` cho "P0 design gate" trong CONTEXT.md (lint W6 đang cảnh báo sai
  chính prose của kit — xem `lib/context-glossary.js` cách parse `_Allow_`).
- No-op `cur = cur` trong `lib/context-glossary.js:77` (dòng `_Avoid_` xa bị
  gán nhầm term cuối).
- **False-green: dòng `#` cắt đứt `## Criteria`** — ba parser bất đồng
  (`pre-merge-check.sh:~311` awk `/^#/`, `eval-coverage-lint.js:66`,
  `gate-card.js:92` dùng `^#{2,6}`); răng cặp-eval cross-layer tắt im lặng.
  NẶNG NHẤT trong nhóm, cần contract T3 riêng.
- Khối từ vựng thẻ Cổng 1 im lặng ở 2 lối hỏng (CONTEXT.md untracked → "không
  đổi term nào"; lib nạp thất bại → không cờ nào bắn).
- Sweep từ vựng vòng 2: "thẻ"→card, "runner/engine", "CI gate" (danh sách chỗ
  trong review-findings các round — grep `_Avoid_` CONTEXT.md rồi quét).
- Staleness guard cần phạm vi sự kiện như răng T1-escape (nửa sau của
  t1-escape-event-scope; ba hướng giải trong ledger `d-209`).

## Bài học phải mang theo (bản đầy đủ trong CLAUDE.md + docs/adr/)

- Bất biến #4: assertion âm-tính-một-mình không sống — đối chứng dương + ghim
  thông điệp, sửa theo LỚP.
- Blacklist trên không gian mở không hội tụ — đó là lý do tồn tại của chính
  feature `premerge-rules-ledger`; nếu S3 thấy mình vá đầu vào lần nữa, dừng.
- `set -e` KHÔNG nổ khi command substitution hỏng trong danh sách đối số —
  gán vào biến trước rồi mới dùng.
- Hai lần `git checkout <file>` xoá mất việc chưa commit — backup bằng `cp`
  trước khi tiêm thử.
