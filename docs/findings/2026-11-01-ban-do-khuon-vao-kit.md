# Bản đồ khuôn vào kit — đề xuất đứng từ North Star, sau khi học hai kho thử (01/11/2026)

**Trạng thái:** finding — nguồn chữ của vòng `khuon-loi` (hàng KH1, mốc 2.37.0). Bốn câu hỏi của đề xuất đã được chủ kho
duyệt ở Cổng Phạm vi của vòng ngày 02/11 (§16). Hồ sơ vòng: [`_acceptance/khuon-loi/`](../../_acceptance/khuon-loi/).

**Câu hỏi của chủ kho (01/11):** «Tôi muốn triển khai bản đồ khuôn cho kit» — đứng từ North Star, cho nhiều dự án và
nhiều giai đoạn dự án. Tệp này rà mọi tình huống, chỉ ra chỗ nào của việc làm giao diện còn bất định, và đề xuất cách
kit biến chúng thành tất định mà không thêm lượt gọi người.

**Căn cứ.** Hai kho thử đã tự dựng bản đồ khuôn trong hai ngày 31/10–01/11: kho thứ nhất một nhóm màn (dạng sửa lệch đã
có), kho thứ hai tám nhóm (dạng khai trước khi lệch). Nền chữ: finding
[2026-10-30-ui-dong-nhat-giua-cac-man](2026-10-30-ui-dong-nhat-giua-cac-man.md) (§7, §8.3, §11) và bản phạm vi
[`pham-vi-ban-do-khuon-kit-3110`](../plans/pham-vi-ban-do-khuon-kit-3110.md) (KH1–KH5). Kho kit công khai: tệp này
không chép tên tệp, nội dung hay dữ liệu của kho tiêu thụ; hai kho thử gọi là «kho thứ nhất», «kho thứ hai».

---

## 0. Một phút

1. **Bất định đến từ điểm chọn không ai giữ.** Mỗi màn đi qua mười điểm chọn; hôm nay kit giữ được một (giá trị màu,
   cỡ chữ, khoảng cách), và chỉ khi kho bật nền thiết kế. Đề xuất đưa sáu điểm nữa lên bậc máy giữ và một điểm lên bậc
   «người quyết một lần, có ảnh».
2. **Kho giữ giá trị, kit giữ cơ chế.** Kho khai bản đồ khuôn; kit đọc, nạp vào ngữ cảnh tác tử, chấm ở bước chấm,
   trình ở cổng sẵn có. Kho không khai thì kit không đổi một byte hành vi.
3. **Một cơ chế cho mọi loại kho.** Kho chưa có màn, kho có màn chưa lệch, kho đã lệch nhiều, kho thiết kế lại: cùng
   cơ chế, khác điểm vào. Ba cơ chế lõi phủ mọi ô quan trọng của không gian tình huống (§4).
4. **Ba vòng qua ba mốc được kho nhận:** «Khuôn lõi» (chấm vật theo khuôn) → «Chọn khối ở cổng» (ba lối, thẻ, ảnh) →
   «Khởi tạo từ mã». Mỗi vòng 8–12 tiêu chí, đúng luật cỡ vòng và luật một vòng meta giữa hai mốc kho nhận.
5. **Một quyết định cho chủ kho:** thay vế «răng bắt ≥1 lệch thật qua ≥3 vòng giao diện» trong điều kiện mở của mục
   chờ cũ KH-C1 bằng hai thước đo đúng chỗ hơn (§7). Đã duyệt 02/11 (QĐ-10, §16).

## 1. Đứng từ North Star

Thước của kit là thời gian từ làm-xong tới gộp-được, số lần gọi người và chi phí máy trên mỗi kết quả gộp. Việc làm giao
diện đang kéo xấu cả ba ở những chỗ đo được:

| Thước của kit | Giao diện làm nó xấu đi thế nào | Số đo |
|---|---|---|
| Làm-xong → gộp-được | Màn lệch phải sửa bằng những vòng «đồng nhất lại» riêng, sau khi đã ký | kho thứ nhất: ít nhất 8 vòng đã ký chỉ để đồng nhất lại, thêm khoảng 15 hàng cùng loại trong lộ trình |
| Lượt gọi người | Chủ kho thấy lệch bằng mắt khi dùng thử — mỗi lần là một lượt ngoài thiết kế | kho thứ nhất: thước «trông giống» là mắt người, dựng tay từng vòng |
| Lượt gọi người | Bước chấm dừng vì kit chưa định nghĩa được bài kiểm thiết kế máy đọc trên tệp `.tsx` | kho thứ nhất: 49/49 vòng giao diện dừng ở lưới này từ 17/10 (kit #461) |
| Chi phí máy | Mỗi kho tự dựng lại cùng một bộ răng khuôn | kho thứ hai khoảng 2.300 dòng mã răng; kho thứ nhất bốn hàng răng trong một ngày máy |
| Chi phí máy | Màn đầu của mỗi nhóm tốn nhiều lượt chấm vì chưa có khuôn để bám | kho thứ hai, một màn đầu nhóm: 5 lượt chấm, khoảng 800 nghìn token ra |
| Chi phí máy · lượt gọi | Đổi nền thành phần giao diện mà không có khuôn để bám | một kho khác: 4 lượt chấm, khoảng 9,2 triệu token, 4 lượt gọi người |

Giá trị của bản đồ khuôn trong kit vì thế đo bằng ba thứ: số vòng «đồng nhất lại» mới về gần 0 ở kho đã khai, số lần
chủ kho thấy lệch khi dùng giảm, và kho giao diện thứ ba không phải dựng lại răng.

## 2. Gốc của bất định

Khi dựng một màn, tác tử đi qua một chuỗi điểm chọn: màn thuộc loại nào, khung gì, chờ tải vẽ gì, dùng khối nào. Ở điểm
chọn không có câu trả lời do máy giữ, tác tử lấy thứ gần nhất trong ngữ cảnh — mã cạnh bên, mẫu trong đầu. Ngữ cảnh mỗi
vòng một khác, nên mỗi vòng một đáp án.

**Định lý điểm chọn:** độ lệch giữa các màn ≈ số điểm chọn không ai giữ × số cách trả lời hợp lệ ở mỗi điểm. Tất định
hoá là đẩy từng điểm chọn lên bậc cao nhất có thể:

| Bậc | Tên | Còn điểm chọn? | Ví dụ |
|---|---|---|---|
| T0 | Không còn lựa chọn | không — chỉ một đường | khung có khe bắt buộc; ngoài khung không dùng được khối dựng trần |
| T1 | Sinh sẵn | không, lúc bắt đầu | máy sinh kế hoạch chụp ảnh; lệnh tạo màn từ khuôn |
| T2 | Khai rồi kiểm | có, nhưng sai thì đỏ | bản đồ khuôn + bước chấm kiểm mã đã dựng |
| T3 | Chọn có đối chiếu | có, người phản ứng trên ảnh | ba lối chọn khối; màn mới cạnh màn mẫu |
| T4 | Gu | người quyết | kiểu chờ tải, tỉ lệ cỡ chữ — quyết một lần, ghi thành giá trị, hạ xuống T2 |

**Lời dặn không nằm trên thang.** Kho thứ nhất có luật giao diện bằng lời, tác tử đã đọc, màn mới vẫn đi vòng.

Ngành đã giải bốn chân của nhất quán: một nguồn, đường lát sẵn, ép và đo bằng máy, quản trị đóng góp (Shopify Polaris,
Atlassian Design System, GitHub Primer, «golden path» của Spotify). **Chân thứ năm** gãy khi tác tử viết mã: người thiết
kế chọn khuôn trước khi kỹ sư viết dòng nào. Kho thứ hai lấp chân này bằng ba lối chọn khối.

## 3. Mười điểm chọn — ai giữ hôm nay, ai giữ sau đề xuất

| Điểm chọn | Hôm nay | Sau đề xuất | Cơ chế · vòng |
|---|---|---|---|
| 1. Màn thuộc nhóm nào | lời rải trong tài liệu kho | T2 — màn không thuộc nhóm nào thì đỏ | bản đồ + bước chấm · Khuôn lõi |
| 2. Khung của nhóm | T2 ở hai kho thử, kho khác không có | T2 mọi kho đã khai; T0 (khe bắt buộc) là việc của kho | bước chấm kiểm có dựng khuôn · Khuôn lõi |
| 3. Trạng thái trống, tải, lỗi | lời | T2 — khối trạng thái trần ngoài khuôn thì đỏ | khối cấm trong bản đồ · Khuôn lõi |
| 4. Đầu trang | T2 ở kho thứ nhất | T2 qua nhóm «trang» | cùng cơ chế · Khuôn lõi |
| 5. Ghi tại chỗ, ngăn hay hộp thoại | lời | T2 một phần, chấm bằng hội đồng | để sau — khi hai kho có mã luật hành vi |
| 6. Phản hồi: báo, hoàn tác | lời | giữ T3–T4 | chưa làm — chưa kho nào có khuôn phản hồi |
| 7. Giá trị màu, cỡ, khoảng cách | T2 khi bật nền thiết kế | không đổi | nền thiết kế hiện có (trục riêng) |
| 8. Chọn khối cho ô chưa có khuôn | T4 không ai giữ — tác tử lấy mã gần nhất | T3 ba lối có ảnh, người duyệt một lần ở Cổng Phạm vi, rồi T2 khi khối vào danh mục và khuôn | ba lối · Chọn khối ở cổng |
| 9. Ảnh làm chứng: khổ, sáng tối, trạng thái | tay | T1 — máy sinh kế hoạch chụp từ bản đồ | Chọn khối ở cổng |
| 10. Vòng đời bản mẫu chạy được | mỗi hàng tự quyết | T2 — một dòng quy ước; trang bằng chứng nhúng ảnh | Chọn khối ở cổng (hạt giống, §12) |

Kết quả: từ một điểm máy giữ (7) lên bảy (1, 2, 3, 4, 7, 9, 10), một điểm «người quyết một lần, có ảnh» (8), và hai điểm
khai thẳng là chưa làm (5, 6) kèm điều kiện mở.

## 4. Không gian tình huống

Quét hai trục chính — trạng thái giao diện của kho × loại thay đổi của một vòng. Thước đủ: hồ sơ thật của hai kho thử,
một lần đo kho thứ ba (30/10) và bốn chân của ngành.

| Kho \ Vòng | Không chạm giao diện | Màn mới, nhóm đã có khuôn | Màn đầu của nhóm mới | Sửa màn có sẵn | Đổi khuôn hay khối đích | Chỉ thêm răng, công cụ |
|---|---|---|---|---|---|---|
| Không có giao diện | im (đọc cũ) | — | — | — | — | — |
| Chưa có màn (khám phá, bản mẫu) | im | chưa có khuôn | ba lối, rút khuôn ngay trong vòng, ghi nhóm mới — **Core** | — | — | kho dựng răng trước màn đầu (kho tự làm) |
| Có màn, chưa khai, ít lệch | im | kit chưa biết nhóm: chạy như hôm nay; đường ra là khai bản đồ một lần | dùng lõi | — | — | khai bản đồ tay theo lược đồ (dùng lõi) |
| Có màn, chưa khai, lệch nhiều | im | như trên; sau khi khai chỉ chấm phần vòng đổi, nợ cũ đếm theo cặp | dùng lõi | — | — | máy dò khuôn từ mã, lệch thành nhãn nợ (Later) |
| Đã khai bản đồ | im, kể cả khi chạm tài liệu, hồ sơ (chiều im) | nạp khuôn và màn mẫu; chấm vật theo khuôn — **Core** | ba lối và nhóm mới, một chạm ở Cổng Phạm vi — **Core** | chấm phần đổi; đẩy màn ra khỏi khuôn thì đỏ — **Core** | sửa khuôn một chỗ; vòng đang chạy giữ bản đã ghim (Later) | không tính là vòng thử răng (luật đếm) |
| Thiết kế lại hàng loạt | im | như kho đã khai | — | — | đổi giá trị bản đồ hàng loạt; màn chưa theo kịp thành nhãn (Later) | — |

**Core là 4 trên khoảng 22 ô có nghĩa (18 %).** Các ô «dùng lõi», «chiều im», «luật đếm» chạy bằng chính ba cơ chế lõi
(bộ đọc, bước chấm, nạp ngữ cảnh). Không ô nào trong bảng là Never; Never nằm ở trục phụ:

| Trục phụ | Giá trị | Kit làm gì | Nhãn |
|---|---|---|---|
| Kỹ thuật giao diện | React, TSX | đường tĩnh: đọc theo mẫu chữ, khai sẵn ba dạng sót; bộ đọc cây mã thay vào khi có | Core |
| | web khác (HTML, Vue, Svelte) | đường chạy: khuôn gắn dấu nhóm lên phần tử gốc, bài kiểm giao diện đếm màn thiếu dấu | Later, khi có kho cần |
| | không chạy trên trình duyệt (di động gốc) | không làm | Never — chưa kho nào |
| Nguồn khối | có kho khối ngoài (ReUI, shadcn) | ba lối: trong kho · kho khối ngoài · vẽ mới | Core |
| | chỉ thành phần nội bộ | hai lối: trong kho · vẽ mới | Core, cùng cơ chế |
| | chưa có gì | vẽ mới kèm «chỗ hở»; khuôn sinh cùng màn đầu | Core, cùng cơ chế |
| Giai đoạn bản mẫu | có bản mẫu chạy được | một dòng quy ước vòng đời; trang bằng chứng nhúng ảnh | Core ở vòng 2 |

## 5. Kiến trúc sau khi học hai kho

Giữ năm nguyên tắc của thiết kế 30/10 (kho giữ giá trị · đường cố định `design/patterns/<nhóm>.md`, không thêm khoá cấu
hình · trục riêng, không phải bậc · răng rẻ trước đắt sau · không thêm cổng người). Đổi so với kế hoạch 31/10 theo những
gì hai kho đã đo:

| Thành phần | Ai giữ · làm gì | Đổi so với 31/10 · căn cứ |
|---|---|---|
| Bản đồ khuôn, mỗi nhóm một tệp | kho — nhóm, đối tượng, khuôn, màn mẫu, khe bắt buộc, khối cấm, ngoại lệ có lý do | lược đồ rút từ hai bản đồ thật: lõi chung cộng mở rộng có tên (đơn vị màn/phần tử, cấm cả họ, thành phần thay, khe tuỳ chọn…); có phiên bản để vòng đang chạy ghim — kho thứ hai phải ghi ngoại lệ hồi tố khi luật mới vào nhánh chính giữa một vòng |
| Bộ đọc bản đồ dùng chung | kit — một bộ đọc cho bước chấm, thẻ và luật lint của kho | **thay KH4.** Không sinh cấu hình lint: hai kho dùng hai bộ lint khác nhau, cả hai đọc thẳng bản đồ; kit cấp bộ đọc, kho tự bọc luật |
| Chấm vật theo khuôn | kit, ở bước chấm — tệp vòng chạm phải dựng khuôn, không dùng khối cấm, thuộc đúng một nhóm | nợ cũ đếm theo cặp tệp–khối, không theo dòng đổi (kho thứ hai chấm theo dòng đổi cho 7 mục xanh sai; kho thứ nhất đếm theo cặp không gặp); đọc không được thì «không đo được», không chặn |
| Số đo vòng | kit — bước chấm tự ghi tệp theo khuôn, lệch mới, nợ cũ | bắt buộc, không để hồ sơ nhớ chạy — kho thứ hai: chỉ 1/9 hồ sơ giao diện có số đo |
| Thước của chính răng | kit — ma trận đỏ và im trong bộ kiểm kit | kiểm theo quan hệ («mọi tệp khớp nhận diện thuộc đúng một nhóm»), không danh sách tay — kho thứ hai: 7 commit sửa tay danh sách trong bài kiểm |
| Ba lối chọn khối | kit nạp quy trình vào bước thiết kế sẵn có; kho khai kho khối ngoài | mới, chưa có trong KH1–KH5; bật khi vòng chạm ô chưa có khuôn; kho thứ hai đã dùng 2 lần |
| Khối «Khuôn» trên thẻ hai cổng | kit — Cổng Phạm vi: nhóm, màn mẫu, trang ba lối; Cổng Bằng chứng: số tệp theo khuôn, lệch mới, nợ cũ | ảnh nhúng vào trang, không trỏ đường tương đối (lỗi đã tái hiện, kit #398) |
| Vết danh mục khối | kit ghi sau gộp: khối vừa chọn thành lối «trong kho» | máy ghi từ quyết định ở cổng — kho thứ hai có một khối đã dùng mà thiếu trong danh mục, lint vẫn xanh |
| Vòng đời bản mẫu | kit đặt mặc định một dòng; kho đổi được | mới — kit chưa có quy ước nào (§12) |
| Khởi tạo từ mã | kit, một lần khi bật nền thiết kế | giữ như KH5; danh sách lệch tìm thấy là nhãn, không tự thành việc |

**Ràng buộc thiết kế — phạm vi đo theo nhóm.** Eval khuôn khai `paths` theo vùng từng nhóm (tệp bản đồ của nhóm + vùng
màn của nhóm), không toàn cục. Tệp bản đồ nằm ngoài `_acceptance/<slug>/`, nên nó kéo xét lại hồ sơ theo `paths` của
eval; khai toàn cục thì sửa một nhóm kéo cả kho đi ghim lại (§13).

Vòng 1 đã dựng phần lõi đúng hình này: bộ đọc `scripts/ban-do-khuon.cjs`, lệnh `scripts/design-floor-khuon.mjs`, khuôn
tệp `skills/acceptance/references/ban-do-khuon-template.md`, một dòng trên thẻ Cổng Bằng chứng và lưới ở
`feature-loop/scripts/s4-args.mjs` — chi tiết ở [`design.md`](../../_acceptance/khuon-loi/design.md) của hồ sơ.

## 6. Ba vòng qua ba mốc

| Vòng | Giao gì | Mở khi |
|---|---|---|
| 1 · Khuôn lõi (KH1, gộp KH4) | lược đồ, bộ đọc dùng chung, bước chấm khuôn, số đo tự ghi, khuôn tệp và lệnh sinh tệp nhóm, «thẻ việc» (L1), «dùng khi / không dùng» (L2) | chủ kho gọi tên vòng meta (01/11) |
| 2 · Chọn khối ở cổng (KH2, KH3, KH-C6, L4, L7) | ba lối có ảnh ở Cổng Phạm vi, khối «Khuôn» đầy đủ hai cổng, màn mới chụp cạnh màn mẫu, quy ước vòng đời bản mẫu | mốc của vòng 1 được một kho nhận cài và chạy bước chấm khuôn |
| 3 · Khởi tạo từ mã (KH5) | máy soạn bản đồ nháp từ mã lúc bật nền thiết kế, lệch thành nhãn | hàng «bật nền thiết kế bằng một lệnh» đã giao |

Vòng 1 đi trước vì vòng 2 cần biết «ô chưa có khuôn» là gì, và điều đó chỉ có khi bản đồ đọc được. Mọi vòng giữ hình
dạng kho tiêu thụ đã quen: kho không khai bản đồ không đổi gì; hồ sơ cũ thiếu tệp kết quả khuôn thì thẻ hiện cờ vàng
đường đọc cũ, không bắt chuyển đổi. Vòng 1 không bắt đầu dưới chân một vòng khác đang chạy: sáu bản vá sau 2.36.0 đi cùng
nó trong mốc 2.37.0.

## 7. Thước cho chính đề xuất

**Vì sao vế cũ đo sai.** Vế «răng bắt ≥1 lệch thật qua ≥3 vòng giao diện» đếm phần bước chấm bắt được. Răng tốt chặn lệch
ngay lúc viết — trong trình soạn và hook, trước khi có commit — nên bước chấm chỉ thấy phần lọt qua, và con số ấy tiến
về 0 khi răng càng tốt. Kho thứ hai: **0 lệch trong 2 vòng có số đo**, và bộ đo của kho tự khai không đếm phần chặn trước
commit. Vế này có thể không bao giờ đạt dù răng chạy hoàn hảo.

**Hai thước thay:**

| Thước | Đo gì | Đạt khi | Chiều đỏ của nó |
|---|---|---|---|
| Trước phát hành — đỏ và im trong bộ kiểm kit | bước chấm có nhạy và có im đúng chỗ không | ma trận ca lấy hình dạng từ bản đồ thật của hai kho: tiêm màn ngoài khuôn thì đỏ đúng tệp và khối; chạm tài liệu, hồ sơ thì im; đối chứng dương xanh trước | hai mutant: gỡ bộ lọc vùng · đổi loại trừ thành bao gồm |
| Sau phát hành — thực tế | kho đã khai còn phải mở vòng «đồng nhất lại» không, chủ kho còn thấy lệch khi dùng không | trong 21 ngày ở kho nhận: 0 vòng đồng nhất lại mới cho nhóm đã khai, và dưới 2 lệch lọt | mỗi vòng đồng nhất lại mới hay mỗi lệch lọt là một dòng đếm; 2 lần giữa hai mốc thì mở lại thiết kế bản đồ |

**Giới hạn đã khai:** thước sau phát hành chỉ đọc được khi có kênh nhận lệch lọt. Vòng 1 dựng kênh ấy không thêm lượt
gọi: kho ghi lệch thấy khi dùng vào `design/patterns/lech-lot.md`, thẻ Cổng Bằng chứng in «sổ lệch lọt: N mục».

## 8. Dự báo năm dòng số

| Dòng | Dự báo | Vì sao |
|---|---|---|
| 1. Làm-xong → gộp-được | ↓ làm-xong→ký · = ký→gộp | ít lượt chấm trả lại vì lệch, ít vòng đồng nhất lại; không chạm đoạn ký→gộp |
| 2. Lượt gọi người mỗi vòng | = trong thiết kế · ↓ ngoài thiết kế | chọn khối gộp vào chữ ký Cổng Phạm vi sẵn có; chủ kho thôi bắt lệch bằng mắt |
| 3. Vòng bị hạ tầng kit đốt lượt chấm | ↑ rủi ro | công cụ mới có thể hỏng ở kho lớn; chặn bằng «đọc không được thì không chặn» và kiểm bản cài trước phát hành |
| 4. Token máy mỗi vòng | ↑ vòng đầu nhóm · ↓ vòng sau | ba lối dựng ba bản nháp ở màn đầu nhóm; màn sau bám khuôn nên ít lượt chấm hơn; chưa đo được phần chênh |
| 5. Phút máy mỗi lượt chấm | = | kiểm tĩnh chạy trong vài giây |

**Điều kiện tin cậy cho dòng 4 và 5:** bước chấm khuôn là một bài kiểm máy mới, không đổi thành phần đường phán quyết
(tìm lỗi → phản biện → trả lại), và có răng cả hai chiều đỏ và im trong bộ kiểm.

## 9. Cân trên mọi kho

| Kho | Được | Mất |
|---|---|---|
| Không có giao diện | — | 0: không đọc, không chấm |
| Có giao diện, không khai bản đồ | — | 0: mọi phần mới chỉ bật khi có `design/patterns/`, không đổi mặc định |
| Kho thử đã có răng tự viết | bỏ dần bộ quét tự viết; thẻ cổng hiện khuôn; chọn khối có ảnh (vòng 2) | một lần đối chiếu lược đồ của kho với lược đồ kit; lệch thì bộ đọc khoan dung và cờ vàng |
| Kho giao diện thứ ba, kho mới | răng khuôn có sẵn; màn đầu nhóm có ba lối; khởi tạo từ mã ở vòng 3 | một tệp bản đồ mỗi nhóm |
| Hành vi cũ có ai dựa không? | không — kit chưa có bộ đọc bản đồ nào | — |

## 10. Kit đang có gì cho giao diện

Kiểm kê bộ máy giao diện của kit (nhánh chính `1de12588`, 01/11), xếp theo bước của vòng. Bản đồ khuôn không thay thứ
nào; nó lấp các khoảng trống mà cột «giới hạn» chỉ ra.

| Bước | Kit đang có | Giới hạn kit tự khai | Bản đồ khuôn cắm vào |
|---|---|---|---|
| Đầu vòng | đọc bậc nền thiết kế M0–M3; cảnh báo khi vòng chạm giao diện mà chưa nối bài kiểm thiết kế | kho chưa khai vùng giao diện đọc ra M0, im | một dòng «khuôn: N nhóm» — trục riêng, chạy cả ở M0 |
| Thiết kế, đặc tả | nạp tri thức thiết kế (tối đa hai tệp); kiểm «kế hoạch dùng lại» có tên thật; đặc tả UX có mục «khuôn IA đã chọn» | không có phép đo máy nào cho đặc tả UX | «khuôn đã chọn» thành thứ máy kiểm được: nhóm và khuôn lấy từ bản đồ |
| Bước thiết kế trên bản chạy | phiên thẩm mỹ trên bản mẫu, chụp ma trận trạng thái × khổ; bước phân kỳ mở hoặc bỏ qua kèm lý do | không so với màn khác; không có quy ước gỡ bản mẫu | ba lối dùng chính bước phân kỳ, bật ở ô chưa có khuôn; chụp màn mới cạnh màn mẫu |
| Cổng Phạm vi | thẻ có khối «Bản mẫu và ngữ cảnh», «Sàn thiết kế» bằng chữ | thẻ không có ảnh nào | khối «Khuôn» và trang ba lối với ảnh nhúng (vòng 2) |
| Bước chấm | bắt mã màu thô; độ phủ token; sàn tĩnh hoặc trên trình duyệt; lưới «chạm giao diện mà thiếu bài kiểm thiết kế thì dừng» | với `.tsx`, bài kiểm thiết kế tĩnh báo «không đo được» | bài kiểm thiết kế đầu tiên đo được trên `.tsx` — cũng là lời đáp cho lưới dừng ở kit #461 |
| Cổng Bằng chứng | cờ «bằng chứng lớp nhìn thấy»; trang bằng chứng hiện ảnh | ảnh trỏ đường tương đối (kit #398) | dòng «k tệp theo khuôn · n lệch mới · nợ cũ j» (vòng 1); ảnh đối chiếu nhúng (vòng 2) |

**Số đo liên quan trong kit:** bài kiểm giao diện PASS 97,4 % mà chỉ 1,3 % đi qua đường giao diện chuẩn; hội đồng chấm bị
người quyết lại 240/293 lần; 28/51 câu trả lời của chủ kho ở bước thiết kế vốn máy đã đủ căn cứ để tự quyết. Con số cuối
là lý do ba lối chỉ hỏi ở ô chưa có khuôn, không ở mọi màn.

## 11. Để tác tử chọn giao diện như chuyên gia

Chủ kho hỏi: điều gì giúp tác tử chọn giao diện tốt như chuyên gia hàng đầu? Chuyên gia giỏi không vì thuộc nhiều thành
phần hơn; họ đi qua bảy bước — hiểu việc của người dùng, đọc hướng dẫn mẫu, xem tiền lệ, phác nhiều lối, đưa phản biện,
thử dữ liệu cực trị, tự nhìn lại — mà tác tử hôm nay bỏ qua hoặc chỉ làm bằng lời và tự chấm bài mình. Skill giao diện
của kit đã viết phần lớn các bước ấy, nhưng đều là lời và chỉ nhìn từng màn riêng lẻ.

| Đòn bẩy | Kit làm thế nào · bậc | Vòng |
|---|---|---|
| L1 · Thẻ việc của màn | đặc tả UX có năm trường: ai dùng · việc chính · tần suất · số bản ghi · thiết bị; nhóm khai `nhan_viec`; máy xếp nhóm bằng so khớp, chỉ hỏi khi không khớp (T4 → T2) | 1 |
| L2 · Dùng khi, không dùng khi | thân tệp bản đồ có hai mục này và một ví dụ sai; bộ đọc kiểm có mặt (theo hướng dẫn mẫu của Polaris) | 1 |
| L3 · Tiền lệ thật cho ba lối | mỗi lối kèm hai, ba màn tham chiếu (màn đang chạy của kho, màn của sản phẩm hàng đầu khi phiên có kho ảnh màn) | 2, tuỳ chọn |
| L4 · Phản biện đối kháng trước khi khuyên | một tác tử ngữ cảnh sạch chấm ba lối theo trọng số lấy từ ý định ở Cổng Đáng; người đọc phán quyết, không đọc vật | 2 |
| L5 · Dữ liệu cực trị sinh từ bản đồ | máy sinh kế hoạch chụp gồm trống, một, rất nhiều, chữ dài, lỗi, không quyền (tay → T1) | 2, tuỳ chọn |
| L6 · Tự nhìn trước khi nộp chấm | cuối bước dựng, máy chụp và so cấu trúc với màn mẫu rồi mới gửi bước chấm | sau (hạt giống) |
| L7 · Sổ gu thành luật | mỗi lần người chọn khác khuyến nghị, máy ghi lý do và soạn sẵn giá trị luật cho bản đồ; duyệt như một dòng ở Cổng Bằng chứng | 2 |
| L8 · Khe nhận gì, thay vì chỉ cấm gì | nhóm mới khai danh sách cho phép; nhóm cũ khai danh sách cấm vẫn đọc được | 1, tuỳ chọn |
| L9 · Nạp đúng, nạp ít | ngữ cảnh lúc chọn chỉ gồm tệp bản đồ và màn mẫu của nhóm đã chọn | 1 |
| L10 · Thực tế là thầy cuối | phiên nghiệm thu đo việc chính của màn mới cạnh màn mẫu; số về sổ gu | sau |

**Ưu tiên:** L1 và L2 gần như miễn phí, vào lược đồ của vòng 1. L4 và L7 biến ba lối từ «có so, có vết» thành «so ra điều
tốt hơn và nhớ được», vào vòng 2 không thêm lượt gọi người. L3, L5, L8 tuỳ chọn. L6, L10 để sau, có điều kiện.

**Đo «chọn tốt hơn»:** tỉ lệ màn đầu nhóm duyệt ở Cổng Phạm vi mà không phải sửa · số lượt chấm mỗi vòng giao diện · tỉ
lệ người chọn khác lời khuyên (giảm dần = gu đã vào luật; bằng 0 suốt 10 lần đầu nhóm = ba lối là trạm thu phí) · lệch
lọt và vòng đồng nhất lại.

**Không làm:** dặn tác tử «có gu» bằng lời; cổng duyệt thiết kế riêng; để hội đồng máy phán thẩm mỹ (240/293 lần bị người
quyết lại — gu vẫn do người, nhưng chỉ một lần mỗi loại).

## 12. Vòng đời bản đồ

Hôm nay mọi thao tác trên bản đồ làm bằng tay trong các vòng của kho; kit chưa có mẫu, lệnh hay hướng dẫn nào. Kho thứ
nhất có một nhóm, tạo trong vòng đầu và mở rộng ở vòng kế. Kho thứ hai có tám nhóm: bốn tạo tay trong một hàng, bốn sinh
ra cùng màn đầu của nhóm và ký ở Cổng Phạm vi của vòng ấy. Hai bản đồ đã bắt đầu khác nhau ở khoá riêng.

**Ba hạng quyền sửa** — rút từ luật đã khai nên máy tự áp, có sổ và cửa veto:

- **Máy tự làm:** thêm đối tượng, tệp, ngoại lệ có lý do, khe; gỡ phần mồ côi.
- **Máy soạn, người duyệt ở cổng sẵn có:** tạo nhóm, bật lần đầu.
- **Người quyết:** đổi màn mẫu, khối đích, tách hay gộp nhóm — đó là gu.

**Mười thao tác:**

| Thao tác | Hôm nay ở hai kho | Kit đề xuất | Vòng |
|---|---|---|---|
| Bật lần đầu, kho chưa có màn | kho thứ hai dựng nền ba hàng bằng tay, khoảng một ngày máy | bật một khoá; nhóm sinh cùng màn đầu qua ba lối | 1–2 |
| Bật lần đầu, kho đã có màn | tay, trong một vòng đầy đủ | máy dò khuôn từ mã, soạn nháp, người duyệt một lần; trước khi có lệnh dò: khuôn tệp và hướng dẫn của kit | 3; khuôn ở 1 |
| Tạo nhóm mới | kho thứ nhất chưa có cách; kho thứ hai trong vòng của màn đầu nhóm | lệnh sinh tệp nhóm từ khuôn (`--tao`), điền từ quyết định ba lối; một chạm ở Cổng Phạm vi | 1–2 |
| Thêm màn hay đối tượng vào nhóm | sửa tay bản đồ và danh sách trong bài kiểm (7 commit ở kho thứ hai) | màn khớp nhận diện thì không sửa gì; bài kiểm theo quan hệ | 1 |
| Ngoại lệ | 14 và 12 dòng có lý do | máy thêm kèm lý do; ngoại lệ thừa máy gỡ; số ngoại lệ tăng nghĩa là khuôn thiếu khe | 1 |
| Sửa khuôn (thêm khe) | trong vòng cần nó | sửa khung một chỗ; thước chạy lại trên mọi màn của nhóm | 1 |
| Đổi màn mẫu, khối đích, tách gộp nhóm | chưa xảy ra; luật mới giữa vòng phải ghi ngoại lệ hồi tố | gu: một chạm ở Cổng Phạm vi, có ảnh trước và sau; bản đồ lên phiên bản, vòng đang chạy giữ bản đã ghim | 2 |
| Gỡ nhóm hay đối tượng | kho thứ hai giữ 9 ngoại lệ «màn đã rời nhóm» thay vì gỡ | bài quét báo nhóm không còn tệp; máy gỡ ở vòng kế chạm vùng ấy; nhãn, không tự sinh việc | 1 |
| Nợ cũ | danh sách nợ đếm theo cặp; trần nợ bằng 0 | danh sách nợ cạnh bản đồ, đếm theo cặp và số lần; giảm thì tự cập nhật, tăng thì đỏ | 1 |
| Dời hay đổi tên tệp | chưa có răng ở cả hai kho | nhận diện không còn khớp tệp nào thì đỏ; máy sửa bản đồ ngay trong vòng dời tệp | 1 |

**Khuôn tệp = lõi chung + mở rộng có tên.** Ba nguồn để rút: bản phác ở finding 30/10, một tệp thật của kho thứ nhất, tám
tệp của kho thứ hai. Bộ đọc khoan dung với khoá lạ và hiện cờ vàng (luật đổi lược đồ phải có đường đọc cũ). Phần vòng đời
**bản mẫu chạy được** (điểm chọn 10) chưa có neo đủ để mở ô — ghi ở hạt giống
[`2026-11-01-hat-giong-vong-doi-ban-mau.md`](../plans/2026-11-01-hat-giong-vong-doi-ban-mau.md).

## 13. Việc tương tự cần bàn

| Vấn đề | Vì sao đáng bàn | Máy đề xuất |
|---|---|---|
| Sửa bản đồ có kéo hồ sơ đã ký ra ghim lại không | kho thứ nhất vừa ghim lại 111 hồ sơ, khoảng 13 giờ máy, vì một lớp lỗi cùng họ; bản đồ là tệp mọi vòng giao diện đọc | **ràng buộc thiết kế của vòng 1, không phải lỗi của bản vá #468**: #468 chỉ phân loại tệp trong hồ sơ, còn tệp bản đồ nằm ngoài hồ sơ và đi đường cũ (kéo xét lại khi `paths` của eval phủ nó) — nên eval khuôn khai `paths` theo nhóm (§5) |
| Hai vòng song song cùng sửa bản đồ | kho thứ hai đã gộp tay hai lần | mỗi nhóm một tệp đã giảm đụng độ; vùng giao việc của điều phối khai tệp nhóm mà vòng chạm; tệp chung (danh mục khối, mục lục) do máy sinh |
| Bản đồ và tài liệu bằng lời trôi nhau | cả hai kho có luật giao diện bằng lời song song với bản đồ | lời giải thích ở tài liệu, giá trị máy đọc chỉ ở bản đồ; tài liệu trỏ một chiều sang bản đồ, không chép giá trị |
| Danh mục khối | cùng vòng đời với bản đồ; kho thứ hai đã sót một khối | tệp riêng, cùng bộ đọc; máy ghi từ quyết định ở cổng |
| Khuôn dùng chung giữa các kho cùng nền | nhiều kho tiêu thụ dùng chung một nền kỹ thuật và kho khối | thuộc một gói thiết kế dùng chung của các kho ấy, **không thuộc kit** — kit là engine, không chứa giá trị sản phẩm |
| Chữ trên màn (nhãn, giọng, định dạng số) | một loại điểm chọn nữa mà khuôn chưa giữ | để sau: thêm trường luật chữ khi hai kho có bộ luật chữ máy đọc |

## 14. Giới hạn đã khai

- **Xếp một màn thật sự mới vào nhóm** vẫn là việc của người, một lần mỗi nhóm, ở Cổng Phạm vi. Ngưỡng đếm: số tệp giao
  diện mỗi vòng không thuộc nhóm nào («k tệp giao diện ngoài bản đồ» của bước chấm); số này không giảm qua các vòng thì
  bản đồ thiếu nhóm.
- **Khuôn có đúng cho người dùng không** thuộc thực tế (phiên nghiệm thu, prod), không thuộc thước.
- **Ba lối mới chứng minh «có so, có vết»**, chưa chứng minh «so ra điều tốt hơn»: 2 lần dùng, 0 lần đổi hướng. Ngưỡng:
  sau 10 lần đầu nhóm mà số lần lối được duyệt khác lời khuyên vẫn bằng 0 thì xét thu ba lối về một ảnh khuyến nghị.
- **Đọc theo mẫu chữ sót ba dạng:** xuất lại qua tệp gom có đổi tên · thẻ dựng qua biến · «ở gốc» không kiểm. Ngưỡng: một
  lệch lọt qua đúng các dạng này thì mở bộ đọc cây mã (DFK-C1). Khai đủ ở design §7 của hồ sơ.
- **Điểm chọn 5 và 6** (ghi tại chỗ, phản hồi) chưa có khuôn: mở khi hai kho có mã luật hành vi trong bản đồ.

## 15. Luật kit áp vào

- **CỘNG phải được phê:** mỗi vòng phê đích danh ở Cổng Phạm vi của chính nó (ADR 0018). Đề xuất đã trừ một mã (KH4 gộp
  vào bộ đọc) để phần cộng nhỏ nhất.
- **Một vòng meta giữa hai mốc được kho nhận, khi chủ kho gọi tên.** Kho thứ hai đã nhận 2.36.0 (31/10); chủ kho gọi tên
  vòng 01/11. Sáu bản vá sau 2.36.0 (từng dự tính cắt riêng thành 2.36.1) là sửa lỗi kho tiêu thụ báo, có neo ngoài, nên
  máy không tính chúng là vòng meta; chủ kho đảo được cách đọc này. Chủ kho 01/11 gộp chúng cùng vòng 1 vào mốc 2.37.0.
- **Ô chỉ mở khi có neo ngoài.** Neo của vòng 1: hồ sơ răng giữ khuôn đã ký của kho thứ nhất và hồ sơ răng giữ khuôn của
  kho thứ hai. Phần chưa có neo (vòng đời bản mẫu) sống ở hạt giống.
- **Kho kit công khai.** Ca đỏ và im trong bộ kiểm dùng hình dạng của bản đồ thật trên kho mẫu dựng trong lượt, không chép
  tên tệp hay nội dung của kho tiêu thụ.

## 16. Sổ quyết định

Chủ kho duyệt Cổng Phạm vi của vòng `khuon-loi` ngày 02/11 bằng một chạm «duyệt» trên thẻ có bốn câu hỏi. Bốn câu đã chép
vào §13.1 của finding [30/10](2026-10-30-ui-dong-nhat-giua-cac-man.md); dòng gốc ở
[`decisions.jsonl`](../../_acceptance/khuon-loi/decisions.jsonl) của hồ sơ.

| Mã | Câu trên thẻ | Quyết định | Dòng sổ |
|---|---|---|---|
| QĐ-9 | Hỏi-1 | Duyệt phần CỘNG: bộ đọc bản đồ khuôn dùng chung, lệnh khuôn (đếm · nạp · chấm · ghi số đo · sinh tệp nhóm · gợi ý eval), khuôn tệp bản đồ, một dòng trên thẻ Cổng Bằng chứng, mục «Thẻ việc» trong khuôn đặc tả UX | `d-20261101T151503Z-2` |
| QĐ-10 | Hỏi-2 | Thay vế «răng bắt ≥1 lệch thật qua ≥3 vòng giao diện» của mục chờ KH-C1 bằng hai thước (§7): trước phát hành = ma trận đỏ và im + 2 mutant trong bộ kiểm kit; sau phát hành = 21 ngày ở kho nhận, 0 vòng «đồng nhất lại» mới, dưới 2 lệch lọt — kèm kho nhận nêu tên trước khi cắt mốc, mốc gốc lấy trước khi làm, luật dừng 21 ngày. Khó đảo: dùng suất meta duy nhất tới mốc kho nhận kế, và lược đồ thành hợp đồng với kho | `d-20261101T151503Z-3` |
| QĐ-11 | Hỏi-3 | Đọc mã theo mẫu chữ ngay, không chờ bộ đọc cây mã DFK-C1; ba dạng sót đã khai kèm ngưỡng mở (§14) | `d-20261101T151503Z-4` |
| QĐ-12 | Hỏi-4 | Lưới ở `s4-args`: kho đã khai bản đồ, hồ sơ có diff chạm vùng một nhóm mà `evals.yaml` thiếu eval khuôn → `s4-args` dừng (thoát 2, nêu hồ sơ và nhóm), thay vì chỉ cờ vàng trên thẻ | `d-20261101T151948Z-17` |

**Mốc gốc ở kho nhận** (lấy 01/11, trước khi làm): lượt chấm sáu vòng giao diện gần nhất 5 · 2 · 3 · 2 · 3 · 1 (trung bình
khoảng 2,7) · 7 lần sửa tay danh sách trong bài kiểm bản đồ · 1/9 hồ sơ giao diện có số đo.

**Ý của chủ kho 01/11, trước cổng** (không mang mã QĐ riêng): gọi tên vòng meta bản đồ khuôn và gộp nó cùng sáu bản vá vào
mốc 2.37.0; chấp nhận mười đòn bẩy L1–L10 và thứ tự ưu tiên ở §11; coi ba lối chọn khối là một bước hiệu quả của cơ chế —
ghi thành mục chờ KH-C6 của lộ trình (vòng 2 «Chọn khối ở cổng»). Hai câu cuối ở dòng `d-20261101T151503Z-13` của sổ.

---

Hình tầng 2 (ba vòng qua ba mốc · bảy bước chuyên gia · vòng đời một nhóm) chưa chép vào
`docs/findings/assets/` — tệp này là nguồn chữ, hình là chiếu của nó theo `docs/reference/DIAGRAM-RULE.md`.
