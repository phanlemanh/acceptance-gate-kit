# Xả stdout trước khi thoát — thiết kế vòng vá

Ngày: 2026-10-11 · Hạng: T2 (vòng sửa lỗi, không ô cơ hội) · Hồ sơ: `_acceptance/xa-stdout-truoc-khi-thoat/`

Gốc: cranky-kare-4e5cd2/_acceptance/dieu-phoi-doi-tai-khoan/ — làn ghim lại 5 hồ sơ của DP4 đỏ ở ca P161
(sổ chạy `run-log*` của hồ sơ đó, chưa commit, nằm ở worktree `cranky-kare-4e5cd2`).

## 1. Vấn đề

`scripts/gate-card.js` ghi trọn thẻ bằng MỘT lần `process.stdout.write(...)` rồi gọi `process.exit(0)` ngay.
Theo tài liệu Node («A note on process I/O»), stdout nối vào pipe hoặc socket là **bất đồng bộ trên POSIX**;
`process.exit()` thoát trước khi phần ghi còn treo kịp xả. Phần vượt bộ đệm của pipe mất, im lặng, mã thoát
vẫn 0.

Số đo (M5, Darwin 27, Node 24.21.0):

| Phép đo | Kết quả |
|---|---|
| `write(200 000 byte); exit(0)` qua `spawnSync` | nhận **65 536** byte |
| cùng lệnh, `process.exitCode = 0` thay `exit` | nhận 200 000 |
| cùng lệnh, thoát trong callback của `write` | nhận 200 000 |
| 2 000 lần `console.log` (200 KB) rồi `exit` — người đọc nhanh | nhận 200 000 |
| như trên — người đọc ngủ 1 s trước khi đọc | nhận **65 500** |
| `write(200 KB); exitCode = 0` — người đọc đóng sớm (`\| head -c 10`) | **sập EPIPE, mã 1**, in vết ngăn xếp |
| `write(200 KB, () => exit(0))` — người đọc đóng sớm | mã 0, không vết |
| thẻ Cổng 2 lớn nhất trên `main` 08ba287d (`cong-nguoi-doc-du-nguon`) | 64 287 byte — sát mốc |
| thẻ Cổng 1 của DP4 (74 dòng sổ ba vế) | 65 932 byte — vượt mốc, P161 sập ở byte 65 534 |

Hai điều rút ra định khuôn vá:

1. Lớp lỗi là **«tổng stdout vượt bộ đệm pipe rồi thoát trước khi xả»**. Một lần ghi lớn thì cắt chắc
   chắn; nhiều lần ghi nhỏ thì cắt khi người đọc chậm hơn người ghi.
2. Khuôn mà tài liệu Node khuyên (`process.exitCode`) **đổi hành vi hôm nay** ở ca người đọc đóng sớm:
   lỗi EPIPE thành lỗi không bắt, mã 1 cộng vết ngăn xếp. Khuôn đúng là **thoát trong callback của `write`**:
   callback nhận cả lỗi EPIPE nên mã thoát giữ nguyên.

Vì sao CI không thấy: thẻ DP4 chưa lên `main`; thẻ lớn nhất trên `main` còn dưới mốc 64 287 / 65 536.
Lời «pipe Linux đồng bộ» trong lời giao việc không khớp tài liệu Node (pipe bất đồng bộ trên mọi POSIX).
Độ sâu bộ đệm khác nhau giữa các nền, nên ca đo **dò nền** bằng một lệnh một dòng thay vì giả định
(mục 4).

## 2. Nghiệm

**gate-card.js** — một hàm cạnh đầu tệp:

```js
const ghiRoiThoat = (noiDung, ma) => { process.stdout.write(noiDung, () => process.exit(ma)); };
```

Bốn chỗ «ghi rồi thoát» (thẻ Cổng 1 · `--extract` Cổng 1 · `--extract` Cổng 2 · thẻ Cổng 2 chưa-ký-được)
thành `return ghiRoiThoat(<nội dung>, 0);`. `return` ở cấp mô-đun CommonJS dừng mã phía dưới đúng như
`process.exit` cũ làm. Thẻ Cổng 2 ký-được kết thúc tự nhiên ở cuối tệp nên không cần sửa.

