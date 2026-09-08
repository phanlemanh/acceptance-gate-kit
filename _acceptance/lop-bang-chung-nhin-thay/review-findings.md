# Review Findings: lop-bang-chung-nhin-thay (round 1)

## Trong hợp đồng

### Hình dạng 2 — fixture evidence-report VIẾT TAY đúng khuôn bên đọc (evid parser của gate-card), trái với lời hứa E4 «dựng từ evidence-report-template»
- file:line: `tests/plugins/lop-nhin-thay.test.mjs:141`
- severity: medium
- detail: `report`/`blkPass`/`blkFail` (dòng 141-143) tự gõ frontmatter + block `- eval:` / `exit_code:` / `screenshot:` / `observed: |` theo đúng dạng mà parser `evid` của gate-card.js (dòng 700-722) và `uiPassed` (dòng 733: exit_code === '0' && screenshot) đọc. Không rút từ marker nào của evidence-report-template.md (khuôn có EVIDENCE-SECTIONS-TEMPLATE, SUITE-BLOCK-TEMPLATE, JUDGMENT-BLOCK-TEMPLATE; khối ui-check chỉ là ví dụ ngoài vùng chép, không có marker). evals.yaml E4 và AC-4 hứa «evidence-report dựng từ evidence-report-template» nhưng test không đụng file khuôn. Hệ quả đúng lớp: nếu tên trường `screenshot:` hay khuôn block ui-check ở template/hook trôi khỏi bên đọc, ca vẫn xanh vì fixture tự khớp bên đọc. Đối chiếu: ra-co-ten.test.mjs:105 dùng blockFromTemplate(JUDGMENT-BLOCK-TEMPLATE) cho cùng loại fixture.
- source: measurement
- AC: AC-4

### Hình dạng 2 — fixture contract frontmatter VIẾT TAY trong bash (mk_lnt, mk_lnt_repo) dù evals.yaml/AC-2 tuyên «contract từ CONTRACT-FRONTMATTER-TEMPLATE»
- file:line: `tests/scripts/run-tests.sh:1168`
- severity: medium
- detail: mk_lnt (dòng 1168-1171) ghi `---\nrisk_tier: T2\nstatus: approved\nsurfaces: [%s]\n---` và mk_lnt_repo (dòng 252-258) ghi frontmatter đầy đủ bằng printf — khớp thẳng dạng mà `frontLine(c,'surfaces')` của lib và `surfacesLine` của lint đọc. Header evals.yaml (dòng 3-4) và AC-2 «Given fixture hồ sơ code-sinh (contract từ CONTRACT-FRONTMATTER-TEMPLATE)» tuyên fixture rút từ khuôn, nhưng tests/scripts/run-tests.sh không tham chiếu marker CONTRACT-FRONTMATTER-TEMPLATE ở đâu (grep = 0). Chỉ các ca .mjs (LNT1/3/4) dùng fileFromTemplate. Nên 12 ca lint L40-L52 và 9 ca PM-LNT không round-trip khuôn viết → bộ đọc; đổi tên khoá/dạng `surfaces:` ở khuôn thì các ca này vẫn xanh.
- source: measurement
- AC: AC-2

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Luật mới neo vào lời hứa hook không tồn tại: hook KHÔNG bắt block ui-check phải có screenshot**
  Người dùng thấy gì: Cảnh báo thiếu-bằng-chứng-hình-ảnh trên hồ sơ có thể chỉ dựa vào những gì được khai báo, không kiểm tra ảnh chụp thật có đạt hay không, nên một trường hợp khai đúng nhưng ảnh lỗi có thể lọt qua bước này.
  file: `lib/lop-nhin-thay.cjs`
  severity: medium
  Đề xuất: known-limits

- **Cờ thẻ Cổng Phạm vi dùng từ «màn hình» nằm trong _Avoid_ của CONTEXT.md**
  Người dùng thấy gì: Một dòng cảnh báo hiển thị cho người duyệt dùng cách gọi tên chưa đúng chuẩn thuật ngữ nội bộ của dự án; không ảnh hưởng đến kết quả duyệt, chỉ là cách diễn đạt.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **«ledger» trần trong NOTE pre-merge mới và eval-executors.md**
  Người dùng thấy gì: Một dòng ghi chú kỹ thuật trong báo cáo dùng từ tiếng Anh chưa được thống nhất theo quy ước đặt tên nội bộ; không ảnh hưởng tới việc gate có chạy đúng hay không.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **CONTEXT.md tự mâu thuẫn: mục Mặt phẳng vẫn liệt enum surfaces là «web, mobile, api»**
  Người dùng thấy gì: Tài liệu thuật ngữ dùng nội bộ liệt kê hai danh sách khác nhau cho cùng một khái niệm ở hai chỗ, có thể khiến người viết hợp đồng sau này tra nhầm và điền sai giá trị.
  file: `CONTEXT.md`
  severity: low
  Đề xuất: known-limits

