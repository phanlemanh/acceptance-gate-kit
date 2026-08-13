---
schema_version: 1
feature: Lưu kho harness Codex và khai tử nghi lễ design-loop — chỉ TRỪ, có mốc git để đảo và 2 ADR
slug: luu-kho-codex-va-nghi-le-design
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: approved
approved_by: Manh
approved_at: 2026-08-12
time_human_minutes: {gate1: 0, gate2: 0}
---

# Acceptance Contract: luu-kho-codex-va-nghi-le-design

## Context

Kit đang nuôi hai harness song sinh. Mọi thay đổi trong lõi kit phải sửa hai lần: một
lần ở cây nguồn cho Claude, một lần ở lớp phủ Codex — rồi build lại một bản
mirror phẳng và commit nó. Owner tuyên 12/08: đội chủ yếu dùng Claude. Nhánh
nghi lễ của design-loop (mockup → evidence → push) cũng đã tự ghi khai tử trong
bản đồ sản phẩm: ba bước của nó không tự động được, và repo tiêu thụ chưa có mặt người nào để thiết kế.

Hồ sơ này **chỉ TRỪ**, và mọi thứ gỡ đều lấy lại được bằng một mốc git đặt ngay
trước commit gỡ đầu tiên. Máy đo design của kit **ở lại** — nó là kit, không
phải design-loop.

Source input: [docs/plans/2026-08-12-de-bai-dot1-cat-va-luu-kho.md](../../docs/plans/2026-08-12-de-bai-dot1-cat-va-luu-kho.md)
· bản neo [docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md](../../docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md)

## Criteria

Mọi tiêu chí âm tính ("không còn X") PHẢI kèm đối chứng dương: cùng câu quét
chạy trên cây của mốc `truoc-luu-kho-2026-08` cho **>0 hit**, eval in cả hai con
số. Cố ý neo vào mốc chứ không vào `origin/main`: mốc bất biến, `origin/main`
còn di chuyển — và một needle gõ sai cho 0 hit ở CẢ HAI đầu, nên vế "mốc >0" là
chân duy nhất phân biệt "đã gỡ" với "phép đo chưa bao giờ chạy". Mốc VẮNG →
eval ĐỎ, không phải bỏ qua.

- AC-1: Given commit ngay trước commit gỡ đầu tiên, When đọc danh sách mốc git,
  Then tồn tại mốc `truoc-luu-kho-2026-08` trỏ đúng commit đó, cây của mốc có đủ
  `codex/`, `design-loop/`, `plugins/`, **mốc là CHA TRỰC TIẾP của commit gỡ đầu
  tiên** (không chấp nhận quan hệ tổ-tiên: `git rev-list` giữa mốc và commit đầu
  tiên chạm một trong sáu đường dẫn AC-2 phải RỖNG), **và mốc đã có mặt trên
  remote** với đúng sha (`git ls-remote --tags origin`). Hai vế sau là bắt buộc
  vì mốc này là chân duy nhất của CẢ đường-đảo-rẻ LẪN mọi đối chứng dương của
  E1–E10: mốc chỉ nằm local thì sau merge không ai ngoài máy tác giả hoàn tác
  được ~194 file, hai ADR ghim một sha không ai resolve nổi, và mọi lần chạy lại
  verify đỏ vĩnh viễn theo đúng luật fail-closed.
- AC-2: Given cây đã gỡ, When liệt kê đường dẫn, Then `codex/`, `tests/codex/`,
  `scripts/codex-self-script-refs.tsv`, `.agents/`, `design-loop/`,
  `tests/design-loop/`, **`.codex-plugin/`** **không còn trên cây**; đối chứng
  dương: cả bảy đều tồn tại ở cây của mốc `truoc-luu-kho-2026-08`.
  **[SỬA SAU CỔNG 1 — 12/08, Phiên C]** Thêm `.codex-plugin/`: đề bài 1b.1 gọi
  đích danh nó («`.codex-plugin/` nếu có») nhưng bản trước của AC-2 không liệt
  kê, và đợt gỡ 197 file bỏ sót nó thật — manifest Codex ở gốc repo còn nguyên
  trên cây. Thiếu vế này thì hồ sơ tuyên «đã lưu kho Codex» xong vẫn để lại
  đúng cái tệp khai báo gói Codex.
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 2 «một-nguồn»] Danh sách nay là khối
  máy-đọc dưới đây, và `luu-kho-rang.sh` ĐỌC THẲNG nó.** Rà soát vòng 2 (F1 —
  cả ba lăng kính tìm ra độc lập): hợp đồng khai bảy, mảng bash trong bộ răng
  chép **sáu**, đầu ra in `6/6 OK`; vế thứ bảy — đúng vế thêm vào để chữa một
  cái sót có thật — là vế duy nhất không ai đo. Không chữa bằng cách chép thêm
  một dòng vào mảng (đó là nới phép khớp, và lần sửa hợp đồng kế tiếp lại đẻ ra
  lỗ y hệt) mà bằng cách **bỏ hẳn bản chép tay**. Chân round-trip chứng minh bên
  ĐỌC thật sự đọc bên VIẾT: thêm một dòng vào khối trong bản sao hợp đồng thì
  phép đo phải đổi theo và ĐỎ đích danh dòng vừa thêm.

<!-- <<<VAT-LUU-KHO -->
| duong-dan |
|---|
| codex |
| tests/codex |
| scripts/codex-self-script-refs.tsv |
| .agents |
| design-loop |
| tests/design-loop |
| .codex-plugin |
<!-- VAT-LUU-KHO>>> -->

