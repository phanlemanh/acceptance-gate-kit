---
schema_version: 1
feature: Phát hành kit 2.13.0 — đóng số cho cửa sổ 2.12→2.13, cắt số HAI gói có đổi cộng đúng MỘT nhát vá (P93 quét cây nguồn), và là mốc đầu tiên đếm đủ NĂM dòng số.
slug: release-2-13-0
owner: phanlemanh@gmail.com
risk_tier: T2               # chạm hai manifest + tests/plugins/run-tests.sh; KHÔNG chạm t3_paths (hooks, lib, pre-merge, recheck). T2 nên làn V mở.
surfaces: [cli]
status: signed-off
approved_by: Mạnh
approved_at: 2026-09-14
---

# Acceptance Contract: release-2-13-0

## Context

Cửa sổ 2.12 → 2.13 có đúng MỘT vòng (luật (b)): `khoi-tim-loi-tra-phi-theo-vat`, đã ship
và ký 14/09. Nó đổi thật hai gói: `feature-loop` (workflow chấm, bộ sinh args, carry-plan,
wf-usage, SKILL) và `acceptance-gate` (`scripts/gate-card.js`). Gói `diagram-design` không
đổi dòng nào. Vì thế mốc này KHÔNG «thuần cắt số» như 2.12.0: hai gói lên số, một gói giữ.

Owner chốt ở S1 (14/09): cắt số + vá riêng MỘT nhát là P93. Lý do chọn đúng nhát ấy trong
bảy mục tồn đọng: hình dạng «hạ tầng tự sinh tín hiệu đỏ» của P93 đã đếm SÁU lần qua bốn
cửa sổ — 2.12.0 gọi tên ở lượt chấm 4 và 5 của chính nó và mô tả cơ chế; lượt chấm 4 của
vòng token đỏ cùng chữ ký, không tái hiện được, đốt một lượt. Phát hiện lúc thiết kế: chiều
đỏ hiện có của P93 chạy trên bản sao `rsync` không phải kho git, nên nhát vá KHÔNG thể chỉ
đổi hàm quét sang tệp-git-theo-dõi; nó phải làm bản sao thành kho git trước, để một vị từ
duy nhất phục vụ cả chiều nhạy lẫn chiều im.

Đây là mốc ĐẦU TIÊN đếm đủ năm dòng số của luật (c) (3 → 5, owner quyết 14/09).

## Criteria

### AC-1 (cắt số) — MỘT số, nhất quán ở mọi bề mặt người dùng đọc, cho HAI gói có đổi

**Given** cây tại HEAD của hồ sơ mốc
**When** chạy `rang-p200.sh` của hồ sơ này (bọc ca thường trực `P200`)
**Then** hai plugin `acceptance-gate` và `feature-loop` cùng mang MỘT số; số hợp semver;
`GUIDE.md` dẫn xuất số ĐÓ từ manifest chứ không gõ tay; mục mô tả của số đó nói người
dùng nhận gì; `feature-loop` tự khai cặp `acceptance-gate >= <số đó>`. Chỉ HAI manifest
đổi — `diagram-design` không nằm trong vế này (AC-2 giữ nó).

*Vế GIÁ TRỊ («số đó là 2.13.0») là điều-chỉ-người-biết, đúng tiền lệ 2.12.0:* máy giữ vế
QUAN HỆ (một số, nhất quán, dẫn xuất được), owner xác nhận MỘT dòng trên thẻ ở Cổng Bằng
chứng. Không ghim literal vào răng để hồ sơ đã ký không đỏ giả ở mọi HEAD sau.

### AC-2 (không cắt số thừa) — `diagram-design` không đổi KỂ TỪ lần cắt số của chính nó, đo được và KHÔNG fail-open

**Given** `diagram-design/` không đổi dòng nào trong cửa sổ
**When** chạy `rang-moc.sh --chan diagram` của hồ sơ này (bản CHÉP nguyên thân từ 2.12.0)
**Then** răng xanh vì ĐO chứ không vì thiếu vật: mốc so là lần cắt số gần nhất của chính
`diagram-design`, suy từ kho; cửa sổ mốc..HEAD không rỗng; pathspec còn khớp vật. Mã thoát
riêng cho từng lối hỏng giữ nguyên bản 2.12.0 (2 · 3 · 4 · 5 · 6 · 8). Vế giá trị `2.7.0` là
điều owner xác nhận trên thẻ, máy giữ vế «không đổi kể từ lần cắt số của chính nó».

### AC-3 (không hồi quy) — bốn suite và bản đồ sản phẩm XANH tại HEAD của mốc

**Given** cây tại HEAD sau khi cắt số và vá P93
**When** chạy `tests/scripts` · `tests/hooks` · `tests/plugins` · `tests/workflows` và
`product-map.mjs --root . --check`
**Then** cả năm thoát 0, VÀ suite plugins chạy KHÔNG ÍT HƠN 266 ca (sàn đo 14/09 trên cây
lành trước nhát vá, so một phía nên thêm ca không làm đỏ).

**Vì sao mốc này cần vế số ca mà 2.12.0 không cần:** 2.12.0 không chạm tệp ca nào; mốc này
SỬA chính `tests/plugins/run-tests.sh`. Suite ấy kết bằng một câu KHÔNG kèm số và biến đếm
duy nhất của nó là `failures` — nên một sửa đổi làm bảng khối gãy giữa chừng vẫn cho suite
in đúng câu ấy và thoát 0, trong khi hàng chục khối phía sau IM LẶNG không chạy, và AC-3
«không hồi quy» được ký trên một lưới rỗng. `ONLY_BLOCK` của AC-5 không bịt lỗ này: nó chỉ
chứng minh riêng khối P93 còn sống. Phản biện context sạch bắt (P1, 14/09).

### AC-4 (hồ sơ mốc) — bốn khối bắt buộc trong Notes, năm dòng số là VĂN ĐẾM TAY có nguồn rút

**Given** `## Notes` của hợp đồng này
**When** hội đồng đọc ở Cổng Bằng chứng
**Then** có đủ bốn khối và mỗi khối mang số THẬT, không tiêu đề suông: (1) NĂM dòng số của
luật (c) — lần đầu đủ năm; (2) bảng lớp vendored với +/− đo tại sha nêu tên; (3) lớp lỗi tái
phát gọi tên kèm dẫn chứng; (4) nhát cắt kế gọi tên cho cửa sổ 2.14. Khối nào cố ý để trống
phải khai lý do.

**Năm dòng số là VĂN ĐẾM TAY khai thẳng trong Notes, mỗi ô ghi nguồn rút — KHÔNG dựng
eval máy chấm chúng.** 2.12.0 từng dựng một eval như thế ở lượt chấm 1 rồi phải gỡ ở lượt
2, và tự gọi đó là bài học đắt nhất của hồ sơ. Eval của AC này (E4, judgment) chỉ hỏi ba
điều: khối có mặt · ô có số · ô có nguồn rút; nó KHÔNG tính lại số. Khối 1 phải nói rõ hai
dòng máy đo (token · phút) lấy từ `usage-report.md` của vòng nào, và ba dòng đếm tay dùng
phương pháp nào — kèm giới hạn đã biết của phương pháp đếm lượt gọi người: một chữ «Ký» sinh
nhiều entry sổ, nên «cận dưới» đọc từ sổ cao hơn số thật (vòng token: 15 so với 4 đếm tay).

### AC-5 (nhát vá) — P93 đo cây NGUỒN, không đo kiểm kê tệp của cây làm việc; hai chiều trên cùng fixture

**Given** ca thường trực `P93` trong `tests/plugins/run-tests.sh`, hàm quét hiện đi trọn
cây làm việc bằng `rglob` với mẫu bắt-tất-cả
**When** hàm quét đổi sang liệt kê tệp git theo dõi, VÀ bản sao mà chiều đỏ nội tại của P93
dựng bằng `rsync` được khởi tạo thành kho git (init + add) trước khi tiêm — một vị từ cho cả
hai chiều
**Then** hai chân của `rang-p93.sh` chạy trên CÙNG một bản sao git mang CÙNG một vật, khác
nhau ĐÚNG MỘT BIẾN — fixture có vào index hay không: `--chan im` (không add) → P93 IM, đúng
một dòng PASS của chính nó; `--chan do` (có add) → P93 ĐỎ với thông điệp ghim «cap marker
HFL-LAW-TABLE co 3 khoi». Đối chứng dương cho cả hai: bản sao mang vật mà chưa có fixture
phải in đúng một dòng PASS. Fixture rút từ khối marker trong tệp luật, không gõ tay. Chiều
đỏ nội tại của P93 (ba chỗ tiêm vào bản sao rsync) vẫn bắt được, chứng bằng chính P93 xanh
trong AC-3.

**Vì sao phải CÙNG bản sao và CÙNG vật.** Bản đầu cho `--chan do` clone HEAD trong khi
`--chan im` chạy cây làm việc. Hai hệ quả, phản biện context sạch gọi tên (P0, 14/09): nếu
nhát vá còn ở cây làm việc thì bản sao quét bằng mã CŨ, và vì P93 đếm cặp marker bất kể
tracked-ness, chân `do` XANH trên cả mã cũ lẫn mã mới — một chân HẰNG ĐÚNG, phép vi phân
rỗng. Nay răng chép vật từ cây làm việc vào bản sao và KHẲNG ĐỊNH hai băm bằng nhau (lệch
thì thoát 2, không đoán), rồi in dấu vật lên dòng PASS của cả hai chân để bằng chứng tự
phân biệt được bản.

**CHIỀU ĐỎ ĐÃ CHẠY THẬT, trước nhát vá, tại S1 ngày 14/09** — không phải lời hứa đo sau:
`--chan im` thoát **3** với dòng nguyên văn «DO: P93 DO vi mot tep KHONG theo doi trong ban
sao — phep quet van do cay LAM VIEC, khong do cay NGUON (vat 40b91d6c)». Dấu vật `40b91d6c`
là băm của tệp suite TRƯỚC vá; sau vá dấu ấy phải khác. Không có lượt đỏ này thì E5a xanh
không phân biệt được «đã vá» với «chưa bao giờ tiêm được».

**Giới hạn khai trước:** sau khi vá, một tệp nguồn MỚI chưa add/commit mang cặp marker
trùng là vô hình với P93 cho tới khi vào index. Chấp nhận được vì lưới trước-merge chạy trên
cây đã commit; ghi ở Known limits khi ký. **Ranh giới với luật (a) «bộ đo được máy kiểm MỘT
tầng»:** chân `im`/`do` là cặp sinh hai-chiều của một phép đo ĐANG SỬA (MEASURE-BIRTH-
CLAUSE), không phải phép đo mới đo thước của thước; hồ sơ không mở vòng nào cho lớp đó.

## Coverage

Hai trục kế thừa từ lần quét `morphological-scan` (preset test-matrix) của 2.12.0, thêm một
giá trị VẬT cho nhát vá. Không gian Core = 10 ô.

| Trục | Giá trị |
|---|---|
| VẬT bị đo | manifest hai gói đổi · `diagram-design/` · `GUIDE.md` · bốn suite + bản đồ + SỐ CA của suite plugins · hồ sơ mốc · hàm quét của P93 |
| CHIỀU | xanh (số nhất quán / P93 im đúng) · đỏ (số lệch / có đổi mà giữ số / P93 đỏ đúng thông điệp) · không-đo-được (vật vắng, hạ tầng hỏng, mã thoát riêng) |

Ô Core có AC phủ: một số nhất quán hai gói (AC-1) · không đổi kể từ lần cắt số của chính nó
(AC-2) · hồi quy bốn suite VÀ số ca không giảm (AC-3) · hồ sơ mốc đủ bốn khối, năm dòng số
đếm tay (AC-4) · P93 im khi fixture ngoài index, đỏ khi vào index, cùng bản sao cùng vật (AC-5).

