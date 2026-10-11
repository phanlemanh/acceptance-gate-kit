---
schema_version: 1
feature: Đổi tài khoản giữa đợt Điều phối – Thợ không mất việc — đọc mức dùng (CLI han-muc, mod đọc mức dùng), báo trước và tự bàn giao theo ngưỡng, hai pha ★, lệnh /dieu-phoi:ban-giao, ban-giao.json dựng từ git, tiếp tục dưới tài khoản kia bằng một lệnh, lưới cuối StopFailure, răng an toàn của lớp mod
slug: dieu-phoi-doi-tai-khoan
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, config, docs]
status: signed-off
design_doc: docs/superpowers/specs/2026-10-11-dieu-phoi-doi-tai-khoan-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-11T02:51:41Z
---

# Acceptance Contract: dieu-phoi-doi-tai-khoan

## Context

Hàng DP4 của ô dù `dieu-phoi-tho-trong-kit` (Cổng Đáng build 09/10, phủ DP1–DP4). Câu giao: «Báo trước khi
chạm hạn mức, tự bàn giao nhẹ, tài khoản kia tiếp tục bằng một lệnh — không mất commit, chữ ký hay quyết định
nào». Ca gốc: chủ kho đổi tài khoản giữa đợt crm vì hết hạn mức (09/10); lần đổi 05–06/10 bàn giao tay bằng tệp
nhớ. Thiết kế chung đã duyệt 10/10: `docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md` (§3, §4.2
bước 1 và 6, §4.3, §4.5, §6, §8, §11, §12.1–12.2, §16 T9–T11). Thiết kế thi công và mười hai chỗ chọn: design
doc ở frontmatter. Hàng đứng trên DP3 (nhịp sống, kế hoạch dãy, lệnh con ghi qua CLI).

Thuật ngữ:
- **lần đọc** = một mục của `han-muc.json`: `{nguon, phien, luc, cua_so}`; `nguon` ∈ `mod` · `get-usage` ·
  `statusline`; `cua_so` có `five_hour` và/hoặc `seven_day`, mỗi cái `{pct, dat_lai}`.
- **lần đọc hiệu lực** = lần đọc mới nhất có tuổi ≤ 35′ và (đọc sau `nhan_luc` của giám sát hiện tại, hoặc do
  chính phiên giám sát hiện tại đọc).
- **ngưỡng** = khoá `han_muc` của `dieu-phoi.config.json`: `bao_truoc_pct`, `ban_giao_pct`, `cho_ban_giao_phut`,
  `cho_dat_lai_phut`. **Ngưỡng bàn giao hiệu lực** = `ban_giao_pct`, hạ theo chỗ chọn 4 của design doc khi 35′
  không có lần đọc nguồn `mod`.
- **hai pha ★** = `dang-ban-giao`, `cho-tiep-tuc`. **Pha trước** = pha đợt đứng ngay trước khi vào
  `dang-ban-giao` (`dang-chay` hoặc `tam-dung`).
- **dãy xong** = có `ban-giao/xong/<dãy>.json` của mã bàn giao hiện tại. **Dãy đang xong** = dãy giữ khoá `s4`
  lúc dựng. **Khoá s4 sống** = `khoa/s4/chu.json` có và tệp `nhip` mới hơn `nhip_cu_phut`.
- **mod** = module DUY NHẤT khai ở khoá `modules` của `dieu-phoi/hooks/hooks.json` (`./mod/register.ts` — Claude Code
  nhận đúng một module mỗi gói, đo 11/10); **phần mod** = một tệp `dieu-phoi/hooks/mod/<phần>.ts` mà `register.ts` gọi.
  **Sự kiện cổng** = `tool.call`, `tool.check`, `classic.PreToolUse`, `classic.PermissionRequest`.
- **kho thử** = kho git do chính ca kiểm dựng trong thư mục tạm; **đồng hồ giả** = thời điểm truyền vào hàm, hoặc
  biến `DIEU_PHOI_NOW_MS` cho tiến trình con.

## Criteria

