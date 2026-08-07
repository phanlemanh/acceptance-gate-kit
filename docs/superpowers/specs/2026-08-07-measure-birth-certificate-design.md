# Design — measure-birth-certificate (khuôn khai sinh phép đo)

**Ngày:** 2026-08-07 · **Tier:** T2 · **Nguồn mở việc:**
[handoff 2026-08-07](../../handoff/2026-08-07-handoff-khuon-viet-phep-do.md) +
[bản rà 108 known-limits](../../research/2026-08-07-known-limits-pattern-scan.md)

## Vấn đề

Quá nửa sổ known-limits (~55–60/108) là nợ-của-thước, dồn vào 3 lớp có tên
(không-thể-đỏ · fail-open · snapshot-nguồn-sống). Nhịp sinh ≈ nhịp dọn
(measure-teeth-cleanup dọn 5 sinh 7) nên tồn kho đứng yên là kịch bản tốt
nhất. Luật hiện có đặt ở khâu DUYỆT (gap-probe soi kế hoạch đo, v1.23
measurement lens soi sau) — chỗ thủng ở khâu VIẾT: ngay 07/08, 4/6 lỗi
trong-hợp-đồng của wru là lỗi thước mới viết dù mọi lớp đã có tên trong sổ
bài học. "Biết không đủ để tránh" — cần thủ tục tại-điểm-hành-động, như
checklist trước cất cánh.

## Giải — khuôn là THỦ TỤC LÚC VIẾT (ràng buộc đã chốt, không lật)

1. **Mệnh đề có mốc `MEASURE-BIRTH-CLAUSE`** trong CẢ HAI bản chỉ dẫn
   (feature-loop S3 + twin Codex), một khối giữa cặp marker: *một phép đo MỚI
   (case suite, eval, rule script) chỉ tính XONG khi kèm cặp case hai-chiều
   trên cùng fixture — vật lành → xanh, phá vật thật → đỏ với thông điệp
   ghim; thiếu cặp = task chưa xong.* S1#4 mang MỘT câu con trỏ về khối.
   Mẫu đã chứng minh đo được hành vi: STOP-PATCHING-CLAUSE (4 lượt đóng vai).
2. **References `measure-birth.md`** (gói acceptance-gate, nạp qua
   resolve-plugin.mjs): giấy khai sinh 3 mục (đối chứng dương / ≥1
   phá-vật-thật đổi-kết-luận / thông điệp ghim) + ≥2 mẫu sống từ suite thật
   (L35/L35b, PM13/PM14) + bảng lớp lỗi từ RED-case bank.
3. **Ledger `docs/research/known-limits-ledger.tsv`** — sổ nợ có vòng đời:
   `id · slug · sev · class · status(song|chet|trung) · closed_by · dup_of ·
   note`, đủ corpus (~108), KHÔNG sửa hồ sơ đã ký. Nhóm nợ-của-thước sống
   nuôi references. Thứ tự S3: ledger TRƯỚC references (khuôn thiết kế trên
   corpus sống).
4. **Đo hành vi** đúng công thức stop-patching-law: make-record.mjs sinh
   record 4 lượt agent context-sạch (2 bản-có → sinh cặp; 2 bản-gỡ → không);
   suite kiểm round-trip record↔nguồn + mutation mốc.
5. **Baseline có đối chứng cho chính khuôn:** Notes contract ghi baseline
   4/6 (2026-08-07) + entry revisit — đo lại ở 2 feature kế; không giảm →
   dừng đắp cơ chế cùng loại.

## Bằng chứng khai sinh = cặp case hai-chiều TRONG suite (quyết định user)

Không phải lời khai tĩnh (mục nát được, điền-cho-có) — bằng chứng tự chạy
lại mỗi CI. Hai chiều trên CÙNG fixture chỉ khác biến đang đo → kết luận
lật được chắc chắn do biến đó. Mẫu sống: L35/L35b (NEG_RE), PM13/PM14
(pre-merge ac-line).

## Phạm vi phiên bản

- feature-loop → **1.27.0** (SKILL ×2 đổi; GOTCHA: đổi nội dung PHẢI bump —
  cache Claude không refresh khi version đứng).
- acceptance-gate → **1.39.0** (thêm references/measure-birth.md).
- Sau khi sửa SKILL có mốc STOP-PATCHING-CLAUSE lân cận: chạy lại
  `_acceptance/stop-patching-law/make-record.mjs` + commit 5 file evidence
  (cạm bẫy handoff).

## Out of scope

Không chốt máy pre-merge (measure-teeth-cleanup: chốt-cần-chốt-cho-chốt) ·
không sửa 27 hồ sơ đã ký · không port consumer đợt này · không dọn nợ sống
(bước (b) sau khi ký).

## Rủi ro

- R1 điền-cho-có → thiết kế cặp-cùng-fixture khó fake hơn checkbox; đo hành
  vi bằng đóng vai.
- R4 overfit corpus lịch sử → khuôn là câu hỏi tổng quát ("phá vật thật thì
  thước có đỏ không?"), bank chỉ là ví dụ.
- Stale-cascade: SKILL + suite đổi → re-pin một làn sau ký (nghi thức chuẩn).
