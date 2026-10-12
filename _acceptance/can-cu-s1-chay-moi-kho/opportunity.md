---
schema_version: 1
slug: can-cu-s1-chay-moi-kho
feature: Bộ xếp căn cứ của bước thiết kế chạy được ở mọi kho tiêu thụ, và thẻ Cổng Phạm vi giữ đủ «vì sao chọn» + «sai thì tốn gì» của mọi lựa chọn bước thiết kế
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-11T14:43:38Z   # owner gõ «Tôi phê duyệt "làm" trước và dùng đúng làm chữ ký để đi tiếp» trong phiên 11/10 (trước khi thẻ được trình), máy ghi hộ
prototype:
  base_commit:
  disposition: archive
---

> Vòng SỬA mở 11/10 từ hai mục «mở hợp đồng mới» chủ kho ký ở Cổng Bằng chứng vòng
> `buoc-len-thiet-ke-khong-hoi` (A2). Hạt giống: `docs/plans/2026-10-11-hat-giong-can-cu-s1-o-kho-khach.md`.
> **Chặn mốc:** gộp vào main TRƯỚC khi cắt mốc kế (~14–15/10) — mốc ấy mang A2 tới crm.

## Vấn đề & ai gặp

Gốc: acceptance-gate-kit/_acceptance/buoc-len-thiet-ke-khong-hoi — `review-findings.md` lượt chấm 1, Ngoài-1 + Ngoài-3 (high, cùng một lỗi) và Ngoài-2 (medium); chủ kho định đoạt «mở hợp đồng mới» ở dòng sổ `d-20261011T143315Z-22` (câu gộp ký Cổng Bằng chứng 11/10)

**Ai gặp:** chủ kho ở Cổng Phạm vi của mọi vòng crm sau khi crm nhận mốc mang A2 · phiên
Claude Code chạy vòng ở crm (đọc lời dặn bước thiết kế) · và chính ngưỡng nghiệm thu của A2
(«0 lần máy dừng hỏi ở bước thiết kế của crm trong ba vòng liền») — đo ở crm, nên lỗi 1 làm
nó không đo được.

1. **Ngoài-1 / Ngoài-3 (nặng):** lời dặn bước thiết kế của feature-loop gọi bộ xếp căn cứ bằng
   đường TƯƠNG ĐỐI — `node scripts/can-cu-s1.cjs`, ở hai chỗ (lời dặn «lật ở Cổng Phạm vi» và
   điều kiện dừng của S1 mục 5). Đường đó chỉ có trong kho kit.
   **Đo 11/10 trên checkout crm** (`eaf0886d5`): lệnh y nguyên lời dặn thoát **1** kèm
   «Cannot find module …/crm/scripts/can-cu-s1.cjs» — cùng mã thoát mà lời dặn đọc là «sổ còn
   dòng đỏ». Hệ quả: mọi vòng crm dừng ở Cổng Phạm vi (mất làn V), hoặc phiên bỏ qua bước kiểm
   và lưới chặn câu chỉ-người-biết không chạy. Cùng bộ xếp ấy, gọi bằng đường tuyệt đối tới cây
   kit, chạy sạch trên crm (`--dem` in dòng cho mọi hồ sơ, thoát 0) — vật đúng, chỉ đường gọi sai.
   Bản đang cài (2.26.0) chưa mang tệp này: lỗi sẽ lộ ngay mốc kế.
2. **Ngoài-2 (vừa):** thẻ Cổng Phạm vi (`scripts/gate-card.js`, hai khối «Câu chỉ anh trả lời
   được» và «Máy đã quyết ở bước thiết kế — anh lật được») in dòng sổ mang `can_cu` mà BỎ vế
   «vì sao» (`why`) và vế «sai thì tốn gì» (`cost_if_wrong`). Trái ADR 0021 (một dòng sổ ra một
   dòng thẻ đủ ba vế — khối `DEC-BA-VE`) và trái chính lời ADR 0022 («ba câu người đọc giữ
   nguyên»). Người được mời lật quyết định đúng ở chỗ đó mà thiếu giá của việc chọn sai.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Bộ giải gói (`resolve-plugin.mjs`) tìm được bản acceptance-gate mang bộ xếp ở kho tiêu thụ, như mọi lời dặn khác của cùng SKILL đang làm | lệnh vẫn không chạy ở crm | ca dựng kho thử không có `scripts/` của kit + bộ nhớ đệm giả trỏ cây đang kiểm, chạy đúng lệnh rút từ SKILL | Chưa thử — đo ở S4 |
