# Cổng Đáng có cửa — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bộ dựng thẻ vẽ được thẻ cho Cổng Đáng, và chốt «không có hồ sơ thì không vẽ thẻ» gọi đúng tên hai trạng thái nó đang gọi nhầm.

**Architecture:** Thêm một làn `gate === '0'` vào `scripts/gate-card.js`, đặt nhánh nhận cổng TRƯỚC khối chốt hiện có (chốt chạy ở đầu file nên đặt sau là mã chết). Chốt học thêm hai ca có lời thuật riêng. Bốn lối ra và các hằng thông điệp sống trong khối marker MỘT NGUỒN; ba văn bản nghi thức và mọi phép đo đều RÚT từ đó, không gõ literal.

**Tech Stack:** Node CJS thuần (không dependency mới), bash cho bộ răng, `lib/nguong-o-co-hoi.cjs` + `lib/workspace-record.cjs` + `lib/md-section.cjs` đã có sẵn.

**Spec:** [`docs/superpowers/specs/2026-09-01-cong-dang-co-cua-design.md`](../specs/2026-09-01-cong-dang-co-cua-design.md)
**Hợp đồng:** `_acceptance/cong-dang-co-cua/contract.md` (13 tiêu chí, duyệt 2026-09-01 `028cd41e`)

## Global Constraints

- **Không thêm lệnh thứ bảy.** Chế độ Cổng Đáng sống trên `commands/approve.md`.
- **Không gõ literal chuỗi đã có nguồn.** Bốn lối ra, hai tiền tố ngưỡng, các hằng `MSG_*`, từ vựng `decision` — mọi bên đọc phải RÚT từ marker hoặc từ lib.
- **Mọi đường dẫn trong script suy từ vị trí script** (`HERE="$(cd "$(dirname "$0")" && pwd)"`), không hardcode gốc kho (P150).
- **Bản sao để tiêm lấy TRỌN cây** bằng `git archive HEAD`, không chép danh sách file tay (P150).
- **Mỗi phép đo mới phải có cặp hai chiều trên cùng fixture** + thông điệp ghim, và **đối chứng dương chạy TRƯỚC** (`MEASURE-BIRTH-CLAUSE`).
- **Mỗi lệnh tiêm phải chứng minh nó đổi được ít nhất một dòng** (so byte trước/sau); không đổi được thì báo hỏng hạ tầng, KHÔNG báo xanh.
- **Chạy tuần tự, KHÔNG fan-out.** Mọi task `independent: false`. Lý do đã đo: vòng `lan-may-song-qua-bo-phan-loai` fan-out 1 lượt = 3 lần bị chặn, tuần tự 7 lượt = 0 lần. Các task dưới đây đụng chồng nhau ở `scripts/gate-card.js` và ở bộ răng.
- **Không sửa hợp đồng đã ký của hồ sơ `khong-ve-the-ma`.**
- Ngôn ngữ lời thuật cho người: tiếng Việt, theo `skills/acceptance/references/human-facing-language.md`. Thông điệp `stderr` của script là MẶT MÁY — tên chính xác, không dịch.

---

## File Structure

| File | Vai | Task |
|---|---|---|
| `scripts/gate-card.js` | hằng một-nguồn · chốt phân biệt · làn thẻ Cổng Đáng | T1, T2, T3 |
| `commands/acceptance-card.md` | hai lời thuật từ chối mới | T4 |
| `commands/start.md` | bàn giao cổng `dang` | T5 |
| `commands/approve.md` | chế độ ký + bảng ánh xạ bốn lối ra | T6 |
| `skills/acceptance/references/human-facing-language.md` | ô `g0` của ngữ pháp câu gộp | T7 |
| `_acceptance/cong-dang-co-cua/rang.sh` | bộ răng 12 chân (mới) | T8 |
| `tests/scripts/run-tests.sh` | ca lưới thường trực | T9 |

---

### Task 1: Khối marker một-nguồn

`independent: false` · **Phục vụ:** AC-7 (đẳng thức ca từ chối), AC-8 (bốn lối ra), AC-10 (một nguồn ba bên), AC-13 (bảng ánh xạ).

**Files:**
- Modify: `scripts/gate-card.js:78-81` (khối `NO-DOSSIER-GUARD`)

**Interfaces:**
- Consumes: không có.
- Produces: `MSG_NO_WORKSPACE`, `MSG_NO_DOSSIER`, `MSG_NO_CONTRACT` (đã có, giữ nguyên chuỗi), `MSG_O_DA_DONG`, `MSG_HO_SO_HONG`, `LOI_RA_G0` (mảng bốn chuỗi). T2/T3 dùng; T4–T9 và mọi phép đo RÚT từ đây.

- [ ] **Step 1: Mở rộng khối marker**

Trong `scripts/gate-card.js`, khối `// <<<NO-DOSSIER-GUARD … // NO-DOSSIER-GUARD>>>` hiện khai ba hằng. Thêm hai hằng thông điệp và một mảng lối ra, GIỮ NGUYÊN ba hằng cũ từng ký tự:

```js
const MSG_NO_WORKSPACE = 'gate-card: xưởng chưa mở';
const MSG_NO_DOSSIER   = 'gate-card: không có hồ sơ';
const MSG_NO_CONTRACT  = 'gate-card: hồ sơ chưa có contract.md';
const MSG_O_DA_DONG    = 'gate-card: ý đã đóng';
const MSG_HO_SO_HONG   = 'gate-card: hồ sơ hỏng';
// Bốn lối ra của Cổng Đáng — MỘT NGUỒN. commands/approve.md (bảng ánh xạ),
// human-facing-language.md (ô g0) và mọi phép đo RÚT từ dòng này, không gõ
// literal; đổi ở đây mà quên bên kia là ĐỎ ngay, không trôi âm thầm.
const LOI_RA_G0 = ['làm', 'lặp', 'xếp lại', 'dừng'];
```

Chú thích ngay trên khối phải nói rõ: đây là nguồn của NĂM lời thuật và của bốn lối ra; thân lệnh chép nguyên văn và phép đo rút từ đây.

