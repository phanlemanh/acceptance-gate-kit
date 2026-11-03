# Bản đồ khuôn ở kho thử thứ hai, đặt cạnh kế hoạch của kit (03/11/2026)

**Trạng thái:** finding — khảo sát chỉ đọc, chưa mở ô, chưa mở hồ sơ. Đầu vào cho phiên chuẩn bị mốc `release-2-37-0`
và cho vòng 2 «Chọn khối ở cổng» của [finding 01/11](2026-11-01-ban-do-khuon-vao-kit.md) §6.

**Câu hỏi của chủ kho (03/11):** kho thử thứ hai «đã đi trước», và đợt vừa rồi làm chủ kho «khá hài lòng». Lấy lại mọi
thứ kho ấy đã làm về luật thiết kế, cách cài đặt và bản đồ khuôn, đặt cạnh kế hoạch của kit, rồi đề xuất cách hoàn chỉnh
hiệu quả nhất. Kho thứ hai là bãi thử: kit thử ở đó trước rồi mới nhân rộng.

**Quy ước ẩn danh (kho kit công khai).** Hai kho thử gọi như finding 01/11: *kho thứ nhất* (dạng sửa lệch đã có, một
nhóm) và *kho thứ hai* (dạng khai trước khi lệch, nay 11 nhóm). Tệp của kho thứ hai được gọi theo VAI («bộ đọc bản đồ
của kho», «bài kiểm cây»), kèm sha commit của kho ấy. Bảng ánh xạ vai → đường dẫn thật nằm ở phụ lục riêng, ngoài kho
này (§11). Tên nhóm, tên khối và chữ của sản phẩm không chép sang đây.

---

## 0. Một phút

