# CHANGELOG — acceptance-gate kit

> Mỗi release một mục, nói tiếng người: đổi gì · ai bị ảnh hưởng · làm gì khi
> update. Sử chi tiết từng bản 1.x sống trong `description` của manifest
> (`.claude-plugin/plugin.json`) — file này bắt đầu từ 2.0.0.
>
> Tệp này dựng lại 14/09/2026 (owner gọi tên). Bản gốc ra đời ở đợt tái lập
> 2.0.0 nhưng nằm trên một nhánh không gộp vào nhánh chính, nên lịch sử
> 2.0.0 → 2.12.0 **không** có ở đây: chuyện của mười hai mốc đó sống trong
> `_acceptance/release-<x-y-0>/contract.md` và `evidence-report.md`. Mục đầu
> tiên dưới đây là phần CHƯA phát hành.

## 2.15.0 — 17/09/2026

Cửa sổ 2.14 → 2.15 chạy dưới quyết định R của owner (16/09): không mở vòng meta
mới, đo cái đã ship trên một vòng sản phẩm thật. Vòng đó là `skill-system-v1` ở
OneFlow, ký 17/09 — lần đầu sau hai cửa sổ có một tính năng tới tay người dùng
trên kit mới. Cửa sổ vẫn có một vòng meta đã ký, `guide-chep-ci-buoc-vao-writer`,
ký buổi sáng trước khi R được chốt — đúng trần một vòng của luật. Ba việc nhỏ của
kit vào cửa sổ qua chip sau R; owner quyết đếm chúng là vá-trong-mốc và đếm đủ. Hồ sơ mốc `_acceptance/release-2-15-0/` có tiêu chí
cho cả ba, cùng năm dòng số lần đầu có cột từ repo tiêu thụ. Hai gói cùng lên
`2.15.0`; `diagram-design` giữ `2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Thẻ `/start` thôi mời viết code cho thứ đã ở nhánh gốc.** Ca thật ở
  crm-onehub 16/09: một hồ sơ đã merge từ 04/09 bị đặt ngược về «đã duyệt» để
  xếp lại, thẻ đọc thành «viết code», và một phiên 8 giờ 25 phút chấm lại thứ
  đang chạy trên prod. Nay hồ sơ «đã duyệt» có bằng chứng mang commit đã nằm
  trong lịch sử của cây — kể cả bản bằng chứng đã đổi tên khi xếp lại — hiện
  thành dòng riêng «vật đã nằm trong nhánh gốc», không có bước máy kế. Người chọn
  một trong hai lối ngay trong câu hỏi chọn sẵn có: đóng theo quan sát, hoặc chấm
  lại. Không thêm câu hỏi, không thêm cổng. Đo trên crm-onehub: cả bốn hồ sơ cùng
  hình dạng rơi vào dòng mới.
- **Lượt ghim lại dừng khi một phép đo ghi đè bằng chứng đã ký.** Cũng ở
  crm-onehub 16/09: một phép đo trong suite chung ghi lại tệp bằng chứng của một
  hồ sơ đã ký sau mỗi lượt chạy, ở mọi worktree, mất khoảng 450 dòng so bản đã
  ký, và không răng nào thấy. Nay làn ghim lại chụp cây của mọi hồ sơ đã thông
  Cổng Bằng chứng trước suite và sau eval; có tệp bị chạm thì làn đỏ, in đường
  từng tệp, không ghi gì. Luật đi kèm: lệnh chạy lại ghi tạo phẩm ra
  `.acceptance-runs/<slug>/` hoặc thư mục tạm, không bao giờ vào `_acceptance/`.
  Hai trạng thái «đã thông cổng» của răng hỏi đúng một nguồn trong bộ máy, không
  chép — owner đã veto lối khai gạch hai tệp trong một hồ sơ đã ký.
- **Kho kit: thẻ `/start` đếm vòng meta đang mở.** Luật cho tối đa một vòng meta
  giữa hai mốc, nhưng cửa sổ 2.13 → 2.14 có hai vòng chạy song song ở hai phiên
  và con số chỉ lộ khi mốc đếm. Ở chính kho kit, thẻ nay in «vòng meta đang mở
  trong cửa sổ: N» kèm tên, và cờ khi N từ 2 trở lên. Không cổng, không lệnh.
  Repo tiêu thụ không thấy dòng này.

- **Danh sách chép lớp CI ở GUIDE §5.3 khai đủ chín tệp**, và một phép đo buộc
  hai bản khai danh sách ấy vào các tệp mà cổng merge thật sự nạp. Trước đó GUIDE
  thiếu hai tệp; kho chép theo GUIDE sẽ tắt lặng một lớp cưỡng chế.

**Ai bị ảnh hưởng / làm gì:**

- **Repo tiêu thụ — làn ghim lại có thể ĐỎ sau khi update.** Script đo nào còn
  ghi tạo phẩm vào thư mục bằng chứng của một hồ sơ đã ký sẽ làm làn dừng, kèm
  đường tệp bị chạm. Việc phải làm: chuyển đích ghi của script đó sang
  `.acceptance-runs/<slug>/` (thêm thư mục này vào `.gitignore`). crm-onehub là ca
  đã biết, ở phép đo lai-ra-man của vòng chan-lai-component-ra-man.
- **Repo tiêu thụ — thẻ `/start`:** không có gì phải làm. Hồ sơ «đã duyệt» mà vật
  đã merge sẽ tự hiện ở dòng mới ở lần quét kế.
- **Repo tiêu thụ — lớp CI vendored:** không tệp nào trong bộ chín tệp đổi ở mốc
  này, không phải chép lại.
- **Kho kit:** thẻ mở phiên có thêm một dòng đếm vòng meta.

**Giới hạn đã khai:** phép hỏi «vật đã ở nhánh gốc» so với HEAD của cây đang
quét, không với nhánh gốc có tên. Lối «đóng theo quan sát» chưa có trạng thái hồ
sơ để ghi, nên dòng vẫn hiện sau khi ghi quyết định — nguyên thuỷ «xếp lại cho
vòng» còn thiếu, đã có tên ở ô `thuoc-co-cua`. Vòng S4 và CI chưa chụp cây hồ sơ,
chỉ làn ghim lại chụp. Dòng đếm vòng meta nhận hồ sơ mốc theo tên
`release-<x>-<y>-<z>`.

**Chi phí của chính cửa sổ:** vòng sản phẩm R1 tốn 147,8 M token cho bốn lượt S4,
cùng cỡ vòng meta nặng nhất của 2.14. Khối tìm-lỗi rơi về 9,5 %, nhưng làn `ui`
chiếm 91 % lượt cuối. Lượt gọi người 7 cộng 1 so trần 4, vòng thứ tư liên tiếp vượt trần.
Việc meta của cửa sổ không có số token nào: vòng đã ký không có báo cáo chi phí, các phiên chip không chạy `wf-usage`.
Số đầy đủ và nhát cắt cho cửa sổ kế ở khối Notes của hồ sơ mốc.

## 2.14.0 — 15/09/2026

Cửa sổ 2.13 → 2.14 có **hai** vòng đã ký, trong khi luật (b) cho một. Hồ sơ mốc
`_acceptance/release-2-14-0/` ghi thẳng điều đó, cùng năm dòng số của cả hai vòng
đếm bằng một luật và đối chiếu chéo giữa hai phiên. Hai gói cùng lên `2.14.0`;
`diagram-design` giữ `2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Trạm phân loại phạm vi thôi hỏng vì định danh do máy-nói chép sai** (vòng
  `do-tin-tram-phan-loai`). Trước đây kết quả phân loại được ghép về từng phát
  hiện bằng tiêu đề và đường dẫn do tác tử chép lại; chép lệch một ký tự là cả
  lượt rơi về đường «bác bỏ tất cả». Hai số đo, từ HAI vòng khác nhau — nói rõ để
  không ai đọc thành một: vòng `khoi-tim-loi-tra-phi-theo-vat` hỏng **3/6** lượt
  vì lớp này; và ở vòng `chu-ky-khong-tu-lam-hoa-cu`, lượt mất phân loại tốn
  **37 tác tử · 32,7 M token** so **13,7–16,7 M** ở bốn lượt có phân loại chạy
  đúng của cùng vòng. Lượt PASS của vòng ấy (50,2 M) đứng NGOÀI phép so vì nó
  chạy đối chứng đầy đủ trên cây đã gộp — bản trước của mục này gộp nó vào «mọi
  lượt lành» và vì thế nói quá. Nay mỗi phát hiện gửi đi mang một **mã do máy đúc**, kết
  quả ghép theo mã trước, mã lạ bị bỏ, và khi kết quả thiếu mã nào thì máy **hỏi
  lại đúng một lần** chỉ phần thiếu trước khi đặt cờ hỏng. Luật fail-toward-human
  không đổi: hỏi lại vẫn thiếu thì bác bỏ chạy toàn bộ như cũ.
