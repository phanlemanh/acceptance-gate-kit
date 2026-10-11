# Lộ trình chỉ chứa việc phát triển — kế hoạch thi công (hàng S3b)

> Thực thi tuần tự trong phiên chính (T2, mọi task chạm cùng `scripts/cat-luot.mjs` và cùng tệp ca đo —
> `independent: false` cho tất cả). TDD: ca đo viết và chạy ĐỎ trước, rồi mới sửa vật.

**Goal:** răng cắt lượt nhận mốc ngoài làm chỗ thứ ba của bảng phủ, đỏ khi hàng đứng chờ mốc vận hành hay
đo trên dữ liệu giả không có hàng sinh, nhắc tự phục vụ cho vận hành lặp lại; SKILL + khuôn mang luật.

**Architecture:** mở rộng hai hàm thuần `kiemPhu` (phủ + hình mốc) và `kiemCo` (cờ có tên) của
`scripts/cat-luot.mjs`; CLI không đổi. Luật sống ở SKILL (khối marker), khuôn mẫu ở hai tệp tham chiếu.

**Tech Stack:** Node ESM, không phụ thuộc ngoài; ca đo `tests/scripts/lo-trinh.test.mjs` (kho thử git
tạm, `khoCL` · `vietPV` · `rang` · `banSao` · `chayCa` · `chayDo` · `banGocS3`).

**Spec:** `docs/superpowers/specs/2026-10-11-lo-trinh-chi-viec-phat-trien-design.md` · hợp đồng
`_acceptance/lo-trinh-chi-viec-phat-trien/contract.md` · phép đo `evals.yaml` (E1–E10).

## Global Constraints

- Chữ ký mọi hàm xuất của `cat-luot.mjs` GIỮ NGUYÊN (phiên L3 có thể import) — chỉ THÊM (`CO_TEN` +4 tên).
- Mã thoát CLI: 0 xanh · 1 đỏ · 2 không chạy được — không đổi.
- Mọi kiểm mới chỉ ĐỎ mục của đợt đang cắt; hàng ngoài đợt gom một dòng vàng mỗi cờ; mốc ngoài đợt không xét.
- Không sửa `scripts/lo-trinh.mjs`, `dieu-phoi/`, `feature-loop/`, hợp đồng của hồ sơ đã ký.
- Câu giao trong khuôn KHÔNG bọc «» (LT-160).
- Răng gốc cho so đời trước: `git archive 9b11cc66 scripts lib skills`.

## Review Focus

1. `dung_tren` trỏ một mã vừa là mã hàng vừa là `ma`/`ten` của mốc ngoài → hàng thắng, không `cho-van-hanh` (ca im trong LT-164: dùng mã trùng ở đợt khác — chỉ kiểm hàng thắng).
2. `ten` của mốc gõ dạng tổ hợp (NFD) khác dạng dựng sẵn (NFC) trong `dung_tren` → vẫn khớp (so sau `normalize('NFC')`; ca `theo-ten` của LT-164 dùng NFD).
3. Mốc ngoài vắng cả `ma` lẫn `ten` → nhãn rơi về `ngay`, rồi `?` — không ném.
4. `du_lieu` của hàng ngoài đợt vắng → không cờ (đối chứng im LT-167, mutant LT-167-do-vang / LT-168-do-them).
5. `lap` ở mốc KHÔNG phải ngoài (vd mốc phát hành của đợt) → không cờ lặp lại (chỉ mốc ngoài).

---

### Task 1: Mốc ngoài — chỗ thứ ba của bảng phủ, hình mốc của đợt  · phục vụ E1 · independent: false

**Files:** Modify `scripts/cat-luot.mjs` (`kiemPhu`); Test `tests/scripts/lo-trinh.test.mjs` (LT-163, LT-163-do).

**Interfaces — Produces:** `nhanMoc(m)` (nội bộ) = `ma` || `ten` || `ngay` || `'?'`. Bảng phủ: phần tử
`cho` có dạng `mốc ngoài <nhãn>`. Thông điệp lỗi (ghim trong ca):
`mốc <nhãn>: mang mã của bản phạm vi mà không phải mốc ngoài (loai: ngoai) …` ·
`mốc ngoài <nhãn>: thiếu ai (người làm việc vận hành)` · `mốc <nhãn>: phu phải là một mảng` ·
`mốc ngoài <nhãn>: mã trùng mã hàng <ma>` · `mốc ngoài <nhãn> phủ mã <X> — bản phạm vi không có mã này` (đường cũ).

