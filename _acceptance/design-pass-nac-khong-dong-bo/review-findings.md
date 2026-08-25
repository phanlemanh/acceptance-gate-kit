## Trong hợp đồng

### Allowlist nấc/ngữ-cảnh bị vô hiệu bởi khoá của Object.prototype — thẻ in rác, không cờ, và khoá JSON biến mất
- file: `scripts/gate-card.js:321`
- severity: medium
- AC: AC-10
- source: conventions

REACTION_LABEL (dòng 265) và CONTEXT_LABEL (dòng 260) là object literal, nên phép kiểm allowlist `!REACTION_LABEL[dp.reaction]` (321) và `!CONTEXT_LABEL[dp.context]` (313) nhận trúng mọi khoá kế thừa từ Object.prototype. Giá trị `dp.reaction` đến thẳng từ frontmatter sổ phiên (văn bản người/LLM viết) — đây là seam writer→reader, đúng chỗ kit đòi validation.

Đã tái lập thật (workspace dựng tay, chạy scripts/gate-card.js):
- `reaction: constructor` → thẻ in `Phản ứng ở nấc: <b>function Object() { [native code] }</b>` (dòng 387) và KHÔNG có cờ vàng nào.
- `context: valueOf` → cũng không có cờ «Nấc ngữ cảnh không nhận diện được».
- `--extract`: `design_pass` trả về `{"material":…,"context":"valueOf","reaction":"constructor",…}` — hai khoá `context_label` và `reaction_label` BIẾN MẤT khỏi JSON, vì JSON.stringify bỏ property có giá trị là function. Bộ đọc thẻ mong hai khoá đó tồn tại (kiểu `string|null`).

Hai hệ quả đều đúng lớp lỗi kho đã đặt tên: allowlist không có chiều đỏ thật ngoài danh sách (ca DP10 nhánh (c) chỉ thử `nac-9`, một giá trị KHÔNG phải khoá prototype, nên lỗ nằm ngoài không gian đo), và AC-10 hứa «giá trị lạ: cờ vàng NÊU TÊN» nhưng có một lớp giá trị lạ đi lọt im lặng lên thẻ người duyệt.

Sửa theo LỚP (CLAUDE.md): dùng `Object.prototype.hasOwnProperty.call(TABLE, key)` — hoặc `Object.create(null)` / `Map` — cho CẢ hai bảng nhãn cùng lượt, và thêm mutant `reaction: constructor` / `context: valueOf` vào DP10 để chiều đỏ này có ca giữ.

### Cờ vàng nấc phản ứng nhúng giá trị thô vào HTML — trình duyệt nuốt đúng cái giá trị mà cờ sinh ra để nêu tên
- file: `scripts/gate-card.js:319`
- severity: high
- AC: AC-10
- source: bugs

Hai cờ mới nối `dp.reaction_raw` KHÔNG qua `esc()` vào chuỗi flag (dòng 319 và 322), rồi dòng 421 render flag thô: `flags.map(([c, t]) => `<div class="flag ${c}">${t}</div>`)`. Cả hai nhánh này chỉ kích hoạt KHI raw chứa `<`/`>` (`dp.reaction_placeholder`), nên giá trị nhúng vào LUÔN có ngoặc nhọn.

Đã chạy thật:
- `reaction: nac-1 (<kênh đã dùng, vd ghim, thao-luan, sua-roi-luu>)` → HTML ra: `<div class="flag fwarn">Nấc phản ứng đã khai nhưng phần kênh còn nguyên chỗ trống của khuôn: "nac-1 (<kênh đã dùng, vd ghim, thao-luan, sua-roi-luu>)" — …</div>`. Trình duyệt phân giải `<kênh …>` thành thẻ lạ rồi bỏ, người duyệt đọc được `"nac-1 ()"`.
- `reaction: <id nấc lấy từ REACTION-LADDER> (<kênh đã dùng>)` → người duyệt đọc được `còn nguyên chỗ trống của khuôn: "" — phiên này vừa ghi hỏng…`, tức chuỗi rỗng.

Đây đúng lớp lỗi đã bị bắt và đã có chú thích chống tái phạm ngay trong file (dòng ~409: «không đặt <…> thô trong cờ: HTML nuốt như tag (review S4-r1 F1)»). Nó cũng vô hiệu chính mục đích của nhánh (d)/(e) trong AC-10 — nêu ĐÚNG giá trị hỏng cho người duyệt.

