# Review findings — loi-moi-cong-may-sinh (S4 vòng 1)

Người soi: phiên tươi độc lập, context sạch. Cây: d859a830.

## Đã kiểm

**Cảnh báo cây trôi giữa lượt soi.** Mọi kết luận dưới đây neo vào commit
`d859a830` (bản mà `run-log.jsonl` khai đã chạy 11 eval). Lúc 18:53–18:54 ngày 02/09,
trong khi tôi đang viết hồ sơ này, `git status` của cây thật chuyển từ sạch sang có hai
file SỬA CHƯA COMMIT — `lib/out-of-contract.js` và `scripts/gate-card.js` — do một phiên
khác, nội dung là bản vá cho đúng bốn finding dưới đây (đảo `OOC_NOISE_RE` sang tín hiệu
dương · `ROUTING` bỏ prototype + `hasOwnProperty` · `route(clean(e.type))` lấy khoá TỪ
DỮ LIỆU cho nhóm Treo · thêm `suspect_empty` vào `--extract`). Tôi KHÔNG soi bản vá đó
(nó chưa commit và còn đang đổi) và KHÔNG chạm nó. Người đọc hồ sơ này phải kiểm lại:
bản vá cần chạy đủ lưới + đối chứng dương của riêng nó, và ít nhất một lớp mới đáng ngờ
(`/\*\*/` là tín hiệu «đã thử viết mục» — mục sai khuôn viết KHÔNG có `**` sẽ lại chìm
lặng, tức lỗ fail-quiet đổi hình dạng chứ chưa đóng).

Bản sao đối kháng: `git clone --shared -b feat/loi-moi-cong-may-sinh` ra ba cây rời
(`clone/base`, `c2`, `c3`) — dùng clone thay `git archive` vì LM04 gọi `git -C ROOT
show 69e095e3:…`, cây tar không có `.git` sẽ đỏ vì HẠ TẦNG chứ không vì vật (lớp P150).
Đối chứng dương trên cây nguyên vẹn TRƯỚC mọi đột biến: `node
tests/scripts/gate-card-lmcms.test.mjs` → 25 passed 0 failed; `node
tests/scripts/out-of-contract.test.mjs` → 9 passed 0 failed.

**Mục 1 — từng AC có đường chứng thật.** Đọc `tests/scripts/gate-card-lmcms.test.mjs`
(280 dòng, 25 ca) + `tests/scripts/out-of-contract.test.mjs` (61 dòng, 9 ca) rồi map
ngược lên 8 AC. Kết quả: 2 eval (E9, E10) chỉ khẳng định «suite xanh» — đó là lưới hồi
quy, khai đúng. E8 (AC-8) khai «răng đồng bộ nguồn-bản-chép mở rộng» nhưng `git diff
d859a830~9 d859a830 -- tests/plugins/run-tests.sh` chỉ đổi hàm `norm()` của P150; `grep
-rn "KHỚP TUYỆT ĐỐI\|ghi thẳng\|KHÔNG chờ xác nhận" tests/` = **0 hit**. E3 khai «Chiều
đỏ 2 (ngoài-bảng): tiêm một mục KHÔNG khớp hàng nào của bảng ánh xạ» — ca đó **không tồn
tại** trong file test (LM10b tiêm một eval `judgment`, tức khoá `judgment` CÓ trong bảng).
E1 khai ma trận 4 ô, ô «Cổng 1 có cờ chặn → sửa: ___» không có ca.

**Mục 2 — chín đột biến trên bản sao.** Mỗi dòng: đột biến → kết quả lưới.

