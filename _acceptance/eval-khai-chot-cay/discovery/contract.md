---
schema_version: 1
feature: Lời khai cấp eval «tree_pin» — eval gọi máy chủ qua mạng phải khai có chốt đúng cây hay không
slug: eval-khai-chot-cay
owner: manh@mstar.vn
risk_tier: T3               # chạm lib/eval-yaml.cjs (t3_paths: lib/**)
surfaces: [cli]
status: draft
design_doc: docs/superpowers/specs/2026-09-18-eval-khai-chot-cay-design.md
---

# Acceptance Contract: eval-khai-chot-cay

## Context

Một eval gọi HTTP tới máy chủ dev có thể đo **nhầm cây**: máy chủ đang trả lời ở cổng
mặc định thuộc một checkout khác, và phép đo vẫn in ra những con số hợp lý với mã thoát
0. Kit phân loại được thứ nó THẤY — hạ tầng hỏng → `BLOCKED`, mã thoát lệch kỳ vọng, ô
khai không-chạy. Đo nhầm cây không thuộc nhóm đó: nó là một **câu trả lời SAI trông như
câu trả lời ĐÚNG**, và không lưới nào của kit hiện nay nhìn thấy nó.

Đo trên 10 kho, giải `config:` ref trước khi soi (mục 2 của design doc): **97/3 737 eval
máy** gọi máy chủ qua mạng, nằm ở **14 hồ sơ / 2 kho**, **11 trong đó đã ký**. 95/97 nằm
trong `crm` — kho đó đã tự phát minh **hai** cơ chế chốt cây, và một trong hai
(`may-chu.mjs`) đã bị chép sang hồ sơ thứ hai rồi hai bản trôi khác nhau: một luật sống ở
hai nơi. Kho nào gặp chuyện này cũng phải tự phát minh lại, và **hồ sơ nào KHÔNG làm thì
không ai biết**.

Kit KHÔNG thể tự chốt cây — nó không biết ứng dụng của kho phục vụ gì để lấy vân tay.
Thứ kit làm được là biến cảnh báo thành thứ **đếm được**, theo đúng khuôn nó đã dùng hai
lần (`expected_exit` — ADR 0016, bản 2.11.0; `status: not-run` — bản 2.12.0) và theo đúng
thế đứng W5 đã khai sẵn trong `scripts/eval-coverage-lint.js`: *máy kiểm dòng CÓ MẶT,
người soi GIÁ TRỊ ở cổng*.

**Ranh giới với kế hoạch `2026-08-29-cham-dung-cay-dung-cho-dung`:** kế hoạch đó đưa
**tầng chấm** vào kỷ luật (args do máy sinh, làn đặt chỗ đứng, hạ tầng hỏng tự xưng tên);
việc này đứng ở **tầng vật được đo** — «máy chủ tôi đang gọi có phải cây này không». Hai
việc không chồng nhau và vòng này không đụng `s4-args.mjs`.

**Chân ngành (đã tra):** ngành giải bài này bằng CẤU TRÚC chứ không bằng lời khai —
Playwright `webServer.reuseExistingServer` (mặc định `!CI`: trên CI thì TỪ CHỐI dùng lại
máy chủ có sẵn), Testcontainers (mỗi lượt kiểm tự mang máy chủ lên cổng phù du),
hermeticity (Bazel). Kit không chạy ứng dụng của kho tiêu thụ nên không làm được nước đi
đó; vòng này cố ý là nước đi **hạng hai**, và văn bản của kit phải nói ra điều đó thay vì
bán lời khai như lời giải.

## Criteria

