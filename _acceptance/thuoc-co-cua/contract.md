---
schema_version: 1
feature: Thước có cửa — đổi thước trong vòng có tên, có đếm, có trần như «Ngoài hợp đồng» đã có; thêm trục đỉnh-có-sẵn ở S0 (vật trước vòng · tiền đề tách khỏi tiêu chí) để giá trị mới trên vật có sẵn không thành vòng sửa thước mặc áo hợp đồng vật
slug: thuoc-co-cua
owner: phanlemanh@gmail.com
risk_tier: T3      # chạm lib/ (nguồn not-run dùng chung, bộ đọc mã thoát đã khai) — lõi cưỡng chế
surfaces: [cli]
status: draft            # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by:
approved_at:
design_doc: docs/superpowers/specs/2026-09-17-thuoc-co-cua-design.md
---

# Acceptance Contract: thuoc-co-cua

## Context

Vòng meta DUY NHẤT của cửa sổ 2.15 → 2.16 (owner Q1 17/09; Cổng Đáng ký build 17/09). Kit canh
vật và lời, hụt thước: sửa thước không có tên, không được đếm, không có trần; và không bước nào
kiểm hạ tầng đo trước khi chấm, nên tường lộ ở S4 — R1: 2/3 lượt chấm bị hạ tầng chặn, 4/8 câu
gọi người là hạ tầng; crm: 9 chỗ hỏng thước so 1 chỗ hỏng vật, 701 dòng thước so 20 dòng vật.
Vòng làm hai câu và một cửa — đứng được trước khi chấm · chạy không đè nhau · cửa cho thước —
cộng ba lỗi đúng/sai owner phê 17/09 làm nhát mở đầu. Người hưởng: máy ở mọi lượt chấm (thôi
đốt lượt vì hạ tầng và vì suite đè nhau), owner (câu hạ tầng gom một lần vào gói Cổng Phạm vi;
số vật/thước đọc được trong một dòng ở Cổng Bằng chứng), người dùng kit ở repo tiêu thụ.

Phạm vi owner chốt gồm 21 tiêu chí; khuôn hợp đồng trần 15. Hợp đồng này đi đúng thứ tự ưu tiên
owner giao (A → đường nền hạ tầng → lệnh suite tuần tự → D → phần còn lại của B, C) và CẮT SAU
D. Phần đuôi có tên ở «Out of scope»; owner kéo lại được ở Cổng Phạm vi.

Source input: `_acceptance/thuoc-co-cua/opportunity.md` · `docs/findings/2026-09-17-ra-ha-tang-23-lop.md` · hồ sơ mốc `_acceptance/release-2-15-0/contract.md` Notes §3 §4

## Vật trước vòng

- Ở nhánh gốc: không — không tệp nào của vòng tồn tại ở `c5f6e1f8` (`feature-loop/scripts/duong-nen.mjs`, `feature-loop/scripts/thuoc-vat.mjs`, `feature-loop/scripts/lib/phan-loai.mjs` đều vắng; `s4-args.mjs` dòng 113 chưa đọc trường `status`; `gate-card.js` dòng 786 còn so cứng mã 0).
- Ở prod: không áp dụng — kit giao qua bản phát hành tới repo tiêu thụ.
- Giá trị mới tới người dùng: toàn bộ; không phần nào của vòng là chấm lại vật đã giao.

## Tiền đề

Viết tay — vòng tự áp thuốc của mình trước khi khuôn có mục này. Mỗi dòng là điều phải ĐỨNG
ĐƯỢC trước mỗi lượt chấm; không phải tiêu chí.

- TD-1: `node` ≥ 20, `bash`, `git` có trên máy — kiểm: đường nền chân công cụ (17/09: đứng).
- TD-2: bốn suite và bản đồ sản phẩm xanh trên cây chưa đụng, cây sạch sau suite — kiểm: đường nền chân suite (17/09 tại `c5f6e1f8`: 5/5 mã 0, 0 dòng bẩn).
- TD-3: lưới trước-merge chạy như CI không có vi phạm có sẵn — kiểm: đường nền chân lưới (17/09: 0 vi phạm).
- TD-4: máy chấm bằng CÂY của vòng, không bằng plugin cache — kho kit tự host, bộ sinh args luôn nhận gốc engine là gốc kho; kiểm: đường nền chân engine in tự-host. Lệch giữa cây và plugin cache 2.15.0 sau S3 là CHỦ Ý của vòng, không phải tiền đề đỏ (17/09 trước khi vòng viết gì: 9/9 khớp).
- TD-5: không tiến trình nặng thứ hai trên máy trong lúc chấm (suite plugins và scripts mỗi cái gần 7 phút) — kiểm: máy hỏi danh sách tiến trình trước khi dispatch lượt chấm.

