# Thiết kế — nen-dieu-kien-va-static-khong-do-duoc (DP9)

Gốc: báo cáo Mac Studio ở phanlemanh/crm-onehub#375 (bình luận 13/10 01:10Z, «hai lỗi kit 2.28.0 lộ ở
đợt r2») · đường nền DA1 trên crm (`crm/_acceptance/viec-chung/duong-nen.md`, chân engine đỏ).

Hai thước của kit nói sai trên kho tiêu thụ: một thước nói ĐỎ khi vật lành (chân engine của đường nền),
một thước nói XANH khi nó không nhìn thấy vật (`design-gate` trên tệp không phải HTML). Vòng sửa cả hai
theo luật «sửa kit vì sự cố của một kho phải cân trên mọi kho» (CLAUDE.md): nghiệm đúng tầng trước, bộ
đọc khoan dung + cờ vàng thứ nhì, KHÔNG đổi mặc định.

## 1. Chân engine của đường nền — tệp có điều kiện

### Lỗi

`feature-loop/scripts/duong-nen.mjs` rút `TEP_ENGINE` = mọi mục `${CLAUDE_PLUGIN_ROOT}/(scripts|lib)/…`
của khối INIT-CI-COPY-LIST rồi băm từng tệp ở ba bản (vendored · cache · đang chạy). Tệp vắng ở bản
vendored băm ra `null` ≠ băm bản đang chạy → `nen engine: LECH <tệp> (vendored ≠ dang-chay)`.

Danh sách chép có mục CHỈ cần khi kho khai một ổ cắm: ba tệp `tin_hieu` của crm (tin-hieu-khoa.cjs,
tin-hieu.mjs, cat-luot.mjs — crm không khai `tin_hieu` nên không chép), và cùng hình dạng còn
`co-hop-dong.cjs` (tin_hieu), `lo-trinh.mjs` + `ho-so-tom-tat.cjs` (`lo_trinh`). Kho không khai ổ cắm
mà không chép tệp ấy là kho LÀNH — `product-map.mjs` nạp các tệp đó khoan dung hoặc chỉ khi khai — nhưng
đường nền đỏ engine ở MỌI vòng của kho đó. Đỏ thường trực dạy người ta bỏ qua màu đỏ.

### Nghiệm

**Điều kiện là thẻ máy-đọc trong CHÍNH khối danh sách chép** (một nguồn — writer = khối, reader = đường
nền; danh sách đã là nguồn duy nhất của tập tệp, nay mang luôn điều kiện của từng tệp). Mỗi mục có
điều kiện thêm ở cuối dòng thẻ `[only-if-declared: <khoá>]` với `<khoá>` ∈ {`tin_hieu`, `lo_trinh`}.

Văn xuôi hiện có KHÔNG đọc được làm điều kiện: bảy mục viết bảy kiểu («ONLY when the repo declares»,
«needed only when», «a repo that never declares … runs fine without it», «only with») — đọc văn xuôi là
đo chỉ dẫn, và chính `tin-hieu-khoa.cjs` (một trong ba tệp crm thiếu) không có chữ «only».

Đường nền: «kho khai `<khoá>`» ⟺ `_acceptance/config.yaml` có dòng cột 0 `^<khoá>:`. Đây là xấp xỉ
DƯỚI của bộ nạp thật: `product-map.mjs` chỉ nạp `lo-trinh.mjs` khi khối `lo_trinh:` cột 0 có `tep`, và
chỉ nạp `tin-hieu.mjs` BÊN TRONG nhánh đó khi khối `tin_hieu:` đủ `nguon`+`gom` — nên không có dòng cột 0
thì chắc chắn không nạp. Chiều ngược lại cho phép thừa đỏ (khối khai thiếu `tep`, `tin_hieu` mà không
`lo_trinh`), không bao giờ xanh giả. Ca NEN-DK5 đo chính quan hệ ấy. Với mỗi tệp của TEP_ENGINE:
- tệp mang thẻ ∧ kho không khai ∧ bản vendored VẮNG tệp → loại bản vendored khỏi các cặp so của RIÊNG
  tệp đó (cache ↔ đang chạy vẫn so), stderr một dòng
  `engine: bo-qua <tệp> — tệp có điều kiện, kho không khai <khoá>`;
