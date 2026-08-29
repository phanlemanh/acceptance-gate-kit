# Rà soát tính năng mới của Anthropic / Claude Code cho kit (2026-08-30)

**Câu hỏi:** trong những thứ Anthropic mới ra, cái nào thật sự phục vụ North Star
của kit — *sản phẩm đến tay người dùng nhanh hơn mà vẫn tin được* — và cái nào
chỉ là tính năng hay ho?

**Bộ lọc dùng để cắt** (một mục phải qua ít nhất một câu, nếu không thì loại):

1. Nó **cắt giờ-kit** không? (giờ-kit là chi phí)
2. Nó **giảm số lần gọi người** trên mỗi kết quả ship không?
3. Nó làm **bằng chứng khó tự dối hơn** không?

Cộng luật hiến pháp: *chỉ TRỪ, không CỘNG* — ưu tiên thứ cho phép kit **xoá** đồ
của mình, không phải thứ bắt kit nuôi thêm.

**Phương pháp:** bốn hướng tra cứu song song (Claude Code CLI · `plugin eval` +
`skill-doctor` · Claude API/Agent SDK · CI/cloud/automation), ưu tiên tài liệu
chính thức. Ba mệnh đề load-bearing được **kiểm thẳng trên repo này** thay vì
tin lời tra cứu — kết quả ở §2.

---

## 1. Đáng lấy — xếp theo giá trị

### ① `claude plugin eval` — thước cho SKILL, thứ kit đang thiếu hẳn một tầng

**Vì sao đứng đầu.** Lớp lỗi đắt nhất của kit ba tháng qua là *thước không gắn
vào vật được giao*: đo chỉ dẫn thay vì đầu ra, fixture viết tay theo khuôn bên
đọc, bên VIẾT và bên ĐỌC trôi khỏi nhau. Nguyên nhân gốc mang tính cấu trúc:
**23 file `SKILL.md`/command của kit LÀ hành vi thật, nhưng toàn bộ 6 suite test
hiện có chỉ đo được script và fixture — không suite nào chạy được một skill rồi
chấm đầu ra của nó.** Chỗ trống đó lâu nay được lấp bằng vòng S4 thủ công.

`plugin eval` lấp đúng chỗ đó, và lấp theo cách kit không phải nuôi thêm gì:

- Mỗi ca chạy trong **phiên CLI mới, cô lập, chỉ nạp đúng plugin cần đo**
  (`CLAUDE_CONFIG_DIR` + `HOME` riêng, credential xoá sau khi chạy) — chính là
  điều kiện «context sạch» kit vẫn phải tự dựng bằng tay.
- Grader **đo đầu ra, không đo văn bản chỉ dẫn**: `tool_used` (skill có thật sự
  gọi tool đó không, khớp `input_match`), `tool_order`, `file_exists`,
  `regex` trên `last_message` / `trace` / `files`, cộng `llm` cho phần định tính.
- Chạy nhiều lượt (mặc định 3) → **đo được độ dao động**, thứ kit chưa từng đo.
- `--json` + `--threshold` + exit code 0/1/2 → cắm thẳng vào CI.

Đây là món **TRỪ**: Anthropic nuôi harness, kit chỉ viết ca đo.

**Chặn hiện tại:** đã tự kiểm trên máy này — `claude plugin eval` trong thư mục
rỗng in `plugin eval is currently in early access`, tức **org chưa được bật**.
Muốn dùng phải xin Anthropic bật (biến môi trường enablement không công khai).
Ca đo viết trước được ngay, không cần chờ bật.

**Cảnh báo đúng lớp kit đã dẫm:** grader `llm` nhiễu và **không có seed** — dùng
nó làm thước chính là tái lập đúng bệnh «phép đo không phân biệt được bắt-đúng-lỗi
với chưa-bao-giờ-chạy». Xương sống phải là grader tất định; `llm` chỉ làm lớp phụ.

**Độ tin của mục này:** tính năng ở trạng thái early access **không có trang tài
liệu công khai** — trạng thái «chưa bật» đã kiểm thẳng trên máy, nhưng chi tiết
bên trong (6 loại grader, cơ chế cô lập, cờ) đến từ tham chiếu nội bộ của trợ lý
tra cứu, chưa đối chiếu được với tài liệu. Khi org được bật, việc đầu tiên là
`claude plugin eval --help` để xác nhận lại trước khi viết ca đo theo khuôn trên.

