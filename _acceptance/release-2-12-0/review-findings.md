## Trong hợp đồng

- **Manifest feature-loop v2.12.0 khai «No behaviour change in the loop itself» trong khi repin-lane.mjs và SKILL.md đổi trong cửa sổ — lời khai mặt người dùng trái với chính bảng vòng của hợp đồng**
  file: `feature-loop/.claude-plugin/plugin.json:4`
  severity: medium
  AC: AC-1
  source: conventions
  detail: Mục v2.12.0 của description viết: «No behaviour change in the loop itself; the number moves with acceptance-gate because…». Đo tại HEAD: `git diff --stat 45e5f1d8..HEAD -- feature-loop/` cho `scripts/repin-lane.mjs +127` và `skills/feature-loop/SKILL.md +29` (commit eb7e400b «lớp acceptance-gate cũ dừng exit 2 có tên thay vì TypeError», 907347e5 «pin khai ra ô không đo ở dòng log và dòng sha», 7b9c0daa). Chính contract.md của mốc (bảng vòng ở Context) liệt kê hai vòng giao hành vi mới cho làn ghim lại của feature-loop: `ghim-lai-tren-lop-cu` («làn ghim lại gặp lớp acceptance-gate cũ thì dừng CÓ TÊN thay vì TypeError thô») và `lan-doc-status-not-run` («làn ghim lại và bên đọc pin cùng đọc status: not-run từ MỘT nguồn»). Hai mục v2.10.0/v2.11.0 ngay trước đều theo khuôn «In this package: …» kể đúng hành vi đổi. P200 chỉ kiểm mục v<số> CÓ MẶT và câu khai cặp `acceptance-gate >= V`, nên lời khai sai này đi qua cổng — đúng lớp «lời khai không đối chiếu được» mà hồ sơ mốc tự ghi là bài học lượt 4 (d-18 từng sửa manifest acceptance-gate vì lý do y hệt). Sửa: kể hai hành vi đổi của làn ghim lại thay cho câu «No behaviour change».
  rationale: AC-1 Then đòi hỏi tường minh «mục mô tả của chính số đó nói người dùng nhận gì» đúng sự thật, và finding chứng minh mô tả này sai so với hai hành vi đổi thật trong cửa sổ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Đo checkout khác cây đang kiểm (hình dạng 6): bằng chứng E1/E2 ghi dấu bản răng KHÔNG phải bản răng tại HEAD**
  Người dùng thấy gì: Báo cáo bằng chứng dùng để ký duyệt phát hành có dấu hiệu được tạo ra từ một phiên bản kiểm tra cũ hơn phiên bản thực tế đang có trong bản phát hành, nên chưa chắc phản ánh đúng những gì sắp được phát hành.
  file: `_acceptance/release-2-12-0/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **evidence-report.md tại HEAD là bằng chứng của bản răng CŨ: dấu bản răng ghim 22a4ff60/ed45b215, răng tại HEAD hash 47ef1d63/70c62172; verified_commit lùi 1 commit, triage_failed còn true, verdict PENDING-JUDGMENT — pre-merge miễn staleness cho _acceptance/* nên không máy nào bắt**
  Người dùng thấy gì: Báo cáo bằng chứng đính kèm quyết định phê duyệt có thể mô tả một phiên bản kiểm tra cũ hơn bản đang chạy thật, khiến người ký duyệt dựa trên thông tin không phản ánh đúng trạng thái hiện tại của bản phát hành.
  file: `_acceptance/release-2-12-0/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **decisions.jsonl dùng `type: record` (3 dòng) ngoài schema sổ quyết định của SKILL — gate-card đếm mọi dòng không-phải-seal là quyết định phải phê, nên ba dòng ghi-chép lọt vào «phê hết quyết định ghi sau Cổng Phạm vi»**
  Người dùng thấy gì: Thẻ quyết định ở cổng phê duyệt có thể hiển thị thêm vài mục ghi chú nội bộ như thể chúng là quyết định cần người xem xét, làm danh sách cần đọc dài hơn thực tế cần thiết.
  file: `_acceptance/release-2-12-0/decisions.jsonl`
  severity: low
  Đề xuất: known-limits

- **Hồ sơ bàn giao còn ghi «130 commit» tại 3f492e2e — con số mà contract.md của cùng mốc đã bác tường minh (đúng là 134 tại cùng sha)**
  Người dùng thấy gì: Tài liệu bàn giao ghi sai một con số thống kê (số lượng thay đổi) so với số đúng đã được xác nhận ở nơi khác, có thể gây hiểu nhầm nhẹ cho người đọc sau này.
  file: `docs/handoff/2026-09-14-handoff-doi-tai-khoan-release-2-12-0.md`
  severity: low
  Đề xuất: known-limits

- **Hai răng phân loại cùng một thất bại hạ tầng (không hash được chính tệp răng) vào hai mã khác nhau và bảng mã ở header không liệt kê lối đó**
  Người dùng thấy gì: Hai công cụ kiểm tra tự động báo cùng một loại sự cố hạ tầng nhưng bằng hai tín hiệu khác nhau, khiến người theo dõi khó nhận ra đó là cùng một vấn đề khi so sánh kết quả giữa hai công cụ.
  file: `_acceptance/release-2-12-0/rang-p200.sh`
  severity: low
  Đề xuất: known-limits

- **rang-p200.sh xếp «không đọc được dấu bản răng» vào mã 2 «chưa từng chạy» — sai lớp so với chính bảng mã của tệp**
  Người dùng thấy gì: Khi công cụ kiểm tra gặp sự cố đọc dữ liệu nội bộ của chính nó, nó báo nhầm thành 'chưa từng kiểm tra' dù thực tế bài kiểm tra đã chạy xong và đạt — có thể khiến người đọc kết quả hiểu nhầm rằng phép kiểm chưa được thực hiện.
  file: `_acceptance/release-2-12-0/rang-p200.sh`
  severity: low
  Đề xuất: known-limits

- **evidence-report.md Round 4 vẫn trỏ nhát cắt scan() vào «ngả 5» dù d-29 đã dời sang ngả 7 và commit HEAD khai đã sửa hết con trỏ**
  Người dùng thấy gì: Một tài liệu bằng chứng còn ghi vị trí xử lý cũ cho một mục đã được owner dời sang chỗ khác, dù commit liên quan tuyên bố đã sửa hết — người đọc tài liệu này có thể bị dẫn sai hướng.
  file: `_acceptance/release-2-12-0/evidence-report.md`
  severity: low
  Đề xuất: known-limits

- **Khuôn seam viết→đọc chép tay, không marker/round-trip (hình dạng 2): rang-p200.sh ghim literal thông điệp của suite**
  Người dùng thấy gì: Một phần cơ chế kiểm tra tự động dựa vào so khớp đúng nguyên văn một thông điệp nội bộ; nếu thông điệp đó đổi chữ trong tương lai, phép kiểm vẫn báo đỏ khi có lỗi thật (không bỏ sót) nhưng có thể ghi nhầm loại nguyên nhân, gây khó khăn nhẹ khi chẩn đoán kết quả.
  file: `_acceptance/release-2-12-0/rang-p200.sh`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 5/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/release-2-12-0/evidence-report.md, _acceptance/release-2-12-0/decisions.jsonl, docs/handoff/2026-09-14-handoff-doi-tai-khoan-release-2-12-0.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.