- [ ] **Step 2: Kiểm rút được bằng máy**

Run:
```bash
sed -n "s/^const MSG_[A-Z_]*[[:space:]]*=[[:space:]]*'\(.*\)';.*/\1/p" scripts/gate-card.js
```
Expected: in ra ĐÚNG 5 dòng, dòng 1–3 giữ nguyên văn cũ.

Run:
```bash
node -e "const m=require('fs').readFileSync('scripts/gate-card.js','utf8').match(/const LOI_RA_G0 = \[(.*?)\]/s); console.log(JSON.parse('['+m[1].replace(/'/g,'\"')+']').join('|'))"
```
Expected: `làm|lặp|xếp lại|dừng`

- [ ] **Step 3: Commit**

```bash
git add scripts/gate-card.js
git commit -m "feat(gate-card): khối marker một-nguồn — hai thông điệp mới + bốn lối ra Cổng Đáng"
```

---

### Task 2: Chốt phân biệt, và nhánh nhận cổng đặt TRƯỚC chốt

`independent: false` · **Phục vụ:** AC-3 (thứ tự), AC-4 (ý đã đóng), AC-5 (hồ sơ hỏng), AC-6 (ba ca cũ không đổi).

**Files:**
- Modify: `scripts/gate-card.js:82-103` (khối `NO-DOSSIER-GUARD-BLOCK`)

**Interfaces:**
- Consumes: `MSG_*`, `LOI_RA_G0` từ T1; `frontmatter(t)` (dòng 138), `clean(s)` (dòng 139), `read(p)` (dòng 60), `dir` (dòng 62).
- Produces: biến `gate` được gán `'0'` trước khi chốt chạy; T3 dựa vào nó.

**Bẫy phải tránh:** khối chốt chạy ở ĐẦU file, trước đoạn tự nhận cổng ở dòng ~229. Đặt nhánh nhận Cổng Đáng ở dòng 229 là mã chết. Nhánh phải nằm TRONG hoặc TRƯỚC khối chốt.

- [ ] **Step 1: Viết ca đo đỏ trước — thêm chân tạm vào bộ răng**

Chưa có `rang.sh` (T8). Ca đo tạm thời chạy tay để thấy ĐỎ trước khi sửa:

```bash
T=$(mktemp -d); mkdir -p "$T/_acceptance/o-dong"
printf 'schema_version: 1\n' > "$T/_acceptance/config.yaml"
printf -- '---\nslug: o-dong\nstage: decided\ndecision: kill\n---\n\n## Vấn đề & ai gặp\n\nx\n' \
  > "$T/_acceptance/o-dong/opportunity.md"
node scripts/gate-card.js --root "$T" --slug o-dong; echo "exit=$?"
```
Expected TRƯỚC khi sửa: exit 2, thông điệp `gate-card: hồ sơ chưa có contract.md` — tức nói sai nguyên nhân. Đây là ĐỎ ta muốn thấy.

- [ ] **Step 2: Viết lại thân khối chốt**

Thay thân trong `// <<<NO-DOSSIER-GUARD-BLOCK … // NO-DOSSIER-GUARD-BLOCK>>>` bằng:

```js
if (!contract.trim()) {
  const acc = path.join(root, '_acceptance');
  let real = [];
  try {
    real = fs.readdirSync(acc, { withFileTypes: true })
      .filter(e => e.isDirectory() && fs.existsSync(path.join(acc, e.name, 'contract.md')))
      .map(e => e.name).sort();
  } catch (_) { /* xưởng không đọc được → danh sách rỗng, nhánh dưới vẫn nói đúng ca */ }
  const oppPath0 = path.join(dir, 'opportunity.md');
  const opp0 = read(oppPath0);
  if (!fs.existsSync(path.join(acc, 'config.yaml'))) {
    process.stderr.write(MSG_NO_WORKSPACE + ' — không thấy _acceptance/config.yaml dưới "' + root + '". Chạy acceptance-init cho kho này trước.\n');
    process.exit(2);
  }
  if (!fs.existsSync(dir)) {
    process.stderr.write(MSG_NO_DOSSIER + ' «' + slug + '» — _acceptance/' + slug + '/ không tồn tại.\n' +
      (real.length ? '  Hồ sơ có thật trong xưởng: ' + real.join(', ') + '\n'
                   : '  Xưởng chưa có hồ sơ nào.\n'));
    process.exit(2);
  }
  if (opp0.trim()) {
    // Hồ sơ CÓ ô cơ hội: ba ngả — hỏng, đã đóng, hoặc còn mở (→ thẻ Cổng Đáng).
    // Từ vựng điều hướng hỏi LIB dùng chung, không chép bảng enum thứ hai:
    // bộ quét và bộ dựng thẻ phải cho cùng một kết luận trên cùng hồ sơ.
    const wr = require(path.join(__dirname, '..', 'lib', 'workspace-record.cjs'));
    const fp = wr.fieldProblem('opportunity.md', opp0, 'stage')
            || wr.fieldProblem('opportunity.md', opp0, 'decision');
    if (fp) {
      process.stderr.write(MSG_HO_SO_HONG + ' «' + slug + '» — ' + fp.reason + '.\n' +
        '  Sửa hồ sơ rồi chạy lại; máy quét vào phiên cũng đang nêu hồ sơ này ở mục hỏng.\n');
      process.exit(2);
    }
    const fm0 = frontmatter(opp0);
    const st0 = clean(fm0.stage).toLowerCase();
    const dec0 = clean(fm0.decision).toLowerCase();
    if (st0 === 'archived' || dec0 === 'park' || dec0 === 'kill') {
      process.stderr.write(MSG_O_DA_DONG + ' «' + slug + '» — ý này đã ' +
        (dec0 === 'park' ? 'xếp lại' : dec0 === 'kill' ? 'dừng' : 'đóng hồ sơ') +
        ', không có gì để ký. Mở lại là một quyết định riêng.\n');
      process.exit(2);
    }
    if (!dec0) { gate = '0'; }   // còn mở → LÀN THẺ CỔNG ĐÁNG (T3), KHÔNG từ chối
  }
  if (gate !== '0') {
    process.stderr.write(MSG_NO_CONTRACT + ' «' + slug + '» — _acceptance/' + slug + '/ có mặt nhưng chưa đọc được contract.md, chưa có gì để trình.\n' +
      (real.length ? '  Hồ sơ đủ bản hợp đồng trong xưởng: ' + real.join(', ') + '\n' : ''));
    process.exit(2);
  }
}
```