- **Chữ ký thôi tự làm bằng chứng của chính nó hoá cũ.** Đo 14/09: từ lúc owner
  gõ «Ký» tới lúc báo sẵn-sàng-merge mất **54 phút** và **≈ 42 M token**, và
  **7/7** chữ ký của tuần đều chạy **ba** lượt làn máy ≈ 13 phút. Nguyên nhân
  không phải xui: ca canh định tuyến chỉ soi hồ sơ ĐÃ ký, nên chính chữ ký buộc
  bản ghi mốc thêm một dòng — mà tệp ấy là code, nên lưới trước-merge gọi bằng
  chứng hoá cũ và bắt ghim lại. Hai nhát: bản ghi mốc nay là **vật máy sinh**
  (dòng của nó do một lệnh sinh ra ngay trong lượt ký, cùng lớp với bản đồ sản
  phẩm — ADR 0019), và **làn trước chữ ký tự bỏ qua khi cây không đổi so với
  mốc đã chứng** (`--skip-unchanged`). Cây đã đổi sau khi chứng thì làn vẫn
  chạy trọn và luật đỏ y nguyên.

**Ai bị ảnh hưởng / làm gì:**

- **Repo tiêu thụ — HÀNH VI của engine: không có gì phải làm.** Trạm phân loại
  đòi tác tử trả thêm một trường mã; không trả thì rơi về khoá cũ. Cờ
  `--skip-unchanged` là tường minh, mặc định làn vẫn chạy trọn.
