## Trong hợp đồng

### 1. kr_snapshot's producing tar is on the left of a pipe, so its failure never reaches `bad`
- file: `scripts/rang-khuon.sh:59`
- severity: low
- source: bugs
- AC: AC-1

`( cd "$KR_KIT" && tar -cf - ... ) | ( cd "$dest" && tar -xf - ) || { bad "kr_snapshot: chep cay that bai"; return 1; }` — without `pipefail` a pipeline's status is the last command's, so a failure on the producing side (bad `KR_KIT_OVERRIDE`, unreadable source tree, tar aborting mid-stream) is invisible and the extractor's success greens the guard.

Confirmed in bash on this machine:

    bash -c 'set -u;           ( cd /nope && tar -cf - . ) | ( cd out && tar -xf - ) || echo CAUGHT'   # prints nothing, status 0
    bash -c 'set -uo pipefail; ( cd /nope && tar -cf - . ) | ( cd out && tar -xf - ) || echo CAUGHT'   # prints CAUGHT

Both current callers (`_acceptance/khuon-rang-dung-chung/rang.sh:3` and `_acceptance/nhanh-chinh-khong-ten-main/rang.sh:6`) set `set -uo pipefail`, and the `[ -e "$dest/$vat" ]` check catches a fully-empty copy, so nothing is broken today — this is latent, not live. It matters because the file's stated Chốt 2 is that every infrastructure failure path calls `bad`, and this is a shared khuôn meant to be the floor for future rang.sh files: the guarantee currently depends on the caller remembering `pipefail`. Either set `pipefail` inside `kr_snapshot` (save/restore the option) or capture the producer's status via `PIPESTATUS`.

Rationale (AC-1): AC-1 nêu đích danh "chép cây thất bại" là một bước móng phải luôn kết thúc ĐỎ; finding chỉ ra một đường mà thất bại ở phía tạo bản sao có thể không được khuôn tự phát hiện nếu người gọi thiếu pipefail — đúng kịch bản AC-1 cam kết.

### 2. Assertion âm-tính-một-mình: ô (b) của chân carry không phân biệt được — nó xanh y hệt khi vật hỏng
- file: `_acceptance/khuon-rang-dung-chung/rang.sh:86`
- severity: high
- source: measurement
- AC: AC-7

Ô (b) `echo 'doi2' >> helper.cjs; ...; chay ... && [ "$(carried)" = "0" ] && ok "(b) chạm helper.cjs → KHÔNG carry (đảo mặc định, không danh-sách-trắng)"` dùng `--carry-anchor "$A"` với $A vẫn là commit `r1` gán ở dòng 75 — chưa hề được đặt lại sau ô (a). Delta `A..HEAD` tại ô (b) vì thế đã chứa `_acceptance/demo/rang.sh` (commit `sh` của ô (a)) BÊN CẠNH `helper.cjs`. Kiểm chứng bằng git trên fixture dựng lại y hệt: delta = `helper.cjs`, `rang.sh`, `run-log.jsonl`. Vì `.sh` không thuộc PAPER_EXTS, deltaFiles đã khác rỗng do rang.sh, nên carried=0 là kết quả TẤT YẾU dù `.cjs` được xử lý thế nào.

Đã phá thử để chứng minh: chép trọn cây kit, thêm `'.cjs'` vào PAPER_EXTS (đúng lớp lỗi mà ô (b) tuyên bắt: coi mã thực thi là giấy), dựng lại đúng fixture của chân rồi chạy → `carried = 0`, tức ô (b) vẫn PASS. Lời hứa của E7 («chạm helper.cjs (đuôi thứ ba — chứng đảo-mặc-định, không danh-sách-trắng) → KHÔNG carry») do đó không có phép đo nào đứng sau: ô này không thể đỏ vì lý do nó xưng. Muốn sống, ô (b) phải đặt lại anchor về commit `sh` để delta CHỈ có helper.cjs.

Rationale (AC-7): Đây là ca kiểm chứng cho đúng lời hứa của AC-7 (chạm đuôi không-phải-giấy → không carry); finding chứng minh bằng phá thử rằng ca này vẫn xanh ngay cả khi hành vi AC-7 mô tả bị hỏng, tức AC-7 chưa thực sự được chứng minh.

### 3. Tuyên quét LỚP nhưng chỉ có điểm-case: danh sách PAPER_EXTS 7 phần tử, chỉ 1 phần tử có assert — và marker không có bộ đọc
- file: `_acceptance/khuon-rang-dung-chung/rang.sh:90`
- severity: medium
- source: measurement
- AC: AC-7

E7 (evals.yaml:95-96) khai một mệnh đề LỚP: «chỉ LOẠI đuôi giấy đã biết, mọi đuôi khác GIỮ». Lớp «đuôi giấy» được vật hoá ở feature-loop/scripts/s4-args.mjs:293 thành 7 phần tử `['.md','.jsonl','.yaml','.json','.html','.png','.txt']`, lại được bọc marker `<<<CARRY-PAPER-EXTS ... CARRY-PAPER-EXTS>>>` (dòng 292/294) đúng khuôn một-nguồn. Nhưng: (a) `grep -rn 'CARRY-PAPER-EXTS'` trên toàn repo chỉ ra ĐÚNG ba dòng của chính khối đó — không phép đo nào rút danh sách từ marker, nên marker là chỉ dẫn chết, không phải nguồn của thước; (b) phía «giấy» chỉ có MỘT ô: dòng 88-90 sửa `contract.md` rồi assert carried=1 — tức `.md` là phần tử duy nhất có assert. Sáu đuôi còn lại (`.jsonl .yaml .json .html .png .txt`) không có ô nào; `.jsonl` tuy có mặt trong delta của ô (a)/(b) nhưng kết quả ở đó do rang.sh quyết, không quan sát được. Xoá bất kỳ đuôi nào ngoài `.md` khỏi danh sách → toàn bộ chân vẫn xanh. Đây là ma trận thiếu phần tử, không phải ma trận toàn phần viết-trước (số assert phải bằng số phần tử).

Rationale (AC-7): AC-7 hứa một mệnh đề LỚP về toàn bộ danh sách đuôi giấy; finding chứng minh bằng phá thử rằng chỉ một phần tử trong bảy được kiểm chứng thật, sáu phần tử còn lại không có ca nào — AC-7 chưa được chứng minh trọn vẹn như đã hứa.

### 4. Fixture viết tay đúng khuôn bên đọc: KR3 không round-trip writer→reader của phép vi phân
- file: `tests/scripts/rang-khuon.test.mjs:104`
- severity: medium
- source: measurement
- AC: AC-3

E3 (evals.yaml:40-43) hứa «Phép vi phân trên fixture code-sinh: ... (b) bản tiêm là NO-OP hành vi (đổi comment) → CÙNG LỆNH cho kết quả giống nhau → kr_vi_phan đỏ». Lưới thường trực KR3 lại gõ tay cả hai vế: `writeFileSync(a,'exit:2\nloi A\n'); writeFileSync(b,'exit:0\nkhac\n')` (dòng 104) rồi `writeFileSync(b,'exit:2\nloi A\n')` (dòng 107). Không lệnh nào được chạy, không bản tiêm nào được dựng, và khuôn log (`exit:<n>` ở dòng đầu + đuôi đầu ra) được test tự bịa đúng hình dạng mà bên đọc mong đợi.

Bên VIẾT thật của khuôn log này là `chay_log()` ở _acceptance/nhanh-chinh-khong-ten-main/rang.sh:70-75 (`echo "exit:$?" > "$2"; tail -3 "$TMP/.o" >> "$2"`), bên ĐỌC là `kr_vi_phan` (scripts/rang-khuon.sh:84). Không ca nào trong lưới thường trực nối hai bên đó. Hệ quả cụ thể: nếu `chay_log` trôi sang chỗ ghi thứ khác nhau theo từng lần chạy (đường dẫn script, thư mục tạm, dấu thời gian trong `tail -3`), thì mọi lời gọi `kr_vi_phan` sẽ luôn thấy hai file KHÁC nhau và luôn cho đi tiếp — chốt cứng số 1 chết lặng mà KR3 vẫn xanh, vì KR3 chưa bao giờ đọc thứ writer thật sinh ra. Ràng buộc này càng nặng sau merge: bộ răng hồ sơ (nơi round-trip thật đang diễn ra) chết theo hồ sơ, chỉ tests/scripts/rang-khuon.test.mjs còn lại theo ADR 0011.

Rationale (AC-3): AC-3 là về phép vi phân của khuôn (kr_vi_phan) trên kết quả THẬT của một lệnh chạy; finding cho thấy ca kiểm chứng KR3 tự viết tay cả hai phía thay vì chạy lệnh thật, nên không chứng minh được AC-3 hoạt động đúng trên seam writer→reader thật.

### 5. Tuyên quét LỚP bằng danh sách gõ tay: «chạy TRỌN các chân» là sáu tên literal, không rút từ nguồn
- file: `_acceptance/khuon-rang-dung-chung/rang.sh:31`
- severity: low
- source: measurement
- AC: AC-5

Chú thích dòng 29 khai «(2) chạy TRỌN các chân của bộ răng mới», và E5 khai «chạy trọn 6 chân → tất cả passed». Phép đo lại là một danh sách literal: `for c in master-khong-remote nhanh-la-cau-huong-dan remote-tra-loi doc-bat-buoc-van-dong ci-single-branch khong-doan-sang-ten-khac`. Lớp thật là tập nhánh `case` của $NCKT — hôm nay đúng 6 nhánh (dòng 82, 124, 141, 199, 214, 285 của _acceptance/nhanh-chinh-khong-ten-main/rang.sh), nên phép đo trùng khớp ở lần chạy này. Nhưng danh sách không suy từ nguồn: thêm một chân thứ bảy vào $NCKT, hoặc đổi tên một chân, thì vòng lặp vẫn xanh trọn mà chân mới chưa từng chạy — đúng hình dạng «danh sách tay» mà chính hồ sơ này đi bắt ở chỗ khác (dòng 43-48 rút API từ marker thay vì gõ tay). Cách sống: rút tên chân bằng grep các nhãn `case` từ chính $NCKT rồi lặp trên tập rút được, và ghim số lượng bằng phép đếm độc lập.

Rationale (AC-5): AC-5 yêu cầu chạy TRỌN các chân của rang.sh viết lại để chứng minh không hồi quy; finding cho thấy "trọn" hiện là một danh sách tay có thể trôi khỏi nguồn thật, nên phép chạy trọn mà AC-5 hứa không được đảm bảo.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Bằng chứng neo sai cây — verified_commit trỏ commit TRƯỚC vòng vá S4-r1**
  Người dùng thấy gì: Báo cáo bằng chứng của tính năng này có thể đang xác nhận kết quả dựa trên phiên bản mã CŨ, từ trước khi một loạt sửa lỗi thật sự được đưa vào — nghĩa là kết quả "đạt" được ghi lại chưa chắc phản ánh đúng phiên bản cuối cùng sắp được gộp.
  file: `_acceptance/khuon-rang-dung-chung/evidence-report.md`
  severity: high
  Đề xuất: new-contract

- **Viết lại rang.sh của hồ sơ ĐÃ KÝ kéo nó vào diff → stale-cascade, pre-merge CHẶN merge**
  Người dùng thấy gì: Việc viết lại phần kiểm tra cho một tính năng khác đã được duyệt trước đó khiến hệ thống tự động chặn việc gộp mã cho tới khi tính năng đó được xác nhận lại — cần xử lý bước xác nhận lại này trước khi hoàn tất gộp.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: high
  Đề xuất: known-limits

- **PAPER_EXTS xếp `.yaml`/`.json` là giấy — bảng lệnh executor và evals.yaml vẫn vô hình với carry**
  Người dùng thấy gì: Nếu ai đó chỉnh sửa chính công thức tính điểm đạt/không-đạt hoặc lệnh chạy kiểm tra, hệ thống có thể vẫn hiển thị lại kết quả "đạt" từ lần chạy trước thay vì chạy lại theo công thức mới.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: known-limits

- **Marker CARRY-PAPER-EXTS không có bộ đọc nào — danh sách vẫn tồn tại hai bản gõ tay**
  Người dùng thấy gì: Danh sách loại tệp được xem là "không quan trọng" khi xét thay đổi hiện đang được giữ ở hai nơi tách biệt trong tài liệu, có nguy cơ hai nơi này lệch nhau theo thời gian mà không ai phát hiện.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: known-limits

- **kr_git từ chối git worktree và submodule — cửa hạ tầng làm đỏ nhầm vật**
  Người dùng thấy gì: Khi tính năng này chạy trong một số kiểu bản sao mã nguồn đặc biệt (ví dụ không gian làm việc phụ), công cụ kiểm tra nội bộ có thể báo lỗi sai dù mọi thứ vẫn ổn — hiện chưa xảy ra trong thực tế vì chưa nơi nào dùng kiểu bản sao đó.
  file: `scripts/rang-khuon.sh`
  severity: medium
  Đề xuất: known-limits

- **Ca sweep đổ hàng nghìn dòng lỗi tar vào đầu ra của lưới thường trực**
  Người dùng thấy gì: Khi chạy bộ kiểm tra thường xuyên của tính năng, một số bước kiểm thử tạo ra hàng nghìn dòng thông báo lỗi vô hại nhưng làm log kết quả khó đọc.
  file: `tests/scripts/rang-khuon.test.mjs`
  severity: low
  Đề xuất: known-limits

- **PAPER_EXTS treats evals.yaml / config.yaml as paper, so changing the measure still carries stale PASS**
  Người dùng thấy gì: Nếu ai đó chỉnh sửa chính công thức tính điểm đạt/không-đạt hoặc lệnh chạy kiểm tra, cơ chế mang-kết-quả-sang giữa các vòng có thể vẫn giữ kết quả "đạt" cũ thay vì chạy lại theo công thức mới.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: high
  Đề xuất: known-limits

- **Stale-evidence rule still drops all of _acceptance/** — the reversed default landed in only one of two places**
  Người dùng thấy gì: Một cơ chế chặn gộp mã khi bằng chứng đã cũ vẫn chưa được cập nhật đồng bộ với thay đổi của vòng này, nên có khả năng gộp mã dựa trên bằng chứng lỗi thời ở một vài đường khác ngoài đường vừa được xử lý.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/13 lỗi rơi vào file không bộ đo nào phủ (_acceptance/khuon-rang-dung-chung/evidence-report.md, scripts/pre-merge-check.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.