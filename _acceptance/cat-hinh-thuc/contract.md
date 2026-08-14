---
schema_version: 1
feature: Kit thôi đo phút người ở mọi cổng — gỡ cả lớp HỎI lẫn lớp KHẲNG ĐỊNH về phút, giữ đường đọc-cũ cho hồ sơ đã ký và giữ nguyên mọi răng bằng chứng
slug: cat-hinh-thuc
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: approved
approved_by: Manh
approved_at: 2026-08-12
---

# Acceptance Contract: cat-hinh-thuc

## Context

Kit hiện chặn owner 4–5 lần trong một vòng T2 xanh sạch, phần lớn ở những chỗ
không có gì để quyết: khai số phút đã tốn, bấm xác nhận một kết luận máy đã tự
suy chắc chắn, trả lời 9 câu hỏi tuần tự lúc khởi tạo, và đọc một khối
"việc của anh" gắn vào mọi tin kể cả tin chỉ-báo. Owner phát tín hiệu quá tải
tại cổng ký 11/08 và đã tự thú (07/08) rằng số phút là điền đại cho qua cổng —
tức phép đo này vừa tốn người vừa sinh dữ liệu giả.

Hồ sơ này **chỉ TRỪ**: gỡ những chỗ trên khỏi luật hành xử, không thêm cơ chế
nào. Mọi răng bằng chứng cho máy (hook chặn-lúc-ghi, recheck CI, run-log, lưới
biên merge, các điểm máy-cạn) giữ nguyên — chúng phục vụ nguyên tố 2 của bản
neo ("bằng chứng không tự dối"), là lý do máy được chạy nhanh mà người khỏi
kiểm lại.

**[THU PHẠM VI — 14/08, owner chọn đường ② sau rà soát đối kháng vòng 2]**
Hồ sơ này nay chỉ còn **một** hạng mục: **thôi đo phút người**. Bốn hạng mục
đổi-hành-vi (gỡ tư cách luật-mỗi-tin của khối 👉, T1 tuyên-kèm-căn-cứ, quét độ
phủ thôi phỏng vấn, khởi tạo một-lần-gạch) đã **hoàn nguyên khỏi nhánh này** và
đi sang một hồ sơ riêng, gate bằng hội đồng thật.

**Vì sao thu, nói bằng bằng chứng chứ không bằng cảm giác.** Ba vòng chấm liên
tiếp cho cùng một kết quả: nửa cắt-phút **đo được** — needle có đối chứng dương
thật, đường đọc-cũ chạy được trên fixture thật, khuôn YAML nạp được bằng parser
thật; nửa đổi-hành-vi thì **không**. Lời hứa của nó là hành vi của một agent
đọc văn chỉ dẫn, và ba lượt dựng thước cho nó đều chết cùng một kiểu: rà soát
vòng 2 phá thật **8 lượt và cả 8 vẫn XANH**, trong đó có hai chân là **hằng
đúng** (tập so sánh rỗng · chèn-rồi-grep-lại chính chuỗi vừa chèn) do chính
vòng sửa 1 viết ra và khai nhầm là «mạnh hơn đối chứng dương». Luật dừng-vá
(`STOP-PATCHING-CLAUSE`) bật đúng ở đó: cùng TÊN LỚP LỖI qua hai vòng ⇒ khuôn
giải sai, không phải chi tiết sai.

Bốn eval judgment (`E3b` `E7` `E8` `E9`) sinh ra để chấm đúng nửa ấy — và
**chưa lượt nào chạy**. Thu phạm vi là trả nửa đổi-hành-vi về đúng bộ đo của
nó, thay vì tiếp tục nuôi một bộ thước grep cho một lời hứa grep không đo được.

Source input: [docs/plans/2026-08-12-de-bai-dot1-cat-va-luu-kho.md](../../docs/plans/2026-08-12-de-bai-dot1-cat-va-luu-kho.md)
· bản neo [docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md](../../docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md)

## Criteria

Quy ước cho mọi tiêu chí dạng "0 chỗ còn X": **phạm vi quét** là khối máy-đọc
dưới đây — **bản khai DUY NHẤT**, và bộ răng so phạm vi nó thực quét với chính
khối này rồi in kết quả so (`CAT-SCOPE`). **Ngoài phạm vi** = `docs/` (sử
liệu), `_acceptance/` (hồ sơ cũ), `codex/` (lưu kho ở hồ sơ 1b — xem Out of
scope), `plugins/` (mirror máy sinh, canh riêng ở tiêu chí cuối), và `tests/`
(lý do ngay dưới). Mọi tiêu chí âm tính PHẢI kèm đối chứng dương: cùng câu quét
chạy trên worktree `origin/main` phải cho **>0 hit**, và eval in ra cả hai con
số. **Không tiêu chí nào được miễn luật này** — vòng thu phạm vi 14/08 gỡ hẳn
hai tiêu chí thay vì nới luật cho chúng (xem Out of scope).

