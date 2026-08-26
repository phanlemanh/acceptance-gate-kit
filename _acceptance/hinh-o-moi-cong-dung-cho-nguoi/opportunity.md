---
schema_version: 1
slug: hinh-o-moi-cong-dung-cho-nguoi
feature: Nghi thức hình áp cho MỌI cổng dừng-chờ-người — không riêng Cổng Phạm vi; mở nguồn kê sang vật của vòng nghiệm thu và điểm dừng-vá
owner: phanlemanh@gmail.com
stage: discovery
decision: 
decided_by: 
decided_at: 
prototype:
  base_commit: 
  disposition: archive
---

## Vấn đề & ai gặp

Luật N5 của bản luật ngôn ngữ mặt người áp cho **mọi** thứ trình cho người
quyết: điểm quyết định có từ ba bước nối tiếp hoặc từ hai nhánh rẽ thì **bắt
buộc** kèm hình. Nhưng **nghi thức thi hành** — khối năm bước «kê · đếm · vẽ ·
nhìn · đính» — chỉ cắm ở MỘT chỗ: nó nằm trong mục Cổng Phạm vi của vòng lặp
(`feature-loop/skills/feature-loop/SKILL.md`, khối `### Hình tại điểm quyết
định`), và tự khai phạm vi hẹp theo ba cách:

1. Điều kiện chạy viết theo trạng thái dừng-chờ **của Cổng Phạm vi** («T3, hoặc
   T2 không đủ điều kiện đi tiếp ở trạng thái V»).
2. Bước [1] kê nguồn từ **artifact cuối S1** (sổ quyết định chờ đóng dấu · dòng
   `[GIẢ ĐỊNH]` trong Coverage · finding gap-probe) — không một nguồn nào của
   vòng nghiệm thu.
3. Mục **Cổng Bằng chứng** và điều khoản **dừng-vá** không có một chữ nào về
   hình — máy không được ai bảo vẽ ở đó.

Người trả giá: **owner**, tại đúng những cổng đắt nhất. Bằng chứng thực địa —
phiên `dac-ta-ux-vat-hoa-cau-truc` (24/08, bảy vòng nghiệm thu): owner phải
quyết **bốn lượt vượt ngưỡng N5 mà không có hình nào**:

| Lượt | Chọn giữa | Nhánh |
|---|---|---|
| sau vòng 2 — dừng-vá | đổi khuôn · thu phạm vi · ship kèm giới hạn | 3 |
| sau vòng 3 | sửa nốt · thu phạm vi · ship | 3 |
| sau vòng 5 | cắt nốt · sửa · ký | 3 |
| Cổng Bằng chứng | chạy · ép; rồi phán hai mục máy không chắc | 2+2 |

Ba hình cuối phiên chỉ tồn tại vì **owner tự đòi**, không vì luật ép. Đây là
lớp «ô nuốt luật» (`docs/findings/2026-08-15-khuon-nuot-luat-hai-ho-luat.md`):
luật có, nhưng không đỏ được — thiếu hình thì không cờ, không dòng ghi chú,
owner không biết mình lẽ ra được xem một sơ đồ.

Cổng càng về sau, quyết định càng khó đảo: Cổng Phạm vi sai thì sửa vài dòng
chữ; dừng-vá sai thì mất mấy vòng máy; Cổng Bằng chứng sai thì ra tới người
dùng. **Hình đang được ép ở chỗ rẻ nhất và vắng ở chỗ đắt nhất.**

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Nghi thức năm bước dùng lại được nguyên vẹn cho cổng khác, chỉ cần đổi NGUỒN KÊ | phải viết nghi thức thứ hai → CỘNG bộ phận, trái «chỉ TRỪ không CỘNG» | chạy tay năm bước đó cho một lượt dừng-vá thật, xem có bước nào vô nghĩa không | Thử một phần 24/08: ba hình cuối phiên vẽ đúng bằng năm bước đó, cho vật của vòng nghiệm thu |
| 2 | Vật của vòng nghiệm thu kê được thành «điểm quyết định» máy-đọc (mục máy không chắc · mục ngoài phạm vi · lần dừng-vá) | bước [1] thành phán đoán ngữ nghĩa → máy kê sót tuỳ hứng | đếm tay trên 3 hồ sơ đã ký: số điểm kê được vs số lượt owner thật sự phải quyết | Chưa thử |
| 3 | Thêm hình ở cổng sau KHÔNG thành trạm thu phí — vì cổng đó vốn đã dừng chờ người | mỗi vòng máy tốn thêm một lượt vẽ cho hình không ai đọc | đo giờ máy vẽ + hỏi owner có dùng hình để quyết không, trên một ván thử | Chưa thử |
| 4 | Sửa được bằng ĐỔI LỜI một chỗ có dấu mốc + trỏ về, không cần công cụ mới | thành ô lớn, phải cân lại | đọc thử: khối hiện tại có đủ tổng quát để trỏ về từ hai chỗ không | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: Trên MỘT vòng tính năng thật đi trọn, mọi lượt dừng
  chờ người vượt ngưỡng N5 có kèm hình không — đo bằng số lượt vượt ngưỡng vs
  số lượt có hình, và owner có dùng hình để quyết không.