- AC-1: Given `evals.yaml` code-sinh mang ba trạng thái lời khai (khai CÓ chốt · khai `none` KÈM lý do · VẮNG trường), When bất kỳ bộ đọc nào cần biết trạng thái đó, Then nó rút qua **đúng một** hàm `treePins()` trong `lib/eval-yaml.cjs`: (a) ma trận TOÀN PHẦN 3 trạng thái × 3 executor có cây (`test`/`script`/`ui-check`) — số assert BẰNG 9, ca tự đếm và ĐỎ nếu số assert khác số ô với thông điệp ghim `"so o lech"`; (b) ràng buộc TĨNH — chỉ `lib/eval-yaml.cjs` được khớp tên trường `tree_pin`, mọi tệp tiêu thụ khớp ĐÚNG 0 lần, chiều đỏ là thêm một lần khớp ở một tệp bất kỳ với thông điệp ghim GỌI TÊN tệp mọc lối đọc thứ hai; (c) đối chứng dương: cây lành → 9/9 ô khớp và 0 lần khớp tĩnh.
- AC-2: Given `evals.yaml` khai `tree_pin` sai luật, When bộ đọc rút lời khai, Then fail-CLOSED với thông điệp GỌI TÊN eval và nêu luật bị phạm, KHÔNG rơi thầm về «vắng», ở BA hình dạng: (a) `none` trơn không lý do (kể cả `none`, `"none"`, `NONE`, `none —`) — thông điệp nêu «khai không chốt phải kèm lý do»; (b) khai trên executor `judgment` — thông điệp nêu tên executor và nêu «không chạy lệnh nên không có cây để chốt»; (c) giá trị rỗng sau khi bóc nháy. Và HAI đối chứng dương CÙNG fixture để ba nhánh không phải hằng-đúng: `tree_pin: rang/canh-cay.mjs — <mô tả>` hợp lệ → 0 lỗi và đọc ra trạng thái «có chốt»; `tree_pin: none — <lý do>` hợp lệ → 0 lỗi và đọc ra «không chốt» (KHÔNG bị tính là «vắng»). Chiều đỏ: bản sao coi «có trường» là đã-khai-đúng → ĐỎ nêu `"none tron duoc coi la hop le"`.
- AC-3: Given một **corpus lệnh ĐÓNG BĂNG** nằm trong hồ sơ (`corpus-lenh.jsonl` — mỗi dòng `{repo, slug, eval_id, cmd}`, sinh MỘT LẦN bằng `sinh-corpus.mjs` của hồ sơ, đường dẫn suy từ vị trí script, kèm khối xuất xứ `corpus-xuat-xu.md` ghi sha từng kho + thời điểm + số dòng) và một **bản nhãn đã soi tay** (`corpus-nhan.jsonl` — verdict cho TOÀN BỘ ứng viên của bộ dò rộng cộng một mẫu ngẫu nhiên ≥50 dòng âm), When `laGoiMayChu(cmd)` chấm từng dòng của corpus, Then đo theo NHÃN chứ không theo hằng số: (a) **độ nhạy** — khớp đúng tập dòng nhãn `khop: true`, sai một dòng là đỏ gọi tên dòng đó; (b) **độ đặc hiệu** — IM trên MỌI dòng nhãn `khop: false`, trong đó 4 dòng dương-giả CÓ TÊN (`npm run smoke:news-fetch` ×3 · `check-no-dormant-fetch.sh`); (c) **không trôi ra ngoài vùng đã nhãn** — tổng số khớp trên TRỌN corpus phải BẰNG số dòng nhãn `khop: true`, nên một khớp mới ở vùng chưa nhãn cũng đỏ. Chấm KHÔNG đọc `~/dev`: chân chỉ đọc hai tệp trong hồ sơ, nên tái lập được trên CI và trên máy khác. Chiều ĐỎ: bản sao nới vị từ về khuôn RỘNG → ĐỎ với thông điệp ghim `"duong-gia: check-no-dormant-fetch.sh"`.
- AC-4: Given một hồ sơ có eval `test`/`script`/`ui-check` mà lệnh ĐÃ GIẢI khớp `laGoiMayChu` và eval KHÔNG có `tree_pin`, When chạy `scripts/eval-coverage-lint.js <root> --slug <slug>`, Then in cảnh báo `W9` gọi tên slug + id eval + nêu cơ chế thiếu, và exit 1 (advisory, đúng nếp W1–W8). Chiều đỏ cùng fixture: gỡ tay W9 khỏi `lintFeature` → ĐỎ, thông điệp ghim `"W9 khong no tren eval goi mang chua khai"`.
- AC-5: Given cùng fixture của AC-4 nhưng eval ĐÃ khai — hai bản, một `tree_pin: <cơ chế>` và một `tree_pin: none — <lý do>`, When chạy lint, Then W9 IM ở CẢ HAI bản (đối chứng dương của AC-4: khai `none` là một lựa chọn hợp lệ, không phải lỗi), và các cảnh báo W1–W8 của chính fixture đó không đổi một dòng nào so với bản chưa có trường — chiều đỏ: bản sao coi `none` là chưa-khai → ĐỎ nêu `"khai none bi tinh la chua khai"`.
- AC-6: Given một eval `executor: judgment` mang `tree_pin`, When chạy lint, Then in cảnh báo W9 dạng **nhãn lạc chỗ** gọi tên eval (gương của `nhanLacCho` trong W8), KHÔNG in cảnh báo dạng thiếu-khai. Chiều đỏ cùng fixture: gỡ nhánh nhãn-lạc-chỗ → ĐỎ nêu `"nhan lac cho khong co tieng"`.
- AC-7: Given chế độ `--files <contract.md> <evals.yaml>` (không có gốc kho nên không giải được `config:` ref), When chạy lint, Then W9 KHÔNG im lặng biến mất: in ĐÚNG MỘT dòng nói rõ nó ngoài phạm vi ở chế độ này và vì sao (tiền lệ W6 «rơi bậc»), và dòng đó KHÔNG làm exit code đổi. Chiều đỏ cùng fixture: gỡ dòng nói-ra → ĐỎ nêu `"che do --files im lang bo qua W9"`.
- AC-8: Given toàn bộ **hồ sơ của chính kho kit** (đo được 0 eval gọi máy chủ, nên một bản tiêm «nới bộ dò» KHÔNG đổi được con số nào — chiều đỏ ngây thơ đã CHẾT trước khi viết), When chạy `node scripts/eval-coverage-lint.js .`, Then chiều đặc hiệu ở quy mô corpus được chứng bằng BA phép đo trên CÙNG một ảnh chụp corpus và cùng bản lib: (a) bản lành → số cảnh báo W9 BẰNG 0; (b) **mutant khớp-tất-cả** (vị từ trả `true` mọi lúc) → W9 BẰNG đúng số eval `test`/`script`/`ui-check` của corpus, tức lưới CÓ răng trên chính corpus này chứ không phải im vì chết; (c) **corpus có tiêm** — bản sao corpus chèn thêm `k` hồ sơ gọi mạng code-sinh → W9 BẰNG đúng `k` với bản lint LÀNH. Cộng (d): tổng cảnh báo W1–W8 KHÔNG đổi so với bản base dựng bằng `git archive <sha-truoc-vong> lib scripts` (TRỌN thư mục, không chép danh sách tệp tay — bài học P150). Chiều ĐỎ: gỡ W9 khỏi lint → (b) và (c) cùng ĐỎ, thông điệp ghim `"luoi khong co rang tren corpus kit"`.
- AC-9: Given một hồ sơ fixture code-sinh có **thành phần KHAI TRƯỚC** (3 eval khai có chốt · 2 eval khai `none` kèm lý do · 1 eval vắng trường · 2 eval KHÔNG gọi máy chủ), When render thẻ Cổng Bằng chứng, Then thẻ in ĐÚNG MỘT dòng đếm dạng `Eval gọi máy chủ: <N> — <k> khai chốt cây · <m> khai không chốt · <j> chưa khai` với bộ bốn số BẰNG NGUYÊN VĂN `6 — 3 · 2 · 1` (assert từng số, KHÔNG assert tổng: `k+m+j == N` là hằng-đúng khi `N` tính bằng tổng), và dòng đó có mặt **trong phần người đọc của thẻ ĐÃ RENDER** (HTML trên stdout, đúng vật ghi ra `card.html`), đúng một lần. Ba chiều ĐỎ riêng biệt trên BẢN SAO, mỗi chiều một thông điệp ghim: ép cả bốn số về 0 → `"bo bon so bang 0"`; gộp nhóm `none` vào nhóm chưa-khai → `"gop none vao chua-khai"`; đếm cả 2 eval KHÔNG gọi máy chủ vào `N` → `"dem ca eval khong goi may chu"`.
- AC-10: Given một hồ sơ fixture có eval gọi máy chủ CHƯA khai, When render thẻ Cổng Phạm vi, Then trên **HTML ĐÃ RENDER** (không phải đầu ra `--extract`): cờ vàng hiện cùng chỗ với W1–W8, mã thoát của lệnh render KHÔNG đổi (không chặn cổng), và phần văn bản người đọc — lấy bằng cách bóc thẻ HTML — KHÔNG chứa chuỗi `tree_pin` hay `W9`, theo `skills/acceptance/references/human-facing-language.md`. ĐỐI CHỨNG DƯƠNG cùng fixture: bản đã khai đủ → cờ đó VẮNG. Chiều ĐỎ thứ hai, đúng lớp «Thẻ Cổng 1 đọc 0 tiêu chí»: giữ dòng trong `--extract` nhưng bỏ khỏi phần người đọc của HTML → ĐỎ nêu `"co trong extract, vang trong ban nguoi doc"`.
- AC-11: Given **357 hồ sơ đã ký** trên 10 kho, không hồ sơ nào có trường `tree_pin`, When chạy `scripts/recheck-evidence.cjs` và `scripts/pre-merge-check.sh` sau vòng này, Then kết quả GIỐNG HỆT trước vòng này (so bằng đầu ra, không so bằng mã thoát một mình), và `feature-loop/scripts/repin-lane.mjs` + `checkRepinEvals` + `s4-args.mjs` KHÔNG đổi một dòng nào — vắng `tree_pin` KHÔNG là VIOLATION ở bất kỳ tầng cưỡng chế nào. Chiều đỏ: thêm một vế `tree_pin` vào `checkRepinEvals` trong bản sao → ĐỎ nêu `"lan ghim lai doi hanh vi tren ho so cu"`.
- AC-12: Given khuôn lời khai được viết ở đúng MỘT chỗ có marker (`TREE-PIN-TEMPLATE` trong `skills/acceptance/SKILL.md`), When test round-trip rút khuôn từ bên VIẾT rồi cho bên ĐỌC (`treePins`) đọc, Then bên đọc phải đọc ra đúng trạng thái mà khuôn hứa, cho cả hai ví dụ trong khuôn (có chốt · không chốt). Chiều đỏ: sửa khuôn trong tài liệu mà không sửa bộ đọc → ĐỎ nêu `"khuon ben viet va ben doc troi khoi nhau"` (mẫu `OOC-ITEM-TEMPLATE`, case P55).
- AC-13: Given một hồ sơ fixture có eval khai `tree_pin` SAI luật (ba hình dạng của AC-2), When chạy lint VÀ render cả hai thẻ trên CÙNG fixture đó, Then `errs` của `treePins()` KHÔNG chết ở tầng hàm — nó phải có tiếng ở CẢ HAI bộ đọc: (a) lint in một dòng GỌI TÊN id eval và nêu luật bị phạm (không rơi vào nhánh thiếu-khai, vì eval CÓ trường); (b) thẻ Cổng Bằng chứng đếm eval lỗi thành **số thứ tư** trong dòng đếm (`… · <x> khai sai`) chứ không im lặng bỏ nó khỏi cả ba nhóm; và (c) `byId` trả trạng thái `loi` cho eval đó, KHÔNG rơi thầm về `vắng`. Chiều ĐỎ, một cho mỗi bộ đọc: nuốt `errs` ở lint → ĐỎ nêu `"lint nuot errs"`; nuốt ở thẻ → ĐỎ nêu `"the nuot errs"`; `byId` trả `vắng` cho eval lỗi → ĐỎ nêu `"roi tham ve vang"`.

