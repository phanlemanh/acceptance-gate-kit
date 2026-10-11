---
schema_version: 1
feature: CI của kho bỏ job nặng cho PR không chạm vật bằng một chế độ của chính cổng — `pre-merge-check.sh --hang-pr` in hạng PR + bit cham_vat ra GitHub output, đọc đúng t1_skip_globs/t3_paths của kho bằng đúng bộ khớp của cổng; nghi ngờ thì chạy đủ; kho không gọi cờ thì cổng không đổi byte
slug: ci-cua-kho-bo-job-nang
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm scripts/pre-merge-check.sh — trong risk_tiers.t3_paths (hàng lộ trình C1 ghi T2)
surfaces: [ci, cli]
status: verified
design_doc: docs/superpowers/specs/2026-10-11-ci-cua-kho-bo-job-nang-design.md
approved_by: manh
approved_at: 2026-10-11
---

# Acceptance Contract: ci-cua-kho-bo-job-nang

Gốc: crm/_acceptance/giam-phut-acceptance

## Context

crm trả ≈ 98 % tiền Actions của tài khoản; 30 ngày tới 11/10, 30 % phút của crm là test sản phẩm trên PR không
đổi dòng mã nào — 17 % PR chỉ T1, 12,5 % PR chỉ hồ sơ (`docs/findings/2026-10-11-khao-sat-chi-phi-actions-va-thoi-gian-phien.md`
§1.1). crm PR #369 tự bỏ job nặng cho PR chỉ T1 bằng cách rút `glob_variants`/`match_globs` khỏi bản chép
`scripts/pre-merge-check.sh` bằng `sed`: kit đổi tên hàm là crm mất khoản tiết kiệm mà không ai biết. PR chỉ hồ sơ
chưa ai lo. Chủ kho quyết build ở Cổng Đáng 11/10 với chính sách «nghi ngờ thì chạy đủ» (ô cơ hội cùng thư mục).

Vòng này thêm một chế độ của CHÍNH cổng: cùng tiến trình, cùng `match_globs`, cùng `config_list`, cùng các biến
khối «Phân loại diff-chịu-cổng» — nên hạng chế độ in ra là hạng cổng xử. Thiết kế + phương án đã loại: design doc.

## Criteria

- AC-1: Given kho mẫu git dựng trong lần chạy, config khai `t1_skip_globs` {`docs/**`, `*.md`, `**/*.txt`,
  `.github/workflows/ci.yml`} và `t3_paths` {`core/**`}, When một PR (base...HEAD) đổi đúng tập tệp của từng hàng
  trong ma trận viết trước — chỉ T1 · `*` vượt `/` (`notes/x/y.md`) · `**/` khớp gốc (`README.txt`) · chỉ hồ sơ ·
  hồ sơ + T1 · thước của hồ sơ (`_acceptance/s1/rang/do.mjs`) · vật · vật + hồ sơ · T3 · T3 + vật + T1 · CI khai
  đích danh · CI không khai (`.github/workflows/acceptance.yml`) — và gọi `pre-merge-check.sh --base <base> --hang-pr`,
  Then stdout là đúng ba dòng `hang=` · `cham_vat=` · `ly_do=phan-loai` khớp bảng kỳ vọng viết trước (T1/false cho
  bốn hàng T1, ho-so/false cho ba hàng hồ sơ, T2/true cho vật và CI không khai, T3/true cho hai hàng T3); số khẳng
  định = số hàng.
- AC-2: Given cùng kho mẫu, When cổng chạy KHÔNG cờ với cùng `--base` trên các hàng của AC-1 không chạm
  `_acceptance/`, Then TẬP loại dòng `VIOLATION [PR]` cổng in ra trên mỗi hàng bằng tập viết trước tương ứng hạng
  chế độ in: `T1` ↔ rỗng · `T2` ↔ {non-T1} · `T3` ↔ {T3 paths} (so tập, mỗi hàng một khẳng định — 8). And trên bản sao trọn `scripts/` + `lib/` mà dòng
  `GLOB-DOUBLESTAR-ZERO-DIRS` của `glob_variants` bị gỡ, hàng `README.txt` lật sang `hang=T2` VÀ cổng không cờ lật
  sang `VIOLATION [PR]: non-T1` cùng lúc — chế độ dùng chính bộ khớp của cổng (thông điệp ghim «README.txt lật cùng
  cổng»).
