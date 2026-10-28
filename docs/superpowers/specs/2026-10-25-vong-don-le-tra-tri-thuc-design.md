# Vòng đơn lẻ tra tri thức — thiết kế (TT5, đợt tri-thuc-2410)

**Hồ sơ:** `_acceptance/vong-don-le-tra-tri-thuc/` · **Hàng:** TT5 của `docs/plans/lo-trinh-kit.json` · **Phủ:** `C2`,
`E1` của `docs/plans/pham-vi-tri-thuc-2410.md` · **Thiết kế đợt:** `docs/findings/2026-10-24-tang-tri-thuc-llm-wiki.md`
§3.2 · **Đứng trên:** TT4 (`_acceptance/thiet-ke-nap-tri-thuc/`, dòng «đã tra tri thức»).

## 1. Vấn đề

Sau TT1–TT4, vòng mở từ một hàng lộ trình nhận trang tri thức qua dòng «Nguồn:» của ô, và bước thiết kế ghi dòng «đã
tra tri thức». Còn hai lỗ:

- **Vòng đơn lẻ** (`/feature-loop <mô tả>`) không có ô mang dòng «Nguồn:». SKILL dặn «đọc trang khác máy thấy liên
  quan», nhưng không có lệnh nào tra — máy tự lần thư mục hoặc ghi `"trang":[]`. Dặn bằng lời, không có vật.
- **Lời người ở cổng của vòng trước** nằm trong `decisions.jsonl` của hồ sơ trước (dòng `gate1`, `gate2`, dòng S1 bị
  lật). Thiết kế đợt đã bỏ bước chép quyết định sang trang (phản biện 24/10, mục 3) với lời hứa «bộ tra đọc thẳng sổ
  của mọi hồ sơ» — lời hứa ấy chưa có bộ tra. `claim-scan.mjs` đọc sổ nhưng chỉ dòng `fix`/`descope`, chỉ cho phản biện,
  không theo mô tả việc.

## 2. Thiết kế

### 2.1 Một lệnh tra: `tri-thuc.mjs --tra`

```
node scripts/tri-thuc.mjs --root . --tra [--slug <hồ sơ>] [--json]   < câu mô tả qua stdin
```

- **Câu mô tả đi qua stdin** (khối lệnh trong SKILL dùng heredoc CÓ NHÁY), không bao giờ vào đối số shell — cùng luật
  với `S0-THEM-HANG`: câu mô tả có backtick hay `$(...)` thì nằm trong nháy kép vẫn chạy.
- **Trang**: mọi trang `loai: nen` (luôn có, như vòng từ hàng) + trang `chu-de`/`dot` khớp câu mô tả theo **tìm chữ**
  trên tiêu đề (dòng `# ` đầu), giá trị frontmatter và tiêu đề mục (`##`, `###`) — đúng ba chỗ thiết kế đợt §3.2 nêu.
  Phép khớp: chuẩn hoá NFC + chữ thường, tách âm tiết; «thuật ngữ» = cặp âm tiết liền nhau của câu mô tả cộng mọi chữ có
  chữ số (mã như `TT5`, `C2`); điểm = số thuật ngữ khác nhau có mặt. Tiếng Việt ghép từ bằng âm tiết nên cặp âm tiết bắt
  được «tri thức», «sổ quyết» mà một âm tiết lẻ («tra», «kho») thì nhiễu. Ngưỡng điểm và trần số trang là hằng ở đầu tệp.
- **Có `--slug`**: đọc dòng «Nguồn:» của `_acceptance/<slug>/opportunity.md` (bộ đọc `docDongNguon` của TT3) và đưa mọi
  đường trỏ của nó vào danh sách trang — vòng từ hàng chạy CÙNG lệnh với câu giao làm câu mô tả, nên dòng tra lệnh in đủ
  trang thẻ đòi. Hồ sơ của `--slug` bị loại khỏi phần tra sổ.
- **Sổ hồ sơ trước** (E1): mọi `_acceptance/*/decisions.jsonl` trừ hồ sơ đang chạy; mỗi dòng có `decision` chuỗi, chấm
  điểm trên `decision` + `why` cùng phép khớp. Bỏ dòng đã bị một dòng sau thay (`supersedes`) — giữ dòng thay nó. Dòng
  **lời người** (`stage` `gate1`/`gate2`, hoặc có `decided_by`) xếp trước dòng máy khi cùng điểm. Dòng hỏng bỏ qua và
  đếm vào một dòng cảnh báo (không im lặng). Đường trỏ sổ: `<hồ sơ>#<mã dòng>`.
