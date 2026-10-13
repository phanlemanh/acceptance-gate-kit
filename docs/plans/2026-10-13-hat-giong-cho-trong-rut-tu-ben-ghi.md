# Hạt giống: ca đo «chỗ trống của khuôn» rút từ khối bên ghi, không chép tay chuỗi

Ngày 13/10/2026 · lớp «thước phải gắn vào vật» (CLAUDE.md, hình dạng 2 — fixture viết tay đúng khuôn bên
đọc) · nguồn: Cổng Bằng chứng lượt 2 của `_acceptance/vong-mo-thang-bang-feature-loop/` (Ngoài-2, ghi Known
limits; Điều phối M5 đề nghị gieo thêm hạt giống cùng lớp).

## Lỗ

Bộ đọc dòng sổ «giữ cỡ» (`scripts/co-hop-dong.cjs`, `dongGiu` + `CHO_TRONG_RE`) bỏ lý do còn là chỗ trống
của khuôn. Ca đo AC-3 (`tests/scripts/co-hop-dong.test.mjs`, hàng «chỗ trống» và «bị rút») CHÉP TAY hai chuỗi
khuôn (`giữ cỡ — <lý do>`, `<vì sao kết quả không tách được mà giữ nghĩa, 1 câu>`) và dòng `supersedes`, thay
vì rút từ chính các khối bên ghi: `DEC-GIU-CO` (SKILL Feature Loop), lối `sửa: giữ cỡ — <lý do>` trong khối
`CO-HOP-DONG-CHAN` của `commands/approve.md`, khuôn dòng rút ở `DEC-LAT-GATE1`. AC-8 round-trip khối bên ghi
nhưng điền MỌI ô `<…>` thành chữ — đường «khuôn chưa điền» không bao giờ đi từ bên ghi sang bên đọc.

Kịch bản gãy: khối bên ghi đổi dạng ô trống (thêm chữ sau ô, lồng `<…>`) → một dòng chép nguyên khuôn chưa
điền lại mở Cổng Phạm vi cho hợp đồng từ 13 tiêu chí, trong khi ca chép tay vẫn xanh.

## Hướng nghiệm (chưa phải hợp đồng)

Ca AC-3 rút ô trống từ ba khối bên ghi bằng marker, ghép thành dòng sổ CHƯA điền rồi đưa qua bên đọc thật;
đột biến: thêm một chữ sau ô trống trong bản sao khối → ca đỏ nêu khối ấy. Cùng lớp: hàng «bị rút» dựng dòng
rút bằng khuôn `DEC-LAT-GATE1`.

## Điều kiện mở

Theo luật «ô chỉ mở khi có neo ngoài»: mở thành ô khi một hợp đồng thật từ 13 tiêu chí qua Cổng Phạm vi với
dòng giữ còn chỗ trống (đồng hồ `cat-luot.mjs --co`, nhóm `phai-tach`, đọc kèm sổ), hoặc khi một vòng sửa khối
`DEC-GIU-CO` / `CO-HOP-DONG-CHAN`.
