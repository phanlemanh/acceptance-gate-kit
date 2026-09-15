# Bốn kho cắt token cho Claude Code — BÁC 15/09/2026

**Quyết định:** máy bác cả bốn, 15/09, trên hoá đơn thật của kit (2 294 tác tử ·
18 106 lượt · 1 348,79 USD, đo từ mọi `usage-report.md` trong `_acceptance/`).
Owner đọc căn cứ ở
[docs/findings/2026-09-15-bon-kho-cat-token-doi-chieu-hoa-don-that.md](../docs/findings/2026-09-15-bon-kho-cat-token-doi-chieu-hoa-don-that.md).

**Vì sao có file này:** bốn kho này đang rất nóng trên GitHub (RTK 80 k sao ·
Headroom 72 k · ponytail 139 k · Caveman 106 k) và được gộp sẵn thành một chồng
(`sgaabdu4/claude-code-tips`). Ai đọc bảng «giảm 60–90 % token» lần sau sẽ nảy
đúng bốn ý dưới đây. Ghi lý do ở đây để lần đó đụng lý do trước khi kịp mở ô.

---

## Căn cứ chung — hoá đơn của kit, theo TIỀN chứ không theo token

| Khoản | % token | **% tiền** |
|---|---:|---:|
| Ghi cache | 9,9 % | **46,7 %** |
| Đọc cache | 89,2 % | 35,0 % |
| Sinh ra | 0,83 % | 18,2 % |
| Nhập tươi | 0,02 % | 0,1 % |

**Không kho nào trong bốn chạm cột 46,7 %.** Và vì kiến trúc kit là nhiều tác tử
ngắn, mọi thứ CỘNG vào prefix bị nhân với 2 294 tác tử ở giá ghi-cache — đắt gấp
12 giá đọc. Đây là lý do nền cho cả bốn án dưới.

---

## 1. RTK (`rtk-ai/rtk`) — proxy CLI lọc output shell

**Bác.** Nó là hook `PreToolUse`(Bash) áp theo **phiên**, nên mọi tác tử con của
Workflow đều bị viết lại lệnh — **kể cả làn `machine` chạy eval nghiệm thu**.
Bằng chứng chiều đỏ của mọi vòng sẽ đi qua một lớp lọc ngoài hợp đồng, chưa ai
kiểm. Đúng hình dạng (1) của luật «thước phải gắn vào vật được giao»: nghi thức
hai chiều vẫn xanh vì nó đang đo vật ĐÃ QUA LỌC.

Tài liệu RTK khai exit code truyền nguyên, nhưng không có đo độc lập nào kiểm
riêng bất biến *«dòng lỗi cuối và tên test fail còn nguyên»* — đó mới là thứ
chiều đỏ của kit đọc.

Tiết kiệm cũng không đứng: JetBrains (425 cặp, SkillsBench) đo **đắt hơn 7,6 %**
ở low effort; Quesma (1 740 lượt, Terminal-Bench 2.1) đo **+17 %/task** trên
DeepSeek, +18 % số lượt. Con số 60–90 % là tự đo BYTE của tác giả (`bytes/4`,
không tokenizer), không phải hoá đơn.

**Mở lại chỉ khi:** có đo độc lập kiểm riêng bất biến chiều-đỏ-còn-nguyên, VÀ có
đường tắt nó cho riêng làn `machine`.

## 2. Headroom (`headroomlabs-ai/headroom`) — proxy nén ngữ cảnh

**Bác lúc này.** Hai lý do độc lập, mỗi lý do đủ:

1. **Vỡ prefix cache — đã đo bằng đô la trong chính kho** (issue #3379/#3380:
   cache-hit sụp 90 % → 52 %; #3391 và #3394 còn mở cho OpenAI/Bedrock/Gemini).
   Ở kit này, biến đọc-cache thành ghi-cache là **nhân giá 12 lần**. Một lần vỡ
   làm hoá đơn TĂNG.
2. **Chặn ở dây nên áp cho mọi tác tử con**, không nút tắt riêng cho làn
   `machine` — cùng lỗ hổng bằng chứng như RTK. Có `--protect-tool-results` và
   `protect_reads` nhưng **không có loại trừ đích danh cho output test/build**.

Mức thật sau khi lọc quảng cáo: tokbench đo **10,2 %** trung bình; chính hãng
công bố fleet median **4,8 %** — trên khối `input` tươi, tức **0,1 % hoá đơn kit**.

**Mở lại chỉ khi:** #3391/#3394 đóng, VÀ có loại trừ đích danh theo lệnh, VÀ có
đo cache-hit trước/sau trên chính kho này.

## 3. Caveman (`JuliusBrussee/caveman`) — skill ép văn nén

**Bác.** Kinh tế gần huề: cắt 14–21 % của khối output (245,18 USD) = 34–51 USD,
trừ ~15 USD nó cộng vào prefix → ròng **19–36 USD, ~2 % hoá đơn**.

Bác không vì số mà vì **nó nén đúng đoạn văn người đọc ở Cổng Bằng chứng**.
North Star xếp rõ: «dòng người đứng trước dòng máy». Đổi độ đọc-được của bằng
chứng quyết định lấy 2 % là đổi ngược chiều. Vi phạm trực tiếp luật ngôn ngữ mặt
người (`CONTEXT.md`).

Chính kho tự khai `docs/HONEST-NUMBERS.md`: **«Input reduction from the skill: 0 %»**
— nó CỘNG ~1 000 token input mỗi lượt.

**Biến thể duy nhất sống được, KHÔNG khuyến nghị:** áp riêng cho văn máy-đọc-máy
(`refute` → `triage`), tuyệt đối không cho văn người đọc. Lợi ~1 %, đổi lấy một
nhánh khuôn nữa phải giữ đồng bộ.

## 4. ponytail (`DietrichGebert/ponytail`) — skill «lười»

**Bác.** Tiền của kit nằm ở S4 (`review` + `refute` = **89,1 % tiền**), không ở
S3 viết code. ponytail bơm 1,5–1,8 k token vào **mọi** tác tử con qua hook
`SubagentStart` → **24,70 USD, 1,8 % hoá đơn**, trả cho 2 294 tác tử mà phần lớn
không viết dòng code nào.

Số không đứng: −54 % LOC là trung bình bị ba outlier kéo (date picker −94 %,
backend CRUD ≈ 0 %); «100 % an toàn» là **baseline cũng 20/20** — không-hồi-quy,
không phải cải thiện; n = 4 trên Haiku, chưa ai replicate. Rủi ro đã báo cáo
thật: issue #245 «dangerously lazy» (vá triệu chứng bằng diff ngắn nhất).

Kit đã có luật mạnh hơn cho đúng việc này: sửa bug = root cause, grep mọi caller.

## 5. Chồng `claude-code-tips` — CBM · context-mode · enforcement hooks

**Bác theo gói.** Kho không có đo riêng; mọi con số là chép lại tuyên bố thượng
nguồn. `CBM` (codebase-memory-mcp) và `context-mode` đều là MCP server — định
nghĩa tool của chúng nằm trong prefix, tức **trả 2 294 lần ở giá ghi-cache**.
Chính tác giả chồng tự khai phiên ngắn bật đủ MCP thì đắt hơn bản gốc.

`enforcement hooks` (`bash-ban-raw-tools` cấm `cat/head/grep` trong Bash) áp cho
tác tử con — với kit, đó là chặn đúng đường mà eval nghiệm thu dùng.

---

## Việc CÒN SỐNG, khác hẳn — đừng đọc file này thành «không làm gì»

Ba việc rẻ hơn mọi kho trên, không kho nào chạm tới. Chi tiết ở finding mục 5:

1. **Prefix cache giữa tác tử anh em — ĐÃ ĐO: không chia sẻ.** Sonnet đi từ 2
   lên 32 tác tử mà ghi-cache mỗi tác tử chỉ giảm 6 %; chia sẻ thật phải giảm
   cỡ 10 lần. Khoản **630 USD tăng tuyến tính theo số tác tử**. Còn lại là chốt
   nguyên nhân trong ba ứng viên (TTL 5 phút · schema khác nhau giữa vai trò ·
   nhịp giữ) — cả ba đều là cấu hình, không phải vật. *Việc đáng làm nhất.*
2. **`wf-usage` in thêm cột ghi-cache + cột tiền.** Trường đã thu ở `:68`, bảng
   vai trò ở `:192` bỏ trắng. Dòng 4 của luật (c) đang đọc hoá đơn thiếu nửa
   tiền. *TRỪ-sửa.*
3. **Cắt sử liệu khỏi `CLAUDE.md`**, giữ nguyên bất biến — 36–51 USD. *TRỪ.*

Và một việc **CỘNG, cần owner phê duyệt** (ADR 0018): agent type hẹp cho làn
`machine`/`refute` (`omitClaudeMd: true`), hai làn chiếm 1 520 / 2 294 tác tử.

## Prior requests

- 15/09: owner giao research bốn kho → bác cả bốn, thu về ba việc TRỪ/đo + một
  đề xuất CỘNG chờ Cổng Phạm vi.
- Ai muốn mở lại bất kỳ kho nào: đọc bảng «% tiền» ở đầu file TRƯỚC, rồi chỉ ra
  kho đó chạm cột nào. Không mở lại vì «kho đó thêm nhiều sao» hay «có bản mới»
  — điều đó luôn đúng, không phân biệt được gì.
