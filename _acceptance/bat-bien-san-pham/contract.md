---
schema_version: 1
feature: "Mỗi kho khai các luật sản phẩm của mình trong một tệp; luật được nạp lúc viết đặc tả, và vòng nào phạm luật thì thẻ cổng nêu tên luật đó"
slug: bat-bien-san-pham
owner: phanlemanh@gmail.com
risk_tier: T2               # theo hàng BB1; đường tệp: scripts/luat-san-pham.cjs (mới) + scripts/can-cu-s1.cjs (A2) + scripts/gate-card.js + scripts/khong-can-nguoi.mjs + SKILL feature-loop (S1, S4 «Mọi verdict», mục sổ) + commands/signoff.md + khuôn trong skills/acceptance/references/ + test + tài liệu — không chạm lib/**, hooks/**, cổng chặn gộp
surfaces: [cli, docs, ui]
design_doc: docs/superpowers/specs/2026-10-11-bat-bien-san-pham-design.md
status: approved
approved_by: Manh Phan
approved_at: 2026-10-11T13:38:58Z
---

# Acceptance Contract: bat-bien-san-pham

## Context

Cổng Đáng 11/10 ký build hàng BB1 (T2). Neo: crm `_acceptance/okr-soat-anh-luot-3` — hai mục «lại ghi cứng
múi giờ Việt Nam» thành giới hạn đã biết vì thẻ không có luật nào để gọi tên; số đo crm `27d47de04` ở
`_acceptance/bat-bien-san-pham/do-11-10/mui-gio-crm.md`. Vòng này cho kit một ổ cắm `PRODUCT-INVARIANTS.md`
ở gốc kho (khuôn trong kit, nội dung của kho), một dòng nạp ở bước thiết kế đứng trên khoá `can_cu` của
vòng A2, câu hỏi «phạm luật SP-n» trên thẻ Cổng Phạm vi, và khối «Luật sản phẩm bị chạm» trên thẻ Cổng
Bằng chứng từ bộ soi dấu hiệu trên diff. Khuôn, luật đỏ, phương án bị loại: design doc.

Làm vật chỉ sau khi A2 lên `main`; commit gốc của vòng = `origin/main` lúc vào S3 (ghi vào Notes khi
vào S3). Kho thử trong mọi ca do code sinh trong lượt (thư mục tạm, `git init`, commit gốc giả làm «gốc
nhánh»); giá trị mong đợi viết sẵn trong ca lúc dựng kho thử, không rút từ đầu ra bộ đọc hay thẻ. Tệp
luật trong kho thử dựng TỪ khối `PRODUCT-INVARIANTS-TEMPLATE` của khuôn (rút bằng marker), không viết tay.

## Criteria

