---
schema_version: 1
feature: lượt chấm ghi vào cây — bộ chấm S4 phát hiện cây đổi trong lượt chấm (commit lạ, tệp vật/thước bị sửa) và lượt ấy không dùng được, chấm lại cùng vòng
slug: luot-cham-ghi-vao-cay
owner: phanlemanh@gmail.com
risk_tier: T3      # sửa lib/nhan-canh-gay.cjs, scripts/pre-merge-check.sh, scripts/recheck-evidence.cjs (t3_paths)
surfaces: [cli, docs]
status: draft
approved_by:
approved_at:
design_doc: docs/superpowers/specs/2026-10-01-luot-cham-ghi-vao-cay-design.md
---

# Acceptance Contract: luot-cham-ghi-vao-cay

Gốc: crm/_acceptance/hydrat-giai-doan-deals

## Context

Lượt chấm S4 giả định cây đứng yên trong lượt; không gì giữ giả định ấy. Ba ca thật ở crm —
`dieu-phoi-30-ngay-dau` (21/09, commit `508ed3f7`), `claimdue-chi-thay-dong-cua-minh` (24/09, commit
`53a4adf3`), `hydrat-giai-doan-deals` (30/09 trên kit 2.19.0: tác tử chấm tự sửa mã và commit bốn
lần, sổ `d-20260930T113057Z-6`) — đều chỉ lộ ra khi người đọc lại. Kit hôm nay bắt phần chạm THƯỚC
(thước lệch); phần chạm VẬT và commit thì im, nên một lượt chấm vật tác tử vừa sửa vẫn ra PASS ký
được. Ca 30/09 vượt ngưỡng hạt giống `docs/plans/2026-09-21-hat-giong-tac-nhan-cham-ghi-vao-cay.md`.

Vòng này là vế PHÁT HIỆN của B8 mà `cham-khong-tu-dot-luot` để ngoài phạm vi. Đường đọc cây là
bước sau-lượt sẵn có của phiên chính (`thuoc-vat.mjs --write`), không phải tác tử — lý do ở design
doc §2. Bộ chấm `acceptance-verify.js` không đổi.

Người hưởng: owner (lượt hỏng bị máy gọi tên thay vì người tự truy — 3/3 ca crm là người truy) ·
phiên Claude Code ở mọi kho tiêu thụ (lượt hỏng chạy lại cùng vòng, không đốt trần). Trace: nguyên
tố 2 — bằng chứng không tự dối: «lượt này chấm đúng `invokedSha`» chuyển từ lời dặn tác tử («KHONG
sua code») sang vật máy giữ.

Source input: lời giao việc owner 01/10 · design doc ở frontmatter · finding 2026-09-26 B8, B10, §9.1.

## Criteria

- AC-1: Given `s4-args.mjs` sinh args trên một kho git, When cây có tệp đang theo dõi bị sửa và tệp chưa theo dõi ở cả bốn lớp (`vat` · `thuoc` · `ho-so` · `ngoai`) cùng `.acceptance-runs/` và `_acceptance/<slug>/evidence/`, Then args mang `cayChup.sha` = `invokedSha`, `cayChup.ban` liệt ĐÚNG các tệp đang theo dõi bị sửa lớp `vat`/`thuoc` (theo `lib/phan-loai.mjs`) trừ ba tiền tố `.acceptance-runs/` · `_acceptance/<slug>/evidence/` · `.claude/` (hằng một chỗ), mỗi tệp một băm nội dung, và `cayChup.chuaTheoDoi` liệt đúng các mục chưa theo dõi cùng vùng (không băm); cây sạch → cả hai rỗng. Chiều đỏ: bản sao bỏ vế trừ `.acceptance-runs/` → ca đỏ ghim đường lọt vào ảnh.
- AC-2: Given args có `cayChup`, When sau đó cây đổi trong vùng xét rồi chạy `thuoc-vat.mjs --write`, Then với ma trận viết trước (mỗi đột biến ở răng hồ sơ chứng mũi tiêm trúng trước khi chấm) — (1) commit sửa tệp vật · (2) sửa tệp vật đang theo dõi, không commit · (3) xoá tệp vật đang theo dõi · (4) commit sửa vật rồi commit hoàn lại (tổng diff rỗng) · (5) commit `_acceptance/khac/rang.sh` (thước của hồ sơ khác, lớp `thuoc`) — run-log có ĐÚNG MỘT dòng `kind: cay-doi` đúng khuôn marker `CAY-DOI-LINE`, liệt đúng các tệp và (ở hàng có commit) đúng sha ngắn của từng commit chạm chúng, `luot_ts` = `invokedAt` của args, script thoát 6 với thông điệp ghim `cay doi trong luot cham`; số assert = 5. Thước lệch cùng lượt (tệp test kho tracked bị sửa) → cả hai dòng, thoát 5. Chiều đỏ: bản sao gỡ phép so cây → hàng (1)–(5) đỏ ghim số hàng; bản sao chỉ dùng diff ròng (bỏ vế `git log`) → hàng (4) đỏ.
- AC-3: Given cùng fixture AC-2, When chỉ những thay đổi KHÔNG phải vật xảy ra, Then không có dòng `cay-doi` và thoát 0 cho từng hàng: (1) không đổi gì (đối chứng dương) · (2) sửa tệp đang theo dõi `.acceptance-runs/<slug>/x.json` · (3) sửa tệp đang theo dõi `_acceptance/<slug>/evidence/chup.mjs` (lớp `thuoc`) · (4) commit sổ quyết định + run-log của hồ sơ (phiên chính commit giữa lượt; HEAD dời) · (5) commit tệp khớp `t1_skip_globs` · (6) tệp vật đã sửa dở TRƯỚC khi sinh args, không đổi thêm · (7) chạm mtime tệp vật, cùng byte · (8) tệp mới chưa theo dõi ngoài `_acceptance/` → không dòng, thoát 0, stderr gọi tên tệp với cụm `tep moi chua theo doi` · (9) tạo phẩm CHƯA THEO DÕI có sẵn trước khi sinh args (`.s4-acceptance-verify.js`, thư mục `.wf/`) bị ghi lại trong lượt, khác byte và cùng byte · (10) sửa tệp đang theo dõi `.claude/launch.json` · (11) sửa tệp đang theo dõi `_acceptance/khac/evidence/ve-that.json` (lớp `ho-so`); số assert = 11. Đường đọc-cũ: args không có `cayChup` → không dòng, thoát 0, stderr `khong co anh chup cay`. Chiều đỏ: bản sao bỏ vế trừ `.acceptance-runs/` → hàng (2) đỏ; bỏ vế trừ `evidence/` → hàng (3) đỏ; bỏ vế trừ `.claude/` → hàng (10) đỏ; vế tệp-theo-dõi duyệt cả mục chưa theo dõi → hàng (9) đỏ.
- AC-4: Given run-log có dòng `cay-doi` do `thuoc-vat.mjs --write` THẬT ghi và dòng `round-tally` do `tallyLine` của bộ chấm THẬT dựng (round-trip), When `canhGay` của `lib/nhan-canh-gay.cjs` đọc, Then ma trận: dòng khớp `round` + `luot_ts` với tally cuối, verdict PASS → `trangThai: 'cay-doi'`, `cay.tep`/`cay.commit` đúng; cùng thế verdict REJECT → `cay-doi`; dòng của lần thử TRƯỚC (luot_ts khác tally cuối) → không `cay-doi`; dòng mồ côi (không tally nào cùng luot_ts — lượt chết không ghi tally) → không `cay-doi` ở thẻ, việc giữ nó thuộc AC-5; có cả `thuoc-lech` → `lech`; không dòng `cay-doi` → kết quả `canhGay` deep-equal bản lib trước vòng trên cùng sổ (đối chứng đường đọc-cũ); và `NHAN.CAY` có mặt nguyên văn trong mục **Nhãn trạng thái** của `CONTEXT.md`. Chiều đỏ: bản sao lib bỏ nhánh `cay-doi` → hai hàng đầu đỏ ghim `trangThai`.
- AC-5: Given lượt cuối của hồ sơ mang `cay-doi` (sổ round-trip như AC-4), When `s4-args.mjs` sinh args lượt kế, Then (hoàn lại) commit của dòng ấy còn là tổ tiên của HEAD, hoặc tệp của dòng ấy còn bẩn → thoát 2 ghim `cay doi chua hoan lai` + danh sách, không sinh tệp — kể cả khi dòng mồ côi; cùng cây với `--nhan-cay-moi` → sinh tệp, args mang `cayNhanMoi`; đã hoàn lại → sinh tệp; và (round) round = round của lượt ấy (không đếm trần) và stderr ghim `cay doi trong luot cham — thu lai CUNG round`; lượt cuối là lần thử lại thứ hai cùng round vẫn `cay-doi` → round + 1 và stderr ghim `da thu lai mot lan van cay doi`; không dòng `cay-doi` → round như trước vòng (đối chứng). Chiều đỏ: bản sao lib bỏ nhánh `cay-doi` → ca round đỏ ghim round; bản sao gỡ kiểm hoàn lại → ca chưa-hoàn-lại đỏ ghim mã thoát.
- AC-6: Given hồ sơ có báo cáo PASS và sổ mang `cay-doi` ở lượt cuối, When dựng thẻ Cổng Bằng chứng, Then `--extract` cho `approvable: false` và `canh_gay.trangThai: 'cay-doi'`; HTML có nhãn «cây đổi trong lượt chấm», mỗi tệp, mỗi sha commit, và câu việc «chấm lại cùng vòng — không đếm vào trần», không có nút ký; hồ sơ không có dòng ấy → HTML bằng bản thẻ trước vòng TỪNG BYTE. Chiều đỏ: bản sao lib bỏ nhánh `cay-doi` → ca đỏ ghim `approvable`.
- AC-7: Given hồ sơ đã ký PASS có `cay-doi` ở lượt cuối, When chạy lưới trước-merge và `recheck-evidence.cjs`, Then lưới in `VIOLATION [<slug>]: lượt chấm cuối không dùng được — cây đổi trong lượt chấm` và thoát ≠ 0; recheck thoát 1 với cùng cụm; đối chứng cùng fixture không dòng → lưới OK, recheck 0; bản sao bỏ `lib/nhan-canh-gay.cjs` → không VIOLATION từ luật này; bản sao thay lib bằng bản TRƯỚC VÒNG (lib đời cũ, script mới) → lưới không VIOLATION từ luật này và in NOTE `lib chua biet nhan cay doi`, recheck thoát 0 không stack trace (đường đọc-cũ: lớp mới vắng hay cũ thì không đóng thêm). Chiều đỏ: bản sao lib bỏ nhánh `cay-doi` → ca đỏ ghim thiếu VIOLATION; recheck bỏ dò năng lực lib → hàng lib đời cũ đỏ.
- AC-8 (judgment): Given `feature-loop/skills/feature-loop/SKILL.md` mục S4 và `CONTEXT.md` mục **Nhãn trạng thái**, When người đọc lạ đọc, Then (a) SKILL nói mã 6 của bước sau-lượt nghĩa là cây đổi trong lượt chấm, lượt không dùng được, không ghi PASS/không đặt `verified`, hoàn lại rồi chấm lại cùng vòng; (b) SKILL tách hai ca hoàn lại — commit chưa đẩy mà phiên này không tạo và không phối hợp → đưa nhánh về sha đã chấm; thay đổi có chủ đích của phiên khác → chấm lại trên HEAD mới — và nói việc khó-đảo (commit đã đẩy, việc của người khác) thì hỏi người; (c) CONTEXT định nghĩa nhãn mới với người gỡ + giá, không mâu thuẫn chữ cũ quanh nó.

