## Trong hợp đồng

- **Làn V (xanh-sạch, không chữ ký) `continue` trước khối re-pin/eval-lane/recheck — mâu thuẫn với chính claim «soi MỌI hồ sơ ở MỌI lượt» của diff**
  file: `scripts/pre-merge-check.sh:981`
  severity: high
  AC: AC-1
  source: conventions
  detail: Nhánh `if [ -z "$signoff" ] … clean_ok=1` kết bằng `echo NOTE xanh-sạch; continue` (dòng 980-981), nên hồ sơ làn V không bao giờ tới: (a) luật làn-eval `checkRepinEvals` (dòng ~1163-1195) mà comment mới ở 1157-1161 và GUIDE.md:1046-1049 tuyên «soi MỌI hồ sơ trong kho ở MỌI lượt pre-merge, không thu theo diff»; (b) provenance re-pin (run_id/sha/suites_exit); (c) khối recheck — kể cả VIOLATION mới của AC-1 «re-check KHÔNG CHẠY ĐƯỢC» (dòng 1254, 1258-1261) — nghĩa là `recheck: strict` không cưỡng chế gì trên hồ sơ machine-cleared. Đây đúng lớp fail-open mà AC-2 (DLPS-LAN-V-STALE) vừa vá cho staleness: làn V thoát một phép kiểm chỉ vì không có chữ ký. Tái hiện bằng fixture.mjs của chính hồ sơ + dòng repin suite-only + section `### Re-pin` đúng khuôn REPIN-TEMPLATE: đối chứng dương (hồ sơ signed-off) → pre-merge VIOLATION «recorded no evals_exit» và recheck rc=1; cùng lane trên hồ sơ làn V → pre-merge in «NOTE [fx]: xanh-sạch», 0 VIOLATION dù `--base A --recheck-all`, trong khi `node scripts/recheck-evidence.cjs <report>` chạy tay trả rc=1 với đúng thông điệp ấy. Không có răng nào trong rang.sh/repin-evals.test.mjs (RE9a/b chỉ dựng hồ sơ có approved_by + chữ ký) đo ô làn V này.
  rationale: Finding tự nêu rõ nhánh continue của làn V chặn luôn VIOLATION «re-check KHÔNG CHẠY ĐƯỢC» mà AC-1 định nghĩa, và AC-1 không giới hạn given của nó cho riêng hồ sơ có chữ ký — nên đúng là một ô AC-1 thất bại.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Guard DLPS-LAN-V-STALE đảo ngược pattern STALE-DIFF-SCOPE-GUARD: DIFF_READY=0 → tắt im phép kiểm hoá cũ của làn V thay vì rơi về kiểm-tất**
  Người dùng thấy gì: Khi lưới chặn-merge chạy trong một số môi trường CI không dựng được lịch sử so sánh đầy đủ, phép kiểm 'bằng chứng đã cũ chưa' cho các hồ sơ chưa có chữ ký người có thể bị bỏ qua âm thầm — code đã đổi sau khi máy tự xác minh vẫn có thể lọt qua mà không có cảnh báo nào.
  file: `scripts/pre-merge-check.sh:956`
  severity: high
  Đề xuất: new-contract

- **`khong-can-nguoi.mjs --write` tự kiểm CHỈ bằng evaluateContractWrite, thiếu machineClearedSignoffConflict mà hook ghi-lúc-viết chạy cùng — ghi được machine-cleared lên hồ sơ đã có chữ ký**
  Người dùng thấy gì: Việc tự động đánh dấu hồ sơ là 'máy đã xác minh xong' qua dòng lệnh không kiểm tra hồ sơ đó đã có chữ ký người từ trước hay chưa, nên có thể tạo ra một trạng thái hồ sơ mâu thuẫn tạm thời — dù bước kiểm tra cuối cùng trước khi gộp mã vẫn sẽ phát hiện và chặn lại.
  file: `scripts/khong-can-nguoi.mjs:126`
  severity: medium
  Đề xuất: known-limits