- AC-1: Given khối `PRODUCT-INVARIANTS-TEMPLATE` rút từ `skills/acceptance/references/product-invariants-template.md`, When điền ba luật bằng giá trị viết sẵn (một thường không dấu hiệu · một khó đảo có dấu hiệu và phạm vi · một có câu chứa nháy, `$`, `|`) cùng ba khối sai khuôn (thiếu Chủ luật · mức lạ · dấu hiệu không biên dịch được) và một mã trùng, rồi đọc bằng `docLuat`, Then ra đúng ba luật với mọi trường BẰNG giá trị đã điền, đúng bốn mục sai khuôn mỗi mục một lý do ghim viết sẵn, và `banLuat` bằng `git hash-object` của cùng tệp; chiều đỏ: bản sao khuôn đổi nhãn «Chủ luật» → ca đỏ nêu khuôn ra 0 luật.
- AC-2: Given cây của vòng và commit gốc ghi ở Notes, When dựng thẻ Cổng Phạm vi và Cổng Bằng chứng (HTML và bản rút) cho MỌI hồ sơ trong `_acceptance/` của kit — và của kho trỏ bởi `LS_CRM_ROOT` khi biến có (crm không có tệp luật) — bằng bản ở gốc và bản của vòng, và chạy `khong-can-nguoi.mjs` không ghi trên mọi hồ sơ `verified`, Then mọi cặp bằng nhau từng byte, trừ đúng khoá `luat` mới của bản rút (`{"co_tep":false}`); in số hồ sơ đã so mỗi kho; `LS_CRM_ROOT` vắng → in «crm=vang» có tên, không im; hồ sơ của vòng đã ký → ca in «da-ky» và không so; chân crm chạy một lần trước Cổng Bằng chứng, bản chụp đầu ra ở `_acceptance/bat-bien-san-pham/evidence/vi-phan-crm.txt`; chiều đỏ: bản sao thẻ in khối luật cả khi kho không có tệp → ca đỏ nêu hồ sơ đầu tiên lệch.
- AC-3: Given kho thử có tệp luật hai luật và hồ sơ `draft`, When ghi dòng nạp bằng khuôn `DEC-LUAT-NAP` rút từ SKILL qua CHÍNH khối lệnh `DEC-ID-RECIPE` dưới bash và zsh, rồi dựng thẻ Cổng Phạm vi ở ba ca — có dòng nạp khớp bản · không có dòng nạp · có dòng nạp mà tệp luật đã đổi sau đó, Then bộ xếp lớp đọc dòng nạp ra `da-quyet`, `luat_nap.ban` bằng băm của tệp; ca khớp không cờ, ca thiếu đúng cờ vàng «chưa có dòng nạp», ca đổi đúng cờ vàng «luật đã đổi sau khi nạp» nêu bảy ký tự đầu hai bản; chiều đỏ: bản sao khuôn đổi tên khoá `luat_nap` → ca đỏ nêu ca khớp ra cờ thiếu.
- AC-4: Given hồ sơ nháp của kho thử có một dòng S1 nguồn mục-tiêu trích đúng câu của luật SP-2 và một dòng trích câu ngoài mọi khối luật, When dựng thẻ Cổng Phạm vi với gốc nhánh, Then dòng thứ nhất trong khối «Máy đã quyết ở bước thiết kế» mang «theo luật SP-2», dòng thứ hai không mang mã nào, và cả hai vẫn qua luật câu trích của A2 (câu trích chỉ có trong nhánh → đỏ `sinh-trong-vong` như A2).
- AC-5: Given ma trận dòng S1 mang `pham_luat` viết sẵn — chỉ-người + luật thường · chỉ-người + luật khó đảo + `kho_dao: true` · chỉ-người + luật khó đảo + `kho_dao: false` · mục-tiêu + `pham_luat` · một-lối + `pham_luat` — When phân loại và dựng thẻ Cổng Phạm vi, Then hai ca đầu ra câu hỏi `Hỏi-<n>` mở đầu «Phạm luật SP-n — <câu luật> (chủ luật: <tên>)», nhãn khó-đảo đúng ca thứ hai; ca ba đỏ `luat-kho-dao`, ca bốn và năm đỏ `pham-luat-may-quyet`, mỗi ca đúng thông điệp ghim viết sẵn và dòng lệnh duyệt không điền sẵn; chiều đỏ: với mỗi luật đỏ, bản sao mô-đun gỡ đúng luật đó → ca tương ứng đỏ nêu mã luật, trong khi bản lành xanh trên cùng ma trận.
- AC-6: Given dòng S1 mang `pham_luat: "SP-9"` khi tệp luật chỉ có SP-1, SP-2, và cùng dòng ấy ở kho KHÔNG có tệp luật, When phân loại, Then cả hai đỏ `luat-vang` với thông điệp «mã luật không có trong tệp luật sản phẩm» và thẻ in cờ đỏ nêu mã dòng; chiều đỏ: bản sao mô-đun bỏ phép tra mã → ca đỏ nêu SP-9.
- AC-7: Given kho thử có tệp luật và ba nhánh vòng — một commit sửa `PRODUCT-INVARIANTS.md` mang dòng `Co-Authored-By: Claude` · một commit sửa tệp không mang dòng đó · không chạm tệp luật — When chạy `luat-san-pham.cjs --quet --write` rồi dựng thẻ Cổng Bằng chứng và chạy `khong-can-nguoi.mjs`, Then nhánh một: `sua_tep_luat.may` == [sha viết sẵn], thẻ có cờ đỏ «Vòng này sửa tệp luật sản phẩm — máy không sửa luật; tách thành commit riêng của chủ kho», ô `Tệp luật: ___`, không đi làn V, `khong-can-nguoi` thoát 2 nêu «luật sản phẩm»; nhánh hai: `sua_tep_luat.nguoi` == [sha], không cờ đỏ, một dòng báo «Chủ kho sửa tệp luật trong nhánh vòng (1 commit)»; nhánh ba (đối chứng dương): cả hai mảng rỗng, không cờ, `khong-can-nguoi` thoát 0; chiều đỏ: bản sao bộ soi bỏ tách máy/người → ca đỏ nêu nhánh hai ra cờ đỏ.
- AC-8 (cross-layer): Given kho thử dựng theo hình dạng hồ sơ `okr-soat-anh-luot-3` — luật SP-1 khó đảo, dấu hiệu `Asia/Ho_Chi_Minh|\+07:00`, phạm vi `apps/**` — và nhánh vòng thêm `muiGio: "Asia/Ho_Chi_Minh"` vào `apps/app/lib/a.ts`, thêm cùng chuỗi vào `tests/a.spec.ts` (ngoài phạm vi) và vào `_acceptance/x/notes.md`, When chạy `luat-san-pham.cjs --quet --write`, dựng thẻ Cổng Bằng chứng và chạy `khong-can-nguoi.mjs`, Then `luat-cham.json` có đúng một chạm `{SP-1, apps/app/lib/a.ts, <dòng viết sẵn>}`; thẻ có khối «Luật sản phẩm bị chạm» nêu SP-1 · câu luật · chủ luật · nhãn khó-đảo · `apps/app/lib/a.ts:<dòng>`; dòng lệnh có ô `SP-1: sửa vật` (khuyến nghị điền sẵn); `routing.hoi` có `SP-1`; không đi làn V; `khong-can-nguoi` thoát 2 nêu «luật sản phẩm»; mục «Ngoài hợp đồng» của `review-findings.md` (dựng theo khuôn OOC-ITEM-TEMPLATE) có chữ nhắc «SP-1» mang nhãn «luật SP-1 · khó đảo», mục nhắc «SP-9» (không có trong tệp) không mang nhãn; và `luat-cham.json` vắng hoặc lệch `verified_commit` → cờ vàng «Chưa soi luật sản phẩm trên bản đã chấm» và cũng không đi làn V; chiều đỏ: bản sao bộ soi bỏ lọc phạm vi → ca đỏ nêu `tests/a.spec.ts`; bản sao xoá luật SP-1 khỏi tệp → khối vắng (đối chứng: bản lành có khối).
- AC-9 (judgment): Given `feature-loop/skills/feature-loop/SKILL.md` (S1 kể cả ý (4) của phản biện context sạch ở S1 mục 7, S4 «Mọi verdict», mục «Sổ quyết định»), `commands/signoff.md`, `skills/acceptance/references/human-facing-language.md` (danh sách nhãn ô), `skills/acceptance/references/product-invariants-template.md`, `GUIDE.md`, `CONTEXT.md` và ADR mới về luật sản phẩm, When người của một kho tiêu thụ đọc, Then biết: viết tệp luật thế nào và tệp là của kho (máy không sửa); vắng tệp thì không gì đổi; bước thiết kế nạp và ghi dòng nạp ra sao; lựa chọn theo luật và phạm luật ghi thế nào; thẻ hai cổng hiện gì và trả lời ô `SP-<số>` / `Tệp luật` ra sao (hai lối «chấp nhận có tên» · «sửa vật», khuyến nghị điền sẵn «sửa vật»); kho thêm một dòng trỏ tệp luật vào `CLAUDE.md` để bộ tìm lỗi ở lượt chấm thấy luật; thuật ngữ «Luật sản phẩm» có định nghĩa và từ tránh; ADR nói ai phê phần CỘNG, vì sao đường cố định không khoá config, và đường đảo; phản biện context sạch có câu soi «lựa chọn trái luật đã nạp mà sổ không ghi `pham_luat`». Và (máy) khối S4 «Mọi verdict» rút từ SKILL có lệnh `luat-san-pham.cjs --quet … --write` đứng ngay sau lệnh `thuoc-vat.mjs … --write`; chiều đỏ: bản sao SKILL xoá dòng đó → ca đỏ nêu «luat-san-pham».
- AC-10: Given hồ sơ nháp của AC-5 (hai câu phạm luật) và hồ sơ Cổng Bằng chứng của AC-8, When dựng hai thẻ và đọc bản rút, Then mọi câu luật nằm trong khối «VIỆC CỦA ANH» và dòng lệnh DUY NHẤT của chính thẻ đó (Cổng Phạm vi: `Hỏi-<n>` của A2; Cổng Bằng chứng: `SP-<số>`, `Tệp luật`), không có lệnh thứ hai, không có cổng hay bước dừng mới; mọi nhãn ô thẻ in đều có trong danh sách `GATE-ONESHOT-SLOTS` (round-trip rút từ thẻ thật); và (nhìn) ở khổ 1280×800 và 390×844, người đọc nói được trong một màn đọc luật nào bị chạm, ở đâu, và phải trả lời gì; khổ 390 không cuộn ngang.

