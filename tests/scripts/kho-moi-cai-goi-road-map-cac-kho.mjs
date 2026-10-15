// kho-moi-cai-goi-road-map-cac-kho.mjs — hồ sơ kho-moi-cai-goi-road-map, ca KM-9 = AC-9 (luật 26/09: sửa kit phải cân trên
// MỌI kho). Đo trên bản sao các kho THẬT của máy nên tệp không mang đuôi .test.mjs và không vào feature_loop.suite_keys.
// Dò KHO_GOC (mặc định ~/dev) lấy mọi thư mục có _acceptance/config.yaml; không dò được kho nào → thoát 2 nêu đường (mù,
// không xanh). Mỗi kho: `git archive HEAD` + `.claude/` đang có → thư mục tạm, chạy lệnh rút NGUYÊN VĂN từ khối
// INIT-LO-TRINH. Đường dẫn suy từ vị trí tệp này; không ghi vào kho thật nào.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync, cpSync, realpathSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const KHO_GOC = path.resolve(process.env.KHO_GOC || path.join(homedir(), 'dev'));
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'km9-')));
const HOME = path.join(TMP, 'home'); mkdirSync(path.join(HOME, '.claude'), { recursive: true });
const CHUA_CAI = 'kho chưa cài road-map ở phạm vi kho — không tạo lộ trình';
let pass = 0; let fail = 0;
const ok = (id, m) => { pass += 1; console.log(`  PASS: ${id} — ${m}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };

const khoaBat = (() => { const j = JSON.parse(readFileSync(path.join(KIT, '.claude-plugin', 'marketplace.json'), 'utf8')); return `road-map@${j.name}`; })();
writeFileSync(path.join(HOME, '.claude', 'settings.json'), JSON.stringify({ enabledPlugins: { [khoaBat]: true } }));
const lenh = (() => {
  const t = readFileSync(path.join(KIT, 'commands', 'acceptance-init.md'), 'utf8');
  const m = t.match(/<!-- <<<INIT-LO-TRINH -->\n([\s\S]*?)<!-- INIT-LO-TRINH>>> -->/);
  const d = m ? m[1].split('\n').map(x => x.trim()).filter(x => x.startsWith('node "${CLAUDE_PLUGIN_ROOT}/scripts/lo-trinh-khoi-tao.mjs"')) : [];
  if (d.length !== 1) { console.error(`khối INIT-LO-TRINH có ${d.length} dòng lệnh`); process.exit(2); }
  return d[0].split('${CLAUDE_PLUGIN_ROOT}').join(KIT);
})();
const chay = goc => spawnSync('bash', ['-c', lenh.split('<path>').join(`'${goc}'`)], { encoding: 'utf8', env: { ...process.env, HOME }, cwd: goc });
function bam(goc, bo = []) {
  const h = createHash('sha256'); const di = d => {
    for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.name === '.git') continue; const p = path.join(d, e.name); const r = path.relative(goc, p);
      if (bo.includes(r)) continue;
      if (e.isDirectory()) di(p); else h.update(r + '\0').update(readFileSync(p)).update('\0');
    }
  }; di(goc); return h.digest('hex');
}
function banSaoKho(src, ten) {
  const d = path.join(TMP, ten); mkdirSync(d);
  execFileSync('bash', ['-c', `git -C '${src}' archive HEAD | tar -x -C '${d}'`], { maxBuffer: 1 << 30 });
  if (existsSync(path.join(src, '.claude'))) for (const f of ['settings.json', 'settings.local.json']) {
    const p = path.join(src, '.claude', f); if (existsSync(p)) { mkdirSync(path.join(d, '.claude'), { recursive: true }); cpSync(p, path.join(d, '.claude', f)); }
  }
  execFileSync('git', ['-C', d, 'init', '-q']);
  return d;
}

if (!existsSync(KHO_GOC)) { console.error(`không thấy thư mục kho: ${KHO_GOC}`); process.exit(2); }
const khoThat = readdirSync(KHO_GOC, { withFileTypes: true }).filter(e => e.isDirectory() && existsSync(path.join(KHO_GOC, e.name, '_acceptance', 'config.yaml')) && existsSync(path.join(KHO_GOC, e.name, '.git'))).map(e => e.name).sort();
if (!khoThat.length) { console.error(`không dò được kho nào có _acceptance/config.yaml dưới ${KHO_GOC} — mù, không xanh`); process.exit(2); }
console.log(`Kho đã đo (${khoThat.length}): ${khoThat.join(', ')}`);

const sai = []; const batSan = [];
for (const ten of khoThat) {
  let d;
  try { d = banSaoKho(path.join(KHO_GOC, ten), ten); } catch (e) { sai.push(`${ten}: không bung được (${String(e.message).split('\n')[0]})`); continue; }
  const s = (() => { try { return JSON.parse(readFileSync(path.join(d, '.claude', 'settings.json'), 'utf8')); } catch { return null; } })();
  if (s && s.enabledPlugins && s.enabledPlugins[khoaBat] === true) { batSan.push(ten); continue; }
  const h = bam(d); const r = chay(d);
  if (r.status !== 0 || !r.stdout.includes(CHUA_CAI) || bam(d) !== h) sai.push(`${ten}: thoát ${r.status}, cây ${bam(d) === h ? 'giữ' : 'ĐỔI'}, stdout «${r.stdout.trim()}» ${r.stderr.trim()}`);
}
if (batSan.length) console.log(`  (kho đã bật road-map ở phạm vi kho — không thuộc ca «không bật»: ${batSan.join(', ')})`);
if (sai.length) bad('KM-9', sai.join(' ; ')); else ok('KM-9', `${khoThat.length - batSan.length} kho không bật road-map: mỗi kho thoát 0, đúng dòng «${CHUA_CAI}», 0 byte`);

// KM-9-kit — kho đã có lộ trình (cây kit) mà cài thêm road-map: khởi tạo không đổi gì ngoài settings.
try {
  const d = banSaoKho(KIT, 'kit-cai-them');
  const p = path.join(d, '.claude', 'settings.json'); mkdirSync(path.dirname(p), { recursive: true });
  const s = existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {}; s.enabledPlugins = { ...(s.enabledPlugins || {}), [khoaBat]: true };
  writeFileSync(p, JSON.stringify(s, null, 2));
  const h = bam(d, ['.claude/settings.json']); const r = chay(d);
  if (r.status === 0 && bam(d, ['.claude/settings.json']) === h) ok('KM-9-kit', `cây kit cài thêm road-map: thoát 0, 0 byte ngoài .claude/settings.json («${r.stdout.trim().split('\n')[0]}»)`);
  else bad('KM-9-kit', `thoát ${r.status}, cây ${bam(d, ['.claude/settings.json']) === h ? 'giữ' : 'ĐỔI'}: ${r.stdout} ${r.stderr}`);
} catch (e) { bad('KM-9-kit', String(e.stack || e).split('\n').slice(0, 3).join(' | ')); }

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (kho-moi-cai-goi-road-map-cac-kho)`);
process.exit(fail ? 1 : 0);
