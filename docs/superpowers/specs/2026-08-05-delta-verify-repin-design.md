# delta-verify-repin — thiết kế (vòng 1 chương trình 80/20)

*2026-08-05 · **T3** (chạm `scripts/pre-merge-check.sh` + `scripts/recheck-evidence.js`)
· Nguồn: [chương trình 80/20](../../plans/2026-08-05-nang-cap-8020-graph-loop.md)
mục O1 + R1. Ràng buộc bất di dịch: KHÔNG hạ một chuẩn bằng chứng nào.*

## Bài toán

Baseline B1: 141 lượt machine-lane trùng (~5-6M token) vì mỗi sự kiện re-pin
chạy N agent × CÙNG 4 suite trên CÙNG sha — vi phạm chính nguyên tắc 7 của
Graph Engineering ("N verifier giống nhau = 1 verifier đắt gấp N"). Baseline
B3: round fix sau REJECT full re-run mọi eval kể cả eval không chạm diff-fix.

## Cơ chế A — re-pin: 1 lượt lane + N chữ ký cùng run_id

1. **Nghi thức mới (SKILL feature-loop + acceptance):** một sự kiện re-pin =
   dispatch **1 agent tươi** chạy machine-lane (4 suite + sync --check) tại
   HEAD, trả `{run_id, sha, suites_exit}`. Main loop append dòng
   `{"ts","kind":"repin","run_id","sha","suites_exit":[...]}` vào
   **run-log.jsonl CỦA TỪNG slug được re-pin** (giữ nguyên hạ tầng đối chiếu
   per-slug của hook/recheck — không file chung mới), rồi mỗi
   evidence-report: `verified_commit` → sha đó + section `### Re-pin` **cite
   `run_id` nguyên văn**.
2. **Chống gian lận 2 tầng (máy, không lời hứa):**
   - T1: recheck-evidence + pre-merge — evidence-report có section Re-pin
     cite `run_id` (khuôn mới) → run-log slug đó PHẢI có dòng `kind:repin`
     mang đúng run_id ấy, `sha == verified_commit`, VÀ **mọi phần tử
     `suites_exit` == 0** (máy đọc kết quả lane — "lane đỏ vẫn ký" là
     VIOLATION, không phải lời hứa; run-log slug VẮNG file khi evidence cite
     run_id cũng là VIOLATION, không skip âm thầm). Lệch → VIOLATION.
   - T2: mượn run cũ khi HEAD đã đổi tiếp → `verified_commit` = sha cũ →
     **luật stale hiện hành tự bắn** (code đổi sau verified_commit). Không
     cần luật mới — đây là lý do cơ chế không hạ chuẩn.
3. **Đường đọc-cũ (grandfather):** 141 section cũ không cite run_id khuôn
   mới → KHÔNG luật mới nào áp lên chúng; mọi lưới cũ giữ nguyên hiệu lực.
   Luật mới chỉ enforce khi section CÓ cite run_id.
4. **Khuôn một-chỗ-có-marker (chống seam trôi):** khuôn dòng `kind:repin`
   và khuôn section `### Re-pin` đặt MỘT chỗ trong SKILL giữa cặp marker
   `<<<REPIN-TEMPLATE … REPIN-TEMPLATE>>>` (mẫu OOC-ITEM-TEMPLATE); eval
   round-trip rút fixture TỪ khuôn writer rồi parse bằng CHÍNH recheck —
   writer/reader không thể trôi mà test vẫn xanh.
5. **Doer ≠ grader giữ nguyên:** lane vẫn là agent tươi — điều bị bỏ là N-1
   bản sao trùng, không phải sự độc lập.

## Cơ chế B — P1 carry cho round fix sau REJECT

1. Mỗi dòng run-log eval từ nay mang thêm `sha` (args mới `invokedSha` của
   `acceptance-verify.js` — script ghi vào từng dòng).
2. Round fix: anchor = `sha` của dòng round trước. `deltaFiles = git diff
   --name-only <sha đó>` (chỉ diff của fix). Eval máy/ui có `paths` không
   khớp deltaFiles VÀ dòng round trước `exit_code: 0` → `carriedEvals` (đúng
   khuôn P1 sẵn có, giữ run_id gốc + `carried_from_round`). Chạm / đỏ /
   thiếu `paths` → chạy lại. **Suite LUÔN chạy lại. Atomic-pair cross-layer
   giữ nguyên.** Judgment theo P3 như cũ (inputsHash).
3. **Mặc định an toàn:** dòng run-log cũ không có `sha` → KHÔNG carry (full
   re-run như hiện tại) — không migrate, không crash.
4. **Minh bạch:** báo user + gói Gate 2 ghi rõ round fix carry gì (mở rộng
   đúng luật Đợt 5).

## Ngưỡng sống/chết (DP-1 — khai trước)

- **GO:** (1) sự kiện re-pin đầu tiên theo nghi thức mới (chính vòng này
  dogfood): N slug stale được re-pin bằng **1 lượt lane** — đếm dòng repin
  cùng run_id trên N run-log + usage-report cho thấy 1 agent-lane thay N;
  (2) round fix đầu tiên sau REJECT có ≥1 dòng `carried_from_round` hợp lệ;
  (3) recheck strict + pre-merge + hook: **0 luật bị nới** (diff 2 file t3
  chỉ THÊM luật, không sửa/xoá điều kiện cũ — đo bằng diff review).
- **NO-GO / chết:** bất kỳ lưới nào phải nới để cơ chế chạy → dừng, thiết kế
  lại (điều kiện O1 của chương trình). Fraud-case không bị máy bắt trong
  test → không ship.

## Out of scope

- Delta-verify cho SUITE commands (luôn chạy lại — an toàn trước, đo sau).
- Gộp/parallel hoá re-pin nhiều sự kiện; nén 141 section cũ.
- Đổi khuôn section `### Re-pin` cũ hay retro-enforce lên evidence cũ.
- Cơ chế carry cho judgment ngoài P3 hiện có.
