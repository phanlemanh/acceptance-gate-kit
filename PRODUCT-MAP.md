# Bản đồ sản phẩm

> Bản đồ vẽ lại từ hồ sơ của xưởng mỗi lần một người ký một cổng — đừng sửa tay.
> (đọc từ thư mục `_acceptance/` và `.out-of-scope/`)

```mermaid
flowchart TD
  A["Đang cân nhắc cơ hội<br/>10 việc"] --> GD{"Cổng Đáng"}
  GD --> B["Sắp mở vòng<br/>3 việc"]
  GD --> XL["Xếp lại sau<br/>25 việc"]
  GD --> DB["Đã bác từ khám phá<br/>11 việc"]
  B --> CD["Chờ duyệt phạm vi<br/>chưa có"] --> GP{"Cổng Phạm vi"}
  GP --> DL["Đang làm<br/>2 việc"] --> GB{"Cổng Bằng chứng"}
  GB --> DG["Đã giao<br/>77 việc"]
  GB --> CN["Chờ phiên nghiệm thu<br/>8 việc"] --> GG{"Cổng Giá trị"}
  GG --> NT["Đã nghiệm thu giá trị<br/>3 việc"]
```

> **Bốn cổng người** — mỗi cổng là một câu hỏi chỉ người trả lời được:
> **Cổng Đáng** việc này có đáng làm không · **Cổng Phạm vi** bộ tiêu chí
> đã đủ và đúng chưa · **Cổng Bằng chứng** đã làm đúng thứ đã hứa chưa ·
> **Cổng Giá trị** thứ đã giao có ăn thua không.

## Đang cân nhắc cơ hội

- Bốn mục cho cửa sổ 2.13 — re-pin theo diff · routing-baseline không đỏ vì hồ sơ mới · dòng 1 đo tới lên-main + ship chạy nền · chiến dịch ghim lại 41 hồ sơ stale (`ba-cho-cat-sau-chu-ky-cua-so-2-13`)
- Chốt chặn trước-merge chấm MỌI hồ sơ đã arm cổng, kể cả hồ sơ PR không chạm — một vòng dở làm kẹt mọi PR khác của kho (`cong-chan-theo-ho-so-khong-theo-diff`)
- Nhà tài liệu khai một chỗ — repo khai «lớp vật × vòng đời → một nhà» trong khối máy đọc của docs/MAP.md, máy kiểm không hai nhà / không nhà lạ; repo mới được acceptance-init dựng bản mặc định cũng qua router; feature-loop đọc nhà thay vì đường cứng (`nha-tai-lieu-router`)
- Ô nuốt luật — đổi hai ô hỏi-khẩu-vị thành ô hỏi-phép-đối-chiếu (`o-nuot-luat`)
- Phát hiện của làn rà soát đến được người ký — thẻ Cổng 2 và luật xanh-sạch đọc cùng một nguồn, và đọc được đúng chữ in trên nút (`phat-hien-den-duoc-nguoi-ky`)
- Phép kiểm xanh-sạch đo theo vùng có cấu trúc, không quét trọn file (`phep-kiem-sach-do-theo-vung`)
- Chạy lưới trước-merge đúng như CI — trên cây đã gộp nhánh chính, có base — TRƯỚC khi mở PR, để CI không là nơi đầu tiên phát hiện (`premerge-nhu-ci-truoc-khi-mo-pr`)
- Răng của hồ sơ mốc phát hành neo theo lúc hồ sơ ra đời, không theo số phiên bản ở cây — để hồ sơ mốc đã ký không đỏ giả ở mốc kế (`rang-moc-neo-theo-ho-so`)
- Phát hiện rà soát KHÔNG lật verdict — verdict chỉ đỏ khi phép đo hoặc lệnh suite đỏ; phát hiện lên thẻ kèm bán kính, người quyết (`thuoc-khong-lat-verdict`)
- Ý định có nhà riêng — cửa vào và cửa ra không cần người ngồi phiên; tách viết ý định khỏi ký; Cổng Đáng có lệnh ký; ngưỡng UAT thành băng sau phát hành; ba số cho nguyên tố 1 (`y-dinh-co-nha-rieng`)

## Sắp mở vòng

- Lớp vendored tự xưng — tệp khai phiên bản kit kèm băm từng tệp, danh sách chép rút từ một nguồn và gồm bộ đọc bản đồ, một lệnh kiểm chạy trong CI kho, một trang nghi thức nhận bản mới (`lop-vendored-tu-xung`)
- Ba phép đo của vòng thuoc-co-cua tuyên đo từng ô mà ô không độc lập hoặc giá trị mẫu trùng — làm lại để chiều đỏ của từng ô là của chính ô ấy (`phep-do-o-doc-lap-thuoc-co-cua`)
- Một vòng = một KẾT QUẢ người thấy được — S1 cắt vòng theo kết quả, AC ở tầng kết quả, cơ chế canh bằng bản phá (`vong-la-mot-ket-qua`)

