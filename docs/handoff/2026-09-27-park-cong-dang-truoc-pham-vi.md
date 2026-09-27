# Park 27/09 — Cổng Đáng đứng trước Cổng Phạm vi + lối ký `đáng: <lối>`

**Trạng thái:** vật XONG, bốn suite xanh, CHƯA mở vòng, CHƯA gộp. Sống ở nhánh
`claude/dazzling-sanderson-7637e4` (hai commit `4bc3dd41` · `4b092e08` trên `main 729f5b84`).

**Gốc:** `crm/_acceptance/khep-ky-okr/` — ca thật 27/09: ô cơ hội chưa quyết
(`stage: discovery`, `decision:` trống, ngưỡng `[đề xuất]`) cạnh `contract.md` nháp do vòng
làm sinh cùng lượt → bộ quét xếp «chờ Cổng Phạm vi», bỏ qua Cổng Đáng; không có lối ký Cổng
Đáng có tên nên chủ kho ký bằng lời + máy sửa tay frontmatter (crm `0a76458b`).

## Vì sao park, không gom vào vòng đang chạy

Luật chiều rộng (b): giữa hai mốc được kho nhận, TỐI ĐA MỘT vòng meta. Cửa sổ sau 2.18.4
(crm đã cài) đang có `cham-khong-tu-dot-luot` ở Cổng Bằng chứng (máy kia, chưa push). Gom
vật này vào đó = sửa hợp đồng đã ký Cổng Phạm vi + duyệt lại + ≥1 lượt chấm nữa — đốt đúng
chữ ký đang chờ. Mở vòng riêng = vòng meta thứ hai trong cửa sổ. Còn crm không bị chặn cứng:
đường ký tay vẫn chạy (một lần sửa frontmatter).

**Mở khi:** mốc kế (2.18.5) đã cắt và một kho cài nó, hoặc owner gọi tên.

## Gói mở vòng (T3 — chạm `lib/`, `hooks/`)

1. Vật đã có trên nhánh: vị từ `oCoHoiTruocPhamVi` (lib) · nhánh `draft` của bộ quét + bản đồ ·
   bộ ghi `scripts/ky-cong-dang.mjs` · câu gộp `đáng:` ở `commands/approve.md` + bàn giao ở
   `start.md` + chốt Gate 1 trong feature-loop · thước `tests/scripts/cong-dang-truoc-pham-vi.test.mjs`
   (CD1–CD6, 8 đột biến) · VC3 đổi hàng.
2. Còn phải làm trong vòng: **hook cờ vàng** (không chặn) khi `draft → approved` mà ô cơ hội
   bên cạnh chưa quyết — biến răng từ lời sang vật (CỘNG, phê ở Cổng Phạm vi) · **chốt đầu S1**
   của feature-loop: ô chưa quyết → hỏi lối Đáng TRƯỚC khi viết hợp đồng (đúng tầng; hiện chỉ
   chốt ở Gate 1 nên máy vẫn đốt token S1 cho việc chưa ai quyết).
3. Giới hạn khai, không dựng: bộ ghi là script mở (khoá model-invocation ở lệnh duyệt; xuất xứ
   thật = tác giả commit `Cổng Đáng — <lối> — <tên>`) · ký làm/lặp nhận trọn ngưỡng đề xuất,
   muốn sửa một dòng thì sửa ô trước rồi ký · làn THẺ Cổng Đáng (cây `528caaa8`) KHÔNG lấy lại;
   ngưỡng mở lại: ≥1 lần owner ký Đáng sai lối vì đọc chữ thay vì nhìn hình.
4. Lỗi tiềm ẩn thấy dọc đường, chưa bên gọi nào dính: `lib/md-section.cjs` khớp tiêu đề bằng
   `\b` → tiêu đề kết bằng chữ có dấu («…sinh tử») trả section rỗng.

Vi phân cũ↔mới đo 27/09 trên 40 cây tiêu thụ trên máy: bộ quét + bản đồ đổi ô đúng 1 hồ sơ
(`crm khep-ky-okr`). Đo lại trước khi gộp — kho nhận thêm hồ sơ mới trong lúc park.
