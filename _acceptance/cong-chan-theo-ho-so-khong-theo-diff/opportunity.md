---
schema_version: 1
slug: cong-chan-theo-ho-so-khong-theo-diff
feature: Chốt chặn trước-merge chấm MỌI hồ sơ đã arm cổng, kể cả hồ sơ PR không chạm — một vòng dở làm kẹt mọi PR khác của kho
owner: phanlemanh@gmail.com
stage: discovery
decision:
decided_by:
decided_at:
---

## Vấn đề & ai gặp

`scripts/pre-merge-check.sh` có hai luật cho hồ sơ. Luật «bằng chứng chưa arm cổng» được
gắn với diff PR (`slug_in_diff`). Nhưng luật «hồ sơ ở implemented/verified/signed-off thì
verdict phải PASS» **không gắn với diff**: mọi hồ sơ đã arm trong kho đều bị chấm ở mọi PR.

Ca thật, kho `crm-onehub`, 2026-09-06: ba vòng dừng ở S4 từ 04/09 (`cua-vao-noi-tieng-viet`
BLOCKED · `thuoc-cua-lat-3a-co-rang` BLOCKED · `tieng-viet-cho-crm` REJECT, đều `implemented`).
PR #2 của một vòng ĐÃ KÝ Cổng Bằng chứng, không chạm một tệp nào của ba hồ sơ đó (đo: diff
ba-chấm không có `_acceptance/<ba slug>/`), vẫn bị chặn với đúng ba vi phạm đó. PR #3 sửa CI
cũng bị chặn cùng lý do và được merge với cổng đỏ — tức luật này dạy người merge đỏ.

**Không có đường xếp-lại cho hợp đồng.** Kit có «Xếp lại sau» ở tầng cơ hội (`decision: park`)
nhưng không có trạng thái tương đương cho hợp đồng đang dở giữa S4. Hạ về `draft`/`approved`
thì dính luật thứ nhất (có evidence-report mà chưa arm); phải **đổi tên** `evidence-report.md`
mới clean — đó là thủ thuật, không phải nghi thức. PR #7 của kho crm là bản thi hành thủ thuật đó.

**Người trả giá:** người mở PR cho việc đã ký, bị kẹt bởi việc dở của người khác; và chính
cổng — khi mọi PR đều đỏ vì cùng ba dòng, đỏ mất nghĩa.

## Hai câu để người quyết

1. Luật verdict-phải-PASS nên gắn với diff (chỉ chấm hồ sơ PR chạm) hay giữ toàn kho? Nếu giữ
   toàn kho thì phải có lý do nói được thành lời — vì nó biến một vòng dở thành trạm thu phí.
2. Cần một trạng thái hợp đồng «xếp lại» có tên (vd `parked`), được cả pre-merge lẫn bản đồ
   đọc, thay cho việc đổi tên tệp bằng chứng?

Phép đo hai chiều bắt buộc cho cả hai: một kho mẫu có hồ sơ dở BLOCKED ngoài diff → PR khác
clean (xanh) / hồ sơ dở NẰM TRONG diff → vẫn chặn (đỏ, thông điệp ghim).