Ô Never: «số đã tăng so với base» — trừ khỏi P200 từ 18/08, lý do ở 2.12.0. Ô Never mới:
P93 bắt tệp nguồn CHƯA add — khai giới hạn ở AC-5, không đo.

[CE chưa kiểm chứng] — không có.

## Đường đo

Hồ sơ mốc không có `opportunity.md`; bảng này đo GIÁ TRỊ của mốc theo cách 2.12.0 làm.

**Đo được TẠI mốc** (thuộc hồ sơ này):

| Trục | Trước mốc | Sau mốc |
|---|---:|---:|
| Số lần P93 đỏ vì tệp nháp trong lượt chấm của chính mốc | có thể (lớp đếm 6) | 0, có răng chiều im |
| Gói mang số mới | 0 trên 2 | 2 trên 2 |
| `diagram-design` | 2.7.0 | 2.7.0, có răng |

**Chỉ đo được SAU khi kho tiêu thụ nhận 2.13.0** (KHÔNG thuộc bằng chứng của mốc): số tác tử
bác bỏ mỗi lượt và token S4 mỗi vòng trên kho tiêu thụ — đây là số «sau» chính thức của vòng
token (hợp đồng của nó khai điều này), đọc ở mốc 2.14.

## Out of scope

- **Sáu mục tồn đọng còn lại** — gọi tên ở Notes §4 cho cửa sổ 2.14: gỡ nhánh lật verdict ·
  thẻ render việc-người · ghim lại theo diff · routing-baseline không đỏ vì hồ sơ mới ·
  dòng 1 đo tới lên-main + ship chạy nền · chiến dịch ghim lại 41 hồ sơ. Owner chốt mốc
  chỉ MỘT nhát vá.
- **Chiến dịch ghim lại 41/68 hồ sơ** — sau khi mốc gộp, một chiến dịch mỗi release; và
  chỉ sau mục «ghim lại theo diff», vì làn hiện chạy trọn năm suite mỗi hồ sơ.
- **Độ tin của trạm phân loại phạm vi** (hỏi lại một lần các khoá thiếu trước khi đặt cờ
  hỏng) — nhát đáng làm nhất của 2.14 theo số đo vòng token (trả thiếu 3 trên 6 lượt), nhưng
  là nhát thứ hai nên không vào mốc này.
- **Rollout tới kho tiêu thụ** — mỗi kho một PR, chủ kho gộp.
- **Vệ sinh chuỗi lệnh suite plugins trong `_acceptance/config.yaml` của chính kho này**
  (bộ lọc hai mẫu xoá dòng assert khi đỏ) — không phải engine, kho tiêu thụ không nhận; sửa
  ở một commit thường, không phải AC.

## Known limits

Bốn mục dưới đây do làn tìm-lỗi lượt chấm 2 xác nhận, scope-triage xếp NGOÀI hợp đồng,
owner quyết ghi Known limits khi ký (15/09). Cả bốn nói về chính hai nhát sửa của lượt
chấm 1, không mục nào chạm hành vi người dùng cuối.

- known-limits (Ngoài-1, owner ghi tại Cổng Bằng chứng 15/09): **_acceptance/release-2-13-0/rang-p93.sh** — Chân `do` in token `FAIL: P93` trên lối THÀNH CÔNG; đổi kênh sang stderr không cứu được người đọc thật, vì executor của E5b chạy qua Bash tool gộp stdout+stderr
- known-limits (Ngoài-2, owner ghi tại Cổng Bằng chứng 15/09): **tests/plugins/run-tests.sh** — Khẳng định «bản sao là ảnh của vật» đo trên tập ĐÃ LỌC nên không canh được chính cái `-f` mà nó sinh ra để canh — gỡ `-f` hôm nay vẫn XANH
- known-limits (Ngoài-3, owner ghi tại Cổng Bằng chứng 15/09): **_acceptance/release-2-13-0/rang-p93.sh** — Chuyển dòng P93 sang stderr không gỡ được nguyên nhân đỏ giả: đường chấm thật gộp hai luồng nên chuỗi «FAIL: P93» vẫn nằm trong output mà tác tử đọc
- known-limits (Ngoài-5, owner ghi tại Cổng Bằng chứng 15/09): **tests/plugins/run-tests.sh** — Hình dạng 4 + 3 — khẳng định bất biến mới trong dung_ban_sao không có chiều đỏ (dựng xong rồi tự kiểm chính cách dựng), và đo SỐ ĐẾM trong khi lời hứa viết ngay trên nó là hai tập «TRÙNG KHÍT»

