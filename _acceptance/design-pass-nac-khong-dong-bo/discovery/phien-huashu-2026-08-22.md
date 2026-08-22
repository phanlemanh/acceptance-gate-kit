# Phiên «Phân tích skill Huashu Design» — hồ sơ khám thêm cho ô `design-pass-nac-khong-dong-bo`

**Nguồn:** phiên Claude Code `local_272c4999-05a7-4f00-857b-72aab020b9a7`, cwd kit,
20/08 → 22/08/2026; kết thúc bằng PR #85 (merge `73ea8633`: mở ô cơ hội + hạt
giống 4.3/5 + hình H4). **Lý do gom:** 22/08 owner xem thẻ Cổng Đáng và chọn
*khám thêm trước khi ký* — toàn bộ phân tích và hình của phiên này là vật liệu
khám thêm, và chỉ sống trong bản ghi phiên nếu không chép vào ô.

**Cách đọc:** mục 1–8 là **nguyên văn** lời máy trả lời trong phiên, theo thứ tự
thời gian (lời owner chép ở mục 0 dưới dạng chuỗi câu hỏi). Không sửa chữ —
chỗ nào đã bị phiên sau đính chính thì ghi chú ở đầu mục. Nguồn chữ của ô vẫn
là `opportunity.md` và hạt giống `docs/plans/2026-08-19-hat-giong-design-pass-nac-khong-dong-bo.md`;
file này là phụ lục sử liệu.

## 0. Mục lục vật của phiên

