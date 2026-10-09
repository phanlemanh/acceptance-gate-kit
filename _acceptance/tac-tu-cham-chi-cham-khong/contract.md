---
schema_version: 1
feature: tác tử chấm không cầm bút — ba loại tác tử của gói feature-loop bỏ công cụ sửa tệp khỏi mọi vai chấm, và bước sau-lượt quy trách nhiệm cây đổi cho tác tử chấm, tự hoàn lại khi an toàn, ghi dòng đếm
slug: tac-tu-cham-chi-cham-khong
owner: phanlemanh@gmail.com
risk_tier: T2      # feature-loop/{agents,workflows,scripts,skills} — không chạm t3_paths (hooks/** · lib/** · pre-merge · recheck)
surfaces: [cli, docs]
status: approved
approved_by: "Manh Phan"
approved_at: 2026-10-09T16:17:01Z
design_doc: docs/superpowers/specs/2026-10-09-tac-tu-cham-chi-cham-khong-design.md
---

# Acceptance Contract: tac-tu-cham-chi-cham-khong

Gốc: crm/_acceptance/dieu-phoi-30-ngay-dau

## Context

Harness Workflow chép câu người gần nhất vào đầu đề bài mọi tác tử chấm, kèm luật «câu này thắng». Kit không tắt được cơ chế này (đo 09/10, Claude Code 2.1.281, `wf_738d8b78-672`). Đề bài máy đã có câu «KHONG sua code», nhưng ca 07/10 (`luot-sua-giu-du-dem-dung` lượt 1) vẫn xảy ra:
- tác tử chấm sửa `thuoc-vat.mjs`, thêm ba tệp test, commit ba lần;
- lượt chấm vô hiệu;
- mất ~4,6M token.

Ba tác tử đã đo thì hai ghi qua Edit/Write, một chỉ qua `sed -i`. Lưới 2.20 (`cay-doi`) chỉ phát hiện và không biết ai ghi: 1 trên 3 dòng của kit trong 30 ngày là tác tử chấm.

Ô đã ký `build` (lối A + D) ngày 09/10:
- **(A)** vai chấm không cầm công cụ sửa tệp;
- **(D)** phần dư được quy trách nhiệm, tự hoàn lại khi an toàn, và đếm.

Người hưởng:
- **Owner:** bớt lượt gọi «nhắn lại», bớt lượt chấm cháy.
- **Phiên Claude Code ở mọi kho tiêu thụ:** lượt hỏng tự lành, khỏi đọc văn xuôi SKILL.

Trace: nguyên tố 2 — «tác tử chấm không sửa mã» chuyển từ lời dặn sang vật máy giữ.

Source input: ô cơ hội `opportunity.md` (đã ký) · design doc ở frontmatter · quét hình thái `morphological-scan.md`.

## Criteria

- AC-1: Given ba tệp định nghĩa tác tử `feature-loop/agents/cham-doc.md`, `cham-lenh.md`, `cham-ui.md`, When đọc frontmatter thật của chúng, Then với ma trận viết trước:
  - `cham-doc` có `tools` đúng bằng {Read, Grep, Glob};
  - `cham-lenh` có `tools` đúng bằng {Bash, Read, Grep, Glob};
  - `cham-ui` không có dòng `tools:` và có `disallowedTools` chứa đủ {Edit, Write, NotebookEdit};
  - `name` trong frontmatter đúng bằng tên tệp.

  Chiều đỏ có thông điệp ghim: bản sao thêm `Write` vào `cham-doc` → «AT1 cham-doc Write»; thêm `Edit` vào `cham-lenh` → «AT1 cham-lenh Edit»; gỡ `Edit` khỏi `cham-ui` → «AT1 cham-ui Edit».
