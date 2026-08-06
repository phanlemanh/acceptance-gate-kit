## Trong hợp đồng

- **P162: phạm vi quét chỉ được canh bằng bộ đếm — rơi trọn một gói vẫn XANH**
  file: `tests/plugins/run-tests.sh:7083`
  severity: high
  source: conventions
  AC: AC-2
  detail: AC-2 và eval E2 của contract nói rõ: "tập tệp chỉ dẫn đã quét phải PHỦ CẢ 3 GÓI, đối chiếu danh sách viết trước" và "KHÔNG dùng bộ đếm >0 làm thước phạm vi". Nhưng bản cài đặt chỉ có 3 assert đếm: `nfiles >= 40` (7083), `nnon_read > 0` (7084), `len(pkgs_with_ref) >= 2` (7086). Không có danh sách gói viết trước nào được đối chiếu.

  Hệ quả: `DECLARED` chỉ có hàng cho acceptance-gate và feature-loop-codex, nên design-loop-codex có 0 hàng SELF — quan hệ `found == DECLARED` không hề ràng buộc gói đó. Nếu vòng quét bỏ sót nó (đổi tên gói, glob trượt, thêm gói thứ 4), phép đo im lặng.

  Đã kiểm bằng 2 mutant chạy thật trên cây hiện tại:
  1. Thêm `or pkg_dir.name == "design-loop-codex"` vào điều kiện bỏ qua ở dòng 7061 → vẫn in "P162 OK" (64→55 file, `pkgs_with_ref` vẫn 2).
  2. Thu `DOC_EXT` (7050) còn `{".md"}`, tức ngừng đọc .toml/.yaml/.yml → vẫn in "P162 OK" (64→52 file).

  Đây đúng lớp "đếm-rồi-vứt" mà gap-probe P0 của chính feature này tuyên đã đóng, và đúng hình dạng (1)/(4) trong bất biến "Thước phải gắn vào vật được giao" của CLAUDE.md. Cách chữa cùng doctrine với phần còn lại của P162: ghim một danh sách gói + danh sách phần mở rộng viết trước rồi assert tập gói đã quét BẰNG ĐÚNG danh sách đó (thừa đỏ, thiếu đỏ), thay vì ngưỡng `>= 2` / `>= 40`; hoặc khai vào scripts/codex-self-script-refs.tsv một phần thứ ba liệt kê gói phải quét.
  rationale: AC-2 đòi tập trỏ-gói-mình phải BẰNG ĐÚNG danh sách viết trước (thừa đỏ, thiếu đỏ) và cấm dùng bộ đếm làm thước phạm vi; bản cài chỉ có 3 assert ngưỡng, mutant bỏ hẳn một gói vẫn XANH.

- **carry-plan.mjs: --delta-files bị bỏ / gõ sai / rỗng → carry TOÀN BỘ, rerun rỗng, exit 0 (fail-open im lặng)**
  file: `plugins/feature-loop-codex/scripts/carry-plan.mjs:149`
  severity: high
  source: bugs
  AC: AC-4
  detail: `--delta-files` KHÔNG nằm trong danh sách tham số bắt buộc (dòng 137 chỉ kiểm run-log/evals/contract/round), và `parseArgs` (dòng 20-27) chấp nhận mọi cờ lạ mà không báo lỗi. Dòng 149 `const deltaFiles = (a['delta-files'] || '').split(...)` biến "thiếu tham số" thành "diff-fix không chạm gì" — không phân biệt được hai trạng thái đó.

  Đã kiểm chứng thật (chạy trên bản mirror vừa ship):
  - `node carry-plan.mjs --run-log ... --evals ... --contract ... --round 5` (bỏ hẳn --delta-files) trên `_acceptance/card-text-fidelity` → exit 0, carriedEvals = 12/12, rerun = [].
  - `--delta_files src/a.js --bogus x` (gõ sai gạch dưới + cờ lạ) → exit 0, carried = [E1,E2,E3], rerun = [] — đúng ngược với ý định.
  - `--delta-files ""` → cùng kết quả.

  Đường đi thật đến lỗi: SKILL (`feature-loop/skills/feature-loop/SKILL.md:154` và `plugins/feature-loop-codex/skills/feature-loop-codex/SKILL.md:127-131`) bảo dựng tham số bằng `--delta-files "$(git diff --name-only <sha> | grep -v '^_acceptance/' | paste -sd, -)"`. Nếu vòng sửa chỉ chạm `_acceptance/**` (grep lọc sạch), hoặc sha truyền sai, hoặc agent gõ lệch tên cờ, chuỗi thay thế ra RỖNG → công cụ trả kế hoạch "mang sang tất cả, chạy lại không gì" với exit 0. Vòng fix sau REJECT khi đó chỉ chạy lại suite, mọi eval được ghi là đã verify bằng kết quả round trước, và báo cáo/gói Cổng 2 công bố carry đó như bằng chứng hợp lệ. Đây là fail-open ở đúng chỗ cổng đang tin. Cần: bắt buộc `--delta-files` (thiếu → exit 2) và nổ với cờ không nhận diện được; nếu "diff rỗng" là trạng thái hợp lệ thì phải khai tường minh bằng cờ riêng (vd `--no-delta`).
  rationale: AC-4 đòi rõ: thiếu tham số phải trả mã thoát 2 kèm thông điệp hướng dẫn; bằng chứng chạy thật cho thấy thiếu/gõ sai --delta-files vẫn exit 0 và mang-sang toàn bộ, đúng lỗi AC-4 cấm.

