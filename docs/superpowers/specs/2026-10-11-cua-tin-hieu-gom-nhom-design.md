# Cửa tín hiệu và gom nhóm — design (hàng L3)

Hồ sơ: `_acceptance/cua-tin-hieu-gom-nhom/` · Cổng Đáng ký build T2, trục A, 11/10 (owner «Làm») ·
hàng đứng trên L2 (cắt lượt) và X1 (khối dữ liệu lộ trình).

## 1. Điều chủ kho muốn (máy viết lại từ ô cơ hội và lời giao 11/10 — sửa nếu lệch)

- **Kết quả:** mọi người gửi tín hiệu vào MỘT cửa của kho; máy (phiên Claude Code theo skill) gom thành
  nhóm đặt tên bằng tiếng sản phẩm; mỗi tín hiệu ở đúng một chỗ — một nhóm, lẻ kèm lý do, hoặc đã phủ bởi
  việc đã giao; người gửi thấy tín hiệu của mình đi tới đâu. Chuỗi: **tín hiệu → nhóm → bản phạm vi →
  hàng → hồ sơ → trạng thái**.
- **Ai dùng:** chủ kho (người gom, hôm nay gom tay) · đội sản phẩm không git và trưởng phòng ban (chỉ xem +
  gửi; nút gửi là hàng LT2 của crm) · kỹ sư (phát sinh qua kênh yêu cầu của gói Điều phối).
- **Ràng buộc đã chốt:**
  - Kit mang KHUÔN tín hiệu + bộ đọc + răng + đường đi; kit KHÔNG giữ kho tín hiệu — kho khai nguồn
    (như `lo_trinh.tep`).
  - Một hộp thư: khuôn tín hiệu = khuôn yêu cầu của gói Điều phối (spec 2026-10-05 §4.9). KHÔNG sửa
    `dieu-phoi/`; buộc phải đổi khuôn chung thì dừng, báo phiên điều phối.
  - Dùng lại khuôn bản phạm vi + răng phủ của L2 bằng import; KHÔNG sửa `scripts/cat-luot.mjs`.
  - Trục gom là chính sách chủ kho chốt một lần: **A — kết quả người dùng**. Máy áp, không hỏi lại.
  - Kho không khai cửa tín hiệu: không đổi byte nào (luật 26/09).
  - «Kit render, không soạn»: việc phán (tín hiệu nào vào nhóm nào, tên nhóm) là của phiên theo skill;
    mã kit chỉ đọc, kiểm, vẽ — 0 lời gọi mô hình.
- **Thành công:** ngưỡng ở ô cơ hội — lượt gom thật đầu tiên của crm, chủ kho sửa dưới 1/5 số nhóm, mọi
  trùng đã biết chung nhóm; «0 tín hiệu lọt» do răng giữ ở mọi lượt.

## 2. Ba phương án bộ phận, chọn một

| Phương án | Mô tả | Vì sao chọn / bỏ |
|---|---|---|
| **(1) Bản gom LÀ bản phạm vi** *(chọn)* | Một tệp markdown trong git theo khuôn bản phạm vi, thêm khoá `truc`, `den` và hai ngăn không-mã (lẻ, đã phủ); mỗi dòng mã là một nhóm, dòng thụt dưới nó kê tín hiệu | Một vật, một nguồn: cắt lượt đọc thẳng tệp này bằng `docPhamVi`, không có bước chép nhóm sang bản phạm vi (lớp «bên viết và bên đọc trôi»). Ngăn lẻ/đã phủ mở bằng chữ khác «- \`» nên bộ đọc bản phạm vi bỏ qua đúng như luật của nó |
| (2) Bản gom riêng + bản phạm vi riêng | Hai tệp; máy sinh bản phạm vi từ bản gom | Hai vật phải giữ khớp, thêm một bộ sinh — bỏ |
| (3) Gom thẳng vào tệp lộ trình (`phu` trỏ tín hiệu) | Không có tầng nhóm | Mất bước «bản phạm vi» mà cắt lượt đứng trên; hàng chở hàng chục mã tín hiệu — bỏ |

## 3. Kiến trúc

```
nguồn kho khai (tin_hieu.nguon: thư mục *.json, khuôn yêu cầu)
   └─ scripts/tin-hieu.mjs  docTinHieu ── kiemYeuCau (import dieu-phoi, chỉ đọc)
