---
schema_version: 1
feature: Nối lại một đợt Điều phối – Thợ bằng một lệnh (`/dieu-phoi:tiep-tuc`) — nhịp sống của phiên, kế hoạch từng dãy (chip chỉ cho dãy không còn phiên sống), nhận vai giám sát, đánh thức giám sát, lệnh con ghi qua CLI, kiểm môi trường do kho khai
slug: dieu-phoi-tiep-tuc-mot-lenh
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, config, docs]
status: verified
design_doc: docs/superpowers/specs/2026-10-11-dieu-phoi-tiep-tuc-mot-lenh-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-10T23:03:16Z
---

# Acceptance Contract: dieu-phoi-tiep-tuc-mot-lenh

## Context

Hàng DP3 của ô dù `dieu-phoi-tho-trong-kit` (Cổng Đáng build 09/10, phủ DP1–DP4). Ca gốc: 09/10 phiên
giám sát crm khởi động lại làm dừng 37 việc nền giăng tay; 08/10 Monitor hết hạn, hai việc lỡ 5 giờ; 09/10
một phiên giám sát mới bị chặn ghi tệp vào thư mục đợt vì thư mục nằm ngoài worktree của phiên. Thiết kế
chung đã duyệt 10/10: `docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md` (§4.2, §5, §5.1, §6,
§9, §16 T12) và spec ô dù §2.3. Thiết kế thi công và tám chỗ chọn: design doc ở frontmatter.

Thuật ngữ:
- **mã phiên** = `session_id` của Claude Code; hook nhận nó trong đầu vào, lệnh người truyền nó qua `--phien`.
- **nhịp sống** = tệp `song/<mã phiên>.json` (`{phien, day, worktree, luc}`) do hook `PostToolUse` của gói ghi.
  Một dãy **có phiên sống** khi có tệp nhịp mới hơn 10′ mang worktree của dãy.
- **dãy** = mục trong `day` của `hang-viec.json` (id `P1`, `P2`…); cwd thuộc dãy khi nằm trong worktree của dãy.
- **lệnh con của thợ** = `xin`, `nha`, `yeu-cau`: ghi vào thư mục đợt thay cho dãy của cwd, nên đòi cwd thuộc
  một dãy. **lệnh con của giám sát** = `tra-loi`, `pha`, `vai`, `nhat-ky`, `tiep-tuc`, `danh-thuc`,
  `chan-doan`: chạy được từ mọi cwd trong kho (gốc kho, mọi worktree liên kết) — thư mục đợt tìm qua
  `git --git-common-dir`.
- **việc chờ** = (i) yêu cầu chưa có tệp trả lời · (ii) tệp `cho-nguoi/<dãy>.json` · (iii) sự kiện mang
  `can_phan: true` ghi SAU `thuc_luc` của giám sát hiện tại (chưa có lần thức nào thì mọi sự kiện như vậy).
  «Đã xử» = có trả lời · tệp chờ người đã gỡ · giám sát đã thức sau sự kiện.
- **kho thử** = kho git do chính ca kiểm dựng trong thư mục tạm; **đồng hồ giả** = thời điểm truyền vào hàm.

## Criteria

