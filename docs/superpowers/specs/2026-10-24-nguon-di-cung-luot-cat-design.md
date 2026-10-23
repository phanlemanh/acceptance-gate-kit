# Nguồn đi cùng lượt cắt — thiết kế

Hồ sơ `_acceptance/nguon-di-cung-luot-cat/` · hàng NG1 của `docs/plans/lo-trinh-kit.json` · 24/10/2026.

## Vì sao

Chủ kho phát hiện 24/10: lộ trình KHÔNG mang bối cảnh nghiên cứu và thảo luận tới vòng làm việc. Chủ kho vẫn
đinh ninh mỗi hàng chạy theo đúng điều đã nghiên cứu. Chuỗi đã lần trên ca thật (crm, đợt `okr-hop-tuan-2210`,
hàng HT3; đợt `okr-vo-khu-1810`, hàng VK1 → hồ sơ `thanh-ben-khu-dung-chung`):

| Mối nối | Hôm nay | Máy giữ? |
|---|---|---|
| nghiên cứu → bản phạm vi | khoá `nguon` là chữ tự do; ca HT3 trỏ một artifact claude.ai — ngoài git, không phiên bản | không |
| bản phạm vi → hàng | `dot` · `phu` · bảng phủ của `cat-luot.mjs` | có |
| hàng → ô cơ hội | `--mo-o` chép câu giao, `vi_sao`, mốc; không ghi bản phạm vi, không ghi nguồn | không |
| ô → bước thiết kế | S1 đọc ô, câu giao, luật kho, vật đã có | có, nhưng ô không mang nguồn |

Hai mối nối đứt, và cả hai đứt lặng. Vòng VK1 nhắc báo cáo một lần trong sổ vì tác tử tự tìm, không luật nào bắt.

## Đích

Mỗi hàng cắt từ một bản phạm vi mở vòng với đúng bối cảnh đã nghiên cứu, và bước thiết kế chứng được nó đã nạp
bối cảnh ấy. Ba mối nối, mỗi mối một răng:

1. **Nguồn nằm trong git.** Khoá `nguon` của bản phạm vi là danh sách đường dẫn tương đối gốc kho, cách nhau bằng
   dấu phẩy, mỗi đường là tệp (hay thư mục có tệp) mà git theo dõi. Răng phủ (`cat-luot.mjs --pham-vi`) đỏ
   `[nguon-ngoai-git]` khi một mục là liên kết ngoài, đường tuyệt đối, thoát gốc kho hay chưa vào git; đỏ
   `[nguon-trong]` khi khoá rỗng. Lời kể về nguồn (ai yêu cầu, ngày nào) chuyển lên phần văn của bản phạm vi.
2. **Mở ô ghi dòng «Nguồn:».** `lo-trinh.mjs --mo-o` tìm bản phạm vi của hàng theo `dot` (mọi tệp `.md` git theo
   dõi có khoá `dot` trùng, xác nhận bằng chính bộ đọc bản phạm vi), rồi ghi MỘT dòng vào mục «Vấn đề & ai gặp» của
   ô, ngay dưới dòng «Mở từ hàng …»:
   `Nguồn: \`<bản phạm vi>\` (mã <phu…>) · \`<tệp 1>\` · \`<tệp 2>\``. Thư mục trong `nguon` bung thành từng tệp.
   Bản phạm vi đời trước (nguồn chữ tự do) → dòng vẫn trỏ bản phạm vi, kèm `· ngoài git: «<chữ>»`. Có `dot` mà
   không tìm thấy bản phạm vi → dòng nói đúng điều đó. Hàng không `dot` → không có dòng, ô y hệt trước vòng.
   Tiền tố `Nguồn:` là khối marker `OPP-NGUON-PREFIX` của khuôn ô cơ hội: bên ghi và bên đọc rút từ đó.
3. **Bước thiết kế nạp nguồn.** Ô có dòng «Nguồn:» trỏ tệp → S1 đọc trọn từng tệp và ghi đúng MỘT dòng sổ nạp
   (khuôn `DEC-NGUON-NAP`, cùng nếp dòng nạp luật sản phẩm ADR 0024) mang `nguon_nap: [{tep, ban}]`, `ban` =
   `git hash-object <tệp>`. Khi `nguon.chan` đúng, dòng lệnh duyệt của thẻ để ô quyết `___` và thẻ in dòng «CHƯA vào
   được Cổng Phạm vi: chưa nạp nguồn …» (cùng điều kiện chặn `g1Blocked` với cỡ hợp đồng). Lựa chọn dựa trên nguồn ghi `can_cu` nguồn mục-tiêu trỏ tệp nguồn + câu trích nguyên văn
   — bộ xếp `can-cu-s1.cjs` vốn đã kiểm câu trích có trong tệp. Thẻ Cổng Phạm vi (`gate-card.js`) đọc dòng nạp:
   hồ sơ `draft` mà thiếu dòng nạp, hay dòng nạp thiếu một tệp của dòng «Nguồn:» → khoá `nguon.chan = true` +
   cờ đỏ; tệp đã đổi sau khi nạp → cờ vàng. `nguon.chan` là điều kiện vào Cổng Phạm vi như `co_hop_dong.chan`
   (khối `NGUON-NAP-CHAN` của SKILL feature-loop): máy tự đọc và ghi dòng nạp rồi dựng lại thẻ — không mời người.

