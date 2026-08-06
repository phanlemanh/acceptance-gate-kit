# Review Findings — card-text-fidelity (round 1)

Scope-triage: 17 lỗi tổng cộng — 13 map được vào AC trong hợp đồng, 4 nằm ngoài phạm vi đã duyệt ở Cổng 1.

## Trong hợp đồng

- **Đối chứng dương của P161 fail-open trên bản sao nông — cả E4/E5/E7/E8 biến mất mà test vẫn XANH**
  file: `tests/plugins/run-tests.sh:6770`
  severity: high
  AC: AC-12
  detail: P161 lấy mốc so-bản-cũ từ decisions.jsonl rồi kiểm `git cat-file -e $BASE^{commit}`. Nếu commit không có trong cây, nhánh `if have.returncode != 0` chỉ IN một dòng ghi chú rồi chạy tiếp — và vì E7/E8 nằm trong `if have.returncode == 0` (dòng 6835), TOÀN BỘ chân đối chứng (E4 bản-cũ-sai-ở-đâu, E5, E7 xuất xứ, E8 mutant, E3 nhóm-lột-không-suy-giảm) bị bỏ qua trong khi P161 vẫn báo PASS. Đã kiểm chứng thật: `git clone --depth 1` repo này → base 044968e KHÔNG reachable → toàn bộ chặng đối chứng bị skip. Đây đúng lớp lỗi CLAUDE.md cấm ("assertion âm-tính-một-mình"/"đối chứng dương phải XANH trước khi tin bản bị tiêm là ĐỎ") — chỉ đảo chiều: control bị vô hiệu âm thầm, không phải kêu. Ngoài ra E5 trong evals.yaml khai "dựng bằng bản sao nông/kho tạm TRONG CHÍNH LẦN CHẠY" — không có fixture nào được dựng; nhánh này chưa từng chạy trong cây đủ lịch sử, tức đường mà E5 hứa đo lại chính là đường fail-open. Cách chữa đúng doctrine: dựng fixture kho-nông trong lần chạy để E5 có ĐƯỜNG DƯƠNG, và khi cây thật thiếu mốc thì phải ĐỎ (hoặc unfetch/deepen), không phải bỏ qua.
  rationale: AC-12 đòi khi cây kiểm thiếu commit mốc phải có thông điệp riêng và (qua E5) một fixture kho-nông dựng trong lần chạy để chứng minh đường đó chạy được; hiện tại chỉ print rồi bỏ qua, đúng phần AC-12 thất bại.

- **E7/E8 đo bằng ĐẾM số đường dẫn thay vì QUAN HỆ xuất xứ mà AC-7 khai; mutant AC-8 không được tiêm**
  file: `tests/plugins/run-tests.sh:6848`
  severity: high
  AC: AC-7
  detail: AC-7 yêu cầu quan hệ hai chiều: mọi cụm sao chỉ-có-ở-bản-mới phải nằm trong một chuỗi xuất hiện NGUYÊN VĂN trong file nguồn của slug, VÀ không cụm nào truy không được về nguồn. Phần cài đặt lại chỉ đếm match của `PATH_RE = re.compile(r"\*\*/|[A-Za-z0-9_.-]+/\*\*")` trên hai thẻ rồi assert `na >= nb` và `gained > 0` — tức đo TỪ VỰNG/số đếm, không đọc file nguồn lần nào. Chiều nghịch (cụm sao bản mới không truy được về nguồn) hoàn toàn không được đo: một bản làm rò rỉ dấu sao bịa ra sẽ chỉ làm `gained` TĂNG và test vẫn xanh. Đây là lớp lỗi đã ghi trong bộ nhớ kit ("Đo từ vựng thay vì quan hệ" — 6 vòng cùng một xương) và "thước phải gắn vào vật được giao". Kèm theo, AC-8/E8 khai mutant là "tiêm 'không lột chữ đậm nữa' vào bản sao", nhưng mã dùng chính BẢN CŨ làm mutant (`mut2.write_text(show.stdout)`) — mà bản cũ đã là đối chứng của E4, nên E8 không thêm sức phân biệt nào: nó không thể phát hiện hồi quy "ngừng lột chữ đậm" của bản MỚI.
  rationale: AC-7 khai rõ quan hệ hai chiều truy-về-nguồn và cấm phép đếm/chuẩn hoá-rồi-so, còn cài đặt chỉ so hai con số đếm — đúng phần AC-7 thất bại.

