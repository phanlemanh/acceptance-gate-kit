// Lưới mã sổ quyết định trùng (11/09): sổ release-2-11-0 có 8 dòng chung MỘT id vì
// máy tính id một lần rồi dùng lại cho cả lượt ghi. Bên đọc tra overlay
// `decisions_plain` bằng `.find(x => x.id === id)`, nên một câu dịch cho id trùng
// hiện trên MỌI dòng mang id đó. Hai vật được canh:
//   · bên ĐỌC: khoá overlay rút từ khối marker DEC-PLAIN-KEY của gate-card.js;
//     id trùng → khoá `id#k` (k theo thứ tự dòng sổ), overlay theo id trần của id
//     trùng bị bỏ qua (đường đọc-cũ: in chữ gốc của sổ, không in câu sai chỗ).
//   · bên VIẾT: khuôn id rút qua marker DEC-ID-RECIPE của SKILL feature-loop.
// Khai sinh phép đo: đối chứng dương + phá vật thật trên CÙNG fixture, thông điệp ghim.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { mkWs, G1, G2, PROBE, REVIEW2, ROOT, GC, SRC } from './gate-fixture.mjs';

let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };
const eq = (got, want, what) => { if (JSON.stringify(got) !== JSON.stringify(want)) die(`${what}\n  got : ${JSON.stringify(got)}\n  want: ${JSON.stringify(want)}`); };

const run = (gc, root, slug, extra = []) => spawnSync('node', [gc, '--root', root, '--slug', slug, ...extra], { encoding: 'utf8' });
const extract = (gc, root, slug) => JSON.parse(run(gc, root, slug, ['--extract']).stdout);

// ---- fixture CODE-SINH: hình dạng của sổ thật (một id cho cả lượt ghi) ----
const DUP = 'd-20260910T121327Z-6517';
const UNI = 'd-20260910T121400Z-9';
const row = (id, type, decision, stage = 'S1') => JSON.stringify({ id, type, stage, at: '2026-09-10T12:13:27Z', decision, impact: 'i' });
// descope ở vị trí 2: card đảo descope lên đầu, khoá phải theo thứ tự SỔ chứ không theo thứ tự HIỂN THỊ.
const LEDGER_G1 = [row(DUP, 'approach', 'chon A'), row(DUP, 'descope', 'KHONG lam B'), row(DUP, 'approach', 'chon C'), row(UNI, 'fix', 'sua D'), ''].join('\n');
const LEDGER_G2 = [
  row('d-s-1', 'approach', 'truoc seal'),
  JSON.stringify({ id: 'd-s-2', type: 'seal', gate: 1, at: '2026-09-10T13:00:00Z' }),
  row(DUP, 'fix', 'sua E', 'S4-r1'), row(DUP, 'fix', 'sua F', 'S4-r1'), row(DUP, 'revisit', 'xem G', 'S4-r1'), '',
].join('\n');
const wsG1 = plain => { const f = { ...G1(PROBE('findings')), 'decisions.jsonl': LEDGER_G1 }; if (plain) f['plain.json'] = JSON.stringify(plain); return mkWs('g', f); };
const wsG2 = plain => { const f = { ...G2(REVIEW2), 'decisions.jsonl': LEDGER_G2 }; if (plain) f['plain.json'] = JSON.stringify(plain); return mkWs('s', f); };
const plainArg = (root, slug) => ['--plain', path.join(root, '_acceptance', slug, 'plain.json')];

