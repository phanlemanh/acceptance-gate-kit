---
schema_version: 1
feature: Định tuyến mục Ngoài-n theo mã mục (tiêu đề gỡ nhãn lượt + tệp) thay vì theo số — dòng sổ người từ nay mang mã; dòng sổ cũ chỉ có số mà ghi trước một lượt chấm sau đó thì coi là chưa định tuyến kèm cờ vàng, không im lặng
slug: dinh-tuyen-theo-ma-muc
owner: phanlemanh@gmail.com
risk_tier: T3      # lib/out-of-contract.cjs thuộc t3_paths (lõi cưỡng chế dùng chung mọi kho)
surfaces: [cli, docs]
status: verified
design_doc: docs/superpowers/specs/2026-10-13-dinh-tuyen-theo-ma-muc-design.md
approved_by: manh
approved_at: 2026-10-13T10:43:29Z
---

# Acceptance Contract: dinh-tuyen-theo-ma-muc

## Context

Gốc: `phanlemanh/crm-onehub#375`, bình luận 13/10 09:39Z — P5 đo ở crm hồ sơ `them-buoc-bao-dung`: sau chữ ký,
một lượt S4 delta chèn mục mới lên đầu `review-findings.md`, 8 dòng sổ gate2 ký theo SỐ trỏ nhầm mục, `khong-can-nguoi`
chỉ báo `Ngoài-9`. Đo 8 kho (design §2): 0/2 235 dòng sổ người mang tiêu đề; 2 hồ sơ máy-thông đang đứng trên
định tuyến lệch (kit `tac-tu-cham-chi-cham-khong`, crm `zalo-qua-webhook`). Vùng A3 (`ngoai-n-tu-dinh-tuyen`). Bản vá
2.29.1 cùng DP10; không gộp trước tag v2.29.0.

Thuật ngữ:
- **mục** = một finding trong khối «Ngoài hợp đồng» của `review-findings.md`, đọc bằng `parse` của
  `lib/out-of-contract.cjs`; nhãn `Ngoài-<vị trí>`.
- **mã mục** = `tieuDeGoc(tiêu đề)` (gỡ nhãn lượt `(rN…)`) + `file` của mục.
- **dòng có mã** = dòng `decisions.jsonl` `stage: gate2` mang `tieu_de` khác rỗng (tuỳ chọn `tep`).
  **dòng chỉ số** = dòng gate2 gọi tên `Ngoài-n` mà không mang `tieu_de`.
- **dòng cũ** = dòng chỉ số mà `run-log.jsonl` có dòng `kind: round-tally` với `ts` sau `at` của dòng (hoặc `at`
  không đọc được trong khi có round-tally).
- **bộ phân giải** = hàm mới trong `lib/out-of-contract.cjs` gán dòng sổ → mục; `mucChuaDinhTuyen` gọi nó.
- **kho thử** = kho git do ca kiểm dựng trong thư mục tạm; mục rút từ `OOC-ITEM-TEMPLATE` của
  `feature-loop/workflows/acceptance-verify.js`, hợp đồng từ `CONTRACT-FRONTMATTER-TEMPLATE`, dòng round-tally đúng
  khuôn `ROUND-TALLY-SCHEMA`.

## Criteria

- AC-1: Given kho thử có 8 mục và 8 dòng có mã (mỗi mục một dòng) ghi sau lượt chấm cuối, When một lượt chấm mới
  (round-tally `ts` sau các dòng) chèn mục thứ 9 lên đầu — mọi mục cũ lùi một số và mang nhãn mang-sang `(r1)` như
  bước mang-sang của S4 chèn, When chạy `khong-can-nguoi.mjs
  --check`, Then thoát 2 và lý do nêu đúng `Ngoài-1` (mục mới) là mục duy nhất chưa người định tuyến; đối chứng
  dương: cùng hồ sơ trước khi chèn → đủ điều kiện (thoát 0). Mục mang nhãn lượt `(r1)` / `(r1 · tệp đã đổi)` vẫn
  khớp dòng ghi lúc chưa có nhãn; mục TƯƠI (không nhãn) trùng tiêu đề + tệp với một mục đã quyết thì KHÔNG thừa
  kế quyết định.