- AC-3: Given hai marketplace, When đọc `.claude-plugin/marketplace.json`, Then
  entry `design-loop` đã gỡ và hai entry còn lại (`acceptance-gate`,
  `feature-loop`) trỏ nguyên vẹn; `.agents/plugins/marketplace.json` không còn
  tồn tại.
- AC-4: Given phạm vi quét = `commands/`, `skills/`, `feature-loop/`, `scripts/`,
  `lib/`, `hooks/`, `tests/`, `GUIDE.md`, `QUICKSTART.md`, `README.md`,
  `CONTEXT.md`, **`CLAUDE.md`**, **`.github/`**, và hai manifest, When quét tham
  chiếu SỐNG tới đồ đã lưu kho — mảng **11 needle**: `codex` · `In Codex` ·
  `.agents` · `design-loop` · `/design-init` · `/design-mockup` · `/design-push`
  · `sync-plugin-packages` · `mirror_sync` · `plugins/` · `P30` — Then 0 hit
  (trừ danh sách miễn trừ dưới); `docs/` và `_acceptance/` ngoài phạm vi. Đối
  chứng dương ở cây của mốc: >0 hit cho TỪNG needle.
  **[SỬA SAU CỔNG 1 — 12/08, Phiên C] Needle `plugins/` phải neo vào GỐC KHO,
  không phải bất kỳ đường dẫn nào chứa chuỗi đó.** Bản duyệt viết trần
  `plugins/`, mà chuỗi ấy khớp luôn `tests/plugins/run-tests.sh` — bộ kiểm CÒN
  SỐNG và là thứ hồ sơ này vừa mổ xong. Đọc needle theo nghĩa đen thì tiêu chí
  đòi xoá mọi lời nhắc tới chính bộ kiểm của mình: đó là phép đo bắt nhầm vật,
  không phải cây bẩn. Needle đúng là bản sao ở gốc kho — `plugins/acceptance-gate`,
  `plugins/feature-loop`, `plugins/design-loop`, và glob `plugins/**` trong
  config — cộng chân ĐỎ-NGOÀI-DANH-SÁCH: tiêm lại một đường dẫn `plugins/<gói>`
  vào bất kỳ tệp nào trong phạm vi thì lưới phải ĐỎ.
  **Vì sao thêm `CLAUDE.md` + `.github/` + từ vựng mirror:** thiếu chúng thì gỡ
  `plugins/` và script sync xong, đoạn bất biến trong `CLAUDE.md` vẫn bắt "chạy
  sync và commit mirror cùng lượt" và CI vẫn gọi script đã xoá — 14/14 eval
  xanh, hai cổng duyệt, rồi CI đỏ sau merge.
  **Miễn trừ tường minh, quyết TRƯỚC khi đo, đúng MỘT dòng:**
  `skills/ux-ui-craft/SKILL.md:289` dùng cụm "a design-loop" làm **danh từ
  chung** ("một vòng lặp thiết kế đối chiếu bản dựng với bản thiết kế gốc"),
  không trỏ plugin. Miễn trừ này phải kèm chân ĐỎ-NGOÀI-DANH-SÁCH (xem AC-12),
  vì một allowlist không có chân đó biến lưới fail-loud thành fail-silent.
  **[SỬA SAU CỔNG 1 — 12/08, Phiên C] Miễn trừ thứ hai: NHẬT KÝ PHIÊN BẢN trong
  `.claude-plugin/plugin.json` và `feature-loop/.claude-plugin/plugin.json`.**
  Trường `description` của hai manifest này là một dải sử liệu phát hành nối dài
  nhiều bản ("v1.7 adds design-loop-aware guards…", "pairing with design-loop's
  layout-token-only blocking rule"). Đó là **lịch sử**, không phải con trỏ sống:
  không dòng nào trong đó bảo máy hay người đi tìm một vật đã lưu kho. Viết lại
  changelog cho lint xanh là **xoá lịch sử để lấy màu** — sai đổi, và trùng
  đúng lớp «hạ thước cho vừa vật». Miễn trừ giới hạn ở **trường `description`
  của đúng hai tệp đã nêu**, kèm chân ĐỎ-NGOÀI-DANH-SÁCH ở AC-14.
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 1] Mảng needle co từ 11 xuống 8, và lý do
  phải nằm ở ĐÂY chứ không phải trong chú thích script.** Đây là lần sửa thứ
  BẢY; rà soát đối kháng vòng 1 bắt được nó chỉ được giải thích trong comment
  của `luu-kho-rang.sh` — đúng cái tội mà chính hồ sơ này đang đi tuần. Ba
  needle bỏ, mỗi cái một lý do khác nhau:
  · **`mirror_sync`** — khoá ấy sống trong `_acceptance/config.yaml`, mà
  `_acceptance/` cố ý NGOÀI phạm vi quét. Để nó trong mảng thì đối chứng dương ở
  mốc cho **0 hit**, và chính lưới này sẽ tuyên "needle chưa bao giờ tồn tại,
  phép đo không sống" — đỏ vì thước chứ không vì vật. Nó KHÔNG mất lưới: AC-9 /
  E10 đo nó bằng **trình đọc khoá YAML thật**, mạnh hơn grep văn bản.
  · **`P30`** — chuỗi trần khớp luôn ca `P30 Claude decision commands` đang
  SỐNG, tức needle bắt nhầm vật. Ca đã chết (`P30 plugins/ mirror`) được E10 đo
  bằng một chân riêng ghim ĐÚNG tiêu đề ca đó.
  · **`/design-push`** — đo trên cây của mốc cho 0 hit trong phạm vi sống: lệnh
  đó chưa bao giờ được nhắc ở đây. Cùng lý do với `mirror_sync`.
  Hai needle nữa đổi HÌNH DẠNG chứ không mất: `.agents` → `\.agents/` (dạng
  đường dẫn — chuỗi trần khớp `t.agents` trong bộ đếm token của `wf-usage.mjs`)
  và `plugins/` → `plugins/acceptance-gate` (neo vào gốc kho, xem đoạn trên).
  **Ràng buộc thay thế, để việc co mảng không thành đường nới lỏng:** mỗi needle
  còn lại PHẢI có đối chứng dương >0 ở mốc, và chân đỏ-ngoài-danh-sách
  (AC-12) phủ **cả mảng**, không phải một.
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 2 «một-nguồn»] Mảng needle nay là khối
  máy-đọc dưới đây, và ba needle `plugins/…` bị thiếu được TRẢ LẠI.** Rà soát
  vòng 2 (F3) bắt được mảng trong script chép đúng MỘT needle `plugins/…` trong
  khi đoạn trên khai bốn — **tái phạm nguyên văn finding C2 của vòng 1**, không
  đổi da, không đổi số. Đo lại ở mốc: `plugins/feature-loop` 1 hit ·
  `plugins/design-loop` 1 hit · `plugins/**` 4 hit, tức đối chứng dương mà chính
  lưới này đòi vốn sẵn có cho cả ba — không có lý do kỹ thuật nào để bỏ. Mảng
  đi từ 8 lên **11 needle**. Mỗi needle phải có **mồi** khai trong `MOI_KHAI`
  của bộ răng; needle có trong khối mà chưa khai mồi → ĐỎ đích danh, vì đó là
  needle không có chiều đỏ (nếu không, «một nguồn» tự đẻ ra lỗ mới ở chỗ khác).

