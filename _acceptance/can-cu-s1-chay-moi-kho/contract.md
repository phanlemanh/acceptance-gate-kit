---
schema_version: 1
feature: Bộ xếp căn cứ của bước thiết kế chạy được ở mọi kho tiêu thụ, lỗi không chạy được không bị đọc thành sổ đỏ, và thẻ Cổng Phạm vi in đủ quyết gì — vì sao — sai thì tốn gì cho mọi lựa chọn bước thiết kế
slug: can-cu-s1-chay-moi-kho
owner: phanlemanh@gmail.com
risk_tier: T2               # máy suy: SKILL feature-loop + scripts/gate-card.js + ca đo + GUIDE — không chạm lib/**, hooks/**, cổng chặn gộp
surfaces: [cli, docs, ui]
design_doc: docs/superpowers/specs/2026-10-11-can-cu-s1-chay-moi-kho-design.md
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-11T15:07:02Z
---

# Acceptance Contract: can-cu-s1-chay-moi-kho

## Context

Vòng sửa từ Cổng Bằng chứng của A2 (`buoc-len-thiet-ke-khong-hoi`, ký 11/10): chủ kho chọn «mở hợp đồng
mới» cho Ngoài-1/2/3 (sổ A2 `d-20261011T143315Z-22`). Lỗi 1: lời dặn bước thiết kế gọi bộ xếp căn cứ
bằng đường chỉ đúng trong kho kit — ở crm lệnh thoát 1 «Cannot find module», trùng mã «còn dòng đỏ».
Lỗi 2: thẻ Cổng Phạm vi in dòng sổ mang `can_cu` mà bỏ «vì sao» và «sai thì tốn gì». Chặn mốc kế
(~14–15/10), mốc mang A2 tới crm. Ô: `_acceptance/can-cu-s1-chay-moi-kho/opportunity.md`.

## Criteria

