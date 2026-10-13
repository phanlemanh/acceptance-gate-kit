# Vòng mở thẳng bằng Feature Loop cũng bị đo cỡ — design

Hồ sơ: `_acceptance/vong-mo-thang-bang-feature-loop/` · hàng lộ trình S3c · hạng T2 · Cổng Đáng: build (manh, 12/10).
Gốc: `_acceptance/vong-la-mot-ket-qua/` — Out of scope OOS-1 + dòng sổ `d-20261011T002900Z-3`.

## 1. Vấn đề

Chính sách cỡ 10/10 của chủ kit sống ở MỘT khối: `CAT-LUOT-CO` trong `skills/cat-luot/SKILL.md`
(mục tiêu 8–10 · cho phép tới 12 · từ 13 phải tách). Răng của nó hôm nay chỉ đứng ở lượt cắt lộ trình
(`cat-luot.mjs`, hàng S3) và chỉ đọc `tieu_chi` KHAI lúc cắt — không đọc hợp đồng thật. Hai đường lọt:

1. **Vòng mở thẳng** bằng Feature Loop không đi qua lượt cắt nào (đo 12/10: crm 67/77, kit 20/21,
   OneFlow 20/20 hồ sơ từ 13 tiêu chí là vòng mở thẳng).
2. **Cỡ trôi** giữa lúc cắt và lúc viết hợp đồng (crm: 10 hồ sơ từ hàng lộ trình vẫn ≥ 13).

