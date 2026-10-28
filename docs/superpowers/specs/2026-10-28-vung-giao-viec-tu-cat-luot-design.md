# Vùng giao việc đi từ cắt lượt — thiết kế

Hồ sơ: `_acceptance/vung-giao-viec-tu-cat-luot/` · Cổng Đáng: build (chủ kho, 27/10) · đề bài phanlemanh/acceptance-gate-kit#430.

## Vấn đề, một đoạn

Lịch biết tệp (gói `dieu-phoi`, bản 2.34.0) chỉ giao một hàng khi vùng tệp nó khai (`ranh_gioi`) không trùng việc
đang dở ở dãy khác. Cơ chế đúng nhưng không có cảm biến: hàng lộ trình không có trường vùng mã, gói đợt không điền
giúp, nên ở đợt «vỏ khu Mục tiêu» của một kho tiêu thụ cả 22/22 hàng chỉ khai thư mục hồ sơ của chính mình, lịch thấy
0 lần chồng thật và 0 lần tự xếp `sau`. Hai hàng cùng sửa một màn ký song song; hàng gộp trước làm gãy thước đã ký của
hàng kia.

## Lời giải: ba chỗ, một dòng chảy

```
cắt lượt ──vung──▶ tệp lộ trình ──(gói đợt chép)──▶ hang-viec.json: ranh_gioi ──▶ lịch lúc giao: chồng → `sau`
                                                                   ▲
                         phiên thợ ở Cổng Phạm vi: `hang vung` ────┘ (gộp thêm thư mục mã của thiết kế; chồng với
                                                                     hàng đang dở → một sự kiện báo)
```

1. **Cắt lượt ghi `vung`.** Mỗi hàng của lộ trình mang `vung`: mảng glob tương đối gốc kho, lấy theo MÀN mà câu
   giao nói tới — cả dáng `lan-va` (đã cắt theo màn) lẫn `chuoi`. Hàng sửa khung chung của một khu (bố cục, thanh
   bên, điều hướng — tệp đứng thẳng trong thư mục khu) giữ cả khu `<khu>/**`; hàng chỉ sửa một màn giữ thư mục màn
   ấy. Không ghi `_acceptance/…`: thư mục hồ sơ mỗi hàng một tên, chồng ở đó không bao giờ có nghĩa.
2. **Răng phủ canh độ rộng**, chỉ ở hàng trong đợt đang cắt (hàng ngoài đợt không mang cờ vùng — đầu ra của lộ trình
   cũ không đổi):
   - `vung-qua-rong` (lỗi) — glob không có đoạn thư mục tĩnh trước ký tự đại diện đầu (`**`, `*.tsx`, `**/x/**`);
   - `vung-sai-kieu` (lỗi) — `vung` không phải mảng chuỗi khác rỗng;
   - `vung-trung-moi-hang` (lỗi, cấp đợt) — đợt có từ ba hàng khai vùng mà MỌI cặp đều chồng: lịch sẽ xếp cả đợt
     thành một hàng dọc, đúng ngưỡng chết của ô;
   - `chua-khai-vung`, `vung-chi-ho-so` (cảnh báo) — hàng thiếu vùng, hay vùng chỉ trỏ `_acceptance/`.
   Phép so «hai glob chồng» của răng là BẢN CHÉP nguyên văn của phép so của lịch (`mauGiao`, `khop`) đặt trong khối
   marker; một ca round-trip so hai bản trên cùng ma trận cặp glob — gói `dieu-phoi` không nạp mã kit và ngược lại.