## Criteria

- AC-1: Given một hồ sơ có eval `test` hoặc `script` tự khai `status: not-run`, When máy sinh tệp args cho lượt chấm, Then eval đó KHÔNG nằm trong danh sách được thi hành, tệp args gọi tên nó ở khoá `evalsNotRun`, báo cáo của lượt nói ra nó bằng MỘT dòng và không mang khối mã thoát nào cho nó; tập id bị loại rút từ CÙNG hàm trong `lib/` mà làn ghim lại và bên đọc pin đang dùng; hồ sơ không khai ô nào thì khoá ấy vắng hẳn và lượt chấm y như trước.
- AC-2: Given một báo cáo có eval máy trả ĐÚNG mã khác 0 mà `evals.yaml` đã khai ở `expected_exit`, When dựng thẻ Cổng Bằng chứng, Then thẻ coi bằng chứng máy là đủ trường và số eval «chưa đạt» trên thẻ không tính nó; eval trả mã KHÁC mã đã khai vẫn bị cờ; eval thiếu trường thật vẫn bị cờ như trước; mã đã khai lấy từ bộ đọc `expectedExits` của `lib/eval-yaml.cjs`, không phải bản chép.
- AC-3: Given một cây chỉ đổi ở tệp ĐỊNH NGHĨA phép đo so với pin — một giá trị `executors` trong `_acceptance/config.yaml`, hoặc `evals.yaml` của hồ sơ — When làn ghim lại chạy với cờ bỏ-qua-khi-không-đổi, Then làn KHÔNG bỏ qua: nó chạy trọn bằng lệnh MỚI và gọi tên tệp định nghĩa; còn bốn ô im của ca SK1b (báo cáo bằng chứng sâu hai tầng · hồ sơ trong monorepo · tệp miễn trừ T1 · thư mục tiền tố giả) giữ nguyên là bỏ qua.
- AC-4: Given bộ vị ngữ bỏ-qua của làn ghim lại, When nguồn định nghĩa phép đo nằm ở một trong BA đường hợp lệ ngoài ca mặc định — gốc kho là thư mục con của một kho git lớn hơn · lượt ghim nhiều slug và tệp đổi là `evals.yaml` của slug THỨ HAI · slug có tên chứa đúng chuỗi tên của một slug khác — Then vị ngữ vẫn thấy nó ở CẢ BA, vì tập tệp định nghĩa được SUY từ cái làn thật sự đọc (đường config mà bộ giải khoá dùng, `evals.yaml` của từng slug trong lượt), không phải từ chuỗi đường dẫn gõ tay.
- AC-5: Given hai giới hạn còn lại của vị ngữ bỏ-qua (tệp chưa theo dõi vô hình với git diff · bash và JS lệch nhau ở mẫu một-tầng), When đọc ADR 0019, Then mỗi giới hạn được khai kèm một ngưỡng đang đếm; gỡ một lời khai thì phép đo đỏ, thêm lời khai thứ ba cùng khuôn hay sửa văn thì phép đo im.
- AC-6: Given một repo đã khai `executors` và `feature_loop.suite_keys`, When chạy script đường nền hạ tầng ở đầu S1 trên cây chưa đụng, Then script — không LLM — kiểm từ đầu của mọi lệnh executor có trên máy, chạy các lệnh suite đúng một lần và TUẦN TỰ — mỗi suite một tiến trình con riêng, script chạy nền nên không lời gọi công cụ nào phải ôm trọn thời gian của nó — rồi kiểm cây không bẩn thêm, và ghi kết quả vào `duong-nen.md` của hồ sơ; cây lành cho nền xanh và mã 0; gỡ một công cụ, một suite đỏ sẵn, hay một suite ghi vào cây thì chân tương ứng đỏ và gọi đúng tên thứ hỏng; không chạy được (thiếu config, không phải kho git) thì mã 2 và KHÔNG ghi tệp.
- AC-7: Given cùng script đó, When nhánh gốc đang nợ vi phạm của lưới trước-merge, hoặc bản engine vendored của repo lệch bản đang chạy, Then chân lưới chạy lưới đúng như CI — có base là nhánh gốc, KHÔNG thu phạm vi theo slug — và in nguyên văn từng vi phạm dưới nhãn «có sẵn»; chân engine băm chín tệp của danh sách chép CI (đọc từ marker, không chép tay) ở bản vendored · bản plugin cache · bản đang chạy và gọi tên tệp lệch; vị trí plugin cache nhận qua cờ nên phép đo tự dựng được bản cache của nó, máy KHÔNG có cache thì vế so ấy ghi bỏ-qua chứ không đỏ; repo không nợ, engine khớp hoặc kho tự host thì hai chân im.
- AC-8: Given một hồ sơ draft, When dựng thẻ Cổng Phạm vi, Then thẻ in khối «Nền hạ tầng» từ `duong-nen.md` — bốn chân bằng số và từng dòng đỏ; nền đỏ thì kèm cờ nói rõ đỏ ở đây không phải lỗi của vòng; hồ sơ KHÔNG có tệp ấy thì thẻ vẫn dựng được, chỉ thêm MỘT cờ vàng nói đúng cả hai khả năng — hồ sơ sinh trước bản này, hoặc đường nền chưa chạy xong — không chặn; khuôn của tệp, kể cả khuôn DÒNG ĐỎ, đặt một chỗ có marker và ca round-trip lấy tệp do chính bên viết ghi, xanh lẫn đỏ, rồi đọc bằng bên đọc.
- AC-9: Given một lượt chấm có từ hai lệnh suite trở lên, When khối lệnh máy của workflow dispatch, Then không hai lệnh suite nào chạy chồng nhau — lệnh sau chỉ bắt đầu khi lệnh trước đã trả kết quả — kể cả khi lệnh suite ấy ĐỒNG THỜI là lệnh của một eval (tư cách suite xét theo danh sách lệnh suite của args, không theo việc lệnh có eval đi kèm hay không), trong khi lệnh eval không thuộc danh sách suite vẫn chạy song song; kế hoạch chạy khô in hai nhóm song-song và tuần-tự; cùng bộ kết quả lệnh thì phán quyết của lượt giống hệt trước khi đổi; khôi phục mảng phẳng trong bản sao thì ca đỏ với thông điệp ghim.
- AC-10: Given một đường dẫn bất kỳ trong diff của vòng, When hỏi bộ phân loại, Then nó trả đúng MỘT trong bốn lớp — ngoài · thước · hồ sơ · vật, xét theo đúng thứ tự ấy — từ MỘT module mà `s4-args.mjs` cũng dùng cho vùng vật; tệp máy ghi của hồ sơ (run-log, sổ quyết định, tệp args, thư mục bằng chứng, thẻ, hình, tệp đường nền, báo cáo dùng token) là HỒ SƠ chứ không phải thước, và tệp máy sinh nằm trong danh sách miễn trừ T1 là NGOÀI dù nó nằm dưới thư mục ca; trong hồ sơ chỉ `evals.yaml`, thư mục răng và tệp script đo là thước; ma trận viết-trước phủ mọi vế của từng lớp, gồm đích danh các tệp máy ghi ấy; các ca vùng vật và đột biến vùng vật hiện có giữ nguyên màu, tức làn tìm-lỗi vẫn KHÔNG nhận hồ sơ.
- AC-11: Given một hồ sơ đã có commit đưa hợp đồng sang `implemented`, When chạy bộ đếm, Then nó in dòng vật cộng/trừ · thước cộng/trừ · số nhát sửa thước, trong đó nhát là commit SAU mốc sàn chạm đường thước mà KHÔNG chạm đường vật nào; commit chạm cả vật lẫn thước — nhát sửa vật kèm ca hồi quy, đúng lệ kit — đếm riêng ở ô «lẫn» và không tính vào trần; commit chỉ ghi hồ sơ (run-log, sổ) không bao giờ là nhát; commit thước ở S3 — trước mốc sàn — KHÔNG bị đếm; hồ sơ chưa từng `implemented` thì đếm 0 kèm ghi chú chưa có mốc sàn; cờ giữa-hai-lượt liệt kê tệp thước đổi giữa hai lượt chấm liền nhau theo sha của run-log, sha không thuần nhất thì nói thẳng là không liệt kê được thay vì đoán.
- AC-12: Given bộ đếm báo từ 3 nhát sửa thước trở lên ở `implemented`, When máy sinh args cho lượt chấm kế, Then script TỪ CHỐI sinh tệp — không có tệp args thì không dispatch được — với thông điệp ghim nêu số nhát và ba lối: khai giới hạn có tên · đổi cách đo · mở vòng có chủ ngữ là thước, lối ba in sẵn đúng một dòng lệnh; dưới 3 nhát, hoặc sau mốc sàn chỉ có commit ghi hồ sơ và commit lẫn, thì script im và sinh args như cũ; sau khi sổ quyết định có dòng mở đầu bằng «trần thước — » được commit thì mốc sàn dời tới đó và script lại sinh args.
- AC-13: Given run-log của hồ sơ có dòng đếm vật/thước do bộ đếm ghi, When dựng thẻ Cổng Bằng chứng, Then khối phán quyết đối kháng có đúng MỘT dòng vật · thước · nhát đọc từ dòng ấy; run-log không có dòng ấy thì thẻ không in gì thêm và bản ghi mốc định tuyến của các hồ sơ đã ký không đổi; khuôn dòng sổ quyết định nhận ô `target` tuỳ chọn đứng sau `impact`, và dòng có hay không có ô ấy đều đọc được bởi mọi bộ đọc sổ hiện có.
- AC-14: Given toàn bộ thay đổi của vòng, When chạy bốn suite và phép kiểm bản đồ sản phẩm, Then cả năm thoát mã 0.
- AC-15: Given hồ sơ của vòng, When người duyệt đọc Notes và thiết kế, Then thấy đủ: bảng dự báo năm dòng kèm chiều, điều kiện tin cậy nói rõ vì sao đường verdict không đổi thành phần, danh sách CỘNG đích danh kèm nguyên tố và người hưởng, phần đuôi có tên, và điều bất lợi nói thẳng (phút máy mỗi lượt chấm TĂNG; lần dừng ở trần là một lượt gọi người ngoài thiết kế). (judgment)

