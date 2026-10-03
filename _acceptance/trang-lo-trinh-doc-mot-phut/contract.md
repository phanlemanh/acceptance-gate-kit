---
schema_version: 1
feature: Trang lộ trình đọc trong một phút — màn đầu trả lời làm gì tiếp, kẹt gì, lệch gì; hàng đã giao và hồ sơ ngoài lộ trình gập lại; đọc được trên điện thoại
slug: trang-lo-trinh-doc-mot-phut
owner: phanlemanh@gmail.com
risk_tier: T2               # lớp vẽ của scripts/lo-trinh.mjs + test (tests/scripts/lo-trinh*.mjs) + config executor — không chạm lib/**, hook, lưới trước-merge, lớp phân tích
surfaces: [ui]
design_doc: docs/superpowers/specs/2026-10-03-trang-lo-trinh-doc-mot-phut-design.md
status: draft
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-03T14:53:49Z
---

# Acceptance Contract: trang-lo-trinh-doc-mot-phut

## Context

Trang `LO-TRINH.html` của 2.21.0 đúng dữ liệu nhưng không đọc được trong một phút: trên crm trang
dài 11.587px ở khổ 1440, 55 % là danh sách hồ sơ ngoài lộ trình in hai lần, cờ ở y = 6.834, chữ
máy lọt ra mặt người. Cổng Đáng 03/10 ký build: thay lớp vẽ, giữ lớp phân tích, trang tĩnh tất
định. Thiết kế và bảng dịch câu cờ ở `design_doc`; bản mẫu S1-D qua 30/30 ô đo.

## Criteria