- AC-1: Given bảng chuyển pha của `pha.mjs`, When gọi CLI `pha` theo ma trận viết sẵn mọi cặp (6 pha × 6 pha = 36 ô), Then đúng 11 cạnh sau hợp lệ (thoát 0, thêm một dòng `lich_su`) — năm cạnh của DP2 `nhap → dang-chay`, `dang-chay → tam-dung`, `dang-chay → dang-dong`, `tam-dung → dang-chay`, `tam-dung → dang-dong` (căn cứ: bảng `CHUYEN` của `pha.mjs` trên nhánh chính lúc mở vòng) và sáu cạnh mới `dang-chay → dang-ban-giao`, `tam-dung → dang-ban-giao`, `dang-ban-giao → cho-tiep-tuc`, `cho-tiep-tuc → dang-chay`, `cho-tiep-tuc → tam-dung`, `cho-tiep-tuc → dang-dong`; sáu ô đường chéo (cùng pha) thoát 0 và không thêm dòng `lich_su` (chạy lại được); 19 ô còn lại thoát 1 và `dieu-khien.json` không đổi (so băm); vào `dang-ban-giao` ghi khối `ban_giao` có `ma` dạng `bg-<UTC>` và `pha_truoc`; và ở hai pha ★ một nhịp bộ phát lịch thật không cấp khoá nào, đơn trong `xin/` nằm nguyên. Chiều đỏ: bản sao cho `choPhepTheoPha` cấp ở `dang-ban-giao` → ca đỏ nêu pha đó.
- AC-2: Given ma trận đầu vào viết sẵn — `rateLimits` của mod (`kind`, `percentUsed`, `resetsAt`), `windows` của `get_usage` (ba nhãn, gồm một cửa sổ tuần theo model), `rate_limits` của dòng trạng thái (`used_percentage`, `resets_at` giây), và ba đầu vào hỏng — When gọi CLI `han-muc --nguon <n> --phien <id> --doc '<json>'` trong một đợt, Then `han-muc.json` có một lần đọc mỗi đầu vào lành với `cua_so` bằng đúng giá trị viết sẵn (cửa sổ theo model bị bỏ), đầu vào hỏng thoát 1 nêu nguồn và không đổi tệp, tệp giữ tối đa 20 lần đọc mới nhất; khoá của lần đọc bằng đúng khoá khuôn `dieu-phoi/scripts/mau/han-muc.json`; bộ đọc của bộ phát lịch đọc đúng lần đọc CLI vừa ghi (round-trip). Gọi trong kho không có đợt → thoát 0, in `khong-co-dot`, không tạo tệp nào (so băm cây). Và `chan-doan --json` của một đợt khai `han_muc` có mục `han-muc`: `thieu` với việc «gọi `get_usage` rồi `han-muc --nguon get-usage`» ở ba hàng không có lần đọc hiệu lực (không lần đọc · chỉ một lần đọc 40′ tuổi · chỉ lần đọc của phiên khác trước `nhan_luc`), `du` khi có lần đọc hiệu lực (đối chứng dương); đợt không khai `han_muc` không có mục này.
- AC-3: Given một đợt khai `han_muc` `{80, 90, 20, 45}` và ma trận viết sẵn, mỗi hàng khai lần đọc, tuổi, phiên đọc, giờ đặt lại (một lần đọc nguồn `mod` của giám sát, tuổi 2′, trừ khi hàng nêu khác) — (a) 5 giờ 50 % · (b) 5 giờ 82 % · (c) như (b), nhịp kế · (d) 5 giờ 91 %, đặt lại sau 30′ · (e) 5 giờ 91 %, đặt lại sau 3 giờ · (f) như (e) nhưng lần đọc 40′ tuổi · (g) như (e) nhưng do phiên khác đọc trước `nhan_luc` của giám sát · (h) như (e) do chính giám sát đọc trước `nhan_luc` · (i) chỉ nguồn `get-usage`, ba lần đọc cách nhau 15′ tăng 1,5 điểm/phút, mới nhất 5 giờ 82 %, đặt lại sau 3 giờ · (j) tuần 91 % đặt lại xa, 5 giờ 40 % · (k) không số, có dấu `ban-giao/dau/P1.json` · (l) đợt không khai `han_muc`, 5 giờ 99 % · (m) chỉ nguồn `get-usage`, ba lần đọc cách nhau 15′ tăng 0,2 điểm/phút, mới nhất 85 %, đặt lại sau 3 giờ · (n) như (m), mới nhất 83 % · (o) hai nhịp: nhịp 1 như (d) kèm một đơn `s4` trong `xin/`; nhịp 2 sau giờ đặt lại, có lần đọc mới 5 giờ 10 % — When nhịp bộ phát lịch thật chạy với đồng hồ giả, Then lần lượt: không sự kiện · một `gan-han-muc` · không thêm · một `cho-dat-lai`, không cấp khoá, pha giữ · pha `dang-ban-giao` `dat_boi: phat-lich` và đúng một `cham-han-muc` (mức cao thay mức thấp: không kèm `gan-han-muc`) · như (a) · như (a) · như (e) · ngưỡng bàn giao hiệu lực in ra bằng 80 (tính tay `max(80, 90 − 1,5 × 30)`) và như (e) · như (e) với cửa sổ `seven_day` · pha `dang-ban-giao` lý do nêu P1 · không sự kiện hạn mức nào · ngưỡng hiệu lực 84 (tính tay `max(80, 90 − 0,2 × 30)`) và như (e) · ngưỡng 84, một `gan-han-muc`, pha giữ · nhịp 1 như (d), nhịp 2 `trang-thai.json` không còn `cho_dat_lai` và khoá `s4` được cấp cho đơn đó. Số assert bằng số hàng (15), in ra. Dấu trong `ban-giao/dau/` là dấu đang mở; `tiep-tuc` chuyển nó vào lịch sử bàn giao khi rời pha ★ (AC-7), nên dấu cũ không kéo đợt vào bàn giao lần nữa dưới tài khoản mới.
- AC-4: Given khoá cấu hình `han_muc`, When bộ kiểm cấu hình đọc khuôn `mau/dieu-phoi.config.json`, cấu hình fixture crm `dot-crm-0910` (không có khoá), và bốn cấu hình sai (thiếu một trường, phần trăm ngoài 1–100, `bao_truoc_pct` ≥ `ban_giao_pct`, khoá lạ trong `han_muc`), Then khuôn và crm qua, mỗi cấu hình sai thoát 1 nêu đúng tên khoá, và ca sát biên `bao_truoc_pct` 89 với `ban_giao_pct` 90 qua (không lỗi) trong khi 90 với 90 bị từ chối; khuôn mang `{80, 90, 20, 45}`; và `the khoi-tao --json` của một đợt mở từ gói có `khau-vi-han-muc` trong `hoi` cùng trường `han_muc` mang bốn số của đợt.
- AC-5: Given một đợt `dang-chay` hai dãy P1, P2 trong kho thử có worktree thật, When gọi `ban-giao --ly-do "đổi tài khoản"`, rồi gọi lại, rồi ở worktree P1 gọi `ban-giao-xong` theo ma trận — (a) có tệp chưa commit · (b) còn `xin/P1-s4.json` · (c) P1 đang giữ khoá `s4` · (d) gọi từ gốc kho · (e) cây sạch · (f) `--wip "dở S3"` trên cây bẩn — Then lần đầu pha sang `dang-ban-giao` với `ma` và `pha_truoc: dang-chay`; lần hai không đổi `ma` và không thêm dòng lịch sử pha; (a) và (b) thoát 1 nêu đúng từng tệp; (c) thoát 1 nêu «đang xong»; (d) thoát 1 nêu `ban-giao-xong`; (e) thoát 0 ghi `ban-giao/xong/P1.json` với khoá đủ như khuôn và `phien_cu` chứa phiên có nhịp sống trên worktree P1; (f) tạo đúng một commit tiêu đề `wip(ban-giao): dở S3`, cây sạch, rồi ghi như (e); không lời gọi nào đẩy nhánh. `ban-giao` khi pha là `nhap`, `dang-dong` hay `cho-tiep-tuc` thoát 1 nêu pha.
- AC-6: Given đợt ở `dang-ban-giao`, When một nhịp bộ phát lịch thật (đồng hồ giả) chạy theo ma trận — (a) P1 xong, P2 chưa, trong hạn chờ · (b) P1 xong, P2 giữ khoá `s4` sống · (c) như (a) nhưng quá `cho_ban_giao_phut` · (d) như (b) nhưng nhịp khoá đã cũ · (e) cả hai xong · (f) đợt không khai `han_muc`, P2 chưa xong, 21′ sau lúc vào pha — Then (a) không có `ban-giao.json`, pha giữ; (b) có `ban-giao.json` với P2 `dang-xong`, `cham_lai_cung_round` đúng theo `status` hồ sơ, pha giữ `dang-ban-giao`; (c) có `ban-giao.json` với P2 `do`, pha `cho-tiep-tuc`; (d) pha `cho-tiep-tuc`; (e) pha `cho-tiep-tuc` và một sự kiện `ban-giao-dung` `can_phan` `dich: owner` mang câu chứa `/dieu-phoi:tiep-tuc`; (f) như (c) — hạn chờ mặc định 20′ khi đợt không khai (bàn giao tay vẫn có đồng hồ). Mọi trường mục dãy bằng giá trị đọc từ git thật của kho thử (nhánh, đỉnh, đã đẩy, có WIP) — không trường nào lấy từ chữ viết tay; khoá của `ban-giao.json` bằng khoá khuôn `mau/ban-giao.json`; CLI `ban-giao` gọi trong pha `dang-ban-giao` ra cùng kết quả như nhịp (cùng hàm). Lời ghi danh mà `tiep-tuc` dựng cho P2 dùng CÙNG hàm mục dãy (so bằng nhau các trường chung).
- AC-7: Given đợt hai dãy P1, P2 ở một pha ★, giám sát cũ `A`, một dấu `ban-giao/dau/P1.json`, When chạy `tiep-tuc --phien B` theo ma trận viết sẵn 8 hàng — (a) không có lần đọc nào của `B` · (b) `B` đọc 5 giờ 85 % · (c) `B` đọc 30 %, pha `cho-tiep-tuc`, pha trước `dang-chay` · (d) như (c), pha trước `tam-dung` · (e) `B` đọc 30 %, pha `dang-ban-giao`, pha trước `dang-chay`, cả hai dãy xong · (f) như (e) nhưng pha trước `tam-dung` và P2 chưa xong, còn trong hạn chờ · (g) như (e) nhưng P2 giữ khoá `s4` sống · (h) chạy lại (c) — Then (a) pha giữ, kết quả có `can_doc_han_muc: true`; (b) pha giữ, kết quả khuyên chờ kèm giờ đặt lại của cửa sổ vượt; (c) `ban-giao.json` chuyển vào `ban-giao/lich-su/<mã>.json` với `trang_thai: da-tiep-tuc`, `tiep_tuc_boi: B` và khoá `dau` mang dấu P1; `ban-giao/dau/` rỗng; pha `dang-chay`; bộ phát lịch chạy lại; (d) như (c) nhưng pha `tam-dung`; (e) dựng `ban-giao.json` rồi đi như (c), pha đi qua `cho-tiep-tuc` (hai dòng `lich_su` của `dieu-khien.json`); (f) dựng CƯỠNG BỨC (P2 ghi `do`, không chờ hạn) rồi đi như (d); (g) dựng với P2 `dang-xong`, đi như (c), khoá `s4` của P2 nằm nguyên; (h) không thêm tệp lịch sử, pha không đổi. Số assert = 8, in ra. Mọi hàng vẫn nhận vai như DP3 (`A` vào `lich_su` của `vai.json`). Chiều đỏ: bản sao để `tiep-tuc` gọi thẳng `pha <pha trước>` từ `dang-ban-giao` → hàng (f) đỏ, ca nêu (f).
- AC-8: Given một bàn giao gần nhất (mở hoặc mới nhất trong `lich-su/`) mà P1 xong với `phien_cu: [s-cu]`, tệp nhịp `song/s-cu.json` của worktree P1 tuổi 3′, và P2 đang xong (giữ khoá `s4` sống), When chạy `tiep-tuc --json` và `chan-doan --json`, Then P1 ra `mo-chip` với `da_ban_giao: true` và lời ghi danh có lớp phủ mục P1 của bàn giao; P2 ra `khong`; hai lệnh trả cùng hành động; một phiên mới `s-moi` ghi nhịp trên worktree P1 thì P1 ra `khong`; không có bàn giao nào thì hành động như DP3. Chiều đỏ: bản sao bỏ bước loại `phien_cu` → P1 đổi sang `khong`, ca đỏ nêu P1.
- AC-9: Given hook `PostToolUse` thật rút từ `dieu-phoi/hooks/hooks.json`, When nó nhận đầu vào theo ma trận — (a) pha `dang-ban-giao`, cwd trong worktree P1 chưa xong · (b) như (a) lần hai trong 5′ · (c) như (a) sau 6′ (đồng hồ giả) · (d) P1 đã xong · (e) pha `dang-chay` · (f) kho không có đợt — Then (a) và (c) in JSON có `hookSpecificOutput.hookEventName: PostToolUse` và `additionalContext` chứa `ban-giao-xong` cùng đường `<thư mục đợt>/loi/dieu-phoi.mjs`; (b), (d), (e) không in gì; (f) không in gì và không tạo tệp (so băm cây); mọi trường hợp có đợt vẫn ghi nhịp sống như DP3; hook thoát 0.
- AC-10: Given hook `StopFailure` thật rút từ `hooks.json` (timeout khai ≥ 60), When nó nhận đầu vào theo ma trận — (a) `error: rate_limit`, cwd trong worktree P1, cây bẩn, không khoá · (b) như (a) nhưng khoá `s4` trỏ worktree P1 · (c) như (a), cây sạch · (d) `error: overloaded` · (e) cwd ngoài mọi dãy · (f) kho không đợt · (g) như (a) nhưng hook pre-commit của kho thử thoát 1 — Then (a) đúng một commit mới tiêu đề bắt đầu `wip(ban-giao): lưới cuối`, cây sạch, `ban-giao/dau/P1.json` có `wip` = sha commit đó, một sự kiện `tho-het-han-muc` `can_phan`; (b) không commit (HEAD không đổi, cây vẫn bẩn), dấu có `luot_do: true`; (c) không commit, dấu có `wip: null`; (d), (e), (f) không commit, không dấu, không sự kiện; (g) không commit, cây giữ nguyên tệp bẩn, dấu có `loi_commit` chứa dòng đầu stderr của hook kho. Hook luôn thoát 0.
- AC-11: Given một hồ sơ thử `implemented` có `evidence-report.md` một round REJECT (`## Iterations` một mục), When một lượt chấm round 2 «chết giữa chừng» (đã sinh `s4-args.json`, không thêm dòng `run-log.jsonl`, không đổi báo cáo) rồi gọi `s4-args.mjs` thật của kit lần nữa, Then hai lần sinh mang cùng `round` (2); và `ban-giao.json` không có khoá nào mang số round (bàn giao không phải nguồn đếm lượt).
- AC-12: Given gói `dieu-phoi`, When đọc `hooks/hooks.json` và chạy `claude plugin test` (bản Claude Code có lệnh `test`) trên bản sao gói kèm tệp ca của mod, Then `modules` đúng `["./mod/register.ts"]` và phần `mod/doc-muc-dung.ts` được `register.ts` gọi; ba ca xanh: (a) `session.measure` với `changed` chứa `rateLimits` và mảng không rỗng → đúng một lời gọi `$.process.run` với argv `[node, <gốc gói>/scripts/dieu-phoi.mjs, han-muc, --nguon, mod, --phien, <mã phiên>, --doc, <JSON rateLimits>]` và cwd là cwd phiên · (b) `changed` chỉ có `context` → không lời gọi · (c) `$.process.run` ném lỗi → `next(e)` vẫn trả `{changed}` nguyên. Round-trip mod → CLI: argv bắt được ở ca (a) chạy thật bằng CLI `han-muc` trong một kho thử có đợt → `han-muc.json` thêm đúng một lần đọc `nguon: mod` với `cua_so` bằng giá trị mong đợi; `rateLimits` của ca `plugin test` và đầu vào nguồn `mod` của AC-2 rút từ MỘT tệp fixture chung. Chiều đỏ: bản sao bỏ điều kiện `changed` → ca (b) đỏ; bản sao mod bọc `{rateLimits}` quanh mảng → round-trip đỏ nêu «mod». Máy không có bản Claude Code có lệnh `test` → FAIL nêu đúng điều đó, không bao giờ xanh khi chưa chạy.
- AC-13: Given khung mod — bảng sự kiện được phép theo PHẦN mod trong khối marker `MOD-SU-KIEN` của `dieu-phoi/scripts/mod-luat.mjs` (chỗ DP6 nối phần của nó) — When chạy `claude plugin validate --strict --json` trên gói và bộ quét mod, Then validate sạch lỗi; `register.ts` không tự gọi `on(`; mọi tệp dưới `dieu-phoi/hooks/mod/` là `register.ts` hoặc một khoá của bảng; sự kiện mỗi phần đăng ký (quét chữ `on('<sự kiện>'`) là tập con của dòng bảng của phần đó, và HỢP các sự kiện quét được bằng đúng tập sự kiện validate báo ở dòng `hooks:` của `./mod/register.ts` (phần đăng ký bằng tên động thì lệch); dòng bảng của `./mod/doc-muc-dung.ts` không có sự kiện cổng nào; mọi tệp dưới `dieu-phoi/hooks/mod/` (bỏ chú thích) không có chữ `allow` dạng chuỗi hay khoá đối tượng, và không có khoá hay viết tắt `result` trong đối tượng (đường trả lời thay công cụ). Chiều đỏ, mỗi cái trên bản sao gói, sau khi gói lành xanh: thêm một nhánh `return { decision: 'allow' }` → đỏ nêu tệp và dòng · thêm `on('tool.call', …)` vào phần đọc mức dùng → đỏ nêu phần và sự kiện · thêm một tệp phần ngoài bảng → đỏ nêu tệp. Phần không cần Claude Code (bảng ⇔ tệp phần, quét chữ) chạy trong suite node; phần cần validate chạy ở lượt chấm trên máy.
- AC-14: Given gói và cây kit sau thay đổi, When đọc `dieu-phoi/commands/`, chạy bộ kiểm gói và các ca LB1, LB2, DP1–DP3, Then có đúng năm lệnh (`mo-dot`, `dong-dot`, `xem`, `tiep-tuc`, `ban-giao`), không lệnh nào khoá model-invocation; thân `ban-giao.md` theo trình tự §4.3: CLI `ban-giao` trước mọi câu nhắn thợ, nhắn thợ trước câu báo chủ kho, câu báo mang `/dieu-phoi:tiep-tuc` và đường lùi CLI `tiep-tuc` qua lõi đợt; thân `tiep-tuc.md` có bước đọc mức dùng (`get_usage` rồi CLI `han-muc --nguon get-usage`) đứng TRƯỚC lời gọi CLI `tiep-tuc`, áp cả cho dạng `--nhe` (mỗi lần thức), có dòng xử lý `can_doc_han_muc` và `khuyen_cho`, và việc của lịch 30′ gọi `get_usage` rồi `han-muc` TRƯỚC `danh-thuc` (thiết kế chung §4.5 «phiên ngắn của lịch 30′ cũng gọi get_usage»); chiều đỏ: bản sao bỏ bước đọc mức dùng khỏi dạng `--nhe` → ca đỏ nêu `--nhe`; `CONTEXT.md` có mục «Bàn giao tài khoản» theo khuôn có `_Avoid_`; GUIDE §6.6 và QUICKSTART nêu `/dieu-phoi:ban-giao`; bảng tên lệnh có dòng `/dieu-phoi:ban-giao`; mọi ca DP1, DP2, DP3 xanh nguyên tên; chỉ các chỗ sau đổi theo vật, mỗi chỗ một dòng sổ `revisit` ở hồ sơ của nó: DP2-01 (tập lệnh lên năm) và DP2-09 (thẻ khởi tạo hỏi thêm `khau-vi-han-muc`) — hồ sơ DP2; DP1-01 (bảng hook thêm khối `StopFailure`) — hồ sơ DP1; fixture `khoLienKet` của tệp ca DP3 lấy khuôn cấu hình từ cùng bản gói dựng đợt — hồ sơ DP3 (kỳ vọng DP3 không đổi); và DP1-01 vẫn chạy mọi hook — gồm `StopFailure` — trong kho không đợt mà im. Chiều đỏ: bản sao đảo câu báo chủ kho lên trước CLI `ban-giao` → ca đỏ nêu `ban-giao.md`.
- AC-15: Given `_acceptance/dieu-phoi-tho-trong-kit/discovery/do-tai-khoan/ket-qua.md` và mục «Nhánh DP0» của hợp đồng này, When chạy bộ đối chiếu nhánh, Then `ket-qua.md` có đúng một dòng cho mỗi câu 1, 2, 3, 5, 6 mang một trong `còn` · `mất` · `khác` · `chưa-đo` kèm số đo hoặc lý do; nhánh hợp đồng chọn cho mỗi câu bằng nhánh mà bảng ánh xạ cho ra từ giá trị đó; mỗi câu `chưa-đo` có một dòng giới hạn kèm ngưỡng trong Notes. Chiều đỏ: bản sao `ket-qua.md` đổi giá trị câu 6 → ca đỏ nêu câu 6 và hai nhánh.

