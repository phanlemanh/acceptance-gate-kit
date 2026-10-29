---
schema_version: 1
feature: Đơn xin s4 không cờ mang slug của hàng đang chấm, hang them nhận mã hay slug của lộ trình và thêm hàng mang đúng slug và mã, và một dãy đã nghỉ chạy lại được bằng hang chay-lai — không còn sửa tay hang-viec.json
slug: lenh-dot-ghi-dung-hang
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, docs]
status: implemented
design_doc: _acceptance/lenh-dot-ghi-dung-hang/design.md
approved_by: Manh Phan
approved_at: 2026-10-29T10:32:35Z
---

# Acceptance Contract: lenh-dot-ghi-dung-hang

## Context

Gốc: onehub-invest/_acceptance/lo-trinh-2310/ — đợt Điều phối – Thợ `dieu-phoi-dot0-cam-mau` (25–26/10): khoá s4 ghi
slug của hàng kế, `hang them F12` thêm hàng slug `f12`, và không có lệnh ngược của `hang nghi` — giám sát sửa tay
`hang-viec.json` trong khoá. Ô `_acceptance/lenh-dot-ghi-dung-hang/opportunity.md` (Cổng Đáng build 25/10), hàng TC2 của
`docs/plans/lo-trinh-kit.json`; hạt giống 26/10 mục 3, 5, 6. AC-7 là mục c5 của M5 ở kit #308 (29/10) — Hỏi-1 ở Cổng
Phạm vi. Thiết kế: design doc ở frontmatter.

Thuật ngữ:
- **hồ sơ chấm được** = `_acceptance/<slug>/contract.md` trong worktree của dãy ở `implemented`, `verified`,
  `signed-off`, `machine-cleared` hay `da-cham-boi-thuc-te`, của một hàng thuộc dãy.
- **đã gộp** = bản hợp đồng trên `origin/<nhanh_chinh>` đã thông (ba trạng thái cuối ở trên) hoặc mang `risk_tier: T1`
  (vế T1 chỉ khi Hỏi-1 duyệt).
- **sha ghim** = `12701df6c841a4c78871e5303a950d02d5d6bf77` (gốc vòng; hằng trong tệp test, không suy lúc chạy), bản gói
  rút bằng `git archive` trọn thư mục `dieu-phoi`.
- **dãy**, **hàng**, **Nhật ký**, **bộ phát lịch**: như `CONTEXT.md`.

## Criteria

- AC-1: Given đợt thử có dãy P1 với hàng A, B và ma trận viết sẵn sáu hàng, `tiep/P1.json` do một nhịp bộ phát lịch thật
  sinh — (a) A `signed-off` trong worktree, chưa gộp, B chưa có hợp đồng · (b) chỉ B có hợp đồng `implemented` · (c) A đã
  gộp trên nhánh chính, B `draft` · (d) A `verified` · (e) A `signed-off` chưa gộp và B `implemented` · (f) hồ sơ X của
  một hàng dãy P2 `signed-off` chưa gộp nằm trong worktree P1 — When thợ chạy CLI thật `xin s4` không cờ, Then đơn
  `xin/P1-s4.json` mang (a) A · (b) B · (c) B · (d) A · (e) B · (f) hàng `tiep` (A), ca in «số hàng: 6». Chiều đỏ, mỗi bản
  sao một nhát và chỉ hàng của nhát ấy đỏ: về `slug ?? slugKeCua(...)` → «(a): đơn mang hang-b, cần hang-a» · gộp hai bậc
  thành một → «(e): đơn mang null, cần hang-b» · gỡ bộ lọc hàng của dãy → «(f): đơn mang hang-x, cần hang-a».
