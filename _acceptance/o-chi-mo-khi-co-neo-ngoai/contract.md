---
schema_version: 1
feature: Ô chỉ mở khi có neo ngoài — dòng Gốc máy đọc ở hàng chờ Cổng Đáng, lối «mở hợp đồng mới» ghi hạt giống thay vì tạo ô, vế «phải gọi tên chỗ cắt» hạ xuống «được phép», mẫu số trần vòng meta neo vào mốc được kho nhận
slug: o-chi-mo-khi-co-neo-ngoai
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, docs, ci]
status: implemented
design_doc: docs/superpowers/specs/2026-09-18-o-chi-mo-khi-co-neo-ngoai-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-18T14:13:03Z
---

# Acceptance Contract: o-chi-mo-khi-co-neo-ngoai

## Context

Source input: `_acceptance/o-chi-mo-khi-co-neo-ngoai/opportunity.md` (build, Mạnh 18/09) ·
`docs/findings/2026-09-18-o-sinh-tu-nghi-thuc-va-gia-cat-so.md` · design doc ở frontmatter.

10 ngày 08–18/09: 35 ô mới / 14 ô đóng, 22/35 sinh từ ba nghi thức của kit (12 từ vế «phải gọi tên
chỗ cắt» của mốc · 8 từ lối «mở hợp đồng mới» tại Cổng Bằng chứng · VC8 ép hạt giống thành ô); 7
mốc cắt số, 0 kho nhận, mốc 2.16.0 «không chạm đường vòng lặp» chấm 3 lượt 54,2 M token. Owner phát
biểu luật «ô chỉ mở khi repo yêu cầu». Vòng này: một dòng `Gốc:` máy đọc + răng đảo chiều ở hàng
chờ, đổi hành động lối (b), hạ vế bắt buộc, neo mẫu số trần meta. Người hưởng: owner (mỗi ô là
một lượt Cổng Đáng), máy (ghim lại 2 h 25 → 0), kho tiêu thụ (mốc chỉ cắt khi có kho chờ).

## Criteria

- AC-1: Given khuôn `opportunity-template.md` và lệnh `commands/start.md` — hai vật GIAO cho kho
  tiêu thụ — When đọc chúng, Then chúng mang đúng KHÁI NIỆM neo (dòng `Gốc:` giữa marker
  `OPP-GOC-LINE`; khối `START-HIEU-KET` dặn điền nó và nói lối ra hạt giống khi chưa có neo) và
  KHÔNG mang hình dạng riêng của kho này; HÌNH DẠNG hẹp sống trong `CLAUDE.md` giữa marker
  `KIT-GOC-RULE` / `KIT-GOC-TU-TRO`. Răng rút khái niệm từ khuôn và hình dạng từ luật kit, không
  gõ tay; gỡ marker nào → đỏ có tên; để hình dạng kit rò vào một trong ba vật giao đi → đỏ gọi
  tên vật.
- AC-2: Given cây có ô ở hàng chờ (`stage: discovery`, hoặc `decided` + `decision: build` chưa có
  `contract.md`), When chạy VC8, Then: ô thiếu dòng `Gốc:` → đỏ gọi tên slug + «thiếu Gốc»; dòng
  có mặt nhưng trỏ chính slug → đỏ + «trỏ chính nó»; dòng có mặt nhưng KHÔNG khớp dạng hợp lệ DUY
  NHẤT (rỗng sau dấu hai chấm · còn nguyên placeholder rút từ `OPP-GOC-LINE` · văn tự do như «suy
  từ đọc mã» · dạng ĐÃ BỎ «kho <tên> — <người> gọi tên <ngày>») → đỏ + «không khớp dạng» / «chưa
  điền»; ô có dòng hợp lệ → im; hạt giống `docs/plans/*-hat-giong-*` không có ô → IM (đảo chiều VC8
  cũ); ô `park`/`kill`/`archived` không Gốc → IM. Luật tự-trỏ bác ở MỌI cách viết của dạng hợp lệ:
  trần · có chữ giải thích phía sau · dạng đầy đủ `…/<slug>/opportunity.md`. Dạng hợp lệ và luật
  bác đều rút từ marker trong khuôn — một nguồn cho bên viết lẫn bên đọc — và đột biến khuôn phải
  lật kết luận. Mọi lần đọc frontmatter đi qua `frontmatterField` của lib, không chép lại. Mọi chiều trên MỘT fixture code-sinh từ khuôn, chỉ khác biến đang đo.
