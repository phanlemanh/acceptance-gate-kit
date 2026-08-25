# Hạt giống — Đo những lời hứa chỉ nói được bằng văn xuôi (tách 25/08)

**Xuất xứ:** cắt ra từ hồ sơ `design-pass-nac-khong-dong-bo` sau **hai vòng
nghiệm thu liên tiếp cùng một lớp lỗi**, khi luật dừng-vá bật. Owner chọn đường
thu phạm vi 25/08. Hồ sơ gốc vẫn giao **vật và lời** đầy đủ — nghi thức thôi đòi
ngồi cạnh máy, bước phân kỳ đã có, thẻ đã hiện nấc — và giữ lưới máy cho tám
tiêu chí đếm được. Sáu tiêu chí `AC-2…AC-7` mất lưới; người duyệt soi chúng bằng
mắt tại Cổng Phạm vi.

## Điều muốn có

Máy giữ được lời hứa dạng **«nghi thức không có đường thoát nào cho phép bỏ qua
mà không để vết»** — tức là phủ định phổ quát trên một tài liệu văn xuôi mà con
người còn tiếp tục sửa. Hôm nay kit chỉ giữ được lời hứa dạng **«thứ này phải có
mặt đúng chừng này lần ở đúng chừng này chỗ»**.

## Vì sao KHÔNG làm tiếp trong hồ sơ gốc — bằng chứng hai vòng, bốn hình dạng

Cùng một lớp lỗi đổi da bốn lần, mọi lần đều là **thước tự dối**:

| # | Hình dạng lỗi | Vế bị giết |
|---|---|---|
| 1 | Chuỗi `else-if`: nhánh trước bắn làm nhánh sau không bao giờ chạy | vế lõi AC-6 |
| 2 | Đo **bản in dự phòng**: thẻ luôn in id thô khi không có nhãn, nên đòi thấy id là đo bản in dự phòng chứ không đo cờ | nhánh giá trị-lạ AC-10 |
| 3 | Phép **HOẶC** trong assert: cả hai vế còn trong vật nên vế sau không bao giờ có chiều đỏ | vế «sync phải có người gọi tên» AC-2 |
| 4 | **Danh sách cấm / cho phép trên không gian mở**: chỉ bắt được đúng chữ người viết nghĩ ra | vế lõi AC-6 (lần hai, đổi hình) · phạm vi quét AC-7 · bản chép thứ ba AC-11 |

Và một lớp nền: **bảng hứa ở một chỗ, bản chép thứ hai không sửa** — bảng ma
trận mutant được đính chính ở đầu file mà bản chép trong câu hỏi hội đồng thì
không.

**Chẩn đoán (câu hỏi bắt buộc của luật dừng-vá, retro 14/08):** *mệnh đề đang
hứa có thuộc loại chứng được không?* Sáu tiêu chí bị cắt hứa **phát biểu phổ
quát về nghĩa của văn tự nhiên**. Không phép so chữ nào chứng được loại mệnh đề
đó: mọi danh sách cấm đều còn không gian ngoài danh sách, và mọi cách diễn đạt
mới đều nằm ngoài danh sách. Bốn hình dạng trên không phải bốn lỗi — là bốn cách
thất bại của **cùng một điều bất khả**.

Phần **lật sang liệt cái ĐƯỢC PHÉP** (đường thoát mà retro 14/08 tìm ra) chỉ cứu
được nhánh từ vựng đóng, và nhánh đó **đã có lưới** ở AC-8: khoá `divergence:`
phải có mặt trong khuôn, khuôn là chỗ duy nhất giữ hình dạng sổ phiên.

## Vì sao tám tiêu chí kia GIỮ được lưới

Chúng không cùng loại. Chúng hứa **quan hệ đếm được trên tập đóng** hoặc **đầu ra
thật** của bộ dựng thẻ:

- danh sách bốn nấc phải nằm đúng một chỗ (AC-1) · hai khoá phải nằm trong khuôn
  và khuôn là nguồn duy nhất (AC-8) · hai ổ cắm phải được nêu ở hai file (AC-13);
- câu chuẩn phải xuất hiện đúng số lần ở đúng số chỗ trên trọn hai thư mục
  (AC-11) · bốn câu khai mặc-định-đồng-bộ phải tuyệt chủng (AC-12);
- thẻ phải hiện đúng nhãn nào, cờ nào, và phải dựng được ở mọi đời hồ sơ
  (AC-9, AC-10, AC-15).

Phép thử phân loại: **có đếm được không, hay phải hiểu mới biết đúng sai.**

## Điều kiện để mở lại ô này

1. **Đổi vật, đừng đổi thước.** Lời hứa loại này chỉ giữ được nếu nó thôi sống
   trong văn xuôi: một khối máy-đọc có khuôn cố định (như bảng thang nấc, như
   khuôn sổ phiên) khai *các lối ra hợp lệ*, rồi nghi thức được sinh TỪ khối đó.
   Khi ấy «không có đường bỏ im lặng» thành «tập lối ra đúng bằng tập đã khai» —
   một quan hệ đếm được.
2. **Không danh sách cấm.** Mọi thước mới phải là quan hệ dương trên tập đóng.
   Phép thử trước khi viết: *nếu tôi diễn đạt lại vi phạm bằng chữ khác, thước
   này còn đỏ không?*
3. **Chiều đỏ phải phá vật THẬT, không phá mutant của chính mình.** Ba trong bốn
   hình dạng trên đều xanh cho tới khi có người sửa chính tài liệu nguồn rồi chạy
   lại. Nghi thức: mỗi phép đo mới, phá thử một lần trên cây thật.
4. **Bảng hứa chỉ được sống một chỗ, có mốc neo**, và mọi bên đọc trỏ về nó.

## Ghi chú

Phần cắt KHÔNG mất giá trị cho người dùng: nghi thức vẫn nói đúng những điều
đó, và người duyệt vẫn đọc chúng tại Cổng Phạm vi. Thứ mất là **lưới máy** —
tức là nếu ai đó sửa nghi thức làm mất một trong sáu điều khoản ấy, hôm nay
không có gì kêu. Đó là giá đã khai, không phải giá bị giấu.

Ô anh em cùng hình dạng: `dac-ta-ux-vat-hoa-cau-truc` (cắt trọn lưới sau 5 vòng,
hạt giống `docs/plans/2026-08-24-hat-giong-khop-vong-dac-ta-ux.md`). Hai ô cắt
vì **cùng một lý do** — đo văn xuôi tự do bằng dò chữ — nên nếu mở lại thì nên
mở CHUNG một ô, không mở hai.