- [ ] Viết LT-163: kho thử `khoCL` (đợt `d1`, hàng H + chân trời + 2 mốc ngoài — một có `ma`, một chỉ `ten`) → thoát 0, bảng phủ có hai dòng `→ mốc ngoài`. Ma trận 9 ca đỏ (hai-cho · ma-la · loai-vang · loai-han · loai-phat-hanh · thieu-ai · ai-trang · phu-chuoi · ma-trung-hang), mỗi ca ghim cụm riêng; in «ma trận 9 ca»; hai đối chứng im (mốc khác đợt mang `phu` → không lỗi và mã của nó KHÔNG trong bảng phủ · đợt chỉ mốc ngoài → không «chưa cắt»). LT-163-do: tiêm bỏ kiểm `loai` → hàm đo nêu «loai-han».
- [ ] Chạy `LT_CASES=LT-163 node tests/scripts/lo-trinh.test.mjs` → FAIL (chưa có chỗ mốc).
- [ ] Sửa `kiemPhu`: `mocDot = k.moc.filter(m => chuoi(m.dot) === pv.dot)`; kiểm hình; ghi phủ cho mốc `loai === 'ngoai'`; «đợt chưa cắt» tính cả `mocDot`.
- [ ] Chạy lại LT-163 + LT-163-do → PASS; chạy LT-130…LT-150 → PASS (không vỡ ca cũ).
- [ ] Commit `feat(cat-luot): mốc ngoài là chỗ thứ ba của bảng phủ (S3b)`.

### Task 2: Cờ `cho-van-hanh`  · phục vụ E2 · independent: false

**Files:** `scripts/cat-luot.mjs` (`kiemCo`, `kiemPhu` nhường mục); test LT-164, LT-164 kho-tai-lieu, LT-164-do, LT-164-do-kep.

**Interfaces — Produces:** `CO_TEN` += `cho-van-hanh` (mức lỗi trong đợt). Dòng:
`hàng <mã> [cho-van-hanh]: đứng chờ mốc vận hành «<nhãn>» — hàng phát triển không chờ người: cần dữ liệu thì đứng trên hàng sinh dữ liệu giả (du_lieu: gia), phạm vi chỉ biết sau mốc thì đưa vào chân trời mở lại khi mốc xong`.
Khớp: mục `x` của `dung_tren` không là mã hàng nào và bằng `ma` hoặc `ten` (NFC) của một mốc `loai: ngoai` bất kỳ đợt.
`kiemPhu` bỏ dòng «đứng trên mã không có» cho đúng các mục ấy.

- [ ] Viết LT-164: 3 ca đỏ (theo-ma · theo-ten [dung_tren dạng NFD] · moc-cu-khong-dot) — mỗi ca đúng 1 dòng `[cho-van-hanh]` chứa «sinh dữ liệu giả» và «chân trời», 0 dòng «đứng trên mã không có» của hàng ấy; 3 đối chứng im (moc-khong-ngoai vẫn «mã không có» · moc-hang · chan-troi-mo-lai). LT-164 kho-tai-lieu: từ `fixtures/lo-trinh/crm-kho-tai-lieu.json` dựng đợt `ktl` bằng code (ct, cb → mốc ngoài ai «Mọi phòng ban»/«Chủ kho»; hàng còn lại gán `dot` + `phu: [<ma>]`, vai `nen`, bat_khi, tieu_chi 9) → cũ: tập hàng có cờ == {l5,d9,d6}, thoát 1; theo luật (l5 → chân trời `mo_lai_khi: "Mốc ct xong"`, d9/d6 bỏ ct) → thoát 0, bảng phủ đặt mã ct, cb ở mốc ngoài. Hai mutant: chỉ so `ma` → nêu «theo-ten»; in thêm «mã không có» → nêu «mã không có».
- [ ] Chạy đỏ → sửa → xanh; commit `feat(cat-luot): cờ cho-van-hanh (S3b)`.

### Task 3: Dữ liệu giả có nhãn — `du_lieu`  · phục vụ E3 · independent: false

**Files:** `scripts/cat-luot.mjs`; test LT-165, LT-165-do, LT-165-do-kieu.

**Interfaces — Produces:** `CO_TEN` += `du-lieu-sai-gia-tri`, `thieu-hang-sinh-gia` (lỗi trong đợt).
`du-lieu-sai-gia-tri`: `du_lieu` có mặt mà không phải đúng chuỗi `sinh-gia`/`gia` — dòng in giá trị bằng `JSON.stringify`.
`thieu-hang-sinh-gia`: `du_lieu === 'gia'` và không mục nào của `dung_tren` (trực tiếp) là hàng có `du_lieu === 'sinh-gia'`.