Ba điều phải giữ đúng: (a) ba lời thuật cũ **nguyên văn**, kể cả phần đuôi liệt kê; (b) ô đã ký `build`/`iterate` rơi xuống `MSG_NO_CONTRACT` như cũ — cố ý, xem Out of scope; (c) `gate = '0'` gán TRONG khối chốt nên nhánh nhận cổng chắc chắn chạy trước.

- [ ] **Step 3: Chạy lại ca ở Step 1**

Expected: exit 2, thông điệp `gate-card: ý đã đóng` và KHÔNG chứa `hồ sơ chưa có contract.md`.

- [ ] **Step 4: Đối chứng dương — ba ca cũ và hai làn cũ không đổi**

```bash
bash tests/scripts/run-tests.sh 2>&1 | grep -E "GM0[1-6]"
```
Expected: mọi dòng `GM01`–`GM06` PASS như trước khi sửa.

- [ ] **Step 5: Commit**

```bash
git add scripts/gate-card.js
git commit -m "feat(gate-card): chốt gọi đúng tên ý-đã-đóng và hồ-sơ-hỏng; nhánh nhận Cổng Đáng đặt trước chốt"
```

---

### Task 3: Làn thẻ Cổng Đáng

`independent: false` · **Phục vụ:** AC-1, AC-2, AC-8, AC-9.

**Files:**
- Modify: `scripts/gate-card.js` — chèn khối `GATE 0` NGAY TRƯỚC dòng `// ================= GATE 1 =================`

**Interfaces:**
- Consumes: `gate === '0'` từ T2; `LOI_RA_G0` từ T1; `STYLE`, `esc`, `stripMd`, `section`, `frontmatter`, `clean`, `read`, `EXTRACT`; `lib/nguong-o-co-hoi.cjs` (`prefixes`, `thresholdState`, `UAT_THRESHOLD_HEADING`, `bulletOf`, `isKhongDoLine`).
- Produces: HTML fragment ra stdout, hoặc JSON `{gate:0, feature, cong_dang:{…}}` khi `--extract`.

- [ ] **Step 1: Lấy bản dựng đã qua đo từ cây ghim để đối chiếu**

```bash
mkdir -p /tmp/ghim && git archive de27babc1f8136b83ea08f8694fe744a4ecee557 scripts lib skills commands | tar -x -C /tmp/ghim
sed -n '/GATE 0 — Cổng Đáng/,/GATE 1/p' /tmp/ghim/scripts/gate-card.js
```
Dùng làm **tham chiếu**, KHÔNG chép mù: bản đó chưa biết tới `MSG_*` và chưa biết `gate` được gán trong khối chốt.

- [ ] **Step 2: Viết ca đo đỏ trước**

```bash
T=$(mktemp -d); mkdir -p "$T/_acceptance/o-mo"
printf 'schema_version: 1\n' > "$T/_acceptance/config.yaml"
cat > "$T/_acceptance/o-mo/opportunity.md" <<'EOF'
---
schema_version: 1
slug: o-mo
feature: Một việc đang chờ quyết
stage: discovery
decision:
---

## Vấn đề & ai gặp

Người vận hành mất một lượt mỗi phiên.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Va chạm lặp lại | Không đáng dựng | Đếm hai tuần | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: Còn va chạm nữa không?
- Kết quả nào là SỐNG: Bốn tuần không lần nào.
EOF
node scripts/gate-card.js --root "$T" --slug o-mo; echo "exit=$?"
```
Expected TRƯỚC khi sửa: exit 0 nhưng in **thẻ Cổng Phạm vi rỗng** (T2 đã gán `gate='0'` mà chưa có làn nào đọc nó, nên rơi xuống nhánh Gate 1). Đó là ĐỎ ta muốn thấy.

- [ ] **Step 3: Chèn khối GATE 0**