## Coverage

Quét Zwicky (preset test-matrix), đầy đủ ở design doc §3–§5.

- **Trục 1 — cách cây đổi** [thước CE: SUY-TỪ-REPO, ba ca crm + bẫy lời giao việc]: commit · sửa đĩa tracked · xoá · commit-rồi-hoàn · tệp mới chưa theo dõi · chạm mtime · cây bẩn sẵn → AC-2, AC-3 toàn phần.
- **Trục 2 — lớp đường** (`phan-loai`): vat · thuoc · ho-so · ngoai · `.acceptance-runs` · `evidence/` → AC-1, AC-2, AC-3.
- **Trục 3 — bên đọc**: thẻ Cổng 2 · s4-args (round) · lưới trước-merge · recheck → AC-4…AC-7. Thẻ Cổng 1 + `khong-can-nguoi.mjs` → Out of scope (giới hạn khai).
- **Trục 4 — đời hồ sơ**: args/sổ đời cũ · lần thử lại cùng round · thước lệch cùng lượt → AC-3, AC-4, AC-5.
- `[GIẢ ĐỊNH]` Lệnh eval/suite và tác tử chấm ở kho tiêu thụ không sửa tệp ĐANG THEO DÕI ngoài `_acceptance/` và ba tiền tố trừ — đo 01/10 bằng ĐỌC mã + lịch sử trên crm · oneflow · radar · media-library (design doc §5.1), chưa chạy lượt nào ở kho tiêu thụ. Ngưỡng nới thành cờ vàng ở Notes.

