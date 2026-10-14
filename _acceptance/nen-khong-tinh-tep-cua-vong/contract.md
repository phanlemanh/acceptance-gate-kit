---
schema_version: 1
feature: Đường nền không đổ đỏ cho tệp mà chính vòng viết trong lúc nền chạy — tệp mang slug của vòng và vi phạm lưới của chính hồ sơ thành dòng vàng có tên, không lật nền
slug: nen-khong-tinh-tep-cua-vong
owner: manh@mstar.vn
risk_tier: T2               # feature-loop/scripts/duong-nen.mjs + khuôn đường nền + scripts/gate-card.js (khối Nền hạ tầng) + test + một câu SKILL/GUIDE — không chạm lib/**, hook, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-14-nen-khong-tinh-tep-cua-vong-design.md
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: nen-khong-tinh-tep-cua-vong

## Context

Gốc: crm-onehub#375 (Mac Studio 13/10 16:51Z) — ba ca trong hai ngày: crm `lich-su-va-luu-tru-trang`,
crm `dai-luu-tru-dung-chung`, kit `bang-ngoai-n-co-can-cu`. S1#0 chạy đường nền ở nền rồi soạn S1 song
song; tệp S1 ghi vào cây trong lúc chân suite chạy nên chân suite gọi chúng `CAY BAN SAU SUITE`, và chân
lưới đọc hồ sơ viết dở thành `VIOLATION [<slug>]` — nền đỏ dù hạ tầng lành. Đo 14/10: 233 dòng `CAY BAN`
lịch sử ở 43 hồ sơ, 0 đỏ thật. Chủ kho ký Cổng Đáng «Làm A» 14/10: lọc tại chỗ, không worktree (vỡ 4/8
kho), không khoá cấu hình mới.

## Criteria

- AC-1: Given kho thử lành của đường nền với slug vòng `<slug>`, When một suite ghi trong lúc chạy hai tệp
  MỚI dưới `_acceptance/<slug>/` (contract.md, decisions.jsonl) và chạy `duong-nen.mjs --slug <slug>`,
  Then mã 0, frontmatter `nen: xanh` và `suite: xanh`, mục «Dòng đỏ» đúng một bullet «không có», và tập
  bullet của mục «Dòng vàng» BẰNG {`nen suite: TEP CUA VONG <tệp>`} cho đúng hai tệp ấy (đẳng thức tập).
- AC-2: Given kho thử lành, When suite ghi `docs/superpowers/specs/<ngày>-<slug>-design.md`,
  `docs/superpowers/plans/<ngày>-<slug>.md` và sửa `_acceptance/config.yaml` đã theo dõi, Then mã 0, chân
  suite xanh, ba tệp đều ở mục «Dòng vàng» với khuôn `TEP CUA VONG`, mục «Dòng đỏ» «không có».
- AC-3: Given kho thử lành, When suite ghi `apps/proto/<slug>/index.tsx` (thư mục `apps/proto/<slug>/`
  không có ở HEAD), Then tệp ấy ở mục «Dòng vàng» và mã 0; và Given kho thử có SẴN ở HEAD thư mục
  `goi/<slug>/` (slug trùng một thư mục đã theo dõi), When suite ghi `goi/<slug>/rac.txt`, Then mã 1 và
  đúng một dòng đỏ `nen suite: CAY BAN SAU SUITE goi/<slug>/rac.txt`.
- AC-4: Given kho thử lành, When MỘT lượt suite ghi cùng lúc một tệp của vòng (`_acceptance/<slug>/a.md`)
  và bốn tệp KHÔNG của vòng — sửa `README.md`, ghi `_acceptance/demo/rac.md` (hồ sơ khác), ghi
  `_acceptance/<slug>-2/a.md` (tiền tố của slug), ghi `docs/superpowers/specs/<ngày>-<slug>x-design.md`
  (tên gần giống) — Then mã 1, `suite: do`, tập dòng đỏ `CAY BAN SAU SUITE` BẰNG bốn tệp không của vòng,
  tập dòng vàng BẰNG {`_acceptance/<slug>/a.md`} — dòng vàng không che dòng đỏ nào.
