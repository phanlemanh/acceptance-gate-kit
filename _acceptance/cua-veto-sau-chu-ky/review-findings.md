## Trong hợp đồng

- **Hai ngữ pháp khoá human_signoff (chuKyThat chấp `=` và cách-trước-dấu-hai-chấm, front_field không) → hai câu trái nhau trong cùng một lượt**
  file: `lib/evidence-core.cjs:1089`
  severity: medium
  source: bugs
  AC: AC-6
  `chuKyThat` khớp khoá bằng /^human_signoff[ \t]*[:=]/i nên đọc được `human_signoff = Tên` và `human_signoff : Tên`; `front_field` (awk, scripts/pre-merge-check.sh:391) chỉ khớp `^human_signoff:`. Chạy thật một hồ sơ làn V T2 với dòng `human_signoff = Manh Phan 2026-09-11` cho ra CÙNG LÚC: `NOTE [eq-sign]: ... Cổng 2 đã có chữ ký người (Manh Phan 2026-09-11): cửa veto đã đóng bằng chữ ký` và `NOTE [eq-sign]: xanh-sạch — máy đi tiếp, KHÔNG mời ký (...). Cửa veto vẫn mở.` Không fail-open (bên bash chặt hơn vẫn điều khiển việc chặn), nhưng $SIGNOFF_THAT khai một người ký mà phần còn lại của lưới coi là rỗng — đúng hình dạng bên-viết-bên-đọc-trôi. Lưu ý `frontmatterField` (JS, start-scan.mjs dùng) khớp với chuKyThat; chỉ `front_field` của bash lệch.
  AC rationale: AC-6 liệt đích danh ba cách viết khoá 'human_signoff =', 'human_signoff :' (khoảng trắng trước dấu) và viết hoa là chữ ký THẬT phải đóng cửa ở CẢ HAI bộ đọc khớp nhau theo cấu trúc; finding cho thấy front_field (nhánh bash) không nhận hai cách viết này trong khi chuKyThat (JS) nhận, đúng hình dạng lệch mà AC-6 cấm.

- **Hình dạng 4 — ALLOWED_REMOVALS nhận hai dòng TỔNG QUÁT (`  esac`, `  return 1`), DV5 mù với 10 dòng thật; đối chứng dương DV5m không phân biệt được**
  file: `tests/scripts/additive-only.test.mjs:33`
  severity: high
  source: measurement
  AC: AC-9
  Diff thêm vào `ALLOWED_REMOVALS` (dòng 33–34) hai chuỗi nguyên văn `  esac` và `  return 1`. `measure()` (dòng 271) lọc bằng `ALLOWED_REMOVALS.includes(l)` — so khớp CẢ DÒNG, TOÀN diff, không neo vị trí, không neo khối `placeholder_signoff`. Đếm trên cây hiện tại: `grep -cxF '  esac' scripts/pre-merge-check.sh` = 7, `grep -cxF '  return 1'` = 3. Nghĩa là từ nay xoá bất kỳ dòng nào trong 10 dòng đó — dấu đóng của MỌI khối `case` thụt 2 và MỌI `return 1` của các hàm vị từ (chốt fail-closed của một luật) — đều biến mất khỏi phép đo DV5, dù nó không liên quan gì tới đổi khuôn chữ ký. Đây là hình dạng 4 vì màu xanh của DV5 là một assertion ÂM TÍNH: `assert.deepEqual(removed, [], …)` (dòng 295). Đối chứng dương duy nhất của nó, DV5m (dòng 298–307), tiêm vào một dòng chứa `VIOLATION` + `stale` — dòng đó KHÔNG nằm trong allowlist, nên DV5m vẫn xanh y nguyên dù allowlist có rộng bao nhiêu. Không có assert nào ghim «mỗi mục allowlist chỉ khớp đúng một dòng trong file» hay «allowlist không khớp dòng nào ngoài khối vừa gỡ». Hệ quả: phép đo không phân biệt được «không dòng luật cũ nào bị gỡ» với «dòng luật cũ bị gỡ nhưng trùng một dòng bash tổng quát đã được miễn». Sáu mục kia thêm cùng lượt (`case "$(printf …)" in`, ba dòng `'>'…`, `pending*…`, câu NOTE) đều là chuỗi duy nhất — chỉ hai dòng này bị.
  AC rationale: AC-9 yêu cầu mọi dòng bị gỡ khỏi pre-merge-check.sh phải liệt ĐÍCH DANH trong ALLOWED_REMOVALS; finding chứng minh hai mục hiện tại khớp cả dòng-toàn-văn không neo vị trí nên vô tình miễn trừ 10 dòng thật khác (mọi 'esac'/'return 1' trong file) khỏi phép đo — đúng lỗ hổng mà AC-9 phải chặn.

