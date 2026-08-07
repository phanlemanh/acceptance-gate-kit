## Trong hợp đồng

- **Hình dạng 2 — Fixture VIẾT TAY đúng khuôn bên đọc, trong khi E3 cấm đích danh điều này**
  file: `tests/plugins/run-tests.sh:9311`
  severity: high
  AC: AC-3
  detail: E3 (evals.yaml) hứa: "hồ sơ fixture sinh từ khuôn evidence-report-template.md, cấm viết tay khớp khuôn helper đọc". Nhưng P187 dựng evidence-report.md bằng printf viết tay (dòng 9311): front-matter chứa đúng dòng `human_signoff:` trống — chính là khuôn mà reader của sign-batch.mjs đòi (`/^human_signoff:\s*$/m`, scripts/sign-batch.mjs:55). Không có round-trip nào từ evidence-report-template.md (khuôn writer thật). Nếu writer/template thật trôi khuôn (ví dụ đổi cách ghi human_signoff), sign-batch sẽ từ chối hồ sơ thật ngoài đời mà P187 vẫn xanh — đúng hình dạng (3) "bên VIẾT và bên ĐỌC trôi khỏi nhau vì mọi test tự dựng fixture đúng khuôn bên đọc" trong CLAUDE.md, và vi phạm nguyên văn expected của chính E3.
  source: measurement

- **Hình dạng 3 — E1 hứa QUAN HỆ đẳng-thức khai↔quét nhưng assert là hằng-đúng (so tập với chính nó)**
  file: `tests/plugins/run-tests.sh:9240`
  severity: medium
  AC: AC-1
  detail: E1 expected: "quét tập 7 file khai — quan hệ khai↔quét là ĐẲNG THỨC tập hợp". Trong P185, check `if scanned != sorted(FILES)` (dòng 9240) so `scanned = sorted(texts.keys())` với `sorted(FILES)` — nhưng `texts` được dựng từ chính FILES (vòng `for f in FILES`), và mọi mutant đều là `mut = dict(texts)` giữ nguyên key. Nhánh này không thể đỏ trong bất kỳ code path nào — quan hệ được hứa bị đo bằng phép so-một-giá-trị-với-chính-nó. Phần còn sống của P185 chỉ là quét chuỗi FORBIDDEN; đẳng thức tập hợp mà eval tuyên bố không hề được đo (không có nguồn độc lập thứ hai — ví dụ rút tập file từ khối marker TCD-MUST-NOT hay từ paths của evals.yaml — để so).
  source: measurement

- **Hình dạng 3 — E3 hứa 'MỘT lệnh git commit đích danh' nhưng assert chỉ là chuỗi-có-mặt**
  file: `tests/plugins/run-tests.sh:9325`
  severity: medium
  AC: AC-3
  detail: E3 expected: "stdout in MỘT lệnh git commit đích danh" (đích danh = nêu tên đúng các file vừa sửa). P187 assert bằng glob `case "$outS" in *"git add"*"git commit"*)` (dòng 9325) — chỉ kiểm hai chuỗi có mặt, không kiểm quan hệ lệnh↔tập-file-đã-sửa và không kiểm tính "MỘT lệnh". Một helper hồi quy in `git add -A && git commit ...` (quét cả file không liên quan) vẫn qua glob này, và cũng qua luôn bước eval + pre-merge phía sau vì trong fixture không có thay đổi nào khác ngoài chữ ký — nên tính đích danh không được phân biệt ở bất kỳ tầng nào của case.
  source: measurement

