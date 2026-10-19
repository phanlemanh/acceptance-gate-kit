---
schema_version: 1
feature: Lời mời ở cổng chờ người kết lượt bằng chữ thường — dòng lệnh trong khối chữ, trang thẻ gửi bằng công cụ gửi tệp, không đặt dòng lệnh hay chữ quyết vào nút của hộp «bước kế»
slug: moi-cong-khong-qua-nut
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: implemented
design_doc: docs/superpowers/specs/2026-10-19-moi-cong-khong-qua-nut-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-19T15:33:19Z
---

## Context

Hàng KY1, chủ kho quyết 19/10 «Sửa kit: giao MacBook Pro làm ngay» (ô `opportunity.md`). Ở lượt Cổng Bằng chứng của một
kho tiêu thụ, phiên thợ đặt dòng ký vào nút trả lời của hộp «bước kế» của app desktop. App bỏ nút mở đầu «/» hay «!», nút
chứa «@», cắt tin của nút ở 300 ký tự, và bỏ nút khuyến nghị thì mất luôn câu hỏi — người không thấy lời mời. Nút còn điền
sẵn «ký hay trả: ký». Kit có điều khoản về NỘI DUNG lời mời (`GATE-INVITE-CLAUSE`) nhưng không có dòng nào về MẶT đi của nó.

Thuật ngữ:
- **điều khoản kết-lượt-cổng** = khối `GATE-END-TURN-CLAUSE` của `skills/acceptance/references/human-facing-language.md`,
  một dòng.
- **bảng chỗ chép** = khối `GATE-END-TURN-SITES` cùng tệp: mỗi dòng `<đường dẫn> <số bản phải có>`.
- **khuôn kết lượt** = khối `GATE-END-TURN-TEMPLATE` cùng tệp: tin cuối lượt mẫu gồm khối chữ `text` chứa dòng ký và một
  dòng `Hộp «bước kế»: <JSON>`.
- **bộ kiểm kết lượt** = hàm trong ca đo nhận (khuôn hoặc bản tiêm của khuôn) và trả danh sách lỗi có thông điệp ghim.
- **bản tiêm** = bản sao của chính văn bản thật trong lượt chạy, sửa đúng một chỗ (nhát tiêm khớp đúng một lần).

## Criteria

- AC-1: Given tệp luật mặt người, When rút điều khoản kết-lượt-cổng qua marker, Then được đúng MỘT dòng có chữ, đứng
  sau khối `GATE-INVITE-CLAUSE`, và dòng ấy nói đủ ba việc: gửi trang thẻ (`card.html`, `evidence-page.html`) bằng công cụ
  gửi tệp `SendUserFile`, không có công cụ ấy thì in đường dẫn trang; dòng lệnh nằm trong khối chữ `text`, chép đúng như
  thẻ in, ô `___` giữ nguyên; hộp «bước kế» (`wrap_up`) chỉ mang tóm tắt, không câu hỏi, không nút.
- AC-2: Given bảng chỗ chép, When đếm bản chép nguyên văn ở từng đường dẫn, Then số bản bằng đúng số khai — ít hơn hay
  nhiều hơn đều đỏ, thông điệp «<đường dẫn>: ít-hơn-số-khai» / «nhiều-hơn-số-khai»; một bản chép lệch một ký tự thì đỏ
  «<đường dẫn>: bản chép lệch»; bảng có ít nhất bảy đường dẫn, gồm ba tệp engine và bốn tệp của gói `dieu-phoi`.
- AC-3: Given ba tệp engine chép `GATE-INVITE-CLAUSE` (acceptance SKILL, thẻ quyết định, feature-loop SKILL), When duyệt
  từng lần xuất hiện của điều khoản mời cổng, Then điều khoản kết-lượt-cổng đứng ngay sau nó trên cùng đoạn; bản tiêm gỡ
  một bản đi kèm thì đỏ «lời mời cổng không kèm điều khoản kết lượt: <tệp>».
- AC-4: Given feature-loop SKILL, When đọc bốn mục cổng chờ người — Cổng Đáng (đoạn `moi: true` của S0), Cổng 1 (mục GATE
  1), Cổng 1.5 (S2), Cổng Bằng chứng (mục GATE 2) — Then mỗi mục hoặc chép điều khoản, hoặc trỏ tên «điều khoản
  kết-lượt-cổng»; và bước «Đính» của khối hình nói gửi bằng công cụ gửi tệp. Ma trận bốn hàng in ra; bản tiêm gỡ chỗ trỏ ở
  một mục thì đỏ «<tên cổng>: thiếu kết-lượt-cổng».
- AC-5: Given khuôn kết lượt thật, When bộ kiểm kết lượt đọc nó, Then 0 lỗi (đối chứng dương): dòng lệnh nằm trong khối chữ
  `text`, mở đầu đúng hằng tên lệnh ký của `scripts/gate-card.js` (`ONE_SHOT_CMD_SIGNOFF`), mang đúng ô quyết thẻ in
  (`ký hay trả: ___`, rút từ `scripts/gate-card.js`); dòng hộp «bước kế» là JSON chỉ có khoá `recap`. Và bộ kiểm gắn
  với điều khoản HAI chiều: mỗi luật bộ kiểm áp có cụm của nó trong điều khoản, và mỗi dấu cấm điều khoản nêu («/», «!»,
  «@», 300) có luật bộ kiểm áp; bản tiêm gỡ cụm «chứa «@»» khỏi điều khoản thì đỏ «luật bộ kiểm không có trong điều
  khoản: nút chứa «@»».
