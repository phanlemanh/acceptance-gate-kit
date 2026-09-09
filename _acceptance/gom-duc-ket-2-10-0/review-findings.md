## Trong hợp đồng

### staleScope fail-open: executor comment/quote không bị cắt nên eval máy thiếu `paths` lọt qua lưới fail-safe
- file: `lib/evidence-core.cjs:680`
- severity: high
- AC: AC-6
- detail: `staleScope()` gọi `parseEvals(evalsText, ['executor'], s => String(s).trim())` — normalize KHÔNG cắt chú thích, trong khi chính file `lib/eval-yaml.cjs` vừa dựng `stripComment()` làm «MỘT nguồn cho mọi bộ đọc dòng». Hệ quả: một eval viết `executor: test  # chay jest` cho `e.executor === 'test  # chay jest'`, không nằm trong `STALE_SCOPE_EXECUTORS`, nên vòng lặp `continue` — vừa KHÔNG bị đòi khai `paths`, vừa KHÔNG góp `paths` của nó vào phạm vi.

  Chạy thật trên cây này:
  ```
  evals:
    - id: E1
      executor: test  # chay jest      # <- KHÔNG khai paths
    - id: E2
      executor: script
      paths: [lib/b.js]
  ```
  → `staleScope(y)` trả `["lib/b.js"]` (không phải `null`). Bỏ chú thích đi thì trả đúng `null`.

  Đây đúng là đường fail-open mà comment ngay trên hàm tuyên bố không có («Fail-safe VỀ PHÍA CHẶT … Không có đường fail-open nào ở đây», và cùng câu ở `scripts/pre-merge-check.sh:507`). Đường tác hại đầy đủ: `pre-merge-check.sh` gọi `node lib/evidence-core.cjs stale-scope` → nhận phạm vi hẹp → `stale_files()` chỉ báo file khớp ∪paths → code E1 phủ đổi sau verify mà CI vẫn xanh, hồ sơ «tươi giả» đi qua Gate 2. Cùng lỗi với `executor: "test" # x` (regex `^["']|["']$` không bóc được quote khi còn đuôi chú thích).

  Sửa: dùng `yaml.stripComment` (hoặc `fieldVal` của lop-nhin-thay) làm normalize, và/hoặc coi executor KHÔNG nhận diện được là ca fail-closed (`return null`) thay vì `continue`.
- rationale: AC-6(e) chỉ định nghĩa staleScope qua hai dạng viết `paths:` (mảng/list), không kiểm fixture executor có chú thích trailing; AC-2(c) liệt kê rõ ba bộ đọc phải dùng stripComment và evidence-core.cjs KHÔNG nằm trong ba bộ đọc đó — không đủ căn cứ suy diễn AC bao trùm bug này (nhưng bug vẫn nằm đúng trong hành vi mà AC-6 mô tả nên xếp trong hợp đồng).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hình dạng 1+3 — NO4 đo VĂN BẢN NGUỒN của ca kiểm, không đo đầu ra của html()**
  Người dùng thấy gì: Bài kiểm tra xác nhận việc loại bỏ ký tự màu khỏi văn bản hiển thị chỉ soi chữ trong mã nguồn chứ không chạy thử thật — một lỗi thật trong việc loại bỏ ký tự màu có thể không bị phát hiện.
  file: `tests/scripts/lnt-no.test.mjs`
  severity: medium
  Tác hại: measure
  Đề xuất: known-limits

- **Hình dạng 4 — «chiều đỏ của phép quét» ở PV5 là mệnh đề luôn đúng, không assertion nào sống**
  Người dùng thấy gì: Một phép kiểm tra dùng để xác nhận công cụ quét phân biệt được bản sao đã gỡ bớt phần kiểm tra được viết theo cách luôn tự cho kết quả đúng, nên nếu công cụ quét hoạt động sai cũng không bị phát hiện.
  file: `tests/scripts/w6-w8-pham-vi.test.mjs`
  severity: medium
  Tác hại: measure
  Đề xuất: known-limits

- **Hình dạng 4 (ghim SAI thông điệp) — `expected` của E8b nêu bộ số mâu thuẫn với ngưỡng răng thật sự kiểm**
  Người dùng thấy gì: Phần ghi chú mô tả kết quả mong đợi trong hồ sơ đánh giá ghi sai vài con số so với ngưỡng thật đang được dùng để chấm — người đọc bằng chứng có thể hiểu nhầm ngưỡng áp dụng, dù kết quả chấm cuối cùng vẫn đúng.
  file: `_acceptance/gom-duc-ket-2-10-0/evals.yaml`
  severity: medium
  Tác hại: measure
  Đề xuất: known-limits

- **Hình dạng 3 — S5D2 tuyên «một nguồn» nhưng bên đọc thứ hai hardcode sẵn đúng bốn giá trị cần tìm**
  Người dùng thấy gì: Bài kiểm tra xác nhận danh sách giá trị cấu hình khớp tài liệu chỉ phát hiện được trường hợp thiếu giá trị, không phát hiện được trường hợp thừa hoặc sai giá trị — nên sau này tài liệu và mã có thể lệch nhau mà không có cảnh báo.
  file: `tests/scripts/s5-ship-default.test.mjs`
  severity: low
  Tác hại: measure
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
