---
slug: release-2-10-0
at: 2026-09-09T23:21:26Z
verdict: findings
p0: 1
p1: 3
p2: 4
by: phiên tươi độc lập (subagent context sạch, không chia sẻ context với phiên dựng hồ sơ)
claims_input: ok
note: CHẠY MUỘN — phiên dựng hồ sơ bỏ sót bước S1#7 và chỉ chạy sau khi cổng trước-merge đòi. Cả tám mục đã xử trong cùng lượt; hai mục sinh ô mới.
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract AC-3 + evals E3 | AC-3 khai «bốn suite exit 0» và bằng chứng ghim `859 passed, 0 failed` tại `verified_commit 339b81dc`. Ở CHÍNH cây được ký (`228dc0f9`) suite `scripts` ĐỎ: `858 passed, 1 failed` — ca `LM20`. Nguyên nhân CẤU TRÚC: `LM20` chỉ ghim hồ sơ `settled(slug)` (có `human_signoff` khác rỗng, `tests/scripts/gate-card-lmcms.test.mjs:199`), nên hồ sơ mốc lọt khỏi phép đo suốt ba lượt chấm rồi rơi vào đúng lúc chữ ký hạ xuống. Màu xanh của E3 chưa bao giờ chạy được chiều đỏ của chính hồ sơ này | Người gộp đọc «bốn suite xanh» rồi gộp; `main` + CI đỏ ngay tại commit chữ ký. Lần thứ BA lớp «CI đỏ hậu-chữ-ký» tái phát (2.9.0 gọi tên ở #146 và #151, mục tiêu 0). Bảy repo tiêu thụ nhận mốc từ một cây đỏ | `bash tests/scripts/run-tests.sh` → exit 1, chỉ `LM20` đỏ, `+got : release-2-10-0 …` / `-base:` rỗng. Vi phân có đối chứng: `git archive HEAD` → ĐỎ · `git archive bf3577ae` (ngay trước chữ ký) → XANH. `grep -c release-2-10-0 tests/scripts/fixtures/routing-baseline.txt` = 0 | **fixed**: ghim dòng định tuyến của hồ sơ mốc vào `routing-baseline.txt` (rút bằng `gate-card --extract`, không gõ tay) → `33 passed, 0 failed`. Và mở ô `lm20-ho-so-moc-khong-tu-qua-duoc` vì bài học «thêm dòng TRƯỚC, cùng commit chữ ký» KHÔNG THỂ thi hành cho hồ sơ mốc; số «CI đỏ hậu-chữ-ký = 1» đã vào Notes |
| P1 | contract Notes dòng 3 | «vòng bị hạ tầng đốt: 3/16» chỉ đếm bốn vòng. Ba lượt chấm của CHÍNH hồ sơ mốc không có trong số, dù sổ quyết định viết nguyên văn «Ghi vào dòng số thứ ba của luật (c)» | Dòng số duy nhất dùng để chọn nhát cắt kế bị hạ 40%; bằng chứng đậm nhất của cửa sổ (2/3 lượt của mốc bị cùng lớp tool-kill đốt) không vào số, nên người ký xếp ưu tiên trên số thiếu | `run-log.jsonl` của mốc: round 1 BLOCKED · 2 REJECT giả · 3 PASS = 3 lượt, 2 đốt. Bốn vòng = 16 → tổng 19 | **fixed**: dòng 3 thành **5/19**, nêu rõ hai lượt của mốc và cùng lớp tool-kill |
| P1 | contract Notes dòng 2 | Vắng hẳn dòng «lượt gọi người của CHÍNH mốc phát hành» — luật (c) đặt trần ≤1 cho mốc, và 2.9.0 đã báo thẳng mình TRƯỢT (2) | Người ký kết luận mốc sạch; thực tế mốc cũng trượt trần, lần thứ hai liên tiếp — đúng dữ liệu mà ĐIỀU KIỆN THU HỒI của luật nới 07/09 đọc | Sổ: `d-20260909T141217Z-*` (Cổng Phạm vi `14:12:17Z`) + `d-20260909T230204Z-*` (Cổng Bằng chứng `23:02:04Z`) = 2 lượt. Hồ sơ T3, không có làn V để về 1 | **fixed**: thêm dòng 2b — «2 lượt, TRƯỢT trần ≤1, mốc thứ HAI LIÊN TIẾP trượt» |
| P1 | decisions.jsonl vs contract | Ô `tool-kill-co-rang` chỉ sống trong sổ quyết định, không carry vào contract. Trong kho này ô chỉ tới được vòng sau qua chữ trong contract | Vòng sau không thấy ô; lớp tool-kill quay lại đốt lượt chấm nữa — đúng điều chính contract gọi tên hai đoạn trên («Lời dặn của một mốc KHÔNG tới được vòng của mốc sau») | `grep -rn tool-kill-co-rang` → 1 hit duy nhất trong `decisions.jsonl`. Đối chứng: `resolve-config-go-escape` có 2 hit (contract + sổ) | **fixed**: carry vào khối «Hai ô nữa» của contract, kèm số 2/3 lượt bị nó đốt |
| P2 | contract Context, bảng lớp CI | `lib/evidence-core.cjs` khai «+64 / −37»; vết máy là `36 / 28`. «64» = tổng churn, «−37» = số dòng `+` thô (cộng cả dòng header của diff) | Dòng nặng nhất của lớp CI là dòng duy nhất viết khác khuôn VÀ sai số; người lượng hoá chi phí chép lại ở 7 repo mất một lượt hỏi | `git diff --numstat bafe2aad..da7ac3fc -- lib/evidence-core.cjs` → `36 28` | **fixed**: bảng viết lại theo cột thêm/bớt của `--numstat` cho cả năm dòng |
| P2 | contract Context, bảng lớp CI | Bảng tự khai đo «danh sách trong marker INIT-CI-COPY-LIST» nhưng 2/7 dòng không thuộc marker: `lib/context-glossary.js` và `commands/acceptance-init.md`. Marker có 9 mục, chỉ 5 đổi | Người đọc suy «7 file lớp chép phải chép lại» trong khi lớp chép thật đổi 5 — chỉ dẫn rollout đếm sai vật | Marker có 9 mục; `numstat` cho 4 mục còn lại RỖNG | **fixed**: bảng còn đúng 5 mục của marker, hai file kia tách ra một câu nói rõ vì sao không thuộc lớp chép |
| P2 | contract Context | Nợ ghim-lại của 7 repo không lệnh, không ngày, không sha; không tái dựng được từ kho | Người ký lượng hoá chi phí chiến dịch bằng số không neo; hai commit siết luật nằm trong CHÍNH cửa sổ nên số có thể đã cũ trước khi mốc đóng | `grep -rn "oneflow 29"` → 1 hit duy nhất là chính contract | **fixed**: khai thẳng «đo 08/09, KHÔNG neo sha, chưa đo lại sau hai commit siết luật của cửa sổ này — chiến dịch phải ĐO LẠI trước khi chạy» |
| P2 | contract | Tiêu đề khai «Ba ô mở» nhưng thân có HAI bullet (ba phát hiện gộp thành hai ô) | Vòng sau đi tìm ô thứ ba không có, hoặc kết luận một ô bị rơi | `grep -c` trong khối → 2 | **fixed**: tiêu đề thành «Hai ô mở» |

## Đã kiểm (ngoài các dòng trên)

- **Cửa sổ:** `git rev-list --count bafe2aad..da7ac3fc` = **141** ✓; `--first-parent` = đúng **7** PR ✓; bốn vòng sửa (#157 #158 #159 #163) và ba PR không-vòng (#160 #161 #162) khớp tên nhánh ✓.
- **Dòng 1 làm-xong→quyết-được, dựng lại bằng chính cách hồ sơ khai** (đọc `status:` trong frontmatter TỪNG revision qua `git show <sha>:<path>`): 211′ · 522′ · 389′40″≈390′ · 547′04″ — **cả bốn ĐÚNG**; trung bình 417,5 khớp «417′» ✓.
- **Số lượt chấm** đọc `round` trong `run-log.jsonl`: 3 · 3 · 4 · 6 = 16 ✓.
- **AC-5 và chiều đỏ 68/2 — TỰ TÁI DỰNG, khớp chính xác.** Đối chứng dương trên bản sao nguyên vẹn: `70 passed, 0 failed`, `PASS: V14/V15/V16`. Tiêm lại luật cũ (`laneStatus = status === 'verified' || …`) → exit 1, **`68 passed, 2 failed`**, V14 và V15 ĐỎ đúng hai chuỗi ghim, V16 vẫn PASS. Lời khai của AC-5/E5 đúng từng vế, kể cả vai đối chứng dương của V16.
- **E1/E2/E4 (P200):** chạy đúng lệnh trong run-log → exit 0, bảy vế in ra khớp `expected` ĐÚNG TỪNG CHỮ. Đọc mã P200: mọi số lấy từ manifest, một lối thoát duy nhất, `MUT_KY_VONG=5` có răng, mỗi đột biến kiểm «bản sao THẬT SỰ đổi» trước khi tin chiều đỏ — không tìm được lối fail-open.
- **Số manifest:** 2.10.0 · 2.10.0 · 2.7.0 ✓. **«diagram-design giữ 2.7.0 vì diff rỗng»:** `git diff --stat` trên thư mục đó RỖNG ✓.
- **Ba suite còn lại + bản đồ:** workflows exit 0 ✓ · hooks exit 0, 70/0 ✓ · product-map exit 0 ✓.
- **Hai hệ quả rollout (a) và (b) — ĐÚNG cả hai.** (a) `pre-merge-check.sh:910` in NOTE «lớp nhìn-thấy không kiểm được» và NOTE đó KHÔNG chặn ✓. (b) `grep -rn REPIN_EVALS_SINCE lib/ scripts/` rỗng ở HEAD, còn có ở `bafe2aad` ✓.
- **Lớp chép CÓ răng máy:** `tests/scripts/consumer-esm.test.mjs` rút chính marker rồi dựng bản sao consumer — danh-sách-thiếu tự làm test đỏ; nằm trong E3.
- **Nhát cắt kế:** `node scripts/start-scan.mjs --root .` trả đúng 10 slug trùng khít danh sách contract, và đúng 2 slug mang cờ `nguong-chua-chot` ✓.
- **Bốn commit sau `verified_commit`** không chạm mã sản phẩm, nên chỉ E3 trôi — và trôi vì chính chữ ký (P0).
- **Sổ Ngoài hợp đồng nhất quán:** KL-1…KL-5 = Ngoài-2/3/6/7/8, hợp đồng mới = Ngoài-1/4/5, tổng 8 khớp thẻ ✓.
- Mọi phép tiêm chạy trên bản sao (`cp -R`, `git archive`); không `checkout`/`switch`/`stash` trong cây làm việc.
