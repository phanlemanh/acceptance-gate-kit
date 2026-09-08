## Trong hợp đồng

- **Hình dạng 4 — assertion âm-tính-một-mình trên bản sao mutant: lint(bản sao) không có dấu hiệu đã chạy**
  file: `tests/plugins/lop-nhin-thay.test.mjs:105`
  severity: medium
  AC: AC-1
  detail: Dòng 101 chạy `eval-coverage-lint.js` của BẢN SAO đã tiêm mutant (bỏ alias web); dòng 105 chỉ assert `if (OBLIG.test(lintM.stdout)) fail(...)` — tức chỉ đòi dòng W8-nghĩa-vụ VẮNG. Không kiểm `lintM.status`, không ghim dòng nào phải CÓ trên bản sao. Nếu bản sao không chạy được (thiếu file, require lỗi, đường dẫn sai) thì stdout rỗng → assert xanh y hệt ca 'mutant đúng'. Đối chứng dương ở dòng 106 (`lintG`) chạy trên cây LÀNH, không chứng minh bản sao mutant từng chạy. Trong khi đó ca bash tương đương L42m (tests/scripts/run-tests.sh) đã làm đúng: đòi nhánh token-lạ `W8 surfaces carry token…web` PHẢI nổ trên mutant, còn không thì đỏ «bản sao không chạy?». Bản JS của cùng phép đo thiếu đúng cái răng đó — mutant bỏ alias tất yếu biến `web` thành token lạ, nên dòng `W8 surfaces carry token(s)…web` là dấu hiệu quét sẵn có mà ca chưa ghim. So sánh: assert gate-card mutant ngay trên (dòng 103) lại ĐÚNG — `uoM={}` khi status≠0 làm `eq(undefined,false)` đỏ.
  source: measurement
  rationale: AC-1 đặt tên tường minh yêu cầu gap-probe F3 phải có đủ 6 assert đáng tin qua 3 bộ đọc × 2 chiều; assert chiều lint-trên-bản-sao ở đây thiếu đối chứng dương nên không thật sự chứng minh chiều đó, vi phạm đúng con số 6 mà AC-1 yêu cầu.

