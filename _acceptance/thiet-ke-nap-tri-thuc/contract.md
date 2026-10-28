---
schema_version: 1
feature: Bước thiết kế của mọi vòng ở kho đã khai tri thức ghi dòng «đã tra tri thức», và thẻ Cổng Phạm vi không mời duyệt khi thiếu dòng ấy
slug: thiet-ke-nap-tri-thuc
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: signed-off
design_doc: docs/superpowers/specs/2026-10-24-thiet-ke-nap-tri-thuc-design.md
approved_by: Manh Phan
approved_at: 2026-10-24T14:04:57Z
---

## Context

Hàng TT4 của `docs/plans/lo-trinh-kit.json` (đợt `tri-thuc-2410`, phủ C3 · C4 · C5 của
`docs/plans/pham-vi-tri-thuc-2410.md`). Ô đã qua Cổng Đáng (Manh Phan, 24/10). TT3 đưa đường trỏ trang tri thức tới ô
của hàng; vòng này đưa nó tới bước thiết kế và làm thẻ Cổng Phạm vi chứng điều đó. Thiết kế đợt:
`docs/findings/2026-10-24-tang-tri-thuc-llm-wiki.md` §3.2.

Thuật ngữ:
- **dòng tra** = dòng sổ `stage: "S1"` mang khoá `tri_thuc_tra` (`tra`, `trang`, tuỳ chọn `khong_doc`) theo khối
  `DEC-TRI-THUC-TRA` của SKILL feature-loop.
- **đường trỏ** = chuỗi khớp khối `TRI-THUC-CON-TRO` của `skills/acceptance/references/tri-thuc-template.md`.
- **dòng «Nguồn:»** = dòng của ô cơ hội mở bằng tiền tố khối `OPP-NGUON-PREFIX`, đọc bằng `docDongNguon` của
  `scripts/tri-thuc-nguon.cjs`.
- **thẻ** = `node scripts/gate-card.js --root <kho> --slug <hồ sơ> --gate 1` (HTML) và cùng lệnh kèm `--extract` (JSON).
- **bộ xếp** = `scripts/can-cu-s1.cjs` (`phanLoaiSo`, và CLI `--slug … --json`).
- **kho thử** = kho git dựng trong thư mục tạm của lượt chạy, trang tri thức SINH từ khối `TRI-THUC-TRANG` của khuôn thật.
- **bộ máy trước vòng** = `git archive 378e262c scripts lib skills feature-loop` giải vào thư mục tạm.

## Criteria

- AC-1: Given kho thử khai `tri_thuc.noi` có ba trang và hồ sơ `draft` có ô với dòng «Nguồn:» trỏ hai trang, When dựng
  thẻ qua ma trận viết sẵn bốn hàng — sổ không dòng tra · dòng tra thiếu một trang của ô · dòng tra đủ hai trang của ô
  cộng một trang khác, đúng băm · dòng tra `trang: []` trên ô không có dòng «Nguồn:» — Then `--extract` mang
  `tri_thuc.chan` lần lượt `true` · `true` · `false` · `false`, `tri_thuc.chua_tra` lần lượt rỗng · đúng đường của trang
  thiếu · rỗng · rỗng; ở hai hàng chặn dòng lệnh duyệt để ô quyết `___` và HTML có dòng đỏ mở bằng «CHƯA vào được Cổng
  Phạm vi: chưa tra tri thức» (hàng hai nêu `chưa tra: <đường>`), ở hai hàng không chặn ô quyết là `duyệt`, không có
  dòng ấy và không có cờ tri thức nào. Thêm hai hàng hai dòng tra, cả hai ghi bằng khối `DEC-TRI-THUC-TRA` thật: dòng
  một thiếu một trang rồi dòng hai đủ → `chan = false`; dòng một đủ rồi dòng hai mang `supersedes` dòng một và thiếu một
  trang → `chan = true`, `chua_tra` đúng trang ấy. Bản tiêm bỏ `tri_thuc.chan` khỏi điều kiện chặn của thẻ thì hàng một
  đỏ; bản tiêm lấy dòng tra ĐẦU tiên thay dòng cuối còn hiệu lực thì hàng năm đỏ.
- AC-2: Given cùng kho thử, When dựng thẻ ở ba hàng — dòng tra đủ rồi một trang bị sửa và commit · dòng tra có một
  đường trỏ sai khuôn · dòng tra trỏ một tệp không có — Then cả ba `tri_thuc.chan = false`, ô quyết `duyệt`, và HTML có
  đúng một cờ vàng tri thức lần lượt «trang tri thức không khớp bản đã tra: <đường trỏ>» · «đường trỏ tri thức sai
  khuôn: <chuỗi>» · «trang tri thức không khớp bản đã tra: <đường trỏ>»; mỗi đường trỏ trong `tri_thuc.trang` mang kết quả `khop` ·
  `lech` · `sai` đúng với mã thoát của `tri-thuc.mjs --con-tro` trên cùng chuỗi. Bản tiêm đổi phép đọc mã thoát thành
  luôn-khớp thì hàng một đỏ.