- AC-1: Given kho khai một hoặc nhiều lộ trình, When vẽ, Then trang mở bằng một thẻ mỗi lộ trình theo thứ tự khai, mỗi thẻ có đúng bốn dòng «Làm tiếp» (mã hàng kế là liên kết tới neo của hàng đó trên trang, câu giao, lệnh `/feature-loop:feature-loop <thamSo>` với `<thamSo>` bằng đúng `hangKe.thamSo` của thẻ start) · «Cần sửa trong kế hoạch» (N bằng số cờ của lộ trình, liên kết tới danh sách chỗ lệch; N = 0 thì «Không có chỗ lệch», không liên kết) · «Mốc kế tiếp» · «Tiến độ» (đã giao/đang làm/chưa bắt đầu cộng lại bằng số hàng); tệp hỏng thì thẻ chỉ có câu «Không đọc được kế hoạch <tệp>: …»; kế hoạch không hàng thì «Kế hoạch chưa có việc nào».
- AC-2: Given một lộ trình có cờ, When vẽ, Then mục của lộ trình mở bằng danh sách chỗ lệch có đúng các cờ của lộ trình theo đúng thứ tự (so với `kq.co`, đẳng thức sau khi dịch), mỗi chỗ lệch gắn được một hàng là một liên kết bọc trọn ô tới neo tồn tại của hàng đó, và cờ thẻ start vẫn bằng danh sách cờ gốc của lớp phân tích (ca LT-05-the đọc danh sách chỗ lệch thay khối «Cờ» cũ).
- AC-3: Given một lộ trình có hàng đã giao và hàng chưa giao, When vẽ, Then bảng «Việc còn mở (n)» chứa đúng các hàng chưa thuộc nhóm đã giao, các hàng đã giao nằm trong một `<details>` không mở sẵn có tiêu đề «N việc đã giao», hai bảng cộng lại bằng mọi hàng, mỗi hàng có neo `lt<i>-h-<mã>`, «Cần xong trước» là liên kết tới neo hàng, hàng không hồ sơ ghi «theo ghi chép, chưa có hồ sơ», và một cột không có dữ liệu ở hàng nào của bảng thì không có trong bảng đó (Mã và Trạng thái luôn có).
- AC-4: Given kho có hồ sơ không thuộc lộ trình nào (một hoặc nhiều lộ trình), When vẽ, Then danh sách các hồ sơ đó xuất hiện đúng MỘT lần trên trang, trong một `<details>` không mở sẵn ở cuối trang có tiêu đề «N hồ sơ không thuộc kế hoạch nào», N bằng số hồ sơ không lộ trình nào trỏ tới; không có hồ sơ nào như thế thì khối vắng.
- AC-5: Given một lộ trình có mốc, When vẽ và mở trang trên Chrome với ngày đóng băng, Then dải mốc sắp theo ngày, mốc kế tiếp là mốc đầu tiên có ngày ≥ hôm nay và ô «Mốc kế tiếp» của thẻ ghi tên + ngày + «còn N ngày» (hoặc «hôm nay») của đúng mốc đó, mốc đã qua ghi «đã qua», mốc không gắn việc mang nhãn «chưa gắn việc» và tiêu đề ghi «k/N mốc chưa gắn việc nào»; tắt script thì ô thẻ ghi «Xem dải mốc bên dưới» và dải mốc vẫn có ngày; HTML không chứa ngày vẽ.
- AC-6: Given cùng kho, When vẽ hai lần dưới hai đồng hồ cách nhau ba ngày (tiến trình con chặn `Date`), Then hai trang giống từng byte, và `product-map.mjs --check` vẫn bắt trang bị đổi byte / hồ sơ đổi / trang bị xoá (ca LT-06, LT-06-do xanh).
- AC-7: Given năm trạng thái (hai lộ trình · một lộ trình · tệp hỏng · không chỗ lệch · kế hoạch rỗng) dựng từ fixture crm trong lượt, When đo trên Chrome thật ở 1440×900, 768×1024, 375×812, sáng và tối, Then ở MỌI ô: đáy ba dòng Làm tiếp / Cần sửa / Mốc kế tiếp của mọi thẻ (thẻ lỗi: đáy thẻ) ≤ chiều cao màn · không tràn ngang · ≤ 6 cỡ chữ · cỡ h1 > h2 > h3 · tương phản chữ ≥ 4,5 (chữ lớn ≥ 3) · `summary` và liên kết chỗ lệch cao ≥ 44px; và trang hai lộ trình cao ≤ 3.900px ở 1440.
- AC-8: Given bảng việc, When vẽ, Then mỗi ô `td` mang `data-nhan` bằng đúng tiêu đề cột của nó, và ở 375 mỗi hàng là một khối có nhãn cột đứng trên giá trị (không tràn ngang — đo ở AC-7); When mở trên Chrome ở 1440, Then cuộn qua bảng việc còn mở thì tiêu đề cột vẫn trong khung nhìn, lệnh mở có `user-select: all`, và mở trang tại neo một hàng thì hàng đó có viền nhấn.
- AC-9: Given một kho thử kích MỌI dạng cờ có trong mã lớp phân tích, When vẽ, Then số dạng cờ đếm từ mã bằng số dòng bảng dịch và bằng số dạng kho thử thật sự phát ra, mỗi dạng ra đúng câu đích viết sẵn trong ca đo (không rơi về nguyên văn) và giữ mọi giá trị của cờ gốc (mã, lời khai, ô hồ sơ, slug, hạng), mỗi chỗ lệch trên trang đã dịch (không còn `cau_giao`, `dung_tren`, `lo_trinh_`, `tu_vung`, «tự khai», «tệp khai khác hồ sơ», «đứng trên», «tệp ý định»), và phần chữ của trang ngoài `<code>` và lệnh mở không chứa «tin theo lời», «câu giao», «hàng kế», «Hàng kế», «Vòng ngoài lộ trình», «Cổng Đáng», «tệp ý định», «Cờ».
- AC-10: Given kho không khai lộ trình, When vẽ bản đồ và quét start, Then không có `LO-TRINH.html`, `PRODUCT-MAP.md` và JSON quét giống từng byte bộ vẽ trước vòng, mô-đun lộ trình không được nạp (LT-01, LT-80 xanh); Given kho khai hai lộ trình mà một tệp hỏng, Then chỉ thẻ và mục của tệp đó nêu lỗi, lộ trình kia đủ bốn dòng.
- AC-11: Given trang mẫu trạng thái hai lộ trình (do bộ vẽ sinh từ fixture crm, giữ bằng từng byte bản vẽ lại trong lượt) và ảnh màn đầu của nó ở 1440 và 375 (sáng), When hội đồng đọc ảnh, Then trả lời được trong một phút ba câu: lộ trình nào làm gì tiếp, kẹt gì, lệch bao nhiêu chỗ — và không gặp chữ phải hỏi nghĩa. (judgment)
- AC-12: Given fixture crm hai lộ trình kèm hồ sơ sinh trong lượt, When chạy lớp phân tích (`phanTichKho`) và bộ quét start ở bộ máy của mốc 2.21.0 (`git archive v2.21.0 scripts lib`, trọn thư mục) và ở cây đang kiểm, Then hai kết quả bằng nhau toàn phần (hàng, trạng thái, cờ theo thứ tự, hàng kế, `loTrinh` của JSON quét) — lớp vẽ đổi, lớp phân tích không đổi.

## Coverage