Ca DP10 không bắt được vì nó so trên `stdout` thô (`d.out.includes('còn nguyên chỗ trống của khuôn')`) chứ không so trên HTML đã render — chuỗi mốc nằm TRƯỚC giá trị bị nuốt. Không có ca nào trong `tests/plugins/run-tests.sh` chặn `<` thô trong flag.

Sửa: `esc(dp.reaction_raw)` ở cả 319 và 322 (và cân nhắc quét lớp — `dp.context` dòng 313 và `he.guide` dòng 324 cùng hình dạng, sẵn có từ trước).

### `REACTION_LABEL[dp.reaction]` tra cả prototype chain — giá trị lạ như `constructor`/`__proto__`/`toString` tắt luôn cờ «không nhận diện được»
- file: `scripts/gate-card.js:321`
- severity: medium
- AC: AC-10
- source: bugs

`REACTION_LABEL` là object literal nên `REACTION_LABEL['constructor']`, `['toString']`, `['__proto__']`, `['valueOf']`, `['hasOwnProperty']` đều TRUTHY qua Object.prototype. Nhánh `else if (!REACTION_LABEL[dp.reaction])` (dòng 321) do đó im lặng, và dòng 387 in thẳng giá trị kế thừa ra thẻ.

Đã chạy thật với sổ phiên `reaction: constructor`:
- thẻ HTML in `Phản ứng ở nấc: <b>function Object() { [native code] }</b>`
- `reaction: __proto__` → `<b>[object Object]</b>`
- `reaction: toString` → `<b>function toString() { [native code] }</b>`
- KHÔNG có cờ vàng nào cho nấc phản ứng (`flags` chỉ còn dòng host_embed).

Thêm nữa, ở đường `--extract` (dòng 361) `reaction_label: REACTION_LABEL[dp.reaction] || null` trả về một FUNCTION, mà `JSON.stringify` bỏ hẳn key có giá trị function — nên `design_pass.reaction_label` BIẾN MẤT khỏi JSON thay vì là `null`. Đã kiểm: output `--extract` cho `reaction: constructor` không có key `reaction_label`, phá hợp đồng schema với bước dịch tiếng người.

Nhánh «giá trị lạ» của AC-10 (ca DP10 (c)) chỉ thử `nac-9` — đi qua nhánh regex `^nac-…` nên không chạm lớp này.

Sửa: dùng `Object.prototype.hasOwnProperty.call(REACTION_LABEL, dp.reaction)` (hoặc `Object.create(null)` / `Map`) ở cả 321, 361, 387. `CONTEXT_LABEL` cùng hình dạng — nên quét theo LỚP.

### `reaction:` có khoá nhưng giá trị RỖNG bị báo là «hồ sơ đời trước» — đúng thứ đoạn code này tuyên bố phân biệt
- file: `scripts/gate-card.js:287`
- severity: low
- AC: AC-10
- source: bugs

Chú thích ngay trên chỗ này nói: «Khoá VẮNG HẲN và khoá ĐIỀN NỬA VỜI là hai chuyện khác nhau… Gộp cả hai vào một câu ‹hồ sơ đời trước› là nói sai chuyện đang xảy ra cho người duyệt.» Nhưng `dp.reaction_declared = !!rawReaction` (dòng 287) đo GIÁ TRỊ không rỗng, không đo sự CÓ MẶT của dòng khoá.

Hệ quả: sổ phiên có dòng `reaction:` bỏ trống (phiên mới ghi hỏng) cho `rawReaction === ''` → `reaction_declared === false` → rơi vào nhánh dòng 320 và thẻ in «Sổ phiên chưa khai nấc phản ứng (hồ sơ đời trước thang phản ứng) — … khuyên bổ sung ở phiên thiết kế sau», tức khuyên để lần sau, trong khi thực tế phiên ĐANG chạy vừa ghi hỏng. Đã chạy thật với `reaction:` rỗng và thấy đúng câu «hồ sơ đời trước».

Sửa: lấy `reaction_declared` từ việc dòng khoá có mặt trong frontmatter (`'reaction' in dpFm`) thay vì từ độ dài giá trị.