- AC-2: Given kho thử dựng lại ca crm `them-buoc-bao-dung` — 8 dòng CHỈ SỐ ký sau lượt chấm, rồi một lượt chấm mới
  chèn mục lên đầu, When chạy `khong-can-nguoi.mjs --check`, Then thoát 2 và lý do nêu cả 9 mục chưa định tuyến kèm
  cụm «ghi trước lượt chấm»; đối chứng dương: trước khi có lượt chấm mới (8 mục, 8 dòng chỉ số, run-log không có
  round-tally sau dòng) → đủ điều kiện, như hành vi hôm nay (đọc-cũ).
- AC-3: Given ma trận viết trước 14 hàng của bộ phân giải — (1) dòng có mã trỏ đúng số · (2) dòng có mã cũ, mục
  đổi số và mang nhãn lượt · (3) dòng có mã, mục biến mất (mồ côi) · (4) hai mục mang nhãn trùng mã (mồ côi) ·
  (5) dòng có mã ghi sau lượt cuối mà số trỏ mục A, tiêu đề là mục B (mồ côi, A và B chưa định tuyến) · (6) dòng có
  mã cũ, mục cũ mất và mục TƯƠI cùng mã xuất hiện (chưa định tuyến) · (7) dòng chỉ số ghi sau lượt chấm cuối ·
  (8) dòng chỉ số ghi trước lượt chấm (cũ) · (9) dòng chỉ số `at` hỏng, có round-tally (cũ) · (10) dòng chỉ số,
  run-log không có round-tally · (11) dòng khoảng `Ngoai-1 den Ngoai-2` cũ · (12) dòng có mã ghi sau dòng chỉ số cũ
  cho cùng mục · (13) dòng chỉ số `at` MUỘN hơn ts lượt chấm mà giờ trong mã `d-<UTC>-<n>` SỚM hơn (cũ) ·
  (14) dòng chỉ số `at` mang `+07:00` trước ts Z về thời điểm dù chuỗi lớn hơn (cũ), When gọi `mucChuaDinhTuyen`,
  Then mỗi hàng ra đúng tập mục chưa định tuyến khai trước (số hàng chạy == 14).
- AC-4: Given cùng ma trận AC-3 dựng thành kho git làn V (`veto_state: mo`, chưa chữ ký), When chạy
  `pre-merge-check.sh` và bộ quét `start-scan.mjs` trên từng kho, Then lưới chặn đúng các hàng còn mục chưa định
  tuyến và NOTE làn V ở các hàng sạch, và bộ quét KHÔNG xếp «máy đi tiếp» đúng ở các hàng lưới chặn (đẳng thức hai
  bản dựng); hồ sơ `machine-cleared` có dòng cũ → VIOLATION nêu «chưa người định tuyến».
- AC-5: Given mọi bên gọi luật xanh-sạch rút bằng quét `scripts/`, When một bên gọi không truyền khoá `runLog`
  trong ngữ cảnh, Then `xanhSach` nổ có tên nêu `runLog` (không lặng lẽ mù); và mutant «truyền runLog rỗng» ở từng
  bên gọi làm ca AC-2 của bên ấy đỏ (bản lành xanh trên cùng fixture trước).
- AC-6: Given kho thử bật `feature_loop.ngoai_n_tu_dinh_tuyen`, When (a) dòng máy cũ có mã mà mục của nó đổi số do
  mục mới chèn đầu, Then `dinh-tuyen-may.cjs` khớp dòng máy vào đúng mục (không báo «dòng máy trỏ mục đã đổi»), chỉ ghi
  dòng máy mới cho mục mới khi đề xuất của nó là known-limits/wont-fix; When (b) sổ có dòng người chỉ số đã cũ,
  Then thoát 2 với dòng bắt đầu `dinh-tuyen-may:` nêu «ghi trước lượt chấm» và không ghi byte nào vào sổ hay hợp đồng.