- AC-2: Given bộ chấm `acceptance-verify.js` chạy dưới harness test với args phủ đủ 9 vai (`machine` · `baseline` · `ui` · `judge` · `finder` · `refute` · `triage` · `provenance` · `synthesize`), When ghi `opts` của mọi lời gọi tác tử, Then ma trận 9 vai:
  - judge, triage, synthesize mang `agentType: 'feature-loop:cham-doc'`;
  - machine, baseline, finder, refute, provenance mang `agentType: 'feature-loop:cham-lenh'`;
  - `ui` mang `agentType: 'feature-loop:cham-ui'`;
  - số lời gọi thiếu `agentType` bằng 0.

  Chiều đỏ: bản sao `agentT` bỏ `agentType` → «AT2 thieu agentType»; bản sao bảng đảo judge → `cham-lenh` → «AT2 judge».
- AC-3: Given cùng args và cùng câu trả lời giả, When chạy bộ chấm hiện tại và bản của tag `v2.26.0` (code lấy bằng `git show` trong lần chạy), Then ba thứ BẰNG NHAU: mảng đề bài theo thứ tự lời gọi, phán quyết, và các dòng run-log, tức lượt sạch không đổi từng byte. Đổi duy nhất được phép là trường `agentType` của `opts`. Bản sao chèn một ký tự vào đuôi đề bài máy cho đỏ «AT3 de bai».
- AC-4: Given câu trả lời giả ném `agent type '<loại>' not found` cho mọi lời gọi có `agentType`, When bộ chấm chạy, Then:
  - mỗi lời gọi bị báo «not found» được gọi lại ĐÚNG một lần, cùng đề bài, không `agentType`;
  - sau lần «not found» đầu tiên, mọi lời gọi khởi động SAU đó của lượt đi thẳng không `agentType` (không còn bị báo thất bại — bảng theo dõi chỉ hiện đợt đang bay lúc ấy; Cổng Bằng chứng 09/10 bổ sung);
  - phán quyết bằng lượt sạch;
  - run-log có đúng một dòng `loai-tac-tu-vang` mà tập khoá BẰNG tập khoá của khuôn marker LOAI-VANG-LINE (rút từ khối marker, Cổng Bằng chứng 09/10 bổ sung), liệt đúng các vai đã rơi;
  - kết quả có `loaiTacTuVang`.

  Chiều im: câu trả lời giả ném một lỗi khác thì KHÔNG gọi lại và không ghi dòng (hành vi cũ). Bản sao gọi lại với mọi lỗi cho đỏ «AT4 im». Bản sao không ghi dòng cho đỏ «AT4 dong». Bản sao bỏ cờ «cả lượt» cho đỏ «AT4 ca luot».
- AC-5: Given kho git do code sinh, args do `s4-args.mjs` THẬT sinh, và transcript fixture (bản trích nguyên văn tool_use của transcript thật 07/10 cộng dòng code sinh), When cây đổi trong lượt rồi chạy `thuoc-vat.mjs --write`, Then MỖI dòng `cay-doi` có ĐÚNG MỘT dòng `ghi-boi-tac-tu-cham` theo khuôn marker GHI-BOI-LINE ngay sau, mã thoát 6, và với ma trận viết trước:
  1. Edit tệp vật → `tac_tu` có đúng tác tử ấy, `cong_cu` chứa `Edit`.
  2. Write + `git commit` (bản trích thật) → `cong_cu` chứa `Write` và `Bash:git commit`.
  3. `sed -i` qua Bash → quy cho tác tử.
  4. Phiên tự sửa, không tác tử nào chạm → `tac_tu` rỗng, tệp ở `tep_khong_ro` (không đếm vào ngưỡng).
  5. Không có transcript nào → có khoá `khong_doc_duoc`, `tac_tu` rỗng.
  6. Vắng `--transcript`, transcript nằm dưới `HOME` giả → tự tìm và quy đúng như hàng 1.
  7. Tác tử chỉ `cat` tệp → không quy, tệp vào `tep_khong_ro`.
  8. Lệnh `cd <thư mục>` rồi `sed -i` tên trần → quy cho tác tử.
  9. `git -C . commit` → `cong_cu` chứa `Bash:git commit`.
  10. Thư mục dự án dưới `HOME` giả mang mã hoá KHÁC `--root` (cwd khác) → vẫn tự tìm và quy đúng.
  11. Tác tử `cp <tệp> /tmp/x` (tệp là NGUỒN) → không quy, tệp vào `tep_khong_ro` (Cổng Bằng chứng 09/10, Ngoài-1/5).
  12. Tác tử `git diff --merge-base main -- <tệp>` và `git log -- <tệp>` → không quy (Ngoài-1/5).
  13. Tệp đổi qua commit, tác tử chỉ chạy `git cat-file commit HEAD` → không quy, tệp vào `tep_khong_ro` (Ngoài-1).

  Chiều đỏ: bản sao bỏ mẫu ghi `GHI-RE` → «AT5 hang 7»; bỏ nhánh `cd` → «AT5 hang 8»; tính lệnh con git theo chuỗi con thay vì theo vị trí → «AT5 hang 12».
