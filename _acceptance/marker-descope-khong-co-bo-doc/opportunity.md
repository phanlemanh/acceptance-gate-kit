---
schema_version: 1
slug: marker-descope-khong-co-bo-doc
feature: Marker descope của các nghi thức bỏ-được có bộ đọc ở lib và cặp cờ trên thẻ Cổng Phạm vi, thay vì chỉ có đầu viết trong SKILL
owner: phanlemanh@gmail.com
stage: decided
decision: park
decided_by: Mạnh
decided_at: 2026-09-18
prototype:
  base_commit:
  disposition: archive
---

## Vấn đề & ai gặp

Luật S1-D ở `feature-loop/skills/feature-loop/SKILL.md:89` tự xưng **«không có đường bỏ
im lặng»**: bỏ nghi thức design-pass PHẢI là entry `descope` mở đầu đúng chuỗi
`"bỏ design-pass — "`. Chuỗi đó **chỉ tồn tại bên VIẾT**. Không bộ đọc nào trong
`lib/ scripts/ hooks/ feature-loop/` khớp nó; chỗ duy nhất ngoài SKILL là
`tests/plugins/run-tests.sh:1601` (case P87), và P87 khẳng định *SKILL.md chứa chuỗi đó* —
đúng hình dạng 1 mà CLAUDE.md gọi tên: **đo chỉ dẫn thay vì đo đầu ra**.

Hệ quả đo được: thẻ Cổng Phạm vi **im ở cả hai chiều**. Có entry descope → không cờ `finfo`.
Xoá sạch entry → không cờ `fwarn`. Ba nghi thức anh em (`gap-probe`, `ui-observed`,
`đường-đo`) đều có đủ cặp theo đúng một khuôn trong `scripts/gate-card.js`;
`design-pass` không có vế nào.

**Người trả giá: người ký Cổng Phạm vi.** Họ duyệt UI bằng chữ mà không có dòng nào nói
«feature này chạm UI và chưa ai nhìn bản bấm được». Và **máy** — nó đọc dòng 89 rồi tin
rằng luật ấy đã có răng.

Gốc: đo 18/09/2026 trên `crm/_acceptance/truong-tu-tao-o-cai-dat` (`surfaces: [ui]`,
`status: implemented`, S1-D chưa từng chạy). Owner quyết **park** cùng ngày ở Cổng Đáng,
giữ chiều rộng cho cửa sổ 2.16 → 2.17.

## Ngưỡng chết / ngưỡng UAT

- **Số đo 18/09, 5 kho (crm · oneflow · artifact-platform · media-library · kit), 359 hồ sơ:**
  61 hợp đồng chạm mặt người nhìn. Sau khi nghi thức S1-D chốt (30/07): 3 chạy S1-D ·
  18 có entry descope · **12 đi qua Cổng Phạm vi không để lại dấu vết nào**. Luật hở **36 %**.
- **Kiểm kê họ marker:** 7 họ đang dùng thực địa, **4 họ không có bộ đọc** —
  `đặc-tả-UX` (54 lượt) · `design-pass` (42) · `coverage-scan` (29) · biến thể lẻ.
  3 họ có bộ đọc: `đường-đo` (16) · `ui-observed` (6) · `gap-probe` (5).
- **Trôi dấu thực địa:** 4/42 entry `design-pass` viết KHÔNG DẤU (`"bo design-pass — "`),
  gồm chính ca CRM khơi ra việc này. Một răng so `startsWith` chính xác sẽ **trượt ngay ca
  đầu tiên nó sinh ra để bắt**.
- **Kết quả nào là SỐNG** (đáng mở lại): một vòng chạm UI đi qua Cổng Phạm vi rồi phát hiện
  ra lỗi thẩm mỹ/UX mà một phiên S1-D đã bắt được · hoặc tỉ lệ «IM hoàn toàn» tăng trên
  cửa sổ kế · hoặc owner gọi tên.
- **Kết quả nào là CHẾT** (đóng hẳn): owner quyết khoảnh khắc visual trước Cổng Phạm vi
  không đáng một cờ — khi ấy đi lối B (hạ lời ở SKILL.md:89 và :93 cho khớp sự thật).
- **Timebox:** không có. Ngưỡng mở lại là sự kiện, không phải ngày.

## Vì sao park chứ không build

Đây là **CỘNG** (thêm răng + thêm cờ) nên ADR 0018 đòi owner phê duyệt đích danh; owner đã
đọc cả hai lối 18/09 và chọn **hoãn tới sau mốc**. Cửa sổ 2.16 → 2.17 đang mở với
vá-trong-mốc của `phep-do-o-doc-lap-thuoc-co-cua`; mở thêm một vòng cho việc này là tiêu
chiều rộng của cửa sổ (luật (b)) cho một lỗ **hại chậm, không hại ngay**: nó không làm phán
quyết sai, nó làm người ký thiếu một dòng.

**Đường rẻ được khuyến nghị khi mở lại:** một nhát vá trong hồ sơ mốc phát hành theo tiền lệ
P93 ở mốc 2.13.0 — một AC, một chân răng, không tốn một vòng meta. Đề bài và số đo nằm trọn ở
`docs/plans/2026-09-18-hat-giong-marker-descope-khong-co-bo-doc.md`, dùng được ngay.

**Cảnh báo cho ai mở lại:** lối B (hạ lời, để lớp nhìn-thấy gánh) **không thay được** lối A.
Lớp nhìn-thấy hỏi «Cổng Bằng chứng có eval nào nhìn màn hình không», không hỏi «đã ai nhìn
bản bấm được TRƯỚC khi duyệt chưa». Ca CRM chứng minh hai câu đó khác nhau:
`ui_observed: {present: true, declared: 4}` — lớp nhìn-thấy XANH, mà S1-D chưa từng chạy.
