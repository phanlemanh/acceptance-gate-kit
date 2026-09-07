---
slug: release-2-9-0
at: 2026-09-07T10:52:43Z
verdict: findings
p0: 0
p1: 0
p2: 3
by: phiên tươi độc lập (subagent context sạch, không chia sẻ context với phiên dựng hồ sơ)
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P2 | contract | Context khai «**mười một PR** gộp vào main» và «**Tám** PR còn lại không phải vòng», nhưng `git log --merges --format='%h %s' cd94d004..HEAD` cho **12** dòng «Merge pull request» (#142→#153 liên tục, #141 = chính cd94d004 nằm ngoài cửa sổ); và chính danh sách trong ngoặc của hợp đồng đếm ra **9** số (#142 · #143 · #144 · #145 · #147 · #148 · #150 · #152 · #153). Cùng đoạn: «mốc 2.8.0 (`cd94d004`, 03/09 **23:38** UTC)» — `TZ=UTC git log -1 --format=%cd cd94d004` = `2026-09-03T22:31:09Z`. Lớp (d): số không khớp vết. | Người ký Cổng Bằng chứng đọc Context để biết cửa sổ gồm gì; con số tổng (11) và con số nhóm (8) mâu thuẫn với chính danh sách bên cạnh, nên không phân biệt được «một PR bị bỏ khỏi kiểm kê diff» với «đếm nhầm» — phải tự chạy git để biết, tức một lượt đọc thêm cho một câu lẽ ra máy tự chứng minh. | Ba câu phải khớp `git log --merges cd94d004..HEAD` (12 · 9) và dấu giờ merge của cd94d004 (22:31Z). | **fixed**: «mười hai PR» (kèm lệnh sinh số) · «Chín PR còn lại» · «03/09 22:31 UTC» |
| P2 | contract | Phạm vi diff khai từng file: `s4-args.mjs` «**+33/−4**», `start-scan.mjs` «**+20/−9**». `git diff --numstat cd94d004..HEAD` cho **31/2** và **15/5** (đúng cả khi đo tới merge của từng PR: cd94d004..5c15e065 = 31/2 · cd94d004..3d8819ad = 15/5). Hai số còn lại đúng (`run-tests.sh` +186/−0 · `routing-baseline.txt` +5/−0). Danh sách 18 file và cách chia 3/2/2/6/1/4 KHỚP `git diff --stat` trừ `_acceptance/`, `docs/`, `PRODUCT-MAP.md`. Lớp (e) một phần. | Người duyệt đối chiếu phạm vi diff (trục A «phạm vi diff» của Coverage, không có eval nào đo — chỉ đọc bằng mắt) thấy hai file hành-vi-máy-chạy khai nhiều dòng hơn git: hoặc tin có hunk «ẩn» rồi mất một lượt đi tìm, hoặc quen tin số khai thay git — đúng lớp «số gõ tay» mà bài học sha re-pin 07/08 đã trả giá. | Mọi cặp +/− trong mục «Diff của mốc» = `git diff --numstat cd94d004..HEAD -- <file>`. | **fixed**: 31/2 và 15/5; câu dẫn của mục ghi rõ nguồn là `git diff --numstat` (phiên dựng hồ sơ đã đọc `--stat` — số của `--stat` là số dòng ĐỔI làm tròn theo cột, không phải cặp +/−) |
| P2 | evals | E1 `expected` khai «Bằng chứng chỉ giữ ba dòng cuối nên các dòng «P200 VE:» **không lọt** vào output». Chạy thật `config:executors.script.p200_cat_so` (5,3 giây, exit 0): ba dòng cuối là «P200 VE: muc v2.9.0 cua feature-loop TU khai cap» · «P200 OK (… 5/5 dot bien …)» · «PASS: P200 …» — **một** dòng VE có lọt (`acceptance-verify.js:1014` `slice(-3)`). Hợp đồng (Notes) nói đúng hơn: «KHÔNG chứa đủ bảy dòng vế». Lớp (f): chữ mô tả bằng chứng lệch với thứ lệnh thật in, và lệch giữa hợp đồng với manifest. | Verifier context sạch so `output` với `expected`: thấy một dòng «P200 VE:» trong khi E1 hứa «không lọt» → nghi bằng chứng đến từ lệnh/khoá khác hoặc thứ tự in đã đổi, có thể ghi finding giả hoặc REJECT nhầm E1 — tốn một vòng máy (~20 phút theo 8001) cho một câu chữ. | `expected` của E1/E2/E6 mô tả ĐÚNG ba dòng cuối mà lệnh in (VE cuối · OK · PASS), cùng chữ với Notes của hợp đồng. | **fixed**: E1 liệt đúng ba dòng cuối (VE cuối · OK · PASS), «bảy dòng vế không đủ» — cùng chữ với Notes |

## Đã kiểm (ngoài các dòng trên)

- (a) Hình dạng/hành vi khai vs hàm/ca thật: `resolveJudgmentInput` (s4-args.mjs:144–159) đúng như khai — gốc kho, thư mục → `die` exit 2, vắng → exit 2 kèm gợi ý viết lại theo `path.relative(root, legacy)`, miễn trừ `EVIDENCE_PREFIX` in notice; `start-scan.mjs:340/426` gắn `qua-timebox` ở nhóm đã xong; P86 tiêu đề ca khai «14 dot bien» (run-tests.sh dòng ~10947+48); RT13 in «iii-b: 7 fixture … mutant ×3»; P200 `MUT_KY_VONG = 5` + đối chứng dương bản-sao-nguyên-vẹn + một `process.exit`; feature-loop/README nói «bốn cổng» + «làn V». SẠCH.
- (b) Định ngữ thêm sau khi thấy số: 2·0·1 dưới trần 3, «cộng 2 dừng-vá có thiết kế» = 5 tổng, «4/13» = 3+3+7 vòng theo run-log — các định ngữ («luật (c) không đếm», «làn V = 0») đã có từ nếp 2.7.0/2.8.0, không mới. SẠCH.
- (c) Dấu thời gian sổ: `at`/`veto_opened_at` = 10:43:47Z, commit 45d57b89 = 10:46:55Z (sổ đứng TRƯỚC commit); sổ #146 06:20:59Z/07:19:42Z, #151 09:30Z/10:20Z/12:02Z/13:00→13:09Z khớp hợp đồng; giờ VN trong bảng khớp `git log --date=iso-strict-local` (09:01→14:19 = 5h18 · 13:23→14:19 = 56' · 11:14→13:13 = 1h59 · 15:04→21:50 = 6h46 · 19:47→21:50 = 2h03). SẠCH — riêng mốc gốc cd94d004 «23:38 UTC» sai → Finding 1.
- (d) Số trong Ba dòng số có vết: run-log ba hồ sơ cho đúng chuỗi verdict khai (r1 BLOCKED→REJECT·PASS·PASS / PASS·REJECT·PASS / REJECT·REJECT·BLOCKED·PENDING·PASS·REJECT·PENDING); #149 `human_signoff:` rỗng, `status: verified`, hai mục Known limits/Ngoài hợp đồng rỗng thật (evidence-report.md:132–135); #151 `triage_failed: true`; CI đỏ hậu-chữ-ký = 3 đúng `gh run list` (54cec058 failure→760a8704 success · 206e0d63 failure · 6d478c80 failure→120d9346 success). SẠCH — số PR/nhóm PR ở Context sai → Finding 1.
- (e) Phạm vi diff: 18 file khớp `git diff --stat` có loại trừ, chia 3/2/2/6/1/4 khớp; hai cặp +/− sai → Finding 2.
- (f) Chữ mô tả phép so: E2 «đỏ ghim nguyên câu dẫn xuất» đúng (`GUIDE khong chua cau dan xuat: ${want}`); E6 hai chuỗi «khong co muc v…» và «cau khai cap nam ngoai muc nay» có thật trong kiem(); câu «không lọt» của E1 sai → Finding 3.
- AC không có eval: AC-1→E1, AC-2→E2, AC-3→E3/E3b/E3c/E3d/E3e, AC-6→E6. SẠCH. GWT không đo được: không. Trục Coverage không có AC: trục A «phạm vi diff» và trục B (bằng chứng · biên merge) không có AC riêng — cùng hình với 2.1.0→2.8.0, hợp đồng khai đọc trong diff; không phải finding mới.
- Lớp đo-lường từ `expected`: E1/E2/E6 chung một lệnh (workflow dedupe, acceptance-verify.js:454), `pipefail` giữ mã thoát của suite qua `grep -F P200`; ONLY_BLOCK khớp đúng MỘT khối (`grep -c 'run "P200'` = 1, bẫy 'P86' khớp hai khối của #151 không tái diễn); chiều đỏ sống trong P200 (5 đột biến đều ghim thông điệp + đối chứng dương). E3e `product_map --check` chạy thật exit 0 «PRODUCT-MAP.md khớp hồ sơ xưởng». Không assert âm tính trần, không assert đo tài liệu thay đầu ra. SẠCH.
- Manifest: cả hai `version` 2.9.0, `license: MIT`; diagram-design 2.7.0; mục `v2.9.0` của feature-loop tự khai «pairs with acceptance-gate >= 2.9.0»; GUIDE.md:5 «Khớp phiên bản: acceptance-gate 2.9.0 · feature-loop 2.9.0 · diagram-design 2.7.0.»; marker GATE-MODEL/-VI/-EN có ở GUIDE:55–74. SẠCH.
- decisions 8001–8006: không lật; 8004 (khoá `p200_cat_so`) và 8005 (khoá `product_map`) đều có khoá thật trong `_acceptance/config.yaml:111,118`. Input thứ 5: không finding nào dựa trên claim — không cite.

### Giới hạn của chính bảng này

Phiên tươi ĐƯỢC PHÉP đối chiếu khẳng định với cây thật (git, manifest, ba hồ sơ nguồn) vì
mốc phát hành là hồ sơ VỀ một diff đã tồn tại — khác luật «critic phán artifact, không
audit code» của vòng tính năng (ở đó code chưa có). Phiên không chạy bốn suite — S4 lo.
