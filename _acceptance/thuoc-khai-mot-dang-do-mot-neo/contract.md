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

- AC-1: Given `feature-loop/workflows/acceptance-verify.js` trên CÂY LÀM VIỆC (không chỉ tại HEAD — sửa chưa commit cũng phải bị bắt), When so với bản tại mốc đã ký `9b3d6f64`, Then GIỐNG HỆT; và Given một clone đã sửa file ấy — CẢ HAI phần tử của lớp: một ca đã commit và một ca CHƯA commit — Then mỗi ca ĐỎ với thông điệp ghim `lane hội đồng đã đổi`. Ca chưa-commit là chỗ duy nhất phân biệt phép so-cây với phép so-HEAD. Đây là vế SỐNG: nó đỏ trên cây thật ngay khi ai đó sửa lane hội đồng, không phải chứng-một-lần.
- AC-2: Given khoảng đã giao `1765b550..9b3d6f64`, When liệt kê file mã đổi (loại `tests/**`, `docs/**`, `skills/**`, `feature-loop/skills/**`, `_acceptance/**`, `.github/**`, `PRODUCT-MAP.md`), Then tập ấy BẰNG đúng `{feature-loop/scripts/s4-args.mjs}`. Vế này là **chứng-một-lần**: với đối số thật nó cho câu trả lời HẰNG, chỉ còn hai kết cục xanh hoặc mốc-mất — điều đó được khai thẳng ở đây thay vì giấu sau một ô xanh.
- AC-3: Given một KHO GIẢ dựng tại chỗ có khoảng `base..tip` chứa thêm `lib/tiem-file-la.mjs` ngoài `s4-args.mjs`, When gọi hàm kiểm vế-tập-file qua ĐÚNG chữ ký mà lời gọi thật dùng, Then ĐỎ với `tập file mã đổi ≠ {…}` nêu đích danh file lạ — chiều đỏ của vế hằng phải đi qua đúng đối số production, không đi vòng qua HEAD của clone.
- AC-4: Given một kho KHÔNG có mốc đã neo (lịch sử cắt hoặc viết lại), When nhóm chạy, Then ĐỎ và gọi tên sha thiếu — tuyệt đối không rơi về xanh im lặng.
- AC-5: Given cây lành, When chạy `ONLY_BLOCK=P86 bash tests/plugins/run-tests.sh`, Then P86 XANH và in ba con số ngân sách TRÍCH ĐƯỢC từ đúng vế của dòng ngân sách cho cả bản VI lẫn bản EN — số in ra đến từ biến, không từ chữ hằng trong câu.
- AC-6: Given SÁU đột biến — ba cái sửa đúng một vế ngân sách trên bản VI, ba cái sửa đúng vế ấy CHỈ trên bản EN (bản VI để nguyên, vì `kiem` duyệt VI trước rồi dừng ở dòng đỏ đầu tiên nên mọi ca chạm VI đều che mất nhánh EN) (`≤3 lượt/vòng` → `≤9` · `T3 trần 4` → `T3 trần 5` · xoá hẳn vế `mốc phát hành ≤1`), When P86 chạy, Then mỗi ca ĐỎ với CHUỖI GHIM khai trước chứa con số máy trích (ca một ghim `ngan sach luot 9 != so cong 4 - 1`), và thông điệp ấy được IN RA trong bằng chứng; ca xoá vế đỏ vì THIẾU vế, không vì lệch bản chép. Đột biến nào không khai chuỗi ghim là FAIL — assert âm tính trần bị cấm. Và MỌI đột biến phải đi qua chân «mũi tiêm có trúng»: chuỗi đích xuất hiện đúng một lần và văn bản sau khác trước, nếu không thì một mũi tiêm trượt cũng cho đúng một màu xanh.
- AC-7: Given một đột biến thêm cổng thứ năm vào CẢ ba bản (nguồn tsv + VI + EN) mà giữ nguyên `≤3`, When P86 chạy, Then ĐỎ với chuỗi ghim `ngan sach luot 3 != so cong 5 - 1` in ra trong bằng chứng. Ba bản vẫn khớp nhau nên mọi phép so bản-chép đều xanh: chỉ phép so QUAN HỆ bắt được ca này.
- AC-8: Given cả hai vật đã vá, When chạy bốn suite của kho và `product-map.mjs --root . --check`, Then tất cả xanh; và P86 vẫn in đủ NĂM dòng đột biến CŨ — vá thước không được nuốt chiều đỏ đã có.
- AC-9: Given `check_lane` đã được thay bằng `lane_song` + `tap_file` + `co_moc`, When chạy bảy nhóm còn lại của `rang.sh`, Then mỗi nhóm vẫn `passed`, không nhóm nào `FAILED`.

## Coverage