- **rang.sh dùng `sed -i ''` (BSD/macOS) — file duy nhất trong tests/_acceptance làm vậy; CI runner là ubuntu-latest**
  Người dùng thấy gì: Một số bài kiểm thử nội bộ của tính năng này chỉ chạy đúng trên máy Mac, không chạy được trên máy chủ kiểm tra tự động dùng Linux — nếu chạy nhầm môi trường, các bài kiểm thử đó báo lỗi giả dù tính năng thật vẫn hoạt động đúng.
  file: `_acceptance/duong-lui-phai-song/rang.sh:102`
  severity: low
  Đề xuất: known-limits

- **khong-can-nguoi.mjs --write bypasses the hook's machine-cleared x human_signoff rule**
  Người dùng thấy gì: Việc tự động đánh dấu hồ sơ là 'máy đã xác minh xong' qua dòng lệnh không kiểm tra hồ sơ đó đã có chữ ký người từ trước hay chưa, nên có thể tạo ra một trạng thái hồ sơ mâu thuẫn tạm thời — dù bước kiểm tra cuối cùng trước khi gộp mã vẫn sẽ phát hiện và chặn lại.
  file: `scripts/khong-can-nguoi.mjs:127`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 (biến thể): bản base của phép so = `origin/main` — ref di động, không phải sha ghim; chiều đỏ của veto-ghi CHẮC CHẮN đỏ sau khi merge**
  Người dùng thấy gì: Một số bài kiểm thử nội bộ của tính năng này so sánh với phiên bản mới nhất trên nhánh chính thay vì một mốc cố định — ngay sau khi tính năng được gộp vào nhánh chính, chính các bài kiểm thử đó sẽ tự báo lỗi ở lượt kiểm tra kế tiếp dù không có gì sai thêm, gây tốn thời gian điều tra oan.
  file: `_acceptance/duong-lui-phai-song/rang.sh:224`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 2: fixture hợp đồng VIẾT TAY — comment đuôi dòng status chép tay từ contract-template.md, không rút từ khuôn (chính lớp lỗi S4-r2 vừa bắt)**
  Người dùng thấy gì: Một số dữ liệu mẫu dùng để kiểm thử tính năng được soạn tay thay vì sinh ra đúng từ khuôn mẫu hợp đồng thật — nếu khuôn mẫu thật thay đổi sau này, các bài kiểm thử này có thể không phát hiện ra sai lệch tương ứng.
  file: `_acceptance/duong-lui-phai-song/rang.sh:299`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: ma trận E8 khai «bốn ô exit 2 … và file không đổi byte» nhưng chỉ 2/4 ô kiểm byte**
  Người dùng thấy gì: Một phần bài kiểm thử tuyên bố kiểm tra 'file không bị ghi đè' cho bốn tình huống từ chối ghi, nhưng thực tế chỉ hai trong bốn tình huống đó thực sự được kiểm theo cách đó — hai tình huống còn lại có thể bỏ lọt việc ghi nhầm file trước khi báo lỗi được phát hiện.
  file: `_acceptance/duong-lui-phai-song/rang.sh:291`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3: E7 hứa GRAMMAR khai «veto: <lý do>» KÈM điều kiện máy-đi-trước, chân chỉ assert hai chuỗi có mặt rời nhau**
  Người dùng thấy gì: Bài kiểm thử cho quy tắc 'từ chối bằng một chữ' (veto) chỉ kiểm tra hai cụm từ có xuất hiện đâu đó trong tài liệu, không kiểm tra chúng có thực sự đi liền đúng ngữ cảnh với nhau hay không — nên tài liệu có thể bị viết sai chỗ mà bài kiểm thử vẫn báo đạt.
  file: `_acceptance/duong-lui-phai-song/rang.sh:265`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: ô V08 nhãn «verified × mo» nhưng bản CŨ trên đĩa là machine-cleared×mo rò từ V07 — ô khai khác ô đo**
  Người dùng thấy gì: Một ô trong bảng kiểm thử tự động của tính năng bị dán nhãn nhầm do dữ liệu từ bài kiểm trước đó chưa được dọn sạch — tình huống nó tuyên bố đang kiểm tra thực ra không được kiểm ở đây, dù tình huống đó vẫn được kiểm đúng ở một nơi khác.
  file: `tests/hooks/run-tests.sh:662`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
