---
schema_version: 2
feature: "Thẻ quyết định in đúng thứ hồ sơ viết — đường dẫn có dấu sao không còn bị cụt khi lột định dạng, và mọi hình dạng dấu sao khác đều có kỳ vọng đã khai trước thay vì tuỳ hệ quả"
slug: card-text-fidelity
risk_tier: T2
surfaces: [cli]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-08-06T01:42:39Z
owner: phanlemanh@gmail.com
source: docs/superpowers/specs/2026-08-05-card-text-fidelity-design.md
time_human_minutes:
  gate1: 5
  gate2:
---

# Acceptance contract — card-text-fidelity

Bối cảnh: chip tồn từ vòng judge-required-evidence. Thẻ Cổng 1 của
`t1-escape-event-scope` hiện in cả `plugins/` lẫn `plugins/**` trong cùng
trang. Phản biện Cổng 1 chỉ ra đây là phép SIẾT: sau nó tập chuỗi được coi là
nhấn mạnh nhỏ đi, nên mọi hình dạng dấu sao phải có kỳ vọng KHAI TRƯỚC — kể cả
hình dạng "giữ nguyên". Feature tiêu thụ #2 pha Đo chương trình 80/20.

## Bảng hình dạng dấu sao — nguồn duy nhất của ma trận đo

Mỗi tên dưới đây là MỘT hình dạng đầu vào; phép đo phải có đúng một ô cho mỗi
tên, và tập tên rút từ bảng ca trong phép đo phải BẰNG tập này (quan hệ tập
hợp, không phải số đếm).

<!-- <<<STRIP-SHAPE-MATRIX -->
- glob-hai-sao-trong-đoạn-mã — giữ nguyên
- glob-hai-sao-trần — giữ nguyên
- nhiều-glob-một-dòng — giữ nguyên
- glob-mở-đầu-hai-sao — giữ nguyên
- glob-một-sao — giữ nguyên
- sao-trong-đoạn-mã — giữ nguyên nội dung đoạn mã
- đậm-chuẩn — lột dấu, giữ chữ
- nghiêng-chuẩn — lột dấu, giữ chữ
- đậm-nghiêng-ba-sao — lột dấu, giữ chữ
- đậm-lỏng-có-khoảng-trắng — giữ nguyên (chuẩn CommonMark không coi là nhấn mạnh)
- nghiêng-lỏng-có-khoảng-trắng — giữ nguyên
- đậm-và-glob-cùng-dòng — lột đậm, giữ glob
- đậm-dính-chữ-trước — lột dấu, giữ chữ
- đậm-dính-dấu-câu-trước — lột dấu, giữ chữ
- đậm-dính-gạch-ngang-trước — lột dấu, giữ chữ
- glob-trong-cụm-đậm — lột cụm đậm bao ngoài, giữ glob
- glob-mở-đầu-một-sao — giữ nguyên
- liên-kết — lột dấu, giữ nhãn
- sao-lẻ-không-cặp — giữ nguyên (dấu sao đơn độc trong văn xuôi kỹ thuật)
- đuôi-sao-bắt-mọi — giữ nguyên (khoá/mã + sao nghĩa là mọi biến thể: executors.design.*, GP*)
- cờ-gạch-sao — giữ nguyên (mẫu cờ dòng lệnh --*, -*)
- sao-trước-ngoặc-đóng — giữ nguyên (đuôi biểu thức mẫu như a.*) trong văn kỹ thuật)
- sao-sau-lớp-ký-tự — giữ nguyên (đuôi regex ]* trong văn kỹ thuật)
<!-- STRIP-SHAPE-MATRIX>>> -->

## Criteria

- AC-1: Given một đường dẫn có dấu sao ở bất kỳ hình dạng nào trong bảng trên,
  When thẻ lột định dạng để in cho người, Then kết quả ĐÚNG kỳ vọng đã khai
  cạnh tên hình dạng đó — không hình dạng nào để hệ quả tự quyết.
- AC-2: Given tập tên hình dạng trong bảng trên, When chạy phép đo, Then tập
  tên rút từ bảng ca của phép đo BẰNG tập đó; hai đột biến bắt buộc cùng lần
  chạy — xoá một hàng và ĐỔI TÊN một hàng — đều phải ĐỎ và thông điệp nêu đúng
  tên hình dạng thiếu.
