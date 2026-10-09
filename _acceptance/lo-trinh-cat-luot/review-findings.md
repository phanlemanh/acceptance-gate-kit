# Review findings: lo-trinh-cat-luot (round 4)

## Trong hợp đồng

- **Hình dạng 5 (+4): ca «thiếu ngày» của LT-135 chỉ phủ một bên, và bên đó xanh cả khi gỡ luật**
  file: `tests/scripts/lo-trinh.test.mjs:1823`
  severity: medium
  AC: AC-6
  source: measurement
  detail: AC-6 hứa «hàng thiếu ngày (một trong hai bên) không bị xét», E6 hứa «thiếu ngày một bên → không lỗi». Ma trận LT-135 chỉ có MỘT ca: `'thieu-ngay': [ngay(LT_GOC(), '', '2026-11-05'), 0, null]`, tức hàng đứng trên (R1) để trống, còn hàng đứng sau (R2) có ngày. Ca này không thể đỏ: trong kiemPhu, phép so `n < nt` với nt = '' luôn sai ('2026-11-05' < '' là false), nên dù không có chốt chặn nó vẫn im. Đã thử trên một bản sao gỡ CẢ HAI chốt (`if (!NGAY_RE.test(n)) continue;` và `NGAY_RE.test(nt) &&`): ca này vẫn ra lỗi rỗng, LT-135 vẫn xanh. Bên còn lại (R2 trống, R1 = '2026-11-10') trên cùng bản sao ra `hàng R2: ngày  sớm hơn ngày 2026-11-10 của hàng R1 nó đứng trên` — đúng là lỗi mà vế hợp đồng này phải chặn, nhưng không ca nào dựng nó. Như vậy vế «thiếu ngày không bị xét» chỉ có một điểm-ca, điểm-ca đó lại im theo cấu tạo, và LT-135-do không có bản đột biến nào chạm chốt thiếu-ngày. Cần ma trận viết trước cho {hàng trên trống · hàng dưới trống} kèm một bản đột biến gỡ chốt.
  rationale: AC-6 hứa «hàng thiếu ngày (một trong hai bên) không bị xét» nhưng ca đo chỉ dựng một bên và bên đó im theo cấu tạo, nên vế này của AC chưa được chứng minh có chiều đỏ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Diff edits sample files inside two already-signed dossiers, which makes their evidence go stale and blocks merge**
  Người dùng thấy gì: Hai hồ sơ đã ký trước đó (trang lộ trình và việc kế theo kế hoạch) sẽ bị báo là bằng chứng đã cũ, nên PR này chưa gộp được cho tới khi ghim lại hai hồ sơ ấy. Không ảnh hưởng người dùng cuối, chỉ chặn việc gộp.
  file: `_acceptance/trang-lo-trinh-doc-mot-phut/mau/hai-lo-trinh.html`
  severity: high
  Đề xuất: known-limits

- **`--nhip` treats any non-empty human_signoff as signed, bypassing the single-source `chuKyThat` check**
  Người dùng thấy gì: Hồ sơ mới chỉ ghi chữ giữ chỗ như «pending» ở ô chữ ký vẫn bị tính là đã ký khi đo nhịp, làm số ngày trung vị mà bước cắt lượt dùng để ước hàng và ngày bị lệch nhẹ.
  file: `scripts/cat-luot.mjs`
  severity: medium
  Đề xuất: known-limits

