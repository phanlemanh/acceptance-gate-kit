---
schema_version: 1
slug: buoc-len-thiet-ke-khong-hoi
feature: Bước lên thiết kế không hỏi người những câu mà người luôn trả lời theo khuyến nghị
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: A2
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

> Mở 11/10 từ hàng A2 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`)
> bằng `node scripts/lo-trinh.mjs --root . --hang A2 --mo-o` (slug máy suy tất định từ câu giao).
> Hàng đứng trên L2 (đã gộp). Hạt giống gốc: `docs/plans/2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md`.

## Vấn đề & ai gặp

Gốc: crm/_acceptance/ke-hoach-la-mot-ban-ghi — 22/09 03:47–03:55Z, bảy câu máy hỏi trong tám phút ở bước lên thiết kế (ba «chọn như đề xuất», bốn «duyệt phần N, trình phần N+1»).
Gốc: crm/_acceptance/sua-luu-tru-dieu-phoi — 21/09 22:27–22:42Z và 22/09 00:10Z, tám câu trả lời (năm «A, …» liên tiếp, ba «đồng ý … chạy luôn»).

**Người gặp:** chủ kho, ở bước lên thiết kế của mỗi vòng. Máy dừng giữa chừng hỏi «duyệt thiết kế
chứ?», «chọn A hay B?», «làm ngay chứ?» — rồi Cổng Phạm vi lại hỏi duyệt cùng thứ đó. Qua chủ kho là
**phiên Claude Code**: chính văn bản bước thiết kế của kit (S1 mục 1: «hỏi đáp làm rõ như thường lệ»,
mỗi câu XIN DUYỆT thiết kế in kèm dòng `/goal`) dạy máy dừng lại. Bản trong đợt của Điều phối – Thợ
(khối DP7) đã bỏ đúng chỗ dừng này; ngoài đợt thì chưa.

**Đo 11/10** (tệp làm chứng ở `do-11-10/`):

| Phép đo | Kết quả |
|---|---|
| Nền 21–22/09, Mac mini (hạt giống) | 28 câu trả lời / 3 vòng crm · **0** câu chọn khác khuyến nghị |
| Sổ S1 của crm, cả hai máy, 22/09–11/10 (`so-s1-crm.md`) | 69 dòng ghi «chủ kho chọn/chốt» ở 41 vòng. Máy xếp: **22** căn cứ là mục tiêu + quy tắc đã khai · **6** chỉ một lối ra sống (vd ba dòng «bỏ bản mẫu / bỏ ô nhìn / bỏ đặc tả giao diện» của một vòng không chạm màn vẫn đem hỏi) · **23** chỉ người có (gu nhìn giữa ba hướng, nghĩa sản phẩm, xoá dữ liệu, gửi bản vá ra ngoài, gộp/tách phạm vi) · 18 không phải câu giữa S1 |
| Xu hướng, cùng sổ | tuần 39: 7/67 vòng có lựa chọn của chủ kho ở S1 · tuần 40: 20/47 · tuần 41: **14/65** — chưa tự tan |
| Transcript máy này, 23/09–11/10 (`transcript-may-nay.md`) | 47 vòng có bước thiết kế. 18 câu máy hỏi: **10** có căn cứ máy đã có → **10/10 theo khuyến nghị** · **8** chỉ người có → **0/8** theo khuyến nghị (người trả lời bằng ý định mới, sự kiện, chính sách). Trong vòng chỉ 5 câu; 4 là «duyệt thiết kế?» đúng khuyến nghị, 1 bị bác (`tac-nhan-model-rieng`: máy chọn một model cho cả hệ, chủ kho bác) |
| Phủ của mẫu | crm ký **192** vòng từ 22/09; transcript ở máy này thấy khoảng 36 — phần còn lại chỉ đo được qua sổ |

**Đọc:** khoảng **55 %** (28/51) lựa chọn chủ kho trả lời ở S1 có căn cứ máy đã có — trạm thu phí.
**45 %** (23/51) là câu thật, và trên mẫu transcript người trả lời KHÁC máy ở cả 8/8 câu loại này.
Nghiệm không phải «bỏ hỏi» mà là **chia theo nguồn căn cứ**: loại một và hai máy tự quyết, ghi sổ, mở
cửa veto; loại ba vẫn là câu hỏi — nhưng gom vào Cổng Phạm vi, không dừng giữa S1.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Phần lớn câu ở S1 có căn cứ máy đã có, và người trả lời theo khuyến nghị | bỏ câu hỏi là cắt mất ý người → vòng bị trả ở Cổng Phạm vi | đếm trên sổ crm + transcript | **Đã thử:** 28/51 sổ crm; 10/10 transcript theo khuyến nghị |
| 2 | Câu chỉ-người-biết gom vào Cổng Phạm vi (sau khi máy đã soạn nháp theo khuyến nghị) không làm vòng bị trả nhiều hơn hôm nay | người chọn khác ở 8/8 câu loại này → mỗi lần chọn khác là soạn lại S1 + ký lại Cổng Phạm vi, đổi một lượt giữa S1 lấy một lượt ký lại | phát lại 23 dòng «chỉ người có» của crm: dòng nào đổi lối mà không phải viết lại tiêu chí | Chưa thử — đo ở S1 |
| 3 | Máy phân được nguồn căn cứ đúng: không tự quyết một câu chỉ-người-biết | máy lặng lẽ chọn hộ chủ kho (ca `tac-nhan-model-rieng`) — đúng thứ nguyên tố 1 cấm | 23 dòng «chỉ người có» + ca model làm ma trận đỏ; 28 dòng có căn cứ làm ma trận xanh | Chưa thử — đây là chiều đỏ của vòng |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Số lượt gọi người ngoài thiết kế ở bước thiết kế của crm về 0 trong ba vòng liền, không vòng nào bị trả vì thiết kế sai» chưa?
- Kết quả nào là SỐNG: [đề xuất] ba vòng crm liền sau khi crm nhận mốc mang A2: 0 lần máy dừng hỏi giữa mở vòng và Cổng Phạm vi, và 0 vòng mà Cổng Phạm vi phải ký lại vì một lựa chọn máy tự quyết ở bước thiết kế bị người lật
- Kết quả nào là CHẾT: [đề xuất] hết timebox chưa đạt, hoặc ≥ 1 vòng crm có câu chỉ-người-biết bị máy tự quyết rồi người lật ở Cổng Phạm vi
- Timebox: [đề xuất] 2026-11-01 (mốc kế sau đợt thử, cùng DP6 · L3 · X2 · S3 · G2 · G3 — hàng đã gắn mốc này); không cắt mốc trong vòng này

## Kết quả prototype

Không dựng prototype — vật là luật của bước thiết kế và một khối trên thẻ Cổng Phạm vi; ca thử là
chính 69 dòng sổ crm và 18 câu transcript ở `do-11-10/`.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Sổ quyết định S1 của crm làm dữ liệu thử | `crm` `27d47de04:_acceptance/*/decisions.jsonl` | dữ liệu đo | có — chỉ đọc; bộ kiểm dựng bản sao bằng mã theo hình dạng của nó, không chép tệp crm vào kit | — |
| Khối «Trong đợt» của DP7 | `feature-loop/skills/feature-loop/SKILL.md` khối TRONG-DOT | luật của kit, máy M5 giữ | có — chỉ đọc, A2 khớp theo nó; KHÔNG sửa khối | — |
| Skill brainstorming | `superpowers:brainstorming` (bên thứ ba) | skill ngoài | không sửa — bước thiết kế của kit nói cách chạy nó | — |

## Cổng 0

- **decision = …** Căn cứ: …
- **disposition = …** Căn cứ: — (không prototype)
- **Ngưỡng UAT chốt cùng lúc ký:** bốn dòng của mục «Ngưỡng chết / ngưỡng UAT» — tiền tố đề xuất gỡ cùng chữ ký.

**Máy khuyến nghị:** `build`, hạng **T3** (theo hàng lộ trình và lời giao; đường tệp dự kiến không
chạm `t3_paths` nên máy suy T2 — máy không tự đổi), **một vòng**, có Gate 1.5, trần 4 lượt gọi người.
Cỡ dự kiến 11 tiêu chí (bảng dưới). Phần TRỪ (bỏ câu xin duyệt giữa S1) đi như thường; phần CỘNG
(trường nguồn căn cứ trên dòng sổ + răng chiều đỏ) trình đích danh ở Cổng Phạm vi theo luật CỘNG.
Cân trên mọi kho (luật 26/09): kho không có đau mất hỏi-đáp giữa S1, nhưng câu chỉ-người-biết vẫn lên
Cổng Phạm vi; phiên brainstorm khám phá người gọi thẳng (ngoài vòng) không đổi; dòng sổ cũ không có
trường nguồn đọc được, cờ vàng, không đỏ.

## Thước đo thành công → ứng viên criterion

1. Ngoài đợt, bước thiết kế không dừng xin duyệt thiết kế hay hỏi «làm ngay chứ?»; trong đợt giữ nguyên khối DP7.
2. Mỗi lựa chọn ở bước thiết kế thành một dòng sổ mang nguồn căn cứ (mục tiêu + quy tắc · một lối ra · chỉ người có) và khó-đảo có/không.
3. Dòng nguồn «mục tiêu + quy tắc» mang con trỏ tới chỗ khai (tệp + câu trích); dòng «một lối ra» nêu lối đã chết vì sao.
4. Lựa chọn chỉ-người-biết hoặc khó-đảo lên thẻ Cổng Phạm vi thành CÂU HỎI (khuyến nghị + lối khác + giá đổi), không thành dòng «đã quyết».
5. Thẻ Cổng Phạm vi tách khối «máy đã quyết ở bước thiết kế» (căn cứ trích nguyên văn, cửa veto) khỏi khối câu hỏi.
6. Chiều đỏ: dòng máy tự quyết mà nguồn là chỉ-người hoặc khó-đảo → ĐỎ có tên; dòng nguồn «mục tiêu + quy tắc» mà câu trích không có ở tệp đã trỏ → ĐỎ.
7. Chiều im: dòng sổ cũ không có trường nguồn → đọc được, cờ vàng, không đỏ; hồ sơ đã ký không đổi màu.
8. Ma trận ca thật: 23 dòng «chỉ người có» của crm + ca model phải ra câu hỏi; 28 dòng có căn cứ ra «đã quyết» — so bằng nhau, không đếm dấu.
9. Người chọn lối khác ở Cổng Phạm vi cho một câu đã khai giá đổi → máy áp lối đó trong cùng lượt ký, không xin ký lại.
10. Bộ đếm lượt máy dừng hỏi ở bước thiết kế trên transcript (đường đo cho ngưỡng), chạy được trên máy nào có transcript.
11. (judgment / nhìn) Trên một hồ sơ crm thật, thẻ Cổng Phạm vi đọc trong một phút: biết máy đã quyết gì, còn hỏi gì.

## Out of scope từ khám phá

- **Khối TRONG-DOT** của `feature-loop/skills/feature-loop/SKILL.md` (DP7, máy M5 giữ) — cần đổi thì báo phiên điều phối.
- **`feature-loop/scripts/`, `feature-loop/workflows/`** (M5) · **`scripts/cat-luot.mjs`, `skills/cat-luot/`** (S3b) · **cửa tín hiệu** (L3) · **`dieu-phoi/`**.
- **Luật cỡ vòng ở bước thiết kế** — hàng S3c, mở SAU A2.
- **Phiên brainstorm khám phá ngoài vòng** (người gọi thẳng brainstorming, chưa có ô) — ở đó ý định đang hình thành, câu hỏi là đúng chỗ.
- **Sửa skill brainstorming bên thứ ba.**
- **Đếm lượt gọi người trên Mac mini** — transcript nằm ở máy kia; vòng này đo bằng sổ cho phần đó.