- AC-3: Given PR đổi danh sách hạng trong `_acceptance/config.yaml`, When `--hang-pr`, Then ra `hang=khong-ro` ·
  `cham_vat=true` · `ly_do=doi-danh-sach-hang` ở ba ca: thêm `src/**` vào `t1_skip_globs` cùng lúc sửa `src/a.ts` ·
  bỏ `core/**` khỏi `t3_paths` cùng lúc sửa `core/x.ts` · merge-base chưa có `config.yaml` (PR thêm kit) và chỉ sửa
  `docs/a.md`. Chiều im: PR chỉ đổi một khoá khác của config (`feature_loop.suite_keys`) cùng `docs/a.md` →
  `hang=ho-so` · `cham_vat=false` · `ly_do=phan-loai`. Chiều đỏ: bản sao bỏ bước so danh sách → ca thứ nhất và
  ca thứ ba ra `hang=ho-so` · `cham_vat=false` (bit nguy hiểm), bản nguyên vẹn ra `khong-ro` · `true` (thông điệp
  ghim «PR tự nới danh sách»); ca thứ hai không đổi bit nên không dùng làm chiều đỏ.
- AC-4: Given môi trường không chứng minh được phạm vi, When `--hang-pr`, Then mỗi ca ra `cham_vat=true` và thoát 0:
  không `--base` → `ly_do=khong-co-pham-vi-diff`, KHÔNG có dòng `::warning` · base là ref không có →
  `hang=khong-ro`, `ly_do=khong-phan-loai-duoc`, đúng một dòng `::warning` mang thông điệp của cổng («không resolve
  được») · lịch sử rời (không merge-base) → `ly_do=khong-co-pham-vi-diff` kèm một dòng `::warning` · base = HEAD
  (diff rỗng) → `ly_do=diff-rong` kèm cảnh báo · kho không có `_acceptance/` → `ly_do=khong-phan-loai-duoc` kèm
  cảnh báo. And bẫy của chế độ sống tới tận khối phân loại: hai bản sao trọn `scripts/` + `lib/`, một chèn `exit 1`,
  một chèn đọc biến chưa khai (dưới `set -u`), ngay trước khối «Phân loại diff-chịu-cổng» → mỗi bản ra `khong-ro` ·
  `true` · `khong-phan-loai-duoc`, mã 0, đúng một dòng `::warning`; bản nguyên vẹn cùng kho ra `phan-loai` (thông
  điệp ghim «lối dừng thoát khác 0»).
- AC-5: Given cấu hình hỏng, When `--hang-pr` trên một PR chỉ đổi `docs/a.md`, Then `cham_vat=true` ·
  `ly_do=cau-hinh-loi` kèm một dòng `::warning`, thoát 0, ở hai ca: `config.yaml` có ký tự TAB · `_acceptance/` có
  mà `config.yaml` vắng. Đối chứng dương: cùng PR trên config lành → `hang=T1` · `cham_vat=false`.
- AC-6: Given `GITHUB_OUTPUT` trỏ một tệp đã có dòng `co_san=1` và `GITHUB_STEP_SUMMARY` trỏ một tệp rỗng, config
  khai `recheck: warn` (cổng thường in một dòng nhắc recheck), When `--hang-pr` trên một PR chỉ T1, Then `GITHUB_OUTPUT` =
  `co_san=1` + đúng ba dòng như stdout · `GITHUB_STEP_SUMMARY` có đúng một dòng nêu hạng · stdout có đúng ba dòng
  (không dòng nhắc hay ghi chú nào của cổng lọt ra). And khi hai biến vắng, lần chạy không ghi tệp nào ngoài thư mục tạm
  của nó. And mọi giá trị in ra thuộc tập khoá/giá trị của khối marker `HANG-PR-KHOA` (đọc từ chính tệp cổng).
  Chiều đỏ: bản sao bỏ dòng nuốt stdout của chế độ → ca đỏ (thông điệp ghim «dòng của cổng lọt ra»).
- AC-7: Given mọi lần chạy có cờ của AC-1…AC-6, Then mã thoát là 0. And lỗi cú pháp vẫn thoát 2 với thông điệp
  hôm nay: `--hang-pr --base ""` → «--base requires a value» · cờ gõ sai `--hang-prr` → «unknown option».