## Coverage

Quét hình thái (`morphological-scan`, preset tự dựng) — bản đầy đủ ở mục 4 của design doc.

- **Trục A — trạng thái lời khai**: khai CÓ chốt | khai KHÔNG chốt | VẮNG
  · thước CE: toàn bộ ảnh của một trường scalar tuỳ chọn, cùng khuôn `expected_exit`
  (khai n · khai 0 · vắng) và `status: not-run` — hai tiền lệ ĐÃ SHIP có ma trận toàn phần.
- **Trục B — máy có nhìn thấy không**: khớp bộ dò hẹp | không khớp | không giải được `config:` ref
  · thước CE: **số đo 3 737 eval trên 10 kho** — 97 khớp hẹp, 4 dương-giả của bộ dò rộng
  CÓ TÊN, và chế độ `--files` vốn không có gốc kho (tiền lệ W6).
- **Trục C — bộ đọc**: lint Cổng 1 | thẻ Cổng Phạm vi | thẻ Cổng Bằng chứng | làn ghim lại | s4-args
  · thước CE: tập đóng rút bằng `grep -rn parseEvals lib scripts` + INIT-CI-COPY-LIST.
- **Trục D — tuổi hồ sơ**: hồ sơ mới | hồ sơ đã ký trước bản này
  · thước CE: 357 hồ sơ đã ký đo được, 11 trong đó dính.