| # | Đột biến | Lưới | Thông điệp |
|---|---|---|---|
| M1 | `suspect_empty: false` (gỡ nhánh) | **ĐỎ** 24/25 + 8/9 | LM01 «thieu co: …» + ca `van-xuoi-0-finding-NGO` |
| M2 | `HEAD_NEG_RE` → substring | **ĐỎ** 21/25 (4 ca) | LM04×2 gọi tên `AC-1 roi vao cot KHONG lam`, LM05.4/5 gọi tên vế Then |
| M3 | gỡ vế `gpMode !== 'required'` | **ĐỎ** 24/25 | LM06 `[vang-khi-advisory]` in `roi_bac={"on":true,"reason":"vang"}` |
| M4 | `OOC_GLOSS_NGUOI` → token máy | **ĐỎ** 24/25 | LM09 in got/want từng ký tự |
| M5 | xoá hàng `'*'` của `ROUTING` | **XANH 25/25** | — |
| M5b | `'*': 'hoi'` → `'*': 'bao'` | **XANH 25/25** | — |
| M5c | xoá hàng `ngoai` (giữ `'*': 'hoi'`) | **XANH 25/25** | — |
| M5d | xoá `ngoai` VÀ `'*': 'bao'` | ĐỎ 24/25 | LM10 |
| M6 | HTML Cổng 1 in `one_shot` lệch với `--extract` | **XANH 25/25** | — |
| M7 | xoá hai dòng marker `ONE-SHOT-CMD` (giữ hằng) | **XANH 25/25** | — |
| M8 | gỡ điều khoản AC-8 khỏi `human-facing-language.md` | **XANH — all plugin tests passed** | — |
| M9 | `g1Blocked = false` | **XANH 25/25 và 795/795** (`bash tests/scripts/run-tests.sh`) | — |

Bốn đột biến đề bài yêu cầu (M1–M4) đều đỏ đúng thông điệp. Đột biến thứ năm (M5) và
bốn đột biến tôi tự thêm (M6, M7, M8, M9) đều XANH.

**Mục 3 — AC-1 «đẳng thức TẬP chỗ trống».** LM09 so NGUYÊN chuỗi `one_shot` với một
chuỗi cứng, nên trên fixture đó nó LÀ đẳng thức tập (thừa/thiếu một `___` đều lệch
chuỗi). Nhưng chỉ MỘT điểm dữ liệu: fixture có 3 mục loại-5 (`Ngoài-1`, `Ngoài-2`, `ký
hay trả`) trong đó `Ngoài-1` có khuyến nghị nên được điền — hợp AC-1. Ô ma trận thứ tư
của E1 lại phát biểu «tập ___ bằng ĐÚNG tập loại-5 ∪ chữ quyết», mâu thuẫn với AC-1
(«loại-5 **không có khuyến nghị**» ∪ chữ quyết) — lời eval lệch lời hợp đồng, mã đi theo
hợp đồng. LM10b tăng đúng 1 nên đẳng thức SỐ có canh; đẳng thức TẬP thì không có ca thứ hai.

**Mục 4 — hàng `'*'` của `ROUTING` là mã chết.** `grep -n "route(" scripts/gate-card.js`
→ 5 lời gọi, tất cả literal: `route('ngoai')` `route('judgment')` `route('scope')`
`route('treo')` `route('ky')` — cả 5 khoá đều CÓ trong bảng. Không code path nào gọi
`route()` với giá trị động. M5/M5b/M5c chứng minh: xoá hàng `'*'`, hoặc lật nó về `bao`,
hoặc xoá một hàng thật, lưới đều xanh. Kế hoạch dòng 423 viết rõ: «`route(kind)` PHẢI
được gọi với `kind` suy từ dữ liệu (không literal) để hàng `*` sống — test LM10 tiêm mục
kind lạ qua fixture và đo ĐẦU RA» — bước này không được thi hành.

**Mục 5 — AC-8.** Hợp đồng đã tự khai Known limits cho *hành vi hội thoại*. Nhưng nửa
còn lại (ba nơi khai cùng một luật) được E8 trình như đã đo. M8 chứng ngược: gỡ trọn
điều khoản khỏi NGUỒN luật (`human-facing-language.md`: 0 hit `KHỚP TUYỆT ĐỐI`) trong
khi hai bản chép vẫn giữ (approve.md 1, signoff.md 1) — tức nguồn và bản chép trôi khỏi
nhau tối đa — `bash tests/plugins/run-tests.sh` vẫn in «Results: all plugin tests
passed». Giới hạn đã khai CHƯA đủ: phải khai thêm rằng đồng bộ văn bản ba nơi cũng không
có răng.

