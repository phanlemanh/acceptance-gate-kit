# Thiết kế — tác tử chấm không cầm bút (tac-tu-cham-chi-cham-khong)

**Ngày:** 2026-10-09 · **Hạng:** T2 · **Hồ sơ:** `_acceptance/tac-tu-cham-chi-cham-khong/`
**Đầu vào:** ô cơ hội đã ký `build` 09/10, lối A + D (`opportunity.md`). Ô ấy có số đo, các lối bị bác, và ngưỡng.

## 1. Ý định (chốt ở Cổng Đáng, không đổi trong vòng)

Lượt chấm không được bị tác tử chấm ghi vào cây. Cơ chế gây ra: harness Workflow chép câu người gần nhất vào đầu đề bài mọi tác tử chấm, kèm luật «câu này thắng». Kit không tắt được cơ chế này (đo 09/10, Claude Code 2.1.281). Đề bài máy đã có câu «KHONG sua code» và đã thua ở ca 07/10.

Vì vậy nghiệm phải là VẬT, không phải LỜI:
- **(A)** tác tử chấm không cầm công cụ sửa tệp;
- **(D)** phần dư (ghi qua lệnh shell) được máy quy trách nhiệm, tự hoàn lại, và đếm.

Ngưỡng: 30 ngày không lượt chấm nào vô hiệu vì tác tử chấm ghi vào cây, đếm trên N ≥ 400 lượt chấm.

Người hưởng:
- **Owner:** bớt lượt «anh nhắn lại một câu» và bớt lượt chấm cháy (ca 07/10: ~4,6M token).
- **Phiên Claude Code ở mọi kho tiêu thụ:** lượt hỏng tự lành, không phải đọc văn xuôi SKILL để biết hoàn lại thế nào.

Trace: nguyên tố 2 (bằng chứng không tự dối).

## 2. Lối A — ba loại tác tử của gói feature-loop

Gói `feature-loop` giao ba định nghĩa tác tử, nằm ở `feature-loop/agents/`. Tên đầy đủ khi gọi: `feature-loop:<tên>`.

| Loại | Trường công cụ | Vai nhận | Dạng đã thử tác dụng? |
|---|---|---|---|
| `cham-doc` | `tools: Read, Grep, Glob` (cho phép) | judge · triage · synthesize | ✓ `wf_1590a99c-ca6` |
| `cham-lenh` | `tools: Bash, Read, Grep, Glob` (cho phép) | machine · baseline · finder · refute · provenance | ✓ cùng dạng |
| `cham-ui` | `disallowedTools: Edit, Write, NotebookEdit` (cấm) | ui | ✗ chưa thử được (§6) |

**Vì sao ba loại (sửa sau phản biện, `gap-probe.md` F3).** Dạng danh sách cấm chưa có phép thử tác dụng nào trong vòng: phiên Claude Code chạy nền không đăng nhập được (09/10), và không loại tác tử nào đã nạp dùng dạng ấy. Dạng danh sách cho phép đã chứng có tác dụng. Vì thế mọi vai không cần công cụ trình duyệt đi dạng đã chứng, gồm machine và finder là nhóm vai của ca 07/10. Đề bài và luật TOOL-KILL không nhắc công cụ nào ngoài Bash/Read/Grep/Glob (đọc 09/10). Riêng vai ui cần công cụ trình duyệt của từng kho (Claude_Browser, playwright, chrome-devtools…), kit không liệt kê trước được, nên đi danh sách cấm kèm phép kiểm có tên ở phiên đầu tiên sau khi cài (§6). Lợi thêm: `cham-lenh` mất luôn mọi công cụ MCP có quyền ghi.

**Đổi mã ở đúng MỘT chỗ.** Hàm `agentT` của `acceptance-verify.js` là cửa duy nhất của cả 10 lời gọi tác tử. Nó tra vai → loại qua một bảng `AGENT_TYPES`, đặt cạnh `MODEL_ROUTES` theo cùng nếp: bảng route duy nhất, thuần, test được. Mỗi lời gọi đổi `...modelOpt('x')` thành `...vaiOpt('x')`, và hàm này trả cả `model` lẫn `agentType`. Như vậy không lời gọi nào quên được loại. Ca kiểm đếm lời gọi thiếu `agentType` phải bằng 0.

