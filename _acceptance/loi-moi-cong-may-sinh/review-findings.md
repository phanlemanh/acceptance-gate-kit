# Review findings — loi-moi-cong-may-sinh (S4 vòng 2)

Người soi: phiên tươi độc lập, context sạch. Cây: bf76d74e.

## Đã kiểm

**Bản sao đối kháng.** `git clone --shared -b feat/loi-moi-cong-may-sinh . <tmp>/c1`
→ `git rev-parse HEAD` = `bf76d74ea17c30e78a6fd8c527c77bace09a111e`, `git status
--porcelain` rỗng. Dùng clone chứ không `git archive | tar -x` vì
`tests/scripts/gate-card-lmcms.test.mjs:131` gọi `git -C ROOT show 69e095e3:…` —
cây tar không có `.git` sẽ đỏ vì HẠ TẦNG chứ không vì vật (lớp P150). Cây thật
KHÔNG bị chạm: mọi đột biến chạy trong `c1`, sau mỗi lượt `git checkout -- .` +
kiểm `git status --porcelain` rỗng mới chạy lượt kế; bước tiêm nào không đổi
được dòng nào thì runner tự thoát 9 (chặn lớp «đột biến câm cho màu xanh»).

**Đối chứng dương trên bản nguyên vẹn, TRƯỚC mọi đột biến** — cả bốn suite tôi
tự chạy lại, không tin run-log:
`node tests/scripts/gate-card-lmcms.test.mjs` → **31 passed, 0 failed** ·
`node tests/scripts/out-of-contract.test.mjs` → **9 passed, 0 failed** ·
`bash tests/scripts/run-tests.sh` → **795 passed, 0 failed** (exit 0) ·
`bash tests/hooks/run-tests.sh` → **60 passed, 0 failed** (exit 0) ·
`bash tests/plugins/run-tests.sh` → «all plugin tests passed» (exit 0, **4 phút
36 giây** đo bằng `time`). Lời khai «11 eval exit 0» của run-log vòng 2 ĐỨNG
được. Một chú ý cho người đọc log: `ts` của mỗi dòng là `invokedAt` của lượt gọi
workflow (`feature-loop/workflows/acceptance-verify.js:694,705`), KHÔNG phải giờ
lệnh chạy — ba dòng plugins/hooks/scripts cách nhau 2 giây trong khi suite
plugins ngốn 4,5 phút; đừng đọc `ts` như bằng chứng lệnh đã chạy lúc đó.

**Mười sáu đột biến — 11 ĐỎ, 5 XANH.** Cột «lưới» ghi ca gọi tên, không chỉ mã thoát.

| # | Đột biến | Lưới | Ca / thông điệp |
|---|---|---|---|
| N1 | gỡ `'severity'` khỏi `OOC_ITEM_FIELDS` | **XANH 31/31 + 9/9** | — |
| N2 | gỡ vế `\*\*` khỏi `OOC_TRIED_ITEM_RE` | ĐỎ 30/31 + 8/9 | LM01 + `van-xuoi-0-finding-NGO` |
| N2b | gỡ vế TÊN TRƯỜNG khỏi `OOC_TRIED_ITEM_RE` | **XANH 31/31 + 9/9** | — |
| N3 | `suspect_empty: false` | ĐỎ 29/31 + 8/9 | LM01 · LM13 · `van-xuoi-0-finding-NGO` |
| N4 | gỡ `suspect_empty` khỏi extract Cổng 2 | ĐỎ 30/31 | LM13 «lech baseline» |
| N5 | `g1Blocked = false` | ĐỎ 30/31 | LM16 «the co diem mu van dien san: /acceptance-gate:approve g duyệt» |
| N6 | xoá hàng `'*'` của `ROUTING` | ĐỎ 30/31 | LM18 |
| N7 | `route()` về `ROUTING[kind] \|\| ROUTING['*']` + bảng CÓ prototype | **XANH 31/31** | — |
| N8 | `routingBao` luôn rỗng | ĐỎ 28/31 | LM10 · LM18 · LM19 |
| N10 | xoá hai dòng marker `ONE-SHOT-CMD` (giữ hằng) | ĐỎ 30/31 | LM14 |
| N11 | HTML Cổng 1 in `one_shot` + đuôi lạ | **XANH 31/31** | — |
| N11b | HTML Cổng 1 in tên lệnh THIẾU tiền tố plugin | ĐỎ 30/31 | LM15 |
| N12 | gỡ điều khoản AC-8 khỏi NGUỒN (giữ 2 bản chép) | ĐỎ 30/31 | LM17, nêu đúng đường dẫn nguồn |
| N12b | ĐẢO NGHĨA điều khoản ở bản chép `approve.md` («ghi thẳng» → «VẪN CHỜ XÁC NHẬN») | **XANH 31/31** | — |
| N13 | `scope: 'bao'` → `'hoi'` | ĐỎ 30/31 | LM10 |
| N14 | `ngoai: 'hoi'` → `'bao'` (chiều CẤM: nuốt quyết định) | ĐỎ 29/31 | LM10 · LM19 |