<!-- <<<PHAM-VI-RANG -->
| duong-dan |
|---|
| commands |
| skills |
| feature-loop |
| scripts |
| hooks |
| lib |
| GUIDE.md |
| QUICKSTART.md |
| README.md |
| CONTEXT.md |
<!-- PHAM-VI-RANG>>> -->

**[SỬA SAU CỔNG 1 — 13/08, vòng sửa 1] `tests/` RA khỏi phạm vi, khai kèm lý
do.** Bản duyệt Cổng 1 liệt `tests/` vào phạm vi; bộ răng thi công lại quét
không có nó, và không chỗ nào so hai bên — rà soát đối kháng vòng 1 gọi tên
(H6): chạy đúng needle AC-1/AC-12 trên phạm vi đã duyệt thì `how many minutes`
cho 7 hit và `baseline_minutes` cho 2 hit, tức **AC-1 và AC-12 đỏ ngay hôm
nay**. Bảy hit ấy KHÔNG phải luật hành xử sót lại: chúng là **fixture tiêm của
chính lưới thường trực** — các ca `P30`/`P189`/`P193`/`P194` chèn câu cũ vào
một bản sao rồi đòi bộ kiểm ĐỎ. Một lưới có chiều đỏ chạy thật thì BẮT BUỘC
phải chứa câu cũ trong mã của nó; quét `tests/` là bắt lưới tự tố mình, và
đường thoát duy nhất khi ấy là làm yếu chính chiều đỏ đó. Nên `tests/` ra khỏi
phạm vi, và bù lại phạm vi trở thành **khối máy-đọc** ở trên để chỗ lệch không
im lặng được nữa. (Cùng nếp với AC-4 của hồ sơ 1b: một mục ra khỏi phạm vi thì
khai lý do tại chỗ, không âm thầm thu.)

- AC-1: Given cây đã sửa, When quét phạm vi trên tìm chỗ **HỎI người số phút**
  (`hỏi user số phút`, `ask.*minutes`, `phút <số>` trong khuôn mời), Then 0 hit,
  và cùng câu quét trên `origin/main` cho >0 hit.
- AC-12: Given cây đã sửa, When quét phạm vi trên tìm lớp **KHẲNG ĐỊNH về phút**
  — khác lớp HỎI ở AC-1 — gồm `baseline_minutes`, cụm KPI "giảm ≥50% thời gian
  người", mọi lời hứa "5–10 phút/cổng", và `time_human_minutes` trong văn
  khuyến nghị (không phải trong schema), Then 0 hit, đối chứng dương
  `origin/main` >0 hit cho TỪNG needle. Lý do tách khỏi AC-1: văn KPI và lời
  hứa số phút **không phải câu hỏi**, nên mọi needle dạng HỎI đều lọt — hồ sơ
  sẽ ship xanh trong khi tài liệu vẫn quảng cáo một chỉ tiêu đo bằng trường máy
  đã thôi ghi, chia cho một mẫu số cố ý để trống.
- AC-2: Given một contract cũ **có** trường `time_human_minutes` và một contract
  mới **không có** trường đó, When chạy `pre-merge-check.sh`, `recheck-evidence.cjs`,
  `product-map.mjs --check` và bộ dựng card cổng trên cả hai, Then cả hai đều
  chạy hết không lỗi và không cảnh báo về trường thiếu (đường đọc-cũ cho 38 hồ
  sơ đã ký), **và sau khi cả bốn bên đọc chạy, trường phút trong hồ sơ CŨ còn
  nguyên byte trên đĩa**.
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 1] Một vế của eval E2 KHÔNG THOẢ ĐƯỢC và
  phải thay.** Bản duyệt đòi *«card cổng render từ fixture CŨ phải vẫn hiện
  đúng con số 7/3»*. Đo lại: **không bên đọc nào — kể cả trên `origin/main` —
  từng đọc `time_human_minutes`** (grep cả bốn bên đọc trên cả hai cây đều cho
  0). Card chưa bao giờ hiện số phút, nên vế ấy không có trạng thái cây nào
  thoả, và một chân không thoả được là một chân sẽ bị hạ thước lúc nó đỏ. Vế
  thay thế đo đúng lời hứa gốc *«giữ được sử liệu»* bằng thứ quan sát được:
  trường phút của hồ sơ cũ còn NGUYÊN BYTE sau khi bốn bên đọc chạy — bên đọc
  không âm thầm gọt sử liệu. Ghi cả hai vế ở đây vì xoá vế cũ đi là xoá dấu vết
  một lần khai sai.