bản gom trong git (tin_hieu.gom: thư mục *.md, khuôn bản phạm vi + ngăn)
   └─ scripts/tin-hieu.mjs  docBanGom ── docPhamVi (import cat-luot)
răng phủ  (--rang)      : mỗi tín hiệu tới mốc `den` ở đúng một chỗ trên mọi bản gom
chưa gom  (--chua-gom)  : JSON cho skill — tín hiệu chưa có chỗ + việc đã giao + đếm ngoài khuôn
đường đi  (--duong)     : tín hiệu → chỗ → hàng (phu + dot) → hồ sơ → trạng thái (phanTichKho của lo-trinh)
khối dữ liệu lộ trình   : khoá `tin_hieu` CHỈ khi kho khai cửa (scripts/lo-trinh.mjs gọi lười)
skills/gom-tin-hieu/SKILL.md : phiên gom theo trục A, ghi bản gom, chạy răng, chuyển cho cắt lượt
```

### 3.1 Khuôn tín hiệu (một hộp thư)

Một tệp `<nguồn>/<id>.json`, `id` = tên tệp bỏ đuôi (khuôn `<phiên>-<số>` của Điều phối). Thân là ĐÚNG
khuôn yêu cầu: `{phien, loai, hang, noi_dung, luc}`. Bộ đọc gọi `kiemYeuCau` của
`dieu-phoi/scripts/hinh-dang.mjs` (import lười — chỉ khi kho khai cửa) rồi thêm hai kiểm của riêng nó:
`luc` là ISO đọc được; loại `tin-hieu` có `noi_dung.tieu_de` không rỗng. Tệp sai khuôn → răng đỏ gọi tên
tệp và lý do (không bỏ lặng).

Loại tính là tín hiệu — MỘT nguồn, khối marker `TIN-HIEU-LOAI` trong khuôn
`skills/acceptance/references/tin-hieu-template.md`: `tin-hieu` (người gửi qua cửa) · `viec-phu` ·
`hang-moi` (phát sinh của thợ đề xuất việc). Loại khác (`cham-tep`, `gia-han`, `can-nguoi`, `khac`…) là
yêu cầu vận hành: không vào gom, nhưng `--chua-gom` và `--rang` in MỘT dòng đếm «ngoài khuôn tín hiệu:
<loại> <số>…» — không im.

`tin-hieu` là một GIÁ TRỊ mới của trường `loai` vốn mở (`kiemYeuCau` chỉ đòi `phien`, `loai` không rỗng;
đợt crm 07–09/10 đã có 9 loại, 3 loại ngoài bảng §4.9). Không đổi hình dạng, không sửa `dieu-phoi/`.
Tín hiệu người KHÔNG đi vào thư mục yêu cầu của đợt — ở đó bộ xét trả «cần phán» và đánh thức giám sát;
nó nằm ở nguồn kho khai. Tiêu đề hiển thị rút theo thứ tự `noi_dung.tieu_de` → `noi_dung.viec` →
`noi_dung.cau_giao` → chuỗi `noi_dung` (khuôn thật của `viec-phu` dùng `viec`).

### 3.2 Ổ cắm

```yaml
tin_hieu:
  nguon: [<thư mục>, …]   # một chuỗi hoặc danh sách, như lo_trinh.tep
  gom: <thư mục bản gom>   # các tệp *.md trong git
```

Bộ đọc khoá cắt đúng khối `tin_hieu:` ở cột 0 (cùng cách `lo-trinh-khoa.cjs` cắt khối `lo_trinh:` — bộ đọc
danh sách chung khớp mọi khoá thụt ở bất cứ khối nào). Vắng khối, vắng `nguon`, hoặc vắng `gom` → cửa
vắng: lệnh tường minh thoát 2 «kho chưa khai cửa tín hiệu», bản đồ và trang lộ trình giống từng byte.

### 3.3 Bản gom

```
dot: gom-2026-11
dang: chuoi
nguon: cửa tín hiệu — tín hiệu tới 2026-10-28
truc: ket-qua
den: 2026-10-28T00:00:00Z

- `G1` — Kỹ sư ghim lại một hồ sơ mà không trả giá cho hồ sơ khác
  - tín hiệu: `P1-12`, `crm-u7-3`
- `G2` — Trưởng phòng ban thấy số tuần trước khi cập nhật KR
  - tín hiệu: `crm-u2-1`

