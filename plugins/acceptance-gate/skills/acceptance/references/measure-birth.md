# Giấy khai sinh phép đo — khuôn bắt buộc lúc VIẾT

> Nạp bởi mệnh đề `MEASURE-BIRTH-CLAUSE` trong SKILL feature-loop (cả hai
> harness). Một phép đo MỚI — case suite, eval, rule script — chỉ được tính
> XONG khi hồ sơ khai sinh của nó đủ BA mục dưới đây, thể hiện bằng cặp case
> hai-chiều trên CÙNG một fixture, tự chạy lại được mỗi CI. Lời khai tĩnh
> ("đã thử rồi") không phải bằng chứng — nó mục nát và điền-cho-có được.
> Vì sao khai sinh phải đủ trước khi tin: mọi màu xanh của một phép đo
> chưa-từng-đỏ đều không phân biệt được "vật lành" với "thước chưa bao giờ
> chạy" (fixture hỏng, cp lỗi, exit 127 — tất cả cùng một màu xanh).

## Ba mục bắt buộc

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
known-limits; cột `class`). Mỗi lớp một ca đại diện còn SỐNG:

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

## Chống điền-cho-có

Cặp hai-chiều PHẢI cùng fixture. Hai fixture khác nhau cho hai chiều là khai
sinh giả: chiều đỏ có thể đỏ vì fixture khác, không vì vật bị phá. Và tập
case khai sinh phải khai ĐÍCH DANH (khối marker id) — "quét thấy gì kiểm nấy"
là tập-khai-bằng-tập-tìm-được, một dạng hằng-đúng.
