# Bản đồ sản phẩm

> Bản đồ vẽ lại từ hồ sơ của xưởng mỗi lần một người ký một cổng — đừng sửa tay.
> (đọc từ thư mục `_acceptance/` và `.out-of-scope/`)

```mermaid
flowchart TD
  A["Đang cân nhắc cơ hội<br/>6 việc"] --> GD{"Cổng Đáng"}
  GD --> B["Sắp mở vòng<br/>1 việc"]
  GD --> XL["Xếp lại sau<br/>chưa có"]
  GD --> DB["Đã bác từ khám phá<br/>1 việc"]
  B --> CD["Chờ duyệt phạm vi<br/>chưa có"] --> GP{"Cổng Phạm vi"}
  GP --> DL["Đang làm<br/>3 việc"] --> GB{"Cổng Bằng chứng"}
  GB --> DG["Đã giao<br/>55 việc"]
  GB --> CN["Chờ phiên nghiệm thu<br/>4 việc"] --> GG{"Cổng Giá trị"}
  GG --> NT["Đã nghiệm thu giá trị<br/>chưa có"]
```

> **Bốn cổng người** — mỗi cổng là một câu hỏi chỉ người trả lời được:
> **Cổng Đáng** việc này có đáng làm không · **Cổng Phạm vi** bộ tiêu chí
> đã đủ và đúng chưa · **Cổng Bằng chứng** đã làm đúng thứ đã hứa chưa ·
> **Cổng Giá trị** thứ đã giao có ăn thua không.

## Đang cân nhắc cơ hội

- Ba chỗ tích luỹ không có đường ra — khoá config · dòng file kiểm · con số suite (`ba-cho-tich-luy-khong-duong-ra`)
- Hỏi-theo-mặt-phẳng — câu hỏi là thứ người bấm được, không phải khuôn chữ (`hoi-theo-mat-phang`)
- Mọi liệt kê trong hợp đồng phải máy-đọc (`liet-ke-may-doc`)
- Ngày «việc vừa xong» lấy sai nấc cho hồ sơ đã qua phiên nghiệm thu — vòng đóng hôm nay bị đóng dấu bảy tháng tuổi và rơi khỏi thẻ (`ngay-viec-vua-xong-lay-sai-nac`)
- Ô nuốt luật — đổi hai ô hỏi-khẩu-vị thành ô hỏi-phép-đối-chiếu (`o-nuot-luat`)
- T1 tuyên-kèm-căn-cứ — máy tuyên T1 với bảng căn cứ, không dừng hỏi (`t1-tuyen-kem-can-cu`)

## Sắp mở vòng

- Ra có tên ở Vòng LÀM và TRAO — làn V có ô kết, Cổng Đáng ký trong một lượt, Cổng Giá trị có lối ra cho vòng không đo được (`ra-co-ten-lam-va-trao`)

## Đang làm

- design-pass nấc không đồng bộ — thang 4 nấc phản ứng (mặc định async, sync có người gọi tên) + bước phân kỳ có điều kiện mở từ đặc tả UX + khoá reaction/bộ phương án trong sổ phiên + thẻ Cổng Phạm vi hiện nấc (`design-pass-nac-khong-dong-bo`)
- Phát hành kit 2.0.0 — gom 1c + đợt 2 «người về biên» về một mốc release để repo tiêu thụ nhận engine mới có chủ đích trước đợt 3 (`release-2-0-0`)
- Phát hành kit 2.1.0 — gom hai hồ sơ TRỪ 16/08 (tin mời cổng thôi form · cổng chặn nhầm chỗ) + luật hình về một mốc, và đưa skill diagram-design vào marketplace như plugin thứ ba (vendor có pin, skin sống trong repo tiêu thụ) — để repo tiêu thụ nhận luật mới có chủ đích trước khi đợt 3 đo M1/M2 (`release-2-1-0`)

## Đã giao — chờ phiên nghiệm thu