**Đề bài không đổi từng byte.** Chỉ `opts` đổi. Ca kiểm chạy bộ chấm hiện tại và bộ chấm của tag `v2.26.0` trên cùng args và cùng câu trả lời giả, rồi so ba thứ: mảng đề bài, phán quyết, các dòng run-log.

**Thân định nghĩa tác tử là mô tả vai, không phải luật.** Thân là vài dòng nói đây là tác tử chấm của kit và nó trả kết quả qua công cụ kết quả. Không đặt câu cấm nào: nghiệm là danh sách công cụ, không phải lời.

### 2.1 Đường rơi có tên khi loại tác tử không nạp được

Loại tác tử chỉ nạp lúc MỞ PHIÊN (đo `wf_f9fd2939-efd`: loại tạo giữa phiên báo `agent type '…' not found`, và `agent()` ném lỗi). Một phiên mở trước khi kho cài gói mới sẽ gặp ca này với mọi lời gọi.

- **Rơi im về loại mặc định** thì mất bảo vệ mà không ai biết.
- **BLOCKED** thì đổi kết quả lượt sạch ở mọi kho đang chạy dở, phạm luật 26/09.

Thiết kế chọn đường thứ ba:
- `agentT` bắt đúng lỗi khớp `/agent type .* not found/i`, gọi lại MỘT lần cùng đề bài nhưng không có `agentType`, và ghi nhãn vai vào một tập `loaiVang`.
- Lỗi khác giữ nguyên hành vi cũ: ném tiếp, rồi `parallel`/`.catch` biến thành null như hôm nay.
- Cuối lượt, nếu tập `loaiVang` không rỗng, run-log nhận một dòng theo khuôn marker `LOAI-VANG-LINE`. Kết quả workflow có khoá `loaiTacTuVang` để phiên báo một dòng.

```
{"kind":"loai-tac-tu-vang","ts":"<invokedAt>","round":<n>,"vai":["judge","machine"],"ly_do":"<thông điệp lỗi đầu tiên>"}
```

Bên đọc dòng này là người đếm ngưỡng. Một lượt chấm chạy không bảo vệ không bị tính là «0 lần ghi» của lối A.

## 3. Lối D — quy trách nhiệm, tự hoàn lại, đếm

Chỗ đặt: bước sau-lượt sẵn có `thuoc-vat.mjs --write`, ngay sau khi `soCay` thấy cây đổi (mã 6). Lượt sạch không đi qua nhánh này, nên không đọc transcript và không tốn gì.

### 3.1 Nguồn: transcript tác tử của lượt

- Cờ mới `--transcript <thư mục wf_…>`, lặp được. Phiên đã có `transcriptDir` từ kết quả Workflow, vì nó dùng chính đường ấy cho `wf-usage`.
- Vắng cờ thì máy tự tìm trên MỌI thư mục dự án, không neo vào mã hoá của `--root`. Lý do (phản biện F2): phiên ở kho tiêu thụ có thể chạy với cwd khác `--root`. Máy lấy các thư mục `~/.claude/projects/*/*/subagents/workflows/wf_*` có `journal.jsonl` sửa SAU `invokedAt` của tệp args; lọc thời gian trước nên chỉ đọc vài thư mục. Trong đó, giữ thư mục có ít nhất một tác tử mà đề bài chứa CẢ đường tuyệt đối của `--root` LẪN `_acceptance/<slug>/`. Tìm thấy nhiều thư mục thì lấy hợp của chúng.
- Không tìm thấy thì dòng sổ vẫn ghi, kèm `khong_doc_duoc: "<lý do>"`, và KHÔNG đếm là tác tử chấm.

