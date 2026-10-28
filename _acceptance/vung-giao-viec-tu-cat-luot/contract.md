---
schema_version: 1
feature: Vùng giao việc đi từ cắt lượt — mỗi hàng mang vùng mã dự kiến từ lúc cắt, gói đợt chép sang vùng tệp của đợt, phiên thợ khai thêm ở Cổng Phạm vi, để lịch biết tệp tự xếp nối tiếp hai hàng cùng sửa một màn
slug: vung-giao-viec-tu-cat-luot
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: verified
design_doc: docs/superpowers/specs/2026-10-28-vung-giao-viec-tu-cat-luot-design.md
approved_by: Manh Phan
approved_at: 2026-10-27T23:05:57Z
---

# Acceptance Contract: vung-giao-viec-tu-cat-luot

## Context

Đề bài phanlemanh/acceptance-gate-kit#430: đợt «vỏ khu Mục tiêu» của một kho tiêu thụ (25–27/10) «toàn đợi ghim» —
19 lần ghim, 21,2 giờ khoá máy, 6/17 lượt ghim đỏ vì thước của hàng khác gãy, 0 lượt chắc chắn vì lỗi sản phẩm. Lịch
biết tệp (2.34.0) có chạy nhưng 22/22 hàng chỉ khai thư mục hồ sơ của chính mình, nên 0 lần tự xếp `sau`. Ô cơ hội đã
qua Cổng Đáng (build, 27/10), phê CỘNG của chủ kho chép ở Notes của ô. Vòng chỉ cho lịch một cảm biến đúng: không đổi
cách chấm, không đổi làn ghim, kho không khai vùng giữ y hành vi hiện nay.

## Criteria

- **AC-1** — Given skill cắt lượt và khuôn tệp lộ trình, When một phiên cắt một đợt (dáng `chuoi` hay `lan-va`), Then mỗi hàng ghi `vung` — mảng glob tương đối gốc kho, theo màn của câu giao, hàng sửa khung chung của một khu giữ cả khu — và các hàng mẫu của khuôn đi qua răng phủ không cờ vùng nào rồi qua gói đợt thành `ranh_gioi` đúng bằng `vung` của chúng.
- **AC-2** — Given một hàng của đợt đang cắt, When răng phủ chạy, Then glob không có đoạn thư mục tĩnh trước ký tự đại diện đầu là lỗi `vung-qua-rong`, `vung` không phải mảng chuỗi khác rỗng là lỗi `vung-sai-kieu`, thiếu `vung` là cảnh báo `chua-khai-vung`, vùng chỉ trỏ `_acceptance/` là cảnh báo `vung-chi-ho-so`; hàng ngoài đợt không mang cờ vùng nào.
- **AC-3** — Given một đợt có từ ba hàng khai vùng, When răng phủ chạy, Then MỌI cặp chồng nhau là lỗi `vung-trung-moi-hang` cấp đợt và còn một cặp không chồng là im; phép so chồng của răng cho cùng kết quả với phép so của lịch trên cùng ma trận cặp glob.
- **AC-4** — Given một gói đợt khai nguồn hàng từ lộ trình, When gói được đọc, Then hàng thi công không khai `ranh_gioi` nhận `ranh_gioi` bằng `vung` của hàng lộ trình, hàng khai tay giữ nguyên vùng của nó, và lộ trình không có `vung` cho hàng y như trước.
- **AC-5** — Given một đợt đang chạy có nguồn hàng từ lộ trình, When giám sát thêm việc bằng mã một hàng lộ trình mà đợt chưa có và không kèm vùng tay, Then hàng mới mang `ranh_gioi` bằng `vung` của hàng lộ trình và được so trùng như mọi hàng; vùng tay kèm theo thắng.
- **AC-6** — Given bản phát lại ẩn danh của đợt «vỏ khu Mục tiêu» (ba dãy, mười bốn hàng, đúng thứ tự giao) có vùng theo màn, When bộ phát lịch thật chạy qua các nhịp, Then hàng dáng VK8 nhận `sau` hàng dáng VK6 và cùng gói không vùng thì không; các cặp chồng bằng đúng danh sách viết trước và không quá một nửa số cặp; mọi chuỗi của bản phát lại khớp khuôn tên tổng hợp đã khai, nên không mang chuỗi riêng nào của kho tiêu thụ.
- **AC-7** — Given một hàng có vùng đang ở Cổng Phạm vi trong đợt, When phiên thợ chạy lệnh khai vùng đúng như khối TRONG-DOT của vòng lặp in ra, Then vùng mới được GỘP vào `ranh_gioi` (vùng cũ còn nguyên) kèm một dòng Nhật ký; glob không có thư mục tĩnh bị từ chối, không ghi byte; hàng chưa bắt đầu ở dãy khác trùng vùng mới — kể cả hàng đã được chọn làm hàng kế mà chưa mở — nhận `sau` ở nhịp kế của bộ phát lịch.
- **AC-8** — Given hàng ở dãy khác đã bắt đầu hay đã ký mà chồng vùng mới khai ở Cổng Phạm vi, When lệnh khai vùng chạy, Then có đúng một sự kiện `trung-tep` mang `luc: cong-pham-vi` và không cần người phán, lệnh in một dòng cảnh báo nêu hàng ấy, và Sẽ KHÔNG ghi `sau` cho hàng đang dở, KHÔNG xin hay nhả khoá máy nào.
- **AC-9** — Given một thư mục đợt không khai vùng (hàng chỉ khai thư mục hồ sơ hoặc không khai, lộ trình không `vung`, không ai gọi lệnh khai vùng), When bộ phát lịch chạy nhiều nhịp và gói được đọc bằng bản trên nhánh chính hiện nay và bằng bản mới, Then hai bản cho cùng hàng kế mỗi dãy, cùng `hang-viec.json`, cùng `LUAT.md` và cùng chuỗi sự kiện (bỏ giờ).

