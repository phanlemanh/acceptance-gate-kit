# Review findings — vao-co-o-ra-co-ten (S4 round 1, một reviewer tươi trên diff `7cf25669..HEAD`)

## Trong hợp đồng

- **Chiều đỏ «đổi tên file ra khỏi pattern» của VC8 không chạm vật — là phép lọc mảng trong bộ nhớ**
  file: `tests/plugins/vao-co-o.test.mjs` (VC8) · severity: medium · AC: AC-8(i)
  `slugs.filter(s => s !== 'o-nuot-luat')` chỉ chứng minh `Array.filter` chạy, không đi qua
  `readdirSync` + `SEED_RE` trên cây nào. → **Đã sửa cùng round:** chép `docs/plans` ra tmp,
  `renameSync` file thật `…hat-giong-o-nuot-luat.md` → `…hatgiong-…`, khám phá lại trên bản sao,
  assert tập-con nêu đúng `o-nuot-luat`.
- **Chân ③ «mọi hạt giống có ô» lỏng: xoá 4 stub thật mà phép đo vẫn xanh 3/4**
  file: `tests/plugins/vao-co-o.test.mjs` (hàm `orphans`) · severity: medium · AC: AC-8(i)
  Nhắc tới một thư mục `_acceptance/<lạ>/` đang tồn tại được tính là «có ô». → **Đã sửa cùng
  round:** chân ③ chỉ nhận con trỏ tới thư mục CÙNG slug, hoặc thư mục mà contract/opportunity
  bên trong trích lại chính file hạt giống; fixture thêm ca «trỏ thư mục lạ» → phải là mồ côi.
- **AC-5 hứa mutant phía ĐẦU RA cho khoá considering; P99 chỉ đột biến phía marker**
  file: `tests/plugins/run-tests.sh` (P99) · severity: low · AC: AC-5
  → **Đã sửa cùng round:** bản sao bộ quét gỡ `ageDays` khỏi `considering.push` → P99 đỏ ghim
  «key groups.considering[].ageDays khong co».

## Ngoài hợp đồng — người quyết ở Gate 2

Các điểm dưới đây là thật nhưng nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi — máy KHÔNG sửa
trong round này (luật triage; bài học chip A: mở rộng qua làn V giữa S4 là nguồn vòng xoáy).

- **Nhóm «Đang cân nhắc» chưa có lối bàn giao ở bước 4 của `/start`; `/start <slug>` với slug đang cân nhắc rơi vào khoảng trống**
  Người dùng thấy gì: chọn một ý trên thẻ rồi agent tự chế lối (bước 5 cấm lệnh tự làm nội dung).
  file: `commands/start.md` bước 4 (+ dòng 2 và 48 «ba nhóm» đã lỗi thời) · severity: medium
  Đề xuất: một gạch đầu dòng ở bước 4 «Chọn một ý cân nhắc → lượt kế mở `opportunity.md` của nó,
  điền Ngưỡng; lần quét sau máy tự đưa sang Cổng Đáng»; «ba nhóm» → «bốn nhóm». Rẻ, một lượt.
- **Tuổi của 7 ý kit = 0 ngày dù hạt giống đã 1–9 ngày tuổi**
  Người dùng thấy gì: thẻ nói «cũ nhất 0 ngày» cho ý sinh 13/08 — đúng định nghĩa AC-4 (tuổi
  FILE stub, commit đầu) nhưng sai tiếng sản phẩm (tuổi Ý).
  file: `scripts/start-scan.mjs` (`gitBirth`) · severity: medium
  Đề xuất: known-limit «tuổi tính từ lúc có ô»; vòng sau cân nhắc khoá tuỳ chọn trong frontmatter
  (ví dụ `opened_at`) thắng git birth — cùng khuôn `decided_at` thắng mtime.
- **Stub `duong-do` mang chữ ký Cổng 0 do máy viết, mốc giờ tròn**
  file: `_acceptance/duong-do-trong-dinh-nghia-xong/opportunity.md:8-9` · severity: low
  `decided_by: Manh Phan · decided_at: 2026-08-21T14:00:00Z` — ô đúng (owner gật dây A→B→C 21/08,
  AC-8 ii) nhưng mốc giờ là xấp xỉ theo hội thoại, không phải mốc máy ghi. Owner xác nhận một chạm
  hoặc thay bằng mốc thật.
- **Vị từ «chưa điền» chỉ biết `…`/`...`/rỗng; nhãn in đậm làm ý kẹt im lặng**
  file: `scripts/start-scan.mjs` (`PLACEHOLDER_RE`, `bulletOf`) · severity: low
  `- Timebox: TBD` → tính đã điền → về cổng; `- **Timebox:** 2 tuần` → nhãn lệch → mãi ở cân nhắc.
  Đề xuất: strip `*`/`_` quanh nhãn, thêm `TBD|\?|—|–` vào placeholder. Ngoài hợp đồng (AC-1 định
  nghĩa placeholder là `…`/rỗng).
- **START-HIEU-KET chèn giữa hai bullet của danh sách «mục in lên thẻ» ở bước 3**
  file: `commands/start.md` · severity: low
  Agent render thẻ dễ in nhầm khối nghi thức thành mục thẻ thứ tư. Đề xuất: dời khối vào đầu bullet
  «Bắt đầu việc mới», ngay trước «(a)» — vẫn thoả AC-6(ii).

## Đã kiểm mà thấy đúng (reviewer)

- Bản sao script/khuôn thật sự chạy bản sao (`pluginCopy` + `scan(root, copy.scan)`); copy chết →
  assert đỏ, không xanh giả.
- `section()` + `bulletOf` trên khuôn thật: đúng 4 nhãn; `frontmatterField` lột comment đuôi.
- Cây thật: 6 stub ở `considering`, `duong-do` ở `inProgress S1`, `broken[]` rỗng; `product-map --check` exit 0.
