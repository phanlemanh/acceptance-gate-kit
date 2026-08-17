# Mối nối Vòng TRAO — nối lái-thử người-lạ và hai mối nối S0/S5 vào Workflow v2

*Design doc hồ sơ `moi-noi-vong-trao` · T2 · 2026-08-17 · owner gật kiến nghị
sau rà soát North Star cùng ngày (đảo thứ tự: ván thật refine-editor chạy song
song ở máy B, hồ sơ này thu gọn theo phần đứng vững).*

## 1. Vì sao (trace nguyên tố + người hưởng)

- **Nguyên tố 2 — bằng chứng không tự dối.** Điều kiện vào phiên nghiệm thu
  «sản phẩm bấm được» hiện là *lời khai*; nhật-ký-vấp của phiên máy ngữ-cảnh-
  trắng biến nó thành *bằng chứng*. Người hưởng: người dự nghiệm thu (phút của
  họ không cháy vì build vấp) và owner (không tự ngồi bấm trước khi mời người).
- **Nguyên tố 1 — ý định chốt trước.** Ngưỡng nghiệm thu khai ở Cổng Đáng
  phải *nhìn thấy* ở Cổng Phạm vi (luật lồng #2 của spec: thước của nhịp khai
  tại thì QUYẾT của nhịp cha). Người hưởng: người duyệt tiêu chí.
- Hai mối nối S0/S5 hôm nay do **trí nhớ phiên** giữ (spec §2.4 tự khai «định
  tuyến là quy ước người/model đọc hồ sơ»); vòng đường A ship xong biến mất
  khỏi mọi thẻ. Đây là lớp lỗi «skill chờ được gọi sẽ chết lúc bận».

## 2. Cái KHÔNG làm (từ rà soát 17/08 — ghi để khỏi bàn lại)

| Bỏ | Vì sao |
|---|---|
| Trường `route:` trong hợp đồng | bản sao đồng bộ của «có/không hồ sơ cơ hội» — vi phạm MỘT cây nguồn; A/không-A suy khi đọc |
| Câu Notes «không giả định giá trị mới» máy tự ghi | máy điền lời khai của người (lớp mồi-dán-đồng-ý, chip ②); thẻ chỉ nói *sự kiện* |
| Gạch §5 đề bài lái-thử | lời owner 13/08 nói về giá trị lái-thử, không cấp phép sửa engine; ván 2 = refine-editor |
| Chặn CI khi ngưỡng↔Notes mâu thuẫn | chưa đường A nào chạy trọn; chốt cứng không có ai để chặn (measure-teeth) |
| Sửa `lib/**` | luật A/không-A đã có ở `usesOpportunity`; thẻ đọc lại — thêm hàm chỉ để in một khối là nâng hạng T3 vô cớ |

## 3. Cái làm — sáu mảnh, mỗi mảnh một câu «máy suy · người thấy · đọc-cũ»

### 3.1 Thẻ Cổng Phạm vi in ngưỡng nghiệm thu (`scripts/gate-card.js`)

Máy suy: `opportunity.md` cùng thư mục có → rút section `Ngưỡng chết / ngưỡng
UAT` (dùng `lib/md-section.cjs` sẵn có; tên section đọc từ hằng số một chỗ,
khớp khuôn `opportunity-template.md` — case round-trip). Người thấy, ba trạng thái:

| Hồ sơ | Thẻ hiện |
|---|---|
| có cơ hội, section có nội dung | khối «Ngưỡng nghiệm thu (đã khai ở Cổng Đáng)» + dòng nguyên văn + «vòng này sẽ có phiên nghiệm thu sau khi giao» |
| có cơ hội, section rỗng/thiếu | cờ vàng «hồ sơ cơ hội chưa khai ngưỡng — chưa biết vòng này sẽ đo bằng gì» |
| không có cơ hội | một dòng sự kiện «không có hồ sơ cơ hội → ship thẳng, không phiên nghiệm thu» (không cờ) |

Đọc-cũ: hồ sơ cũ không cơ hội = hàng 3, không lỗi. `--extract` thêm khối
`uat_threshold: {opportunity_present, section_present, lines}`.

### 3.2 `uat-session` §0 đọc nhật-ký-vấp (SKILL text — hành vi)

Điều kiện «sản phẩm bấm được» đổi từ lời khai sang bằng chứng: đọc
`_acceptance/<slug>/stranger-drive.md` frontmatter khoá `chan`:
- `chan: 0` **và** `slug` khớp slug phiên **và** `ran_at` không cũ hơn
  `verified_at` của `evidence-report.md` → thoả *bằng bằng chứng*; nói một
  dòng (ván nào, biến thể nào). Ba vế cùng lúc — nhật-ký của vòng khác hay
  của build trước lần chấm cuối không được tính (gap-probe F2: «máy tin nhầm
  chính nó» đúng lớp hồ sơ này chống).