## Coverage

- Trục A — chặng của vùng: cắt lượt ghi (AC-1) · răng canh (AC-2, AC-3) · gói đợt chép (AC-4) · thêm hàng giữa đợt (AC-5) · lịch lúc giao (AC-6) · xét lại ở Cổng Phạm vi (AC-7, AC-8). [thước CE: sơ đồ dòng chảy của design doc — mỗi mũi tên một AC]
- Trục B — cách khai: vùng từ lộ trình · khai tay · không khai · chỉ thư mục hồ sơ (AC-2, AC-4, AC-5, AC-9).
- Trục C — độ rộng: một màn · cả khu · không thư mục tĩnh · mọi cặp chồng (AC-2, AC-3, AC-6).
- Trục D — tiến độ của hàng kia: chưa bắt đầu · đã chọn làm hàng kế · đang làm · đã ký chưa gộp · đã gộp (AC-6, AC-7, AC-8; «đã chọn» và «đã gộp» giữ nguyên luật của hồ sơ ky-den-gop).
- Trục E — chiều: bắt (AC-6, AC-7) · im (AC-3, AC-4, AC-9) · báo không chặn (AC-8).
- Later: thẻ «thước sẽ gãy», khai «thay thế» một phía, nhịp giao theo sức khoá — năm hạt giống 27/10 (Notes của ô). Never: đọc `paths` của evals.yaml hay tệp kế hoạch làm vùng (sổ quyết định).

## Đường đo

- Phát lại đợt vỏ khu Mục tiêu: cặp VK6–VK8 bị xếp `sau` — số từ ca phát lại của AC-6 (bộ phát lịch thật trên bản chụp ẩn danh).
- Đợt thật kế tiếp có chồng vùng: lần ghim / PR gộp ≤ 0,5 — số từ lịch sử nhánh chính của kho tiêu thụ (commit ghim lại trên nhánh của mỗi PR gộp trong cửa sổ đợt, cách đếm của đề bài #430); không mã mới, đọc ở Cổng Giá trị.
- 0 câu hỏi ngoài cổng vì thước gãy do hàng khác — số từ sổ sự kiện của đợt (yêu cầu `can-nguoi` nêu thước gãy); không mã mới.
- 0 lượt gọi người thêm — AC-8 (xét lại chỉ báo, không thêm cổng) và AC-9 (kho không khai vùng không đổi).

## Out of scope

- Không đổi cách chấm, lượt chấm, làn ghim hay trần ghim — ghim chung tất-cả-hoặc-không là hạt giống «lượt ghim còn lại».
- Không đọc `paths` của `evals.yaml` hay tệp kế hoạch làm vùng (đo 78/91 cặp chồng; kế hoạch viết tự do).
- Không thêm giới hạn «ký chưa gộp» hay trần số hàng mở cùng vùng.
- Không đo độ đúng của dự đoán vùng lúc cắt trong vòng này — đo ở đợt thật kế tiếp.
- Không sửa lộ trình hay gói đợt nào của kho tiêu thụ.

## Notes

Ca đo: `tests/scripts/cat-luot-vung.test.mjs` (CV-…, AC-1 đến AC-3) và `tests/dieu-phoi/vung-giao-viec.test.mjs`
(VG-…, AC-1 phần gói, AC-4 đến AC-9). Bản phát lại ẩn danh (`tests/dieu-phoi/fixtures/dot-chong-vung/`: lộ trình
mang `vung` + gói đợt không `ranh_gioi`) giữ hình của đợt thật — ba dãy, mười bốn hàng, thứ tự giao — với mã, slug và
đường đổi tên; nó là ĐẦU VÀO như một lượt cắt viết, không phải khuôn bên đọc: ca đưa nó qua răng phủ thật và bộ đọc gói
thật trước khi chạy lịch. Thư mục nằm dưới `tests/dieu-phoi/fixtures/` nên lưới không-riêng-kho (DP1-07) quét nó.
