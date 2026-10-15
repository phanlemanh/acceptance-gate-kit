---
schema_version: 1
slug: kho-cam-ket-co-lo-trinh
feature: Kho cam kết có lộ trình thì vòng không thuộc hàng nào bị chặn mở, theo lựa chọn từng kho
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-15T23:29:40Z   # chủ kho gõ «đáng: build · ngưỡng: nhận» ở Cổng Đáng 16/10 — xác nhận luôn ngoại lệ luật (b)
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: RM5
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng RM5 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Gói road-map hoàn tất theo B′ — 19/10/2026.

Kho cam kết có lộ trình thì vòng không thuộc hàng nào bị chặn mở, theo lựa chọn từng kho.

Gốc: crm/_acceptance/tin-hieu-tu-ve-kho/ — lộ trình chỉ có cửa vào; nấc 4 của ADR 0025 (chặn theo lựa chọn từng kho,
giới hạn (ii)), mang theo nấc 3 (mở vòng từ mô tả thì máy tự thêm hàng) mà chủ kho ghi sang hàng này ở Cổng Phạm vi
của RM4 (Hỏi-1). Chủ kho gọi tên «road-map hoàn tất theo B′, làm luôn» 15/10
(`docs/findings/2026-10-14-kien-truc-roadmap-plugin.md`).

**Ai đau:** chủ kho đứng ở biên, đọc bản đồ «xong · đang dở · kế» của kho. Hồ sơ mở ngoài lộ trình không hiện trong
bản đồ ấy tới khi xong; nấc 1 (MC1) chỉ cắm cờ vàng cho hồ sơ ĐANG mở, nên hồ sơ mở rồi đóng nhanh đi qua không ai
thấy. 14/10, sau khi đổi tài khoản, chủ kho mất bản đồ và phải hỏi 4 lượt ngoài thiết kế (ADR 0025).

**Số đo trước — máy đo 16/10** (`lo-trinh.mjs` `phanTichKho` + `git log --diff-filter=A` trên `contract.md` /
`opportunity.md`; kit @cf2fe012, crm cây làm việc @d9eb83536):

| Kho | Hồ sơ mới từ 10/10 | Không nối hàng nào | Đang mở mà không nối (cờ nấc 1 hôm nay) |
|---|---|---|---|
| kit | 40 | 13 (5 là hồ sơ cắt bản `release-2-27…31-0`) | 15 — mới nhất 09/10 |
| crm | 49 | 11 | 10 — mới nhất 30/09 |

Tức ~1/4 hồ sơ mới ở cả hai kho khai lộ trình không thuộc hàng nào, và cờ nấc 1 không thấy chúng vì chúng đã đóng.
Điều kiện (ii) của ADR 0025 («sau một lần phát hành có nấc 1 và 3, vẫn còn ≥ 1 hồ sơ mới không nối») CHƯA đo được —
nấc 3 chưa phát hành; hàng lên lộ trình vì chủ kho gọi tên cả gói 15/10, không phải vì ngưỡng đạt.

**Ý định:** kho nào chọn cam kết (cài `road-map` ở phạm vi kho VÀ bật khoá chặn) thì không hồ sơ mới nào mở được mà
không thuộc một hàng; đường chính không thêm việc cho người — mở vòng từ một câu mô tả thì máy tự thêm hàng (nấc 3),
câu «gắn mốc nào» hiện trên ô ở Cổng Đáng sẵn có. Kho không chọn thì không đổi một byte nào (ADR 0025: nấc bắt buộc
là lựa chọn của từng kho; luật 26/09: bật theo lựa chọn đứng trước đổi mặc định).

**Ngoại lệ luật chiều rộng (b), nói thẳng:** đây là phần tiếp của vòng meta đã gọi tên trước (gói road-map, ADR 0025).
Chữ ký ở cổng này là xác nhận ngoại lệ, không phải máy suy ra từ lời chuyển.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: ở kho thật đầu tiên bật chặn, trong 30 ngày sau khi bật — có hồ sơ mới nào vào nhánh chính
  mà không thuộc hàng nào không, và bao nhiêu lần chặn phải gọi người (thay vì máy tự thêm hàng)?
  Thước: lệnh kiểm của vòng (`--base <commit bật khoá>`) trên kho đó đếm hồ sơ mới không nối; số hàng có `vi_sao` mở
  đầu «Máy thêm khi mở vòng từ mô tả» đếm lần máy tự gỡ; commit đổi/xoá khoá `lo_trinh.chan` đếm lần tắt khoá; lượt gọi người đếm như dòng 2 của luật (c).
- Kết quả nào là SỐNG: 0 hồ sơ mới không nối, và 0 lượt gọi người do chặn.
- Kết quả nào là CHẾT: ≥ 1 hồ sơ mới không nối lọt vào nhánh chính, hoặc chủ kho tắt khoá vì chặn gây việc tay.
- Ở giữa (ITERATE): 0 lọt nhưng ≥ 1 lượt gọi người do chặn — đọc lượt đó để xem lối nào máy chưa tự gỡ.
- Timebox: 2026-11-19. Tới hạn mà chưa kho thật nào bật chặn → ô đo ghi «chưa đọc được ở đây» (nhãn trạng thái, không
  phải CHẾT); kho thử máy sinh trong bộ kiểm đọc được ngay từ lượt chấm.
