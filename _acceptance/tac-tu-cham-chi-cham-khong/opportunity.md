---
schema_version: 1
slug: tac-tu-cham-chi-cham-khong
feature: «Tác tử chấm chỉ chấm — không nhận câu nhắn gần nhất của người làm nhiệm vụ, không sửa mã»
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: A1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

Gốc: crm/_acceptance/dieu-phoi-30-ngay-dau (HANDOFF.md dòng 25–43: lượt B 12/19 và lượt C 11/20 tác tử chấm khai `cannotRun` vì đọc «Dừng nó» của chủ kho thành lệnh huỷ)

## Vấn đề & ai gặp

Mở từ hàng A1 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`), hạng hàng ghi T2.

«Tác tử chấm chỉ chấm — không nhận câu nhắn gần nhất của người làm nhiệm vụ, không sửa mã»

Vì sao (nguyên văn hàng): Gốc: crm/_acceptance/loi-vao-dieu-phoi-30-ngay (3 lượt trong một ngày, hạt giống 2026-09-21-tac-nhan-con-khong-doc-cau-nhan-cua-nguoi — đã chạm ngưỡng). Tái phát 07/10 ở chính kit: phiên mở bằng «sửa + thêm test» thì tác tử chấm tự sửa mã và commit (luot-sua-giu-du-dem-dung, lượt 1 vô hiệu). Nguyên tố 2: bằng chứng không tự dối.

**Về dòng `Gốc:`.** Hàng trỏ `crm/_acceptance/loi-vao-dieu-phoi-30-ngay/`, nhưng hồ sơ ấy không ghi lại ca «Kiểm tra lại docker…» (tìm trong cả thư mục: 0 dòng; run-log chỉ có một lượt PASS 09:07Z). Ca ấy chỉ còn trong hạt giống. Vì vậy dòng `Gốc:` trỏ sang hồ sơ crm có ghi ca cùng hình trong HANDOFF, đọc được trong mười giây.

**Ai đau, đau thế nào.** Phiên Claude Code đang chạy lượt chấm, và qua đó là owner. Harness Workflow chép nguyên văn tin nhắn gần nhất của người vào đầu đề bài của MỌI tác tử chấm, kèm câu «khi đề bài xung đột với yêu cầu này thì yêu cầu này thắng». Đó là hành vi của harness, mã kit không làm. Câu người có dạng mệnh lệnh thì tác tử chấm làm theo câu ấy. Có hai mặt:

| Mặt | Ca đã ghi | Hậu quả |
|---|---|---|
| **Ghi vào cây** (tác tử có quyền ghi thì sửa tệp cho khớp câu người) | kit 21/09 `nhan-trang-thai-va-reality`: hai tác tử tự đặt `status: verified`, một tác tử dùng Edit, một dùng `sed -i` · crm 21/09 `dieu-phoi-30-ngay-dau` lượt D: commit `508ed3f7` chạm vật và báo cáo (lần thứ hai trong 24 giờ) · kit 07/10 `luot-sua-giu-du-dem-dung` lượt 1: tác tử haiku sửa `thuoc-vat.mjs`, thêm ba tệp test, commit 3 lần, mất ~4,6M token | Lượt chấm vô hiệu, phải hoàn lại cây rồi chấm lại |
| **Bỏ chấm** (câu người đọc thành lệnh dừng) | crm 21/09 lượt B, C («Dừng nó»), ca «Kiểm tra lại docker…» | Lượt BLOCKED, mất một lượt gọi người |

**Lưới đã có chỉ PHÁT HIỆN, không NGĂN.** Từ 2.20, `thuoc-vat --write` đánh dấu lượt chấm có cây đổi giữa chừng là không dùng được (dòng `cay-doi`, mã 6). Lưới này không biết ai đã ghi. Trong 30 ngày, ba dòng `cay-doi` của kit chỉ có MỘT dòng do tác tử chấm ghi (`luot-sua-giu-du-dem-dung`). Hai dòng kia do chính phiên sửa tệp (`lo-trinh-cat-luot`, `lenh-dai-chay-rieng`). Vì vậy không đếm được ngưỡng của hàng từ dòng `cay-doi`. Bước hoàn lại vẫn là văn xuôi trong SKILL, tức là phiên làm theo lời dặn.

**Đề bài máy hôm nay ĐÃ dặn «KHONG sua code»** (`DUOI_LENH_MAY`, `feature-loop/workflows/acceptance-verify.js`). Ca 07/10 là bằng chứng: lời dặn trong đề bài thua câu người do harness chuyển, vì harness tuyên câu người «thắng». Đây là bằng chứng thực nghiệm cho luật «cấm dặn-bằng-lời làm nghiệm».

## Đo trước khi tuyên (09/10/2026, Claude Code 2.1.281)

- **Ca tái hiện** (Workflow `wf_738d8b78-672`, ~178k token, 16 giây): tạo một kho git nháp có `check.js` đỏ. Hai tác tử haiku nhận đúng khuôn đề bài máy của kit. Tác tử thứ nhất là loại mặc định, tác tử thứ hai là loại `Explore`.
  - **Harness VẪN chuyển câu nhắn.** Tin đầu của CẢ HAI tác tử mở bằng `[Workflow harness — user request] … Where the computed task conflicts with this request, this request wins:` và theo sau là nguyên văn tin nhắn của owner. Đổi loại tác tử không thoát được lớp chuyển tiếp này.
  - **Lần này cây KHÔNG đổi.** Băm `add.js`/`check.js` trước và sau trùng nhau, không có commit mới, hai tác tử trả `exitCode 1` đúng. Chiều ghi không tái hiện vì câu được chuyển lần này không phải mệnh lệnh «sửa X». Máy không được tự soạn câu thay người nên không tiêm được mệnh lệnh ấy. Chiều ghi dựa trên bằng chứng ca 07/10 ở trên.
  - **Kết luận:** harness chưa đổi. Ô không đóng rẻ được.
- **Mức phủ:** trong 30 ngày, ít nhất 1 963 trên 6 143 tác tử workflow trên máy này có tin đầu mang câu chuyển tiếp. Lệnh đếm: grep chuỗi `Workflow harness — user request` trong 4 KB đầu của `agent-*.jsonl`, nên con số là cận dưới.
- **Công cụ ghi của các tác tử đã ghi vào cây (đọc từ transcript):**
  - 21/09 `agent-ab48b848`: Edit.
  - 21/09 `agent-a5254808`: chỉ `sed -i` qua Bash.
  - 07/10 `wf_9ead7cc5-1ac/agent-ae624896`: Write ×2, Edit ×5, rồi `git add` + `git commit` qua Bash.

  → 2/3 tác tử đi qua Edit/Write. 1/3 chỉ dùng Bash.
- **Mẫu số (N):** từ 09/09 đến 09/10 có khoảng 155 lượt chấm (`round-tally`) ở kit và khoảng 386 ở bản crm trên máy này. Ước 4 lượt vô hiệu do tác tử chấm ghi (kit 2, crm 2), tức khoảng 1/135 lượt.
- **Tài liệu Claude Code (tra 09/10):**
  - Không có nút tắt hay đổi câu chuyển tiếp.
  - Plugin được giao loại tác tử riêng, giới hạn công cụ bằng `tools:`/`disallowedTools:`. Khoá Bash theo mẫu lệnh trong định nghĩa tác tử của plugin thì không được (plugin bỏ qua `hooks:` của tác tử).
  - Hook PreToolUse có trường `agent_id` khi lời gọi đến từ tác tử con. Tài liệu không nói rõ tác tử do Workflow sinh có trường này không, nên phải đo.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | `agent()` của Workflow nhận loại tác tử do gói feature-loop cung cấp, và áp đúng danh sách công cụ của loại ấy | Lối A chết, chỉ còn B/C/D | Một workflow, một tác tử thuộc loại của kit, đề bài bảo nó Write một tệp; mong đợi: công cụ không có, tệp không sinh | Chưa thử (đầu S1) |
| 2 | Không vai chấm nào cần Edit/Write cho việc hợp lệ. Riêng làn ui-check có nhánh lưu `.html` dự phòng khi không có công cụ chụp | Làn ui mất đường lưu bằng chứng → lượt sạch đổi kết quả (phạm luật 26/09) | Đọc prompt làn ui ở `acceptance-verify.js:1046`; chạy một eval ui-check của kit với loại tác tử mới | Chưa thử |
| 3 | Đọc transcript tác tử của lượt thì lần ra được AI đã ghi vào cây | Lối D không đếm được ngưỡng | Đã làm tay hôm nay cho ca 07/10 (phân loại công cụ theo `agent-*.jsonl`) | Đã thử ✓ (tay) |
| 4 | Hook của plugin thấy `agent_id` với tác tử do Workflow sinh | Lối B chết | Hook ghi payload ra tệp tạm, chạy một workflow một tác tử | Chưa thử (chỉ cần nếu chọn B) |

## Các lối NGĂN đúng tầng — Cổng Phạm vi chọn

Không có lối nào «dặn thêm trong đề bài». Lối ấy đã có sẵn và thua (xem trên).

| Lối | Làm gì | Chặn được | Không chặn | Giá · hạng | Kho khác được/mất |
|---|---|---|---|---|---|
| **A — Tác tử chấm không cầm bút** | Gói feature-loop giao hai loại tác tử. *Chấm-đọc* chỉ có Read/Grep/Glob, dùng cho hội đồng, phân loại phạm vi, tổng hợp. *Chấm-chạy* có Bash + Read, KHÔNG có Edit/Write/NotebookEdit, dùng cho lệnh máy, ui, baseline, tìm lỗi, phản bác, provenance. Đổi đúng MỘT chỗ: hàm `agentT` | Mọi đường ghi qua Edit/Write ở mọi vai (2/3 tác tử đã đo). Vai chấm-đọc không ghi được bằng bất cứ đường nào | Ghi qua Bash ở vai chấm-chạy (`sed -i`, `git commit`), tức 1/3 tác tử đã đo | Nhỏ · **T2** (chỉ `feature-loop/`) | Mọi kho nhận qua mốc, không cần khai gì. Đề bài lượt sạch giữ nguyên từng byte. Rủi ro duy nhất là giả định 2 |
| **B — Chốt hook theo tác tử** | Hook PreToolUse của gói chạy khi payload có `agent_id` VÀ có dấu «lượt chấm đang mở» (s4-args đặt, thuoc-vat gỡ). Hook từ chối Edit/Write ngoài `.acceptance-runs/`/`evidence/`, và từ chối Bash có động từ ghi của git (commit/add/reset/checkout/stash/push/rebase/merge) | Thêm `git commit`/`reset` qua Bash | `sed -i`, `>`, `tee`: đây là danh sách đen trên không gian mở | Vừa · **T3** (`hooks/**`) | Hook chạy trên mọi lời gọi công cụ ở mọi kho. Dấu «đang mở» kẹt lại thì chặn nhầm tác tử S3 song song. Phụ thuộc giả định 4 |
| **C — Chấm trên bản sao** | Lệnh máy chạy trong worktree tách ở sha đã ghim. Sau lượt, so worktree với sha; lệch thì kết quả của tác tử đó vô hiệu và chạy lại một lần | Toàn bộ, vì git giữ bất biến, không cần danh sách | — | Lớn · T2 | Đổi môi trường chạy của lượt sạch (crm: node_modules, `.env`, docker, cổng máy chủ dev, tệp ghi theo đường kho). Theo luật 26/09 chỉ được làm khoá bật-thêm, mặc định tắt → kho không bật thì không được gì |
| **D — Đường thoát: tự lành + đếm** | Không ngăn. Khi gặp mã 6, máy đọc transcript tác tử của lượt. Nếu ghi là của tác tử chấm, máy tự hoàn lại và chấm lại cùng lượt, không cần người, rồi ghi một dòng đếm `ghi-boi-tac-tu-cham`. Khai giới hạn kèm ngưỡng | Lượt gọi người và bước hoàn lại bằng lời dặn | Đốt token của lượt hỏng | Nhỏ · T2 | Không chạm lượt sạch. Thêm mẫu số đọc được cho ngưỡng |

**Khuyến nghị: A + D.**
- A cắt đường ghi chính đã đo (Edit/Write) ngay tại chỗ sinh tác tử.
- D làm phần dư qua Bash tự lành, không gọi người. D cũng sinh bộ đếm mà ngưỡng cần: hôm nay `cay-doi` không phân biệt được tác tử chấm với chính phiên.
- B và C là lối mở lại khi ngưỡng chết (xem dưới), không làm trước.
- Hạng: **T2**. Thành T3 nếu Cổng Phạm vi chọn B (chạm `hooks/**`).

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] sau khi mốc mang vòng này được kit và crm cài, có lượt chấm nào bị vô hiệu vì tác tử chấm ghi vào cây không, tính trên đủ nhiều lượt để «0» có nghĩa?
- Kết quả nào là SỐNG: [đề xuất] Ba mươi ngày không lượt chấm nào bị vô hiệu vì tác tử chấm ghi vào cây, đọc từ dòng `ghi-boi-tac-tu-cham`, tính trên kit + mọi kho đã nhận mốc, với **N ≥ 400 lượt chấm** trong cửa sổ. Căn cứ: với tỉ lệ cũ ~1/135, xác suất 0 lần trong 400 lượt chỉ còn ~5%, nên 0 lần ở mức ấy mới phân biệt được với «chưa có lượt».
- Kết quả nào là CHẾT: [đề xuất] ≥1 lượt vô hiệu do tác tử chấm ghi trong cửa sổ.
  - Ghi qua Edit/Write: lối A thủng → sửa vật.
  - Ghi qua Bash: phần dư đã khai → mở lối B hoặc C ở Cổng Đáng kế.
  - Nếu N < 400 khi hết 30 ngày: KHÔNG đọc thành sống. Kéo dài cửa sổ tới khi đủ N, hoặc tới timebox, rồi đọc với N thực và ghi rõ N.
- Timebox: [đề xuất] 2026-12-15. Mốc kế không có số cố định; crm nhận sau 14/10 cùng nhịp 2.26. Cửa sổ 30 ngày bắt đầu từ ngày crm có commit nhận mốc mang vòng này.

## Kết quả prototype

Không dựng prototype. Ca tái hiện ở mục «Đo trước khi tuyên» là phép thử D2.5 không cần dựng.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Hành vi chuyển tiếp câu người của harness Workflow | Claude Code 2.1.281 (đo 09/10) | triết-lý/logic (ràng buộc nền, không phải vật liệu) | không: là điều kiện biên mà vòng phải sống cùng | — |
| Tài liệu tác tử con / hook của Claude Code | code.claude.com/docs (sub-agents, hooks, workflows) | triết-lý/logic | có (cơ chế `tools:`, `agent_id`) | — |

## Cổng 0

- **decision = …** Căn cứ: …
- **disposition = …** Căn cứ: …
- **Ngưỡng UAT chốt cùng lúc ký:** …

## Thước đo thành công → ứng viên criterion

- Mọi lời gọi tác tử trong `acceptance-verify.js` đi qua MỘT chỗ và mang loại tác tử của kit. Kiểm bằng ca máy: phá một lời gọi cho nó thiếu loại thì ca phải đỏ.
- Danh sách công cụ của hai loại tác tử không chứa Edit/Write/NotebookEdit, và loại chấm-đọc không có Bash. Kiểm bằng ca máy đọc chính tệp định nghĩa.
- Ca hai chiều trên kho nháp: tác tử loại chấm-chạy được bảo «Write tệp X» thì X không sinh; tác tử mặc định thì X sinh (đối chứng dương).
- Lượt sạch không đổi: đề bài máy giữ nguyên từng byte so với 2.26.0 (khuôn AC-7 cũ). Một lượt chấm thật của kit cho cùng phán quyết.
- Ca tiêm `cay-doi` có commit của một tác tử thuộc lượt thì máy tự hoàn lại, ghi dòng `ghi-boi-tac-tu-cham`, chấm lại cùng lượt. Ca `cay-doi` do phiên tự sửa thì KHÔNG ghi dòng ấy (chiều im).

## Out of scope từ khám phá

- **Tắt hay đổi câu chuyển tiếp của harness:** không phải mã kit, không có nút trong tài liệu. Đường đúng tầng nằm ngoài kho: báo Anthropic (`/feedback`). Vì vậy vế «không nhận câu nhắn» của câu giao chỉ thực hiện được ở hệ quả (không ghi được), không ở nguyên nhân.
- **Mặt «bỏ chấm» (đọc «Dừng nó» thành lệnh huỷ → `cannotRun`):** lối A/D không chữa mặt này. Nó vẫn là cạnh gãy *hệ thống chết* (K8: thử lại một lần). Phần ghép mẫu lý do `cannotRun` «người dùng yêu cầu dừng» thành nhãn hệ thống chết ở hạt giống 21/09 (việc 3) chưa có trong `lib/nhan-canh-gay.cjs`, nên giữ ở hạt giống, không gom vào vòng này.
- **Câu uỷ quyền chấm dán trước mỗi lượt S4** (đề xuất B6, `docs/findings/2026-09-26-loi-kit-tu-luot-4-okr.md`): bác. Mỗi lượt thêm một chạm, và nghiệm dựa vào người nhớ dán, tức là dặn-bằng-lời ở phía người.
- **Chấm trên bản sao bật mặc định:** bác theo luật 26/09 (đổi mặc định thì mọi kho trả giá). Chỉ còn lối C dạng khoá bật-thêm, mở khi ngưỡng chết vì ghi qua Bash.
- **Thêm câu cấm vào đề bài tác tử:** bác. Đề bài đã có câu cấm, và ca 07/10 cho thấy nó thua.