- AC-11: Given kho thử do code sinh có tệp luật commit ngày D và sáu hồ sơ — một mở trước D · một sau D có dòng nạp · một sau D thiếu dòng nạp · một có dòng S1 mang `pham_luat` (và một dòng `pham_luat` bị thay) · một có `luat-cham.json` hai chạm và một mục ngoài hợp đồng nhắc SP-1 · một có `sua_tep_luat` một sha máy và một sha người — When chạy `node scripts/luat-san-pham.cjs --root <kho> --dem --tu D` dạng chữ và `--json`, Then lệnh in ngày khai D và bảng của năm hồ sơ sau D, mỗi cột (dòng nạp · phạm ở thiết kế · chạm trên diff · nhãn ngoài hợp đồng · máy sửa tệp luật · chủ kho sửa tệp luật) BẰNG bảng viết sẵn; không `--tu` thì có cả hồ sơ trước D; chiều đỏ: bản sao đếm cả dòng bị thay → ca đỏ nêu hồ sơ và cột lệch.

## Coverage

Quét bằng `morphological-scan` (trục tự dựng) — bản đầy đủ ở `_acceptance/bat-bien-san-pham/coverage-scan.md`.
Chân sản phẩm: ô cơ hội đã ký và số đo crm `[SUY-TỪ-REPO: _acceptance/bat-bien-san-pham/opportunity.md]`,
khoá `can_cu` của A2 `[SUY-TỪ-REPO: nhánh vong/a2-thiet-ke-khong-hoi-thua, scripts/can-cu-s1.cjs]`. Chân
ngành: `[NGÀNH: The AI-Native SDLC playbook — Requirements and design]` (nạp lúc viết, cờ có chủ luật, ghi
phiên bản luật), `[NGÀNH: ArchUnit]` (luật thành phép kiểm, vi phạm nêu tên luật), `[NGÀNH: Conftest/OPA]`
(luật khai một chỗ, chạy trên diff, mỗi vi phạm mang mã).