- AC-3: Given chữ đậm chuẩn, chữ nghiêng chuẩn và dạng ba sao, When lột định
  dạng, Then dấu bị bỏ và chữ giữ nguyên — hành vi cũ không suy giảm.
- AC-4: Given một dòng có CẢ chữ đậm thật LẪN đường dẫn có sao, When lột định
  dạng, Then chữ đậm được lột và đường dẫn giữ nguyên trong cùng một lần.
- AC-5: Given bản TRƯỚC-DIFF của thẻ lấy tại mốc ghi trong sổ quyết định, When
  chạy cùng bảng ca, Then bản cũ ĐỎ ở đúng những hình dạng khai cờ "bản cũ
  sai" và XANH ở các hình dạng còn lại; cả hai tập đều không rỗng.
- AC-6: Given hồ sơ THẬT trong `_acceptance/` có đường dẫn chứa sao, When sinh
  thẻ Cổng 1 và Cổng 2 thật, Then mọi đường dẫn đó xuất hiện nguyên vẹn; và
  thẻ không chứa bản cụt mà nguồn không hề có. Sanity: số đường dẫn tìm được
  trong nguồn > 0.
- AC-7: Given thẻ sinh từ bản cũ và bản mới trên cùng hồ sơ thật, When so từng
  dòng, Then MỌI cụm sao chỉ-có-ở-bản-mới phải nằm trong một chuỗi xuất hiện
  NGUYÊN VĂN trong file nguồn (chiều thuận), VÀ không cụm sao nào chỉ-có-ở-bản
  -mới mà không truy được về nguồn (chiều nghịch) — không dùng phép chuẩn hoá
  bỏ-sao rồi so bằng, vì phép đó xoá đúng dấu vết cần bắt.
- AC-8: Given một đột biến "không lột chữ đậm nữa" tiêm vào bản sao, When chạy
  phép đo của AC-7, Then ĐỎ với thông điệp ghim; đối chứng dương: bản nguyên
  vẹn XANH trước khi tin kết quả đỏ.
- AC-9: Given MỌI cụm dấu sao rút được từ hồ sơ thật trong `_acceptance/`, When
  chạy qua cả bản cũ lẫn bản mới, Then mọi chênh lệch phải thuộc một hình dạng
  CÓ TÊN trong bảng trên; chênh lệch không thuộc hình dạng nào → ĐỎ kèm chuỗi
  gốc. Sanity: số cụm rút được > 0 và ghi vào bằng chứng.
- AC-10: Given số chỗ gọi hàm lột trong mã nguồn của thẻ, When chạy phép đo,
  Then số đó khớp con số khai ở trục C mục Coverage (lệch → ĐỎ, chống trục
  trôi khỏi mã); mỗi lối gọi khác biệt phải có ít nhất một đầu ra thật được
  sinh và kiểm, lối nào cố ý không đo phải có dòng `descope` nêu đích danh số
  lượng và lý do.
- AC-11: Given bộ kiểm hiện hành, When chạy sau thay đổi, Then toàn bộ xanh, và
  không phép đo cũ nào của thẻ bị SỬA trong diff feature này — chỉ được THÊM
  (chống hợp thức hoá hành vi mới bằng cách hạ thước cũ).
- AC-12: Given mốc so-bản-cũ đã ghi trong `decisions.jsonl` khi mở vòng, When
  phép đo cần bản cũ, Then ĐỌC mốc từ sổ chứ không tự suy lại; cây kiểm không
  có commit đó (bản sao nông, sau khi gộp nhánh) → thông điệp RIÊNG phân biệt
  rõ "không lấy được bản cũ" với "hành vi sai", không đỏ oan như một khiếm
  khuyết sản phẩm.

- AC-13: Given mọi cụm dấu sao rút được từ hồ sơ thật trong `_acceptance/`,
  When phân loại từng cụm theo bảng hình dạng, Then MỌI cụm phải khớp ít nhất
  một hình dạng CÓ TÊN — cụm không khớp hình dạng nào → ĐỎ kèm chuỗi gốc và
  tên việc chứa nó. Bảng do đó bị buộc phải phủ dữ liệu thật, không phải phủ
  trí tưởng tượng của người viết (3 vòng trước trượt đúng chỗ này).

## Coverage

Từ morphological-scan (3 trục — thước CE trong ngoặc):

