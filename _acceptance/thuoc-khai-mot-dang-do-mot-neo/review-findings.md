## Trong hợp đồng

**«hai lượt một kết quả»: đối chứng âm là hằng đúng — nhánh «KHÔNG có răng» là mã chết, và câu PASS khai sai về bản cũ**
- file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:252`
- severity: high
- AC: AC-1

AC-1 và decision tkm16 yêu cầu: cùng cặp cây, bản CŨ theo `git merge-base` phải cho HAI kết quả KHÁC nhau — nếu không, phép so hai-lượt chỉ là hai chuỗi hằng. Bản cài đặt không đo điều đó.

`lane_theo_mergebase()` (rang.sh:113-120) KHÔNG trả phán quyết của bản cũ; nó in `MB: mốc=<sha> tập={<changed>}`. Chuỗi ấy nhúng merge-base SHA, mà `$KIT` (HEAD trên nhánh) và `$CL2` (detached ở `$MOC_KY`) theo định nghĩa có merge-base khác nhau. Nên `M1 != M2` LUÔN đúng, nhánh `elif [ "$M1" = "$M2" ] → bad "phép so hai-lượt KHÔNG có răng"` (rang.sh:253) là mã chết: không cặp cây nào của ca này làm nó nổ.

Đo thật (chạy lại nguyên văn `check_lane` bản cũ trên đúng cặp cây ca này dựng):
  TREE1 ($KIT):  "DO: tap file ma doi != {feature-loop/scripts/s4-args.mjs}: {}"  rc=1
  TREE2 ($CL2):  "DO: tap file ma doi != {feature-loop/scripts/s4-args.mjs}: {}"  rc=1
  → OLD MEASURE: IDENTICAL VERDICT ON BOTH TREES (giống cả thông điệp lẫn mã thoát).
Vậy câu PASS ở rang.sh:255 — «bản cũ theo merge-base cho HAI kết quả khác nhau» — sai ở mức phán quyết; nó chỉ đúng với một chuỗi thông tin phụ.

Hệ quả kép: vế `L1 = L2` cũng vô hiệu, vì `lane_song`/`tap_file` chỉ đọc hai hằng `$MOC_KY`/`$MOC_GOP` và cây làm việc — chúng độc lập HEAD *theo cấu trúc*, nên hai lượt bằng nhau là tất yếu, không phải tính chất đo được. Toàn bộ ca «hai lượt một kết quả» quay lại đúng hình dạng «so hai chuỗi hằng» mà S4 vòng 1 REJECT (review-findings «Hình dạng 3») và tkm16 tuyên đã đóng. Đây là vi phạm trực tiếp CLAUDE.md «Assertion âm-tính-một-mình là assertion không sống» ở tầng guard-của-guard, và đúng lớp bệnh hồ sơ này mở ra để chữa (thước tự khai một đằng đo một nẻo).

Để có răng thật, đối chứng âm phải so PHÁN QUYẾT (thông điệp + mã thoát) của chính hàm cũ, và cặp cây phải được chọn sao cho bản cũ thực sự cho hai phán quyết khác nhau (ví dụ một cây có commit chạm `s4-args.mjs` sau merge-base) — không phải so chuỗi có nhúng sha.

---

**Đối chứng âm của ô «hai lượt một kết quả» là tautology — nhánh guard không bao giờ chạy được**
- file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:252`
- severity: high
- AC: AC-1

AC-1 đòi thẳng: bản cũ lấy mốc bằng `git merge-base` phải cho HAI KẾT QUẢ KHÁC nhau trên cùng cặp cây, nếu không thì phép so chỉ là hai chuỗi hằng. Cài đặt không đo được điều đó.

`lane_theo_mergebase()` (dòng 113-121) không còn là bản cũ: nó bỏ hẳn bước `git diff --quiet base..HEAD -- REL_WF` và bỏ luôn verdict (`return 0` vô điều kiện), chỉ `echo "MB: mốc=$base tập={$changed}"`. Chuỗi so sánh vì thế NHÚNG chính $base. CL2 được `checkout --detach $MOC_KY` theo thiết kế nên base của nó luôn khác base của KIT ⇒ `M1 != M2` đúng theo cấu trúc, với mọi trạng thái kho. Nhánh `elif [ "$M1" = "$M2" ]` ở dòng 254 là mã chết.

Đo thật trên cây hôm nay: tái dựng đúng `check_lane` cũ rồi chạy trên cùng cặp cây (KIT ở HEAD và clone detached ở $MOC_KY) cho kết quả GIỐNG NHAU từng byte, kể cả mã thoát:
  OLD on KIT : DO: tap file ma doi != {feature-loop/scripts/s4-args.mjs}: {}  rc=1
  OLD on CL2 : DO: tap file ma doi != {feature-loop/scripts/s4-args.mjs}: {}  rc=1
Tức là điều kiện AC-1 đòi (bản cũ phân biệt được hai cây) THỰC TẾ SAI, nhưng ô vẫn PASS và còn in ra câu khẳng định ngược: «trong khi bản cũ theo merge-base cho HAI kết quả khác nhau».

Để có răng thật, `lane_theo_mergebase` phải trả về đúng verdict của bản cũ (gồm cả bước diff REL_WF + `return 1` khi lệch) và phép so phải so verdict + mã thoát, không so chuỗi có nhúng sha mốc.

---

