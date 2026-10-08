---
schema_version: 1
feature: Làn đối chứng S4 (baseline:diffBase) chạy MỘT lệnh do kit sinh — có trần mỗi lệnh và trần tổng, bỏ qua eval trỏ tệp chưa có ở merge-base (ghi lý do vào báo cáo), tự dọn worktree tạm khi bị dừng/hỏng; lane không về trọn là BLOCKED hạ tầng có tên, lượt chấm vẫn ra báo cáo
slug: baseline-tran-bo-qua-don
owner: manh.phan@onemount.com
risk_tier: T2               # feature-loop/workflows + tests/workflows — không chạm t3_paths
surfaces: [cli]
status: approved
approved_by: Phan Le Manh
approved_at: 2026-10-08
---

# Acceptance Contract: baseline-tran-bo-qua-don

Gốc: crm/_acceptance/khung-ban-ghi-kara

## Context

Lượt S4 `wf_f425c910-a3b` của crm (07/10/2026, kit 2.24.0, đợt điều phối sau-14-10): eval máy, hội đồng
và soát xong lúc 15:59Z, nhưng tác tử `baseline:diffBase` giữ lượt 5 giờ — không ra
`evidence-report.md`, giữ khoá s4 duy nhất của máy (phiên khác chờ 4 giờ), để lại worktree tạm
`agk-baseline` khi workflow bị dừng tay.

Truy nguyên (nguồn: transcript tác tử, mtime tệp đầu ra, nhật ký app `~/Library/Logs/Claude/main.log`):
lệnh **không treo**. Prompt cũ để tác tử TỰ CHẾ cách chạy; nó dựng vòng `while read … bash -c "cd \"$WT\"
… && $c"`. Kiểm tra an toàn có sẵn của Claude Code không phân tích được script `-c`/eval ấy nên **hỏi
người dù phiên ở bypassPermissions**: «Emitted tool permission request … for Bash» 22:45:15, owner bấm
03:45:17 (giờ máy) — lệnh chạy xong trong 3 giây (tám tệp `out*.log` cùng mtime 03:45:17); lệnh kế
(`bun run test -- "cd apps/api …"`) lại bị hỏi, và bị huỷ khi workflow dừng (03:47:29). Lượt 08:32 cùng
ngày, tác tử baseline của một lượt S4 khác, vòng `eval "$c"`: cũng bị hỏi (người bấm sau 3 giây). Lệnh
máy (`BOC_LENH` kit sinh) chưa lần nào bị hỏi. Thêm: tám lệnh đầu đo tệp kiểm chưa có ở merge-base
(«had no matches») — baseline vô nghĩa.

Owner nêu ba việc: (a) trần thời gian cho tác tử baseline và cho mỗi lệnh — chạm trần ra BLOCKED hạ
tầng rõ ràng, không treo cả lượt; (b) bỏ qua baseline của eval khi tệp lệnh trỏ tới không có ở merge-base,
ghi lý do vào báo cáo; (c) dọn worktree tạm khi workflow bị dừng hay hỏng. Kèm test tái hiện từng phần.

Bản sửa: workflow sinh MỘT lệnh (khối `BASELINE-LENH` trong `acceptance-verify.js`), tác tử chỉ chép
nguyên văn vào một lần gọi Bash và trả đầu ra; JS đọc dòng dấu `__BL …`, không tin `results[]` tác tử
khai. Lệnh không có `eval`, `bash -c "$biến"`, `while read`, `<(…)`, `rm`, `rmdir` — đo 08/10: chạy CHÍNH
lệnh này qua công cụ Bash của Claude Code đi qua kiểm tra an toàn, bản có `rmdir "$T0"` thì bị chặn.

## Criteria

- AC-1: Given args có ba eval máy chép từ sự cố crm (`cd apps/app && bun test --preload
  ../../packages/ui/test/setup-dom.ts ./test/kara-ban-ghi.dom.tsx -t tab-rong`; `bun run test -- "cd apps/api
  && bun test test/hoan-tac-thong-tin.spec.ts -t bo-qua" && cd apps/app && bun test
  ./test/kara-ban-ghi-de-xuat.dom.tsx -t bo-qua`; `node _acceptance/khung-ban-ghi-kara/rang/chu-cung.mjs
  --ten 'co nhay'`), When workflow dispatch lane baseline, Then prompt mang
  ĐÚNG MỘT khối giữa `<<<AGK-BASELINE` và `AGK-BASELINE>>>`; mỗi lệnh eval có mặt nguyên văn đúng một lần;
  khung kit sinh (lệnh với mỗi lệnh eval thay bằng một token cố định — quét CẢ dòng chứa lệnh eval) KHÔNG
  chứa `eval`, `bash|sh|zsh -c`, `xargs`, `while … read`, `<(`, `rm `, `rmdir `; có `TRAN_LENH=<n>;` và `TRAN_TONG=<n>;`
  với TRAN_TONG + 15 < trần 600 giây mà prompt dặn và TRAN_LENH ≤ TRAN_TONG; prompt dặn MỘT lần gọi Bash, timeout 600000,
  trả `dauRa`; tệp ứng viên tính theo `cd` của TỪNG phạm vi (`apps/app/test/kara-ban-ghi.dom.tsx`,
  `packages/ui/test/setup-dom.ts`, `apps/api/test/hoan-tac-thong-tin.spec.ts`,
  `apps/app/test/kara-ban-ghi-de-xuat.dom.tsx`, `_acceptance/khung-ban-ghi-kara/rang/chu-cung.mjs`; không có
  `apps/api/apps/app`). And lệnh executor của chính kho kit (`bash -c '…$(node <tệp ca> 2>&1)…'`, rút từ
  config) cho tệp ca là ứng viên và có mặt nguyên văn.
