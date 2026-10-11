---
schema_version: 1
feature: Bước lên thiết kế không dừng hỏi người — lựa chọn có căn cứ máy tự quyết và ghi sổ kèm căn cứ, câu chỉ người biết hoặc khó-đảo lên thẻ Cổng Phạm vi thành câu hỏi, và máy tự quyết một câu chỉ-người-biết thì đỏ
slug: buoc-len-thiet-ke-khong-hoi
owner: phanlemanh@gmail.com
risk_tier: T3               # theo hàng A2 + lời giao (Gate 1.5); đường tệp: SKILL feature-loop (S1 + mục sổ) + scripts/can-cu-s1.cjs (mới) + scripts/gate-card.js + test + tài liệu — không chạm lib/**, hooks/**, cổng chặn gộp (máy suy T2, không tự đổi)
surfaces: [cli, docs, ui]
design_doc: docs/superpowers/specs/2026-10-11-buoc-len-thiet-ke-khong-hoi-design.md
status: approved
approved_by: Manh Phan
approved_at: 2026-10-11T10:17:27Z
---

# Acceptance Contract: buoc-len-thiet-ke-khong-hoi

## Context

Cổng Đáng 11/10 ký build hàng A2 (T3). Sổ bước thiết kế của crm 22/09–11/10: 28/51 lựa chọn chủ kho
trả lời giữa bước thiết kế có căn cứ máy đã có, 23/51 chỉ người có; chính lời dặn S1 mục 1 của kit dạy
máy dừng hỏi. Vòng này viết lại luật bước thiết kế (ngoài đợt), thêm khoá máy đọc `can_cu` cho dòng sổ
S1, dựng bộ phân loại `scripts/can-cu-s1.cjs`, và cho thẻ Cổng Phạm vi tách «câu chỉ anh trả lời được»
khỏi «máy đã quyết». Khuôn, luật đỏ và phương án bị loại: design doc.

Commit gốc của vòng: `08ba287d` (origin/main lúc mở ô). Kho thử trong mọi ca do code sinh trong lượt
(thư mục tạm, `git init`, commit gốc giả làm «gốc nhánh»); giá trị mong đợi viết sẵn trong ca lúc dựng
kho thử, không rút từ đầu ra bộ phân loại hay thẻ.

## Criteria