```js
// ================= GATE 0 — Cổng Đáng =================
// Cổng thứ ba, lần đầu có mặt người. Thẻ trình đề bài + ngưỡng (đề xuất của
// máy hiện RÕ là đề xuất) + bốn lối ra sống. Máy KHÔNG điền `decision` —
// chữ ký là phát ngôn của người (ADR 0002), và thẻ không ghi gì lên đĩa.
if (gate === '0') {
  const oppPath = path.join(dir, 'opportunity.md');
  const opp = read(oppPath);
  const ofm = frontmatter(opp);
  const OPP_TPL = path.join(__dirname, '..', 'skills', 'acceptance', 'references', 'opportunity-template.md');
  const tpl = read(OPP_TPL);
  const NG = require(path.join(__dirname, '..', 'lib', 'nguong-o-co-hoi.cjs'));
  let nguong, KHONG_DO, DE_XUAT;
  try {
    ({ khongDo: KHONG_DO, deXuat: DE_XUAT } = NG.prefixes(tpl));
    nguong = NG.thresholdState(opp, tpl);
  } catch (e) {
    // Fail-closed: khuôn mất khối marker thì chết to kèm tên file, KHÔNG im
    // lặng tắt răng rồi vẽ một thẻ trông như bình thường.
    process.stderr.write('gate-card: ' + e.message + ' — ' + OPP_TPL + '\n'); process.exit(2);
  }
  const lines = section(opp, NG.UAT_THRESHOLD_HEADING).map(l => l.trim()).filter(l => l && !/^>/.test(l));
  const flags = [];
  if (nguong === 'chua-chot') flags.push(['fred',
    'Ngưỡng còn trống và chưa khai «không đo được» — ký «' + LOI_RA_G0[0] +
    '» lúc này là ký trên một cái thước trang trí. Điền ngưỡng vào ô, hoặc khai một dòng «' + KHONG_DO + ' <lý do>».']);
  if (EXTRACT) {
    process.stdout.write(JSON.stringify({
      gate: 0,
      feature: clean(ofm.feature) || slug,
      cong_dang: {
        nguong,
        loi_ra: LOI_RA_G0,
        nguong_lines: lines.map(l => l.replace(/^[-*]\s+/, '')),
        de_xuat_lines: lines.filter(l => l.includes(DE_XUAT)).map(l => l.replace(/^[-*]\s+/, '')),
        flags: flags.map(f => f[1]),
      },
    }, null, 2));
    process.exit(0);
  }
  const P = [STYLE, `<div class="gc"><div class="card"><div class="h"><div>` +
    `<div class="ft">${esc(stripMd(clean(ofm.feature) || slug))}</div>` +
    `<div class="sub">Cổng Đáng — việc này có đáng làm không?</div></div>` +
    `<span class="chip amber">quyết có làm không</span></div>`];
  const blk = (lab, arr) => { if (arr.length) P.push(`<div class="lab">${lab}</div><div class="grp gnot">${arr.map(t => `<p class="li">${esc(stripMd(t))}</p>`).join('')}</div>`); };
  blk('Vấn đề &amp; ai gặp', section(opp, 'Vấn đề & ai gặp').filter(l => l.trim() && !/^>/.test(l)));
  blk('Giả định sinh tử (ba đầu)', section(opp, 'Giả định chốt sinh tử').filter(l => /^\|\s*\d/.test(l)).slice(0, 3).map(l => (l.split('|')[2] || '').trim()));
  P.push(`<div class="lab">Ngưỡng</div><div class="grp gnot">${lines.length
    ? lines.map(l => `<p class="li">${esc(stripMd(l.replace(/^[-*]\s+/, '')))}` +
        `${l.includes(DE_XUAT) ? ' <span class="chip amber">máy đề xuất — anh sửa hoặc nhận</span>' : ''}` +
        `${NG.isKhongDoLine(l, KHONG_DO) ? ' <span class="chip gray">khai không đo được</span>' : ''}</p>`).join('')
    : '<p class="li">chưa có</p>'}</div>`);
  for (const [k, t] of flags) P.push(`<div class="flag ${k}">${esc(t)}</div>`);
  P.push(`<div class="lab">👉 VIỆC CỦA ANH</div><div class="grp gdo"><p class="li">` +
    `<b>Chọn một lối ra</b> — đọc đề bài và ngưỡng ở trên, rồi trả lời trong phiên đang trình thẻ: ` +
    `«${LOI_RA_G0.join('» hoặc «')}». Muốn sửa ngưỡng thì sửa trong ô trước khi trả lời — vẫn một lượt.</p></div>`);
  P.push(`<div class="foot"><span class="rev">↻ Đảo ngược dễ: «${LOI_RA_G0[2]}» và «${LOI_RA_G0[3]}» không đóng cửa ý — mở lại khi có căn cứ mới.</span>` +
    `<div class="btns">${LOI_RA_G0.map(l => `<button class="b ${l === LOI_RA_G0[0] ? 'yes' : 'bn'}">${esc(l)}</button>`).join('')}</div></div></div></div>`);
  process.stdout.write(P.join('\n'));
  process.exit(0);
}
```

- [ ] **Step 4: Chạy lại ca ở Step 2 + kiểm bốn nấc ngưỡng**

Run: lệnh ở Step 2.
Expected: exit 0, thân có `Cổng Đáng — việc này có đáng làm không?`, có đủ bốn nút lối ra, KHÔNG có cờ đỏ ngưỡng (ô này ngưỡng đã chốt).

Rồi đổi ô đó sang từng nấc còn lại (`…` · `[đề xuất]` · `Không đo được — x`) và khẳng định: cờ đỏ CHỈ hiện ở nấc `…`; dấu «máy đề xuất» CHỈ hiện ở nấc `[đề xuất]`.

- [ ] **Step 5: Kiểm thẻ không ghi gì**

```bash
before=$(shasum -a 256 "$T/_acceptance/o-mo/opportunity.md" | cut -d' ' -f1)
node scripts/gate-card.js --root "$T" --slug o-mo >/dev/null
node scripts/gate-card.js --root "$T" --slug o-mo --extract >/dev/null
after=$(shasum -a 256 "$T/_acceptance/o-mo/opportunity.md" | cut -d' ' -f1)
[ "$before" = "$after" ] && echo "PASS: thẻ không ghi gì" || echo "DO: hồ sơ bị đổi"
```

- [ ] **Step 6: Commit**

```bash
git add scripts/gate-card.js
git commit -m "feat(gate-card): làn thẻ Cổng Đáng — đề bài, ngưỡng bốn nấc, bốn lối ra sống"
```

---

### Task 4: Hai lời thuật từ chối mới trong thân lệnh thẻ

`independent: false` · **Phục vụ:** AC-7.

**Files:**
- Modify: `commands/acceptance-card.md` — bước 2, đoạn «Ba ca từ chối, ba lời thuật RIÊNG»

**Interfaces:**
- Consumes: `MSG_O_DA_DONG`, `MSG_HO_SO_HONG` (T1) — chép NGUYÊN VĂN chuỗi.
- Produces: năm dòng thuật, mỗi dòng mở bằng một chuỗi hằng trong nháy ngược rồi dấu `→`. Bộ răng T8 chân `dang-thuc-ca` đếm đúng hình dạng này.

- [ ] **Step 1: Đổi «Ba ca» thành «Năm ca» và thêm hai dòng**

Giữ nguyên ba dòng cũ. Thêm:

```markdown
- `gate-card: ý đã đóng` → ý này đã được xếp lại hoặc dừng, nên không có gì để ký; không ai phải làm gì tiếp, và mở lại nó là một quyết định riêng chứ không phải bước kế.
- `gate-card: hồ sơ hỏng` → hồ sơ của việc này ghi sai một chỗ nên máy không đọc được nó đang ở nấc nào; việc kế là sửa đúng chỗ máy vừa gọi tên, rồi quay lại.
```

