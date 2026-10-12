# Thiết kế — dải tóm tắt đếm đúng giới hạn, trang hồ sơ hiện trọn «Vì sao làm»

Hồ sơ: `_acceptance/dai-tom-tat-dem-dung-vi-sao-tron/` · Cổng Đáng ký «Làm» 12/10 (Manh Phan) · hạng T2.
Gốc: hồ sơ `dai-tom-tat-doc-dung`, Ngoài-8 và Ngoài-9, chủ kho chọn «mở hợp đồng mới» (sổ `d-20261012T033640Z-15`).
Dựng trên nhánh `vong/dai-tom-tat-doc-dung` (cùng tệp), gộp ngay sau nó, cùng mốc phát hành.

## 1. Vấn đề, đo trên dữ liệu thật

Số đo đầy đủ: `_acceptance/dai-tom-tat-dem-dung-vi-sao-tron/do-truoc.md` (sáu kho, 661 hồ sơ có hợp đồng, mã
commit từng bản chụp ghi trong tệp).

**Ngoài-8.** Ô «chưa làm gì» in sai số giới hạn đã biết ở 86 hồ sơ, theo bốn cơ chế:

1. Khối giới hạn ở `## Notes` mở bằng một đoạn văn bọc nhiều dòng, hoặc có đoạn dẫn trước danh sách → bộ đọc
   dạng đầu đoạn dừng ở dòng chữ đầu tiên không phải gạch, đếm đầu đoạn là 1 và bỏ cả danh sách. Cùng lỗi: một
   dòng BỌC giữa đoạn mà tình cờ mở bằng «Known limits…» bị coi là đầu đoạn.
2. Gạch trong khối tự mở bằng «known-limit(s)» → đọc một lần làm mục của khối, một lần nữa làm gạch giới hạn trơn.
3. Mục `## Known limits` của báo cáo: bộ đọc dòng nội dung chỉ nhận gạch «-», nên danh sách ĐÁNH SỐ bị nối
   thành đoạn; gạch con lồng bị đếm như giới hạn riêng; khối `### Re-pin` mà làn ghim lại của kit nối vào cuối
   báo cáo bị tính khi Known limits là mục cuối (báo cáo đời cũ).
4. Khối có tiêu đề con, nhiều nhóm, nhiều danh sách → con số là ngẫu nhiên của cách nối dòng (63 so 11; 26 so 3).

«None.» / «Không có»: 0 hồ sơ thật ghi khối giới hạn chỉ bằng chữ ấy — ca bảo hiểm. Một giới hạn THẬT mở bằng
«không có» tồn tại (crm `vao-bang-email-va-mat-khau`) — bộ lọc phải giữ chặt.

**Ngoài-9.** Vòng `dai-tom-tat-doc-dung` đặt trần 400 ký tự cho ô «vì sao» (đúng cho dải và khối dữ liệu lộ trình),
nhưng mục gập «Vì sao làm» của trang hồ sơ đầy đủ in CÙNG giá trị đó. 301 hồ sơ trên sáu kho có «Vì sao» dài hơn
400 ký tự — trang đầy đủ của chúng mất chữ khi mốc mang vòng ấy tới kho.

## 2. Thiết kế

### 2.1 Một bộ đọc khối giới hạn, hai nguồn

Một hàm đọc THÂN khối giới hạn dùng chung cho đầu đoạn ở `## Notes` và cho mục `## Known limits` của báo cáo.
Dạng gạch đầu dòng ở Notes (khuôn `KNOWN-LIMITS-NOTE` của lối «ghi Known limits») giữ nguyên bộ đọc hiện có.

- **Mục danh sách:** dòng `-`, `*`, `1.`, `1)` + khoảng trắng. Hai loại: gạch, số.
- **Danh sách:** các mục CÙNG loại, CÙNG lề. Dòng trắng giữa hai mục được phép. Dòng thụt sâu hơn lề (kể cả gạch
  con lồng) thuộc mục đang mở; dòng không thụt ngay sau mục (không dòng trắng xen) cũng thuộc mục ấy (bọc lười).
  Dòng khác sau dòng trắng, mục khác loại, hay tiêu đề — đóng danh sách.
- **Đoạn:** các dòng liền nhau không trắng, không phải mục, không phải tiêu đề.

Đầu khối ở Notes, ngoài dạng gạch:

- **Tiêu đề** `#…` mở bằng cụm giới hạn → khối CÓ BIÊN, tới tiêu đề cùng hoặc cao cấp hơn.
- **Đầu đoạn** — dòng mở ĐẦU một đoạn (đầu `## Notes`, hoặc dòng trước trắng hay là tiêu đề) mở bằng cụm giới hạn → đọc
  trọn đoạn (mọi dòng bọc); khối KHÔNG BIÊN.
- Đầu đoạn MANG CÂU (sau dấu «:» đầu tiên còn chữ) giữ luật cũ: danh sách ngay sau → các mục; không → chính đầu
  đoạn là 1 (trừ «none»).

Thân khối với đầu TRƠN (tiêu đề; đầu đoạn không mang câu):

| Khối | Đọc được | Ra |
|---|---|---|
| Có biên (tiêu đề ở Notes; mục báo cáo) | đúng MỘT danh sách, đoạn trước/sau tuỳ ý | các mục của danh sách |
| | không danh sách, đúng một đoạn | 1 (đoạn «None.» → 0) |
| | trống | 0 |
| | tiêu đề con · ≥2 danh sách · ≥2 đoạn không danh sách | **không đọc được** |
| Không biên (đầu đoạn) | danh sách ngay sau, hoặc MỘT đoạn dẫn rồi danh sách | các mục |
| | đoạn «None.» | 0 |
| | một đoạn rồi hết Notes / tới tiêu đề; hoặc không gì | 1 / 0 |
| | hai đoạn trước danh sách | **không đọc được** |

Mục báo cáo kết ở tiêu đề `### Re-pin…` — khuôn `REPIN-TEMPLATE` mà làn ghim lại nối vào cuối báo cáo (neo vào
khuôn kit định nghĩa, không vào từ vựng của một kho — luật 26/09).

Dòng đã thuộc một khối không được đọc lại thành gạch giới hạn trơn (đóng cơ chế 2).

**«None»:** mục hay đoạn mà chữ (bỏ `*`, `_`) chỉ là none / không có / không, có hoặc không dấu chấm, không phân
hoa thường → không đếm. «Không có kênh báo …» là một giới hạn.

### 2.2 Ô và trang khi không đọc được

Luật chủ kho (lời giao 12/10): không đọc được → «chưa đọc được», không in số. Một nguồn không đọc được là đủ — số
của nguồn kia chỉ là cận dưới, in ra là đoán.

- Ô `chua_lam`: `<N> mục để ngoài phạm vi · giới hạn đã biết: chưa đọc được — khối giới hạn ở <hợp đồng | báo cáo |
  hợp đồng và báo cáo> không theo khuôn`.
- Trang hồ sơ, mục «Giới hạn và ngoài hợp đồng»: các mục để ngoài phạm vi như cũ, thay danh sách giới hạn bằng
  đúng câu ấy (vàng) — không liệt danh sách sai.
- Cờ «Notes còn chỗ nhắc giới hạn sai khuôn» (vòng trước) giữ nguyên; dòng đoạn dẫn nay thuộc khối nên thôi bị đếm
  là chỗ nhắc sai khuôn.

### 2.3 «Vì sao làm» trọn vẹn trên trang đầy đủ (Ngoài-9)

`tomTatHoSo` chọn khối lý do MỘT lần (cùng luật chọn của vòng trước) rồi trả HAI bản: `moi_nguoi.vi_sao` có trần
400 (dải, khối dữ liệu lộ trình — không đổi một ký tự) và `chiTiet.viSao` đầy đủ `{ doan, muc }`: đoạn nguyên văn
(bỏ dấu nhấn như dải) và — khi đoạn là câu dẫn «…:» theo sau là danh sách hay bảng — mọi mục NGUYÊN VĂN (bảng:
các ô của hàng nối « · »); đoạn KHÔNG phải câu dẫn mà có gạch DÍNH LIỀN ngay dưới (không dòng trắng xen) thì kèm
các gạch ấy — trang trước vòng `dai-tom-tat-doc-dung` in chúng như một phần đoạn (phép đo DD-9 tìm ra ở crm, 12/10). Trang hồ sơ in đoạn + danh sách ở mục gập. `chiTiet` không vào khối dữ liệu lộ trình,
nên khuôn khối không đổi.

Câu dẫn ở trang đầy đủ được kèm danh sách — trước vòng `dai-tom-tat-doc-dung` trang in câu dẫn cụt «…:»; in lại
đúng bản cụt là trả lại một lỗi vòng ấy đã sửa ở dải.

