---
schema_version: 1
slug: lan-ghim-lai-giu-tron-loi-loi
feature: Làn ghim lại giữ trọn lời lỗi và để lại dấu lượt đỏ kèm dòng tự xưng của bàn đo — lệnh đỏ ghi trọn đầu ra ra thư mục lượt chạy và in đường dẫn; làn đỏ để lại một dòng sổ (run_id · lệnh · mã thoát · tải máy); không đổi nghĩa xanh/đỏ
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

> Sử liệu: gói trình lần đầu 02/10 sáng (hai nhát cắt), tự rà cùng ngày đổi thành ba gốc, cân
> trên chín kho buổi chiều thu còn hai món; owner nghe gói lúc 02/10 chiều và gõ «mở ô». Điều kiện
> «trình sau khi crm nhận 2.20.0» đã đạt (crm-onehub#233 gộp `9660bf6c`). Là CỘNG nhỏ, cần owner
> phê ở Cổng Đáng; có kho chờ nhận (crm, mọi vòng kế đều đi qua làn này). Hạt giống:
> `docs/plans/2026-10-02-hat-giong-lan-ghim-lai-giu-tron-loi-loi.md`.

## Vấn đề & ai gặp

Gốc: crm/_acceptance/soan-okr-cung-tro-ly — 02/10: ký Cổng Bằng chứng 07:53, tới 12:40 chưa gộp được; ~10 lượt ghim lại, 5 đỏ không để lại dòng sổ; 6 nguyên nhân đỏ, 0 thuộc vật đang giao; ≥4 lượt gọi owner sau chữ ký; mỗi lần đỏ ≈ +20 phút máy

Làn ghim lại (`feature-loop/scripts/repin-lane.mjs`, 2.20.0) khi một lệnh thoát khác 0 chỉ in
**30 dòng cuối** của stdout+stderr (hàm `runCmd`, dòng ~246); với suite 1507 bài của crm đó là phần
tổng kết, lời lỗi của bài đỏ mất. Làn đỏ thì **thoát 1 và không ghi gì** (dòng ~470), nên lượt đỏ
không tồn tại trong bất kỳ sổ nào — năm dòng số của luật (c) không thấy chi phí này. Hệ quả đo
được 02/10: chẩn đoán đầu tiên của phiên thi công SAI vì đoán thiếu lời lỗi; phải chạy lại toàn kho
ngoài làn mới ra ZodError; lần đỏ thứ hai (`okr-hoi-y.spec.ts` «thứ tự xáo») vẫn không chẩn đoán
được từ nhật ký làn. Gốc thứ ba lộ ở làn kế (13:00): bàn đo là máy dùng chung — Google Drive kẹt
vòng tự khởi động lại (108–174 % CPU mỗi tiến trình con), tải nền 6–10/14 lõi, swap 4,4/5,1 GB;
làn đỏ ở hai bài khác, xanh khi chạy lại toàn kho ngay sau. Nhân quả tải → đỏ CHƯA chứng minh.

Số nền chín kho (đo 02/10, script scratchpad, heuristic): lượt ghim lại — kit 576 (77 % do mốc kit),
crm 281 (58 % do gộp nhánh gốc), oneflow 123, radar 109, media-library 24, floorplanstudio 16,
artifact-platform 2/192 hồ sơ. Người trả giá: phiên điều phối (chẩn đoán từ nhật ký thay vì chạy
lại toàn kho), owner (lượt gọi sau chữ ký), và dòng số luật (c) (chi phí ghim lại vô hình).

**Đã cắt, không mở lại như mới** (tự rà 02/10 + cân chín kho): «chữ ký là bước cuối» — rút, chỉ
dời chuỗi lên trước chữ ký · «chạy lại rồi đi tiếp có cờ» — giữ lại chờ số từ dấu lượt đỏ (một kho
một ngày, nửa do máy; đổi nghĩa «xanh» ở kho không có CI) · «dùng chung bộ nhãn với S4» — bỏ, không
còn người hưởng · «làn chạy theo delta / lấy suite từ CI» — hoãn có ngưỡng · «luật kho ra bộ kiểm
chung» — là tật cách viết thước của crm/oneflow, không phải luật kit.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Dấu lượt đỏ ghi được vào `run-log.jsonl` của hồ sơ dưới một `kind` mới mà bộ đọc 2.20.0 (recheck-evidence, pre-merge-check, evidence-core, thẻ) bỏ qua hoặc cờ vàng, KHÔNG đỏ, và không làm hồ sơ «đổi» theo nghĩa stale | phải ghi ra ngoài hồ sơ (`.acceptance-runs/`) và git không thấy → dòng số không đọc được | chèn tay một dòng `kind` lạ vào run-log của một hồ sơ đã ký trong bản sao kit, chạy `pre-merge-check --recheck-all --base` + `recheck-evidence` + thẻ: phải xanh/cờ vàng | Chưa thử |
| 2 | Tệp log trọn đầu ra ở `.acceptance-runs/<slug>/` đủ để chẩn đoán hai ca thật 02/10 (ZodError «nguồn khoá», «thứ tự xáo») mà không chạy lại toàn kho | gói chỉ chuyển chỗ cắt | lấy hai đầu ra suite thật của crm, cắt 30 dòng cuối vs trọn: lời lỗi nằm ở đâu | Chưa thử |
| 3 | Kho xanh không đổi byte nào: lệnh thoát 0 → không tệp, không dòng sổ | mọi kho trả giá | chạy làn trên một hồ sơ xanh của kit trước/sau, `git status` rỗng cả hai, diff `.acceptance-runs/` rỗng | Chưa thử |
| 4 | Tải máy đọc được tất định trên macOS và Linux CI (loadavg, swap) không cần quyền | dòng tự xưng thiếu ở CI | `os.loadavg()` + `vm_stat`/`/proc/meminfo` đọc thử ở hai nền | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] *sau khi có log trọn và dấu lượt đỏ, phiên điều phối có chẩn đoán được lượt ghim lại đỏ từ nhật ký làn mà không chạy lại toàn kho không, và chi phí lượt đỏ có hiện trong sổ không?*
- Kết quả nào là SỐNG: [đề xuất] trên 10 lượt ghim lại đỏ kế tiếp ở crm + kit: ≥ 8 chẩn đoán đúng từ tệp log (không chạy lại toàn kho để «xem lỗi») · 10/10 có dòng sổ với run_id, lệnh, mã thoát, tải máy · 0 hồ sơ xanh đổi byte.
- Kết quả nào là CHẾT: [đề xuất] < 5/10 chẩn đoán được từ log, hoặc bộ đọc nào đỏ vì dòng sổ mới, hoặc kho xanh đổi byte.
- Timebox: [đề xuất] một vòng T2, trần ba lượt chấm; ngưỡng đọc sau 10 lượt đỏ kế tiếp hoặc 30 ngày sau phát hành, lấy cái đến trước.