## Nhánh DP0

Bảng ánh xạ (máy đọc — bộ đối chiếu của AC-15 rút từ khối này):

<!-- <<<NHANH-DP0 -->
| Câu | còn | mất | khác | chưa-đo |
|---|---|---|---|---|
| 1 | P1 | P2 | P2 | P0 |
| 2 | S1 | S2 | S2 | S2 |
| 3 | L1 | L2 | L2 | L0 |
| 5 | K1 | K2 | K2 | K0 |
| 6 | M1 | M2 | M2 | M2 |
<!-- NHANH-DP0>>> -->

Nghĩa từng nhánh (mã DP4 giống nhau ở mọi nhánh — design doc §6; nhánh đổi lời tài liệu và giới hạn đã khai):
- **P1** phiên cũ còn và nhắn được sau khi đổi → `tiep-tuc.md` dặn nhắn phiên cũ trước khi mở chip. **P2** mất →
  dựng lại nhóm, lịch là bước thường. **P0** chưa đo → giới hạn khai, ngưỡng: đợt thử crm.
- **S1** dòng trạng thái có `rate_limits` khớp `get_usage` → GUIDE nêu lệnh dòng trạng thái tuỳ chọn làm nguồn
  thứ ba. **S2** không → bộ chuẩn hoá `statusline` giữ, tài liệu không nêu.
