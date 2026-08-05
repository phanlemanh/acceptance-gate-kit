---
schema_version: 2
feature: "matrix-measure-law — lớp lỗi đo-lường thành luật ở 2 điểm cắm: gap-probe S1 (4 câu cross-check) + review lens measurement S4 (6 hình dạng, một chỗ, mutation-covered); không nới finder cũ"
slug: matrix-measure-law
risk_tier: T2
surfaces: [cli]
status: approved
approved_by: Manh Phan
approved_at: 2026-08-05T04:55:42Z
owner: phanlemanh@gmail.com
source: docs/superpowers/specs/2026-08-05-matrix-measure-law-design.md
time_human_minutes:
  gate1:
  gate2:
---

# Acceptance contract — matrix-measure-law

Bối cảnh: baseline B4 — ≥13 round S4 trong 5 tuần bị đốt bởi lớp lỗi
đo-lường; mỗi lần đều do review bắt muộn thay vì luật chặn sớm. Vòng 2
chương trình 80/20: biến bài học thành luật ở 2 chốt sẵn có, không chốt mới.

## Criteria

- AC-1: Given prompt gap-probe S1#7 trong SKILL feature-loop, When đọc ý (4)
  — mục đối chiếu chéo bắt buộc, Then có đủ 4 câu hỏi lớp-đo-lường: (a) eval tuyên quét LỚP có
  ma trận toàn phần viết-trước không (số assert = số phần tử); (b) assertion
  âm tính có đối chứng dương + ghim thông điệp không; (c) fixture do code
  sinh / round-trip writer-đọc-reader không, hay viết tay đúng khuôn bên
  đọc; (d) assert đo chuỗi-có-mặt trong khi lời hứa là quan hệ không — và
  câu đếm "đủ 7 ý" GIỮ NGUYÊN (mở rộng trong ý 4, không thêm ý).
- AC-2: Given SKILL codex (bước gap-probe của nó), When đọc, Then có cùng 4
  câu hỏi đối chiếu chéo lớp-đo-lường (quét cùng-lớp 2 harness, không lệch).
- AC-3: Given acceptance-verify.js, When S4 chạy review, Then REVIEWERS có
  finder thứ 3 `key: measurement` — prompt build từ danh sách
  `MEASUREMENT_SHAPES` đặt MỘT chỗ, đủ 6 hình dạng của design doc, khoanh
  vùng vào file kiểm thử/eval trong diff, high-confidence only; harness thấy fan-out label
  `review:measurement`.
- AC-4: Given finding do lens measurement trả về, When pipeline chạy, Then
  nó đi qua CÙNG đường refute → scope-triage như finder cũ — không đường
  tắt, không auto-fix, finding out-of-contract vẫn về Cổng 2.
- AC-5: Given finder measurement chết/lỗi, When run kết thúc, Then
  `reviewIncomplete` ghi nhận nó như mọi finder khác — không im lặng thành
  "0 findings".
- AC-6: Given diff acceptance-verify.js của feature này, When so với bản
  trước, Then 2 finder cũ (conventions/invariants + bugs) nguyên vẹn TỪNG
  CHỮ prompt và đường refute/triage không bị sửa — chỉ THÊM.
- AC-7: Given danh sách 6 hình dạng + 4 câu đối chiếu chéo, When đột biến
  xoá từng phần tử trên bản sao, Then phép đo tương ứng ĐỎ đích danh — đủ
  14 mutant (6 shape + 4 câu SKILL feature-loop + 4 câu SKILL codex),
  không mutant gộp.
- AC-8: (judgment) Prompt lens measurement thực thi được bởi finder fresh
  không có ngữ cảnh: ranh giới high-confidence rõ, không mở cửa style-nit,
  không lấn vai scope-triage, không tự fix.
- AC-9: (judgment) 4 câu đối chiếu chéo gap-probe đủ sức bắt 4 hình dạng đã
  dẫm trong lịch sử nếu artifact S1 tái phạm — đo bằng CẢ hai: mắt fresh
  trên 2 SKILL (M9) VÀ hành vi thật trên fixture gài-1-vi-phạm + bản sạch
  đối chứng (M11 — đo đầu ra, không chỉ đo chỉ dẫn).
- AC-10: (judgment) Dogfood: S4 của CHÍNH vòng này chạy script nguồn có
  lens — transcript/usage có label `review:measurement` thật; máy trả
  UNCERTAIN trước khi S4 chạy, người đếm tại Cổng 2.

## Coverage

Từ morphological-scan (4 trục — thước CE trong ngoặc):

- **P — điểm cắm phép đo** (CE: 2 chốt sẵn có của loop; Never: lint tĩnh —
  ledger): AC-1 (probe), AC-3 (lens), AC-6 (không chốt nào bị nới)
- **H — hình dạng lỗi** (CE: B4 ≥13 round + 4 hình dạng CLAUDE.md + xương
  6-vòng đo-từ-vựng): AC-3 (6 shapes), AC-7 (mutation từng shape), AC-9
  (judgment đủ-sức-bắt)
- **S — seam đồng bộ** (CE: 2 harness SKILL + 1 script): AC-2 (codex
  parity), AC-3 (shapes một chỗ), AC-8 (judgment executable)
- **Đ — đường đo O2** (CE: charter §O2 + kill threshold khai trước): AC-10
  (dogfood đếm được), AC-4/AC-5 (finding đi đường chuẩn, chết không im lặng)

## Out of scope

- Lint tĩnh đo-ngữ-nghĩa — Never (luật cú pháp không phủ phân biệt ngữ nghĩa).
- Gold-set + judge required_evidence — vòng 3 chương trình.
- Sửa các phép đo cũ đang vi phạm 6 hình dạng — luật chỉ áp lên diff mới.
- Ngưỡng blocking mới ở pre-merge/hook (không chạm đường bằng chứng).