- **Khối P161 khai "(E1-E11)" nhưng E9 và E11 không có phép đo nào trong toàn kho — AC-9/AC-11 chưa được đo**
  file: `tests/plugins/run-tests.sh:6674`
  severity: medium
  AC: AC-9
  detail: Tiêu đề khối và dòng echo (6678) khai phủ E1-E11. Đọc mã: (1)=E1, (2)=E2, (3)=E3, (4)=E4/E5, (5)=E6, (6)=E7/E8, rồi nhảy thẳng sang (8)=E10 — số (7) trống. Grep toàn `tests/plugins/run-tests.sh` không có phép đo nào khác cho slug card-text-fidelity, nên E9 (quét MỌI cụm sao trong corpus thật, phân loại vào hình dạng CÓ TÊN trong marker) và E11 (6 lệnh kiểm + chống hạ-thước-cũ) không tồn tại. Hệ quả cụ thể chứ không lý thuyết: E9 chính là chân duy nhất bắt hình dạng KHÔNG có tên trong marker, và có hình dạng như vậy thật — chạy hàm lột thật từ scripts/gate-card.js cho thấy dấu mở DÍNH ký tự trước đã đổi hành vi so với bản cũ và không nằm trong 12 hình dạng đã khai: "Chú ý:**Đậm**" → giữ nguyên (trước: lột), "—**Đậm**" → giữ nguyên (trước: lột), "**a**b**c**" → "ab**c**" (trước: "abc"). Contract tự đặt tiền đề "mọi hình dạng dấu sao phải có kỳ vọng KHAI TRƯỚC — kể cả hình dạng 'giữ nguyên'", nên đúng chân đo dùng để giữ tiền đề đó lại là chân bị bỏ.
  rationale: AC-9 đòi quét mọi cụm sao trong corpus thật và phân loại vào hình dạng có tên kèm sanity đếm được — phần đo đó hoàn toàn không tồn tại trong mã.

- **E9 (AC-9) không có phép đo nào — nhưng khối P161 tự khai "quét corpus thật"**
  file: `tests/plugins/run-tests.sh:6678`
  severity: high
  AC: AC-9
  detail: Khối P161 tự nhận là "(E1-E11)" và dòng echo quảng cáo "quet corpus that", nhưng trong 187 dòng python chỉ có các mốc (1) E1, (2) E2, (3) E3, (4) E4/E5, (5) E6, (6) E7/E8, (8) E10. Không có đoạn nào rút MỌI cụm dấu sao từ hồ sơ thật trong `_acceptance/` (contract.md + decisions.jsonl), chạy qua CẢ bản cũ lẫn bản mới, rồi phân loại từng chênh lệch vào một hình dạng CÓ TÊN trong marker — tức đúng nội dung AC-9/E9. Đoạn E6 (dòng 6796-6832) chỉ quét glob trong contract.md rồi kiểm thẻ, không phải phép đo E9. Vì mọi eval của slug này đều dùng cùng một cmd `config:executors.test.plugins`, suite xanh ⇒ E9 sẽ được ghi PASS mà phía sau không có gì. Đây chính là chân chống mà AC-9 sinh ra để giữ: hình dạng hồ sơ thật SỰ CÓ nhưng bảng 12 ca không nghĩ tới. Kịch bản hỏng cụ thể: chữ đậm dính liền chữ trước (`tier T3**mới**`, `xem CONTEXT.md**đây**`) là nhấn mạnh hợp lệ theo CommonMark, bản cũ lột, bản mới KHÔNG lột (đã kiểm chạy thật) — nó không nằm trong 12 hình dạng nên E1/E2 không thấy, và không có E9 nên không phép đo nào thấy.
  rationale: Trùng đúng nội dung AC-9 (quét mọi cụm sao thật trong corpus, phân loại vào hình dạng có tên, sanity > 0) — phép đo này không tồn tại trong mã.

