# Thiết kế — evals-sat-le-doc-du (hàng R1)

**Ngày:** 2026-10-10 · **Hạng:** T3 (chạm `lib/evidence-core.cjs`) · **Hồ sơ:** `_acceptance/evals-sat-le-doc-du/`
**Cổng Đáng:** owner «Làm» 10/10 (PR #297) — đầu vào thứ nhất là `opportunity.md` của hồ sơ.

## Ý định (chốt ở Cổng Đáng, không đổi trong vòng)

Kho viết `evals.yaml` kiểu danh sách sát lề (`- id:` ở cột 0, khoá ở cột 2, mục danh sách cũng ở cột 2 — đúng
kiểu xuất mặc định của bộ xuất YAML) vẫn được kit đọc đủ **đầu vào của hội đồng, vùng tệp, danh sách bằng
chứng và mọi trường mảng bắt buộc**; khuôn kit không đọc được thì lên **cờ vàng có tên**, không im. Kho đang
viết thụt 4 đọc ra **y hệt** trước và sau. Không kho nào phải viết lại tệp.

## Hiện trạng đo được (10/10, `main` `3200ba3a`)

| Bên đọc | Trường danh sách | Sát lề | Dạng khối `- x` | Neo `&a` / bí danh `*a` |
|---|---|---|---|---|
| `feature-loop/scripts/s4-args.mjs` (khối 158–182) | `inputs` `paths` `evidence_required` + mảng bắt buộc | **mất im lặng** (khoá cố định cột 4, mục cột ≥ 6) | đọc | mất |
| `feature-loop/scripts/carry-plan.mjs` `parseEvals` | `paths` | — | **mất ở mọi thụt** (chỉ nhận `[...]` một dòng) | mất |
| `lib/evidence-core.cjs` `evalPathsOf` (làn ghim lại, lọc ghim theo vùng tệp, lưới trước gộp) | `paths` | đọc | đọc | **đọc SAI**: `["&id001"]`, `["*id001"]` |
| `scripts/acceptance-gold.mjs` `glossOf` | (câu hỏi/kỳ vọng — hiển thị) | **không tìm thấy khối** (tách theo đúng hai dấu cách trước `- id:`) | — | — |
| `lib/eval-yaml.cjs` `parseEvals` | chỉ trường đơn | đọc | không đọc danh sách | — |

Phép vi phân trước khi sửa (bộ đọc vùng tệp của lượt chấm ↔ `evalPathsOf`): 620 hồ sơ / 7.364 tiêu chí ở bảy
kho, 0 lệch ở mọi hồ sơ thụt 4; lệch đúng một hồ sơ (`crm` `thuoc-mot-cho-khai-quet-man`, sát lề + neo).

## Quét không gian AC (morphological-scan, khuôn test-matrix)

- Chân sản phẩm: các bên đọc ở bảng trên `[SUY-TỪ-REPO: feature-loop/scripts/s4-args.mjs, feature-loop/scripts/carry-plan.mjs, lib/evidence-core.cjs, scripts/acceptance-gold.mjs]`; hình dạng tệp thật `[SUY-TỪ-REPO: crm 352ef33ac^ / ee4ae662c]`.
- Chân ngành: `[NGÀNH: YAML 1.2 — dãy khối «compact», mục `-` được phép ở CÙNG cột với khoá cha trong ánh xạ khối]` · `[NGÀNH: PyYAML yaml.dump mặc định — xuất dãy không thụt và sinh neo `&id001` cho giá trị lặp]`.

| Trục | Giá trị | Thước CE |
|---|---|---|
| A. Cách viết | thụt 4 (`- id` cột 2, khoá 4, mục 6) · sát lề (0/2/2) · `- id` cột 2 mục ngang khoá (2/4/4) · `[a, b]` một dòng · một giá trị trần · neo `&a` + mục · bí danh `*a` · khối chữ `|`/`>` trên khoá danh sách · khoá rỗng | YAML 1.2 + hai tệp crm thật |
| B. Trường | `inputs` · `paths` · `evidence_required` · mảng bắt buộc theo bảng của workflow | `EVAL_REQUIRED` ở `acceptance-verify.js` |
| C. Bên đọc | lượt chấm (`s4-args`) · lượt sửa (`carry-plan`) · ghim lại/lọc/lưới (`evalPathsOf`) · nhãn bộ chấm mẫu (`acceptance-gold`) · thẻ (cờ) | bảng hiện trạng |
| D. Hướng | đọc đúng · cờ vàng có tên · chiều im (hồ sơ sạch không cờ, kho thụt 4 không đổi) | luật 26/09 |

**Core:** A{sát lề, mục ngang khoá, thụt 4} × B{4 trường} × C{lượt chấm} (AC-1, AC-2) · A{dạng khối} × C{lượt sửa} (AC-6) · A{mọi dạng trên kho thật} × C{lượt chấm, `evalPathsOf`} × D{chiều im} (AC-3) · A{neo, bí danh, khối chữ, khoá rỗng} × D{cờ} (AC-4, AC-5) · C{nhãn bộ chấm mẫu} (AC-7) · một nguồn + lệch phiên bản (AC-8, AC-9) · lời cho người viết eval (AC-10).
**Later:** giải bí danh `*a` thành danh sách thật (ngưỡng ở Out of scope) · khoá lồng `ui: paths:` và bốn hình dạng khối chữ của hạt giống 20/09 (latent, 0 lệch).
**Never:** bắt kho viết lại tệp / đổi khuôn sinh `evals.yaml` (luật 26/09: đổi mặc định là mọi kho trả giá) · đưa thư viện YAML vào kit (kit cố ý đọc theo dòng, không phụ thuộc gói ngoài — `resolveConfigKey` «No YAML lib — line-based on purpose»).

## Thiết kế

### 1. Một bộ đọc danh sách ở `lib/evidence-core.cjs`

```js
// evalListsOf(evalsText, keys) → { byId: Map<id, { [key]: string[] }>, canhBao: [{ id, key, ly_do, dong }] }
```

- **Ranh một tiêu chí:** từ dòng `- id:` (thụt bất kỳ) tới dòng `- id:` kế. Id qua `parseFlowValue` (bỏ nháy).
- **Cột khoá = cột của chữ `id`** trong dòng `- id:` (sát lề: 2 · thụt 4: 4). Chỉ dòng `key:` ĐÚNG cột ấy là khoá
  của tiêu chí — đúng ngữ nghĩa ánh xạ khối YAML, không phụ thuộc thụt đầu dòng. (Hệ quả phụ: khoá lồng
  `ui:\n  paths:` không còn bị đọc nhầm là `paths` của tiêu chí — hình dạng 2 của hạt giống 20/09.)
- **Giá trị cùng dòng:** `[a, b]` → các mục (qua `parseFlowValue`) · trống → đọc mục khối bên dưới ·
  `&ten` (tuỳ chọn kèm `[...]`) → bỏ nhãn neo, đọc như thường · `*ten` → **cờ `bi-danh`**, trường vắng ·
  `|` / `>` / `{` → **cờ `khong-phai-danh-sach`**, trường vắng · giá trị trần khác → một mục (cùng luật
  `evalPathsOf` hôm nay: «glob trần»).
- **Mục khối:** dòng `^(\s*)-\s+(.+)` có thụt **≥ cột khoá** (sát lề: mục ở cột khoá; thụt 4: mục sâu hơn).
  Dòng trống / chỉ chú thích giữa các mục không cắt danh sách; chú thích cuối mục bị cắt; dòng khác cắt.
- **Khoá có mặt mà không mục nào** → trường là `[]` + **cờ `rong`** (giữ đúng cách lượt chấm ghi `[]` hôm nay).
- `evalPathsOf(text, id)` viết lại thành vỏ: `paths` của tiêu chí ĐẦU TIÊN mang id ấy, `[]`/vắng → `null` — hợp
  đồng của nó với mọi bên gọi (làn ghim lại, lọc ghim theo vùng tệp, lưới trước gộp) giữ nguyên.

### 2. Lượt chấm — `s4-args.mjs`

Khối đọc danh sách tự viết (158–182) bị THAY bằng một lời gọi `evalListsOf(evalsText, LIST_KEYS)`; lib cũ
không có hàm → thoát 2 «acceptance-gate quá cũ … evalListsOf» (cùng khuôn kiểm `parseFlowValue` đang có).
Cờ của tiêu chí còn trong lượt chấm → một dòng stderr
`s4-args: danh sách không đọc được: E2.paths (bí danh YAML), …` và khoá args `canhBaoDanhSach` (vắng hẳn khi
rỗng — cùng luật hiện diện `evalsNotRun`). Không chặn lượt chấm: trường bắt buộc vắng vẫn thoát 2 như cũ.

### 3. Lượt sửa — `carry-plan.mjs`

`paths` đọc qua `R.evalListsOf` (cùng mô-đun đã nạp cho `parseFlowValue`); thêm `evalListsOf` vào danh sách hàm
bắt buộc. Dạng khối nay được giữ-ô-xanh như dạng một dòng.

### 4. Thẻ — `scripts/gate-card.js`

Hằng mới `DANH_SACH_KHONG_DOC_FLAG`; thẻ Cổng Phạm vi VÀ Cổng Bằng chứng gọi `evalListsOf` trên `evals.yaml`
của hồ sơ, có cờ thì in một cờ vàng gọi tên `<id>.<trường> (<lý do>)`. Cờ hiện ở Cổng Phạm vi — TRƯỚC khi
một lượt chấm bị đốt. Lời thuật thêm vào `commands/acceptance-card.md` (mỗi hằng bên viết một dòng bên đọc).

### 5. Nhãn bộ chấm mẫu — `scripts/acceptance-gold.mjs`

`glossOf` tách khối theo `\n(?=[ \t]*-\s+id:)` thay vì đúng hai dấu cách.

### 6. Lời cho người viết eval

`skills/acceptance/references/eval-executors.md` (hoặc chỗ đang tả hình dạng `evals.yaml`) thêm hai câu: kit
đọc cả sát lề lẫn thụt; bí danh YAML trên trường danh sách KHÔNG được giải — cờ vàng, viết lại thành danh sách.
`CHANGELOG.md` mục chưa phát hành.

## Đo (chiều đỏ nằm trong bộ kiểm)

Tệp ca mới `tests/scripts/evals-sat-le.test.mjs`. Mọi fixture do mã sinh trong lượt chạy: MỘT mô hình tiêu chí
(script + judgment + ui-check, đủ bốn trường) → các cách viết của trục A. Bản base của bên đọc lấy bằng
`git archive <BASE>` của MỘT hằng `BASE_DIRS = feature-loop/scripts lib scripts` (BASE = `3200ba3a`, trọn thư mục — không chép
danh sách tệp tay), dùng chung mọi ca; script mà chiều đỏ gọi vắng ở base → ĐỎ ghim «base thiếu tệp»; base trùng cây
đang kiểm → ĐỎ ghim «base trùng cây». Đường dẫn suy từ vị trí tệp ca.

Phép vi phân trên kho thật: `tests/scripts/evals-sat-le-vi-phan.mjs --kho <thư mục>…` so bộ đọc base ↔ mới trên
mọi `_acceptance/*/evals.yaml`; trong suite chạy trên chính kit (125 hồ sơ), chiều đỏ là đột biến «bỏ mục cuối của
mọi danh sách khối» kèm kiểm trước «đột biến tương đương»; trên crm + năm kho chạy ở lượt chấm của máy owner (khoá
config riêng), thiếu kho nào là thoát 2 «không đọc được ở đây», đầu ra (sha + số từng kho) vào `evidence/`.

Lưới đóng lớp (AC-11): tệp ca rút mọi tệp mã nhắc `evals.yaml` rồi so với bảng phân loại viết trước — tệp mới
chưa phân loại là đỏ, để ngưỡng CHẾT «còn đường đọc sát lề rơi im lặng» có thước.

## Giới hạn đã khai

- Bí danh YAML không được giải (cờ vàng). Ngưỡng mở lại: ≥ 3 hồ sơ mang bí danh, hoặc ở ≥ 2 kho, sau mốc kế.
- Phép vi phân trên kho tiêu thụ chỉ đọc được trên máy có các kho ấy; CI chỉ có 125 hồ sơ của kit.
- `lib/eval-yaml.cjs parseEvals` (trường đơn) KHÔNG đổi — hạt giống hợp nhất 20/09 giữ nguyên làm sổ.
