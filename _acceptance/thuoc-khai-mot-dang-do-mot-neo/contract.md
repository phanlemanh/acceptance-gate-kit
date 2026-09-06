---
schema_version: 1
feature: Hai thước tự khai một đằng đo một nẻo — răng lane có chiều đỏ sống trên cây hôm nay, và P86 so quan hệ ngân sách thay vì hỏi chữ số có mặt
slug: thuoc-khai-mot-dang-do-mot-neo
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-06T07:15:00Z
design_doc: docs/superpowers/specs/2026-09-06-thuoc-khai-mot-dang-do-mot-neo-design.md
---

# Acceptance Contract: thuoc-khai-mot-dang-do-mot-neo

## Context

Hai finding HIGH «ngoài hợp đồng» của S4 vòng 3 hồ sơ `co-qua-timebox-nhom-da-xong`
(06/09/2026); owner quyết mở hồ sơ vá. Cả hai đã đo lại tay trên `main` sạch tại `5aa7221a`
trước khi thiết kế — không nhận finding bằng lời khai.

**Vật A**: nhóm `lane-doc-khong-doi` của `_acceptance/inputs-tinh-tu-goc-kho/rang.sh` lấy mốc
bằng `git merge-base main HEAD`, tức đo *hình dạng nhánh của tác giả* chứ không đo đợt thay
đổi đã giao. Trên `main` sạch: `0 pass, 3 do`, hỏng cả đối chứng dương. Nó là standing
executor và là E6 của một hồ sơ đã ký nên mọi đợt re-pin đều vấp.

**Vật B**: khối P86 của `tests/plugins/run-tests.sh` canh «ngân sách 3/4/1» bằng
`if so not in khoi` trên toàn khối văn bản. Đo tay: đổi `≤3 lượt/vòng` thành `≤9 lượt/vòng`
→ vẫn PASS; xoá hẳn vế `mốc phát hành ≤1` → vẫn PASS. Câu PASS vẫn tự khai «ngan sach 3/4/1».

Source input: docs/superpowers/specs/2026-09-06-thuoc-khai-mot-dang-do-mot-neo-design.md

## Criteria

- AC-1: Given cây bất kỳ có đủ lịch sử, When chạy `bash _acceptance/inputs-tinh-tu-goc-kho/rang.sh --chan lane-doc-khong-doi` (qua khoá `itgk_lane_doc_khong_doi`, chính khoá đang đỏ), Then nhóm XANH và in ba mốc đã neo; và nhóm tự chạy LẦN HAI trong một clone `detached` ở commit khác rồi so hai đầu ra GIỐNG NHAU từng byte — hai lượt một kết quả là cách bắt đường phụ thuộc HEAD còn sót.
- AC-2: Given `feature-loop/workflows/acceptance-verify.js` tại HEAD, When so với bản tại mốc đã ký `9b3d6f64`, Then GIỐNG HỆT; và Given một clone đã sửa file ấy, Then ĐỎ với thông điệp ghim `lane hội đồng đã đổi`. Đây là vế SỐNG: nó đỏ trên cây thật ngay khi ai đó sửa lane hội đồng, không phải chứng-một-lần.
- AC-3: Given khoảng đã giao `1765b550..9b3d6f64`, When liệt kê file mã đổi (loại `tests/**`, `docs/**`, `skills/**`, `feature-loop/skills/**`, `_acceptance/**`, `.github/**`, `PRODUCT-MAP.md`), Then tập ấy BẰNG đúng `{feature-loop/scripts/s4-args.mjs}`. Vế này là **chứng-một-lần**: với đối số thật nó cho câu trả lời HẰNG, chỉ còn hai kết cục xanh hoặc mốc-mất — điều đó được khai thẳng ở đây thay vì giấu sau một ô xanh.
- AC-4: Given một KHO GIẢ dựng tại chỗ có khoảng `base..tip` chứa thêm `lib/tiem-file-la.mjs` ngoài `s4-args.mjs`, When gọi hàm kiểm vế-tập-file qua ĐÚNG chữ ký mà lời gọi thật dùng, Then ĐỎ với `tập file mã đổi ≠ {…}` nêu đích danh file lạ — chiều đỏ của vế hằng phải đi qua đúng đối số production, không đi vòng qua HEAD của clone.
- AC-5: Given một kho KHÔNG có mốc đã neo (lịch sử cắt hoặc viết lại), When nhóm chạy, Then ĐỎ và gọi tên sha thiếu — tuyệt đối không rơi về xanh im lặng.
- AC-6: Given cây lành, When chạy `ONLY_BLOCK=P86 bash tests/plugins/run-tests.sh`, Then P86 XANH và in ba con số ngân sách TRÍCH ĐƯỢC từ đúng vế của dòng ngân sách cho cả bản VI lẫn bản EN — số in ra đến từ biến, không từ chữ hằng trong câu.
- AC-7: Given ba đột biến, mỗi cái sửa đúng MỘT vế ngân sách trên cả hai bản chép (`≤3 lượt/vòng` → `≤9` · `T3 trần 4` → `T3 trần 5` · xoá hẳn vế `mốc phát hành ≤1`), When P86 chạy, Then mỗi ca ĐỎ, gọi tên vế hỏng, và NÊU CON SỐ THẬT đã trích (ca một in `9`); ca xoá vế đỏ vì THIẾU vế, không vì lệch bản chép.
- AC-8: Given một đột biến thêm cổng thứ năm vào CẢ ba bản (nguồn tsv + VI + EN) mà giữ nguyên `≤3`, When P86 chạy, Then ĐỎ vì quan hệ `số lượt ≠ số cổng − 1`. Ba bản vẫn khớp nhau nên mọi phép so bản-chép đều xanh: chỉ phép so QUAN HỆ bắt được ca này.
- AC-9: Given cả hai vật đã vá, When chạy bốn suite của kho và `product-map.mjs --root . --check`, Then tất cả xanh; và P86 vẫn in đủ NĂM dòng đột biến CŨ — vá thước không được nuốt chiều đỏ đã có.
- AC-10: Given `check_lane` đổi chữ ký, When chạy bảy nhóm còn lại của `rang.sh`, Then mỗi nhóm vẫn `passed`, không nhóm nào `FAILED`.