<!-- <<<NEEDLE-CHET -->
| needle |
|---|
| codex |
| In Codex |
| \.agents/ |
| design-loop |
| /design-init |
| /design-mockup |
| sync-plugin-packages |
| plugins/acceptance-gate |
| plugins/feature-loop |
| plugins/design-loop |
| plugins/\*\* |
<!-- NEEDLE-CHET>>> -->
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 1] Miễn trừ là cặp `(tệp, từ khoá)`, không
  phải `(tệp, *)` — và cặp thứ ba được khai ra.** Bản thi công neo miễn trừ theo
  TIỀN TỐ TỆP, nên bốn tệp được che TRỌN cho cả tám needle trong khi hợp đồng
  chỉ khai che `design-loop`. Rà soát vòng 1 tìm ra vật lọt thật: needle
  `sync-plugin-packages` còn **1 hit sống** ở `.claude-plugin/plugin.json`, xanh
  CHỈ NHỜ miễn trừ. Hit đó thuộc cùng dải nhật ký phiên bản (AC-14 chứng minh nó
  nằm trong `description`) nên nó được GIỮ, nhưng phải khai thành một dòng riêng
  chứ không nấp sau một tiền tố. Mỗi dòng miễn trừ nay kèm **số dòng mong đợi**,
  kiểm hai chiều: khai thiếu → đỏ, khai thừa (dòng khai mà tệp không còn hit) →
  cũng đỏ. Dòng miễn trừ cho `tests/plugins/asserts-da-go.txt` bị **gỡ**: `tests/`
  vốn ngoài phạm vi quét nên nó chưa bao giờ với tới cái gì — một mục allowlist
  trang trí. Sổ khai ấy do bánh cóc hai chiều của `P161`/E11 canh.
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 1] Phạm vi quét văn bản BỎ `tests/`, và
  đây là lần sửa thứ TÁM — cũng chỉ được giải thích trong chú thích script cho
  tới giờ.** Quan hệ nhân quả với lần sửa thứ bảy: cắt `tests/` khiến hai needle
  cho 0 hit ở mốc nên phải bỏ chúng; hai lần sửa này là MỘT quyết định, không
  phải hai. Lý do bỏ: trong `tests/`, "không còn con trỏ sống" được cưỡng chế
  bằng thứ MẠNH HƠN GREP — đẳng thức số ca của AC-11 cộng bộ kiểm phải XANH; một
  con trỏ sống sót trong bộ kiểm thì bộ kiểm ĐỎ, không cần grep mới biết. Cái mà grep còn
  bắt được ở đó chỉ còn hai loại, và cả hai đều là sử liệu: chú thích ghi VÌ SAO
  một vật bị lưu kho, và chuỗi fixture cố ý mang tên đường dẫn đã chết để chứng
  minh luật không còn khớp nó nữa. **Đây là chỗ phải đọc kèm hoài nghi:** cắt
  phạm vi là hình dạng điển hình của hạ-thước, và nó chỉ hợp lệ vì thứ thay thế
  MẠNH HƠN chứ không phải vì rẻ hơn. Nếu đẳng thức số ca của AC-11 mà không có
  chân máy thì lập luận này rỗng — đó chính là lý do vòng sửa 1 dựng `so-ca.sh`
  cùng lượt, không tách ra để sau.
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 1] Thêm một vế cho AC-4: mục phạm vi
  KHÔNG tồn tại trên cây thì lưới ĐỎ TRƯỚC khi in bất kỳ con số 0 nào.** Hàm
  quét có `2>/dev/null` và `|| true`: gõ nhầm một mục phạm vi → `grep` im lặng →
  lưới in `HEAD=0 … OK` cho cả tám needle và tuyên cây sạch trong khi nó chưa
  quét gì. Đây là hình dạng «âm-tính-một-mình» ở cấp PHẠM VI thay vì cấp needle,
  nên đối chứng dương ở mốc không bắt được (nó chạy bằng `git grep`, đường khác).