Quét bằng `morphological-scan` (preset entity-feature, thực thể = trang lộ trình × người đọc ×
khổ). Chân sản phẩm: audit 03/10 trên trang crm thật (số ở `opportunity.md`). Chân ngành: sàn
`ux-ui-craft` (tương phản, điểm chạm, ngân sách cỡ chữ, 375/768/1440, trạng thái rỗng/lỗi).

- Trục A — số lộ trình: một | nhiều | một tệp hỏng | kế hoạch rỗng  [thước CE: crm có hai lộ trình khai] → AC-1, AC-7, AC-10
- Trục B — câu hỏi người đọc: làm gì tiếp | kẹt gì (mốc) | lệch gì (chỗ lệch) | đã xong bao nhiêu  [thước CE: ba câu ở ngưỡng Cổng Đáng] → AC-1, AC-2, AC-5, AC-11
- Trục C — khối lượng: hàng đã giao | hồ sơ ngoài kế hoạch | cột rỗng | mốc không gắn việc  [thước CE: 28/43 đã giao, 132 hồ sơ ×2, cột Vì sao 43/43 rỗng, 11/16 mốc] → AC-3, AC-4, AC-5
- Trục D — khổ × màu: 1440 | 768 | 375 × sáng | tối  [thước CE: audit 375 cột câu giao 95px] → AC-7, AC-8
- Trục E — chữ: chrome trang | câu cờ | lỗi đọc tệp  [thước CE: đếm dạng cờ trong mã] → AC-9
- Trục F — tất định & kho không khai & lớp phân tích không đổi  [thước CE: LT-06, LT-01, LT-80, so với 2.21.0] → AC-6, AC-10, AC-12
- Later: bản chiếu artifact sống · thẻ start nói tiếng sản phẩm · tự gắn mốc với việc.
- Never: trang cần script mới đọc được · ghi ngày vẽ vào trang.

## Đường đo

- Màn đầu có hàng kế, số chỗ lệch, mốc gần nhất ở 1440 và 375 · số từ: `tests/scripts/lo-trinh-do-trang.mjs` trên năm trạng thái dựng trong lượt · AC-1, AC-5, AC-7.
- Trang ≤ 1/3 độ dài cũ (≤ 3.900px ở 1440) · số từ: cùng phép đo, trạng thái hai lộ trình từ fixture crm · AC-7; trên crm thật đọc ở phiên nghiệm thu.
- 0 lỗi đo được (tương phản, điểm chạm, tiêu đề, tràn, cỡ chữ) · số từ: cùng phép đo, ô xấu nhất · AC-7, AC-8.
- Kho không khai giữ từng byte · số từ: LT-80, LT-01 · AC-10.
- Câu hỏi «màn đầu trả lời được ba câu» · số từ: hội đồng đọc ảnh · AC-11.

## Out of scope

- Không đổi lớp phân tích (`phanTichKho`, `suyTrangThai`), thẻ start, `--hang`, `--mo-o`.
- Không bản chiếu artifact sống, không publish artifact vòng này.
- Không đổi khuôn tệp kế hoạch; không tự gắn mốc với việc.
- Thẻ start giữ câu cờ gốc.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- **Thay thế một phần hợp đồng đã ký** (hai hồ sơ cũ không sửa; con trỏ này là vết thay thế, hai hồ
  sơ ghim lại trong cùng PR; lời hứa thay thế đo ở AC-12):
  `_acceptance/lo-trinh-tren-du-lieu-that/contract.md` AC-8 vế «`LO-TRINH.html` giống từng byte bản
  trước vòng» và AC-4 vế «hồ sơ không ghi trường cho trang giống từng byte» → đọc là «kết quả lớp
  phân tích giống hệt», vì lớp vẽ đổi chủ ý ở vòng này;
  `_acceptance/viec-ke-theo-plan/contract.md` các vế đọc chữ trang cũ (khối «Cờ», «tự khai: …»,
  «Vòng ngoài lộ trình», «Hàng sống qua Cổng Đáng», trang mẫu cho hội đồng) → đọc chữ và khối
  tương ứng của trang mới (bảng dịch ở `design_doc`).
- Ca đo: `tests/scripts/lo-trinh.test.mjs` (LT-90…, cùng tệp) và
  `tests/scripts/lo-trinh-trang.test.mjs` (đo Chrome, LTT-*); đo Chrome cần Chrome trên máy chạy —
  thiếu thì ca ĐỎ nêu tên, không bỏ qua (CI ubuntu có sẵn Chrome).
- Lệnh đọc trên crm thật (phiên nghiệm thu, không ghi vào crm):
  `node scripts/product-map.mjs --root <bản sao crm> && node tests/scripts/lo-trinh-do-trang.mjs <bản sao crm>/LO-TRINH.html`.
