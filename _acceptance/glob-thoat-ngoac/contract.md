---
schema_version: 1
feature: Mục paths viết theo thành ngữ thoát ngoặc của glob («[[]slug]» = thư mục «[slug]») được hiểu đúng ở cả làn ghim lại, bộ lọc hoá cũ và kế hoạch mang sang của S4 — không còn gắn oan «ô ngoài làn máy có vật đổi», không còn mang sang eval mà tệp của nó đã đổi
slug: glob-thoat-ngoac
owner: manh.phan@onemount.com
risk_tier: T3               # chạm lib/evidence-core.cjs — trong risk_tiers.t3_paths
surfaces: [cli]
status: approved
design_doc: docs/superpowers/specs/2026-10-09-glob-thoat-ngoac-design.md
approved_by: Phan Le Manh
approved_at: 2026-10-09
---

# Acceptance Contract: glob-thoat-ngoac

Gốc: crm/_acceptance/dien-thoai-ca-nhan

## Context

Đợt điều phối crm sau-14-10, 09/10, kit 2.25.0 (yêu cầu P6-9). Ghim lại `dien-thoai-ca-nhan`
(`repin-20261009T051019Z-68477`) gắn `evals_not_machine_touched` cho E1, E16, E17, E20 — bốn ô ui-check có
`paths` dạng `apps/app/app/(app)/[[]slug]/contacts/**` — trong khi `git diff 974cb5c9..c6a618f` không chạm
`apps/` hay `packages/`. E18, E19 (đường thường) không bị gắn. Dòng pin vì thế đòi «đi vòng S4 delta» oan.

Gốc lỗi: bộ dịch glob của kit chỉ hiểu `*` và `?`; `[` và `]` được thoát thành ký tự thường. `[[]` là thành ngữ
của fast-glob/micromatch/bash cho một dấu `[` thật (lớp ký tự chỉ chứa `[`), nên `[[]slug]` nghĩa là thư mục
`[slug]` của Next.js. Kit đọc nó thành chuỗi `[[]slug]` theo nghĩa đen → không khớp tệp nào →
`phanLoaiMucPaths` trả «paths-khong-tro-toi-tep» → `chamTuPin` coi mọi diff khác rỗng là «chạm».

Cùng lớp, ba nơi dùng hai bản dịch glob chép nhau:
1. `feature-loop/scripts/repin-lane.mjs` `chamTuPin` → báo thừa (ca crm).
2. `lib/evidence-core.cjs` `staleByPaths` → rơi về luật cũ (giữ mọi tệp) — thận trọng, không hại.
3. `feature-loop/scripts/carry-plan.mjs` `globToRe` (đường phán quyết S4) → eval có `paths` dạng này không bao
   giờ thấy diff chạm nó, nên được MANG SANG kể cả khi tệp của nó đã đổi — chiều xanh giả.

Ràng buộc «cân trên mọi kho» (đo 09/10): 102 tệp `evals.yaml` ở crm viết `[slug]` TRẦN và đường đó đang chạy
đúng (dấu ngoặc theo nghĩa đen). Vì thế bản sửa chỉ nhận đúng hai thành ngữ `[[]` → `[` và `[]]` → `]`, KHÔNG
biến `[` thành lớp ký tự chung. Một mục mang thành ngữ thoát được đối xử như glob ở bộ phân loại kể cả khi
không có `*` (crm có `…/[[]slug]/contacts/create-contact-sheet.tsx`).

## Criteria

- AC-1: Given bảng glob viết trước {`a/[[]slug]/c/**`, `a/[[]slug]/c/x.tsx`, `a/[]]/x`, `a/[slug]/c/**` (trần),
  `a/(app)/[[]slug]/[[]id]/*.tsx`} × bảng tệp {`a/[slug]/c/x.tsx`, `a/s/c/x.tsx`, `a/[[]slug]/c/x.tsx`, `a/]/x`,
  `a/(app)/[slug]/[id]/p.tsx`}, When dịch bằng `pathGlobToRe` (lib) và `globToRe` (carry-plan), Then mỗi ô khớp
  đúng bảng kỳ vọng viết trước — thành ngữ khớp tệp có dấu ngoặc thật; `[slug]` trần vẫn khớp `a/[slug]/c/x.tsx`
  như hôm nay — và hai hàm cho cùng kết quả ở MỌI ô.
- AC-2: Given cây có `apps/app/app/(app)/[slug]/contacts/x.tsx`, When `phanLoaiMucPaths` phân loại
  `apps/app/app/(app)/[[]slug]/contacts/**` và `apps/app/app/(app)/[[]slug]/contacts/x.tsx` (không `*`), Then cả
  hai `nhan: true` với `glob` khớp đúng tệp đó. And mục thành ngữ không `*` trỏ vào tệp không có
  (`apps/app/app/(app)/[[]slugg]/contacts/x.tsx`) → `nhan: false`, mã `paths-khong-tro-toi-tep`. Chiều im:
  `apps/app/app/(app)/[slug]/contacts/**` (trần) và một mục thường trỏ vào thư mục không có giữ đúng kết quả của
  bảng viết trước (trần nhận, thư mục không có bị từ chối cùng mã).
