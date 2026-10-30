# Hạt giống — mục tiêu đợt ghi qua bộ ghi có khoá, không sửa tay danh sách việc

**Ngày:** 2026-10-28 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Quyết:** chủ kho chọn «mở hợp đồng mới» cho
Ngoài-2 ở Cổng Bằng chứng của hồ sơ `_acceptance/khung-dot-dinh-vi/` (sổ quyết định, dòng `stage: gate2` mang
`decision: "Ngoài-2: mở hợp đồng mới"`).
Gốc: `acceptance-gate-kit/_acceptance/khung-dot-dinh-vi/` — mục rà soát Ngoài-2 của lượt chấm S4 #1, mang sang lượt 2.

**Chuyện gì xảy ra.** Vòng `khung-dot-dinh-vi` thêm khoá tuỳ chọn `muc_tieu` vào `hang-viec.json` của đợt. Muốn có
khoá này, `dieu-phoi/commands/mo-dot.md` dặn phiên mở đợt tự thêm một câu mục tiêu vào tệp. Nhưng `hang-viec.json`
vốn chỉ có MỘT bên ghi, đi qua khoá của gói điều phối. Sửa tay thì lách cả khoá lẫn sổ sự kiện. Có phiên khác ghi
cùng lúc thì hai bên đè nhau, và không để lại dấu vết.

**Ai đau, lúc nào.** Phiên giám sát lúc mở đợt, nếu đúng lúc ấy bộ phát lịch hoặc một phiên thợ cũng ghi danh sách
việc. Ca này hiếm. Gỡ được bằng cách khai lại mục tiêu. Khung chỉ hiện cờ vàng «chưa khai mục tiêu đợt», nên không
mất việc nào.

**Hướng sửa.** Thêm một đường ghi `muc_tieu` qua CLI của gói (`dieu-phoi.mjs muc-tieu --cau -`, câu đi trong heredoc
có nháy như `hoi`). Đường này đi qua cùng khoá và cùng bộ kiểm hình dạng (`kiemHangViec`), ghi một dòng sự kiện vào
sổ đợt. `mo-dot.md` gọi lệnh ấy thay cho câu dặn sửa tay. Cần một ca hai chiều: hai lần ghi tranh nhau thì không mất
lần nào. Đối chứng là một bản sao ghi thẳng tệp, phải đỏ đúng thông điệp.

**Mở thành ô khi:** một đợt thật mất mục tiêu hoặc mất hàng vì ghi tranh nhau, hoặc chủ kho gọi tên.