Một nguồn cho khuôn: `feature-loop/scripts/lib/ghi-boi.mjs` giữ bên đọc transcript (`docTranscript`), bên quy trách nhiệm (`quyTrachNhiem`) và bên dựng dòng sổ (`dongGhiBoi`, khuôn marker `GHI-BOI-LINE`).

### 3.2 Luật quy trách nhiệm (tất định)

Mỗi tệp `agent-*.jsonl` là một tác tử. Nhãn vai lấy từ dòng `[wf-label: …]` ở BẤT KỲ tin người nào. Phải quét mọi tin, vì câu chuyển tiếp của harness đẩy nhãn xuống tin thứ hai (finding 26/09 B3). Với mỗi tệp `F` trong `so.tep`, tác tử bị quy là đã ghi `F` khi xảy ra một trong ba trường hợp:

1. **Công cụ sửa tệp:** có `tool_use` tên `Edit` / `Write` / `NotebookEdit` mà `input.file_path` (hoặc `notebook_path`) trỏ tới `F`, so theo đường tuyệt đối sau khi chuẩn hoá.
2. **Lệnh shell ghi:** có `tool_use` `Bash` mà lệnh NHẮC TỚI `F` VÀ khớp mẫu ghi `GHI-RE`: `sed -i` · `perl -…i` · `>`/`>>` · `tee` · `mv` · `cp` · `rm` · `git … (checkout|restore|apply|am|stash|reset|rebase|merge|cherry-pick)`. «Nhắc tới F» nghĩa là lệnh chứa đường tương đối hoặc tuyệt đối của `F`, HOẶC chứa tên trần của `F` trong một lệnh có `cd <thư mục>` với thư mục là tổ tiên của `F` (phản biện F4).
3. **Commit:** `F` đổi qua commit (`doi: commit`), và tác tử có lệnh Bash khớp `git` … `commit` trong cùng một lệnh con: `git commit`, `git -C <dir> commit`, `git -c k=v commit` (phản biện F4).

Tệp không quy được cho tác tử nào sẽ vào `tep_khong_ro`.

**Luật ghi dòng (phản biện F1).** Mỗi lần `thuoc-vat --write` ghi một dòng `cay-doi`, nó ghi ĐÚNG MỘT dòng `ghi-boi-tac-tu-cham` ngay sau. Điều này đúng bất kể có tác tử bị quy hay không, đọc được transcript hay không. Một dòng `cay-doi` không có dòng này đi kèm là dòng đời cũ.

```
{"kind":"ghi-boi-tac-tu-cham","ts":"<ISO>","round":<n>,"luot_ts":"<invokedAt>","sha":"<sha đã chấm>","tac_tu":[{"id":"agent-<…>","vai":"<nhãn>","cong_cu":["Edit","Bash:git commit"],"tep":["<đường>"]}],"tep_khong_ro":["<đường>"],"hoan_lai":true,"ly_do":"<vì sao không hoàn lại, khi hoan_lai=false>"}
```

Khoá `khong_doc_duoc` CHỈ có mặt khi không đọc được transcript; khi đó `tac_tu` rỗng.

**Đếm ngưỡng.** Một lượt bị vô hiệu vì tác tử chấm ghi ⇔ có dòng `ghi-boi-tac-tu-cham` với `tac_tu` không rỗng. Dòng có `tac_tu` rỗng là phiên hoặc không rõ. Vì «không rõ» có thể che một lần ghi thật, luật đọc ngưỡng ở §5 xử lý nó riêng.

### 3.3 Tự hoàn lại — chỉ khi an toàn, mất cả hoặc không gì

Máy hoàn lại khi đủ BỐN điều kiện. Thiếu một điều kiện thì không làm gì, ghi `hoan_lai: false` kèm `ly_do`, và để phiên làm theo nhánh SKILL như hôm nay.