## Coverage

- Bỏ coverage-scan — không gian tiêu chí đã được quét và chốt ngoài vòng: bảng 23 lớp hạ tầng (`docs/findings/2026-09-17-ra-ha-tang-23-lop.md`) xếp ba ngăn, owner gật 17/09; vòng nhận nguyên ngăn một và ngăn hai, không tự thêm bớt (sổ quyết định, dòng 1).
- Trục dùng để soát bộ tiêu chí: phần (A · đường nền · suite tuần tự · D) × chiều (đỏ · im) × đọc-cũ (hồ sơ và args đời trước) [thước CE: mỗi AC có vế đỏ, vế im và vế đọc-cũ khi nó đổi một khuôn máy-đọc — AC-1, AC-8, AC-13 mang vế đọc-cũ].

## Đường đo

- Thước: tường bị bắt TRƯỚC Cổng Phạm vi · số từ: `duong-nen.md` của hồ sơ vòng sản phẩm kế (bốn chân, dòng đỏ) và khối «Nền hạ tầng» trên thẻ · bảo đảm bởi: AC-6, AC-7, AC-8
- Thước: lượt chấm bị hạ tầng chặn và câu hỏi hạ tầng mỗi vòng · số từ: dòng `round-tally` của run-log (verdict BLOCKED) và dòng 2–3 của năm dòng số ở hồ sơ mốc kế · bảo đảm bởi: đã có sẵn: run-log và luật (c)
- Thước: sửa thước trong S4 hiện thành số ở Cổng Bằng chứng · số từ: dòng đếm vật/thước trong run-log và dòng trên thẻ · bảo đảm bởi: AC-11, AC-13
- Thước: số hồ sơ khai giới hạn theo luật chặt ở crm và oneflow sau một cửa sổ · số từ: phép đếm của finding truy nguyên §4 chạy lại ở mốc kế · bảo đảm bởi: đã có sẵn: lệnh đếm trong finding 16/09