- AC-3: Given ngữ pháp một-lượt-gõ, When người gõ câu gộp **có** vế `, phút 12`,
  Then máy chấp nhận câu đó và bỏ qua vế phút (không lỗi, không ghi) — người
  quen tay không bị chặn.
  **[SỬA SAU CỔNG 1 — 14/08, vòng thu phạm vi] Lời hứa này do E3b (judgment)
  chấm, KHÔNG do E3 (máy).** E3 chỉ chứng **MỰC ĐÃ IN**: cụm cũ đã vắng (đối
  chứng dương trên base), cụm mới có mặt ở dạng CỤM LIỀN, và điều khoản
  `GATE-ONESHOT-CLAUSE` còn đủ bản chép ở 6 site. Rà soát vòng 2 (Ha) đảo nghĩa
  khối ngữ pháp **180° theo ba cách** mà E3 vẫn xanh — trong đó cách rẻ nhất là
  **nối thêm một câu huỷ** vào cuối khối, thứ không phép so-với-base nào bắt
  được. Chân «so TẬP CÂU» đã **gỡ** thay vì vá: nó lọc `grep -v 'phút'` nên
  miễn trừ vĩnh viễn đúng 5 câu chịu lực. Hệ quả phải khai thẳng: **AC-3 chỉ
  được coi là đạt khi E3b đã chấm**, và E3b hiện chưa ai chạy — Cổng 2 không ký
  được nếu nó vẫn trống. Đây là known-limit, ghi lại ở mục Notes.
- AC-4: Given `/acceptance-report`, When chạy trên workspace hiện tại, Then báo
  cáo **không còn** nhánh so phút-vs-baseline, **vẫn còn** sổ vàng và mục vệ
  sinh cổng, và chạy được trên workspace có lẫn hồ sơ cũ-có-phút.
- AC-6: Given `scripts/gate-card.js`, When render card cổng ở cả ba mode, Then
  card **vẫn có** khối 👉 VIỆC CỦA ANH (đối chứng giữ-gân — chip GỠ không được
  gỡ nhầm sang card cổng).
- AC-14: Given ba khuôn frontmatter máy-đọc mà hồ sơ này chạm
  (`CONTRACT-FRONTMATTER-TEMPLATE`, `OPP-FRONTMATTER-TEMPLATE`,
  `UAT-FRONTMATTER-TEMPLATE`) và khuôn frontmatter của
  `evidence-report-template.md`, When rút từng khối rồi nạp bằng **parser YAML
  thật** (`yaml.safe_load`), Then cả bốn parse được.
  **[THÊM SAU CỔNG 1 — 13/08, vòng sửa 1; do rà soát đối kháng vòng 1 tìm ra
  (H4)].** Hạng mục 1a.1 xoá dòng CHA `time_human_minutes:` ở hai khuôn mà để
  lại dòng CON thụt vào (`gate0:` · `gateUAT:`) — khối YAML giao ra **hỏng**,
  và cả hai khối ấy dán nhãn CHÉP NGUYÊN VĂN, nên `/start` một mục khám phá sẽ
  sinh `opportunity.md` có frontmatter không parse được. Nó xanh suốt vì ca
  thường trực `P82` đọc khoá ở tầng trên cùng bằng parser theo dòng, bỏ qua dòng
  thụt: bên viết và bên đọc trôi khỏi nhau. Bốn tệp template/reference mà hồ sơ
  này chạm có **độ phủ bằng không** — `grep '*-template'` trong `evals.yaml` +
  `contract.md` + bộ răng đều rỗng. Tiêu chí này là chỗ đóng lỗ ấy, và nó phải
  đo bằng parser THẬT chứ không bằng regex — regex là đúng thứ đã để lỗ sống.