1. `tep_khong_ro` rỗng: mọi thay đổi đều của tác tử chấm.
2. Không commit nào trong `sha..HEAD` có mặt trên nhánh xa (`git branch -r --contains <c>` rỗng). Commit đã đẩy là việc khó đảo, nên luôn để người.
3. Không tệp nào bị tác tử ghi đè mà đã bẩn trước lượt (có trong `cayChup.ban`). Hoàn lại tệp ấy sẽ xoá việc của phiên.
4. HEAD hiện tại có `sha` đã chấm làm tổ tiên, tức không ai lùi nhánh.

Khi đủ điều kiện, máy chạy theo thứ tự:
- `git reset --keep <sha>` nếu có commit. `--keep` tự từ chối khi đụng thay đổi chưa commit của phiên; từ chối thì ghi `hoan_lai: false`.
- `git checkout <sha> -- <tệp>` cho từng tệp đổi chưa commit. Tệp mới do tác tử tạo trong vùng xét thì để nguyên và gọi tên (giống `moi` hôm nay, không khoá).
- So cây lại bằng `soCay`; cây phải sạch.

Mã thoát vẫn là **6**, vì lượt ấy không dùng được. Stderr in `da hoan lai — sinh args lai cung round`. `s4-args` lượt kế thấy cây đã hoàn lại và ra cùng round như hôm nay (K8, không đếm trần).

## 4. SKILL feature-loop — ba chỗ chữ

1. **S4 «Mọi verdict»:** lệnh `thuoc-vat.mjs --write` nhận thêm `--transcript "<transcriptDir>"`.
2. **Đoạn mã 6:** khi stderr có `da hoan lai`, máy đã hoàn lại; sinh args lại cùng round, không hỏi. Khi `hoan_lai: false`, đi đúng nhánh hai ca như hôm nay.
3. **Một dòng nghĩa của `loaiTacTuVang`:** lượt chấm chạy không có loại tác tử hẹp vì phiên mở trước khi cài gói. Phiên báo một dòng, không chặn.

## 5. Đường đo của ngưỡng

Sáu số trong cửa sổ, đếm trên kit và các kho đã nhận mốc, đọc từ `_acceptance/*/run-log.jsonl`:

| Số | Từ đâu | AC bảo đảm |
|---|---|---|
| **G** — lượt vô hiệu vì tác tử chấm ghi | dòng `ghi-boi-tac-tu-cham` có `tac_tu` không rỗng | AC-5 |
| **C** — lượt cây đổi | dòng `cay-doi` | có sẵn (2.20) |
| **K** — không đọc được transcript | dòng `ghi-boi-tac-tu-cham` có khoá `khong_doc_duoc` | AC-5 |
| **R** — chỉ có tệp không rõ chủ | dòng `ghi-boi-tac-tu-cham` có `tac_tu` rỗng, `tep_khong_ro` không rỗng, không có `khong_doc_duoc` | AC-5 |
| **V** — lượt chạy không bảo vệ | dòng `loai-tac-tu-vang` | AC-4 |
| **N** — mẫu số | dòng `round-tally`, TRỪ các lượt có dòng `loai-tac-tu-vang` cùng `round` | có sẵn |

**Luật đọc (phản biện F2).** Chỉ được đọc SỐNG khi đủ bốn vế:
- G = 0;
- K = 0;
- mỗi dòng `cay-doi` có đúng một dòng `ghi-boi-tac-tu-cham` đi sau;
- N ≥ 400.

R > 0 thì phiên nghiệm thu đọc tên tệp và transcript của từng dòng R trước khi tuyên, vì R là chỗ một lần ghi qua dạng lệnh chưa phủ có thể trốn. K > 0 nghĩa là chưa đọc được, không phải sống.

## 6. Giới hạn đã khai, kèm ngưỡng đang đếm