## Out of scope

- PHẦN ĐUÔI của phạm vi owner chốt — sáu tiêu chí, cắt theo đúng thứ tự ưu tiên owner giao vì khuôn hợp đồng trần 15; owner kéo lại được ở Cổng Phạm vi: hai mục «Vật trước vòng» và «Tiền đề» trong KHUÔN hợp đồng · W9 theo sự thật git · W10 tiền đề trỏ mục đường đo không tồn tại · tiền đề kiểm lại trước MỖI lượt chấm và không dispatch khi còn tiền đề đỏ · khuôn giao diện đường đo cấp repo (cờ chạy, mã 2 từ chối đo, đặt/trả, DB của lượt, máy chủ tự xưng cây và SHA, kiểm sống trước mỗi eval) · khai tài nguyên theo eval và theo lệnh suite với bộ xếp hàng xuyên làn máy và làn ui.
- Đã gọi tên cho cửa sổ sau, KHÔNG làm: mã thoát đi qua lời khai của agent · tham số S4 bằng đường dẫn tệp · cây của lượt · tự thử lại khi agent nền chết · sàn thiết kế P0 giả trên nền tối · đích đo là bản triển khai · trạng thái nghỉ cho vòng · làn ui · router · hai ô ngủ `cong-chan-theo-ho-so-khong-theo-diff` và `premerge-nhu-ci-truoc-khi-mo-pr` · ô `rang-moc-neo-theo-ho-so`.
- Chế độ «brownfield» riêng trong kit; thêm cổng người hay lệnh cổng người mới (ADR 0002).
- Làn LLM nào soi diff thước hay soi hồ sơ — diff thước giữa hai lượt chấm do script liệt kê.
- Khoá config mới cho vùng vật hay cho lớp thước — bộ phân loại dùng đúng ba tập đã có.
- Dùng lại kết quả suite của đường nền làm nền cho S4; hứa chạy song song nhiều vòng.
- Tệp khoá trên đĩa cho tài nguyên; mọi thứ khoá theo repo.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