- **Hình dạng 5 — tuyên quét LỚP (3 gói) nhưng phạm vi quét chỉ đo bằng bộ đếm ngưỡng, không có ma trận viết trước**
  file: `tests/plugins/run-tests.sh:7086`
  severity: high
  source: measurement
  AC: AC-2
  detail: E2 (evals.yaml) hứa: "tập tệp chỉ dẫn đã quét phải phủ cả 3 gói, đối chiếu danh sách viết trước", và AC-2 nói thẳng "Bộ đếm chỉ là phụ trợ, KHÔNG dùng làm thước phạm vi". Nhưng toàn bộ chiều PHẠM VI QUÉT chỉ được ghim bằng ba bộ đếm ngưỡng ở 7083-7086: `assert nfiles >= 40`, `assert nnon_read > 0`, `assert len(pkgs_with_ref) >= 2`. Không có danh sách 3 gói viết trước, không có assert nào nói "cả acceptance-gate, design-loop-codex, feature-loop-codex đều đã được duyệt".

  Hai lỗ cụ thể:
  (a) `pkgs_with_ref` được suy ra từ `found`, mà ngay trên đó (7080-7081) đã assert `found == DECLARED`. Vì bảng TSV chỉ có 2 gói, `len(pkgs_with_ref)` LUÔN bằng 2 — assert 7086 không thể đỏ, thông điệp "nhanh quet da goi chua chay" là lời hứa không có thật.
  (b) Ngưỡng 40 quá lỏng so với thực tế 64 (acceptance-gate 46 + design-loop-codex 9 + feature-loop-codex 9). Tôi đã tiêm mutant `if not pkg_dir.is_dir() or pkg_dir.name == "design-loop-codex": continue` vào `extract()` — bỏ HẲN gói Codex thứ ba khỏi vòng quét — và phép đo vẫn XANH: "55 file chi dan (41 ngoai SKILL.md) · 2 goi co ref". Nghĩa là nếu glob/overlay làm rơi cả một gói khỏi đường quét, quan hệ chỉ-dẫn⇔gói của gói đó không được canh và không gì đỏ. Đúng lớp lỗi mà chốt này được dựng để chặn.
  rationale: Cùng lỗi với finding P162 đầu tiên: AC-2 cấm dùng bộ đếm làm thước phạm vi và đòi so khớp BẰNG ĐÚNG danh sách viết trước; mutant bỏ hẳn một gói khỏi vòng quét vẫn XANH, đúng lỗ AC-2 được dựng để chặn.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **P162 E4 lấy fixture từ hồ sơ _acceptance của một feature không liên quan, chọn bằng first-match**
  Người dùng thấy gì: Phép kiểm việc mang kết quả sang vòng sau có thể tự động đổi sang đối chiếu với một dự án cũ không liên quan khi có dự án mới ra đời, khiến việc phê duyệt đôi khi báo lỗi vì lý do không liên quan tới thay đổi đang xét.
  file: `tests/plugins/run-tests.sh:7139`
  severity: medium
  Đề xuất: known-limits

