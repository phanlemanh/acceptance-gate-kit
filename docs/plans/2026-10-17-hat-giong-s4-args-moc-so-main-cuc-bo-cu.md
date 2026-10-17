# Hạt giống — bước chuẩn bị lượt chấm lấy mốc so từ nhánh chính CỤC BỘ đã cũ

**Ngày:** 2026-10-17 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** TRỪ (bớt phần vật soi nhầm và phút máy của làn tìm-lỗi).
Gốc: `_acceptance/du-bao-dong-bang-theo-ma-moc/` — RM6b, lượt chấm 1 ngày 16/10 trên máy còn `main` cục bộ = `cf2fe012`.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Số đo

- Dẫm 3 lần trong gói lộ trình 16/10, cùng một máy: RM6b (`_acceptance/du-bao-dong-bang-theo-ma-moc/`), RM6c
  (`_acceptance/lo-trinh-du-lieu-ngay-du-kien/`) và RM5 (`_acceptance/kho-cam-ket-co-lo-trinh/`).
- Mỗi lần, worktree mới có ref `main` cục bộ dừng ở đỉnh cũ, trong khi `origin/main` đã nhận vật của vòng khác vừa
  gộp. Mốc so tự tính rơi về trước các lần gộp đó, nên vùng vật của lượt chấm gồm cả mã của vòng khác.
- Dòng tự khai trên stderr vẫn in «nhánh chính «main» giải bằng remote» — người đọc tin mốc so đúng.
- Lối tạm cả ba lần: truyền tay `--diff-base $(git merge-base HEAD origin/main)`. Lối tạm sống bằng lời trong ghi
  nhớ phiên, không có vật nào giữ.

## Gốc

`feature-loop/scripts/s4-args.mjs`:

- dòng 303: `for (const cand of [m[1], \`origin/${m[1]}\`])` — tên remote khai («main») được thử TRƯỚC `origin/main`;
  ref cục bộ giải được là thắng, dù nó cũ bao nhiêu.
- dòng 320: `diffBase = git('merge-base', mainBranch, 'HEAD')` — merge-base với ref cục bộ cũ.
- Nhãn nguồn `remote` chỉ nói *tên* nhánh do remote khai, không nói *ref* đã dùng là ref của remote. Dòng tự xưng
  của hạ tầng đang nói một điều mà vật không làm.

## Đề xuất (chưa làm — meta đóng băng, mở ở mốc «Tinh chỉnh sau hai đợt thử» 05/11 khi owner gọi tên)

1. **Đúng tầng:** khi remote khai tên nhánh, thử `origin/<tên>` trước ref cục bộ (sau fetch đã có của bước gọi),
   và dòng tự khai in đúng ref đã dùng kèm sha.
2. **Rẻ hơn, nếu (1) đụng ca CI single-branch:** giữ thứ tự cũ nhưng in cờ vàng khi `main` cục bộ đứng sau
   `origin/main` — «mốc so lấy từ main cục bộ cũ N commit; truyền --diff-base hoặc cập nhật main».
3. Chiều đỏ đi kèm: ca dựng kho có `main` cục bộ lùi một commit so với `origin/main` → mốc so phải bằng
   merge-base với `origin/main` (hoặc cờ vàng phải hiện); đối chứng dương: `main` cục bộ khớp `origin` → im.

**Người hưởng:** máy (làn tìm-lỗi không soi vật của vòng khác, bớt mục ngoài hợp đồng giả) và owner (thẻ Cổng
Bằng chứng không mang mục của vòng đã ký).

**Kho không gặp sự cố này được gì, mất gì:** kho chỉ chạy trên một cây luôn cập nhật thì mốc so không đổi. Mất:
không có, trừ ca không có `origin/<tên>` — khi đó rơi về ref cục bộ như hôm nay.

## Ngưỡng mở thành ô

Owner gọi tên ở mốc 05/11, hoặc ≥ 1 lượt chấm REJECT vì mục của vòng khác lọt vào vùng vật.
