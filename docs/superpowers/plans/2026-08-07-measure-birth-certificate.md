# Plan — measure-birth-certificate

**Nguồn:** [design](../specs/2026-08-07-measure-birth-certificate-design.md) ·
contract 9 AC đã duyệt Cổng 1 (2026-08-07). Tier T2.

## Thứ tự & phụ thuộc

T1 (ledger) → T2 (references, cần bảng lớp từ ledger). T3 (SKILL clause) →
T4 (đóng vai, cần clause tồn tại). T5 (suite cases) cần T1–T4. T6 chốt đuôi.
T1 ⊥ T3 (khác file, chạy song song được về lý thuyết — nhưng cùng phiên nên
đi tuần tự T1 → T3 cho gọn).

## Tasks

### T1 — Ledger vòng đời known-limits `independent: true`
- **Files:** `docs/research/known-limits-ledger.tsv` (mới) + script trích
  xuất một-lần trong scratchpad (không vào cây nguồn).
- **Việc:** trích mọi mục `Đề xuất: known-limits` từ
  `_acceptance/*/review-findings.md` → id ổn định `<slug>#<n>`; gắn
  `status`: `chet` cho 6 nhóm bản-rà đã kiểm tay (kèm `closed_by`), `trung`
  cho 10 cặp bản-rà (kèm `dup_of`), còn lại `song` (mặc định an toàn — bước
  (b) sẽ rà tiếp); cột `class` theo bảng lớp bản rà; cột `sev` từ nguồn.
- **Verify:** đếm mục từ corpus > 0 và số dòng ledger ≥ số đếm; enum status
  hợp lệ; mọi `chet` có closed_by; mọi `trung` có dup_of trỏ id tồn tại.
- **Phục vụ:** E6 (và cấp bảng lớp cho E4).

### T2 — References `measure-birth.md` `independent: false` (cần T1)
- **Files:** `skills/acceptance/references/measure-birth.md` (mới, nguồn) —
  mirror sync ở T5.
- **Việc:** giấy khai sinh 3 mục đúng tên máy-đọc (đối-chứng-dương /
  phá-vật-thật / thông-điệp-ghim) + 2 mẫu sống trích từ suite thật (L35/L35b
  NEG_RE, PM13/PM14 pre-merge ac-line) + bảng lớp lỗi từ ledger T1 (mỗi lớp
  1 ca đại diện còn `song`).
- **Verify:** file có đủ 3 heading mục + 2 khối mẫu + bảng; resolver
  `--require` file trả gốc.
- **Phục vụ:** E4.

### T3 — Mệnh đề MEASURE-BIRTH-CLAUSE 2 bản chỉ dẫn `independent: true`
- **Files:** `feature-loop/skills/feature-loop/SKILL.md` (S3 + con trỏ S1#4),
  `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` (tương ứng),
  `feature-loop/.claude-plugin/plugin.json` + twin Codex manifest (bump
  1.27.0 + mục changelog).
- **Việc:** một khối mệnh đề giữa cặp mốc, nội dung cốt như contract §Khuôn;
  con trỏ 1 câu ở đoạn viết evals.yaml; đổi SKILL phải kiểm vùng
  STOP-PATCHING-CLAUSE không bị chạm (cạm bẫy handoff — nếu chạm thì chạy
  lại make-record của stop-patching-law).
- **Verify:** bóc khối giữa mốc ra được ở cả 2 bản; so chuẩn hoá khớp;
  version đọc từ manifest = 1.27.0.
- **Phục vụ:** E1, E2, E3, E9 (một phần).

### T4 — make-record.mjs + 4 lượt đóng vai `independent: false` (cần T3)
- **Files:** `_acceptance/measure-birth-certificate/make-record.mjs` (mới),
  `_acceptance/measure-birth-certificate/evidence/` (4 bài làm + record).
- **Việc:** script sinh 2 biến thể chỉ dẫn (có/gỡ khối) suy từ nguồn thật
  trong chính lần chạy (không chép tay); 4 lượt agent context-sạch nhận đề
  "viết phép đo cho <kịch bản đại diện>"; record ghi artifact khác rỗng +
  dấu hoàn-thành + verdict sinh-cặp/không per lượt.
- **Verify:** 4/4 artifact khác rỗng; 2/2 bản-có sinh cặp; 2/2 bản-gỡ
  hoàn thành mà không sinh đủ; record khớp nguồn (round-trip).
- **Phục vụ:** E5.

### T5 — Suite cases + bump acceptance-gate + sync mirror `independent: false` (cần T1–T4)
- **Files:** `tests/plugins/run-tests.sh` (khối case mới + khối marker khai
  đích danh id case), `.claude-plugin/plugin.json` + `.codex-plugin` (bump
  acceptance-gate 1.39.0 + changelog), chạy `sync-plugin-packages.sh`
  (mirror cả references T2).
- **Việc:** case cho E1–E9 — MỖI case đúng khuôn cặp hai-chiều cùng fixture
  (khuôn tự áp, AC-8); khối khai id: `MBC-CASE-IDS`.
- **Verify:** suite plugins xanh; mutation thử tay 1 ca đại diện mỗi nhóm.
- **Phục vụ:** E1–E9 (toàn bộ chạy qua suite).

### T6 — Chốt đuôi `independent: false`
- **Việc:** chạy 4 suite + sync --check + product-map --check; kiểm vùng
  STOP-PATCHING không đổi (nếu đổi → chạy lại make-record stop-patching-law
  + commit 5 file evidence); set contract `status: implemented`.
- **Verify:** 6 lệnh kiểm xanh tại HEAD.