- **Ghi qua lệnh shell ở vai `cham-lenh`/`cham-ui` vẫn làm được.** Lối D đếm và tự lành phần này. Ngưỡng mở lối B (hook theo `agent_id`) hoặc C (bản sao): ≥1 lượt vô hiệu do tác tử chấm ghi qua Bash trong cửa sổ 30 ngày.
- **Dạng lệnh ghi chưa phủ** (biến môi trường chứa đường, `xargs`, script ghi gián tiếp) làm tệp rơi vào `tep_khong_ro`, đếm vào R. Ngưỡng: ≥1 dòng R mà đọc lại transcript thấy là tác tử chấm → nới luật quy trách nhiệm.
- **Bản trích transcript thật cho ca `sed -i` (21/09) không có trên máy này**, vì nó nằm ở máy khác. Hàng ấy dùng dòng do code sinh. Hàng Write + `git commit` dùng bản trích thật 07/10.
- **Dạng danh sách cấm của `cham-ui` chưa có phép thử tác dụng.** Phép kiểm có tên chạy ở phiên đầu tiên mở sau khi cài mốc, TRƯỚC khi đếm cửa sổ (phản biện F3):
  - một workflow ba tác tử;
  - tác tử `feature-loop:cham-ui` và tác tử `feature-loop:cham-lenh` mỗi tác tử được bảo liệt kê công cụ rồi Write tệp X; mong: X không sinh, danh sách không có Edit/Write/NotebookEdit;
  - tác tử mặc định làm đối chứng; mong: X sinh.

  Cửa sổ 30 ngày chỉ bắt đầu khi phép này xanh. Đỏ thì `cham-ui` thủng, sửa vật trước khi đếm.
- **Công cụ MCP có quyền ghi** còn ở vai `cham-ui`. Lối D đếm nếu nó chạm tệp theo luật 1 hoặc 2; phần còn lại vào R. Ngưỡng: ≥1 dòng R truy ra một công cụ MCP.
- **Vai ui có thể đã quen lưu `network.txt` hay `.html` dự phòng bằng `Write`.** Không còn Write, nó phải ghi qua Bash. Rủi ro đổi kết quả eval ui-check ở kho có nhiều eval ui (artifact-platform 10, crm 7). Đo ở chiến dịch phát hành, trước→sau trên các kho. Ngưỡng: ≥1 eval ui-check đổi từ PASS sang `cannotRun` mà lý do nêu việc lưu tệp.
- **Thay thân định nghĩa tác tử** (loại tùy biến thay khung tác tử workflow mặc định) có thể đổi chất lượng chấm. Cùng phép đo phát hành. Ngưỡng: ≥1 kho đổi phán quyết mà vật không đổi.
- **Trong vòng này, kiểm sống trên phiên thật với loại của kit là không làm được:** phiên đang chạy nạp gói 2.26.0. Giả định 1 đã thử bằng một loại tác tử plugin có sẵn (`feature-dev:code-architect`, dạng cho phép). Kiểm thật lần đầu là phép kiểm có tên ở trên.
- **Câu chuyển tiếp vẫn tới tác tử chấm.** Mặt «bỏ chấm» (đọc «Dừng nó» thành lệnh huỷ) không được vòng này chữa (Out of scope của ô).

## 7. Phép đo — kế hoạch (cặp hai chiều trên cùng fixture)

- **Định nghĩa tác tử:** đọc frontmatter thật của ba tệp. Ma trận viết trước:
  - `cham-doc`: `tools` đúng bằng {Read, Grep, Glob};
  - `cham-lenh`: `tools` đúng bằng {Bash, Read, Grep, Glob};
  - `cham-ui`: không có `tools`, `disallowedTools` ⊇ {Edit, Write, NotebookEdit};
  - `name` khớp tên tệp.

  Đột biến: thêm `Write` vào `cham-doc` → đỏ «AT1 cham-doc Write»; thêm `Edit` vào `cham-lenh` → đỏ «AT1 cham-lenh Edit»; gỡ `Edit` khỏi danh sách cấm của `cham-ui` → đỏ «AT1 cham-ui Edit».
