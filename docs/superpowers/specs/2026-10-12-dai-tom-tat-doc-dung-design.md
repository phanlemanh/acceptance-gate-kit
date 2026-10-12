# Dải tóm tắt hồ sơ đọc đúng trên dữ liệu thật — thiết kế

Ngày 2026-10-12 · hồ sơ `_acceptance/dai-tom-tat-doc-dung/` · gốc: crm `_acceptance/ngan-ho-so-trong-lo-trinh`
(vòng LT1b — ngăn hồ sơ trong trang Lộ trình CRM hiện nguyên chữ của `hang.tom_tat`, không tự tính).

## Vấn đề (đo 12/10)

Kit `origin/main` 7f65e5a0 vẽ lại `LO-TRINH.html` trên bản sao crm 27d47de04 (`git archive`), đọc khối
bằng `docDuLieu`: 117 việc, 81 có `tom_tat`. Ba ô của tầng «mọi người» sai hoặc kém — cả ba ở
`scripts/ho-so-tom-tat.cjs`:

| Ô | Hiện ra | Vì sao sai |
|---|---|---|
| `production` | 81/81 «chưa ghi quan sát production», kể cả LT1 đã lên production 10/10 | kit chỉ đọc dòng sổ `thuc-te` người ghi; người đọc hiểu là «chưa lên» |
| `chua_lam` | LT1 «9 mục ngoài hợp đồng · 0 giới hạn đã biết» | «9» là số gạch `## Out of scope` (để ngoài phạm vi), không phải «ngoài hợp đồng» theo nghĩa finding Cổng Bằng chứng; 13 giới hạn chủ kho chọn ở Cổng Bằng chứng nằm ở `## Notes` của hợp đồng — kit đọc `## Known limits` của báo cáo, mục này rỗng theo định nghĩa ở mọi báo cáo xanh-sạch |
| `vi_sao` | 11/81 cụt ở «…:», 31/81 dài hơn 400 ký tự (dài nhất 1 311) | lấy nguyên đoạn đầu; đoạn đầu có khi là câu dẫn tới một danh sách |

Ô `chua_lam` là lệch BÊN VIẾT — BÊN ĐỌC của chính kit: `commands/signoff.md` và SKILL feature-loop dặn
«ghi Known limits» = thêm gạch vào `## Notes` của hợp đồng, nhưng bộ đọc dải đọc chỗ khác.

## Cân trên mọi kho (luật 26/09)

Khảo sát cùng ngày bằng chính `tomTatHoSo` trên mọi kho có `_acceptance/` + `pre-merge-check.sh` ở `~/dev`:

| Kho | Hồ sơ | `vi_sao` cụt «:» | `vi_sao` > 400 | có dòng `thuc-te` | hợp đồng có gạch Known limits ở Notes | báo cáo có Known limits | cả hai |
|---|---|---|---|---|---|---|---|
| crm (bản sao 27d47de04) | 237 | 19 | 98 | 7 | 78 | 20 | 8 |
| acceptance-gate-kit | 187 | 28 | 92 | 1 | 67 | 41 | 8 |
| radar | 36 | 1 | 8 | 0 | 6 | 29 | 7 |
| oneflow | 45 | 5 | 13 | 0 | 2 | 13 | 4 |
| artifact-platform | 199 | 1 | 68 | 0 | 13 | 1 | 1 |
| media-library | 26 | 1 | 10 | 0 | 1 | 10 | 0 |

Ba lỗi có ở MỌI kho, không riêng crm. Không kho nào có logic dựa trên chữ của ba ô (dải là chữ hiện
nguyên văn; khối mới ở bản 2 từ 11/10, chỉ crm sắp đọc). Thứ tự chọn nghiệm theo luật: vật của kho
không có lỗi ở đây (crm ghi giới hạn đúng chỗ kit dặn) → sửa **bộ đọc khoan dung** ở kit.

## Cách làm

### 1. `production` — tách «đã triển khai» khỏi «đã thấy chạy», bật theo lựa chọn

Ràng buộc của phiên điều phối 12/10 (thay phương án «chỉ đổi lời» của bản S1 đầu): hai câu khác nghĩa,
hai người gỡ khác nhau.

- **Đã thấy chạy** = reality (ADR 0020): chỉ dòng sổ `thuc-te` người ghi bằng `/acceptance-gate:observed`.
  Có dòng đó → câu cũ «đã chạy ở production — bản dựng …», ở mọi kho, như trước.
- **Đã triển khai** = máy suy từ git, CHỈ khi kho khai nhánh production trong `_acceptance/config.yaml`:

  ```yaml
  production:
    nhanh: onehub   # nhánh mà gộp vào là lên production
  ```

  Mã đã chấm (`verified_commit`) là tổ tiên của `origin/<nhánh>` (vắng thì `<nhánh>`) → «đã triển khai —
  gộp vào <nhánh> <ngày>; chưa ai ghi đã thấy chạy ở production», ngày = commit cũ nhất trên đường
  first-parent của nhánh chứa mã (commit gộp, hoặc chính mã nếu commit thẳng). Không phải tổ tiên → «chưa
  gộp vào <nhánh> (nhánh production kho khai)». Không đọc được (không kho git, không thấy nhánh, mã vắng
  trong kho — vd gộp squash) → «chưa đọc được triển khai ở đây — <lý do>»; không đoán.
- Kho KHÔNG khai → ô giữ nguyên câu cũ «chưa ghi quan sát production» (luật 26/09: bật theo lựa chọn trước
  đổi mặc định; hồ sơ đã ký `trang-ho-so-mot-viec` AC-5 không bị chạm).