- tệp CÓ mặt ở vendored mà lệch → vẫn đỏ, bất kể điều kiện (ổ cắm chưa khai không biện minh cho một
  bản chép cũ đang nằm trong cây);
- kho KHAI khoá mà tệp vắng → vẫn đỏ (đúng lỗi thật: product-map sẽ chết khi nạp).

Số `engine: bam N tep` giữ nguyên nghĩa (số mục của danh sách) — NEN7 không đổi.

### Phép thử hai chiều (trên CÙNG fixture lành của NEN0, mỗi ca đổi một biến)

| Ca | Biến | Mong đợi |
|---|---|---|
| NEN-DK1 (im) | gỡ mọi tệp mang thẻ khỏi vendored, config không khai | engine xanh, mã 0; tập dòng `engine: bo-qua …` == tập tệp mang thẻ |
| NEN-DK2 (dương rồi đỏ) | config khai `tin_hieu:` (rồi riêng `lo_trinh:`): đủ tệp → xanh; gỡ tệp mang thẻ → LECH | ô dương mã 0, 0 LECH, 0 bo-qua; chiều đỏ LECH đúng tập tệp của ổ đã khai, ổ kia vẫn bo-qua |
| NEN-DK3 (đỏ, giữ) | (a) tệp mang thẻ CÓ mặt mà lệch, không khai · (b) gỡ tệp KHÔNG thẻ `scripts/trang-thai-ho-so.cjs` | `LECH <tệp>` mã 1 — thẻ không thành lối thoát chung |
| NEN-DK4 (round-trip) | bản sao ag-root gỡ thẻ khỏi dòng `tin-hieu-khoa.cjs` | DK1 đỏ đúng tệp đó — điều kiện đọc từ khối |
| NEN-DK5 (chẵn lẻ với bộ nạp) | bốn biến thể config {không khai · chú thích · thụt trong khối khác · khai đủ}, tệp mang thẻ vắng; chạy cả đường nền lẫn `product-map.mjs --root` vendored | «đường nền xanh ⇒ product-map mã 0»; đột biến `khoKhai` luôn false → đỏ nêu biến thể khai-đủ; đối chứng đỏ bộ nạp: gỡ `trang-thai-ho-so.cjs` |
| NEN-DK6 (thẻ ↔ đồ thị nạp) | quét mọi mục không thẻ tìm nạp TĨNH một tệp mang thẻ | 0 dòng (đo 13/10: chỉ product-map chạm tệp mang thẻ — `require` bọc `try`, `await import(` trong nhánh khai); đột biến tiêm import tĩnh → nêu tệp:dòng |

Bên đọc khác của khối (CE1, CE2g của consumer-esm; NEN7; fixture của đường nền) rút đường dẫn bằng regex
dừng ở dấu backtick, nên thẻ cuối dòng không lọt vào đường dẫn — E10 + NEN7 ghim điều đó.

Phá thử khi dựng (13/10, bản sao scratchpad): bản gốc `duong-nen.mjs` đỏ DK1, DK2 (cả hai ổ), DK4, DK5;
DK3 và DK6 xanh ở cả hai bản theo thiết kế (bất biến giữ — chiều đỏ là đột biến trong chính ca).

## 2. `design-gate` trên tệp không phải HTML

### Lỗi

`scripts/design-gate.mjs` đưa mọi đích vào bộ dò HTML (static: `detect-html.mjs`; dom: jsdom). Một tệp
`.tsx` được đọc như văn bản HTML: `style={{color:"#eee"}}`, `className`, ảnh `src={x}` vô hình — kết quả
PASS gần như luôn. Đo 13/10 trên crm (bản kit hiện tại, chỉ đọc, 42 lệnh `*_san_thiet_ke` thuần
design-gate): **265 lượt gọi, 265 đích `.tsx`, 262 PASS, 0 REJECT, 3 hỏng vì tệp vắng** (`okr/cot-gop-y.tsx`
×2, `okr/soan/man-soan.tsx`). Toàn kho crm: 50 khoá cấu hình gọi `design-gate --mode static`, 0 đích HTML,
51 eval tham chiếu (50 ở hồ sơ `signed-off`, 1 `machine-cleared`).

