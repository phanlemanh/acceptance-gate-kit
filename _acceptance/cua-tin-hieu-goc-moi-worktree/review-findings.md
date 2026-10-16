# Review findings: cua-tin-hieu-goc-moi-worktree (round 2)

## Trong hợp đồng

- **Hình dạng 3 — assert «chuỗi có mặt» cho dòng in của GW-1, trong khi lời hứa là quan hệ «đường tương đối tính từ thư mục chính»**
  AC: AC-1
  file: `tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs:105`
  severity: medium
  source: measurement
  detail: E1 hứa «dòng in nêu đường tương đối thư mục chính». Vật giữ lời hứa này là đổi `path.relative(root, r.tep)` thành `path.relative(cua.goc, r.tep)` trong scripts/gui-tin-hieu.mjs. Nhưng ca1 chỉ kiểm `x.stdout.includes(`tin-hieu/kho/${ten}-${i + 1}.json`)`. Khi gửi từ worktree, bản cũ in `../kho-N/tin-hieu/kho/nguoi-chu-kho-thu-1.json`, và chuỗi này vẫn chứa đúng chuỗi con được kiểm, nên phép đo không phân biệt được hai cách tính đường tương đối. Tôi đã chạy thử: trên bản sao của HEAD, đổi ngược `path.relative(cua.goc, r.tep)` về `path.relative(root, r.tep)` rồi chạy GW_CASES=GW-1,GW-3, kết quả GW-1, GW-1-do, GW-1-do2, GW-3, GW-3-do đều vẫn PASS (5 passed, 0 failed). Không ca đỏ nào nhắm vào chân này. Muốn bắt được thì phải so đúng bằng nhau giữa đường trong dòng in và `path.relative(<thư mục chính>, <tệp>)`, hoặc kiểm dòng in không có `..`, và thêm một ca đỏ tiêm ngược dòng ấy.
  rationale: AC-1 đòi dòng in nêu đường tệp tương đối thư mục chính, mà ca GW-1 vẫn xanh khi đảo ngược chân này nên vế đó của AC-1 chưa được chứng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hàm gocNguon đổi gốc nguồn mặc định cho mọi kho, mà sai với submodule và với --separate-git-dir ngay cả khi không có worktree nào**
  Người dùng thấy gì: Với kho là submodule hoặc kho tách riêng thư mục git, ý gửi vào cửa tín hiệu có thể bị ghi vào chỗ ẩn trong kho cha hoặc ra ngoài kho. Người gửi thấy báo đã ghi nhưng không tìm thấy ý ở thư mục kho.
  Căn cứ: Chỉ ảnh hưởng nhóm kho có bố cục git hiếm và khai cửa tín hiệu; ý không mất nhưng nằm chỗ lạ, người dùng tự lấy ra được; sửa sau không đắt nhưng cần cân trên mọi kho nên để người quyết.
  file: `scripts/tin-hieu.mjs`
  severity: medium
  Đề xuất: known-limits

- **Nhãn gui_tu so một đường đã realpath với một đường có thể chưa resolve, nên ghi nhầm 'worktree' khi --root đi qua symlink**
  Người dùng thấy gì: Khi gửi ý từ thư mục đi qua đường tắt, hoặc từ thư mục con của một worktree, ý có thể bị gắn nhãn nơi gửi sai. Con số đếm ý gửi từ worktree vì thế lệch nhẹ.
  Căn cứ: Ý vẫn được ghi đúng chỗ và không mất; chỉ số thống kê nơi gửi lệch, nhẹ và người dùng không gặp trực tiếp.
  file: `scripts/gui-tin-hieu.mjs`
  severity: low
  Đề xuất: known-limits

- **gocNguon lấy dirname(git-common-dir) làm thư mục chính: ở submodule, kho dùng --separate-git-dir hoặc bare+worktree, ý bị ghi lặng lẽ vào trong .git/ hoặc ra ngoài kho, kể cả khi không có worktree nào**
  Người dùng thấy gì: Ở kho submodule, kho tách thư mục git hoặc kho bare kèm worktree, ý gửi đi có thể nằm trong thư mục git ẩn hoặc dùng chung giữa nhiều kho. Người gửi được báo thành công nhưng ý không hiện ở thư mục kho, và bộ đọc cũng nhìn vào chỗ sai đó.
  Căn cứ: Không mất dữ liệu và đọc lại được nhất quán, nhưng người dùng khó phát hiện ý nằm đâu; chỉ ảnh hưởng bố cục kho hiếm, tự tránh được bằng cách dùng kho thường.
  file: `scripts/tin-hieu.mjs`
  severity: medium
  Đề xuất: known-limits

- **Thư mục nguồn được git theo dõi: trong worktree bộ đọc bỏ qua tệp của nhánh và đọc bản ở checkout chính (đang ở commit hoặc nhánh khác)**
  Người dùng thấy gì: Nếu kho cho git theo dõi thư mục chứa tín hiệu, ở worktree người dùng chỉ thấy tín hiệu của thư mục chính, không thấy tệp riêng của nhánh. Kết quả kiểm độ phủ trong worktree có thể lệch so với máy kiểm tự động.
  Căn cứ: Chỉ gặp ở kho theo dõi thư mục tín hiệu, trái với cách dùng thường; lệch này không làm mất dữ liệu và chạy lại ở thư mục chính hoặc CI cho kết quả đúng.
  file: `scripts/tin-hieu.mjs`
  severity: medium
  Đề xuất: known-limits

- **Trường đo gui_tu gắn nhãn sai: thư mục không phải git nằm dưới đường symlink bị ghi là «worktree»; thư mục con của một worktree bị ghi là «thu-muc-chinh»**
  Người dùng thấy gì: Nhãn nơi gửi của ý có thể sai khi gửi từ thư mục không phải git qua đường tắt hoặc từ thư mục con của worktree. Số ý đếm là gửi từ worktree vì vậy lệch theo cả hai chiều.
  Căn cứ: Ý không mất và nằm đúng chỗ; chỉ con số thống kê lệch, nhẹ và sửa sau rẻ.
  file: `scripts/gui-tin-hieu.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
