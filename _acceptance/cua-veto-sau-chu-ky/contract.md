---
schema_version: 1
feature: Chữ ký người ở Cổng Bằng chứng đóng cửa veto — lưới trước-merge và máy quét /start thôi nói «owner chưa veto» về hồ sơ người đã ký
slug: cua-veto-sau-chu-ky
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm scripts/pre-merge-check.sh (t3_paths)
surfaces: [cli]
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-09-12T02:30:53Z
design_doc: docs/superpowers/specs/2026-09-11-cua-veto-sau-chu-ky-design.md
---

# Acceptance Contract: cua-veto-sau-chu-ky

## Context

Lưới trước-merge báo «cửa veto mở», «owner chưa veto» cho hồ sơ mà người ĐÃ KÝ ở Cổng
Bằng chứng. Hai chỗ trong `scripts/pre-merge-check.sh` gây ra điều này:

- NOTE làn V ở dòng 777–778: nhánh gộp «xanh-sạch HOẶC đã ký».
- Dòng tổng veto-trace ở dòng 1352–1355 và 1384–1386: đếm mọi `veto_state: mo`.

Máy quét `/start` (`scripts/start-scan.mjs`, `vetoOpen[]`) lặp lại đúng câu đó. Đo
11/09: trong kit, 27 trên 30 tên ở dòng tổng đã ký; media-library 3/3; floorplanstudio
1/1. Chỉ 3 cửa trong kit mở thật. Đề bài là lỗ C3 của đợt rà 22/08. Owner gọi tên ngày
11/09 và chốt bản sửa phải nằm trong kit: bản vá tại chỗ `_vapp` của media-library đã
mất hai lần vì chép đè.

Luật: cửa veto mở ⇔ `veto_state: mo` ∧ `human_signoff` (frontmatter dẫn đầu) không
phải chữ ký thật. Luật chỉ đổi LỜI, không đổi CHẶN.

Source input: prompt — tin gọi tên của owner 11/09/2026 + đề bài C3 (đợt rà 22/08) ·
thiết kế: `docs/superpowers/specs/2026-09-11-cua-veto-sau-chu-ky-design.md`.

## Criteria

- AC-1: Given hồ sơ làn V (`approved_by` rỗng, `veto_state: mo`, `veto_opened_at` parse được, T2) có `human_signoff` là chữ ký thật, When chạy `pre-merge-check.sh`, Then:
  - lưới in ĐÚNG MỘT dòng `NOTE [<slug>]` chứa «cửa veto đã đóng bằng chữ ký»;
  - lưới KHÔNG in «cửa veto mở» cho slug đó;
  - slug KHÔNG có tên trong dòng «cửa veto đang mở».

  Chiều đỏ cùng fixture: bản sao gỡ nhánh mới thì câu «cửa veto mở» quay lại.
- AC-2: Given hồ sơ làn V xanh-sạch mà `human_signoff` RỖNG (trường hợp thật), When chạy lưới, Then lưới VẪN in `NOTE [<slug>]: làn V — máy đi trước, Cổng 1 không có chữ duyệt; cửa veto mở` nguyên văn, VÀ slug có tên trong dòng «cửa veto đang mở». Đối chứng cặp: cùng fixture, chỉ thêm chữ ký, thì cả hai dòng đổi theo AC-1. Bản sao coi mọi `mo` là đã đóng thì phép đo ĐỎ, nêu «cửa thật bị giấu».
- AC-3: Given hồ sơ `veto_state: mo` có `approved_by` có tên, When chạy lưới, Then:
  - dòng tổng đếm slug đó khi và chỉ khi `human_signoff` không phải chữ ký thật;
  - con số N trong dòng tổng BẰNG số tên được liệt;
  - khi mọi hồ sơ `mo` đều đã ký, lưới KHÔNG in dòng tổng nào (im, như khi không có cửa veto).