- **L1** `StopFailure` bắn với `rate_limit` → lưới cuối đã chứng trên máy. **L2** không bắn → lưới cuối giữ,
  khai «chưa thấy bắn». **L0** chưa đo → khai, ngưỡng: ≥1 thợ chết vì hạn mức trong đợt thử mà không có dấu.
- **K1** gói và hook nạp trong phiên mới → tài liệu nói `/dieu-phoi:tiep-tuc` có sẵn sau khi đổi. **K2** không
  → tài liệu dẫn đường lùi CLI trước. **K0** chưa đo → khai, ngưỡng: lần đổi đầu sau khi crm cài gói.
- **M1** `rateLimits` của mod có số khớp `get_usage` → mod là nguồn số 1. **M2** không → `get_usage` là nguồn
  chính, đường lùi hạ ngưỡng gánh.

Nhánh đã chọn (điền khi có `ket-qua.md`; trước đó mọi câu ở `chưa-đo`):

<!-- <<<NHANH-DP0-CHON -->
| Câu | Giá trị | Nhánh |
|---|---|---|
| 1 | mất | P2 |
| 2 | mất | S2 |
| 3 | chưa-đo | L0 |
| 5 | chưa-đo | K0 |
| 6 | còn | M1 |
<!-- NHANH-DP0-CHON>>> -->

