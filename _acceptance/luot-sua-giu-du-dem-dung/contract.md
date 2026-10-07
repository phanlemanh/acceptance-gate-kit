---
schema_version: 1
feature: Lượt sửa giữ đủ, đếm đúng — mục ngoài hợp đồng lượt trước không rụng khi tệp bị sửa; khối ui-check carry giữ khung lượt gốc; thước-vật không đếm nội dung nhập từ nhánh nền
slug: luot-sua-giu-du-dem-dung
owner: phanlemanh@gmail.com
risk_tier: T2               # chạm feature-loop/scripts + feature-loop/workflows, không chạm t3_paths
surfaces: [cli]
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-07T02:59:30Z
design_doc: docs/superpowers/specs/2026-10-07-luot-sua-giu-du-dem-dung-design.md
---

# Acceptance Contract: luot-sua-giu-du-dem-dung

## Context

Gốc: crm/_acceptance/don-okr-nhap-sai — S4 lượt 2 ngày 07/10 trên feature-loop 2.24.0 lộ ba lỗ
của kit: (1) ba mục ngoài hợp đồng của lượt 1 (commit crm `6724af405`) rụng khỏi bản findings
lượt 2 vì tệp của chúng bị lượt sửa chạm — crm vá tay ở `0bd50fdd9`; (2) eval ui-check E12 carry
từ lượt 1 mất `screenshot`/`observed`, thẻ Cổng 2 báo không có bằng chứng nhìn-thấy dù khung lượt
1 còn nguyên; (3) sau khi gộp `origin/onehub`, `thuoc-vat.mjs` đếm vật +1780/−12, thước
+1021/−1, nhát 2 với tệp thước của hồ sơ khác. Cả ba tái hiện trên dữ liệu crm bằng `main`
`7b1afe1e`. Thiết kế và phép thử mọi kho ở `design_doc`.

Luật crm: lỗi kit sửa ở kit, không vá ở crm. Vòng này là vòng SỬA vật đã phát hành: không thêm
cờ, không thêm khoá config, không đổi mặc định với kho không gặp ba ca trên.

## Criteria

