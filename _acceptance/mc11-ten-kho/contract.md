---
schema_version: 1
feature: Ca MC-11 đọc tên kho từ thư mục checkout thay vì viết cứng tên acceptance-gate-kit
slug: mc11-ten-kho
owner: phanlemanh@gmail.com
risk_tier: T2               # chỉ tests/scripts/moc-chien-dich.test.mjs — không chạm hooks, lib, scripts/pre-merge-check.sh, scripts/recheck-evidence.cjs
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-11-14-mc11-ten-kho-design.md
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-11-13T23:12:53Z
---

# Acceptance Contract: mc11-ten-kho

## Context

Gốc: ~/dev/delivery-loop/.claude/worktrees/b1-kich-ban-chuyen-nha-71df60/_acceptance/kich-ban-chuyen-nha/ (vòng B1 của kho
kế nhiệm: mọi lượt chấm REJECT chỉ vì ca MC-11 đỏ sẵn; finding ở `review-findings.md` và `duong-nen.md` của hồ sơ ấy). Ca
MC-11 của `tests/scripts/moc-chien-dich.test.mjs` gọi `tenChienDich` với `kho: tenKho(KIT)` — tên thư mục của bản checkout
chính — nhưng so kết quả với chữ cứng `(acceptance-gate-kit)`. Cùng cây chạy ở thư mục khác tên thì ca đỏ dù vật không đổi
(đã gặp 03/11 ở bản sao `kit-nen`, sổ `ban-do-khuon-roi-nhom`). Chủ kho chọn sửa ở kho cũ (14/11). Vật đã ở commit
`b177d67c`, PR #502.

Thuật ngữ:
- **tệp ca** = `tests/scripts/moc-chien-dich.test.mjs`.
- **bản sao khác tên** = bản clone của cây đang kiểm đặt ở thư mục tên `kho-ten-khac`.
- **bản chữ cứng** = tệp ca ở `0c4e503b`, trước bản sửa.

## Criteria

- AC-1: Given tệp ca ở cây đang kiểm, chạy trong checkout tên `acceptance-gate-kit`, When chạy cả tệp ca, Then thoát 0, có dòng
  `PASS: MC-11` và dòng tổng `0 failed`.
- AC-2: Given bản sao khác tên, When chạy tệp ca của cây đang kiểm rồi lần lượt thay đúng tệp ca bằng bản chữ cứng, làm
  `tenChienDich` đổi dấu « · » thành « - », và làm `tenKho` trả chuỗi rỗng, Then lần lành thoát 0 với `PASS: MC-11`; bản chữ
  cứng thoát khác 0 với `FAIL: MC-11 — ten_phien «MC1 · Mốc là chiến dịch (kho-ten-khac)»`; dấu sai cho `FAIL: MC-11 — ten_phien
  «MC1 - Mốc là chiến dịch (kho-ten-khac)»`; tên kho rỗng cho dòng `FAIL: MC-11` mang `tenKho trả rỗng`. Mọi nhát phá chỉ chạy
  khi lần lành xanh.
- AC-3: Given tệp ca, When đọc ca bảng `gach-va-ngoac` và chạy tệp ca với `tenChienDich` đổi dấu phân cách, Then ca bảng vẫn
  truyền `kho: 'acceptance-gate-kit'` tường minh và ghim chữ `MC1 · Mốc là chiến dịch (acceptance-gate-kit)`, phép kiểm dòng ca
  bảng đỏ khi dòng ấy bị đổi trên bản sao, và dấu sai làm dòng `FAIL: MC-6` gọi tên `gach-va-ngoac`.

## Coverage

Bỏ quét không gian: quyết định `bỏ coverage-scan` trong `decisions.jsonl`. Không gian có một trục là tên thư mục kho (trùng
tên kho chính · khác tên); AC-1 đo ô trùng tên, AC-2 đo ô khác tên kèm chiều đỏ, AC-3 giữ chiều đỏ của định dạng.

## Out of scope

- `scripts/lo-trinh.mjs` (`tenKho`, `tenChienDich`) và mọi vật ngoài tệp ca không đổi.
- Các ca khác trong tệp ca, gồm ca bảng `gach-va-ngoac`, không đổi.
- Việc của vòng B1 ở kho kế nhiệm (đo lại, chấm lượt 3) thuộc phiên B1.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes
