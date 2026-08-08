## Trong hợp đồng

### sign-batch accepts comment-only bypass_ack (fails open on its own reject rule)
- file: `scripts/sign-batch.mjs:61`
- severity: medium
- source: bugs
- AC: AC-3

The AC-3 extension check is `if (bypass === 'true' && !/^bypass_ack:\s*\S/m.test(report)) reject(...)`. `\S` matches `#`, so a placeholder line `bypass_ack: # chờ ai đó gật` (comment-only, no actual name) satisfies the check — confirmed by executing the regex: it returns true for that input. sign-batch then signs the bypassed report and prints the commit command; pre-merge-check.sh later rejects it because `front_field` strips trailing comments (`ack` reads empty → VIOLATION bypass_used without bypass_ack). Net effect: the helper's stated invariant ("người phải nhận đường thoát trước khi ký", line 57) is violated — the human lands a signature commit on a record the gate will refuse to merge. This is the same comment-bypass defect class the kit already fixed once (Đợt 6 HIGH, D10), and the sibling checks in this very file get it right (verdict uses `[^\s#]+`; human_signoff explicitly treats comment-only as unsigned). Fix: require a non-comment value, e.g. `/^bypass_ack:\s*[^\s#]/m`. Identical bug in the mirror `plugins/acceptance-gate/scripts/sign-batch.mjs:61` — fix source then run `scripts/sync-plugin-packages.sh`.

Rationale: AC-3 đòi rõ hồ sơ `bypass_used=true` mà chưa có `bypass_ack` phải bị TỪ CHỐI cả lô; một dòng `bypass_ack` chỉ có comment (không giá trị thật) vẫn được chấp nhận như đã có ack, vi phạm đúng nhánh từ-chối này.

### Hình dạng 3 — hứa ĐẲNG THỨC tập hợp nhưng chỉ assert MỘT chiều bao hàm (P185)
- file: `tests/plugins/run-tests.sh:9261`
- severity: high
- source: measurement
- AC: AC-1

evals.yaml E1 hứa "quan hệ khai↔quét là ĐẲNG THỨC tập hợp", nhưng `measure()` (dòng 9261-9271) chỉ kiểm chiều discovered − declared (file NGOÀI tập khai). Chiều ngược — một file TRONG tập khai (FILES) mất mention `time_human_minutes` (trường hợp "tập-khai-thừa") — không được đo: measure chỉ kiểm file-tồn-tại, không kiểm file khai còn mention. Chỉ có một assert điểm-case cho riêng `commands/signoff.md` (dòng 9280). Bằng chứng ngay trong code: dòng 9292 là comment khai mutant "tap-khai-thua: mention trong 1 file khai bien mat -> do ghim ten" nhưng KHÔNG có dòng code nào theo sau — mutant được tuyên trong thông điệp MUTANT-OK (dòng 9293) mà chưa từng chạy; nếu viết ra, nó sẽ XANH oan vì `measure()` không phát hiện được hình dạng này.

Rationale: AC-1 đòi rõ quan hệ tập-file-khai↔tập-quét phải là ĐẲNG THỨC tập hợp; `measure()` chỉ kiểm một chiều (file ngoài tập khai), bỏ sót chiều file-trong-tập-khai-mất-mention mà AC đòi phải đo cả hai chiều.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Top-level docs still teach the mandatory-minutes ritual and the old minutes-KPI that 2.0.0 removed**
  Người dùng thấy gì: Một số tài liệu hướng dẫn (GUIDE.md, QUICKSTART.md, README.md) vẫn dạy người dùng điền số phút và coi đó là chỉ số đo, dù bản cập nhật này đã bỏ yêu cầu đó — người đọc các tài liệu này có thể bị hướng dẫn sai hoặc lỗi thời.
  file: `GUIDE.md`
  severity: medium
  Đề xuất: known-limits

- **Codex acceptance-report twin: unbalanced parenthesis and dropped tự-khai clause vs Claude twin (already acknowledged as known limit i)**
  Người dùng thấy gì: Bản hướng dẫn dành cho Codex thiếu cụm cảnh báo "dữ liệu tự khai — không đáng tin" mà bản dành cho Claude có, khiến người dùng Codex có thể hiểu nhầm số phút cũ là dữ liệu đáng tin cậy.
  file: `codex/acceptance-gate/skills/acceptance-report/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Distributed package manifests point to CHANGELOG.md that does not exist inside the packages (already acknowledged as known limit ii)**
  Người dùng thấy gì: Các gói cài đặt trỏ người dùng tới file CHANGELOG.md để xem lịch sử thay đổi, nhưng file đó không có trong gói đã cài — người dùng bấm vào sẽ gặp đường dẫn chết.
  file: `feature-loop/.claude-plugin/plugin.json`
  severity: low
  Đề xuất: known-limits

- **KPI 'human-touch frequency' command counts machine commits as human events**
  Người dùng thấy gì: Con số "tần suất người phải ra tay" trong báo cáo có thể bị thổi phồng vì đôi khi nó đếm luôn những lần máy tự động ghi hoặc sửa hồ sơ, không chỉ những lần người thật sự ký hay can thiệp — số liệu có thể không phản ánh đúng công sức người dùng đã bỏ ra.
  file: `commands/acceptance-report.md`
  severity: medium
  Đề xuất: known-limits

- **Codex acceptance-report SKILL edit left unbalanced paren and dropped the untrusted-label qualifier**
  Người dùng thấy gì: Bản hướng dẫn dành cho Codex thiếu cụm cảnh báo "dữ liệu tự khai — không đáng tin" mà bản dành cho Claude có, khiến người dùng Codex có thể hiểu nhầm số phút cũ là dữ liệu đáng tin cậy.
  file: `codex/acceptance-gate/skills/acceptance-report/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **P187/P191 human-commit eval depends on ambient git identity and gpgsign**
  Người dùng thấy gì: Một số bài kiểm thử nội bộ của kit có thể báo lỗi giả trên máy chưa cấu hình sẵn danh tính Git hoặc đang bật ký GPG bắt buộc — chỉ ảnh hưởng người bảo trì kit khi chạy bộ kiểm thử, không ảnh hưởng người dùng cuối.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — contract fixture VIẾT TAY khớp khuôn bên đọc dù template có mold trích được (P187 + P191)**
  Người dùng thấy gì: Một phần bộ kiểm thử tự tạo dữ liệu mẫu bằng tay thay vì trích từ khuôn mẫu chính thức — nếu khuôn mẫu đó sau này đổi định dạng, phần kiểm thử này có thể không phát hiện ra và báo xanh nhầm, che giấu lỗi thật.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 — discover() chưa từng được chứng minh biết đỏ: mutant tập-hợp đi vòng qua walker (P185)**
  Người dùng thấy gì: Một phần bộ kiểm thử chưa từng được chứng minh là phát hiện được lỗi thật, vì nó dùng phép tính giả lập thay vì tạo file thật rồi quét lại — nếu cơ chế quét file bên dưới bị hỏng âm thầm, bài kiểm thử này sẽ không báo động.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (biến thể) — mutant P191 đo BẢN SAO chép tay của phép trích, không chạy bên đọc thật**
  Người dùng thấy gì: Một bài kiểm thử tự chép lại logic đọc dữ liệu thay vì gọi đúng đoạn code thật đang chạy trong sản phẩm — nếu logic đọc thật sau này thay đổi, bài kiểm thử này có thể vẫn báo xanh dù đã mất khả năng phát hiện lỗi.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).