# Câu cho người gửi — tín hiệu đang ở đâu, đọc được bằng tiếng sản phẩm

Hồ sơ `_acceptance/cau-tin-hieu-nguoi-gui/` · Cổng Đáng 12/10 (owner «Làm», build T2, mốc 2.28) ·
Gốc: crm/_acceptance/gui-tin-hieu-trong-crm (E14) · vật nền: hồ sơ `cua-tin-hieu-gom-nhom` (L3, 2.27.0).

## 1. Vấn đề

Bản ghi đường đi của một tín hiệu (`scripts/tin-hieu.mjs --duong`, cũng là khoá `tin_hieu` của khối dữ
liệu lộ trình) mang MỘT câu `cau` dựng từ mã: «vào nhóm X → việc H5 → hồ sơ viec-h5: Đã giao». crm hiện
nguyên văn câu đó cho người phòng ban ở trang «Tín hiệu đã gửi». Đo 12/10: 5/7 câu có mã việc, tên hồ sơ
hay chữ nội bộ («gom», «lượt gom», «lẻ», «hồ sơ»). Chữ để viết câu sạch đã có trong kho lúc vẽ.

## 2. Hình dạng (chốt ở Cổng Đáng)

- Bản ghi thêm trường **`cau_nguoi_gui`** — câu cho người gửi — ở CUỐI `TRUONG_DUONG`.
- `cau` và mọi trường cũ giữ nguyên từng byte so với 2.27 (`294b29db`). Tài liệu ghi lại đúng tên của nó:
  câu cho chủ kho, có mã để lần.