- AC-8: Given bản cổng đầy đủ và bản cắt bỏ mọi vùng giữa `# >>> HANG-PR` … `# <<< HANG-PR` (đặt cạnh nhau trong
  hai bản sao trọn `scripts/` + `lib/`), When chạy KHÔNG cờ trên mọi kho mẫu của AC-1 (có `--base`), trên một kho
  mẫu không `--base`, và trên chính cây kit (`--base` = commit cố định `d9d1f3a6`, và không `--base`), Then stdout +
  mã thoát hai bản giống từng byte. And số marker mở = số marker đóng ≥ 1. Chiều đỏ: bản sao chèn một `echo` vào vùng
  marker ngoài nhánh cờ → ca đỏ (thông điệp ghim «vùng HANG-PR chạy khi không có cờ»). And vế lịch sử: với MỌI
  commit không-gộp của vòng này chạm tệp cổng (tìm theo slug trong thông điệp commit, ≥ 1 commit), bản cắt marker của commit bằng từng byte bản cắt marker của commit cha.
  Chiều đỏ: kho mẫu có hai commit (cha = tệp cổng ở `d9d1f3a6`, con = tệp cổng hiện tại mang slug trong thông điệp)
  xanh; con sửa một chữ ngoài vùng marker → đỏ (thông điệp ghim «dòng ngoài HANG-PR đổi»).
- AC-9: Given `scripts/pre-merge-check.sh` sau vòng này, When chạy NGUYÊN VĂN công thức `sed` của crm PR #369
  (`.github/scripts/phan-loai.mjs`, chép vào tệp ca) trên tệp cổng với bảng glob × tệp viết trước, Then công thức rút
  được `match_globs` và mọi ô khớp đúng kỳ vọng. Chiều đỏ: bản sao đổi tên `match_globs` → công thức thoát 3.
- AC-10: Given GUIDE §5.3 và CHANGELOG mục «Chưa phát hành», Then GUIDE có mục bỏ job nặng tuỳ chọn với đoạn workflow
  gọi `--hang-pr`, `fetch-depth: 0`, điều kiện cấp job chứa CẢ `!cancelled()` lẫn `cham_vat != 'false'` trên cùng
  một dòng `if:`, bảng bốn hàng (xanh+false bỏ · xanh+true chạy · đầu ra vắng chạy · `hang-pr` đỏ chạy), câu cảnh báo `paths-ignore` cấp
  workflow làm check bắt buộc treo, và câu «job đọc hồ sơ đừng gắn vào bit»; mọi khoá `outputs.<khoá>` trong đoạn
  thuộc khối `HANG-PR-KHOA`; đầu `pre-merge-check.sh` (dòng Usage) nêu `--hang-pr`; CHANGELOG có mục nêu `--hang-pr`
  và «kho không truyền cờ: cổng không đổi». Chiều đỏ: bản sao GUIDE đổi `cham_vat` thành `cham_ma` → ca đỏ; bản sao gỡ `!cancelled() &&` → ca đỏ (thông
  điệp ghim «hang-pr hỏng thì test bị bỏ»). Giới hạn đã khai: ca đo HÌNH của biểu thức, không chạy GitHub — ngữ
  nghĩa `success()` ngầm lấy từ tài liệu GitHub, đọc lại ở Cổng Giá trị trên lượt CI thật của crm.
- AC-11: Given cây sau sửa, When chạy bốn bộ test của CI, Then mọi bộ xanh.

## Coverage

Quét bằng morphological-scan (preset test-matrix, tự dựng trục). Chân sản phẩm: kit là engine cho kho tiêu thụ
[SUY-TỪ-REPO: CLAUDE.md]; người dùng lệnh là CI của kho (crm đầu tiên) [SUY-TỪ-REPO: docs/findings/2026-10-11-khao-sat-chi-phi-actions-va-thoi-gian-phien.md].
Chân ngành: GitHub Actions `on.<event>.paths-ignore` (lọc cấp workflow; check bắt buộc treo khi workflow không
chạy — GitHub docs «Handling skipped but required checks») [NGÀNH: GitHub Actions] · action `dorny/paths-filter`
(đầu ra chuỗi `'true'`/`'false'` mỗi bộ lọc, dùng ở `if:` cấp job) [NGÀNH: dorny/paths-filter].