- AC-10: Given hai văn bản đang mâu thuẫn về ai commit chữ ký
  (`commands/signoff.md` vs `skills/acceptance/SKILL.md` dòng "The user (not
  you) fills…"), When đọc cả hai sau khi sửa, Then chúng nói **cùng một câu**:
  người tự commit HOẶC ra lệnh tường minh cho agent commit đúng phần
  người-sở-hữu; lưới `require_human_commit` + `agent_authors` không đổi.
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 1] «Cùng một câu» nay có MỘT bản gốc.**
  Rà soát vòng 1 (H3) chạy đúng đột biến eval đã hứa — sửa `SKILL.md` thành
  *«NEVER commit signature lines yourself…»*, chỏi thẳng `signoff.md` — và bộ
  răng **vẫn xanh**, vì nó đo sự có mặt của hai chuỗi rời chứ không đo quan hệ.
  Nay điều khoản có bản gốc DUY NHẤT `SIGNATURE-OWNER-CLAUSE` ở
  `commands/signoff.md` bước 7; `skills/acceptance/SKILL.md` chép nguyên văn, và
  phép đo là **byte-equal giữa hai bản chép** cộng bốn vế nội dung bắt buộc
  (hai lối hợp lệ + hai lưới cưỡng chế) — byte-equal một mình thì hai câu rỗng
  nghĩa cũng bằng nhau.
  **[KHAI GIỚI HẠN — 14/08, rà soát vòng 2 (Hg)] Một-nguồn chứng NHẤT QUÁN,
  không chứng ĐÚNG.** Sửa CẢ HAI thân giống hệt nhau — ví dụ nối «since 14/08
  this is ADVISORY: the agent commits the signature itself when the human is
  away» — thì byte-equal vẫn đúng và cả bốn vế literal vẫn có mặt. Không lưới
  máy nào đóng được lỗ ấy; cái đóng nó là **mắt người đọc điều khoản một lần**,
  cộng hai lưới cưỡng chế THẬT (`require_human_commit` + `agent_authors`) vốn
  chặn ở tầng commit chứ không ở tầng chữ. Khai ra vì một hồ sơ tuyên «đo QUAN
  HỆ» mà không nói giới hạn của phép đo quan hệ là đang bán một sự bảo đảm nó
  không có.
