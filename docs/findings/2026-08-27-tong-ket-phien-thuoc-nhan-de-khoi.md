# Tổng kết phiên 2026-08-27 — từ so sánh skill đến một cái thước đã ký

Phiên bắt đầu bằng một câu hỏi không phải việc-kit: *«phân tích skill archify và
so sánh với diagram-design»*. Nó kết thúc bằng PR #116 đã ký Cổng Bằng chứng.
Bản này ghi lại đường đi đó, và ba điều học được mà tôi không muốn phải học lại.

## 1. Đường đi

| Chặng | Kết quả |
|---|---|
| So sánh archify ↔ diagram-design | Khác biệt cốt lõi: **ai chấm**. Cùng tập luật hình học, một bên là văn xuôi cho máy tự gật, một bên là 9 phép kiểm chạy được |
| Vẽ thử hình thật bằng archify | 3 vòng, `deliver` đóng băng SHA-256. Đối chiếu với hình #2 của kit → **phát hiện 3 nhãn bị khối vẽ sau che mất chữ** trong 2/8 hình đã ship |
| Mở vòng `thuoc-nhan-de-khoi` | 6 vòng Cổng Bằng chứng, 19 entry sổ quyết định, 2 lần luật dừng-vá kích hoạt |
| Ký + ship | PR #116, 28 file, +1700 dòng. Cổng: `OK — PASS, signed off` |

Con số: 57 phép răng hai chiều · lưới vĩnh viễn canh 218 nhãn trên 16 file ·
kho skill nguồn 4 commit đã đẩy công khai.

## 2. Bài học lớn — «đảo chiều mặc định», không phải «thêm mục vào danh sách»

Bốn vòng liên tiếp sinh **cùng một lớp lỗi**: `allowlist không có ca đỏ ngoài
danh sách`. Mỗi vòng lộ một góc SVG mới mà thước đoán sai:

- vòng 2 — nền `rgba(…,0.06)` của chính skin nhà bị đọc thành đục → **báo oan**
- vòng 3 — `rgb(0,0,0)` (đen đặc) bị đọc thành trong suốt → **bỏ sót**
- vòng 4 — bản vá vòng 3 siết «đủ 4 thành phần» lại giết `rgb(45 49 66 / 6%)`
  → **bản vá tự đẻ lỗ mới**; toạ độ `300px` bị ép về 0 rồi tố oan bằng toạ độ bịa

Ba lần đầu tôi chữa bằng cách **kéo dài danh sách**. Lần nào cũng thủng chỗ khác,
vì không gian «mọi cách SVG tô một mảng đặc» là mở.

Lời giải không nằm ở danh sách mà ở **chiều đoán**. Đảo lại: *không hiểu → phần
tử vô hình kèm WARN*. Sau đảo chiều, mọi cú pháp lạ, đơn vị lạ, file hỏng đều rơi
về **sót-đã-khai** — thứ đã ghi thành lời khai đọc được — thay vì rơi về **tố
oan**. Một thay đổi nguyên tắc ~40 dòng đóng cả bốn lỗi cùng lúc.

**Vì sao chiều đó, không phải chiều kia:** trong một lưới chặn merge, một lời tố
sai dạy người ta nới tay lưới. Sót có khai thì người còn biết mình đang không
được che chỗ nào; tố oan thì người mất niềm tin vào cả cái cổng. Bất định phải
luôn rơi về phía khai báo, không rơi về phía buộc tội.

> Đưa vào sổ lớp lỗi như một *lời giải* có tên, cạnh chính lớp lỗi nó chữa.

## 3. Hai lỗ engine phát hiện dọc đường (giá trị nhất của phiên)

Cả hai không thuộc hồ sơ này, và cả hai đều là «máy tin nhầm chính nó» ở tầng
**cổng** — đúng tim nguyên tố 2:

1. **Làn máy thoát phép kiểm bằng-chứng-cũ.** `pre-merge-check.sh` cho nhánh
   xanh-sạch `continue` **trước** khối kiểm stale. Đo thật: 63 hồ sơ khác bị bắt
   stale, hồ sơ đi làn máy thoát sạch, cổng in «xanh-sạch, máy đi tiếp».
