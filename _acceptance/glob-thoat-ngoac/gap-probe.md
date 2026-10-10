---
slug: glob-thoat-ngoac
at: 2026-10-09T09:51:25Z
verdict: findings
p0: 0
p1: 2
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | AC-4 không đi qua bộ đọc paths riêng của carry-plan — GT4 có thể đưa mảng paths đã tách thẳng vào hàm kế hoạch | Bộ đọc một dòng cắt ở dấu «]» đầu tiên trong «[[]» → mục thành «…/[[» → eval luôn được mang sang dù tệp đã đổi; GT4 vẫn xanh | GT4 dựng evals.yaml dạng văn bản, chạy bộ đọc thật, assert khứ hồi chuỗi gốc rồi mới assert rerun; mutant «cắt ở ] đầu tiên» | fixed: AC-4 viết lại (văn bản + khứ hồi), E4 cập nhật, mutant GT5e thêm vào AC-6 |
| P1 | contract | staleByPaths là nơi thứ ba hưởng bản sửa (thận trọng → hẹp) mà không AC nào đo | staleByPaths so qua đường khác (glob chưa dịch, so tiền tố) → hồ sơ có eval thành ngữ không bao giờ hoá cũ khi tệp «[slug]» đổi; E1–E6 vẫn xanh | Trục B thêm staleByPaths; AC hai chiều trên kho mẫu; mutant cho nhánh đó | fixed: AC-5 mới (GT6/GT6b qua pre-merge-check), trục B thêm staleByPaths; mutant ở pathGlobToRe (GT5a) là mảnh chung — staleByPaths dùng chính hàm đó |
| P2 | evals | Không có ca mục thành ngữ trỏ vào tệp không có | Cài «có [[] thì nhận» bỏ kiểm tồn tại vẫn qua GT2/GT2b/GT2c; mục gõ sai được nhận, chamTuPin bỏ sót ô | GT2d ghim mã paths-khong-tro-toi-tep; mutant bỏ kiểm tồn tại | fixed: GT2d thêm vào AC-2/E2, mutant GT5d thêm vào AC-6 |
| P2 | evals | Fixture GT3 viết tay, không khứ hồi với dạng THẬT của ô crm (neo Gốc) | crm viết paths khác dạng fixture → kit xanh mà ghim lại crm vẫn gắn oan bốn ô | Fixture rút nguyên văn khối paths của một ô crm kèm sha nguồn; hoặc kiểm ngoài ở Notes | fixed: AC-3 dùng nguyên văn khối paths tám mục của ô E1 crm (sha f58f27802); kiểm ngoài sau khi crm cài mốc ghi ở Notes |