- AC-12: Given danh sách miễn trừ của AC-4, When tiêm một tham chiếu
  `design-loop` MỚI vào một file khác trong `skills/ux-ui-craft/`, Then lưới
  vẫn ĐỎ và ghim đúng file vừa tiêm — miễn trừ chỉ che đúng một dòng đã khai,
  không che cả thư mục.
- AC-5: Given nhánh CT2 trong `feature-loop/skills/feature-loop/SKILL.md`, When
  một feature chạm mặt người mà config chưa wire design, Then máy hướng sang
  **design-pass + eval `ui-check`/`design-gate`**, KHÔNG còn cảnh báo
  "cài design-loop" và KHÔNG còn DỪNG đòi `/design-mockup`; `GUIDE.md` có một
  đoạn ngắn hướng dẫn wire `executors.design` bằng tay.
- AC-6: Given danh sách CẤM ĐỤNG, When kiểm sau khi gỡ, Then `scripts/design-gate.mjs`,
  `scripts/design-scan.js`, `scripts/build-design-scan.mjs`, `lib/design-detect.mjs`,
  `lib/p-tiers.json`, `vendor/impeccable/`, `tests/design-eval/`, `tests/skills/`,
  và skill `design-pass` **còn nguyên** (so bằng BĂM NỘI DUNG với mốc, không
  chỉ `test -e` — tồn-tại-mà-bị-sửa là đúng kiểu cắt nhầm gân mà `test -e` mù),
  suite liên quan xanh. `design-loop/scripts/design-static-check.mjs` đi theo
  mốc git vì nó thuộc design-loop, không thuộc kit.
  **NGOẠI LỆ DUY NHẤT được khác mốc — `skills/ux-ui-craft/`.** Bản trước viết
  "ngoại lệ được phép khác mốc: không có"; kiểm tại chỗ chứng minh câu đó SAI và
  nếu giữ thì AC-4 và AC-6 mâu thuẫn nhau, **không tồn tại trạng thái cây nào
  cho cả bộ xanh** — sửa file cho AC-4 xanh thì AC-6 đỏ, giữ nguyên cho AC-6
  xanh thì AC-4 đỏ, và lối thoát rẻ nhất lúc đó là nới một trong hai sau khi đã
  thấy số, tức hạ thước. Sự thật trên vật: `skills/ux-ui-craft/references/layout-craft.md:121`
  chứa **tham chiếu SỐNG** — "Where design-loop is wired… (`design-static-check`'s
  layout-token-only BLOCK)" — trỏ đúng plugin và đúng script sắp chết, nên nó
  là PHẠM VI PHẢI SỬA, không phải miễn trừ. Câu đó viết lại thành nói về
  `design-pass` + `design-gate` (máy đo ở lại). Dòng `SKILL.md:289` là danh từ
  chung, giữ nguyên (miễn trừ của AC-4).
- AC-7: Given `docs/adr/`, When đọc sau khi gỡ, Then có 2 ADR một-đoạn mới —
  (a) lưu kho Codex, (b) khai tử nghi lễ design-loop — mỗi ADR ghi **đúng sha**
  của mốc git và nêu trigger mở lại.
- AC-8: Given ADR 0001 (commit `plugins/` như build mirror), When đọc sau khi
  gỡ, Then nó được đánh dấu **superseded** kèm trỏ tới ADR mới — không xoá sử
  liệu, vì lý do tồn tại của nó (manifest Codex không đọc được cây đa-edition)
  chết cùng Codex.
- AC-9: Given mirror `plugins/` và bộ máy quanh nó, When kiểm sau khi gỡ, Then
  `plugins/` (125 file), `scripts/sync-plugin-packages.sh`, case P30, khoá
  `executors.script.mirror_sync` và suite-key tương ứng trong
  `_acceptance/config.yaml`, và mục `plugins/**` trong `t1_skip_globs`
  **đều không còn**. (Xem Notes — đây là chỗ lệch đề bài.)
- AC-13: Given `CLAUDE.md`, When đọc sau khi gỡ, Then nó **không còn tuyên bố
  bất biến về build mirror** (4 chỗ nhắc `sync-plugin-packages` / "build
  mirror" hiện tại), đối chứng dương ở cây của mốc >0. Tách khỏi AC-9 (mệnh
  đề này nằm trong một file KHÔNG có lưới máy nào canh (`CLAUDE.md` thuộc
  `t1_skip_globs`) — gộp chung thì nó chìm trong một tiêu chí có 5 vế khác đều
  do script đo, và không ai nhận ra nó chưa được đo).
- AC-10: Given `scripts/product-map.mjs` và `scripts/start-scan.mjs` (hai script
  có nhánh đọc Codex), When **CHẠY THẬT cả hai** trên cây đã gỡ, Then mỗi script
  in đúng câu thành công của nó và không lỗi đọc file. Bản trước chỉ chạy
  `product-map`; `start-scan.mjs` chỉ nằm trong `paths`, mà `paths` không phải
  một thao tác. Kịch bản lọt: nhánh đọc Codex trong `start-scan.mjs` gỡ nửa
  chừng, còn một lượt đọc `.agents/plugins/marketplace.json` — đường dẫn đó
  KHÔNG chứa chuỗi `codex` nên needle cũ mù với nó — cả bộ xanh, lỗi chỉ nổ khi
  một người thật gõ lệnh khởi động ở repo tiêu thụ.
