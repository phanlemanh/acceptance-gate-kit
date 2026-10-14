# Hình tại điểm quyết định — bang-ngoai-n-co-can-cu (Cổng Phạm vi)

| Điểm | Đếm | Hình |
|---|---|---|
| d-1 căn cứ đi trọn đường (sổ S1) | 8 chặng nối tiếp → vượt N5 | `duong-di-can-cu` |
| d-3 + d-9 ba nhóm hàng, bỏ ba nút, màn hẹp (sổ S1) | 3 nhánh rẽ theo đề xuất → vượt N5 | `bang-mau` |
| d-2 nhãn Ngoài-n theo vị trí | 1 bước — dưới ngưỡng | — |
| d-4 đọc-cũ + cờ vàng | 2 trạng thái, không nối tiếp — dưới ngưỡng | — |
| d-5 Hỏi-1 bỏ cột Loại | 2 lối, câu hỏi — dưới ngưỡng | — |
| d-6, d-7 bỏ design-pass / đặc-tả-UX | không rẽ — dưới ngưỡng | — |
| d-8 đo màn hẹp bằng Playwright | 1 bước — dưới ngưỡng | — |

## Đề bài `duong-di-can-cu`
- Loại: data flow ngang, 8 nút: Khuôn mục (OOC-ITEM-TEMPLATE) → Tác tử phân loại (viết can_cu) → Sổ finding (run-log) → Tác tử tổng hợp (review-findings.md) → Mang sang (carry-plan) → Chèn mục mang sang → Bộ đọc (lib/out-of-contract.cjs) → Thẻ Cổng 2 (bảng).
- Nhánh: từ «Sổ finding» một mũi tên vòng xuống «Mang sang» nhãn «lượt sau».
- Dưới mỗi nút một nhãn AC đo nó: AC-1 (khuôn, bộ đọc), AC-2 (phân loại, sổ, tổng hợp, mang sang, chèn), AC-3…6 (thẻ).
- Chú thích chữ: «thiếu một chặng = căn cứ rơi im ở lượt 2».

## Đề bài `bang-mau`
- Loại: mockup bảng (wireframe), dữ liệu thật rút gọn từ crm kanban-viec: cột Mục · Người dùng gặp gì · Máy đề xuất · Căn cứ.
- Hàng tiêu đề nhóm 1 «Cần anh quyết»: Ngoài-2 (mở việc mới — «Lộ dữ liệu, mức nặng…»).
- Hàng tiêu đề nhóm 2 «Máy khuyên — chỉ đổi khi anh nghĩ khác»: Ngoài-1 (ghi hạn chế), Ngoài-4 (chấp nhận), Ngoài-7 (ghi hạn chế — «Tải lại là có. Không mất dữ liệu»).
- Dưới bảng một dòng: «Mỗi mục: ghi Known limits · mở hợp đồng mới · nâng phạm vi sửa ngay — đổi bằng câu ký».
- Ô nhỏ bên phải: cùng hàng Ngoài-7 ở màn hẹp, xếp thành thẻ bốn dòng có nhãn cột.
