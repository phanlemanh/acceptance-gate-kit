# Lời mời ở trần lượt là vật máy sinh — lối sống, có giá, khuyến nghị tất định

**Ngày:** 2026-10-03 · **Slug:** `loi-moi-tran-luot-loi-song-co-gia` · **Hạng:** T2
Gốc: crm/_acceptance/muc-tieu-va-kr · hạt giống `docs/plans/2026-10-03-hat-giong-loi-moi-tran-luot-loi-song-co-gia.md`

## 1. Điều owner muốn (đã viết lại, owner sửa nếu lệch)

Khi một vòng chạm trần lượt chấm, hoặc cùng một eval hỏng lặp lại, người quyết phải đọc được trong
một phút: thước nào đang lặp, một lượt nữa tốn bao nhiêu phút máy, có những lối nào, máy khuyên lối
nào và vì sao. Không lối nào trong lời mời được là lối chết. Ràng buộc: không chạm đường phán quyết
(finder → refute → REJECT), không thêm cổng, không thêm lượt gọi, kho không gặp sự cố này không mất gì.

Ca đẻ ra vòng (crm `muc-tieu-va-kr`, 02/10): ba lượt máy hỏi chủ kho ngoài thiết kế, 3/3 «theo
khuyến nghị»; hai lần máy khuyên lối đắt (thêm 3–6 giờ máy) trong khi lối rẻ nằm ngay trên thẻ; một
lần máy khuyên «trình Cổng Bằng chứng ngay» trên báo cáo REJECT — lối không ký được. E14 không ra
phán quyết dùng được ở cả bốn lượt (`cannot_run` · mã 137 · `cannot_run` · đỏ).

## 2. Vì sao lỗi này có chỗ sống trong kit hôm nay

- Trần 3 lượt và điều khoản dừng-vá là **lời** trong SKILL: «quá → DỪNG, escalate user kèm phân
  tích từng round». `s4-args.mjs` không có răng nào cho trần; lời mời do phiên tự soạn.
- Thẻ Cổng Bằng chứng ở nhánh CHƯA-ký-được (`scripts/gate-card.js`, nhánh `!approvable`) in
  «VIỆC CỦA ANH: không cần làm gì — quay lại sửa code». Đúng ở lượt 1–2; ở trần lượt thì đó chính
  là chỗ người phải quyết, và thẻ không nói gì.
- Điều khoản dừng-vá liệt «ship với giới hạn đã biết» như một lối riêng mà không nói cơ chế; phiên
  crm dịch nó thành «ký trên báo cáo REJECT», thứ `signoff` từ chối.

Hồ sơ `loi-moi-cong-may-sinh` (02/09) đã biến lời mời Cổng 1 và Cổng 2 thành vật máy sinh. Điểm
dừng ở trần lượt là lời mời duy nhất còn soạn tay.

## 3. Ba phương án

| | Phương án | Được | Mất |
|---|---|---|---|
| **A (chọn)** | Mở rộng nhánh CHƯA-ký-được của thẻ: khi lượt ≥ trần hoặc có eval lặp, thẻ in khối «Lối ra» tính từ sổ chạy | Một nguồn với thẻ hiện có; dùng lại khuôn «ba lối + giá» của ca mù; lối ký vắng theo cấu trúc (thẻ này vốn không có nút ký) | Chạm `scripts/gate-card.js` — hồ sơ ghim `scripts/**` hoá cũ tới chiến dịch ghim lại kế |
| B | Script riêng `loi-ra.mjs` phiên gọi ở trần lượt | Không chạm thẻ | Hai nguồn lời mời (thẻ nói «không cần làm gì», script nói «chọn lối»); thêm một lệnh phiên phải nhớ gọi |
| C | Chỉ sửa câu chữ SKILL | Rẻ nhất | Dặn-bằng-lời làm nghiệm — hiến pháp cấm; đúng lớp lỗi đang sửa |

## 4. Thiết kế

### 4.1 Mô-đun thuần `scripts/loi-ra-tran-luot.cjs`

Một hàm, không đọc đĩa:

```
loiRa({ runLogText, verdict, trangThai, expectedExit, evalMeta }) → null | {
  tran: boolean,                       // lượt cuối ≥ TRAN_LUOT (3)
  luot: [{ round, verdict|null, phut|null }],
  lap:  [{ evalId, ac, luot: [r…] }],  // eval chưa đạt ở lượt cuối VÀ ở ≥1 lượt trước
  loi:  [{ ma, ten, gia }],            // đúng ba: thu-pham-vi · luot-nua · dung
  khuyen_nghi: { ma, vi_sao },
}
```

- **Khi nào khác null:** `verdict` là REJECT hoặc BLOCKED, thẻ không ký được, `trangThai` không
  thuộc {thước lệch, cây đổi, chết lần đầu} (ba trạng thái ấy máy tự chấm lại, không phải lời mời),
  VÀ (`tran` hoặc `lap` khác rỗng). Mọi ca khác → null → thẻ giữ nguyên từng byte.
- **Lượt cuối:** số `round` lớn nhất trên mọi dòng sổ có `round` là số. Lượt chấm tuần tự (không
  có dòng `round-tally`) vẫn đếm được qua dòng eval.
- **Eval chưa đạt ở một lượt** — lớp sáu hình, ma trận viết trước (gap-probe F1): dòng CUỐI của
  cặp (round, evalId) có (1) `cannot_run: true`, hoặc (2) `killed_by_tool: true`, hoặc (3)
  `exit_code` khác 0 và khác mã đã khai `expected_exit`; (4) `exit_code` ĐÚNG mã đã khai là ĐẠT;
  (5) dòng cuối thắng dòng trước (lượt thử lại cùng round); (6) dòng `SUITE-*` và id không có
  trong `evals.yaml` không tính. `evals.yaml` vắng hoặc không đọc được → KHÔNG lọc id (mọi id
  không `SUITE-` đều tính) và khối in cờ vàng «không đọc được evals.yaml — AC không xác định»
  (gap-probe F4), không im.
- **Lượt cuối cụt** (gap-probe F3 — hình của ca crm): eval đã chưa đạt ở một lượt trước mà VẮNG
  dòng ở lượt cuối (lượt bị công cụ ngắt giữa chừng) → tính là chưa ra phán quyết ở lượt cuối,
  vào `lap` với ghi chú «không có dòng ở lượt r». Eval từng đạt mà vắng dòng (carry) không vào.
- **Phút một lượt:** `ts` của dòng `thuoc-vat` cuối cùng round − `ts` của dòng `round-tally` cuối
  cùng round. `ts` của `round-tally` là `invokedAt` của args — mốc sinh args đầu lượt (cùng
  nghĩa với `luot_ts` của `lib/nhan-canh-gay.cjs`); `thuoc-vat --write` ghi ngay sau khi lượt
  về, nên hiệu là thời lượng lượt. Thiếu một vế, hoặc hiệu âm → `null`, thẻ in «chưa đo». Không
  đoán, không in 0. Phép đo của AC-5 rút TÊN TRƯỜNG từ dòng do hai bên viết thật ghi (gap-probe F2).
- **Ba lối (cố định, đều sống):**
  - `thu-pham-vi` — «thu phạm vi: đưa <AC> ra Known limits có tên, ký lại Cổng Phạm vi». Giá: một
    chạm ký lại; tiêu chí ấy ship không có bằng chứng máy; chấm lại phần còn lại.
  - `luot-nua` — «sửa rồi chấm thêm một lượt» (+ «vượt trần 3 lượt» khi `tran`). Giá: «khoảng N
    phút máy (lượt r đo được)» hoặc «phút máy: chưa đo»; kèm «<E> đã k lượt chưa đạt» khi có lặp.
  - `dung` — «dừng vòng, giữ nhánh và hồ sơ». Giá: không ship; quay lại được.