- **Repo tiêu thụ — LỚP CI VENDORED: PHẢI chép lại.** Câu trên chỉ nói về hành
  vi engine; nó KHÔNG miễn cho bạn bước chép. Bản đầu của mục này để mỗi câu
  «không có gì phải làm» nên đọc thành cả hai, và đợt rollout 16/09 cho thấy
  điều đó sai: so với **2.11.0** có **4/9** tệp đổi (`pre-merge-check.sh`,
  `evidence-core.cjs`, `ac-line.cjs`, `md-section.cjs`); kho còn ở 2.8.0/2.9.0
  thì thiếu hẳn `eval-yaml.cjs` và `lop-nhin-thay.cjs`, mà thiếu tệp nào là
  **tắt lặng một lớp cưỡng chế** trong khi CI vẫn xanh. Chép **đủ 9 tệp** theo
  khối `INIT-CI-COPY-LIST` của `commands/acceptance-init.md`.
- **Repo tiêu thụ — hai cái bẫy đo được trong đợt rollout đó:**
  - **PR nâng lớp vendored đỏ ở luật T1-escape** nếu kho chưa khai 9 tệp
    kit-owned trong `t1_skip_globs` (chúng là THƯỚC, không phải product code).
    Kho khai chúng trong `t3_paths` thì phải **rút khỏi t3_paths** — cổng kiểm
    `t3_paths` TRƯỚC `t1_skip_globs`, nên chỉ thêm vào skip là vô ích.
  - **Chạy `pre-merge-check` trước khi commit là phép đo nói dối:** luật
    T1-escape đọc diff ĐÃ COMMIT, nên bản vừa chép còn nằm ngoài commit là vô
    hình với nó. Bảy kho báo `clean` ở local rồi ba kho đỏ trên CI vì đúng lớp
    này. Kiểm sau commit, trên worktree dựng từ chính nhánh đó.