- `chan > 0` → DỪNG, nêu vấp CHẶN, và **chỉ đường quay lại**: chạy lại lái-thử
  cho CHẶN về 0 — sửa là việc của vòng, nhưng phiên phải nói bước kế (≥2 lối
  ra sống).
- vắng · không đọc được frontmatter · `slug` lệch · `ran_at` cũ → **cờ vàng
  nêu lý do có tên, không chặn** (veto-default): «chưa lái-thử» / «không đọc
  được» / «nhật-ký của vòng khác» / «nhật-ký cũ hơn bản chấm».
Và §1: khi có nhật-ký, chép các câu «Chuyển phiên người» vào khối chấm kín làm
câu gợi — máy dọn bàn, người chấm.

### 3.3 Khuôn nhật-ký-vấp (`skills/acceptance/references/stranger-drive-template.md`)

Mặt máy (frontmatter, khối `STRANGER-FRONTMATTER-TEMPLATE`): `schema_version ·
slug · ran_at · variant (ui|agent) · chan · lac · kho_chiu · vat ·
chuyen_phien_nguoi` + mặt người: mục tiêu · bảng vấp · chuyển phiên người ·
bằng chứng. §0 của uat-session gọi đúng tên khoá này — case round-trip rút
khoá từ khuôn, đối chiếu SKILL. Đề bài `docs/plans/2026-08-13-…` giữ nguyên
làm sử liệu; `docs/lai-thu-nguoi-la.md` trỏ tới khuôn.

### 3.4 feature-loop S5 bàn giao (SKILL text — hành vi)

Sau PR: có `_acceptance/<slug>/opportunity.md` → in ĐÚNG MỘT DÒNG «đã giao
sau cờ · bước kế: lái-thử người-lạ (docs/lai-thu-nguoi-la.md) rồi phiên nghiệm
thu — `uat-session <slug>`». Không có → một dòng «không hồ sơ cơ hội → ship
thẳng, vòng đóng». S0: có `opportunity.md` → là input thứ nhất của brainstorm
S1 (đọc trước khi hỏi). Không cổng mới, không hỏi.

### 3.5 Chữ spec (`docs/specs/workflow-v2-spec.md`)

§2.2 S0 nêu đọc cơ hội (đã có) · §2.3 lái-thử = **thì ĐO-máy của nhịp TRAO**,
trước thì ĐO-người · §2.4 hàng A «lái-thử → UAT → Cổng Giá trị», hàng B «lái-
thử tuỳ chọn khi mở bề mặt mới» · Chương 3 dòng «lái-thử không có hàng trong
bảng cổng — nó không hỏi câu nào người phải trả lời» · Chương 4 nhật-ký-vấp là
artifact song diện. Đề bài §5 **giữ nguyên chữ**.

### 3.6 Bộ hình (`docs/diagrams/workflow-v2-*.html` + `workflow-v2-bo-hinh.md`)

Sáu hình đi cùng PR; hình 2 (chuỗi vật chứng) và 3 (vòng đời một việc) mang
dấu **ĐỀ XUẤT** trong eyebrow + colophon, và colophon nêu điều kiện gỡ dấu:
*cho tới khi guard có trong mã — hồ sơ thi hành guard gỡ dấu, không phải hồ sơ
này* (hình vẽ guard chưa có — hình không được đi trước chữ; ai gỡ dấu phải
được nói tên, gap-probe F5).

## 4. Đo

- Lớp MÁY: `_acceptance/moi-noi-vong-trao/rang-mnvt.sh --chan <tên>` — mỗi
  chân chạy vật thật + chiều đỏ cùng lượt trên bản sao code-sinh (measure-birth);
  thẻ: case P198 trong `tests/plugins` (fixture code-sinh từ khuôn opportunity,
  gate-card.js THẬT, ma trận viết trước 4 trạng thái × 2 mặt HTML/extract = 8
  assert có tên + 3 mutant → đỏ ghim); khuôn nhật-ký: quan hệ ĐỌC ⊆ KHUÔN rút
  hai phía bằng máy, chiều đỏ hai phía.
- Lớp HÀNH VI (§0 uat-session, S5): hội đồng phiên sạch theo giao thức 1c —
  agent không tool nhận inline SKILL sau sửa + đề ca (`hoi-dong/ca-E*.md`);
  đáp án viết trước ở `giam-khao/dap-an-E*.md`; giám khảo mù với diff.
- Số liệu ván refine-editor (máy B, mục lỗ-kit) là đầu vào trước khi ký.

## 4b. Hình của hồ sơ (tầng 2)

`_acceptance/moi-noi-vong-trao/figures/truoc-sau.html` — cùng một vòng có
ngưỡng nghiệm thu, hai hàng: trước (đoạn nối đứt, điều kiện «bấm được» là lời
khai) và sau (một dòng bàn giao → lái-thử → phiên nghiệm thu, điều kiện thành
bằng chứng). Hình là chiếu của contract AC-1/AC-2/AC-4/AC-5, không phải nguồn.

## 5. Đảo

Một revert; không schema mới bắt consumer migrate; hồ sơ cũ không đổi cách đọc.