- **Ngoài-4 KHÔNG ghi ở đây — owner quyết mở hợp đồng mới:** tests/plugins/run-tests.sh — Hình dạng 5 — tuyên quét LỚP «cặp marker duy nhất TOÀN KHO» (PAIRS 8 phần tử) nhưng chiều đỏ chỉ ghim 5/8; gỡ HFL-GLOSSARY-TERMS khỏi PAIRS, cả suite vẫn XANH (đã chạy mutant)
  Nó là một ca kiểm sót một thuật ngữ, không thuộc nhát vá của mốc này.

## Notes

### 1. Năm dòng số của luật (c) — mốc ĐẦU TIÊN đủ năm

Cửa sổ 2.12 → 2.13 có đúng MỘT vòng: `khoi-tim-loi-tra-phi-theo-vat` (luật (b), owner gọi
tên 14/09). Bảng dưới đây là VĂN ĐẾM TAY cho ba dòng đầu và MÁY ĐO cho hai dòng cuối.

| Dòng | Số | Nguồn rút |
|---|---|---|
| 1 làm-xong → quyết-được | **6h09** | ts dòng `round` ĐẦU của `run-log.jsonl` (`2026-09-14T06:17:15Z`) → thời điểm commit Cổng 2 (`b2c4d0d6`, `2026-09-14T19:26:59+07:00`) |
| 2 lượt gọi người/vòng | **4** — trong thiết kế **1**, ngoài thiết kế **3** | đếm tay từ phiên đã chạy vòng; cận dưới đọc từ sổ là 15, xem lời khai bên dưới |
| 3 vòng bị hạ-tầng-kit đốt lượt chấm | **3** trên 6 lượt | lượt 1 SIGPIPE trong khuôn khoá executor · lượt 2 E4 đỏ khi chấm mà `rc=0` khi chạy tay · lượt 4 P93 đỏ không tái hiện được (5 lần chạy lại đều xanh) |
| 4 token máy/vòng | **16.715.215** — tìm-lỗi 79,9 % · chứng-minh-vật 15,6 % · tổng hợp 4,6 % | `usage-report.md` của `khoi-tim-loi-tra-phi-theo-vat`, mục «Lượt chấm 5 — lượt PASS (run `wf_211fd30c-0ec`)»; máy đo bằng `wf-usage`, không đếm tay |
| 5 phút máy/lượt chấm | **20,4 phút** · đường găng là làn `machine` **12,9 phút** | cùng tệp, cùng mục; bảng vai trò |

**Hai dòng máy đo lấy từ đâu:** cả dòng 4 và dòng 5 đọc từ
`_acceptance/khoi-tim-loi-tra-phi-theo-vat/usage-report.md`, mục lượt chấm 5 — lượt PASS,
run `wf_211fd30c-0ec`. Chép nguyên chữ số, không làm tròn, không tính lại.

**Ba dòng đếm tay dùng phương pháp nào:** đúng phương pháp `release-2-12-0` đã khai, không
dựng phép đo mới — danh sách vòng ← commit Cổng 2 trong cửa sổ; lượt chấm ← `max(round)`
trong `run-log.jsonl` (bằng 5, cộng một lượt 1 chạy lại nên SÁU lượt thật); làm-xong →
quyết-được ← dòng `round` đầu tới commit Cổng 2; gọi người ← đếm tay, kèm cận dưới từ sổ.

