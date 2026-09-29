# Một sổ quyết định, ba vế một câu — thiết kế

Ngày 2026-09-29 · hồ sơ `_acceptance/mot-so-ba-ve/` · ADR 0021 · hạng T3 (chạm `hooks/**`).

## 1. Bản hiểu (owner có thể sửa ở Cổng 1)

**Owner nói (ADR 0021, ô, phiên 29/09):** một sổ duy nhất là `decisions.jsonl`; mỗi dòng ba
trường một câu `decision · why · cost_if_wrong`, hai trường ngoài viết cho người ký; thẻ Cổng
1/2 in một dòng ba vế cùng hình với khối «Rulings I made»; ruling của superpowers phải vào sổ
trước khi workspace bị xoá; `impact` là đường đọc-cũ; không bỏ JSON, không thêm trường thứ tư.

**Máy suy thêm, không có trong lời owner:** (a) superpowers xoá workspace ở bước Finish của
chính skill nó, tức TRƯỚC khi feature-loop tới bước cuối S3 — crm 28/09 cho thấy xoá thật
(chỉ còn workspace 19/09); một cầu nối «cuối S3» bằng lời sẽ thường gặt thư mục rỗng. Vật
máy giữ đúng tầng là **hook PreToolUse trên Bash** chặn lệnh xoá cho tới khi đã gặt; hook
sống ở `hooks/**` → T3. (b) Dòng đủ ba vế thì lớp dịch `decisions_plain` không còn việc cho
dòng đó; `--extract` chỉ xin dịch dòng cũ. (c) Ruling hai vế (thiếu giá) không bị bác, nó
lên thẻ kèm nhãn «chưa khai giá nếu sai» — giới hạn là nhãn, không phải việc.

**Thành công =** ngưỡng SỐNG của ô: ở vòng crm kế chạy S3 dưới superpowers, 100 % ruling
trong khối chat có mã sổ, thẻ Cổng 2 in một dòng ba vế cho mỗi mã, `decisions_plain` của
hồ sơ ấy rỗng mà thẻ vẫn đọc bằng tiếng người.

## 2. Ngữ cảnh đo được

- crm `tro-ly-okr-de-xuat` 28/09: 11 ruling in ra, 4 có mã sổ, 7 chỉ trong chat (36 %).
- Ledger superpowers thật (`crm/.superpowers/sdd/2026-09-19-vao-bang-email-va-mat-khau/progress.md`,
  140 dòng, 7 dòng Ruling) viết ba hình dạng: `Ruling N: … — Vì sao: … Sai thì tốn: …`,
  `Task N: Ruling: … — …`, `Task N: minor (deferred): …`; khuôn chuẩn của skill:
  `Ruling: <what> — <why> — <what it costs if wrong>`.
- Bộ đọc sổ trong engine (grep 29/09): `scripts/{gate-card.js, khong-can-nguoi.mjs,
  product-map.mjs, start-scan.mjs, hieu-chuan-moc.mjs, loop-health.mjs, eval-coverage-lint.js,
  recheck-evidence.cjs, pre-merge-check.sh}` và `lib/{workspace-record, nhan-canh-gay,
  lop-nhin-thay, gap-probe}.cjs`. Không bộ đọc nào đọc `impact` để quyết; các bộ đọc lib
  khớp `type`/`decision` (tiền tố) — ba khoá mới là bổ sung, không đổi hành vi của chúng.
- Hook hiện có: `hooks/hooks.json` đăng ký PreToolUse `Write|Edit` →
  `hooks/acceptance-evidence-gate.js` (stdin JSON, exit 2 = chặn kèm thông điệp).

## 3. Quét không gian AC (Zwicky, preset test-matrix; chân ngành: ADR Nygard 2011 —
Context · Decision · Consequences, cùng ba vế)

- **Trục A — bên viết dòng sổ** [thước CE: SUY-TỪ-REPO — DEC-ID-RECIPE của SKILL, các lệnh
  cổng người trong `commands/`]: phiên ghi bằng khối lệnh · cầu nối gặt ruling superpowers ·
  lệnh cổng người (seal · veto · observed · revisit gate2).
- **Trục B — hình dạng dòng** [thước CE: SUY-TỪ-REPO — dòng thật trong `_acceptance/*/decisions.jsonl`
  + ledger superpowers thật]: đủ ba vế · có why thiếu cost (ruling hai vế) · cũ decision+impact ·
  cũ + có overlay `decisions_plain` · seal (không nội dung).
