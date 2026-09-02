# Đánh giá trước Gate 1.5 — `loi-moi-cong-may-sinh`: lợi ích đứng từ North Star, rủi ro xếp hạng

> Owner yêu cầu 02/09 trước khi duyệt kế hoạch: *«review và đánh giá lợi ích
> (người dùng kit đứng North Star) cũng như rủi ro của thay đổi»*. Theo đúng
> luật lời-mời-cổng: phần vượt-nhận-thức (khả thi mã, tác động chéo) giao cho
> ĐỐI KHÁNG MÁY — phiên tươi đọc mã thật, chạy thử regex lên 626 AC, đo quét
> xưởng, tra config ba repo tiêu thụ (bản đầy đủ:
> `_acceptance/loi-moi-cong-may-sinh/review-plan-gate15.md`). Phiên thi công
> KIỂM LẠI ba điểm đổi được khuyến nghị rồi mới ghép bản này. Owner đọc phán
> quyết kèm số, không đọc vật.

## Lợi ích — thật hay hứa, đo bằng thước North Star

| Thước North Star | Trước (đo thật) | Sau vòng này (kỳ vọng) | Thật hay hứa | Cơ chế nào mang lại |
|---|---|---|---|---|
| Lượt gọi người / vòng | 6 (cong-dang) · 5 (2.6.0) | **≤3** (phát hành ≤1) | **Thật, đo được ở vòng đầu** dưới thẻ mới (ngưỡng khai trong ô) | Lời mời là vật máy sinh: lệnh đúng tên, câu gộp đầy đủ → không còn lượt «lệnh sai tên», «tách signoff 2 lượt», «mời non» |
| Chạm / lượt | 2–5 (gõ câu gộp 5 ô, chờ Enter danh tính) | **1** | Thật — nhưng phụ thuộc giả định 2 của ô (owner DÙNG câu in sẵn; bằng chứng thuận: 01/09 owner copy nguyên dòng khi có) | one_shot điền sẵn khuyến nghị; nới echo danh tính khi hai nguồn khớp |
| Bằng chứng không tự dối | thẻ bỏ im lặng khối Ngoài-hợp-đồng ngay trước lúc ký; «máy chưa đề xuất» sai; 8 AC xếp nhầm cột | 0 đường fail-quiet trên thẻ; cột SẼ/KHÔNG đúng nghĩa | **Thật, chiều đỏ có ca** (E5/E6/E7) | cờ vàng OOC · token lạ kêu to · classifier mệnh-đề-đầu |
| Chữ ký = thẩm định thật | «tôi chỉ gật vì vượt nhận thức» | chữ ký = đối kháng-đã-hội-tụ (kèm số) + đánh-đổi-đã-quyết | **Hứa có cơ chế**: khối PHÁN QUYẾT ĐỐI KHÁNG hiện số; nhưng «owner có đọc số không» không đo máy được — chỉ đo được gián tiếp qua số lần owner SỬA ô đã điền sẵn | khối đối kháng + luật rơi bậc |
| Thời gian làm-xong→quyết-được | 4h11 (cong-dang, gồm 2 lần mời non) | không hứa giảm: preflight ký-được-ngay ĐỔI lượt thành thời-gian-chờ | **Trung lập, phải đọc cả cột này** ở ba-dòng-số mốc kế (rà soát hệ thống N5) | — |

Lợi ích cho **đội dùng kit ở repo tiêu thụ** (không chỉ owner): thẻ của họ cũng
hết bỏ-im-lặng và hết xếp nhầm cột; câu gộp bấm được đúng tên lệnh plugin đầy
đủ — đúng lớp lỗi «gõ `/signoff` hụt hai lượt» owner từng ghi 09/08.

## Rủi ro — xếp hạng, đã kiểm lại

