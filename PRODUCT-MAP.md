# Bản đồ sản phẩm

> Bản đồ vẽ lại từ hồ sơ của xưởng mỗi lần một người ký một cổng — đừng sửa tay.
> (đọc từ thư mục `_acceptance/` và `.out-of-scope/`)

```mermaid
flowchart TD
  A["Đang cân nhắc cơ hội<br/>24 việc"] --> GD{"Cổng Đáng"}
  GD --> B["Sắp mở vòng<br/>1 việc"]
  GD --> XL["Xếp lại sau<br/>2 việc"]
  GD --> DB["Đã bác từ khám phá<br/>3 việc"]
  B --> CD["Chờ duyệt phạm vi<br/>chưa có"] --> GP{"Cổng Phạm vi"}
  GP --> DL["Đang làm<br/>2 việc"] --> GB{"Cổng Bằng chứng"}
  GB --> DG["Đã giao<br/>49 việc"]
  GB --> CN["Chờ phiên nghiệm thu<br/>10 việc"] --> GG{"Cổng Giá trị"}
  GG --> NT["Đã nghiệm thu giá trị<br/>chưa có"]
```

> **Bốn cổng người** — mỗi cổng là một câu hỏi chỉ người trả lời được:
> **Cổng Đáng** việc này có đáng làm không · **Cổng Phạm vi** bộ tiêu chí
> đã đủ và đúng chưa · **Cổng Bằng chứng** đã làm đúng thứ đã hứa chưa ·
> **Cổng Giá trị** thứ đã giao có ăn thua không.

## Đang cân nhắc cơ hội

- Ba chỗ tích luỹ không có đường ra — khoá config · dòng file kiểm · con số suite (`ba-cho-tich-luy-khong-duong-ra`)
- Bất biến sản phẩm — PRODUCT-INVARIANTS.md ở gốc repo tiêu thụ, luật sản phẩm nạp lúc viết đặc tả, thứ khó-đảo tự nổi lên thẻ như mục người (`bat-bien-san-pham`)
- Bậc 3 của lái-thử cho bề mặt AGENT — bản tham chiếu `vlm-assert` chỉ phục vụ frame UI, ván agent không có con mắt thứ hai (`con-mat-thu-hai-lai-thu`)
- Chốt chặn trước-merge chấm MỌI hồ sơ đã arm cổng, kể cả hồ sơ PR không chạm — một vòng dở làm kẹt mọi PR khác của kho (`cong-chan-theo-ho-so-khong-theo-diff`)
- Danh sách chép CI của acceptance-init dặn repo tiêu thụ chạy product-map --check nhưng không chép product-map lẫn đồ nó kéo theo — CI của consumer đỏ ngay khi kit dùng khuôn ô cơ hội (`danh-sach-chep-ci-thieu-product-map`)
- Thẻ Cổng 2 in nút bằng tiếng Việt nhưng chỉ đọc được từ khoá tiếng Anh trong «Đề xuất:» — người viết đúng chữ trên nút thì thẻ báo không đọc được (`de-xuat-tieng-viet-khong-doc-duoc`)
- Dọn tồn kho PR — danh sách PR mở phải nói đúng việc đang chạy, không phải kho hàng cũ (`don-ton-kho-pr`)
- Bộ đọc frontmatter cắt phần sau « (`frontmatter-thang-mot-ky-hieu`)
- Nghi thức hình áp cho MỌI cổng dừng-chờ-người — không riêng Cổng Phạm vi; mở nguồn kê sang vật của vòng nghiệm thu và điểm dừng-vá (`hinh-o-moi-cong-dung-cho-nguoi`)
- Hỏi-theo-mặt-phẳng — câu hỏi là thứ người bấm được, không phải khuôn chữ (`hoi-theo-mat-phang`)
- Mọi liệt kê trong hợp đồng phải máy-đọc (`liet-ke-may-doc`)
- Luật lái máy đổi thì phải được kiểm hồi quy như code — harness-lite chạy evals/ khi cấu hình đổi, hook cấm nới thước lúc chữa mã, vật-hoá thứ tự ghi run-log, ADR làn V và tách nhiệm vụ (`luat-lai-may-duoc-hoi-quy`)
- Ngày «việc vừa xong» lấy sai nấc cho hồ sơ đã qua phiên nghiệm thu — vòng đóng hôm nay bị đóng dấu bảy tháng tuổi và rơi khỏi thẻ (`ngay-viec-vua-xong-lay-sai-nac`)
- Ba hồ sơ đã ký còn nợ khoá `executors.script.mirror_sync` đã gỡ — nợ cuối cùng của corpus sau ADR 0014/0015, chờ một lối ra có tên (`no-mirror-sync-ba-ho-so`)
- Ô nuốt luật — đổi hai ô hỏi-khẩu-vị thành ô hỏi-phép-đối-chiếu (`o-nuot-luat`)
- Phép kiểm xanh-sạch đo theo vùng có cấu trúc, không quét trọn file (`phep-kiem-sach-do-theo-vung`)
- T1 tuyên-kèm-căn-cứ — máy tuyên T1 với bảng căn cứ, không dừng hỏi (`t1-tuyen-kem-can-cu`)
- Thẻ Cổng 2 không có làn nào cho lỗi TRONG hợp đồng chưa sửa — nó im lặng, và thẻ vẫn ghi "Bằng chứng đầy đủ" (`the-cong-2-giau-loi-trong-hop-dong`)
- Thẻ Cổng Phạm vi phải nói đúng «hệ thống sẽ làm gì» — hôm nay nó xếp tiêu chí bằng cách dò chữ «không» trong vế Then, nên hồ sơ càng viết đúng luật khai-chiều-đỏ càng bị đọc thành «hệ thống không làm gì» (`the-xep-nham-o-se-lam`)
- Thước sống theo đời model — bằng chứng ghi model sinh ra nó, cờ «cũ theo model», cờ nhạt có việc kế, hình dạng lỗi đo-lường thứ 7 «thước bị nới sau khi đã đỏ» (`thuoc-song-theo-doi-model`)
- Việc kế theo plan và hạt giống — kit đọc ý định của repo, không giữ, không sửa (`viec-ke-theo-plan`)
- Dòng bậc-3 của lái-thử khai `vlm-assert` là "đã ship" trong khi nó là bản tham chiếu phải nhận nuôi (`vlm-assert-khai-nhan-nuoi`)
- Luật xanh-sạch đọc mục «Ngoài hợp đồng» của BÁO CÁO, không đọc làn phản biện — hồ sơ có 13 phát hiện vẫn qua như sạch (`xanh-sach-doc-nham-mat`)
- Ý định có nhà riêng — cửa vào và cửa ra không cần người ngồi phiên; tách viết ý định khỏi ký; Cổng Đáng có lệnh ký; ngưỡng UAT thành băng sau phát hành; ba số cho nguyên tố 1 (`y-dinh-co-nha-rieng`)

