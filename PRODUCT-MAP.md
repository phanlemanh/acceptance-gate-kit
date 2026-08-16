# Bản đồ sản phẩm

> Bản đồ vẽ lại từ hồ sơ của xưởng mỗi lần một người ký một cổng — đừng sửa tay.
> (đọc từ thư mục `_acceptance/` và `.out-of-scope/`)

```mermaid
flowchart TD
  A["Đang cân nhắc cơ hội<br/>chưa có"] --> GD{"Cổng Đáng"}
  GD --> B["Sắp mở vòng<br/>chưa có"]
  GD --> XL["Xếp lại sau<br/>chưa có"]
  GD --> DB["Đã bác từ khám phá<br/>chưa có"]
  B --> CD["Chờ duyệt phạm vi<br/>2 việc"] --> GP{"Cổng Phạm vi"}
  GP --> DL["Đang làm<br/>2 việc"] --> GB{"Cổng Bằng chứng"}
  GB --> DG["Đã giao<br/>41 việc"]
  GB --> CN["Chờ phiên nghiệm thu<br/>chưa có"] --> GG{"Cổng Giá trị"}
  GG --> NT["Đã nghiệm thu giá trị<br/>chưa có"]
```

> **Bốn cổng người** — mỗi cổng là một câu hỏi chỉ người trả lời được:
> **Cổng Đáng** việc này có đáng làm không · **Cổng Phạm vi** bộ tiêu chí
> đã đủ và đúng chưa · **Cổng Bằng chứng** đã làm đúng thứ đã hứa chưa ·
> **Cổng Giá trị** thứ đã giao có ăn thua không.

## Chờ duyệt phạm vi

- Dấu cross-layer đọc theo cùng luật với judgment — trích dẫn Dấu hết bị chấm như mang Dấu (`crosslayer-uncoded`)
- Răng cross-layer chấm bằng nguồn dùng chung — Nhãn hết làm trượt, tham chiếu chéo hết bị chấm oan (`premerge-ac-line`)

## Đang làm

- Cắt khối 👉 VIỆC CỦA ANH khỏi TIN mời cổng — thay khuôn N-mục-3-vế bằng một câu «mời cổng như đồng nghiệp hỏi»; thẻ HTML giữ nguyên; chỉ TRỪ (`cat-khoi-viec-cua-anh-tren-tin`)
- Phát hành kit 2.0.0 — gom 1c + đợt 2 «người về biên» về một mốc release để repo tiêu thụ nhận engine mới có chủ đích trước đợt 3 (`release-2-0-0`)

## Đã giao

