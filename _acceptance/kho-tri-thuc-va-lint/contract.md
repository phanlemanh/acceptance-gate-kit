---
schema_version: 1
feature: Kho khai nơi để tri thức một lần; lint máy đọc kho tri thức theo khuôn một nguồn và đỏ đúng sáu lỗi cấu trúc, đường trỏ băm phân giải được ở mọi worktree
slug: kho-tri-thuc-va-lint
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: draft
design_doc: docs/superpowers/specs/2026-10-24-kho-tri-thuc-va-lint-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-24T03:14:28Z
---

## Context

Hàng TT1 của đợt `tri-thuc-2410` (lượt cắt #404), mã A1, A2, A3. Ô cơ hội đã qua Cổng Đáng 24/10 (`decision: build`,
hạn 25/10). Gốc: crm-onehub/_acceptance/thanh-ben-khu-dung-chung/.

Thuật ngữ:
- **gốc tri thức** = `<gốc kho>/<noi>` khi kho không khai `kho`; thư mục kho riêng đã giải khi có.
- **kho thử** = kho git (và khi cần, một kho riêng kèm một remote trần) do ca dựng trong thư mục tạm của lượt chạy, có
  trang, raw và `nguon.md` sinh từ khuôn `tri-thuc-template.md` thật.
- **lint** = `node scripts/tri-thuc.mjs --root <kho> --kiem`.

## Criteria

- AC-1: Given ma trận viết sẵn chín khối `tri_thuc` trong `_acceptance/config.yaml` của kho thử — vắng khối · chỉ `noi`
  · `noi` + `cong_khai: true` · `kho` đủ ba khoá · thiếu cả `noi` lẫn `kho` · `cong_khai: co` · `kho` thiếu `duong` ·
  `kho` thiếu `ten` · khoá lạ trong khối — When bộ đọc `scripts/tri-thuc-khoa.cjs` đọc, Then lần lượt: `null` · gốc
  `<kho>/<noi>` · như trên kèm `cong_khai: true` · gốc là kho riêng đã giải · lỗi «khối tri_thuc thiếu noi hoặc kho.duong»
  · lỗi «cong_khai phải là true hoặc false» · lỗi «kho thiếu duong» · lỗi «kho thiếu ten» · cảnh báo «khoá lạ trong
  tri_thuc: <khoá>» (không lỗi); và lint thoát 2 với đúng câu lỗi ở bốn hàng lỗi.
- AC-2: Given kho thử có khai `kho` với `duong: ../<tên>`, When chạy lint và `--con-tro` từ checkout chính và từ một
  worktree lồng sâu của kho ấy (`git worktree add .claude/worktrees/x`), Then cả hai giải ra CÙNG một đường và đường ấy
  BẰNG `realpath(<cha của git-common-dir>)/../<tên>` (giá trị tuyệt đối ghim, không chỉ quan hệ bằng nhau), cho cùng kết
  quả; bản tiêm đổi phép giải sang tương đối gốc worktree thì ca từ worktree đỏ «gốc tri thức lệch giữa checkout chính
  và worktree».
- AC-3: Given khuôn `skills/acceptance/references/tri-thuc-template.md` thật, When rút bốn khối `TRI-THUC-TRANG`,
  `TRI-THUC-RAW`, `TRI-THUC-CON-TRO`, `TRI-THUC-LUAT`, dựng kho thử lành từ chính các khối ấy (một trang mỗi loại, một
  thư mục raw hai tệp với `nguon.md` băm thật), Then lint thoát 0, in «tri thức: <n> trang, <m> raw, 0 lỗi»; bản tiêm
  đổi tên khoá `nguon` trong khối `TRI-THUC-TRANG` (bên đọc rút theo khuôn đã tiêm, trang dựng theo khuôn thật) thì lint
  thoát 1 với đúng các dòng `lỗi: [trang-thieu-nguon] <trang>` cho mọi trang, không mã nào khác — round-trip bên ghi →
  bên đọc.
- AC-4: Given kho thử lành của AC-3 (bản phạm vi là bản sao của `docs/plans/pham-vi-tri-thuc-2410.md` thật, trang đợt
  `wiki/dot/tri-thuc-2410.md` mang đủ mã), When tiêm riêng từng VẾ lỗi theo ma trận mười một hàng — `trang-thieu-nguon`:
  bỏ khoá `nguon` · `nguon: []` · frontmatter thiếu dòng `---` đóng; `nguon-khong-co`: trỏ tệp không có; `raw-bi-sua`:
  sửa một byte tệp raw · thêm tệp raw không có dòng · xoá tệp raw còn dòng; `ma-khong-co-trang`: gỡ một mã khỏi trang
  đợt; `kho-rieng-chua-day`: commit chưa đẩy lên remote trần · nhánh không theo dõi remote; `raw-trong-kho-cong-khai`:
  `cong_khai: true`, gốc trong kho, một tệp raw — Then mỗi hàng lint thoát 1 với ĐÚNG MỘT dòng lỗi mang đúng mã và
  đúng tên tệp ghim cho hàng ấy; số hàng in ra bằng 11; hàng `ma-khong-co-trang` chạy cả hai lối (`--pham-vi` và tự
  dò), mỗi lối có đối chứng xanh trước.
