# Hạt giống — Luật lái máy đổi thì phải được kiểm hồi quy như code

**Ngày:** 2026-09-07 · **Trạng thái:** sống ở `_acceptance/luat-lai-may-duoc-hoi-quy/opportunity.md` · **Hạng dự
kiến:** T2–T3 (một job CI + một hook + một ADR; chạm `hooks/` và `.github/`).
**Mở dưới luật cộng 07/09** — đây là món CỘNG, trước 07/09 chỉ được ghi sổ.

**Sinh từ:** «The AI-Native SDLC playbook» (07/09), play *Continuous evals in CI*
dòng 566–569, *Give Claude a feedback loop* dòng 527, *AI in the PR review loop*
dòng 694–695 — cộng chỗ đứt 11 của chuỗi vật kit và phản biện mạnh nhất playbook
có với làn V (mục B2 · B4 · phê bình §4 của
[bản kỹ thuật](../findings/2026-09-07-doi-chieu-ai-native-sdlc-playbook.md)).
Nối thẳng vào ô đang đóng băng `plugin eval` (`evals/README.md`, PR #120,
quyết owner 30/08: không xin, không chờ).

## 0. Tóm tắt một đoạn

Sản phẩm thật của kit là 23 file lời dặn — SKILL.md, lệnh, hook. Mỗi mốc phát
hành đổi chúng, và **không thước nào chạm**: CI của kit chạy sáu bộ kiểm tất
định trên script; không bộ nào chạy một skill rồi chấm đầu ra. Lịch sử
2.4.0 → 2.8.0 đầy «hạ tầng phiên đốt lượt chấm» (≥6 lượt ngoài thiết kế ở 2.7.0)
là hệ quả trực tiếp. Playbook đưa đúng hình dạng: bộ ca chạy **khi `CLAUDE.md`,
skill hoặc hook đổi**, **chặn merge theo tỉ lệ đạt**, **mỗi sự cố thành một ca
vĩnh viễn**; và một hook **cấm người sửa mã nới thước của mã đó**. Kit đã viết
sẵn ba ca theo khuôn `claude plugin eval` nhưng harness đó org chưa được bật.
Hạt giống này là bản **harness-lite** đọc cùng khuôn `evals/`, để khi harness
thật mở thì bỏ được ngay.

## 1. Lỗ — bằng chứng trên nguồn (07/09, main `5c15e065`)

| Số đo | Giá trị |
|---|---|
| `.github/workflows/gate.yml` | 6 suite tất định + `product-map --check`; **không** `schedule:`, **không** lượt `claude -p` nào |
| Ca đo skill đã viết | 3 (`evals/goi-thang-ten` · `kich-hoat-tu-ngu-canh` · `thieu-ho-so-khong-ve-the-ma`), fixture code-sinh, chờ enablement |
| Hook của kit | **1** (`hooks/hooks.json`: `PreToolUse` Write/Edit canh file bằng chứng) — không hook nào cấm sửa `evals.yaml`/test trong vòng sửa mã |
| Bất biến sống bằng lời | thứ tự ghi `run-log.jsonl` **trước** `evidence-report.md` được nhắc hai lần trong cùng mục SKILL, không script nào ép, chỉ có hook phạt sau (ĐỨT 11) |
| Lý do làn V chấp nhận «máy tự qua cổng trên hồ sơ máy viết» | **chưa viết ở đâu** (playbook 694: «the agent that wrote the code has no way to approve it») |

## 2. Điều muốn có

1. **Harness-lite trong CI.** Một job chạy `claude -p` trên từng ca `evals/*`
   (cùng khuôn `prompt.md` + `graders/*.md` + `scaffold.sh` đã có) **khi đường
   dẫn cấu hình đổi** — `CLAUDE.md`, `skills/**`, `commands/**`, `hooks/**`,
   `feature-loop/skills/**` — và theo lịch. Grader **tất định** làm xương sống
   (grader `llm` nhiễu, không seed — đã ghi 30/08). Ngưỡng đạt = **chặn merge**
   cấu hình. Bỏ được bằng một cờ khi harness thật mở — ca không đổi.