- AC-6: Given cùng fixture AC-5, When dòng `ghi-boi-tac-tu-cham` có `tac_tu` phủ MỌI tệp đổi, Then máy chỉ tự hoàn lại bằng ĐÚNG MỘT thao tác `git reset --keep <sha>` — không bao giờ ghi đè tệp chưa commit (Cổng Bằng chứng 09/10, Ngoài-1/4):
  - mọi thay đổi là commit chưa đẩy, cây làm việc sạch ở các tệp ấy → `hoan_lai: true`; cây sau bằng `sha` đã chấm; stderr có `da hoan lai`; `s4-args.mjs` lượt kế thoát 0 với `round` BẰNG round của lượt vô hiệu (không đếm trần — đối chứng dương ghim).
  - Mỗi hàng sau cho `hoan_lai: false` kèm `ly_do` ghim, và cây giữ nguyên như sau lượt:
    - commit đã có trên nhánh xa;
    - tệp bẩn sẵn trước lượt bị tác tử ghi đè;
    - lẫn thay đổi của phiên (`tep_khong_ro` không rỗng);
    - HEAD không còn `sha` làm tổ tiên;
    - có tệp đổi CHƯA commit (dù là của tác tử) → để phiên xử lý (Ngoài-1/4).

  Chiều đỏ: bản sao bỏ kiểm nhánh xa → «AT6 da day»; bỏ kiểm `cayChup.ban` → «AT6 ban san»; tăng round khi hoàn lại → «AT6 cung round»; cho phép hoàn lại tệp chưa commit → «AT6 chua commit».
- AC-7 (judgment): Given `feature-loop/skills/feature-loop/SKILL.md` mục S4 và design doc §3–§4, When người đọc lạ đọc, Then:
  - (a) lệnh `thuoc-vat.mjs --write` trong SKILL truyền `--transcript` bằng `transcriptDir` của kết quả Workflow;
  - (b) SKILL nói: stderr `da hoan lai` nghĩa là máy đã hoàn lại, sinh args lại cùng round và không hỏi; `hoan_lai: false` đi nhánh hai ca sẵn có;
  - (c) SKILL nói nghĩa của `loaiTacTuVang`: lượt chạy không có loại tác tử hẹp vì phiên mở trước khi cài gói; báo một dòng, không chặn;
  - (d) không câu nào trong phần sửa thêm lời dặn tác tử chấm «không sửa mã» làm nghiệm.

## Coverage

Quét Zwicky (preset test-matrix, trục dựng lại), đầy đủ ở `morphological-scan.md`.