- **Bảng dữ liệu chỉ dùng cho test được ship vào gói acceptance-gate phát cho người dùng**
  Người dùng thấy gì: Gói phần mềm phát cho người dùng cuối sẽ mang theo một tệp dữ liệu chỉ phục vụ kiểm thử nội bộ, không ảnh hưởng tính năng nhưng làm gói nặng hơn một chút và dễ gây nhầm lẫn nếu ai đó sửa nhầm bản sao thay vì bản gốc.
  file: `scripts/sync-plugin-packages.sh:43`
  severity: medium
  Đề xuất: known-limits

- **evals.yaml E2 còn nói bảng ghim nằm 'trong contract', trái với contract sau S4-r2**
  Người dùng thấy gì: Tài liệu mô tả phép kiểm còn trỏ sai vị trí của bảng dữ liệu nguồn, có thể khiến người đọc lại sau này chép nhầm thông tin vào chỗ cũ và tạo ra hai bản dữ liệu mâu thuẫn nhau.
  file: `_acceptance/codex-script-packaging/evals.yaml:18`
  severity: low
  Đề xuất: known-limits

- **evals.yaml E5 vẫn mô tả phép đo neo-vào-decisions.jsonl mà chốt P162 đã bỏ — kỳ vọng khai báo không có thật**
  Người dùng thấy gì: Tài liệu mô tả phép kiểm vẫn nói có một lớp bảo vệ dựa trên lịch sử thay đổi, nhưng lớp đó thực ra không còn tồn tại; người đọc tài liệu để đánh giá độ an toàn có thể tin nhầm là có bảo vệ nhiều hơn thực tế.
  file: `_acceptance/codex-script-packaging/evals.yaml:39`
  severity: medium
  Đề xuất: known-limits

- **P162 E4 gắn vào workspace _acceptance đầu-bảng-chữ-cái và tính kỳ vọng bỏ qua luật atomic-pair của chính công cụ**
  Người dùng thấy gì: Phép kiểm việc mang kết quả sang vòng sau chưa mô phỏng đúng một quy tắc ghép cặp mà công cụ thật đang dùng, và việc chọn dữ liệu đối chiếu có thể tự đổi theo thời gian, khiến việc phê duyệt đôi khi báo lỗi vì lý do không liên quan tới thay đổi đang xét.
  file: `tests/plugins/run-tests.sh:7161`
  severity: medium
  Đề xuất: known-limits

- **scripts/codex-self-script-refs.tsv bị rsync vào gói acceptance-gate phát cho người dùng**
  Người dùng thấy gì: Một tệp dữ liệu chỉ dùng để kiểm thử nội bộ bị đóng gói kèm theo phần mềm phát cho người dùng; không gây lỗi chức năng nhưng tạo ra bản sao thừa dễ bị sửa nhầm về sau.
  file: `scripts/sync-plugin-packages.sh:43`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — quan hệ mang-sang chỉ đo ở MỘT ô suy biến của ma trận (delta không chạm gì)**
  Người dùng thấy gì: Phép kiểm việc mang kết quả từ vòng trước sang vòng sau chỉ thử tình huống không có gì thay đổi; nếu về sau công cụ này mang-sang sai trong tình huống có thay đổi thật, phép kiểm hiện tại sẽ không phát hiện ra.
  file: `tests/plugins/run-tests.sh:7152`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — assert không thể đỏ (tautology) đứng tên đối chứng phạm vi trong E6**
  Người dùng thấy gì: Một dòng kiểm tra trong bộ kiểm không thể nào báo lỗi dù dữ liệu có sai, nên nó tạo cảm giác có thêm một lớp bảo vệ trong khi thực ra không thêm gì.
  file: `tests/plugins/run-tests.sh:7221`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — evals.yaml E5 khai ma trận 2 đối chứng, phép đo chỉ có 1; đối chứng fail-open được mô tả không tồn tại trong mã**
  Người dùng thấy gì: Tài liệu mô tả phép kiểm tuyên bố có hai lớp kiểm chứng an toàn nhưng thực tế chỉ có một; người đọc tài liệu để đánh giá độ chắc chắn có thể tin nhầm mức bảo vệ cao hơn thực tế.
  file: `_acceptance/codex-script-packaging/evals.yaml:39`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/12 lỗi rơi vào file không bộ đo nào phủ (_acceptance/codex-script-packaging/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.