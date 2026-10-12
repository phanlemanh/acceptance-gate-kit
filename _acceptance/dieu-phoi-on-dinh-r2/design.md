# Thiết kế: dieu-phoi-on-dinh-r2 (DP8 — ổn định gói `dieu-phoi` trước đợt chạy `r2` của crm)

Gốc: `crm-onehub/_acceptance/chuyen-goi-dieu-phoi/` (lượt chấm 1, 12/10, nhánh `chore/chuyen-goi-dieu-phoi` @
`48703713`) + phanlemanh/acceptance-gate-kit#301, phụ lục 12/10, điểm 1, 2, 6, 8. Vòng chạy dưới ô dù
`_acceptance/dieu-phoi-tho-trong-kit/` (Cổng Đáng build 09/10, timebox 07/11), như DP2–DP7. Không có
`opportunity.md` riêng.

Ba lỗ chặn đợt chạy `r2` của crm (mở ~16/10). Kit cắt 2.28.0 ngày 13/10; Mac Studio cài crm ngày 15/10.

## Ràng buộc của vòng

- Chỉ chạm `dieu-phoi/`, ca đo của vòng (`tests/dieu-phoi/`), hồ sơ này, và MỘT khoá executor mới trong
  `_acceptance/config.yaml` cho phép đo trên kho crm thật. Không chạm `scripts/gate-card.js`, SKILL feature-loop,
  `scripts/khong-can-nguoi.mjs`, khuôn `yeu-cau/` (vùng của đường găng 2.28 bên máy MacBook Pro).
- Sửa kit vì sự cố của một kho phải cân trên mọi kho (CLAUDE.md, 26/09): đổi gì cũng hỏi «kho không có sự cố
  này được gì, mất gì», «hành vi cũ có ai đang dựa». Nghiệm chọn theo thứ tự: bộ đọc khoan dung → bật thêm theo
  lựa chọn → đổi mặc định.

## Lỗ 1 — `xem --kiem-chuyen` không bao giờ in «sạch» (#301 điểm 1) và bỏ sót import tương đối (điểm 6)

**Hôm nay.** `kiemChuyen(cwd)` (dieu-phoi.mjs) quét mọi tệp git theo dõi, settings cục bộ, hook git, LaunchAgent
nhắc kho, tệp chữ ở gốc thư mục đợt, tìm chuỗi `scripts/dieu-phoi/`. Kho có lịch sử (hồ sơ đã ký, run-log, báo
cáo, kế hoạch cũ) thì không bao giờ «sạch». Import tương đối (`../dieu-phoi/dot.mjs` từ `scripts/kiem-cheo/`)
không chứa chuỗi đó nên lọt.

**Số đo trên crm thật (nháp đo 12/10, bản sao chia đối tượng của `~/dev/crm-onehub`):**

| Cây | Tổng dòng | Phải sửa | Lịch sử theo lớp |
|---|---|---|---|
| merge-base `b9a3b160` (trước khi gỡ) | 680 | 125: settings 4 · `gate-shape.json` 1 · `package.json` 1 · `config.yaml` 15 (executor còn eval sống gọi) · import tương đối 4 (3 tệp `scripts/kiem-cheo/`) · eval sống của 5 hồ sơ đã ký 100 | hồ sơ 408 · tài liệu 135 · eval ngoài làn máy của hồ sơ đã thông 6 · eval chết 3 · lộ trình 2 · executor chết 1 |
| đỉnh nhánh chuyển `48703713` | 690 | 5: 4 dòng eval sống của chính hồ sơ chuyển (đang chấm) · 1 dòng eval sống E7 của `sua-paths-e5-soan-okr` (danh sách miễn của crm) | hồ sơ 426 · tài liệu 133 · eval chết 103 · executor chết 15 · eval ngoài làn máy 6 · lộ trình 2 |

Bộ phân lớp tái lập đúng bảng «Phân lớp dòng» crm tự dựng ở design doc của hồ sơ chuyển, trừ hai lớp riêng của
crm (hồ sơ đang chạy, danh sách miễn) — hai lớp đó kho tự khai (chỗ chọn 1c).

**Chỗ chọn 1a — giữ `kiemChuyen` nguyên giao kèo, thêm hàm phân lớp.** crm E1 (hồ sơ chuyển, chưa ký) gọi
thẳng `kiemChuyen` rồi tự phân lớp MỌI dòng trả về; đổi `kiemChuyen` thành «chỉ dòng phải sửa» làm E1 đỏ («tập id
khối eval sống có dòng trả về bằng đúng danh sách miễn»). Nên: `kiemChuyen(cwd)` vẫn trả MỌI dòng `<tệp>:<dòng>`
(cùng thứ tự), chỉ THÊM dòng import tương đối (sửa lỗ điểm 6 — trên crm đỉnh nhánh không có dòng nào như vậy, nên
đầu ra của nó trên cây ấy không đổi; đo bằng E4). Hàm mới `phanLopChuyen(cwd)` → `{ phai_sua: [...], lich_su:
[{ dong, lop }] }`, hợp hai phần BẰNG đúng `kiemChuyen(cwd)`. Mô-đun mới `kiem-chuyen.mjs`; `dieu-phoi.mjs`
re-export `kiemChuyen` (đường nhập cũ giữ).