- lẻ `crm-u9-1` — <lý do một câu>
- đã phủ `crm-u4-2` — <slug hồ sơ đã giao>
```

- Ba khoá của bản phạm vi giữ nguyên nghĩa; hai khoá mới: `truc` (phải bằng chính sách) và `den` (mốc
  ISO: mọi tín hiệu có `luc` ≤ `den` phải có chỗ).
- Dòng nhóm là dòng mã của bản phạm vi; dòng thụt `  - tín hiệu:` kê id trong backtick. Dòng lẻ/đã phủ mở
  bằng `- lẻ ` / `- đã phủ ` — `docPhamVi` chỉ nhặt dòng mở bằng «- \`», nên chúng không thành mã.
- Tệp phải có trong git (cùng luật bản phạm vi của cắt lượt).

### 3.4 Răng phủ (`--rang`)

Trên MỌI bản gom trong `tin_hieu.gom` và mọi tín hiệu của mọi nguồn:
- mỗi tín hiệu có `luc` ≤ max(`den`) ở **đúng một** chỗ (nhóm · lẻ · đã phủ) trên mọi tệp; thiếu → «tín
  hiệu <id> chưa có chỗ»; hai chỗ → nêu cả hai;
- id kê trong bản gom mà nguồn không có → đỏ; lẻ thiếu lý do → đỏ; nhóm không kê tín hiệu nào → đỏ;
- đã phủ trỏ hồ sơ không có, hoặc hồ sơ chưa giao → đỏ nêu slug. «Đã giao» = đúng tập trạng thái mà cắt
  lượt và lưới trước-gộp dùng (`DA_THONG_CONG_2` ∪ `DA_DONG_THUC_TE` của `lib/workspace-record.cjs`);
- `truc` vắng hoặc khác chính sách → đỏ; bản gom ngoài git → thoát 2; mỗi bản gom phải đọc được bằng
  `docPhamVi` 0 lỗi (lỗi của nó in nguyên văn);
- tín hiệu sau mốc `den` lớn nhất: không đỏ — «chưa gom» trong đường đi.
Xanh → bảng phủ đủ N dòng (id → chỗ). Mã thoát 0 · 1 · 2 như cắt lượt.

### 3.5 Chính sách trục

Khối marker `GOM-TRUC` trong `skills/gom-tin-hieu/SKILL.md`: `truc: ket-qua` + định nghĩa một đoạn (nhóm =
một điều một vai muốn làm được; tên nhóm mở bằng vai). Răng rút giá trị từ khối lúc chạy (không ghi cứng
trong mã — cùng nếp `CAT-LUOT-CO`). Đổi trục = sửa khối = một Cổng Đáng mới.

### 3.6 Đường đi (`--duong [--id <id>]`)

Mỗi tín hiệu ra một bản ghi `{id, loai, tieu_de, luc, cho, nhom, ly_do, ho_so_phu, hang, ho_so,
trang_thai, cau}`, `cau` là MỘT câu dựng từ bảng khuôn câu viết sẵn (render, không soạn):

| Chỗ | Câu |
|---|---|
| chưa gom | «chưa gom — tín hiệu tới sau lượt gom gần nhất» |
| lẻ | «lẻ — <lý do>» |
| đã phủ | «đã có việc đã giao: <slug> (<trạng thái ô>)» |
| nhóm, chưa cắt | «vào nhóm <tên> — nhóm chưa thành việc» |
| nhóm, ở chân trời | «vào nhóm <tên> — để sau: <ly_do>» |
| nhóm → hàng chưa mở | «vào nhóm <tên> → việc <mã>: <trạng thái hàng>» |
| nhóm → hàng có hồ sơ | «vào nhóm <tên> → việc <mã> → hồ sơ <slug>: <trạng thái hàng>» |

Hàng tìm bằng `dot` của bản gom + `phu` chứa mã nhóm (răng của cắt lượt bảo đảm đúng một); trạng thái hàng
lấy từ `phanTichKho` của `scripts/lo-trinh.mjs` — cùng hàm vẽ trang lộ trình, hai bên không thể nói khác.

### 3.7 Khối dữ liệu lộ trình

Kho khai cửa → khối `lo-trinh-du-lieu` mang thêm khoá gốc `tin_hieu` = mảng bản ghi đường đi (mọi ô
rút từ tệp tín hiệu và hồ sơ — không có giờ chạy, nên vẽ hai lần ra cùng byte). Kho không khai → khối
không có khoá, giống từng byte. Không đổi `phien_ban` và KHÔNG thêm vào bảng khoá chuẩn
`KHUON_DU_LIEU` (ca LT-110 của X1 so khoá thô của trang với bảng viết sẵn — thêm vào bảng chuẩn là làm đỏ
ca đã ký và đổi byte mọi kho): khoá là TUỲ CHỌN, bộ đọc bản 2 giữ khoá lạ nguyên vẹn (luật «khoá lạ giữ
nguyên» của `docDuLieu`), trang không có khoá thì bộ đọc ra như cũ. Tài liệu `lo-trinh-du-lieu.md` thêm
một khối riêng `LO-TRINH-DU-LIEU-TUY-CHON` kê các trường bản ghi (`TRUONG_DUONG` của `tin-hieu.mjs`).
crm (LT2) đọc khoá này để hiện cho người gửi.

### 3.8 Skill `gom-tin-hieu`

1. Đọc chính sách trục (khối `GOM-TRUC`).
2. `--chua-gom` → tín hiệu chưa có chỗ + danh sách việc đã giao (slug + câu giao) + dòng ngoài khuôn.
3. Gom theo trục A: tín hiệu cùng một kết quả → một nhóm (tên «<vai> <điều muốn làm được>»); trùng lặp
   → chung nhóm; ý đã có việc đã giao làm xong → đã phủ (slug); không vào nhóm nào → lẻ kèm lý do.
4. Ghi bản gom mới (đợt mới, `den` = lúc đọc), commit, chạy `--rang` tới xanh. Commit đầu tiên mà răng
   xanh là MỐC so cho «người sửa bao nhiêu nhóm» — các lượt máy sửa cho răng xanh không tính là người sửa.
5. Chuyển cho skill cắt lượt: bản gom là bản phạm vi của đợt.
6. `--duong` để báo người gửi.
Khối lệnh trong SKILL nằm trong marker (`GOM-RANG`, `GOM-CHUA-GOM`, `GOM-DUONG`) để ca đo chạy NGUYÊN VĂN.

## 4. Chứng minh

- **Ca đo:** `tests/scripts/tin-hieu.test.mjs` (mã ca `TH-…`), executor mới
  `executors.test.tin_hieu` (tiền lệ DP3/DP7 thêm executor). Kho thử do mã sinh trong lượt (git init thư
  mục tạm); tín hiệu thử sinh bằng hàm ghi dựng trên khối mẫu rút từ khuôn `tin-hieu-template.md`; bản
  gom thử sinh từ khối mẫu `GOM-MAU`. Mỗi ca đỏ chạy CHÍNH hàm đo trên bản sao bị tiêm sau khi bản lành
  xanh trên cùng kho, ghim thông điệp.
- **Dữ liệu thật:** bản ẩn danh 374 yêu cầu `tests/dieu-phoi/fixtures/dot-crm-0910/yeu-cau/` đọc qua bộ
  đọc: số đếm theo loại khớp đếm độc lập trong ca; tín hiệu = `viec-phu` + `hang-moi`.
- **Bộ vàng (dữ liệu giả có nhãn) — KÍN ĐÁP ÁN:** `_acceptance/cua-tin-hieu-gom-nhom/rang/sinh-bo-vang.mjs`
  sinh — từ 10 hồ sơ crm có «Hạng mục cùng lớp» ở `origin/onehub` `27d47de04` — HAI tín hiệu mỗi hồ sơ, KHÔNG
  lấy câu `feature` (câu đó là câu giao mà `--chua-gom` in cho hồ sơ đã giao — lấy nó là trao đáp án): một
  từ câu đầu mục «Vấn đề & ai gặp», một từ dòng «Câu hỏi phép đo trả lời» của mục ngưỡng. Mọi tệp mang
  `noi_dung.nhan: "giả — sinh từ crm <sha>"` (KHÔNG có slug), `phien` trung tính (`vang-a`, `vang-b`), id
  xáo theo hạt cố định để hai tín hiệu một cặp không đứng cạnh nhau. Đáp án chỉ nằm ở `mau/bo-vang.json`
  (20 mục `{id, tieu_de, ho_so, cum}` + 10 cặp trùng + 4 hồ sơ đã giao + bốn cụm «cùng lớp» viết tay) —
  tệp này VẮNG khỏi kho thử đưa cho tác tử gom. Đầu ra sinh một lần, commit vào `mau/` kèm sha nguồn;
  máy không có crm thì bộ sinh thoát có tên, ca đo dùng bản đã commit.
- **Bộ chấm cặp trùng là một LỆNH, không phải ca riêng:** `rang/cham-bo-vang.mjs --root <kho> --bo-vang
  <tệp> --gom <thư mục>` — chạy răng, kiểm cặp trùng chung chỗ, «đã phủ» đúng hồ sơ, và commit đầu tiên
  của `bo-vang.json` đứng TRƯỚC commit đầu tiên của bản gom (khai trước). Ca đo chạy nó trên bộ vàng
  của kit và trên một bộ vàng thứ hai do mã sinh (để chứng không ghi cứng); Cổng Giá trị chạy nó trên
  bộ vàng crm.
- **Một lượt gom thật bằng skill:** ở S3, một tác tử TƯƠI chỉ được SKILL + khuôn + kho thử dựng từ bộ vàng
  (hồ sơ đã giao dựng bằng mã theo trạng thái thật) — ghi bản gom vào `mau/gom-bo-vang.md`. Máy chấm: răng
  xanh, 10/10 cặp trùng chung chỗ, hồ sơ đã giao ra «đã phủ» đúng slug. Hội đồng chấm: tên nhóm theo trục
  A, có vai, người gửi không git nhận ra ý mình.
- **Kho không khai — hai vế:** (a) khối `lo-trinh-du-lieu` thô (JSON.parse, KHÔNG qua bộ đọc điền
  mặc định) có tập khoá gốc == bảng khoá trừ `tin_hieu`; (b) trên kho thử không khai cửa, `PRODUCT-MAP.md` và `LO-TRINH.html` vẽ bằng cây đang
  kiểm giống từng byte bản vẽ bằng một bản sao cùng cây mà mô-đun cửa tín hiệu bị thay bằng bản ném lỗi
  khi nạp — tức đường «không khai» không chạm mã mới. KHÔNG neo một sha cố định: so với «bộ vẽ trước
  vòng» thì sau khi gộp nó thành lệnh cấm vĩnh viễn cho mọi vòng sau đổi bộ vẽ (bài học #307). Chiều đỏ
  tiêm ĐỐI XỨNG: bản sao `lo-trinh.mjs` mặc định `tin_hieu: []` dùng cho CẢ HAI phía phép so byte → vế
  (a) đỏ nêu «tin_hieu» (vế (b) một mình không bắt được lỗi ở chỗ gọi lười, vì hai phía cùng sai).

## 5. Ngoài phạm vi (máy quyết, đảo được — sổ quyết định)

- Nút gửi trong CRM, nơi crm cất tín hiệu, xuất tín hiệu từ CSDL ra thư mục — hàng LT2 / việc của crm.
- Trục B, C; trục theo từng kho — mở khi kho thứ hai thật sự cần.
- Mục «Tín hiệu» nhìn thấy trên `LO-TRINH.html` — vòng này chỉ đưa vào khối dữ liệu (không mặt người nhìn
  mới, không làn design); mở khi một kho không có CRM cần hiện cho người gửi.
- Đếm người bầu / độ ưu tiên theo số tín hiệu (kiểu Canny) — trái «không xếp điểm ưu tiên tự động».
- Gửi tin báo cho người gửi khi trạng thái đổi — kit không gửi gì ra ngoài.
- Kit tự khai cửa cho hạt giống của mình — hạt giống là markdown, không phải khuôn tín hiệu.

## 6. Giới hạn đã khai

- Lượt gom thật bằng skill chỉ có MỘT mẫu (bộ vàng, S3) — độ ổn định qua nhiều lượt không đo ở đây;
  ngưỡng thật đo ở Cổng Giá trị trên tín hiệu crm.
- Bộ vàng là dữ liệu giả sinh từ hồ sơ hạ tầng của crm (tiếng kỹ sư), không phải góp ý phòng ban — trục A
  trên ngôn ngữ phòng ban chỉ đo được ở lượt gom thật.
- Phụ thuộc hai bộ đọc import: `docPhamVi` (phiên S3b đang sửa) và `kiemYeuCau` (máy M5 giữ). Ca round-trip
  của vòng đỏ ngay khi một bên đổi luật đọc — đó là chiều đỏ mong muốn, không phải lỗi của vòng.