- **E11 (AC-11) không có phép đo — không có chốt "chỉ được THÊM, không sửa assert cũ"**
  file: `tests/plugins/run-tests.sh:6674`
  severity: high
  AC: AC-11
  detail: E11 khai: "trong diff feature này trên tests/plugins/run-tests.sh, các khối P đã có TRƯỚC mốc chỉ được THÊM dòng, không đổi/không xoá assert cũ (so với bản tại mốc trong sổ)". Trong P161 không có bất kỳ đoạn nào `git show <BASE>:tests/plugins/run-tests.sh` rồi so khối P cũ. Cùng lý do như E9: mọi eval trỏ về một cmd suite chung, nên suite xanh ⇒ E11 ghi PASS mà không có phép đo. Kịch bản hỏng: một vòng sau nới/xoá assert trong P30, P55 hay P160 cho vừa hành vi mới — đúng lớp "hạ thước cho vừa vật" mà AC-11 dựng ra để chặn — suite vẫn xanh và bằng chứng vẫn ghi E11 PASS.
  rationale: AC-11 đòi một chốt so khối P cũ trước/sau mốc để đảm bảo chỉ thêm không sửa assert cũ; chốt đó không tồn tại trong mã.

- **E7/E8 đo yếu hơn hẳn điều khai: không có truy-về-nguồn, và mutant AC-8 không bao giờ được tiêm**
  file: `tests/plugins/run-tests.sh:6834`
  severity: medium
  AC: AC-7
  detail: E7 khai quan hệ hai chiều: "mọi cụm sao chỉ-có-ở-bản-mới phải nằm trong một chuỗi xuất hiện NGUYÊN VĂN trong file nguồn của slug đó, và không cụm nào truy không được về nguồn". Code thực tế (dòng 6845-6859) chỉ đếm số khớp của `PATH_RE = /\*\*\/|[A-Za-z0-9_.-]+\/\*\*/` trên thẻ bản mới (na) và bản cũ (nb), rồi assert `na >= nb` và tổng `gained > 0`. Không hề mở file nguồn của slug để đối chiếu chuỗi nguyên văn — tức chiều nghịch của AC-7 ("cụm sao KHÔNG truy được về nguồn") không được đo ở đây. E8 khai mutant riêng "tiêm 'không lột chữ đậm nữa' vào BẢN SAO gate-card.js"; code dùng lại đúng bản TRƯỚC-DIFF của E4/E5 làm mutant (`mut2.write_text(show.stdout)`, dòng 6842), nên mutant mà AC-8 gọi tên không bao giờ chạy. Ngoài ra `mut = d2/gate-card.mut.js` (dòng 6837) được ghi rồi không dùng đến. Hệ quả: E7 và E8 báo PASS trong khi quan hệ chúng khai chưa được kiểm; phép đo hiện tại chỉ phân biệt được theo SỐ LƯỢNG cụm khớp một biểu thức hẹp, không theo xuất xứ.
  rationale: Trọng tâm là AC-7 hứa quan hệ truy-về-nguồn hai chiều nhưng cài đặt chỉ so số đếm, không đối chiếu chuỗi nguyên văn nào với file nguồn.

- **_scan_cut bỏ qua bản cụt của một glob nếu glob đó xuất hiện nguyên vẹn ở chỗ khác trên cùng thẻ**
  file: `tests/plugins/run-tests.sh:6806`
  severity: low
  AC: AC-6
  detail: `for g in globs: if g in plain: hits += 1; continue` — hễ tìm thấy MỘT lần xuất hiện nguyên vẹn của glob trên thẻ là vòng lặp bỏ qua luôn phần quét bản cụt cho glob đó. Chiều nghịch của AC-6 ("thẻ không chứa bản cụt mà nguồn không hề có") vì vậy chỉ phủ những glob bị cụt TOÀN BỘ trên thẻ. Kịch bản hỏng: một thẻ in `plugins/**` đúng ở khối 'Sẽ làm' nhưng in `plugins/` cụt ở khối 'Quyết định' (hai lối gọi stripMd khác nhau, dòng 289 vs 171 của gate-card.js) — hits += 1 rồi continue, phép đo xanh, người vẫn đọc phải bản cụt.
  rationale: AC-6 đòi mọi đường dẫn xuất hiện nguyên vẹn và thẻ không chứa bản cụt; cơ chế quét hiện tại có lỗ khiến một bản cụt thật lọt qua khi glob đó cũng xuất hiện đầy đủ ở chỗ khác.