- **Trục C — bên đọc** [thước CE: SUY-TỪ-REPO — grep §2]: thẻ Cổng 1 · Cổng 2 khối Treo ·
  Cổng 2 khối đã duyệt · `--extract` · bộ đọc lib · làn V `khong-can-nguoi` · product-map/start-scan ·
  resume feature-loop («đã chốt: id — decision»).
- **Trục D — kích cầu nối** [thước CE: SUU-TỪ-REPO — SKILL superpowers §Finish, `sdd-workspace`]:
  lệnh xoá workspace (hook) · gọi tay cuối S3 · workspace không tồn tại · gặt lặp · slug không
  suy được · harness không có hook (Codex) · tệp có nhưng không dòng Ruling.
- `[NGÀNH: ADR Nygard]` Consequences là vế bắt buộc của một quyết định — ứng viên cho luật
  «ruling thiếu giá lên thẻ có nhãn» (giữ, không bác).

**Core (12 ô có nghĩa trên ~60 → AC-1…AC-9):** A×B đủ ba vế ← recipe (AC-1) · B đủ ba vế ×
C ba khối thẻ (AC-2) · B cũ(+overlay) × C ba khối thẻ (AC-3, gộp lỗ khối đã duyệt) · B thiếu
cost × C thẻ (AC-4) · A cầu nối × B ba hình dạng ledger thật + D gặt lặp/slug/rỗng (AC-5) ·
D lệnh xoá × hook chặn/cho qua (AC-6) · A/D đường tay trong SKILL + recipe (AC-7) · C `--extract`
× B (AC-9) · C người đọc lạ (AC-8) · C bộ đọc lib × B mới (AC-1 chiều im).

**Later:** «Trả lại: lý do» Cổng 2 không ghi trường · `veto` thiếu giá · gap-probe cột Xử lý
thiếu giá (ba hạt giống trong ô) · PostToolUse gương ruling theo thời gian thật · xếp khối Treo
theo giá · hook cho harness Codex · di trú dòng cũ.
**Never:** bỏ JSON sang văn xuôi (mất `id`/`supersedes`) · trường thứ tư · sửa/xoá dòng cũ ·
đọc transcript làm nguồn ruling (khuôn chat không có hợp đồng).

## 4. Thiết kế

### 4.1 Khuôn dòng sổ
Ba khoá mới, mỗi khoá một câu: `decision` (quyết gì, cho người ký) · `why` (vì sao — được trỏ
tệp, mã eval) · `cost_if_wrong` (sai thì tốn gì, cho người ký). `impact` giữ nguyên nghĩa cho
dòng cũ; dòng mới không ghi `impact`. Dòng gặt từ superpowers mang thêm `source: "superpowers"`
và `source_ref: "<tên workspace>#<khoá dòng>"` (khoá = `Task N`/`Final`/`Ruling N` + băm ngắn
nội dung) để gặt lặp không nhân đôi. Khối `DEC-ID-RECIPE` của SKILL đổi dòng giữa sang ba
trường; các khoá `id · type · stage · at · serves · revisit · supersedes` không đổi.

### 4.2 Thẻ (`scripts/gate-card.js`)
Một hàm `decBaVe(e)` dùng cho CẢ BA khối (Cổng 1 `grp gnot`, Cổng 2 Treo, Cổng 2 «Đã duyệt từ
Gate 1»): dòng có `why` → `decision — why — sai thì tốn: cost_if_wrong`; thiếu `cost_if_wrong`
→ đuôi «⚠ chưa khai giá nếu sai»; dòng không có `why` → `plDec(e) ?? decLine(e)` như hôm nay
(khối đã duyệt nay cũng tra overlay — đóng lỗ chip task_f63c6488). `--extract` chỉ phát khoá
overlay cho dòng KHÔNG có `why`; `commands/acceptance-card.md` (DEC-PLAIN) nói rõ điều đó.