### `dem()` dùng `|| true` nên nuốt cả lỗi hạ tầng của grep (exit khác 0) thành «đếm 0» — chân 2 của răng câu-chết xanh im lặng
- file: `_acceptance/design-pass-nac-khong-dong-bo/rang-cau-chet.sh:31`
- severity: low
- AC: AC-12
- source: bugs

`{ grep -rF -- "$2" "$1/skills" "$1/feature-loop" 2>/dev/null || true; } | wc -l` — chú thích chỉ biện minh cho trường hợp không khớp (kết quả ĐÚNG ở chân 2), nhưng `|| true` cũng nuốt lỗi hạ tầng (thư mục không tồn tại / không đọc được / grep hỏng), và `2>/dev/null` xoá luôn thông điệp lỗi.

Chân 2 là chân duy nhất mà «đếm 0» nghĩa là XANH. Nên nếu `$ROOT/skills` hoặc `$ROOT/feature-loop` biến mất hay không đọc được (đổi layout, chạy từ worktree thiếu thư mục, quyền), mọi kim đều ra 0 và script in `cau-chet OK` rồi thoát bình thường — đúng hình dạng «đỏ hạ tầng đọc nhầm thành xanh vật» mà chính chú thích trong file cảnh báo ở chỗ khác. Chân 1 và chân 3 không che được vì chúng đo trên `$BASE`/`$INJ`.

Sửa: chỉ tha mã lỗi "không khớp" của grep, không tha mọi mã lỗi khác, và/hoặc kiểm `[ -d "$1/skills" ] && [ -d "$1/feature-loop" ]` trước khi đếm.

### Ma trận thiếu vế: AC-15 «KHÔNG cờ nấc» không có assert nào (DP13)
- file: `tests/plugins/design-pass-nac.test.mjs:302`
- severity: high
- AC: AC-14
- source: measurement

AC-15 và expected của E15 đều khẳng định BỐN vế cho hồ sơ không có sổ phiên: thẻ dựng được · khối «Bản mẫu & ngữ cảnh» vắng hẳn · KHÔNG cờ nấc · không nhãn rỗng/chuỗi lạ. DP13 chỉ assert ba vế: `none.status !== 0` (dòng 303), `none.out.includes('Bản mẫu')` (dòng 304) và ba chuỗi lạ `['undefined','null','(chưa khai)']` (dòng 305-307). Không có assert nào cho cờ nấc, và ma trận E15=2 mutant cũng chỉ bẻ hai vế đầu (`if (dp.present) P.push(` → `if (true)`, và làm thẻ ném lỗi). ĐÃ CHỨNG: chép trọn tests/scripts/lib/skills sang cây tạm, đẩy dòng `if (!dp.reaction) dpFlags.push('So phien chua khai nac phan ung …')` RA NGOÀI khối `if (dp.present)` của scripts/gate-card.js (dòng 310-311) — thẻ nay in cờ nấc trên đúng hồ sơ không có sổ phiên, mà `DP_CASES=DP13` vẫn báo đạt. Chuỗi cờ không chứa 'Bản mẫu' cũng không chứa '(chưa khai)' (có ngoặc) nên lọt cả ba assert hiện có. Đây là hình dạng: ca tuyên N vế mà chỉ có điểm-case cho N−1, vế còn lại có thể biến mất mà ca vẫn báo đạt.

### Đối chứng dương không phân biệt được: DP10 nhánh (a) «đủ khoá → SẠCH cờ nấc» chỉ soi 1 trong 4 câu cờ
- file: `tests/plugins/design-pass-nac.test.mjs:249`
- severity: high
- AC: AC-14
- source: measurement