- Trục A — tệp luật của kho: vắng · hợp lệ · có khối sai khuôn · đổi sau khi nạp  [thước CE: luật 26/09 + khuôn marker một nguồn + playbook ghi phiên bản luật] → AC-1, AC-2, AC-3
- Trục B — quan hệ của vòng với một luật: không chạm · theo luật · phạm ở thiết kế · phạm trên diff · sửa tệp luật · nêu mã không có  [thước CE: bốn lớp căn cứ của A2 + Conftest (vi phạm trên diff) + ADR 0007 (tệp người viết)] → AC-4, AC-5, AC-6, AC-7, AC-8
- Trục C — mức luật: thường · khó đảo  [thước CE: danh sách khó-đảo của bất biến dừng] → AC-5, AC-8
- Trục D — mặt đọc: thẻ Cổng Phạm vi · thẻ Cổng Bằng chứng · làn V · hồ sơ đời trước · lệnh đếm của đường đo  [thước CE: hai cổng có sẵn — không thêm cổng; ngưỡng UAT của ô] → AC-3, AC-7, AC-8, AC-10, AC-11
- Cross-cutting: kho không có tệp không đổi byte; mọi câu luật vào dòng lệnh duy nhất của thẻ có sẵn → AC-2, AC-10
- Later: bộ rà ở lượt chấm nhận tệp luật · nhiều tệp / đường khác qua khoá config · ngoại lệ luật có hạn dùng.
- Never: máy sửa tệp luật · kit chở luật mẫu của một tổ chức · cờ «chưa khai luật» cho kho không có tệp · bộ đọc nghĩa luật bằng model ở cổng.