## Đang làm

- Cờ qua-timebox cắt ngang cả nhóm «đã xong» — bộ quét gắn cờ cho hồ sơ park/bác, archived và đã có phán quyết giá trị (`co-qua-timebox-nhom-da-xong`)
- Làn ghim lại gặp lớp acceptance-gate cũ phải dừng có tên (tệp · export · bản cần · lối đi tiếp --ag-root) thay vì TypeError thô đọc thành làn đỏ (`ghim-lai-tren-lop-cu`)

## Đã giao — chờ phiên nghiệm thu

- Bản đặc tả UX — vật hoá tầng cấu trúc (khuôn có marker trong design-doc + lời S1 điền-trước + bước tra mẫu có vết) (`dac-ta-ux-vat-hoa-cau-truc`)
- design-pass nấc không đồng bộ — thang 4 nấc phản ứng (mặc định async, sync có người gọi tên) + bước phân kỳ có điều kiện mở từ đặc tả UX + khoá reaction/options/divergence trong sổ phiên + thẻ Cổng Phạm vi hiện nấc (`design-pass-nac-khong-dong-bo`)
- Hạ tầng thôi đốt lượt chấm và lượt gọi người — suite scripts chạy dưới trần công cụ, lượt BLOCKED vì hạ tầng thử lại cùng round, khuôn /goal thôi coi BLOCKED là xong, thẻ Cổng 1 của hồ sơ đã khép thôi hỏi (`ha-tang-khong-dot-luot`)
- Hồ sơ nghỉ — một dòng sổ có người và lý do làm hồ sơ đã ký rời khỏi luật cũ hoá, luật làn ghim lại và luật làn eval mà không sửa một byte chữ ký; cổng, kiểm lại bằng chứng, bộ quét và thẻ cùng hỏi một hàm; văn xuôi và dòng thiếu vế không tính là nghỉ; kiểu thư mục sử liệu cũ đọc được bằng cờ vàng (`ho-so-nghi`)
- làn máy sống qua bộ phân loại — lệnh kiểm cố định của kho thôi phải xin phép từng lần (A) + nghi thức biết đường thoái hoá tuần tự khi fan-out nghẽn (B) (`lan-may-song-qua-bo-phan-loai`)
- Lời mời cổng thành vật máy sinh — thẻ in câu gộp khuyến nghị bấm được, khối VIỆC-CỦA-ANH chỉ chứa điều-chỉ-người-biết, vá các đường fail-quiet của thẻ (`loi-moi-cong-may-sinh`)
- Ra có tên ở Vòng LÀM và TRAO — trạng thái «máy đã thông» cho làn V; Cổng Đáng ký qua /approve một lượt một PR; Cổng Giá trị có lối «không đo được» + archived/timebox có bộ đọc (`ra-co-ten-lam-va-trao`)
- Vũ trang /goal ở mọi lượt người đứng ngay trước đoạn máy — dòng /goal thành vật thẻ Cổng Phạm vi in ra (một nguồn, ba bản chép), điểm in = mỗi câu xin duyệt thiết kế của brainstorm · Cổng 1 · Gate 1.5 (`vu-trang-goal-luc-goi-ten`)

## Đã giao

