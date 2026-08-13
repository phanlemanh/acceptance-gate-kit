# Hạt giống — «mọi liệt kê trong hợp đồng phải máy-đọc»

**Trạng thái: ĐỀ XUẤT, chờ Cổng 0. KHÔNG thi công trong hồ sơ nào đang chạy.**
Viết 2026-08-13, sinh ra từ vòng rà soát đối kháng 2 của
`luu-kho-codex-va-nghi-le-design`.

## Vì sao có tệp này

Vòng sửa 2 của hồ sơ 1b chữa bốn lỗ P0 bằng cách đổi một bất biến **trong phạm
vi hồ sơ đó**: mọi danh sách mà hợp đồng hứa (`VAT-LUU-KHO`, `NEEDLE-CHET`,
`SO-CA-KY-VONG`) nay là khối marker máy-đọc, và bộ răng đọc thẳng khối ấy thay
vì chép tay sang mảng bash.

Cách chữa đó đúng cho một hồ sơ. Nhưng **lớp lỗi thì không thuộc về hồ sơ nào**
— nó thuộc về hình dạng của mọi hợp đồng trong kit:

> Hợp đồng khai một liệt kê bằng văn xuôi cho NGƯỜI đọc; phép đo chép liệt kê ấy
> sang mã cho MÁY đọc. Hai bản. Hợp đồng được sửa hợp lệ nhiều lần sau Cổng 1
> (bảy lần trong riêng hồ sơ 1b), và mỗi lần sửa là một cơ hội cho bản chép tay
> bị bỏ quên — im lặng, vì phép đo vẫn xanh với danh sách cũ.

Ba lần nó nổ trong một hồ sơ, đủ để gọi là lớp chứ không phải sự cố:

| | Hợp đồng khai | Mã đo | Hệ quả |
|---|---|---|---|
| F1 | 7 đường dẫn lưu kho | 6 | Vế thêm-vào-để-chữa-một-cái-sót là vế duy nhất không ai đo |
| F3 | 4 needle `plugins/…` | 1 | Tái phạm nguyên văn finding C2 của vòng 1 |
| F4 | chuỗi ghim `671 -> 664` | cây in `686` | Lời hứa thông điệp của 23 eval chưa từng được so với đầu ra |

## Đề xuất (một dòng)

Nâng nếp «khối marker + round-trip» từ **thói quen của vài hồ sơ** lên **luật
của kit**: một liệt kê mà tiêu chí dựa vào để phán đúng-sai thì phải nằm trong
một khối marker máy-đọc, ở đúng MỘT chỗ, và phép đo phải đọc khối ấy — có chân
round-trip chứng minh (sửa khối trong bản sao → phép đo đổi theo).

## Trace về ba nguyên tố

- **Nguyên tố 2 — bằng chứng không tự dối.** Món này cho **MÁY**: nó chặn đúng
  hình dạng "máy tin nhầm chính nó" khi mảng trong mã đã trôi khỏi bản khai.
- Người hưởng cụ thể: **phiên chấm đối kháng**. Với luật này, việc kiểm một hồ
  sơ đổi từ "săn N bản chép tay rải khắp script" sang "kiểm MỘT cơ chế: khối có
  được đọc thẳng không, round-trip có đỏ không". Đó là bằng chứng đọc được trong
  một phút.

## Vì sao KHÔNG làm ngay, và không đi ké vòng sửa 1b

1. Đây là **CỘNG**, không phải TRỪ. CLAUDE.md: chỉ TRỪ, không CỘNG — nên nó
   phải tự trace qua Cổng 0 với người hưởng gọi tên được, không được cài kèm.
2. Nó đụng **engine** (`scripts/eval-coverage-lint.js` hoặc một lưới mới trong
   `tests/`), tức đổi engine dưới chân hai hồ sơ đang giữa vòng — đúng thứ
   CLAUDE.md cấm ("consumer nhận engine mới theo release có chủ đích").
3. Chưa biết **hình dạng cưỡng chế đúng**. Ít nhất ba đường, chưa cân:
   - lint cảnh báo khi hợp đồng có liệt kê ≥ N mục mà không có khối marker nào;
   - luật per-dossier: bộ răng phải có ít nhất một chân round-trip khối;
   - để nguyên là **quy ước**, và chỉ cưỡng chế ở gap-probe (critic hỏi
     "liệt kê nào trong hợp đồng không có khối máy-đọc?").
   Đường thứ ba rẻ nhất và có thể đã đủ — chưa đo thì chưa biết.

## Nếu Cổng 0 gạch

Đề bài tối thiểu: chọn một trong ba hình dạng trên, đo **giá thật** (bao nhiêu
hợp đồng đang có liệt kê kiểu này, bao nhiêu cần chuyển), và khai known-limit
cho hồ sơ cũ — **không** bắt hồ sơ đã ký migrate hàng loạt (đường đọc-cũ, đúng
nếp Coverage 1.13.0 và gap-probe 1.14.0).


## Bài học bổ sung từ vòng 3 (13/08)

Vòng sửa «một-nguồn» hợp nhất phía MÁY và bị vòng 3 REJECT vì phía VĂN XUÔI
vẫn nêu lại giá trị — bốn bản chép chỉ-người-đọc trôi ở đúng bốn chỗ vòng 2 đã
chỉ mặt. Ba mệnh đề rút ra, thuộc về đề xuất này chứ không thuộc hồ sơ nào:

1. **Một-nguồn phải phủ cả văn xuôi.** Luật viết đi kèm luật đọc: văn xuôi nêu
   QUAN HỆ và LÝ DO; giá trị chỉ sống ở (a) nơi khai gốc hoặc (b) bản chép được
   máy so mỗi vòng. Bản chép chỉ-người-đọc là lỗi.
2. **Phải tuyên ĐÁY của chứng minh.** «Bằng chứng không tự dối» đệ quy không có
   điểm dừng — mỗi tầng đo cần tầng chứng dưới nó. Hồ sơ phải tuyên đáy (đếm
   độc lập + mốc bất biến + suite thường trực); chân phía trên đáy là dụng cụ,
   không phải lời hứa.
3. **Thước cân xứng vật.** Hồ sơ chỉ-TRỪ với mốc đảo bất biến là loại rủi ro
   thấp nhất — cần bộ đo MỎNG nhất, không phải dày nhất. Ba vòng rà soát của
   luu-kho: 0 finding về vật từ vòng 2, 100% P0 vòng 3 ở tầng thước.