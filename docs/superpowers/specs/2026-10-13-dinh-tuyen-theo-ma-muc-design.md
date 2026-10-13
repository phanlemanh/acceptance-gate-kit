# Định tuyến mục Ngoài-n theo mã mục, không theo số — thiết kế (vòng VÁ DP11)

Ngày: 13/10/2026 · hạng T3 (chạm `lib/out-of-contract.cjs`) · bản vá 2.29.1 (cùng DP10), không gộp trước tag v2.29.0.

## 1. Gốc (neo ngoài)

`phanlemanh/crm-onehub#375`, bình luận 13/10 09:39Z (Mac Studio, P5 đo ở hồ sơ crm `them-buoc-bao-dung`):
`daDinhTuyen` của `lib/out-of-contract.cjs` coi mục thứ N «đã người định tuyến» khi có một dòng sổ
`stage: gate2` gọi tên `Ngoài-N`. Một lượt S4 delta sau chữ ký chèn finding mới lên đầu `review-findings.md`
→ mọi mục cũ lùi một số → 8 dòng sổ ký trước trỏ nhầm mục («Ngoài-4: mở hợp đồng mới» vốn cho màn bản ghi rơi
vào mục quy tắc ngày VN), `khong-can-nguoi` chỉ còn báo `Ngoài-9`. Hậu quả nặng: **mục mới chưa ai quyết bị coi
là đã quyết** → làn V / máy-thông đi qua sai.

Giới hạn này đã được khai ở hai chỗ, nay đủ ngưỡng mở lại: chú thích `GIỚI HẠN ĐÃ KHAI` trên `daDinhTuyen`
(hồ sơ ho-so-khep-thoi-hoi) và Known limits của A3 (`_acceptance/ngoai-n-tu-dinh-tuyen/`, «dòng máy cũ vẫn đứng
khi đổi đề xuất»). A3 đã giải nửa máy: dòng máy mang `tieu_de` và thẻ so `cungMuc` (tiêu đề gỡ nhãn lượt). Nửa
người vẫn khớp theo số.

## 2. Số đo trước thiết kế (8 kho trên máy, 13/10)

Đọc mọi dòng sổ `gate2` gọi tên `Ngoài-n` ở 8 kho có `_acceptance/`:

- 321 hồ sơ · 2 235 dòng · **0 dòng người mang tiêu đề** (khoá định tuyến hôm nay chỉ là số).
- 181 dòng chỉ-số ghi TRƯỚC một lượt chấm sau đó (`round-tally.ts > at`) ở 44 hồ sơ. 42 hồ sơ đã ký — luật
  xanh-sạch không hỏi chúng. **2 hồ sơ máy-thông, chưa chữ ký** đang khai «máy thông» trên định tuyến lệch:
  - kit `tac-tu-cham-chi-cham-khong`: dòng sổ Ngoài-1…7 ghi lúc «Trả lại» 09/10 16:16Z; lượt r2 16:22Z và r3
    22:23Z đánh số lại; 7 mục r3 chưa có dòng sổ gate2 nào cho riêng chúng.
  - crm `zalo-qua-webhook`: Ngoài-1…8 ghi 24/09 01:35Z, lượt r2 01:37Z sau đó; Ngoài-1 cũ là «hai biến Zalo trong
    globalEnv», Ngoài-1 hiện tại là «hằng mã HTTP».
  Cả hai là ca dương thật của lỗi — không phải nhiễu.
- 7 dòng không có `at` đọc được — đều ở hồ sơ đã ký.
- Ca gốc `them-buoc-bao-dung` trên `origin/feat/them-buoc-bao-dung` (aa57e00f8): round-tally r3 `02:31:28Z`, 8 dòng
  gate2 `06:07:54Z` (sau r3 — hôm nay tin được), chưa có lượt r4. Lượt delta chèn mục nằm ở cây Mac Studio, chưa đẩy:
  không đếm được «8/8 dòng ts > at» trên origin; ca AC-2 dựng lại đúng hình dạng ấy bằng kho thử.

## 3. Thiết kế

### 3.1 Mã mục (khoá ổn định)

