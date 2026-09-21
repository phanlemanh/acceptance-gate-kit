# Chiến dịch ghim lại theo mốc 2.18.0 — 21–22/09/2026

Owner gọi tên 21/09 («Gộp PR #195 rồi chạy chiến dịch ghim lại»). Nhánh `main` tại
`41b949de` (commit gộp mốc 2.18.0). Nguồn: đầu ra nguyên văn của `feature-loop/scripts/repin-lane.mjs`.

## Số

| | Lượt 1 — mọi hồ sơ hoá cũ | Lượt 2 — chỉ hồ sơ xanh |
|---|---|---|
| hồ sơ | 81 (78 đã ký + 3 làn V cửa veto mở) | 65 |
| eval máy | 835 | 643 |
| suite chung | 5/5 xanh | 5/5 xanh |
| hồ sơ có eval đỏ | **16**, tổng **65** eval | 0 |
| tệp hồ sơ đã ký bị chạm | 0 | 0 |
| kết quả | ĐỎ — không ghi gì | XANH — ghi, run_id `repin-20260921T175037Z-33397` |
| phút máy (tổng thời lượng lệnh) | ≈ 163 | ≈ 59 |

**Sau chiến dịch:** `pre-merge-check.sh --recheck-all` còn đúng 16 vi phạm «evidence is stale» —
đúng 16 hồ sơ đỏ dưới đây — cộng một dòng `gap-probe` chỉ vì lượt quét toàn kho không truyền `--base`.

**Cách chạy khác 2.16.0:** 2.16.0 chạy một lượt trên mọi hồ sơ, gặp 14 hồ sơ đỏ và vì luật «làn đỏ
thì không ghi gì» nên ghim được **0**. Lần này lượt 1 dùng làm phép đo phân loại, lượt 2 ghim
riêng tập xanh. Giá: một lượt làn thứ hai (≈ 59 phút). Một lần lọc sai trong phiên (mã eval chữ
hoa `EC` lọt khỏi tập đỏ) bị phát hiện trước khi lượt 2 chạy quá pha suite và đã dừng, chạy lại.

## Mười sáu hồ sơ đỏ — chờ người quyết

Luật 2.17.0: hồ sơ ĐÃ KÝ mà lời hứa không còn kiểm lại được thì **nghỉ** bằng một dòng sổ mang
tên người (`type: nghi`, khối NGHI-LINE-RECIPE ở GUIDE mục «Cho một hồ sơ nghỉ»). Máy không
viết dòng đó — chữ ký là của người.

| Hồ sơ | Eval đỏ | Đỏ từ | Vì sao (dòng lỗi đầu tiên của làn) |
|---|---|---|---|
| `cat-hinh-thuc` | 12/14 | 2.16.0 | răng đọc văn bản lệnh/khuôn cũ; lưới đọc-cũ vẫn khớp nhưng chân văn bản lệch |
| `cat-khoi-viec-cua-anh-tren-tin` | 4/6 | 2.16.0 | needle của khuôn YOUR-MOVE-BLOCK không còn trong văn bản — phép đo tự báo «không sống» |
| `cong-dang-co-cua` | 1/3 | 2.16.0 | chân round-trip 25/26 — một ca lệch khuôn hiện hành |
| `doi-hanh-vi-cong-nguoi` | 3/9 | 2.16.0 | chân G1: bản luật thiếu câu cho tin chỉ-báo mà phép đo đòi |
| `duong-lui-phai-song` | 3/15 | 2.16.0 | chiều đỏ của ca rút dòng 7b không còn chạy trên khối hiện hành |
| `eval-khai-ma-thoat-mong-doi` | 4/13 | 2.16.0 | fixture gọi s4-args trên kho một commit → «DIFF RỖNG» (nhánh fail-loud có từ 14/09) |
| `inputs-tinh-tu-goc-kho` | 1/8 | 2.16.0 | ghim băm acceptance-verify.js tại mốc ký; tệp đổi có chủ đích ở 2.18.0 (dòng cannot_run mang reason) |
| `luu-kho-codex-va-nghi-le-design` | 23/24 | 2.16.0 | đếm số ca cố định của từng suite; suite đã lớn lên |
| `release-2-0-0` | 1/8 | 2.18.0 | chân diff-allowlist so với HEAD → diff rỗng, phép đo vô nghĩa sau khi gộp |
| `release-2-14-0` | 1/9 | 2.16.0 | số chép tay trong hồ sơ (44) lệch lưới (71) |
| `release-2-15-0` | 3/19 | 2.16.0 | cửa sổ neo vào lần cắt số KẾ TIẾP — đọc tới HEAD |
| `release-2-16-0` | 2/10 | 2.18.0 | như trên; danh sách chép CI thêm lib/nhan-canh-gay.cjs |
| `release-2-17-0` | 1/9 | 2.18.0 | rel-cua-so.sh đọc 26bf12fe..HEAD → thấy hai hồ sơ ký sau mốc |
| `thuoc-co-cua` | 1/24 | 2.18.0 | E17 trỏ tệp ca trần nhát đã gỡ ở 2.18.0 (khai sẵn ở hợp đồng nhan-trang-thai-va-reality) |
| `thuoc-khai-mot-dang-do-mot-neo` | 4/10 | 2.16.0 | bốn eval dùng chung một lệnh đỏ |
| `veto-co-dau-vet` | 1/11 | 2.16.0 | đếm số ca cố định của suite (686→891, 60→70, 146→267) |

**Đọc bảng:** 12 hồ sơ đã đỏ từ chiến dịch 2.16.0 và chưa ai cho nghỉ dù lối nghỉ có từ 2.17.0.
Bốn hồ sơ mới đỏ ở cửa sổ này: `thuoc-co-cua` (đã khai trước), ba hồ sơ mốc mà phép đo đọc tới
HEAD. Hai hồ sơ đỏ ở 2.16.0 nay xanh lại và đã được ghim (`start-bang-dieu-khien`,
`thuoc-nhan-de-khoi`). Không hồ sơ nào đỏ vì một hồi quy của vật trong cửa sổ này mà chưa được
khai: mọi dòng đỏ là phép đo neo vào trạng thái cây cũ, hoặc tệp đổi có chủ đích.

**Lớp lặp, không phải ca lẻ:** 7/16 hồ sơ đỏ vì phép đo tự đọc tới HEAD hoặc đếm số cố định
(năm hồ sơ mốc — một trong đó đếm số chép tay — và hai bộ đếm số ca của suite). Đây là hình dạng «bất biến nằm trong
hồ sơ đã ký» — phép thử «mệnh đề còn đúng sau 50 commit không?». Ghi ở đây, không mở ô.


## Quyết định của owner — 22/09

Owner nói «nghỉ cả 16». Máy ghi 15 dòng `type: nghi` mang tên Phan Le Manh, mỗi dòng kèm lý do
lấy từ bảng trên và danh sách eval thôi hứa. `contract.md`, `evidence-report.md`, `run-log.jsonl`
của 15 hồ sơ không đổi một byte. Sau đó `--recheck-all` chỉ còn `release-2-0-0` hoá cũ.

**`release-2-0-0` KHÔNG được ghi dòng nghỉ:** hồ sơ làn V, cửa veto mở, chưa có chữ ký người —
luật 2.17.0 chỉ cho nghỉ hồ sơ đã ký, nên dòng nghỉ ở đây sẽ bị lưới gắn cờ `nghi-chua-ky` và
không có hiệu lực. Hồ sơ vẫn hoá cũ trên `main`; lưới trước-merge thu theo diff PR nên nó không
chặn PR nào không chạm nó. Lối ra là của owner: ký hồ sơ rồi cho nghỉ, hoặc veto.