- **Đối chứng dương của LNT1 dựng bằng chép tay file + ref `main` di động, tự tắt im lặng sau merge**
  Người dùng thấy gì: Một bài kiểm thử dùng để chứng minh hành vi trước khi có tính năng này là sai có thể tự động ngừng kiểm tra phần đó sau khi thay đổi được gộp vào, mà không có dấu hiệu cảnh báo nào cho người đọc báo cáo.
  file: `tests/plugins/lop-nhin-thay.test.mjs`
  severity: low
  Đề xuất: known-limits

- **PM-LNT-dv5 encodes a branch-time invariant into the permanent suite and diffs against local `main` tip, not the merge-base**
  Người dùng thấy gì: Một luật tự động kiểm tra file cấu hình có thể khiến các thay đổi hoàn toàn không liên quan trong tương lai bị báo lỗi oan, vì cách so sánh dùng nhánh chính hiện tại thay vì đúng điểm mà tính năng này tách ra.
  file: `tests/scripts/run-tests.sh`
  severity: medium
  Đề xuất: new-contract

- **Catch-all around require('./lop-nhin-thay.cjs') silently downgrades the surface predicate on ANY load error, and the exported LNT_AVAILABLE flag has no reader**
  Người dùng thấy gì: Nếu bản sao công cụ đo bằng-chứng-hình-ảnh bị lỗi một phần (không phải mất hẳn), hệ thống có thể âm thầm coi các hợp đồng có giao diện web là không cần bằng chứng hình ảnh mà không báo cho ai, dẫn tới bỏ sót yêu cầu chụp ảnh.
  file: `lib/nguong-o-co-hoi.cjs`
  severity: low
  Đề xuất: known-limits

- **descopeId drops a matching descope entry that has no `id`, diverging from the sibling đường-đo rule in gate-card**
  Người dùng thấy gì: Nếu người ghi lý do bỏ qua yêu cầu bằng chứng hình ảnh quên điền mã số đi kèm, hệ thống sẽ coi như chưa từng ghi lý do đó và tiếp tục cảnh báo thiếu bằng chứng dù người đã giải thích.
  file: `lib/lop-nhin-thay.cjs`
  severity: low
  Đề xuất: known-limits

- **pre-merge NOTE blames «thiếu node hoặc lib» for any node crash because stderr is discarded and exit code ignored**
  Người dùng thấy gì: Khi việc kiểm tra bằng chứng hình ảnh thất bại vì một lý do khác, thông báo hiển thị vẫn nói sai là do thiếu tệp công cụ, gây khó khăn khi cần tìm đúng nguyên nhân thật.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — assert «chuỗi có mặt» (") W8 ") trong khi lời hứa là QUAN HỆ alias web/web-ui → nghĩa vụ ui-check (L42, L42b)**
  Người dùng thấy gì: Bài kiểm thử xác nhận yêu cầu bắt buộc-có-ảnh-chụp cho các trang có giao diện web có thể báo 'đạt' ngay cả khi quy tắc nhận diện trang web bị hỏng, vì phép kiểm không phân biệt đúng loại cảnh báo.
  file: `tests/scripts/run-tests.sh`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5 — tuyên quét lớp «bảy mệnh đề / 7 bản sao» nhưng ma trận chỉ có 6 clause + 6 mutant (LNT6)**
  Người dùng thấy gì: Tài liệu mô tả bài kiểm thử tuyên bố kiểm tra bảy trường hợp nhưng mã chỉ thực sự kiểm sáu trường hợp; chênh lệch này không được phát hiện, tạo cảm giác an toàn hơn thực tế.
  file: `tests/plugins/lop-nhin-thay.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (biến thể «chưa bao giờ chạy») — «chiều đỏ có sẵn» bản main tự tắt im lặng khi main đã chứa lop-nhin-thay (LNT1)**
  Người dùng thấy gì: Cùng một bài kiểm thử ở mục trên: phần chứng minh hành vi cũ là sai có thể tự động im lặng bỏ qua sau khi tính năng được gộp vào nhánh chính, khiến báo cáo trông như đã kiểm đầy đủ dù không còn kiểm phần đó nữa.
  file: `tests/plugins/lop-nhin-thay.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
