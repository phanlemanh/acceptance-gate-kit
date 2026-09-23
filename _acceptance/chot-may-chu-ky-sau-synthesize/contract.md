---
schema_version: 1
feature: Chốt máy trường-của-người sau bước tổng hợp S4 — workflow tự ép rỗng human_signoff / human_override / bypass_ack và ép verified_at bằng giờ engine trước khi trả báo cáo; tác tử tổng hợp hết quyền viết bốn trường ấy
slug: chot-may-chu-ky-sau-synthesize
owner: phanlemanh@gmail.com
risk_tier: T2      # feature-loop/workflows/acceptance-verify.js + tests/workflows — không chạm t3_paths; vế 2 (lib/, recheck-evidence.cjs) sẽ nâng T3 nếu owner phê
surfaces: [cli, ci]
status: draft      # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by:
approved_at:
design_doc: docs/superpowers/specs/2026-09-23-chot-may-chu-ky-sau-synthesize-design.md
---

# Acceptance Contract: chot-may-chu-ky-sau-synthesize

## Context

Tác tử tổng hợp của S4 viết TOÀN BỘ báo cáo bằng chứng thành một chuỗi, và workflow trả
nguyên chuỗi ấy cho vòng chính ghi đĩa. Bốn trường trong đó không thuộc quyền tác tử: ba chữ
của người (ADR 0002) và giờ đo mà engine đã có. Đo 23/09: 13/84 báo cáo kit và 12/56 báo cáo
crm mang `verified_at` do tác tử đặt, sớm hơn giờ run-log cùng run_id; 6 báo cáo crm mang giờ
TƯƠNG LAI so giờ commit; một chữ ký máy trên hồ sơ crm đã tới bước ghi tệp.
Người hưởng: owner ở Cổng Bằng chứng (chữ ký trên hồ sơ là chữ ký của người, không phải của
máy) · phiên Claude Code chạy S4 ở kho tiêu thụ (không phải gỡ tay trước commit).
Trace: nguyên tố 2 (bằng chứng không tự dối) và ADR 0002. TRỪ theo quyết định owner 23/09:
bớt quyền của tác tử, không thêm luật đọc.

Source input: `docs/plans/2026-09-23-hat-giong-tac-tu-tong-hop-ghi-truong-cua-nguoi.md`
(Gốc: crm `_acceptance/bo-dung-chung-nhan-chuoi` run `wf_e0599192-048`; crm
`_acceptance/tieu-de-cot-doc-tron` run `wf_dee46a14-acb`) · design doc ở frontmatter.

## Criteria