// ---- đọc VẬT: các dòng quyết định trên thẻ HTML ----
const g1Lines = html => {
  const m = html.match(/Quyết định &amp; trade-off<\/div>\s*<div class="grp gnot">([\s\S]*?)<\/div>/);
  if (!m) die('the Cong 1 khong co khoi "Quyet dinh & trade-off"');
  return [...m[1].matchAll(/<p class="li">(.*?)<\/p>/g)].map(x => x[1].replace('<b>KHÔNG làm:</b> ', ''));
};
const g2Lines = html => [...html.matchAll(/<p class="q">Treo-\d+ · (.*?)<\/p>/g)].map(x => x[1]);
// Chuẩn đo: mỗi dòng sổ ra MỘT dòng thẻ riêng — dòng thẻ lặp lại là dấu vết của lỗi.
const dupLine = lines => {
  const c = new Map();
  for (const l of lines) c.set(l, (c.get(l) || 0) + 1);
  const d = [...c].find(([, n]) => n > 1);
  return d ? `dong trung: "${d[0]}" x${d[1]}` : null;
};
// Overlay sinh BẰNG CODE từ chính --extract (round-trip writer→reader), mỗi câu mang chữ của đúng dòng nó dịch.
const overlayFrom = decs => ({ decisions_plain: decs.map(d => ({ id: d.key, p: 'DICH ' + d.decision })) });
const LEGACY = { decisions_plain: [{ id: DUP, p: 'CAU TRAN' }, { id: UNI, p: 'CAU CU' }] };
const LEGACY_G2 = { decisions_plain: [{ id: DUP, p: 'CAU TRAN' }] };

// ---- bản ĐỘT BIẾN: khôi phục lối tra cũ (id trần) ngay trong khối marker ----
const MARK = /\/\/ <<<DEC-PLAIN-KEY[\s\S]*?\/\/ DEC-PLAIN-KEY>>>/;
const NEW_LOOKUP = 'x.id === decKey(e)';
const OLD_LOOKUP = 'x.id === e.id';
const mutantGc = () => {
  const block = (SRC.match(MARK) || [])[0];
  if (!block) die('gate-card.js thieu khoi marker DEC-PLAIN-KEY');
  if (block.split(NEW_LOOKUP).length !== 2) die(`khoi DEC-PLAIN-KEY phai co dung MOT "${NEW_LOOKUP}"`);
  const md = mkdtempSync(path.join(tmpdir(), 'deckey-mut-'));
  cpSync(path.join(ROOT, 'scripts'), path.join(md, 'scripts'), { recursive: true });
  cpSync(path.join(ROOT, 'lib'), path.join(md, 'lib'), { recursive: true });
  const mg = path.join(md, 'scripts', 'gate-card.js');
  const mut = SRC.replace(block, block.replace(NEW_LOOKUP, OLD_LOOKUP));
  if (mut === SRC) die('dot bien khong doi duoc gate-card.js');
  writeFileSync(mg, mut);
  return mg;
};

check('DK01 --extract: moi dong so co khoa rieng; id duy nhat giu nguyen, id trung thanh id#k theo thu tu SO', () => {
  const j1 = extract(GC, wsG1(), 'g');
  eq(j1.decisions.map(d => d.key), [`${DUP}#1`, `${DUP}#2`, `${DUP}#3`, UNI], 'khoa Cong 1');
  eq(j1.decisions.map(d => d.id), [DUP, DUP, DUP, UNI], 'id goc phai giu nguyen trong extract');
  const j2 = extract(GC, wsG2(), 's');
  eq(j2.decisions_provisional.map(d => d.key), [`${DUP}#1`, `${DUP}#2`, `${DUP}#3`], 'khoa Treo Cong 2');
  eq(j2.decisions_approved.map(d => d.key), ['d-s-1'], 'khoa khoi da duyet');
});

check('DK02 Cong 1 round-trip: overlay theo khoa extract -> moi dong so hien DUNG cau cua no, khong dong nao lap', () => {
  const r = wsG1();
  const j = extract(GC, r, 'g');
  writeFileSync(path.join(r, '_acceptance', 'g', 'plain.json'), JSON.stringify(overlayFrom(j.decisions)));
  const lines = g1Lines(run(GC, r, 'g', plainArg(r, 'g')).stdout);
  eq([...lines].sort(), ['DICH KHONG lam B', 'DICH chon A', 'DICH chon C', 'DICH sua D'], 'dong quyet dinh Cong 1');
  if (dupLine(lines)) die(dupLine(lines));
});

