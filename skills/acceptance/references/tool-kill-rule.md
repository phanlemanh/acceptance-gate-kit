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

Lệnh dài hơn trần 600 s của công cụ thì KHÔNG bị giết: công cụ **đẩy nó sang
nền** và nó chạy tiếp. Tệp đầu ra nền trống tới phút chót, vì khung bọc lệnh của
kit chỉ in khi lệnh xong — đọc trống thành «bị giết» là đúng sự cố crm 07/10/2026
(hồ sơ `lenh-dai-chay-rieng`: hai lượt BLOCKED giả). Dòng «chuyển sang nền» trong
khối dưới là lối LỜI cho mọi lệnh. Lối MÁY: eval khai `long_running: <phút>`
trong `evals.yaml` thì lượt chấm feature-loop tự chạy lệnh nền, ghi nhật ký ở
`.acceptance-runs/<slug>/s4-lenh-dai/` và chờ bằng lệnh nó sinh ra
(`eval-executors.md`, mục `long_running`).

<!-- <<<TOOL-KILL-RULE -->
TRAN THOI GIAN CONG CU: khi goi Bash chay lenh, LUON dat tham so timeout >= 600000 (ms) — tran mac dinh cua cong cu (~120s) NGAN hon nhieu suite; lenh vuot tran se bi CONG CU giet va exit code luc do la cua cong cu, KHONG phai cua lenh. Neu lenh van bi cong cu dung (tool result bao timeout/killed, hoac output bi CAT giua chung truoc dong tong ket cuoi cua lenh) → DO KHONG PHAI ket qua that: khai cannotRun=true + killedByTool=true + reason "bi cong cu giet o <so giay> giay" kem dau hieu (timeout tool / output cat). TUYET DOI khong bao exitCode nhu the lenh tu fail va khong doan PASS/FAIL tu output cut.
DAU RA DAI: harness co the CAT DAU RA RA TEP ("Output too large … saved to <tep>") va chi hien doan DAU — do KHONG phai bi cong cu giet: doc DUOI tep do (tail) de lay dong tong ket va ma thoat; chi khai killedByTool khi tool result bao timeout/killed that.
CHUYEN SANG NEN KHONG PHAI BI GIET: tool result bao lenh chua xong trong timeout va da duoc CHUYEN SANG NEN ("moved to the background", kem ID + tep dau ra) → lenh VAN DANG CHAY: KHONG khai killedByTool, KHONG ket luan tu tep dau ra luc do. Tep dau ra nen TRONG la binh thuong — khung boc lenh chi in duoi dau ra + dong __EXIT=<n> khi lenh XONG. Cho bang lenh Bash co gioi han (moi lan goi ≤ 100 giay, duoi tran mac dinh 120 giay cua cong cu; vd vong lap kiem tep do co dong __EXIT= chua, sleep vai giay, het 100 giay thi thoat) va goi lai toi khi tep co dong __EXIT=<n> → doc ma tu dong do nhu binh thuong. Tong thoi gian cho toi da = so phut eval khai o long_running (vang thi 30 phut), tinh tu luc chay lenh; qua ma chua co dong __EXIT → cannotRun=true + reason "lenh chay qua <so> phut chua xong — khai long_running: <phut> cho eval trong evals.yaml" (KHONG killedByTool), va dung tac vu nen neu cong cu cho phep.
<!-- TOOL-KILL-RULE>>> -->

## Hồ sơ cho lượt bị ngắt (đường độc lập)

Phiên tươi VERIFY gặp lệnh bị công cụ ngắt thì:

- dòng run-log của eval đó: `"exit_code": null, "killed_by_tool": true` (không
  ghi mã thoát của công cụ như mã thoát của lệnh);
- verdict báo cáo `BLOCKED`, `reason: bi cong cu giet o <so giay> giay — <eval ids>`
  (kèm dấu hiệu: timeout tool / output cắt trước dòng tổng kết); `failed_evals`
  rỗng — người đọc hồ sơ thấy đây là sự cố hạ tầng, chữa bằng chạy lại với trần
  công cụ đủ dài, không phải sửa sản phẩm.

Lệnh bị đẩy sang nền rồi QUÁ trần chờ (`long_running`, vắng thì 30 phút) cũng
là sự cố hạ tầng chứ không phải lệnh hỏng: dòng run-log `"exit_code": null`,
`"cannot_run": true` (KHÔNG `killed_by_tool` — công cụ không giết nó), verdict
`BLOCKED`, reason gọi tên việc cần làm (khai `long_running: <phút>` cho eval).