- AC-6: Given bản tiêm của khuôn mà hộp «bước kế» mang nút, When bộ kiểm đọc, Then đỏ với thông điệp ghim — ma trận viết
  sẵn, số hàng in ra: tin nút là dòng lệnh → «nút mang dòng lệnh» · nhãn hay tin mở đầu «/» → «nút mở đầu «/» hay «!»» ·
  mở đầu «!» → cùng thông điệp · chứa «@» → «nút chứa «@»» · tin dài 301 ký tự → «tin của nút quá 300 ký tự» · hộp có `ask`
  → «hộp «bước kế» mang câu hỏi ở cổng chờ người» · hộp có `actions` không rỗng → «hộp «bước kế» mang nút ở cổng chờ người».
- AC-7: Given bản tiêm của khuôn mà chữ quyết bị điền sẵn hay dòng lệnh rời khối chữ, When bộ kiểm đọc, Then đỏ với thông
  điệp ghim — ma trận: `ký hay trả: ký` · `ký hay trả: trả` · `ký hay trả: Ký` → «chữ quyết điền sẵn: «<ô>»» · dòng lệnh
  ra ngoài khối `text` → «dòng lệnh không nằm trong khối text» · khối `text` rỗng → cùng thông điệp.
- AC-8: Given gói `dieu-phoi`, When đọc bốn tệp lời dặn (`scripts/mau/LUAT.md`, `commands/mo-dot.md`, `commands/dong-dot.md`,
  `commands/tiep-tuc.md`), Then mỗi tệp mang điều khoản nguyên văn; ở `mo-dot.md` và `dong-dot.md` nó nằm TRONG khối
  `CHU-QUYET-CUA-NGUOI`; ở `LUAT.md` nó nằm NGOÀI khối `LUAT-TIN` và còn nguyên trong luật đợt mà lệnh `mo` sinh (rút qua
  hàm ghép luật thật `ghepLuat` của gói, có luật riêng của kho nối sau).
- AC-9: Given cây đã sửa, When chạy ca P188 (điều khoản mời cổng khớp từng ký tự) và hai ca có tên của gói điều phối —
  DP1-07 (gói không mang chữ của kho tiêu thụ) và DP2-01 (khối `CHU-QUYET-CUA-NGUOI` của lệnh mở và đóng đợt) — Then cả
  ba xanh, kể cả các ca đỏ đi kèm của chúng: điều khoản mới không làm lệch điều khoản cũ và không phá hai ca ấy.
- AC-10: Given bản ghi phiên (`.jsonl`) do ca sinh trong lượt theo khuôn bản ghi của Claude Code — bốn lượt: một lượt
  trình thẻ (lời gọi Bash chạy `gate-card.js`) kết bằng hộp chỉ có `recap` · một lượt trình thẻ kết bằng hộp có nút mang
  dòng ký mở đầu «/» dài hơn 300 ký tự và chữ «ký» điền sẵn (dựng theo mô tả lỗi gốc, ẩn danh) · một lượt trình thẻ kết
  bằng hộp có câu hỏi và hai nút chữ thường «Ký»/«Trả» · một lượt không trình thẻ có nút — When chạy chế độ đếm của ca đo
  (`--dem <tệp>`), Then in «lượt cổng 3 · lượt hỏng 2» và liệt kê đúng thông điệp của hai lượt hỏng; lượt không trình thẻ
  không vào mẫu số lẫn tử số.

## Coverage