- AC-1: Given gói `dieu-phoi`, When đọc `dieu-phoi/commands/` và chạy bộ kiểm gói của Claude Code, Then có đúng bốn lệnh `mo-dot`, `dong-dot`, `xem`, `tiep-tuc`; `tiep-tuc` không mang `disable-model-invocation`, mọi lời gọi script của gói đi qua `${CLAUDE_PLUGIN_ROOT}`; thân `tiep-tuc` theo trình tự: CLI `tiep-tuc --phien` (phiên đã thôi vai thì dừng Monitor và báo một dòng) → giăng Monitor, tạo lịch 30′ và nhóm thanh bên nếu thiếu → mỗi dãy làm đúng hành động CLI trả (`mo-chip` mở chip với lời ghi danh CLI dựng · `nhan-giang-lai` nhắn dãy · `khong` không làm gì · `worktree-mat` báo người) → chẩn đoán lại; có dạng `--nhe` cho mỗi lần thức. `claude plugin validate --strict` sạch lỗi. Chiều đỏ: bản sao đảo bước CLI xuống sau bước chip → ca đỏ nêu `tiep-tuc.md`.
- AC-2: Given một đợt đang chạy có dãy P1, When hook `PostToolUse` thật của gói nhận đầu vào có `session_id` và cwd trong worktree P1 (và một lần với cwd ngoài mọi dãy), Then thư mục đợt có `song/<session_id>.json` mang đúng `{phien, day: "P1", worktree, luc}` (ngoài dãy thì `day: null`); lời gọi kế trong 30″ không ghi lại tệp; kho không có đợt thì hook không tạo tệp nào. Bộ đọc «dãy có phiên sống» của `chan-doan` đọc đúng tệp hook thật vừa ghi (round-trip).
- AC-3: Given ma trận dãy viết sẵn, mỗi hàng khai tuổi nhịp sống — (a) nhịp 3′, không đơn/khoá/yêu cầu chờ · (b) nhịp 3′, còn đơn chờ · (c) nhịp 25′, không giữ khoá, không chờ người · (d) không nhịp nhưng đang giữ khoá · (e) worktree không còn · (f) nhịp 30′, không khoá, có `cho-nguoi/<dãy>.json` (thợ đứng chờ ở cổng) · (g) đợt dựng bằng `mo` của bản merge-base, chưa từng có thư mục `song/`, dãy không giữ khoá — When chạy `chan-doan --json` và `tiep-tuc --json`, Then mỗi dãy có mục `day:<id>` và hành động lần lượt `khong` · `nhan-giang-lai` · `mo-chip` · `khong` · `worktree-mat` · `cho-nguoi` · `chua-biet`; `cho-nguoi` và `chua-biet` không mở chip (việc của `chua-biet` nói «đợt chưa có nhịp sống — kiểm thanh bên trước khi mở chip»); hai lệnh trả CÙNG hành động vì cùng gọi một hàm; dãy `mo-chip` có lời ghi danh nêu thư mục đợt, «đọc LUAT.md», và lệnh `/feature-loop:feature-loop <slug hàng của dãy>`. Chiều đỏ: bản sao bỏ điều kiện «giữ khoá» → (d) đổi sang `mo-chip`; bản sao bỏ nhánh đợt-chưa-có-nhịp → (g) đổi sang `mo-chip`; mỗi ca đỏ nêu đúng hàng của nó.
- AC-4: Given một đợt có giám sát cũ `A` và bộ phát lịch đã chết, When chạy `tiep-tuc --phien B` hai lần, Then lần đầu: `vai.json` có giám sát `B` với `thuc_luc`, `A` nằm trong `lich_su` kèm `thoi_luc`, bộ phát lịch chạy lại đúng một tiến trình; lần hai: `lich_su` không thêm mục, không thêm tiến trình bộ phát lịch, chỉ `thuc_luc` đổi. Không đợt → thoát 1 nêu «không có đợt».
- AC-5: Given một đợt có giám sát `B`, When chạy `tiep-tuc --nhe --phien B` rồi `tiep-tuc --nhe --phien C`, Then lần đầu ghi `thuc_luc` của `B` và không đổi vai; lần hai trả `thoi_vai: true`, thoát 0, và không tệp nào trong thư mục đợt đổi (so băm trước/sau).
- AC-6: Given một đợt đang chạy và cwd trong worktree liên kết của dãy P1, When gọi lệnh con của thợ `xin s4`, rồi một nhịp của bộ phát lịch thật, rồi `nha s4`, và `yeu-cau cham-tep --tep <đường>`, Then đơn có đúng tên và khuôn bộ phát lịch đọc (`xin/P1-s4.json`, kiểm bằng `kiemDon`), nhịp cấp khoá s4 cho P1, `nha` gỡ khoá, yêu cầu được nhịp xử như yêu cầu ghi tay. Sai khuôn (loại đơn lạ · `cham-tep` không tệp · lệnh thợ gọi từ gốc kho, ngoài mọi dãy · `tra-loi` có khoá lạ) → thoát 1 nêu lý do riêng (lời gọi ngoài dãy nêu đúng tên lệnh) và không tạo tệp nào. Tệp ghi tay theo khuôn cũ vẫn được đọc.
- AC-7: Given `vai.json` có giám sát `B`, When gọi lệnh con của giám sát `tra-loi`, `pha`, `vai`, `nhat-ky` từ gốc kho với `--phien C`, Then mỗi lệnh thoát 1 nêu cả `C` lẫn `B`, và thư mục đợt không đổi (so băm); cùng lệnh với `--phien B` thì ghi, cả khi gọi từ gốc kho lẫn từ một worktree liên kết không thuộc dãy nào; vắng `--phien` thì chạy như DP2.
- AC-8: Given cấu hình đợt khai `kiem_moi_truong` hai lệnh (một thoát 0, một thoát 1 có dòng stderr) và một lệnh treo quá trần, When chạy `chan-doan --json`, Then có mục `moi-truong:<tên>` lần lượt `du` · `thieu` (việc chứa dòng stderr) · `thieu` (việc nêu quá trần); không khai thì không có mục `moi-truong:` nào; bản gói đang cài khác `loi/PHIEN-BAN.json` của đợt → mục `ban-goi` `thieu`. `kiem_moi_truong` sai kiểu → bộ kiểm cấu hình nêu đúng khoá.
- AC-9: Given ma trận đánh thức viết sẵn, mỗi hàng khai tuổi `thuc_luc`, tuổi nhịp sống của giám sát và việc chờ — (a) thức 5′, nhịp 3′, có việc chờ · (b) thức 50′, nhịp 3′, có yêu cầu chưa trả lời · (c) thức 50′, nhịp 50′, không việc chờ (giám sát rảnh) · (d) thức 50′, nhịp 50′, có việc chờ (giám sát chết hoặc Monitor hết hạn) · (e) không có đợt · (f) thức 80′, nhịp 80′, không việc chờ · (g) thức 50′, nhịp 3′, việc chờ duy nhất là một sự kiện `can_phan` ghi sau `thuc_luc` — When chạy `danh-thuc --json` với đồng hồ giả, Then hành động lần lượt `khong` · `nhan-giam-sat` · `khong` · `bao-chu-kho` · `khong` · `khong` · `nhan-giam-sat`; `nhan-giam-sat` có `phien` = giám sát và câu chứa `/dieu-phoi:tiep-tuc --nhe`; `bao-chu-kho` có câu chứa `/dieu-phoi:tiep-tuc`; giám sát rảnh mà không có việc chờ thì không bao giờ gọi người; lệnh không ghi tệp nào.
- AC-10: Given một khoá vừa cấp cho dãy P1, When nhịp bộ phát lịch chạy sau 11′ mà không có nhịp sống nào của worktree P1 kể từ lúc cấp (nhịp do hook thật ghi), Then có đúng một sự kiện `khoa-khong-nhip` `can_phan`; nhịp kế không thêm; có nhịp sống mới của P1 thì không có sự kiện; đợt không có thư mục `song/` thì không có sự kiện. Giới hạn khai, có hàng trong ma trận: một phiên KHÁC ghi nhịp trên cùng worktree P1 sau lúc cấp thì không có sự kiện (nhịp nối theo worktree, không theo phiên giữ khoá).
- AC-11: Given khuôn `dieu-phoi/scripts/mau/LUAT.md`, When `mo` ghép `LUAT.md` của một đợt, Then mục «Cách xin tài nguyên» dạy thợ dùng lệnh con (`xin`, `nha`, `yeu-cau`) qua lõi của đợt (`<thư mục đợt>/loi/dieu-phoi.mjs`), không còn câu dạy ghi tay tệp `xin/`, `yeu-cau/` hay `rm -rf` khoá.
- AC-12: Given cây kit, When đọc `CONTEXT.md`, GUIDE, QUICKSTART và chạy ca LB1, LB2, Then `CONTEXT.md` có mục «Nhịp sống của phiên» theo khuôn có `_Avoid_`; GUIDE §6.6 và QUICKSTART nêu `/dieu-phoi:tiep-tuc`; bảng tên lệnh có dòng `/dieu-phoi:tiep-tuc` nên LB1, LB2 xanh.
- AC-13: Given cây sau thay đổi, When chạy suite `tests/dieu-phoi/**`, Then mọi ca DP1 và DP2 xanh nguyên tên; `tests/dieu-phoi/dong-goi.test.mjs` và `tests/dieu-phoi/loi/` không đổi so với merge-base; ca DP2-01 nâng tập lệnh lên bốn có dòng sổ ghi lý do ở hồ sơ DP2; chiều im ở kho không có đợt (DP1-02) không đổi.
- AC-14: Given một đợt mà bộ phát lịch thật vừa ghi sự kiện `khoa-khong-nhip` `can_phan`, có một yêu cầu chưa trả lời, một tệp `cho-nguoi/P2.json`, và một sự kiện `can_phan` ghi TRƯỚC `thuc_luc` của giám sát, When chạy `chan-doan --json --phien <mã>`, Then mục `viec-cho` liệt kê đúng ba việc chưa xử, cũ nhất trước (so bằng nhau với danh sách viết sẵn; sự kiện trước `thuc_luc` không có mặt); mục `giam-sat` là `du` khi `--phien` là giám sát, `thieu` với việc «chạy /dieu-phoi:tiep-tuc để nhận vai» khi khác; mục `hook-phien` là `du` khi có `song/<mã>.json`, `thieu` khi chưa (hook chưa bắn trong phiên này). `danh-thuc` đọc việc chờ qua CÙNG hàm.