- AC-4: Given `veto_state: mo` và `human_signoff` khớp một mẫu giữ-chỗ, When chạy lưới và máy quét, Then cửa vẫn MỞ ở CẢ HAI bộ đọc:
  - lưới liệt slug, không có câu «đã đóng», và VIOLATION giữ-chỗ của luật chữ ký vẫn nổ nguyên văn;
  - máy quét cho `humanSignoff: false`, và slug có trong `vetoOpenUnsigned[]`.

  Bảng mẫu giữ-chỗ có **MỘT nguồn** trong `lib/evidence-core.cjs` (đổi khuôn S4-r2); cả hai bộ đọc hỏi nó. Ma trận vẫn TOÀN PHẦN để chứng mỗi mẫu đi trọn đường ở cả hai đường gọi: mọi mẫu RÚT lúc chạy từ chính bảng ấy × hai bộ đọc, số assert = 2 × số mẫu, sàn ≥ 3 mẫu. Chiều đỏ: một bản sao coi chuỗi không rỗng bất kỳ là chữ ký, và một bản sao máy quét bỏ một mẫu khỏi bảng JS. Mỗi bản sao cho ĐỎ với thông điệp riêng: «giữ-chỗ đóng cửa» và «máy quét coi giữ-chỗ <mẫu> là chữ ký».
- AC-5: Given `status: signed-off` mà `human_signoff` rỗng hoặc báo cáo vắng, When chạy lưới và máy quét, Then cửa vẫn MỞ ở cả hai bộ đọc: nhãn status KHÔNG đóng cửa, chỉ chữ ký thật mới đóng.
- AC-6 (đổi khuôn S4-r2 — owner quyết 12/09): Given vị từ «chữ ký thật» có **MỘT nguồn** là `chuKyThat()` trong `lib/evidence-core.cjs` — sở hữu TRỌN ngữ pháp: nhận diện khối frontmatter (dấu mở · dấu đóng · luật cột), cách viết khoá (hoa/thường · `:` hay `=` · khoảng trắng), bảng giữ-chỗ, và bốn ca rỗng/vắng/chỉ-ở-thân/không-giải-được — When `scripts/start-scan.mjs` (import) và `scripts/pre-merge-check.sh` (gọi qua `node`, cùng nếp `lop-nhin-thay`) hỏi cùng một báo cáo, Then:
  - (0) **một nguồn, đo được**: không tệp nào dưới `scripts/` giữ bảng giữ-chỗ hay biểu thức đọc `human_signoff` của riêng nó; thêm một bảng thứ hai vào bản sao → ĐỎ, thông điệp gọi tên tệp mọc bảng;
  - hai bộ đọc khớp nhau **theo cấu trúc** (cùng một hàm), nên phép đo chuyển sang chứng: (0) ở trên, và từng ô ngữ pháp cho ra ĐÚNG kết luận hợp đồng nói.

  Ma trận khai TRƯỚC là veto (vắng · `mo` · `da-veto`) × Cổng 1 (`approved_by` có · rỗng) × 18 ô chữ ký = **108 ô**. Mười tám ô chữ ký:
  - thật: trần · nháy kép · nháy đơn · chú thích đuôi;
  - giữ-chỗ `TBD`: trần · nháy kép · nháy đơn · chú thích đuôi;
  - rỗng: dòng `human_signoff:` mặc định RÚT NGUYÊN VĂN từ khuôn bên viết · chỉ chú thích;
  - báo cáo vắng;
  - chữ ký thật chỉ nằm ở THÂN báo cáo;
  - frontmatter hỏng hoặc không dẫn đầu;
  - frontmatter MỞ mà thiếu dấu đóng «---» (thêm ở S4-r1): khối chạy tới HẾT TỆP nên chữ ký vẫn đọc được và cửa ĐÓNG, kèm `signoffWarn` nêu tên hồ sơ và lý do;
  - **cách viết khoá** (thêm ở S4-r2 — lớp ngữ pháp đã cắn hai lượt): `Human_signoff:` viết hoa · `human_signoff =` dấu bằng · `human_signoff :` có khoảng trắng trước dấu. Cả ba là chữ ký THẬT, cửa ĐÓNG;
  - **dấu đóng thụt lề** (thêm ở S4-r2): `  ---` KHÔNG phải dấu đóng (dấu fence chỉ tính ở CỘT 0), nên khối chạy tới hết tệp — cùng kết luận và cùng `signoffWarn` với ô thiếu dấu đóng.

  When chạy `start-scan.mjs` và `pre-merge-check.sh` trên CÙNG cây, Then:
  - (a) mỗi phần tử `vetoOpen[]` mang `humanSignoff` (boolean) và `signoffWarn` (chuỗi, luôn có mặt); tập phần tử `vetoOpen[]` KHÔNG đổi so với hôm nay (mọi `mo`, bất kể status);
  - (b) trên TỪNG ô, hai bộ đọc cùng kết luận: `vetoOpenUnsigned[]` = tập `vetoOpen` lọc `humanSignoff: false` = tập tên trong dòng «cửa veto đang mở» của lưới. Các ô chỉ-chú-thích, `"TBD"` có nháy, chỉ-ở-thân và frontmatter-hỏng đều là cửa MỞ. Ô frontmatter-hỏng mang `signoffWarn` nêu lý do, không nuốt im;
  - (c) thêm một hồ sơ `mo` chưa ký thì cả hai tập cùng tăng đúng 1; thêm một hồ sơ `mo` đã ký thì cả hai tập đều không tăng.

  Số ô ca tự đếm, lệch 108 thì ĐỎ. Chiều đỏ, mỗi cái một thông điệp: (i) thêm một bảng giữ-chỗ THỨ HAI vào bản sao `scripts/pre-merge-check.sh` → ĐỎ «bảng giữ-chỗ mọc bản thứ hai ở <tệp>»; (ii) đột biến vị từ trong CHÍNH nguồn (`lib/evidence-core.cjs`) → CẢ HAI bộ đọc cùng đổi (chứng chúng thật sự dùng chung một nguồn, không phải hai bản trùng nhau tình cờ) và ma trận ĐỎ nêu ô sai; (iii) bản sao máy quét đọc chữ ký bằng regex cả file → ĐỎ «lệch ở máy quét».