- **Hình dạng 4 (một nửa) — mutant P187 không ghim thông điệp 'helper tu commit' mà eval hứa**
  file: `tests/plugins/run-tests.sh:9346`
  severity: low
  AC: AC-3
  detail: E3 expected: "mutation trong bản sao helper (mở khoá tự-commit) → đỏ ghim 'helper tu commit'". Nhánh mutant của P187 chỉ assert `[ "$M1" -gt "$M0" ]` (dòng 9346) — tức chứng minh mutant SỐNG (git log đổi), rồi tự echo 'phep do vach: helper tu commit' mà không có phép đo nào thật sự chạy đỏ và in/ghim thông điệp đó. Đối chứng dương có (N0==N1 ở dòng 9324) và injection-chết được phân biệt (cp/node hỏng → M1==M0 → fail), nên nửa "âm-tính-một-mình" được che; nhưng nửa "ghim đúng thông điệp" của lời hứa trong eval không tồn tại trong code — logic phát hiện bị tái-cài-đặt inline (đếm git log lần hai) thay vì cho chính phép đo chạy trên mutant.
  source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Truncated edit leaves unclosed parenthesis and drops the tự-khai qualifier in Codex acceptance-report SKILL**
  Người dùng thấy gì: Bản hướng dẫn Codex cho bước báo cáo có thể còn sót một câu chỉ dẫn bị cắt cụt giữa chừng, khiến người đọc bản Codex dễ hiểu nhầm về cách xử lý số phút cũ — dù quy tắc dán nhãn chính vẫn còn nguyên ở chỗ khác trong tài liệu.
  file: `codex/acceptance-gate/skills/acceptance-report/SKILL.md:25`
  severity: medium
  Đề xuất: known-limits

- **Plugin descriptions point consumers to CHANGELOG.md that 4 of the 5 non-root packages do not ship (dead pointer per the repo's own P162 convention)**
  Người dùng thấy gì: Mô tả một số gói cài đặt có thể trỏ người dùng tới file lịch sử thay đổi không được đi kèm trong chính gói họ cài, khiến người muốn xem lại các thay đổi gặp liên kết chết.
  file: `codex/acceptance-gate/.codex-plugin/plugin.json:4`
  severity: medium
  Đề xuất: known-limits

- **sign-batch.mjs interpolates --name unescaped into YAML frontmatter and the printed git commit command**
  Người dùng thấy gì: Nếu người ký nhập tên có ký tự đặc biệt, hồ sơ chữ ký và dòng lệnh git được in ra có thể bị sai định dạng hoặc chứa nội dung ngoài ý muốn mà người ký phải tự phát hiện và sửa tay.
  file: `scripts/sign-batch.mjs:63`
  severity: low
  Đề xuất: known-limits

- **sign-batch signs PENDING-JUDGMENT reports — verdict never checked, contradicting its own atomic-reject boundary**
  Người dùng thấy gì: Công cụ ký hàng loạt có thể đóng dấu chữ ký xác nhận cho những hồ sơ vẫn đang chờ người ra phán quyết cuối cùng, khiến bản ghi trông như đã có người rà soát trong khi thực tế chưa ai xem qua.
  file: `scripts/sign-batch.mjs:50`
  severity: high
  Đề xuất: new-contract

- **Signature silently corrupted when --name contains JS replacement patterns or shell metacharacters**
  Người dùng thấy gì: Nếu tên người ký chứa một số ký tự đặc biệt, chữ ký được ghi vào hồ sơ có thể bị âm thầm sai lệch mà không có cảnh báo nào, gây khó khăn khi đối chiếu lại sau này.
  file: `scripts/sign-batch.mjs:66`
  severity: low
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ

- **Codex acceptance-report SKILL parse line is truncated/drifted vs Claude twin**
  file: `codex/acceptance-gate/skills/acceptance-report/SKILL.md:25`
  severity: low
  source: bugs
  detail: Line 25 reads '`gate1_skipped` (va `time_human_minutes` {gate1, gate2};' — unbalanced parenthesis and it dropped the qualifier the Claude twin carries ('nếu có — chỉ để trình dưới nhãn tự-khai', commands/acceptance-report.md:21-22), while keeping the old '{gate1, gate2}' shape. The step-1 parse instruction for the Codex harness therefore no longer tells the model that minutes parsed here are display-under-untrusted-label only; only the intro paragraph carries the rule. Test P186 still passes because it only greps for the label string and the KPI command anywhere in the file, so this drift is invisible to the suite. Same text is mirrored at plugins/acceptance-gate/skills/acceptance-report/SKILL.md:25 — fix in codex/ source and re-sync.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).