- AC-1 (judgment): Given mục S1 và danh sách dừng đầu skill vòng (`feature-loop/skills/feature-loop/SKILL.md`) cùng design doc §3.1, When đọc lời dặn bước thiết kế ngoài đợt, Then: không còn lời dặn nào bảo máy dừng xin duyệt thiết kế hay hỏi «làm ngay chứ?» giữa bước thiết kế; mỗi lựa chọn được xếp theo một trong ba nguồn căn cứ kèm việc máy làm với từng nguồn; không trỏ được căn cứ thì là «chỉ người có»; khó-đảo luôn là câu hỏi; câu chỉ-người-biết được soạn nháp theo khuyến nghị và lên thẻ Cổng Phạm vi, không hỏi giữa chừng; Cổng Phạm vi không đi tiếp tự động khi sổ còn câu chỉ-người-biết hoặc dòng đỏ; điểm vũ trang `/goal` đầu tiên là lời mời Cổng Đáng; phản biện context sạch soi MỌI dòng máy đã quyết (chạm khó-đảo mà ghi không · câu trích có quyết được lựa chọn không · lối khác có thật chết không · lựa chọn chỉ-người-biết bị ghi là máy quyết hay không ghi) và P0 xử lý bằng dòng S1 mới mang `supersedes`; người lật một lựa chọn ở Cổng Phạm vi thì máy ghi một dòng sổ theo khuôn `DEC-LAT-GATE1` trước khi soạn lại.
- AC-2: Given cây của vòng và commit gốc `08ba287d`, When so mọi khối marker có sẵn của skill vòng và các vùng cấm chạm, Then mọi khối có ở gốc (TRONG-DOT, DEC-ID-RECIPE, DEC-TARGET-SLOT, GOAL-TEMPLATE và các khối còn lại) giống từng byte, khối mới đúng là {`DEC-CAN-CU-SLOT`, `DEC-LAT-GATE1`}, và `feature-loop/scripts/`, `feature-loop/workflows/`, `dieu-phoi/`, `scripts/cat-luot.mjs`, `skills/cat-luot/`, `lib/`, `hooks/`, `scripts/pre-merge-check.sh` không đổi; chiều đỏ: bản sao skill đổi một ký tự trong TRONG-DOT → ca đỏ nêu tên khối.
- AC-3: Given ba khuôn rút từ khối `DEC-CAN-CU-SLOT` của skill, When điền giá trị viết sẵn rồi ghi vào sổ của kho thử bằng CHÍNH khối lệnh `DEC-ID-RECIPE` chạy dưới bash và zsh, Then bộ phân loại đọc lại ra lớp `da-quyet` · `da-quyet` · `cau-hoi` và mọi trường đọc được BẰNG giá trị đã điền; chiều đỏ: bản sao skill đổi tên khoá trong khuôn → ca đỏ nêu khuôn ra lớp `doi-truoc`.
- AC-4: Given ma trận dòng sổ S1 viết sẵn — nguồn mục-tiêu hợp lệ (có gốc nhánh và không), thiếu con trỏ, tệp vắng, câu trích ngắn, câu trích không có, trỏ vào vật của chính vòng (hợp đồng, design doc, sổ), ô cơ hội chưa ký, ô cơ hội đã ký mới trong nhánh, câu trích chỉ có trong nhánh, gốc nhánh không đọc được, một-lối có/thiếu lối chết, chỉ-người có/thiếu khuyến nghị, khó-đảo trên mục-tiêu · một-lối · chỉ-người, nguồn lạ, dòng không có `can_cu`, dòng bị một dòng sau thay (`supersedes`), dòng ngoài S1 — When phân loại, Then mỗi ca ra đúng lớp và đúng thông điệp ghim viết sẵn (so bằng nhau từng ca); chiều đỏ: với mỗi luật đỏ, bản sao mô-đun gỡ đúng luật đó → ca tương ứng đỏ nêu mã luật, trong khi bản lành xanh trên cùng ma trận.
- AC-5: Given hồ sơ nháp của kho thử có hai câu chỉ-người-biết (một khó-đảo), một dòng mục-tiêu hợp lệ, một dòng một-lối, một dòng S1 đời trước và một dòng S2, When dựng thẻ Cổng Phạm vi và bản rút, Then thẻ có khối «Câu chỉ anh trả lời được» với Hỏi-1, Hỏi-2 theo thứ tự sổ (mỗi câu có khuyến nghị và lối khác; nhãn khó-đảo đúng câu), khối «Máy đã quyết ở bước thiết kế» in câu trích + tệp và lối chết, khối «Quyết định & trade-off» chỉ còn dòng đời trước và dòng S2; «VIỆC CỦA ANH» có một mục mỗi câu; bản rút có `routing.hoi` == [«duyệt hay sửa», «Hỏi-1», «Hỏi-2»] và `can_cu` đếm 2 · 2 · 0 · 1; dòng lệnh duyệt điền sẵn «duyệt»; câu trả lời mẫu không đổi. Và bản có thêm một dòng đỏ → cờ đỏ nêu mã dòng + thông điệp, dòng lệnh để trống; bản dựng thẻ không truyền gốc nhánh → đúng một cờ vàng «chưa kiểm câu trích có từ trước vòng»; chiều đỏ: bản sao thẻ đưa câu hỏi vào khối máy-đã-quyết → ca đỏ nêu mã dòng.
- AC-6: Given cây của vòng, When chạy bộ phân loại trên mọi sổ quyết định của mọi hồ sơ trong `_acceptance/`, dựng thẻ Cổng Phạm vi cho mọi hồ sơ đã qua Cổng Phạm vi, và đọc sổ có/không khoá `can_cu` bằng các bộ đọc khác (tóm tắt hồ sơ, quét bài học, sức khoẻ vòng), Then 0 dòng đỏ trên hồ sơ có sẵn (in số hồ sơ, số dòng đã đọc và số dòng `stage: gate1` mang `supersedes`), không thẻ nào của hồ sơ đã qua Cổng Phạm vi mang cờ của vòng này, các bộ đọc khác ra cùng kết quả; hồ sơ nháp chỉ có dòng S1 đời trước mang đúng một cờ vàng «dòng sổ đời trước».
- AC-7: Given kho thử ba hồ sơ (dòng gate1 `supersedes` một dòng S1 máy đã quyết · `supersedes` một câu hỏi · `supersedes` một dòng S2 · không lật), When chạy `node scripts/can-cu-s1.cjs --root <kho> --dem` dạng chữ và `--json`, Then số từng hồ sơ BẰNG bảng viết sẵn (máy quyết bị lật chỉ đếm dòng S1 lớp `da-quyet`; câu hỏi chọn khác đếm riêng); và dòng lật ghi bằng khuôn `DEC-LAT-GATE1` rút từ skill qua CHÍNH khối lệnh `DEC-ID-RECIPE` được đếm là 1; chiều đỏ: bản sao đếm mọi `supersedes` → ca đỏ nêu hồ sơ lệch, và bản sao khuôn đổi `stage` → ca đỏ nêu khuôn ra 0.
- AC-8 (judgment): Given `GUIDE.md` (mục sổ quyết định), `CONTEXT.md` và ADR mới `docs/adr/0022-can-cu-lua-chon-buoc-thiet-ke-la-khoa-may-doc.md`, When người của kho tiêu thụ đọc, Then biết ghi khoá `can_cu` thế nào cho từng nguồn, dòng cũ được đọc ra sao, thẻ hiện gì; thuật ngữ «Nguồn căn cứ» có định nghĩa và từ tránh; ADR nói vì sao khoá này không trái ADR 0021 (máy đọc, không phải câu thứ tư để đọc), ai đã phê phần CỘNG và đường đảo.
- AC-9: Given hồ sơ nháp của AC-5 do code sinh trong lượt, When mở thẻ Cổng Phạm vi ở khổ 1280×800 rồi 390×844, Then (nhìn) khối câu hỏi đứng trước khối máy-đã-quyết, mỗi câu đọc được khuyến nghị và lối khác, mỗi dòng máy-đã-quyết đọc được câu trích và tệp, người đọc nói được trong một màn đọc máy đã quyết gì và còn hỏi gì; khổ 390 không cuộn ngang.
- AC-10: Given sổ quyết định của chính vòng này, When phân loại với gốc nhánh `08ba287d`, Then 0 dòng đỏ, đúng 3 câu hỏi (phần CỘNG · câu gộp áp lối khác · bỏ bản mẫu nhìn), 10 dòng máy đã quyết và 3 dòng bị thay — vòng tự đi đúng luật nó dựng, kể cả nhát thay sau phản biện.