**Giới hạn của phép đếm lượt gọi người — cận dưới PHỒNG, không phải thiếu.** Đếm entry
mang dấu người trong `decisions.jsonl` cho **15** trên 32 entry, trong khi số thật đếm tay
là **4**. Lý do: một chữ «Ký» ở Cổng Bằng chứng sinh 14 entry định đoạt cùng lúc. Đây đúng
lớp mà `release-2-12-0` tự ghi ở cột «cận dưới» của nó («một chữ Ký sinh 8 entry»), nên
con số từ sổ CAO hơn số thật chứ không thấp hơn. Bốn lượt thật: hai lượt DỪNG-VÁ, một lượt
quyết sau lượt chấm 4, một lượt ký. Cổng Phạm vi tốn **0** lượt — làn V, máy chốt phạm vi.

**Đọc số cho đúng:** bốn lượt so trần T2 là ba, tức **vượt một lượt**, và cả ba lượt ngoài
thiết kế đến từ khung giải sai hai lần. Theo north star, token giảm mà lượt gọi người tăng
là thất bại — nên dòng 4 đẹp KHÔNG bù được dòng 2. Đây là số phải mang sang cửa sổ sau.

**Số «sau» chính thức CHƯA tới hạn.** Hợp đồng vòng token tự khai điều này: số sau đọc ở
kho TIÊU THỤ qua T0, không phải trong kho kit. Con số 16,7 M ở trên là số đọc SỚM trong
chính kho này, và mọi so sánh với cửa sổ trước (35 M mỗi lượt của `release-2-12-0`) là so
CHÉO hai vòng khác hạng — T3 tám lượt so với T2 sáu lượt. Không dùng nó làm bằng chứng
hiệu quả; dùng nó làm mốc để cửa sổ 2.14 đo tiếp.

### 2. Lớp vendored — KHÔNG mục nào đổi trong cửa sổ

`git diff --stat 7e260d4b..HEAD -- vendor/` trả về RỖNG: không tệp nào dưới `vendor/` đổi
kể từ lần cắt số 2.12.0. Bảng chín mục vì thế không có dòng +/− nào để ghi.

Khối này cố ý ngắn, và lý do là một sự thật đo được chứ không phải một chỗ bỏ trống: cửa
sổ có đúng một vòng, và vòng ấy chạm `feature-loop/` cùng `scripts/gate-card.js`, không
chạm cây vendor. Tree-hash trong `NOTICE` của cây vendor vì thế còn nguyên (P196 giữ).

### 3. Lớp lỗi TÁI PHÁT trong cửa sổ

**Lớp một — «hạ tầng tự sinh tín hiệu đỏ», lần thứ SÁU, và mốc này vá nó.** Dẫn chứng:
`release-2-12-0` §4 gọi tên P93 ở lượt chấm 4 và lượt 5 của chính nó, mô tả đúng cơ chế
(quét trọn cây làm việc nên một tệp nháp không-được-theo-dõi đủ làm nó đỏ, mà một lượt
chấm là hàng chục tác tử cùng ghi trong một cây). Lượt chấm 4 của `khoi-tim-loi-tra-phi-theo-vat`
đỏ đúng chữ ký ấy, không tái hiện được qua năm lần chạy lại. Một lớp đã có tên, đã có
đường vá, vẫn đốt thêm một lượt ở cửa sổ sau — đó là lý do mốc này vá nó thay vì gọi tên
lần thứ hai.

**Lớp hai — «args ghép tay trôi khỏi bản sinh».** Lượt chấm 4 của vòng token truyền
`evalsHash` lấy từ một bản sinh CŨ, trước khi `evals.yaml` được sửa. Điều khoản S4-ARGS
cấm đúng việc đó. Gốc không nằm ở sự cẩu thả: công cụ Workflow không nhận đường dẫn tệp
args, nên mỗi lượt phóng buộc phải chép tay hơn hai chục nghìn ký tự, và mỗi lần chép là
một cơ hội trôi. Nhát cắt cho nó nằm ở khối 4.