AC-10 và expected E10 khai nhánh (a) là ĐỐI CHỨNG DƯƠNG: «sổ phiên đủ khoá thì SẠCH cờ nấc». Nhưng dòng 249-250 chỉ kiểm đúng MỘT chuỗi: `if (a.out.includes(CO_VANG_THIEU))` với `CO_VANG_THIEU = 'chưa khai nấc phản ứng'`. gate-card.js phát bốn câu cờ nấc khác nhau (dòng 318-321: nửa-vời-chân, đời-trước, không-nhận-diện, nửa-vời-kênh); ba câu còn lại không bị đòi vắng ở nhánh (a). Vì chuỗi if/else-if là loại trừ nhau nên các nhánh (b)-(e) cũng không bù được: chúng chỉ đòi câu cờ CÓ MẶT ở fixture của mình. ĐÃ CHỨNG: trên cây tạm, sửa `dp.reaction_placeholder = /[<>]/.test(rawReaction);` (gate-card.js dòng ~289) thành `… || true` — thẻ nay dán cờ «phần kênh còn nguyên chỗ trống của khuôn» lên MỌI hồ sơ kể cả hồ sơ điền đủ, mà `DP_CASES=DP10` vẫn báo đạt (cả 5 nhánh + 2 mutant). Đối chứng dương không phân biệt được «sạch cờ» với «cờ nào cũng bắn», tức vế «SẠCH cờ nấc» là vế chết.

### Blacklist trên không gian mở: DP1 «chỗ DUY NHẤT khai danh sách nấc» chỉ nhận hai hình dạng cú pháp
- file: `tests/plugins/design-pass-nac.test.mjs:67`
- severity: medium
- AC: AC-14
- source: measurement

AC-1 hứa marker REACTION-LADDER là chỗ DUY NHẤT khai danh sách nấc trong skills/design-pass/SKILL.md. Bộ kiểm ở dòng 67-69 dò bản chép thứ hai bằng đúng hai mẫu: một HÀNG BẢNG `/\|\s*nac-[0-9a-z]+\s*\|/`, hoặc một DÒNG chứa ≥3 id khác nhau. Comment dòng 64-66 tuyên «Danh sách thứ hai có đúng hai hình dạng» — đó là một danh sách cấm đóng trên không gian văn bản mở, và mệnh đề đó sai. ĐÃ CHỨNG: nối vào cuối bản sao SKILL.md một bản khai lại trọn bốn nấc dạng gạch đầu dòng, mỗi id một dòng ('- nac-0 — đi thẳng' … '- nac-3 — ngồi cùng ngắn') — không dòng nào là hàng bảng và không dòng nào chứa ≥3 id — `DP_CASES=DP1` vẫn báo đạt. Mutant m-dup (dòng 195-196) chỉ tiêm đúng hình dạng «một dòng bốn id» mà bộ kiểm đã biết, nên chiều đỏ không chạm được lớp thật. Cùng lớp lỗi mà chính DP11 đã phải sửa cho AC-11 (allowlist phải có chiều đỏ NGOÀI danh sách), nhưng DP1 chưa được sửa theo lớp.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **evidence-report.md không được cập nhật sau lượt THU PHẠM VI — vẫn liệt E2–E7 đã bị cắt**
  Người dùng thấy gì: Báo cáo tổng hợp bằng chứng đưa cho người duyệt vẫn liệt kê một số mục kiểm tra đã bị bỏ khỏi phạm vi, khiến người đọc tưởng nhầm phạm vi kiểm tra rộng hơn thực tế đang có.
  file: `_acceptance/design-pass-nac-khong-dong-bo/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **gap-probe.md giữ bản chép thứ ba (đã lỗi thời) của ma trận mutant mà evals.yaml tuyên là «chỗ DUY NHẤT»**
  Người dùng thấy gì: Ghi chú xử lý trong hồ sơ rà soát chép lại một bảng số liệu cũ không khớp với số liệu hiện hành, có thể khiến người đọc hồ sơ hiểu sai mức độ đã kiểm tra.
  file: `_acceptance/design-pass-nac-khong-dong-bo/gap-probe.md`
  severity: low
  Đề xuất: known-limits

- **CONTEXT.md không được cập nhật cho trục `reaction:` và cho ổ cắm `design_pass.ds_skill`**
  Người dùng thấy gì: Tài liệu thuật ngữ chung chưa được bổ sung mục cho khái niệm mới của tính năng này, khiến người viết tài liệu hoặc tính năng kế tiếp thiếu từ chuẩn để dùng thống nhất.
  file: `CONTEXT.md`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/11 lỗi rơi vào file không bộ đo nào phủ (_acceptance/design-pass-nac-khong-dong-bo/evidence-report.md, _acceptance/design-pass-nac-khong-dong-bo/gap-probe.md, CONTEXT.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
