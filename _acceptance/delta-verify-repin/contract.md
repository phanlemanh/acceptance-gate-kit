---
schema_version: 2
feature: "delta-verify-repin — re-pin 1 lượt machine-lane + N chữ ký cùng run_id (chống gian lận 2 tầng bằng máy) + P1 carry-forward cho round fix sau REJECT; không hạ một chuẩn bằng chứng nào"
slug: delta-verify-repin
risk_tier: T3
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-08-05T02:39:09Z
owner: phanlemanh@gmail.com
source: docs/superpowers/specs/2026-08-05-delta-verify-repin-design.md
time_human_minutes:
  gate1: 10
  gate2:
---

# Acceptance contract — delta-verify-repin

Bối cảnh: 141 lượt machine-lane trùng (~5-6M token) vì mỗi sự kiện re-pin
chạy N agent × cùng 4 suite trên cùng sha; round fix full re-run kể cả eval
không chạm diff-fix. Vòng 1 của chương trình 80/20 — ràng buộc bất di dịch:
cùng độ tin, ít lần chạy trùng; mọi lưới cưỡng chế chỉ được THÊM, không nới.

## Criteria

- AC-1: Given một sự kiện re-pin làm N slug stale, When chạy nghi thức mới,
  Then đúng MỘT agent tươi chạy machine-lane, và run-log của TỪNG slug được
  re-pin nhận một dòng `kind:repin` mang CÙNG `run_id` + `sha` + kết quả
  suite; section `### Re-pin` của từng evidence-report cite `run_id` đó
  nguyên văn và `verified_commit` == `sha`.
- AC-2: Given evidence-report có section Re-pin cite `run_id` khuôn mới,
  When chạy recheck-evidence/pre-merge, Then thiếu dòng `kind:repin` khớp
  run_id trong run-log slug đó, HOẶC `sha` của dòng ấy khác
  `verified_commit`, đều là VIOLATION với thông điệp đích danh; đối chứng
  dương: bộ khớp đủ → clean.
- AC-3: Given kẻ gian mượn `run_id` của lane cũ để ký slug khi HEAD đã đổi
  tiếp, When chạy pre-merge, Then luật stale HIỆN HÀNH bắn (code đổi sau
  verified_commit) — chứng minh bằng case tiêm: không cần luật mới nào cho
  đường này, và case phải ĐỎ trên fixture gian lận + XANH trên fixture sạch.
- AC-4: Given 141 section Re-pin cũ (không cite run_id khuôn mới) và mọi
  evidence hiện có, When chạy toàn bộ lưới sau thay đổi, Then KHÔNG luật mới
  nào áp lên chúng — pre-merge/recheck trên repo hiện tại vẫn `clean` y như
  trước (đường đọc-cũ, không retro-enforce, không migrate).
- AC-5: Given diff 2 file `scripts/pre-merge-check.sh` +
  `scripts/recheck-evidence.js` của feature này, When review, Then chỉ THÊM
  luật mới — không điều kiện/luật/thông điệp hiện có nào bị sửa hay xoá
  (ngưỡng chết O1: nới lưới = không ship).
- AC-6: Given `acceptance-verify.js` nhận args `invokedSha`, When chạy round
  bất kỳ, Then mọi dòng run-log eval của round đó mang field `sha`; args
  vắng → dòng không có field, KHÔNG crash (đường đọc-cũ cho caller cũ).
- AC-7: Given round fix sau REJECT với dòng run-log round trước CÓ `sha`,
  When chuẩn bị args S4, Then eval máy/ui có `paths` không khớp
  `git diff --name-only <sha>` VÀ round trước exit 0 → vào `carriedEvals`
  (giữ run_id gốc, `carried_from_round` đúng); eval chạm diff / round trước
  đỏ / thiếu `paths` → chạy lại; suite LUÔN chạy lại.
- AC-8: Given dòng run-log round trước KHÔNG có `sha` (lịch sử cũ), When
  chuẩn bị args round fix, Then KHÔNG carry — full re-run như hiện tại
  (mặc định an toàn); đối chứng dương: cùng kịch bản có `sha` thì carry.
- AC-9: Given criterion mang dấu cross-layer trong hợp đồng của nó, When carry round fix, Then
  atomic-pair giữ nguyên: bất kỳ thành viên nào của cặp phải chạy lại → chạy
  lại CẢ CẶP.
