---
schema_version: 1
feature: Mở và đóng một đợt Điều phối – Thợ bằng một lệnh (`/dieu-phoi:mo-dot`, `/dieu-phoi:dong-dot`, `/dieu-phoi:xem`) — vòng đời đợt, đổi kế hoạch trong đợt, nguồn hàng từ lộ trình, khoá S4 cấp máy, start biết đợt, lệnh đếm đợt
slug: dieu-phoi-mo-dot-mot-lenh
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, config, docs]
status: approved
design_doc: docs/superpowers/specs/2026-10-10-dieu-phoi-mo-dot-mot-lenh-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-10T06:56:20Z
---

# Acceptance Contract: dieu-phoi-mo-dot-mot-lenh

## Context

Hàng DP2 của ô dù `dieu-phoi-tho-trong-kit` (Cổng Đáng build 09/10, phủ DP1–DP4). Mở đợt hôm nay là sáu
bước tay theo README của gói; đóng đợt là bốn bước tay; không có trạng thái đợt nào ngoài «có symlink hay
không». Thiết kế chung đã duyệt 10/10: `docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md`
(§3, §4.1, §4.4, §4.6, §9, §13, §14, §15, §16 T6, T8, T14, T15, T16). Thiết kế thi công và năm chỗ chọn:
design doc ở frontmatter.

Thuật ngữ:
- **gói đợt** = thư mục trong git của kho tiêu thụ chứa `dieu-phoi.config.json`, `hang-viec.json`,
  `LUAT-rieng.md`; đường đọc từ khoá `dieu_phoi.goi_dot` của `_acceptance/config.yaml` (`{ten}` thay bằng
  tên đợt) hoặc cờ `--goi`.
- **đợt mở từ gói** = đợt có `dieu-khien.json` mang `nguon_goi` khác null. **Đợt dựng tay** = `mo` không gói.
  **Đợt cũ** = thư mục đợt không có `dieu-khien.json` (bản crm).
- **pha** = trạng thái đợt trong `dieu-khien.json`: `nhap` · `dang-chay` · `tam-dung` · `dang-dong`.
- **kho thử** = kho git do chính ca kiểm dựng trong thư mục tạm.

## Criteria