- Kết quả nào là SỐNG: mọi lượt dừng-chờ-người vượt ngưỡng đều có hình (tỷ lệ
  100%), hoặc có dòng khai tường minh vì sao không vẽ; owner xác nhận đã quyết
  TRÊN hình ở ≥1 lượt ngoài Cổng Phạm vi; giờ máy vẽ mỗi lượt dưới trần khai ở
  S1; feature không vượt ngưỡng nào: 0 hình, 0 cờ.
- Kết quả nào là CHẾT: một lượt vượt ngưỡng đi qua im lặng không hình không cờ
  (ô nuốt luật tái diễn); HOẶC owner nói hình ở cổng sau không giúp gì cho
  quyết định; HOẶC phải viết nghi thức thứ hai thay vì dùng lại khối sẵn có.
- Timebox: vòng tính năng chạm-nhiều-cổng kế tiếp của kit, muộn nhất
  2026-10-15; tới hạn chưa có vòng nào chạy trọn → `decision: park`.

## Kết quả prototype

Chưa dựng. Ván thử tự nhiên = vòng tính năng kế tiếp có ≥1 lượt dừng-vá hoặc
≥1 mục máy-không-chắc ở Cổng Bằng chứng. Tiền lệ đã có: ba hình
`_acceptance/dac-ta-ux-vat-hoa-cau-truc/figures/` (24/08) vẽ bằng đúng nghi
thức năm bước cho vật của vòng nghiệm thu — chứng minh cơ chế chạy được, chỉ
thiếu chỗ khai.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Nghi thức năm bước kê·đếm·vẽ·nhìn·đính | khối `### Hình tại điểm quyết định` trong chính kit | triết-lý/logic | có — dùng lại nguyên, đổi nguồn kê | — |
| Luật N5 + bảng tra mặt phẳng vẽ | `skills/acceptance/references/human-facing-language.md` (một nguồn) | triết-lý/logic | có — không sửa luật, chỉ mở chỗ thi hành | — |
| Ba tầng tuổi thọ của hình + colophon | `docs/reference/DIAGRAM-RULE.md` | triết-lý/logic | có | — |

## Cổng 0

- **decision = …** Căn cứ: …
- **disposition = …** Căn cứ: …
- **Ngưỡng UAT chốt cùng lúc ký:** …

## Thước đo thành công → ứng viên criterion

- Tỷ lệ lượt-dừng-chờ-người **vượt ngưỡng N5** có kèm hình — đích 100%
  (hoặc có dòng khai vì sao không).
- Số lượt vượt ngưỡng **đi qua im lặng** (không hình, không cờ) — đích 0; đây
  là thước của chính lớp «ô nuốt luật».
- Số nghi thức hình kit phải nuôi — đích **1** (dùng lại, không đẻ bản thứ hai).
- Giờ máy vẽ mỗi lượt — dưới trần khai ở S1.

## Out of scope từ khám phá

- Không sửa luật N5 và không đổi ngưỡng đếm — luật đúng rồi, chỗ hỏng là thi hành.
- Không viết nghi thức hình thứ hai — dùng lại khối sẵn có, trỏ về một nguồn.
- Không thêm công cụ vẽ, không đổi bộ vẽ đang dùng.
- Không ép hình cho lượt dừng-chờ **dưới** ngưỡng — hình không ai đọc là giờ-kit
  vứt đi (câu này đã có sẵn trong nghi thức, giữ nguyên).
- Không đưa hình vào chuỗi bằng chứng — hình là chiếu của chữ, S4 vẫn đo vật thật.