## Đường đo

- Mọi vòng mới của crm có dòng nạp ở bước thiết kế · số từ: `node scripts/luat-san-pham.cjs --root <crm> --dem --tu <ngày khai>`, cột «dòng nạp» (ngày khai = ngày commit đầu của tệp luật, lệnh in nó) · AC-3, AC-11.
- ≥ 1 lần thẻ cổng nêu đúng tên một luật bị chạm trước khi gộp (kèm N vòng) · số từ: cùng lệnh, cột «phạm ở thiết kế» + «chạm trên diff» + «nhãn ngoài hợp đồng» · AC-5, AC-8, AC-11.
- 0 lần máy sửa tệp luật · số từ: cùng lệnh, cột «máy sửa tệp luật» · AC-7, AC-11.
- 0 lượt gọi người thêm mỗi vòng · số từ: ba dòng số của mốc (luật chiều rộng (c)), so vòng crm trước/sau ngày khai · AC-10 bảo đảm không có dòng lệnh hay cổng mới.
- Vế CHẾT «mục ngoài hợp đồng cùng lớp một luật đã khai mà thẻ không gọi tên»: đọc tay `review-findings.md` các vòng crm trong cửa sổ 30 ngày, so với `luat-cham.json` cùng hồ sơ — không có lệnh (giới hạn đã khai ở design doc §4).

## Out of scope

- Đưa tệp luật thẳng vào lời nhắc bộ tìm lỗi ở lượt chấm — sửa bộ chấm (`feature-loop/workflows/`, vùng máy kia); vòng này chỉ gắn nhãn khi bộ tìm lỗi tự nhắc mã (kho trỏ tệp luật trong `CLAUDE.md`).
- Viết nội dung luật cho bất kỳ kho nào — crm tự viết bản đầu bằng commit riêng; kit không chở luật mẫu.
- Sửa crm cho múi giờ, đồng tiền, mã quốc gia thành cấu hình — việc sản phẩm của crm.
- Khoá config trỏ đường tệp luật; nhiều tệp luật; ngoại lệ luật có hạn dùng.
- Cờ «chưa khai luật» cho kho không có tệp.
- Sửa khối TRONG-DOT, `dieu-phoi/`, `feature-loop/scripts/`, `feature-loop/workflows/`, `scripts/cat-luot.mjs`, `skills/cat-luot/`, `lib/**`, `hooks/**`.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/luat-san-pham.ca.mjs`, gọi từ phần bash của `tests/scripts/run-tests.sh` → chạy
  bằng `config:executors.test.scripts_bash` có sẵn (cùng lệnh suite, không thêm khoá executor).
- Thứ tự với A2: vòng này sửa `scripts/can-cu-s1.cjs` và hai khối thẻ của A2 — S3 chỉ bắt đầu khi PR A2 đã
  gộp (`gh pr list --repo phanlemanh/acceptance-gate-kit --state merged --search buoc-len-thiet-ke-khong-hoi`);
  cập nhật nhánh từ `origin/main` trước task đầu.
- Giới hạn đã khai (design doc §4, mỗi mục kèm ngưỡng): bộ soi diff khớp chữ theo dấu hiệu kho tự khai ·
  bộ tìm lỗi thấy luật chỉ khi kho trỏ tệp trong `CLAUDE.md` · tách commit máy/người bằng dòng đồng tác
  giả · chân crm của AC-2 chạy tay một lần.
- Commit gốc của vòng: `e8ef5e20ef534287c5eb30466a0289c96bbed041` (đỉnh nhánh A2 lúc vào S3 12/10 — A2 bị giữ khỏi main tới sau mốc 2.27.0; đổi thành `origin/main` có A2 trước S4) — ca LS-02 đọc sha từ dòng này.