- AC-11: Given cây đã gỡ, When chạy 4 suite + `product-map --check`, Then tất cả
  xanh **và số ca khớp ĐẲNG THỨC khai trước**, không phải khớp một cái sàn:
  `scripts` **671 → 686** (gỡ 7 assert `DSC01–03` + `SG1–4` trong
  `tests/scripts/run-tests.sh:1390-1406` gọi thẳng script của design-loop, rồi
  THÊM 22 assert cho AC-17) · `plugins` **173 → 146** · `hooks` **54 → 54** ·
  `workflows` **488 → 463**. Đỏ ghim "so ca lech ky vong: <truoc> -> <sau>".
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 1 · owner gạch đường 3] Đẳng thức
  `scripts` đổi từ `671 − 7 = 664` sang `671 − 7 + 22 = 686`.** Đây là lần đầu
  con số đi LÊN, và lý do phải đọc kỹ hơn mọi lần trước: AC-17 thêm một guard
  vào `scripts/pre-merge-check.sh` — tệp nằm trong `t3_paths` (lõi cưỡng chế),
  nên nó KHÔNG được vào cây mà không có răng. 22 assert là đếm A-PRIORI từ mã
  vừa viết, TRƯỚC khi chạy suite: `RS01` 5 · `RS02` 3 · `RS03` 3 · `RS04` 3 ·
  `RS05` 3 · `RS06` 5. Đo ra khác 686 ⇒ đi tìm ca, KHÔNG sửa số.
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 1] Bốn con số trên nay có MỘT bản
  máy-đọc, và một script assert chúng.** Rà soát đối kháng vòng 1 chỉ ra thông
  điệp đỏ đã hứa ở trên **không tồn tại trong bất kỳ mã nào**: cả bốn đẳng thức
  đang do NGƯỜI đếm dòng `PASS:`, nên tiêu chí trung tâm của hồ sơ này là một
  lời hứa chứ không phải một lưới. Không phải nới hay siết tiêu chí — là dựng
  cái lưới đã khai. Bản khai máy-đọc nằm ngay dưới; `so-ca.sh` đọc CHÍNH khối
  này (không giữ bản chép thứ hai) và đỏ đúng thông điệp trên.

<!-- <<<SO-CA-KY-VONG -->
| suite | truoc | sau |
|---|---|---|
| plugins | 173 | 146 |
| workflows | 488 | 463 |
| scripts | 671 | 686 |
| hooks | 54 | 54 |
<!-- SO-CA-KY-VONG>>> -->
  **[SỬA SAU CỔNG 1 — 12/08, Phiên C] Con số `workflows` đổi từ «62 → 62» sang
  «488 → 467», và đây là sửa một PHÉP ĐẾM SAI chứ không phải nới số.** Suite
  `workflows` gồm **sáu tệp**, mỗi tệp tự in dòng tổng kết riêng; `62` là số
  của **đúng một tệp** (`skill-claims.test.mjs`) — dòng cuối cùng in ra, nên
  dễ bị đọc nhầm thành tổng. Tổng thật đo trên cây của mốc là **488**
  (`acceptance-verify` 324 · `claim-scan` 42 · `measure-law-mutants` 33 ·
  `execute-parallel` 16 · `carry-plan` 11 · `skill-claims` 62). Giữ nguyên
  «62 → 62» thì tiêu chí này mù với 426 ca còn lại — đúng lớp
  «tổng-kết-không-kèm-số-ca» đã ghi sổ.
  **Dẫn xuất 463, khai trước khi sửa:** mất **25 ca**, đều là ca chỉ đo được
  trên bản chỉ dẫn tiếng Anh của harness Codex — `skill-claims` **62 → 44**
  (hai vòng `MM2`/`MM2m` × 7 câu, cộng hai vế Codex của `JRE_CLAUSES` chạy qua
  hai vòng `JR6`/`JR6m` = 4 ca) · `measure-law-mutants` **33 → 26** (vòng
  `MM7e` × 7 câu) · `claim-scan` **42 → 42** (chỉ bớt một vế assert BÊN TRONG
  một ca đang có, số ca không đổi) · ba tệp còn lại không đụng.
  **Vì sao con số này phải khai lại một lần nữa (467 → 463):** bản khai trước
  đếm sót `JRE_CLAUSES`. Nó lộ ra vì tệp `skill-claims` **dừng giữa chừng** và
  không in nổi dòng tổng kết — đúng thứ đẳng thức số-ca sinh ra để bắt, và là
  lý do không được thay đẳng thức bằng một cái sàn.
  **Sàn `≥` không dùng được cho một suite bị chủ ý làm teo** — nó chỉ đúng cho
  suite không đụng tới; dùng sàn ở đây thì lúc S4 đỏ, đường thoát tự nhiên là
  hạ con số xuống mức vừa đo, và phép đo mất hẳn khả năng bắt gỡ-nhầm.
  **[SỬA SAU CỔNG 1 — 12/08, Phiên C] Con số `plugins` thay «173 trừ số ca của
  P30» bằng `145`, khai TRƯỚC khi mổ.** Bản duyệt giả định thiệt hại gói gọn
  trong một ca; đo trên vật cho thấy **73 ca đỏ**, và chúng chia ba nhóm có
  hệ quả số học khác nhau: **XOÁ HẲN — 26 ca** chỉ tồn tại vì Codex/mirror/
  design-loop; **TRIM hoặc TRỎ LẠI NGUỒN — phần còn lại**, giữ nguyên số dòng
  đo (gói Claude nay CHÍNH LÀ cây nguồn, nên câu hỏi «gói có ship đủ file
  không?» vẫn còn nghĩa, chỉ đổi chỗ hỏi). Cộng thêm **`P39` sinh 4 dòng đo**
  (2 tệp × 2 assert) và tệp Codex chết ⇒ mất 2 dòng. Vậy
  `173 − 26 − 2 = 145`. **Xoá nhóm trỏ-lại-nguồn là cách rẻ nhất để suite xanh lại và cũng
  chính là «gỡ quá tay» mà đẳng thức này sinh ra để bắt** — nếu đo ra 127 thì
  nhóm C đã bị xoá, không phải đẳng thức sai.
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 2 «một-nguồn»] Vế `sau` của `plugins` đi
  từ 145 lên 146, khai TRƯỚC khi đo.** Rà soát vòng 2 (F6) chứng minh lưới «mọi
  `suite_key` phải resolve về một lệnh có thật» bị gỡ CÙNG ca đo nó (`P162`/E6)
  — mà lưới ấy đọc `_acceptance/config.yaml`, vật đang sống, và là đúng vật hồ
  sơ này vừa mổ. Sổ thi công xếp nhầm nó vào «không mất độ phủ». Nay lưới được
  **trả lại bộ kiểm thường trực** dưới tên `P195`, có chiều đỏ chạy thật nêu
  đích danh khoá ma. Vậy `146 = 145 + 1`. Đây là CỘNG một ca, tức đúng chiều mà
  một hồ sơ chỉ-TRỪ phải giải trình: nó không nới tiêu chí nào, nó trả lại một
  lưới mà hồ sơ này đã lỡ gỡ. Đo ra khác 146 ⇒ đi tìm ca gỡ
  nhầm/gỡ sót, KHÔNG sửa số. Baseline `173` là số **đo được** trên cây của mốc
  (173/173 xanh), không phải số chép từ bản duyệt.