| 2 | «Không chạy được» tách khỏi «sổ đỏ» bằng dòng tổng kết của bộ xếp, không bằng mã thoát | phiên lại đọc lỗi hạ tầng thành dòng đỏ | lệnh bản tương đối trên kho thử: thoát 1, không có dòng tổng kết | **Đã thử 11/10:** crm thoát 1, không dòng tổng kết |
| 3 | Thêm hai vế vào hai khối của thẻ không đổi màu hồ sơ cũ (dòng không `can_cu`) | hồ sơ đã ký đổi thẻ dưới chân | dựng thẻ trên hồ sơ không `can_cu` trước/sau | Chưa thử — đo ở S4 |

## Ngưỡng chết / ngưỡng UAT

Ngưỡng của vòng này là ĐIỀU KIỆN CẦN của ngưỡng A2 đã ký (A2 đo ở crm) — máy suy từ ô
`buoc-len-thiet-ke-khong-hoi` và câu gộp ký 11/10 («gộp trước mốc kế»); chủ kho ký «làm» trước
khi thấy bảng này, cửa veto mở.

- Câu hỏi phép đo trả lời: ở vòng crm đầu tiên sau khi crm nhận mốc mang bản sửa, lệnh kiểm sổ của bước thiết kế có chạy được không, và thẻ Cổng Phạm vi có hiện đủ «vì sao» + «sai thì tốn» cho mọi lựa chọn bước thiết kế không?
- Kết quả nào là SỐNG: lệnh in dòng tổng kết của bộ xếp (không «không tìm thấy»); Cổng Phạm vi của vòng ấy chỉ dừng khi sổ có câu chỉ-người-biết hoặc dòng đỏ thật; thẻ in hai vế cho mọi dòng S1 mang căn cứ
- Kết quả nào là CHẾT: vòng crm đầu tiên sau khi nhận mốc vẫn báo không tìm thấy bộ xếp, hoặc dừng Cổng Phạm vi vì đọc lỗi hạ tầng thành sổ đỏ, hoặc thẻ thiếu một trong hai vế
- Timebox: vòng crm đầu tiên sau khi crm cài mốc kế (~14–15/10); trễ nhất 2026-11-01 (timebox của A2)

## Kết quả prototype

Không dựng prototype — hai lỗi đã gọi tên, có đo tái hiện trên checkout crm (mục trên).

## Nguồn ngoài & phạm vi kế thừa

Không có vật liệu ngoài kho — mọi căn cứ là hồ sơ A2, ADR 0021/0022 và mẫu lệnh có sẵn trong
cùng SKILL (`S0-MO-O`: `AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" …) && node "$AG/scripts/…"`).

## Cổng 0

- **decision = build** Căn cứ: chủ kho ký «làm» trong phiên 11/10; hai lỗi chặn mốc kế.
- **disposition = archive** Căn cứ: không có prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** như mục Ngưỡng (máy suy từ ngưỡng A2 đã ký).

## Thước đo thành công → ứng viên criterion

- Lệnh kiểm sổ rút nguyên văn từ SKILL chạy được trên một kho KHÔNG phải kit → AC.
- Không còn lời gọi `node scripts/…` tương đối nào trong SKILL feature-loop → AC (quét lớp).
- Lệnh không chạy được không bị đọc thành sổ đỏ → AC.
- Thẻ Cổng Phạm vi in «vì sao» + «sai thì tốn» cho dòng S1 mang căn cứ; hồ sơ cũ không đổi → AC.

## Out of scope từ khám phá

- Sửa ca DP7-08 (tệp ca của gói điều phối, máy M5) — vòng này dùng lại PHƯƠNG PHÁP của nó, không sửa tệp.
- Năm mục Ngoài-4..8 của A2 — chủ kho đã định đoạt «ghi Known limits», không mở lại.
- Câu gộp «duyệt; Hỏi-n = lối» — hàng riêng đã hoãn ở A2 (`d-20261011T093912Z-13`).