**Mục 6 — hồi quy `git diff d859a830~9 d859a830 -- scripts/gate-card.js`** (+174/−59).
Khối `MAY_DI_TIEP` dời chỗ: `awk '/Trạng thái làn V HỎI/,/const chuMDT/'` trên bản cũ và
bản mới → `diff` rỗng, 59 dòng cả hai bên. **Nội dung khối đúng là NGUYÊN VĂN.** Nhưng vị
trí mới nằm TRƯỚC cả `--extract` lẫn nhánh thoát non-approvable, nên hai đường trước đây
không chạy máy quét nay đều chạy: đo trên cùng hồ sơ, `--extract` Cổng 2 đi từ
**0.03s → 0.45s** (~15×; `time node scripts/gate-card.js … --extract` trên cây `d859a830~9`
và cây `d859a830`). Không AC nào phủ, không ca nào canh việc dời.

**Mục 7 — `sweep-baseline.txt`.** Đọc chính ba `review-findings.md` được điểm danh: cả
ba THẬT SAI KHUÔN, kết luận đó ĐÚNG (`duong-do-trong-dinh-nghia-xong:21` «bỏ «metric»
khỏi `_Avoid_`…», `may-ganh-nguoi-quyet:15` «nâng phạm vi sửa ngay»,
`vao-co-o-ra-co-ten:29` «một gạch đầu dòng ở bước 4…» — không chuỗi nào là một trong ba
token). Nhưng dòng «KẾT QUẢ: 3 hồ sơ bật cờ … 0 cờ oan» SAI vì thiếu hai hồ sơ: chạy
`lib/out-of-contract.js` thẳng lên 62 `review-findings.md` của xưởng → `suspect_empty`
bật ở **2 hồ sơ** (`lan-may-song-qua-bo-phan-loai`, `lenh-in-ra-phai-bam-duoc`), cả hai
vắng mặt trong baseline. Baseline không thấy chúng vì `--extract` Cổng 2 **không xuất
trường `suspect_empty`**, mà LM13 chỉ đọc `--extract`. Ca LM13 CÓ bắt được cờ MỚI trên hồ
sơ đã có tên khi cờ đó là `token-la` (thử: phá khuôn `may-ganh-nguoi-quyet` → LM13 FAIL);
nhưng KHÔNG bắt được cờ `suspect_empty` ở bất kỳ hồ sơ nào (thử: ghi
`_acceptance/loi-moi-cong-may-sinh/review-findings.md` toàn văn xuôi → LM13 vẫn PASS).
Thêm: 74/74 hồ sơ xưởng render Cổng 2, mà `roi_bac` là trường Cổng-1 → nhánh
`kinds.add('roi-bac')` của LM13 chưa từng chạy. Tôi tự đo bù bằng cách ép `--gate 1` lên
cả 74 hồ sơ: `roi_bac.on` = **0/74** (hai hồ sơ vắng `gap-probe.md` —
`docs-first-run-audit`, `lenh-tran-tai-lieu-dau-tay` — đều có entry descope nên đúng là
không rơi bậc). Luật rơi bậc KHÔNG đỏ oan trên xưởng thật; điều đó do TÔI đo, không do
lưới của vòng này.

**Mục 8 — mệnh đề trình như đã chứng.** Bốn mệnh đề: (a) E8 «răng đồng bộ mở rộng» —
M8 phản chứng; (b) E3 «chiều đỏ ngoài-bảng» — ca không tồn tại, M5/M5b/M5c phản chứng;
(c) `sweep-baseline` «0 cờ oan» — sai, xem mục 7 và finding AC-5 dưới đây; (d) E1 ô ma
trận «Cổng 1 có cờ chặn» — M9 phản chứng (795/795 xanh khi gỡ trọn `g1Blocked`).

