---
schema_version: 2
feature: "findings-section-boundary — luật ranh giới section PER-SECTION đặt một chỗ có marker trong lib/md-section.js; gate-card + evidence-page hết bản sao, claim-scan ghim bằng round-trip"
slug: findings-section-boundary
risk_tier: T3
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-07-29T11:15:00Z
owner: phanlemanh@gmail.com
source: docs/superpowers/specs/2026-07-29-findings-section-boundary-design.md
time_human_minutes:
  gate1: 10
  gate2:
---

# Acceptance contract — findings-section-boundary

Bối cảnh: S4 của `claim-scan-parser-hardening` bắt seam bất đồng — claim-scan
dừng ở heading mọi cấp, `section()` của gate-card/evidence-page dừng ở
cùng-cấp-hoặc-cao-hơn, nên thẻ Gate 1 có thể hiện finding ma mà chỉ số claim
không thấy. Khảo sát cho thấy hai luật xung đột CÓ CHỦ ĐÍCH (mỗi bên có lỗi
lịch sử ghi trong comment): luật đúng là per-section, khai một chỗ có marker.

## Criteria

- AC-1: Given `gap-probe.md` có `## Findings` với bảng 1 hàng, rồi
  `### Notes` (hoặc `# Appendix`) chứa bảng 6 cột, When render thẻ Cổng 1,
  Then `gap_probe.rows` chỉ có hàng của bảng Findings thật — 0 hàng ma; và
  đối chứng dương: cùng file bỏ phần đuôi cho ra dãy hàng GIỐNG HỆT.
- AC-2: Given cùng file ở AC-1 với `verdict: clean`, When render thẻ,
  Then cờ "mâu thuẫn: verdict clean nhưng bảng có finding" KHÔNG bắn (trước
  đây bắn oan vì bảng ma); đối chứng dương: file `verdict: clean` có hàng
  THẬT trong Findings vẫn bắn cờ đó.
- AC-3: Given `contract.md` có `## Acceptance criteria` chứa `### nhóm phụ`
  rồi các AC tiếp theo, When render thẻ Cổng 1, Then MỌI AC sau sub-heading
  vẫn xuất hiện (regression đinh của lỗi false-green cũ) — số AC đọc được
  bằng số AC trong file.
- AC-4: Given cùng `contract.md` ở AC-3, When render evidence-page,
  Then MỌI AC sau sub-heading vẫn xuất hiện — luật văn xuôi không đổi ở
  reader thứ hai.
- AC-5: Given `lib/md-section.js` mới, When đọc file, Then bảng luật
  per-section nằm giữa cặp marker `<<<SECTION-BOUNDARY-TABLE` …
  `SECTION-BOUNDARY-TABLE>>>`, khai rõ `Findings → any-heading` và mặc định
  `same-or-higher`; và eval rút được bảng đó bằng marker (không chép tay).
- AC-6: Given `scripts/gate-card.js` và `scripts/evidence-page.js` sau
  sửa, When grep, Then KHÔNG file nào còn định nghĩa `function section(`
  riêng — cả hai require `../lib/md-section.js`; đối chứng đột biến: bản
  sao có lại định nghĩa riêng phải bị assert bắt.
- AC-7: Given fixture `gap-probe.md` chung do code sinh, When chạy CẢ
  `claim-scan.mjs` (plugin feature-loop) LẪN luật `Findings` rút từ marker
  của `lib/md-section.js`, Then hai bên cho CÙNG tập hàng Findings —
  round-trip xuyên package; đối chứng đột biến: đổi luật một bên → test đỏ.
- AC-8: Given toàn bộ suite hiện hành (scripts/hooks/plugins/workflows),
  When chạy sau thay đổi, Then tất cả xanh — không đổi hành vi nào khác của
  thẻ, evidence-page, hay hook.
- AC-9: Given đối chứng đột biến PH8 (known-limit vòng trước), When chạy
  suite workflows, Then nó là phép kiểm THẬT: regex `v1.18 adds` phải TRƯỢT
  trên văn bản description tiền-1.18 (không còn kiểu xoá-chuỗi-rồi-tìm-chuỗi).
