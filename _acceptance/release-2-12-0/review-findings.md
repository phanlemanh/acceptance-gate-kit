## Trong hợp đồng

- **Con trỏ «ngả 5» còn đứng sau khi d-29 đã dời nhát cắt scan() sang ngả 7**
  file: `_acceptance/release-2-12-0/contract.md:354`
  severity: high
  detail: decisions.jsonl d-20260913T234746Z-29 khai: «Sáu chỗ trong hồ sơ mốc khai nhát cắt đã vào ô ngả 5, nhưng ô không có mục đó… Ghi NGẢ 7 vào ô» và opportunity.md (dòng 77–82) đã tách ngả 7 = cắt phép quét P93, ngả 5 = phân lớp sau khi đỏ. Nhưng hồ sơ vẫn trỏ nhát cắt scan() vào ngả 5 ở: contract.md:354 (Notes §4), contract.md:329 (Notes §3), evals.yaml:133 (expected E3c), gap-probe.md:27 (cột Xử lý P0 thứ ba), evidence-report.md:130 (Round 4). Chỉ run-log.jsonl:56 nói đúng NGA 7. Đây đúng lớp «lời khai trỏ vào vật không còn» mà chính contract Known limits đặt nghi thức «gỡ/khai một vật thì grep tên nó trong TRỌN hồ sơ» — d-29 tự nhận áp nghi thức đó nhưng không áp. Hệ quả: cửa sổ kế mở ô sẽ tìm nhát cắt ở ngả 5 (đã gỡ) thay vì ngả 7, và E3c expected (thứ tác tử lượt sau đọc) trỏ sai.
  source: conventions
  AC: AC-4

- **Notes §1 «Hạ tầng đốt lượt: 4» đếm thiếu lượt 5 so với nguồn rút tự khai (run-log.jsonl)**
  file: `_acceptance/release-2-12-0/contract.md:288`
  severity: medium
  detail: Contract dòng 288–296 và §3 dòng 327–329 đếm lượt bị hạ tầng đốt của chính mốc là 2 (lượt 1 và 4), tổng 4. Nhưng run-log.jsonl:56 ghi `kind: infra-recheck` cho round 5 («DO GIA — ha tang… lan thu hai cua chinh ho so nay»), d-20260913T234746Z-30 ghi «E3c lại là ĐỎ GIẢ (lần thứ hai của hồ sơ, thứ năm của lớp)», và opportunity.md ngả 7 ghi «mốc 2.12.0 lượt 1 · 4 · 5». Đây là một trong năm dòng số của luật (c) mà AC-4 đòi «mỗi số nói được nó đọc từ đâu»; nguồn rút nêu tên (run-log) cho 3 của mốc / 5 tổng, hợp đồng ghi 2 / 4. E4 là judgment đọc chính văn nên không thấy — đúng lớp «lời khai đứng thay phép đo» mà gap-probe P0 thứ hai đã gọi tên.
  source: conventions
  AC: AC-4

- **Assertion âm-tính chưa từng chạy chiều đỏ ở lối lõi — E2 khai «cần dựng kho giả có lịch sử riêng» cho mã 3/4/5 nhưng mã 4 và mã 5 tái hiện được trong vài giây bằng clone + một commit**
  file: `_acceptance/release-2-12-0/evals.yaml:86`
  severity: low
  detail: E2 `expected` (evals.yaml:86–88) khai «CHƯA chạy chiều đỏ: lối 3, 4, 5 (cần dựng kho giả có lịch sử riêng; không dựng vì đó là thêm dàn đo)». Mã 5 là chính vế Then của AC-2 («diagram-design/ CÓ đổi sau lần cắt số»), tức màu xanh của E2 chưa từng được chứng minh là biết đỏ ở đúng lối nó tồn tại để canh — chỉ các lối HẠ TẦNG (2, 8) có chiều đỏ ghim. Lý do khai là quá mức: không cần kho giả — `git clone` cục bộ kho thật rồi thêm MỘT commit là đủ. Đã chạy trong scratchpad: (a) clone nguyên vẹn → PASS, rc=0 (đối chứng dương); (b) thêm một dòng vào `diagram-design/skills/diagram-design/SKILL.md`, commit không tăng số → `DO: diagram-design CO doi sau lan cat so gan nhat (06331ab2…) ma so chua tang:` + tên tệp, rc=5; (c) sửa manifest 2.7.0→2.8.0, commit → `DO: cua so <sha>..HEAD RONG (moc trung HEAD) …`, rc=4. Răng ĐÚNG ở cả hai lối, nên đây không phải lỗi thước mà là lời khai giới hạn chưa chính xác: hoặc ghim hai lượt chạy này (mã + thông điệp) vào `expected` như đã làm cho lối 2/8, hoặc giữ giới hạn nhưng nêu đúng chi phí thật. Mã 3 (không tìm được lần cắt số) vẫn cần lịch sử riêng — khai giới hạn ở đó là chính xác.
  source: measurement
  AC: AC-2

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Thiếu review-findings.md trong khi evidence-report viện dẫn triage ngoài hợp đồng**
  Người dùng thấy gì: Người duyệt ở bước ký cuối có thể không thấy đủ danh sách các phát hiện đã được xếp là 'nằm ngoài phạm vi' trên thẻ quyết định, dù báo cáo khẳng định chúng vẫn còn tồn tại — dễ bỏ sót thông tin quan trọng lúc ký duyệt.
  file: `_acceptance/release-2-12-0/evidence-report.md`
  severity: medium
  Đề xuất: new-contract