Bốn đột biến vòng 1 từng XANH nay ĐỎ (N5=M9, N6=M5, N10=M7, N12=M8) và một
đột biến vòng 1 nay ĐỎ theo chiều mạnh hơn (N11b thay M6). Năm XANH còn lại là
nội dung mục «Trong hợp đồng» bên dưới.

**Quét TRỌN xưởng (E11 / giả định sinh tử 3).** `_acceptance/` có 91 thư mục,
63 hồ sơ có `review-findings.md`, 74 hồ sơ có `contract.md`; **0 hồ sơ có
`review-findings.md` mà thiếu `contract.md`** — phép quét không bỏ sót ai vì
điều kiện lọc. Chạy `lib/out-of-contract.js` THẲNG lên 63 file (không qua thẻ):
đúng **4 hồ sơ bật cờ**, khớp TRỌN bốn dòng `sweep-baseline.txt`, không thừa
không thiếu. Tôi đọc lại từng file để tự kết luận, không chép baseline:
`lenh-in-ra-phai-bam-duoc` dòng tiêu đề `- **… owner chép** (QUICKSTART 11 · …)`
có đuôi sau `**`, mục thiếu hẳn `file:`, reader ra 0 finding — **sai khuôn
THẬT**; ba hồ sơ `token-la` (`duong-do-…`, `may-ganh-…`, `vao-co-o-…`) mang câu
văn mô tả cách sửa ở trường `Đề xuất` — **sai khuôn THẬT**.
`lan-may-song-qua-bo-phan-loai` («(rỗng — mọi phát hiện … đã đóng ở các vòng
sau…)») nay KHÔNG còn bật cờ: **cờ oan vòng 1 đã đóng**. **0 cờ oan mới.**

**Bộ dựng thẻ có sập lặng không.** Chạy `gate-card.js --extract` lên cả 74 hồ sơ
có `contract.md`: **0 hồ sơ exit≠0, 0 hồ sơ JSON hỏng**. Nhánh bỏ-qua-im-lặng
của LM13 (`if (r.status !== 0) continue` · `catch { continue }`,
`tests/scripts/gate-card-lmcms.test.mjs:277,279`) vẫn còn nguyên nhưng hôm nay
chưa nuốt hồ sơ nào. Cùng lượt: **74/74 hồ sơ render Cổng 2, 0 hồ sơ Cổng 1**,
nên nhánh cờ `roi-bac` của LM13 CHƯA TỪNG chạy trên xưởng thật (y như vòng 1).

**Dòng mẫu trên THẺ vs `routing.hoi` của `--extract`, trên hồ sơ THẬT.** Neo vào
dòng cuối khớp `Trả lời mẫu \(một dòng, điền vào chỗ trống\): «…»` (dùng dòng
ĐẦU TIÊN thì hai hồ sơ thật lệch giả — xem mục ngoài hợp đồng). Kết quả:
**73/73 hồ sơ ký-được KHỚP tuyệt đối**, 0 lệch. Hình dạng đã chạm: `0 mục ngoài
hợp đồng` 24 hồ sơ · `0 Treo` 8 hồ sơ · `có đủ ba nhóm` 49 hồ sơ · làn V
`machine-cleared` 2 hồ sơ (`release-2-0-0`, `release-2-1-0`: đúng 1 ô hỏi «veto
hay để yên», cắt/hoãn + Treo điền sẵn trong dòng lệnh). Hình dạng KHÔNG khớp:
**REJECT/chưa-ký-được** — xem finding AC-3 thứ hai. Hình dạng `0 mục cắt/hoãn`
không tồn tại trong xưởng (74/74 đều có), nên chỉ được chạm bằng fixture.

