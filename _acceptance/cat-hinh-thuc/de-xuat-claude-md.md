# ĐỀ XUẤT sửa `CLAUDE.md` — hạng mục 1a.7, trình tại Cổng 1

> **✅ OWNER GẠCH TẠI CỔNG 1 (2026-08-12): «quy tắc gốc đúng ý».**
> Ba thay đổi dưới đây được duyệt tường minh, kể cả điểm nặng nhất — rút "chữ ký
> người" khỏi hàng lõi bất khả nhượng và thay bằng "người quyết ở nơi có
> đánh-đổi hoặc khó-đảo". Từ đây chúng là **phạm vi thi hành**, không còn là đề
> xuất. Bản sửa thật vào `CLAUDE.md` diễn ra ở bước code của hồ sơ này.

*Trước khi được gạch, đây là ĐỀ XUẤT và `CLAUDE.md` chưa bị chạm.*

**Vì sao tách riêng thay vì sửa thẳng như sáu hạng mục kia:**

1. `CLAUDE.md` nằm trong `t1_skip_globs` của chính repo này → **không lưới máy
   nào canh nó**. Sáu hạng mục kia có suite bắt lỗi; hạng mục này chỉ có mắt anh.
2. `CLAUDE.md` là bản chỉ dẫn điều khiển chính phiên đang thi hành. Luật vận
   hành của phiên cấm sửa nó theo yêu cầu của một phiên máy ngang hàng — chỉ
   theo lời anh, gõ trực tiếp. Đề bài đợt 1 đến từ phiên điều phối, không từ anh.

Ba thay đổi, không thêm gì ngoài ba thay đổi này.

---

## ① Thay khối ⭐ NORTH STAR

**Hiện tại** (dòng 3–13) tuyên: giá trị duy nhất là sản phẩm đến tay người dùng;
kit là công cụ hỗ trợ Claude; giờ-kit là chi phí; lõi bất khả nhượng ba món.

**Đề xuất thay bằng** (phát biểu lại từ mục 0 bản neo, giữ nguyên tinh thần,
nói rõ hơn chỗ chia việc và thước đo):

> **⭐ NORTH STAR (owner tuyên 09/08, phát biểu lại 12/08):** Kit tồn tại vì một
> điều duy nhất — **sản phẩm đến tay người dùng nhanh hơn mà vẫn tin được.** Nó
> làm điều đó bằng cách chia lại đúng việc: **máy làm và tự chứng minh** (bằng
> chứng không tự dối — màu xanh phải từng chạy chiều đỏ), **người chỉ ra quyết
> định** tại ít khoảnh khắc thật, trên bằng chứng đọc được trong một phút, với
> đường đảo rẻ cho mọi thứ còn lại. Người đứng ở **biên** của vòng, không đứng
> giữa.
>
> **Thước đo của kit:** thời gian từ *làm-xong* đến *quyết-được*, và số lần
> phải gọi người trên mỗi kết quả ship. **Giờ-kit là chi phí.** Cổng mà câu trả
> lời hợp lý duy nhất là «ừ» là **trạm thu phí, không phải điểm quyết định**.
>
> Bản neo: [docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md](docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md)
> · nền: [2026-08-09](docs/findings/2026-08-09-ban-chat-that-vong-lap-kit.md)
> · [2026-08-10](docs/findings/2026-08-10-ra-soat-luat-theo-north-star.md).

**Khác biệt thật so với bản cũ** (để anh gạch đúng chỗ, không phải đọc lại cả khối):
- Thêm vế **"mà vẫn tin được"** — bản cũ chỉ nói "nhanh", nên đọc một mình nó
  biện minh được cho việc bỏ luôn bằng chứng.
- Đổi lõi bất khả nhượng từ *"chữ ký người"* thành *"người quyết ở khoảnh khắc
  thật"*. **Đây là thay đổi có sức nặng nhất, và là chỗ anh nên soi kỹ nhất:**
  nó rút chữ ký khỏi hàng bất khả nhượng và thay bằng một tiêu chuẩn về *chỗ
  đặt*. Căn cứ là đối thoại 12/08. Rủi ro nếu tôi hiểu sai ý anh: cổng nào đó
  lẽ ra cần chữ ký sẽ mất chữ ký mà không ai nhận ra.
- Thêm **thước đo** và câu **"cổng không có gì để quyết là trạm thu phí"**.

## ② GỠ khối ĐÓNG BĂNG LAB (dòng 15–25)

Khối này viết 07/08, treo điều kiện *"đến khi ≥3 feature thật ở repo tiêu thụ
đi trọn vòng"*. Điều kiện **đã đạt 10/08** (3 feature: 2 merged, 1 kill tại Cổng
Giá trị). Từ đó tới nay nó là văn bản chết vẫn đọc như lệnh sống — bản bàn giao
12/08 phải viết riêng một dòng cảnh báo *"đừng đọc nó thành lệnh còn hiệu lực"*.
Một bất biến cần chú thích để khỏi bị hiểu nhầm thì nó đã hỏng.

Gỡ hẳn, không thay bằng gì. Lịch sử nằm trong git và trong kế hoạch 07/08.

## ③ THÊM ba nguyên tố + luật trace

> - **Ba nguyên tố (hiến pháp trace).** Mọi bộ phận hiện có và mọi đề xuất mới
>   phải trace về **một** trong ba, và nêu được **người hưởng cụ thể**:
>   1. **Ý định chốt trước khi làm.** Chỉ owner biết "tốt" nghĩa là gì; chốt
>      sau khi làm xong thì mọi kết quả tự biện minh được.
>   2. **Bằng chứng không tự dối.** Món này cho **MÁY**: "máy tin nhầm chính
>      nó" là lớp lỗi có tỉ lệ đo được cao nhất; nhờ nó máy mới được chạy nhanh
>      mà người khỏi kiểm lại.
>   3. **Khoảnh khắc quyết thật.** Người xuất hiện đúng nơi có **đánh-đổi** hoặc
>      **khó-đảo**; cổng phải có ≥2 lối ra sống. **Đảo-rẻ là mặt sau của nguyên
>      tố này**: máy giữ đường đảo thì máy được đi trước; hành động không có
>      đường đảo tự động rơi về khoảnh khắc quyết thật.
>
>   **Không trace được = hình thức = cắt. Chỉ TRỪ, không CỘNG.**

## ④ GIỮ NGUYÊN, không đụng một chữ

Bảy bất biến còn lại — nguồn sự thật · glossary · khoá 6 thao tác cổng ·
assertion-âm-tính-một-mình · thước-gắn-vào-vật · kit-là-engine · đường-đọc-cũ ·
luật ADR. Tất cả trace về **nguyên tố 2**, tức chúng là lý do kit được phép
chạy nhanh. Cắt hình thức không được đụng vào chúng.

---

## Một va chạm phải xử, không được để phát hiện muộn

Bất biến **"nguồn sự thật + build mirror"** (dòng 27–34) nói về `plugins/` và
`sync-plugin-packages.sh`. Hồ sơ `luu-kho-codex-va-nghi-le-design` **gỡ toàn bộ
bộ máy đó**, nên tiêu chí AC-9 của hồ sơ ấy đòi `CLAUDE.md` thôi tuyên bất biến
này.

→ Phân vai để hai hồ sơ không giẫm nhau: **hồ sơ này sửa mục ①②③ (đầu file);
hồ sơ lưu kho sửa mục mirror.** Hai vùng khác nhau nên git merge được, nhưng
**bên nào merge sau vẫn phải rebase và đọc lại cả file** — không tin merge tự
động trên một văn bản mà cả hai đang viết lại.
