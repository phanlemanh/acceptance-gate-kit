# Luật sản phẩm của kho — nạp lúc viết đặc tả, gọi tên trên thẻ khi phạm — thiết kế

**Hồ sơ:** `_acceptance/bat-bien-san-pham/` · **Hàng lộ trình:** BB1 · **Hạng:** T2 (theo hàng; đường tệp
không chạm `t3_paths`) · **Ngày:** 11/10/2026 · **Đứng trên:** vòng A2 `buoc-len-thiet-ke-khong-hoi`
(khoá `can_cu`, bộ xếp lớp `scripts/can-cu-s1.cjs`, hai khối thẻ Cổng Phạm vi) — làm vật chỉ sau khi A2
lên `main`.

## 1. Vì sao

Ô cơ hội đã ký `build` 11/10. Số đo ở `_acceptance/bat-bien-san-pham/do-11-10/mui-gio-crm.md` (crm
`27d47de04`): múi giờ Việt Nam ghi cứng ở 12 tệp mã sản phẩm, 8 hàm «ngày giờ VN» viết lại, 0 dòng múi giờ
trong khuôn dữ liệu; 5/5 quyết định người về múi giờ là «ghi Known limits» ở Cổng Bằng chứng, 0 ở bước
thiết kế. Hồ sơ neo `okr-soat-anh-luot-3`: hai mục «lại ghi cứng múi giờ» trình như chuyện mã lặp — kho
chưa khai luật nào nên thẻ không có tên luật để gọi.

Chỗ hở của kit: bước thiết kế (S1) không đọc gì ở tầng sản phẩm; thẻ không có chỗ gọi tên một luật sản
phẩm. Bảy kho tiêu thụ tự giữ luật ngoài vật (ô cơ hội, mục «Vì sao là việc của kit»).

## 2. Ý định (cố định trong vòng)

Mỗi kho khai các luật sản phẩm của mình trong MỘT tệp ở gốc kho; luật được nạp lúc viết đặc tả; vòng nào
phạm luật thì thẻ cổng nêu tên luật đó — ở Cổng Phạm vi khi phạm ngay từ thiết kế, ở Cổng Bằng chứng khi
diff mang dấu hiệu luật đã khai. Kho không khai tệp thì không đổi byte nào. Máy không bao giờ sửa tệp luật.
Không thêm cổng, không thêm lượt gọi người: mọi câu luật đi vào thẻ đã có.

Chính sách chốt ở Cổng Đáng (ô cơ hội, mục Cổng 0): mọi lần phạm một luật đã khai là câu hỏi trên thẻ đã
có; luật khai «khó đảo» mang nhãn khó-đảo bất kể nguồn căn cứ; máy chỉ đề nghị sửa tệp luật trong hồ sơ
vòng.

## 3. Thiết kế

### 3.1 Tệp luật `PRODUCT-INVARIANTS.md` ở gốc kho

Đường CỐ ĐỊNH (không khoá config — bớt một ổ cắm; nhiều tệp / đường khác là Later). Khuôn sống MỘT chỗ:
khối marker `PRODUCT-INVARIANTS-TEMPLATE` trong `skills/acceptance/references/product-invariants-template.md`.
Hình dạng một luật:

```
## SP-<số> · <câu luật, một dòng>

- Mức: thường | khó đảo
- Chủ luật: <tên người>
- Giữ bằng: <tên test hoặc lint> | giữ bằng mắt
- Dấu hiệu: `<biểu thức chính quy JS>`        (tuỳ chọn)
- Phạm vi: `<glob>`, `<glob>`                  (tuỳ chọn; vắng = mọi tệp ngoài `_acceptance/`)
- Vì sao: <một câu>
```

- Mã cố định tiền tố `SP-` (sản phẩm) — không để kho tự đặt tiền tố: một mục ngoài hợp đồng nhắc «AC-3»
  hay một hàng lộ trình «BB1» không bị đọc nhầm thành luật.
- Bắt buộc: tiêu đề + `Mức` + `Chủ luật`. Thiếu, mức lạ, mã trùng, `Dấu hiệu` không biên dịch được →
  khối đó «sai khuôn»: bộ đọc bỏ khối, các luật còn lại vẫn đọc, thẻ nêu một cờ vàng gọi tên khối.
- Phần ngoài các khối `## SP-` (lời dẫn, mục «Sản phẩm là gì») là văn tự do của kho — bộ đọc bỏ qua.
- Khuôn KHÔNG chở luật mẫu của tổ chức nào: ví dụ trong khuôn là hình dạng (`<câu luật>`), không phải
  nội dung.