## Sắp mở vòng

- Một vòng = một KẾT QUẢ người thấy được — S1 cắt vòng theo kết quả, AC ở tầng kết quả, cơ chế canh bằng bản phá (`vong-la-mot-ket-qua`)

## Đang làm

- Cờ qua-timebox cắt ngang cả nhóm «đã xong» — bộ quét gắn cờ cho hồ sơ park/bác, archived và đã có phán quyết giá trị (`co-qua-timebox-nhom-da-xong`)
- Phát hành kit 2.0.0 — gom 1c + đợt 2 «người về biên» về một mốc release để repo tiêu thụ nhận engine mới có chủ đích trước đợt 3 (`release-2-0-0`)

## Đã giao — chờ phiên nghiệm thu

- Cổng Đáng có cửa — thẻ cổng thứ ba + ký một lượt bằng lệnh duyệt sẵn có (`cong-dang-co-cua`)
- Bản đặc tả UX — vật hoá tầng cấu trúc (khuôn có marker trong design-doc + lời S1 điền-trước + bước tra mẫu có vết) (`dac-ta-ux-vat-hoa-cau-truc`)
- design-pass nấc không đồng bộ — thang 4 nấc phản ứng (mặc định async, sync có người gọi tên) + bước phân kỳ có điều kiện mở từ đặc tả UX + khoá reaction/options/divergence trong sổ phiên + thẻ Cổng Phạm vi hiện nấc (`design-pass-nac-khong-dong-bo`)
- làn máy sống qua bộ phân loại — lệnh kiểm cố định của kho thôi phải xin phép từng lần (A) + nghi thức biết đường thoái hoá tuần tự khi fan-out nghẽn (B) (`lan-may-song-qua-bo-phan-loai`)
- Lệnh in ra phải bấm được — một nguồn tên lệnh (bảng COMMAND-NAMES, bảng ⊆ vật thật, điểm bàn giao ⊆ bảng) + TRỪ ba cờ nhiễu trên thẻ + bốn sửa đúng từ finding B/C (`lenh-in-ra-phai-bam-duoc`)
- Lời mời cổng thành vật máy sinh — thẻ in câu gộp khuyến nghị bấm được, khối VIỆC-CỦA-ANH chỉ chứa điều-chỉ-người-biết, vá các đường fail-quiet của thẻ (`loi-moi-cong-may-sinh`)
- Nhánh chính không tên main — phép dò phải dò được, không chết ở tên đầu (`nhanh-chinh-khong-ten-main`)
- Ra có tên ở Vòng LÀM và TRAO — trạng thái «máy đã thông» cho làn V; Cổng Đáng ký qua /approve một lượt một PR; Cổng Giá trị có lối «không đo được» + archived/timebox có bộ đọc (`ra-co-ten-lam-va-trao`)
- «/start» là bảng điều khiển của owner, không phải bộ định tuyến — hiện hết ý đang cân nhắc, nêu tên việc máy vừa làm và thứ còn veto được, và mọi bộ đọc nói cùng một chữ (`start-bang-dieu-khien`)
- Vũ trang /goal ở mọi lượt người đứng ngay trước đoạn máy — dòng /goal thành vật thẻ Cổng Phạm vi in ra (một nguồn, ba bản chép), điểm in = mỗi câu xin duyệt thiết kế của brainstorm · Cổng 1 · Gate 1.5 (`vu-trang-goal-luc-goi-ten`)