- AC-14: Given miễn trừ nhật-ký-phiên-bản của AC-4, When tiêm một tham chiếu
  `design-loop` MỚI vào một **trường khác** của cùng `plugin.json` (ví dụ
  `interface.longDescription`) và vào `description` của một manifest thứ ba,
  Then lưới vẫn ĐỎ và ghim đúng tệp + trường vừa tiêm — miễn trừ chỉ che đúng
  một trường của hai tệp đã khai, không che cả tệp và không che cả họ
  `*/plugin.json`. Không có chân này thì miễn trừ vừa thêm biến lưới fail-loud
  thành fail-silent trên đúng loại tệp mà mọi lần bump phiên bản đều chạm.
- AC-15: Given `tests/plugins/run-tests.sh` và một ca đỏ được tiêm ở **đầu**
  tệp, When chạy trọn suite, Then suite vẫn chạy tới ca **cuối cùng** và tổng
  số ca in ra bằng đúng tổng lúc xanh — không có khối `exit` nào giữa tệp cắt
  cụt phép đo; đối chứng dương: cùng phép tiêm chạy trên cây của mốc cho tổng
  ca **nhỏ hơn hẳn** (bằng chứng lỗi có thật, không phải tiêu chí trang trí).
  **Vì sao đây là tiêu chí chứ không phải bugfix lặng lẽ:** một bản sao của
  khối tổng kết đuôi nằm lạc ở giữa tệp (lọt vào từ `044968e`, 05/08) khiến
  **46 ca cuối không bao giờ chạy khi có ca đỏ phía trước**, mà dòng tổng kết
  in ra vẫn trông bình thường. AC-11 là một ĐẲNG THỨC SỐ CA, nên nó không thể
  đo cái nó nói khi đầu vào bị cắt cụt — chữa phép đo là điều kiện cần để AC-11
  có nghĩa, và nếu không ghim thành tiêu chí thì lần nối ca kế tiếp lại chép
  khối ấy vào lần nữa.

- AC-16: Given hai manifest `plugin.json`, When so với cây của mốc
  `truoc-luu-kho-2026-08`, Then cả hai đã **bump ít nhất một nấc minor**, và
  trang bằng chứng có mục «Đường phát hành» nói rõ đội phải làm gì sau merge.
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 1] Tiêu chí THÊM MỚI, mở rộng phạm vi so
  với bản duyệt — cần owner gạch ở Cổng 2.** Lý do không để đến sau: sổ nhớ của
  kho ghi đúng lớp lỗi này — **lệnh cập nhật bỏ qua khi số trùng mà nội dung
  đổi** — và hồ sơ này gỡ ~194 tệp cộng một gói biến khỏi marketplace. Giữ
  nguyên số là để đúng đợt đổi lớn nhất trượt qua đội im lặng. Nặng hơn: sau
  merge, `design-loop` không còn entry nào nên bản đã cài trên máy đội **treo lơ
  lửng** và `claude plugin update` không gỡ hộ được — đây là việc tay, phải nói
  ra chứ không nằm trong changelog. Phép so neo vào mốc, KHÔNG ghim số cứng (số
  cứng thì lần bump sau tiêu chí này đỏ oan).
  Nếu owner bác: gỡ AC-16 + E16 và ghi vào «Giới hạn đã biết» rằng đội phải được
  báo bằng đường khác.

