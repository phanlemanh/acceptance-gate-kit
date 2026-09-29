---
schema_version: 1
feature: Một sổ quyết định, ba vế một câu — dòng sổ decision · why · cost_if_wrong viết cho người ký; thẻ Cổng 1/2 in một dòng ba vế ở cả ba khối; cầu nối máy gặt ruling superpowers vào sổ, hook chặn lệnh xoá workspace cho tới khi đã gặt; đường đọc-cũ cho dòng chỉ có impact
slug: mot-so-ba-ve
owner: phanlemanh@gmail.com
risk_tier: T3      # thêm hooks/ruling-truoc-khi-xoa.js + sửa hooks/hooks.json (khớp t3_paths hooks/**)
surfaces: [cli, docs]
status: implemented    # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by: "Phan Le Manh"
approved_at: 2026-09-29T01:35:14Z
design_doc: docs/superpowers/specs/2026-09-29-mot-so-ba-ve-design.md
---

## Context

Owner phê CỘNG bằng ADR 0021 (29/09). Số đo: vòng crm `tro-ly-okr-de-xuat` 28/09 in 11 ruling,
4 có mã sổ, 7 chỉ sống trong chat; ledger superpowers bị gitignore và tự xoá ở Finish của skill —
trước khi feature-loop tới cuối S3. Kit đang viết một quyết định hai lần (dòng máy + câu dịch
`decisions_plain`). Bản neo: `_acceptance/mot-so-ba-ve/opportunity.md`, design doc ở frontmatter.

## Criteria