## Đã giao

- Đưa bài học đo lường của tuần 08–14/08 vào engine — bốn lớp lỗi mới có ca đại diện, nguyên tắc lật-allow-list, và một bánh cóc hai chiều buộc bảng lớp lỗi trace về sổ nguồn (`bai-hoc-do-luong-vao-engine`)
- Thẻ quyết định in đúng thứ hồ sơ viết — đường dẫn có dấu sao không còn bị cụt khi lột định dạng, và mọi hình dạng dấu sao khác đều có kỳ vọng đã khai trước thay vì tuỳ hệ quả (`card-text-fidelity`)
- Kit thôi đo phút người ở mọi cổng — gỡ cả lớp HỎI lẫn lớp KHẲNG ĐỊNH về phút, giữ đường đọc-cũ cho hồ sơ đã ký và giữ nguyên mọi răng bằng chứng (`cat-hinh-thuc`)
- Cắt khối 👉 VIỆC CỦA ANH khỏi TIN mời cổng — thay khuôn N-mục-3-vế bằng một câu «mời cổng như đồng nghiệp hỏi»; thẻ HTML giữ nguyên; chỉ TRỪ (`cat-khoi-viec-cua-anh-tren-tin`)
- Gói Codex mang đủ mọi công cụ mà chỉ dẫn của nó bảo người dùng chạy — hết con trỏ chết, và có chốt máy canh quan hệ đó cho mọi lần thêm công cụ về sau (`codex-script-packaging`)
- Ba lượt đổi hành vi ở cổng người — khối 👉 thôi làm luật mỗi-tin, quét độ phủ thôi phỏng vấn, khởi tạo một-lần-gạch; lời hứa hành vi chấm bằng hội đồng bắt buộc (hạng mục T1 đã thu phạm vi 14/08) (`doi-hanh-vi-cong-nguoi`)
- Đường đo nằm trong định-nghĩa-xong — contract có ô «Đường đo» khi hồ sơ có ngưỡng; thẻ Cổng Phạm vi cờ vàng khi thiếu, cửa bỏ có tên; gap-probe cross-check ngưỡng↔đường đo (`duong-do-trong-dinh-nghia-xong`) — đã giao — không đo, khai ở Cổng Đáng
- Đường lùi phải sống — làn máy-đi-trước có đường lùi thật ở hai cửa: người veto bằng một chữ và ô kết máy-đã-thông có đường ghi; máy không coi «không đo được» là sạch, làn V vẫn bị kiểm hoá cũ, lệnh ký chạy làn máy trước chữ ký (`duong-lui-phai-song`) — đã giao — không đo, khai ở Cổng Đáng
- Eval máy khai mã thoát mong đợi (expected_exit) — một giới hạn đã khai không còn bị năm bộ đọc coi là thất bại (`eval-khai-ma-thoat-mong-doi`)
- Pre-merge enforce gap-probe presence (merge-boundary, thay cho hook write-time) (`gap-probe-presence-hook`)
- Bộ khớp glob của cổng hiểu `**/` là không-hoặc-nhiều thư mục — `**/*.md` bắt cả markdown ở gốc kho (`glob-hai-sao-khop-goc-kho`)
- sổ vàng in cho người được máy đo thật đầu-ra (render round-trip, ma trận đồng thuận toàn phần) + từ điển biệt ngữ lời ký để lớp giám khảo ngôn-ngữ có đường PASS sạch (`gold-output-measure`)
- Gom đúc kết 08/09 thành một vòng T3 trước mốc 2.10.0 — nợ C1 (7 Known limits của lop-bang-chung-nhin-thay), K1 null-guard workflow, K2 danh tính hết trạm thu phí, K3 W6/W8 thu phạm vi, K5 S5 mặc định PR, K8 làn conventions chỉ chấm file đổi (`gom-duc-ket-2-10-0`)
- Hình tại Cổng 1 — máy tự kê điểm quyết định, đếm ngưỡng N5, giao vẽ, nhìn, đính cùng thẻ; người không phải gõ thêm lượt để có hình (`hinh-tai-cong-1`)
- inputs của hội đồng tính từ gốc kho — một gốc cho mọi đường dẫn trong evals, vắng thì kêu to (`inputs-tinh-tu-goc-kho`)
- verdict judgment không-PASS phải kèm danh sách bằng-chứng-thiếu (required_evidence) chảy từ judge → memo → report → thẻ → round fix; gộp gold-seed O4: acceptance-gold.mjs dẫn xuất gold set + báo cáo G3 từ corpus sẵn có, không file mới (`judge-required-evidence`)
- Khối "👉 VIỆC CỦA ANH" — thành phần cứng máy-sinh của khuôn trình-người (thẻ cổng + lời-mời-cổng) (`khoi-viec-cua-anh`)
- Máy quét vào phiên hỏi đúng câu lưới trước-merge hỏi — hồ sơ không còn cần người thì thôi hiện «chờ ký», hồ sơ chưa sạch thì luôn còn ở cổng (`lan-v-khong-phai-cho-ky`)
- Ba tài liệu đầu-tay (QUICKSTART · README · GUIDE) vào vũ trụ quét lệnh — 52 token trần đổi sang dạng bấm được, cùng bảng COMMAND-NAMES và cùng ca LB2 (`lenh-tran-tai-lieu-dau-tay`)
- Lớp bằng chứng nhìn-thấy — hợp đồng có mặt người nhìn phải có ≥1 eval ui-check (`layer: ui-observed`); răng W8 ba tầng (lint · thẻ · pre-merge NOTE), một nguồn cho surfaces, đường bỏ có tên (`lop-bang-chung-nhin-thay`)
- Lưu kho harness Codex và khai tử nghi lễ design-loop — chỉ TRỪ, có mốc git để đảo và 2 ADR (`luu-kho-codex-va-nghi-le-design`)
- lớp lỗi đo-lường thành luật ở 2 điểm cắm: gap-probe S1 (7 câu đối chiếu chéo) + review lens measurement S4 (6 hình dạng, một chỗ, mutation-covered); không nới finder cũ (`matrix-measure-law`)
- Khuôn khai sinh phép đo — mọi phép đo mới phải tự chứng minh biết báo đỏ (đối chứng dương xanh + phá-vật-thật đổi kết luận + thông điệp ghim) ngay lúc viết, trước khi được tính là xong (`measure-birth-certificate`)
- Trả răng cho năm phép đo đã bị ghi là mất răng — chúng phải phân biệt được bản đúng với bản hỏng, và có một chốt canh để lần sau không lặp lại (`measure-teeth-cleanup`)
- Sổ luật-đã-chạy — `clean` phải được chứng minh, không phải mặc định (`premerge-rules-ledger`)
- Chặn PASS chưa ai phán ở biên merge (chữ ký giữ-chỗ + slug tự khai phát hành không được tàng hình) (`premerge-unjudged-pass`)
- Phát hành kit 2.10.0 — đóng số cho cửa sổ 2.9→2.10 (PR 157 glob-hai-sao · 159 duong-lui-phai-song · 163 vòng T3 gom đúc kết 08/09), để repo tiêu thụ nhận bộ máy theo mốc có chủ đích (`release-2-10-0`)
- Phát hành kit 2.11.0 — đóng số cho cửa sổ 2.10→2.11 và VÁ TRONG MỐC lỗ xanh-giả của bộ giải cấu hình (nháy không cân làm hỏng chuỗi lệnh, bash trả 2, luật expected_exit đọc 2 thành giới hạn đã khai) (`release-2-11-0`)
- Phát hành kit 2.2.0 — đóng số cho ba hồ sơ 17–18/08 (hình tại Cổng 1 · mối nối Vòng TRAO · siết răng câu-về-hình) để repo tiêu thụ nhận engine mới có chủ đích trước khi mở vòng r4 bước 1 (`release-2-2-0`)
- Phát hành kit 2.3.0 — đóng số cho bảy hồ sơ đã ký 18–22/08 (hồ sơ chưa arm cổng · hết giờ ≠ trượt · tool-kill một nguồn · làn V không phải chờ ký · repo khai plugin · vào có ô ra có tên · đường đo) để repo tiêu thụ nhận engine mới theo mốc có chủ đích (`release-2-3-0`)
- Phát hành kit 2.4.0 — đóng số cho bảy hồ sơ đã ký 22–26/08 (lệnh bấm được · ba tài liệu đầu tay · /start bảng điều khiển · đặc tả UX · ra có tên ở LÀM và TRAO · làn máy qua bộ phân loại · design-pass nấc không đồng bộ) để repo tiêu thụ nhận engine mới theo mốc có chủ đích (`release-2-4-0`)
- Phát hành kit 2.5.0 — đóng số cho năm hồ sơ đã ký 27–30/08 (thước nhãn-đè-khối · sổ chạy suite có nguồn gốc · không vẽ thẻ ma · chấm đúng cây đúng chỗ đứng · nhánh chính không tên main) + bộ ca đo tầng SKILL, để repo tiêu thụ nhận engine mới theo mốc có chủ đích (`release-2-5-0`)
- Phát hành kit 2.6.0 — đóng số cho một vòng đã ký sau khi thu phạm vi (cong-dang-co-cua) + đọc NGƯỠNG CẮT KIT tại đúng mốc owner khai trước, để repo tiêu thụ nhận engine mới theo mốc có chủ đích (`release-2-6-0`)
- Phát hành kit 2.7.0 — đóng số cho vòng «lời mời cổng thành vật máy sinh» (#136), để repo tiêu thụ nhận thẻ điền sẵn + ba đường fail-quiet đã đóng theo mốc có chủ đích (`release-2-7-0`)
- Phát hành kit 2.8.0 — đóng số cho vòng «vũ trang /goal lúc gọi tên» (#140), để repo tiêu thụ nhận thẻ Cổng 1 in sẵn dòng /goal và skill feature-loop vũ trang ở mọi lượt người đứng trước đoạn máy, theo mốc có chủ đích (`release-2-8-0`)
- Phát hành kit 2.9.0 — đóng số cho ba vòng sửa của cửa sổ 2.8→2.9 (PR 146 inputs-tinh-tu-goc-kho · 149 co-qua-timebox-nhom-da-xong · 151 thuoc-khai-mot-dang-do-mot-neo), bộ audit 05/09 + giấy phép MIT, và bộ tài liệu playbook 07/09 — để repo tiêu thụ nhận bộ máy theo mốc có chủ đích (`release-2-9-0`)
- Repo khai plugin — acceptance-init ghi .claude/settings.json (marketplace + 4 plugin) bằng script hợp nhất JSON, tên plugin lấy từ marketplace.json ship cùng plugin; GUIDE §5.1 từ 5 lệnh còn 1 cho máy sau; diagram-design bắt buộc (`repo-khai-plugin`)
- Scope-triage cho review findings ở S4 — ngăn thứ ba "thật nhưng ngoài hợp đồng" (`s4-scope-triage`)
- Siết răng của phép đo câu-về-hình — P90 canh mọi bản chép, răng đọc bảng thông điệp từ P197, chiều đỏ tách-đoạn cho quan hệ cùng-đoạn, ma trận nhãn nở đủ, đối chứng P90 dùng chung (`siet-rang-cau-ve-hinh`)
- Hồ sơ có bằng chứng nhưng status chưa arm cổng không được tàng hình — pre-merge thôi `continue` im lặng ở draft/approved khi đã có evidence-report.md hoặc PR đổi code chịu cổng; giữ đường đọc-cũ cho hồ sơ không có bằng chứng (`status-chua-arm-cong`)
- Vòng lặp biết tự nhận ra khi cách sửa sai khuôn — vòng thứ hai còn sinh lỗi cùng loại thì dừng và hỏi người, thay vì chạy tiếp vòng ba rồi hỏng cùng kiểu (`stop-patching-law`)
- Lệnh suite phải sinh dòng sổ chạy — không thì mọi vòng đỏ đối chiếu sau khi ký (`suite-run-log-provenance`)
- Tách phạm vi răng T1-escape khỏi phạm vi diff (cờ opt-out + thứ tự bump version) (`t1-escape-event-scope`)
- Hai thước tự khai một đằng đo một nẻo — răng lane có chiều đỏ sống trên cây hôm nay, và P86 so quan hệ ngân sách thay vì hỏi chữ số có mặt (`thuoc-khai-mot-dang-do-mot-neo`)
- Thước nhãn-đè-khối cho diagram-design (`thuoc-nhan-de-khoi`)
- Luật «lệnh bị công cụ ngắt ≠ lệnh fail» thành MỘT nguồn ở acceptance-gate cho cả đường vòng lặp (workflow nhận qua args) lẫn đường VERIFY độc lập của skill acceptance; đóng bộ đo hành vi bên viết bằng hội đồng phiên sạch (`tool-kill-duong-doc-lap`)
- Vào có ô, ra có tên — ý khai thác xong có ô máy đọc (stub opportunity.md), bộ quét /start tách «đang cân nhắc» khỏi «chờ Cổng Đáng» theo ngưỡng đã điền, thẻ nói số ý và tuổi; 7 hạt giống kit nhận ô, trạng thái sống một chỗ (`vao-co-o-ra-co-ten`)
- Đợt 2 «người về biên» — trạng thái veto-có-dấu-vết cho Cổng Phạm vi T2 và Cổng Bằng chứng xanh-sạch thôi mời ký; sửa đồng bộ ba tầng luật-văn-bản + hook chặn-lúc-ghi + lưới trước-merge (`veto-co-dau-vet`)
- Gom luật đọc hồ sơ xưởng về một chỗ — mọi bên đọc phải cho cùng một kết luận (`workspace-reader-unification`) · liên quan: product-map-uat-session

## Xếp lại sau

- Mã 127 ở làn đối chứng là tín hiệu phân biệt, không phải hạ tầng hỏng (`baseline-127-tin-hieu-phan-biet`)
- Khuôn răng dùng chung — bộ đo của hồ sơ không được tự dối theo cùng ba hình dạng (`khuon-rang-dung-chung`)

## Đã bác từ khám phá

- Bản đồ dính commit chữ ký, không đi sau (`ban-do-dinh-chu-ky`)
- Bật đường ghi cho ô kết «máy đã thông» của làn V (`lan-may-thong-duong-ghi`) — đã đóng có hồ sơ
- Làn máy thoát phép kiểm bằng-chứng-cũ ở cổng trước-merge (`lan-v-thoat-kiem-stale`) — đã đóng có hồ sơ

## Ngoài phạm vi đã ký

- Bảy đề xuất từ «The AI-Native SDLC playbook» — BÁC 07/09 (`.out-of-scope/doi-chieu-playbook-ai-native.md`)
- Cưỡng chế gap-probe ở write-time (hook PreToolUse) — ĐÃ TỪ CHỐI (`.out-of-scope/gap-probe-write-time-hook.md`)
- Siết răng T1-escape: chỉ `_acceptance/<slug>/` THẬT mới bảo lãnh cho PR — ĐÃ TỪ CHỐI (`.out-of-scope/t1-escape-slug-only-thu-hep-mien-tru.md`)
- Miễn trừ `.github/**` và `.claude-plugin/plugin.json` khỏi `t1_skip_globs` — ĐÃ TỪ CHỐI (`.out-of-scope/t1-skip-globs-github-and-manifests.md`)
- Đo-thước-của-thước sâu hơn MỘT tầng — PARK 30/08 («cắt đuôi, giữ lõi») (`.out-of-scope/thuoc-cua-thuoc-mot-tang.md`)