## Trong hợp đồng

- **Cờ oan THẬT trên xưởng: lời khai rỗng hợp lệ bị gọi là sai khuôn.**
  `_acceptance/lan-may-song-qua-bo-phan-loai/review-findings.md` khai mục «Ngoài hợp
  đồng» là «(rỗng — mọi phát hiện ngoài hợp đồng đã đóng ở các vòng sau…)». `node
  scripts/gate-card.js --root . --slug lan-may-song-qua-bo-phan-loai` in nguyên cờ vàng
  `MSG_OOC_SUSPECT`. `OOC_NOISE_RE` (`lib/out-of-contract.js:43`) chỉ nhận «không có» ·
  «n-a» — đó là allowlist trên không gian mở, và xưởng đã có ít nhất ba cách viết
  (`(rỗng)`, `(rỗng — …)`, `(none)`); hai cách kia thoát chỉ nhờ sàn 40 ký tự
  (`SUSPECT_MIN_CHARS`), không nhờ luật. Hợp đồng §Đường đo: «cờ oan = trượt AC-5/AC-6».
  AC: AC-5
- **Bộ đọc thấy cờ, `--extract` không xuất cờ → E11 mù một nửa.**
  `scripts/gate-card.js:792` xuất `out_of_contract: { present, findings, unclassified,
  cluster }` — thiếu `suspect_empty`. LM13 (`tests/scripts/gate-card-lmcms.test.mjs:268`)
  đọc `o.suspect_empty` nên nhánh đó vĩnh viễn false. Chứng: ghi một
  `review-findings.md` văn xuôi cho `loi-moi-cong-may-sinh` (không có tên trong baseline)
  → LM13 vẫn PASS 25/25. Kế hoạch Task 8 Step 1 đã ghi «Extract Cổng 2 phải xuất
  `suspect_empty` + `proposal_raw` … thêm hai trường ở Task 6 nếu chưa» — chỉ
  `proposal_raw` được thêm. AC: AC-5
- **`sweep-baseline.txt` khai thiếu hai hồ sơ và kết luận sai «0 cờ oan».**
  Baseline chỉ liệt ba hồ sơ `token-la`. Đo lại trực tiếp qua `lib/out-of-contract.js`:
  thêm `lan-may-song-qua-bo-phan-loai` (cờ oan, xem trên) và `lenh-in-ra-phai-bam-duoc`
  (thật sai khuôn — dòng tiêu đề `- **… owner chép** (QUICKSTART 11 · …)` có đuôi sau
  `**` nên regex tiêu đề `/^-\s+\*\*(.+?)\*\*\s*$/` không khớp, cả mục thành 0 finding).
  Hợp đồng đòi «danh sách hồ sơ phát sinh cờ phải được ĐỊNH ĐOẠT từng dòng». AC: AC-5
- **Bảng ROUTING không áp vào khối «VIỆC CỦA ANH» in ra — thẻ có hai dòng trả lời đá nhau.**
  `scripts/gate-card.js:936-957` dựng `ymItems`/`ymSlots` ĐỘC LẬP, không gọi `route()`.
  Dựng thẻ trên fixture của LM09: dòng «Trả lời mẫu» in «Ngoài-1: ___; Ngoài-2: ___;
  **cắt/hoãn: ___; Treo: ___**; ký hay trả: ___» (5 ô hỏi, không ô nào điền sẵn) ngay
  trên dòng «Dòng lệnh đã điền sẵn khuyến nghị» có 3 ô hỏi và 2 ô đã điền. AC-3 đòi «số Ô
  HỎI trong «VIỆC CỦA ANH» bằng đúng số mục loại-5 (mục xác-nhận-cắt/hoãn và Treo … thành
  dòng báo, không thành ô hỏi)» — trên thẻ chúng vẫn là ô hỏi. Thước LM10 đo
  `j.routing.hoi` của `--extract`, tức đo trường máy đọc chứ không đo khối AC gọi tên.
  AC: AC-3