- Đưa bài học đo lường của tuần 08–14/08 vào engine — bốn lớp lỗi mới có ca đại diện, nguyên tắc lật-allow-list, và một bánh cóc hai chiều buộc bảng lớp lỗi trace về sổ nguồn (`bai-hoc-do-luong-vao-engine`)
- Thẻ quyết định in đúng thứ hồ sơ viết — đường dẫn có dấu sao không còn bị cụt khi lột định dạng, và mọi hình dạng dấu sao khác đều có kỳ vọng đã khai trước thay vì tuỳ hệ quả (`card-text-fidelity`)
- Kit thôi đo phút người ở mọi cổng — gỡ cả lớp HỎI lẫn lớp KHẲNG ĐỊNH về phút, giữ đường đọc-cũ cho hồ sơ đã ký và giữ nguyên mọi răng bằng chứng (`cat-hinh-thuc`)
- đóng lớp câm-lặng của 6 cửa parse trong claim-scan.mjs (5 lỗ: section-EOF, id sai khuôn, id trùng xuyên-feature, frontmatter không đọc được, nội dung rỗng) (`claim-scan-parser-hardening`)
- Gói Codex mang đủ mọi công cụ mà chỉ dẫn của nó bảo người dùng chạy — hết con trỏ chết, và có chốt máy canh quan hệ đó cho mọi lần thêm công cụ về sau (`codex-script-packaging`)
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
- Hình chọn theo mặt phẳng, không theo định dạng — vá luật N5 (`hinh-theo-mat-phang`)
- verdict judgment không-PASS phải kèm danh sách bằng-chứng-thiếu (required_evidence) chảy từ judge → memo → report → thẻ → round fix; gộp gold-seed O4: acceptance-gold.mjs dẫn xuất gold set + báo cáo G3 từ corpus sẵn có, không file mới (`judge-required-evidence`)
- acceptance-verify.js DỪNG fail-closed khi eval thiếu field mà prompt fan-out phụ thuộc (question/expected/steps/cmd/id/criterion/executor); judgment thiếu inputs hạ về UNCERTAIN cơ học thay vì chấm mù (`judgment-question-guard`)
- Khối "👉 VIỆC CỦA ANH" — thành phần cứng máy-sinh của khuôn trình-người (thẻ cổng + lời-mời-cổng) (`khoi-viec-cua-anh`)
- Lưu kho harness Codex và khai tử nghi lễ design-loop — chỉ TRỪ, có mốc git để đảo và 2 ADR (`luu-kho-codex-va-nghi-le-design`)
- lớp lỗi đo-lường thành luật ở 2 điểm cắm: gap-probe S1 (7 câu đối chiếu chéo) + review lens measurement S4 (6 hình dạng, một chỗ, mutation-covered); không nới finder cũ (`matrix-measure-law`)
- Máy gánh nhận thức, người giữ quyết định — lệnh cổng người tự suy danh tính/ngày/hồ-sơ (hiển thị lại + xác nhận một chạm), thôi hỏi phút, và khi câu người mơ hồ thì khuyến nghị kèm căn cứ thay vì hỏi mở (`may-ganh-nguoi-quyet`)
- Khuôn khai sinh phép đo — mọi phép đo mới phải tự chứng minh biết báo đỏ (đối chứng dương xanh + phá-vật-thật đổi kết luận + thông điệp ghim) ngay lúc viết, trước khi được tính là xong (`measure-birth-certificate`)
- Trả răng cho năm phép đo đã bị ghi là mất răng — chúng phải phân biệt được bản đúng với bản hỏng, và có một chốt canh để lần sau không lặp lại (`measure-teeth-cleanup`)
- Một-lượt-gõ + --repo cho 6 lệnh cổng người — người gõ MỘT câu gộp đúng dạng câu mẫu thẻ đã dạy, từ phiên/cwd bất kỳ (`mot-luot-go-cong-nguoi`)
- Luật ngôn ngữ mặt người — cưỡng chế bằng file tham chiếu + khuôn trình bày (`ngon-ngu-mat-nguoi`)
- Pha 3 — gói lưới 5 món cho discovery + feature-loop (template opportunity + platform-fit gap-probe + nạp DS skill + Gate 1 tự in /goal + wire S1-D design-pass) (`pha3-goi-luoi`)
- Sổ luật-đã-chạy — `clean` phải được chứng minh, không phải mặc định (`premerge-rules-ledger`)
- Chặn PASS chưa ai phán ở biên merge (chữ ký giữ-chỗ + slug tự khai phát hành không được tàng hình) (`premerge-unjudged-pass`)
- PRODUCT-MAP + phiên nghiệm thu — bộ sinh bản đồ sản phẩm từ hồ sơ xưởng, nghi thức Cổng Giá trị, start-scan đọc 2 nguồn mới (`product-map-uat-session`)
- Răng cho phép đo khối "👉 VIỆC CỦA ANH" — vá 3 lỗ của P188/P189 (cô-lập-lớp · sàn-đếm-nguồn · ranh-giới-câu) (`rang-phep-do-viec-cua-anh`)
- Scope-triage cho review findings ở S4 — ngăn thứ ba "thật nhưng ngoài hợp đồng" (`s4-scope-triage`)
- Staleness theo diff PR — staleness chỉ áp cho slug có hồ sơ trong diff (`stale-theo-diff-pr`)
- Lệnh /start — nghi thức vào phiên, quét workspace trình thẻ 3 nhóm rồi bàn giao (`start-command`)
- Làm cứng bộ quét /start — lỗi phải có tên, không đổi nghĩa (`start-scan-hardening`)
- Vòng lặp biết tự nhận ra khi cách sửa sai khuôn — vòng thứ hai còn sinh lỗi cùng loại thì dừng và hỏi người, thay vì chạy tiếp vòng ba rồi hỏng cùng kiểu (`stop-patching-law`)
- Tách phạm vi răng T1-escape khỏi phạm vi diff (cờ opt-out + thứ tự bump version) (`t1-escape-event-scope`)
- Đợt 2 «người về biên» — trạng thái veto-có-dấu-vết cho Cổng Phạm vi T2 và Cổng Bằng chứng xanh-sạch thôi mời ký; sửa đồng bộ ba tầng luật-văn-bản + hook chặn-lúc-ghi + lưới trước-merge (`veto-co-dau-vet`)
- Gom luật đọc hồ sơ xưởng về một chỗ — mọi bên đọc phải cho cùng một kết luận (`workspace-reader-unification`) · liên quan: product-map-uat-session

## Ngoài phạm vi đã ký

- Cưỡng chế gap-probe ở write-time (hook PreToolUse) — ĐÃ TỪ CHỐI (`.out-of-scope/gap-probe-write-time-hook.md`)
- Siết răng T1-escape: chỉ `_acceptance/<slug>/` THẬT mới bảo lãnh cho PR — ĐÃ TỪ CHỐI (`.out-of-scope/t1-escape-slug-only-thu-hep-mien-tru.md`)
- Miễn trừ `.github/**` và `.claude-plugin/plugin.json` khỏi `t1_skip_globs` — ĐÃ TỪ CHỐI (`.out-of-scope/t1-skip-globs-github-and-manifests.md`)