## 3. Phương án đã bỏ

- **Chỉ sửa đầu đoạn ở Notes** (đúng chữ của hạt giống): bỏ — cơ chế 2 và 3 (báo cáo đánh số; 15+ hồ sơ) vẫn sai,
  và hai bộ đọc cho cùng một khái niệm «khối giới hạn» sẽ trôi khỏi nhau.
- **Khối nhiều danh sách → cộng mọi mục:** đúng ở các khối chia nhóm (radar `may-chu-va-lop-ngu-nghia` 4 + 19) nhưng
  sai ở khối có nhóm KHÔNG phải giới hạn (crm `bo-dung-khong-ket`: «Tách thành việc riêng»; kit `cat-hinh-thuc`) —
  máy không phân biệt được mà không hiểu câu. **Chỉ lấy danh sách đầu:** sai ở mọi khối chia nhóm. Chọn «không
  đọc được». Giá: hai hồ sơ hôm nay đếm đúng nhờ may (crm `bo-dung-khong-ket` 8, radar `doc-mang-v0` 32) chuyển
  sang «chưa đọc được».
- **Một nguồn không đọc được thì in số của nguồn kia kèm cờ:** bỏ — trái lời giao «không in số».
- **Đọc số bằng chữ trong đoạn dẫn («Mười một giới hạn»):** bỏ — kit không hiểu câu; ngoài phạm vi.
- **Sửa bộ đọc dòng nội dung chung (`lib/md-section.cjs` `contentLines`) cho nhận danh sách đánh số:** bỏ — chạm
  `lib/**` (T3) và đổi mọi bên gọi khác (thẻ cổng, lint); bộ đọc khối nằm trong mô-đun dải.
- **Trang đầy đủ in lại đúng đoạn cụt như trước vòng trước:** bỏ — xem 2.3.

## 4. Ràng buộc

- Bộ ca của hồ sơ đã ký `dai-tom-tat-doc-dung` (`tests/scripts/dai-tom-tat.test.mjs`, DT-1…DT-8) xanh trên cây này
  mà tệp ca không đổi một byte — các dòng mã mà ca chiều đỏ của nó tiêm vào giữ nguyên chữ.
- Không chạm `lib/**`, `hooks/**`, lưới trước-gộp; không đổi khuôn khối `lo-trinh-du-lieu`.
- Vùng cấm của phiên: SKILL feature-loop S1, `gate-card.js`, `can-cu-s1.cjs`, `khong-can-nguoi.mjs`,
  `start-scan.mjs`, `tin-hieu.mjs`, `dieu-phoi/`, `feature-loop/scripts/`, `feature-loop/workflows/`.

## 5. Đo

- Ma trận hình dạng viết sẵn, ca sinh trong lượt (kho thử bằng `lo-trinh.mjs --mo-o` như vòng trước), mỗi cơ chế
  một chiều đỏ trên bản sao cây bị tiêm, ghim thông điệp: tệp ca mới `tests/scripts/dai-tom-tat-dem-dung.test.mjs`.
- Dữ liệu thật sáu kho ở mã ghim (`git archive`, không ghi vào kho nào): `tests/scripts/dai-tom-tat-sau-kho.mjs`
  — cần sáu kho trên máy nên không mang đuôi `.test.mjs`, không vào suite (tiền lệ `dai-tom-tat-crm.mjs`); kho vắng
  → ĐỎ nêu tên kho. Bộ đọc base = cây `bd8163dc` (đỉnh vòng trước, tổ tiên của nhánh này) qua `git archive` trọn
  thư mục `scripts lib`.
- Trang đầy đủ: bộ đọc HTML độc lập của ca (không gọi mô-đun); trên dữ liệu thật so CHỨA trên chuỗi chỉ gồm chữ cái
  với câu cuối của đoạn mà bộ vẽ tiền-trần `7f65e5a0` in.
- Đường đo của ngưỡng nghiệm thu: `node tests/scripts/dai-tom-tat-sau-kho.mjs --hien-tai crm=<gốc kho>` — bốn số
  (i)–(iv) của mục «Đường đo» trong hợp đồng; đo thử 12/10 trên crm `onehub` với cây vòng này: 0 · 0 · 0 · 0.

Cỡ vòng: 10 tiêu chí — trong khoảng mục tiêu 8–10 của chính sách cỡ vòng.
