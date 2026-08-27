## Trong hợp đồng

- **_fill_alpha misreads 3-component rgb() as rgba — an opaque box can be silently skipped**
  file: `diagram-design/skills/diagram-design/scripts/check_label_occlusion.py:90`
  severity: medium
  AC: AC-4
  detail: The regex `rgba?\(\s*[^)]*?,\s*([\d.]+)\s*\)\s*$` accepts three-component `rgb()` too, and then reads the BLUE channel as alpha. Any occluder painted `fill="rgb(r,g,0)"` (or any blue channel ≤ 0.5) is judged transparent by `_opaque()` and never compared against the labels underneath.

  Reproduced against the shipped script:

    fill="rgb(45,49,0)"  → exit 0, no OCCLUDED line   (WRONG — opaque box covering the label)
    fill="rgb(45,49,66)" → exit 1, OCCLUDED … "FILL THU"  (correct, only because 66 > 0.5)

  This matters more than an ordinary edge case because it sits inside the one part of the tool the diff explicitly claims is complete. The docstring says "Transparency detection IS closed and complete", LOCAL-PATCHES §8 repeats it, and contract AC-4 builds on it ("Danh sách các dạng trong suốt là ĐÓNG"). The E4 matrix backing that claim tests five transparent forms and three opaque forms, all in hex or `rgba()` — no `rgb()` case, so it is an allowlist with no RED outside the list, the class already in the repo's ledger (`allowlist-red-must-test-outside`). The deliberately narrowed SHAPE space is documented honestly; this hole is in the space that was declared closed.

  Bounded fix: require exactly four components for the alpha branch (e.g. `rgba\(\s*[^,)]+,[^,)]+,[^,)]+,\s*([\d.]+)\s*\)`), and add `rgb(45,49,0)` to the red side of the E4 matrix. Note the source file is vendored — the edit belongs in ~/dev/skill, then vendor-sync.sh.
  rationale: AC-4 states the transparent-notation list is CLOSED to five forms and requires a plain opaque rect to yield exit 1; this bug makes an opaque rect (rgb() notation) wrongly read as alpha-bearing and yield exit 0, contradicting that closure.