- AC-2: Given lệnh RÚT từ prompt (không viết tay) chạy bằng shell thật (bash, và zsh nếu máy có) trên
  một kho git tạm, với `TRAN_LENH` hạ còn 2, When một lệnh ngủ ~30 s và một lệnh thoát 3, Then đầu ra có
  `__BL 1 qua-tran 2`, `__BL 2 xong 3`, `__BL_XONG`; cả lượt < 20 s; tiến trình ngủ đã chết; không còn
  worktree `agk-baseline`. And `TRAN_TONG` hạ còn 3 với ba lệnh → lệnh 3 `het-tran-tong`, lượt < 20 s.
  Đối chứng dương: lệnh nhanh dưới trần → `xong 3`, không dấu chạm trần. And lệnh in `__BL 1 xong 0` /
  `__BL_XONG` giả rồi thoát 3 → stdout chỉ có `__BL 1 xong 3`, `__BL_XONG` đúng một lần ở cuối. Trên macOS
  mà vắng zsh thì ca đỏ (vế zsh không được im lặng bỏ qua).
- AC-3: Given tác tử baseline trả (i) đầu ra thiếu `__BL_XONG`, (ii) null, (iii) `killedByTool: true`,
  (iv) `__BL_HA_TANG worktree-add`, When workflow tổng hợp, Then verdict vẫn PASS và có báo cáo (làn phụ
  không giữ lượt); mọi lệnh baseline `n-a`, không red/green; prompt tổng hợp mang `BASELINE BLOCKED HA
  TANG` + lý do, nhật ký workflow mang `baseline: BLOCKED ha tang`; KHÔNG ghi dòng run-log `kind:"baseline"` (round sau
  đo lại). Lệnh chạm trần → `n-a` kèm «vuot tran 180 giay», cũng không ghi dòng ấy. Đối chứng dương: đầu
  ra đủ dấu → dòng được ghi; mã đọc từ dấu thắng lời khai `results[]` ngược lại của tác tử. Đường
  đọc-cũ khai thiếu lệnh (`results: []`) → lệnh vắng mang lý do «tac tu baseline khong khai ket qua», không
  ghi dòng `kind:"baseline"`.
- AC-4: Given kho git tạm có `t/cu.sh` ở cả hai phía và `t/moi.sh` chỉ ở HEAD, When lệnh rút từ prompt
  chạy bằng shell thật cho `cd t && bash ./moi.sh`, `bash t/cu.sh`, `bash t/khong-co-o-dau.sh`, Then
  `__BL 1 bo-qua t/moi.sh` và `moi.sh` KHÔNG chạy; `__BL 2 xong 3`; tệp vắng ở CẢ HAI phía không bị bỏ qua
  (`__BL 3 xong 127`). And khi đầu ra có dòng bỏ qua, prompt tổng hợp mang mục «BASELINE KHONG DO» với
  `cmd` và lý do «… t/moi.sh … chua co o merge-base», lệnh đó `n-a`, lệnh chạy `red`; dòng
  `kind:"baseline"` VẪN ghi (bỏ qua có lý do không phải hạ tầng). Chiều im: tệp có ở cây làm việc mà không
  có ở gốc nhưng bị gitignore (`gen/…`), đích chuyển hướng (`> ra/r.txt`), `node_modules/…`, `.env*` → KHÔNG
  bị bỏ qua, lệnh chạy thật.
- AC-5: Given lệnh rút từ prompt đang chạy một lệnh ngủ, When cả nhóm tiến trình nhận TERM (bash và zsh),
  Then worktree tạm gỡ khỏi git, thư mục tạm biến mất, lệnh ngủ chết. And khi nhận KILL (trap không chạy),
  worktree mồ côi còn; lượt sau in `__BL_DON <đường>` và gỡ nó, nhưng KHÔNG gỡ worktree `agk-baseline` có
  khoá `agk-baseline pid <pid còn sống>`; lượt sau vẫn chạy đủ. Khoá đặt NGUYÊN TỬ cùng lúc `worktree add
  --lock --reason` (không có khe giữa thêm và khoá cho bước quét của lượt song song).