- AC-1: Given một kho thử do code sinh trong lượt (thư mục tạm + `git init`, KHÔNG có `scripts/` của kit) có hồ sơ với sổ bước thiết kế viết sẵn, và bộ nhớ đệm plugin giả (thư mục nhà tạm) chứa gói acceptance-gate trỏ cây đang kiểm, When rút MỌI lệnh trong `feature-loop/skills/feature-loop/SKILL.md` gọi bộ xếp căn cứ (đúng hai: kiểm sổ một hồ sơ · đếm `--dem`) rồi chạy nguyên văn dưới bash và dưới zsh, Then cả bốn lượt thoát 0 và in dòng tổng kết của bộ xếp với số đếm viết sẵn lúc dựng kho; và bản sao SKILL đặt lại lời gọi đường tương đối thì CHÍNH hàm kiểm trả lỗi nêu «không chạy được ngoài kho kit» trên cùng kho thử.
- AC-2: Given cùng lệnh kiểm sổ rút từ SKILL và kho thử của AC-1, When (a) sổ có thêm một dòng đỏ, (b) bộ nhớ đệm chỉ có một bản gói acceptance-gate KHÔNG mang bộ xếp, Then (a) thoát 1 KÈM dòng tổng kết có «đỏ 1»; (b) không có dòng tổng kết, thông điệp nêu tên gói `acceptance-gate` và lệnh cài — hai hình dạng phân biệt được không cần mã thoát.
- AC-3 (judgment): Given `feature-loop/skills/feature-loop/SKILL.md` (mục «Sổ quyết định» và S1 mục 5) và `GUIDE.md` (mục sổ quyết định), When đọc lời dặn kiểm sổ bước thiết kế, Then: hai lời gọi bộ xếp đi qua bộ giải gói và nói kho tự host kit thêm `--root .`; vế dừng của S1 mục 5 đọc «câu hỏi N > 0 hoặc đỏ K > 0» trên dòng tổng kết của bộ xếp, KHÔNG đọc mã thoát; lệnh không in dòng tổng kết được gọi tên là bộ xếp không chạy được — trình nguyên văn như một DỪNG-lỗi có tên, không gọi là sổ đỏ; GUIDE mô tả hai khối căn cứ của thẻ có đủ ba vế.
- AC-4: Given `feature-loop/skills/feature-loop/SKILL.md`, When quét MỌI lời gọi `node`, `bash`, `sh` tới `[./][<gói>/]scripts/<tệp>` mà tệp ấy có trong cây kit (gốc kho hoặc gói feature-loop), Then hàm quét trả danh sách rỗng trên cây của vòng (luật áp trọn tệp, danh sách ngoại lệ rỗng); và ma trận bốn hình dạng viết sẵn — `node scripts/<tệp>` · `node ./scripts/<tệp>` · `node feature-loop/scripts/<tệp>` · `bash scripts/<tệp .sh>` — tiêm TỪNG hình vào bản sao SKILL → hàm quét nêu đúng `SKILL.md:<dòng tiêm>` cho mỗi hình (4/4).
- AC-5: Given hồ sơ nháp của kho thử có hai câu chỉ-người-biết (một khó-đảo), mỗi dòng mang `why` và `cost_if_wrong` RIÊNG, When dựng thẻ Cổng Phạm vi, Then trong khối «Câu chỉ anh trả lời được» dòng của mỗi câu chứa đúng `why` của chính nó và «sai thì tốn: <cost_if_wrong của chính nó>», vẫn có khuyến nghị + lối khác, nhãn khó-đảo đúng câu.
- AC-6: Given cùng hồ sơ có bốn dòng máy đã quyết phủ đủ ma trận nguồn × loại — mục-tiêu/approach · một-lối/approach · mục-tiêu/descope · một-lối/descope — mỗi dòng `why` + `cost_if_wrong` riêng, When dựng thẻ, Then trong khối «Máy đã quyết ở bước thiết kế — anh lật được» dòng của mỗi lựa chọn chứa `why` và «sai thì tốn: <cost>» của chính nó, ĐỨNG TRƯỚC căn cứ (câu trích + tệp) hoặc «lối khác chết vì»; hai dòng `descope` mang «KHÔNG làm:»; và trên sổ THẬT của chính hồ sơ này (ghi bằng khối lệnh của SKILL), thẻ ép `--gate 1` có đúng một dòng cho mỗi dòng S1 mang căn cứ chưa bị thay, mỗi dòng chứa `why` và giá của chính nó.
- AC-7: Given hồ sơ có một dòng S1 mang `can_cu` mà thiếu `cost_if_wrong`, When dựng thẻ và bản rút (`--extract`), Then dòng ấy mang nhãn «⚠ chưa khai giá nếu sai» ngay trong dòng (thẻ vẫn dựng, thoát 0); bản rút: mỗi mục của `can_cu.cau_hoi` và `can_cu.da_quyet` mang `why` và `cost_if_wrong` bằng giá trị của dòng sổ (thiếu thì null).
- AC-8: Given mọi hồ sơ trong `_acceptance/` của kho kit mà sổ không có dòng nào mang `can_cu`, When dựng thẻ Cổng Phạm vi ép bằng `--gate 1` (HTML và bản rút) bằng `scripts/gate-card.js` ở gốc vòng (bản dựng bằng `git archive` trọn thư mục) và ở đỉnh vòng, Then hai bản giống từng byte cho mọi hồ sơ ấy; và bản sao thẻ ở đỉnh bị tiêm đổi chữ khối chung → phép so nêu tên ít nhất một hồ sơ.
- AC-9: Given hồ sơ nháp của AC-5/AC-6 do code sinh trong lượt, When mở thẻ Cổng Phạm vi ở khổ 1280×800 rồi 390×844, Then (nhìn) mỗi dòng của hai khối căn cứ đọc được quyết gì · vì sao · sai thì tốn gì trước căn cứ hoặc khuyến nghị; nhãn khó-đảo ở đúng một câu; khổ 390 `scrollWidth` ≤ 390.

- AC-10: Given kho thử do code sinh có hai hồ sơ đã qua Cổng Phạm vi — `a-moi` (sổ mang `can_cu`, đứng ĐẦU chữ cái) và `b-cu` (chỉ dòng S1 đời trước) — When chạy cách chọn hồ sơ của ca CC-06 (`the-cu` và `CC-06-do`) và dựng thẻ ép `--gate 1`, Then hai ca chỉ chọn `b-cu` (hồ sơ có dòng S1 đời trước, không dòng mang căn cứ); thẻ `b-cu` không cờ «đời trước», không khối câu hỏi, khối chung đủ dòng; thẻ `a-moi` có 1 câu hỏi · 1 dòng máy đã quyết và khối chung chỉ còn dòng S2; và (đỏ) cách chọn cũ không lọc căn cứ → ca nêu «a-moi: trade-off đủ dòng», bản sao thẻ in cờ đời trước cho hồ sơ đã qua Cổng Phạm vi → ca nêu «b-cu» + «cờ đời trước».
## Coverage