- AC-7: Given cùng ma trận của AC-6 và bản base = cha của commit đầu tiên đưa câu «cửa veto đã đóng bằng chữ ký» vào `scripts/pre-merge-check.sh`, When chạy lưới base và lưới sau sửa, Then trên MỌI ô, mã thoát và tập dòng `VIOLATION` giống hệt nhau; chỉ dòng `NOTE` được khác. Nói cách khác, bản sửa không nới và không siết luật chặn nào.
  - Bản base: tìm bằng lệnh git trong lượt chạy, in sha ra output, lấy bằng `git archive` trọn `scripts` + `lib`.
  - Tự kiểm trước khi so: base ≠ HEAD trên file đó, VÀ bản base chưa chứa câu ấy. Sai một vế → LỖI HẠ TẦNG, thoát 97, không xanh cũng không đỏ trên vật.
  - Chiều đỏ: bản sao cho nhánh đã-ký `continue` trước các chốt bằng chứng thì ≥1 ô đổi mã thoát, và phép đo ĐỎ nêu «bản sửa đổi luật chặn».
- AC-8: Given các luật lân cận đã có, When chạy lưới trên hồ sơ ĐÃ KÝ, Then chúng vẫn nổ nguyên văn:
  - `da-veto` chưa xử → VIOLATION;
  - `da-veto` → `mo` không có entry sổ → VIOLATION;
  - gỡ khoá `veto_state` khỏi hồ sơ đã rời draft → VIOLATION;
  - làn V hạng T3 → VIOLATION;
  - vết giờ hỏng → VIOLATION.

  Chữ ký không mở đường vòng cho luật nào trong số đó.
- AC-9: Given `tests/scripts/additive-only.test.mjs` (DV5), When chạy trên cây sau hồ sơ, Then nó xanh. Mọi dòng bị gỡ khỏi `pre-merge-check.sh` (mặc định: không dòng nào) phải liệt ĐÍCH DANH trong `ALLOWED_REMOVALS` kèm lý do «chỉ đổi NOTE, không nới luật».
- AC-10: Given cây thật của kit, When chạy lưới (`--recheck-all`) và máy quét, Then:
  - tập tên dòng «cửa veto đang mở» = `vetoOpenUnsigned[]` = tập hồ sơ `veto_state: mo` chưa có chữ ký thật. Tập kỳ vọng do một bộ đọc frontmatter ĐỘC LẬP tính;
  - không hồ sơ nào có `human_signoff` thật nằm trong tập đó;
  - không dòng NOTE «cửa veto mở» nào in cho hồ sơ đã ký;
  - sàn: tập kỳ vọng ≥ 1 và tập đã-ký ≥ 1.

  Không ghim tên hay con số. Chiều đỏ chạy CÙNG phép so bằng bản base của AC-7 (cùng cách tìm, cùng tự kiểm, sai → thoát 97).
