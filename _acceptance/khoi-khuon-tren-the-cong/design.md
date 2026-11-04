# Khối «Khuôn» trên thẻ hai cổng — thiết kế (KH2)

Hàng KH2 của lộ trình kit, mở từ mục chờ KH-C2 ngày 03/11 khi chủ kho gõ «Mở KH-C2 ngay». Gốc là hồ sơ
`_acceptance/khuon-loi/` (KH1): đã ký, gộp `main` ngày 02/11, phát hành v2.37.0.

## 1. Vấn đề

KH1 đưa bản đồ khuôn vào kit: bộ đọc dùng chung, bước nạp ở S1, bước chấm ở S4 và một dòng số đo trên thẻ Cổng Bằng
chứng. Vòng này lấp ba chỗ hở KH1 để lại, đều là chỗ người ký đang phải tin lời máy:

1. **Thẻ Cổng Phạm vi không nói gì về khuôn.** Lúc duyệt, người không thấy màn sắp dựng thuộc nhóm nào, theo màn mẫu
   nào, và việc chính của màn có khớp việc nhóm ấy nhận (`nhan_viec`) hay không.
2. **«S1 đọc màn mẫu» chỉ là lời dặn.** Khối `KHUON-S1` bảo máy «chọn nhóm khớp màn định dựng rồi đọc đúng tệp bản đồ
   và màn mẫu», nhưng không vật nào ghi máy đã chọn nhóm nào và đã đọc tệp nào. Luật kit cấm lấy lời dặn làm nghiệm.
   KH1 cũng đã ghi điều này thành giới hạn: Ngoài-9 «chưa có bước nào» đối chiếu Thẻ việc với `nhan_viec`.
3. **Màn mới không có lối ra ở cổng.** Màn không vào nhóm nào hiện chỉ lộ ra ở bước chấm, dưới dạng «k tệp giao diện
   ngoài bản đồ». Finding 2026-11-01 §14 xếp việc này cho người, mỗi nhóm một lần ở Cổng Phạm vi, nhưng thẻ chưa có ô.

Thêm một chỗ của Cổng Bằng chứng: KH1 chỉ in số đếm. Người ký thấy «2 lệch mới» mà không biết lệch ở tệp nào, khối
nào. Ngoài-16 của KH1: khi phần dựng dòng gặp lỗi thì thẻ bỏ dòng, trông như kho không dùng khuôn.

## 2. Phạm vi

**Làm:**

- Bước nạp nhận lựa chọn của S1 và ghi nó thành vật. Ghi một trong hai:
  - `--nhom <nhóm>`: ghi `chon` (nhóm, tệp bản đồ, màn mẫu cùng băm git lúc đọc) vào `khuon-nap.json`.
  - `--nhom-moi <tên>`: ghi `chon.moi` rồi in sẵn dòng sổ dạng câu hỏi chỉ-người cho S1.
- Khối «Khuôn» trên thẻ Cổng Phạm vi: nhóm đã chọn · đối tượng · việc nhóm nhận · màn mẫu (băm còn khớp hay đã đổi) ·
  năm trường Thẻ việc của hồ sơ đặt cạnh `nhan_viec`. Có ba cờ vàng (§3.3).
- Đối tượng mới đi qua câu hỏi chỉ-người sẵn có (Hỏi-n): thêm đúng một câu trên thẻ, không thêm nhãn mới vào câu duyệt,
  không thêm lượt gọi người.
- Khối «Khuôn» trên thẻ Cổng Bằng chứng: giữ dòng số đo của KH1. Thêm danh sách lệch mới (tệp · khối · nhóm) và cờ
  «tệp chạm nhóm khác nhóm S1 đã chọn».
- Lỗi khi dựng khối hiện thành cờ vàng, không im lặng (Ngoài-16).
- Khối `KHUON-S1` của SKILL feature-loop đổi sang lệnh có `--nhom`. Bộ kiểm rút lệnh từ chính khối ấy để chạy.

**Không làm:**

- Ảnh màn mẫu nhúng trên thẻ. Bản đồ chỉ khai tệp nguồn của màn mẫu, không khai ảnh. Chụp màn đang chạy là KH3
  (mục chờ KH-C3).
- Trang ba lối chọn khối. Đó là KH-C6, mở khi một kho nhận đã chạy bước chấm khuôn trên vòng giao diện thật.
- Máy tự so khớp chữ giữa Thẻ việc và `nhan_viec` để xếp nhóm. So chữ tiếng Việt bằng mẫu rất dễ đúng giả. Vòng này đặt
  hai bên cạnh nhau cho người nhìn, còn lựa chọn nhóm là của máy ở S1, có vật ghi.
- Lệnh duyệt và ngữ pháp câu gộp: không đổi.

## 3. Thiết kế

### 3.1 Vật ghi lựa chọn — `khuon-nap.json`

Lược đồ v1 của KH1 có `{ schema: 1, ghim, tep }`. Vòng này thêm một khoá tuỳ chọn, `schema` giữ 1 (đường đọc cũ):

```json
"chon": { "nhom": "bang-du-lieu", "tep": "design/patterns/bang-du-lieu.md",
          "mau": { "tep": "src/man/bang/DanhSachMau.tsx", "bam": "<git hash-object lúc nạp>" } }
"chon": { "moi": "bao-cao-tuan", "gan": "bang-du-lieu" }
```