- **Hình dạng 3 — E6/AC-6 hứa "MỌI đường dẫn nguyên vẹn" nhưng assert chỉ là "có ít nhất một chuỗi có mặt"**
  file: `tests/plugins/run-tests.sh:6832`
  severity: high
  AC: AC-6
  detail: AC-6/E6 khai quan hệ TOÀN PHẦN: "mọi đường dẫn đó xuất hiện nguyên vẹn trong thẻ". Nhưng `_scan_cut` (6803-6813) chỉ CỘNG `hits` khi `g in plain`; nhánh `if not g in plain` không hề báo lỗi — nó lặng lẽ bỏ qua. Assert duy nhất đóng chân này là dòng 6832 `assert checked > 0` — một biến cộng dồn trên TẤT CẢ slug × 2 cổng. Tôi đã đo thật: 26/40 cặp (glob × cổng) KHÔNG có mặt trên thẻ (vd `plugins/**` vắng ở cả 2 cổng của chính slug card-text-fidelity, `lib/**` + `hooks/**` vắng ở gate-card-ac-visibility và judge-required-evidence) mà P161 vẫn xanh. Nặng hơn: chạy đúng scan đó trên bản TRƯỚC-DIFF (044968e) cho `checked = 10 > 0` — nghĩa là assert 6832 xanh trên chính bản có lỗi mà feature này đi sửa. Lời hứa là quan hệ phổ quát; thứ đang được ghim là sự tồn tại của một chuỗi con.
  rationale: Trực tiếp nêu tên AC-6: lời hứa là quan hệ toàn phần (mọi đường dẫn) nhưng assert duy nhất chỉ kiểm tồn tại (checked > 0), đã đo được nhiều cặp glob×cổng vắng mặt mà vẫn xanh.

- **Hình dạng 3 — E7/AC-7 hứa quan hệ TRUY-VỀ-NGUỒN, code chỉ so hai con SỐ ĐẾM**
  file: `tests/plugins/run-tests.sh:6857`
  severity: high
  AC: AC-7
  detail: AC-7/E7 khai hai chiều: "MỌI cụm sao chỉ-có-ở-bản-mới phải nằm trong một chuỗi xuất hiện NGUYÊN VĂN trong file nguồn" + "không cụm nào truy không được về nguồn", và CẤM chuẩn hoá-rồi-so-bằng. Cài đặt (6848-6859) lại là: `PATH_RE = re.compile(r"\*\*/|[A-Za-z0-9_.-]+/\*\*")`, `na, nb = len(PATH_RE.findall(a.stdout)), len(PATH_RE.findall(b.stdout))`, rồi `assert na >= nb` và `assert gained > 0`. Không dòng nào đối chiếu một cụm sao cụ thể nào về `contract.md` nguồn. Đây là phép đo yếu hơn cả thứ bị AC-7 cấm: nó không so nội dung, chỉ so số lượng. Một hồi quy sinh ra cụm sao GIẢ (không có trong nguồn) sẽ làm `na` tăng và phép đo càng xanh hơn; chiều nghịch mà AC-7 nêu đích danh hoàn toàn không được cài.
  rationale: Trực tiếp nêu tên AC-7: cấm chuẩn hoá-so-bằng và đòi đối chiếu chuỗi nguyên văn với nguồn, cài đặt chỉ so số đếm của một biểu thức hẹp.