**Hình dạng 2 — «đối chứng âm» là bản VIẾT TAY khác phép đo cũ: M1≠M2 chỉ vì in kèm sha mốc, không vì kết quả khác**
- file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:113`
- severity: high
- AC: AC-1

`lane_theo_mergebase()` (rang.sh:113-119) được khai trong comment là «đây là bản CŨ, lấy mốc bằng git merge-base — tức đúng thứ bệnh vòng 06/09 vá», và răng ở dòng 254 dùng nó làm điều kiện có-răng: `elif [ "$M1" = "$M2" ]; then bad "phép so hai-lượt KHÔNG có răng"`. Nhưng nó KHÔNG phải phép đo cũ: `check_lane` cũ trả PHÁN QUYẾT (rc≠0 + dòng «DO: lane hội đồng đã đổi» / «DO: tập file mã đổi ≠ {...}»), còn bản này bỏ hẳn cả hai phép so, luôn `return 0`, và `echo "MB: mốc=$base tập={$changed}"`. Tôi chạy lại NGUYÊN VĂN `check_lane` cũ (bản trước 5aa7221a) trên đúng cặp cây mà răng dùng ($KIT và clone detached tại MOC_KY): cả hai lượt trả BYTE-GIỐNG NHAU — `DO: tap file ma doi != {feature-loop/scripts/s4-args.mjs}: {}`. Nghĩa là với cặp cây này, phép đo cũ THẬT cho HAI lượt một kết quả, tức đối chứng âm đúng ra phải FAIL (`bản cũ ... cũng cho hai lượt giống nhau`). Ô PASS chỉ có được nhờ dòng `echo` mới in kèm `mốc=$base` — 5aa7221a vs 9b3d6f64 — một chuỗi khác nhau vì HEAD khác nhau, chứ không phải vì phán quyết khác nhau (`tập={}` giống hệt ở cả hai lượt, xem output thật ở dòng PASS cuối). Lời hứa AC-1 «bản CŨ lấy mốc bằng merge-base phải cho HAI kết quả KHÁC nhau» vì thế không được đo bằng kết quả nào cả.

---

**Hình dạng 3 — «hai lượt một kết quả» so hai chuỗi HOÀN TOÀN là hằng của script, trong khi lời hứa là quan hệ «kết quả không đổi theo HEAD»**
- file: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh:250`
- severity: high
- AC: AC-1

Dòng 250-253 dựng `L1`/`L2` từ `lane_song` + `tap_file` rồi assert `[ "$L1" != "$L2" ] → bad`. Khi cả hai lượt xanh, đầu ra không chứa MỘT mẩu dữ liệu nào đọc từ kho: `lane_song` in «OK: vế lane (sống) — $REL_WF trên cây giống bản tại mốc ký $MOC_KY» và `tap_file` in «OK: ... trong $base..$tip tập file mã đổi = {$REL_S4}» — REL_WF, REL_S4, MOC_KY, MOC_GOP đều là hằng khai ở đầu script, còn base/tip là hằng truyền vào (dòng 250-251 truyền MOC_GOP/MOC_KY chứ không truyền HEAD). Đầu ra thật (chạy 06/09) xác nhận: hai dòng OK không có ký tự nào phụ thuộc cây. Vậy `L1 = L2` là hai chuỗi hằng bằng nhau theo cấu tạo, không thể đỏ vì lý do được nêu. Cụ thể: nếu `lane_song` được viết theo `git diff MOC_KY..HEAD -- $REL_WF` (đúng thứ HEAD-phụ-thuộc mà ô này tuyên bắt), cả $KIT lẫn clone detached tại MOC_KY vẫn XANH (acceptance-verify.js không đổi trong khoảng MOC_KY..HEAD), L1 vẫn bằng L2, ô vẫn PASS. Chỗ duy nhất phân biệt so-cây với so-HEAD là chiều đỏ 1b (dòng 238-241), không phải ô này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **9 đột biến P86 không kiểm mũi tiêm có trúng; hai ca đột biến bản EN có thể hoá no-op im lặng và nhánh quan hệ EN không có chiều đỏ nào**
  Người dùng thấy gì: Nếu sau này ai đó viết lại câu ngân sách trong tài liệu tiếng Anh theo cách khác, phần kiểm tra tự động có thể âm thầm không còn phát hiện lỗi ở bản tiếng Anh nữa, dù báo cáo vẫn hiện thành công.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: new-contract

- **E6 của hồ sơ ĐÃ KÝ inputs-tinh-tu-goc-kho vẫn mô tả `git merge-base` — expected và executor trôi khỏi nhau**
  Người dùng thấy gì: Mô tả trong hồ sơ đã ký trước đó không còn khớp với cách hệ thống thực sự kiểm tra, nên người đọc lại tài liệu này sau này có thể hiểu nhầm cách nó hoạt động.
  file: `_acceptance/inputs-tinh-tu-goc-kho/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Vế ngân sách bản EN của P86 không có chiều đỏ nào — xoá hẳn phép kiểm mà suite vẫn xanh**
  Người dùng thấy gì: Nếu phần kiểm tra ngân sách dành cho bản tiếng Anh của tài liệu bị xoá nhầm, hệ thống vẫn báo mọi thứ ổn thay vì cảnh báo cho người dùng biết có lỗi.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 5 — P86 tuyên lớp {3 vế ngân sách} × {2 bản chép} nhưng mọi đột biến chỉ đáp xuống bản VI; nửa EN của phép so quan hệ không có chiều đỏ nào**
  Người dùng thấy gì: Một nửa phép kiểm tra ngân sách — phần dành riêng cho tài liệu tiếng Anh — có thể bị hỏng hoặc gỡ bỏ mà không ai nhận ra, vì không có cảnh báo nào bật lên khi điều đó xảy ra.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
