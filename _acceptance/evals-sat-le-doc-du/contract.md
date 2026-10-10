---
schema_version: 1
feature: Kho viết evals.yaml kiểu danh sách sát lề vẫn được kit đọc đủ đầu vào, vùng tệp, danh sách bằng chứng và trường mảng bắt buộc — một bộ đọc danh sách ở lib cho lượt chấm, lượt sửa và bộ đọc vùng tệp; khuôn không đọc được (bí danh YAML, khối chữ, khoá rỗng) lên cờ vàng có tên; kho đang viết thụt 4 đọc ra y hệt
slug: evals-sat-le-doc-du
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm lib/evidence-core.cjs (lib/** trong t3_paths)
surfaces: [cli]
status: implemented
approved_by: Manh Phan
approved_at: 2026-10-10T12:33:02Z
design_doc: docs/superpowers/specs/2026-10-10-evals-sat-le-doc-du-design.md
---

# Acceptance Contract: evals-sat-le-doc-du

Gốc: crm/_acceptance/dieu-phoi-va-bien

## Context

Hàng R1 của lộ trình kit; Cổng Đáng ký build T3 ngày 10/10 (owner «Làm», PR #297). crm phải viết lại 309 dòng
`evals.yaml` (07/10) và một hồ sơ crm viết hôm nay lại sát lề kèm neo YAML: bộ sinh tham số lượt chấm chỉ nhận
khoá ở cột 4 nên đánh rơi `inputs`/`paths`/`evidence_required` mà vẫn thoát 0; bộ lập kế hoạch giữ-ô-xanh bỏ
mọi `paths` dạng khối; bộ đọc vùng tệp ở lib đọc tên neo thành glob. Thiết kế ở `design_doc`. Bản base của mọi
phép so là `3200ba3a` (main lúc mở vòng).

## Criteria

- AC-1: Given MỘT mô hình tiêu chí do mã sinh (một `script`, một `judgment`, một `ui-check`) mang ĐỦ mọi trường mảng bắt buộc của executor mình theo bảng `EVAL_REQUIRED` của `acceptance-verify.js` (rút từ nguồn lúc chạy) cộng `inputs`/`paths`/`evidence_required` — mô hình hụt một trường bắt buộc nào thì ĐỎ ghim «mô hình hụt trường: <executor>.<trường>» — viết theo ba cách: thụt 4 (`- id` cột 2, khoá cột 4, mục cột 6), sát lề (0 / 2 / 2), `- id` cột 2 với mục ngang khoá (2 / 4 / 4), trong ba kho git do mã sinh, When chạy `s4-args.mjs` của cây đang kiểm, Then với ma trận viết trước cách viết × tiêu chí × trường, mỗi phần tử trong tệp args BẰNG giá trị mô hình; số so = số phần tử ma trận (khác → ĐỎ ghim «ma trận hụt»); ba cách hợp lệ KHÔNG sinh cờ nào.
- AC-2: Given CÙNG ba kho của AC-1 và bản base của `feature-loop/scripts` + `lib` lấy bằng `git archive 3200ba3a` của MỘT hằng thư mục dùng chung cho mọi ca (`feature-loop/scripts`, `lib`, `scripts` — mỗi script mà một chiều đỏ gọi phải có trong bản base, thiếu → ĐỎ ghim «base thiếu tệp: <đường>»; base trùng cây đang kiểm → ĐỎ ghim «base trùng cây»), When chạy `s4-args.mjs` của base, Then cách thụt 4 XANH ở cả base lẫn cây mới (đối chứng dương: base ra đúng giá trị mô hình) và cách sát lề ĐỎ ở base — ca in ghim «base mất danh sách: <id>.<trường>» cho ít nhất `paths`, `inputs`, `evidence_required` — trong khi cây mới XANH.
- AC-3: Given mọi `_acceptance/*/evals.yaml` của kit (đọc từ cây đang kiểm), When so bộ đọc base với bộ đọc mới — (a) bốn trường danh sách mà `s4-args` đưa vào args, (b) `evalPathsOf` cho mọi id — Then 0 lệch trên mọi hồ sơ không viết sát lề, in số hồ sơ và số tiêu chí đã so (bằng 0 → ĐỎ ghim «vi phân rỗng»); chiều đỏ trên CÙNG bộ hồ sơ: bản sao bộ đọc mới bỏ mục cuối của mọi danh sách khối → phép so ĐỎ ghim «vi phân lệch» kèm tên hồ sơ lệch đầu tiên, và TRƯỚC khi tin chiều đỏ, số tiêu chí đột biến làm đổi kết quả phải > 0 (bằng 0 → ĐỎ ghim «đột biến tương đương»). Và When cùng phép so chạy trên crm, oneflow, artifact-platform, radar, media-library, map và kit ở lượt chấm của máy có các kho ấy, Then đầu ra `evidence/vi-phan-bay-kho.txt` in sha đang đọc + số hồ sơ + số tiêu chí của TỪNG kho, tổng hồ sơ ≥ 620, 0 lệch ngoài hồ sơ sát lề, và hồ sơ crm `thuoc-mot-cho-khai-quet-man` có mặt trong danh sách lệch theo chiều ĐỌC THÊM (base vắng/rác → mới có giá trị), không lệch chiều nào khác; thiếu bất kỳ kho nào → thoát 2 ghim «không đọc được ở đây: <kho>», không bao giờ xanh trên bộ hồ sơ hụt.
- AC-4: Given các cách viết trường danh sách mà kit không đọc thành danh sách — bí danh `paths: *id001`, khối chữ `inputs: |`, ánh xạ một dòng `paths: {a: b}`, khoá rỗng `evidence_required:` không mục nào — mỗi cách một tiêu chí trong một kho do mã sinh, When chạy `s4-args.mjs`, Then stderr có ĐÚNG một dòng bắt đầu `s4-args: danh sách không đọc được:` gọi tên từng `<id>.<trường>` kèm lý do (4/4), tệp args mang khoá `canhBaoDanhSach` liệt đủ bốn mục; hồ sơ không có cách nào như vậy → không dòng nào và khoá VẮNG HẲN (chiều im); chiều đỏ trên CÙNG fixture: bản sao lib gỡ nhánh cờ → ĐỎ ghim «cờ im: <id>.<trường>».
- AC-5: Given tiêu chí khai neo `paths: &id001` kèm các mục khối (hồ sơ crm `thuoc-mot-cho-khai-quet-man` dựng lại bằng mã), When đọc bằng `evalPathsOf` và bằng `s4-args`, Then cả hai trả đúng các mục (không còn `&id001` như một glob) và tiêu chí dùng bí danh `*id001` thì `evalPathsOf` trả `null` (đường «không khai paths» vốn có của làn ghim lại) kèm cờ ở AC-4 — không bao giờ trả `*id001` như một glob; chiều đỏ: bản base trả `["&id001"]` → ca in ghim «neo thành glob».
- AC-6: Given run-log có lượt trước xanh cho hai tiêu chí cùng `paths` viết một bằng `[a, b]`, một bằng dạng khối (thụt 4) và một bằng dạng khối sát lề, và lượt sửa chỉ chạm tệp ngoài các vùng ấy, When chạy `carry-plan.mjs` của cây đang kiểm, Then cả ba được mang sang với lý do «paths không chạm diff-fix, round trước xanh»; lượt sửa chạm tệp trong vùng → cả ba chạy lại với lý do «diff-fix chạm <tệp>»; chiều đỏ trên CÙNG fixture: `carry-plan.mjs` của base cho hai tiêu chí dạng khối «thiếu paths — luôn chạy lại» → ca in ghim «base bỏ paths khối».
- AC-7: Given hồ sơ có `evals.yaml` sát lề với tiêu chí `judgment` mang `question:` một dòng có nháy, When `acceptance-gold.mjs` dựng nhãn cho tiêu chí ấy, Then nhãn là câu hỏi của tiêu chí (không rơi về rationale của báo cáo); đối chứng dương: cùng mô hình viết thụt 4 cho cùng nhãn; tiêu chí sát lề KHÔNG có `question:` lẫn `expected:` thì nhãn KHÔNG bịa câu hỏi — rơi về rationale như hôm nay; chiều đỏ: `glossOf` của base cho tệp sát lề → nhãn rơi về rationale, ca in ghim «gold mất câu hỏi sát lề».
- AC-8: Given hồ sơ có cờ của AC-4 và hồ sơ sạch, When dựng thẻ Cổng Phạm vi và thẻ Cổng Bằng chứng bằng `gate-card.js`, Then thẻ của hồ sơ có cờ chứa hằng `DANH_SACH_KHONG_DOC_FLAG` (rút từ nguồn, không gõ literal) kèm tên từng `<id>.<trường>` ở CẢ HAI cổng; thẻ của hồ sơ sạch không chứa hằng ấy (chiều im); `commands/acceptance-card.md` có một dòng thuật cho hằng ấy; chiều đỏ: bản sao `gate-card.js` gỡ dòng đẩy cờ → ĐỎ ghim «thẻ im khi danh sách không đọc được».
- AC-9: Given một bản sao lib trong đó `evalListsOf` bị thay bằng hàm trả mọi trường rỗng, When chạy `s4-args.mjs` và `carry-plan.mjs` với `--ag-root` trỏ bản sao trên fixture AC-1/AC-6, Then kết luận của CẢ HAI lật (args mất `paths`, carry thành «thiếu paths») — chứng một nguồn; và When `--ag-root` trỏ một bản lib KHÔNG có `evalListsOf`, Then `s4-args` và `carry-plan` thoát 2 với thông điệp gọi tên `evalListsOf` (không rơi về bộ đọc riêng, không sinh tệp).
- AC-10 (judgment): Given `skills/acceptance/references/eval-executors.md` mục «evals.yaml shape» và `CHANGELOG.md` mục «Chưa phát hành», When người viết eval ở một kho tiêu thụ đọc chúng, Then họ biết: kit đọc trường danh sách viết sát lề lẫn thụt, dạng khối lẫn một dòng; bí danh YAML (`*ten`) trên trường danh sách KHÔNG được giải — thẻ và lượt chấm lên cờ vàng, viết lại thành danh sách; kho đang viết thụt 4 không phải làm gì; và CHANGELOG nêu kho nào bị ảnh hưởng (crm: lượt sửa nay giữ ô xanh cho `paths` dạng khối).
- AC-11: Given danh sách mọi tệp mã của kit (`lib/`, `scripts/`, `feature-loop/`, `hooks/`) có nhắc `evals.yaml` — rút bằng máy lúc chạy, không gõ tay — và bảng phân loại viết trước trong tệp ca (mỗi tệp một kết luận: đọc danh sách qua `evalListsOf` · chỉ đọc trường đơn qua `parseEvals`/`expectedExits` · không đọc nội dung), When so hai danh sách, Then mọi tệp rút ra đều có trong bảng (cây đang kiểm KHÔNG bị báo tệp nào) và mọi tệp kết luận «đọc danh sách qua `evalListsOf`» thật sự gọi `evalListsOf` hoặc `evalPathsOf`; tệp mới chưa phân loại → ĐỎ ghim «bên đọc chưa phân loại: <tệp>»; chiều đỏ trên CÙNG cây: bản sao thêm một tệp đọc `evals.yaml` bằng biểu thức riêng → ĐỎ đúng thông điệp ấy.

## Coverage

Quét bằng morphological-scan (khuôn test-matrix) — bảng đủ ở design doc, mục «Quét không gian AC».

| Trục | Giá trị | AC |
|---|---|---|
| A. Cách viết | thụt 4 · sát lề · mục ngang khoá · `[a, b]` · neo `&a` · bí danh `*a` · khối chữ · ánh xạ một dòng · khoá rỗng | AC-1/2 · AC-1/2/3 · AC-1 · AC-6 · AC-5 · AC-4/5 · AC-4 · AC-4 · AC-4 |
| B. Trường | `inputs` · `paths` · `evidence_required` · mảng bắt buộc | AC-1 (đủ bốn) |
| C. Bên đọc | lượt chấm · lượt sửa · `evalPathsOf` (ghim lại, lọc, lưới) · nhãn bộ chấm mẫu · thẻ · mọi bên đọc khác (lưới đóng lớp) | AC-1/2/4 · AC-6 · AC-3/5 · AC-7 · AC-8 · AC-11 |
| D. Hướng | đọc đúng · cờ có tên · chiều im (sạch không cờ, thụt 4 không đổi) | AC-1/5/6 · AC-4/8 · AC-3/4/8 |

- Chân ngành: [NGÀNH: YAML 1.2 — dãy khối compact cùng cột khoá cha] · [NGÀNH: PyYAML yaml.dump mặc định — dãy không thụt + neo `&id001`].
- Later: giải bí danh thành danh sách thật; khoá lồng và khối chữ chứa chữ `paths:` (hạt giống 20/09).
- Never: bắt kho viết lại tệp; đưa thư viện YAML vào kit.

## Đường đo

- «ba cách viết cho cùng tệp args» — số từ ca AC-1 (ma trận 3 × 3) · AC-1, AC-2 bảo đảm.
- «620 hồ sơ thật 0 lệch ở thụt 4» — số từ `evidence/vi-phan-bay-kho.txt` (từng kho kèm sha, tổng ≥ 620) + ca kit trong suite · AC-3 bảo đảm.
- «không còn đường đọc sát lề rơi im lặng» (ngưỡng CHẾT) — lưới phân loại mọi bên đọc `evals.yaml` · AC-11 bảo đảm.
- «khuôn không đọc được có cờ, không im» — số từ ca AC-4 (4/4 + chiều im) và thẻ AC-8 · AC-4, AC-8 bảo đảm.

## Out of scope

- Giải bí danh YAML (`*ten` → danh sách): cờ vàng có tên đủ cho vòng này; mở lại khi ≥ 3 hồ sơ mang bí danh hoặc ở ≥ 2 kho sau mốc kế.
- Hợp nhất trọn hạt giống 20/09 (`docs/plans/2026-09-20-hat-giong-hop-nhat-bo-doc-paths.md`): đưa danh sách vào `lib/eval-yaml.cjs parseEvals` và bốn hình dạng khối chữ nhiều dòng — latent, 0 lệch; hạt giống giữ làm sổ.
- Khuôn mỗi tiêu chí một dòng `- { id: E1, … }` (21 hồ sơ artifact-platform đã ký): lượt chấm đã dừng to «không có eval nào», không im.
- Đổi khuôn sinh `evals.yaml` hay bắt kho tiêu thụ viết lại tệp (luật 26/09).
- Sửa bất cứ gì ở kho crm.

## Notes

- Ghi chú cho mốc mang vòng này: crm không phải làm gì; lượt sửa của crm sẽ bắt đầu giữ ô xanh cho `paths` dạng khối (393 khai ở crm), nên số lệnh chạy lại mỗi lượt sửa giảm.