- Đưa bài học đo lường của tuần 08–14/08 vào engine — bốn lớp lỗi mới có ca đại diện, nguyên tắc lật-allow-list, và một bánh cóc hai chiều buộc bảng lớp lỗi trace về sổ nguồn (`bai-hoc-do-luong-vao-engine`)
- Thẻ quyết định in đúng thứ hồ sơ viết — đường dẫn có dấu sao không còn bị cụt khi lột định dạng, và mọi hình dạng dấu sao khác đều có kỳ vọng đã khai trước thay vì tuỳ hệ quả (`card-text-fidelity`)
- Kit thôi đo phút người ở mọi cổng — gỡ cả lớp HỎI lẫn lớp KHẲNG ĐỊNH về phút, giữ đường đọc-cũ cho hồ sơ đã ký và giữ nguyên mọi răng bằng chứng (`cat-hinh-thuc`) — đã giao — đã nghỉ, giữ sử liệu
- Cắt khối 👉 VIỆC CỦA ANH khỏi TIN mời cổng — thay khuôn N-mục-3-vế bằng một câu «mời cổng như đồng nghiệp hỏi»; thẻ HTML giữ nguyên; chỉ TRỪ (`cat-khoi-viec-cua-anh-tren-tin`) — đã giao — đã nghỉ, giữ sử liệu
- Chốt máy trường-của-người sau bước tổng hợp S4 — workflow tự ép rỗng human_signoff / human_override / bypass_ack và ép verified_at bằng giờ engine trước khi trả báo cáo; tác tử tổng hợp hết quyền viết bốn trường ấy (`chot-may-chu-ky-sau-synthesize`)
- Chữ ký không tự làm bằng chứng hoá cũ (bản ghi định tuyến là vật T1 máy sinh) và làn trước chữ ký bỏ qua khi cây bằng pin (`chu-ky-khong-tu-lam-hoa-cu`)
- Gói Codex mang đủ mọi công cụ mà chỉ dẫn của nó bảo người dùng chạy — hết con trỏ chết, và có chốt máy canh quan hệ đó cho mọi lần thêm công cụ về sau (`codex-script-packaging`)
- Cổng Đáng có cửa — thẻ cổng thứ ba + ký một lượt bằng lệnh duyệt sẵn có (`cong-dang-co-cua`) — đã giao — đã nghỉ, giữ sử liệu
- Cổng người đọc đủ nguồn — thẻ đọc được tiêu chí khai bằng tiêu đề, ba bên gọi cùng một bộ bóc, mục Coverage viết bằng bảng thôi bị báo thiếu oan (`cong-nguoi-doc-du-nguon`)
- Chữ ký người ở Cổng Bằng chứng đóng cửa veto — lưới trước-merge và máy quét /start thôi nói «owner chưa veto» về hồ sơ người đã ký (`cua-veto-sau-chu-ky`) — đã giao — đã nghỉ, giữ sử liệu
- Trạm phân loại phạm vi thôi hỏng vì định danh do LLM chép — định danh do máy đúc, và một lượt hỏi lại đúng phần còn thiếu trước khi kéo cả lượt về fail-toward-human. (`do-tin-tram-phan-loai`)
- Ba lượt đổi hành vi ở cổng người — khối 👉 thôi làm luật mỗi-tin, quét độ phủ thôi phỏng vấn, khởi tạo một-lần-gạch; lời hứa hành vi chấm bằng hội đồng bắt buộc (hạng mục T1 đã thu phạm vi 14/08) (`doi-hanh-vi-cong-nguoi`) — đã giao — đã nghỉ, giữ sử liệu
- Đường đo nằm trong định-nghĩa-xong — contract có ô «Đường đo» khi hồ sơ có ngưỡng; thẻ Cổng Phạm vi cờ vàng khi thiếu, cửa bỏ có tên; gap-probe cross-check ngưỡng↔đường đo (`duong-do-trong-dinh-nghia-xong`) — đã giao — không đo, khai ở Cổng Đáng
- Đường lùi phải sống — làn máy-đi-trước có đường lùi thật ở hai cửa: người veto bằng một chữ và ô kết máy-đã-thông có đường ghi; máy không coi «không đo được» là sạch, làn V vẫn bị kiểm hoá cũ, lệnh ký chạy làn máy trước chữ ký (`duong-lui-phai-song`) — đã giao — đã nghỉ, giữ sử liệu
- Eval máy khai mã thoát mong đợi (expected_exit) — một giới hạn đã khai không còn bị năm bộ đọc coi là thất bại (`eval-khai-ma-thoat-mong-doi`) — đã giao — đã nghỉ, giữ sử liệu
- Pre-merge enforce gap-probe presence (merge-boundary, thay cho hook write-time) (`gap-probe-presence-hook`)
- Làn ghim lại phải NÓI RA ô nó không đo — eval ngoài làn máy (ui-check/judgment), vật đo của chúng đã đổi, và AC không có chốt máy — ở dòng pin, section Re-pin, thẻ hai cổng và lint W8; không đổi hành vi chặn nào (`ghim-lai-noi-ra-o-khong-do`)
- Bộ khớp glob của cổng hiểu `**/` là không-hoặc-nhiều thư mục — `**/*.md` bắt cả markdown ở gốc kho (`glob-hai-sao-khop-goc-kho`)
- sổ vàng in cho người được máy đo thật đầu-ra (render round-trip, ma trận đồng thuận toàn phần) + từ điển biệt ngữ lời ký để lớp giám khảo ngôn-ngữ có đường PASS sạch (`gold-output-measure`)
- Gom đúc kết 08/09 thành một vòng T3 trước mốc 2.10.0 — nợ C1 (7 Known limits của lop-bang-chung-nhin-thay), K1 null-guard workflow, K2 danh tính hết trạm thu phí, K3 W6/W8 thu phạm vi, K5 S5 mặc định PR, K8 làn conventions chỉ chấm file đổi (`gom-duc-ket-2-10-0`)
- Danh sách chép CI ở GUIDE §5.3 buộc vào writer — phép đo rút tập lib mà pre-merge-check.sh và recheck-evidence.cjs THẬT SỰ nạp rồi so với CẢ HAI bản khai, thay vì hai danh sách viết tay phải nhớ đồng bộ (`guide-chep-ci-buoc-vao-writer`)
- Hình tại Cổng 1 — máy tự kê điểm quyết định, đếm ngưỡng N5, giao vẽ, nhìn, đính cùng thẻ; người không phải gõ thêm lượt để có hình (`hinh-tai-cong-1`)
- inputs của hội đồng tính từ gốc kho — một gốc cho mọi đường dẫn trong evals, vắng thì kêu to (`inputs-tinh-tu-goc-kho`) — đã giao — đã nghỉ, giữ sử liệu
- verdict judgment không-PASS phải kèm danh sách bằng-chứng-thiếu (required_evidence) chảy từ judge → memo → report → thẻ → round fix; gộp gold-seed O4: acceptance-gold.mjs dẫn xuất gold set + báo cáo G3 từ corpus sẵn có, không file mới (`judge-required-evidence`)
- Khối tìm-lỗi trả phí theo vật — triage trước refute, finder không soi văn bản hồ sơ, finding có sổ, baseline rời đường găng, thước token/phút cho năm dòng số (`khoi-tim-loi-tra-phi-theo-vat`)
- Khối "👉 VIỆC CỦA ANH" — thành phần cứng máy-sinh của khuôn trình-người (thẻ cổng + lời-mời-cổng) (`khoi-viec-cua-anh`)
- Làn ghim lại và bên đọc pin cùng loại eval khai `status: not-run` từ MỘT nguồn — pin nói ra ô nào không đo, và hồ sơ lành thôi bị đọc thành nợ (`lan-doc-status-not-run`)
- Máy quét vào phiên hỏi đúng câu lưới trước-merge hỏi — hồ sơ không còn cần người thì thôi hiện «chờ ký», hồ sơ chưa sạch thì luôn còn ở cổng (`lan-v-khong-phai-cho-ky`) — đã giao — đã nghỉ, giữ sử liệu
- Lệnh in ra phải bấm được — một nguồn tên lệnh (bảng COMMAND-NAMES, bảng ⊆ vật thật, điểm bàn giao ⊆ bảng) + TRỪ ba cờ nhiễu trên thẻ + bốn sửa đúng từ finding B/C (`lenh-in-ra-phai-bam-duoc`)
- Ba tài liệu đầu-tay (QUICKSTART · README · GUIDE) vào vũ trụ quét lệnh — 52 token trần đổi sang dạng bấm được, cùng bảng COMMAND-NAMES và cùng ca LB2 (`lenh-tran-tai-lieu-dau-tay`)
- Lớp bằng chứng nhìn-thấy — hợp đồng có mặt người nhìn phải có ≥1 eval ui-check (`layer: ui-observed`); răng W8 ba tầng (lint · thẻ · pre-merge NOTE), một nguồn cho surfaces, đường bỏ có tên (`lop-bang-chung-nhin-thay`)
- Lưu kho harness Codex và khai tử nghi lễ design-loop — chỉ TRỪ, có mốc git để đảo và 2 ADR (`luu-kho-codex-va-nghi-le-design`) — đã giao — đã nghỉ, giữ sử liệu
- Mã sổ quyết định duy nhất — khuôn mã d-<UTC>-<n> ở bên ghi, khoá overlay theo dòng ở bên đọc để thẻ không lặp một câu dịch lên mọi dòng chung mã (`ma-so-quyet-dinh-duy-nhat`)
- lớp lỗi đo-lường thành luật ở 2 điểm cắm: gap-probe S1 (7 câu đối chiếu chéo) + review lens measurement S4 (6 hình dạng, một chỗ, mutation-covered); không nới finder cũ (`matrix-measure-law`)
- Khuôn khai sinh phép đo — mọi phép đo mới phải tự chứng minh biết báo đỏ (đối chứng dương xanh + phá-vật-thật đổi kết luận + thông điệp ghim) ngay lúc viết, trước khi được tính là xong (`measure-birth-certificate`)
- Trả răng cho năm phép đo đã bị ghi là mất răng — chúng phải phân biệt được bản đúng với bản hỏng, và có một chốt canh để lần sau không lặp lại (`measure-teeth-cleanup`)
- Đường nền chạy lệnh bằng môi trường của người gọi — tra công cụ và chạy suite qua MỘT cửa `bash -c` + môi trường người gọi, không qua shell đăng nhập nạp lại profile; công cụ vắng thật vẫn đỏ gọi đúng tên khoá ở cả hai chân (`nen-chay-bang-moi-truong-nguoi-goi`)
- Chân công cụ của đường nền đọc đúng lệnh chỉ-gán mang lệnh con — `B=$(git merge-base …) && …` tra `git`, không tra `merge-base`; lệnh con của một chương trình không bị coi là chương trình riêng; lệnh mở đầu bằng tên chương trình thật sự vắng vẫn đỏ gọi đúng tên (`nen-cong-cu-gan-bang-lenh-con`)
- Chân công cụ của đường nền thôi báo động giả cho executor dựng đường bằng cú pháp shell — token đầu không phải tên chương trình thì không tra tên, và nói ra khoá nào không được tra; lệnh mở đầu bằng một tên thật vẫn bị tra như cũ kể cả khi phần sau có ống dẫn (`nen-cong-cu-lenh-shell`)
- Sổ luật-đã-chạy — `clean` phải được chứng minh, không phải mặc định (`premerge-rules-ledger`)
- Chặn PASS chưa ai phán ở biên merge (chữ ký giữ-chỗ + slug tự khai phát hành không được tàng hình) (`premerge-unjudged-pass`)
- Phát hành kit 2.0.0 — gom 1c + đợt 2 «người về biên» về một mốc release để repo tiêu thụ nhận engine mới có chủ đích trước đợt 3 (`release-2-0-0`) — đã chấm bởi thực tế
- Phát hành kit 2.10.0 — đóng số cho cửa sổ 2.9→2.10 (PR 157 glob-hai-sao · 159 duong-lui-phai-song · 163 vòng T3 gom đúc kết 08/09), để repo tiêu thụ nhận bộ máy theo mốc có chủ đích (`release-2-10-0`)
- Phát hành kit 2.11.0 — đóng số cho cửa sổ 2.10→2.11 và VÁ TRONG MỐC lỗ xanh-giả của bộ giải cấu hình (nháy không cân làm hỏng chuỗi lệnh, bash trả 2, luật expected_exit đọc 2 thành giới hạn đã khai) (`release-2-11-0`)
- Phát hành kit 2.12.0 — đóng số cho cửa sổ 2.11→2.12, THUẦN CẮT SỐ. Năm vòng đóng trong cửa sổ đưa 182 tiêu chí tới ba kho tiêu thụ và đóng cửa veto sau chữ ký. (`release-2-12-0`)
- Phát hành kit 2.13.0 — đóng số cho cửa sổ 2.12→2.13, cắt số HAI gói có đổi cộng đúng MỘT nhát vá (P93 quét cây nguồn), và là mốc đầu tiên đếm đủ NĂM dòng số. (`release-2-13-0`)
- Phát hành kit 2.14.0 — cắt số cho hai gói kit và định đoạt công khai chiến dịch ghim lại đang hoãn mốc thứ hai. Hạ về draft 15/09 chờ PR (`release-2-14-0`) — đã giao — đã nghỉ, giữ sử liệu
- Phát hành kit 2.15.0 — cắt số cho hai gói kit sau cửa sổ chạy dưới R (0 vòng meta mới, một vòng sản phẩm thật ở OneFlow), khai MỘT vòng meta đã ký trước R, mang tiêu chí cho ba việc meta đã vào cửa sổ qua chip mà owner đếm là vá-trong-mốc, sửa khuôn /goal để hook nhận hai lần dừng hợp lệ, cộng hạt giống «vòng meta đang mở trong cửa sổ» trên thẻ mở phiên của kho kit (`release-2-15-0`) — đã giao — đã nghỉ, giữ sử liệu
- Phát hành kit 2.16.0 — cắt số cho hai gói kit sau cửa sổ một ngày có ĐÚNG MỘT vòng meta đã ký (thuoc-co-cua, T3), mang năm dòng số của vòng ấy đếm từ vật trong kho, và chạy chiến dịch ghim lại theo mốc mà hai cửa sổ trước đã hoãn (`release-2-16-0`) — đã giao — đã nghỉ, giữ sử liệu
- Phát hành kit 2.17.0 — đóng số cho cửa sổ 2.16 → 2.17 (một vòng chạm engine đã ký «ho-so-nghi» + bản vá «nen-cong-cu-lenh-shell»), để ba kho tiêu thụ đang chờ nhận engine mới theo mốc có chủ đích; làn V, không dựng răng (`release-2-17-0`) — đã giao — đã nghỉ, giữ sử liệu
- Phát hành kit 2.18.0 — đóng số cho cửa sổ 2.17 → 2.18 (hai vòng chạm engine đã ký «ghim-lai-noi-ra-o-khong-do» + «nhan-trang-thai-va-reality»), để kho crm — đang chờ đúng ba thứ bản này mang tới — nhận engine theo mốc có chủ đích; làn V, không dựng răng (`release-2-18-0`) — đã giao — đã nghỉ, giữ sử liệu
- Phát hành kit 2.18.1 — đóng số cho cửa sổ 2.18.0 → 2.18.1 (một vòng chạm engine đã ký «ho-so-khep-thoi-hoi»), để kho crm — nơi mọi lỗ của bản này lộ ra trong ngày cài 2.18.0 — nhận engine theo mốc có chủ đích; làn V, không dựng răng (`release-2-18-1`)
- Phát hành kit 2.18.2 — đóng số cho cửa sổ 2.18.1 → 2.18.2 (một vòng chạm engine đã ký «chot-may-chu-ky-sau-synthesize») và đường CI mặc định «chạy cổng từ bản kit ghim sha», để sáu kho vừa nâng 2.18.1 nhận engine theo mốc có chủ đích và ghim được theo tag; làn V, không dựng răng (`release-2-18-2`)
- Phát hành kit 2.18.3 — đóng số cho cửa sổ 2.18.2 → 2.18.3 (một vòng chạm engine đã ký «ha-tang-khong-dot-luot»), để crm nhận engine theo mốc có chủ đích và ghim được theo tag; làn V, không dựng răng (`release-2-18-3`)
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
- «/start» là bảng điều khiển của owner, không phải bộ định tuyến — hiện hết ý đang cân nhắc, nêu tên việc máy vừa làm và thứ còn veto được, và mọi bộ đọc nói cùng một chữ (`start-bang-dieu-khien`)
- Hồ sơ có bằng chứng nhưng status chưa arm cổng không được tàng hình — pre-merge thôi `continue` im lặng ở draft/approved khi đã có evidence-report.md hoặc PR đổi code chịu cổng; giữ đường đọc-cũ cho hồ sơ không có bằng chứng (`status-chua-arm-cong`)
- Vòng lặp biết tự nhận ra khi cách sửa sai khuôn — vòng thứ hai còn sinh lỗi cùng loại thì dừng và hỏi người, thay vì chạy tiếp vòng ba rồi hỏng cùng kiểu (`stop-patching-law`)
- Lệnh suite phải sinh dòng sổ chạy — không thì mọi vòng đỏ đối chiếu sau khi ký (`suite-run-log-provenance`)
- Tách phạm vi răng T1-escape khỏi phạm vi diff (cờ opt-out + thứ tự bump version) (`t1-escape-event-scope`)
- Thước có cửa — đổi thước trong vòng có tên, có đếm, có trần như «Ngoài hợp đồng» đã có; thêm trục đỉnh-có-sẵn ở S0 (vật trước vòng · tiền đề tách khỏi tiêu chí) để giá trị mới trên vật có sẵn không thành vòng sửa thước mặc áo hợp đồng vật (`thuoc-co-cua`) — đã giao — đã nghỉ, giữ sử liệu
- Hai thước tự khai một đằng đo một nẻo — răng lane có chiều đỏ sống trên cây hôm nay, và P86 so quan hệ ngân sách thay vì hỏi chữ số có mặt (`thuoc-khai-mot-dang-do-mot-neo`) — đã giao — đã nghỉ, giữ sử liệu
- Thước nhãn-đè-khối cho diagram-design (`thuoc-nhan-de-khoi`)
- Luật «lệnh bị công cụ ngắt ≠ lệnh fail» thành MỘT nguồn ở acceptance-gate cho cả đường vòng lặp (workflow nhận qua args) lẫn đường VERIFY độc lập của skill acceptance; đóng bộ đo hành vi bên viết bằng hội đồng phiên sạch (`tool-kill-duong-doc-lap`)
- Vào có ô, ra có tên — ý khai thác xong có ô máy đọc (stub opportunity.md), bộ quét /start tách «đang cân nhắc» khỏi «chờ Cổng Đáng» theo ngưỡng đã điền, thẻ nói số ý và tuổi; 7 hạt giống kit nhận ô, trạng thái sống một chỗ (`vao-co-o-ra-co-ten`)
- Đợt 2 «người về biên» — trạng thái veto-có-dấu-vết cho Cổng Phạm vi T2 và Cổng Bằng chứng xanh-sạch thôi mời ký; sửa đồng bộ ba tầng luật-văn-bản + hook chặn-lúc-ghi + lưới trước-merge (`veto-co-dau-vet`) — đã giao — đã nghỉ, giữ sử liệu
- Gom luật đọc hồ sơ xưởng về một chỗ — mọi bên đọc phải cho cùng một kết luận (`workspace-reader-unification`) · liên quan: product-map-uat-session

