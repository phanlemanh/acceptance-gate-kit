---
schema_version: 1
feature: Phát hành kit 2.0.0 — gom 1c + đợt 2 «người về biên» về một mốc release để repo tiêu thụ nhận engine mới có chủ đích trước đợt 3
slug: release-2-0-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + GUIDE + workspace — không dính t3_paths
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-08-15
veto_state: mo
veto_opened_at: 2026-08-15T04:30:00Z
---

# Acceptance Contract: release-2-0-0

## Context

Owner chốt «ship: 2.0.0» ngày 15/08 sau phân tích: repo tiêu thụ đang cài
1.40.0 — thiếu trọn 1c lẫn đợt 2 (~420 dòng engine/20 file); số 1.42.0 trong
manifest được cắt TRƯỚC khi đợt 2 merge nên engine làn-veto đang «đứng dưới
một số cũ» — đúng lớp lỗi «đã mới nhất là nói dối» (plugin update so số,
không so nội dung). Chính sách 7.1: engine gom về mốc phát hành, re-pin một
chiến dịch mỗi release; và không đổi engine dưới chân vòng đang chạy — nên
release phải đi TRƯỚC đợt 3.

**Ghi nhận sống, giữ làm bằng chứng thực nghiệm:** hồ sơ này ĐỊNH đi làn V
(frontmatter vẫn giữ `veto_state: mo` làm vật thật đầu tiên của cơ chế),
nhưng lượt ghi đầu bị hook bản cài **1.40.0** chặn — bản đó chưa biết làn V.
Cập nhật plugin lên 1.42.0 xong, phiên đang chạy vẫn nạp hook cũ (cần khởi
động lại phiên). Vậy Cổng 1 của hồ sơ này đi **luật cũ**: owner duyệt một
lượt («Duyệt: Manh Phan», 15/08). Lượt duyệt ấy chính là **M1-trước** — cái
giá sẽ biến mất cho vòng T2 sạch sau khi release này tới máy người dùng.

Source input: phân tích + quyết định owner trong phiên 15/08 (transcript);
chính sách release ở GUIDE §7.1.

## Criteria

- AC-1: Given cây đã sửa, When đọc hai manifest plugin, Then cả hai mang
  `version: 2.0.0`, mô tả mỗi gói có đoạn v2.0.0 nói đúng thay đổi ngữ
  nghĩa cổng (làn V · xanh-sạch thôi mời ký · khó-đảo luôn dừng), và vế
  tương thích của feature-loop trỏ `acceptance-gate >= 2.0.0`.
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó
  ghi đúng 2.0.0 · 2.0.0 — tài liệu và manifest không lệch nhau (trước hồ sơ
  này GUIDE ghi 1.41.0 trong khi manifest 1.42.0: đã lệch một bậc).
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH và các
  sàn version động trong suite (`>= 1.29.0` / `>= 1.22.0`) vẫn thoả với
  2.0.0 — bump không làm đỏ ca nào, không sửa ca nào.
- AC-4: Given hồ sơ này với `veto_state: mo`, When lưới trước-merge chạy,
  Then NOTE đếm cửa-veto đang mở có tên `release-2-0-0` và KHÔNG một
  VIOLATION nào của nhóm luật veto mang tên hồ sơ này; vế còn lại của làn V
  — báo cáo PASS sạch sáu điều kiện với `human_signoff` rỗng đi qua biên
  merge không cần chữ ký — được chứng tại BIÊN THẬT: lượt chạy cổng trên CI
  của chính PR này phải `clean` trong khi `human_signoff` rỗng.

- AC-5: Given diff của nhánh release so với base, When lọc qua allowlist
  ĐÓNG khai trong bộ răng (2 manifest · GUIDE · bản đồ · config · workspace
  hồ sơ này), Then KHÔNG file nào ngoài allowlist — lời hứa «không đổi
  engine» của Out of scope có thước, không phải lời trấn an (gap-probe P0);
  diff rỗng cũng đỏ.

## Coverage

- Trục vật: manifest (AC-1) | tài liệu (AC-2) | suite + sàn động (AC-3) |
  hành trình làn V trên vật thật (AC-4) | diff-allowlist (AC-5) [thước CE: danh sách chốt-số dò bằng
  grep toàn kho trong phiên, ba chỗ ghim đều có AC; suite đọc số ĐỘNG nên
  không có ca ghim literal phải sửa]
- Không lời hứa hành-vi-agent nào trong hồ sơ này — mọi AC là mực-đã-in hoặc
  mã tiền định; vì thế không eval judgment, và đường xanh-sạch tại Cổng Bằng
  chứng là hợp lệ theo đúng sáu điều kiện đã ký ở đợt 2.

## Out of scope

- KHÔNG đổi một dòng engine nào — hồ sơ chỉ đóng số cho engine ĐÃ ký ở các
  hồ sơ trước (1c, veto-co-dau-vet); đổi engine ở đây là lách cổng của
  chính các hồ sơ đó.
- KHÔNG re-pin trong hồ sơ này — chiến dịch re-pin chạy SAU merge theo nghi
  thức 1-lượt-lane sẵn có (chính sách 7.1), và các hồ sơ đã ghim cuốn chiếu
  tới b496050 nên phần còn lại nhỏ.
- KHÔNG đụng bản cài trên máy owner ngoài hai lượt update đã chạy (1.42.0 /
  1.28.0) — lên 2.0.0 sau merge là một lệnh; số đã bump nên không dính quirk
  «đã mới nhất».

## Notes

- Cửa veto của hồ sơ này MỞ từ 2026-08-15T04:30:00Z — owner veto bằng cách
  đổi `veto_state: da-veto` + một entry sổ quyết định, bất kỳ lúc nào trước
  hoặc sau merge; đường đảo là revert merge + hạ số (một lệnh).
- Số phiên bản 2.0.0 là quyết định owner («ship: 2.0.0», 15/08) — tín hiệu
  cho đội rằng ngữ nghĩa cổng T2 đã đổi, đọc GUIDE trước khi lên bản.