- AC-11: Given cây đã sửa, When chạy 4 suite (`scripts`, `hooks`, `plugins`,
  `workflows`) + `product-map --check`, Then tất cả xanh **và số ca khớp ĐẲNG
  THỨC khai trước** — khối `SO-CA-KY-VONG` trong hợp đồng của hồ sơ
  `luu-kho-codex-va-nghi-le-design`, xem «một bản khai» dưới — không phải khớp
  một cái sàn.
  **[SỬA SAU CỔNG 1 — 13/08, thi công · rebase lên 1b] Hai vế của tiêu chí này
  CHẾT theo hồ sơ 1b, và mẫu số phải khai lại.**
  · Vế **`sync-plugin-packages.sh --check`** và vế **«mirror `plugins/` đã sync
  cùng lượt»**: 1b xoá cả script lẫn mirror (AC-9 của nó, owner gạch «mirror
  gỡ» tại Cổng 1 ngày 12/08). Giữ hai vế này thì **không tồn tại trạng thái cây
  nào cho cả bộ xanh** — đúng hình dạng mâu thuẫn mà chính hồ sơ 1b đã phải xử
  một lần giữa AC-4 và AC-6. Bản bàn giao 13/08 gọi tên trước: *«AC-11 của 1a
  đòi một script đã bị 1b xoá — bên merge sau phải rebase và bỏ tiêu chí đó»*.
  · **Baseline khai trong Notes lỗi thời.** Bốn con số ở đó đo tại `daa9b3d`,
  TRƯỚC 1b. Hồ sơ này nay đứng trên cây đã có 1b, nên mẫu số đúng là số sau-1b.
  · **MỘT bản khai, không hai — [SỬA SAU CỔNG 1 — 13/08, lượt hai].** Bản 13/08
  đầu tiên chép bốn con số vào một khối `SO-CA-KY-VONG-1A` **ngay trong tệp
  này**, rồi để eval chạy `so-ca.sh` của 1b. Đó là một cái bẫy: `so-ca.sh` đọc
  `$HERE/contract.md`, tức hợp đồng của **1b**, nên khối vừa chép ở đây
  **không code path nào đọc** — hai bản khai cùng tuyên về một tiêu chí, và bản
  người-đọc-thấy-trước lại là bản máy KHÔNG đọc. Đúng lớp «bên viết và bên đọc
  trôi khỏi nhau» mà CLAUDE.md gọi tên. Khối trùng đã **gỡ**; bản khai DUY NHẤT
  là khối `SO-CA-KY-VONG` của 1b, và ba eval dưới ghim đúng thông điệp sinh ra
  từ nó.
  · **Vì sao vẫn đủ chứng cho tiêu chí của hồ sơ NÀY.** Điều 1a cần chứng là
  *«1a không làm xê dịch số ca»*. Vế `sau` trong khối của 1b (146 · 463 · 686 ·
  54 — `plugins` đi từ 145 lên 146 ở vòng sửa 2 của 1b, khi lưới `suite_key`
  phải-resolve được trả lại thành ca `P195`; xem eval E12) được đo tại ngọn 1b, tức TRƯỚC mọi commit của 1a. Cây 1a khớp đúng vế ấy
  nghĩa là bốn con số không nhúc nhích qua toàn bộ 1a — đúng mệnh đề cần, đo
  bằng một bản khai có sẵn thay vì bịa thêm một mẫu số thứ hai để tự so với
  mình.
  · **Vì sao KHÔNG hạ thành «cứ xanh là được»:** hạng mục 1a.2 CỐ Ý gỡ một số
  ca trong `tests/plugins` (case luật-mỗi-tin). Đó là một bộ kiểm bị chủ ý làm
  teo — đúng loại mà sàn `≥` mất răng: lúc đỏ, đường thoát rẻ nhất là hạ số
  xuống mức vừa đo. Số ca kỳ vọng phải khai **trước** khi cắt, đếm a-priori từ
  danh sách case gọi tên.

  **Bốn số kỳ vọng — `plugins` 146 · `workflows` 463 · `scripts` 686 ·
  `hooks` 54 — khai đầy đủ 13/08, TRƯỚC khi đo, sau khi đọc từng ca đỏ.** Bốn
  con số này KHÔNG lặp lại thành khối máy-đọc ở đây; chúng in ra từ bản khai duy
  nhất của 1b (xem gạch đầu dòng «MỘT bản khai» trên). Hai suite
  không đụng (`workflows`, `hooks`) là đẳng thức không-đổi. Hai suite còn lại
  cũng KHÔNG ĐỔI, và lý do đáng ghi vì nó ngược với dự kiến ban đầu: hạng mục
  1a.2 làm chết một số **assertion**, nhưng **không ca nào mất đích để trỏ về**.
  Mỗi ca đỏ (`P30` `P189` `P193` `P194`) còn nhiều vế khác vẫn đúng nguyên —
  xoá trọn ca là vứt luôn những vế ấy. Nên đường đúng là **TRIM, không XOÁ**,
  đúng nguyên tắc nhóm B/C mà hồ sơ 1b đã đặt: *xoá cho suite xanh lại là cách
  rẻ nhất, và cũng chính là «gỡ quá tay» mà đẳng thức này sinh ra để bắt.*
  Assertion bị gỡ phải khai từng dòng vào `tests/plugins/asserts-da-go.txt`.
  **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 1] Câu tiếp theo của bản duyệt SAI, và
  nó sai theo kiểu tự cho mình một lưới không có (H8).** Bản duyệt viết «bánh
  cóc `P161`/E11 kiểm HAI CHIỀU nên khai thiếu hay khai thừa đều đỏ». Bánh cóc
  so với **một mốc ghim** `044968e` (06/08), còn assert mà 1a gỡ **sinh
  2026-08-11** — nó nằm NGOÀI cửa sổ, nên `P161` **không thể** đỏ dù khai hay
  không. Chính header của `asserts-da-go.txt` đã khai lỗ ấy từ vòng thu gọn của
  1b (F7: «67 assert sinh sau mốc bị gỡ mà bánh cóc không thấy»); hợp đồng 1a
  tuyên ngược lại. Dòng khai nay ĐÃ có trong sổ, kèm ghi chú rằng nó là **dấu
  vết khai bằng tay, không phải sự cưỡng chế**. Không dựng lưới mới ở đây: dời
  mốc ghim là quyết định của hồ sơ khác, và một hồ sơ chỉ-TRỪ không phải chỗ
  mọc thêm cơ chế.
  `scripts` = 686 vì hồ sơ này không chạm `tests/scripts/`.

## Coverage

Quét bằng morphological-scan trên trục **điểm-gọi-người × loại-vật × harness**.
Nguồn: trang audit ~60 điểm-gọi-người của Phiên B (12/08) + grep tại chỗ trong
worktree này (KHÔNG tin số dòng trong đề bài — đã tìm lại từng chỗ).

- Trục **điểm gọi người** (5 giá trị): Cổng 0 Đáng · Cổng 1 duyệt · Cổng 2 ký ·
  Cổng Giá trị UAT · ngoài-cổng (khởi tạo, quét độ phủ, phân loại T1).
  [thước CE: bảng M1 bản neo — 4–5 lần chặn/vòng T2]
- Trục **loại vật** (4 giá trị): command `.md` · SKILL `.md` · template/reference
  · script + case đo. [thước CE: `t1_skip_globs` của chính repo — `.md` ở đây LÀ
  hành vi, nên cả bốn loại đều phải sửa, không chỉ script]
- Trục **harness** (3 giá trị): Claude plugin (nguồn) · mirror `plugins/` (máy
  sinh) · Codex (song sinh). [thước CE: M4 bản neo — Codex lưu kho ở 1b, nên
  trục này rút còn 2 sau đợt 1]