**repin-lane.mjs, nhánh LÀN ĐỎ** — khối này in JSON mọi slug lên stdout, chạy tiếp nhiều thao tác đồng bộ,
rồi `process.exit(1)`. Dòng thoát đổi thành `await xaRoiThoat(1);` với:

```js
const xaRoiThoat = (ma) => new Promise(() => process.stdout.write('', () => process.exit(ma)));
```

Lần ghi rỗng chỉ gọi callback sau mọi lần ghi trước (stream ghi theo thứ tự). Lời hứa không bao giờ xong,
nên mã nhánh xanh phía dưới không chạy. Đây là ESM: không `return` ở cấp mô-đun được, `await` ở cấp mô-đun
thì được.

Không gom hai hàm về một thư viện chung: `feature-loop/` và `lib/` là hai gói plugin riêng trong cache;
repin-lane chỉ chạm thư viện của acceptance-gate qua bộ giải `--ag-root`. Một dòng mỗi bên rẻ hơn một
đường nạp chéo gói.

## 3. Quét cả lớp — bốn thư mục `scripts/` `lib/` `feature-loop/scripts/` `dieu-phoi/scripts/`

Cách quét: mọi `process.exit(` có `process.stdout.write`/`console.log`/`console.info` trong 60 dòng phía
trên (cùng dòng tính); đọc tay từng chỗ; đo cỡ đầu ra trên corpus kit (180 hồ sơ — kho lớn nhất đang có).
Lệnh quét (chạy ở gốc kho, 11/10 trên 08ba287d: **24 tệp trúng**):

```
node -e "const fs=require('fs'),p=require('path');const w=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?(e.name==='mau'?[]:w(p.join(d,e.name))):/\.(c?js|mjs)$/.test(e.name)?[p.join(d,e.name)]:[]);for(const f of ['scripts','lib','feature-loop/scripts','dieu-phoi/scripts'].flatMap(w)){const L=fs.readFileSync(f,'utf8').split('\n');const h=L.flatMap((l,i)=>/process\.exit\(/.test(l)&&/process\.stdout\.write|console\.(log|info)/.test(L.slice(Math.max(0,i-60),i+1).join('\n'))?[i+1]:[]);if(h.length)console.log(f+': '+h)}"
```

**Giới hạn của mẫu quét:** nó không thấy lần ghi lớn qua một hàm trợ giúp đặt cách `process.exit` hơn
60 dòng, hay một `process.exit` gọi từ hàm khác sau khi in. Lớp không có máy giữ: một ca so danh sách này
với kết quả quét trên mọi commit chính là răng tĩnh của lớp — một CỘNG đã bỏ ở d-6. Ngưỡng mở lại (đang
đếm): một lần cắt 64 KB nữa ở bất kỳ script nào ngoài hai tệp đã sửa.

Luật chọn: **sửa** khi đầu ra đã vượt mốc hoặc vượt ở cỡ việc kit đã từng chạy (một chiến dịch ghim lại
65 hồ sơ); **liệt kê, không sửa** khi đầu ra có trần cấu trúc, hoặc cần corpus ≥ 3 lần hôm nay mới tới mốc.