- AC-1: Given khối `DEC-ID-RECIPE` trong `feature-loop/skills/feature-loop/SKILL.md` là nguồn duy nhất của lệnh append, When lệnh rút NGUYÊN VĂN từ khối ấy chạy với ba ô `decision · why · cost_if_wrong` điền, Then dòng mới trong `decisions.jsonl` là JSON một dòng có đủ ba khoá, `id` theo khuôn `d-<UTC>-<n>` với `n` = số dòng, KHÔNG có khoá `impact`; và When bộ đọc dùng chung `lib/workspace-record.cjs` đọc sổ có dòng ba vế xen dòng cũ, Then kết quả (seal · veto · observed · đóng-sổ) BẰNG kết quả trên sổ chỉ có dòng cũ (khoá mới là bổ sung, chiều im).
- AC-2: Given sổ có dòng ba vế ở cả ba vị trí (trước seal · sau seal · hồ sơ chưa seal), When `gate-card.js` dựng thẻ Cổng 1 và thẻ Cổng 2, Then khối «sẽ làm/không làm» của Cổng 1, khối «CHƯA duyệt» (Treo) và khối «Đã duyệt từ Gate 1» của Cổng 2 đều in dòng ấy dạng `decision — why — sai thì tốn: cost_if_wrong`, KHÔNG tra `decisions_plain` cho dòng đó (overlay có câu khác vẫn không hiện); CHIỀU ĐỎ: bản sao `gate-card.js` gỡ nhánh ba vế → thẻ in `decision — impact`/chữ overlay, ca đỏ ghim tên khối.
- AC-3: Given sổ có dòng cũ chỉ `decision + impact`, có hoặc không có câu dịch trong `card-plain.json`, When thẻ dựng, Then CẢ BA khối (kể cả «Đã duyệt từ Gate 1» — lỗ chip task_f63c6488) in câu dịch khi có, chữ gốc `decision — impact` khi không; đoạn HTML khối Treo cho dòng ấy BẰNG bản dựng bởi `gate-card.js` của bản nền `git archive <sha-nền> scripts lib` với sha-nền là hằng ghi kèm nguồn trong tệp ca (không phải merge-base); ca đỏ có tên khi sha-nền == HEAD hoặc bản nền dựng lỗi; CHIỀU ĐỎ: bản sao gỡ tra overlay ở khối đã duyệt → câu dịch mất, ca đỏ ghim «khối đã duyệt không tra decisions_plain».
- AC-4: Given dòng có `why` nhưng không có `cost_if_wrong` (ruling hai vế), When thẻ dựng, Then dòng in `decision — why` kèm nhãn «chưa khai giá nếu sai» ở đúng dòng đó, thẻ KHÔNG chặn, không cờ toàn thẻ; dòng đủ ba vế cạnh nó không mang nhãn; và When ca thẻ chạy, Then nó ghi `_acceptance/mot-so-ba-ve/evidence/the-cong-2-ba-ve.txt` (đường suy từ vị trí tệp ca) với dòng đầu «# fixture sha256 <băm> · at <ISO>» và thân là phần văn bản của thẻ Cổng 2 vừa dựng — đầu vào của AC-8 là vật của lượt chạy.
- AC-5: Given `progress.md` là bản chép NGUYÊN VĂN mọi dòng Ruling của ledger superpowers thật (`crm/.superpowers/sdd/2026-09-19-vao-bang-email-va-mat-khau/progress.md`, ghi nguồn trong fixture; gồm hình dạng `Ruling N: … — Vì sao: … Sai thì tốn: …` và `Task N: Ruling: … — …`) cộng ba dòng theo khuôn của skill (`Ruling: a — b — c` · `Final: Ruling: … — … — …` · `Task N: parked — … — Ruling: …`) và một dòng `minor (deferred)` không phải quyết định, When `cau-noi-ruling.mjs --write` chạy, Then mỗi dòng Ruling thành ĐÚNG MỘT dòng sổ `stage: S3` với `decision`/`why`/`cost_if_wrong` BẰNG text kỳ vọng viết trước cho từng hàng (nhãn `Vì sao:`/`Sai thì tốn:`/`cost if wrong:` là dấu cắt, thắng dấu ` — `; dòng `parked` → `decision` «KHÔNG sửa: <finding>», `type: revisit`), số hàng `cost_if_wrong` vắng đúng bằng số đếm từ fixture, dòng `minor (deferred)` không vào sổ, `source: superpowers`, `source_ref` duy nhất; chạy lần hai → 0 dòng thêm; `--slug` vắng → slug suy từ tên workspace bỏ tiền tố ngày rồi từ dòng `_acceptance/<slug>/contract.md` trong ledger; không suy được → exit 2 ghim «không suy được hồ sơ»; `progress.md` vắng hoặc 0 dòng Ruling → exit 0 + một dòng stderr «không có ruling để gặt»; CHIỀU ĐỎ: bản sao bỏ so `source_ref` → chạy hai lần nhân đôi; bản sao bỏ nhãn làm dấu cắt → hàng hình dạng 1 mất `cost_if_wrong`, ca đỏ ghim tên hàng.
- AC-6: Given `hooks/hooks.json` đăng ký PreToolUse matcher `Bash` trỏ `hooks/ruling-truoc-khi-xoa.js` và hook suy `root` từ `cwd` của payload, When payload `tool_input.command` là lệnh xoá workspace theo ma trận có tên viết trước — hàng 1 là lệnh Finish NGUYÊN VĂN của skill superpowers (`rm -rf <workspace>` với đường tuyệt đối mà `sdd-workspace` in) · đường tương đối · `/` cuối · `cd .superpowers/sdd && rm -rf <tên>` · thư mục cha `.superpowers/sdd` · `rm -r`/`rm -fr`/`-R` · đường trong nháy — với workspace có `progress.md` mang ruling, Then hook gọi cầu nối, sổ của hồ sơ suy ra thêm đúng N dòng, hook exit 0; When lệnh CHỨA `.superpowers/sdd/<ws>` nhưng không phải `rm` đệ quy (`cat`, `grep -r`, `ls -R`, `node … --workspace …`), Then exit 0 VÀ băm sổ không đổi; When đối số đường mang thay thế shell (`rm -rf "$WS"`), Then exit 0 và stderr một dòng «không giải được đường» (giới hạn khai); When cầu nối exit ≠ 0 (slug không suy được), Then hook exit 2 và stderr ghim «ruling chưa vào sổ» kèm lệnh chạy tay; When workspace không tồn tại, Then exit 0; CHIỀU ĐỎ: bản sao hook bỏ neo `rm` → lệnh đọc kích gặt, ca đỏ ghim; bản sao bỏ nhánh exit 2 → ca cầu-nối-lỗi cho qua, ca đỏ ghim.
- AC-7: Given `feature-loop/skills/feature-loop/SKILL.md`, When đọc mục «Sổ quyết định» và S3, Then schema khai ba trường `decision · why · cost_if_wrong` với `impact` là đường đọc-cũ, khối `DEC-ID-RECIPE` mang ba ô ấy, và S3 nêu tên `cau-noi-ruling.mjs` là đường tay khi harness không có hook (một câu, không lặp luật); `commands/acceptance-card.md` mục DEC-PLAIN nói `--extract` chỉ phát khoá cho dòng thiếu `why`.
- AC-8 (judgment): Given thẻ Cổng 2 dựng từ fixture có ba dòng ba vế (một thiếu giá) và một dòng cũ có câu dịch, When một người đọc lạ đọc phần văn bản của thẻ, Then với mỗi dòng họ trả lời được «quyết gì · vì sao · sai thì tốn gì» mà không mở sổ, chỉ ra đúng dòng nào thiếu giá, và không thấy tên biến/mã eval trần ở vế quyết và vế giá của ba dòng mới.
- AC-9: Given sổ trộn dòng ba vế và dòng cũ, When `gate-card.js --extract` chạy, Then danh sách khoá `decisions` chỉ chứa id của dòng KHÔNG có `why`, và When `card-plain.json` chứa câu dịch cho một id ba vế, Then thẻ bỏ qua câu ấy (AC-2) — writer `--extract` và reader render rút khoá từ MỘT hàm (`DEC-PLAIN-KEY`).