## Coverage

Quét bằng skill `morphological-scan`, preset test-matrix.

- Chân sản phẩm: [SUY-TỪ-REPO: docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md] (đã duyệt),
  [SUY-TỪ-REPO: docs/superpowers/specs/2026-10-11-dieu-phoi-tiep-tuc-mot-lenh-design.md], gói `dieu-phoi` của DP1–DP3,
  và hai lần đo máy 11/10 ghi ở design doc (`get_usage`; `claude plugin validate`/`plugin test` trên bản sao gói).
- Chân ngành: [NGÀNH: Kubernetes `kubectl drain` — cordon (ngừng nhận việc mới), chờ việc đang chạy theo
  PodDisruptionBudget, rồi mới rút] cho «ngừng cấp lượt, dãy đang S4 giữ khoá tới khi lượt hết»;
  [NGÀNH: AWS Auto Scaling lifecycle hook `Terminating:Wait` — hạn chờ có heartbeat, hết hạn thì hành động
  mặc định] cho đồng hồ `cho_ban_giao_phut`; [NGÀNH: header `X-RateLimit-Reset` / `Retry-After` của API
  GitHub] cho «chờ đặt lại hay chuyển».

Trục:
- Trục A · điểm chạm: CLI `han-muc` | nhịp bộ phát lịch (ngưỡng, đồng hồ) | CLI `ban-giao`, `ban-giao-xong` |
  hook nhịp (nhắc) | hook `StopFailure` | `tiep-tuc` bước 1, 6 + kế hoạch dãy | mod | răng an toàn mod | lệnh
  người + tài liệu. [thước CE: §9 spec workflow — dòng DP4 + §16 T9–T11]
