# CHANGELOG — acceptance-gate kit

> Mỗi release một mục, nói tiếng người: đổi gì · ai bị ảnh hưởng · làm gì khi
> update. Sử chi tiết từng bản 1.x sống trong `description` của manifest
> (`.claude-plugin/plugin.json`) — file này bắt đầu từ 2.0.0.
>
> Tệp này dựng lại 14/09/2026 (owner gọi tên). Bản gốc ra đời ở đợt tái lập
> 2.0.0 nhưng nằm trên một nhánh không gộp vào nhánh chính, nên lịch sử
> 2.0.0 → 2.12.0 **không** có ở đây: chuyện của mười hai mốc đó sống trong
> `_acceptance/release-<x-y-0>/contract.md` và `evidence-report.md`. Mục đầu
> tiên dưới đây là phần CHƯA phát hành.

## 2.35.0 — 29/10/2026

Mốc mang **nền thiết kế** (đợt `design-floor-2710`, FL1–FL5): lõi gọn Design OS vendored vào kit, nối vào vòng ở S0,
S1, cuối S3 và S4, chặn theo bậc M0–M3 của kho; cùng cờ chặt tuỳ chọn của design-gate, vùng giao việc đi từ cắt lượt
(đề bài #430 «toàn đợi ghim») và khung đợt định vị (ADR 0027 bước a–b). Chủ kho 28/10: «Chốt danh sách gom cho bản
2.35.0: FL1–FL5, vùng giao việc, vòng bộ đếm «cần anh» + khung đợt định vị, và TC1 (#419) nếu kịp ký. Cắt bản khi vòng
khung đợt gộp.» TC1 chưa ký nên không vào. Có **tám hồ sơ được ký** — tập đối chiếu bằng `scripts/rel-cua-so.sh` (AC-4
của hồ sơ mốc): `design-gate-che-do-chat` (#413), `design-floor-vendor-va-ban-va-a` (FL2, #427),
`design-floor-ban-va-b-c-d` (FL3, #429), `design-floor-moc-s0-s1` (FL4, #433), `design-gate-khong-do-duoc-ba-nguyen-nhan`
(FL1, #434), `design-floor-moc-s3-s4` (FL5, #438), `vung-giao-viec-tu-cat-luot` (#436), `khung-dot-dinh-vi` (#440). Ngoài
vòng: #435 (ADR 0027) · #439 (báo cáo đóng đợt) · #421 (hợp đồng nhập của design-floor) · #422, #424, #425, #426, #428,
#431, #437 (kế hoạch, cắt lượt, mốc của đợt) · #432 (đề bài vùng giao việc) · #416 (Cổng Đáng một ô) · #414, #420 (hạt
giống, ghi chép) · #423 (bật tầng tri thức của chính kit) · #412 (dòng KC1 của 2.34.0). Kho chờ nhận: `invest` trước
(thí điểm nền thiết kế ở bậc M1), `crm` sau. Mốc đi **làn V**, không dựng răng mới. Năm gói `acceptance-gate`,
`feature-loop`, `dieu-phoi`, `road-map`, `tri-thuc` cùng lên `2.35.0` (`acceptance-gate`, `feature-loop`, `dieu-phoi` đổi
vật; `road-map`, `tri-thuc` chỉ đổi số); `diagram-design` giữ `2.7.1`. Thẻ `v2.35.0` gắn vào commit gộp PR mốc.

**Vì sao 2.35.0** (minor): bề mặt mới, không gãy đường đọc-cũ — lệnh `design-floor-*` và khoá `executors.design.floor`,
khối cấu hình `design_floor`, cờ `--require-measured` của design-gate, lệnh `hoi` / `hoi-xong` và `xem --khung` của gói
`dieu-phoi`, khoá `muc_tieu` của gói đợt, khoá `vung` của hàng lộ trình. Kho không khai `design.surface_globs` là M0 và
không thấy gì đổi; vắng cờ thì design-gate giữ mọi mã thoát. Ba đổi hành vi chạm kho đang dùng, khai thẳng ở «Ai bị
ảnh hưởng» dưới: kho đã khai `design.surface_globs` thành M1 và thấy dòng bậc ở S0; «cần anh» lớn hơn ở kho có câu
giám sát; `p0_count` của chế độ dom không còn đếm phát hiện không đo được.

### Lõi Design OS vendored và bản vá A (hồ sơ `design-floor-vendor-va-ban-va-a`, hàng FL2, T3)

Gốc: acceptance-gate-kit/_acceptance/design-floor-hop-dong-nhap/ — bước 1 giao hợp đồng nhập, tệp khoá và bộ đo lấy mã
upstream qua mạng; DF-07/DF-08 đỏ vì `ui gate` và `ui autofix --write` ghi sổ sự kiện vào `design/` gần nhất. Vòng này
đưa mã vào kit. Không gửi PR upstream (chủ kho 26/10): mọi sửa đổi là bản vá cục bộ, ghi sổ.

- **Vật:** lõi gọn Design OS vendored vào kit khớp từng băm của tệp khoá, sổ LOCAL-PATCHES, bản gói dựng tất định, và
  bản vá A làm mọi lệnh chấm không ghi tệp (`design-floor/`). Job CI `design-floor` chấm bản vendored, không lấy mã
  upstream qua mạng.
- **Giới hạn đã khai:** 2 mục khai từ thiết kế và 7 mục chọn ở Cổng Bằng chứng 27/10, ở Notes hợp đồng — đáng nhớ
  nhất: «`ui gate --family <slug>` và tệp token mang trường `persona` trả `FAMILY_NOT_FOUND` trên bản gói, vì
  `knowledge/personas/families.json` không vendor.» và Ngoài-4 «Phép kiểm «lệnh chấm không ghi tệp» có thể xanh cả khi
  một lệnh chết ngay từ đầu; mọi lượt đo hiện các lệnh đều chạy.»

### Bản vá B, C, D cho lõi vendored (hồ sơ `design-floor-ban-va-b-c-d`, hàng FL3, T2)

Gốc: acceptance-gate-kit/_acceptance/design-floor-hop-dong-nhap/ — DF-01, DF-03, DF-04, DF-05, DF-06 và phần figma của
FN-02 còn đỏ có chủ đích trên bản gói sau FL2 (#427, bản vá A). Hàng FL3 đóng chúng bằng ba bản vá cục bộ ghi sổ
LOCAL-PATCHES; không gửi PR upstream (chủ kho 26/10).

- **Vật:** mã thoát ba trạng thái, đầu vào tường minh, không module Figma trong đóng kín; khối máy hết giới hạn.
- **Giới hạn đã khai:** 1 mục khai từ thiết kế và 5 mục chọn ở Cổng Bằng chứng 27/10, ở Notes hợp đồng — đáng nhớ
  nhất: Ngoài-3 «Với trang không đo được, dòng chữ và trường kết quả vẫn ghi «PASS» dù mã thoát là không-đo-được; máy
  gác cổng đọc mã thoát nên không bị lừa.»

### Móc S0 và S1 của nền thiết kế (hồ sơ `design-floor-moc-s0-s1`, hàng FL4, T2)

Gốc: acceptance-gate-kit/_acceptance/design-floor-hop-dong-nhap/ — phạm vi v1 chốt 26/10: flow lint ở Cổng 1 và định
tuyến chỉ mục tri thức thiết kế. Bản gói `design-floor/dist/ui.mjs` đã đúng hợp đồng nhập sau FL3 (#429) nhưng chưa
bước nào của vòng gọi nó.

- **Bậc của kho** (`scripts/design-floor-bac.mjs`, chỉ đọc), xét từ cao xuống, khai báo hỏng không nâng bậc: **M3**
  `design_floor.niem_phong` khác rỗng trên nền M2 (người ghi — lệnh không có đường ghi) · **M2** `design_floor.tokens` VÀ
  `design_floor.registry` cùng khai, cả hai tệp có thật · **M1** `design.surface_globs` khớp ít nhất một tệp git theo
  dõi · **M0** còn lại — không in gì. M1–M3 mà kho chưa nối `executors.design.floor` → thêm một dòng stderr nói S4
  chưa chấm tuân thủ design system.
- **S0** nói lại nguyên văn dòng bậc (khối `DESIGN-FLOOR-S0` của SKILL feature-loop); máy không tự nâng bậc hay ghi
  `design_floor.niem_phong`. **S1** ghi `_acceptance/<slug>/design-floor.json` và một dòng vào `usage-report.md`, in bậc
  kho · tri thức thiết kế (chỉ mục + tối đa hai tệp, kèm token) · kế hoạch dùng lại · luồng; thẻ Cổng Phạm vi in thành
  khối «Sàn thiết kế» — thông tin, không câu hỏi (khối `DESIGN-FLOOR-S1`).
- **Giới hạn đã khai:** 2 mục khai từ thiết kế và 16 mục chọn ở Cổng Bằng chứng 28/10, ở Notes hợp đồng — đáng nhớ
  nhất: «Kho có giao diện mà chưa khai `design.surface_globs` đọc ra M0 — bậc đi theo khai báo, không theo dò đuôi
  tệp.» và Ngoài-12 «Tệp kết quả Sàn thiết kế hỏng thì thẻ Cổng Phạm vi bỏ khối im lặng, không bật cờ vàng.»

### Móc cuối S3 và S4 của nền thiết kế (hồ sơ `design-floor-moc-s3-s4`, hàng FL5, T2)

Gốc: acceptance-gate-kit/_acceptance/design-floor-hop-dong-nhap/ — bước 4 của kế hoạch design-floor: cuối S3 autofix
và sinh lại, S4 tuân thủ design system, không ghi gì sau S4. FL4 (#433) đã có bậc M0–M3 và khối «Sàn thiết kế»; FL1
(#434) đã có trạng thái KHÔNG-ĐO-ĐƯỢC ở cổng thiết kế.

- **Cuối S3** (`scripts/design-floor-s3.mjs`, khối `DESIGN-FLOOR-S3`), trước khi hợp đồng sang `implemented`: M1–M3
  autofix các trang HTML mà vòng đổi, chạy các lệnh `design_floor.sinh_lai`, rồi MỘT commit chỉ gồm tệp chính lệnh làm
  đổi — việc dở chưa commit giữ nguyên. M0 → không in, không ghi.
- **S4** (`scripts/design-floor-s4.mjs --root .`, chỉ đọc): kho nối thành `executors.design.floor`; hồ sơ chạm giao diện
  khai một eval `script` với `cmd: config:executors.design.floor`. Chặn theo bậc: M1 hex thô · M2 hex thô, độ phủ token
  chỉ cảnh báo · M3 cả hai; không đo được không bao giờ chặn. Thoát 0 không chặn · 2 chặn · 1 lệnh ui lỗi.
- **Giới hạn đã khai:** 2 mục khai từ thiết kế và 6 mục chọn ở Cổng Bằng chứng 28/10, ở Notes hợp đồng — đáng nhớ
  nhất: «Độ phủ token chỉ đo được trang `.html`; kho giao diện `.tsx` chỉ có kiểm hex thô ở S4.» và «Bắt theo mẫu ký
  tự, không hiểu ngữ cảnh: chuỗi `#abc` trong chữ hiển thị hay mã neo trang (`href="#abc"`) cũng bị bắt.»

### Cổng thiết kế chế độ dom thôi chặn oan khi không đọc được màu (hồ sơ `design-gate-khong-do-duoc-ba-nguyen-nhan`, hàng FL1, T3)

Gốc: `_acceptance/design-gate-che-do-chat/` (trạng thái KHÔNG-ĐO-ĐƯỢC + mã 5 dưới `--require-measured`) và hạt giống
`docs/plans/2026-10-25-hat-giong-design-gate-dom-mu-tailwind-v4.md`. Đo chéo 26/10: P0 tương phản của cổng thiết kế chế
độ dom sai 5 trên 8 lần và chặn oan 3 trên 5 tệp.

- **Phát hiện tương phản không đo được thành `KHONG-DO-DUOC` kèm mã nguyên nhân**, không còn là P0 chặn:
  `css-khong-ap-duoc` (tệp CSS không áp được — `@layer` dưới jsdom, CSS cục bộ hỏng hay vắng — trừ phần tử ghim cả
  màu chữ lẫn nền ở style nội dòng) · `nen-to-tien-bi-bo` (nền khai ở tổ tiên mà jsdom không đọc được, như
  `background: var(--bg)`) · `chu-gradient` (chữ cắt theo nền gradient). Phát hiện mang `do_duoc: false` + `ly_do`,
  không vào `blocking`, không tính vào `p0_count`; JSON thêm `khong_do_duoc` và một dòng stderr nêu mã.
- **FAIL > KHONG-DO-DUOC > PASS:** tương phản đo được trên cùng trang vẫn `REJECT` 2. Mã thoát giữ nguyên: 0, và 5
  dưới `--require-measured`. Trang CSS hỏng mà không có phát hiện tương phản vẫn `PASS` như cũ.
- **Bộ dò Impeccable vendored không đổi byte nào.** Job CI mới `design-eval` cài jsdom ghim 24.1.3 và chạy cả ca dom.
- **Ai bị ảnh hưởng:** đo 27/10 trên crm, artifact-platform, onehub-invest — 164 đích dom, 0 phán quyết đổi. Kho đọc
  `p0_count` như tổng mọi P0 sẽ không còn thấy phát hiện không đo được trong số ấy.
- **Làm gì khi update:** không gì. Kho muốn «không đo được» thành đỏ thì bật `--require-measured` (mã 5).
- **Giới hạn đã khai:** 6 mục chọn ở Cổng Bằng chứng 27/10, ở Notes hợp đồng — đáng nhớ nhất: Ngoài-9 «Thân trang chỉ
  có dải màu mà các điểm màu viết bằng hàm màu lạ (color-mix…) bị gọi là «nền bị bỏ»: chữ nhạt thật thành không đo
  được (thoát 0, mã 5 dưới chế độ chặt).»

### design-gate có chế độ chặt tuỳ chọn `--require-measured` (hồ sơ `design-gate-che-do-chat`, T2)

Gốc: crm 25/10, vòng VK10 `che-do-soan-bo-okr` (kit 2.33.1) — `design-gate.mjs --target <.tsx> --mode static` trả
`KHONG-DO-DUOC`, `do_duoc:false` mà mã thoát 0, nên eval gọi nó trong `for … || exit 1` xanh rỗng và chiều đỏ không bao
giờ đỏ; chủ kho crm xin sửa. Đây là ngưỡng mở lại đã khai ở hồ sơ `_acceptance/nen-dieu-kien-va-static-khong-do-duoc/`
(«≥1 kho xin chế độ chặt»).

- **Cờ mới, bật theo lựa chọn:** `design-gate.mjs <đích> … --require-measured` — đích không phải HTML (`.tsx`,
  `.jsx`, `.vue`, không đuôi…) thoát **5** thay vì 0, JSON thêm `require_measured: true`, dòng stderr đổi đuôi thành
  `--require-measured: thoát 5`. Áp ở cả `--mode static` lẫn `--mode dom`; dom quyết bằng đuôi TRƯỚC khi nạp
  jsdom (kho không có jsdom nhận 5, không phải 3). Lỗi chặn static thấy được trên `.tsx` vẫn `REJECT` mã 2.
  Đích HTML không đổi dù có cờ.
- **Vắng cờ: không đổi một mã thoát nào** — mười ô của bộ ca cũ vẫn bằng bản gốc. Không kho nào đổi màu khi nhận bản.
- **Giới hạn gọi tên:** static không tính màu hay độ tương phản, kể cả trên HTML đã dựng (chữ `#eee` trên nền
  trắng: static PASS, dom REJECT `low-contrast`). Chiều đỏ về màu cần `--mode dom` hoặc ui-check Tier B.
- **Giới hạn đã khai:** 4 mục chọn ở Cổng Bằng chứng 26/10, ở Notes hợp đồng — đáng nhớ nhất: Ngoài-3 «Ở chế độ dựng
  trang có cờ, tệp thành phần đã xoá hay gõ sai đường vẫn nhận «không đo được» — kho ghim mã 5 ở chế độ này phải tự
  kiểm đường dẫn, kẻo xanh rỗng khi tệp mất.»
- **Ai bị ảnh hưởng:** crm có 61 khoá `*_san_thiet_ke` (static trên `.tsx`, 57 eval đang chạy + 4 ô `not-run`);
  artifact-platform có 23 khoá dom trên `.tsx`. Cả hai xanh rỗng như hôm nay cho tới khi tự thêm cờ.
- **Làm gì khi update:** không chép lại tệp nào. Muốn chặn cứng: thêm `--require-measured` vào lệnh design-gate
  của kho (một chỗ nếu eval đi qua `config:executors.design.gate`) — eval đang chấm tệp nguồn sẽ đỏ ở lượt ghim
  kế; đổi chúng sang chấm HTML đã dựng bằng dom, hoặc khai `expected_exit: 5`. Vòng `… || exit 1` gộp mã 5
  thành 1; muốn pin thấy 5 thì dùng `|| exit $?`. Bản kit cũ bỏ lặng cờ lạ — thêm cờ khi chưa nhận bản này thì vẫn
  xanh rỗng; chạy một lần trên một `.tsx` và thấy mã khác 0 trước khi tin.

### Vùng giao việc đi từ cắt lượt (hồ sơ `vung-giao-viec-tu-cat-luot`, T2)

Gốc: đề bài phanlemanh/acceptance-gate-kit#430: đợt «vỏ khu Mục tiêu» của một kho tiêu thụ (25–27/10) «toàn đợi ghim» —
19 lần ghim, 21,2 giờ khoá máy, 6/17 lượt ghim đỏ vì thước của hàng khác gãy, 0 lượt chắc chắn vì lỗi sản phẩm. Lịch
biết tệp (2.34.0) có chạy nhưng 22/22 hàng chỉ khai thư mục hồ sơ của chính mình, nên 0 lần tự xếp `sau`. Vòng chỉ cho
lịch một cảm biến đúng: không đổi cách chấm, không đổi làn ghim, kho không khai vùng giữ y hành vi hiện nay.

- **Cắt lượt ghi vùng:** mỗi hàng của đợt mang `vung` — mảng glob tương đối gốc kho, theo màn của câu giao. Răng phủ:
  `vung-qua-rong`, `vung-sai-kieu`, `vung-trung-moi-hang` là lỗi; `chua-khai-vung`, `vung-chi-ho-so` là cảnh báo.
- **Gói đợt chép vùng:** gói khai `nguon_hang` thì hàng thi công không khai `ranh_gioi` nhận `ranh_gioi` = `vung` của
  hàng lộ trình; hàng khai tay giữ nguyên. `hang them <mã>` cũng nhận vùng ấy (`--ranh-gioi` thắng).
- **Phiên thợ khai thêm ở Cổng Phạm vi:** `hang vung <mã|slug> --vung <glob,glob>` GỘP vào `ranh_gioi`, từ chối glob
  không có thư mục tĩnh mà không ghi gì; hàng đang làm hay đã ký ở dãy khác mà chồng → sự kiện `trung-tep` mang
  `luc: cong-pham-vi` và một dòng cảnh báo — chỉ báo, không ghi `sau`, không đụng khoá.
- **Giới hạn đã khai:** 9 mục chọn ở Cổng Bằng chứng 28/10, ở Notes hợp đồng — đáng nhớ nhất: Ngoài-3 «Lộ trình sửa
  tay ghi vùng quá rộng (`**`, `*.tsx`) vẫn được gói đợt chép thành vùng của hàng, làm cả đợt chạy nối tiếp mà không
  cảnh báo; bước cắt lượt chặn ca ấy.»

### Khung đợt định vị và bộ đếm «cần anh» đếm đủ (hồ sơ `khung-dot-dinh-vi`, ADR 0027 bước a–b, T2)

ADR 0027 bước (a) và (b), mở sau khi vòng `vung-giao-viec-tu-cat-luot` gộp (4918210d, 28/10). Ô cơ hội neo `Gốc:` vào
hồ sơ `trang-thai-dot-dieu-phoi-tho` — hồ sơ đã dựng dải và pane đang hỏng. Hai lỗ: (a) câu phiên giám sát hỏi chủ kho
trong chat không vào sổ nào, nên dải báo «cần anh 0» khi chủ kho đang có việc; (b) pane «Đợt» in chữ gỡ lỗi của lệnh
`xem` — không mục tiêu, không tiến độ, mã trần, giờ UTC có mili-giây.

- **Câu giám sát hỏi chủ kho vào sổ của đợt.** Lệnh mới `dieu-phoi.mjs hoi --cau "<câu>"` (hay `--cau -` đọc stdin)
  ghi sự kiện `hoi-chu-kho` mang `can_phan:false` — Monitor của giám sát không thức vì câu của chính nó;
  `hoi-xong <mã>` đóng câu. Câu rỗng, mã không mở → thoát 2, không ghi gì.
- **«Cần anh» đếm mọi nguồn bằng một hàm** (`canAnh` ở `khung.mjs`): tệp chờ người và yêu cầu `can-nguoi` của thợ,
  lời báo sức khoẻ máy, câu giám sát đang mở. Dải và khung dùng cùng hàm nên hai số không lệch.
- **Pane «Đợt» vẽ khung định vị** (`chuKhung`): mục tiêu đợt · tiến độ «xong / đang làm / đang chấm / chờ / rảnh» ·
  «CẦN ANH: n» kèm là gì, ở phiên nào, bao lâu · mỗi dãy một dòng việc mang tên ngắn từ tệp lộ trình, mã trong
  ngoặc · giờ địa phương tương đối. CLI thêm `xem --khung` (in khung) và `xem --json --khung` (dữ liệu của nó, mod gọi).
- **Không đổi:** dòng `xem`, `xem --json` (khi không có câu giám sát mở — có câu thì thêm khoá `hoi_chu_kho`), dải
  của kho không có câu nào, lệnh `/dieu-phoi:xem`, bảng đợt.
- **Ai bị ảnh hưởng:** kho dùng gói điều phối. Kho có giám sát đặt câu trong chat sẽ thấy «cần anh» lớn hơn hôm nay.
- **Làm gì khi update:** khai `muc_tieu` (chuỗi) trong `hang-viec.json` của gói đợt để khung có dòng mục tiêu;
  vắng thì khung hiện cờ vàng. Tên việc tra qua `tep` + `ma` của hàng thi công hoặc `nguon_hang` của gói.
- **Giới hạn đã khai:** 2 mục khai từ thiết kế (một kế thừa từ hồ sơ `trang-thai-dot-dieu-phoi-tho`) và 6 mục chọn ở
  Cổng Bằng chứng 28/10, ở Notes hợp đồng — đáng nhớ nhất: giám sát GỌI `hoi` là chỉ dẫn, không có máy giữ — ngưỡng
  mở vòng hook: ≥1 lần trên đợt thật dải báo thiếu một câu giám sát đã hỏi; và Ngoài-1 «Khoảng nửa tên việc trên khung
  có thể mang thêm dấu « ở đầu, lệch chữ với trang lộ trình.»

### Ngoài vòng

- **ADR 0027 — bốn chân của một quyết định của người** (#435): mỗi chỗ người quyết được dựng bằng bốn chân theo thứ tự
  phụ thuộc; bước (a)–(b) dựng ở `khung-dot-dinh-vi`, bước (c)–(f) đi sau mốc kế tiếp được một kho tiêu thụ nhận.
- **Báo cáo đóng đợt `design-floor-2710`** (#439).

**Ai bị ảnh hưởng:**

- Kho đã khai `design.surface_globs` khớp tệp: thành **M1**; S0 in một dòng bậc, kèm một dòng nói S4 chưa chấm tuân thủ
  design system tới khi nối `executors.design.floor`; cuối S3 có thể có một commit máy (autofix trang HTML, lệnh sinh
  lại). Kho không khai: M0, không đổi gì.
- Kho đọc `p0_count` của chế độ dom như tổng mọi P0: phát hiện tương phản không đo được không còn trong số ấy (FL1).
- Kho có đợt Điều phối mà giám sát đặt câu cho chủ kho trong chat: «cần anh» lớn hơn hôm nay; pane «Đợt» vẽ khung.
- Kho dùng cắt lượt với lộ trình: hàng mới mang `vung`; lộ trình đã dùng `vung` mà hàng thiếu thì cảnh báo.

**Đường đọc-cũ:** kho không khai `design.surface_globs` → M0, không dòng nào; vắng `--require-measured` → mọi mã thoát
như cũ; lộ trình không có `vung` và không ai gọi `hang vung` → lịch y như trước; gói đợt vắng `muc_tieu` → khung hiện cờ
vàng; dòng `xem` và `xem --json` không đổi khi không có câu giám sát mở.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI:** chép lại từ thẻ `v2.35.0` hai tệp `scripts/cat-luot.mjs` và `dieu-phoi/scripts/hinh-dang.mjs` CHỈ khi
  kho khai `tin_hieu` (nhãn `[only-if-declared: tin_hieu]`). Các tệp còn lại giống từng byte `v2.34.0`. Nền thiết kế
  chạy từ bản kit cài (`<acceptance-gate>/scripts/design-floor-*.mjs`, `design-floor/dist/ui.mjs`), không vào danh sách
  chép.
- **Máy dev: cài các gói theo ĐÚNG THẺ `v2.35.0` ở MỌI phạm vi** — kể cả `dieu-phoi`, `tri-thuc` nếu dùng — rồi kiểm
  `node <gốc gói acceptance-gate>/scripts/kiem-ban-cai.mjs --may --ref v2.35.0 --root <bản clone kit đã git fetch
  --tags>` — `TỔNG KẾT: ĐẠT …`. Mở phiên MỚI.
- **Lệnh trỏ bộ đệm có số** (`…/acceptance-gate/2.34.0/scripts/…`) trong `_acceptance/config.yaml` phải đổi số — hay
  tốt hơn, đổi sang đường không số (GUIDE §5.3).

**Người cắt mốc kit:** sau khi gắn thẻ chạy `node scripts/kiem-ban-cai.mjs --ref v2.35.0` (KC1) — dòng TỔNG KẾT ghi vào
hồ sơ `release-2-35-0`.

**invest** (đang ở 2.34.0, thí điểm nền thiết kế ở bậc M1): danh sách việc và đường nền DO1 ở
`docs/handoff/2026-10-29-nhan-2-35-0-invest-thi-diem-design-floor.md`.

**crm, theo thứ tự** (đang ở 2.34.0, nhận sau invest):

1. **Cài theo thẻ `v2.35.0`** mọi gói crm đang dùng; kiểm `kiem-ban-cai.mjs --may --ref v2.35.0`. Mở phiên MỚI.
2. **Lớp chép CI từ thẻ** (`git archive v2.35.0`): hai tệp ở gạch trên (crm khai `tin_hieu`).
3. **Vùng giao việc:** đợt kế cắt lượt bằng skill `cat-luot` bản mới để hàng mang `vung`; gói đợt khai `nguon_hang` thì
   `ranh_gioi` tự đến. Ngưỡng 2 của hồ sơ vùng giao việc (lần ghim / PR gộp ≤ 0,5 trên một đợt có chồng vùng) đếm trong
   14 ngày sau khi nhận.
4. **Khung đợt:** khai `muc_tieu` trong `hang-viec.json` của gói đợt.
5. **design-gate chặt:** muốn chặn cứng thì thêm `--require-measured` (mục `design-gate` trên) — 61 khoá `*_san_thiet_ke`
   xanh rỗng tới khi thêm cờ.
6. **Nền thiết kế:** chờ kết quả thí điểm ở invest trước khi khai `executors.design.floor`.

**Năm dòng số của luật (c)** — tám vòng có lượt chấm trong cửa sổ (giờ VN). Cùng định nghĩa mốc 2.34.0: làm-xong =
commit đưa hợp đồng sang `implemented` · ký = commit đầu đưa `status:` sang `signed-off` · gộp = commit đầu trên lối
cha-đầu của nhánh chính có commit ký là tổ tiên. Dòng 2 đếm từ sổ quyết định và commit cổng. Dòng 4–5 từ bảng vai trò
của `usage-report.md`.

| Hồ sơ | 1 · làm-xong→ký · ký→gộp · lượt chấm | 2 · gọi người trong / ngoài (trần) | 3 · lượt bị hạ tầng đốt | 4 · out-token S4 · vật / tìm-lỗi / tổng hợp % | 5 · phút máy / lượt |
|---|---|---|---|---|---|
| `design-gate-che-do-chat` (T2) | 3 g 04 · 0 g 59 · 1 (PASS) | 2 / 0 (3) — Phạm vi, Bằng chứng; mở không qua Cổng Đáng | 0 | 62 213 · 51,7 / 26,7 / 21,6 | 46 |
| `design-floor-vendor-va-ban-va-a` (FL2, T3) | 1 g 36 † · 0 g 58 · 1 (PASS) | 2 + Đáng chung / 0 (4) — Phạm vi (Hỏi-1, CỘNG), Bằng chứng | 0 | 99 169 · 41,8 / 43,1 / 15,1 | 49 |
| `design-floor-ban-va-b-c-d` (FL3, T2) | 3 g 25 · 0 g 58 · 1 (PASS) | 1 + Đáng chung / 0 (3) — Phạm vi làn V; Bằng chứng | **1** (lượt 1 đứt giữa chừng: phiên mất đăng nhập, 25/39 tác tử lỗi; nối lại cùng lượt) | 156 025 (chỉ phần nối lại) · 32,5 / 56,2 / 11,4 | 90 (phần nối lại) |
| `design-floor-moc-s0-s1` (FL4, T2) | 6 g 47 · 2 g 23 · 3 (lượt 1: một lỗi trong hợp đồng — bộ đọc cấu hình riêng, vật sửa; lượt 2 REJECT chỉ vì P179; lượt 3 PASS) | 2 + Đáng chung / 0 (3) — Phạm vi (Hỏi-1 CỘNG, Hỏi-2), Bằng chứng | **1** (lượt 2, P179) | 240 319 · 37,1 / 42,6 / 20,3 | 49 · 47 · 45 = 141; ghim lại sau chữ ký 48 |
| `design-gate-khong-do-duoc-ba-nguyen-nhan` (FL1, T3) | 8 g 28 · 7 g 25 · 4 (lượt 1 PASS → Cổng Bằng chứng trả lại sửa năm mục; lượt 2 PASS → trả lại đổi khuôn nhánh nền; lượt 3 REJECT: ca đối chứng không thể đỏ, chạm trần lượt; lượt 4 PASS) | 3 + Đáng chung / **3** (4) — trong: Phạm vi (Hỏi-1, Hỏi-2), Gate 1.5, Bằng chứng; ngoài: Bằng chứng trả lại ×2, lối ra ở trần lượt ×1 | 0 | 355 663 · 43,7 / 37,4 / 19,0 | 52 · 48 · 51 · 53 = 204 |
| `design-floor-moc-s3-s4` (FL5, T2) | 1 g 04 · 0 g 59 · 1 (PASS) | 2 + Đáng chung / 0 (3) — Phạm vi (Hỏi-1 CỘNG, Hỏi-2), Bằng chứng | 0 | 93 783 · 41,6 / 39,8 / 18,6 | 53 |
| `vung-giao-viec-tu-cat-luot` (T2) | 4 g 27 · 3 g 20 · 2 (lượt 1 REJECT: hai mảnh suite mjs đỏ vì vật; lượt 2 PASS) | 3 / 0 (3) — Đáng, Phạm vi (Hỏi-1, CỘNG), Bằng chứng | 0 | 149 906 · 41,6 / 35,3 / 23,1 | 51 · 51 = 102; ghim lại sau chữ ký 49 + 45 |
| `khung-dot-dinh-vi` (T2) | 3 g 09 · 9 g 15 · 2 (lượt 1 REJECT: 11/11 tiêu chí đạt, bốn bộ ca của kho đỏ — bản đồ lệch, KT-8, P179, RT13; lượt 2 PASS) | 2 / 0 (3) — Đáng, Bằng chứng; Phạm vi làn V | **1** (lượt 1: cả bốn cái đỏ là nghi thức kho, không đổi mã vật) | 149 948 · 49,5 / 30,2 / 20,3 | 51 · 65 = 116 |

† FL2 không có commit đưa hợp đồng sang `implemented` (đi thẳng `approved` → `verified`); làm-xong đọc ở commit vật
cuối. «Đáng chung» = một lượt Cổng Đáng cho FL1–FL5 ở thẻ khởi tạo đợt `design-floor-2710` (27/10). Gộp tám hồ sơ:
1 307 026 out-token, vật 41,6 / tìm-lỗi 39,6 / tổng hợp 18,8 %; 801 phút S4. Trung vị tám vòng: làm-xong → ký **3 g 17**,
ký → gộp **1 g 41**. Ký chưa gộp: 0. Gọi người: 17 trong thiết kế + 3 ngoài (đều ở FL1) + 1 Đáng chung = 21 cho 8 kết
quả gộp.

**Đọc số:** ký → gộp ≤ 1 giờ ở bốn vòng gộp ngay sau ký (che-do-chat, FL2, FL3, FL5). Bốn vòng trên 2 giờ: FL1 (ký 22:55,
gộp sáng hôm sau) và khung đợt (ký 18:16, gộp 03:30 khi chủ kho gõ «Gộp và cắt bản») chờ người bấm gộp; FL4 và vùng
giao việc ghim lại sau chữ ký (48′; 49′ + 45′ — ba lần, 142 phút máy, ngang ba lượt chấm). **Ba lượt gọi người ngoài thiết
kế đều ở FL1** — Cổng Bằng chứng trả lại hai lần sau PASS để sửa trong vòng, rồi một lối ra ở trần lượt; đây là chỗ cắt
cho cửa sổ kế (nếu tính trả lại là trong thiết kế thì FL1 = 5 + Đáng chung / 1, vẫn vượt trần T3 4). Ba lượt bị hạ tầng
đốt: P179 (sổ known-limits thiếu hàng cho đề xuất của lượt trước) lặp lần thứ ba qua hai cửa sổ — FL4 lượt 2 và một
trong bốn cái đỏ của khung đợt lượt 1; một lượt đứt vì phiên mất đăng nhập (FL3). **Làn đối chứng code cũ không đo ở
14/15 lượt** (tác tử baseline không có công cụ ghi tệp) — không lượt nào đổi phán quyết vì nó, nhưng chiều đỏ đối chứng
của cả cửa sổ chỉ dựa vào các ca đỏ trong bộ ca. **Thước ký → gộp của kit vẫn mù ở 5/8 vòng** (`do-gop.mjs` trả rỗng
khi PR có commit sau chữ ký — hạt giống `docs/plans/2026-10-25-hat-giong-do-gop-mu-khi-co-commit-sau-ky.md` chưa làm);
bảng đọc năm vòng ấy bằng tay theo đúng định nghĩa của tệp. **Điều kiện tin cậy:** (i) `git diff v2.34.0 <cây mốc> --
feature-loop/workflows/ feature-loop/agents/` rỗng — đường verdict finder → refute → REJECT không đổi thành phần; (ii)
lượt chấm sai do phép-đo-tự-dối giữa hai mốc: 0.

**Dự báo năm dòng cho thay đổi của mốc này:** 1 ↓ ký → gộp ở kho có đợt (vùng giao việc: lịch xếp nối tiếp hai hàng cùng
sửa một màn thay vì ghim lại sau ký) · 2 = (khung đợt chỉ làm câu đang chờ hiện ra; khối định vị trên lời mời cổng —
bước (c) của ADR 0027 — chưa vào) · 3 ↓ (FL1: cổng dom thôi chặn oan khi không đọc được màu) · 4 ↑ nhẹ ở kho M1–M3
(một eval `executors.design.floor` mỗi hồ sơ chạm giao diện) · 5 =.

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .` (29/10).
**N không tăng so với mốc 2.34.0 (vẫn 1) — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.34.0 — 25/10/2026

Mốc mang **tầng tri thức theo LLM Wiki** (đợt `tri-thuc-2410`, TT1–TT5) và phần kit của gói «cắt 80 % thời gian ký →
gộp» chủ kho chốt 23/10 (C, H, I và phần đo của A). Chủ kho 23/10 đổi North Star kit sang «gộp được» (#400) rồi quyết
gom hai đợt vào CÙNG một bản phát hành, để các kho tiêu thụ nhận trong ngày 25/10. Có **tám hồ sơ được ký** — tập đối
chiếu bằng `scripts/rel-cua-so.sh` (AC-4 của hồ sơ mốc): `suc-khoe-cho-trong-va-toc-do` (SK1, #395),
`anh-co-that-trong-ho-so` (#399), `ky-den-gop` (#402), `kho-tri-thuc-va-lint` (TT1, #406), `o-mo-viec-mang-nguon`
(TT3, #407), `ghi-tri-thuc` (TT2, #408), `thiet-ke-nap-tri-thuc` (TT4, #409), `vong-don-le-tra-tri-thuc` (TT5, #411).
Ngoài vòng: #400 (North Star đổi đích sang gộp-được, luật (c) dòng 1 kéo tới gộp) · #401 (làn đối chứng của lượt chấm
chạy được trong worktree cô lập) · #404, #405 (cắt đợt `tri-thuc-2410`, năm ô qua Cổng Đáng) · #394, #397 (hạt giống).
Kho chờ nhận: `crm`, `invest`. Mốc đi **làn V**, không dựng răng mới. Năm gói `acceptance-gate`, `feature-loop`,
`dieu-phoi`, `road-map`, `tri-thuc` cùng lên `2.34.0` (`acceptance-gate`, `feature-loop`, `dieu-phoi` đổi vật;
`tri-thuc` là gói mới; `road-map` chỉ đổi số); `diagram-design` giữ `2.7.1`. Tag `v2.34.0` gắn vào commit gộp PR mốc.

**Vì sao 2.34.0** (minor): bề mặt mới, không gãy đường đọc-cũ — gói mới `tri-thuc` (`/tri-thuc:kiem`, `/tri-thuc:ghi`),
khối cấu hình mới `tri_thuc`, lệnh `gop` của gói `dieu-phoi` và khoá `gop_khong_chay_lai_ci`. Kho không khai `tri_thuc`
thì ô, thẻ và bước thiết kế như cũ; đợt không bật khoá gộp thì lệnh gộp chỉ gộp khi nhánh đã chứa đỉnh nhánh chính.
Hai đổi hành vi chạm kho đang dùng, khai thẳng ở «Ai bị ảnh hưởng» dưới: PR chuyển sẵn sàng lúc trình thẻ Cổng Bằng
chứng (ky-den-gop, hạng H) và ngưỡng swap / RSS của cấu hình đợt hết tác dụng (SK1).

### Sức khoẻ máy đo chỗ trống và tốc độ (hồ sơ `suc-khoe-cho-trong-va-toc-do`, hàng SK1, T2)

Gốc: crm-onehub/_acceptance/dieu-phoi-hai-tang/. Bộ phát lịch chỉ giảm tải khi máy đang nghẹt thật hoặc thiếu chỗ cho
làn sắp cấp — không vì swap cũ hay một tiến trình lớn hợp lệ; lượt chạy dưới tải được gắn nhãn và thử lại một lần thay
vì tính là lỗi vật; ngưỡng hiệu chuẩn từ các lượt bị hạ tầng đốt. Lý do làm: trên macOS swap đã dùng giảm vài chục MB
mỗi giờ khi máy rảnh, nên một máy từng nghẹt đứng ở giảm tải nhiều giờ khi áp lực đã về bình thường (M5 20/10: hơn 2
giờ; MacBook Pro 21/10: hàm thật trả giảm tải với áp lực mức 1, trống 46 %).

- **Cấu hình đợt:** `suc_khoe` của bản mẫu `dieu-phoi.config.json` còn `{ "ap_luc_muc": 2 }`; `swap_gb`, `rss_gb` không
  còn tác dụng.
- **Giới hạn đã khai:** 11 mục chọn ở Cổng Bằng chứng 21/10, ở Notes hợp đồng — đáng nhớ nhất: Ngoài-5 «Kho còn ngưỡng
  swap hay RSS cũ trong cấu hình đợt không được báo rằng các ngưỡng ấy đã hết tác dụng; các đoạn đọc «cần người» theo
  RSS thành mã chết.» và Ngoài-7 «Đơn chờ vì khoá đang bận vẫn hiện lý do «thiếu chỗ» và phát sự kiện thieu-cho, nên
  người đọc tưởng máy hết bộ nhớ.»

### Ảnh có thật trong hồ sơ (hồ sơ `anh-co-that-trong-ho-so`, T2)

Gốc: `_acceptance/lop-bang-chung-nhin-thay/`. Thẻ Cổng Bằng chứng và trang bằng chứng chỉ tính một ảnh khi tệp có thật
dưới evidence/ của chính hồ sơ; đường ra thư mục lượt chấm, đường tuyệt đối hay tệp không có thì báo thiếu ảnh kèm
nguyên nhân. Lý do làm: thẻ tính một eval ui-check «đạt — xem frame ở trang bằng chứng» chỉ từ chuỗi `screenshot:`
trong báo cáo; không bước nào kiểm tệp. Ở một kho tiêu thụ (22/10) hai hồ sơ đã ký được tính «có ảnh» mà không chứa
ảnh nào, và 26/293 đường trỏ ra thư mục lượt chấm hay đường tuyệt đối của máy khác.

- **Giới hạn đã khai:** 6 mục chọn ở Cổng Bằng chứng 22/10, ở Notes hợp đồng — đáng nhớ nhất: Ngoài-1 «Lệnh đo kho thật
  báo «khớp» (thoát 0) cả khi không so được hồ sơ nào — người chạy tay phải đọc dòng «lỗi đọc» và số hồ sơ.»

### Ký → gộp có chủ máy (hồ sơ `ky-den-gop`, T2)

Gốc: `_acceptance/dieu-phoi-dong-goi-loi/` (Ngoài-3, Ngoài-4). Đoạn ký → gộp có thước và có chủ máy — lịch tránh giao
hai việc cùng tệp, PR sẵn sàng ngay lúc trình thẻ Cổng Bằng chứng, gộp không chạy lại CI khi PR không trùng tệp với
nhánh chính, và lệnh đếm đợt trừ được giờ ký khỏi giờ gộp. Lý do làm: đợt 19–23/10 của một kho tiêu thụ — 39 PR, mở →
gộp trung vị 8,3 giờ; 52 commit ghim lại; 254 lần gộp nhánh chính vào nhánh. Quyết định chủ kho 23/10/2026 cho hạng I,
nguyên văn: «Chấp nhận rủi ro mục I: PR không trùng tệp với PR vừa gộp thì gộp ngay, không chạy lại CI; lỗi lọt qua
thì CI trên nhánh chính bắt.»

- **Lịch biết tệp (C):** hàng chưa bắt đầu chỉ được giao khi vùng tệp nó khai (`ranh_gioi` trong `hang-viec.json`) không
  trùng tệp của PR đang mở và không trùng `ranh_gioi` của hàng đang dở ở dãy khác; trùng một hàng của đợt → máy tự thêm
  phụ thuộc `sau`. Hàng không khai vùng tệp → sự kiện `ranh-gioi-vang`, không chặn.
- **PR sẵn sàng lúc trình thẻ (H):** ngay sau khi gói bằng chứng máy viết đã commit, `feature-loop/scripts/pr-san-sang.mjs`
  đẩy nhánh và chuyển PR sang sẵn sàng để CI chạy trong lúc người đọc thẻ; `feature_loop.ship_default` khác `pr` thì
  lệnh chỉ đẩy nhánh.
- **Gộp dưới khoá merge (I):** `node <thư mục đợt>/loi/dieu-phoi.mjs gop <số PR>` gộp bằng `--match-head-commit`
  (không bao giờ `--auto`) khi CI xanh trên đúng đầu nhánh và hồ sơ trên đầu nhánh đã ký, và (a) nhánh đã chứa đỉnh
  nhánh chính, hoặc (b) kho bật `"gop_khong_chay_lai_ci": true` trong `dieu-phoi.config.json` và tệp PR không giao tệp
  của các commit vào nhánh chính kể từ merge-base.
- **Đếm ký → gộp:** `dem` in `ky_den_gop` (trung vị, lớn nhất, theo hàng), `gop_vao_nhanh`, `ghim_lai_sau_ky`.
- **Giới hạn đã khai:** 3 mục nhãn trạng thái (gap-probe 23/10) và 10 mục chọn ở Cổng Bằng chứng 24/10, ở Notes hợp
  đồng — đáng nhớ nhất: «Kho chưa đặt lưới trước-gộp làm check bắt buộc: PR sẵn sàng từ lúc trình thẻ, người bấm gộp được
  trước chữ ký.» và Ngoài-4 «Gọi lệnh chuyển PR sẵn sàng khi đang đứng trên nhánh chính mà quên khai nhánh đích thì máy
  có thể đẩy thẳng lên nhánh chính.»

### Kho tri thức và lint (hồ sơ `kho-tri-thuc-va-lint`, hàng TT1, T2)

Gốc: crm-onehub/_acceptance/thanh-ben-khu-dung-chung/. Kho khai nơi để tri thức một lần; lint máy đọc kho tri thức theo
khuôn một nguồn và đỏ đúng sáu lỗi cấu trúc, đường trỏ băm phân giải được ở mọi worktree.

- **Khai một lần** trong `_acceptance/config.yaml` (khuôn `skills/acceptance/references/tri-thuc-template.md`):
  `tri_thuc: { noi: <thư mục>, cong_khai: <true|false>, kho: { ten, duong, remote } }` — `kho` tuỳ chọn; có nó thì gốc
  tri thức là kho riêng, đường giải theo checkout chính, không theo worktree.
- **Gói mới `tri-thuc`:** `/tri-thuc:kiem` (sáu lỗi cấu trúc, chỉ đọc). Mã ở lõi `acceptance-gate`.
- **Giới hạn đã khai:** 2 mục nhãn trạng thái và 18 mục chọn ở Cổng Bằng chứng 24/10, ở Notes hợp đồng — đáng nhớ nhất:
  Ngoài-12 «Ở kho công khai, một tệp thô đặt thẳng trong thư mục tài liệu thô không bị phát hiện và kiểm tra vẫn xanh.»
  và Ngoài-13 «Nếu khai sai tên thư mục tri thức trong kho, kiểm tra vẫn báo xanh với 0 trang, trông như một kho trống
  hợp lệ.»

### Ô mở việc mang nguồn (hồ sơ `o-mo-viec-mang-nguon`, hàng TT3, T2)

Gốc: crm-onehub/_acceptance/thanh-ben-khu-dung-chung/ — ô VK1 không trỏ bản phạm vi hay báo cáo nghiên cứu. Ô mở từ
một hàng của lượt cắt mang dòng «Nguồn:» trỏ đúng trang tri thức của hàng, và nguồn của bản phạm vi là trang tri thức
có đường trỏ băm.

- **Giới hạn đã khai:** 3 mục nhãn trạng thái và 8 mục chọn ở Cổng Bằng chứng 24/10, ở Notes hợp đồng — đáng nhớ nhất:
  «Răng phủ không có đường đọc-cũ cho bản phạm vi cắt TRƯỚC khi kho khai `tri_thuc`: chạy lại răng phủ trên bản ấy thì
  `nguon` chữ tự do đỏ, phiên cắt phải đổi sang đường trỏ băm.» và Ngoài-3 «Khi kho tri thức riêng không có trên máy, ô
  cơ hội được lưu có thể mang đường thư mục cá nhân của người mở ô, sai trên máy khác.»

### Ghi tri thức (hồ sơ `ghi-tri-thuc`, hàng TT2, T2)

Gốc: crm-onehub/_acceptance/thanh-ben-khu-dung-chung/. Chủ kho ghi nghiên cứu và thảo luận của một phiên vào tri thức
bằng một lệnh, và nguồn thô nhạy cảm của kho công khai không bao giờ vào kho công khai.

- **Lệnh:** `/tri-thuc:ghi` (mã `scripts/tri-thuc-ghi.mjs`) — tài liệu thô bất biến, trang tóm, commit tại máy.
- **Giới hạn đã khai:** 7 mục chọn ở Cổng Bằng chứng 24/10, ở Notes hợp đồng — đáng nhớ nhất: Ngoài-3 «Nếu máy đang có
  một bản kit cũ chưa có lệnh ghi, lệnh ghi sẽ báo lỗi chung chung thay vì chỉ cho người dùng cách cài bản mới.» và
  Ngoài-4 «Nếu phiên bị ngắt đúng lúc đang ghi nguồn thô, lần chạy lại sẽ báo thành công nhưng thư mục nguồn vẫn thiếu
  tệp mô tả, và bước kiểm tri thức sau đó báo đỏ.»

### Thiết kế nạp tri thức (hồ sơ `thiet-ke-nap-tri-thuc`, hàng TT4, T2)

Hàng TT4 của `docs/plans/lo-trinh-kit.json` (đợt `tri-thuc-2410`). Bước thiết kế của mọi vòng ở kho đã khai tri thức ghi
dòng «đã tra tri thức», và thẻ Cổng Phạm vi không mời duyệt khi thiếu dòng ấy. TT3 đưa đường trỏ trang tri thức tới ô
của hàng; vòng này đưa nó tới bước thiết kế và làm thẻ Cổng Phạm vi chứng điều đó.

- **Dòng tra** = dòng sổ `stage: "S1"` mang khoá `tri_thuc_tra` theo khối `DEC-TRI-THUC-TRA` của SKILL feature-loop.
- **Giới hạn đã khai:** 2 mục nhãn trạng thái và 5 mục chọn ở Cổng Bằng chứng 25/10, ở Notes hợp đồng — đáng nhớ nhất:
  «Kho riêng chỉ kiểm được ở máy có bản của nó; máy không có thì nhãn «không đọc được ở đây», chữ ký vẫn đi.» và Ngoài-2
  «Thẻ báo chưa vào được Cổng Phạm vi khi thiếu dòng tra, nhưng người gõ thẳng lệnh duyệt vẫn ký được — lệnh ghi chữ ký
  chưa tự chặn.»

### Vòng đơn lẻ tra tri thức (hồ sơ `vong-don-le-tra-tri-thuc`, hàng TT5, T2)

Hàng TT5 của `docs/plans/lo-trinh-kit.json` (đợt `tri-thuc-2410`). Vòng mở từ một câu mô tả tra được trang tri thức liên
quan và sổ quyết định của các hồ sơ trước, rồi ghi vào cùng dòng «đã tra tri thức». TT4 dựng dòng «đã tra tri thức» và
thẻ chặn khi thiếu; vòng này cho vòng đơn lẻ một lệnh tra theo câu mô tả, cho mọi vòng phần tra sổ quyết định của hồ sơ
trước, ghi cả hai vào cùng dòng tra, và đưa ngưỡng của ô vào lệnh đếm.

- **Lệnh tra** = `node scripts/tri-thuc.mjs --root <kho> --tra [--slug <hồ sơ>] [--json]`, câu mô tả qua stdin; dòng
  tra thêm khoá `so` (mảng đường trỏ sổ `<hồ sơ>#<mã dòng>`). **Lệnh đếm** = `can-cu-s1.cjs --root <kho> --dem [--json]`.
- **Giới hạn đã khai:** 2 mục nhãn trạng thái và 4 mục chọn ở Cổng Bằng chứng 25/10, ở Notes hợp đồng — đáng nhớ nhất:
  «Tìm chữ theo cặp âm tiết: câu mô tả dùng từ khác trang thì trang không hiện» và Ngoài-2 «Nếu sau này danh sách tệp
  chép cho kho tiêu thụ thiếu một tệp mà lệnh tra cần, lệnh tra âm thầm làm việc kém đi mà không bài kiểm nào báo đỏ —
  phép đo hiện chỉ đếm dòng trong danh sách.»

### Ngoài vòng

- **North Star đổi đích sang gộp-được** (#400, `CLAUDE.md`): một kết quả chỉ tính khi vật đã vào nhánh chính của kho
  tiêu thụ; luật (c) dòng 1 đo làm-xong → gộp-được, tách làm-xong → ký / ký → gộp.
- **Làn đối chứng chạy được trong worktree cô lập** (#401, `feature-loop/workflows/acceptance-verify.js`): tác tử
  baseline ghi kịch bản ra tệp của lượt rồi gọi đúng một lời gọi `bash '<tệp>'`; công cụ từ chối thì làn rơi về «chưa
  chạy dòng nào» và thẻ Cổng Bằng chứng nói ra.

### Lớp chép CI của tầng tri thức đủ cho kho tiêu thụ (sửa trong PR mốc, không qua vòng)

Gốc: crm-onehub PR #565 (nhận kit từ `main` 396c08f8, 25/10). Hai lỗ: danh sách chép thiếu khuôn
`tri-thuc-template.md` mà lint tri thức và dòng «Nguồn:» đọc lúc chạy (kho khai `tri_thuc` vỡ `ENOENT`); và răng phủ
`cat-luot.mjs --pham-vi` nạp bộ đọc khoá tri thức vô điều kiện, nên kho khai `tin_hieu` mà không khai `tri_thuc` — chép
đúng nhãn — vỡ `Cannot find module`. Nay danh sách chép có khuôn (cùng ba tệp TT5 thêm: 36 mục); răng phủ chỉ nạp bộ đọc khi có tệp, và kho
có dòng `tri_thuc:` mà thiếu tệp thì dừng thoát 2 nêu tệp thiếu. Ca CT0–CT4 (`tests/scripts/chep-tri-thuc-du.test.mjs`)
dựng kho tiêu thụ từ danh sách chép thật; ca commit trước bản sửa và đỏ trên 396c08f8.

**Ai bị ảnh hưởng:**

- Kho dùng `feature-loop` với `ship_default: pr`: PR chuyển sẵn sàng ngay lúc trình thẻ Cổng Bằng chứng, trước chữ ký.
  Kho chưa đặt lưới trước-gộp (`scripts/pre-merge-check.sh`) làm check bắt buộc thì người bấm gộp được trước chữ ký.
- Kho có đợt Điều phối: ngưỡng `swap_gb`, `rss_gb` trong `suc_khoe` không còn tác dụng và không được báo (Ngoài-5 của
  SK1) — gỡ đi cho khỏi hiểu lầm. Lệnh gộp mới `gop` chỉ gộp không chạy lại CI khi kho bật khoá.
- Kho không khai `tri_thuc`: không đổi gì ở ô, thẻ, bước thiết kế.

**Đường đọc-cũ:** ô cơ hội không có dòng «Nguồn:» vẫn mở và đọc như cũ; ô từ bản phạm vi chữ tự do vẫn mở, mang cờ;
sổ quyết định không có dòng tra ở kho không khai tri thức → thẻ không chặn; hàng lộ trình không khai `ranh_gioi` →
cảnh báo, không chặn; đợt không có khoá `gop_khong_chay_lai_ci` → lệnh gộp đòi nhánh chứa đỉnh nhánh chính.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI:** chép lại từ thẻ `v2.34.0` bốn tệp `scripts/lo-trinh.mjs`, `scripts/cat-luot.mjs`,
  `dieu-phoi/scripts/cau-hinh.mjs`, `dieu-phoi/scripts/hinh-dang.mjs`; thêm sáu tệp CHỈ khi kho khai `tri_thuc` (nhãn
  `[only-if-declared: tri_thuc]` trong danh sách chép): `scripts/tri-thuc.mjs`, `scripts/tri-thuc-khoa.cjs`,
  `scripts/tri-thuc-nguon.cjs`, `scripts/tri-thuc-tra.cjs`, `scripts/can-cu-s1.cjs`,
  `skills/acceptance/references/tri-thuc-template.md`. Các tệp còn lại giống từng byte `v2.33.1`.
- **Tệp vào danh sách chép mà không đổi byte** (TT5, chỉ khi khai `tri_thuc`): `scripts/luat-san-pham.cjs` — lối
  `--tra` nạp nó qua `can-cu-s1.cjs`; kho chưa chép thì chép thêm.
- **Máy dev: cài các gói theo ĐÚNG THẺ `v2.34.0` ở MỌI phạm vi** — kể cả `dieu-phoi`, và gói mới `tri-thuc`
  (`--scope project`) ở kho khai `tri_thuc` — rồi kiểm `node <gốc gói acceptance-gate>/scripts/kiem-ban-cai.mjs --may
  --ref v2.34.0 --root <bản clone kit đã git fetch --tags>` — `TỔNG KẾT: ĐẠT …`. Mở phiên MỚI.

**Người cắt mốc kit:** sau khi gắn thẻ chạy `node scripts/kiem-ban-cai.mjs --ref v2.34.0` (KC1) — dòng TỔNG KẾT ghi vào
hồ sơ `release-2-34-0`.

**crm, theo thứ tự** (đang ở 2.33.1):

1. **Cài theo thẻ `v2.34.0`** mọi gói crm đang dùng (`acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map`), thêm
   `tri-thuc` nếu khai `tri_thuc`; kiểm `kiem-ban-cai.mjs --may --ref v2.34.0`. Mở phiên MỚI.
2. **Lớp chép CI từ thẻ** (`git archive v2.34.0`): bốn tệp chép lại + bảy tệp tri thức nếu khai `tri_thuc` (hai gạch trên).
   Bản chép từ `main` 396c08f8 (trước thẻ) thiếu khuôn tri thức trong danh sách — chép lại từ thẻ.
3. **Khai `tri_thuc`** trong `_acceptance/config.yaml` nếu dùng kho tri thức riêng: `kho.ten`, `kho.duong` (tương đối
   gốc checkout chính), `kho.remote`, và `cong_khai: true` (kho crm công khai). Thư mục tri thức trong kho vào
   `risk_tiers.t1_skip_globs`. Chạy `/tri-thuc:kiem` — xanh trước khi mở ô từ hàng có đợt.
4. **Cấu hình đợt Điều phối:** thêm `"gop_khong_chay_lai_ci": true` vào `dieu-phoi.config.json` của gói đợt (rủi ro
   chủ kho đã chấp nhận 23/10); gỡ `swap_gb`, `rss_gb` khỏi `suc_khoe`; khai `ranh_gioi` cho hàng của `hang-viec.json`
   (hàng không khai chỉ cảnh báo). Thợ gộp bằng `node <thư mục đợt>/loi/dieu-phoi.mjs gop <PR>`.
5. **Lưới trước-gộp làm check bắt buộc** trên nhánh chính, nếu chưa có — PR giờ sẵn sàng từ lúc trình thẻ.
6. **Đọc ngưỡng, 14 ngày sau khi nhận:** ký → gộp đọc bằng `dieu-phoi.mjs dem --json` (`ky_den_gop` trung vị phút,
   `gop_vao_nhanh.tong`, `ghim_lai_sau_ky.tong`) — đích của gói «cắt 80 %»: phiên mở → gộp từ ~9,5–10 giờ xuống ~2 giờ.
   Giới hạn của thước: xem «Đọc số» dưới — `ky_den_gop` hôm nay mù với hàng có commit sau chữ ký.

**invest** (đang ở 2.9.0, nhảy thẳng): danh sách việc riêng ở `docs/handoff/2026-10-25-nhan-2-34-0-tu-2-9-0.md`.

**Năm dòng số của luật (c)** — tám vòng có lượt chấm trong cửa sổ (giờ VN). Dòng 1 lần đầu kéo tới GỘP (#400):
làm-xong = commit đưa hợp đồng sang `implemented` trên nhánh chính · ký = commit đầu đưa `status:` sang `signed-off` ·
gộp = commit đầu trên lối cha-đầu của nhánh chính có commit ký là tổ tiên (cách đọc của `dieu-phoi/scripts/do-gop.mjs`).
Dòng 2 đếm từ sổ quyết định và commit cổng (không từ bản ghi phiên). Dòng 4–5 từ bảng vai trò của `usage-report.md`.

| Hồ sơ | 1 · làm-xong→ký · ký→gộp · lượt chấm | 2 · gọi người trong / ngoài (trần) | 3 · lượt bị hạ tầng đốt | 4 · out-token S4 · vật / tìm-lỗi / tổng hợp % | 5 · phút máy / lượt |
|---|---|---|---|---|---|
| `suc-khoe-cho-trong-va-toc-do` (SK1, T2) | 4 g 23 · 6 g 05 · 1 (PASS) | 3 / 0 (3) — Đáng, Phạm vi (Hỏi-1), Bằng chứng | 0 | 48 106 · 33,7 / 23,4 / 42,9 | 45; ghim lại sau chữ ký 39 |
| `anh-co-that-trong-ho-so` (T2) | 4 g 33 · 7 g 08 · 2 (lượt 1 REJECT: hai suite đỏ; lượt 2 PASS) | 1 / 0 (3) — mở từ hạt giống, không Cổng Đáng; Phạm vi làn V | 0 | 71 868 · 38,3 / 17,6 / 44,2 | 119 · 48 |
| `ky-den-gop` (T2) | 12 g 53 · 2 g 53 · 3 (lượt 1 REJECT: lỗi AC-4; lượt 2 REJECT chỉ vì P179; lượt 3 PASS) | 1 / 0 (3) — phạm vi chốt trong gói «cắt 80 %»; Phạm vi làn V | **1** (lượt 2: sổ known-limits thiếu hàng, P179) | 86 984 · 41,7 / 17,0 / 41,4 | 50 · 49 · 46 = 145 |
| `kho-tri-thuc-va-lint` (TT1, T2) | 3 g 42 · 1 g 18 · 3 (lượt 1 REJECT: bản đồ cũ + 3 mục trong hợp đồng; lượt 2 REJECT chỉ vì P179; lượt 3 PASS) | 1 + Đáng chung / 0 (3) — Phạm vi làn V | **1** (lượt 2, P179) | 103 397 (lượt 2–3; báo cáo không ghi lượt 1) · 46,4 / 27,2 / 26,4 | — · 47 · 51 |
| `o-mo-viec-mang-nguon` (TT3, T2) | 2 g 12 · 1 g 09 · 2 (lượt 1 REJECT: LT-18, CE2; lượt 2 PASS) | 1 + Đáng chung / 0 (3) — Phạm vi làn V | 0 | 137 223 · 39,3 / 40,8 / 19,9 | 49 · 44 |
| `ghi-tri-thuc` (TT2, T2) | 1 g 19 · 7 g 33 · 1 (PASS) | 2 + Đáng chung / 0 (3) — Phạm vi (Hỏi-1), Bằng chứng | 0 | 79 821 · 33,1 / 45,5 / 21,4 | 50; ghim lại sau chữ ký 57 |
| `thiet-ke-nap-tri-thuc` (TT4, T2) | 4 g 00 · 1 g 33 · 1 (PASS) | 2 + Đáng chung / 0 (3) — Phạm vi (Hỏi-1, CỘNG), Bằng chứng | 0 | 79 505 · 31,2 / 49,9 / 18,9 | 44; ghim lại sau chữ ký 44 |
| `vong-don-le-tra-tri-thuc` (TT5, T2) | 4 g 25 · 0 g 57 · 3 (lượt 1 REJECT: mảnh suite mjs 3/3 đỏ; lượt 2 REJECT: ca XD-6 chập chờn dưới tải; lượt 3 PASS) | 2 + Đáng chung / 0 (3) — Phạm vi (Hỏi-1, CỘNG), Bằng chứng | **1** (lượt 2: ca chập chờn dưới tải) | 153 624 · 38,0 / 38,2 / 23,8 | 61 · 50 · 48 = 159 |

«Đáng chung» = một lượt Cổng Đáng cho cả năm ô TT1–TT5 (#405, 24/10). Gộp tám hồ sơ: 760 528 out-token, vật 38,3 /
tìm-lỗi 33,8 / tổng hợp 27,8 %. Trung vị tám vòng: làm-xong → ký **4 g 12**, ký → gộp **2 g 13**. Ký chưa gộp: 0.

**Đọc số:** ký → gộp đã ngắn hơn làm-xong → ký ở năm vòng tri thức gộp nối nhau (0 g 57 – 1 g 33) trừ TT2
(7 g 33: chờ TT3 gộp trước rồi ghim lại 57 phút). Ba vòng ký → gộp trên 6 giờ: `anh-co-that-trong-ho-so` và TT2 ký
buổi tối, gộp sáng hôm sau; SK1 ký 13:58, gộp 20:03 cùng ngày. Ba lượt bị hạ tầng đốt: hai cùng một nguyên nhân —
sổ known-limits thiếu hàng cho đề xuất của lượt trước (P179), lặp ở hai vòng liên tiếp (`ky-den-gop`, TT1) — và một
ca chập chờn dưới tải (TT5, XD-6). Ghim lại sau chữ ký tốn 39–57 phút mỗi lần, ngang một lượt chấm.
**Thước ký → gộp của kit mù ở 4/8 vòng:** `dieu-phoi/scripts/do-gop.mjs` trả rỗng khi PR còn commit sau chữ ký (ghim lại,
hạt giống, gộp nhánh chính) — ghép `--first-parent` với `--ancestry-path` trên git 2.37 không đi qua cha thứ hai; bảng trên
đọc bốn vòng ấy bằng tay theo đúng định nghĩa của tệp. Hạt giống:
`docs/plans/2026-10-25-hat-giong-do-gop-mu-khi-co-commit-sau-ky.md`. **Điều kiện tin cậy:** (i) `git diff v2.33.1
<cây mốc> -- feature-loop/workflows/ feature-loop/agents/` chỉ chạm làn đối chứng (khối chứng-minh-vật) của
`acceptance-verify.js` — đường verdict finder → refute → REJECT không đổi thành phần; (ii) lượt chấm sai do
phép-đo-tự-dối giữa hai mốc: 0.

**Dự báo năm dòng cho thay đổi của mốc này:** 1 ↓ ký → gộp (lịch biết tệp, PR sẵn sàng lúc trình thẻ, gộp không chạy lại
CI — ky-den-gop) · 2 = · 3 ↓ (lượt dưới tải thử lại thay vì tính lỗi vật — SK1; làn đối chứng không chết trong worktree
cô lập — #401) · 4 = · 5 =.

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .` (25/10).
**N không tăng so với mốc 2.33.1 (vẫn 1) — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.33.1 — 20/10/2026

Bản vá của 2.33.0. Chủ kho quyết 19/10 «GT2 xong sẽ cắt bản vá», rồi 20/10 «ưu tiên KY1 để cắt» — không chờ mốc
22/10 của lộ trình kit. Có **bốn hồ sơ được ký** — tập đối chiếu bằng `scripts/rel-cua-so.sh` (AC-4 của hồ sơ mốc):
`vong-mo-co-chu-giu` (GT1, #387), `vong-mo-khong-mat-dau` (GT2, #390), `nhay-don-nhan-doi` (R3, #384),
`moi-cong-khong-qua-nut` (KY1, #391); thêm một sửa đẩy thẳng lên nhánh chính (`b2c058d8`, 20/10). Kho chờ nhận: `crm`.
Mốc đi **làn V**, không dựng răng mới. Bốn gói `acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map` cùng lên
`2.33.1` (`acceptance-gate`, `feature-loop`, `dieu-phoi` đổi vật; `road-map` chỉ đổi số); `diagram-design` giữ `2.7.1`.
Tag `v2.33.1` gắn vào commit gộp PR mốc.

**Vì sao 2.33.1** (patch): số do chủ kho đặt («cắt bản vá»). Khai thẳng: GT1 thêm lệnh `tin` và một khối hook `Stop`
mới trong gói `dieu-phoi` — theo nếp «minor cho bề mặt mới» thì lẽ ra là 2.34.0. Không gãy đường đọc-cũ: kho không đợt,
không kênh thì cả ba khối hook tin im (AC-8 (j) của GT1); yêu cầu cũ `yeu-cau/` giữ nguyên khuôn.

### Vòng mở có chủ giữ (hồ sơ `vong-mo-co-chu-giu`, hàng GT1, T2)

Gốc: `crm-onehub/_acceptance/dieu-phoi-hai-tang/`. Mỗi yêu cầu giữa các phiên — giám sát và thợ, máy và máy — có mã và
hạn biên nhận, chỉ đóng khi có XONG kèm vật, TRẢ hay HUỶ; phiên không kết lượt khi còn tin gửi mình chưa nhận; lời giao
việc thiếu kết quả hay ranh giới thì không mở chip. Lý do làm: hôm nay chỉ cạnh thợ → giám sát trong đợt có máy giữ vòng.
Cạnh giám sát → thợ và cạnh máy ↔ máy đóng vòng bằng trí nhớ. Đo 17/10: 0/44 yêu cầu trên hai kênh liên máy có trả lời
trỏ về được tin gốc.

- **Thang chín nấc:** đã nói · đã tới · đã nghe · đã hiểu · đã đáp · đã hứa · đang làm · đã giao · người giao chấp nhận.
  GIAO leo đủ chín nấc; HỎI tới nấc đáp rồi xong; BÁO dừng ở nấc đã nghe. Luật đầy đủ cho phiên thợ nằm ở khối
  `LUAT-TIN` của `dieu-phoi/scripts/mau/LUAT.md`.
- **Trong đợt:** `node <thư mục đợt>/loi/tin.mjs <KHẨU LỆNH> <đích hoặc mã> ["một câu"]`; nơi chứa là
  `<thư mục đợt>/tin.jsonl`. Yêu cầu cũ `yeu-cau/` hiện trên sổ như câu hỏi có mã; tệp của nó không đổi.
- **Trên kênh liên máy:** mỗi máy chạy một lần `node "$GOI/scripts/tin.mjs" vai --kenh <chủ>/<kho>#<số> --may <tên>` từ
  worktree giữ kênh, rồi thêm `--kenh <chủ>/<kho>#<số>` vào mọi lệnh. Trạng thái nằm ở `.acceptance-runs/tin/` của kho
  (tên máy không vào cấu hình commit). Bộ canh: `tin canh --kenh … [--cho]` — không bắt lại được tin cuối thì thoát 3.
- **Hook:** phần đưa tin chạy bên trong `hook-nhip` và `hook-cho-nguoi` (không thêm mục hook); khối `Stop` gọi
  `hook-tin.mjs`. Kho không đợt, không kênh thì cả ba im. `tin tat` / `tin bat` tắt hay bật cho một worktree.
- **Giới hạn đã khai:** 8 mục nhãn trạng thái và 9 mục chọn ở Cổng Bằng chứng 19/10, ở Notes hợp đồng — đáng nhớ nhất:
  «Tin tới phiên đang ngủ chỉ đến ở lượt kế của phiên đó.» và Ngoài-8 «Sau khi hộp tin báo hỏng một lần ở một thư mục
  làm việc, các lần hỏng sau ở đó không báo nữa — tin tự đến có thể ngừng mà người dùng không hay.»

### Vòng mở không mất dấu (hồ sơ `vong-mo-khong-mat-dau`, hàng GT2, T2)

Gốc: `acceptance-gate-kit/_acceptance/vong-mo-co-chu-giu/` — Ngoài-4, 5, 7, 9 của GT1. Dấu «đã đến», «chấp nhận», «kết
lượt» không mất khi bộ canh nền đồng bộ kênh cùng lúc; hạn gõ sai bị từ chối kèm câu báo; đáp một yêu cầu cũ bằng lệnh
mới tới đúng người hỏi và đóng vòng. Ba lỗi đều do lượt chấm 2 của GT1 tìm ra và cả ba làm sai đúng điều GT1 hứa — một
vòng đã mở thì máy giữ nó tới khi đóng thật:

1. bộ canh nền đồng bộ kênh ghi đè trọn tệp trạng thái bằng bản đọc từ trước khi chờ mạng, nên dấu máy hook ghi trong khe
   ấy mất và vòng kẹt ở «chờ chấp nhận»;
2. hạn gõ sai được báo thành công rồi bị bộ đọc lờ đi;
3. đáp một yêu cầu kiểu cũ bằng `tin` được báo thành công mà câu trả lời không tới người hỏi.

- **Giới hạn đã khai:** 2 mục nhãn trạng thái và 7 mục chọn ở Cổng Bằng chứng 20/10, ở Notes hợp đồng — đáng nhớ nhất:
  Ngoài-5 «Máy tắt đúng lúc đang ghi một dấu máy thì dấu ghi ngay sau đó cũng mất và không có cảnh báo; vòng có thể kẹt ở
  «chờ chấp nhận».» và Ngoài-4 «Gõ một hạn lớn phi thực tế (hàng trăm tỷ phút) vẫn được nhận; người nhận sau đó không
  nhận được vòng, hoặc hạn bị đọc thành 30 phút mặc định.»

### Nháy đơn trong config (hồ sơ `nhay-don-nhan-doi`, hàng R3, T3)

Gốc: `crm-onehub/_acceptance/tac-nhan-va/`. Lệnh trong config viết bằng nháy đơn có dấu nháy nhân đôi (`''`) tới shell
đúng như người viết — làn ghim lại và lượt chấm S4 chạy đúng `bash -c '…'` thay vì một lệnh bị xẻ. Nghiệm một chỗ:
nhánh nháy đơn của `unquoteScalar` (cổng duy nhất mọi bộ đọc giá trị thi hành đi qua) gỡ `''`. Bán kính đo 18/10 trên
16 kho: chỉ crm, đúng hai khoá `tnv_khu_hoi`, `tnv_man`, hôm nay đang chạy sai.

- **Giới hạn đã khai:** 1 mục ở Notes hợp đồng — Ngoài-1 «một ô đột biến của bộ kiểm tra nháy (ô 10, chân BG10a) chỉ
  có đối chứng dương khi chạy cùng chân liền kề; chạy tách riêng thì ô đó chưa tự chứng minh — người dùng không bị ảnh
  hưởng.»

### Lời mời cổng không qua nút (hồ sơ `moi-cong-khong-qua-nut`, hàng KY1, T2)

Gốc: `crm-onehub/_acceptance/thanh-ben-khu-dung-chung/`; chủ kho quyết 19/10 «Sửa kit: giao MacBook Pro làm ngay». Lời
mời ở cổng chờ người kết lượt bằng chữ thường — dòng lệnh trong khối chữ, trang thẻ gửi bằng công cụ gửi tệp, không đặt
dòng lệnh hay chữ quyết vào nút của hộp «bước kế». Ở lượt Cổng Bằng chứng của một kho tiêu thụ, phiên thợ đặt dòng ký vào
nút trả lời của hộp «bước kế» của app desktop. App bỏ nút mở đầu «/» hay «!», nút chứa «@», cắt tin của nút ở 300 ký tự,
và bỏ nút khuyến nghị thì mất luôn câu hỏi — người không thấy lời mời. Nút còn điền sẵn «ký hay trả: ký».

- **Điều khoản kết-lượt-cổng** (khối `GATE-END-TURN-CLAUSE` của `skills/acceptance/references/human-facing-language.md`)
  chép nguyên văn ở ba tệp engine và bốn tệp lời dặn của gói `dieu-phoi`, theo bảng chỗ chép `GATE-END-TURN-SITES`.
- **Giới hạn đã khai:** 5 mục nhãn trạng thái và 5 mục chọn ở Cổng Bằng chứng 20/10, ở Notes hợp đồng — đáng nhớ nhất:
  «**Lời, chưa có răng**: điều khoản dặn phiên, không chặn được một phiên lờ nó.» và Ngoài-1 «lượt chấm hay CI chạy trọn
  bộ ca khung điều phối có thể đỏ giả vì ca tin GT-07 chập chờn ngoài vòng — chạy lại là qua.»

### Lệnh đóng cổng vẽ bản đồ bằng bản chép của kho (commit `b2c058d8`, không qua vòng)

Gốc: crm-onehub 20/10, nhánh `feat/ngan-ban-ghi-giu-danh-tinh` — commit chữ ký `80464092f` vẽ lại `LO-TRINH.html`
bằng `product-map.mjs` của gói 2.32.0 đang cài, trong khi kho đã chép một bản mới hơn vào `scripts/`: khối dữ liệu
mất «mốc hiện», bốn bài của kho đỏ ở pre-push và `--check` của kho báo trang lệch (sửa tay ở `50fb669a3`). Nay khối
`MAP-STAGE` của bốn thân đóng cổng (`approve`, `signoff`, `observed`, phiên nghiệm thu) chạy `scripts/product-map.mjs`
của kho khi tệp có, chỉ rơi về bản của gói khi kho không chép — đúng luật «bản chép trong kho thắng bản cài» của
`/road-map:ghim`, vì CI của kho chạy `--check` bằng bản chép. Ca LT-16-ban-kho / LT-16-ban-goi.

**Ai bị ảnh hưởng:** kho đã chép bộ vẽ vào `scripts/` mà bản chép khác bản gói đang cài — nay commit đóng cổng khớp
CI của kho. Kho không chép: như cũ. Không cần làm gì khi nhận.

**Đường đọc-cũ:** trạng thái kênh ghi trước dòng sửa tên kênh của GT1 (chưa có tên kênh gốc) thì suy từ tên tệp như cũ;
tệp trạng thái kênh ghi bằng bản trước GT2 được đọc cả dấu cũ lẫn dấu mới, không lệnh nào bắt chuyển tệp (AC-3 của GT2);
yêu cầu cũ `yeu-cau/` không đổi khuôn. Khối dữ liệu trang giữ bản 2.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI:** chép lại từ thẻ `v2.33.1` một tệp: `lib/evidence-core.cjs` (R3 — nhánh nháy đơn gỡ `''`). Hai mươi
  tám tệp còn lại giống từng byte `v2.33.0`.
- **Máy dev: cài các gói theo ĐÚNG THẺ `v2.33.1` ở MỌI phạm vi** — kể cả `dieu-phoi` (lệnh `tin`, khối hook `Stop` mới) —
  rồi kiểm `node <gốc gói acceptance-gate>/scripts/kiem-ban-cai.mjs --may --ref v2.33.1 --root <bản clone kit đã git
  fetch --tags>` — `TỔNG KẾT: ĐẠT …`. Mở phiên MỚI.
- **Kênh liên máy:** mỗi máy chạy `tin vai` một lần (lệnh ở mục GT1 trên). Máy đã `vai` bằng bản cũ trên kênh có gạch
  nối phải chạy `tin vai` lại một lần để trạng thái mang tên gốc (sổ GT1, dòng sửa S4-r1 — bản cũ là `tin` trước dòng
  sửa ấy).

**Người cắt mốc kit:** sau khi gắn thẻ chạy `node scripts/kiem-ban-cai.mjs --ref v2.33.1` (KC1) — dòng TỔNG KẾT ghi vào
hồ sơ `release-2-33-1`.

**crm, theo thứ tự:**

1. **Cài theo thẻ `v2.33.1`** mọi gói crm đang dùng (`acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map`) ở mọi
   bản ghi; kiểm `kiem-ban-cai.mjs --may --ref v2.33.1`. Mở phiên MỚI.
2. **Lớp chép CI từ thẻ** (`git archive v2.33.1`): chép lại `lib/evidence-core.cjs`.
3. **Mỗi máy `tin vai`** trên kênh liên máy — lại một lần nếu đã `vai` bằng bản cũ trên kênh có gạch nối.
4. **Kiểm ngoài của R3:** sau khi cài, ghim lại `tac-nhan-va`; E9 phải `exit 0`.
5. **Đọc ngưỡng, 14 ngày sau khi nhận:** GT1 — không lần nào chủ kho phải hỏi «phiên hay máy kia đã nhận chưa», và mọi
   yêu cầu trên kênh liên máy có trả lời trỏ về mã (`tin so --kenh … --tu <ngày nhận> --json` in thẳng phán quyết) ·
   GT2 — không vòng nào kẹt ở «chờ chấp nhận» khi người giao đã chấp nhận, và không lời đáp nào bị báo thành công mà
   không tới người hỏi · KY1 — 0 lượt cổng hỏng, đếm bằng `node tests/scripts/moi-cong-khong-qua-nut.test.mjs --dem
   <tệp…>` trên bản ghi phiên; mẫu số bằng 0 thì thước VÔ HIỆU, không đọc thành «0 lỗi».

**Năm dòng số của luật (c)** — bốn vòng có lượt chấm trong cửa sổ (giờ VN; cùng nguồn và cách tính của 2.32.1: dòng 1 từ
commit «implemented» tới commit chữ ký Cổng Bằng chứng, dòng 4–5 từ bảng vai trò của `usage-report.md`):

| Hồ sơ | 1 · làm-xong→quyết-được · lượt chấm | 2 · gọi người trong / ngoài (trần) | 3 · lượt bị hạ tầng đốt | 4 · out-token S4 · vật / tìm-lỗi / tổng hợp % | 5 · phút máy / lượt |
|---|---|---|---|---|---|
| `vong-mo-co-chu-giu` (GT1, T2) | 16 g 18 · 2 (lượt 1 REJECT: tên kênh có gạch nối bị tách sai, ca đỏ thiếu đối chứng dương, ca RT13 đỏ; lượt 2 PASS) | 3 / 1 (3) — ngoài: duyệt sửa lời AC-4/5/9 giữa S3; thêm 2 nếu đếm hai ràng buộc chủ kho đặt 18/10 giữa lúc trình Cổng Phạm vi | 0 | 97 451 · 33,2 / 25,0 / 41,9 | 52 · 48 = 100; ghim lại sau chữ ký 62 |
| `vong-mo-khong-mat-dau` (GT2, T2) | 8 g 18 · 3 (lượt 1 REJECT: bốn lỗ thước trong hợp đồng; lượt 2 PASS còn 2 mục trong hợp đồng mức vừa, thước đổi theo lớp; lượt 3 PASS) | 2 / 1 (3) — ngoài: chọn «sửa thước theo lớp rồi chấm lượt 3» sau dừng-vá | 0 | 96 953 · 37,2 / 31,1 / 31,6 | 47 · 47 · 47 = 142 |
| `nhay-don-nhan-doi` (R3, T3) | 2 g 25 · 1 (PASS) | 2 / 0 (4) — không có Cổng Đáng; Gate 1.5 không thấy dấu ký nào trong hồ sơ | 0 (ca biên: một lệnh đường nền quá trần 180 s, lượt vẫn PASS) | 24 807 · 59,4 / 12,2 / 28,4 | 45; ghim lại sau chữ ký 69 (đỏ) · 69 · 72 · 71 · 78 |
| `moi-cong-khong-qua-nut` (KY1, T2) | 8 g 39 · 3 (lượt 1 REJECT: chỗ trỏ ở Cổng 1.5 cắt một cụm ca P85b ghim, bản đồ cũ; lượt 2 REJECT: ca GT-07 chập chờn ngoài vòng, dừng-vá; lượt 3 PASS sau khi thu AC-9) | 2 / 1 (3) — ngoài: chọn «lối 1» thu AC-9 sau dừng-vá | **1** (lượt 2, ca GT-07 ngoài vòng — hồ sơ tự xếp «cạnh gãy hạ tầng», dòng phán quyết ghi REJECT) | 79 861 · 49,7 / 12,7 / 37,7 | 47 · 48 · 47 = 143; ghim lại sau chữ ký 44 + 61 |

Gộp bốn hồ sơ: 299 072 out-token, vật 41,1 / tìm-lỗi 22,6 / tổng hợp 36,3 %.

**Đọc số:** cả bốn vòng ở trong trần lượt gọi người nếu không đếm hai ràng buộc của GT1; ba vòng có một lượt ngoài thiết
kế, đều là chọn lối sau một lượt chấm hỏng (sửa lời AC, dừng-vá). Hạ tầng đốt một lượt của KY1 vì một ca của chính gói
GT1 chập chờn — cạnh gãy giữa hai vòng chạy song song trên cùng gói. Ghim lại sau chữ ký tốn 44–78 phút mỗi lần, ngang
một lượt chấm. **Điều kiện tin cậy:** (i) `git diff v2.33.0 <cây mốc> -- feature-loop/workflows/ feature-loop/agents/`
rỗng — đường verdict không đổi; (ii) lượt chấm sai do phép-đo-tự-dối giữa hai mốc: 0.

**Dự báo năm dòng cho thay đổi của mốc này:** 1 = · 2 ↓ ngoài thiết kế (chủ kho thôi hỏi «phiên hay máy kia đã nhận
chưa» — GT1, GT2; lời mời cổng không mất trong nút — KY1) · 3 = · 4 = · 5 =.

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .` (20/10).
**N không tăng so với mốc 2.33.0 (vẫn 1) — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.33.0 — 18/10/2026

Lộ trình đọc được trong một phút, và hồ sơ đã ký luôn tươi. Có **hai hồ sơ được ký** — tập đối chiếu bằng
`scripts/rel-cua-so.sh` (AC-4 của hồ sơ mốc): `road-map-de-dung` (RD1, #381) và `ho-so-da-ky-giu-tuoi` (K-A, #369). Kho
chờ nhận: `crm`. Bốn gói `acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map` cùng lên `2.33.0` (`acceptance-gate`
và `feature-loop` đổi vật; `dieu-phoi`, `road-map` chỉ đổi số); `diagram-design` giữ `2.7.1`. Tag `v2.33.0` gắn vào commit
gộp PR mốc.

**Vì sao 2.33.0** (minor): luật gate mới (nhãn «đỏ sẵn trên nền» mà lưới trước-gộp và kiểm lại bằng chứng đọc), lệnh mới
(giữ tươi), năm khoá mới của khối dữ liệu trang (chỉ thêm — bản 2 giữ), năm cờ có tên và luật cắt lượt mới (ADR 0026).
Không gãy đường đọc-cũ.

### Road-map dễ dùng (hồ sơ `road-map-de-dung`, hàng RD1, T2)

- **Bỏ mốc ngoài** (ADR 0026): việc của người không còn là mốc. Skill cắt lượt xếp mỗi mục vào một trong năm loại
  (phát triển · sự kiện tạo hạn · đo giá trị · vận hành thuần · việc cần kết quả vận hành); việc vận hành ra khỏi kho,
  liệt dưới «Ra khỏi kho» ở mô tả PR. Skill quyết `han` hay `han-cung`, mã vận hành không vào phạm vi của hàng tự phục vụ.
- **Luật «chỉ việc phát triển» ở mọi lần đọc tệp** — trang, bản xem chữ, thẻ khởi động: năm cờ có tên
  (`moc-ngoai-da-bo`, `moc-chua-khai-loai`, `dung-tren-moc`, `du-lieu-sai-gia-tri`, `thieu-hang-sinh-gia`).
- **Khối Mốc đọc bằng tên:** mỗi việc hiện bằng câu giao đầy đủ, mã đứng sau; mốc chỉ hiện khi có việc; việc thuộc mốc
  đầu tiên (theo ngày) liệt nó. Trang crm và trang của phiên đọc **một mô hình hiển thị** trong khối dữ liệu: năm khoá
  `hang[].ten_hien_thi`, `moc[].hien`, `moc[].viec_hien`, `moc[].con_lai`, `chua_hen_moc`.
- **Rà soát** nhắc mốc đã qua ngày chưa khép (một dòng gom) và việc chưa có tên ngắn (chỉ ở kho đã dùng tên ngắn; không
  lên trang).
- **Giờ máy nối tiếp theo làn:** mỗi lộ trình một làn, xếp theo phụ thuộc trước, ngày sau; nhãn «máy chạy 24/24 — chưa
  đo nhịp ngày». Trần độ dài trang 0,4 so với trang 2.21.0 cùng kho (chủ kho chốt 17/10).
- **Giới hạn đã khai:** 16 mục ở Notes hợp đồng — đáng nhớ nhất: ba mốc mà mốc gần hạn chờ mốc xa hạn có thể báo «quá
  tải» sai (Ngoài-3); một việc liệt ở nhiều mốc bị cộng giờ máy nhiều lần (Ngoài-9).
- **Sau gộp:** main đỏ 4 ca của `lo-trinh-du-lieu-ngay` (nền so chứa RD1) — sửa ở #383, chủ kho cho; bộ ca điều phối
  không nằm trong bộ ca của lượt chấm, chỉ CI chạy (hạt giống `docs/plans/2026-10-18-hat-giong-bo-ca-dieu-phoi-ngoai-luot-cham.md`).

### Hồ sơ đã ký luôn tươi (hồ sơ `ho-so-da-ky-giu-tuoi`, hàng K-A, T3)

- **Lệnh giữ tươi** (`feature-loop/scripts/giu-tuoi.mjs`): theo khoảng gộp trên nhánh chính, ghim lại hồ sơ đã ký bị
  chạm, quy mỗi cái đỏ về đúng PR gây ra (hoặc «đỏ sẵn trước khoảng», «hạ tầng»), in tồn đọng và giờ máy.
- **Nhãn «đỏ sẵn trên nền»:** khoá `feature_loop.do_san_tren_nen` (mặc định **tắt**) — bật thì vòng khác đi tiếp khi
  cùng cái đỏ đã ghi trên nhánh chính; lưới trước-gộp và kiểm lại bằng chứng đọc nhãn qua `lib/do-san-tren-nen.cjs`.
- **Khoá vắng:** lưới, thẻ và bản đồ giống từng byte bản trước trên bộ hồ sơ thật của mọi kho có trên máy (AC-8).
- **Giới hạn đã khai:** 10 mục ở Notes hợp đồng — máy quá tải cắt cả hai bản giống nhau thì phép so có thể xanh dù chưa
  chạy xong (Ngoài-1, Ngoài-3); một lỗi thật có thể bị xếp nhầm là «hạ tầng» (Ngoài-9).

**Đường đọc-cũ:** khối dữ liệu trang giữ bản 2, năm khoá mới chỉ thêm; bộ đọc gặp trang cũ thiếu khoá thì cờ vàng «khối
chưa mang mô hình hiển thị — vẽ lại bằng bộ kit mới». Lộ trình cắt trước luật 17/10 hiện cờ vàng có tên; không có đường
đọc riêng cho mốc ngoài cũ — cắt lại bằng skill mới là hết. Bản trước đọc hồ sơ mang dòng `nen-do`/`do_san` không vỡ
(AC-9 của K-A).

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI:** chép lại từ thẻ `v2.33.0` bảy tệp: `scripts/lo-trinh.mjs`, `scripts/gio-may.mjs`, `scripts/cat-luot.mjs`
  (RD1); `scripts/product-map.mjs`, `lib/evidence-core.cjs`, `lib/nhan-canh-gay.cjs` và tệp MỚI `lib/do-san-tren-nen.cjs`
  (K-A). Bảy tệp chép CÙNG MỘT commit; hai mươi hai tệp còn lại giống từng byte `v2.32.1`.
- **CI của kho cần `fetch-depth: 0` khi bật khoá `feature_loop.do_san_tren_nen`** — lưới tìm dòng nền ở điểm tách với nhánh
  chính (merge-base); clone nông không tính được điểm tách, nên pin mang nhãn thành VIOLATION — đóng về phía đỏ (sổ K-A,
  dòng sửa S4-r1). Khoá vắng thì không đổi gì.
- **Máy dev: cài các gói theo ĐÚNG THẺ `v2.33.0` ở MỌI phạm vi**, rồi kiểm `node <gốc gói acceptance-gate>/scripts/kiem-ban-cai.mjs
  --may --ref v2.33.0 --root <bản clone kit đã git fetch --tags>` — `TỔNG KẾT: ĐẠT …`.

**Người cắt mốc kit:** sau khi gắn thẻ chạy `node scripts/kiem-ban-cai.mjs --ref v2.33.0` (KC1) — dòng TỔNG KẾT ghi vào
hồ sơ `release-2-33-0`.

**crm, theo thứ tự:**

1. **Cài theo thẻ `v2.33.0`** mọi gói crm đang dùng ở mọi bản ghi; kiểm `kiem-ban-cai.mjs --may --ref v2.33.0`. Mở phiên MỚI.
2. **Lớp chép CI từ thẻ** (`git archive v2.33.0`): bảy tệp ở trên, cùng một commit; bật khoá `do_san_tren_nen` thì CI
   đặt `fetch-depth: 0`.
3. **Vẽ lại `LO-TRINH.html`** trong PR nhận. Lộ trình trên `onehub` (b22c0a329, 18/10) đã cắt lại theo luật 17/10: 0 cờ ở
   OKR và việc dự án; kho tài liệu thêm một dòng Rà soát «9 việc chưa có tên ngắn». Lộ trình nào còn mốc ngoài hay mốc
   chưa khai loại thì cắt lại bằng skill cắt lượt mới.
4. **Trang Lộ trình trong sản phẩm** đọc năm khoá mô hình hiển thị thay vì tự lọc, kèm một ca đối chiếu trang với tập hiển
   thị của khối.
5. **Bảy mục crm đang đứng chờ K-A** (hồ sơ cơ hội của K-A) có công cụ ngay khi crm cài mốc này; ngưỡng của K-A đọc
   sau khi crm cài mốc VÀ bật khoá, 14 ngày (hợp đồng K-A).

**Năm dòng số của luật (c)** — hai vòng có lượt chấm trong cửa sổ (giờ VN):

| Hồ sơ | 1 · làm-xong→quyết-được · lượt chấm | 2 · gọi người trong / ngoài (trần) | 3 · lượt bị hạ tầng đốt | 4 · token S4 | 5 · phút máy / lượt |
|---|---|---|---|---|---|
| `road-map-de-dung` (RD1, T2) | 8 g 43 · 3 (lượt 1 REJECT lỗi trong hợp đồng; lượt 2 REJECT chỉ vì sổ giới hạn thiếu hàng; lượt 3 PASS mang sang) | 2 / 4 (3) — ngoài: trần độ dài 0,4 · lời AC-5 · ô «ký hay trả» bỏ trống · cho sửa main đỏ | 1 (lượt 2, P179) | không tách khối — `usage-report.md` chỉ tách theo model | ~47 · ~46 · ~46; ghim lại sau chữ ký 39 + 41 |
| `ho-so-da-ky-giu-tuoi` (K-A, T3) | 12 g 25 · 3 (lượt 3 PASS) | 3 / ≥ 2 (4) — ngoài: duyệt lại phạm vi sau lượt 1 · dời bản so E8 | chưa đếm (hồ sơ K-A) | không tách khối | xem `run-log.jsonl` của hồ sơ |

**Đọc số:** cả hai vòng vượt trần lượt gọi người vì quyết định giữa vòng (RD1: trần độ dài trang, lời AC sau duyệt; K-A:
duyệt lại phạm vi) — số đọc được, chưa đủ hai mốc để so. **Điều kiện tin cậy:** (i) `git diff v2.32.1 <cây mốc> --
feature-loop/workflows/ feature-loop/agents/` — đường verdict; (ii) lượt chấm sai do phép-đo-tự-dối giữa hai mốc: 0.

**Dự báo năm dòng cho thay đổi của mốc này:** 1 = · 2 ↓ ngoài thiết kế (lộ trình đọc trong một phút, ít hỏi «việc nào
còn») · 3 ↓ (giữ tươi quy đỏ về PR, bớt lượt bị nền đỏ đốt — khi khoá bật) · 4 = · 5 =.

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .` (18/10).
**N không tăng so với mốc 2.32.1 (vẫn 1) — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.32.1 — 17/10/2026

Bản vá của 2.32.0 cho sự cố ở kho tiêu thụ đầu tiên nhận nó: `crm-onehub#375` (Mac Studio, 17/10) — nhận 2.32.0 ở PR
crm #463 thì bước Product map `--check` của CI đỏ «LO-TRINH.html lệch» hai lần. Từ 2.32.0 (RM3b) bộ vẽ trang lộ trình
lấy ý ở **thư mục chính** của kho, trong khi trang được commit và CI vẽ lại từ cây đang kiểm; ở crm thư mục chính lùi
nền, thiếu sáu tín hiệu của #452, nên trang vẽ trong worktree khác trang CI. Có **một hồ sơ được ký** — tập đối chiếu
bằng `scripts/rel-cua-so.sh` (AC-4 của hồ sơ mốc): `ve-lo-trinh-doc-tin-hieu-cua-cay` (VA2, #378). Kho chờ nhận: `crm`
— nhận **2.32.1 thay cho 2.32.0**. Mốc đi **làn V**, không dựng răng mới. Bốn gói `acceptance-gate`, `feature-loop`,
`dieu-phoi`, `road-map` cùng lên `2.32.1` (chỉ `acceptance-gate` đổi vật; `dieu-phoi`, `road-map` chỉ đổi số);
`diagram-design` giữ `2.7.1`. Tag `v2.32.1` gắn vào commit gộp PR mốc.

**Vì sao 2.32.1** (patch): sửa hành vi của 2.32.0, không thêm bề mặt mới — không lệnh, không khoá cấu hình, không tệp
mới trong lớp chép CI.

### Trang lộ trình vẽ trong worktree khớp CI (hồ sơ `ve-lo-trinh-doc-tin-hieu-cua-cay`, hàng VA2, T2)

Gốc: `_acceptance/cua-tin-hieu-goc-moi-worktree/` — Known limit Ngoài-4 của RM3b thành ca thật. Tái hiện ở
`_acceptance/ve-lo-trinh-doc-tin-hieu-cua-cay/repro/` (2.32.0 đỏ, 2.31.0 xanh).

- **Bộ vẽ trang** (`product-map.mjs`, và bước khởi tạo lộ trình đi qua cùng hàm vẽ) chỉ lấy tệp ý **đã git theo dõi**
  trong **chính cây đang vẽ**; nội dung đọc từ đĩa của cây ấy (tệp vừa `git add` hay vừa sửa được commit cùng trang).
  Vẽ trong worktree, thư mục chính hay bản tải sạch đều ra cùng một trang như CI.
- **Bộ đọc tương tác giữ RM3b:** thẻ khởi động, `tin-hieu.mjs --chua-gom/--duong/--rang/--cau` và skill gom vẫn đọc hộp
  ý chung ở thư mục chính. Chủ kho duyệt thu hẹp đúng chân bộ vẽ trang trong AC-2 của RM3b.
- **Không đổi:** kho không khai `tin_hieu`, kho khai mà mọi ý đã commit, và gốc là thư mục ngoài git — trang giống từng
  byte 2.32.0 (AC-4).
- **Giới hạn có tên:** ý chưa commit chỉ lên trang khi được commit; kho giữ mọi ý ngoài git thì trang không có khối
  đường đi tín hiệu. Ý chưa commit xem ở thẻ khởi động và `tin-hieu.mjs --chua-gom` — **KHÔNG** ở `/road-map:xem` (lệnh
  ấy không hiện tín hiệu; một câu trong `skills/acceptance/references/lo-trinh-du-lieu.md` nói nhầm điều này — Ngoài-3,
  giữ tới vòng chạm tài liệu kế).
- **Giới hạn đã khai:** 5 mục ở Notes hợp đồng — đáng nhớ nhất: thư mục không có git riêng nằm trong một kho git khác
  thì trang không hiện ý nào (Ngoài-5); nguồn khai ngoài kho hay bằng đường tuyệt đối, hoặc git lỗi lạ, thì trang có thể
  lệch mà không cảnh báo (Ngoài-4).
- **Hạ tầng lượt chấm:** vùng 2 của suite plugins nay chạy 671 giây kể cả khi máy rảnh — quá trần 10 phút mỗi lệnh của
  tác tử chấm. Vòng nào chạy suite này cần một eval `long_running` mang chính lệnh ấy (tiền lệ `release-2-32-0` E3i).

**Đường đọc-cũ:** không đổi khuôn tệp nào; khối dữ liệu trang giữ bản 2.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI:** chép lại từ thẻ `v2.32.1` hai tệp. Luôn cần: `scripts/product-map.mjs` (VA2 — bộ vẽ bật lọc theo
  dõi). Kho khai `tin_hieu`: `scripts/tin-hieu.mjs` (VA2). Hai tệp chép CÙNG MỘT commit; hai mươi sáu tệp còn lại giống
  từng byte `v2.32.0`.
- **Máy dev: cài các gói theo ĐÚNG THẺ `v2.32.1` ở MỌI phạm vi**, rồi kiểm `node <gốc gói acceptance-gate>/scripts/kiem-ban-cai.mjs
  --may --ref v2.32.1 --root <bản clone kit đã git fetch --tags>` — `TỔNG KẾT: ĐẠT …` và không còn dòng `VÀNG may:`.
- **Kho có lộ trình và cửa tín hiệu:** vẽ lại `LO-TRINH.html` trong PR nâng kit — vẽ ở worktree nào cũng được.

**Người cắt mốc kit:** sau khi gắn thẻ chạy `node scripts/kiem-ban-cai.mjs --ref v2.32.1` (KC1) — dòng TỔNG KẾT ghi
vào hồ sơ `release-2-32-1`.

**crm, theo thứ tự** (nhận 2.32.1 THAY CHO 2.32.0; mọi bước nhận của 2.32.0 vẫn áp):

1. **Khi nào:** máy Mac Studio, SAU khi chuỗi đêm M5 gộp xong (~03:00Z 18/10) — onehub đang giữ; ở quãng lặng: không
   lượt S4 nào đang chạy, không vòng nào giữa hai cổng.
2. **PR nhận đang mở với 2.32.0 (crm #463):** đổi sang thẻ `v2.32.1` — làm đủ các bước 2.32.0, chỉ thay số thẻ.
3. **Cài theo thẻ `v2.32.1`** mọi gói crm đang dùng (`acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map`) ở mọi
   bản ghi (phạm vi `user`, gốc crm, từng cây phụ có phiên); kiểm `kiem-ban-cai.mjs --may --ref v2.32.1`. Mở phiên MỚI.
4. **Lớp chép CI từ thẻ** (`git archive v2.32.1`): sáu tệp của 2.32.0 lấy từ thẻ mới — trong đó `scripts/product-map.mjs`
   và `scripts/tin-hieu.mjs` mang bản vá. Đo lại bằng đường nền sau khi chép.
5. **Vẽ lại `LO-TRINH.html`** ngay trong worktree của PR nhận — **bỏ lối lách** vẽ trong bản `git clone --no-hardlinks`.
   Ý gửi bằng `/road-map:gui` mà chưa commit không lên trang (đúng hành vi mới); muốn chúng lên trang thì commit tệp ý.
6. **Đọc ngưỡng:** bước Product map `--check` của CI xanh ở PR nhận với trang vẽ trong worktree; 14 ngày sau đó (tới
   31/10) 0 lượt CI crm đỏ «LO-TRINH.html lệch» do tín hiệu, với N = số commit chạm `LO-TRINH.html` (N = 0 → chưa đọc
   được). Ngưỡng của 2.32.0 (mục crm bước 8) giữ nguyên.

**Năm dòng số của luật (c)** — một vòng có lượt chấm trong cửa sổ (giờ VN; cùng nguồn và khuôn khối token của 2.32.0):

| Hồ sơ | 1 · làm-xong→quyết-được · lượt chấm | 2 · gọi người trong / ngoài (trần) | 3 · lượt bị hạ tầng đốt | 4 · out-token S4 · vật / tìm-lỗi / tổng hợp % | 5 · phút máy / lượt |
|---|---|---|---|---|---|
| `ve-lo-trinh-doc-tin-hieu-cua-cay` (VA2, T2) | 3 g 36 · 3 (lượt 1 PASS kèm một lỗi phép đo trong hợp đồng; lượt 2 BLOCKED vì hạ tầng, thử lại cùng lượt PASS) | 2 / 0 (3) — Cổng Đáng và Phạm vi ký chung một câu | **1** — vùng 2 suite plugins quá 10 phút (đo riêng 671 s xanh); +1 ca biên: một lượt BLOCKED ngay khâu tham số (0 tác tử, lỗi nhúng tham số của phiên) | 79 573 · 47,1 / 17,3 / 35,6 | 48 · 55 · 51 = 154 |

**Đọc số:** dòng 1 ngắn hơn trung vị 2.32.0 (8 g 46) vì chữ ký không qua đêm; hạ tầng đốt một lượt đúng lớp đã gặp ở
RM3b và mốc 2.32.0 — nay đo được nguyên nhân là chính độ dài vùng 2, không phải tải song song. **Điều kiện tin cậy:**
(i) `git diff v2.32.0 <cây mốc> -- feature-loop/workflows/ feature-loop/agents/` rỗng — đường verdict không đổi;
(ii) lượt chấm sai do phép-đo-tự-dối giữa hai mốc: 0. Dòng 4–5 đọc được, nhưng một vòng không đủ để so mốc.

**Dự báo năm dòng cho thay đổi của mốc này:** 1 = · 2 ↓ ngoài thiết kế (crm thôi phải vẽ trong bản tải riêng) · 3 = ·
4 = · 5 =.

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .` (17/10).
**N không tăng so với mốc 2.32.0 (vẫn 1) — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.32.0 — 17/10/2026

Cửa sổ 2.31.0 → 2.32.0 (15/10 chiều → 17/10) là **gói `road-map` hoàn tất theo hướng B′** cộng **lượt chấm lại không
tự dối**. Điểm dừng do chủ kho chốt 17/10: «chọn điểm dừng để đóng mốc và lộ trình, rồi dọn trước khi mở mốc mới» —
phía kit là bản này, ứng với mốc «Gói road-map hoàn tất theo B′» (19/10) của lộ trình kit. Có **tám hồ sơ được ký** —
tập đối chiếu bằng `scripts/rel-cua-so.sh` (AC-4 của hồ sơ mốc): máy tự áp chính sách lộ trình (RM2, T3), kho mới cài
gói `road-map` có sẵn lộ trình (RM4), lộ trình tính bằng giờ máy (RM6), kho cam kết có lộ trình chặn mở việc ngoài kế
hoạch (RM5, T3), cửa tín hiệu giữa chiến dịch (RM3), khối dữ liệu mang giờ máy và ngày dự kiến (RM6c), cửa tín hiệu một
gốc cho mọi worktree (RM3b), lượt chấm lại không tự dối (VA1). Cộng **một vòng máy thông**: dự báo đóng băng không mất
khi dời ngày mốc (RM6b, `machine-cleared`, cửa veto mở). Cả chín vòng chạy trên máy MacBook Pro. Kho chờ nhận: `crm` —
máy Mac Studio, đợt nhận kế sau 2.31.0. Mốc đi **làn V**, không dựng răng mới. Bốn gói `acceptance-gate`,
`feature-loop`, `dieu-phoi`, `road-map` cùng lên `2.32.0` (lần này `dieu-phoi` và `road-map` đều đổi vật);
`diagram-design` giữ `2.7.1`. Tag `v2.32.0` gắn vào commit gộp PR mốc.

**Vì sao 2.32.0** (minor): mốc thêm bề mặt mới cho kho tiêu thụ — bốn lệnh mới của gói `road-map`, khoá cấu hình mới
`lo_trinh.chan`, chính sách tự áp trên mốc phát hành, bước 5d của `acceptance-init`, hai tệp mới trong lớp chép CI, giờ
máy và ngày dự kiến trên trang lộ trình. GUIDE: «minor cho luật gate mới».

**Luật chiều rộng (b):** cửa sổ chở nhiều vòng meta hơn trần «một vòng meta giữa hai mốc kho nhận». Gói `road-map` là
MỘT kết quả chủ kho gọi tên làm luôn 15/10 (bảy hàng, một mốc); VA1 là nới luật (b) chủ kho quyết 16/10 «đi cùng bản
phát hành gói road-map, không phải tiền lệ».

**Lớp chép CI 26 → 28 tệp:** thêm `scripts/gio-may.mjs` và `lib/chan-lo-trinh.cjs`; sáu tệp đổi byte so với `v2.31.0`
— kể ở mục «Kho tiêu thụ làm gì khi nhận». Hai mươi hai tệp còn lại giống từng byte `v2.31.0` (AC-8 đo trên cây mốc,
danh sách mong đợi đọc TỪ chính gạch ghi chú). Diff engine của cửa sổ còn ở: `scripts/lo-trinh-khoi-tao.mjs` (mới),
`scripts/do-vong.mjs` (mới), `scripts/gui-tin-hieu.mjs` (mới), `scripts/config-patch.mjs`, `scripts/start-scan.mjs`,
`hooks/acceptance-evidence-gate.js`, `commands/acceptance-init.md` (bước 5d),
`skills/acceptance/references/lo-trinh-du-lieu.md`, `feature-loop/skills/feature-loop/SKILL.md`,
`feature-loop/scripts/carry-plan.mjs`, `feature-loop/scripts/s4-args.mjs`, `feature-loop/scripts/thuoc-vat.mjs`, năm tệp
`dieu-phoi/scripts/` (`cua-tin-hieu.mjs` mới, `yeu-cau.mjs`, `phat-lich.mjs`, `dieu-phoi.mjs`, `mau/LUAT.md`) và sáu tệp
`road-map/` (`README.md`, bốn lệnh mới `gui`, `ghim`, `bo-ghim`, `tra-lai`, lệnh `xem` đổi).

### Lệnh mới của gói `road-map`

| Lệnh | Làm gì | Ghi gì | Vòng |
|---|---|---|---|
| `/road-map:gui <câu>` | Gửi một ý vào cửa tín hiệu; được trả «đã ghi, xử ở mốc khép» | Một tệp `nguoi-<tên git>-<n>.json` ở thư mục nguồn của **thư mục chính** của kho (chưa theo dõi git) | RM3, RM3b |
| `/road-map:ghim <mã>` | Miễn trừ một hàng khỏi tự áp; báo trước đang chờ của hàng bị huỷ ở lần áp kế | Một dòng sổ `<tệp lộ trình>.so.jsonl`; tệp lộ trình không đổi | RM2 |
| `/road-map:bo-ghim <mã>` | Bỏ miễn trừ; đề xuất vừa bị trả vẫn bị chặn tới khi căn cứ đổi | Một dòng sổ | RM2 |
| `/road-map:tra-lai <mã>` | Hoàn tác lần áp cuối của mã; mục máy chuyển đã bị sửa tay thì từ chối | Tệp lộ trình + một dòng sổ | RM2 |
| `/road-map:xem` (đổi) | Bản đồ «Xong · Đang dở · Kế» + «Rà soát» + «Tự áp» + «Giờ máy theo mốc» (lệnh nền đổi `--ra-soat` → `--xem`) | Không ghi | RM2, RM6 |

`ghim`, `bo-ghim`, `tra-lai` chỉ người gõ (khoá model-invocation, danh sách `LOCKED_ROAD_MAP` của P32, đoạn bổ sung
15/10 ở ADR 0002 — bảy lệnh khoá của `acceptance-gate` giữ nguyên); `gui` và `xem` để mở. Gói vẫn không có hook,
`acceptance-init` vẫn không tự bật gói.

### Máy tự áp chính sách lộ trình (hồ sơ `ap-chinh-sach-lo-trinh`, hàng RM2, T3)

Gốc: vòng 2 của gói `road-map` theo B′ (`docs/findings/2026-10-14-kien-truc-roadmap-plugin.md`, ADR 0025). Số đo nền
ở crm 03–14/10: 8 lần commit dời hàng bằng tay trong 12 ngày.

- **Chính sách khai một lần trên mốc phát hành** (`loai: phat-hanh`):
  `"chinh_sach": {"tu_ap": true, "tuoi_ngay", "tran_ke_tiep", "nhip_ngay": 1, "tran_ap": 5}`. Chiến dịch đang chạy là
  mốc phát hành gần nhất có ngày ≥ hôm nay. Khai sai dạng, hay khai ở mốc không phải phát hành → một cờ trên trang.
- **Báo trước rồi mới áp:** `lo-trinh.mjs --ap [--json] [--write]`. Ngày đầu chỉ báo trước, tệp lộ trình không đổi; sau
  `nhip_ngay` ngày đề xuất còn nguyên thì máy dời, tối đa `tran_ap` hàng mỗi ngày — dời mốc vào cuối mốc đang chạy,
  chờ điều kiện vào `chan_troi`, bác vào `da_bac`. Mở việc từ một hàng (khối `S0-MO-O`) thì máy áp trước, hàng đang mở
  không bị đụng; commit riêng `lo-trinh(may-ap): <n> hàng — <ngày>`.
- **Sổ tự áp** `<tệp lộ trình>.so.jsonl` cạnh tệp lộ trình, chỉ thêm dòng, mỗi dòng mang ngày. Máy chỉ ghi tệp lộ
  trình đúng dạng chuẩn (`JSON.stringify(…, null, 2)` + một dòng cuối); khác dạng → thoát 2 «tệp lộ trình không ở dạng
  chuẩn — máy không ghi».
- **Thẻ `/acceptance-gate:start`** thêm dòng `Tự áp: N báo trước (áp từ …) · M đã áp 7 ngày qua`.
- **Không đổi:** kho không có chiến dịch đang chạy khai `tu_ap: true` thì `--ra-soat`, `--mo-o` và thẻ giống từng byte
  2.31.0. Trang lộ trình không hiện sổ hay ghim. Máy không bao giờ tự chặn.
- **Giới hạn đã khai:** 13 mục ở Notes hợp đồng — đáng nhớ nhất: kho còn bản chép `scripts/lo-trinh.mjs` cũ thì máy vẫn
  tự dời nhưng `/road-map:tra-lai` báo «tham số lạ» (Ngoài-8); tệp lộ trình có BOM ở kho bật tự áp có thể làm vỡ thẻ
  khởi động và lệnh xem (Ngoài-10).
- **Ai bị ảnh hưởng:** chỉ kho khai `tu_ap: true` trên mốc. **Khi update:** chép lại `scripts/lo-trinh.mjs` cùng
  `scripts/gio-may.mjs`; cài `road-map` nếu muốn ba lệnh ghim / bỏ ghim / trả lại.

### Kho mới cài gói `road-map` có sẵn lộ trình (hồ sơ `kho-moi-cai-goi-road-map`, hàng RM4, T2)

Gốc: nấc 2 của ADR 0025 — kho trống tự khai lộ trình phải làm năm việc tay, và `product-map.mjs --check` đỏ tới khi đủ.

- **Bước 5d mới của `/acceptance-gate:acceptance-init`** (khối `INIT-LO-TRINH`) chạy
  `scripts/lo-trinh-khoi-tao.mjs --root <path> --write`, kể cả khi cấu hình đã có. Chỉ làm gì khi `.claude/settings.json`
  đã commit của kho bật `road-map@<chợ>` — `settings.local.json` và phạm vi người dùng không tính; không bật → một dòng,
  0 byte đổi.
- **Năm bước hội tụ, chạy lại an toàn:** khai `lo_trinh.tep` → miễn trừ `LO-TRINH.html` trong `t1_skip_globs` (chế độ mới
  `config-patch.mjs --append`) → lộ trình rỗng đúng khuôn ở `docs/plan/lo-trinh.json` → chép các tệp CI mang nhãn
  `[only-if-declared: lo_trinh]` khi kho đã chép lớp CI → vẽ trang. Thoát 0 xong · 2 từ chối, không ghi gì · 3
  `.claude/settings.json` hỏng.
- **Thẻ khởi động của lộ trình rỗng** chỉ đường: thêm việc bằng skill cắt lượt, rồi mở bằng `/feature-loop:feature-loop <mã>`.
- **Không đổi:** kho không cài `road-map` ở phạm vi kho — đo trên mọi kho của máy (AC-9): 0 byte. Không có lệnh khởi tạo
  riêng; máy không tự cài gói hộ kho.
- **Giới hạn đã khai:** 25 mục — nhiều nhất cửa sổ, phần lớn là ca đo có thể xanh khi bước không chạy. Đáng nhớ nhất:
  danh sách miễn trừ viết dạng gạch sát lề thì mục mới chèn sai chỗ, `config.yaml` thành không hợp lệ (Ngoài-7,
  Ngoài-15); khoá trỏ tệp ngoài kho thì lệnh báo «không ghi gì» mà đã thêm một dòng miễn trừ (Ngoài-19, Ngoài-25).
- **Ai bị ảnh hưởng:** kho chọn cài `road-map --scope project`. **Khi update:** không bước tay; kho muốn lộ trình thì cài
  gói rồi chạy lại `acceptance-init`.

### Lộ trình tính bằng giờ máy (hồ sơ `lo-trinh-gio-may`, hàng RM6, T2)

Gốc: ý định chủ kho 15/10 (hạt giống `2026-10-15-hat-giong-gio-may-va-token-lo-trinh`), Cổng Đáng ký 15/10.

- **Mỗi việc trên trang có một dòng giờ máy.** Khoá `gio_may` trên hàng (số dương hoặc `[thấp, cao]`); vắng thì máy ước
  theo hạng (T2 4–7 · T3 7–10 · hàng cắt bản 1,5–2), đủ năm vòng đo cùng hạng thì theo số đo. Khoá sai dạng → cờ.
- **Mỗi mốc in tổng giờ máy** của việc chưa giao; có dự báo đóng băng thì in «dự báo lúc bắt đầu (dd/mm): hoàn tất
  dd/mm» kèm cờ vàng «mốc quá tải». Trang vẫn tất định, không phụ thuộc hôm nay.
- **Dự báo đóng băng:** `--mo-o` ghi `_acceptance/<slug>/du-bao.json` một lần, không ghi đè. Lệnh mới
  `lo-trinh.mjs --do-lech` so dự báo với ngày mốc khép thật.
- **Đo vòng:** `scripts/do-vong.mjs` (mới) đọc bản ghi phiên rồi nối dòng `kind:"gio-may"` (giờ máy · giờ chờ · token ·
  % hạn mức tuần) vào run-log ở cuối lượt chấm (khối SKILL `S4-DO-VONG`). Lần đọc hạn mức lưu ở tệp cục bộ của máy
  `~/.claude/acceptance-gate/han-muc.jsonl` (hoặc `HAN_MUC_TEP`).
- **Không đổi:** đầu ra máy đọc (`--ra-soat`, `--ap`, `--mo-o`, khối dữ liệu) giống byte khi kho không khai `gio_may` và
  không hồ sơ đo. **Trang người nhìn CÓ đổi** — thêm dòng giờ máy.
- **Giới hạn đã khai:** 6 mục — đáng nhớ nhất: một dòng hỏng trong tệp hạn mức của máy chặn bước đo của MỌI vòng trên
  máy tới khi gỡ (Ngoài-1, Ngoài-2); gọi `do-vong.mjs` qua đường tắt thì thoát êm mà không ghi gì (Ngoài-3). Ngoài-6
  thành RM6b dưới.
- **Ai bị ảnh hưởng:** MỌI kho khai `lo_trinh.tep` — trang vẽ bằng 2.31 thì `--check` của 2.32 đỏ «LO-TRINH.html lệch
  với tệp ý định và hồ sơ — chạy: …» cho tới khi vẽ lại. **Khi update:** chép `scripts/gio-may.mjs` CÙNG
  `scripts/lo-trinh.mjs`, rồi vẽ lại `LO-TRINH.html` một lần.

### Dự báo đóng băng không mất khi dời ngày mốc (hồ sơ `du-bao-dong-bang-theo-ma-moc`, hàng RM6b, T2 — máy thông)

Gốc: Ngoài-6 của RM6 — thói quen ghi đè ngày mốc bằng ngày phát hành thật (5/5 mốc) làm trang mất dòng dự báo.

- **Bộ đọc khớp dự báo theo mã việc lúc đóng băng**, chỉ khi hồ sơ thuộc chính lộ trình ấy; dời ngày hay đổi tên mốc
  vẫn giữ dòng «dự báo lúc bắt đầu», cờ quá tải tính theo mục tiêu mới, `--do-lech` đọc được mốc đã ghi đè ngày. Nhiều
  mốc cùng nhận một dự báo: tên khớp nguyên văn > chung nhiều mã nhất > tên bỏ ngày khớp > đứng trước.
- **Không đổi:** khuôn `du-bao.json` và bên ghi; không mốc nào đổi → trang và bốn lệnh giống từng byte (AC-7).
- **Giới hạn đã khai:** 0 — lượt chấm không có mục nào trong hay ngoài hợp đồng. Hồ sơ `machine-cleared`, cửa veto mở.
- **Khi update:** cùng tệp chép `scripts/lo-trinh.mjs` với RM6.

### Kho cam kết có lộ trình: chặn mở việc ngoài kế hoạch (hồ sơ `kho-cam-ket-co-lo-trinh`, hàng RM5, T3)

Gốc: nấc 3 + nấc 4 của ADR 0025. Đo trước: từ 10/10, 13/40 hồ sơ mới của kit và 11/49 của crm không thuộc hàng nào.

- **Khoá mới `lo_trinh.chan`** trong `_acceptance/config.yaml` — vắng hoặc `false` là tắt, chỉ có hiệu lực khi `road-map`
  bật ở `.claude/settings.json` của kho. Khuôn cấu hình của `acceptance-init` không có khoá này. CỘNG — duyệt ở Cổng
  Phạm vi của RM5 (ADR 0018).
- **Một bộ đọc `lib/chan-lo-trinh.cjs` cho ba bên gọi:** hook `hooks/acceptance-evidence-gate.js` chặn (mã 2) lệnh ghi
  mở hồ sơ MỚI (`contract.md` / `opportunity.md`) không thuộc hàng nào, thông điệp nêu hai lối; lưới trước-gộp
  `scripts/pre-merge-check.sh` in `VIOLATION [<slug>]: hồ sơ mới không thuộc hàng lộ trình nào (lo_trinh.chan)`; lệnh
  mới `lo-trinh.mjs --them-hang --slug <s>` để máy tự thêm hàng khi mở vòng từ một câu mô tả (khối SKILL
  `S0-THEM-HANG`).
- **Hồ sơ đã có từ trước không bao giờ bị chấm.** `enforcement: warn/off` và `ACCEPTANCE_GATE_BYPASS=1` vẫn tác dụng.
- **Không đổi:** kho không bật — ma trận 64 lần chạy và mọi kho của máy (AC-6): hook, lưới, bộ đọc giống từng byte;
  luật không vào sổ luật của lưới nên dòng tổng kết không đổi.
- **Giới hạn đã khai:** 11 mục — đáng nhớ nhất: tệp ghi bằng lệnh shell né được hook, lưới trước-gộp bắt lúc gộp; kho
  đặt hồ sơ trong thư mục con thì lưới lọt im lặng (Ngoài-4, Ngoài-7); kho đã tắt bằng `chan: false` mà chưa chép lớp CI
  mới vẫn thấy một dòng NOTE (Ngoài-6).
- **Ai bị ảnh hưởng:** chỉ kho tự bật. **Khi update:** chép `lib/chan-lo-trinh.cjs` + `scripts/pre-merge-check.sh` +
  `scripts/lo-trinh.mjs` nếu định bật.

### Cửa tín hiệu giữa chiến dịch (hồ sơ `cua-tin-hieu-giua-chien-dich`, hàng RM3, T2)

Gốc: B′ §10–§11 — trước vòng này mọi việc phụ / việc mới giữa đợt đều trả «cần phán» và đánh thức giám sát.

- **Kho khai `tin_hieu`:** việc phụ / việc mới KHÔNG khai chặn được trả «đã ghi, xử ở mốc khép»; ý được chép thành
  `<nguồn đầu>/<tên đợt>-<id>.json`, không bao giờ đè; ý trùng tiêu đề trong 24 giờ thì gộp. Cờ mới `--chan` trên
  `dieu-phoi.mjs yeu-cau` cho ý cần giám sát phán ngay; luật thợ có khối `LUAT-CHAN` (`dieu-phoi/scripts/mau/LUAT.md`).
- **Lệnh `/road-map:gui <câu>`** cho người gửi ý (chạy `scripts/gui-tin-hieu.mjs`).
- **Thẻ khởi động** in `Cửa tín hiệu: N ý chờ gom ở mốc khép — gom bằng skill gom-tin-hieu`.
- **Không đổi:** kho không khai cửa — `tra-loi/` và `su-kien.jsonl` giống từng byte trừ khoá mới `chan` trên sự kiện
  việc phụ / việc mới; các loại yêu cầu vận hành giữ đường cũ; máy không tự gom, không tự commit tệp ý.
- **Giới hạn đã khai:** 2 mục + 1 giới hạn đo — kho chỉ khai cửa mà không khai lộ trình thì thẻ không nhắc số ý chờ gom
  (Ngoài-5); mở lại đợt cùng tên khi ý cũ chưa gom → ý trùng mã rơi về «cần phán» (Ngoài-2). Tệp ý chưa theo dõi git:
  mất máy trước khi gom là mất ý.
- **Ai bị ảnh hưởng:** kho khai `tin_hieu` và chạy đợt bằng gói `dieu-phoi`. **Khi update:** cài lại `dieu-phoi` theo
  thẻ; đợt đang chạy dùng bản lõi đã chép phẳng vào thư mục đợt — mở đợt mới để nhận hành vi mới.

### Cửa tín hiệu một gốc cho mọi worktree (hồ sơ `cua-tin-hieu-goc-moi-worktree`, hàng RM3b, T2)

Gốc: tái hiện trên main `66951212` — `/road-map:gui` từ worktree ghi vào worktree còn thợ ghi vào thư mục chính, hai bộ
đọc thấy hai tập rời nhau, dọn worktree làm mất ý. RM3 và RM3b vào CÙNG mốc nên lỗi hai gốc chưa từng tới kho tiêu thụ.

- **Bên ghi và bên đọc của cửa cùng một bộ giải thư mục chính** (`gocKhoChinh` của `dieu-phoi/scripts/dot.mjs`, qua hàm
  mới `gocNguon` của `scripts/tin-hieu.mjs`): ý gửi từ bất kỳ worktree nào nằm ở `<thư mục chính>/<nguồn>/`. Tệp ý mang
  thêm `noi_dung.gui_tu` (`worktree` / `thu-muc-chinh`).
- **Không đổi:** bản gom và cấu hình vẫn đọc theo gốc phiên; thư mục chính và CI giống từng byte trừ khoá `luc` và
  `gui_tu` (AC-4).
- **Giới hạn đã khai:** 5 mục + 1 giới hạn đo — kho là submodule hay tách thư mục git thì ý nằm trong thư mục git ẩn của
  kho cha (Ngoài-1); kho bare kèm worktree có thể dùng chung hộp ý với kho khác cùng thư mục cha (Ngoài-3).
- **Khi update:** kho khai `tin_hieu` chép lại `scripts/tin-hieu.mjs`.

### Khối dữ liệu lộ trình mang giờ máy và ngày dự kiến (hồ sơ `lo-trinh-du-lieu-ngay-du-kien`, hàng RM6c, T2)

Gốc: trang Lộ trình của crm chỉ đọc khối dữ liệu (neo crm LT1e, crm-onehub PR #435); crm 16/10: 7 mốc đang chạy, 0/7
có dự báo.

- **Khối `lo-trinh-du-lieu` thêm khoá CHỈ THÊM, giữ `phien_ban` 2:** `hang.gio_may`, `moc.gio_may`, `moc.du_kien`,
  `moc.qua_tai`. Mỗi chữ bằng đúng chữ trang in; `null` khi và chỉ khi trang không in chỗ ấy. `du_kien` là dự báo
  ĐÓNG BĂNG — không đổi theo hôm nay.
- **Tài liệu cho kho tiêu thụ** `skills/acceptance/references/lo-trinh-du-lieu.md`: bảng khoá `LO-TRINH-DU-LIEU-KHOA`,
  mục «Giờ máy và ngày dự kiến», một dòng mới trong bảng «Đọc khoan dung».
- **Không đổi:** phần trang người nhìn giống từng byte; nghĩa mọi khoá bản 2 giữ nguyên.
- **Giới hạn đã khai:** 13 mục — đáng nhớ nhất: tài liệu vẫn nói bộ đọc xử «sáu ca» trong khi bảng có tám dòng
  (Ngoài-2); mốc đã mở hết việc trước bản kit có giờ máy thì không có ngày dự kiến (crm 16/10: 2/7 mốc).
- **Ai bị ảnh hưởng:** crm (trang Lộ trình). **Khi update:** vẽ lại `LO-TRINH.html`; crm làm LT1e.

### Lượt chấm lại không tự dối (hồ sơ `cham-lai-khong-tu-doi`, hàng VA1, T2)

Gốc: crm `goi-y-mo-ke-hoach` 16/10 (crm-onehub#375) — hai ca cùng ngày: DA3b lượt 3 mang sang E10 dù `expected` đã đổi
21 → 22, thẻ hiện «0 đỏ»; K7 (Mac Studio) khoá thẻ «thước lệch» oan vì so lượt 2–3 bằng tham số lượt 1. Chủ kho nới
luật (b) cho cửa sổ này 16/10 — không phải tiền lệ.

- **Mang sang theo định nghĩa** (`feature-loop/scripts/carry-plan.mjs`): một eval chỉ được mang sang khi khối eval và chữ
  tiêu chí của nó ở sha lượt nó thật chạy bằng hôm nay; khác, hay không đọc được định nghĩa ở lượt gốc → chạy lại. Tham
  số lượt chấm nói lý do mỗi eval một dòng: «E1 không mang sang — định nghĩa eval đổi so với lượt gốc r1».
- **Thước lệch và cây đổi so bằng tham số của chính lượt vừa chấm:** `thuoc-vat.mjs --write` tự chọn tệp `s4-args*.json`
  mới nhất thuộc lượt cuối; tệp của lượt khác → thoát 2 «tệp args không thuộc lượt cuối»; không tệp nào khớp → thoát 2
  «không tệp args nào trong hồ sơ thuộc lượt cuối» — cả hai không ghi byte nào.
- **Không đổi:** eval không đổi định nghĩa vẫn mang sang như cũ; hồ sơ dùng một tệp `s4-args.json` ghi đúng các dòng như
  cũ (AC-7).
- **Giới hạn đã khai:** 7 mục — đáng nhớ nhất: dòng báo «không mang sang» phụ thuộc đúng chữ lý do của bên kia, đổi chữ
  một phía thì dòng báo mất im (việc chạy lại vẫn đúng — Ngoài-7). Sổ đã mang dòng thước lệch sai sha (K7) KHÔNG được cứu
  hồi tố: hồ sơ ấy vẫn khoá tới khi người chọn lối ra.
- **Ai bị ảnh hưởng:** mọi kho chạy chấm lại. **Khi update:** cài `feature-loop` theo thẻ; không tệp chép CI.

**Khoá cấu hình mới của cửa sổ:**

| Khoá | Ở đâu | Mặc định | Ai bật |
|---|---|---|---|
| `lo_trinh.chan` | `_acceptance/config.yaml` | vắng = tắt | kho muốn chặn hồ sơ ngoài lộ trình; cần `road-map` bật ở `.claude/settings.json` (RM5) |
| `chinh_sach` trên mốc `phat-hanh`: `tu_ap` · `tuoi_ngay` · `tran_ke_tiep` · `nhip_ngay` · `tran_ap` | tệp lộ trình | `tu_ap` vắng = chỉ đề xuất; `nhip_ngay` 1; `tran_ap` 5 | chủ kho, lúc mở mốc (RM2) |
| `gio_may` trên hàng | tệp lộ trình | vắng = máy ước | kho tự khai khi muốn số tay (RM6) |

Biến môi trường mới: `CLAUDE_PROJECTS_DIR`, `HAN_MUC_TEP` (RM6). Tệp khuôn mới: `_acceptance/<slug>/du-bao.json`, dòng
run-log `kind:"gio-may"`, sổ `<tệp lộ trình>.so.jsonl`.

**Đường đọc-cũ — không kho nào phải sửa hồ sơ:**

- Khối dữ liệu (RM6c): bộ đọc mới gặp trang cũ → bốn khoá `null` + đúng một cờ «trang vẽ bằng bộ kit chưa có giờ máy
  trong khối — … vẽ lại bằng bộ kit mới»; bộ đọc cũ của crm gặp trang mới không ném, không cảnh báo, khoá bản 2 y nguyên
  (AC-7, đo trên bản chép thật của crm).
- Dự báo (RM6, RM6b): hồ sơ trước RM6 không có `du-bao.json` → `--do-lech` in «chưa đóng băng dự báo — không đo được
  lệch», trang không in dòng dự báo.
- `gio_may`, `chinh_sach` trên mốc: bộ đọc 2.31 bỏ qua, không vỡ.
- `lo_trinh.chan`: vắng = tắt; lưới mới mà thiếu `lib/chan-lo-trinh.cjs` ở kho bật → một dòng
  `NOTE: luật chặn lộ trình NOT ENFORCED — thiếu node hoặc lib/chan-lo-trinh.cjs (chép lại lớp CI theo đợt phát hành)`.
- Cửa tín hiệu: bộ đọc bỏ qua `gui_tu`; thư mục nguồn chưa có → thẻ coi là 0 ý.
- Mang sang (VA1): không đọc được định nghĩa ở lượt gốc → chạy lại, không mang sang mù.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI:** chép lại từ thẻ `v2.32.0` sáu tệp. Luôn cần: `scripts/pre-merge-check.sh` (RM5 — gọi luật chặn khi
  có bộ đọc; kho không bật không khác) và `scripts/product-map.mjs` (RM4 — tách hàm vẽ trang cho bước 5d). Kho khai
  `lo_trinh`: `scripts/lo-trinh.mjs` (RM2, RM4, RM5, RM6, RM6b, RM6c) CÙNG LÚC với tệp mới `scripts/gio-may.mjs` —
  `lo-trinh.mjs` nạp nó ngay lúc nạp, thiếu thì bước bản đồ đỏ `ERR_MODULE_NOT_FOUND`; và tệp mới
  `lib/chan-lo-trinh.cjs` (RM5 — chỉ có tác dụng khi bật `lo_trinh.chan`; thiếu ở kho bật thì một dòng NOTE, không vỡ).
  Kho khai `tin_hieu`: `scripts/tin-hieu.mjs` (RM3b). Không phụ thuộc mới ngoài hai tệp mới đã kể.
- **Máy dev: cài `acceptance-gate`, `feature-loop` (và `dieu-phoi`, `road-map` nếu kho dùng) theo ĐÚNG THẺ ở MỌI phạm
  vi**, rồi kiểm `node <gốc gói acceptance-gate>/scripts/kiem-ban-cai.mjs --may --ref v2.32.0 --root <bản clone kit
  đã git fetch --tags>`. Sống là `TỔNG KẾT: ĐẠT …` VÀ không còn dòng `VÀNG may:` nào của các gói đã cài.
- **Kho có lộ trình:** vẽ lại `LO-TRINH.html` một lần trong PR nâng kit (`node scripts/product-map.mjs --root .`) —
  trang có thêm dòng giờ máy.

**Người cắt mốc kit:** sau khi gắn thẻ chạy `node scripts/kiem-ban-cai.mjs --ref v2.32.0` (KC1) — dòng TỔNG KẾT ghi
vào hồ sơ `release-2-32-0`.

**crm, theo thứ tự** (nhận SAU 2.31.0; ghi chú nhận của các mốc trước vẫn áp):

1. **Khi nào, ở đâu:** máy Mac Studio, sau khi đợt nhận 2.31.0 đã gộp và đo lại đường nền, ở quãng lặng: không lượt S4
   nào đang chạy, không vòng nào giữa hai cổng. Chưa nhận 2.31.0 → làm trọn các bước 2.31.0 trước rồi nâng tiếp.
2. **Cài theo thẻ `v2.32.0`:** gỡ rồi cài lại mọi gói crm đang dùng (`acceptance-gate`, `feature-loop`, `dieu-phoi`,
   `road-map`) ở mọi bản ghi (phạm vi `user`, gốc crm, từng cây phụ có phiên). Kiểm bằng `kiem-ban-cai.mjs --may --ref v2.32.0` —
   ĐẠT và không còn dòng `VÀNG may:` của các gói đã cài. Không cài từ `main` giữa hai thẻ. Mở phiên MỚI sau khi cài.
3. **Lớp chép CI từ thẻ** (`git archive v2.32.0`) — crm khai cả `lo_trinh` lẫn `tin_hieu`: chép lại sáu tệp
   `scripts/pre-merge-check.sh`, `scripts/product-map.mjs`, `scripts/lo-trinh.mjs`, `scripts/gio-may.mjs`,
   `lib/chan-lo-trinh.cjs`, `scripts/tin-hieu.mjs` CÙNG MỘT commit. Đo lại bằng đường nền sau khi chép.
4. **Vẽ lại `LO-TRINH.html`** trong PR nâng kit — trang có dòng giờ máy; khối dữ liệu có `gio_may`, `du_kien`, `qua_tai`
   cho trang Lộ trình của CRM (LT1e đọc chúng).
5. **Gói `road-map` — cài khi muốn các lệnh mới:** cài theo kho, phạm vi project ở gốc crm — có thêm
   `/road-map:gui` (gửi ý vào cửa), `ghim`, `bo-ghim`, `tra-lai`. Tự áp và luật chặn KHÔNG tự bật: chỉ khi chủ kho khai `tu_ap: true` trên mốc hay `lo_trinh.chan: true`.
6. **Đợt `dieu-phoi` đang chạy** giữ bản lõi đã chép vào thư mục đợt — ý mới giữa đợt chỉ vào cửa từ đợt mở sau khi cài.
7. **Đo trước → sau** (tiền lệ `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`): trên cùng một cây, lưới
   trước-merge và thẻ của các hồ sơ đang mở dưới 2.31.0 rồi 2.32.0 — phán quyết từng hồ sơ phải bằng nhau. Chỗ mốc hứa
   đổi đều là TRÌNH BÀY (dòng giờ máy, dòng tự áp và cửa tín hiệu trên thẻ khởi động) hoặc CHẠY LẠI eval đổi định nghĩa
   ở lượt chấm lại (VA1). Phán quyết khác ở bất kỳ đâu là tín hiệu.
8. **Đọc ngưỡng ở vòng crm đầu tiên sau khi nhận:** trang Lộ trình của CRM hiện ngày dự kiến của ít nhất một mốc đang
   chạy mà không hộp cảnh báo (RM6c) · 30 ngày lượt chấm lại không có dòng mang sang nào mà định nghĩa eval đã đổi, không
   dòng thước lệch hay cây đổi nào mang sha của lượt khác (VA1) · ý gửi từ worktree nằm ở thư mục chính (RM3b) · đợt đầu
   mở bằng gói sau khi cài: mọi ý không chặn có chỗ trong cửa, 0 «cần phán» (RM3).

**Đường đo của các vòng, đọc ở mốc này:** ngưỡng RM6 («lệch ≤ 1 ngày ở mốc phát hành đầu tiên bắt đầu sau khi RM6 lên
`main`») chưa đọc — mốc «Gói road-map hoàn tất theo B′» bắt đầu 15/10, trước khi RM6 gộp 16/10, nên theo chữ nó không
phải mốc đo. Số tham khảo, `lo-trinh.mjs --do-lech` trên lộ trình kit 17/10: dự báo hoàn tất 17/10 (đóng băng 16/10) ·
khép thật 17/10 · lệch 0 ngày · 2 hàng thêm sau đóng băng; 3/8 vòng có số đo giờ máy. Ngưỡng RM6b đọc được trên dữ
liệu thật: đổi tên mốc sang dạng đã phát hành và ghi đè ngày vẫn in dòng dự báo. MC1 và RM1 (hẹn từ 2.31) đọc ở mốc
kit 05/11.

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng của từng vòng — đủ ở chín hợp đồng): `ap-chinh-sach-lo-trinh`
13 · `kho-moi-cai-goi-road-map` 25 · `lo-trinh-gio-may` 6 · `du-bao-dong-bang-theo-ma-moc` 0 ·
`kho-cam-ket-co-lo-trinh` 11 · `cua-tin-hieu-giua-chien-dich` 2 (+1 giới hạn đo) · `lo-trinh-du-lieu-ngay-du-kien` 13 ·
`cua-tin-hieu-goc-moi-worktree` 5 (+1 giới hạn đo) · `cham-lai-khong-tu-doi` 7. Hạt giống mới của cửa sổ:
`2026-10-15-hat-giong-co-gia-ho-so-tro-hang-sau-tu-ap` (RM2 Ngoài-11) · `2026-10-16-hat-giong-khoi-tao-lo-trinh-im-lang`
(RM4 Ngoài-1, Ngoài-6) · `2026-10-16-hat-giong-tep-sinh-xung-dot-moi-lan-goi` (#365) ·
`2026-10-17-hat-giong-so-chu-tieu-chi-nhieu-ma` (VA1) · `2026-10-17-hat-giong-args-tuong-minh-khong-doc-duoc` (VA1) ·
sáu hạt giống của đợt đóng 17/10 (#372): `2026-10-17-hat-giong-khuon-bang-ke-hoach-bi-chep-tieu-de` (bẫy P93) ·
`2026-10-17-hat-giong-s4-args-moc-so-main-cuc-bo-cu` · `2026-10-17-hat-giong-ky-lai-sau-doi-loi-tieu-chi` ·
`2026-10-17-hat-giong-do-ngoai-vung-tieu-tran-ba-luot` · `2026-10-17-hat-giong-cap-nhat-plugin-cay-phu-nham-ban-ghi-goc` ·
`2026-10-11-hat-giong-northstar-tu-dot-crm-sau-14-10`;
ba hạt giống đã thành hàng trong chính cửa sổ (`…-gio-may-va-token-lo-trinh` → RM6, `…-khoi-du-lieu-gio-may` → RM6c,
`…-du-bao-dong-bang-theo-ma-moc` → RM6b) và một đã đóng (`…-cua-tin-hieu-mot-goc` → RM3b).

**Năm dòng số của luật (c)** — chín vòng có lượt chấm trong cửa sổ (giờ VN; nguồn: giờ commit `contract.md`,
`usage-report.md`, `decisions.jsonl`, `run-log.jsonl` của hồ sơ; dòng 1 tính từ commit đặt `implemented` đầu tiên tới
commit chữ ký Cổng Bằng chứng — RM6b tới commit `cleared`; ba khối token theo khuôn 2.25: chứng-minh-vật =
machine+ui+judge+baseline · tìm-lỗi = review+refute · tổng hợp = triage+capture+synthesize; Cổng Đáng không tính, theo
khuôn 2.26; bộ đọc token đối chứng trên BN1 và MC1 của 2.31 ra đúng số đã in):

| Hồ sơ | 1 · làm-xong→quyết-được · lượt chấm | 2 · gọi người trong / ngoài (trần) | 3 · lượt bị hạ tầng đốt | 4 · out-token S4 · vật / tìm-lỗi / tổng hợp % | 5 · phút máy / lượt |
|---|---|---|---|---|---|
| `ap-chinh-sach-lo-trinh` (RM2, T3) | 3 g 02 · 3 (lượt 1 REJECT thật — hai lỗi trong hợp đồng; lượt 2 REJECT chỉ vì P179 + JR11c bắt tệp của chính hồ sơ) | 3 / 0 (4) | 0 (+1 ca biên: lượt 2) | 94 318 · 30,9 / 26,4 / 42,7 | 38 · 36 · 37 = 111 |
| `kho-moi-cai-goi-road-map` (RM4, T2) | 13 g 12 · 3 (lượt 2 REJECT chỉ vì P179; chờ gộp main giữa lượt 1 và 2 ≈ 7 g 50) | 2 / 0 (3) | 0 (+1 ca biên: lượt 2) | 114 833 · 29,9 / 21,9 / 48,2 | 39 · 36 · 36 = 111 |
| `lo-trinh-gio-may` (RM6, T2) | 13 g 05 · 2 (`implemented` đặt sớm, S3 còn sửa ≈ 6 g; chờ ký qua đêm 5 g 52) | 2 / 0 (3) | 0 | 43 303 · 35,9 / 17,0 / 47,1 | 38 · 36 = 74 |
| `du-bao-dong-bang-theo-ma-moc` (RM6b, T2, máy thông) | 3 g 14 · 1 | 0 / 0 (3) — Cổng Phạm vi làn V, không mời ký | 0 | 21 263 · 50,1 / 24,7 / 25,2 | 38 |
| `kho-cam-ket-co-lo-trinh` (RM5, T3) | 5 g 34 · 2 | 2 / 0 (4) — Gate 1.5 không có dòng duyệt trong sổ; có thì 3 / 0 | 0 | 64 578 · 36,9 / 21,3 / 41,8 | 39 · 40 = 79 |
| `cua-tin-hieu-giua-chien-dich` (RM3, T2) | 13 g 44 · 2 (chờ trước lượt 1 7 g 34; chờ người qua đêm 3 g 35) | 2 / 1 (3) — ngoài thiết kế: chủ kho nâng phạm vi Ngoài-1/3 ở Cổng Bằng chứng lượt 1 | 0 | 73 802 · 40,0 / 24,0 / 36,0 | 37 · 40 = 77 |
| `lo-trinh-du-lieu-ngay-du-kien` (RM6c, T2) | 6 g 12 · 2 (lượt 1 REJECT chỉ vì P93, 8/8 eval đạt; mốc so lấy `main` cục bộ cũ) | 2 / 0 (3) | 0 (+1 ca biên: lượt 1) | 66 497 · 33,9 / 27,6 / 38,5 | 37 · 40 = 77 |
| `cua-tin-hieu-goc-moi-worktree` (RM3b, T2) | 15 g 26 · 2 (chờ ký qua đêm 7 g 38) | 1 / 0 (3) — Cổng Phạm vi làn V | **1** — lượt 1 BLOCKED: vùng 2 suite plugins quá 30 phút khi 11 bộ kiểm chạy song song (đo riêng 454 s xanh); cùng lượt có 4 lỗi đo thật | 67 692 · 34,6 / 27,2 / 38,2 | 78 · 41 = 119 |
| `cham-lai-khong-tu-doi` (VA1, T2) | 8 g 46 · 3 (lượt 1 REJECT chỉ vì P93, 9/9 eval đạt; chờ ký qua đêm 4 g 55) | 2 / 0 (3) — Cổng Đáng và Phạm vi ký chung một câu | 0 (+1 ca biên: lượt 1) | 87 186 · 40,9 / 22,2 / 36,9 | 39 · 39 · 37 = 115 |

Cộng chín vòng: **20 lượt chấm** (trung vị làm-xong→quyết-được 8 g 46) · **633 472 out-token** (chứng-minh-vật 35,4 % ·
tìm-lỗi 23,7 % · tổng hợp 40,8 %) · **≈ 799 phút máy** · **17 lượt gọi người — 16 theo thiết kế, 1 ngoài thiết kế**
(RM3), **0 vòng vượt trần** theo khuôn 2.26 · hạ tầng đốt **1 lượt chấm** (RM3b; 4 ca biên). Phiên chính không đo
token. Số chạm: sổ không ghi trường riêng; mọi lượt có ghi đều là một câu gộp.

**Đọc số:**

- **4/20 lượt REJECT mà mọi eval của hợp đồng đều đạt** — bộ kiểm luật kho bắt tệp của chính hồ sơ (P179 ở RM2, RM4;
  P93 ở RM6c, VA1; JR11c ở RM2). Bốn lượt tốn 132 974 token (21 %) và ≈ 148 phút máy. Hai bẫy đã ghi từ RM2 (15/10) mà
  vẫn tái phạm 16/10: lời dặn không đủ làm nghiệm — P93 đã thành hạt giống
  `2026-10-17-hat-giong-khuon-bang-ke-hoach-bi-chep-tieu-de` (#372); P179 chưa có.
- **Tìm-lỗi 23,7 % token, mốc thứ tư liên tiếp tăng** (2.29: 15,9 · 2.30: 18,5 · 2.31: 20,1); chứng-minh-vật giảm 43,4 →
  35,4 %, tổng hợp tăng 36,6 → 40,8 % theo số mục ngoài hợp đồng (RM4 33 mục, tổng hợp 48,2 %). Token trung bình mỗi
  lượt giảm 39 061 → 31 674.
- **Dòng 1 gần gấp đôi** (trung vị 4 g 32 → 8 g 46) trong khi máy chấm chỉ tốn 38–119 phút mỗi vòng: phần còn lại là
  chờ ký qua đêm và chờ gộp main giữa các lượt. Ngoài lượt chấm, tám làn ghim lại có số tốn ≈ 298 phút (≈ 37 % phút S4)
  — giá của việc gộp nối tiếp nhiều PR chạm cùng `scripts/lo-trinh.mjs` trong một cửa sổ.
- **Gọi người ngoài thiết kế 2 → 1**, trung bình 1,9 lượt gọi mỗi vòng (2.31: 2,25). Ca duy nhất (RM3) cùng hình dạng
  MC1/RM1 của 2.31: chủ kho nâng phạm vi ở Cổng Bằng chứng.

**Điều kiện tin cậy:** (i) đường verdict (finder → refute trong hợp đồng → REJECT) không đổi thành phần:
`git diff v2.31.0 <cây mốc> -- feature-loop/workflows/ feature-loop/agents/` rỗng, cả 20 lượt chạy cùng một bản
workflow. Gần đường verdict có một đổi ĐẦU VÀO: VA1 làm luật mang sang chặt hơn (`carry-plan.mjs`, `thuoc-vat.mjs`,
`s4-args.mjs`) — lượt chấm lại có thể chạy thêm eval, đẩy dòng 4–5 lên nhẹ. (ii) Lượt chấm sai do phép-đo-tự-dối giữa
hai mốc: **0** trên chín vòng của kit, nhưng **2 ca ở crm** ngày 16/10 (DA3b lượt 3 mang sang E10 đã đổi `expected`;
K7 khoá «thước lệch» oan) — lỗi nằm ở mã kit, phán quyết sai tới thẻ người ký, và chính VA1 của mốc này là bản sửa.
Đếm hai ca ấy thì **ngưỡng (a) chạm 2/2** và vế (ii) «không tăng» KHÔNG đạt (0 → 2). Vì vậy dòng 4–5 in để đọc, KHÔNG
dùng để so với 2.31 ở mốc này.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | = | không mục nào chạm đoạn từ `implemented` tới chữ ký |
| 2 | ↓ ngoài thiết kế | chủ kho thôi dời hàng bằng tay khi bật tự áp (RM2); ý mới giữa đợt vào cửa thay vì đánh thức giám sát (RM3) — cạnh *mù*, reality đọc |
| 3 | = | không mục nào chạm hạ tầng lượt chấm |
| 4 | ↑ nhẹ | lượt chấm lại chạy lại eval đổi định nghĩa thay vì mang sang (VA1) |
| 5 | ↑ nhẹ / lượt chấm lại | cùng lý do dòng 4 |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .` (17/10).
**N không tăng so với mốc 2.31.0 (vẫn 1) — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.31.0 — 15/10/2026

Cửa sổ 2.30.0 → 2.31.0 (14/10 sáng → 15/10 sáng) có **bốn hồ sơ được ký** — tập đối chiếu bằng
`scripts/rel-cua-so.sh` (AC-4 của hồ sơ mốc): thẻ Cổng Bằng chứng in mục Ngoài-n thành bảng có căn cứ (BN1, T3, máy
M5), đường nền không tính tệp của chính vòng (NV1, máy M5), mốc là chiến dịch (MC1, máy MacBook Pro) và rà soát lộ
trình + gói thứ năm `road-map` (RM1, máy MacBook Pro). Phạm vi chốt giữa hai máy trên kit #308 (15/10 00:29Z): MC1 và
RM1 gộp vào mốc này để crm nhận MỘT lần cắt thay vì hai. Hàng MC1 và RM1 chuyển sang mốc «Phát hành 2.31.0» của lộ
trình kit NGAY trong PR mốc — điều phối M5 quyết 07:00Z sau khi hỏi MacBook Pro trên #308 (không có PR lộ trình
riêng), chủ kho đồng ý; mốc «Tinh chỉnh sau hai đợt thử» 05/11 giữ lại với 0 hàng. Kho chờ nhận: `crm` — máy Mac Studio, đợt nhận kế sau 2.30.0
(crm PR #413). Mốc đi **làn V**, không dựng răng mới. Bốn gói `acceptance-gate`, `feature-loop`, `dieu-phoi`,
`road-map` cùng lên `2.31.0` (`dieu-phoi` không đổi vật — số đi cùng; `road-map` lần đầu có trong một mốc);
`diagram-design` giữ `2.7.1`. Tag `v2.31.0` gắn vào commit gộp PR mốc.

**Vì sao 2.31.0** (minor): mốc thêm bề mặt mới cho kho tiêu thụ — một gói cài được (`road-map`), một lệnh mới
(`lo-trinh.mjs --ra-soat`), cờ vàng mới trên trang lộ trình và thẻ khởi động (MC1), khối «Dòng vàng» mới của đường nền
(NV1) và cột mới trên thẻ Cổng Bằng chứng (BN1). GUIDE: «minor cho luật gate mới».

**Lớp chép CI giữ 26 tệp, không thêm:** đổi ba tệp so với `v2.30.0` — kể ở mục «Kho tiêu thụ làm gì khi nhận».
Hai mươi ba tệp còn lại giống từng byte `v2.30.0` (AC-8 đo trên cây mốc, danh sách mong đợi đọc TỪ chính gạch ghi
chú). Diff engine của cửa sổ còn ở: `scripts/gate-card.js`, `scripts/start-scan.mjs`, `commands/start.md`,
`commands/acceptance-card.md`, `skills/cat-luot/SKILL.md`, ba khuôn trong `skills/acceptance/references/`
(`duong-nen-template.md`, `lo-trinh-du-lieu.md`, `pham-vi-template.md`), `feature-loop/scripts/duong-nen.mjs` (+ mô-đun
mới `feature-loop/scripts/lib/tep-cua-vong.mjs`), `feature-loop/scripts/carry-plan.mjs`,
`feature-loop/workflows/acceptance-verify.js`, `feature-loop/skills/feature-loop/SKILL.md` và gói mới `road-map/`.
`dieu-phoi/` không đổi một byte ngoài số.

### Thẻ Cổng Bằng chứng: mục ngoài hợp đồng thành bảng có cột «Căn cứ» (hồ sơ `bang-ngoai-n-co-can-cu`, hàng BN1, T3)

Gốc: crm `kanban-viec` (14/10) — ở Cổng Bằng chứng, phiên crm tự soạn tay cho chủ kho một bảng mười mục Ngoài-n kèm lý
do từng đề xuất, vì thẻ không in lý do nào. Nay thẻ tự làm điều đó:

- **Bảng bốn cột** Mục · Người dùng gặp gì · Máy đề xuất · Căn cứ thay cho các khối xếp chồng; mỗi mục một hàng, mã
  `Ngoài-<số>` giữ đúng số như trước (theo vị trí trong `review-findings.md`).
- **Mục cần anh quyết đứng đầu**: đề xuất mở việc mới, chưa đề xuất hay đề xuất viết sai khuôn → rồi mục máy khuyên ghi
  hạn chế hoặc chấp nhận → rồi mục máy đã tự định tuyến (kho bật `feature_loop.ngoai_n_tu_dinh_tuyen`).
- **Căn cứ** là một câu bước phân loại phạm vi của lượt chấm viết cho mỗi mục: hậu quả nặng hay nhẹ, mất hay lộ dữ liệu
  không, người dùng tự gỡ được không, sửa sau rẻ hay đắt. Nó nằm trong `review-findings.md` (dòng `Căn cứ:` của khuôn
  mục) và đi theo cả mục mang sang lượt chấm sau.
- **Màn hẹp** (≤ 560 px): mỗi hàng thành một thẻ dọc có nhãn cột.
- Ba nút lặp ở từng mục gom thành một dòng «Mỗi mục: ghi Known limits · mở hợp đồng mới · nâng phạm vi sửa ngay».

**Không đổi:** dòng lệnh ký (`Ngoài-<số>: …`), ba lựa chọn, chữ đề xuất của máy, luật máy tự định tuyến.

**Hồ sơ chấm trước bản này** (không có dòng `Căn cứ:`): ô hiện «chưa có căn cứ» và thẻ cắm MỘT cờ vàng đếm số mục thiếu
— không phải sửa hồ sơ, lượt chấm kế sẽ có căn cứ. Bộ đọc cũ (lớp CI vendored chưa chép lại) đọc tệp khuôn mới không
lệch trường nào (đo bằng ca BN-1-cu).

**Ai bị ảnh hưởng:** kho tiêu thụ chỉ cần nhận mốc như mọi lần — lớp CI vendored chép lại `lib/out-of-contract.cjs`
theo mốc. Không khoá mới, không tệp mới phải chép.

### Đường nền không đổ đỏ cho tệp của chính vòng (hồ sơ `nen-khong-tinh-tep-cua-vong`, hàng NV1, T2)

Gốc: crm-onehub#375 (Mac Studio 13/10 16:51Z) — ba ca trong hai ngày (crm `lich-su-va-luu-tru-trang`, crm
`dai-luu-tru-dung-chung`, kit `bang-ngoai-n-co-can-cu`). S1#0 chạy đường nền ở nền rồi soạn S1 song song; tệp S1 ghi
vào cây trong lúc chân suite chạy thành `CAY BAN SAU SUITE`, và chân lưới đọc hồ sơ viết dở thành `VIOLATION [<slug>]`
— nền đỏ dù hạ tầng lành. Đo 14/10: 233 dòng `CAY BAN` lịch sử ở 43 hồ sơ, 0 đỏ thật. Chủ kho ký Cổng Đáng «lọc tại
chỗ» — không worktree (vỡ 4/8 kho), không khoá cấu hình mới.

- **Tệp của vòng vào mục «Dòng vàng»**, không lật nền: tệp mới dưới `_acceptance/<slug>/`, spec/plan theo khuôn tên
  `docs/superpowers/{specs,plans}/<ngày>-<slug>…`, thư mục MỚI tên slug (không có ở HEAD), `_acceptance/config.yaml`,
  và `VIOLATION [<slug>]` của chính hồ sơ (`nen luoi: 1 vi pham cua chinh vong (khong tinh)`). Tệp không của vòng — kể
  cả hồ sơ `<slug>-2`, tên gần giống, thư mục tên slug đã có ở HEAD — vẫn đỏ như 2.30.0. Phát lại trên 230 dòng lịch sử:
  197/197 dòng S1 song song thành vàng, 4/4 dòng rác thật vẫn đỏ.
- **Lưới chết giữa chừng vẫn đỏ:** bản lưới in `VIOLATION [<slug>]` rồi thoát vì một lệnh hỏng (không dòng tóm) →
  `nen luoi: LOI CHAY ma 1`, không bị nuốt vào dòng vàng.
- **Thẻ Cổng Phạm vi** in mục «Dòng vàng» trong khối «Nền hạ tầng» dưới nhãn «Tệp của chính vòng — nền không tính»;
  thẻ Cổng Bằng chứng chỉ dựa câu «đỏ từ trước vòng» trên dòng đỏ. Khuôn `duong-nen-template.md` có khối máy đọc
  `DUONG-NEN-DONG-VANG`; khuôn thiếu mã thì lệnh thoát 2 có tên, không ghi tệp.
- **Đánh đổi đã ký:** suite ghi vào `_acceptance/config.yaml` hiện vàng thay vì đỏ (0/233 ca lịch sử).
- **Giới hạn đã khai:** bảy mục ở Notes hợp đồng — đáng nhớ nhất: hướng dẫn S1 nói «mọi tệp mang tên vòng» trong khi
  chỉ bốn loại đường của khuôn thành vàng (Ngoài-2); tệp của vòng có tên tiếng Việt có dấu vẫn đỏ giả như trước vì git
  in đường trong ngoặc kép (Ngoài-4).
- **Ai bị ảnh hưởng:** mọi kho chạy feature-loop — `duong-nen.md` có thêm mục «Dòng vàng»; `duong-nen.md` cũ vẫn đọc
  được (thẻ không in nhãn mới). **Khi update:** không bước tay, không tệp chép.

### Mốc là chiến dịch (hồ sơ `moc-la-chien-dich`, hàng MC1, T2 — máy MacBook Pro)

Gốc: `crm/_acceptance/tin-hieu-tu-ve-kho/` (`BAN-GIAO.md`); nấc 1 của ADR 0025 (lộ trình thành ràng buộc theo bậc
thang). Chủ kho gọi tên 14/10 — CỘNG, duyệt đích danh ở Cổng Phạm vi.

- **Ba cờ vàng mới**, trên trang lộ trình (mục «Cần sửa trong kế hoạch», ô trạng thái, khối dữ liệu) và trên thẻ
  `/acceptance-gate:start`: *kho chưa khai lộ trình* — đúng một dòng trên thẻ khởi động của kho thiếu khoá
  `lo_trinh.tep` · *việc đang mở mà chưa thuộc mốc nào* — chỉ khi kho dùng mốc, chỉ hàng cân nhắc · sắp mở · chờ duyệt
  · đang dựng · *hồ sơ đang mở không thuộc việc nào*. Cờ là vàng — không chặn, không đổi phán quyết; `product-map
  --check` vẫn thoát 0 khi trang đã vẽ lại.
- **Lệnh mở việc từ hàng lộ trình** (khối `S0-MO-O`) in thêm `moc`, `ten_phien`, `nhom`: tên phiên dạng
  `<mã> · <tên ngắn> (<kho>)` và nhóm thanh bên dạng `<lộ trình> · <mốc> <dd/mm>` theo mốc ngày sớm nhất; ô cơ hội có
  thêm dòng `Mốc: …`. SKILL feature-loop S0 dặn phiên đặt tên và xếp nhóm theo đó (khối `S0-TEN-CHIEN-DICH`).
- **Mù đã khai (Thước↔Vật):** công cụ đặt tên phiên và nhóm thanh bên của app không gọi được trong lượt chấm — không
  eval nào chứng phiên THẬT SỰ được xếp; reality đọc ở «Đường đo» dưới.
- **Giới hạn đã khai:** bảy mục ở Notes hợp đồng — đáng nhớ nhất: bộ đo DP2-11 đọc ký hiệu kết quả của Node bản mới,
  máy chấm Node 22 có thể đỏ nhầm (Ngoài-1); ca MC-11 đọc lộ trình kit thật — dời hay đổi tên mốc 05/11 sẽ làm ca đỏ ở
  PR không liên quan (Ngoài-9) — đã xảy ra ở chính PR mốc này, xem con trỏ dưới. Ba mục chủ kho chọn mở hợp đồng mới →
  hạt giống
  `2026-10-14-hat-giong-co-ho-so-ngoai-ke-hoach-gon`.
- **Con trỏ thay thế ở mốc (ca đo, không sửa hồ sơ đã ký):** AC-11 của `moc-la-chien-dich` hứa «hàng MC1 thuộc đúng
  một mốc (ngày 2026-11-05)» và `nhom` = «Tinh chỉnh sau hai đợt thử 05/11». PR mốc chuyển MC1 sang mốc «Phát hành 2.31.0»
  16/10 nên ca MC-11 nay đòi ngày `2026-10-16` và `nhom` = «Phát hành 2.31.0 16/10»; hàm `tenChienDich` không đổi. Chiều
  đỏ đo trên lộ trình mới trước khi sửa ca: `FAIL: MC-11 — MC1 thuộc 1 mốc ["2026-10-16"] ; nhom «Phát hành 2.31.0 16/10»`.
- **Ai bị ảnh hưởng:** MỌI kho không khai `lo_trinh.tep` thấy thêm MỘT dòng vàng trên thẻ khởi động (không chặn); kho
  khai lộ trình và dùng mốc thấy thêm cờ trên trang — đo crm ở `1997da85`: OKR 12 → 26 cờ, Việc và Dự án 4 → 5, Kho
  tài liệu 2 → 2. **Khi update:** chép lại `scripts/lo-trinh.mjs` (kho khai `lo_trinh`), vẽ lại `LO-TRINH.html`.

### Rà soát lộ trình + gói `road-map` (hồ sơ `ra-soat-lo-trinh`, hàng RM1, T2 — máy MacBook Pro)

Gốc: `crm/_acceptance/tin-hieu-tu-ve-kho/` — lộ trình chỉ có cửa vào, không có cửa ra. Vòng 1 của gói `road-map` theo
hướng B′ (`docs/findings/2026-10-14-kien-truc-roadmap-plugin.md`, ADR 0025). Lát «chỉ cờ»: máy đề xuất, KHÔNG tự áp,
KHÔNG ghi tệp lộ trình.

- **Đề xuất rà soát kèm căn cứ máy đọc:** `lo-trinh.mjs --root . --ra-soat` (chữ) và `--ra-soat --json` liệt hàng
  nên *dời mốc* (mốc `loai: phat-hanh` đã qua ngày mà hàng chưa có hồ sơ), *chờ điều kiện* (hàng xếp lại — theo hồ sơ
  hay tự khai) hay *bác* (hồ sơ đã bác). Mốc không khai `loai` không được rà soát. Chính sách tuỳ chọn ở đầu tệp lộ
  trình `"chinh_sach": {"tuoi_ngay": 30, "tran_ke_tiep": 10}` thêm hai luật — tuổi hàng «Kế tiếp» theo lịch sử git và
  trần số hàng «Kế tiếp»; khai sai dạng → một cờ trên trang, không đề xuất chính sách nào.
- **Thẻ `/acceptance-gate:start`** in một dòng tổng `Rà soát: N đề xuất — a dời mốc · b chờ điều kiện · c bác`, tối đa
  năm dòng chi tiết và một dòng lệnh xem phần còn lại — lệnh chạy được ở kho không có bộ máy kit. 0 đề xuất → thẻ giống
  từng byte 2.30.0. Rà soát phụ thuộc hôm nay nên KHÔNG vào trang lộ trình (trang tất định, `--check` so byte).
- **Không bao giờ im khi không đọc được:** tệp lộ trình hỏng → stderr nêu tệp, thoát 1; thư mục không phải kho git →
  cảnh báo «không đọc được tuổi hàng — luật tuổi không chạy»; clone nông → «lịch sử cụt — tuổi hàng là tuổi tối thiểu».
- **Cắt lượt:** `cat-luot.mjs --co` cảnh báo `[gan-moc-dang-chay]` khi đợt mới gắn hàng vào một mốc phát hành chưa qua
  ngày mà đã có hàng của đợt khác. Chữ «chân trời» trong thông báo đổi thành «chờ điều kiện» (khoá `chan_troi` không
  đổi) — byte trang lộ trình đổi CHỈ ở kho có cờ khuôn `chan_troi` sai dạng.
- **Gói thứ năm `road-map`** (vỏ lệnh, mã ở lõi): cài theo kho, phạm vi project — lệnh cài ở `road-map/README.md`;
  lệnh chỉ đọc `/road-map:xem`. `acceptance-init` không tự bật; gói không có hook. P200 khoá số của nó cùng ba gói kia.
- **Giới hạn đã khai:** tám mục ở Notes hợp đồng — đáng nhớ nhất: tệp lộ trình chưa từng commit trong kho git thì luật
  tuổi không chạy mà không có dòng cảnh báo (Ngoài-3); một mốc chứa mã gõ sai có thể sinh cảnh báo thừa «đổi đích chiến
  dịch giữa chừng» khi cắt lượt (Ngoài-19).
- **Ai bị ảnh hưởng:** kho không khai lộ trình hay khai mà 0 đề xuất — không thấy gì khác. Kho có đề xuất — thêm khối
  rà soát trên thẻ khởi động. Đo 14/10 (không chính sách): crm `d0351bcd` — đúng ba đề xuất `DA6`, `DA7`, `DA8` → chờ
  điều kiện (Việc và Dự án); kit — `A3`, `DP8` → dời mốc. **Khi update:** kho khai `tin_hieu` chép lại
  `scripts/cat-luot.mjs`; cài `road-map` nếu muốn lệnh `/road-map:xem`.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI:** chép lại từ thẻ `v2.31.0` ba tệp. Luôn cần: `lib/out-of-contract.cjs` (BN1 — đọc dòng `Căn cứ:`;
  bộ đọc cũ vẫn đọc tệp khuôn mới không lệch, nên chép lệch nhịp không vỡ CI). Kho khai `lo_trinh`:
  `scripts/lo-trinh.mjs` (MC1 + RM1). Kho khai `tin_hieu`: `scripts/cat-luot.mjs` (RM1). Không phụ thuộc mới — hai mươi
  ba tệp còn lại không đổi byte so với `v2.30.0`.
- **Máy dev: cài `acceptance-gate`, `feature-loop` (và `dieu-phoi`, `road-map` nếu kho dùng) theo ĐÚNG THẺ ở MỌI phạm
  vi**, rồi kiểm `node <gốc gói acceptance-gate>/scripts/kiem-ban-cai.mjs --may --ref v2.31.0 --root <bản clone kit
  đã git fetch --tags>`. Sống là `TỔNG KẾT: ĐẠT …` VÀ không còn dòng `VÀNG may:` nào của các gói đã cài (đính chính
  2.30.0: TỔNG KẾT một mình không đủ vì `diagram-design` giữ số).
- **Kho có lộ trình:** vẽ lại `LO-TRINH.html` một lần trong PR nâng kit (`node scripts/product-map.mjs --root .`) —
  trang có thêm cờ MC1; kho có cờ khuôn `chan_troi` sai dạng đổi thêm chữ «chờ điều kiện».

**Người cắt mốc kit:** sau khi gắn thẻ chạy `node scripts/kiem-ban-cai.mjs --ref v2.31.0` (KC1) — dòng TỔNG KẾT ghi
vào hồ sơ `release-2-31-0`.

**Chiến dịch ghim lại — một hồ sơ để cũ hoá theo cấu tạo:** lưới trước-gộp `--stale-all` so mốc `7cf78c36` chọn tám hồ
sơ. Làn `repin-20261015T083739Z-10776` xanh cho bảy trên máy M5 (72,7 phút, 26 lệnh, 0 chập chờn; `CRM_ROOT` trỏ bản
clone crm của máy để răng đọc crm ở sha ghim của MC1/RM1 chạy được): `bang-ngoai-n-co-can-cu`, `khoi-viec-cua-anh`,
`moc-la-chien-dich`, `nen-khong-tinh-tep-cua-vong`, `ra-co-ten-lam-va-trao`, `ra-soat-lo-trinh`, `s4-scope-triage`. Làn
trước `repin-20261015T070702Z-99542` (84,1 phút) đỏ đúng một ca PD7b — chính ghi chú này từng viết lệnh cài gói và chữ
«tuỳ chọn» cạnh tên gói; đã sửa chữ. `release-2-30-0` để cũ hoá theo cấu tạo (E4/E8 đo `6a9c0f9a..HEAD`); `release-2-31-0`
sẽ cùng hình dạng ở mốc sau.

**crm, theo thứ tự** (nhận SAU 2.30.0 — crm PR #413; ghi chú nhận của các mốc trước vẫn áp):

1. **Khi nào, ở đâu:** máy Mac Studio, sau khi #413 (2.30.0) đã gộp và đo lại đường nền, ở quãng lặng: không lượt S4
   nào đang chạy, không vòng nào giữa hai cổng. #413 chưa gộp khi tới lượt 2.31 → làm trọn các bước 2.30.0 trước rồi
   nâng tiếp — không bỏ bước nào của 2.30.0 (bốn tệp DP11 chép CÙNG LÚC, `zalo-qua-webhook` định tuyến lại).
2. **Cài theo thẻ `v2.31.0`:** gỡ rồi cài lại `acceptance-gate`, `feature-loop`, `dieu-phoi` ở mọi bản ghi (phạm vi
   `user`, gốc crm, từng cây phụ có phiên). Kiểm bằng `kiem-ban-cai.mjs --may --ref v2.31.0` — ĐẠT và không còn dòng
   `VÀNG may:` của ba gói. Không cài từ `main` giữa hai thẻ. Mở phiên MỚI sau khi cài.
3. **Lớp chép CI từ thẻ** (`git archive v2.31.0`) — crm khai cả `lo_trinh` lẫn `tin_hieu`: chép lại ba tệp
   `lib/out-of-contract.cjs`, `scripts/lo-trinh.mjs`, `scripts/cat-luot.mjs`. Đo lại bằng đường nền sau khi chép.
4. **Vẽ lại `LO-TRINH.html`** trong PR nâng kit. Cờ mới (MC1) là vàng: đo ở `1997da85`, OKR thêm F8, F23, F24, F26
   «chưa thuộc mốc» và mười hồ sơ đang mở không thuộc việc nào; Việc và Dự án thêm DA0c. Gắn hàng vào mốc hay gắn hồ
   sơ vào hàng khi tiện — không chặn.
5. **Gói `road-map` — cài khi muốn lệnh `/road-map:xem`:** cài theo kho, phạm vi project ở gốc crm, lệnh cài ở
   `road-map/README.md`; khối rà soát trên thẻ khởi động có sẵn trong lõi, không cần gói. Đo ở `d0351bcd`: `DA6`, `DA7`,
   `DA8` → chờ điều kiện. Máy không áp đề xuất nào — người sửa tệp lộ trình nếu đồng ý.
6. **Đường nền (NV1) và thẻ Cổng Bằng chứng (BN1):** không bước tay. Hồ sơ chấm trước 2.31 mang cờ vàng «chưa có căn
   cứ» trên thẻ Cổng Bằng chứng tới lượt chấm kế.
7. **Đo trước → sau** (tiền lệ `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`): trên cùng một cây, lưới
   trước-merge và thẻ của các hồ sơ đang mở dưới 2.30.0 rồi 2.31.0 — phán quyết từng hồ sơ phải bằng nhau. Chỗ mốc hứa
   đổi đều là TRÌNH BÀY: bảng Ngoài-n có cột căn cứ (BN1), mục «Dòng vàng» của đường nền (NV1), cờ vàng lộ trình (MC1),
   khối rà soát trên thẻ khởi động (RM1). Phán quyết khác ở bất kỳ đâu là tín hiệu.
8. **Đọc ngưỡng ở vòng crm đầu tiên sau khi nhận:** phiên mở từ hàng thuộc mốc nằm trong nhóm thanh bên có tên bằng
   `nhom` (MC1) · lần mở thẻ đầu sau một mốc `phat-hanh` khép: mọi hàng chưa giao, chưa có hồ sơ đang mở của mốc ấy
   hiện đề xuất (RM1) · thẻ Cổng Bằng chứng của lượt chấm đầu có cột căn cứ đủ mọi mục (BN1) · 0 lần đường nền đỏ vì
   tệp S1 của chính vòng (NV1).

**Đường đo của các vòng, đọc ở mốc này:** MC1 hẹn đọc ở «hồ sơ mốc kế» tỉ lệ phiên mở từ hàng thuộc mốc nằm trong nhóm
thanh bên có tên bằng `nhom`; RM1 hẹn đọc ở mốc kit 05/11. Cả hai CHƯA đọc ở mốc này: MC1 gộp 14/10 15:54Z, chưa tới một ngày trước khi cắt — số phiên chưa đủ để đọc tỉ lệ; đếm ở
mốc kế, cùng với ngưỡng của RM1.

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng của từng vòng — đủ ở bốn hợp đồng): `bang-ngoai-n-co-can-cu` 10 (9 mục
Ngoài-n + 1 trong hợp đồng) · `nen-khong-tinh-tep-cua-vong` 7 · `moc-la-chien-dich` 7 (+ một cạnh mù) · `ra-soat-lo-trinh`
8. `docs/research/known-limits-ledger.tsv` có hàng cho cả bốn — mười hàng của `bang-ngoai-n-co-can-cu` thêm ở PR mốc
(vòng ký mà không ghi sổ; P179 vẫn xanh vì sổ chỉ cần ≥ corpus). Hạt giống mới của cửa sổ:
`2026-10-14-hat-giong-co-ho-so-ngoai-ke-hoach-gon` (MC1 Ngoài-3/4/5) · `2026-10-14-hat-giong-khuon-giu-co-bi-can-cu-danh-do`
(MC1) · `2026-10-14-hat-giong-nen-tren-worktree-head` (lối A2 của NV1) · `2026-10-14-hat-giong-rt13-so-ban-cu-voi-ho-so-sau-moc`
(chữ ký NV1) · `2026-10-14-hat-giong-hien-trang-sau-doi-tai-khoan` (#350) ·
`2026-10-14-hat-giong-kiem-ban-cai-may-dat-nho-goi-khong-doi-so` (đính chính 2.30.0). Hai lỗ kit chỉ nằm trong sổ của
RM1, chưa có hạt giống: RT13 mong manh với hồ sơ đang `verified` (`d-20261014T165456Z-38`) · thẻ Cổng Bằng chứng hỏi
lại cả mục đã sửa (`d-20261015T001524Z-61`).

**Năm dòng số của luật (c)** — bốn vòng có lượt chấm trong cửa sổ (giờ VN; nguồn: giờ commit `contract.md`,
`usage-report.md`, `decisions.jsonl`, `run-log.jsonl` của hồ sơ; dòng 1 tính từ commit đặt `implemented` đầu tiên tới
commit chữ ký Cổng Bằng chứng; ba khối token theo khuôn 2.25: chứng-minh-vật = machine+ui+judge+baseline · tìm-lỗi =
review+refute · tổng hợp = triage+capture+synthesize; Cổng Đáng không tính, theo khuôn 2.26):

| Hồ sơ | 1 · làm-xong→quyết-được · lượt chấm | 2 · gọi người trong / ngoài (trần) | 3 · lượt bị hạ tầng đốt | 4 · out-token S4 · vật / tìm-lỗi / tổng hợp % | 5 · phút máy / lượt |
|---|---|---|---|---|---|
| `bang-ngoai-n-co-can-cu` (BN1, T3, máy M5) | 5 g 20 · 2 (lượt 1 REJECT thật — BN-4 + bốn ca ghim bố cục thẻ cũ) | 2 / 0 (4) — Gate 1.5 không có dòng duyệt trong sổ; có thì 3 / 0 | 0 | 91 299 · 45,9 / 22,6 / 31,5 | 52 · 51 = 103 |
| `nen-khong-tinh-tep-cua-vong` (NV1, T2, máy M5) | 1 g 58 · 1 | 1 / 0 (3) | 0 | 47 411 · 46,8 / 18,1 / 35,1 | 55 |
| `moc-la-chien-dich` (MC1, T2, máy MacBook Pro) | 3 g 44 · 3 | 2 / 1 (3) — ngoài thiết kế: chủ kho nâng phạm vi Ngoài-6 ở Cổng Bằng chứng lượt 2 | 0 (+1 ca biên: RT13/RT18 đỏ vì tệp ca mới của vòng, cùng lượt có REJECT thật) | 103 735 · 43,5 / 16,1 / 40,3 | 36 · 36 · 36 = 108 |
| `ra-soat-lo-trinh` (RM1, T2, máy MacBook Pro) | 9 g 32 · 3 (lượt 2 xong 01:04 15/10, chủ kho trả lại 06:27 — chờ người qua đêm 5 g 23) | 2 / 1 (3) — ngoài thiết kế: chủ kho trả lại, nâng phạm vi ở Cổng Bằng chứng lượt 2 | 0 (+1 ca biên: làn ghim lại sau gộp main đỏ RT13/P179, cùng lúc thước của vòng sai thật) | 109 104 · 39,5 / 22,6 / 37,9 | 37 · 36 · 37 = 110 |

Cộng bốn vòng: **9 lượt chấm** (trung vị làm-xong→quyết-được 4 g 32) · **351 549 out-token** (chứng-minh-vật 43,4 % ·
tìm-lỗi 20,1 % · tổng hợp 36,6 %) · **≈ 376 phút máy** · **9 lượt gọi người — 7 theo thiết kế, 2 ngoài thiết kế**
(MC1, RM1), **0 vòng vượt trần** theo khuôn 2.26 · hạ tầng đốt **0 lượt chấm** (2 ca biên). Phiên chính không đo token.
Số chạm: sổ không ghi trường riêng; ba lượt có ghi đều là một câu hoặc một dòng lệnh gộp.

**Đọc số:**

- **Hai lượt gọi ngoài thiết kế cùng một hình dạng:** MC1 và RM1, mỗi vòng ba lượt chấm, và lượt ngoài thiết kế của cả
  hai là chủ kho NÂNG phạm vi ở Cổng Bằng chứng lượt 2 — giống S3c/KC1 của 2.29. Hai vòng chiếm 6/9 lượt chấm và 60,5 %
  token. Dòng 1 của RM1 phình vì chờ người qua đêm, không vì chấm.
- **Đếm RM1 lệch giữa hai nguồn:** dòng sổ `d-20261014T232755Z-58` tự khai «lượt gọi người thành 4, vượt trần T2 3»;
  đếm theo khuôn 2.26 (Cổng Đáng gộp Phạm vi không tính riêng, lượt «duyệt lại phạm vi» máy ghi như trạm thu phí không có
  `decided_by`) ra 3. Mốc in số theo khuôn; lượt trả lại vẫn là một lượt ngoài thiết kế.
- **Tìm-lỗi 20,1 % token, mốc thứ ba liên tiếp tăng** (2.29: 15,9 % · 2.30: 18,5 %), kéo bởi BN1 lượt 1 (T3) và RM1
  lượt 3. Phút máy mỗi lượt tách theo máy: M5 51–55 phút, MacBook Pro 36–37 phút — nguyên nhân chưa đo.
- **A1:** 0 dòng `loai-tac-tu-vang` trên cả 9 lượt — lần đầu máy MacBook Pro không có dòng nào (2.30: 1).

**Điều kiện tin cậy:** (i) đường verdict (finder → refute trong hợp đồng → REJECT) không đổi THÀNH PHẦN, nhưng diff
KHÔNG rỗng như 2.30: `git diff v2.30.0 <cây mốc> -- feature-loop/workflows/ feature-loop/agents/` cho
`acceptance-verify.js` +16/−7, một commit của BN1 (`226c4410`) — bước phân loại phạm vi nay phải xuất thêm trường bắt
buộc `can_cu`, khuôn mục ngoài hợp đồng thêm dòng `Căn cứ:`; không thêm hay bớt tác tử, luật `inContract` và luật
REJECT giữ nguyên. Không phép đo nào kiểm phân loại trong/ngoài hợp đồng có đổi theo. Cửa sổ trộn hai bản workflow:
BN1 và NV1 (3 lượt) chạy bản mới, MC1 và RM1 (6 lượt) chạy bản sao 2.30.0. (ii) Lượt chấm sai do phép-đo-tự-dối giữa
hai mốc: **0** phán quyết tới người ký sai; ngưỡng (a) đếm **0/2**. Dòng 4–5 cắt được, 4/4 vòng có số, kèm lưu ý (i).

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | = | không mục nào chạm đoạn từ `implemented` tới chữ ký |
| 2 | ↓ ngoài thiết kế | người ký đọc căn cứ từng mục Ngoài-n trên thẻ thay vì hỏi lại (BN1); chủ kho thấy hàng cần dời mốc trên thẻ khởi động thay vì hỏi hiện trạng (RM1) — cạnh *mù*, reality đọc |
| 3 | = | đường nền không phải lượt chấm; NV1 bớt lần chạy lại nền ở S1, không chạm lượt chấm |
| 4 | ↑ nhẹ ở khối tổng hợp | bước phân loại viết thêm một câu căn cứ cho mỗi mục ngoài hợp đồng (BN1) |
| 5 | = / lượt | thành phần lượt không đổi |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .` (15/10,
đọc trên cây mốc). **N không tăng so với mốc 2.30.0 (vẫn 1) — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.30.0 — 14/10/2026

Cửa sổ 2.29.0 → 2.30.0 nằm trong **một đêm** (13/10 chiều → 14/10 sáng), có **bốn hồ sơ được ký** — tập đối chiếu
bằng `scripts/rel-cua-so.sh` (AC-4 của hồ sơ mốc): khoá do dãy giữ tính nhịp khoá (DP10, gói `dieu-phoi`), bộ đọc hồ sơ
khoan dung (R2, máy MacBook Pro), định tuyến mục Ngoài-n theo mã mục (DP11, T3) và `tac-tu-cham-chi-cham-khong` (A1
của 2.27.0, máy-thông 10/10 — chủ kho ký Cổng Bằng chứng trong PR của DP11 vì DP11 đổi định tuyến của nó). Cả ba vòng
mới đều có gốc ở crm-onehub#375. Kho chờ nhận: `crm` — máy Mac Studio nhận THẲNG từ bản đang cài (2.28.0), bỏ qua
2.29.0. Mốc đi **làn V**, không dựng răng mới. Ba gói `acceptance-gate`, `feature-loop`, `dieu-phoi` cùng lên
`2.30.0`; `diagram-design` giữ `2.7.1`. Tag `v2.30.0` gắn vào commit gộp PR mốc.

**Vì sao 2.30.0, không 2.29.1** (lời đã báo crm là «2.29.1»; điều phối M5 đồng ý đổi 14/10 và báo lại crm#375): mốc
thêm bề mặt mới cho kho tiêu thụ — lệnh tuỳ chọn `scripts/yaml-chuan.cjs` và một loại cờ vàng mới trên thẻ hai cổng
(R2), khuôn dòng sổ người mới mang `tieu_de` + `tep` và một luật lưới CHẶT hơn: hồ sơ qua lưới ở 2.29.0 có thể bị chặn
ở 2.30.0 (DP11 — crm `zalo-qua-webhook` là một). GUIDE: «minor cho luật gate mới». Nội dung không đổi so với lời hứa:
DP10 + R2 + DP11.

**Lớp chép CI giữ 26 tệp, không thêm:** đổi bảy tệp so với `v2.29.0` — kể ở mục «Kho tiêu thụ làm gì khi nhận».
Mười chín tệp còn lại giống từng byte `v2.29.0` (AC-8 đo trên cây mốc, danh sách mong đợi đọc TỪ chính gạch ghi chú).
`scripts/yaml-chuan.cjs` KHÔNG vào danh sách — kho muốn chặn trong CI thì tự chép. Diff engine của cửa sổ còn ở:
`scripts/gate-card.js`, `scripts/start-scan.mjs`, `scripts/dinh-tuyen-may.cjs`, `commands/signoff.md` (khối
`NGOAI-N-GATE2-LINE`), `commands/acceptance-card.md`, `skills/acceptance/references/eval-executors.md` (mục «Standard
YAML»), `dieu-phoi/scripts/phat-lich.mjs` và `dieu-phoi/README.md`. `feature-loop/` không đổi một byte.

### Mục Ngoài-n định tuyến theo mã mục, không theo số (hồ sơ `dinh-tuyen-theo-ma-muc`, hàng DP11, T3)

Gốc: crm-onehub#375, bình luận 13/10 09:39Z — đo ở crm `them-buoc-bao-dung`: sau chữ ký, một lượt chấm S4 chèn mục mới
lên đầu `review-findings.md`, tám dòng sổ ký theo SỐ trỏ nhầm mục, và lệnh máy tự đóng làn V chỉ báo `Ngoài-9`. Đo 8
kho: 0/2 235 dòng sổ người mang tiêu đề mục; hai hồ sơ máy-thông đứng trên định tuyến lệch (kit
`tac-tu-cham-chi-cham-khong`, crm `zalo-qua-webhook`).

- **Mã mục** = tiêu đề của mục đã gỡ nhãn lượt `(rN…)` + tệp của mục. Bộ phân giải mới trong `lib/out-of-contract.cjs`
  gán dòng sổ → mục theo mã; mục đổi số vì mục mới chèn đầu vẫn khớp dòng cũ của nó, mục TƯƠI trùng mã với mục đã quyết
  thì không thừa kế quyết định.
- **Dòng sổ người từ nay mang mã:** khuôn `NGOAI-N-GATE2-LINE` của `/acceptance-gate:signoff` ghi thêm `tieu_de` và `tep`.
- **Đường đọc cũ:** dòng chỉ có số mà ghi SAU lượt chấm cuối — tin như trước. Dòng chỉ có số mà `run-log.jsonl` có một
  lượt chấm (`round-tally`) MỚI hơn — coi là **chưa định tuyến**, kèm cờ vàng trên thẻ Cổng Bằng chứng nêu nhãn các mục
  và giờ lượt chấm; mọi mục ấy thành ô hỏi. Không ghi lại (migrate) sổ của kho nào.
- **Một luật, bốn bên đọc:** lưới trước-gộp, `khong-can-nguoi.mjs`, bộ quét đầu phiên và `product-map.mjs` đều truyền
  `run-log.jsonl` vào cùng bộ phân giải; ngữ cảnh `xanhSach` nay BẮT BUỘC khoá `runLog` — bên gọi quên truyền thì lỗi
  có tên, không lặng lẽ mù. Lưới áp luật CHẶT (chủ kho chọn ở Cổng Phạm vi 13/10): hồ sơ máy-thông có dòng cũ →
  VIOLATION «chưa người định tuyến».
- **Máy định tuyến** (`dinh-tuyen-may.cjs`, kho bật `feature_loop.ngoai_n_tu_dinh_tuyen`) khớp dòng máy theo mã; sổ có
  dòng người chỉ số đã cũ thì thoát 2 với dòng `dinh-tuyen-may:` nêu «ghi trước lượt chấm», không ghi byte nào.
- **Hệ quả trên kit:** `tac-tu-cham-chi-cham-khong` được chủ kho định tuyến bảy mục và ký trong PR #345; `rang.sh` của
  hồ sơ ấy kiểm cú pháp tệp workflow như bộ chạy bọc (Node 24.21 từ chối `node --check` trên lệnh `return` cấp đầu).
- **Giới hạn đã khai:** năm mục ở Notes hợp đồng — bốn ca kiểm yếu (DM1 chiều đỏ nhận mọi lỗi · DM1 chỉ loại trừ
  Ngoài-2 · DM4 nhận mọi lý do chặn · DM7 đếm nhãn trên cả dòng cờ) và ca DM9 «lưới trên cây kit» xanh mà chưa chạm
  khối định tuyến. Hạt giống `2026-10-14-hat-giong-dong-may-mo-coi-vinh-vien` (dòng máy mồ côi thành «lệch» vĩnh viễn —
  hồi quy so với A3, chỉ chạm kho bật `ngoai_n_tu_dinh_tuyen`).
- **Ai bị ảnh hưởng:** mọi kho — hồ sơ chưa ký mà sổ gate2 chỉ ghi số rồi có lượt chấm sau đó sẽ hiện cờ vàng và các mục
  thành ô hỏi; hồ sơ máy-thông như thế bị lưới chặn. **Khi update:** chép bốn tệp DP11 đổi CÙNG LÚC (mục «Kho tiêu thụ
  làm gì khi nhận»), rồi định tuyến lại từng hồ sơ lưới chặn bằng `/acceptance-gate:signoff` — dòng mới mang mã.

### Bộ đọc hồ sơ khoan dung (hồ sơ `bo-doc-ho-so-khoan-dung`, hàng R2, T2 — máy MacBook Pro)

Gốc: crm-onehub#375 (Mac Studio, 13/10) và hạt giống ngày ký của vòng câu tín hiệu. Kit đọc hồ sơ thật của kho tiêu
thụ nay **không im lặng** ở hai chỗ:

- **`evals.yaml` không phải YAML chuẩn → cờ vàng có tên.** Kit vẫn đọc theo dòng như trước — không chặn, không đổi
  phán quyết nào. Thẻ Cổng Phạm vi và thẻ Cổng Bằng chứng nêu từng dòng và dạng lỗi (sáu dạng, bảng cách sửa ở
  `skills/acceptance/references/eval-executors.md` mục «Standard YAML»). Đo 13/10 ở sha ghim: 10/678 tệp của bảy kho —
  crm 5, radar 2, kit 1 (`release-2-0-0`, đã ký, không sửa), artifact-platform 1, media-library 1; oneflow, map 0.
  Muốn **chặn trong CI**: chép `scripts/yaml-chuan.cjs` và thêm bước `node scripts/yaml-chuan.cjs --root . --base
  origin/<nhánh chính>` — `--base` chỉ xét hồ sơ có tệp đổi từ điểm rẽ, nên hồ sơ cũ đã ký không chặn ai và **không
  phải sửa**. Muốn biết hồ sơ nào của kho đang mang cờ: chạy lệnh ấy không kèm `--base`.
- **Chữ ký ghi ngày kiểu ngày/tháng/năm được đọc ra ngày.** Một bộ đọc chung cho bốn mặt — câu cho người gửi và
  `tin-hieu.mjs --cau`, bảng điều khiển mở phiên, dải tóm tắt hồ sơ, nhịp của bản cắt lượt. Chữ ký có năm-tháng-ngày
  đọc ra y hệt trước (654/655 chữ ký khác rỗng của bảy kho); chữ ký chỉ có ngày/tháng/năm (crm `nen-chat-ai-elements`
  «10/09/2026») nay ra 10/9/2026 thay vì mất ngày và làm `--cau` đỏ. Đọc theo lối Việt, ngày trước tháng.

- **Giới hạn đã khai:** bảy mục ở Notes hợp đồng — đáng nhớ nhất: lệnh kiểm gọi `--base` với biến rỗng thì lặng lẽ kiểm
  cả hồ sơ cũ (một bước CI `--base $BASE_REF` mà biến trống sẽ đỏ vì hồ sơ đã ký); `--base` báo sạch sai khi thư mục
  hồ sơ nằm trong thư mục con của kho git; lỗi đọc tệp hay lỗi git thoát 1 thay vì 2; bộ đọc ngày chung cũng đọc
  ngày/tháng/năm ở các trường ngày khác của dải tóm tắt.
- **Ai bị ảnh hưởng:** kho không có hai sự cố trên — phán quyết không đổi, cờ không hiện. crm — năm hồ sơ mang cờ vàng
  (mục «crm, theo thứ tự»); sửa khi tiện, hoặc bật lệnh kiểm trong CI cho hồ sơ mới. Lưới trước-gộp (`pre-merge-check.sh`)
  và `lib/` không đổi ở vòng này. **Khi update:** bộ đọc ngày chung sống trong `scripts/ho-so-tom-tat.cjs` mà
  `tin-hieu.mjs` và `cat-luot.mjs` nạp — kho khai `lo_trinh` hay `tin_hieu` chép lại cả ba (mục «Kho tiêu thụ làm gì khi
  nhận»).

### Khoá do một dãy giữ cũng tính nhịp khoá (hồ sơ `dieu-phoi-khoa-day-giu-nhip`, hàng DP10, T2, gói `dieu-phoi`)

Gốc: crm-onehub#375, bình luận Mac Studio 13/10 08:16Z (đợt `r2` trên crm): phiên giám sát nhả nhầm khoá `duong-nen`
của dãy P1 khi lượt đang chạy, vì bộ phát lịch báo `khoa-khong-nhip` cho một khoá mà dãy giữ nhịp bằng `giu-nhip.mjs`
— đúng như `LUAT.md` dặn. Lỗi có từ DP8 (2.28.0, `dieu-phoi-on-dinh-r2` AC-9 ghim chính hành vi sai).

- **Đổi gì:** `viecNenGiuNhip` (`dieu-phoi/scripts/phat-lich.mjs`) thôi loại khoá của DÃY khỏi nhịp khoá
  (`khoa/<tài nguyên>/nhip`). Dãy chờ một lượt dài (đường nền, S4, ghim lại) chạy qua `giu-nhip.mjs` thì không bị báo
  dù phiên không gọi công cụ nào; khoá của dãy không có nhịp phiên lẫn nhịp khoá từ lúc cấp vẫn bị báo. Chỉ worktree
  đang giữ khoá chạm được nhịp khoá của nó. README gói nói lại đúng hành vi.
- Hồ sơ cũ `dieu-phoi-on-dinh-r2` không sửa (sổ chỉ thêm); hàng lời hứa của nó đổi thân có tên ở AC-6 của DP10.
- **Giới hạn đã khai:** ca tài liệu chỉ dò cụm chữ của câu cũ — README viết ngược hành vi bằng chữ khác vẫn qua; hành vi
  thật do ma trận khoá đo.
- **Ai bị ảnh hưởng:** kho cài gói `dieu-phoi` (crm). **Khi update:** cài lại gói theo thẻ — không tệp nào phải chép.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI:** chép lại từ thẻ `v2.30.0` bảy tệp. Luôn cần, và chép CÙNG LÚC (DP11): `lib/out-of-contract.cjs`,
  `scripts/pre-merge-check.sh`, `scripts/khong-can-nguoi.mjs`, `scripts/product-map.mjs` — chép lệch bộ thì
  `khong-can-nguoi.mjs` mới báo lỗi «thiếu ngữ cảnh { findings, ledger, runLog }» khi bản đồ cũ gọi nó, hay lưới mới gọi
  `cumCu` mà lib cũ không có (lưới đóng thay vì mở). Kho khai `lo_trinh` hoặc `tin_hieu`: `scripts/ho-so-tom-tat.cjs`
  (R2). Chỉ khi kho khai `tin_hieu`: `scripts/tin-hieu.mjs` và `scripts/cat-luot.mjs` (R2). Mười chín tệp còn lại không
  đổi byte so với `v2.29.0`.
- **Lỗ đã biết của danh sách chép (có từ 2.29.0):** thẻ máy-đọc của `ho-so-tom-tat.cjs` chỉ nói «khi khai `lo_trinh`»,
  nhưng `tin-hieu.mjs` (từ 2.29.0) và `cat-luot.mjs` (từ 2.30.0) nạp tệp ấy lúc tải — kho khai `tin_hieu` mà không khai
  `lo_trinh` vẫn phải chép nó, và đường nền sẽ không nhắc. Đo 14/10: 0 kho trúng (crm khai cả hai). Hạt giống
  `2026-10-14-hat-giong-ho-so-tom-tat-can-ca-khi-khai-tin-hieu`.
- **Máy dev: cài `acceptance-gate`, `feature-loop` (và `dieu-phoi` nếu kho dùng) theo ĐÚNG THẺ ở MỌI phạm vi**, rồi
  kiểm `node <gốc gói acceptance-gate>/scripts/kiem-ban-cai.mjs --may --ref v2.30.0 --root <bản clone kit đã git fetch
  --tags>`. Sống là dòng `[kiem-ban-cai] TỔNG KẾT: ĐẠT <n> bản ghi khớp v2.30.0`, không còn dòng `ĐỎ may:` hay `VÀNG
  may:` nào của ba gói. **Đính chính sau thẻ (14/10):** dòng TỔNG KẾT một mình KHÔNG đủ — `--may` chỉ ra ĐỎ khi
  không bản ghi nào mang số của thẻ, mà `diagram-design` giữ `2.7.1`, nên máy chưa nâng `acceptance-gate`,
  `feature-loop`, `dieu-phoi` vẫn in `TỔNG KẾT: ĐẠT` kèm các dòng VÀNG (đo trên máy M5 sau thẻ: «ĐẠT 26 bản ghi khớp
  · 81 khác số»). Đọc các dòng `VÀNG may:`. Hạt giống `2026-10-14-hat-giong-kiem-ban-cai-may-dat-nho-goi-khong-doi-so`.
- **Kho có hồ sơ lưới chặn vì DP11** («chưa người định tuyến … dòng sổ theo số ghi trước lượt chấm»): người định tuyến
  lại các mục bằng `/acceptance-gate:signoff`; dòng mới mang `tieu_de` + `tep`.
- **Kho muốn chặn `evals.yaml` không chuẩn trong CI** (tuỳ chọn, R2): chép `scripts/yaml-chuan.cjs` và thêm bước `node
  scripts/yaml-chuan.cjs --root . --base origin/<nhánh chính>`; biến của `--base` không được rỗng (giới hạn đã khai).
- **Kho có lộ trình:** vẽ lại `LO-TRINH.html` một lần trong PR nâng kit (`node scripts/product-map.mjs --root .`).

**Người cắt mốc kit:** sau khi gắn thẻ chạy `node scripts/kiem-ban-cai.mjs --ref v2.30.0` (KC1) — dòng TỔNG KẾT ghi
vào hồ sơ `release-2-30-0`.

**Chiến dịch ghim lại — một hồ sơ để cũ hoá vì MÔI TRƯỜNG, một hồ sơ để cũ hoá theo cấu tạo:** lưới trước-gộp
`--stale-all` so mốc `6a9c0f9a` chọn sáu hồ sơ. Làn `repin-20261014T011922Z-24656` xanh cho bốn trên máy M5 (61,1 phút,
21 lệnh, 0 chập chờn): `dieu-phoi-khoa-day-giu-nhip`, `dinh-tuyen-theo-ma-muc`, `ra-co-ten-lam-va-trao`,
`tac-tu-cham-chi-cham-khong`. Hai hồ sơ không ghim, không phải lỗi của mốc:

- `bo-doc-ho-so-khoan-dung` — *không đọc được ở đây*: làn trước `repin-20261014T001214Z-64143` (66,4 phút) xanh 11/11
  suite nhưng E2/E7 thoát 2 vì răng bảy kho (`rang/bay-kho.mjs`) cần bản sao sáu kho tiêu thụ ở `$HOME/dev/<kho>` hay
  biến `KHO_<TÊN>` — máy M5 không có `radar`, crm nằm ở `$HOME/dev/crm-onehub`. Máy MacBook Pro (đủ bảy kho) ghim được.
  PR mốc không chạm hồ sơ này nên lưới trước-gộp không chặn.
- `release-2-29-0` — E4/E8 của nó đo `72eb55f3..HEAD`, nên mọi mốc sau làm nó đỏ theo cấu tạo; nó vào tập chỉ vì dòng
  `kiem-ban-cai-sau-tag.txt` ghi vào hồ sơ sau thẻ (#341). `release-2-30-0` sẽ cùng hình dạng ở mốc sau.

**crm, theo thứ tự** (crm nhận THẲNG từ 2.28.0, bỏ qua 2.29.0 — các bước dưới đã gộp phần nhận của 2.29.0; ghi chú
nhận của các mốc trước nữa vẫn áp):

1. **Khi nào, ở đâu:** máy Mac Studio — máy duy nhất cài kit vào crm — ở **quãng lặng của đợt `r2`**: không lượt S4 nào
   đang chạy, không vòng nào giữa hai cổng. Không đổi engine dưới chân một vòng đang chạy.
2. **Cài theo thẻ `v2.30.0`:** gỡ rồi cài lại `acceptance-gate`, `feature-loop`, `dieu-phoi` ở mọi bản ghi (phạm vi
   `user`, gốc crm, từng cây phụ có phiên). Kiểm bằng `kiem-ban-cai.mjs --may --ref v2.30.0` — sống là `TỔNG KẾT: ĐẠT …
   khớp v2.30.0` VÀ không còn dòng `VÀNG may:` nào của `acceptance-gate`, `feature-loop`, `dieu-phoi` (TỔNG KẾT một
   mình không đủ — đính chính sau thẻ ở mục trên). Không cài từ `main` giữa hai thẻ. Mở phiên MỚI sau khi cài.
3. **Lớp chép CI từ thẻ** (`git archive v2.30.0`) — đo 14/10 trên `onehub` 60fc1b02d, crm khai cả `tin_hieu` lẫn
   `lo_trinh`: mười bảy tệp đã khớp (kể cả ba tệp `dieu-phoi/scripts/` chép ở crm#374); chép lại tám — bốn tệp DP11
   cùng lúc (`lib/out-of-contract.cjs`, `scripts/pre-merge-check.sh`, `scripts/khong-can-nguoi.mjs`,
   `scripts/product-map.mjs`), `scripts/ho-so-tom-tat.cjs`, `scripts/tin-hieu.mjs`, `scripts/cat-luot.mjs` và
   `skills/acceptance/references/tin-hieu-template.md` (TH-cau của 2.29.0); thêm tệp MỚI `scripts/co-hop-dong.cjs` (S3c
   của 2.29.0 — thiếu thì `MODULE_NOT_FOUND` khi `tin-hieu.mjs` nạp `cat-luot.mjs`). Đo lại bằng đường nền sau khi chép.
4. **`zalo-qua-webhook` sẽ bị lưới chặn** (DP11 — chủ kho chọn luật CHẶT): đo 14/10, bộ phân giải mới thấy năm mục
   `Ngoài-1`…`Ngoài-5` chưa định tuyến vì tám dòng sổ theo số ghi trước lượt chấm 24/09 01:37Z (cùng sổ, lib 2.29.0: 0
   mục). Người định tuyến lại năm mục bằng `/acceptance-gate:signoff`, rồi lưới xanh lại. Hồ sơ khác cùng hình dạng hiện
   ra ở bước 9.
5. **Năm hồ sơ mang cờ vàng «evals.yaml không phải YAML chuẩn»** (R2; đo 14/10 ở 60fc1b02d, mười chỗ):
   `dieu-phoi-hai-tang` 1 · `no-sau-luot-5-okr` 3 · `zalo-gui-hong-ghi-ly-do` 3 · `danh-sach-keo-chung` 2 ·
   `bo-ca-mau-quy-4` 1. Không chặn, không đổi phán quyết — sửa khi tiện (bảng cách sửa ở `eval-executors.md` mục
   «Standard YAML»). Muốn chặn hồ sơ MỚI trong CI: chép `yaml-chuan.cjs` và chạy với `--base origin/onehub`.
6. **LT2 crm đọc câu cho người gửi bằng `b.cau_nguoi_gui ?? b.cau`** (TH-cau, 2.29.0) — trang vẽ bằng kit trước 2.29
   hiện câu cũ kèm cờ vàng «bản vẽ cũ»; vẽ lại `LO-TRINH.html` bằng 2.30.0 thì cờ hết. Chạy lại E14 của
   `gui-tin-hieu-trong-crm` sau khi vẽ lại.
7. **Luật sản phẩm** (BB1, 2.29.0, tuỳ chọn): chủ kho viết bản luật đầu (vd múi giờ đọc từ cấu hình) bằng commit riêng,
   thêm một dòng trỏ `PRODUCT-INVARIANTS.md` vào `CLAUDE.md` của crm.
8. **Hồ sơ nháp ≥ 13 tiêu chí đang mở** dừng ở lối vào Cổng Phạm vi tới khi tách hay ghi dòng giữ cỡ (S3c, 2.29.0).
   Gói `dieu-phoi` (DP10): không bước tay — giám sát thôi thấy `khoa-khong-nhip` oan cho dãy chạy lượt dài qua
   `giu-nhip.mjs`.
9. **Đo trước → sau** (tiền lệ `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`): trên cùng một cây, lưới
   trước-merge và thẻ của các hồ sơ đang mở dưới 2.28.0 rồi 2.30.0 — phán quyết từng hồ sơ phải bằng nhau, TRỪ chỗ hai
   mốc hứa đổi: cờ cỡ hợp đồng trên thẻ hồ sơ nháp (S3c), khối luật sản phẩm (chỉ sau khi có tệp luật), chân engine của
   đường nền thôi đỏ cho tệp có điều kiện (DP9), cờ vàng YAML (R2), và hồ sơ có dòng sổ chỉ số ghi trước lượt chấm —
   cờ vàng + ô hỏi, máy-thông thì VIOLATION (DP11). Khác ở chỗ nào khác là tín hiệu.
10. **Đọc ngưỡng ở vòng crm đầu tiên sau khi nhận:** `tin-hieu.mjs --cau` sau lượt gom thật đầu tiên ra 0 câu lọt
    (TH-cau); `luat-san-pham.cjs --root . --dem --tu <ngày khai>` — cột dòng nạp phủ mọi vòng mới (BB1); `cat-luot.mjs
    --co --tu <ngày cài>`, nhóm `phai-tach`, `n_chot − n_giu` = 0 (S3c); số dòng `"kind":"loai-tac-tu-vang"` trong
    run-log không tăng sau lượt chấm đầu (KC1, dấu A1 sống); dòng sổ gate2 mới đều mang `tieu_de` (DP11); 0 lần giám sát
    nhả khoá của dãy đang chạy qua `giu-nhip.mjs` (DP10).

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng của từng vòng — đủ ở bốn hợp đồng):
`bo-doc-ho-so-khoan-dung` 7 · `dinh-tuyen-theo-ma-muc` 5 · `dieu-phoi-khoa-day-giu-nhip` 1 · `tac-tu-cham-chi-cham-khong`
7 (định tuyến lại 13/10 trong PR #345). `docs/research/known-limits-ledger.tsv` có hàng cho cả bốn. Hạt giống mới:
`2026-10-14-hat-giong-dong-may-mo-coi-vinh-vien` (DP11 Ngoài-2) · `2026-10-14-hat-giong-ho-so-tom-tat-can-ca-khi-khai-tin-hieu`
(đo ở PR mốc). `#343` chỉ thêm hạt giống kênh liên máy cho phiên điều phối — tài liệu, không vào bản.

**Năm dòng số của luật (c)** — ba vòng có lượt chấm trong cửa sổ (giờ VN; nguồn: giờ commit `contract.md`,
`usage-report.md`, `decisions.jsonl`, `run-log.jsonl` của hồ sơ; dòng 1 tính từ commit đặt `implemented` tới commit chữ
ký Cổng Bằng chứng; ba khối token theo khuôn 2.25: chứng-minh-vật = machine+ui+judge+baseline · tìm-lỗi = review+refute
· tổng hợp = triage+capture+synthesize; Cổng Đáng không tính, theo khuôn 2.26). `tac-tu-cham-chi-cham-khong` không có
lượt chấm trong cửa sổ — chỉ một chữ ký, đếm ở dòng 2 của DP11:

| Hồ sơ | 1 · làm-xong→quyết-được · lượt chấm | 2 · gọi người trong / ngoài (trần) | 3 · lượt bị hạ tầng đốt | 4 · out-token S4 · vật / tìm-lỗi / tổng hợp % | 5 · phút máy / lượt |
|---|---|---|---|---|---|
| `dieu-phoi-khoa-day-giu-nhip` (DP10, máy M5) | 3 g 45 · 2 | 1 / 0 (3) | 0 | 53 761 · 50,5 / 13,1 / 36,4 | 50 · 48 = 98 |
| `bo-doc-ho-so-khoan-dung` (R2, máy MacBook Pro) | 1 g 11 · 1 | 1 / 0 (3) | 0 | 36 159 · 47,3 / 15,4 / 37,2 | 37 |
| `dinh-tuyen-theo-ma-muc` (DP11, T3, máy M5) | 9 g 27 · 2 (lượt 2 xong 22:38 13/10, ký 06:17 14/10 — chờ người qua đêm 7 g 39) | 2 / 0 (4) + chữ ký `tac-tu-cham-chi-cham-khong` (giá của Hỏi-1 «chặt») | 0 | 71 354 · 41,4 / 24,2 / 34,4 | 53 · 51 = 104 |

Cộng ba vòng: **5 lượt chấm** (trung vị làm-xong→quyết-được 3 g 45) · **161 274 out-token** (chứng-minh-vật 45,8 % ·
tìm-lỗi 18,5 % · tổng hợp 35,7 %) · **≈ 239 phút máy** · **4 lượt gọi người theo thiết kế + 1 chữ ký kèm**, 0 ngoài
thiết kế, **0 vòng vượt trần** · hạ tầng đốt **0 lượt chấm**. Phiên chính không đo token.

**Đọc số:**

- **Cửa sổ ngắn vì vòng nhỏ:** ba vòng là ba vá có gốc ở một kênh (crm#375); R2 qua trong một lượt, DP10 và DP11 mỗi
  vòng một lượt sửa thật. Dòng 1 của DP11 phình vì chờ chữ ký qua đêm, không vì chấm.
- **Tìm-lỗi 18,5 % token** (2.29: 15,9 %), kéo lên bởi lượt 1 của DP11 (T3, ba tác tử phản bác; khối tìm-lỗi chiếm 33 %
  token của lượt ấy).
- **A1 ở máy MacBook Pro vẫn chưa đọc được:** lượt chấm R2 có một dòng `loai-tac-tu-vang`; hai vòng máy M5 không có dòng
  nào. Lệnh `kiem-ban-cai.mjs --may` (2.29.0) là đường kiểm việc đó.

**Điều kiện tin cậy:** (i) đường verdict (finder → refute trong hợp đồng → REJECT) không đổi thành phần —
`git diff v2.29.0 <cây mốc> -- feature-loop/workflows/ feature-loop/agents/` rỗng. Không vòng nào đổi đầu vào lượt chấm.
(ii) Lượt chấm sai do phép-đo-tự-dối giữa hai mốc: **0** phán quyết tới người ký sai. Ngưỡng (a) đếm **0/2**. Dòng 4–5
cắt được, 3/3 vòng có lượt chấm có số.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | = | không mục nào chạm đoạn từ `implemented` tới chữ ký |
| 2 | ↑ một lần ở kho có sổ cũ, rồi = | dòng sổ chỉ số ghi trước lượt chấm thành ô hỏi (DP11) — hồ sơ máy-thông như crm `zalo-qua-webhook` cần một lượt người định tuyến lại; sổ mới mang mã nên lượt chấm sau chữ ký thôi làm lệch định tuyến |
| 3 | ↓ ở kho dùng `dieu-phoi` | giám sát thôi nhả nhầm khoá của dãy đang chạy lượt dài (DP10) |
| 4 | = / lượt | thành phần lượt không đổi |
| 5 | = / lượt | như trên |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .` (14/10,
đọc trên cây mốc). **N không tăng so với mốc 2.29.0 (vẫn 1) — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.29.0 — 13/10/2026

Cửa sổ 2.28.0 → 2.29.0 nằm trong **một ngày** (13/10; ba vòng của máy M5 và ba vòng của máy MacBook Pro chờ thẻ
`v2.28.0` rồi gộp liền nhau), có **sáu vòng được ký** — tập đối chiếu bằng `scripts/rel-cua-so.sh` (AC-4 của hồ sơ
mốc): cỡ vòng ở bước thiết kế (S3c), trạng thái đợt trong app (DP6b), luật sản phẩm của kho (BB1), câu trạng thái cho
người gửi tín hiệu (TH-cau), kiểm bản cài sau phát hành (KC1 — vòng meta duy nhất của cửa sổ, chủ kho gọi tên 12/10)
và hai thước của gói `dieu-phoi` thôi nói sai ở kho tiêu thụ (DP9). Chủ kho chốt mốc 14/10 trên lộ trình kit, trễ
nhất 15/10, không cắt khi thiếu KC1.
Kho chờ nhận: `crm` — máy Mac Studio nhận ở quãng lặng của đợt `r2`. Mốc đi **làn V**, không dựng răng mới. Ba gói
`acceptance-gate`, `feature-loop`, `dieu-phoi` cùng lên `2.29.0`; `diagram-design` giữ `2.7.1`. Tag `v2.29.0` gắn
vào commit gộp PR mốc.

**Vì sao 2.29.0, không 2.28.1:** mốc thêm bề mặt mới cho kho tiêu thụ — tệp luật tuỳ chọn `PRODUCT-INVARIANTS.md`
(BB1, CỘNG chủ kho phê ở Cổng Đáng 11/10, ADR 0024), trường `cau_nguoi_gui` và lệnh `tin-hieu.mjs --cau` (TH-cau,
CỘNG), mô-đun `scripts/co-hop-dong.cjs` vào lớp chép CI và cờ chặn cỡ hợp đồng trên thẻ Cổng Phạm vi (S3c), lệnh
`scripts/kiem-ban-cai.mjs` (KC1), lệnh `dieu-phoi.mjs xem --json` và phần mod khung trạng thái (DP6b).

**Lớp chép CI 26 tệp (thêm một — `scripts/co-hop-dong.cjs`, S3c):** đổi năm tệp so với `v2.28.0` — kể ở mục «Kho
tiêu thụ làm gì khi nhận». Hai mươi mốt tệp còn lại giống từng byte `v2.28.0` (AC-8 đo trên cây mốc, danh sách mong
đợi đọc TỪ chính gạch ghi chú — vá Ngoài-1 của `release-2-28-0`). Danh sách nay gắn thẻ máy-đọc
`[only-if-declared: tin_hieu|lo_trinh]` cho mười mục chỉ cần khi kho khai ổ cắm (DP9).

**Hai sửa đi trong PR mốc** (phiên điều phối giao 13/10, không có hồ sơ riêng; AC-11, AC-12 của hồ sơ mốc):

- **Luật sản phẩm không còn bị bỏ qua im lặng khi bản cài thiếu mô-đun luật.** Kho có `PRODUCT-INVARIANTS.md` mà gói
  cài không nạp được `scripts/luat-san-pham.cjs` → lệnh máy tự đóng hồ sơ làn V (`khong-can-nguoi.mjs --write|--check`)
  và bộ quét đầu phiên trả «còn cần người: kho khai luật sản phẩm (PRODUCT-INVARIANTS.md) nhưng không nạp được
  scripts/luat-san-pham.cjs — cài lại gói acceptance-gate theo đúng thẻ», thoát 2. Kho không khai luật: không đổi gì.
  Danh sách chép CI **không** thêm `luat-san-pham.cjs`: CI của kho tiêu thụ gọi vị từ làn V mà không truyền luật (đẳng
  thức với lưới trước-gộp, ca LV5), nên chép thêm tệp không đổi gì — đo 13/10 trước khi sửa. Ca LS-13 (năm vế, có
  chiều đỏ). Lỗ do máy M5 nêu khi rà BB1 × A3 × S3c trên main.
- **Cờ «bản vẽ cũ» của câu tín hiệu nói đúng số bản:** chuỗi `CO_BAN_VE_CU` và ba dòng của
  `skills/acceptance/references/lo-trinh-du-lieu.md` nay nói «kit ≥ 2.29» (trước ghi 2.28 — vòng TH-cau dời khỏi
  2.28; hạt giống `2026-10-13-hat-giong-co-ban-ve-cu-ghi-dung-so-ban`).

### Hợp đồng mở thẳng bằng Feature Loop cũng bị đo cỡ (hồ sơ `vong-mo-thang-bang-feature-loop`, hàng S3c, T2, làn V)

Gốc: kit `_acceptance/vong-la-mot-ket-qua` — mục OOS-1 (sổ `d-20261011T002900Z-3`, mở lại khi DP7 gộp). Đo 12/10:
crm 77/225 hồ sơ đã chốt có ≥ 13 tiêu chí, 67 trong số đó mở thẳng; nhóm phải tách chạm trần lượt chấm 62 % (nhóm
mục tiêu 21 %). Kit 21/140, OneFlow 20/41. Năm chỗ trong lời dặn còn dạy «5–15».

- **Thẻ Cổng Phạm vi đo cỡ hợp đồng nháp:** ≥ 13 tiêu chí mà sổ không có dòng giữ cỡ → cờ đỏ, câu duyệt mang ô
  `___`, lệnh duyệt dừng và đưa hai lối «tách» hoặc `sửa: giữ cỡ — <lý do>`; 11–12 tiêu chí → cờ vàng. Bản rút
  `--extract` mang khoá mới `co_hop_dong`. Feature Loop bị chặn thì không đi làn V, máy tự tách hoặc ghi dòng giữ
  (khuôn `DEC-GIU-CO`).
- **Mô-đun mới `scripts/co-hop-dong.cjs`** — một bộ đọc khoảng cỡ, rút từ khối `CAT-LUOT-CO`; `cat-luot.mjs` dùng lại
  nó, và `cat-luot.mjs --co` thêm trường `n_giu`. Năm chỗ dạy «5–15» nay dẫn về khối ấy.
- Không CỘNG khoá cấu hình. Đường đọc cũ: chỉ hợp đồng `draft` bị đo; từ `approved` trở đi không cờ.
- **Giới hạn đã khai:** câu «sửa: giữ cỡ — …» phải gõ hai lượt và dòng giữ thiếu ba vế; hai phép đo chỉ đo lời dặn,
  không đo một phiên S1 thật (ngưỡng: ≥ 1 hợp đồng ≥ 13 tiêu chí lọt qua thì mở răng ở hook và lưới trước-gộp); ba
  chỗ yếu của phép đo ở Notes hợp đồng. Hạt giống `2026-10-13-hat-giong-cho-trong-rut-tu-ben-ghi`.
- **Ai bị ảnh hưởng:** mọi kho chạy Feature Loop — hồ sơ nháp ≥ 13 tiêu chí lúc nâng kit dừng ở lối vào Cổng Phạm vi
  tới khi tách hay ghi dòng giữ; hồ sơ đã chốt không đổi. **Khi update:** kho khai `tin_hieu` chép thêm
  `scripts/co-hop-dong.cjs` và chép lại `scripts/cat-luot.mjs` (thiếu thì `MODULE_NOT_FOUND` khi `tin-hieu.mjs` nạp
  `cat-luot.mjs`). Ngưỡng nghiệm thu: `cat-luot.mjs --co --tu <ngày cài>`, nhóm `phai-tach`, `n_chot − n_giu` = 0.

### Luật sản phẩm của kho — bước thiết kế nạp luật, thẻ gọi tên luật bị chạm (hồ sơ `bat-bien-san-pham`, hàng BB1, T2)

Gốc: crm `_acceptance/okr-soat-anh-luot-3` — Ngoài-1 và Ngoài-7 («lại ghi cứng múi giờ Việt Nam») thành Known limits
vì thẻ không có luật nào để gọi tên. Đo trên crm `27d47de04`: 14 dòng ghi cứng múi giờ ở 12 tệp, 8 hàm ngày giờ tự
dựng; trên 238 hồ sơ, 5/5 quyết định của người về múi giờ là «ghi Known limits» ở Cổng Bằng chứng, 0 ở bước thiết kế.

- **Tệp tuỳ chọn `PRODUCT-INVARIANTS.md` ở gốc kho** (CỘNG, chủ kho phê ở Cổng Đáng 11/10, ADR 0024). Khuôn ở
  `skills/acceptance/references/product-invariants-template.md`: mỗi luật `## SP-<số> · <câu>` kèm Mức (thường · khó
  đảo), Chủ luật, Giữ bằng, Dấu hiệu, Phạm vi, Vì sao. Tệp là của kho — máy không sửa, kit không chở luật mẫu.
- **Bước thiết kế nạp luật** (dòng sổ `DEC-LUAT-NAP`); lựa chọn trái luật là câu chỉ-người mang `pham_luat`, thẻ
  Cổng Phạm vi hỏi «Phạm luật SP-n — <câu> (chủ luật: <tên>)». Máy tự quyết một lựa chọn phạm luật, mã luật không có
  trong tệp, hay luật khó đảo bị máy quyết → dòng đỏ.
- **Lượt chấm soi luật** (`luat-san-pham.cjs --quet … --write` → `luat-cham.json`); thẻ Cổng Bằng chứng có khối «Luật
  sản phẩm bị chạm» với ô `SP-<số>: sửa vật | chấp nhận có tên`, và cờ đỏ khi commit của máy sửa tệp luật. Chạm luật,
  hay chưa soi luật trên bản đã chấm → vòng không đi làn V. Lệnh đếm `luat-san-pham.cjs --root <kho> --dem --tu <ngày>`.
- **Kho không có tệp luật: không đổi một byte** — phép vi phân trên kit (136 hồ sơ) và crm (228) bằng nhau.
- **Giới hạn đã khai:** mười mục ở Notes hợp đồng (thẻ nuốt im lỗi nạp mô-đun luật — một phần vá ở PR mốc; dòng thêm
  mở đầu bằng `++ ` làm bộ soi bỏ phần sau của tệp; cờ «luật đã đổi» không tự tắt; bốn ca kiểm yếu…), cộng bốn giới
  hạn thiết kế có ngưỡng (bộ soi khớp chữ theo dấu hiệu kho tự khai; bộ tìm lỗi chỉ thấy luật khi `CLAUDE.md` trỏ tới
  tệp; commit máy và người tách bằng dòng `Co-Authored-By`). Hạt giống `2026-10-13-hat-giong-bo-soi-luat-ten-tep-co-dau`.
- **Ai bị ảnh hưởng:** chỉ kho tự viết `PRODUCT-INVARIANTS.md` (bằng commit riêng của chủ kho). **Khi update:** muốn bộ
  tìm lỗi thấy luật thì thêm một dòng trỏ tệp luật vào `CLAUDE.md` của kho; chép lại `scripts/khong-can-nguoi.mjs`.

### Người gửi tín hiệu đọc được tín hiệu của mình đang ở đâu bằng một câu tiếng sản phẩm (hồ sơ `cau-tin-hieu-nguoi-gui`, hàng TH-cau, T2, làn V)

Gốc: crm `_acceptance/gui-tin-hieu-trong-crm`, eval E14 (PR crm-onehub#374) — ba giám khảo đề xuất FAIL. Đo 12/10:
5/7 câu kit sinh cho người gửi mang mã việc, tên hồ sơ hay chữ nội bộ («H3», «viec-h5», «lượt gom»).

- **Trường mới `cau_nguoi_gui`** (CỘNG) ở cuối mỗi bản ghi đường đi tín hiệu (`--duong`) và khoá `tin_hieu` của khối
  dữ liệu lộ trình — câu dựng từ tên nhóm, câu giao (bỏ «») và ngày ký. `cau` cũ giữ nguyên từng byte, nay là câu cho
  chủ kho.
- **Lệnh mới `tin-hieu.mjs --root . --cau`:** thoát 0 in một dòng tóm tắt; thoát 1 in mỗi câu lọt một dòng; thoát 2
  khi khối từ cấm vắng. Khối từ cấm `TIN-HIEU-CAU-CAM` sống trong `tin-hieu-template.md` (từ thường cấm cả câu, từ
  `(khung)` chỉ cấm phần kit viết). Skill gom chạy phép kiểm câu sau mỗi lượt gom (khối `GOM-CAU`).
- **Đường đọc cũ:** `cauChoNguoiGui(b)` trả `{ cau, co }` — trang vẽ bằng kit trước 2.29 không có trường thì lùi về
  `cau` kèm MỘT cờ vàng «bản vẽ cũ — chưa có câu cho người gửi»; `docDuLieu` không đổi.
- **Giới hạn đã khai:** câu giao của chủ kho hiện nguyên văn trong câu (E10, chủ kho chọn Đạt ở Cổng Bằng chứng) —
  ở crm có câu như «chip Kara»; mười một nhóm chỗ yếu của phép đo ở Notes hợp đồng (ma trận đỏ phủ một phần bộ mã,
  hai ca đỏ chưa chờ bản lành, skill gom thiếu lối «báo chủ kho»…). Ngoài-1/Ngoài-8 (số bản của cờ) sửa ở PR mốc.
  Hạt giống `2026-10-13-hat-giong-ngay-ky-dang-ngay-thang-nam`.
- **Ai bị ảnh hưởng:** chỉ kho khai `tin_hieu`. **Khi update:** chép lại `scripts/tin-hieu.mjs` và
  `skills/acceptance/references/tin-hieu-template.md` từ thẻ, vẽ lại `LO-TRINH.html` (không thì trang mang cờ «bản vẽ
  cũ»), chạy `--cau` sau mỗi lượt gom — 0 câu lọt là sống.

### Trạng thái đợt hiện ngay trong app — dải trên ô nhập, pane, `/dieu-phoi:xem` không qua model (hồ sơ `trang-thai-dot-dieu-phoi-tho`, hàng DP6b, T2)

Gốc: crm `dieu-phoi-hai-tang`. Đợt crm 04/10 có 20 trên 33 tin chủ kho gửi điều phối là hỏi trạng thái, vì không thấy
đợt đang ở đâu.

- Lệnh `dieu-phoi.mjs xem --json` (lệnh mới) in MỘT dòng JSON, gồm cùng mô hình mà `xem` vẽ, cộng dãy của cwd. Kho
  không đợt in `{"dot":null}`. `xem` không cờ không đổi một byte.
- Phần mod `hooks/mod/khung.ts`:
  - Dải một dòng trên ô nhập (`Đợt … · S4: <phiên> → HH:MM · chờ lượt <n> · cần anh <n>`), làm mới 20″ khi có đợt và
    120″ khi không.
  - Nút `xem` mở pane «Đợt».
  - `/dieu-phoi:xem` trả lời không qua model; hook hỏng thì lệnh markdown cũ chạy như trước.
  - Mod chỉ đọc qua CLI. Răng «mod chỉ vẽ» (`kiem-khung.mjs` KH-09) chặn lời gọi ghi/gửi, hook cổng ngoài lệnh xem,
    và argv khác `xem --json`. Luật «không nghe sự kiện cổng» nay áp cho mọi phần mod.
- Ai bị ảnh hưởng: chỉ kho cài gói `dieu-phoi` (crm). App hay CLI chưa hỗ trợ mod thì không đổi gì; hook thường vẫn
  chạy.
- Giới hạn đã khai, là nhãn chứ không phải việc: chưa ai nhìn thấy dải trên app desktop, và `$.process.run` trên
  desktop chưa được đo. Đợt crm đầu tiên sẽ đọc hai nhãn này.
- Nhận mốc: gói `dieu-phoi` có thêm `types/index.d.ts` (khế ước `$.state`). Không có bước tay nào.

### Kiểm bản cài sau phát hành (hồ sơ `kiem-ban-cai-sau-phat-hanh`, hàng KC1, T2)

Gốc: `_acceptance/release-2-27-0` — A1 chưa chạy sống ở bản cài vì bộ đệm thiếu `feature-loop/agents/`
(`run-log.jsonl` ghi `loai-tac-tu-vang`), và bản «2.27.0» ở M5 là main 294b29d, không phải tag. Đo 13/10: chợ kit
kiểu thư mục chép cây đang checkout lúc cài; bộ đệm khoá theo số, `update` báo «đã mới nhất» mà giữ nội dung cũ.

- **Đổi gì:** lệnh mới `scripts/kiem-ban-cai.mjs`. `--ref <tag>` cài đúng cây của tag vào cấu hình Claude cách ly +
  kho giả lập sạch, kiểm tám mục (số · khớp tag · thư mục gói · tác tử chấm · móc nối · thẻ cổng · lưới trước-gộp
  hai chiều · gói `dieu-phoi`). `--may --ref <tag>` chỉ đọc sổ cài của máy, so mọi bản ghi cùng số với tag.
  Đọc dòng `TỔNG KẾT` (`ĐẠT` · `ĐỎ` · `KHÔNG CHẠY ĐƯỢC`), không đọc mã thoát một mình. GUIDE §7.2.
- **Răng phát hành:** khoá `kiem_ban_cai_moc` vào `feature_loop.suite_keys` của kit — chạy trọn CHỈ ở lượt chấm hồ
  sơ cắt mốc (số trong `.claude-plugin/plugin.json` khác gốc vòng); vòng thường in một dòng `BỎ QUA`, < 1 s. Bản
  cài của cây sẽ gắn tag hỏng → lượt chấm mốc đỏ → không cắt số.
- **Ai bị ảnh hưởng:** người cắt mốc kit và mọi máy nhận. Kho tiêu thụ không đổi gì (lệnh sống trong gói gốc).
- **Khi update:** người cắt mốc chạy `node scripts/kiem-ban-cai.mjs --ref v<số>` SAU khi gắn tag. Máy nhận, sau
  bốn bước cài lại của mục A1 (2.27.0), chạy `node <gốc gói acceptance-gate>/scripts/kiem-ban-cai.mjs --may --ref
  v<số> --root <bản checkout kit có tag>` — thay khối `node -e` ở bước 3 mục A1 (khối cũ chỉ hỏi có `agents/`
  không, không bắt được bản cài cùng số mà khác tag). Dòng `ĐỎ may:` nào còn → gỡ rồi cài lại ở đúng nơi dòng ấy kể.
- **Giới hạn đã khai** (design §4, mỗi cái một ngưỡng mở lại): tác tử chấm đo tĩnh — tệp có mặt mà Claude Code
  không nạp được thì lọt (ngưỡng: ≥1 lượt chấm sau cài có `loai-tac-tu-vang` trong khi kiểm XANH); CI GitHub không
  chạy; bước sau-tag là lời dặn (ngưỡng: một mốc kiểm trên tag đỏ mà lượt chấm mốc xanh); nhận diện lượt mốc theo
  số của gói gốc (ngưỡng: một mốc đổi số gói con mà quên gói gốc).

### Hai thước thôi nói sai trên kho tiêu thụ — tệp có điều kiện ở đường nền, «không đo được» ở design-gate (hồ sơ `nen-dieu-kien-va-static-khong-do-duoc`, hàng DP9, T2)

Gốc: crm-onehub#375 (đợt r2, 13/10) + đường nền DA1 của crm.

- **Đường nền, chân engine:** khối danh sách chép CI (`commands/acceptance-init.md`) gắn thẻ máy-đọc
  `[only-if-declared: tin_hieu|lo_trinh]` cho 10 mục chỉ cần khi kho khai ổ cắm. Kho không khai ổ cắm mà không chép
  tệp ấy → `engine: bo-qua <tệp> …` ra stderr thay vì `LECH`. Tệp có mặt mà lệch, hoặc kho đã khai mà tệp vắng,
  vẫn đỏ. crm (không khai `tin_hieu`, thiếu bốn tệp) thôi đỏ engine ở mọi dãy.
- **`design-gate --mode static` trên tệp không phải HTML** (`.tsx`, `.jsx`, `.vue`, không đuôi…): giữ NGUYÊN mã
  thoát, nhưng `verdict: "KHONG-DO-DUOC"` thay `PASS`, thêm `do_duoc: false` và một dòng stderr. Lỗi chặn nó vẫn
  thấy được (vd `<img src="" />` viết chữ) vẫn là `REJECT`. HTML và `--mode dom` không đổi một byte.
- **Ai bị ảnh hưởng:** không lượt ghim lại nào đổi màu — đo trên crm 13/10: 265/265 lượt gọi giữ mã thoát (51 eval
  `*_san_thiet_ke`); 262 lượt PASS đổi chữ thành `KHONG-DO-DUOC`. Bên đọc trường `verdict` duy nhất biết được (crm
  `tiep-thi-tuyen-doi-tac`) chấm dom trên `.html` — ngoài nhánh đổi.
- **Làm gì khi update:** không chép lại tệp nào — đường nền và `design-gate.mjs` chạy từ gói đã cài. Muốn eval
  design thật sự đo: chụp trang đang chạy (`--html`) rồi chấm tệp `.html`. Giới hạn: cờ vàng chưa có bên đọc máy —
  làn ghim lại chỉ đọc mã thoát.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI:** chép lại từ thẻ `v2.29.0` năm tệp — luôn cần: `scripts/khong-can-nguoi.mjs` (BB1 + sửa ở PR mốc);
  chỉ khi kho khai `tin_hieu`: `scripts/tin-hieu.mjs` và `skills/acceptance/references/tin-hieu-template.md` (TH-cau),
  `scripts/cat-luot.mjs` và tệp MỚI `scripts/co-hop-dong.cjs` (S3c). Hai mươi mốt tệp còn lại không đổi byte so với
  `v2.28.0`.
- **Máy dev: cài `acceptance-gate`, `feature-loop` (và `dieu-phoi` nếu kho dùng) theo ĐÚNG THẺ ở MỌI phạm vi**, rồi
  kiểm bằng lệnh của KC1 — thay khối `node -e` của mục 2.28.0:
  `node <gốc gói acceptance-gate>/scripts/kiem-ban-cai.mjs --may --ref v2.29.0 --root <bản clone kit đã git fetch --tags>`.
  Sống là dòng `[kiem-ban-cai] TỔNG KẾT: ĐẠT <n> bản ghi khớp v2.29.0`; còn dòng `ĐỎ may:` (bản ghi cùng số mà lệch thẻ)
  hay `VÀNG may:` (bản ghi khác số — chưa nâng) thì gỡ rồi cài lại ở đúng nơi dòng ấy kể.
- **Kho có lộ trình:** vẽ lại `LO-TRINH.html` một lần trong PR nâng kit (`node scripts/product-map.mjs --root .`).
- **Kho muốn luật sản phẩm:** tự viết `PRODUCT-INVARIANTS.md` theo khuôn bằng commit riêng của chủ kho (mục BB1);
  không viết thì không đổi gì.
- **Kho có hồ sơ nháp ≥ 13 tiêu chí:** tách, hay ghi dòng `giữ cỡ — <lý do>` trước Cổng Phạm vi (mục S3c).

**Người cắt mốc kit:** sau khi gắn thẻ chạy `node scripts/kiem-ban-cai.mjs --ref v2.29.0` (KC1) — dòng TỔNG KẾT ghi
vào hồ sơ `release-2-29-0`.

**Chiến dịch ghim lại — không hồ sơ nào để cũ hoá vì môi trường:** lưới trước-gộp `--stale-all` so mốc `72eb55f3`
chọn bảy hồ sơ (sáu vòng của cửa sổ và `dieu-phoi-doi-tai-khoan`); làn `repin-20261013T091229Z-18995` xanh cho cả bảy
trên máy MacBook Pro (36,8 phút, 31 lệnh, 0 chập chờn). `dieu-phoi-on-dinh-r2` (DP8) — hồ sơ 2.28.0 để cũ hoá có chủ
đích vì AC-4 đọc bản sao crm ở `$HOME/dev/crm-onehub` (đường của máy M5) — không bị lưới coi là cũ ở mốc này, nên
không cần ghim. Ai ghim lại ở máy khác thì đọc nhãn *không đọc được ở đây* (không phải sai hợp đồng, không phải lỗi
của mốc) ở bốn hồ sơ cần môi trường riêng: `trang-thai-dot-dieu-phoi-tho` (DP6b — E5–E9b cần Claude Code có lệnh
`plugin test`, ≥ 2.1.287; bộ đo tìm trên PATH rồi ở bản đi kèm app desktop), `dieu-phoi-on-dinh-r2` (bản sao crm ở
`$HOME/dev/crm-onehub`), `evals-sat-le-doc-du` (bản sao bảy kho ở `$HOME/dev/<kho>`), `tac-tu-cham-chi-cham-khong`
(`rang.sh` đỏ trên node 24.21 ở bước kiểm cú pháp mutant).

**crm, theo thứ tự** (crm nhận thẳng từ bản đang cài — mọi ghi chú nhận của các mốc ở giữa vẫn áp, trừ chỗ dưới đây
thay):

1. **Khi nào, ở đâu:** máy Mac Studio — máy duy nhất cài kit vào crm — ở **quãng lặng của đợt `r2`**: không lượt S4
   nào đang chạy, không vòng nào giữa hai cổng. Không đổi engine dưới chân một vòng đang chạy (DP6b đổi được giữa đợt
   vì chỉ đọc, nhưng vẫn nhận cùng mốc ở quãng lặng).
2. **Cài theo thẻ `v2.29.0`:** gỡ rồi cài lại `acceptance-gate`, `feature-loop`, `dieu-phoi` ở mọi bản ghi (phạm vi
   `user`, gốc crm, từng cây phụ có phiên). Kiểm bằng `kiem-ban-cai.mjs --may --ref v2.29.0` — sống là `TỔNG KẾT: ĐẠT … khớp
   v2.29.0`, không còn dòng `ĐỎ may:` hay `VÀNG may:` nào (máy còn bản cũ chỉ in VÀNG mà TỔNG KẾT vẫn ĐỎ). Không cài từ `main` giữa hai thẻ. Mở phiên MỚI sau khi cài.
3. **Lớp chép CI từ thẻ** (`git archive v2.29.0`): `scripts/khong-can-nguoi.mjs`; crm không khai `tin_hieu` (DP9 đo
   13/10) nên bốn tệp tín hiệu chưa cần — đường nền thôi báo lệch cho chúng (DP9).
4. **LT2 crm đọc câu cho người gửi bằng `b.cau_nguoi_gui ?? b.cau`** — đúng luật đọc lùi của `cauChoNguoiGui`: trang
   vẽ bằng kit trước 2.29 không có trường thì hiện câu cũ (có thể mang mã) kèm cờ vàng «bản vẽ cũ»; vẽ lại bằng 2.29.0
   thì cờ hết. Chạy lại E14 của `gui-tin-hieu-trong-crm` sau khi vẽ lại.
5. **Luật sản phẩm:** chủ kho viết bản luật đầu (vd múi giờ đọc từ cấu hình) bằng commit riêng, thêm một dòng trỏ
   `PRODUCT-INVARIANTS.md` vào `CLAUDE.md` của crm. Từ đó mọi vòng mới có dòng nạp luật ở bước thiết kế.
6. **Hồ sơ nháp ≥ 13 tiêu chí đang mở** dừng ở lối vào Cổng Phạm vi tới khi tách hay ghi dòng giữ cỡ (S3c).
7. **Đo trước → sau** (tiền lệ `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`): trên cùng một cây, lưới
   trước-merge và thẻ của các hồ sơ đang mở dưới bản đang cài rồi 2.29.0 — phán quyết từng hồ sơ phải bằng nhau, TRỪ
   chỗ mốc hứa đổi: cờ cỡ hợp đồng trên thẻ hồ sơ nháp (S3c), khối luật sản phẩm (chỉ sau khi có tệp luật), chân engine
   của đường nền thôi đỏ (DP9), và mọi thứ các mốc ở giữa đã hứa đổi. Khác ở chỗ nào khác là tín hiệu.
8. **Đọc ngưỡng ở vòng crm đầu tiên sau khi nhận:** `tin-hieu.mjs --cau` sau lượt gom thật đầu tiên ra 0 câu lọt
   (TH-cau — từ khi crm khai `tin_hieu`; chưa khai thì vế này chưa đọc được); `luat-san-pham.cjs --root . --dem --tu <ngày khai>` — cột dòng nạp phủ mọi vòng mới (BB1);
   `cat-luot.mjs --co --tu <ngày cài>`, nhóm `phai-tach`, `n_chot − n_giu` = 0 (S3c); số dòng
   `"kind":"loai-tac-tu-vang"` trong run-log không tăng sau lượt chấm đầu (KC1, dấu A1 sống).

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng của từng vòng — đủ ở sáu hợp đồng):
`cau-tin-hieu-nguoi-gui` 16 mục (11 nhóm) · `bat-bien-san-pham` 10 + 4 giới hạn thiết kế · `kiem-ban-cai-sau-phat-hanh`
9 · `trang-thai-dot-dieu-phoi-tho` 5 · `vong-mo-thang-bang-feature-loop` 4 + 1 giới hạn đo · `nen-dieu-kien-va-static-khong-do-duoc`
2. `docs/research/known-limits-ledger.tsv` có hàng cho cả sáu vòng. Hạt giống mới:
`2026-10-13-hat-giong-cho-trong-rut-tu-ben-ghi` · `2026-10-13-hat-giong-khung-nhip-tat-im` ·
`2026-10-13-hat-giong-bo-soi-luat-ten-tep-co-dau` · `2026-10-13-hat-giong-ngay-ky-dang-ngay-thang-nam` ·
`2026-10-13-hat-giong-co-ban-ve-cu-ghi-dung-so-ban` (đã làm ở PR mốc).

**Năm dòng số của luật (c)** — sáu vòng (giờ VN; nguồn: giờ commit `contract.md`, `usage-report.md`,
`decisions.jsonl`, `run-log.jsonl` của hồ sơ; dòng 1 tính từ commit đặt `implemented` đầu tiên tới commit chữ ký Cổng
Bằng chứng; ba khối token theo khuôn 2.25: chứng-minh-vật = machine+ui+judge+baseline · tìm-lỗi = review+refute · tổng
hợp = triage+capture+synthesize; Cổng Đáng không tính, theo khuôn 2.26):

| Hồ sơ | 1 · làm-xong→quyết-được · lượt chấm | 2 · gọi người trong / ngoài (trần) | 3 · lượt bị hạ tầng đốt | 4 · out-token S4 · vật / tìm-lỗi / tổng hợp % | 5 · phút máy / lượt |
|---|---|---|---|---|---|
| `vong-mo-thang-bang-feature-loop` (S3c, máy M5) | 11 g 01 · 2 (lượt 1 chạy 6 g 57 sau `implemented`; hồ sơ không ghi vì sao chờ) | 1 / 1 (3) — lượt ký thứ hai ngoài thiết kế (nâng phạm vi ở Cổng Bằng chứng lượt 1) | 0 | 58 780 · 46,1 / 18,9 / 35,0 | 43 · 42 = 85 |
| `trang-thai-dot-dieu-phoi-tho` (DP6b, máy M5) | 10 g 53 · 2 (lượt 1 chờ DP8 vào main, 8 g 17) | 2 / 0 (3) | 0 | 52 321 · 42,1 / 17,7 / 40,3 | 43 · 42 = 85 |
| `bat-bien-san-pham` (BB1) | 28 g 33 · 2 (lượt 1 chạy 26 g 18 sau `implemented` — chờ A2 và A2s vào main) | 2 / 0 (3) | 0 (+1 ca biên: lượt 1 đỏ ca P126 vì hai ADR trùng số, cùng lượt REJECT thật ở E11) | 80 728 · 54,5 / 14,8 / 30,6 | 33 · 35 = 68 |
| `cau-tin-hieu-nguoi-gui` (TH-cau) | 17 g 14 · 3 (lượt 1 chạy 11 g 45 sau `implemented` — vòng dời sang sau 2.28) | 1 / 0 (3); số chạm không ghi | 0 (+1 ca biên: lượt 2 REJECT chỉ vì sổ giới hạn thiếu hàng — P179) | 220 311 · 49,4 / 14,5 / 36,1 | 41 · 38 · 34 = 113 |
| `kiem-ban-cai-sau-phat-hanh` (KC1) | 6 g 37 · 2 | 1 / 1 (3) — lượt ký thứ hai ngoài thiết kế (nâng phạm vi AC-10..12) | 0 | 71 066 · 50,9 / 18,3 / 30,8 | 33 · 33 = 66 |
| `nen-dieu-kien-va-static-khong-do-duoc` (DP9, máy M5) | 0 g 54 · 1 | 1 / 0 (3) | 0 | 26 245 · 53,0 / 14,9 / 32,0 | 48 |

Cộng sáu vòng: **12 lượt chấm** (1 vòng một lượt; trung vị làm-xong→quyết-được 10 g 57) · **509 451 out-token**
(chứng-minh-vật 49,5 % · tìm-lỗi 15,9 % · tổng hợp 34,6 %) · **≈ 465 phút máy** · **10 lượt gọi người** (8 trong
thiết kế, 2 ngoài), **0 vòng vượt trần** · hạ tầng đốt **0 lượt chấm** (+2 ca biên). Phiên chính không đo token.

**Đọc số:**

- **Bốn trong sáu vòng chờ trước lượt 1 từ 7 tới 26 giờ** — chờ nhánh khác vào main (BB1 chờ A2/A2s, DP6b chờ DP8),
  chờ thẻ 2.28 (TH-cau), hoặc không ghi (S3c). Dòng 1 phình vì chờ, không vì chấm; phút máy theo số lượt.
- **Hai lượt gọi ngoài thiết kế đều cùng một hình dạng:** chủ kho ký lượt 1 bằng cách NÂNG phạm vi (S3c, KC1) — lượt
  ký thứ hai là giá của việc nâng, như DP8 ở 2.28.
- **Tìm-lỗi 15,9 % token** (2.28: 15,2 %), chứng-minh-vật 49,5 % (2.28: 51,1 %). TH-cau chiếm 43 % token của cửa sổ
  — ba lượt, trong đó lượt 3 chủ yếu để gỡ một ca sổ giới hạn.
- **A1 vẫn chưa đọc được ở máy MacBook Pro:** 7/7 lượt của ba vòng chạy ở đó có dòng `loai-tac-tu-vang`; năm lượt của
  ba vòng máy M5 không có dòng nào. Máy MacBook Pro còn chạy bản cài 2.26.0 — chỗ cắt A1 đặt ra vẫn chưa có lượt để
  đọc; KC1 nay cho một lệnh kiểm việc đó (`--may`).

**Điều kiện tin cậy:** (i) đường verdict (finder → refute trong hợp đồng → REJECT) không đổi thành phần —
`git diff v2.28.0 <cây mốc> -- feature-loop/workflows/ feature-loop/agents/` rỗng. Không vòng nào đổi đầu vào lượt chấm.
(ii) Lượt chấm sai do phép-đo-tự-dối giữa hai mốc: **0** phán quyết tới người ký sai. Ngưỡng (a) đếm **0/2**. Dòng
4–5 cắt được, 6/6 vòng có số.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | = | không mục nào chạm đoạn từ `implemented` tới chữ ký |
| 2 | ↓ ở crm | luật sản phẩm đưa câu «có làm trái luật không» lên bước thiết kế thay vì thành Known limits ở Cổng Bằng chứng (đo crm: 5/5 ở Cổng Bằng chứng); trạng thái đợt hiện trong app thay 20/33 tin hỏi trạng thái (DP6b); cỡ hợp đồng chặn trước Cổng Phạm vi thay vì vòng chạm trần lượt chấm (S3c). Rủi ro ngược: cờ cỡ dừng hồ sơ nháp đang mở lúc nâng kit |
| 3 | ↓ | kiểm bản cài trước khi phát (KC1) chặn lớp «bản cài thiếu thư mục» đốt lượt ở kho nhận; chân engine của đường nền thôi đỏ oan ở crm (DP9) |
| 4 | = / lượt | thành phần lượt không đổi; lượt chấm hồ sơ cắt mốc thêm ~2 phút máy (khoá `kiem_ban_cai_moc`) |
| 5 | = / lượt | như trên |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .` (13/10,
đọc trên cây mốc). **N không tăng so với mốc 2.28.0 (vẫn 1) — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.28.0 — 13/10/2026

Cửa sổ 2.27.0 → 2.28.0 nằm trong **ba ngày** (11–13/10; A2 ký 11/10 trước giờ gắn thẻ `v2.27.0` nhưng gộp sau), có
**năm vòng được ký** — tập đối chiếu bằng `scripts/rel-cua-so.sh` (AC-4 của hồ sơ mốc). Đây là **mốc ỔN ĐỊNH, chỉ
sửa lỗi** (chủ kho 12/10: ưu tiên tầng kit): sửa ba chỗ mà 2.27 hứa một điều còn vật làm khác ở kho tiêu thụ —
bước thiết kế của Feature Loop (A2 + A2s, gộp liền nhau), dải tóm tắt hồ sơ (X2s + X2s2, gộp một lần qua #325), và gói
`dieu-phoi` trước đợt `r2` của crm (DP8, của máy M5).
Kho chờ nhận: `crm` — máy Mac Studio cài thẳng từ 15/10. Mốc đi **làn V**, không dựng răng mới. Ba gói
`acceptance-gate`, `feature-loop`, `dieu-phoi` cùng lên `2.28.0`; `diagram-design` giữ `2.7.1`. Tag `v2.28.0` gắn sau khi PR mốc gộp.

**Vì sao 2.28.0, không 2.27.1:** dù chỉ sửa lỗi, mốc thêm bề mặt mới cho kho tiêu thụ — khoá máy đọc `can_cu` trên
dòng sổ bước thiết kế cùng bộ xếp `scripts/can-cu-s1.cjs` và lệnh đếm `--dem` (A2, ADR 0022), và ổ cắm tuỳ chọn
`production.nhanh` — vắng thì như 2.27 (X2s, CỘNG chủ kho phê ở Cổng Phạm vi 12/10), khoá tuỳ chọn
`dieu_phoi.lich_su` và lệnh `ghi-danh` của gói `dieu-phoi` (DP8).

**Lớp chép CI giữ 25 tệp, không thêm:** ĐỔI đúng một tệp — `scripts/ho-so-tom-tat.cjs` (X2s, X2s2). Hai mươi bốn tệp
còn lại của INIT-CI-COPY-LIST giống từng byte `v2.27.0` (đo `git diff v2.27.0` trên cây mốc — kể cả ba tệp
`dieu-phoi/scripts/` của danh sách, DP8 không chạm). Tệp đổi gọi
`git` khi kho khai `production.nhanh`; không cần mô-đun mới. Diff engine của cửa sổ còn ở: `scripts/can-cu-s1.cjs`
(mới), `scripts/gate-card.js`, `feature-loop/skills/feature-loop/SKILL.md`, `scripts/evidence-page.js`, hai lệnh
`acceptance-card`, `signoff` (khối `KNOWN-LIMITS-NOTE`), `skills/acceptance/references/lo-trinh-du-lieu.md`,
`GUIDE.md`, `CONTEXT.md`, ADR 0022, và `dieu-phoi/` (README, `dieu-phoi.mjs`, `hang.mjs`, `kiem-chuyen.mjs` mới,
`phat-lich.mjs`, `tiep-tuc.mjs`, khuôn `mau/LUAT.md`).

**Kit tự host:** CI của kit cài zsh cho job tests (`66f3501f`) — ca CC-03 chạy khối lệnh sổ dưới zsh, nay đỏ khi vắng
zsh thay vì bỏ qua (CI của #320 từng đỏ đúng một ca vì runner Ubuntu không có zsh). **CI kit: bước cài zsh có trần 5
phút** (`timeout-minutes: 5`, cài không hỏi) — 12/10 một lượt CI của #332 treo ~1 g 47′ ở bước này vì job không có trần.
Kho tiêu thụ không đổi gì.

### Bước thiết kế không dừng hỏi; câu chỉ người biết dồn về thẻ Cổng Phạm vi (hồ sơ `buoc-len-thiet-ke-khong-hoi`, hàng A2, T3)

Gốc: crm `_acceptance/ke-hoach-la-mot-ban-ghi` (22/09: bảy câu máy hỏi trong tám phút ở bước lên thiết kế) và
`_acceptance/sua-luu-tru-dieu-phoi`. Sổ bước thiết kế crm 22/09–11/10: 28/51 lựa chọn chủ kho trả lời giữa chừng có
căn cứ máy đã có, 23/51 chỉ người có; chính lời dặn bước thiết kế của kit dạy máy dừng hỏi.

- **Lời dặn bước thiết kế (ngoài đợt) không còn câu xin duyệt hay «làm ngay chứ?».** Mỗi lựa chọn xếp theo nguồn căn
  cứ: *mục tiêu + quy tắc đã khai* (trỏ một tệp có từ trước vòng, câu trích nguyên văn quyết được lựa chọn) → máy
  quyết; *chỉ một lối ra sống* → máy quyết, ghi lối khác chết vì sao; *chỉ người có* → soạn nháp theo khuyến nghị và
  đưa lên thẻ, không hỏi giữa chừng. Không trỏ được căn cứ thì là «chỉ người có»; khó-đảo luôn là câu hỏi.
- **Khoá máy đọc `can_cu`** trên dòng sổ bước thiết kế (khuôn `DEC-CAN-CU-SLOT` trong skill vòng). Bộ xếp
  `scripts/can-cu-s1.cjs` xếp từng dòng thành máy-đã-quyết · câu-hỏi · đỏ (máy tự quyết một câu chỉ-người-biết,
  con trỏ thiếu hay hỏng, câu trích không có hay sinh trong chính vòng, khó-đảo bị ghi là máy quyết). Cổng Phạm vi
  không đi tiếp tự động khi sổ còn câu hỏi hoặc dòng đỏ.
- **Thẻ Cổng Phạm vi:** khối «Câu chỉ anh trả lời được» (Hỏi-1, Hỏi-2… mỗi câu có khuyến nghị, lối khác, nhãn
  khó-đảo) đứng trước khối «Máy đã quyết ở bước thiết kế» (câu trích + tệp, hoặc lối chết). Câu trả lời mẫu vẫn
  «duyệt hay sửa». Người lật một lựa chọn ở Cổng Phạm vi → máy ghi dòng theo khuôn `DEC-LAT-GATE1` trước khi soạn lại.
- **Lệnh đếm** `node scripts/can-cu-s1.cjs --root <kho> --dem` (chữ hoặc `--json`): số máy-quyết bị lật và số câu
  hỏi chọn lối khác — đường đo của vòng. Điểm vũ trang `/goal` đầu tiên dời về lời mời Cổng Đáng.
- **Giới hạn đã khai:** máy dán nhãn «mục tiêu» bằng một câu trích có thật mà không quyết được lựa chọn — bộ kiểm tất
  định không bắt; lưới là phản biện context sạch soi mọi dòng máy đã quyết, cộng thẻ in câu trích. Ngưỡng mở ô: ≥ 1
  lần chủ kho lật một dòng máy đã quyết ở Cổng Phạm vi (đếm bằng `--dem`). Bốn ca kiểm yếu và một lỗi công cụ đo
  trong hồ sơ ở Notes hợp đồng (Ngoài-4..8).
- **Ai bị ảnh hưởng:** mọi kho chạy Feature Loop. Sổ cũ đọc như cũ: dòng bước thiết kế không có `can_cu` là «đời
  trước»; hồ sơ đã qua Cổng Phạm vi không mang cờ nào của vòng này (đo trên mọi hồ sơ của kit: 0 dòng đỏ); chỉ hồ sơ
  nháp có dòng đời trước mang một cờ vàng. Tóm tắt hồ sơ, quét bài học, sức khoẻ vòng ra cùng kết quả.
- **Khi update:** không gì — nhưng A2 chỉ dùng được ở kho khách khi đi cùng A2s (mục dưới), nên hai mục vào cùng mốc.

### Lệnh kiểm sổ bước thiết kế chạy được ở mọi kho; thẻ giữ đủ ba vế (hồ sơ `can-cu-s1-chay-moi-kho`, hàng A2s, T2, làn V)

Gốc: kit `_acceptance/buoc-len-thiet-ke-khong-hoi` — Ngoài-1/2/3 lượt chấm 1, chủ kho chọn «mở hợp đồng mới» (sổ
`d-20261011T143315Z-22`). Ở crm, lời dặn gọi bộ xếp bằng đường chỉ đúng trong kho kit: lệnh thoát 1 «Cannot find
module» — trùng mã với «sổ còn dòng đỏ»; thẻ in dòng mang `can_cu` mà bỏ «vì sao» và «sai thì tốn gì».

- **Hai lời gọi bộ xếp** (kiểm sổ một hồ sơ · đếm `--dem`) đi qua bộ giải gói như mọi lệnh khác của lời dặn; kho tự
  host kit thêm `--root .`. Đo bằng kho thử không có `scripts/` của kit, chạy nguyên văn dưới bash và zsh.
- **«Sổ còn câu hỏi hay dòng đỏ» đọc trên DÒNG TỔNG KẾT của bộ xếp** («câu hỏi N», «đỏ K»), không trên mã thoát.
  Lệnh không in dòng tổng kết = bộ xếp không chạy được — dừng có tên, thông điệp nêu gói `acceptance-gate` và lệnh
  cài; không bao giờ gọi là sổ đỏ.
- **Quét lớp trọn lời dặn Feature Loop:** không còn lời gọi `node`/`bash`/`sh` nào tới công cụ của kit bằng đường chỉ
  đúng ở kho kit (ma trận bốn hình dạng tiêm vào bản sao, 4/4 bị nêu đúng dòng).
- **Hai khối căn cứ trên thẻ in đủ ba vế** — quyết gì · vì sao · sai thì tốn gì — trước câu trích hay khuyến nghị;
  dòng thiếu giá mang «⚠ chưa khai giá nếu sai» ngay trong dòng; bản rút `--extract` mang `why` và `cost_if_wrong`.
  Hồ sơ không có dòng `can_cu`: thẻ giống từng byte trước vòng.
- **Giới hạn đã khai:** cách phiên ĐỌC dòng tổng kết là văn — máy chứng hai hình dạng đầu ra phân biệt được, không
  cưỡng chế phiên đọc đúng. Ngưỡng mở ô: ≥ 1 vòng ở kho khách dừng Cổng Phạm vi vì đọc lỗi bộ xếp thành sổ đỏ. Tám
  chỗ yếu của chính các phép kiểm ở Notes hợp đồng (Ngoài-1..8).
- **Ai bị ảnh hưởng:** mọi kho chạy Feature Loop — mục này làm A2 chạy được ngoài kho kit. **Khi update:** không gì;
  đọc được ngay ở vòng crm đầu tiên sau khi nhận mốc (lệnh kiểm sổ in dòng tổng kết).

### Dải tóm tắt hồ sơ nói đúng trên dữ liệu thật; ô production đọc nhánh kho khai (hồ sơ `dai-tom-tat-doc-dung`, hàng X2s, T2)

Gốc: crm `_acceptance/trang-lo-trinh-trong-crm` — LT1 lên production 10/10 mà dải ghi «0 giới hạn» trong khi hợp đồng
có 13. Đo 12/10 trên bản sao crm: 81/81 ô production «chưa ghi quan sát production» kể cả LT1; 11/81 ô vì sao cụt ở
«:»; 31/81 dài hơn 400 ký tự. Khảo sát sáu kho: cả ba lỗi có ở mọi kho.

- **Khoá tuỳ chọn mới `production.nhanh`** trong `_acceptance/config.yaml`:

  ```yaml
  production:
    nhanh: onehub
  ```

  Khai thì ô production đọc git: mã đã chấm của hồ sơ có nằm trên `origin/<nhánh>` (vắng thì nhánh cục bộ cùng tên)
  không → «đã triển khai — gộp vào <nhánh> <ngày>; chưa ai ghi đã thấy chạy ở production» (ngày của commit đưa mã
  tới nhánh, không phải ngày của mã) · «chưa gộp vào <nhánh> (nhánh production kho khai)» · «chưa đọc được triển khai
  ở đây — <lý do>» (không thấy nhánh · mã đã chấm không có trong kho · gốc không phải kho git). Dòng quan sát người
  ghi (`/acceptance-gate:observed`) luôn thắng — «đã thấy chạy» vẫn chỉ người ghi (ADR 0020). **Vắng khoá: ô giữ đúng
  câu cũ «chưa ghi quan sát production»**, máy không suy «đã triển khai».
- **Ô «chưa làm gì»** đúng dạng «N mục để ngoài phạm vi · M giới hạn đã biết»: đọc giới hạn ở cả mục Known limits
  của báo cáo lẫn khối giới hạn trong Notes của hợp đồng; hai nơi cùng có thì lấy nơi nhiều mục hơn, không cộng.
  Notes nhắc giới hạn ở chỗ không đọc được thì không in «0» mà nói «chưa đọc được — Notes nhắc giới hạn sai khuôn».
- **Ô «vì sao»** không còn cụt ở câu dẫn «…:» (kéo theo các mục danh sách hay hàng bảng, nối « · ») và tối đa 400
  ký tự, cắt ở ranh câu kèm «…».
- **Bên viết và bên đọc rút từ một khối:** lối «ghi Known limits» của lệnh ký thêm gạch theo khuôn `KNOWN-LIMITS-NOTE`.
- Khuôn khối dữ liệu lộ trình (khoá, kiểu, `phien_ban` 2) và bộ đọc `docDuLieu` không đổi.
- **Giới hạn đã khai** (chọn ở Cổng Bằng chứng): gộp kiểu squash mà nhánh cũ còn → ô có thể ghi «chưa gộp» dù việc
  đã vào nhánh (Ngoài-5, Ngoài-10); khai nhánh viết khác thường (chú thích xen giữa, giá trị rỗng) → ô có thể lặng lẽ
  về câu cũ hoặc báo không thấy nhánh (Ngoài-4); hướng dẫn cấu hình chung chưa nhắc khoá — chỉ tài liệu khối dữ liệu
  có (Ngoài-7); mục Out of scope viết bằng bảng hay dấu sao bị đếm lệch (Ngoài-1, 2; chưa hồ sơ thật nào).
- **Ai bị ảnh hưởng:** kho có lộ trình hay trang hồ sơ. Ô vì sao và chưa làm đổi chữ ở mọi kho; ô production chỉ đổi
  ở kho khai khoá. Hồ sơ đã ký `trang-ho-so-mot-viec` có một giá trị viết sẵn đổi chữ («mục ngoài hợp đồng» → «mục để
  ngoài phạm vi»).
- **Khi update:** kho muốn ô production khai khoá, rồi vẽ lại `LO-TRINH.html` ở cây có đủ lịch sử và đã `git fetch`
  nhánh khai — vẽ ở bản sao nông thì ô nói «chưa đọc được triển khai ở đây — mã đã chấm không có trong kho». Phép so
  `--check` của trang lộ trình bỏ qua dải tóm tắt (từ 2.27), nên chữ dải khác giữa máy và CI không làm bước bản đồ đỏ.

### Ô «chưa làm gì» đếm đúng mọi hình dạng khối giới hạn; trang hồ sơ hiện trọn «Vì sao làm» (hồ sơ `dai-tom-tat-dem-dung-vi-sao-tron`, hàng X2s2, T2, làn V)

Gốc: kit `_acceptance/dai-tom-tat-doc-dung` — Ngoài-8 và Ngoài-9, chủ kho chọn «mở hợp đồng mới» (sổ
`d-20261012T033640Z-15`). Đo 12/10 trên sáu kho: ô in sai số giới hạn ở 86/661 hồ sơ theo bốn cơ chế; 301 hồ sơ có
«Vì sao» dài hơn 400 ký tự mà trang đầy đủ cũng cắt.

- **Một bộ đọc khối giới hạn** cho Notes và báo cáo: đầu đoạn bọc nhiều dòng đọc trọn, đoạn dẫn không tính là một mục,
  danh sách đánh số, gạch con thuộc mục cha, gạch tự mở «known-limits» đếm một lần, dừng ở khối ghim lại, «None.» /
  «Không có» ra 0.
- **Khối không đọc được thì không in số** (tiêu đề con, hai danh sách, hai đoạn không danh sách): «giới hạn đã biết:
  chưa đọc được — khối giới hạn ở <hợp đồng | báo cáo | hợp đồng và báo cáo> không theo khuôn» — kể cả khi nguồn kia
  đọc được.
- **Trang hồ sơ đầy đủ in trọn mục «Vì sao làm»** (câu dẫn kèm mọi mục, hàng bảng); trần 400 chỉ áp cho dải và khối.
- **Đo trên sáu kho:** 91 hồ sơ đổi ô — đúng danh sách viết sẵn, mọi hồ sơ khác giống từng ký tự; 15/15 hồ sơ khối
  nhiều nhóm nói «chưa đọc được». Giá đã biết: crm `bo-dung-khong-ket` và radar `doc-mang-v0` hôm nay đếm đúng nhờ may,
  sau vòng nói «chưa đọc được».
- Không CỘNG: không khoá mới, khuôn khối không đổi.
- **Giới hạn đã khai:** mục giới hạn chỉ là một bảng → «1 giới hạn đã biết» (Ngoài-7); một câu tài liệu về dạng
  «Vì sao: Gốc: …» chưa khớp mã ở ca hiếm (Trong-1) — cả hai 0 hồ sơ thật; tám chỗ yếu của phép đo ở Notes hợp đồng.
- **Ai bị ảnh hưởng:** kho có lộ trình hay trang hồ sơ — hồ sơ có khối giới hạn sai khuôn đổi từ một con số (có thể
  sai) sang «chưa đọc được». **Khi update:** sửa khối giới hạn của hồ sơ cho đọc được là việc của kho. Ngưỡng nghiệm
  thu đọc bằng một lệnh, chạy từ bản kit ở thẻ `v2.28.0`: `node tests/scripts/dai-tom-tat-sau-kho.mjs --hien-tai
  crm=<gốc kho crm>` — bốn số đều 0 là sống.

### Đợt Điều phối – Thợ ở kho tiêu thụ không bị chặn vì danh mục chuyển gói, ghi danh worktree hay việc nền giữ khoá (hồ sơ `dieu-phoi-on-dinh-r2`, hàng DP8, T2, làn V)

Gốc: crm `_acceptance/chuyen-goi-dieu-phoi/` (lượt chấm 1, 12/10, nhánh `chore/chuyen-goi-dieu-phoi` @ `48703713`) và
issue kit #301, phụ lục 12/10 điểm 1, 2, 6, 8 — ba lỗ chặn đợt `r2` của crm (mở ~16/10), cả ba là chỗ gói 2.27.0 hứa
một điều mà vật làm khác trên kho tiêu thụ thật.

- **`xem --kiem-chuyen` tách dòng PHẢI SỬA khỏi dòng LỊCH SỬ** (bảy lớp: khai bởi kho · hồ sơ · eval chết · eval ngoài
  làn máy · executor chết · tài liệu · lộ trình). Dòng phải sửa in như cũ; thêm một dòng tổng «lich-su <n> dòng —
  <lớp> <k> · …»; `--chi-tiet` in từng dòng lịch sử; thoát 1 chỉ khi còn dòng phải sửa. Bắt thêm import tương đối vào
  lõi cũ (`../dieu-phoi/…`): ở crm trước khi gỡ có bốn dòng như thế mà 2.27.0 bỏ sót.
- **Khoá tuỳ chọn `dieu_phoi.lich_su`** trong `_acceptance/config.yaml` — danh sách glob, hoặc `<evals.yaml>#<id>` miễn
  đúng một khối eval (dạng khối hay một dòng). Đo trên crm thật ở đỉnh nhánh chuyển: khai hai mục thì
  `kiem-chuyen: sach`, thoát 0. Kho không khai: hành vi như trước.
- **Lệnh mới `ghi-danh <dãy>`:** phiên thợ chạy từ worktree của chip trước S1 tự ghi worktree vào dãy (gói đợt crm `r2`
  có chỗ giữ `/CHUA-CO-WORKTREE/P<n>`). Bốn hàng từ chối có lời riêng (dãy không có · worktree đã thuộc dãy khác · gốc
  kho chính · không có đợt); nhận đè worktree chết theo đúng chẩn đoán của `tiep-tuc`; ghi đồng thời an toàn nhờ khoá
  `hang-viec.json`. Chẩn đoán và `tiep-tuc` mời mở chip kèm lệnh `ghi-danh` cho dãy chưa ghi danh, thay vì báo
  «worktree mất».
- **Việc nền ngoài dãy** (vd. kiểm chéo) giữ nhịp khoá bằng `chamNhip` hay `giu-nhip.mjs` thì bộ phát lịch thôi báo
  nhầm `khoa-khong-nhip`; luật của dãy không đổi.
- **Giới hạn đã khai:** bộ đọc YAML theo dòng của `kiem-chuyen` còn lọt eval viết flow mapping và danh sách thụt ngang
  khoá cha — báo «sạch» giả (Ngoài-1, 7; hướng đổi khuôn ở hạt giống); chiều đỏ của dạng khai một dòng chỉ có trên kho
  thử (Ngoài-2, 4, 6); ma trận bất biến của `ghi-danh` thiếu hàng `nhan-giang-lai` (Ngoài-14, 15); dòng tổng chỉ được
  kiểm n, tổng k và thứ tự lớp (Ngoài-16); bộ tự kiểm số khối ca bỏ sót `tests/dieu-phoi/loi/` (trong hợp đồng, mức
  thấp). Ba mục ghi hạt giống `docs/plans/2026-10-12-hat-giong-dieu-phoi-sau-on-dinh-r2.md`: `--chi-tiet` cụt 64 KB
  qua ống dẫn, Ngoài-10, khoá chưa che `pha`/`nhat-ky`.
- **Ai bị ảnh hưởng:** chỉ kho cài `dieu-phoi`; kho không có đợt không đổi. **Khi update:** crm khai
  `dieu_phoi.lich_su` khi nâng gói; thợ của đợt `r2` chạy `ghi-danh P<n>` trước S1 (lời mời chip mang sẵn lệnh).
- Phép đo AC-4 đọc `$HOME/dev/crm-onehub` ở hai sha ghim — máy không có bản sao ấy thì hồ sơ này cũng cũ hoá vì môi
  trường («không đọc được ở đây»), như hai hồ sơ ở trên.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI: chép lại MỘT tệp** — `scripts/ho-so-tom-tat.cjs`, từ thẻ `v2.28.0`. Không tệp mới; 24 tệp còn lại
  không đổi byte so với `v2.27.0`.
- **Máy dev: cài `acceptance-gate` và `feature-loop` theo ĐÚNG THẺ ở MỌI phạm vi**, rồi kiểm bộ đệm bằng khối dưới.
- **Kho có lộ trình:** vẽ lại `LO-TRINH.html` một lần trong PR nâng kit (`node scripts/product-map.mjs --root .`) —
  ô vì sao và chưa làm đổi chữ.
- **Kho muốn ô production nói «đã triển khai»:** khai `production.nhanh` (mục X2s); không khai thì như 2.27.
- **Kho chạy đợt Điều phối – Thợ:** nâng gói `dieu-phoi` lên 2.28.0 cùng hai gói kia; khai `dieu_phoi.lich_su`
  cho phần lịch sử của kho (mục DP8) thì `xem --kiem-chuyen` in được `kiem-chuyen: sach`.
- **Kho có bản chép `docDuLieu`:** hàm không đổi byte từ 2.27.0 — chép lại chỉ khi bản chép cũ hơn 2.27.0, và chép
  từ thẻ.

**Cài theo đúng thẻ, không theo `main` — đo 12/10:** trên máy M5, bản cài báo «2.27.0» thật ra là mã `main` `294b29d`
(gộp sau thẻ), không phải thẻ `v2.27.0`. Bộ đệm gói khoá theo SỐ, nên mã `main` cùng số với thẻ làm lệnh cập nhật báo
«already at latest» mà không thay gì. Đường cài là bốn bước của mục A1 trong 2.27.0 (cập nhật marketplace → gỡ → cài
lại ở từng bản ghi → kiểm), với bước kiểm nâng từ «có `agents/`» lên «trọn thư mục cài giống thẻ». Chạy từ một bản
clone kit đã `git fetch --tags`; mỗi dòng in ra phải là `… 2.28.0 khớp v2.28.0`, dòng `LỆCH` là bản ghi chưa xong
(tệp chỉ có ở bộ đệm — rác `.DS_Store`, tệp chưa theo dõi lúc đóng gói — không tính):

```bash
TAG=v2.28.0; T=$(mktemp -d); git archive $TAG | tar -x -C "$T"
claude plugin list --json | node -e '
const fs=require("fs"),cp=require("child_process"),[T,TAG]=process.argv.slice(1);
const d=JSON.parse(fs.readFileSync(0,"utf8"));
const goc={"acceptance-gate@acceptance-gate-kit":"","feature-loop@acceptance-gate-kit":"/feature-loop"};
for(const p of (Array.isArray(d)?d:d.plugins)){if(!(p.id in goc))continue;
 const r=cp.spawnSync("diff",["-rq",T+goc[p.id],p.installPath],{encoding:"utf8"});
 const lech=r.stdout.split("\n").filter(l=>l&&!l.startsWith("Only in "+p.installPath));
 console.log(p.id.split("@")[0],p.scope,p.projectPath||"-",p.version,lech.length?"LỆCH "+TAG+": "+lech.length+" tệp":"khớp "+TAG);}' "$T" "$TAG"
```

(Khối đã thử 12/10 dưới zsh với `TAG=v2.26.0` trên máy cài 2.26.0: sáu bản ghi «khớp»; cùng máy với `TAG=v2.25.0`:
«LỆCH … 39 tệp» và «… 2 tệp» — phân biệt được thẻ đúng với thẻ sai.) Sau đó mở phiên MỚI; dấu hiệu A1 sống của
2.27.0 vẫn áp (lượt chấm đầu không thêm dòng `"kind":"loai-tac-tu-vang"`).

**Ba hồ sơ có thể đỏ khi ghim lại vì MÔI TRƯỜNG, không vì vật của mốc** — ai chạy chiến dịch ghim lại đừng đọc thành lỗi
của 2.28:

- `evals-sat-le-doc-du` (R1): E4 là phép vi phân bảy kho, đọc bản sao các kho tiêu thụ ở `$HOME/dev/<kho>` (crm,
  oneflow, artifact-platform, radar, media-library, map). Máy không có `~/dev/crm` (hay một kho nào trong số đó) thì
  E4 thoát 2 «không đọc được ở đây: <kho>» — nhãn *không đọc được ở đây*, không phải sai hợp đồng.
- `tac-tu-cham-chi-cham-khong` (A1): `rang.sh` đỏ trên node 24.21 ở bước kiểm cú pháp mutant bằng `node --check` —
  của bộ đo trên phiên bản node đó, không phải của tác tử chấm (máy MacBook Pro chạy node 24.15 thì xanh).
- `dieu-phoi-on-dinh-r2` (DP8): AC-4 đọc bản sao crm ở `$HOME/dev/crm-onehub` tại hai sha ghim — máy không có bản sao
  ấy (hay có ở đường khác) thì «không đọc được ở đây».

**crm, theo thứ tự** (crm đang ở 2.26.0 và nhận thẳng 2.28 — mọi ghi chú nhận của 2.27.0 vẫn áp, trừ chỗ dưới đây thay):

1. **Khi nào, ở đâu:** máy Mac Studio — máy duy nhất cài kit vào crm — cài thẳng 2.28.0 từ 15/10 (DP8 đã vào 2.28.0, nên
   không có bản vá 2.28.1 chờ), ở quãng lặng: không lượt S4 nào
   đang chạy. Không đổi engine dưới chân một vòng đang chạy.
2. **Cài theo thẻ:** gỡ rồi cài lại `acceptance-gate` và `feature-loop` ở mọi bản ghi (phạm vi `user`, gốc crm, từng
   cây phụ có phiên); kiểm bằng khối trên — mọi dòng «khớp v2.28.0», `feature-loop` có `agents/`. Không cài từ `main`
   giữa hai thẻ.
3. **Lớp chép CI từ thẻ** (`git archive v2.28.0`): năm tệp của 2.27.0 (`scripts/pre-merge-check.sh`,
   `lib/evidence-core.cjs`, `scripts/product-map.mjs`, `scripts/lo-trinh.mjs`, `scripts/ho-so-tom-tat.cjs`) — tệp
   cuối lấy bản 2.28.0; cộng bảy tệp `tin_hieu` nếu crm khai cửa tín hiệu. Đổi `.github/scripts/phan-loai.mjs` sang
   `--hang-pr` theo mục C1 của 2.27.0.
4. **Khai `production:` + `nhanh: onehub`** trong `_acceptance/config.yaml`, `git fetch origin onehub`, rồi vẽ lại
   `LO-TRINH.html` ở cây có đủ lịch sử. Kiểm: hàng LT1 có ô production «đã triển khai — gộp vào onehub <ngày>;
   chưa ai ghi đã thấy chạy ở production» (đo AC-9 của X2s trên bản sao crm `27d47de04`: ngày 2026-10-10); ô nói
   «chưa đọc được triển khai ở đây — …» là cây thiếu lịch sử hay chưa `git fetch` nhánh.
5. **Bản chép `docDuLieu` lấy từ ĐÚNG thẻ** — `git show v2.28.0:scripts/lo-trinh.mjs` — không từ `main` giữa hai thẻ;
   ghi thẻ nguồn vào chú thích đầu bản chép. Sau đó gộp LT1b (#371) rồi LT2 (#374) theo lộ trình.
6. **Đo trước → sau** (tiền lệ `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`): trên cùng một cây, chạy lưới
   trước-merge và thẻ của các hồ sơ đang mở dưới bản đang cài rồi 2.28.0 — phán quyết từng hồ sơ phải bằng nhau, TRỪ
   chỗ mốc hứa đổi: chữ ô vì sao và chưa làm của dải, ô production (chỉ sau khi khai khoá), hai khối căn cứ trên thẻ
   Cổng Phạm vi của hồ sơ nháp có dòng sổ mang `can_cu`, và mọi thứ 2.27.0 đã hứa đổi. Khác ở chỗ nào khác là tín hiệu.
7. **Đọc ngưỡng ở vòng crm đầu tiên sau khi nhận:** lệnh kiểm sổ bước thiết kế in dòng tổng kết (A2s); Cổng Phạm vi chỉ
   dừng khi «câu hỏi N > 0» hoặc «đỏ K > 0»; `can-cu-s1.cjs --root . --dem` đếm máy-quyết bị lật (A2); bốn số của
   `dai-tom-tat-sau-kho.mjs --hien-tai crm=.` đều 0 (X2s2).
8. **Chuyển sang gói `dieu-phoi`** (đợt thử thứ nhất) theo bước 3 của mục crm trong 2.27.0, trên gói 2.28.0. Gói 2.28.0
   có DP8: khai `dieu_phoi.lich_su` cho phần lịch sử của crm thì `kiem-chuyen: sach` in được ở crm — thay câu «sẽ KHÔNG
   in ở crm» của bước 3.3 trong 2.27.0. Thợ của đợt `r2` chạy `ghi-danh P<n>` trước S1 (lời mời chip mang sẵn lệnh).

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng của từng vòng — đủ ở năm hợp đồng):
`dieu-phoi-on-dinh-r2` 19 · `dai-tom-tat-dem-dung-vi-sao-tron` 10 · `dai-tom-tat-doc-dung` 9 · `can-cu-s1-chay-moi-kho` 8 ·
`buoc-len-thiet-ke-khong-hoi` 5. `docs/research/known-limits-ledger.tsv` có hàng cho DP8 và hai vòng dải tóm tắt (19 · 10 · 9);
A2 và A2s ghi giới hạn ở Notes của hợp đồng, sổ chưa có hàng. Hạt giống mới: `2026-10-11-hat-giong-can-cu-s1-o-kho-khach`
(đã thành A2s) · `2026-10-12-hat-giong-dai-tom-tat-sau-x2s` (mục 1–2 thành X2s2; mục 3 — trường mới cho khối dữ liệu
— để LT1b) · `2026-10-12-hat-giong-dau-doan-gioi-han-khong-hai-cham`.

**Năm dòng số của luật (c)** — năm vòng (giờ VN; nguồn: giờ commit `contract.md`, `usage-report.md`,
`decisions.jsonl`, `run-log.jsonl` của hồ sơ; dòng 1 tính từ commit đặt `implemented` tới commit chữ ký Cổng Bằng
chứng; ba khối token theo khuôn 2.25: chứng-minh-vật = machine+ui+judge+baseline · tìm-lỗi = review+refute · tổng
hợp = triage+capture+synthesize; Cổng Đáng không tính, theo khuôn 2.26):

| Hồ sơ | 1 · làm-xong→quyết-được · lượt chấm | 2 · gọi người trong / ngoài (trần) | 3 · lượt bị hạ tầng đốt | 4 · out-token S4 · vật / tìm-lỗi / tổng hợp % | 5 · phút máy / lượt |
|---|---|---|---|---|---|
| `buoc-len-thiet-ke-khong-hoi` (A2, T3) | 1 g 39 · 2 | 2 / 0 (4); Gate 1.5 không ghi trong hồ sơ | 0 | 84 993 · 58,3 / 12,6 / 29,1 | 29 · 28 = 57 |
| `can-cu-s1-chay-moi-kho` (A2s) | 18 g 46 · 2 (lượt 1 chạy 15 g 52 sau `implemented` — chờ nhánh A2 qua đêm) | 1 / 0 (3) | 0 | 74 481 · 47,6 / 18,0 / 34,4 | 32 · 32 = 64 |
| `dai-tom-tat-doc-dung` (X2s) | 1 g 19 · 2 | 2 / 0 (3) — Cổng Phạm vi ký lại vì CỘNG sau làn V | 0 (+1 ca biên: lượt 1 đỏ ở ba lệnh suite — bản đồ chưa vẽ lại và RT13 bắt chuỗi trạng thái đã ký trong tệp ca của chính vòng; mọi eval máy xanh) | 107 300 · 69,0 / 10,1 / 20,9 | 34 · 32 = 66 |
| `dai-tom-tat-dem-dung-vi-sao-tron` (X2s2) | 8 g 03 · 3 (lượt 1 chạy 3 g 58 sau `implemented`; hồ sơ không ghi vì sao chờ) | 1 / 1 (3); số chạm không ghi | 0 | 239 371 · 59,7 / 13,1 / 27,1 | 38 · 38 · 37 = 112 |
| `dieu-phoi-on-dinh-r2` (DP8, máy M5) | 2 g 42 · 2 (trả lại ở Cổng Bằng chứng sau lượt 1) | 1 / 1 (3) — lượt ký thứ hai ngoài thiết kế | 0 | 170 917 · 25,7 / 21,5 / 52,8 | 49 · 47 = 96 |

Cộng năm vòng: **11 lượt chấm** (0 vòng một lượt; trung vị làm-xong→quyết-được 2 g 42) · **677 062 out-token** trên
11/11 lượt có `usage-report.md` (chứng-minh-vật 51,1 % · tìm-lỗi 15,2 % · tổng hợp 33,7 %) · **≈ 396 phút máy**
(23 748 s) · **9 lượt gọi người** (7 trong thiết kế, 2 ngoài), **0 vòng vượt trần** · hạ tầng đốt **0 lượt chấm**
(+1 ca biên). Phiên chính không đo token. Số chạm: lời ký là một câu gộp ở mọi vòng có ghi; hai lượt gọi ngoài thiết
kế (X2s2, DP8) không ghi số chạm.

**Đọc số:**

- **Hai vòng dài vì chờ nhánh trên, không vì chấm.** A2s chờ 15 g 52 (qua đêm, tới khi ngọn A2 gộp vào nhánh chồng —
  ca KK-8 đỏ tới khi có A2); X2s2 chờ 3 g 58 trước lượt 1 và chấm trên nhánh chồng theo quyết «cắt mốc sớm». Phút
  máy của hai vòng ấy (64, 112) theo số lượt, không theo giờ chờ. Hai trong năm vòng xếp chồng trên vòng chưa gộp.
- **Một lớp lỗi đốt các lượt REJECT của hai vòng dải tóm tắt:** cả ba lượt REJECT (X2s lượt 1, X2s2 lượt 1–2) đều chạm
  tài liệu khối dữ liệu lệch mã — E10 UNCERTAIN hay FAIL, hoặc lỗi trong hợp đồng cùng lớp. Lượt gọi ngoài thiết kế
  duy nhất của cửa sổ là X2s2: dừng-vá sau hai lượt sửa cùng lớp ấy, chủ kho chọn «chấm thêm một lượt».
- **Tìm-lỗi 15,2 % token** (2.27: 17,1 %), chứng-minh-vật 51,1 % (2.27: 53,0 %). DP8 dồn 52,8 % token vào khối tổng
  hợp (bốn vòng kia 27,2 %).
- **A1 vẫn chưa đọc được ở máy MacBook Pro:** 9/9 lượt của bốn vòng chạy ở đó có dòng `loai-tac-tu-vang`; hai lượt DP8
  (máy M5) không có dòng nào. Đọc `claude plugin list` 12/10 trên máy MacBook Pro:
  `feature-loop` ở phạm vi `user`, kho kit và crm đều còn 2.26.0 (không có `agents/`) — nên dòng ấy chưa phải *sai
  hợp đồng* của A1; chỗ cắt mà 2.27.0 đặt ra vẫn chưa có lượt nào để đọc.

**Điều kiện tin cậy:** (i) đường verdict (finder → refute trong hợp đồng → REJECT) không đổi thành phần —
`git diff v2.27.0 <cây mốc> -- feature-loop/workflows/ feature-loop/agents/` rỗng. Không vòng nào đổi đầu vào lượt
chấm: A2/A2s đổi bước thiết kế và thẻ Cổng Phạm vi, X2s/X2s2 đổi dải tóm tắt, DP8 đổi gói `dieu-phoi`.
(ii) Lượt chấm sai do phép-đo-tự-dối giữa hai mốc: **0** phán quyết tới người ký sai. Một ca biên phải đọc: A2s lượt
1 ra PASS trong khi bộ tìm lỗi nêu một phát hiện TRONG hợp đồng đúng lớp phép-đo-tự-dối (ca KK-6 lấy số mong đợi từ
chính bộ xếp mà thẻ gọi — hai vế cùng giảm thì ca vẫn xanh); vòng tự sửa và chấm lại trước khi mời ký. Ngưỡng (a) đếm
**0/2**. Dòng 4–5 cắt được, 5/5 vòng có số.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | = | không mục nào chạm đoạn từ `implemented` tới chữ ký; dải tóm tắt là mặt đọc tiến độ, không phải mặt ký |
| 2 | ↓ ở crm | lựa chọn có căn cứ thôi thành câu hỏi giữa bước thiết kế (đo crm 28/51) — câu chỉ-người-biết dồn về thẻ Cổng Phạm vi đã có; A2s giữ cho Cổng Phạm vi ở crm khỏi dừng oan vì «Cannot find module» đọc thành sổ đỏ. Rủi ro ngược: máy tự quyết sai rồi bị lật ở Cổng Phạm vi — đếm bằng `--dem` |
| 3 | = | không mục nào chạm lượt chấm; CI kit có zsh (trần 5 phút) là việc của kit tự host. Ở crm, đợt `r2` không đứng vì danh mục chuyển gói hay worktree chưa ghi danh (DP8) — đó là giờ đợt, không phải lượt chấm |
| 4 | = / lượt | thành phần lượt không đổi |
| 5 | = / lượt | như trên |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .` (13/10,
đọc trên cây mốc). **N không tăng so với mốc 2.27.0 (vẫn 1) — dòng vô hiệu ở mốc này**,
cấm đọc thành «0 sự cố».

## 2.27.0 — 12/10/2026

Cửa sổ 2.26.0 → 2.27.0 nằm trong **bốn ngày** (09–12/10), có **mười chín vòng được ký** và **một vòng máy thông**
(`tac-tu-cham-chi-cham-khong`, làn V, cửa veto mở) — tập suy từ kho bằng `scripts/rel-cua-so.sh` (AC-4 của hồ sơ
mốc). Mốc này **«đóng gói xong» Điều phối – Thợ**: gộp một lần hai mốc lộ trình 18/10 (DP1, A1, R1) và 25/10 (DP2,
DP3, DP4, DP7, lõi DP6, A3), cộng các hàng đã gộp sớm của mốc 01/11 (G2, G3, X2, S3, L3), C1 và S3b. Kho chờ nhận: `crm` (đợt thử
thứ nhất ~26/10 — chuyển sang gói `dieu-phoi`) và `OneFlow` (đợt thử thứ hai ~27/10 — đo «chạy được mà không sửa
lõi»). Mốc đi **làn V**, không dựng răng mới. Ba gói `acceptance-gate`, `feature-loop`, `dieu-phoi` cùng lên
`2.27.0`; `diagram-design` giữ `2.7.1`. Tag `v2.27.0` gắn sau khi PR mốc gộp.

**Vì sao 2.27.0, không 2.26.1:** một gói mới có số riêng (`dieu-phoi`), ba loại tác tử chấm mới của `feature-loop`,
một skill mới (`gom-tin-hieu`), hai khoá cấu hình mới (`feature_loop.model_carry_cmd`,
`feature_loop.ngoai_n_tu_dinh_tuyen`), một cờ mới của cổng (`--hang-pr`) và khối dữ liệu lộ trình bản 2 — năng lực
mới cho kho tiêu thụ.

**`dieu-phoi` lần đầu có số đúng.** Gói vào `main` ở #295 (10/10) với `plugin.json` ghi `2.26.0`, mà thẻ `v2.26.0`
(`200ce7bb`) không chứa thư mục gói. Bộ đệm gói khoá theo SỐ phiên bản, nên kho đã cài `dieu-phoi` từ `main` giữa
hai mốc thấy «already at latest» với mọi bản cùng số. `2.27.0` là số đầu tiên mà thẻ chứa gói. P200 đòi `dieu-phoi`
cùng số với `acceptance-gate` (từ #295).

**Lớp chép CI 17 → 25 tệp:** ĐỔI `scripts/pre-merge-check.sh` (#323), `lib/evidence-core.cjs` (#292, #299),
`scripts/product-map.mjs` (#307, #319), `scripts/lo-trinh.mjs` (#298, #307, #319); MỚI `scripts/ho-so-tom-tat.cjs` (#307,
cần khi kho khai `lo_trinh.tep`) và bảy tệp chỉ cần khi kho khai `tin_hieu` (#319): `scripts/tin-hieu-khoa.cjs`,
`scripts/tin-hieu.mjs`, `scripts/cat-luot.mjs`, `dieu-phoi/scripts/hinh-dang.mjs`, `dieu-phoi/scripts/cau-hinh.mjs`,
`dieu-phoi/scripts/dot.mjs`, `skills/acceptance/references/tin-hieu-template.md`. Mười ba tệp còn lại không đổi byte.
Diff engine của cửa sổ còn ở: `dieu-phoi/` (mới), `feature-loop/agents/` (mới), `feature-loop/workflows/acceptance-verify.js`,
`feature-loop/scripts/` (làn ghim lại, `trong-dot.mjs`, `dem-dung-lai-model.mjs`, `carry-plan.mjs`, `s4-args.mjs`,
`thuoc-vat.mjs`, `duong-nen.mjs`), `feature-loop/skills/feature-loop/SKILL.md`, `scripts/dinh-tuyen-may.cjs` (mới),
`scripts/gate-card.js`, `scripts/evidence-page.js`, `scripts/start-scan.mjs`, `scripts/plugin-declare.mjs`,
`skills/cat-luot/`, `skills/gom-tin-hieu/` (mới), bảy tài liệu tham chiếu của `skills/acceptance/`, bốn lệnh
`acceptance-card`, `acceptance-init`, `signoff`, `start`.

### Gói `dieu-phoi`: Điều phối – Thợ cài theo kho; mở, tiếp tục, đổi tài khoản bằng một lệnh (bảy hồ sơ, hàng DP1–DP4, lõi DP6, DP7; T2)

Gốc: crm `_acceptance/dieu-phoi-hai-tang` — lõi đợt (bộ phát lịch, CLI, bốn hook; 14 tệp mã, 84 ca) sống trong crm,
mở đợt là sáu bước tay, OneFlow muốn dùng phải chép mã. Ô dù `dieu-phoi-tho-trong-kit` (Cổng Đáng build 09/10).

- **Gói thứ tư của marketplace** (`dieu-phoi-dong-goi-loi`, #295): cài theo kho (`--scope project`) bằng lệnh ở mục
  «Cài cho một kho» của `dieu-phoi/README.md`. Năm khối hook gắn qua `hooks/hooks.json` của gói — kho không sửa `.claude/settings.json`. Kho
  không có đợt: mọi hook thoát 0, không in, không tạo tệp. `acceptance-init` KHÔNG tự bật gói (thẻ
  `bat-theo-lua-chon`). Đợt do bản crm mở chạy tiếp được bằng gói.
- **Mở · xem · đóng đợt một lệnh** (`dieu-phoi-mo-dot-mot-lenh`, #298): `/dieu-phoi:mo-dot`, `/dieu-phoi:xem`,
  `/dieu-phoi:dong-dot` thay sáu bước tay. Đợt có vòng đời (nháp · đang chạy · tạm dừng · đang đóng), đổi được kế
  hoạch giữa chừng, lấy hàng từ lộ trình hay bản phạm vi; khoá S4 cấp máy (hai kho trên một máy không chấm chồng);
  `/acceptance-gate:start` biết đợt; lệnh đếm đợt.
- **Tiếp tục một lệnh** (`dieu-phoi-tiep-tuc-mot-lenh`, #303): `/dieu-phoi:tiep-tuc` sau khi app khởi động lại, hết
  ngữ cảnh hay Monitor hết hạn — nhịp sống của phiên, kế hoạch từng dãy (chip chỉ cho dãy không còn phiên sống),
  nhận vai giám sát, chạy lại bộ phát lịch nếu chết. Chạy lại nhiều lần không sinh bộ phát lịch thứ hai.
- **Đổi tài khoản không mất việc** (`dieu-phoi-doi-tai-khoan`, #312): ngưỡng ở khoá `han_muc` của
  `dieu-phoi.config.json` (không khai → không xét hạn mức); mức dùng vào `han-muc.json` từ mod của gói, `get_usage`
  và dòng trạng thái. Chạm ngưỡng bàn giao: ngừng cấp lượt, thợ commit WIP, `ban-giao.json` dựng từ git. Lệnh thứ
  năm `/dieu-phoi:ban-giao`; tài khoản kia tiếp tục bằng `/dieu-phoi:tiep-tuc`. Lưới cuối: hook `StopFailure` commit
  WIP khi thợ chết vì hạn mức. Răng lớp mod: mod chỉ nghe sự kiện đã khai, không mod nào trả «cho phép» thay người.
- **Chặn S4 đúng lệnh; giám sát thức khi thợ chờ người** (`dieu-phoi-lop-mod`, phần lõi của DP6, #315): hook chặn S4
  đọc cấu trúc lời gọi — nhận lệnh bọc mang cờ (`timeout`, `env -u/-C/-P/-S`, `nice -n`, `time -p`, `nohup`,
  `command`, `exec -a`, `caffeinate`), bỏ qua `node --check`/`-c` và `--help`. Lời chặn nêu sẵn lệnh xin lượt. Hộp
  xin quyền ở phiên thợ luôn thành việc chờ người; sự kiện `cho-nguoi` mang `can_phan`, nên giám sát thức trong
  một nhịp. Phần mod chỉ vẽ (trạng thái đợt trong app) tách sang DP6b, mốc 01/11.
- **Phiên thợ biết mình trong đợt** (`dieu-phoi-feature-loop-trong-dot`, #306): S0 của `/feature-loop` chạy
  `feature-loop/scripts/trong-dot.mjs` (chỉ đọc). Chờ lượt S4 không thành câu hỏi hay vòng thử lại; xong hàng thì tự
  mở hàng kế đã quyết build; quyền tự merge theo thẻ khởi tạo. Kho không có đợt: lệnh không in gì, vòng y như cũ.
- **Năm lỗi chặn đợt thử** (`dieu-phoi-sua-truoc-dot-thu`, #317): chẩn đoán không mời mở chip lần hai cho cùng dãy
  (D4); lời ghi danh không trỏ hàng đã gộp hay dãy nghỉ (D1); đợt mở từ gói chỉ giao hàng đã quyết build (B1); lịch
  30′ của `mo-dot` đọc hạn mức (E2); thẻ khởi tạo thôi hỏi khẩu vị hạn mức (E1). Cùng PR sửa ca DP7-06 neo
  merge-base sống — ca làm `main` đỏ sau #315.
- **Ai bị ảnh hưởng:** chỉ kho CÀI gói. Kho không cài: không đổi gì — S0 của `feature-loop` gọi `trong-dot.mjs` và
  lệnh thoát im khi không có đợt. **Giới hạn đã khai của gói ở `dieu-phoi/README.md` — đọc trước khi chuyển:**
  hộp xin quyền của tác tử Workflow chưa đo là có tới hook chờ người (coi là mù, giữ luật «thợ chờ người thì ghi
  `can-nguoi`» của đợt); `--help` trong chú thích `#`, here-string `<<<`, `env -S'…'` dính cờ, `bash -o pipefail -c`
  làm lệnh S4 thật lọt khoá — giá là hai S4 chạy chồng, không sai kết quả; heredoc nhắc tên script bị chặn kể cả
  khi thân chỉ là dữ liệu (2 trên 46.801 lời gọi). Nghiệm đúng tầng cho lớp «lệnh S4 lọt bộ đọc cú pháp» là hạt
  giống «S4 tự xưng» (script S4 tự lấy khoá lúc khởi, hook thành lưới phụ), mở khi ≥ 1 lượt S4 thật lọt khoá
  trong đợt thử.

### Máy tự định tuyến mục Ngoài-n mà chính nó đề xuất ghi giới hạn hay không sửa (hồ sơ `ngoai-n-tu-dinh-tuyen`, hàng A3, T2)

Gốc: crm `_acceptance/okr-mau-xoa-cau-hinh` — T2, PASS, 0 UNCERTAIN, năm mục Ngoài-n đều đề xuất `known-limits`
mà vẫn phải ký Cổng Bằng chứng. Đợt crm `sau-14-10`: làn V bắn 0/71 hồ sơ, 59 chỉ vì Ngoài-n chưa định tuyến;
người định tuyến trùng đề xuất máy 357/376 (94,9 %). Dự báo trên 71 hồ sơ ấy: làn V 0 → 37, mời ký 71 → 34.

- **Khoá kho `feature_loop.ngoai_n_tu_dinh_tuyen`** — vắng thì như 2.26, không đổi byte nào.
- **Khoá bật:** bên ghi mới `scripts/dinh-tuyen-may.cjs` ghi dòng sổ `gate2` của máy (khoá `may: "dinh-tuyen-ngoai-n"`,
  KHÔNG có `decided_by`) cho mỗi mục Ngoài-n mà máy đề xuất `known-limits` hoặc `wont-fix`, trên hồ sơ đủ điều kiện
  (T2 · verified · PASS · 0 UNCERTAIN · không bypass · triage không hỏng). Mục `new-contract` vẫn hỏi người; dòng người
  luôn thắng dòng máy. Feature Loop gọi bên ghi ở bước PASS của S4, trước vị từ làn V.
- **Thẻ Cổng Bằng chứng** in mục máy đã định tuyến là dòng báo kèm lệnh đảo một dòng
  (`/acceptance-gate:signoff <slug> Ngoài-<n>: mở hợp đồng mới; Ký`); khối «Quyết định CHƯA duyệt» liệt kê chúng.
- **Đếm ngưỡng:** `dinh-tuyen-may.cjs --soat-lech --root <gốc kho>` đếm hồ sơ có dòng máy lệch mục hiện tại. Ngưỡng
  xem lại thiết kế: người đảo > 10 % mục máy định tuyến trong một đợt (đo 11/10: 11/237 ≈ 4,6 %).
- **Giới hạn đã khai, mỗi cái kèm cách né** (hạt giống `docs/plans/2026-10-12-hat-giong-dinh-tuyen-may-sau-luot-2.md`;
  mở ô khi kho đầu tiên bật khoá vấp một trong ba):
  - *Ngoài-1 — dòng thẻ làn V:* trên hồ sơ làn V, dán NGUYÊN dòng câu gộp của thẻ thì thành ký thường (chữ ký người),
    không phải «đi tiếp»; sửa ô cuối thành `kéo lại: <lý do>` rồi dán cả dòng thì nút dừng làn V KHÔNG chạy. Cách né:
    muốn kéo lại thì gõ riêng dòng ngắn `kéo lại: <lý do>`, đừng dán cả dòng thẻ.
  - *Ngoài-4 — dòng máy cũ:* lượt chấm sau đổi đề xuất của cùng mục sang mở-hợp-đồng-mới thì dòng máy «ghi Known
    limits» cũ vẫn đứng, mục đi qua không hỏi người. Cách né: sau mỗi lượt chấm lại, đọc khối «CHƯA duyệt» của thẻ;
    mục nào đề xuất nay là mở hợp đồng mới thì gõ lệnh đảo một dòng của mục đó.
  - *Ngoài-5 — `--soat-lech` với `--root` sai:* báo «0 hồ sơ có dòng máy lệch mục» y như kho sạch. Cách né: luôn chạy
    từ gốc kho với `--root .`.
- **Ai bị ảnh hưởng:** chỉ kho bật khoá. **Khi update:** không gì; bật khoá là lựa chọn của kho — đọc ba giới hạn trên
  trước khi bật.

### Bỏ job nặng cho PR không chạm vật — `pre-merge-check.sh --hang-pr` (hồ sơ `ci-cua-kho-bo-job-nang`, hàng C1, T3)

Gốc: crm `giam-phut-acceptance` — 09/10 GitHub dừng mọi job vì vượt mức chi; 30 % phút Actions của crm là test sản
phẩm trên PR không đổi mã (17 % PR chỉ T1, 12,5 % PR chỉ hồ sơ).

- Cờ mới `--hang-pr` của cổng: in `hang` · `cham_vat` · `ly_do` ra stdout và `$GITHUB_OUTPUT`, một dòng
  `$GITHUB_STEP_SUMMARY`, thoát 0. Dùng chính bộ khớp và chính `t1_skip_globs`/`t3_paths` của kho; nghi ngờ thì
  `cham_vat=true`. GUIDE §5.3 có đoạn workflow mẫu (điều kiện `!cancelled() && … != 'false'`).
- Ai bị ảnh hưởng: kho không truyền cờ — cổng không đổi (từng byte; mọi dòng mới nằm trong vùng marker `HANG-PR`,
  `glob_variants`/`match_globs` giữ nguyên tên và thân).
- **Hai lỗ thừa hưởng từ bộ khớp của cổng** (cờ mới không sinh ra chúng): PR chỉ đổi tên mã vào vùng T1, hay chỉ sửa
  tệp dưới một `_acceptance/` lồng (fixture test), được `--hang-pr` cho `cham_vat=false`. Chốt chặn: lượt test đủ
  trên `push` vào nhánh chính.
- **Nhận mốc ở crm:** thay khối `sed` của `.github/scripts/phan-loai.mjs` (rút `glob_variants`/`match_globs` khỏi
  `pre-merge-check.sh`) bằng bước `bash scripts/pre-merge-check.sh . ${GITHUB_BASE_REF:+--base "origin/$GITHUB_BASE_REF"}
  --hang-pr` (bản chép của lớp CI). Giữ job `check` chạy (oxlint quét `_acceptance/**/rang/*.mjs`), chỉ gắn job
  `test` vào bit. Điều kiện `if:` của job `test` PHẢI là `!cancelled() && needs.hang-pr.outputs.cham_vat != 'false'`:
  thiếu `!cancelled()` thì job `hang-pr` đỏ làm `test` bị bỏ qua mà vẫn báo «Success». Giữ lượt test đủ trên `push`.

### Cửa tín hiệu của kho, gom nhóm theo kết quả (hồ sơ `cua-tin-hieu-gom-nhom`, hàng L3, T2)

Gốc: crm — chủ kho gom tay mục «Hạng mục cùng lớp» (10/238 hồ sơ, không phân hoạch: F11 ở hai cụm); người không dùng
git không có cửa gửi; không gì nói một ý đã được việc đã giao phủ.

- **Một khuôn tín hiệu** chung với kênh yêu cầu của gói Điều phối (tín hiệu người gửi và phát sinh của thợ qua cùng
  phép kiểm hình dạng `kiemYeuCau`); ổ cắm `tin_hieu.nguon` + `tin_hieu.gom` trong `_acceptance/config.yaml`.
- **Skill mới `gom-tin-hieu`:** phiên gom tín hiệu theo trục kết quả thành bản gom — cũng là bản phạm vi của cắt lượt.
- **Răng phủ chỉ đọc** `scripts/tin-hieu.mjs`: mỗi tín hiệu ở đúng một chỗ — một nhóm, lẻ kèm lý do, hoặc đã phủ bởi
  việc đã giao.
- **Đường đi về người gửi:** tín hiệu → nhóm → hàng → hồ sơ; khối `lo-trinh-du-lieu` mang thêm khoá tuỳ chọn
  `tin_hieu` khi kho khai cửa (kho không khai: khối giống từng byte, `phien_ban` không đổi).
- **Giới hạn đã khai:** chất lượng gom của skill KHÔNG có bằng chứng máy — trên bộ vàng 20 tín hiệu giả từ 10 hồ sơ
  crm, tác tử tươi chỉ cầm SKILL khớp đáp án 15/20 (hai lượt liền lệch đúng bảy chỗ như nhau). Đo thật ở Cổng Giá trị:
  lượt gom đầu tiên trên tín hiệu thật của crm, ngưỡng chủ kho sửa dưới 1/5 số nhóm.
- **Ai bị ảnh hưởng:** kho khai `tin_hieu`. Kho không khai: không đổi gì — bản đồ nạp ổ cắm khoan dung.
- **Khi update:** kho khai `tin_hieu` chép thêm bảy tệp lớp CI (INIT-CI-COPY-LIST): `scripts/tin-hieu-khoa.cjs`,
  `scripts/tin-hieu.mjs`, `scripts/cat-luot.mjs`, `dieu-phoi/scripts/hinh-dang.mjs`, `dieu-phoi/scripts/cau-hinh.mjs`,
  `dieu-phoi/scripts/dot.mjs`, `skills/acceptance/references/tin-hieu-template.md` — khai mà thiếu thì bước bản đồ đỏ to.

### Lộ trình chỉ chứa việc phát triển — việc vận hành thành mốc ngoài, dữ liệu giả có nhãn (hồ sơ `lo-trinh-chi-viec-phat-trien`, hàng S3b, T2)

Gốc: crm `khung-okr-truoc-r1` — lộ trình OKR 11/16 mốc là việc vận hành của người; lộ trình Kho tài liệu
có hàng phát triển đứng chờ hàng vận hành `ct`.

- Skill cắt lượt có bước 2b (khối `CAT-LUOT-VAN-HANH`): xếp từng mã thành phát triển · vận hành một lần ·
  vận hành lặp lại trước sáu luật. Việc vận hành thành **mốc ngoài** (`moc` có `loai: "ngoai"`, `ai`, `dot`,
  `phu`) — chỗ thứ ba của bảng phủ (`<mã> → mốc ngoài <nhãn>`). Luật 2 nói rõ: «dữ liệu thật của hàng
  trước» là kết quả vòng trước đã giao; `dung_tren` chỉ trỏ hàng.
- Răng `cat-luot.mjs` thêm bốn cờ: `cho-van-hanh` (hàng đứng trên một mốc ngoài) · `du-lieu-sai-gia-tri`
  · `thieu-hang-sinh-gia` (hàng `du_lieu: "gia"` không đứng trực tiếp trên hàng `du_lieu: "sinh-gia"`) —
  đỏ trong đợt, gom vàng ngoài đợt; `van-hanh-lap-chua-tu-phuc-vu` (mốc ngoài `lap: true` chưa có
  `tu_phuc_vu`) — vàng. Mốc của đợt mang mã mà không phải mốc ngoài, hay thiếu `ai`, là lỗi.
- Hai mục treo của S3: SKILL phân hai loại dòng `cảnh báo:` (khối `CAT-LUOT-CANH-BAO` — của đợt thì xử
  lý hoặc ghi lý do; ngoài đợt thì chép vào PR) và nói khoảng cỡ là chính sách của kit theo bản phát
  hành (kho tiêu thụ không sửa khối, dán số đo của đồng hồ cỡ vào PR và báo chủ kit).
- Khuôn lộ trình và khuôn bản phạm vi có mẫu mốc ngoài lặp lại, hàng sinh dữ liệu giả, hàng dùng nó.

**Ai bị ảnh hưởng:** kho có lộ trình (crm). Lộ trình cũ đọc như cũ — đo trên kit + ba bản chụp crm/oneflow:
cùng mã thoát, 0 dòng mới. Trang lộ trình và khối dữ liệu không đổi.
**Khi update:** lượt cắt kế của crm (OKR, Kho tài liệu) đặt việc vận hành vào mốc ngoài; hàng cần dữ liệu
thật thì có hàng sinh dữ liệu giả đứng trước. Đó cũng là lần đọc ngưỡng của vòng (Cổng Giá trị).

### Làn ghim lại dùng lại eval model thật khi đầu vào không đổi (hồ sơ `eval-goi-model-that-khong-chay`, hàng G3, T2)

Gốc: crm `eval-model-that-dung-luc` — «bộ nhớ đệm theo băm cho mọi eval model thật (bộ kit)»; đo 11/10:
14/44 lần chạy lại eval model trong làn ghim lại có đầu vào không đổi, 15 làn gọi model tốn 15,67 USD/4 ngày.

- Khoá mới `feature_loop.model_carry_cmd` (lệnh in dấu vân tay môi trường model: id model nhà cung cấp trả,
  băm khoá gói). **Khoá vắng = như 2.26**: không băm, không khoá mới trong dòng pin (trường `tong_ket.model_carry` có từ 2.23 và vẫn bằng 0), không dòng stderr mới.
- Khoá bật: mỗi eval trong `model_evals` được băm năm lớp đầu vào (lệnh đã giải · tệp khớp `paths` · cây
  hồ sơ · tệp lệnh gọi tên · dấu vân tay). Cùng băm với lượt eval thật sự chạy gần nhất (≤ 7 ngày) → KHÔNG
  gọi model; dòng `repin` mang `evals_hash`, `evals_carry`; section và stderr nói ra nguồn; tổng kết đếm
  `carry`. Cùng băm mà mã khác → `carry_lech`, eval thôi dùng lại tới khi băm đổi. Cờ `--chay-lai-model` ép
  chạy thật.
- Script đếm mới `feature-loop/scripts/dem-dung-lai-model.mjs` (đường đo + bốn giới hạn kèm ngưỡng, GUIDE §7.1).
- Bên đọc pin (`lib/`, `pre-merge-check.sh`, `recheck-evidence.cjs`) KHÔNG đổi — kho tiêu thụ không chép lại
  lớp CI cho mục này.
- **Nhận mốc ở crm:** cập nhật plugin feature-loop, thêm `model_carry_cmd` (lệnh dò id model Gateway + băm
  `bun.lock`); lượt ghim lại đầu tiên sau khi bật chạy trọn.

### Trang hồ sơ một việc + khối dữ liệu lộ trình bản 2 (hồ sơ `trang-ho-so-mot-viec`, hàng X2, T2)

Gốc: crm `trang-lo-trinh-trong-crm` — mục ngoài hợp đồng «hiện hồ sơ nghiệm thu của việc».

- `evidence-page.js` vẽ trang hồ sơ: dải một phút chín ô + dòng số cho chủ kho, rồi mục gập (vì sao · đã hứa
  · thiết kế · quyết định lọc máy/người · bằng chứng · tài nguyên · giới hạn · giao · giá trị). Phần trang
  bằng chứng cũ giữ nguyên thành mục «Bằng chứng». Không gọi model; hồ sơ thiếu tệp ra ô «chưa có — <tệp>».
- Khối `lo-trinh-du-lieu` lên phiên bản 2: khoá `hang.tom_tat` (cùng dải, cùng hàm với trang). Bộ đọc
  `docDuLieu` đọc cả trang bản 1 (một cờ vàng «khuôn bản 1»); bộ đọc bản 1 kho đang chép vẫn đọc bản 2
  («đọc phần biết»). Khối không mang số PR (chỉ có sau khi gộp) và không mang «số lần gọi người».
- Câu giao in ra (trang lộ trình, khối, thẻ khởi động, ô cơ hội mở từ hàng, trang hồ sơ) bỏ đúng một cặp
  «» bao trọn câu; «» bên trong câu giữ nguyên; tệp kế hoạch không bị ghi. Khuôn mẫu hàng thôi bọc «».
- Ai bị ảnh hưởng: kho khai lộ trình — `LO-TRINH.html` vẽ lại đổi chữ câu giao và khối; bản chiếu đọc khối
  nên chép lại `docDuLieu` khi muốn đọc `tom_tat`. Hồ sơ đã ký mang ca so «giống bộ máy trước» của trang lộ
  trình phải ghim lại ở chiến dịch phát hành.
- **Nhận mốc ở crm: chép lại `docDuLieu`** từ `scripts/lo-trinh.mjs` (crm đang giữ bản chép nguyên văn
  bản 1 — LT1 AC-9). Hàm đổi trong mốc này: biết `phien_ban` 2 (khoá `tom_tat`), báo cờ vàng «khuôn bản 1»
  khi đọc trang cũ. Bản cũ vẫn đọc trang mới «phần biết» + một cảnh báo, nên không vỡ nếu chưa chép kịp.
  Gói Điều phối (`dieu-phoi/scripts/nguon-hang.mjs`) cũng giữ bản chép bản 1 — chép lại khi cần `tom_tat`.
- Kho chép bộ máy cho CI (danh sách `INIT-CI-COPY-LIST`, nay 18 tệp) và khai `lo_trinh.tep` phải chép thêm
  `scripts/ho-so-tom-tat.cjs` — thiếu thì bước bản đồ đỏ to `MODULE_NOT_FOUND`, không im lặng.

### Cắt lượt nói ra vòng nào phải tách, gộp được, hay sai dáng câu giao (hồ sơ `vong-la-mot-ket-qua`, T2)

Gốc: hàng S3 lộ trình kit, chính sách chủ kho chốt 10/10 — một vòng một kết quả, mục tiêu 8–10 tiêu chí,
cho phép 11–12, từ 13 phải tách; câu giao hai dáng. Số đo nền trên crm: khoảng 8–12 chạm trần 3 lượt
chấm 27 %, nhóm từ 13 tiêu chí 62 %.

- **Khoảng cỡ là chính sách một khối** (`CAT-LUOT-CO` trong skill cắt lượt) — răng đọc thẳng khối ấy,
  không số nào nằm trong mã; đổi chính sách là sửa năm dòng.
- **Tám cờ có tên** khi cắt lượt: `can-tach` · `tieu-chi-sai-kieu` · `vai-khong-mo-cau` ·
  `nen-thieu-bat-khi` (chặn, ở hàng trong đợt) và `tren-muc-tieu` · `duoi-muc-tieu` (kèm hàng gộp được
  cùng nhóm) · `chua-uoc-tieu-chi` · `chua-khai-dang-giao` (vàng). Hai trường mới của lượt cắt: `vai`
  (tên vai, hoặc `nen` cho việc nền) và `tieu_chi` (cỡ dự kiến) — agent và trang lộ trình không đọc.
- **Đồng hồ cỡ** `cat-luot.mjs --co [--tu <ngày>] [--lo-trinh <tệp>]`: bảng cỡ → lượt chấm → chạm trần từ
  hồ sơ đã giao, tỉ lệ cỡ tính trên mọi vòng đã chốt, so cỡ khai lúc cắt với hợp đồng thật. Chỉ đọc.
- **Kho tiêu thụ không phải làm gì:** lộ trình cắt trước bản này (crm hai tệp) vẫn ra đúng mã thoát và
  dòng cũ, chỉ thêm một dòng vàng gom mỗi cờ cho hàng ngoài đợt; trang lộ trình không đổi một byte. Lượt
  cắt kế ghi `vai` + `tieu_chi` theo skill.
- Giới hạn: luật cỡ chưa vào bước thiết kế của Feature Loop (vẫn ghi 5–15) — vòng mở ngoài lộ trình chưa
  có răng cỡ.

### Tệp tiêu chí viết sát lề được đọc đủ (hồ sơ `evals-sat-le-doc-du`, T3)

Gốc: crm `dieu-phoi-va-bien`, 07/10 — phiên phải viết lại 309 dòng `evals.yaml` từ kiểu sát lề sang
thụt 4 «để bộ đọc của kit thấy inputs và paths». Kiểu sát lề (`- id:` ở cột 0, mục danh sách cùng cột
với khoá) là YAML hợp lệ và là kiểu bộ xuất YAML viết mặc định.

- **Một bộ đọc danh sách** (`evalListsOf` ở `lib/evidence-core.cjs`) cho lượt chấm, lượt sửa và làn
  ghim lại. Trước đây lượt chấm đánh rơi IM LẶNG đầu vào của hội đồng, vùng tệp và danh sách bằng
  chứng của tệp sát lề; lượt sửa bỏ mọi `paths` viết dạng nhiều dòng; bộ đọc vùng tệp đọc tên neo
  YAML (`&id001`) thành một vùng tệp.
- **Cờ vàng có tên** khi trường danh sách viết kiểu kit không đọc (bí danh `*ten`, khối chữ, ánh xạ,
  `[` không đóng, khoá trống): một dòng ở lượt chấm và một cờ trên thẻ Cổng Phạm vi lẫn Cổng Bằng chứng.
- **Ai bị ảnh hưởng:** kho viết thụt 4 — không gì (so trên 621 hồ sơ ở bảy kho: 0 lệch). crm — lượt
  sửa nay giữ ô xanh cho `paths` dạng nhiều dòng (393 chỗ khai), nên mỗi lượt sửa chạy lại ít lệnh
  hơn; hồ sơ do bộ xuất YAML sinh có bí danh sẽ thấy cờ và cần viết lại trường ấy.
- **Làm gì khi nâng:** không gì.

### Mục `paths` thoát ngoặc (`[[]slug]`) được hiểu đúng (hồ sơ `glob-thoat-ngoac`, T3)

Gốc: crm `dien-thoai-ca-nhan`, 09/10. Ghim lại gắn `evals_not_machine_touched` cho bốn ô ui-check có `paths`
`apps/app/app/(app)/[[]slug]/contacts/**` dù diff không chạm `apps/`.

- **Hai bộ dịch glob** (`pathGlobToRe` của lib, `globToRe` của `carry-plan`) nhận hai thành ngữ thoát của
  fast-glob/bash: `[[]` là dấu `[` thật, `[]]` là dấu `]` thật. Mục mang thành ngữ đi nhánh glob của bộ phân
  loại kể cả khi không có `*`, và vẫn phải trỏ tới tệp có thật.
- Hệ quả, ba nơi cùng hưởng: làn ghim lại thôi gắn oan; lưới hoá cũ (`stale_scope: paths`) lọc đúng thay vì
  rơi về luật cũ; kế hoạch mang sang của S4 **thôi mang sang eval mà tệp của nó vừa đổi** (trước đây xanh giả).
- Ai bị ảnh hưởng: kho viết `paths` dạng thoát ngoặc. `[slug]` trần giữ nghĩa đen như cũ — không đổi gì cho kho
  viết dạng đó. Không cần làm gì khi cập nhật; hồ sơ từng bị gắn oan thì lượt ghim kế tự hết.

### Làn đối chứng S4 có trần, bỏ qua eval mới, tự dọn (hồ sơ `baseline-tran-bo-qua-don`, T2)

Gốc: crm `_acceptance/khung-ban-ghi-kara`, 07/10 — lượt `wf_f425c910-a3b` giữ khoá s4 5 giờ, không ra
báo cáo, để lại worktree tạm. Truy nguyên: tác tử baseline tự chế vòng `bash -c "…$c"`; kiểm tra an toàn
của Claude Code hỏi người cho script nó không đọc được — kể cả ở bypassPermissions — và không ai trả lời
suốt đêm. Lệnh không treo. Tám lệnh đầu còn đo tệp kiểm chưa có ở merge-base.

- **Tác tử baseline chỉ chạy MỘT lệnh do kit sinh**, chép nguyên văn: worktree cô lập, trần 180 giây mỗi
  lệnh (dừng cả cây tiến trình) và trần tổng 480 giây (dưới trần 600 giây của công cụ). Lệnh không có
  `eval`, `bash -c "$biến"`, `rm`, `rmdir` — những hình dạng kích hộp xin quyền.
- **Mã thoát baseline do máy đọc** từ dòng dấu `__BL …`, không từ lời khai của tác tử. Lane không về trọn
  (tác tử chết, bị dừng, đầu ra cụt, worktree không dựng được) → BLOCKED hạ tầng có tên cho làn đối chứng:
  mọi lệnh `n-a` kèm lý do, **lượt chấm vẫn ra báo cáo**, và không ghi dòng `kind:"baseline"` nên round
  sau đo lại.
- **Eval trỏ tệp chưa có ở merge-base được bỏ qua**, lý do vào section `## Analyst` («Baseline khong do»).
- **Worktree tạm tự dọn** khi bị dừng (trap) và lượt sau quét worktree `agk-baseline*` mồ côi của lượt bị
  giết cứng — trừ lượt còn sống (pid trong lý do khoá `git worktree lock`).
- Ai bị ảnh hưởng: mọi kho chạy S4. Không cần làm gì khi cập nhật; tác tử/harness đời cũ không trả
  `dauRa` thì đọc như 2.24.0, có cờ vàng.

### Tác tử chấm không cầm bút (hồ sơ `tac-tu-cham-chi-cham-khong`, hàng A1, T2, làn V)

Gốc: crm `_acceptance/loi-vao-dieu-phoi-30-ngay` (ba lượt trong một ngày) và chính kit 07/10 — `luot-sua-giu-du-dem-dung`
lượt 1: tác tử chấm sửa mã, commit ba lần, lượt vô hiệu, ~4,6M token. Harness Workflow chép câu người gần nhất vào
đề bài mọi tác tử chấm; kit không tắt được cơ chế ấy.

- Ba loại tác tử của gói `feature-loop`: `cham-doc` (Read, Grep, Glob) cho judge · triage · synthesize;
  `cham-lenh` (Bash, Read, Grep, Glob) cho machine · baseline · finder · refute · provenance; `cham-ui` (cấm Edit,
  Write, NotebookEdit) cho ui. Đề bài gửi tác tử không đổi một byte — chỉ thêm `opts.agentType`.
- Bản cài thiếu loại tác tử (harness báo «not found»): lời gọi đó chạy lại một lần không `agentType`, mọi lời gọi
  sau của lượt đi thẳng — lượt chấm vẫn chạy như 2.26.
- Tác tử vẫn ghi được vào cây qua shell (`sed -i`): bước sau-lượt quy cây đổi cho tác tử đã ghi và ghi dòng đếm.
  Máy không tự đổi cây — hoàn lại là việc của phiên.
- **Chưa chạy sống lần nào trước mốc này:** 32 lượt chấm của 14 hồ sơ trong cửa sổ ghi `loai-tac-tu-vang` — bản
  cài `feature-loop` 2.26.0 không có `agents/`, nên mọi lượt đi đường rơi. 2.27.0 là số đầu tiên mang ba loại tác tử.
- **Ai bị ảnh hưởng:** mọi kho chạy S4. Bản cài cũ vẫn chấm được (đường rơi ở trên), chỉ là vai chấm còn cầm bút.
- **Khi update — đường đã dẫm, không chỉ «cài lại»:** lệnh cập nhật plugin hay báo «already at latest» mà bộ đệm
  vẫn giữ bản cũ (bộ đệm khoá theo số, và lệnh cập nhật mặc định chỉ chạm phạm vi `user`). Làm đủ bốn bước:
  1. `claude plugin marketplace update acceptance-gate-kit`.
  2. Ở MỖI bản ghi — phạm vi `user`, và với `project` thì `cd` vào gốc kho rồi từng cây phụ có phiên:
     `claude plugin uninstall feature-loop@acceptance-gate-kit --scope <phạm vi>` rồi cài lại `feature-loop` cùng phạm
     vi — lệnh cài là lệnh của khối khai plugin ở GUIDE §5.1, thêm `--scope <phạm vi>`.
  3. Kiểm bộ đệm bằng một lệnh đọc được — mỗi dòng in ra phải là `… 2.27.0 cham-doc.md,cham-lenh.md,cham-ui.md`;
     dòng nào còn `THIẾU agents/` là bản ghi đó chưa xong:

     ```bash
     claude plugin list --json | node -e 'const fs=require("fs");const d=JSON.parse(fs.readFileSync(0,"utf8"));for(const p of (Array.isArray(d)?d:d.plugins)){if(p.id!=="feature-loop@acceptance-gate-kit")continue;const a=p.installPath+"/agents";console.log(p.scope,p.projectPath||"-",p.version,fs.existsSync(a)?fs.readdirSync(a).join(","):"THIẾU agents/")}'
     ```

  4. **Dấu hiệu A1 sống:** mở phiên MỚI (phiên đang chạy giữ bản đã nạp lúc khởi động); lượt chấm đầu tiên sau đó
     không ghi thêm dòng `"kind":"loai-tac-tu-vang"` vào `run-log.jsonl` của hồ sơ — đếm bằng
     `grep -c '"kind":"loai-tac-tu-vang"' _acceptance/<slug>/run-log.jsonl` trước và sau lượt. Số còn tăng sau khi
     bước 3 đã sạch là *sai hợp đồng* của A1 — báo chủ kit.

### Tên ca chập chờn đọc được qua tiền tố turbo (hồ sơ `ten-ca-qua-tien-to-turbo`, hàng G2, T2)

Gốc: crm `_acceptance/tro-ly-okr-bo-final-output` — dòng `repin` 07/10 mang `chap_chon` với `"ca": ["không rút được
tên ca"]`. Chạy qua turbo không TTY, mọi dòng con mang tiền tố `<gói>:<tác vụ>: `, nên năm khuôn neo đầu dòng không
khớp và lời hứa «gọi tên ca chập chờn» rỗng ở mọi kho dùng turbo.

- Làn ghim lại bỏ tiền tố của bộ chạy monorepo trước khi rút tên ca; dòng pin `chap_chon` gọi đúng tên ca. Dạng
  đầu ra chưa thấy ở kho thật nào vẫn để ngoài, mỗi dạng có ngưỡng mở lại.
- Ai bị ảnh hưởng: kho bật `feature_loop.repin_retry` và chạy suite qua turbo (crm). Không cần làm gì.

### Thẻ cổng và JSON làn đỏ không còn bị cắt ở 64 KB (hồ sơ `xa-stdout-truoc-khi-thoat`, T2)

Gốc: làn ghim lại của DP4 đỏ ở ca P161 (UnicodeDecodeError ở byte 65 534) — thẻ Cổng 1 dài 65 932 byte,
`gate-card.js` ghi trọn thẻ rồi `process.exit(0)` ngay, stdout qua ống dẫn chỉ giao 65 536 byte.

- `gate-card.js` (thẻ và JSON trích) và `repin-lane.mjs` (JSON làn đỏ) thoát trong callback của lần ghi; vòng quét
  cả lớp «ghi lớn rồi thoát ngay» trong bốn thư mục mã.
- Ai bị ảnh hưởng: mọi kho có thẻ hay JSON làn đỏ dài hơn 64 KB đọc qua ống dẫn. Không cần làm gì.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI: chép lại bốn tệp và THÊM một** — `scripts/pre-merge-check.sh`, `lib/evidence-core.cjs`,
  `scripts/product-map.mjs`, `scripts/lo-trinh.mjs`, cộng `scripts/ho-so-tom-tat.cjs` mới (theo INIT-CI-COPY-LIST của
  `acceptance-init`, nay 25 tệp). Kho khai `lo_trinh.tep` mà thiếu tệp mới thì bước bản đồ đỏ to `MODULE_NOT_FOUND`,
  không im lặng. Kho khai `tin_hieu` chép thêm bảy tệp của mục L3.
- **Máy dev:** cài lại `acceptance-gate` và `feature-loop` ở MỌI phạm vi trên mỗi máy có phiên của kho theo bốn bước
  ở mục «Tác tử chấm không cầm bút» (cập nhật marketplace → gỡ → cài → kiểm `agents/`) — `update` một mình hay
  để bộ đệm cũ. `feature-loop` 2.27.0 là bản đầu tiên mang `agents/`.
- **Kho khai `lo_trinh.tep`:** vẽ lại `LO-TRINH.html` một lần trong PR nâng kit (`node scripts/product-map.mjs
  --root .`) — khối dữ liệu lên bản 2, câu giao in ra bỏ một cặp «» bao trọn câu.
- **Kho có bản chiếu đọc khối lộ trình:** chép lại `docDuLieu` từ `scripts/lo-trinh.mjs` khi cần `tom_tat`; bản
  chép cũ vẫn đọc bản 2 «phần biết» kèm một cảnh báo.
- **Kho muốn dùng lại eval model thật:** khai `feature_loop.model_carry_cmd`; không khai thì như 2.26.
- **Kho muốn máy tự định tuyến Ngoài-n:** bật `feature_loop.ngoai_n_tu_dinh_tuyen` sau khi đọc ba giới hạn ở mục A3;
  không bật thì không đổi byte nào.
- **Kho trả tiền phút Actions:** gắn job test nặng vào bit `cham_vat` của `pre-merge-check.sh --hang-pr` theo mẫu
  GUIDE §5.3 (mục C1); không gọi cờ thì cổng không đổi.
- **Kho chạy đợt Điều phối – Thợ:** cài `dieu-phoi` theo `dieu-phoi/README.md` mục «Chuyển từ bản lõi chép tay».
  Kho chưa chạy đợt: không cài gói này.

**crm, theo thứ tự** (nếu crm chưa nhận 2.26.0 thì mọi ghi chú nhận của 2.26.0 và 2.25.0 vẫn áp):

1. **Khi nào cài:** ở quãng lặng trước đợt thử thứ nhất (~26/10) — không lượt S4 nào đang chạy. Không đổi engine
   dưới chân một vòng đang chạy.
2. Chép năm tệp lớp CI ở trên; cài lại plugin gốc và mọi cây phụ theo bốn bước của A1 (gỡ rồi cài, kiểm
   `agents/`); vẽ lại `LO-TRINH.html`; chép lại `docDuLieu`
   (LT1 giữ bản chép bản 1); khai `model_carry_cmd` (lệnh dò id model Gateway + băm `bun.lock`) — lượt ghim lại đầu
   tiên sau khi bật chạy trọn. Thay khối `sed` của `.github/scripts/phan-loai.mjs` bằng bước `--hang-pr` theo đúng mục
   C1 (giữ job `check`, `if:` có `!cancelled() &&`, giữ lượt test đủ trên `push`). Bật khoá A3 hay chưa là quyết của
   crm: dự báo trên 71 hồ sơ đợt `sau-14-10` là làn V 0 → 37 — bật thì đọc ba giới hạn ở mục A3 trước.
3. **Chuyển sang gói `dieu-phoi`:**
   1. Cài `dieu-phoi` theo `dieu-phoi/README.md` (mục «Cài cho một kho») ở cây gốc và từng cây phụ có phiên. Báo
      «already at latest» mà `claude plugin list --json` vẫn ghi `2.26.0` (bản cài từ `main` giữa hai mốc) thì
      `claude plugin uninstall dieu-phoi@acceptance-gate-kit --scope project` rồi cài lại; kiểm từng bản ghi.
   2. Đợt đang mở bằng bản crm: dừng bộ phát lịch bản cũ trước (`node scripts/dieu-phoi/dieu-phoi.mjs dung`), chuyển
      xong thì `node "$GOI/scripts/dieu-phoi.mjs" chay` để chép lõi của gói vào `<thư mục đợt>/loi/`.
   3. `node "$GOI/scripts/dieu-phoi.mjs" xem --kiem-chuyen`, gỡ các dòng nó in thuộc nhóm **đang chạy** — bốn khối
      hook tự chép trong `.claude/settings.json` (PreToolUse chặn S4, PostToolUse nhịp, Notification và
      UserPromptSubmit chờ người), `.githooks/gate-shape.json`, `package.json`, eval của hồ sơ đang mở, `LUAT.md` của
      đợt đang chạy — rồi gỡ thư mục `scripts/dieu-phoi/` (lệnh không liệt kê chính thư mục bản cũ). Đo trên crm
      12/10: 670 dòng, chỉ 7 dòng thuộc nhóm đang chạy (settings 4, hook git 2, `package.json` 1); 663 dòng còn lại nằm
      trong `_acceptance/` (533) và `docs/` (130) — bản ghi lịch sử, để nguyên (sửa là làm hồ sơ đã ký hoá cũ). Vì
      thế `kiem-chuyen: sach` sẽ KHÔNG in ở crm; điểm dừng là hết dòng thuộc nhóm đang chạy. Gỡ và cài nằm trong
      CÙNG một PR.
   4. **Kiểm hook `cho-nguoi` của gói không bắn đôi với bản crm tự chép:** khối hook cũ mở đầu bằng `[ -f
      "$CLAUDE_PROJECT_DIR/scripts/dieu-phoi/…" ] || exit 0` nên im hẳn khi thư mục bản cũ đã gỡ. Không bắn
      đôi = `kiem-chuyen` không còn dòng nào ở `.claude/settings*.json` + `scripts/dieu-phoi/` không còn + `xem` không in
      dòng cảnh báo hook bản cũ. Trong khoảng
      đã cài mà chưa gỡ, mỗi `Notification` chạy hai bản `hook-cho-nguoi` ghi đè cùng tệp chờ người.
   5. **Giữ luật 52** của crm (thợ chờ người — kể cả chờ hộp quyền trong lượt chấm — tự ghi `can-nguoi`) trong phần
      riêng của đợt (`LUAT-rieng.md` khi mở bằng `/dieu-phoi:mo-dot`) — khuôn `LUAT.md` của gói chưa mang luật này,
      và hộp quyền của tác tử Workflow chưa đo là có tới hook chờ người.
4. **Đo trước → sau trên crm** (tiền lệ `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`): trên cùng một cây,
   chạy lưới trước-merge và thẻ của các hồ sơ đang mở dưới bản đang cài rồi 2.27.0 — phán quyết từng hồ sơ phải bằng
   nhau, TRỪ chỗ mốc hứa đổi: cờ vàng cho trường danh sách viết kiểu kit không đọc (R1), `paths` thoát ngoặc lọc
   đúng hơn, khối lộ trình bản 2, và — chỉ khi bật khoá A3 — hồ sơ T2 xanh-sạch có Ngoài-n máy đề xuất ghi giới hạn đi
   làn V. Khác ở chỗ nào khác là tín hiệu cần đọc.
5. **Trong đợt thử, đếm ở sổ chạy:** lượt S4 thật lọt khoá (ngưỡng «S4 tự xưng» ≥ 1) và lượt S4 đứng vì hộp quyền
   mà không có tệp chờ người (ngưỡng «mù» ≥ 1) — hai số này quyết hai việc kế của gói.

**OneFlow** (đợt thử thứ hai ~27/10): cài `dieu-phoi` lần đầu — không có bản chép tay nên chỉ bước 3.1, và THÊM vào
`LUAT-rieng.md` của đợt luật «thợ chờ người thì ghi `can-nguoi`» (OneFlow chưa có luật này; xem bước 3.5); đo
«chạy được mà không sửa lõi».

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng của từng vòng — đủ ở hai mươi hợp đồng và
`docs/research/known-limits-ledger.tsv`, 158 hàng của cửa sổ): `dieu-phoi-lop-mod` 34 · `eval-goi-model-that-khong-chay`
24 · `dieu-phoi-mo-dot-mot-lenh` 18 · `dieu-phoi-doi-tai-khoan` 18 · `ngoai-n-tu-dinh-tuyen` 10 ·
`tac-tu-cham-chi-cham-khong` 7 · `vong-la-mot-ket-qua` 7 · `dieu-phoi-dong-goi-loi` 6 · `dieu-phoi-tiep-tuc-mot-lenh` 6 ·
`dieu-phoi-feature-loop-trong-dot` 6 · `evals-sat-le-doc-du` 6 · `baseline-tran-bo-qua-don` 5 ·
`dieu-phoi-sua-truoc-dot-thu` 4 · `ten-ca-qua-tien-to-turbo` 3 · `glob-thoat-ngoac` 2 · `ci-cua-kho-bo-job-nang` 2 ·
bốn hồ sơ còn lại 0 (`cua-tin-hieu-gom-nhom` ghi giới hạn ở Notes của hợp đồng, sổ chưa có hàng).

**Năm dòng số của luật (c)** — hai mươi vòng (giờ VN; nguồn: giờ commit `contract.md`, `usage-report.md`,
`decisions.jsonl`, `run-log.jsonl` của hồ sơ; ba khối token theo khuôn 2.25: chứng-minh-vật = machine+ui+judge+baseline
· tìm-lỗi = review+refute · tổng hợp = triage+capture+synthesize; Cổng Đáng không tính, theo khuôn 2.26):

| Hồ sơ | 1 · làm-xong→quyết-được · lượt chấm | 2 · gọi người trong / ngoài (trần) | 3 · lượt bị hạ tầng đốt | 4 · out-token S4 · vật / tìm-lỗi / tổng hợp % | 5 · phút máy / lượt |
|---|---|---|---|---|---|
| `dieu-phoi-dong-goi-loi` (DP1) | 1 g 33 · 1 | 1 / 0 (3) | 0 | 34 731 · 41,0 / 19,8 / 39,2 | 36 |
| `dieu-phoi-mo-dot-mot-lenh` (DP2) | 4 g 53 · 4 (lượt 4 vượt trần) | 1 / 1 (3) | **1** — lượt 3 REJECT chỉ vì node segfault (mã 139) ở suite workflows | không ghi trong hồ sơ (không có `usage-report.md`) | không ghi |
| `dieu-phoi-tiep-tuc-mot-lenh` (DP3) | 1 g 41 · 1 | 1 / 0 (3) | 0 | không ghi trong hồ sơ (không có `usage-report.md`) | không ghi |
| `dieu-phoi-doi-tai-khoan` (DP4) | 1 g 04 · 1 | 1 / 3 (3) — **VƯỢT trần** | 0 lượt chấm; hạ tầng đốt 2 lượt gọi người (dòng ký 812 ký tự bị app gói, lệnh không chạy) | 151 852 · 46,5 / 14,7 / 38,7 | 43 |
| `dieu-phoi-lop-mod` (lõi DP6) | 8 g 16 · 7 (lượt 4–7 vượt trần) | 1 / 3 (3) — **VƯỢT trần**; số chạm không ghi | 0 (+1 ca biên: lượt 6 đỏ chỉ vì P179 — sổ giới hạn của chính hồ sơ thiếu dòng) | 460 264 · 47,6 / 15,2 / 37,2 | 42 · 40 · 42 · 42 · 44 · 39 · 39 = 287 |
| `dieu-phoi-feature-loop-trong-dot` (DP7) | 1 g 36 · 1 | 1 / 0 (3) | 0 | 46 430 · 53,5 / 15,0 / 31,5 | 34 |
| `dieu-phoi-sua-truoc-dot-thu` | 48 phút · 1 | 1 / 0 (3) | 0 | 33 597 · 38,8 / 25,8 / 35,4 | 40 |
| `tac-tu-cham-chi-cham-khong` (A1, máy thông) | 7 g 11 · 3 | 1 / 2 (3) | 0 | 114 302 · 44,3 / 23,2 / 32,6 | 28 · 27 · 25 = 80 |
| `ngoai-n-tu-dinh-tuyen` (A3) | 6 g 29 · 2 (trả lại sau lượt 1 chờ qua đêm 4 g 23) | 2 / 2 (3) — **VƯỢT trần**; số chạm không ghi trong hồ sơ | 0 | 92 253 · 38,3 / 22,6 / 39,1 | 40 · 43 = 83 |
| `ci-cua-kho-bo-job-nang` (C1, T3) | 2 g 48 · 1 | 3 / 0 (4) | 0 | 32 283 · 42,5 / 18,3 / 39,2 | 41 |
| `cua-tin-hieu-gom-nhom` (L3) | 4 g 14 · 3 | 1 / 1 (3) | 0 | 137 264 · 59,7 / 14,4 / 25,9 | 29 · 29 · 29 = 86 |
| `evals-sat-le-doc-du` (R1, T3) | 8 g 50 · 2 (chờ ký 7 g 53 qua đêm) | 2 / 0 (4); Gate 1.5 không ghi trong hồ sơ | 0 | 203 018 · 45,9 / 36,8 / 17,3 | 28 · 25 = 54 |
| `glob-thoat-ngoac` (T3) | 1 g 38 · 2 | 3 / 0 (4) | 0 (+1 ca biên: lượt 1 đỏ chỉ vì RT13 bắt chuỗi trạng thái đã ký trong tệp ca của chính hồ sơ) | 58 310 · 59,9 / 18,1 / 22,0 | 32 · 31 = 63 |
| `eval-goi-model-that-khong-chay` (G3) | 3 g 09 · 3 | 1 / 2 (3) | 0 | 211 991 · 50,7 / 13,5 / 35,8 | 44 · 42 · 41 = 127 |
| `ten-ca-qua-tien-to-turbo` (G2) | 1 g 35 · 1 | 1 / 0 (3) | 0 | 33 000 · 50,0 / 10,8 / 39,2 | 40 |
| `xa-stdout-truoc-khi-thoat` | 1 g 29 · 1 | 1 / 0 (3) | 0 | 34 104 · 44,6 / 23,4 / 32,0 | 43 |
| `baseline-tran-bo-qua-don` | 3 g 04 · 1 | 2 / 0 (3) | 0 | 38 858 · 45,8 / 23,1 / 31,1 | 30 |
| `trang-ho-so-mot-viec` (X2) | 3 g 09 · 3 | 1 / 1 (3) | 0 | 78 083 · 52,6 / 15,1 / 32,4 | 27 · 25 · 27 = 79 |
| `vong-la-mot-ket-qua` (S3) | 2 g 22 · 2 | 2 / 0 (3) | 0 | 133 602 · 74,6 / 8,7 / 16,7 | 27 · 25 = 52 |
| `lo-trinh-chi-viec-phat-trien` (S3b) | 2 g 28 · 2 | 1 / 0 (3) | 0 | 218 795 · 78,3 / 7,0 / 14,7 | 31 · 28 = 59 |

Cộng hai mươi vòng: **42 lượt chấm** (9 vòng một lượt; trung vị làm-xong→quyết-được 2 g 38) · **2 112 737 out-token**
trên 37/42 lượt có `usage-report.md` (chứng-minh-vật 53,0 % · tìm-lỗi 17,1 % · tổng hợp 29,9 %) · **≈ 1 278 phút máy**
(76 664 s) trên cùng 37 lượt · **43 lượt gọi người** (28 trong thiết kế, 15 ngoài), **3 vòng vượt trần** · hạ tầng
đốt **1 lượt chấm** (+2 ca biên) và **2 lượt gọi người**. Phiên chính không đo token. Số chạm: lời ký là một câu gộp
ở mọi vòng có ghi; Cổng Phạm vi ký thật và các lần gọi ngoài thiết kế của DP2, DP4, DP6, G3, A3 không ghi số chạm.

**Đọc số:**

- **Một vòng ăn hơn một phần năm cửa sổ.** `dieu-phoi-lop-mod` dùng 21,8 % out-token và 22,5 % phút máy của cả hai mươi
  vòng qua bảy lượt chấm: lớp «lệnh S4 lọt bộ đọc cú pháp» đổi da ba lần trong vòng (vỏ bọc mang cờ → thân heredoc cho
  trình thông dịch → heredoc kèm chuyển hướng), dừng-vá thu phạm vi. Nghiệm đúng tầng đã ghi hạt giống («S4 tự xưng»),
  không vá thêm bộ phân loại.
- **Ba vòng vượt trần, ba gốc khác nhau:** DP6 do lớp trên; DP4 do hạ tầng — dòng ký dán dài hơn ~800 ký tự bị app
  gói thành khối, lệnh không chạy, hai lượt gọi người cho một chữ «ký» (hạt giống `docs/plans/2026-10-11-hat-giong-dong-ky-vuot-nguong-dan.md`);
  A3 do chọn sửa ngay sáu mục ngoài hợp đồng thay vì tách việc — trả lại sau lượt 1 rồi duyệt lại Cổng Phạm vi
  bằng một lệnh riêng (hồ sơ tự ghi là lượt gọi thứ tư, ngoài thiết kế).
- **A1 chưa chạy sống lần nào:** 38 lượt chấm của 17 hồ sơ có dòng `loai-tac-tu-vang` («agent type
  'feature-loop:cham-lenh' not found») — bản cài `feature-loop` 2.26.0 trong bộ đệm gói không có `agents/`, nên mọi
  lượt đi đường rơi về tác tử mặc định. Không lượt nào bị đốt vì thế. 2.27.0 là số đầu tiên mang `agents/`. **Chỗ cắt
  cho cửa sổ kế** (không mở ô): lượt chấm đầu tiên ở một kho đã cài 2.27.0 mà vẫn có dòng `loai-tac-tu-vang` là
  *sai hợp đồng* của A1 (máy sửa vật), không còn là giới hạn.
- **Dòng 4–5 hở ở hai vòng gói:** DP2 và DP3 không có `usage-report.md` (kể cả trong lịch sử git); `wall_s` trong
  run-log của hai hồ sơ là của làn ghim lại, không phải lượt chấm. Số của hai vòng ấy không đọc được — không ước.

**Điều kiện tin cậy:** (i) đường verdict (finder → refute trong hợp đồng → REJECT) không đổi thành phần. A1 đổi
LOẠI tác tử của chín vai — bộ công cụ, không đổi đề bài một byte — kèm răng hai chiều trong harness (AT1/AT2 đỏ khi
bảng vai sai; AT3: lượt sạch so với bản gỡ bảng vai cho đề bài, phán quyết, run-log bằng nhau); trong thực tế 38
lượt của cửa sổ chạy đường rơi và 4 lượt chạy bản lượt chấm chưa có A1, nên thành phần thật của cả 42 lượt không đổi.
A3 thêm một bên ghi SAU phán quyết PASS (dòng sổ của máy cho Ngoài-n) — không chạm finder, refute hay REJECT. Đầu vào lượt chấm đổi ở ba chỗ có hồ sơ
riêng: một bộ đọc danh sách `evals.yaml` (R1, T3 — 621 hồ sơ ở bảy kho, 0 lệch với kiểu thụt 4), kế hoạch mang sang
thôi mang eval có tệp vừa đổi (`glob-thoat-ngoac`, T3), làn đối chứng chạy một lệnh kit sinh có trần
(`baseline-tran-bo-qua-don`). (ii) Lượt chấm sai do phép-đo-tự-dối giữa hai mốc: **0** — lượt oan duy nhất là hạ tầng
(segfault, dòng 3); hai ca biên là lưới corpus đỏ đúng trên tệp hay sổ của chính hồ sơ, không phải phán quyết sai.
Ngưỡng (a) đếm **0/2**. Dòng 4–5 cắt được, với 2/20 vòng không có số.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở crm | tiếp tục một lệnh và đổi tài khoản không mất việc bỏ những giờ đứng khi phiên đứt (09/10: 37 việc nền dừng; 08/10: hai việc lỡ 5 giờ) |
| 2 | ↓ ở crm | thợ chờ lượt S4 không thành câu hỏi, tự mở hàng kế (DP7); mở và tiếp tục đợt một lệnh thay sáu bước tay (DP2, DP3); khi bật khoá A3, hồ sơ T2 xanh-sạch thôi mời ký (dự báo mời ký 71 → 34 trên đợt `sau-14-10`). Rủi ro ngược: hộp quyền của tác tử Workflow chưa đo — luật 52 giữ |
| 3 | ↓ | tác tử chấm không ghi cây (A1, hiệu lực từ bản cài 2.27.0); làn đối chứng có trần, không giữ khoá s4 nhiều giờ; thẻ > 64 KB không bị cắt; `evals.yaml` sát lề đọc đủ |
| 4 | = / lượt | thành phần lượt không đổi. Làn ghim lại không gọi lại eval model khi đầu vào không đổi (G3) — đó là chi phí model của kho, không phải token S4. Phút Actions của kho ↓ khi gắn `--hang-pr` (C1) — không phải phút máy S4 |
| 5 | = / lượt | trần 480 s của làn đối chứng chỉ rút đường găng khi làn ấy treo |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .`.
**N không tăng so với mốc 2.26.0 (vẫn 1) — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.26.0 — 09/10/2026

Cửa sổ 2.25.0 → 2.26.0 nằm trong **hai ngày** (08–09/10), có **ba vòng** được ký: `xuat-du-lieu-lo-trinh`
(T2, ký 08/10, PR #285), `lo-trinh-cat-luot` (T2, ký 09/10, PR #289) và `doc-ghi-troi-mang-sang-run-id`
(T3, ký 09/10, PR #284). Kho chờ nhận là `crm` — CHƯA cài 2.25.0 (hạn cứng 14/10 của đợt đang chạy) nên
nhận thẳng 2.26.0 một lần; neo ở hàng `LT1` của `crm/docs/plan/dot-sau-14-10/` (trang lộ trình trong CRM đọc
khối dữ liệu mốc này mang), ở `crm/_acceptance/khung-okr-truoc-r1` (gốc của cắt lượt) và ở đêm 07–08/10 của crm
(gốc của bộ đọc mục mang sang). Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên `2.26.0`;
`diagram-design` giữ `2.7.1`. Tag `v2.26.0` gắn tại commit gộp PR mốc.

**Vì sao 2.26.0, không 2.25.1:** một khối dữ liệu mới trong trang lộ trình (khuôn `lo-trinh-du-lieu` v1 cho
bản chiếu ngoài kho) và một skill mới (`cat-luot`) — năng lực mới cho kho tiêu thụ.

**Lớp chép CI ĐỔI bốn tệp** (danh sách vẫn 17 tệp): `scripts/lo-trinh.mjs`, `lib/evidence-core.cjs`,
`lib/out-of-contract.cjs`, `scripts/recheck-evidence.cjs`. Diff engine của cửa sổ còn ở
`feature-loop/workflows/acceptance-verify.js`, `scripts/cat-luot.mjs` (mới), `skills/cat-luot/SKILL.md` (mới)
và bốn tài liệu tham chiếu của `skills/acceptance/` (`lo-trinh-du-lieu.md` mới, `lo-trinh-template.json`,
`pham-vi-template.md`, `human-facing-language.md`).

**Một cách đọc `run_id` ở lượt chấm.** #289 và #284 cùng sửa bộ ghi mã lượt chạy của lượt chấm S4, mỗi nhánh
một hàm. Khi gộp #284 sau #289, hai hàm thành MỘT (`docRid`): luật đầy đủ của bên đọc (bỏ đuôi ` # …`, khoảng
trắng, mọi nháy đầu/cuối), áp cho cả mã mang sang lẫn mã ghi run-log. Ca đột biến của #284 đổi kim sang dòng
mới; hồ sơ #284 được ghim lại sau lần gộp đó.

### Thẻ Cổng 2 không còn giấu mục mang sang; run_id rỗng không còn lọt (hồ sơ `doc-ghi-troi-mang-sang-run-id`, T3)

Gốc: crm đêm 07–08/10 (kit 2.24.0). Thẻ Cổng 2 giấu mục ngoài hợp đồng mang sang ba lần (2/7, 1/15, 10/10).
Báo cáo PASS mang `run_id: ""` mà kiểm lại vẫn qua.

- **Bộ đọc thẻ nhận mục mang sang tác tử tự viết** dạng `- **<tiêu đề>** (rN)` (nhãn ngoài dấu sao), chuẩn
  hoá về đúng dạng máy chèn. Bước chèn mục mang sang dùng cùng biểu thức, nên không còn in bản thứ hai. Đo lại
  trên chính kho kit: hai hồ sơ đã ký 03/10 có 1 và 4 mục mà thẻ lúc ký không in ra.
- **`run_id` rỗng:** tác tử trả `""` thì máy đúc mã như khi vắng. Báo cáo cũ mang `run_id` rỗng được gọi tên
  bằng một dòng `NOTE` khi kiểm lại, nhưng không bị chặn: báo cáo đã ký có hình dạng này đang tồn tại ở kho
  tiêu thụ.
- Ai bị ảnh hưởng: mọi kho chạy S4 hoặc dựng thẻ Cổng 2. Không cần làm gì khi cập nhật. Thẻ của hồ sơ cũ có
  thể hiện thêm mục ngoài hợp đồng trước đây bị giấu. Khi đó số `Ngoài-N` (đánh theo vị trí) dịch so với lúc
  ký, nên đọc sổ quyết định cũ theo tiêu đề, không theo số. Kho nào ghim `routing-baseline` thì sinh lại dòng
  của hồ sơ đó. Eval mang sang với `run_id` rỗng sẽ chạy lại thay vì được mang.

### Cắt lượt: bản phạm vi thành hàng lộ trình, răng phủ «mỗi mã ở đúng một chỗ» (hồ sơ `lo-trinh-cat-luot`, T2)

Gốc: crm `_acceptance/khung-okr-truoc-r1` — lộ trình OKR 32 → 62 hàng trong ba ngày, hai lượt cắt tay
một buổi sáng 04/10, bảng phủ chép tay đã cũ, bản phạm vi không có trong git.

- Skill mới `cat-luot`: bản phạm vi (hoặc Core của quét hình thái) → hàng + chân trời theo sáu luật, hai
  dáng `chuoi` · `lan-va`; ghi hàng → chạy răng → xanh mới mở PR.
- `scripts/cat-luot.mjs` (chỉ đọc): răng phủ theo đợt (`dot`), chân trời có lý do, khuôn và ngày/mốc của
  hàng cùng đợt; `--nhip` đo nhịp theo hạng từ hồ sơ đã ký. Khuôn mới `pham-vi-template.md`; khuôn lộ
  trình thêm `dot`, `phu`, `chan_troi`; `kiemKhuon` cờ khi `phu`/`chan_troi` sai kiểu.
- Trang lộ trình: hàng có hồ sơ mang dòng «bước kế: …» suy từ ô bản đồ (phần sửa lát 1 sau phiên nghiệm
  thu 06/10). Kho không khai lộ trình, và kho không hàng nào có hồ sơ: không đổi byte nào.
- Ai bị ảnh hưởng: kho đã khai `lo_trinh.tep` — trang đổi ở hàng có hồ sơ; vẽ lại một lần khi nâng kit.
- Sửa kèm (owner gọi tên ở Cổng Bằng chứng 09/10, ngoài phạm vi đã duyệt): lượt chấm S4 chuẩn hoá mã
  lượt chạy tác tử khai theo đúng luật bên đọc bằng chứng trước khi ghi nhật ký. Tác tử từng trả nguyên
  hai dấu nháy `""`; nhật ký chép nguyên, bên đọc bỏ nháy, hai lệnh cùng trả thế thì chữ ký bị lưới chặn
  oan. Nay mã chỉ có dấu nháy → máy tự đúc mã. Mọi kho: chỉ đổi lượt chấm mới; hồ sơ cũ không đổi.

### Trang lộ trình mang sẵn dữ liệu máy đọc cho bản chiếu ngoài kho (hồ sơ `xuat-du-lieu-lo-trinh`, T2)

Gốc: crm `_acceptance/cap-nhat-tuan-okr` — 23/48 tin chủ kho ở phiên điều phối OKR 23–26/09 là hỏi tiến
độ; owner chốt 08/10 người không dùng git được XEM lộ trình (crm: hàng `LT1`, trang «Lộ trình» trong CRM).

- `LO-TRINH.html` có thêm một khối `<script type="application/json" id="lo-trinh-du-lieu">` theo khuôn
  `lo-trinh-du-lieu` phiên bản 1: mỗi lộ trình — hàng kế + lệnh mở, chỗ cần sửa, tiến độ, từng hàng
  (trạng thái, nhóm tiến độ, hồ sơ nhận, cờ đã dịch, ý định của hàng), mốc, đã bác; cấp trang — hồ sơ
  ngoài kế hoạch. Bộ đọc mẫu khoan dung `docDuLieu` trong `scripts/lo-trinh.mjs`.
- Ai bị ảnh hưởng: kho đã khai `lo_trinh.tep` — trang đổi byte một lần (khối mới); phần người xem
  không đổi. Kho không khai: không đổi gì.
- Làm gì khi nâng: vẽ lại trang một lần (`node scripts/product-map.mjs --root .`) trong PR nâng kit,
  nếu không `--check` đỏ «LO-TRINH.html lệch». Không sửa cấu hình. Bản chiếu đọc tài liệu
  `skills/acceptance/references/lo-trinh-du-lieu.md`.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI: chép lại bốn tệp** — `scripts/lo-trinh.mjs`, `lib/evidence-core.cjs`, `lib/out-of-contract.cjs`,
  `scripts/recheck-evidence.cjs` (theo INIT-CI-COPY-LIST của `acceptance-init`).
- **Máy dev:** cài lại plugin ở MỌI phạm vi trên mỗi máy có phiên của kho, kiểm từng bản ghi cây phụ.
- **Kho đã khai `lo_trinh.tep`:** vẽ lại `LO-TRINH.html` một lần trong PR nâng kit (`node scripts/product-map.mjs
  --root .`), nếu không `--check` đỏ «LO-TRINH.html lệch» (khối dữ liệu mới, và dòng «bước kế» ở hàng có hồ sơ).
- **Thẻ Cổng 2 của hồ sơ cũ** có thể hiện thêm mục ngoài hợp đồng trước đây bị giấu; số `Ngoài-N` khi đó dịch so
  với lúc ký — đọc sổ quyết định cũ theo tiêu đề. Kho ghim `routing-baseline` thì sinh lại dòng của hồ sơ đó.
- **crm, theo thứ tự** (nhận thẳng 2.26.0, bỏ qua 2.25.0 — mọi ghi chú nhận của 2.25.0 vẫn áp):
  1. **Khi nào cài:** SAU hạn cứng 14/10 của đợt đang chạy, TRƯỚC khi mở hàng đầu tiên của đợt `sau-14-10`
     (`crm/docs/plan/dot-sau-14-10/README.md`: «gộp và cài cùng phiên bản trước khi mở đợt»). Không đổi engine
     dưới chân một vòng đang chạy tới hạn.
  2. Chép bốn tệp lớp CI ở trên; cài lại plugin gốc + mọi cây phụ.
  3. Khai `long_running: 45` cho `tro-ly-okr-bo-final-output/E6` và `E7` (từ 2.25.0; và mọi eval gọi model chạy
     dài khác). E6/E7 đã có trong `feature_loop.model_evals` nên tự chạy riêng sau suite.
  4. Vẽ lại `LO-TRINH.html` (crm khai `lo_trinh.tep`) trong cùng PR nâng kit.
  5. **Đo trước → sau trên crm** (tiền lệ `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`): trên cùng một
     cây, chạy lưới trước-merge và thẻ của các hồ sơ đang mở dưới 2.24.0 rồi 2.26.0 — phán quyết từng hồ sơ phải
     bằng nhau, TRỪ chỗ mốc hứa đổi: thẻ Cổng 2 hiện thêm mục mang sang từng bị giấu, và dòng `NOTE` khi kiểm lại
     báo cáo mang `run_id` rỗng. Khác ở chỗ nào khác là tín hiệu cần đọc.
  6. **Khối dữ liệu lộ trình có từ 2.26.0 — hàng `LT1` dùng được** (điều kiện mở của LT1 là kit ≥ 2.26).

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng của từng vòng — đủ ở ba hợp đồng và
`docs/research/known-limits-ledger.tsv`): `xuat-du-lieu-lo-trinh` 10 hàng sổ · `lo-trinh-cat-luot` 13 mục ngoài
hợp đồng + 3 điểm yếu đo trong hợp đồng · `doc-ghi-troi-mang-sang-run-id` 6 hàng sổ (một hạt giống
`docs/plans/2026-10-09-hat-giong-carry-run-id-rong-tach-cap.md`).

**Năm dòng số của luật (c)** — ba vòng (giờ VN; nguồn: giờ commit `contract.md`/`evidence-report.md`,
`usage-report.md`, `decisions.jsonl`, `run-log.jsonl` của hồ sơ; ba khối token theo khuôn 2.25: chứng-minh-vật =
machine+judge+baseline · tìm-lỗi = review+refute · tổng hợp = triage+capture+synthesize):

| Dòng | `xuat-du-lieu-lo-trinh` (T2) | `lo-trinh-cat-luot` (T2) | `doc-ghi-troi-mang-sang-run-id` (T3) |
|---|---|---|---|
| Làm-xong→quyết-được | `implemented` 08/10 15:51 → ký 18:32 ≈ **2 giờ 41 phút**, hai lượt chấm (≈ 121 phút máy); chờ chữ ký sau lượt xanh 24 phút; **2 lượt chấm** | `implemented` 09/10 00:21 → ký 11:57 ≈ **11 giờ 36 phút**, gồm ≈ 7 giờ 25 phút qua đêm từ lượt 2 PASS tới lúc owner định tuyến; bốn lượt chấm (≈ 117 phút máy), một lần sửa bộ máy chấm trong vòng, một lượt vượt trần; chờ chữ ký sau lượt xanh cuối 70 phút; **4 lượt chấm** | `implemented` 08/10 23:25 → ký 09/10 06:36 ≈ **7 giờ 10 phút**, ba lượt chấm (≈ 93 phút máy); chờ chữ ký sau lượt xanh 5 giờ 12 phút qua đêm; **3 lượt chấm** |
| Lượt gọi người / vòng (trần T2 3 · T3 4) | Trong thiết kế **1** — ký Cổng Bằng chứng (Cổng Phạm vi làn V). Ngoài thiết kế **0**. 1 chạm | Trong thiết kế **1** — ký Cổng Bằng chứng. Ngoài thiết kế **3** — lần mời ký đầu sau lượt 2 bị lưới chặn (lượt gọi bị hạ tầng đốt) · chọn «sửa trong vòng» · cho chấm lượt 4 vượt trần. **Tổng 4 — VƯỢT trần T2 3.** Số chạm của hai lượt sau không ghi trong hồ sơ | Trong thiết kế **3** — Cổng Phạm vi (ký thật) · Gate 1.5 · Cổng Bằng chứng. Ngoài thiết kế **0**. Tổng 3 ≤ trần T3 4; 1 chạm ở hai lượt sau, lượt đầu không ghi |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0** — lượt 1 REJECT vì ba lỗi trong hợp đồng (vật và thước) | **2** — lượt 2 PASS vô hiệu: bộ ghi chép nguyên mã `""` tác tử trả vào run-log, bên đọc bỏ nháy, lưới chặn chữ ký · lượt 3 REJECT oan: bốn ca đối chiếu cả kho đọc báo cáo lượt 2 còn mang mã hỏng | **1** — lượt 2 REJECT chỉ vì ca GL03 so từng byte dòng run-log có cả `wall_s` (chạy riêng thì xanh; #284 sửa) |
| Token máy / vòng (out-token S4) · chứng-minh-vật / tìm-lỗi / tổng hợp | **73 575** · 49/19/32 % (39 507 · 34 068) | **139 940** · 45/21,5/33,5 % (43 134 · 34 063 · 27 090 · 35 653) | **93 057** · 53,5/17,5/29 % (29 137 · 29 715 · 34 205) |
| Phút máy / lượt chấm | 26 và 95 phút (1 565 s · 5 679 s — lượt 2 có một mảnh suite chạy 4 240 s, hồ sơ không ghi nguyên nhân), tổng ≈ 121 phút | 34 · 26 · 30 · 27 phút, tổng ≈ 117 phút (6 997 s) | 30 · 33 · 30 phút, tổng ≈ 93 phút (5 551 s) |

Cộng ba vòng: 306 572 out-token, ≈ 330 phút máy, 9 lượt chấm, 3 lượt bị hạ tầng đốt. Phiên chính không đo token.
Ngoài lượt chấm: X1 tốn hai lượt ghim lại (≈ 22 phút mỗi lượt, gộp main sau 2.25.0 rồi sau #288), L2 một lượt
(≈ 22 phút, gộp main sau X1), #284 một lượt (gộp main sau L2, hợp hai hàm đọc `run_id`).

**Đọc số:** dòng 2 vượt trần ở L2 do hạ tầng kit — hai trong ba lượt gọi ngoài thiết kế sinh từ lượt 2 bị vô hiệu
(bộ ghi `run_id` lệch bên đọc). Đúng lớp `doc-ghi-troi-mang-sang-run-id` cùng chữa ở phía mang sang; mốc này gộp
hai nửa thành một luật. Chỗ cắt cho cửa sổ kế: không mở ô — A1 (tác tử chấm không sửa mã) đã là hàng kế trên lộ
trình kit.

**Điều kiện tin cậy:** (i) không đổi thành phần đường verdict — diff của workflow lượt chấm nằm ở làn máy ghi
sổ (chuẩn hoá `run_id` trước khi vào run-log; eval mang sang có `run_id` rỗng thì chạy lại) và ở bước máy chèn
mục mang sang (nhận dạng nhãn `(rN)` ngoài dấu sao); không chạm finder, refute trong hợp đồng hay luật REJECT.
Mốc này CHẠM `lib/` (khác 2.25): `evidence-core.cjs` thêm một cờ `NOTE` cho khối eval có `run_id` rỗng — không
tính vào thất bại, mức chặn bằng chứng không đổi; `out-of-contract.cjs` đọc thêm dạng nhãn ngoài dấu sao — đổi
đầu vào của lưới «mục chưa định tuyến» và thẻ Cổng 2 (có thể lộ thêm mục), không đổi đường verdict S4.
(ii) Lượt chấm sai do phép-đo-tự-dối giữa hai mốc: **0** — ba lượt oan đều là hạ tầng (dòng 3); ngưỡng (a) đếm
**0/2**. Dòng 4–5 cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở crm | lượt chấm không còn vô hiệu vì mã lượt chạy lệch bên đọc; người ký không phải hỏi lại mục mang sang bị giấu |
| 2 | ↓ ở crm | trưởng phòng ban xem lộ trình trong CRM (LT1) thay vì hỏi chủ kho; lượt cắt kế hoạch chạy bằng skill thay cho buổi cắt tay |
| 3 | ↓ | đúng lớp L2 và #284 chữa — ba lượt của cửa sổ này mất vì nó |
| 4 | = / lượt, ↓ / vòng | không đổi thành phần lượt; ít lượt bị đốt hơn |
| 5 | = / lượt | không đổi đường găng của lượt |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .`.
**N không tăng so với mốc 2.25.0 (vẫn 1) — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.25.0 — 09/10/2026

Cửa sổ 2.24.0 → 2.25.0 nằm trong **ba ngày** (07–09/10), có **hai vòng** được ký cùng ngày 07/10:
`luot-sua-giu-du-dem-dung` (T2, PR #278) và `lenh-dai-chay-rieng` (T2, PR #279). Ngoài hồ sơ: lộ trình
của kit `docs/plans/lo-trinh-kit.json` (#281, #282, chỉ tài liệu) và ô Cổng Đáng `xuat-du-lieu-lo-trinh`
(#283, chỉ hồ sơ — vật của nó, PR #285, CỐ Ý để sang mốc sau). Kho chờ nhận là `crm`, neo ở hai hồ sơ crm:
`tro-ly-okr-bo-final-output` (bốn lượt chấm đốt bởi hạ tầng kit) và `don-okr-nhap-sai` (lượt sửa làm rụng
ba mục ngoài hợp đồng); `crm/docs/plan/dot-sau-14-10/README.md` ghi «gộp và cài cùng phiên bản trước khi
mở đợt». Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên `2.25.0`; `diagram-design` giữ `2.7.1`.
Tag `v2.25.0` gắn tại commit đóng hồ sơ mốc sau khi gộp.

**Vì sao 2.25.0, không 2.24.1:** một khoá eval mới (`long_running`) và thứ tự chạy mới cho eval trong
`feature_loop.model_evals` — hành vi mới ở lượt chấm.

**Lớp chép CI KHÔNG đổi** — không tệp nào trong INIT-CI-COPY-LIST đổi từ 2.24.0 (danh sách vẫn 17 tệp);
diff engine của cửa sổ chỉ ở `feature-loop/` (workflow lượt chấm, `s4-args`, `carry-plan`, `thuoc-vat`,
`lan-khoa`, SKILL), hai tài liệu tham chiếu của `skills/acceptance/` và một dòng chú thích khuôn của
`acceptance-init`.

### Lượt chấm S4 không còn bị lệnh dài và eval nặng đốt (hồ sơ `lenh-dai-chay-rieng`, T2)

Gốc: crm `_acceptance/tro-ly-okr-bo-final-output`, 07/10 — bốn lượt chấm mất vì hạ tầng kit: hai lượt
BLOCKED vì tác tử đọc «lệnh bị đẩy sang nền ở 600 s» thành «bị giết», hai lượt REJECT vì eval gọi model
dựng `eve dev` cùng lúc với một ca suite canh đúng tiến trình đó.

- **Khoá eval mới `long_running: <phút>`** (số nguyên 1–240, thời lượng tối đa dự kiến; chỉ eval
  `test`/`script`). Lượt chấm tự chạy lệnh nền, ghi nhật ký ở `.acceptance-runs/<slug>/s4-lenh-dai/`
  (kết bằng `__EXIT=<n>`), chờ bằng lệnh máy sinh; quá số phút → dừng cả cây tiến trình (TERM rồi KILL), eval BLOCKED. Máy đọc dấu «chưa xong»/«quá hạn» ở
  đuôi lệnh chờ — tác tử khai «exit 0» khi lệnh còn chạy không thành PASS. Lượt cùng round chạy lại có
  nhật ký tên mới, không đọc kết quả của lượt trước (lệnh dài của lượt cũ bị cắt ngang có thể còn chạy chồng —
  giới hạn đã khai).
  Thước không cần tự ghi nhật ký. Giá trị sai → `s4-args` dừng gọi tên eval.
- **Eval trong `feature_loop.model_evals` chạy riêng** ở S4: tuần tự, SAU mọi lệnh máy khác (eval song
  song và chuỗi suite) — như làn ghim lại đã làm. Đọc bằng bộ đọc hẹp mà làn ghim lại cũng gọi; `model_evals` sai dạng giờ
  cũng dừng `s4-args` (trước chỉ dừng làn) — khoá CHỈ của làn ghim lại sai giá trị thì không.
- **Luật TOOL-KILL thêm một dòng:** «chuyển sang nền» không phải «bị giết» — chờ tới dòng `__EXIT=`,
  tối đa `long_running` hoặc 30 phút; quá thì BLOCKED với lý do chỉ việc cần làm.
- **Khoá vắng = như 2.24.0:** kho không khai `long_running` lẫn `model_evals` nhận prompt và thứ tự
  lệnh bằng hệt 2.24.0 (đo bằng vi phân với tag `v2.24.0`).
- **crm khi nhận:** khai `long_running: 45` cho `tro-ly-okr-bo-final-output/E6`, `E7` (và mọi eval model
  dài khác); E6/E7 đã có trong `model_evals` nên tự chạy sau suite.

### Lượt sửa giữ đủ, đếm đúng (hồ sơ `luot-sua-giu-du-dem-dung`, T2)

Gốc: crm, hồ sơ `don-okr-nhap-sai`, S4 lượt 2 ngày 07/10 trên 2.24.0 — ba lỗ, cả ba tái hiện được
trên dữ liệu crm.

- **Mục ngoài hợp đồng của lượt trước không còn rụng.** Trước đây mục nằm trên tệp mà lượt sửa có chạm
  bị bỏ khỏi carry (giả định «lượt sau tự tìm lại» — sai: tìm lỗi không tất định), nên nó biến mất khỏi
  thẻ Cổng Bằng chứng; crm mất ba mục và vá tay. Nay mọi mục ngoài hợp đồng đều mang sang; mục trên tệp
  bị chạm mang nhãn «(r<N> · tệp đã đổi)». Bản findings do MÁY chèn mục carry, không trông vào tác tử tổng
  hợp; mục chỉ được coi là đã in khi cùng tệp và tiêu đề bằng đúng hoặc mang nhãn «(r…)» — một mục
  mới cùng tệp có tên dài hơn không nuốt được mục cũ.
- **Eval ui-check carry giữ ảnh và mô tả của lượt gốc.** Trước đây khối carry cố ý bỏ `screenshot:` /
  `observed:` nên thẻ báo «Bằng chứng lớp nhìn-thấy: KHÔNG có» dù khung còn nguyên. Nay `s4-args` đọc
  khối của báo cáo lượt trước — chỉ khi cùng `run_id`, ảnh còn trên đĩa (đường tương đối hồ sơ hay
  đường tuyệt đối — crm có cả hai), mô tả thực chất — và workflow
  chép ba trường vào khối carry. Thiếu một điều kiện → không chép, một dòng stderr nói vì sao; thẻ báo
  «không có» là đúng sự thật.
- **Thước-vật không đếm nội dung nhập từ nhánh nền.** Gộp nhánh nền vào nhánh của vòng từng làm
  `thuoc-vat.mjs` đếm cả commit và tệp của hồ sơ khác (crm: vật +1780/−12 → +38/−11 khi đếm đúng; nhát
  2 → 0). Cha thứ hai của merge mà không có mốc sàn làm tổ tiên = nền, không đếm; nhánh con của chính
  vòng (worktree `execute-parallel`) vẫn đếm. `--giua-hai-luot` cùng bộ lọc.
- **Kho không gặp ba ca này:** không đổi gì — kho không merge từ nền giữ từng byte đầu ra thước-vật;
  args đời cũ (không trường khung, không `tepDoi`) chạy y như trước.
- **Giới hạn đã khai:** tệp mà cả vòng lẫn nền cùng sửa được đếm bằng cộng từng commit của vòng thay vì
  số ròng (git 2.37 chưa có `merge-tree --write-tree`) — một dòng thêm rồi xoá trong vòng đếm hai lần.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI: không chép gì** — 17 tệp giữ nguyên như 2.24.0.
- **Máy dev:** cài lại plugin ở MỌI phạm vi trên mỗi máy có phiên của kho, kiểm từng bản ghi cây phụ.
- **crm, theo thứ tự:**
  1. **Khi nào cài:** SAU hạn cứng 14/10 của đợt đang chạy, TRƯỚC khi mở hàng đầu tiên của đợt
     `sau-14-10` (`crm/docs/plan/dot-sau-14-10/README.md`: «gộp và cài cùng phiên bản trước khi mở đợt»).
     Không đổi engine dưới chân một vòng đang chạy tới hạn.
  2. Khai `long_running: 45` cho `tro-ly-okr-bo-final-output/E6` và `E7` (và mọi eval gọi model chạy dài
     khác). E6/E7 đã có trong `feature_loop.model_evals` nên tự chạy riêng sau suite — không khai thêm.
  3. **Đo trước → sau trên crm** khi nhận (tiền lệ `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`):
     trên cùng một cây, chạy lưới trước-merge và thẻ của các hồ sơ đang mở dưới 2.24.0 rồi 2.25.0 —
     phán quyết từng hồ sơ phải bằng nhau. Mốc này không đổi lưới trước-merge nên khác nhau ở đâu là
     tín hiệu cần đọc, không phải hành vi mới được hứa.

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng 07/10 — đủ ở hai hợp đồng, hai design doc và
`docs/research/known-limits-ledger.tsv`):

- `luot-sua-giu-du-dem-dung` (1 mục + 1 hạt giống): `s4-args` tự kiểm «mô tả khung đủ dài» bằng luật
  riêng (≥ 20 ký tự) thay vì luật của bộ kiểm bằng chứng — dòng mẫu chưa điền được mang sang rồi bị chặn
  rõ ở bước kiểm, không kết quả sai nào lọt · tệp mà cả vòng lẫn nền cùng sửa đếm bằng cộng commit thay
  vì số ròng. Ba mục mở hợp đồng mới ghi hạt giống `docs/plans/2026-10-07-hat-giong-carry-finding-sau-luot-sua.md`.
- `lenh-dai-chay-rieng` (2 mục ở Cổng Bằng chứng + phần thu phạm vi sau lượt 4): lượt chấm bị cắt ngang
  khi lệnh dài còn chạy thì lệnh của lượt cũ chạy chồng lượt mới (kết quả không lẫn — nhãn lượt) · ca đo
  nhận tiến trình mẫu theo dòng lệnh, có thể giết nhầm mẫu của bản tệp ca chạy song song · ca đo đọc mọi
  lỗi `ps` thành «đã chết». Thêm từ design doc: suite chưa khai được `long_running` (vẫn chia mảnh) ·
  ui-check và baseline không chạy riêng · bộ đọc `paths` của carry-plan chỉ nhận dạng một dòng `[...]`
  (dạng khối → chạy lại toàn bộ, phía an toàn) · chưa có ca tự động dưới zsh.
- **Một ca đo của cửa sổ ghim vào mục «Chưa phát hành» của tệp này** (AC-10 của `luot-sua-giu-du-dem-dung`)
  — sẽ đỏ ngay ở lần cắt số này. Mốc sửa ca đo, không sửa hồ sơ đã ký: nay nó đọc phần CHANGELOG mới hơn
  số ở mốc gốc của chính ca (đọc từ manifest tại `7b1afe1e`). Hình dạng 7 của lớp «thước ghim vào thứ sẽ
  đổi».

**Năm dòng số của luật (c)** — hai vòng (giờ VN; nguồn: giờ commit `contract.md`/`evidence-report.md`,
`usage-report.md` của hồ sơ):

| Dòng | `luot-sua-giu-du-dem-dung` (T2) | `lenh-dai-chay-rieng` (T2) |
|---|---|---|
| Làm-xong→quyết-được | `implemented` 10:23 → ký 14:08 ≈ **3 giờ 45 phút**, gồm hai lượt chấm (≈ 128 phút máy, lượt 1 vô hiệu) và một lần nâng phạm vi; chờ chữ ký sau lượt xanh 4 phút; **2 lượt chấm** | `implemented` 09:23 → ký 16:16 ≈ **6 giờ 53 phút**, gồm bảy lượt chấm (≈ 201 phút máy), vượt trần ba lượt có owner duyệt, một lần thu phạm vi; chờ chữ ký sau lượt xanh 34 phút; **7 lượt chấm** |
| Lượt gọi người / vòng (trần T2 3) | Trong thiết kế **1** — ký Cổng Bằng chứng (Cổng Phạm vi làn V, cửa veto mở). Ngoài thiết kế **1** — owner «nâng» phạm vi sau lượt 1 (AC-11, AC-12). 1 chạm mỗi lượt | Trong thiết kế **1** — ký Cổng Bằng chứng. Ngoài thiết kế **2** — cho chấm lượt 4 vượt trần · chọn thu phạm vi ở điểm dừng-vá sau lượt 4. 1 chạm mỗi lượt |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **1** — lượt 1 vô hiệu: khung Workflow chuyển nguyên văn yêu cầu gốc của phiên («sửa + thêm test») cho mọi tác tử chấm, hai tác tử tự sửa mã và commit; thước-vật bắt «cây đổi», máy hoàn lại | **3** — lượt 1 REJECT chỉ vì mảnh suite `mjs:1/3` đỏ không tái hiện · lượt 2 BLOCKED (tác tử suite hooks chết; sổ known-limits thiếu hàng của chính hồ sơ) · lượt 6 BLOCKED (tác tử mảnh `mjs:1/3` chết không nộp kết quả). Lượt 3–5 REJECT vì vật và thước thật |
| Token máy / vòng (out-token S4) · chứng-minh-vật / tìm-lỗi / tổng hợp | **134 337** · 60/17/23 % (97 542 · 36 795 theo lượt — lượt vô hiệu chiếm 73 %) | **264 299** · 60/13/27 % (51 718 · 43 033 · 37 155 · 35 417 · 41 638 · 24 870 · 30 468) |
| Phút máy / lượt chấm | 100 và 28 phút (6 018 s · 1 679 s), tổng ≈ 128 phút | 31 · 27 · 36 · 27 · 27 · 27 · 26 phút, tổng ≈ 201 phút (12 076 s) |

Phiên chính không đo token. Ngoài lượt chấm, `lenh-dai-chay-rieng` tốn thêm một lượt ghim lại sau chữ ký
(ca LN2 đỏ dưới bash 5 trên CI, cộng gộp `main` mang #278).

**Điều kiện tin cậy:** (i) không đổi thành phần đường verdict — diff của workflow lượt chấm nằm ở làn máy
(chạy nền, nhóm chạy-riêng, máy đọc dấu chưa-xong/quá-hạn) và ở bước tổng hợp (máy chèn mục carry);
không chạm finder, refute trong hợp đồng hay luật REJECT, không chạm `lib/`. (ii) Lượt chấm sai do
phép-đo-tự-dối giữa hai mốc: **0** — lượt 1 REJECT oan của `lenh-dai-chay-rieng` là mảnh suite chập chờn
(hạ tầng, đếm ở dòng 3), không phải phép đo tự dối; ngưỡng (a) đếm **0/2**. Dòng 4–5 cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở crm | hồ sơ có eval dài không còn mất lượt vì lệnh bị đọc thành «bị giết»; lượt sửa không còn phải vá tay mục rụng |
| 2 | ↓ ở crm | mục ngoài hợp đồng không biến mất khỏi thẻ nên người không phải hỏi lại «mục kia đâu» |
| 3 | ↓ | đúng lớp `lenh-dai-chay-rieng` chữa — crm mất bốn lượt vì nó |
| 4 | ↓ / vòng | ít lượt bị đốt hơn; mỗi lượt không đổi |
| 5 | ↑ nhẹ / lượt, ↓ / vòng | eval chạy-riêng tuần tự sau suite kéo dài đường găng của lượt; ít lượt bị đốt hơn |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .`.
**N không tăng so với mốc 2.24.0 (vẫn 1) — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.24.0 — 06/10/2026

Cửa sổ 2.23.0 → 2.24.0 nằm trong **một ngày** (06/10), có **hai vòng** được ký: `loc-paths-dong-mac-dinh`
(T3, PR #271) và `eval-thay-boi-co-chung` (T3, PR #272). Ngoài hồ sơ: ô `lo-trinh-cat-luot` mở và qua
Cổng Đáng (#274, #275). Kho chờ nhận là `crm`, neo ở hai hồ sơ crm: `go-khoa-goc-nhin` (bật
`stale_scope: paths` kèm lưới tạm `kiem-paths-dong.mjs`) và `gop-y-dung-cho` (25 eval máy đã ký ở năm hồ
sơ mất vật đo, làn ghim lại chết ở luật hai vế). Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên
`2.24.0`; `diagram-design` giữ `2.7.1`. Tag `v2.24.0` gắn tại commit ký mốc sau khi gộp.

**Vì sao 2.24.0, không 2.23.1:** một trường mới trong khuôn `evals.yaml` (`superseded_by`), một hậu tố mới
trên dòng `sha:` của mục Re-pin, và bộ lọc paths đổi kết luận trên kho đã bật khoá — hành vi mới.

### Bộ lọc hoá cũ theo paths đóng mặc định (hồ sơ `loc-paths-dong-mac-dinh`, T3)

- `risk_tiers.stale_scope: paths` chỉ bớt tệp khi MỌI mục `paths` của hồ sơ chứng được trên danh sách tệp git của bản đang kiểm; thư mục viết trơn có thật hiểu là cả thư mục. Mục lạ (`./`, `/` cuối, khoảng trắng, glob khớp thư mục) hay mục không trỏ tới tệp nào → hồ sơ giữ luật cũ, NOTE gọi tên mục và mã lý do (GUIDE §7.1). Hết ca cổng xanh mà sai của 2.21–2.23 (thư mục trần làm bộ lọc bỏ qua mọi tệp bên trong).
- Làn ghim lại đọc `paths` của ô ngoài làn máy bằng cùng bộ đọc và bộ phân loại của lib; danh sách `evals_not_machine_touched` chỉ có thể THÊM id so với trước (dòng trống, chú thích, thư mục trần, mục lạ nay được thấy).
- **Kho không bật khoá:** lưới trước-merge không đổi byte nào.
- **crm khi nhận:** gỡ lưới tạm `scripts/kiem-paths-dong.mjs` và bước CI «Paths đóng mặc định» trong `.github/workflows/acceptance.yml`; trước khi gỡ, chạy cả hai trên cùng cây — mọi mục lưới báo LỖI phải là mục bộ lọc từ chối, trừ thư mục viết trơn có thật (bộ lọc nhận như cả thư mục).

### Eval thay bởi hồ sơ đã ký (hồ sơ `eval-thay-boi-co-chung`, T3)

- Ô `test`/`script` khai `status: not-run` mang thêm `superseded_by: <hồ sơ thay>#AC-<n>` (khuôn ở GUIDE
  §7.1). Luật hai vế nhận ô đó — thay vì báo «hai vế mâu thuẫn» — khi máy chứng được ở CÂY ĐANG KIỂM: hồ sơ
  thay có chữ ký người (`signed-off`) và chưa nghỉ · **hồ sơ thay tự nêu thẻ `<slug cũ>/<id cũ>`** trong
  hợp đồng hoặc design doc của nó (bắt tay hai đầu) · AC được trỏ có trong hợp đồng thay và còn eval có mã
  thoát trong báo cáo đã ký của nó. Gãy điều nào → vẫn xung đột, thông điệp gọi tên điều gãy (chín mã lý do,
  GUIDE §7.1).
- Làn ghim lại, `recheck-evidence.cjs` và `pre-merge-check.sh` gọi chung một hàm; bên đọc kiểm lại chuỗi
  ở MỌI lượt — hồ sơ thay sau này nghỉ hay lùi trạng thái thì xung đột quay lại.
- Pin nói ra: dòng `sha:` của mục Re-pin nối ` · thay bởi hồ sơ đã ký: <E>→<hồ sơ>#<AC>` (vắng khi không có
  ô thay bởi); dòng JSON không thêm khoá.
- **Kho không khai trường mới:** lưới trước-merge và recheck giống từng byte bản trước (đo trên 110 hồ sơ của
  kit). Bộ máy cũ thấy con trỏ thì vẫn chặn — hướng an toàn.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI ĐỔI ba tệp:** `lib/evidence-core.cjs`, `scripts/pre-merge-check.sh`,
  `scripts/recheck-evidence.cjs` — chép lại theo INIT-CI-COPY-LIST (danh sách vẫn 17 tệp; luật thay bởi
  đọc thêm `lib/ac-line.cjs` và `lib/workspace-record.cjs`, cả hai đã có trong danh sách).
- **Máy dev:** cài lại plugin ở MỌI phạm vi trên mỗi máy có phiên của kho, kiểm từng bản ghi cây phụ.
- **crm, theo thứ tự:**
  1. Khai `superseded_by` cho 25 eval máy ở năm hồ sơ cũ (`the-gop-y-okr`, `khung-tao-okr-nhu-deal`,
     `tro-ly-okr-de-xuat`, `va-tro-ly-okr-sau-thu`, `nen-kara`) theo bảng `BANG-THAY-THE` của design doc
     `gop-y-dung-cho` — bảng đó đã nêu đủ thẻ `<hồ sơ>/<eval>` mà điều kiện bắt tay đòi; rồi ghim lại năm
     hồ sơ bằng một lượt làn. 11 eval ngoài làn máy của bảng không cần con trỏ.
  2. Gỡ lưới tạm `scripts/kiem-paths-dong.mjs` (kể cả nhánh «ĐÃ THAY» đọc bảng thay thế) và bước CI «Paths
     đóng mặc định» trong `.github/workflows/acceptance.yml`; trước khi gỡ, chạy lưới tạm và bộ lọc mới trên
     cùng cây — mọi mục lưới báo LỖI phải là mục bộ lọc từ chối, trừ thư mục viết trơn có thật.

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng — đủ ở hai hợp đồng và
`docs/research/known-limits-ledger.tsv`):

- `loc-paths-dong-mac-dinh` (5 mục + 1 hạt giống): kho không bật khoá mà bộ máy cài cũ hơn làn thì dòng ghim
  lại vắng danh sách ô ngoài làn máy bị chạm · cùng cấu hình, bộ máy trước 2.21 ghi sai «không khai paths» ·
  hai ca của chân trước-merge không phân biệt «bộ lọc nhận» với «rơi về luật cũ» · ô D6 dùng tên tệp chưa qua
  ngoặc git. Hạt giống `2026-10-06-hat-giong-ma-ly-do-rut-tu-ben-phat.md`: bộ kiểm tài liệu đối chiếu mảng
  mã khai báo, không đối chiếu chỗ phát mã.
- `eval-thay-boi-co-chung` (8 mục, ký sau dừng-vá lượt 2): phép đếm tổng của ma trận từ chối cộng một hằng ·
  ma trận neo vào `THAY_BOI_LY_DO` viết tay mà `chungThayBoi` không đọc — **cùng hình dạng với hạt giống của
  vòng kia** · hồ sơ thay đã được thực tế đóng nhận lý do «chưa ký» thay vì «đã khép» (chặn đúng, sai tên) ·
  năm mục độ chặt bộ kiểm (đối chứng dương trên bản sao, chiều đỏ của nhánh bốn đối số, đối chứng trước-merge
  của T05, mô tả E2 lệch số hàng). Không mục nào mở đường né đo.
- Lỗi thẻ giấu mục mang hậu tố ` (r<n>)` gặp lần 3 ở `eval-thay-boi-co-chung` (chuẩn hoá tay như 2.23.0);
  ngưỡng hạt giống `2026-10-03-hat-giong-bo-doc-ngoai-hop-dong-bo-dau-mang-sang.md` đã chạm, chưa mở ô (đóng
  băng meta-work) — chỗ cắt cho cửa sổ kế.

**Năm dòng số của luật (c)** — hai vòng (giờ VN; nguồn: giờ commit `contract.md`/`evidence-report.md`,
`usage-report.md` của hồ sơ):

| Dòng | `loc-paths-dong-mac-dinh` (T3) | `eval-thay-boi-co-chung` (T3) |
|---|---|---|
| Làm-xong→quyết-được | `implemented` 18:15 → ký 19:45 ≈ **1 giờ 30 phút**, gồm hai lượt chấm (≈ 81 phút máy); **2 lượt chấm** | `implemented` 18:29 → ký 20:04 ≈ **1 giờ 35 phút**, gồm hai lượt chấm (≈ 75 phút máy) và một điểm dừng-vá; chờ chữ ký sau `verified` 5 phút; **2 lượt chấm** |
| Lượt gọi người / vòng (trần T3 4) | Trong thiết kế **4** — Cổng Đáng · Cổng Phạm vi · Cổng 1.5 · ký Cổng Bằng chứng. Ngoài thiết kế: không đọc được từ kho (phiên khác) | Trong thiết kế **3** — Cổng Phạm vi · Cổng 1.5 · ký Cổng Bằng chứng (dừng-vá trình cùng lượt ký); Cổng Đáng ghi hộ từ câu giao việc. Ngoài thiết kế **1** — máy hỏi bật tự sửa CI ở S5. 1 chạm mỗi lượt. Owner tự gọi thêm: đối chiếu kit mới nhất trước khi duyệt, lệnh gộp |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0** — lượt 1 REJECT vì lưới «chỉ thêm» bắt dòng gọi bộ lọc bị sửa (phép đo thật) | **0** lượt chấm. Đường nền đầu vòng đỏ giả hai lần do máy (ghi tệp lúc suite chạy · tạo sẵn thư mục hồ sơ); CI `tests` đỏ một lần vì runner không mở được Chrome, chạy lại xanh |
| Token máy / vòng (out-token S4) · chứng-minh-vật / tìm-lỗi / tổng hợp | **60 931** · 64/10/26 % (34 554 · 26 377 theo lượt) | **77 091** · 40/35/25 % (41 214 · 35 877 theo lượt) |
| Phút máy / lượt chấm | 54 và 27 phút (3 237 s · 1 633 s), tổng ≈ 81 phút | 50 và 26 phút (2 981 s · 1 538 s), tổng ≈ 75 phút |

Phiên chính không đo token. Ngoài lượt chấm, `eval-thay-boi-co-chung` tốn thêm một lượt ghim lại sau chữ ký
(30 phút, 21 lệnh) vì hồ sơ đã ký `ra-co-ten-lam-va-trao` bị kéo vào diff (khai tệp ca vào khối gạch) và vì
gộp `main` mang thay đổi thư viện của vòng kia.

**Điều kiện tin cậy:** (i) không đổi thành phần đường verdict — diff cửa sổ ở engine chạm luật hai vế và bộ
lọc paths (`lib/evidence-core.cjs`), hai bên đọc (`recheck-evidence.cjs`, `pre-merge-check.sh`), làn ghim
lại, thân `acceptance-init` và SKILL feature-loop; KHÔNG chạm `acceptance-verify.js`, `s4-args.mjs`,
`lib/nhan-canh-gay.cjs`. (ii) Lượt chấm sai do phép-đo-tự-dối giữa hai mốc: **0** — ngưỡng (a) đếm **0/2**.
Dòng 4–5 cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở crm | năm hồ sơ mất vật đo ghim lại được thay vì treo; bộ lọc paths giữ phần tiết kiệm mà không cần lưới tạm |
| 2 | ↓ ở crm | không còn phải quyết tay «hồ sơ này chôn hay để đỏ» cho từng hồ sơ cũ |
| 3 | = | — |
| 4 | = | không chạm lượt chấm S4 |
| 5 | = | — |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .`.
**N không tăng so với mốc 2.23.0 — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.23.0 — 06/10/2026

Cửa sổ 2.22.0 → 2.23.0 kéo **ba ngày** (04–06/10), có **hai vòng** được ký: `nhan-lan-v-theo-huong`
(T2, PR #265) và `gia-lan-ghim-lai` (T2, PR #268). Ngoài hồ sơ: chiến dịch ghim lại 2.22.0 (#263) và một
bản sửa bước dọn của bộ đo trang lộ trình (#264). Kho chờ nhận là `crm`: neo ở hồ sơ crm
`kiem-cheo-sau-gop` (sự cố R1g — ~17 giờ từ ký tới gộp, ~14 giờ trong làn ghim lại); phiên điều phối
crm gọi mốc 06/10 ngay sau khi #268 gộp. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên
`2.23.0`; `diagram-design` giữ `2.7.1`. Tag `v2.23.0` gắn tại commit ký mốc sau khi gộp.

**Vì sao 2.23.0, không 2.22.1:** làn ghim lại có năm khoá mới, một mã thoát mới (4) và ba hành vi bật
mặc định — hành vi mới, không phải bản vá.

### Làn ghim lại rẻ hơn (hồ sơ `gia-lan-ghim-lai`, T2 — Vòng A)

Mọi điểm bật bằng khoá trong `_acceptance/config.yaml` (`feature_loop.*`); bảng khoá và gợi ý cho crm ở
GUIDE §7.1.

- **Ca chập chờn không còn làm đỏ cả lượt** (`repin_retry: 1`): lệnh đỏ được chạy lại **một lần, một
  mình**, sau khi khối song song xong; đạt lần hai → làn xanh, dòng pin có `chap_chon` gọi tên ca (rút từ
  năm khuôn đầu ra test phổ biến) và trỏ nhật ký lần đỏ. Lần hai vẫn đỏ → làn đỏ như cũ.
- **Eval gọi model thật không bao giờ chạy lại** (`model_evals: [<slug>/<E>]`) — kể cả khi một suite dùng
  chung nguyên văn câu lệnh với nó, ở env nào; mọi lần lệnh ấy chạy được đếm vào tổng kết.
- **Trần phút của làn** (`repin_budget_min`): quá trần → dừng cả cây tiến trình, ghi dòng `repin-do`
  (`ly_do: vuot-tran`, `chua_chay`; khi chạy với `--write`), **thoát mã 4**, không ghi pin. Đặt trần DƯỚI trần của công cụ gọi
  làn thì lượt kẹt để lại dấu thay vì biến mất.
- **Env giống CI cho suite** (`repin_ci_blank_env: [TÊN_BIẾN…]`): suite chạy với các biến tuỳ chọn đặt
  **rỗng** (thắng `.env` của Bun và `node --env-file`; `env -u` không mô phỏng được), eval vẫn chạy env đầy
  đủ — hai môi trường là hai phép đo. Dòng pin ghi `suites_env`.
- **Chi phí đo** (`repin_cost_cmd`): một lệnh in số dư trước và sau làn; hiệu số vào dòng tổng kết.

**Bật mặc định cho mọi kho (không cần khoá — duyệt ở Cổng Phạm vi):**

- Dòng **TỔNG KẾT** cuối mọi lượt: kết cục · phút · số lệnh · số lần gọi model thật · số ca chập chờn.
- Bị ngắt mềm (TERM/INT/HUP) → dòng `repin-do` với `ly_do: bi-ngat` (khi `--write`), thoát `128+n`.
- Mỗi lệnh chạy trong nhóm tiến trình riêng; dừng là giết **cả cây hậu duệ** (thu theo cha-con trước khi gửi
  tín hiệu, SIGTERM rồi SIGKILL sau 10 giây) — kể cả làn lồng trong eval.

Mã thoát của làn sau mốc: `0` xanh · `1` đỏ · `2` nguồn hỏng · `3` usage · **`4` vượt trần** · `128+n` bị ngắt.

Số trước → sau, dựng lại hai tình huống R1g trên fixture (AC-8, `_acceptance/gia-lan-ghim-lai/rang/so-do.mjs`):
ca chập chờn trong suite đỏ → xanh có tên ca · lượt bị ngắt giữa lệnh để lại dấu 0 → 1 · tiến trình con
sót sau ngắt 1 → 0 · lỗi chỉ hiện ở CI bắt được trên máy 0 → 1.

Đ1 (test chỉ làm hoá cũ hồ sơ gọi tên nó) và Đ2 (carry theo băm đầu vào) **không ở mốc này** — hạt giống
`docs/plans/2026-10-06-hat-giong-gia-lan-ghim-lai-vong-b.md`, mở sau khi đo lại trên crm không có E11.

### Thẻ làn V đọc theo hướng (hồ sơ `nhan-lan-v-theo-huong`, T2)

- Hồ sơ máy-đi-trước (cửa veto mở) in dòng **báo** `đi tiếp hay kéo lại: đi tiếp` — máy đã điền sẵn, người
  không phải gõ gì để để yên; nút đổi thành «Kéo lại». Ô «veto hay để yên» cũ làm owner đọc ngược ở crm.
- `/acceptance-gate:signoff` vẫn nhận `veto:` / `để yên` — người quen tay không mất lượt.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI KHÔNG đổi** (17 tệp như 2.22.0) — không chép gì.
- **Máy dev:** cài lại plugin ở MỌI phạm vi trên mỗi máy có phiên của kho, kiểm từng bản ghi cây phụ.
- **Muốn bật khoá làn ghim lại:** khai trong `_acceptance/config.yaml` theo GUIDE §7.1. Trước khi liệt
  `repin_ci_blank_env`, soát test tự bỏ qua theo khoá (`skipIf`): dưới env giống CI chúng sẽ bị bỏ qua trong
  làn như ở CI. Không khai khoá: chỉ nhận ba phần bật mặc định ở trên.

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng — đủ ở Notes của hai hợp đồng):

- `gia-lan-ghim-lai` (8 mục): ô «song song × env CI» của ma trận lệnh-dùng-chung chưa có phép phá riêng ·
  GUIDE §7.1 mang cột gợi ý riêng cho crm · gõ nhầm id trong `model_evals` không bị báo (eval model thật
  sẽ bị chạy lại) · lệnh chạy tách nhóm nên công cụ gọi làn giết theo nhóm không còn tới suite (làn tự giết
  cây khi nhận tín hiệu) · mẫu `repin-do` trong SKILL ghi `chap_chon: []` trái luật hiện diện · số chi phí có
  dấu phân cách nghìn bị đọc sai · ca vượt trần chỉ ghim mã thoát · lời hứa «vượt trần không ghi pin» đo ở
  chế độ không ghi. Tiến trình tách hẳn khỏi cây (double-fork) vẫn thoát lưới giết.
- `nhan-lan-v-theo-huong` (1 mục): ca `NC-AC4-cu` neo commit lõi, không phủ hai commit vá sau của vòng cũ.
- Lỗi kit phát hiện ở Cổng 2 của `gia-lan-ghim-lai`: thẻ giấu mục ngoài hợp đồng mang hậu tố ` (r<n>)`
  (bên viết nối hậu tố sau `**`, bên đọc không nhận) — việc riêng đã tách; tới khi sửa, đếm tay số mục khối
  «Ngoài hợp đồng» với số Ngoài-n trên thẻ trước khi ký.

**Năm dòng số của luật (c)** — hai vòng (giờ VN; nguồn: giờ commit `contract.md`, `decisions.jsonl`,
`run-log.jsonl`, `usage-report.md` của hồ sơ; token đầu ra S4 đọc lại bằng `wf-usage --json`):

| Dòng | `nhan-lan-v-theo-huong` (T2) | `gia-lan-ghim-lai` (T2) |
|---|---|---|
| Làm-xong→quyết-được | `implemented` 20:11 04/10 → ký 04:01 05/10 ≈ **7 giờ 50 phút**, gồm hai lượt chấm (≈ 58 phút máy) và chờ chữ ký qua đêm 6 giờ 38 phút (`verified` 21:23 → ký 04:01); **2 lượt chấm** | `implemented` 12:03 06/10 → ký 16:04 06/10 ≈ **4 giờ 1 phút**, gồm ba lượt chấm (≈ 111 phút máy), một điểm dừng-vá và chờ chữ ký ≈ 1 giờ 40 phút (`verified` 14:24 → ký 16:04); **3 lượt chấm** |
| Lượt gọi người / vòng (trần T2 3) | Trong thiết kế **1** — ký Cổng Bằng chứng; Cổng Phạm vi làn V. Ngoài thiết kế **0**. 1 chạm | Trong thiết kế **3** — Cổng Phạm vi · dừng-vá (lượt 2 cùng lớp lỗi lượt 1) · ký Cổng Bằng chứng. Ngoài thiết kế **1** — câu hỏi thiết kế ở S1 (Đ3 THAY hay THÊM). 1 chạm mỗi lượt. Owner tự gọi thêm (không tính máy hỏi): rà theo North Star, bảng so sánh trước/sau, thu phạm vi về Vòng A qua phiên điều phối |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0** — lượt 1 REJECT vì phép đo của chính vòng | **0** — lượt 1 và 2 REJECT vì finding thật trong hợp đồng. Lượt 2 còn một suite đỏ vì sổ known-limits thiếu dòng cho đề xuất của chính hồ sơ (ca P179) — không phải lý do REJECT |
| Token máy / vòng (out-token S4) · chứng-minh-vật / tìm-lỗi / tổng hợp | **47 442** · 52/20/29 % (29 081 · 18 361 theo lượt) | **111 702** · 58/14/28 % (45 163 · 37 698 · 28 841 theo lượt) |
| Phút máy / lượt chấm | 28–30 phút (1 692–1 811 s), tổng ≈ 58 phút; găng 1 540–1 738 s | 32–46 phút (1 945–2 731 s), tổng ≈ 111 phút; găng 1 808–2 605 s |

Phiên chính không đo token.

**Điều kiện tin cậy:** (i) không đổi thành phần đường verdict — diff cửa sổ ở engine chạm làn ghim lại
(`feature-loop/scripts/repin-lane.mjs` + ba thư viện mới), thẻ (`scripts/gate-card.js`), thân lệnh
`signoff`/`acceptance-init`, SKILL feature-loop và bản luật ngôn ngữ mặt người; KHÔNG chạm
`acceptance-verify.js`, `s4-args.mjs`, `lib/nhan-canh-gay.cjs`, `recheck-evidence.cjs`, `pre-merge-check.sh`.
(ii) Lượt chấm sai do phép-đo-tự-dối giữa hai mốc: **0** — ngưỡng (a) đếm **0/2**. Dòng 4–5 cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở crm | làn ghim lại không còn chết vì một ca chập chờn rồi chạy lại cả lượt (R1g: ~14 giờ trong làn) |
| 2 | ↓ ở crm | lượt kẹt để lại dấu và tổng kết thay vì người phải hỏi «làn đang ở đâu»; thẻ làn V không còn ô mời gõ |
| 3 | = | — |
| 4 | = | không chạm lượt chấm S4 (làn ghim lại nằm ngoài S4) |
| 5 | = | — |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .`.
**N không tăng so với mốc 2.22.0 — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.22.0 — 04/10/2026

Cửa sổ 2.21.0 → 2.22.0 kéo **hai ngày** (03–04/10), có **một vòng** được ký, chạm engine đúng một tệp:
`trang-lo-trinh-doc-mot-phut` (T2, ô PR #259, vật PR #260, Cổng Giá trị «release» PR #261). Ngoài hồ sơ:
chiến dịch ghim lại 2.21.0 (#257) và ghi chú mốc (#254). Kho chờ nhận là `crm`: neo ở hồ sơ crm
`cap-nhat-tuan-okr`, owner quyết 04/10 «gửi crm, ngay sau khi cắt 2.22.0». Mốc đi **làn V**, không dựng
răng mới. Hai gói cùng lên `2.22.0`; `diagram-design` giữ `2.7.1`. Tag `v2.22.0` gắn tại commit ký mốc
sau khi gộp.

**Vì sao 2.22.0, không 2.21.1:** trang lộ trình đổi bố cục và chữ mà người dùng đọc — một hành vi mới,
không phải một bản vá.

### Trang lộ trình đọc trong một phút (hồ sơ `trang-lo-trinh-doc-mot-phut`, T2)

- `LO-TRINH.html` mở bằng **một thẻ mỗi lộ trình**: làm tiếp (mã + câu giao + lệnh mở chép được) · số chỗ
  cần sửa trong kế hoạch · mốc kế tiếp kèm số ngày còn lại (mốc đã qua mà còn việc chưa giao thì nêu tên)
  · tiến độ (đã giao · đang làm · chưa bắt đầu, nhóm khác hiện riêng khi có).
- Mỗi lộ trình một mục: **chỗ cần sửa** bằng tiếng sản phẩm (câu cờ máy dịch bằng một bảng, mỗi chỗ là
  liên kết tới đúng hàng) → việc còn mở → **việc đã giao gập lại** → dải mốc. Hồ sơ không thuộc kế hoạch
  nào **gập ở cuối trang, một lần** cho cả trang.
- Đọc được trên điện thoại (bảng thành thẻ hàng), tiêu đề cột dính khi cuộn, sáng/tối theo máy.
- Trang vẫn tĩnh và tất định: một script nội tuyến duy nhất tính số ngày lúc xem; tắt script trang vẫn đủ.
- Đo trên crm `onehub` thật: **2.879 / 11.587 px** ở 1440, màn đầu đủ ba điều ở 1440 và 375, tương phản
  thấp nhất 6,35 (trang cũ 1,91 ở tối), vùng bấm 44 px.
- **Không đổi:** lớp phân tích, thẻ `/acceptance-gate:start`, `--hang`, `--mo-o` (ca LT-100 so khớp với bộ
  máy `v2.21.0`). **Kho không khai lộ trình:** bản đồ và thẻ giữ từng byte.
- Bộ đo trang trên Chrome thật đi kèm kit: `tests/scripts/lo-trinh-do-trang.mjs` (CDP, ngày đóng băng).

**Kho tiêu thụ làm gì khi nhận:**

- **Kho còn đường chép: chép lại MỘT tệp** của lớp chép CI — `scripts/lo-trinh.mjs` (danh sách vẫn 17
  tệp). Đo trước → sau bằng phép vi phân.
- **Kho khai lộ trình:** `LO-TRINH.html` đổi một lần khi nhận — chạy `product-map.mjs --root .` trong PR
  nhận mốc rồi commit trang; `--check` đỏ cho tới khi vẽ lại. Kho không khai: không làm gì thêm.
- **Máy dev:** cài lại plugin ở MỌI phạm vi trên mỗi máy có phiên của kho, kiểm từng bản ghi cây phụ.

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng — đủ ở Notes của hợp đồng):

- Dải mốc sắp ngày theo chuỗi: ngày thiếu số 0 (`2026-10-5`) xếp sai, ô «Mốc kế tiếp» có thể chỉ mốc xa
  hơn. Dữ liệu crm thật mọi ngày đủ số 0.
- Năm điểm độ chặt của thước (đường dẫn khai ở eval, đối chứng dương LT-100, ca cột có dữ liệu phải hiện,
  câu lỗi mong đợi rút từ hàm dịch, LT-73-khong-truong-do không ghim thông điệp).
- Đề xuất bản chiếu ReUI của trang (owner xem bản mẫu 04/10): hạt giống
  `docs/plans/2026-10-04-hat-giong-ban-chieu-reui-trang-lo-trinh.md` — kit chỉ xuất JSON, trang ReUI sống
  ở kho tiêu thụ, mã block Pro không vào kit.

**Năm dòng số của luật (c)** — một vòng (giờ VN, 03–04/10; nguồn: giờ commit `contract.md`,
`decisions.jsonl`, `run-log.jsonl`, `usage-report.md` của hồ sơ):

| Dòng | `trang-lo-trinh-doc-mot-phut` (T2) |
|---|---|
| Làm-xong→quyết-được | 22:50 03/10 → ký 04:32 04/10 ≈ **5 giờ 42 phút**, gồm ba lượt chấm (≈ 65 phút máy) và khoảng chờ chữ ký qua đêm 4 giờ 15 phút (`verified` 00:17 → ký 04:32); **3 lượt chấm** |
| Lượt gọi người / vòng (trần T2 3) | Trong thiết kế **2** — Cổng Đáng · ký Cổng Bằng chứng; Cổng Phạm vi làn V. Ngoài thiết kế **0**. 1 chạm mỗi lượt. Sau ký: Cổng Giá trị «release» (owner xem lại giao diện và bản mẫu ReUI trước khi quyết — owner tự gọi, không phải máy hỏi) |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0** — lượt 1 và 2 REJECT vì finding thật trong hợp đồng. Sau chữ ký một lượt CI đỏ vì phông chữ Ubuntu làm một bản sao chiều đỏ phá thêm thước (sửa nhát tiêm, ghim lại ba hồ sơ) — không phải lượt chấm |
| Token máy / vòng (out-token S4) · chứng-minh-vật / tìm-lỗi / tổng hợp | **153 849** · 48/20/32 % (54 105 · 54 470 · 45 274 theo lượt) |
| Phút máy / lượt chấm | 20–24 phút (1 230–1 420 s), tổng ≈ 65 phút; găng 1 063–1 234 s |

Phiên chính không đo token. Cổng Đáng tính vào «trong thiết kế» theo tiền lệ 2.20.0.

**Điều kiện tin cậy:** (i) không đổi thành phần đường verdict — diff cửa sổ ở engine chỉ là
`scripts/lo-trinh.mjs` (lớp vẽ), không chạm `acceptance-verify.js`, `s4-args.mjs`, `lib/nhan-canh-gay.cjs`,
`recheck-evidence.cjs`, `pre-merge-check.sh`. (ii) Lượt chấm sai do phép-đo-tự-dối giữa hai mốc: **1** —
lượt 1 chấm E5 ĐẠT từ dòng tổng kết của một lệnh không bao giờ in dòng ghim LT-94 (eval trỏ nhầm mảnh);
lượt 2 bắt, lượt 3 tách eval theo lệnh. Ngưỡng (a) đếm **1/2** — chưa mở vòng đo-thước. Dòng 4–5 cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | = | không chạm đường từ làm-xong tới cổng |
| 2 | ↓ ở crm | màn đầu trang lộ trình trả lời làm gì tiếp · kẹt gì · lệch gì trong một phút — câu hỏi tiến độ (lượt 4 OKR: 23/48 tin owner) đọc được thay vì hỏi |
| 3 | = | — |
| 4 | = | không chạm lượt chấm |
| 5 | = | — |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .`.
**N không tăng so với mốc 2.21.0 — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.21.0 — 03/10/2026

Cửa sổ 2.20.0 → 2.21.0 kéo **hai ngày** (02–03/10), có **năm vòng** được ký, cả năm chạm engine:
`viec-ke-theo-plan` (T2, PR #246) và `lo-trinh-tren-du-lieu-that` (T2, PR #252, Cổng Giá trị «release»
PR #253) — lộ trình cạnh bản đồ; `loi-moi-tran-luot-loi-song-co-gia` (T2, PR #247) — lối ra ở trần lượt;
`lan-ghim-lai-giu-tron-loi-loi` (T2, PR #250) và `lan-ghim-lai-theo-paths` (T3, PR #255) — làn ghim lại.
Thêm `diagram-design` 2.7.1 (xuất PNG gọi `python3`, e2df88ff) và sáu PR không gắn hồ sơ (bàn giao, hạt
giống, ô, một ca kiểm DK15). Kho chờ nhận là `crm`: lộ trình neo ở hồ sơ crm `cap-nhat-tuan-okr`, làn
ghim lại neo ở số đo chi phí làn của crm 02/10. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên
`2.21.0`; `diagram-design` lên `2.7.1`. Tag `v2.21.0` gắn tại commit ký mốc sau khi gộp.

**Vì sao 2.21.0, không 2.20.1:** cửa sổ thêm hành vi mới cho người dùng — ổ cắm lộ trình, dòng thẻ start
mới, khối «Lối ra» trên thẻ, hai khoá cấu hình mới của làn ghim lại.

### Lộ trình cạnh bản đồ (hồ sơ `viec-ke-theo-plan` + `lo-trinh-tren-du-lieu-that`, T2)

- Kho khai `lo_trinh.tep` trong `_acceptance/config.yaml` (một tệp, hoặc một danh sách) trỏ tệp ý định
  JSON (khuôn `skills/acceptance/references/lo-trinh-template.json`). Kit chỉ **đọc**; trạng thái từng hàng
  suy từ hồ sơ bằng đúng hàm xếp ô của bản đồ, lời tự khai so theo **nhóm** (đã giao · đang làm · chưa
  làm), hàng nối hồ sơ hai chiều (`slug` của hàng, hoặc ô cơ hội ghi `lo_trinh_ma`).
- `LO-TRINH.html` vẽ cạnh `PRODUCT-MAP.md` ở bốn lệnh đóng cổng; `--check` canh nó. Thẻ
  `/acceptance-gate:start` in các dòng máy dựng sẵn (hàng kế · hàng trễ · tin theo lời · cờ · đường mở
  trang) và đặt hàng kế làm một lựa chọn mở. `/feature-loop:feature-loop <mã hàng>` dựng ô cơ hội từ hàng
  (ngưỡng đề xuất từ `bat_khi` và ngày mốc) rồi dừng ở Cổng Đáng.
- Đo trên crm `onehub` + lộ trình OKR: hàng kế đúng, 8 cờ, 0 nhiễu (lát 1: hàng kế sai, 18 cờ, 11 nhiễu).
- **Kho không khai:** bản đồ và thẻ giữ từng byte; mã lộ trình không được nạp.

### Lối ra ở trần lượt (hồ sơ `loi-moi-tran-luot-loi-song-co-gia`, T2)

- Thẻ Cổng Bằng chứng chưa-ký-được in khối «Lối ra» — lối sống, có giá, khuyến nghị tất định — khi vòng
  chạm trần lượt hoặc một eval hỏng lặp lại (`scripts/loi-ra-tran-luot.cjs`). Thẻ ký được không đổi.

### Làn ghim lại theo `paths` + suite song song (hồ sơ `lan-ghim-lai-theo-paths`, T3)

- Khoá `risk_tiers.stale_scope: paths` (mặc định tắt): hoá cũ chỉ khi diff chạm `paths` các eval — bộ lọc sau luật cũ, chỉ thu; NOTE gọi tên tệp bỏ qua. Hàm một nguồn `staleByPaths` (`lib/evidence-core.cjs`) cho lưới trước-merge và `--skip-unchanged`.
- Cờ `--stale-all` cho `pre-merge-check.sh` — chiến dịch ghim lại ở mốc ép luật cũ.
- Khoá `feature_loop.repin_parallel_suites: true` (mặc định tắt): suite trong làn chạy song song, eval nối đuôi.
- **Kho tiêu thụ:** không bật khoá thì không đổi gì; bộ máy làn chỉ đòi `staleByPaths` khi kho bật khoá.
- **Chưa bật `stale_scope: paths`:** mục `paths` là thư mục trần (không dấu sao) làm bộ lọc bỏ qua mọi tệp trong thư mục — cổng xanh mà sai (crm có dạng này). Làm lại theo khuôn đóng mặc định: hạt giống `docs/plans/2026-10-03-hat-giong-loc-paths-dong-mac-dinh.md`.

### Làn ghim lại giữ trọn lời lỗi (hồ sơ `lan-ghim-lai-giu-tron-loi-loi`, T2)

- Lệnh đỏ trong `repin-lane.mjs` ghi nhật ký trọn ra `.acceptance-runs/<slug>/repin-<run_id>/`; lệnh xanh không sinh tệp.
- Làn đỏ `--write` để một dòng `kind: repin-do` mỗi slug (mã lượt dưới `lan_id` · lệnh đỏ · mã · nhật ký · `wall_s` · `so_lenh` · tải máy); pin và evidence không đổi; mã thoát không đổi. Mã lượt đỏ KHÔNG mang khoá `run_id` nên không bao giờ thành bằng chứng eval.
- Thư mục `.acceptance-runs/` tự đặt `.gitignore` (`*`) khi làn tạo nó — kho chưa khai không còn bị nhật ký lọt vào git.
- Dòng `kind: repin` mang thêm `wall_s` và `so_lenh` (khuôn `REPIN-TEMPLATE` cập nhật).
- Mô-đun mới `feature-loop/scripts/tai-may.mjs` (không bao giờ ném). `.acceptance-runs/` vào `.gitignore` của kit.

**Kho tiêu thụ làm gì khi nhận:**

- **Kho còn đường chép: chép lại năm tệp** của lớp chép CI (GUIDE §5.3) — danh sách nay **17 tệp** (thêm
  `scripts/lo-trinh-khoa.cjs`, `scripts/lo-trinh.mjs`); trong đó đổi so 2.20.0: hai tệp mới ấy,
  `scripts/pre-merge-check.sh`, `scripts/product-map.mjs`, `lib/evidence-core.cjs`. Đo trước → sau bằng
  phép vi phân, không đọc số tuyệt đối.
- **Máy dev:** cài lại plugin ở MỌI phạm vi trên mỗi máy có phiên của kho, kiểm từng bản ghi cây phụ.
- **Muốn dùng lộ trình:** viết tệp ý định JSON, khai `lo_trinh.tep`, thêm `LO-TRINH.html` vào
  `risk_tiers.t1_skip_globs` cạnh `PRODUCT-MAP.md`. Viết danh sách tệp có thụt (`    - a.json`) hoặc
  dạng dòng (`[a.json, b.json]`) — dạng sát lề chưa đọc được (giới hạn dưới).
- **Đừng bật `stale_scope: paths`** cho tới khi hạt giống đóng mặc định được thi công.

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng từng vòng — đủ ở Notes của năm hợp đồng):

- Khoá `lo_trinh.tep` có mặt mà không đọc ra tệp nào (danh sách YAML sát lề) thì kit im như chưa khai —
  hạt giống `docs/plans/2026-10-03-hat-giong-khoa-lo-trinh-khai-ma-khong-doc-ra.md`.
- `stale_scope: paths` có mã nhưng chưa bật: thư mục trần trong `paths` làm bộ lọc bỏ qua.
- Ca P179 (sổ known-limits ít hơn số đề xuất) đốt hai lượt chấm trong cửa sổ — cùng một lớp hai lần.

**Năm dòng số của luật (c)** — năm vòng (giờ VN, 02–03/10; nguồn: giờ commit `contract.md`,
`decisions.jsonl`, `run-log.jsonl`, `usage-report.md` của từng hồ sơ):

| Dòng | `viec-ke-theo-plan` (T2) | `lo-trinh-tren-du-lieu-that` (T2) | `loi-moi-tran-luot-loi-song-co-gia` (T2) | `lan-ghim-lai-giu-tron-loi-loi` (T2) | `lan-ghim-lai-theo-paths` (T3) |
|---|---|---|---|---|---|
| Làm-xong→quyết-được | 22:20 → ký 06:19 ≈ **7 giờ 59 phút**, gồm hai «trả» và một khoảng chờ qua đêm 4 giờ 46 phút; `verified` → ký 3 phút; **5 lượt chấm** | 09:46 → ký 14:56 ≈ **5 giờ 9 phút**, gồm khoảng chờ 4 giờ 3 phút trước «trả»; `verified` → ký 15 phút; **2 lượt** | 06:31 → ký 07:29 ≈ **58 phút**; `verified` → ký 4 phút; **2 lượt** | 06:51 → ký 10:01 ≈ **3 giờ 10 phút**; `verified` → ký 19 phút; **4 lượt** (lượt 4 vượt trần, owner cho phép đích danh) | 14:27 → ký 17:32 ≈ **3 giờ 5 phút**; `verified` → ký 4 phút; **4 lượt** (lượt 4 vượt trần, owner cho phép đích danh) |
| Lượt gọi người / vòng (trần T2 3 · T3 4) | Trong thiết kế **4** — Cổng Đáng · Cổng Bằng chứng ba lần («trả» · «trả» · ký); Cổng Phạm vi làn V. Ngoài thiết kế **0**. 1 chạm mỗi lượt | Trong thiết kế **3** — Cổng Đáng · «trả» · ký; Cổng Phạm vi làn V. Ngoài thiết kế **0**. Sau ký: Cổng Giá trị «release» | Trong thiết kế **2** — Cổng Phạm vi (vòng CỘNG, owner duyệt) · ký. Ngoài thiết kế **0**; lời mở vòng không có dòng sổ — không đọc được ở đây | Trong thiết kế **3** — Cổng Đáng · «trả» · ký; Cổng Phạm vi làn V. Ngoài thiết kế **1** — dừng-vá sau lượt 2, owner chọn «đổi khuôn», 1 chạm | Trong thiết kế **5** — Cổng Đáng · Cổng Phạm vi · Gate 1.5 · «trả» · ký. Ngoài thiết kế **1** — dừng-vá sau lượt 2, «đổi khuôn», 1 chạm. **6 so trần 4** |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **1** — lượt 2 REJECT chỉ vì ca P179 (sổ known-limits 386 < 388), vật không đổi | **0** | **0** | **0 lượt thêm** — lượt 2 REJECT có P179 nhưng còn 5 finding trong hợp đồng, đằng nào cũng chấm lượt 3 | **0** |
| Token máy / vòng (out-token S4) · chứng-minh-vật / tìm-lỗi / tổng hợp | **167 904** · 45/20/35 % | **67 899** · 52/18/30 % | **63 452** · 47/22/32 % | **178 990** · 40/29/32 % | **163 564** · 46/25/30 % |
| Phút máy / lượt chấm | 21–27 phút (1 240–1 591 s), tổng ≈ 116 phút; găng 1 149–1 459 s | 20–21 phút, tổng ≈ 41 phút; găng 1 093–1 159 s | 24–28 phút, tổng ≈ 52 phút; găng 1 304–1 558 s | 21–22 phút, riêng lượt 2 **62 phút** (bước tổng hợp kéo 2 465 s), tổng ≈ 126 phút; găng 1 085–1 190 s | 20–24 phút, tổng ≈ 87 phút; găng 1 036–1 289 s |

Cả cửa sổ: 15 lượt chấm, 641 809 out-token S4. Phiên chính của cả năm vòng không đo token. Cổng Đáng tính
vào «trong thiết kế» (trần = số cổng thiết kế: Đáng · Phạm vi · Bằng chứng, T3 thêm Gate 1.5); dừng-vá
không phải một cổng nên xếp ngoài thiết kế, theo tiền lệ 2.20.0. **Ba vòng vượt trần lượt gọi người**
(`viec-ke-…` 4/3, `lan-ghim-lai-giu-…` 4/3, `lan-ghim-lai-theo-paths` 6/4): mọi lượt vượt là «trả» ở
Cổng Bằng chứng hoặc dừng-vá — lỗi trong vật hay thước bị bắt tại cổng, không phải lượt hỏi xác nhận.

**Điều kiện tin cậy:** (i) không vòng nào đổi thành phần đường verdict — diff cửa sổ không chạm
`acceptance-verify.js`, `s4-args.mjs`, `lib/nhan-canh-gay.cjs`, `recheck-evidence.cjs`.
`lan-ghim-lai-theo-paths` đổi luật HOÁ CŨ (`pre-merge-check.sh`, `lib/evidence-core.cjs`) kèm răng hai
chiều: chiều im (khoá tắt → đầu ra bằng hệt bản base; `--stale-all` bằng hệt luật cũ), chiều đỏ (ma trận
15 ô, tiêm lỗi môi trường). `loi-moi-tran-luot-…` chỉ thêm khối trên thẻ chưa-ký-được, răng hai chiều
(đỏ AC-1/2/4 + đột biến; im AC-3/6 bằng từng byte). (ii) Lượt chấm sai do phép-đo-tự-dối giữa hai mốc:
**0** — mọi finding nhắm vào thước đều bị bắt trong chính lượt đó. Dòng 4–5 cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | = | không chạm đường từ làm-xong tới cổng |
| 2 | ↓ ở crm | lộ trình trả lời câu hỏi tiến độ trên thẻ start (lượt 4 OKR: 23/48 tin owner là hỏi tiến độ); khối «Lối ra» cho người một lựa chọn có giá thay vì hỏi mở ở trần lượt |
| 3 | = | — |
| 4 | = | không chạm lượt chấm |
| 5 | ↓ ở làn ghim lại khi kho bật suite song song | `repin_parallel_suites` (mặc định tắt) |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .`.
**N không tăng so với mốc 2.20.0 — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.20.0 — 01/10/2026

Cửa sổ 2.19.0 → 2.20.0 kéo **hai ngày**, có **ba vòng** chạm engine: `thuoc-biet-truoc-khong-phan-duoc`
(T2, ký 01/10, PR #233), `luot-cham-ghi-vao-cay` (T3, ký 01/10, PR #234) và `nghi-van-mang-co-qua-han`
(T2, máy thông 01/10, cửa veto mở, PR #232) — vòng thứ ba là suất meta duy nhất của cửa sổ, mở theo lời
owner giữa lượt chấm của vòng thứ nhất. Thêm PR #231 sửa một dòng `CONTEXT.md`. Kho chờ nhận là `crm`:
ba neo của cửa sổ đều là hồ sơ crm. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên `2.20.0`;
`diagram-design` giữ `2.7.0`. Tag `v2.20.0` gắn tại commit ký mốc sau khi gộp.

**Vì sao 2.20.0, không 2.19.1:** cửa sổ thêm hành vi mới ở đường chấm — bước chuẩn bị tham số từ chối một
loại eval, bộ chấm có một nhãn trạng thái mới, lưới trước-merge và bộ kiểm lại bằng chứng đọc nhãn đó.

**Đổi gì** — đường chấm thôi tin hai thứ nó không kiểm được:

- **Giám khảo chỉ được hỏi điều nằm trong danh sách tệp.** Hội đồng chấm chỉ đọc đúng `inputs`, không
  diff, không lệnh — nên một eval `judgment` hỏi diff của lượt hay bảo chạy lệnh là câu không ai trả lời
  được. Nay `s4-args.mjs` thoát 2, gọi tên eval, thay vì để nó thành UNCERTAIN mà người phải quyết lại.
  Luật đi kèm: **chọn người chấm theo từng vế** của tiêu chí — vế một lệnh đọc được giao cho
  script/test của kho, vế chỉ thấy trên màn giao ui-check, vế cần cân với ý định trên một tệp giao
  judgment với đúng tệp đó, vế không ai đọc được thì khai giới hạn ngay lúc viết.
- **Lượt chấm mà cây đổi giữa chừng không dùng được.** Khi tác tử chấm ghi vào cây (commit lạ, hoặc sửa
  tệp vật đang theo dõi), lượt mang nhãn «cây đổi trong lượt chấm»: bước sau-lượt thoát 6, thẻ Cổng Bằng
  chứng khoá ký và in tệp + sha, lưới trước-merge và bộ kiểm lại bằng chứng chặn hồ sơ đã ký trên lượt
  ấy. Máy chấm lại cùng round; lượt kế chỉ được sinh tham số khi thay đổi lạ đã được hoàn lại.
- **Hồ sơ đã nghỉ thôi làm đỏ bộ kiểm theo ngày.** Ca RT13 từng đỏ trên `main` từ 01/10 chỉ vì timebox
  của một hồ sơ đã nghỉ đã qua; bộ quét thẻ khởi động nay tính cờ quá hạn cho cả lối nghỉ.

**Kho tiêu thụ làm gì khi nhận:**

- **Kho còn đường chép: chép lại ba tệp** của lớp chép CI (GUIDE §5.3) — `lib/nhan-canh-gay.cjs`,
  `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` — trong một PR, đo trước → sau bằng phép vi
  phân (bản chép cũ so bản mới), không đọc số tuyệt đối.
- **Máy dev:** cài lại plugin ở MỌI phạm vi trên mỗi máy có phiên của kho, rồi mở lại phiên. Cây phụ
  (worktree) có bản ghi cài riêng: kiểm từng bản ghi bằng `claude plugin list --json`, đừng tin câu «đã
  mới nhất» — câu ấy từng bỏ sót hai cây phụ ở 2.19.0.
- **Nhận ở ranh giới vòng.** Hồ sơ đang mở có eval `judgment` hỏi diff hoặc bảo chạy lệnh sẽ bị chặn ở
  lượt chấm kế — quét trước bằng `docs/findings/assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs`,
  chuyển vế đó sang script/test của kho.

**Giới hạn đã khai** (owner quyết ở Cổng Bằng chứng của từng vòng, 01/10 — đủ ở Notes của ba hợp đồng):

- Kiểm «đã hoàn lại» băm tệp khác cách ảnh chụp với liên kết mềm bẩn sẵn; tệp mới chưa theo dõi sinh
  trong lượt chỉ được gọi tên, không khoá lượt.
- Bộ kiểm lại bằng chứng chặn «cây đổi» trước lối miễn hồ sơ nghỉ — lệch thứ tự với lưới trước-merge.
- Ma trận RT13 chưa phủ ba lối «đã xong» còn thiếu cờ quá hạn; kiểm «bộ dò một nguồn» chỉ bắt bản sao
  nguyên chữ; phạm vi `paths` của eval E5 hẹp hơn tập thư mục nhóm JI12 quét.

**Năm dòng số của luật (c)** — ba vòng (giờ VN, 01/10):

| Dòng | `thuoc-biet-truoc-khong-phan-duoc` (T2) | `nghi-van-mang-co-qua-han` (T2) | `luot-cham-ghi-vao-cay` (T3) | Nguồn |
|---|---|---|---|---|
| Làm-xong→quyết-được | `implemented` 09:25 → ký 11:17 ≈ **1 giờ 52 phút**, hai lượt chấm; `verified` → ký 5 phút | `implemented` 09:57 → máy thông 10:33 ≈ **36 phút**, không người | `implemented` 18:08 → ký 22:55 ≈ **4 giờ 47 phút**, gồm khoảng máy đóng giữa lượt chấm; `verified` → ký 5 phút | giờ commit `contract.md` |
| Lượt gọi người / vòng | Trong thiết kế **1** (Cổng Bằng chứng; Cổng Phạm vi đi làn V). Ngoài thiết kế **1** — «ok» sửa RT13 ở PR riêng giữa lượt chấm (sổ `d-20261001T025809Z-11`), 1 chạm | **0** — làn V cả hai cổng; lời mở vòng đã đếm ở cột trái | Trong thiết kế **3** (Cổng Phạm vi · Gate 1.5 · Cổng Bằng chứng; trần T3 = 4). Gate 1.5 không có chữ duyệt — owner chỉ dán dòng `/goal`, máy hiểu là duyệt (sổ `d-20261001T103918Z-9`). Ngoài thiết kế **0** | `decisions.jsonl` |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **1** — lượt 1 REJECT chỉ vì suite vùng 3 đỏ sẵn ở RT13, ngoài vật (sổ `d-20261001T024953Z-10`) | **0** | **0** — lượt chấm 1 bị ngắt vì đóng máy rồi nối lại; máy của người, không phải hạ tầng kit | `run-log.jsonl` · sổ |
| Token máy / vòng (out-token S4) | **71 526** (lượt 1: 39 644 · lượt 2: 31 882). Chứng-minh-vật 60 % / 64 % — tìm-lỗi 21 % / 10 % — tổng hợp 18 % / 26 % | **17 767**. Chứng-minh-vật 73 % — tìm-lỗi 8 % — tổng hợp 18 % | **61 923**. Chứng-minh-vật 56 % — tìm-lỗi 33 % — tổng hợp 12 %. Cache-read làn rà soát ≈ 15,0 M | `usage-report.md` |
| Phút máy / lượt chấm | **21 phút** mỗi lượt (1 256 s · 1 269 s); đường găng chứng-minh-vật 1 160 s · 1 183 s | **20 phút** (1 176 s); găng 1 138 s | **không đọc được ở đây** — tường 16 833 s gồm khoảng máy đóng; usage-report không tách phút chạy thật | `usage-report.md` |

Phiên chính của cả ba vòng không đo token. Tỉ lệ ba khối làm tròn nên có thể cộng ra 99 %.

**Điều kiện tin cậy:** (i) `luot-cham-ghi-vao-cay` ĐỔI thành phần đường verdict — thêm nhánh «không dùng
được» sau fan-out — nên dòng 4–5 chỉ cắt được vì vòng mang răng cả hai chiều: chiều đỏ AC-2 (ma trận cây
đổi viết trước), chiều im AC-3 (chỉ đổi thứ không phải vật — `.acceptance-runs/`, `evidence/` của chính
hồ sơ, không đổi gì — thì không có dòng `cay-doi`, thoát 0), mỗi AC máy kèm đột biến ở răng hồ sơ.
`thuoc-biet-truoc-khong-phan-duoc` KHÔNG đổi thành phần — răng nằm trước lượt chấm, `acceptance-verify.js`
không đổi. (ii) Số lượt chấm sai do phép-đo-tự-dối giữa hai mốc: **0** — lượt REJECT của
`thuoc-biet-…` là đỏ đúng của một ca kiểm đỏ sẵn, đã đếm ở dòng 3. Dòng 4–5 cắt được, trừ ô phút của
`luot-cham-ghi-vao-cay`.

**Dự báo năm dòng cho thay đổi của mốc này** (chép chiều từ hợp đồng của hai vòng ký):

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở kho tiêu thụ | người thôi tự đọc diff cho mục luật kho; lượt cây đổi bị bắt trước chữ ký thay vì sau |
| 2 | = | răng chặn trước lượt chấm, không thêm lượt dừng; ↓ ở ca có sự cố cây đổi |
| 3 | ↓ | lượt cây đổi chạy lại cùng round, không đốt trần |
| 4 | ↓ ở crm | ≈16 lượt hội đồng × 3 giám khảo cho câu không trả lời được thôi chạy; +1 lượt ở ca cây đổi |
| 5 | = | không chạm làn máy |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc trên kit bằng
`scripts/hieu-chuan-moc.mjs --root .`. **N không tăng so với mốc 2.19.0 — dòng vô hiệu ở mốc này**,
cấm đọc thành «0 sự cố».

**Nhát cắt có tên cho cửa sổ kế** (đủ ở Notes của `_acceptance/release-2-20-0/contract.md`, không mở ô):

1. **Thuế tự-host** — vòng ở kho kit tới «máy thông» phải khai một dòng `KHAC-BIET-DOC-CU` rồi ghim lại
   `ra-co-ten-lam-va-trao`; PR #232 đỏ CI hai lần vì đúng việc này.
2. **Phép đo dài hơn trần 600 giây của làn máy** — ca thật thứ hai ở crm `soan-okr-cung-tro-ly` (35 phút).
3. **Tham số lượt chấm bằng đường tệp** — hai lần trong ngày (35 KB ở kit, 196 KB ở crm).
4. **Ca thật đầu tiên cho «bất biến sản phẩm»** — thước quyền xem OKR của crm tắt im hai ngày trong
   `rang/` của một hồ sơ đã ký.
5. `scripts/rel-cua-so.sh` chỉ rút hồ sơ `signed-off`, nên tiêu chí cửa sổ của mốc không phủ vòng máy
   thông (phát hiện khi mở hồ sơ mốc này).

## 2.19.0 — 29/09/2026

Cửa sổ 2.18.5 → 2.19.0 kéo **hai ngày**, có **một vòng** chạm engine: `mot-so-ba-ve` (T3, ký 29/09,
PR #226 mở ô + ADR 0021 «ba vế một câu», PR #227 vòng) — suất meta duy nhất của cửa sổ. Kho chờ nhận là
`crm`: vòng `tro-ly-okr-de-xuat` (28/09) có 11 ruling superpowers mà chỉ 4 có mã trong sổ quyết định,
và thẻ Cổng Bằng chứng phải cần một lớp dịch mới đọc được sổ. Mốc đi **làn V**, không dựng răng mới. Hai
gói cùng lên `2.19.0`; `diagram-design` giữ `2.7.0`. Tag `v2.19.0` gắn tại commit ký mốc sau khi gộp.

**Vì sao 2.19.0, không 2.18.6:** cửa sổ thêm một hook mới, một script mới và ba trường sổ mới — thay đổi
cộng thêm, có đường đọc-cũ.

**Đổi gì** — một sổ quyết định, mỗi dòng đọc được ngay trên thẻ:

- **Mỗi dòng sổ ghi ba vế viết cho người ký:** quyết gì (`decision`) · vì sao (`why`) · sai thì tốn gì
  (`cost_if_wrong`). Dòng cũ chỉ có `impact` vẫn đọc như trước — không phải sửa hồ sơ cũ.
- **Thẻ Cổng 1 và Cổng 2 in dòng ba vế thành một câu** ở cả ba khối (sẽ làm/không làm · CHƯA duyệt ·
  Đã duyệt từ Gate 1), không cần lớp dịch. Dòng thiếu vế giá mang nhãn «chưa khai giá nếu sai» ngay ở
  dòng đó, thẻ không chặn. Bước trích chỉ xin dịch dòng cũ.
- **Ruling mà superpowers ghi trong lúc thi công được gặt vào sổ** (`scripts/cau-noi-ruling.mjs`), mang
  nguồn `superpowers`, để người ký thấy ở Cổng Bằng chứng thay vì mất theo thư mục tạm.
- **Hook mới chặn lệnh xoá thư mục tạm của superpowers** cho tới khi ruling trong đó đã vào sổ
  (`hooks/ruling-truoc-khi-xoa.js`, PreToolUse · Bash). Kho chưa dùng kit thì hook im.

**Kho tiêu thụ làm gì khi nhận:**

- **Máy dev:** cập nhật plugin như mọi mốc, trong từng thư mục có scope sống, rồi **khởi động lại phiên**
  để hook mới có hiệu lực. Hồ sơ đang giữa vòng không cần làm gì — dòng sổ cũ vẫn đọc được.
- **Kho còn đường chép:** không chép gì — không tệp nào của lớp chép CI (GUIDE §5.3) đổi trong cửa sổ.

**Giới hạn đã khai** (owner quyết ở Cổng Bằng chứng của vòng, 29/09 — đủ mười mục ở Notes của
`_acceptance/mot-so-ba-ve/contract.md`):

- Bảy phép đo của chính hồ sơ tự dối: ca in thẻ ghi bằng chứng vào tệp đã theo dõi rồi tự so với thứ vừa
  ghi (sau khi ký, đổi cách in thẻ sẽ làm bộ kiểm lặng lẽ ghi lại bằng chứng của hồ sơ đã ký); một ca so
  rỗng với rỗng; bốn ca phá thử kết luận từ sự vắng mặt mà không chứng bản sao đã chạy.
- Hook cho qua không khai báo khi lệnh xoá dùng glob, ngoặc nhọn, `~`, `sudo` hay lệnh con.
- Gợi ý sửa của lưới trước-merge còn dạy ghi dòng sổ hai vế — dòng ghi theo nó rơi về đường đọc-cũ.
- Kho có kit mà kế hoạch superpowers không thuộc hồ sơ nào thì hook chặn mãi — hạt giống
  `docs/plans/2026-09-29-hat-giong-hook-chan-ke-hoach-ngoai-ho-so.md`.

**Năm dòng số của luật (c)** — một vòng (`mot-so-ba-ve`):

| Dòng | Số | Nguồn |
|---|---|---|
| Làm-xong→quyết-được | `implemented` 09:41 → ký 11:10 (29/09, giờ VN) ≈ **1 giờ 29 phút**; riêng `verified` → ký ≈ 66 phút; một lượt chấm | giờ commit + sổ quyết định |
| Lượt gọi người / vòng | **3** trong thiết kế (Cổng 1 · Gate 1.5 · Cổng Bằng chứng; trần T3 = 4). Ngoài thiết kế **1** — câu khó-đảo «đẩy hay ẩn danh» sau chữ ký (dữ liệu thử chép nội dung kho riêng tư); thêm **1 chạm** vì «ký» gõ trong chat không ghi được chữ ký, phải gõ lại bằng lệnh | `decisions.jsonl` · bàn giao 29/09 |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0** — S4 một lượt, PENDING-JUDGMENT | `run-log.jsonl` |
| Token máy / vòng | Out-token S4: **41 840** (21 tác tử). Tách theo khối: chứng-minh-vật (machine+judge+baseline) 38 % — tìm-lỗi (review+triage) 41 % — tổng hợp (capture+synthesize) 21 %. Cache-read S4 ≈ 11,9 M, trong đó review ≈ 9,2 M. S3 ba làn song song: 9 529 out-token. Phiên chính không đo | `usage-report.md` |
| Phút máy / lượt chấm | **21 phút** (1 276 s). Đường găng là khối chứng-minh-vật (1 141 s); S3 song song 379 s | `usage-report.md` |

**Điều kiện tin cậy:** đường verdict KHÔNG đổi thành phần (finder → refute trong hợp đồng → REJECT giữ
nguyên; vòng chỉ đổi sổ, thẻ và thêm hook). Số lượt chấm sai giữa hai mốc không tăng. Dòng 4–5 cắt được đủ.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở kho tiêu thụ | người ký đọc vì-sao và giá ngay trên thẻ, không mở sổ hay chờ lớp dịch |
| 2 | = | không thêm cổng; câu hỏi «ruling này ở đâu» ở Cổng Bằng chứng giảm khi ruling đã vào sổ |
| 3 | = | không chạm bộ chấm |
| 4 | ↓ nhẹ | thẻ thôi cần bước dịch sổ cho dòng mới |
| 5 | = | hook chỉ chạy trên lệnh Bash nhắc `.superpowers` |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc trên kit bằng
`scripts/hieu-chuan-moc.mjs --root .`. **N không tăng so với mốc 2.18.5 — dòng vô hiệu ở mốc này**,
cấm đọc thành «0 sự cố».

**Nhát cắt có tên cho cửa sổ kế:**

1. **Bảy phép đo tự dối của `mot-so-ba-ve`** (Known limits của hồ sơ, sổ known-limits) — ứng viên số một
   nếu owner gọi tên.
2. **Ba hạt giống cùng lớp «ba vế»:** «Trả lại: lý do» ở Cổng 2 không ghi trường · `veto` thiếu giá · cột
   Xử lý của gap-probe thiếu giá.
3. Từ 2.18.5 còn nguyên: lớp chép tự xoá · máy hỏi ngoài thiết kế ở S1 · thẻ Cổng 2 để `scope_plain`
   thay các mục.

## 2.18.5 — 27/09/2026

Cửa sổ 2.18.4 → 2.18.5 kéo **hai ngày**, có **một vòng** chạm engine: `cham-khong-tu-dot-luot` (T3, ký
27/09, PR #223) — suất meta duy nhất của cửa sổ, owner gọi tên sau ba lượt phản biện. Kho chờ nhận là
`crm`: lượt 4 lộ trình OKR (`cap-nhat-tuan-okr`) đốt hai round và một lượt gọi người mà không có lỗi
sản phẩm nào, `quen-mat-khau` round 3 và `okr-soat-anh-luot-3` round 1 khoá chỉ vì bộ kiểm chung bị
harness cất đầu ra. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên `2.18.5`; `diagram-design`
giữ `2.7.0`. Tag `v2.18.5` gắn tại commit ký mốc sau khi gộp.

**Đổi gì** — lượt chấm thôi tự đốt lượt vì hạ tầng, thẻ người ký hiện đủ:

- **Bộ kiểm chung không chạy được thì được thử lại cùng round.** Dòng SUITE mang lý do (kể cả lý do tự
  do của tác tử) nay có nhãn «không đọc được ở đây» như dòng eval; cờ «công cụ đã giết lệnh» đi tới sổ
  chạy thành `killed_by_tool`. Bộ kiểm trượt thật vẫn là trượt, và lượt vừa có hạ tầng vừa có trượt
  thật vẫn khoá.
- **Mã thoát đọc từ dấu, không từ chữ.** Lệnh máy chạy trong khung bọc: đầu ra ghi ra tệp, chỉ đuôi
  (≤ 6 000 byte) và dòng `__EXIT=<mã>` đi vào kết quả công cụ, nên harness thôi cất đầu ra dài ra tệp;
  dấu có mặt thắng lời khai (hình E21 của crm: khai 1, dấu 0 → đạt). «Thiếu môi trường, thoát 1» vẫn
  là hạ tầng, không thành REJECT.
- **Hồ sơ ghi đúng commit máy đã chấm** (`verified_commit` từ `invokedSha`, không từ tác tử).
- **Thẻ Cổng Phạm vi hiện từng mục «không làm»**, dịch theo id `OOS-n`; câu dịch lạc bật cờ vàng. Thẻ
  đọc mọi bảng phản biện đúng chữ ký sáu cột (bảng soát lại sau Cổng Phạm vi của crm từng vắng), cờ
  vàng khi số phát hiện vượt số khai; bảng đời cũ sáu cột mở bằng «sev» vẫn đọc như trước.
- **Bảng chi phí S4 tách theo khối trở lại** — `wf-usage` đọc nhãn tác tử từ `meta.json` cạnh
  transcript (harness mới chèn một câu chung vào tin đầu của mọi tác tử).
- **Ảnh ui-check lưu dưới hồ sơ**, báo cáo mang đường tương đối `evidence/…`.

**Kho tiêu thụ làm gì khi nhận:**

- **Máy dev:** cập nhật plugin như mọi mốc, theo khối khai plugin của GUIDE, trong từng thư mục có scope
  sống. Hồ sơ đang giữa vòng nhận bộ chấm mới ở lượt chấm kế — không cần làm gì.
- **Kho còn đường chép** (`crm`): chép lại **`lib/nhan-canh-gay.cjs`** (lớp chép CI, GUIDE §5.3 —
  tệp duy nhất của lớp đổi trong cửa sổ).

**Giới hạn đã khai** (owner quyết ở Cổng Bằng chứng của vòng, 27/09):

- Khung in dấu vẫn là lời trong prompt: tác tử có thể bỏ qua nó (lượt chấm 1 của vòng: 3/11 tác tử chạy
  lệnh trần). Thiếu dấu thì bộ chấm giữ lời khai như trước — tác tử bỏ khung và khai sai mã vẫn lọt.
  Làn ui-check và baseline không bọc.
- Thẻ Cổng 2 còn để `scope_plain` thay các mục «không làm» — hạt giống
  `docs/plans/2026-09-27-hat-giong-the-cong-2-scope-plain-thay-muc.md`.
- Ca «luật dấu không chạm làn ui» không có chiều đỏ — hạt giống
  `docs/plans/2026-09-27-hat-giong-ca-lan-ui-khong-phan-biet.md`.
- Bộ phân nhãn còn hai nhánh chết và một tham số không đọc (không đổi phân loại).
- Câu «đầu ra dài» của khối TOOL-KILL-RULE viết không dấu nên «CAT» đọc được là «cắt» — nghĩa đúng là
  «cất»; đổi thành «LUU» ở cửa sổ kế.

**Năm dòng số của luật (c)** — một vòng (`cham-khong-tu-dot-luot`):

| Dòng | Số | Nguồn |
|---|---|---|
| Làm-xong→quyết-được | Cổng Phạm vi ≈ 5 phút · Gate 1.5 ≈ 6 phút · Cổng Bằng chứng ≈ 25 phút (gồm một câu hỏi của owner về E10). Code xong → chữ ký: **2 giờ 5 phút**, ba lượt chấm | giờ commit + sổ quyết định |
| Lượt gọi người / vòng | **4**, cả bốn trong thiết kế T3 (Cổng Đáng · Cổng Phạm vi · Gate 1.5 · Cổng Bằng chứng). Ngoài thiết kế **0**. Trần T3 = 4. Mỗi lượt một chạm (một câu gộp hoặc một dòng dán). Gate 1.5 được máy ĐỌC là duyệt khi owner dán dòng /goal không kèm chữ «duyệt» — ghi sổ, phê ở Cổng Bằng chứng | `decisions.jsonl` |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **1 lượt, 1 round** — lượt chấm 1 BLOCKED vì chính khung in dấu của vòng (3/11 tác tử chạy lệnh trần); vòng sửa vật nên tự đếm round kế thay vì thử lại cùng round | `run-log.jsonl` round-tally |
| Token máy / vòng | Out-token S4: **49 955 · 62 479 · 28 498** (ba lượt). Tách theo khối: chứng-minh-vật (machine+judge+baseline) 34 % · 28 % · 40 % — tìm-lỗi (review+triage+refute) 28 % · 40 % · 38 % — tổng hợp (capture+synthesize) 38 % · 32 % · 22 %. Cache-read S4 ≈ 14,3 M · 15,6 M · 15,1 M, trong đó review ≈ 11–13 M mỗi lượt. S3 ba làn: 12 348 out-token. Phiên chính không đo | `usage-report.md` |
| Phút máy / lượt chấm | 24 · 30 · 28 phút. Đường găng cả ba là khối chứng-minh-vật (1 135 · 1 140 · 1 341 s) | `usage-report.md` |

Mốc đầu tiên tách được dòng 4 theo NHÃN tác tử thay vì theo model — nhờ chính AC-8 của vòng.

**Điều kiện tin cậy:** đường verdict ĐỔI thành phần — nguồn của mã thoát đổi từ lời khai của tác tử
sang dấu máy in. Răng hai chiều có ở ca AC-2 của vòng (tám hàng viết trước, hai đột biến), nhưng vế
«thiếu dấu» đã gỡ theo ngưỡng chết nên chiều đỏ của nó là dòng sổ S4-r1, không phải ca. Số lượt chấm
sai giữa hai mốc không tăng. Dòng 4–5 cắt được đủ.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở kho tiêu thụ | lượt chặn vì hạ tầng thử lại cùng round, không đợi owner cho vượt trần |
| 2 | ↓ ở kho tiêu thụ | hết lượt «cho vượt trần» và `--round` tay (lượt 4 OKR: 1 lượt ngoài thiết kế) |
| 3 | ↓ | nền: 2 round đốt chắc chắn trên 63 lượt BLOCKED quét 27/09 |
| 4 | = | không thêm tác tử |
| 5 | = | khung bọc không làm chậm lệnh |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc trên kit bằng
`scripts/hieu-chuan-moc.mjs --root .`. **N không tăng so với mốc 2.18.4 — dòng vô hiệu ở mốc này**,
cấm đọc thành «0 sự cố».

**Nhát cắt có tên cho cửa sổ kế:**

1. **Lớp chép tự xoá** (`docs/plans/2026-09-23-hat-giong-lop-chep-tu-xoa-2-18-3.md`) — xếp từ 2.18.3, còn nguyên.
2. **Máy hỏi ngoài thiết kế ở S1** (`docs/plans/2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md`) — còn nguyên.
3. **Thẻ Cổng 2 để `scope_plain` thay các mục** — cùng lớp AC-6 vừa sửa ở Cổng 1.

## 2.18.4 — 25/09/2026

Cửa sổ 2.18.3 → 2.18.4 kéo **một ngày**, có **ba vòng** chạm engine, cả ba cùng sửa báo động giả
của **đường nền** (`feature-loop/scripts/duong-nen.mjs` — tệp engine duy nhất đổi):
`nen-cong-cu-gan-bang-lenh-con`, `nen-cay-ban-dong-dau`, `nen-chay-bang-moi-truong-nguoi-goi` (đều
T2, ký 24–25/09). Kho chờ nhận là `crm`: sau khi bản vá đầu đã gộp, đường nền của hai phiên crm mở
vòng 24/09 vẫn ghi `nen cong-cu: THIEU merge-base` và mỗi phiên đẩy một chip «sửa đường nền» cho
owner — đúng lỗi đã sửa, chỉ chưa phát hành. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên
`2.18.4`; `diagram-design` giữ `2.7.0`. Tag `v2.18.4` gắn tại commit ký mốc sau khi gộp.

**Đổi gì** — thẻ Cổng Phạm vi thôi mang cờ vàng «nền hạ tầng đỏ» giả:

- **Lệnh mở bằng phép gán mang lệnh con thôi bị báo thiếu công cụ.** Executor dạng
  `B=$(git merge-base HEAD origin/onehub) && …` từng bị đọc thành chương trình `merge-base`. Bộ tách
  lệnh nay hiểu vùng thay thế `$(…)` `${…}` `` `…` `` và ranh giới `;` `&` `|`; lệnh chỉ-gán tra từ
  đầu của lệnh con. Chương trình vắng thật vẫn đỏ và gọi đúng tên.
- **Chân suite gọi đúng tên tệp bẩn.** Tên tệp đã theo dõi thôi bị cụt ký tự đầu (`README.md` →
  `EADME.md`), và tệp bẩn sẵn từ trước thôi bị đổ cho suite.
- **Đường nền chạy bằng môi trường của người gọi.** Tra `command -v` và chạy suite qua `bash -c` với
  env của người gọi, không qua shell đăng nhập nạp lại profile. Máy dùng fnm/nvm thôi bị báo
  «nen suite: DO SAN» giả khi PATH đăng nhập trỏ một bản node khác (đo ở crm: node 22 thay 24).

**Kho tiêu thụ làm gì khi nhận:**

- **Máy dev:** cập nhật plugin như mọi mốc, theo khối khai plugin của GUIDE, trong từng thư mục có
  scope sống. Không cần làm gì với hồ sơ đang mở; đường nền lần mở vòng kế tự đọc bằng bản mới.
- **Kho còn đường chép** (`crm`): `duong-nen.mjs` không thuộc lớp chép CI (GUIDE §5.3) — không phải
  chép gì.
- **Kho đã ghim sha:** đổi `KIT_SHA` sang commit ký mốc 2.18.4, hoặc lấy theo tag `v2.18.4`.

**Giới hạn đã khai** (owner quyết ở Cổng Bằng chứng của từng vòng, 24–25/09):

- Lệnh con mở bằng chuyển hướng (`X=$(<file)`) bị báo THIEU giả — hồi quy so với bản trước vá; 0 /
  5 113 khoá `executors.*` thật có dạng này. Hạt giống
  `docs/plans/2026-09-24-hat-giong-lenh-con-mo-bang-chuyen-huong.md`.
- `N=$((1+2)); lenh-ke` rơi vào nhánh bỏ-tra thay vì tra `lenh-ke`; trần độ sâu 8 chạm thì bỏ tra
  không in lý do.
- Khi `git status` lỗi, chân suite đọc được tập rỗng (có từ bản cũ).
- Một ca chập chờn chưa gọi tên trong mảnh suite `mjs:1/3` (đỏ một lần ở làn ghim lại, lần sau xanh).
- `check_overflow.py` của `diagram-design` vỡ `JSONDecodeError` khi nhãn tràn chứa `]` — gặp ở crm
  25/09, owner chọn không đưa vào mốc này. Hạt giống
  `docs/plans/2026-09-25-hat-giong-check-overflow-cat-json-o-ngoac-vuong.md`.

**Năm dòng số của luật (c)** — ba vòng, số theo thứ tự `lenh-con` · `cay-ban` · `moi-truong`:

| Dòng | Số | Nguồn |
|---|---|---|
| Làm-xong→quyết-được | Cổng Phạm vi cả ba đi làn V, không chờ người. Cổng Bằng chứng một lượt mỗi vòng: ≈ 5 phút · ≈ 4 giờ 25 phút · ≈ 6 giờ 27 phút (qua đêm). Code xong → chữ ký: 37 phút · 4 giờ 58 phút · 7 giờ 1 phút. Hai vòng sau không có dấu giờ trình thẻ nên không tách được giờ chờ người khỏi giờ máy | giờ commit + sổ quyết định |
| Lượt gọi người / vòng | **1 · 1 · 1**, cả ba trong thiết kế (Cổng Bằng chứng). Ngoài thiết kế **0**. Mục tiêu T2 ≤3. Số chạm không đo được — sổ chỉ cho một dấu giờ quyết mỗi vòng, hội thoại không nằm trong kho | `decisions.jsonl` |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0 · 0 · 1 lượt, 0 round**. Vòng thứ ba: round 1 lượt 1 BLOCKED (2 tác tử chấm chết, trả 9/11), thử lại cùng round trên cùng cây → PASS 6/6. Ca sống đầu tiên của «thử lại cùng round» (2.18.3) | `run-log.jsonl` round-tally |
| Token máy / vòng | Out-token **66 k · 48 k · 52 k**; không-cache **1,50 M · 1,39 M · 1,15 M**. Tách theo vai: chứng-minh-vật (machine+baseline) 29 % · 43 % · 35 % — tìm-lỗi (review+triage) 58 % · 35 % · 30 % — tổng hợp (capture+synthesize) 14 % · 22 % · 34 %. Vòng thứ ba chỉ có lượt BLOCKED: lượt thử lại chạy bằng tác tử chấm tuần tự ngoài workflow đo chi phí, không đo. Phiên chính không đo | `usage-report.md` |
| Phút máy / lượt chấm | 28 · 29 · 23 phút (+ lượt thử lại ≈ 3 phút lệnh, ≈ 6 phút dấu giờ). Đường găng cả ba là khối chứng-minh-vật (1 533 · 1 602 · 1 202 s) | `usage-report.md` + `evidence-report.md` |

Dòng 4 xếp `capture` vào tổng hợp — quyết định của người đếm, mẫu 2.18.3 không nói rõ; báo cáo chi phí
của ba vòng còn nhãn vai nên tách được theo vai thay vì theo model.

**Điều kiện tin cậy:** đường verdict không đổi thành phần — ba vòng chỉ đổi đường nền, không đổi ai
phán. Số lượt chấm sai không tăng. Dòng 4–5 cắt được, trừ vế lượt thử lại của vòng thứ ba: lượt ấy
đi ngoài workflow đo chi phí, nên dòng 4 của vòng đó thiếu một lượt — khai, không ước.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở kho tiêu thụ | thẻ Cổng Phạm vi thôi mang cờ vàng nền giả, người khỏi đọc rồi bỏ qua |
| 2 | ↓ ở kho tiêu thụ | phiên thôi đẩy chip «sửa đường nền» cho lỗi đã sửa (đo 24/09: hai chip từ hai phiên crm) |
| 3 | = | đường nền không nằm trên đường chấm |
| 4 | = | không thêm tác tử |
| 5 | = | không đổi lượt chấm |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc trên kit bằng
`scripts/hieu-chuan-moc.mjs --root .`. **N không tăng so với mốc 2.18.3 — dòng vô hiệu ở mốc này**,
cấm đọc thành «0 sự cố».

**Nhát cắt có tên cho cửa sổ kế** (thứ tự mốc 2.18.3 đã xếp, còn nguyên; cửa sổ vừa rồi dành cho ba
vòng đường nền):

1. **Lớp chép tự xoá** (`docs/plans/2026-09-23-hat-giong-lop-chep-tu-xoa-2-18-3.md`).
2. **Máy hỏi ngoài thiết kế ở S1** (`docs/plans/2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md`).

## 2.18.3 — 24/09/2026

Cửa sổ 2.18.2 → 2.18.3 kéo **một ngày**, có **một vòng** chạm engine do owner gọi tên:
`ha-tang-khong-dot-luot` (T2, ký 24/09). Kho chờ nhận là `crm`, đã nâng 2.18.2 ở mọi scope sống
ngày 24/09. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên `2.18.3`; `diagram-design` giữ
`2.7.0`. Tag `v2.18.3` gắn tại commit ký mốc sau khi gộp.

**Đổi gì:**

- **Lượt chấm chết vì hạ tầng được thử lại, không tính là một vòng.** Khi lượt S4 bị chặn chỉ vì
  hạ tầng (tác tử chấm chết, hoặc công cụ ngắt lệnh), và lượt ấy không có lỗi nào máy phải sửa
  trong hợp đồng, bộ sinh tham số chấm lại ở CÙNG round. Lượt thử lại không đếm vào trần 3 round và
  chỉ thử lại một lần. Lượt còn lỗi trong hợp đồng thì vẫn là một round sửa như trước. Tập «lỗi máy
  phải sửa» đọc đúng tập bộ chấm dùng để trả lại: lỗi chưa qua bác bỏ hoặc lượt phân loại không đủ
  thì không tính.
- **Dòng `/goal` thôi coi «bị chặn» là xong.** Khuôn mới coi là hoàn thành khi phiên đã trình thẻ
  Cổng Bằng chứng, hoặc (làn V) đã mở PR ở S5, hoặc đã dừng ở một cổng có tên. Lượt bị chặn vì hạ
  tầng mà chưa thử lại thì CHƯA hoàn thành: máy thử lại, không hỏi. Khuôn không còn đòi
  «status: verified», điều làn V không bao giờ tới.
- **Thẻ Cổng 1 của hồ sơ đã khép thôi hỏi.** Hồ sơ chấm-bởi-thực-tế chưa từng có báo cáo không còn ô
  «duyệt hay sửa», không dòng lệnh duyệt, không dòng goal.
- **Bộ kiểm của kit chạy dưới trần công cụ** (chỉ kho kit). Suite scripts chấm bằng bốn mảnh, suite
  plugins bằng ba vùng; lệnh suite dài nhất của lượt chấm là 234 s. Trước vòng, suite plugins trọn
  mất 518 s trên `main`, tức 86 % trần. Lệnh trọn và CI không đổi.

**Kho tiêu thụ làm gì khi nhận:**

- **Máy dev:** cập nhật plugin như mọi mốc, theo khối khai plugin của GUIDE, trong từng thư mục có
  scope sống. Không cần làm gì với hồ sơ đang mở.
- **Kho còn đường chép** (`crm`): không tệp nào trong lớp chép CI (GUIDE §5.3) đổi ở mốc này, nên
  không phải chép gì.
- **Kho đã ghim sha:** đổi `KIT_SHA` sang commit ký mốc 2.18.3, hoặc lấy theo tag `v2.18.3`.
- **Ai đang dán dòng `/goal` cũ:** dán khuôn mới từ thẻ Cổng 1 hoặc GUIDE mục /goal. Goal cũ đang
  chạy vẫn chạy.

**Giới hạn đã khai** (owner quyết ở Cổng Bằng chứng của vòng, 24/09):

- «Đã thử lại một lần vẫn chặn» chỉ là một dòng stderr; bộ sinh tham số vẫn thoát 0. Hạt giống
  `docs/plans/2026-09-24-hat-giong-thu-lai-roi-thoat-khac-0.md`.
- Thẻ Cổng 1 của hồ sơ đã khép còn hai nút «Sửa lại / Duyệt, cho code», và bỏ qua im lặng lỗi của bộ
  quét. Hạt giống `docs/plans/2026-09-24-hat-giong-the-cong-1-ho-so-khep-nut-va-loi-quet.md`.
- 68 hồ sơ đã ký của kit còn eval trỏ khoá suite trọn, nên lượt ghim lại của chúng chạy thêm suite
  trọn ngoài các mảnh. Suite trọn vẫn sát trần; nguy cơ có từ trước vòng.
- Thân lệnh `acceptance-card` còn đọc `one_shot: null` là «bị trả lại/bị chặn», trong khi thẻ hồ sơ
  đã khép nay cũng trả null.
- Vùng 2 của suite plugins là một khối đơn (P161, 320 s máy rảnh), không chia nhỏ hơn được nếu
  không sửa chính P161.

**Năm dòng số của luật (c) — vòng `ha-tang-khong-dot-luot`:**

| Dòng | Số | Nguồn |
|---|---|---|
| Làm-xong→quyết-được | Cổng Phạm vi đi làn V hai lần, không chờ người · Cổng Bằng chứng lượt 1 ≈ 7 phút (trả lại, nâng phạm vi 3 mục) · lượt 2 ≈ 6 phút (ký). Code xong → chữ ký cuối: 1 giờ 48 phút | giờ commit + sổ quyết định |
| Lượt gọi người / vòng | **2** lượt, **2** chạm, mỗi lượt một lệnh. Trong thiết kế **2** (Cổng Bằng chứng hai lượt). Ngoài thiết kế **0**. Mục tiêu T2 là ≤3 | sổ quyết định + hội thoại |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0**. Hai lượt đều trả đủ phép đo, 0 BLOCKED; round 1 không bị trần công cụ ngắt — ngưỡng sống đầu tiên của ô | `run-log.jsonl` round-tally |
| Token máy / vòng | 2 lượt: **241 k** out-token, **3,40 M** token không-cache. Tách theo model vì nhãn vai mất trong báo cáo: chứng-minh-vật (haiku) 32 k (13 %) · rà soát (opus) 124 k (51 %) · phân loại + chụp + tổng hợp (sonnet) 85 k (35 %). Phiên chính không đo | `usage-report.md` |
| Phút máy / lượt chấm | 35 · 29 phút, tổng 63 phút. Đường găng là chuỗi 10 lệnh suite chạy tuần tự (≈ 1 150 s máy rảnh) | `wall` + kiểm kết S3 |

Dòng 4 không tách được phân loại (thuộc khối tìm-lỗi) khỏi tổng hợp: cả hai chạy sonnet và báo cáo
chi phí của hai lượt không còn nhãn vai.

**Điều kiện tin cậy:** đường verdict không đổi thành phần — vòng này đổi cách ĐÁNH SỐ lượt và cách
CHẠY suite, không đổi ai phán. Hai thay đổi có răng hai chiều: phân hoạch mảnh có chiều đỏ (bỏ sót
tệp, ca tiêm đỏ ở từng mảnh) và chiều im (tổng PASS các mảnh = lượt trọn); đánh số lượt có ma trận
chín hàng + round-trip với bộ chấm thật + hai đột biến tách riêng. Số lượt chấm sai không tăng. Dòng
4–5 vì thế cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ | lượt chặn vì hạ tầng thôi thành câu hỏi cho người |
| 2 | ↓ ở kho tiêu thụ | khuôn goal thôi ép phiên dựng lối cho người khi lượt bị chặn |
| 3 | ↓ ở kho kit | suite dưới trần, round đầu thôi BLOCKED |
| 4 | = | không thêm tác tử |
| 5 | ↓ | lượt thử lại cùng round không đốt một round sửa |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc trên kit bằng
`scripts/hieu-chuan-moc.mjs --root .`. **N không tăng so với mốc 2.18.2 — dòng vô hiệu ở mốc này**,
cấm đọc thành «0 sự cố».

**Nhát cắt có tên cho cửa sổ kế** (thứ tự mốc 2.18.2 đã xếp, còn nguyên):

1. **Lớp chép tự xoá** (`docs/plans/2026-09-23-hat-giong-lop-chep-tu-xoa-2-18-3.md`) — mốc này
   không làm; cửa sổ vừa rồi dành cho vòng owner gọi tên.
2. **Máy hỏi ngoài thiết kế ở S1** (`docs/plans/2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md`).

## 2.18.2 — 23/09/2026

Cửa sổ 2.18.1 → 2.18.2 kéo **một ngày**, có **một vòng** chạm engine do owner gọi tên:
`chot-may-chu-ky-sau-synthesize` (T2, ký 23/09). Kho chờ nhận là sáu kho vừa nâng 2.18.1: hai
kho đã ghim sha `8a4ea881` (oneflow #129, artifact-platform #392), ba kho đang chờ PR ghim sha
(media-library, floorplanstudio, MapPoster) và `crm` còn đi đường chép, chờ 2.18.3. Mốc đi
**làn V**, không dựng răng mới. Hai gói cùng lên `2.18.2`; `diagram-design` giữ `2.7.0`. Đây là
mốc đầu tiên có **tag** `v2.18.2`, gắn tại commit ký mốc.

**Đổi gì:**

- **Máy thôi được ký thay người trong báo cáo bằng chứng.** Tác tử tổng hợp của lượt chấm S4
  từng tự điền chữ ký người và tự đặt giờ đo. Đo 23/09: 13/84 báo cáo kit và 12/56 báo cáo crm
  mang giờ đo do tác tử đặt, 6 báo cáo crm mang giờ ở tương lai, và một chữ ký máy trên hồ sơ
  crm đã tới bước ghi tệp. Nay workflow tự ép rỗng `human_signoff`, `human_override`,
  `bypass_ack` và ép mọi `verified_at` bằng giờ engine trước khi trả báo cáo. Khối mang sang từ
  lượt trước giữ giờ gốc của nó. Chốt đổi dòng nào thì run-log có một dòng
  `kind: chot-truong-nguoi` nói số dòng đổi theo từng khoá, nên tần suất tác tử bịa vẫn đếm được.
  Người ký vẫn ký bằng `/acceptance-gate:signoff` như cũ.
- **Đường mặc định của CI là chạy cổng từ bản kit ghim sha, không chép tệp** (GUIDE §5.3, đổi từ
  23/09 trong cửa sổ này). Kho ghi `KIT_SHA` trong tệp workflow CI, job lấy kit về ngoài cây kho
  rồi chạy cổng từ đó. Từ mốc này kho cũng có thể lấy kit bằng tag:
  `git fetch --depth 1 origin refs/tags/v2.18.2`.

**Kho tiêu thụ làm gì khi nhận:**

- **Kho đã ghim sha** (oneflow, artifact-platform, và ba kho khi PR ghim sha gộp): đổi `KIT_SHA`
  từ `8a4ea881` sang commit ký mốc 2.18.2, hoặc lấy theo tag `v2.18.2`. Một PR, một dòng.
- **Kho còn đường chép** (`crm`): chép lại lớp CI theo **danh sách** ở GUIDE §5.3 cộng
  `skills/acceptance/references/opportunity-template.md`, tổng 16 tệp. Không tệp nào trong lớp
  chép đổi ở mốc này, nên kho đã đủ 16 tệp từ đính chính 2.18.1 không phải chép gì. Đường chép
  sẽ bị xoá ở 2.18.3.
- **Máy dev:** cập nhật plugin như mọi mốc. Không cần làm gì với hồ sơ đang mở. Bản engine mới
  chỉ đổi cách lượt chấm S4 ghi báo cáo.

**Giới hạn đã khai:**

- Chốt không chạm năm hình dạng override mà bộ đọc L3 vẫn đếm: giữa dòng bảng, trong chú thích,
  khoá có tiền tố trùng đuôi, bản ghi một dòng kiểu `{…}`, nội dung khối vô hướng. Danh sách một
  nguồn là khối `GIOI-HAN-CHOT` trong `acceptance-verify.js`. Nghiệm đúng tầng là neo dòng cho
  L3 của bên đọc. Owner không phê vế đó ở vòng này; nó nằm ở hạt giống
  `docs/plans/2026-09-23-hat-giong-rang-ben-doc-verified-at-chu-ky.md`.
- Chữ ký do phiên tự viết ngoài `/signoff` chưa bị chặn. Đó cũng là việc của răng bên đọc.
- Vòng đột biến `CTN-AC8-vi-phan` chạy riêng thì không tự kiểm đối chứng dương (Known limits
  Ngoài-2 của hồ sơ vòng).
- Giờ đo bịa đang nằm trong 25 hồ sơ đã ký (13 kit, 12 crm) chưa được chữa. Chúng chờ chiến dịch
  ghim lại theo run-log thật.
- `pre-merge-check.sh` dòng 376 và 397 còn đọc `lib/` theo đường của kho. Kho chạy cổng từ bản
  kit mà có hồ sơ `machine-cleared` thì chờ 2.18.3.

**Năm dòng số của luật (c) — vòng `chot-may-chu-ky-sau-synthesize`:**

| Dòng | Số | Nguồn |
|---|---|---|
| Làm-xong→quyết-được | Cổng Phạm vi ≈ 21 phút · dừng-vá ≈ 2 phút · trần 3 lượt ≈ 27 phút theo giờ tự khai trong sổ, dòng sổ ghi muộn hơn 2 giờ · ký lần 1 ≈ 16 phút · nâng phạm vi ≈ 38 phút từ lúc máy hỏi · ký lần 2 ≈ 18 phút. Code xong → chữ ký cuối: 7 giờ 8 phút | giờ commit + sổ quyết định |
| Lượt gọi người / vòng | **6** lượt, **6** chạm, mỗi lượt một lệnh. Trong thiết kế **4**: hai cổng (Cổng Phạm vi, ký lần 1) và hai điểm dừng SKILL liệt kê tường minh (dừng-vá, trần 3 lượt). Ngoài thiết kế **2**: «nâng phạm vi» sau chữ ký, ký lần 2. Mục tiêu T2 là ≤3. Đếm theo lệnh owner gõ: câu máy hỏi xác nhận và câu owner trả lời «nâng phạm vi» là MỘT lượt | sổ quyết định + git log |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0**. Năm lượt đều trả 14/14 phép đo, 0 BLOCKED. Lượt 3 REJECT vì vật | `run-log.jsonl` round-tally |
| Token máy / vòng | 5 lượt: **564 k** out-token, **6,78 M** token không-cache. Tách ba khối theo out-token: chứng-minh-vật 106 k (19 %) · tìm-lỗi 345 k (61 %) · tổng hợp 113 k (20 %). Phiên chính không đo | `usage-report.md` |
| Phút máy / lượt chấm | 30 · 28 · 40 · 30 · 24 phút, tổng 152 phút. Đường găng lượt 2 là khối máy 1 223 s trên 1 678 s, trong đó suite scripts 777 s | `wall` + bảng vai |

Dòng 4 chỉ lượt 2 còn nhãn vai. Bốn lượt còn lại tách theo model và số lượt gọi: tác tử máy chạy
haiku, rà soát chạy opus, còn triage, bác bỏ, chụp và tổng hợp chạy sonnet. Lượt 3 có hai tác tử
sonnet hai lượt gọi không phân được vai, nên khối tìm-lỗi và tổng hợp của lượt ấy lệch tối đa 5 k.

**Điều kiện tin cậy:** đường verdict không đổi thành phần. Chốt chạy SAU tổng hợp và chỉ đổi bốn
khoá, không đổi ai phán. Nó có răng hai chiều: đột biến AC-8 cho chiều đỏ, chiều im trên toàn
corpus báo cáo kit và crm (AC-6, AC-7). Số lượt chấm sai không tăng: lượt 3 REJECT đúng vật. Dòng
4–5 vì thế cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở kho tiêu thụ | người ký thôi phải gỡ tay chữ ký máy và giờ bịa trước khi commit |
| 2 | = | không cổng nào thêm bớt |
| 3 | = ở đường `s4-args.mjs` · ↑ ở kho tự dựng args thiếu `invokedAt` | args thiếu `invokedAt` mà báo cáo có `verified_at` thì lượt chấm BLOCKED có tên |
| 4 | = | chốt là một hàm JS, không thêm tác tử |
| 5 | = | chốt chạy trong vài mili-giây sau tổng hợp |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc trên kit bằng
`scripts/hieu-chuan-moc.mjs --root .`. N không tăng so với mốc trước ở phần kit.

**Nhát cắt có tên cho cửa sổ kế** (thứ tự owner xếp 23/09 trong `docs/plans/`):

1. **2.18.3 — lớp chép tự xoá**
   (`docs/plans/2026-09-23-hat-giong-lop-chep-tu-xoa-2-18-3.md`). Sửa hai dòng `$ROOT/lib` của
   `pre-merge-check.sh`, xoá danh sách chép ở `acceptance-init` và GUIDE, xoá ca `CE2`. Việc thứ ba
   của hạt giống, gắn tag, làm tay ở mốc này. Còn lại là đưa nó thành bước của `/signoff`.
2. **2.19 — máy hỏi ngoài thiết kế ở S1**
   (`docs/plans/2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md`).

## 2.18.1 — 22/09/2026

Cửa sổ 2.18.0 → 2.18.1 kéo **một ngày**, có **một vòng** chạm engine do owner gọi tên:
`ho-so-khep-thoi-hoi` (T3, ký 22/09). Mọi lỗ vá ở đây lộ ra trong đúng ngày `crm` cài 2.18.0 —
kho chờ nhận của mốc này vẫn là `crm`. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên
`2.18.1`; `diagram-design` giữ `2.7.0`.

**Đổi gì:**

- **Hồ sơ đã khép thôi bị đếm là «cửa veto đang mở».** Hồ sơ đã nghỉ, hoặc đã chấm bởi thực tế
  với dòng quan sát đủ vế, không còn hiện trong dòng NOTE của lưới trước-merge lẫn thẻ mở phiên.
  Cả hai hỏi CHUNG một vị từ `hoSoDaKhep`.
- **Thẻ của hồ sơ đã khép không còn ô hỏi nào.** Trước bản này, 15 hồ sơ nghỉ vẫn mang câu «veto
  hay để yên». Hồ sơ thực tế thiếu dòng quan sát KHÔNG được gọi là khép — thẻ vẫn hỏi «ký hay trả».
- **Làn máy-đi-trước đọc cả tệp phát hiện.** Báo cáo để trống «Ngoài hợp đồng» mà
  `review-findings.md` còn mục chưa ai quyết thì hồ sơ không còn là xanh-sạch. Mục đã có dòng sổ
  gate2 của người («Ngoài-N») thì coi là đã định tuyến, không bắt ký lại.
- **Lớp CI vendored lên 15 tệp**, tính bằng bao đóng nạp của ba lệnh CI. `crm` từng đỏ CI ngày
  cài vì thiếu `product-map.mjs` và `trang-thai-ho-so.cjs`.

**Kho tiêu thụ phải làm khi cài:** đồng bộ lớp CI theo **danh sách** ở GUIDE §5.3 (không theo
con số: kho ở 2.18.0 thêm 5 tệp, kho ở 2.17 thêm 6, kho ở 2.16 thêm 7 — đo 23/09 trên sáu kho) và
**xoá** `lib/out-of-contract.js` — tệp đổi tên thành `lib/out-of-contract.cjs`.

**Đính chính 23/09/2026:** danh sách 15 tệp còn thiếu `skills/acceptance/references/opportunity-template.md`
mà `product-map.mjs` đọc; chép 15 tệp thì lệnh bản đồ thoát 2 (ENOENT). **Kho nâng từ bản dưới
2.13:** bản này thôi miễn cho làn ghim lại chỉ-chạy-suite (ADR 0014, 0015) — hồ sơ ghim bằng làn
ấy sẽ đỏ `[cua-van-hanh]` ngay lượt CI đầu (media-library: 9 hồ sơ); chạy chiến dịch ghim lại
(GUIDE §7.1) trước khi merge PR nâng. Từ 23/09 GUIDE §5.3 đổi đường mặc định sang **chạy cổng từ bản
kit ghim sha, không chép tệp** — hồ sơ: `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`.

**Giới hạn đã khai:** nhãn «Ngoài-N» là vị trí mục trong tệp phát hiện, nên một lượt chấm mới có
thể làm dòng sổ cũ trỏ nhầm mục (hạt giống `docs/plans/2026-09-22-hat-giong-nhan-ngoai-n-neo-theo-noi-dung.md`);
mutant 2 trong bộ đo của hồ sơ đã ký `lan-v-khong-phai-cho-ky` hỏng vì chữ ký hàm mới.

## 2.18.0 — 21/09/2026

Cửa sổ 2.17 → 2.18 kéo **hai ngày**, có **hai vòng** chạm engine, cả hai do owner gọi tên:
`ghim-lai-noi-ra-o-khong-do` (T2, ký 20/09) và `nhan-trang-thai-va-reality` (T3, ký 21/09,
ADR 0020). Đây là mốc đầu tiên có **kho chờ nhận đo được trước khi cắt**: ba hồ sơ ở `crm`
đang chờ đúng ba thứ bản này mang tới. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng
lên `2.18.0`; `diagram-design` giữ `2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Test của kho thôi bị đếm là thước.** Trước bản này, kho làm TDD bị phạt: mỗi lần sửa một
  tệp test bị đếm là một «nhát sửa thước», và ba nhát là lượt chấm bị chặn. Ở `crm`, ba nhát
  vào `apps/api/test/*.spec.ts` đã làm trần nổ đúng như thế. Nay test của kho là vật. Để
  không mất lưới, thước chuyển thành **chỉ-đọc trong lượt chấm**: máy chụp băm các tệp thước
  trước lượt và so lại sau lượt. Lệch thì thẻ khoá với nhãn «thước lệch» và nêu đúng tệp.
- **Thẻ Cổng Bằng chứng gọi đúng tên thứ đang gãy.** Trước đây mọi BLOCKED trông giống
  nhau: thẻ không có dòng lệnh, và người lái không có ô nào để chấp nhận một đồng hồ chưa
  đọc. Nay thẻ tách ba nhãn. **«Không đọc được ở đây»** là bàn đo không chạy được: thẻ mở ô
  ký có tên, kèm ba lối và ba giá. **«Hệ thống chết»** khoá lần đầu và mở sau đúng một lần
  thử lại. **«Thước lệch»** luôn khoá. Đỏ vì sản phẩm sai thì vẫn khoá như cũ. Ký trên cạnh
  gãy không hạ verdict: báo cáo giữ BLOCKED, và mỗi mục mang một dòng sổ có tên.
- **Reality có quyền đóng hồ sơ.** Một hồ sơ mà vật đã chạy trên prod từ lâu không còn phải
  dựng thêm thước chỉ để đóng. Lệnh mới `/acceptance-gate:observed` cho **người** ghi bản dựng
  đang phục vụ prod, ngày quan sát và tên. Hồ sơ chuyển sang «đã chấm bởi thực tế», rời nhóm
  đang dở, và mọi việc thước trên nó bị khoá. Lệnh này khoá với máy như sáu thao tác cổng
  người kia.
- **Thẻ in nguyên văn ý định.** Câu «vì sao làm việc này» từ ô cơ hội đi suốt tới lúc ký.
- **Một dòng hiệu chuẩn cho chữ «đủ».** `scripts/hieu-chuan-moc.mjs` in «ĐẠT đã ký → prod
  đỏ: k / N». Khi chưa hồ sơ nào có dòng quan sát prod, dòng in «vô hiệu» chứ không in «0 sự
  cố».
- **Ghim lại nói ra ô nó không đo.** Dòng ghim và thẻ cả hai cổng nêu các ô ngoài làn máy,
  ô mà diff đã chạm vật đo, và AC không có chốt máy. Không đổi hành vi chặn nào.

**Ai bị ảnh hưởng / làm gì:**

- **`crm`:** nâng engine, rồi đóng hoặc chấm ba hồ sơ đang chờ bằng các lối mới. Không phải
  dựng thêm bàn đo nào.
- **Mọi kho:** lớp tệp chép vào CI tăng từ **9 lên 10**. Chép lại
  `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`, `lib/workspace-record.cjs`,
  và **thêm** `lib/nhan-canh-gay.cjs`, cùng một lượt. Thiếu tệp mới thì hai bộ đọc của lưới
  không nạp được.
- **Kho có hồ sơ đã ký dùng trần nhát sửa thước:** eval của trần ấy mất tiền đề. Ở kit, đó
  là `thuoc-co-cua` E17. Cho hồ sơ ấy nghỉ bằng một dòng sổ ở chiến dịch ghim lại.

**Giới hạn đi cùng bản này** (nguyên văn ở mục Notes của
`_acceptance/nhan-trang-thai-va-reality/contract.md`): hồ sơ còn ở nháp vẫn nhảy thẳng sang
«đã chấm bởi thực tế» được, vì hook tự nhận là chặn nhưng không có mã nào chặn. Nhánh «không
tìm thấy lần lưu dòng quan sát» chưa có ca đỏ, và thông điệp của nó gợi ý sai cách sửa. Bộ
đếm thước bỏ qua phép so khi tệp tham số hỏng.

## 2.17.0 — 19/09/2026

Cửa sổ 2.16 → 2.17 kéo **một ngày**, có đúng **một vòng** chạm engine (`ho-so-nghi`, T3, ký
với giới hạn) cộng một bản vá đã ký từ cửa sổ trước (`nen-cong-cu-lenh-shell`). Mốc đi **làn
V**: một lượt người ở Cổng Phạm vi, không dựng răng mới, năm dòng số đếm tay. Hai gói cùng lên
`2.17.0`; `diagram-design` giữ `2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Một hồ sơ đã ký mà lời hứa của nó chết thì thôi chặn mọi PR.** Trước mốc này, một hồ sơ đã
  ký xong rồi mất tiền đề — kho nguồn của một phần phụ thuộc biến mất, nhà cung cấp gỡ một mô
  hình, hay chính đội cố ý đổi vật sau chữ ký — không có lối ra nào: luật đòi ghim lại, mà
  không ai ghim được. Người vận hành phải bỏ qua bằng tay ở mỗi lần mở PR. Nay có lối ra: một
  người viết **một dòng** vào sổ quyết định của hồ sơ, mang tên mình và một câu lý do. Khối
  lệnh bấm được nằm ở mục «Cho một hồ sơ nghỉ» trong sổ tay. Hồ sơ ấy rời khỏi lưới, và
  **không tệp đã ký nào đổi một byte** — chữ ký là sử liệu. Bốn nơi đọc cùng hỏi một hàm, nên
  lưới, bộ kiểm lại bằng chứng, bản đồ và thẻ nói cùng một chuyện. Mở lại bằng một dòng nữa.
- **Chỉ hồ sơ đã có chữ ký người mới nghỉ được.** Đây là nhát thu phạm vi có căn cứ đo được:
  trước khi thu, một hồ sơ bị bác và chưa ai ký, thêm đúng một dòng, là cổng thoát xanh.
  «Nghỉ» nghĩa là một lời hứa **đã ký** nay không kiểm lại được; hồ sơ chưa qua cổng thì bác
  hoặc xếp lại ở tầng cơ hội. Hồ sơ đi làn máy-đi-tiếp không có chữ ký nên phải ký trước.
  Dòng viết thiếu, một câu văn xuôi, hay thư viện vắng: tất cả chấm như hồ sơ đang sống, và
  lưới **nói ra** vì sao thay vì im.
- **Cảnh báo sai trên thẻ duyệt phạm vi đã tắt.** Đường nền hạ tầng đọc từ đầu của mỗi lệnh
  khai trong cấu hình rồi hỏi máy xem chương trình ấy có không. Lệnh dựng bằng cú pháp shell
  bị cắt cụt thành một chuỗi vô nghĩa, nên nó báo «thiếu công cụ» cho một công cụ vẫn chạy
  tốt. Một kho tiêu thụ vì thế mang cờ vàng trên **mọi** thẻ Cổng Phạm vi vì lý do sai — mà cờ
  luôn bật là cờ người ta học cách bỏ qua. Nay nó chỉ tra khi lệnh thật sự bắt đầu bằng một
  tên chương trình, và nói ra khoá nào nó cố ý không tra.

**Ai bị ảnh hưởng / làm gì:**

- **Kho đang bị một hồ sơ chết tiền đề chặn:** nâng engine, rồi viết một dòng nghỉ cho hồ sơ
  ấy theo khối lệnh trong sổ tay. Không cần migrate gì, không đụng hồ sơ nào khác.
- **Kho khai executor dựng bằng cú pháp shell:** cờ vàng thường trực trên thẻ Cổng Phạm vi sẽ
  tắt sau khi nâng. Không phải làm gì thêm.
- **Mọi kho:** lớp tệp chép vào CI có **ba** tệp đổi (`scripts/pre-merge-check.sh`,
  `scripts/recheck-evidence.cjs`, `lib/workspace-record.cjs`) — chép lại ba tệp ấy cùng lượt
  nâng. Bộ kiểm lại bằng chứng nay nạp `lib/workspace-record.cjs`; tệp ấy vốn đã nằm trong
  danh sách chép, và cả năm kho đang chạy bộ kiểm lại đều đã có nó (đo 19/09).

**Giới hạn đi cùng bản này** (nguyên văn ở `_acceptance/ho-so-nghi/contract.md` mục Known
limits, mỗi mục kèm lệnh tái lập): bản đồ và bộ quét còn lệch nhóm ở hai hình dạng hiếm (hồ sơ
nghỉ có phiên nghiệm thu, hoặc có ô cơ hội hỏng); ba phép đo của chính vòng chưa đủ chặt, trong
đó một đối chứng chưa bao giờ chạy. Cả năm là **phép đo**, không phải hành vi; vật sản phẩm qua
mọi phép đo máy và năm lệnh suite ở cả ba lượt chấm.

## 2.16.0 — 18/09/2026

Cửa sổ 2.15 → 2.16 kéo khoảng **một ngày** — ngắn nhất từ khi kit đếm năm dòng số.
Trong ngày đó kho chạy đúng **một** vòng meta, `thuoc-co-cua` (T3, ký 17/09), đúng
vòng mà mốc trước đã gọi tên sẵn. Nó lấy ba câu hỏi từ bảng 23 lớp hạ tầng — đứng
được trước khi chấm · chạy không đè nhau · cửa cho thước — và biến cả ba thành vật
máy giữ. Ba việc còn lại của cửa sổ là vá và sổ sách, không việc nào chạm engine.
Mốc này cũng chạy **chiến dịch ghim lại**, thứ hai cửa sổ trước đã hoãn — và nó
đỏ, nên nay có số thay cho phán đoán: một lượt làn trên trọn 72 hồ sơ đã ký tốn
2 giờ 25 phút máy, gặp 14 hồ sơ mất tiền đề, và vì luật «làn đỏ thì không ghi gì»
nên ghim lại được 0 hồ sơ. Hai gói cùng lên `2.16.0`; `diagram-design` giữ
`2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Tường hạ tầng lộ ở đầu vòng, không lộ giữa lượt chấm.** Trước đây một công cụ
  thiếu hay một lưới chưa cắm chỉ lộ khi lượt chấm đã chạy được nửa đường, và lượt
  ấy trả BLOCKED — ở vòng sản phẩm gần nhất, 2 trên 3 lượt chấm mất vì lớp này và 4
  trên 8 lần gọi người là hạ tầng. Nay đầu S1 có một **đường nền hạ tầng** chạy bằng
  máy, không LLM, bốn chân: mọi lệnh executor có trên máy chưa · các lệnh suite chạy
  một lần lần lượt rồi cây còn sạch không · lưới trước-merge chạy được như trên CI
  không · ba bản bộ máy có khớp nhau không. Kết quả thành một khối «Nền hạ tầng» trên
  thẻ Cổng Phạm vi, nên thứ chỉ người gỡ được gom đúng một lần vào lời mời cổng thay
  vì rải ra từng lượt. Hồ sơ cũ không có khối này thì thẻ treo một cờ vàng, không chặn.
- **Lệnh suite trong lượt chấm chạy lần lượt.** Làn chấm vẫn chạy mọi lệnh song song,
  kể cả những lệnh chạy trọn một bộ test trên cùng một cây. Hệ quả đã đo ở bốn kho: hai
  suite giẫm lên nhau, một chốt «cây sạch» bắt nhầm thư mục tạm của suite kia, và lượt
  chấm đỏ vì hạ tầng chứ không vì vật — chính lượt chấm 1 của mốc trước mất vì thế. Nay
  lệnh suite xếp một hàng tuần tự; lệnh eval vẫn song song như cũ.
- **Thẻ Cổng Bằng chứng thôi gọi một giới hạn đã khai là trượt.** Một eval được phép
  khai trước rằng mã thoát mong đợi của nó khác 0. Làn ghim lại đã hiểu điều đó từ
  2.11.0, nhưng thẻ thì không: nó đọc mọi mã khác 0 là trượt và nói ngược danh sách
  eval đỏ. Nay thẻ đọc cùng một nguồn với làn.
- **Lượt chấm nghe lời khai «không chạy».** Một eval tự khai `status: not-run` vẫn bị
  bộ sinh args đưa vào lượt chấm rồi chết ở đó — ca thật: một hồ sơ ở repo tiêu thụ
  phải đổi sang khai mã thoát để né, và một eval của vòng sản phẩm gần nhất bị thi
  hành rồi BLOCKED. Nay bên viết args và làn ghim lại rút danh sách từ **cùng một hàm**,
  và báo cáo nói ra ô bị loại bằng một dòng thay vì im.
- **Sửa thước có cửa.** Kit vốn đếm và chặn được «ngoài hợp đồng», nhưng việc sửa chính
  phép đo thì không có tên, không được đếm, không có trần — ở hai kho tiêu thụ, một
  phiên có 9 chỗ hỏng thước so 1 chỗ hỏng vật và 701 dòng thước so 20 dòng vật. Nay một
  bộ đếm suy từ git xếp mỗi tệp đổi vào một lớp và đếm số **nhát sửa thước** kể từ lúc
  hợp đồng sang «code xong»; thẻ Cổng Bằng chứng in một dòng «vật · thước · nhát»; và
  từ nhát thứ ba, bộ sinh args **từ chối sinh** rồi trình ba lối cho người: khai giới
  hạn có tên, đổi cách đo, hay mở một vòng có chủ ngữ là thước. Người chọn thì một dòng
  sổ mở van và mốc đếm dời tới đó.

**Ai bị ảnh hưởng / làm gì:**

- **Repo tiêu thụ — không có bước migrate.** Mọi khoá mới đều có đường đọc-cũ.
- **Repo tiêu thụ — lượt chấm có thể DÀI hơn.** Lệnh suite nay tuần tự, nên đường găng
  dài ra ở repo có nhiều suite nặng chạy song song được. Đổi lại là lượt chấm thôi đỏ
  giả vì hai suite giẫm nhau.
- **Repo tiêu thụ — eval khai không-chạy thôi bị thi hành.** Repo nào đã lách bằng cách
  khai một mã thoát mong đợi có thể khai lại cho đúng.
- **Repo tiêu thụ — lớp CI vendored:** không tệp nào trong bộ chín tệp đổi ở mốc này,
  không phải chép lại.

**Giới hạn đã khai:** đường nền hạ tầng chạy nền song song với lúc S1 còn viết tệp có
thể báo cây bẩn vì tệp của chính vòng; kho tự host kit không tự nhận ra điều đó với
lệnh mà tài liệu dặn, nên chân kiểm ba bản bộ máy có thể lệch giả. Ba phép đo của chính
vòng — hai ca thẻ và một ca chiều đỏ — chưa độc lập với nhau, đã tách thành một ô riêng
cho cửa sổ sau.

**Chi phí của chính cửa sổ:** vòng meta duy nhất tốn 54,8 triệu token cho hai lượt thi
công và ba lượt chấm, trong đó 30,0 triệu ở lượt chấm. Chiến dịch ghim lại của mốc
thêm 2 giờ 25 phút máy và không ghim được hồ sơ nào. Khối tìm-lỗi chiếm 71 % token
lượt chấm — vòng này không chạm giao diện nên không có làn nào khác chia mẫu số. Lượt
gọi người 5 so trần 4, vòng thứ năm liên tiếp vượt trần; lượt vượt là một lần owner phải
tự bắt lỗi mà bộ chấm cho qua. Một lượt thi công chết trọn vì hạn mức phiên. Số đầy đủ
và nhát cắt cho cửa sổ kế ở khối Notes của hồ sơ mốc.

## 2.15.0 — 17/09/2026

Cửa sổ 2.14 → 2.15 chạy dưới quyết định R của owner (16/09): không mở vòng meta
mới, đo cái đã ship trên một vòng sản phẩm thật. Vòng đó là `skill-system-v1` ở
OneFlow, ký 17/09 — lần đầu sau hai cửa sổ có một tính năng tới tay người dùng
trên kit mới. Cửa sổ vẫn có một vòng meta đã ký, `guide-chep-ci-buoc-vao-writer`,
ký buổi sáng trước khi R được chốt — đúng trần một vòng của luật. Ba việc nhỏ của
kit vào cửa sổ qua chip sau R; owner quyết đếm chúng là vá-trong-mốc và đếm đủ. Hồ sơ mốc `_acceptance/release-2-15-0/` có tiêu chí
cho cả ba, cùng năm dòng số lần đầu có cột từ repo tiêu thụ. Hai gói cùng lên
`2.15.0`; `diagram-design` giữ `2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Thẻ `/start` thôi mời viết code cho thứ đã ở nhánh gốc.** Ca thật ở
  crm-onehub 16/09: một hồ sơ đã merge từ 04/09 bị đặt ngược về «đã duyệt» để
  xếp lại, thẻ đọc thành «viết code», và một phiên 8 giờ 25 phút chấm lại thứ
  đang chạy trên prod. Nay hồ sơ «đã duyệt» có bằng chứng mang commit đã nằm
  trong lịch sử của cây — kể cả bản bằng chứng đã đổi tên khi xếp lại — hiện
  thành dòng riêng «vật đã nằm trong nhánh gốc», không có bước máy kế. Người chọn
  một trong hai lối ngay trong câu hỏi chọn sẵn có: đóng theo quan sát, hoặc chấm
  lại. Không thêm câu hỏi, không thêm cổng. Đo trên crm-onehub: cả bốn hồ sơ cùng
  hình dạng rơi vào dòng mới.
- **Lượt ghim lại dừng khi một phép đo ghi đè bằng chứng đã ký.** Cũng ở
  crm-onehub 16/09: một phép đo trong suite chung ghi lại tệp bằng chứng của một
  hồ sơ đã ký sau mỗi lượt chạy, ở mọi worktree, mất khoảng 450 dòng so bản đã
  ký, và không răng nào thấy. Nay làn ghim lại chụp cây của mọi hồ sơ đã thông
  Cổng Bằng chứng trước suite và sau eval; có tệp bị chạm thì làn đỏ, in đường
  từng tệp, không ghi gì. Luật đi kèm: lệnh chạy lại ghi tạo phẩm ra
  `.acceptance-runs/<slug>/` hoặc thư mục tạm, không bao giờ vào `_acceptance/`.
  Hai trạng thái «đã thông cổng» của răng hỏi đúng một nguồn trong bộ máy, không
  chép — owner đã veto lối khai gạch hai tệp trong một hồ sơ đã ký.
- **Dòng `/goal` thôi chặn hai kiểu dừng hợp lệ.** Ở vòng R1, hook `/goal`
  chặn 11 lần máy dừng đúng luật: 2 lần khi máy chờ người cài một công cụ còn
  thiếu trước bước nghiệm thu, 9 lần khi máy dừng ở trần sửa thước chờ người chọn
  lối — và máy trả lời lại cùng một câu 7 lượt. Bộ chấm của hook hiểu «chờ người»
  là chỉ ở tầng cả vòng. Khuôn mới nói rõ hai kiểu dừng giữa vòng ấy cũng là «chờ
  người», với điều kiện máy nêu đích danh tiền đề hoặc các lối để chọn; dừng không
  nêu gì vẫn bị chặn. Hiệu lực thật chỉ đo được ở vòng sản phẩm kế.
- **Kho kit: thẻ `/start` đếm vòng meta đang mở.** Luật cho tối đa một vòng meta
  giữa hai mốc, nhưng cửa sổ 2.13 → 2.14 có hai vòng chạy song song ở hai phiên
  và con số chỉ lộ khi mốc đếm. Ở chính kho kit, thẻ nay in «vòng meta đang mở
  trong cửa sổ: N» kèm tên, và cờ khi N từ 2 trở lên. Không cổng, không lệnh.
  Repo tiêu thụ không thấy dòng này.

- **Danh sách chép lớp CI ở GUIDE §5.3 khai đủ chín tệp**, và một phép đo buộc
  hai bản khai danh sách ấy vào các tệp mà cổng merge thật sự nạp. Trước đó GUIDE
  thiếu hai tệp; kho chép theo GUIDE sẽ tắt lặng một lớp cưỡng chế.

**Ai bị ảnh hưởng / làm gì:**

- **Repo tiêu thụ — làn ghim lại có thể ĐỎ sau khi update.** Script đo nào còn
  ghi tạo phẩm vào thư mục bằng chứng của một hồ sơ đã ký sẽ làm làn dừng, kèm
  đường tệp bị chạm. Việc phải làm: chuyển đích ghi của script đó sang
  `.acceptance-runs/<slug>/` (thêm thư mục này vào `.gitignore`). crm-onehub là ca
  đã biết, ở phép đo lai-ra-man của vòng chan-lai-component-ra-man.
- **Repo tiêu thụ — thẻ `/start`:** không có gì phải làm. Hồ sơ «đã duyệt» mà vật
  đã merge sẽ tự hiện ở dòng mới ở lần quét kế.
- **Repo tiêu thụ — lớp CI vendored:** không tệp nào trong bộ chín tệp đổi ở mốc
  này, không phải chép lại.
- **Kho kit:** thẻ mở phiên có thêm một dòng đếm vòng meta.

**Giới hạn đã khai:** phép hỏi «vật đã ở nhánh gốc» so với HEAD của cây đang
quét, không với nhánh gốc có tên. Lối «đóng theo quan sát» chưa có trạng thái hồ
sơ để ghi, nên dòng vẫn hiện sau khi ghi quyết định — nguyên thuỷ «xếp lại cho
vòng» còn thiếu, đã có tên ở ô `thuoc-co-cua`. Vòng S4 và CI chưa chụp cây hồ sơ,
chỉ làn ghim lại chụp. Dòng đếm vòng meta nhận hồ sơ mốc theo tên
`release-<x>-<y>-<z>`.

**Chi phí của chính cửa sổ:** vòng sản phẩm R1 tốn 147,8 M token cho bốn lượt S4,
cùng cỡ vòng meta nặng nhất của 2.14. Khối tìm-lỗi rơi về 9,5 %, nhưng làn `ui`
chiếm 91 % lượt cuối. Lượt gọi người 7 cộng 1 so trần 4, vòng thứ tư liên tiếp vượt trần.
Việc meta của cửa sổ không có số token nào: vòng đã ký không có báo cáo chi phí, các phiên chip không chạy `wf-usage`.
Số đầy đủ và nhát cắt cho cửa sổ kế ở khối Notes của hồ sơ mốc.

## 2.14.0 — 15/09/2026

Cửa sổ 2.13 → 2.14 có **hai** vòng đã ký, trong khi luật (b) cho một. Hồ sơ mốc
`_acceptance/release-2-14-0/` ghi thẳng điều đó, cùng năm dòng số của cả hai vòng
đếm bằng một luật và đối chiếu chéo giữa hai phiên. Hai gói cùng lên `2.14.0`;
`diagram-design` giữ `2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Trạm phân loại phạm vi thôi hỏng vì định danh do máy-nói chép sai** (vòng
  `do-tin-tram-phan-loai`). Trước đây kết quả phân loại được ghép về từng phát
  hiện bằng tiêu đề và đường dẫn do tác tử chép lại; chép lệch một ký tự là cả
  lượt rơi về đường «bác bỏ tất cả». Hai số đo, từ HAI vòng khác nhau — nói rõ để
  không ai đọc thành một: vòng `khoi-tim-loi-tra-phi-theo-vat` hỏng **3/6** lượt
  vì lớp này; và ở vòng `chu-ky-khong-tu-lam-hoa-cu`, lượt mất phân loại tốn
  **37 tác tử · 32,7 M token** so **13,7–16,7 M** ở bốn lượt có phân loại chạy
  đúng của cùng vòng. Lượt PASS của vòng ấy (50,2 M) đứng NGOÀI phép so vì nó
  chạy đối chứng đầy đủ trên cây đã gộp — bản trước của mục này gộp nó vào «mọi
  lượt lành» và vì thế nói quá. Nay mỗi phát hiện gửi đi mang một **mã do máy đúc**, kết
  quả ghép theo mã trước, mã lạ bị bỏ, và khi kết quả thiếu mã nào thì máy **hỏi
  lại đúng một lần** chỉ phần thiếu trước khi đặt cờ hỏng. Luật fail-toward-human
  không đổi: hỏi lại vẫn thiếu thì bác bỏ chạy toàn bộ như cũ.
- **Chữ ký thôi tự làm bằng chứng của chính nó hoá cũ.** Đo 14/09: từ lúc owner
  gõ «Ký» tới lúc báo sẵn-sàng-merge mất **54 phút** và **≈ 42 M token**, và
  **7/7** chữ ký của tuần đều chạy **ba** lượt làn máy ≈ 13 phút. Nguyên nhân
  không phải xui: ca canh định tuyến chỉ soi hồ sơ ĐÃ ký, nên chính chữ ký buộc
  bản ghi mốc thêm một dòng — mà tệp ấy là code, nên lưới trước-merge gọi bằng
  chứng hoá cũ và bắt ghim lại. Hai nhát: bản ghi mốc nay là **vật máy sinh**
  (dòng của nó do một lệnh sinh ra ngay trong lượt ký, cùng lớp với bản đồ sản
  phẩm — ADR 0019), và **làn trước chữ ký tự bỏ qua khi cây không đổi so với
  mốc đã chứng** (`--skip-unchanged`). Cây đã đổi sau khi chứng thì làn vẫn
  chạy trọn và luật đỏ y nguyên.

**Ai bị ảnh hưởng / làm gì:**

- **Repo tiêu thụ — HÀNH VI của engine: không có gì phải làm.** Trạm phân loại
  đòi tác tử trả thêm một trường mã; không trả thì rơi về khoá cũ. Cờ
  `--skip-unchanged` là tường minh, mặc định làn vẫn chạy trọn.
- **Repo tiêu thụ — LỚP CI VENDORED: PHẢI chép lại.** Câu trên chỉ nói về hành
  vi engine; nó KHÔNG miễn cho bạn bước chép. Bản đầu của mục này để mỗi câu
  «không có gì phải làm» nên đọc thành cả hai, và đợt rollout 16/09 cho thấy
  điều đó sai: so với **2.11.0** có **4/9** tệp đổi (`pre-merge-check.sh`,
  `evidence-core.cjs`, `ac-line.cjs`, `md-section.cjs`); kho còn ở 2.8.0/2.9.0
  thì thiếu hẳn `eval-yaml.cjs` và `lop-nhin-thay.cjs`, mà thiếu tệp nào là
  **tắt lặng một lớp cưỡng chế** trong khi CI vẫn xanh. Chép **đủ 9 tệp** theo
  khối `INIT-CI-COPY-LIST` của `commands/acceptance-init.md`.
- **Repo tiêu thụ — hai cái bẫy đo được trong đợt rollout đó:**
  - **PR nâng lớp vendored đỏ ở luật T1-escape** nếu kho chưa khai 9 tệp
    kit-owned trong `t1_skip_globs` (chúng là THƯỚC, không phải product code).
    Kho khai chúng trong `t3_paths` thì phải **rút khỏi t3_paths** — cổng kiểm
    `t3_paths` TRƯỚC `t1_skip_globs`, nên chỉ thêm vào skip là vô ích.
  - **Chạy `pre-merge-check` trước khi commit là phép đo nói dối:** luật
    T1-escape đọc diff ĐÃ COMMIT, nên bản vừa chép còn nằm ngoài commit là vô
    hình với nó. Bảy kho báo `clean` ở local rồi ba kho đỏ trên CI vì đúng lớp
    này. Kiểm sau commit, trên worktree dựng từ chính nhánh đó.
- **Kho tự host kit:** lượt ký ra sẵn-sàng-merge trong vài phút thay vì cả giờ
  (ADR 0019).

**Giới hạn đã khai:** bảy mục của vòng `do-tin-tram-phan-loai` đều ở tệp ca
hoặc chẩn đoán nội bộ; tải gửi trạm phân loại còn viết ở hai chỗ — đã vào hạt
giống cửa sổ kế (`docs/plans/2026-09-15-hat-giong-mot-nguon-tai-gui-triage.md`).
Vị từ «cây bằng pin» phía bash và phía JS chỉ đồng nghĩa trên danh sách T1 hiện
tại, ngưỡng đang đếm ở ADR 0019.

**Chi phí của chính cửa sổ (máy đo, hai vòng):** ≈ 199,9 M token cho hai vòng
meta; lượt gọi người **5 và 5** so trần 3 — mọi lượt vượt đều là lỗi hình thức
của máy, không lượt nào là quyết định thật. Số đầy đủ và chín nhát cắt cho cửa sổ
kế ở khối Notes của hồ sơ mốc.

## 2.13.0 — 14/09/2026

Cắt số tại `ea26fdfe` (14/09). Mục này ghi những gì đã gộp vào nhánh chính từ
lúc 2.12.0 được ký (`7e260d4b`, 14/09) tới lần cắt đó.

Trọn phần dưới đây đến từ MỘT vòng: `khoi-tim-loi-tra-phi-theo-vat` — vòng
meta duy nhất của cửa sổ 2.12 → 2.13 (luật (b), owner gọi tên 14/09). Hồ sơ:
`_acceptance/khoi-tim-loi-tra-phi-theo-vat/`.

**Đổi gì:**

- **Khối tìm-lỗi của S4 nay trả phí theo vật, không theo hồ sơ.** Đo trên 20
  lượt chấm (534,6 M token) thấy review + refute chiếm **83 %** token S4, mà
  **3/4** phát hiện đã trả tiền bác bỏ lại bị xếp ra ngoài hợp đồng — tức máy
  trả tiền chứng minh thứ chính nó không được sửa. Năm nhát cắt:
  - **Phân loại phạm vi đứng TRƯỚC bác bỏ.** Chỉ phát hiện trong hợp đồng mới
    trả phí bác bỏ; mục ngoài hợp đồng đi thẳng sang người ở Cổng Bằng chứng,
    mang cờ «chưa qua bác bỏ». Đo được: một lượt chấm của 2.12.0 chạy **20** tác
    tử bác bỏ và cả 20 đều soi hồ sơ chứ không soi vật; lượt PASS của vòng này
    chạy **0**, vì cả 12 phát hiện đều được xếp ngoài hợp đồng nên không mục nào
    phải trả phí bác bỏ. Hai lượt có phân loại lành khác chạy 5 và 0.
  - **«Vùng vật» có tên máy đọc.** Làn tìm-lỗi tập trung vào tệp thật sự đổi,
    thôi soi văn bản hồ sơ của chính vòng. Trước đó 20/20 tác tử bác bỏ soi hồ
    sơ và 0 soi vật.
  - **Mỗi phát hiện có một dòng trong sổ chạy**, nên lượt sau không chấm lại
    mục ngoài hợp đồng mà tệp của nó không đổi.
  - **Làn đối chứng rời đường găng.** Nó là tín hiệu phụ nhưng từng giữ đồng hồ
    của cả lượt; nay chạy riêng, chỉ đợi ở điểm muộn nhất cần.
  - **Thước token và phút.** `wf-usage` đo thời gian theo vai trò và sinh
    `usage-report.md`, tách ba khối chứng-minh-vật / tìm-lỗi / tổng hợp.

- **North star có thêm chi phí máy.** Thước của kit nay đếm cả **token và phút
  máy trên mỗi kết quả ship**, không chỉ giờ người. Dòng người vẫn đứng trước
  dòng máy: token giảm mà lượt gọi người tăng là thất bại. Luật (c) đi từ ba
  lên **năm dòng số** mỗi mốc phát hành.

- **Nghi thức kiểm phép đo nay HAI chiều.** Trước đây kit chỉ hỏi «phá vật thật
  thì phép đo có đỏ không» (độ nhạy). Nay hỏi thêm «chạm một thứ KHÔNG phải vật
  thì phép đo có IM không» (độ đặc hiệu). Thiếu chiều thứ hai, mọi luật về phạm
  vi của kit không thể sai được trong bất kỳ phép đo nào đang chạy.

- **Thẻ Cổng Bằng chứng nói đúng hơn.** Khối ngoài hợp đồng thôi nói các mục đó
  «là thật» — chúng chưa qua bác bỏ đối kháng, và thẻ nay nói vậy.

**Ai bị ảnh hưởng / làm gì:**

- **Kho tiêu thụ đang giữa một vòng lặp:** không có gì phải làm. Engine chỉ đổi
  dưới chân bạn theo bản phát hành có chủ đích, và 2.13 chưa ra. Kéo nhánh chính
  giữa hai mốc là tự chọn.
- **Kho tự dựng args cho S4:** nếu bạn gọi thẳng workflow chấm thay vì qua skill,
  bên viết nay truyền thêm năm khoá (`vungVat`, `ngoaiVatFiles`, `diffFiles`,
  `fileDoTrongDiff`, `coverageFiles` cùng `coEvalPaths`). **Thiếu khoá nào cũng
  không vỡ** — bên đọc có đường đọc-cũ cho từng khoá. Nhưng ba trong số đó rơi
  về đường cũ *lặng lẽ*: đó là một trong 12 giới hạn đã khai bên dưới.
- **Người đọc `usage-report.md`:** bảng theo vai trò đếm đúng số tác tử, nhưng
  dòng tiêu đề và tổng theo model vẫn đếm theo dòng (tác tử × model), nên hai
  con số trong cùng một báo cáo có thể lệch nhau. Giới hạn đã khai.

**Giới hạn đã khai (12 mục, owner ký 14/09):** không mục nào chạm hành vi người
dùng cuối — tất cả là nợ của chính bộ đo: một bản chép tay của hàm khớp đường
dẫn, cờ vàng thiếu cho ba khoá args mới, hai bộ đếm tác tử còn đếm dòng, một phụ
thuộc PyYAML chưa khai trong tài liệu cài đặt, và vài ca không đo được điều
chúng tuyên. Chi tiết từng mục:
`_acceptance/khoi-tim-loi-tra-phi-theo-vat/evidence-report.md`, mục
«Known limits». Chúng đi vào hạt giống mốc 2.13.

**Đã biết trước, chờ mốc 2.13 quyết** — `docs/plans/2026-09-14-hat-giong-ba-cho-cat-sau-chu-ky-cua-so-2-13.md`:

1. Ghim lại theo diff thay vì chạy trọn corpus (làn hiện tốn ≈ 12 phút mỗi lượt).
2. Fixture ghim định tuyến thẻ không được đỏ chỉ vì có hồ sơ mới ký.
3. Dòng số thứ nhất đo tới «lên nhánh chính», và nghi thức ship chạy nền.
4. Chiến dịch ghim lại: **41 trên 68** hồ sơ có ghim đang hoá cũ, mốc ghim cũ
   nhất tụt 411 commit. Đây là nợ có sẵn giữa hai mốc, không phải hồi quy — luật
   ghim-lại-theo-release gọi trạng thái này là chấp nhận được.

**Chi phí của chính vòng này (máy đo):** sáu lượt chấm, trong đó **ba lượt bị hạ
tầng đốt** — một lỗi ống lệnh, một lượt đỏ giả, một suite chập chờn không tái
hiện được. Cả ba đều xanh khi chạy tay. Số này vào dòng thứ ba của luật (c), và
nó lớn hơn phần tiết kiệm được nếu tính theo giờ người.
