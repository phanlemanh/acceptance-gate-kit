# Vòng là một kết quả — răng cắt lượt đọc cỡ vòng và dáng câu giao

- Ngày: 2026-10-11 · Hồ sơ: `_acceptance/vong-la-mot-ket-qua/` · Hàng lộ trình kit: **S3** (đứng trên L2)
- Ô Cổng Đáng ký build 04/09 — mở lại, không ký lại. Chính sách chốt 10/10 ở `ghi_chu` của hàng S3.
- Hạng: máy suy **T2** (chạm `scripts/cat-luot.mjs`, `skills/cat-luot/`, khuôn lộ trình, test — không
  chạm `lib/**`, hook, lưới trước-merge). Hàng S3 ghi T3; máy không tự sửa hàng, nói ra ở Cổng Phạm vi.

## 1. Kết quả (dáng việc nền — hành vi hệ thống đo được)

Khi một phiên cắt một đợt phạm vi thành hàng lộ trình, răng cắt lượt nói ra **trước khi PR mở**, bằng
cờ có tên: hàng nào dự kiến quá một vòng (phải tách), hàng nào dưới mục tiêu và gộp được với hàng cùng
nhóm, hàng nào câu giao lệch dáng đã khai; và một lệnh chỉ đọc in lại bảng **cỡ → lượt chấm → chạm
trần** từ chính hồ sơ đã giao của kho, để mỗi mốc đọc lại khoảng cỡ trên số thật thay vì số chép.

Người hưởng: phiên Claude Code cắt lượt (biết tách/gộp trước khi vòng mở, không sau 3 lượt chấm) và
qua nó là chủ kho (ít vòng nổ trần → ít lượt gọi người trên mỗi kết quả). Nguyên tố trace: **1 — ý định
chốt trước khi làm** (cỡ và dáng chốt ở lượt cắt, trước Cổng Đáng của từng hàng).

## 2. Chính sách (chủ kho chốt 10/10 — không hỏi lại)

- Một vòng = một kết quả. Mục tiêu 8–10 tiêu chí; cho phép 11–12 khi kết quả không tách được mà giữ
  nghĩa; từ 13 bắt buộc tách.
- Câu giao hai dáng: việc người dùng thấy → có VAI («Trưởng phòng ban mở … và thấy …»); việc nền
  (không người dùng cuối) → HÀNH VI HỆ THỐNG đo được, không ép «Là kỹ sư…».
- Lộ trình không thêm trường cho agent — phần của agent ở hợp đồng · phép đo · kế hoạch.

## 3. Số đo nền (đo lại 11/10, cùng thước vòng này sẽ dựng)

Thước: **tiêu chí** = số mã khác nhau từ `parseACBlock` (`lib/ac-line.cjs` — chính bộ đọc thẻ Cổng
Phạm vi dùng; đọc cả dạng gạch đầu dòng lẫn tiêu đề `### AC-n`) · **lượt chấm** = số dòng tiêu đề
`### S4 round` trong `usage-report.md` (bên ghi: `wf-usage.mjs --title "S4 round N"`, mục «Đo
model/token per run» của Feature Loop) · **chạm trần** = ≥ 3 lượt · **đã giao** = trạng thái trong
`DA_THONG_CONG_2` ∪ `DA_DONG_THUC_TE` (`lib/workspace-record.cjs`).

| kho | N đếm được (bỏ: không lượt chấm) | ≤ 7 | 8–10 | 11–12 | ≥ 13 | trong 8–12 |
|---|---|---|---|---|---|---|
| crm | 150 (65) | 49 · 1,53 · 10 % | 36 · 1,97 · 22 % | 13 · 3,08 · 38 % | 52 · 2,90 · 62 % | 33 % số vòng · chạm trần 27 % |
| kit | 70 (54) | 27 · 2,11 · 33 % | 21 · 3,19 · 62 % | 11 · 3,09 · 45 % | 11 · 3,18 · 64 % | 46 % số vòng · chạm trần 56 % |

(ô = n · lượt chấm trung bình · % chạm trần)

Ba điều số này nói, mỗi điều đổi một chỗ của thiết kế:

1. **Thước 10/10 hẹp hơn bộ đọc chung.** Số 10/10 đếm bằng mẫu `- AC-` — bỏ sót 22/150 hợp đồng crm
   khai tiêu chí bằng tiêu đề. Cùng bộ đọc chung, khoảng 8–12 trên crm là 2,27 lượt · 27 % chạm trần
   (10/10 ghi 2,20 · 24 %). Vòng này đếm bằng bộ đọc chung (luật «một khuôn cho bên viết và bên
   đọc»); ngưỡng hàng `bat_khi` «không vượt 24 %» giữ nguyên chữ chủ kho — đồng hồ in nền đo cùng
   thước cạnh nó để người đọc so táo với táo.
