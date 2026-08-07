# Plan — tai-lap-ceremony-diet

**Nguồn:** [design](../specs/2026-08-08-tai-lap-ceremony-diet-design.md) ·
contract 7 AC đã duyệt Cổng 1 (2026-08-08). Tier T2. Ngân sách ≤2 vòng S4.

## Thứ tự & phụ thuộc

T1 (1a) ⊥ T3 (1c) ⊥ T4 (1d) — nhưng đi tuần tự cùng phiên. T2 (sign-batch)
TRƯỚC T5 (E3/E7 cần helper). T5 (suite + regen records) cần T1–T4. T6 chốt.

### T1 — 1a: gỡ bắt buộc phút + nhãn + KPI `independent: true`
- **Files:** skills/acceptance/references/contract-template.md ·
  commands/approve.md · commands/signoff.md ·
  feature-loop/skills/feature-loop/SKILL.md ·
  codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md ·
  codex/acceptance-gate/skills/approve/SKILL.md ·
  codex/acceptance-gate/skills/signoff/SKILL.md ·
  commands/acceptance-report.md (+ twin codex acceptance-report nếu có).
- **Việc:** gỡ mọi chỉ dẫn bắt-buộc hỏi/điền phút (grep định vị từng chỗ
  trước khi sửa — có case suite đang ghim chuỗi cũ thì sửa cùng T5); report:
  nhãn nguyên văn "tự khai — không đáng tin" + KPI tần-suất-sự-kiện-cần-người
  với LỆNH chạy được (đếm commit chạm dòng human-owned của
  _acceptance/<slug>/ qua git log -G trên pattern human_signoff|human_override|approved_by).
- **Verify:** grep khuôn-cấm trên 7 file = 0 hit; chạy thử lệnh KPI trên
  1 slug đã ký ra số ≥ 1. **Phục vụ:** E1, E2.

### T2 — 1b: scripts/sign-batch.mjs `independent: true`
- **Files:** scripts/sign-batch.mjs (mới).
- **Việc:** --name bắt buộc, --slugs tuỳ chọn (mặc định mọi hồ sơ verified);
  điền human_signoff (evidence-report) + status signed-off (contract) cho lô;
  từ chối ghim tên slug chưa verified; in MỘT lệnh git commit đích danh;
  KHÔNG có code path nào gọi git commit; fail-loud mọi I/O.
- **Verify:** fixture tự dựng nhanh + chạy 2 chiều tay. **Phục vụ:** E3, E7.

### T3 — 1c: CHANGELOG.md + 2.0.0 ×7 manifest `independent: true`
- **Files:** CHANGELOG.md (mới) · 7 manifest (acceptance-gate ×4 kể mirror
  qua sync, feature-loop ×3) — description thêm mục v2.0 ngắn trỏ CHANGELOG.
- **Verify:** node đọc 7 version == 2.0.0; CHANGELOG đủ 4 món. **Phục vụ:** E4, E5.

### T4 — 1d: chính sách re-pin-theo-release `independent: true`
- **Files:** GUIDE.md · CLAUDE.md · SKILL feature-loop ×2 (đoạn nghi thức
  re-pin trỏ về nhịp release).
- **Verify:** grep khuôn chuỗi chính sách đủ 4 chỗ. **Phục vụ:** E6.

### T5 — suite E1–E7 + regen records + sync `independent: false` (cần T1–T4)
- **Files:** tests/plugins/run-tests.sh (khối TCD-CASE-IDS, case P mới —
  MỖI case cặp hai-chiều cùng fixture theo MEASURE-BIRTH) ·
  _acceptance/stop-patching-law/evidence/ + _acceptance/measure-birth-certificate/evidence/
  (tái sinh make-record ×2 vì SKILL đổi) · sync mirror.
- **Verify:** ONLY_BLOCK=TCD standalone từng case + suite scripts. **Phục vụ:** E1–E7.

### T6 — chốt: 6 lệnh kiểm + implemented + dispatch S4 `independent: false`
- **Verify:** scripts/hooks/plugins/workflows/map/sync đều 0 tại HEAD sẽ đo.
