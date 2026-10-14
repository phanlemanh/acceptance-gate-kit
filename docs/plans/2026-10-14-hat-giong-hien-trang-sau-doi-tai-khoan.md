# Hạt giống — người thấy được hiện trạng sau khi đổi tài khoản (hay mất phiên)

**Ngày:** 2026-10-14 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** nhiều khả năng CỘNG, cần owner duyệt đích danh (ADR 0018).
Gốc: `crm/_acceptance/tin-hieu-tu-ve-kho/` — tệp `BAN-GIAO.md` viết tay lúc đổi tài khoản 14/10; hai vòng cùng đợt
ghi «bước kế» theo hai hình dạng khác (`crm/_acceptance/moi-tin-hieu-cho-quan-tri/decisions.jsonl` dòng `revisit`
cuối · bộ nhớ crm `tb1-ban-giao-s4.md` của `crm/_acceptance/hop-thong-bao-tren-web/`).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.
Owner gọi tên hạt giống này ngày 14/10, trong phiên điều phối MacBook Pro.

## Chuyện đã xảy ra (14/10)

Máy MacBook Pro hết hạn mức, chủ kho đổi sang tài khoản khác giữa ngày. Lúc đó ba vòng crm đang chạy: hai vòng đã ký
chờ gộp, một vòng chờ ký. Phiên điều phối đã dừng ba vòng ở điểm an toàn và ghi bàn giao trước khi đổi, nên KHÔNG
mất việc nào. Dù vậy:

1. **Người mất bản đồ.** Thanh bên của app chỉ hiện phiên của tài khoản đang dùng, nên mọi phiên thợ biến mất. Nguyên
   văn chủ kho: «Không biết việc nào đã xong, việc nào đang dở, việc nào sẽ tiếp tục… cảm giác đứt mạch toàn bộ với
   tài khoản cũ». Ba lượt hỏi «đây có phải lỗi», «các phiên trước thế nào, lộ trình ra sao», «tôi đứt mạch» là ba
   lượt gọi người NGOÀI thiết kế, cùng một vòng nửa giờ.
2. **Bước kế nằm ở ba hình dạng.** Một vòng có tệp `BAN-GIAO.md` viết tay, một vòng có dòng `revisit` trong
   `decisions.jsonl`, một vòng chỉ có ghi nhớ trong bộ nhớ máy. Không bộ đọc nào gom được ba thứ đó, nên phiên điều
   phối mới phải đọc tay từng chỗ.
3. **Việc nặng đang chạy chết theo phiên.** Lượt `git push` của một vòng dừng khi phiên cũ đóng, và khoá máy vẫn hiện
   «đang giữ» cho một tiến trình đã chết. Màn xem đã sửa ở bản khoá máy của crm (cục bộ, ngoài kit).
4. **Phiên mới không nhắn được phiên cũ.** Điều phối phải tự làm bước máy của cả ba vòng thay vì giao lại.

Mọi việc thật vẫn nằm trên đĩa và GitHub (nhánh, hồ sơ, PR, lộ trình). Cái gãy là **lớp nhìn**: không có một chỗ nào
cho người đọc «xong · đang dở · kế tiếp» mà không phải qua một phiên trò chuyện.

## Hướng (chưa thiết kế)

Đúng định vị «bảng đồng hồ + dẫn đường» (CLAUDE.md, 21/09): kit **render** hiện trạng từ vật, không soạn.

- **Một trường «bước kế» máy đọc được trong hồ sơ** thay cho ba hình dạng tự do. Trường ghi ai giữ, bước kế, chờ ai,
  và ghi ở mọi điểm dừng. Viết và đọc cùng một khuôn có marker, đúng luật seam LLM-viết → máy-đọc.
- **Một bản đồ hiện trạng gom mọi hồ sơ đang mở trên các kho máy này đang làm**, ba cột Đã xong · Đang dở · Kế tiếp,
  bằng tiếng sản phẩm. Dựng từ hồ sơ + lộ trình + PR, không từ phiên. Gần với `acceptance-status` và trang lộ trình
  đã có; có thể chỉ là một chế độ của chúng, chưa chắc phải là thứ mới.
- **Nếp tiếp quản:** phiên điều phối mới in bản đồ đó làm tin đầu tiên. Hôm nay nếp này là lời dặn trong bộ nhớ
  máy, và hiến pháp cấm dặn-bằng-lời làm nghiệm; đó là lý do hạt giống này tồn tại.

Liên quan: `docs/plans/2026-10-13-hat-giong-kenh-lien-may-dieu-phoi.md` (kênh liên máy; cùng họ «trạng thái chỉ sống
trong chuỗi tin / trong phiên»).

## Ngưỡng mở ô

≥ 1 lần nữa, sau một lần đổi tài khoản, đổi máy hay mất phiên, người phải hỏi «hiện trạng thế nào» (một lượt gọi
người ngoài thiết kế). Đếm ở dòng 2 của luật (c) trong hồ sơ mốc kế. Lần đếm đầu: 14/10, 3 lượt.
