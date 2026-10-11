# Review findings: cua-tin-hieu-gom-nhom (round 2)

## Trong hợp đồng

- **The graded grouping (gom-bo-vang.md, pass 3) fails TH-10 / E10 with 7 mismatches against the gold set**
  file: `_acceptance/cua-tin-hieu-gom-nhom/mau/gom-bo-vang.md:12`
  severity: low
  AC: AC-10
  source: bugs
  detail: Running `TH_CASES=TH-10,TH-10-ong,TH-10-do,TH-10-do2 node tests/scripts/tin-hieu.test.mjs` on HEAD 7e179d28 gives `FAIL: TH-10 — lệch đáp án ở 7 chỗ`. Two duplicate pairs are split: vang-a-9 is in G5 and vang-b-12 is in G6 (both giam-phut-acceptance); vang-b-14 is marked covered while vang-b-18 is in G7 (both luat-kho-vong-doi). Signals from delivered records sit in groups instead of being marked covered: vang-a-3 and vang-b-20 (ca-chap-chon-cach-ly) and vang-b-18. Signals from the undelivered record thuoc-7-ngay-loc-pr (vang-b-6, vang-a-15) are marked covered under ci-ma-tran-ba-o. The khai-trước history check passes: bo-vang.json at 6f2513f0 is an ancestor of the grouping commit 7e179d28 and was not changed afterwards. So E10 (`PASS: TH-10`) is red. Decisions d-16 and d-19 already expect this as a product outcome for the Evidence Gate, so it is not a code bug; it is listed so the result is not read as an infrastructure failure.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The engine drift check still cannot see the three new orchestration files or the signal template that this round added to the CI copy list**
  Người dùng thấy gì: Kho nào dùng cửa tín hiệu mà giữ bản cũ của vài tệp phụ trợ vẫn được báo «engine xanh», dù phiên bản các tệp không khớp nhau. Người dùng có thể tin nhầm là bản cài đã đồng bộ trong khi có tệp cũ.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: high
  Đề xuất: new-contract

- **The new 'answer key committed before the grouping, from real kit history' check in TH-10 has no case in the suite that shows it turning red**
  Người dùng thấy gì: Phép kiểm «đáp án phải được ghi trước khi gom» chưa từng được thử cho thấy nó báo đỏ khi đáp án bị ghi cùng lúc hoặc sửa sau. Nếu nó hỏng im lặng, kết quả chấm bộ vàng có thể được tin hơn mức đáng có.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Engine-drift check in the baseline step silently skips the 4 vendored files this round added to the CI copy list**
  Người dùng thấy gì: Bốn tệp mới của cửa tín hiệu có thể nằm cũ trong kho dùng kit mà bước kiểm đường nền vẫn báo khớp. Người dùng không được cảnh báo khi bản cài lệch.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: medium
  Đề xuất: new-contract

- **New dieu-phoi entries in INIT-CI-COPY-LIST break the engine-hash leg of duong-nen; NEN7 is now red (r1)**
  Người dùng thấy gì: Phần kiểm tra «máy của kho tiêu thụ có đúng bản gói đang dùng không» bị mù với ba tệp mới của gói Điều phối, nên kho cài gói có thể lệch bản mà không ai được báo. Một bài kiểm có sẵn của kit đang đỏ vì chuyện này, và hai phép đo mà hồ sơ đã ký đang dựa vào cũng đỏ theo.
  file: `commands/acceptance-init.md`
  severity: high
  Đề xuất: new-contract

- **tin-hieu.test.mjs hardcodes the literal "signed-off" — RT13 is red (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bộ kiểm tra chung của kit đang đỏ vì tệp kiểm tra của tính năng mới viết cứng một tên trạng thái thay vì lấy từ nơi định nghĩa chuẩn. Tính năng vẫn chạy đúng nhưng không thể gộp khi bộ kiểm tra chung còn đỏ.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Two red-direction checks assert on exit code alone, with no pinned message (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hai bài kiểm «máy phải báo đỏ khi sai» chỉ xác nhận có báo đỏ, chưa xác nhận đỏ đúng lý do. Nếu bản thử hỏng vì lỗi khác thì bài kiểm vẫn xanh, nên màu xanh ở hai chỗ này tin được kém hơn vẻ ngoài.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Kit repo now carries verbatim consumer (crm) contracts as fixtures (r1)**
  Người dùng thấy gì: Kho của kit đang giữ bản sao nguyên văn nhiều hồ sơ công việc thật của một khách hàng, kèm email người phụ trách và tên nhánh, đường dẫn nội bộ của họ. Ai dùng kit ở công ty khác cũng sẽ nhận các bản sao này.
  file: `_acceptance/cua-tin-hieu-gom-nhom/mau/ho-so/kiem-cheo-sau-gop/contract.md`
  severity: medium
  Đề xuất: new-contract

- **Coverage check accepts a summary file that is staged but never committed (and committed files with uncommitted edits) (r1)**
  Người dùng thấy gì: Chủ kho có thể thấy «bản gom đạt» khi bản gom mới chỉ được đánh dấu chuẩn bị lưu hoặc còn sửa dở, chưa được lưu vào lịch sử. Khi đó mốc để đếm số lần chủ kho chỉnh tay có thể bị tính lệch.
  file: `scripts/tin-hieu.mjs`
  severity: medium
  Đề xuất: known-limits

- **Signal-path output silently drops malformed signals and missing sources (roadmap page and --duong --id) (r1)**
  Người dùng thấy gì: Một tín hiệu nằm trong tệp bị hỏng sẽ biến mất khỏi trang lộ trình mà không có lời báo nào. Người gửi hỏi tín hiệu của mình sẽ được trả lời «không có tín hiệu này», dù thật ra nó đã gửi nhưng bị hỏng khuôn.
  file: `scripts/tin-hieu.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): TH-3-do ghim «lẻ thành mã» nhưng bắt được nhờ một assert khác. Assert «lẻ không thành mã» thật ra không thể đỏ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm «mục để riêng không được biến thành một nhóm» có thể vẫn xanh trong vài kiểu lỗi, nên màu xanh ở đó chưa chắc chứng minh được điều nó tuyên bố.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): «0 câu khớp mẫu cấm» của TH-9 không có đối chứng dương, và regex không phủ đúng mẫu cấm mà eval khai (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép quét «hướng dẫn không được bảo kit giữ kho tín hiệu» chỉ bắt vài cách diễn đạt, nên một câu viết khác đi vẫn lọt mà bài kiểm vẫn xanh. Hiện chưa thấy câu nào như vậy trong hướng dẫn, nhưng rào chắn này mỏng hơn vẻ ngoài.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/4 lỗi rơi vào file không bộ đo nào phủ (feature-loop/scripts/duong-nen.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
