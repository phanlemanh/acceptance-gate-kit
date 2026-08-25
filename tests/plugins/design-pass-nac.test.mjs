// tests/plugins/design-pass-nac.test.mjs — ca hồ sơ design-pass-nac-khong-dong-bo.
// THU PHẠM VI 25/08 (owner chọn, sau khi luật dừng-vá bật ở vòng 2): DP2–DP7 ĐÃ CẮT.
// Sáu ca đó đo những mệnh đề PHÁT BIỂU PHỔ QUÁT VỀ NGHĨA của văn xuôi («không có
// đường bỏ im lặng», «không bộ dựng nào bắt buộc», «leo thang theo tín hiệu chứ
// không theo cảm giác»). Loại mệnh đề ấy không chứng được bằng phép so chữ — mọi
// danh sách cấm đều còn không gian ngoài danh sách — và bốn hình dạng lỗi đã dẫm
// qua hai vòng chỉ là bốn cách thất bại của cùng một điều bất khả. Chúng chuyển
// sang người duyệt soi tại Cổng Phạm vi; xem contract AC-2…AC-7 và hạt giống
// docs/plans/2026-08-25-hat-giong-do-loi-hua-van-xuoi.md.
// Ca CÒN LẠI (DP1, DP8–DP13) đều đo QUAN HỆ ĐẾM ĐƯỢC trên tập đóng, hoặc ĐẦU RA
// THẬT của bộ dựng thẻ — loại mệnh đề chứng được.
// Mọi fixture RÚT TỪ mốc neo của đầu VIẾT (skills/design-pass/SKILL.md); mọi mutant đi qua
// CHÍNH bộ kiểm mà chiều xanh dùng — cùng hàm, khác input. Đường dẫn suy từ vị trí file này.
// Ma trận mutant là HỢP ĐỒNG, khai ở đầu evals.yaml của hồ sơ; số mutant = số vế được khẳng định.
//   DP_CASES=DP1,DP3 node tests/plugins/design-pass-nac.test.mjs
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, cpSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const SKILL = path.join(ROOT, 'skills', 'design-pass', 'SKILL.md');

let failures = 0;
// MỘT nguồn danh sách ca: file này. `--ids` in ra để run-tests.sh lặp theo, không chép tay.
const ALL_IDS = ['DP1', 'DP8', 'DP9', 'DP10', 'DP11', 'DP12', 'DP13'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.DP_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const ran = new Set();
const want = id => { const w = only.length === 0 || only.includes(id); if (w) ran.add(id); return w; };
// Ranh giới cứng quanh id: `PASS: [DP1]` không là tiền tố của ca anh em.
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };

const NAC = ['nac-0', 'nac-1', 'nac-2', 'nac-3'];
const block = (text, name) => {
  const m = text.match(new RegExp('<<<' + name + '\\n([\\s\\S]*?)\\n' + name + '>>>'));
  return m ? m[1] : null;
};

// ---------------------------------------------------------------------------
// Bộ kiểm — DÙNG CHUNG cho chiều xanh và mọi mutant. Mỗi hàm trả mảng lỗi có
// TÊN VẾ trong thông điệp; ca nào chỉ so mã thoát là ca không phân biệt được
// «bắt đúng lỗi» với «chưa bao giờ chạy».
// ---------------------------------------------------------------------------

// DP1 · AC-1 — thang bốn nấc, một chỗ duy nhất khai danh sách
function checkLadder(skillText) {
  const errs = [];
  const b = block(skillText, 'REACTION-LADDER');
  if (b === null) return ['thieu moc neo REACTION-LADDER'];
  for (const id of NAC) {
    const row = b.split('\n').find(l => l.includes('| ' + id + ' |'));
    if (!row) { errs.push(`thang thieu nac: ${id}`); continue; }
    // mỗi nấc phải có TÊN tiếng người + ĐIỀU KIỆN dùng: 3 ô không rỗng
    const cells = row.split('|').map(s => s.trim()).filter(Boolean);
    if (cells.length < 3 || !cells[1] || !cells[2]) errs.push(`nac thieu ten hoac dieu kien: ${id}`);
  }
  // Danh sách nấc chỉ được KHAI một chỗ. Đo bằng QUAN HỆ MẬT ĐỘ trên CỬA SỔ, không
  // bằng danh sách hình dạng cú pháp: bản khai lại có vô số hình dạng (hàng bảng,
  // gạch đầu dòng mỗi id một dòng, câu liệt kê, danh sách đánh số…) nên liệt hình
  // dạng là danh-sách-cấm trên không gian mở — hội đồng vòng 3 đã lọt bằng đúng bốn
  // dòng gạch đầu dòng. Mệnh đề đếm được thay thế: NGOÀI mốc neo, không cửa sổ
  // WINDOW dòng liền nhau nào được chứa từ 3 id khác nhau trở lên.
  // Ngưỡng ĐO ĐƯỢC, không đoán: trên cây hiện tại, mọi cửa sổ tới 10 dòng ngoài mốc
  // neo chứa tối đa 2 id — văn xuôi so sánh hai nấc vẫn sống, dư địa thật là 1 id.
  const WINDOW = 8, MAX_IDS = 2;
  const outside = skillText.replace(b, '@@MOC-NEO@@').split('\n');
  for (let i = 0; i + 1 <= outside.length; i++) {
    const win = outside.slice(i, i + WINDOW);
    const seen = new Set(NAC.filter(id => win.join('\n').includes(id)));
    if (seen.size > MAX_IDS) {
      errs.push(`danh sach nac xuat hien 2 cho: ${seen.size} id khac nhau trong ${WINDOW} dong lien nhau ngoai moc neo (dong ${i + 1}): "${win.find(l => NAC.some(id => l.includes(id))).trim().slice(0, 60)}"`);
      break;
    }
  }
  return errs;
}