- `--nap --slug s` không kèm cờ chọn: như KH1 từng byte, không có `chon`.
- `--nhom` mang tên nhóm không có: thoát 2, liệt tên các nhóm có. Không ghi tệp.
- Màn mẫu không tồn tại trên đĩa: `mau.bam` là `null` và lệnh in một dòng «màn mẫu không có trên đĩa».
- `--nhom-moi <tên>` kèm `--gan <nhóm>` (tuỳ chọn, nhóm gần nhất để làm lối khác). Vắng `--gan` thì lối khác cố định là
  «để màn ngoài bản đồ — bước chấm đếm nó vào tệp giao diện ngoài bản đồ», để câu hỏi luôn có hai lối sống:
  - ghi `chon.moi`;
  - in một dòng giữa của khối `DEC-ID-RECIPE` dựng sẵn, `can_cu.nguon = chi-nguoi`, khuyến nghị «tạo nhóm <tên>», lối khác
    «xếp vào <gan>»;
  - S1 chép dòng ấy vào sổ, nó lên thẻ thành Hỏi-n như mọi câu chỉ-người.

`--nhom` và `--nhom-moi` loại trừ nhau. Hai cờ cùng có mặt thì thoát 2.

### 3.2 Bộ đọc thẻ — `theCong1` cạnh `theCong2` trong `scripts/ban-do-khuon.cjs`

`theCong1({ root, slug, contractTxt, designTxt, decisions })` trả về:

- `null` khi kho không có `design/patterns/`, để thẻ giữ nguyên từng byte;
- ngược lại trả `{ dong: [chuỗi], co: [chuỗi], loi: chuỗi|null }`.

Thẻ (`scripts/gate-card.js`) in nhãn «Khuôn (thông tin, không cần trả lời)» rồi các dòng, cùng chỗ với khối «Sàn thiết
kế». `--extract` mang khoá `khuon_g1`. Thẻ việc đọc từ design doc theo khuôn mục «Thẻ việc» của `ux-spec-template.md`:
bảng hai cột, năm hàng. Không đọc được năm hàng thì dòng nói «Thẻ việc: chưa điền».

### 3.3 Cờ Cổng Phạm vi

| Ca | Cờ |
|---|---|
| Hồ sơ có mặt người nhìn (`surfaces` chứa `ui`/`web`/`web-ui`) mà không có `khuon-nap.json`, hoặc có mà thiếu `chon` | «S1 chưa ghi đã chọn nhóm khuôn nào — chạy bước nạp kèm --nhom» |
| `chon.mau.bam` khác băm hiện tại của màn mẫu | «màn mẫu đổi sau khi S1 đọc — đọc lại trước khi duyệt» |
| `chon.moi` có mà sổ không có dòng S1 `chi-nguoi` nhắc tên nhóm mới | «nhóm mới <tên> chưa thành câu hỏi ở cổng» |

Hồ sơ không có mặt người nhìn thì không có cờ thứ nhất. Hồ sơ của kit là ca này: vật của kit là lệnh dòng lệnh.

### 3.4 Cổng Bằng chứng

`theCong2` giữ dòng số đo và cờ «chưa chấm» của KH1, rồi thêm:

- tối đa năm dòng `lệch: <tệp> · <khối> · nhóm <nhóm>` lấy từ `khuon-cham.json.lech_moi`; quá năm thì một dòng «… và k
  lệch nữa»;
- cờ vàng khi `khuon-nap.json.chon.nhom` có, mà tệp trong `theo_khuon ∪ lech_moi` thuộc nhóm khác: «vòng chọn nhóm A
  mà vật chạm nhóm B».

### 3.5 Lỗi không im lặng

Hai lời gọi trong `gate-card.js` hiện bọc `try { … } catch { null }`. Đổi thành: lỗi → khối in đúng một cờ vàng «không
dựng được khối Khuôn: <thông điệp>», thẻ vẫn dựng xong. Kho không có bản đồ vẫn là `null` qua nhánh thường, không qua
`catch`.

### 3.6 Lời dặn S1 thành lệnh

Khối `KHUON-S1` trong `feature-loop/skills/feature-loop/SKILL.md` đổi sang hai bước:

1. Chạy `--nap` như cũ để in chỉ mục.
2. Chọn xong thì chạy lại với `--nhom <nhóm>`, hoặc với `--nhom-moi <tên> --gan <nhóm>` khi không nhóm nào nhận màn.

Bộ kiểm rút đúng dòng lệnh từ khối marker, thay ô, chạy trên kho mẫu, rồi đọc thẻ. Lời dặn và vật đi qua cùng một phép đo.

## 4. Đặc tả UX

Bỏ. Vòng không dựng màn nào: vật là lệnh, hai bộ đọc và chữ trên thẻ HTML sẵn có.

## 5. Rủi ro và giới hạn

- **Vế «S1 đã đọc màn mẫu» vẫn là lời tự khai có băm.** Băm chứng tệp tồn tại và không đổi kể từ lúc nạp, không chứng
  tác tử đã hiểu tệp. Đây là trần của vòng; chứng «hiểu» thuộc L6 (tự nhìn trước khi nộp chấm), để sau.
- **Chưa có tệp lượt chấm thật từ kho nhận.** Khối Cổng Bằng chứng dựng trên khuôn `khuon-cham.json` mà KH1 định và
  bộ kiểm sinh. Ngưỡng: kho nhận đầu tiên chạy bước chấm khuôn mà khối hiện sai thì mở bản vá.
- **Đọc Thẻ việc theo bảng markdown.** Design doc viết Thẻ việc bằng văn xuôi thì dòng nói «chưa điền», không đoán.