- **Trục A — vai theo nhu cầu công cụ** [thước CE: bảng MODEL_ROUTES, 9 vai]: đọc-thuần · chạy-lệnh · ui → AC-1, AC-2 toàn phần.
- **Dạng giới hạn công cụ** [thước CE: `wf_1590a99c-ca6` + phiên chạy nền không đăng nhập được 09/10]: danh sách cho phép (đã chứng tác dụng) → `cham-doc`, `cham-lenh`; danh sách cấm (chưa chứng) → `cham-ui`, kèm phép kiểm có tên ở Notes.
- **Trục B — loại tác tử nạp được hay không** [thước CE: `wf_f9fd2939-efd`]: nạp → AC-2, AC-3; không nạp → AC-4.
- **Trục C — tác tử làm gì với cây** [thước CE: transcript 3 tác tử đo 09/10]: không ghi → AC-3; Edit/Write → AC-1, AC-5 hàng 1–2; ghi qua Bash → AC-5 hàng 3, 8, 9; chỉ đọc → AC-5 hàng 7.
- **Trục D — ai đổi cây** [thước CE: 3 dòng `cay-doi` 30 ngày]: tác tử → AC-5, AC-6; phiên → AC-5 hàng 4, AC-6 hàng lẫn; không rõ → AC-5 hàng 5, 10.
- `[GIẢ ĐỊNH]` Vai ui làm được việc lưu bằng chứng (ảnh, `network.txt`, `.html` dự phòng) qua Bash hay lệnh `capture.ui` khi không có Write. Đọc bằng mã đề bài, chưa chạy ở kho có eval ui. Đo ở chiến dịch phát hành (design doc §6).
- `[GIẢ ĐỊNH]` Thân định nghĩa tác tử tùy biến thay khung tác tử workflow mặc định mà không đổi chất lượng chấm. Đo ở chiến dịch phát hành.

## Đường đo

- G — lượt vô hiệu vì tác tử chấm ghi (ngưỡng SỐNG cần G = 0) · số từ: dòng `ghi-boi-tac-tu-cham` có `tac_tu` không rỗng trong `_acceptance/*/run-log.jsonl` của kit và các kho đã nhận mốc · AC-5.
- K — lượt không đọc được transcript (SỐNG cần K = 0; K > 0 là chưa đọc được, không phải sống) · số từ: dòng `ghi-boi-tac-tu-cham` có khoá `khong_doc_duoc` · AC-5 hàng 5.
- R — lượt chỉ có tệp không rõ chủ (R > 0 thì phiên nghiệm thu đọc từng dòng, tệp + transcript, trước khi tuyên) · số từ: dòng `ghi-boi-tac-tu-cham` có `tac_tu` rỗng, `tep_khong_ro` không rỗng, không `khong_doc_duoc` · AC-5 hàng 4, 7.
- Ghép cặp — mỗi dòng `cay-doi` có đúng một dòng `ghi-boi-tac-tu-cham` đi sau (SỐNG cần đủ cặp) · số từ: so hai loại dòng theo `round` + `luot_ts` · AC-5.
- V — lượt chạy không bảo vệ (không tính vào «0 lần») · số từ: dòng `loai-tac-tu-vang` · AC-4.
- N — mẫu số (SỐNG cần N ≥ 400) · số từ: dòng `round-tally` trong cửa sổ, TRỪ lượt có dòng `loai-tac-tu-vang` cùng `round` · không AC (dòng có sẵn, bộ chấm ghi mỗi lượt).
- Mốc bắt đầu cửa sổ · số từ: phép kiểm có tên ở Notes xanh trên phiên đầu tiên sau khi cài mốc · không AC (đo ở kho tiêu thụ, ghi vào hồ sơ mốc).

## Out of scope

- Lối B (hook theo `agent_id`) và lối C (chấm trên bản sao): lối mở lại khi ngưỡng chết vì ghi qua Bash (design doc §6).
- Tắt hay đổi câu chuyển tiếp của harness: không phải mã kit; đường đúng là `/feedback` gửi Anthropic.
- Mặt «bỏ chấm» (`cannotRun` vì đọc câu người thành lệnh dừng): giữ ở hạt giống `docs/plans/2026-09-21-hat-giong-tac-nhan-con-khong-doc-cau-nhan-cua-nguoi.md` việc 3.
- Tác tử S3 (`execute-parallel.js`): tác tử làm, phải ghi được.
- Thẻ Cổng Bằng chứng, lưới trước-merge, recheck đọc hai dòng sổ mới: lưới `cay-doi` sẵn có đã khoá lượt; hai dòng mới chỉ để đếm và báo.
- Bộ đọc ngưỡng tự động: phiên nghiệm thu đọc sáu số ở mục Đường đo.
- Tăng phiên bản gói: kit lên số theo mốc phát hành.

## Notes