- **Hàng mặc định `'*'` của `ROUTING` không có đường chứng — mã chết.**
  `scripts/gate-card.js:102-104`. Năm lời gọi `route()` đều dùng khoá literal có sẵn
  trong bảng, nên `ROUTING['*']` không bao giờ được đọc. M5 (xoá hàng), M5b (lật về
  `bao`), M5c (xoá hàng thật `ngoai`) đều XANH 25/25. AC-3 phát biểu «mục KHÔNG khớp hàng
  nào … render thành Ô HỎI» như một hành vi đã chứng; nó chưa được chứng theo chiều nào.
  Phụ: `ROUTING` là object literal có prototype, nên `route('constructor')` /
  `route('toString')` sẽ trả giá trị kế thừa (truthy, khác `'hoi'`) → rơi về `bao`, đúng
  chiều CẤM — chính lớp lỗi mà comment ở `scripts/gate-card.js:~407` đã gọi tên cho các
  bảng tra khác trong cùng file. AC: AC-3
- **Round-trip HTML↔extract chỉ chứng cho Cổng 2; Cổng 1 không có ca.**
  M6: sửa `scripts/gate-card.js:636` để HTML Cổng 1 in một chuỗi khác `oneShotG1` của
  `--extract` → lưới XANH 25/25. AC-1 đòi câu gộp «cho TỪNG cổng (Cổng 1 lẫn Cổng 2)» và
  AC-2 đòi round-trip; nửa Cổng 1 chưa có thước. AC: AC-2
- **Nhánh «thẻ đang đỏ thì KHÔNG điền sẵn» của Cổng 1 không có răng.**
  M9: `const g1Blocked = false;` (`scripts/gate-card.js:550`) → `gate-card-lmcms` 25/25
  XANH và `bash tests/scripts/run-tests.sh` 795/795 XANH. Nghĩa là thẻ Cổng 1 có cờ đỏ
  (`blindSpot` / răng hỏng / miễn-đo-có-người-dùng) vẫn có thể in `… <slug> duyệt` mà
  không lưới nào bắt — đúng lỗi «mời ký trên thẻ đang đỏ» vòng này sinh ra để chặn. Ô ma
  trận E1 «Cổng 1 có cờ chặn → «sửa: ___»» chưa được thi hành. AC: AC-1
- **AC-8: cả nửa văn bản cũng không có răng, không chỉ nửa hội thoại.**
  M8: gỡ trọn điều khoản «hai nguồn khớp → ghi thẳng, không chờ» khỏi NGUỒN
  (`skills/acceptance/references/human-facing-language.md`) trong khi hai bản chép giữ
  nguyên → `bash tests/plugins/run-tests.sh` vẫn «all plugin tests passed». `grep -rn` cho
  mọi cụm neo của điều khoản trong `tests/` = 0 hit. E8 trình như đã mở rộng răng.
  AC: AC-8
- **Marker `ONE-SHOT-CMD` là trang trí, không phải đường rút.**
  `tests/scripts/gate-card-lmcms.test.mjs:15-19` rút bằng regex `^const <NAME> = '…';`,
  không qua marker. M7: xoá hai dòng marker, giữ hằng → XANH 25/25. AC-1 phát biểu «rút
  từ hằng có marker `ONE-SHOT-CMD`»; bất biến thật đang được giữ là «có hằng cùng tên»,
  yếu hơn lời khai. AC: AC-1

## Ngoài hợp đồng

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Thẻ dạy người trả lời bằng chữ mà chính bộ đọc của thẻ từ chối**
  Người dùng thấy gì: thẻ mời chọn «nâng phạm vi sửa ngay» cho một mục ngoài hợp đồng, nhưng khi người trả lời đúng chữ đó thì vòng sau thẻ lại kêu «đề xuất không đọc được» — đây chính là câu đã nằm sẵn trong một hồ sơ cũ và vừa bị bảng đếm gọi là sai khuôn.
  file: `scripts/gate-card.js:939`
  severity: high
  Đề xuất: new-contract
