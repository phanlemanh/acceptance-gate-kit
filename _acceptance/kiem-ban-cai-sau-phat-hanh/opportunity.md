---
schema_version: 1
slug: kiem-ban-cai-sau-phat-hanh
feature: Mỗi bản kit vừa cắt được cài đúng tag vào một kho giả lập sạch và chạy thử một vòng trước khi phát tới kho thật
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: KC1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng KC1 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).

Gốc: acceptance-gate-kit/_acceptance/release-2-27-0 — `run-log.jsonl` dòng 25 và 58 (`"kind":"loai-tac-tu-vang"`, «agent type 'feature-loop:cham-lenh' not found»): tác tử chấm của A1 chưa chạy sống lần nào vì bản cài thiếu `agents/`; M5 xác nhận 12/10 bản «2.27.0» cài được là mã main 294b29d, không phải tag a1e2e0b9.

**Ai gặp:** chủ kho của mỗi kho tiêu thụ (crm, radar, OneFlow…) — nhận một mốc mà thứ cài về KHÔNG phải thứ đã chấm; và chính kit — mốc 2.27 hứa A1 mà 38 lượt / 17 hồ sơ vẫn đi đường rơi. Hai lỗi đều chỉ lộ SAU khi kho thật đã cài.

**Máy đo 13/10 (cây v2.28.0 = 72eb55f3, Claude Code 2.1.281):**
1. Cài vào một cấu hình Claude CÁCH LY (`CLAUDE_CONFIG_DIR` tạm) từ `git archive v2.28.0` chạy được, 1,5 giây, không cần đăng nhập; bản cài khớp tag 4 032/4 032 tệp (gói gốc) và trọn `feature-loop/` (có `agents/`).
2. Tái hiện ca M5: sửa một tệp nguồn rồi `marketplace update` + `plugin update` → báo «already at the latest version (2.28.0)» mà bộ đệm GIỮ nội dung cũ; chỉ gỡ rồi cài mới làm mới. Bộ đệm khoá theo số phiên bản, và chợ plugin của kit là kiểu THƯ MỤC trỏ bản checkout chính → thứ cài về là cây đang checkout lúc cài, không phải tag.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Cài vào cấu hình cách ly bằng CLI thật không chạm cấu hình/bộ đệm thật của máy | kiểm làm hỏng bản cài của máy đang chạy vòng | băm `installed_plugins.json` thật trước/sau | **Đã thử 13/10:** chạy dưới `CLAUDE_CONFIG_DIR` tạm — đo lại trong ca |
| 2 | «Bản cài khác tag» bắt được bằng so nội dung bản cài với cây của tag | lỗi kiểu M5 lọt | tiêm một tệp lệch vào nguồn cài | **Đã thử 13/10:** cập nhật giữ nội dung cũ, so nội dung thấy lệch |
| 3 | Thiếu tác tử chấm bắt được không cần mở phiên Claude thật: mọi loại tác tử workflow ĐÃ CÀI gọi tên phải có tệp định nghĩa trong CHÍNH bản cài | lỗi nạp tác tử ở tầng Claude Code lọt | gỡ `feature-loop/agents/` khỏi nguồn cài | Chưa thử — đo ở S4 |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] ở mốc kế (2.29.0) và các mốc sau, có lỗi kiểu «bản cài khác tag» hay «thiếu thư mục gói» nào tới kho thật không?
- Kết quả nào là SỐNG: [đề xuất] mốc 2.29.0 cắt với lệnh kiểm bản cài XANH trên tag; mọi lỗi lớp ấy (nếu có) đỏ ở kho giả lập TRƯỚC khi phát; máy nhận đầu tiên (crm) chạy kiểm-máy sau khi cài → mọi bản ghi khớp tag.
- Kết quả nào là CHẾT: [đề xuất] một kho thật cài 2.29.0 mà thiếu thư mục gói hoặc lệch tag trong khi lệnh kiểm xanh; hoặc lệnh kiểm không chạy được ở lúc cắt số.
- Timebox: [đề xuất] 2026-10-16 (mốc Phát hành 2.29.0); đọc lại ở lần crm nhận 2.29.0.

## Kết quả prototype

Không dựng prototype — hai phép thử máy ở trên thay chỗ (đường cài cách ly chạy được; ca bộ đệm cũ tái hiện được).

## Nguồn ngoài & phạm vi kế thừa

Không vật liệu ngoài kho. Đường cài dựa vào CLI `claude plugin` (marketplace add · install · list --json) — hành vi bộ đệm đo ở trên trên bản 2.1.281.

## Thước đo thành công → ứng viên criterion

- Cài đúng tag vào kho giả lập sạch do code sinh, không chạm máy thật → AC.
- Bản cài nguyên vẹn → mọi mục XANH (đối chứng dương) → AC.
- Thiếu `agents/` → ĐỎ ghim «thiếu thư mục gói» + «tác tử chấm vắng» → AC.
- Bản cài lệch tag → ĐỎ ghim tên tệp → AC.
- Vòng chạm: thẻ cổng · lưới trước-gộp · gói dieu-phoi chạy từ bản cài → AC.
- Kiểm bản cài thật trên máy (ca M5) → AC.
- Lỗi chạy được nói ra, không bao giờ xanh → AC.
- Răng phát hành: mọi lượt chấm của kit chạy kiểm trên HEAD; sau cắt tag chạy trên tag → AC.

## Out of scope từ khám phá

- Ba hạt giống 13/10 (KK-8 cây bẩn · ca Chrome chập chờn · thẻ đổi chữ khi dựng song song) — không trace thẳng về ý định cài-đúng-tag.
- Sửa chợ plugin kiểu thư mục thành kiểu git (đổi cách mọi máy cài) — đổi mặc định, mọi kho trả giá; vòng này chỉ ĐO và CHẶN.
- Chạy kiểm trên CI GitHub (runner không có CLI `claude`).