- Trục B · nguồn và độ tươi mức dùng: mod | `get_usage` | dòng trạng thái | không số | số cũ > 35′ | số của
  tài khoản cũ (đọc trước nhận vai). [thước CE: §4.5]
- Trục C · tình trạng một dãy lúc bàn giao: cây sạch | cây bẩn | còn đơn | đang giữ khoá `s4` sống | giữ khoá
  nhịp cũ | nghỉ hay worktree mất | thợ chết vì hạn mức. [thước CE: §4.3 bước 3–5 + T9]
- Trục D · pha × cửa sổ: dưới ngưỡng | ≥ báo trước | ≥ bàn giao, đặt lại gần | ≥ bàn giao, đặt lại xa | đang
  bàn giao trong hạn | quá hạn | chờ tiếp tục | sau tiếp tục. [thước CE: §3, §4.3, §4.5]

Phân loại:
- **Core:** D (pha) → AC-1 · A=CLI `han-muc` × B → AC-2 · A=nhịp × B × D → AC-3 · cấu hình + thẻ (T15) → AC-4
  · A=`ban-giao-xong` × C → AC-5 · A=đồng hồ × C → AC-6 · A=`tiep-tuc` × D=chờ tiếp tục → AC-7 · A=kế hoạch dãy ×
  «phiên đã bàn giao» → AC-8 · A=hook nhịp → AC-9 · A=`StopFailure` × C → AC-10 · «lượt chết giữa chừng ra cùng
  round» (§4.3 «đo lại ca này») → AC-11 · A=mod → AC-12 · A=răng mod (T11) → AC-13 · lệnh người + tài liệu, không
  vỡ DP1–DP3 → AC-14 · nhánh DP0 → AC-15.