- AC-3: Given kho thử khai kho riêng (`tri_thuc.kho`) mà đường của nó không có ở máy, When dựng thẻ ở ba hàng — dòng
  tra trỏ hai trang của kho riêng · dòng tra `trang: []` mang `khong_doc` · ô có dòng «Nguồn:» trỏ hai trang của kho
  riêng (ô do lệnh mở ô sinh khi kho riêng còn ở máy) và dòng tra `trang: []` mang `khong_doc` — Then cả ba
  `tri_thuc.chan = false`, `chua_tra` rỗng, ô quyết `duyệt`, HTML có đúng một cờ vàng mở bằng «không đọc được ở đây:»
  nêu tên kho, và không có dòng «CHƯA vào được Cổng Phạm vi»; đối chứng: cùng hồ sơ hàng ba mà dòng tra không mang
  `khong_doc` thì `chan = true`, và cùng hồ sơ hàng một trên kho có kho riêng thật thì không cờ «không đọc được». Bản
  tiêm bỏ phép miễn `khong_doc` khỏi phép tính `chua_tra` thì hàng ba đỏ.
- AC-4: Given kho thử khai kho riêng vắng ở máy, When chạy `node scripts/tri-thuc-tra.cjs --root <kho> --clone` ở bốn
  hàng — `remote` là một kho trần cục bộ có trang · không khai `remote` · `remote` trỏ đường không có · chạy lại sau
  hàng một — Then lần lượt: thoát 0 «đã clone», đường kho riêng có trang và `--con-tro` trên trang ấy thoát 0 · thoát 3
  dòng mở bằng «không đọc được ở đây:» nhắc khai `kho.remote` · thoát 3 dòng mở bằng «không đọc được ở đây:» nêu
  «clone thất bại» · thoát 0 «đã có», HEAD kho riêng không đổi; kho chỉ khai `noi` thì thoát 0 «kho tri thức nằm trong
  kho»; kho không khai `tri_thuc` thì thoát 2; `kho.duong` giải vào TRONG cây kho (`vendor/tt`) với `remote` hợp lệ thì
  thoát 3 dòng mở bằng «không đọc được ở đây:» nêu «nằm trong cây kho», không thư mục nào được tạo và `git status
  --porcelain` của kho trước bằng sau.
- AC-5: Given ba kho thử — khai `noi` (kho trong kho) · khai kho riêng (một bản có kho riêng ở máy, một bản không) ·
  không khai `tri_thuc` — When bộ xếp đọc sổ có ma trận viết sẵn bảy dòng S1
  nguồn mục tiêu mang `tri_thuc` — khớp băm · lệch băm · sai khuôn · trỏ kho riêng vắng ở máy (bản kho thứ hai không có
  kho riêng) · trỏ kho riêng kèm `trich` · khoá `tri_thuc` trên kho không khai · trang trong kho mà gốc nhánh chưa có —
  Then lớp lần lượt `da-quyet` · `do` `tri-thuc-lech` · `do` `tri-thuc-sai` · `da-quyet` kèm ghi chú mở bằng «không đọc
  được ở đây:» · `do` `tri-thuc-kem-trich` · `do` `tri-thuc-khong-khai` · `do` `sinh-trong-vong`; không dòng nào ra
  `cau-hoi`. Bản tiêm bỏ nhánh `tri_thuc` khỏi bộ xếp thì hàng một ra `do` `thieu-con-tro`.
- AC-6: Given kho thử có kho riêng mà trang mang một câu canh độc nhất, hồ sơ `draft` có dòng tra và một dòng căn cứ
  `tri_thuc` trỏ trang ấy, When dựng thẻ HTML và `--extract`, Then dòng máy đã quyết in «căn cứ: trang tri thức» kèm
  đúng đường trỏ, JSON `can_cu.da_quyet[]` mang khoá `tri_thuc` bằng đường trỏ ấy, và câu canh KHÔNG xuất hiện trong
  HTML, JSON hay đầu ra `can-cu-s1.cjs --json`.
- AC-7: Given ma trận viết sẵn năm hồ sơ trên kho thử KHÔNG khai `tri_thuc` (draft sạch · draft có câu chỉ-người · draft
  cỡ 11 · approved · draft có dòng căn cứ tệp + câu trích), When dựng thẻ HTML, `--extract` và `can-cu-s1.cjs --json`
  bằng cây và bằng bộ máy trước vòng, Then ba đầu ra giống từng byte ở cả năm hồ sơ (in số byte hai bên); và trên kho ĐÃ
  khai, hồ sơ `approved` không dòng tra cho `tri_thuc.chan = false`, ô quyết không bị để trống vì tri thức, và đúng một cờ
  vàng đọc-cũ mở bằng «hồ sơ đã qua Cổng Phạm vi không có dòng tra tri thức». Bản tiêm luôn thêm khoá
  `tri_thuc` vào `--extract` thì hồ sơ một đỏ.
