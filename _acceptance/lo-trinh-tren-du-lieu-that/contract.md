---
schema_version: 1
feature: Lộ trình chạy được trên dữ liệu thật của crm — so lời khai theo nhóm, hàng tự khai đã giao mà không hồ sơ bị nêu tên và không thành hàng kế, nối hai chiều hàng ↔ hồ sơ qua lo_trinh_ma, nhiều lộ trình mỗi kho, mở việc từ hàng qua Cổng Đáng, thẻ start luôn có đường mở trang
slug: lo-trinh-tren-du-lieu-that
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/{lo-trinh.mjs, lo-trinh-khoa.cjs, product-map.mjs, start-scan.mjs} + commands/start.md + SKILL feature-loop + GUIDE + test — không chạm lib/**, hook, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-03-lo-trinh-tren-du-lieu-that-design.md
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-03T02:12:51Z
---

# Acceptance Contract: lo-trinh-tren-du-lieu-that

## Context

Lát 1 (`viec-ke-theo-plan`, gộp `be391f5b`) chạy thử trên 156 hồ sơ thật của crm: hàng kế là một
hàng đã giao (slug khai sai, máy im), 11/18 cờ là nhiễu vì kit so lời khai đúng từng chữ tên ô, và
khảo sát hành trình người dùng còn năm chỗ chưa phủ. Cổng Đáng 03/10 ký build năm hạng mục; vòng
này sửa tại chỗ, không thêm lệnh, không ghi tệp ý định.

## Criteria

- AC-1: Given một hàng có hồ sơ và lời khai quy đổi được (trực tiếp hoặc qua `tu_vung`), When vẽ, Then cờ «tệp khai khác hồ sơ» bật khi và chỉ khi NHÓM của lời khai khác NHÓM của ô hồ sơ — ba nhóm đã giao (`cho-nghiem-thu`, `da-ship`, `da-nghiem-thu`) · đang làm (`cho-duyet`, `dang-dung`) · chưa làm («Chưa mở», `can-nhac`, `sap-mo`), mọi ô khác là nhóm riêng — trên ma trận toàn phần mọi cặp (tên lời khai × ô hồ sơ) dựng từ `SECTIONS`, và cờ vẫn nêu cả chữ khai lẫn chữ hồ sơ.
- AC-2: Given một hàng có `slug` mà thư mục hồ sơ không tồn tại, When lời khai quy đổi về nhóm đã giao hoặc đang làm, và không hồ sơ nào nhận hàng qua `lo_trinh_ma`, Then trạng thái là «Không suy được», có đúng một cờ «hàng <mã>: tự khai <khai> mà không có hồ sơ <slug>», hàng đó không là hàng kế, và hàng đứng trên nó không đủ điều kiện; When lời khai thuộc nhóm chưa làm hoặc không khai, Then trạng thái «Chưa mở», không cờ.
- AC-3: Given fixture lộ trình OKR của crm kèm bảng ô hồ sơ của nó, When vẽ, Then hàng kế KHÔNG phải hàng «1» và là một hàng mà cả lời khai lẫn hồ sơ đều thuộc nhóm chưa làm, và thành phần danh sách cờ khớp đúng các con số ghi ở `opportunity.md` TRƯỚC khi có mã (4 thiếu câu giao · 1 mã trùng · đúng hai cờ lệch nhóm, ở hàng 9c và D) cộng đúng một cờ cho hàng «1» tự khai đã giao mà không có hồ sơ — tổng 8, so theo từng loại, không phép chứa.
- AC-4: Given các hồ sơ có ô cơ hội mang `lo_trinh_ma` (và tuỳ chọn `lo_trinh_tep`), When vẽ, Then mỗi ca trong bảng nối hai chiều của design §2 cho đúng trạng thái hàng và đúng một cờ đã định (hàng không slug một người nhận lấy trạng thái hồ sơ và thôi tin theo lời · nhiều người nhận · hồ sơ ghi mã khác · hồ sơ khác nhận hàng trỏ slug S có hồ sơ · hồ sơ khác nhận hàng trỏ slug S vắng · mã không có hàng · tệp không khai), ca gộp «slug S vắng + tự khai đã giao + hồ sơ C nhận» cho trạng thái từ C và ĐÚNG MỘT cờ (cờ liên kết, không kèm cờ của AC-2), `--mo-o` trên cùng kho trả `{"hoSo":"C","moi":false}`, và hồ sơ không ghi trường cho trang giống từng byte như khi trường chưa tồn tại.
- AC-5: Given một hàng chưa có hồ sơ, When chạy `lo-trinh.mjs --hang <ref> --mo-o`, Then `_acceptance/<slug>/opportunity.md` được ghi với frontmatter dựng từ khối `OPP-FRONTMATTER-TEMPLATE` (`stage: discovery`, `decision` trống, `feature` = câu giao, cộng `lo_trinh_ma`/`lo_trinh_tep`), ngưỡng SỐNG mang tiền tố của khối `OPP-DE-XUAT-PREFIX` + `bat_khi` khi hàng có `bat_khi` và Timebox mang tiền tố + ngày mốc khi hàng gắn một mốc có ngày, bộ quét start xếp ô đó vào chờ Cổng Đáng (có cả hai) hoặc đang cân nhắc (thiếu một), bộ vẽ coi hàng đó đã có hồ sơ, và băm tệp ý định trước = sau.
- AC-6: Given hàng đã có hồ sơ, thư mục đích đã có, hoặc hàng không slug và không truyền `--slug`, When chạy `--mo-o`, Then lần lượt: in `{"hoSo":"<slug>","moi":false}` thoát 0 không ghi gì · thoát 2 nêu thư mục, không ghi · slug suy tất định từ câu giao (bỏ dấu, sáu từ đầu) được in lại và tệp ghi vào đúng thư mục đó — cây `_acceptance/` giống từng byte trước và sau ở hai ca đầu.
- AC-7: Given SKILL feature-loop, When chạy NGUYÊN VĂN khối lệnh `S0-MO-O` (thay `<mã>`, gốc gói như harness thay) trên kho thử sinh trong lượt với năm ca — mã một tệp · mã ở hai tệp · hàng đã có hồ sơ · hàng không slug · mã không tồn tại — Then mã thoát và đầu ra lần lượt là 0 + `moi:true` · 3 + cây `_acceptance/` giữ từng byte · 0 + `moi:false` · 0 + slug suy từ câu giao · 1; bảng `S0-MO-O-THOAT` của SKILL ánh xạ đúng 0 → theo `moi` (true: thẻ Cổng Đáng rồi dừng · false: resume), 1 → mô tả việc, 2 và 3 → in nguyên rồi dừng; và mẫu đối số S0 nhận `<mã>` và `<tệp>:<mã>`, từ chối mọi chuỗi có khoảng trắng, nháy, backtick, `$`, ngoặc.
- AC-8: Given `lo_trinh.tep` khai bằng chuỗi, danh sách khối, danh sách dòng, hoặc có tệp lặp, When đọc khoá, Then ba dạng cho cùng danh sách tệp theo thứ tự khai, tệp lặp gộp kèm cờ «khai hai lần», một khoá `tep` thụt hai dấu cách ở khối khác của config không bị đọc nhầm, và kho khai một tệp mà không dùng điều mới nào của vòng (lời khai cùng chữ với hồ sơ, mọi mốc gắn hàng, không hồ sơ ghi `lo_trinh_ma`) có `LO-TRINH.html` giống từng byte bản trước vòng (bộ vẽ lấy từ commit gốc của vòng, cùng kho thử).
- AC-9: Given kho khai hai lộ trình, When vẽ và quét, Then trang có một mục mỗi lộ trình theo thứ tự khai, mỗi mục có hàng kế và cờ riêng; tệp hỏng chỉ tắt mục của nó; `loTrinh.ds` có hai phần tử; `--hang <mã>` có ở hai tệp thoát 3 nêu cả hai tệp, `--hang <tệp>:<mã>` trả đúng hàng của tệp đó; `hangKe.thamSo` là `<tệp>:<mã>`.
- AC-10: Given kho khai lộ trình, When quét start, Then `loTrinh.dong` là các dòng thẻ máy dựng sẵn: ba dòng cũ mỗi lộ trình, luôn một dòng trang — liên kết markdown tới đường tuyệt đối của `LO-TRINH.html` khi tệp có, câu «chưa được vẽ» kèm lệnh vẽ khi vắng — và dòng cảnh báo «bản đồ sản phẩm chưa bật» khi và chỉ khi bản đồ chưa bật; dòng hàng trễ nối «(k/N mốc không gắn hàng nào)» khi k > 0; thân `/start` in nguyên `loTrinh.dong` và đặt hàng kế làm một dòng chọn được ở câu hỏi bước 4 dẫn tới `/feature-loop:feature-loop <thamSo>`.
- AC-11: Given kho khai lộ trình, When vẽ bản đồ, Then `PRODUCT-MAP.md` có đúng một dòng liên kết tới `LO-TRINH.html`; Given kho KHÔNG khai, Then `PRODUCT-MAP.md` và JSON quét start giống từng byte bản trước vòng và mô-đun lộ trình không được nạp (ca LT-01 của lát 1 vẫn xanh).
- AC-12: Given bản sao crm `onehub` (`_acceptance/` + lộ trình OKR đã chuyển JSON), When chạy bộ vẽ của vòng bằng lệnh ở Notes, Then `LO-TRINH.html` do lệnh đó sinh (chép nguyên vào hồ sơ, không qua bản chép tay) cho hàng kế là một hàng mà lời khai và hồ sơ đều chưa làm, mọi cờ thuộc năm loại lệch thật đã ghi ở `opportunity.md`, và hàng «1» được nêu tên. Vế «owner xác nhận từng cờ là lệch thật» của ngưỡng SỐNG đọc ở phiên nghiệm thu, không ở đây. (judgment)
- AC-13: Given khối `lo_trinh:` của config có dòng chú thích sát lề, dòng trống, hoặc xuống dòng kiểu Windows nằm giữa khối, When đọc khoá, Then danh sách tệp giống hệt khi bỏ các dòng đó, và với mọi hình dạng một-tệp trong bảng ca, tệp đầu bằng đúng giá trị bộ đọc config dùng chung của kit trả cho `lo_trinh.tep` (đường đọc-cũ của lát 1). (Cổng Bằng chứng lượt 1, Ngoài-2/8)
- AC-14: Given một lộ trình có hai hàng cùng mã, When vẽ, quét và gọi lệnh tra/mở hàng bằng mã đó, Then thẻ không đưa hàng kế mang mã trùng thành lựa chọn mở (`hangKe.thamSo` null), lệnh tra và lệnh mở thoát 3 nêu «mã <mã> trùng trong <tệp>» và không ghi byte nào. (Ngoài-7)
- AC-15: Given một hàng mà hai hồ sơ trở lên cùng nhận qua `lo_trinh_ma` và slug của hàng không có hồ sơ, When vẽ và gọi lệnh mở hàng, Then hàng mang trạng thái «Không suy được» kèm cờ «được nhiều hồ sơ nhận», không là hàng kế, và lệnh mở thoát 2 nêu tên các hồ sơ nhận, không ghi byte nào. (Ngoài-6)
- AC-16: Given máy không khai email git, When chạy NGUYÊN VĂN khối mở việc S0 trên một hàng chưa có hồ sơ, Then lệnh thoát 0, ô cơ hội được ghi với `owner` rỗng. (Ngoài-9)

## Coverage

Quét bằng `morphological-scan` (preset entity-feature, thực thể = hàng lộ trình × hồ sơ × kho).
Chân sản phẩm: khảo sát hành trình 03/10 (`figures/hanh-trinh-lo-trinh.html`, bảy chỗ chưa phủ) +
lần chạy thử trên crm `onehub`. Chân ngành: kế thừa rà soát §8 hạt giống của lát 1.

- Trục A — lời khai × hồ sơ: không khai | khai ngoài từ vựng | khai cùng nhóm | khai khác nhóm | khai đã giao/đang làm mà không hồ sơ | khai chưa làm mà không hồ sơ  [thước CE: 32 hàng crm OKR, 18 cờ phân loại tay 03/10] → AC-1, AC-2, AC-3, AC-12
- Trục B — liên kết: chỉ slug | chỉ `lo_trinh_ma` | cả hai khớp | cả hai lệch | nhiều hồ sơ nhận | mã không có hàng | tệp không khai  [thước CE: bảng design §2] → AC-4, AC-15
- Trục C — số lộ trình: không khai | một (chuỗi) | một (danh sách) | nhiều | tệp lặp | một tệp hỏng | chú thích/dòng trống trong khối | mã trùng trong một tệp  [thước CE: crm có 5 tài liệu lộ trình; crm OKR có mã T trùng] → AC-8, AC-9, AC-11, AC-13, AC-14
- Trục D — đường vào: thẻ start (trang có · trang vắng · bản đồ chưa bật) | bản đồ | S0 mã đơn | S0 `<tệp>:<mã>` | S0 mô tả | S0 trên máy không email git | `/start` chọn hàng kế  [thước CE: khảo sát mục 1, 2, 5] → AC-5, AC-6, AC-7, AC-10, AC-11, AC-16
- Later: tự gắn mốc với hàng · di trú hồ sơ cũ sang `lo_trinh_ma` · lát 2 (skill cắt lượt).
- Never: kit ghi tệp ý định · lệnh thứ chín cho lộ trình.

## Đường đo

- Hàng kế trên crm OKR là hàng thật sự chưa giao · số từ: `node scripts/lo-trinh.mjs`-qua-bộ-vẽ trên bản sao crm `onehub` (lệnh ở Notes) · AC-12 (đọc), AC-3 (khuôn trên fixture).
- 0 cờ nhiễu trên crm OKR · số từ: cùng lần chạy, so thành phần cờ với số ghi ở opportunity.md trước khi có mã · AC-3, AC-12.
- Mỗi cờ còn lại được owner xác nhận là lệch thật · số từ: owner đọc trang trên bản sao crm ở phiên nghiệm thu trước cắt 2.21.0 · không AC (người đọc, ngưỡng UAT).
- Mở hàng kế ra ô cơ hội có ngưỡng đề xuất từ `bat_khi`, không thêm lượt gọi người · số từ: ô do `--mo-o` ghi + xếp ô của bộ quét start · AC-5, AC-7.
- Kho không khai không đổi thẻ/trang · số từ: so byte bản đồ + JSON quét với bộ vẽ ở commit gốc của vòng · AC-11.

## Out of scope

- Không thêm lệnh thứ chín; mọi đường vào qua `/acceptance-gate:start`, bản đồ và feature-loop.
- Kit không ghi byte nào vào tệp ý định.
- Không tự gắn mốc với hàng thay kho (khảo sát mục 6) — chỉ đếm mốc không gắn hàng.
- Không đổi hành vi «sửa tệp ý định → CI đỏ tới khi vẽ lại» (mục 7) — chỉ ghi GUIDE.
- Không di trú hồ sơ cũ sang `lo_trinh_ma`; thiếu trường là im.
- Không lát 2, không băng chống trôi, không nấc CRM.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- **Thay thế một phần hợp đồng đã ký:** AC-2 ở đây thay vế «slug dự kiến chưa có thư mục thì không
  có gì để khác — không cờ» của `_acceptance/viec-ke-theo-plan/contract.md` AC-4 cho ca lời khai thuộc
  nhóm đã giao hoặc đang làm. Hợp đồng cũ đã ký, không sửa; con trỏ này là vết thay thế.
- Ca đo: `tests/scripts/lo-trinh.test.mjs` (LT-*), suite scripts tự chạy qua glob `*.test.mjs`.
- Lệnh đọc AC-12 (bản sao crm ở scratchpad phiên, không ghi vào crm):
  `node scripts/product-map.mjs --root <bản sao crm> && cp <bản sao crm>/LO-TRINH.html _acceptance/lo-trinh-tren-du-lieu-that/do-crm-onehub.html`.
  Fixture crm-okr là đầu vào lát 1 (Known limit Ngoài-6 của lát 1: ô hồ sơ khai tay); bộ chuyển
  `data.js` → JSON vẫn chưa commit — giới hạn mang sang, AC-12 là chỗ đọc trên dữ liệu thật.
