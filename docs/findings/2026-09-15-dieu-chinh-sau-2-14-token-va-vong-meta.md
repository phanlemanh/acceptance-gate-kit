# Điều chỉnh sau 2.14.0 — token, vòng meta, và cửa sổ 2.14 → 2.15

> Owner hỏi 15/09: *kit đã 2.14.0, phiên «Token consumption optimization» còn chạy —
> phân tích và đề xuất điều chỉnh.* Mọi số dưới đây đọc từ hồ sơ mốc và từ chính
> phiên đó; không số nào ước.

## 1. Số — ba cửa sổ đặt cạnh nhau

| | 2.11 → 2.12 | 2.12 → 2.13 | 2.13 → 2.14 |
|---|---|---|---|
| Vòng meta ký | 2 | **1** (`khoi-tim-loi-tra-phi-theo-vat`) | **2** (`do-tin-tram-phan-loai` · `chu-ky-khong-tu-lam-hoa-cu`) — vượt luật (b) |
| Token cửa sổ | 212,3 M (hoá đơn mốc) | — | **≈ 199,9 M** cho hai vòng meta |
| Lượt gọi người/vòng (trần 3, T3 4) | — | **4** (1 trong · 3 ngoài) | **5 · 5** |
| Lượt chấm bị hạ tầng kit đốt | — | 1 (BLOCKED lượt 1) | **2/6** ở vòng thứ hai |
| Khối tìm-lỗi trong S4 (lượt PASS) | 83 % (đo 10–14/09) | **79,9 %** | **75,4 %** (vòng A) · 19,9 % (vòng B — `runBaseline` nuốt) |
| Vòng **sản phẩm** ở repo tiêu thụ trên kit ≥ 2.12 | 0 | 0 | **0** — cả 4 repo đã ở 2.14.0, chưa repo nào chạy vòng |

Spec token hứa khối tìm-lỗi về **≈ 46 %**. Ba mốc: 83 → 79,9 → 75,4. Nhát cắt
**chưa ăn** — và không thể biết nó có ăn hay không, vì spec tự khai *«số sau đến từ
kho tiêu thụ, không từ S4 của chính vòng này»*, mà kho tiêu thụ chưa có vòng nào.

Chiến dịch ghim lại: **70** hồ sơ tụt pin; lượt ĐO 4/69 → **18/43 eval đỏ (42 %)**,
làn dừng, không ghi gì. Hồ sơ mốc kết luận đúng: *«ở dạng hiện tại KHÔNG chạy được,
không phải đắt»*.

## 2. Chẩn đoán — ba câu

1. **Kit đang đo thước bằng thước.** Mọi số «token/vòng» ba mốc qua đều đo trên vòng
   meta của chính kit; vòng meta bị đốt bởi *thước của chính nó* (2.14: bốn lượt đầu
   của một vòng đỏ vì thước, vật xanh 7/7 từ lượt 1). Đây là hình dạng (a) của giới hạn
   chiều rộng — «bộ đo được máy kiểm MỘT tầng» — tái diễn ở tầng cửa sổ.
2. **Luật (b) không giữ được khi hai phiên song song mở vòng.** Mỗi phiên tự thấy
   mình là «vòng meta duy nhất»; con số chỉ lộ khi mốc đếm. Không phải lỗi phiên nào —
   không có vật máy giữ nào đếm số vòng đang mở trong cửa sổ.
3. **Giá trị chạm người dùng = 0 trong hai cửa sổ.** North star đo *sản phẩm đến tay
   người dùng nhanh hơn*; 412 M token gần nhất đi vào kit, không vào sản phẩm.

Điều kiện thu hồi luật nới (vượt trần hai mốc liên tiếp) **đã chạm** ở 2.13 + 2.14;
owner đã xử sáng 15/09 bằng ADR 0018 (CỘNG phải phê duyệt đích danh). Đây không phải
việc mới — ghi để kế hoạch dưới đứng trên nó.

## 3. Đề xuất cửa sổ 2.14 → 2.15 — «đo ở nơi có neo ngoài trước»

