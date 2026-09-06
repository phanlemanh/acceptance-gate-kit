# Design — thuoc-khai-mot-dang-do-mot-neo (T2)

> Vòng vá hai phép đo, làn bounded. Nguồn: hai finding HIGH «ngoài hợp đồng» của
> S4 vòng 3 hồ sơ `co-qua-timebox-nhom-da-xong` (06/09/2026), owner quyết mở hồ sơ
> vá. Cả hai đã đo lại tay trên `main` sạch trước khi thiết kế.

## Bài toán một câu

Hai phép đo trong kho **tự khai một điều và đo một điều khác**: một cái khai «lane hội
đồng không đổi» nhưng thật ra đo *hình dạng nhánh của tác giả*; một cái khai «ngân sách
3/4/1» nhưng thật ra đo *chữ số có mặt đâu đó trong khối văn bản*. Cái thứ nhất đỏ vĩnh
viễn với mọi người đi sau; cái thứ hai xanh vĩnh viễn kể cả khi vật nó canh đã hỏng.

## Đo trước khi sửa (06/09, `main` tại `5aa7221a`)

**Vật A — `_acceptance/inputs-tinh-tu-goc-kho/rang.sh`, nhóm `lane-doc-khong-doi`.**
`bash … --chan lane-doc-khong-doi` trên `main` sạch: `0 pass, 3 do`. Cả ba ca đỏ, kể cả
**đối chứng dương**: `DO: tập file mã đổi ≠ {feature-loop/scripts/s4-args.mjs}: {}`.
`check_lane` lấy mốc bằng `git merge-base main HEAD`; trên `main` mốc chính là HEAD nên
tập file đổi là rỗng, và `"" != REL_S4` là đỏ không lối thoát. Nhóm này là standing
executor (`_acceptance/config.yaml:218` `itgk_lane_doc_khong_doi`) và là E6 của một hồ sơ
đã ký, nên mọi đợt re-pin về sau đều vấp.

**Vật B — `tests/plugins/run-tests.sh`, khối P86.** Phá thử hai lần trên cây thật:

| Phá gì | P86 nói gì |
|---|---|
| `≤3 lượt/vòng` → `≤9 lượt/vòng` (cả GUIDE + QUICKSTART) | `PASS … ngan sach 3/4/1` |
| xoá hẳn vế `· **mốc phát hành ≤1**` | `PASS … ngan sach 3/4/1` |

Vòng lặp `if so not in khoi` với `so ∈ {"3","4","1"}` chạy trên TOÀN khối; `"3"` luôn có
trong «T3», `"1"` luôn có trong «Gate 1.5». Chỉ số `4` là đỏ được, và đúng một mutant
(`mat ngan sach T3`) chứng cho nó. Câu PASS vẫn tự khai đủ «3/4/1».

## Ba quyết định thiết kế

**D1 · Vật A, vế một «lane hội đồng không đổi»: bất biến SỐNG trên cây hôm nay.**
So `feature-loop/workflows/acceptance-verify.js` tại HEAD với **bản tại mốc đã ký**
`9b3d6f64` (`verified_commit` của hồ sơ `inputs-tinh-tu-goc-kho`). Ai sửa lane hội đồng là
ĐỎ ngay, ở mọi cây, mọi ngày — chiều đỏ sống chứ không phải chứng-một-lần. Đã kiểm 06/09:
hai bản giống hệt, thước xanh. Đây là bánh cóc có chủ ý: đổi lane hợp pháp trong tương lai
thì phải dời mốc trong răng kèm lý do, đúng tiền lệ tree-hash của NOTICE (P196).

**D2 · Vật A, vế hai «tập file mã đổi»: neo KHOẢNG ĐÃ GIAO, và khai thẳng nó là chứng-một-lần.**
Vế này nói về *đợt thay đổi đã giao*, không về cây hôm nay, nên thước trỏ đúng đợt ấy:
`1765b550..9b3d6f64` (`9b3d6f64` = mốc đã ký; `1765b550` = cha thứ nhất của merge commit
`5c15e065` đưa nó vào `main`, tức đúng mốc gộp lúc nhánh còn sống). Đã kiểm: trong khoảng ấy
tập file mã đổi đúng bằng `{feature-loop/scripts/s4-args.mjs}`.