Không thêm trường nào lên hàng lộ trình (luật SKILL cắt lượt: «đừng thêm trường cho agent»): bối cảnh đi qua ô, chỗ
S1 vốn đã đọc.

## Một hàng chỉ cần một phần tài liệu

Khuyến nghị (câu hỏi ở Cổng Phạm vi): trỏ theo MÃ và nạp trọn tệp. Dòng «Nguồn:» mang `phu` của hàng (mã HT3…);
bản phạm vi nối mã với mô tả; tài liệu nghiên cứu đặt mã vào tiêu đề mục khi một tệp phục vụ nhiều hàng. Lối khác còn
sống: `tệp#tiêu-đề` trỏ một mục markdown thường — răng phải kiểm tiêu đề có thật và bộ nạp chỉ băm một mục. Giá của
lối khuyến nghị là token: đợt có tệp nguồn lớn bắt mỗi hàng nạp trọn. Hạt giống mở khi một đợt có tệp quá lớn để nạp
trọn.

## Đường đo

Đợt đầu tiên một kho cắt sau khi nhận bản: mọi ô mở từ hàng có `dot` mang dòng «Nguồn:» trỏ tệp, mọi hồ sơ ấy có dòng
nạp trước khi mời Cổng Phạm vi. Đọc bằng `node scripts/nguon-luot-cat.cjs --root <kho> --dem --tu <ngày nhận bản>`,
ngày nhận bản + 14. Mẫu số 0 thì thước vô hiệu.

## Ảnh và tệp nặng

Ảnh nằm trong git cạnh tài liệu dẫn tới nó (thư mục đợt của kho, ví dụ `docs/plan/dot-<đợt>/anh/`), nén ở cỡ đọc
được; tài liệu markdown nhúng ảnh bằng đường tương đối. Tệp nặng (video, bản ghi thô, dump dữ liệu) không vào git:
số đo và kết luận rút vào markdown, kèm một dòng nơi giữ bản gốc. Đây là lời dặn trong SKILL cắt lượt, không có
răng — vì cỡ «nặng» là chính sách của kho, không phải của kit.

## Sửa trên mọi kho

- Kho không dùng cắt lượt: hàng không `dot` → ô không đổi một byte; thẻ hồ sơ không có dòng «Nguồn:» → khoá
  `nguon` vắng, thẻ không đổi.
- Kho đã cắt bằng chữ tự do: không bắt di cư. Răng phủ chỉ chạy lúc một phiên cắt đợt (và đỏ thì sửa một dòng);
  ô mở từ hàng đời trước vẫn mở, mang cờ «ngoài git» để người đọc thấy.
- Hồ sơ đã qua Cổng Phạm vi: thẻ không gắn cờ nạp (chỉ hồ sơ `draft`).

## Không làm (vòng này)

- Đưa tệp nguồn vào phản biện context sạch (input thứ bảy của gap-probe) để soi hợp đồng có trái nghiên cứu
  không — đó là răng NGHĨA, CỘNG thêm token mỗi vòng; hạt giống.
- Cứu dữ liệu ở kho tiêu thụ — PR riêng ở crm.
- Thêm trường lên hàng lộ trình; trỏ theo mục; răng cỡ tệp.

## Giới hạn đã khai

- Dòng nạp chứng máy đã CHẠM từng tệp (băm), không chứng đã HIỂU. Căn cứ trích nguyên văn chứng phần lựa chọn
  dựa trên nguồn; lựa chọn trái nguồn mà không trích thì chỉ phản biện nghĩa (hạt giống trên) mới bắt.
- Nguồn còn có thể sống ở nơi git không chép (artifact claude.ai): răng chặn LÚC CẮT, không chặn người dán liên kết
  vào phần văn.

## Đặc tả UX

Bỏ — vòng không chạm mặt web (descope trong sổ).