- **Kho tự host kit:** lượt ký ra sẵn-sàng-merge trong vài phút thay vì cả giờ
  (ADR 0019).

**Giới hạn đã khai:** bảy mục của vòng `do-tin-tram-phan-loai` đều ở tệp ca
hoặc chẩn đoán nội bộ; tải gửi trạm phân loại còn viết ở hai chỗ — đã vào hạt
giống cửa sổ kế (`docs/plans/2026-09-15-hat-giong-mot-nguon-tai-gui-triage.md`).
Vị từ «cây bằng pin» phía bash và phía JS chỉ đồng nghĩa trên danh sách T1 hiện
tại, ngưỡng đang đếm ở ADR 0019.

**Chi phí của chính cửa sổ (máy đo, hai vòng):** ≈ 199,9 M token cho hai vòng
meta; lượt gọi người **5 và 5** so trần 3 — mọi lượt vượt đều là lỗi hình thức
của máy, không lượt nào là quyết định thật. Số đầy đủ và chín nhát cắt cho cửa sổ
kế ở khối Notes của hồ sơ mốc.

## 2.13.0 — 14/09/2026

Cắt số tại `ea26fdfe` (14/09). Mục này ghi những gì đã gộp vào nhánh chính từ
lúc 2.12.0 được ký (`7e260d4b`, 14/09) tới lần cắt đó.

Trọn phần dưới đây đến từ MỘT vòng: `khoi-tim-loi-tra-phi-theo-vat` — vòng
meta duy nhất của cửa sổ 2.12 → 2.13 (luật (b), owner gọi tên 14/09). Hồ sơ:
`_acceptance/khoi-tim-loi-tra-phi-theo-vat/`.

**Đổi gì:**

- **Khối tìm-lỗi của S4 nay trả phí theo vật, không theo hồ sơ.** Đo trên 20
  lượt chấm (534,6 M token) thấy review + refute chiếm **83 %** token S4, mà
  **3/4** phát hiện đã trả tiền bác bỏ lại bị xếp ra ngoài hợp đồng — tức máy
  trả tiền chứng minh thứ chính nó không được sửa. Năm nhát cắt:
  - **Phân loại phạm vi đứng TRƯỚC bác bỏ.** Chỉ phát hiện trong hợp đồng mới
    trả phí bác bỏ; mục ngoài hợp đồng đi thẳng sang người ở Cổng Bằng chứng,
    mang cờ «chưa qua bác bỏ». Đo được: một lượt chấm của 2.12.0 chạy **20** tác
    tử bác bỏ và cả 20 đều soi hồ sơ chứ không soi vật; lượt PASS của vòng này
    chạy **0**, vì cả 12 phát hiện đều được xếp ngoài hợp đồng nên không mục nào
    phải trả phí bác bỏ. Hai lượt có phân loại lành khác chạy 5 và 0.
  - **«Vùng vật» có tên máy đọc.** Làn tìm-lỗi tập trung vào tệp thật sự đổi,
    thôi soi văn bản hồ sơ của chính vòng. Trước đó 20/20 tác tử bác bỏ soi hồ
    sơ và 0 soi vật.
  - **Mỗi phát hiện có một dòng trong sổ chạy**, nên lượt sau không chấm lại
    mục ngoài hợp đồng mà tệp của nó không đổi.
  - **Làn đối chứng rời đường găng.** Nó là tín hiệu phụ nhưng từng giữ đồng hồ
    của cả lượt; nay chạy riêng, chỉ đợi ở điểm muộn nhất cần.
  - **Thước token và phút.** `wf-usage` đo thời gian theo vai trò và sinh
    `usage-report.md`, tách ba khối chứng-minh-vật / tìm-lỗi / tổng hợp.