- AC-1: Given báo cáo tác tử tổng hợp trả về có giá trị ở `human_signoff` (frontmatter), `human_override` (khối judgment) và `bypass_ack`, When workflow S4 chạy xong trên harness với tác tử giả ấy, Then `result.report` giữ đủ ba dòng khoá nhưng giá trị rỗng; dòng khoá đã rỗng hoặc chỉ mang chú thích giữ nguyên byte; dòng chú thích bắt đầu bằng `#` không bị chạm.
- AC-2: Given ma trận viết trước — mọi khuôn khối của khuôn báo cáo (eval máy · ui-check · judgment · suite) × (tươi · carry) cộng frontmatter — mỗi ô mang `verified_at` lệch (tương lai 2099 và quá khứ), fixture carry có `verifiedAt` khác `invokedAt`, When workflow chạy xong, Then mỗi `verified_at` ở vị trí trường bằng đúng giờ engine của ô: `invokedAt` cho khối tươi, khối suite và frontmatter; `verifiedAt` gốc của payload carry cho khối carry — so bằng từng dòng, số assert bằng số ô.
- AC-3: Given báo cáo nền sinh bằng code từ vùng chép của khuôn báo cáo, điền run_id rút từ run-log của CHÍNH lượt chạy, When tác tử trả báo cáo nền (đúng) và khi tác tử trả báo cáo nền đã bị tiêm chữ ký + giờ lệch, Then ở ca đúng `result.report` bằng từng byte chuỗi tác tử trả; ở ca tiêm `result.report` bằng từng byte báo cáo nền; số dòng không đổi ở cả hai; và nội dung khối vô hướng (`output: |` chứa chuỗi `human_signoff: X` và `verified_at: 2099-…`) cùng văn xuôi thân báo cáo giữ nguyên byte.
- AC-4: Given `invokedAt` vắng trong args, When tác tử trả báo cáo có ít nhất một `verified_at`, Then verdict `BLOCKED`, `blocked[]` có lý do chứa `chot-truong-nguoi` và `invokedAt`, `report` rỗng; báo cáo không có dòng `verified_at` nào thì verdict không đổi (W14 giữ PASS — không phải tương thích ngược, xem Notes); và `s4-args.mjs`, bên dựng args S4 duy nhất, ghi `invokedAt` dạng ISO vào tệp args nó sinh.
- AC-5: Given chốt đã đổi ít nhất một dòng, When workflow trả kết quả, Then `result.runLog` có đúng một dòng `kind: chot-truong-nguoi` mang số dòng đổi theo từng khoá (bốn số) và `ts` = `invokedAt`; Given chốt không đổi dòng nào, Then không có dòng kind ấy (số dòng run-log của W03 không đổi).
- AC-6: Given khối hàm chốt rút NGUYÊN VĂN từ tệp workflow theo marker, When áp lên MỌI `_acceptance/*/evidence-report.md` của kit, Then mọi dòng khác nhau giữa trước và sau đều mang một trong bốn khoá, số dòng bằng nhau; đối chứng dương: quét ≥ 80 báo cáo và ≥ 1 báo cáo bị chạm; bản sao hàm chạm thêm dòng `verdict:` → ca ĐỎ với thông điệp ghim «cham dong ngoai bon khoa» kèm tên hồ sơ.
- AC-7: Given kho crm đọc qua `git show` ở các ref khai trong lệnh (không chạm cây làm việc crm), When áp cùng khối hàm lên mọi báo cáo đã ký, Then cùng luật im như AC-6 và hai hồ sơ gốc `bo-dung-chung-nhan-chuoi`, `tieu-de-cot-doc-tron` có mặt trong tập quét; kho vắng, không ref nào đọc được, hoặc một hồ sơ gốc không có mặt ở ref đọc được nào → mã thoát riêng với thông điệp «khong doc duoc o day», không bao giờ xanh; một ref lẻ vắng (nhánh đã gộp) chỉ in một dòng khai.
- AC-8: Given bốn bản sao workflow trong bộ nhớ — gỡ lời gọi chốt · bỏ `bypass_ack` khỏi danh sách khoá · khối carry lấy `invokedAt` · khớp khoá ở mọi cột (bỏ luật vị trí trường) — When chạy lại ca AC-1 / AC-2 / AC-3 trên CÙNG fixture, Then mỗi bản sao làm đúng ca tương ứng ĐỎ với thông điệp ghim (dòng còn giá trị · tên khoá · id eval carry · dòng output bị đổi); bản nguyên vẹn XANH trước trong cùng lượt.

## Coverage

Quét hình thái rút gọn (preset test-matrix), đầy đủ ở design doc mục Coverage.