| Chỗ | Đầu ra | Cỡ đo / ước | Quyết |
|---|---|---|---|
| `scripts/gate-card.js` 802 · 909–910 · 1157 · 1196–1197 | thẻ / JSON trích, tỉ lệ sổ quyết định + hồ sơ | 64 287 B trên main; 65 932 B ở DP4 | **sửa** |
| `feature-loop/scripts/repin-lane.mjs` 677 → 722 (làn đỏ) | JSON mọi slug: dòng repin + section + eval lệch | ≈ 1,2–1,5 KB/slug → vượt mốc từ ~45–55 slug; chiến dịch ghim lại đã chạy 65 | **sửa** |
| `feature-loop/scripts/repin-lane.mjs` 477–479 (làn bỏ qua) | `pins` {slug: sha} | ≈ 60 B/slug → cần ~1 000 slug | liệt kê |
| `scripts/eval-coverage-lint.js` 329 | cảnh báo mọi hồ sơ, nhiều `console.log` | 19 187 B (92 cảnh báo) — cần ×3,4 corpus | liệt kê |
| `scripts/loop-health.mjs` 230–239 | bảng / JSON mỗi kho trên máy | trần = số kho trên máy (~15) | liệt kê |
| `feature-loop/scripts/thuoc-vat.mjs` 297 · 311 · 384 | tệp thước đổi giữa hai lượt · một commit · bộ đếm | trần = cỡ diff một lượt (~1 300 tệp mới tới mốc) | liệt kê |
| `feature-loop/scripts/carry-plan.mjs` 253 | kế hoạch carry một hồ sơ | trần = số eval một hồ sơ (cap 15 AC) | liệt kê |
| `scripts/cat-luot.mjs` 297 · 324 | nhịp (189 B) · bảng phủ một đợt | trần = số mã một đợt | liệt kê |
| `scripts/lo-trinh.mjs` 837 · 842 | một hàng lộ trình | một hàng | liệt kê |
| `scripts/design-gate.mjs` 54 | kết quả sàn P0 của một trang | trần = phát hiện một trang | liệt kê |
| `lib/workspace-record.cjs` 415–419 | một slug khép mỗi dòng | 435 B | liệt kê |
| `scripts/build-design-scan.mjs` · `cau-noi-ruling.mjs` · `evidence-page.js` · `plugin-declare.mjs` · `product-map.mjs` · `recheck-evidence.cjs` · `start-scan.mjs` | một dòng / một đường dẫn / danh sách plugin | < 1 KB | liệt kê |
| `lib/evidence-core.cjs` · `lop-nhin-thay.cjs` · `nhan-canh-gay.cjs` (chế độ CLI) | một dòng | < 200 B | liệt kê |
| `feature-loop/scripts/duong-nen.mjs` · `resolve-plugin.mjs` · `round-tally-read.mjs` | một dòng / một đường dẫn / bộ đếm lượt | < 2 KB | liệt kê |
| `dieu-phoi/scripts/dieu-phoi.mjs` 249 | danh sách chuyển phiên | vài dòng | liệt kê |

Đối chứng ngoài danh sách: `scripts/start-scan.mjs` in JSON trạng thái mọi hồ sơ (51 965 B trên corpus kit,
gần mốc) mà gate-card đọc qua pipe — nó KHÔNG trúng mẫu vì đường chính kết tự nhiên ở cuối tệp, nên đủ
byte ở mọi cỡ. Chỉ nhánh không-có-config (một dòng) gọi `process.exit` sau khi ghi.

Ngoài bốn thư mục (không quét theo lời giao): `hooks/`, `skills/*/`, `vendor/`, `tests/`.

## 4. Ca đo — `tests/scripts/xuat-du-qua-pipe.test.mjs`

Tên tệp xếp CUỐI glob của suite scripts, nên chỉ số mảnh `mjs:i/3` của mọi tệp khác giữ nguyên. Khoá
executor riêng `executors.test.xuat_du_qua_pipe` để eval chạy đúng tệp này, không phụ thuộc mảnh.

- **Dò nền.** Mở đầu, chạy `write(200 000 byte); exit(0)` qua `spawnSync` và in
  `nền: CẮT (dò nhận <n> / 200000 byte)` hoặc `nền: KHÔNG CẮT (…)`. **Tiền đề cỡ** của mọi fixture lớn:
  bản tệp > 65 536 VÀ ≥ 2 × n — độ sâu bộ đệm khác nhau theo nền, nên «dò cắt ở 200 KB» chỉ suy được «fixture
  bị cắt» khi fixture đủ lớn so với chính số dò. Chiều đỏ chỉ được KHẲNG ĐỊNH khi nền cắt và tiền đề thoả;
  ngược lại ca in `KHÔNG ĐO ĐƯỢC ở nền này` kèm n và cỡ fixture nhỏ nhất — trạng thái không-đọc-được-ở-đây,
  không phải PASS. Ca EPIPE dò riêng bằng lệnh một dòng `exitCode` + người đọc đóng sớm.