- **A — hình dạng đánh dấu** (CE: **23** hình dạng khai trong bảng
  `STRIP-SHAPE-MATRIX` ở trên, mỗi hình dạng có kỳ vọng — con số này nay do
  CORPUS quyết, xem AC-13): AC-1 (kỳ vọng từng hình dạng), AC-2 (tính toàn
  phần của tập tên), AC-3 (nhóm lột), AC-4 (lồng), AC-13 (bảng phủ corpus)
- **B — nội dung bị đe doạ** (CE: quét nguồn thật — đường dẫn chứa sao có mặt
  trong hồ sơ nhiều việc [SP]): AC-6 (đường dẫn nguyên vẹn), AC-9 (mọi cụm sao
  thật đều thuộc hình dạng có tên), AC-5 (bản cũ sai ở đâu)
- **C — mặt trình bị ảnh hưởng** (CE: **17** chỗ gọi hàm lột, đếm từ chính mã
  nguồn `scripts/gate-card.js` — phép đo AC-10 canh con số này): AC-6 (2 thẻ
  cổng), AC-7/AC-8 (đường đọc-cũ hai chiều), AC-10 (mọi lối gọi), AC-11 (bộ
  kiểm sẵn có), AC-12 (mốc so sánh)

## Out of scope

- Viết một trình bày markdown đầy đủ (bảng, danh sách lồng, trích dẫn).
- Đổi cách trang bằng chứng hay bản đồ sản phẩm trình bày — chúng dùng chung
  hàm bị sửa nên AC-10 canh, không để tuyên bố này gánh một mình.
- Chuẩn hoá cách hồ sơ viết đường dẫn (thuộc vòng "luật mô tả tiếng sản phẩm").

## Notes

Known limits — chấp nhận tại Cổng 2, Manh Phan 2026-08-06, sau 4 vòng verify
(người uỷ quyền vòng 4 vượt trần, rồi chọn ship thay vì vòng 5). Nhóm theo lớp:

- **Hồi quy nhấn-mạnh-lồng.** `**A *B* C**` nay để lại dấu sao thô (bản cũ lột
  được): lớp nội dung của luật đậm không cho phép dấu sao bên trong nên cụm
  ngoài không khớp. Hình dạng này hiện **0 lượt** trong hồ sơ thật — đó là lý
  do chấp nhận được, không phải lý do nó vô hại. Revisit: bộ quét tuyến tính
  (đường (c) đã cân nhắc và hoãn).
- **Chân "bảng phủ corpus" đang hạ thước.** Ngưỡng dung sai 25 mẫu mồ côi
  trong khi số thật là 18 — người viết đặt thước cao hơn vật cho vừa xanh,
  đúng lớp lỗi bất biến CLAUDE.md cấm. Phải siết về 0 kèm sửa bộ phân loại
  (che đoạn mã thay vì xoá, như chính hàm lột đang làm) ở đợt dọn.
- **Hai chỗ fail-open còn sót trong bộ đo.** Bộ đếm thẻ render đếm rồi vứt
  (tiêm lỗi giết đúng thẻ của chính việc này mà phép đo vẫn xanh); chân phủ-
  corpus không có đối chứng dương thật sự chạy được. Cùng lớp với hai chỗ đã
  sửa ở vòng 2-3 — sửa chưa hết lớp.
- **Bốn phép đo đo yếu hơn điều khai:** đường-dẫn-nguyên-vẹn đo hiệu số thay
  vì quan hệ toàn phần; quét-corpus không chạy qua bản cũ nên quan hệ cũ↔mới
  chưa được ghim; đếm-lối-gọi đo từ vựng thay vì đầu ra từng lối; chống-hạ-
  thước kiểm chuỗi-có-mặt thay vì quan hệ theo khối.
- **Câu Out of scope sai tiền đề:** trang bằng chứng và bản đồ sản phẩm KHÔNG
  dùng chung hàm lột (grep toàn nguồn: chỉ `scripts/gate-card.js`), nên lý do
  "AC-10 canh" không đúng. Lý do đúng: hai mặt kia không gọi hàm này nên không
  mang lớp lỗi. Rủi ro thật thấp, nhưng hồ sơ sẽ được đọc như tiền lệ.
- Vặt: biến `checked` gán rồi không đọc (sót của đợt "xoá hàm chết" vòng 2).

**Vì sao vẫn ship:** trên 25 hồ sơ thật, bản mới cải thiện **26 dòng** và có
**0 hồi quy**; hai khuyết tật tiền-tồn (đường dẫn trong cụm đậm, glob mở đầu
một sao) đã đóng — đó là hai thứ ba vòng đầu không chạm tới được.
