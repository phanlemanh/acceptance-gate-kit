# Lái-thử người-lạ — VÁN 1 (biến thể mặt agent) trên `mcp-cost-guard`

*2026-08-13 · Pilot của [đề bài 13/08](../plans/2026-08-13-de-bai-lai-thu-nguoi-la.md).
Owner yêu cầu chạy thử ngay trên `mcp-cost-guard` (kho tiêu thụ floorplanstudio).*

## 0 · Lệch khỏi đề bài — khai trước, chờ owner veto

Đề bài viết cho **mặt UI**. `mcp-cost-guard` khai `surfaces: [api]`, và cả
floorplanstudio Spec 1 **không có UI** (`capture: {}` — *"chưa có UI evidence ở
Spec 1"*). Nghi thức nguyên bản không chạy được.

Đã chạy **biến thể mặt agent**: người dùng thật của sản phẩm này là agent gọi
MCP, nên người-lạ tương ứng là một **phiên Claude sạch**. Giữ nguyên mọi kỷ
luật của đề bài, đổi mỗi mặt:

| Kỷ luật đề bài | Bản UI | Bản agent (ván này) |
|---|---|---|
| Ngữ-cảnh trắng | phiên fresh, profile trắng | subagent fresh; **không được cấp đường dẫn kho** → cấm-đọc-source có răng cấu trúc, không phải lời hứa |
| Tri-giác tự trói | pixel-only, cấm DOM | chỉ `tools/list` + phản hồi tool; cấm đọc mã |
| Kiên-nhẫn hữu hạn | 12 bước / 5 phút | 12 lệnh gọi / 5 phút mỗi mục tiêu |
| Không phán giá-trị | ghi «Chuyển phiên người» | y nguyên |

Cầu nối: script stdio JSON-RPC dựng trong scratchpad (không đưa vào kho sản phẩm).

## 1 · Kết quả — đi trọn 3/3 mục tiêu

**CHẶN 0 · LẠC 1 · KHÓ-CHỊU 2 · VẶT 1** (+1 vấp do phiên điều phối tự dẫm, §2.5).
Ngân sách dùng: 3/12 · 5/12 · 1/12 lệnh gọi. Không mục tiêu nào cạn ngân sách.

### 2.1 · [LẠC] Chẩn đoán từ chối không nói trần — người lạ phải dò nhị phân

Đòi nhiều phương án cho căn ~13 phòng: `count` 20 → 10 → 7 đều bị
`REQUEST_TOO_EXPENSIVE`; lùi về 5 (đúng **giá trị mặc định**) mới chạy. Ba lượt
phí.

**Đo lại trên vật (phiên điều phối):** `count=6` **CHẠY ĐƯỢC** (13 × 6 = 78 ≤ 80),
`count=7` bị chặn (91 > 80). Nghĩa là trần thật là 6 — người lạ ra về với 5.
**Chi phí thật của thông điệp mờ: mất một phương án + ba lượt gọi phí.**

Thông điệp hiện tại:
> Yêu cầu vượt quá ngân sách tính toán cho phép (số phòng × số phương án quá
> lớn) — **không được thực thi để tránh chặn event loop**.

Hai lỗi trong một câu: (a) không nêu trần cụ thể dù trần **tính được** tại chỗ
bắn; (b) *"chặn event loop"* là tiếng máy nói vào mặt người dùng — kiến trúc sư
dùng sản phẩm này không biết event loop là gì (vi phạm luật ngôn-ngữ-mặt-người
của chính kit).

**S4 có bắt được không? KHÔNG.** Eval của vòng đã ký chỉ ghim:
`expect(diag?.messageVi.length).toBeGreaterThan(0)` — tức *"thông điệp khác
rỗng"*. Đây đúng lớp lỗi kit đã ghi 6 vòng: **đo từ vựng thay vì đo quan hệ**.
Lời hứa với người dùng là *"chẩn đoán tức thì thay vì 36 giây im lặng"* (bối
cảnh contract), nhưng thước chỉ đếm độ dài chuỗi. Không AC nào (AC-1…AC-10) hỏi
thông điệp có **dùng được để đi tiếp** không.

### 2.2 · [KHÓ-CHỊU] Phòng ngủ phụ chỉ vào được qua phòng ngủ chính

Phương án trả về có phòng ngủ phụ 10,5 m² láng giềng chỉ gồm ngủ-chính + WC
master, không có lối ra hành lang — người lạ xác nhận lại bằng mắt trên ảnh
xuất. Với căn hộ Việt Nam đây là khiếm khuyết bố trí thật, không phải khẩu vị.
Bất biến hình học của core xanh (không chồng lấn, kín…) nhưng **không có bất
biến nào về đi-lại-được**.

### 2.3 · [KHÓ-CHỊU] "Gửi cho người khác xem" trả path máy chủ + base64 thô

`export_floorplan` trả đường dẫn tuyệt đối trên máy chủ
(`/Users/…/out/….png`) + chuỗi base64 ~122KB. Người lạ không có cách nào dùng
ngay. Đây là mục tiêu 3 — *chia sẻ* — nên là đích của tính năng, không phải rìa.

### 2.4 · [VẶT] Nhãn "WC master" và "Hành lang" đè chữ lên nhau trong PNG xuất

Đáng nói vì đây chính là ảnh đem đi gửi.

### 2.5 · [thêm] Schema quảng cáo 15 loại phòng, runtime từ chối 2 loại

Phiên điều phối tự dẫm khi dựng ca đo: `inputSchema` liệt `foyer` và `hallway`
trong enum `type`, nhưng gọi thì bị từ chối — *"phòng tự sinh (auto-derived) —
không thể yêu cầu trực tiếp"*. Hợp đồng quảng cáo ≠ hợp đồng thi hành. Hai
người-lạ độc lập (subagent + phiên điều phối) cùng vấp một chỗ → không phải xui.

## 3 · Vết kỷ luật

- **1 lần phá luật, tự khai:** người-lạ chạy `ls` lên thư mục `out/` của sản
  phẩm sau khi **chính phản hồi tool làm lộ đường dẫn tuyệt đối**. Đáng chú ý:
  cám dỗ phá rào do sản phẩm tạo ra, không do người-lạ thiếu kỷ luật — bản thân
  nó là dữ liệu cho §2.3.
- Ngân sách bỏ-cuộc chưa lần nào chạm trần → ván này **chưa kiểm được** cơ chế
  bỏ-cuộc (hạng #13). Còn nợ.

## 4 · Đối chiếu thước §5 của đề bài — KHÔNG hạ thước

Thước viết trước: *"≥1 CHẶN hoặc ≥2 LẠC sau 2 ván → codify; 0 sau 2 ván → đóng
vào `.out-of-scope/`"*.

**Ván 1: 0 CHẶN, 1 LẠC.** Chưa chạm ngưỡng — và ngưỡng đếm theo **2 ván**, nên
ván này KHÔNG kết luận gì. Ghi nguyên trạng, không diễn giải "3 KHÓ-CHỊU cũng
đáng kể" để kéo cho đủ: hạ thước cho vừa vật là lớp lỗi kit đã ghi sổ.

**Một câu hỏi thật cho owner:** ngưỡng §5 viết cho nghi thức **UI**; ván này
chạy trên **mặt agent**. Nó có tính là ván 1 không, là quyết định của owner —
máy không tự trả lời.

## 5 · Việc phát sinh cho kho sản phẩm (KHÔNG làm trong ván này)

Bốn phát hiện §2.1–§2.5 thuộc floorplanstudio, không thuộc kit. Không tự sửa:
`mcp-cost-guard` đã ký, sửa nó là mở vòng mới ở kho khác. Định tuyến là việc
owner.
