---
schema_version: 1
feature: Làm cứng bộ quét /start — lỗi phải có tên, không đổi nghĩa
slug: start-scan-hardening
owner: manh@mstar.vn
risk_tier: T2
surfaces: [cli]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-08-03T07:20:00Z
time_human_minutes: {gate1: 8, gate2: 10}
---

# Acceptance Contract: start-scan-hardening

Nguồn scope: 4 known-limits ký tại Cổng 2 start-command (03/08) — xem
`_acceptance/start-command/contract.md` mục Notes. Không mở rộng.

## Criteria

- AC-1: Given workspace có `contract.md` / `opportunity.md` / `evidence-report.md` TỒN TẠI nhưng đọc thất bại (mất quyền, là thư mục…), When chạy bộ quét, Then slug vào `broken[]` với ĐÚNG tên file + reason nêu mã lỗi hệ thống (EACCES/EISDIR…) và nói đúng sự thật (file còn đó, đọc thất bại); slug giữ nguyên chỗ trong danh sách hỏng thay vì bị phân ô theo artifact bên cạnh; các slug lành phân ô bình thường.
- AC-2: Given contract `status: implemented` và evidence-report có `verdict` ngoài từ vựng {PASS, REJECT, PENDING-JUDGMENT} hoặc VẮNG dòng verdict, When chạy bộ quét, Then slug vào `broken[]` với reason nêu tên (cùng khuôn nhánh verified: `verdict không nhận diện được: <X>` / `thiếu verdict`) — không lặng lẽ map sang bước kế.
- AC-3: Given gọi script với `--root` thiếu giá trị, `--root ''`, token lạ, `--root` trỏ đường dẫn không tồn tại HOẶC trỏ vào thứ không phải thư mục, When chạy, Then exit 2 + thông điệp nêu đúng lỗi từng lối (usage / token lạ / đường dẫn), KHÔNG in JSON, KHÔNG trả `config:false`; đối chứng dương: `--root <dir hợp lệ>` vẫn exit 0 JSON như cũ.
- AC-4: Given phép đo mục /start trong GUIDE/README (P101), When viết lại thành hàm dùng chung, Then chân dương chạy hàm trên bản thật trả danh sách lỗi trống; chân âm chạy CÙNG hàm trên mutant của TỪNG file (GUIDE riêng, README riêng) trả đúng thông điệp ghim tên file — mutant nào xanh là case ĐỎ.
- AC-5: Given toàn bộ hành vi đã nghiệm thu của start-command, When áp 4 thay đổi trên, Then P98/P99/P100 + chân dương P101 + 4 suite + mirror --check vẫn xanh; schema JSON giữ nguyên bộ key (marker START-SCAN-KEYS hai harness giữ nguyên, P99 là phép đo).

## Coverage

- Bỏ quét không gian AC — scope là danh sách ĐÓNG 4 mục người đã ký đích danh tại Cổng 2 start-command (entry `descope` trong decisions.jsonl của slug này).
- Trục kiểm duy nhất — ánh xạ known-limit ↔ AC [CE: Notes contract start-command]: mất-quyền-đọc → AC-1 · chân-âm-P101 → AC-4 · verdict-ngoài-từ-vựng → AC-2 · --root-sai → AC-3; AC-5 chống thoái lui phủ phần còn lại.

## Out of scope

- git-lỗi nuốt về null (`git.dirty: null` fail-open lời nhắc worktree) — cần đổi schema + marker 2 harness; vòng riêng (entry revisit).
- Fixture P98/P99 rút từ template marker thay vì viết tay (entry revisit).
- Thêm cờ CLI mới / đổi thân lệnh `/start` hai harness.
- Hai nguồn PRODUCT-MAP + phiên-nghiệm-thu (F-B, chip riêng đang mở).

## Notes

- Từ vựng verdict trong AC-2 ({PASS, REJECT, PENDING-JUDGMENT}) là ảnh chụp
  thời điểm viết. Nguồn sự thật của từ vựng là KHUÔN BÊN VIẾT
  (`skills/acceptance/references/evidence-report-template.md`, gồm cả BLOCKED)
  — thước sống là E10/P104 (round-trip writer↔reader) chứ không phải danh sách
  cứng trong câu AC; phát hiện + quyết tại S4-r2.
- Chốt lỗi của một artifact chỉ được chạy trên các trạng thái TIÊU THỤ artifact
  đó (quyết tại S4-r5 sau 4 round dẫm cùng lớp); thước là P105 — ma trận
  trạng-thái × tình-trạng-artifact ghim toàn phần.

Known limits (Gate 2, Manh Phan 2026-08-03 — tích từ 5 vòng chấm):

- Hồ sơ verified có chữ ký nhưng verdict sai định dạng → báo "đã xong" thay vì
  "cần xem lại" (thứ tự ưu tiên chữ-ký có sẵn từ trước vòng này; trục signoff
  chưa vào ma trận P105).
- `--root` lặp hai lần → lần đầu bị nuốt im lặng (hai thân lệnh hardcode một lần).
- `stage:` bỏ trống trong opportunity.md → hiện như cổng chờ-Cổng-Đáng thay vì
  được nêu tên là hồ sơ ghi dở.
- CHUYỂN VÒNG F-B (quyết Gate 2): thư mục `_acceptance/` mất quyền đọc →
  `config:false` nói dối "repo chưa dựng cổng" / `readdirSync` văng lỗi thô —
  F-B sửa bộ quét khi nối nguồn mới, vá vỏ ngoài tại đó.