- AC-10: (judgment) Luật per-section đã single-source ĐÚNG NGHĨA: mọi
  reader trong package acceptance-gate lấy ranh giới từ bảng marker (hoặc
  được khai Out of scope có tên), và không call-site nào tự chế luật riêng.
- AC-11: Given bump + `sync-plugin-packages.sh --check`, When chạy, Then
  exit 0 — mirror đồng bộ (lib/ mới có mặt trong package acceptance-gate);
  VÀ smoke trên BẢN MIRROR: `node plugins/acceptance-gate/scripts/gate-card.js
  --extract` trên fixture code-sinh exit 0 và trả ĐÚNG số AC của fixture
  (khẳng định dương — không chỉ "không nổ").
- AC-12: Given một bản sao code-sinh của `lib/md-section.js` bị đột biến
  đúng Ô BẢNG (`Findings` → `same-or-higher`), When chạy gate-card qua bản
  sao đó trên fixture có bảng ma, Then hàng ma XUẤT HIỆN (đếm hàng tăng đúng
  số hàng của bảng đuôi) — chứng minh hành vi ĐI THEO bảng, bảng không phải
  trang trí; đối chứng dương: cùng harness với bản nguyên vẹn cho 0 hàng ma.

## Coverage

Từ morphological-scan (4 trục — thước CE trong ngoặc):

- **R — reader** (CE: grep code — 4 bản cài đặt thật): AC-1/2 (gate-card),
  AC-4 (evidence-page), AC-7 (claim-scan), AC-6 (hết bản sao),
  eval-coverage-lint → Out of scope có tên
- **S — loại section** (CE: call-site thật): Findings=bảng (AC-1, AC-2,
  AC-7) · Criteria=văn xuôi có sub-heading hợp lệ (AC-3, AC-4)
- **H — hình dạng input** (CE: 2 lỗi lịch sử ghi trong comment code):
  sub-heading lồng chứa bảng (AC-1, AC-2) · sub-heading lồng chứa AC
  (AC-3, AC-4) · heading cùng cấp/cao hơn/EOF (AC-7 round-trip)
- **Đ — hành vi đòi** (CE: finding S4 + bài học P55/OOC-ITEM-TEMPLATE):
  không nuốt bảng (AC-1) · không cắt cụt AC (AC-3, AC-4) · một chỗ có
  marker (AC-5, AC-6, AC-10) · reader đồng thuận (AC-7) · không hồi quy
  (AC-8) · phép kiểm sống (AC-9, AC-12) · đóng gói + vật-giao-chạy-được
  (AC-11)

## Out of scope

- Gộp `scripts/eval-coverage-lint.js` `sectionLines()` vào lib — luật của nó
  đang đúng cho `Criteria`, không có triệu chứng; V2.
- Đổi luật ranh giới cho section của report (Evidence/Iterations/Analyst/
  Variance) — không có triệu chứng.
- Codex parity của claim-scan — vẫn chờ GO DP-1.
- Đổi cách `evidence-page.js` parse `review-findings.md` (key:value, không
  dùng section) — ngoài lớp này.
- `lib/out-of-contract.js` giữ `HEAD_ANY = /^##\s+/` riêng (cắt ở mọi h2 khi
  đọc `review-findings.md`) — luật của nó đang đúng cho artifact 3-ngăn đó và
  đã có round-trip P55 ghim khuôn; gộp vào bảng marker là V2 (CE: grep
  call-site + case P55). Panel E10 round 1 nêu đúng chỗ này.
- Ô R×S `evidence-page` × section-BẢNG: evidence-page KHÔNG có call-site
  `section(..., 'Findings')` (CE: grep call-site — nó chỉ đọc Criteria/
  Analyst/Evidence/Iterations/Variance). Ghim bằng assert call-site trong
  AC-6 thay vì dựng AC hành vi cho một đường không tồn tại.