## Coverage

Quét bằng `morphological-scan` (trục tự dựng, preset test-matrix không khớp) — bản đầy đủ ở
`_acceptance/buoc-len-thiet-ke-khong-hoi/coverage-scan.md`. Chân sản phẩm: luật lời mời 01/09 và S1 mục 1
`[SUY-TỪ-REPO: CLAUDE.md, feature-loop/skills/feature-loop/SKILL.md]`, 51 dòng sổ crm đã xếp
`[SUY-TỪ-REPO: _acceptance/buoc-len-thiet-ke-khong-hoi/do-11-10/so-s1-crm.md]`. Chân ngành: `[NGÀNH:
Architecture Decision Records — Nygard]` cho «quyết định + căn cứ + hệ quả», `[NGÀNH: RACI]` cho tách
«ai quyết» khỏi «ai được báo».

- Trục A — nguồn căn cứ: mục tiêu + quy tắc · một lối ra · chỉ người có · vắng (đời trước) · giá trị lạ  [thước CE: luật lời mời 01/09 + 51 dòng sổ crm, mỗi dòng rơi đúng một giá trị] → AC-1, AC-3, AC-4
- Trục B — khó-đảo: không · có  [thước CE: danh sách khó-đảo của bất biến dừng] → AC-1, AC-4, AC-5
- Trục C — con trỏ căn cứ: hợp lệ · thiếu · tệp vắng · câu trích ngắn/không có · tự biện minh · ô chưa ký · sinh trong vòng · gốc không đọc được  [thước CE: lớp lỗi «ô tự biện minh», «thước ghim vào thứ sẽ đổi»] → AC-4, AC-10
- Trục D — mặt đọc: thẻ Cổng Phạm vi · đi-tiếp/dừng ở Cổng Phạm vi · bộ kiểm sổ · phản biện context sạch · đường đo  [thước CE: RACI — mỗi mặt trả lời một câu] → AC-1, AC-5, AC-7, AC-9
- Cross-cutting: hồ sơ đã có không đổi màu, bộ đọc khác không đổi kết quả, khối TRONG-DOT và các khuôn có sẵn giữ từng byte → AC-2, AC-6
- Later: câu gộp «duyệt; Hỏi-n = lối» · cổng chặn gộp kiểm sổ S1 · bộ đếm lượt hỏi thành lệnh của kit · khối trong đợt gom câu về Cổng Phạm vi · đánh giá bộ phân loại bằng model thật.
- Never: bỏ hỏi toàn bộ · sửa skill brainstorming bên thứ ba · danh sách chủ đề «luôn hỏi» làm bộ phân loại duy nhất.