### ② Một job CI chạy được SKILL của kit và trả về kết quả máy đọc

Hai đường chính thức, cả hai đều dùng được vì kit đã là plugin marketplace:

- **GitHub Action** `anthropics/claude-code-action@v1` với
  `plugin_marketplaces` + `plugins` + `prompt: "/acceptance-gate:<skill>"` +
  `claude_args: '--json-schema …'` → đọc output `structured_output`.
- **Headless** `claude -p '/acceptance-gate:<skill>' --output-format json
  --json-schema '…'` → field `structured_output`.

**Vì sao đáng theo North Star:** đây là đường để thẻ quyết định xuất hiện **trên
PR** thay vì chỉ trong phiên. Người quyết ở nơi họ đã đứng sẵn — bớt một lần «mở
phiên» trên mỗi kết quả ship, đúng thước số-lần-gọi-người.

**Hai điều phải thử trước khi tin:**

- Tài liệu nói skill *user-invoked* chạy được trong `-p`; suy ra 6 thao tác cổng
  người của kit (khoá `disable-model-invocation`) vẫn gọi được đường này. **Suy
  luận, chưa có câu tài liệu nói thẳng** — phải thử một lượt.
- Bẫy đúng lớp «assertion âm-tính-một-mình»: `claude -p` **exit 0 kèm lỗi in ra
  stdout** khi lỗi xảy ra *trong* lượt chạy. Cổng kết luận từ exit code một mình
  sẽ **xanh khi chưa bao giờ chạy**. Đối chứng dương bắt buộc:
  `system/init.plugin_errors` rỗng + `mcp_server_errors` rỗng +
  `result.subtype == "success"` + `structured_output` **có mặt** (tài liệu nói rõ
  `subtype: success` vẫn có thể kèm `structured_output` vắng).

### ③ Hai lỗ luật mới lộ ra (không cần tính năng nào, sửa được ngay)

**(a) «Giám khảo TỪ CHỐI» chưa có luật.** API trả `stop_reason: "refusal"` kèm
**HTTP 200** — nội dung có thể không đúng khuôn. Kit đã có luật đúng hình dạng
này một tầng dưới: *verifier bị tool giết = TOOL-KILL, không phải FAIL*. Tầng
giám khảo chưa có luật tương ứng, nên một lượt bị từ chối hiện đọc thành «giám
khảo phán không đạt». Đó là REJECT giả — cùng họ với ca đã đốt một vòng hồi 18/08.

**(b) Ràng vết chạy vào chính khuôn phán.** Nếu verdict của giám khảo đi qua
JSON schema, đặt `run_id` làm `const` trong schema thì **một giám khảo không tái
lập được `run_id` mất khả năng phát ra verdict hợp lệ** — ép buộc ở tầng giải mã,
không phải tầng kiểm sau. Đây là dạng mạnh nhất của «bằng chứng không tự dối»
tìm được trong đợt rà này.

### ④ Nhịp chạy giám khảo: tuần tự-trước-rồi-toả có lý do THỨ HAI

Kit đã đi tuần tự vì bộ phân loại an toàn chặn fan-out (đo được: 7 lượt tuần tự
= 0 chặn · 1 lượt fan-out = 3 chặn). Nay có lý do độc lập: **N giám khảo chạy
song song trên cùng một khối bằng chứng đều trả tiền đầy đủ, không ai đọc được
cache của ai** — mục cache chỉ đọc được sau khi lượt đầu *bắt đầu* trả lời. Nhịp
đúng: gửi giám khảo #1, đợi token đầu tiên, rồi mới bắn phần còn lại.

### ⑤ Điều khiển `effort` theo giai đoạn

Kit đã có `feature_loop.models` chọn model theo giai đoạn; `effort`
(`low`→`max`) là trục thứ hai cùng chỗ. Số Anthropic công bố: chạy tất cả ở
`low` rồi **chạy lại đúng phần trượt** ở mức mặc định cho **cùng tỉ lệ đạt với
một nửa chi phí** — và điều kiện để mẫu này hoạt động là *phải có tín hiệu trượt
thật*, thứ kit có sẵn. Một cảnh báo: đổi `effort` giữa chừng **huỷ cache**, nên
ghim theo giai đoạn, đừng đổi trong một lượt.