check('DK03 Cong 1 doc-cu: overlay theo id TRAN cua id trung bi bo qua (in chu goc), id duy nhat van dich; stderr noi ro', () => {
  const r = wsG1(LEGACY);
  const out = run(GC, r, 'g', plainArg(r, 'g'));
  const lines = g1Lines(out.stdout);
  eq([...lines].sort(), ['CAU CU', 'KHONG lam B — i', 'chon A — i', 'chon C — i'], 'dong quyet dinh Cong 1 (doc-cu)');
  if (out.stdout.includes('CAU TRAN')) die('cau cua id trung van hien tren the');
  const want = `gate-card: decisions_plain id "${DUP}" trùng 3 dòng trong sổ — bỏ qua; dịch từng dòng bằng khoá ${DUP}#1…#3 lấy từ --extract`;
  if (!out.stderr.includes(want)) die(`stderr thieu thong diep ghim\n  got : ${out.stderr.trim()}\n  want: ${want}`);
});

check('DK04 Cong 2 Treo round-trip: ba dong chung id -> ba cau rieng, dung thu tu Treo-1..3', () => {
  const r = wsG2();
  const j = extract(GC, r, 's');
  writeFileSync(path.join(r, '_acceptance', 's', 'plain.json'), JSON.stringify(overlayFrom(j.decisions_provisional)));
  eq(g2Lines(run(GC, r, 's', plainArg(r, 's')).stdout), ['DICH sua E', 'DICH sua F', 'DICH xem G'], 'dong Treo');
});

check('DK05 Cong 2 doc-cu: overlay id tran cua id trung -> Treo in chu goc, ba dong khac nhau', () => {
  const r = wsG2(LEGACY_G2);
  eq(g2Lines(run(GC, r, 's', plainArg(r, 's')).stdout), ['sua E — i', 'sua F — i', 'xem G — i'], 'dong Treo (doc-cu)');
});

check('DK06 pha vat that: khoi phuc lookup cu (x.id === e.id) -> CUNG fixture doc-cu DO voi dung thong diep', () => {
  const mg = mutantGc();
  // đối chứng dương trên CÙNG workspace trước: bản thật im
  const r1 = wsG1(LEGACY);
  const ok1 = dupLine(g1Lines(run(GC, r1, 'g', plainArg(r1, 'g')).stdout));
  if (ok1 !== null) die('doi chung duong Cong 1 khong xanh: ' + ok1);
  eq(dupLine(g1Lines(run(mg, r1, 'g', plainArg(r1, 'g')).stdout)), 'dong trung: "CAU TRAN" x3', 'dot bien Cong 1');
  const r2 = wsG2(LEGACY_G2);
  const ok2 = dupLine(g2Lines(run(GC, r2, 's', plainArg(r2, 's')).stdout));
  if (ok2 !== null) die('doi chung duong Cong 2 khong xanh: ' + ok2);
  eq(dupLine(g2Lines(run(mg, r2, 's', plainArg(r2, 's')).stdout)), 'dong trung: "CAU TRAN" x3', 'dot bien Cong 2');
});

