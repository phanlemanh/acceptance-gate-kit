# Review Findings: ra-co-ten-lam-va-trao (round 2)

## Trong hợp đồng

**Hình dạng 4 — chiều đỏ (iv-a) không chạm phép đo thật: file tiêm được ghi ra cây tạm rồi bỏ đó, bước quét không chạy lại**
file: `tests/plugins/ra-co-ten.test.mjs:718`
severity: medium
source: measurement
AC: AC-13
detail: RT13 khối chiều đỏ (iv-a), dòng 717–724: chú thích khai «TIÊM file thật vào cây tạm rồi chạy lại CHÍNH phép quét trên đó». Thực tế `const g = tmp('rt13-grep-')` và `W(g, 'scripts/gia-lap-bo-doc-moi.mjs', ...)` tạo ra một file KHÔNG BAO GIỜ được đọc lại — `files2 = [...filesThat, 'scripts/gia-lap-bo-doc-moi.mjs']` chỉ nối một chuỗi tên vào mảng rồi gọi hàm thuần `soSanh`. `grepSignedOff()` (git grep + bộ lọc `NGOAI`, dòng 693–695) không hề chạy trên `g`. Nên bước THẬT sinh ra `filesThat` — chính chỗ có thể hỏng (regex `NGOAI` nuốt nhầm, `git grep` không thấy file mới, đường dẫn tương đối lệch) — không có chiều đỏ nào; chỉ còn sàn đếm `filesThat.length < 5`. Đây đúng lớp «chiều đỏ giả» mà chú thích ngay trên (dòng 690–692) tuyên đã sửa: tiêm vào đầu vào của hàm thuần chứng minh được hàm thuần, không chứng minh được phép quét.
rationale: AC-13(iv) đòi «chiều đỏ tiêm một file mới chứa chuỗi vào bản sao» rồi chạy lại phép quét — ca RT13 chỉ nối tên file vào một mảng và gọi hàm thuần, không chạy lại bước quét thật trên file đã tiêm.

**Hình dạng 4 — eval khai chiều đỏ mà thân ca không có: E1 (bản sao contract-template bỏ machine-cleared) và E13 (tiêm hồ sơ timebox quá hạn)**
file: `_acceptance/ra-co-ten-lam-va-trao/evals.yaml:20`
severity: medium
source: measurement
AC: AC-1
detail: E1 `expected` (dòng 20) khai «Chiều đỏ: bản sao khuôn bỏ `machine-cleared` → reader đỏ nêu giá trị thiếu» (AC-1 cũng khai vậy). Trong RT1 (dòng 171–209) chỉ có MỘT bản sao khuôn: `evidence-report-template.md` bị gỡ dòng `sections` (dòng 202–206). Không có bản sao `contract-template.md` nào — vế round-trip enum khuôn↔lib (`STATUS_ENUM_FROM_TPL`, dòng 42–46) chưa bao giờ được chứng minh là đỏ được. E13 `expected` (dòng 170) khai chiều đỏ thứ ba «tiêm một hồ sơ tạm có Timebox quá hạn mà chặn cờ → đỏ nêu vế đẳng thức trượt»; RT13 (iii) (dòng 670–687) chỉ so quan hệ trên cây thật, không có lệnh tiêm nào. Điều đó có giá thật ở đây: trên cây hiện tại 0/70 hồ sơ mang cờ (`start-scan --root .`: mọi `flags` đều rỗng; 5 timebox đều còn hạn), nên vế «có cờ» của đẳng thức ⇔ chưa bao giờ cháy — xoá hẳn đoạn gắn cờ `qua-timebox` trong `start-scan.mjs` thì (iii) vẫn xanh. Người verify đọc `expected` sẽ tin hai chiều đỏ đó đã chạy.
rationale: AC-1 đòi round-trip khuôn↔lib cho DANH SÁCH TRẠNG THÁI: «bản sao khuôn thiếu một giá trị → đỏ nêu giá trị» — ca RT1 chỉ có bản sao khuôn evidence-report-template, không có bản sao contract-template nào chứng minh vế này của AC-1.

