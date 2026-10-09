# Soát đồng bộ — workflow ↔ lộ trình ↔ lệnh người gõ (10/10)

Chủ kho yêu cầu soát. Một phần chạy bằng máy (lệnh có thật, cờ CLI, khuôn hàng, từ cần tránh); một phần do
tác tử context sạch đọc mã thật (`scripts/lo-trinh.mjs`, S0 của feature-loop, cắt lượt, CONTEXT.md, ADR
0002, hợp đồng DP1). 11 chỗ lệch: 4 cao, 5 vừa, 2 thấp. Cả 11 đã sửa vào spec workflow.

| Mã | Mức | Lệch | Sửa ở |
|---|---|---|---|
| L1 | cao | Bộ phát lịch dùng hàm lộ trình cho trạng thái hàng — hàm đó chỉ đọc cây chính, không thấy hồ sơ đang ở worktree dãy | §14: tách trạng thái KẾ HOẠCH (nhánh chính) và THI CÔNG (worktree, giữ 05/10 §4.6) |
| L2 | cao | «Duyệt» thẻ khởi tạo bị coi là chữ ký Cổng Đáng cho N ô (đụng ADR 0002) | §14 chỗ nối 2: chữ quyết gõ đích danh (`build K2 K3`), máy ghi hộ theo tiền lệ X1; răng khoá là CỘNG riêng, chưa làm |
| L3 | cao | «Mọi ô đều có neo» — bộ ghi ô không sinh dòng `Gốc:`; luật neo là của kho kit | §14 chỗ nối 2: chỉ kho kit, phiên chép `Gốc:` khi `vi_sao` mở bằng nó |
| L4 | cao | Đường gói đợt mặc định `docs/plan/dot-` sẽ làm DP1 AC-7 đỏ | §4.1: khoá `dieu_phoi.goi_dot` của kho hoặc `--goi` |
| L5 | vừa | `--moc` không có trong `lo-trinh.mjs`; mốc thuộc từng tệp; DP6 không ở mốc 25/10 | §14 chỗ nối 1: `<tệp>@<ngày>`, đọc khối dữ liệu xuất sẵn; sửa câu mốc |
| L6 | vừa | Gói nạp bộ phân tích lộ trình bằng gì (DP1 AC-6 cấm import ra ngoài) | §14 chỗ nối 1: `resolve-plugin.mjs`, lùi về hàng tay |
| L7 | vừa | Tên nhóm trạng thái sai; trang lộ trình có thể mời mở trùng hàng dãy đang giữ | §14: dùng `nhom_trang_thai`; giới hạn khai kèm ngưỡng |
| L8 | vừa | «Đợt» trùng «đợt phạm vi» (khoá `dot`) | §15 thuật ngữ; `nguon_hang` không đọc `dot` |
| L9 | vừa | «Máy mở PR sửa tệp lộ trình» trái luật «kit không ghi tệp ý định» | §14 chỗ nối 4: qua skill cắt lượt, bản phạm vi `lan-va`, phiên viết |
| L10 | thấp | «làn Deal», «làn veto» | «dãy Deal», «làn V» |
| L11 | thấp | Chữ mới chưa vào glossary; câu «Cho P4 nghỉ» không có bước; «ba hàng» | §15; §4.6 đổi kế hoạch; §1 bốn hàng |

Đã khớp: mẫu `<tệp>:<mã>` với S0-MA-HANG-RE; lời ghi danh gọi feature-loop bằng slug (S0 nhận cả hai);
§13 khớp §4/§9; câu lệnh cổng do người gõ, hợp ADR 0002; ranh giới DP1 khớp §9; thứ tự `dung_tren` của các
hàng DP trên lộ trình kit khớp §9.
