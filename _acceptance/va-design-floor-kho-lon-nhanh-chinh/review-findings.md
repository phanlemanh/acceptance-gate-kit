## Trong hợp đồng

- **CU-CI fails on git ≥2.48: `git fetch` now creates origin/HEAD, so the test fixture rejects itself and the suite goes red**
  file: `tests/design-floor/kho-lon-nhanh-chinh.mjs:297`
  severity: high
  AC: AC-4
  source: bugs
  detail: CU-CI builds a CI-style checkout with `git init` + `git remote add origin B` + `git fetch -q origin`. It then requires that `refs/remotes/origin/HEAD` does not exist, and otherwise returns 'CU-CI: fixture có origin/HEAD'. That assumption only holds on old git. Since git 2.48, `remote.<name>.followRemoteHEAD` defaults to `create`, so a fetch with the default refspec creates origin/HEAD when it is missing.

  Reproduced in this worktree. With the default git on PATH (2.37.1) the whole file passes. With /usr/bin/git 2.54.0 (`PATH=/usr/bin:$PATH node tests/design-floor/kho-lon-nhanh-chinh.mjs --chi CU,KHAC,NHO`) it prints `FAIL: CU-CI: fixture có origin/HEAD` and ends `kho-lon-nhanh-chinh: ĐỎ 1`. The other labels (LON, HONG, KHAC, NHO, LOP) stay green on 2.54.

  Impact:
  (1) The `design-floor` job in gate.yml runs on `ubuntu-latest` and calls tests/design-floor/run-tests.sh, which this diff now includes, so it is red as soon as the runner's git is ≥2.48.
  (2) Eval E4 (`va460_khai_cu`, AC-4) goes red even though the code under test is correct. This is a red caused by the test environment, not by the code.
  (3) The limitation declared in the contract and design doc says a CI-style checkout (init + remote add + fetch) has no origin/HEAD. That is wrong on modern git, so the test pins behaviour of an old git version, not of design-floor.

  Fix: build the CI-style fixture so it has no origin/HEAD on every git version. For example, use `git -c remote.origin.followRemoteHEAD=never fetch` or an explicit refspec `+refs/heads/onehub:refs/remotes/origin/onehub`. Alternatively, delete origin/HEAD after the fetch (`git remote set-head origin -d`), then keep the existing guard.

- **Hình dạng 3 — kiểm «chuỗi có mặt» trong khi lời hứa là «thoát 1 với MỘT dòng stderr»: HONG-BON không phân biệt lỗi được nói gọn với chương trình sập không bắt**
  file: `tests/design-floor/kho-lon-nhanh-chinh.mjs:215`
  severity: medium
  AC: AC-2
  source: measurement
  detail: AC-2 hứa: bốn lệnh (bậc, S1, S3, S4) «thoát 1 với một dòng stderr chứa «không đọc được danh sách tệp git»». Ca HONG-BON chỉ kiểm `r.ec !== 1` và `r.err.includes('không đọc được danh sách tệp git')`. Khi lỗi không được bắt (uncaught throw), Node cũng thoát mã 1 và in đúng thông điệp đó, kèm theo cả chồng lời gọi. Vì vậy hai điều kiện này cũng đúng khi lệnh sập. Đã thử trên bản sao (git archive HEAD vào scratchpad): gỡ khối try/catch mới thêm quanh `chayS1` trong main() của scripts/design-floor-s1.mjs. Chạy `--chi HONG` thì HONG-BON vẫn PASS, trong khi S1 chạy tay in khoảng mười dòng (dòng `throw new Error(...)`, chồng lời gọi, `Node.js v24…`) và thoát 1. Như vậy phần mã mới ở S1 (try/catch, `return 1`) không có chiều đỏ nào. Đột biến HONG-DOT chỉ đánh vào lệnh bậc, và lệnh bậc là lệnh duy nhất có đối chứng bản gốc (HONG-GOC). Lối sửa: ghim số dòng stderr (ví dụ `r.err.trim().split('\n').length === 1`), hoặc ghim tiền tố `design-floor-<lệnh>: ` ở đầu dòng duy nhất.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Usage header của S3 và S4 không ghi nguyên nhân thoát 1 mới (git không đọc được danh sách tệp), trong khi bac và S1 đã ghi**
  Người dùng thấy gì: Phần hướng dẫn ở đầu hai trong bốn lệnh kiểm tra giao diện chưa kể hết các lý do lệnh có thể dừng. Lệnh vẫn dừng đúng và báo đúng lỗi khi gặp sự cố, chỉ là người đọc hướng dẫn sẽ thấy thiếu một dòng.
  Căn cứ: Chỉ là chú thích còn thiếu, người dùng vẫn nhận đúng thông báo lỗi khi gặp sự cố, và bổ sung sau rất rẻ.
  file: `scripts/design-floor-s4.mjs`
  severity: low
  Đề xuất: known-limits

- **Bước S0 trong SKILL không nói phải làm gì khi lệnh bậc thoát 1, dù vòng này vừa thêm mã thoát đó**
  Người dùng thấy gì: Tài liệu hướng dẫn phiên làm việc chưa nói rõ nên dừng hay đi tiếp khi lệnh xác định bậc giao diện báo không đọc được danh sách tệp. Trường hợp này hiếm vì vòng làm việc vốn chạy trong kho git, và phiên làm việc vẫn thấy dòng báo lỗi rõ ràng.
  Căn cứ: Chỉ xảy ra khi kho git bị hỏng, hiếm gặp, hậu quả nhẹ vì lỗi được nói rõ, và bổ sung một dòng hướng dẫn sau này rất rẻ.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — ma trận đột biến LOP sinh từ chính bộ liệt kê của phép quét, không phải ma trận viết trước; quan hệ «số đột biến = số lời gọi» không được assert**
  Người dùng thấy gì: Phép kiểm tra giới hạn bộ nhớ khi lệnh chạy chỉ thấy những lời gọi viết theo cách quen thuộc. Nếu sau này ai đó viết lời gọi theo cách khác thì có thể lọt mà bộ kiểm vẫn báo xanh, nhưng hiện chưa có lời gọi nào bị sót.
  Căn cứ: Hiện không có lỗi thật nào lọt và người dùng không bị ảnh hưởng, rủi ro chỉ xuất hiện nếu mã đổi cách viết sau này, nên ghi lại như giới hạn đã biết là đủ.
  file: `tests/design-floor/kho-lon-nhanh-chinh.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