- AC-11: Given thân `commands/start.md`, `commands/acceptance-status.md`, khối `START-SCAN-KEYS` và `CONTEXT.md`, When đọc cây sau hồ sơ, Then:
  - (a) hai thân lệnh dặn dòng «Còn veto được — <tên>» CHÉP NGUYÊN `vetoOpenUnsigned[]`, không tự lọc `vetoOpen`;
  - (b) khối `START-SCAN-KEYS` khai `vetoOpen[].humanSignoff`, `vetoOpen[].signoffWarn` và `vetoOpenUnsigned[]`, và ca P99 round-trip của suite plugins vẫn xanh;
  - (c) `CONTEXT.md` có luật «chữ ký Cổng Bằng chứng đóng cửa veto» kèm `_Avoid_`.

  Chiều đỏ: gỡ từng vật khỏi bản sao thì ĐỎ, gọi tên đúng vật bị gỡ.
- AC-12: Given ca thường trực mới `tests/scripts/cua-veto-sau-chu-ky.test.mjs` được nạp vào `tests/scripts/run-tests.sh`, When chạy suite `executors.test.scripts`, Then ca đó chạy CHÍNH lưới và máy quét trên fixture code-sinh, và giữ hai chiều của AC-1/AC-2 cùng đẳng thức AC-6(b). Ca có sàn đếm (0 assert thì exit khác 0) và chiều đỏ tự chạy trên bản sao, để luật còn răng sau khi răng hồ sơ chết theo hồ sơ.


## Coverage

Quét bằng morphological-scan (preset test-matrix), một lượt máy.

**Chân sản phẩm:**
`[SUY-TỪ-REPO: scripts/pre-merge-check.sh:384-391,413,766-782,1344-1386 · scripts/start-scan.mjs:122-128,252-253 · skills/acceptance/references/evidence-report-template.md:231 · lib/evidence-core.cjs vetoGateState · commands/signoff.md:87-97]`.

**Chân ngành**, loại sản phẩm «danh sách chờ người quyết trong luồng review»:
- `[NGÀNH: Gerrit attention set — người rời danh sách chờ khi đã trả lời]`
- `[NGÀNH: GitHub pull request — yêu cầu review tự rút khi reviewer đã nộp review]`

Cả hai cùng một nguyên tắc: người đã phát ngôn thì không còn trong danh sách «đang chờ
người».

- Trục A — `veto_state`: vắng | `mo` có vết | `mo` vết hỏng | `da-veto` [thước CE: bốn nhánh `vetoGateState` + nhánh `case` dòng 1352; giá trị lạ đã bị hook chặn lúc ghi → gạch]
- Trục B — chữ ký Cổng 2, hai lớp:
  - nghĩa: thật | giữ-chỗ | rỗng | báo cáo vắng | chỉ-ở-thân | frontmatter hỏng;
  - hình dạng giá trị: trần | nháy kép | nháy đơn | chỉ chú thích | chú thích đuôi.

  [thước CE: `front_field` dòng 384–391 (bóc nháy, bóc chú thích, chỉ frontmatter dẫn đầu) + `placeholder_signoff` dòng 413 + dòng mặc định của khuôn bên viết; ma trận 13 ô ở AC-6, toàn bộ mẫu giữ-chỗ ở AC-4]
- Trục C — Cổng 1: `approved_by` có tên | rỗng (làn V) | `gate1_skipped: true` [thước CE: ba nhánh khối dòng 754–788; có tên AC-3/6, rỗng AC-1/2/6, `gate1_skipped` → Later]
- Trục D — bộ đọc: NOTE riêng từng hồ sơ | dòng tổng | `vetoOpen[]` + `vetoOpenUnsigned[]` của máy quét [thước CE: grep `veto_state` toàn `scripts/` — 3 bộ đọc nói «cửa veto mở»; `product-map.mjs` + nhánh machine-cleared của máy quét chỉ đọc hồ sơ chưa ký theo định nghĩa → gạch]

**Cross-cutting áp mọi ô Core:**
- status (verified · machine-cleared · signed-off) KHÔNG phải căn cứ (AC-5);
- luật chặn lân cận giữ nguyên văn (AC-7 đo quan hệ trên base neo cha commit sửa, AC-8 đo năm luật có tên);
- DV5 chỉ-thêm (AC-9).

**Core:** A{`mo` có vết} × B{13 ô} × C{rỗng, có tên} × D{ba bộ đọc} → AC-1..6, cộng cây thật (AC-10).

