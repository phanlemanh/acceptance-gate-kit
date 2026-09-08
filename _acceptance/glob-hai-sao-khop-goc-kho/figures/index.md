# Điểm quyết định — kê và đếm ngưỡng N5

Máy kê từ artifact cuối S1 (sổ quyết định chờ seal · chỗ design lệch đề bài
gốc · dòng `[GIẢ ĐỊNH]` trong Coverage · finding gap-probe xử lý `human-gate1`).
Không kê AC/GWT từng dòng — AC là bằng chứng của quyết định, không phải quyết định.

Ngưỡng N5: từ **ba bước nối tiếp** hoặc từ **hai nhánh rẽ** → cần hình.

| Điểm | Đếm | Hình |
|---|---|---|
| Đ1 · CỘNG ngữ nghĩa `**/` thay vì chuyển sang minimatch đầy đủ (d-20260907T203915Z-24167) | 2 nhánh rẽ, mỗi nhánh kéo tới hệ quả cho lời khai đang sống ở consumer | **H1** |
| Đ2 · Răng vào suite vĩnh viễn, không rang.sh riêng (d-20260907T203915Z-12398) | dưới ngưỡng: 2 nhánh nhưng có tiền lệ VC01–VC12 trong cùng file, không hệ quả mới | — |
| Đ3 · Không đổi thông điệp VIOLATION để gợi glob (d-20260907T203915Z-30657) | dưới ngưỡng: 1 nhánh hoãn có điều kiện revisit | — |
| Đ4 · Coverage: 0 dòng `[GIẢ ĐỊNH]` | không có điểm nào | — |
| Đ5 · gap-probe: 4 finding (1 P1 · 3 P2), tất cả `fixed` tại artifact, 0 xử lý `human-gate1` | không có điểm nào cho người | — |

**1 điểm vượt ngưỡng → 1 hình. 2 điểm dưới ngưỡng, nêu đúng số đếm trên tin mời cổng.**

## Đề bài H1 — «Nới ngữ nghĩa glob theo lối nào, và mỗi lối chạm gì»

- Loại hình: cây quyết định hai nhánh, mỗi nhánh kéo tới hệ quả cuối, có ô
  ví dụ ba đường dẫn thật.
- Nút gốc: `Repo khai "**/*.md" — máy hiểu thế nào?`
- Nhánh A (đã chọn) **CỘNG: "**/" = không-hoặc-nhiều thư mục, "*" vẫn vượt "/"**
  → `AGENTS.md` khớp ✓ · `docs/a.md` khớp ✓ · `*.md` của consumer khác vẫn
  khớp `docs/a.md` ✓ → hệ quả: **0 lời khai đang sống đổi nghĩa**; lệch
  gitignore đúng một điểm (`*` vượt `/`) → ghi GUIDE.
- Nhánh B (bác) **minimatch đầy đủ: "*" không vượt "/"** → `AGENTS.md` khớp
  ✓ nhưng `*.md` thôi khớp `docs/a.md` ✗ → hệ quả: **lời khai "*.md" ở
  template acceptance-init + GUIDE đổi nghĩa**, file docs sâu bị coi là mã,
  stale nổ ở chiều ngược lại.
- Nhãn bằng chữ, không dùng ký hiệu toán; AC liên quan: AC-1, AC-5, AC-6, AC-9.
- Chú thích chân hình: hiện trạng trước vòng (`**/*.md` không bắt `AGENTS.md`)
  là ô đỏ nhỏ ở nút gốc.
