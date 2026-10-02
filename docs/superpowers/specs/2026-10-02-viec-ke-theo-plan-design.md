# Lộ trình vào kit, lát 1 — ổ cắm đọc tệp ý định + trang vẽ

Hồ sơ: `_acceptance/viec-ke-theo-plan/` (Cổng Đáng `build` 02/10, owner duyệt hướng 02/10).
Nguồn chữ: `docs/plans/2026-09-06-hat-giong-viec-ke-theo-plan.md` §«Cập nhật 02/10» và §8.

## Vấn đề

Chủ kho đã tự dựng lộ trình ba lần ở hai kho (crm OKR 28 hàng · crm Kho tài liệu 11 hàng · oneflow
24 tuần), mỗi lần một khuôn, và lần nào trạng thái cũng gõ tay dù sự thật đã nằm trong hồ sơ cổng.
12 commit «bản chụp» trong 4 ngày cho một lộ trình; 23/48 tin owner ở lượt 4 OKR là hỏi tiến độ.
Người hưởng: owner ở phiên điều phối (đọc trạng thái thay vì hỏi) và mọi phiên vào kho ở S0 (biết
hàng kế mà không đọc bốn tệp). Trace: nguyên tố 1 — ý định chốt trước khi làm, và trạng thái
không do người tự khai.

## Hình dạng

Hai lớp, không gộp: **ý định** do người ghi (tệp JSON trong kho, đổi bằng PR) và **trạng thái** do
máy suy từ `_acceptance/` bằng đúng hàm xếp ô của bản đồ sản phẩm. Kit đọc tệp ý định, KHÔNG BAO
GIỜ ghi vào nó.

```
_acceptance/config.yaml ── lo_trinh.tep ──► tệp ý định (JSON, người ghi)
                                                   │ đọc
_acceptance/<slug>/ ── classify() của bản đồ ──► scripts/lo-trinh.mjs ──► LO-TRINH.html (cạnh PRODUCT-MAP.md)
                                                   │                  └─► start-scan: loTrinh (ba dòng thẻ)
                                                   └─► --hang <mã> (feature-loop S0)
```

### Ổ cắm

Khoá `lo_trinh.tep` trong `_acceptance/config.yaml` = đường dẫn tương đối gốc kho tới tệp ý định.
Đọc bằng `resolveConfigKey` (bộ đọc config dùng chung — không parser thứ hai). Khoá vắng hoặc rỗng
→ mọi đầu ra giống hệt hôm nay: bản đồ cùng byte, không trang, JSON quét có `loTrinh: null`.

### Khuôn tệp ý định (schema 1)

```json
{
  "schema": 1,
  "ten": "Lộ trình OKR",
  "moc": [{ "ten": "Mùa OKR năm", "ngay": "2026-12-07", "loai": "han", "ai": "owner", "hang": ["9b"] }],
  "hang": [{
    "ma": "9b", "cau_giao": "«Tôi bấm … và nhận vài đề xuất»", "vi_sao": "…",
    "hang": "T3", "dung_tren": ["9a"], "slug": "tro-ly-okr-de-xuat", "bat_khi": "…",
    "trang_thai": "Đã giao", "nhom": "tro-ly"
  }],
  "da_bac": [{ "ma": "x1", "ly_do": "…" }]
}
```

- Bắt buộc ở hàng: `ma` · `cau_giao`. Thiếu → cờ vàng nêu mã + trường, hàng vẫn hiện.
- Tuỳ chọn: `hang` · `vi_sao` · `dung_tren[]` · `slug` · `bat_khi` · `trang_thai`. Vắng → không cờ.
  `hang` tuỳ chọn vì đo trên hai lộ trình crm: 6/43 hàng chưa có hạng — hàng đo, hàng vận hành, hàng
  chưa cắt thành vòng (S3 task 1, sổ quyết định).
- Mọi trường khác là trường tự do của kho: đọc vào, giữ nguyên, không in, không cờ.
- `trang_thai` là lời TỰ KHAI. Bằng một tên ô của bản đồ (so không phân biệt hoa thường) → đem so với
  ô suy từ hồ sơ; khác → cờ «tệp khai khác hồ sơ». Ngoài từ vựng ô → in «tự khai: …», không cờ.
- Mã trùng → cờ. `dung_tren` trỏ mã không có → cờ, hàng không đủ điều kiện mở.

Vì sao JSON và không đọc thẳng `lo-trinh-okr.data.js` của crm: kit phải neo vào khuôn kit định nghĩa,
không vào từ vựng một kho (luật 26/09); JSON đọc được không thêm thư viện. crm tự giữ trang Artifact
của nó.

### Trạng thái — một định nghĩa duy nhất

Mỗi hàng ra đúng một chữ trạng thái, theo thứ tự xét:

| Hàng | Chữ trạng thái | Đếm «tin theo lời» | Cờ |
|---|---|---|---|
| có `slug`, thư mục `_acceptance/<slug>/` có | tiêu đề ô mà `classify()` của bản đồ xếp slug đó | không | xem dưới |
| có `slug`, thư mục chưa có (slug dự kiến) | «Chưa mở» | không | không — slug dự kiến là hợp lệ |
| không `slug`, `trang_thai` là một tiêu đề ô | tiêu đề ô đó, kèm «(tin theo lời)» | có | không |
| không `slug`, còn lại | «Chưa mở», kèm «(tin theo lời)» | có | không |

`classify()` là hàm của `scripts/product-map.mjs` (xuất ra, không chép) → tiêu đề mục `SECTIONS`. Không
bảng nhãn thứ hai.

- **Tập «đã giao»** = tiêu đề ba ô `cho-nghiem-thu` · `da-ship` · `da-nghiem-thu`.
- **Tập «chưa làm»** = «Chưa mở» · «Đang cân nhắc cơ hội» · «Sắp mở vòng».
- **Hàng kế** = hàng ĐẦU TIÊN theo thứ tự tệp có chữ trạng thái thuộc tập «chưa làm» mà MỌI hàng trong
  `dung_tren` có chữ thuộc tập «đã giao». `dung_tren` trỏ mã không có → cờ «đứng trên mã không có: X»,
  hàng đó không bao giờ là hàng kế. Không hàng nào đủ → `null`, trang in «chưa có hàng đủ điều kiện».
- **Tự khai** (`trang_thai`) trên hàng CÓ slug và thư mục: bằng một tiêu đề ô (so sau khi gọt khoảng
  trắng, không phân biệt hoa thường) mà khác ô suy → cờ «tệp khai khác hồ sơ: khai X, hồ sơ Y». Ngoài
  từ vựng ô → in «tự khai: …», không cờ từng hàng, nhưng trang và thẻ in một dòng đếm «N hàng tự khai
  ngoài từ vựng — không so được với hồ sơ» (`loTrinh.tuKhaiNgoai`). Thẻ không bao giờ im về lời khai
  không so được.
- **Đổi hạng:** hàng có slug, hồ sơ có `contract.md`, `risk_tier` đọc bằng `frontmatterField` (bộ đọc
  chung, gọt chú thích cuối dòng) khác `hang` của tệp → cờ «hạng tệp X, hồ sơ Y». Hồ sơ chưa có
  `contract.md` → không cờ hạng. Nhiều hàng cùng trỏ một slug là hợp lệ (một vòng phủ nhiều mã).

### Trang `LO-TRINH.html`

Sinh cùng lượt `product-map.mjs` ghi bản đồ, cùng `--check`. Tĩnh, tự đủ (CSS nội tuyến, sáng/tối
theo `prefers-color-scheme`, không script, không tài nguyên ngoài). **Tất định:** không ngày chạy, không
«hôm nay» — hai lần vẽ cho cùng byte, `--check` không đỏ qua đêm. Nội dung theo thứ tự:

1. Đầu trang: tên lộ trình · tệp nguồn · dòng đếm theo ô · dòng «hàng sống qua Cổng Đáng: k/n» ·
   dòng «tự khai ngoài từ vựng» khi N > 0.
2. Hàng kế: mã · câu giao · và các hàng nó đứng trên kèm chữ trạng thái của từng hàng (vì sao đủ
   điều kiện). Hàng kế không phụ thuộc ngày, nên nằm được trên trang tất định.
3. Bảng hàng theo thứ tự tệp: mã · câu giao · hạng · đứng trên · trạng thái (kèm cờ) · bật khi · vì sao.
4. Mốc: tên · ngày · loại · hàng gắn.
5. Đã bác: mã · lý do.
6. Vòng ngoài lộ trình: hồ sơ trong `_acceptance/` không hàng nào trỏ — đếm + liệt kê, không đỏ.
7. Cờ: gom mọi cờ vàng.

Tệp ý định lỗi (vắng · JSON hỏng · đường ra ngoài kho · gốc không phải object) → trang một khối nói
thẳng lý do; `product-map` ghi thoát 0; thẻ start in đúng lý do. Lỗi của tệp kho không làm CI đỏ;
`--check` chỉ so byte. Khoá có mà trang vắng/lệch → `--check` exit 1, thông điệp có tên.

«Hàng sống qua Cổng Đáng: k/n»: n = hàng có slug mà hồ sơ có `opportunity.md` đã `decided`;
k = trong đó `decision` là `build` hoặc `iterate`. Mỗi slug đếm một lần.

### Thẻ start