- AC-6: Given bản sao nguồn trong bộ nhớ với ĐÚNG MỘT mảnh bị gỡ (kim khớp đúng một lần), When chạy lại ca
  tương ứng, Then ca ĐỎ: gỡ lính canh trần → lệnh treo không còn `qua-tran` (bị test cắt ở 8 s); gỡ phép
  hỏi merge-base → không còn `bo-qua`; gỡ mọi trap → worktree ở lại sau TERM; bước quét coi mọi pid là
  sống → mồ côi không được dọn; bộ đọc bỏ điều kiện `__BL_XONG` → đầu ra cụt được ghi thành dòng
  `kind:"baseline"`; gỡ phép hỏi gitignore → tệp sinh ra bị bỏ qua nhầm; bỏ điều kiện «không chạm trần» →
  phép đo chạm trần được ghi dòng `kind:"baseline"`; lính canh chỉ giết pid con → tiến trình cháu sống sót.
- AC-7: Given cây sau sửa, When chạy `bash tests/workflows/run-tests.sh`, Then mọi bộ xanh — gồm
  `lane-pin` (LP3/LP4: lệnh baseline đứng trong worktree, không `cd` repoRoot; kim LP4 dời sang chỗ ghép
  lệnh mới), `round-signal` (RS5: ba lane gọi `CD_GUARD`), `lenh-dai-chay-rieng` (LN2: kim `[ -n "$P" ] &&
  dung "$P";` vẫn duy nhất) và `acceptance-verify`. And đường đọc-cũ (ca BB7): tác tử không trả `dauRa`
  → đọc `results[]` như 2.24.0, nhật ký workflow mang `CO VANG: baseline khong tra dauRa`.

## Coverage

| Trục | Giá trị | AC |
|---|---|---|
| A. Kết cục một lệnh | xong · chạm trần lệnh · hết trần tổng · bỏ qua (tệp mới) · tệp vắng cả hai phía | AC-2 · AC-4 |
| B. Kết cục lane | đủ dấu · thiếu dòng kết · tác tử chết · công cụ cắt · worktree không dựng được · đường đọc-cũ | AC-3 · AC-7 |
| C. Dừng | xong bình thường · TERM · KILL rồi lượt sau · lượt khác còn sống | AC-2 · AC-5 |
| D. Shell | bash · zsh | AC-2 · AC-4 · AC-5 |
| E. Hình dạng lệnh | lệnh thường · `cd` lồng · lệnh con trong nháy · nháy đơn | AC-1 |

- Later: hộp xin quyền vẫn có thể đến với lệnh kit sinh trong một phiên bản Claude Code khác — xem Known limits.
- Never: kit tự đặt trần cho `agent()` (API Workflow không có; script không có đồng hồ).

## Out of scope

- Sửa bất cứ gì ở kho crm.
- Đổi lane máy/ui-check, làn ghim lại, `BOC_NEN`.
- Bản vá ba lỗ ở nhánh `fix/luot-sua-giu-du-dem-dung` (việc riêng, không trộn).

## Notes

- Known limits: (1) Hộp xin quyền đến TRƯỚC khi lệnh chạy, nên không trần nào trong lệnh chặn được nó, và
  harness không có trần cho `agent()`. Lệnh kit sinh đã tránh mọi hình dạng đo được là kích hộp (đo 08/10
  qua công cụ Bash thật), nhưng luật của kiểm tra an toàn không do kit giữ. Ngưỡng mở lại: ≥1 lượt baseline
  chờ hộp xin quyền với lệnh kit sinh (nhật ký app «Emitted tool permission request … for Bash» rơi vào tác
  tử `baseline:diffBase`). (2) Tệp ứng viên là ĐOÁN theo chữ (`cd` + đuôi tệp/dấu `/`); lệnh trỏ tệp qua
  gián tiếp (tên script trong package.json, biến) không được nhận — lệnh ấy chạy như cũ, có trần. (3) Lệnh tự
  tách khỏi nhóm tiến trình (setsid/daemon) thoát khỏi lính canh trần. (4) Thư mục `mktemp` rỗng có thể ở
  lại trong `$TMPDIR` khi `worktree add` hỏng — không xoá bằng `rmdir` vì kiểm tra an toàn hỏi người cho
  `rmdir "$biến"` (đo 08/10). (5) Dòng dấu `__BL` không có nonce: đầu ra của lệnh eval không giả được dấu
  (đi vào nhật ký), nhưng một tác tử cố ý bịa `dauRa` thì giả được — cùng mức tin như khung `BOC_LENH`.
  (6) `worktree add --lock --reason` cần git đủ mới; git cũ hơn → `__BL_HA_TANG worktree-add`, có tên.
  (7) Nhật ký `.acceptance-runs/<slug>/s4-baseline/<lượt>/` không tự dọn (đã ẩn khỏi git).
