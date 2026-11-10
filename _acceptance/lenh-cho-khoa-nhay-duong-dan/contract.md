---
schema_version: 1
feature: Lệnh chờ khoá của thợ thoát được khi thư mục đợt có dấu cách hay ký tự lạ — bọc nháy đường khoá, một bộ nháy dùng chung
slug: lenh-cho-khoa-nhay-duong-dan
owner: manh@mstar.vn
risk_tier: T2
surfaces: [cli]
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-11-10T07:07:38Z
design_doc: docs/superpowers/specs/2026-11-10-lenh-cho-khoa-nhay-duong-dan-design.md
---

# Acceptance Contract: lenh-cho-khoa-nhay-duong-dan

## Context

Gốc: Ngoài-17, Ngoài-19 của Cổng Bằng chứng hồ sơ `t3-can-ho-so-arm` (10/11, chủ kho chọn «mở hợp đồng mới»); cùng lỗi
đã ghi Known limits ở Ngoài-2 của hồ sơ `sua-loi-dau-chu-dong-vao`. Thiết kế: design doc ở frontmatter.

Thuật ngữ:
- **lệnh chờ** = dòng `until jq … chu.json …; do sleep 15; done` do `lenhChoKhoa` sinh, `xin` in ở dòng «chờ (chạy nền)».
- **thư mục đợt lạ** = đường thư mục đợt chứa ít nhất một ký tự ngoài `[A-Za-z0-9_./:@%+,-]`.
- **chạy nguyên văn** = đưa đúng chuỗi lệnh chờ cho một vỏ shell thật, không sửa ký tự nào.

## Criteria

Trần đo: lệnh phải thoát trong 15 giây; kết luận «còn chờ» phải sau ít nhất 2 vòng kiểm đếm được (`sleep` giả đếm số lần gọi).

- AC-1: Given thư mục đợt có dấu cách và khoá đã ghi đúng tên dãy, When chạy nguyên văn lệnh chờ, Then lệnh thoát 0 với số
  vòng kiểm bằng 0 (thoát trước lần ngủ đầu); đối chứng cùng fixture: bản bỏ bọc nháy treo qua ít nhất 2 vòng kiểm.
- AC-2: Given thư mục đợt có dấu cách, When khoá vắng hoặc đứng tên dãy khác, Then lệnh chờ vẫn sống sau ít nhất 2 vòng
  kiểm ở mỗi trạng thái; When khoá sau đó ghi đúng tên dãy, Then lệnh thoát 0.
- AC-3: Given thư mục đợt lạ theo từng ký tự trong bảng chín phần tử (dấu cách, nháy đơn, nháy kép, `$(…)`, backtick, `;`,
  `&`, `*`, chữ tiếng Việt có dấu), When chạy nguyên văn lệnh chờ với khoá đúng tên dãy, Then thoát 0 và không lệnh nhúng
  nào trong tên thư mục được thi hành.
- AC-4: Given một đợt thử đặt dưới thư mục có dấu cách, bản lõi của đợt dựng bằng bước chép gói thật, When thợ chạy `xin
  ghim-lai` từ bản lõi rồi bộ phát lịch cấp khoá, Then chạy nguyên văn phần lệnh sau «chờ (chạy nền):» thì thoát 0 và
  đường trỏ `khoa/s4`; trước khi cấp, cùng lệnh vẫn chờ qua ít nhất 2 vòng kiểm; bản lõi có `nhay.mjs`.
- AC-5: Given thư mục đợt chỉ gồm ký tự an toàn, theo từng lớp trong bảng mười hai phần tử (`A`, `z`, `0`, `_`, `.`, `/`,
  `:`, `@`, `%`, `+`, `,`, `-`), When sinh lệnh chờ, Then chuỗi lệnh giống từng byte dạng không nháy cũ.
- AC-6: Given luật nháy dời khỏi `hook-chan-s4.mjs`, When đọc `dieu-phoi/scripts/`, Then `nhayDoiSo` có đúng một định nghĩa
  ở `nhay.mjs`, `nhayDon` có đúng tập định nghĩa {`nhay.mjs`, `phan-loai-s4.mjs`}, không có ở `lich.mjs` hay
  `hook-chan-s4.mjs`, `nhay.mjs` chỉ import `./` hoặc `node:`; và `lenhBoc` của hook cho kết quả giống từng byte bảng bốn
  đầu vào chụp trước khi dời, đủ nhánh an toàn và nhánh bọc.
- AC-7: Given tên dãy chứa nháy đơn, nháy kép hoặc gạch chéo ngược, When chạy nguyên văn lệnh chờ, Then thoát 0 khi khoá
  đúng dãy đó và còn chờ khi khoá của dãy khác.

## Coverage

Bỏ quét không gian — phạm vi do đề giao chốt (một hàm, một lỗi đã đo); xem entry `descope` «bỏ coverage-scan» trong
`decisions.jsonl`. Trục duy nhất đáng liệt kê là ký tự trong đường dẫn: bảng đầy đủ nằm trong AC-3, số ca bằng số phần tử.

## Out of scope

- Thêm trần thời gian cho lệnh chờ: thợ chờ lâu bao nhiêu tuỳ hàng đợi của đợt, không có số trần đúng.
- Báo lỗi khi máy thiếu `jq`: máy thiếu `jq` vẫn chờ mãi; việc của bước kiểm môi trường.
- Các dòng lệnh khác in đường đợt trần (`ghi_danh` của `tiep-tuc.mjs`, lời nhắc bàn giao của `hook-nhip.mjs`): cùng họ
  lỗi, khác vật, vòng riêng.
- Sửa Known limits đã ký của hồ sơ `sua-loi-dau-chu-dong-vao`: hồ sơ đã ký không sửa lại.

## Notes

- Không chạm mặt người nhìn (`surfaces: [cli]`).