Và Feature Loop còn DẠY ngược chính sách ở năm chỗ: bước S1#3 («Core >15 → hợp nhất, giữ cap 5-15»),
khuôn sinh hợp đồng ở S1#4 («5-15 AC»), Phase 1 bước 3 của skill `acceptance` («Write 5-15 criteria»),
khuôn `contract-template.md` («{{5-15 criteria»), và `GUIDE.md` mục coverage («giữ cap 5-15»).

## 2. Hình dạng nghiệm

Răng đứng ở **lối vào Cổng Phạm vi** — nơi mọi hợp đồng đi qua bất kể nguồn mở — và đọc **hợp đồng
thật** bằng bộ đọc tiêu chí chung (`lib/ac-line.cjs` `parseACBlock`, đếm mã khác nhau như đồng hồ cỡ).

| Cỡ (theo khối) | Không dòng giữ | Có dòng giữ |
|---|---|---|
| ≤ cuối mục tiêu (≤ 10) | không cờ | không cờ |
| cho phép (11–12) | cờ vàng — nêu số + khoảng | cờ vàng — nêu số + mã dòng giữ |
| từ `tach_tu` (≥ 13) | **cờ đỏ đứng đầu thẻ, ô duyệt để trống, `--extract` khai `chan: true`** | cờ vàng — nêu số + mã dòng giữ + lý do |

«Không vào được Cổng Phạm vi» có ba bên đọc, cùng đọc MỘT khoá máy sinh (`co_hop_dong.chan` của
`gate-card.js --extract`):

- **Thẻ** (`scripts/gate-card.js`, Cổng 1): cờ đỏ đứng TRƯỚC danh sách tiêu chí, nêu số tiêu chí, ngưỡng
  tách và hai lối ra — tách thành nhiều vòng, hoặc ghi dòng sổ mở đầu bằng chuỗi giữ (in NGUYÊN VĂN chuỗi
  để bên ghi chép đúng); câu gộp duyệt để trống chữ quyết (`___`) như mọi thẻ Cổng 1 đang đỏ (`g1Blocked`).
- **Feature Loop S1#5**: `chan: true` → CHƯA đủ điều kiện vào Gate 1 (cả làn V lẫn mời người) — máy tách
  (dời tiêu chí sang hạt giống hay vòng kế, ghi `descope` theo luật đáng-log) hoặc ghi dòng giữ, rồi dựng
  lại thẻ. Mặc định là TÁCH; giữ chỉ khi kết quả không tách được mà giữ nghĩa — đúng luật 4 của cắt lượt.
- **Lệnh duyệt** (`commands/approve.md`, bước 1): `chan: true` → dừng, in hai lối ra bằng chữ người; người
  trả `sửa: giữ cỡ — <lý do>` thì đi bước 4 (sửa) — máy ghi dòng giữ từ lời người, dựng lại thẻ, hỏi lại.

Hai khối marker `CO-HOP-DONG-CHAN` (lệnh duyệt, SKILL Feature Loop) mang một dòng điều kiện có cấu trúc
`khi: co_hop_dong.chan = true → lan_v: khong · moi_nguoi: khong · loi_ra: tach, giu` (lệnh duyệt:
`ghi_duyet: khong · loi_ra: tach, giu`) để ca đo so TỪNG cặp khoá–giá trị, không đo chuỗi có mặt.

Chỉ hợp đồng `status: draft` bị đọc cỡ để chặn. Hợp đồng đã qua Cổng Phạm vi (approved trở đi, kể cả làn
V) không bị chặn hay cờ lại — đường đọc-cũ; thẻ Cổng 1 ép (`--gate 1`) của chúng không mang cờ cỡ, trong khi
bản chép cùng hồ sơ với `status: draft` mang đúng cờ theo cỡ (trạng thái là thứ duy nhất lật cờ).

## 3. Một nguồn

Mô-đun mới `scripts/co-hop-dong.cjs` (CJS — cả `gate-card.js` lẫn `cat-luot.mjs` nạp được, không cần
`require(esm)`):

- `docKhoang(txt)` / `napKhoang(tep)` / `TEP_SKILL` — DỜI NGUYÊN VĂN từ `cat-luot.mjs`; `cat-luot.mjs`
  nhập lại và xuất lại cùng tên, nên mọi bên gọi cũ (và ma trận AC-1 của `vong-la-mot-ket-qua`) không đổi.
- `demTieuChi(contract)` — số mã khác nhau từ `parseACBlock` (đúng phép đếm của đồng hồ cỡ hôm nay).
- `nhomCo(n, khoang)` — `duoi-muc-tieu` · `muc-tieu` · `cho-phep` · `phai-tach`, cùng bảng nhóm đồng hồ dùng.
- `GIU_CO_MO_DAU` = `giữ cỡ — ` (chuỗi bên ghi chép) và `dongGiu(decisionsText)` — dòng sổ ĐẦU TIÊN có
  `decision` mở đầu bằng «giữ cỡ», một dấu gạch (dài «—», ngắn «–» hay thường «-»), rồi ≥ 1 chữ lý do (so
  sau chuẩn NFC, bỏ khoảng trắng đầu); dòng JSON hỏng bỏ qua. Bên đọc khoan dung về dấu gạch vì người gõ
  `sửa: giữ cỡ - …` ở lệnh duyệt trên bàn phím không có «—»; bên ghi vẫn ghi đúng chuỗi. Không phân biệt
  `type` — dòng giữ là một lựa chọn, sổ hôm nay ghi nó ở `approach`.
- Hợp đồng mà bộ đọc không ra tiêu chí nào: cờ vàng «không đọc được tiêu chí — chưa kiểm cỡ» +
  `co_hop_dong.loi` (fail-visible; đồng hồ đã xếp hồ sơ ấy vào `bo_qua.khong_doc_tieu_chi`). Mã trùng:
  đếm mã khác nhau ở cả hai bên.
- `coHopDong({ contract, decisions, khoang, status })` → `{ n, nhom, khoang, giu, chan, vang }`.

Thẻ, đồng hồ cỡ và ca đo cùng gọi các hàm này — không bản sao nào của khoảng hay của chuỗi giữ trong mã.
Khối `CAT-LUOT-CO` hỏng/vắng → thẻ không sập: cờ vàng «không đọc được khoảng cỡ — chưa kiểm cỡ hợp
đồng», `co_hop_dong.loi` mang thông điệp của `docKhoang`, `chan: false` (fail-visible, không fail-quiet:
một lỗi của gói kit không được khoá Cổng Phạm vi của mọi kho; đồng hồ cỡ vẫn đếm ca lọt).

Bên ghi dòng giữ (phiên Feature Loop) chép công thức ở khối marker mới `DEC-GIU-CO` của SKILL Feature Loop
— dòng giữa cho khối `DEC-ID-RECIPE`. Ca đo round-trip rút khối ấy, chạy nguyên văn `DEC-ID-RECIPE` trong
kho thử, rồi để thẻ thật đọc: lệch chuỗi một ký tự là thẻ đỏ (mẫu P55).

## 4. Đồng hồ (đường đo của ngưỡng Cổng Đáng)

`cat-luot.mjs --co` thêm `n_giu` vào mỗi nhóm: số hồ sơ đã chốt của nhóm có dòng giữ (đọc bằng
`dongGiu`). `--tu` lọc theo ngày chốt phạm vi (`approved_at`, làn V thì `veto_opened_at`) — đúng
trường đồng hồ đọc hôm nay — nên hồ sơ chốt dưới engine cũ không bị đếm dù ký sau ngày cài. Ngưỡng sống đọc thẳng: nhóm `phai-tach`, `n_chot − n_giu` = số hợp đồng từ 13 tiêu chí qua
Cổng Phạm vi mà không có dòng giữ — kèm `n_chot` làm N. Giả định G3 («giữ» thành phản xạ) đọc bằng tỉ lệ
`n_giu / n_chot` của cùng nhóm ở phiên nghiệm thu. «Tách» không cần dòng sổ riêng: hợp đồng đã tách thì
dưới 13 tiêu chí và không rơi vào nhóm `phai-tach`.

## 5. Năm chỗ dạy

Cả năm chỗ thay «5–15» (và «Core >15 → hợp nhất» ở S1#3 và GUIDE) bằng cùng một câu chỉ về khối, mang
ba số của khối:
«mục tiêu 8–10 · cho phép tới 12 · từ 13» (khối `CAT-LUOT-CO`), kèm lối giữ (`giữ cỡ — <lý do>`) ở hai chỗ
có bên ghi sổ (Feature Loop S1, skill `acceptance`). Số chép trong văn xuôi là bản chiếu, không phải
nguồn: ca đo dựng câu kỳ vọng từ `docKhoang` của khối sống và đòi từng chỗ chứa nó — sửa khối mà quên văn
xuôi là đỏ, gọi tên tệp. Chiều phủ định quét theo LỚP trên cả cây dạy (`skills/`, `feature-loop/`,
`commands/`, `dieu-phoi/`, `GUIDE.md`, `README.md`, `QUICKSTART.md`): mọi ngưỡng cỡ cũ («5-15», «>15» cùng
dòng với AC/criteria/tiêu chí/Core) phải bằng 0 — không danh sách tệp đóng.

## 6. Cân trên mọi kho

Đổi mặc định — mọi kho trả giá một dòng sổ hay một lần tách cho vòng ≥ 13. Đường đọc-cũ: chỉ hợp đồng
`draft` bị đọc; kho nhận engine theo bản phát hành (mốc nhắm 01/11, sau đợt thử crm 26–27/10 và OneFlow
~27/10). Neo vào khuôn kit định nghĩa (khối `CAT-LUOT-CO`, khuôn `AC-<số>` của bộ đọc chung), không vào từ
vựng kho nào. Kho có hồ sơ `draft` ≥ 13 lúc nâng kit: thẻ đỏ ở lần dựng kế, máy của vòng tự tách hoặc giữ.

## 7. Giới hạn đã khai (kèm ngưỡng đang đếm)

- **Răng không ở hook ghi lẫn lưới trước-merge** (`hooks/**`, `scripts/pre-merge-check.sh` là T3): một
  phiên làm lơ thẻ vẫn ghi được `approved_by`. Ngưỡng mở răng T3: ≥ 1 hợp đồng từ 13 tiêu chí qua Cổng
  Phạm vi không dòng giữ — chính ngưỡng chết của ô, đọc bằng đồng hồ ở mục 4.
- **Dòng giữ là lời máy tự quyết khi đi làn V** — người thấy nó ở thẻ Cổng Bằng chứng (khối sổ quyết
  định) và ở đồng hồ, không ở Cổng Phạm vi. Ngưỡng: `n_giu / n_chot` nhóm `phai-tach` > 1/2 ở phiên nghiệm
  thu → mở lại câu «≥ 13 giữ có cần người ở Cổng Phạm vi».
- **Ca đo của khối điều kiện đo CHỈ DẪN, không đo hành vi phiên** — một phiên S1#5 thật làm khác khối vẫn
  đi được làn V. Ngưỡng: như gạch đầu (đồng hồ đếm ≥ 1 ca lọt).
- **Luật lượt cắt và luật Feature Loop khác nhau một bậc**: cắt lượt từ 13 BẮT BUỘC tách (cỡ dự kiến, chưa
  có hợp đồng); Feature Loop cho thêm lối giữ có tên (hợp đồng thật, câu giao S3c). Không sửa SKILL cắt lượt.

## 8. Không làm

- Không sửa khối `CAT-LUOT-CO` (chính sách, đổi ở PR riêng kèm số đo).
- Không chặn ở hook/lưới trước-merge (mục 7).
- Không gợi ý gộp hợp đồng dưới mục tiêu (1–7) ở Cổng Phạm vi — cắt lượt đã lo, câu giao không đòi.
- Không máy tự tách hợp đồng bằng mã — tách là phán đoán của phiên S1.
- Không đổi `loop-health.mjs` hay năm dòng số của mốc.

## 9. Kiểm

Một tệp ca `tests/scripts/co-hop-dong.test.mjs`, tên ca = mã AC, biến `CHD_CASES` chọn ca. Kho thử là kho
git thật dựng trong lần chạy; thẻ thật (`gate-card.js`) và đồng hồ thật (`cat-luot.mjs`) được gọi như
tiến trình con. Ma trận + kỳ vọng viết trước trong tệp ca; số khẳng định = số hàng. Chiều đỏ trên bản sao
trọn `scripts/ lib/ skills/` (git archive HEAD), kim khớp đúng một lần, thông điệp ghim; bản nguyên vẹn là
đối chứng dương.