**Chỗ chọn 1b — lớp lịch sử neo vào khuôn kit định nghĩa, không vào từ vựng crm.**

| Lớp | Điều kiện (khuôn kit) |
|---|---|
| `ho-so` | tệp dưới `_acceptance/<slug>/` khác `evals.yaml` (run-log, báo cáo, sổ quyết định, thẻ, `rang/`…) |
| `eval-chet` | dòng của `_acceptance/<slug>/evals.yaml` nằm trong khối eval khai `status: not-run` |
| `eval-ngoai-lan-may` | dòng trong khối eval `judgment`/`ui-check` của hồ sơ có `status` đã thông (`signed-off`, `machine-cleared`, `da-cham-boi-thuc-te` — hằng `DA_THONG` của gói): làn ghim lại không chạy eval ngoài làn máy, hồ sơ đã thông không chấm lại |
| `executor-chet` | dòng thuộc khoá `executors.<nhóm>.<khoá>` của `_acceptance/config.yaml` mà không eval sống nào có `cmd: config:executors.<nhóm>.<khoá>` và `feature_loop.suite_keys` không nêu |
| `tai-lieu` | `docs/**` (README đã phát hành 2.27.0 khai `docs/` là lịch sử) |
| `lo-trinh` | `LO-TRINH.html` ở gốc kho (bộ vẽ lộ trình của kit sinh) |
| `khai-boi-kho` | khớp một mục của `dieu_phoi.lich_su` trong `_acceptance/config.yaml` (chỗ chọn 1c) |

Mọi dòng khác là **phải sửa**: settings, `package.json`, hook git, CI, LaunchAgent, `LUAT.md` của đợt, mã nguồn,
README gốc, eval sống. Thứ tự xét: `khai-boi-kho` trước (kho nói thắng), rồi đúng thứ tự bảng.

**Chỗ chọn 1c — kho khai lịch sử riêng bằng một khoá tuỳ chọn.** `dieu_phoi.lich_su` (danh sách, đọc theo dòng như
`dieu_phoi.goi_dot`, không nạp bộ đọc YAML): mỗi mục là glob đường tệp (`docs/plan/dot-sau-14-10/**`) hoặc
`<đường evals.yaml>#<id eval>` cho MỘT khối eval sống được miễn (E7 của crm). Vắng khoá = không khai gì: kho không
dùng không mất gì. Đây là CỘNG (khoá cấu hình mới) — trace nguyên tố 2 (máy tự chứng «sạch» không tự dối: cái được
miễn nằm trong tệp có git, đọc được), người hưởng: giám sát crm (điểm dừng của bước chuyển thành máy đọc được).

**Chỗ chọn 1d — đầu ra CLI.** Dòng phải sửa giữ đúng tiền tố 2.27 (`kiem-chuyen: <tệp>:<dòng>`, ca DP1-13 không
đổi thân); không còn dòng phải sửa → `kiem-chuyen: sach`; có lịch sử → ĐÚNG MỘT dòng tổng
`kiem-chuyen: lich-su <n> dòng — <lớp> <k> · …` (lớp theo thứ tự bảng, lớp 0 dòng không in); `--chi-tiet` in thêm
từng dòng lịch sử `kiem-chuyen lich-su: <tệp>:<dòng> · <lớp>`. Mã thoát: 0 khi không còn dòng phải sửa, 1 khi
còn, 2 khi lỗi. Kho không có lịch sử thì đầu ra y như 2.27.

**Chỗ chọn 1e — import tương đối.** Chỉ tệp mã (`.mjs .js .cjs .ts .mts .cts .jsx .tsx`). Một dòng tính khi có
chỉ định `from '<./|../…>'`, `import('<…>')`, `require('<…>')`, `import '<…>'` mà đường giải theo thư mục của tệp
rơi vào (hoặc bằng) thư mục bản cũ `<gốc kho>/scripts/dieu-phoi`. Dòng đã khớp chuỗi thì không tính lần hai.
Giới hạn khai: lệnh shell gọi đường tương đối (`node ../dieu-phoi/x.mjs`) và chỉ định dựng động (biến, nối chuỗi)
không bắt.

## Lỗ 2 — thợ không có bước ghi danh worktree (#301 điểm 2)