Bộ đọc: `scripts/luat-san-pham.cjs` (mới, `scripts/` cạnh `can-cu-s1.cjs`; không `lib/`). Một hàm `docLuat(text)`
→ `{ luat: [{ ma, cau, muc, chu, giu, dau_hieu, pham_vi, vi_sao }], sai_khuon: [{ ma|dong, ly_do }] }`, và
`banLuat(text)` = mã băm blob kiểu git (`sha1("blob <độ dài>\0" + nội dung)`) — tính được không cần git,
khớp `git hash-object`.

### 3.2 Bước thiết kế nạp luật (S1, đứng trên luật A2)

S1 thêm một bước ngay sau đường nền: kho có `PRODUCT-INVARIANTS.md` → đọc tệp (trọn, làm input tường minh
— tệp ở gốc không tự nạp như `CLAUDE.md`), ghi MỘT dòng sổ nạp theo khuôn marker `DEC-LUAT-NAP` (mục «Sổ
quyết định» của SKILL):

```
"type":"approach","stage":"S1","at":"<ISO>","decision":"Nạp <N> luật sản phẩm từ PRODUCT-INVARIANTS.md","why":"Kho đã khai tệp luật sản phẩm — bước thiết kế đọc nó trước khi chọn.","cost_if_wrong":"Không nạp thì lựa chọn phạm luật đi qua Cổng Phạm vi không ai gọi tên.","can_cu":{"nguon":"mot-loi","kho_dao":false,"loi_chet":"Kho đã khai tệp luật — bỏ qua tệp là phạm luật nạp của kit."},"luat_nap":{"ban":"<băm blob>","so":<N>}
```

Dòng nạp là một lựa chọn có nguồn căn cứ theo khuôn A2 (nguồn một-lối). Kho không có tệp → không dòng nào.

Mỗi lựa chọn thiết kế về sau:

| Quan hệ với luật | Dòng sổ S1 | Bộ xếp lớp (A2 + phần mới) |
|---|---|---|
| theo luật | `can_cu` nguồn `muc-tieu`, `tep: "PRODUCT-INVARIANTS.md"`, `trich` = câu luật | A2 kiểm câu trích có ở tệp và ở gốc nhánh; thẻ in mã `SP-n` cạnh căn cứ khi câu trích nằm trong một khối luật |
| phạm luật | `can_cu` nguồn `chi-nguoi` + `"pham_luat":"SP-<n>"` + `kho_dao` theo mức luật | câu hỏi trên thẻ nêu mã · câu luật · chủ luật |
| không chạm | như A2 | như A2 |

Ba luật đỏ mới trong `can-cu-s1.cjs` (thông điệp ghim, hằng trong mô-đun, cùng bảng `LY_DO` của A2):

| Mã | Thông điệp | Khi |
|---|---|---|
| `pham-luat-may-quyet` | phạm luật sản phẩm là câu hỏi cho người | dòng mang `pham_luat` mà nguồn khác `chi-nguoi` |
| `luat-vang` | mã luật không có trong tệp luật sản phẩm | `pham_luat` không khớp mã nào đọc được |
| `luat-kho-dao` | luật khó đảo phải mang nhãn khó-đảo | luật mức khó đảo mà dòng ghi `kho_dao` khác `true` |

`luat-vang` cũng áp khi kho không có tệp mà dòng mang `pham_luat` (mã không thể có).

### 3.3 Thẻ Cổng Phạm vi

- Khối «Câu chỉ anh trả lời được» (A2): câu mang `pham_luat` mở đầu «Phạm luật SP-n — <câu luật> (chủ
  luật: <tên>)», nhãn khó-đảo khi luật khó đảo. Ô trả lời vẫn là `Hỏi-<n>` của A2 — không nhãn mới ở Cổng
  Phạm vi.
- Khối «Máy đã quyết ở bước thiết kế» (A2): dòng có câu trích nằm trong một khối luật in «theo luật SP-n».
- Cờ vàng mới (kho CÓ tệp, hồ sơ `draft`):
  - «Kho đã khai luật sản phẩm mà sổ bước thiết kế chưa có dòng nạp — lựa chọn của vòng chưa được soi
    theo luật.»
  - «Luật sản phẩm đã đổi sau khi bước thiết kế nạp (nạp bản <7 ký tự>, nay <7 ký tự>) — soi lại lựa chọn
    theo bản mới.»
  - «Tệp luật sản phẩm có khối sai khuôn: <mã hoặc dòng> — <lý do>; luật đó chưa được nạp.»