// DP8 · AC-8 — khuôn sổ phiên giữ ba khoá mới, một chỗ duy nhất
const NOTE_TPL = 'DESIGN-PASS-NOTE-TEMPLATE';
function checkNoteKeys(skillText) {
  const b = block(skillText, NOTE_TPL);
  if (b === null) return [`thieu moc neo ${NOTE_TPL}`];
  const fm = b.split('---')[1] || '';
  const errs = [];
  for (const k of ['reaction:', 'options:', 'divergence:']) {
    if (!fm.includes(k)) errs.push(`khuon so phien thieu khoa: ${k}`);
  }
  // `options:` phải TỰ KHAI là tham chiếu — nếu không, phiên sau sẽ chép bộ phương án
  // vào chuỗi bằng chứng, đúng thứ Out of scope cấm.
  const line = fm.split('\n').find(l => l.trim().startsWith('options:')) || '';
  if (line && !/THAM CHIẾU/i.test(line)) errs.push('khoa options khong tu khai la tham chieu');
  // Khuôn KHÔNG được liệt lại bốn id nấc — danh sách nấc sống ở REACTION-LADDER.
  if (new Set(NAC.filter(id => fm.includes(id))).size >= 3)
    errs.push('khuon liet lai danh sach nac thay vi tro ve moc neo');
  return errs;
}

// ---------------------------------------------------------------------------
// Khớp vòng writer → reader. Hồ sơ thử do CODE SINH, rút TỪ khuôn của đầu VIẾT;
// bộ đọc là CHÍNH scripts/gate-card.js, chạy thật. Nhãn tiếng người cũng rút từ
// cột «Tên» của REACTION-LADDER — nếu bộ dựng thẻ tự chế chuỗi khác, ca này đỏ.
// ---------------------------------------------------------------------------
const GATE_CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const CONTRACT_FX = '---\nschema_version: 1\nfeature: fx\nslug: fx\nrisk_tier: T2\nstatus: draft\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n';