- AC-1: Given gói `dieu-phoi`, When đọc `dieu-phoi/commands/` và chạy bộ kiểm gói của Claude Code trên gói, Then có đúng ba lệnh `mo-dot`, `dong-dot`, `xem`; không lệnh nào mang `disable-model-invocation`; mọi lời gọi script trong thân lệnh đi qua `${CLAUDE_PLUGIN_ROOT}`; thân `mo-dot` và `dong-dot` đều có câu khai chữ quyết (duyệt thẻ, `build` cho hàng chờ Cổng Đáng, quyền tự merge) chỉ nhận từ người gõ — máy được CHÉP chữ người gõ vào `decided_by`, không được tự sinh chữ ấy; `claude plugin validate --strict` sạch lỗi. Trình tự trong thân: `mo-dot` = chẩn đoán → (mục `goi-dot` thiếu thì DỪNG, nói đúng việc khai) → `mo` → thẻ khởi tạo → chờ người duyệt → `pha dang-chay` → `chay` → Monitor, lịch 30′, nhóm thanh bên, chip từng dãy → chẩn đoán lại; `dong-dot` = thẻ đóng → chờ người duyệt → `pha dang-dong` → `dong` → dọn phiên. Hai bước spec §4.1 dời khỏi DP2 không có trong thân: ngưỡng hạn mức (DP4) và «ba quyết định có khuyến nghị» (thay bằng T15: chỉ hỏi quyền tự merge). Chiều đỏ: bản sao thêm `disable-model-invocation: true` vào `xem.md` → ca đỏ nêu `xem.md`.
- AC-2: Given một kho thử khai `dieu_phoi.goi_dot` trỏ một gói đợt đủ ba tệp, When chạy `mo <tên>` của gói, Then thư mục đợt có `dieu-phoi.config.json` và `hang-viec.json` bằng bản của gói (cộng `goc_kho` và `dot`), `LUAT.md` gồm khuôn của gói rồi nguyên văn `LUAT-rieng.md`, `vai.json` ghi giám sát và mọi dãy của `hang-viec.json`, `dieu-khien.json` ở `pha: nhap` với `nguon_goi` là đường gói; chạy `mo <tên>` lần hai thì thoát 0, in `đợt <tên> đã mở` và không tệp nào đổi. Cờ `--goi <dir>` thắng khoá cấu hình. Gói thiếu một tệp → thoát 1, nêu tên tệp thiếu, không dựng gì.
- AC-3: Given một kho thử KHÔNG khai `dieu_phoi.goi_dot` và không có `--goi`, When chạy `mo <tên>` rồi `chan-doan --json`, Then `mo` dựng đợt dựng tay như bản cũ (`pha: dang-chay`, `nguon_goi: null`) và chẩn đoán có mục `goi-dot` mang `trang_thai: thieu` với việc nêu `dieu_phoi.goi_dot`; kho có gói thì mục đó là `du`.
- AC-4: Given `pha.mjs`, When chuyển trạng thái theo mọi cặp (từ, sang) của bốn pha, Then đúng năm chuyển trong bảng (`nhap→dang-chay`, `dang-chay→tam-dung`, `tam-dung→dang-chay`, `dang-chay→dang-dong`, `tam-dung→dang-dong`) được ghi kèm `dat_boi`, `dat_luc`, `ly_do` và một dòng `lich_su`; bốn ô cùng pha (`X → X`) là việc không làm gì: thoát 0, tệp byte-bằng, không thêm `lich_su` (chạy lại được); bảy cặp còn lại bị từ chối với thông điệp nêu «<từ> → <sang>» và tệp không đổi (ma trận viết sẵn, số ô = 16 = 5 + 4 + 7).
- AC-5: Given một đợt mở từ gói có một đơn `merge` và một đơn `s4` đang chờ, When chạy một nhịp bộ phát lịch ở từng pha, Then `dang-chay` cấp cả hai; `nhap` và `tam-dung` không cấp gì; `dang-dong` chỉ cấp `merge`; `trang-thai.json` ghi đúng `pha`. Và đợt cũ (fixture `dot-crm-0910` của DP1, không có `dieu-khien.json`) chạy nhịp như `dang-chay`, không phát `loi-nhip`.
- AC-6: Given một đợt bất kỳ, When chạy `chan-doan --json`, Then đầu ra là một danh sách mục `{muc, trang_thai, viec}` với `trang_thai` ∈ {du, thieu, khong-ap}, gồm ít nhất các mục `co-dot`, `pha`, `phat-lich`, `goi-dot`, `hang-viec`, `vai`; kho không có đợt → chỉ mục `co-dot` là `thieu`, thoát 0, không ghi tệp nào.
- AC-7: Given một đợt đang chạy, When chạy `hang day-len <mã> --truoc <mã>`, `hang them <mã> --day <P>`, `hang nghi <P>`, `pha tam-dung`, `pha dang-chay`, Then `hang-viec.json` đổi đúng (ưu tiên, hàng mới, dãy nghỉ), mỗi lệnh thêm đúng một dòng dưới `## Nhật ký` của `LUAT.md` và một sự kiện; nhịp kế áp thay đổi (dãy nghỉ không nhận hàng kế; hàng đẩy lên được chọn trước). Chạy lại cùng lệnh lần hai → thoát 0, `hang-viec.json`, `LUAT.md`, `su-kien.jsonl` byte-bằng sau lần một. Mã hoặc dãy không có → thoát 1 nêu tên, tệp không đổi.
- AC-8: Given gói đợt khai `nguon_hang` (danh sách `<tệp>:<mã>` hoặc `<tệp>@<ngày mốc>`) và kho có `LO-TRINH.html` do bộ phân tích lộ trình của kit dựng, When chạy `mo`, Then `hang-viec.json` có đúng các hàng ấy, mỗi hàng mang `ma` và `slug` của lộ trình và phần thi công của gói, không mang câu giao; bộ đọc của gói đọc lại đúng khối dữ liệu mà `lo-trinh.mjs` thật của kit ghi (round-trip). Không có `LO-TRINH.html` hoặc khối hỏng → `mo` vẫn dựng với hàng khai tay và in đúng một dòng nêu lý do.
- AC-9: Given một đợt ở `pha: nhap`, When chạy `the khoi-tao --json`, Then thẻ có bảng dãy và hàng; mục hỏi người chỉ gồm quyền tự merge (và chữ quyết `build` cho từng hàng chưa có ô đã quyết); ưu tiên khi tranh chấp và làn V nằm ở mục máy đi tiếp có cửa phản đối; danh sách hàng chờ Cổng Đáng đúng bằng các hàng có `ma` mà `_acceptance/<slug>/` chưa có quyết định — thư mục có mặt KHÔNG phải quyết định: ô `stage: discovery` chưa có `decision` vẫn chờ; ô có `decision` khác `build` (park, kill, iterate) không vào đợt và nằm ở mục cảnh báo của thẻ; ô `build` hoặc hồ sơ có `contract.md` là đã quyết. When chạy `the dong --json` trên đợt đang chạy, Then thẻ liệt kê hàng phát sinh (hàng không có `ma` lộ trình) và lớp phủ ưu tiên đã đổi trong đợt.
- AC-10: Given hai kho thử, mỗi kho một đợt mở từ gói, cùng `DIEU_PHOI_MAY_DIR`, When bộ phát lịch của kho A cấp `s4` rồi tới nhịp của kho B có đơn `s4`, Then B không cấp `s4` cho tới khi A nhả (thư mục khoá máy ghi kho và đợt đang giữ); A nhả thì nhịp kế của B cấp; `dong` của A gỡ khoá máy mà A đang giữ; khoá máy của một đợt không còn chạy (thư mục đợt vắng, hoặc symlink `dieu-phoi-hien-tai` của kho ấy không còn trỏ thư mục đợt đó) bị thu hồi ở nhịp của kho khác kèm sự kiện `thu-hoi-may`. Đợt dựng tay và đợt cũ không chạm khoá máy.
- AC-11: Given kho có đợt đang chạy với một hàng của lộ trình đang do dãy giữ, When chạy bộ quét của `/acceptance-gate:start`, Then đầu ra có khoá `dotDangChay` (tên đợt, pha) và thẻ không còn lựa chọn mở hàng ấy (dòng chữ hàng kế vẫn còn); kho không có đợt → khoá vắng hoặc null, đầu ra còn lại byte-bằng bản trước thay đổi. `commands/start.md` in một dòng «đợt <tên> đang chạy → /dieu-phoi:xem» khi khoá có giá trị.
- AC-12: Given một trạng thái đợt, When chạy `xem` và dựng `bang.html`, Then cả hai vẽ từ MỘT hàm mô hình (`mo-hinh.mjs`); đầu ra của `xem` có `pha` và, với hàng mang `ma`, nhóm kế hoạch (`nhom_trang_thai` của khối lộ trình) cạnh tiến độ thi công. Chiều đỏ: bản sao `xem` tự tính khoá thay vì gọi hàm mô hình → ca so hai bề mặt đỏ.
- AC-13: Given một đợt mà bộ phát lịch thật đã ghi sự kiện `hang-gop` (hàng chuyển sang gộp) và `cho-nguoi` (tệp chờ người mới do hook thật ghi), When chạy `dem --json`, Then đầu ra có số hàng gộp theo ngày và số lần gọi chủ kho (tổng và theo hàng), đếm từ chính `su-kien.jsonl` mà bên viết thật sinh ra; mỗi lần chuyển chỉ ghi MỘT sự kiện dù nhịp lặp.
- AC-14: Given cây kit, When đọc `CONTEXT.md`, GUIDE và QUICKSTART và chạy ca LB1, LB2 của kit, Then `CONTEXT.md` có mục cho «Đợt (điều phối)», «Dãy», «Phiên giám sát · phiên thợ», «Bộ phát lịch», «Hàng kế của dãy», «Bảng đợt», «Ổ cắm» theo khuôn có `_Avoid_`; GUIDE có §6.6 chạy đợt và QUICKSTART có khối ngắn nêu ba lệnh; bảng tên lệnh của kit biết tiền tố `dieu-phoi` nên LB1, LB2 xanh. Chiều đỏ: bản sao bỏ `dieu-phoi` khỏi bảng tên lệnh → LB2 đỏ nêu `/dieu-phoi:`.
- AC-15: Given cây sau thay đổi, When chạy suite `tests/dieu-phoi/**`, Then 118 ca của DP1 vẫn xanh nguyên tên (không ca nào bị sửa thân) cùng mọi ca DP2; chiều im ở kho không có đợt (DP1-02) không đổi.