**Bốn chỗ audit tại chỗ tìm ra mà đề bài chưa liệt** (đưa vào phạm vi, không
âm thầm bỏ):
1. `GUIDE.md:49` khai **KPI #1 "giảm ≥50% thời gian người"** đo bằng
   `time_human_minutes` vs `baseline_minutes` — mà `baseline_minutes` cố ý để
   trống. KPI này đã chết trên thực tế; cắt phút làm nó lộ ra.
2. `GUIDE.md` + `QUICKSTART.md` còn ~10 chỗ hứa "5–10 phút/cổng" trong sơ đồ và
   bảng — số này lấy từ dữ liệu owner tự thú là điền đại.
3. `commands/start.md` và `commands/acceptance-init.md` cũng chạm khối
   việc-của-anh / phút, đề bài không nêu tên.
4. `skills/ux-ui-craft/references/*` có chữ "phút" nhưng là thời lượng
   animation — **không đụng** (đã kiểm, không cùng lớp).

## Out of scope

- **[THU PHẠM VI — 14/08, owner chọn đường ②] BỐN HẠNG MỤC ĐỔI-HÀNH-VI ra khỏi
  hồ sơ này, và mã của chúng đã HOÀN NGUYÊN khỏi nhánh** (không phải «để lại
  chờ», mà là `origin/main` trở lại nguyên trạng ở đúng những chỗ ấy):

  | Hạng mục | Tiêu chí cũ | Vật đã trả về nguyên trạng |
  |---|---|---|
  | Gỡ tư cách luật-mỗi-tin của khối 👉 VIỆC CỦA ANH | AC-5 (+E5) | vế chỉ-báo trong `GATE-INVITE-CLAUSE`; vế 👉 trong `GATE-ONESHOT-CLAUSE` + **6 thân lệnh cổng**; bullet tin-CHỈ-BÁO; assert của `P193`, ba mục của `P189` |
  | Xác-nhận T1 → tuyên-kèm-căn-cứ | AC-7 (judgment E7) | nhánh T1 trong `skills/acceptance/SKILL.md` và `feature-loop/.../SKILL.md` |
  | Quét độ phủ thôi phỏng vấn | AC-8 (judgment E8) | `skills/morphological-scan/SKILL.md` |
  | Khởi tạo một-lần-gạch | AC-9 + AC-13 (judgment E9 + E9b) | `commands/acceptance-init.md` (giữ lại đúng phần cắt-phút: bỏ câu hỏi `2g` và khoá `baseline_minutes`) |

  **Vì sao ra, nói bằng cái đo được.** Rà soát đối kháng vòng 2 phá thật **8
  lượt trên bộ răng và cả 8 vẫn XANH**; bảy trong tám thuộc đúng bốn hạng mục
  trên. Hai chân là **hằng đúng** — `GATE-INVITE-CLAUSE` trên base là ĐÚNG MỘT
  câu và câu ấy chứa chữ «chỉ-báo», nên tập so sánh **rỗng** và chân xanh bất kể
  HEAD viết gì; còn «đối chứng dương tự sinh» của AC-13 là chèn một chuỗi vào
  bản sao rồi `grep` lại chính nó, tức một định lý về `grep`. Cả hai do vòng sửa
  1 viết, và cả hai được khai trong hợp đồng là **mạnh hơn** đối chứng dương —
  đó là hồ sơ tự dối, đúng thứ kit tồn tại để chặn.
  Lời hứa của bốn hạng mục này là **hành vi của agent đọc văn chỉ dẫn**. Bốn
  eval judgment sinh ra để chấm đúng nó — và chưa lượt nào chạy. Giữ chúng ở
  đây là tiếp tục nuôi thước grep cho thứ grep không đo được; `giờ-kit là chi
  phí`, và ba vòng vừa qua là hoá đơn.

  **Điều KHÔNG được suy ra từ mục này:** bốn hạng mục ấy vẫn ĐÁNG làm — owner
  gạch chúng ở Cổng 1 ngày 12/08 và lý do vẫn nguyên. Chúng đi sang hồ sơ
  [1c](../../docs/plans/2026-08-14-hat-giong-1c-doi-hanh-vi-cong-nguoi.md), và
  điều kiện vào là **hội đồng chấm thật**, không phải một bộ răng grep dày hơn.


- **Toàn bộ `codex/`** — 5 file Codex cũng mang `time_human_minutes`, nhưng
  chúng chết ở hồ sơ 1b. Sửa ở đây là sửa đôi rồi xoá; đề bài cấm tường minh.
  Hệ quả: mọi tiêu chí âm tính của hồ sơ này loại trừ `codex/`, và **1b phải
  merge thì mới có "0 hit toàn cây"**.