## Đã nghiệm thu giá trị

- Hồ sơ đã khép (chấm bởi thực tế · đã nghỉ) thôi bị đối xử như đang mở — bộ đếm cửa veto, thẻ, làn V đọc đủ nguồn — và lớp CI vendored chép đủ bao đóng nạp; để kho tiêu thụ cài 2.18.1 không phải tự vá một tệp nào (`ho-so-khep-thoi-hoi`) — lặp thêm (iterate)
- Thẻ Cổng Bằng chứng gọi đúng tên cạnh gãy (đỏ-bàn-đo ≠ đỏ-vật, hệ thống chết) và mở ô ký kèm giá; reality có quyền đóng hồ sơ bằng thao tác cổng người thứ bảy; test của kho thôi bị đếm là thước — để ba hồ sơ ở crm đóng được hoặc chấm được mà không dựng thêm một dòng thước nào (`nhan-trang-thai-va-reality`) — giao rộng (release)
- Nhánh chính không tên main — phép dò phải dò được, không chết ở tên đầu (`nhanh-chinh-khong-ten-main`) — giao rộng (release)

## Xếp lại sau

- Ba chỗ tích luỹ không có đường ra — khoá config · dòng file kiểm · con số suite (`ba-cho-tich-luy-khong-duong-ra`)
- Mã 127 ở làn đối chứng là tín hiệu phân biệt, không phải hạ tầng hỏng (`baseline-127-tin-hieu-phan-biet`)
- Bất biến sản phẩm — PRODUCT-INVARIANTS.md ở gốc repo tiêu thụ, luật sản phẩm nạp lúc viết đặc tả, thứ khó-đảo tự nổi lên thẻ như mục người (`bat-bien-san-pham`)
- Bộ giải evals.yaml nuốt chú thích YAML trên `status: not-run` — lời khai của tác giả bị bỏ lặng (`bo-giai-nuot-chu-thich-yaml`)
- Lời khai không mạnh hơn vật — chiều đỏ phải có mũi tiêm THẬT và bản tiêm phải CHẠY; quét theo LỚP, không vá ca bị nêu tên (`chieu-do-xanh-vi-ban-tiem-sap`)
- Danh sách chép CI của acceptance-init dặn repo tiêu thụ chạy product-map --check nhưng không chép product-map lẫn đồ nó kéo theo — CI của consumer đỏ ngay khi kit dùng khuôn ô cơ hội (`danh-sach-chep-ci-thieu-product-map`)
- Thẻ Cổng 2 in nút bằng tiếng Việt nhưng chỉ đọc được từ khoá tiếng Anh trong «Đề xuất:» — người viết đúng chữ trên nút thì thẻ báo không đọc được (`de-xuat-tieng-viet-khong-doc-duoc`)
- Eval gọi máy chủ qua mạng có thể đo NHẦM CÂY mà vẫn xanh — kit chưa có lưới nào nhìn thấy; đề xuất một lời khai cấp eval (tree_pin) kèm cờ vàng và dòng đếm trên thẻ (`eval-khai-chot-cay`)
- evals.yaml khai chiều đỏ mà tệp ca không có mũi tiêm nào — lời khai không có vật (`evals-khai-chieu-do-khong-co-vat`)
- Bộ đọc frontmatter cắt phần sau « (`frontmatter-thang-mot-ky-hieu`)
- Nghi thức hình áp cho MỌI cổng dừng-chờ-người — không riêng Cổng Phạm vi; mở nguồn kê sang vật của vòng nghiệm thu và điểm dừng-vá (`hinh-o-moi-cong-dung-cho-nguoi`)
- Khuôn răng dùng chung — bộ đo của hồ sơ không được tự dối theo cùng ba hình dạng (`khuon-rang-dung-chung`)
- Mọi liệt kê trong hợp đồng phải máy-đọc (`liet-ke-may-doc`)
- Luật lái máy đổi thì phải được kiểm hồi quy như code — hook cấm nới thước lúc chữa mã, vật-hoá thứ tự ghi run-log, ADR làn V và tách nhiệm vụ (`luat-lai-may-duoc-hoi-quy`)
- Marker descope của các nghi thức bỏ-được có bộ đọc ở lib và cặp cờ trên thẻ Cổng Phạm vi, thay vì chỉ có đầu viết trong SKILL (`marker-descope-khong-co-bo-doc`)
- Một khuôn cho bên VIẾT và bên ĐỌC — bốn chỗ nối đang trôi khỏi nhau vì mỗi bên tự rút khuôn, và test tự dựng đồ giả đúng khuôn bên đọc (`mot-khuon-cho-ben-viet-va-ben-doc`)
- Tải gửi cho trạm phân loại phạm vi dựng từ MỘT nguồn, bỏ cơ chế ghép đòi hai bản giống nhau từng byte (`mot-nguon-tai-gui-triage`)
- usage-report về MỘT nguồn — khuôn tiêu đề do bên VIẾT và bên ĐỌC cùng rút, để hai dòng máy-đo của luật (c) thôi hỏng lặng (`mot-nguon-usage-report`)
- Ngày «việc vừa xong» lấy sai nấc cho hồ sơ đã qua phiên nghiệm thu — vòng đóng hôm nay bị đóng dấu bảy tháng tuổi và rơi khỏi thẻ (`ngay-viec-vua-xong-lay-sai-nac`)
- Ô chỉ được mở khi có neo ngoài — một hồ sơ cụ thể ở một kho đang chạy kit gọi tên nó; ba nghi thức đang tự đẻ ô (chỗ-cắt-của-mốc · mở-hợp-đồng-mới-tại-cổng · hạt-giống-phải-có-ô) thôi đẻ (`o-chi-mo-khi-co-neo-ngoai`)
- T1 tuyên-kèm-căn-cứ — máy tuyên T1 với bảng căn cứ, không dừng hỏi (`t1-tuyen-kem-can-cu`)
- Thẻ Cổng 2 không có làn nào cho lỗi TRONG hợp đồng chưa sửa — nó im lặng, và thẻ vẫn ghi "Bằng chứng đầy đủ" (`the-cong-2-giau-loi-trong-hop-dong`)
- Thẻ Cổng Phạm vi phải nói đúng «hệ thống sẽ làm gì» — hôm nay nó xếp tiêu chí bằng cách dò chữ «không» trong vế Then, nên hồ sơ càng viết đúng luật khai-chiều-đỏ càng bị đọc thành «hệ thống không làm gì» (`the-xep-nham-o-se-lam`)
- Việc kế theo plan và hạt giống — kit đọc ý định của repo, không giữ, không sửa (`viec-ke-theo-plan`)
- Luật xanh-sạch đọc mục «Ngoài hợp đồng» của BÁO CÁO, không đọc làn phản biện — hồ sơ có 13 phát hiện vẫn qua như sạch (`xanh-sach-doc-nham-mat`)