- AC-4: Given cây thật sau vòng, When chạy VC8 trên `ROOT`, Then 0 ô ở hàng chờ thiếu `Gốc:` hợp
  lệ — đo bằng chính vị từ của răng, không bằng lời khai ở nơi khác.
- AC-5: Given thẻ Cổng Bằng chứng có một mục ngoài hợp đồng `proposal: new-contract`, When render,
  Then câu khuyên là «Máy đề xuất: ghi hạt giống có Gốc, chờ kho gọi tên — không mở ô.» (hằng
  `MSG_OOC_HAT_GIONG` trong `gate-card.js`), và ba tài liệu (`feature-loop` SKILL khối Ngoài hợp
  đồng · `commands/acceptance-card.md` · `commands/signoff.md`) đều nói hành động của lối (b) là ghi
  hạt giống `docs/plans/<ngày>-hat-giong-<slug>.md` mang `Gốc:`, KHÔNG tạo `_acceptance/<slug>/`;
  nhãn «mở hợp đồng mới» giữ nguyên văn. Khối lối (b) ở ba tài liệu nằm giữa marker `OOC-LOI-B`;
  răng rút KHỐI, không grep cả tệp: trong khối phải có chuỗi rút từ `MSG_OOC_HAT_GIONG`, đường
  `docs/plans/<ngày>-hat-giong-<slug>.md`, câu «KHÔNG tạo `_acceptance/<slug>/`», và KHÔNG có «tách
  thành một việc riêng» hay «tạo thư mục». Răng: đổi hằng trong bản sao gate-card → đỏ ghim câu;
  chèn câu cũ vào khối của một bản sao tài liệu → đỏ gọi tên tệp.
- AC-6 (judgment): Given `CLAUDE.md` sau vòng, When đọc luật Giới hạn CHIỀU RỘNG, Then (i) vế
  «Mỗi mốc phát hành PHẢI gọi tên ít nhất MỘT chỗ cắt» không còn dạng bắt buộc — thay bằng «được
  phép ghi vào Notes của hồ sơ mốc; chỗ cắt chỉ thành ô khi có Gốc»; (ii) luật (b) đếm «giữa hai mốc
  ĐƯỢC MỘT KHO TIÊU THỤ NHẬN», không phải giữa hai lần cắt số; (iii) có câu «mốc chỉ cắt khi có kho
  chờ nhận (dòng `Kho chờ nhận:` trong hồ sơ mốc), đi làn V»; (iv) không câu nào khác của luật bị
  đổi nghĩa; sử liệu (số 30/08, 01/09, 14/09) giữ nguyên.
- AC-7: Given hồ sơ này (`decided` + `build`, tức trong phạm vi VC8), When chạy VC8 trên cây thật và
  trên fixture có một ô `decided build` thiếu Gốc, Then cây thật im còn fixture đỏ gọi tên slug —
  tự ăn thuốc có chiều đỏ; và `product-map --check` + bốn suite xanh.

## Coverage

Trục A nguồn sinh ô [thước CE: cột «nguồn sinh» finding §3, 35 ô thật] × Trục B trạng thái ô
[thước CE: giá trị `stage`/`decision` của khuôn]. Core: mọi nguồn × hàng chờ (AC-2) · lối (b) (AC-5) · luật (AC-6) · ranh giới kit↔kho tiêu thụ
(AC-1). Later: decided-build không neo. Never: park/kill/archived (sử liệu) · mốc phát hành —
vế «kho chờ nhận» CẮT khỏi vòng 19/09, khai giới hạn kèm ngưỡng trong `CLAUDE.md`. Không có
`[CE chưa kiểm chứng]`.

