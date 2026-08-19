# TOOL-KILL-RULE — lệnh bị công cụ ngắt KHÔNG phải lệnh fail

**Nguồn duy nhất** của luật «hết giờ không phải trượt» cho MỌI đường chạy lệnh
kiểm của kit. Hai đường tiêu thụ, cùng đọc khối marker dưới đây, không chép tay:

- **Vòng lặp tính năng** (plugin feature-loop): skill `feature-loop` đọc file này
  (resolve qua `resolve-plugin.mjs --require skills/acceptance/references/tool-kill-rule.md`)
  và truyền NGUYÊN VĂN vào `args.toolKillRule` của workflow
  `acceptance-verify.js`; workflow rút khối marker và nội suy vào prompt của mọi
  agent chạy lệnh (machine · ui-check · baseline). Thiếu args hoặc không rút
  được marker → workflow trả BLOCKED có tên, không chạy không luật.
- **Đường VERIFY độc lập** (skill `acceptance` Phase 3): phiên điều phối chép khối
  marker VERBATIM vào prompt của phiên tươi VERIFY, cùng nếp «Network truth».

Vì sao có luật: verifier chạy lệnh qua Bash tool có trần thời gian mặc định
(~120 s) NGẮN hơn nhiều suite; lệnh bị công cụ giết trả exit code CỦA CÔNG CỤ,
không phải của lệnh (vấp thật release-2-2-0 S4 r5: suite 108 s đơn lẻ, dưới tải
bị giết ở 118 s → REJECT giả 4 eval). Nhận diện là việc AGENT (nó thấy tool
result thật); phần máy chỉ phòng thủ trên field cấu trúc `killedByTool` —
KHÔNG grep nội dung output trong engine (chuỗi tổng kết là của suite từng repo).

<!-- <<<TOOL-KILL-RULE -->
TRAN THOI GIAN CONG CU: khi goi Bash chay lenh, LUON dat tham so timeout >= 600000 (ms) — tran mac dinh cua cong cu (~120s) NGAN hon nhieu suite; lenh vuot tran se bi CONG CU giet va exit code luc do la cua cong cu, KHONG phai cua lenh. Neu lenh van bi cong cu dung (tool result bao timeout/killed, hoac output bi CAT giua chung truoc dong tong ket cuoi cua lenh) → DO KHONG PHAI ket qua that: khai cannotRun=true + killedByTool=true + reason "bi cong cu giet o <so giay> giay" kem dau hieu (timeout tool / output cat). TUYET DOI khong bao exitCode nhu the lenh tu fail va khong doan PASS/FAIL tu output cut.
<!-- TOOL-KILL-RULE>>> -->

## Hồ sơ cho lượt bị ngắt (đường độc lập)

Phiên tươi VERIFY gặp lệnh bị công cụ ngắt thì:

- dòng run-log của eval đó: `"exit_code": null, "killed_by_tool": true` (không
  ghi mã thoát của công cụ như mã thoát của lệnh);
- verdict báo cáo `BLOCKED`, `reason: bi cong cu giet o <so giay> giay — <eval ids>`
  (kèm dấu hiệu: timeout tool / output cắt trước dòng tổng kết); `failed_evals`
  rỗng — người đọc hồ sơ thấy đây là sự cố hạ tầng, chữa bằng chạy lại với trần
  công cụ đủ dài, không phải sửa sản phẩm.