- **Căn cứ dựng sẵn**: mỗi dòng sổ tìm được mang sẵn một khối `can_cu` nguồn `muc-tieu` với `tep` =
  `_acceptance/<hồ sơ>/decisions.jsonl` và `trich` = đoạn dài nhất của `decision` mà dạng JSON trùng dạng chữ (không
  `"`, `\`, ký tự điều khiển), từ 20 ký tự trở lên — bộ xếp hiện có so `trich` với chữ THÔ của tệp, nên đoạn có ký tự bị
  thoát sẽ không khớp. Không có đoạn đủ dài → không kèm khối.
- **Đầu ra**: văn bản (trang, dòng sổ, rồi dòng `tri_thuc_tra: {…}` dựng sẵn) hoặc `--json`. Đối tượng `tri_thuc_tra`
  mang `tra` (câu mô tả nguyên văn), `trang`, `so`, và `khong_doc` khi kho riêng vắng ở máy.
- **Mã thoát**: 0 đã tra (kể cả không có gì liên quan) · 2 không chạy được (kho chưa khai `tri_thuc`, khối lỗi, câu
  rỗng). Kho riêng vắng KHÔNG phải mã 3 ở lệnh này: sổ vẫn tra được trong kho, nên lệnh thoát 0, `trang` chỉ còn trang
  của dòng «Nguồn:» (nếu có), và đối tượng mang `khong_doc` = dòng «không đọc được ở đây» như TT4.

Tra sổ sống ở `scripts/tri-thuc-tra.cjs` (CJS: thẻ cần đọc lại đường trỏ sổ); `tri-thuc.mjs` gọi nó.

### 2.2 Dòng tra mang thêm `so`

Khối `DEC-TRI-THUC-TRA` thêm `"so":["<đường trỏ sổ>"]`. SKILL bước 0c: chạy khối lệnh `TRI-THUC-TRA-MO-TA` (heredoc)
cho MỌI vòng ở kho đã khai — vòng đơn lẻ với câu mô tả, vòng từ hàng với câu giao và `--slug`; chép đối tượng lệnh in
vào dòng tra. Lựa chọn dựa trên một dòng sổ trước → căn cứ là khối `can_cu` lệnh in sẵn.

Thẻ Cổng Phạm vi (`theCong1` của TT4):

| Hồ sơ | Dòng tra | Thẻ |
|---|---|---|
| `draft` | không có | chặn như TT4 |
| `draft` | có, THIẾU khoá `so` (hay `so` không phải mảng) | **chặn**: «CHƯA vào được Cổng Phạm vi: chưa tra sổ quyết định của hồ sơ trước …» — máy tự tra, ghi dòng mới |
| `draft` | có `so`, mọi đường trỏ có dòng | không cờ |
| `draft` | có `so`, một đường trỏ không có dòng hoặc sai khuôn | cờ vàng «dòng sổ hồ sơ trước không có: <đường trỏ>», không chặn |
| đã qua Cổng Phạm vi | bất kỳ | như TT4 (đọc-cũ), không kiểm `so` |
| kho không khai `tri_thuc` | — | như trước vòng từng byte |

Chặn khi thiếu `so` chứ không chỉ cờ: luật kit cấm dặn-bằng-lời làm nghiệm — không có răng thì bước tra sổ là lời. Chặn
không gọi người (máy tự gỡ, cùng khoá `tri_thuc.chan` và khối `TRI-THUC-TRA-CHAN` của TT4).

**Đây là một CỘNG** (phản biện 25/10, P0; tiền lệ TT4): mở rộng một điều kiện chặn Cổng Phạm vi phát hành tới mọi kho đã
khai `tri_thuc`. Luật CỘNG đòi chủ kho phê đích danh ở Cổng Phạm vi của chính vòng → câu Hỏi-1 trên thẻ. Máy khuyên
chặn; lối khác là cờ vàng không chặn — khi đó AC-5 đổi hàng một, hai thành «cờ vàng, `chan = false`». Hai chỗ dựng dòng
tra trong ca TT4 thêm `so` ở cả hai lối (thẻ đổi khi thiếu `so` dù chặn hay cờ). Người hưởng: chủ kho và phiên mở vòng ở crm và invest (lời người ở cổng vòng trước tới vòng sau).

### 2.3 Đường đo: `can-cu-s1.cjs --dem`

Ngưỡng của ô: «Sau 10 hồ sơ có dòng tra ở các kho đã khai, ≥ 30 % có ít nhất một dòng căn cứ ở bước thiết kế trỏ trang
tri thức hay sổ hồ sơ trước (đếm bằng `can-cu-s1.cjs --dem`)». `--dem` chưa đếm được điều đó. Thêm, CHỈ khi kho khai
`tri_thuc`: mỗi hàng mang `dong_tra` (có dòng tra còn hiệu lực) và `can_cu_tri_thuc` (số dòng S1 lớp `da-quyet` có căn cứ
trỏ trang — khoá `tri_thuc` — hoặc trỏ `_acceptance/<hồ sơ KHÁC>/decisions.jsonl`); văn bản thêm hai vế ấy vào mỗi
dòng và một dòng cuối `đường đo tri thức: <k>/<N> hồ sơ có dòng tra có căn cứ trỏ trang hay sổ trước`. JSON giữ hình
mảng hàng (bên đọc cũ không vỡ), mỗi hàng thêm hai khoá; `k/N` tính từ hai khoá ấy. Kho không khai → cả văn bản lẫn JSON
từng byte như trước.

### 2.4 Hạt giống gộp vào: đường trỏ kho riêng thiếu tiền tố

`docs/plans/2026-10-25-hat-giong-tro-kho-rieng-khong-tien-to.md` (Ngoài-3 của TT4): `xetCanCu` chỉ đỏ
`tri-thuc-kem-trich` khi đường trỏ có tiền tố `<kho>:`, mà ở kho khai `tri_thuc.kho` đường trỏ KHÔNG tiền tố cũng giải
vào kho riêng — câu trích từ kho riêng lọt vào sổ công khai. Sửa theo đề xuất 1 của hạt giống: «kho riêng» xác định
bằng `giaiGoc(...).trongKho === false`, không bằng chữ. Gộp vì cùng vùng (bộ xếp căn cứ tri thức), và ngưỡng mở của hạt
giống — «kho đầu tiên khai `tri_thuc.kho` nhận bản phát hành có TT4» — chính là bản phát hành gom TT5.

## 3. Ngoài phạm vi

- Tra theo nghĩa (F3) — tìm chữ là giới hạn đã khai; ngưỡng của ô đo nó.
- Tra sổ ở kho KHÔNG khai `tri_thuc` — đổi mặc định cho mọi kho; đường mở: khai `tri_thuc`.
- Đọc thân trang khi khớp (chỉ tiêu đề, frontmatter, tiêu đề mục — thiết kế đợt §3.2).
- Kiểm dòng tra ở pre-merge, recheck hay làn ghim lại (như TT4).
- Chứng máy đã hiểu hay chọn đúng trang, đúng dòng sổ.

## 4. Bảng ca

| Ca | Đầu vào | Kỳ vọng | Chiều đỏ |
|---|---|---|---|
| tra trang | kho thử: 1 nền, 4 trang (khớp tiêu đề · khớp mục · khớp frontmatter · không khớp) | nền + 3 trang khớp, đường trỏ `--con-tro` 0 | bỏ quét tiêu đề mục |
| không có gì | câu không khớp; kho không trang nền | chỉ nền; `trang: []` | — |
| tra sổ | 3 hồ sơ khác + hồ sơ mình; dòng người, dòng máy, dòng bị thay, dòng không khớp, dòng hỏng | đúng tập, người trước, loại mình, loại bị thay | bỏ loại hồ sơ mình |
| kho riêng vắng | khai `kho`, đường không có | thoát 0, `khong_doc`, `so` vẫn đủ | — |
| câu độc | backtick, `$(…)`, nháy, xuống dòng | không tệp canh nào sinh, `tra` nguyên văn | — |
| thẻ | ma trận `so` | bảng 2.2 | bỏ chặn khi thiếu `so` |
| khuôn | khối SKILL thật → bash → sổ | thẻ nhận, bộ xếp `da-quyet` | đổi tên khoá `so` trong khuôn |
| đếm | 4 hồ sơ | `k/N` đúng | đếm sổ của chính hồ sơ |
| hạt giống | đường trỏ không tiền tố + `trich` | kho riêng đỏ, kho trong kho xanh | trả về luật theo tiền tố |
| chiều im | kho không khai | thẻ, extract, xếp, `--dem` giống từng byte bản trước vòng | luôn thêm khoá mới |

## Bảng dự báo năm dòng (luật (c))

| Dòng | Dự báo | Vì sao |
|---|---|---|
| làm-xong → quyết-được | = | không đổi cổng |
| lượt gọi người/vòng | = | chặn mới máy tự gỡ |
| vòng bị hạ tầng đốt lượt | = | — |
| token máy/vòng | ↑ nhẹ | bước thiết kế đọc thêm trang và dòng sổ |
| phút máy/lượt chấm | = | — |

Điều kiện tin cậy: đường verdict không đổi thành phần.
