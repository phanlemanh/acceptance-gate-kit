---
schema_version: 1
feature: Xả stdout trước khi thoát — thẻ cổng và JSON trích của gate-card, và JSON làn đỏ của repin-lane, không còn bị cắt im lặng ở 65 536 byte khi stdout là pipe
slug: xa-stdout-truoc-khi-thoat
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/gate-card.js + feature-loop/scripts/repin-lane.mjs + một tệp ca + một khoá executor — không chạm hook, lưới trước-merge, t3_paths
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-11-xa-stdout-truoc-khi-thoat-design.md
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-11T08:59:15Z
---

# Acceptance Contract: xa-stdout-truoc-khi-thoat

## Context

Gốc: cranky-kare-4e5cd2/_acceptance/dieu-phoi-doi-tai-khoan/ — làn ghim lại 5 hồ sơ của DP4 đỏ ở ca P161
(UnicodeDecodeError ở byte 65 534): thẻ Cổng 1 của hồ sơ ấy 65 932 byte, `gate-card.js` ghi trọn thẻ
rồi `process.exit(0)` ngay, stdout qua pipe chỉ giao 65 536 byte. Thẻ lớn nhất trên `main` đã 64 287
byte. Vòng vá đổi mọi chỗ «ghi lớn rồi thoát ngay» sang «thoát trong callback của lần ghi», quét cả
lớp trong bốn thư mục mã, và dựng ca đo hai chiều. Số đo và bảng quét: design doc §1, §3.

## Criteria

Bốn chuỗi ghim dùng chung cho hợp đồng, evals và tệp ca (một literal, có dấu): dòng dò nền
`nền: CẮT (dò nhận <n> / 200000 byte)` hoặc `nền: KHÔNG CẮT (dò nhận 200000 / 200000 byte)` · thông
điệp đỏ `nhận <n> / <m> byte` · nhãn `KHÔNG ĐO ĐƯỢC ở nền này` · nhãn `mutant không áp được`. Dòng
`KHÔNG ĐO ĐƯỢC ở nền này` là trạng thái «không đọc được ở đây», KHÔNG phải PASS.

- AC-1: Given hồ sơ thử do mã sinh trong ca có sổ quyết định đủ dài để thẻ Cổng 1 ghi ra TỆP lớn hơn cả 65 536 byte lẫn 2 × số byte phép dò nhận (ca kiểm tiền đề này trước, thiếu thì đỏ nêu cỡ), When `gate-card.js --gate 1` ghi thẻ ra PIPE, Then đầu ra bằng từng byte bản ghi ra tệp và mã thoát 0.
- AC-2: Given cùng tiền đề cỡ cho JSON trích của một hồ sơ Cổng 1 và một hồ sơ Cổng 2 có sổ dài, When `gate-card.js --extract` chạy cho từng cổng với stdout là pipe, Then mỗi đầu ra bằng từng byte bản ghi ra tệp, `JSON.parse` thành công với khoá `gate` đúng cổng, mã thoát 0.
- AC-3: Given cùng tiền đề cỡ cho thẻ Cổng 2 verdict BLOCKED (lý do dài) và thẻ Cổng 2 ký-được, When gate-card ghi hai thẻ ấy ra pipe, Then mỗi thẻ bằng từng byte bản ghi ra tệp, mã thoát 0.
- AC-4: Given nền mà dòng dò nền in `nền: CẮT` và mọi fixture của AC-1…AC-3 thoả tiền đề cỡ, When chạy một bản sao gate-card CHƯA tiêm và bốn bản sao mỗi bản đưa ĐÚNG MỘT trong bốn chỗ thoát (thẻ Cổng 1 · trích Cổng 1 · trích Cổng 2 · thẻ Cổng 2 chưa-ký-được) về «ghi rồi `process.exit(0)` ngay» — năm bản dựng cùng cách, cùng thư mục làm việc — Then bản chưa tiêm cho bốn đường ra bằng từng byte bản tệp với mã 0; trên ma trận 4 × 4 viết sẵn, ô chéo chỉ tính ĐỎ khi đồng thời mã thoát 0, 0 < n < m và n byte nhận là tiền tố của bản tệp, kèm thông điệp nêu tên chỗ và `nhận <n> / <m> byte`; ô ngoài chéo bằng từng byte bản tệp; số ô đã so in ra bằng 16; chuỗi tìm vắng thì ca đỏ `mutant không áp được`. Trên nền `nền: KHÔNG CẮT`, hoặc khi fixture thiếu tiền đề cỡ, ca in `KHÔNG ĐO ĐƯỢC ở nền này` kèm n và cỡ fixture nhỏ nhất, không in PASS cho chiều đỏ.
- AC-5: Given hồ sơ nhỏ (mỗi đường ra ghi ra tệp dưới 65 536 byte: thẻ Cổng 1, trích Cổng 1, thẻ Cổng 2 ký-được, trích Cổng 2, thẻ Cổng 2 BLOCKED) và ba hồ sơ thật ĐẦU TIÊN theo thứ tự chữ của kho mà ở cả hai cổng gate-card thoát 0 với stdout từ 1 KB tới dưới 65 536 byte có thẻ (tên và cỡ in ra; không đủ ba thì đỏ nêu tên), When chạy bản sao đã sửa và bản sao hoàn nguyên khuôn cũ — dựng cùng cách từ chính cây đang kiểm, không ghim sha — Then đầu ra qua pipe của hai bản bằng nhau từng byte, bằng bản sao đã sửa ghi ra tệp, mã thoát bằng nhau; và bản sao đã sửa cho đúng từng byte như gate-card ở cây thật (đối chứng bố cục bản sao).
- AC-6: Given hồ sơ thử có thẻ Cổng 1 thoả tiền đề cỡ, When người đọc pipe nhận mẩu đầu rồi đóng đầu đọc, Then gate-card (và bản sao chưa tiêm) thoát mã 0, stderr của tiến trình con không chứa `EPIPE`; và trên nền mà phép dò «`process.exitCode` + người đọc đóng sớm» sập EPIPE, bản sao dùng khuôn `process.exitCode` ở chỗ thẻ Cổng 1 làm ca đỏ chỉ khi stderr của TIẾN TRÌNH CON chứa `EPIPE` và mã ≠ 0; nền không sập in `KHÔNG ĐO ĐƯỢC ở nền này`.
- AC-7: Given kho thử do mã sinh có suite đỏ và lý do ghim lại đủ dài để JSON của làn ghim lại đỏ ghi ra tệp thoả tiền đề cỡ, When `repin-lane.mjs` chạy với stdout là pipe (cây thật và bản sao chưa tiêm, cùng `--ag-root` tuyệt đối trỏ cây đang kiểm), Then stdout `JSON.parse` được, mang mọi slug của làn ghim lại và trọn chuỗi lý do trong section, mã thoát 1, stderr có `LÀN ĐỎ`; và trên nền `nền: CẮT`, bản sao đưa dòng thoát nhánh đỏ về `process.exit(1)` ngay chỉ tính ĐỎ khi mã 1, 0 < n < m và n byte là tiền tố bản tệp, kèm `nhận <n> / <m> byte`; chuỗi tìm vắng thì đỏ `mutant không áp được`.