**Later:**
- `gate1_skipped: true` + `mo` + đã ký. Hook ghi-lúc-viết không cho hai khoá này đi cùng một cách tự nhiên; chưa có ca thật.

**Never:**
- Giá trị `veto_state` lạ: hook đã chặn lúc ghi.
- `da-veto` × chữ ký thật đóng cửa: veto là phát ngôn của người, nó thắng; AC-8 giữ VIOLATION.
- Suy «đã ký» từ `status: signed-off`: nhãn không phải quan hệ.

## Out of scope

- **Đổi lệnh `/signoff` hay `/approve`** để ghi một trạng thái đóng vào `veto_state` (phương án P2/P3 của thiết kế).
- **Chạm `hooks/`**: luật ghi-lúc-viết giữ nguyên. (`lib/` KHÔNG còn ngoài phạm vi — xem Notes: owner đổi khuôn 12/09. `vetoGateState` vẫn không đụng.)
- **Sửa hồ sơ đã ký nào**, kể cả `start-bang-dieu-khien` và răng `rang-bdk.sh` của nó. Tập phần tử `vetoOpen[]` giữ nguyên chính vì điều này.
- **Mang bản sửa sang media-library / floorplanstudio**: hai kho nhận qua bản phát hành tới.
- **Đổi tên khoá `vetoOpen`** cho khớp nghĩa mới. Đây là nợ tên đã ghi sổ kèm điều kiện xem lại.
- **Dòng đếm «N hồ sơ đã ký, cửa đã đóng»** ở dòng tổng: dòng hằng lặp lại là rác.
- **Hợp nhất mọi vị từ bash + JS khác về một nguồn**: chỉ vị từ «chữ ký thật» được gom (AC-6). `xanh_sach_check`, `vetoGateState` và các luật khác vẫn là hai bản dựng như trước — nợ `lan-v-khong-phai-cho-ky` known-limit `#3` còn nguyên cho phần còn lại.

## Notes

