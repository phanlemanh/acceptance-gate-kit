---
schema_version: 1
feature: Đánh thức và chẩn đoán đọc nhịp sống của giám sát bằng đúng mã phiên mà hook ghi (hook tự khai mã app, vai tự ghi mã CLI), nên giám sát đang chạy không bị báo «không có nhịp sống»; phiên giám sát mở trước khi nạp gói được nói ra đúng tên
slug: danh-thuc-doc-nhip-dung-ma
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, docs]
status: implemented
design_doc: _acceptance/danh-thuc-doc-nhip-dung-ma/design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-26T02:12:08Z
---

# Acceptance Contract: danh-thuc-doc-nhip-dung-ma

## Context

Gốc: onehub-invest/_acceptance/lo-trinh-2310/ — đợt Điều phối – Thợ `dieu-phoi-dot0-cam-mau` (23–26/10) và đợt crm
`lo-trinh-tin-hieu` (19–20/10) cùng vấp: lịch 30′ gần như lần nào cũng trả `bao-chu-kho` «giám sát không có nhịp sống»
khi giám sát đang chạy. Ô `_acceptance/danh-thuc-doc-nhip-dung-ma/opportunity.md` (Cổng Đáng build 26/10), hàng TC1 của
`docs/plans/lo-trinh-kit.json`. Thiết kế: design doc ở frontmatter.

Thuật ngữ:
- **mã app** = `local_<uuid>`, mã công cụ phiên của app trả và lối nhắn liên phiên nhận; trong môi trường tiến trình là
  `CLAUDE_CODE_HOST_SESSION_ID`.
- **mã CLI** = `session_id` hook nhận trên stdin; trong môi trường lệnh Bash của phiên là `CLAUDE_CODE_SESSION_ID`.
- **tệp nhịp** = `song/<mã CLI>.json` do hook PostToolUse ghi (`ghiNhipSong`).
- **dãy**, **phiên giám sát**, **nhịp sống của phiên**: như `CONTEXT.md`.

## Criteria

