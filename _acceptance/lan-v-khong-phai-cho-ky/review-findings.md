# Review Findings: lan-v-khong-phai-cho-ky (round 1)

## Trong hợp đồng

- **Assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ — vế đếm ô mermaid của AC-2 không được đo ở đâu cả**
  AC: AC-2
  file: `_acceptance/lan-v-khong-phai-cho-ky/evals.yaml:29`
  severity: high
  detail: E2 (AC-2) khai expected: «… KHÔNG dưới '## Đang làm', ô mermaid 'Đã giao' tăng 1 so với fixture không có slug», và nói rõ vế đó do LV1 kiểm. LV1 (tests/plugins/lan-v.test.mjs:88–100) chỉ assert bốn thứ: `s.gates.has()`, `s.done.get() === 'lan-v-mo'`, `m.section === 'Đã giao'`, `m.note`. Hàm `mapOf()` (dòng 72–81) chỉ trả `{section, line, note}` — nó dừng ở dòng `- ` đầu tiên chứa slug và KHÔNG bao giờ đọc khối mermaid. `grep -n 'mermaid|DG\[|tăng|count'` trên cả lan-v.test.mjs lẫn rang.sh trả 0 dòng. Tức là lời hứa dạng QUAN HỆ («số đếm ô Đã giao với slug = số đếm không có slug + 1», product-map.mjs:65 `n('da-ship')`) bị thay bằng phép kiểm «có dòng chứa slug dưới heading đúng». Hệ quả cụ thể: renderer sinh dòng đúng nhưng đếm `n('da-ship')` sai (ví dụ ô mermaid đếm theo một map khác, hoặc `note` được gắn mà key vẫn là 'dang-dung' trong bộ đếm) thì LV1 vẫn in `PASS: LV1`, răng chân `cases` vẫn OK, và giám khảo S4 đọc E2 sẽ kết luận vế mermaid ĐÃ được chứng minh.
  source: measurement

- **Assertion âm-tính: chiều đỏ khai ở E1 (AC-1) không tồn tại — đột biến chỉ chạm bộ đọc BẢN ĐỒ, không chạm nhánh máy quét**
  AC: AC-1
  file: `_acceptance/lan-v-khong-phai-cho-ky/evals.yaml:12`
  severity: medium
  detail: E1 gắn với AC-1 (nhánh máy quét: `groups.done` state `lan-v-mo`, không nằm trong `groups.gates`) và khai chiều đỏ: «… → dòng 'FAIL: LV1 …' + thông điệp ghim 'V-mo PASS T2 van nam trong gates'». Đột biến duy nhất mà chân mutant tiêm cho LV1 (rang.sh:64, `s/if (status === 'verified' && lanVMo(/if (false && lanVMo(/`) chỉ gỡ nhánh trong `classify()` của scripts/product-map.mjs:202-203 — nhánh máy quét `else if (lanVMo(cTxt, ev.verdict, ev.signoff)) done.push({slug, state:'lan-v-mo'})` ở scripts/start-scan.mjs KHÔNG bị tiêm. Chạy lại đúng cú tiêm đó trên bản sao cho kết quả `FAIL: LV1 ban do van xep Đang làm · ban do thieu chu thich "cửa veto mở"` — chuỗi 'van nam trong gates' KHÔNG BAO GIỜ xuất hiện. Răng che được điều này vì nó ghim bằng alternation `grep -qE 'van nam trong gates|ban do van xep'` (rang.sh:68), nên vế thứ nhất của alternation là mã chết. AC-1 (vế máy quét) được trình như «có chiều đỏ chạy thật trong cùng lượt» trong khi không đột biến nào giết nhánh đó.
  source: measurement