- **Dựng thẻ chậm hơn mười lăm lần vì một khối bị dời lên trước**
  Người dùng thấy gì: mỗi lần máy hỏi thẻ về một hồ sơ, nó lặng lẽ quét lại toàn bộ xưởng trước khi trả lời; quét trọn xưởng đi từ tức thì thành gần nửa phút, và trên máy chậm hoặc kho lớn có thể chạm trần chờ hai mươi giây cho mỗi hồ sơ.
  file: `scripts/gate-card.js:704`
  severity: medium
  Đề xuất: known-limits
- **Phép so «đường đọc-cũ» mỏng dần mỗi lần thẻ thêm khối mới**
  Người dùng thấy gì: lưới canh «hồ sơ đời cũ vẫn hiện y như trước» đang được nới ra bằng cách bỏ qua thêm bốn dòng mới; một trong bốn chỉ khớp bản «đã điền sẵn», nên hồ sơ nào rơi vào bản «CHƯA điền sẵn được» sẽ làm lưới đỏ vì hạ tầng chứ không vì hồ sơ.
  file: `tests/plugins/run-tests.sh:5832`
  severity: low
  Đề xuất: known-limits
- **Bản quét xưởng bỏ qua im lặng mọi hồ sơ làm bộ dựng thẻ sập**
  Người dùng thấy gì: nếu về sau một hồ sơ khiến bộ dựng thẻ lỗi, bản quét không kêu lên mà lặng lẽ bỏ hồ sơ đó ra khỏi phép đếm — trừ khi hồ sơ ấy đã có tên trong bảng đối chiếu. Hôm nay chưa hồ sơ nào sập nên chưa lộ.
  file: `tests/scripts/gate-card-lmcms.test.mjs:264`
  severity: low
  Đề xuất: known-limits
- **Lời khai đầu file lưới không đúng với chính nội dung lưới**
  Người dùng thấy gì: đầu bộ kiểm ghi rằng mọi chuỗi đối chiếu đều được rút từ mã nguồn chứ không gõ tay, nhưng năm chuỗi mặt người quan trọng nhất vẫn được gõ thẳng vào bài kiểm; ai đọc lời khai đó sẽ tin nhầm là mọi câu chữ trên thẻ đều đã có một-nguồn.
  file: `tests/scripts/gate-card-lmcms.test.mjs:1`
  severity: low
  Đề xuất: wont-fix

## Known limits đề xuất

- **AC-8 không có răng ở CẢ HAI nửa.** Hợp đồng mới khai Known limits cho hành vi hội
  thoại; phải khai thêm: đồng bộ văn bản giữa nguồn luật và hai bản chép approve/signoff
  cho điều khoản MỚI cũng không được canh (M8 xanh trọn suite plugins).
- **AC-3 áp bảng định tuyến chỉ cho `one_shot` + trường `routing`, chưa áp cho khối
  «VIỆC CỦA ANH» thẻ in ra**; hai chỗ hiện đang khai khác nhau (5 ô hỏi vs 3).
- **Hàng mặc định `'*'` của `ROUTING` chưa sống**: mọi lời gọi `route()` là literal, nên
  hành vi «mục ngoài bảng rơi về HỎI» là ý định trong comment, chưa phải hành vi đo được.
- **E11 quét xưởng chỉ chạm nửa Cổng 2** (74/74 hồ sơ có `contract.md` đều render Cổng
  2), nên loại cờ `roi-bac` chưa từng được quét trên xưởng thật; và loại cờ
  `suspect_empty` chưa từng đo được vì `--extract` không xuất trường đó.
- **Round-trip câu gộp chỉ chứng cho Cổng 2**; Cổng 1 hiện dựa vào đọc mã.
- **Treo khó-đảo** (đã khai ở kế hoạch, mục N3): phiên bản này coi mọi Treo là dòng báo
  vì ledger chưa có tín hiệu máy-đọc cho «khó-đảo» — giữ nguyên lời khai đó.
