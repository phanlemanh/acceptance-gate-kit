# Hạt giống — TC1b: năm mục ngoài hợp đồng của vòng đánh thức đọc nhịp đúng mã phiên

**Ngày:** 2026-10-26 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** TRỪ (sửa lỗ do chính vòng TC1 để lại).
Gốc: `acceptance-gate-kit/_acceptance/danh-thuc-doc-nhip-dung-ma/` — chủ kho chọn «mở hợp đồng mới» cho Ngoài-1, 5, 6,
7, 8 ở Cổng Bằng chứng 26/10 (dòng sổ `stage: gate2` của hồ sơ; mục nguyên văn ở `review-findings.md` lượt 3).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

Luật kho: lối «mở hợp đồng mới» ở Cổng Bằng chứng ghi hạt giống, không tạo ô. Hàng cắt vào mốc «Tinh chỉnh sau hai
đợt thử» (05/11) khi chủ kho gọi tên, hoặc ngay khi TC2 sắp mở — mục 3 dưới đây chặn TC2.

## 1. `vai --giam-sat <X>` ghi mã CLI của phiên GỌI làm `phien_cli` của giám sát mới (Ngoài-5, Ngoài-8 — cùng một lỗi)

`nhanVaiGiamSat` lấy mặc định `phienCli = CLAUDE_CODE_SESSION_ID`. Lệnh `vai --giam-sat X` (dieu-phoi.mjs, nhánh `vai`)
là giám sát A trao vai cho phiên X: biến môi trường là của A, nên vai ghi `{ phien: X, phien_cli: <CLI của A> }`. Đánh thức
và chẩn đoán đọc nhịp của A thay cho X — X chết mà A còn sống thì không ai được báo. Tự lành khi X chạy `tiep-tuc`.
**Sửa:** lệnh `vai` truyền `phienCli: null` khi `co['giam-sat'] !== co.phien`. Chiều đỏ: ca A trao vai cho X, chỉ A có
nhịp → đánh thức trả `bao-chu-kho` (bản lỗi trả `nhan-giam-sat`).

## 2. Lời dặn bước 5 «mã CLI cũng nhận» trái hành vi chẩn đoán (Ngoài-1)

`dieu-phoi/commands/tiep-tuc.md` bước 5 nói `chan-doan --phien` nhận cả mã CLI, nhưng mục `giam-sat` chỉ `du` khi `--phien`
bằng mã app của vai; truyền mã CLI ra `thieu` giả và bước 5 lại bảo làm tiếp mục `thieu` → phiên có thể nhận vai bằng mã
CLI, tái tạo đúng lỗi TC1. **Sửa (một trong hai, chọn ở vòng):** bỏ vế «mã CLI cũng nhận», hoặc cho `chanDoan` coi
`phien === vai.giam_sat.phien_cli` là chính giám sát. Chiều đỏ: ca `chan-doan --phien c-gs` trên vai `local_gs`/`c-gs`.

## 3. Hai phép đo thành bất biến lúc gộp trong suite thường trực (Ngoài-6, Ngoài-7)

- **TC1-09** so cây hiện tại với sha ghim `45e9f2cf…` và đòi tập ca đổi thân BẰNG khoá `ca_doi_than` trong sổ của hồ sơ
  TC1. Sau khi gộp, vòng nào đổi thân một ca `tests/dieu-phoi/*.test.mjs` (TC2 sẽ đổi) là CI đỏ cho tới khi ghi sổ hồ sơ
  đã ký. **Sửa:** khoá khoảng so vào commit gộp PR của nhánh `vong/danh-thuc-doc-nhip-dung-ma` (khuôn `mocSo()` của
  SDT-07/DP8-11) và dùng bộ tách khối mới (`khoiCa` của on-dinh-r2, không phải bản cũ cột 0).
- **TC1-06** so TRỌN đầu ra `chan-doan --chi-tiet` với gói ở sha ghim → vòng sau đổi bất kỳ mục chẩn đoán nào là đỏ.
  **Sửa:** sau gộp so bản `<commit gộp>^2` với sha ghim (cả hai rút bằng `git archive`), hoặc thu phép so về các mục TC1
  chạm (`hook-phien`, `giam-sat`, `vai-ma`, đầu ra đánh thức).

Chiều đỏ của mục 3: dựng một commit gộp giả của nhánh trong kho tạm, đổi thân một ca DP3 SAU commit gộp → TC1-09 im;
đổi trước commit gộp mà không ghi sổ → đỏ.

## Ngưỡng mở thành ô

Mục 3 TRƯỚC khi TC2 (`lenh-dot-ghi-dung-hang`) gộp — TC2 đổi ca ở `tests/dieu-phoi`. Mục 1–2: cùng vòng, cắt ở mốc 05/11.

**Người hưởng:** giám sát của mọi đợt (mục 1–2: không ai bị báo sai về giám sát mới) · máy làm các vòng dieu-phoi kế tiếp
(mục 3: không CI đỏ giả sau gộp).