- **Hình dạng 4 — chiều đỏ 1 của chan-khong-noi tin vào «số VIOLATION giảm», không ghim dòng nào và không chứng bản sao còn chạy**
  file: `_acceptance/cua-veto-sau-chu-ky/chan-khong-noi.mjs:44`
  severity: medium
  source: measurement
  AC: AC-7
  Dòng 39–47: tiêm `; continue` vào sau câu NOTE «cửa veto đã đóng bằng chữ ký» của bản sao lưới, rồi kết luận `if (vMut.length >= vLanh.length) → ĐỎ`. Ba vấn đề chồng nhau: (1) Phép so CHỈ là số lượng — không ghim VIOLATION nào phải mất. Bất kỳ nguyên nhân nào làm bản sao in ít dòng `VIOLATION ` hơn đều đọc thành «chiều đỏ đã chạy». (2) `F.runPremerge` nuốt mã thoát (fixture.mjs: `bash -c '...; echo "__MA__$?"'`), nên một bản sao CHẾT cho `vMut = []`, tức `0 < vLanh.length` → chiều đỏ «xanh» mà đột biến chưa hề thi hành. Không có assert nào (mã thoát, một dòng chứng-sống) chặn ca này. (3) Mốc so `vLanh` không phải bản lành của CÙNG binary: dòng 43 chạy lưới BASE (`cayBase`) trên chính kho đã bị tiêm, chứ không chạy lưới HEAD chưa tiêm. Nên khi số giảm, phép đo không tách được «`continue` nuốt chốt bằng chứng» với «base vốn đã in nhiều VIOLATION hơn». Đối chiếu: phần chiều đỏ 2 ngay dưới (dòng 52–61) làm đúng — ghim cả mã thoát 97 lẫn chuỗi «LỖI HẠ TẦNG». Chiều đỏ 1 thì không có vế nào tương đương.
  AC rationale: AC-7 quy định nguyên văn chiều đỏ bắt buộc: 'bản sao cho nhánh đã-ký continue trước các chốt bằng chứng thì ≥1 ô đổi mã thoát, và phép đo ĐỎ nêu «bản sửa đổi luật chặn»'; finding cho thấy phép thử hiện tại chỉ so số lượng VIOLATION (không so mã thoát, không ghim thông điệp) và nuốt mã thoát nên một bản sao chết cũng có thể báo đỏ giả — đúng chiều đỏ mà AC-7 yêu cầu nhưng chưa đạt.

- **Hình dạng 4 — chiều đỏ của chan-van-ban tiêm vào BẢN SAO CỦA PHÉP ĐO, và vế `_Avoid_` không có chiều đỏ nào**
  file: `_acceptance/cua-veto-sau-chu-ky/chan-van-ban.mjs:79`
  severity: medium
  source: measurement
  AC: AC-11
  `goVat()` (dòng 62–70) chép ba tệp văn bản ra thư mục tạm, XOÁ đúng chuỗi mà chính vị từ đang grep, rồi kiểm tra vị từ trả false. Phép này chỉ chứng «hàm `includes` hoạt động»; nó không chạm vật nào ngoài bản sao của đầu vào phép đo, nên không phân biệt được «văn bản có mặt vì lệnh thật sự dặn thế» với «phép đo grep đúng chuỗi mình vừa viết ra». Cụ thể hơn, chiều đỏ 3 (dòng 79–80) gỡ `'ĐÓNG cửa veto'` và kiểm `t.includes('ĐÓNG cửa veto')` — chỉ đánh vào vế `i > 0` của vị từ ở dòng 32–36. Vế thứ hai của cùng vị từ, `t.slice(i, i + 1200).includes('_Avoid_')`, KHÔNG có chiều đỏ nào: xoá `_Avoid_` khỏi CONTEXT.md hoặc đẩy nó ra ngoài cửa sổ 1200 ký tự thì không phép thử nào trong hồ sơ đỏ. Cộng với việc chân này tự khai giới hạn «(a) đo CHỈ DẪN», ba trong bốn vật của E11 hiện chỉ có màu xanh từ chính phép grep của mình.
  AC rationale: AC-11(c) đòi CONTEXT.md có luật kèm `_Avoid_`, và AC-11 ghi rõ 'Chiều đỏ: gỡ từng vật khỏi bản sao thì ĐỎ, gọi tên đúng vật bị gỡ'; finding chỉ ra vế `_Avoid_` của đúng vị từ đó không có phép thử chiều đỏ nào — gỡ `_Avoid_` khỏi CONTEXT.md không làm phép đo đỏ, vi phạm trực tiếp yêu cầu này của AC-11.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Câu NOTE «MỘT nguồn» hỏng cú pháp: node nhận đường dẫn có dấu nháy literal → danh sách RỖNG + stack trace ra stderr**
  Người dùng thấy gì: Một dòng thông báo phụ (không ảnh hưởng quyết định chặn/cho-qua) hiện in ra rỗng và ghi thêm một lỗi kỹ thuật vào log nội bộ khi chạy kiểm tra trước khi gộp mã.
  file: `scripts/pre-merge-check.sh:1541`
  severity: high
  Đề xuất: known-limits