- AC-3: Given kho mẫu có hồ sơ đã ký với một ô ui-check mang NGUYÊN VĂN khối `paths` tám mục của ô E1 ở crm
  `_acceptance/dien-thoai-ca-nhan/evals.yaml` (sha `f58f27802`, có mục `apps/app/app/(app)/[[]slug]/contacts/**`)
  và một ô ui-check đường thường, cây có tệp cho mọi mục, When làn ghim lại chạy sau một diff KHÔNG chạm `apps/`
  hay `packages/`, Then `evals_not_machine_touched` vắng. And khi diff chạm đúng
  `apps/app/app/(app)/[slug]/contacts/x.tsx`, Then `evals_not_machine_touched` chứa ô E1 và không chứa ô đường
  thường.
- AC-4: Given `evals.yaml` dựng dạng VĂN BẢN trong lần chạy, eval khai một dòng
  `paths: ["apps/app/app/(app)/[[]slug]/contacts/**"]`, round trước xanh, When kế hoạch mang sang của
  `carry-plan.mjs` đọc tệp đó bằng chính bộ đọc của nó với `deltaFiles` chứa
  `apps/app/app/(app)/[slug]/contacts/x.tsx`, Then mục đọc ra BẰNG chuỗi gốc (khứ hồi) và eval vào `rerun` với lý
  do bắt đầu «diff-fix chạm». Đối chứng: `deltaFiles` không chạm → eval được mang sang.
- AC-5: Given kho mẫu với hồ sơ đã ký có eval máy khai `paths` thành ngữ, When lưới hoá cũ (`staleByPaths`, qua
  `pre-merge-check.sh`) đọc một diff chạm `apps/app/app/(app)/[slug]/contacts/x.tsx`, Then hồ sơ hoá cũ và tệp đó
  có trong danh sách giữ lại. Chiều im: diff chỉ chạm một tệp ngoài mọi `paths` → hồ sơ KHÔNG hoá cũ.
- AC-6: Given bản sao với đúng một mảnh bị gỡ, When chạy lại ca, Then ca đỏ với thông điệp ghim: gỡ thành ngữ ở
  `pathGlobToRe` → AC-3 chiều im gắn oan; gỡ ở `globToRe` → AC-4 mang sang eval đã chạm; gỡ nhánh «thành ngữ là
  glob» ở `phanLoaiMucPaths` → mục không `*` của AC-2 bị từ chối; nhánh thành ngữ bỏ kiểm tồn tại → mục trỏ tệp
  không có của AC-2 được nhận; bộ đọc `paths` của `carry-plan` cắt ở dấu `]` đầu tiên → AC-4 khứ hồi đỏ. Kim khớp
  đúng một lần.
- AC-7: Given cây sau sửa, When chạy bốn bộ test của CI, Then mọi bộ xanh.

## Coverage

| Trục | Giá trị | AC |
|---|---|---|
| A. Dạng mục | thành ngữ + `**` · thành ngữ không `*` · thành ngữ trỏ tệp không có · `[]]` · `[slug]` trần · hai thành ngữ một mục · khối tám mục nguyên văn crm | AC-1, AC-2, AC-3 |
| B. Nơi dùng | `pathGlobToRe` (lib) · `globToRe` (carry-plan) · `phanLoaiMucPaths` · `chamTuPin` · bộ đọc + kế hoạch mang sang · `staleByPaths` | AC-1…AC-5 |
| C. Diff | không chạm · chạm đúng tệp có ngoặc thật · chạm ngoài mọi `paths` | AC-3, AC-4, AC-5 |

## Out of scope

- Lớp ký tự glob đầy đủ (`[abc]`, `[!a]`), ngoặc nhọn `{a,b}` — đổi nghĩa của `[slug]` trần mà 102 tệp crm đang
  dựa vào; ngưỡng mở lại ở Notes.
- Cảnh báo dạng thoát ngoặc ở S1 — không cần khi bộ đọc hiểu đúng.
- Sửa `evals.yaml` hay bất cứ gì ở crm.
- Bộ đọc `paths` dạng khối (block seq) của `carry-plan.mjs` (hôm nay nó chỉ đọc dạng `[...]` một dòng và coi
  dạng khối là «thiếu paths — luôn chạy lại», tức thận trọng).

## Notes

- Known limits: chỉ hai thành ngữ `[[]` và `[]]`. Ngưỡng mở lại: ≥1 eval ở kho tiêu thụ khai `paths` bằng lớp ký
  tự khác (`[ab]`, `[!x]`) hoặc ngoặc nhọn.
- Kiểm ngoài (không phải AC — vật ở crm): sau khi crm cài mốc mang bản sửa, ghim lại `dien-thoai-ca-nhan` trên
  diff `974cb5c9..c6a618f` — dòng pin phải VẮNG `evals_not_machine_touched`. Chỉ đọc kết quả, không sửa crm.
- Hạng T3: `lib/evidence-core.cjs` nằm trong `risk_tiers.t3_paths` (thêm Gate 1.5 duyệt kế hoạch).