### Known limits

- Suite tuần tự chỉ chống suite-đè-suite. Lệnh suite vẫn chạy chồng lên lệnh eval, làn ui, hội đồng và làn tìm-lỗi; ca REJECT lượt 1 của mốc 2.15.0 (eval chiều-im đụng suite hooks) chỉ chữa trọn khi có «tài nguyên của lượt» ở phần đuôi. Ngưỡng đang đếm: từ 1 lượt chấm REJECT hoặc BLOCKED vì eval đè suite, ở bất kỳ repo nào giữa hai mốc.
- Bộ đếm nhát đếm COMMIT thuần thước. Gộp nhiều chỗ sửa thước vào một commit, hoặc kèm một dòng vật vào commit thước, qua mặt được số nhát; lớp hai là cờ giữa-hai-lượt liệt kê tệp và ô «lẫn» in cạnh, không phải một trần thứ hai.
- Số 3 của trần đọc theo thước «commit thuần thước sau mốc sàn», KHÔNG theo tiền tố dòng sổ. Cùng dữ liệu R1: theo tiền tố 3 · theo tệp chạm 5 · theo thước này 4. Phép thử rẻ của giả định 2 chạy 17/09 trên ba vòng đã ký gần nhất của kho kit có mốc sàn (release-2-15-0 · chu-ky-khong-tu-lam-hoa-cu · khoi-tim-loi-tra-phi-theo-vat): commit chạm thước TRƯỚC mốc sàn 4 · 2 · 9 — không bị đếm, giả định đứng; commit thuần thước SAU mốc sàn 2 · 3 · 4, commit lẫn 0 · 3 · 7. Tức trần 3 sẽ nổ ở 2 trên 3 vòng ấy — cả hai đều là vòng bốn lượt chấm có owner dừng giữa chừng. Ở kho kit ca kiểm vừa là thước vừa đi cùng vật, nên số này là cận trên cho repo sản phẩm.
- Đường nền chân công cụ chỉ hỏi sự CÓ MẶT của từ đầu lệnh; sai phiên bản (ca Python 3.9 của R1) chỉ lộ ở chân suite khi suite thật chạy.
- Lần dừng ở trần nhát sửa thước là một lượt gọi người NGOÀI thiết kế. Ngưỡng CHẾT ở Cổng Đáng viết «thêm lượt gọi người ngoài thiết kế»; lần dừng này thay cho chuỗi câu phạm-vi-đo rải rác (crm 4, R1 1) chứ không cộng thêm — owner đọc số ở vòng sản phẩm kế.
- Hồ sơ `bo-qua-phai-thay-dinh-nghia-phep-do` được cho nghỉ bằng ô `stage: archived` vì kit chưa có trạng thái nghỉ cho vòng; hợp đồng và evals gốc giữ trong thư mục sử liệu của nó.