- AC-17: Given `scripts/pre-merge-check.sh` và một PR có phạm vi diff dựng được,
  When chạy cổng, Then luật soi-lại bằng chứng đã commit **chỉ xét hồ sơ có file
  trong diff PR**; hồ sơ ngoài diff im lặng nhưng **số hồ sơ bị bỏ qua phải in
  ra**; hồ sơ ngoài diff mang lỗi thuộc luật KHÁC vẫn nổ; chạm một hồ sơ cũ là
  nó vào diff và bị soi lại như thường; không dựng được phạm vi diff → kiểm TẤT
  như cũ kèm một dòng NOTE hằng; cờ `--recheck-all` ép quét toàn bộ.
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 1 · owner gạch «đường 3» 13/08] Tiêu chí
  THÊM MỚI, và nó đổi LÕI KIT trong lúc lab đóng băng — ngoại lệ do owner gạch
  tường minh, ghi ở ADR 0010.** Vì sao buộc phải có: hồ sơ này gỡ khoá
  `executors.script.mirror_sync` (AC-9), và **21 hồ sơ ĐÃ KÝ** có eval trỏ khoá
  ấy lập tức chặn MỌI PR sau đó — không hồ sơ nào trong 21 nằm trong diff, không
  hồ sơ nào sửa được mà không viết vào vật đã ký. Đo trên CI: cổng đi từ **22 vi
  phạm xuống 1**.
  **Ngữ nghĩa mượn nguyên của luật staleness** (`stale-theo-diff-pr`, owner ký
  1.39.2): bar này bảo vệ «bằng chứng đi kèm cây ĐANG merge», còn hồ sơ đã merge
  là sử liệu. Phạm vi dùng ĐÚNG hàm `slug_in_diff` mà gap-probe và staleness
  dùng — một nguồn ngữ nghĩa slug↔diff, không parser thứ ba.
  **ĐÁNH ĐỔI, khai thẳng: thước thôi HỒI TỐ.** Siết bar trong
  `lib/evidence-core.cjs` về sau sẽ không tự đo lại hồ sơ cũ. Đường cứu là cờ
  `--recheck-all`; không có cờ đó thì cái mất này vĩnh viễn chứ không phải tạm.
- AC-18: Given hai baseline «recheck trên corpus thật = 0 fail» (`JR11b`,
  `DV4a`), When khoá `executors.script.mirror_sync` chết theo AC-9, Then hai
  baseline ấy chuyển từ **ngưỡng trần** sang **allowlist CÓ TÊN**, và allowlist
  bị ba ràng buộc: chỉ che hồ sơ có tên; chỉ che đúng MỘT lý do (thông điệp phải
  nhắc khoá đã chết — cùng hồ sơ hỏng vì lý do khác thì vẫn ĐỎ); và kiểm HAI
  CHIỀU (tên khai mà hồ sơ đã hết đỏ thì cũng ĐỎ, đòi rút tên).
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 1 · owner gạch «đường (c)» 13/08]** Tiêu
  chí THÊM MỚI. Hai baseline đó gọi `recheck` THẲNG trên corpus, không qua
  `pre-merge-check.sh`, nên AC-17 theo thiết kế không chạm tới chúng — không có
  tiêu chí này thì bộ kiểm `scripts` đỏ vĩnh viễn và **không lane nào xanh để ký**.
  Danh sách sống ở MỘT bản (`tests/scripts/mirror-sync-grandfather.mjs`), hai
  bên đọc chung; hai bản chép là đúng lớp bên-viết-và-bên-đọc-trôi-khỏi-nhau.
- AC-19: Given `tests/scripts/run-tests.sh`, When một tệp `*.test.mjs` con thoát
  khác 0, Then suite phải ghi FAIL cho tệp đó và thoát khác 0.
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 1] Tiêu chí THÊM MỚI cho một BUGFIX phát
  hiện trong lúc đo.** Bản cũ viết `check "$(basename "$_f")" 0 $?` — bash khai
  triển đối số TRƯỚC khi gọi `check`, nên `$(basename …)` chạy trước và **ghi đè
  `$?`** bằng mã thoát của `basename` (luôn 0). Hệ quả: **mọi** `*.test.mjs` đỏ
  vẫn được ghi PASS, suite in "0 failed" và thoát 0. Đo tại commit nền
  `d6044a4`: `core-untouched.test.mjs` ĐÃ đỏ mà suite vẫn in
  `664 passed, 0 failed`. Đúng lớp **bộ-chạy-nuốt-mã-thoát** đã ghi sổ — lần
  trước ở `tests/plugins` (khối thoát-sớm giữa tệp, AC-15), lần này ở
  `tests/scripts`. Ghi thành tiêu chí chứ không sửa lặng vì cùng lý do AC-15:
  đẳng thức số ca của AC-11 không đo được điều nó nói khi bộ đếm mù.
- AC-20: Given hợp đồng này và bộ răng của nó, When chạy `luu-kho-rang.sh` và
  `ghi-so-chay.mjs`, Then **không danh sách nào và không lời hứa thông-điệp nào
  còn tồn tại ở hai bản**:
  · mọi liệt kê mà tiêu chí dựa vào (`VAT-LUU-KHO`, `NEEDLE-CHET`,
  `SO-CA-KY-VONG`) nằm trong ĐÚNG MỘT khối marker của `contract.md`, và bộ răng
  đọc thẳng khối ấy — có chân **round-trip** chứng minh (sửa khối trong bản sao
  hợp đồng → phép đo đổi theo và đỏ đích danh mục vừa sửa);
  · mọi eval có `cmd` khai trường máy-đọc **`pinned:`** — chuỗi phải có trong
  đầu ra của lượt XANH — và `ghi-so-chay.mjs` **fail-closed**: eval thiếu
  `pinned:` → chết to (exit 2); chuỗi ghim không có trong đầu ra thật → exit 1
  **kể cả khi lệnh thoát 0**. Sổ chạy ghi thêm `output` (đuôi có giới hạn),
  `output_bytes`, `output_sha256`, `pinned`, `pinned_missing`.
  **[TIÊU CHÍ THÊM MỚI — 13/08, vòng sửa 2 «một-nguồn». MỞ RỘNG PHẠM VI so với
  bản duyệt Cổng 1, cần owner gạch ở Cổng 2.]** Nó không sinh từ một lỗ đơn lẻ
  mà từ **lớp** mà rà soát vòng 2 bắt được ba lần trong một hồ sơ: hợp đồng khai
  bảy đường dẫn / mã đo sáu (F1) · hợp đồng khai bốn needle / mã đo một (F3) ·
  eval ghim một chuỗi cây không bao giờ in (F4, sống sót vì sổ chạy chỉ ghi mã
  thoát — F8). Luật dừng-vá đòi **đổi bất biến chứ không nới phép khớp**: chép
  thêm một dòng vào mảng thì lần sửa hợp đồng thứ tám lại đẻ ra lỗ y hệt.
  Phạm vi cố ý giới hạn **trong hồ sơ này**; đề xuất nâng thành luật toàn kit
  nằm ở `docs/plans/2026-08-13-hat-giong-liet-ke-may-doc.md`, **chờ Cổng 0** —
  nó là CỘNG và nó đụng engine, nên không được đi ké một vòng sửa.