2. **Mỗi kho một khác.** Trên kit, cỡ gần như không dự báo lượt chấm (vòng meta khó đều). Suy khoảng
   cỡ tự động từ dữ liệu từng kho sẽ cho kit một khoảng vô nghĩa (8–10 tệ hơn ≤ 7 và ngang ≥ 13). Vì
   vậy **khoảng là CHÍNH SÁCH, dữ liệu là ĐỒNG HỒ**: khoảng sống ở một khối người đọc được; đồng hồ đọc
   lại bảng từ hồ sơ đã giao mỗi lần chạy, kèm N, để mốc nào cũng thấy chính sách còn đứng trên số
   thật hay không.
3. **Crm hôm nay 33 % số vòng trong khoảng** (trên vòng đã giao có lượt chấm). Ngưỡng hàng (≥ 80 % sau
   30 ngày) cách xa nền — đồng hồ phải lọc được «vòng mới từ ngày giao», nói N, và không được đếm
   kiểu sống sót (§4.4).

**Ngưỡng của ô 04/09 nhường cho ngưỡng hàng S3.** Ô ghi SỐNG «hợp đồng có dòng Kết quả người thấy,
≥ 80 % AC là vế của nó» và CHẾT «một vòng ≥ 8 lượt chấm». Chính sách 10/10 đổi hướng nghiệm: răng đặt ở
lượt cắt (cỡ + dáng), không ở khuôn hợp đồng — nên `bat_khi` của hàng S3 là ngưỡng đọc ở phiên nghiệm
thu; dòng sổ ghi điều này, cửa veto ở Cổng Phạm vi.

## 4. Thiết kế

### 4.1 Khoảng cỡ — MỘT nguồn, người đọc được, răng đọc thẳng

Khối marker `CAT-LUOT-CO` trong `skills/cat-luot/SKILL.md`:

```
muc_tieu: 8-10
cho_phep_den: 12
tach_tu: 13
tran_luot_cham: 3
it_du_lieu_duoi: 10
```

`cat-luot.mjs` đọc khối này từ SKILL nằm cạnh nó trong gói (`<gói>/skills/cat-luot/SKILL.md`, suy từ vị
trí script) lúc chạy. Khối vắng, thiếu khoá, số không nguyên dương, `muc_tieu` ngược, `cho_phep_den <
muc_tieu` cuối, hay `tach_tu ≠ cho_phep_den + 1` (khoảng hở/chồng) → thoát 2 nêu đúng khoá hỏng. Không
số nào của khoảng nằm trong mã. Đổi chính sách = sửa một khối, cùng PR với bằng chứng đồng hồ.

Phương án bỏ: (a) hằng trong mã — chủ kho đọc không được, mỗi lần đổi phải sửa mã; (b) khoá
`cat_luot.co` trong `config.yaml` của kho — là CỘNG (khoá mới mọi kho mang), chưa có kho nào xin; (c) máy
tự suy khoảng từ dữ liệu — số kit (§3.2) cho thấy sai ở kho meta.

### 4.2 Hai trường của LƯỢT CẮT

Cùng loại với `dot`, `phu` đã có: lượt cắt ghi, răng đọc; trang lộ trình, Feature Loop và agent KHÔNG đọc.

- `vai` — chuỗi. Tên vai (dáng có vai): câu giao phải MỞ bằng đúng vai ấy, sau khi bỏ dấu mở «“" và
  khoảng trắng đầu, so không phân biệt hoa thường (chuẩn hoá NFC). Giá trị dành riêng `nen` = dáng
  việc nền: hàng phải có `bat_khi` khác rỗng (hành vi đo được nằm ở đó).
- `tieu_chi` — số nguyên dương: số tiêu chí dự kiến của vòng hàng ấy mở.

Phép thử «trường cho agent?»: agent mở vòng đọc hợp đồng của chính vòng (số tiêu chí thật nằm đó); hai
trường này chỉ sống tới lúc cắt và để răng kiểm — không là đầu vào của việc làm.

### 4.3 Cờ có tên (răng `--pham-vi … --lo-trinh …`)

