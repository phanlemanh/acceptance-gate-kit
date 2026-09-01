## Trong hợp đồng

### Hai bộ đọc cùng ô ngưỡng bất đồng: thẻ dùng `includes('[đề xuất]')`, lib dùng `value.startsWith`
- file: `scripts/gate-card.js:363`
- severity: medium
- AC: AC-2
- detail: `lib/nguong-o-co-hoi.cjs` tự khai là «LUẬT DUY NHẤT trả lời ô ngưỡng đang ở đâu» và dặn «ai thêm bên đọc thứ ba thì GỌI hàm này, đừng chép luật». Làn Cổng Đáng gọi đúng lib cho tiền tố «Không đo được» (`NG.isKhongDoLine`) nhưng TỰ VIẾT luật cho tiền tố «[đề xuất]»:

  - lib `thresholdState`: `[...got.values()].some(v => v.startsWith(deXuat))` — xét GIÁ TRỊ của bullet, phải ĐỨNG ĐẦU.
  - gate-card.js:363 và :378: `l.includes(DE_XUAT)` — xét CẢ DÒNG, ở bất kỳ đâu.

  Tái lập (bullet đã chốt nhưng nhắc chữ `[đề xuất]` giữa câu):
  ```
  - Kết quả nào là SỐNG: Bon tuan sach (bo ban [đề xuất] cu).
  ```
  → `--extract` trả `"nguong": "chot"` (lib nói đã chốt) NHƯNG `de_xuat_lines` có dòng đó, và thẻ HTML đóng chip vàng «máy đề xuất — anh sửa hoặc nhận» lên nó. Người ký thấy thẻ nói «máy còn đang đề xuất» trong khi trạng thái máy nói «đã chốt».

  Rủi ro nối tiếp: `commands/approve.md` bước 1 dạy «Gỡ tiền tố `[đề xuất]` khỏi mọi bullet ngưỡng» — nếu bên ký cũng hiểu theo nghĩa rộng như thẻ, nó sẽ cắt chuỗi giữa câu của người viết. Đường sửa đúng tầng: thêm `isDeXuatLine(line, deXuat)` vào lib (song sinh với `isKhongDoLine`) và gọi từ cả hai chỗ.

### Assertion âm-tính-một-mình: quét khoá `decision` mà đầu ra --extract của làn Cổng Đáng KHÔNG BAO GIỜ có, kèm đối chứng dương giả
- file: `_acceptance/cong-dang-co-cua/rang.sh:435`
- severity: high
- AC: AC-9
- detail: Chân `khong-viet-ho` (E9/AC-9), khẳng định (2):

  ```
  EN="$(node -e '...NAV_RULES["opportunity.md"].decision.enum...')"
  bad=0; for v in $EN; do printf '%s' "$X" | grep -qE "\"decision\"[[:space:]]*:[[:space:]]*\"$v\"" && bad=$((bad+1)); done
  [ "$bad" = "0" ] && ghim "(2) dau ra KHONG chua decision dien san" 0 || ...
  ```

  Đối chiếu khối `if (EXTRACT)` của làn gate 0 trong scripts/gate-card.js (dòng 355–365): JSON in ra chỉ có `gate`, `feature`, `cong_dang{nguong, loi_ra, nguong_lines, de_xuat_lines, flags}`. KHÔNG có khoá `decision` ở bất kỳ đâu. Nên regex `"decision": "build|iterate|park|kill"` không thể khớp bất cứ điều gì — `bad` luôn = 0, khẳng định (2) XANH vĩnh viễn bất kể gate-card làm gì.

  Đối chứng dương ở dòng 438–442 không chữa được điều đó vì nó đo một VẬT KHÁC bằng một PHÉP KHÁC:

  ```
  opp "$W2/_acceptance/co-dec" decided 'build' "$NG_CHOT"
  grep -qE '^decision: build' "$W2/_acceptance/co-dec/opportunity.md" \
    && ghim "doi chung duong (2): phep quet bat duoc decision khi no CO that" 0
  ```

  Nó grep FILE FIXTURE (đầu vào) bằng regex `^decision: build`, chứ không chạy gate-card rồi áp chính regex JSON đang được kiểm lên đầu ra. Đây đúng hình dạng «assertion âm-tính-một-mình»: xanh vì chưa bao giờ có gì để bắt, không phải vì máy không viết hộ. Ngoài ra evals.yaml E9 hứa quét CẢ hai đầu ra (render + --extract) kèm dạng chuỗi `decision:`; bản thi công chỉ quét `$X` (--extract), bỏ hẳn `$O` (thân thẻ) và bỏ dạng chuỗi `decision:`.