- AC-1: Given sổ chạy có lượt N−1 với năm dòng `kind: finding` — (a) ngoài hợp đồng trên tệp KHÔNG trong diff sửa, (b) ngoài hợp đồng trên tệp CÓ trong diff sửa, (c) ngoài hợp đồng `unclassified`, (d) trong hợp đồng, (e) ngoài hợp đồng đã carry từ lượt N−2 (`carried_from_round: N−2`) trên tệp có trong diff — When `carry-plan.mjs` tính kế hoạch lượt N, Then `carriedFindings` BẰNG ĐÚNG {a, b, e} (tập viết trước), (a) mang `tepDoi: false` · (b) và (e) mang `tepDoi: true`, `fromRound` của (e) = N−2; và ở đường `noCarry` (sổ thiếu sha) tập vẫn bằng {a, b, e}. Đối chứng dương: (a) có mặt ở cả bản base (`git archive 7b1afe1e` — `main` trước vòng, mốc bất biến; merge-base sẽ trùng HEAD sau khi gộp) lẫn bản mới; chiều đỏ lịch sử: bản base trên CÙNG sổ cho tập thiếu (b) và (e), ghim «mục ngoài hợp đồng rụng: b, e».
- AC-2: Given `s4-args.mjs` chạy lượt fix với `--carry-anchor` trên kho fixture code-sinh có mục kiểu (b) của AC-1, When sinh tệp args, Then `carriedFindings` trong tệp chứa mục đó kèm `tepDoi: true` (round-trip carry-plan → s4-args, không chép hàm); chiều đỏ: bản sao s4-args bỏ khoá `carriedFindings` khỏi tệp → ĐỎ ghim «s4-args làm rơi carriedFindings».
- AC-3: Given workflow `acceptance-verify.js` chạy thật qua `harness.mjs` với `carriedFindings` gồm một mục `tepDoi: false` (fromRound 1) và một mục `tepDoi: true` (fromRound 1), và tác tử tổng hợp trả bản findings KHÔNG in mục carry nào (ba hình dạng: có mục «Ngoài hợp đồng» kèm một mục tươi · có mục nhưng rỗng · không có mục), When workflow trả kết quả, Then `lib/out-of-contract.cjs` đọc `result.findings` ra đủ hai mục carry, tiêu đề lần lượt kết thúc bằng «(r1)» và «(r1 · tệp đã đổi)», mỗi mục có `plain`, `file`, `proposal` của sổ, không cờ `suspect_empty`, mục tươi vẫn còn; tác tử ĐÃ in một mục carry (cùng title VÀ cùng `file`) → mục đó xuất hiện đúng MỘT lần; tác tử in một mục TƯƠI có tiêu đề chứa nguyên văn title carry nhưng khác `file` → mục carry VẪN lên bản findings đúng một lần (khoá chống trùng là cặp title + file). Round-trip sổ: các dòng `kind: finding` mà CHÍNH lượt chạy này phát vào `result.runLog` đưa vào `carry-plan.mjs` lượt kế → `carriedFindings` gồm đủ hai mục, `fromRound` = 1, title KHÔNG mang đuôi «(r…)». Đối chứng dương: `carriedFindings` rỗng → `result.findings` BẰNG HỆT chuỗi tác tử trả. Chiều đỏ: bản sao workflow gỡ bước chèn → ĐỎ ghim «mục carry không lên bản findings»; bản sao khoá chống trùng chỉ-chứa-title → ĐỎ ghim «mục carry bị nuốt bởi mục tươi trùng tên»; bản sao bỏ dòng sổ cho mục carry → ĐỎ ghim «mục carry rụng ở lượt kế».
- AC-4: Given hồ sơ fixture có `evidence-report.md` lượt trước với khối ui-check E2 (`run_id` R, `screenshot: evidence/E2-a.png` có thật, `observed` nhiều dòng ≥ 20 ký tự, `network_observed: clean`) và sổ chạy carry E2 với run_id R, When `s4-args.mjs` sinh args lượt fix, Then mục `carriedEvals` của E2 mang `screenshot`, `observed`, `networkObserved` BẰNG ĐÚNG giá trị trong khối (observed giữ xuống dòng); ba ca phủ định trên CÙNG fixture, mỗi ca không gắn trường nào và stderr có đúng một dòng gọi tên E2 kèm lý do — run_id khối khác R («run_id lệch»), tệp ảnh vắng («ảnh vắng»), khối thiếu observed («thiếu observed»); eval carry executor `test` → không gắn, không dòng stderr. Chiều đỏ: bản sao s4-args bỏ phép so run_id → ca «run_id lệch» ĐỎ ghim «gắn khung của lượt khác».
- AC-5: Given workflow chạy qua harness với `carriedEvals` có E2 ui-check mang ba trường khung, và tác tử tổng hợp trả báo cáo mà khối E2 carry KHÔNG có `screenshot:`/`observed:`, When workflow trả kết quả, Then khối `- eval: E2` trong `result.report` có `screenshot:` đúng đường, `observed:` đúng nội dung (khối vô hướng), `network_observed:` đúng giá trị; `evaluateEvidence` của `lib/evidence-core.cjs` không báo `observedFailures` trên báo cáo đó; và `gate-card.js --extract` trên hồ sơ fixture ghi báo cáo đó cho `ui_observed.present: true, passed: 1`. Round-trip ba lượt: ghi `result.report` đó làm `evidence-report.md` của hồ sơ, chạy `s4-args.mjs` lượt kế với dòng carry E2 cùng run_id → mục `carriedEvals` E2 mang ba trường BẰNG HỆT từng byte giá trị gốc (bên đọc của AC-4 đọc đúng đầu ra bên viết, không khuôn fixture). Đối chứng dương: E2 carry KHÔNG mang trường khung → khối E2 không có `screenshot:` (máy không bịa) và thẻ cho `passed: 0`. Chiều đỏ: bản sao workflow gỡ bước chèn → ĐỎ ghim «khối carry mất khung».
- AC-6: Given hai kho git code-sinh giống hệt nhau tới HEAD của vòng (mốc sàn, các commit vật/thước/hồ sơ của vòng), kho B thêm MỘT merge từ nhánh nền mang commit chạm `_acceptance/khac/rang/x.mjs`, `_acceptance/khac/evals.yaml`, `src/nen.js` và một commit chỉ-thước của nền, When `thuoc-vat.mjs --json` rồi `thuoc-vat.mjs --write` chạy trên hai kho, Then `vat`, `thuoc`, `hoSo`, `nhat`, `lan`, `tepThuoc` của B BẰNG ĐÚNG của A ở cả hai chế độ (vế `--write` đọc lại dòng `kind: thuoc-vat` vừa nối vào sổ chạy), và `tepThuoc` / `tep_thuoc` của B không chứa đường nào dưới `_acceptance/khac/`. Đối chứng dương: hai số của A bằng hằng viết trước của fixture. Chiều đỏ lịch sử: bản base (`7b1afe1e`) trên kho B cho `tepThuoc` chứa `_acceptance/khac/rang/x.mjs` ở cả `--json` lẫn dòng `--write`, ghim «đếm nội dung nhập từ nền».
- AC-7: Given kho B của AC-6 thêm: nền sửa `src/chung.js` (+5 dòng) và vòng sửa `src/chung.js` (+3/−1) trước và sau merge, When `thuoc-vat.mjs --json`, Then `vat` chỉ cộng +3/−1 của vòng cho tệp đó (BẰNG ĐÚNG hằng viết trước); chiều đỏ: bản sao lấy numstat ròng cho tệp chung → ĐỎ ghim «tệp chung đếm cả dòng của nền».
- AC-8: Given kho C có nhánh con tách SAU mốc sàn (mô phỏng worktree `execute-parallel`) mang một commit chỉ-thước, gộp về nhánh vòng bằng merge không fast-forward, và kho D không có merge nào, When `thuoc-vat.mjs --json`, Then ở C commit của nhánh con được đếm (nhát +1, dòng và `tepThuoc` có tệp của nó); ở D toàn bộ stdout BẰNG HỆT bản base (`git archive 7b1afe1e feature-loop/scripts lib`) — kho không gặp sự cố không đổi một byte. Chiều đỏ: bản sao coi mọi cha thứ hai là nền → C ĐỎ ghim «nhánh con của vòng bị bỏ».
- AC-9: Given kho B của AC-6 có hai dòng `round-tally` với sha lượt 1 trước merge và sha lượt 2 sau merge, When `thuoc-vat.mjs --giua-hai-luot`, Then danh sách tệp thước in ra chỉ gồm tệp thước vòng đổi giữa hai lượt, không chứa `_acceptance/khac/`; đối chứng dương: tệp thước vòng sửa giữa hai lượt có mặt; chiều đỏ lịch sử: bản base (`7b1afe1e`) in `_acceptance/khac/rang/x.mjs`.
- AC-10: Given SKILL feature-loop và prompt synthesize trong `acceptance-verify.js`, When đọc, Then prompt bảo tác tử chép khung lượt gốc cho khối carry ui-check (câu cấm cũ đã gỡ); đoạn T5 của SKILL (bước «Mọi verdict») nói mục mang nhãn «(r<N> · tệp đã đổi)» khi lượt sửa chạm tệp; CHANGELOG có mục chưa phát hành nêu ba lỗi và gốc crm. Đo bằng chạy ca: ca rút câu cấm từ CHÍNH bản base (`git show 7b1afe1e:feature-loop/workflows/acceptance-verify.js`) — đối chứng dương: rút được ≥ 1 câu, in nguyên văn — rồi đòi nó vắng ở bản mới; câu tìm không phải danh sách tay; chiều đỏ: bản sao còn câu cấm → ĐỎ ghim tên câu.