Mã của một mục = `tieuDeGoc(tiêu đề)` (gỡ nhãn lượt `(rN…)` — hàm A3) + `file` của mục. Chỗ so DUY NHẤT dời từ
`scripts/dinh-tuyen-may.cjs` xuống `lib/out-of-contract.cjs` (`NHAN_LUOT_RE`, `tieuDeGoc`, `cungMuc`); bên ghi máy
và thẻ re-export / gọi lại từ lib — một nguồn, không bản chép thứ hai. Neo vào khuôn kit (`OOC-ITEM-TEMPLATE`:
tiêu đề in đậm + dòng `file:`), không vào từ vựng một kho. Chuẩn ngành cùng hình dạng: dấu vân tay kết quả của
SARIF 2.1.0 (`partialFingerprints`) — định danh một phát hiện qua các lượt quét bằng nội dung, không bằng vị trí.

### 3.2 Bộ phân giải dòng sổ → mục (MỘT hàm trong lib)

`ganDinhTuyen(findingsText, ledgerText, runLogText)` duyệt dòng `gate2` theo thứ tự sổ (dòng sau thắng).

**Mốc của một dòng** = giờ SỚM NHẤT đọc được trong hai nguồn: `at` (người/tác tử viết, có thể mang múi giờ
`+07:00` — so bằng `Date.parse`, không so chuỗi) và giờ máy nhúng trong mã `d-<UTC>-<n>` (khối `DEC-ID-RECIPE` tính
bằng `date -u` lúc ghi). Lấy giờ sớm nhất vì sai lệch nguy hiểm là mốc MUỘN hơn thật (dòng ký trước lượt chấm bị
đọc thành ký sau); mốc sớm hơn thật chỉ làm dòng bị coi là cũ — chiều an toàn. Không đọc được giờ nào mà run-log
có round-tally → dòng cũ. **Dòng cũ** = mốc của dòng trước `ts` của một dòng `kind: round-tally` trong run-log.

1. **Dòng có mã** (`tieu_de` khác rỗng, tuỳ chọn `tep`): ứng viên = mục cùng `tieuDeGoc` (và cùng `file` khi dòng
   có `tep`).
   - Dòng KHÔNG cũ (ghi trên chính tệp phát hiện hiện tại): số trong `decision` phải trỏ một ứng viên → định tuyến
     mục đó. Số trỏ mục khác mã (chép lệch một hàng) → dòng **mồ côi**: không định tuyến cả mục của số lẫn mục
     của tiêu đề, cờ vàng.
   - Dòng cũ (mục có thể đã đổi số): chỉ khớp ứng viên MANG NHÃN LƯỢT `(rN…)` — nhãn do bước mang-sang của S4
     chèn, nghĩa là mục này là mục cũ được chở qua lượt mới. Đúng một ứng viên mang nhãn → định tuyến nó; 0 hoặc
     ≥2 → mồ côi. Mục tươi cùng tiêu đề + tệp ở lượt sau (không nhãn) KHÔNG thừa kế quyết định cũ.
2. **Dòng chỉ số** (đời trước): đọc-cũ khoan dung. Dòng cũ không định tuyến mục nào; các số của nó vào `soCu`
   (cờ vàng). Dòng không cũ → định tuyến theo số như hôm nay.
3. Dòng máy (khoá `may`) đã mang `tieu_de` → đi nhánh 1; A3 giữ ngữ nghĩa «lệch»: dòng máy mồ côi.

Mọi đường ghi `review-findings.md` của S4 đều phát round-tally: workflow đẩy `tallyLine` ở MỌI verdict kể cả các
đường BLOCKED trả về sớm (khối `ROUND-TALLY-SCHEMA`, ca W32/W37 của `tests/workflows/acceptance-verify.test.mjs`),
và vòng chính ghi `result.runLog` TRƯỚC `review-findings.md` ở mọi verdict (SKILL feature-loop S4 «Mọi verdict»).

`mucChuaDinhTuyen` = mục không được dòng nào định tuyến; trả thêm lý do khi mục chưa định tuyến vì dòng cũ.

### 3.3 Bên gọi