## Coverage

Quét bằng skill `morphological-scan`, preset test-matrix.

- Chân sản phẩm: [SUY-TỪ-REPO: docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md] (đã duyệt), [SUY-TỪ-REPO: docs/superpowers/specs/2026-10-09-dieu-phoi-tho-trong-kit-design.md] §2.3, và gói `dieu-phoi` đã gộp (DP1, DP2).
- Chân ngành: [NGÀNH: systemd — `Restart=` chạy lại dịch vụ chết, `systemctl status` chỉ đọc, watchdog `WatchdogSec` báo khi tiến trình thôi gửi nhịp] cho «chạy lại cái đã chết, không chạy thêm cái còn sống» và nhịp sống có ngưỡng.

Trục:
- Trục A · điểm chạm: lệnh người `tiep-tuc` | CLI máy (`tiep-tuc`, `danh-thuc`, `chan-doan`, lệnh con ghi) | hook `PostToolUse` | nhịp bộ phát lịch | khuôn `LUAT.md` | tài liệu. [thước CE: §9 spec workflow — dòng DP3 + spec ô dù §2.3]
- Trục B · tình trạng một dãy: phiên sống không chờ | phiên sống còn chờ | không phiên, không khoá | không phiên, giữ khoá | worktree mất | phiên đứng chờ người | đợt chưa có nhịp sống (hook bản cũ). [thước CE: §4.2 bước 5 + gap-probe P0, P1]
- Trục C · tình trạng giám sát: phiên gọi là giám sát | phiên mới nhận vai | phiên cũ đã thôi vai | giám sát thức gần | thức cũ còn việc | thức cũ không việc | giám sát chết. [thước CE: §5]
- Trục D · bộ phát lịch: sống | chết | đợt cũ không `song/`. [thước CE: §4.2 bước 4, §5.1]

