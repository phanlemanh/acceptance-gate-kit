# Lớp bằng chứng nhìn-thấy (`layer: ui-observed`) — thiết kế

Ngày: 2026-09-08 · slug `lop-bang-chung-nhin-thay` · owner Manh Phan · hạng T3
(chạm `lib/**` + `scripts/pre-merge-check.sh`).

## 1. Vì sao (điều tra 08/09)

Từ 01/09 hồ sơ chạm web ở repo tiêu thụ không còn frame ở Cổng Bằng chứng.
Đường ống chụp và hiển thị của kit **không hỏng**: agent ui-check vẫn ghi
`evidence/E{id}-step{n}.png`, `evidence-page.js` vẫn phát slideshow, lệnh
`acceptance-card` bước 6 vẫn sinh và mở trang bằng chứng. Ảnh vắng vì ở S2
không còn eval `ui-check` nào được sinh cho feature chạm web
(`oneflow/chong-mat-khoa-byo-giao-dien`, `surfaces: [web]`: 10 `test` vitest
component + 4 `script`, 0 `ui-check`; 12 frame design-pass có trước Cổng 1
nhưng không phải bằng chứng S4).

Cơ chế: luật S2 «test > script > ui-check > judgment — chọn executor cơ học
nhất» gặp repo đã có làn vitest cho component thì gán hết tiêu chí UI cho
`test`. Luật 2b (design-quality mặc định bật cho web) có điều kiện «khi có
browser + dev server» nên bị lấp bằng hai eval `script` (axe-core, design.gate)
không sinh frame; E10 rồi bị descope vì hạ tầng chụp hỏng hai lần.

Kit hôm nay chỉ có **một chiều** của luật lớp: bằng chứng lớp UI không đủ cho
đường đi qua backend → `(cross-layer)` đòi `layer: backend-effect`, răng ở ba
tầng (lint W4 · gap-probe · pre-merge VIOLATION). Chiều ngược — bằng chứng lớp
mã không đủ cho bề mặt người nhìn — không có tên, nên không lưới nào kêu.

Hai nguyên nhân phụ: từ vựng `surfaces` trôi (`web`, `web-ui` ngoài enum
`api | cli | sdk | ui | mobile` của khuôn; vị từ `SURFACE_NGUOI_DUNG` của
`lib/nguong-o-co-hoi.cjs` chỉ nhận `ui|mobile` nên `[web]` lọt răng chống lách
«không đo được»); và khi ui-check hỏng vì hạ tầng, lối thoát duy nhất là
descope không tên.

## 2. Quyết định thiết kế

**D1 — Neo máy là `executor: ui-check`; `layer: ui-observed` là nhãn khai.**
Hook `acceptance-evidence-gate.js` (schema v2) đã chặn mọi block ui-check
thiếu `screenshot:`/`observed:` — tức executor ui-check ĐÃ là bất biến
«có frame + có mắt đọc». Nghĩa vụ W8 được trả bởi ∃ eval `executor: ui-check`;
nhãn `layer: ui-observed` do S2 viết để luật ghép cặp đọc đối xứng với
`backend-effect` và để gap-probe/judge nhận ra lớp. Nhãn lạc chỗ (`layer:
ui-observed` trên executor ≠ ui-check) là W8 riêng (gương của lưới
«vacuous-pair» L10). Vì sao không neo vào nhãn: hồ sơ cũ có ui-check không
nhãn sẽ bị NOTE giả mỗi chiến dịch ghim lại (slug vào diff) → số đếm ngưỡng
hỏng ngay từ đầu. Đọc-cũ: ui-check không `layer:` vẫn trả nghĩa vụ, không
bắt migrate. **Ở Cổng Bằng chứng (gap-probe F1)** thẻ đọc `present` trên BLOCK của eval
ui-check trong `evidence-report.md` (đạt = `exit_code: 0` + `screenshot:`), không trên
bản khai — ca oneflow E10 «khai rồi descope ở S4» chính là ca này.

