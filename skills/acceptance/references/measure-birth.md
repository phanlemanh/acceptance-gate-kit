# Giấy khai sinh phép đo — khuôn bắt buộc lúc VIẾT

> Nạp bởi mệnh đề `MEASURE-BIRTH-CLAUSE` trong SKILL feature-loop (cả hai
> harness). Một phép đo MỚI — case suite, eval, rule script — chỉ được tính
> XONG khi hồ sơ khai sinh của nó đủ BỐN mục dưới đây, thể hiện bằng cặp case
> hai-chiều trên CÙNG một fixture, tự chạy lại được mỗi CI. Lời khai tĩnh
> ("đã thử rồi") không phải bằng chứng — nó mục nát và điền-cho-có được.
> Vì sao khai sinh phải đủ trước khi tin: mọi màu xanh của một phép đo
> chưa-từng-đỏ đều không phân biệt được "vật lành" với "thước chưa bao giờ
> chạy" (fixture hỏng, cp lỗi, exit 127 — tất cả cùng một màu xanh).

## Bốn mục bắt buộc

<!-- <<<MEASURE-BIRTH-SECTIONS -->
### 1. Đối-chứng-dương

Thước phải IM trên vật nguyên vẹn. Chạy phép đo trên bản lành TRƯỚC — xanh —
rồi mới được tin bất kỳ nhánh đỏ nào. Thiếu mục này: mọi nhánh đỏ có thể là
đỏ-vì-lý-do-khác (thước hỏng cũng đỏ), và mọi nhánh xanh có thể là
xanh-vì-không-chạy.

### 2. Phá-vật-thật

≥1 lượt phá ĐÚNG VẬT phép đo canh (mutation trong bản sao) mà kết luận phải
LẬT — xanh thành đỏ. Cùng fixture với mục 1, chỉ khác đúng biến đang đo —
mọi khác biệt kết quả khi đó chắc chắn do biến đó gây ra. Nghi thức hỏi
nhanh: "nếu tôi phá vật thật trong một bản sao, phép đo này có đỏ không?" —
phá thử một lần cho mỗi phép đo mới, đừng chỉ trả lời trong đầu.

### 3. Thông-điệp-ghim

Nhánh đỏ phải ghim ĐÚNG THÔNG ĐIỆP mong đợi (tên mốc, tên case, tên bất
biến…), không chỉ mã thoát. Exit code nói dối: fixture hỏng, file thiếu,
lệnh không tồn tại đều cho exit ≠ 0 — chỉ thông điệp phân biệt được "bắt
đúng lỗi" với "vỡ vì lý do khác".

### 4. Phủ-định-phổ-quát

Lời hứa dạng «KHÔNG có X nào, ở bất kỳ cách diễn đạt nào» là một **phủ định
phổ quát trên văn tự nhiên**, và một danh sách chuỗi-cấm KHÔNG chứng được nó:
`grep` chứng được sự vắng của một chuỗi cụ thể, không chứng được mệnh đề phổ
quát. Mỗi lần vá thêm một chuỗi vào danh sách cấm là một lần thừa nhận danh
sách ấy chưa bao giờ đóng.

Đường chứng được là **lật sang liệt cái ĐƯỢC PHÉP**, ba phần đi liền:

1. **Quét cả LỚP cú pháp** trên phạm vi khai đích danh — không quét từng chuỗi
   đã biết, mà quét hình dạng (regex của lớp) trên một danh sách đường dẫn khai
   trước. Cái không quét tới phải nhìn thấy được, không im lặng.
2. **Bản khai miễn trừ khai TRƯỚC**, theo cặp `(tệp, từ khoá)` hoặc `(lớp, lý
   do)`, mỗi dòng kèm lý do đọc được. Hit nằm ngoài bản khai → ĐỎ.
3. **Bánh cóc HAI CHIỀU** trên chính bản khai: dòng miễn trừ không còn hit thật
   cũng ĐỎ. Thiếu chiều này thì bản khai là cửa sau — thêm một dòng là tắt được
   một phép đo, vĩnh viễn, không ai biết.

Phần dư không lật được (biến thể hình thái của ngôn ngữ tự nhiên — «vài phút»,
cách nói vòng) **phải khai known-limit kèm LỆNH TÁI LẬP**, không được im. Lệnh
tái lập là thứ phân biệt "đã biết và chấp nhận" với "chưa từng nhìn": người
sau chạy đúng lệnh ấy là thấy lại đúng lỗ, không phải tin một câu văn.
<!-- MEASURE-BIRTH-SECTIONS>>> -->

## Hai mẫu sống trong suite của chính kit

**Mẫu 1 — L35/L35b (`tests/scripts/run-tests.sh`, NEG_RE học từ vựng):**
cùng MỘT fixture `lintU`, hai chiều chỉ khác đúng câu đối chứng:

```
L35  expected có "đối chứng dương xanh trước"  → W1 phải IM
L35b sed gỡ đúng câu đó khỏi CÙNG fixture      → W1 nổ đúng "W1 AC-1"
```

**Mẫu 2 — PM13/PM14 (`tests/scripts/run-tests.sh`, răng cross-layer):**
PM13 là chiều bắt-được (nhãn chen giữa id và `:` → violation ghim đúng chuỗi
"AC-1 is tagged (cross-layer)"); PM14 là chiều không-được-chặn-oan (dòng
tham-chiếu-chéo phải exit 0) — và PM14 pass đồng thời CHỨNG MINH đường lib
chạy thật, vì dưới đường lùi awk nó sẽ đỏ.