2. **Điều kiện xanh-sạch thoả bằng sự VẮNG MẶT của dữ liệu.** Bước tổng hợp để
   rỗng `## Ngoài hợp đồng` và `## Known limits` trong khi `review-findings.md`
   mang đủ mục đã phân loại. Section rỗng → đủ 6 điều kiện → vào làn không chữ ký.

Hai lỗ **cộng hưởng**: (2) làm (1) không bao giờ bị nhìn thấy. Hồ sơ này từng
*hưởng lợi* từ chính lỗ nó vừa ghi sổ — nên vòng chạy lại là bắt buộc, không phải
lựa chọn. Ô: [`2026-08-27-hat-giong-lan-v-thoat-kiem-stale.md`](../plans/2026-08-27-hat-giong-lan-v-thoat-kiem-stale.md).

## 4. Vấp của máy — ghi để không lặp

- **Sửa TAY bản vendored.** NOTICE ghi rõ *«this copy is NOT edited by hand»*.
  Đường đúng: sửa ở kho skill → `vendor-sync.sh` → bump version. Hai phép kiểm
  độc lập bắt được (tree-hash lệch, số phiên bản không nhất quán) — lưới đúng chỗ.
- **`rm -rf` thư mục `figures` của hồ sơ khác** khi thử nghiệm mẫu đường dẫn, xoá
  mất 2 file thật. Chính chiều đỏ vừa sửa bắt lại lỗi này. Sau đó chuyển chỗ thử
  sang **dữ liệu có sẵn trong lịch sử git** — phép đo không được ghi vào cây nó đo.
- **`cp A B thư-mục/`** đặt file sai chỗ rồi push. Bản vá là commit tiếp, không
  viết lại lịch sử đã đẩy.
- **`evals.yaml` trôi khỏi tham số truyền cho vòng chạy.** File là nguồn sự thật;
  tham số phải suy từ nó, không phải ngược lại.
- **Cách viết làm bộ kiểm đỏ hai lần** — và lần thứ hai lộ một quy tắc thật: thẻ
  cổng lấy **dòng đầu** của mỗi tiêu chí, nên tiêu chí kết thúc ngay tại dấu in
  đậm sẽ vỡ khi render.

## 5. Nhìn lại bằng North Star

Giá trị người-dùng-cuối **xong từ ngày đầu**: 3 nhãn hỏng sửa ở Task 2, lưới
chặn tái diễn ở Task 3. Bốn vòng sau đó là *đo cái thước đo cái thước* — mỗi vòng
được lệnh «tìm lỗ» trên một không gian đầu vào vô hạn nên nó **luôn** tìm ra lỗ
mới. Đó là lớp «vòng verify không tự hội tụ» đã có trong sổ, và người để nó chạy
bốn vòng là máy.

Cái đã cứu vòng lặp không phải một phép đo nào — mà là **owner xuất hiện đúng hai
lần**: thu phạm vi (vòng 2), đảo chiều mặc định (vòng 4). Cả hai lần đều là câu
hỏi có đánh-đổi thật, không phải trạm thu phí.

**Nếp rút ra cho vòng sau:** khi mở một vòng chạy lại sau khi đã dừng-vá, **khai
trước luật kết thúc** — finding thuộc loại nào không còn là lỗi chặn ship. Vòng 6
làm được điều đó và hội tụ ngay.

## 6. Nợ mở

| Món | Trạng thái |
|---|---|
| Nháy đơn vô hình với parser → có thể tố oan | Sửa 1 dòng ở kho skill, đợt vendor kế. House style luôn nháy kép nên corpus 0 ca |
| Hạt giống `lan-v-thoat-kiem-stale` | Ô + stub đã dựng, chờ Cổng 0 |
| 9 ca nhãn-che trong assets mẫu của skill | Quét report-only đã ghi trong hồ sơ; sửa hay không là quyết định riêng |
| archify — đợt 2 «dùng thử song song» | Chưa chạy. Kích hoạt ở vòng tới có hình kỹ thuật tại cổng |
