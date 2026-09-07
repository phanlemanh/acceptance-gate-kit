# Design — `**/` khớp cả gốc kho trong bộ khớp glob của cổng (glob-hai-sao-khop-goc-kho)

> Hồ sơ phát hiện: [2026-09-07-file-chi-dan-may-va-luat-stale.md](../../findings/2026-09-07-file-chi-dan-may-va-luat-stale.md).
> Owner duyệt mở ô 08/09. Hạng T3 vì chạm `scripts/pre-merge-check.sh` (`t3_paths`).

## Vấn đề (một câu)

Repo tiêu thụ khai `**/*.md` trong `risk_tiers.t1_skip_globs` với ý «mọi
markdown là tài liệu», nhưng `match_globs` là `case` của bash — `**/` đòi ít
nhất một dấu `/` — nên file `.md` ở gốc kho (`AGENTS.md`, `CLAUDE.md`,
`README.md`…) vẫn bị coi là mã: bốn hồ sơ stale trong một ngày ở CRM do commit
thuần tài liệu, hồ sơ vừa ký 20 phút đã cũ vì sáu dòng ghi chú.

## Quyết định

**Cộng ngữ nghĩa, không đổi ngữ nghĩa.** Mẫu chứa `**/` khớp thêm bản đã bỏ
đoạn `**/` đó (không-hoặc-nhiều thư mục, đúng gitignore/minimatch). Mọi thứ
khác của `case` giữ nguyên — đặc biệt `*` vẫn vượt `/`, nên `*.md` và
`docs/**` mà mọi consumer đang khai không đổi nghĩa.

Phương án bác: chuyển toàn bộ sang minimatch đầy đủ (`*` không vượt `/`).
Bác vì nó đổi nghĩa lời khai đang sống ở mọi repo (`*.md` sẽ thôi khớp
`docs/a.md`; template `acceptance-init` và GUIDE đều dạy «docs, *.md»).

## Cơ chế

Trong `scripts/pre-merge-check.sh`, một hàm sinh biến thể đặt cạnh
`match_globs`:

```
glob_variants <đã-xử-lý> <phần-còn-lại>
  phần-còn-lại có "**/" → tách tại lần xuất hiện ĐẦU:
      biến thể BỎ   : glob_variants "<đã>+<trước>"      "<sau>"   # GLOB-DOUBLESTAR-ZERO-DIRS
      biến thể GIỮ  : glob_variants "<đã>+<trước>**/"   "<sau>"
  không còn "**/" → in <đã>+<còn-lại>
match_globs <path> <globs>: với mỗi glob, với mỗi biến thể → case "$path" in $v) return 0
```

Hai lần `**/` cho 4 biến thể; số lần trong thực tế ≤ 2. Dòng «biến thể BỎ»
mang marker để răng mutant gỡ đúng nó (AC-8).

`match_globs` là bộ khớp DUY NHẤT của kit (phía JS chỉ `includes('PRODUCT-MAP.md')`),
và nó phục vụ cả ba nơi gọi: `stale_files` (T1), phân loại diff T1-escape
(T1), và `t3_paths` (T3). Với T3 việc nới `**/auth/**` bắt thêm `auth/x` là
chiều RỘNG HƠN bảo vệ — an toàn.

## Không gian ca đo (morphological scan, preset test-matrix)

Chân sản phẩm: config kit `[SUY-TỪ-REPO: _acceptance/config.yaml]`, config
CRM (đọc, không sửa), template `[SUY-TỪ-REPO: commands/acceptance-init.md]`,
hình dạng đường dẫn từ `git diff --name-only` `[SUY-TỪ-REPO: scripts/pre-merge-check.sh stale_files]`.
Chân ngành: `[NGÀNH: gitignore pattern format]` · `[NGÀNH: minimatch README]`
— cả hai định nghĩa `**/` = không-hoặc-nhiều thư mục.

- Trục A · hình dạng glob: a1 tên đích danh · a2 `*.ext` · a3 `dir/**` ·
  a4 `**/X` tiền tố · a5 `a/**/b` giữa · a6 `?`/`[…]` [thước CE: ngành gitignore + mọi glob đang khai ở kit/CRM/template]
- Trục B · hình dạng đường dẫn: b1 gốc không `/` · b2 một cấp · b3 nhiều cấp ·
  b4 cùng tên khác đuôi (chiều đỏ) [thước CE: đầu ra `git diff --name-only`, tương đối, không `./`]
- Trục C · nơi gọi: c1 `stale_files` · c2 phân loại diff T1-escape · c3 `t3_paths`
  [thước CE: grep `match_globs` trong script — 3 nơi, đủ]

Core (10/≈45 ô có nghĩa): a4·b1·c1 (ca CRM) · a4·b2·c1 và a4·b3·c1 (không hồi
quy) · a4·b4·c1 (không nới quá đuôi) · a5·b2·c1 (giữa) · a2·b1·c1 (`*.md`
không đổi nghĩa) · a1·b1·c1 và a3·b2/b3·c1 (glob không có `**/` đi qua nguyên
vẹn — gap-probe P1) · a4·b2·c3 và a4·b1·c3 (T3 cùng bộ khớp, cả gốc kho —
gap-probe P2) · mutant gỡ biến thể BỎ · dòng GUIDE. Later: a6 (bash `case` đã hỗ trợ, chưa ai khai — ghi khi có
consumer dùng). Never: minimatch đầy đủ (lý do ở Quyết định) · a4·b1·c2 riêng
(c2 dùng cùng `DIFF_*` với c3, ca c3 đã đi qua đúng nhánh phân loại).

## Kế hoạch đo (measure-birth: cặp hai chiều cùng fixture)

Fixture code-sinh `mk_glob_repo <root> <glob-list> <file-đổi>` trong
`tests/scripts/run-tests.sh` (cùng khuôn `mk_git_repo`), ca HS01–HS10; chi
tiết chiều đỏ ở `evals.yaml`. Đối chứng đỏ thường trực: HS03 (`src/app.js`
vẫn stale) và HS08 (mutant gỡ marker → ca CRM đỏ lại).

## Ngoài phạm vi

- Không đổi thông điệp VIOLATION stale để gợi glob — chờ consumer thứ hai vấp.
- Không chạm config CRM (kho khác, chủ kho tự quyết `"*.md"` hay để `**/`).
- Không thêm ca cho `?`/`[…]`.

## Tài liệu

GUIDE §8, hàng `risk_tiers.t1_skip_globs`: một câu về ngữ nghĩa glob (`*`
vượt `/`; `**/` = không-hoặc-nhiều thư mục; ví dụ `**/*.md` bắt cả `AGENTS.md`).