- AC-8: Given SKILL feature-loop, When rút khối `DEC-TRI-THUC-TRA` và `DEC-CAN-CU-TRI-THUC`, điền ô bằng đường trỏ băm
  thật của kho thử, ghép vào khối lệnh `DEC-ID-RECIPE` và chạy bằng bash, Then dòng sổ sinh ra được thẻ nhận là dòng tra
  (`tri_thuc.chan = false`, không cờ) và bộ xếp xếp cả hai dòng `da-quyet`; khối `TRI-THUC-TRA-CHAN` tồn tại và mọi cặp
  khoá–giá trị của nó khớp khoá thẻ phát ra khi chặn (`tri_thuc.chan` = true). Bản tiêm đổi tên khoá `tri_thuc_tra`
  trong khối khuôn thì thẻ ra `chan = true`.
- AC-9: Given cây đã sửa, When chạy ca đang có của bộ xếp (`tests/scripts/can-cu-s1.ca.mjs`), luật sản phẩm
  (`tests/scripts/luat-san-pham.ca.mjs`), cỡ hợp đồng (`tests/scripts/co-hop-dong.test.mjs`) và tầng tri thức
  (`tests/scripts/kho-tri-thuc-va-lint.test.mjs`, `tests/scripts/o-mo-viec-mang-nguon.test.mjs`), Then tất cả xanh.

## Coverage

Bỏ quét hình thái — entry `descope` «bỏ coverage-scan» trong `decisions.jsonl`: không gian do bảng ca của design doc và
`bat_khi` của hàng định sẵn (thẻ: thiếu · đủ · lệch · không đọc được · không khai; bộ xếp: bảy ca căn cứ), mỗi ca có
chiều đỏ.

- Thẻ chặn khi thiếu (C3): AC-1. Thẻ cờ không chặn (C3): AC-2. Không đọc được (C4): AC-3. Tự clone (C4): AC-4.
- Căn cứ con trỏ băm (C5): AC-5 (bộ xếp), AC-6 (thẻ, không rò câu trích).
- Chiều im: AC-7. Khuôn round-trip: AC-8. Hồi quy: AC-9.

## Đường đo

- Thước: ma trận ô của thẻ trong ngưỡng của ô (thiếu → ô quyết trống + cờ · đủ đúng băm → không cờ · không đọc được →
  nhãn, không chặn · không khai → giống từng byte) · số từ: ca TN-1, TN-2, TN-3, TN-7 của
  `tests/scripts/thiet-ke-nap-tri-thuc.test.mjs` chạy ở lượt chấm · bảo đảm bởi: AC-1, AC-2, AC-3, AC-7.

## Out of scope

- Tra theo mô tả cho vòng đơn lẻ và bộ tra đọc sổ quyết định của mọi hồ sơ (C2, E1) — hàng TT5.
- Neo dòng «Nguồn:» theo vị trí ngay sau «Mở từ hàng …» (giới hạn Ngoài-2 của TT3).
- Kiểm dòng tra ở pre-merge, recheck hay làn ghim lại.
- Chứng bước thiết kế đã hiểu hay đã chọn đúng trang.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Known limits:
  - Dòng tra chứng máy đã tra và đã chạm trang (băm), không chứng đã hiểu hay đã chọn đúng trang — ngưỡng đang đếm của
    thiết kế đợt §5 (dưới 30 % sau 10 hồ sơ thì mở «tra theo nghĩa»).
  - Kho riêng chỉ kiểm được ở máy có bản của nó; máy không có thì nhãn «không đọc được ở đây», chữ ký vẫn đi.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-25:
  - Ngoài-1: Ở các lượt chấm lại sau này, vài ca kiểm của vòng (ma trận thẻ, bộ xếp căn cứ, bốn tệp hồi quy) có thể được mang màu xanh cũ sang dù tệp chúng phụ thuộc đã đổi, vì danh sách tệp theo dõi khai thiếu.
  - Ngoài-2: Thẻ báo chưa vào được Cổng Phạm vi khi thiếu dòng tra, nhưng người gõ thẳng lệnh duyệt vẫn ký được — lệnh ghi chữ ký chưa tự chặn.
  - Ngoài-4: Cùng lớp Ngoài-1 — hai ca kiểm (hồi quy và bộ xếp căn cứ) khai thiếu tệp phụ thuộc nên lượt sau có thể không chạy lại.
  - Ngoài-5: Ca kiểm cho trường hợp «không đọc được kho riêng» dùng chuỗi tự viết, chưa rút từ khuôn dòng tra; đổi khuôn mà không đổi ca thì ca vẫn xanh.
  - Ngoài-7: Ca kiểm chưa chứng minh bộ dò dòng cảnh báo đỏ bắt được dòng ấy; hôm nay dòng đỏ vẫn được kiểm bằng nội dung chữ.
- Mở hợp đồng mới (Ngoài-3): hạt giống `docs/plans/2026-10-25-hat-giong-tro-kho-rieng-khong-tien-to.md`.
