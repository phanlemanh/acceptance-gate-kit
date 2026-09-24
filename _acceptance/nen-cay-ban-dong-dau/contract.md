---
schema_version: 1
feature: Chân suite của đường nền gọi đúng tên tệp mà suite làm bẩn — không cắt ký tự đầu của đường dẫn, và không đổ cho suite một tệp đã bẩn sẵn trước lượt chạy
slug: nen-cay-ban-dong-dau
owner: phanlemanh@gmail.com
risk_tier: T2      # feature-loop/scripts + tests/scripts — không chạm hooks/ lib/ pre-merge/recheck
surfaces: [cli]
status: signed-off       # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-24T10:08:48Z
design_doc: docs/superpowers/specs/2026-09-24-nen-cay-ban-dong-dau-design.md
---

# Acceptance Contract: nen-cay-ban-dong-dau

## Context

Chân `suite` của đường nền (`feature-loop/scripts/duong-nen.mjs`) đọc `git status --porcelain`
qua một hàm `trim()` cả đầu ra, nên dòng đầu tiên mất dấu cách mở đầu của mã trạng thái. Hệ quả
đo được: tệp đã theo dõi bị suite sửa được gọi tên cụt một ký tự (`README.md` → `EADME.md`), và
một tệp đã bẩn SẴN trước lượt chạy có thể bị đổ là suite làm bẩn. Người hưởng: người ký Cổng Phạm
vi ở mọi kho — dòng «Nền hạ tầng» phải gọi đúng tệp thì người mới gỡ được, và đỏ oan là đỏ người
học cách bỏ qua. Trace nguyên tố 2 (bằng chứng không tự dối).

Source input: prompt (owner, 2026-09-24) · quan sát thật: `_acceptance/nen-cong-cu-gan-bang-lenh-con/duong-nen.md` @ `0c4eb404` ghi `CAY BAN SAU SUITE acceptance/config.yaml` · tái hiện trên kho đồ chơi cùng ngày

## Criteria

- AC-1: Given kho fixture lành của NEN0 (cây sạch trước lượt — ca tự kiểm) mà suite SỬA hoặc XOÁ một tệp ĐÃ THEO DÕI (`README.md`), When đường nền chạy, Then chân `suite` đỏ với tập dòng cây bẩn BẰNG ĐÚNG một dòng `nen suite: CAY BAN SAU SUITE README.md`, ở cả hai biến thể sửa và xoá.
- AC-2: Given cùng fixture, `vat.txt` đã bẩn SẴN trước lượt chạy và suite sửa `README.md`, When đường nền chạy, Then tập dòng cây bẩn BẰNG ĐÚNG một dòng `nen suite: CAY BAN SAU SUITE README.md` — `vat.txt` không bị gọi tên.
- AC-3: Given cùng fixture, `vat.txt` đã bẩn sẵn và suite không ghi gì, When đường nền chạy, Then chân `suite` xanh và không có dòng cây bẩn nào.
- AC-4: Given tệp ca của đường nền, When chạy trọn sau bản vá, Then tệp thoát 0 với 0 ca FAIL, và các ca cũ NEN0 NEN1 NEN2 NEN3 NEN4 NEN4b NEN5 NEN5-IM NEN6 NEN6-IM NEN7 NEN8 NEN9 NEN-TD1…NEN-TD6 đều có dòng PASS — gồm NEN3 (tệp mới chưa theo dõi vẫn được gọi tên).
- AC-5: Given bản sao script với lời đọc trạng thái bị đặt lại `trim()` (đúng lỗi hôm nay), When chạy kịch bản của AC-1 và AC-2 trên bản sao ấy, Then cả hai ĐỎ với đúng dấu vết lỗi (`EADME.md`; `vat.txt` bị gọi tên) — sau khi bản sao CHƯA tiêm chạy cùng kịch bản XANH.

## Coverage

- Trục A — mã trạng thái porcelain của dòng: chưa theo dõi `??` | sửa chưa stage ` M` | xoá chưa stage ` D` | đã stage `M `/`A `/`R ` [thước CE: git-status(1) «Short Format» — cột X/Y; cột X trống là dấu cách mở đầu dòng].
- Trục B — tệp có bẩn sẵn trước lượt chạy không: có | không.
- Trục C — dòng có đứng ĐẦU danh sách không: đầu | không đầu (chỉ dòng đầu bị `trim()`).
- Ô Core: A-` M` và A-` D` × B-không × C-đầu (AC-1) · A-` M` × B-có, thứ tự đổi (AC-2) · A-` M` × B-có × không ghi thêm (AC-3, chiều im) · bản đột biến đặt lại lỗi (AC-5, chiều đỏ trong lượt).
- Ô đã có ca: A-`??` (NEN3).
- Ô Never: A-stage (`M `, `A `, `R `) — cột X có chữ, dòng không bắt đầu bằng dấu cách nên `trim()` không chạm.

## Out of scope

- Đường dẫn có ký tự lạ bị git đặt trong nháy (porcelain không `-z`): hành vi hôm nay giữ nguyên.
- Các lời gọi `gitTry()` khác (sha, merge-base, nhánh gốc): giá trị một dòng, `trim()` là đúng.

## Notes

- Triệu chứng thật sau vá (gap-probe F5): ở `0c4eb404` tệp `_acceptance/config.yaml` bị sửa THẬT trong lúc chân suite chạy (phiên chính ghi song song), nên sau vá dòng ấy đọc đúng tên `nen suite: CAY BAN SAU SUITE _acceptance/config.yaml` — vẫn đỏ, vì đó là thay đổi thật trong lượt; bản vá đổi TÊN, không xoá dòng.

- Lớp của lỗi: phép đo chỉ có ca tệp CHƯA theo dõi (NEN3) — đúng hình dạng mà `trim()` không chạm, nên xanh không phân biệt được «đọc đúng» với «chưa từng gặp dòng có dấu cách đầu».

### Known limits (người ký nhận, Cổng Bằng chứng 2026-09-24)

- **Ngoài-1 / Ngoài-2** — khi chính lệnh `git status` lỗi (vd `.git` hỏng giữa lượt), khối đọc trạng thái trả tập rỗng mà không in dòng cảnh báo: lỗi ở lần chụp SAU suite làm chân suite xanh như cây sạch; lỗi ở lần chụp TRƯỚC làm mọi tệp bẩn sẵn bị đổ cho suite. Có từ bản cũ, bản vá không gây ra.
