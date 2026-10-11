# Review findings: cua-tin-hieu-gom-nhom (round 1)

## Trong hợp đồng

- **E11 judge question describes a bo-vang.json shape that the generator does not produce (writer and reader have drifted)**
  file: `_acceptance/cua-tin-hieu-gom-nhom/evals.yaml:161`
  severity: medium
  AC: AC-11
  source: conventions
  detail: E11 tells the judge that bo-vang.json holds '20 mục {id, tieu_de, ho_so, cum}' plus 'bốn cụm «cùng lớp» do người gom tay', and asks how the grouping file placed 'tín hiệu của bốn cụm viết tay'. The committed artifact, emitted by rang/sinh-bo-vang.mjs line 94 and line 110, has `kieu` per item (van-de/gia-dinh), no `cum` field, and no four-cluster structure, only a per-slug adjacency map `lien_ket_cung_lop`. gap-probe.md P1 records this exact risk as 'fixed' by requiring a `cum` field, but the fix never reached the vật. The judge reads only the three input files, so it must either guess the clusters or return UNCERTAIN, which burns a grading round. This is shape (3) of the 'thước phải gắn vào vật' invariant: the judge reads a fixture shape that no code path produces. Either emit `cum` from the generator or rewrite the question against `lien_ket_cung_lop`.
  rationale: AC-11 lấy bộ đáp án với «bốn cụm cùng lớp viết tay» làm đầu vào cho hội đồng; vật sinh ra không có cụm nào như vậy nên AC-11 không chấm được đúng như đã hứa.

- **'Answer key committed before the summary' check never runs on the real gold set; harness rebuilds history in the passing order**
  file: `_acceptance/cua-tin-hieu-gom-nhom/rang/cham-bo-vang.mjs:60`
  severity: medium
  AC: AC-10
  source: bugs
  detail: `cham()` says it proves the answer key (bo-vang.json) was committed strictly before the summary file. The only caller that scores the real gold set is TH-10 in tests/scripts/tin-hieu.test.mjs. It goes through `khoCham`, which builds a fresh temp repo and always commits `vang/bo-vang.json` first, then `docs/gom/gom-vang.md` (`dapAnTruoc = true`). So this leg of the check is green by construction and never looks at real history. In the kit repo, `git log --diff-filter=A` shows `mau/bo-vang.json`, `mau/gom-bo-vang.md` and `mau/gom-bo-vang-luot-1.md` all added in the same commit 6f2513f0. The real check (`cBv === cGom`) would reject that. If TH-10 ever turns green, its 'declared beforehand' claim in E10 would be a false green. Either run the ordering check against the kit's own history for `mau/`, or drop that claim from E10 and from the header comment of cham-bo-vang.mjs.
  rationale: AC-10 và Đường đo đều hứa đáp án ở bộ vàng được commit TRƯỚC bản gom; lịch sử thật cho thấy cả ba tệp vào cùng một commit và phép kiểm này chưa từng chạy trên lịch sử thật.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **New dieu-phoi entries in INIT-CI-COPY-LIST break the engine-hash leg of duong-nen; NEN7 is now red**
  Người dùng thấy gì: Phần kiểm tra «máy của kho tiêu thụ có đúng bản gói đang dùng không» bị mù với ba tệp mới của gói Điều phối, nên kho cài gói có thể lệch bản mà không ai được báo. Một bài kiểm có sẵn của kit đang đỏ vì chuyện này, và hai phép đo mà hồ sơ đã ký đang dựa vào cũng đỏ theo.
  file: `commands/acceptance-init.md`
  severity: high
  Đề xuất: new-contract

- **tin-hieu.test.mjs hardcodes the literal "signed-off" — RT13 is red**
  Người dùng thấy gì: Bộ kiểm tra chung của kit đang đỏ vì tệp kiểm tra của tính năng mới viết cứng một tên trạng thái thay vì lấy từ nơi định nghĩa chuẩn. Tính năng vẫn chạy đúng nhưng không thể gộp khi bộ kiểm tra chung còn đỏ.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Two red-direction checks assert on exit code alone, with no pinned message**
  Người dùng thấy gì: Hai bài kiểm «máy phải báo đỏ khi sai» chỉ xác nhận có báo đỏ, chưa xác nhận đỏ đúng lý do. Nếu bản thử hỏng vì lỗi khác thì bài kiểm vẫn xanh, nên màu xanh ở hai chỗ này tin được kém hơn vẻ ngoài.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Kit repo now carries verbatim consumer (crm) contracts as fixtures**
  Người dùng thấy gì: Kho của kit đang giữ bản sao nguyên văn nhiều hồ sơ công việc thật của một khách hàng, kèm email người phụ trách và tên nhánh, đường dẫn nội bộ của họ. Ai dùng kit ở công ty khác cũng sẽ nhận các bản sao này.
  file: `_acceptance/cua-tin-hieu-gom-nhom/mau/ho-so/kiem-cheo-sau-gop/contract.md`
  severity: medium
  Đề xuất: new-contract

- **Coverage check accepts a summary file that is staged but never committed (and committed files with uncommitted edits)**
  Người dùng thấy gì: Chủ kho có thể thấy «bản gom đạt» khi bản gom mới chỉ được đánh dấu chuẩn bị lưu hoặc còn sửa dở, chưa được lưu vào lịch sử. Khi đó mốc để đếm số lần chủ kho chỉnh tay có thể bị tính lệch.
  file: `scripts/tin-hieu.mjs`
  severity: medium
  Đề xuất: known-limits

- **Signal-path output silently drops malformed signals and missing sources (roadmap page and --duong --id)**
  Người dùng thấy gì: Một tín hiệu nằm trong tệp bị hỏng sẽ biến mất khỏi trang lộ trình mà không có lời báo nào. Người gửi hỏi tín hiệu của mình sẽ được trả lời «không có tín hiệu này», dù thật ra nó đã gửi nhưng bị hỏng khuôn.
  file: `scripts/tin-hieu.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): TH-3-do ghim «lẻ thành mã» nhưng bắt được nhờ một assert khác. Assert «lẻ không thành mã» thật ra không thể đỏ**
  Người dùng thấy gì: Bài kiểm «mục để riêng không được biến thành một nhóm» có thể vẫn xanh trong vài kiểu lỗi, nên màu xanh ở đó chưa chắc chứng minh được điều nó tuyên bố.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): «0 câu khớp mẫu cấm» của TH-9 không có đối chứng dương, và regex không phủ đúng mẫu cấm mà eval khai**
  Người dùng thấy gì: Phép quét «hướng dẫn không được bảo kit giữ kho tín hiệu» chỉ bắt vài cách diễn đạt, nên một câu viết khác đi vẫn lọt mà bài kiểm vẫn xanh. Hiện chưa thấy câu nào như vậy trong hướng dẫn, nhưng rào chắn này mỏng hơn vẻ ngoài.
  file: `tests/scripts/tin-hieu.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/10 lỗi rơi vào file không bộ đo nào phủ (commands/acceptance-init.md, _acceptance/cua-tin-hieu-gom-nhom/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