- **cat-luot SKILL points to kit templates by repo-relative path, which does not exist in a consumer repo**
  Người dùng thấy gì: Khi chạy ở một kho sản phẩm khác kho của kit, bước đầu tiên của kỹ năng cắt lượt bảo mở khuôn bản phạm vi và khuôn lộ trình ở chỗ không tồn tại, nên phiên cắt phải tự đi tìm khuôn.
  file: `skills/cat-luot/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **New `docRid` copies the reader's run_id normalisation already present as `chuanHoa` in the same file**
  Người dùng thấy gì: Không có hậu quả cho người dùng; chỉ là cùng một luật chuẩn hoá mã lượt chạy được viết hai chỗ trong một tệp, về sau có thể lệch nhau nếu chỉ sửa một chỗ.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: wont-fix

- **A row date in the wrong format switches off the plan's date checks with no error and no warning**
  Người dùng thấy gì: Nếu một hàng của lộ trình ghi ngày theo kiểu ngày/tháng/năm thay vì năm-tháng-ngày, việc kiểm ngày cho hàng đó bị bỏ qua lặng lẽ và kiểm tra vẫn báo xanh, nên một hàng trễ hơn mốc có thể lọt qua mà không ai biết.
  file: `scripts/cat-luot.mjs`
  severity: medium
  Đề xuất: known-limits

- **A milestone whose `hang` is not a list switches off the milestone check for this dot's rows, and only warns**
  Người dùng thấy gì: Khi một mốc khai danh sách hàng sai kiểu, kiểm tra ngày theo mốc cho các hàng của đợt đang cắt bị tắt và chỉ còn một dòng cảnh báo, nên hàng trễ hơn mốc vẫn được cho qua.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4: LT-136-do dinh-dang ghim «bo_qua», mà «bo_qua» nằm trong khuôn của MỌI thông điệp lỗi kho-that**
  Người dùng thấy gì: Ca kiểm trên hồ sơ thật của kit báo đỏ khi số hồ sơ đủ ngày quá ít hoặc quá nhiều hồ sơ bị bỏ qua, nhưng cả hai trường hợp in cùng một câu, nên người đọc khó biết lỗi nằm ở vế nào.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Carried eval run_id bypasses docRid: E13's `""` keeps being re-written and the evidence reader silently drops it (r3)**
  Người dùng thấy gì: Khi một phép kiểm được mang nguyên kết quả từ lượt chấm trước sang lượt sau, mã lượt chạy hỏng của nó vẫn được chép lại như cũ. Kết quả là phép kiểm đó (E13) lặng lẽ không bị đối chiếu nguồn gốc lúc ký, không báo đỏ cũng không báo khớp, và người ký không thấy dấu hiệu nào.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — vòng ghi→đọc W-RID tuyên «mọi run_id đọc lại đúng nó» nhưng chỉ thử một nhánh của luật bên đọc (nhánh cắt đuôi ` # …` không có đầu vào nào) (r3)**
  Người dùng thấy gì: Phép thử bảo vệ cho việc sửa mã lượt chạy chỉ thử một phần các kiểu mã sai có thể gặp. Nếu ai đó lỡ gỡ đoạn xử lý mã có ghi chú đi kèm, phép thử vẫn báo xanh, và lỗi cũ (ký bị chặn oan khi mã lượt chạy có chú thích) có thể quay lại mà không ai hay.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): LT-137 bỏ qua kết quả của lượt --nhip, nên «nhịp không ghi gì» xanh cả khi lượt nhịp không chạy (r2)**
  Người dùng thấy gì: Lệnh đo nhịp làm việc có thể hỏng ngay từ đầu mà phép kiểm «không đụng tới tệp nào» vẫn báo xanh. Rủi ro thấp vì phần chạy đúng của lệnh nhịp đã được kiểm ở chỗ khác. Đề xuất ghi là hạn chế đã biết và đi tiếp.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **The scope template says the reader only reads the PHAM-VI-MA marker block, but `docPhamVi` reads the whole file (r1)**
  Người dùng thấy gì: Khuôn bản phạm vi hứa rằng chỉ phần giữa hai dấu mốc được máy đọc, nhưng thực tế máy đọc cả tệp. Nếu ai đó ghi chú thêm một dòng cùng dạng với mã ngoài khối, máy sẽ tính nó như một mã thật hoặc báo lỗi oan.
  file: `skills/acceptance/references/pham-vi-template.md`
  severity: low
  Đề xuất: known-limits

- **SKILL sends Core «Never» cells to `da_bac`, but the coverage check gives `da_bac` no credit (r1)**
  Người dùng thấy gì: Hướng dẫn cắt lượt bảo đưa các mục «không bao giờ làm» vào danh sách đã bác, nhưng bước kiểm tra phủ không tính chúng. Người cắt có thể liệt kê chúng thành mã và bị báo đỏ, hoặc bỏ chúng đi và mất dấu vết.
  file: `skills/cat-luot/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Malformed milestone `hang` downgrades to a warning and skips the milestone-date rule for rows in the batch, so the check still exits 0 (r1)**
  Người dùng thấy gì: Nếu danh sách hàng của một mốc bị ghi sai kiểu, máy chỉ cảnh báo và bỏ qua phép kiểm ngày với mốc đó. Một hàng trong đợt đang cắt có thể trễ hơn ngày mốc mà vẫn được cho qua.
  file: `scripts/cat-luot.mjs`
  severity: medium
  Đề xuất: known-limits

- **nhanCuaCo misreads labels that contain ':' or ' thiếu ', so a broken row in the batch only gets a warning (r1)**
  Người dùng thấy gì: Với mã hàng có dấu hai chấm, một hàng trong đợt đang cắt bị thiếu trường bắt buộc chỉ nhận cảnh báo thay vì lỗi. Việc cắt lượt vẫn qua dù hàng đó chưa hợp lệ.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/8 lỗi rơi vào file không bộ đo nào phủ (_acceptance/trang-lo-trinh-doc-mot-phut/mau/hai-lo-trinh.html, feature-loop/workflows/acceptance-verify.js) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