**Hiệu năng — vá «chỉ quét khi ký được» cắt được đúng nửa đường ÍT DÙNG.**
`time node scripts/gate-card.js --root . --slug <s> --extract`, 3 lượt mỗi ca:
hồ sơ **approvable** (`context-ladder`) **0,45s / 0,34s / 0,34s**; hồ sơ **chưa
ký được** (`loi-moi-cong-may-sinh`) **0,02s ×3**; Cổng 1 **0,02s ×3**. Tức
`start-scan` bị cắt đúng ở nhánh REJECT/BLOCKED, còn ĐƯỜNG THƯỜNG DÙNG — thẻ
Cổng 2 của một hồ sơ ký được, chính lúc người sắp bị mời — vẫn ~15× chậm hơn
trước khi khối bị dời (0,02s → 0,34s). Không phải hồi quy mới; là phần chưa
đóng của mục ngoài-hợp-đồng vòng 1.

**Mệnh đề trình như đã chứng.** (a) `evals.yaml` E3 «Chiều đỏ 2 (ngoài-bảng)» —
NAY CÓ (LM18, N6 đỏ), khai đúng. (b) E1 ô ma trận «Cổng 1 có cờ chặn» — NAY CÓ
(LM16, N5 đỏ), khai đúng. (c) E8 «răng đồng bộ nguồn-bản-chép mở rộng» — CÓ
răng SỰ CÓ MẶT (N12 đỏ) nhưng KHÔNG có răng CÙNG-MỘT-LUẬT (N12b xanh); lời khai
còn rộng hơn vật. (d) Chú giải trong `lib/out-of-contract.js:53-54` khai «ca
`tests/scripts/out-of-contract.test.mjs` đối chiếu lại với marker
`OOC-ITEM-TEMPLATE` … để hai bên không trôi khỏi nhau» — `grep -rn
OOC_ITEM_FIELDS tests/` = **0 hit**, ca đó KHÔNG TỒN TẠI (N1 xanh). (e) E11
«không cờ oan» — ĐÚNG, tôi đo lại độc lập ở trên.

## Trạng thái 9 finding vòng 1

| # | Tóm tắt | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 1 | Cờ oan thật: lời khai rỗng hợp lệ bị gọi sai khuôn (AC-5) | **ĐÓNG** | Quét lại 63 file: `lan-may-song-qua-bo-phan-loai` sạch; 4/4 hồ sơ bật cờ đều sai khuôn thật, 0 cờ oan |
| 2 | `--extract` không xuất `suspect_empty` → E11 mù nửa (AC-5) | **ĐÓNG** | N4 (gỡ trường) → ĐỎ ở LM13 |
| 3 | `sweep-baseline.txt` thiếu 2 hồ sơ, kết luận sai «0 cờ oan» (AC-5) | **ĐÓNG** | Baseline nay 4 dòng; quét độc lập của tôi ra ĐÚNG 4 hồ sơ đó, từng dòng tự kiểm lại bằng cách đọc file gốc |
| 4 | Bảng ROUTING không áp vào khối «VIỆC CỦA ANH» — hai dòng đá nhau (AC-3) | **ĐÓNG** | N8 → ĐỎ ở LM10+LM18+LM19; dòng mẫu trên thẻ khớp `routing.hoi` 73/73 hồ sơ thật. Phần Ngoài-N còn lệch là hệ quả cố ý của AC-1 — khai ở Known limits |
| 5 | Hàng `'*'` của `ROUTING` là mã chết (AC-3) | **ĐÓNG MỘT NỬA** | Hàng nay SỐNG (N6 → ĐỎ ở LM18). Nhưng nửa prototype KHÔNG có răng (N7 xanh), và cách làm nó sống đẻ hồi quy trên xưởng thật — xem finding AC-3 thứ nhất |
| 6 | Round-trip HTML↔extract chỉ chứng cho Cổng 2 (AC-2) | **ĐÓNG MỘT NỬA** | LM15 tồn tại và bắt được lớp thật (N11b → ĐỎ). Nhưng phép so là `includes`, không phải đẳng thức: N11 (thêm đuôi) XANH |
| 7 | Nhánh «thẻ đang đỏ thì KHÔNG điền sẵn» Cổng 1 không có răng (AC-1) | **ĐÓNG** | N5 → ĐỎ ở LM16, đúng thông điệp, có đối chứng dương trong chính ca (thẻ sạch phải kết bằng «duyệt») |
| 8 | AC-8 cả nửa văn bản cũng không có răng (AC-8) | **ĐÓNG MỘT NỬA** | N12 (gỡ khỏi nguồn) → ĐỎ ở LM17 ở cả ba nơi. Nhưng N12b (đảo NGHĨA ở bản chép) XANH — LM17 đo từ vựng, không đo quan hệ |
| 9 | Marker `ONE-SHOT-CMD` là trang trí (AC-1) | **ĐÓNG** | N10 (xoá marker, giữ hằng) → ĐỎ ở LM14 «gate-card.js thieu khoi marker ONE-SHOT-CMD» |

