# phan-du-bo-cuc-moi-vong-ba — thiết kế

Hồ sơ: `_acceptance/phan-du-bo-cuc-moi-vong-ba/` · Cổng Đáng 16/11/2026: chủ kho «Mở vòng ba» (ô `opportunity.md`).
Khoá đích: `_acceptance/phan-du-bo-cuc-moi-vong-ba/khoa-dich.tsv` — 486 khoá B2 đo thiếu (cây kịch bản `9eed5714` so
`d8c42965`), chép nguyên kèm cột cụm. Vòng nhận K4-LT 155 · K4-TB 92 · K4-MP 225 · K4-RG 5 = 477, cộng lỗi đỏ nhánh chính.

## 1. Vấn đề trong một câu

Hai vòng trước dạy bộ kiểm nói đường «theo cây nào»; còn ba chỗ bộ kiểm vẫn giả định một quan hệ chỉ đúng hôm nay:
(a) 22 tệp lộ trình / thẻ vẫn viết đường phẳng; (b) hai tệp dựng «cây phẳng» bằng cách bung CÂY ĐANG CHẠY, nên ở cây đã là
bố cục mới chúng không còn cây phẳng nào; (c) một tệp lấy bản gốc bằng `merge-base HEAD origin/main` mà kỳ vọng viết theo
mốc cố định, nên sau khi gộp bản gốc trùng HEAD và ca đỏ trên nhánh chính.

## 2. Số tôi đo, số tôi nhận lại

- **Nhận lại** (B2, không đo lại ở đây): 486 / 5 791 khoá thiếu, phân cụm ở `khoa-dich.tsv`.
- **Đo ở kho này 16/11** — đường nền trên cây sạch `origin/main` `795baf96` (`duong-nen.md` của hồ sơ); và 25 tệp của bốn
  cụm chạy trong một kho mới tạm dựng bằng `khoMoi` của thước vòng hai (bước 1–3 + luật đổi tên + luật chung bước 6, bỏ
  qua 43 tệp tự đúng đường của vòng hai, KHÔNG bảng vá): 25/25 tệp thoát khác 0. Hai tệp K4-MP chết ở dựng fixture («mục chợ
  acceptance-gate có source lạ: ./plugins/acceptance-gate», mã 3) — khớp số B2. 23 tệp còn lại gãy ở ba dạng: nạp hay chép
  theo đường phẳng (`scripts/lo-trinh.mjs`, `scripts/ho-so-tom-tat.cjs`, `road-map/commands/gui.md` …); bung một commit
  lịch sử bằng danh sách đường mà bước 6 đã đổi sang dạng mới (`git archive <sha> plugins/acceptance-gate/scripts …` trên
  commit phẳng); và bản sao kit tạm thiếu tệp nên lệnh con chết. Số khoá theo từng tệp ở kho mới tạm không so được với B2
  (B2 có bảng vá) — dùng làm dạng gãy, không làm mẫu số.

## 3. Hướng đã chọn

### 3.1 Commit đầu — nhánh chính hết đỏ, theo lớp

`bang-ten-lo-trinh.test.mjs`: bản gốc ghim vào `644e9b49` — đúng commit mà cột «bản gốc in» của ma trận được đo (chú thích
dòng 41). Kết quả không còn phụ thuộc quan hệ HEAD ↔ `origin/main`. Chiều đỏ giữ nguyên: ô `khac-ten` vẫn đòi khác bản gốc
đúng chữ tên gói, ô `bang` vẫn đòi từng byte, và một ca canh mới (`SP-GOC-GHIM`) chứng bản gốc ghim đúng là bản thiếu nhánh
dự phòng (chạy luật chặn của bản gốc ở ô «thiếu» → `null`; đối chứng dương: cùng bản gốc ở ô «có» → khoá đúng).

`recheck-goc-goi-loi.test.mjs` RG-2 KHÔNG cùng lớp: nó so «từng byte bằng bản gốc» — lời hứa tương đối «nhánh này không đổi
đầu ra khi kho không có marketplace.json». Theo tiền lệ chủ kho (`dieu-phoi-lop-mod`, d-20261011T092906Z-24), ca dạng ấy
giữ merge-base sống: neo cố định sẽ đỏ khi một PR sau đổi hành vi ấy hợp lệ. Sau gộp nó xanh rỗng, không đỏ.

Rà lớp: 42 tệp dưới `tests/` gọi `merge-base`. Lớp lỗi = **kỳ vọng tuyệt đối viết theo một mốc** + bản gốc theo
`merge-base`. Phần lớn còn lại so TƯƠNG ĐỐI «bản trước vòng ↔ HEAD» — sau gộp chúng xanh rỗng theo thiết kế đã có của kit
(«chiều im so bản trước vòng»), không đỏ, không thuộc lớp này. Vòng phân loại từng tệp bằng tác tử đọc mã ở S3 rồi ghi bảng
vào `rang/ra-lop-merge-base.md` (A kỳ vọng tuyệt đối · B tương đối · C không dùng làm bản gốc); tệp A thì ghim mốc như trên.
Răng chung không phụ thuộc bảng xếp đúng hay sai: `--sau-gop` chạy MỌI tệp gọi `merge-base` ở GOC_VONG hoặc ở HEAD trong một
bản sao có `origin/main` = HEAD — đúng tình trạng sau gộp. Tệp B xanh rỗng ở đó, nên tệp nào đỏ là xếp sai hoặc lỗi thật.
Với tệp vòng chạm, túi khoá sau gộp phải BẰNG túi trên nhánh.

### 3.2 K4-MP — «cây phẳng của chính mã này» lấy từ lịch sử khi cây đã là bố cục mới

Hàm mới `tests/hai-bo-cuc.mjs` → `haiCay(kho, tmp)` trả `{ phang, moi, hienTai }`:
- cây đang chạy phẳng (bộ dịch đọc từ tệp khai chợ) → `phang` = cây đang chạy, `moi` = `dungKhoMoi(phang)` — y như hôm nay;
- cây đang chạy là bố cục mới → `moi` = cây đang chạy; `phang` = `git archive` của **cha của commit MỚI NHẤT đưa
  `plugin.json` lõi vào `plugins/`** (đường suy bằng bộ dịch, không viết chữ), kèm chốt: bộ dịch phải đọc cây ấy là phẳng,
  không thì lỗi «hai-bo-cuc: cha của commit dọn nhà <sha> không phẳng».
  Ở lượt đo của B2 và ở ngày cắt sang, commit cha ấy là đỉnh nhánh chính kho cũ — tức chính mã đang kiểm, ở bố cục cũ
  (B2 dựng cây kịch bản là con của HEAD kho cũ, `viec-kho-cu-b2.md` §4.3; thước vòng hai `khoMoi` cũng vậy).

Đây là câu hỏi cho chủ kho (Hỏi-2, §5), không phải máy quyết: lối còn lại — dựng bộ đổi NGƯỢC (mới → phẳng) có kiểm khứ
hồi — vẫn sống. Hai lối khác nhau ở SAU ngày cắt sang: lối lịch sử đóng băng cột «cũ» ở mã ngày cắt sang (rẻ, ~40 dòng; mất
dần nghĩa khi kho mới sửa lõi); bộ đổi ngược giữ cột «cũ» chạy trên mã hiện hành (~150 dòng đảo luật đổi chữ không đơn ánh,
nên chỉ trả một ảnh ngược). Khuyến nghị lối lịch sử kèm ngưỡng mở lại đếm được: ≥ 1 commit kho mới chạm
`plugins/acceptance-gate/{lib,scripts}` sau commit dọn nhà.

`bo-cuc.test.mjs`: cây phẳng, kho mới, cột của hàng «HEAD» (phẳng hay mới, đọc từ bộ dịch) đi qua `haiCay`.
`bang-ten-lo-trinh.test.mjs`: cột «cũ» và «mới» đi qua `haiCay`; mọi đường lõi (khởi tạo lộ trình, `lib/ho-goi.cjs`) qua
bộ dịch.

### 3.3 K4-LT, K4-TB, K4-RG — cùng bộ dịch, mỗi chuỗi đường theo đúng cây nó nói tới

