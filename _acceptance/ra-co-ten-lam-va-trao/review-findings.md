# Review Findings: ra-co-ten-lam-va-trao (round 1)

## Trong hợp đồng

### Khối «sáu điều kiện xanh-sạch — NGUỒN DUY NHẤT» khai một điều kiện mà bản bash không kiểm; ca đo hardcode đúng chỗ thiếu đó
- file: `skills/acceptance/references/evidence-report-template.md:138`
- severity: medium
- AC: AC-1
- source: conventions

Khối mới khai sáu điều kiện và ghi rõ «scripts/khong-can-nguoi.mjs (xanhSach) và scripts/pre-merge-check.sh (xanh_sach_check) kiểm ĐÚNG thứ tự này», trong đó có `enforcement  enforcement_mode không off`.

`xanhSach` (scripts/khong-can-nguoi.mjs:60) CÓ kiểm `enforcement_mode`. `xanh_sach_check` (scripts/pre-merge-check.sh:328–372) thì KHÔNG — nó chỉ kiểm verdict / bypass_used / risk_tier / UNCERTAIN / hai section. Hai bản «sáu điều kiện» không nói cùng một câu, đúng lớp bên-viết-bên-đọc-trôi-khỏi-nhau mà chính khối này sinh ra để giết.

Tệ hơn: RT1 (`tests/plugins/ra-co-ten.test.mjs:147`) ghim `orderSh = ['= "PASS"', 'bypass_used', 'risk_tier', 'UNCERTAIN', '"Known limits" "Ngoài hợp đồng"']` — CỐ Ý bỏ `enforcement_mode` khỏi vế bash. Phép đo round-trip vì thế KHÔNG THỂ đỏ cho điều kiện đó ở cả hai chiều (khối khai thừa, hoặc bash thiếu). Vật được giao (bash) và thước không gắn vào nhau.

Hệ quả thật: `xanh_sach_check` giờ là răng của trạng thái mới `machine-cleared` (pre-merge-check.sh:706) VÀ của nhánh làn V ở Cổng 1 (dòng 740). Báo cáo `enforcement_mode: off` + PASS + T2 + hai mục rỗng vẫn được hai chỗ đó coi là xanh-sạch (chốt `enf=off` ở dòng ~928 mới chặn) — trong khi máy quét/thẻ dùng `xanhSach` lại nói hồ sơ CÒN cần người. Hai bề mặt, hai câu trả lời, cùng một hồ sơ.

Rationale: AC-1 đòi danh sách sáu điều kiện trong khối marker phải bằng đúng thứ tự của cả xanhSach() lẫn xanh_sach_check (round-trip ba đầu), nhưng bash thiếu điều kiện enforcement_mode và ca đo cố tình loại trừ nó khỏi vế so sánh nên round-trip không thể đỏ.

### Luật «bốn trạng thái ô ngưỡng» bị chép sang bộ đọc thứ hai và thứ ba thay vì hoisted vào lib; bản trong ca đo đã LỆCH
- file: `tests/plugins/ra-co-ten.test.mjs:631`
- severity: medium
- AC: AC-13
- source: conventions

`lib/workspace-record.cjs:8` viết thẳng doctrine: «Ai thêm bên đọc thứ ba thì gọi hàm này, đừng chép luật» — và diff này tuân đúng doctrine đó cho `DA_THONG_CONG_2` / `missingArtifact` / `conflictProblem`. Nhưng luật phân loại ô ngưỡng thì lại chép:
- nguồn: `scripts/start-scan.mjs:230` `thresholdState()` — `chua-chot` khi KHÔNG phải mọi nhãn của khuôn đều có mặt và khác placeholder.
- bản chép 2: `scripts/gate-card.js:246-249` (`filled0`/`nguong0`) — viết lại toàn bộ bằng regex riêng, không gọi start-scan.
- bản chép 3: `tests/plugins/ra-co-ten.test.mjs:631` — `chot = !kd && bul.length > 0 && bul.every(...)`.

Bản chép 3 ĐÃ lệch nguồn: nó chỉ đòi «có ít nhất một bullet và mọi bullet đang có đều đã điền», không đòi ĐỦ nhãn của khuôn. Ca hỏng cụ thể: một `opportunity.md` ở `gates`/`gia-tri` có section Ngưỡng chỉ điền 2 trong 4 bullet của khuôn (2 bullet kia bị xoá hẳn, không để `…`) → start-scan trả `chua-chot` và gắn cờ `nguong-chua-chot`; oracle của RT13 tính `chot = true` nên `expNg = false` → RT13 FAIL «cờ nguong-chua-chot thừa». Đỏ giả trên một hồ sơ hoàn toàn hợp lệ, và người sửa sẽ đi sửa nhầm phía.