- **Không có lối ký.** Thẻ in một dòng cố định: «Không có lối ký: báo cáo <verdict> không ký được.»
- **Khuyến nghị tất định:** có eval lặp → `thu-pham-vi` («cùng một thước chưa đạt ở k lượt — khuôn
  sai, không phải chi tiết sai»); không lặp → `luot-nua` («mỗi lượt hỏng một chỗ khác — vòng đang
  tiến»). Luật này là điều khoản dừng-vá áp lên thước; nó không so phút, nên không thiên về «luôn
  thu hẹp».

### 4.2 Thẻ (`scripts/gate-card.js`)

- Nhánh `!approvable`: khi `loiRa` khác null, khối «👉 VIỆC CỦA ANH» đổi từ «không cần làm gì» sang
  khối «Lối ra»: dòng từng lượt (verdict · phút), dòng từng eval lặp (id · AC · các lượt), ba lối
  kèm giá, dòng không-có-lối-ký, dòng khuyến nghị.
- `--extract` (Cổng 2): thêm khoá `loi_ra` CHỈ khi khác null (khoá vắng ở mọi ca cũ).
- Chuỗi trên HTML rút từ đúng đối tượng `loi_ra` — một nguồn.

### 4.3 SKILL (`feature-loop/skills/feature-loop/SKILL.md`)

- Câu «Tối đa 3 round — quá → DỪNG, escalate user…» thành khối marker `TRAN-LUOT-LOI-RA`: ở trần
  lượt và ở dừng-vá, phiên render thẻ và mời bằng ĐÚNG khối «Lối ra»; không soạn thêm lối, không
  đổi khuyến nghị, không mời ký; được thêm tối đa ba dòng phân tích từng lượt. Thẻ không in khối
  (bản acceptance-gate cũ) → một dòng báo + ba lối cố định.
- Sau điều khoản dừng-vá, một câu: «ship với giới hạn đã biết» = thu phạm vi có tên, không phải ký
  trên báo cáo REJECT.

### 4.4 Khối trên thẻ trông thế nào (ca crm, sau lượt 3)

```
Cổng 2 · CHƯA ký được                                  [không chạy được — chưa thể ký]
Vì sao chưa ký được
  Không chạy được: 2 lệnh …
👉 VIỆC CỦA ANH — chọn một lối ra
  Đã chấm 3 lượt (trần 3): lượt 1 BLOCKED · 40 phút — lượt 2 REJECT · chưa đo — lượt 3 BLOCKED · 48 phút
  Lặp lại: E14 (AC-11) chưa đạt ở lượt 1, 2, 3
  1. thu phạm vi: đưa AC-11 ra Known limits có tên, ký lại Cổng Phạm vi
     — một chạm ký lại; tiêu chí ấy ship không có bằng chứng máy; chấm lại phần còn lại
  2. sửa rồi chấm thêm một lượt (vượt trần 3 lượt)
     — khoảng 48 phút máy (lượt 3 đo được); E14 đã 3 lượt chưa đạt
  3. dừng vòng, giữ nhánh và hồ sơ — không ship; quay lại được
  Không có lối ký: báo cáo BLOCKED không ký được.
  Máy khuyên lối 1: cùng một thước chưa đạt ở 3 lượt — khuôn sai, không phải chi tiết sai.
```

## 5. Đo

Một tệp lưới thường trực `tests/scripts/lmtl-the.test.mjs`. Sổ chạy của fixture do CHÍNH bộ chấm
sinh (harness `tests/workflows` chạy `acceptance-verify.js` với tác tử giả, ghi nguyên
`result.runLog`); dòng `thuoc-vat` do `thuoc-vat.mjs --write` thật ghi trên kho git code sinh.
Lượt tuần tự = cùng các dòng ấy bỏ dòng `round-tally`. Mỗi nhóm ca có đối chứng dương trên cây
thật và một đột biến trên bản sao `scripts/` + `lib/` + `skills/` (thay nguyên văn đúng một chỗ,
chứng mũi tiêm trúng trước khi chấm), ghim tên ca đỏ. Ca được gọi tên mà không in dòng PASS/FAIL
→ tệp tự thoát khác 0 («ca không chạy»).