- **Chú thích khai `[ -n "$_vsig" ]` «không còn tới được» — sai, chữ ký giữ-chỗ vẫn rơi vào nhánh đó**
  Người dùng thấy gì: Một dòng ghi chú kỹ thuật trong mã mô tả sai một nhánh xử lý đang hoạt động bình thường; rủi ro chỉ là người bảo trì sau này đọc nhầm và xoá oan đoạn mã đó.
  file: `scripts/pre-merge-check.sh:826`
  severity: low
  Đề xuất: known-limits

- **Luật CHẶN giữ-chỗ chữ ký thành fail-open khi thiếu lib/evidence-core.cjs (trước đây thuần bash, không cần node)**
  Người dùng thấy gì: Nếu một dự án khác lấy lại kịch bản kiểm tra này mà quên chép kèm thư mục thư viện đi cùng, việc phát hiện chữ ký giữ-chỗ (chưa ký thật) có thể bị bỏ qua và cho hồ sơ chưa ký hợp lệ đi qua.
  file: `scripts/pre-merge-check.sh:443`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 — chiều đỏ của chan-lan-can kết luận chỉ từ VẮNG MẶT: bản sao chết cũng cho cùng màu xanh**
  Người dùng thấy gì: Một bài tự-kiểm nội bộ dùng để xác nhận một nhóm luật liền kề vẫn hoạt động có thể báo 'đã kiểm tra đúng' ngay cả khi bản sao dùng để thử bị hỏng vì lý do khác, do chỉ dựa vào việc một câu thông báo có xuất hiện hay không.
  file: `_acceptance/cua-veto-sau-chu-ky/chan-lan-can.mjs:77`
  severity: medium
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ.

- **NOTE cua lưới in danh sách RỖNG — `$(node \"$CHU_KY_LIB\" bang-mau)` bị escape sai, node không chạy**
  file: `scripts/pre-merge-check.sh:1541`
  severity: high
  source: bugs
  Trong `echo "NOTE: ... prefix list — $(node \"$CHU_KY_LIB\" bang-mau) (dấu * = ...)"`, hai dấu `\"` bên trong command substitution là KÝ TỰ NHÁY THẬT, nên node nhận đường dẫn `<root>/"<root>/lib/evidence-core.cjs"` → MODULE_NOT_FOUND. Chạy thật (fixture human_signoff: TBD, lưới đầy đủ) in ra: `prefix list —  (dấu * = khớp tiền tố)` — danh sách rỗng, kèm stack trace của node đổ ra stderr giữa lượt chạy cổng. Script chỉ có `set -u` nên không có gì đỏ; hỏng hoàn toàn im lặng, và không test/eval nào chấm dòng NOTE đã render (mọi chỗ nhắc `bang-mau` khác đều là comment / decisions.jsonl). Bản base in đủ danh sách. Đúng lớp lỗi mà chính hồ sơ này đi bắt: câu tự xưng «đọc từ MỘT nguồn» nhưng không đọc được gì. Vá: bỏ backslash — `$(node "$CHU_KY_LIB" bang-mau 2>/dev/null)`.

## Chưa adversarial-verify (refuter chết)

⚠ Cụm ngoài vùng phủ: 4/9 lỗi rơi vào file không bộ đo nào phủ (lib/evidence-core.cjs, _acceptance/cua-veto-sau-chu-ky/chan-lan-can.mjs, _acceptance/cua-veto-sau-chu-ky/chan-khong-noi.mjs, _acceptance/cua-veto-sau-chu-ky/chan-van-ban.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
