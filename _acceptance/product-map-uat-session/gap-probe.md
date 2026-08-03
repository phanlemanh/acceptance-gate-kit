---
slug: product-map-uat-session
at: 2026-08-03T09:20:00Z
verdict: findings
p0: 0
p1: 3
p2: 1
---

# Gap-probe — product-map-uat-session

Critic fresh (1 subagent, 5 input: design + contract + evals + sổ quyết định +
claims xuyên feature). One-pass; mọi finding đã định đoạt và sửa thẳng vào
artifact TRƯỚC Gate 1.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design + contract + evals | Bảng bucket chỉ định nghĩa giá trị enum HỢP LỆ — field điều hướng mang giá trị lạc (typo `verdict: done`, `decision: Build` viết hoa) không rơi vào ô nào | Slug BIẾN MẤT im lặng khỏi map và start-scan; E1/E10 vẫn xanh vì fixture không có giá trị lạc | Luật enum-lạc → Hồ sơ hỏng/broken[] kèm tên field + giá trị; mutation TỪNG field điều hướng | fixed: luật enum-lạc vào design; AC-1/AC-10 mở rộng; E1/E10 thêm mutation theo lớp |
| P1 | evals | Round-trip writer→reader chỉ bắt buộc cho khuôn UAT mới; fixture opportunity/contract được phép tự dựng theo khuôn bên đọc (hình dạng 3 của "thước gắn vào vật được giao") | Template thật lệch khỏi thứ frontmatterField đọc → suite xanh, map sai toàn phần trên repo thật | Fixture rút từ khuôn canonical có marker (OPP-FRONTMATTER-TEMPLATE; contract-template đặt marker vòng này) | fixed: E1/E10 expected buộc rút-từ-khuôn; design §4 ghi luật |
| P1 | design + contract | Thông điệp `--check` ghim đường dẫn `scripts/product-map.mjs` — chỉ đúng self-host; consumer copy lệnh → exit 127, lưới một-lệnh-là-hết chết ở đúng đối tượng tiêu thụ | CI consumer đỏ vì drift, lệnh trong thông điệp không chạy được; hoặc bước regen viết dạng self-host-only mà E6 vẫn xanh | Path trong message suy từ vị trí script; E6 assert 4 thân lệnh dùng ${CLAUDE_PLUGIN_ROOT} | fixed: AC-3 đổi thành khuôn path-động; E3/E6 cập nhật assert |
| P2 | evals | Quy tắc `since` của ô chờ-Cổng-Giá-trị nằm trong design nhưng không AC/eval nào đo | Implementer lấy nhầm mtime uat-session.md → thẻ /start xếp sai thứ tự chờ; E10 vẫn xanh | Thêm mệnh đề since hai nhánh vào AC-10 + E10 | fixed: AC-10 + E10 đã có mệnh đề since |

## Claims input

`claims_input:` có nội dung (4.7KB) — được truyền làm input thứ 5; các finding
trên đứng trên bất biến CLAUDE.md (đối chứng dương, thước-gắn-vật) và spec,
không finding nào lật quyết định đã ghi trong sổ quyết định.