- **Hình dạng 4 — nhánh raise của _scan_cut là assertion âm-tính-một-mình: không mutant nào chạy qua chính phép đo đó**
  file: `tests/plugins/run-tests.sh:6812`
  severity: high
  AC: AC-6
  detail: `raise AssertionError("%s in duong dan CUT %r ...")` ở 6812 là thứ DUY NHẤT trong E6 có thể bắt lỗi cụt đường dẫn. AC-8/E8 hứa: "tiêm đột biến vào bản sao → phép đo của AC-7 phải ĐỎ với thông điệp ghim; đối chứng dương: bản nguyên vẹn XANH trước". Nhưng khối E7/E8 (6835-6860) chỉ chạy bản cũ qua `PATH_RE` đếm — nó KHÔNG BAO GIỜ gọi lại `_scan_cut` trên bản cũ/mutant. Nên trong cả lần chạy, nhánh 6812 chưa từng đỏ một lần nào: không có gì phân biệt "chưa bắt được lỗi nào" với "assert không bao giờ chạy được" (regex `GLOBRE` hỏng, `stem` rỗng, thẻ exit != 0 đều cho cùng màu xanh). Tôi đã kiểm: chạy `_scan_cut` trên bản 044968e THÌ nó đỏ (`.github/` cụt ở t1-escape-event-scope) — tức đối chứng dương tồn tại và rẻ, chỉ là test không làm.
  rationale: _scan_cut là cơ chế duy nhất AC-6 dùng để bắt bản cụt (chiều nghịch); finding cho thấy nhánh raise của nó chưa từng được một đối chứng dương/mutant nào chạy qua trong toàn bộ lần chạy, nên chưa ai chứng minh nó thật sự bắt được lỗi.

- **Hình dạng 4 — toàn bộ đối chứng dương (E3/E4/E7/E8) nằm sau một nhánh bỏ-qua chỉ print, không assert**
  file: `tests/plugins/run-tests.sh:6770`
  severity: high
  AC: AC-12
  detail: 6769-6772: `have = git cat-file -e BASE^{commit}`; `if have.returncode != 0: print("P161-NOTE: ...")`. Không assert. Và cả hai khối dùng bản cũ đều gác bằng cùng điều kiện: `else:` ở 6773 (chứa E4 + E3) và `if have.returncode == 0:` ở 6835 (chứa E7/E8). Hệ quả: trên bản sao nông / CI `fetch-depth=1` / sau khi mốc bị gộp mất, P161 in một dòng ghi chú rồi XANH với 0 phép đối chứng bản cũ — E3, E4, E7, E8 bốc hơi cùng lúc mà nhãn "P161 OK" vẫn in ra. Thêm nữa E5 khai "dựng bản sao nông/kho tạm TRONG CHÍNH LẦN CHẠY" để chứng minh thông điệp riêng đó chạy được; test không dựng gì cả — trong một checkout bình thường nhánh 6772 là mã chết, nên chính lời hứa E5 chưa từng được đo.
  rationale: Cùng nội dung AC-12: khi thiếu mốc, thay vì có thông điệp riêng đã chứng minh bằng fixture kho-nông (E5), toàn bộ chuỗi đối chứng bản cũ chỉ print ghi chú rồi bị bỏ qua lặng lẽ.

- **Hình dạng 3 — E2 hứa so với "kỳ vọng khai ở marker" nhưng thực tế so với hằng viết tay trong test**
  file: `tests/plugins/run-tests.sh:6757`
  severity: medium
  AC: AC-1
  detail: E2 khai: "cho ra ĐÚNG kỳ vọng khai cạnh tên hình dạng trong marker". Marker `STRIP-SHAPE-MATRIX` trong contract.md mang cột kỳ vọng ("giữ nguyên" / "lột dấu, giữ chữ" / "lột đậm, giữ glob"). Nhưng bảng `CASES` (6699-6712) chép TAY chuỗi kỳ vọng vào test, và dòng 6757 assert `got == want` với `want` lấy từ CASES; `SHAPES[name]` chỉ được dùng trong THÔNG ĐIỆP lỗi. Chỉ tập TÊN được ràng vào contract (check_names), còn cột kỳ vọng — thứ AC-1 gọi là "kỳ vọng ĐÃ KHAI TRƯỚC" — không tham gia phép so nào. Đổi marker từ "glob-hai-sao-trần — giữ nguyên" thành "— lột dấu" thì test vẫn xanh (E3 lọc bằng `SHAPES[name].startswith("lột")` ở 6789 cũng chỉ assert `strip_new == strip_old`, luôn đúng cho hình dạng old_wrong=False). Bên VIẾT (hợp đồng) và bên ĐỌC (test) vẫn trôi khỏi nhau đúng ở cột quan trọng nhất.
  rationale: AC-1/E2 đòi kết quả lột đúng kỳ vọng khai CẠNH TÊN hình dạng trong marker của contract; cột kỳ vọng thật của marker không tham gia phép so nào, test so với hằng chép tay riêng.