**Hôm nay.** `hinh-dang` đòi `day[].worktree` khác rỗng; `trongWorktree` nhận dãy theo cwd. Chip của app luôn dựng
worktree MỚI tên ngẫu nhiên nên gói đợt không biết trước; crm khai chỗ giữ `/CHUA-CO-WORKTREE/P<n>`. Hệ quả đo
được trên mã `main`: mọi dãy ra `worktree-mat` ở `chan-doan`/`tiep-tuc` → giám sát không mở chip nào (mo-dot bước
6 chỉ mở chip cho `mo-chip`); phiên mở từ chip không khớp dãy nào (`tho` → `khong-phai-tho`, `xin` → «cwd không
thuộc dãy nào»).

**Chỗ chọn 2a — lệnh `ghi-danh <dãy>` do chính phiên thợ chạy từ worktree của nó.** Bên viết: hàm trong
`hang.mjs` (bên viết duy nhất của `hang-viec.json` sau khi mở đợt — giữ một bên viết). Lệnh lấy `git rev-parse
--show-toplevel` của cwd (realpath) làm worktree W, ghi `day[<dãy>].worktree = W`, một dòng Nhật ký, một sự kiện
`doi-ke-hoach` kiểu `ghi-danh` (kèm `thay` khi đè worktree cũ). Chạy lại với cùng W → không làm gì.

**Chỗ chọn 2b — khi nào từ chối (không ghi byte nào, thoát 1, lời ghim).** Bốn lời từ chối cố định: dãy không có
trong đợt · W đã là worktree của dãy khác · W là gốc kho chính · không có đợt. Còn lại, «dãy còn phiên» đọc từ MỘT
nguồn với `tiep-tuc`/`chan-doan`: `ghi-danh` gọi `keHoachDay` và từ chối khi hành động của dãy là `khong`,
`nhan-giang-lai` hay `cho-nguoi` (có phiên sống, đang giữ khoá, hay phiên đang chờ người) — bất biến «máy mời chip
cho dãy ⇔ phiên chip ghi danh được» (gap-probe P1). Dãy còn đơn `xin/<dãy>-*` mà không còn phiên: nhận, và đơn
đổi `worktree` sang W giữ nguyên giờ xin (không thì khoá cấp cho worktree cũ không ai dùng được). Worktree cũ tồn
tại mà đã chết → đè, lệnh in lời nhắc nhánh cũ còn checkout ở worktree cũ.

**Chỗ chọn 2c — phân biệt «chưa ghi danh» với «worktree mất» bằng dấu viết lúc `mo`.** Lúc mở đợt từ gói, mỗi
dãy có `worktree` không phải thư mục nhận tệp `cho-ghi-danh/<dãy>.json`; `ghi-danh` xoá tệp đó. `keHoachDay`
(tiep-tuc.mjs): worktree không phải thư mục + có dấu → đi tiếp như dãy không phiên sống (thường ra `mo-chip`);
không dấu → `worktree-mat` như cũ. Đợt mở bằng bản gói cũ (không dấu) giữ hành vi cũ — đường đọc-cũ; ma trận
DP3-03 hàng (e) (worktree đã có rồi bị xoá) vẫn `worktree-mat`. Bảy hành động giữ nguyên.

**Chỗ chọn 2d — lời ghi danh của MỌI dãy `mo-chip` mang lệnh `ghi-danh`.** Chip luôn dựng worktree mới, nên kể
cả dãy đã có worktree (phiên cũ chết) thì phiên mới cũng phải ghi danh. Lời: `… · việc đầu tiên, từ worktree của
chip: node <thư mục đợt>/loi/dieu-phoi.mjs ghi-danh <dãy> · …`. Dãy chưa ghi danh in «worktree chưa ghi danh» thay
cho «worktree <đường> · nhánh …».

**Chỗ chọn 2e — khoá ghi.** Tám chip bấm gần nhau thì tám `ghi-danh` có thể đọc-sửa-ghi `hang-viec.json` cùng lúc
và mất bản ghi. Mọi bên viết của `hang.mjs` (ghi-danh, `hang day-len|them|nghi`) bọc đọc-sửa-ghi trong khoá thư
mục `hang-viec.khoa` (mkdir nguyên tử, chờ tối đa 10″, khoá cũ hơn 30″ coi như bỏ rơi). Dòng Nhật ký `LUAT.md` ghi trong cùng
khoá. Ca đo ép tranh chấp bằng biến `DIEU_PHOI_TRE_GHI_MS` (trễ giữa đọc và ghi, chỉ ca đo đặt — cùng kiểu
`DIEU_PHOI_NOW_MS`).