## Đã bác từ khám phá

- Bản đồ dính commit chữ ký, không đi sau (`ban-do-dinh-chu-ky`)
- Vị từ bỏ qua phải THẤY định nghĩa phép đo — _acceptance/config.yaml và evals.yaml là ĐẦU VÀO của làn, không phải vật hồ sơ (`bo-qua-phai-thay-dinh-nghia-phep-do`) — đã đóng có hồ sơ
- Bậc 3 của lái-thử cho bề mặt AGENT — bản tham chiếu `vlm-assert` chỉ phục vụ frame UI, ván agent không có con mắt thứ hai (`con-mat-thu-hai-lai-thu`)
- Dọn tồn kho PR — danh sách PR mở phải nói đúng việc đang chạy, không phải kho hàng cũ (`don-ton-kho-pr`)
- Hỏi-theo-mặt-phẳng — câu hỏi là thứ người bấm được, không phải khuôn chữ (`hoi-theo-mat-phang`)
- Khuôn ghi sổ quyết định tự tính cả trường `at` — người/máy chỉ điền phần chữ, mọi trường thời gian do shell sinh (`khuon-so-tu-tinh-at`)
- Bật đường ghi cho ô kết «máy đã thông» của làn V (`lan-may-thong-duong-ghi`) — đã đóng có hồ sơ
- Làn máy thoát phép kiểm bằng-chứng-cũ ở cổng trước-merge (`lan-v-thoat-kiem-stale`) — đã đóng có hồ sơ
- Ba hồ sơ đã ký còn nợ khoá `executors.script.mirror_sync` đã gỡ — nợ cuối cùng của corpus sau ADR 0014/0015, chờ một lối ra có tên (`no-mirror-sync-ba-ho-so`)
- Thước sống theo đời model — bằng chứng ghi model sinh ra nó, cờ «cũ theo model», cờ nhạt có việc kế, hình dạng lỗi đo-lường thứ 7 «thước bị nới sau khi đã đỏ» (`thuoc-song-theo-doi-model`)
- Dòng bậc-3 của lái-thử khai `vlm-assert` là "đã ship" trong khi nó là bản tham chiếu phải nhận nuôi (`vlm-assert-khai-nhan-nuoi`)

