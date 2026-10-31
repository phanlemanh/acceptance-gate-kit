---
schema_version: 1
feature: Mã lượt chạy chỉ được ghi khi đúng hình dạng mã — mã rác của tác tử (dấu huyền, chữ không có số, chuỗi có khoảng trắng) thành mã máy đúc, và lượt sau không mang sang eval có mã rác trong sổ cũ
slug: run-id-danh-sach-cho-phep
owner: phanlemanh@gmail.com
risk_tier: T2      # chạm feature-loop/workflows/** và feature-loop/scripts/** — không trong risk_tiers.t3_paths
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-31T16:59:39Z
design_doc: _acceptance/run-id-danh-sach-cho-phep/design.md
---

# Acceptance Contract: run-id-danh-sach-cho-phep

## Context

Ở crm `rang-hang-cong-cu` (kit 2.36.0) tác tử chạy lệnh máy trả `runId` là một dấu huyền «`» cho lệnh không in
run_id; bộ chấm chỉ bóc nháy nên ghi «`» vào sổ lượt chạy, và bước tính mang sang của lượt 2 mang nguyên mã hỏng
sang — phiên crm phải xoá tay eval khỏi đối số lượt 2 (issue #467). Nghiệm đúng tầng: MỘT luật hình dạng mã (danh
sách cho phép, khối `RUN-ID-HINH` của bộ chấm) cho mọi bên viết và cho bước tính mang sang; mã không đạt thì máy
đúc mã như khi trống; sổ cũ chứa mã rác thì eval chạy lại kèm một dòng lý do. Người hưởng: chủ kho của mọi kho
tiêu thụ — lượt chấm lại không cần sửa tay. Trace nguyên tố 2 (bằng chứng không tự dối).

Source input: ô `_acceptance/run-id-danh-sach-cho-phep/opportunity.md` (Cổng Đáng: chủ kho «Mở cả bốn», 31/10).

## Criteria

