# Ô chỉ mở khi có neo ngoài — thiết kế vòng meta của cửa sổ 2.16 → 2.17

**Ô:** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` (build, Mạnh 18/09) · **số đo:**
`docs/findings/2026-09-18-o-sinh-tu-nghi-thuc-va-gia-cat-so.md` · **hạng:** T2 (không chạm `lib/**`,
`hooks/**`; CLAUDE.md là T1 đi cùng vòng).

## 0. Một đoạn

Kit không dọn chậm, nó dọn thứ tự đẻ ra: 22/35 ô mới trong 10 ngày sinh từ ba nghi thức của chính
kit, và đơn vị kế toán «ô» không có giá âm nên hàng đợi tự nuôi. Owner phát biểu luật: **ô chỉ
được mở khi một kho yêu cầu.** Vòng này biến câu đó thành vật máy giữ ở đúng MỘT chỗ — hàng chờ
Cổng Đáng — bằng một dòng `Gốc:` trong khuôn ô mà một răng CI đọc; đổi hành động của lối «mở hợp
đồng mới» tại Cổng Bằng chứng từ *tạo thư mục* sang *ghi hạt giống*; hạ vế «PHẢI gọi tên chỗ cắt»
của mốc xuống «được phép»; và neo mẫu số của trần vòng meta vào *mốc được kho nhận*. Rà 20 ô
đang chờ theo luật mới ngay trong vòng. Toàn TRỪ hoặc sửa một răng; không bộ phân loại mới.

## 1. Ba hướng đã cân

| hướng | vì sao không / vì sao chọn |
|---|---|
| A. Đặt trần SỐ ô tồn kho (vd ≤15) | Trần bằng đếm là thứ luật 30/08 đã thử ở chiều sâu và bị xả vào sổ khác; con số cứng thành KPI hình thức. Làm ngưỡng đọc, không làm răng. |
| B. Bộ phân loại «phát hiện này có neo không» tại Cổng Bằng chứng | Là CỘNG một bộ phân loại — lớp lỗi đã đốt 2 vòng (memory 01/09). Bỏ. |
| **C. Một dòng `Gốc:` máy đọc + răng đảo chiều ở hàng chờ** | Chọn. Bất biến đầu-người («repo yêu cầu») thành vật-máy-giữ ở một chỗ; phần còn lại là hạ lời và đổi hành động. |

Hai quyết định phụ, ghi sổ: (i) **không đổi tên** lối (b) «mở hợp đồng mới» — chữ người sống ở
`lib/out-of-contract.js` (T3); vòng này chỉ đổi HÀNH ĐỘNG đứng sau nhãn, đổi tên là ô T3 sau nếu
owner gọi; (ii) **«về hạt giống» = `stage: archived` tại chỗ** kèm một dòng lý do — không chuyển
file, không xoá chữ, đường đảo là đổi lại `stage` + thêm `Gốc:`.

## 2. Định nghĩa «neo» — máy đọc được

Dòng `Gốc:` là bullet đầu section «Vấn đề & ai gặp» của `opportunity.md`, khuôn sống ở
`opportunity-template.md` giữa marker `OPP-GOC-LINE`. Hợp lệ khi:

- trỏ tới **một hồ sơ cụ thể** `<kho>/_acceptance/<slug>` (kho có thể là chính kit) **khác slug của
  ô**, hoặc
- nêu **kho + người gọi tên + ngày** (`Gốc: kho <tên> — <người> gọi tên <ngày>`).

Hai dạng là HAI regex đặt cạnh marker, bên viết (khuôn, `start.md`) và bên đọc (VC8) cùng rút.
Không hợp lệ: vắng dòng · rỗng · placeholder chưa điền · trỏ chính ô · văn tự do («suy từ đọc mã»).
Răng KHÔNG kiểm hồ sơ đích có tồn tại ở kho khác — chỉ kiểm hình dạng; giới hạn khai ở hợp đồng.

**Phạm vi răng:** ô ở hàng chờ — `stage: discovery`, và `decided` + `build` chưa có `contract.md`
(gap-probe F3: ô mở thẳng ở decided như chính ô này phải chịu răng, không thì «tự ăn thuốc» là hằng
đúng) — cùng hồ sơ mốc `release-*` chưa `signed-off`. Ô `park`/`kill`/`archived` miễn: sử liệu
không hồi tố.

## 3. Bốn vế — vật nào đổi

| # | vế | bên viết | bên đọc / răng |
|---|---|---|---|
| 1 | Vế «PHẢI gọi tên ≥1 chỗ cắt» → «được phép ghi vào Notes của hồ sơ mốc; chỗ cắt chỉ thành ô khi có `Gốc:`» | `CLAUDE.md` luật (c) | judgment tại Cổng Bằng chứng (văn bản luật là vật) |
| 2 | Lối (b) tại Cổng Bằng chứng: hành động = ghi **hạt giống** `docs/plans/<ngày>-hat-giong-<slug>.md` có dòng `Gốc:` trỏ hồ sơ vòng này + phát hiện; KHÔNG tạo `_acceptance/<slug>/`. Thẻ khuyên «ghi hạt giống có Gốc, chờ kho gọi tên — không mở ô» thay «tách thành một việc riêng» | khối giữa marker `OOC-LOI-B` ở `feature-loop/skills/feature-loop/SKILL.md:276` · `commands/acceptance-card.md:149` · `commands/signoff.md:33` · hằng `MSG_OOC_HAT_GIONG` ở `scripts/gate-card.js:1013` | ca `LB1–LB3` mới: render thẻ với một finding `new-contract` → câu khuyên mới; mutant đổi hằng → đỏ; LB3 rút KHỐI theo marker ở ba tài liệu, đòi câu mới có mặt và câu cũ vắng |
| 3 | VC8 **đảo chiều**: «mọi ô discovery phải có `Gốc:` hợp lệ»; hạt giống mồ côi IM. VC9 mới: mốc chưa ký phải có `Kho chờ nhận:` | `opportunity-template.md` (marker) · `commands/start.md` ⑤ (dặn điền) | `tests/plugins/vao-co-o.test.mjs` VC8 (viết lại), VC9 (mới); chạy trên cây thật + fixture hai chiều |
| 4 | Luật (b): mẫu số = «mốc được một kho tiêu thụ nhận», không phải «mốc cắt số»; mốc chỉ cắt khi có kho chờ nhận, đi làn V | `CLAUDE.md` luật (b)(c) | VC9 (vật) + judgment (lời) |

Rà tồn kho (đi kèm): 20 ô `discovery` thiếu `Gốc:` — ô có ca thật trong thân bài → thêm dòng
`Gốc:` rút từ chính thân bài; ô không có → `stage: archived` + một dòng «về hạt giống 18/09 — chưa
kho nào gọi tên; mở lại = thêm Gốc + stage discovery». Danh sách và quyết từng ô nằm trong commit
S3, thẻ Cổng Bằng chứng in số.

## 4. Không gian quét (CT-S) — nguồn sinh × trạng thái

Trục A *nguồn sinh ô* (thước CE: cột «nguồn sinh» của finding §3, đếm trên 35 ô thật): mốc phát
hành · Cổng Bằng chứng lối (b) · hạt giống→VC8 · gộp/dọn · vòng meta tự mở · kho tiêu thụ · owner
gọi tên. Trục B *trạng thái ô* (thước CE: giá trị `stage`/`decision` của khuôn): discovery ·
decided-build · park · kill · archived · release-mở · release-ký.

Core: mọi nguồn × `discovery` cần `Gốc:` (VC8) · `release-mở` cần `Kho chờ nhận:` (VC9) · lối (b)
đổi hành động (LB). Later: `decided-build` không neo (chữ ký là neo — nếu ngưỡng CHẾT nổ thì
xét). Never: park/kill/archived (đã đóng; hồi tố là sửa sử liệu) · `release-ký` (grandfather).
Cross-cutting: đường đọc-cũ — ô/mốc đời trước không có dòng → răng chỉ đỏ ở phạm vi Core.

## 5. Đọc-cũ, hai chiều, tin cậy

- Đọc-cũ: 45 ô không `Gốc:` hôm nay; răng chỉ áp `discovery` + mốc chưa ký → sau rà, cây thật xanh;
  hồ sơ `decided`/`archived` không phải sửa.
- Hai chiều mỗi răng mới: fixture code-sinh từ khuôn (`fileFromTemplate` + marker), đối chứng
  dương · phá (bỏ dòng Gốc / trỏ chính mình / bỏ Kho chờ nhận) → đỏ ghim slug · chiều im (hạt giống
  mồ côi; ô park không Gốc; mốc đã ký không Kho) → im.
- Dự báo năm dòng số cho cửa sổ kế (↑↓=): 1 = · 2 ↓ (mỗi ô ít hơn = một Cổng Đáng ít hơn) · 3 = ·
  4 ↓ (mốc làn V: 0 lượt chấm) · 5 ↓. Điều kiện tin cậy: đường verdict không đổi thành phần.

## 6. Ngoài phạm vi (có tên)

Đổi tên lối (b) trong `lib/out-of-contract.js` (T3) · răng kiểm hồ sơ đích tồn tại ở kho khác và
tên kho ở `Kho chờ nhận:` có thật (kit không chứa danh mục kho — gap-probe F2) · thẻ Cổng Đáng in
dòng Gốc (không bề mặt mới) · trần số ô cứng. Khuôn hồ sơ mốc riêng vẫn không dựng: dòng `Kho chờ
nhận:` sống trong `contract-template.md` (khuôn hợp đồng chung) giữa marker, mốc là hợp đồng.
