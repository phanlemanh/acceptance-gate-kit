## Trong hợp đồng

### 1. Đối chứng E9 của P163 không chạy chốt trên cây bị moi ruột — chỉ assert tiền đề, trong khi eval hứa "chốt ĐỎ đích danh khối"
- file: `tests/plugins/run-tests.sh:7509`
- severity: medium
- AC: AC-8
- source: conventions

evals.yaml E9/AC-8 (_acceptance/measure-teeth-cleanup/evals.yaml) hứa: làm hỏng phần assert của một khối trong bảng → "chốt ĐỎ đích danh khối đó", "đi qua ĐƯỜNG THI HÀNH". Bản giao (run-tests.sh:7497-7510) chèn sys.exit(0) vào khối P157 rồi chỉ assert khối-đã-moi XANH trên vật hỏng (rc == 0), kèm comment "→ nếu chạy chốt trên cây gut, dòng P157 sẽ báo PHEP DO MU" — tức kết luận ĐỎ của chốt chỉ được suy ra, không được đo. Đây là hình dạng "thước không gắn vào vật được giao" (CLAUDE.md): điều được hứa (chốt đỏ, nêu tên khối) chưa từng thực thi. Nếu logic vòng for của chốt (assert rc != 0 / assert want in out, dòng ~7492-7494) bị hỏng, đối chứng E9 hiện tại vẫn xanh.

### 2. Đo CHỈ DẪN thay vì ĐẦU RA: đối chứng E9 của P163 không bao giờ chạy chốt — kết luận nằm trong comment
- file: `tests/plugins/run-tests.sh:7509`
- severity: high
- AC: AC-8
- source: measurement

E9 (evals.yaml) hứa: làm hỏng assert của một khối trong bảng → "chốt ĐỎ đích danh khối đó". Code chỉ làm tới bước dựng: gut khối P157 (chèn sys.exit(0) sau heredoc, dòng 7504), rồi assert `rc == 0` — tức xác nhận khối bị vô hiệu là XANH trên vật hỏng. Vòng phát-hiện của chính P163 (chạy khối trên vật hỏng và bắt PHEP DO MU) KHÔNG được chạy trên cây gut; dòng 7510 chỉ là comment "→ neu chay chot tren cay gut, dong P157 se bao PHEP DO MU: chinh la dieu can chung minh". Hành vi được hứa (chốt đỏ) chưa từng được quan sát — nếu logic bắt PHEP DO MU của P163 hỏng, E9 vẫn xanh. Đây là đo-bằng-lời-ghi-chú thay vì đo đầu ra thật.

### 3. Fixture VIẾT TAY đúng khuôn bên đọc: P164 E7 tự nhận round-trip nhưng block phán không rút từ template
- file: `tests/plugins/run-tests.sh:7404`
- severity: high
- AC: AC-6
- source: measurement

E7 (evals.yaml) hứa "ROUND-TRIP writer→reader: hồ sơ do CHÍNH đường ghi sinh trong lần chạy", và comment trong test nói "khuon block phan rut TU TEMPLATE THAT (writer-khuon)". Thực tế code đọc evidence-report-template.md rồi chỉ assert `"judged_by" in tpl` (dòng 7405 — grep một token trong file khuôn), sau đó write_text một block VIẾT TAY ('- eval: J1\n  judged_by: panel...') không rút gì từ tpl. Nếu khuôn template đổi (thụt lề, đổi tên trường khác judged_by, đổi cấu trúc block) trong khi reader acceptance-gold.mjs giữ khuôn cũ, cả assert token lẫn fixture tay vẫn xanh — đúng lớp writer/reader trôi khỏi nhau mà E7 sinh ra để chặn (và đúng mẫu OOC-ITEM-TEMPLATE+P55 mà kit đã định là chuẩn).

### 4. Tuyên quét LỚP nhưng chỉ có điểm-case: ma trận 4 hình dạng tên file của E1 không tồn tại trong suite
- file: `tests/plugins/run-tests.sh:7207`
- severity: high
- AC: AC-1
- source: measurement