// ---- bên VIẾT: khuôn id của SKILL, chạy thật trong cùng một giây ----
const SKILL = readFileSync(path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
const recipeOf = t => {
  const m = t.match(/<!-- <<<DEC-ID-RECIPE -->\n```\n([^\n]+)\n```\n<!-- DEC-ID-RECIPE>>> -->/);
  if (!m) die('SKILL feature-loop thieu khoi marker DEC-ID-RECIPE (mot dong trong ```)');
  return m[1];
};
// Chạy NGUYÊN VĂN lệnh append của SKILL (chỉ thay <slug>) ba lần liền, dưới hai shell. `date` giả
// ghim đồng hồ — mọi dòng rơi vào CÙNG một giây, như lượt ghi của sổ thật. Không dựng lệnh ghi riêng
// cho test: review 11/09 bắt bản đầu chạy một printf tự viết, lệch nháy với lệnh SKILL thật.
const appendThree = (cmd, shell = 'bash') => {
  const d = mkdtempSync(path.join(tmpdir(), 'decid-'));
  mkdirSync(path.join(d, 'bin')); mkdirSync(path.join(d, '_acceptance', 'x'), { recursive: true });
  writeFileSync(path.join(d, 'bin', 'date'), '#!/bin/sh\necho 20260910T121327Z\n'); chmodSync(path.join(d, 'bin', 'date'), 0o755);
  const line = cmd.split('<slug>').join('x');
  const r = spawnSync(shell, ['-c', [line, line, line].join('\n')], { cwd: d, encoding: 'utf8', env: { ...process.env, PATH: path.join(d, 'bin') + ':' + process.env.PATH } });
  if (r.status !== 0) die(`lenh ghi so khong chay duoi ${shell}: ` + r.stderr);
  return readFileSync(path.join(d, '_acceptance', 'x', 'decisions.jsonl'), 'utf8').trim().split('\n').map(l => {
    try { return JSON.parse(l).id; } catch (_) { return die('dong so khong phai JSON: ' + l); }
  });
};
const idClash = ids => (new Set(ids).size === ids.length ? null : `id trung: ${ids.join(' ')}`);
const HAS_ZSH = spawnSync('zsh', ['-c', 'true']).status === 0;

check('DK07 lenh append SKILL (nguyen van): ba dong CUNG mot giay -> ba id khac nhau d-<UTC>-<n>, bash + zsh', () => {
  for (const sh of HAS_ZSH ? ['bash', 'zsh'] : ['bash']) {
    const ids = appendThree(recipeOf(SKILL), sh);
    eq(ids, ['d-20260910T121327Z-1', 'd-20260910T121327Z-2', 'd-20260910T121327Z-3'], `id sinh boi lenh SKILL (${sh})`);
  }
});

check('DK08 pha vat that ben viet: bo phan dem dong khoi lenh -> CUNG lenh ghi DO voi dung thong diep', () => {
  const recipe = recipeOf(SKILL);
  const mut = recipe.replace(/\$\(\( \$\(cat .*?\) \+ 1 \)\)/, '0');
  if (mut === recipe) die('dot bien khong cat duoc phan dem dong (lenh doi hinh dang?)');
  eq(idClash(appendThree(mut)), 'id trung: d-20260910T121327Z-0 d-20260910T121327Z-0 d-20260910T121327Z-0', 'dot bien ben viet');
});

// Overlay dị dạng (phần tử null / không phải mảng) KHÔNG được làm sập cả thẻ — thẻ in chữ gốc.
const GUARDED = 'decPlainList.find(x => x && x.id === decKey(e))';
check('DK09 overlay di dang (null trong mang, object thay mang) -> the van ra, in chu goc; bo guard -> sap', () => {
  const bad = [{ decisions_plain: [null, { id: UNI, p: 'CAU CU' }] }, { decisions_plain: { oops: true } }];
  const block = (SRC.match(MARK) || [])[0] || die('thieu khoi DEC-PLAIN-KEY');
  if (block.split(GUARDED).length !== 2) die(`khoi DEC-PLAIN-KEY phai co dung MOT "${GUARDED}"`);
  const md = mkdtempSync(path.join(tmpdir(), 'deckey-guard-'));
  cpSync(path.join(ROOT, 'scripts'), path.join(md, 'scripts'), { recursive: true });
  cpSync(path.join(ROOT, 'lib'), path.join(md, 'lib'), { recursive: true });
  const mg = path.join(md, 'scripts', 'gate-card.js');
  writeFileSync(mg, SRC.replace(block, block.replace(GUARDED, '(pl.decisions_plain || []).find(x => x.id === decKey(e))')));
  for (const pl of bad) {
    const r = wsG1(pl);
    const ok = run(GC, r, 'g', plainArg(r, 'g'));
    if (ok.status !== 0) die('ban that sap tren overlay di dang: ' + ok.stderr.split('\n')[0]);
    if (!g1Lines(ok.stdout).includes('chon A — i')) die('ban that khong in chu goc');
    const bd = run(mg, r, 'g', plainArg(r, 'g'));
    if (bd.status === 0 || !/TypeError/.test(bd.stderr)) die('bo guard ma khong sap voi TypeError — phep do khong phan biet: ' + JSON.stringify(pl));
  }
});

console.log(`\nResults: ${passed} passed, ${failed} failed (gate-card-dec-key)`);
process.exit(failed ? 1 : 0);
