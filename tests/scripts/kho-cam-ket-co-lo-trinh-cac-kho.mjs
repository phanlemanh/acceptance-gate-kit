// kho-cam-ket-co-lo-trinh-cac-kho.mjs — hồ sơ kho-cam-ket-co-lo-trinh, ca CK-6 = AC-6 (luật 26/09: sửa kit phải cân trên
// MỌI kho). Đo trên bản sao các kho THẬT của máy nên tệp không mang đuôi .test.mjs và không vào feature_loop.suite_keys.
// Dò KHO_GOC (mặc định ~/dev) lấy mọi thư mục có _acceptance/config.yaml; không dò được kho nào → thoát 2 nêu đường (mù,
// không xanh). Mỗi kho: `git archive HEAD` + `.claude/` đang có → thư mục tạm; ở mọi kho KHÔNG bật chặn: hook với bốn lệnh
// ghi cho stdout + stderr + mã giống bộ máy gốc (`git archive <goc-so>`), bộ đọc `--base HEAD` im, `--them-hang` thoát 1
// và cây giữ nguyên. Đường dẫn suy từ vị trí tệp này; không ghi vào kho thật nào.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync, cpSync, realpathSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const GOC = readFileSync(path.join(KIT, '_acceptance', 'kho-cam-ket-co-lo-trinh', 'goc-so'), 'utf8').trim();
const KHO_GOC = path.resolve(process.env.KHO_GOC || path.join(homedir(), 'dev'));
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'ck6-')));
const HOME = path.join(TMP, 'home'); mkdirSync(path.join(HOME, '.claude'), { recursive: true });
const LIB = createRequire(import.meta.url)(path.join(KIT, 'lib', 'chan-lo-trinh.cjs'));
let pass = 0; let fail = 0;
const ok = (id, m) => { pass += 1; console.log(`  PASS: ${id} — ${m}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };

writeFileSync(path.join(HOME, '.claude', 'settings.json'), JSON.stringify({ enabledPlugins: { [LIB.khoaBat()]: true } }));
const GOC_DIR = path.join(TMP, 'goc'); mkdirSync(GOC_DIR);
execFileSync('bash', ['-c', `git -C '${KIT}' archive ${GOC} hooks lib scripts .claude-plugin | tar -x -C '${GOC_DIR}'`], { maxBuffer: 1 << 30 });

function bam(goc) {
  const h = createHash('sha256'); const di = d => {
    for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.name === '.git') continue; const p = path.join(d, e.name);
      if (e.isDirectory()) di(p); else h.update(path.relative(goc, p) + '\0').update(readFileSync(p)).update('\0');
    }
  }; di(goc); return h.digest('hex');
}
function banSaoKho(src, ten) {
  const d = path.join(TMP, ten); mkdirSync(d);
  execFileSync('bash', ['-c', `git -C '${src}' archive HEAD | tar -x -C '${d}'`], { maxBuffer: 1 << 30 });
  for (const f of ['settings.json', 'settings.local.json']) {
    const p = path.join(src, '.claude', f); if (existsSync(p)) { mkdirSync(path.join(d, '.claude'), { recursive: true }); cpSync(p, path.join(d, '.claude', f)); }
  }
  execFileSync('git', ['-C', d, 'init', '-q']);
  return d;
}
const OPP = ma => ['---', 'schema_version: 1', 'slug: ck6-moi', ...(ma ? [`lo_trinh_ma: ${ma}`] : []), '---', '', '## Vấn đề', ''].join('\n');
function bonLenh(d) {
  const cu = readdirSync(path.join(d, '_acceptance'), { withFileTypes: true }).find(e => e.isDirectory() && existsSync(path.join(d, '_acceptance', e.name, 'opportunity.md')));
  return [
    { tool: 'Write', file: '_acceptance/ck6-moi/contract.md', content: '---\nstatus: draft\napproved_by:\n---\n' },
    { tool: 'Write', file: '_acceptance/ck6-moi/opportunity.md', content: OPP(null) },
    { tool: 'Write', file: '_acceptance/ck6-moi/opportunity.md', content: OPP('A1') },
    { tool: 'Edit', file: `_acceptance/${cu ? cu.name : 'ck6-cu'}/opportunity.md`, old: '---', moi: '---' },
  ];
}
function hook(kit, d, l) {
  const fp = path.join(d, l.file);
  const ti = l.tool === 'Edit' ? { file_path: fp, old_string: l.old, new_string: l.moi } : { file_path: fp, content: l.content };
  const e = { ...process.env, HOME }; delete e.ACCEPTANCE_GATE_BYPASS;
  const r = spawnSync(process.execPath, [path.join(kit, 'hooks', 'acceptance-evidence-gate.js')], { input: JSON.stringify({ tool_name: l.tool, tool_input: ti }), encoding: 'utf8', cwd: d, env: e });
  return `${r.status}\0${r.stdout}\0${r.stderr}`;
}

if (!existsSync(KHO_GOC)) { console.error(`không thấy thư mục kho: ${KHO_GOC}`); process.exit(2); }
const khoThat = readdirSync(KHO_GOC, { withFileTypes: true }).filter(e => e.isDirectory() && existsSync(path.join(KHO_GOC, e.name, '_acceptance', 'config.yaml')) && existsSync(path.join(KHO_GOC, e.name, '.git'))).map(e => e.name).sort();
if (!khoThat.length) { console.error(`không dò được kho nào có _acceptance/config.yaml dưới ${KHO_GOC} — mù, không xanh`); process.exit(2); }
console.log(`Kho đã đo (${khoThat.length}): ${khoThat.join(', ')}`);

const sai = []; const bat = []; let soLenh = 0;
for (const ten of khoThat) {
  let d;
  try { d = banSaoKho(path.join(KHO_GOC, ten), ten); } catch (e) { sai.push(`${ten}: không bung được (${String(e.message).split('\n')[0]})`); continue; }
  const tt = LIB.trangThaiChan(d);
  if (tt.bat || tt.loi) { bat.push(ten); continue; }
  for (const l of bonLenh(d)) {
    soLenh += 1;
    if (hook(KIT, d, l) !== hook(GOC_DIR, d, l)) sai.push(`${ten}: hook khác bộ máy gốc ở «${l.tool} ${l.file}»`);
  }
  const b = spawnSync(process.execPath, [path.join(KIT, 'lib', 'chan-lo-trinh.cjs'), '--root', d, '--base', 'HEAD'], { encoding: 'utf8', env: { ...process.env, HOME } });
  if (b.status !== 0 || b.stdout !== '') sai.push(`${ten}: bộ đọc --base HEAD thoát ${b.status}, stdout «${b.stdout.trim()}»`);
  const h = bam(d);
  const t = spawnSync(process.execPath, [path.join(KIT, 'scripts', 'lo-trinh.mjs'), '--root', d, '--them-hang', '--slug', 'thu-ck6'], { input: 'Một câu', encoding: 'utf8', env: { ...process.env, HOME } });
  if (t.status !== 1 || bam(d) !== h) sai.push(`${ten}: --them-hang thoát ${t.status}, cây ${bam(d) === h ? 'giữ' : 'ĐỔI'} ${t.stderr.trim()}`);
}
const khong = khoThat.length - bat.length;
if (khong < 1) sai.push('không còn kho nào để đo phía không-bật — mù, không xanh');
if (sai.length) bad('CK-6', sai.join(' ; '));
else ok('CK-6', `${khong} kho không bật: ${soLenh} lệnh hook giống từng byte bộ máy gốc, bộ đọc im, --them-hang thoát 1, 0 byte`);
console.log(`  đã đo ${khoThat.length} kho (bật: ${bat.length}${bat.length ? ` — ${bat.join(', ')}` : ''})`);

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (kho-cam-ket-co-lo-trinh-cac-kho)`);
process.exit(fail ? 1 : 0);