- **Bảng vai → loại:** dùng `tests/workflows/harness.mjs` với args phủ đủ 9 vai. Ghi `opts` của mọi lời gọi. Ma trận 9 vai, đếm lời gọi thiếu `agentType` = 0. Đột biến: `agentT` bỏ `agentType` → đỏ; bảng đảo judge → `cham-lenh` → đỏ đích danh vai.
- **Lượt sạch không đổi:** cùng harness, chạy bộ chấm hiện tại và bản `git show v2.26.0:feature-loop/workflows/acceptance-verify.js` (code lấy trong lần chạy) trên cùng args và câu trả lời giả. So bằng nhau: mảng đề bài, phán quyết, các dòng run-log. Đột biến: chèn một ký tự vào đuôi đề bài máy → đỏ.
- **Đường rơi:** câu trả lời giả ném `agent type 'feature-loop:cham-doc' not found` cho mọi lời gọi có `agentType`. Mong: mỗi lời gọi được gọi lại đúng một lần không `agentType`, phán quyết bằng lượt sạch, có dòng `loai-tac-tu-vang` liệt đúng vai. Ném lỗi khác → không gọi lại (chiều im). Đột biến: gọi lại với mọi lỗi → đỏ; không ghi dòng → đỏ.
- **Quy trách nhiệm:** kho git do code sinh, args do `s4-args` THẬT sinh, transcript fixture gồm hai phần:
  - (i) bản trích NGUYÊN VĂN, không sửa byte nào, các dòng `tool_use` của transcript thật 07/10 (`agent-ae624896…`, Write/Edit/`git commit`), lưu ở `tests/fixtures/ghi-boi/`; đường tuyệt đối được thay bằng gốc của kho fixture qua một phép thay chuỗi do code làm;
  - (ii) dòng do code sinh cho các ca còn lại.

  Ma trận viết trước gồm 10 hàng:
  1. Edit tệp vật → quy.
  2. Write + `git commit`, bản trích thật → quy.
  3. `sed -i` → quy.
  4. Phiên tự sửa → dòng có `tac_tu` rỗng, tệp ở `tep_khong_ro`.
  5. Không transcript → dòng có `khong_doc_duoc`.
  6. Tự tìm qua `HOME` giả → quy.
  7. Tác tử chỉ `cat` → không quy.
  8. `cd <thư mục>` rồi `sed -i` tên trần → quy.
  9. `git -C . commit` → quy.
  10. Tự tìm khi thư mục dự án mang mã hoá KHÁC `--root` → vẫn tìm thấy.

  Mọi hàng: đúng MỘT dòng `ghi-boi` sau mỗi dòng `cay-doi`. Đột biến: bỏ `GHI-RE` → hàng 7 đỏ; bỏ nhánh `cd` → hàng 8 đỏ.
- **Hoàn lại:** ca an toàn cho `hoan_lai: true` và cây sau bằng `sha`. Sau đó `s4-args` lượt kế thoát **0** với `round` BẰNG round của lượt vô hiệu: đây là đối chứng dương ghim (phản biện F5). Bốn hàng không an toàn cho `hoan_lai: false` kèm `ly_do` ghim, và cây giữ nguyên: commit đã đẩy · tệp bẩn sẵn bị ghi đè · lẫn phiên · HEAD mất tổ tiên `sha`. Đột biến: bỏ kiểm nhánh xa → đỏ; bỏ kiểm `cayChup.ban` → đỏ.

## 8. Ngoài phạm vi (chép sang hợp đồng)

- Lối B (hook theo `agent_id`) và lối C (chấm trên bản sao): là lối mở lại theo ngưỡng §6.
- Tắt hay đổi câu chuyển tiếp của harness: không phải mã kit.
- Mặt «bỏ chấm» (`cannotRun` vì đọc câu người thành lệnh dừng): giữ ở hạt giống 21/09.
- Tác tử S3 (`execute-parallel.js`): là tác tử làm, phải ghi được.
- Thẻ Cổng Bằng chứng và lưới trước-merge đọc hai dòng sổ mới: lưới `cay-doi` sẵn có đã khoá lượt. Hai dòng mới chỉ để đếm và báo, không đổi phán quyết. Bên đọc hiện tại lọc theo `kind`, nên dòng lạ bị bỏ qua.
- Bộ đọc ngưỡng tự động: phiên nghiệm thu dùng lệnh ở §5.
