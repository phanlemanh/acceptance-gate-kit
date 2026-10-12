---
schema_version: 1
slug: vong-mo-thang-bang-feature-loop
feature: "Vòng mở thẳng bằng Feature Loop, không qua lượt cắt, cũng bị đo cỡ: hợp đồng từ 13 tiêu chí không vào được Cổng Phạm vi khi chưa tách hoặc chưa ghi lý do giữ có tên, hợp đồng 11–12 tiêu chí lên thẻ thành cờ vàng — khoảng đọc từ cùng khối với lượt cắt"
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: S3c
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

> Mở 12/10 từ hàng S3c của lộ trình kit (`docs/plans/lo-trinh-kit.json`), giao bởi Điều phối M5.
> Nhắm mốc phát hành 01/11. Không cắt số, không gắn tag trong vòng: kit đóng băng engine cho crm
> tới sau đợt thử 26–27/10.

## Vấn đề & ai gặp

Gốc: acceptance-gate-kit/_acceptance/vong-la-mot-ket-qua — Out of scope OOS-1 + dòng sổ d-20261011T002900Z-3 (descope, mở lại khi DP7 gộp; DP7 #306 vào main 11/10)

**Ai trả giá:** chủ kho (giờ máy và lượt gọi người của mỗi vòng quá cỡ) và mọi phiên mở vòng ở kho
tiêu thụ. Chính sách cỡ 10/10 (mục tiêu 8–10 · cho phép tới 12 · tách từ 13) hôm nay chỉ có răng ở
**lượt cắt lộ trình** (hàng S3, `cat-luot.mjs`). Vòng mở thẳng bằng Feature Loop không đi qua răng đó,
và chính Feature Loop còn DẠY ngược chính sách ở năm chỗ:

- `feature-loop/skills/feature-loop/SKILL.md` bước S1#3: «Core >15 → hợp nhất nhiều ô thành 1 AC, giữ cap 5-15»
- cùng tệp, bước S1#4 (khuôn sinh hợp đồng): «5-15 AC Given/When/Then»
- `skills/acceptance/SKILL.md` Phase 1 bước 3: «Write 5-15 criteria»
- `skills/acceptance/references/contract-template.md`: «{{5-15 criteria…»
- `GUIDE.md` (mục coverage): «Core >15 thì hợp nhất ô, giữ cap 5-15» — chỗ thứ năm, câu giao chỉ đếm bốn

**Bằng chứng** (đo 12/10, `cat-luot.mjs --co` + đếm nguồn mở bằng bộ đọc tiêu chí chung `lib/ac-line.cjs`):

| Kho | Hồ sơ đã chốt | Từ 13 tiêu chí | Trong đó mở thẳng (không `lo_trinh_ma`) | Chạm trần: nhóm mục tiêu → nhóm phải tách |
|---|---|---|---|---|
| crm (sống) | 225 | 77 (34 %) | 67 | 21 % → **62 %** |
| crm từ 01/10 | 82 | 22 | 12 | — |
| kit | 140 | 21 (15 %) | 20 | 58 % → 57 % |
| kit từ 01/10 | 45 | 8 | 7 | — |
| OneFlow (đợt thử ~27/10) | 41 | 20 (49 %) | 20 | phải tách 75 % (n = 8) |
| media-library · MapPoster · map · floorplanstudio | 46 | 23 | 23 | ít dữ liệu |

Ở crm, cỡ dự báo lượt chấm rõ (gấp ba tỉ lệ chạm trần); ở kit gần như không — đúng như design doc
§3 của `vong-la-mot-ket-qua` đã ghi. Mười hồ sơ ≥ 13 ở crm đi từ hàng lộ trình: cỡ khai lúc cắt
(`tieu_chi`) trôi lên khi hợp đồng thật viết ở S1 — răng ở Cổng Phạm vi bắt cả ca trôi này, không
riêng vòng mở thẳng.

**Cân trên mọi kho** (luật «sửa kit vì sự cố của MỘT kho phải cân trên MỌI kho»):

| Kho | Được gì | Mất gì | Hành vi cũ ai dựa |
|---|---|---|---|
| crm | vòng ≥ 13 phải tách hoặc nói vì sao giữ — nhóm này chạm trần 62 % | một dòng sổ khi giữ | hồ sơ đang `draft` ≥ 13 lúc nâng kit bị giữ ở lối vào Cổng Phạm vi tới khi tách hoặc ghi dòng giữ; hồ sơ đã chốt không bị đụng |
| OneFlow | như crm (75 % chạm trần ở n = 8) | nửa số vòng sẽ chạm răng — một dòng sổ hoặc một lần tách mỗi vòng | như crm; nhận sau đợt thử ~27/10 |
| kit | Feature Loop thôi dạy ngược chính sách của chính kit | dòng sổ giữ cho vòng lớn; không lợi đo được về lượt chấm | như crm |
| kho ngủ | không | không gì cho tới khi mở vòng mới | — |

Thứ tự nghiệm của luật: đây là ĐỔI MẶC ĐỊNH (mọi kho trả giá) — biện minh: khoảng là chính sách
CỦA KIT đã chốt 10/10 và đã có răng ở lượt cắt; vòng này chỉ làm Feature Loop nói cùng một luật.
Đường đọc-cũ: răng chỉ đứng ở lối vào Cổng Phạm vi (`status: draft`); hồ sơ từ `approved` trở đi
không bị đọc lại. Neo vào khuôn kit định nghĩa (khối `CAT-LUOT-CO`, khuôn `AC-<số>` của bộ đọc
tiêu chí chung), không vào từ vựng một kho.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| G1 | Vòng ≥ 13 tiêu chí tốn hơn (lượt chấm, chạm trần) ở kho sống | răng chỉ là nghi thức | đồng hồ cỡ trên crm | **đã đo:** crm 21 % → 62 %; kit không phân biệt — chính sách là của kit, đã chốt 10/10 trên chính số này |
| G2 | Phần lớn hồ sơ ≥ 13 không đi qua lượt cắt | răng ở lượt cắt đã đủ, vòng này thừa | đếm `lo_trinh_ma` | **đã đo:** crm 67/77, kit 20/21, OneFlow 20/20 mở thẳng |
| G3 | Lối «giữ có tên» không thành dòng máy viết theo phản xạ | răng thành trạm thu phí: mọi vòng ≥ 13 qua bằng một dòng giữ | đồng hồ cỡ tách số hồ sơ giữ khỏi số hồ sơ không dòng nào | **chưa đo** — đọc ở phiên nghiệm thu 30 ngày |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: ba mươi ngày sau khi giao, hồ sơ mới từ 13 tiêu chí có còn qua Cổng Phạm vi mà không có dòng sổ tách hoặc giữ có tên không?
- Kết quả nào là SỐNG: [đề xuất] 0 hợp đồng mới từ 13 tiêu chí qua Cổng Phạm vi mà không có dòng sổ tách hoặc giữ có tên, ở kit và crm — đọc bằng `cat-luot.mjs --co --tu <ngày giao>`, nhóm `phai-tach`, kèm N (N = số hồ sơ chốt từ ngày giao; N = 0 thì chưa đo được, không đọc thành sống)
- Kết quả nào là CHẾT: [đề xuất] ≥ 1 hợp đồng từ 13 tiêu chí qua Cổng Phạm vi không dòng sổ nào khi hết timebox
- Timebox: [đề xuất] 30 ngày từ ngày crm cài mốc chứa vòng (mốc nhắm 01/11)