Danh sách tên là MỘT hằng xuất khẩu của `cat-luot.mjs`; SKILL in bảng cờ và ca đo so tập tên hai bên.
Dòng ra: `lỗi: hàng <mã> [<cờ>]: <câu>` hoặc `cảnh báo: hàng <mã> [<cờ>]: <câu>`.

| cờ | khi | hàng trong đợt | hàng ngoài đợt |
|---|---|---|---|
| `can-tach` | `tieu_chi` ≥ `tach_tu` | lỗi | gộp một dòng cảnh báo |
| `tren-muc-tieu` | cuối mục tiêu < `tieu_chi` ≤ `cho_phep_den` | cảnh báo | — |
| `duoi-muc-tieu` | `tieu_chi` < đầu mục tiêu; kèm «gộp được với <mã> (tổng N)» khi có hàng cùng đợt, cùng `nhom`, cũng dưới mục tiêu, tổng ≤ `cho_phep_den` | cảnh báo | — |
| `tieu-chi-sai-kieu` | `tieu_chi` có mà không phải số nguyên dương | lỗi | gộp một dòng cảnh báo |
| `chua-uoc-tieu-chi` | thiếu `tieu_chi` | cảnh báo | gộp một dòng cảnh báo |
| `vai-khong-mo-cau` | `vai` là tên vai mà câu giao không mở bằng nó | lỗi | gộp một dòng cảnh báo |
| `nen-thieu-bat-khi` | `vai: nen` mà `bat_khi` rỗng | lỗi | gộp một dòng cảnh báo |
| `chua-khai-dang-giao` | thiếu `vai` | cảnh báo | gộp một dòng cảnh báo |

«Gộp một dòng» = với hàng ngoài đợt, mỗi cờ in đúng MỘT dòng `cảnh báo: [<cờ>] <k> hàng ngoài đợt
<dot> — <mã>, <mã>, …` (tối đa 8 mã rồi «…»). Lý do: lộ trình crm có 93 hàng cắt tay; 186 dòng vàng
là tiếng ồn người sẽ tắt. Hàng ngoài đợt KHÔNG đổi mã thoát — y luật đã có của răng.

**Đường đọc-cũ (luật 26/09 «cân trên mọi kho»):** lộ trình đời trước (crm hai tệp, kit) không có `vai`
/ `tieu_chi` vẫn đọc được: mã thoát và mọi dòng không phải `cảnh báo:` giống hệt răng gốc (`68951cef`);
khác biệt chỉ là các dòng vàng mới. Hàng cùng đợt mà thiếu khai cũng chỉ vàng — đợt cắt trước bản này
chạy lại không đỏ. Trang lộ trình (`lo-trinh.mjs`, `product-map.mjs`) không đổi một byte.

### 4.4 Đồng hồ cỡ (`--co [--tu <YYYY-MM-DD>] [--lo-trinh <tệp>]`)

Chỉ đọc. Hai phép đọc, HAI mẫu số khác nhau — cố ý (gap-probe F2: dùng chung mẫu số «đã giao» là
đếm kiểu sống sót — vòng to nổ trần chậm giao nhất, rơi khỏi mẫu, nên phần trăm đẹp lên mà vật không đổi):

- **Phân bố cỡ** — trên mọi hồ sơ ĐÃ CHỐT PHẠM VI (trạng thái khác `draft`) đọc được tiêu chí. Cỡ biết
  ngay lúc chốt, không cần chờ giao.
- **Lượt chấm theo cỡ** — trên hồ sơ ĐÃ GIAO có ≥ 1 dòng tiêu đề lượt chấm.

```
{ "khoang": { …khối CAT-LUOT-CO… }, "tu": "<ngày>|null",
  "nhom": [ { "ten": "duoi-muc-tieu", "tu": 1, "den": 7, "n_chot": …, "n": …, "luot_tb": …, "cham_tran_pt": …, "it_du_lieu": … },
            { "ten": "muc-tieu", … }, { "ten": "cho-phep", … }, { "ten": "phai-tach", "tu": 13, "den": null, … } ],
  "trong_khoang": { "n_chot": …, "n_trong": …, "pt_tong": …, "n": …, "cham_tran_pt": …, "it_du_lieu": … },
  "bo_qua": { "chua_chot": …, "khong_doc_tieu_chi": …, "chua_giao": …, "khong_luot_cham": …, "khong_ngay_chot": … },
  "du_kien": { "n": …, "vuot_cho_phep": …, "hang": [ { "ma": …, "slug": …, "du_kien": …, "that": … } ] } }
```