**R (khuyến nghị): 0 vòng meta mới. Đo cái đã ship trên một vòng sản phẩm thật.**

| # | Việc | Chạm engine? | Người thấy gì |
|---|---|---|---|
| R1 | Chạy **một vòng sản phẩm** ở repo tiêu thụ đang có việc thật (OneFlow B5 `skill-system-v1` ★, hoặc hàng kế của crm-onehub) trên kit 2.14.0; `wf-usage` đủ mỗi lượt; đọc dòng 4/4b/5 **ở đó** | không | lần đầu có số «sau» thật của nhát T1–T7; và một tính năng tới tay người dùng |
| R2 | Vá-trong-mốc (tiền lệ 2.11.0) hai mục T1 của 2.14 §4: **#3** lệnh cổng in dòng trần · **#2** `wf-usage` kêu khi không chạy (CỘNG nhỏ → owner phê đích danh, ADR 0018) | rất nhỏ | hai lượt gọi người chết/mốc biến mất; dòng 4 không còn hỏng lặng |
| R3 | Chiến dịch ghim lại: **không chạy dạng hiện tại**. Khai 70 hồ sơ tụt pin là *sử liệu chấp nhận được giữa hai mốc* (đúng CLAUDE.md §re-pin); CI đã chỉ chặn hồ sơ trong diff. Ghim lại theo diff (cut #4) chờ đủ điều kiện | không | không ai mất 12 phút/lượt cho pin cũ nữa |
| R4 | Ba ô meta đang xếp hàng — `nha-tai-lieu-router` · `bo-qua-phai-thay-dinh-nghia-phep-do` (draft) · `mot-nguon-usage-report` (phiên token đang mở) — **giữ ở discovery/draft**, không mở vòng nào trong cửa sổ | không | — |

Điều kiện mở **một** vòng meta ở 2.15 → 2.16, đọc từ R1: có dòng 4b ở kho tiêu thụ.
Nếu tìm-lỗi **> 60 %** → vòng token kế (đề bài từ 2.14 §4 #8, «50 M mà tìm-lỗi 19,9 %» phải
tách số trước); nếu **≤ 60 %** → **router**, vì nó là tiền đề lát A và cấp vùng vật cho S4.
`bo-qua-phai-thay` đi cùng mốc như vá-trong-mốc nếu owner phê (3 AC, T2, draft sẵn).

**A (nếu owner muốn đúng một vòng meta ngay):** `bo-qua-phai-thay-dinh-nghia-phep-do` —
nhỏ nhất, hồ sơ đã trên main, sửa một lỗ *đúng/sai* chứ không phải tối ưu; và R1 vẫn
chạy song song ở repo tiêu thụ. Không phải router, không phải `mot-nguon-usage-report`.

## 4. Vật máy giữ cho luật (b) — đề nghị ghi hạt giống, không mở

Một dòng trong thẻ start: `vòng meta đang mở trong cửa sổ: N` — đếm hồ sơ kho kit có
`status ∉ {signed-off, machine-cleared}` sinh sau mốc gần nhất. N ≥ 2 → cờ. Không cổng,
không lệnh; biến «tối đa một» từ lời dặn thành số trên thẻ. Hạt giống, chờ cửa sổ có chỗ.

## 5. Câu chỉ owner trả lời

**Chấp nhận một cửa sổ 0 vòng meta mới không?** Đánh đổi thật: *kit tốt lên nhanh*
(nhiều ô đã chín, phiên đang chạy còn đà) ↔ *sản phẩm ship* (0 tính năng tới tay
người dùng hai cửa sổ qua). Khuyến nghị **R**. Trả lời một chữ; máy dịch thành hồ sơ.

## Trạng thái

Viết 15/09 sau khi 2.14.0 ký. Chưa hành động. Phiên «Token consumption optimization»
đang chạy trên cùng cây (mở ô `mot-nguon-usage-report`, sửa dở `PRODUCT-MAP.md`) — file
này không chạm gì của phiên đó.