Sáu ĐÓNG, ba ĐÓNG MỘT NỬA. Không finding nào của vòng 1 còn nguyên vẹn.

## Trong hợp đồng

- **Bảng định tuyến lấy khoá loại-entry từ THIẾT KẾ chứ không từ DỮ LIỆU — hai
  hồ sơ thật vừa mọc thêm một câu hỏi cho người.**
  `scripts/gate-card.js:105-112` khai bốn loại entry sổ (`descope · approach ·
  fix · revisit`); sổ quyết định của xưởng thật đang dùng **11 loại**
  (`decision` 15 · `seal` 70 · `descope` 146 · `approach` 247 · `fix` 301 ·
  `revisit` 89 · `gate0` 3 · `assumption` 1 · `scope` 10 · `approve` 3 · `gate2`
  1). Trong nhóm Treo (`decsProvisional`) của 74 hồ sơ có `decision` 10 ·
  `approve` 3 · `gate2` 1 — ba loại NGOÀI bảng, và luật «một loại lạ kéo cả
  nhóm về Ô HỎI» làm cả nhóm Treo của `ra-co-ten-lam-va-trao` và `release-2-2-0`
  đổi từ dòng báo sang ô hỏi. Đo bằng vi phân trên hai cây: `node
  <d859a830>/scripts/gate-card.js --root . --slug release-2-2-0 --extract` →
  `bao:["cắt/hoãn","Treo"]`; cùng lệnh trên `bf76d74e` →
  `hoi:[…,"Treo","ký hay trả"]`. Đây KHÔNG phải «schema đời sau, người gõ tay»
  như chú giải nói — đó là từ vựng thường ngày của chính kho này, tức lại là
  **allowlist trên không gian mở**, đúng lớp lỗi mà vòng 1 vừa bắt ở
  `OOC_NOISE_RE` và bản vá vừa đảo chiều để tránh. Hậu quả rơi thẳng vào Đường
  đo của hợp đồng («≤3 lượt gọi người/vòng, ≤1 chạm/lượt»). E11/LM13 chỉ đối
  chiếu CỜ VÀNG, không đối chiếu `routing`, nên không lưới nào bắt việc này.
  AC: AC-3
- **Tín hiệu «đã thử viết mục» có hai vế, chỉ một vế có răng — và chú giải khai
  có một ca đối chiếu không tồn tại.**
  `lib/out-of-contract.js:58` dựng `OOC_TRIED_ITEM_RE` từ HAI vế: `**` và tên
  trường của `OOC_ITEM_FIELDS`. Vế tên-trường chính là thứ vòng 1 cảnh báo là
  còn hở, và nó CHẠY đúng (mục thiếu hẳn dấu đậm nhưng có `Người dùng thấy gì:`
  → `suspect_empty=true`, tôi thử trực tiếp qua `ooc.parse`). Nhưng nó không có
  thước: N1 (gỡ `'severity'` khỏi `OOC_ITEM_FIELDS`) và N2b (gỡ TRỌN vế
  tên-trường) đều XANH 31/31 + 9/9. Ma trận 7 ô của
  `tests/scripts/out-of-contract.test.mjs` không có ô nào cho mục thiếu `**`.
  Nặng hơn: chú giải `lib/out-of-contract.js:53-54` khai «ca
  `tests/scripts/out-of-contract.test.mjs` đối chiếu lại với marker
  `OOC-ITEM-TEMPLATE` trong `acceptance-verify.js` để hai bên không trôi khỏi
  nhau» — `grep -rn "OOC_ITEM_FIELDS" tests/` = 0 hit; ca đó chưa từng được
  viết, nên bốn tên trường ở bên ĐỌC và khuôn ở bên VIẾT đang trôi tự do.
  AC: AC-5
