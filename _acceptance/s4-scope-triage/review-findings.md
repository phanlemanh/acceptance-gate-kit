# Review Findings: s4-scope-triage (round 5)

Informational — outside the hook-enforced evidence-report schema. Chia theo
kết quả SCOPE-TRIAGE (in-contract / out-of-contract), không phải theo
reviewer lane.

## Trong hợp đồng

- **Codex parity gap: partial triage result is not fail-toward-human**
  file: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md:442`
  severity: medium
  AC: AC-9
  detail: The Claude JS side treats a triage result that covers only PART of the confirmed finding list as a whole-round triage failure: acceptance-verify.js sets triageFailed when any finding is missing from the agent's response ('agent tra thieu muc... khong ai REJECT tu findings'), pinned by WT-T14. The codex SKILL defines the unclassified bin only as 'triage failed (agent dead after one retry, or the contract could not be read)' — the missing-entry case is absent. On Codex, a triage pass that silently drops one finding can still drive an auto-REJECT/auto-fix from the classified subset while the dropped finding vanishes from all three bins — exactly the silent-omission class this feature exists to block, and a semantic divergence from the AC-9 parity claim (P54 pins keywords, not this rule). Mirror plugins/feature-loop-codex/skills/feature-loop-codex/SKILL.md has the same text; fix source + resync.
  source: bugs

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Fix escape `?` trong globToRe đã ship nhưng comment tuyên bố ngược lại và không test nào ghim nó**
  Người dùng thấy gì: Nếu một dự án khai đường dẫn file có dấu hỏi (?) trong danh sách kiểm tra phạm vi, phần lọc phạm vi có thể chạy sai mà không có cảnh báo nào — vì chưa có bài kiểm tra nào xác nhận hành vi đúng, lỗi có thể quay lại âm thầm sau này.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **triageFailed presentation contradiction: 'replace the block' vs 'add flag, never swap'**
  Người dùng thấy gì: Trong tình huống hiếm khi một vòng đánh giá vừa có vài lỗi đã được xếp loại xong vừa gặp trục trặc phân loại giữa chừng, hai bộ hướng dẫn nội bộ khác nhau có thể dẫn máy tới việc xoá mất các lỗi đã xếp loại khỏi bản tóm tắt gửi kèm — dù thẻ quyết định chính vẫn hiển thị đầy đủ nên rủi ro thực tế thấp.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có finding nào)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