- **Later:**
  - Ba chỗ dùng mod còn lại (khung trạng thái, chặn S4, tự bắt việc chờ người) — DP6, dựng trên khung MOD-SU-KIEN.
  - Bộ phát lịch tự nhắn thợ không qua giám sát — cần kênh tin mà Node gọi được; hôm nay chỉ phiên có.
- **Never:**
  - Đọc mã tài khoản để tách số cũ: mod và `get_usage` không lộ tài khoản (đo 11/10); dùng phiên đọc + giờ nhận
    vai (chỗ chọn 3).
  - Hook lưới cuối commit bỏ qua hook của kho (`--no-verify`): rửa sạch lỗi thật của kho; commit lỗi thì ghi dấu.
  - Cửa sổ tuần theo model: §4.5 chỉ xét hai cửa sổ; nghỉ một model thì phiên khác vẫn chạy.
- **Cross-cutting:** mọi lệnh chạy lại được — AC-1 (cùng pha), AC-5 (cùng mã), AC-6 (cùng hàm, cùng mã), AC-7
  (f); chiều im ở kho không đợt — AC-2, AC-9, AC-10; đường đọc-cũ — AC-3 (l), AC-4 (crm), AC-8 (không bàn giao).

## Out of scope

- Ba chỗ dùng mod còn lại và lệnh `/dieu-phoi:xem` qua mod — DP6.
- Đăng nhập, đổi tài khoản, nhắn thợ, đẩy thông báo, mở chip: việc của app, chỉ có trong thân lệnh người;
  không phép đo máy nào chạy chúng.
- Nhiều máy, chuyển máy — hoãn như ô dù.
- Sáu lỗ trong hạt giống `docs/plans/2026-10-11-hat-giong-tiep-tuc-dieu-phoi-sau-dp3.md` — không vá ở hàng này.
- Thay số ngưỡng mặc định thành số đo được: số là đề xuất của máy, chủ kho duyệt ở thẻ khởi tạo từng đợt.

## Notes

- Mười hai chỗ chọn ở design doc §3 là lựa chọn máy trong khung đã duyệt; mỗi chỗ có dòng sổ. Ba chỗ lệch chữ
  spec ghi là `descope` có trích dẫn: chỗ 1 (cạnh vào `tam-dung → dang-ban-giao`; mọi lối rời đi qua `cho-tiep-tuc` về pha trước — bỏ cạnh tắt `dang-ban-giao → dang-chay` của sơ đồ), chỗ 3 (lần đọc
  của chính giám sát trước nhận vai vẫn hiệu lực), chỗ 6 (dấu thợ chết vì hạn mức cũng kích hoạt bàn giao).
- Giới hạn đã khai: quét «không bao giờ cho phép» là quét chữ — nhánh ghép chữ lúc chạy lọt; bù bằng bảng sự
  kiện theo mod. Ngưỡng mở lại: DP6 thêm mod nghe sự kiện cổng.
- Giới hạn đã khai: hai eval mod (AC-12, AC-13 phần validate) cần Claude Code trên máy; CI của kit không có.
- Giới hạn đã khai: phiên của tài khoản cũ còn chạy sau khi đổi mà vẫn đọc số thì lọt bộ lọc lần đọc. Ngưỡng:
  DP0 câu 1 cho «phiên cũ còn chạy».
- Giới hạn theo nhánh DP0 (câu nào còn `chưa-đo` thì khai ở đây, mỗi câu một dòng kèm ngưỡng):
  - câu 1 đo «mất» (lần đổi chủ động 11/10: phiên, nhóm, tin liên phiên của tài khoản cũ không thấy dưới tài khoản mới; hiện lại khi đổi về) → P2: dựng lại nhóm, lịch là bước thường của `tiep-tuc`. Lịch 30′ chưa quan sát được (M5 không có lịch) — ngưỡng: đợt thử crm (~26/10) có lịch trước lần đổi.
  - câu 2 đo «mất» SUY GIÁN TIẾP (11/10: lệnh dòng trạng thái cài trong worktree, 0 lần gọi qua nhiều lượt) → S2. Chưa loại trừ app chỉ đọc `statusLine` lúc mở phiên — ngưỡng mở lại: một phiên mở MỚI trong thư mục worktree có lệnh dòng trạng thái cài sẵn ghi được ≥1 dòng có `rate_limits`.
  - câu 3 — ngưỡng: ≥1 thợ chết vì hạn mức trong đợt thử mà không có dấu `ban-giao/dau/`.
  - câu 5 — ngưỡng: lần đổi đầu sau khi crm cài gói `dieu-phoi`.
  - câu 6 đã đo «còn» (11/10, mod khớp `get_usage`) → nhánh M1: mod là nguồn số 1.
