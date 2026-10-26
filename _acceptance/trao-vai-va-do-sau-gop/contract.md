---
schema_version: 1
feature: Trao vai giám sát bằng lệnh vai không gắn mã CLI của phiên trao vào giám sát mới, lời dặn chẩn đoán lại khớp hành vi khi nhận mã CLI, và hai phép đo của TC1 thôi đỏ giả cho vòng sau khi TC1 đã gộp
slug: trao-vai-va-do-sau-gop
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, docs]
status: approved
design_doc: _acceptance/trao-vai-va-do-sau-gop/design.md
approved_by: manh
approved_at: 2026-10-26
---

# Acceptance Contract: trao-vai-va-do-sau-gop

## Context

Gốc: acceptance-gate-kit/_acceptance/danh-thuc-doc-nhip-dung-ma/ — chủ kho chọn «mở hợp đồng mới» cho Ngoài-1, 5, 6, 7, 8 ở
Cổng Bằng chứng TC1 (26/10). Ô `_acceptance/trao-vai-va-do-sau-gop/opportunity.md` (Cổng Đáng build 26/10), hàng TC1b.
Thuật ngữ mã app, mã CLI, tệp nhịp: như hợp đồng TC1. **ca đổi thân** = khối một ca `test(...)` CÓ Ở MỐC ĐẦU của tệp
`tests/dieu-phoi/*.test.mjs` mà chữ khác ở mốc cuối (ca mới không tính). **sha chấm TC1** = `e208665fba6bbf3069b2d079c64448b8010ac180` (lượt chấm 3 của
TC1, ghi ở run-log của hồ sơ TC1 — sử liệu, không đổi).

## Criteria

- AC-1: Given đợt có giám sát `local_a` (vai mang `phien_cli` `c-a`), When phiên A chạy CLI thật `vai --giam-sat local_x --phien local_a` với môi trường `CLAUDE_CODE_SESSION_ID=c-a`, Then `vai.json → giam_sat` mang `phien: "local_x"` và KHÔNG có khoá `phien_cli`; rồi với nhịp tươi chỉ của `c-a`, việc chờ và lúc thức 50′, đánh thức trả `bao-chu-kho`. Chiều đỏ: bản sao lệnh `vai` không truyền `phienCli: null` → vai mang `phien_cli: "c-a"` và đánh thức trả `nhan-giam-sat`, hàm kiểm nêu «giám sát mới mang mã CLI của phiên trao».
- AC-2: Given cùng đợt, When phiên A tự nhận lại `vai --giam-sat local_a --phien local_a`, Then với `CLAUDE_CODE_SESSION_ID=c-a` vai giữ `phien_cli: "c-a"`; và với môi trường đã xoá hai biến mã phiên, vai VẪN giữ `phien_cli: "c-a"` (không xoá mã của giám sát đang sống).
- AC-3: Given vai `local_gs`/`c-gs` và tệp nhịp `c-gs` do hook thật ghi, When chạy `chan-doan --json --chi-tiet` ba lần với `--phien local_gs`, `--phien c-gs`, `--phien la`, Then mục `giam-sat` lần lượt là `du`; `thieu` với câu chứa «mã CLI của giám sát hiện tại» và «local_gs»; `thieu` với câu cũ «giám sát hiện tại là local_gs». Chiều đỏ: bản sao bỏ nhánh mã CLI → hàng hai mang câu cũ, hàm kiểm nêu «mã CLI bị mời nhận vai».
- AC-4: Given `dieu-phoi/commands/tiep-tuc.md`, When đọc bước 5, Then không còn cụm «mã CLI cũng nhận» và bước vẫn nói «mã app `local_…`» (ca TC1-08 giữ xanh).
- AC-5: Given một worktree tạm ở HEAD trong đó thân ca `DP3-02 30-giay` của `tests/dieu-phoi/tiep-tuc.test.mjs` và sổ TC1 đều bị đổi, When ca TC1-09 tính tập ca đổi thân, Then tập BẰNG `["(đầu tiep-tuc.test.mjs)", "DP3-09 ma-tran"]` và khớp khoá `ca_doi_than` của sổ TC1 đọc tại sha chấm TC1 — vì mốc đầu là `45e9f2cf…`, mốc cuối là sha chấm TC1 (cả hai qua `git show`), không đọc cây làm việc. Chiều đỏ: bản sao hàm đọc cây làm việc ở mốc cuối → tập chứa «DP3-02 30-giay». sha chấm TC1 vắng khỏi lịch sử (clone nông, gộp squash) → ca BỎ QUA có tên «sha chấm TC1 không có trong lịch sử», không xanh câm, không đỏ.
- AC-6: Given hai văn bản dựng sẵn — một ca một dòng `test('A', () => assert.ok(1));` đứng trước ca `B`, và ba ca sinh trong vòng lặp có thụt lề, When tách bằng `khoiCa` của mô-đun chung, Then ra đủ khoá A, B và ba ca vòng lặp, thân A không chứa thân B; bản tách cũ cột 0 (chép trong ca làm chiều đỏ) cho kết quả khác — nêu ca nào bị nuốt.
- AC-7: Given cùng worktree tạm mà một câu `viec` của chẩn đoán trong `dieu-phoi/scripts/chan-doan.mjs` bị đổi, When ca TC1-06 so đầu ra đọc-cũ, Then bản «mới» là gói rút bằng `git archive` tại sha chấm TC1 (không phải cây làm việc) nên phép so vẫn khớp 8/8; chiều đỏ: bản sao dùng cây làm việc → lệch ở đầu ra «chan-doan». sha chấm vắng → bỏ qua có tên như AC-5.
- AC-8: Given cây sau vòng, When chạy suite `tests/dieu-phoi/**/*.test.mjs` và `node tests/dieu-phoi/hai-moi-truong.mjs`, Then mọi ca xanh ở cả hai môi trường. Ca TC1 bị vòng này đổi thân (TC1-06, TC1-09 cùng phần dựng của chúng) khai trong khoá `ca_doi_than` của một dòng sổ `fix` — để người đọc, không có răng (kiểm «tập đổi thân BẰNG sổ» là bất biến lúc gộp, không thuộc suite của hồ sơ sẽ ký).