Đường đúng: đưa `thresholdState` vào `lib/` rồi để gate-card + ca đo HỎI nó.

Rationale: AC-13(iii) đòi đẳng thức hai chiều giữa cờ nguong-chua-chot và trạng thái ngưỡng thật; oracle của ca đo tự tính sai điều kiện 'chốt' nên chính phép đo dùng để chứng minh AC-13(iii) lại báo đỏ giả trên hồ sơ hợp lệ.

### Chặn «machine-cleared × chữ ký» phía báo cáo nằm SAU cửa determineEnforce nên không chạy với báo cáo không-PASS
- file: `hooks/acceptance-evidence-gate.js:193`
- severity: low
- AC: AC-15
- source: conventions

Khối kiểm mâu thuẫn ở chiều ghi evidence-report được đặt sau `if (!core.determineEnforce(payload)) { ...exit(0) }` (dòng 181). `determineEnforce` chỉ trả true cho báo cáo thuộc họ PASS. Nên khi hợp đồng đang `machine-cleared` mà ai đó ghi `human_signoff: "Manh 2026-08-24"` vào một báo cáo `verdict: REJECT` (hoặc PENDING-JUDGMENT), hook thoát sớm và KHÔNG chặn — trong khi chiều hợp đồng (dòng 139-146) chặn vô điều kiện. Cửa chỉ đóng một nửa, đúng thứ comment ngay trên nó nói là muốn tránh.

Hai lưới khác vẫn bắt (`scripts/pre-merge-check.sh:906` và `conflictProblem` ở bộ quét/bản đồ), nên đây không phải lỗ thủng ròng — nhưng hook là lớp «nói sớm», và AC-15(a) khai «hook chặn lúc ghi» không điều kiện. Sửa rẻ: nâng khối kiểm mâu thuẫn lên TRƯỚC `determineEnforce` (nó chỉ cần `enforcement`, đã đọc được từ `readEnforcement`).

Rationale: AC-15(a) đòi hook chặn vô điều kiện khi ghi human_signoff trên hồ sơ machine-cleared, nhưng khối kiểm bị đặt sau cửa chỉ áp dụng cho báo cáo họ PASS nên báo cáo REJECT/PENDING-JUDGMENT lọt qua không bị chặn.

### quaTimebox coi chính NGÀY hạn là đã quá hạn
- file: `scripts/start-scan.mjs:251`
- severity: low
- AC: AC-13
- source: bugs

`timeboxDate` trả `Date.UTC(y, m-1, d)` = 00:00 UTC của ngày hạn, còn `quaTimebox` so `d < Date.now()`. Ngưỡng viết «muộn nhất <ngày>» là hạn BAO GỒM ngày đó, nên suốt cả ngày hạn hồ sơ đã mang cờ `qua-timebox`, và `/start` bảo người «quá hạn tự khai — xem lại: xếp lại hay kéo dài» sớm một ngày.

Tái lập (đã chạy, hôm nay 2026-08-23): opportunity `stage: decided / decision: build` với `- Timebox: muộn nhất 2026-08-23` → start-scan trả `{"flags":["qua-timebox"], "stateKey":"sap-mo-vong", …}`. So đúng phải là `d + 86400000 <= Date.now()` (hoặc so theo ngày lịch).

Rationale: AC-13(iii) định nghĩa chính xác quan hệ hai chiều 'cờ qua-timebox ⇔ ngày đó TRƯỚC ngày chạy'; đúng vào ngày hạn, ngày đó chưa 'trước' ngày chạy (nó CHÍNH LÀ ngày chạy) nhưng mã vẫn gắn cờ, vi phạm đẳng thức đó ở đúng ngày biên.

### Hình dạng 4 — chiều đỏ giả: mutant của checkMenhDe không bao giờ đỏ được (RT6, RT8)
- file: `tests/plugins/ra-co-ten.test.mjs:486`
- severity: high
- AC: AC-6
- source: measurement

checkMenhDe() dựng "mutant" bằng `const c2 = countIn(cutter(full.replace(gflag(re), '')), re)` — nó xoá CHÍNH regex `re` khỏi bản sao rồi đếm lại `re`. Kết quả luôn = 0, nên nhánh `if (!(n == null ? c2 < 1 : c2 !== n))` không bao giờ push lỗi. Đã kiểm chứng thực nghiệm trên hàng 'fl hàng verified ghi trạng thái kết': c=1, c2=0. Assert này đo engine regex của Node, không đo file dưới thước: nếu SKILL.md/approve.md/CONTEXT.md mất mệnh đề thì vế dương (c !== n) mới bắt, còn vế mutant đóng góp 0 thông tin. Đây là 12 hàng ở RT6 + RT8. Hợp đồng AC-6 và AC-8 và evals E6/E8 đều tuyên «bản sao gỡ TỪNG mệnh đề → reader trên bản sao ĐỎ nêu mệnh đề (assert, không mô tả)» — lời hứa đó chưa có phép đo sống. Chiều đỏ thật phải tiêm vào VĂN BẢN (xoá dòng/đổi từ trong bản sao file) rồi chạy lại cutter+regex, không phải xoá nghiệm của chính regex.

Rationale: AC-6 (và tương tự AC-8) đòi 'bản sao gỡ từng mệnh đề → reader trên bản sao ĐỎ nêu mệnh đề'; mutant tự xoá chính regex đang dùng để đếm nên luôn đo ra 0, khiến chiều đỏ bắt buộc của AC-6 không bao giờ có thể kích hoạt.

### Hình dạng 2 — fixture viết tay đúng khuôn bên ĐỌC: hai mục xanh-sạch gõ tay, chú thích khai sai là rút từ khuôn
- file: `tests/plugins/ra-co-ten.test.mjs:85`
- severity: high
- AC: AC-2
- source: measurement

Dòng 84 chú thích «Hai mục cuối: tên rút từ CHÍNH khối xanh-sạch của khuôn (mã `sections`), không gõ tay», nhưng dòng 85 gõ tay literal: `t += '\n## Known limits\n\n' + ... + '\n## Ngoài hợp đồng\n\n'`. Biến XANH_SACH (dòng 41) chỉ rút TOKEN ĐẦU mỗi dòng khối ('verdict-pass','bypass','enforcement','tier','uncertain','sections') — nó không bao giờ chứa tên hai mục. Đồng thời thân khuôn evidence-report-template.md KHÔNG có `## Known limits` / `## Ngoài hợp đồng` (heading của khuôn chỉ có Evidence/Analyst/Variance/Iterations/Gate 2 checklist); hai tên đó chỉ sống trong câu văn xuôi dòng 144 của khối marker. Nghĩa là fixture của E2 mang hình dạng báo cáo mà KHÔNG code path nào của bên viết sinh ra, và hình dạng đó được gõ cho vừa bên đọc (xanhSach/xanh_sach_check). Đúng lớp mà gap-probe P1 tuyên đã đóng và AC-2 đòi đích danh: «sinh từ khối EVIDENCE-XANH-SACH-BLOCK của khuôn bên viết (không gõ tay theo khuôn bên đọc)».

Rationale: AC-2 đòi evidence-report.md của fixture PASS xanh-sạch phải 'sinh từ khối EVIDENCE-XANH-SACH-BLOCK của khuôn bên viết, không gõ tay theo khuôn bên đọc'; hai mục Known limits/Ngoài hợp đồng trong fixture lại được gõ tay trực tiếp, đúng điều AC-2 cấm.

### Hình dạng 5 — E15 tuyên bốn chân, RT15 chỉ có hai: chân (b) signoff.md và chân (d) bộ quét không có assert nào
- file: `tests/plugins/ra-co-ten.test.mjs:256`
- severity: high
- AC: AC-15
- source: measurement

evals.yaml E15 (dòng 172) và AC-15 khai bốn chân: (a) hook+lưới chặn chữ ký trên hồ sơ máy-thông, (b) `commands/signoff.md` có mệnh đề nhận machine-cleared và đặt status signed-off cùng lượt ghi chữ ký — «bản sao gỡ mệnh đề → reader trên bản sao ĐỎ», (c) da-veto, (d) `start-scan` trên fixture (a) → `broken[]` nêu mâu thuẫn, KHÔNG xếp vào done. Thân RT15 (dòng 256–345) chỉ dựng (a) và (c): grep trong thân ca không có chuỗi `signoff.md` nào và không có assert nào đọc `broken`. Chân (d) là chân duy nhất chứng minh bộ quét không im lặng gọi hồ sơ mâu thuẫn là «đã giao» — chính kịch bản fail mà gap-probe P0 mở AC-15 để chặn. Chú thích tiêu đề ca tự nhận «(chân hook; lưới+quét thêm ở chặng sau)», nhưng expected của E15 vẫn phát biểu như đã đo, nên hội đồng đọc expected + `PASS: [RT15]` sẽ chấm đủ.