Giới hạn khai: phiên mở từ chip mà bỏ bước `ghi-danh` chạy feature-loop như ngoài đợt tới khi hook chặn lượt
chấm của nó (feature-loop là vùng khác, vòng này không sửa `trong-dot.mjs`).

## Lỗ 3 — việc nền giữ khoá s4 bị báo nhầm «khoa-khong-nhip» (#301 điểm 8)

**Hôm nay.** `baoKhoaKhongNhip` (phat-lich.mjs) báo khi khoá cấp quá 10′ mà worktree giữ khoá không có nhịp sống
(`song/`) nào từ lúc cấp. Nhịp sống chỉ hook `PostToolUse` ghi. Kiểm chéo đêm của crm (launchd, không phiên) xin
khoá s4 với phiên `kiem-cheo`, và mỗi 30″ gọi `chamNhip({cwd: cay})` của gói — chạm tín hiệu sống của KHOÁ
(`khoa/s4/nhip`), thứ hạn thuê đã đọc để gia hạn — nhưng không bao giờ có nhịp phiên. Kết quả: báo nhầm mỗi đêm,
`can_phan`; giám sát làm theo mà thu hồi thì cắt ngang lượt kiểm chéo.

**Chỗ chọn 3 — miễn có khai, khai bằng chính nhịp khoá.** Khoá do phiên NGOÀI dãy giữ (`chu.phien` không là `id`
của dãy nào trong `hang-viec.json` — việc nền như kiểm chéo) được coi còn sống khi `khoa/<tài nguyên>/nhip` ghi
từ lúc cấp trở đi (mtime ≥ `cap_luc`). Nhịp khoá là thứ việc nền ghi qua `chamNhip` hoặc lệnh bọc `giu-nhip.mjs` —
đường kit đã dạy trong `LUAT.md` cho việc nền dài. Việc nền thôi chạm nhịp → hạn thuê thu hồi khoá như mọi khoá.
Khoá của dãy giữ nguyên luật cũ (nhịp phiên theo worktree): ca DP3-10 và đột biến DP3-10-do không đổi thân.
Không cần đổi gì ở crm: crm đã gọi `chamNhip` mỗi 30″.

Hai phương án đã loại: (a) lệnh `nhip --phien` ghi `song/` cho việc nền — bắt kho tiêu thụ sửa mã của nó, trong
khi tín hiệu sống đã có sẵn; (b) miễn theo tên `PHIEN_MANG_MOC` — neo vào từ vựng một kho, và miễn không điều kiện
thì việc nền chết vẫn im tới hết hạn thuê.

## Tài liệu

README của gói: lệnh `ghi-danh` (ai chạy, khi nào, từ chối gì), đầu ra mới của `kiem-chuyen` + bảy lớp + khoá
`dieu_phoi.lich_su`, việc nền ngoài dãy giữ nhịp khoá. `mau/LUAT.md` mục «Cách xin tài nguyên» thêm gạch đầu
dòng ghi danh. Chuỗi «dùng:» của CLI thêm `ghi-danh` và `xem [--kiem-chuyen [--chi-tiet]]`. Không chạm
`CONTEXT.md`, `CHANGELOG.md` (dòng phát hành do người cắt mốc viết).

## Đo

- Kho thử do code sinh trong lượt (`git init` + `git worktree add` thật, thư mục tạm); đợt dựng bằng `mo` thật từ
  gói khai qua cấu hình; nhịp bộ phát lịch là `motNhip`/`taoVong` thật với đồng hồ giả; nhịp sống do hook thật ghi.
- Ma trận viết sẵn: số assert = số hàng, in ra. Ca đỏ chạy CHÍNH hàm đo trên bản sao gói bị tiêm, sau khi bản lành
  xanh trên cùng fixture, kiểm bước tiêm đã áp, ghim thông điệp.
- Mốc so của mọi phép đo «bản cũ» là tag `v2.27.0` (`a1e2e0b9`, bản crm đang cài) — ghim, không trôi theo gộp
  (gap-probe P0: `merge-base HEAD origin/main` trùng HEAD sau khi PR gộp). Riêng phép đo «ca đã ký không đổi thân»
  dùng bộ chọn mốc của SDT-07 (commit gộp PR của nhánh → từ điểm rẽ hai cha tới cha-2; chưa gộp → merge-base).
- Đo trên kho thật: `tests/dieu-phoi/dp8-crm-that.mjs` dựng bản sao chia đối tượng (`git clone --shared`) của
  `$HOME/dev/crm-onehub` ở hai sha ghim, so `kiemChuyen` của gói lúc này với `kiemChuyen` của gói `v2.27.0`
  (`git archive`), và chạy `phanLopChuyen` + CLI. Kho vắng hoặc sha vắng → thoát 2 «không đọc được ở đây: …»
  (tiền lệ `esl_vi_phan_bay_kho`). Không vào CI.
