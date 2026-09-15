# Bốn kho cắt token, đối chiếu với hoá đơn thật của kit — 15/09/2026

**Đề bài (owner, 15/09):** research RTK · Headroom · ponytail · Caveman — phần
nào giúp kit hiệu quả và tiết kiệm hơn mà không giảm chất lượng.

**Kết luận một dòng:** cả bốn đều cắt đúng thứ chúng quảng cáo, nhưng **không
kho nào chạm khoản chi lớn nhất của kit** — tiền GHI cache, 46,7 % hoá đơn. Hai
kho (RTK · Headroom) còn đặt một lớp lọc chưa kiểm giữa VẬT và THƯỚC, đúng lớp
lỗi CLAUDE.md sinh ra để chặn. Việc đáng làm nằm ở chỗ khác, và rẻ hơn nhiều.

---

## 1. Hoá đơn thật của kit — đo, không ước

Nguồn: mọi `usage-report.md` trong `_acceptance/` (máy đo sẵn bằng `wf-usage`).
Đơn giá lấy từ bảng giá Claude API 09/2026, cache_read 0,1× giá nhập
(Fable 5.1: 0,025×), cache_write 1,25× giá nhập.

**2 294 tác tử · 18 106 lượt gọi · 1 348,79 USD.**

| Khoản | Token | % token | USD | **% tiền** |
|---|---:|---:|---:|---:|
| Ghi cache (`cache_creation`) | 159,9 M | 9,9 % | 630,02 | **46,7 %** |
| Đọc cache (`cache_read`) | 1 440,5 M | 89,2 % | 471,92 | **35,0 %** |
| Sinh ra (`output`) | 13,5 M | 0,83 % | 245,18 | **18,2 %** |
| Nhập tươi (`input`) | 0,28 M | 0,02 % | 1,67 | 0,1 % |

**Đây là phát hiện chính.** Dòng 4 của luật (c) đếm token thô. Đếm theo token,
`cache_read` là 89 % còn `output` là 0,8 % — đọc thế thì mọi nỗ lực chạm output
là vô nghĩa và mọi nỗ lực chạm cache_read là tất cả. Đếm theo TIỀN thì thứ tự
gần như đảo: **khoản GHI cache một mình đắt hơn khoản ĐỌC**, dù nó nhỏ hơn chín
lần về token. Giá pha trộn thực đo được: ghi 3,94 USD/M, đọc 0,328 USD/M —
**chênh 12 lần mỗi token**.

### Theo vai trò

| Vai trò | Tác tử | USD | % tiền | USD/tác tử |
|---|---:|---:|---:|---:|
| `review` | 284 | 799,10 | **59,2 %** | 2,814 |
| `refute` | 769 | 402,57 | **29,8 %** | 0,523 |
| `machine` | 751 | 49,69 | 3,7 % | 0,066 |
| `synthesize` | 97 | 36,14 | 2,7 % | 0,373 |
| `baseline` | 53 | 20,66 | 1,5 % | 0,390 |
| `judge` · `triage` · `capture` · còn lại | 340 | 40,64 | 3,0 % | — |

**review + refute = 89,1 % TIỀN**, trong khi spec 14/09 đo được 83 % TOKEN.
Khối chứng-minh-vật = **6,2 % tiền** (so với 14 % token). Tức là đo theo tiền,
**độ lệch mà spec `khoi-tim-loi-tra-phi-theo-vat` đi sửa còn nặng hơn** con số
spec đó dùng để mở vòng. Phát hiện này CỦNG CỐ spec 14/09, không thay nó.

### Vì sao khoản ghi cache lớn đến thế

Ghi-cache mỗi tác tử, đo theo model:

| Model | Tác tử | Token ghi-cache / tác tử |
|---|---:|---:|
| Haiku 4.5 | 770 | 40 110 |
| Sonnet 5 | 1 237 | 75 888 |
| Fable 5 | 114 | 100 616 |
| Fable 5.1 | 81 | 129 361 |
| Opus 5 | 92 | 143 253 |