- Hồ sơ đã qua Cổng Phạm vi (khác `draft`): không cờ nào của vòng này.
- Bản rút (`--extract`) thêm khoá `luat` = `{ co_tep, so_luat, sai_khuon, nap: {ban, khop} | null }`.

### 3.4 Soi luật trên diff → thẻ Cổng Bằng chứng

`node scripts/luat-san-pham.cjs --root . --slug <slug> --quet --base <diffBase> --den <verified_commit> --write`
ghi `_acceptance/<slug>/luat-cham.json`:

```
{"ban":"<băm blob tệp luật ở <den>>","base":"<sha>","den":"<sha>",
 "sua_tep_luat":{"may":["<sha>"],"nguoi":["<sha>"]},
 "cham":[{"ma":"SP-1","tep":"apps/x.ts","dong":12,"chu":"<dòng thêm, cắt 160 ký tự>"}]}
```

- Chỉ soi DÒNG THÊM của `git diff <base>...<den>`; bỏ `_acceptance/**` và chính tệp luật; luật có
  `Phạm vi` thì chỉ soi tệp khớp glob (bộ khớp glob dùng chung có sẵn, không tự chế). Luật không có
  `Dấu hiệu` không bao giờ chạm ở đây (nó chỉ sống ở bước thiết kế).
- `sua_tep_luat` = các commit trong `<base>..<den>` chạm `PRODUCT-INVARIANTS.md`, tách theo dấu duy nhất có
  sẵn trong lịch sử: thông điệp commit có dòng `Co-Authored-By: Claude` → `may`, không có → `nguoi`. Tác
  giả git của hai loại là cùng một người, nên không có dấu nào khác (giới hạn: commit máy thiếu dòng đồng
  tác giả lọt thành `nguoi` — §4).
- Kho không có tệp ở `<den>` và không có ở `<base>` → lệnh không ghi gì, thoát 0 («kho không khai luật»).
- Gọi từ SKILL S4 bước «Mọi verdict», ngay sau `thuoc-vat.mjs --write` — cùng chỗ, cùng nếp (lỗi → WARN
  một dòng, không chặn vòng).

Thẻ Cổng Bằng chứng (chỉ khi kho có tệp luật):

- Khối mới «Luật sản phẩm bị chạm» đứng cạnh khối «Ngoài hợp đồng»: mỗi mã chạm một mục — câu luật, chủ
  luật, mức, tối đa ba chỗ `tệp:dòng` + đếm phần còn lại. Mỗi mã một ô trả lời `SP-<n>` với hai lối:
  **chấp nhận có tên** (ghi Known limits + một dòng sổ) · **sửa vật** (trả về S3). Ô điền sẵn khuyến nghị
  «sửa vật» (câu hỏi chỉ-người Hỏi trên thẻ Cổng Phạm vi của chính vòng này — người chọn lối khác thì ô để
  trống); ô vẫn nằm trong `routing.hoi` nên không bao giờ đi làn V.
- `sua_tep_luat.may` không rỗng → cờ đỏ «Vòng này sửa tệp luật sản phẩm — máy không sửa luật; tách thành
  commit riêng của chủ kho» và ô `Tệp luật: ___`. Chỉ `nguoi` → một dòng báo «Chủ kho sửa tệp luật trong
  nhánh vòng (<n> commit)», không cờ, không ô.
- Mục «Ngoài hợp đồng» (khối do bộ chấm ghi, thẻ chỉ đọc) có chữ nhắc một mã `SP-<n>` có trong tệp → thẻ
  gắn nhãn «luật SP-n · <mức>» cạnh mục đó. Bộ tìm lỗi chỉ đọc `CLAUDE.md` / `CONTRIBUTING.md` của kho
  (`feature-loop/workflows/acceptance-verify.js` dòng 1097; hợp đồng chỉ đến bộ phân loại phạm vi, dòng
  1529), nên tài liệu dặn kho thêm một dòng trỏ `PRODUCT-INVARIANTS.md` vào `CLAUDE.md`. Dòng trỏ là cấu
  hình của kho; răng của kit là nhãn.
- `luat-cham.json` vắng, hoặc `den` ≠ `verified_commit` của báo cáo → cờ vàng «Chưa soi luật sản phẩm
  trên bản đã chấm» — và (fail-closed) không đi làn V.
- Có mục chạm hoặc sửa tệp luật → không đi làn V; `scripts/khong-can-nguoi.mjs` đọc cùng tệp
  và thoát 2 «còn cần người: luật sản phẩm».
- Hai nhãn ô mới vào danh sách `GATE-ONESHOT-SLOTS` (`g2 SP-<số>`, `g2 Tệp luật`) và lời dặn
  `commands/signoff.md`.

