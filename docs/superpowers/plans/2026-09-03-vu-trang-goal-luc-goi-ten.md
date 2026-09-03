# vu-trang-goal-luc-goi-ten — Implementation Plan (S2, T2)

> Hợp đồng: `_acceptance/vu-trang-goal-luc-goi-ten/contract.md` (7 AC) · thiết
> kế D1–D5 · làn V ở Cổng Phạm vi (không Gate 1.5 — T2). Task phụ thuộc nhau
> (cùng file / cùng khuôn) → code TUẦN TỰ trong main loop; S4 đi qua Workflow
> `acceptance-verify` (AC-7 làm chứng bằng run_id).

**Goal:** dòng `/goal` thành vật thẻ Cổng 1 in ra (một nguồn, ba bản chép so
sau-strip + 6 dòng); điểm in dời về mỗi câu xin duyệt thiết kế · Cổng 1 · Gate
1.5; gap-probe S1 đồng bộ; bất biến dừng gọi tên ca «báo rồi ngừng».

## Task 1 — `gate-card.js`: hằng `GOAL_TEMPLATE` + `goal_line` + HTML (AC-1 nửa, AC-2, AC-3)

- Thêm ngay dưới khối `ONE-SHOT-CMD` một khối marker:
  ```
  // <<<GOAL-TEMPLATE — bản chép thứ ba của khuôn goal (SKILL feature-loop · GUIDE · thẻ); P85 so ba bản sau strip + 6 dòng
  const GOAL_TEMPLATE = `…6 dòng nguyên văn khối SKILL…`;
  // GOAL-TEMPLATE>>>
  ```
  Nội dung chép NGUYÊN VĂN 6 dòng giữa rào ``` của SKILL (không trim từng dòng).
- `goalLine(slug)` = `GOAL_TEMPLATE.trim().split('\n').join(' ').replaceAll('<slug>', slug)`.
- `--extract` Cổng 1: thêm `goal_line: goalLine(slug)`. Cổng 2: KHÔNG thêm.
- HTML Cổng 1 (dòng ~648): ngay sau `</div>` của `<div class="mach">…one_shot…</div>`
  chèn `<div class="mach goal">Sau khi trả lời (duyệt hay sửa), dán dòng này để đoạn máy chạy tới cổng kế: <b>${esc(goalLine(slug))}</b></div>` — KHÔNG `<p class="li">` (P185), kề nhau (AC-3), in cả khi thẻ đỏ.
- Verify: `node scripts/gate-card.js --root . --slug <slug thật> --extract --gate 1` có `goal_line`, 0 `<slug>` sót; `--slug <hồ sơ đã ký>` (Cổng 2) không có khoá.

## Task 2 — P85 nới ba bản (AC-1)

- `tests/plugins/run-tests.sh` P85: thêm bản thứ ba rút từ `scripts/gate-card.js` bằng regex
  `` const GOAL_TEMPLATE = `([\s\S]*?)`; `` trong marker `<<<GOAL-TEMPLATE`; so `strip()` ba bản
  đôi một, in ba dòng vế `P85 VE: <file> khop (6 dong)`; đếm dòng = 6 ở cả ba.
- Đột biến trong chính ca: bản sao cây (`scripts` + SKILL + GUIDE) đổi MỘT ký tự giữa dòng ở
  từng bản, chạy lại đoạn so → mỗi lần đỏ gọi tên đúng bản lệch với hai bản kia; đối chứng
  dương bản nguyên vẹn trước. Tiêu đề P85 «2 ban» → «3 ban».

## Task 3 — Lưới hồ sơ `tests/scripts/gate-card-goal.test.mjs` (AC-2, AC-3)

- Fixture code-sinh (mượn `mkWs`/`G1` của `gate-card-lmcms.test.mjs` — tách helper nếu cần, không chép tay).
- GL01: `goal_line` == khuôn rút qua marker của gate-card.js (regex marker, không literal) gộp
  xuống dòng → ' ' và thay `<slug>` bằng phép thay ĐỘC LẬP (`split('<slug>').join(slug)`); assert
  `goal_line` không chứa `<slug>`; số `<slug>` trong khuôn = 2 (đếm, không giả định).
- GL02: HTML — định vị `<div class="mach">…<b>${one_shot}</b></div>`, ngay sau chỉ được `\s*`
  rồi `<div class="mach goal">…<b>X</b></div>`; X == `goal_line` (đẳng thức). Đột biến trong ca:
  bản sao gate-card.js nối « XX» vào `<b>` goal → GL02 đỏ.
- GL03: thẻ đỏ (rơi bậc: gap_probe required + vắng) vẫn có `goal_line` và `.mach.goal`.
- GL04: Cổng 2 (hồ sơ có evidence-report) — JSON không có `goal_line`, HTML không có `mach goal`.
- Đăng ký vào `tests/scripts/run-tests.sh` (runner tự nối `*.test.mjs` — kiểm bằng cách chạy).

## Task 4 — SKILL feature-loop (AC-4, AC-6)

- Dòng 10 (bất biến dừng): thêm vế «Tiến trình nền (agent, Workflow) báo xong giữa một đoạn
  máy → đi tiếp trong CÙNG lượt; «báo cáo rồi ngừng nói» là một lần dừng ngoài thiết kế, đếm
  vào ba dòng số».
- S1#1 (dòng 90): thêm câu «Mỗi câu XIN DUYỆT thiết kế của brainstorm in kèm khối
  GOAL-TEMPLATE (thay `<slug>`): "nếu đồng ý, dán luôn dòng này cùng câu trả lời" — điểm vũ trang
  đầu; brainstorm không hỏi gì thì không có lượt để vũ trang (chưa phủ, đo ở ba dòng số)».
- S1#5 (HARD-GATE): thêm vế «dòng goal in kèm câu xin duyệt KHÔNG phải một cổng».
- S1#7: «dispatch phản biện context sạch ĐỒNG BỘ — chờ trong lượt, không nền — rồi render thẻ
  trong cùng lượt».
- Gate 1 (dòng 108): giữ bước in; sửa «hai bản» → «ba bản» (chú thích dòng 121).
- S2#3 (dòng 143) «T3: GATE 1.5»: thêm «kèm dòng /goal (khối GOAL-TEMPLATE) để S3→S4 chạy sau
  khi duyệt plan».

## Task 5 — GUIDE mục `/goal` (AC-5)

- «Khi nào» → ba thời điểm; thêm «làn V T2 không chạm UI: lần in ở brainstorm là lần duy nhất»;
  «brainstorm không hỏi gì → chưa phủ»; câu «hai bản được test P85 giữ khớp» → «ba bản».

## Task 6 — Ca P-mới grep chỉ dẫn (AC-4, AC-5, AC-6)

- `tests/plugins/run-tests.sh`: P-mới «GOAL-ARM: SKILL S1 moi cau xin duyet kem GOAL-TEMPLATE ·
  S1#5 khong phai cong · S1#7 dong bo · Gate 1 giu · S2#3 GATE 1.5 kem /goal · bat bien dung goi ten
  bao-roi-ngung · GUIDE ba thoi diem + lan V + chua phu · 0 cau "hai ban"» — mỗi vế một grep neo
  chữ, đột biến xoá một vế → đỏ đích danh; khai trong tiêu đề ca «(do chi dan)».

## Task 7 — `tests/scripts/run-log-minted.mjs` (AC-7)

- Đọc `_acceptance/<slug>/run-log.jsonl` (`--slug`, `--root`); lấy vòng cuối (round lớn nhất);
  regex `^minted-<slug>-(<id evals.yaml>|SUITE-[A-Za-z0-9_]+)-r\d+$`; cùng `ts` trong vòng.
- Thoát 1 + thông điệp ghim: «chua co run-log — AC-7 CHUA do» · «run_id khong do workflow duc:
  <id>» · «hai ts trong mot vong». Thoát 0 kèm «AC-7 OK: <n> dong, vong r<k>, 1 ts».
- Ca tự kiểm trong `tests/scripts/run-log-minted.test.mjs`: fixture code-sinh hai chiều (run-log
  tay → đỏ đúng thông điệp; run-log đúc → xanh).
- KHÔNG đăng ký làm eval; chạy lúc trình Cổng 2, dán output vào evidence-report.

## Task 8 — S3 kết → S4 qua Workflow

- Chạy 4 suite local; set contract `status: implemented`; `s4-args.mjs` sinh args; dispatch
  Workflow `acceptance-verify` (WORKFLOWS_DIR của plugin feature-loop 2.7.0 đã cài); KHÔNG tự
  chạy eval trong main loop. Sau khi trả về: chạy `run-log-minted.mjs`, dán output.
