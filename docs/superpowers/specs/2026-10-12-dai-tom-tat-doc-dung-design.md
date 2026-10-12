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

### 1. `production` — đổi lời, KHÔNG thêm khoá kho

Vắng dòng `thuc-te`: ô ghi **«chưa ai xác nhận đã thấy chạy ở production — máy không tự biết»**. Câu nói
đúng điều kit biết (không biết), không đọc được thành «chưa lên». Có dòng `thuc-te`: giữ nguyên câu cũ.
Kho muốn ô trả lời «đã lên» thì đi đường đã thiết kế: người ghi quan sát (`/acceptance-gate:observed`,
ADR 0020) — một lần cho mỗi việc đã lên.

Phương án bỏ: khoá config «nhánh chính = production» để ô tự suy «đã gộp nhánh chính». Bỏ vì (a) đó là
CỘNG (khoá mới ở mọi kho) — cần owner phê đích danh; (b) mô-đun dải là hàm thuần với cây tệp, không
git — suy «đã gộp» cần git hoặc tin rằng mọi trang được vẽ trên nhánh chính (sai: mỗi vòng vẽ lại trang
trên nhánh của nó); (c) khối ĐỊNH VỊ đặt «sha đang chạy trên prod» là thứ VẬT phát ra, không phải một
lời khai cấu hình. Đi hạt giống, neo LT1b.

### 2. `chua_lam` — hai nguồn giới hạn, đổi tên vế đầu

- Vế đầu đổi «N mục ngoài hợp đồng» → **«N mục để ngoài phạm vi»** (`## Out of scope`). «Ngoài hợp đồng»
  là nhãn trạng thái đã có nghĩa (finding ngoài phạm vi đã duyệt — CONTEXT.md).
- Vế sau đọc HAI nguồn: `## Known limits` của báo cáo (như cũ) và gạch giới hạn trong `## Notes` của
  hợp đồng. Một gạch giới hạn = gạch cấp ngoài cùng của `## Notes` mở đầu (sau `**` tuỳ chọn, không
  phân hoa thường) bằng `Known limit`/`Known limits`/`known-limit`/`known-limits`/`Giới hạn đã biết`
  (đúng các dạng gặp trên sáu kho). Gạch có gạch con → mỗi gạch con cấp kế là một giới hạn (dạng crm
  LT1: «Known limits — anh chọn ở Cổng Bằng chứng…:» + 13 gạch con); không gạch con → chính nó là một.
  Gạch con — hoặc gạch trơn — chỉ mang «none»/«không có» không đếm.
- Hai nguồn cùng có: lấy **nguồn nhiều mục hơn** (hoà → hợp đồng), không cộng. 28 hồ sơ trên sáu kho có
  cả hai, và ở các ca soi tay hai nơi chép cùng giới hạn (vd crm `ke-hoach-la-mot-ban-ghi` 9 · 9) — cộng
  là đếm đôi. Kit không so được hai câu có phải một giới hạn → khai giới hạn.
- Danh sách giới hạn trên trang hồ sơ (`chiTiet.known`) là đúng danh sách của nguồn đã chọn — một bộ
  đọc, số trên dải và số dòng trên trang không trôi được khỏi nhau.
- Bên viết: `commands/signoff.md` thêm khối marker `KNOWN-LIMITS-NOTE` cho đúng hình dạng gạch mà lối
  «ghi Known limits» thêm vào `## Notes`; ca đo rút khối đó (round-trip writer → reader, mẫu P55).

### 3. `vi_sao` — không cụt, có trần

- Đoạn được chọn kết bằng «:» (xét SAU khi bỏ dấu nhấn — dữ liệu thật có `…cùng lúc**:` và `…:**`) và ngay sau là một danh sách gạch/số → ô = câu dẫn +
  các mục nối bằng « · », mỗi mục rút gọn: mục mở bằng một cụm in đậm thì lấy cụm đó, không thì lấy câu
  đầu của mục.
- Trần **400 ký tự**: quá thì giữ trọn các đơn vị (câu, hoặc mục của danh sách) còn vừa và kết bằng «…»;
  câu đầu đã quá trần thì cắt ở khoảng trắng gần nhất trước trần + «…». Ô dưới trần giữ nguyên từng ký tự.
- Trang hồ sơ dùng CÙNG giá trị (một bộ đọc). Đoạn đầy đủ vẫn ở `opportunity.md`.

400 là con số của phép đo LT1b, khớp trung vị crm 364: một khối đọc trong vài giây trên ngăn hẹp. Sai thì
đổi một hằng — dòng sổ revisit.

## Không làm

Đổi tiêu đề mục «Giới hạn và ngoài hợp đồng» của trang hồ sơ (hồ sơ đã ký `trang-ho-so-mot-viec` AC-2 hứa
nguyên văn; mục ấy liệt kê nguyên văn từng dòng nên không gây hiểu nhầm như con số trên dải) · khoá «nhánh
chính = production» · tự suy production từ git · sửa gì trong kho crm · đổi khuôn khối dữ liệu (khoá,
kiểu, phiên bản giữ nguyên — chỉ đổi chữ của ba giá trị).

## Đặc tả UX

Bỏ — vòng không đổi bố cục hay điều khiển nào; chỉ đổi chữ của ba giá trị dữ liệu (sổ quyết định).