**D2 — Nghĩa vụ tính THEO HỢP ĐỒNG (≥1), không theo AC.** Owner chốt 08/09.
Một agent + một dev server mỗi feature web; siết theo AC chỉ khi ngưỡng đếm
cho thấy một frame là không đủ.

**D3 — Răng ba tầng, tầng cuối là NOTE.** Lint W8 (exit 1 advisory như W1–W7)
· cờ vàng thẻ Cổng 1 (gate-card tự tính từ cùng lib, không gọi lint) · câu
cross-check trong prompt gap-probe · pre-merge in `NOTE`, chưa `VIOLATION`.
**Ngưỡng đang đếm:** hai hợp đồng có mặt người nhìn ký ở Cổng Bằng chứng mà
không frame trong một mốc phát hành → mở vòng siết NOTE thành VIOLATION.
Số đếm đọc từ dòng NOTE trong log CI / `pre-merge-check.sh --recheck-all`,
không dựng phép đo mới. **Quy tắc đếm (gap-probe F5):** slug PHÂN BIỆT có NOTE lớp
nhìn-thấy mà `approved_at` (NOTE in kèm, đọc từ frontmatter) nằm trong cửa sổ giữa
hai mốc; hồ sơ cũ bị kéo vào diff ở chiến dịch ghim lại có ngày cũ nên loại được
bằng chính dòng NOTE; nhánh NOTE chạy cả ở `--base` lẫn `--recheck-all`.

**D4 — Một nguồn cho «mặt người nhìn».** `lib/lop-nhin-thay.cjs` giữ: enum
`surfaces` chuẩn, bảng alias (`web` → `ui`, `web-ui` → `ui`), vị từ
`laMatNguoiNhin` (ui/web/web-ui, KHÔNG mobile — mobile đi làn `test` qua
`e2e_mobile`, không có đường frame), `coUiObserved(evals)`, `nhanLacCho(evals)`,
hằng tiền tố descope. `SURFACE_NGUOI_DUNG` của `nguong-o-co-hoi.cjs` mở rộng
nhận web/web-ui qua cùng bảng alias (răng chống lách «không đo được» từ nay
thấy `[web]`). Enum trong lib round-trip với chú thích `surfaces:` của
`CONTRACT-FRONTMATTER-TEMPLATE`. Enum mở rộng thêm `docs | ci | config` vì
hồ sơ thật đã dùng (kit + oneflow); token ngoài enum → W8 cảnh báo token,
không bắt sửa hồ sơ cũ.

**D5 — Đường bỏ có tên.** Entry `descope` với `decision` bắt đầu đúng chuỗi
`bỏ ui-observed — <lý do>` (hằng trong lib, chuỗi pin ở SKILL và test). Thẻ
Cổng 1: `finfo` «đã bỏ theo entry»; ghi sau seal (ca hạ tầng chụp hỏng ở S4)
→ thẻ Cổng 2 hiện ở khối «CHƯA duyệt» bằng cơ chế provisional sẵn có, cộng
một dòng cờ «bằng chứng lớp nhìn-thấy: không có» để người ký thấy trước khi ký.

**D6 — Chụp là việc của repo.** Kit không ship browser (bất biến sẵn).
`acceptance-init` 3b thêm gợi ý `@playwright/cli` làm lệnh `capture.ui` rẻ
(wrapper 3 lệnh open → screenshot → close), cạnh puppeteer-core.

**Không làm:** không đụng `evidence-page.js`; không đưa frame design-pass lên
Cổng 2 (bản mẫu trước Cổng 1 hiện cạnh bằng chứng là đúng bẫy «hallucinated
completion» rail observed sinh ra để chặn); không VIOLATION; không nghĩa vụ
theo AC; không migrate hồ sơ cũ.

## 3. Vật và bộ đọc

