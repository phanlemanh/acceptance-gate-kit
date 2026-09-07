---
schema_version: 1
slug: y-dinh-co-nha-rieng
feature: Ý định có nhà riêng — cửa vào và cửa ra không cần người ngồi phiên; tách viết ý định khỏi ký; Cổng Đáng có lệnh ký; ngưỡng UAT thành băng sau phát hành; ba số cho nguyên tố 1
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

Hai đầu vòng của kit chỉ chạy khi owner ngồi trong phiên: ý định sinh ra trong phiên (0/31 ô cơ hội
được ký bằng lệnh — `commands/approve.md` không có chữ Cổng Đáng; `vong-la-mot-ket-qua` 04/09 ghi
«ký trong hội thoại, máy ghi hộ»), và giá trị đo một lần ở phiên nghiệm thu (0/78 hồ sơ trong kho
kit từng tới đó; làn V không bao giờ tới Cổng Giá trị). Người trả giá: người trong đội không phải
owner muốn đưa một ý vào kit; owner phải có mặt ở cả hai đầu. Ba lát A/B/C + thước cho nguyên tố 1
ở `docs/plans/2026-09-07-hat-giong-y-dinh-co-nha-rieng.md` (từ đối chiếu «The AI-Native SDLC
playbook» đọc như chuỗi bàn giao, 07/09). Ranh giới với ô `viec-ke-theo-plan` (06/09): kit đọc ý
định phía plan; nhà ý định ở đây là phía sự thật của cổng (`opportunity.md` `stage: discovery`).

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Có người trong đội (không phải owner) thật sự cần đưa ý vào kit mà không có phiên | lát A là bảo hiểm, không phải nhu cầu | đếm lần nhắn owner «đưa ý này vào» giữa hai mốc (ngưỡng ≥2) | Chưa thử — đang đếm |
| 2 | Lệnh ký Cổng Đáng vào được bằng cách mở rộng `/approve`, không cần lệnh thứ bảy (ADR 0002) | phải mở ADR 0002 — khó-đảo, câu hỏi cho người | đọc lại cây ghim `528caaa8` theo `LAY-VE-LAN-THE.md`; kiểm ba lớp tái phát của `cong-dang-co-cua` | Chưa thử |
| 3 | «Số lần sửa hợp đồng/ô sau khi plan hoặc code đầu tiên đã có» rút được từ git + sổ, không cần trường mới | phải thêm trường → thành đo-thước-của-thước | đếm tay trên 5 hồ sơ gần nhất tại mốc 2.9.0 (n = 1) | Chưa thử |
| 4 | Ở repo tiêu thụ có ≥1 ngưỡng UAT đọc được bằng script tất định qua «Đường đo» | lát C không có đối chứng dương | chờ phiên nghiệm thu thật đầu tiên | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] một ý từ người không phải owner có thành ô nháp trong kho mà không cần phiên máy, owner có ký Cổng Đáng một chạm một PR, và sau phát hành băng vượt có tự mở ô nháp mới không?
- Kết quả nào là SỐNG: [đề xuất] ô nháp commit không cần phiên; ký Cổng Đáng một chạm, một PR; ba số nguyên tố 1 in từ git/sổ; ở ván tiêu thụ băng vượt → ô nháp hiện trong `/start` không ai gõ; 0 lượt gọi người thêm
- Kết quả nào là CHẾT: [đề xuất] thêm lệnh cổng người; máy ký thay người; băng do model phát hiện thay vì script tất định; vòng sửa thứ hai sinh lỗi cùng lớp với `cong-dang-co-cua`
- Timebox: …

## Kết quả prototype

Chưa dựng. Cây ghim `528caaa8` (làn thẻ Cổng Đáng, 01/09) là vật liệu, không phải prototype của ô này.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Play «Capture as intent.md» + «Closing the loop» | The AI-Native SDLC playbook, `docs/research/2026-09-07-ai-native-sdlc-playbook.md` dòng 92–164, 908–1035 | triết-lý/logic — nhà ý định, duyệt bằng merge, băng tất định 1σ/2σ/3σ | có | — |
| Ô `cong-dang-co-cua` + `discovery/LAY-VE-LAN-THE.md` | kit `_acceptance/cong-dang-co-cua/` | vật liệu có sử liệu 2 vòng nổ | có, theo hướng dẫn | — |
| Hạt giống «Vào có ô, ra có tên» | `docs/plans/2026-08-21-hat-giong-vao-co-o-ra-co-ten.md` | triết-lý/logic — cửa vào là con trỏ chết | có | — |

## Cổng 0

- **decision = …** Lát A mở khi ngưỡng đếm chạm (≥2 lần người trong đội phải nhắn owner, hoặc ≥2 ô ký trong hội thoại giữa hai mốc); lát B đếm thử ở 2.9.0; lát C sau phiên nghiệm thu thật đầu tiên.
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** chép từ bullet `[đề xuất]` sau khi người gỡ tiền tố.

## Out of scope từ khám phá

- Không thêm lệnh cổng người (sáu thao tác là danh sách đóng, ADR 0002).
- Không để máy ký thay người ở bất kỳ cổng nào; không để model phát hiện băng.
- Không dựng kho ý định thứ hai ngoài `_acceptance/`; không kit-hoá plan của repo (đó là ô `viec-ke-theo-plan`).
