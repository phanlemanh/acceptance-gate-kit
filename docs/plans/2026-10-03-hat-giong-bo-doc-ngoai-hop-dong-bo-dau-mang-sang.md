# Hạt giống — bộ đọc «Ngoài hợp đồng» bỏ mục mang dấu `(r<N>)` và trộn trường của nó vào mục trước

**Ngày:** 2026-10-03 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T3 (`lib/**`).
Gốc: acceptance-gate-kit/_acceptance/loi-moi-tran-luot-loi-song-co-gia — `review-findings.md` lượt 2
(commit `205fa52b`) có 4 mục ngoài hợp đồng; thẻ Cổng Bằng chứng và `khong-can-nguoi.mjs` đọc ra 3.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Hình dạng

Bên viết (`feature-loop/workflows/acceptance-verify.js`, carry T5) in mục mang sang từ lượt trước với
tiêu đề `- **<title>** (r1)`. Bên đọc (`lib/out-of-contract.cjs` `parseFindings`) chỉ nhận tiêu đề
khớp `/^-\s+\*\*(.+?)\*\*\s*$/` — dấu ` (r1)` sau `**` làm dòng không khớp, nên mục mang sang không
mở mục mới; các dòng `file:` · `severity:` · `Người dùng thấy gì:` · `Đề xuất:` của nó GHI ĐÈ lên mục
liền trước. Kết quả ở ca gốc: thẻ in «Ngoài-3» mang tiêu đề của một mục nhẹ (low) nhưng chữ, tệp và
mức nặng (medium) của mục mang sang; một mục biến mất khỏi bộ đếm. Đây là bên viết và bên đọc trôi
khỏi nhau (lớp «thước gắn vào vật được giao», hình 3) — không ca nào round-trip mục carry qua bộ đọc.

Ở ca gốc không mất thông tin vì mục bị nuốt trùng với Ngoài-1. Ca nặng là khi mục bị nuốt KHÁC
mục còn lại: người ký định đoạt trên một tiêu đề không khớp nội dung.

## Ý (chưa phải cam kết)

Bộ đọc nhận đuôi `(r<N>)` sau tiêu đề (`\*\*(?:\s*\(r\d+\))?\s*$`), giữ nó thành trường `carried_from`.
Răng: round-trip rút mục carry từ CHÍNH `acceptance-verify.js` (harness tác tử giả, hai lượt) qua bộ
đọc, đếm mục = đếm dòng `- **`. Cân trên mọi kho: kho chưa từng có lượt carry nhận kết quả y hệt.

## Ngưỡng mở (đang đếm: 1)

≥1 lần nữa thẻ Cổng Bằng chứng in số mục ngoài hợp đồng khác số dòng `- **` trong
`review-findings.md` (đếm: `gate-card.js --extract` → `out_of_contract.findings.length` so với
`grep -c '^- \*\*'` mục «Ngoài hợp đồng»), HOẶC chủ kho gọi tên. Chạm `lib/**` nên đi cùng một mốc
phát hành có kho chờ nhận.

**Đếm thêm (06/10):** lần 2 — `gia-lan-ghim-lai` lượt 3 (commit `07e00937` chuẩn hoá tay tiêu đề để
thẻ đọc đủ 9 mục); lần 3 — `eval-thay-boi-co-chung` lượt 2: thẻ đọc 6/7 mục, mục 6 mang chữ và tệp
của mục 7 (mục mang sang từ lượt 1), chuẩn hoá tay cùng cách. Ngưỡng «≥1 lần nữa» ĐÃ CHẠM; chưa mở ô
vì luật đóng băng meta-work — mở ở mốc phát hành kế, hoặc khi chủ kho gọi tên.