E1 (evals.yaml) khai tường minh: "ma trận mutant 4 hình dạng tên file (chữ thường .mjs · gạch dưới · chữ hoa · đuôi .py) tiêm vào bản sao gói → mỗi ca ĐỎ đích danh". Regex ANY_REF được nới thành [A-Za-z0-9_.-]+\.[a-z]{1,4} kèm comment nêu đúng 3 hình dạng đó (dòng 7108-7110), nhưng toàn bộ mutant trong suite (dòng 7207-7211) chỉ tiêm 3 biến thể TIỀN TỐ với cùng MỘT hình dạng tên: khong-ton-tai-{a,b,c}.mjs (chữ thường, gạch ngang, .mjs). Grep toàn file không có mutant nào tên gạch dưới/chữ hoa/.py. Hồi quy thu regex về [a-z0-9-]+\.(mjs|js|sh) cũ sẽ giữ mọi mutant hiện có đỏ đúng và corpus thật (toàn tên chữ thường) vẫn khớp bảng — suite xanh trong khi đúng lỗ AC-1 mở lại.

### 5. Đo CHỈ DẪN thay vì ĐẦU RA: nguồn "độc lập" của P163 là thẻ [TEETH] tự dán, không phải quét khối-có-dựng-bản-sao
- file: `tests/plugins/run-tests.sh:7449`
- severity: medium
- AC: AC-7
- source: measurement

E8 (evals.yaml) hứa: "Tập khối khai == tập rút từ NGUỒN ĐỘC LẬP với bảng (quét cây kiểm tìm khối có dựng bản sao)". Code thay bằng `tagged = set(re.findall(r'run "(P\d+) \[TEETH\]', suite))` — tức so bảng TSV với một NHÃN do cùng tác giả dán vào tiêu đề run. Nhãn là chỉ dẫn, không phải thuộc tính; một khối mới dựng bản-sao/fixture rồi kết luận từ exit code mà quên dán [TEETH] thì vô hình với chốt (declared == tagged vẫn cân), trong khi đó chính là lớp khối mà bảng răng sinh ra để cưỡng bức. Thuộc tính hứa (có dựng bản sao — vd chứa fresh_copy/copytree/worktree) không được rút từ code khối nào.

### 6. Assert chuỗi-có-mặt trên hằng của chính test thay vì QUAN HỆ giữa ba đầu ra: kiểm khác-nhau-đôi-một của P164 không thể đỏ
- file: `tests/plugins/run-tests.sh:7382`
- severity: medium
- AC: AC-2
- source: measurement

E3 (evals.yaml) hứa "ba chuỗi phải khác nhau đôi một (chống một nhánh nuốt hai ca)" — quan hệ giữa ba THÔNG ĐIỆP THẬT của công cụ. Code lưu `seen[name] = want` (dòng 7380 — want là hằng viết sẵn trong MSGS của test, không phải out) rồi `assert len(set(vals)) == len(vals)`: mệnh đề so ba hằng literal của chính test với nhau, đúng vô điều kiện, không phụ thuộc hành vi carry-plan.mjs. Kịch bản nó phải bắt — một nhánh in dump chung chứa cả ba chuỗi cho mọi ca — vẫn qua vì từng `want in out` là substring-match và assert đôi-một chỉ nhìn hằng. Muốn đo đúng phải lưu out thật của từng ca rồi so các out với nhau.

### 7. Assertion âm-tính-một-mình: bộ đếm render AC-5 trong P161 không có ca tiêm-lỗi và thông điệp thiếu tên việc như E6 hứa
- file: `tests/plugins/run-tests.sh:6944`
- severity: medium
- AC: AC-5
- source: measurement

E6 (evals.yaml) hứa đủ ba vế: assert 3 số + "ca tiêm lỗi giết đúng thẻ của một việc → ĐỎ nêu đúng số thẻ hỏng + tên việc; bước tiêm thất bại có thông điệp ĐỎ riêng". Code thêm (dòng 6934-6945) chỉ có vế dương: loop render mọi slug rồi `assert RENDER["fail"] == 0`. Không có mutant nào chứng minh assert này biết đỏ khi một thẻ bị giết (bảng measures-need-teeth.tsv cũng không có dòng nhắm vào assert này — dòng P161 trong bảng phá marker contract, một assert khác), nên "0 hỏng" có thể luôn-đúng-vô-nghĩa — đúng cái bệnh mà chính E6 gọi tên. Thêm nữa thông điệp đỏ chỉ in "%d/%d the KHONG dung duoc", không nêu tên việc (slug) hỏng; và `assert attempted == len(slugs)` là trivially-true vì attempted tăng vô điều kiện mỗi vòng lặp.