## Đường đo

Ngưỡng ở `opportunity.md` (đọc tới mốc kế được một kho nhận, bằng lệnh trong finding §2 và §5):
- ô mới ≤ ô đóng — số từ: `git log --diff-filter=A -- _acceptance` gom thư mục vs `Gate 2 signoff` ·
  bảo đảm bởi: AC-2 (ô không neo không đứng được ở hàng chờ).
- ≥ 80 % ô mới có `Gốc:` — số từ: VC8 trên cây thật (răng làm ngưỡng thành 100 % ở discovery) ·
  bảo đảm bởi: AC-2, AC-4.
- tồn kho chưa hợp đồng ≤ 15 — số từ: lệnh finding §2 · bảo đảm bởi: AC-4 (rà).
- mốc cắt số ≤ 1 lượt người, 0 lượt chấm S4 — số từ: hồ sơ mốc kế, dòng 2 và 5 · bảo đảm bởi:
  KHÔNG có răng trong vòng này (vế «kho chờ nhận» đã cắt); khai giới hạn kèm ngưỡng đang đếm
  trong `CLAUDE.md` — mốc cắt số mà 21 ngày không kho nào cài là ngưỡng mở ô.
- ngưỡng CHẾT «Known limits/vòng tăng gấp đôi» — số nền hôm nay (5 hồ sơ ký trong cửa sổ 2.16, đếm
  bullet dưới `### Known limits`): 8 · 0 · 12 · 15 · 0 → **7/vòng**; gấp đôi = ≥ 14/vòng trung bình
  trên cửa sổ kế · số từ: cùng lệnh awk trong sổ chạy · bảo đảm bởi: không AC — ngưỡng đọc.
- ngưỡng CHẾT «lỗi thật ở kho tiêu thụ mất chỗ ghi» — số từ: đếm hạt giống có `Gốc:` trỏ hồ sơ kho
  tiêu thụ mà sau 21 ngày chưa có ô · bảo đảm bởi: AC-5 (lối b ghi hạt giống có Gốc nên đếm được).
- timebox: ngày ký Cổng Đáng 18/09 + 21 = **2026-10-09** — tới ngày đó chưa kho nào nhận một mốc là
  tín hiệu, ghi vào hồ sơ mốc kế.

## Out of scope

- Đổi tên nhãn «mở hợp đồng mới» (chữ người ở `lib/out-of-contract.js`, T3) — ô sau nếu owner gọi.
- Răng kiểm hồ sơ đích của `Gốc:` có tồn tại — máy này không có mọi kho; sự tồn tại là điều
  NGƯỜI kiểm ở Cổng Đáng trong mười giây, máy chỉ kiểm hình dạng và «không trỏ chính mình».
- Răng cho vế «mốc chỉ cắt khi có kho chờ nhận» — cắt khỏi vòng 19/09; răng đúng tầng là «mốc
  N+1 dẫn được commit cài mốc N», là CỘNG, cần owner phê duyệt ở một vòng riêng.
- Chiều «hạt giống mồ côi thì máy im» — không đo được ở tầng này: không bộ đọc nào nhìn
  `docs/plans`, nên mọi phép so đều rỗng theo cấu trúc. Hành vi đúng, lời tuyên gỡ.
- Thước giữ «mọi lần đọc frontmatter qua lib» — mã đã sửa, nhưng không ca nào phân biệt được
  bản hỏi lib với bản chép; gỡ lời tuyên thay vì tuyên suông.
- Thẻ Cổng Đáng in dòng Gốc — không bề mặt mới.
- Trần số ô cứng — là ngưỡng đọc, không phải răng.
- Hồi tố `Gốc:` cho ô `decided`/`archived`.

## Notes

### Known limits

(điền ở Cổng Bằng chứng)