3. **Gói đợt chép.** Đợt khai `nguon_hang`: hàng thi công không khai `ranh_gioi` nhận `ranh_gioi` = `vung` của hàng
   lộ trình; hàng khai tay giữ nguyên (khai tay thắng — đã có kho khai tay sau đề bài #430). `hang them <mã>` cho mã
   của lộ trình mà đợt chưa có cũng nhận vùng ấy; `--ranh-gioi` thắng.
4. **Lịch lúc giao** không đổi mã: nó đã so `ranh_gioi` với việc đang dở và tự ghi `sau`. Vòng này chỉ đưa cảm biến
   tới nó.
5. **Xét lại ở Cổng Phạm vi.** Lúc trình Cổng Phạm vi, phiên thợ của một hàng CÓ vùng chạy
   `hang vung <slug> --vung <glob,…>` với thư mục mã mà thiết kế của nó chạm. Lệnh GỘP vùng mới vào `ranh_gioi` (không
   thay — thà báo thừa còn hơn lọt), một dòng Nhật ký; glob không có thư mục tĩnh bị từ chối, không ghi byte. Hàng chưa
   bắt đầu ở dãy khác sẽ được lịch so với vùng mới ở nhịp kế (có thể nhận `sau`). Hàng ĐÃ bắt đầu hay đã ký ở dãy khác
   mà chồng vùng mới → một sự kiện `trung-tep` (`luc: cong-pham-vi`, không cần người phán) và lệnh in một dòng cảnh
   báo: không ghi `sau` cho hàng đang dở, không xin hay nhả khoá nào, không đổi lượt chấm hay làn ghim.

## CỘNG cần chủ kho phê (Hỏi-1)

Lời phê chép ở Notes của ô gọi tên vòng; mục 5 thêm ba thứ phát hành tới mọi kho chạy đợt mà lời phê ấy không gọi tên:
1. lệnh `hang vung` của gói `dieu-phoi`;
2. một bước cho phiên thợ trong khối TRONG-DOT của vòng lặp — chỉ chạy khi hàng có vùng;
3. sự kiện `trung-tep` mang `luc: cong-pham-vi` trên sổ đợt.
Máy khuyên làm: là lưới duy nhất khi vùng đoán lúc cắt sai. Lối khác: cắt AC-7, AC-8 thành hạt giống — vòng còn bảy tiêu
chí; ngưỡng sống của ô vẫn đo được. Chủ kho chọn cắt thì mục 5 và hai tiêu chí ấy rời vòng, phần còn lại không đổi.

## Vì sao không đọc tệp có sẵn ở Cổng Phạm vi

Hai nguồn «đường mã thật» có sẵn lúc ấy đều đo rồi bỏ:
- `paths` của `evals.yaml` — trên 14 hồ sơ của đợt «vỏ khu Mục tiêu», 78/91 cặp chồng: dùng nó là đạt ngưỡng chết.
- tệp kế hoạch — viết tự do (bí danh thư mục `O/…`, nhiều đường một dòng), máy không rút tất định.
Phiên thợ đã đọc thiết kế của chính nó nên khai được vùng; lệnh canh độ rộng như răng cắt lượt.

## Kho không khai vùng

Lộ trình không có `vung` và đợt không gọi `hang vung` → mọi đường đi y bản trên nhánh chính hiện nay (dieu-phoi không
đổi từ 2.34.0). Một ca vi phân chạy cùng thư mục đợt qua nhiều nhịp bằng bản gốc (lấy trọn thư mục `dieu-phoi` bằng
`git archive`) và bản mới, so `tiep/*`, `hang-viec.json`, `LUAT.md`, sự kiện (bỏ giờ) và kết quả đọc gói.

## Phát lại

Một bản chụp ẩn danh của đợt «vỏ khu Mục tiêu» (ba dãy, mười bốn hàng, đúng thứ tự giao) mang vùng theo màn do phiên
vòng này viết theo luật ở mục 1 từ câu giao thật. Mọi tên trong bản chụp là tên tổng hợp (mã `H<số>`, slug `hang-<số>`,
đường `app/khu/man-<chữ>/**`), và ca kiểm điều đó bằng danh sách cho phép, không bằng danh sách cấm. Bộ phát lịch thật chạy
qua các nhịp: hàng dáng VK8 (H5) phải nhận `sau` hàng dáng VK6 (H10, sửa khung toàn khu); cùng gói không vùng thì không.
Cặp chồng so bằng danh sách 25/91 cặp viết trước, trần 45 (một nửa). Giới hạn khai: phiên viết vùng đã biết đáp án — bản phát lại chứng cảm biến và luật, không chứng độ đúng của dự
đoán lúc cắt; cái đó đo ở đợt thật kế tiếp (ngưỡng thứ hai của ô).

## Chạm ngoài vùng của đề bài

- `dieu-phoi/scripts/dieu-phoi.mjs` — lối lệnh `hang vung`.
- `feature-loop/skills/feature-loop/SKILL.md` khối TRONG-DOT — một dòng: phiên thợ chạy `hang vung` trước thẻ Cổng
  Phạm vi khi hàng có vùng.
- `dieu-phoi/README.md` — mục lịch biết tệp.
- `scripts/cat-luot.mjs` — răng phủ (đề bài ghi `skills/cat-luot/`; răng của skill ấy sống ở đây).
