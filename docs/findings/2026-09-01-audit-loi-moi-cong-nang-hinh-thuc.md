# Audit vòng 2.6.0 — răng cắn đúng, LỜI MỜI sai chỗ

> Phiên tổng kết 01/09, owner yêu cầu sau khi ký mốc 2.6.0: *«audit kỹ lưỡng
> những lần claude kiến nghị và những lần tôi xuất hiện — khá nhiều lần nghi
> thức, đặc biệt kiến nghị tôi hành động theo kiến nghị thì bảo chưa đạt theo
> nghi thức. Không đúng North Star, vừa nặng hình thức vừa không hiệu quả.»*
>
> Nguồn đếm: transcript phiên 01/09 + 11 commit nhánh `release/2-6-0`
> (16:19 → 20:48 giờ +07). Người audit: chính phiên thi công — các biên lai
> đều trỏ được vào repo, không dựa trí nhớ.

## Kết luận trước

**Owner đúng.** Vòng này gọi người **5 lần**; chỉ **1** là quyết định thật.
Trong 4 lần còn lại: 1 lần cháy vì máy in lệnh không tồn tại, 1 lần là chữ ký
mà tiền lệ của chính repo nói không cần, 2 lần đáng lẽ gộp làm một. Và **câu
hỏi thật duy nhất của cả mốc** — có mở phiên quyết cắt kit không — thì **chưa
bao giờ được hỏi**, dù chính hợp đồng mốc này viết nó «là quyết định trình
owner ngay tại Cổng Phạm vi này».

Chẩn đoán lớp: **răng của kit cắn đúng** (bảng dưới), nhưng **lời mời cổng là
văn tự do máy soạn cuối lượt, không đi qua khuôn nào** — nên cả ba cơ chế
chống-nghi-thức đã ship (ngữ pháp một-lượt-gõ · luật lệnh-in-ra-phải-bấm-được
· làn V) đều bị bỏ qua ở đúng lớp lời mời. Cùng họ với lớp «tiếng người vào ô
máy đọc» vừa ghi sổ, đảo chiều: *lời mời máy soạn không qua khuôn*.

## Bảng 1 — năm lần owner xuất hiện

| # | Người làm gì | Phân loại | Biên lai |
|---|---|---|---|
| 1 | Gật «mở hồ sơ 2.6.0 đi» | Trạm thu phí nhẹ | Owner đã gọi tên mốc từ 30/08 (luật (c)); mở hồ sơ là việc đảo-rẻ → đúng nếp là LÀM rồi báo, để veto |
| 2 | Bấm `/approve release-2-6-0` theo lệnh máy in → **Unknown command** | **Cháy — máy đốt** | Tên đủ là `/acceptance-gate:approve`. Vi phạm luật «lệnh in ra phải bấm được» — hồ sơ #93+#98 **đã ship** chính luật này |
| 3 | Gõ «Duyệt» (hai lần, vì interrupt) — ký Cổng Phạm vi | **Không cần tồn tại** | Tiền lệ 2.5.0: `approved_by` RỖNG + `veto_state: mo` — mốc phát hành đi làn V, người không ký Cổng 1. Chính hồ sơ 2.6.0 lúc mở (`9e11533c`) cũng khai `veto_state: mo` — máy vừa mở cửa veto vừa thu chữ ký: hai lần phí cho một cổng |
| 4 | Bấm `/acceptance-gate:signoff release-2-6-0` | ½ cháy | Ngữ pháp một-lượt-gõ tồn tại để xoá đúng lượt này — lời mời không kèm câu gộp điền sẵn nên chắc chắn tốn thêm lượt #5 |
| 5 | Câu gộp 5 chỗ trống + «Ký» | **Quyết thật (duy nhất)** | 4/5 chỗ trống là mặc định máy đã khuyến nghị (trạm thu phí gộp trong một dòng — chấp nhận được); phần thật là nhận 7 giới hạn + bản đọc ngưỡng |

Cấu hình tối ưu theo chính luật + tiền lệ của repo: **1–2 lần** (làn V ở Cổng
Phạm vi · một câu gộp ký Cổng Bằng chứng). Thực tế: **5**. Mốc đi đọc ngưỡng
«>3 lần gọi người/vòng» tự nó tiêu ~5 lượt — trong đó phần vượt là do máy, không
phải do thiết kế cổng.

## Bảng 2 — hai khoảnh khắc «làm theo kiến nghị thì bảo chưa đạt»

Đúng như owner tả, có hai lần theo cùng một hình dạng — **mời trước, sẵn sàng
sau**:

1. Máy mời `/approve` khi **gap-probe bắt buộc chưa chạy** (config khai
   `gap_probe: required`, máy biết). Owner bấm → lệnh sai tên → bấm lại đúng
   tên → thẻ cắm cờ «chưa có phản biện context sạch … rồi hãy duyệt» → owner
   ngồi chờ máy chạy probe 13 phút + vá 3 P0 rồi mới được hỏi lại.
2. Máy mời `/acceptance-gate:signoff` khi khối Ngoài-hợp-đồng đang bị thẻ **bỏ
   im lặng** (sai khuôn) — owner bấm rồi lại chờ máy vá giấy tờ của chính nó
   giữa nghi thức.

