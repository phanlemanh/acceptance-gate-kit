---
schema_version: 1
slug: luat-lai-may-duoc-hoi-quy
feature: Luật lái máy đổi thì phải được kiểm hồi quy như code — hook cấm nới thước lúc chữa mã, vật-hoá thứ tự ghi run-log, ADR làn V và tách nhiệm vụ
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: park   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Mạnh
decided_at: 2026-09-18    # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

> **Xếp lại (park) 18/09 (luật «ô chỉ mở khi có neo ngoài»).** Chưa kho nào gọi tên ô này —
> chữ giữ nguyên, không xoá. Mở lại = thêm dòng `Gốc:` vào section «Vấn đề & ai gặp» và
> đổi `decision:` về rỗng và `stage:` về `discovery`.

## Vấn đề & ai gặp

Sản phẩm thật của kit là 23 file lời dặn (SKILL.md, lệnh, hook). Ba bất biến trong đó đang sống
bằng LỜI DẶN, không bằng vật máy giữ: không hook nào cấm nới thước trong vòng sửa mã; thứ tự ghi
`run-log.jsonl` trước `evidence-report.md` chỉ là một câu dặn; lý do làn V hợp lệ dù tác giả tự qua
cổng chưa được viết ở đâu (playbook dòng 694). Người trả giá: owner mỗi lần một bất biến trôi mà
không phép đo nào chạm. Đề bài đầy đủ: `docs/plans/2026-09-07-hat-giong-luat-lai-may-duoc-hoi-quy.md`.

> **THU HẸP 2026-09-16 (Mạnh) — cắt vế harness-lite, giữ ba vế một-tầng.**
>
> Ô này ban đầu mang bốn vế. Vế đầu — dựng **harness-lite chạy một skill rồi
> chấm đầu ra** — đã bị cắt khi rà 28 ô theo North Star ngày 16/09: đó là
> **đo-thước-bằng-thước**, đúng tầng hai mà luật chiều rộng (a) của `CLAUDE.md`
> đóng («lưới thường trực là trần; KHÔNG mở vòng đo-thước-của-thước»). Owner đã
> giết vế này một lần ngày 30/08; đường sống duy nhất nó có là luật NỚI 07/09,
> mà luật đó đã bị thay ngày 15/09 (ADR 0018 — CỘNG cần phê duyệt đích danh).
> Lý do đầy đủ + ngưỡng mở lại ở
> [.out-of-scope/thuoc-cua-thuoc-mot-tang.md](../../.out-of-scope/thuoc-cua-thuoc-mot-tang.md).
>
> Ba vế còn lại KHÔNG cùng lớp: mỗi vế là một phép *biến bất biến từ đầu-người
> sang vật-máy-giữ*, ở đúng MỘT tầng. Chúng ở lại trong ô này.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Hook cấm nới `evals.yaml` sau vòng REJECT có lối ra rẻ (entry sổ `fix` gọi tên eval) | hook thành cổng người thứ bảy trá hình | fixture hai chiều: có entry qua, không entry chặn | Chưa thử |
| 2 | Thứ tự ghi sổ chạy trước báo cáo bằng chứng vật-hoá được mà không đổi bên đọc nào | không còn là một phép TRỪ — phải nuôi thêm một khuôn | dựng ngược thứ tự trong bản sao → ca ĐỎ, ghim đúng thông điệp; chạm tệp khác → ca IM | Chưa thử |
| 3 | Lý do làn V hợp lệ viết được thành một ADR mà không nới điều kiện làn V | ADR thành cửa hậu cho tác giả tự qua cổng | đối chiếu ADR với sáu điều kiện xanh-sạch đang chạy | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] người sửa mã có nới được thước của chính mã đó mà không ai thấy không, và hai bất biến còn lại có còn sống bằng lời dặn không?
- Kết quả nào là SỐNG: [đề xuất] hook chặn bản sao nới `expected` không có entry sổ và cho qua bản có entry; đảo thứ tự ghi sổ chạy/báo cáo trong bản sao → ca đỏ ghim đúng thông điệp, chạm tệp không phải hai tệp đó → ca im; ADR làn V ký; 0 lượt gọi người thêm
- Kết quả nào là CHẾT: [đề xuất] hook đẻ thêm một lượt gọi người; ca thứ tự chỉ đỏ được bằng exit khác 0 mà không ghim thông điệp; ADR phải nới điều kiện làn V mới viết được
- Timebox: …

## Kết quả prototype

Chưa dựng. Ba ca ở `evals/` là tài sản đã đóng (30/08) thuộc vế đã cắt, không phải prototype của ô này.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Play «Give Claude a feedback loop» (527), «AI in the PR review loop» (694–695) | The AI-Native SDLC playbook, `docs/research/2026-09-07-ai-native-sdlc-playbook.md` | triết-lý/logic | có | — |
| Play «Continuous evals in CI» (566–569) + ba ca đo skill (PR #120, 30/08) | cùng nguồn trên, và kit `evals/` | vật liệu cho vế harness-lite | **không** — vế đã cắt 16/09 | — |
| Quyết định owner 30/08 (không xin, không chờ, không harness-lite) | memory `plugin-eval-thuoc-cho-skill` | quyết định | có — và đã thành án cắt 16/09 | — |

## Cổng 0

- **decision = …** Ba vế còn lại đều là phép TRỪ hoặc vật-hoá một-tầng, không phải CỘNG; mở khi owner ký, xếp sau ô «Đường lùi phải sống» theo thứ tự gật 07/09.
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** chép từ bullet `[đề xuất]` sau khi người gỡ tiền tố.

## Out of scope từ khám phá

- **Harness-lite chạy skill rồi chấm đầu ra — CẮT 16/09** (tầng hai; hồ sơ ở `.out-of-scope/thuoc-cua-thuoc-mot-tang.md`).
- Không dùng grader `llm` làm xương sống (nhiễu, không seed — ghi 30/08).
- Không viết khuôn ca thứ hai.