## Coverage

Quét Zwicky rút gọn (preset test-matrix; chân ngành ADR Nygard — Context · Decision · Consequences), đầy đủ ở design doc §3.

- **Trục A — bên viết** [thước CE: SUY-TỪ-REPO — DEC-ID-RECIPE, `commands/*`]: phiên gõ recipe → AC-1; cầu nối → AC-5, AC-6; lệnh cổng người (seal · veto · observed) → chiều im AC-1, Out of scope (không đổi khuôn của chúng ở vòng này).
- **Trục B — hình dạng dòng** [thước CE: SUY-TỪ-REPO — dòng thật `_acceptance/*/decisions.jsonl` + ledger superpowers thật]: đủ ba vế → AC-2, AC-9; có why thiếu cost → AC-4; cũ → AC-3; cũ + overlay → AC-3, AC-9; seal → AC-1 chiều im.
- **Trục C — bên đọc** [thước CE: SUY-TỪ-REPO — grep design doc §2]: ba khối thẻ → AC-2/3/4; `--extract` → AC-9; lib dùng chung → AC-1; người lạ → AC-8; làn V/product-map/resume → Out of scope (không đọc khoá mới; chiều im nằm trong suite thường trực).
- **Trục D — kích cầu nối** [thước CE: SUY-TỪ-REPO — SKILL superpowers §Finish, `sdd-workspace`]: lệnh xoá → AC-6; gặt lặp · slug · tệp vắng · 0 ruling → AC-5; đường tay → AC-7; harness không hook → giới hạn khai (Out of scope).
- `[NGÀNH: ADR Nygard]` Consequences bắt buộc → AC-4 chọn «nhãn, không bác».
- `[GIẢ ĐỊNH]` `executing-plans` (Native) dùng cùng thư mục `.superpowers/sdd/` với SDD — kiểm ở S3; khác thì thêm mẫu đường vào cùng regex của hook (AC-6 mở rộng, không AC mới).

## Đường đo

- ruling có mã sổ / ruling in ra ở khối «Rulings I made» của vòng crm kế = 100 %: đếm tay khối chat so `decisions.jsonl` (như đo 28/09) · AC bảo đảm: AC-5, AC-6
- dòng ba vế in trên thẻ Cổng 2 / dòng ba vế trong sổ = 100 %, `decisions_plain` của hồ sơ ấy rỗng: đọc `card.html` · AC bảo đảm: AC-2, AC-4, AC-9
- cầu nối im không cờ vàng khi ledger vắng = 0 ca: ca AC-5 tệp vắng · AC bảo đảm: AC-5
- dòng cũ chỉ có `impact` in hỏng trên thẻ = 0 ca: so với bản nền `git archive <sha-nền>` trong ca AC-3 · AC bảo đảm: AC-3

## Out of scope

- «Trả lại: lý do» ở Cổng 2 không ghi trường, `veto` thiếu giá, gap-probe cột Xử lý thiếu giá — ba hạt giống trong ô, chỉ mở khi vòng này ship và owner gọi tên.
- Hook cho harness Codex; PostToolUse gương ruling theo thời gian thật; xoá bằng đường khác `rm` — giới hạn khai, đếm bằng đường đo 1.
- Di trú dòng cũ sang ba vế; sửa/xoá dòng đã có; đổi khuôn dòng của seal/veto/observed.
- Xếp khối Treo theo giá nếu sai; bỏ hẳn `decisions_plain` khỏi khuôn card-plain.
- Rollout ra kho tiêu thụ và chiến dịch ghim lại — việc của mốc 2.19.

## Notes

- Lỗ khối «Đã duyệt từ Gate 1» chỉ gọi `decLine` (chip task_f63c6488, phiên crm 28/09) đóng trong AC-3, không mở vòng riêng.