- `khong-can-nguoi.mjs` (`xanhSach`): ngữ cảnh BẮT BUỘC thêm khoá `runLog` (cùng luật nổ-có-tên như
  `findings`/`ledger`) — bên gọi quên truyền thì không lặng lẽ mù. Lý do trượt nêu «dòng sổ theo số ghi trước lượt
  chấm <ts>».
- Bên gọi: CLI `khong-can-nguoi`, `start-scan.mjs`, `product-map.mjs` đọc `run-log.jsonl` cạnh hồ sơ.
- `pre-merge-check.sh` (`xanh_sach_check`): truyền thêm `run-log.jsonl` vào lệnh `node -e` — đẳng thức hai bản dựng
  (LV5 / HK-AC4-bash) giữ.
- `dinh-tuyen-may.cjs`: `keHoach` dùng bộ phân giải của lib; có `soCu` → thoát 2 dòng `dinh-tuyen-may:` (không
  ghi dòng máy lên mục mà người từng quyết theo số cũ); dòng máy đổi số mà tiêu đề còn → khớp đúng mục, không
  còn báo lệch oan.
- `gate-card.js` Cổng 2: cờ vàng khi có `soCu` (nêu nhãn + giờ lượt chấm), và dòng máy khớp theo mã. Định tuyến
  hỏi/báo của thẻ KHÔNG đổi (mục Ngoài-n vốn luôn là ô hỏi trừ dòng máy).

### 3.4 Bên ghi người

`commands/signoff.md` thêm khối marker `NGOAI-N-GATE2-LINE`: mỗi mục `Ngoài-<n>` một dòng sổ, mang
`"tieu_de":"<tiêu đề mục nguyên văn>","tep":"<file của mục>"` chép từ `review-findings.md`. Chép sai → dòng mồ côi →
mục được hỏi lại (an toàn chiều ngược). Ca round-trip rút khuôn từ marker, điền từ `parse()` của fixture, bộ đọc
định tuyến đúng sau khi đánh số lại.

## 4. Hệ quả lên kho (đưa lên Cổng Phạm vi)

Luật mới đổi phán quyết đúng 2 hồ sơ đã đo (§2). Lưới trước-gộp quét MỌI hồ sơ `machine-cleared` nên:
- kit: gộp vòng này mà `tac-tu-cham-chi-cham-khong` chưa có dòng sổ cho 7 mục r3 → CI kit đỏ.
- crm: cài 2.29.1 → `zalo-qua-webhook` đỏ tới khi người định tuyến 5 mục hiện tại.
Hồ sơ đã ký: không đổi màu (luật xanh-sạch chỉ hỏi hồ sơ chưa chữ ký); thẻ của chúng có thể hiện cờ vàng.
Không cần ghim lại hồ sơ nào vì vòng này (lib đổi → các hồ sơ có eval chạm lib hoá cũ theo nhịp release như mọi mốc).

## 5. Giới hạn khai

- Hai mục mang nhãn lượt cùng tiêu đề gốc và cùng tệp → mồ côi, mục được hỏi lại (an toàn, thừa một câu hỏi).
- Mục mang sang mà tác tử đổi chữ tiêu đề (không giữ nguyên) → dòng mồ côi, mục hỏi lại (an toàn).
- **Chiều nguy hiểm còn lại:** run-log VẮNG hoặc không có round-tally nào trong khi `review-findings.md` đã được
  viết lại ngoài S4 (tay, hay bởi một đường chưa phát round-tally) → dòng chỉ số được tin theo số như hôm nay.
  Không dựng phép đo mới cho vế này: lưới trước-merge đã coi run-log vắng là VIOLATION ở mọi pin cite `run_id`.
  Ngưỡng mở lại: ≥1 hồ sơ ở kho tiêu thụ có `review-findings.md` đổi sau dòng sổ gate2 mà không có round-tally
  mới hơn dòng ấy (đếm bằng `git log` hai tệp khi có báo cáo).
- Lượt chấm BLOCKED vì hạ tầng vẫn ghi round-tally → dòng trước nó bị coi là cũ dù mục không đổi — chiều an toàn.