- **Hồ sơ thử do mã sinh trong ca:** sổ quyết định đủ dòng để thẻ Cổng 1 và JSON trích vượt 64 KB (cỡ
  sổ như DP4); hồ sơ BLOCKED với lý do dài cho thẻ Cổng 2 chưa-ký-được. Ca kiểm **tiền đề** trước: bản
  ghi ra TỆP (đồng bộ) phải > 65 536 byte — fixture co lại thì ca đỏ nêu tên, không xanh rỗng.
- **Độ nhạy:** mỗi đường ra qua pipe phải bằng từng byte bản ghi ra tệp; JSON trích parse được.
- **Ma trận mutant 4 × 4:** bản sao gate-card mà ĐÚNG MỘT chỗ thoát quay về «ghi rồi `process.exit(0)` ngay»
  → đúng ca của chỗ đó đỏ với thông điệp `nhận <n> / <m> byte`, ba ca kia xanh. Bản sao lấy trọn
  `scripts` + `lib` của cây đang kiểm (đường suy từ vị trí tệp ca). Trước mọi bản tiêm, một bản sao CHƯA
  tiêm dựng cùng cách phải xanh. Ô chéo chỉ tính đỏ khi cùng lúc: mã thoát đúng mã của đường, 0 < n < m, và
  n byte nhận là tiền tố của bản tệp — bản sao chết sớm (0 byte, mã lạ) không được đếm là «đỏ đúng».
  Chuỗi tìm vắng → `mutant không áp được`.
- **Đối chứng dương:** hồ sơ nhỏ (năm đường ra) và ba hồ sơ thật đầu tiên theo thứ tự chữ mà ở cả hai cổng
  thẻ render được (mã 0, ≥ 1 KB, có `class="gc"`): bản sao đã sửa qua pipe bằng từng byte bản sao «hoàn
  nguyên khuôn cũ» qua pipe và bằng bản ghi ra tệp, mã thoát bằng nhau; hai bản sao dựng cùng cách, cùng
  thư mục làm việc, và bản sao đã sửa bằng gate-card cây thật (đối chứng bố cục). Không ghim sha nền:
  «như trước» dựng lại từ chính cây đang kiểm, nên mệnh đề còn đúng sau mọi commit sau này.
- **Người đọc đóng sớm:** đọc mẩu đầu rồi đóng → gate-card thoát 0, stderr không có `EPIPE`. Mutant khuôn
  `process.exitCode` → đỏ chỉ khi stderr của TIẾN TRÌNH CON có `EPIPE` và mã ≠ 0.
- **repin-lane làn đỏ:** kho thử có suite đỏ và `--reason` đủ dài để JSON thoả tiền đề cỡ → qua pipe parse
  được, có đủ slug và trọn lý do, mã 1, stderr có `LÀN ĐỎ` — ở cây thật và ở bản sao chưa tiêm (trọn
  `feature-loop`, `--ag-root` tuyệt đối trỏ cây đang kiểm). Mutant `process.exit(1)` ngay → đỏ khi mã 1,
  0 < n < m, tiền tố; chuỗi tìm vắng → `mutant không áp được`.

## 5. Giới hạn đã khai

- Chiều đỏ của ca đo chỉ khẳng định được trên nền mà pipe cắt ở cỡ fixture (đo được ở M5). Nền khác in
  dòng «không đo được» có tên — chưa ai đo nền CI (Linux) cho lớp này.
- Không có răng tĩnh chặn lớp này ở mọi script: đó là một CỘNG (luật mới cho mọi script), cần owner phê.
  Ngưỡng mở: một lần cắt 64 KB nữa ở script nằm trong danh sách «liệt kê» của mục 3.