- Mã máy đọc (`nhom`, `hang`, `ho_so`, `ho_so_phu`, `cho`) đã là trường riêng — không đổi.
- `scripts/lo-trinh.mjs` KHÔNG đổi: khối dữ liệu đặt nguyên mảng `--duong`, nên trường mới tự có mặt. Hai PR
  đang chờ gộp (#324, #325) cùng sửa tệp đó — vòng này không chạm.

Lối đã loại (sổ quyết định): sửa thẳng `cau` (đổi nghĩa trường đã phát hành, luật 26/09) · crm tự dịch
câu (hai nguồn trôi) · đặt phép kiểm câu vào răng phủ `--rang` (kho thử của chính L3 có hồ sơ mà câu giao
chứa tên hồ sơ — răng đang xanh sẽ đỏ, tức đổi hành vi một lệnh crm đã dựa; phép kiểm câu là lệnh riêng).

## 3. Câu cho người gửi — bảng khuôn

Câu dựng từ khuôn viết sẵn trong mã (`CAU_NGUOI_GUI`, cạnh `CAU`); mọi chỗ trống lấy từ dữ liệu. Không
chỗ nào chèn mã. `"…"` là dấu nháy kép thẳng bao chữ lấy từ dữ liệu.

| Chỗ (`cho`) | Câu cho người gửi |
|---|---|
| `chua-gom` | «chưa xếp vào nhóm nào — đội sản phẩm sẽ xem ở lần xếp nhóm tới» |
| `le` | «không xếp vào nhóm nào: <lý do>» · lý do vắng → «không xếp vào nhóm nào» |
| `da-phu` | «đã có trong việc "<câu giao>" — <tình trạng>» · câu giao vắng → «đã có trong một việc chưa có tên — <tình trạng>» |
| `nhom-chua-cat` | «đã vào nhóm "<tên nhóm>" — nhóm chưa thành việc» |
| `chan-troi` | «đã vào nhóm "<tên nhóm>" — để sau: <lý do>» · lý do vắng → «… — để sau» |
| `hang-chua-ho-so`, `hang-co-ho-so` | «đã vào nhóm "<tên nhóm>" và thành việc "<câu giao>" — <tình trạng>» · câu giao vắng → «… và thành một việc chưa có tên — <tình trạng>» |

Bảng nguyên văn chỗ «đã phủ» và «thành việc» theo tổ hợp (tình trạng của việc phủ / việc tính như §4 —
«đã phủ» thường trỏ việc đã giao vì răng phủ đòi thế, nhưng bộ vẽ không giả định điều đó):

| Tổ hợp | Câu (ví dụ câu giao «Gửi góp ý trong CRM», ngày 5/10/2026) |
|---|---|
| đã phủ · đã giao · có ngày · có câu giao | «đã có trong việc "Gửi góp ý trong CRM" — đã giao ngày 5/10/2026» |
| đã phủ · đã giao · không ngày · có câu giao | «đã có trong việc "Gửi góp ý trong CRM" — đã giao» |
| đã phủ · đang làm · có câu giao | «đã có trong việc "Gửi góp ý trong CRM" — đang làm» |
| đã phủ · đã giao · có ngày · câu giao vắng | «đã có trong một việc chưa có tên — đã giao ngày 5/10/2026» |
| thành việc · đã giao · có ngày | «đã vào nhóm "<tên>" và thành việc "Gửi góp ý trong CRM" — đã giao ngày 5/10/2026» |
| thành việc · chưa bắt đầu · câu giao vắng | «đã vào nhóm "<tên>" và thành một việc chưa có tên — chưa bắt đầu» |

Nguồn từng chỗ trống:

- **tên nhóm** — dòng nhóm của bản gom (`ten_nhom`, đã có).
- **lý do** — dòng lẻ / mục chân trời (`ly_do`, đã có).
- **câu giao của việc** — `cau_giao` của hàng (cùng dòng `phanTichKho` mà trang lộ trình vẽ), bỏ đúng một
  cặp «» bao trọn bằng `boNgoacNgoai` của `scripts/ho-so-tom-tat.cjs` (import, không chép).
- **câu giao của việc phủ** — `feature` trong hợp đồng của hồ sơ phủ, cùng phép bỏ «».
- **ngày** — ngày trong `human_signoff` của báo cáo bằng chứng (ngày người ký Cổng Bằng chứng), in
  `n/t/năm` không đệm số 0. Lệnh ký ghi «<tên> YYYY-MM-DD» (đo 12/10: mọi chữ ký của kit và crm đều dạng
  này, không có giờ) → lấy chuỗi YYYY-MM-DD ĐẦU TIÊN của giá trị, đúng như người ký ghi, không đổi múi giờ.
  Hồ sơ máy thông (`human_signoff` rỗng) → câu không có ngày. Chữ ký CÓ mà không đọc được ngày → `--cau` đỏ
  nêu hồ sơ và nguyên giá trị (không rơi lặng về «đã giao» không ngày). Không dùng `moi_nguoi.ngay` của dải
  tóm tắt: đó là mốc gần nhất (có thể là ngày quan sát production hay ngày duyệt), không phải ngày giao.
- **tình trạng** — cụm tiếng người theo chữ trạng thái của việc (bảng §4).

## 4. Tình trạng — cụm tiếng người theo chữ trạng thái

Chữ trạng thái của việc là tiêu đề một ô của bản đồ sản phẩm, hoặc «Chưa mở» / «Không suy được». Cụm
tiếng người đi theo NHÓM TIẾN ĐỘ mà khối dữ liệu đã dùng (`nhom_trang_thai`: `DA_GIAO_O`, `DANG_LAM_O`,
`CHUA_LAM_O` + «Chưa mở» của `scripts/lo-trinh.mjs` — import), nhóm «khác» tách theo ô:

| Nhóm tiến độ | Ô / chữ | Cụm |
|---|---|---|
| da-giao | `cho-nghiem-thu`, `da-ship`, `da-nghiem-thu` | «đã giao» + « ngày <n/t/năm>» khi có |
| dang-lam | `cho-duyet`, `dang-dung` | «đang làm» |
| chua-bat-dau | `can-nhac`, `sap-mo`, «Chưa mở» | «chưa bắt đầu» |
| khac | `xep-lai` | «tạm hoãn» |
| khac | `da-bac`, `ngoai-pham-vi` | «đội sản phẩm quyết định không làm» |
| khac | `hong`, «Không suy được», chữ lạ | «chưa xem được tình trạng» |

Ma trận toàn phần trong ca đo: mọi ô của `SECTIONS` + hai chữ + một chữ lạ đều có cụm, nhóm của cụm bằng
nhóm khối dữ liệu tính. Bản đồ thêm một ô mới mà bảng chưa có cụm → ca đỏ nêu ô (không rơi lặng vào «chưa
xem được»).

## 5. Phép kiểm câu — `--cau`

`node scripts/tin-hieu.mjs --root . --cau` · 0 sạch · 1 có câu lọt · 2 không chạy được. Chỉ đọc.

**Lọt mã — đo quan hệ, không đoán bằng mẫu chữ.** Bộ mã của kho: id mọi tín hiệu của nguồn · mã nhóm và
`dot` của mọi bản gom · `ma`, `slug` của mọi hàng và `ma` của mọi chân trời trên mọi tệp lộ trình · tên
mọi thư mục hồ sơ trong `_acceptance/`. Một mã lọt khi nó đứng trong câu như một từ riêng (không dính chữ,
số, `_`, `-` ở hai bên; so phân biệt hoa thường, chuẩn hoá NFC).

Mã **giống chữ thường** không kiểm được: chỉ có chữ số («4», «10»), hoặc chỉ một chữ cái («M»), hoặc chỉ
chữ thường không số không gạch (thư mục hồ sơ «zalo»). crm có câu giao «… khuôn OKR quý 4» trong khi có
việc mã «4» — kiểm mã đó là báo nhầm trên dữ liệu thật. Lệnh in số mã bỏ qua kèm lý do (giới hạn đã khai
có đếm, không im).

**Từ cấm — một nguồn có marker.** Khối `TIN-HIEU-CAU-CAM` trong
`skills/acceptance/references/tin-hieu-template.md`, mỗi dòng `- <từ>` hoặc `- <từ> (khung)`:

- từ thường — cấm trong CẢ câu (kể cả chữ lấy từ dữ liệu): những từ không có nghĩa sản phẩm ở kho nào
  («lượt gom», «bản gom», «cắt lượt», «bản phạm vi», «chân trời», «slug»);
- từ `(khung)` — chỉ cấm trong phần KIT viết: từ nội bộ của kit nhưng là chữ sản phẩm ở kho khác («hồ sơ» —
  CRM có «hồ sơ khách hàng»; «gom», «lẻ», «lượt», «hàng», «lộ trình»).

Phần kit viết của một câu = câu dựng lại với mọi chữ LẤY TỪ DỮ LIỆU (tên nhóm, lý do, câu giao, ngày) thay
bằng dấu canh rồi gỡ dấu canh — đúng nhánh khuôn câu đã đi, không phải một bản khung đoán. Cụm tình trạng
(§4) là chữ kit viết, nên nằm TRONG phần kit viết. So từ và so mã: chuẩn hoá NFC cả câu lẫn từ / mã trước khi
so (chữ gõ bằng bảng mã tổ hợp vẫn khớp), không phân biệt hoa thường với từ, phân biệt với mã; ranh giới là
chữ / số Unicode.

Đầu ra: sạch → một dòng «câu cho người gửi: N câu sạch · kiểm M mã của kho · bỏ qua K mã giống chữ thường
(…)». Lọt → mỗi lỗi một dòng: `tín hiệu <id>: câu cho người gửi lọt mã «<mã>» — "<câu>"` hoặc `… có từ nội
bộ «<từ>» — "<câu>"`.

Thêm một lỗi máy giữ: hồ sơ đã giao có chữ ký người mà không rút được ngày → `tín hiệu <id>: hồ sơ của việc
có chữ ký mà không đọc được ngày «<giá trị>»` (dòng nêu tên hồ sơ — đây là dòng chủ kho đọc, không phải câu
cho người gửi).

Khối cấm vắng hoặc rỗng → thoát 2 nêu khối (không kiểm bằng danh sách rỗng).

## 6. Đường đọc-cũ + cờ vàng

- Bộ đọc cũ (crm hôm nay đọc `cau`) chạy như cũ: `cau` không đổi byte.
- Bộ đọc mẫu `cauChoNguoiGui(banGhi)` → `{ cau, co }`: bản ghi có `cau_nguoi_gui` (chuỗi) → câu đó,
  `co: null`; vắng (bản vẽ bằng kit < 2.28) → `cau` cũ kèm MỘT cờ vàng «bản vẽ cũ — chưa có câu cho người
  gửi; đang hiện câu cho chủ kho, có thể mang mã — vẽ lại bằng kit ≥ 2.28».
- `docDuLieu` (bản chép rời trong `scripts/lo-trinh.mjs`) KHÔNG đổi: nó vẫn giữ mảng nguyên vẹn, cảnh báo
  như trang không khoá. Cờ vàng sống ở tầng bản ghi tín hiệu, không ở tầng khối — đổi `docDuLieu` là chạm
  tệp hai PR đang sửa và đổi cảnh báo của mọi kho có khoá.
- Tài liệu `lo-trinh-du-lieu.md`, khối `LO-TRINH-DU-LIEU-TUY-CHON`: thêm dòng `tin_hieu.cau_nguoi_gui`,
  sửa mô tả `tin_hieu.cau`, thêm đoạn luật đọc (đọc `cau_nguoi_gui`, vắng thì `cau` + cờ vàng). Chỉ đoạn
  khoá `tin_hieu` — khác đoạn hai PR sửa.

## 7. Skill gom

`skills/gom-tin-hieu/SKILL.md` thêm khối lệnh `GOM-CAU` (chạy `--cau`) đứng sau `GOM-RANG`, trước bước
chuyển cắt lượt, kèm một câu: tên nhóm và lý do hiện nguyên văn cho người gửi — câu lọt mã thì sửa tên
nhóm / lý do rồi commit lại. Phép kiểm là máy giữ; câu dặn chỉ chỉ chỗ.

## 8. Đo

- Kho thử do mã sinh trong lượt (bộ dựng kho của `tests/scripts/tin-hieu.test.mjs`), tín hiệu từ khối
  `TIN-HIEU-MAU` của khuôn. Ca mới tiền tố `CN-`, cùng tệp ca — ca TH của L3 không đổi.
- Phép so «trường cũ không đổi byte»: bản base = CÂY ĐANG KIỂM chép trọn (`scripts lib skills dieu-phoi`)
  với RIÊNG `scripts/tin-hieu.mjs` lấy từ `294b29db` (2.27) — tệp vật duy nhất của vòng có mã. Gộp main
  giữa vòng (PR #324/#325 sửa `lo-trinh.mjs`, `ho-so-tom-tat.cjs`) có mặt ở CẢ hai phía, nên không đỏ giả;
  ca im trong lượt: bản base có `lo-trinh.mjs` bị đổi cách vẽ (thêm một dòng chú thích vào trang) vẫn so
  xanh vì phép so là bản ghi đường đi, không phải trang. «Kho không khai giống từng byte» đã do ca TH-2 của
  hồ sơ L3 giữ (bộ vẽ thay mô-đun cửa bằng bản ném lỗi) — vòng này không đổi đường đó, không dựng ca thứ hai.
- Ngày giao đo trên chữ ký thật: kho thử dùng bản chép NGUYÊN VĂN báo cáo bằng chứng đã ký của hồ sơ
  `cua-tin-hieu-gom-nhom` trong cây kit (đường suy từ vị trí tệp ca), ngày mong đợi rút độc lập bằng biểu
  thức của ca. Bản sao crm: câu của việc phủ đã giao thật phải mang ngày rút độc lập từ báo cáo crm.
- Dữ liệu thật crm: `_acceptance/cau-tin-hieu-nguoi-gui/rang/do-crm.mjs --crm <kho> --sha 06e34d26c…` dựng
  bản sao bằng `git archive` (lộ trình thật, hồ sơ thật, khai cửa thật), nối tín hiệu mẫu vào việc thật ở
  mọi nhóm tiến độ crm đang có (máy chọn tất định: việc đầu tiên của mỗi nhóm), đặt tên nhóm tiếng sản
  phẩm, chạy `--duong` + `--cau`. `--ghi` ghi `mau/cau-mau.json` (câu của kho thử và của bản sao crm); không
  `--ghi` → so tệp đã commit với bản sinh lại. Chiều đỏ trên CÙNG bản sao: tên nhóm mang một tên hồ sơ crm
  thật → `--cau` thoát 1 nêu câu. crm vắng → thoát 2 nêu đường (mù, không xanh giả).
- Giám khảo vai «người gửi ở phòng ban, không dùng git» đọc `mau/cau-mau.json`.

## 9. Giới hạn khai trước

- Mã viết tự do trong tên nhóm / lý do mà không thuộc bộ mã của kho (vd «F9» là mã một phát hiện, không
  phải hàng) → không bắt. Ngưỡng mở: ≥1 câu cho người gửi ở crm bị người hay giám khảo chỉ ra mang mã ngoài
  bộ mã kho.
- Mã giống chữ thường (§5) không kiểm. Đếm ở mỗi lượt `--cau`.
- Câu tiếng Việt; tiếng Anh ngoài phạm vi tới khi một kho có neo.