- [ ] Viết LT-165: ma trận 11 ca viết sẵn (gia-tren-sinh · gia-tren-sinh-khac-dot · gia-khong-tren · gia-tren-thuong · gia-bac-cau · sinh-gia · that · Gia · rong · so-1 · vang), in «ma trận 11 ca», kiểm cờ/mức/mã/giá trị/mã thoát; đối chứng: đợt chỉ ca không cờ → thoát 0. Mutant bắc cầu → nêu «gia-bac-cau»; mutant so không phân biệt hoa thường → nêu «Gia».
- [ ] Đỏ → sửa → xanh; commit `feat(cat-luot): du_lieu sinh-gia/gia (S3b)`.

### Task 4: Vận hành lặp lại — `lap` + `tu_phuc_vu`  · phục vụ E4 · independent: false

**Files:** `scripts/cat-luot.mjs`; test LT-166, LT-166-do, LT-166-do-muc.

**Interfaces — Produces:** `CO_TEN` += `van-hanh-lap-chua-tu-phuc-vu` (cảnh báo; chỉ mốc ngoài của đợt; thuộc
nhóm chỉ-trong-đợt). Dòng: `mốc <nhãn> [van-hanh-lap-chua-tu-phuc-vu]: việc vận hành lặp lại chưa trỏ hàng tự phục vụ hay chân trời (tu_phuc_vu) — xét tự phục vụ; chưa đáng thì ghi chân trời mở lại khi có tổ chức hay kho thứ hai thật`.
Lỗi thường (kiemPhu, mốc của đợt): `mốc <nhãn>: lap phải là true hoặc false` · `mốc <nhãn>: tu_phuc_vu trỏ mã không có: <X>` (X tra trong mã hàng ∪ mã chân trời mọi đợt).

- [ ] Viết LT-166: ma trận 7 ca (lap-khong-tpv · tpv-hang · tpv-chan-troi · tpv-khong-co · lap-false · lap-vang · lap-chuoi), in «ma trận 7 ca»; đối chứng: cùng mốc khác đợt → stdout không nhắc nhãn mốc. Mutant xét mọi đợt → nêu «khác đợt»; mutant mức lỗi → nêu «lap-khong-tpv».
- [ ] Đỏ → sửa → xanh; commit `feat(cat-luot): vận hành lặp lại nhắc tự phục vụ (S3b)`.

### Task 5: Ngoài đợt + đời trước  · phục vụ E5, E6 · independent: false

**Files:** `scripts/cat-luot.mjs` (gom ngoài đợt cho ba cờ hàng); test LT-167, LT-167-do, LT-167-do-vang, LT-168, LT-168-do, LT-168-do-them, LT-168-do-trang.

- [ ] LT-167: 10 hàng ngoài đợt mang ba cờ → thoát 0, một dòng gom mỗi cờ, 8 mã rồi «…»; chuyển vào đợt → thoát 1; đối chứng im 10 hàng ngoài đợt không trường mới → 0 dòng ba cờ. Mutant in theo từng hàng → «một dòng»; mutant «vắng = sai» chỉ nhánh ngoài đợt → nêu ca đối chứng im.
- [ ] LT-168: năm kho {khuôn 9b11cc66 + đợt mẫu từ `phu` · kit + đợt mới · crm-okr + đợt mới · crm-kho-tai-lieu + đợt mới · oneflow + đợt mới}; răng gốc `banGocS3('9b11cc66')` vs mới: cùng mã thoát, cùng dòng không vàng; số dòng thêm == kỳ vọng tính độc lập (hàm `kyVongThem(lt, dot)` đếm theo luật một-dòng-mỗi-cờ: hàng ngoài đợt trỏ mốc ngoài · hàng ngoài đợt mang `du_lieu` lệch luật — 0 hôm nay), in hai phía. Trang: kho có mốc mang dot/phu/ma/lap/tu_phuc_vu + hàng mang du_lieu vẽ == byte khi xoá các trường. Ba mutant: vắng = sai (mọi nhánh) → «mã thoát»; vắng = sai chỉ ngoài đợt → «kỳ vọng 0»; bộ vẽ in du_lieu → «byte».
- [ ] Đỏ → sửa → xanh; commit `test(cat-luot): ngoài đợt và lộ trình đời trước (S3b)`.

