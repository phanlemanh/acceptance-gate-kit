# Hạt giống — chip D: lệnh in ra phải bấm được, cộng bốn mục TRỪ

**Ngày:** 2026-08-22 · **Trạng thái:** `_acceptance/lenh-in-ra-phai-bam-duoc/opportunity.md` · **Hạng dự kiến:**
T2 (bản luật ngôn ngữ mặt người + `commands/*.md` + hai SKILL + `scripts/gate-card.js` + `scripts/start-scan.mjs`
+ tests; không chạm `lib/**`, hook, lưới trước-merge).
**Sinh từ:** owner báo 22/08 «Claude sinh câu trả lời dạng lệnh, bấm hay chép đều không khớp lệnh thật của
kit» + rà soát North Star trước mốc 2.3.0 (ba mục nhiễu thẻ) + chín finding ngoài hợp đồng của chip B và C.

> Chữ trong file này là NGUỒN. Hình không cần: mỗi mục là một phép trừ hoặc một bảng tên, không có nhánh rẽ.

## Mục 1 (đứng đầu) — lệnh in ra phải bấm được

### Lỗ

Kit in tên lệnh ở **~190 chỗ**, tất cả ở dạng trần (`/start`, `/approve`, `/acceptance-card <slug>`,
`/feature-loop <slug>`), **0 chỗ** có tiền tố plugin. Harness (Claude Code, tài liệu skills, bản 2.1.233)
nói rõ: tên chính thức là **`/<plugin>:<tên>`**; dạng trần «cũng chạy **trừ khi một lệnh khác đã dùng tên
đó**», và trước 2.1.216 dạng trần không tự hoàn thành. Tức dạng trần là may mắn theo máy, không phải hợp đồng.
Tệ hơn: **7 chỗ** in `uat-session <slug>` không có dấu gạch — không phải lệnh ở bất kỳ máy nào, bấm là lỗi.

Đây là cùng lớp «con trỏ chết» mà chip B vừa xử ở `/start` (nghi thức «grill» không tồn tại): bản luật nói
một tên, harness đăng ký một tên khác, và không phép đo nào nối hai đầu.

### Bằng chứng (22/08, máy owner)

| Tên kit in | Harness đăng ký | Trần | Có tiền tố |
|---|---|---|---|
| `/start` | `/acceptance-gate:start` | 24 | 0 |
| `/approve` · `/signoff` | `/acceptance-gate:approve` · `/acceptance-gate:signoff` | 24 · 25 | 0 |
| `/acceptance-card` · `-init` · `-status` · `-report` | `/acceptance-gate:acceptance-…` | 21 · 23 · 9 · 9 | 0 |
| `/feature-loop` | `/feature-loop:feature-loop` (skill, không phải command) | 15 | 0 |
| `uat-session <slug>` | `/acceptance-gate:uat-session` (skill) | 7 | 0 |
| `/goal` | lệnh có thật của harness | 15 | — (giữ) |

Điểm bàn giao thật (thứ người bấm): `commands/start.md` 11 · feature-loop SKILL 8 · `commands/approve.md` 7
· `skills/acceptance/SKILL.md` 6 · `commands/signoff.md` 5 · bản luật ngôn ngữ mặt người 4 · ba lệnh còn
lại 2+2+2 · uat-session SKILL 1 = **48**. Thước cũ ghim chuỗi trần ~170 chỗ trong `tests/plugins/run-tests.sh`.

### Đề xuất — một nguồn tên lệnh, không tìm-thay

1. **Bảng `COMMAND-NAMES`** (khối marker) trong `skills/acceptance/references/human-facing-language.md`:
   mỗi dòng `<tên trần> → /<plugin>:<tên> (command|skill)`. Đây là nguồn duy nhất; mọi thứ khác là chiếu.
2. **Round-trip hai chiều với vật thật:** tập tên trong bảng = tập `commands/*.md` + `skills/*/` của hai
   plugin (đọc thư mục lúc chạy, không chép tay); thêm command mà quên bảng → đỏ; bảng có tên không có
   thư mục → đỏ.
3. **Mọi điểm bàn giao in dạng có tiền tố** — 48 điểm khai tường minh (danh sách file, như AC-7b chip A,
   không hứa «mọi tài liệu»); `uat-session <slug>` → `/acceptance-gate:uat-session <slug>`. Phần văn giải
   thích trong GUIDE/README được nêu tên một lần rồi dùng dạng có tiền tố; sử liệu `docs/**` ngoài phạm vi.