### Fixture không round-trip: vật của phép đo phán đoán E10 là bản HTML ĐÓNG BĂNG, không có nguồn nào trong cây sinh lại được
- file: `_acceptance/cong-dang-co-cua/evals.yaml:189`
- severity: high
- AC: AC-9
- detail: E10 khai `inputs: [evidence/the-cong-dang.html, opportunity.md]` và `expected: Panel đọc thẻ THẬT do lần chạy này render`. Nhưng không có executor nào render nó: diff `_acceptance/config.yaml` thêm 13 mục `cdcc_*` đều là `bash .../rang.sh --chan …`, không mục nào sinh `evidence/the-cong-dang.html`. File được commit một lần ở 394af3fb rồi nằm yên.

  Nặng hơn: ô nguồn đã render ra thẻ này KHÔNG CÒN trong cây — tiêu đề thẻ («Mỗi phiên làm việc đứng một cây riêng, để hai phiên thôi đè lên nhau») không khớp file nào khi grep toàn repo. `opportunity.md` đưa cho panel là của cong-dang-co-cua chính nó, tức hai đầu vào của phép đo phán đoán KHÔNG cùng một hồ sơ — panel không thể đối chiếu thẻ với ô nguồn của nó.

  Hệ quả: E10 sẽ PASS mãi mãi kể cả khi gate-card.js quay lại viết hộ verdict/chữ ký, vì thứ panel đọc là ảnh chụp chết chứ không phải đầu ra của lần chạy.

### Đối chứng dương không bao giờ đỏ được: `vi_tri` kết bằng `cut` nên mã thoát luôn 0
- file: `_acceptance/cong-dang-co-cua/rang.sh:509`
- severity: high
- AC: AC-11
- detail: Chân `ban-giao` (E12/AC-11) định nghĩa `vi_tri() { grep -nF "$2" "$1" | head -1 | cut -d: -f1; }` rồi dùng nó làm đối chứng dương: `vi_tri "$STA" 'acceptance-gate:uat-session <slug>' >/dev/null && ghim "doi chung duong: loi gia-tri van rut duoc" 0 || ghim ... 1 ...`.

  Mã thoát của pipeline là mã thoát của lệnh CUỐI. `cut` trả 0 kể cả khi không nhận được gì từ stdin, nên `vi_tri` luôn thoát 0 dù chuỗi vắng mặt hoàn toàn — kiểm chứng trực tiếp trên cây này: `grep -nF 'KHONG-CO-CHUOI-NAY' commands/start.md | head -1 | cut -d: -f1` không in gì, `rc=0`. Nhánh `|| ghim ... 1` chết, dòng «PASS: doi chung duong: loi gia-tri van rut duoc» in vô điều kiện. Hai chỗ dùng `vi_tri` khác thoát bẫy này chỉ vì chúng kiểm `[ -z "$L_THE" ]` trên giá trị chứ không kiểm mã thoát.

### Chiều đỏ tự thoả + assert «chuỗi có mặt» thay cho QUAN HỆ tên lệnh ký ↔ thân lệnh duyệt
- file: `_acceptance/cong-dang-co-cua/rang.sh:512`
- severity: high
- AC: AC-11
- detail: Chân `ban-giao` (E12/AC-11). evals.yaml E12 hứa «tên lệnh ký rút được và khớp tên thật của thân lệnh duyệt». Khẳng định thực thi (dòng 506–507) chỉ hỏi «commands/approve.md có chứa chuỗi "Chế độ Cổng Đáng" không» — tên lệnh rút từ start.md không hề tham gia so sánh, nên lời hứa QUAN HỆ được thi công thành một phép có-mặt-chuỗi trên một file thứ ba.

  Chiều đỏ ở dòng 512–515 vì thế không chạy lại phép đo nào: sau khi `tiem` thay tên lệnh trong bản sao của start.md, nó grep chính bản vừa tiêm để tìm lại chuỗi vừa bị thay — kết quả biết trước là «không thấy», nên nhánh PASS luôn chạy. Không có lượt gọi nào tới khẳng định dòng 506, cũng không có lượt chạy gate-card/start nào. Chiều đỏ (b) ở dòng 517–537 ngược lại có đo lại thứ tự dòng thật, cho thấy khoảng cách giữa hai chiều đỏ trong cùng một chân.