### Dự báo năm dòng số — luật (c)

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 làm-xong → quyết-được | ↓ | ít lượt chấm bị hạ tầng chặn; tường lộ trước Cổng Phạm vi |
| 2 lượt gọi người | ↓ hạ tầng · ↑ tối đa 1 khi trần nổ | câu hạ tầng gom vào gói Cổng Phạm vi; trong thiết kế không đổi |
| 3 lượt chấm bị hạ tầng đốt | ↓ | ô khai không-chạy thôi bị thi hành · suite thôi đè nhau · công cụ thiếu lộ ở S1 |
| 4 token máy/vòng | ↓ theo số lượt bị đốt · = mỗi lượt | không chạm khối nào của S4; đường nền 0 token |
| 5 phút máy/lượt chấm | ↑ | đường găng làn máy thành TỔNG các suite thay vì suite dài nhất; cộng một lần chạy suite ở S1 |

Điều kiện tin cậy: (i) đường verdict — finder, bác bỏ trong hợp đồng, REJECT — KHÔNG đổi thành
phần: đường nền và trần chặn TRƯỚC lượt chấm; suite tuần tự đổi THỨ TỰ chạy chứ không đổi điều
được chấm; phần D chỉ ĐẾM. Riêng AC-1 bỏ khỏi lượt chấm đúng những ô hồ sơ đã tự khai
không-chạy — có răng cả hai chiều, và bên đọc pin đã theo luật này từ 2.12.0. (ii) Ngưỡng (a) đã
chạm ở mốc 2.15.0, nên dòng 4–5 của cửa sổ này không được cắt dựa trên số của vòng này.

### CỘNG — đích danh, owner phê từng ca ở Cổng Phạm vi (ADR 0018)

| # | Thứ được CỘNG | Nguyên tố | Người hưởng |
|---|---|---|---|
| C1 | Script đường nền hạ tầng ở S1 và tệp `duong-nen.md` trong hồ sơ (AC-6, AC-7) | 2 — bằng chứng không tự dối: đỏ của nền không được tính cho vật | máy ở S4; owner — câu hạ tầng gom một lần |
| C2 | Khối «Nền hạ tầng» trên thẻ Cổng Phạm vi (AC-8) | 3 — khoảnh khắc quyết thật, trên bằng chứng đọc trong một phút | owner |
| C3 | Lệnh suite chạy TUẦN TỰ làm mặc định mới của làn chấm; trường hai-nhóm trong kế hoạch chạy khô (AC-9) | 2 | máy — hết REJECT giả vì suite đè nhau |
| C4 | Khoá `evalsNotRun` trong tệp args và một dòng trong báo cáo (AC-1) | 2 | máy; người ký đọc được ô nào không đo |
| C5 | Module phân loại bốn lớp và script đếm vật/thước, gồm cờ giữa-hai-lượt (AC-10, AC-11) | 2 | máy; owner |
| C6 | Trần 3 nhát sửa thước ở `implemented`, máy giữ trong bộ sinh args, ba lối, van bằng dòng sổ (AC-12) | 3 — đánh đổi thật: vá tiếp, đổi cách đo hay mở vòng thước | owner |
| C7 | Dòng vật · thước · nhát trên thẻ Cổng Bằng chứng; dòng đếm trong run-log; ô `target` tuỳ chọn ở dòng sổ (AC-13) | 3 | owner |
| C8 | Hai mục từ vựng trong CONTEXT.md: «nhát» và «đường nền» | 1 — ý định chốt trước bằng chữ chuẩn | người viết kit |

AC-2 đến AC-5 là SỬA, không CỘNG.

### Vòng tự ăn thuốc

Đường nền chạy tay tại `c5f6e1f8` trước khi vòng viết tệp nào: 5/5 lệnh suite mã 0 (scripts 393
giây · hooks 2 · plugins 409 · workflows 2 · bản đồ dưới 1), 0 dòng bẩn sau suite, lưới như CI 0
vi phạm, engine 9/9 khớp. Một vết bẩn của chính phiên: máy sửa ô cơ hội khoảng một phút trong
lúc suite scripts đang chạy rồi trả nguyên trạng ngay; suite ấy xanh và cây sạch khi nó kết.
Mọi dòng sổ `fix` ở S4 của vòng mở đầu bằng «thước:» hoặc «vật:»; nhát «thước:» thứ ba thì dừng
ba lối dù bộ đếm máy chưa ship.

- Thước tự dối: không dán cụm hình glob vào văn hồ sơ; mọi mẫu ở đây nói bằng chữ.
