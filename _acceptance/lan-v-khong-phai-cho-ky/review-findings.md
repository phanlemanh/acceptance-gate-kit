# Review Findings: lan-v-khong-phai-cho-ky (round 4)

## Trong hợp đồng

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): LV5 khai «×» nhưng là 21 điểm chọn tay, không có số đếm khai trước**
  file: `tests/plugins/lan-v.test.mjs:250`
  severity: low
  source: measurement
  AC: AC-1
  detail: E1 expected (evals.yaml dòng 19–21) mô tả mặt cắt như một tích: «sáu điều kiện … ở CẢ HAI nhánh Cổng 1 — × veto vắng/mo-vết/mo-hỏng/da-veto × gate1_skipped». Trong mã, `MAT_CAT` (dòng 250–272) là danh sách 21 bộ chọn tay: da-veto chỉ ghép với nguoi-sach, gate1_skipped chỉ ghép với sach/kl-co, mo-hỏng không ghép T3 hay PENDING, v.v. Khác LV4 (ghim `oDem !== 240` và `oDone !== 2`), LV5 chỉ đếm `n` để in (dòng 296) chứ không so với một con số khai trước — bớt phần tử khỏi MAT_CAT thì ca vẫn xanh im lặng. Không phán phạm vi; chỉ nêu: lời tuyên trong eval là ma trận, phép đo là điểm-case.
  rationale: AC-1 đòi ma trận phủ sáu điều kiện xanh-sạch, mỗi điều kiện một chiều trượt, MỖI CÁI ở cả hai nhánh Cổng 1; finding chỉ ra các tổ hợp chọn tay của LV5 không phủ mỗi điều kiện ở cả hai nhánh (vd da-veto chỉ ghép một chiều) và không có số đếm khai trước để phát hiện khi bị co hẹp — đúng yêu cầu coverage mà AC-1 nêu bị hụt.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Bảng phân ô được start-scan khai là «nguồn sự thật» không còn khớp với code: hàng verified+PASS+chưa ký vẫn nói «chờ-Cổng-Bằng-chứng» vô điều kiện**
  Người dùng thấy gì: Tài liệu hướng dẫn cách máy chọn hồ sơ chưa được cập nhật theo thay đổi mới, nên người đọc tài liệu có thể hiểu nhầm là một hồ sơ đã đủ điều kiện vẫn luôn phải chờ người ký.
  file: `docs/specs/2026-08-03-start-command-design.md:110`
  severity: high
  Đề xuất: known-limits

- **Con trỏ sổ known-limits trong vị từ trỏ vào entry đã đóng nói về lớp khác; lớp «hai bản dựng độc lập của luật sáu điều kiện» không có dòng sống nào**
  Người dùng thấy gì: Một ghi chú giải thích trong sản phẩm trỏ nhầm sang lý do khác, có thể khiến người đọc sau này hiểu sai vì sao một giới hạn được chấp nhận.
  file: `scripts/khong-can-nguoi.mjs:24`
  severity: medium
  Đề xuất: known-limits

- **Chân cay-that so máy quét với TOÀN BỘ tập VIOLATION của lưới trên mọi hồ sơ verified-chưa-ký của cây thật — thước rộng hơn vật, đỏ vì lý do ngoài vị từ**
  Người dùng thấy gì: Phép kiểm tự động có thể báo lỗi trong tương lai vì một hồ sơ khác, không liên quan đến tính năng này, gặp vấn đề — khiến người phải mất công điều tra nhầm hướng trước khi nhận ra lỗi không thuộc về tính năng đang xét.
  file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh:123`
  severity: low
  Đề xuất: known-limits

- **Chân cay-that: nhánh fail-closed «không đọc được JSON máy quét» là mã chết — lỗi JSON/KeyError bị đọc thành «không done»**
  Người dùng thấy gì: Nếu dữ liệu đầu vào của phép kiểm tự động bị hỏng hoặc sai định dạng, phép kiểm có thể âm thầm báo 'ổn' thay vì báo lỗi rõ ràng, khiến vấn đề thật bị bỏ sót.
  file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh:143`
  severity: low
  Đề xuất: known-limits

- **Chân cay-that phụ thuộc trạng thái của hai hồ sơ KHÔNG liên quan (release-2-0-0, release-2-1-0) để đạt sàn ≥2**
  Người dùng thấy gì: Kết quả kiểm tra tự động của tính năng này phụ thuộc vào trạng thái của các hồ sơ khác không liên quan; khi các hồ sơ đó thay đổi trạng thái, phép kiểm có thể báo lỗi dù tính năng đang xét không có vấn đề gì.
  file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh:150`
  severity: low
  Đề xuất: known-limits

- **Hồ sơ đang ở status implemented với evidence verdict BLOCKED (E9 FAIL P122/P126) — lưới trước-merge trên chính nhánh này đang VIOLATION**
  Người dùng thấy gì: Nhánh mã hiện tại chưa qua được cổng kiểm trước khi gộp vì thiếu chữ ký duyệt hoặc bằng chứng đạt yêu cầu, nên chưa thể đưa vào sản phẩm ở bước tiếp theo.
  file: `_acceptance/lan-v-khong-phai-cho-ky/evidence-report.md:4`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): lỗi python bị gộp vào «không done» trong chân cay-that**
  Người dùng thấy gì: Nếu dữ liệu đầu vào của phép kiểm tự động bị lỗi, phép kiểm có thể âm thầm coi đó là 'chưa xong' thay vì báo lỗi rõ ràng, khiến vấn đề thật bị che khuất.
  file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh:146`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (thiếu đối chứng dương cùng cách chép): LV4 bị đòi ĐỎ dưới mutant nhưng chưa bao giờ được chứng XANH trên bản sao A**
  Người dùng thấy gì: Ba phép thử 'phải báo lỗi khi bị phá hỏng' của phép kiểm có thể luôn báo lỗi vì một nguyên nhân khác từ trước, khiến người tin nhầm là phép kiểm đang hoạt động đúng trong khi nó chưa từng được xác nhận thật sự bắt được lỗi đó.
  file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh:92`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 6 (neo vào checkout của tác giả): chân cay-that ghim `--base main` là nhánh cục bộ**
  Người dùng thấy gì: Phép kiểm dùng nhánh chính trên máy đang chạy làm mốc so sánh; nếu máy đó chưa cập nhật hoặc không có sẵn nhánh đó, phép kiểm có thể báo lỗi sai không liên quan tới tính năng, hoặc bỏ sót vấn đề thật.
  file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh:126`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/10 lỗi rơi vào file không bộ đo nào phủ (docs/specs/2026-08-03-start-command-design.md, _acceptance/lan-v-khong-phai-cho-ky/evidence-report.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