Một tác tử Haiku chạy **một** lệnh bash vẫn ghi 40 nghìn token vào cache trước
khi đọc chữ nào của việc. Con số này gần bằng trọn một prefix, tức **mỗi tác tử
đang tự ghi cache riêng thay vì đọc cache của tác tử anh em**. Chi phí sàn vì
thế nhân theo SỐ TÁC TỬ, không theo số lượt gọi — và nhân ở mức giá đắt gấp 12.

---

## 2. Bốn kho — cắt ở đâu, và khối đó đáng bao nhiêu ở kit này

| Kho | Cơ chế | Cắt khối nào | Khối đó = % tiền kit | Đo độc lập |
|---|---|---|---:|---|
| **RTK** | hook `PreToolUse`(Bash) + binary Rust lọc stdout | byte `tool_result` → rơi vào `cache_read` | 35,0 % | JetBrains 425 cặp: **đắt hơn 7,6 %** (p = 0,004) ở low effort; Quesma 1 740 lượt: **+17 %/task**, +18 % lượt |
| **Headroom** | proxy tầng API, nén message trên dây | `input` tươi + gián tiếp `cache_read` | 0,1 % + 35,0 % | tokbench: **10,2 %** trung bình; chính hãng công bố fleet median **4,8 %** (không phải 60–95 %) |
| **Caveman** | skill ép văn nén | `output` | 18,2 % | Guzik 72 run: **14–21 %** cho việc có cấu trúc; JetBrains 86 task: **−8,5 %** |
| **ponytail** | skill «lười», viết ít code hơn | `output` ở S3 | trong 18,2 %, nhưng S3 không phải chỗ tiền | chỉ tác giả tự đo, n = 4, Haiku |

**Không kho nào chạm cột 46,7 %.** Ba trong bốn còn CỘNG vào prefix — và mọi
thứ cộng vào prefix ở kit này bị nhân với 2 294 tác tử ở giá ghi-cache.

### Luật chung rút ra

> Kiến trúc của kit là **nhiều tác tử ngắn**. Điều đó đảo ngược kinh tế của mọi
> tối ưu kiểu «cài thêm một MCP / bơm thêm một skill»: thứ gì nằm trong prefix
> đều trả **một lần cho mỗi tác tử**, ở giá đắt gấp 12 giá đọc. Một skill 1 650
> token (cỡ ponytail) tốn **24,70 USD, 1,8 % hoá đơn**, trước khi nó tiết kiệm
> được đồng nào. Chính tác giả chồng `claude-code-tips` cũng tự khai điều này:
> phiên ngắn bật đủ MCP thì **đắt hơn** bản gốc.

---

## 3. Vì sao TỪ CHỐI — theo bất biến của kit, không theo con số

### RTK — bác, có lý do cứng

RTK là hook `PreToolUse` áp theo **phiên**, không theo tác tử. Mọi tác tử con do
Workflow sinh ra đều bị viết lại lệnh, **kể cả làn `machine` đang chạy eval
nghiệm thu**. Nghĩa là bằng chứng chiều đỏ của mọi vòng sẽ đi qua một lớp lọc
không nằm trong hợp đồng và chưa ai kiểm.

Đây đúng hình dạng (1) trong luật «thước phải gắn vào vật được giao»: *đo chỉ
dẫn thay vì đầu ra*. Nghi thức hai chiều của kit sẽ vẫn xanh — nó đang đo một
vật ĐÃ QUA LỌC. Tài liệu RTK khai exit code truyền nguyên, nhưng **không có đo
độc lập nào kiểm riêng bất biến «dòng lỗi cuối và tên test fail còn nguyên»** —
mà đó mới là thứ chiều đỏ của kit đọc. Cộng thêm: một ca viết sai cờ `find` đã
gây 339 lỗi liên tiếp, chi phí 9× baseline (vá ở 0.46.0).

Kể cả nếu nó tiết kiệm thật, nó cắt ở cột 35 % bằng cách đặt bộ lọc lên đúng
đường bằng chứng. Không đổi.

### Headroom — bác lúc này

Hai lý do độc lập, mỗi lý do đủ để bác:

1. **Nó chạm đúng chỗ kit yếu nhất.** Lỗi đã đo bằng đô la trong chính kho
   (issue #3379/#3380): nén nền làm đổi byte của prefix → cache-hit sụp từ 90 %
   xuống 52 %. Ở kit này, biến `cache_read` thành `cache_write` là **nhân giá
   lên 12 lần**. Một lần vỡ cache làm hoá đơn TĂNG, không giảm. Đường OpenAI
   (#3391) và Bedrock/Gemini (#3394) vẫn còn lỗi mở.
2. **Nó chặn ở dây nên áp cho mọi tác tử con**, không có nút tắt riêng cho làn
   `machine` — cùng lỗ hổng bằng chứng như RTK. Kho có `--protect-tool-results`
   và `protect_reads`, nhưng **không tìm thấy danh sách loại trừ đích danh cho
   output lệnh test/build**.

Kỳ vọng hợp lý sau khi lọc quảng cáo là 5–25 % của khối `input` tươi — mà khối
đó là **0,1 % hoá đơn**.

### Caveman — bác, theo thứ tự ưu tiên của North Star

Kinh tế thì gần huề: cắt 14–21 % của khối output (245,18 USD) = **34–51 USD**,
trừ ~15 USD nó cộng vào prefix → ròng **19–36 USD, khoảng 2 % hoá đơn**.

Bác không vì con số mà vì **nó nén đúng đoạn văn người đọc ở Cổng Bằng chứng**.
North Star xếp rõ: «dòng người đứng trước dòng máy: token giảm mà lượt gọi
người tăng là thất bại». Đổi độ đọc-được của bằng chứng quyết định lấy 2 % là
đổi ngược chiều. Kit còn có luật ngôn ngữ mặt người (`CONTEXT.md`) — văn nén
kiểu caveman là vi phạm trực tiếp.

*Biến thể duy nhất sống được* (không khuyến nghị, ghi để khỏi nghĩ lại): áp
riêng cho văn **máy-đọc-máy** (`refute` → `triage`), tuyệt đối không cho văn
người đọc. Lợi ~1 %, thêm một nhánh khuôn phải giữ đồng bộ. Không đáng.

### ponytail — bác

Tiền của kit nằm ở S4 (review + refute = 89,1 %), không ở S3 viết code. ponytail
bơm 1,5–1,8 k token vào **mọi tác tử con** qua hook `SubagentStart` — tức trả
24,70 USD cho 2 294 tác tử mà 1 500 trong số đó không viết một dòng code nào.

Số của nó cũng không đứng: −54 % LOC là trung bình bị ba outlier kéo (date picker
−94 %, backend CRUD ≈ 0 %); «100 % an toàn» là **baseline cũng 20/20**, tức
không-hồi-quy chứ không phải cải thiện; n = 4 trên Haiku, chưa ai replicate.
Rủi ro đã được báo cáo thật: issue #245 «dangerously lazy» — phản xạ diff-ngắn-nhất
vá triệu chứng. Kit đã có luật riêng mạnh hơn cho đúng việc này (sửa bug =
root cause, grep mọi caller).

---

## 4. Hai nút thật — không kho nào trong bốn kho chạm tới

Xác minh cơ chế qua tài liệu Claude Code (`hooks.md`, `sub-agents.md`,
`workflows.md`).

### Nút 1 — tác tử anh em có thể DÙNG CHUNG prefix cache

Tài liệu `workflows.md` khai: hai tác tử cùng *model · effort · agent type ·
tools · output schema · thư mục làm việc* dựng cùng prefix, và tác tử khởi động
sau khi anh em đã bắt đầu trả lời sẽ **đọc cache của anh em** thay vì tự ghi.
Có cơ chế giữ nhịp (`CLAUDE_CODE_WORKFLOW_PREFIX_STAGGER_MS`, mặc định 5 000 ms)
và khoá `cacheTtl` / `subagentPromptCacheTtl` (`5m` mặc định, đặt được `1h`).

**Đo rồi — chia sẻ prefix đang KHÔNG xảy ra.** Phép thử chạy trên dữ liệu đã
có, 0 token: nếu tác tử anh em chia sẻ prefix thì `cache_creation` mỗi tác tử
phải GIẢM mạnh khi lượt chấm có nhiều tác tử hơn (chỉ tác tử đầu ghi). Nếu
không chia sẻ, nó gần như hằng số.

| Model | Khối | Tác tử/khối | Ghi-cache/tác tử ở khối ÍT | ở khối NHIỀU |
|---|---:|---|---:|---:|
| Sonnet 5 | 95 | 2–32 | 74 185 (2–12 tác tử) | **69 901** (13–32 tác tử) |
| Haiku 4.5 | 96 | 5–19 | 44 489 (5–6) | **32 762** (6–19) |
| Opus 5 | 33 | 2–4 | 148 787 (2–3) | **150 330** (3–4) |
| Fable 5 | 41 | 2–6 | 135 978 (2–3) | **88 862** (3–6) |

Sonnet đi từ 2 lên 32 tác tử mà chi phí ghi mỗi tác tử **chỉ giảm 6 %** — chia
sẻ thật thì phải giảm cỡ 10 lần. Opus phẳng hoàn toàn. Haiku giảm 26 %, gợi ý
làn `machine` (cùng model, cùng schema, cùng tools) chia sẻ được **một phần**,
còn xa mức cơ chế hứa.

**Kết luận: khoản 630 USD đang tăng tuyến tính theo SỐ TÁC TỬ.** Mỗi tác tử
thêm vào một lượt chấm là một prefix nữa phải ghi ở giá đắt gấp 12. Đây vừa là
chi phí lớn nhất, vừa là chi phí mà spec `khoi-tim-loi-tra-phi-theo-vat` (cắt
số tác tử `refute`) đã nhắm đúng mà chưa biết — spec đó đo token, và theo token
thì ghi-cache chỉ là 9,9 %.

*Chưa phân biệt được (cần một lượt chấm để chốt):* chia sẻ hỏng vì TTL 5 phút
hết hạn giữa lượt (vòng điển hình 18 phút, có vòng 157 phút), hay vì các vai trò
khai `schema` khác nhau nên không cùng prefix, hay vì nhịp giữ
(`CLAUDE_CODE_WORKFLOW_PREFIX_STAGGER_MS`) không đủ cho tác tử đầu kịp trả lời.
Ba nguyên nhân, ba cách vá khác nhau — nhưng cả ba đều là cấu hình, không phải
vật.

### Nút 2 — `omitClaudeMd: true`

Khoá frontmatter hợp lệ của định nghĩa agent type. Tác tử con mặc định nhận
trọn CLAUDE.md dự án + user; khoá này bỏ nó.

`CLAUDE.md` của kit: 18 380 byte, 2 674 từ ≈ **4 800–6 800 token** (ước theo
byte và theo từ; chưa đo bằng `count_tokens`). Nhân 2 294 tác tử (ghi) và
18 106 lượt (đọc):

| | USD | % hoá đơn |
|---|---:|---:|
| CLAUDE.md dự án, ước cận dưới (4 813 tok) | 72,1 | 5,3 % |
| CLAUDE.md dự án, ước cận trên (6 807 tok) | 101,9 | 7,6 % |
| kèm CLAUDE.md user (+2,3 KB) | ~115 | ~8,5 % |

Một tác tử `refute` chạy một lệnh, hay một tác tử `machine` chạy `bash
run-tests.sh`, **không cần hiến pháp của kit** để làm đúng việc. Tác tử `review`
thì cần.

---

## 5. Đề xuất — phân loại theo luật CỘNG/TRỪ (ADR 0018)

### Đ1 — Cho `wf-usage` in thêm cột ghi-cache và cột tiền · **TRỪ-sửa · tự đi**

`wf-usage.mjs:68` **đã thu** `cache_creation_input_tokens`. Bảng vai trò
(`:192`) in `out · cache_read · wall s` — **bỏ trắng đúng khoản 46,7 %**. Dòng 4
của luật (c) vì thế đang đọc một hoá đơn thiếu nửa tiền.

Đây không phải phép đo mới (luật giới hạn chiều rộng (a) cấm), mà là sửa một
nhạc cụ đã được CLAUDE.md gọi đích danh cho dòng 4.

*Giáp ranh cần nói thẳng:* ô `.out-of-scope/thuoc-cua-thuoc-mot-tang.md` park
lớp «đo-thước-của-thước». Việc này KHÔNG thuộc lớp đó — `wf-usage` không ra
phán quyết, nó là công-tơ. Nhưng ranh giới gần, nên ghi ra đây thay vì lờ đi.

Nghi thức hai chiều: *(đỏ)* một vòng có ghi-cache áp đảo phải ra số khác báo
cáo hôm nay · *(im)* chạm hồ sơ của chính vòng không được làm số đổi.

### Đ2 — Chốt nguyên nhân prefix không chia sẻ · **đo · tự đi** ⭐ ĐẮT NHẤT

Đã đo được **là không chia sẻ** (mục 4, 0 token). Còn lại là chốt nguyên nhân
trong ba ứng viên — TTL 5 phút · schema khác nhau giữa vai trò · nhịp giữ không
đủ. Một lượt chấm với `subagentPromptCacheTtl: 1h` và so `cache_creation` cùng
làn `machine` là đủ phân biệt.

**Đây là việc đáng làm nhất trong cả tài liệu này.** Nó nhắm khoản 46,7 % bằng
một dòng cấu hình, không đụng vật, không đụng bằng chứng, không đụng cổng người.
Không kho nào trong bốn kho nghiên cứu chạm tới nó.

### Đ3 — Cắt sử liệu khỏi CLAUDE.md, giữ nguyên bất biến · **TRỪ · tự đi**

Phần lớn 18,4 KB là sử liệu: ngày tháng, ai quyết gì, lịch sử đề xuất đã bác.
Thứ đó thuộc `docs/`, không thuộc thứ bơm vào 2 294 tác tử. Giữ bất biến + liên
kết. Cắt còn nửa ≈ **36–51 USD, 2,7–3,8 % hoá đơn**, không rủi ro chất lượng
nếu bất biến ở lại nguyên văn.

### Đ4 — Agent type hẹp cho làn máy (`omitClaudeMd`, `tools` hẹp) · **CỘNG · CẦN OWNER PHÊ DUYỆT**

Định nghĩa agent type riêng cho `machine` và `refute` để hai làn đông nhất
(1 520 / 2 294 tác tử) không mang hiến pháp và không mang schema tool không dùng.

Là CỘNG vì nó thêm vật vào engine (`.claude/agents/`) mà mọi repo tiêu thụ sẽ
nhận. Theo ADR 0018: trace về nguyên tố 2 (bằng chứng không tự dối — làn máy
mang ít ngữ cảnh hơn thì ít đường tự lẫn hơn) và người hưởng là owner qua dòng
4–5. Chờ Cổng Phạm vi của vòng có nó, hoặc một ADR.

*Chưa xác minh được:* thu hẹp `tools:` có thật sự gỡ schema khỏi prefix không,
hay chỉ chặn quyền gọi. Tài liệu không nói dứt khoát. Phải đo trước khi tin —
hai tác tử cùng model, khác `tools`, so `cache_creation`.

### Đ5 — Bốn kho: KHÔNG dùng

RTK · Headroom: bác cứng (lớp lọc chưa kiểm trên đường bằng chứng · rủi ro vỡ
cache nhân giá 12 lần). Caveman · ponytail: bác (đổi ngược chiều North Star ·
cắt sai tầng). Chi tiết ở `.out-of-scope/`.

---

## 6. Điều kiện tin cậy cho mọi số ở trên

- Đơn giá là bảng niêm yết 09/2026; hoá đơn thật có thể khác theo hợp đồng.
- Token của `CLAUDE.md` là **ước**, chưa đo bằng `count_tokens`. Mọi con số Đ3
  phải đo lại trước khi ghi vào hồ sơ release.
- Phân bổ `cache_write` theo vai trò là **suy tỉ lệ** từ `cache_read` cùng model
  (bảng nhãn của `wf-usage` không in cột ghi-cache — chính là thứ Đ1 sửa). Số
  theo vai trò vì thế chính xác ở mức thứ hạng, không ở chữ số cuối.
- Con số của bốn kho: đã tách tuyên-bố-tác-giả khỏi đo-độc-lập ở bảng mục 2.
  Mọi số «60–90 %» là tự đo của tác giả, không phải hoá đơn.