**Lớp ba, lộ ra khi thi hành chính mốc này — «bản sao không phải là ảnh của vật».** Kế
hoạch dựng bản sao cho chiều đỏ NỘI TẠI của P93 bằng `rsync` trọn cây rồi `git add -A`.
Sau khi hàm quét đi theo tệp git theo dõi, cách ấy hỏng theo đường im lặng: rsync chép cả
tệp KHÔNG được theo dõi, `add -A` biến chúng thành theo dõi, nên đối chứng dương nội tại
đỏ vì một tệp mà `scan(nguồn)` không hề đếm. Phép đo bắt ngay: chân `im` VẪN đỏ sau khi đã
vá. Nay bản sao chép ĐÚNG tập `git ls-files` của nguồn — một vị từ cho cả hai chỗ.

### 4. Nhát cắt cho cửa sổ kế — gọi tên, theo thứ tự PHỤ THUỘC

Sáu mục tồn đọng của cửa sổ này cộng hai mục mới lộ ra. Xếp theo phụ thuộc, không theo độ
hấp dẫn; mỗi mục nói vì sao nó đứng ở chỗ đó.

1. **Ghim lại theo diff, không theo trọn corpus.** Làn hiện chạy năm suite tuần tự cho MỖI
   hồ sơ, khoảng 12 phút một lượt. Đây là điều kiện tiên quyết của mục 3: chưa cắt làn thì
   41 hồ sơ là một khoản giờ máy lớn, và nó lặp lại mỗi mốc. Đề bài đầy đủ ở
   `docs/plans/2026-09-14-hat-giong-ba-cho-cat-sau-chu-ky-cua-so-2-13.md` mục 1.
2. **Độ tin của trạm phân loại phạm vi.** Số đo của vòng token: triage trả THIẾU mục ở 3
   trên 6 lượt, và mỗi lần như vậy luật fail-toward-human bắt bác bỏ chạy trên TOÀN BỘ
   phát hiện — phần tiết kiệm của nhát cắt T1 bốc hơi (5 tác tử lên 10, rồi 15 ở lượt 1b).
   Nhát: khi triage trả về ít khoá hơn số gửi đi, hỏi lại ĐÚNG MỘT lần chỉ các khoá thiếu,
   rồi mới đặt cờ hỏng. Nhỏ, nằm trong engine, và nó bảo vệ trực tiếp khoản tiết kiệm lớn
   nhất đang hỏng nửa số lượt. **Đây là nhát đáng làm nhất của cửa sổ 2.14.**
3. **Chiến dịch ghim lại 41 trên 68 hồ sơ có ghim.** Mốc ghim cũ nhất tụt 411 commit và
   một mình gánh 21 hồ sơ. Bước ĐẦU là chạy ĐO không ghi, để biết bao nhiêu hồ sơ đỏ thật:
   hồ sơ ghim ở mốc xa có thể đỏ vì vật đã đổi, khi đó luật là DỪNG chứ không ký mù.
4. **Workflow nhận args từ TỆP thay vì chép tay.** Gốc của lớp lỗi thứ hai ở khối 3.
5. **Dòng 1 đo tới «lên nhánh chính», và nghi thức ship chạy nền.** Đoạn quyết-được →
   trên-main hiện không nằm trong dòng nào của năm dòng số.
6. **Chuỗi lệnh của làn chấm không được xoá lý do đỏ của chính nó.** Khoá suite plugins
   trong `_acceptance/config.yaml` lọc bằng hai mẫu, nên thông điệp assert của một ca đỏ bị
   xoá trước khi tới người đọc — đó là lý do lượt chấm 4 của vòng token không truy được
   nguyên nhân. Vệ sinh cục bộ của kho này, không phải engine; sửa ở một commit thường.
7. **Ba mục còn lại của `release-2-12-0` §4:** gỡ nhánh lật verdict theo ý kiến tác tử ·
   thẻ render việc-người mà hợp đồng tuyên · `routing-baseline.txt` không được đỏ chỉ vì
   có hồ sơ mới ký.

- Thước tự dối: không dán glob-literal vào văn hồ sơ (P161 quét corpus); mọi mẫu ở đây nói
  bằng chữ.