Sự thật phải nói ra, vì phản biện context sạch bắt đúng chỗ này (P0): **với đối số thật, vế
hai cho câu trả lời HẰNG** — nó chỉ còn hai kết cục, xanh hoặc mốc-mất. Đổi một chân đỏ vĩnh
viễn lấy một chân xanh vĩnh viễn thì vẫn là bệnh cũ. Nên: (a) chiều đỏ của vế hai được dựng
trên **kho giả** có khoảng `base..tip` chứa thêm một file mã lạ, chạy qua ĐÚNG chữ ký hàm mà
lời gọi thật dùng; (b) contract khai rõ vế hai là chứng-một-lần + fail-closed; (c) vai canh
gác sống thuộc về vế một ở D1.

**D2b · Mốc mất thì đỏ có tên.** Lịch sử bị viết lại hay clone nông làm hai sha biến mất; ca
ấy phải đỏ và gọi tên sha thiếu, không rơi về xanh.

**D2c · Hai lượt một kết quả.** Nhóm chạy chính nó lần nữa trong một clone `detached` ở
commit khác rồi so hai đầu ra từng byte — bắt đường phụ thuộc HEAD còn sót, thứ mà một lượt
chạy trên một cây không thể thấy.

**D3 · Vật B: trích số từ đúng vế rồi so QUAN HỆ, và IN RA số đã trích.** Mỗi ngôn ngữ
một bộ ba biểu thức bám ngữ cảnh (`≤(\d+) lượt/vòng` · `T3 trần (\d+)` · `mốc phát hành ≤(\d+)`;
bản EN: `≤(\d+) turns per round` · `T3 ceiling (\d+)` · `≤(\d+) turn for a release milestone`).
Vế nào không khớp → đỏ nêu tên vế. Rồi khẳng định quan hệ với bảng cổng nguồn: số lượt
`== len(ids) - 1` (bốn cổng, Cổng Giá trị nằm sau ship) · trần T3 `== số lượt + 1` (thêm
Gate 1.5) · mốc phát hành `== 1`. Bốn mutant mới, mỗi vế một cái, cộng một mutant đổi
bảng cổng mà giữ ngân sách. Mỗi dòng đỏ phải **nêu con số thật đã trích** (`9 != 4 - 1`), và
câu PASS in số từ biến chứ không từ chữ hằng — nếu không, bản vá tái phạm đúng bệnh nó chữa.

## Đụng đâu

- `_acceptance/inputs-tinh-tu-goc-kho/rang.sh` — tách `check_lane` thành hai hàm: vế lane
  (so với mốc ký, sống) và vế tập-file (nhận `repo, base, tip`); ba hằng mốc; ca mốc-mất; ca
  hai-lượt-một-kết-quả; chiều đỏ vế hai dựng trên kho giả đi qua đúng chữ ký hàm.
- `tests/plugins/run-tests.sh` — khối P86: hàm trích số + so quan hệ, thay vòng `in khoi`;
  thêm mutant cho từng vế ngân sách và cho quan hệ bảng-cổng; câu PASS in số THẬT đọc được.
- `_acceptance/config.yaml` — hai khoá mới (`tkm_p86` · `tkm_bay_chan` · `tkm_suite_con_lai`).
  **Không** sinh khoá song song cho nhóm lane: ô đo trỏ thẳng `itgk_lane_doc_khong_doi`, tức
  chính khoá đang đỏ, để lỗi tầng giải-chuỗi không trốn được sau một khoá mới viết đúng.

## Không làm

- Không sửa hợp đồng, bằng chứng hay chữ ký của hồ sơ `inputs-tinh-tu-goc-kho`.
- Không gỡ nhóm `lane-doc-khong-doi` khỏi standing executors — gỡ là mất luôn ca đã đo.
- Không đổi con số ngân sách trong GUIDE/QUICKSTART/README; vòng này sửa THƯỚC, không sửa vật.
- Không đụng năm mutant sẵn có của P86 (bản chép VI/EN, thêm cổng, mất ngân sách T3).

## Rủi ro

- Hằng mốc là ba sha viết trong răng: kho nào clone nông (`--depth`) sẽ không có chúng →
  ca mốc-mất đỏ có tên. Đó là fail-closed cố ý, nhưng CI chạy `fetch-depth: 0` mới xanh.
- P86 sau khi vá đọc dòng ngân sách bằng biểu thức: đổi CÁCH VIẾT dòng đó (không đổi số)
  cũng làm đỏ. Đúng ý — dòng ấy là hợp đồng văn bản giữa ba bản chép.