- **Vòng này là việc-kit, owner GỌI TÊN 11/09** («Chạy hai việc kit còn mở»). Luật chiều rộng (b) của CLAUDE.md cho tối đa MỘT vòng meta giữa hai release, và chỉ khi owner gọi tên. Vòng này có **neo ngoài**: câu sai hiện ở lưới của media-library (3 hồ sơ) và floorplanstudio (1 hồ sơ). Giá trị chạm người dùng kit ở bản phát hành tới.
- **Ô mở dưới luật NỚI 2026-09-07?** Phần cộng gồm ba trường của máy quét, một NOTE mới và một ca thường trực. Chúng trace về nguyên tố 2 (bằng chứng không tự dối: lưới đang nói sai 27/30) và nguyên tố 3 (khoảnh khắc quyết thật: cửa veto chỉ còn giá trị khi danh sách của nó đúng). Người hưởng: owner, khi đọc dòng «cửa veto đang mở» ở lưới và ở `/start`. Vòng này KHÔNG tăng lượt gọi người: không dựng cổng mới, và giảm số tên phải đọc từ 30 xuống 3.
- **ĐỔI KHUÔN, owner quyết 12/09 tại chốt DỪNG-VÁ.** Lượt chấm 1 và lượt chấm 2 bắt CÙNG MỘT LỚP: một vị từ («đã ký thật») dựng HAI lần, bash và JS, hai ngữ pháp, lệch nhau trong im lặng. Vá từng ca là vá instance, nên owner chọn đổi khuôn: vị từ về **một nguồn** trong `lib/`, hai bộ đọc cùng gọi. Vì thế mục «Chạm `lib/`» rời khỏi `## Out of scope` — đây là quyết định của owner ở chốt dừng, không phải máy tự nới phạm vi. Hạng giữ T3.
- **⚠ XANH GIẢ ĐÃ BIẾT — E6 xanh nhưng vế (0) của AC-6 SAI trên cây thật (lượt chấm 6, chưa xử).** AC-6 hứa «không tệp nào dưới `scripts/` giữ bảng giữ-chỗ hay biểu thức đọc `human_signoff` riêng». Vế BẢNG quét đúng lớp (`quetBang()` đọc mọi `.sh/.mjs/.cjs/.js`); vế BIỂU THỨC chỉ điểm-case MỘT tệp `scripts/start-scan.mjs` — tệp duy nhất đã sạch. Đem chính biểu thức của chân đo (`/human_signoff[^\n]*(\/|match\(|RegExp)/`) áp vào `scripts/pre-merge-check.sh` thì khớp BA dòng: 839 (`front_field`, awk phân biệt hoa thường, chỉ `:`), 1067 (chuỗi thông điệp, vô hại), **1175** (`sed -n 's/^human_signoff:[[:space:]]*//p'` tính `base_sig`). Hệ quả THẬT của dòng 1175: hồ sơ mà bản base đã ký bằng `human_signoff = <tên>` (hoặc `Human_signoff:`, hoặc có khoảng trắng trước dấu — ba cách viết mà nguồn `chuKyThat` CỐ Ý nhận, và fixture của chính hồ sơ này ghim là chữ ký THẬT) cho `base_sig` rỗng, nên lưới in «NOTE [slug]: chữ ký MỚI trong diff» cho một chữ ký đã có từ trước. Cùng tệp, cùng khoá, hai kết luận trái nhau — đúng họ lỗi vòng này sinh ra để diệt, nhẹ hơn vì là NOTE chứ không chặn. Máy KHÔNG tự sửa: lượt 6 là lượt chấm thứ sáu, quá trần, và `triage_failed: true` nên phân loại phạm vi của máy không đáng tin. Chờ owner định đoạt ở Cổng 2: nới vế biểu thức ra cả lớp `scripts/` (kèm danh sách miễn trừ có tên) và sửa dòng 1175 · hoặc thu lời hứa của AC-6 về đúng cái đang đo · hoặc Known limits + ô.
- **RÚT AC-13, owner quyết 12/09 sau lượt chấm 4.** AC-13 («vắng engine thì bản lùi vẫn chặn VÀ lượt chạy in NOTE khai bản lùi») do MÁY tự thêm ở S4-r3, sau Cổng Phạm vi — owner chưa bao giờ duyệt nó. Nó là nguồn của 4 trên 9 phát hiện trong hợp đồng ở lượt 4. Đề bài owner giao là câu sai của cửa veto khi CÓ engine; làn vắng-engine là phạm vi máy tự kéo vào. Rút khỏi `## Criteria`, eval E14 gỡ theo; mã bản lùi và chân `lui-khong-engine` GIỮ NGUYÊN như phép đo thường trực, chỉ thôi mang tư cách tiêu chí. Hai lỗ còn lại của làn ấy khai ở Known limits dưới và có ô riêng.
- **T3 nên Cổng Phạm vi và Gate 1.5 cần người** theo thiết kế, trần 4 lượt gọi người.
- **Không có `opportunity.md`**, nên không có mục `## Đường đo`.
- **Known limits — bốn mục ngoài hợp đồng, owner định đoạt tại Cổng 2 ngày 12/09: GHI KNOWN LIMITS, ship như hiện tại.** `Ngoài-1` lưới lùi sang bộ đọc chữ ký hẹp hơn mà không báo · `Ngoài-2` dòng NOTE khai «đang chạy suy giảm» không bao giờ in ra từ đường `chu_ky_gia_tri` · `Ngoài-3` hồ sơ ĐÃ ký bị báo lại là «owner chưa veto» · `Ngoài-4` chiều đỏ của DV5u chấm bản chép của chính luật thay vì chạy qua luật. Ba mục đầu chỉ xảy ra ở cây thiếu `node` hoặc thiếu `lib/evidence-core.cjs` — chi tiết và bán kính ở gạch «làn VẮNG ENGINE» dưới; mục thứ tư ở gạch «phép đo». Ô đã mở: `task_da1f3eac` (hai lỗ đường lùi) và `task_98fd6eea` (nới phép đo + `base_sig`), kèm gợi ý gộp vì cùng chạm `scripts/pre-merge-check.sh` mà tệp đó bị DV5 canh chỉ-được-thêm.
- **Known limits — AC-6 vế (0) đo HẸP HƠN lời hứa (owner quyết 12/09 tại Cổng 2: ghi Known limits + ô, KHÔNG sửa trong vòng này).** Điều AC-6 hứa: không tệp nào dưới `scripts/` giữ bảng giữ-chỗ hay biểu thức đọc `human_signoff` riêng. Điều thật sự ĐO: vế BẢNG quét đúng lớp (mọi `.sh/.mjs/.cjs/.js` dưới `scripts/`); vế BIỂU THỨC chỉ điểm-case MỘT tệp `scripts/start-scan.mjs`. Cái KHÔNG đo mà đang vi phạm: `scripts/pre-merge-check.sh` dòng 839 (`front_field`) và dòng 1175 (`sed -n 's/^human_signoff:[[:space:]]*//p'` tính `base_sig`) — cả hai hẹp hơn ngữ pháp của nguồn `chuKyThat`. Hệ quả đã đo: hồ sơ mà bản base ký bằng `human_signoff = <tên>` cho `base_sig` rỗng → lưới in «NOTE: chữ ký MỚI trong diff» cho chữ ký đã có từ trước. **Không chặn ai** — chỉ một dòng NOTE sai — nên owner chọn ship kèm giới hạn này. Ô riêng đã mở cho lượt nới vế biểu thức ra cả lớp + sửa dòng 1175.
- **Known limits — làn VẮNG ENGINE (đo thật ở lượt chấm 4, KHÔNG sửa trong vòng này):** khi lưới chạy ở cây thiếu `node` hoặc thiếu `lib/evidence-core.cjs`:
  - `chu_ky_gia_tri` (`scripts/pre-merge-check.sh:482`) lùi về `front_field` — ngữ pháp HẸP HƠN nguồn (chỉ nhận `human_signoff:`, không nhận `=`, không nhận hoa-thường hay khoảng trắng trước dấu) — và **không khai ra**: cờ `NARROW_NET_BLIND=1` nằm trong subshell của `signoff="$(chu_ky_gia_tri …)"` nên không tới được shell cha. Hệ quả: hồ sơ ký bằng `human_signoff = <tên>` bị chặn với lý do SAI («is empty»), không có NOTE nào nói lưới đang chạy suy giảm.
  - `signoff_that` (`scripts/pre-merge-check.sh:486`) trả «chưa ký» cho MỌI hồ sơ và không bật cờ nào. Hệ quả: hồ sơ ĐÃ KÝ THẬT lại bị in «làn V — cửa veto mở» và đếm vào `VETO_OPEN_N` — đúng câu vòng này sinh ra để diệt, nhưng chỉ ở cây thiếu engine.
  - Bán kính thật: repo tiêu thụ mang cổng vào mà quên chép `lib/` (`INIT-CI-COPY-LIST` có khai). Kho kit và mọi CI hiện tại đều có node + lib, nên làn chính KHÔNG dính.
  - Vá được và rẻ (đặt cờ ở `signoff_that`; cho `chu_ky_gia_tri` in cờ ra cùng dòng kết quả), nhưng sau khi rút AC-13 đây là mục NGOÀI hợp đồng — máy không tự vá. Ô riêng đã mở.