Không gian 3×3×5×2 = 90 ô, quét theo 9 lát của A×B. **Core 12 ô** → 13 AC ở trên (ô Core 5 «none trơn» tách thành AC-2 ở tầng hàm và AC-13 ở tầng bộ đọc, sau phản biện context sạch)
(một-đối-một, xem bảng ánh xạ trong design doc mục 4). Loại executor là ràng buộc
CẮT NGANG chứ không phải trục thứ 5 (đổi executor ép đổi giá trị hợp lệ của trục A).

**Later** (park): eval gọi mạng mà URL trốn trong `playwright.config.ts` — kit không
nhìn thấy, khai giới hạn · thẻ in TÊN cơ chế chứ không chỉ số · helper chốt cây do kit ship.
**Never**: kit tự chốt cây thay kho tiêu thụ (ranh giới «kit là engine») · máy SUY
«có gọi mạng không» từ văn xuôi trường `expected` (lối đã bị ADR 0016 loại) ·
`tree_pin` trên `judgment` được coi là hợp lệ.

Không dòng nào mang `[GIẢ ĐỊNH]` hay `[CE chưa kiểm chứng]`: cả bốn trục đều có thước
là SỐ ĐO trên vật thật, không phải suy đoán.

## Đường đo

Hồ sơ này KHÔNG có `opportunity.md` (không đi qua Cổng Đáng — owner gọi tên trực tiếp),
nên không có ngưỡng nghiệm thu để chiếu. Dự báo 5 dòng số của luật (c) nằm ở mục 9 của
design doc; dòng duy nhất dự báo ↑ là token máy/vòng (thêm 1 tay lint + 1 khối thẻ),
không dòng nào chạm điều kiện tin cậy (đường verdict không đổi thành phần).