- **Đo CHỈ DẪN thay vì ĐẦU RA — và grep còn không ghim đúng câu mà AC-10 hứa**
  AC: AC-10
  file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh:170`
  severity: low
  detail: AC-10 hứa: «thân lệnh commands/start.md nêu trạng thái lan-v-mo VÀ cách đếm ‹trong đó N làn V, cửa veto mở› ở dòng cuối thẻ». Chân ban-do chỉ có hai lệnh: `grep -qF 'lan-v-mo'` (dòng 170) và `grep -qF 'làn V'` (dòng 171). Hai chuỗi này nằm CÙNG một dòng của commands/start.md (dòng 89: «Phần tử có `state: lan-v-mo` là hồ sơ đi **làn V**»), nên xoá trọn câu khai cách đếm ở dòng 92 («dòng đếm gộp nói thêm ‹trong đó N làn V, cửa veto mở›») vẫn để răng XANH — vế thứ hai của AC-10 hoàn toàn không có assert. Known-limit trong Notes chỉ miễn trừ việc đo hành vi render, không miễn trừ việc kiểm đúng nội dung chỉ dẫn.
  source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **lanVMo bỏ 4/6 điều kiện xanh-sạch — hai bộ đọc mặt người xếp «đã giao» hồ sơ mà lưới trước-merge còn đòi chữ ký**
  Người dùng thấy gì: Một hồ sơ chưa thực sự sạch — còn phần chưa chắc chắn, có bước kiểm bị bỏ qua, hoặc còn ghi hạn chế chưa nêu rõ — vẫn có thể hiển thị trên màn vào phiên và bảng theo dõi là 'đã giao, không cần ai ký', trong khi bước kiểm gộp mã cuối cùng vẫn giữ lại và chặn nó. Người có thể bỏ lỡ đúng lúc cần xem xét hồ sơ đó.
  file: `scripts/product-map.mjs`
  severity: high
  Đề xuất: new-contract

- **lan-v.test.mjs xanh im lặng khi bộ lọc LV_CASES không khớp ca nào (0-ca-thường-trực)**
  Người dùng thấy gì: Nếu sau này có người đổi tên một ca kiểm tự động, bộ đếm 'đã kiểm xong' vẫn có thể báo đủ và xanh dù thực chất không có gì được kiểm cả — lỗ hổng chỉ lộ ra khi có người sửa nhầm.
  file: `tests/plugins/lan-v.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **evals.yaml còn nói «LV1–LV6 / 6 dòng run» trong khi E12 và contract chốt 7 — đúng mâu thuẫn số ca mà gap-probe P1 khai là đã sửa**
  Người dùng thấy gì: Tài liệu nội bộ ghi sai số lượng ca kiểm (nói 6 trong khi thực có 7) — không ảnh hưởng hoạt động thật, nhưng có thể khiến người đọc sau này hiểu nhầm phạm vi đã kiểm.
  file: `_acceptance/lan-v-khong-phai-cho-ky/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **lanVMo checks only 2 of the 6 clean conditions — a non-clean V dossier is reported as delivered and its Evidence Gate silently disappears**
  Người dùng thấy gì: Một hồ sơ chưa đạt đủ điều kiện sạch — ví dụ còn mục chưa chắc chắn, có phần bị bỏ qua kiểm tra, hoặc còn ghi hạn chế — vẫn có thể được báo là 'đã giao, không cần ký' trên bảng theo dõi và màn vào phiên, dù bước kiểm cuối trước khi gộp mã vẫn giữ lại nó.
  file: `scripts/product-map.mjs`
  severity: high
  Đề xuất: new-contract

- **Opposite direction: a six-condition-clean dossier without veto_state is still listed as 'Chờ chữ ký của anh'**
  Người dùng thấy gì: Một hồ sơ đã đạt đủ điều kiện sạch (không cần ai ký) nhưng chưa mở cửa cho phép người can thiệp lại có thể vẫn hiện trên màn vào phiên như đang 'chờ anh ký' — người có thể mất công xem lại một hồ sơ vốn không cần xem.
  file: `scripts/product-map.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bucket now changes at a machine-only transition (implemented→verified) and nothing on the V lane regenerates PRODUCT-MAP.md, so product-map --check goes red in CI**
  Người dùng thấy gì: Sau khi một hồ sơ đi qua mà không cần chữ ký, bảng theo dõi tổng thể có thể không tự cập nhật theo — nếu không có người nhớ vẽ lại bảng bằng tay, bước kiểm tự động trước khi gộp mã có thể báo lỗi sai cho các hồ sơ sau này.
  file: `scripts/product-map.mjs`
  severity: medium
  Đề xuất: known-limits

- **Fixture VIẾT TAY đúng khuôn bên đọc — evidence-report.md không round-trip từ khuôn writer (trong khi contract.md thì có)**
  Người dùng thấy gì: Các phép kiểm tự động cho tính năng này dùng dữ liệu mẫu được viết tay thay vì sinh ra từ đúng khuôn thật mà hệ thống dùng để ghi kết quả — nếu khuôn ghi kết quả thay đổi định dạng sau này, các phép kiểm này có thể vẫn báo 'đạt' dù tính năng thực đã hỏng.
  file: `tests/plugins/lan-v.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/10 lỗi rơi vào file không bộ đo nào phủ (_acceptance/lan-v-khong-phai-cho-ky/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