### Assert «chuỗi có mặt» thay cho quan hệ dòng: dấu «máy đề xuất» đếm khắp thẻ chứ không kiểm nó nằm trên CHÍNH dòng ngưỡng
- file: `_acceptance/cong-dang-co-cua/rang.sh:202`
- severity: medium
- AC: AC-2
- detail: Chân `nguong-chua-chot` (E2/AC-2). evals.yaml E2 viết rõ khẳng định (c) là đo QUAN HỆ dòng, không phải chuỗi có mặt đâu đó trong thẻ. Bản thi công (dòng 202, 212–213) dùng `grep -o 'máy đề xuất' | wc -l` trên toàn bộ thân HTML — đếm số lần chuỗi xuất hiện ở BẤT KỲ đâu trong thẻ. Nếu chip «máy đề xuất» trôi khỏi dòng ngưỡng, `dx` vẫn ≥1 và (c) vẫn xanh, trong khi bất biến người cần (biết ĐÚNG dòng nào là máy đề xuất) đã vỡ — dù `--extract` (gate-card.js:363) đã trả sẵn `de_xuat_lines` cho quan hệ này. Kèm theo: evals.yaml E2 khai hai lượt tiêm cho (c); bản thi công chỉ có một, khẳng định (c) không có chiều đỏ nào.

### Tuyên ma trận toàn phần trên trục nấc nhưng không assert bốn ô rơi vào bốn nấc phân biệt
- file: `_acceptance/cong-dang-co-cua/rang.sh:216`
- severity: medium
- AC: AC-2
- detail: Chân `nguong-chua-chot` (E2/AC-2) tuyên «MA TRẬN TOÀN PHẦN 4 nấc × 3 khẳng định = 12 assert» và đóng bằng `[ "$DEM" = "12" ]`. Hai đầu của trục không được nối: tập tên nấc rút từ lib chỉ được so ĐẾM (`[ "$SO_NAC" = "4" ]`), không dùng vào khẳng định nào; nấc THỰC TẾ của từng ô (`$ST`) chỉ được nội suy vào nhãn `ghim`, không có phép so nào. Bốn ô n1–n4 được dựng bằng văn viết tay và GIẢ ĐỊNH rơi vào bốn nấc khác nhau, nhưng không gì canh giả định đó — nếu `thresholdState` gộp hai nấc, tập `{ST}` co lại còn 3 phần tử mà `DEM` vẫn đếm đủ 12 và chân vẫn xanh. Phép nối còn thiếu là một dòng: tập `$ST` thu được phải BẰNG `$NAC_LIB`.

### Dòng PASS in vô điều kiện trong `ba-ca-cu` — khẳng định «phân biệt được với bốn hằng kia» không có chiều đỏ
- file: `_acceptance/cong-dang-co-cua/rang.sh:333`
- severity: low
- AC: AC-6
- detail: Chân `ba-ca-cu` (E6/AC-6), hàm `run_ca` gọi `ghim "[$1] phan biet duoc voi bon hang kia" 0` với mã cứng `0` sau vòng lặp kiểm bốn hằng kia — dòng PASS này in bất kể bốn lượt kiểm phía trên kết quả ra sao, kể cả khi cả bốn đều bắt được lẫn màu. Bốn lượt kiểm thật chỉ tăng `DEM` trong nhánh `else` mà không in dòng PASS nào, nên trong bản ghi bằng chứng, dòng duy nhất nói về việc «phân biệt» chính là dòng không bao giờ đỏ được. Suite vẫn đỏ đúng qua `loi=1` và `[ "$DEM" = "18" ]` qua đường khác, nên đây không phải false-green ở mức mã thoát, nhưng đầu ra `output:` của E6 có một dòng PASS không mang thông tin.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hai lời thuật từ chối mới làm ĐỎ một eval thường trực của hồ sơ ĐÃ KÝ (kvtm_round_trip)**
  Người dùng thấy gì: Một số câu thông báo mới thêm vào có thể khiến phép kiểm tự động của một tính năng khác (đã chốt trước đó, không hề đổi) báo lỗi giả — người đọc kết quả kiểm có thể tưởng nhầm tính năng cũ đang hỏng.
  file: `commands/acceptance-card.md`
  severity: high
  Đề xuất: new-contract

