## Trong hợp đồng

- **Hình dạng 4 (chiều đỏ không đi qua vật đo): RT13 (iv-a) tiêm file vào cây tạm nhưng phép quét git-grep không bao giờ chạy lại — file ghi ra là dead code**
  file: `tests/plugins/ra-co-ten.test.mjs:799`
  severity: medium
  AC: AC-13
  Comment (dòng 796) tuyên «TIÊM file thật vào cây tạm rồi chạy lại CHÍNH phép quét trên đó», nhưng code làm khác: `W(g, 'scripts/gia-lap-bo-doc-moi.mjs', ...)` ghi file vào thư mục tạm `g` rồi KHÔNG BAO GIỜ đọc/quét `g` — thay vào đó `const files2 = [...filesThat, 'scripts/gia-lap-bo-doc-moi.mjs']` nối tay tên file vào mảng và chỉ chạy lại `soSanh` (hàm lọc thuần, dòng 787-790). Bước DISCOVERY thật — `grepSignedOff()` = `git grep -l 'signed-off'` + bộ lọc NGOAI (dòng 762-764) — không có chiều đỏ nào chứng minh nó tìm ra được một bộ đọc mới (ví dụ: `git grep` mù với file untracked; NGOAI thêm nhầm một pattern rộng thì mọi file biến mất mà chỉ có lưới `filesThat.length < 5` đỡ). Chiều đỏ hiện tại chỉ chứng minh hàm lọc mảng hoạt động — gần tautology. Đối chiếu: RT18 chiều đỏ (a) (dòng 995-1004) làm ĐÚNG mẫu này — copy cây, tiêm file, chạy lại `scanRoot(g)` thật. File ghi vào `g` ở RT13 là bằng chứng intent đã trôi khỏi implementation. Rationale: AC-13(iv) đòi hỏi đúng chiều đỏ này — «tiêm một file mới chứa chuỗi vào bản sao» để chứng minh phép quét không gian mở phát hiện được bộ đọc lạ — nhưng finding cho thấy file tiêm không bao giờ được quét lại, nên lời hứa chiều đỏ của AC-13(iv) chưa thực sự được đo.

- **Hình dạng 4 (chiều đỏ không thể đỏ): RT10 assert `u.includes(k2)` vacuous — k2 là chuỗi bịa nên không bao giờ nằm trong uat-session; lời hứa E10 «reader trên bản sao đỏ nêu CẢ HAI chuỗi» không được đo**
  file: `tests/plugins/ra-co-ten.test.mjs:686`
  severity: medium
  AC: AC-10
  Chiều đỏ RT10 tiêm chuỗi mới «Khong do duoc —» vào bản sao khuôn, rút ra `k2`, rồi assert `else if (u.includes(k2)) errs.push('chiều đỏ: uat-session mang chuỗi CŨ ...')`. `k2` là chuỗi vừa bịa trong test — văn bản thật của uat-session §0 không bao giờ chứa nó, nên nhánh err này không thể fire dù reader/khuôn có drift kiểu gì; nó là assertion luôn-xanh đội lốt chiều đỏ (thông điệp còn gọi nhầm chuỗi MỚI là «chuỗi CŨ»). evals.yaml E10 hứa: «bản sao khuôn đổi một chuỗi → reader trên bản sao đỏ nêu CẢ HAI chuỗi» — không có reader nào được chạy trên bản sao và không có đầu ra nào nêu hai chuỗi; thứ duy nhất được chứng minh là `blockFromTemplate` thấy chuỗi đổi (`k2 === KHONG_DO` check, dòng 685). Phát hiện drift thật hiện chỉ nằm ở chiều xuôi (dòng 668-670: `u.includes(KHONG_DO)`), tức lời hứa của E10 về chiều đỏ chưa có phép đo tương ứng. Rationale: AC-10 kết thúc bằng đúng yêu cầu «bản sao khuôn đổi một chuỗi → reader trên bản sao đỏ nêu cả hai chuỗi»; finding cho thấy nhánh này không bao giờ có thể fire nên vế chiều đỏ của AC-10 chưa được đo thật.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Thẻ Cổng 2 mời ký hồ sơ máy-thông đã đóng (da-giao-khong-do không nằm trong MAY_DI_TIEP)**
  Người dùng thấy gì: Với một số hồ sơ máy đã duyệt xong và không cần chấm điểm người dùng, thẻ duyệt vẫn hiện nút mời ký trong khi đồng thời báo là chưa có chữ ký — người xem có thể bấm ký nhầm vào một hồ sơ đáng lẽ không cần chữ ký nữa.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **CHU_MAY_THONG chép nguyên văn viecKe của bảng chữ chung thay vì hỏi bảng**
  Người dùng thấy gì: Nếu sau này ai đó sửa câu mô tả trạng thái ở bảng chữ dùng chung, một vài chỗ trên thẻ vẫn hiển thị câu cũ vì bị chép cứng riêng một nơi, khiến các màn hình hiển thị không khớp nhau.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Comment luật của EVIDENCE_CONSUMING lỗi thời so với mảng — không giải thích vì sao machine-cleared tiêu thụ trong khi signed-off thì không**
  Người dùng thấy gì: Một ghi chú giải thích trong mã không được cập nhật theo đúng thay đổi mới nhất, có thể khiến người bảo trì sau này hiểu sai lý do và sửa nhầm ở lần thay đổi tiếp theo.
  file: `lib/workspace-record.cjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).