- AC-1: Given ma trận viết trước 16 mã tác tử khai mà không phải mã lượt (`` ` ``, ``` `` ```, `` `abc123` ``, `""`, `''`, `"''"`, ba khoảng trắng, `none`, `null`, `abc`, `rid 12`, `a/b-12`, `L08`, `-12ab`, `_ab12`, một mã 201 ký tự có số) và 9 mã hợp lệ (`rid-a1`, `"rid-e9"`, `'rid-e9'`, `run-1 # ghi chu`, một UUID, một dấu thời gian ISO, `minted-demo-E1-r1`, `vitest_run.42`, một mã đúng 200 ký tự), When bộ chấm ghi dòng sổ cho eval E1 của lượt 2 với từng mã, Then 16/16 mã rác thành `minted-demo-E1-r2` và 9/9 mã hợp lệ ghi đúng giá trị đã bóc (`rid-e9`, `run-1`, còn lại nguyên văn); và bản gốc `115100b6` (dựng trọn trong lượt) cùng bản sao bỏ riêng phép xét danh sách cho phép đều ghi «`» cho mã «`»; ba bản sao mỗi bản nới riêng MỘT vế của khối luật (độ dài dưới `{0,199}`, ký tự đầu, độ dài trên `{3,}`) giữ đúng mã vế ấy chặn (`L08`, `-12ab`, mã 201 ký tự).
- AC-2: Given cùng hai ma trận, When bộ chấm ghi dòng sổ cho lệnh suite `bash t/s.sh` của lượt 2, Then 16/16 mã rác thành `minted-demo-SUITE-bash_t_s_sh-r2`, 9/9 mã hợp lệ ghi đúng giá trị đã bóc; bản gốc và bản sao bỏ phép xét đều ghi «`».
- AC-3: Given một lượt chấm 1 thật với 25 eval, mỗi eval một lệnh, tác tử khai lần lượt 25 mã của hai ma trận, sổ có sha, When chép từng `run_id` bên viết ghi vào khuôn khối báo cáo rút từ marker `SUITE-BLOCK-TEMPLATE` của khuôn báo cáo rồi đọc lại bằng bộ đọc báo cáo và tính mang sang lượt 2 không có thay đổi vật, Then 25/25 mã đọc lại đúng chính nó, dài ≥ 4 ký tự, và carry-plan mang sang đủ 25 eval với đúng `run_id` lượt 1; chiều đỏ của phép đọc lại: khuôn bọc `{run_id}` trong dấu huyền thì bộ đọc trả mã kèm dấu (lệch, không im).
- AC-4: Given eval E1 được giao mang sang với `run_id` là `` ` ``, ``` `` ```, `` `abc123` ``, `none`, `rid 12`, When bộ chấm chạy lượt 2, Then với 5/5 mã E1 chạy lại (có lời gọi tác tử cho lệnh của nó), sổ có đúng một dòng E1 mang mã mới và không mang `carried_from_round`; đối chứng: `run-that-123` vẫn được mang sang (không chạy lại, `carried_from_round: 1`); bản gốc mang «`» sang.
- AC-5: Given kho git sinh trong lượt, ba eval mỗi eval một lệnh, lượt chấm 1 do bộ chấm BẢN GỐC chạy với tác tử khai «`» cho lệnh của E1 (sổ cũ hỏng, giống crm), rồi một nhát sửa vật chạm tệp của E2, When `s4-args` bản mới sinh đối số lượt 2 với `--carry-anchor`, Then chỉ E3 được mang sang, stderr có dòng `s4-args: E1 không mang sang — run_id lượt trước sai hình dạng ("`")` và không dòng nào cho E3; `s4-args` bản gốc trên cùng kho mang E1 với «`»; đối chứng dương: lượt 1 do bộ chấm BẢN MỚI chạy thì E1 mang `minted-demo-E1-r1`, lượt 2 mang [E1, E3] và không in dòng «sai hình dạng».
- AC-6: Given bản sao trọn `feature-loop/` và `lib/` cùng một sổ lượt 1 có E1 «`» và E2 mã đúc, When carry-plan của bản sao chạy trên (a) bản sao nguyên vẹn, (b) bản sao mà khối `RUN-ID-HINH` của bộ chấm bị nới thành nhận mọi chuỗi, (c) bản sao gỡ khối ấy, Then (a) chỉ mang E2 và lý do của E1 bắt đầu `run_id lượt trước sai hình dạng ("`")`, (b) mang cả E1 lẫn E2 (carry-plan theo đúng luật của bộ chấm, không giữ bản chép riêng), (c) thoát 2 với stderr `carry-plan: không rút được luật hình dạng run_id (khối RUN-ID-HINH)`; khối khớp đúng một lần trong bộ chấm.

## Coverage

- Trục A — bên chạm mã lượt: ghi dòng eval | ghi dòng suite | nhận eval mang sang (bộ chấm) | tính eval mang sang (carry-plan, qua s4-args) | đọc báo cáo (bộ đọc bằng chứng, thẻ Cổng 2).
- Trục B — hình dạng mã tác tử khai: rỗng/khoảng trắng | chỉ nháy | họ dấu huyền | chữ trơn không có số | quá ngắn | có ký tự ngoài danh sách (khoảng trắng giữa, `/`) | hợp lệ bọc nháy | hợp lệ kèm ghi chú `#` | hợp lệ trơn (mã đúc, UUID, dấu thời gian, `_` và `.`) [thước CE: đo 31/10 trên run-log của kit (8 925 dòng eval, 14 không đạt — đều rác) và của ba kho tiêu thụ có trên máy: crm 14 431 dòng, 296 không đạt (238 là chuỗi mô tả, danh sách, nháy, dấu huyền; 58 chỉ thiếu chữ số, phần lớn mã 12 chữ thường dạng `muhojuyndvnp`); onehub-invest 2 793 dòng, 16 không đạt (mã có khoảng trắng); onehub-quy-hang 710 dòng, 0].
- Trục C — tuổi sổ: sổ do bản gốc ghi (đã hỏng) | sổ do bản mới ghi.
- Ô Core: A1×B (AC-1) · A2×B (AC-2) · A1×B×A4 + A5 khứ hồi (AC-3) · A3×B3/B4/B6 (AC-4) · A4×C1/C2 (AC-5) · một nguồn A4↔A1 (AC-6).
- Later: A5 — bên đọc báo cáo không đổi (descope có tên trong sổ quyết định; sau vòng này bên viết không ghi mã sai hình dạng nữa).
- Không quét bằng skill: không gian kê tay ba trục ở trên; phản biện context sạch bổ sung bốn hàng canh riêng từng vế của luật (`L08`, `-12ab`, `_ab12`, 201 ký tự) và đo trên sổ kho tiêu thụ (dòng sổ thay «bỏ coverage-scan»).

## Out of scope

- Đổi bên đọc báo cáo: `extractRunIds` của `lib/evidence-core.cjs` và ngưỡng `>= 4` của `scripts/gate-card.js` (báo cáo đã ký ở các kho giữ màu cũ).
- Sửa sổ lượt chạy cũ của kho tiêu thụ (crm `rang-hang-cong-cu` lượt 1 giữ dòng «`»; lượt sau tự chạy lại).
- Đổi lời dặn tác tử trong khuôn trả về (`runId` «không có thì chuỗi rỗng») — dặn bằng lời không phải nghiệm.
- Mã lượt của dòng ghim lại (`kind: repin`) và của hội đồng — do máy sinh, không qua tác tử.
- Cắt bản 2.36.2 và nâng kho tiêu thụ (phiên điều phối làm sau khi gộp).

## Notes

- Vật: `feature-loop/workflows/acceptance-verify.js` (khối marker `RUN-ID-HINH` + `docRid`) ·
  `feature-loop/scripts/carry-plan.mjs` (rút khối, lý do «sai hình dạng») · `feature-loop/scripts/s4-args.mjs`
  (in lý do ấy). Thước: `tests/scripts/run-id-danh-sach-cho-phep.test.mjs` ca RH1…RH6; hai ca đột biến cũ
  (DR5 của `tests/workflows/doc-ghi-troi.test.mjs`, «W-RID chiều đỏ» của `tests/workflows/acceptance-verify.test.mjs`)
  đổi kim sang dòng `docRid` mới. Khoá eval `executors.script.rh_e1…rh_e6` trong `_acceptance/config.yaml`.
- Giới hạn khai: mã lượt thật mà công cụ của kho in với ký tự ngoài danh sách (`/`, `+`, `@`, khoảng trắng…) hoặc
  không có chữ số sẽ bị thay bằng mã đúc — sổ vẫn có lệnh và mã thoát, chỉ mất liên kết tới mã của công cụ. Đo 31/10:
  crm có 58 dòng (trên 14 431) chỉ thiếu chữ số, phần lớn là mã 12 chữ thường mà phiên crm khai; onehub-invest có 16
  dòng mã kèm khoảng trắng. Phán quyết không đổi: báo cáo chép mã từ bản đồ bộ chấm truyền xuống (cùng mã đúc với sổ),
  không chép từ đầu ra của lệnh.
- Mã ngắn (dưới 4 ký tự) cũng là mã sai hình dạng: sổ cũ của một kho mang mã như thế thì eval CHẠY LẠI ở lượt sau
  thay vì mang sang — hướng an toàn, trả bằng giờ máy, không đổi phán quyết. Ca BG9 của bộ kiểm giải nháy dựng sổ
  với mã `r-1` nên đỏ ở lượt chấm 1; mẫu đổi sang `run-1`, vật không đổi. Đo 31/10 trên dòng eval của sổ lượt chạy
  (lệnh `_acceptance/run-id-danh-sach-cho-phep/do/do-ma-ngan.mjs`): mã ngắn mà đúng dạng chữ-số — kit 1/8 925
  (`L08`, mã nhóm tác tử chép nhầm), crm 1/14 431 (`E18`, tên eval chép nhầm), onehub-invest 0/2 793, onehub-quy-hang
  0/710; không kho nào có mã lượt thật ngắn hơn 4 ký tự — mã `r-1` chỉ có trong mẫu kiểm.
