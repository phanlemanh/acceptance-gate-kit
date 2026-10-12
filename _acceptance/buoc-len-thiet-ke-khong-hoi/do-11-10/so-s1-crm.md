# Sổ S1 của crm — lựa chọn ghi «chủ kho chọn/chốt», máy xếp theo nguồn căn cứ

Nguồn: `crm` `origin/onehub` `27d47de04` (fetch 11/10), mọi `_acceptance/*/decisions.jsonl`, dòng `stage` S1 hoặc gate1,
`at` từ 22/09, câu `decision`/`why` khớp mẫu «chủ kho … chọn/chốt/quyết/dặn/gật/trả lời» hoặc «theo lời chủ kho».
Nhãn do MÁY gán tay khi đọc từng dòng (11/10) — là phán đoán, không phải phép đo máy; người soát có thể lật từng dòng.

| Nhãn | Nghĩa | Số dòng |
|---|---|---|
| M | mục tiêu + quy tắc đã khai | 22 |
| L | chỉ một lối ra sống | 6 |
| N | chỉ người có | 23 |
| X | không phải câu máy hỏi giữa S1 | 18 |

| # | Ngày | Hồ sơ | Nhãn | Lựa chọn (cắt 200 ký tự) |
|---|---|---|---|---|
| 0 | 2026-09-22 | onboarding-giong-deals | N | Nút «Kế hoạch mới» dời lên vùng nút đầu trang, tô màu chính, có icon — chủ kho chốt trong phiên: cùng vị trí và màu với «Thoả thuận mới»; thay chỗ đặt nút của AC-6 hồ sơ noi-bon-nut-dieu-phoi, phép đo |
| 1 | 2026-09-25 | tra-loi-tin-nhac | X | Mở vòng 3 ngay theo lời chủ kho, trước khi đủ ba điều kiện mở của lộ trình (triển khai, hai tuần nhắc thật, lượt 4 OKR); luật trả lời viết theo loại mục để lượt 4 cắm thêm mục KR ‖  |
| 2 | 2026-09-25 | cua-vao-dang-nhap | N | Bỏ ép dark cho cả năm trang AuthShell; sign-in dùng nền muted phẳng không AuthShader, bốn trang kia giữ AuthShader (chủ kho chọn Q3) ‖  |
| 3 | 2026-09-25 | quen-mat-khau | M | Giữ gửi thư Resend trong packages/auth và khai một ngoại lệ có tên ở docs/api.md, không chuyển sang apps/agent qua AgentTask (chủ kho chọn Q2 = A) ‖  |
| 4 | 2026-09-25 | quen-mat-khau | M | Gửi thư ở nền bằng waitUntil của @vercel/functions khai làm advanced.backgroundTasks.handler, không bằng một hàm tự viết thả promise (chủ kho chọn Q1 = A) ‖  |
| 5 | 2026-09-25 | quen-mat-khau | N | Giao bằng PR mới từ feat/quen-mat-khau-tiep-quan, để PR #104 và nhánh feat/quen-mat-khau của Tuan Do Viet nguyên như cũ (chủ kho chọn 26/09) ‖  |
| 6 | 2026-09-26 | doi-ten-onehub-center | N | Cột trái /sign-in theo hướng A (biên tập, đường nối, nền lưới chấm), bác B (ảnh màn Thành viên gắn số) và C (hướng dẫn dưới form) — chủ kho chọn 26/09 trên ba ảnh mô phỏng ‖  |
| 7 | 2026-09-26 | doi-ten-onehub-center | N | Gộp ba chỗ T3 (thư mật khẩu, tên không gian mặc định, workspace.service) vào vòng này, nâng hạng T3 (chủ kho chọn) ‖  |
| 8 | 2026-09-26 | doi-ten-onehub-center | N | Gộp đổi tên và cột trái vào một vòng (chủ kho chọn), AC chia hai nhóm Chữ và Cột trái ‖  |
| 9 | 2026-09-26 | hoan-thien-hoi-crm-qua-zalo | M | Tin không chữ của người đã nối trả một câu chiDocChu, không mở phiên, không tính trần — chủ kho chọn (a) 26/09, loại phương án im lặng bỏ qua ‖  |
| 10 | 2026-09-27 | tac-nhan-model-rieng | N | Không gửi bản vá lên hãng; ghi chỗ rẽ có tên trong docs/agent.md (chủ kho chọn 27/09) ‖  |
| 11 | 2026-09-28 | may-soan-de-xuat | N | Chủ kho chọn B: nút Duyệt bản máy soạn khoá tới khi tick hết từng con số mới, máy chủ kiểm lại số đã tick; và sửa câu lớp dữ liệu của mục Nguồn trong CONTEXT.md thành «để sau». Mở lại Cổng Phạm vi để  |
| 12 | 2026-09-28 | phien-chet-ve-dang-nhap | M | Người còn phiên mở / mà proxy không nhận được trả lời trong 2 giây: trang hỏi lại workspace.get từ máy chủ rồi vào /<slug>, API vẫn lỗi thì ném lỗi — chủ kho chọn (a), loại (b) dựng màn «chưa mở được  |
| 13 | 2026-09-28 | phien-chet-ve-dang-nhap | N | Không soạn bản vá gửi lên trycompai/crm dù lỗi cũng có ở bản của hãng — chủ kho quyết ‖  |
| 14 | 2026-09-28 | tro-ly-okr-de-xuat | N | Đổi tên nấc giữa của công tắc Trợ lý OKR từ «chạy bóng» thành «chế độ ẩn» theo lời chủ kho (dễ hiểu hơn với người không đọc tài liệu kỹ thuật) — trong từ điển, hợp đồng, phép đo, bản mẫu, hình và tên  |
| 15 | 2026-09-28 | kho-nguon-khoa-rieng | M | Không lùi sang BLOB_READ_WRITE_TOKEN: biến KHO_TAI_LIEU_BLOB_TOKEN vắng thì kho nguồn tắt êm như AC-5 cũ (chủ kho chốt A). Loại: lùi sang tên chung khi biến riêng vắng. ‖  |
| 16 | 2026-09-29 | tim-va-dieu-huong-kho | N | Chủ kho chọn 2026-09-29: dòng nhắc sáng đếm đúng số của tab «Chờ duyệt», quản trị đếm mọi bản chờ của kho; loại phương án chỉ đếm trang mình làm chủ ‖  |
| 17 | 2026-09-29 | tim-va-dieu-huong-kho | X | Đề xuất tách lịch sử, khôi phục, lưu trữ và vế «trang lưu trữ không ra kết quả» sang lượt 3b lich-su-va-luu-tru-trang (T3) vì TaiLieuTrang không có trạng thái lưu trữ; chủ kho chọn ở Cổng Phạm vi ‖  |
| 18 | 2026-09-29 | giai-doan-thoa-thuan | N | Ba loại giai đoạn (Đang mở · Chốt được · Không thành), không thêm loại «Loại ra»; chủ kho chọn ở brainstorm, chấp nhận tỷ lệ chốt ở Tổng quan tính cả Unqualified vào mẫu số. ‖  |
| 19 | 2026-09-29 | giai-doan-thoa-thuan | N | Không có nhiều bộ giai đoạn theo loại hợp tác — chủ kho chọn một bộ chung. ‖  |
| 20 | 2026-09-29 | dot-hoi-y-tuong-okr | X | Áp bảy sửa của rà soát UX (ra-soat-ux.md) theo lời chủ kho 2026-09-29: thanh tab cuộn tới tab đang đứng, ô soạn trong màn đầu ở 390, lý do không cắt, gom theo bố cục wishlist-1, dải pha StepList, màn  |
| 21 | 2026-09-29 | dot-hoi-y-tuong-okr | X | Áp năm đề xuất rà soát ReUI lần hai (ra-soat-reui.md) theo lời chủ kho 2026-09-29: dải pha và hành trình của ý bằng timeline của ReUI, huy hiệu trên tab Hỏi ý theo bố cục navbar-1 với thủ tục đọc nhẹ  |
| 22 | 2026-09-30 | ux-lai-thu-8c-okr | X | bỏ coverage-scan — phạm vi là danh sách đóng tám điểm do chủ kho chốt từ báo cáo lái thử 30/09, không phải bài toán liệt kê cho đủ ‖  |
| 23 | 2026-09-30 | tro-ly-okr-tom-tat | X | Không hiệu chỉnh judge Tóm tắt với chủ kho ở lượt này; eval chốt bằng mã, judge chỉ in điểm; hiệu chỉnh dời tới trước khi bật, trên ca thật ‖ ngưỡng ký của 9c (câu bị bỏ ≤ 10%, không số lệch) đo được  |
| 24 | 2026-09-30 | va-tro-ly-okr-sau-thu | X | bỏ coverage-scan — bốn việc đã do chủ kho chốt sau lượt thử 30/09; quét tay năm trục ghi ở mục Coverage ‖ Phạm vi đến từ bốn lỗi đã thấy trên màn và trên prod, không phải một không gian cần liệt kê; n |
| 25 | 2026-10-01 | tro-ly-doc-kho | N | Chỉ lưu chữ của câu hỏi bị từ chối và câu bị báo sai; câu đã trả lời chỉ để lại trang, phiên bản được trích và số đo (chủ kho chọn). ‖ Chủ trang cần đọc câu chưa có trang để viết trang; luật Zalo hiện |
| 26 | 2026-10-01 | tro-ly-doc-kho | L | Hỏi trong CRM ở tab «Hỏi» của Kho tài liệu (chủ kho chọn), không ở tab Agent của khung bản ghi. ‖ Câu hỏi kho không gắn công ty hay thoả thuận nào; tab Agent đòi mở một bản ghi và đi qua cửa /eve/v1 c |
| 27 | 2026-10-01 | tro-ly-doc-kho | M | Qua Zalo, trợ lý AI tự nhận câu về quy định, chính sách, quy trình, biểu mẫu rồi chuyển cho tro_ly_kho (chủ kho chọn), không bắt người gõ lệnh «kho». ‖ Lộ trình hứa «hỏi bằng lời thường»; lệnh tất địn |
| 28 | 2026-10-01 | tro-ly-doc-kho | M | Thêm ô đặt «Xác minh đến ngày» cho chủ trang và quản trị ngay lượt này (chủ kho chọn), không để cảnh báo quá hạn im tới lượt chu-trang-va-pham-vi. ‖ Cột xacMinhDen không có đường ghi nào ngoài test, n |
| 29 | 2026-10-01 | muc-tieu-va-kr | N | Mặc định mở mọi mục tiêu và chỉ ghi lên URL danh sách mục tiêu đã thu (khoá thuMucTieu). ‖ Chủ kho chọn mở tất cả và nhớ trên URL; ghi danh sách đã thu giữ URL sạch ở trạng thái thường gặp nhất. |
| 30 | 2026-10-03 | gop-y-dung-cho | N | Bộ lọc «Có góp ý chờ» ở Theo đơn vị làm ngay trong lượt này thay vì để sau. ‖ Chủ kho chọn 03/10; lọc ở API trước khi cắt trang để total đúng (AC-4, E6, E7). |
| 31 | 2026-10-03 | gop-y-dung-cho | N | Gộp hai hạt giống the-gop-y-cot-cuon-rieng và the-gop-y-sua-nhanh vào lượt này; phần tự hết vì bỏ cột ghi tên, phần còn sống thành AC. ‖ Chủ kho chọn 03/10; L2→AC-10, U4/U6→AC-8, U7→AC-1/AC-12, Ngoài- |
| 32 | 2026-10-03 | gop-y-dung-cho | N | Hộp Sửa KR cũng bỏ cột góp ý, chỉ còn dòng dẫn sang khung chi tiết — không giữ cột cho góp ý của riêng KR đó. ‖ Chủ kho chọn 03/10: một chỗ duy nhất để quyết mọi góp ý, hết hẳn hai cách lưu trong một  |
| 33 | 2026-10-04 | chan-trung-khoa-ban-nhap | M | Chặn bản nháp trùng khoá bằng superRefine trong schema banNhap, không thêm mã tu-choi trong nopBanNhap và không kiểm hai lớp (chủ kho chốt). ‖ Parse ở biên theo AGENTS.md; đã đo AI SDK 7 từ chối trước |
| 34 | 2026-10-04 | khung-okr-truoc-r1 | X | Chạy design-pass: bản mẫu /proto/khung-okr-truoc-r1 tám trạng thái, gửi ảnh kèm thẻ Cổng Phạm vi (nấc 1). ‖ Chủ kho dặn duyệt bố cục R1a trên ảnh hay bản mẫu; quyết định là bố cục tĩnh nên ảnh đủ (des |
| 35 | 2026-10-04 | khung-okr-truoc-r1 | M | Không sửa chữ chip tiếng Anh «1 suggestions» (G1) và các lỗi chữ G4–G7 ở vòng này. ‖ Chủ kho chốt tính năng và UX trước, chữ sau; G1 thuộc lượt Kara lượt 2 / K6a, cùng tệp okr-gop-y.ts. |
| 36 | 2026-10-04 | bo-xuong-kara | M | Chốt một cỡ nút «Thử lại» cho mọi chỗ Kara: KaraRetry = Button outline sm, không icon. ‖ Chủ kho chọn 04/10; khảo sát đồng nhất thấy bốn cỡ, mẫu góp ý KR đang chạy dùng outline sm không icon (E5). |
| 37 | 2026-10-04 | bo-xuong-kara | L | Duyệt và đo giao diện sáu khối trên một phòng mẫu tĩnh ngoài app (Bun.build + Tailwind của kho + puppeteer), không dùng /proto. ‖ Chủ kho chọn 04/10; /proto nằm trong apps/app mà luật điều phối cấm ch |
| 38 | 2026-10-04 | bo-xuong-kara | M | Kéo artifact và task của AI Elements bằng CLI ngay ở K1 và thêm hai mục miễn trừ có hạn vào cổng mồ côi, thay vì dựng KaraArtifact và KaraSteps trên Card và Accordion. ‖ Chủ kho chọn 04/10; sổ đăng ký |
| 39 | 2026-10-04 | man-okr-truoc-r1 | N | Thanh công bố ở Hồi ý thu gọn mặc định (bỏ defaultOpen ở ThanhCongBo); không đưa danh sách vào trang, không chỉ thu gọn ở điện thoại. ‖ Chủ kho chọn 04/10; đổi một chỗ gọi trong khoi-ket-luan.tsx, khô |
| 40 | 2026-10-04 | man-okr-truoc-r1 | M | R1m-7 (quản trị không thêm được mục tiêu lẻ) không làm trong lượt này; chủ kho chốt là lỗi, điều phối giao R1d (P1). ‖ Sửa nằm ở theo-don-vi/** và okr-access.service.ts, vùng P1 theo LUAT điều phối; N |
| 41 | 2026-10-04 | man-okr-truoc-r1 | X | bỏ design-pass — ba sửa nhỏ trên ba màn đang chạy, chủ kho đã chọn hướng từ ảnh màn thật; ảnh sau sửa ở 1440 và 390 do E2, E5u, E8u chụp và hội đồng E11 chấm ở S4. ‖ Hạn 10/10; bản mẫu riêng cho ba th |
| 42 | 2026-10-04 | thanh-vien-vao-dung | M | Cho phép một địa chỉ đã là thành viên thì API từ chối 400 và không tạo dòng; bỏ hai phương án nhận lặng (ghi accepted) và tự lành lúc đăng nhập. ‖ Chủ kho chọn «từ chối, báo rõ»; nhận lặng bỏ qua vai  |
| 43 | 2026-10-04 | thanh-vien-vao-dung | M | Ô «Tên miền nội bộ» đặt thành một thẻ trên Cài đặt › Thành viên, không đặt ở Chung hay Theo dõi. ‖ Chủ kho chọn trong brainstorm 04/10; tên miền nội bộ nói ai là người của công ty, và trang Thành viên |
| 44 | 2026-10-04 | thu-lai-sau-45-giay | X | Đổi khuôn «Thử lại khi bận»: bỏ stop(), giữ luồng tới turn.cancelled rồi session.waiting, huỷ mang turnId, parse hồi âm huỷ ở biên; AC-1/2/4/5/7 viết lại, E1/E2/E4/E5/E7/E9 đổi theo. ‖ S4 round 1 (REJ |
| 45 | 2026-10-04 | cua-vao-va | M | Thêm trang lỗi tiếng Việt cho cả vùng app ở hai cấp ([slug] và (app)), bắt mọi lỗi dựng trang, có nút Thử lại; không làm trang lỗi chỉ riêng cho mã 503. ‖ Chủ kho chọn (a) ngày 05/10; app không có err |
| 46 | 2026-10-05 | heap-lenh-dung | M | Mở hồ sơ tối thiểu mới heap-lenh-dung cho hai dòng ở acceptance.yml, không vượt cổng và không mở lại lenh-dung-do-khong-ai-thay ‖ Chủ kho chọn 05/10 khi pre-merge-check chặn t1-escape; mở lại hồ sơ cũ |
| 47 | 2026-10-05 | chat-an-toan-truoc-r1 | X | Mở lại Cổng Phạm vi để sửa AC-9: thành viên thường thấy hộp báo, ô chọn model vẫn bị khoá kèm câu chỉ quản trị đổi được như hôm nay, thay cho «không có ô chọn hay nút lưu» ‖ hồ sơ đã ký cai-dat-chung- |
| 48 | 2026-10-05 | zalo-va | M | Lỗi tạm là 408, 429, 5xx, lỗi mạng và thân sai khuôn; mọi mã 4xx khác vẫn là token sai ‖ chủ kho chọn «Trừ 408 và 429» 05/10 thay cho «chỉ 401/403/404»; ZALO.http.tamLoi trong zalo-config.ts |
| 49 | 2026-10-05 | zalo-va | M | Nhịp kiểm bot gặp lỗi tạm thì giữ tên bot và webhook, không báo thêm trên Cài đặt ‖ chủ kho chọn «Giữ nguyên bot» 05/10; kenhSeDungCua đọc zaloBotName nên xoá tên là đổi kênh nhắc |
| 50 | 2026-10-05 | zalo-va | L | bỏ design-pass — vòng này không đổi màn web nào; câu chào là tin Zalo, ghim nguyên văn ở AC-5 ‖ chủ kho chọn «Bỏ, không chạm màn» 05/10; mọi thay đổi nằm ở apps/agent và thước _acceptance/tra-loi-tin- |
| 51 | 2026-10-05 | zalo-va | L | bỏ ui-observed — không màn web nào đổi; chữ bot đo qua Zalo giả ‖ chủ kho chọn «Bỏ, không chạm màn» 05/10; AC-5 đo câu gửi đi qua đường webhook thật với Zalo giả |
| 52 | 2026-10-05 | zalo-va | L | bỏ đặc-tả-UX — không màn web nào đổi ‖ chủ kho chọn bỏ design-pass 05/10; trang «Nhắc buổi sáng» và khối KhoiZalo giữ nguyên |
| 53 | 2026-10-07 | nguoi-huy-khong-lac | M | Mở hồ sơ tối thiểu mới nguoi-huy-khong-lac trên PR riêng, không gộp vào PR #291 và không vượt cổng ‖ #291 đã ký Cổng 2 cho bộ điều phối, thêm commit làm bằng chứng của nó lệch đỉnh; vượt cổng thì việc |
| 54 | 2026-10-07 | okr-cua-toi-tach-theo-doi | N | Không gắn nhãn vai trò («Bạn phụ trách / tham gia / giữ KR») lên từng mục tiêu — phương án C chủ kho không chọn ‖ chủ kho chọn A (tách nhóm) trong phiên 07/10; bảng đã đánh dấu KR của tôi |
| 55 | 2026-10-07 | okr-loai-hoc-tap | N | «Đã trả lời» nghĩa là mục tiêu đã có «Điều học được» (đã bỏ khoảng trắng); không thêm ô đánh dấu riêng ‖ chủ kho chọn 07/10 giữa hai phương án; phương án ô đánh dấu riêng cần cột mới trong packages/db |
| 56 | 2026-10-07 | okr-loai-hoc-tap | X | KHÔNG nhắc người phụ trách ghi điều học được trước hạn khép, KHÔNG thống kê riêng mục tiêu học tập ở Toàn cảnh ‖ ngoài phạm vi chủ kho chốt; quét morphological xếp hai ô này vào Later |
| 57 | 2026-10-08 | ca-chap-chon-cach-ly | L | KHÔNG dựng sổ cách ly ca chập chờn và job CI không chặn ở vòng này. ‖ Mọi ca trong ranh giới F11 đều có cách sửa ở tầng test; câu hỏi mở của Cổng Đáng (opportunity.md) chủ kho trả lời bằng việc duyệt  |
| 58 | 2026-10-08 | zalo-gui-hong-ghi-ly-do | N | Đổi bot theo lối (1) chủ kho chọn: datBot so mã bot getMe của token mới với token đang lưu (hỏng thì so phần <số> của token), bot khác mà còn liên kết thì không lưu gì và trả can-xac-nhan-doi-bot; đồn |
| 59 | 2026-10-08 | trang-lo-trinh-trong-crm | X | KHÔNG lọc theo phòng ban thật — bộ lọc dùng nhóm của việc, tức luồng việc như tệp kế hoạch ghi. ‖ Chủ kho chốt ở Cổng Đáng 08/10; khối dữ liệu của kit chỉ chở trường nhóm, một việc như OKR phục vụ mọi |
| 60 | 2026-10-08 | vong-doi-mot-cach-cat | X | OOS-1 (danh sách liên quan trong ngăn lọc bản đã cất, kèm «+n đã lưu trữ»): mở hàng riêng, Cổng Đáng build, làm sau V2 và sau E4. ‖ Chủ kho quyết ở Cổng 1 — việc này sửa byId ba *.service.ts, trùng de |
| 61 | 2026-10-08 | vong-doi-mot-cach-cat | X | OOS-2 (lưu trữ một trường thôi hỏi lại, có «Hoàn tác»): mở hàng riêng, Cổng Đáng build, làm sau V2. ‖ Chủ kho quyết ở Cổng 1 — field-editor.tsx nằm ngoài ranh giới V2. |
| 62 | 2026-10-08 | vong-doi-mot-cach-cat | X | OOS-3 (giai đoạn thoả thuận và tác nhân theo nếp lưu trữ): để sau, chưa mở hàng. ‖ Chủ kho quyết ở Cổng 1. |
| 63 | 2026-10-09 | luat-kho-vong-doi | M | Vi phạm cũ của AgentDefinition (hai cột cất, list không lọc) vào nền theo tệp; vi phạm cach-ly-hai-agent của #321 KHÔNG vào nền, S4 chờ bản sửa của P3. ‖ Chủ kho chốt câu 3 ngày 09/10; vi phạm #321 là |
| 64 | 2026-10-09 | luat-kho-vong-doi | M | Điều (b) chỉ đo phương thức tên list* của app Nest, không đo mọi findMany trên mô hình có archivedAt. ‖ Chủ kho chốt câu 1 ngày 09/10; đo onehub 532e3317 có khoảng 85 lời findMany trên mô hình cất, ph |
| 65 | 2026-10-09 | luat-kho-vong-doi | M | Không đo nút Xoá trên giao diện cho bản ghi có lịch sử; chỉ đo xoá vĩnh viễn ở máy chủ phải kiểm archivedAt. ‖ Chủ kho chốt câu 2 ngày 09/10: «lịch sử» là phán xét của người theo docs/vong-doi.md. |
| 66 | 2026-10-09 | soan-okr-trong-khung | X | Cuộc soạn thành loại bản ghi soan trong chồng ?record= và mở trong DetailSheet, thay trang riêng /okr/soan/<cuộc> của K2. ‖ Chủ kho lật quyết định 04/10 ngày 09/10 để mọi thứ Kara chỉ tới mở một cách; |
| 67 | 2026-10-10 | lo-trinh-dong-bo-ho-so | X | bỏ design-pass — khung đích là ngăn Thoả thuận đang chạy trên production mà chủ kho đã xem và chọn, không có bố cục mới để duyệt trên bản mẫu ‖ Chủ kho so hai ngăn trên production 10/10 rồi chốt dùng  |
| 68 | 2026-10-10 | okr-mau-xoa-cau-hinh | N | Xoá phiên bản cấu hình chương trình OKR do người mẫu tạo và gỡ mã đơn vị mẫu khỏi các phiên bản còn lại; loại phương án viết lại tác giả sang người thật và phương án để nguyên. Chủ kho chọn trong phiê |
