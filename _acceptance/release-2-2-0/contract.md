---
schema_version: 1
feature: Phát hành kit 2.2.0 — đóng số cho ba hồ sơ 17–18/08 (hình tại Cổng 1 · mối nối Vòng TRAO · siết răng câu-về-hình) để repo tiêu thụ nhận engine mới có chủ đích trước khi mở vòng r4 bước 1
slug: release-2-2-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + GUIDE + workspace hồ sơ + config key — không dính t3_paths
surfaces: [cli]
status: approved
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
  và `feature-loop` đều `2.2.0`, `diagram-design` giữ số hợp semver (`2.5.0` —
  vendor pin KHÔNG ĐỔI so với base — đo bằng quan hệ với `git show <base>`,
  không bằng hình dạng semver), mô tả `feature-loop` khai cặp
  `acceptance-gate >= 2.2.0`, và mô tả `acceptance-gate` chứa mục `v2.2.0`.
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó
  khớp ĐÚNG số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH (ba ca của
  ba hồ sơ trong mốc chạy bên trong suite plugins).
- AC-5: Given diff nhánh release so với base, When lọc qua allowlist ĐÓNG
  (2 manifest · GUIDE.md · `_acceptance/release-2-2-0/**` · `_acceptance/config.yaml`
  · PRODUCT-MAP.md), Then không file nào ngoài danh sách — đặc biệt KHÔNG file
  nào trong `skills/ lib/ scripts/ hooks/ feature-loop/skills/ diagram-design/`.
- AC-6: Given mô tả `acceptance-gate`, When đọc mục `v2.2.0`, Then nó nói bằng
  tiếng người dùng kit ba việc họ nhận (hình tại Cổng 1 · ngưỡng nghiệm thu
  hiện trên thẻ Cổng Phạm vi + phiên nghiệm thu đọc nhật-ký-vấp + S5 bàn giao ·
  phép đo câu-về-hình siết) và nói rõ **không phải migrate** (đường đọc-cũ);
  và mục `v2.2.0` của `feature-loop` **TỰ khai cặp** `acceptance-gate >= 2.2.0`
  — đo trên đúng mục đó, sửa mục lịch sử KHÔNG được tính (lỗi vòng chấm 18/08).

## Coverage

Quét không gian phát hành theo hai trục (nếp release-2-1-0, không quét lại từ đầu):
- Trục A · vật của một lần cắt số: manifest | dòng khớp-phiên-bản | mô tả
  người-dùng-nhận-gì | phạm vi diff [thước CE: hồ sơ release-2-1-0 đã dùng thật]
- Trục B · hành trình hồ sơ: làn V mở | bằng chứng xanh-sạch | biên merge
  [thước CE: pre-merge `xanh_sach_check` + ADR 0012]
- Ô Core → AC-1·AC-2·AC-3·AC-5·AC-6 (AC-4 và AC-7 đã thu, xem Known limits). Không ô Later/Never mới: mốc này KHÔNG thêm plugin, KHÔNG
  đổi vendor pin, KHÔNG đổi engine cổng.

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/`).
- Nâng số `diagram-design` — vendor pin không đổi trong mốc này.
- Sửa con trỏ `docs/lai-thu-nguoi-la.md` trong §0 uat-session (đường dẫn tương
  đối; gói ship cả `docs/` nên giải được từ gốc plugin) — Known limit, hồ sơ kế.
- Cài bản mới lên repo tiêu thụ và mở vòng r4 bước 1 — việc sau khi mốc này merge.

## Known limits

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

## Notes

- Nếp «bump đi kèm PR có hồ sơ» (bài học 1.40.0): PR chỉ-bump-manifest không
  phải T1 và không được đi một mình.
- **Bộ răng viết bằng Node, không bash** (owner chọn đường A, 18/08 — luật
  dừng-vá): bash đếm trong ống/shell con/trap đã ba lần nuốt vế đỏ trong chính
  hồ sơ này. Node: mọi vế là giá trị trong một tiến trình, mã thoát = số vế đỏ,
  và chân `tu-kiem` chứng minh bộ đếm biết đỏ.
- Làn V: hồ sơ mở `veto_state: mo`, `approved_by` để RỖNG — máy đi tiếp, cửa
  veto mở tới lúc merge.