Đây là **CỘNG** (một khoá cấu hình mới, mô-đun dải thôi là hàm thuần khi khoá có mặt) — owner phê đích
danh ở Cổng Phạm vi. Phép đo trên bản sao crm (clone `--shared`, `onehub` ghim vào 27d47de04): khai nhánh →
81/81 «đã triển khai», LT1 «gộp vào onehub 2026-10-10»; không khai → 81/81 câu cũ.

### 2. `chua_lam` — hai nguồn giới hạn, đổi tên vế đầu

- Vế đầu đổi «N mục ngoài hợp đồng» → **«N mục để ngoài phạm vi»** (`## Out of scope`). «Ngoài hợp đồng»
  là nhãn trạng thái đã có nghĩa (finding ngoài phạm vi đã duyệt — CONTEXT.md).
- Vế sau đọc HAI nguồn: `## Known limits` của báo cáo (như cũ) và khối giới hạn trong `## Notes` của
  hợp đồng. Một gạch giới hạn = gạch cấp ngoài cùng của `## Notes` mở đầu (sau `**` tuỳ chọn, không
  phân hoa thường) bằng `Known limit`/`Known limits`/`known-limit`/`known-limits`/`Giới hạn đã biết`
  (đúng các dạng gặp trên sáu kho). Gạch có gạch con → mỗi gạch con cấp kế là một giới hạn (dạng crm
  LT1: «Known limits — anh chọn ở Cổng Bằng chứng…:» + 13 gạch con); không gạch con → chính nó là một.
  Gạch con — hoặc gạch trơn — chỉ mang «none»/«không có» không đếm. Thêm dạng ĐẦU ĐOẠN (đo lại sau cờ
  vàng: 94 hồ sơ crm viết «Known limits — chấp nhận tại Cổng Bằng chứng …» thành một dòng văn, `###` hay
  `**…**`, rồi các gạch cấp ngoài cùng theo sau) và chữ «Hạn chế đã biết».
- Không in 0 khi không đọc được (ràng buộc điều phối): `## Notes` còn dòng nhắc giới hạn đã biết mà bộ đọc
  không nhận → «giới hạn đã biết: chưa đọc được — Notes nhắc giới hạn sai khuôn» (0 mục đọc được) hoặc
  thêm «(Notes còn chỗ nhắc giới hạn sai khuôn)» sau số. Đo trên sáu kho sau bộ đọc mở rộng: crm 0 ô
  «chưa đọc được» / 228 hợp đồng, kit 2/139, oneflow 1, media-library 3, artifact-platform 1.
- Hai nguồn cùng có: lấy **nguồn nhiều mục hơn** (hoà → hợp đồng), không cộng. 28 hồ sơ trên sáu kho có
  cả hai, và ở các ca soi tay hai nơi chép cùng giới hạn (vd crm `ke-hoach-la-mot-ban-ghi` 9 · 9) — cộng
  là đếm đôi. Kit không so được hai câu có phải một giới hạn → khai giới hạn.
- Danh sách giới hạn trên trang hồ sơ (`chiTiet.known`) là đúng danh sách của nguồn đã chọn — một bộ
  đọc, số trên dải và số dòng trên trang không trôi được khỏi nhau.
- Bên viết: `commands/signoff.md` thêm khối marker `KNOWN-LIMITS-NOTE` cho đúng hình dạng gạch mà lối
  «ghi Known limits» thêm vào `## Notes`; ca đo rút khối đó (round-trip writer → reader, mẫu P55).

### 3. `vi_sao` — không cụt, có trần

- Đoạn được chọn (ô cơ hội, hoặc đoạn đầu `## Context` của hợp đồng khi ô cơ hội vắng) kết bằng «:» (xét
  SAU khi bỏ dấu nhấn — dữ liệu thật có `…cùng lúc**:` và `…:**`) và ngay sau là một danh sách gạch/số hoặc một bảng → ô = câu dẫn +
  các mục nối bằng « · », mỗi mục rút gọn: mục mở bằng một cụm in đậm thì lấy cụm đó, không thì lấy câu
  đầu của mục; hàng bảng lấy ô đầu, bỏ hàng tiêu đề. Câu dẫn theo sau là khối mã hay đoạn in đậm vẫn cụt
  (6 hồ sơ trên sáu kho, 0 hàng lộ trình crm) — khai giới hạn.
- Trần **400 ký tự**: quá thì giữ trọn các đơn vị (câu, hoặc mục của danh sách) còn vừa và kết bằng «…»;
  câu đầu đã quá trần thì cắt ở khoảng trắng gần nhất trước trần + «…». Ô dưới trần giữ nguyên từng ký tự.
- Trang hồ sơ dùng CÙNG giá trị (một bộ đọc). Đoạn đầy đủ vẫn ở `opportunity.md`.

400 là con số của phép đo LT1b, khớp trung vị crm 364: một khối đọc trong vài giây trên ngăn hẹp. Sai thì
đổi một hằng — dòng sổ revisit.

## Không làm

Đổi tiêu đề mục «Giới hạn và ngoài hợp đồng» của trang hồ sơ (hồ sơ đã ký `trang-ho-so-mot-viec` AC-2 hứa
nguyên văn; mục ấy liệt kê nguyên văn từng dòng nên không gây hiểu nhầm như con số trên dải) · suy «đã
thấy chạy» thay người · đọc triển khai qua gộp squash · sửa gì trong kho crm · đổi khuôn khối dữ liệu (khoá,
kiểu, phiên bản giữ nguyên — chỉ đổi chữ của ba giá trị).

## Đặc tả UX

Bỏ — vòng không đổi bố cục hay điều khiển nào; chỉ đổi chữ của ba giá trị dữ liệu (sổ quyết định).