- **Hình dạng 5 — nhãn tuyên "E1-E11" nhưng E9 (quét corpus) và E11 không có một dòng mã nào**
  file: `tests/plugins/run-tests.sh:6678`
  severity: medium
  AC: AC-9
  detail: Dòng 6678 `echo "P161 (E1-E11) ... quet corpus that"` và comment 6674 tự khai phủ 11 eval. Grep các mốc `══ (n) En` trong khối chỉ có: (1) E1, (2) E2, (3) E3, (4) E4/E5, (5) E6, (6) E7/E8, (8) E10. KHÔNG có E9 và KHÔNG có E11. E9 chính là chân mà gap-probe xếp P0 ("chân quét mọi cụm sao trong corpus thật — hình dạng hồ sơ THẬT sự có, không phải hình dạng ta nghĩ tới") và AC-9 đòi "mọi chênh lệch phải thuộc một hình dạng CÓ TÊN trong bảng, sanity số cụm rút được > 0 và ghi vào bằng chứng" — không có dòng nào rút cụm sao từ corpus rồi phân loại. Nên thứ đang chạy là 12 điểm-case viết tay cộng một scan glob hẹp, trong khi nhãn nói là quét lớp; và E5 như nêu ở trên chỉ là print. Nếu E9/E11 cố ý hoãn thì phải có dòng descope, không phải nhãn "E1-E11".
  rationale: Cùng nội dung AC-9: chân quét-mọi-cụm-sao-trong-corpus-thật mà AC-9 dựng ra hoàn toàn không có mã tương ứng dù nhãn khối tự khai đã phủ đủ E1-E11.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **evals.yaml E10 còn ghim con số 13 trong khi trục C của contract đã sửa lên 14**
  Người dùng thấy gì: Tài liệu mô tả phép kiểm tra nội bộ vẫn ghi một con số cũ dù hệ thống đã cập nhật; điều này không làm thay đổi kết quả kiểm tra thật, nhưng có thể khiến người đọc tài liệu hiểu nhầm mốc đang được áp dụng.
  file: `_acceptance/card-text-fidelity/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Luật lột mới thu hẹp nhấn mạnh dính-chữ (hợp lệ theo CommonMark) — hình dạng này không có trong bảng 12**
  Người dùng thấy gì: Một số cách viết chữ đậm hợp lệ (đứng ngay sau một chữ hoặc dấu câu, không có khoảng trắng) hiện chưa được liệt vào danh sách các trường hợp đã kiểm; nếu hồ sơ tương lai viết theo cách này, thẻ quyết định có thể hiển thị sai mà chưa có cơ chế nào phát hiện ngay.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **evals.yaml E10 còn ghim con số cũ 13 trong khi contract và mã nguồn đều là 14**
  Người dùng thấy gì: Tài liệu mô tả phép kiểm tra nội bộ vẫn ghi một con số cũ dù hệ thống đã cập nhật; kết quả kiểm tra thật vẫn đúng, nhưng người đọc tài liệu có thể hiểu nhầm mốc đang dùng.
  file: `_acceptance/card-text-fidelity/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Trục đo tự mâu thuẫn — evals.yaml E10 ghim "13" trong khi contract trục C khai 14 và test đọc 14**
  Người dùng thấy gì: Tài liệu nội bộ mô tả phép kiểm tra ghi hai con số khác nhau ở hai chỗ, có thể khiến người đọc tài liệu để thẩm định bị nhầm mốc — dù kết quả kiểm tra thật vẫn đúng.
  file: `_acceptance/card-text-fidelity/evals.yaml`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/17 lỗi rơi vào file không bộ đo nào phủ (_acceptance/card-text-fidelity/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