- **North star có thêm chi phí máy.** Thước của kit nay đếm cả **token và phút
  máy trên mỗi kết quả ship**, không chỉ giờ người. Dòng người vẫn đứng trước
  dòng máy: token giảm mà lượt gọi người tăng là thất bại. Luật (c) đi từ ba
  lên **năm dòng số** mỗi mốc phát hành.

- **Nghi thức kiểm phép đo nay HAI chiều.** Trước đây kit chỉ hỏi «phá vật thật
  thì phép đo có đỏ không» (độ nhạy). Nay hỏi thêm «chạm một thứ KHÔNG phải vật
  thì phép đo có IM không» (độ đặc hiệu). Thiếu chiều thứ hai, mọi luật về phạm
  vi của kit không thể sai được trong bất kỳ phép đo nào đang chạy.

- **Thẻ Cổng Bằng chứng nói đúng hơn.** Khối ngoài hợp đồng thôi nói các mục đó
  «là thật» — chúng chưa qua bác bỏ đối kháng, và thẻ nay nói vậy.

**Ai bị ảnh hưởng / làm gì:**

- **Kho tiêu thụ đang giữa một vòng lặp:** không có gì phải làm. Engine chỉ đổi
  dưới chân bạn theo bản phát hành có chủ đích, và 2.13 chưa ra. Kéo nhánh chính
  giữa hai mốc là tự chọn.
- **Kho tự dựng args cho S4:** nếu bạn gọi thẳng workflow chấm thay vì qua skill,
  bên viết nay truyền thêm năm khoá (`vungVat`, `ngoaiVatFiles`, `diffFiles`,
  `fileDoTrongDiff`, `coverageFiles` cùng `coEvalPaths`). **Thiếu khoá nào cũng
  không vỡ** — bên đọc có đường đọc-cũ cho từng khoá. Nhưng ba trong số đó rơi
  về đường cũ *lặng lẽ*: đó là một trong 12 giới hạn đã khai bên dưới.
- **Người đọc `usage-report.md`:** bảng theo vai trò đếm đúng số tác tử, nhưng
  dòng tiêu đề và tổng theo model vẫn đếm theo dòng (tác tử × model), nên hai
  con số trong cùng một báo cáo có thể lệch nhau. Giới hạn đã khai.

**Giới hạn đã khai (12 mục, owner ký 14/09):** không mục nào chạm hành vi người
dùng cuối — tất cả là nợ của chính bộ đo: một bản chép tay của hàm khớp đường
dẫn, cờ vàng thiếu cho ba khoá args mới, hai bộ đếm tác tử còn đếm dòng, một phụ
thuộc PyYAML chưa khai trong tài liệu cài đặt, và vài ca không đo được điều
chúng tuyên. Chi tiết từng mục:
`_acceptance/khoi-tim-loi-tra-phi-theo-vat/evidence-report.md`, mục
«Known limits». Chúng đi vào hạt giống mốc 2.13.

**Đã biết trước, chờ mốc 2.13 quyết** — `docs/plans/2026-09-14-hat-giong-ba-cho-cat-sau-chu-ky-cua-so-2-13.md`:

1. Ghim lại theo diff thay vì chạy trọn corpus (làn hiện tốn ≈ 12 phút mỗi lượt).
2. Fixture ghim định tuyến thẻ không được đỏ chỉ vì có hồ sơ mới ký.
3. Dòng số thứ nhất đo tới «lên nhánh chính», và nghi thức ship chạy nền.
4. Chiến dịch ghim lại: **41 trên 68** hồ sơ có ghim đang hoá cũ, mốc ghim cũ
   nhất tụt 411 commit. Đây là nợ có sẵn giữa hai mốc, không phải hồi quy — luật
   ghim-lại-theo-release gọi trạng thái này là chấp nhận được.

**Chi phí của chính vòng này (máy đo):** sáu lượt chấm, trong đó **ba lượt bị hạ
tầng đốt** — một lỗi ống lệnh, một lượt đỏ giả, một suite chập chờn không tái
hiện được. Cả ba đều xanh khi chạy tay. Số này vào dòng thứ ba của luật (c), và
nó lớn hơn phần tiết kiệm được nếu tính theo giờ người.