// Nhãn lấy TỪ bảng thang trong skill — một nguồn, không gõ tay lần hai.
function ladderLabels(skillText) {
  const b = block(skillText, 'REACTION-LADDER') || '';
  const out = {};
  for (const l of b.split('\n')) {
    const m = l.match(/^\|\s*(nac-[0-9a-z]+)\s*\|\s*([^|]+?)\s*\|/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

// Sổ phiên sinh TỪ khuôn thật: điền mọi chỗ trống, rồi khẳng định không còn chỗ
// trống nào sống trong frontmatter — chỗ trống lọt qua là false-green của mối nối.
function noteFromTemplate(skillText, { reaction = 'nac-1', options = '', divergence = 'opened', drop = null } = {}) {
  const b = block(skillText, NOTE_TPL);
  if (b === null) throw new Error('thieu khuon so phien');
  let fx = b
    .replace('<slug>', 'fx').replace('<ISO UTC>', '2026-08-25T00:00:00Z')
    .replace('<url đã mở>', 'http://localhost:3000/proto/fx')
    .replace('<real-components|scaffold|static>', 'scaffold')
    .replace('<standalone|static-frame|host-embedded>', 'static-frame')
    .replace('[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]', '[]')
    .replace('<id nấc lấy từ REACTION-LADDER>', reaction)
    .replace('(<kênh đã dùng, vd ghim, thao-luan, sua-roi-luu>)', '(ghim)')
    .replace('<đường dẫn hoặc URL bộ phương án — THAM CHIẾU, không phải bằng chứng; trống nếu không mở bước phân kỳ>', options)
    .replace('<opened, hoặc: skipped — căn cứ 1 dòng>', divergence)
    .replace('<tên-skill-đã-nạp|repo-tokens|shadcn-default>', 'repo-tokens')
    .replace('[<danh sách state đã duyệt>]', '[default]')
    .replace(/<n>/g, '1').replace('<state>', 'default').replace('<breakpoint>', 'mobile-375')
    .replace('<theme>', 'light').replace('<file>', 'default--mobile-375')
    .replace(/^- <file cảnh — [^\n]*>$/m, '- (không có)')
    .replace('<finding — đã đổi gì, 1 dòng/finding>', 'x')
    .replace('<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>', 'y');
  if (drop) fx = fx.split('\n').filter(l => !l.startsWith(drop)).join('\n');
  const fm = fx.split('---')[1] || '';
  if (fm.includes('<')) throw new Error(`frontmatter ho so thu con cho trong song: ${fm.match(/<[^>]*>/)}`);
  return fx;
}

function mkWs(note, cfg = 'schema_version: 1\n') {
  const d = mkdtempSync(path.join(tmpdir(), 'dp-'));
  const ws = path.join(d, '_acceptance', 'fx');
  mkdirSync(ws, { recursive: true });
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'), cfg);
  writeFileSync(path.join(ws, 'contract.md'), CONTRACT_FX);
  if (note !== null) writeFileSync(path.join(ws, 'design-pass.md'), note);
  return d;
}

// Rút TỪNG cờ khỏi HTML thẻ. Đo trên stdout thô là chỗ trốn: chuỗi mốc của một cờ
// nằm TRƯỚC phần giá trị bị trình duyệt nuốt, nên `out.includes(<mốc>)` vẫn xanh khi
// cờ ra người duyệt đã hỏng (S4-r3 finding). Mọi khẳng định về cờ đi qua hàm này.
const flagsOf = html => [...html.matchAll(/<div class="flag [^"]*">([\s\S]*?)<\/div>/g)].map(m => m[1]);
// QUAN HỆ, không phải danh sách bốn câu: mọi cờ nói về nấc phản ứng đều mang cụm này.
// Đếm cờ khớp cụm = 0 phủ cả bốn câu hiện có LẪN câu thứ năm ai đó thêm sau.
const coNacFlag = html => flagsOf(html).filter(t => /nấc phản ứng/i.test(t));

// Chạy bộ đọc THẬT; mutateCard != null → dựng bản sao TRỌN scripts/ + lib/ rồi bẻ
// bản sao đó (chép danh sách file tay là bản base thiếu file — lớp lỗi P150).
function render(wsRoot, mutateCard = null) {
  let card = GATE_CARD;
  if (mutateCard) {
    const d = mkdtempSync(path.join(tmpdir(), 'dpc-'));
    cpSync(path.join(ROOT, 'scripts'), path.join(d, 'scripts'), { recursive: true });
    cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true });
    card = path.join(d, 'scripts', 'gate-card.js');
    const before = readFileSync(card, 'utf8');
    const after = mutateCard(before);
    // Lệnh tiêm không đổi được dòng nào = mutant no-op = ca xanh mà chưa bao giờ chạy
    // chiều đỏ. Cùng lớp với `runCase` (nó đã kiểm), nên chân này cũng phải kiểm.
    if (after === before) throw new Error('lenh tiem vao gate-card KHONG doi duoc dong nao');
    writeFileSync(card, after);
  }
  const r = spawnSync(process.execPath, [card, '--root', wsRoot, '--slug', 'fx'], { encoding: 'utf8' });
  return { status: r.status, out: r.stdout || '', err: r.stderr || '' };
}

// ---------------------------------------------------------------------------
// Chạy ca: đối chứng dương TRƯỚC, rồi ma trận mutant.
// ---------------------------------------------------------------------------
const src = readFileSync(SKILL, 'utf8');

// runCase: check = hàm bộ kiểm; mutants = [[tên, biến-đổi-chuỗi, mảnh-thông-điệp-mong-đợi]]
function runCase(id, label, check, mutants) {
  if (!want(id)) return;
  const clean = check(src);
  if (clean.length) return fail(id, `doi chung duong DO — ban nguyen ven phai XANH: ${clean.join(' · ')}`);
  const bad = [];
  for (const [name, mutate, needle] of mutants) {
    const mutated = mutate(src);
    if (mutated === src) { bad.push(`${name}: lenh tiem KHONG doi duoc dong nao`); continue; }
    const errs = check(mutated);
    if (!errs.some(e => e.includes(needle))) {
      bad.push(`${name}: khong do dung ve "${needle}" (thu duoc: ${errs.join(' · ') || 'KHONG LOI NAO'})`);
    }
  }
  if (bad.length) fail(id, bad.join(' · '));
  else pass(id, `${label} — doi chung duong xanh + ${mutants.length} mutant do dung ve`);
}

runCase('DP1', 'thang bon nac, mot cho duy nhat khai danh sach', checkLadder, [
  ...NAC.map(id => [`m-${id}`, s => s.replace('| ' + id + ' |', '| nac-X |'), `thang thieu nac: ${id}`]),
  ['m-dup-mot-dong', s => s.replace('\n## ', '\n\nDanh sách nấc: nac-0, nac-1, nac-2, nac-3.\n\n## '),
    'danh sach nac xuat hien 2 cho'],
  // CHIỀU ĐỎ NGOÀI hình dạng cũ: bốn dòng gạch đầu dòng, mỗi dòng đúng MỘT id — không
  // dòng nào là hàng bảng, không dòng nào có ≥3 id. Đây là bản khai lại mà thước cũ
  // (danh-sách-cấm hai hình dạng) để lọt; thiếu mutant này thì vế AC-1 là vế chết.
  ['m-dup-gach-dau-dong', s => s + '\n\n' + NAC.map(id => `- ${id} — mô tả`).join('\n') + '\n',
    'danh sach nac xuat hien 2 cho'],
  ['m-dup-danh-so', s => s + '\n\n' + NAC.map((id, i) => `${i + 1}. ${id}`).join('\n') + '\n',
    'danh sach nac xuat hien 2 cho'],
  // vế «mỗi nấc có TÊN + ĐIỀU KIỆN»: rỗng hoá ô điều kiện của một nấc, id vẫn còn
  ['m-thieu-dieu-kien', s => s.replace(/(\| nac-2 \| [^|]+\|)[^|]+\|/, '$1  |'),
    'nac thieu ten hoac dieu kien: nac-2'],
]);

runCase('DP8', 'khuon so phien giu ba khoa moi, khong liet lai danh sach nac', checkNoteKeys, [
  ['m-reaction', s => { const b = block(s, NOTE_TPL);
    return s.replace(b, b.split('\n').filter(l => !l.startsWith('reaction:')).join('\n')); },
    'khuon so phien thieu khoa: reaction:'],
  ['m-options', s => { const b = block(s, NOTE_TPL);
    return s.replace(b, b.split('\n').filter(l => !l.startsWith('options:')).join('\n')); },
    'khuon so phien thieu khoa: options:'],
  ['m-divergence', s => { const b = block(s, NOTE_TPL);
    return s.replace(b, b.split('\n').filter(l => !l.startsWith('divergence:')).join('\n')); },
    'khuon so phien thieu khoa: divergence:'],
  ['m-options-khong-khai', s => { const b = block(s, NOTE_TPL);
    return s.replace(b, b.replace('THAM CHIẾU, không phải bằng chứng', 'đường dẫn')); },
    'khoa options khong tu khai la tham chieu'],
  ['m-liet-lai-nac', s => { const b = block(s, NOTE_TPL);
    return s.replace(b, b.replace('<id nấc lấy từ REACTION-LADDER>', '<nac-0|nac-1|nac-2|nac-3>')); },
    'khuon liet lai danh sach nac thay vi tro ve moc neo'],
]);

// DP9 · AC-9 — khớp vòng: mỗi nấc trong thang → thẻ hiện đúng NHÃN của nấc đó
if (want('DP9')) {
  const errs = [];
  const labels = ladderLabels(src);
  if (Object.keys(labels).length !== 4) errs.push(`rut duoc ${Object.keys(labels).length} nhan tu thang, mong doi 4`);
  for (const [id, label] of Object.entries(labels)) {
    const r = render(mkWs(noteFromTemplate(src, { reaction: id })));
    if (r.status !== 0) { errs.push(`the khong dung duoc cho ${id}: exit ${r.status} — ${r.err.slice(0, 120)}`); continue; }
    if (!r.out.includes(label)) errs.push(`the khong render nhan "${label}" cho ${id}`);
  }
  // khoá options có giá trị → thẻ nói có bộ phương án; trống → không nói
  const withOpt = render(mkWs(noteFromTemplate(src, { options: 'docs/phuong-an/fx.html' })));
  if (!/bộ phương án/i.test(withOpt.out)) errs.push('the khong hien duong bo phuong an khi khoa options co gia tri');
  const noOpt = render(mkWs(noteFromTemplate(src, { options: '' })));
  if (/bộ phương án/i.test(noOpt.out)) errs.push('the hien bo phuong an trong khi khoa options de trong');
  // MA TRẬN 2 MUTANT — bẻ ở ĐẦU VIẾT (khuôn), đọc bằng ĐẦU ĐỌC thật
  const m1 = render(mkWs(noteFromTemplate(src, { reaction: 'nac-2', drop: 'reaction:' })));
  if (m1.out.includes(labels['nac-2'])) errs.push(`m1: bo khoa reaction khoi khuon ma the van khoe nhan "${labels['nac-2']}"`);
  const m2 = render(mkWs(noteFromTemplate(src, { options: 'docs/x.html', drop: 'options:' })));
  if (/bộ phương án/i.test(m2.out)) errs.push('m2: bo khoa options khoi khuon ma the van hien duong bo phuong an');
  if (errs.length) fail('DP9', errs.join(' · '));
  else pass('DP9', 'khop vong 4 nac khuon->the + 2 mutant do dung ve');
}

// DP10 · AC-10 — năm nhánh đời-hồ-sơ, đối chứng dương chạy TRƯỚC
if (want('DP10')) {
  const errs = [];
  const labelsOf = id => ladderLabels(src)[id];
  const CO_VANG_THIEU = 'chưa khai nấc phản ứng';
  const a = render(mkWs(noteFromTemplate(src, { reaction: 'nac-1' })));
  // ĐỐI CHỨNG DƯƠNG «sổ phiên đủ khoá → SẠCH cờ nấc»: đòi ĐẾM cờ-nấc = 0, không đòi
  // vắng đúng MỘT câu. Soi một câu thì ba câu kia (và câu thứ năm sau này) có thể bắn
  // trên hồ sơ sạch mà ca vẫn xanh — vế «SẠCH» thành vế chết (S4-r3 finding).
  const coA = coNacFlag(a.out);
  if (coA.length) errs.push(`(a) ho so du khoa van co ${coA.length} co nac — doi chung duong hong: "${coA[0].slice(0, 70)}"`);
  const b2 = render(mkWs(noteFromTemplate(src, { drop: 'reaction:' })));
  if (!b2.out.includes(CO_VANG_THIEU)) errs.push(`(b) thieu khoa reaction ma khong co co vang "${CO_VANG_THIEU}"`);
  if (b2.status !== 0) errs.push('(b) duong doc-cu KHONG duoc chan: the phai dung duoc');
  // GHIM ĐÚNG CÂU CỜ. Chỉ đòi thấy chuỗi "nac-9" là đo BẢN IN DỰ PHÒNG của nhãn
  // (thẻ luôn in id thô khi không có nhãn), không đo cờ — xoá cờ đi ca vẫn xanh.
  const CO_VANG_LA = 'Nấc phản ứng không nhận diện được';
  const c = render(mkWs(noteFromTemplate(src, { reaction: 'nac-9' })));
  // Lời hứa AC-10 là QUAN HỆ «cờ vàng NÊU TÊN giá trị lạ đó» — giá trị phải nằm TRONG
  // cờ. Ghim trên toàn bộ stdout là đo BẢN IN DỰ PHÒNG: thẻ luôn in id thô ở khối
  // «Bản mẫu» khi không có nhãn, nên vế nêu-tên tự thoả dù cờ có nêu hay không.
  const coC = coNacFlag(c.out).filter(t => t.includes(CO_VANG_LA));
  if (!coC.length) errs.push(`(c) gia tri la ma khong co co vang "${CO_VANG_LA}"`);
  else if (!coC.some(t => t.includes('nac-9'))) errs.push('(c) co vang co mat nhung KHONG NEU TEN "nac-9" trong noi dung co');
  if (c.status !== 0) errs.push('(c) gia tri la KHONG duoc chan the');

  // (d)+(e) SỔ PHIÊN ĐIỀN NỬA VỜI — phiên MỚI ghi hỏng, KHÔNG phải hồ sơ đời trước.
  // Gộp hai thứ vào một câu là nói sai chuyện đang xảy ra cho người duyệt, và giấu
  // mất cái sai vừa xảy ra (S4-r2 finding). Chỗ trống rút TỪ khuôn thật, không gõ tay.
  const tpl = block(src, NOTE_TPL);
  const reactionLine = (tpl.match(/^reaction:.*$/m) || [''])[0];
  const chanPh = reactionLine.replace(/^reaction:\s*\S+\s*/, '');
  const idPh = (reactionLine.match(/^reaction:\s*(\S+)/) || [])[1];
  if (!/[<>]/.test(chanPh) || !/[<>]/.test(idPh || ''))
    errs.push('khuon so phien khong con cho trong o dong reaction — fixture (d)(e) mat nghia');
  // Hai nhánh nửa-vời có HAI câu khác nhau, cố ý: (d) id đã điền nên chỉ thiếu kênh;
  // (e) chưa có id nào nên là «có khoá mà chưa điền». Ghim đúng câu của từng nhánh —
  // dùng chung một chuỗi cho cả hai là hạ thước cho vừa vật.
  const CO_VANG_NUA_VOI = 'còn nguyên chỗ trống của khuôn';
  const CO_VANG_CHUA_DIEN = 'CHƯA ĐIỀN';
  // (d) id ĐÃ điền, phần kênh còn chỗ trống → thẻ vẫn phải nhận nấc đã khai
  const d = render(mkWs(noteFromTemplate(src, { reaction: 'nac-1' }).replace('(ghim)', chanPh)));
  if (d.status !== 0) errs.push('(d) so phien nua voi lam dung the');
  if (!d.out.includes(labelsOf('nac-1'))) errs.push('(d) id da dien ma the khong nhan nac-1');
  if (!d.out.includes(CO_VANG_NUA_VOI)) errs.push(`(d) khong co co vang "${CO_VANG_NUA_VOI}" cho phan kenh chua dien`);
  if (d.out.includes(CO_VANG_THIEU)) errs.push('(d) bao NHAM la ho so doi truoc trong khi phien nay vua ghi hong');
  // (e) id còn chỗ trống → cờ phải nói ĐÚNG nguyên nhân, không phải «đời trước»
  const e = render(mkWs(noteFromTemplate(src, { reaction: 'nac-1' }).replace('nac-1', idPh)));
  if (e.status !== 0) errs.push('(e) so phien nua voi lam dung the');
  if (!e.out.includes(CO_VANG_CHUA_DIEN)) errs.push(`(e) khong co co vang "${CO_VANG_CHUA_DIEN}"`);
  if (e.out.includes(CO_VANG_THIEU)) errs.push('(e) bao NHAM la ho so doi truoc');
  // MA TRẬN 2 MUTANT trên bản sao TRỌN scripts/+lib/, đi qua CHÍNH bộ đọc thật
  const m1 = render(mkWs(noteFromTemplate(src, { reaction: 'nac-1' }).replace('(ghim)', chanPh)),
    t => t.replace('dp.reaction = reactionId || (dp.reaction_placeholder ? \'\' : rawReaction);',
                   'dp.reaction = dp.reaction_placeholder ? \'\' : (reactionId || rawReaction);'));
  if (m1.out.includes(labelsOf('nac-1')))
    errs.push('m1: bo duong rut id khoi chuoi nua voi ma the van khoe nhan — ve (d) khong phan biet duoc');
  const m2 = render(mkWs(noteFromTemplate(src, { reaction: 'nac-1' }).replace('nac-1', idPh)),
    t => t.replace('if (!dp.reaction && dp.reaction_declared)', 'if (false)'));
  if (!m2.out.includes(CO_VANG_THIEU))
    errs.push('m2: bo nhanh nua-voi ma the KHONG roi ve cau "doi truoc" — ve (e) khong phan biet duoc');
  // m-neu-ten — cờ giá trị-lạ CÒN NGUYÊN nhưng mất phần nêu tên. Chiều đỏ này do hội
  // đồng vòng 4 chứng thực trên vật thật: trước khi sửa, ca vẫn xanh.
  const mTen = render(mkWs(noteFromTemplate(src, { reaction: 'nac-9' })),
    t => t.split('+ esc(dp.reaction) + ').join('+ '));
  if (coNacFlag(mTen.out).some(t => t.includes(CO_VANG_LA) && t.includes('nac-9')))
    errs.push('m-neu-ten: bo phan neu ten khoi co ma (c) van khong do');
  // m3 — mutant của hội đồng vòng 3: bắn cờ nửa-vời cho MỌI hồ sơ. Đối chứng dương
  // cũ (soi một câu) không phân biệt được ca này; ca mới phải đỏ.
  const m3 = render(mkWs(noteFromTemplate(src, { reaction: 'nac-1' })),
    t => t.replace('dp.reaction_placeholder = /[<>]/.test(rawReaction);',
                   'dp.reaction_placeholder = /[<>]/.test(rawReaction) || true;'));
  if (!coNacFlag(m3.out).length)
    errs.push('m3: bat co nac cho MOI ho so ma doi chung duong (a) van khong do');

  // (f) LƯỚI THOÁT CHUỖI — quan hệ trên TOÀN BỘ cờ. Giá trị hồ sơ (văn bản người/máy
  // viết) không được ra cờ dưới dạng ngoặc nhọn THÔ: trình duyệt nuốt như tag và
  // người duyệt đọc được chuỗi rỗng — đúng cái giá trị mà cờ sinh ra để nêu tên.
  // Bộ fixture KHÔNG do tay liệt: nó SINH TỪ danh sách khoá của chính khuôn sổ phiên,
  // nên khoá nào có hôm nay hay ai thêm mai sau đều được thử. Liệt tay ba ca mình nghĩ
  // ra chính là danh-sách-cấm trên không gian mở — lớp lỗi vòng này đang sửa.
  const noteKeys = [...(block(src, NOTE_TPL).split('---')[1] || '').matchAll(/^([a-z_]+):/gm)].map(m => m[1]);
  if (noteKeys.length < 5) errs.push(`(f) rut duoc ${noteKeys.length} khoa tu khuon so phien — qua it, fixture mat nghia`);
  const HOSTILE = '<script>x</script>';
  for (const k of noteKeys) {
    const note = noteFromTemplate(src).split('\n')
      .map(l => l.startsWith(k + ':') ? `${k}: ${HOSTILE}` : l).join('\n');
    const tho = flagsOf(render(mkWs(note)).out).filter(t => /[<>]/.test(t));
    if (tho.length) errs.push(`(f) khoa "${k}" mang ngoac nhon THO ra co: "${tho[0].slice(0, 70)}"`);
  }
  // Ổ cắm đường nhúng đến từ config.yaml chứ không từ sổ phiên — cùng lớp, khác nguồn.
  const thoCfg = flagsOf(render(mkWs(noteFromTemplate(src), `schema_version: 1\ndesign_pass:\n  host_embed:\n    guide: ${HOSTILE}\n`)).out).filter(t => /[<>]/.test(t));
  if (thoCfg.length) errs.push(`(f) con tro duong nhung mang ngoac nhon THO ra co: "${thoCfg[0].slice(0, 70)}"`);

  // (h) KHOÁ KẾ THỪA — bảng nhãn là allowlist, và allowlist tra bằng `TABLE[key]` trên
  // object literal nhận trúng MỌI khoá của Object.prototype: cờ «không nhận diện được»
  // im lặng, thẻ in ra `function Object() { [native code] }`, và ở đường --extract thì
  // JSON.stringify bỏ hẳn khoá có giá trị là hàm nên `reaction_label` BIẾN MẤT.
  // Danh sách khoá lấy TỪ chính Object.prototype, không gõ tay — gõ tay là lại một
  // allowlist nữa, đúng lớp đang sửa. Thử CẢ HAI trục vì hai bảng cùng hình dạng.
  const KHOA_KE_THUA = Object.getOwnPropertyNames(Object.prototype).filter(k => k !== '__proto__').concat('__proto__');
  for (const k of KHOA_KE_THUA) {
    const r = render(mkWs(noteFromTemplate(src, { reaction: 'nac-1' })
      .split('\n').map(l => l.startsWith('reaction:') ? `reaction: ${k}` : l).join('\n')));
    if (!coNacFlag(r.out).some(t => t.includes('không nhận diện được')))
      errs.push(`(h) khoa ke thua "${k}" o truc nac di lot — khong co co «khong nhan dien duoc»`);
    const ex = spawnSync(process.execPath, [GATE_CARD, '--root', mkWs(noteFromTemplate(src, { reaction: 'nac-1' })
      .split('\n').map(l => l.startsWith('reaction:') ? `reaction: ${k}` : l).join('\n')), '--slug', 'fx', '--extract'], { encoding: 'utf8' });
    let j = null; try { j = JSON.parse(ex.stdout); } catch { /* bắt bằng assert dưới */ }
    if (!j || !j.design_pass || !('reaction_label' in j.design_pass))
      errs.push(`(h) khoa ke thua "${k}": --extract mat han khoa reaction_label (JSON.stringify bo gia tri ham)`);
  }
  const rCtx = render(mkWs(noteFromTemplate(src).split('\n').map(l => l.startsWith('context:') ? 'context: constructor' : l).join('\n')));
  if (!flagsOf(rCtx.out).some(t => /Nấc ngữ cảnh không nhận diện được/.test(t)))
    errs.push('(h) khoa ke thua o truc NGU CANH di lot — bang nhan kia chua sua theo lop');
  // chiều đỏ của (h): trả CẢ HAI bảng về object literal → phải đỏ
  const mProto = render(mkWs(noteFromTemplate(src, { reaction: 'nac-1' })
      .split('\n').map(l => l.startsWith('reaction:') ? 'reaction: constructor' : l).join('\n')),
    t => t.split('Object.assign(Object.create(null), {').join('({'));
  if (coNacFlag(mProto.out).some(t => t.includes('không nhận diện được')))
    errs.push('m-proto: tra bang nhan ve object literal ma (h) khong do');

  // (g) SWEEP TĨNH ĐÃ TRỪ (vòng 4, owner quyết). Nó tuyên phủ «MỌI chỗ đẩy cờ» nhưng
  // đếm theo DÒNG và theo đúng một dạng nối chuỗi, nên chỗ đẩy viết bằng template
  // literal hoặc thoát chuỗi NỬA VỜI đi lọt — và chiều đỏ của nó chỉ tiêm đúng dạng
  // nối nó đã biết, tức tautology. Vá nó là dựng lại cùng lớp lỗi ở hình dạng mới;
  // «chỉ TRỪ, không CỘNG». GIỚI HẠN CÒN LẠI, khai thẳng: lưới (f) phủ mọi chỗ đẩy mà
  // một giá trị hồ sơ THẬT chạm tới được; nhánh «không nhận diện được» theo cấu tạo
  // không nhận được giá trị mang ngoặc nhọn (giá trị có ngoặc luôn rẽ sang nhánh
  // chưa-điền), nên esc() ở đó là phòng thủ chiều sâu KHÔNG có phép đo canh.
  // CHIỀU ĐỎ của (f): gỡ TOÀN BỘ esc() trong file trên bản sao — lưới phải đỏ dù chỗ
  // đẩy nào mất thoát chuỗi, không riêng chỗ tôi nghĩ tới.
  const mEsc = render(mkWs(noteFromTemplate(src, { reaction: 'nac-1' }).replace('(ghim)', chanPh)),
    t => t.split('+ esc(').join('+ ('));
  if (!flagsOf(mEsc.out).some(t => /[<>]/.test(t)))
    errs.push('m-esc: go het esc() ma luoi (f) khong do');

  if (errs.length) fail('DP10', errs.join(' · '));
  else pass('DP10', 'nam nhanh doi-ho-so + luoi thoat-chuoi hanh vi + khoa ke thua ca hai truc + 6 mutant do dung ve');
}

// DP13 · AC-15 — hồ sơ KHÔNG có sổ phiên: thẻ vẫn phải dựng được
if (want('DP13')) {
  const errs = [];
  const KHOI = 'Bản mẫu';
  const none = render(mkWs(null));
  if (none.status !== 0) errs.push(`the phai dung duoc khi khong co so phien: exit ${none.status} — ${none.err.slice(0, 160)}`);
  if (none.out.includes(KHOI)) errs.push(`khoi "${KHOI}" hien tren ho so khong co so phien`);
  for (const bad of ['undefined', 'null', '(chưa khai)']) {
    if (none.out.includes(bad)) errs.push(`nhan la lot ra tren ho so khong co so phien: ${bad}`);
  }
  // vế THỨ BA của AC-15: «KHÔNG cờ nấc». Vế này trước đây không có assert nào — ba
  // assert cũ (mã thoát · khối vắng · nhãn lạ) đều không chạm nó, nên đẩy một cờ nấc
  // ra ngoài khối `if (dp.present)` là ca vẫn xanh (S4-r3 finding).
  const coNone = coNacFlag(none.out);
  if (coNone.length) errs.push(`co nac hien tren ho so KHONG co so phien: "${coNone[0].slice(0, 70)}"`);
  // đối chứng: CÓ sổ phiên thì khối phải hiện — chứng minh phép khẳng định trên biết phân biệt
  const withNote = render(mkWs(noteFromTemplate(src)));
  if (!withNote.out.includes(KHOI)) errs.push(`doi chung hong: co so phien ma khoi "${KHOI}" khong hien`);
  // MA TRẬN 2 MUTANT trên bản sao TRỌN scripts/+lib/
  const m1 = render(mkWs(null), s => s.replace('if (dp.present) P.push(', 'if (true) P.push('));
  if (!m1.out.includes(KHOI)) errs.push('m1: bo dieu kien co-so-phien ma the van khong in khoi — ca khong phan biet duoc');
  const m2 = render(mkWs(null), s => s.replace("const dpText = read(path.join(dir, 'design-pass.md'));", "const dpText = null.x;"));
  if (m2.status === 0) errs.push('m2: bo dung the nem loi ma van exit 0 — ca khong bat duoc the chet');
  // m3 — mutant của hội đồng: đẩy cờ nấc RA NGOÀI khối `if (dp.present)`
  const m3 = render(mkWs(null), s => s.replace(
    "  const dpFlags = [];\n  if (dp.present) {",
    "  const dpFlags = [];\n  if (!dp.reaction) dpFlags.push('Sổ phiên chưa khai nấc phản ứng (rò rỉ)');\n  if (dp.present) {"));
  if (!coNacFlag(m3.out).length)
    errs.push('m3: co nac ro ri ra ho so khong co so phien ma ca van khong do — ve «KHONG co nac» la ve chet');
  if (errs.length) fail('DP13', errs.join(' · '));
  else pass('DP13', 'khong so phien: the dung duoc, khoi vang, khong co nac, khong nhan la + 3 mutant');
}

// DP11 · AC-11 — một cây nguồn: mỗi site chứa ĐÚNG NGUYÊN VĂN câu chuẩn
// Đo QUAN HỆ (nguyên văn), không đo ĐẾM SUÔNG: hai chỗ viết hai nghĩa khác nhau vẫn
// đếm đủ số bản, nên đếm-không-so-chữ là thước chết đúng chỗ nó sinh ra để giữ.
// Bảng khai tay là ALLOWLIST. Allowlist không có chiều đỏ NGOÀI danh sách thì bản
// chép thứ ba mọc ở file không có tên vẫn lọt — đúng thứ AC-11 sinh ra để chặn
// («một cây nguồn cho câu nấc-mặc-định»), và đúng lỗ hội đồng vòng 2 chứng minh
// bằng cách nối câu chuẩn vào skills/acceptance/SKILL.md mà ca vẫn xanh.
// Nên vế thứ hai quét TRỌN hai thư mục — CÙNG phạm vi mà hàm đếm của răng câu-chết
// dùng — và đối chiếu TỔNG bản chép với TỔNG khai trong bảng.
const SCAN_DIRS = ['skills', 'feature-loop'];
// Không lọc theo đuôi file: lọc-theo-đuôi là blacklist, file kiểu mới sẽ lọt.
function walkFiles(abs, acc = []) {
  for (const e of readdirSync(abs, { withFileTypes: true })) {
    const q = path.join(abs, e.name);
    if (e.isDirectory()) walkFiles(q, acc); else acc.push(path.relative(ROOT, q));
  }
  return acc;
}
const scanAll = () => SCAN_DIRS.flatMap(d => walkFiles(path.join(ROOT, d)));

function checkDefaultSites(skillText, readAt, listFiles) {
  const sentence = block(skillText, 'REACTION-DEFAULT-SENTENCE');
  if (sentence === null) return ['thieu moc neo REACTION-DEFAULT-SENTENCE'];
  const man = block(skillText, 'REACTION-DEFAULT-SITES');
  if (man === null) return ['thieu moc neo REACTION-DEFAULT-SITES'];
  const errs = [];
  const need = sentence.trim();
  const declared = new Map();
  for (const line of man.trim().split('\n')) {
    const m = line.trim().match(/^(\S+)\s+(\d+)$/);
    if (!m) { errs.push(`dong manifest thieu so: "${line.trim()}"`); continue; }
    const [, rel, want2] = m;
    declared.set(rel, Number(want2));
    const body = readAt(rel);
    if (body === null) { errs.push(`site khong doc duoc: ${rel}`); continue; }
    const got = body.split(need).length - 1;
    if (got !== Number(want2)) {
      errs.push(got > Number(want2)
        ? `site ${rel}: thua ban chep (dem ${got}, manifest khai ${want2})`
        : `site ${rel}: thieu ban chep hoac lech chu (dem ${got}, manifest khai ${want2})`);
    }
  }
  // Vế «số site có mặt phải bằng đúng con số khai» — quét TRỌN glob, không chỉ các
  // site đã có tên. File mang bản chép mà không có tên trong bảng là ĐỎ.
  let total = 0;
  for (const rel of listFiles()) {
    const body = readAt(rel);
    if (body === null) continue;
    const got = body.split(need).length - 1;
    if (!got) continue;
    total += got;
    if (!declared.has(rel)) errs.push(`ban chep NGOAI bang khai: ${rel} (dem ${got})`);
  }
  const wantTotal = [...declared.values()].reduce((a, b) => a + b, 0);
  if (total !== wantTotal) errs.push(`tong ban chep tren ca hai thu muc dem ${total}, bang khai tong ${wantTotal}`);
  return errs;
}

if (want('DP11')) {
  const readAt = rel => { try { return readFileSync(path.join(ROOT, rel), 'utf8'); } catch { return null; } };
  const clean0 = checkDefaultSites(src, readAt, scanAll);
  if (clean0.length) fail('DP11', `doi chung duong DO — ban nguyen ven phai XANH: ${clean0.join(' · ')}`);
  else {
    const errs = [];
    const FL = 'feature-loop/skills/feature-loop/SKILL.md';
    // File THỨ BA: có thật dưới glob, KHÔNG có tên trong bảng khai.
    const THIRD = 'skills/acceptance/SKILL.md';
    const sentence = block(src, 'REACTION-DEFAULT-SENTENCE').trim();
    // m1 — lệch MỘT TỪ ở một site (không xoá): đếm vẫn đủ nếu thước chỉ đếm bản chép
    const m1 = rel => rel === FL ? readAt(rel).replace(sentence, sentence.replace('KHÔNG ĐỒNG BỘ', 'không đồng bộ')) : readAt(rel);
    if (!checkDefaultSites(src, m1, scanAll).some(e => e.includes(`site ${FL}`) && e.includes('lech chu')))
      errs.push('m1: lech mot tu o mot site ma khong do — thuoc dang dem suong');
    // m2 — thừa một bản chép mà không sửa manifest
    const m2 = rel => rel === FL ? readAt(rel) + '\n' + sentence + '\n' : readAt(rel);
    if (!checkDefaultSites(src, m2, scanAll).some(e => e.includes('thua ban chep'))) errs.push('m2: thua ban chep ma khong do');
    // m3 — thiếu một bản chép
    const m3 = rel => rel === FL ? readAt(rel).replace(sentence, '') : readAt(rel);
    if (!checkDefaultSites(src, m3, scanAll).some(e => e.includes('thieu ban chep'))) errs.push('m3: thieu ban chep ma khong do');
    // m4 — CHIỀU ĐỎ NGOÀI DANH SÁCH: bản chép mọc ở file thứ ba, bảng khai không đổi.
    // Thiếu mutant này thì vế «thêm một chỗ mà không sửa bảng cũng ĐỎ» là vế chết.
    const m4 = rel => rel === THIRD ? readAt(rel) + '\n' + sentence + '\n' : readAt(rel);
    const e4 = checkDefaultSites(src, m4, scanAll);
    if (!e4.some(e => e.includes('NGOAI bang khai') && e.includes(THIRD)))
      errs.push('m4: ban chep o file THU BA ngoai danh sach ma khong do — allowlist khong co chieu do ngoai danh sach');
    if (!e4.some(e => e.includes('tong ban chep'))) errs.push('m4: tong ban chep khong doi chieu voi tong khai');
    // m5 — file thứ ba BIẾN MẤT khỏi phạm vi quét: chứng minh chân quét thật sự đi
    // trọn thư mục chứ không phải một danh sách rút gọn nào đó.
    const narrow = () => [FL];
    if (checkDefaultSites(src, m4, narrow).some(e => e.includes('NGOAI bang khai')))
      errs.push('m5: pham vi quet hep van bao duoc ban chep thu ba — chan quet khong that');
    if (errs.length) fail('DP11', errs.join(' · '));
    else pass('DP11', 'moi site dung nguyen van + tong ban chep tron glob khop bang khai + 5 mutant do dung ve');
  }
}

// DP12 · AC-13 — hai ổ cắm thiết kế được nêu ở CẢ tài liệu lẫn khuôn khởi tạo
const DOC_SITES = { 'GUIDE.md': null, 'commands/acceptance-init.md': null };
const DOC_KEYS = ['design_pass.ds_skill', 'feature_loop.ui_standards_skill'];
function checkDocKeys(readAt) {
  const errs = [];
  for (const rel of Object.keys(DOC_SITES)) {
    const body = readAt(rel);
    if (body === null) { errs.push(`khong doc duoc: ${rel}`); continue; }
    for (const k of DOC_KEYS) if (!body.includes(k)) errs.push(`thieu o cam (${rel}, ${k})`);
  }
  return errs;
}

if (want('DP12')) {
  const readAt = rel => { try { return readFileSync(path.join(ROOT, rel), 'utf8'); } catch { return null; } };
  const clean0 = checkDocKeys(readAt);
  if (clean0.length) fail('DP12', `doi chung duong DO — ban nguyen ven phai XANH: ${clean0.join(' · ')}`);
  else {
    const errs = [];
    // MA TRẬN 4 MUTANT = 2 file × 2 khoá, mỗi mutant xoá đúng MỘT ô
    for (const rel of Object.keys(DOC_SITES)) for (const k of DOC_KEYS) {
      const mut = r => r === rel ? readAt(r).split(k).join('X') : readAt(r);
      if (!checkDocKeys(mut).some(e => e.includes(`(${rel}, ${k})`)))
        errs.push(`mutant (${rel}, ${k}) khong do dung o`);
    }
    if (errs.length) fail('DP12', errs.join(' · '));
    else pass('DP12', 'hai o cam neu du o ca hai file + 4 mutant do dung o');
  }
}

// DP_CASES nêu id không tồn tại → không được xanh im lặng (xanh-không-chạy)
const unknown = only.filter(id => !ran.has(id));
if (unknown.length) { console.log(`FAIL: [DP_CASES] không khớp ca nào: ${unknown.join(',')}`); failures++; }
if (failures) { console.log(`design-pass-nac: ${failures} ca đỏ`); process.exit(1); }