- AC-2: Given hàng (a) của AC-1, When chạy `xin ghim-lai` và `xin merge` không cờ, `xin s4 --slug hang-b`, và `xin
  duong-nen` không cờ, Then đơn mang lần lượt A · A · B · B (`duong-nen` giữ lối cũ); ở hàng (e) `xin s4` · `xin ghim-lai`
  · `xin merge` không cờ mang B · A · A; và Given A, C cùng `signed-off`
  chưa gộp, B kế không hợp đồng, When `xin s4` không cờ, Then thoát 1, stderr nêu cả `hang-a` và `hang-c` cùng `--slug`,
  không tệp `xin/P1-s4.json` nào. Chiều đỏ: bản sao lấy ứng viên đầu thay vì từ chối → hàm kiểm nêu «hai ứng viên mà
  vẫn ghi đơn».
- AC-3: Given đợt có nguồn hàng trỏ tệp lộ trình mang hàng `F12` slug bảy từ và `vung`, When giám sát chạy `hang them
  F12 --day P2`, rồi ở một đợt mới `hang them <slug bảy từ> --day P2`, Then cả hai lần hàng thêm mang đúng slug bảy từ,
  `ma: "F12"`, `ranh_gioi` = `vung` của hàng, một dòng Nhật ký; `hang-viec.json` qua hàm kiểm của bên đọc; cùng lệnh kèm
  `--ranh-gioi 'app/khac/**'` → `ranh_gioi` đúng `["app/khac/**"]`, slug và mã vẫn của lộ trình. Chiều đỏ: bản
  sao bỏ bước tra lộ trình → hàm kiểm nêu «F12: slug f12, cần <slug bảy từ>».
- AC-4: Given cùng đợt của AC-3, When `hang them` với câu tự do có dấu tám từ, với đối số dạng slug bảy từ không có ở lộ
  trình, và với mã `Z9` không có ở lộ trình, Then câu tự do và `Z9` cho hàng giống từng byte hàng do bản gói ở sha ghim
  thêm cho cùng đầu vào (slug suy sáu từ, không `ma`), đối số dạng slug giữ nguyên bảy từ; chạy lại mỗi lệnh lần hai →
  «không đổi gì», số dòng Nhật ký và sự kiện không đổi. Chiều đỏ: bản sao bỏ nhánh giữ đối số dạng slug → hàm kiểm nêu
  «slug bị cắt còn sáu từ».
- AC-5: Given dãy P2 đã `hang nghi P2` và một nhịp bộ phát lịch thật cho `tiep/P2.json` `cho: nghi`, When giám sát
  chạy `hang chay-lai P2` rồi một nhịp nữa, Then `hang-viec.json` giống từng byte bản trước `nghi`, đúng một dòng Nhật
  ký «cho P2 chạy lại» và một sự kiện `doi-ke-hoach` `kieu: chay-lai`, `tiep/P2.json` mang lại hàng kế của P2; chạy lại
  `hang chay-lai P2` lần hai → «không đổi gì», không dòng Nhật ký hay sự kiện mới. Chiều đỏ: bản sao không gỡ `nghi` →
  hàm kiểm nêu «P2 vẫn nghỉ sau chay-lai».
- AC-6: Given đợt của AC-5, When `hang chay-lai P9` (dãy vắng) và `hang chay-lai P1` (dãy chưa nghỉ), Then lần đầu thoát
  1 với «không có dãy P9» và không đổi byte nào của thư mục đợt, lần hai «không đổi gì»; và lời dùng của `hang` khi gọi
  sai liệt `chay-lai <P>`.
- AC-7: (Hỏi-1) Given dãy P1 có hàng T (hợp đồng `risk_tier: T1` · `status: draft` kèm chú thích `#`, cùng bản ở worktree
  và nhánh chính) và hàng U kế, When một nhịp bộ phát lịch thật, Then `tiep/P1.json` trỏ U; đối chứng cùng fixture, lịch
  KHÔNG coi T là xong: T chỉ có ở worktree → `tiep` trỏ T; hàng T2 `draft` có trên nhánh chính → vẫn là hàng đang làm. Chiều đỏ: bản sao bỏ vế
  T1 → hàm kiểm nêu «hồ sơ T1 đã gộp vẫn là hàng đang làm».