| Trục | Giá trị | Thước CE | AC |
|---|---|---|---|
| A. Thành phần diff | chỉ T1 · `*` vượt `/` · `**/` ở gốc · chỉ hồ sơ · hồ sơ + T1 · thước hồ sơ · vật · vật + hồ sơ · T3 · T3 + vật · CI khai · CI không khai · rỗng | ba lớp của khối T1-escape trong `pre-merge-check.sh` + phân loại 335 PR crm (finding §1.1) | AC-1, AC-2, AC-4 |
| B. Danh sách hạng / cấu hình | không đổi · đổi t1 · đổi t3 · merge-base chưa có config · đổi khoá khác · config TAB · config vắng | khối kiểm cấu hình + `config_list` của cổng | AC-3, AC-5 |
| C. Môi trường | có base · không base (push) · ref không có · lịch sử rời · kho chưa có `_acceptance/` | các lối dừng của khối phạm vi diff trong cổng | AC-4, AC-7 |
| D. Kênh / người đọc | stdout · `GITHUB_OUTPUT` · `GITHUB_STEP_SUMMARY` · `::warning` · cổng không cờ · công thức `sed` crm · GUIDE | đầu ra của `dorny/paths-filter` (chuỗi true/false ở `if:`) + crm #369 | AC-6, AC-8, AC-9, AC-10 |

Later: dùng ở OneFlow (bật theo lựa chọn, sau đợt thử) · bit riêng «chạm thước của hồ sơ» cho job lint (chờ một kho
đòi) · kho monorepo `pkg/_acceptance/` (cùng đường mã, chưa đo). Never: xem Out of scope.

## Đường đo

- «0 PR chỉ-hồ-sơ chạy job `test`» — số từ `pull-daily.mjs crm-onehub` + `savings.mjs` (ở
  `docs/findings/assets/2026-10-11-khao-sat-actions-va-phien/`) trên 30 ngày sau khi crm nối dây; phía kit bảo đảm
  bằng AC-1 (hàng hồ sơ → `cham_vat=false`) và AC-6 (đầu ra GitHub).
- «0 PR chạm vật bị bỏ job `test`» — cùng dữ liệu: PR có job `test` kết luận `skipped` mà có tệp ngoài `_acceptance/`
  và ngoài `t1_skip_globs` của crm; người đọc danh sách ở Cổng Giá trị. Phía kit: AC-1, AC-2, AC-3.
- «crm thôi gọi `sed` vào cổng» — `git -C <crm> grep -n "glob_variants() {" -- .github` ra 0 dòng (vật ở crm, đọc
  ở Cổng Giá trị).
- «kho không gọi cờ thì cổng không đổi byte» — AC-8.

## Out of scope

- Không thêm danh sách thứ hai hay khoá config mới — chế độ đọc đúng `t1_skip_globs`/`t3_paths` của kho.
- Không nới `t1_skip_globs` cho `.github/**` hay manifest (án `.out-of-scope/t1-skip-globs-github-and-manifests.md`).
- Không sửa CI của kho nào — crm thay khối `sed` trong vòng của chính crm, sau mốc phát hành.
- Không bit PR nháp (đề 5): nháp là sự kiện GitHub, không phải hạng; crm #369 đã tự lo.
- Không đổi tên, không dời, không sửa thân `glob_variants`/`match_globs`/`config_list` (crm #369 dựa; vòng A, G3 gần
  vùng).
- Không sửa ba ngữ nghĩa glob lệch nhau của kit (bash cổng · `globToRe` của S4 · bản đo) — ghi hạt giống
  `docs/plans/2026-10-11-hat-giong-ba-ngu-nghia-glob-t1-skip.md`.
- Không tách CI của kit thành job song song (finding §6 — meta).

## Notes

- CỘNG (ADR 0018): một cờ mới của cổng dùng chung — chủ kho phê đích danh ở Cổng Phạm vi.
- Hạng T3 vì `scripts/pre-merge-check.sh` ∈ `risk_tiers.t3_paths`; hàng lộ trình C1 ghi T2, máy không sửa tệp ý định.
- Sự kiện `push` không có base → luôn chạy đủ (chính sách «nghi ngờ thì chạy đủ», chủ kho chốt ở Cổng Đáng).