22 tệp + `recheck-goc-goi-loi.test.mjs`: thay chuỗi đường bằng `duong` / `tep` / `gocGoi` / `boPhan` / `pathspec` của
`tests/bo-cuc.mjs` theo cây chuỗi ấy nói tới (cây đang đứng, bản bung một commit, bản sao gốc gói, kho tiêu thụ giả). Kho
tiêu thụ giả và hồ sơ giả KHÔNG dịch (đường của kho tiêu thụ không phải đường kit — chính là chỗ xanh giả #4, #5). Mỗi tệp
sửa xong vào khối «tự đúng đường» của `gui-b2.md`, nên B2 bỏ bước 6 và bảng vá cho nó.

Ca đổi nghĩa: máy quyết theo nguyên tắc của vòng hai — **giữ lời hứa gốc của ca ở cả hai bố cục**; ca nào không giữ được mà
không thêm hành vi đo mới thì ghi vào `gui-b2.md` §4 và lên thẻ.

### 3.4 Thước — luật tĩnh trước, phép đo dài sau

`_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs`, dùng lại hàm xuất của thước vòng hai (`khoMoi`, `tuiKhoa`,
`tui-khoa.mjs`) — không sửa byte nào của hồ sơ đã ký:
- `--tinh` (vài giây, chạy TRƯỚC mọi chế độ khác và là bước đầu của mọi chế độ): (1) tập tệp vòng sửa dưới `tests/` =
  `git diff --name-only <GOC_VONG> HEAD -- tests/`, trong đó `tests/scripts/fixtures/routing-baseline.txt` chỉ bỏ qua khi
  MỌI dòng đổi của nó là dòng thêm mở đầu bằng slug của vòng (đúng dòng bước 7a-bis của lệnh ký ghi) — sửa dòng khác thì
  tệp tính là vòng sửa và phải khai; tập ấy phải bằng khối tự đúng đường của vòng ba ∪ danh sách «vẫn đi bước 6». Lối «loại
  cả tệp» chết vì làm luật mù đúng ở tệp vòng hai đã đỏ; lối «khai tệp vào vẫn-đi-bước-6» chết vì tệp nằm dưới `fixtures/`,
  nơi bước 6 vốn không chạm, và báo B2 điều sai; (2) mọi khoá đích của bốn cụm
  có tệp nguồn ở HEAD; (3) bộ tự kiểm của thước (`giu-khoa-3.test.mjs`) xanh. Đỏ → dừng, không chạy phép đo nào.
- `--cu`: mỗi tệp vòng chạm ở bản gốc **ghim** `GOC_VONG` = `795baf96` (đỉnh nhánh chính lúc mở vòng — không phải
  merge-base; khác `MOC_MA_TRAN` = `644e9b49` là mốc riêng của ma trận bang-ten) và ở HEAD → túi HEAD ⊇ túi bản gốc, mọi ca HEAD xanh (trừ đúng ca đang đỏ ở bản gốc: SP của bang-ten).
- `--moi [--cum]`: kho mới từ HEAD — commit CON của HEAD trong bản sao có lịch sử thật (`khoMoi` của thước vòng hai), như
  cây kịch bản của B2; bước 6 bỏ qua tự-đúng-đường vòng hai ∪ vòng ba → mọi khoá đích của bốn cụm có mặt và xanh; túi mỗi
  tệp ⊇ túi bố cục cũ.
- `--sau-gop`: bản sao có `origin/main` = HEAD → mọi tệp ở §3.1 xanh; túi tệp vòng chạm bằng túi trên nhánh.
- `--chieu-do`: kho mới, bộ dịch thay bằng bản đồng nhất (`banDongNhat` của thước vòng hai) → mỗi cụm có ca canh đỏ đúng câu;
  `haiCay` thay bằng bản luôn bung cây đang chạy → K4-MP đỏ đúng câu «source lạ».
- `--ghi-gui-b2`: rút mục vá thừa bằng máy từ ảnh chụp bảng vá B2 (`rang/va-bo-kiem-b2.json`, ghi rõ commit nguồn).

### 3.5 Nhịp ký

Chờ CI ở đỉnh PR xanh TRỌN rồi mới mời ký Cổng Bằng chứng (cách làm của vòng, không sửa lệnh ký). Commit chữ ký chỉ chạm hồ
sơ và `routing-baseline.txt`; luật tĩnh đã loại tệp ấy, nên lượt ghim lại sau ký không đỏ vì nghi thức.

## 4. Ghép nối với B2 — `gui-b2.md`, bốn mục như vòng hai

(1) mục vá thừa (máy rút) · (2) tệp tự đúng đường (khối máy đọc) · (3) cấu hình kịch bản phải đổi · (4) ca đổi nghĩa và lý do.

## 5. Câu cho người (Cổng Phạm vi)

- **Hỏi-1 — P161 (K4-PL, 1 khoá).** Hai mục vá B2 đổi hai assert của `tests/plugins/run-tests.sh` thành biểu thức Python
  `root / "plugins/acceptance-gate"`; chốt «assert chỉ được thêm» của P161 so với mốc ghim `044968e` nên thấy hai assert
  biến mất. Khuyến nghị: **B2 khai hai dòng ở `tests/plugins/asserts-da-go.txt` bằng mục vá** (chỉ ở kho mới, nơi lời khai
  đúng) — kho này không đổi gì. Lối khác: kho này viết lại hai assert qua bộ dịch và khai chúng ở `asserts-da-go.txt` — giá:
  chạm tệp 7 900 dòng có bánh cóc, nới bánh cóc ở kho cũ trong khi assert cũ vẫn đúng ở đây.

- **Hỏi-2 — cột «cũ» của K4-MP ở kho mới.** Khuyến nghị: **lấy từ lịch sử** (cha commit dọn nhà), khai giới hạn kèm ngưỡng
  mở lại ở Notes hợp đồng. Lối khác: dựng bộ đổi ngược mới → phẳng có kiểm khứ hồi — giá: ~150 dòng mã kiểm mới, thêm một
  phép đo khứ hồi, lượt chấm dài hơn; được: cột «cũ» vẫn chạy mã hiện hành sau cắt sang.

## 6. Rủi ro

- 25 tệp, nhiều tệp lộ trình chạy lâu → lượt chấm dài; đường cắt ở Cổng Phạm vi (dời K4-TB nếu cần).
- Commit cha của commit dọn nhà ở kho mới thật có thể không phải đỉnh kho cũ (kịch bản gộp nhiều commit) — chốt «phải
  phẳng» bắt; ghi vào `gui-b2.md` §3.
- Rà lớp merge-base phân loại sai một tệp → `--sau-gop` chỉ phủ tệp đã xếp; giới hạn khai.
