# Bản phạm vi mẫu — kế hoạch bàn giao media-library 04/09 (bản 1, cắt theo gốc kỹ thuật)

Mẫu cho ca phán xét AC-10 của hồ sơ `vong-la-mot-ket-qua`. Mã H1–H12 lấy từ kế hoạch bàn giao
media-library `docs/plans/2026-09-04-ke-hoach-ban-giao.md` (bản 2 gom chúng lại thành năm vòng theo kết
quả); mô tả viết gọn lại, giữ đúng gốc kỹ thuật như bản 1 từng cắt — mỗi mã từng thành một hồ sơ, và
chủ kho chỉ ra «không hồ sơ nào tự giao được một cửa».

dot: media-library-ban-giao-0409
dang: chuoi
nguon: media-library docs/plans/2026-09-04-ke-hoach-ban-giao.md (bản 1 → bản 2 cùng ngày)

- `D1` — Dọn sổ: gạch Known limits đã đóng ở hồ sơ gốc, sửa câu «nhánh chết», xoá tệp bằng chứng sót
- `H1` — Môi trường chạy: Dockerfile, deploy API và worker ở môi trường mới
- `H2` — Hàng đợi theo tenant có lease, worker claim job từ máy khác máy dev
- `H3` — Sàn vận hành: health thật, theo dõi lỗi, rate-limit, xác minh migration, ba runbook
- `H4` — Quản trị chìa: tên chìa duy nhất, route cấp/thu hồi/xoay chìa, phát chìa theo người trên console
- `H5` — Lô ghi trọn gói: RPC giao dịch, đếm món còn tồn tại, chỉ mục batch_id, PATCH theo lô
- `H6` — MCP đợt 1: nối 9 handler có ruột, ẩn 7 stub khỏi danh sách công cụ
- `H7` — Skill media-editor v1: tìm → chọn cảnh → EDL → render
- `H8` — Sàn trước bàn duyệt: trùng gần phash, tự thu hồi có lý do, công tắc duyệt theo edit_rate
- `H9` — Console buồng lái: sáu lỗi duyệt tại chỗ, màn tìm và xem chi tiết, đăng ký nguồn
- `H10` — Nạp thật 12 video theo ramp 1 → 3 → 12 trên cloud dev
- `H11` — Di cư một lần sang OneHub: map tier và nhãn, điền external_refs, lịch flip
- `H12` — Cây thực thể sạch: chỉ mục duy nhất, gộp bản trùng, xoá thực thể, resolve alias
