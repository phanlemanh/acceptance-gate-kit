# Retro V1 — trang-tu-van-v2 vòng r1 (27→29/07/2026)

*Nguồn: `v1-journal.md` + `decisions.jsonl` (19 entries) + 8 round S4 +
truy nguyên chuỗi E03 + nhật ký can thiệp A/B/C + DP-1 scorecard. Vòng kết
thúc bằng quyết định owner: Cổng 2 KHÔNG ký (commit `acf8e742`), restart r2
trên khuôn plugin. Retro này là điều kiện vào Pha 3 (gói lưới) + spec v2.*

## 1. Dòng thời gian & con số

| Chặng | Số liệu |
|---|---|
| Discovery (D1a→Cổng 0) | 373' wall-clock, trong đó D1a = 293' (79% — khảo cổ thiếu nền) |
| S1 → Gate 1 | 14 AC / 26 eval (23 máy + `paths`, 3 judgment) / gap-probe 2 P0 vá tại chỗ / Gate 1 **8 phút** |
| S3 | 9/9 task tuần tự (lệch-có-tên, có ledger) |
| S4 | **8 round**: r1-r2 REJECT (15 defect thật) · r3 khủng hoảng thước #1 (exit_code nói dối xanh) · r4 khôi phục trung thực · r5 vá theo E2E · r6 REJECT + khủng hoảng #2 (3/6 ảnh trùng byte) · r7 khủng hoảng #3 (E21/E22 = lỗi bộ chụp, không phải sản phẩm) · **r8 PENDING-JUDGMENT, 0 lỗi trong hợp đồng** |
| Kết cục | Máy hội tụ (`verified`) — **người bác tại Cổng 2** vì khung nằm ngoài hợp đồng |
| DP-1 | **GO 3/3** (100% thước đo → AC · 0 bullet mất · 0 câu trùng) |

**Con số đắt nhất:** ~4/8 round chi phí chủ yếu cho việc **giữ thước đo trung
thực**, không phải sửa sản phẩm.

## 2. Cái chạy tốt — giữ nguyên, không đụng

1. **Mối nối opportunity → contract là thật** (DP-1 GO biên độ rộng; tracer
   chỉ-file: re-rank #1, SourceBundle/TA, 3 lớp ô đều vào contract).
2. **Doer≠grader cứu vòng 3 lần**: grader fresh mở ảnh bắt trùng-byte; session
   tự từ chối trình cổng trên bằng chứng gian; văn hoá "REJECT trung thực luôn
   hợp lệ" sống thật.
3. **Trình tự rẻ→đắt của discovery**: red-team đổi đối tượng prototype đúng
   lúc; phép thử schema 8' giết ẩn số hạ tầng; ngưỡng-chết-khai-trước giúp
   Cổng 0 archive prototype không tiếc tay.
4. **Gate 2 refusal hoạt động đúng thiết kế** — lần đầu được dùng: máy xanh
   không ép được người ký.
5. Ledger 19 entries đúng rule đáng-log; artifact sống + mermaid khi trình
   duyệt; carry-forward `paths` phủ 23/23 eval máy.

## 3. Cái hỏng — 8 bài học

| # | Hiện tượng | Gốc | Hành động (đã queue) |
|---|---|---|---|
| B1 | View mang DNA E03, khác khuôn plugin — máy hội tụ vào một hợp đồng sai khung | Chuỗi 7 bước: vật liệu ngoài vào không phân loại + không đối trọng (repo skill chuẩn-plugin không được nạp) + không tầng nào hỏi platform-fit | 3 lưới Pha 3 (trường "Nguồn ngoài & phạm vi kế thừa" · gap-probe câu platform-fit · S1 bắt nạp skill chuẩn repo) |
| B2 | Thước đo nói dối cả hai chiều, 3 lần (exit_code xanh giả · ảnh trùng byte · bộ chụp làm judge fail oan) | Tầng aggregation/capture không có tự-phản-nghiệm; hook/CI không đối chiếu được | T3-hardening spec v2: đối chiếu exit_code report↔run-log per run_id · hash ảnh per-state đôi-một khác · bộ chụp có negative control |
| B3 | Cap 3 round trôi tới 8 | Escalation không cứng; goal + user cho phép ngầm | Spec v2: mỗi round vượt cap = 1 phê chuẩn người có vết |
| B4 | Loop không tự chạy — user phát hiện giữa S3 | Gate 1 in gợi ý /model nhưng rớt /goal (bệnh có hồ sơ, tái hiện) | Lưới Pha 3: Gate 1 in mặc định gợi ý /goal |
| B5 | Phản hồi người giữa vòng không có chỗ đổ (3 phàn nàn của owner suýt bay hơi) | Kit chỉ có kênh tại Gate; giữa vòng = chân không | Spec v2: quy ước "phản hồi người giữa vòng → review-findings.md, card Cổng 2 trình lại" |
| B6 | Đóng vòng không-signoff phải tự chế (không status, gate2 phút bỏ trống) | Contract thiếu trạng thái `superseded/closed-unsigned` | Spec v2: thêm trạng thái + nghi thức đóng vòng |
| B7 | Worktree bị phiên khác giẫm giữa S1 (checkout main của maintainer) | Nhiều phiên chung một cây làm việc | Spec v2: worktree riêng = bước S0 mặc định cho T2/T3; luật một-worktree-một-phiên |
| B8 | Chuyên gia đứng cạnh che lỗ kit (mọi paste-block là một lỗ không được ghi) | Phương pháp probe ban đầu cho phép coaching | Đã đổi 29/07: kit tự dẫn, mọi chỗ hụt GHI thành lỗ; nhật ký can thiệp = spec đóng gói; phép đo của r2 = số lần đỡ tay giảm |

## 4. Quy luật meta — để nhìn thấy sớm ở lần sau

1. **Model neo vào khối context mạnh nhất trên bàn cân.** Nhập vật liệu ngoài
   giàu = phải đặt đối trọng nội (chuẩn repo) lên cùng bàn — nếu không, trung
   thành của model trở thành khuếch đại drift. Chi tiết không phải tội;
   không-phân-loại mới là tội.
2. **Phễu mới phải có lưới.** Mọi kênh input mới xây (discovery là một) phải
   kèm bộ lọc nhập cảnh ngay từ thiết kế, không đợi tai nạn đầu tiên.
3. **Mọi phép đo cần đường tự-phản-nghiệm máy-kiểm được.** Ba khủng hoảng
   thước đều thuộc lớp "đối chiếu được bằng máy mà chưa ai đối chiếu".
4. **Hợp đồng chỉ bảo vệ thứ nó có ghi** — máy hội tụ ≠ sản phẩm đúng; Gate 2
   của người là chốt cuối đúng nghĩa, và chi phí 8 round trên khung sai nhắc
   rằng: sửa khung sớm một bậc (S1) rẻ hơn bác muộn một cổng (Gate 2).

## 5. Số phận hồ sơ vòng r1 (input cho r2)

- **Giữ nguyên giá trị:** opportunity + red-team + schema-probe (sự thật thị
  trường, không dính drift) · kiến trúc dữ liệu (module schema, migration,
  snapshot-tầng-module) · ngưỡng UAT hai tầng.
- **Ứng viên keep có điều kiện (bảng nợ Cổng 0 r2):** T1–T6 (contracts,
  migration, generator, write-path, track, OG-fix) — pass evals máy, không
  dính UX; kèm guard diffBase + baseline.
- **Archive dựng lại theo khuôn plugin:** T7–T9 (view layer).
- Branch `feat/trang-tu-van-v2` + workspace = sử liệu, không xoá.
