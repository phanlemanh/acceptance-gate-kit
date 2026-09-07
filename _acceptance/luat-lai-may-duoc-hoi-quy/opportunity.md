---
schema_version: 1
slug: luat-lai-may-duoc-hoi-quy
feature: Luật lái máy đổi thì phải được kiểm hồi quy như code — harness-lite chạy evals/ khi cấu hình đổi, hook cấm nới thước lúc chữa mã, vật-hoá thứ tự ghi run-log, ADR làn V và tách nhiệm vụ
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Sản phẩm thật của kit là 23 file lời dặn (SKILL.md, lệnh, hook). Mỗi mốc phát hành đổi chúng mà
không thước nào chạm: `.github/workflows/gate.yml` chạy sáu suite tất định trên script, không bộ nào
chạy một skill rồi chấm đầu ra. Hệ quả đo được: ≥6 lượt gọi người ngoài thiết kế do hạ tầng phiên
ở mốc 2.7.0, 2 ở 2.8.0. Kit đã viết sẵn ba ca theo khuôn `claude plugin eval` (`evals/`, #120)
nhưng harness đó org chưa được bật; owner quyết 30/08 không xin, không chờ, không dựng harness-lite
(món CỘNG). Luật cộng 07/09 gỡ vế «món CỘNG». Cùng họ: không hook nào cấm nới thước trong vòng sửa
mã; thứ tự ghi `run-log.jsonl` trước `evidence-report.md` sống bằng lời dặn; lý do làn V hợp lệ dù
tác giả tự qua cổng chưa được viết ở đâu (playbook dòng 694). Người trả giá: owner mỗi lần hạ tầng
phiên đốt lượt chấm. Đề bài đầy đủ: `docs/plans/2026-09-07-hat-giong-luat-lai-may-duoc-hoi-quy.md`.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Harness thật (`claude plugin eval`) vẫn early access ở lần dò kế | harness-lite là việc thừa — chỉ cắm ca có sẵn vào harness thật | chạy `claude plugin eval` trong thư mục rỗng, một dòng | Chưa thử lại từ 30/08 |
| 2 | Ba ca hiện có chạy được y nguyên qua `claude -p` + grader tất định | phải viết lại ca → hai khuôn | chạy một ca tay, so đầu ra với `graders/*.md` | Chưa thử |
| 3 | Một đổi SKILL.md cố ý phá hành vi (vd bỏ dòng «không hỏi tiếp chứ») bị ca bắt trước merge | suite chạy mà không phân biệt — thước tự dối | ca cố ý đỏ, đối chứng dương ba ca xanh | Chưa thử |
| 4 | Hook cấm nới `evals.yaml` sau vòng REJECT có lối ra rẻ (entry sổ `fix` gọi tên eval) | hook thành cổng người thứ bảy trá hình | fixture hai chiều: có entry qua, không entry chặn | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đổi luật lái máy có được đo trước merge như đổi code không, và người sửa mã có nới được thước của chính mã đó mà không ai thấy không?
- Kết quả nào là SỐNG: [đề xuất] một đổi SKILL.md cố ý phá hành vi → CI đỏ trước merge, gọi đúng ca; ba ca hiện có xanh qua harness-lite; hook chặn bản sao nới `expected` không có entry sổ, cho qua bản có entry; ADR làn V ký; ≤10 phút/lượt; 0 lượt gọi người thêm
- Kết quả nào là CHẾT: [đề xuất] xương sống là grader llm không seed; suite chạy trên mọi PR; một vấp hạ tầng phiên nữa mà ca không bắt được sau khi đã có ca; thêm lượt gọi người
- Timebox: …

## Kết quả prototype

Chưa dựng. Ba ca ở `evals/` là tài sản đã đóng (30/08), không phải prototype của ô này.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Play «Continuous evals in CI» (566–569), «Give Claude a feedback loop» (527), «AI in the PR review loop» (694–695) | The AI-Native SDLC playbook, `docs/research/2026-09-07-ai-native-sdlc-playbook.md` | triết-lý/logic + YAML mẫu job CI | có | — |
| Ba ca đo skill + README | kit `evals/` (PR #120, 30/08) | vật liệu, khuôn ca | có, giữ nguyên khuôn | — |
| Quyết định owner 30/08 (không xin, không chờ, không harness-lite) | memory `plugin-eval-thuoc-cho-skill` | quyết định, điều kiện mở: xin không hồi âm + có vòng cần thước ngay | có — hai vế còn lại vẫn phải chạm | — |

## Cổng 0

- **decision = …** Mở khi ngưỡng đếm chạm (≥2 lượt ngoài thiết kế do hạ tầng phiên trong một mốc — đã chạm hai mốc liên tiếp) VÀ harness thật vẫn đóng ở lần dò kế; xếp sau ô «Đường lùi phải sống» theo thứ tự gật 07/09.
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** chép từ bullet `[đề xuất]` sau khi người gỡ tiền tố.

## Out of scope từ khám phá

- Không dùng grader `llm` làm xương sống (nhiễu, không seed — ghi 30/08).
- Không chạy suite skill trên mọi PR — chỉ khi đường dẫn cấu hình đổi, trần 10 phút.
- Không viết khuôn ca thứ hai; harness-lite đọc đúng khuôn `evals/` để bỏ được khi harness thật mở.