- Ngoài hợp đồng, ghi hạt giống (Điều phối M5 quyết 11/10, không tạo ô): ca «nguyên vẹn / chiều im» của hồ sơ đã
  ký neo vào merge-base sống — năm ca trong ba hồ sơ mà vòng này phải sửa —
  `docs/plans/2026-10-11-hat-giong-ca-nguyen-ven-neo-merge-base.md`.
- Ngoài hợp đồng, ghi hạt giống (chủ kho nói 11/10, Điều phối M5 chuyển; không tạo ô): nối lại vai điều phối CẤP
  MÁY (nhiều kho, quyền merge, lượt S4 xuyên kho, khoá merge) bằng một lệnh —
  `docs/plans/2026-10-11-hat-giong-dieu-phoi-cap-may-mot-lenh.md`.
- **Known limits (Cổng Bằng chứng, ký 11/10, owner định tuyến «ghi Known limits»):** hai nơi đọc dấu và lịch sử
  bàn giao theo hai luật (Ngoài-5) · hai bản chép luật «hàng kế của dãy» (Ngoài-6) · `kiemMoiTruong` đọc cấu hình
  thô, cấu hình sai khuôn làm chẩn đoán chết (Ngoài-7) · CONTEXT.md mục «Đợt» thiếu hai pha ★ (Ngoài-8) · lần đọc
  mức dùng của phiên đã bàn giao còn kéo đợt vào bàn giao lại (Ngoài-10) · khoá khử lặp theo chuỗi giờ đặt lại làm
  mod và `get_usage` phát trùng cảnh báo (Ngoài-13) · thợ đang chờ khoá không báo xong được, dãy chờ hết hạn chờ
  (Ngoài-14) · `chan-doan` nuốt lỗi kế hoạch dãy (Ngoài-15) · `trong-dot.mjs` đọc mọi lỗi của `tho` thành «lõi
  cũ» (Ngoài-16, trùng hạt giống DP7) · thước lỏng: răng «không bao giờ cho phép» chỉ tiêm dạng chuỗi (Ngoài-17),
  `cham_lai_cung_round` chỉ thử status implemented (Ngoài-18), `co_wip` luôn false (Ngoài-19), argv/cwd của mod
  không so (Ngoài-20), câu báo bàn giao đo lời dẫn thay vì trường `tin` (Ngoài-21), chiều đỏ DP4-15 không ghim
  phép ánh xạ nhánh (Ngoài-22), DP4-07 dau-phien-cu âm-tính-một-mình (Ngoài-23), DP4-01 không ghim mã 1 (Ngoài-24),
  danh sách cho-phép của `quet-ma-lt1.mjs` không tách loại (Ngoài-26). Ngoài-7, 16, 26 là mã của vòng khác lọt
  vùng soi vì mốc so cũ. Sổ: `docs/research/known-limits-ledger.tsv`.
- **Mở hợp đồng mới (Cổng Bằng chứng, ký 11/10) — ghi hạt giống, không tạo ô:** Ngoài-1 (thẻ khởi tạo hỏi khẩu vị
  hạn mức mà không có đường ghi câu trả lời), Ngoài-2 (lịch 30′ của `mo-dot` không đọc hạn mức, không đánh thức),
  Ngoài-3 (`tiep-tuc` khuyên chờ mà vẫn mở chip thợ), Ngoài-11 (lưới cuối bỏ qua phiên cũ đã được nhắn tiếp tục) —
  `docs/plans/2026-10-11-hat-giong-ban-giao-tai-khoan-sau-dp4.md` · Ngoài-4, Ngoài-9, Ngoài-25 (`uat/chay.sh` của
  phiên nghiệm thu xuất lộ trình xanh rỗng) — `docs/plans/2026-10-11-hat-giong-uat-xuat-lo-trinh-xanh-rong.md` ·
  Ngoài-12 (`sau` tra theo mã đơn độc khi hai lộ trình trùng mã) trùng lỗ 1 của
  `docs/plans/2026-10-11-hat-giong-tho-trong-dot-sau-dp7.md`, không ghi mới.
- Ngoài hợp đồng, ghi hạt giống (Điều phối M5 quyết 11/10, không tạo ô): S4 lượt 1 so với mốc `main` cục bộ tụt 64
  commit — 8/26 finding lạc vùng — `docs/plans/2026-10-11-hat-giong-s4-args-nhanh-chinh-cuc-bo.md`.
- Ngoài hợp đồng, ghi hạt giống (Điều phối M5 quyết 11/10, không tạo ô): dòng lệnh ký của thẻ Cổng 2 liệt từng
  mục nên dài 812 ký tự, vượt ngưỡng dán ≈ 800 của app — hai lần ký không chạy —
  `docs/plans/2026-10-11-hat-giong-dong-ky-vuot-nguong-dan.md`.