## Out of scope

- **Kit ship một helper chốt cây dùng chung.** YAGNI: đúng 1 kho cần; cơ chế dấu-mốc của
  `canh-cay.mjs` giả định kho có thư mục tĩnh công khai. Là CỘNG thứ hai nên cần owner phê
  riêng (ADR 0018). Đề nghị ghi `.out-of-scope/` kèm mục «Prior requests», mở lại khi có
  **kho thứ hai** cần.
- **Chặn ở tầng cưỡng chế** (hook / `recheck-evidence.cjs` / `pre-merge-check.sh`). Chạm
  `hooks/**`; làm 11 hồ sơ đã ký đỏ ngay; và ép người gõ `tree_pin: none — ` cho qua cổng
  → lời khai hoá thủ tục, đúng bệnh «trạm thu phí» mà north star cấm.
- **Sửa điểm mù của `may-chu.mjs`** (hai worktree cùng chuỗi giao diện) và **hợp nhất hai
  bản đã trôi** — việc của kho `crm`, không phải của kit.
- **Đổi schema args của `acceptance-verify.js`** — không buộc phải đổi, nên không đổi.
- **Máy kiểm GIÁ TRỊ của lời khai.** Viết `tree_pin: có chốt rồi` cũng qua. Tiền lệ W5
  nguyên vẹn: máy kiểm dòng CÓ MẶT, người soi ở cổng.

