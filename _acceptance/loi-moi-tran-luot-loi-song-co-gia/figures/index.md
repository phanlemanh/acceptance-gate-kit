# Hình tại điểm quyết định — Cổng Phạm vi

| Điểm | Đếm | Hình |
|---|---|---|
| Sổ `d-…-1` phương án A/B/C + luồng khối «Lối ra» (điều kiện kích hoạt → ba lối → khuyến nghị) | hai nhánh rẽ (kích hoạt hay không · lặp hay không) và ba lối → vượt N5 | `luong-loi-ra.html` / `.png` — flowchart, nhãn chữ, tên AC cạnh nút |
| Sổ `d-…-2` không đọc usage-report | một lựa chọn, không nhánh → dưới ngưỡng: 1 | — |
| Sổ `d-…-3` bỏ đặc-tả-UX | một lựa chọn → dưới ngưỡng: 1 | — |
| Sổ `d-…-4` khuyến nghị tất định không so phút | hai nhánh (lặp / không lặp) — đã nằm trong hình trên | (gộp) |
| `[GIẢ ĐỊNH]` ×2 trong Coverage | mệnh đề đơn → dưới ngưỡng | — |

Đề bài hình `luong-loi-ra`: flowchart có nhánh rẽ · nút: thẻ CHƯA ký được → rẽ sớm (thước lệch/cây đổi/chết lần đầu) → điều kiện AC-1/AC-2 → không: giữ nguyên (AC-6) · có: khối «Lối ra» ba lối + dòng «Không có lối ký» (AC-3) + nhánh khuyến nghị (AC-4) · AC-5 trên lối 2.
