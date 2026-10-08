---
schema_version: 1
feature: Trang lộ trình mang sẵn một khối dữ liệu máy đọc vẽ cùng lượt — bản chiếu ngoài kho (trang Lộ trình trong CRM, bản chiếu ReUI) hiện đúng trạng thái từng hàng chỉ bằng cách đọc khối, không tự tính trạng thái; không tệp mới, không đổi cấu hình kho
slug: xuat-du-lieu-lo-trinh
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/lo-trinh.mjs + skills/acceptance/references/lo-trinh-du-lieu.md (mới) + GUIDE + CHANGELOG + test — không chạm lib/**, hook, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-08-xuat-du-lieu-lo-trinh-design.md
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-08T08:32:37Z
---

# Acceptance Contract: xuat-du-lieu-lo-trinh

## Context

Cổng Đáng 08/10 ký build hàng X1 (CỘNG, owner phê). Trạng thái lộ trình hôm nay chỉ có trong trang
người đọc `LO-TRINH.html`; bản chiếu nào muốn hiện nó phải chép luật suy của kit. Vòng này nhúng một
khối dữ liệu theo khuôn có phiên bản vào chính trang, sinh từ cùng kết quả phân tích đã vẽ trang, kèm
một bộ đọc mẫu khoan dung và tài liệu cho kho tiêu thụ. Phần người nhìn thấy không đổi. Khuôn và
phương án bị loại: design doc.

## Criteria

- AC-1: Given kho thử khai ba lộ trình (một tệp có hàng kế, cờ, mốc, đã bác, hàng theo lời, hàng có hồ sơ; một tệp hỏng; một tệp hợp lệ 0 hàng) cùng hồ sơ ngoài kế hoạch, When vẽ, Then `LO-TRINH.html` có ĐÚNG một khối `<script type="application/json" id="lo-trinh-du-lieu">`, `JSON.parse` được, `khuon == "lo-trinh-du-lieu"`, `phien_ban == 1`, `nguon` đúng thứ tự khai, và tập khoá của object gốc, mỗi phần tử `lo_trinh`, mỗi `hang`, mỗi `moc`, `hang_ke`, `tien_do` BẰNG đúng danh sách khoá của khuôn trong mã; tệp hỏng có `loi` là câu đã dịch và các mảng rỗng; tệp 0 hàng có đủ khoá, `tien_do` toàn 0, `hang_ke` null; và danh sách khoá khuôn trong mã BẰNG bảng khoá viết sẵn trong ca đo từ design doc (không tự quy chiếu).
- AC-2: Given cùng kho thử và fixture lộ trình OKR của crm, When một bản chiếu tham chiếu chỉ đọc khối dữ liệu và một bộ đọc HTML độc lập đọc bảng/thẻ/mốc của chính trang ấy, Then hai bên khớp 100 %: mỗi hàng (theo mã) cùng chữ trạng thái và cùng nhóm tiến độ, cùng tập hàng (không thừa không thiếu), cùng hàng kế và dòng lệnh mở, cùng số chỗ cần sửa và từng câu, cùng bốn số tiến độ, cùng ngày/tên/việc gắn/cờ «còn việc» của từng mốc, cùng dấu «theo lời» và cùng chữ từng cờ của mỗi hàng, cùng danh sách đã bác (mã + lý do), cùng danh sách hồ sơ ngoài kế hoạch; `ho_so` của mỗi hàng bằng hồ sơ mà kho thử dựng để nhận hàng đó (biết trước từ lúc dựng). Nhóm tiến độ so TỪNG hàng trên ma trận toàn phần mọi chữ trạng thái lớp phân tích phát ra (rút từ mã, kho thử có ít nhất một hàng mỗi trạng thái). Chiều đỏ trên cùng trang: bỏ một hàng khỏi khối · đổi trạng thái một hàng · rút rỗng `ngoai_lo_trinh` · để một cờ chưa dịch · đổi nhóm của một trạng thái → so sánh đỏ, thông điệp nêu mã hàng hoặc khoá.
- AC-3: Given kho thử của AC-1, When gỡ khối dữ liệu khỏi trang, Then phần còn lại giống từng byte trang do bộ vẽ ở commit gốc của vòng (`7e965b54`, `git archive` trọn `scripts lib`) vẽ trên cùng kho thử — người xem không thấy gì khác.
- AC-4: Given kho KHÔNG khai `lo_trinh.tep`, When chạy bộ vẽ bản đồ (ghi và `--check`), Then không có `LO-TRINH.html`, `PRODUCT-MAP.md` giống từng byte bản do bộ vẽ ở commit gốc sinh, và danh sách tệp trong cây giống hệt trước/sau.
- AC-5: Given kho khai lộ trình với miễn trừ T1 phủ `LO-TRINH.html` đích danh (như crm), When vẽ lại sau khi một hồ sơ đổi ô, Then tập tệp đổi trong cây == {`PRODUCT-MAP.md`, `LO-TRINH.html`} (không tệp mới), và `--check` không đòi glob mới.
- AC-6: Given trang đã vẽ, When một hồ sơ đổi ô mà không vẽ lại, hoặc chỉ một byte trong khối dữ liệu bị sửa tay, Then `product-map.mjs --check` thoát 1 với dòng «LO-TRINH.html lệch với tệp ý định và hồ sơ»; trang vẽ lại → `--check` thoát 0.
- AC-7: Given kho thử vẽ hai lần liên tiếp (và lần hai chạy với `TZ` khác), Then hai trang giống từng byte, và khối không chứa chuỗi ngày hôm nay ở dạng `YYYY-MM-DD` nào ngoài ngày mốc khai trong tệp kế hoạch.
- AC-8: Given câu giao/vì sao chứa `</script><script>x()</script>`, `</SCRIPT >`, `</sCrIpT`, `<!--`, `-->`, U+2028, U+2029 và nháy kép, When vẽ, Then văn bản thô của khối không chứa ký tự `<` nào, trang có đúng hai thẻ mở `<script` (đếm không phân biệt hoa thường) (khối dữ liệu + script nội tuyến sẵn có), khối parse ra ĐÚNG chuỗi gốc từng ký tự, và phần hiển thị vẫn thoát chữ như trước.
- AC-9: Given bộ đọc mẫu `docDuLieu`, When đọc năm đầu vào — trang đúng khuôn · trang vẽ bằng kit đời trước (không khối) · khối không phải JSON · `khuon` lạ · `phien_ban` 2 kèm một khoá lạ và thiếu một khoá — Then lần lượt: dữ liệu đủ, 0 cảnh báo · `null` + cảnh báo «trang chưa mang dữ liệu» · `null` + cảnh báo nêu lỗi JSON · `null` + cảnh báo nêu tên khuôn · dữ liệu trả về, khoá thiếu là rỗng theo kiểu, khoá lạ giữ nguyên, đúng một cảnh báo «khuôn mới hơn bộ đọc»; không ca nào ném lỗi.
- AC-10: Given tài liệu cho kho tiêu thụ `skills/acceptance/references/lo-trinh-du-lieu.md`, When rút bảng khoá trong khối marker của nó, Then tập khoá (theo từng cấp) BẰNG danh sách khoá khuôn trong mã; chiều đỏ: bản sao tài liệu bỏ một khoá · bản sao mã thêm một khoá → ca đỏ nêu khoá lệch. GUIDE có một đoạn trỏ tài liệu này.
- AC-12: Given một mốc còn việc chưa giao và script nội tuyến của chính trang chạy với «hôm nay» cố định ở ngày trước mốc · đúng ngày mốc · ngày sau mốc, ở hai múi giờ (UTC và UTC+7), When bản chiếu tham chiếu áp luật so ngày viết trong tài liệu kho tiêu thụ lên khối dữ liệu với cùng «hôm nay», Then tập mốc «đã qua, còn việc chưa giao» và tập hàng trễ hai bên bằng nhau ở cả sáu ca; chiều đỏ: bản sao luật đổi «trước» thành «trước hoặc bằng» → ca đúng-ngày-mốc đỏ, nêu tên mốc.
- AC-11: Given chỉ tài liệu `lo-trinh-du-lieu.md` và hàng `LT1` của crm (chép vào hồ sơ), When một kỹ sư kho tiêu thụ cần dựng trang «Lộ trình» — mỗi hàng trạng thái gì, lọc theo nhóm, việc kế, mốc đã qua còn việc chưa giao — Then tài liệu đủ để làm mà không đọc mã kit, và luật duy nhất bản chiếu phải tự làm là so ngày của mốc. (judgment)

## Coverage

Quét bằng `morphological-scan` (preset test-matrix, đối tượng = khối dữ liệu × kho × bên đọc). Chân sản
phẩm: ba phép thử của ô cơ hội trên crm `onehub` `c803963ef` (85 hàng, 3 lộ trình) + mã `veHtml`
`[SUY-TỪ-REPO: scripts/lo-trinh.mjs]`. Chân ngành: `[NGÀNH: WHATWG HTML — data block «script type
không phải JavaScript»]` cho cách nhúng; `[NGÀNH: Tolerant Reader — Fowler]` cho bộ đọc.

- Trục A — hình dạng kho: không khai | một tệp | nhiều tệp | một tệp hỏng | kế hoạch rỗng hàng  [thước CE: các nhánh của `phanTichKho`/`veHtml`] → AC-1, AC-3, AC-4, AC-2
- Trục B — thứ trang hiện: trạng thái từng hàng | hàng kế + lệnh | chỗ cần sửa | tiến độ | mốc (ngày, việc gắn, còn việc) | đã bác | hồ sơ ngoài kế hoạch  [thước CE: mọi khối của `theDau` + `mucLoTrinh` + `khoiNgoai`] → AC-1, AC-2
- Trục C — bên đọc: lượt vẽ | `--check` ở CI | bộ đọc mẫu đời này | bộ đọc gặp trang đời cũ / khuôn mới hơn / JSON hỏng | lượt chấm (vùng vật) | người xem trang  [thước CE: luật đổi-schema-có-đường-đọc-cũ của CLAUDE.md + phép thử 3 của ô] → AC-3, AC-5, AC-6, AC-9
- Trục D — ca phá: dữ liệu lệch trang | trang cũ so hồ sơ | chữ cắt thẻ trong ý định | phụ thuộc giờ chạy | tài liệu trôi khỏi mã  [thước CE: lớp lỗi «bên viết/bên đọc trôi» của CLAUDE.md; mốc và múi giờ: script nội tuyến của trang] → AC-2, AC-6, AC-7, AC-8, AC-10, AC-12
- Later: tệp riêng `LO-TRINH.json` bật theo kho · lệnh rút khối ra JSON (`--du-lieu`) · khuôn tín hiệu (hàng L3).
- Never: API/máy chủ phục vụ dữ liệu · gộp nhiều kho · kit ghi tệp ý định.

## Đường đo

- Bản chiếu ngoài kho khớp 100 % với trang cùng lượt vẽ · số từ: bản chiếu tham chiếu trong bộ kiểm trên kho thử + fixture crm OKR · AC-2.
- Bản chiếu không chứa luật suy nào ngoài so ngày · số từ: tài liệu kho tiêu thụ đọc bởi hội đồng · AC-11; luật so ngày khớp trang ở mọi «hôm nay» · AC-12.
- Kho không khai lộ trình không thấy tệp nào đổi · số từ: so byte với bộ vẽ ở commit gốc · AC-4.
- Một bản chiếu thật (trang `LT1` của crm) đọc khối trong 21 ngày sau phát hành · số từ: git crm — commit đọc `lo-trinh-du-lieu` · không AC (đếm ở kho tiêu thụ, đọc ở phiên nghiệm thu).

## Out of scope

- Trang «Lộ trình» trong CRM (hàng `LT1` của crm) và bản chiếu ReUI — sống ở kho tiêu thụ.
- Tệp dữ liệu riêng ngoài trang — bắt kho sửa cấu hình; bật thêm theo kho ở vòng sau nếu có kho đòi.
- Lệnh mới hay khoá cấu hình mới; kit ghi tệp ý định; gộp nhiều kho; nhận tín hiệu ngược về (hàng L3).
- Đổi bất cứ thứ gì người xem thấy trên trang.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/lo-trinh.test.mjs` (LT-110…), chạy bằng `config:executors.test.lo_trinh` sẵn có —
  không thêm khoá executor (sửa `_acceptance/config.yaml` làm cũ hồ sơ khác).
- Hàng `LT1` của crm chép nguyên vào `_acceptance/xuat-du-lieu-lo-trinh/lt1-crm.json` từ commit crm
  `66862babd` (nhánh `docs/lo-trinh-cua-xem-cua-gop`, chưa gộp vào `onehub` lúc mở vòng).
- Đính chính số đo 08/10: khối dữ liệu trên trang crm (`onehub` `c803963ef`, 3 lộ trình, 85 hàng)
  nặng ≈ 34 KB (trang 59,5 KB → 93,8 KB), đo bằng chính bộ vẽ của vòng — không phải ≈ 19 KB như số
  ước ở Cổng Đáng (ước trên một phần khoá). Số này không đổi kết luận: khối nằm trong tệp đã ngoài
  vùng soi của lượt chấm.
- Hai trang mẫu của hồ sơ đã ký (`viec-ke-theo-plan/mau/lo-trinh-crm-okr.html`,
  `trang-lo-trinh-doc-mot-phut/mau/hai-lo-trinh.html` + `anh.json`) vẽ lại vì trang có thêm khối; hai
  ảnh chụp lại giống từng byte ảnh cũ (phần nhìn thấy không đổi). Hai hồ sơ đó ghim lại ở chiến dịch
  phát hành mốc mang vòng này.
- **Thay thế một phần thước của hồ sơ đã ký:** ca LT-06 (`viec-ke-theo-plan`) và LT-94
  (`trang-lo-trinh-doc-mot-phut`) đếm script chạy được thay vì mọi thẻ `<script` — khối dữ liệu của
  vòng này không tính, khối thứ hai vẫn tính. Hợp đồng cũ đã ký, không sửa; dòng này là vết thay thế
  (sổ quyết định của hồ sơ này, dòng `fix` ở S3).