- **Hình dạng 3 — LNT6 (iv)(vi) assert chuỗi có mặt trong khi AC-6 hứa QUAN HỆ (web→ui; playwright làm capture.ui)**
  file: `tests/plugins/lop-nhin-thay.test.mjs:221`
  severity: low
  AC: AC-6
  detail: AC-6 (vi): «acceptance-init.md 3b nhắc `@playwright/cli` LÀM LỆNH `capture.ui`»; dòng 221 chỉ `cut(...3b...3c...).includes('@playwright/cli')` — không chạm `capture.ui`. Mutant đổi đoạn 3b thành «cheaper when the machine has @playwright/cli» mà xoá vế `capture.ui can be …` vẫn xanh. AC-6 (iv): «term Surface nhắc ALIAS `web` → `ui`»; dòng 220 chỉ `.includes('`web`')` — mutant xoá `→ \`ui\`` (mất quan hệ alias) vẫn xanh; mutant dòng 231 chỉ gỡ `ui-observed` (vế Layer), không có mutant cho vế Surface nên chiều đỏ của (iv)-Surface chưa từng chạy. Cùng lớp với (ii) — ở đó ca lại ghim đúng cụm quan hệ «≥1 eval `ui-check`», nên đây là hai mệnh đề lệch khuôn so với anh em của nó.
  source: measurement
  rationale: AC-6(iv) và (vi) hứa cụ thể một mối quan hệ (alias web→ui; playwright làm lệnh capture.ui), nhưng assert trong test chỉ kiểm chuỗi con có mặt và bỏ sót đúng phần quan hệ mà AC-6 yêu cầu — mutant xoá phần quan hệ vẫn qua được.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **PM-LNT-dv5 bakes a one-off feature constraint (DV5 "only add lines") into the permanent scripts suite, anchored to the `main` branch**
  Người dùng thấy gì: Bài kiểm tra tự động có thể báo lỗi sai cho những thay đổi hợp lệ trong tương lai đối với tệp kiểm tra trước khi gộp mã, kể cả khi thay đổi đó không liên quan đến tính năng đang xét.
  file: `tests/scripts/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **Three shipped texts claim the write-time hook forces `screenshot:` on every ui-check block; the hook only checks `observed:` when a `screenshot:` is already present**
  Người dùng thấy gì: Tài liệu hướng dẫn nói hệ thống luôn bắt buộc có ảnh chụp màn hình cho mọi mục kiểm tra giao diện, nhưng thực tế một mục thiếu ảnh chụp vẫn có thể lọt qua bước duyệt sớm và chỉ bị phát hiện ở bước duyệt cuối cùng.
  file: `lib/lop-nhin-thay.cjs`
  severity: medium
  Đề xuất: known-limits

- **`LNT_AVAILABLE` is exported from nguong-o-co-hoi.cjs but no reader uses it**
  Người dùng thấy gì: Có một cờ trạng thái nội bộ được tạo ra nhưng hiện chưa nơi nào dùng tới — không ảnh hưởng người dùng, chỉ là mã dư thừa.
  file: `lib/nguong-o-co-hoi.cjs`
  severity: low
  Đề xuất: known-limits

- **PM-LNT-dv5 encodes a one-PR invariant as a permanent suite check (fails locally on any future edit of pre-merge-check.sh, silently skips in CI)**
  Người dùng thấy gì: Bài kiểm tra này chỉ thật sự có tác dụng trên máy cá nhân của người viết mã; trên hệ thống kiểm tra tự động chung nó âm thầm bỏ qua mà không báo, nên lớp bảo vệ không đáng tin như tưởng về lâu dài.
  file: `tests/scripts/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **pre-merge NOTE lane reports a classify runtime failure as «thiếu node hoặc lib» (error swallowed, wrong cause named)**
  Người dùng thấy gì: Khi việc phân loại bị lỗi vì một nguyên nhân khác không phải thiếu tệp thư viện, thông báo hiển thị vẫn nói là thiếu thư viện, khiến người vận hành có thể đi sửa nhầm chỗ.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **Comment-stripping in lop-nhin-thay.cjs requires whitespace before `#`, unlike the other frontmatter readers it is meant to unify**
  Người dùng thấy gì: Nếu ai đó viết chú thích dán liền ngay sau giá trị mà không có khoảng trắng (cách viết hiếm gặp), các bộ phận khác nhau của hệ thống có thể phân loại khác nhau xem tính năng có cần bằng chứng hình ảnh hay không.
  file: `lib/lop-nhin-thay.cjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — `html()` nuốt mã thoát; ba assert HTML chỉ có chiều «không chứa» xanh giả khi render crash**
  Người dùng thấy gì: Nếu công cụ hiển thị kết quả bị lỗi ngầm khi dựng trang, một số bài kiểm tra tự động vẫn có thể báo 'qua' dù thực chất chưa kiểm tra được gì — rủi ro là lỗi thật bị bỏ sót mà không ai hay biết.
  file: `tests/plugins/lop-nhin-thay.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 — «chiều đỏ có sẵn» đo nhánh `main` của checkout tác giả; tự biến mất im lặng sau merge**
  Người dùng thấy gì: Một bước kiểm tra phụ trợ (không phải bước kiểm chính) sẽ tự động ngừng có tác dụng ngay sau khi mã này được gộp, nhưng lớp bảo vệ chính của tính năng vẫn còn nguyên.
  file: `tests/plugins/lop-nhin-thay.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 6 — PM-LNT-dv5 `git diff main` đo trạng thái nhánh, trở thành trống-tất-yếu sau merge**
  Người dùng thấy gì: Bài kiểm tra chỉ có tác dụng đúng trong đúng thời điểm hiện tại; ngay sau khi gộp mã lần này, phép kiểm sẽ luôn báo 'qua' một cách vô nghĩa mà không còn thật sự kiểm tra gì nữa.
  file: `tests/scripts/run-tests.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
