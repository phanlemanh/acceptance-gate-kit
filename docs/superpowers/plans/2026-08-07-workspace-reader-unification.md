# Kế hoạch — workspace-reader-unification

Cổng 1 ký 2026-08-05 (10 phút). T3 · 8 AC · 19 eval. Kế hoạch này chờ Cổng 1.5.

Hiện trạng (khảo sát 07/08, một agent đọc toàn bộ bốn bên đọc):

- `lib/workspace-record.js` phủ **3/5 file** — `evidence-report.md` và
  `PRODUCT-MAP.md` chưa có trong bảng luật; luật "khai xong mà thiếu file"
  sống RIÊNG ở `start-scan.mjs:189` và `pre-merge-check.sh:637`.
- `evidence-report.md` có **3 bản luật độc lập** (start-scan · pre-merge bash ·
  recheck-evidence). P123 cố ý loại trục này — đúng món nợ AC-1.
- Nhãn trạng thái bản đồ có **3 chuỗi không rút từ bảng chung**: `daBat`
  (product-map:317) · `map.enabled` (start-scan:286) · văn xuôi start.md:60-66.
- `configList` bug key-line-comment (round 16) **chưa sửa**, P130 chưa có RED
  case hình dạng đó.
- start-scan còn kiểm `contract.md/status` bằng tay TRƯỚC khi hỏi lib
  (:124-126, :207), chuỗi lỗi lệch "parse" vs "đọc".
- `product-map --check` fail-open khi `--root` sai (AC-5); `since` bịa mốc ở
  start-scan:179 (AC-8); template UAT thủ tục chép ở văn xuôi (AC-4);
  CONTEXT.md thiếu 3/4 mục (AC-6).

## Bảng kế hoạch

(Cột một theo khuôn bảng tóm tắt kế hoạch của bản luật ngôn ngữ mặt người;
không chép nguyên tên cột — khuôn chỉ nằm một chỗ.)

| Sau việc này khác gì | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Hồ sơ nghiệm thu và bản đồ được kiểm bằng đúng MỘT bảng luật, thêm file vào bảng mà quên ca thử là lưới đỏ | `lib/workspace-record.js` | AC-1 (luật một chỗ) |
| Kết luận của cổng máy và kết luận của phiên nghiệm thu không bao giờ bị chấm lẫn thang của nhau | `lib/workspace-record.js` | AC-2 (hai thang điểm tách bạch) |
| Bản đồ bị xoá thì mọi nơi cùng nói "đã xoá", không nơi nào nói "chưa dựng" | `lib/workspace-record.js` + `scripts/product-map.mjs` + `scripts/start-scan.mjs` + `commands/start.md` | AC-3, AC-7 (một bảng nhãn) |
| Người chép khuôn phiên nghiệm thu theo chỉ dẫn là ra hồ sơ lành, máy rút được thủ tục chép ra thi hành | `skills/acceptance/references/uat-session-template.md` | AC-4 (khuôn chép được) |
| Gõ nhầm đường dẫn khi kiểm bản đồ thì được báo sai đường, không được im lặng xanh | `scripts/product-map.mjs` | AC-5 (không xanh giả) |
| Người tra từ điển thấy đủ bốn cổng, hai hồ sơ mới, và cảnh báo một chữ hai nghĩa | `CONTEXT.md` | AC-6 (từ vựng) |
| Máy chạy trên bản tải nông của CI cho cùng nhãn với máy trạm | `scripts/product-map.mjs` + fixture cây nông | AC-7 (dạng cây) |
| Ba thứ chưa làm không bị mặt nào hứa hộ | `codex/**` + `scripts/start-scan.mjs` | AC-8 (biên không rò) |
| Dòng cấu hình có chú thích đuôi được cả hai bản đọc hiểu giống nhau | `lib/workspace-record.js` (`configList`) + P130 | Notes r16 (RED case mới) |

## Thứ tự task (7 task, mỗi task một commit)

1. **T1 — mở rộng bảng luật lib**: thêm `evidence-report.md/verdict`
   (PASS/PENDING-JUDGMENT/REJECT/BLOCKED) vào `NAV_RULES`; đưa luật
   "khai-xong-mà-thiếu-file" thành hàm export (`missingArtifact(texts)`)
   để start-scan và pre-merge (qua một lệnh node mỏng) cùng gọi; sửa
   `configList` nhận key-line-comment; thêm bảng nhãn bản đồ
   `MAP_LABELS = {daXoa, chuaDung, dangCo}` export chung.
2. **T2 — start-scan bỏ bản sao**: xoá kiểm tay `:124-126`/`:207`, thay
   `readEvidence` bằng luật lib; nhãn bản đồ đọc `MAP_LABELS`; `since` bỏ
   trống khi thiếu `decided_at` (AC-8).
3. **T3 — product-map**: guard `--root` (không tồn tại / chưa init — hai
   thông điệp khác nhau, AC-5); nhãn `--check` đọc `MAP_LABELS`.
4. **T4 — pre-merge/recheck hội tụ**: chỗ đọc verdict/thiếu-file của bash gọi
   qua node mỏng vào lib (giữ doctrine rộng-khi-dò ở `claims_released` —
   KHÔNG đổi, chỉ hội tụ chỗ chặt-khi-nhận); recheck giữ evidence-core
   (ngoài phạm vi bảng luật — ghi chú tường minh trong plan, không đổi).
5. **T5 — khuôn UAT + CONTEXT.md**: thủ tục chép vào khối marker
   `UAT-COPY-PROCEDURE`; bốn mục từ điển (AC-4, AC-6).
6. **T6 — Codex parity biên**: quét bản Codex không hứa nghi thức phiên
   nghiệm thu (AC-8).
7. **T7 — lưới**: P123 mở trục evidence-report (tích Descartes rút từ bảng
   luật — tập file suy từ `NAV_RULES`, không chép tay); P130 thêm hình dạng
   key-line-comment; ca mới cho MAP_LABELS hai dạng cây + `--root` sai;
   nâng bản acceptance-gate 1.38.0; sync mirror; 6 lệnh kiểm.

## Rủi ro & luật chơi

- **T3 path**: `lib/**` và `scripts/pre-merge-check.sh` nằm trong `t3_paths` —
  bug ở đây thành false-green trên MỌI repo tiêu thụ. Mỗi luật hội tụ phải có
  đối chứng dương (bản nguyên vẹn xanh) + mutant đổi-kết-luận, theo đúng nghi
  thức "phá vật thật trong bản sao".
- **Doctrine hai tầng của pre-merge** (rộng-khi-dò, chặt-khi-nhận) là quyết
  định cũ có chủ đích — hội tụ CHỖ CHẶT, không đụng chỗ rộng.
- **Sửa SKILL nào có mốc STOP-PATCHING-CLAUSE thì phải chạy lại
  `make-record.mjs`** của stop-patching-law (known-limit vừa ký) — kế hoạch
  này KHÔNG chạm hai file đó; nếu S4 buộc chạm, chạy lại bộ sinh trước khi
  chạy suite.
- Luật dừng-vá mới có hiệu lực với chính vòng này: vòng sửa thứ hai còn lỗi
  cùng lớp là dừng trình người, không đốt vòng ba.
