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

### Bổ sung cùng ngày: tên phiên và nhóm thanh bên khác nhau giữa các máy

Owner hỏi ngày 14/10: mỗi máy đặt tên và xếp thanh bên cho phiên điều phối và phiên thợ một kiểu. Hiện trạng đo
được:
- Gói `dieu-phoi` đã có một nửa quy ước, nhưng chỉ là lời dặn trong `dieu-phoi/README.md` bước 6: nhóm «Đợt <tên>»
  và ghim phiên giám sát. Không có quy ước tên phiên, và không lệnh nào sinh tên.
- MacBook Pro không chạy gói `dieu-phoi` (điều phối nhẹ bằng tin nhắn + khoá máy). Nhóm ở đây là «Điều phối MacBook
  Pro», còn tên phiên thợ là tiêu đề chip tự do («Mở vòng TH6 …», «Thợ TH · crm»).
- Mac Studio dùng «r2 · Giám sát»; dòng đầu tin ở #375 đã có khuôn `[máy · phiên → máy · phiên]`, nhưng khuôn ấy
  không nối với tên phiên trên thanh bên.

Hướng: tên phiên là **một hình chiếu máy sinh** từ cùng nguồn với bản đồ hiện trạng (mã hàng + tên ngắn của hàng
lộ trình + kho), do lệnh mở chip in ra để phiên đặt, chứ không phải một quy ước nữa bằng lời. Nhà đúng là gói
`dieu-phoi` (đã giữ nhóm thanh bên và lời ghi danh chip), không phải lõi feature-loop. Trạng thái (chờ ký, đang
chấm…) KHÔNG nhét vào tên, vì tên đặt một lần còn trạng thái đổi liên tục. Trạng thái thuộc về bản đồ ở trên.
Hôm nay MacBook Pro tự theo khuôn «<mã> · <tên ngắn> (<kho>)» bằng tay, như một phép thử rẻ.

### Bổ sung cùng ngày: mốc là chiến dịch, thanh bên là mỏ neo (ý owner 14/10)

Owner nêu: lộ trình và mốc là kế hoạch tổng; lúc thực hiện, thanh bên là **mỏ neo của một chiến dịch** đi tới một
mốc; kho có nhiều lộ trình (crm có ba) thì chia nhóm theo lộ trình × mốc.

Đo ngày 14/10 trên `onehub` (bản ngày đó): `lo-trinh-okr.json` có 19 mốc, 124 hàng, 76 hàng không thuộc mốc nào;
`lo-trinh-kho-tai-lieu.json` có 6 mốc, 7/12 hàng ngoài mốc; `lo-trinh-viec-du-an.json` có 0 mốc, 14 hàng. **Mọi vòng
crm MacBook Pro và M5 đang chạy hôm đó (TB1, TH1, TH4, TH6, LT1c; DA2, DA3) đều không thuộc mốc nào.** Chúng chỉ có
nhãn `dot` (đợt cắt lượt), là nhóm theo NGUỒN phạm vi, không theo KẾT QUẢ hay ngày. Chỉ Mac Studio (đợt r2, mốc
«R2 lên production» 31/10, 21 hàng) đang chạy đúng mô hình owner nêu.

Mô hình rút ra:
- **Một vòng = một hàng = đúng một mốc.** Mốc là chiến dịch: một kết quả và một ngày. Hàng đang mở vòng mà không
  thuộc mốc nào là việc không có «vì sao bây giờ / tới khi nào». Lộ trình nên cắm cờ vàng cho nó; đây là răng
  máy giữ, đọc được từ chính tệp lộ trình.
- **Nhóm thanh bên = «<lộ trình> · <mốc>»**, sinh từ tệp lộ trình. Kho một lộ trình thì rơi về «<mốc>» (cân trên
  mọi kho, luật 26/09). Mốc tới thì nhóm đóng. Phiên điều phối ghim, đứng trên mọi nhóm vì nó trải nhiều chiến
  dịch.
- **Mốc người làm (`ai` = phòng ban, chủ kho…)** là mốc ngoài, không có phiên máy, nên không thành nhóm.
- **Giới hạn phải khai:** thanh bên là theo máy × tài khoản, không chia sẻ. Một chiến dịch trải nhiều máy thì mỗi máy
  chỉ thấy lát của mình, và đổi tài khoản thì mất cả. Vì vậy thanh bên là MỎ NEO CHÚ Ý, không phải nguồn thật;
  nguồn thật vẫn là tệp lộ trình + hồ sơ, như các mục trên. Mặt không có thanh bên (CLI) thì lệnh chỉ in tên nhóm.

Liên quan: `docs/plans/2026-10-13-hat-giong-kenh-lien-may-dieu-phoi.md` (kênh liên máy; cùng họ «trạng thái chỉ sống
trong chuỗi tin / trong phiên»).

## Ngưỡng mở ô

≥ 1 lần nữa, sau một lần đổi tài khoản, đổi máy hay mất phiên, người phải hỏi «hiện trạng thế nào» (một lượt gọi
người ngoài thiết kế). Đếm ở dòng 2 của luật (c) trong hồ sơ mốc kế. Lần đếm đầu: 14/10, 3 lượt.