- **Hạng T2:** mọi tệp sửa nằm dưới `feature-loop/` (`agents/` mới · `workflows/acceptance-verify.js` · `scripts/thuoc-vat.mjs` · `scripts/lib/ghi-boi.mjs` mới · `skills/feature-loop/SKILL.md`) và `tests/`. Không chạm `t3_paths`.
- **Kho tiêu thụ nhận qua mốc kế.** Không khoá cấu hình mới. Lượt sạch không đổi (AC-3). Phiên mở trước khi cài gói đi đường rơi có tên (AC-4).
- **Giới hạn đã khai, kèm ngưỡng đang đếm (design doc §6):**
  - Ghi qua Bash ở vai `cham-lenh`/`cham-ui`: ≥1 lượt vô hiệu trong cửa sổ → mở lối B/C.
  - Dạng lệnh ghi chưa phủ (biến môi trường, `xargs`, script gián tiếp): ≥1 dòng R mà đọc lại thấy là tác tử chấm → nới luật quy trách nhiệm.
  - Công cụ MCP có quyền ghi (chỉ còn ở `cham-ui`): ≥1 dòng R truy ra MCP.
  - Ca `sed -i` thật (21/09) nằm ở máy khác; hàng 3 dùng dòng code sinh.
  - Vai ui mất Write: ≥1 eval ui-check PASS → `cannotRun` vì lưu tệp.
  - Thân tác tử tùy biến: ≥1 kho đổi phán quyết mà vật không đổi.
- **Known limits (owner ký 09/10 tại Cổng Bằng chứng, lượt chấm 1):**
  - Ngoài-2: `--transcript` rỗng hoặc trỏ thư mục của lượt khác được ghi như đã đọc — số K (không đọc được) có thể thấp hơn thực tế.
  - Ngoài-3: AT3 so từng byte với `v2.26.0`; vòng sau đổi lời dặn bộ chấm sẽ làm nó đỏ và phải nâng mốc so.
  - Ngoài-6: kiểm cặp `cay-doi`/`ghi-boi` chỉ bằng vị trí và tên khoá, không so giá trị `round` · `luot_ts` · `sha` giữa hai dòng.
  - Ngoài-7: chiều đỏ AT5/AT6 ghim tên hàng, mà tên hàng cũng in khi hàng ném lỗi hạ tầng.
- **Phép kiểm có tên — chạy ở phiên đầu tiên mở sau khi cài mốc, TRƯỚC khi đếm cửa sổ:**
  - một workflow ba tác tử;
  - tác tử `feature-loop:cham-ui` và tác tử `feature-loop:cham-lenh` mỗi tác tử được bảo liệt kê công cụ rồi Write tệp X; mong: X không sinh, danh sách không có Edit/Write/NotebookEdit;
  - tác tử mặc định làm đối chứng; mong: X sinh.

  Phép này thay cho vế «dòng `loai-tac-tu-vang` vắng», vế ấy chỉ chứng loại nạp được. Dạng danh sách cấm của `cham-ui` chưa thử được trong vòng: phiên Claude Code chạy nền không đăng nhập được (09/10). Đỏ → sửa vật trước khi đếm.
- **Bảng dự báo năm dòng (luật (c)):**
  - làm-xong→quyết-được: ↓ ở ca có sự cố;
  - lượt gọi người/vòng: ↓ ở ca có sự cố (bỏ «nhắn lại», bỏ hoàn lại tay);
  - vòng bị hạ tầng đốt: ↓;
  - token/vòng: ↓ ở ca có sự cố (lượt cháy ngắn lại vì tác tử không sửa được qua Edit/Write); = ở lượt sạch;
  - phút/lượt: =.

  Điều kiện tin cậy: đường verdict (finder → refute → REJECT) không đổi thành phần, vì vai và đề bài giữ nguyên, chỉ đổi danh sách công cụ.
- Fixture do code sinh trong lần chạy. Riêng bản trích transcript 07/10 là vật thật của harness, không viết tay đúng khuôn bên đọc. Đường suy từ vị trí script. Bản sao để tiêm đột biến chụp trọn cây.