- AC-1: Given một đợt mở từ gói và hook PostToolUse thật chạy bằng tiến trình con với `session_id` = `c-gs` và môi trường `CLAUDE_CODE_HOST_SESSION_ID=local_gs`, When hook ghi nhịp, Then `song/c-gs.json` mang `ma_app: "local_gs"`; cùng lời gọi KHÔNG có biến app (môi trường tiến trình con đã xoá hai biến thừa kế, ca kiểm điều đó trước khi kết luận) hay biến sai khuôn mã phiên → tệp không có khoá `ma_app`, các khoá còn lại giống bản gói ở sha ghim của AC-6. Chiều đỏ ở AC-3 biến thể (ii).
- AC-2: Given đợt của AC-1, When giám sát chạy CLI thật `tiep-tuc --phien local_gs --json` với môi trường `CLAUDE_CODE_SESSION_ID=c-gs`, Then `vai.json → giam_sat` mang `phien: "local_gs"` và `phien_cli: "c-gs"`; biến vắng, sai khuôn, hay trùng `phien` → không có khoá `phien_cli`. `mo --phien local_gs` cùng môi trường ghi cùng hai khoá lúc mở đợt.
- AC-3: Given ma trận đánh thức viết sẵn bảy hàng của DP3-09 (thức × nhịp × việc chờ), When chạy lại ở BA biến thể mã app `local_gs` ≠ mã CLI `c-gs` — (i) chỉ `phien_cli` (vai do CLI thật ghi có `CLAUDE_CODE_SESSION_ID`, hook chạy không biến app), (ii) chỉ `ma_app` (vai ghi không biến CLI nên không `phien_cli`, hook có `CLAUDE_CODE_HOST_SESSION_ID`), (iii) cả hai — Then mỗi biến thể in «số hàng: 7» và danh sách `hanh_dong` so bằng nhau với ma trận mã-trùng; hàng «tươi + việc chờ» ra `nhan-giam-sat` với `phien: "local_gs"`. Chiều đỏ, mỗi bản tiêm một nguồn và chỉ biến thể của nguồn ấy đỏ, hai biến thể còn lại im: bản sao gỡ dòng ghi `ma_app` → chỉ (ii) đỏ; bản sao gỡ nhánh đọc `phien_cli` → chỉ (i) đỏ; mỗi danh sách lỗi BẰNG đúng hai thông điệp của hàng `b` và `g` («nhịp tươi của giám sát mà vẫn báo chủ kho»).
- AC-4: Given đợt có vai `local_gs`/`c-gs`, When chạy `chan-doan --json --chi-tiet` với `--phien local_gs`, rồi với `--phien c-gs`, Then mục `hook-phien` là `du` ở cả hai khi có tệp nhịp do hook ghi; đối chứng: không tệp nhịp nào của phiên → `thieu` ở cả hai.
- AC-5: Given đợt có vai `local_gs` mà KHÔNG có tệp nhịp nào nối được với phiên, When giám sát chạy `tiep-tuc --phien local_gs --json` (và `--nhe`) với `CLAUDE_CODE_SESSION_ID=c-gs`, Then kết quả mang `hook_thieu: true` và câu chứa «hook của gói chưa nạp trong phiên này», vai ghi `hook_thieu_luc`; rồi ma trận đánh thức viết sẵn với việc chờ và vai mang `hook_thieu_luc`: thức 5′ → `khong` · thức 50′ → `nhan-giam-sat` (phien `local_gs`, câu chứa «không có hook của gói» và «/dieu-phoi:tiep-tuc») · thức 90′ (giám sát không đáp tin đã nhắn) → `bao-chu-kho`, câu chứa «không có hook của gói», không chứa «không có nhịp sống». Đối chứng: có tệp nhịp `c-gs` → không `hook_thieu`, ma trận DP3-09 không đổi.
- AC-6: Given vai một mã như đợt cũ và đợt đã lách (giám sát nhận vai bằng mã CLI, không `phien_cli`) cùng tệp nhịp không có `ma_app`, When chạy ma trận DP3-09 bảy hàng và `chan-doan --phien <mã đó>`, Then mọi đầu ra JSON giống từng byte kết quả của mã ở mốc so — sha ghim `45e9f2cf13d104aa4b1a2321a0026c4b739f8914` (merge-base lúc mở vòng; hằng trong tệp test, không suy lúc chạy), rút bằng `git archive` trọn thư mục gói.
- AC-7: Given vai chỉ mã app (đợt dựng trước vòng) và tệp nhịp đời trước không `ma_app`, When chạy `chan-doan --json --chi-tiet --phien local_gs`, Then có đúng một dòng vàng chứa «vai giữ mã app nhưng nhịp chưa mang mã app» và lệnh `/dieu-phoi:tiep-tuc`; mã thoát không đổi so với bản ở sha ghim của AC-6.
- AC-8: Given `dieu-phoi/commands/tiep-tuc.md`, `ban-giao.md`, `mo-dot.md`, When đọc, Then mỗi lời dặn `--phien` nói rõ là mã app (`local_…`, công cụ phiên của app) và máy tự ghi mã CLI; ngoài app dùng mã CLI. Chiều đỏ: ba tệp ở sha ghim `45e9f2cf13d104aa4b1a2321a0026c4b739f8914` → hàm kiểm nêu đúng tên từng tệp thiếu câu.
- AC-9: Given cây sau vòng, When chạy suite `tests/dieu-phoi/**/*.test.mjs`, Then mọi ca xanh ở hai lần chạy — môi trường sạch và môi trường cha mang `CLAUDE_CODE_HOST_SESSION_ID`/`CLAUDE_CODE_SESSION_ID` giả — với cùng tập dòng TAP `ok`; tập ca đã có ở sha ghim `45e9f2cf13d104aa4b1a2321a0026c4b739f8914` mà bị đổi thân BẰNG đúng tập khai trong sổ quyết định (rỗng nếu không ca nào đổi), mỗi ca đổi có một dòng sổ `fix` nêu tên.