- **Răng AC-8 đo TỪ VỰNG, không đo QUAN HỆ — một bản chép nói ngược lại nguồn
  vẫn xanh.**
  `tests/scripts/gate-card-lmcms.test.mjs:319-327` (LM17) kiểm ba nơi bằng hai
  vị từ có mặt: `/hai nguồn[\s\S]{0,120}khớp tuyệt đối/i` và `/ghi thẳng/`. N12b
  đổi `commands/approve.md:47-48` từ «→ ghi thẳng rồi hiển thị lại» thành «→ VẪN
  CHỜ XÁC NHẬN rồi hiển thị lại» — tức bản chép khai NGƯỢC hẳn luật của nguồn —
  lưới XANH 31/31, vì `ghi thẳng` còn khớp một chỗ khác trong cùng file (`grep
  -c "ghi thẳng" commands/approve.md` = 2). AC-8 đòi «cả ba khai CÙNG MỘT luật»;
  thước đang giữ mệnh đề yếu hơn: «cả ba có mặt hai cụm chữ».
  AC: AC-8
- **Round-trip Cổng 1 là phép CHỨA, không phải đẳng thức.**
  `tests/scripts/gate-card-lmcms.test.mjs:299-303` (LM15) dùng
  `html.includes(j.one_shot)`. N11 (thẻ in `${esc(oneShotG1)} XXLECH`, tức HTML
  mang một chuỗi KHÁC extract) → XANH 31/31. Lớp nặng vẫn bị bắt (N11b viết lại
  tên lệnh → ĐỎ), nhưng mọi kiểu trôi bằng THÊM ĐUÔI/THÊM ĐẦU đều lọt, và đó là
  hình dạng dễ xảy ra nhất khi ai đó nối thêm chú thích vào dòng lệnh. AC-2 đòi
  «chứa ĐÚNG chuỗi `one_shot`»; phép so nên là đẳng thức trên cụm đã rút.
  AC: AC-2
- **Thẻ chưa-ký-được: máy đọc thấy 6 ô hỏi, người đọc thấy «không cần làm gì».**
  Trên `loi-moi-cong-may-sinh` (verdict chưa có, `approvable=false`),
  `--extract` trả `one_shot: null` nhưng `routing: {hoi:["Ngoài-1"…"Ngoài-5","ký
  hay trả"]}` — sáu mục; trong khi thẻ HTML in khối «VIỆC CỦA ANH» đúng một câu
  «không cần làm gì … thẻ này chỉ báo trạng thái»
  (`scripts/gate-card.js:818-833`). Hai mặt đọc của cùng một thẻ khai khác nhau
  về số việc của người — chính thứ AC-3 («số Ô HỎI … bằng đúng số mục loại-5»)
  và nếp một-nguồn sinh ra để chặn. Phụ: từ khi có `if (approvable)` ở
  `scripts/gate-card.js:731`, nhãn cuối của nhánh chưa-ký-được LUÔN là «ký hay
  trả» dù hồ sơ có đi làn V, tức khôi phục đúng sự bất đối xứng mà chú giải
  `:715-717` nói bản vá dời khối để xoá. LM12 chỉ kiểm `one_shot === null`, không
  kiểm `routing`. AC: AC-3

## Ngoài hợp đồng

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hỏi thẻ về một hồ sơ vẫn kéo theo một lượt quét trọn kho**
  Người dùng thấy gì: mỗi lần máy dựng thẻ Cổng 2 cho một hồ sơ còn ký được — đúng lúc người sắp được mời quyết — nó vẫn lặng lẽ quét lại toàn bộ kho trước khi trả lời, mất khoảng một phần ba giây thay vì tức thì; bản vá chỉ bỏ được lượt quét đó ở những hồ sơ đang đỏ, tức đúng những hồ sơ không mời ai cả.
  file: `scripts/gate-card.js:731`
  severity: medium
  Đề xuất: known-limits