- **Bỏ hẳn trường `time_human_minutes` khỏi schema** — chỉ thôi HỎI và thôi
  GHI; trường ở lại để 38 hồ sơ cũ đọc được và để bật lại bằng một dòng luật
  nếu sau này cần KPI thật (sổ quyết định bản neo).
- **Sổ vàng và mục vệ sinh cổng** trong `/acceptance-report` — giữ nguyên.
- **Mọi răng bằng chứng cho máy** — hook chặn-lúc-ghi, recheck CI, run-log,
  lưới biên merge, điểm máy-cạn, Cổng Giá trị, card quyết định, trang bằng
  chứng, đường thoát có dấu vết, `design-pass`, `ux-ui-craft`, máy đo design.
  (Danh sách CẤM ĐỤNG của bản neo §2, chép nguyên.)
- **Đổi luật cổng cho ca xanh-sạch** (máy đi trước ở trạng thái veto) — đó là
  đợt 2, không phải hồ sơ này.

## Notes

- **Hạng mục 1a.7 (sửa `CLAUDE.md`) có ràng buộc riêng.** `CLAUDE.md` nằm trong
  `t1_skip_globs` nên KHÔNG có lưới máy nào canh nó — chữ duyệt của owner là
  điều khiển duy nhất. Thêm nữa, luật vận hành của phiên thi hành cấm sửa
  `CLAUDE.md` theo yêu cầu của một phiên ngang hàng. Vì vậy bản sửa `CLAUDE.md`
  được soạn như **đề xuất tách riêng, trình tại Cổng 1**, và chỉ commit sau khi
  owner gật thẳng trong phiên. Không thêm lượt gọi người: Cổng 1 vốn đã cần owner.
- **Hai cờ vàng từ vựng còn cố ý để lại** (lint W6, dòng 26): chữ "hook" và
  "run-log". Cả hai nằm trong cụm chép NGUYÊN VĂN từ danh sách CẤM ĐỤNG của
  bản neo. Đổi chữ cho lint xanh sẽ làm hợp đồng lệch khỏi văn bản nó phải
  trace về — cái giá lớn hơn cái được. Các cờ W6 khác đã sửa về từ chuẩn
  (`card` thay `thẻ`, `case đo` thay `test`).
  **[SỬA SAU CỔNG 1 — 13/08, thi công] Câu cuối trên KHÔNG đúng — còn HAI cờ
  nữa, và cả hai đã có từ bản duyệt Cổng 1:** dòng "Thẻ Cổng 1 render 11/13"
  (W6 «thẻ») và dòng "KHÔNG tự sửa engine ở đây" (W6 «engine») trong chính mục
  LỖ LÕI KIT dưới. Cả hai là **dương tính giả của lint**: nó quét từ khoá không
  xét nghĩa, mà "thẻ Cổng 1" ở đây đúng là *card*, còn "engine" là *engine của
  kit* chứ không phải *executor*. Không sửa (sửa là làm câu sai nghĩa để lint
  xanh); ghi ra vì một hợp đồng tuyên "các cờ khác đã sửa" trong khi còn cờ là
  một khẳng định sai nằm trong vật được giao — đúng lớp lỗi hồ sơ 1b vừa bị
  bắt ở `layout-craft.md`. Tổng: **4 cờ W6, cả 4 cố ý, 0 vi phạm.**
- **LỖ LÕI KIT phát hiện lúc dựng card Cổng 1 — ngoài phạm vi hồ sơ này, nhưng
  phải ghi vì nó im lặng.** Sau phản biện tôi đặt hai tiêu chí mới tên `AC-1b`
  và `AC-9b`. Thẻ Cổng 1 render **11/13** tiêu chí, và lint **không hề kêu**.
  Nguyên nhân: cả `lib/ac-line.cjs` lẫn `scripts/eval-coverage-lint.js` dùng
  `AC-\d+\b` — với `AC-1b` thì sau `1` là `b`, không có ranh giới từ, nên tiêu
  chí có hậu tố CHỮ **vô hình với cả bên đếm-ứng-viên lẫn bên bóc-dòng cùng một
  lúc**. Hai bên im lặng đồng thuận bỏ qua, nên lưới W7 (vốn sinh ra để bắt
  đúng việc thẻ hiện thiếu) cũng câm. Hệ quả chung: **bất kỳ hợp đồng nào dùng
  mã tiêu chí có chữ đều mất tiêu chí đó khỏi thẻ duyệt mà không ai biết.**
  Xử lý trong hồ sơ này: đổi hai mã thành `AC-12`/`AC-13`, thẻ hiện đủ 13/13.
  KHÔNG tự sửa engine ở đây (đó là hồ sơ khác); đề nghị owner quyết mở một vòng
  riêng hay ghi vào sổ vấp.