## Coverage

Quét trên trục **vật bị gỡ × loại tham chiếu × lưới canh nó**.

- Trục **vật** (5): `codex/` (36 file) · `tests/codex/` + `tests/design-loop/`
  (17) · `design-loop/` (16) · `plugins/` mirror (125) · manifest & config.
  [thước CE: `git ls-files` đếm tại chỗ trong worktree này]
- Trục **loại tham chiếu** (4): manifest máy đọc · nhánh code (`resolve-plugin.mjs`,
  `product-map.mjs`, `start-scan.mjs`, `sync-plugin-packages.sh`) · văn bản chỉ
  dẫn (SKILL/command/GUIDE/QUICKSTART/README) · khoá config + suite key.
  [thước CE: grep tiêu-thụ-thật, không grep tên file — đề bài 1b.3]
- Trục **lưới canh** (3): P30 mirror-drift · `product-map --check` · suite
  `plugins`. [thước CE: cả ba đều đổi hình dạng sau khi gỡ, nên mỗi cái cần một
  eval riêng chứ không dựa vào mã thoát trọn suite]

**Ranh giới đã kiểm bằng grep tiêu-thụ-thật** (không suy từ tên):
`plugins/` chỉ được `.agents/plugins/marketplace.json` (Codex) trỏ vào; ba
plugin Claude lấy nguồn từ `./`, `./feature-loop`, `./design-loop` trong
`.claude-plugin/marketplace.json`. Máy đo design nằm ở `scripts/` + `lib/` cấp
kit, không nằm trong `design-loop/`; `tests/design-eval` và `tests/skills`
không tham chiếu `design-loop`.

## Out of scope

- **Xoá `docs/`** — sử liệu để nguyên, kể cả ADR 0001 (chỉ đánh dấu superseded).
- **Sửa hồ sơ `_acceptance/` cũ** — hàng chục hồ sơ đã ký có eval trỏ
  `executors.script.mirror_sync`. Chúng là sử liệu bất biến; luật staleness
  theo diff PR (chip ①) không soi hồ sơ ngoài diff, nên không cần migrate.
  Hệ quả phải khai: **chạy lại verify một hồ sơ cũ sẽ hỏng** vì suite key đã
  chết — chấp nhận, ghi known-limit.
- **Gỡ trường/khoá của đợt 2** (trạng thái veto, đổi luật cổng) — không thuộc
  hồ sơ này.
- **Cắt đo-phút trong `codex/`** — 5 file Codex có `time_human_minutes` chết
  theo AC-2, hồ sơ 1a cố ý không đụng.

## Notes

- **LỆCH ĐỀ BÀI (mục 1b.4) — đã kiểm trên vật, cần owner gạch tại Cổng 1.**
  Đề bài viết: *"Mirror: chạy `sync-plugin-packages.sh` và commit mirror CÙNG
  lượt; P30 phải xanh"* — tức giả định mirror sống tiếp. Kiểm tại chỗ cho thấy
  **`plugins/` tồn tại CHỈ để phục vụ Codex**: `.agents/plugins/marketplace.json`
  là bên duy nhất trỏ vào nó, và ADR 0001 nói thẳng lý do tồn tại là "manifest
  Codex không trỏ được vào cây nguồn đa-edition". Lưu kho Codex mà giữ mirror
  thì còn lại 125 file máy sinh không ai đọc, cộng một lưới (P30) canh sự khớp
  của thứ vô dụng đó. Khuyến nghị **một đường**: gỡ luôn mirror + sync script +
  P30 + hai khoá config, và đánh dấu ADR 0001 superseded. Đây cũng là cách duy
  nhất đạt mục tiêu M4 của bản neo ("nơi phải sửa-hai-lần = 0") — giữ mirror là
  giữ nguyên chỗ sửa-hai-lần. Nếu owner bác, đường lùi là giữ mirror nguyên
  trạng và chấp nhận M4 chỉ đạt một nửa.
  **→ OWNER GẠCH TẠI CỔNG 1 (12/08): «mirror gỡ».** Lệch đề bài được duyệt tường
  minh; AC-9 + AC-13 là phạm vi chính thức, không còn là đề xuất.
- Tổng vật gỡ nếu duyệt khuyến nghị: **~194 file** (125 mirror + 36 codex +
  17 case đo + 16 design-loop) + 1 sync script + 2 khoá config + 2 manifest.
- Thứ tự bắt buộc: đặt mốc git TRƯỚC commit gỡ đầu tiên (AC-1), và ADR ghi sha của
  mốc nên ADR viết SAU khi có mốc.
- Hồ sơ này và hồ sơ `cat-hinh-thuc` là hai nhánh độc lập từ `daa9b3d`; tiêu chí
  âm tính của `cat-hinh-thuc` cố ý loại trừ `codex/` vì hồ sơ này xoá nó.
  **AC-11 của `cat-hinh-thuc` đòi `sync-plugin-packages.sh --check` xanh — tiêu
  chí đó chết khi hồ sơ này merge.** Bên nào merge sau phải rebase và bỏ tiêu
  chí đó; ghi ở đây để không ai phát hiện muộn.
