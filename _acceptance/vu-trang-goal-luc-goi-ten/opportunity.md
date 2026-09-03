---
schema_version: 1
slug: vu-trang-goal-luc-goi-ten
feature: Vũ trang /goal ở mọi lượt người đứng ngay trước đoạn máy — dòng /goal thành vật thẻ Cổng Phạm vi in ra (một nguồn, ba bản chép), điểm in = mỗi câu xin duyệt thiết kế của brainstorm · Cổng 1 · Gate 1.5
owner: manh.phan@onemount.com
stage: decided              # discovery | decided | archived
decision: build        # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-09-03T03:10:00Z    # owner phát ngôn «gọi tên» 03/09 sau khi đọc hình v28-01 (máy điền mốc, ±5 phút)
prototype:
  base_commit:
  disposition:
---

## Vấn đề & ai gặp

Owner, ở mọi vòng có đoạn máy dài (S1 với phản biện context sạch, S3, S4). Ý
định từ 26/07: máy chạy tới **cổng người thật**, không gọi người từng task. Kit
giữ điều đó bằng hai lớp — luật «chỉ dừng ở cổng» trong skill (dặn bằng lời) và
`/goal` của harness (máy giữ) — nhưng lớp máy-giữ **do người vũ trang**, và vũ
trang ở **sai chỗ**: sau Cổng Phạm vi. Đo thật vòng #136 (T3, 02/09): ≥10 lượt
gọi người = 4 cổng thiết kế + ≥6 ngoài thiết kế. Có vết trong repo (findings
02/09 trích owner «hai lần trong cùng phiên»): **2 lần** *máy giao tiến trình
nền rồi khi nó xong thì báo cáo và ngừng nói*, cả hai ở S3 (lần đầu kèm lời khai
«đang chạy» sai); còn lại là 1 rớt mạng và 2 phanh dừng-vá. Hai lần đó đúng ca
`/goal` đỡ được, mà `/goal` chưa bật vì luật «luôn in /goal» trượt. Hồ sơ mốc
2.7.0 gọi tên đây là chỗ cắt của cửa sổ kế.

Bài kiểm North Star, tự khai trước khi mở: vòng này TRỪ lượt người ngoài thiết
kế, không thêm cổng, không thêm tầng thước; người hưởng là owner ở mọi vòng
sau. Hạt giống: `docs/plans/assets/v28-01-goal-truoc-sau.html` (hình là chiếu
của lời đề xuất 03/09, không phải nguồn).

## Phạm vi — hai vật, một nếp

1. **Dòng `/goal` là vật thẻ in ra ở Cổng Phạm vi.** `gate-card.js` mang hằng
   `GOAL_TEMPLATE` trong marker `GOAL-TEMPLATE` (bản chép thứ ba của khuôn — SKILL
   feature-loop · GUIDE · thẻ), xuất `goal_line` qua `--extract` với slug đã thay,
   in trong khối «VIỆC CỦA ANH» ngay dưới dòng lệnh duyệt. Răng: ba bản chép so
   từng byte (nới P85), HTML == extract, đột biến một bản → đỏ.
2. **Điểm in dời về mọi lượt người đứng NGAY TRƯỚC một đoạn máy.** Gap-probe
   S1 (P0) bác điểm «lúc làm»: S0 có câu xác nhận T1/slug và S1#1 là brainstorm
   hỏi-đáp — toàn lượt chờ người, goal vũ trang ở đó kết ngay ở câu hỏi đầu vì
   khuôn cố ý coi «chờ input người» là hoàn thành. Ba điểm đúng: **mỗi câu xin
   duyệt thiết kế của brainstorm** (skill brainstorm có câu «xin duyệt — dừng
   chờ đồng ý» có hình dạng biết trước, nhưng nhiều câu và không biết câu nào
   cuối — nên in kèm mọi câu; với làn V T2 không chạm UI đó là lượt người CUỐI
   của cả vòng), **Cổng Phạm vi** (khi duyệt — vật thẻ in ra), **Gate 1.5** (T3
   — mệnh đề S2#3, chỉ lớp lời). Kèm D5: phản biện context sạch S1 chạy đồng
   bộ để đuôi S1 hết chỗ ngừng. Sửa chữ skill + GUIDE; khuôn goal không đổi.
3. **Nếp, không đổi luật:** S4 đi qua Workflow `acceptance-verify` như luật S3
   đã ghi («KHÔNG tự chạy eval trong main loop») — vòng #136 làm trái. Vòng này
   tự đi đúng đường đó, kể cả khi kit tự host.

KHÔNG làm: hook `Stop` do plugin giữ (lớp 2 — chỉ mở nếu mốc 2.8.0 còn đếm thấy
dừng khi goal đã bật) · làn thẻ Cổng Đáng (ô riêng, cây ghim `528caaa8`) · răng
đo hành vi phiên (không có harness; đo bằng ba dòng số) · ca brainstorm không
hỏi gì (không có lượt người để vũ trang trước Cổng 1 — chưa phủ, đo ở ba dòng số).

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Khuôn goal hiện hành (đích verified · «chờ input người» = hoàn thành · trần 15 lượt) vũ trang ở câu xác nhận thiết kế cuối brainstorm chạy đúng: dừng ở Cổng 1 khi không làn V, chạy tiếp tới verified khi làn V | goal kết sớm (còn lượt hỏi-đáp phía sau) hoặc spin ở cổng | phiên con `claude -p` với goal + hồ sơ giả ở hai trạng thái, đọc transcript | Chưa thử — khai Known limits nếu không đo được trong vòng; gap-probe S1 đã bác điểm «lúc làm» bằng chính chữ SKILL |
| 2 | Owner DÁN dòng goal thẻ in ra (như đã dán câu gộp ở 2.7) | vật thành trang trí | ba dòng số mốc 2.8.0: cột «goal đã bật» | Chưa thử |
| 3 | Bản chép thứ ba trong `gate-card.js` không trôi khỏi SKILL/GUIDE | thẻ in goal sai | P85 nới sang 3 bản + đột biến | Đo trong vòng |

## Ngưỡng chết / ngưỡng UAT

- Mốc 2.8.0: lượt ngoài thiết kế do «phiên dừng giữa đoạn máy» = **0** ở vòng có
  goal đã bật; > 0 → mở lớp 2 (hook Stop) làm vòng meta kế.
- Chính vòng này: đi qua Workflow S4, không phát agent tay; đếm lượt gọi người
  ngoài thiết kế của chính nó vào hồ sơ mốc 2.8.0.

## Nguồn

Luật: CLAUDE.md (c) — chỗ cắt gọi tên trong `_acceptance/release-2-7-0/contract.md`
§ «Chỗ cắt gọi tên cho cửa sổ kế» · findings 02/09 (máy khai đang chạy + bỏ goal)
· findings 26/07 (feature-loop không tự loop) · hình v28-01 · dòng dõi: entry
`d-20260902T203500Z-ngoai5` của #136 (owner chốt «mở hợp đồng mới» cho cặp «khối
Ngưỡng không lột markdown + thẻ chưa render khối /goal sau duyệt») — ô này lấy
nửa sau; nửa «Ngưỡng lột markdown» vẫn mở, chưa có ô.
