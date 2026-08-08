---
schema_version: 2
feature: "Ceremony diet GĐ1 tái lập — bỏ bắt buộc điền phút, KPI đổi sang tần-suất-sự-kiện-cần-người, ký gộp một lệnh, CHANGELOG + 2.0.0, re-pin theo release — toàn subtraction, không hạ chuẩn bằng chứng nào"
slug: tai-lap-ceremony-diet
risk_tier: T2
surfaces: [cli]
status: implemented
approved_by: Manh Phan
approved_at: 2026-08-08T05:20:00Z
owner: phanlemanh@gmail.com
source: docs/superpowers/specs/2026-08-08-tai-lap-ceremony-diet-design.md
---

# Acceptance contract — tai-lap-ceremony-diet

Bối cảnh: charter tái lập (docs/plans/2026-08-07-tai-lap-don-gian-va-trien-
khai-doi.md §GĐ1) — owner thú nhận `time_human_minutes` lâu nay điền đại vì
gate-fatigue; dữ liệu phút KHÔNG đáng tin và nghi thức điền nó là chi phí
thuần. Đợt phẫu thuật MỘT lần, phạm vi khoá 1a–1d, nguyên tắc chỉ-TRỪ-không-
CỘNG (ngoại lệ duy nhất: helper ký-gộp — thay một nghi thức nhiều bước),
không hạ chuẩn bằng chứng nào. Không hook/lib/script nào đọc
`time_human_minutes` (đã grep 2026-08-08) — bỏ bắt buộc không cần đường
đọc-cũ máy; số cũ trong 30 hồ sơ GIỮ NGUYÊN, chỉ dán nhãn khi báo cáo.

## Criteria

- AC-1: Given bộ chỉ dẫn gate (contract-template + commands/approve.md + commands/signoff.md + SKILL feature-loop cả hai harness + twins Codex của approve/signoff), When đọc sau phẫu thuật, Then KHÔNG còn chỉ dẫn BẮT BUỘC hỏi/điền phút tại cổng (từ vựng "hỏi user số phút" biến mất; template không còn khối time_human_minutes bắt buộc; điền phút vẫn HỢP LỆ nếu người tự muốn — optional, reader cũ không vỡ); bảng KHUÔN-CẤM khai đích danh trong khối marker của case (tối thiểu: chuỗi chỉ-dẫn-hỏi-phút của cả hai harness + khối time_human_minutes bắt-buộc trong template), quan hệ tập-file-khai↔tập-quét là ĐẲNG THỨC; mention dạng tuỳ-chọn là ĐỐI CHỨNG KHÔNG-ĐỎ (có case chứng minh); mutation chèn khuôn-cấm chạy LẶP TRÊN TỪNG FILE trong tập khai → đỏ ghim đúng tên file; đối chứng dương bộ thật xanh.
- AC-2: Given commands/acceptance-report.md (cả twin Codex nếu có), When đọc phần chỉ dẫn tổng hợp, Then dữ liệu phút cũ phải được dán nhãn nguyên văn "tự khai — không đáng tin" và KPI phía người là TẦN SUẤT SỰ-KIỆN-CẦN-NGƯỜI đếm từ git (định nghĩa máy-đọc: số commit chạm dòng human-owned của hồ sơ, đếm bằng git log trên _acceptance/<slug>/); VÀ định nghĩa phải THI HÀNH ĐƯỢC: một lượt chạy đúng lệnh trong chỉ dẫn trên chính kit với 1 hồ sơ đã ký in ra số nguyên ≥ 1 kèm tên slug; mutation xoá nhãn / xoá định nghĩa / làm hỏng cú pháp lệnh trong bản sao → đỏ ghim tên mục hoặc tên lệnh; đối chứng dương xanh.
- AC-3 *(mở rộng 08/08 — người phê Cổng 2 trong chat)*: Given helper scripts/sign-batch.mjs và một fixture repo code-sinh có N hồ sơ status verified chờ ký, When chạy MỘT lệnh với tên người ký, Then helper điền human_signoff + nâng status signed-off cho cả lô + in MỘT lệnh git commit đích danh các file đã sửa cho NGƯỜI tự chạy — helper TUYỆT ĐỐI không tự chạy git commit (giữ require_human_commit: commit chữ ký vẫn của người, tách khỏi commit máy); hồ sơ chưa verified trong lô → bị TỪ CHỐI ghim tên slug, không ký mù; hồ sơ verified mà verdict evidence KHÔNG phải PASS (PENDING-JUDGMENT/khác) HOẶC bypass_used true chưa có bypass_ack → cũng TỪ CHỐI cả lô ghim tên slug + lý do (không ký hồ sơ còn việc-của-người); mutation làm helper tự commit trong bản sao → đỏ ghim "helper tự commit"; đối chứng dương: lô fixture ký xong rồi chạy pre-merge-check.sh THẬT trên fixture → clean (reader thật xác nhận chữ ký helper điền đúng khuôn — round-trip writer-mới↔reader-cũ); hồ sơ fixture sinh bằng khuôn rút từ evidence-report-template.md, cấm viết tay khớp khuôn helper đọc.
- AC-4: Given CHANGELOG.md tại gốc repo, When đọc, Then tồn tại mục 2.0.0 nói tiếng người đủ 4 món (bỏ điền phút · ký gộp · re-pin theo release · đổi số version) + câu "chuẩn bằng chứng giữ nguyên"; mutation xoá một món khỏi bản sao → đỏ ghim tên món; đối chứng dương xanh.
- AC-5: Given manifest cả hai gói (acceptance-gate: .claude-plugin + .codex-plugin + codex/ + mirror; feature-loop: .claude-plugin + codex twin + mirror), When đọc version từ nguồn sống, Then TẤT CẢ = 2.0.0 (đổi số thật để né bug update-bỏ-qua-khi-số-trùng); mutation hạ version một manifest trong bản sao → đỏ ghim tên gói; đối chứng dương xanh.
- AC-6: Given GUIDE.md và CLAUDE.md, When đọc chính sách re-pin, Then có đoạn re-pin-theo-RELEASE (merge chạm engine gom về mốc release; một chiến dịch re-pin mỗi release, không mỗi merge) và SKILL feature-loop (cả hai harness) trỏ về chính sách đó thay vì ngầm định re-pin-mỗi-merge; mutation xoá đoạn chính sách một chỗ → đỏ ghim tên file; đối chứng dương xanh.
- AC-7: Given một repo nháp code-sinh trong lần chạy và checkout hiện tại của kit, When chạy chuỗi giả-lập consumer (dựng scaffold _acceptance/ + config.yaml RÚT TỪ khối mẫu trong commands/acceptance-init.md — round-trip từ chỉ dẫn thật, không chép tay → viết contract mẫu → render gate-card → pre-merge-check trên repo nháp), Then cả chuỗi exit 0 và card chứa tiêu chí mẫu, TRONG ĐÓ chữ ký của hồ sơ mẫu do CHÍNH sign-batch (1b) điền — cấm chép tay human_signoff vào fixture (round-trip 1b↔consumer-sim, hai vật kiểm nhau) — rồi pre-merge-check clean trên repo nháp; phá bản sao (config mẫu bị moi khối) → đỏ ghim tên bước hỏng; đối chứng dương xanh.