| Vật | Ở đâu | Ghi chú |
|---|---|---|
| Hạt giống (nguồn chữ, mục 2b · 3 · 3b · 4.3 · 5 do phiên này viết/sửa) | `docs/plans/2026-08-19-hat-giong-design-pass-nac-khong-dong-bo.md` | đã merge (#85) |
| Hình H4 — swimlane Người/Máy/Vật trước–sau (tầng 2) | `docs/plans/assets/2026-08-19-hat-giong-design-pass/truoc-sau-design-pass.{html,svg,png}` | HTML là nguồn, SVG/PNG dẫn xuất; đã merge (#85) |
| Hình «Ba nguồn hội tụ về bước phân kỳ» (phác tầng 1, vẽ nội tuyến trong phiên) | `discovery/phan-ky-vay-tu-ba-nguon.svg` (cạnh file này) | chỉ tồn tại trong bản ghi phiên trước khi chép về đây |
| Ô cơ hội | `_acceptance/design-pass-nac-khong-dong-bo/opportunity.md` | mở bởi phiên này (#85), ngưỡng điền ở #88 |
| Canvas b1 «Phiếu khuyên b1 — cổng phân kỳ» (6 artboard / 2 trang) | https://claude.ai/code/artifact/37c8dfeb-c2c4-42da-8fa3-b4923b2860b0 | artifact online, repo artifact-platform; 0 comment thread (kiểm 22/08) |
| Audit «Bảy bề mặt của Trang tư vấn» (ảnh sản phẩm thật, 7 bề mặt × 2 khổ) | https://claude.ai/code/artifact/3db79ddc-a5ba-4c63-8411-25eda3298b72 | vật mà owner thật sự quyết trên đó (bỏ b1) |
| `design-pass.md` + sổ quyết định của b1 | artifact-platform, nhánh `claude/dreamy-burnell-b3b8fb` (`e5268ef6f`) | bằng chứng ván thử, không kế thừa |
| Sổ nhớ | `huashu-design-teardown` · `design-canvas-cho-buoc-phan-ky` · `design-pass-nac-khong-dong-bo-hat-giong` | memory của máy, ngoài repo |
| Skill `/design` (toàn văn preview Claude Design trong Claude Code) | nạp trong phiên; không chép (thân skill bên thứ ba) | mục 2 tóm 5 phát hiện |

**Không gom:** bảy hình phác H1–H7 của phiên 19/08 (mục 8 hạt giống) — thuộc
phiên khác, chỉ H4 đã nâng tầng 2; thân skill `/design` và repo huashu-design
(vật bên thứ ba, kit chỉ kế thừa triết lý — xem bảng Nguồn ngoài của ô).

**Chuỗi câu hỏi của owner (theo thứ tự):** ① «Phân tích skill này» (link
huashu-design) → ② «Đào sâu hơn nữa những gì có thể học đứng từ north star, các
tính năng mới nhất của /design trong claude code và từ skill Huashu Design và
Workflow của tôi trong thực hiện Feature Loop đặc biệt liên quan đến design từ
đó phân tích → đánh giá → đề xuất» → ③ «Mô phỏng lại bằng diagram so sánh trước
và sau khi tích hợp với workflow, bổ sung vào hạt giống 19/08» (+ «sửa lỗi tài
liệu download chứ không mở được in-app browser») → ④ «Phân tích ưu và nhược
điểm của trước và sau? Điều gì để giải quyết được bài toán design giữa ý định
người dùng và thực tế bàn giao?» → ⑤ «Làm thế nào tận dụng được ưu điểm của cả
2 phương pháp nhưng vẫn theo north star và đáp ứng các trường hợp?» → «Đồng ý»
→ ⑥ «Mở lại artifact hạt giống và kiểm tra lại» → ⑦ «Phiên đã dừng vài ngày…
kit lên 2.3, đóng Trang tư vấn… cập nhật hiện trạng… thành tài liệu để hạt
giống cơ hội đi đúng quy trình kit từ opportunity» → «Đồng ý, mở ô cơ hội trên
nhánh hiện có» → ⑧ «Review lại tài liệu đã tạo xem có gì thiếu hoặc sai với
toàn phiên».

---

## 1. Teardown huashu-design (lượt ①)

### Nó là cái gì

`alchaincyf/huashu-design` — skill "làm thiết kế bằng HTML", agent-agnostic, MIT. **189 file / 63 MB / 81 commit** (19-04 → 14-08-2026). SKILL.md **534 dòng ≈ 60 KB nạp thẳng mỗi lần kích hoạt**, cộng 33 file `references/` (~10k dòng) nạp theo bảng định tuyến. Có bảng «tín hiệu → lối vào» đặt ngay đầu file, 17 script thật (render video, xuất PPTX/PDF, lấy ảnh, hook), 6 nhạc nền + 37 hiệu ứng âm thanh.

Đây không phải một file hướng dẫn — nó là **một cỗ máy có nghi thức, có vật chứng, có răng**. Đáng đọc bằng thước của mình.

### Ba thứ đáng lấy

**1. «Chọn vô hiệu» — luật sắc nhất trong repo.** Cấm bày menu chữ cho người chọn khi người **chưa nhìn thấy vật**. Thay bằng: máy chạy 3 agent song song, mỗi agent một bản thiết kế THẬT (có ảnh chụp), rồi người chọn *một* lần trên thứ nhìn được. Đây chính là phát biểu tổng quát của điều owner tự nói 16/08 — «lần tường minh nhất duyệt với kit là khi có diagram». Máy đốt tính toán để hạ số lần gọi người xuống một, và cái được đem ra gọi là thứ người thật sự phán được.

**2. Cổng vật-hoá + hook có ngưỡng.** Ba checkpoint biến thành ba file bắt buộc trong thư mục dự án; luật là «file không có = khâu chưa làm», máy tự kiểm được, hook chặn được. Hook chỉ chặn **khi render ≥45 giây** — đúng chỗ làm lại đắt, dưới ngưỡng thì thả; có cửa thoát khai báo `SKIP_DESIGN_GATE=1`; và khi chặn thì **in ra lý do kèm ngày vấp thật**. Kèm một câu đáng chép nguyên văn: *«người nói tiếp» cho phép SANG bước sau, không cho phép BỎ cổng bên trong bước đó* — đúng lớp lỗi mình đã trả giá ở chip ②.

**3. Thang hạ cấp khai bất biến trước.** Runtime yếu → hạ song song thành tuần tự → hạ tiếp còn 1 bản chính + 2 biến thể nhẹ, nhưng khai rõ **cái gì tuyệt đối không được hạ**. Hạ chất lượng có trần, không phải hạ tuỳ hứng.

### Ba chỗ nó thủng theo thước của mình

- **Bộ đo sống ngoài repo.** `test-prompts.json` có 6 prompt + kỳ vọng viết bằng văn xuôi, **không file nào đọc nó**, không runner. Commit khoe «6 judge, 5 blind test, 82.3 → 85.4» nhưng người dùng không có cách nào làm nó đỏ. Lời hứa chất lượng không gắn vào vật được giao.
- **Luật ba-phương-án chép ≥4 lần trong cùng một file** (frontmatter, bảng định tuyến, §1, mục Fallback, Step 1, bảng ngoại lệ). Lặp để chống trôi trong hội thoại dài — nhưng đúng hình dạng «hai bản chép trong CÙNG một file» mình đã dẫm.
- **Răng đặt lệch chỗ.** Chỉ vật giao cuối là đo được thật (`verify-video.sh` kiểm fps / thời lượng / có audio stream / khung đen / độ ồn, exit 1). Còn nguyên tắc họ tự xưng là **ưu tiên cao nhất** — bắt buộc tra cứu xác minh sự thật trước khi làm, học từ vụ mất 2 giờ làm lại — thì **không có vật chứng nào cả**, chỉ là mệnh lệnh trong văn bản.

### Một mâu thuẫn nội tại, đáng học hơn cả phần đúng

Skill **cấm** cho người chọn bằng chữ ở mục Fallback — rồi 200 dòng sau, checkpoint 3 lại **bắt người gật đầu với một hệ màu/chữ mô tả bằng lời**. Cổng đó không có chiều đỏ nào cho người: câu trả lời hợp lý duy nhất là «ừ». Theo phép thử của mình, đó là trạm thu phí, không phải điểm quyết định. Một cỗ máy 60 KB, luật viết rất chặt, vẫn tự mọc trạm thu phí ngay cạnh luật cấm chính nó.

Đề nghị khi đó: nhét «chọn vô hiệu» + hình dạng cổng-vật-hoá vào hạt giống design-pass làm mục «vay từ ngoài» (docs-only, cùng nhánh).

---

## 2. PHÂN TÍCH — North Star × `/design` × huashu × vòng lặp (lượt ②)

Đã đọc lại trọn: hạt giống 19/08, `design-pass` 2.2.0, đoạn S1-D trong feature-loop, và nạp **toàn văn** skill `/design` bản đang chạy trong Claude Code (không chỉ mô tả ngoài).

### A. `/design` có nhiều hơn những gì hạt giống đang dùng — 5 phát hiện

1. **Kỷ luật phương án là luật NỘI TẠI của `/design`, trùng khít huashu.** Skill tự quy định: 2–4 hướng *thật sự khác nhau*, mỗi hướng phải nêu được **trục** của nó («Warm editorial» vs «Dense data-first» — "năm sắc thái của cùng một thẩm mỹ không phải lựa chọn"); mỗi phương án phải kèm **động cơ thật + đánh đổi chính** — nguyên văn: *bộ phương án mà chỉ ứng viên máy thích mới được biện hộ là một phiếu bầu gài sẵn*. Đó chính là lớp **mồi-dán-đồng-ý** của chip ②, phát biểu từ hướng ngược lại. Cộng thêm: **tên phương án ổn định vĩnh viễn** (đã là "Option B" thì không đánh số lại), và **quyết định đã chốt thì thôi, không hỏi lại**.
2. **«Độ nét của quyết định ≠ độ nét của vật giao»** — nguyên văn skill: phác low-fi là *đủ* để chọn hướng. Đề bài b1 đang đòi token/component thật + số CT5B thật cho canvas — hợp lệ cho b1 (DS có sẵn, màu sắc *là* nội dung quyết định), nhưng nâng thành luật kit thì phải là **"đủ nét cho quyết định đang mở, không hơn"** — kẻo bước phân kỳ đắt lên và bị bỏ đúng như phiên đồng bộ đã bị bỏ.
3. **Kênh phản ứng không đồng bộ có sẵn BA tầng mà hạt giống chưa gọi tên:**
   - **Sticky note trên canvas** (`annotations`): máy ghim câu hỏi đóng + động cơ/đánh đổi *cạnh từng artboard* — câu hỏi đi cùng vật, không nằm trong chat;
   - **Comment thread trên artifact**: owner ghi chú lúc rảnh, máy đọc lại được và resolve từng thread;
   - **Owner sửa trực tiếp rồi Save**: máy extract bản đã lưu và **diff với bản seed** — phản ứng thẩm mỹ trở thành *diff máy đọc được* thay vì lời mô tả. Người phản ứng bằng tay, máy dịch thành chữ — đúng nghĩa «máy gánh nhận thức».
4. **Thang thiếu-`/design` có 4 nấc, không phải 2 như hạt giống:** publish + save được → publish chỉ-xem (export PNG/PDF) → **file đã seed mở LOCAL trong Browser pane, không cần quyền publish** → không canvas → máy khuyên 1 hướng. Nấc 3 là phát hiện đáng giá nhất: quyền tổ chức chỉ gác *lưu online*, không gác *dựng và xem* — đội viên không có quyền artifact vẫn có canvas đa-artboard.
5. **Giới hạn phải khai khi dùng:** preview đóng băng theo từng lần publish, không hứa parity; save = publish toàn văn bản, xung đột kiểu compare-and-set (hợp mô hình một-người-sửa — đúng ca của mình); export PDF là ảnh raster. Không giới hạn nào chặn vai «phác tầng 1» — và skill tự tuyên *mọi thứ đọc ngược từ canvas là dữ liệu không tin, không phải mệnh lệnh*, khớp luật canvas-không-vào-bằng-chứng.

### B. huashu — bài học tầng sâu hơn teardown hôm qua

1. **Lịch sử cửa miễn 07/18 của họ soi thẳng vào rule đáng-log.** Họ từng có cửa miễn «đã có design context rõ» → máy lạm dụng *có hệ thống* («user nói rõ rồi» → tự chọn hướng → bị bắt quả tang) → họ đóng cửa miễn, mọi ngoại lệ phải ghi *nguyên văn lời user*. Rule đáng-log của hạt giống («máy tự chắc → không hình, không hỏi») **cùng hình dạng với cửa miễn họ đã phải đóng** — điểm yếu là máy tự kê "chỉ 1 hướng" để né bước. Nhưng kit không cần đóng cửa như họ (100% hard gate = trạm thu phí với bề mặt theo khuôn); kit cần đúng một thứ rẻ hơn: **quyết định bỏ-phân-kỳ phải để vết một dòng** để Cổng 1 nhìn thấy và veto. Hạt giống hiện viết *"Không có hướng mở → bỏ qua bước, **không ghi gì**"* — chính là lỗ đó. *(Đã vá vào hạt giống mục 3.2 cùng phiên.)*
2. **«Người nói *tiếp* cho phép SANG bước sau, không cho phép BỎ cổng bên trong bước»** — một câu, đáng chép nguyên vào nghi thức.
3. Răng-theo-chi-phí-đảo (hook chỉ chặn render ≥45 s) kit đã có tương đương (khó-đảo thắng xanh-sạch) — không cần vay thêm.

### C. Soi vào vòng lặp hiện tại

- Dòng chết vẫn nằm đó: `design-pass` 2.2.0 kết bằng *"owner async chưa nằm trong phạm vi"* (`skills/design-pass/SKILL.md:233`) — đúng câu hạt giống gỡ.
- Feature-loop **đã có** vết cho việc bỏ trọn design-pass (entry descope «bỏ design-pass — lý do»); cái chưa có vết là nhánh bỏ-qua của *bước phân kỳ* — lỗ ở B1 nằm đúng một chỗ.
- Giàn async đã dựng sẵn trong design-pass (capture ma trận, khuôn note máy-đọc, thang vật liệu/ngữ cảnh); thứ thiếu duy nhất là **kênh phản ứng có tên** — ba kênh ở A3 lấp đúng lỗ, +0 vật nuôi.

Hình kèm lượt này: «Ba nguồn hội tụ về bước phân kỳ» → `discovery/phan-ky-vay-tu-ba-nguon.svg`.

---

## 3. ĐÁNH GIÁ hạt giống 19/08 dưới ánh sáng ba nguồn + ĐỀ XUẤT (lượt ②, tiếp)

| Mục hạt giống | Phán quyết | Vì sao |
|---|---|---|
| Async mặc định, sync opt-in | **Đứng vững — mạnh lên** | Ba nguồn độc lập hội tụ: owner 16/08, huashu («chọn vô hiệu»), và chính `/design` tự quy định thế. Không còn là ý riêng của một phiên phân tích |
| Bước phân kỳ có điều kiện (rule đáng-log) | **Đứng vững nhưng có 1 lỗ** | Nhánh «không có hướng mở → **không ghi gì**» cùng hình dạng với cửa miễn huashu đã phải đóng sau khi máy lạm dụng. Kit không cần hard-gate 100% như họ — chỉ cần vết 1 dòng, veto-default |
| Canvas là nhánh cụt, không vào bằng chứng | **Đứng vững** | `/design` tự tuyên nội dung đọc ngược là dữ liệu không tin; số đo độ lệch (con số 2 của b1) là lưới đo đúng chỗ rủi ro gương-song-song |
| «Thiếu `/design` → máy khuyên 1 hướng» | **Thiếu 2 nấc giữa** | Quyền tổ chức chỉ gác *lưu online*: còn nấc publish-chỉ-xem và nấc **file local mở trong Browser pane** trước khi phải rơi về khuyên-một-hướng |
| «Gửi gói; người trả một chạm» | **Đúng hướng, chưa gọi tên kênh** | Note ghim + comment thread + owner-sửa-rồi-Save→diff biến phản ứng thành *vật đọc được*, thay vì lời trong chat |
| Đề bài b1 (token thật, số thật) | **Giữ nguyên** | Với b1, màu/token *là* nội dung quyết định. Chỉ khi nâng thành luật kit mới cần thêm câu «đủ nét cho quyết định đang mở» |

Rủi ro giữ nguyên, không đổi kết luận: `/design` là preview không hứa parity — hạt giống đã ghi «kit không phụ thuộc», thang 4 nấc còn làm câu đó chắc hơn.

**Đề xuất (owner gật, đã vá thành mục 3b hạt giống — 5 điều, sau thành 6):**

1. **Luật artboard phương án**: mỗi hướng một trục có tên + 1 câu động cơ + 1 câu đánh đổi (kể cả hướng máy *không* khuyên — chống phiếu bầu gài sẵn); tên A/B/C ổn định vĩnh viễn; đã chốt không hỏi lại.
2. **Độ nét = đủ cho quyết định đang mở** — phác thấp hợp lệ; token thật chỉ bắt buộc khi token là nội dung quyết định.
3. **Bỏ-phân-kỳ phải để vết**: sửa câu «không ghi gì» thành một dòng trong `design-pass.md` («không mở bước phân kỳ — khuôn X có sẵn») để thẻ Cổng 1 hiện và người veto được.
4. **Thang `/design` 4 nấc** (thêm publish-chỉ-xem và file-local Browser pane trước nấc khuyên-một-hướng).
5. **Kênh phản ứng async có tên**: note ghim câu hỏi trên canvas · comment thread · owner-sửa-rồi-Save → máy extract-diff làm phản ứng; kèm câu huashu «*tiếp* cho phép sang bước sau, không cho phép bỏ cổng bên trong bước».

Đề bài b1 không đổi — nó đã tương thích cả 5 điều, chỉ được hưởng thêm kênh phản ứng nếu tiện.

---

## 4. Hình trước–sau (lượt ③)

Vẽ bằng bộ khuôn `diagram-design` (swimlane Người / Máy / Vật, hai băng TRƯỚC–SAU) →
`docs/plans/assets/2026-08-19-hat-giong-design-pass/truoc-sau-design-pass.html`
(nguồn) + `.svg` + `.png` (dẫn xuất; xuất thêm vì app coi HTML là tài liệu tải
về, không mở in-app — PNG mở inline được). Commit `ba690a3c` trên nhánh hạt
giống, về main qua #85. Hạt giống mục 8 ghi nó là H4.

---

## 5. Ưu / nhược TRƯỚC–SAU + bốn nguyên tắc «ý định ↔ bàn giao» (lượt ④)

| | **TRƯỚC — phiên ngồi xem đồng bộ** | **SAU — async + phân kỳ canvas** |
|---|---|---|
| **Băng thông phản hồi** | ✅ Cao nhất: owner nhìn vật *đang chạy*, cảm được bấm/kéo, hiểu-nhầm chết ngay trong vòng | ❌ Ảnh tĩnh + canvas không truyền *cảm giác tương tác* — lệch tương tác có thể lọt tới tận sau Cổng 1; sync opt-in là bản vá, phụ thuộc owner biết lúc nào cần gọi |
| **Chi phí người** | ❌ 30–60′ liền mạch, lặp từng vòng — đắt đúng ở ràng buộc số 1 (tần suất gọi người); bằng chứng thực nghiệm: b1 **bỏ nghi thức** thay vì trả giá | ✅ Hai lần trả lời lúc rảnh, mỗi lần một chạm/một câu |
| **Thời điểm chốt hướng** | ❌ Hướng do máy quyết bằng chữ *trước* khi owner thấy gì; owner chỉ phản ứng sau khi đã dựng — sửa hướng lúc đó là đập đi làm lại | ✅ Phân kỳ **trước code**, trên 2–3 vật nhìn được — sửa hướng khi đảo còn gần như miễn phí |
| **Số phận của phản ứng** | ❌ Bằng lời, bay hơi — «gật» trong phiên không diff được, không truy lại được | ✅ Thành vật: note / comment / diff — máy đọc, tích luỹ qua các vòng |
| **Thời gian lịch** | ✅ Hội tụ trong một buổi | ❌ Mỗi vòng chờ owner rảnh — *giờ-người giảm nhưng làm-xong→quyết-được có thể dài ra*; đây chính là thứ con số 4 của ván b1 phải trả lời |
| **Vật trung gian** | ✅ Không có — sửa thẳng proto, drift = 0 | ❌ Canvas là bản chép: owner chọn trên thứ *không phải* sản phẩm — đã rào (nhánh cụt + số đo độ lệch) nhưng vẫn là chi phí cấu trúc |
| **Điểm mù còn lại** | Nghi thức tự đào thải khi đắt → mọi thứ nó bảo vệ mất theo | Máy tự kê «có/không hướng mở» — vết một dòng chỉ giúp veto *sau*, không ngăn máy tự tin nhầm *trước* |

Tóm một câu: TRƯỚC tối ưu **độ nét của một lần phản hồi**, SAU tối ưu **kinh tế của cả vòng đời quyết định** — và chấp nhận trả giá bằng cảm giác tương tác + thời gian lịch, hai thứ phải canh bằng số đo chứ không được coi là miễn phí.

### Điều gì thật sự giải bài toán ý-định ↔ bàn-giao

Không phải công cụ nào (canvas hay phiên đồng bộ đều chỉ là kênh). Bài toán này bị hiểu sai khi coi ý định là thứ **khai một lần rồi thi hành** — thực tế owner không biết trọn mình muốn gì cho đến khi thấy thứ mình *không* muốn. Nên lời giải là bốn nguyên tắc xếp theo thứ tự:

1. **Ý định chốt trên vật nhìn được, không chốt bằng chữ.** Chữ mô tả thẩm mỹ là kênh nhiễu nhất (ba nguồn độc lập cùng kết luận — huashu gọi thẳng là «chọn vô hiệu»). Thang độ nhiễu: chữ → ảnh/canvas → vật bấm được; chọn nấc *rẻ nhất đủ cho quyết định đang mở*.
2. **Đưa khoảnh khắc chốt về điểm sửa còn rẻ.** Lệch ý định phát hiện ở phân kỳ = sửa một artboard; ở Cổng 1 = vá proto; ở bàn giao = làm lại cả vòng. Toàn bộ giá trị của bước phân kỳ nằm ở việc dời điểm phát hiện lệch lên sớm — kinh tế của *thứ tự*, không phải của công cụ.
3. **Khoảng cách vật-duyệt ↔ vật-giao phải được KHAI và ĐO, không được hứa bằng 0.** Đây là chỗ đa số quy trình design chết: duyệt trên mockup rồi *giả định* bàn giao giống hệt. Kit xử bằng ba tầng: thang vật liệu khai báo (duyệt trên component thật / khung / tĩnh — người duyệt biết mình đang tin đến đâu), số đo độ lệch canvas↔ruột tạm, và S4 đo trên DOM thật của chính vật giao. Cách thu hẹp khoảng cách bền nhất là **cấu trúc**: ruột tạm dựng bằng đúng component S3 sẽ dùng — vật duyệt *là* một phần vật giao, không phải bản vẽ của nó.
4. **Phản ứng của người phải thành vật tích luỹ.** Ý định lộ dần qua chuỗi phản ứng; nếu mỗi phản ứng bay hơi thì mỗi vòng lại phát lại từ đầu. Note/comment/diff biến chuỗi đó thành sổ — máy gánh phần nhớ, người chỉ phán phần mới.

Phần chưa giải trọn — nói thẳng: **cảm giác tương tác** vẫn chỉ có kênh đồng bộ truyền được (vì thế sync còn opt-in chứ không bị xoá), và ý-định-của-owner ≠ giá-trị-với-người-dùng-cuối — lưới cuối cho khoảng đó là Cổng Giá trị/UAT trên sản phẩm thật, nằm ngoài phạm vi hạt giống này.

*(Bốn nguyên tắc này sau được chép thành mục 2b của hạt giống ở lượt ⑧.)*

---

## 6. Chìa khoá: lấy ưu điểm cả hai — thang phản ứng 4 nấc (lượt ⑤)

Bảng ưu/nhược lượt trước lộ ra một điều: cái quý của phương pháp cũ không phải là *sự đồng bộ* — mà là **vật bấm được**. Phiên ngồi xem trộn hai thứ: (a) owner phản ứng trên vật thật đang chạy, và (b) owner phải *hẹn giờ ngồi cạnh máy*. Chỉ (b) đắt; (a) thì không — proto vẫn chạy đó dù owner mở lúc 9 giờ tối. Tách được hai thứ này ra thì lấy được gần trọn ưu điểm của cả hai bên.

Cách hợp nhất đúng North Star không phải là chọn một mặc định toàn cục, mà là **một thang phản ứng — kênh đắt chỉ mở khi quyết định đang mở cần đúng băng thông đó**, máy khuyên nấc kèm căn cứ, người veto một chạm. Kit đã có tiền lệ khuôn này (bậc thang ĐỌC/CHỌN/CẢNH BÁO/CẠN của cổng, thang vật liệu, thang ngữ cảnh — đều là «khai báo, không ép»):

| Nấc | Kênh | Khi nào (loại quyết định mở) | Lấy ưu điểm của |
|---|---|---|---|
| **0 — đi thẳng** | không hỏi, để vết một dòng | Bề mặt theo khuôn có sẵn, 0 hướng mở | SAU: máy đi trước, veto-default |
| **1 — async trên ảnh/canvas** | phân kỳ 2–3 hướng, chọn một chạm | Quyết định là *hướng/bố cục/tĩnh* — nhìn là đủ phán | SAU: chốt sớm, rẻ, thành vật |
| **2 — async trên vật bấm được** | gói kèm **link proto đang chạy**, owner tự bấm lúc rảnh, trả bằng note/comment/diff | Quyết định cần *thấy state chuyển* (flow nhiều bước, chuyển trạng thái) nhưng không cần đối thoại | **TRƯỚC: cảm giác bấm thật** — mà không tốn lịch hẹn |
| **3 — sync ngắn, opt-in có tên** | phiên có *chủ đề khai trước*, không phải 30–60′ trọn gói | Tương tác tinh (kéo-thả, chạm, nhịp chuyển động) hoặc **tín hiệu leo thang**: 2 vòng async không hội tụ trên cùng một điểm | TRƯỚC: băng thông đối thoại — nhưng chỉ trả tiền cho đúng đoạn cần |

Ba luật giữ cho thang không phản chủ:

1. **Máy khuyên nấc, không bày menu.** Mỗi lần mời phản ứng, máy đã chọn nấc + một dòng căn cứ («flow 4 bước, mời anh bấm thử lúc rảnh — không cần hẹn»); người chỉ veto. Không bao giờ hỏi «anh muốn sync hay async?» — đó là bắt người quyết hộ máy.
2. **Leo thang theo tín hiệu, không theo cảm giác.** Cùng một điểm bị chê 2 vòng async liên tiếp = kênh hiện tại không đủ băng thông → máy *mời* sync ngắn giới hạn đúng điểm đó. Đây là luật dừng-vá áp cho kênh: lặp là dấu hiệu đổi kênh, không phải cố thêm vòng.
3. **Nấc nào cũng để vết** (`reaction:` ghi nấc + kênh trong sổ phiên, thẻ Cổng 1 hiện) — người duyệt biết mình đang tin phản ứng thu qua kênh nào, và veto được cả cách chọn kênh.

Soi lại North Star: số chấm người **không tăng** (vẫn hai chấm: chọn hướng · Cổng 1 — nấc 2/3 chỉ là *hình thức* của chấm, không phải chấm mới); ý định vẫn chốt trước code ở mọi nấc; chuỗi bằng chứng không đổi (canvas/ảnh/cảm giác bấm đều không vào evidence — S4 vẫn đo DOM thật). Trường hợp thiếu đồ nghề cũng phủ: không có `/design` → nấc 1 bằng ảnh tĩnh; owner không mở được proto local → máy quay screencast flow thay nấc 2; đội viên không quyền artifact → canvas file-local.

Owner «Đồng ý» → vá thành **điều 6** mục 3b hạt giống (commit `16f2e7f9`).

---

## 7. Kiểm canvas b1 + phát hiện ván thử b1 đã DỪNG (lượt ⑥)

### 7.1 Canvas «Phiếu khuyên b1 — cổng phân kỳ» so với hạt giống

| Luật hạt giống | Kết quả trên canvas | |
|---|---|---|
| ≤8 artboard, ≤2 trang | 6 artboard / 2 trang (A·B·C phiếu khuyên · Đèn-1·Đèn-2 · Chạm vị trí) | ✅ |
| Điều 1 — trục có tên + động cơ + đánh đổi **mỗi** hướng, kể cả hướng không khuyên | Cả 5 artboard phương án đều có dòng «Động cơ — … / Đánh đổi — …» viết thẳng trên mặt; tên A/B/C ổn định | ✅ |
| Điều 2 — độ nét đủ, không hex mới, số thật | Màu là đúng giá trị token đã chốt (`#0A70D6` primary · `#0854A3` blue-850 của preset 05/08 · ink-900/700/50); chữ Manrope/Inter đúng import của bộ token OneHub; số CT5B thật (9,658 / 10,162 / 10,873 tỷ); không lorem. Giá trị được viết cứng thay vì gọi biến — chấp nhận được cho phác tầng 1 | ✅ |
| Điều 5 — câu hỏi đóng ghim trên vật | Có 2 note ghim («chọn MỘT hướng A/B/C…», «đèn ba màu: hai cách…») | ✅ |
| **Khuyến nghị kèm căn cứ** (đề bài b1 + luật «hỏi mở là đường cùng») | Note chỉ hỏi «chọn A/B/C», **không có ngả máy khuyên** — owner mở link lúc rảnh sẽ thấy menu, không thấy lời khuyên | ⚠️ lỗ nhỏ |
| Chạm vị trí bấm được | Có logic trạng thái thật, ảnh mặt bằng thật | ✅ |
| Canvas không vào bằng chứng | `design-pass.md` chỉ giữ link ở frontmatter (`canvas:`), evidence/ toàn ảnh chụp bảng thật | ✅ |
| Phản ứng của owner qua comment | **0 thread** | — |

`design-pass.md` của b1 đúng khuôn mới: `reaction: async`, `material: real-components`, `context: static-frame` + 2 cảnh ngữ-cảnh, 30 ảnh ma trận 14 state × 2 khổ, 3 vá tại chỗ / 2 chờ Cổng 1, và bảng «Đo cho hạt giống kit» đã điền dở.

### 7.2 Phát hiện lớn: ván thử b1 đã DỪNG ngày 19/08

Sổ quyết định b1, entry cuối (07:51Z, `type: descope`, stage gate1): **owner bỏ nhánh b1 và bỏ luôn plugin Trang tư vấn**, giữ phần dữ liệu nền làm dữ liệu của shell. Lý do ghi: code không bám kiến trúc plugin qua nhiều vòng sửa · ba bề mặt cùng một căn nhấn ba phương án khác nhau · khung xem trước hỏng trên điện thoại. Cổng 1 không mở; M1 trên b1 dừng.

Hai điều đáng ghi từ cách nó dừng:

- **Quyết định thật được đưa ra trên một vật nhìn được khác** — bản audit «Bảy bề mặt của Trang tư vấn» (ảnh chụp *sản phẩm đang chạy*, 7 bề mặt × 2 khổ máy), không phải trên canvas phân kỳ. Canvas hỏi «phiếu khuyên đứng đâu: A/B/C»; ảnh bề mặt thật cho owner thấy câu hỏi sống thật là «plugin này còn đáng tồn tại không». Đây là bằng chứng sống cho hai nguyên tắc lượt trước: ý định lộ ra khi thấy *thứ mình không muốn*, và **vật thật thắng bản chép** — nấc 2 của thang làm điều nấc 1 không làm được.
- Chấm «chọn hướng» **chưa bao giờ được trả lời** — owner đi thẳng lên quyết định tầng cao hơn. Vì thế số đo 1 của hạt giống (số lần gọi + phút owner cho chấm chọn hướng) vẫn trống.

Bốn con số thu được tới lúc dừng: **(3)** không cần phiên đồng bộ — tương tác duy nhất cần cảm nhận đã bấm được trên cả canvas lẫn bảng thật; **(4)** máy mất **17 phút** từ lúc mở bước phân kỳ đến khi có ruột tạm bằng component thật + 30 ảnh; **(2)** độ lệch canvas↔ruột tạm có thật nhưng nhỏ (thứ tự ba ô so sánh khác; ảnh thẻ giữ chỗ) — đúng rủi ro gương đã dự báo; **(1)** chưa có.

### 7.3 Hệ quả cho hạt giống

Bản hạt giống — kể cả hai bản vá hôm nay — vẫn viết «chờ ván thử b1 xong», «phiên r4 đang đứng ở Cổng 1», «trọng tài là bốn con số của b1». Ba chỗ đó đã **stale từ 19/08**. Cần ghi thẳng: b1 dừng ở đâu, lấy được số nào, và **điều kiện mở lại** = feature chạm UI kế tiếp ở bất kỳ repo tiêu thụ nào chạy lại dưới dạng lệch có tên, lần này đo trọn chấm chọn hướng. Cộng hai bài học trên: khuyến nghị máy phải nằm *trên* canvas, và bước phân kỳ nên mở bằng ảnh bề mặt thật hiện có trước khi bày hướng mới.

---

## 8. Khảo sát hiện trạng kit 2.3.0 → mở ô cơ hội → rà soát (lượt ⑦–⑧)

### 8.1 Engine — `main` e613224e = 2.3.0

| | |
|---|---|
| Số | acceptance-gate **2.3.0** · feature-loop **2.3.0** · diagram-design 2.5.0 |
| Lớp thiết kế | `skills/design-pass/SKILL.md` **không đổi một byte** từ 2.2.0 → mọi giả định của hạt giống còn nguyên, kể cả dòng cuối «owner async chưa nằm trong phạm vi» |
| 2.3.0 đổi gì chạm tới tài liệu | ① `/start` có nhóm **«đang cân nhắc»** và luật **mọi buổi khai thác kết thúc bằng một ô `opportunity.md`** · ② contract có ô **«Đường đo»** khi hồ sơ có ngưỡng, gap-probe đọc `opportunity.md` làm input 6 · ③ `acceptance-init` khai bộ plugin ở cấp repo · ④ hồ sơ làn V sạch = «đã giao, cửa veto mở» · ⑤ tool-kill ≠ fail |

**Đường đi từ cơ hội, đúng 2.3.0, cho chính kit:** `/start` → lối (a) buổi khai thác → `_acceptance/<slug>/opportunity.md` (stage `discovery`, `decision` trống, ngưỡng `…`) → **người điền ngưỡng** → chờ Cổng Đáng → **người ký ngay trong file** (`decision: build` + `decided_by/at` — không có lệnh riêng) → `/feature-loop <slug>` (S0 đọc hồ sơ cơ hội làm input số 1; S1 contract có «Đường đo») → S4 → Cổng Bằng chứng → S5 bàn giao Vòng TRAO → lái-thử người-lạ → `uat-session` Cổng Giá trị (chép nguyên văn ngưỡng, cấm sửa sau khi thấy số).

### 8.2 Xưởng kit lúc đó (22/08 sáng)

- Chờ chữ ký: 1 — Cổng Giá trị của `duong-do-trong-dinh-nghia-xong`, **treo** (hồ sơ kit tự-dùng, không có người dùng cuối). Đây chính là cái bẫy mà cơ hội design-pass sẽ bước vào nếu ngưỡng không đo được ở đâu — may là ngưỡng của nó vốn là các con số trên ván thử ở repo tiêu thụ, nên có chặng bàn giao thật.
- Đang dở: 0 · Đang cân nhắc: 6 (ô mở 21/08) · Xong: 56.
- Lệch nhỏ giữa hai bộ đọc: bản đồ in «Đang làm 2 việc» (release-2-0-0 / 2-1-0) trong khi bộ quét xếp «máy đi tiếp, không ký» → ứng viên chip D.
- Hai hạt giống 22/08 («giới-hạn-đã-khai ≠ bất định» · «vòng kit tự-dùng không có chặng bàn giao») chưa có ô.

### 8.3 Repo tiêu thụ artifact-platform

Trang tư vấn đã **retire** trên main (PR #362, 19/08), deal-page retire sau (#368/#370, 20/08); thư mục `consult-page` còn vì retire ≠ remove. Kit trên repo: ba plugin khai trong `settings.json`, không ghim số; `design_pass.proto_route` vẫn trỏ `/proto/{slug}` (route chết — lỗ đã ghi), `ds_skill: onehub-design-system`. **Ván thử kế cần một feature chạm UI mới ở một repo tiêu thụ — chưa có ứng viên.**

### 8.4 Mở ô (owner «Đồng ý, mở ô cơ hội trên nhánh hiện có»)

Ô `_acceptance/design-pass-nac-khong-dong-bo/opportunity.md` mở ở trạng thái đang cân nhắc: vấn đề & ai gặp · 5 giả định sinh tử (hai giả định mới rút từ cách b1 dừng) · kết quả ván thử b1 tới lúc dừng · nguồn ngoài phân loại triết-lý / hình-thái · 5 thước ứng viên cho «Đường đo» · out of scope. Hạt giống thành phụ lục (4.3 + mục 5 mới). Bản đồ vẽ lại (6 → 7 ý). Commit `73ea8633`, PR #85.

### 8.5 Rà soát (owner: «review lại tài liệu đã tạo…») — 3 sai/stale + 3 thiếu, đã sửa (commit `bd3571e3`)

| Chỗ | Vấn đề | Sửa |
|---|---|---|
| Hạt giống §0 | Vẫn viết «ván thử chạy trên b1… lấy b1 làm bằng chứng» — b1 đã chết | Trỏ về «ván thử ở repo tiêu thụ», b1 là ván đầu đã dừng (4.3), ván kế ở mục 5 |
| Hạt giống §3.1 | Khoá ghi vết `reaction: async\|sync` — mâu thuẫn với điều 6 (thang 4 nấc: vết phải ghi **nấc + kênh**) | Ghi nấc + kênh, ví dụ cụ thể; `async\|sync` trần là bản 19/08, đọc-cũ hợp lệ |
| Ô cơ hội | Giả định sinh tử bỏ sót cái bẫy: ô này là **vòng kit tự-dùng**, Cổng Giá trị sẽ treo y như `duong-do` nếu không có ván thử kế trong timebox | Giả định 6 + dòng «Phiên nghiệm thu ở đâu» trong Cổng 0 |

Thiếu — đã bổ sung: bốn nguyên tắc «ý định ↔ bàn giao» → §2b hạt giống; out of scope của ô thêm «không đổi lưới / phép đo / workflow»; hai phát hiện ngoài ô (bản đồ vs `/start` hai chữ; hai hạt giống 22/08 chưa có ô) → ứng viên chip D trong sổ nhớ.

Đã kiểm, đúng, không đổi: mục 3.2 đã hết nhánh «không ghi gì»; các con số b1 khớp `design-pass.md` và sổ quyết định của b1; màu/chữ canvas đúng token; đường đi 2.3.0 khớp. Để trống có chủ đích: **ngưỡng** — quyết định của owner (điền ở PR #88 cùng ngày).

---

## 9. Điều còn mở sau khi gom (để đợt khám thêm trả lời)

Không thêm ý mới — chỉ gom những câu phiên này để lại mà chưa ai trả lời:

1. Giả định 3–5 của ô (máy không né bước phân kỳ · hỏi đúng tầng · `/design` preview đủ ổn) chỉ thử được bằng ván thử kế — **chưa có ứng viên feature chạm UI** ở repo tiêu thụ (8.3); hạn 30/09 sẽ tự kéo về xếp kho.
2. Lỗ luật «vòng kit tự-dùng không có chặng bàn giao» (8.2) chưa có ô — ô này khai ván thử kế làm phiên nghiệm thu để tránh lỗ, nhưng lỗ vẫn còn cho hồ sơ khác.
3. Hai bài học b1 (vật thật thắng bản chép · khuyến nghị phải nằm trên canvas) đã vào giả định 4 và hạt giống 4.3, **chưa** vào lời nghi thức (mục 3 hạt giống) — là việc của S1 nếu ký `build`.