### 3.5 Đường đọc cũ

- Kho không có tệp: không dòng nạp, không khoá `luat` khác `co_tep:false` ở bản rút, thẻ không đổi byte,
  `khong-can-nguoi` không đổi kết luận. Đo vi phân: dựng thẻ (Cổng 1 và 2) cho MỌI hồ sơ của kit và của
  crm trên máy bằng bản ở gốc và bản của vòng → bằng nhau từng byte trừ khoá `luat` của bản rút.
- Hồ sơ đời trước trong kho có tệp: chỉ hồ sơ `draft` nhận cờ vàng nạp; hồ sơ đã ký không cờ.

## 4. Giới hạn đã khai

- Bộ soi diff khớp CHỮ (biểu thức chính quy kho tự khai), không hiểu nghĩa: luật không viết được thành
  dấu hiệu chỉ sống ở bước thiết kế, và một vi phạm viết khác dấu hiệu lọt qua. Ngưỡng mở ô: ≥ 1 vòng crm
  có mục ngoài hợp đồng cùng lớp một luật đã khai mà khối «Luật sản phẩm bị chạm» không có mục nào
  (chính là vế CHẾT của ngưỡng UAT).
- Bộ tìm lỗi ở lượt chấm thấy luật CHỈ khi kho trỏ tệp luật trong `CLAUDE.md`; đưa luật thẳng vào lời
  nhắc bộ tìm lỗi là sửa bộ chấm (vùng máy kia) — Later. Lối «hợp đồng chở mục luật đã nạp» (giả định 4
  của ô) đã soi và CHẾT: hợp đồng chỉ đến bộ phân loại phạm vi, không đến bộ tìm lỗi.
- Cột «sửa tệp luật» tách máy/người bằng dòng `Co-Authored-By: Claude`; commit máy thiếu dòng đó lọt
  thành «người». Ngưỡng mở ô: ≥ 1 commit chạm tệp luật mà chủ kho nói không phải của mình.
- Phép vi phân trên crm (AC-2) chỉ chạy ở làn máy khi `LS_CRM_ROOT` có; vắng thì bỏ qua có tên. Chân crm
  chạy một lần trước Cổng Bằng chứng, bản chụp `evidence/vi-phan-crm.txt` trong hồ sơ. Ca chỉ chạy khi
  hồ sơ chưa ký (vòng sau đổi thẻ hợp lệ thì so với gốc cũ sẽ đỏ oan).
- «Theo luật» vs «phạm luật» ở bước thiết kế là nhãn máy tự gán; lưới là phản biện context sạch (A2
  §3.6) — vòng này thêm một câu soi: «có lựa chọn nào trái một luật đã nạp mà sổ không ghi `pham_luat`?».

## 5. Phương án đã loại

- Khoá config trỏ đường tệp — một ổ cắm thêm không ai cần hôm nay (Later khi có kho thứ hai đòi).
- Cờ «chưa khai luật» cho kho không có tệp — kho không có sự cố này trả giá (luật 26/09).
- Thẻ tự gọi `git diff` ở Cổng Bằng chứng — mở thêm một lối thẻ chạm git; tệp `luat-cham.json` do script
  ghi thì thẻ chỉ đọc, và tệp là bàn giao của vật (ghi kèm sha).
- Đưa vi phạm vào khối «Ngoài hợp đồng» — khối đó do bộ chấm ghi; trộn vào là sửa bộ chấm.
- Bộ đọc nghĩa luật bằng model ở cổng — thẻ là lớp trình bày, tất định.

## 6. Đường đo (cho ngưỡng UAT)

Một lệnh: `node scripts/luat-san-pham.cjs --root <crm> --dem [--tu <YYYY-MM-DD>] [--json]` (AC-11). Mỗi hồ sơ
có sổ một hàng; `--tu` giữ hồ sơ có dòng sổ đầu tiên mang `at` ≥ ngày đó (mẫu số «vòng mới sau ngày khai»
— ngày khai = ngày commit đầu của `PRODUCT-INVARIANTS.md`, lệnh in nó). Cột:

| Cột | Từ đâu |
|---|---|
| dòng nạp | có dòng S1 mang `luat_nap` (0/1) |
| phạm ở thiết kế | số dòng S1 mang `pham_luat` không bị thay |
| chạm trên diff | số mục `cham` trong `luat-cham.json` |
| nhãn ngoài hợp đồng | số mục «Ngoài hợp đồng» nhắc một mã có trong tệp |
| máy sửa tệp luật | số sha trong `sua_tep_luat.may` |
| chủ kho sửa tệp luật | số sha trong `sua_tep_luat.nguoi` |