## Coverage

Quét bằng skill `morphological-scan`, preset test-matrix.

- Chân sản phẩm: [SUY-TỪ-REPO: docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md] (đã duyệt) và README của gói `dieu-phoi`.
- Chân ngành: [NGÀNH: systemd — `start`/`stop`/`status` chạy lại được, trạng thái unit có bảng chuyển, lệnh status chỉ đọc] cho nguyên tắc «mọi lệnh chạy lại được» và vòng đời có bảng chuyển.

Trục:
- Trục A · điểm chạm: lệnh người (`mo-dot`, `dong-dot`, `xem`) | CLI máy (`mo`, `pha`, `hang`, `chan-doan`, `the`, `dem`) | nhịp bộ phát lịch | bộ quét `start` | tài liệu và từ điển. [thước CE: §9 của spec workflow — bảng chia việc DP2]
- Trục B · trạng thái đợt: không đợt | nhap | dang-chay | tam-dung | dang-dong | đã đóng | đợt cũ (không `dieu-khien.json`). [thước CE: §3 của spec workflow + fixture `dot-crm-0910`]
- Trục C · nguồn đợt: gói qua cấu hình | gói qua `--goi` | không gói (dựng tay) | gói + `nguon_hang` có khối lộ trình | gói + `nguon_hang` mà khối vắng/hỏng. [thước CE: §4.1 + §14 chỗ nối 1]
- Trục D · máy: một đợt | hai kho cùng máy. [thước CE: §16 T6]