- AC-8: Given ma trận đường đọc-cũ viết sẵn (đơn có `--slug`; đơn không cờ khi dãy không có hồ sơ chấm được; `hang them`
  hàng đã có trong `hang-viec.json`; `nghi` một dãy; một nhịp lịch không hồ sơ T1), When chạy trên bản gói ở sha ghim và
  bản mới cùng đầu vào, Then đơn (bỏ `luc`), `hang-viec.json`, `tiep/*.json` và sự kiện (bỏ giờ, đường thư mục tạm thay
  bằng nhãn) giống từng byte; ca in số hàng và đường CLI bản cũ, và assert bản cũ chưa có vật của vòng. Chiều đỏ: bản sao
  gói hiện tại thêm một khoá vào sự kiện của `hang nghi` → danh sách lệch BẰNG đúng hàng `nghi`.
- AC-9: Given `dieu-phoi/README.md` và `dieu-phoi/commands/tiep-tuc.md`, When đọc, Then README nêu thứ tự nguồn slug của
  đơn xin không cờ, `hang them` nhận mã hay slug lộ trình, và `hang chay-lai <dãy>` là lệnh ngược của `hang nghi`; chỗ
  `tiep-tuc.md` nhắc `hang nghi` nhắc kèm `hang chay-lai`. Chiều đỏ: hai tệp ở sha ghim → hàm kiểm nêu đúng tên từng tệp
  thiếu câu; ba biến thể README, mỗi biến thể gỡ đúng một trong ba câu ghim → lỗi nêu đúng câu ấy, hai câu kia im.
- AC-10: Given cây sau vòng, When chạy suite `tests/dieu-phoi/**/*.test.mjs`, Then mọi ca xanh — kể cả bộ canh thân ca
  cũ `TC1-09` của hồ sơ `danh-thuc-doc-nhip-dung-ma` (ca mới của vòng nằm trong tệp riêng, không ca cũ nào đổi thân).

## Đường đo

- Vế ca dựng của ngưỡng ô (ba ma trận viết trước, mỗi ô có đối chứng) → AC-1, AC-3, AC-4, AC-5.
- Vế «không còn sửa tay `hang-viec.json`»: số lần giám sát ghi Nhật ký tay hay sửa tệp trong khoá ở đợt kế của một kho
  nhận bản có TC2 — đếm từ Nhật ký LUAT.md của đợt ấy (dòng không do lệnh `hang`/`ghi-danh` sinh). Không AC nào bảo đảm
  vế này — reality là đồng hồ cuối; chủ kho ghi bằng `/acceptance-gate:observed` (ADR 0020).

## Coverage

Quét hình thái preset test-matrix — bản đủ ở design doc §4. Bốn trục: A lệnh · B nguồn đúng · C số ứng viên · D lần
chạy.

- xin × hồ sơ worktree × {0,1, hai bậc, ngoài dãy} → AC-1; × ≥2 cùng bậc và × loại lượt → AC-2.
- hang them × lộ trình {mã, slug} → AC-3; × {khuôn slug, câu tự do, mã ngoài} × D → AC-4.
- chay-lai × {nghỉ} × D → AC-5; × {chưa nghỉ, dãy vắng} → AC-6.
- lịch × T1 {nhánh chính, chỉ worktree} × T2 → AC-7.
- Đường đọc-cũ → AC-8. Lời dặn → AC-9. Bộ cũ → AC-10.
- [NGÀNH: kubectl cordon/uncordon] · [NGÀNH: Git refspec — nhập nhằng thì từ chối].
- Later: `hang uu-tien` (TC-C1, CỘNG). Never: đoán hàng từ tên nhánh git.

## Out of scope

- Lệnh đặt `uu_tien` tuyệt đối `hang uu-tien` (TC-C1) — CỘNG, chỉ mở khi chủ kho gọi tên.
- Lệnh rút đơn `xin/` chưa cấp và `ban-giao-xong --wip` dùng `git add -A` (#308 c3, c4) — hạt giống.
- Đổi luật `suySlug` (suy slug từ câu giao).
- Sửa thư mục đợt đang chạy ở kho tiêu thụ — kho nhận theo bản phát hành.
- `CHANGELOG.md`, số phiên bản, cắt mốc — việc của chiến dịch phát hành.

## Notes