### Task 6: SKILL, khuôn, glossary + hai ca của hồ sơ đã ký  · phục vụ E7 · independent: false

**Files:** `skills/cat-luot/SKILL.md` (khối `CAT-LUOT-VAN-HANH` năm luật trước bước 3; luật 2 đổi chữ; bảng cờ +4; bảng phủ ba chỗ; đoạn khoảng cỡ — Ngoài-2), `skills/acceptance/references/lo-trinh-template.json` (mốc V1, chân trời H2, hàng 4 sinh-gia, hàng 5 gia), `skills/acceptance/references/pham-vi-template.md` (C1–C3, «tám mã»), `CONTEXT.md` (Mốc ngoài · Dữ liệu giả có nhãn · Cắt lượt ba chỗ); test LT-169, LT-169-do, LT-169-do-khuon; sửa LT-150 (`maMau` gồm mốc) và thông điệp LT-130 (số mã đếm).

- [ ] LT-169 viết trước theo E7 (khối năm dòng, đứng trước sáu luật, mười một trường; sáu luật dòng 2 có «dung_tren» và «hàng»; bảng cờ == CO_TEN; CAT-LUOT-RANG nguyên văn → 0 trên mốc ngoài sạch, 1 khi hàng đứng trên mốc; khuôn có mốc ngoài đủ trường, hàng sinh-gia, hàng gia trên nó; tập mã PHAM-VI-MA == tập mã khuôn gánh ở ba chỗ; răng trên khuôn: 0 lỗi 0 cảnh báo, ≥1 «mốc ngoài»). Mutant SKILL bỏ `tu_phuc_vu` → «tu_phuc_vu»; mutant khuôn bỏ hàng sinh-gia → «sinh-gia».
- [ ] Sửa SKILL + khuôn + CONTEXT; sửa LT-150/LT-130; chạy LT-130, LT-133, LT-150, LT-160, LT-169 → PASS.
- [ ] Commit `feat(cat-luot): SKILL tách vận hành trước sáu luật + khuôn mốc ngoài và dữ liệu giả (S3b)`.

### Task 7: Ngoài-1 — khối `CAT-LUOT-CANH-BAO`  · phục vụ E8 · independent: false

**Files:** `skills/cat-luot/SKILL.md` (khối một dòng biểu thức `^cảnh báo: (hàng|mốc) .+? \[[a-z-]+\]: ` kèm hai câu xử lý; bỏ câu cũ); test LT-170, LT-170-do, LT-170-do-cau.

- [ ] LT-170: kho thử năm loại cảnh báo của đợt + bốn loại ngoài đợt; biểu thức rút từ khối xếp từng dòng; sự thật tính từ dữ liệu kho (mã trong dòng thuộc tập mã hàng/mốc của đợt; dòng gom → ngoài đợt); in số dòng xếp / tổng; mỗi loại ≥1; câu cũ vắng ở bản mới, có ở `git show 9b11cc66:skills/cat-luot/SKILL.md`. Mutant biểu thức khớp mọi dòng → nêu dòng gom; mutant giữ câu cũ → «câu cũ».
- [ ] Đỏ → sửa → xanh; commit `feat(cat-luot): SKILL phân hai loại dòng cảnh báo (Ngoài-1, S3b)`.

### Task 8: Đáp án mẫu crm chạy qua răng  · phục vụ E10 (và nền cho E9) · independent: false

**Files:** test LT-171, LT-171-do (đọc `_acceptance/lo-trinh-chi-viec-phat-trien/mau/{pham-vi-crm.md,lo-trinh-dap-an.json}`, chép nguyên vào kho thử).

- [ ] LT-171: thoát 0, 0 lỗi, 0 cảnh báo, bảng phủ đúng K1…K11, ≥1 «→ mốc ngoài»; bản sao đáp án đổi `dung_tren` của R1 sang ["V2"] → thoát 1, đúng một `[cho-van-hanh]` + một `[thieu-hang-sinh-gia]` cho R1. Mutant răng bỏ chỗ mốc ngoài khỏi bảng phủ → nêu «K2».
- [ ] Xanh → commit `test(cat-luot): đáp án mẫu crm qua răng (S3b)`.

### Kết S3

- [ ] Cả tệp `node tests/scripts/lo-trinh.test.mjs` (bọc khoá máy) → `Results: N passed, 0 failed`.
- [ ] `node scripts/eval-coverage-lint.js .` không dòng nào của hồ sơ; contract `status: implemented`; commit; vào S4.