Thước không mù tuyệt đối: thẻ JSX viết chữ như `<img src="" />` vẫn bị bắt (`broken-image` P0, đo trong
scratchpad) — nên «luôn trả không-đo-được» sai; «đo được một phần nhỏ, xanh không mang nghĩa» đúng.

### Nghiệm — bộ đọc khoan dung + cờ vàng, mã thoát KHÔNG đổi

Đích ở `--mode static` có đuôi không thuộc {`.html`, `.htm`, `.xhtml`} (không phân biệt hoa thường; KHÔNG
đuôi cũng tính là không phải HTML — luật đuôi, không đoán nội dung). Đích là tệp (bộ dò đọc bằng
`readFileSync`), không có ca URL. Phân loại đặt SAU bộ dò, nên tệp vắng vẫn chết mã 1 như cũ.
- bộ dò không thấy lỗi chặn → `verdict: "KHONG-DO-DUOC"` (thay `PASS`), mã thoát **0** như cũ;
- bộ dò thấy lỗi chặn → `verdict: "REJECT"`, mã **2** như cũ (lỗi thấy được vẫn là lỗi thật);
- cả hai: thêm `do_duoc: false` + `ly_do_khong_do_duoc` vào JSON, và stderr đúng một dòng
  `design-gate: static không đo được tệp này (<đuôi>) — bộ dò chỉ đọc HTML đã dựng; xanh ở đây không phải đạt: <đích>`