- AC-5: Given kho thử có lưới trước-merge THẬT (`scripts/pre-merge-check.sh` vendored), When (a) suite ghi
  trong lúc chạy hồ sơ `_acceptance/<slug>/` sinh `VIOLATION [<slug>]`, (b) nhánh gốc mang sẵn hồ sơ khác
  sinh `VIOLATION [demo]`, (c) cả hai, (d) bản sao lưới in `VIOLATION [<slug>]` rồi chết vì một lệnh hỏng
  (mã 1, không dòng tóm `violation(s) — merge blocked`), (e) nhánh gốc mang hồ sơ `<slug>-2` vi phạm,
  Then (a) mã 0, `luoi: xanh`, mục «Dòng vàng» có `nen luoi: 1 vi pham cua chinh vong (khong tinh)` và
  nguyên văn dòng `VIOLATION [<slug>]`, không dòng `LOI CHAY`; (b) mã 1, `luoi: do`,
  `nen luoi: 1 vi pham co san` + nguyên văn như trước vòng; (c) mã 1, dòng đỏ đếm ĐÚNG 1 (chỉ `[demo]`),
  dòng `[<slug>]` ở mục vàng; (d) mã 1, `luoi: do`, dòng đỏ `nen luoi: LOI CHAY ma 1`; (e) mã 1, dòng đỏ
  `nen luoi: 1 vi pham co san` + nguyên văn `VIOLATION [<slug>-2]`, mục vàng «không có».
- AC-6: Given khuôn `skills/acceptance/references/duong-nen-template.md`, When (a) chạy kho lành không tệp
  của vòng, (b) bản sao ag-root gỡ mã `suite-tep-cua-vong` khỏi khối `DUONG-NEN-DONG-VANG`, (c) bản sao gỡ
  cả khối ấy, Then (a) tệp ghi ra có mục «Dòng vàng» đúng một bullet «không có», không dòng marker nào lọt
  ra; (b) mã 2, stderr `khuôn dòng vàng thiếu mã «suite-tep-cua-vong»`, không ghi tệp; (c) mã 2, stderr
  nêu `DUONG-NEN-DONG-VANG`, không ghi tệp; (d) bản sao gỡ mã `luoi-cua-vong` → mã 2, stderr
  `khuôn dòng vàng thiếu mã «luoi-cua-vong»`, không ghi tệp.
- AC-7: Given `duong-nen.md` do CHÍNH script ghi ở ca AC-1 và ca AC-4, When dựng thẻ Cổng Phạm vi (HTML
  `gate-card.js` in ra) của hồ sơ, Then khối «Nền hạ tầng» in dưới nhãn «Tệp của chính vòng — nền không
  tính» nguyên văn MỌI bullet của mục «Dòng vàng» (tập dòng sau khi bỏ thoát HTML BẰNG tập trong tệp); ca
  AC-1 không có cờ «Nền hạ tầng có chân ĐỎ», ca AC-4 có; và When dựng thẻ Cổng Bằng chứng trên cùng hai
  tệp (hồ sơ kèm báo cáo REJECT có eval suite đỏ), Then câu «đỏ từ trước vòng» chỉ dựa trên dòng đỏ:
  ca AC-1 không có câu ấy, ca AC-4 có (đối chứng dương), và không dòng `TEP CUA VONG` nào lên thẻ Cổng 2
  như một dòng nền đỏ; và với `duong-nen.md` do bản gốc v2.30.0 ghi (`git archive v2.30.0 feature-loop skills scripts lib`,
  trọn thư mục) thẻ không in nhãn ấy và khối giữ nguyên chữ như bản gốc dựng.
