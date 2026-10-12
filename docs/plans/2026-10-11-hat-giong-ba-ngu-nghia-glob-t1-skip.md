# Hạt giống — ba ngữ nghĩa glob cho `t1_skip_globs`: S4 có thể xếp tài liệu của kho vào lớp vật

Gốc: `_acceptance/ci-cua-kho-bo-job-nang/` (thiết kế §3–§4, đo 11/10/2026 khi chọn bộ khớp cho chế độ `--hang-pr`).
Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài.

## Phát hiện

Kit đọc CÙNG một danh sách `risk_tiers.t1_skip_globs` bằng ít nhất ba ngữ nghĩa glob khác nhau:

| Bên đọc | Ở đâu | `*` vượt `/`? |
|---|---|---|
| Cổng (T1-escape, hoá cũ) | `scripts/pre-merge-check.sh` `match_globs` (bash `case`) | có |
| Lớp `ngoai` của vùng vật S4 | `feature-loop/scripts/lib/phan-loai.mjs` → `globToRe` của `feature-loop/scripts/carry-plan.mjs` | không |
| Bản đo của khảo sát 11/10 | `docs/findings/assets/2026-10-11-khao-sat-actions-va-phien/savings.mjs` `g2r` | không |

Đo 11/10 (bộ khớp của cổng rút nguyên văn, `globToRe` nạp từ mô-đun):

| Glob | Tệp | bash cổng | `globToRe` |
|---|---|---|---|
| `*.md` | `docs/a.md` | true | false |
| `**/*.md` | `AGENTS.md` | true | true |
| `docs/**` | `docs/x/y` | true | true |
| `src/*.ts` | `src/a/b.ts` | true | false |

Hệ quả nghi ngờ: kho khai `*.md` (hay `x/*.ext`) trong `t1_skip_globs` để miễn tài liệu ở mọi tầng thư mục — cổng
miễn đúng, nhưng S4 xếp `docs/a.md` vào lớp `vat` thay vì `ngoai`, nên finding trên tài liệu có thể bị tính là
finding trên vật (vùng vật, bộ lọc ngoài-vật). crm khai `**/*.md` (khớp như nhau ở hai bên) nên hôm nay chưa thấy.

Không sửa ở vòng `ci-cua-kho-bo-job-nang`: chế độ `--hang-pr` dùng chính bộ khớp của cổng nên không mắc lỗi này;
sửa `globToRe` đổi nghĩa `paths` của eval ở mọi kho (ngữ nghĩa «`*` không vượt `/`» là có chủ đích ở đó).

## Cùng vùng: tên tệp có dấu không bao giờ khớp `t1_skip_globs` ở cổng

Đo 12/10 (ca `AC-1` hàng `ten-co-khoang` của `tests/scripts/hang-pr.test.mjs`): `git diff --name-only` mặc định
bọc tên non-ASCII trong nháy kép + mã bát phân (`"docs/c\303\263 kho\341\272\243ng.md"`, `core.quotePath`), và
`pre-merge-check.sh` đưa nguyên chuỗi ấy vào `match_globs` → `docs/có khoảng.md` KHÔNG khớp `docs/**`. Hệ quả ở
cổng: PR chỉ thêm tài liệu tên tiếng Việt có dấu bị luật T1-escape đòi hồ sơ, và luật hoá cũ coi nó là «mã đổi
sau verify». Hướng: cổng đọc diff bằng `git -c core.quotePath=false diff --name-only` (hoặc `-z`) — đổi hành vi
cổng ở mọi kho, nên cân ở Cổng Đáng. Ngưỡng mở ô: ≥1 PR thật ở một kho tiêu thụ bị chặn hoặc làm hoá cũ hồ sơ
chỉ vì tên tệp có dấu.

## Cùng vùng: hai lỗ bỏ test của `--hang-pr` thừa hưởng từ cổng (Cổng Bằng chứng 12/10)

Chủ kho chọn «mở hợp đồng mới» cho Ngoài-1/2/3 của hồ sơ `ci-cua-kho-bo-job-nang` (lượt chấm 1, sổ
`d-20261012T000430Z-13..15`); theo luật «ô chỉ mở khi có neo ngoài», lối ấy ghi vào đây, không tạo ô.

- **Đổi tên vào vùng T1.** `git diff --name-only base...HEAD` của cổng dò đổi tên, chỉ in đường ĐÍCH: PR chỉ có
  `git mv src/app.js docs/app.js` ra `hang=T1 · cham_vat=false` (tái hiện trong lượt chấm). Cổng không cờ có cùng
  lỗ ở T1-escape. Hướng: tính danh sách bằng `--no-renames` (đổi mặc định cổng — cân ở Cổng Đáng), hoặc riêng trong
  vùng `HANG-PR` một bậc nghi ngờ «có đổi tên → chạy đủ» (không đổi cổng).
- **`_acceptance/` lồng ở mọi độ sâu.** Nhánh `_acceptance/*|*/_acceptance/*` của khối phân loại xếp fixture test
  (`tests/hooks/fixtures/repo/_acceptance/…` trong chính kit) vào «hồ sơ» → `cham_vat=false`. Hướng: chế độ chỉ
  coi là hồ sơ tệp dưới đúng `$ROOT/_acceptance/`.

Chốt chặn hôm nay: GUIDE §5.3 giữ test chạy đủ trên `push` (không `--base`), nên một lần bỏ nhầm ở PR lộ ở lượt CI
trên nhánh chính ngay sau khi gộp. Ngưỡng mở ô: ≥1 PR thật ở một kho đã bật `--hang-pr` bị bỏ test vì một trong
hai lỗ này (đọc ở Cổng Giá trị của hồ sơ, đối chiếu job `test` `skipped` với tệp của PR).

## Hướng

Một trong hai, cân ở Cổng Đáng khi mở ô: (a) lớp `ngoai` của `phan-loai.mjs` hỏi bộ khớp của cổng thay vì
`globToRe` (giống `product-map.mjs` đang làm); (b) khai ngữ nghĩa glob của `t1_skip_globs` một chỗ và đo ba bên
bằng một ma trận viết trước.

## Ngưỡng mở ô

≥ 1 lượt S4 thật ở một kho tiêu thụ xếp sai lớp một tệp vì khác biệt glob này (tệp khớp `t1_skip_globs` theo cổng
mà vào lớp vật của S4).