| Vật | Bộ đọc phải đồng bộ |
|---|---|
| `lib/lop-nhin-thay.cjs` (mới) | eval-coverage-lint W8 · gate-card Cổng 1 + 2 · pre-merge NOTE · nguong-o-co-hoi (alias) |
| Luật S2 | `skills/acceptance/SKILL.md` Phase 2 mục 2c · `feature-loop/skills/feature-loop/SKILL.md` dòng evals + prompt gap-probe (4) · `eval-executors.md` section «Pairing mechanics — UI surfaces» |
| Từ vựng | `CONTEXT.md` term Layer + Surface · `contract-template.md` chú thích `surfaces:` |
| Gợi ý chụp | `commands/acceptance-init.md` 3b |
| Răng | `scripts/eval-coverage-lint.js` · `scripts/gate-card.js` · `scripts/pre-merge-check.sh` (chỉ THÊM dòng — luật diff-chỉ-thêm DV5) |

## 4. Chiều đo (MEASURE-BIRTH-CLAUSE)

Mỗi phép đo mới có cặp cùng fixture: vật lành → xanh; phá vật trong bản sao
→ đỏ ghim thông điệp. Fixture code-sinh trong lần chạy, contract từ
`CONTRACT-FRONTMATTER-TEMPLATE`. Mutant cô lập lớp: `[mobile]` không kích;
`[api, cli]` không kích; `[web]` kích như `[ui]`; `layer: ui-observed` trên
`test` → cảnh báo lạc chỗ; ui-check không nhãn → im (đọc-cũ). Cây thật của
kit (toàn cli/docs) → 0 dòng W8 (đối chứng dương cho cả kho).

## 5. Trace

Nguyên tố 2 — bằng chứng không tự dối. Người hưởng: người ký Cổng Bằng chứng
nhìn frame thay vì tên test; máy có rail `observed` để tự bắt mình. Không thêm
lượt gọi người: cờ nằm trong thẻ Cổng 1 sẵn có. Đề xuất là CỘNG dưới luật
nới 07/09 (CLAUDE.md) — ghi rõ ở hồ sơ.

## 6. Quét không gian (morphological-scan, preset test-matrix)

- Trục A — vật mới: lib một-nguồn | luật S2 | W8 lint | cờ thẻ Cổng 1 | cờ thẻ
  Cổng 2 | NOTE pre-merge | câu gap-probe | alias surfaces | descope có tên |
  gợi ý playwright-cli [thước CE: 6 mục owner duyệt 08/09 — mỗi mục ≥1 ô].
- Trục B — bộ đọc: eval-coverage-lint | gate-card | pre-merge | nguong-o-co-hoi
  | acceptance SKILL | feature-loop SKILL | eval-executors | CONTEXT | template
  | acceptance-init [thước CE: `grep -l "backend-effect"` toàn repo = tập bộ đọc
  của luật gương; mỗi file có ca hoặc lý do gạch].
- Trục C — chiều: dương | đỏ ghim | đọc-cũ | mutant cô lập lớp | round-trip
  hằng [thước CE: MEASURE-BIRTH-CLAUSE; `[NGÀNH: ISTQB test levels —
  component vs system]` phân biệt lớp mã / lớp người nhìn].
- Core: A×{lint, gate-card, pre-merge, lib} × C; luật văn bản × đọc-thân.
- Later: VIOLATION (sau ngưỡng) · nghĩa vụ theo AC · NOTE đếm frame thật trong
  `evidence/` (hôm nay đếm ở tầng evals).
- Never: frame design-pass lên Cổng 2 · kit ship browser · migrate hồ sơ cũ ·
  sửa `evidence-page.js` · hook mới (hook sẵn có đã giữ bất biến frame+observed).
- Ô gạch có lý do: hook × W8 (răng đã có); s4-args/workflow × W8 (không đổi
  luồng chạy, chỉ đổi luồng sinh eval).