- **Known limits — phép đo (ngoài hợp đồng, lượt chấm 4):** `DV5u-mutant` trong `tests/scripts/additive-only.test.mjs` chép lại thân DV5u thay vì gọi nó, nên làm yếu DV5u thật vẫn xanh · căn cứ của một mục `ALLOWED_REMOVALS` viện câu «rewording is NOT a fix» đã không còn trong `scripts/` · chú thích ở `pre-merge-check.sh:849` khai `[ -n "$_vsig" ]` không còn tới được là sai (chữ ký giữ-chỗ vẫn tới) · E5 tuyên đo trên hai bộ đọc nhưng thực tế một.
- **Giới hạn khai trước (co lại sau phản biện S1#7):**
  - Danh sách tên thẻ `/start` in ra do MÁY dựng sẵn (`vetoOpenUnsigned[]`), và E6 đo đúng danh sách đó.
  - Phần không đo máy chỉ còn một câu CHÉP trong thân lệnh (AC-11a): thẻ có chép nguyên danh sách hay không.
  - Ngưỡng mở lại đang đếm: số entry `revisit` mở đầu «lỗ-kit — ngôn ngữ mặt người» ghi thẻ `/start` in tên ngoài `vetoOpenUnsigned[]` (term **Lỗ-kit** trong CONTEXT.md — đếm được ở sổ quyết định); mở lại khi ≥ 1.
- **Hằng số đo 11/09** (quan sát, không ghim — AC-10 đo quan hệ): 30 `mo` / 27 đã ký / 3 mở thật (`co-qua-timebox-nhom-da-xong`, `ma-so-quyet-dinh-duy-nhat`, `release-2-0-0`).