- `n_chot` = số hồ sơ đã chốt phạm vi trong nhóm cỡ; `n` = số hồ sơ đã giao có lượt chấm trong nhóm;
  `luot_tb` = trung bình lượt (2 chữ số); `cham_tran_pt` = round(100 · số hồ sơ ≥ trần / n). `n = 0` →
  không `luot_tb` / `cham_tran_pt`; `n < it_du_lieu_duoi` → `it_du_lieu: true`.
- `trong_khoang`: `n_trong` = hồ sơ đã chốt có tiêu chí trong [đầu mục tiêu, `cho_phep_den`];
  `pt_tong` = round(100 · n_trong / n_chot); `cham_tran_pt` trên hồ sơ đã giao trong khoảng (mẫu `n`);
  `it_du_lieu` theo `n_chot`. `n_chot = 0` → `"chua_do_duoc": true`, không phần trăm nào.
- `bo_qua`: `chua_chot` (draft), `khong_doc_tieu_chi` (bộ đọc chung ra 0 mã) — khỏi cả hai phép đọc;
  `chua_giao`, `khong_luot_cham` — chỉ khỏi phép đọc lượt chấm; `khong_ngay_chot` — chỉ khi có `--tu`.
- `--tu` lọc hồ sơ chốt phạm vi từ ngày ấy (ngày đầu của `approved_at`, vắng thì `veto_opened_at` — cùng
  bộ đọc với `--nhip`).
- `--lo-trinh <tệp>` (gap-probe F3: cỡ do chính phiên cắt tự khai, cần một số thật đối chiếu): với mỗi
  hàng có `tieu_chi` và `slug` trỏ một hồ sơ đã chốt, in `du_kien` cạnh `that` (số tiêu chí thật của
  hợp đồng); `vuot_cho_phep` = số hàng có `that` > `cho_phep_den`. Đây là chỗ nối lời khai lúc cắt với
  vật sinh ra.
- Phép đọc `bat_khi` của hàng S3: `--co --tu <ngày giao> --lo-trinh <tệp>` trên crm sau 30 ngày.

### 4.5 Skill và khuôn

- `skills/cat-luot/SKILL.md`: bước 2 chạy thêm `--co` (khối lệnh `CAT-LUOT-CO-LENH`) và đọc bảng; khối
  `CAT-LUOT-CO`; luật 1 và luật 4 của sáu luật viết lại cho hai dáng và khoảng cỡ (vẫn sáu dòng); mục
  «Hai dáng câu giao» kèm một ví dụ mỗi dáng; bước 4 in bảng cờ.
- `skills/acceptance/references/lo-trinh-template.json`: hàng mẫu mang `vai` (một hàng có vai, một hàng
  `nen`) và `tieu_chi`; khuôn vẫn 0 cờ khuôn và 0 cảnh báo cho đợt mẫu.

## 5. Ngoài phạm vi

- **Feature Loop S1** vẫn ghi «Core > 15 → hợp nhất, cap 5-15» — KHÔNG sửa trong vòng này: máy M5 đang
  giữ chuỗi Điều phối – Thợ và phần Feature Loop của DP7. Hệ quả: vòng mở không qua lộ trình không có
  răng cỡ. Hạt giống.
- `loop-health.mjs` đếm lượt bằng số round KHÁC NHAU (15/155 hồ sơ crm có tiêu đề round lặp vì chấm
  lại cùng round) — đồng hồ cỡ đếm thô theo số 10/10. Hai bộ đọc một vật, khác luật: giới hạn khai.
- Lint «tiêu chí đo cơ chế» (W8) và mục «Kết quả người thấy» trong khuôn hợp đồng — hạt giống 04/09
  của ô; chính sách 10/10 đặt răng ở lượt cắt thay vào. Giữ hạt giống.
- Trang lộ trình hiện `vai` / `tieu_chi`; khoá cấu hình khoảng cỡ theo kho.

## 6. Thước đo vòng (bảng dự báo 5 dòng, luật (c))

| dòng | dự báo | vì sao |
|---|---|---|
| làm-xong → quyết-được | = | vòng T2 cỡ thường |
| lượt gọi người / vòng | = (2: Phạm vi · Bằng chứng) | không thêm cổng |
| vòng bị hạ tầng đốt | = | không đổi lane |
| token máy / vòng | = | không đổi workflow |
| phút máy / lượt chấm | ↑ nhẹ | thêm ca đo vào `lo_trinh` |

Điều kiện tin cậy: đường verdict không đổi thành phần.