## Coverage

- Trục A món phẫu thuật: 1a-phút | 1a-KPI | 1b-ký-gộp | 1c-changelog | 1c-version | 1d-repin-release | consumer-sim [CE: charter §GĐ1 — phạm vi khoá]
- Trục B vật mang: template | commands Claude | SKILL feature-loop ×2 harness | twins Codex approve/signoff | script mới | manifest ×7 | GUIDE+CLAUDE [CE: grep định vị 2026-08-08]
- Trục C chiều kiểm: vắng-mặt-nghi-thức (subtraction) | tồn-tại-mới | hành-vi helper | kênh-giao version [CE: khuôn MEASURE-BIRTH + P181 đã ship]

| Ô Core | AC |
|---|---|
| 1a-phút × mọi vật mang chỉ dẫn (vắng-mặt) | AC-1 |
| 1a-KPI × acceptance-report | AC-2 |
| 1b × script mới (hành-vi + không-tự-commit) | AC-3 |
| 1c-changelog | AC-4 |
| 1c-version × 7 manifest (kênh-giao) | AC-5 |
| 1d × GUIDE+CLAUDE+SKILL | AC-6 |
| consumer-sim (nghiệm thu charter) | AC-7 |

Later: Codex parity sâu hơn mức không-vỡ (usage=0 — dữ liệu GĐ4). Never (cấm
chen đợt này, theo charter): cổng-theo-rủi-ro tự-qua · thẻ vật-trước ·
mothball Codex/design-loop · mở lại lab · phép đo mới không phục vụ 1a–1d.

## Out of scope

- KHÔNG hạ chuẩn bằng chứng nào: hook chữ ký, require_human_commit,
  recheck, pre-merge — nguyên trạng tuyệt đối.
- KHÔNG sửa số phút cũ trong 30 hồ sơ đã ký (bất biến chữ ký) — chỉ dán
  nhãn ở tầng báo cáo.
- KHÔNG thêm cơ chế cưỡng chế mới (chỉ-TRỪ-không-CỘNG; sign-batch là helper
  điền hộ, không phải chốt).
- KHÔNG đụng cổng-theo-rủi-ro / thẻ vật-trước / mothball / mở lại lab (đối
  tượng GĐ4, cần sổ vấp + 3 số trước).

## Notes

- Ngân sách charter: ≤2 vòng S4 — quá → CẮT 1d, không thêm vòng.
- Nghi thức bắt buộc khi sửa SKILL feature-loop (cả hai harness): chạy lại
  make-record của stop-patching-law VÀ measure-birth-certificate rồi commit
  evidence tái sinh — hai suite round-trip từ chính file SKILL.
- Baseline khuôn khai sinh (ghi khi ký, quyết Cổng 2 08/08): vòng viết-thước
  ĐẦU TIÊN dưới MEASURE-BIRTH-CLAUSE vẫn sinh 4 lỗi-thước in-contract (r1).
  Dữ liệu này ỦNG HỘ hướng giảm-viết-thước (đóng băng lab, bớt phép đo mới),
  KHÔNG phải lý do thêm chốt meta.
- Known limits (Cổng 2, nhóm C) — CẢ BA ĐÃ ĐÓNG trong đợt bugfix cửa sổ
  2.0.0 (08/08, đường (b) ship-với-giới-hạn kéo bugfix lên trước ký):
  (i) dòng parse Codex acceptance-report đã cân ngoặc + trả nhãn tự-khai;
  (ii) con trỏ CHANGELOG trong 5 manifest nguồn đã trỏ "repository" thay vì
  ngầm định file đi kèm gói; (iii) sign-batch từ chối tên chứa " ` $ \
  (exit 2 ghim thông điệp). Giới hạn còn lại sau đợt: bộ lọc ONLY_BLOCK
  không phủ ~46 khối inline (đã khai trong ledger, measure-teeth-cleanup).
- Đo baseline khuôn khai sinh (revisit AC-7 của measure-birth-certificate):
  đây là feature ĐẦU TIÊN viết phép đo mới sau khi MEASURE-BIRTH-CLAUSE
  ship — ghi lại tỷ lệ lỗi-thước-mới-viết của vòng này ở Gate 2.