## Kết quả prototype

Chưa dựng. Hai đầu ra suite thật của 02/10 (crm, cây `feat/soan-okr-cung-tro-ly`) là vật để thử
giả định 2 trước khi viết mã.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Thư mục lượt chạy `.acceptance-runs/<slug>/` | kit `skills/acceptance/references/eval-executors.md` «Where a run writes its artifacts» | quy ước đã có | có — dùng đúng chỗ, không thêm nhà | — |
| Khuôn dòng run-log `kind: repin` | kit `repin-lane.mjs` + REPIN-TEMPLATE của SKILL | khuôn sổ | có — thêm một `kind` mới, bộ đọc đường đọc-cũ | — |
| Thử lại MỘT lần cho hạ tầng chết | kit `s4-args.mjs` (K8) | luật S4 | KHÔNG kéo sang làn trong ô này (đã cắt) | — |

## Cổng 0

- **decision = …** Đề xuất `build`, hạng T2: sửa `runCmd` (ghi trọn ra tệp, in đường dẫn + 30 dòng cuối) · đường đỏ ghi một dòng sổ `kind` mới kèm tải máy · bộ đọc đường đọc-cũ (cờ vàng) · bộ kiểm hai chiều (tiêm lệnh 200 dòng thoát 1 → log đủ 200 dòng; lệnh xanh → không tệp, không dòng, không đổi byte; dòng `kind` lạ → bộ đọc im).
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** ba ngưỡng SỐNG ở trên; số đọc từ dấu lượt đỏ chính là răng cho các nhát đã hoãn («chạy lại rồi đi tiếp có cờ», «chạy theo delta»).

## Out of scope từ khám phá

- Không thử-lại-tự-động trong làn; không đổi nghĩa xanh/đỏ; không chạy theo delta; không lấy suite từ CI.
  Số cho nhát «chạy theo delta» đã hoãn: hạt giống `docs/plans/2026-10-02-hat-giong-lan-ghim-lai-theo-paths-va-suite-song-song.md` (mô phỏng 70/186 làn crm tránh được, 3 bỏ lỡ, 02/10).
- Không gộp bộ nhãn cạnh gãy của S4 vào làn.
- Không sửa thước của kho (crm/oneflow viết luật kho thành bộ kiểm chung là việc của kho).
- Không chạm hồ sơ đã ký ngoài một dòng sổ loại mới; không ghi bằng chứng khi đỏ.