## Coverage

Quét bằng `morphological-scan` (preset test-matrix). Chân sản phẩm: bốn chỗ thoát `[SUY-TỪ-REPO:
scripts/gate-card.js]` · nhánh làn đỏ `[SUY-TỪ-REPO: feature-loop/scripts/repin-lane.mjs]` · bảng quét
lớp `[SUY-TỪ-REPO: docs/superpowers/specs/2026-10-11-xa-stdout-truoc-khi-thoat-design.md]`. Chân ngành:
`[NGÀNH: Node.js docs — «A note on process I/O»: pipe và socket bất đồng bộ trên POSIX]` ·
`[NGÀNH: Node.js docs — cảnh báo của process.exit() về lần ghi stdout còn treo]`.

- Trục A — đường ra: thẻ Cổng 1 | trích Cổng 1 | trích Cổng 2 | thẻ Cổng 2 chưa-ký-được | thẻ Cổng 2 ký-được (kết tự nhiên — đối chứng) | JSON làn đỏ repin-lane  [thước CE: quét lớp 60 dòng trên bốn thư mục + đọc tay, design §3] → AC-1, AC-2, AC-3, AC-7
- Trục B — cỡ: dưới 65 536 byte | trên 65 536 byte  [thước CE: phép dò một dòng cắt ở 65 536; thẻ thật 64 287 / 65 932] → AC-1…AC-3, AC-5
- Trục C — người đọc: tệp (đồng bộ) | pipe đọc đủ | pipe đóng sớm  [thước CE: tài liệu Node + số đo EPIPE design §1] → AC-1…AC-3, AC-6
- Trục D — nền: pipe cắt | pipe không cắt  [thước CE: phép dò một dòng trong ca] → AC-4, AC-6, AC-7
- Later: người đọc đóng sớm cho repin-lane · răng tĩnh chặn «ghi rồi thoát» ở mọi script.
- Never: TTY (đồng bộ trên POSIX theo tài liệu Node) · Windows (pipe đồng bộ, kit không chạy ở đó).

## Out of scope

- Sửa các script trong danh sách «liệt kê» của design §3 (eval-coverage-lint 19 KB, loop-health, thuoc-vat, carry-plan, cat-luot, lo-trinh, nhánh bỏ-qua của repin-lane…) — đầu ra có trần hoặc cần corpus ≥ 3 lần hôm nay mới tới mốc.
- Răng tĩnh (lint) cấm «ghi stdout rồi `process.exit`» trên mọi script — một CỘNG, cần owner phê.
- Quét `hooks/`, `skills/*/`, `vendor/`, `tests/` — ngoài bốn thư mục của lời giao.
- Đo lớp này trên nền CI (Linux) — ca in «không đo được» có tên khi nền không cắt.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/xuat-du-qua-pipe.test.mjs`, chạy bằng khoá mới `executors.test.xuat_du_qua_pipe`.
  Tên tệp xếp cuối glob của suite scripts nên mảnh `mjs:i/3` của tệp khác không xô.
- Ngưỡng mở lại khối «liệt kê»: `node scripts/eval-coverage-lint.js . | wc -c` vượt 49 152 byte (75 % mốc),
  hoặc một lần cắt 64 KB nữa ở bất kỳ script nào trong danh sách.
- Sửa `gate-card.js` làm hồ sơ đã ký hoá cũ; ghim lại bằng MỘT làn cho mọi hồ sơ lưới trước-merge báo, sau
  khi Điều phối cấp lượt.