## Ngoài phạm vi đã ký

- Bốn kho cắt token cho Claude Code — BÁC 15/09/2026 (`.out-of-scope/bon-kho-cat-token-rtk-headroom-ponytail-caveman.md`)
- Bảy đề xuất từ «The AI-Native SDLC playbook» — BÁC 07/09 (`.out-of-scope/doi-chieu-playbook-ai-native.md`)
- Cưỡng chế gap-probe ở write-time (hook PreToolUse) — ĐÃ TỪ CHỐI (`.out-of-scope/gap-probe-write-time-hook.md`)
- Siết răng T1-escape: chỉ `_acceptance/<slug>/` THẬT mới bảo lãnh cho PR — ĐÃ TỪ CHỐI (`.out-of-scope/t1-escape-slug-only-thu-hep-mien-tru.md`)
- Miễn trừ `.github/**` và `.claude-plugin/plugin.json` khỏi `t1_skip_globs` — ĐÃ TỪ CHỐI (`.out-of-scope/t1-skip-globs-github-and-manifests.md`)
- Đo-thước-của-thước sâu hơn MỘT tầng — PARK 30/08 («cắt đuôi, giữ lõi») (`.out-of-scope/thuoc-cua-thuoc-mot-tang.md`)
- Thước sống theo đời model — BÁC 16/09/2026 (`.out-of-scope/thuoc-song-theo-doi-model.md`)