- **Chốt chống cờ-ép chỉ đặt cho `--gate 0`; `--gate 1`/`--gate 2` vẫn rơi im lặng vào làn Cổng Đáng**
  Người dùng thấy gì: Nếu ai đó (hoặc một công cụ) cố tình yêu cầu xem cổng khác trên một hồ sơ mới chỉ đang chờ quyết định 'có đáng làm', hệ thống vẫn lặng lẽ hiện thẻ 'có đáng làm' thay vì báo rằng yêu cầu đó không áp dụng cho hồ sơ này.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: known-limits

- **Đối chứng dương SELF02 CHÉP lại phép quét thay vì GỌI phép quét của SELF01**
  Người dùng thấy gì: Đây là một điểm yếu trong cách tự kiểm tra nội bộ của hệ thống, không ảnh hưởng tới những gì người dùng nhìn thấy hay quyết định trên thẻ cổng.
  file: `tests/scripts/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Ba dòng `g0` thêm vào GATE-ONESHOT-SLOTS nằm ngoài tầm mọi phép đo round-trip thường trực**
  Người dùng thấy gì: Ba nhãn hướng dẫn mới thêm vào chưa được một phép kiểm tự động khác đối chiếu với thẻ thật — nếu sau này nhãn trên thẻ và nhãn trong tài liệu hướng dẫn lệch nhau, sẽ không có cảnh báo tự động nào bắt được.
  file: `skills/acceptance/references/human-facing-language.md`
  severity: medium
  Đề xuất: known-limits

- **Thẻ Cổng Đáng ghim CỨNG hai tiêu đề section của khuôn ô cơ hội, hỏng thì im lặng mất khối**
  Người dùng thấy gì: Nếu tên hai mục nội dung trong khuôn hồ sơ (mô tả vấn đề và giả định quan trọng) bị đổi trong tương lai, thẻ có thể âm thầm bỏ sót hai phần đó khi trình cho người ký, mà không có cảnh báo hay lỗi nào hiện ra.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **contract.md không đọc được → làn Cổng Đáng vẽ thẻ ký được cho hồ sơ ĐÃ qua Cổng Phạm vi (thẻ ma, exit 0)**
  Người dùng thấy gì: Nếu tệp hợp đồng của một hồ sơ đã hoàn tất bước duyệt phạm vi bị hỏng hoặc không đọc được, hệ thống có thể lại hiện nhầm thẻ 'việc này có đáng làm không' cho hồ sơ đó — như thể nó chưa từng được duyệt — và mời người ký lại một quyết định đã qua rồi, không một cảnh báo nào.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: new-contract

- **opportunity.md không đọc được → báo sai nguyên nhân «hồ sơ chưa có contract.md»**
  Người dùng thấy gì: Nếu tệp mô tả cơ hội của hồ sơ không đọc được, thông báo lỗi hiển thị nói sai nguyên nhân (nói 'chưa có hợp đồng' thay vì 'tệp không đọc được'), có thể khiến người xử lý đi sai hướng khi khắc phục.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **`--gate 1`/`--gate 2` bị làn Cổng Đáng nuốt im lặng (bất đối xứng với chốt `--gate 0`)**
  Người dùng thấy gì: Khi cố tình yêu cầu xem một cổng khác trên hồ sơ chỉ đang ở bước 'có đáng làm', hệ thống không báo rằng yêu cầu đó không hợp lệ mà lặng lẽ hiện thẻ của cổng khác — người dùng có thể không nhận ra mình đang xem nhầm cổng.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 8/16 lỗi rơi vào file không bộ đo nào phủ (tests/scripts/run-tests.sh, _acceptance/cong-dang-co-cua/rang.sh, _acceptance/cong-dang-co-cua/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