## Đường đo

- Vế ca dựng của ngưỡng ô → AC-3, AC-5 (ma trận đánh thức với hai mã khác nhau).
- Vế «14 ngày sau khi một kho chạy đợt nhận bản có TC1, không lần bao-chu-kho nào mà giám sát đang chạy»: `danh-thuc` là lệnh chỉ đọc, không có sổ máy; số lấy từ tin phiên lịch 30′ gửi chủ kho mỗi lần `bao-chu-kho` (lời dặn `/dieu-phoi:tiep-tuc` bước «đánh thức») trong 14 ngày kể từ ngày kho tiêu thụ đầu tiên chạy đợt trên bản có TC1; «giám sát đang chạy» = giám sát đáp tin trong lượt ấy hay phiên giám sát còn trong nhóm đợt. Chủ kho ghi kết quả bằng `/acceptance-gate:observed` (ADR 0020). Không AC nào bảo đảm vế này — reality là đồng hồ cuối.

## Coverage

Quét hình thái preset test-matrix — bản đủ ở design doc §4. Bốn trục: A mã vai giữ · B nguồn nhịp · C bên đọc · D độ tươi.

- A app × B hook-app × C danh-thuc × D tươi/cũ → AC-1, AC-2, AC-3.
- A app/cả hai × C chan-doan → AC-4. A app × B không hook × C tiep-tuc + danh-thuc (thức 5′ · 50′ · 90′) → AC-5.
- A CLI × B đời trước (đường đọc-cũ) → AC-6. A app × B đời trước × C chan-doan → AC-7.
- Lời dặn (người dùng kit là phiên Claude Code đọc lệnh) → AC-8. Không vỡ ca cũ → AC-9.
- [NGÀNH: systemd `sd_notify` WATCHDOG=1 · Kubernetes liveness probe] — tín hiệu sống do chính tiến trình tự khai danh tính.
- Later: `xetDay` của dãy thợ (nối theo worktree, không theo mã — không có lỗi này).

## Out of scope

- Đổi ngưỡng `NGUONG_SONG_MS`, `NGUONG_THUC_MS` hay nhịp 30′ của lịch đánh thức.
- Thợ đứng chờ khoá bị coi «không còn phiên sống» (hạt giống 20/10 mục 2) — lỗ khác, đọc theo worktree.
- Tự mở lại phiên giám sát hay tự nạp lại hook — phiên mới là việc của người hoặc của lệnh `/dieu-phoi:tiep-tuc`.
- Sửa thư mục đợt đang chạy ở kho tiêu thụ — kho nhận bản vá theo bản phát hành.
- `CHANGELOG.md`, số phiên bản, cắt mốc — việc của chiến dịch phát hành.

## Notes

- Known limits — chọn ở Cổng Bằng chứng 2026-10-26:
  - Ngoài-2: Bộ so hai môi trường có thể nhận một ca thỉnh thoảng đỏ là chập chờn mà chưa ca nào thử xem nó có nhận nhầm một ca đỏ thật.
  - Ngoài-3: Một ca hỏng ổn định khi chạy cả bộ nhưng xanh khi chạy riêng bị bộ so hai môi trường báo xanh; bước chạy trọn bộ riêng vẫn bắt nó.
  - Ngoài-4: Ca đo phép so của bộ hai môi trường dùng dữ liệu viết tay, chưa chạy qua bộ đọc đầu ra thật của lần chạy.
  - Ngoài-9: Bộ tìm ca đổi thân chỉ nhận ca viết ở đầu dòng, nên ca một dòng hay ca sinh trong vòng lặp có thể bị đọc sai hay lọt.
  - Ngoài-10: Ma trận ba hàng «không ghi mã CLI» chỉ chạy qua lệnh mở đợt, chưa qua lệnh tiếp tục.