### 4.3 Cầu nối `scripts/cau-noi-ruling.mjs` (gói acceptance-gate, cạnh hook)
`--root <repo> --workspace <.superpowers/sdd/<tên>> [--slug <slug>] [--write]`. Đọc
`progress.md`; lấy mọi dòng chứa từ `Ruling` (dòng `minor (deferred)` không phải quyết định,
bỏ). **Quy tắc cắt — NHÃN thắng dấu gạch:** thân dòng = phần sau `Ruling[ N]:`; dòng
`parked — <finding> — Ruling: <vì sao code đứng>` → `decision` = «KHÔNG sửa: <finding>», thân =
phần sau `Ruling:`. Trong thân, tìm nhãn không phân biệt hoa thường: `Vì sao:` mở `why`;
`Sai thì tốn:` / `Giá nếu sai:` / `cost if wrong:` mở `cost_if_wrong`; phần trước nhãn đầu là
`decision`. Không có nhãn nào → cắt theo ` — ` thành tối đa ba phần theo thứ tự
decision · why · cost (khuôn chuẩn của skill). Có nhãn thì dấu ` — ` ngay trước nhãn bị nuốt,
dấu ` — ` bên trong một vế giữ nguyên. Vế nào rỗng thì khoá vắng (không ghi chuỗi rỗng).
Slug: `--slug` → tên workspace bỏ tiền tố `YYYY-MM-DD-` mà `_acceptance/<slug>/` tồn tại →
dòng `_acceptance/<slug>/contract.md` trong đầu ledger; không suy được → exit 2 có tên. Append
bằng ĐÚNG công thức id của recipe (`d-<UTC>-<n>`), `stage: S3`, `type: approach` (dòng `parked`
→ `revisit`), `source: superpowers`, `source_ref: <tên workspace>#<khoá dòng>` (khoá = tiền tố
dòng + băm sha256 8 hex của thân) — bỏ dòng đã có `source_ref`. Không có `progress.md` hoặc 0
dòng Ruling → exit 0 + một dòng stderr cờ vàng. Không `--write` → in dòng sẽ append, không ghi.
Ma trận kiểm viết trước công bố TEXT ba vế kỳ vọng cho TỪNG dòng fixture; số hàng cost-vắng
đếm từ fixture chứ không từ ma trận.

### 4.4 Hook `hooks/ruling-truoc-khi-xoa.js` + `hooks/hooks.json`
Đăng ký PreToolUse matcher `Bash`. Lệnh trong `hooks.json` lọc rẻ bằng shell trước (payload
không chứa chuỗi `.superpowers` → exit 0, không mở node). Hook đọc payload JSON; `root` =
`cwd` của payload (Claude Code phát), thiếu → `process.cwd()`. **Neo là lệnh `rm`, không phải
chuỗi:** tách lệnh theo `;`, `&&`, `||`, `|`; nhớ `cd <dir>` đứng trước để giải đường tương
đối; chỉ xét lệnh đơn có từ đầu `rm` và một cờ chứa `r` (`-r`, `-rf`, `-fr`, `-R`,
`--recursive`); mọi đối số đường (bỏ nháy) giải tuyệt đối theo cwd hiện hành; đối số nằm
dưới `<root>/.superpowers/sdd/<tên>` (kể cả `/` cuối) → gặt workspace ấy; đối số LÀ
`<root>/.superpowers/sdd` hoặc `<root>/.superpowers` → gặt MỌI workspace con. Đối số mang
thay thế shell (`$…`, dấu huyền) → không giải được: cho qua và in một dòng stderr «không giải
được đường: <đối số>» — GIỚI HẠN KHAI, đếm bằng đường đo 1. Lệnh đọc (`cat`, `grep`, `ls`,
`node … --workspace …`) chứa chuỗi ấy → im, sổ không đổi. Hàng 1 của ma trận kiểm là lệnh
Finish nguyên văn của skill superpowers (`rm -rf <workspace>` với `<workspace>` là đường TUYỆT
ĐỐI mà `sdd-workspace` in ra — trích kèm nguồn + phiên bản trong fixture). Workspace không
tồn tại → exit 0. Gặt xong (exit 0) → cho qua, một dòng stdout «đã gặt N ruling vào sổ <slug>».
Cầu nối exit ≠ 0 → exit 2 chặn, thông điệp ghim: «ruling chưa vào sổ — <lý do của cầu nối>;
chạy tay: node <cầu nối> --root . --workspace <tên> --slug <slug> --write rồi xoá lại».