- AC-7: Given hồ sơ có dòng cũ, When render thẻ Cổng 2 (`gate-card.js`), Then thẻ có cờ vàng nêu nhãn các mục của
  dòng cũ và giờ lượt chấm, và mọi mục ấy là ô hỏi; Given hồ sơ không có dòng cũ, Then `--extract` của mọi hồ sơ đã
  ký trong kho kit bằng bản ghi mốc định tuyến (LM20 xanh — thẻ không đổi định tuyến).
- AC-8: Given khuôn dòng sổ người mới trong khối marker `NGOAI-N-GATE2-LINE` của `commands/signoff.md` (mang
  `tieu_de` + `tep`), When ca kiểm rút khuôn, điền từ `parse()` của kho thử rồi chèn mục mới lên đầu, Then bộ phân
  giải định tuyến đúng các mục cũ (round-trip bên viết → bên đọc); mutant bỏ `tieu_de` khỏi khuôn → ca đỏ.
- AC-9: Given cây `_acceptance/` và `lib/` của MỐC CỐ ĐỊNH (cha của commit đầu tiên đưa bộ phân giải vào lib — rút
  bằng lệnh, đứng yên cả trên nhánh lẫn sau gộp), When so `mucChuaDinhTuyen` của lib HEAD với lib mốc trên mọi hồ sơ
  chưa chữ ký của cây mốc, Then tập hồ sơ đổi kết quả == tập khai ở Cổng Phạm vi ({`tac-tu-cham-chi-cham-khong`});
  và trên cây HEAD, `pre-merge-check.sh` không in VIOLATION «chưa người định tuyến» cho hồ sơ nào trong tập khai
  (hồ sơ ấy đã được xử theo quyết định Cổng Phạm vi trong PR).

## Coverage

Quét `morphological-scan` (preset test-matrix), chân ngành: dấu vân tay kết quả qua các lượt quét của SARIF 2.1.0
(`partialFingerprints`) — định danh phát hiện bằng nội dung, không bằng vị trí.

- Trục A — hình dạng dòng sổ: có mã | chỉ số đơn | chỉ số khoảng | dòng máy (đã có `tieu_de`)
  [thước CE: SUY-TỪ-REPO `scripts/dinh-tuyen-may.cjs` khối DINH-TUYEN-MAY-LINE + đo 2 235 dòng ở 8 kho]
- Trục B — thời điểm dòng so lượt chấm: sau lượt cuối | trước một lượt sau | `at` hỏng | run-log không có round-tally
  [thước CE: đo 8 kho — 181 dòng cũ, 7 dòng `at` hỏng]
- Trục C — mục đổi giữa lượt: không đổi | chèn đầu (đổi số) | biến mất | trùng mã | nhãn lượt `(rN…)`
  [thước CE: ca crm `them-buoc-bao-dung` + kit `tac-tu-cham-chi-cham-khong` + crm `zalo-qua-webhook`]
- Trục D — bên đọc: `khong-can-nguoi` (CLI · quét · bản đồ) | lưới bash | thẻ | máy định tuyến
  [thước CE: quét bên gọi `xanhSach|khongCanNguoi` trong `scripts/` + grep `mucChuaDinhTuyen`]

Core → AC-1…AC-9. Later: dòng khoảng có mã (signoff ghi một dòng mỗi mục nên không sinh). Never: dựng lại số cũ
từ lịch sử git (lib thuần, không gọi git; bộ đọc chạy cả ở hook ghi-lúc-viết).

## Out of scope

- Ghi lại (migrate) dòng sổ cũ của các kho — dòng cũ đọc khoan dung, người định tuyến lại khi lượt chấm sau.
- Đổi định tuyến hỏi/báo của thẻ Cổng 2 cho mục Ngoài-n (mục vẫn là ô hỏi trừ dòng máy).
- Dòng máy mang thêm `tep` — dòng máy giữ khuôn A3.
- Xử hồ sơ crm `zalo-qua-webhook` (việc của crm khi cài 2.29.1 — ghi vào danh sách kiểm nhận mốc).

## Notes