Quét bằng morphological-scan (preset test-matrix) ở S1. Chân sản phẩm [SUY-TỪ-REPO: human-facing-language.md khối
GATE-INVITE-CLAUSE và GATE-INVITE-SITES, tests/plugins/run-tests.sh ca P188, scripts/gate-card.js dòng ký Cổng 2,
dieu-phoi/commands/*.md, dieu-phoi/scripts/mau/LUAT.md]. Chân ngoài: ba luật bỏ nút của app [ĐO: báo cáo lỗi của phiên Mac
Studio, gốc ở ô cơ hội].

- Trục A · mặt đi của lời mời: chữ thường | khối chữ `text` | trang thẻ gửi tệp | hộp «bước kế» tóm tắt | hộp «bước kế» câu
  hỏi | nút [thước CE: các trường `recap`, `ask`, `actions[].label`, `actions[].message` của hộp — ĐO từ lỗi gốc]
- Trục B · luật bỏ nút: mở đầu «/» | mở đầu «!» | chứa «@» | dài > 300 | nút khuyến nghị bị bỏ kéo theo câu hỏi
  [thước CE: ba luật app trả về trong lỗi gốc]
- Trục C · ô quyết: để `___` | điền khuyến nghị (không phải chữ quyết) | điền chữ quyết (ký, trả, Ký)
- Trục D · chỗ mời: Cổng Đáng | Cổng 1 | Cổng 1.5 | Cổng 2 | thẻ quyết định | acceptance SKILL (dùng không qua vòng) |
  giám sát mở đợt | giám sát đóng đợt | giám sát tiếp tục | thợ trong đợt [thước CE: mọi tệp chép `GATE-INVITE-CLAUSE` +
  bốn tệp lời dặn của gói điều phối — SUY-TỪ-REPO]
- Core → AC: A×nguồn → AC-1 · D×chép → AC-2, AC-3, AC-4, AC-8 · A(chữ, khối, hộp tóm tắt)×dương → AC-5 · A(nút, câu
  hỏi)×B → AC-6 · C(chữ quyết) + A(khối) → AC-7 · hồi quy luật cũ → AC-9 · A(nút, câu hỏi)×B×lượt phiên thật → AC-10 (lệnh đếm của Đường đo).
- Đi chéo mọi ô Core: thông điệp đỏ ghim đúng tên lỗi; mọi bản tiêm khớp đúng một lần; mọi đầu vào rút từ văn bản thật
  trong lượt.
- Later — răng máy chặn lời gọi hộp «bước kế» mang nút ở cổng (hook) — CỘNG, cần chủ kho phê; ngưỡng ở Notes.
- Never — sửa cách app bỏ nút (ngoài kit).

## Đường đo

- Thước: 14 ngày sau khi crm nhận bản vá, 0 lượt cổng hỏng · số từ: bản ghi phiên của kho tiêu thụ trên các máy
  (`~/.claude/projects/<thư mục kho>/*.jsonl`, chỉ tệp có mốc trong cửa sổ), đếm bằng chính bộ kiểm kết lượt:
  `node tests/scripts/moi-cong-khong-qua-nut.test.mjs --dem <tệp…>`. Lượt cổng = lượt có lời gọi Bash chạy `gate-card.js`;
  lượt hỏng = lượt cổng mà lời gọi hộp «bước kế» cùng lượt có `ask`, có `actions` không rỗng, hay nút sai luật bỏ nút — tử
  số và mẫu số cùng phạm vi lượt cổng · mẫu số N = số lượt cổng; N = 0 thì thước VÔ HIỆU, không đọc thành «0 lỗi» · bảo đảm
  bởi: AC-1, AC-2, AC-3, AC-4, AC-8; lệnh đếm do AC-10 bảo đảm.

## Out of scope

- Răng máy (hook chặn lời gọi hộp «bước kế» có nút mang dòng lệnh hay chữ quyết) — CỘNG, ngoài phạm vi chủ kho giao.
- Thẻ Cổng Phạm vi điền sẵn «duyệt» trong dòng lệnh (ADR 0022) — giữ nguyên; điều khoản nói «chép đúng như thẻ in».
- Lỗi thẻ đếm eval mang sang thành đỏ (`scripts/gate-card.js`) — phiên điều phối ghi hạt giống riêng.
- Bảng khẩu lệnh của khối `LUAT-TIN` (vòng GT2 đang sửa); mọi script của gói `dieu-phoi`; cắt số, gắn tag.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Known limits (nhãn trạng thái, không phải việc):
  - **Lời, chưa có răng**: điều khoản dặn phiên, không chặn được một phiên lờ nó. Ngưỡng mở ô răng (hook): ≥ 1 lượt trong
    cửa sổ của Đường đo mà nút mang dòng lệnh hay chữ quyết.
  - **Ca đo đọc văn bản, không chạy app**: ba luật bỏ nút là điều app trả về trong lỗi gốc, ca không kiểm app thật.
  - **AC-5…AC-7 đo khuôn do vòng viết, không đo lượt phiên thật**: điều khoản là thứ phiên đọc, khuôn là thứ ca đọc; hai
    thứ được buộc bằng phép so hai chiều ở AC-5, còn hành vi phiên chỉ đo được sau khi ship (Đường đo, AC-10). Lượt hỏng ở
    AC-10 dựng theo MÔ TẢ lỗi gốc, không phải bản ghi gốc (bản ghi nằm ở máy khác, thuộc kho riêng tư).
  - **AC-9 thu phạm vi (chủ kho chọn «lối 1» ở Cổng Bằng chứng, 19/10)**: lượt chấm của vòng không còn đo «trọn bộ ca khung
    của gói điều phối xanh» — ca GT-07 (tin tự đến giữa các phiên) đỏ chập chờn 1/2 lần trên cùng cây, ngoài vòng; suite
    của kho và CI vẫn chạy trọn bộ. Hạt giống: `docs/plans/2026-10-20-hat-giong-gt07-chap-chon.md`. Ngưỡng mở lại: ≥ 1 lần
    CI nhánh chính đỏ ở một ca điều phối mà vòng này chạm tệp của nó.
  - **Mặt không có hộp «bước kế»** (phiên CLI): điều khoản vẫn đúng — không có hộp thì không có nút; gửi tệp lùi về in
    đường dẫn trang.