### 4.5 Văn bản
`feature-loop/skills/feature-loop/SKILL.md`: «Sổ quyết định» khai ba trường + recipe mới; S3
bước 3 thêm một câu: vật giữ là hook; đường tay khi harness không có hook (Codex) là gọi cầu
nối trước khi xoá. `GUIDE.md`/`CONTEXT.md`: một dòng term «ba vế» nếu glossary cần.

### 4.6 Luồng dữ liệu
superpowers ghi `Ruling` vào `progress.md` → (Finish) `rm -rf` → hook → cầu nối append
provisional S3 vào `decisions.jsonl` → S4 xong → thẻ Cổng 2 khối Treo in ba vế → người phê/veto
như hôm nay → seal. Không lượt gọi người mới.

### 4.7 Lỗi & giới hạn khai
- Harness không chạy hook (Codex, hook tắt): chỉ còn đường tay trong SKILL — GIỚI HẠN, đếm bằng
  ngưỡng của ô (ruling có mã sổ / ruling in ra).
- Xoá bằng đường khác `rm` (Finder, `trash`): không bắt — giới hạn khai.
- Superpowers đổi tên thư mục/khuôn dòng: cầu nối im + cờ vàng; hook không chặn khi tệp vắng.
- `executing-plans` (Native) dùng cùng workspace `.superpowers/sdd/` — kiểm ở S3, nếu khác thì
  thêm mẫu đường vào cùng regex.

### 4.8 Kiểm (khuôn measure-birth, cặp hai chiều cùng fixture)
- Sổ/thẻ: fixture do `tests/scripts/gate-fixture.mjs` sinh; dòng sổ sinh bằng CHÍNH recipe rút
  từ khối `DEC-ID-RECIPE` của SKILL (round-trip writer→reader); mutant bản sao gate-card gỡ nhánh
  ba vế / gỡ `plDec` ở khối đã duyệt → thẻ đỏ với thông điệp ghim. Đối chứng đường đọc-cũ dựng
  bằng `git archive <sha-nền> scripts lib` với sha-nền là HẰNG ghi kèm nguồn (output
  `git rev-parse origin/main` lúc viết ca, trước vòng) — không phải merge-base; ca đỏ có tên khi
  sha-nền == HEAD hoặc bản nền dựng lỗi/rỗng. Ca thẻ ghi tệp
  `_acceptance/mot-so-ba-ve/evidence/the-cong-2-ba-ve.txt` (đường suy từ vị trí tệp ca) với dòng
  đầu «# fixture sha256 <băm> · at <ISO>» và khẳng định tệp vừa ghi mang đúng băm của fixture
  trong lượt — đầu vào của phán đoán AC-8 là vật của lượt chạy, không phải residue.
- Cầu nối: fixture = bản chép nguyên văn MỌI dòng Ruling của ledger superpowers thật (ghi nguồn +
  ngày; gồm hai hình dạng `Ruling N: … — Vì sao: … Sai thì tốn: …` và `Task N: Ruling: … — …`)
  cộng ba dòng theo khuôn của SKILL superpowers (`Ruling: a — b — c` · `Final: Ruling: … — … — …`
  · `Task N: parked — … — Ruling: …`); ma trận công bố text ba vế kỳ vọng từng hàng; ca gặt
  lặp; ca slug không suy được; ca tệp vắng. Mutant: bỏ dedupe → gặt hai lần nhân đôi; bỏ nhãn
  làm dấu cắt → hàng hình dạng 1 mất cost.
- Hook: `tests/hooks/run-tests.sh` thêm ma trận có tên: hàng 1 lệnh Finish nguyên văn (đường
  tuyệt đối) · tương đối · `/` cuối · `cd .superpowers/sdd && rm -rf <tên>` · thư mục cha · `rm -r`
  / `rm -fr` / `-R` · nháy → sổ thêm đúng N dòng, exit 0; chiều IM: `cat`/`grep -r`/`ls -R`/`node
  … --workspace` chứa chuỗi → exit 0 VÀ băm sổ không đổi; biến shell → exit 0 + dòng stderr
  «không giải được đường»; cầu nối lỗi → exit 2 + thông điệp; workspace vắng → exit 0. Mutant:
  bỏ neo `rm` → lệnh đọc kích gặt (đỏ); bỏ nhánh exit 2 → cho xoá khi chưa gặt (đỏ).
- Đối chứng dương trước mỗi chiều đỏ; đường dẫn suy từ vị trí tệp ca.