Rationale: AC-15 khai đủ bốn chân (a)-(d) gồm mệnh đề signoff.md (b) và hành vi bộ quét broken[] (d); ca đo thân RT15 không có bất kỳ assert nào chạm hai chân đó, để lại một nửa AC-15 không được kiểm dù expected/PASS báo như đã đo đủ.

### Hình dạng 4 — hai «chiều đỏ» của RT13 là phép lọc mảng thuần, không tiêm gì vào vật đo
- file: `tests/plugins/ra-co-ten.test.mjs:647`
- severity: high
- AC: AC-13
- source: measurement

Chiều đỏ (iv), dòng 647–648: `const la = [...files, 'scripts/gia-lap-bo-doc-moi.mjs'].filter(f => !paths.has(f) && !GACH.includes(f)); if (!la.includes('scripts/gia-lap-bo-doc-moi.mjs')) errs.push(...)`. Tên file bịa này không bao giờ nằm trong `paths` (rút từ evals.yaml) hay `GACH` (rút từ contract), nên `la` luôn chứa nó và assert không bao giờ đỏ. Nó không chạy lại `git grep`, không ghi file nào vào cây, không gọi lại phép đo — chỉ lọc một mảng JS vừa tự nối thêm phần tử. Chiều đỏ (ii), dòng 651–653: hợp đồng đòi «bản sao xoá một dòng KHAC-BIET-DOC-CU → đỏ nêu slug lệch», nhưng code chỉ kiểm `if (kh[1] === kh[2])` — một sanity check trên nội dung khối, không tiêm và không chạy lại phép so. Cả hai vế đỏ mà AC-13 và E13 khai đều chưa có phép đo sống; nếu vòng lặp nêu tên file ở dòng 645 bị hỏng (ví dụ `paths` parse ra tập rỗng ngược lại thành tập tất cả) thì không assert nào bắt.

Rationale: AC-13(iv) đòi chiều đỏ phải THẬT SỰ tiêm file mới/dòng sai vào bản sao rồi chạy lại phép so; hai chiều đỏ ở đây chỉ lọc một mảng JS tự nối/so sánh nội dung khối mà không tiêm hay chạy lại gì, nên chiều đỏ bắt buộc của AC-13(iv) chưa có phép đo sống.

### Hình dạng 1 — quét không gian mở miễn trừ file theo LỜI KHAI trong evals.yaml, không theo có ca thật
- file: `tests/plugins/ra-co-ten.test.mjs:643`
- severity: medium
- AC: AC-13
- source: measurement

Dòng 643 dựng tập miễn trừ từ `evalsY.match(/paths: \[([^\]]+)\]/g)` — tức mọi file có TÊN xuất hiện trong bất kỳ dòng `paths:` nào của evals.yaml đều được coi là «bộ đọc đã có ca» ở dòng 645. AC-13(iv) lại phát biểu là «hợp của tập bộ đọc CÓ CA trong hồ sơ này và tập khai gạch». Hai thứ đó không bằng nhau, và đã lệch thật ngay trong hồ sơ này: `commands/signoff.md` có mặt trong `git grep -l signed-off` và được miễn trừ vì nằm trong `paths` của E15, trong khi RT15 không đọc file đó một lần nào. Hệ quả là răng chống blacklist-trên-không-gian-mở có thể bị tắt cho một bộ đọc mới chỉ bằng cách thêm tên file vào dòng `paths:` của một eval, không cần viết assert nào.

Rationale: AC-13(iv) định nghĩa tập miễn trừ là 'hợp của tập bộ đọc CÓ CA trong hồ sơ này và tập khai gạch có lý do'; ca đo lại dựng tập 'có ca' từ lời khai paths trong evals.yaml chứ không từ việc file có thực sự được đọc trong ca, và đã lệch thật với commands/signoff.md.