## Out of scope

- Phép đo dài hơn trần 600 s của làn máy — hạt giống `docs/plans/2026-10-01-hat-giong-phep-do-qua-tran-lan-may.md`.
- Tham số lượt chấm đi bằng đường tệp (`args.argsPath`) — hạt giống `docs/plans/2026-10-01-hat-giong-tham-so-luot-cham-bang-tep.md`.
- B6 (câu người gõ được harness chuyển vào mọi tác tử chấm) — không thêm lời dặn; ngưỡng mở lại giữ ở Out of scope của `cham-khong-tu-dot-luot`.
- Khoá cây (ngăn ghi) — vòng này chỉ PHÁT HIỆN.
- Thẻ Cổng Phạm vi và `khong-can-nguoi.mjs` đọc nhãn mới — lưới trước-merge là chốt (giới hạn khai ở Notes).
- Lưới trước-merge đọc «thước lệch» (cùng lỗ, không có ca thật).
- Sửa `feature-loop/workflows/acceptance-verify.js`; tăng phiên bản gói — kit lên số theo mốc phát hành.

## Notes

- Hạng T3: `lib/nhan-canh-gay.cjs`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` khớp `t3_paths`. Lib nằm trong INIT-CI-COPY-LIST — kho tiêu thụ nhận theo chiến dịch phát hành.
- Giới hạn đã khai, kèm ngưỡng đang đếm:
  - Phát hiện sống ở bước sau-lượt của SKILL; phiên chính bỏ bước ấy thì không có dòng. Ngưỡng: ≥1 hồ sơ ký mà commit lạ của lượt cuối lộ ra sau ký.
  - Tệp mới chưa theo dõi không khoá lượt (gọi tên ở stderr). Ngưỡng: ≥1 ca thật tệp mới chưa theo dõi đổi kết quả lượt chấm.
  - Sửa rồi khôi phục trên đĩa trong lượt, không commit → không thấy. Ngưỡng: ≥1 ca thật.
  - Thẻ Cổng Phạm vi và đường máy-thông T2 không đọc nhãn; CI chặn. Ngưỡng: ≥1 hồ sơ máy-thông bị CI chặn vì nhãn này.
  - Tác tử chấm ghi một tệp đang theo dõi ngoài ba tiền tố trừ (cấu hình công cụ harness…) sẽ khoá lượt; giả định đo bằng đọc, chưa chạy. Ngưỡng nới thành cờ vàng: ≥1 lượt khoá oan có tên. Chi phí trần mỗi ca: một lượt chấm lại cùng round rồi thẻ khoá có tên tệp.
  - Lệnh kho ghi lại tệp đang theo dõi chỉ khi vật lệch (oneflow `gen:abi`) biến một ô đỏ đúng thành lượt không dùng được. Ngưỡng: ≥1 ca thật.
- Bảng dự báo năm dòng (luật (c)): làm-xong→quyết-được ↓ · lượt gọi người/vòng = (↓ ở ca có sự cố) · vòng bị hạ tầng đốt ↓ (lượt cây đổi chạy lại cùng round) · token/vòng = (+1 lượt ở ca có sự cố, hôm nay cũng chấm lại) · phút/lượt =. Điều kiện tin cậy: vòng ĐỔI thành phần đường verdict (nhánh «không dùng được» sau fan-out) → răng cả hai chiều: chiều đỏ AC-2, chiều im AC-3, mỗi AC máy kèm đột biến ở răng hồ sơ (design doc §6).
- Fixture do code sinh trong chính lần chạy; đường suy từ vị trí script; bản sao để tiêm đột biến chụp TRỌN cây làm việc.