| Đột biến | Phải đỏ ca |
|---|---|
| `tat-khoi` — điều kiện khác-null thành luôn null | LT-AC1-lap |
| `them-loi-ky` — chèn lối thứ tư mã `ky` | LT-AC3-khong-ky |
| `phut-ve-0` — vế thiếu trả 0 thay null | LT-AC5-chua-do |
| `lap-moi-luot` — bỏ điều kiện «gồm lượt cuối» | LT-AC6-im |
| `bo-expected-exit` — mã đúng `expected_exit` tính là chưa đạt | LT-AC1-lap (hàng đặc hiệu 4) |
| `bo-loc-id` — `SUITE-*` lọt vào `lap` | LT-AC1-lap (hàng đặc hiệu 6) |
| `nuot-evals-hong` — evals.yaml hỏng mà không cờ vàng | LT-AC9-so-hong |

Chiều im (gap-probe F5): năm hàng — REJECT lượt 1 · REJECT lượt 2 không lặp · từng lặp nay đạt ·
PASS · BLOCKED cạnh mù — dựng bằng bản thẻ trước vòng (`git archive` ở cha của commit đầu đưa
chuỗi `loi-ra-tran-luot` vào `scripts/gate-card.js` — sha là đầu ra lệnh) phải bằng từng byte thẻ
dựng bằng bản hiện tại.

## 6. Quét độ phủ (Zwicky, preset test-matrix)

- **Trục A — trạng thái thẻ** [SUY-TỪ-REPO: scripts/gate-card.js, lib/nhan-canh-gay.cjs]: REJECT ·
  BLOCKED không phân loại · BLOCKED cạnh mù (ký được) · PASS/PENDING · khoá khác (thước lệch, cây
  đổi, chết lần đầu).
- **Trục B — lịch sử lượt** [SUY-TỪ-REPO: SKILL dừng-vá + trần; ca crm bốn lượt]: lượt 1 · lượt 2
  không lặp · eval lặp gồm lượt cuối · ≥ trần không lặp · từng lặp nhưng lượt cuối đã đạt.
- **Trục C — hình dạng sổ** [SUY-TỪ-REPO: run-log thật của ca crm mang cả ba hình]: lượt workflow
  (có `round-tally` + `thuoc-vat`) · lượt tuần tự (không `round-tally`) · thiếu `thuoc-vat` · lượt
  cuối cụt · dòng hỏng / sổ vắng · `evals.yaml` không đọc được.
- **Trục D — mặt ra**: HTML · `--extract` · chỉ dẫn SKILL.
- Chân ngành: [NGÀNH: circuit breaker — Nygard, «Release It!»] sau N lần hỏng thì thôi thử, mở lại
  bằng MỘT lượt thử có giới hạn → khớp lối `luot-nua` là một lượt, không phải quay lại vòng tự
  động. [NGÀNH: retry budget — Google SRE Book] ngân sách thử lại tính bằng tài nguyên → ứng viên
  «ngân sách phút cho lượt», xếp Later.

Core (5 ô của 25): REJECT × lặp · REJECT × trần-không-lặp · REJECT × lượt 1–2 (im) · ký được × mọi
lịch sử (vắng) · BLOCKED không phân loại × lặp. Các ô còn lại của A × B vào ma trận viết trước của
cùng các AC ấy (số assert = số hàng). Trục C và D là lớp cắt ngang.

## 7. Ngoài phạm vi

- Phút theo từng eval («thước này ăn 95 % lượt») — cần đọc `usage-report.md`, một nguồn thứ hai
  có nhãn do phiên gõ tay; để Later, hạt giống giữ.
- Răng ở `s4-args.mjs` chặn lượt vượt trần khi sổ chưa có quyết định của người.
- Đường «thước lệch» ở Cổng Bằng chứng (ứng viên thứ hai của hạt giống) — CỘNG riêng, chưa đề xuất.
- Thước chạy thước, glob `paths` làm danh sách hồi quy — vật của kho crm.
- Sửa `feature-loop/workflows/acceptance-verify.js`; tăng phiên bản gói.