### Hình dạng 5 — E12 tuyên mệnh đề uat-session (kill→archived, iterate→bước kế) mà RT12 không đo
- file: `tests/plugins/ra-co-ten.test.mjs:391`
- severity: medium
- AC: AC-12
- source: measurement

AC-12 và E12 (evals.yaml dòng 145, paths có `skills/uat-session/SKILL.md`) khai: «uat-session SKILL có mệnh đề kill→archived và iterate→bước kế (reader cắt phạm vi, bản sao gỡ → đỏ)». Thân RT12 (dòng 391–408) chỉ dựng fixture `stage: archived` và bốn ca Timebox rồi chạy start-scan; không có lần gọi `checkMenhDe`/`readRepo` nào chạm `skills/uat-session/SKILL.md`. Vế «nghi thức nghiệm thu ghi archived khi ký kill» — tức đường sinh ra chính trạng thái `da-dong-ho-so` mà nửa đầu ca đang đo — hoàn toàn không có phép đo, nên bộ đọc mới có thể xanh trên một trạng thái mà không nghi thức nào biết cách tạo ra.

Rationale: AC-12 đòi kiểm mệnh đề trong skills/uat-session/SKILL.md về kill→archived và iterate→bước kế (bản sao gỡ mệnh đề → đỏ); thân RT12 không có lần gọi nào chạm file đó nên phần này của AC-12 hoàn toàn không được đo.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **PR ghi vào hai hồ sơ ĐÃ KÝ → kéo chúng vào diff, lưới trước-merge đỏ 2 VIOLATION stale**
  Người dùng thấy gì: Bản đổi này chỉnh sửa nội dung của một hồ sơ tính năng khác đã được ký duyệt trước đó, có thể khiến hồ sơ đó bị hệ thống đánh dấu lại là cần kiểm tra lại dù nội dung công việc thật của nó không hề thay đổi.
  file: `_acceptance/card-text-fidelity/contract.md`
  severity: high
  Đề xuất: known-limits

- **Răng chống lách ở thẻ Cổng Phạm vi FAIL-OPEN khi khuôn mất khối marker (hai bộ đọc anh em fail-closed)**
  Người dùng thấy gì: Nếu bản sao của công cụ thiếu mất file mẫu tham chiếu (ví dụ khi mang công cụ sang một dự án khác), cờ cảnh báo 'khai không đo được nhưng vẫn có người dùng thật' sẽ âm thầm biến mất mà không có bất kỳ cảnh báo lỗi nào, khiến người duyệt tưởng nhầm là không có vấn đề.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: new-contract

- **Thẻ Cổng 2 vẫn mời ký hồ sơ machine-cleared (MAY_THONG tính ra rồi không dùng)**
  Người dùng thấy gì: Với một số hồ sơ đã được máy tự thông qua, màn hình thẻ vẫn hiện thêm nút 'Ký duyệt' mời người ký ngay cạnh dòng ghi rằng hồ sơ này không cần chữ ký người — người xem có thể ký nhầm vào một hồ sơ vốn đã xong.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: new-contract

- **Răng chống lách «không đo được» tắt im lặng khi thiếu khuôn opportunity-template**
  Người dùng thấy gì: Nếu bản sao công cụ bị thiếu file khuôn mẫu, cờ cảnh báo dành cho các hợp đồng có mặt người dùng thật (web/mobile) mà lại khai 'không đo được' sẽ biến mất âm thầm, không có cảnh báo lỗi nào.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: new-contract

- **Thẻ Cổng Đáng hiện lại cho ô cơ hội ĐÃ ký — tự nhận gate 0 không hỏi `decision`**
  Người dùng thấy gì: Sau khi người đã chọn xong một lối ra (làm/lặp/xếp lại/dừng) cho một cơ hội, nếu bước sinh hồ sơ chính thức chưa chạy xong thì màn hình vẫn hiện lại y như quyết định chưa từng được đưa ra, khiến người dễ tưởng nhầm là cần quyết định lại lần nữa.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: new-contract

- **Răng «nguồn ngoài chưa phân loại» chỉ bắt ô TRỐNG, placeholder của khuôn lọt**
  Người dùng thấy gì: Nếu một dòng nguồn tham khảo được sao chép từ khuôn mẫu nhưng cột phân loại vẫn còn giữ nguyên chữ mẫu chưa điền thật, hệ thống vẫn coi là đã phân loại xong và không cảnh báo, có thể để lọt một mục chưa phân loại qua cổng ký duyệt.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).