- Bản neo yêu cầu mọi PR của đợt trỏ về nó; PR của hồ sơ này sẽ trỏ.
- **Baseline 4 suite tại `daa9b3d`, cây sạch, khai TRƯỚC Cổng 1** (đây là mẫu
  số của mọi tiêu chí ghim-số; không có nó thì eval nào cũng hạ thước được sau
  khi thấy kết quả): `scripts` **671** · `hooks` **54** · `workflows` **62** ·
  `plugins` **173 ca** (suite này in "all plugin tests passed" chứ KHÔNG in số,
  nên số ca phải đếm bằng số dòng `PASS:` — chính vì thế nó là suite dễ teo mà
  không ai thấy). Tất cả 0 fail.
  **[SỬA SAU CỔNG 1 — 13/08, thi công] Bốn con số trên KHÔNG còn là mẫu số của
  hồ sơ này** — chúng đo tại `daa9b3d`, trước 1b. Mẫu số đúng là bốn số nêu ở
  AC-11, đọc từ bản khai của 1b. Giữ đoạn này nguyên văn làm **sử liệu**: nó
  ghi cái đã khai tại Cổng 1, và xoá nó đi là xoá dấu vết một lần khai.
  Riêng con số `workflows` **62** ở đây từng SAI ngay lúc khai (nó là số của
  đúng một tệp trong sáu tệp của suite; tổng thật tại `daa9b3d` là **488**) —
  hồ sơ 1b tìm ra và khai lại. Ghi ở đây để không ai đọc bảng cũ rồi tưởng 1a
  làm teo suite luồng.
- **Rebase lên 1b, ghi 13/08.** Hồ sơ này thi công trên cây ĐÃ CÓ 1b thay vì
  trên `daa9b3d` như nhánh gốc. Lý do: bảy hạng mục của 1a chạm `CLAUDE.md`,
  `skills/acceptance/`, `commands/approve.md`, `commands/signoff.md`,
  `feature-loop/skills/` — **đúng vùng 1b vừa sửa**. Thi công song song trên
  cùng tệp thì (a) xung đột chắc chắn ở 5+ tệp, và (b) mọi phép đo chạy trên
  một cây không bao giờ tồn tại thật. Hệ quả phải khai: **1a chỉ merge được sau
  1b**, và nếu vòng rà soát đối kháng của 1b làm đổi vật thì 1a phải rebase lại.
- **KHAI GIỚI HẠN — BỐN eval của 1a mượn dụng cụ của 1b.** E11/E12/E13/E16 chạy
  `so-ca.sh` và bốn khoá `executors.script.luu_kho_so_ca_*`, đều là vật của hồ sơ
  1b, đều mang nhãn *«chết theo hồ sơ khi merge»*. Nếu ai đó thi hành nhãn ấy
  đúng nghĩa đen lúc merge 1b, **bốn eval này mất vật đo** và AC-11 mất chân
  đẳng thức — đúng hình dạng E16 vừa dẫm một lần (nó trỏ `mirror_sync`, khoá
  chết, và không lưới nào kêu cho đến khi soi tay). Vì sao vẫn chọn mượn:
  ba hồ sơ đã merge trước đó (`mot-luot-go-cong-nguoi`, `may-ganh-nguoi-quyet`)
  còn nguyên script + khoá sau merge, nên nhãn kia trên thực tế chưa từng được
  thi hành; dựng bản sao thứ hai của bộ đếm 200 dòng để phòng một việc chưa
  xảy ra là giờ-kit đắt hơn phần nó chặn. **Nếu 1b bị gỡ khoá lúc merge:**
  chép `so-ca.sh` vào workspace này, đổi marker sang `SO-CA-KY-VONG-1A`, khai
  lại bốn số trong hợp đồng NÀY, và trỏ BỐN eval sang bản sao — không được hạ
  đẳng thức thành sàn hay bỏ eval.
- **Mục Out of scope «toàn bộ `codex/`» nay TỰ THOẢ.** Nó viết cho cây còn
  Codex; trên cây này `codex/` đã đi theo 1b, nên các tiêu chí âm tính của 1a
  không cần loại trừ gì nữa. Câu «1b phải merge thì mới có 0 hit toàn cây» vẫn
  đúng nguyên văn — chỉ là điều kiện ấy đã thoả sẵn ở base của nhánh này.
