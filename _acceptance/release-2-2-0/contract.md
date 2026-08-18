---
schema_version: 1
feature: Phát hành kit 2.2.0 — đóng số cho ba hồ sơ 17–18/08 (hình tại Cổng 1 · mối nối Vòng TRAO · siết răng câu-về-hình) để repo tiêu thụ nhận engine mới có chủ đích trước khi mở vòng r4 bước 1
slug: release-2-2-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + GUIDE + workspace hồ sơ + config key — không dính t3_paths
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-18T01:53:55Z
---

# Acceptance Contract: release-2-2-0

## Context

Repo tiêu thụ (artifact-platform) đang chạy plugin **2.1.0** — bản không có gì
của 17–18/08. Ba hồ sơ đã ký và merge kể từ đó:

- **`hinh-tai-cong-1`** (#62) — khối «Hình tại điểm quyết định» trong GATE 1 của
  feature-loop: kê · đếm · vẽ · nhìn · đính, câu luật một nguồn.
- **`moi-noi-vong-trao`** (#63) — card Cổng Phạm vi in ngưỡng nghiệm thu; phiên
  nghiệm thu §0 đọc nhật-ký-vấp làm bằng chứng «bấm được»; S5 bàn giao sang
  Vòng TRAO; khuôn `stranger-drive-template.md`.
- **`siet-rang-cau-ve-hinh`** (#64) — siết răng phép đo câu-về-hình (một nguồn
  `hfl_clause.py`); **không chạm bề mặt người dùng**, chỉ làm phép đo thật hơn.

Bề mặt tiêu thụ đổi đúng **bốn file**: `feature-loop/skills/feature-loop/SKILL.md`,
`scripts/gate-card.js`, `skills/uat-session/SKILL.md`, và file mới
`skills/acceptance/references/stranger-drive-template.md`. Không schema nào đổi;
mọi đường đọc-cũ giữ nguyên (hồ sơ không có cơ hội = «ship thẳng»; workspace
không có nhật-ký-vấp = cờ vàng, không chặn) — consumer KHÔNG phải migrate.

Hồ sơ **không đổi một dòng mã cổng** — chỉ đóng số và nói cho người dùng
biết họ nhận được gì.

Source input: `git log 8d1e135..main` (ba PR #62·#63·#64) · nếp phát hành
`_acceptance/release-2-1-0/` · yêu cầu owner 18/08 «pull, xem tích hợp, cắt version».

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate`
  và `feature-loop` mang CÙNG một số hợp semver, `diagram-design` hợp semver.
  (Số cụ thể của mốc này là `2.2.0`; `diagram-design` giữ `2.5.0`. Việc «số ĐÃ
  đổi so với base» KHÔNG có răng máy — xem Known limits.)
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó
  khớp ĐÚNG số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH (ba ca của
  ba hồ sơ trong mốc chạy bên trong suite plugins).
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then
  mô tả `acceptance-gate` CÓ mục đó (bản phát hành không được câm về việc người
  dùng nhận gì), và mục cùng số của `feature-loop` **TỰ khai cặp**
  `acceptance-gate >= <số>` — đo trên đoạn cắt từ `v<số>`, sửa hay dời câu sang
  mục lịch sử KHÔNG được tính (lỗi vòng chấm 18/08). *Nội dung* năm vế người
  dùng nhận gì đọc trực tiếp trong diff — xem Known limits.

## Coverage

Quét không gian phát hành theo hai trục (nếp release-2-1-0, không quét lại từ đầu):
- Trục A · vật của một lần cắt số: manifest | dòng khớp-phiên-bản | mô tả
  người-dùng-nhận-gì | phạm vi diff [thước CE: hồ sơ release-2-1-0 đã dùng thật]
- Trục B · hành trình hồ sơ: làn V mở | bằng chứng xanh-sạch | biên merge
  [thước CE: pre-merge `xanh_sach_check` + ADR 0012]
- Ô Core → AC-1 · AC-2 · AC-3 · AC-6 (AC-4 · AC-5 · AC-7 đã thu — xem Known limits). Không ô Later/Never mới: mốc này KHÔNG thêm plugin, KHÔNG
  đổi vendor pin, KHÔNG đổi một dòng mã cổng nào.

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/`).
- Nâng số `diagram-design` — vendor pin không đổi trong mốc này.
- Sửa con trỏ `docs/lai-thu-nguoi-la.md` trong §0 uat-session (đường dẫn tương
  đối; gói ship cả `docs/` nên giải được từ gốc plugin) — Known limit, hồ sơ kế.
- Cài bản mới lên repo tiêu thụ và mở vòng r4 bước 1 — việc sau khi mốc này merge.

## Known limits

- **Không có bộ răng riêng cho mốc này.** Ba mốc liên tiếp mỗi lần tự dựng một
  dàn đo dùng-một-lần và mỗi vòng soi lại tìm ra cách nó không đo thật; owner
  chọn đưa phép đo thành **ca vĩnh viễn P200** trong `tests/plugins` (số đọc từ
  manifest, không ghim mốc; 5 đột biến + đối chứng dương bản-sao-nguyên-vẹn;
  MỘT lối thoát duy nhất). Tái lập: `ONLY_BLOCK=P200 bash tests/plugins/run-tests.sh`.
- **«Số ĐÃ đổi so với base» KHÔNG có răng máy — cố ý, sau khi đã thử và TRỪ.**
  Bản 18/08 từng canh nó (vế quan hệ `git show origin/main` + cờ buộc-tăng) và
  vòng chấm 4 chỉ ra hai hệ quả: (a) neo mốc DI ĐỘNG → mọi làn song song đỏ oan
  ngay sau khi mốc phát hành merge, đúng chi phí mà charter re-pin-theo-release
  loại bỏ; (b) cổng nằm ở một biến môi trường không phép đo nào canh. Điều cần
  biết là **diff 3 dòng của PR phát hành** — đọc trong 5 giây, thước máy ở đây
  to hơn vật được đo. Tái lập: `git diff origin/main...HEAD -- .claude-plugin/plugin.json feature-loop/.claude-plugin/plugin.json GUIDE.md`.
- **`diagram-design` giữ `2.5.0` không có răng máy riêng.** P200 chỉ ghim nó hợp
  semver và có mặt trong câu «Khớp phiên bản»; quan hệ pin ↔ tree-hash đã do ca
  P196 canh. Đọc trực tiếp: `git diff origin/main...HEAD -- diagram-design/`.
- **Năm vế nội dung của mục `v2.2.0` không có răng máy.** P200 canh mục CÓ mặt
  và tự khai cặp — chữ bên trong là văn cho người, thước máy sẽ thành đếm-từ.
  Đọc trực tiếp: `git diff origin/main...HEAD -- .claude-plugin/plugin.json`.
- **Phạm vi diff của nhánh phát hành (AC-5 cũ) không còn răng máy.** Người mở PR
  đọc diff — mốc này chạm đúng: 2 manifest · GUIDE.md · PRODUCT-MAP.md ·
  `_acceptance/config.yaml` · `_acceptance/release-2-2-0/**` · ca P200 trong
  `tests/plugins/run-tests.sh`. Tái lập: `git diff --name-only origin/main...HEAD`.
- **Hành trình làn V của chính hồ sơ này không có răng riêng.** Lưới trước-merge
  tự chạy ở biên merge (CI + lượt chạy tay) và đã có bộ kiểm vĩnh viễn của hồ sơ
  `veto-co-dau-vet` / `cong-chan-nham-cho`; dựng lại nó trong răng phát hành là
  bản sao thứ hai của cùng một luật. Tái lập: `bash scripts/pre-merge-check.sh --base origin/main`.
- **Ba ca P197/P198/P199 không được ghim riêng.** Chúng chạy bên trong suite
  plugins (E3c). Ghim riêng từng dòng PASS là việc của ba hồ sơ chủ, không phải
  của mốc phát hành.
- **Bộ đếm của răng không còn chân tự-kiểm.** Chân đó sinh ra để canh bộ đếm
  bash; bản Node đếm trong bộ nhớ và có đối chứng dương «bản sao nguyên vẹn 0 vế
  đỏ» ngay trong chân chính.

- **Bốn điểm yếu của P200 mà vòng 5 rà ra, KHÔNG sửa trong mốc này** (khoá owner
  D17: chỉ đo lại, không sửa thêm) — chuyển cho hồ sơ kế cùng chip «mốc phát
  hành không dựng răng»: (a) ma trận chưa toàn phần — `kiem()` có ~11 nhánh đỏ,
  5 có đột biến, `MUT_KY_VONG=5` là hằng viết tay chứ không suy từ tập vế (mẫu
  P105/P199 `set(SMSG)==FIRED`); (b) đường «cây thật đỏ ⇒ thoát 1» chỉ có bằng
  chứng chạy tay 18/08, chưa có ca máy gọi p200.mjs trên bản sao đã tiêm và ghim
  exit 1; (c) đột biến «GUIDE giữ số cũ» thay lần xuất hiện ĐẦU của
  `acceptance-gate <V>` thay vì đúng câu dẫn xuất — có thể đỏ oan (fail-loud,
  không fail-silent) ở lần cắt sau nếu GUIDE nhắc số ở trên; (d) manifest hợp
  JSON nhưng thiếu `description` → TypeError thay vì vế đỏ có tên (vẫn đỏ, nhưng
  phá lời hứa «một lối thoát»). Cả bốn đều KHÔNG mở chiều xanh giả cho vật của
  mốc này; đọc `review-findings.md`.
- **Vòng 5 lượt 1 REJECT là hạ tầng** (verifier bị công cụ giết ở 118 s), không
  phải vật — sổ D19; lượt 2 cùng vòng PASS. Lỗ verifier-không-đặt-timeout của
  kit đã thành chip riêng.

## Notes

- Nếp «bump đi kèm PR có hồ sơ» (bài học 1.40.0): PR chỉ-bump-manifest không
  phải T1 và không được đi một mình.
- **Phép đo viết bằng Node, không bash** (owner chọn đường A, 18/08 — luật
  dừng-vá, ba lần): bash đếm trong ống/shell con/trap đã ba lần nuốt vế đỏ trong
  chính hồ sơ này. P200: mọi vế là giá trị trong MỘT tiến trình, mỗi vế in một
  dòng có tên, số đột biến chạy thật bị ghim (`5/5`), bản sao NGUYÊN VẸN phải
  0 vế đỏ trước khi tin bất kỳ bản bị tiêm nào là đỏ, và mọi thứ sai đổ vào MỘT
  mảng quyết mã thoát (vòng 3 bắt bản trước mất lối thoát vì splice câm).
- **Bài học cho nếp phát hành (không thuộc mốc này, ghi để hồ sơ kế đưa vào
  GUIDE):** ba mốc liên tiếp tự dựng răng và đều thủng — **mốc phát hành KHÔNG
  dựng răng**: P200 canh nhất quán, người đọc diff 3 dòng, hết.
- Làn V: hồ sơ mở `veto_state: mo`, `approved_by` để RỖNG — máy đi tiếp, cửa
  veto mở tới lúc merge.