## Coverage

Quét hình thái rút gọn — design doc §3. Trục A ai gọi `vai` × B nguồn mã CLI → AC-1, AC-2 · C `--phien` của chẩn đoán →
AC-3, AC-4 · D cây làm việc trôi (đổi thân ca · đổi câu chẩn đoán · sha chấm vắng) → AC-5, AC-7 · bộ tách khối → AC-6 ·
không vỡ ca cũ → AC-8. [NGÀNH: git — đối tượng commit bất biến; `git show <sha>:<tệp>` và `git archive <sha>`].

## Out of scope

- Nới `laGiamSat` để mã CLI được coi là giám sát (lý do ở design §2.2).
- Sửa các tệp ca DP8-11/SDT-07 đang chép bộ tách cũ hay mới — chúng giữ bản của mình.
- Kiểm «tập ca đổi thân của PR BẰNG sổ» cho chính vòng này — bất biến lúc gộp, thuộc lưới trước-gộp, không vào suite.
- Giới hạn đã ghi Known limits ở TC1 (Ngoài-2, 3, 4, 10) — không mở lại; Ngoài-9 (bộ tách cột 0) được TC1b gỡ như hệ quả của AC-6.

## Đường đo

- Ngưỡng của ô → AC-1 (giám sát mới chết được báo), AC-3/AC-4 (lời dặn khớp chẩn đoán), AC-5/AC-7 (ca TC1 im trên commit
  gộp giả). Vế «vòng sau không đỏ giả» đọc bằng CI của PR TC2: chủ kho thấy CI TC2 xanh mà TC2 đổi thân ca ở tests/dieu-phoi.

## Notes

- Sau vòng này TC1-06 và TC1-09 là BẰNG CHỨNG LỊCH SỬ của vòng TC1 (so hai sha cố định), không còn là lưới hồi quy trên cây
  làm việc. Lưới sống cho đường đọc-cũ: ma trận DP3-09 (mã trùng) và TC1-03 (ba biến thể) chạy trên cây làm việc.