Ma trận đóng: {vật A · vật B} × {xanh trên vật lành · đỏ khi phá TỪNG vế · thông điệp ghim
gọi đúng tên vật hỏng · độc lập cây-và-ngày}. Vật A phủ ở AC-1..AC-4: vế lane SỐNG có chiều
đỏ trên cây thật (AC-1), vế tập-file là HẰNG nên chiều đỏ của nó phải đi qua kho giả với đúng
chữ ký production (AC-3), cộng ô fail-closed khi mốc mất (AC-5) và ô hai-lượt-một-kết-quả cho
trục độc-lập-cây (AC-1, đo bằng quét TĨNH — xem Notes). Vật B phủ ở AC-5..AC-7 (xanh có số thật · ba vế × chiều đỏ có số ·
quan hệ với bảng nguồn). AC-8 và AC-9 là hai ô không-hồi-quy. Bỏ coverage-scan bằng máy — không
gian là ma trận hai chiều đã liệt hết ở đây (entry d-20260906T064500Z-tkm1).

## Đường đo

- bỏ đường-đo — hồ sơ không có ô cơ hội (vòng vá lỗi, sinh từ finding ngoài hợp đồng của một
  hồ sơ khác) (entry d-20260906T064600Z-tkm2)

## Out of scope

- Không đổi verdict, chữ ký, hay kết quả đã ký của hồ sơ `inputs-tinh-tu-goc-kho`. CÓ chèn dòng
  bổ chính đọc-cũ vào `contract.md`, `evals.yaml` và `evidence-report.md` của hồ sơ ấy (quyết định
  d-20260906T094700Z-tkm20 và d-20260906T103000Z-tkm22): văn bản gốc giữ nguyên, dòng bổ chính nói
  phương pháp đã đổi và trỏ sang hồ sơ này. Không mở lại cổng nào của hồ sơ đã ký.
- Không gỡ nhóm `lane-doc-khong-doi` khỏi standing executors — gỡ là mất luôn ca đã đo.
- Không đổi con số ngân sách trong GUIDE/QUICKSTART/README: vòng này sửa THƯỚC, không sửa vật.
- Không đụng năm đột biến sẵn có của P86 (hai bản chép VI, bản EN, thêm cổng ở nguồn, mất
  ngân sách T3) — chúng vẫn phải đỏ đúng chỗ sau khi vá.

## Notes

- **NỢ CÓ TÊN — tính «độc lập HEAD» không có phép đo máy nào canh.** Ba vòng S4 đều REJECT
  đúng chỗ này, mỗi vòng một tầng guard và tầng nào cũng mang lại bệnh của tầng dưới: đột biến
  không ghim thông điệp (vòng 1) → đối chứng âm là hằng đúng (vòng 2) → phép quét tĩnh xanh khi
  trích được 0 dòng thân hàm (vòng 3). Owner quyết 06/09: THU PHẠM VI, gỡ hẳn tiêu chí ấy và phép
  quét khỏi hồ sơ thay vì dựng tầng thứ tư. Hệ quả nhận trước: nếu ai đó đưa `HEAD`, `merge-base`
  hay `rev-parse` trở lại thân `lane_song`/`tap_file`, không phép đo nào của kho đỏ vì việc ấy —
  chỉ có hai chiều đỏ gián tiếp còn canh (ca sửa-chưa-commit ở AC-1 và ca kho-giả ở AC-3). Ai mở
  lại việc này nên đọc ba khối findings trong `review-findings.md` trước khi dựng tầng thứ tư.

- **Lịch sử của quyết định trên (giữ để đọc, không còn là lời khai của phép đo).** Bản trước
  của tiêu chí này đòi: cùng cặp cây, bản CŨ theo `merge-base` phải cho hai kết quả khác
  nhau. Đo thật 06/09 cho thấy khẳng định ấy SAI: bản cũ cho phán quyết giống hệt trên cả
  hai cây (`DO: tập file mã đổi ≠ {…}: {}` · rc=1 ở cả hai). Sâu hơn, `lane_song` và
  `tap_file` chỉ đọc hai hằng mốc cộng cây làm việc nên độc lập HEAD **theo cấu trúc** —
  hai lượt bằng nhau là tất yếu, không phải tính chất đo được, và mọi đối chứng âm dựng
  quanh nó lại là hằng đúng. S4 vòng 1 và vòng 2 đều REJECT đúng chỗ này; owner chọn đổi
  khuôn. Tính chất cấu trúc nay đo bằng phép quét cấu trúc, có chiều đỏ rẻ và thật.

- Hằng mốc là HAI sha viết trong răng: clone nông (`--depth`) không có chúng → AC-4 đỏ có tên.
  CI phải chạy `fetch-depth: 0` mới xanh; đã kiểm workflow hiện tại trước khi chốt.
- Sau khi vá, P86 đỏ cả khi đổi CÁCH VIẾT dòng ngân sách mà giữ nguyên số. Đúng ý: dòng ấy là
  hợp đồng văn bản giữa ba bản chép, không phải văn xuôi tự do.