## Notes

- **`surfaces: [cli]` là khai theo NẾP KIT, và nếp đó có một chỗ hụt đã biết.** Vật của
  vòng này gồm hai dòng NGƯỜI ĐỌC trên thẻ HTML đã render, nhưng cả 122 hồ sơ của kit đều
  khai `[cli]` và kit có **0 eval `ui-check`** — nên không nghĩa vụ lớp-nhìn-thấy nào
  kích hoạt. Vòng này KHÔNG tự đổi nếp đó (đổi nếp surface của kit là việc lớn hơn vòng
  này và chạm 122 hồ sơ). Thay vào đó: AC-9 và AC-10 đo trên **HTML ĐÃ RENDER**, không đo
  đầu ra `--extract`, và chiều đỏ của AC-10 bắt đúng lớp «có trong extract, vắng trong
  bản người đọc». **Câu hỏi về nếp surface được nêu riêng ở Cổng Phạm vi** — nó là phát
  hiện về KIT, không phải về vòng này.
- **Corpus lệnh là vật ĐÓNG BĂNG trong hồ sơ, không phải một lượt quét `~/dev`.** Hai hằng
  3 737 và 97 trong design doc là số đo tại thời điểm đóng băng, KHÔNG phải bất biến: AC-3
  đo theo NHÃN của từng dòng corpus, nên thêm eval gọi mạng ở `crm` ngày mai không làm
  thước đỏ oan. Bản nhãn soi tay là một phán đoán được ĐÓNG BĂNG THÀNH VẬT để người ở Cổng
  Phạm vi soi lại được, không phải một con số máy tự tin.
- **Chiều đỏ ngây thơ của AC-8 đã CHẾT trước khi viết** và điều đó được nói ra thay vì giấu:
  kit có 0 eval gọi máy chủ nên bản tiêm «nới bộ dò» cho cùng một con số 0 với bản lành.
  AC-8 thay bằng hai mutant CÓ sống: khớp-tất-cả, và corpus có tiêm `k` hồ sơ.

- Kit có **0 eval gọi máy chủ** nên **không tự ăn được món này**. Mọi bằng chứng dựng trên
  fixture code-sinh; tín hiệu dùng-thật đầu tiên sẽ đến từ `crm`. Sự thật này nằm trên bàn
  ở Cổng Phạm vi, không giấu.
- Bộ dò hẹp **cố ý sót**. Ngưỡng mở lại đang đếm: **≥1 ca thật đo nhầm cây lọt qua vì bộ
  dò sót**.
- Lời khai đặt được bằng tay kể cả khi bộ dò im — khai NHIỀU hơn máy thấy luôn hợp lệ và
  luôn được đếm ở thẻ Cổng Bằng chứng.
