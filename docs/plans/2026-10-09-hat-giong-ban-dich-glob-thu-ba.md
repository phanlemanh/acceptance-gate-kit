# Hạt giống — bản dịch glob thứ ba (phía đọc của S4) chưa hiểu `[[]`/`[]]`; thẻ Cổng 2 giấu mục trong hợp đồng mức medium

Gốc: `_acceptance/glob-thoat-ngoac/` (lượt chấm 1 và 2 ngày 09/10/2026, Cổng Bằng chứng ký 09/10 — Ngoài-1,
Ngoài-2, owner: mở hợp đồng mới). Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài.

## 1. Bản dịch glob thứ ba ở `acceptance-verify.js` (Ngoài-1 = Ngoài-2)

Vòng `glob-thoat-ngoac` dạy thành ngữ `[[]` → `[`, `[]]` → `]` cho hai bản chép: `pathGlobToRe` (lib) và
`globToRe` (`carry-plan.mjs`, bên VIẾT của S4 qua `s4-args.mjs`). Bản chép thứ ba —
`feature-loop/workflows/acceptance-verify.js` `globToRe` (dòng ~825), bắt buộc tồn tại vì sandbox của workflow
không nạp mô-đun — vẫn thoát ngoặc theo nghĩa đen. Bản ấy là bên ĐỌC: `pathsKhaiResDoc` (miễn ngoài-vật cho tệp
khai trong `eval.paths`) và `coverageResCu`/`duocPhu` (đếm finding ngoài vùng phủ) cho tệp NGOÀI diff. Đo 09/10:
glob `apps/app/app/(app)/[[]slug]/contacts/**` với tệp `apps/app/app/(app)/[slug]/contacts/x.tsx` — bên viết
`true`, bên đọc `false`. Hệ quả: ≥2 finding trên tệp `[slug]` ngoài diff bật `coverageCluster` giả → một lượt gọi
người thừa ở Cổng Bằng chứng. Ca VV4b (`tests/scripts/s4-args-vung-vat.test.mjs`) giữ hai bản viết/đọc bằng nhau
nhưng ma trận 9 ô không có ô ngoặc nào, nên xanh trên chỗ trôi.

Hướng: chèn đúng dòng thành ngữ vào bản thứ ba; thêm ô `[[]`/`[]]` vào ma trận VV4b (hoặc GT1c so cả ba bản).

Ngưỡng mở ô: ≥1 lượt S4 ở kho tiêu thụ bật `coverageCluster` mà các finding rơi vào tệp khớp một `paths` thoát
ngoặc.

## 2. Thẻ Cổng 2 không hiện mục TRONG hợp đồng mức medium

Lượt chấm 2 của vòng này có một finding trong hợp đồng (AC-4, medium, thước): `review-findings.md` có mục
«## Trong hợp đồng», verdict vẫn PASS (chỉ mức high lật verdict — `triageHighInContract`). Thẻ Cổng Bằng chứng
(`scripts/gate-card.js`) không in mục ấy và dòng lệnh ký không có ô cho nó — người ký chỉ biết vì phiên nói ra
trong lời mời. Cùng lớp với «FAIL-OPEN làn V» đã đo 20/09: so số mục thẻ với số mục báo cáo trước khi tin.

Hướng: thẻ đọc mục «Trong hợp đồng» chưa bị bác của `review-findings.md`, in thành mục quyết có tên (mã
`Trong-<n>`) với lối ghi Known limits / trả lại; ca đỏ: báo cáo có một mục trong hợp đồng medium mà thẻ không in.

Ngưỡng mở ô: ≥1 lần ký ở kho tiêu thụ trên báo cáo PASS có mục trong hợp đồng chưa bị bác mà lời mời không nêu.