## Đường đo

- 0 lần máy dừng hỏi giữa mở vòng và Cổng Phạm vi, ba vòng crm liền · số từ: `_acceptance/buoc-len-thiet-ke-khong-hoi/do-11-10/s1_hoi.py` chạy trên transcript của máy chạy vòng crm, đọc ở phiên nghiệm thu (công cụ đo có sẵn trong hồ sơ; giới hạn: chỉ thấy transcript của máy đó) · AC-1 bảo đảm lời dặn không còn gây dừng.
- 0 vòng ký lại vì lựa chọn máy tự quyết bị lật · số từ: `node scripts/can-cu-s1.cjs --root <kho crm> --dem`, cột «máy quyết bị lật» · AC-7.

## Out of scope

- Câu gộp của lệnh duyệt nhận «duyệt; Hỏi-n = lối» để áp lối khác không ký lại — khuyến nghị hàng riêng ngay sau vòng này; chủ kho quyết ở câu hỏi của Cổng Phạm vi (chạm lệnh duyệt, ngoài ranh giới tệp lời giao).
- Phát lại 51 dòng sổ crm qua bộ phân loại (ứng viên 8 của ô) — bộ phân loại không đọc nghĩa câu; phát lại qua model là hàng G3.
- Cổng chặn gộp (lõi cưỡng chế) kiểm sổ S1 — thẻ và điều kiện dừng Cổng Phạm vi là chỗ dòng đỏ có hiệu lực.
- Khối TRONG-DOT (đợt Điều phối – Thợ, máy M5) — không sửa; câu chỉ-người-biết trong đợt vẫn theo khối đó.
- Bộ đếm lượt hỏi giữa bước thiết kế thành lệnh của kit (ứng viên 10 của ô); đếm transcript ở máy khác.
- Đánh giá bộ phân loại của máy bằng gọi model thật (hàng G3); luật cỡ vòng ở bước thiết kế (hàng S3c).

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/can-cu-s1.ca.mjs`, gọi từ phần bash của `tests/scripts/run-tests.sh` → chạy bằng
  `config:executors.test.scripts_bash` có sẵn, tất định (không trôi giữa các mảnh mjs) và trùng lệnh suite
  nên không tốn thêm lượt. Không thêm khoá executor: sửa `_acceptance/config.yaml` làm cũ hồ sơ khác.
- Ca ghim chữ S1 của skill (P85b ở `tests/plugins/run-tests.sh`) đổi kim theo chữ mới, giữ một mũi tiêm
  mỗi kim.
- Giới hạn đã khai (design doc §4): máy dán nhãn «mục tiêu» bằng một câu trích có thật, có từ trước vòng
  nhưng không quyết được lựa chọn — bộ kiểm tất định không bắt; lưới là phản biện context sạch + thẻ in
  câu trích. Ngưỡng mở ô: ≥ 1 lần chủ kho lật một dòng máy đã quyết ở Cổng Phạm vi (đếm bằng `--dem`).
  Cùng lớp: `kho_dao` và `loi_chet` là nhãn máy tự gán — lưới là phản biện context sạch soi mọi dòng máy
  đã quyết; ngưỡng: ≥ 1 dòng máy đã quyết chạm khó-đảo bị lật ở Cổng Phạm vi.
- Lệnh dựng thẻ truyền gốc nhánh khi sổ bước thiết kế có dòng mang `can_cu` (`commands/acceptance-card.md`
  bước 3); không truyền thì thẻ nháp có cờ vàng, không im.