- Bản đặc tả UX — vật hoá tầng cấu trúc (khuôn có marker trong design-doc + lời S1 điền-trước + bước tra mẫu có vết) (`dac-ta-ux-vat-hoa-cau-truc`)
- Đường đo nằm trong định-nghĩa-xong — contract có ô «Đường đo» khi hồ sơ có ngưỡng; thẻ Cổng Phạm vi cờ vàng khi thiếu, cửa bỏ có tên; gap-probe cross-check ngưỡng↔đường đo (`duong-do-trong-dinh-nghia-xong`)
- Lệnh in ra phải bấm được — một nguồn tên lệnh (bảng COMMAND-NAMES, bảng ⊆ vật thật, điểm bàn giao ⊆ bảng) + TRỪ ba cờ nhiễu trên thẻ + bốn sửa đúng từ finding B/C (`lenh-in-ra-phai-bam-duoc`)
- «/start» là bảng điều khiển của owner, không phải bộ định tuyến — hiện hết ý đang cân nhắc, nêu tên việc máy vừa làm và thứ còn veto được, và mọi bộ đọc nói cùng một chữ (`start-bang-dieu-khien`)

## Đã giao

- Đưa bài học đo lường của tuần 08–14/08 vào engine — bốn lớp lỗi mới có ca đại diện, nguyên tắc lật-allow-list, và một bánh cóc hai chiều buộc bảng lớp lỗi trace về sổ nguồn (`bai-hoc-do-luong-vao-engine`)
- Thẻ quyết định in đúng thứ hồ sơ viết — đường dẫn có dấu sao không còn bị cụt khi lột định dạng, và mọi hình dạng dấu sao khác đều có kỳ vọng đã khai trước thay vì tuỳ hệ quả (`card-text-fidelity`)
- Kit thôi đo phút người ở mọi cổng — gỡ cả lớp HỎI lẫn lớp KHẲNG ĐỊNH về phút, giữ đường đọc-cũ cho hồ sơ đã ký và giữ nguyên mọi răng bằng chứng (`cat-hinh-thuc`)
- Cắt khối 👉 VIỆC CỦA ANH khỏi TIN mời cổng — thay khuôn N-mục-3-vế bằng một câu «mời cổng như đồng nghiệp hỏi»; thẻ HTML giữ nguyên; chỉ TRỪ (`cat-khoi-viec-cua-anh-tren-tin`)
- đóng lớp câm-lặng của 6 cửa parse trong claim-scan.mjs (5 lỗ: section-EOF, id sai khuôn, id trùng xuyên-feature, frontmatter không đọc được, nội dung rỗng) (`claim-scan-parser-hardening`)
- Gói Codex mang đủ mọi công cụ mà chỉ dẫn của nó bảo người dùng chạy — hết con trỏ chết, và có chốt máy canh quan hệ đó cho mọi lần thêm công cụ về sau (`codex-script-packaging`)
- Cổng chặn nhầm chỗ — lưới trước-merge cho làn V qua đúng như hook; gỡ lớp chứng-minh-chữ-ký-bằng-commit (require_human_commit · agent_authors · hạt commit riêng), chữ ký = quyết định ghi trong hồ sơ, provenance lấy từ forge (`cong-chan-nham-cho`)
- Vật chép sang repo tiêu thụ phải chạy được ở repo tiêu thụ (.cjs + danh sách chép đủ bộ) (`consumer-copy-cjs`)
- Trục ngữ cảnh cho bản mẫu — khoá context 3 nấc trong sổ phiên design-pass, card Cổng 1 render nấc, generic mọi repo (`context-ladder`)
- gap-probe S1 đọc bài học lớp-lỗi từ các feature trước qua claim-scan.mjs (index dẫn xuất, không persist) (`cross-feature-claim-index`)
- re-pin 1 lượt machine-lane + N chữ ký cùng run_id (chống gian lận 2 tầng bằng máy) + P1 carry-forward cho round fix sau REJECT; không hạ một chuẩn bằng chứng nào (`delta-verify-repin`)
- skill mới `design-pass`: nghi thức thiết kế in-harness cho bước S1-D (phiên chuyên trách thẩm mỹ+UX trên proto C2 trong Browser pane, owner phản ứng bằng lời; thay vai ceremony design-mockup đã khai tử) (`design-pass-skill`)
- Lối (a) /start hết lệch làn brainstorm — vế âm trong kit, vế dương qua ổ cắm repo khai (`discovery-brainstorm-socket`)
- Tài liệu first-run một khuôn — CI snippet, /start, jsdom, attribution version (`docs-first-run-audit`)
- Ba lượt đổi hành vi ở cổng người — khối 👉 thôi làm luật mỗi-tin, quét độ phủ thôi phỏng vấn, khởi tạo một-lần-gạch; lời hứa hành vi chấm bằng hội đồng bắt buộc (hạng mục T1 đã thu phạm vi 14/08) (`doi-hanh-vi-cong-nguoi`)
- luật ranh giới section PER-SECTION đặt một chỗ có marker trong lib/md-section.js; gate-card + evidence-page hết bản sao, claim-scan ghim bằng round-trip (`findings-section-boundary`)
- Pre-merge enforce gap-probe presence (merge-boundary, thay cho hook write-time) (`gap-probe-presence-hook`)
- Card Cổng 1 phải hiện ĐỦ criterion contract khai — hoặc kêu to khi không đọc được (`gate-card-ac-visibility`)
- sổ vàng in cho người được máy đo thật đầu-ra (render round-trip, ma trận đồng thuận toàn phần) + từ điển biệt ngữ lời ký để lớp giám khảo ngôn-ngữ có đường PASS sạch (`gold-output-measure`)
- Verifier bị công cụ giết ≠ suite fail — luật timeout trong prompt 3 lane, field killedByTool, routing ép về BLOCKED thay vì REJECT giả (`het-gio-khong-phai-truot`)
- Hình tại Cổng 1 — máy tự kê điểm quyết định, đếm ngưỡng N5, giao vẽ, nhìn, đính cùng thẻ; người không phải gõ thêm lượt để có hình (`hinh-tai-cong-1`)
- Hình chọn theo mặt phẳng, không theo định dạng — vá luật N5 (`hinh-theo-mat-phang`)
- verdict judgment không-PASS phải kèm danh sách bằng-chứng-thiếu (required_evidence) chảy từ judge → memo → report → thẻ → round fix; gộp gold-seed O4: acceptance-gold.mjs dẫn xuất gold set + báo cáo G3 từ corpus sẵn có, không file mới (`judge-required-evidence`)
- acceptance-verify.js DỪNG fail-closed khi eval thiếu field mà prompt fan-out phụ thuộc (question/expected/steps/cmd/id/criterion/executor); judgment thiếu inputs hạ về UNCERTAIN cơ học thay vì chấm mù (`judgment-question-guard`)
- Khối "👉 VIỆC CỦA ANH" — thành phần cứng máy-sinh của khuôn trình-người (thẻ cổng + lời-mời-cổng) (`khoi-viec-cua-anh`)
- Máy quét vào phiên hỏi đúng câu lưới trước-merge hỏi — hồ sơ không còn cần người thì thôi hiện «chờ ký», hồ sơ chưa sạch thì luôn còn ở cổng (`lan-v-khong-phai-cho-ky`)
- Ba tài liệu đầu-tay (QUICKSTART · README · GUIDE) vào vũ trụ quét lệnh — 52 token trần đổi sang dạng bấm được, cùng bảng COMMAND-NAMES và cùng ca LB2 (`lenh-tran-tai-lieu-dau-tay`)
- Lưu kho harness Codex và khai tử nghi lễ design-loop — chỉ TRỪ, có mốc git để đảo và 2 ADR (`luu-kho-codex-va-nghi-le-design`)
- lớp lỗi đo-lường thành luật ở 2 điểm cắm: gap-probe S1 (7 câu đối chiếu chéo) + review lens measurement S4 (6 hình dạng, một chỗ, mutation-covered); không nới finder cũ (`matrix-measure-law`)
- Máy gánh nhận thức, người giữ quyết định — lệnh cổng người tự suy danh tính/ngày/hồ-sơ (hiển thị lại + xác nhận một chạm), thôi hỏi phút, và khi câu người mơ hồ thì khuyến nghị kèm căn cứ thay vì hỏi mở (`may-ganh-nguoi-quyet`)
- Khuôn khai sinh phép đo — mọi phép đo mới phải tự chứng minh biết báo đỏ (đối chứng dương xanh + phá-vật-thật đổi kết luận + thông điệp ghim) ngay lúc viết, trước khi được tính là xong (`measure-birth-certificate`)
- Trả răng cho năm phép đo đã bị ghi là mất răng — chúng phải phân biệt được bản đúng với bản hỏng, và có một chốt canh để lần sau không lặp lại (`measure-teeth-cleanup`)
- Mối nối Vòng TRAO — nhật-ký-vấp của lái-thử người-lạ thành bằng chứng vào phiên nghiệm thu; ngưỡng nghiệm thu hiện ở Cổng Phạm vi; S5 bàn giao sang Vòng TRAO thay vì kết thúc; chữ spec + bộ hình đi cùng (`moi-noi-vong-trao`)
- Một-lượt-gõ + --repo cho 6 lệnh cổng người — người gõ MỘT câu gộp đúng dạng câu mẫu thẻ đã dạy, từ phiên/cwd bất kỳ (`mot-luot-go-cong-nguoi`)
- Luật ngôn ngữ mặt người — cưỡng chế bằng file tham chiếu + khuôn trình bày (`ngon-ngu-mat-nguoi`)
- Pha 3 — gói lưới 5 món cho discovery + feature-loop (template opportunity + platform-fit gap-probe + nạp DS skill + Gate 1 tự in /goal + wire S1-D design-pass) (`pha3-goi-luoi`)
- Sổ luật-đã-chạy — `clean` phải được chứng minh, không phải mặc định (`premerge-rules-ledger`)
- Chặn PASS chưa ai phán ở biên merge (chữ ký giữ-chỗ + slug tự khai phát hành không được tàng hình) (`premerge-unjudged-pass`)
- PRODUCT-MAP + phiên nghiệm thu — bộ sinh bản đồ sản phẩm từ hồ sơ xưởng, nghi thức Cổng Giá trị, start-scan đọc 2 nguồn mới (`product-map-uat-session`)
- Răng cho phép đo khối "👉 VIỆC CỦA ANH" — vá 3 lỗ của P188/P189 (cô-lập-lớp · sàn-đếm-nguồn · ranh-giới-câu) (`rang-phep-do-viec-cua-anh`)
- Phát hành kit 2.2.0 — đóng số cho ba hồ sơ 17–18/08 (hình tại Cổng 1 · mối nối Vòng TRAO · siết răng câu-về-hình) để repo tiêu thụ nhận engine mới có chủ đích trước khi mở vòng r4 bước 1 (`release-2-2-0`)
- Phát hành kit 2.3.0 — đóng số cho bảy hồ sơ đã ký 18–22/08 (hồ sơ chưa arm cổng · hết giờ ≠ trượt · tool-kill một nguồn · làn V không phải chờ ký · repo khai plugin · vào có ô ra có tên · đường đo) để repo tiêu thụ nhận engine mới theo mốc có chủ đích (`release-2-3-0`)
- Repo khai plugin — acceptance-init ghi .claude/settings.json (marketplace + 4 plugin) bằng script hợp nhất JSON, tên plugin lấy từ marketplace.json ship cùng plugin; GUIDE §5.1 từ 5 lệnh còn 1 cho máy sau; diagram-design bắt buộc (`repo-khai-plugin`)
- Scope-triage cho review findings ở S4 — ngăn thứ ba "thật nhưng ngoài hợp đồng" (`s4-scope-triage`)
- Siết răng của phép đo câu-về-hình — P90 canh mọi bản chép, răng đọc bảng thông điệp từ P197, chiều đỏ tách-đoạn cho quan hệ cùng-đoạn, ma trận nhãn nở đủ, đối chứng P90 dùng chung (`siet-rang-cau-ve-hinh`)
- Staleness theo diff PR — staleness chỉ áp cho slug có hồ sơ trong diff (`stale-theo-diff-pr`)
- Lệnh /start — nghi thức vào phiên, quét workspace trình thẻ 3 nhóm rồi bàn giao (`start-command`)
- Làm cứng bộ quét /start — lỗi phải có tên, không đổi nghĩa (`start-scan-hardening`)
- Hồ sơ có bằng chứng nhưng status chưa arm cổng không được tàng hình — pre-merge thôi `continue` im lặng ở draft/approved khi đã có evidence-report.md hoặc PR đổi code chịu cổng; giữ đường đọc-cũ cho hồ sơ không có bằng chứng (`status-chua-arm-cong`)
- Vòng lặp biết tự nhận ra khi cách sửa sai khuôn — vòng thứ hai còn sinh lỗi cùng loại thì dừng và hỏi người, thay vì chạy tiếp vòng ba rồi hỏng cùng kiểu (`stop-patching-law`)
- Tách phạm vi răng T1-escape khỏi phạm vi diff (cờ opt-out + thứ tự bump version) (`t1-escape-event-scope`)
- Luật «lệnh bị công cụ ngắt ≠ lệnh fail» thành MỘT nguồn ở acceptance-gate cho cả đường vòng lặp (workflow nhận qua args) lẫn đường VERIFY độc lập của skill acceptance; đóng bộ đo hành vi bên viết bằng hội đồng phiên sạch (`tool-kill-duong-doc-lap`)
- Vào có ô, ra có tên — ý khai thác xong có ô máy đọc (stub opportunity.md), bộ quét /start tách «đang cân nhắc» khỏi «chờ Cổng Đáng» theo ngưỡng đã điền, thẻ nói số ý và tuổi; 7 hạt giống kit nhận ô, trạng thái sống một chỗ (`vao-co-o-ra-co-ten`)
- Đợt 2 «người về biên» — trạng thái veto-có-dấu-vết cho Cổng Phạm vi T2 và Cổng Bằng chứng xanh-sạch thôi mời ký; sửa đồng bộ ba tầng luật-văn-bản + hook chặn-lúc-ghi + lưới trước-merge (`veto-co-dau-vet`)
- Gom luật đọc hồ sơ xưởng về một chỗ — mọi bên đọc phải cho cùng một kết luận (`workspace-reader-unification`) · liên quan: product-map-uat-session

## Đã bác từ khám phá

- Bản đồ dính commit chữ ký, không đi sau (`ban-do-dinh-chu-ky`)

## Ngoài phạm vi đã ký

- Cưỡng chế gap-probe ở write-time (hook PreToolUse) — ĐÃ TỪ CHỐI (`.out-of-scope/gap-probe-write-time-hook.md`)
- Siết răng T1-escape: chỉ `_acceptance/<slug>/` THẬT mới bảo lãnh cho PR — ĐÃ TỪ CHỐI (`.out-of-scope/t1-escape-slug-only-thu-hep-mien-tru.md`)
- Miễn trừ `.github/**` và `.claude-plugin/plugin.json` khỏi `t1_skip_globs` — ĐÃ TỪ CHỐI (`.out-of-scope/t1-skip-globs-github-and-manifests.md`)