- AC-5: Given mười một mutant của `scripts/tri-thuc.mjs` — mỗi mutant gỡ đúng một vế kiểm — When chạy ma trận AC-4 trên
  từng mutant, Then hàng của vế bị gỡ không còn dòng lỗi ấy (thước bắt được mutant), mười hàng còn lại không đổi.
- AC-6: Given kho thử khai `kho` mà đường đã giải không có thư mục, When chạy lint và `--con-tro '<kho>:wiki/a.md#<băm>'`,
  Then cả hai thoát 3 và in «không đọc được ở đây: <tên kho>» kèm đúng dòng `git clone <remote> <đường tuyệt đối>`; không
  dòng «lỗi:» nào.
- AC-7: Given kho thử lành, When gọi `--con-tro` với ma trận năm đường trỏ — trong kho đúng băm · kho riêng đúng băm ·
  băm lệch · tệp không có · chuỗi sai khuôn — Then lần lượt thoát 0 (in đường tuyệt đối) · 0 · 1 «băm lệch: <tệp>» · 1
  «không có tệp: <tệp>» · 2 «đường trỏ sai khuôn»; sau khi commit đổi chỗ khác (không đổi nội dung tệp) và gộp squash vào
  nhánh khác, đường trỏ đúng băm vẫn thoát 0.
- AC-8: Given kho thử không có khối `tri_thuc`, When chạy lint, Then thoát 2 với đúng một dòng «kho chưa khai tri_thuc
  trong _acceptance/config.yaml»; và `scripts/product-map.mjs --check`, `scripts/lo-trinh.mjs --hang <mã>` trên bản sao
  kho kit ĐÃ XOÁ `scripts/tri-thuc.mjs` và `scripts/tri-thuc-khoa.cjs` cho đầu ra giống từng byte bản sao còn đủ tệp
  (chiều im: không bên đọc cũ nào nạp mô-đun tri thức); mutant chèn `require` mô-đun tri thức vào `product-map.mjs` thì ca
  đỏ «bên đọc cũ nạp mô-đun tri thức».
- AC-9: Given gói `tri-thuc` (`tri-thuc/.claude-plugin/plugin.json`, mục marketplace, `tri-thuc/commands/kiem.md`), When
  chạy ca P200 mở rộng và đọc lệnh, Then `tri-thuc` cùng số với acceptance-gate (đỏ «tri-thuc lech so» khi tiêm số khác),
  `kiem.md` không khoá model-invocation, và khối `TT-KIEM-LENH` của nó chứa đúng dòng lệnh lint mà ca AC-3 chạy.
- AC-10: Given cây đã sửa (gói thứ sáu trong `marketplace.json`), When chạy TRỌN suite `tests/plugins` và
  `tests/scripts/lo-trinh.test.mjs`, Then cả hai thoát 0 — không khối nào duyệt marketplace đỏ vì gói mới, không ca cũ
  nào đổi phán quyết.

## Coverage

Bỏ quét hình thái — entry `descope` «bỏ coverage-scan» trong `decisions.jsonl`: không gian do bản phạm vi định sẵn (A1
khai + khuôn, A2 sáu lỗi, A3 đường trỏ); mỗi phần có ma trận viết sẵn và chiều đỏ.

- A1 khai và khuôn: AC-1, AC-2, AC-3. A2 lint: AC-4, AC-5, AC-6. A3 đường trỏ: AC-7. Chiều im: AC-8. Gói: AC-9. Hồi quy: AC-10.

## Đường đo

- Thước của ô (sống: mỗi lỗi trong sáu lỗi tiêm riêng làm lint đỏ đúng thông điệp, kho lành xanh) · số từ: ca
  `tests/scripts/kho-tri-thuc-va-lint.test.mjs` chạy trong lượt chấm · bảo đảm bởi AC-3, AC-4, AC-5.

## Out of scope

- Ghi tri thức, năm loại nguồn, răng riêng tư lúc ghi — TT2.
- Nguồn bản phạm vi trỏ trang tri thức, dòng «Nguồn:» của ô — TT3. Dòng «đã tra» ở bước thiết kế và thẻ — TT4.
- Chỉ mục commit, `log.md`, `/tri-thuc:xem` — bỏ hoặc chờ điều kiện (TT-C4).
- Lint nghĩa — TT-C2.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Known limits:
  - `kho-rieng-chua-day` đọc nhánh theo dõi của kho riêng ở máy; máy chưa `git fetch` thì có thể báo «chưa đẩy» cho commit
    đã đẩy từ máy khác. Ngưỡng mở: 1 lần lint đỏ giả vì lý do này.
  - Đường nền của vòng chưa chạy: hook khoá máy của đợt crm đang chạy chặn `duong-nen.mjs` (phiên đứng ở thư mục crm).