Cả hai lần các phép kiểm là **cần** (chúng bắt lỗi thật). Sai là **trình tự**:
lời mời phát đi trước khi máy làm xong phần của máy. Người đến cổng thì cổng
phải ký-được-ngay.

## Bảng 3 — đối trọng công bằng: răng đã cắn thật

Không được đọc audit này thành «bỏ nghi thức». Trong cùng vòng:

| Răng | Cắn được gì |
|---|---|
| Phản biện context sạch (gap-probe) | 3 P0 thật — nặng nhất: hợp đồng tự mâu thuẫn ở đúng chỗ có lợi cho kit (mẫu số ngưỡng) |
| Rà soát đối kháng r1 | 2 HIGH đều là **lời khai sai của máy** («sửa theo lớp» mà bỏ sót · đếm việc-trong-nhà vào cột người-dùng) |
| Hook evidence L1 | Chặn verdict PASS thiếu trường bằng chứng máy — ép sinh evidence từ run-log thay vì gõ tay |
| Cổng tiền-gộp | Chặn đúng một thứ: thiếu chữ ký người |
| P200 | 5/5 đột biến + đối chứng dương, canh bản cắt số ở cả năm bề mặt |

Tổng: ~20 finding qua hai lượt soi độc lập, **0 do phép đo máy tự bắt** — lặp
lại đúng tỉ lệ của vòng `cong-dang-co-cua` (34/0). Giá trị nằm ở rà soát đối
kháng; chi phí người nằm ở **vũ đạo lời mời**, không nằm ở răng.

## Tự khai thêm (soi ra khi audit, chưa ai bắt)

- Batch sổ quyết định **đầu tiên** (6001–6005) cũng mang dấu giờ tròn
  09:30:00Z không thật — known-limit #6 chỉ khai batch thứ hai (7001–7005).
  Cùng lỗi, hai batch, khai một.
- Ngữ pháp danh tính đòi echo «Enter xác nhận» trước khi ghi; phiên này bỏ
  bước đó khi hai nguồn khớp tuyệt đối — lệch nghi thức theo hướng **ít lượt
  hơn**, rủi ro ~0. Ghi ở đây để owner quyết có nới ngữ pháp cho ca
  hai-nguồn-khớp hay không, thay vì để máy tự lệch im lặng.

## Đề xuất

**Lớp A — nếp hành vi, hiệu lực ngay, không chạm kit** (đã ghi trí nhớ dự án,
file `loi-moi-cong-phai-ky-duoc-ngay`):

1. **Lời mời cổng chỉ phát khi ký-được-ngay.** Trước khi in lời mời: gap-probe
   đã định đoạt, thẻ render sạch, `--extract` khớp file. Mời khi chưa sẵn sàng
   = đốt một lần xuất hiện của người.
2. **Lệnh in ra: tên đầy đủ + câu gộp điền sẵn khuyến nghị**, chừa đúng chữ
   quyết định («Ký»/«Duyệt») cho người. Bằng chứng ngay trong phiên: lời mời
   không điền sẵn → 2 lượt (#4+#5); khối «trả lời mẫu» có dòng khuyến nghị →
   owner gửi 1 lượt xong.
3. **Mốc phát hành T2 đi làn V ở Cổng Phạm vi** theo tiền lệ 2.5.0 — người
   xuất hiện MỘT lần, ở Cổng Bằng chứng, nơi chữ ký thật sự mang trách nhiệm.
4. **Câu hỏi thật đứng trước ô hình thức.** Một lượt cổng có N ô mặc-định-hợp-lý
   và một quyết định thật thì trình quyết định thật; đừng chôn nó.

**Lớp B — hạt giống kit-level, chờ owner gọi tên** (luật Giới hạn CHIỀU RỘNG:
không tự mở vòng meta; ghi sổ ở đây là đường mặc định):

- (a) Bộ đọc Ngoài-hợp-đồng **fail-quiet**: mục có chữ mà 0 finding parse được
  → phải cờ vàng, không im lặng (vòng này nó im — người suýt ký mà không thấy
  khuyết tật trên thẻ).
- (b) Trường `Đề xuất` gặp token lạ → cờ vàng thay vì «máy chưa đề xuất hướng
  nào».
- (c) Thẻ xếp nhầm cột SẼ/KHÔNG-làm vì dò chữ «không» trong vế Then — dính cả
  2.5.0 lẫn 2.6.0.
- (d) Thẻ in sẵn **câu gộp khuyến nghị bấm-được** ngay trong khối «VIỆC CỦA
  ANH» — vá lớp lời mời tại nguồn thay vì trông vào trí nhớ hành vi.
- (e) Ngữ pháp danh tính: hai nguồn khớp tuyệt đối → bỏ lượt Enter-xác-nhận
  (hợp thức hoá điều phiên này đã làm de-facto).

Bài kiểm North Star tự khai cho lớp B: mỗi mục đều TRỪ lượt người hoặc TRỪ một
đường fail-quiet; không mục nào thêm cổng mới.