- AC-8: Given bốn đột biến trên bản sao `duong-nen.mjs` — (a) vị từ tệp-của-vòng luôn sai, (b) luôn đúng,
  (c) bỏ vế «thư mục không có ở HEAD», (d) mẫu khớp VIOLATION bỏ dấu `]` — When chạy CHÍNH phép đo của
  AC-1/AC-3/AC-4/AC-5(e) trên bản sao (bản lành chạy trước trên cùng kho thử phải xanh), Then (a) đỏ nêu
  `_acceptance/<slug>/contract.md` thành dòng đỏ, (b) đỏ nêu `README.md` lọt vào mục vàng, (c) đỏ nêu
  `goi/<slug>/rac.txt` lọt vào mục vàng, (d) đỏ nêu `[<slug>-2]` lọt vào mục vàng; mỗi chỗ tiêm khớp
  đúng một lần.
- AC-9: Given bản vòng, When chạy trọn `tests/scripts/duong-nen.test.mjs` và
  `tests/scripts/gate-card-duong-nen.test.mjs`, Then mọi ca có từ trước vòng (NEN0…NEN9, NEN-TD*, NEN-LC*,
  NEN-ENV*, NEN-CB*, NEN-DK*, GN1…GN5) vẫn xanh — hành vi với tệp không của vòng y như 2.30.0.
- AC-10: Given `tests/scripts/fixtures/duong-nen-cay-ban-lich-su.tsv` (230 dòng `CAY BAN` duy nhất rút
  14/10 từ lịch sử thật, mỗi dòng slug · lớp · đường), When đưa từng đường qua CHÍNH vị từ mà
  `duong-nen.mjs` dùng (nhập từ mô-đun, không chép lại) với slug của dòng và thư mục coi như chưa có ở
  HEAD, Then số đếm BẰNG: GIA-S1 197/197 vàng · KHAC 3 vàng 26 đỏ · CAT 4/4 đỏ, và bảy dòng của hồ sơ
  `dai-luu-tru-dung-chung` (ca Gốc) đều vàng; tệp có đúng 230 dòng dữ liệu (đối chứng: tệp hỏng hay rỗng
  là ĐỎ, không phải xanh rỗng).

## Coverage

Trục (kê tay, không quét hình thái — entry descope «bỏ coverage-scan» trong sổ): lớp đường của chân
suite {hồ sơ của vòng · khuôn tên spec/plan · `config.yaml` · đoạn thư mục MỚI bằng slug · đoạn thư mục
CÓ SẴN bằng slug · hồ sơ khác · tiền tố/tên gần giống · tệp thường} × {một mình · lẫn với đỏ thật} →
AC-1..AC-4; chân lưới {chỉ của vòng · chỉ hồ sơ khác · cả hai · chết sau khi in vi phạm · tiền tố slug} →
AC-5; khuôn một nguồn và đường hỏng của khuôn (hai mã vàng) → AC-6; bên đọc thẻ Cổng 1 + Cổng 2 + đường
đọc-cũ → AC-7; độ nhạy của chính phép đo (bốn đột biến) → AC-8; không hồi quy → AC-9; vị từ trên dữ liệu
lịch sử thật (ma trận toàn phần 230 dòng) → AC-10.

## Out of scope

- Chạy nền trên worktree tạm ở HEAD (lối A2) — CỘNG, tách ra hạt giống `docs/plans/2026-10-14-hat-giong-nen-tren-worktree-head.md`.
- 29/233 dòng lịch sử là mã / bản mẫu phiên viết song song mà đường không mang slug — không phân biệt được với rác suite; vẫn đỏ.
- `DO SAN` của ca corpus ở kit (hồ sơ mới chưa lên bản đồ) — mã thoát, không phải đường tệp; vào hạt giống trên.
- Ghi lại `duong-nen.md` của hồ sơ cũ theo khuôn mới — đường đọc-cũ đủ.
- Khoá frontmatter đếm dòng vàng — thẻ đọc mục, không cần khoá.

## Notes

- Đánh đổi duy nhất đã khai ở Cổng Đáng: suite ghi vào `_acceptance/config.yaml` sẽ hiện vàng thay vì đỏ (0/233 ca lịch sử).
- Giới hạn: slug trùng một thư mục MỚI mà suite tự tạo (không có ở HEAD) sẽ hiện vàng — chỉ xảy ra khi suite tình cờ đặt đúng tên slug sinh sau nó.