- AC-10: Given round fix có carry, When trình kết quả + gói Gate 2, Then ghi
  RÕ danh sách eval carried (P1) như luật Đợt 5 — carry không được ẩn vào
  "máy đã lo".
- AC-11: Given toàn bộ suite hiện hành + hook L2 đối chiếu run_id, When chạy
  sau thay đổi, Then tất cả xanh và hook KHÔNG nhận nhầm dòng `kind:repin`
  làm dòng eval (khuôn kind khác nhau phân biệt được).
- AC-12: (judgment) Cơ chế không mở đường gian lận nào mới: soi diff 2 file
  cưỡng chế + nghi thức SKILL, trả lời "1 run_id cho N chữ ký khi code đã
  đổi giữa chừng có lọt lưới nào không, kể cả thứ tự thao tác lắt léo
  (re-pin một phần, commit xen giữa, run-log bị sửa tay)".
- AC-13: (judgment) Nghi thức mới trong SKILL đọc được và làm được bởi một
  phiên KHÔNG có ngữ cảnh hội thoại này — đủ bước, đủ thông điệp lỗi, có
  đường lùi khi lane fail (fail → re-pin KHÔNG xảy ra, không ký mù).
- AC-14: (judgment) Given chính sự kiện re-pin do feature NÀY gây ra khi
  ship (dogfood), When trình gói Cổng 2, Then gói PHẢI chứa bằng chứng đếm
  được (N dòng `kind:repin` cùng run_id trên run-log các slug + đúng 1
  agent-lane trong usage-report) — sự kiện chưa xảy ra lúc S4 thì máy trả
  UNCERTAIN, KHÔNG tô xanh trước; người đo và override tại Cổng 2.
- AC-15: Given dòng `kind:repin` được evidence cite, When recheck/pre-merge
  đọc, Then mọi phần tử `suites_exit` phải == 0 — dòng có phần tử ≠ 0 là
  VIOLATION đích danh ("lane đỏ vẫn ký" bị MÁY chặn, không phải lời hứa);
  và run-log của slug VẮNG file trong khi evidence cite run_id khuôn mới
  cũng là VIOLATION (vắng file ⊇ vắng dòng, không skip âm thầm).
- AC-16: Given khuôn dòng repin + section Re-pin đặt MỘT chỗ giữa marker
  `<<<REPIN-TEMPLATE … REPIN-TEMPLATE>>>` trong SKILL, When chạy eval
  round-trip, Then fixture rút TỪ khuôn writer parse được bằng CHÍNH
  recheck (clean), và đột biến một field của khuôn → đỏ — writer/reader
  không thể trôi mà test vẫn xanh.

## Coverage

Từ morphological-scan (4 trục — thước CE trong ngoặc):

- **S — sự kiện re-pin** (CE: 141 mục thật + 5 sự kiện đã chạy tay): AC-1
  (khuôn mới), AC-3 (fraud HEAD-đổi), AC-4 (grandfather), AC-14 (dogfood)
- **C — carry round-fix** (CE: quy tắc P1 Đợt 5 hiện hành): AC-6 (sha vào
  run-log), AC-7 (carry đúng), AC-8 (mặc định an toàn), AC-9 (atomic-pair)
- **E — điểm cưỡng chế** (CE: t3_paths + luật stale hiện có): AC-2 (khớp
  run_id+sha), AC-5 (chỉ-thêm-không-nới), AC-11 (hồi quy + hook không nhận
  nhầm), AC-12 (judgment gian lận)
- **Đ — đường đo O1** (CE: baseline B1-B3 chương trình): AC-1/AC-14 (1 lane
  thay N — đếm được, AC-14 đo tại Cổng 2), AC-10 (minh bạch carry), AC-13
  (judgment nghi thức đọc-được-làm-được)
- Bổ sung sau gap-probe: AC-15 (máy đọc suites_exit + vắng-file nổ to — trục
  E), AC-16 (round-trip khuôn marker — trục E, chống seam trôi)

## Out of scope

- Delta-verify cho SUITE commands — suite luôn chạy lại (an toàn trước, đo
  chương trình xong mới xét).
- Gộp/parallel hoá nhiều sự kiện re-pin; nén/migrate 141 section cũ.
- Retro-enforce luật mới lên evidence cũ.
- Cơ chế carry judgment ngoài P3 hiện có.
- Đổi khuôn chữ ký người/human_override (không chạm dòng human-owned).