2. **Mỗi vấp «hạ tầng phiên đốt lượt» thành một ca.** Nguồn: khối «Ngoài hợp
   đồng» + sổ giới hạn; ca mới chỉ tính xong khi có chiều đỏ trên chính vấp đó
   (khoản khai-sinh-phép-đo).
3. **Hook cấm nới thước lúc chữa.** Sau một vòng S4 REJECT, vòng sửa (S3 mở lại)
   ghi vào `_acceptance/<slug>/evals.yaml` hoặc file test mà eval trỏ tới **mà
   không có** entry sổ `fix` gọi tên eval → hook chặn kèm lối ra: ghi entry, hoặc
   quay hợp đồng về `draft`. Cùng họ với răng `verified_at`; đường đọc-cũ: hồ sơ
   không có vòng đỏ trước → không áp.
4. **Vật-hoá ĐỨT 11:** bên ghi bằng chứng ghi `run-log.jsonl` và
   `evidence-report.md` trong **một** hàm, thứ tự cố định — bỏ hai lời dặn.
5. **ADR một đoạn — vì sao làn V hợp lệ dù tác giả tự qua cổng:** tách-nhiệm-vụ
   của kit **không đặt ở người**, mà ở **lưới ngoài phiên** (sáu điều kiện
   xanh-sạch đo trên vật, CI độc lập với phiên viết, cửa veto có răng). Đây là
   quyết định đã có (đợt 2 «veto có dấu vết», 12/08) nhưng chưa có ADR; phải
   viết để câu 694 của playbook không bị đọc lại như phát hiện mới.

## 3. Ràng buộc

- Không đo-thước-của-thước: harness-lite đo **hành vi skill**, là tầng còn trống
  (memory *plugin eval = tầng thước còn thiếu*), không phải tầng sâu hơn của
  thước đã có.
- Không thêm lượt gọi người; mục 3 chỉ chặn máy, lối ra là ghi sổ.
- Thời gian: suite skill **không** chạy trên mọi PR — chỉ khi đường dẫn cấu hình
  đổi; trần 10 phút/lượt, quá trần là CHẾT.
- Chi phí token của job là **chi phí kit** (giờ-kit) — khai số mỗi mốc phát hành.

## 4. Vì sao chưa làm

Owner quyết 30/08: không xin, không chờ, không dựng harness-lite (món CỘNG).
Điều kiện mở khi đó: *xin không hồi âm + có vòng cần thước ngay*. Luật cộng
07/09 gỡ vế «món CỘNG»; hai vế kia vẫn phải chạm.

## 5. Điều kiện mở lại

- Ngưỡng đang đếm: **≥2 lượt ngoài thiết kế do hạ tầng phiên trong một mốc**
  (2.7.0: ≥6 · 2.8.0: 2 — **đã chạm hai mốc liên tiếp**), **và** harness thật
  vẫn early access ở lần dò kế.
- Vào ô phải mang: ba ca hiện có chạy được y nguyên qua harness-lite (đối chứng
  dương), và một ca **cố ý đỏ** (SKILL bị sửa để hỏi «tiếp chứ?» → ca đỏ).

## 6. Ngưỡng (chép sang ô cơ hội khi mở)

- **SỐNG:** một đổi SKILL.md cố ý phá hành vi → CI đỏ **trước** merge, gọi đúng
  ca; ba ca hiện có xanh qua harness-lite; hook mục 3 chặn bản sao nới
  `expected` không có entry sổ, cho qua bản có entry; ADR mục 5 ký; ≤10 phút/lượt;
  0 lượt gọi người thêm.
- **CHẾT:** xương sống là grader llm không seed; suite chạy trên mọi PR; một vấp
  hạ tầng phiên nữa mà ca không bắt được sau khi đã có ca; thêm lượt gọi người.