### ⑥ Ba đường soi PR khác `/code-review ultra`

Đợt rà cho thấy `/code-review ultra` **không phải** đường duy nhất, và với nghi
thức mới ở GUIDE §6.5 thì hai chi tiết sau đáng biết ngay:

- `claude ultrareview [<PR>] --json` là **subcommand không tương tác**, chờ đến
  khi xong, findings ra stdout dạng thô. Lượt đo đang treo dùng được đường này
  để lấy **số** thay vì đọc bằng mắt. (Ngược lại `claude -p '/code-review ultra'`
  chỉ phóng rồi in link, không chờ, và dừng trước khi tính phí.)
- **Code Review (managed)** là cơ chế khác hẳn: tự chạy theo push, đọc
  `REVIEW.md` để chỉnh khẩu vị, post inline comment + check run có **JSON severity
  máy đọc được** (`{"normal":N,"nit":N,"pre_existing":N}`). Nếu có ngày kit lên
  Team/Enterprise thì đây mới là ứng viên «thành nếp», không phải ultrareview.
  Hiện tại: Team/Ent only, $15–25/lượt → **chưa đụng tới**.

---

## 2. Đã kiểm thẳng trên repo — dữ kiện, không suy đoán

| Mệnh đề | Kết quả |
|---|---|
| `claude plugin eval` đã bật cho org? | **CHƯA** — in «currently in early access» |
| Kit có dùng `claude -p` ở đâu không? | **KHÔNG** — 0 kết quả trong `scripts/ lib/ hooks/ feature-loop/ skills/ .github/`. Bẫy exit-code ở §1② là **rủi ro tương lai**, không phải lỗi đang sống |
| ui-check của kit đã đọc console/network chưa? | **RỒI** — `eval-executors.md` đã gọi `read_network_requests`/`read_console_messages`, và `network_observed` có 7 bucket. Nên «browser use tool» của API **không thêm gì** cho kit |
| `plugin.json` có khai `dependencies` không? | **KHÔNG** — GUIDE §5.1 vẫn bảo người cài tay 4 plugin. Nếu cơ chế khai phụ thuộc là thật thì đây là một món TRỪ (bớt chữ trong hướng dẫn), nhưng tài liệu chưa rõ → phải xác minh trước khi đề xuất |

---

## 3. Cố ý KHÔNG lấy (chỉ TRỪ)

| Món | Vì sao loại |
|---|---|
| Browser-use tool của API | Kit đã đọc console/network qua harness — không thêm gì (§2) |
| Code execution tool làm executor | Sandbox **không có mạng, không có repo, không cài được gói** → không chạy nổi suite của repo tiêu thụ |
| Batch API cho eval | Rẻ 50% nhưng **không có vòng lặp tool phía client** → chỉ hợp executor phán đoán; ba loại còn lại không dùng được |
| Memory tool · context editing · compaction | Harness đã lo; tài liệu chi phí của chính Anthropic nói context editing **tốn hơn phần tiết kiệm** |
| Routines / scheduled chạy cổng | **Đúng theo thiết kế**: fire định kỳ chỉ chạy được skill máy tự gọi được, nên 6 cổng người của kit tới dạng chữ trơ, không thực thi. ADR 0002 sống sót nguyên vẹn trên bề mặt tự động hoá — đây là **tin tốt**, không phải việc phải làm |
| Managed Agents «Outcomes» | Anthropic đã ship đúng vòng *làm → chấm theo rubric → sửa* với giám khảo có context riêng — tức luận điểm của kit là dòng chính. Nhưng **lập luận của giám khảo là hộp đen**, ngược hẳn đánh đổi của kit (bằng chứng đọc được). Giữ làm tham khảo, không lấy |

---

## 4. Bước kế

1. **Xin bật `claude plugin eval` cho org** — việc của owner, một lượt liên hệ.
   Đây là món có tỉ lệ giá-trị/công cao nhất trong cả đợt rà.
2. Viết trước 2–3 ca đo cho một skill (grader tất định) — chạy được ngay khi bật.
3. Hai lỗ luật ở §1③ là ứng viên ô riêng, **đừng gộp** vào việc trên.
4. Lượt đo ultrareview đang treo: dùng `claude ultrareview --json` để lấy số.

Không mục nào ở đây được mở thành ô mà chưa qua Cổng Đáng.
