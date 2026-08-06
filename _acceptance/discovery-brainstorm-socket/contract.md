---
schema_version: 1
feature: Lối (a) /start hết lệch làn brainstorm — vế âm trong kit, vế dương qua ổ cắm repo khai
slug: discovery-brainstorm-socket
owner: manh@mstar.vn
risk_tier: T2
surfaces: [cli]
status: draft
---

# Acceptance Contract: discovery-brainstorm-socket

Nguồn scope: F-K trong nhật ký rollout (Bổ sung 06/08 — bảng soi
"đúng-trên-mọi-repo", hàng F-K "NẶNG — ca duy nhất cấp danh sách"). Nguyên
nhân kép ghi ở Bổ sung 03/08: lối (a) không có đích máy-đọc + hook
superpowers to tiếng hơn ở điểm nghẽn, nên phiên vào vòng HIỂU bị hút sang
`superpowers:brainstorming` (skill thuộc S1 vòng LÀM). Cấm hardcode tên
plugin bên-thứ-ba không-dependency vào cây nguồn kit — vế dương phải là ổ cắm
config per-repo.

## Criteria

- AC-1 (vế âm, 2 harness): Given hai thân lệnh `/start`
  (`commands/start.md` + `codex/acceptance-gate/skills/start/SKILL.md`),
  When đọc lối (a) vòng HIỂU, Then mỗi thân có câu phủ định đích danh:
  trước Cổng Đáng KHÔNG dùng `superpowers:brainstorming` — nó thuộc S1
  vòng LÀM (superpowers là dependency đã khai ở preflight nên nêu tên
  được); thước phải đỏ khi xoá câu ở TỪNG thân riêng lẻ (mutant per-file,
  thông điệp nêu tên file bị thiếu).
- AC-2 (ổ cắm — key CÓ): Given repo tiêu thụ khai section `discovery:` với
  key con `brainstorm_skill: <tên skill>` trong `_acceptance/config.yaml`
  (giá trị trần, bọc quote ĐƠN hoặc KÉP, hoặc kèm comment đuôi dòng), When
  chạy `scripts/start-scan.mjs --root <repo>`, Then JSON có
  `discovery.brainstormSkill` bằng đúng tên đã khai (quote/comment bóc
  sạch); và hai thân lệnh dặn TRONG đoạn lối (a): giá trị CÓ → mở buổi
  khai thác bằng đúng skill đó.
- AC-3 (đường fallback — key VẮNG; RED phía consumer): Given repo tiêu thụ
  KHÔNG khai được một tên dùng ngay (thiếu section `discovery` · có section
  thiếu key con · giá trị rỗng/`~`/`null` · giá trị phi-scalar
  (block-scalar, inline list/map) · YAML tồn tại nhưng hỏng — mọi hình
  dạng "không đọc ra tên"), When chạy bộ quét, Then
  `discovery.brainstormSkill` là `null` — exit 0, JSON nguyên hình, KHÔNG
  văng lỗi, KHÔNG cờ đỏ, KHÔNG chặn; và hai thân lệnh dặn TRONG đoạn lối
  (a): `null` → đi nghi thức grill kit-own theo khuôn
  `skills/acceptance/references/opportunity-template.md`.
- AC-4 (cấm hardcode tên bên-thứ-ba không-dependency): Given cây NGUỒN
  của kit (`commands/ codex/ skills/ feature-loop/ design-loop/ scripts/
  lib/ hooks/` — `vendor/` loại trừ CÓ CHỦ ĐÍCH: thân bên-thứ-ba vendor
  giữ tên + version gốc theo CLAUDE.md, entry d-10006), When quét chuỗi
  `product-management:` và `pm-execution:`, Then 0 hit; thước có đối chứng
  dương — tiêm 1 hit vào bản sao thì chính phép quét đó phải đỏ đúng thông
  điệp (grep phải chứng minh nó đọc được vùng quét, chống
  0-hit-vì-grep-hỏng).
- AC-5 (seam 2 harness + chống thoái lui): Given key mới nằm trong khối
  marker START-SCAN-KEYS của CẢ HAI thân lệnh, When chạy P98/P99 + suite
  plugins + mirror `--check`, Then xanh — P99 round-trip
  marker↔đầu-ra-thật là phép đo seam; đồng thời hai dòng luật sống trong
  bản quy trình v2 — `docs/specs/workflow-v2-spec.md` (§2.1 D1, §6 định tuyến brainstorm) — đổi theo ổ cắm, không còn
  hardcode `product-management:brainstorm`.

## Coverage

- Bỏ coverage-scan — scope là danh sách ĐÓNG theo hàng F-K của bảng soi
  06/08 (vế âm · vế dương ổ cắm · fallback · cấm hardcode · seam marker);
  entry `descope` trong decisions.jsonl.
- Trục kiểm: nguyên-nhân-kép ↔ AC — không-đích-máy-đọc → AC-2/AC-3 ·
  hút-sang-superpowers → AC-1 · bệnh-luật-gắn-kho-đồ-một-repo → AC-4 ·
  chống thoái lui seam → AC-5.

## Out of scope

- Đích MẶC ĐỊNH cho lối (a) khi F-A ship (ruột khám phá kit-own) — F-K chỉ
  đặt ổ cắm + fallback grill; đổi mặc định là việc của F-A (entry revisit).
- Khuôn `acceptance-init` phát key `discovery.brainstorm_skill` mẫu + GUIDE
  cho consumer — chờ cùng đợt F-A (entry revisit).
- Mọi thay đổi vào `skills/design-pass/`, `feature-loop/skills/`,
  `scripts/gate-card.js` (đợt 2 — F-J/F-L/F-M, vòng r3 đang chạy).

## Notes

- Đường B/C/E không liên quan — lệnh `/start` lối (a) chỉ phục vụ vòng
  HIỂU; không giả định giá trị mới — không phiên UAT (ship thẳng sau Cổng
  Bằng chứng).
- Kit tự chạy trên chính nó: repo kit KHÔNG khai `discovery.brainstorm_skill`
  → chính /start của kit đi đường fallback grill — dogfood đường AC-3.