## Coverage

Ma trận đóng: {vật A · vật B} × {xanh trên vật lành · đỏ khi phá TỪNG vế · thông điệp ghim
gọi đúng tên vật hỏng · độc lập cây-và-ngày}. Vật A phủ ở AC-1..AC-5: vế lane SỐNG có chiều
đỏ trên cây thật (AC-2), vế tập-file là HẰNG nên chiều đỏ của nó phải đi qua kho giả với đúng
chữ ký production (AC-4), cộng ô fail-closed khi mốc mất (AC-5) và ô hai-lượt-một-kết-quả cho
trục độc-lập-cây (AC-1). Vật B phủ ở AC-6..AC-8 (xanh có số thật · ba vế × chiều đỏ có số ·
quan hệ với bảng nguồn). AC-9 và AC-10 là hai ô không-hồi-quy. Bỏ coverage-scan bằng máy — không
gian là ma trận hai chiều đã liệt hết ở đây (entry d-20260906T064500Z-tkm1).

## Đường đo

- bỏ đường-đo — hồ sơ không có ô cơ hội (vòng vá lỗi, sinh từ finding ngoài hợp đồng của một
  hồ sơ khác) (entry d-20260906T064600Z-tkm2)

## Out of scope

- Không sửa hợp đồng, bằng chứng, hay chữ ký của hồ sơ `inputs-tinh-tu-goc-kho`; nhóm và khoá
  config giữ nguyên tên nên hồ sơ đã ký không phải mở lại.
- Không gỡ nhóm `lane-doc-khong-doi` khỏi standing executors — gỡ là mất luôn ca đã đo.
- Không đổi con số ngân sách trong GUIDE/QUICKSTART/README: vòng này sửa THƯỚC, không sửa vật.
- Không đụng năm đột biến sẵn có của P86 (hai bản chép VI, bản EN, thêm cổng ở nguồn, mất
  ngân sách T3) — chúng vẫn phải đỏ đúng chỗ sau khi vá.

## Notes

- Hằng mốc là hai sha viết trong răng: clone nông (`--depth`) không có chúng → AC-4 đỏ có tên.
  CI phải chạy `fetch-depth: 0` mới xanh; đã kiểm workflow hiện tại trước khi chốt.
- Sau khi vá, P86 đỏ cả khi đổi CÁCH VIẾT dòng ngân sách mà giữ nguyên số. Đúng ý: dòng ấy là
  hợp đồng văn bản giữa ba bản chép, không phải văn xuôi tự do.