1. **Kho thứ hai đã dựng gần đủ cả ba vòng của kế hoạch kit bằng mã của riêng nó.** Gồm 11 nhóm, khoảng 2.300 dòng răng
   tự viết, bộ đọc cây mã thật, đối chiếu ảnh, trang ba lối và vết chọn khối. Phần kit dùng chỉ là nền màu M1, nghi thức
   `design-pass` và cổng trước-gộp, ghim ở v2.36.0. Bộ đọc và bước chấm khuôn của kit (#475, #476) chưa phát hành, nên
   kho chưa chạm tới (§2).
2. **Bộ chấm khuôn của kit sẽ báo oan ngay khi kho thứ hai cài 2.37.0.** Chạy trên bản sao kho ở `3273a44`, kit trên
   `main` `428b2773` ra **10 lệch mới và 6 nợ cũ**; bộ đo của kho ra **0**. Gốc là một chỗ: kho viết `ngoai_le: {tep,
   ly_do}` không có `khoi`, nghĩa là «tệp này rời nhóm». Kit chỉ hiểu ngoại lệ là miễn một khối, nên bỏ qua dòng ấy. Giả
   lập vá một dòng trong bộ đọc: **0 lệch, 0 nợ cũ**; trên kho thứ nhất kết quả không đổi (§5.2).
3. **Phần kit nên lấy từ kho thứ hai là khuôn và lệnh, không phải giá trị.** Gồm đối chiếu cặp ảnh tự đủ, trang ba lối
   với khuôn tệp của nó, và ngoại lệ có hạn gắn vào một hồ sơ. Danh mục khối, 11 tệp nhóm, bố cục, luật lint gắn thư viện
   khối và bản đồ hệ thiết kế ở lại kho (§6).
4. **Trình tự đề xuất có năm vế** (§7): V0 vá bộ đọc trước khi kho nhận cài · V1 kho thứ hai cài và bỏ dần mã trùng
   (TRỪ ở kho) · V2 vòng 2 rút cơ chế đã chạy thật ở kho thứ hai (CỘNG, phê ở Cổng Phạm vi) · V3 hạt giống · V4 khởi tạo
   từ mã giữ ở cuối.
5. **Một quyết định cho chủ kho** (§10): vá V0 trước khi cắt 2.37.0, hay cắt rồi vá ở bản kế. Chủ kho quyết 03/11: **cắt trước**; V0 sang bản kế (hạt giống H0).

## 1. Đã đọc gì, và giới hạn của việc đọc

| Nguồn | Đọc ở đâu | Ghi chú |
|---|---|---|
| Cây kho thứ hai | nhánh chính `3273a44`, cây sạch, đọc trực tiếp | không sửa gì; mọi lệnh đo chạy trên bản sao `git clone --shared` trong thư mục nháp |
| Bản ghi phiên Claude Code | thư mục dự án của kho thứ hai trên máy này | **chỉ có một phiên, phiên đồng bộ kho** (02/11 22:19Z) — đợt thiết kế chạy trên máy khác |
| Thay cho bản ghi phiên | bản chép phiên mà kho tự lưu trong kho tri thức nội bộ của nó (ba phiên 31/10–01/11) · `decisions.jsonl` · `git log` · phiên kit `0b17df44` | lượt gọi người từng phiên của đợt **không đếm được** — giới hạn khai |
| Báo cáo cũ | kho tri thức kit, `raw/2026-11-01-ban-do-khuon-bao-cao-quy-hang-0111/` (băm `75c7312d`) | chụp trên `11ce9f8` của kho thứ hai |
| Kit | `main` `428b2773`: finding 01/11 · bản phạm vi 31/10 · hạt giống 02/11 · hồ sơ `khuon-loi`, `khuon-doc-ban-do-that` · `scripts/ban-do-khuon.cjs` · `scripts/design-floor-khuon.mjs` · `skills/acceptance/references/ban-do-khuon-template.md` | thẻ mới nhất vẫn là `v2.36.0` |

Chữ duyệt của chủ kho đọc được: «Đồng ý, làm» khi mở thử nghiệm (31/10), «Duyệt, cắt lượt» cho bản phạm vi QK1–QK4,
«Chốt A + C + B gộp» cho cổng chọn khối (01/11), năm dòng «Đã duyệt theo khuyến nghị» ở hồ sơ hệ bố cục (02/11).
Chỗ vấp đọc được: sáu commit 02/11 mang ghi chú «(chủ kho 02/11)» đổi thiết kế liên tục. Trong đó có một cột được thêm
rồi gỡ sau sáu phút. Thêm 10 commit «hạ về verified» do lưới trước-gộp của kit 2.36.0, mỗi commit thêm một lượt ký
người (`git log --grep`).

## 2. Kho thứ hai hôm nay

| Mảng | Hình dạng | Con trỏ (kho thứ hai) |
|---|---|---|
| Bản đồ | `design/patterns/<nhóm>.md`, 11 tệp: 10 nhóm màn, 1 nhóm phần tử. Frontmatter YAML một dòng, **9 khoá bắt buộc**: `nhom` · `doi_tuong` (danh sách) · `khuon{ten,nhap}` · `nhan_dien` (danh sách glob) · `mau_dang_chay{tep,duong,trang_thai}` · `khe_bat_buoc` · `cam_ngoai_khuon` · `ngoai_le[{tep,ly_do}]` · `luat` (mã phải có trong thân). **3 khoá tuỳ chọn**: `don_vi` · `bo_cuc` · `ngoai_le_han[{tep,han,ly_do}]`. Khoá khác thì đỏ. | bộ đọc bản đồ của kho; `e4caaed` (#31) → `d29ee1b` (#80) |
| Răng lúc viết | luật lint «khối cấm theo vùng» đọc thẳng bản đồ, cùng ba luật bố cục; mức error; nằm trong `npm run lint` (CI, pre-push, `executors.script.lint`) | `2f0e71e` (#32), `ae564ff` |
| Bài quét cây | **đọc cây mã TypeScript** (không theo mẫu chữ): gốc của mọi `return` JSX phải là khuôn, đủ khe, nhập đúng tệp; đếm «màn ngoài bản đồ» là trang trả JSX mà không thuộc nhóm nào; `--base` chia lệch mới và nợ cũ | `e4caaed`, `2e1acf6` (#38) |
| Đối chiếu | kế hoạch cặp ảnh màn mới–màn mẫu (1440 · 375), trang ghép **nhúng ảnh base64** nên mở ở đâu cũng thấy | `2e1acf6` |
| Ba lối | khuôn tệp `ba-loi.json` (lời khuyên, ba lối cố định, mỗi lối có động cơ và đánh đổi, hoặc «không có» kèm «đã tra»); lệnh lập kế hoạch chụp, dựng trang, và kiểm «vòng chạm ô chưa có khuôn mà không có trang» | `11ce9f8` (#63) |
| Vết chọn khối | danh mục khối đã chuyển thể 9 cột và bảng «Chỗ hở» 5 cột có hạn xem lại; thiếu một ô thì lint đỏ | `93de6dd` (#54) |
| Hệ bố cục | bảy bố cục × sáu vùng; trang mẫu sống; 28 ảnh chuẩn ghim commit, mỗi tấm một dòng trong tệp kê; bản đồ hệ thiết kế (mục lục máy kiểm) | ADR hệ bố cục `0b6971d` (#73), `d29ee1b`, `e46af0c` |
| Số đo vòng | `khuon-so-do.json` cho mỗi hồ sơ (`tep_theo_khuon`, `rang_bat`, `lech_lot`, `kit`…) | `2e1acf6` |
| Nghi thức | skill giao diện riêng của kho đặt trên skill của thư viện khối. Năm bước: xếp nhóm và mở màn mẫu → nhóm mới tạo tệp bản đồ ngay trong vòng → `design-pass` với đối chiếu, ô chưa có khuôn thì mở ba lối → bước chấm (quét `--base`, kiểm ba lối, ghi số đo) → sau gộp thì ghi sổ lệch lọt | skill của kho, mục «Vòng giao diện qua bản đồ khuôn» |
| Cài đặt | kit chỉ ghim trong CI (`KIT_TAG: v2.36.0`); `settings.json` bật plugin, không ghim bản. Có một lệnh nhỏ **tìm thư mục kit khi thiếu `CLAUDE_PLUGIN_ROOT`** cho các bộ đo gọi script của kit. `config.yaml` khai nền M1, `design_pass.ds_skill` và `proto_route` | `05f62d7` (#11) |

**Đổi so với báo cáo 01/11** (chụp trên `11ce9f8`):

| Điểm | 01/11 | 03/11 (`3273a44`) |
|---|---|---|
| Số nhóm | 8 | **11** (thêm hai nhóm màn và một nhóm «trang mẫu») |
| Luật lint | 11 | **14** (ba luật bố cục) |
| Khoá bản đồ | 9 + `don_vi` | 9 + `don_vi`, **`bo_cuc`, `ngoai_le_han`** |
| Ngoại lệ rời nhóm ở nhóm trang tạm | 9 | **15** |
| Chỗ trạng thái theo khuôn (nhóm phần tử) | 21 | **57** |
| Tệp `ba-loi.json` · trang ba lối | 2 trang dựng tay | **5 tệp · 7 trang**; lời khuyên: lối thư viện ngoài 4, vẽ mới 1 |
| Bảng «Khối đã chuyển thể» | 3 dòng, sót một khối đã dùng | **12 dòng**, khối bị sót đã có dòng |
| Hàng đối chiếu ảnh ba ngăn (PR #64 của kho) | ký, chưa gộp | đã gộp (`design-pass` `closed` trên nhánh chính) |
| Commit sửa tay bài kiểm cây | 7 | **45 commit chạm tệp, 30 trong số đó từ chiều 01/11** |
| Hồ sơ có `khuon-so-do.json` | 2, cả hai `kit: null` | **vẫn 2** |
| Sổ lệch lọt | trống | **vẫn trống** |
| Lỗi đường `md-section` của lưới trước-gộp | kho gặp ở 3 hồ sơ | đã sửa trên `main` kit (`scripts/pre-merge-check.sh:458` gọi `kit_lib`), **chưa phát hành** |
| Ảnh tương đối trên trang bằng chứng | đã tái hiện | **chưa đổi** (`scripts/evidence-page.js:16`) — thuộc #477, phiên khác đang giữ |
| Bộ đọc khuôn của kit | chưa có | có trên `main` (#475, #476), **chưa phát hành, kho chưa dùng** |

## 3. Câu 1 — kho thứ hai làm được gì mà kit chưa có

| # | Thứ kho có | Kit hôm nay | Loại |
|---|---|---|---|
| Q1 | **Ngoại lệ rời nhóm**: dòng `{tep, ly_do}` không có `khoi` đưa tệp ra khỏi nhóm có glob rộng. Nhờ vậy nhóm «trang tạm» phủ mọi trang, và màn thật đầu tiên làm bộ kiểm đỏ cho tới khi nó rời nhóm. | không có nghĩa này: dòng thiếu `khoi` không khớp gì (`design-floor-khuon.mjs:125`), còn phép kiểm «hai nhóm màn» không đọc ngoại lệ (`:113`) | cách khai |
| Q2 | **Ngoại lệ có hạn**: `ngoai_le_han{tep, han: <slug>, ly_do}` hết hạn khi hồ sơ `<slug>` đã ký; quá hạn thì đỏ, slug lạ thì đỏ | không có; ngoại lệ của kit sống mãi, đếm bằng tay | luật + bộ đo |
| Q3 | **Bộ đọc cây mã** (TypeScript) cho khuôn ở gốc, khe và nhập — bắt được ba dạng sót mà kit đã khai | đọc theo mẫu chữ, ba dạng sót có ngưỡng mở DFK-C1 (finding 01/11 §14) | bộ đo |
| Q4 | **Đối chiếu cặp ảnh** màn mới–màn mẫu cùng khổ, cùng trạng thái; trang tự đủ vì nhúng ảnh | KH3 chờ; trang bằng chứng trỏ ảnh tương đối | nghi thức + bộ đo |
| Q5 | **Trang ba lối** có khuôn tệp, có lệnh dựng, có phép kiểm «chạm ô chưa có khuôn mà vắng trang»; ký Cổng Phạm vi là duyệt lối | KH6 / KH-C6 chờ ở vòng 2 | nghi thức + bộ đo |
| Q6 | **Vết chọn khối**: danh mục khối đã chuyển thể và «Chỗ hở» có hạn; lint đỏ khi thiếu ô | finding 01/11 §5 «vết danh mục khối», chưa làm | cách khai + bộ đo |
| Q7 | **Ảnh chuẩn ghim commit**: mỗi tấm ảnh chuẩn một dòng (địa chỉ, khổ, sáng/tối, sha 40 ký tự); kiểm bề rộng PNG | không có | bộ đo |
| Q8 | **Bản đồ hệ thiết kế**: một khối máy đọc liệt mẫu đường dẫn, một bảng «lớp · việc · đường dẫn» có danh sách lớp đóng, lint đỏ khi đường chết | `PRODUCT-MAP.md` cho kho, không có bản cho hệ thiết kế | cách khai |
| Q9 | **Tìm kit khi thiếu `CLAUDE_PLUGIN_ROOT`** — đọc sổ plugin đã cài, không đoán thư mục | lệnh trong `config.yaml` giả định có biến ấy; tác tử chấm và shell thường không có | cách cài |
| Q10 | **Cặp «Dùng khi / Không dùng» và mã luật trong thân tệp**, máy kiểm mã có mặt | L2 của kit chỉ cờ vàng khi thiếu; `luat` là khoá mở rộng không kiểm | cách khai |

## 4. Câu 2 — kit có gì mà kho thứ hai chưa dùng, hay dùng khác

| Thứ kit có (trên `main`) | Kho thứ hai hôm nay | Được gì nếu dùng |
|---|---|---|
| Phép kiểm theo **quan hệ** («mọi tệp khớp nhận diện thuộc đúng một nhóm»), không danh sách tay | bài kiểm cây giữ danh sách nhóm và tệp viết tay: 45 commit chạm tệp, 30 từ chiều 01/11 | bỏ một nguồn ma sát lặp ở mọi vòng giao diện |
| `khuon-cham.json` **do bước chấm tự ghi** (`--kiem --write`), thẻ Cổng Bằng chứng in một dòng «Khuôn: …» | `khuon-so-do.json` là bước nhớ-thì-chạy: 2 hồ sơ có, cả hai `kit: null` | số đo có ở mọi vòng mà không ai phải nhớ |
| **Ghim bản đồ theo hồ sơ** ở S1 (`--nap` → `khuon-nap.json`); bản đồ đổi sau khi ghim thì chấm theo bản ghim | hàng đối chiếu ảnh ba ngăn của kho phải xin ngoại lệ hồi tố trong sổ, vì luật vào nhánh chính sau Cổng Phạm vi của nó | đáp một nửa §3.1(1) của báo cáo 01/11: ghim **tệp bản đồ**, chưa ghim **luật quy trình** (như luật ba lối) |
| **Lưới `s4-args`**: hồ sơ chạm vùng nhóm mà thiếu eval `config:executors.design.khuon` thì dừng (`feature-loop/scripts/s4-args.mjs:352-364`) | không có — kho không khai `executors.design.khuon` | bước chấm khuôn không tuỳ vào tác tử nhớ |
| **Cờ vàng thay vì đỏ** cho khoá lạ; đọc được cả YAML khối lẫn YAML một dòng | kho đỏ ở mọi khoá lạ | — (kho chặt hơn; hợp lý vì nó là chủ khuôn của chính nó) |
| `--goi-y-eval --nhom` sinh eval khuôn với `paths` theo nhóm | không có | sửa một nhóm không kéo cả kho đi ghim lại |
| Nền màu M2 (tokens, registry) | kho dừng ở M1, `design-floor.json` của khoảng 30 hồ sơ ghi «tokens chưa khai» | trục riêng, không thuộc bản đồ khuôn |
| `design-pass` đọc `proto_route` | dùng, nhưng đường mẫu `/proto/{slug}` không khớp trang mẫu sống của kho (hồ sơ vỏ ứng dụng, Ngoài-4) | — thuộc hạt giống (§8) |

## 5. Câu 3 — chỗ hai bên lệch về khuôn tệp và tên khoá

### 5.1 Bảng lệch

| Điểm | Kit (`ban-do-khuon-template.md`, `ban-do-khuon.cjs`) | Kho thứ hai | Hậu quả khi kho cài kit | Nghiệm theo thứ tự luật |
|---|---|---|---|---|
| L1 · `ngoai_le` không `khoi` | dòng hợp lệ nhưng không làm gì | «tệp rời nhóm» | **báo oan đỏ** — §5.2 | bộ đọc khoan dung: không `khoi` = rời nhóm (V0) |
| L2 · số khoá bắt buộc | 8 khoá lõi, `luat` là mở rộng | 9 khoá, `luat` bắt buộc | không hại | để nguyên; kho được chặt hơn |
| L3 · `bo_cuc`, `ngoai_le_han` | không biết → cờ vàng «khoá lạ», 13 dòng trên 11 tệp | khoá của kho | chỉ ồn | để cờ vàng tới khi V3 quyết; **không** thêm tên vào danh sách mở rộng — tránh neo kit vào từ vựng một kho |
| L4 · «Không dùng» nằm giữa dòng | `cauDau` chỉ nhận đầu dòng hay tiêu đề (`ban-do-khuon.cjs:119`) | viết «**Dùng khi** … **Không dùng** …» trong một đoạn | cờ vàng oan 7/11 | bộ đọc khoan dung (V0, tuỳ chọn) |
| L5 · `nhan_viec` | cờ vàng khi thiếu | không khai | cờ vàng 11/11 | đúng thiết kế (L1 của finding 01/11); kho tự quyết có khai không |
| L6 · `doi_tuong` dạng danh sách | đọc thành chuỗi nối | danh sách | không hại (bước chấm không dùng) | đã ở Out of scope của `khuon-doc-ban-do-that` |
| L7 · `mau_dang_chay` | chỉ đọc `tep` | thêm `duong`, `trang_thai` cho đối chiếu ảnh | không hại | V2 cần hai khoá con này — khi rút đối chiếu ảnh, đọc chúng như mở rộng có tên |
| L8 · tệp số đo | `khuon-cham.json{schema, den, base, ghim, theo_khuon[], lech_moi[], no_cu[], khong_do[], ngoai_ban_do, nhom[]}` | `khuon-so-do.json{slug, base, head, tep_theo_khuon, rang_bat, lech_lot, kit, gioi_han}` | hai tệp song song nếu kho giữ cả hai | V1: kho bỏ tệp của mình, đọc tệp kit (TRỪ ở kho) |
| L9 · «ngoài bản đồ» | mọi tệp của vòng khớp `design.surface_globs` mà không thuộc nhóm màn (`design-floor-khuon.mjs:108`) | trang trả JSX mà không thuộc nhóm | số trên dòng thẻ ồn: 189 tệp khi so từ trước bản đồ (gồm thành phần, tệp `.ts`) | giới hạn khai; số tỉ lệ với diff của vòng, không làm đỏ |
| L10 · ai chấm | eval mang `config:executors.design.khuon`; lệnh do kho chọn | — | nếu kho trỏ eval vào bộ quét cây của mình, eval xanh nhưng `khuon-cham.json` vẫn do bộ mẫu chữ của kit ghi — hai bộ đếm | V1: eval trỏ lệnh kit để thẻ và eval cùng một bộ; bộ đọc cây của kho giữ ở lint lúc viết |

### 5.2 Đo trước và sau trên bản thật

Lệnh `chamKho` của `scripts/design-floor-khuon.mjs` (kit `main` `428b2773`) chạy trên bản sao dùng một lần. «SAU» là giả
lập một dòng: `nhomCuaTep` bỏ nhóm nào có dòng `ngoai_le` không `khoi` trỏ đúng tệp ấy. Mã giả lập nằm ở phụ lục riêng.

| Kho · base | TRƯỚC: lệch mới · nợ cũ · theo khuôn | SAU |
|---|---|---|
| kho thứ hai `3273a44` · base = cha của commit tạo bản đồ | **10 · 6** · 65 | **0 · 0** · 81 |
| kho thứ hai `3273a44` · base = 30 commit trước | **6 · 3** · 47 | **0 · 0** · 56 |
| kho thứ nhất, nhánh chính `3ee79f16` · base = 30 commit trước | 0 · 0 · 0 (nhóm duy nhất «không đọc được ở đây» — sổ đăng ký chưa khai `nhan_dien.tep`) | không đổi |

Trong 16 dòng báo oan, 15 là «thuộc hai nhóm màn», một là «thiếu khuôn» ở trang thử ẩn. Cả 16 tệp đều nằm trong danh sách
rời nhóm của nhóm trang tạm. Bộ đo của kho, chạy trên cây thật, báo **0 lệch ở cả 11 nhóm**. Toàn bộ 14 dòng `ngoai_le`
của kho thứ nhất đều mang `khoi`, nên vá này không đổi hành vi ở đó.

**Vì sao chặn được việc nhận mốc.** Theo QĐ-12, kho đã khai bản đồ mà có vòng chạm vùng nhóm thì phải có eval khuôn. Nhóm
trang tạm của kho thứ hai phủ mọi trang. Nên vòng giao diện đầu tiên sau khi cài 2.37.0, nếu chạm một màn thật như trang
cài đặt, sẽ có eval khuôn đỏ vì lỗi của kit. Đó đúng là hạ tầng kit đốt lượt chấm (dòng 3 của luật (c)). Kho thứ hai lại
là kho đã đo mốc gốc 01/11 cho 2.37.0 (finding 01/11 §16).

## 6. Câu 4 — động cơ dùng chung và nội dung riêng

Phép thử của `CLAUDE.md`: «kho KHÔNG có sự cố này được gì, mất gì?» và «thứ phải chép sang kho thứ hai thì không thuộc
kit».

| Thành phần | Kết luận | Vì sao |
|---|---|---|
| Nghĩa «ngoại lệ không `khoi` = rời nhóm» | **kit, ngay** | kho không viết kiểu này: được 0, mất 0 (đo §5.2). Khuôn tệp kit đã cho phép viết, vật đọc sai — cùng lớp với ba lỗi của `khuon-doc-ban-do-that` |
| Phép kiểm quan hệ, số đo tự ghi, ghim bản đồ | **kit, đã có** | kho thứ hai đang tự giữ bản thua (danh sách tay, đo nhớ-thì-chạy) |
| Khuôn tệp và lệnh đối chiếu cặp ảnh (kế hoạch chụp, trang tự đủ) | **kit, vòng 2** | mọi kho giao diện cần; kho thứ ba sẽ phải chép nguyên bộ nếu kit không giữ. Kho cấp địa chỉ màn mẫu (`mau_dang_chay.duong`) |
| Khuôn `ba-loi.json`, lệnh dựng trang, phép kiểm «ô chưa có khuôn mà vắng trang» | **kit, vòng 2** | quy trình, không phụ thuộc thư viện khối; ba tên lối là «trong kho · kho khối ngoài · vẽ mới» (finding 01/11 §4 đã đặt) |
| Ngoại lệ có hạn gắn slug hồ sơ | **hạt giống** (§8) | cơ chế thuần kit (slug + trạng thái hồ sơ), nhưng mới một kho dùng; kho thứ nhất chưa có nhu cầu đo được |
| Ảnh chuẩn ghim commit | **hạt giống** | cơ chế chung, nhưng gắn với «hệ bố cục» mà chưa kho nào khác có |
| Bộ đọc cây mã TypeScript | **ở lại kho** | đưa vào kit thì kéo theo phụ thuộc `typescript` và chỉ phục vụ kho React; ngưỡng DFK-C1 giữ nguyên. Kho dùng nó ở lint lúc viết, kit dùng mẫu chữ ở bước chấm — hai lưới, không phải hai bản |
| Luật lint «khối cấm theo vùng» | **ở lại kho** | finding 01/11 đã gộp KH4: kit cấp bộ đọc, kho tự bọc luật |
| 11 tệp nhóm, danh mục khối, «Chỗ hở», bố cục, ảnh chuẩn, trang mẫu sống, ADR thiết kế | **ở lại kho** | giá trị sản phẩm — sang kho thứ ba thì vô nghĩa |
| Bản đồ hệ thiết kế | **ở lại kho** | danh sách lớp và đường dẫn là của kho; kit đã có `PRODUCT-MAP` cho tầng kho |
| Thứ tự thẩm quyền và thang dùng lại bảy bậc | **ở lại kho** | gắn thư viện khối và style đã cài; phần chung đã có ở skill `ux-ui-craft` của kit |
| Tìm kit khi thiếu `CLAUDE_PLUGIN_ROOT` | **hạt giống** | ma sát cài đặt có ở mọi kho gọi script kit từ `config.yaml`; chưa đếm được ở kho nào khác |

## 7. Câu 5 — trình tự hoàn chỉnh

| Vế | Làm gì | TRỪ / CỘNG | Giá ước | Mở khi | Đo trước → sau |
|---|---|---|---|---|---|
| **V0 · vá bộ đọc** | L1: `nhomCuaTep` bỏ nhóm có `ngoai_le` không `khoi` trỏ tệp; khuôn tệp nói rõ hai nghĩa của `ngoai_le`. Kèm L4 nếu rẻ. Ca đỏ và im dựng kho mẫu theo HÌNH DẠNG của kho thứ hai (glob phủ mọi trang + danh sách rời nhóm), tên giả | **vá** — không thêm khả năng, sửa đọc sai một cách viết mà khuôn tệp đã cho phép; tiền lệ «Vá trước» của `khuon-doc-ban-do-that` | một vòng T2 nhỏ, 3–4 tiêu chí, một lượt chấm (tiền lệ: `khuon-doc-ban-do-that` một lượt) | **chủ kho quyết** (§10) | bảng §5.2 làm lệnh đo: kho thứ hai 16 → 0 · kho thứ nhất 0 → 0 |
| **V1 · kho thứ hai cài** | kho khai `executors.design.khuon` trỏ lệnh kit; bỏ bài kiểm cây danh sách tay, giữ phần quét cây ở lint; bỏ `khuon-so-do.json`, đọc `khuon-cham.json`; giữ khoá riêng (cờ vàng) | **TRỪ ở kho** — một PR của kho, không vòng kit | một PR kho; một lần đối chiếu L1–L10 | mốc có V0 được phát hành | mốc gốc 01/11 (lượt chấm 6 vòng 5·2·3·2·3·1 · 1/9 hồ sơ có số đo) cộng hai số mới: commit sửa tay bài kiểm cây (30 từ chiều 01/11) · hồ sơ có số đo (2). Sau 21 ngày: sửa tay → 0, số đo → mọi vòng giao diện |
| **V2 · Chọn khối ở cổng** | rút từ kho thứ hai: khuôn kế hoạch đối chiếu và trang tự đủ (nhúng ảnh), khuôn `ba-loi.json` và lệnh dựng, phép kiểm «ô chưa có khuôn mà vắng trang», khối «Khuôn» có ảnh trên thẻ hai cổng (KH2, KH3, KH6) | **CỘNG** — phê đích danh ở Cổng Phạm vi của vòng (ADR 0018) | một vòng, 8–12 tiêu chí; RẺ hơn ước 01/11 vì lấy hình dạng từ vật đã chạy (bộ lệnh `11ce9f8`, `2e1acf6`), không thiết kế mới | finding 01/11 §6: mốc vòng 1 được một kho nhận cài và chạy bước chấm khuôn — tức sau V1 | tỉ lệ lối duyệt khác lời khuyên (kho thứ hai: 5 tệp `ba-loi.json`, chưa đếm lối được chọn) · trang ba lối dựng tay so với bằng lệnh · ở kho thứ nhất: màn mới đầu tiên có trang ba lối không thêm lượt gọi người |
| **V3 · hạt giống** | ngoại lệ có hạn · ảnh chuẩn ghim commit · tìm kit khi thiếu biến · `proto_route` không khớp trang mẫu sống | — (chưa mở) | 0 | mỗi mục một ngưỡng ở hạt giống | — |
| **V4 · Khởi tạo từ mã** (KH5) | giữ như finding 01/11 §6 | CỘNG | như cũ | sau «bật nền thiết kế bằng một lệnh» | như cũ |

**Vì sao thứ tự này.** V0 đứng trước mọi thứ: bãi thử chỉ đáng tin khi thước không tự dối trên chính nó. Kho thứ hai đi
nhận mốc mà gặp 16 báo oan thì nó sẽ tắt bước chấm khuôn, và vòng 2 mất kho nhận. V1 là TRỪ: nó làm số đo của finding
01/11 §7 đọc được, vì sổ lệch lọt và `khuon-cham.json` chỉ có nghĩa khi bước chấm thật sự chạy. V2 là CỘNG lớn nhất nhưng
rẻ nhất có thể, vì kho thứ hai đã làm phần khó nhất: chứng minh quy trình chạy được ở Cổng Phạm vi mà không thêm cổng.

**Không làm:**
- Không đưa bộ đọc cây mã vào kit (lý do ở §6).
- Không thêm `bo_cuc`, `ngoai_le_han` vào danh sách mở rộng của kit trước V3.
- Không mở vòng meta thứ hai trước mốc kho nhận kế: luật chiều rộng (b) đã dùng suất cho `khuon-loi`. V0 tính là vá có neo
  ngoài, không phải vòng meta — chủ kho đảo được cách đọc này.

## 8. Hạt giống

Bốn ý chưa có neo đủ để mở ô, ghi ở
[`docs/plans/2026-11-03-hat-giong-khuon-hoc-tu-kho-thu-hai.md`](../plans/2026-11-03-hat-giong-khuon-hoc-tu-kho-thu-hai.md).
V0 có neo ngoài (hồ sơ tạo bản đồ của kho thứ hai, đã ký, cùng số đo §5.2). Sau quyết định «cắt trước» ở §10, nó vào
cùng tệp ấy ở mục H0, để mở ô ngay sau mốc 2.37.0.

## 9. Giới hạn đã khai

- **Bản ghi phiên của đợt không có trên máy này.** «Hài lòng» và chỗ vấp đọc từ bản chép phiên kho tự lưu, sổ quyết định
  và `git log`. Lượt gọi người mỗi vòng của đợt chưa đếm được. Ngưỡng: lần khảo sát sau phải chạy trên máy có bản ghi.
- **SAU ở §5.2 là giả lập**, không phải mã đã gộp. Số thật đo lại ở hồ sơ V0.
- **«Răng bắt lệch thật» vẫn bằng 0 ở kho thứ hai.** Cả 11 nhóm đều 0 lệch; chưa vòng nào cố ý dựng ngoài khuôn. Thước
  sau phát hành của QĐ-10 (21 ngày, 0 vòng đồng nhất lại, dưới 2 lệch lọt) vẫn là thước đúng; sổ lệch lọt vẫn trống.
- **Số «ngoài bản đồ» của kit ồn** ở kho dùng `design.surface_globs` rộng (L9). Ngưỡng mở: người ký hỏi về con số này một
  lần trên thẻ.

## 10. Quyết định cho chủ kho

**Câu hỏi:** cắt 2.37.0 sau khi vá V0 (bộ đọc hiểu `ngoai_le` không `khoi` là «tệp rời nhóm»), hay cắt 2.37.0 như đang có
rồi vá ở bản kế?

**Khuyến nghị: vá trước.** Căn cứ: §5.2. Kho thứ hai là kho đo mốc gốc cho 2.37.0; cài bản chưa vá thì vòng giao diện
đầu tiên của nó gặp eval khuôn đỏ vì lỗi của kit. Vá chỉ đổi một phép lọc; trên kho thứ nhất kết quả bằng hệt. Đánh đổi:
2.37.0 chậm thêm một vòng T2 nhỏ, cỡ `khuon-doc-ban-do-that`. Chữ «vá trước» hay «cắt trước» là của chủ kho.

**Chủ kho quyết 03/11: «Cắt trước».** 2.37.0 cắt với bộ đọc như đang có; V0 sang bản kế, giữ ở hạt giống (mục H0) để
không mất. Hệ quả máy tự áp, không thêm lượt gọi:
- **Kho thứ hai cài 2.37.0 thì lưới `s4-args` tự bật**, vì kho đã có `design/patterns/`
  (`feature-loop/scripts/s4-args.mjs:357-364`). Nhóm trang tạm và nhóm trạng thái của kho phủ mọi trang. Nên mọi vòng
  chạm giao diện phải có eval mang `config:executors.design.khuon`, nếu không `s4-args` dừng.
- **Đường đi được trên 2.37.0:** kho trỏ `executors.design.khuon` vào bộ quét cây của chính kho (lệnh do kho chọn), nên
  eval chấm đúng. Còn lại một chỗ oan: bước sau lượt chấm (`KHUON-SAU-S4`) vẫn ghi `khuon-cham.json` bằng bộ đọc kit. Thẻ
  Cổng Bằng chứng vì thế in lệch oan ở vòng chạm một tệp trong danh sách rời nhóm. Người ký đọc thẻ cạnh eval xanh.
- V1 đầy đủ (eval trỏ lệnh kit, bỏ bộ đo riêng) chờ bản có V0.
- Báo oan §5.2 và đường đi ở trên là giới hạn đã biết của 2.37.0. Ghi chúng vào hồ sơ mốc là việc của phiên mốc.

## 11. Phụ lục riêng

Bảng ánh xạ vai → đường dẫn và dòng trong kho thứ hai, cùng mã giả lập của §5.2, nằm ngoài kho công khai: thư mục ghi chú
chung của nhóm phiên 03/11, tệp `phu-luc-rieng-ban-do-khuon-kho-thu-hai.md`. Phiên chính có thể chép nó vào `raw/` của kho
tri thức kit.