- **Trục A — khoá:** human_signoff · human_override · bypass_ack · verified_at [thước CE: vùng chép của `evidence-report-template.md` + ADR 0002 — SUY-TỪ-REPO] (AC-1, AC-2 toàn phần; AC-8 mutant một khoá).
- **Trục B — vị trí dòng:** frontmatter · khối eval máy · khối ui-check · khối judgment · khối suite · khối carry · nội dung khối vô hướng · văn xuôi thân [thước CE: vùng chép + UI-CHECK / SUITE / JUDGMENT-BLOCK template + `carriedForReport` của workflow] (AC-1, AC-2 toàn phần; AC-3 hai vị trí không-phải-trường).
- **Trục F — trạng thái hồ sơ khi S4 chạy:** chưa ký · đã ký rồi chạy lại S4 qua bảo vệ hết-hạn (chữ ký cũ phải mất — đúng ý) · ghim lại theo release (không đi S4, không chạm chữ ký) [thước CE: SKILL feature-loop «Staleness guard» + «Nghi thức re-pin»] — không cần AC riêng, lý do ở design.
- **Trục C — giá trị:** rỗng · chỉ chú thích · có giá trị · trùng giờ engine · lệch giờ (AC-1, AC-2, AC-3).
- **Trục D — nguồn giờ engine:** invokedAt có · invokedAt vắng · verifiedAt carry (AC-2, AC-4).
- **Trục E — chiều:** đỏ (AC-1, AC-2, AC-8) · im (AC-3 fixture, AC-6 corpus kit, AC-7 corpus crm).
- `[NGÀNH: SLSA v1.0 Build L3]` xuất xứ do nền tảng dựng sinh, bên thuê không giả được — ở đây nền tảng là JS của workflow, bên thuê là tác tử.

## Out of scope

- **Vế 2 của hạt giống — răng bên đọc trong `lib/evidence-core.cjs` / `scripts/recheck-evidence.cjs`** (CỘNG một luật đọc; owner phê đích danh ở Cổng Phạm vi, ADR 0018). Số đo cho quyết: luật «`verified_at` sớm hơn ts run-log» đỏ 13 hồ sơ kit + 12 crm; luật «muộn hơn giờ commit» đỏ 0 kit + 6 crm; luật «chữ ký không có commit `Gate 2 signoff:`» đỏ 37/81 kit + 6/51 crm; chạm `t3_paths` → vòng thành T3.
- Chữa ngược giá trị `verified_at` bịa đang nằm trong 13 hồ sơ kit + 12 hồ sơ crm — chiến dịch ghim lại theo run-log thật, không thuộc vòng này.
- Đổi prompt `synthesize:report` — dặn-bằng-lời không phải nghiệm; chốt máy đứng sau prompt.
- Suite-qua-trần, thẻ Cổng 1 hồ sơ khép, hạt giống S1, hạt giống lớp chép — owner tách riêng 23/09.

## Notes

- Quyết định owner 23/09 (phiên điều phối «Cập nhật kit mới nhất từ github»): vòng meta đầu cửa sổ sau 2.18.1 → mốc 2.18.2; vế 1 + vế 3 TRỪ đi mặc định; vế 2 trình ở Cổng Phạm vi.
- W14 (args thiếu `invokedAt`) chỉ còn đúng cho báo cáo không có `verified_at`; báo cáo thật luôn có nó. Bên dựng args duy nhất `s4-args.mjs` luôn ghi `invokedAt`, nên bên gọi tự dựng args thiếu nó sẽ BLOCKED có tên — đúng ý.
- Giới hạn đã khai, kèm ngưỡng: chốt không xoá chuỗi hình khoá trong khối vô hướng (xoá là làm giả output), mà bộ đọc L3 đếm `human_override` có giá trị ở bất kỳ đâu. Lỗ của bên đọc — vế 2. Ngưỡng mở lại: ≥ 1 báo cáo có `human_override` có giá trị trong khối vô hướng mà không phải output của một test.
- Giới hạn đã khai, kèm ngưỡng: chốt chỉ giữ đường S4 của workflow. Vòng chính vẫn tự tay ghi được `human_signoff` vào báo cáo (đó là đường ký thật của `/signoff`), nên chữ ký do PHIÊN viết ngoài `/signoff` không bị vòng này chặn — đó là việc của vế 2. Ngưỡng mở lại: ≥ 1 hồ sơ có chữ ký không đi qua commit `Gate 2 signoff:` sau ngày vòng này lên `main`.
