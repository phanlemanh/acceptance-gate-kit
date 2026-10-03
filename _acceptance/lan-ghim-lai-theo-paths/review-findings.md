# Review findings: lan-ghim-lai-theo-paths (round 3)

## Trong hợp đồng

- **Shape 3: E10 'paths key absent + old lib → same as base' is checked by exit code 0 alone, not by comparing against base**
  file: `_acceptance/lan-ghim-lai-theo-paths/rang/chan-lan.mjs:93` — severity: medium — AC: AC-10 — source: measurement
  detail: evals.yaml E10 promises a relation: 'Ô lib vắng / lib ném lỗi: khoá vắng → y như base' (with the lib missing or throwing and the key absent, output must be identical to the base). The code only runs the current tree with --ag-root BASE and asserts `rV.status === 0` (line 93). It never runs the base lane on the same fixture to compare stdout/stderr/run-log, as the 12-cell loop just above does with chay(KIT)/chay(BASE). A lane that still exits 0 but changes its output (an extra line, a different skip decision) on an old lib stays green. The 'lib ném lỗi' (lib throws) cell named in the promise has no case at all; only 'old lib lacking the function' is measured.
  Lý do vào hợp đồng: AC-10 đòi khi lib vắng hoặc ném lỗi mà khoá vắng thì làn chạy y như base; phép đo chỉ kiểm mã thoát 0 và không có ca lib ném lỗi, nên vế này của AC-10 chưa được chứng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Under stale_scope: paths, changes covered only by ui-check/judgment evals without `paths` are silently dropped**
  Người dùng thấy gì: Nếu một hồ sơ chỉ có kiểm tra giao diện hoặc đánh giá bằng người mà không khai phạm vi, thay đổi vào phần đó vẫn bị coi là 'hồ sơ còn mới', nên bằng chứng cũ có thể được thông qua dù phần được đo đã đổi.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: new-contract

- **SKILL staleness guard still says it runs «cùng luật» as CI, but ignores risk_tiers.stale_scope: paths**
  Người dùng thấy gì: Ở kho bật khoá, CI báo hồ sơ còn mới nhưng phiên làm việc vẫn mở lại vòng kiểm khi chỉ tệp ngoài phạm vi đổi, nên phần tiết kiệm công sức chỉ có ở CI và làn, không có ở phiên.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **AG_FLOOR now includes the conditional staleByPaths row, so the engine-stop message asks every repo for ≥ 2.21.0**
  Người dùng thấy gì: Kho không bật khoá, khi engine cũ thiếu một phần khác, sẽ được nhắc nâng lên bản mới nhất thay vì bản tối thiểu thật sự cần; chỉ sai lời hướng dẫn, không đổi kết quả chạy.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **A comment after `paths:` makes the paths filter skip every changed file, so stale evidence passes**
  Người dùng thấy gì: Nếu kho đã bật khoá và viết chú thích ngay sau dòng khai phạm vi, mọi thay đổi đều bị coi là ngoài phạm vi và bằng chứng cũ được thông qua mà chỉ có một ghi chú nhỏ báo lại.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: new-contract

- **A blank or comment line inside a `paths:` block list silently drops the later globs**
  Người dùng thấy gì: Nếu danh sách phạm vi có dòng trống giữa chừng, các mục sau dòng đó bị bỏ qua và thay đổi ở đó có thể bị coi là không ảnh hưởng hồ sơ; hiện chưa kho nào viết như vậy.
  file: `lib/evidence-core.cjs`
  severity: low
  Đề xuất: known-limits

- **Two failure-direction (`chiều đỏ`) checks in E3 only assert that nothing was written, so a copy that crashed also passes**
  Người dùng thấy gì: Một vài phép thử chiều đỏ của việc giữ trọn lời lỗi có thể báo 'bắt được' dù bản thử chỉ bị hỏng giữa chừng, nên độ tin của chúng thấp hơn vẻ ngoài.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs`
  severity: low
  Đề xuất: known-limits

- **banBase hides a git archive failure: a missing pin commit yields an empty base directory**
  Người dùng thấy gì: Khi bản gốc để so sánh không lấy được (ví dụ kho clone nông trên CI), các phép thử sẽ đỏ với lý do gây hiểu lầm là thay đổi sai thay vì báo thiếu bản gốc.
  file: `_acceptance/lan-ghim-lai-theo-paths/rang/ban-base.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 5: the matrix row-count checks in lmtl-the.test.mjs only count the array against itself, so they can never fail (no pre-written number)**
  Người dùng thấy gì: Phép thử lẽ ra giữ cho bảng tình huống không bị mất dòng lại không thể đỏ, nên xoá một dòng khỏi bảng vẫn được báo xanh.
  file: `tests/scripts/lmtl-the.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Shape 4: red-direction mutants in the lan-ghim-lai-giu-tron-loi-loi checks count 'copy crashed' as 'caught', with no positive sign that the copy reached the step**
  Người dùng thấy gì: Nhiều phép thử chiều đỏ của việc giữ trọn lời lỗi coi 'bản thử bị hỏng' là 'đã bắt được lỗi', nên có thể xanh trong khi chưa thật sự chạy tới bước cần kiểm.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4: the repin-lane reader in bộ-đọc-im has no positive control showing it reads the run log, and the red-direction check only asserts 'differs' without pinning a message**
  Người dùng thấy gì: Phép thử xác nhận làn đọc đúng nhật ký chạy chưa có đối chứng dương, nên có thể xanh dù làn không hề đọc nhật ký.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 4: E3 chi-thu takes the ⊆ relation and M3 'not stale' on the healthy tree with no sign the merge gate reached the record**
  Người dùng thấy gì: Nếu cổng trước-merge dừng sớm mà không xử lý hồ sơ, một số phép thử quan hệ tập con vẫn xanh vì chúng đúng một cách hiển nhiên khi danh sách rỗng.
  file: `_acceptance/lan-ghim-lai-theo-paths/rang/chan-premerge.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 8/12 lỗi rơi vào file không bộ đo nào phủ (feature-loop/skills/feature-loop/SKILL.md, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs, _acceptance/lan-ghim-lai-theo-paths/rang/ban-base.mjs, tests/scripts/lmtl-the.test.mjs, _acceptance/lan-ghim-lai-theo-paths/rang/chan-lan.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs, _acceptance/lan-ghim-lai-theo-paths/rang/chan-premerge.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