| # | Mức | Rủi ro | Kiểm lại của phiên thi công | Xử lý |
|---|---|---|---|---|
| 1 | **Cao** | one_shot in token MÁY (`known-limits`) mà thân lệnh `signoff` chỉ dạy chữ NGƯỜI («ghi Known limits») → dán nguyên dòng vẫn tốn thêm lượt «máy nêu cách hiểu» — đúng lớp lượt-ngoài-thiết-kế vòng này đi trừ | ✓ `commands/signoff.md:33` chỉ có ba nhãn chữ người, không có `wont-fix` | **Đã sửa kế hoạch**: từ vựng một nguồn `OOC_GLOSS_NGUOI` cạnh `PROPOSALS`; one_shot in chữ người; signoff học nhãn thứ ba |
| 2 | **Cao** | Classifier head-only đảo quá tay: cột KHÔNG-làm từ 251 xuống **17** trên 566 AC thật; ~100 ca chặn thật («thoát khác 0 và KHÔNG sinh tệp», «VIOLATION») biến khỏi cột vì Then tiếng Việt mở đầu bằng chủ ngữ | ✓ Tự đo lại: NEG cũ 251 · head-only 17 · **mệnh-đề-đầu 109**; 8 AC của hai bản phát hành đều về SẼ-làm với mệnh-đề-đầu; mẫu 251−109 đọc tay = «không» tiện thể giữa câu | **Chờ owner** — chạm vế AC-7 đã ký (xem quyết định dưới) |
| 3 | **Cao** | Răng plugins vỡ mà kế hoạch không liệt: P185 ghim `trả lời dạng:` + `___`; P186 CẤM «đồng ý cắt»/«phê hết» trong câu mẫu; P191 neo GRAMMAR dòng 194 «không bao giờ điền sẵn lựa chọn…»; P192 round-trip khuôn «điền vào chỗ trống»; P190 so byte 3 thẻ đã check-in | ✓ grep thấy đủ P190/P191/P192 và dòng 194 | **Đã sửa kế hoạch**: Task 1 liệt đích danh + sửa dòng 194 cùng lượt (không thì luật tự cãi) |
| 4 | Vừa | Rơi bậc mù mode: gate-card không đọc `gap_probe`; crm, media-library, floorplanstudio đều `advisory`, artifact-platform/map không khai (= advisory) → mọi thẻ Cổng 1 ở đó đỏ + không điền sẵn, và nghiệm thu ở kit KHÔNG thấy (kit là `required`) | ✓ config 5 repo + `pre-merge-check.sh:214` mặc định advisory | **Đã sửa kế hoạch**: vắng gap-probe chỉ rơi bậc khi `required`; file hỏng/probe-failed vẫn rơi bậc mọi mode; thêm ô ma trận `vang-khi-advisory → không rơi bậc` |
| 5 | Vừa | Thứ tự biến: `MAY_DI_TIEP` tính sau `--extract` và sau nhánh thoát non-approvable; kế hoạch kể sai nguồn cờ đỏ Cổng 1 | ✓ dòng 639/647/716 | **Đã sửa kế hoạch**: dời khối quét lên trước extract; one_shot chỉ khi approvable; nguồn cờ đỏ = rangHong · mienDoCoNguoiDung · blindSpot |
| 6 | Vừa | Baseline E11 đóng băng cờ oan: 2/3 hit `suspect_empty` là lời khai rỗng hợp lệ, 8/14 token lạ là token hợp lệ kèm chú thích; baseline theo slug che cờ oan mới | ✓ số của phiên soi, quét 74 hồ sơ 2,2 s | **Đã sửa kế hoạch**: nhận lời khai rỗng, so token theo tiền tố, baseline ghi slug + loại cờ |
| 7 | Vừa | Đóng dấu trên one_shot — owner gửi nguyên dòng có «đồng ý cắt; phê hết» mà không đọc | — (rủi ro hành vi, không kiểm mã được) | **Chấp nhận, có lưới**: chữ quyết và ô loại-5 luôn `___`; khối báo có số; sổ + veto; **thước gián tiếp**: đếm số lần owner sửa ô điền sẵn ở ba-dòng-số mốc kế — luôn bằng 0 thì phải hỏi lại «khuyến nghị tốt hay người không đọc» |
| 8–11 | Nhẹ | LM04 neo `main` (đỏ hạ tầng khi CI checkout PR) · LM11 assert vượt tag · LM10 đo mã thay vì hành vi · «4 site» là placeholder | ✓ | **Đã sửa kế hoạch**: ghim SHA `69e095e3`; bóc tag rồi ghim MỘT dạng; chiều đỏ đo đầu ra (thêm 1 loại-5 → +1; kind lạ → hỏi); đọc manifest thay vì tin số |

Không rủi ro nào chạm **khó-đảo**: mọi thay đổi ở tầng thẻ/luật, đảo bằng git;
hook, pre-merge, recheck không đổi (t3 chỉ chạm `lib/out-of-contract.js`,
thêm trường, không đổi trường cũ — P55 và S4 không vỡ, phiên soi đã kiểm).

## Điều duy nhất chỉ owner quyết — regex cột «Sẽ KHÔNG làm»

Phép thử «người biết gì máy không có»: máy có đủ số (251 / 109 / 17), không
có khẩu vị. Câu hỏi là *khi không chắc, cột chặn nên đoán về phía nào* — hiện
ở cột chặn cho người thấy (rộng) hay chỉ hiện khi chắc (hẹp).

| Lựa chọn | Cột KHÔNG-làm (566 AC) | Mất gì | Chạm AC-7 đã ký? |
|---|---|---|---|
| **Mệnh-đề-đầu** — phủ định trong mệnh đề đầu của vế Then (khuyến nghị) | 109 | vài ca phủ định nằm sau dấu phẩy | Có — đổi vế «MỞ ĐẦU» → «mệnh đề đầu mang từ chối/chặn»; entry `fix` + chữ owner một chạm |
| Head-only (như AC-7 đang ký) | 17 | ~100 ca chặn thật khỏi cột | Không |
| Giữ rộng, cắt mẫu gây nhầm | ~240 | là blacklist trên không gian mở — lớp kit đã cấm | Có |

Khuyến nghị: **mệnh-đề-đầu** — đúng cả 8 AC bản phát hành, giữ đủ ca chặn
thật, là luật vị trí chứ không phải danh sách đen.