**Hình dạng 3 — assert «chuỗi có mặt» thay cho quan hệ: răng chống-blacklist của RT13(iv) đối chiếu TÊN FILE trần**
file: `tests/plugins/ra-co-ten.test.mjs:705`
severity: low
source: measurement
AC: AC-13
detail: `const coCa = f => khaiPaths.has(f) && testSrc.includes(f.split('/').pop())` (dòng 705). Vế thứ hai được thêm để lời khai `paths:` không tự miễn trừ (chú thích dòng 696–698), nhưng nó chỉ hỏi «tên file trần có xuất hiện đâu đó trong mã nguồn ca hay không», không hỏi quan hệ «file này thật sự bị một assert nào đọc». Vì `basename` đụng nhau, ba file khác nhau `skills/uat-session/SKILL.md`, `skills/acceptance/SKILL.md`, `feature-loop/skills/feature-loop/SKILL.md` cùng thoả vế đó bằng một lần xuất hiện duy nhất của chuỗi `SKILL.md`; `run-tests.sh` cũng có hai file cùng tên. Hôm nay cả 15 file đều có ca thật nên chưa sai kết luận, nhưng một bộ đọc mới đặt tên trùng (bất kỳ `SKILL.md` nào) chỉ cần thêm tên vào một dòng `paths:` là tắt được răng mà không viết assert nào — đúng lỗ mà vế thứ hai sinh ra để bịt.
rationale: AC-13(iv) đòi «file lạ xuất hiện thì ĐỎ và nêu tên file (chống blacklist trên không gian mở)» — răng đối chiếu chỉ so tên file trần (basename) nên hai file khác đường dẫn trùng tên có thể lẫn nhau, làm yếu đúng bảo đảm chống-blacklist mà AC-13(iv) đòi.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Bản đồ và bộ quét cho hai kết luận trái nhau về cùng hồ sơ: lối «không đo được» chỉ được cài ở start-scan**
  Người dùng thấy gì: Bản đồ tổng quan có thể vẫn hiển thị một hồ sơ đã khai 'không đo được' như đang chờ một phiên nghiệm thu người dùng, dù hồ sơ đó đã đóng theo lối khác — người xem bản đồ dễ hiểu nhầm việc này còn treo.
  file: `scripts/product-map.mjs:182`
  severity: high
  Đề xuất: new-contract

- **Thẻ tự nhận Cổng Đáng cho ô cơ hội ĐÃ ký — thiếu điều kiện «decision rỗng» mà chính commands/approve.md khai**
  Người dùng thấy gì: Một cơ hội đã được quyết định (làm / lặp / xếp lại / dừng) có thể vẫn hiện lại trên thẻ như một quyết định chưa chốt, mời người ký lại — có nguy cơ người bấm nhầm và ghi đè lên quyết định đã có.
  file: `scripts/gate-card.js:194`
  severity: medium
  Đề xuất: new-contract

- **gate-card giữ bản chép tay của hằng UAT_THRESHOLD_HEADING dù đã nhập lib sở hữu nó**
  Người dùng thấy gì: Nếu sau này có người đổi tên tiêu đề mục ngưỡng trong khuôn hồ sơ mẫu mà quên đổi đồng bộ, một phần của việc kiểm tra phạm vi có thể lặng lẽ ngừng bắt lỗi thay vì báo động — rủi ro thấp vì cần một thay đổi khác đi kèm mới lộ ra.
  file: `scripts/gate-card.js:357`
  severity: low
  Đề xuất: known-limits

- **product-map.mjs never produces `da-giao-khong-do` — map and /start give opposite answers for the same record**
  Người dùng thấy gì: Bản đồ tổng quan có thể vẫn hiển thị một hồ sơ đã khai 'không đo được' như đang chờ một phiên nghiệm thu người dùng, dù hồ sơ đó đã đóng theo lối khác — người xem bản đồ dễ hiểu nhầm việc này còn treo.
  file: `scripts/product-map.mjs:182`
  severity: high
  Đề xuất: new-contract

- **gate-card auto-detects Gate 0 for an opportunity whose Cổng Đáng is already signed**
  Người dùng thấy gì: Một cơ hội đã được quyết định (làm / lặp / xếp lại / dừng) có thể vẫn hiện lại trên thẻ như một quyết định chưa chốt, mời người ký lại — có nguy cơ người bấm nhầm và ghi đè lên quyết định đã có.
  file: `scripts/gate-card.js:194`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5 — tuyên quét LỚP nhưng chỉ có điểm-case: ma trận đẳng thức «bộ quét ⇔ lưới» không có hàng machine-cleared**
  Người dùng thấy gì: Bảng đối chiếu dùng để đảm bảo hai phần kiểm tra 'bằng chứng sạch' luôn đồng ý với nhau chưa được bổ sung một trường hợp cho trạng thái mới, dù việc này đã được ghi là sẽ làm — độ tin cậy của phép đối chiếu cho trạng thái mới thấp hơn mức đã hứa.
  file: `tests/plugins/ra-co-ten.test.mjs:405`
  severity: high
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).