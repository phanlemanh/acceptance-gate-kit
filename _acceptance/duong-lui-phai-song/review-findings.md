## Trong hợp đồng

- **`da-veto` có vết + T2 mở khoá Cổng-1 cho cả `status: signed-off`/`approved` với approved_by rỗng và cho new-file/draft → verified**
  file: `lib/evidence-core.cjs:616`
  severity: low
  source: bugs
  AC: AC-6
  AC-6 thêm `vetoRecorded` vào điều kiện `if (!approvedBy && !gate1Skipped && !vOpen && !vetoRecorded)`. Điều kiện đó bọc CẢ HAI failure: «status approved/signed-off/machine-cleared với approved_by rỗng» và «(new file|draft) → implemented/verified/machine-cleared bỏ Cổng 1». Nên một contract T2 mới tinh hoặc draft ghi thẳng `status: verified` (hoặc `signed-off`, `approved`) với approved_by rỗng chỉ cần kèm `veto_state: da-veto` + `veto_opened_at` hợp lệ là qua hook ghi. Mục đích AC-6 chỉ là cho hồ sơ máy-đi-trước ĐANG `mo` chuyển sang `da-veto` (V07/V08); không có kiểm `oldPayload` từng là `mo`, và không loại `signed-off`/`approved` (hai trạng thái không thuộc làn V). Lưới trước-merge vẫn chặn `da-veto chưa xử` nên không đi tới merge, nhưng ở tầng GHI đây là nới rộng hơn AC-6 khai; test V07–V10 chỉ phủ 4 ô nên không thấy. Siết: `vetoRecorded` chỉ khi `oldStatus` khác null và vetoGateState(oldPayload).state === 'mo', hoặc chỉ miễn failure thứ nhất cho status ∈ {verified, machine-cleared}.
  Rationale: AC-6 chốt rõ ma trận chỉ 4 ô trên status ∈ {verified, machine-cleared}, nhưng điều kiện vetoRecorded trong code lại nới luôn cho status signed-off/approved với approved_by rỗng — vượt ra ngoài đúng phạm vi AC-6 đã khai, nên AC-6 chưa được thực thi đúng như hợp đồng.

- **Hình dạng 6 (đo máy của tác giả): mũi «node vắng» giả lập bằng `PATH=/usr/bin:/bin` — giả định node không nằm ở /usr/bin**
  file: `_acceptance/duong-lui-phai-song/rang.sh:148`
  severity: low
  source: measurement
  AC: AC-1
  Chân `recheck-vang` (E1) mũi `node-vang` dòng 148 chạy pre-merge với `env PATH=/usr/bin:/bin` để mô phỏng thiếu node. Trên máy tác giả (macOS, node qua Homebrew/nvm) mũi tiêm trúng; trên checkout Linux có node distro tại /usr/bin/node, node vẫn có → nhánh strict «node vắng» (pre-merge-check.sh:1259) không bao giờ chạy → assert dòng 154 đỏ vì HẠ TẦNG chứ không vì vật (lớp P150). Mũi tiêm không tự kiểm «node thật sự vắng» (ví dụ `! env PATH=… command -v node`) trước khi tin kết quả — bước tiêm không có phép vi phân bản-tiêm-phải-khác-bản-gốc như hàm `inject` đã làm cho các mũi khác.
  Rationale: AC-1 đích danh yêu cầu kiểm chứng nhánh 'node vắng' trong ba nhánh recheck-không-chạy-được; nếu mũi tiêm không thật sự tạo được tình trạng node vắng trên một số máy, bằng chứng cho nhánh này của AC-1 không đáng tin — trực tiếp làm suy yếu AC-1.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Làn V chỉ bị kiểm hoá cũ khi DIFF_READY=1 — ngược doctrine STALE-DIFF-SCOPE-GUARD (fail-open khi không có --base hoặc diff không dựng được)**
  Người dùng thấy gì: Khi hệ thống không xác định được phạm vi thay đổi của một lượt duyệt (ví dụ chạy mà không so với nhánh gốc), hồ sơ do máy tự thông qua trước đó có thể trót lọt dù mã nguồn đã đổi sau đó, trong khi loại hồ sơ có chữ ký người vẫn bị kiểm đầy đủ trong tình huống y hệt. Người dùng có thể ghép một thay đổi mà bằng chứng đã lỗi thời mà không nhận được cảnh báo nào.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: new-contract

- **khong-can-nguoi.mjs --write tự kiểm THIẾU machineClearedSignoffConflict — cửa ghi duy nhất sinh ra hồ sơ mà hook ghi-lúc-viết sẽ CHẶN**
  Người dùng thấy gì: Nếu quá trình ký duyệt bị gián đoạn giữa chừng, công cụ ghi kết quả tự động có thể vô tình ghi đè lên chữ ký mà người phê duyệt vừa để lại, mà không có cảnh báo nào ngăn việc đó. Người phê duyệt có thể phát hiện quyết định của mình bị máy âm thầm thay thế sau đó.
  file: `scripts/khong-can-nguoi.mjs`
  severity: medium
  Đề xuất: new-contract

- **rang.sh dùng `sed -i ''` (BSD-only) — lệch nếp portable `sed -i.bak … && rm -f` của cả kho**
  Người dùng thấy gì: Kịch bản kiểm tra nội bộ này hiện chỉ chạy đúng trên máy Mac và có thể báo lỗi nếu ai đó chạy nó trên máy Linux. Việc này chỉ ảnh hưởng người vận hành kiểm thử nội bộ, không ảnh hưởng người dùng sản phẩm.
  file: `_acceptance/duong-lui-phai-song/rang.sh`
  severity: low
  Đề xuất: known-limits

- **Làn V stale check tắt im khi không có phạm vi diff (fail-open, ngược với đường hồ sơ có chữ ký)**
  Người dùng thấy gì: Khi hệ thống không xác định được phạm vi thay đổi của một lượt duyệt, hồ sơ do máy tự thông qua có thể được coi là còn mới dù mã đã đổi sau đó, khác với cách hồ sơ có chữ ký người vẫn bị kiểm đầy đủ. Người dùng có thể ghép một thay đổi mà bằng chứng đã lỗi thời mà không có cảnh báo.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: new-contract

- **Hồ sơ làn V (không chữ ký) `continue` trước luật làn-eval, re-pin provenance và recheck-evidence — ba luật «soi MỌI hồ sơ» không chạm hồ sơ machine-cleared**
  Người dùng thấy gì: Những hồ sơ do máy tự thông qua (không qua người ký) có thể bỏ qua hoàn toàn một số lớp kiểm tra bằng chứng mà hồ sơ có chữ ký người vẫn phải vượt qua. Điều đó có nghĩa loại hồ sơ ít được người giám sát nhất lại đang là loại được kiểm tra lỏng nhất.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 6 (đo cây khác cây đang kiểm): bản base của E6 là `origin/main` — mốc trôi, đỏ vĩnh viễn sau khi merge**
  Người dùng thấy gì: Một bài kiểm tra nội bộ dùng mốc mã nguồn đang thay đổi liên tục làm chuẩn so sánh, nên sau khi tính năng này được gộp vào nhánh chính, chính bài kiểm tra đó có thể tự báo lỗi mãi mãi dù sản phẩm không có gì sai. Đây là rủi ro vận hành nội bộ cho đội kỹ thuật, không phải lỗi hiển thị cho người dùng cuối.
  file: `_acceptance/duong-lui-phai-song/rang.sh`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 1 (đo chỉ dẫn do chính test tái diễn thay vì đầu ra): bước 7c «làn đỏ → KHÔNG commit» được test tự thực hiện rồi tự assert**
  Người dùng thấy gì: Bước kiểm tra 'không được ký khi có lỗi' được chính bài kiểm tra tự dựng lại rồi tự chấm, thay vì đo hành vi thật của một phiên làm việc thật. Đây là giới hạn đã được ghi nhận trước trong hồ sơ, không phải phát hiện mới.
  file: `_acceptance/duong-lui-phai-song/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính chỉ ghim mã thoát, không ghim thông điệp): V09/V10 block bằng exit 2 trong khi cùng payload trúng ≥2 luật chặn khác nhau**
  Người dùng thấy gì: Một số bài kiểm tra chỉ xác nhận thao tác bị chặn, mà không xác nhận bị chặn đúng vì lý do gì; nếu quy tắc mới của tính năng này bị xoá nhầm sau này, bài kiểm tra vẫn có thể báo xanh nhờ một quy tắc cũ khác. Rủi ro là một lỗi thật trong quy tắc mới có thể không bị phát hiện kịp thời.
  file: `tests/hooks/run-tests.sh`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 2 (round-trip rút-từ-writer rồi VÁ thêm cờ): lệnh làn rút từ SIGNOFF-LANE-CLAUSE bị nối `--ag-root $KIT` — đường consumer thật (resolve-plugin) không bao giờ chạy**
  Người dùng thấy gì: Bài kiểm tra không chạy đúng con đường mà người dùng thật sự sẽ đi qua khi dùng lệnh ký ở dự án của họ, mà chạy một đường tắt riêng chỉ dùng cho môi trường thử nghiệm. Vì vậy một lỗi có thể xảy ra ở con đường thật mà không bị bài kiểm tra này phát hiện.
  file: `_acceptance/duong-lui-phai-song/rang.sh`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): DLPS1/RT6 grep dòng lệnh CLI trong SKILL.md, không round-trip tới bộ parse của khong-can-nguoi.mjs**
  Người dùng thấy gì: Bài kiểm tra này chỉ xác nhận đúng câu chữ trong tài liệu hướng dẫn khớp với kỳ vọng, chứ không xác nhận công cụ dòng lệnh thực sự chấp nhận đúng câu lệnh đó. Đây là giới hạn đã được ghi nhận trước trong hồ sơ, không phải phát hiện mới.
  file: `tests/workflows/skill-claims.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ.

- **Hình dạng 1 (đo chỉ dẫn, không reader nào đọc): khối GRAMMAR chỉ được grep chuỗi con; gate-card.js hardcode nhãn, không đọc GRAMMAR**
  file: `_acceptance/duong-lui-phai-song/rang.sh:261`
  severity: low
  source: measurement
  Chân `veto-slot` (E7) dòng 261: `has "$GR" 'veto: <lý do>' && has "$GR" 'để yên'` — assert hai chuỗi con xuất hiện Ở BẤT KỲ ĐÂU trong khối GATE-ONESHOT-GRAMMAR. Không code path nào đọc khối GRAMMAR (grep scripts/gate-card.js + lib/*.cjs: chỉ SLOTS được checker P192 đọc; nhãn «veto hay để yên» hardcode ở gate-card.js:818/994). Expected E7 hứa «GRAMMAR có luật «veto: <lý do>» kèm điều kiện máy-đi-trước» và «mục signoff» — không assert nào kiểm điều kiện máy-đi-trước hay vị trí mục; chuỗi 'để yên' có sẵn ở dòng SLOTS liền kề nên gần như không thể đỏ. Phần SLOTS (dòng 260) thì đã có round-trip P192 che, nhưng phần GRAMMAR là grep-hướng-dẫn đơn thuần.

## Chưa adversarial-verify (refuter chết)

(không có)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).