- **Evidence-report tại HEAD ghim đầu ra của răng đã bị trừ (chân 4) và verified_commit lùi 2 commit — pre-merge không bắt vì _acceptance/* miễn staleness**
  Người dùng thấy gì: Báo cáo bằng chứng đang hiển thị có thể phản ánh một phiên bản công cụ kiểm tra cũ hơn phiên bản thật đang có trong kho tại thời điểm ký, khiến người ký khó chắc chắn bằng chứng khớp đúng bản mới nhất.
  file: `_acceptance/release-2-12-0/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **printf với $DOI không bọc nháy — tách từ và mở rộng glob trên tên tệp**
  Người dùng thấy gì: Trong một tình huống lỗi hiếm gặp, dòng thông báo chẩn đoán có thể hiển thị sai định dạng nếu tên đường dẫn có khoảng trắng — không ảnh hưởng tới kết quả đạt/không đạt của việc kiểm tra.
  file: `_acceptance/release-2-12-0/rang-moc.sh`
  severity: low
  Đề xuất: wont-fix

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ

- **Đường dẫn hardcode/không suy từ vị trí script — dấu bản răng đọc `$0` theo cwd người gọi và fail-open thành PASS khi không đọc được**
  file: `_acceptance/release-2-12-0/rang-moc.sh:140`
  severity: medium
  detail: `DAU="$(G hash-object "$0" 2>/dev/null | cut -c1-8)"` (rang-moc.sh:140) và bản sao y hệt ở rang-p200.sh:86 (`git -C "$ROOT" hash-object "$0"`): `$0` là đường dẫn TƯƠNG ĐỐI với cwd của người gọi, nhưng `git -C ROOT` giải nó tương đối với ROOT — trái với header của chính tệp («Gốc kho suy TỪ VỊ TRÍ SCRIPT, bài học P150») và với chú thích «không gõ tay, không trôi». Đã chạy thật: từ ROOT in `rang ban 22a4ff60`; từ `docs/` (`bash ../_acceptance/release-2-12-0/rang-moc.sh --chan diagram`) in `rang ban khong-doc-duoc` và VẪN thoát 0. Hệ quả đo lường: evals.yaml E2 `expected` (dòng 67–69) liệt kê dấu bản răng là MỘT trong «BA đối chứng dương», nhưng răng không đỏ khi đối chứng ấy vắng — đối chứng dương quảng cáo mà không cưỡng chế. Đúng lớp lỗi mà dấu này được thêm để bắt: evidence-report ở HEAD (verified_commit f5ac8ff0) ghim output E2 của bản răng CŨ (câu «giu 2.7.0 BANG so tai moc truoc ef36d81f…» của chân 4 đã bị trừ ở 59955ae8, không có `rang ban …`), tức hai bản răng khác nhau đang cùng được đọc là «E2 PASS»; ở chiến dịch ghim lại nếu cwd khác ROOT thì dấu lại vắng và không ai thấy. Sửa tầng đúng: suy đường dẫn tệp răng từ `$(cd "$(dirname "$0")" && pwd)/$(basename "$0")` (hoặc `hash-object` với đường tuyệt đối) và thoát mã riêng khi DAU rỗng thay vì in `khong-doc-duoc` rồi PASS.
  source: measurement

⚠ Cụm ngoài vùng phủ: 5/7 lỗi rơi vào file không bộ đo nào phủ (_acceptance/release-2-12-0/contract.md, _acceptance/release-2-12-0/evidence-report.md, _acceptance/release-2-12-0/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.