- **Hình dạng 5 — tuyên «MA TRẬN TOÀN PHẦN» trên không gian ĐÓNG nhưng chỉ phủ 5/≥9 phần tử bên đọc**
  file: `_acceptance/thuoc-nhan-de-khoi/rang.sh:137`
  severity: medium
  AC: AC-4
  detail: E4 (evals.yaml:36–41) khai «MA TRẬN TOÀN PHẦN 8 ca … không gian «trong suốt» của SVG HỮU HẠN nên danh sách ĐÓNG được», và docstring `_fill_alpha` (check_label_occlusion.py:87–88) khai «Only these two notations can carry alpha … this set is closed». Nhưng bên ĐỌC là `_opaque()` (check_label_occlusion.py:102–117), và nó nhận nhiều dạng hơn danh sách 5 ca ở dòng 137–141:

  - `fill="transparent"` — nhánh riêng ở dòng 104 (`fill.lower() in ("none", "transparent")`), không ca nào chạm
  - hex 4 chữ số `#rgba` — nhánh `[0-9a-f]{4}` với `aa = h[3]*2` ở dòng 94–97, không ca nào chạm (chỉ có hex-8 `#2d314210`)
  - `style="fill:none"` / `style="fill-opacity:0.3"` / `style="opacity:0.2"` — `_style_get` ở dòng 103 và 110 ưu tiên hơn attribute, ba đường vào này không ca nào chạm

  Tức số assert (5 xanh) không bằng số phần tử của không gian mà chính reader thừa nhận (≥9). Vì lời tuyên là ĐÓNG chứ không phải điểm-case, khoảng hở này không phải giới hạn đã khai — nó là ma trận viết-trước bị hụt, và mọi nhánh trên có thể hỏng mà 8 ca vẫn xanh.
  rationale: AC-4 explicitly claims the transparent-notation list is CLOSED; this finding demonstrates the reader (_opaque()) actually recognizes at least four more notations (transparent keyword, hex-4 #rgba, and two style-attribute forms) than the five the AC tests, directly falsifying the closure claim.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **NOTICE pins a skill-repo commit that exists only on this machine (unpushed)**
  Người dùng thấy gì: Bản ghi nguồn gốc cho bản vá thước mới trỏ tới một thay đổi chưa được lưu trên máy chủ dùng chung, nên người khác tải lại kho không thể xác minh bản vá này thực sự đến từ đâu.
  file: `diagram-design/NOTICE`
  severity: high
  Đề xuất: known-limits

- **Non-UI round is missing the required «bỏ đặc-tả-UX — » descope entry**
  Người dùng thấy gì: Vòng làm việc này không có giao diện người dùng nhưng thiếu đúng ghi chú giải thích vì sao bỏ qua phần đặc tả giao diện, khiến hồ sơ không theo đúng khuôn chuẩn của các vòng làm việc khác.
  file: `_acceptance/thuoc-nhan-de-khoi/decisions.jsonl`
  severity: low
  Đề xuất: known-limits

- **surfaces value is outside the documented enum**
  Người dùng thấy gì: Hồ sơ này ghi loại giao diện bằng nhãn không nằm trong danh sách chuẩn, có thể khiến các công cụ đọc hồ sơ sau này phân loại sai loại tính năng.
  file: `_acceptance/thuoc-nhan-de-khoi/contract.md`
  severity: low
  Đề xuất: known-limits

- **Checker exits 0 when input files fail to read, as long as one file parsed**
  Người dùng thấy gì: Khi một số tệp hình cần kiểm tra bị đặt sai tên hoặc thiếu, công cụ có thể báo 'đạt' dù thực ra chưa kiểm tra được những tệp đó, khiến người xem yên tâm nhầm rằng mọi hình đã sạch.
  file: `diagram-design/skills/diagram-design/scripts/check_label_occlusion.py`
  severity: high
  Đề xuất: new-contract

- **_num() silently drops unit-suffixed lengths — occluder rects with px units are never checked**
  Người dùng thấy gì: Những hộp che vẽ bằng đơn vị đo khác (như px) — dạng phổ biến khi xuất từ công cụ thiết kế — có thể không được công cụ nhận ra là đang che nhãn, nên một nhãn thực sự bị che có thể lọt qua mà không có cảnh báo.
  file: `diagram-design/skills/diagram-design/scripts/check_label_occlusion.py`
  severity: medium
  Đề xuất: new-contract

- **Self-closing <text/> makes a label inherit the next label's text**
  Người dùng thấy gì: Khi một nhãn được viết theo một cách viết ít gặp, công cụ có thể báo nhầm tên nhãn khác bị che thay vì tên nhãn thật sự bị che, khiến người đọc báo cáo bị chỉ sai chỗ cần sửa.
  file: `diagram-design/skills/diagram-design/scripts/check_label_occlusion.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm-tính-một-mình: chiều đỏ CHÉP công thức pathspec thay vì gọi `cham_vung_ngoai`**
  Người dùng thấy gì: Bước kiểm tra tự động đảm bảo vòng làm việc này không đụng vào các hình đã chốt trước đó có thể không thực sự phát hiện được vi phạm nếu nó xảy ra, nên lời cam kết 'không đụng vùng cấm' chưa có bằng chứng chắc chắn.
  file: `_acceptance/thuoc-nhan-de-khoi/rang.sh`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 2 — chiều đỏ chạy trên chuỗi VIẾT TAY, không phải đầu ra của vật đo**
  Người dùng thấy gì: Một số phép kiểm chứng trong bộ kiểm tra của vòng làm việc này so sánh với câu chữ tự đặt ra thay vì với kết quả thật do công cụ sinh ra, nên các phép kiểm đó không chắc sẽ báo lỗi khi có sự cố thật xảy ra sau này.
  file: `_acceptance/thuoc-nhan-de-khoi/rang.sh`
  severity: medium
  Đề xuất: new-contract

## Chưa adversarial-verify (refuter chết)

(không có mục nào)

⚠ Cụm ngoài vùng phủ: 3/10 lỗi rơi vào file không bộ đo nào phủ (diagram-design/NOTICE, _acceptance/thuoc-nhan-de-khoi/decisions.jsonl, _acceptance/thuoc-nhan-de-khoi/contract.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.