Sửa câu dẫn: «Ba ca từ chối, ba lời thuật RIÊNG» → «**Năm** ca từ chối, **năm** lời thuật RIÊNG», giữ nguyên phần còn lại của câu.

- [ ] **Step 2: Kiểm đẳng thức hai bên tay**

```bash
N=$(sed -n "s/^const MSG_[A-Z_]*[[:space:]]*=.*/x/p" scripts/gate-card.js | wc -l | tr -d ' ')
M=$(awk '/<<<CARD-PRECHECK-RULES/{f=1} f&&/^[0-9]+\. /{exit} f' commands/acceptance-card.md \
    | grep -cE '^\s*- `[^`]+`\s*→')
echo "hằng=$N lời thuật=$M"
```
Expected: `hằng=5 lời thuật=5`

- [ ] **Step 3: Commit**

```bash
git add commands/acceptance-card.md
git commit -m "docs(acceptance-card): hai lời thuật từ chối mới — ý đã đóng, hồ sơ hỏng"
```

---

### Task 5: Bàn giao cổng `dang` trong nghi thức vào phiên

`independent: false` · **Phục vụ:** AC-11.

**Files:**
- Modify: `commands/start.md` bước 4, dòng «Chọn một cổng → …»

**Interfaces:**
- Consumes: tên lệnh `/acceptance-gate:approve` (T6).
- Produces: thứ tự thẻ-trước-lệnh-ký; bộ răng T8 chân `ban-giao` đo thứ tự dòng.

- [ ] **Step 1: Thay dòng bàn giao**

```markdown
   - Chọn một cổng → `/acceptance-gate:acceptance-card <slug>`; riêng cổng `dang`
     → thẻ Cổng Đáng rồi ký bằng `/acceptance-gate:approve <slug> <lối>` (bốn lối:
     làm · lặp · xếp lại · dừng) — một lượt, một PR; riêng cổng `gia-tri` → skill
     `/acceptance-gate:uat-session <slug>` (phiên nghiệm thu có nghi thức riêng, không phải thẻ).
```

- [ ] **Step 2: Kiểm thứ tự**

```bash
node -e '
const L=require("fs").readFileSync("commands/start.md","utf8").split("\n");
const i=L.findIndex(l=>l.includes("acceptance-card <slug>`; riêng cổng `dang`"));
const j=L.findIndex((l,k)=>k>=i&&l.includes("acceptance-gate:approve <slug>"));
console.log(i>=0&&j>=i ? "PASS: thẻ (dòng "+(i+1)+") trước lệnh ký (dòng "+(j+1)+")" : "DO: không tìm thấy hoặc sai thứ tự");'
```

- [ ] **Step 3: Commit**

```bash
git add commands/start.md
git commit -m "docs(start): bàn giao cổng dang — thẻ rồi ký, một lượt một PR"
```

---

### Task 6: Chế độ Cổng Đáng của lệnh duyệt

`independent: false` · **Phục vụ:** AC-10, AC-12, AC-13.

**Files:**
- Modify: `commands/approve.md` — thêm mục `## Chế độ Cổng Đáng` trước khối `Never:`

**Interfaces:**
- Consumes: `LOI_RA_G0` (T1) — bốn nhãn chép nguyên văn; từ vựng `decision` của `NAV_RULES` trong `lib/workspace-record.cjs`.
- Produces: khối marker `G0-ANH-XA` (bốn hàng `<nhãn> -> <giá trị máy>`) và khối marker `G0-RANG-CHAN` (ba mệnh đề chặn, mỗi mệnh đề một dòng). T8 chân `anh-xa-du-hang` và `rang-ky` rút từ hai khối này.

- [ ] **Step 1: Viết mục mới**

```markdown
## Chế độ Cổng Đáng (hồ sơ chưa có hợp đồng)

Cổng thứ ba dùng CHÍNH lệnh này, không có lệnh thứ bảy — hiến pháp kit là chỉ
TRỪ, không CỘNG, và khoá model-invocation của ADR 0002 đã phủ lệnh duyệt này.

**Nhận ra chế độ:** `contract.md` VẮNG ∧ `opportunity.md` có ∧ `decision` rỗng ∧
`stage ≠ archived`. Thẻ: `/acceptance-gate:acceptance-card <slug>` tự nhận Cổng Đáng.

**Câu gộp:** `làm|lặp|xếp lại|dừng [; giữ proto|lưu proto] [; không đo được: <lý do>] [: <tên> [<ngày>]]`

**Bảng ánh xạ — bốn lối ra, bốn giá trị máy.** Danh sách ĐÓNG, máy rút được;
tập giá trị máy phải bằng đúng từ vựng `decision` khai ở `NAV_RULES` trong
`lib/workspace-record.cjs`. In ra một lối mà không ghi được nó thì lối đó không
sống, và người phải quay lại hỏi lượt hai:

<!-- <<<G0-ANH-XA
làm -> build
lặp -> iterate
xếp lại -> park
dừng -> kill
G0-ANH-XA>>> -->

Hỏi `giữ proto`/`lưu proto` CHỈ khi `prototype.base_commit` có giá trị.

**Răng chiều đỏ — chặn TRƯỚC khi ghi.** Ba mệnh đề, mỗi mệnh đề một dòng:

<!-- <<<G0-RANG-CHAN
nguong-chua-chot-chan-lam-va-lap
nguon-ngoai-chua-phan-loai-chan-lam-va-lap
xep-lai-va-dung-khong-can-nguong
G0-RANG-CHAN>>> -->

- `làm`/`lặp` mà ô ngưỡng còn `…` (riêng `[đề xuất]` là trạng thái bình thường
  lúc ký: bước dưới gỡ tiền tố, KHÔNG từ chối) **và** không có dòng
  «Không đo được — » trong file lẫn trong câu gộp → **TỪ CHỐI**, in đúng câu cờ
  đỏ của thẻ. Ngưỡng chốt CÙNG LÚC ký là điều kiện của khuôn, không phải lời khuyên.
- `làm`/`lặp` mà bảng «Nguồn ngoài & phạm vi kế thừa» còn hàng **chưa phân
  loại** → **TỪ CHỐI**.
- `xếp lại`/`dừng` KHÔNG cần ngưỡng — hai lối đó đóng ý, không mở việc.

**Rồi ghi, MỘT lượt:**

1. **Gỡ tiền tố `[đề xuất]`** khỏi mọi bullet ngưỡng: ký là nhận. Câu gộp có
   «không đo được: …» → ghi một dòng `Không đo được — <lý do>` thay các bullet.
2. **Ghi ô:** `stage: decided`, `decision` (theo bảng ánh xạ), `decided_by`,
   `decided_at` (ISO), `prototype.disposition` khi có hỏi. `dừng` → `stage: archived`.
3. **Append sổ quyết định** `_acceptance/<slug>/decisions.jsonl`:
   `{"id":"d-<UTC>-<rand>","type":"gate0","at":"<ISO>","by":"<tên>","decision":"<lối> — <tên ý>"}`.
4. **Vẽ lại bản đồ** nếu repo đã bật (`node <plugin>/scripts/product-map.mjs --root <repo>`),
   rồi commit MỘT lượt: ô cơ hội + sổ + bản đồ.
5. **In bước kế:** `build`/`iterate` → «`/feature-loop:feature-loop <slug>`» ·
   `park` → «đã xếp lại, không ai phải làm gì» · `kill` → «đã đóng có hồ sơ».

Máy KHÔNG điền sẵn lối ra, KHÔNG viết hộ căn cứ: máy trình đề bài + ngưỡng và
bốn lối ra sống; chọn là phát ngôn của người.
```

- [ ] **Step 2: Kiểm bảng ánh xạ đủ hàng và khớp lib**

```bash
node -e '
const fs=require("fs");
const b=fs.readFileSync("commands/approve.md","utf8").match(/<<<G0-ANH-XA\n([\s\S]*?)\nG0-ANH-XA>>>/)[1];
const rows=b.trim().split("\n").map(l=>l.split("->").map(s=>s.trim()));
const {NAV_RULES}=require("./lib/workspace-record.cjs");
const enum_=NAV_RULES["opportunity.md"].decision.enum;
const vals=rows.map(r=>r[1]);
console.log("hàng:",rows.length);
console.log("khớp lib:", JSON.stringify([...vals].sort())===JSON.stringify([...enum_].sort()));
const g=fs.readFileSync("scripts/gate-card.js","utf8").match(/const LOI_RA_G0 = \[(.*?)\]/s)[1];
const labels=JSON.parse("["+g.replace(/'"'"'/g,"\"")+"]");
console.log("nhãn khớp bên vẽ:", JSON.stringify(rows.map(r=>r[0]))===JSON.stringify(labels));'
```
Expected: `hàng: 4` · `khớp lib: true` · `nhãn khớp bên vẽ: true`

- [ ] **Step 3: Commit**

```bash
git add commands/approve.md
git commit -m "docs(approve): chế độ Cổng Đáng — bảng ánh xạ bốn lối ra + ba mệnh đề chặn máy đọc được"
```

---

### Task 7: Ô `g0` trong ngữ pháp câu gộp

`independent: false` · **Phục vụ:** AC-10.

**Files:**
- Modify: `skills/acceptance/references/human-facing-language.md` — mục câu gộp theo lệnh, và khối `GATE-ONESHOT-SLOTS`

**Interfaces:**
- Consumes: bốn nhãn từ `LOI_RA_G0` (T1).
- Produces: bốn dòng `g0 <nhãn>` trong khối `GATE-ONESHOT-SLOTS`; T8 chân `mot-nguon` rút từ đây.

- [ ] **Step 1: Thêm dòng mô tả câu gộp**

Ngay trước dòng `- \`/acceptance-gate:start [<slug>]\``:

```markdown
- `/acceptance-gate:approve [<slug>]` ở **chế độ Cổng Đáng** (hồ sơ chưa có hợp
  đồng): câu gộp là MỘT lối ra — `làm` · `lặp` · `xếp lại` · `dừng` — kèm tuỳ chọn
  `; giữ proto`/`; lưu proto` và `; không đo được: <lý do>`. Máy TỪ CHỐI `làm`/`lặp`
  khi ngưỡng còn trống mà chưa khai «không đo được», hoặc nguồn ngoài chưa phân loại.
```

- [ ] **Step 2: Thêm bốn ô vào khối `GATE-ONESHOT-SLOTS`**

Ngay trên dòng `g1 duyệt hay sửa`:

```
g0 làm
g0 lặp
g0 xếp lại
g0 dừng
g0 giữ proto
g0 không đo được
```

- [ ] **Step 3: Kiểm ba bên cùng danh sách**

```bash
node -e '
const fs=require("fs");
const g=fs.readFileSync("scripts/gate-card.js","utf8").match(/const LOI_RA_G0 = \[(.*?)\]/s)[1];
const ve=JSON.parse("["+g.replace(/'"'"'/g,"\"")+"]");
const hfl=fs.readFileSync("skills/acceptance/references/human-facing-language.md","utf8")
  .match(/<<<GATE-ONESHOT-SLOTS -->\n([\s\S]*?)\n<!-- GATE-ONESHOT-SLOTS>>>/)[1]
  .split("\n").filter(l=>l.startsWith("g0 ")).map(l=>l.slice(3));
const ok=ve.every(x=>hfl.includes(x));
console.log("bên vẽ:",ve.join("|"));
console.log("bản luật có đủ bốn nhãn:",ok);'
```
Expected: `bản luật có đủ bốn nhãn: true`

- [ ] **Step 4: Commit**

```bash
git add skills/acceptance/references/human-facing-language.md
git commit -m "docs(hfl): ô g0 — ngữ pháp câu gộp cho chế độ Cổng Đáng"
```

---

### Task 8: Bộ răng hồ sơ — 13 chân

`independent: false` · **Phục vụ:** cả 13 tiêu chí (E1–E9, E11–E14).

**Files:**
- Create: `_acceptance/cong-dang-co-cua/rang.sh`

**Interfaces:**
- Consumes: mọi vật của T1–T7; các khoá `executors.script.cdcc_*` đã khai sẵn trong `_acceptance/config.yaml`.
- Produces: 12 chân, mỗi chân in `PASS: <nhãn>` hoặc `DO: <nhãn> — <chi tiết>`, exit 0/1.

**Khung bắt buộc** (chép nếp từ `_acceptance/suite-run-log-provenance/rang.sh`):

```bash
#!/usr/bin/env bash
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
CHAN="${2:-}"
[ "${1:-}" = "--chan" ] || { echo "dung: $0 --chan <ten>"; exit 2; }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
loi=0
ghim() { if [ "$2" = "0" ]; then echo "PASS: $1"; else echo "DO: $1${3:+ — $3}"; loi=1; fi; }

# Hằng RÚT TỪ NGUỒN, không gõ literal.
pick() { sed -n "s/^const $1[[:space:]]*=[[:space:]]*'\(.*\)';.*/\1/p" "$ROOT/scripts/gate-card.js" | head -1; }

# Bản sao TRỌN cây để tiêm. Kêu to nếu cây làm việc còn thay đổi chưa commit ở
# vật được đo — bản sao dựng từ HEAD sẽ chấm một bản KHÁC bản đang sửa.
VAT_DO="scripts/gate-card.js scripts/start-scan.mjs commands/acceptance-card.md commands/approve.md commands/start.md skills/acceptance/references/human-facing-language.md lib/workspace-record.cjs lib/nguong-o-co-hoi.cjs"
ban_sao() {
  if ! ( cd "$ROOT" && git diff --quiet HEAD -- $VAT_DO ); then
    ghim "cay lam viec khop HEAD" 1 "con thay doi CHUA COMMIT o vat duoc do — ban sao se cham ban khac; commit roi chay lai"
  fi
  mkdir -p "$1"; ( cd "$ROOT" && git archive HEAD ) | tar -x -C "$1"
}

# Mọi lệnh tiêm phải chứng minh nó đổi được một dòng.
tiem() { # tiem <file> <lenh perl>
  local b a; b=$(wc -c < "$1"); perl -0pi -e "$2" "$1"; a=$(wc -c < "$1")
  [ "$b" != "$a" ] || { ghim "lenh tiem doi duoc vat" 1 "khong doi duoc byte nao ($b) — marker khong ton tai"; return 1; }
  return 0
}
```

- [ ] **Step 1: Dựng hàm sinh xưởng dùng chung**

Một hàm `xuong <đích>` sinh ĐÍCH DANH chín thư mục ô (ô 3 · 4 · 5 · 6 · 7a · 7b · 8 · 9 · 10 theo bảng lát cắt §3), rồi ĐẾM số thư mục thực sinh và so với danh sách trước khi bất kỳ chân nào chạy hai bộ đọc. Lệch → `DO` nêu tên ô thiếu, không chạy tiếp.

- [ ] **Step 2: Viết 12 chân**

| `--chan` (13 chân) | Đo gì | Chiều đỏ |
|---|---|---|
| `hai-bo-doc` | `A\B` rỗng · `B\A` = tập ô nấc chưa-chốt | tiêm bỏ nhánh gate-0 → `A\B` khác rỗng, nêu tên slug; tiêm cho bộ dựng từ chối ô 5 → `B\A` đỏ |
| `nguong-chua-chot` | ma trận 4 nấc × 3 khẳng định | cờ đỏ in vô điều kiện → đỏ ở n2/n3/n4; gỡ dấu «máy đề xuất» → đỏ ở n2 |
| `lan-truoc-chot` | vị trí dòng khối gate-0 < vị trí khối chốt | mutant hoán vị: dời khối gate-0 xuống sau chốt → chạy thật phải ĐỎ với thông điệp chốt |
| `o-da-dong` | 3 ô (park · kill · archived) × ghim hằng mới + vắng hằng cũ + vắng cụm mời-viết-hợp-đồng | đổi `decision` về rỗng → thoát 0 có thẻ |
| `ho-so-hong` | 4 ô (stage lạ · decision lạ · thiếu stage · frontmatter hỏng) × nêu tên field + vắng nhãn thẻ | sửa field về từ vựng → thoát 0 có thẻ |
| `ba-ca-cu` | 3 ca cũ × ghim hằng mình + vắng bốn hằng kia (3×4 assert âm) | đối chứng dương: hồ sơ đủ → thẻ Cổng Phạm vi; đủ + bằng chứng → thẻ Cổng Bằng chứng |
| `dang-thuc-ca` | N hằng `MSG_*` == M lời thuật, ghép một-đối-một | thêm hằng không thêm thuật → đỏ; thêm thuật không rút được → đỏ; đổi chữ một hằng → đúng cặp đó đỏ |
| `bon-loi-ra` | 4 nhãn đúng thứ tự + 1 dòng đảo ngược | bỏ một nhãn khỏi `LOI_RA_G0` → đỏ nêu đúng tên nhãn thiếu |
| `khong-viet-ho` | chứng lệnh đã chạy TRƯỚC (exit 0 + mẩu bắt buộc), rồi băm không đổi + không có `decision` điền sẵn | ghi một byte vào ô → phép so băm đỏ; fixture có `decision` sẵn → phép quét bắt được |
| `mot-nguon` | ba bên (`gate-card.js` · `approve.md` · `human-facing-language.md`) cùng danh sách | ba lượt tiêm riêng, mỗi lượt một bên → đúng bên đó đỏ |
| `ban-giao` | thứ tự dòng thẻ-trước-lệnh-ký trong `start.md` + tên lệnh khớp thân lệnh duyệt | đổi tên lệnh thành tên không tồn tại → đỏ; đảo thứ tự → đỏ. Đối chứng dương: lối `gia-tri` vẫn rút được |
| `anh-xa-du-hang` | bảng `G0-ANH-XA` đủ 4 hàng · tập giá trị == enum lib · tập nhãn == bên vẽ | gỡ một hàng → đỏ nêu tên hàng; đổi giá trị thành chuỗi lạ → đỏ; thêm giá trị hợp lệ vào lib mà không thêm hàng → đỏ |
| `rang-ky` | 3 mệnh đề trong `G0-RANG-CHAN`, mỗi mệnh đề một dòng | gỡ ĐÚNG một dòng → đúng mệnh đề đó đỏ, hai mệnh đề kia còn nguyên |

- [ ] **Step 3: Chạy cả 12 chân**

```bash
for c in hai-bo-doc nguong-chua-chot lan-truoc-chot o-da-dong ho-so-hong ba-ca-cu \
         dang-thuc-ca bon-loi-ra khong-viet-ho mot-nguon ban-giao rang-ky anh-xa-du-hang; do
  echo "--- $c"; bash _acceptance/cong-dang-co-cua/rang.sh --chan "$c"; echo "exit=$?"
done
```
Expected: mọi chân exit 0, không dòng `DO:` nào.

- [ ] **Step 4: Commit**

```bash
git add _acceptance/cong-dang-co-cua/rang.sh
git commit -m "test(cong-dang-co-cua): bộ răng 13 chân — xưởng code-sinh, chiều đỏ gọi chính vật"
```

---

### Task 9: Ca lưới thường trực

`independent: false` · **Phục vụ:** AC-1, AC-4, AC-5, AC-6 (chống hồi quy sau khi hồ sơ đóng).

**Files:**
- Modify: `tests/scripts/run-tests.sh` — ngay sau khối `GM01-06`

**Interfaces:**
- Consumes: `gmpick()` đã có sẵn trong file (dòng ~1147).
- Produces: khối ca `GD01-08`.

**Vì sao cần dù đã có bộ răng T8:** bộ răng chết theo hồ sơ khi merge (cùng nếp không-vào-suite-vĩnh-viễn). Lưới thường trực là thứ còn lại canh hồi quy.

- [ ] **Step 1: Thêm khối ca**

Dùng `gmpick MSG_O_DA_DONG` và `gmpick MSG_HO_SO_HONG` — RÚT từ nguồn, không gõ literal. Tám ca:

- `GD01` ô chờ Cổng Đáng ngưỡng đã chốt → exit 0, stdout có nhãn Cổng Đáng, có bốn lối ra
- `GD02` ô chờ Cổng Đáng ngưỡng chưa chốt → exit 0, có cờ đỏ ngưỡng
- `GD03` ô khai «Không đo được — » → exit 0, KHÔNG cờ đỏ ngưỡng
- `GD04` ô `decision: kill` → exit 2, ghim `MSG_O_DA_DONG`, vắng `MSG_NO_CONTRACT`
- `GD05` ô `stage: archived` → exit 2, ghim `MSG_O_DA_DONG`
- `GD06` ô `stage: linh-tinh` → exit 2, ghim `MSG_HO_SO_HONG`, nêu tên `stage`
- `GD07` ô `decision: build` chưa hợp đồng → exit 2, ghim `MSG_NO_CONTRACT` (ô 6, cố ý giữ nguyên)
- `GD08` **đối chứng dương:** `--extract` trên ô GD01 → exit 0, JSON có `"gate": 0`

- [ ] **Step 2: Chạy trọn lưới**

```bash
bash tests/scripts/run-tests.sh 2>&1 | tail -5
```
Expected: `Results: <N> passed, 0 failed`, và `N` lớn hơn số trước đúng 8+ ca.

- [ ] **Step 3: Chạy trọn bốn suite của lưới trước-merge**

```bash
bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh \
  && bash tests/plugins/run-tests.sh && bash tests/workflows/run-tests.sh \
  && node scripts/product-map.mjs --root . --check
```
Expected: cả năm exit 0.

- [ ] **Step 4: Commit + đặt trạng thái hợp đồng**

```bash
git add tests/scripts/run-tests.sh
git commit -m "test(scripts): tám ca lưới thường trực cho làn Cổng Đáng và hai lời thuật mới"
sed -i.bak 's/^status: approved/status: implemented/' _acceptance/cong-dang-co-cua/contract.md && rm -f _acceptance/cong-dang-co-cua/contract.md.bak
git add _acceptance/cong-dang-co-cua/contract.md
git commit -m "chore(acceptance): cong-dang-co-cua sang implemented"
```

---

## Self-Review

**Phủ spec:** M1→T3 · M2→T2 · M3→T5 · M4→T6 · M5→T7 · M6→T8+T9. Bất biến B1→T8 chân `hai-bo-doc`; B2→cùng chân, khẳng định thứ hai. Bảng lát cắt 10 ô: ô 1–2→T9 GD (qua ca cũ GM03/GM01) · ô 3→GM02 giữ nguyên · ô 4–5→T3 · ô 6→T2 nhánh rơi · ô 7→T2 · ô 8→T2 · ô 9–10→T2 Step 4.

**Không placeholder:** mọi bước có lệnh chạy được hoặc mã dán được. Bảng 12 chân ở T8 Step 2 khai đủ «đo gì» và «chiều đỏ» cho từng chân — thi công không phải đoán.

**Nhất quán tên:** `LOI_RA_G0` · `MSG_O_DA_DONG` · `MSG_HO_SO_HONG` · `G0-ANH-XA` · `G0-RANG-CHAN` dùng cùng tên ở T1, T3, T6, T7, T8. `cdcc_anh_xa_du_bon_hang` trong config trỏ `--chan anh-xa-du-hang` — khớp bảng T8.

**Đã sửa trong lúc tự soát:** bản nháp đầu ghi «12 chân» ở tiêu đề T8 trong khi bảng liệt 13 dòng (`anh-xa-du-hang` sinh ra ở T6, sau khi tiêu đề đã viết). Tiêu đề, bảng và vòng lặp Step 3 nay cùng nói 13.