4. **Thước rút từ bảng:** ca cũ ghim chuỗi trần đổi sang rút tên từ `COMMAND-NAMES` (một lần, có chủ đích),
   không ghim literal lần nữa.
5. **Chiều đỏ đầu tiên = nguyên văn chuỗi owner đã bấm mà lỗi** (chưa có — owner dán vào hồ sơ khi mở).

Ma trận: R+ (mọi điểm bàn giao khớp bảng) · R− (một điểm in dạng trần hoặc không dấu gạch → đỏ nêu
file:dòng) · RK (bảng ↔ thư mục hai chiều) · R0 (`docs/**` sử liệu không quét; `/goal` giữ nguyên vì là
lệnh harness).

## Mục 2 — TRỪ cờ đỏ «n-a baseline» trên thẻ Cổng Bằng chứng

Thẻ thật của cả ba chip A/B/C đều có cờ **đỏ** «n-a — không chạy lượt baseline» cho một lựa chọn có chủ ý
(đường verify độc lập, d-4208/4308). Đỏ không có nghĩa dạy người bỏ qua màu đỏ — đúng lớp kit cấm.
Đề xuất: Analyst `n-a` có lý do ghi rõ → cờ **info** (hoặc không cờ); chỉ đỏ khi baseline *hứa* mà *không chạy*.

## Mục 3 — TRỪ cờ «AC-n có ngưỡng/biên nhưng chưa có ca dưới ngưỡng» dò bằng dấu

`THRESHOLD_RE` trong gate-card khớp `≥`, số, «ngưỡng», «biên» trong **chữ** của AC → cờ vàng oan trên mọi AC
nhắc tới một con số (AC-5, AC-7 của chip C bị cờ vì chữ «≥ 13»). Đề xuất: thu về AC có *ngưỡng đo được* khai
tường minh (hoặc bỏ hẳn — cờ này chưa từng bắt được lỗi thật trong sổ known-limits).

## Mục 4 — chín finding ngoài hợp đồng của chip B và C (đã triage, chưa sửa)

Từ B (`_acceptance/vao-co-o-ra-co-ten/review-findings.md`): (B1) `/start` bước 4 chưa có lối bàn giao
cho ý đang cân nhắc + «ba nhóm» (dòng 2, 48) đã lỗi thời → «bốn nhóm»; (B2) tuổi ý = tuổi ô — khoá frontmatter
tuỳ chọn thắng git birth; (B3) `decided_at` stub `duong-do` là mốc xấp xỉ máy điền — owner xác nhận/thay;
(B4) placeholder «chưa điền» chỉ biết `…`; nhãn in đậm `**Timebox:**` kẹt ở cân nhắc; (B5) khối
`START-HIEU-KET` đứng giữa hai mục in-lên-thẻ.
Từ C (`_acceptance/duong-do-trong-dinh-nghia-xong/review-findings.md`): (C1) «Bỏ đường đo —» không gạch nối
lọt thành đường đo thật; (C2) heading tiền tố `## Đường đo lường` khớp — chốt có chủ ý hay neo cuối;
(C3) `_Avoid_: metric` đụng từ kit đang dùng (`uat-session`, `morphological-scan`) → bỏ «metric»;
(C4) khuôn «dòng bỏ VÀ entry» vs SKILL «chỉ entry» → khuôn đổi «(tuỳ chọn) kèm entry».
Cộng một cờ info nhiễu thường trực: «Từ vựng: repo có CONTEXT.md nhưng thẻ chưa được truyền --glossary-base».

## Không làm

- Không đổi tên lệnh nào của kit; không thêm lệnh mới; không alias.
- Không quét «mọi tài liệu» — phạm vi là danh sách điểm bàn giao + bảng; `docs/**` là sử liệu.
- Không chạm `lib/**`, hook, lưới trước-merge (T2).
- Hai hạt giống rà soát 22/08 (giới-hạn-đã-khai ≠ bất định · vòng kit tự-dùng không chặng bàn giao) là
  hồ sơ riêng, không gộp vào D.

## Thước (định hướng cho S1)

Mỗi mục một ca riêng theo MEASURE-BIRTH-CLAUSE: đối chứng dương trên cây thật, chiều đỏ trên bản sao bị
phá, ghim thông điệp. Mục 1 là «lệnh mà người bấm» nên ván lái-thử kế (ở `artifact-platform`) là nơi đo
hành vi thật: bấm từng lệnh trên thẻ, không lệnh nào báo «không tìm thấy».
