# Lệnh in ra phải bấm được — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mọi lệnh kit in cho người đều là dạng harness bảo đảm (`/<plugin>:<tên>`), một nguồn tên; hai cờ nhiễu bị trừ; bốn sửa đúng từ finding B/C.

**Architecture:** Bảng marker `COMMAND-NAMES` + một câu luật trong `human-facing-language.md`; 48 điểm đổi tay theo bảng; `gate-card.js` ba sửa nhỏ (Analyst n-a có lý do → không đỏ; bỏ cờ glossary-base; `ddIsBoLine` regex); CONTEXT/uat-session/start.md/stub sửa chữ; file ca `tests/plugins/lenh-bam-duoc.test.mjs` LB1–LB8 + cập nhật DD2/DD4/DD7.

**Tech Stack:** Node ESM test, bash suite, `tests/fixtures/from-template.mjs`, `lib/md-section.cjs` (chỉ dùng).

**Spec:** `docs/superpowers/specs/2026-08-22-lenh-in-ra-phai-bam-duoc-design.md` · hợp đồng `_acceptance/lenh-in-ra-phai-bam-duoc/contract.md`.

## Global Constraints
- Không chạm `lib/**`, hook, `pre-merge-check.sh`, `recheck-evidence.cjs`. Không đổi 170 literal thước cũ (d-4504). Không bỏ cờ ngưỡng/biên (d-4509).
- Chốt `PASS: [LBn]`; fixture code-sinh; ranh giới token khai tường minh (AC-2).

### Task 1 — bảng COMMAND-NAMES + câu luật (human-facing-language.md)
- [ ] Thêm section `## Tên lệnh bấm được` sau khối `GATE-ONESHOT-SITES` với khối marker `COMMAND-NAMES` (10 dòng: 7 command acceptance-gate · uat-session skill · feature-loop skill · goal harness) + MỘT câu luật (H1).
### Task 2 — 48 điểm bàn giao
- [ ] Đổi từng điểm (danh sách kiểm kê 22/08) sang cột «lệnh bấm được»; `uat-session <slug>` → `/acceptance-gate:uat-session <slug>`; `/feature-loop <x>` → `/feature-loop:feature-loop <x>`; `/goal` giữ. Câu giải thích «lệnh `/start` không sửa gì» → dùng dạng có tiền tố.
### Task 3 — gate-card.js
- [ ] Analyst: `n-a` + lý do ≥ 20 ký tự → không đẩy `fred`; `n-a` trần/ngắn → `fred` «Analyst n-a không nêu lý do — …»; khác → như cũ.
- [ ] Bỏ nhánh `glossaryDeltaErr === 'no-base'` → finfo.
- [ ] `ddIsBoLine = l => /^bỏ\s+đường[-\s]đo\b/i.test(l.trim())`.
### Task 4 — chữ: CONTEXT `_Avoid_` bỏ «metric»; uat-session «Số lấy từ tracking» → «Số lấy từ đường đo đã khai»; start.md dời khối START-HIEU-KET vào đầu bullet «Bắt đầu việc mới»; stub duong-do thêm dòng ghi chú decided_at xấp xỉ.
### Task 5 — tests: `lenh-bam-duoc.test.mjs` LB1–LB8 (theo AC-1…AC-8, chi tiết trong contract), nối `run-tests.sh`; cập nhật DD2/DD4 (dòng bỏ không gạch) và DD7 (_Avoid_ tracking, không metric).
### Task 6 — 4 suite + product-map --check; contract → implemented.