### 8. Assert chuỗi-có-mặt trong khi lời hứa là QUAN HỆ thứ tự: P165 không đo "entry ghi TRƯỚC khi sửa"
- file: `tests/plugins/run-tests.sh:7556`
- severity: medium
- AC: AC-9
- source: measurement

E10 (evals.yaml) hứa: "mỗi dòng phải có entry decisions.jsonl phân loại SIẾT hoặc NỚI ghi TRƯỚC khi sửa". P165 chỉ kiểm SỰ CÓ MẶT: `_sig` (dòng 7548-7552) coi một dòng assert là "đã phân loại" nếu BẤT KỲ entry SIẾT nào trích một đoạn ≥12 ký tự trong nháy đơn xuất hiện trong dòng đó — không có phép so thứ tự thời gian nào (không so timestamp entry với commit sửa run-tests.sh, không so vị trí trong lịch sử git). Sửa assert trước rồi bổ sung entry SIẾT sau (hợp thức hoá hồi tố — đúng điều luật ledger cấm) cho kết quả y hệt. Kèm theo, substring-match nghĩa là một entry trích đoạn chung (vd "sanity: khong ...") có thể phủ nhiều dòng assert khác nhau bằng một lần ghi.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **CI step TEETH=1 ONLY_BLOCK=P163 khong bao gio chay duoc P163: ONLY_BLOCK lot vao suite long lam P42 fail truoc, epilogue giua file exit som**
  Người dùng thấy gì: Bước xác nhận "chốt răng" mới thêm vào quy trình kiểm tra tự động chưa bao giờ thực sự chạy được — quy trình bị dừng sớm vì một lỗi khác trước khi tới lượt nó, nên lớp bảo vệ dự kiến hiện chưa hoạt động trong thực tế trên máy chủ kiểm tra.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **TEETH=1 lot vao suite long cua P42/P45: moi ban sao tu chay tron P163 (~11 phut/lan), khong co TEETH_CHILD chan**
  Người dùng thấy gì: Khi bật chế độ kiểm tra kỹ ở máy cục bộ, một phần lớn của bộ kiểm thử bị vô tình lặp lại nhiều lần không cần thiết, khiến thời gian chờ chạy kiểm thử kéo dài thêm đáng kể (khoảng nửa tiếng).
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **ONLY_BLOCK khong khop khoi nao → suite van exit 0 "all plugin tests passed" (no-op xanh im lang)**
  Người dùng thấy gì: Nếu tên bước kiểm tra bị gõ sai khi cấu hình, hệ thống sẽ báo "mọi kiểm tra đều đạt" dù thực ra không có kiểm tra nào được chạy — dễ khiến người xem tưởng nhầm là mọi thứ đã được kiểm tra ổn thoả.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **measures-need-teeth.tsv bi rsync vao goi plugin ship cho consumer, khac voi codex-self-script-refs.tsv duoc exclude tuong minh**
  Người dùng thấy gì: Một tệp nội bộ chỉ dùng để bảo trì kho mã nguồn của bộ công cụ bị đóng gói kèm và gửi luôn cho các dự án khác đang dùng bộ công cụ này, dù nội dung không có ý nghĩa và có thể gây khó hiểu cho họ.
  file: `scripts/sync-plugin-packages.sh`
  severity: low
  Đề xuất: known-limits

- **Đo CHỈ DẪN thay vì ĐẦU RA: P165 xác nhận "chốt răng trong lưới CI" bằng grep chuỗi TEETH=1 trong gate.yml**
  Người dùng thấy gì: Bước xác nhận rằng bài kiểm tra "răng" đã được đưa vào quy trình kiểm tra tự động chỉ tìm xem có dòng chữ nhắc tới nó ở đâu đó trong tệp cấu hình, kể cả khi dòng đó nằm trong phần bị tắt hoặc chỉ là ghi chú — nên không chắc chắn bài kiểm tra đó thực sự chạy mỗi lần có thay đổi mã.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).