## Coverage

- Bỏ quét `morphological-scan`: entry `descope` d-…-2 (không gian là ba lỗi đã định vị, mỗi lỗi
  một trục — vật · bên viết · bên đọc — liệt kê tay đủ). Trục và ô viết tay dưới đây.

| Trục | Ô | AC |
|---|---|---|
| Lỗi 1 — dòng sổ | ngoài HĐ tệp không đổi · tệp đổi · unclassified · trong HĐ · carry chuỗi · sổ thiếu sha | AC-1 |
| Lỗi 1 — bên chuyển | carry-plan → s4-args | AC-2 |
| Lỗi 1 — bên viết bản findings | tác tử in đủ · bỏ sót · không viết mục · in trùng | AC-3 |
| Lỗi 2 — bên đọc khung | khớp · run_id lệch · ảnh vắng · thiếu observed · không phải ui-check | AC-4 |
| Lỗi 2 — bên viết báo cáo + thẻ | tác tử bỏ sót khung · không có khung để gắn | AC-5 |
| Lỗi 3 — hình dạng lịch sử | merge từ nền · tệp chung · nhánh con của vòng · không merge | AC-6, AC-7, AC-8 |
| Lỗi 3 — chế độ lệnh | `--json`/`--write` · `--giua-hai-luot` | AC-6, AC-9 |
| Lời | SKILL · prompt · CHANGELOG | AC-10 |

## Out of scope

- `deltaFiles` của `s4-args` (staleness của carry eval) vẫn gồm tệp nhập từ nền — nền đổi tệp eval
  đo thì eval phải chạy lại; đó là đúng.
- Viết lại hồ sơ đã ký hay hồ sơ đang chạy của crm; crm nhận vòng này qua mốc phát hành.
- Thẻ tự coi khối `carried_from_round` ui-check là có bằng chứng khi không có khung.
- Dùng `git merge-tree --write-tree` (cần git ≥ 2.38; máy này 2.37).

## Notes

- Hồ sơ gốc ở kho crm: `_acceptance/don-okr-nhap-sai/` (run-log lượt 1/2, evidence-report lượt 1
  ở commit `6724af405`, bản vá tay `0bd50fdd9`).