Phân loại:
- **Core:** A=lệnh người → AC-1 · C=gói → AC-2 · C=không gói → AC-3 · B=bảng chuyển → AC-4 · B×nhịp → AC-5 · chẩn đoán → AC-6 · đổi kế hoạch → AC-7 · C=nguon_hang → AC-8 · thẻ khởi tạo/đóng → AC-9 · D=hai kho → AC-10 · A=start → AC-11 · ba bề mặt một hàm → AC-12 · đếm → AC-13 · tài liệu → AC-14 · không vỡ DP1 → AC-15.
- **Later:**
  - Khung trạng thái trong app (lớp mod) — DP6, mốc 01/11.
  - Chính sách hạn mức trong thẻ khởi tạo — DP4 (spec §4.3, §4.5).
- **Never:**
  - B=đã đóng × đổi kế hoạch: đợt đóng không có bộ phát lịch, không có gì để áp.
  - Hệ điều hành ngoài macOS cho phần đo máy thật (như DP1).
- **Cross-cutting:** mọi lệnh CLI chạy lại được (nguyên tắc 4 của spec) — vế «chạy lần hai không sinh thêm gì» nằm ở AC-2 (`mo`), AC-4 (`pha` cùng pha), AC-6 (`chan-doan` không ghi), AC-7 (năm lệnh đổi kế hoạch), AC-13 (một sự kiện mỗi lần chuyển).

## Out of scope

- `/dieu-phoi:tiep-tuc`, nhịp sống của phiên, lệnh con ghi qua CLI cho thợ, đánh thức giám sát — DP3.
- Bàn giao, đọc mức dùng, ngưỡng hạn mức trong thẻ khởi tạo, hai trạng thái ★ — DP4.
- Lớp mod (khung trạng thái, chặn S4 bằng mod) — DP6.
- Khối «Trong đợt» của feature-loop, brainstorm trả lời từ ô — DP7.
- Bốn lỗ lõi trong hạt giống `docs/plans/2026-10-10-hat-giong-loi-dieu-phoi-chuyen-nguyen-tu-crm.md` — không vá ở hàng này.
- Thao tác của app (Monitor, lịch 30′, nhóm thanh bên, chip) chỉ có trong thân lệnh người; không phép đo máy nào chạy chúng.

## Notes

- Năm chỗ chọn ở design doc §3 là lựa chọn máy trong khung đã duyệt; mỗi chỗ có một dòng sổ quyết định.
- Ca LB1/LB2 và bảng tên lệnh nằm ở acceptance-gate: đổi chúng là để tài liệu được nhắc `/dieu-phoi:…`, không đổi hành vi lệnh nào khác.
