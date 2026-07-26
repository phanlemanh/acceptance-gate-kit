# Cưỡng chế gap-probe ở write-time (hook PreToolUse) — ĐÃ TỪ CHỐI

**Trạng thái:** từ chối 2026-07-26, gỡ khỏi `main` ở commit `8ac4ce6`.
**Đã tốn:** contract v1, 3 vòng S4, ~69 agent, ~5,4M token subagent, 19 finding
(2 lỗ HIGH còn mở khi gỡ).

## Đề xuất là gì

Chặn ngay lúc agent GHI `contract.md`: khi contract T2/T3 tiến qua cổng
(`status` chuyển sang `implemented`+) mà thiếu `gap-probe.md` và thiếu entry
ledger descope thì hook `PreToolUse` từ chối lần ghi đó. Ý hấp dẫn: chặn **sớm**,
ngay lúc duyệt, thay vì đợi tới merge.

## Vì sao bác — hai lý do kiến trúc, không phải lỗi cài đặt

**1. Guard đọc trạng thái đang bị ghi, do chính agent bị ràng buộc viết ra.**
Mọi đầu vào của luật (`risk_tier`, `status`, sự có mặt của `gap-probe.md`) nằm
trong artifact mà agent đang sửa. Agent muốn qua cổng chỉ cần **hạ `risk_tier`
trong chính lần ghi đó** — hook thấy T1, cho qua, exit 0, stderr rỗng. Không phải
bug: đó là hệ quả của việc đặt luật ở nơi kẻ bị kiểm soát nắm quyền viết đầu vào.
Ba round S4 sinh ra 3 biến thể của cùng một lỗ này (`d-103`, `d-109`, `d-114`).

**2. Nửa "nhắc" chạy trên một kênh không giao được cho ai.**
Ở mode advisory, hook in NOTE ra stderr rồi exit 0 — mà hợp đồng `PreToolUse`
loại bỏ stderr khi exit 0. Thông điệp không tới người, không tới agent, không tới
log. Kênh chết. Đây là `d-114`, và nó suýt tái diễn ở v3 (xem P0-2 trong
`_acceptance/gap-probe-presence-hook/gap-probe.md`).

Ở merge-boundary không có vấn đề nào trong hai vấn đề đó: contract đã commit nên
không sửa được nữa; hạ tier thì hiện trong diff PR; và CI có kênh in cho người đọc.

## Prior requests

- **2026-07-26** — đề xuất gốc của feature `gap-probe-presence-hook` (contract
  v1). Triển khai đầy đủ, 3 vòng S4, rồi GỠ. Ledger `d-20260726T180000Z-114`.

## Nếu đề xuất này quay lại

Người đọc mã sau này sẽ thấy `pre-merge-check.sh` cưỡng chế một luật mà hook
không cưỡng chế, và phản xạ tự nhiên là "đưa lại vào hook cho chặn sớm". Trước
khi làm, phải trả lời được **cả hai** câu:

1. Làm sao guard biết `risk_tier` thật, khi giá trị đó nằm trong chính nội dung
   đang được ghi bởi bên bị kiểm soát?
2. Kênh nào giao được thông điệp "nhắc" (không chặn) tới một con người, dưới
   hợp đồng `PreToolUse` hiện tại?

Không trả lời được thì câu trả lời vẫn là không.
