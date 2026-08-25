---
slug: ra-co-ten-lam-va-trao
at: 2026-08-23T12:18:35Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

# Phản biện context sạch — ra-co-ten-lam-va-trao

Một phiên tươi, chỉ đọc 6 file artifact (design · contract · evals · sổ quyết định ·
ô cơ hội · bài học xuyên hồ sơ). One-pass: sửa artifact rồi KHÔNG chạy lại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design + contract | Không có chuyển ra khỏi `machine-cleared` khi người DÙNG cửa veto — hồ sơ máy-thông giữ cửa veto mở nhưng không đặc tả nào nói status thành gì khi owner ký hay veto trong cửa đó; quan hệ `machine-cleared` × `human_signoff` khác rỗng không được khai | Owner chạy `/signoff` trên hồ sơ máy-thông trong cửa veto. Lệnh ghi chữ ký nhưng không nghi thức nào đổi status, nên bộ quét vẫn xếp «máy đã thông» và thẻ vẫn in «không có chữ ký người» cho hồ sơ ĐÃ có chữ ký; lưới rơi khỏi nhánh chữ-ký-rỗng nên răng lời khai không chạy. 14 eval vẫn xanh vì chỉ đo mutant chiều ngược | AC mới: `machine-cleared` + chữ ký khác rỗng là trạng thái CẤM (hook + lưới ghim thông điệp, đối chứng dương cùng fixture); và khai chuyển `machine-cleared → signed-off` có chủ đứng tên | fixed: thêm **AC-15** bốn chân (a cấm · b `/signoff` đứng tên chuyển · c da-veto chặn · d bộ quét gọi hỏng) + **E15**; đặc tả §5 thêm hàng chuyển |
| P1 | contract + evals | Điều kiện chết (a) nói «ở BẤT KỲ bộ đọc nào» nhưng phép đo là danh sách ĐÓNG bộ đọc gõ tay; thước CE của trục B tự khai một con số file mà không AC nào chạy phép quét đó lúc verify — blacklist trên không gian mở | Một bộ đọc thứ N rẽ nhánh trên `signed-off` mà không ai nhớ tới im lặng bỏ qua hồ sơ máy-thông, hoặc gộp nó cùng chữ với hồ sơ đã ký. Mọi eval xanh vì chỉ chạm file được kể tên; hỏng lộ ở hồ sơ thật đầu tiên | AC quét toàn cây lúc verify: tập file chứa `signed-off` == hợp của tập có ca và tập khai gạch có lý do; file lạ → đỏ nêu tên | fixed: **AC-13(iv)** + khối máy-đọc `BO-DOC-KHAI-GACH` trong Notes (5 dòng khai gạch có lý do); E13 thêm chiều đỏ tiêm file mới |
| P1 | contract + evals | Fixture xanh-sạch khai là code-sinh từ khuôn báo cáo, trong khi bài học đã ghi khuôn bên VIẾT không chứa hai mục «Known limits» và «Ngoài hợp đồng» mà bên ĐỌC đòi — chúng chỉ sống trong văn xuôi skill `[d-20260823T072105Z-12331]` | Người thi công sinh báo cáo từ khuôn, đối chứng dương ĐỎ vì thiếu hai mục; lối rẻ nhất là gõ thêm vào fixture cho vừa bên đọc — đúng lớp «fixture viết tay đúng khuôn bên ĐỌC». Khi đó E2 xanh trên hình dạng báo cáo mà không code path nào sinh ra | AC round-trip cho seam báo cáo: sáu điều kiện rút từ MỘT chỗ có marker trong khuôn bên viết; fixture sinh từ đúng chỗ đó; gỡ một mục → lưới đỏ nêu tên mục | fixed: **AC-1** mở rộng (khối `EVIDENCE-XANH-SACH-BLOCK`, round-trip ba đầu khuôn ↔ mjs ↔ bash); AC-2 và E2 đổi nguồn fixture |
| P1 | contract | Khối `KHAC-BIET-DOC-CU` không có ô khai khác biệt chỉ-thêm-cờ, trong khi AC-13 assert «flags mới chỉ ở slug trong khối»; hai luật đọc mới áp lên MỌI hồ sơ thật | Một hồ sơ thật có timebox quá hạn nhận cờ, AC-13 đỏ; không có cú pháp khai nên lối thoát là bịa dòng hoặc hạ assert — thu thước cho vừa vật | Chạy bộ đọc mới trên cây thật, liệt kê đầy đủ hồ sơ bị chạm; assert theo cả cờ | fixed **theo hướng khác và mạnh hơn**: đo QUAN HỆ thay vì danh sách — **AC-13(iii)** đẳng thức hai chiều `cờ ⇔ điều kiện`, đúng ở mọi ngày chạy. Danh sách cờ là thứ SẼ ĐỔI theo ngày (lớp «thước ghim vào thứ sẽ đổi»), khai nó vào khối là hẹn giờ đỏ. Kiểm cây thật 23/08: 0 hồ sơ `archived`, 5 hồ sơ có timebox ngày thật, cả 5 còn hạn |
| P2 | contract | Điều kiện CHẾT (b) của ô cơ hội — lối không-đo-được bị dùng cho vòng CÓ người dùng cuối — không có dòng nào trong mục Đường đo | Sau ship, số hồ sơ khai «không đo được» tăng dần, không số nào đếm chúng nên tới phiên nghiệm thu của chính ô này không ai trả lời được điều kiện chết (b) đã kích hoạt chưa | Dòng Đường đo: đếm hồ sơ ở `da-giao-khong-do` mà hợp đồng chạm mặt người dùng, đích 0 | fixed: thêm dòng Đường đo thứ tư, bảo đảm bởi AC-11 |

## Cross-check của phiên phản biện

- AC không có eval: không. Eval không map AC: không (1-1, E1–E15 ↔ AC-1–AC-15).
- Trục Coverage không có AC phủ: trục B trước sửa hở — nay đóng bằng AC-13(iv).
- Cross-layer: AC-6, AC-8, AC-12 đo bằng bộ đọc cắt phạm vi trên thân văn bản — đã bỏ có tên ở Out of scope (nếp chip C), không lật.
- Ngưỡng không có đường đo: điều kiện chết (b) — đã đóng.
- Lớp đo-lường: ma trận toàn phần ở AC-1, AC-9 (8 ô 8 assert), AC-13; ca âm đều có đối chứng dương + ghim thông điệp; đường dẫn suy từ vị trí script; seam khuôn báo cáo — đã đóng.