Đích HTML và mọi đích ở `--mode dom`: đầu ra y như cũ (không khoá mới, không dòng stderr mới). Dom ngoài
phạm vi vì kho không cài jsdom — suite chung không đo được nhánh ấy (gap-probe P0#1).

**Bên đọc trường `verdict` (quét 13/10):** kit — 0 (bốn tệp nhắc `verdict` cạnh `design-gate` là chính
cổng, lint phủ eval và hai suite dựng báo cáo giả); crm — 1, `_acceptance/tiep-thi-tuyen-doi-tac/rang/
chien-dich.mjs` kiểm `verdict !== "PASS"` nhưng chấm `--mode dom` trên ảnh chụp `E20-*.html` — ngoài cả hai
điều kiện đổi; các kho git khác dưới `~/dev` — 0.

Vì sao không đổi mã thoát: mọi lệnh `*_san_thiet_ke` của crm ghép bằng `|| exit 1` và làn ghim lại chỉ
đọc mã thoát. Mã 0 → khác 0 làm 51 eval ở 51 hồ sơ đã ký đỏ cùng lúc ở lượt ghim lại kế — đúng hình
«đổi mặc định, mọi kho trả giá». Bộ đọc khoan dung giữ màu, cờ vàng nói ra sự thật cho mọi người đọc đầu
ra (tác tử chấm S4 đọc stdout; nhật ký làn ghim lại giữ stdout).

**Hệ quả chính xác lên crm sau vòng:** ghim lại KHÔNG đổi màu — 265/265 lượt gọi giữ nguyên mã thoát
(đo lại bằng cùng shim ở S3, khối «Đo lại crm» dưới); 262 lượt PASS đổi chữ thành `KHONG-DO-DUOC` trong
stdout + một dòng stderr mỗi lượt; 3 lượt tệp vắng không đổi (vẫn chết mã 1 — ngoài phạm vi).

### Phép thử hai chiều — ma trận so với bản gốc

Bản gốc = `git archive <base> scripts lib vendor` (trọn thư mục). Ma trận đích × chế độ static:

| Đích | Gốc | Sau | Chiều |
|---|---|---|---|
| html sạch (`f09-clean-good.html`) | PASS 0 | PASS 0, không `do_duoc`, stderr rỗng | im |
| html có tell P1 (`f04-side-tab.html`, `--fail-on P0,P1`) | REJECT 2 | REJECT 2, không `do_duoc` | im |
| `.HTML` hoa | PASS 0 | PASS 0 | im |
| tsx sạch (chữ #eee trên nền trắng qua style object) | PASS 0 | KHONG-DO-DUOC 0, `do_duoc:false`, dòng stderr ghim | nhạy |
| tsx có `<img src="" />` | REJECT 2 | REJECT 2, `do_duoc:false`, dòng stderr | nhạy + giữ |
| jsx sạch / `.vue` sạch | PASS 0 | KHONG-DO-DUOC 0 | nhạy |
| HTML không đuôi | PASS 0 | KHONG-DO-DUOC 0, «(không đuôi)» | nhạy (luật đuôi) |
| tsx VẮNG | chết 1 | chết 1, không JSON | giữ |
| tsx `--mode dom` (không jsdom) | BLOCKED 3 | BLOCKED 3, không `do_duoc` | im |
Bất biến ma trận: mã thoát Sau == mã thoát Gốc ở MỌI ô (đây là lời hứa «ghim lại không đổi màu», đo
bằng quan hệ, không bằng chuỗi). Ca DG-KDD1 (mã) · DG-KDD2 (cờ) · DG-KDD3 (hai đột biến: danh sách đuôi
HTML rỗng → phép đo nêu ô html-sach; KHONG-DO-DUOC thoát 3 → «tsx-sach: mã thoát lệch gốc»; phân loại
TRƯỚC khi đọc tệp → «tsx-vang: tệp vắng mà bản vòng trả JSON»).
Phá thử khi dựng: bản gốc `design-gate.mjs` đỏ DG-KDD2 và KDD3; KDD1 xanh ở cả hai (đó là bất biến giữ).

### Đo lại crm với bản vá (13/10, cùng shim, chỉ đọc)

42/42 lệnh thuần design-gate cùng mã thoát với bản gốc; 265/265 lượt gọi cùng mã; 262 lượt đổi chữ
PASS → KHONG-DO-DUOC; 3 lượt tệp vắng vẫn chết mã 1. Tám lệnh còn lại ghép design-gate với test khác
(`bun test`, `git diff --quiet`, `ban-kinh-man.mjs`) — phần design-gate của chúng là đích `.tsx`, cùng lớp
ô tsx-sach của ma trận, nên cùng mã. Kết luận cho 51 eval tham chiếu (50 ở hồ sơ signed-off, 1
machine-cleared): ghim lại không đổi màu.

## Ngoài phạm vi

- Cờ không-đo-được ở `--mode dom` (không jsdom trong suite chung — mở lại khi có, hoặc khi ≥1 kho chấm dom
  trên tệp không phải HTML).
- Chế độ chặt tuỳ chọn (cờ khiến KHONG-DO-DUOC thoát khác 0) — bậc «bật thêm theo lựa chọn»; chỉ mở khi
  ≥1 kho xin, vì bậc khoan dung đã đủ để thước thôi nói dối.
- Băm bốn tệp ngoài `scripts/`·`lib/` của danh sách (hạt giống 2026-10-11 kiem-lech-ban-tep-ngoai) —
  ngưỡng hạt giống chưa tới; thẻ điều kiện vòng này gắn cho cả bốn mục ấy để vòng kia khỏi làm lại.
- Giới hạn khai: cờ vàng chưa có bên đọc máy — làn ghim lại và lưới trước-merge chỉ đọc mã thoát. Ngưỡng mở
  chế độ chặt tuỳ chọn: ≥1 kho xin, hoặc ≥1 hồ sơ ký trên chốt design-gate static non-HTML mà prod đỏ đúng
  tiêu chí đó.
- Tệp đích vắng làm design-gate chết mã 1 kèm vết ngăn xếp — đỏ đúng chiều, thông điệp xấu; không đổi.
- Sửa ~51 lệnh của crm sang thước đo được (ui-check trên bản chạy) — việc của crm.