Phân loại:
- **Core:** A=lệnh người → AC-1 · A=hook → AC-2 · B → AC-3 · C=nhận vai + D → AC-4 · C=thôi vai → AC-5 · A=lệnh con ghi → AC-6, AC-7 · môi trường (T12) → AC-8 · C=đánh thức → AC-9 · D=khoá không nhịp → AC-10 · A=LUAT → AC-11 · tài liệu → AC-12 · không vỡ DP1/DP2 → AC-13 · việc chờ + giám sát hiện tại → AC-14.
- **Later:**
  - Đọc mức dùng, `ban-giao.json`, hai trạng thái ★ và bước «`pha dang-chay` sau bàn giao» của §4.2 — DP4.
  - Khung trạng thái trong app, tự bắt việc chờ người bằng mod — DP6.
- **Never:**
  - Trục C × hai phiên cùng một worktree: luật đợt là một dãy một worktree; nhịp sống nối theo worktree (chỗ chọn 1).
  - `tiep-tuc` tự chuyển `tam-dung` → `dang-chay`: chữ «chạy tiếp» là của người (chỗ chọn 5).
- **Cross-cutting:** mọi lệnh chạy lại được — vế «chạy lần hai không sinh thêm» nằm ở AC-2 (30″), AC-4 (vai và tiến trình), AC-9 (chỉ đọc), AC-10 (một sự kiện mỗi lần cấp). Lệnh chạy được từ mọi cwd trong kho — AC-7 (giám sát), AC-6 (thợ đòi cwd thuộc dãy).

## Out of scope

- Đọc mức dùng (`get_usage`, `han-muc`), `ban-giao.json`, hai trạng thái ★, bước 6 của §4.2 — DP4.
- Lớp mod — DP6. Khối «Trong đợt» của feature-loop — DP7.
- Sáu lỗ trong hạt giống `docs/plans/2026-10-10-hat-giong-mo-dot-dieu-phoi-sau-dp2.md` và bốn lỗ trong `docs/plans/2026-10-10-hat-giong-loi-dieu-phoi-chuyen-nguyen-tu-crm.md` — không vá ở hàng này.
- Việc của app (Monitor, lịch 30′, nhóm thanh bên, chip, tin liên phiên, đẩy thông báo) chỉ có trong thân lệnh người; không phép đo máy nào chạy chúng.
- Đổi tài khoản thật và thanh bên tách theo tài khoản — phép đo DP0 ở Mac mini.

## Notes

- Chín chỗ chọn ở design doc §3 là lựa chọn máy trong khung đã duyệt; mỗi chỗ có một dòng sổ quyết định.
  Hai chỗ đi lệch chữ của spec workflow và ghi là `descope` có trích dẫn: chỗ 1 (§5.1 «`chu.json` của khoá
  ghi thêm mã phiên») và chỗ 9 (§5 «không có nhịp sống quá 10′ → đẩy thông báo»).
- Giới hạn đã khai: tin liên phiên đánh thức giám sát (§5) chưa đo được trong suite — CLI `danh-thuc` trả quyết định, lệnh người gửi tin. Ngưỡng: đợt thử crm (~26/10) có ≥1 lần `nhan-giam-sat` mà giám sát bắt đầu lượt mới; không có thì ghi hạt giống.
- Giới hạn đã khai: kiểm «chỉ giám sát được ghi» chống nhầm, không chống giả — mã phiên là chuỗi tự khai.