`start-scan.mjs` thêm khoá `loTrinh` (null khi vắng ổ cắm):
`{ tep, ten, loi, hangKe: {ma, cauGiao} | null, hangTre: [{ma, moc, ngay}], tinTheoLoi: {n, tong}, tuKhaiNgoai, co }`
— `co` là CÙNG danh sách cờ in trên trang (một hàm tính, hai bên in).

- Hàng kế: đúng định nghĩa ở §Trạng thái (cùng hàm với trang).
- Hàng trễ = hàng gắn một mốc có `ngay` < hôm nay mà chưa giao. «Hôm nay» đọc từ
  `ACCEPTANCE_TODAY` nếu có (để test ghim đồng hồ), ngược lại ngày UTC của máy. Chỉ thẻ dùng ngày.
- `commands/start.md` in ba dòng khi `loTrinh` khác null; thêm khoá vào `START-SCAN-KEYS` (P99).

### feature-loop S0 nhận một hàng

`lo-trinh.mjs --root . --hang <mã>` in JSON của hàng (exit 0); mã không có → exit 1 «không có hàng
<mã> trong <tệp>»; vắng khoá → exit 1 «kho chưa khai lo_trinh.tep». Ở kho tiêu thụ script nằm trong
gói acceptance-gate, KHÔNG trong `scripts/` của kho, nên khối marker `S0-NHAN-HANG` của SKILL S0 giải
gói trước, đúng nếp các bước khác của SKILL:

```
AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/lo-trinh.mjs) && node "$AG/scripts/lo-trinh.mjs" --root . --hang <mã>
```

Đối số không khớp workspace nào mà lệnh thoát 0 → mô tả việc = `cau_giao` + `vi_sao`, slug = `slug` của
hàng (vắng → kebab của mã), `hang` của hàng in cạnh hạng máy suy (khác thì nói ra, máy không tự đổi).
Test chạy khối này NGUYÊN VĂN (chỉ thay `<mã>`) trong kho fixture, với `WORKFLOWS_DIR` và gốc bộ giải
đặt như harness đặt.

### Trang mẫu cho hội đồng

`tests/scripts/lo-trinh-mau.mjs` dựng một kho tạm từ fixture crm OKR cộng một cây hồ sơ do code sinh
(mỗi slug của fixture một hồ sơ ở một ô khai trong fixture, ít nhất một hàng lệch tự khai), vẽ trang và
ghi `_acceptance/viec-ke-theo-plan/mau/lo-trinh-crm-okr.html`. Test giữ bản đã commit bằng nhau với bản
vẽ lại.

## Đơn vị mã

| Tệp | Việc |
|---|---|
| `scripts/lo-trinh.mjs` (mới) | đọc tệp · kiểm khuôn · suy trạng thái (nhận `classify` qua tham số) · render HTML · tính `loTrinh` cho thẻ · CLI `--hang` |
| `scripts/product-map.mjs` | `export classify`; ghi + `--check` trang khi có khoá |
| `scripts/start-scan.mjs` | khoá `loTrinh` |
| `commands/start.md` | ba dòng + `START-SCAN-KEYS` |
| `feature-loop/skills/feature-loop/SKILL.md` | khối `S0-NHAN-HANG` |
| `skills/acceptance/references/lo-trinh-template.json` (mới) | khuôn mẫu, test round-trip với bộ đọc |
| `CONTEXT.md` · `GUIDE.md` | term «Lộ trình»; cách bật (khoá + thêm `LO-TRINH.html` vào `t1_skip_globs`) |
| `tests/scripts/lo-trinh.test.mjs` (mới) + `tests/scripts/fixtures/lo-trinh/*.json` + `tests/scripts/lo-trinh-mau.mjs` | ca đo LT-* · trang mẫu |

Không chạm `lib/**`, hook, lưới trước-merge → hạng T2.

## Thứ tự

Task đầu không có dòng mã: viết tay khối sáu trường cho ba lộ trình thật (crm OKR, crm Kho tài
liệu, oneflow) thành fixture — giả định sinh tử 1. Đọc không được mà không đổi trường tự do → dừng,
khuôn sai, trình người.

## Thước

Năm dòng (dự báo): làm-xong→quyết-được ↓ · lượt gọi người/vòng = · vòng hạ tầng đốt = · token máy/vòng
= (tất định, 0 lượt LLM khi chạy) · phút máy/lượt chấm =. Số riêng: tin hỏi tiến độ/lộ trình, nền 23/48.

## Ngoài phạm vi lát 1

Kit ghi tệp ý định · đọc `data.js` của crm · skill cắt lượt và nhịp thật (lát 2) · cờ tuổi theo mốc
phát hành · thước «hàng bị sửa sau khi vòng mở» (lát 2) · băng/răng chống trôi (lát C) · nấc CRM.
