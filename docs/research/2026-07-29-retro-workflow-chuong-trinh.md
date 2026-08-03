# Retro chương trình — workflow discovery→đóng gói (27→29/07/2026)

*Retro GIỮA chương trình (checkpoint trước Pha 3), tầng trên của
[retro vòng r1](2026-07-29-v1-retro-bai-hoc.md). Đối tượng: bản thân workflow
và quá trình thiết kế nó — không phải feature. Nguồn: hội thoại maintainer
27→29/07, [spec draft](../specs/2026-07-27-discovery-gate0-design.md),
[plan rollout](../plans/2026-07-27-discovery-gate0-rollout.md), số liệu V1.*

## 1. Ý định gốc vs nơi đã đến

| Ý định ban đầu (27/07) | Nơi đến (29/07) |
|---|---|
| Phân tích pm-skills, chọn nhóm skill phù hợp brownfield | Xong — nhưng thực tế nghiệm thu lại: chỉ **2 skill sống qua tiếp xúc** (product-management:brainstorm 7 lượt, strategy-red-team 1 lượt); 7/8 plugin đã gỡ theo số liệu invoke |
| Hai giai đoạn: chọn-feature→prototype, prototype→ship | Thành hình + **kiểm chứng bằng V1** (DP-1 GO); prototype đổi vai 2 lần (đo lường → hội tụ ý định) theo 2 pivot của owner |
| Tài liệu chính cho Claude đọc + người quyết | Chuỗi artifact 2 tầng chạy thật: opportunity → contract → evidence; visual-first (mermaid + artifact sống) thành chuẩn trình duyệt |
| Đóng gói nhân rộng + chia sẻ cộng đồng | Phương pháp đã chốt (nhật ký can thiệp = spec); nội dung đóng gói CHƯA xây (Pha 3 trở đi) |

## 2. Thành phần workflow: đã kiểm chứng vs còn là giả thuyết

| Thành phần | Trạng thái |
|---|---|
| Tách khám phá/giao hàng + opportunity.md làm cầu | ✅ **Kiểm chứng** — DP-1 GO 3/3, biên độ rộng |
| Cổng 0 (số phận cơ hội + số phận code) | ✅ Dùng thật (build + archive); bảng nợ kế thừa chưa được dùng — r2 sẽ là lần đầu |
| Red-team tách phiên khỏi brainstorm | ✅ Đổi đối tượng prototype đúng lúc |
| Phép-thử-rẻ trước prototype (D2.5) | ✅ Emergent từ thực tế (schema-probe 8') — chưa thành luật |
| Ngưỡng chết khai trước | ✅ Cứu khỏi sunk cost tại Cổng 0 |
| Kit tự dẫn + nhật ký can thiệp làm spec đóng gói | ✅ Phương pháp chạy từ 29/07 |
| Một mặt phẳng + audit invoke định kỳ | ✅ Số liệu thật, đã dọn 3 tầng nhiễu |
| **Phép đo tại UAT (pivot 28/07)** | ⬜ **GIẢ THUYẾT CHƯA KIỂM — chưa có phiên UAT nào từng chạy.** Toàn bộ triết lý đo của chương trình đang treo trên nó; r2 PHẢI kết thúc bằng một phiên UAT thật |
| Cổng UAT có quyền giết | ⬜ Chưa kiểm |
| C2 prototype bằng component thật | ⚙️ Thiết kế xong; pilot bị repurpose khi Cổng 0 archive — chưa prove |
| design-pass in-harness | ⬜ Thiết kế xong, chưa chạy lần nào |
| discovery-pack (F-C) · funnel report (F-B) · handbook đầy đủ | ⬜ Chưa xây |
| Kênh phản hồi người giữa vòng | ❌ Lỗ phát hiện qua V1 — vào spec v2 |

Đọc bảng này một mắt: **phần khám phá của workflow đã qua lửa; phần đo-sau-build
và phần đóng gói cộng đồng vẫn là bản vẽ.**

## 3. Bài học về CÁCH thiết kế workflow (meta — tầng quy trình)

1. **Probe-trước-đầu-tư đúng.** DP-1 làm cổng cho F-A/F-B giữ toàn bộ đầu tư
   harness đứng sau một phép thử vài buổi — và phép thử trả về cả verdict lẫn
   spec đóng gói cụ thể nhất từng có (nhật ký can thiệp).
2. **Freeze-trong-probe + queue-sửa-một-thể giữ phép đo sạch.** Cám dỗ vá
   protocol giữa chừng xuất hiện ≥3 lần; từ chối được nhờ luật đã khai trước.
3. **Phân tích tĩnh chỉ chọn ứng viên — usage là trọng tài.** Bản phân tích
   pm-skills 15-skill đầu chương trình phần lớn bị số liệu invoke bác trong
   48h. Giá của phân tích vẫn dương (chọn đúng 2 skill sống) nhưng đừng bao
   giờ cài theo phân tích mà không có hạn nghiệm thu bằng usage.
4. **Pivot triết lý giữa chương trình là lành mạnh KHI chưa xây gì nặng.**
   3 pivot trong 3 ngày (đo-tại-UAT · một-mặt-phẳng · plugin-UX-thắng) đều rẻ
   vì mọi thứ còn là văn bản + probe. Nguyên tắc tự phát "quyết trước, xây
   sau" nên thành chủ đích của mọi chương trình sau.
5. **Coaching của maintainer che lỗ kit** (bài B8 retro vòng) — phát hiện
   muộn 2 ngày; phương pháp đúng ra phải chốt từ TRƯỚC probe: vai maintainer
   = quan sát + ghi, không đỡ.
6. **Phân vai session phải khai từ đầu.** Tai nạn giẫm-cây-làm-việc (B7) xảy
   ra vì session maintainer và session run chung repo không khai ranh giới;
   luật một-worktree-một-phiên lẽ ra là tiền đề, không phải bài học.

## 4. Trạng thái hạng mục plan gốc (snapshot 29/07)

G1 ✅ · G2 ✅ (scaffold) · G3 ✅ · V1 ✅ (DP-1 GO chờ ký) · V2/R1 ⏸ hạ ưu tiên
(repo docs dày) · F-A/F-B 🔓 mở khoá khi ký DP-1 · F-C/F-D ⬜ · Đợt 3 (đo sau
ship) ⬜ · Pha 3 gói lưới ⬜ **← kế tiếp** · spec v2 ⬜ (queue ~25 mục đã gom
trong plan).

## 5. Rủi ro chương trình còn mở

1. **Queue spec v2 đã phình (~25 mục)** — nguy cơ big-bang rewrite. Chống:
   Pha 3 chỉ 4 món; phần còn lại đi theo nhịp release có chủ đích (bất biến
   đường-đọc-cũ áp cho chính spec).
2. **Triết lý đo-tại-UAT chưa từng chạy** — nếu r2 ship mà UAT lại trượt lịch
   thì chương trình mất chốt đo cuối. Điều kiện đóng r2 phải gồm phiên UAT.
3. **Đóng gói cộng đồng vẫn là lời hứa** — chưa có repo nào ngoài
   artifact-platform từng tiêu thụ discovery lane; mọi degrade (không design
   repo, không Next.js) chưa kiểm.