## Bảng lớp lỗi — khuôn phải chặn được đúng những ca này

Nguồn: `docs/research/known-limits-ledger.tsv` (sổ vòng đời corpus
known-limits; cột `class`). Mỗi lớp một ca đại diện còn SỐNG.

Bảng này **không phải bản chép tay**: case `P177` buộc nó khớp HAI CHIỀU với
cột `class` của sổ, trên tập dòng `status == 'song'`. Lớp sống trong sổ mà vắng
trên bảng → ĐỎ; hàng trên bảng mà sổ không có lớp sống → ĐỎ; dòng miễn trừ
không còn hit thật → ĐỎ. Khuôn ô lớp là **token đầu ô, cắt trước dấu cách hoặc
dấu ngoặc** — bên viết và bên đọc dùng đúng khuôn ấy, khai một chỗ.

<!-- <<<MEASURE-BIRTH-CLASS-TABLE -->
| Lớp | Ca đại diện | Khuôn chặn bằng mục nào |
|---|---|---|
| khong-the-do (hằng-đúng, đếm-rồi-vứt, tự-vô-hiệu) | card-text-fidelity#1 — biến `checked` gán rồi bỏ, không assert | 2 (phá vật mà không lật = phép đo không đo) |
| fail-open (nuốt lỗi, im lặng, rơi về mặc định) | card-text-fidelity#4 — sentinel va U+0000, text rơi im lặng | 2 + 3 (phá phải ĐỎ, và đỏ đúng thông điệp) |
| snapshot-nguon-song (ghim SHA/corpus sống) | gold-output-measure#1 — provenance ghi sai repo_sha, đúng trường không ai đo | 1 (đối chứng dương trên vật thật hiện hành) |
| chuoi-thay-quan-he (assert chuỗi-có-mặt, hứa quan hệ) | gold-output-measure#10 — "mỗi góc nhìn một dòng" tuyên quan hệ, đo chuỗi | 2 (mutation phá QUAN HỆ phải lật kết luận) |
| fixture-viet-tay (tự dựng đúng khuôn bên đọc) | gold-output-measure#9 — fixture viết tay không round-trip từ writer thật | 1 + 2 (fixture do code sinh trong chính lần chạy) |
| doc-drift (đo chỉ-dẫn thay vì đầu-ra) | design-pass-skill#1 — SKILL hứa hiển thị mà không reader nào đọc | 2 (phá ĐẦU RA thật, không phá tài liệu) |
| dong-goi (ship thiếu/thừa, changelog câm) | cross-feature-claim-index#3 — bump version không có mục changelog | 2 (phá kênh giao phải đỏ — version, gói, mirror) |
| mat-nguoi (câu cho người nói sai sự thật) | gold-output-measure#5 — sổ vàng khẳng định sai nguyên nhân | 3 (thông điệp là vật được đo, không phải trang trí) |
| do-thuoc (thước đo hụt một chiều đã hứa) | tai-lap-ceremony-diet#14 — P186 chưa đo tính CHỌN LỌC của KPI pickaxe | 2 (phá đúng chiều bị bỏ sót phải lật kết luận) |
| tap-so-rong (tập so rỗng → hằng đúng) | cat-hinh-thuc#1 — chân giữ-gân E5 so trên tập rỗng, xanh bất kể HEAD | 1 (đối chứng dương phải chứng tập so KHÁC rỗng) |
| doi-chung-tu-sinh (chèn rồi grep lại chính nó) | cat-hinh-thuc#2 — E9b "đối chứng dương tự sinh", định lý về grep | 1 (đối chứng dương đo vật KHÔNG do phép đo tự đặt vào) |
| mut-khong-qua-chan-that (đột biến đi vòng qua chân canh) | cat-hinh-thuc#3 — mutation chạy bản sao của phép kiểm, không chạy chân canh | 2 (đột biến phải gọi CHÍNH hàm mà đường xanh gọi) |
| pinned-khong-dem-duoc (ghim chuỗi cho một lời hứa SỐ) | cat-hinh-thuc#4 — "đúng sáu dòng" ghim bằng một câu tiêu đề | 3 (số phải nằm trong chuỗi được in, hoặc khai là số người-đối-chiếu) |

**Miễn trừ khai trước** — lớp CÓ dòng sống trong sổ mà CỐ Ý không lên bảng.
Bánh cóc đo cả danh sách này: miễn trừ một lớp không còn dòng sống là ĐỎ.

- `khac` — ô rác bắt-hết của sổ, không phải một lớp lỗi có khuôn chặn riêng.
  Điền cho nó một hàng «ca đại diện + khuôn chặn bằng mục nào» là điền-cho-có,
  đúng thứ section dưới cấm. Muốn một hạng mục trong `khac` có răng: tách nó
  thành lớp có tên rồi thêm hàng, đừng để nó núp trong ô rác.
<!-- MEASURE-BIRTH-CLASS-TABLE>>> -->

## Chống điền-cho-có

Cặp hai-chiều PHẢI cùng fixture. Hai fixture khác nhau cho hai chiều là khai
sinh giả: chiều đỏ có thể đỏ vì fixture khác, không vì vật bị phá. Và tập
case khai sinh phải khai ĐÍCH DANH (khối marker id) — "quét thấy gì kiểm nấy"
là tập-khai-bằng-tập-tìm-được, một dạng hằng-đúng.