- **Bản quét xưởng vẫn bỏ qua im lặng mọi hồ sơ làm bộ dựng thẻ sập**
  Người dùng thấy gì: nếu về sau một hồ sơ khiến bộ dựng thẻ lỗi, bản quét không kêu lên mà lặng lẽ bỏ hồ sơ đó ra khỏi phép đếm. Hôm nay đo được 0 trên 74 hồ sơ sập nên chưa lộ; vòng 1 đã nêu và bản vá không chạm.
  file: `tests/scripts/gate-card-lmcms.test.mjs:277`
  severity: low
  Đề xuất: known-limits
- **Phép so hai dòng trả lời bám nhầm dòng khi hồ sơ nhắc tới chính cái tên đó**
  Người dùng thấy gì: bài kiểm canh «dòng mẫu trên thẻ khớp danh sách việc của người» đi tìm cụm chữ đầu tiên trùng tên trên thẻ; hai hồ sơ thật trong kho có nhắc đúng cụm đó trong phần mô tả lỗi, nên nếu bài kiểm chạy trên hồ sơ thật nó sẽ đo nhầm một đoạn văn thay vì dòng trả lời. Hôm nay nó chỉ chạy trên hồ sơ dựng sẵn nên chưa lộ.
  file: `tests/scripts/gate-card-lmcms.test.mjs:341`
  severity: low
  Đề xuất: known-limits
- **Một bảng tra đang giữ hai không gian tên khác nhau, và chúng đã chạm nhau**
  Người dùng thấy gì: bảng quyết định «mục nào hỏi người, mục nào chỉ báo» nay chứa lẫn hai loại khoá — tên khối trên thẻ và tên loại ghi trong sổ quyết định — và cả hai đều có một khoá tên «scope». Đổi cách xử lý phần cắt/hoãn sẽ âm thầm đổi luôn cách xử lý các dòng sổ mang loại đó.
  file: `scripts/gate-card.js:105`
  severity: low
  Đề xuất: new-contract

## Known limits đề xuất

- **Tín hiệu «đã thử viết mục» chỉ bắt được mục CÓ dấu đậm hoặc CÓ tên trường.**
  Một mục viết hoàn toàn bằng văn xuôi (không `**`, không tên trường nào của
  khuôn) vẫn chìm lặng: `ooc.parse` trả `suspect_empty=false`, tôi thử trực
  tiếp. Đó là cái giá đã trả để bỏ cờ oan — nên khai, đừng để nó im.
- **AC-8 chỉ có răng SỰ CÓ MẶT ở ba nơi, không có răng CÙNG-MỘT-LUẬT** (N12b
  xanh). Giữ nguyên lời khai cũ về nửa hành vi hội thoại, thêm nửa này.
- **E11 quét xưởng vẫn chỉ chạm Cổng 2**: 74/74 hồ sơ render Cổng 2, nên loại cờ
  `roi-bac` chưa từng được quét trên xưởng thật (đo lại vòng này: 0/74).
- **Hình dạng «hồ sơ không có mục cắt/hoãn» không tồn tại trong xưởng** (74/74
  đều có), nên nhánh đó chỉ được chạm bằng fixture, không có điểm dữ liệu thật.
- **Thẻ Cổng 2 cố ý in HAI dòng trả lời với hai bộ chỗ trống khác nhau** cho các
  mục Ngoài-N: dòng mẫu để trống (vì chúng là loại-5, theo AC-3), dòng lệnh điền
  sẵn khuyến nghị (vì máy CÓ khuyến nghị, theo AC-1). Đây là hệ quả trực tiếp
  của hai AC cùng lúc, không phải lỗi — nhưng người đọc thẻ thấy hai dòng nói
  khác nhau, nên phải khai.
- **`ts` trong `run-log.jsonl` là giờ gọi workflow, không phải giờ lệnh chạy**
  (`acceptance-verify.js:694,705`) — đừng dùng nó làm bằng chứng «suite đã chạy
  lúc đó»; vòng này tôi tự chạy lại cả bốn suite thay vì tin log.
- **Treo khó-đảo**: giữ nguyên lời khai vòng 1 — ledger chưa có tín hiệu máy-đọc
  cho «khó-đảo» nên mọi Treo được coi là dòng báo (trừ khi loại entry ngoài
  bảng, và đó chính là finding AC-3 thứ nhất).