Bỏ quét bằng `morphological-scan` — sổ `d-20261011T145052Z-6` (hai lỗi có tên, phạm vi ngoài đã chốt).
Trục ghi tay, mỗi giá trị có ca:

- Trục A — nơi chạy lệnh: kho khách đã cài gói mang bộ xếp · kho khách cài gói cũ · (kho tự host — giới hạn khai, design §4) → AC-1, AC-2
- Trục B — lệnh: kiểm sổ một hồ sơ · đếm `--dem` → AC-1
- Trục C — vỏ: bash · zsh → AC-1
- Trục D — trạng thái sổ: sạch · có câu hỏi · có dòng đỏ → AC-1, AC-2
- Trục E — khối thẻ: câu hỏi · máy đã quyết (nguồn mục-tiêu/một-lối × loại approach/descope) · khối chung (dòng không căn cứ) → AC-5, AC-6, AC-8
- Trục F — dòng thiếu vế: thiếu giá → AC-7
- Cross-cutting: ca của A2 không ghim vào hồ sơ sống → AC-10 · hồ sơ cũ không đổi màu → AC-8 · lớp lời gọi tương đối trên trọn SKILL feature-loop → AC-4 (tệp lời dặn khác: quét tay, sổ `d-20261011T150339Z-9`)

## Đường đo

- Lệnh kiểm sổ in dòng tổng kết ở vòng crm đầu tiên sau khi crm nhận mốc · số từ: dòng tổng kết bộ xếp trong phiên chạy vòng crm ấy; máy đọc lại được ngay khi crm cài bằng chính lệnh rút từ SKILL chạy ở gốc crm · AC-1, AC-2.
- Cổng Phạm vi của vòng ấy chỉ dừng khi dòng tổng kết có câu hỏi N > 0 hoặc đỏ K > 0 · số từ: đối chiếu N, K của dòng tổng kết với việc vòng dừng Cổng Phạm vi hay đi làn V (`veto_state` của hợp đồng crm + sổ `decisions.jsonl` của vòng); dừng khi N = 0 và K = 0 là CHẾT · AC-2, AC-3.
- Thẻ Cổng Phạm vi của vòng ấy in hai vế cho mọi dòng S1 mang căn cứ · số từ: bản rút `--extract` của thẻ — mỗi dòng sổ có `cost_if_wrong` thì mục tương ứng ở `can_cu.cau_hoi[]` / `can_cu.da_quyet[]` mang đúng giá trị ấy; dòng sổ thiếu giá đếm riêng (lỗi ghi sổ, không phải lỗi thẻ) · AC-5, AC-6, AC-7.

## Out of scope

- Sửa ca DP7-08 (`tests/dieu-phoi/trong-dot.test.mjs`) — tệp ca của gói điều phối (máy M5); vòng này dùng lại cách đo của nó, không sửa tệp.
- Đổi mã thoát của bộ xếp căn cứ để tách «không chạy được» — mã đã ghim trong hợp đồng A2.
- Năm mục Ngoài-4..8 của A2 — chủ kho đã định đoạt «ghi Known limits».
- Câu gộp «duyệt; Hỏi-n = lối» — hàng riêng đã hoãn ở A2 (`d-20261011T093912Z-13`).
- Cổng chặn gộp kiểm sổ bước thiết kế — ngoài phạm vi như ở A2.
- Ca quét lớp cho tệp lời dặn ngoài SKILL feature-loop — 8/8 lời gọi cùng hình ở đó đúng chủ đích (sổ `d-20261011T150339Z-9`).

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/can-cu-s1.ca.mjs` thêm ca `KK-<n>` (= AC-n), gọi từ phần bash của
  `tests/scripts/run-tests.sh` → chạy bằng `config:executors.test.scripts_bash` sẵn có, trùng lệnh suite nên
  không tốn thêm lượt. Không thêm khoá executor (sửa `_acceptance/config.yaml` làm cũ hồ sơ khác).
- Giới hạn đã khai (design §4): cách phiên ĐỌC dòng tổng kết là văn — răng máy chứng hai hình dạng đầu ra
  phân biệt được (AC-2), không cưỡng chế phiên đọc đúng. Ngưỡng mở ô: ≥ 1 vòng ở kho khách dừng Cổng Phạm vi
  vì đọc lỗi bộ xếp thành sổ đỏ.
- Cỡ vòng: 10 tiêu chí — trong khung 8–12 (AC-10 nâng phạm vi trong S3, sổ `d-…-11`).
