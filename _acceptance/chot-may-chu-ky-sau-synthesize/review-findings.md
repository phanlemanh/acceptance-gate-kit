## Trong hợp đồng

- **Chốt bỏ qua cả frontmatter khi báo cáo mở bằng dòng trống hoặc «--- » có khoảng trắng cuối, nhưng bên đọc vẫn nhận đó là chữ ký**
  AC: AC-1
  file: `feature-loop/workflows/acceptance-verify.js:109`
  severity: medium
  detail: chotTruongNguoi chỉ nhận ra frontmatter khi `dong[0] === '---'` và dòng đóng đúng bằng `'---'`. Bên đọc thì dễ hơn: `lib/evidence-core.cjs` frontmatterField (dòng 277–279) bỏ các dòng trống ở đầu và chấp nhận `---[ \t]*`; chuKyThat (dòng ~1128–1135) cũng bỏ dòng trống đầu, chấp nhận `---[ \t]*`, và khi không có dòng đóng thì đọc tới hết tệp. Hệ quả: nếu tác tử tổng hợp trả báo cáo mở bằng `\n---\n...human_signoff: Manh 2026-09-23\n---`, hoặc dòng mở/đóng là `--- `, thì `fmHet = -1` và vòng lặp frontmatter không chạy, cũng không coi `human_signoff:` ở cột 0 là vị trí trường. human_signoff, bypass_ack và verified_at cấp 0 giữ nguyên giá trị tác tử viết — đổi bằng 0 hết, không dòng run-log nào, không BLOCKED. Đã tái hiện bằng napChot: cả hai ca (dòng trống đầu, `--- ` có dấu cách cuối) đều ra doi={0,0,0,0} và chữ ký còn nguyên, trong khi frontmatterField trên cùng chuỗi trả đúng `human_signoff: Manh 2026-09-23`. Một chữ ký do máy viết đi lọt chốt mà không ai được báo.
  source: bugs

- **run_id có ngoặc kép làm khối carry lặng lẽ mất giờ gốc, verified_at bị ép thành invokedAt**
  AC: AC-2
  file: `feature-loop/workflows/acceptance-verify.js:136`
  severity: medium
  detail: run_id của khối được lấy bằng `/^run_id\s*[:=]\s*(\S+)/`, giữ nguyên ngoặc kép. Bên đọc thì bỏ ngoặc: `lib/evidence-core.cjs` extractRunIds (dòng 314–318) dùng `.replace(/^["']+|["']+$/g,'')`, nên `run_id: "run-goc-E4"` hợp lệ và đối chiếu được với run-log. Với khối carry viết `run_id: "run-goc-E4"`, rid thành `'"run-goc-E4"'` và tra gioTheoRunId không trúng; dòng 156 lặng lẽ rơi về invokedAt, không báo lỗi. Đã tái hiện: khối carry có verified_at 2026-07-01T00:00:00Z (giờ gốc) bị đổi thành 2026-07-02T10:00:00Z, doi.verified_at=1 — engine tự khai một eval KHÔNG chạy lại vòng này được đo ở giờ của vòng này, đúng hình dạng «giả timestamp mới» mà AC-2 định chặn.
  source: bugs

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E7 (ctn_ac7) gặp «không đọc được ở đây» thì bị xếp thành lỗi vật (REJECT), vì mã thoát 3 riêng không nằm trong INFRA-EXIT-CODES**
    Người dùng thấy gì: Khi môi trường chạy thiếu quyền truy cập kho liên quan, máy có thể báo sai là kết quả không đạt thay vì báo đúng là không kiểm tra được ở đây, khiến người đọc dễ nhầm thành lỗi thật của tính năng.
    file: `_acceptance/config.yaml`
    severity: medium
    Đề xuất: known-limits

- **Giờ carry lấy invokedAt thô chưa kiểm, trong khi hàm chốt kiểm ISO; invokedAt sai dạng thì thông báo lại nói là «vắng»**
    Người dùng thấy gì: Nếu ai đó tự soạn dữ liệu đầu vào cho bước kiểm mà ghi sai định dạng giờ, thông báo lỗi có thể nói giờ bị thiếu dù thực ra nó có mặt, làm người đọc thông báo hiểu nhầm nguyên nhân.
    file: `feature-loop/workflows/acceptance-verify.js`
    severity: low
    Đề xuất: known-limits

- **Dòng trường thụt khác 2 cột (vd 4) không bị chốt, trong khi hook L3 đếm human_override ở mọi vị trí**
    Người dùng thấy gì: Nếu báo cáo tự động lệch định dạng thụt lề tiêu chuẩn, một chữ ký hoặc ghi đè do máy tạo ra vẫn có thể lọt qua bước chặn mà không có cảnh báo nào.
    file: `feature-loop/workflows/acceptance-verify.js`
    severity: low
    Đề xuất: known-limits

- **Hình dạng 5 (ma trận khai toàn phần nhưng có ô ma): ô judgment-carry không hề là carry**
    Người dùng thấy gì: Một phần của bộ kiểm tự động không thực sự kiểm tra tình huống nó tuyên bố kiểm tra, nên một lỗi tiềm ẩn ở đúng tình huống đó có thể không bị phát hiện dù mọi thứ vẫn báo đạt.
    file: `tests/workflows/chot-truong-nguoi.test.mjs`
    severity: medium
    Đề xuất: known-limits

- **Hình dạng 5 (chốt «số assert = số phần tử» kiểu P105 là tautology) kèm một ca AC-2 chỉ so hằng số**
    Người dùng thấy gì: Một vài phép kiểm trong bộ test luôn báo đạt bất kể máy làm đúng hay sai, nên con số đạt không phản ánh đầy đủ độ tin cậy thật của việc kiểm tra.
    file: `tests/workflows/chot-truong-nguoi.test.mjs`
    severity: low
    Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
